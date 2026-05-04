# App Navigation

Reusable WAIBA playbook library for learning and operating native Windows application UIs.

This is not web navigation. It models app windows, panes, tabs, workspaces, transient UI, and action contracts before automation.

## Phases

- `playbooks/01_first_impression/playbook.yml`: observe first impression without actions.
- `playbooks/02_observe_dynamics/playbook.yml`: track dynamic/workspace regions.
- `playbooks/03_action_readiness/playbook.yml`: prepare safe action contracts.

## Contract

- Never perform UI actions during first impression.
- Treat screenshots and user observations as evidence.
- Separate static chrome, dynamic panels, workspace surfaces, and transient UI.
- Store app-specific learning in `C:\git\wb_pr\apps\<app>`.
- Promote only generic learning patterns back to this shared library.
