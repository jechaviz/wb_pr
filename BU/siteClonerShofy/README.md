# SiteClonerShofy

## Purpose
- Project: `SiteClonerShofy`
- Skill path: `Web.SiteCloner.Shofy`
- Category: `web/site-cloning`
- Customer: `BU`
- Task: `Clone shofy.botble.com sections into a reusable Vue3 SFC template`

## Scope
This project captures source references (screenshots + DOM interactive map), then generates a first-pass clone using:
- Vue 3 SFC (runtime loader)
- Tailwind CSS 4.x + DaisyUI 5.x compiled CSS (build-time)
- DaisyUI 5.x
- SQuery for jQuery-like selectors

If first pass is not sufficient, Set-of-Marks mode labels interactive elements with numeric IDs so customization can be requested precisely by ID.

## Cloning Phase Policy (Hard)
Execution baseline:
- browser automation runs in single-tab reuse mode in background/minimized state.
- opening extra tabs/windows during retries is forbidden unless explicitly enabled.
- premium real parity is mandatory; if parity is not premium-level, the task is considered incomplete.

1. Template coverage:
- all relevant sections and routes are generated.
- reference capture uses full-page screenshots (scroll-aware), not only viewport.

2. Visual parity:
- close similarity on critical areas,
- megamenu/nav parity when present in source,
- responsive parity evidence (desktop/tablet/mobile).
- iconography must use Font Awesome Free latest (SVG only as exception when no FA icon is feasible).
- image policy is source-first (original site assets), with Unsplash fallback only when originals are unavailable.

3. Visible functionality reconstruction:
- popup/banner/carousel/cookie-consent when present in source,
- functional wishlist/cart/compare/checkout flows,
- remove/update/move actions and live counters/countdown.
- mandatory real capture flow: search -> product-list -> product-detail -> cart -> checkout.
- capture dashboard/login references for user/vendor/admin when discoverable.

4. Design ownership upgrade:
- apply own visual upgrade without regressing parity or ecommerce behavior.

Formal policy file:
- `playbooks/policies/cloning_policy.yml`

## Run
```powershell
& "C:\Program Files\AutoHotkey\v2\AutoHotkey64.exe" `
  C:\Users\jecha\.waiba\src\automation\waiba.ahk `
  run C:\git\wb_pr\projects\BU\siteClonerShofy\playbook.yaml prod
```

## Optional Set-of-Marks Review
```powershell
& "C:\Program Files\AutoHotkey\v2\AutoHotkey64.exe" `
  C:\Users\jecha\.waiba\src\automation\waiba.ahk `
  run C:\git\wb_pr\projects\BU\siteClonerShofy\playbook.yaml review_som
```

After `review_som`, fill:
- `playbooks/output/set_of_marks/customization_request.template.yml`

Use `ids` per page to request exact UI refinements against the source parity.

## Artifacts
- Source capture: `playbooks/output/reference/*.png`, `*.dom.json`, `*.vision.txt`, `*.ocr.txt`
- Generated template: `template/`
- Set-of-Marks evidence: `playbooks/output/set_of_marks/*.png`, `*.json`
- Set-of-Marks customization sheet: `playbooks/output/set_of_marks/customization_request.template.yml`
- Final readiness: `playbooks/output/readiness_report.json`

## Autonomy Doctrine (Mandatory)
- Perception before action (DOM -> OCR/vision fallback).
- Verified outputs only (no inferred completion).
- Continuous optimization of clone accuracy and interaction mapping.

## Ecommerce Cloning Hard Policy (Mandatory)
- Visual parity must be close to source on critical storefront areas (especially above the fold).
- Premium real parity is mandatory: micro-interactions, attribute-level product behavior, and behavior depth must be reconstructed when present in source.
- Static-only clones are invalid for ecommerce.
- Core interactions are mandatory:
  - header live counters (`cart`, `wishlist`, `compare`)
  - functional `wishlist`, `cart`, `checkout` links/routes
  - functional compare flow
  - cart quantity/update/remove + subtotal
  - wishlist add/remove + move-to-cart
  - popup/banner/carousel/cookie behaviors when present in source
  - megamenu parity when present in source
  - responsive cloning evidence
  - visible live countdown on storefront
  - Font Awesome Free latest as default icon system (avoid inline SVG unless necessary)

## Architect Profile Contract (Mandatory)
- Keep online flow orchestration in playbooks/subplaybooks.
- Reuse stable shared capabilities from `C:\git\wb_pr\_shared\web\site-cloner-playbooks`.
- Promote deterministic speed paths first; use expensive fallbacks only when needed.

## File Size Governance (Mandatory)
- Hard limit: any source/doc/playbook > 600 lines must be refactored.

## Online Workflow Boundary (Mandatory)
- Online orchestration is playbook-owned; AHK layer remains generic runtime primitives.
