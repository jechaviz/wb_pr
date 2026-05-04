# WAIBA Autonomy Doctrine - odoo_implementation_issues_solver

## Mission
- Objective: Diagnose and resolve Odoo implementation blockers.
- Context: Connect to Odoo, inspect modules/access, attempt permitted configuration paths, and verify objective-linked access.
- Skill path: Odoo.ImplementationIssuesSolver

## Non-Negotiable Principles
1. Objective-first: every action must reduce an implementation blocker.
2. Perception before action: inspect session, permissions, and UI state before mutation.
3. Verification by state: success requires live Odoo evidence or persisted diagnostics.
4. Reuse over duplication: Odoo RPC/browser primitives stay in shared WAIBA skills.
5. Human governance by exception: ask for credentials or irreversible production changes only.
6. Online workflow boundary: Odoo online flows are playbook-owned, not vertical AHK skills.

## Runtime Enforcement
- Bootstrap runs `Framework.EnsureAutonomyDoctrine`.
- Runtime runs `Framework.Policy.EnsureAutonomy`.
- Numbered playbook topology is primary; legacy paths are wrappers during migration.
