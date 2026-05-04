# waibaOpenclawParity

WAIBA project for measuring and closing parity gaps against OpenClaw-style agent workflows.

## Architecture
- Root orchestrator: `playbook.yaml`
- Current topology: `playbooks/01_bootstrap`, `playbooks/02_task`, `playbooks/03_finalize`
- Legacy playbooks remain as delegated targets until parity is validated and stale paths can be pruned.

## Run
```powershell
& "C:\Program Files\AutoHotkey\v2\AutoHotkey64.exe" C:\Users\jecha\.waiba\src\automation\waiba.ahk run .\playbook.yaml prod
```
