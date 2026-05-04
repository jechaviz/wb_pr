# SAT Tax Playbooks PRD

## Objective

Provide a WAIBA project for SAT Mexico declaration workflows, including session bootstrap, visual checkpoints, declaration preparation, preview, recovery, and explicitly confirmed submission.

## Scope

- Keep SAT-specific month/year and submit wrappers in this project.
- Keep generic navigation in `C:\git\wb_pr\_shared\web\waiba-navigation-supercontrol`.
- Keep runtime OCR/CAPTCHA primitives in `.waiba` runtime skills.
- Persist generated evidence under `playbooks\output`.

## Safety Contract

- `debug` must never submit.
- Submit flows require `SAT_SUBMIT_CONFIRM`.
- Preview evidence should be generated before submission where the SAT flow allows it.
- Human login/CAPTCHA checkpoints remain explicit.
