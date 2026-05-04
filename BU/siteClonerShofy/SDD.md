# SDD - SiteClonerShofy

## 1. Architecture Summary
- Runtime: WAIBA playbook engine
- Orchestration: modular playbooks (numbered tree)
- Reusable module import: `C:\git\wb_pr\_shared\web\site-cloner-playbooks`

## 2. Pipeline
1. Capture source references
- Navigate source page
- Screenshot viewport
- Extract interactive DOM map
- Optional vision/OCR textual analysis

2. Scaffold clone template
- Generate Vue3 SFC pages by route
- Use DaisyUI5 + Tailwind4 runtime style layer
- Produce route-aware SPA shell and no-Node preview
- Build a commerce interaction layer (state + persistence) for cart/wishlist/checkout/countdown

3. Visual parity hardening
- Enforce close above-the-fold parity for key routes
- Enforce megamenu/nav parity when present in source
- Enforce premium real parity (micro-interactions, hover/reveal behavior, hierarchy fidelity)
- Capture responsive previews (desktop/tablet/mobile)

4. Review with Set-of-Marks
- Overlay numeric IDs on interactive elements
- Persist maps/screenshots for targeted customization

5. Enforce ecommerce parity gates
- Validate critical above-the-fold parity is close to source for ecommerce entry points
- Fail pipeline if core ecommerce interactions are missing (cart/wishlist/checkout/countdown/counters)

6. Design ownership upgrade
- Apply own design layer after parity and behavior reconstruction
- Preserve core ecommerce function while improving identity

## 3. Data Artifacts
- `playbooks/output/reference/`
- `playbooks/output/set_of_marks/`
- `playbooks/output/readiness_report.json`
- `template/` generated deliverable

## Perception -> Decision -> Action Architecture
- Perceive source with screenshot + DOM snapshot
- Decide baseline component strategy with DaisyUI first
- Act via generated Vue pages
- Verify via generated artifact checks and page count checks

## Architect-Level Runtime Constraints (Mandatory)
- Keep reusable site-cloner logic in `C:\git\wb_pr\_shared\web\site-cloner-playbooks`.
- Keep project-specific behavior in project playbooks only.

## Structural Decomposition Policy (Mandatory)
- Max 600 lines/file; split by responsibility.

## Online Flow Implementation Boundary (Mandatory)
- No dedicated online vertical AHK skill for cloning workflow.

## Ecommerce Clone Hard Policy (Mandatory)
- Clone output must not stop at static look-alike; it must include functional ecommerce flows.
- Minimum mandatory flows: wishlist, cart, checkout, and countdown with live state synchronization.
- Minimum mandatory UI parity modules: megamenu, responsive layout set, popup/banner/cookie interactions, and carousel when visible in source.
- Premium real parity gate: variant/attribute behavior and interactive depth must be rebuilt when visible in source.


## Completion Record

- task: Clone Shofy storefront sections into a reusable Vue3 + Tailwind4 + DaisyUI5 template
- status: completed
- completed_at: 2026-02-15 14:31:13
