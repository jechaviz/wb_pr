# PRD - waibaOpenclawParity

## 1. Overview
- Project: waibaOpenclawParity
- Category: automation / framework-parity
- Customer: Yo
- Program: WAIBA >= OpenClaw parity program
- Target baseline: OpenClaw

## 2. Problem Statement
WAIBA V3 has strong modular orchestration, but parity/superiority versus OpenClaw is not yet formalized with measurable KPIs and an implementation backlog.

## 3. Goals
- Define measurable capability parity matrix against OpenClaw.
- Identify highest-impact gaps for both parity and superiority.
- Generate a 90 day delivery roadmap with engineering milestones.
- Produce an actionable implementation backlog tied to WAIBA modules.

## 4. Non-Goals
- One-shot rewrite of the framework.
- Adding fragile one-off hacks without reusable skill design.
- Weakening existing security boundaries in AccessPolicy.

## 5. Functional Requirements
- Must generate baseline artifacts under `playbooks/output/`:
  - `capability_inventory.md`
  - `gap_matrix.md`
  - `roadmap_90d.md`
  - `implementation_backlog.md`
  - `llm_router_validation.json`
  - `messaging_inbound_validation.json`
- Must preserve modular playbook architecture (`playbooks/{task}/{subtask}/playbook.yml`).
- Must register framework growth entries when new skills/spec extensions are proposed.
- Must keep docs (`PRD.md`, `SDD.md`, `TASK_STATUS.md`) updated per checkpoint.

## 6. KPI Framework
- Parity coverage (% of OpenClaw capabilities matched in WAIBA).
- Superiority coverage (% capabilities where WAIBA exceeds baseline).
- Mean task completion reliability (successful runs / total runs).
- Recovery performance (time-to-recover after runtime or selector failures).

## 7. Acceptance Criteria
- Playbook executes reproducibly for env `prod`.
- Gap matrix includes priority and implementation strategy per capability.
- Roadmap includes sprint-level milestones for 90 days.
- Backlog maps each task to concrete WAIBA modules/files.
- Messaging inbound parser validation artifact exists with command extraction evidence.


## Completion Record

- task: WAIBA >= OpenClaw parity program (test)
- status: completed
- completed_at: 2026-02-12 10:35:20
