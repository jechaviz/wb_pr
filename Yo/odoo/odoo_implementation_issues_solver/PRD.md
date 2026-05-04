# PRD - odoo_implementation_issues_solver

## 1. Overview

- Project: `odoo_implementation_issues_solver`
- Project Skill Path: `OdooEnterpriseOnline.Security.ResolveQualityPermission`
- Category: `odoo/implementation`
- Customer: `Yo`
- Objective: resolve Odoo access blockers to finish implementation sync and keep capabilities reusable as modules.

## 1.1 Project As Reusable Module

- Hierarchical contract: `<skill_n0>.<skill_n1>.<skill_n2>...<skill_nN>`
- skill_n0: `OdooEnterpriseOnline`
- skill_n1: `Security`
- skill_n2: `ResolveQualityPermission`
- Rule: every stable sub-capability discovered in this project must become a reusable subskill path.

## 2. Problem Statement

Real data load is blocked while creating `quality.point` because the current user lacks `Quality / Administrator`.

## 3. Goals

- Connect to Odoo using active authenticated session.
- Discover module/application surface of the instance.
- Attempt grant via user-write compatible paths.
- Attempt server-actions discovery/hacks for additional remediation paths.
- Verify `quality.point:create` permissions after each remediation stage.
- Keep all steps represented as reusable hierarchical actions.

Additional goal (CLI-only automation, pure playbook):

- Run the RP Rental data loader implemented in the external python repo `odoo_rpp` via `Shell.Run` (dry-run first, then apply on success).

## 4. Non-Goals

- Full business migration execution in this project.
- Tutorial rendering/edition tasks.
- Changes to third-party Odoo code.

## 5. Functional Requirements

- Generate:
- `playbooks/output/odoo_visit.json`
- `playbooks/output/odoo_modules_discovery.json`
- `playbooks/output/odoo_grant_quality_manager.json`
- `playbooks/output/odoo_server_actions_probe.json`
- `playbooks/output/odoo_access_probe.json`
- Report:
- active user/session (`uid`, username, db)
- target group state (`quality_control.group_quality_manager`)
- final model rights (`quality.point:create|write`)

## 6. Reusable Subskills Backlog

| Path | Purpose | Maturity | Moduleized |
|---|---|---|---|
| `OdooEnterpriseOnline.Platform.Connect` | open/connect and stabilize Odoo tab | stable | yes |
| `OdooEnterpriseOnline.Modules.Discover` | inventory modules and app footprint | stable | yes |
| `OdooEnterpriseOnline.Security.GrantQualityManager` | try grant via writable fields | stable | yes |
| `OdooEnterpriseOnline.ServerActions.DiscoverAndRun` | discover and execute relevant server actions | stable | yes |
| `OdooEnterpriseOnline.Security.AccessProbe` | verify blockers and rights | stable | yes |

## 6.1 External Project Dependency (RP Rental Data Load)

- Project: `odoo_rpp`
- Local path: `C:\git\customers\yo\odoo_rpp`
- Remote: `https://github.com/jechaviz/odoo_rpp.git`
- WAIBA execution playbook: `playbook_rpp_data_load.yaml`

## 7. Acceptance Criteria

- `prod` flow runs end-to-end and writes all artifacts.
- Reusable subskills are explicitly documented in PRD/SDD.
- Final access probe states whether blocker is solved with hard evidence.


## Completion Record

- task: Diagnose Odoo access required for implementation sync
- status: completed
- completed_at: 2026-02-12 11:51:43
