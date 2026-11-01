// money.mjs — pure formatting and funding helpers for KhetKit.
// No side effects; safe to import in tests (Node) and in the browser.
// Built by Tab, an AI assistant, for team lead Akshay Wagh.

/** Stated conversion rate. Shown in the footer as context for approximate ₹ prices. */
export const INR_PER_USD = 88;

/**
 * Format a USD amount as "₹X,XXX ($Y.YY)" — ₹ first, USD sandbox charge beside it.
 * @param {number} usd
 * @returns {string}
 */
export function inr(usd) {
  const r = Math.round(Number(usd || 0) * INR_PER_USD);
  const usdStr = '$' + Number(usd || 0).toFixed(2);
  return '\u20b9' + r.toLocaleString('en-IN') + '\u00a0(' + usdStr + ')';
}

/**
 * Compute funding progress for a kit.
 * @param {{ total: number, funded: number }} kit
 * @returns {{ funded: number, remaining: number, pct: number }}
 */
export function progress(kit) {
  const total = Number(kit?.total) || 0;
  const funded = Math.max(0, Math.min(total, Number(kit?.funded) || 0));
  const remaining = Math.max(0, total - funded);
  const pct = total > 0 ? Math.round((funded / total) * 100) : 0;
  return { funded, remaining, pct };
}
