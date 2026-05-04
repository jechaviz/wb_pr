# WAIBA Capability Inventory (Current State)

## Core Runtime
- Modular YAML execution with nested `playbook` steps.
- Middleware pipeline (logging, timing, retry, error boundary).
- Parallel execution:
  - deterministic sequential fallback (array form)
  - process-based workers with bounded concurrency (object form)

## Skills Available
- Browser/CDP automation (`Browser.*`, `CDP.*`).
- Filesystem and governance (`FS.*`, `Framework.*`).
- HTTP + API connectors (`HTTP.*`, `GraphQL.*`, `Messaging.*`).
- Runtime shell actions with AccessPolicy (`Shell.*`).
- Multimodal LLM routing (`LLM.*`) with text/vision model selection.
- Vision facade (`Vision.*`) for describe/ocr/detect with optional YOLO adapter.
- WebSocket client (`WS.*`).
- Domain compatibility layer (`Udemy.*`).

## CLI and Operator UX
- Unified CLI entrypoint (`waiba.ahk`) with subcommands:
  - `run` / `action`
  - `telegram send|get-me|updates|poll|parse`
  - `whatsapp send`
- Deterministic JSON output and exit codes for automation chaining.

## Messaging Inbound Baseline
- Telegram inbound parser (`Messaging.Telegram.ParseUpdates`) for command extraction.
- Checkpoint-ready long-poll action (`Messaging.Telegram.GetUpdatesCheckpointed`) for resumable update fetch.
- Supports command prefix filtering and structured command payload extraction.

## Safety and Governance
- AccessPolicy enforcement on read/write operations.
- Project-level PRD/SDD/TASK_STATUS lifecycle support.
- Growth tracking via `FRAMEWORK_GROWTH.md`.

## Current Constraints
- Local YOLO adapter still depends on project-provided script/command wiring.
- Process-parallel tasks run with a snapshot of context; workers do not mutate parent context directly.
