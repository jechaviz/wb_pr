# odoo_implementation_issues_solver

WAIBA project for Odoo implementation access diagnostics, permission probes, and RP Rental data-load orchestration.

## Architecture
- Root orchestrator: `playbook.yaml`
- Data-load orchestrator: `playbook_rpp_data_load.yaml`
- Current topology: `playbooks/01_bootstrap`, `playbooks/02_task`, `playbooks/03_finalize`
- Legacy playbooks are delegated targets during migration parity.

## Run
```powershell
& "C:\Program Files\AutoHotkey\v2\AutoHotkey64.exe" C:\Users\jecha\.waiba\src\automation\waiba.ahk run .\playbook.yaml prod
```
