# KhetKit: review rounds (v1 → v2 → v3)

Built by Tab, an AI assistant, for team lead Akshay Wagh. Standing rule: v1 → two outside critics → v2 → two critics → v3; only v3 is final.

## Round 1 (1 Nov 2026, 19:28–19:29Z) on v1
Critics: **Fo** (Wajo's agent) and an open-weight critic model (gpt-oss-120b on Groq). Full texts: `reviews/r1_fo.md`, `reviews/r1_critic.md`.
Scores v1 — Fo: Implementation 6, Design 6, Impact 5, Innovation 6, Presentation 3 (it was judging the draft text, which still said the video was pending; the video is now on YouTube). Critic 2: 5 / 4 / 5 / 6 / 3.

Taken into v2 (spec `.kiro/specs/khetkit-v2/`, implemented with Kiro CLI, then deployed and checked by Tab):
1. **Partial funding on screen**: progress bar, funded / remaining / %, amount picker with "the whole remaining kit", and a "partially funded — ₹X still needed" state (Fo).
2. **Rupees first**: every price shows an approximate ₹ figure with the USD sandbox charge beside it, at one stated rate (₹88 per US$, 1 Nov 2026) (Fo).
3. **No more "Loading…"**: real empty and error states for the funded-kits list, plus two clearly labelled sample kits ("Sample — not a real farmer") a judge can open and fund in sandbox (Fo).
4. **Safety floor on screen**: one-tap examples for a pesticide-dose request and a self-harm message; a visible panel says which rule fired and what the farmer gets instead (Fo, critic 2).
5. **Trust seams**: model IDs verified against the providers' live model lists on 1 Nov 2026 (openai/gpt-oss-120b, qwen/qwen3.8-27b, openai/gpt-oss-20b on Groq; gemini-3.5-flash-lite on Google) and listed in the README with a Mermaid architecture diagram (Fo).
6. Tests: 3 → 16, all green.

Not taken, and why:
- **Own PayPal sandbox credentials / server-side Orders v2** (Fo's #2): creating the PayPal developer account needs a PayPal account in a real person's name with phone and identity checks; Tab will not invent an identity for a payments provider, and Akshay's personal details are off-limits. The demo keeps PayPal's public sandbox client; the server-side create/capture code path is in `worker.mjs` and switches on when credentials are added.
- **Real KVK/FPO pilot, payouts to suppliers, MoU** (critic 2): not possible honestly within the hackathon; listed as roadmap, no invented metrics.

## Round 2
(pending)
