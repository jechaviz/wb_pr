# WAIBA Autonomy Doctrine - odooMigrationUserTrainingTutorial

## Mission
- Objective: Build an Odoo user-training tutorial package.
- Context: Visit the Odoo instance, capture daily workflow evidence, build guide/subtitle/render artifacts.
- Skill path: Odoo.MigrationUserTrainingTutorial

## Non-Negotiable Principles
1. Objective-first: every step must advance the tutorial artifact set.
2. Perception before action: inspect Odoo page state before clicking or rendering.
3. Verification by state: outputs must exist and match expected tutorial sections.
4. Reuse over duplication: generic browser/tutorial work belongs in shared WAIBA skills.
5. Human governance by exception: ask only for credentials, CAPTCHA, or irreversible actions.
6. Online workflow boundary: Odoo navigation remains in playbooks with generic Helium/CDP skills.

## Runtime Enforcement
- Bootstrap runs `Framework.EnsureAutonomyDoctrine`.
- Runtime runs `Framework.Policy.EnsureAutonomy`.
- Numbered playbook topology is primary; legacy paths are wrappers during migration.
