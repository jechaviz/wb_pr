# SAT Tax Playbooks SDD

## Architecture

This is a WAIBA project, not a runtime skill.

- Root entrypoint: `playbook.yaml`.
- Legacy-compatible entrypoint: `playbook.yml`.
- Project playbooks: `playbooks\NN_*`.
- Interactive learning: `playbooks\06_interactive_learning_session`.
- Submit guard: `playbooks\07_pre_submit_checkpoint`.
- Shared navigation library: `C:\git\wb_pr\_shared\web\waiba-navigation-supercontrol`.
- Evidence: `playbooks\output`.

## Boundaries

SAT portal behavior and declaration policy live here. Generic browser control, DOM probing primitives, filesystem actions, shell execution, and CAPTCHA OCR remain runtime/shared capabilities. Safe SAT state extraction is kept as project JS under `playbooks\assets` because it encodes SAT-specific redaction and checkpoint semantics.

Amount policy: the default is preserve-prefill. `sat_fill_zero_amounts.js` only fills empty amount-like/required fields and never overwrites existing SAT-computed amounts. Strict zero declarations require explicit `SAT_EXPECT_ZERO_DECLARATION=true`; otherwise nonzero SAT-computed ISR/IVA can proceed to preview and checkpoint with the usual human confirmation gate.

Preview readiness policy: SAT may leave `Vista previa` disabled because group-level `.recorrido` markers are stale even when all section badges are clear. `sat_repair_preview_readiness.js` may repair only navigation/readiness classes and `configuracionDeclaracion.errores=false` after checking for visible badges, error icons, messages, and native section errors. It performs no click and intentionally leaves submit behavior gated by the pre-submit checkpoint.

## Validation

Use WAIBA `debug` for parse validation. Use `learn` only against an operator-owned current SAT session because it observes without clicks/navigation. Use preview flows before any submit mode. Never run submit mode without explicit operator confirmation and the pre-submit checkpoint.
