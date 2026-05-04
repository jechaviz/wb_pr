# RP Rental Odoo Daily Workflow (User Training)

This document is the English training guide for the daily workflow that was migrated from manual operations into Odoo.

Target instance:

- https://yeaipsoluciones-rpp-rental.odoo.com/odoo

## Scope

This guide covers the end-to-end lifecycle:

- Customer preparation
- Rental quote and contract
- Delivery operations
- In-rental changes (extensions, exchanges, partial returns)
- Full return and Quality checks
- Billing and payments
- Reporting and closeout

## Before You Start

- Use Odoo as the source of truth. Avoid running parallel "shadow" tracking in spreadsheets or chat.
- If you cannot see a menu/button, do not bypass the process. Request the correct access group/role.
- Always work with real, imported data (catalog, assets, rates) unless you are explicitly in a training/demo database.

## Daily Workflow (Recommended Order)

### 1) Start-of-Day Checks

- Review your assigned tasks and any overdue rentals.
- Check the Quality backlog: equipment must be "Ready-To-Rent" before it can go out again.
- Check Accounting status: overdue invoices and outstanding payments.

### 2) Customer Readiness

- Search the customer first to avoid duplicates.
- Confirm:
- Billing contact and delivery contact
- Phone and email
- Address (delivery location matters for logistics)
- Payment terms and tax configuration (if applicable)

### 3) Equipment and Availability

- Find rental products in the catalog (use product codes to search quickly).
- Confirm the product is rentable and the required physical assets exist.
- Always check availability for the exact rental period before committing to the customer.

### 4) Create a Rental Quote

- Create a new quotation for the customer.
- Add rental items.
- Set rental start and end dates.
- Re-check availability after dates are set.
- Review pricing and commercial terms.

Critical rule:

- Set dates before pricing validation. Dates drive both availability and rental price computation.

### 5) Confirm Quote to Contract

- After customer approval, confirm the quotation.
- The confirmed order becomes the operational contract that drives:
- Delivery orders
- Returns
- Billing

### 6) Delivery Operations

- Open the delivery order from the contract.
- Confirm:
- Warehouse/location
- Destination
- Correct assets (serial/lot) if your process tracks physical units
- Validate delivery in Odoo when the equipment leaves.
- Capture required evidence (photos, notes, signatures) in the appropriate record.

### 7) In-Rental Changes

Common changes you must record in Odoo:

- Date extensions (do not keep extensions "only in email")
- Quantity changes
- Exchanges (asset replacement)
- Partial returns

Each change affects availability, traceability, and billing.

### 8) Return and Quality Control

- Validate the return picking when equipment comes back.
- Run the Rental Return inspection to capture condition and issues.
- Complete the Ready-To-Rent inspection before dispatching the unit again.

Quality is not optional:

- If QC is skipped, bad equipment can be dispatched and cause downstream failures and customer dissatisfaction.

### 9) Billing and Payments

- Generate invoices from the rental order/contract.
- Review invoice lines, taxes, and billing periods.
- Send invoices from Odoo so communication is trackable.
- Register payments and reconcile so reports stay accurate.

If the business uses the "3-3-3" rule:

- Apply it consistently (daily/weekly/monthly logic must match the contract terms).

### 10) Reporting and Closeout

Use Odoo reports to monitor:

- Open rentals and overdue returns
- Asset utilization
- Invoices due and aging
- Quality backlog

Closeout checklist:

- Returned: yes
- QC completed: yes
- Billing completed: yes
- Evidence archived: yes

## Common Mistakes (Avoid These)

- Promising equipment without checking availability for the requested dates.
- Setting pricing before setting dates.
- Tracking extensions/exchanges only in chat/email.
- Skipping Quality checks.
- Registering payments outside Odoo, then wondering why reports are wrong.

## How This Tutorial Package Is Produced (Pipeline)

This project generates tutorial artifacts (storyboard, subtitles, zoom metadata, and an ffmpeg render plan).

Inputs (you provide):

- Screen recording: `playbooks/tutorial/assets/odoo_training_capture.mp4`
- Optional music: `playbooks/tutorial/assets/background_music.mp3`

Outputs (generated):

- Storyboard JSON: `playbooks/tutorial/timeline/storyboard.odoo.en.json`
- Subtitles: `playbooks/tutorial/subtitles/subtitles.en.srt` and `subtitles.stacked.ass`
- Zoom keyframes metadata: `playbooks/tutorial/zoom/mouse_zoom.keyframes.json`
- Render plan + commands: `playbooks/tutorial/render/render.plan.json` and `render.cmd`

Notes:

- This project generates commands; it does not automatically publish the final video.
- To produce the final MP4, run the generated `render.cmd` on a machine with `ffmpeg` installed.
