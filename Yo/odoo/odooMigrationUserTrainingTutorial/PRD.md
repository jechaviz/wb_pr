# PRD - odooMigrationUserTrainingTutorial

## 1. Overview

- Project: `odooMigrationUserTrainingTutorial`
- Category: `odoo/training`
- Customer: `Yo`
- Context: RP Rental flow migrated from manual process to Odoo
- Objective: Build a reusable tutorial package pipeline inspired by high-quality explainer videos.

## 2. Problem Statement

Users need structured training material for the Odoo flow migration. The tutorial pipeline must support multilingual subtitles, subtitle timing, mouse zoom guidance, and optional background music planning. For this customer deliverable, we will ship the tutorial content in English.

## 3. Goals

- Visit and validate the target Odoo instance from the playbook.
- Generate a storyboard aligned with the migrated RP Rental daily workflow.
- Generate subtitle assets that support:
- Switchable subtitle tracks (separate language streams, `.srt` per language).
- Burn-in subtitle mode via ASS (`.ass`) for final renders (bilingual stacking is supported by the skill, but English-only is used for this client).
- Produce subtitle timing artifacts for synchronized playback.
- Generate mouse zoom keyframe metadata (auto-generated from storyboard cues by default).
- Produce an ffmpeg render plan (commands and manifest) for:
- Switchable subtitles output.
- Stacked subtitles output.
- Provide an English written training guide aligned with the workflow.

## 4. Non-Goals

- Full NLE editing automation (Premiere/DaVinci timeline API integration).
- Automatic speech recognition in this iteration.
- Guaranteed final render success when source media files are missing.

## 5. Functional Requirements

- Must open/connect the Odoo URL and persist page evidence (`odoo_visit.json`).
- Must produce storyboard with ordered cues and timing.
- Must keep storyboard steps versioned under `playbooks/tutorial/flows/` for easy customer-specific edits.
- Must produce subtitle artifacts (`.srt` per language and `.ass` stacked/burn-in mode).
- Stacked/burn-in `.ass` generation must be playbook-owned (script executed via `Shell.Run`).
- Must produce caption timing JSON for sync playback workflows.
- Must produce mouse zoom keyframes JSON.
- Must produce render plan JSON and command script (`render.cmd`).
- Must include an English training guide document under `playbooks/tutorial/guide/`.
- Must keep all outputs inside the project scope under `playbooks/`.

## 6. Quality Requirements

- Deterministic file generation from playbooks.
- Reproducible execution in `prod` environment.
- Clear artifacts for review, handoff, and further post-production.

## 7. Acceptance Criteria

- Playbook `prod` execution completes successfully.
- `playbooks/output/odoo_visit.json` exists.
- Storyboard and subtitle artifacts exist under `playbooks/tutorial/`.
- Render plan exists with switchable and stacked command outputs.
- English guide exists at `playbooks/tutorial/guide/user_training_guide.en.md`.
- `TASK_STATUS.md` generated with `completed` status.


## Completion Record

- task: Build Odoo migration user training tutorial package
- status: completed
- completed_at: 2026-02-12 11:07:30
