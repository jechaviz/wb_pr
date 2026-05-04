# SAT Tax Playbooks

WAIBA project playbooks for SAT Mexico filing and declaration workflows.

This project owns SAT-specific online flows, month/year wrappers, submit confirmations, evidence capture, and declaration recovery playbooks. Generic browser navigation comes from `C:\git\wb_pr\_shared\web\waiba-navigation-supercontrol`; CAPTCHA OCR primitives remain runtime skills under `.waiba`.

Safety:

- Use `debug` for parser validation.
- Use `learn` for observation-only interactive learning on the current SAT session.
- Use preview mode before submit flows.
- Submission requires an explicit `SAT_SUBMIT_CONFIRM` value.
- Submit flows run `07_pre_submit_checkpoint` and require `SAT_PRE_SUBMIT_CONFIRM` when enabled.
- Keep generated evidence under `playbooks\output`.
