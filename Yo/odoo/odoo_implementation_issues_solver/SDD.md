# SDD - odoo_implementation_issues_solver

## 1. Runtime

- Engine: `src/automation/OrchestratorV3.ahk`
- Playbook model: YAML modular tree
- Dispatch gateway: `src/automation/v3/actions/SkillGateway.ahk`

## 2. Hierarchical Skill Contract

- Global convention: `<skill_n0>.<skill_n1>.<skill_n2>...<skill_nN>`
- Runtime mapping:
- `skill_n0` -> root skill class instance.
- `skill_n1...skill_nN` -> method name `skill_n1_skill_n2_..._skill_nN`.

Example in this project:
- `OdooEnterpriseOnline.Platform.Connect` -> `Platform_Connect`
- `OdooEnterpriseOnline.Security.AccessProbe` -> `Security_AccessProbe`
- `OdooEnterpriseOnline.ServerActions.DiscoverAndRun` -> `ServerActions_DiscoverAndRun`

## 3. Module Topology

- Root playbook: `playbook.yaml`
- Root playbook (data load): `playbook_rpp_data_load.yaml`
- Modules:
- `playbooks/odoo/connect/playbook.yml`
- `playbooks/odoo/modules_discovery/playbook.yml`
- `playbooks/odoo/grant_quality_manager/playbook.yml`
- `playbooks/odoo/server_actions/playbook.yml`
- `playbooks/odoo/access_probe/playbook.yml`
- `playbooks/odoo/rpp_data_load/playbook.yml` (CLI-only, pure playbook)

## 4. JS Assets by Subskill

- `playbooks/js/main.js` -> platform snapshot
- `playbooks/js/modules_discovery.js` -> module inventory
- `playbooks/js/grant_quality_manager.js` -> direct grant attempts
- `playbooks/js/server_actions_probe.js` -> discovery + server-action execution
- `playbooks/js/access_probe.js` -> final blocker verification

## 5. Output Artifacts

- `playbooks/output/odoo_visit.json`
- `playbooks/output/odoo_modules_discovery.json`
- `playbooks/output/odoo_grant_quality_manager.json`
- `playbooks/output/odoo_server_actions_probe.json`
- `playbooks/output/odoo_access_probe.json`
- `playbooks/output/rpp_data_load.json`
- `TASK_STATUS.md`

## 6. Reusable Moduleization Status

| Path | Inputs | Outputs | Reusable |
|---|---|---|---|
| `OdooEnterpriseOnline.Platform.Connect` | url, port | connected Odoo context | yes |
| `OdooEnterpriseOnline.Modules.Discover` | js probe | modules discovery json | yes |
| `OdooEnterpriseOnline.Security.GrantQualityManager` | js probe | grant attempt json | yes |
| `OdooEnterpriseOnline.ServerActions.DiscoverAndRun` | js probe | server actions evidence | yes |
| `OdooEnterpriseOnline.Security.AccessProbe` | js probe | final blocker state | yes |

## 7. Odoo Online Constraint + Workaround

- Odoo SaaS instance exposes no writable `groups_id/groups` or dynamic `sel_groups_* / in_group_*` fields for this user in the web client context.
- Workaround: grant access by writing to the inverse M2M field `res.groups.user_ids` and verify membership by probing groups via RPC.

## 8. CLI-Only Data Load (Pure Playbook)

Regla aplicada:

- Automatizaciones 100% CLI se implementan en playbook con `Shell.Run` (no requieren agregar nuevas acciones AHK).

Proyecto ejecutado:

- Local: `C:\git\customers\yo\odoo_rpp`
- Remote: `https://github.com/jechaviz/odoo_rpp.git`

Evidencia:

- `playbooks/output/rpp_data_load.json` (incluye `dry_run` + `apply` + rutas de logs redirigidos)


## Completion Record

- task: Diagnose Odoo access required for implementation sync
- status: completed
- completed_at: 2026-02-12 11:51:43
