# Learnings from building fastTravelCLI: Teaching a binary to cd

When you run a binary from your shell, it runs in a child process. The child has its own working directory,
separate from the parent's. When the binary exits, the parent shell is exactly where it started.

`cd` works because it's a shell builtin — it modifies the shell's own state.
A standalone binary can't do that.

So a navigation tool that ships as a binary needs some other way to move the parent shell. fastTravelCLI is
one of these tools, and I spent a good chunk of time trying to figure out how a binary could safely alter the state of it's 
parent process.

## Things I tried first

My first (wrong) instinct was `os.Chdir` from inside the binary. This moves the child's cwd, which dies with the child.
Completely useless for the parent.

It seemed obvious that I needed to wrap my program in some sort of shell script and running something like `eval $(ft ...)`. 
This technically works, but if anything goes wrong any error message the binary prints becomes broken eval input, and the 
shell complains about *that* instead of the actual error. Debugging it becomes a pain.

## What I went with

`ft` is not the binary. `ft` is a shell function defined in `ftmain.sh`. The function calls the binary,
captures its stdout, and runs `pushd` (or `popd`, or an fzf handler) itself, in the parent shell.

Later on after I had my first implementation of this approach, I looked into how zoxide handled the parent-child process issue. Interestingly 
enough they take a similar approach as to what I landed on.

The binary just prints a path or a special token. The shell function basically acts like a handler and decides what to do with it.

```bash
ft() {

    # output cache
    local temp_output=$(mktemp)

    # run fastTravelCLI's binary and capture output
    "$FT_EXE_PATH" "$@" | tee "$temp_output"
    # truncate any irrelevant output
    local output="$(tail -n 1 "$temp_output")"
    rm "$temp_output"

    # handle base functionality (simple navigation)
    if [[ -d "$output" || "$output" == ".." || "$output" == "-" ]]; then
        ft__upperStack=()
        pushd "$output" > /dev/null

    # handle history navigation forwards
    elif [[ "$output" == "]" ]]; then
        if [ ${#ft__upperStack[@]} -eq 0 ]; then
            echo Already at head of history stack.
            return 0
        fi
        local p="${ft__upperStack[-1]}"
        ft__popup
        pushd "$p" > /dev/null

    # handle history navigation backwards
    elif [[ "$output" == "[" ]]; then
        local lowerStackLen=$(dirs -v | awk '{print $1}' | sort -n | tail -1)
        if [ "$lowerStackLen" -eq 0 ]; then
            echo Already at tail of history stack.
            return 0
        fi
        local p=$(pwd)
        ft__pushup "${p}"
        popd > /dev/null

    # handle fzf for history stack
    elif [[ "$output" == "hist" ]]; then
        ft__handle_fzf_hist

    # handle fzf for bookmarks
    elif [[ "$output" == "fzf" ]]; then
        ft__handle_fzf_bookmarks

    # handle fzf for dirs in current project
    else
        ft__handle_fzf_dirs "$output"
    fi
}
```

The binary returns a string, the function dispatches on it. Because the function
is *defined in the shell*, `pushd` happens in the shell that called `ft`.

A nice bonus is that the binary doesn't mutate the filesystem to navigate. It computes a path and prints
it. That makes the navigation logic easy to test — feed it inputs, check what it prints. No fixtures,
no fake shell.

## Session history is a shell-side concept

The binary doesn't have to know about the stack implementation. It just knows the user typed `[` or `]` and prints those tokens straight back.

Forward and backward directory history navigation (`ft [` and `ft ]`) live in two different stacks. We utilize the directory stack, but that alone is incomplete.
If you want to put a directory that was popped off the stack back on, you need to track what's been popped off - you need an additional stack (`ft__upperStack`).
The user's cwd effectively sits between these two stacks.

## Small things that took longer than they should have - some nuanced learnings

### Capturing the binary's output without swallowing it. 
`$(ft ...)` eats stdout, which means the user
sees nothing of what the binary printed. The wrapper uses `tee` to a tempfile and then `tail -n 1` to
grab the last line. Not pretty, but it gives the function the path it needs while still letting the user
see normal output instead of flooding stdout.

### `pushd` instead of `cd`. 
Directory history piggybacks on the shell's own dir stack. `[` falls back
to `popd`, `]` re-pushes from `ft__upperStack`. This was cheap to implement but worth checking before
relying on it, because `cd -` and `popd` don't compose the way they look like they should.

### Tilde expansion before pushing onto the upper stack. 
From the `ft__pushup` function:

```bash
ft__pushup() {
    local path="$1"
    path="${path/#\~/$HOME}"
    ft__upperStack+=("$path")
}
```

Without that substitution, the same physical directory shows up on the stack as both `~/work` and
`/home/user/work`, depending on how it got there, and equality breaks.

### Quote-aware splitting for piped input. 
`echo 'docs=/path with spaces' | ft -set` is the obvious thing to want, and naive splitting 
drops the spaces. `splitWords` in `ft/helpers.go` handles it.

