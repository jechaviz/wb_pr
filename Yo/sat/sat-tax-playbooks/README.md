# SAT Tax Playbooks

WAIBA project playbooks for SAT Mexico filing and declaration workflows.

This project owns SAT-specific online flows, month/year wrappers, submit confirmations, evidence capture, and declaration recovery playbooks. Generic browser navigation comes from `C:\git\wb_pr\_shared\web\waiba-navigation-supercontrol`; CAPTCHA OCR primitives remain runtime skills under `.waiba`.

Safety:

- Use `debug` for parser validation.
- Use `learn` for observation-only interactive learning on the current SAT session.
- Use preview mode before submit flows.
- Submission requires an explicit `SAT_SUBMIT_CONFIRM` value.
- Submit flows run `07_pre_submit_checkpoint` and require `SAT_PRE_SUBMIT_CONFIRM` when enabled.
- Informational prefill/instructions modals may be closed by the month flow before learning, preview, or the pre-submit checkpoint.
- Preserve SAT-prefilled and computed amounts by default. A strict zero declaration is now an explicit mode, not the default.
- When SAT leaves `Vista previa` disabled after all sections are complete, the month flow may repair stale navigation readiness before preview; it does not click submit.
- Hidden/orphan Decreto/Relocalización badges are pre-submit blockers unless explicitly validated.
- Keep generated evidence under `playbooks\output`.
