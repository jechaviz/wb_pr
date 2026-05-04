# SAT Tax Playbooks SDD

## Architecture

This is a WAIBA project, not a runtime skill.

- Root entrypoint: `playbook.yaml`.
- Legacy-compatible entrypoint: `playbook.yml`.
- Project playbooks: `playbooks\NN_*`.
- Shared navigation library: `C:\git\wb_pr\_shared\web\waiba-navigation-supercontrol`.
- Evidence: `playbooks\output`.

## Boundaries

SAT portal behavior and declaration policy live here. Generic browser control, DOM probing primitives, filesystem actions, shell execution, and CAPTCHA OCR remain runtime/shared capabilities.

## Validation

Use WAIBA `debug` for parse validation. Use preview flows before any submit mode. Never run submit mode without explicit operator confirmation.
