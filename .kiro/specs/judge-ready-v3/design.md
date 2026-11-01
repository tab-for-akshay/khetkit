# Design: KhetKit v3
- app.js: const STR = {en:{...}, hi:{...}, mr:{...}}; t(key) helper; data-i18n attributes in index.html filled on load and on language change.
- worker.mjs: accept body.lang in {en,hi,mr}; prompt line "Write every reason and the summary in Hindi (Devanagari)" etc.; SAFETY notices per language.
- groupBySupplier(items) pure function in money.mjs (category -> supplier type) so it is unit-testable.
- plural(n, 'acre') helper in money.mjs.
