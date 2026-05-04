---
name: odoo-rpc-playbooks
description: Reusable Odoo JSON-RPC playbook bundle extracted from generic patterns in C:\git\customers\yo\odoo_rpp (connection/session/module install/branding/baseline validation). Use this for generic Odoo online flows; keep business-domain rules in each project.
---

# Odoo RPC Playbooks

Generic reusable playbooks:
- `playbooks/01_modules_ensure/playbook.yml`
- `playbooks/02_branding_apply/playbook.yml`
- `playbooks/03_baseline_verify/playbook.yml`

Extracted scope (from `odoo_rpp`):
- Generic connection/session discipline from `src/core/connection.py`
- Generic config/error conventions from `src/core/config.py` and `src/core/exceptions.py`
- Generic data/load orchestration style from `src/loaders/base.py`

Boundary:
- Keep only reusable Odoo operations here.
- Keep project-specific business logic (catalog, domain entities, custom workflows) inside the project playbooks.
