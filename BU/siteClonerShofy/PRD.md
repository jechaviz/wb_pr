# PRD - SiteClonerShofy

## 1. Overview
- Project: SiteClonerShofy
- Skill Path: Web.SiteCloner.Shofy
- Category: web / site-cloning
- Customer: BU
- Task: Clone key Shofy sections into a reusable template stack.

## 2. Problem Statement
Need a fast, reusable site-cloning pipeline that starts with vision-based capture and produces a modern, maintainable storefront template without Node build tooling.

## 3. Goals
- Capture source sections from `https://shofy.botble.com`.
- Generate Vue3 SFC template with Tailwind4 + DaisyUI5.
- Keep parity workflow iterative:
  - Round 1: native DaisyUI components.
  - Round 2: Set-of-Marks overlay for precise custom edits.
- Keep outputs reproducible and stored in `playbooks/output`.

## 3.1 Hard Phases (Mandatory)
1. Template coverage
- Generate all relevant sections and route map.

2. Visual parity
- Reach close parity above the fold on critical pages.
- Rebuild megamenu and navigation behavior where source has it.
- Include responsive cloning evidence (desktop/tablet/mobile).
- Premium real parity is mandatory (micro-interactions/hover states/visual rhythm and hierarchy).

3. Visible functionality reconstruction
- Rebuild visible behaviors: popup, banner, carousel, cookie banner.
- Rebuild ecommerce interactions: wishlist/cart/compare/checkout, remove/update/move actions, counters/countdown.

4. Design ownership upgrade
- After parity, apply controlled branded improvements without breaking functional parity.

## 4. Functional Requirements
- Must capture screenshot + DOM interactive map per section.
- Must generate routes/pages for all requested sections.
- Must support no-Node preview (`python -m http.server`).
- Must produce Set-of-Marks map + screenshots when review mode is enabled.
- Hard policy: above-the-fold parity for critical pages (`main_page`, `product-detail`, `products-grid`) must be visually close to source, not generic placeholders.
- Hard policy: premium real parity is mandatory; lack of premium parity means task is incomplete.
- Hard policy: ecommerce clone must include functional core interactions:
  - live counters in header (`cart`, `wishlist`, `compare`)
  - functional links for `wishlist`, `cart`, and `checkout`
  - cart item quantity/update/remove and subtotal calculation
  - wishlist add/remove and move-to-cart
  - compare add/remove and move-to-cart workflow
  - checkout route/page reachable from cart CTA
  - offer countdown visible and ticking on storefront
  - megamenu functional interactions when source has megamenu
  - visible popup/banner/carousel/cookie-consent behaviors when source includes them
  - product attribute/variant behavior (e.g., size/color/options) when source exposes it

## 5. Acceptance Criteria
- `template/index.html` exists and loads Vue app.
- `template/src/pages/*.vue` count >= expected sections.
- `playbooks/output/reference/*.png` exists for captured sections.
- `playbooks/output/readiness_report.json` reports `ok=true`.
- `template/src/main.js` exposes runtime commerce state and renders live counters.
- `template/src/pages/cart.vue`, `template/src/pages/wishlist.vue`, and `template/src/pages/checkout.vue` exist and are functional.
- `template/src/pages/compare.vue` exists and is functional.
- `template/src/pages/main_page.vue` contains active countdown and add-to-cart/add-to-wishlist actions.
- `playbooks/output/responsive_preview_desktop.png`, `playbooks/output/responsive_preview_tablet.png`, `playbooks/output/responsive_preview_mobile.png` exist.

## Autonomous Improvement Contract
- Every run should improve parity speed and reliability.
- Keep generated decisions inspectable (snapshots, maps, reports).

## Architect Intelligence Baseline (Mandatory)
- Prefer deterministic low-latency tactics first.
- Use Set-of-Marks IDs for precise iteration instead of ambiguous visual feedback.

## Refactoring Trigger Policy (Mandatory)
- Any file > 600 lines triggers modular refactor.

## Online Flow Implementation Policy (Mandatory)
- Online flow logic remains in playbooks/subplaybooks.


## Completion Record

- task: Clone Shofy storefront sections into a reusable Vue3 + Tailwind4 + DaisyUI5 template
- status: completed
- completed_at: 2026-02-15 14:31:13
