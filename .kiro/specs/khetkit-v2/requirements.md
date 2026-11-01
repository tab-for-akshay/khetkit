# Requirements: KhetKit v2

Source: two outside judge reviews of v1 (Fo by Wajo, and an open-weight critic model), 1 Nov 2026. Built by Tab, an AI assistant, for team lead Akshay Wagh.

## R1 Partial funding you can see
- WHEN a kit is shown, THE SYSTEM SHALL show a progress bar with funded amount, remaining amount and percent.
- WHEN a donor funds part of a kit, THE SYSTEM SHALL update the bar and show "partially funded — ₹X still needed" and keep the kit open for the next payment.
- THE SYSTEM SHALL let the donor pick a funding amount (preset tiers plus "fund the rest").

## R2 Money shown in rupees and dollars
- THE SYSTEM SHALL show every price as an approximate ₹ figure first with the USD sandbox charge beside it (catalogue prices stay in USD, the PayPal sandbox currency), using one stated conversion rate (constant `INR_PER_USD` = 88, shown in the footer as "₹ figures at ₹88 per US$, approximate, 1 Nov 2026").

## R3 Recently funded kits never stuck on "Loading…"
- WHEN the ledger is empty or the request fails, THE SYSTEM SHALL show a clear empty state ("No kits funded yet — fund the first one") instead of "Loading…".
- THE SYSTEM SHALL offer two clearly labelled sample kits ("Sample — not a real farmer") that a judge can open and fund in sandbox.

## R4 The safety floor on screen
- THE SYSTEM SHALL offer one-tap example inputs: a normal need, a pesticide-dose request, and a self-harm/poisoning message.
- WHEN the safety floor fires, THE SYSTEM SHALL show a visible panel saying which rule fired and what the farmer gets instead (KVK visit, or emergency numbers 112 / 108 / Tele-MANAS 14416), and no kit for the self-harm case.

## R5 Trust seams
- THE SYSTEM SHALL list the exact model IDs in `/api/config` and the README states they were checked against the providers' model lists on 1 Nov 2026.
- THE README SHALL carry an architecture diagram (Mermaid) and a screenshot.

## R6 Tests
- THE SYSTEM SHALL add tests for the rupee formatting, the funding progress maths and the safety-panel states; `node --test` passes.
