---
name: sat-tax-playbooks
description: WAIBA project playbooks for SAT Mexico declarations with reproducible entrypoints, login/session bootstrap, iframe diagnostics, monthly zero declarations, preview, recovery, and explicitly confirmed submit flows.
---

# SAT Tax Playbooks

Project playbooks:
- `playbook.yml` (single entrypoint)
- `playbooks/01_tax_research_plan/playbook.yml`
- `playbooks/02_sat_portal_session/playbook.yml`
- `playbooks/03_iframe_recovery/playbook.yml`
- `playbooks/04_declare_zero_month/playbook.yml`
- `playbooks/05_declare_zero_2025_onward/playbook.yml`
- `playbooks/06_interactive_learning_session/playbook.yml`
- `playbooks/07_pre_submit_checkpoint/playbook.yml`

Bundled assets:
- `playbooks/assets/sat_set_profile.js`
- `playbooks/assets/sat_select_obligations_and_next.js`
- `playbooks/assets/sat_form_probe.js`
- `playbooks/assets/sat_fill_zero_amounts.js`
- `playbooks/assets/sat_safe_state_probe.js`

Helium coverage / generalizations:
- Page probe: use `Helium.Probe` (replaces the old `sat_page_probe.js` helper).
- Click-by-text: use `Helium.ClickAny` (replaces the old `sat_click_any_texts.js` helper).
- Iframe diagnostics: use `Helium.DetectIframes` (generalized from the old `sat_detect_iframes.js`).

Design contract:
- Keep SAT online workflow in WAIBA playbooks and subplaybooks.
- Use WAIBA runtime skills (`Helium.*`, `CDP.*`, `FS.*`, `Shell.*`, `Note`, `Fail`).
- Do not use external `ps1` scripts for orchestration.
- Keep captcha as manual checkpoint.
- Use observation-only learning for live SAT screen/form diagnosis.
- Require the pre-submit checkpoint before any automated submit click.
- Persist artifacts for each run under `${OUTPUT_DIR}\\sat`.
- Reuse `waiba-navigation-supercontrol` for browser attach/open behavior across SAT flows.
- Use render-ready waits before screenshot/DOM evidence capture.

Run:
- Preview-only (no submit): `waiba run C:\\git\\wb_pr\\Yo\\sat\\sat-tax-playbooks\\playbook.yml prod`
- Observation-only learning: `waiba run C:\\git\\wb_pr\\Yo\\sat\\sat-tax-playbooks\\playbook.yml learn`
- Preview-only (clean session, kills Edge): `waiba run C:\\git\\wb_pr\\Yo\\sat\\sat-tax-playbooks\\playbook.yml prod_clean`
- Submit mode: `waiba run C:\\git\\wb_pr\\Yo\\sat\\sat-tax-playbooks\\playbook.yml prod_submit`
  - Submit mode (clean session, kills Edge): `waiba run C:\\git\\wb_pr\\Yo\\sat\\sat-tax-playbooks\\playbook.yml prod_submit_clean`
  - Also set `SAT_SUBMIT_CONFIRM` and `SAT_PRE_SUBMIT_CONFIRM` (any non-empty values) in `C:\\git\\wb_pr\\Yo\\sat\\sat-tax-playbooks\\playbook.yml` after reviewing evidence.

Key variables (edit `C:\\git\\wb_pr\\Yo\\sat\\sat-tax-playbooks\\playbook.yml`):
- `SAT_FROM_YEAR`, `SAT_FROM_MONTH`, `SAT_TO_YEAR`, `SAT_TO_MONTH` (range)
- `SAT_OBLIGATION_IDS` (checkbox ids to select)
- `SAT_FILL_ZEROES` (default `true`): best-effort fill of empty numeric/amount fields with `0` on the SAT Formulario page
- `SAT_DO_SUBMIT` (default `false`): when `true` clicks **Enviar declaracion** and prints acuse PDF
- `SAT_DO_PREVIEW` (default `true`): prints a preview PDF before submission
- `SAT_PRE_SUBMIT_CONFIRM` (default empty): second operator gate after reviewing pre-submit evidence
- `SAT_REQUIRE_PRE_SUBMIT_CONFIRM` (default `true`): requires the second gate before submit
- `SAT_EXPECT_ZERO_DECLARATION` (default `true`): pre-submit safe-state gate treats nonzero amount fields as blockers
- `SAT_SUBMIT_ALLOW_NONZERO_AMOUNTS` (default `false`): override when a nonzero declaration is intentional
- `SAT_SAFE_STATE_INCLUDE_BODY_PREVIEW` (default `false`): keep safe-state body text previews disabled unless needed
- `SAT_USE_NAV_SUPERCONTROL` (default `true`): use `waiba-navigation-supercontrol` for SAT browser session bootstrap
- `SKILL_NAV_SUPERCONTROL_PLAYBOOK`: override path to the supercontrol core playbook when needed
- `SAT_NAV_ENABLE_OCR` (default `false`): enable OCR evidence during supercontrol navigation
