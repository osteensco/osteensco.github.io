# Switchboard: orchestration-as-code

## The problem with managed orchestration

If you've built anything non-trivial on AWS or GCP, you've probably reached for an orchestration service at some point.
Step Functions, Cloud Workflows, Durable Functions — they all do roughly the same job.
Define a state machine, point it at some Lambdas or Cloud Functions, let the cloud provider deal with retries, fanout, state persistence, all that.

It works but there's a few things that bother me about it:

- **The DSL.** You're writing JSON or YAML or some proprietary thing to describe control flow.
  Conditionals, parallel fanout, error handlers — all things that already exist in the language you're already using,
  but now expressed as nested config. Debugging a malformed JSONPath expression is its own special kind of fun.
- **The cost.** Step Functions charges per state transition. That doesn't lead the marketing copy, but if your workflow has fifty
  steps and runs a million times a month, you notice.
- **The lock-in.** I've worked in both AWS and GCP and the workflow definitions don't move between them at all.
  If a project needs to migrate to a new cloud provider, the orchestration gets rewritten from scratch.

## The idea

Switchboard is event-driven orchestration that you write as code. Not as YAML, not as a JSON state machine —
just a function in your language of choice that calls into an SDK.

Here's the orchestration logic for a small Python workflow:

```python
from switchboard import InitWorkflow, Call, ParallelCall, Done, DB, Cloud, GetCache

def workflow_handler(context):
    db = DB(Cloud.AWS)

    InitWorkflow(
        cloud=Cloud.AWS,
        name="my_first_workflow",
        db=db,
        context=context
    )

    data = GetCache()

    Call("process_step", "process_data_task")

    if data["some_bool_field"]:
        ParallelCall(
            "fanout_step",
            ("generate_report_task", 0),
            ("another_task", 0),
        )

    return Done()
```

That's it. The control flow is just Python. You can `if` your way into branches,
you can pull data out of the cache to drive decisions, you can call out to whatever you need from inside your tasks.

## How it actually works

The architecture is just standard cloud primitives wired together:

```
Trigger ─► Invocation Queue ◄─┐
                 ▼            │
              Workflow        │
                 ▼            │
           Executor Queue     │
                 ▼            │
              Executor        │
                 ▼            │
               Task           │
                 ▼            │
             Response ────────┘
```

The Workflow function and the Executor are both serverless functions. The two queues decouple them.
There's a database (DynamoDB on AWS) tracking the state of every run.

The interesting part is what happens when the Workflow function runs.
It runs through the entire orchestration code top to bottom on every invocation.
Each time, it reads its current state from the DB, figures out which step it's on, and either:

1. Enqueues the next task, if it's ready to make progress.
2. Passes through, if it's still waiting on a previous task to come back.

The "passes through" part is the bit I had to think about for a while.
The user's orchestration function still has to run to the end — there's no way to bail out early
without making the user write `return` everywhere — but I also don't want subsequent `Call(...)` invocations to actually do anything
prematurely in the workflow.

The way switchboard handles this is a small `WaitStatus` class with the same shape as `Workflow` —
`call`, `parallel_call`, `done` — but every method just returns itself.
Once the workflow has enqueued whatever it's going to enqueue this invocation, the global workflow object gets reassigned
to a `WaitStatus`, and the rest of the user's `Call(...)` and `ParallelCall(...)` lines are quietly absorbed. The function finishes,
but only the step that was actually due to run got run.

This is what makes branching free. The user writes `if data["x"]: Call("a") else: Call("b")` and it just works.
The Python interpreter handles the branching. Switchboard only intercepts the calls it cares about.
This enables the user to write their orchestration logic as code. Not like Airflow with a special syntax that's technically 
code, but actual logic primitives of the language.

## The cloud-agnostic part

The orchestration code shouldn't change when you move clouds. Only the wiring should.

So the SDK has a small abstract interface for the database — `read`, `write`, `increment_id`, `get_endpoint` —
and a thin layer for queue pushes. The `DB` class takes a `Cloud` enum and dispatches to the right concrete implementation:

```python
class DB():
    def __init__(self, cloud: Cloud, custom_interface: DBInterface | None = None) -> None:
        def _connect(cloud: Cloud) -> DBInterface:
            match cloud:
                case Cloud.AWS:
                    conn = AWS_db_connect()
                    return AWS_DataInterface(conn)
                case Cloud.CUSTOM:
                    assert custom_interface
                    return custom_interface
                case _:
                    raise UnsupportedCloud(...)
        ...
```

The AWS implementation uses DynamoDB and SQS. GCP and Azure are sketched out but not implemented yet.

The `Cloud.CUSTOM` path is there so you can drop in your own implementation against whatever you want.
Plug in Redis. Plug in Postgres. Plug in a flat file if you really need to. It's an ABC, you implement four methods,
you bring your own connection. The abstraction had to exist anyway to support multiple clouds, so giving it back to the user was 
an easy win for anyone who wanted to take the framework and run with it.

## Why it's not just "Step Functions but worse"

I get this question. The honest answer is that in a few ways it is worse — cloud providers throw real engineering at making
their orchestration services bulletproof, and I'm just a guy with an opinonated idea.

Where I think it wins is the boring stuff:

- Your code is your code. You don't have a YAML file and a Python file describing the same thing in two different ways. This also makes it easy to 
 migrate to other cloud providers.
- You're paying queue + KV + serverless prices, not state-transition prices. For workflows with a lot of small steps that can add up.
- You can unit test the orchestration. It's just Python. Mock the DB interface, hand it a context, assert what got enqueued.

The thing I keep coming back to is that orchestration is mostly trivial logic — "if A then B else C, then D and E in parallel, then done."
A general-purpose programming language is a really good tool for expressing that.
Pulling that logic out into a separate config DSL has always felt like a step in the wrong direction to me.

## Where it's at

The Python SDK is the most mature part. Go and TypeScript SDKs are on the roadmap.
There's a CLI/TUI for setting up resources, registering workflows, and viewing logs — also in active development.
AWS is supported end-to-end and there's a working demo in `examples/aws-demo`. GCP and Azure interfaces are stubs.

A few things I want to nail down before I'd recommend it for anything serious:

- A more thorough idempotency story. Right now it leans on dedup checks against the persisted state, which works but I want to test it harder.
- Better observability. Logs are there, they're just verbose and not yet queryable through the CLI. The vision for the end state is a great observability experience.
- A way to author and test workflows locally without standing up real cloud resources.

The code is at [github.com/osteensco/switchboard](https://github.com/osteensco/switchboard) if you want to poke at it. 
Issues and feedback welcome — especially if you've used something in this category and have opinions on what it got right or wrong. 
I build these sorts of things for the fun and learning opportunity.
