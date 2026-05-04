---
name: site-cloner-playbooks
description: Reusable playbook bundle to clone website structure and visual baseline into Vue3 SFC + TailwindCSS 4 + DaisyUI 5 without Node.js. Includes reference capture and Set-of-Marks review.
---

# Site Cloner Playbooks

Reusable playbooks:
- `playbooks/01_reference_capture/playbook.yml`
- `playbooks/02_template_scaffold/playbook.yml`
- `playbooks/03_set_of_marks_review/playbook.yml`
- mandatory phase contract must be included in each cloning project (`playbooks/policies/cloning_policy.yml`)

Design contract:
- Online navigation and cloning flow live in playbooks.
- JS assets live under `playbooks/assets/`.
- First pass uses native DaisyUI/Tailwind components.
- Fine-tuning uses Set-of-Marks overlays for precise user-guided customization IDs.
- Browser execution must reuse a single tab in background/minimized mode by default.
- Reference evidence should prefer `DemoCreator.CaptureFlowEvidence` over ad-hoc screenshot/DOM pairs.

Hard policy (ecommerce cloning):
- Critical pages must reach close visual parity above the fold; placeholder-only output is invalid.
- Reference capture must be full-page/scroll-aware (not viewport-only).
- Clone must include functional ecommerce baseline, not only static UI:
  - live header counters (`cart`, `wishlist`, `compare`)
  - functional links/routes for `wishlist`, `cart`, `checkout`
  - hierarchical header navigation depth (dropdown/megamenus), not flat-only links
  - footer information architecture parity (multi-column link blocks + lower taxonomy/tag rows when present)
  - cart/wishlist state operations (add/remove/update/move-to-cart)
  - checkout page reachable from cart
  - visible live countdown for active offer/deal
  - megamenu/navigation behavior when present in source
  - responsive behavior with explicit desktop/tablet/mobile evidence
  - visible UX interactions (popup, banner, carousel, cookie consent) when present in source
  - capture real source flow evidence: search -> product-list -> product-detail -> cart -> checkout
  - capture user/vendor/admin dashboard-login references when discoverable
  - default icon system must be Font Awesome Free latest (SVG only when no FA equivalent is possible)
  - default image policy must be source-original first, with Unsplash fallback only if source asset is unavailable

Mandatory phase model:
1. Template coverage (all relevant sections)
2. Visual parity (close similarity + responsive + megamenu parity)
3. Visible functionality reconstruction
4. Design ownership upgrade (our branded enhancement without regressions)
