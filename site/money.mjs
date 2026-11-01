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
 * Format a USD amount as "$Y.YY" — used where ₹ is already shown.
 * @param {number} usd
 * @returns {string}
 */
export function usd(usd) {
  return '$' + Number(usd || 0).toFixed(2);
}

/**
 * Pluralise a unit noun.
 * plural(1, 'acre') => '1 acre'
 * plural(2, 'acre') => '2 acres'
 * plural(0.5, 'acre') => '0.5 acre'
 * @param {number} n
 * @param {string} noun
 * @returns {string}
 */
export function plural(n, noun) {
  const num = Number(n);
  // Singular for exactly 1, or for non-integer values (e.g. 0.5 acre).
  // Plural for 0 and integers > 1.
  const isInt = Number.isInteger(num);
  const s = (num === 1 || !isInt) ? noun : noun + 's';
  return num + '\u00a0' + s;
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

// Catalogue category → supplier type mapping (must match worker.mjs route map).
const SUPPLIER_MAP = {
  'Diagnosis': 'KVK / accredited soil lab',
  'Pest monitoring': 'FPO input shop',
  'Bio-inputs': 'FPO input shop',
  'Nutrition': 'FPO input shop',
  'Seeds': 'Licensed seed dealer',
  'Protection': 'FPO input shop',
  'Water & soil': 'Drip / hardware dealer',
  'Equipment': 'FPO custom hiring centre',
  'Safety': 'FPO input shop',
  'Post-harvest': 'FPO input shop',
};

/**
 * Group kit lines by supplier type.
 * Returns an array of { supplier, items, subtotal } objects sorted by supplier name.
 * @param {Array<{id:string, name:string, category:string, qty:number, line_total:number}>} lines
 * @returns {Array<{supplier:string, items:Array, subtotal:number}>}
 */
export function groupBySupplier(lines) {
  const groups = {};
  for (const line of (lines || [])) {
    const supplier = SUPPLIER_MAP[line.category] || 'FPO input shop';
    if (!groups[supplier]) groups[supplier] = { supplier, items: [], subtotal: 0 };
    groups[supplier].items.push(line);
    groups[supplier].subtotal = Math.round((groups[supplier].subtotal + (line.line_total || 0)) * 100) / 100;
  }
  return Object.values(groups).sort((a, b) => a.supplier.localeCompare(b.supplier));
}
