---
name: waiba-navigation-supercontrol
description: Reusable WAIBA shared playbook library for robust browser control in any project. Includes Ctrl+F style targeting, optional OCR, JS hot patching, PowerShell hooks, and evidence capture.
---

# WAIBA Navigation Supercontrol

Purpose:
- Provide a reusable, generic navigation core so any WAIBA project playbook can reach PS1-level control without custom orchestration scripts.

Entrypoints:
- `playbook.yml` (recommended default entrypoint)
- `playbooks/01_supercontrol/playbook.yml` (core reusable subplaybook)

Bundled hook assets:
- `playbooks/assets/hooks/pre_hook.ps1`
- `playbooks/assets/hooks/post_hook.ps1`
- `playbooks/assets/hooks/dom_patch.js`

Design contract:
- Keep this shared playbook library generic and cross-project.
- Keep customer/domain business rules in project playbooks.
- Prefer runtime overrides through variables (`NAV_*`) instead of editing the core playbook.
- Enforce render-ready synchronization before screenshot/probe evidence capture.

Run example:
- `waiba run C:\\git\\wb_pr\\_shared\\web\\waiba-navigation-supercontrol\\playbook.yml prod`

High-impact variables:
- `NAV_URL`: required URL to open.
- `NAV_START_OPEN_URL`: optional first URL used by `Helium.StartEdge` before `CDP.Navigate` to `NAV_URL`.
- `NAV_FIND_TEXT`: optional Ctrl+F target.
- `NAV_CLICK_TEXTS`: optional text candidates for click fallback (`A|B|C`).
- `NAV_FALLBACK_URL`: optional URL fallback when target is not found.
- `NAV_REUSE_EXISTING_TAB`: reuse matching tab when available.
- `NAV_ALLOW_NEW_TAB`: allow/disallow opening a new tab when no match is found.
- `NAV_TARGET_URL_CONTAINS`: target filters for tab selection.
- `NAV_EXCLUDE_URL_CONTAINS`: URL filters excluded from tab selection.
- `NAV_EXPECT_HOST_ENDSWITH`: optional host guard (`Helium.WaitUntilUrl`) after navigation.
- `NAV_RENDER_READY_TIMEOUT_SECS`: timeout for render-ready gating before screenshot/probe.
- `NAV_RENDER_READY_EXPR`: custom render-ready expression when default loader detection is insufficient.
- `NAV_NON_EMPTY_MIN_BODY_CHARS`: minimum visible text threshold used to avoid empty screenshots.
- `NAV_ALLOW_EMPTY_CAPTURE`: allow final screenshot/probe capture even when the surface still looks empty.
- `NAV_RECOVER_ON_EMPTY_CAPTURE`: auto-reload once and re-check before failing on empty capture.
- `NAV_CDP_BEFORE_EXPR` / `NAV_CDP_AFTER_EXPR`: optional JS to execute inline.
- `NAV_SHELL_COMMAND`: optional shell command for on-the-fly changes.
- `NAV_ENABLE_PRE_HOOK`, `NAV_ENABLE_POST_HOOK`, `NAV_ENABLE_JS_PATCH`, `NAV_ENABLE_OCR`.
