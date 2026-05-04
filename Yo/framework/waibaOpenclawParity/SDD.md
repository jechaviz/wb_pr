# SDD - waibaOpenclawParity

## 1. Architecture Summary
- Runtime: WAIBA V3 (`OrchestratorV3.ahk`)
- Control model: root playbook delegates to modular sub-playbooks
- Layering: `core` + `playbook` + `actions` + `skills`

## 2. Project Structure
- `playbook.yaml`: root parity program orchestrator
- `playbook_test.yaml`: smoke run variant
- `playbooks/bootstrap/*`: docs and runtime setup
- `playbooks/baseline/*`: inventory and gap matrix generation
- `playbooks/roadmap/*`: 90 day plan generation
- `playbooks/implementation/*`: prioritized implementation backlog
- `playbooks/output/*`: generated parity artifacts

## 3. Execution Flow
1. Bootstrap governance artifacts and growth log.
2. Build current capability inventory.
3. Build OpenClaw vs WAIBA gap matrix.
4. Build roadmap and implementation backlog.
5. Mark checkpoint completion with artifact references.

## 4. Skill Strategy
- Prefer generic skills:
  - `FS.*`
  - `Framework.*`
  - `CDP.*` and `Browser.*` when web execution is needed.
- Keep domain-specific skills only for compatibility layers.

## 5. Planned Framework Extensions
- Delivered: `Shell.*` for controlled command execution with policy guardrails.
- Delivered: `LLM.*` multimodal router for text/vision model selection.
- Delivered: `Vision.*` facade for OCR/describe/detect workflows.
- Delivered: messaging inbound baseline (`Messaging.Telegram.GetUpdatesCheckpointed`, `Messaging.Telegram.ParseUpdates`).
- Delivered: CLI connector subcommands (`waiba telegram ...`, `waiba whatsapp ...`).
- Planned hardening: local YOLO adapter packaging and deterministic JSON schema.
- Spec extension proposal: step-level timeout/cancel semantics.
- Spec extension proposal: richer deterministic parallel worker model.

## 6. Reliability and Safety
- Keep explicit retry and error-boundary behavior.
- Enforce AccessPolicy for filesystem and execution touchpoints.
- Keep generated outputs separated from framework source code.

## 7. Definition of Done
- Baseline documents are generated and reviewed.
- Top-priority gaps are converted to backlog items.
- Next implementation sprint can start without additional discovery.


## Completion Record

- task: WAIBA >= OpenClaw parity program (test)
- status: completed
- completed_at: 2026-02-12 10:35:20
