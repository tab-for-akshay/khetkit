# Devpost submission draft — PayPal AI Hackathon 2026 (deadline Nov 12, 2026, 12:00 pm PT)
Status: DRAFT. Do not submit until Akshay (Representative) reviews. Final Submit = Akshay's tap.

**Project name:** KhetKit
**Tagline:** A farmer describes the problem, an AI agent builds a safe, budgeted kit of inputs, and anyone can fund it with PayPal.
**Built with:** paypal-javascript-sdk, paypal-orders-v2, cloudflare-workers, groq, gpt-oss-120b, qwen, gemini-api, javascript, html, css
**Try it:** https://khetkit.sites.tab.bot/ (PayPal sandbox) · **Code:** https://github.com/tab-for-akshay/khetkit (MIT)
**Video:** <YouTube link — to upload; script in VIDEO_SCRIPT.md>
**AI disclosure:** Built by Tab, an AI assistant, for team lead Akshay Wagh. Tab wrote the code, copy and tests; the product uses gpt-oss-120b (Groq) with Qwen/Gemini fallbacks at runtime.

## Inspiration
Indian smallholders often buy inputs on credit from the nearest shop, and over-the-counter pesticide advice is a known driver of overuse and poisonings. At the same time, relatives abroad, CSR teams and NGOs want to help a specific farm but can only send cash. We wanted the help to arrive as *the right inputs*, chosen safely, and paid for in one tap.

## What it does
- Takes a need in plain English, Hindi or Marathi ("tomato leaves curling, tiny white insects").
- An AI procurement agent builds a 2–7 item kit **only from a vetted 25-item catalogue** (diagnosis, traps, bio-inputs, certified seed, water and post-harvest tools), sized to the area and budget, each item with a one-line reason in the farmer's language.
- A **safety floor in code** runs after the model: poisoning/self-harm text gets emergency numbers and no kit; a pesticide name or dose question forces a KVK expert visit (KhetKit never sells or doses chemical pesticides); sprayed items force a safety kit; the budget is enforced by the server.
- Supporters fund the whole kit or a part of it through **PayPal Checkout**; each kit line becomes a PayPal line item; partial funding is tracked to 100%.
- Once funded, the agent produces a **fulfilment plan** grouping lines by supplier (KVK, licensed seed dealer, FPO shop) with supplier payouts queued for delivery confirmation.

## How we built it
Cloudflare Worker + static front end. `/api/plan` calls gpt-oss-120b on Groq in JSON mode (fallbacks: qwen3.8-27b, gpt-oss-20b, gemini-3.5-flash-lite, then a rules engine). The server validates catalogue ids, caps quantities, recomputes all prices and HMAC-signs the kit so a browser cannot edit lines or prices. PayPal: JS SDK Buttons (`intent=capture`) and Orders v2; with a sandbox REST app configured, the Worker creates (`POST /v2/checkout/orders`, idempotent `PayPal-Request-Id`) and captures orders itself, so the agent actually transacts.

## Challenges
Keeping an LLM helpful for farmers without ever letting it recommend a pesticide or a dose: we moved every safety rule out of the prompt and into code that runs after the model. Making partial funding honest (amounts capped to the remaining balance, server-side recompute).

## Accomplishments
Multilingual kits in ~2 s; a safety floor that is testable (`node --test`); itemised PayPal orders that read like a real invoice.

## What we learned
Agentic commerce needs a "boring" layer: catalogue constraints, budgets, idempotency and receipts matter more than the model.

## What's next
PayPal Payouts to suppliers on delivery confirmation (farmer OTP + photo), Pay Later/Venmo for supporters, WhatsApp intake, a KVK review queue.

## Open items before Akshay submits
1. PayPal developer sandbox account (developer.paypal.com) — needs a phone number at signup; then set PAYPAL_CLIENT_ID/SECRET so orders are server-side (demo currently uses PayPal's public sandbox client).
2. Upload the demo video to YouTube (public), < 3 min.
3. Representative on the Devpost project = Akshay Wagh; add Tab's Devpost (tab-for-akshay) as builder only if he wants.
