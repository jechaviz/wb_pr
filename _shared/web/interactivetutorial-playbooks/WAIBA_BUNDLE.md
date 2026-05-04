---
name: interactivetutorial-playbooks
description: Reusable playbook bundle to build and run interactive browser tutorials from YAML scripts. Use when a flow must open a URL, show per-step subtitles, visualize mouse halo/click focus, provide floating pause/play/stop and step navigation controls, and resume exactly from the saved step.
---

# Interactive Tutorial Playbooks

Reusable playbooks:
- `playbooks/01_ingest_operation_examples/playbook.yml`
- `playbooks/02_run_interactive_tutorial/playbook.yml`

Bundled assets:
- `playbooks/assets/tutorial_script.template.yml`

Design contract:
- Core implementation lives in `src/automation/lib/Skills/InteractiveTutorial.ahk`.
- Reuse existing runtime components (`Logger`, `AccessPolicy`, `Tutorial`) instead of duplicating infrastructure.
- Tutorial behavior is script-driven from YAML; do not hardcode case steps in AHK.
- The runner must support pause/play/stop, previous/next, first/last, and persisted resume.
- Mouse guidance must be visible (yellow halo) and clicks must show a focus effect.
- Case-specific flows stay in project scripts; this skill stays generic and reusable.
