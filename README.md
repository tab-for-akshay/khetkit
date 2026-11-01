# KhetKit — AI-built farm input kits, funded with PayPal

**Live demo:** https://khetkit.sites.tab.bot/ (PayPal **sandbox**; no real money moves)
**Hackathon:** PayPal AI Hackathon 2026 (Devpost) · **Team lead:** Akshay Wagh (Pune, India)
**Disclosure:** Built by Tab, an AI assistant, for team lead Akshay Wagh. AI tools used are listed below.

## The problem
Smallholder farmers in India often buy the wrong inputs, on credit, from whoever is nearest — and pesticide advice over the counter is a known cause of overuse and poisoning. Meanwhile, people who want to help (family abroad, CSR teams, NGOs) have no simple way to fund *the right thing* for a specific farm.

## What KhetKit does
1. **Need → kit (AI agent).** A farmer (or an extension worker on their behalf) describes the problem in English, Hindi or Marathi. An LLM agent picks 2–7 items **only** from a 25-item vetted catalogue (diagnosis, traps, bio-inputs, certified seed, water and post-harvest tools), sizes them to the area and budget, and explains each in one plain sentence in the farmer's own language.
2. **Safety floor in code, after the model.** Unknown items are dropped, quantities capped, the budget enforced. A poisoning or self-harm message gets emergency numbers (108 / 112 / Tele-MANAS 14416) and **no kit**. Naming a pesticide or asking for a dose adds a KVK expert visit — KhetKit never sells or doses chemical pesticides. Anything sprayed adds a safety kit.
3. **Funding through PayPal.** PayPal Checkout with an **itemised order** (every kit line is a PayPal line item; `custom_id` = kit id). Supporters can fund the whole kit or part of it ($10 / $25); the agent tracks the balance.
4. **Fulfilment plan.** When funded, the agent groups lines by supplier type (KVK, licensed seed dealer, FPO shop, drip dealer) and prepares supplier payouts, released on delivery confirmation (PayPal Payouts — next step, see roadmap).

## PayPal integration
- **PayPal JavaScript SDK (Buttons)**, `intent=capture`, USD, sandbox.
- **Orders v2**: when `PAYPAL_CLIENT_ID` + `PAYPAL_SECRET` (sandbox REST app) are set, the Worker itself creates the order (`POST /v2/checkout/orders` with `PayPal-Request-Id` idempotency) and captures it (`POST /v2/checkout/orders/{id}/capture`) — the agent transacts server-side. Without them the demo uses PayPal's public sandbox client id (`sb`) and creates the same itemised order in the browser.
- Captures update the kit's funded balance and a public ledger (`/api/ledger`).

## AI
- Primary: `openai/gpt-oss-120b` on Groq (JSON mode). Fallbacks: `qwen/qwen3.8-27b`, `openai/gpt-oss-20b` (Groq), `gemini-3.5-flash-lite` (Gemini API), then a rule-based tag matcher.
- The model never sees prices it can change and never outputs anything that is not a catalogue id; the server recomputes every total.
- Code, copy and tests were written by Tab, an AI assistant, for team lead Akshay Wagh.

## Run it yourself
Cloudflare Worker with static assets (`site/`): entry `site/worker.mjs`, config `site/tab-site.json` (optional KV binding `DATA`).
```
cd site
npx wrangler dev worker.mjs --assets . \
  --var GROQ_API_KEY:<key> --var PAYPAL_CLIENT_ID:<sandbox id> --var PAYPAL_SECRET:<sandbox secret>
```
API: `POST /api/plan {need,crop,acres,budget}` · `POST /api/order {kit_id,kit,amount}` · `POST /api/capture {kit_id,kit,order_id}` · `GET /api/ledger` · `GET /api/config`.
Tests: `node --test test/`.

## Honest limits
- Prices are illustrative; catalogue items are generic categories, not endorsed products.
- The kit is not a diagnosis; the KVK visit exists for that reason.
- Without KV storage the kit is carried by the browser and HMAC-signed so lines and prices cannot be edited.

## Roadmap
PayPal Payouts to suppliers on delivery confirmation (photo + OTP from the farmer), Venmo/Pay Later for supporters, WhatsApp intake for farmers, KVK dashboard.

MIT licence.
