# WAIBA vs OpenClaw Gap Matrix

| Capability | OpenClaw Baseline | WAIBA Current | Gap | Priority |
|---|---|---|---|---|
| Declarative modular workflows | Strong | Strong | None | Low |
| Browser/CDP automation | Strong | Strong | None | Low |
| Native shell command skill in runtime | Strong | Strong | None | Low |
| HTTP / API client | Strong | Strong (`HTTP.*`) | None | Low |
| GraphQL client | Strong | Strong (`GraphQL.*`) | None | Low |
| Multimodal model routing (text vs vision) | Strong | Strong (`LLM.*`) | None | Low |
| Integrated vision/OCR pipeline | Strong | Medium (`Vision.*` facade delivered) | Harden local YOLO adapter packaging | Medium |
| True parallel task workers | Medium | Strong (process-based workers) | Context merge + cancellation semantics | Medium |
| Messaging connectors (Telegram/WhatsApp) | Strong | Medium-Strong (`Messaging.*` + Telegram checkpoint poll/parser) | WhatsApp inbound webhook + conversation state persistence | Medium |
| WebSocket client | Strong | Medium (`WS.*`) | Reliability/stress tests + reconnect strategy | Medium |
| Unified CLI (subcommands) | Strong | Strong (`run`, `action`, `telegram`, `whatsapp`) | Add planner/ops aliases and richer diagnostics | Medium |
| Built-in long-horizon planner | Strong | Partial (playbook-driven) | Planner layer | Medium |
| Recovery/self-healing selectors | Strong | Partial | Heuristic layer | Medium |
| Unified telemetry dashboard | Strong | Partial (logs only) | Metrics aggregation | Medium |

## Immediate Priority Order
1. Messaging inbound parity completion (WhatsApp webhook + conversation state store).
2. Planner layer to convert goals into modular playbook trees.
3. Harden local YOLO adapter packaging for `Vision.Detect`.
4. Telemetry layer for parity benchmarking dashboards.
