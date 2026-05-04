# PRD - udemyCourseTranscriptionRecovery

## 1. Overview
- Project: udemyCourseTranscriptionRecovery
- Category: cursos / udemy
- Customer: Yo
- Course/Context: generic-udemy
- Task: Udemy full-course transcription recovery

## 2. Problem Statement
Recover transcript artifacts for all reachable lectures in the course with a reproducible, modular playbook architecture.

## 3. Goals
- Deliver a reproducible root `playbook.yaml` that delegates execution to modular sub-playbooks.
- Keep workflow artifacts under `playbooks/` (`playbooks/output/`, `playbooks/js/`) plus project docs.
- Keep orchestration split under `playbooks/{task}/{subtask}/playbook.yml` to avoid monolithic files.
- Complete the run with explicit task completion status.

## 4. Non-Goals
- Modifying third-party libraries unless required.
- Storing generated artifacts in framework source folders.

## 5. Functional Requirements
- Must auto-create and keep updated `PRD.md` and `SDD.md`.
- Must support external JS files under `playbooks/js/`.
- Must support nested playbook composition using `playbook` steps.
- Must keep large flows decomposed in `playbooks/{task}/{subtask}/playbook.yml`.
- Must write outputs under `playbooks/output/`.
- Must mark task completion (`TASK_STATUS.md`) at end of successful process.

## 6. Framework Growth Requirements
During delivery, framework can evolve with:
- New skills.
- Playbook specification extensions.
- Category expansion (`scraping`, `automation`, `testing`, others).

Each evolution must be registered in `FRAMEWORK_GROWTH.md`.

## 7. Acceptance Criteria
- Playbook executes reproducibly for env `prod`.
- `PRD.md`, `SDD.md`, and `TASK_STATUS.md` exist and are updated.
- Output artifacts are present in `playbooks/output/`.
- Growth decisions are logged when applied.


## Completion Record

- task: Udemy full-course transcription recovery (test)
- status: completed
- completed_at: 2026-02-12 08:56:33
