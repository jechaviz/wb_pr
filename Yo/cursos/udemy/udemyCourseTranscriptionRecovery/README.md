# udemyCourseTranscriptionRecovery

WAIBA project for recovering Udemy course transcripts through CDP/browser automation.

## Architecture
- Root orchestrator: `playbook.yaml`
- Current topology: `playbooks/01_bootstrap`, `playbooks/02_task`, `playbooks/03_finalize`
- Legacy playbooks remain delegated targets while numbered orchestration is validated.

## Run
```powershell
& "C:\Program Files\AutoHotkey\v2\AutoHotkey64.exe" C:\Users\jecha\.waiba\src\automation\waiba.ahk run .\playbook.yaml prod
```
