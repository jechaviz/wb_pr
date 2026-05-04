---
name: odoo-online-playbooks
description: Reusable Odoo Online playbook bundle for trial provisioning (including activation/session) and instance configuration orchestration. Use when a project needs to automate Odoo Online setup while keeping case-specific business flows in project playbooks.
---

# Odoo Online Playbooks

Reusable playbook bundle:
- `playbooks/01_trial_provision/playbook.yml`
- `playbooks/02_instance_configure/playbook.yml`

Design contract:
- Online flow ownership stays in playbooks (not vertical AHK skills).
- Project-specific business logic stays in project paths (`${PROJECT_DIR}\\playbooks\\...`).
- These reusable playbooks orchestrate generic Odoo online flow phases and delegate project-specific modules via absolute project paths.
