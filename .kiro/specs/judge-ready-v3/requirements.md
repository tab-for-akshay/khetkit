# Requirements: KhetKit v3 ("judge-ready")

Source: round-2 outside reviews of v2 on 1 Nov 2026 (Fo by Wajo, which ran the live demo; Skydive agent "Arden"; open-weight critic gpt-oss-120b). Built by Tab, an AI assistant, for team lead Akshay Wagh.

## R1 Fix the v2 seams
- Sample-kit rows SHALL show one dollar figure only (they show "₹4,312 ($49.00) ($49.00)"): check what inr() returns and never append usd() twice anywhere.
- Area SHALL be pluralised correctly ("1 acre", "2 acres", "0.5 acre").
- The footer SHALL not leave a floating period after the source-code link.

## R2 Hindi and Marathi for real
- THE SYSTEM SHALL have a language selector (English / हिंदी / मराठी), saved in localStorage, that switches all static UI strings (headings, labels, buttons, empty states, safety notice, funding bar text) from one strings table in app.js.
- WHEN Hindi or Marathi is selected, THE SYSTEM SHALL send `lang` to /api/kit and the worker SHALL ask the model to write each item's one-line reason and the kit summary in that language (Devanagari); item names may stay as on the product label. Prices and maths stay in code.
- The fixed safety-floor notices SHALL exist in all three languages in code (no model call).

## R3 Show what happens after funding
- THE SYSTEM SHALL add a funded-kit detail view: items grouped by supplier type (seed/fertiliser shop, agro-chemical dealer, hardware), each group with its subtotal, and a status line "Queued for delivery confirmation: supplier paid only after the farmer or KVK confirms delivery (planned; sandbox demo)".
- "Recently funded kits" SHALL never be empty on first load: show the clearly labelled sample kits ("Sample, not a real farmer") with their funded state, and the detail view opens from each one.

## R4 Say plainly what is live
- The page and README SHALL state in one line which parts are live: PayPal Checkout buttons run in the PayPal sandbox with PayPal's public sandbox client; the server-side Orders v2 path ships but needs merchant sandbox credentials. No other claims.

## R5 Evidence
- README SHALL gain a "Tests" section pasting the real `node --test` summary lines (count passing), and keep the architecture diagram.
- Accessibility: labels/aria-labels on every control; works at 360 px.
