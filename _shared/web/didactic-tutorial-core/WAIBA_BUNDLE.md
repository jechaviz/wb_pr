---
name: didactic-tutorial-core
description: Generic WAIBA skill for pedagogical browser tours with click-intent navigation, text-rect fallback targeting, one-time recorrido deduplication, and UI audit/defer classification.
---

# Didactic Tutorial Core

Use this skill when you need reusable tutorial automation that is pedagogical (not only exhaustive):

- Intent-driven click navigation (`run`) with strict scope control by category/keywords.
- Text-rect fallback targeting (DOM text boxes + find-in-page style matching).
- One-time recorrido memory for repeated blocks (header/global navigation) so repeated screens are audited but not re-explained.
- UI audit snapshot (`inspectAndValidate`) with:
  - menu map
  - field map (readonly/required/interactivity)
  - didactic deferred list (`out_of_focus_scope`)

## Assets

- `playbooks/assets/hooks/didactic_tutorial_action_api.js`
- `playbooks/assets/templates/didactic_tutorial_capture.template.yml`

## Integration contract

1. Load the JS hook with `FS.ReadText`.
2. Call `window.__waibaTutorialCaptureAction.run(...)` for click-first actions.
3. Call `window.__waibaTutorialCaptureAction.inspectAndValidate(...)` for evidence.
4. Use subtitle overlay focus from `window.__waibaTutorialLastClick` when available.
5. Keep URL fallback only when click context is invalid.
