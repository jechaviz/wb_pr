# WAIBA Autonomy Doctrine - udemyCourseTranscriptionRecovery

## Mission
- Objective: Recover and persist reachable Udemy lecture transcripts.
- Context: Use browser/CDP automation, sidebar state, and transcript extraction loops.
- Skill path: Web.UdemyCourseTranscriptionRecovery

## Non-Negotiable Principles
1. Objective-first: every action must increase recovered transcript coverage or evidence.
2. Perception before action: inspect page/sidebar state before navigation.
3. Verification by state: persist transcript/sidebar artifacts and detect coverage gaps.
4. Reuse over duplication: browser, CDP, and tutorial primitives stay in shared WAIBA skills.
5. Human governance by exception: ask only for login/session blockers.
6. Online workflow boundary: web navigation remains in playbooks with generic skills.

## Runtime Enforcement
- Bootstrap runs `Framework.EnsureAutonomyDoctrine`.
- Runtime runs `Framework.Policy.EnsureAutonomy`.
- Numbered playbook topology is primary; legacy paths are wrappers during migration.
