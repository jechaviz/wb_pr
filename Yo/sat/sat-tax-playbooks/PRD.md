# SAT Tax Playbooks PRD

## Objective

Provide a WAIBA project for SAT Mexico declaration workflows, including session bootstrap, visual checkpoints, declaration preparation, preview, recovery, and explicitly confirmed submission.

## Scope

- Keep SAT-specific month/year and submit wrappers in this project.
- Provide observation-only learning playbooks for current SAT screens/forms.
- Preserve SAT-prefilled amounts and computed ISR/IVA unless the operator explicitly selects strict zero-declaration mode.
- Detect and repair stale SAT navigation-readiness state that blocks preview after all sections are complete and no validation errors remain.
- Keep generic navigation in `C:\git\wb_pr\_shared\web\waiba-navigation-supercontrol`.
- Keep runtime OCR/CAPTCHA primitives in `.waiba` runtime skills.
- Persist generated evidence under `playbooks\output`.

## Safety Contract

- `debug` must never submit.
- Submit flows require `SAT_SUBMIT_CONFIRM`.
- Submit flows require a saved pre-submit checkpoint and optional second operator confirmation.
- Nonzero submissions require the normal explicit confirmation gate with period/type/totals.
- Safe state JSON must not persist credentials, RFC, tokens, cookies, CAPTCHA values, or raw form values.
- Preview evidence should be generated before submission where the SAT flow allows it.
- Human login/CAPTCHA checkpoints remain explicit.
