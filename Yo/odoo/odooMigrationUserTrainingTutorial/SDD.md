# SDD - odooMigrationUserTrainingTutorial

## 1. Architecture Summary

- Runtime: WAIBA V3 (`src/automation/OrchestratorV3.ahk`)
- Flow style: modular playbook tree
- Skill stack:
- `Framework.*` for scaffolding and completion markers
- `CDP.*` for browser/Odoo interaction
- `FS.*` for artifact persistence
- `Tutorial.*` (new) for storyboard/subtitles/zoom/render planning

## 2. Playbook Modules

- Root: `playbook.yaml`
- Odoo visit module: `playbooks/odoo/connect/playbook.yml`
- Tutorial build module: `playbooks/tutorial/build/playbook.yml`
- Storyboard steps (customer-editable): `playbooks/tutorial/flows/rpr_rental_daily_workflow.json`
- English guide: `playbooks/tutorial/guide/user_training_guide.en.md`
- Bootstrap and finalize modules under `playbooks/bootstrap/*` and `playbooks/finalize/*`

## 3. New Skill Design (`Tutorial`)

Implemented in `src/automation/lib/Skills/Tutorial.ahk` with actions:

- `Tutorial.InitWorkspace`
- `Tutorial.BuildOdooStoryboard`
- `Tutorial.GenerateSubtitles`
- `Tutorial.GenerateMouseZoomKeyframes`
- `Tutorial.BuildRenderPlan`

### 3.1 Subtitle Strategy

- Switchable mode: one `.srt` per language (`subtitles.<lang>.srt`)
- Stacked/burn-in mode: `.ass` generation is playbook-owned (Node script) and uses line stacking via `\N`
- Timing preserved in milliseconds and exported as `captions.timing.json`

### 3.2 Mouse Zoom Strategy

- Keyframes captured as JSON events (`start_ms`, `end_ms`, `x`, `y`, `zoom`)
- Default behavior: if `events` is not provided, keyframes are generated automatically from storyboard `cues`.
- Auxiliary filter hint text file generated for compositor/ffmpeg usage

### 3.3 Render Planning Strategy

- Generates command strings (not forced execution)
- Output A: switchable subtitle tracks (mov_text streams)
- Output B: stacked subtitle burn-in (ASS)
- Optional BGM audio mix with `amix` in command plan

## 4. Odoo Visit Evidence

`playbooks/js/main.js` extracts:

- URL, title, ready state
- Presence of login/password input
- Top UI labels snapshot

Result persisted at:

- `playbooks/output/odoo_visit.json`

## 5. Reliability and Constraints

- Bounded loops and deterministic step ordering.
- Filesystem guardrails enforced by AccessPolicy.
- Render plan generation succeeds even if media files are placeholders.

## 6. Definition of Done

- Odoo connection step completes and artifact is written.
- Tutorial artifacts generated:
- storyboard
- subtitle bundle
- zoom keyframes
- render plan
- `TASK_STATUS.md` marked as completed by finalize module.


## Completion Record

- task: Build Odoo migration user training tutorial package
- status: completed
- completed_at: 2026-02-12 11:07:30
