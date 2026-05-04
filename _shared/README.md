# WAIBA Shared Playbook Libraries

This tree is the canonical home for reusable WAIBA playbook libraries.

Use this for YAML/JS/asset bundles that are reused by projects but are not runtime action skills. Runtime action skills stay under `C:\Users\jecha\.waiba\skills` or `C:\Users\jecha\.waiba\src\automation\lib\Skills`.

Current libraries:

- `ecommerce\odoo-online-playbooks`
- `odoo\odoo-rpc-playbooks`
- `web\didactic-tutorial-core`
- `web\interactivetutorial-playbooks`
- `web\site-cloner-playbooks`
- `web\waiba-navigation-supercontrol`

Projects should reference this root through `WAIBA_PLAYBOOK_LIB_DIR` when possible.
