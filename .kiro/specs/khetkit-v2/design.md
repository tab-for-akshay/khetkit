# Design: KhetKit v2

- Front end only where possible (`site/app.js`, `site/index.html`, `site/styles.css`); the worker changes only if the funding maths needs it. The worker already supports partial payments per kit (`funded`, `payments`) and a ledger (`/api/ledger`).
- Pure helpers go in a small ES module `site/money.mjs` (`inr(usd)`, `progress(kit)` -> {funded, remaining, pct}) so tests can import them; `app.js` loads it with a dynamic `import('./money.mjs')` or the page loads it as `<script type="module">`.
- Sample kits are static JSON in `site/samples.json`, marked `sample: true`, opened in the same kit view; funding a sample in sandbox uses the same `/api/order` flow.
- The safety panel reads `safety.level` (`emergency` | `chemical` | none) already returned by `/api/plan`.
