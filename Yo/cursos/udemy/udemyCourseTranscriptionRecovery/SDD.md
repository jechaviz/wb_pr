# SDD - udemyCourseTranscriptionRecovery

## 1. Architecture Summary
- Runtime: WAIBA src (V3)
- Execution model: YAML playbook interpreted by `OrchestratorV3.ahk`
- Core layers: `core`, `playbook`, `actions`, `skills`

## 2. Project Structure
- `playbook.yaml`: root orchestration flow
- `playbook_test.yaml`: smoke variant with low `MAX_UNITS`
- `playbooks/{task}/{subtask}/playbook.yml`: modular execution tree
- `playbooks/js/`: JavaScript snippets injected/executed during runtime
- `playbooks/output/`: execution artifacts and runtime debug snapshots
- `PRD.md`: product requirements
- `SDD.md`: design decisions
- `TASK_STATUS.md`: completion signal

## 3. Control Flow Design
- Root playbook coordinates module execution in deterministic order.
- Bootstrap modules validate docs/scaffold, runtime state, and JS loading.
- Recovery module owns transcript extraction and next-lecture progression loop.
- Finalize modules persist diagnostics and mark task completion.

## 4. Skill Usage Strategy
Prefer generic skills:
- `Browser.*`
- `CDP.*`
- `FS.*`
- `Framework.*`

Use domain skills (e.g., `Udemy.*`) only for compatibility.

## 5. Extensibility Plan
Framework growth can include:
- New skill modules.
- OpenAPI playbook contract expansion.
- New categories and reusable templates.

Record each change in `FRAMEWORK_GROWTH.md`.

## 6. Complexity and Reliability
- Keep loops bounded (`MAX_UNITS`).
- Use explicit break/continue control.
- Persist intermediate artifacts when useful for debugging.

## 7. Definition of Done
- Task flow reaches completion marker step.
- `TASK_STATUS.md` written with status `completed`.
- Required artifacts are generated in project scope.


## Completion Record

- task: Udemy full-course transcription recovery (test)
- status: completed
- completed_at: 2026-02-12 08:56:33
