# Implementation Backlog (Priority Ordered)

## Completed Baseline Upgrades
- `Shell.*` skill integrated (`Run`, `RunJson`, `Exists`) with AccessPolicy checks.
- `LLM.*` multimodal router integrated (`SelectModel`, `BuildPayload`, `Chat`, `Complete`).
- `Vision.*` facade integrated (`SelectEngine`, `Analyze`, `Describe`, `OCR`, `Detect`).
- `parallel.mode=process` implemented (process-based workers with bounded concurrency + deterministic result merge).
- `HTTP.*` + `GraphQL.*` integrated for API connectivity.
- `Messaging.*` integrated (Telegram Bot API + WhatsApp Cloud API).
- `WS.*` integrated (WebSocket client facade over thqby `WebSocket.ahk`).
- Runtime gateway and OpenAPI contract extended for `Shell.*`, `LLM.*`, and `Vision.*`.

## P0 - Unified CLI
- Status: delivered baseline.
- Implemented:
  - `run` playbook
  - `action` invoke one action with JSON params
  - connector aliases (`telegram`, `whatsapp`)
  - machine-readable output (JSON) + deterministic exit codes
- Remaining:
  - planner/operator aliases
  - richer diagnostics/report flags

## P0 - Messaging Inbound + State
- Telegram:
  - Status: baseline delivered (`GetUpdatesCheckpointed`, `ParseUpdates`).
  - Remaining: map inbound commands to playbooks/actions (router dispatch policy).
- WhatsApp:
  - Pending: webhook receiver adapter (external or embedded) + event normalization.
- Optional state store:
  - Pending: Redis adapter (pub/sub + KV) for conversation state.

## P0 - Vision Local Adapter Hardening
- Package local YOLO adapter script contract (`script` + JSON schema output).
- Add project template for deterministic YOLO invocation.
- Add regression playbook for `Vision.Detect` in local mode.

## P1 - Parallel Worker Hardening
- Add stress tests for process workers (timeouts, fail_fast, result collection).
- Add cancellation semantics and step-level timeouts.
- Add optional context merge strategies (explicit allowlist of keys).

## P1 - Planner Layer
- Introduce planning module to synthesize modular playbook trees.
- Keep plan generation auditable via generated artifacts.

## P2 - Telemetry and Benchmarking
- Aggregate runtime metrics to `playbooks/output/metrics.json`.
- Add parity report generation vs OpenClaw capability matrix.
