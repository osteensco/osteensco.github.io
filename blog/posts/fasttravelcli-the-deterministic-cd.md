# fastTravelCLI: a deterministic cd replacement

## The problem with cd

`cd` works fine until your projects start spreading out. You end up typing the same long paths over and over
to get between repos, config directories, deployment paths, whatever. Tab completion helps but you're still
walking through the tree one segment at a time to get somewhere you already know you're going, and this is assuming 
you set up your shell for completions in the first place.

When I started working in the terminal more, I found myself wanting to just say `auth` and land in `/home/me/work/company/services/auth`.
A short key that always goes to the right place.

## Trying zoxide

`zoxide` was the first thing I found and tried when looking for a `cd` replacement. 
It learns from your `cd` history and lets you jump with a fragment —
`z auth` takes you to the directory you visit most matching `auth`. 
It's a good tool and it handled the immediate problem very well.

But I kept running into the heuristic. The ranking changes as your habits change. A directory you haven't
visited in a while drops down the list. A new project with a similar name starts winning. You type the same
thing and end up somewhere different than last week, and figuring out why means reasoning about your own
usage patterns. 

That bugged me in a few specific spots:

- Scripting. A Makefile, a CI helper, a setup script for a new machine — I want `ft proj` to mean the
  same thing on every box. Frequency-ranked tools give different answers depending on what machine
  you're using.
- Pairing. I don't want to inherit someone else's navigation habits. They've been `cd`'ing into
  `proj-old` more than I have? Different result.
- Debugging. When something goes to the wrong place, I want to be able to point at why. With a learned
  tool there isn't always a clear answer.

Looking through the issues and the docs I found ways to adjust my workflow to adjust to these 
edge cases. At the end of the day I just didn't like the experience of sometimes, inconsitently, having 
to adjust on the fly. I realized I didn't really want something smarter, I just wanted something predictable and consistent.

## Bookmarks as the core idea

So I started building my own thing. It's pretty simple — a hashmap from short keys to directories.
You set them, they stay put until you change them.

```
# from inside the directory I want to bookmark
ft -set proj

# now `ft proj` always lands here
ft proj
```

Consistent, straightforward, and pragmatic. This fit my use case.


## Path evaluation

When you type `ft proj`, the tool needs to turn that string into an actual directory. The simplest case is a
direct key lookup — `proj` is in the bookmark map, so you get back `/home/me/work/company/services/auth` and
that's it.

But keys also work as path prefixes. If you type `ft proj/cmd/foo`, the first segment gets resolved as a
bookmark and the rest gets appended:

```bash
ft proj/cmd/foo
# "proj" resolves to /home/me/work/company/services/auth

# result: 
/home/me/work/company/services/auth/cmd/foo
```

The resolved path gets validated against the filesystem — if the resulting directory doesn't exist, you get an
error immediately rather than silently landing somewhere wrong.

This means you don't need a bookmark for every subdirectory. One key at a project root gives you deterministic
access to everything under it.

Of course fastTravelCLI is supposed to be a cd replacement, so `ft` doesn't only handle bookmarks. It also supports CDPATH lookups and relative paths.
All of these are effectively evaluated to their aboslute paths through fastTravelCLI.

## The cascade

Another issue I ran into with zoxide is that it didn't respect CDPATH, which seems bizare for a 'better cd' tool. 
For fastTravelCLI I made sure to address this, and quickly found that conflicts could arise from bookmarks, relative paths, and CDPATH.

Consider we are in '~/myprojects/opensource' and we have the following:
```bash
~/myprojects/opensource/myproj # relative path myproj
~/myprojects/work/myproj # CDPATH directory myproj
~/otherprojects/specialstuff/myspecialproject # ft key 'myproj'
```
We need a deterministic way to resolve this conflict. This is where the cascade system comes in.

Specific bookPath resolution tries a few strategies in order and the first match wins. The default order is `bookmark → CDPATH → relative`.
You can reorder it in `ft -settings`, which is a small bubbletea TUI.

```bash
ft mydir
# 1. is "mydir" a bookmark key? if yes, go there
# 2. otherwise, check CDPATH
# 3. otherwise, treat it as a relative path
```

Bookmark keys also work as path prefixes. `ft myproj/cmd/foo` resolves `proj` to its bookmarked directory
and treats `cmd/foo` as a sub-path under it. The cascade only fires on the leading segment.

## What else it does

A few other things I ended up adding as my ideal experience sort of evolved.

### Directory name updates
**`ft -edit /old/path /new/dirname`.** A directory gets renamed on disk and now every bookmark pointing
under it is stale. `-edit` walks the bookmark map and updates every key whose value contained the old
prefix. The comment on `editPath` in the source explains why naive substring replacement doesn't work:

> i.e. ft -edit something different
> This would update mydir/something/project1 and mydir/something/project2
> but erroneously updates myotherdir/important_project/something

So the input gets evaluated to its absolute path first, and the replacement matches on the absolute prefix.

### History stack
**`ft [` and `ft ]`.** Backward and forward through this session's directory history, similar to a browser history.
You can also view your entire history with `ft -hist`.

### Determine if cwd is a bookmark
**`ft -is`.** Prints the key (if any) bound to the current directory. Useful when you've gotten somewhere
through a chain of jumps and want to know what to call it later.

### Fuzzy find directories
**`ft -f [key or path]` and `ft -fa [key or path]`.** Fuzzy-pick from the immediate children of an evaluated path, or its full subtree. Wraps
fzf and tree. The "all" variant excludes the obvious noise — `node_modules`, `.venv`, `.git`, build
outputs — at the find level so the picker stays fast in deeper trees. Excluding the `[key or path]` argument runs the finder against the cwd.
You can also fuzzy find against your saved keys by using no flags or args i.e. `ft`.

### Easy settings adjustments
**`ft -settings`.** Interactive TUI for reordering the cascade. Not a lot of settings yet, but the ones
that exist are picked interactively instead of editing JSON.

### Scriptability
**Piped input.** `echo 'work=/srv/work' | ft -set` and `cat bookmarks.txt | ft -set`. Useful for syncing
bookmarks via dotfiles. The piped input goes through a quote-aware splitter so paths with spaces survive.

## The tradeoff

You have to bookmark things. There's no learning loop and no zero-config magic. If you just want to minimize key strokes 
as much as possible, zoxide is less friction for most use cases (especially if you don't have naming conflicts).

For me bookmarks, along with other features such as the fuzzy finders and history stack, were a better experience. 
The predictability is worth it every time I script something or sit down at a different machine. I found the additional command to set 
a bookmark wasn't much more of a lift from having to visit a directory with zoxide at least once so it's database picks it up.

Plus I got to learn alot along the way with building fastTravelCLI. 
