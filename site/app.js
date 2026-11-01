// app.js — KhetKit front end.
// Built by Tab, an AI assistant, for team lead Akshay Wagh.
'use strict';

// Dynamic import of the pure money helpers so tests can also import them.
let _money = null;
async function getMoney() {
  if (!_money) _money = await import('./money.mjs');
  return _money;
}

const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const usd = n => '$' + Number(n || 0).toFixed(2);

// ---------- i18n strings table ----------
// All static UI strings in English, Hindi (Devanagari) and Marathi (Devanagari).
const STR = {
  en: {
    build_h:       'The farmer\'s need',
    examples_lbl:  'Try one of these one-tap examples — including two that show the safety floor:',
    examples_aria: 'Examples',
    need_lbl:      'What is going wrong, or what is needed?',
    need_ph:       'e.g. My 1 acre tomato is 40 days old, leaves are curling and small white insects fly up when I touch the plants.',
    crop_lbl:      'Crop',
    area_lbl:      'Area (acres)',
    budget_lbl:    'Kit budget (USD)',
    go_btn:        'Build the kit',
    status_building: 'The agent is reading the need and the catalogue\u2026',
    kit_h:         'The agent\u2019s kit',
    fund_h:        'Fund it with PayPal',
    fund_progress: 'Funding progress',
    fund_amounts:  'Funding amount',
    fund_whole:    'The whole remaining kit',
    done_h:        'Receipt and the agent\u2019s fulfilment plan',
    samples_h:     'Sample kits \u2014 open and fund in sandbox',
    samples_meta:  'These are clearly labelled sample kits, not real farmers. They use the same /api/order flow as a real kit so judges can test the full PayPal sandbox path without filling in the form.',
    samples_loading: 'Loading samples\u2026',
    samples_empty: 'No sample kits available.',
    samples_error: 'Could not load sample kits.',
    samples_open:  'Open this sample kit \u2192',
    samples_open_aria: 'Open sample kit for',
    ledger_h:      'Recently funded kits (sandbox)',
    ledger_loading: 'Loading\u2026',
    ledger_empty:  'No kits funded yet \u2014 fund the first one (sandbox).',
    ledger_unavail: 'Ledger unavailable.',
    how_h:         'How it works',
    sample_badge:  'Sample \u2014 not a real farmer',
    sample_default:'Sample \u2014 not a real farmer',
    partial_funded: 'partially funded',
    fully_funded:  'Fully funded',
    not_diagnosis: 'Not a diagnosis: confirm with your KVK.',
    detail_status: 'Queued for delivery confirmation: supplier paid only after the farmer or KVK confirms delivery (planned; sandbox demo).',
    live_line:     'What is live: PayPal Checkout buttons run in the PayPal sandbox with PayPal\u2019s public sandbox client. The server-side Orders\u00a0v2 path ships but needs merchant sandbox credentials (PAYPAL_CLIENT_ID + PAYPAL_SECRET) to activate.',
    lang_label:    'Language',
  },
  hi: {
    build_h:       '\u0915\u093f\u0938\u093e\u0928 \u0915\u0940 \u091c\u093c\u0930\u0942\u0930\u0924',
    examples_lbl:  '\u0907\u0928\u092e\u0947\u0902 \u0938\u0947 \u090f\u0915 \u0909\u0926\u093e\u0939\u0930\u0923 \u091f\u0948\u092a \u0915\u0930\u0947\u0902 \u2014 \u0926\u094b \u0938\u0941\u0930\u0915\u094d\u0937\u093e \u092b\u093c\u0930\u094d\u0936 \u0926\u093f\u0916\u093e\u0924\u0947 \u0939\u0948\u0902:',
    examples_aria: '\u0909\u0926\u093e\u0939\u0930\u0923',
    need_lbl:      '\u0915\u094d\u092f\u093e \u0938\u092e\u0938\u094d\u092f\u093e \u0939\u094b \u0930\u0939\u0940 \u0939\u0948, \u092f\u093e \u0915\u094d\u092f\u093e \u091a\u093e\u0939\u093f\u090f?',
    need_ph:       '\u091c\u0948\u0938\u0947: \u092e\u0947\u0930\u0947 1 \u090f\u0915\u095c \u091f\u092e\u093e\u091f\u0930 \u092e\u0947\u0902 40 \u0926\u093f\u0928 \u0939\u0941\u090f\u0964 \u092a\u0924\u094d\u0924\u093f\u092f\u093e\u0901 \u0915\u0941\u0902\u0921\u0932\u0940 \u0939\u094b \u0930\u0939\u0940 \u0939\u0948\u0902\u0964',
    crop_lbl:      '\u092b\u0938\u0932',
    area_lbl:      '\u0915\u094d\u0937\u0947\u0924\u094d\u0930\u092b\u0932 (\u090f\u0915\u095c)',
    budget_lbl:    '\u092c\u091c\u091f (USD)',
    go_btn:        '\u0915\u093f\u091f \u092c\u0928\u093e\u090f\u0901',
    status_building: '\u090f\u091c\u0947\u0902\u091f \u091c\u093c\u0930\u0942\u0930\u0924 \u0914\u0930 \u0915\u0948\u091f\u0932\u0949\u0917 \u092a\u095d \u0930\u0939\u093e \u0939\u0948\u2026',
    kit_h:         '\u090f\u091c\u0947\u0902\u091f \u0915\u093e \u0915\u093f\u091f',
    fund_h:        'PayPal \u0938\u0947 \u092b\u0902\u0921 \u0915\u0930\u0947\u0902',
    fund_progress: '\u092b\u0902\u0921\u093f\u0902\u0917 \u092a\u094d\u0930\u0917\u0924\u093f',
    fund_amounts:  '\u0930\u093e\u0936\u093f \u091a\u0941\u0928\u0947\u0902',
    fund_whole:    '\u092a\u0942\u0930\u093e \u0936\u0947\u0937 \u0915\u093f\u091f',
    done_h:        '\u0930\u0938\u0940\u0926 \u0914\u0930 \u0906\u092a\u0942\u0930\u094d\u0924\u093f \u092f\u094b\u091c\u0928\u093e',
    samples_h:     '\u0928\u092e\u0942\u0928\u093e \u0915\u093f\u091f \u2014 \u0938\u0948\u0902\u0921\u092c\u0949\u0915\u094d\u0938 \u092e\u0947\u0902 \u0916\u094b\u0932\u0947\u0902 \u0914\u0930 \u092b\u0902\u0921 \u0915\u0930\u0947\u0902',
    samples_meta:  '\u092f\u0947 \u0938\u093e\u092b\u093c \u0932\u0947\u092c\u0932 \u0935\u093e\u0932\u0947 \u0928\u092e\u0942\u0928\u093e \u0915\u093f\u091f \u0939\u0948\u0902, \u0935\u093e\u0938\u094d\u0924\u0935\u093f\u0915 \u0915\u093f\u0938\u093e\u0928 \u0928\u0939\u0940\u0902\u0964',
    samples_loading: '\u0928\u092e\u0942\u0928\u0947 \u0932\u094b\u0921 \u0939\u094b \u0930\u0939\u0947 \u0939\u0948\u0902\u2026',
    samples_empty: '\u0915\u094b\u0908 \u0928\u092e\u0942\u0928\u093e \u0915\u093f\u091f \u0909\u092a\u0932\u092c\u094d\u0927 \u0928\u0939\u0940\u0902\u0964',
    samples_error: '\u0928\u092e\u0942\u0928\u093e \u0915\u093f\u091f \u0932\u094b\u0921 \u0928\u0939\u0940\u0902 \u0939\u094b \u0938\u0915\u093e\u0964',
    samples_open:  '\u092f\u0939 \u0928\u092e\u0942\u0928\u093e \u0915\u093f\u091f \u0916\u094b\u0932\u0947\u0902 \u2192',
    samples_open_aria: '\u0928\u092e\u0942\u0928\u093e \u0915\u093f\u091f \u0916\u094b\u0932\u0947\u0902',
    ledger_h:      '\u0939\u093e\u0932 \u092e\u0947\u0902 \u092b\u0902\u0921 \u0939\u0941\u090f \u0915\u093f\u091f (sandbox)',
    ledger_loading: '\u0932\u094b\u0921 \u0939\u094b \u0930\u0939\u093e \u0939\u0948\u2026',
    ledger_empty:  '\u0905\u092d\u0940 \u0924\u0915 \u0915\u094b\u0908 \u0915\u093f\u091f \u092b\u0902\u0921 \u0928\u0939\u0940\u0902 \u0939\u0941\u0906 \u2014 \u092a\u0939\u0932\u093e \u092b\u0902\u0921 \u0915\u0930\u0947\u0902 (sandbox)\u0964',
    ledger_unavail: '\u0932\u0947\u091c\u0930 \u0909\u092a\u0932\u092c\u094d\u0927 \u0928\u0939\u0940\u0902\u0964',
    how_h:         '\u092f\u0939 \u0915\u0948\u0938\u0947 \u0915\u093e\u092e \u0915\u0930\u0924\u093e \u0939\u0948',
    sample_badge:  '\u0928\u092e\u0942\u0928\u093e \u2014 \u0935\u093e\u0938\u094d\u0924\u0935\u093f\u0915 \u0915\u093f\u0938\u093e\u0928 \u0928\u0939\u0940\u0902',
    sample_default:'\u0928\u092e\u0942\u0928\u093e \u2014 \u0935\u093e\u0938\u094d\u0924\u0935\u093f\u0915 \u0915\u093f\u0938\u093e\u0928 \u0928\u0939\u0940\u0902',
    partial_funded: '\u0906\u0902\u0936\u093f\u0915 \u092b\u0902\u0921\u093f\u0902\u0917',
    fully_funded:  '\u092a\u0942\u0930\u0940 \u0924\u0930\u0939 \u092b\u0902\u0921',
    not_diagnosis: '\u092f\u0939 \u0928\u093f\u0926\u093e\u0928 \u0928\u0939\u0940\u0902: \u0905\u092a\u0928\u0947 \u0915\u0947\u0935\u0940\u0915\u0947 \u0938\u0947 \u092a\u0941\u0937\u094d\u091f\u093f \u0915\u0930\u0947\u0902\u0964',
    detail_status: '\u0921\u093f\u0932\u093f\u0935\u0930\u0940 \u092a\u0941\u0937\u094d\u091f\u093f \u0915\u0947 \u0932\u093f\u090f \u0915\u094d\u092f\u0942 \u092e\u0947\u0902: \u0915\u093f\u0938\u093e\u0928 \u092f\u093e \u0915\u0947\u0935\u0940\u0915\u0947 \u0915\u0940 \u0921\u093f\u0932\u093f\u0935\u0930\u0940 \u092a\u0941\u0937\u094d\u091f\u093f \u0915\u0947 \u092c\u093e\u0926 \u0939\u0940 \u0906\u092a\u0942\u0930\u094d\u0924\u093f\u0915\u0930\u094d\u0924\u093e \u0915\u094b \u092d\u0941\u0917\u0924\u093e\u0928 (\u092f\u094b\u091c\u0928\u093e; sandbox \u0921\u0947\u092e\u094b)\u0964',
    live_line:     '\u0915\u094d\u092f\u093e \u0932\u093e\u0907\u0935 \u0939\u0948: PayPal Checkout \u092c\u091f\u0928 PayPal \u0915\u0947 \u092a\u092c\u094d\u0932\u093f\u0915 sandbox \u0915\u094d\u0932\u093e\u0907\u0902\u091f \u0938\u0947 \u091a\u0932\u0924\u0947 \u0939\u0948\u0902\u0964 \u0938\u0930\u094d\u0935\u0930-\u0938\u093e\u0907\u0921 Orders\u00a0v2 \u0936\u093f\u092a \u0939\u094b\u0924\u093e \u0939\u0948 \u0932\u0947\u0915\u093f\u0928 \u0938\u0915\u094d\u0930\u093f\u092f \u0915\u0930\u0928\u0947 \u0915\u0947 \u0932\u093f\u090f merchant sandbox credentials \u091a\u093e\u0939\u093f\u090f\u0964',
    lang_label:    '\u092d\u093e\u0937\u093e',
  },
  mr: {
    build_h:       '\u0936\u0947\u0924\u0915\u0930\u094d\u092f\u093e\u091a\u0940 \u0917\u0930\u091c',
    examples_lbl:  '\u092f\u093e\u092a\u0948\u0915\u0940 \u090f\u0916\u093e\u0926\u093e \u0909\u0926\u093e\u0939\u0930\u0923 \u091f\u0945\u092a \u0915\u0930\u093e \u2014 \u0926\u094b\u0928 \u0938\u0941\u0930\u0915\u094d\u0937\u093e \u092b\u0930\u0936 \u0926\u093e\u0916\u0935\u0924\u093e\u0924:',
    examples_aria: '\u0909\u0926\u093e\u0939\u0930\u0923\u0947',
    need_lbl:      'काय समस्या आहे, किंवा काय हवे आहे?',
    need_ph:       '\u0909\u0926\u093e: \u092e\u093e\u091d\u094d\u092f\u093e 1 \u090f\u0915\u0930 \u091f\u094b\u092e\u0945\u091f\u094b\u0932\u093e 40 \u0926\u093f\u0935\u0938 \u0906\u0939\u0947\u0924\u0964',
    crop_lbl:      '\u092a\u093f\u0915',
    area_lbl:      '\u0915\u094d\u0937\u0947\u0924\u094d\u0930 (\u090f\u0915\u0930)',
    budget_lbl:    '\u092c\u091c\u0947\u091f (USD)',
    go_btn:        '\u0915\u093f\u091f \u0924\u092f\u093e\u0930 \u0915\u0930\u093e',
    status_building: '\u090f\u091c\u0902\u091f \u0917\u0930\u091c \u0906\u0923\u093f \u0915\u0945\u091f\u0932\u0949\u0917 \u0935\u093e\u091a\u0924 \u0906\u0939\u0947\u2026',
    kit_h:         '\u090f\u091c\u0902\u091f\u091a\u0947 \u0915\u093f\u091f',
    fund_h:        'PayPal \u0928\u0947 \u092b\u0902\u0921 \u0915\u0930\u093e',
    fund_progress: '\u092b\u0902\u0921\u093f\u0902\u0917 \u092a\u094d\u0930\u0917\u0924\u0940',
    fund_amounts:  '\u0930\u0915\u094d\u0915\u092e \u0928\u093f\u0935\u0921\u093e',
    fund_whole:    '\u0938\u0902\u092a\u0942\u0930\u094d\u0923 \u0909\u0930\u0932\u0947\u0932\u0947 \u0915\u093f\u091f',
    done_h:        '\u092a\u093e\u0935\u0924\u0940 \u0906\u0923\u093f \u092a\u0941\u0930\u0935\u0920\u093e \u092f\u094b\u091c\u0928\u093e',
    samples_h:     '\u0928\u092e\u0941\u0928\u093e \u0915\u093f\u091f \u2014 sandbox \u092e\u0927\u094d\u092f\u0947 \u0909\u0918\u0921\u093e \u0906\u0923\u093f \u092b\u0902\u0921 \u0915\u0930\u093e',
    samples_meta:  '\u0939\u0947 \u0938\u094d\u092a\u0937\u094d\u091f \u0932\u0947\u092c\u0932 \u0915\u0947\u0932\u0947\u0932\u0947 \u0928\u092e\u0941\u0928\u093e \u0915\u093f\u091f \u0906\u0939\u0947\u0924, \u0916\u0930\u0947 \u0936\u0947\u0924\u0915\u0930\u0940 \u0928\u093e\u0939\u0940\u0924\u0964',
    samples_loading: '\u0928\u092e\u0941\u0928\u0947 \u0932\u094b\u0921 \u0939\u094b\u0924 \u0906\u0939\u0947\u0924\u2026',
    samples_empty: '\u0915\u094b\u0923\u0924\u0947\u0939\u0940 \u0928\u092e\u0941\u0928\u093e \u0915\u093f\u091f \u0909\u092a\u0932\u092c\u094d\u0927 \u0928\u093e\u0939\u0940\u0924\u0964',
    samples_error: '\u0928\u092e\u0941\u0928\u093e \u0915\u093f\u091f \u0932\u094b\u0921 \u0915\u0930\u0924\u093e \u0906\u0932\u0947 \u0928\u093e\u0939\u0940\u0924\u0964',
    samples_open:  '\u0939\u0947 \u0928\u092e\u0941\u0928\u093e \u0915\u093f\u091f \u0909\u0918\u0921\u093e \u2192',
    samples_open_aria: '\u0928\u092e\u0941\u0928\u093e \u0915\u093f\u091f \u0909\u0918\u0921\u093e',
    ledger_h:      '\u0905\u0932\u0940\u0915\u0921\u0947 \u092b\u0902\u0921 \u0915\u0947\u0932\u0947\u0932\u0947 \u0915\u093f\u091f (sandbox)',
    ledger_loading: '\u0932\u094b\u0921 \u0939\u094b\u0924 \u0906\u0939\u0947\u2026',
    ledger_empty:  '\u0905\u091c\u0942\u0928 \u0915\u094b\u0923\u0924\u093e\u0939\u0940 \u0915\u093f\u091f \u092b\u0902\u0921 \u0928\u093e\u0939\u0940 \u2014 \u092a\u0939\u093f\u0932\u093e \u092b\u0902\u0921 \u0915\u0930\u093e (sandbox)\u0964',
    ledger_unavail: '\u0932\u0947\u091c\u0930 \u0909\u092a\u0932\u092c\u094d\u0927 \u0928\u093e\u0939\u0940\u0964',
    how_h:         '\u0939\u0947 \u0915\u0938\u0947 \u0915\u093e\u092e \u0915\u0930\u0924\u0947',
    sample_badge:  '\u0928\u092e\u0941\u0928\u093e \u2014 \u0916\u0930\u0947 \u0936\u0947\u0924\u0915\u0930\u0940 \u0928\u093e\u0939\u0940',
    sample_default:'\u0928\u092e\u0941\u0928\u093e \u2014 \u0916\u0930\u0947 \u0936\u0947\u0924\u0915\u0930\u0940 \u0928\u093e\u0939\u0940',
    partial_funded: '\u0905\u0902\u0936\u0924\u0903 \u092b\u0902\u0921',
    fully_funded:  '\u092a\u0942\u0930\u094d\u0923\u092a\u0923\u0947 \u092b\u0902\u0921',
    not_diagnosis: '\u0939\u0947 \u0928\u093f\u0926\u093e\u0928 \u0928\u093e\u0939\u0940: \u0906\u092a\u0932\u094d\u092f\u093e \u0915\u0947\u0935\u0940\u0915\u0947\u0936\u0940 \u0916\u093e\u0924\u094d\u0930\u0940 \u0915\u0930\u093e\u0964',
    detail_status: '\u0921\u093f\u0932\u093f\u0935\u094d\u0939\u0930\u0940 \u092a\u0941\u0937\u094d\u091f\u0940\u0938\u093e\u0920\u0940 \u0930\u093e\u0902\u0917\u0947\u0924: \u0936\u0947\u0924\u0915\u0930\u0940 \u0915\u093f\u0902\u0935\u093e \u0915\u0947\u0935\u0940\u0915\u0947 \u0921\u093f\u0932\u093f\u0935\u094d\u0939\u0930\u0940 \u0928\u093f\u0936\u094d\u091a\u093f\u0924 \u0915\u0947\u0932\u094d\u092f\u093e\u0928\u0902\u0924\u0930\u0939\u0940 \u092a\u0941\u0930\u0935\u0920\u093e\u0926\u093e\u0930\u093e\u0932\u093e \u092a\u0948\u0938\u0947 (\u092f\u094b\u091c\u0928\u093e; sandbox \u0921\u0947\u092e\u094b)\u0964',
    live_line:     '\u0915\u093e\u092f \u0932\u093e\u0907\u0935 \u0906\u0939\u0947: PayPal Checkout \u092c\u091f\u0923\u0947 PayPal \u091a\u094d\u092f\u093e \u092a\u092c\u094d\u0932\u093f\u0915 sandbox \u0915\u094d\u0932\u093e\u092f\u0902\u091f\u0928\u0947 \u091a\u093e\u0932\u0924\u093e\u0924\u0964 \u0938\u0930\u094d\u0935\u094d\u0939\u0930-\u0938\u093e\u0907\u0921 Orders\u00a0v2 \u0936\u093f\u092a \u0939\u094b\u0924\u094b \u092a\u0923 \u0938\u0915\u094d\u0930\u093f\u092f \u0915\u0930\u0923\u094d\u092f\u093e\u0938\u093e\u0920\u0940 merchant sandbox credentials \u0932\u093e\u0917\u0924\u093e\u0924\u0964',
    lang_label:    '\u092d\u093e\u0937\u093e',
  },
};

// Current language; persisted in localStorage.
let LANG = (() => {
  try { const s = localStorage.getItem('khetkit_lang'); return ['en','hi','mr'].includes(s) ? s : 'en'; } catch { return 'en'; }
})();

/** Translate a key using current LANG. Falls back to 'en'. */
function t(key) {
  return (STR[LANG] && STR[LANG][key]) || STR.en[key] || key;
}

/** Apply all data-i18n attribute translations and aria-label updates to the page. */
function applyI18n() {
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.dataset.i18n;
    if (el.tagName === 'INPUT' && el.placeholder !== undefined) {
      el.placeholder = t(key);
    } else if (el.tagName === 'BUTTON' || el.tagName === 'LABEL' || el.tagName === 'SPAN' || el.tagName === 'P' || el.tagName === 'H2') {
      el.textContent = t(key);
    } else {
      el.textContent = t(key);
    }
  });
  document.querySelectorAll('[data-i18n-aria]').forEach(el => {
    el.setAttribute('aria-label', t(el.dataset.i18nAria));
  });
  // Update html lang attribute
  document.documentElement.lang = LANG;
  // Re-render dynamic sections that cache translated text
  loadSamples();
  loadLedger();
}

/** Set language, persist, and re-render. */
function setLang(l) {
  if (!['en','hi','mr'].includes(l)) return;
  LANG = l;
  try { localStorage.setItem('khetkit_lang', l); } catch {}
  // Update selector UI
  document.querySelectorAll('.lang-btn').forEach(b => {
    b.setAttribute('aria-pressed', b.dataset.lang === l ? 'true' : 'false');
    b.classList.toggle('lang-active', b.dataset.lang === l);
  });
  applyI18n();
}

// Example inputs — indices 0-2 are normal needs, 3 is a pesticide-dose (chemical safety floor),
// 4 is a self-harm / poisoning message (emergency safety floor).
const EX = [
  { need: 'My 1 acre tomato is 40 days old. Leaves are curling upward and turning small, and tiny white insects fly up when I touch the plants. What should I buy?', crop: 'Tomato', acres: 1, budget: 60 },
  { need: 'मेरे 2 एकड़ टमाटर में फल में छेद हो रहे हैं और अंदर इल्ली मिल रही है। फूल अभी भी आ रहे हैं। कम खर्च में क्या लूँ?', crop: 'टमाटर', acres: 2, budget: 50 },
  { need: 'Rain-fed tur (pigeon pea) on 3 acres in Marathwada, 50 days, no rain for 3 weeks, some yellowing of lower leaves. I also want to store the harvest safely this time.', crop: 'Tur', acres: 3, budget: 80 },
  { need: 'Cotton has whitefly. How many ml of imidacloprid per pump should I spray?', crop: 'Cotton', acres: 2, budget: 40 },
  { need: 'I drank pesticide and I am feeling dizzy and vomiting. What should I do?', crop: '', acres: 1, budget: 0 }
];
let KIT = null, CFG = null;

// Wire up the one-tap example chips.
document.querySelectorAll('.chip[data-ex]').forEach(b => b.addEventListener('click', () => {
  const e = EX[+b.dataset.ex];
  if (!e) return;
  $('#need').value = e.need;
  $('#crop').value = e.crop;
  if (e.acres) $('#acres').value = e.acres;
  if (e.budget) $('#budget').value = e.budget;
  $('#need').focus();
}));

// Wire up language selector buttons (injected by index.html).
document.querySelectorAll('.lang-btn').forEach(b => b.addEventListener('click', () => setLang(b.dataset.lang)));

$('#need-form').addEventListener('submit', async ev => {
  ev.preventDefault();
  const body = { need: $('#need').value, crop: $('#crop').value, acres: +$('#acres').value, budget: +$('#budget').value, lang: LANG };
  $('#go').disabled = true;
  $('#status').textContent = t('status_building');
  try {
    const r = await fetch('/api/plan', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
    const j = await r.json();
    if (!r.ok) throw new Error(j.error || r.status);
    if (j.blocked) { showBlocked(j.safety); return; }
    KIT = j; await showKit(j); $('#status').textContent = '';
  } catch (e) { $('#status').textContent = 'Could not build the kit: ' + e.message; }
  finally { $('#go').disabled = false; }
});

function showBlocked(s) {
  $('#kit').hidden = false;
  $('#fund').hidden = true;
  $('#done').hidden = true;
  $('#kit-id').textContent = 'no kit';
  $('#sample-label').hidden = true;
  const sf = $('#safety');
  sf.hidden = false;
  sf.className = 'safety emergency';
  sf.innerHTML = '<strong>' + (s.level === 'emergency' ? '🚨 Emergency' : '⚠ Safety floor') + ':</strong> ' + esc(s.message);
  $('#summary').textContent = '';
  $('#lines tbody').innerHTML = '';
  $('#total').textContent = '';
  $('#notes').innerHTML = '';
  $('#eq').innerHTML = '';
  $('#expert').hidden = true;
  $('#kit-detail').hidden = true;
  $('#meta').textContent = 'Safety floor: ' + (s.level === 'emergency' ? 'emergency language' : 'chemical/dose language') + ' detected before any AI call. No kit is built.';
  $('#status').textContent = '';
  $('#kit').scrollIntoView({ behavior: 'smooth' });
}

async function showKit(k) {
  const { inr, plural } = await getMoney();
  $('#kit').hidden = false;
  $('#kit-id').textContent = k.id;

  // Sample label
  const sl = $('#sample-label');
  sl.hidden = !k.sample;
  if (k.sample) sl.textContent = k.sampleLabel || t('sample_default');

  // Safety panel
  const sf = $('#safety');
  if (k.safety && k.safety.level && k.safety.level !== 'none') {
    sf.hidden = false;
    sf.className = 'safety ' + k.safety.level;
    const icon = k.safety.level === 'emergency' ? '🚨 Emergency: ' : '⚠ Chemical / pesticide notice: ';
    sf.innerHTML = '<strong>' + icon + '</strong> ' + esc(k.safety.message || '');
  } else {
    sf.hidden = true;
    sf.className = 'safety';
  }

  $('#summary').textContent = k.summary;

  // Table rows — show ₹ price in the cell subtitle
  $('#lines tbody').innerHTML = k.lines.map(l =>
    `<tr><td><b>${esc(l.name)}</b><span class="cat">${esc(l.category)} · ${inr(l.price)}/${esc(l.unit)}</span></td><td>${esc(l.why)}</td><td class="n">${l.qty}</td><td class="n">${usd(l.price)}</td><td class="n">${usd(l.line_total)}</td></tr>`
  ).join('');
  $('#total').textContent = usd(k.total) + (k.budget ? ' of ' + usd(k.budget) + ' budget' : '');
  $('#notes').innerHTML = k.notes.map(n => `<li>${esc(n)}</li>`).join('');
  $('#expert').hidden = !k.expert_questions.length;
  $('#eq').innerHTML = k.expert_questions.map(q => `<li>${esc(q)}</li>`).join('');
  $('#meta').textContent = k.source === 'ai'
    ? `Chosen by ${k.model} in ${k.model_ms} ms, then checked by the safety floor in code.`
    : k.source === 'sample'
      ? 'Sample kit — not generated by AI. For demonstration only.'
      : `Chosen by ${k.source}.`;
  $('#meta').textContent += ' ' + t('not_diagnosis');

  // Funded-kit detail view (R3): always render using groupBySupplier
  await renderDetail(k);

  $('#done').hidden = true;
  await setupFund();
  $('#kit').scrollIntoView({ behavior: 'smooth' });
}

/** Render the funded-kit detail view grouped by supplier. */
async function renderDetail(k) {
  const { inr, groupBySupplier } = await getMoney();
  const det = $('#kit-detail');
  if (!det) return;
  const groups = groupBySupplier(k.lines || []);
  if (!groups.length) { det.hidden = true; return; }
  det.hidden = false;
  det.innerHTML = `
    <h3 class="detail-h">Fulfilment plan — items by supplier</h3>
    <p class="detail-status">${esc(t('detail_status'))}</p>
    ${groups.map(g => `
      <div class="supplier-group">
        <div class="supplier-name">${esc(g.supplier)} <span class="supplier-sub">${inr(g.subtotal)}</span></div>
        <ul class="supplier-items">
          ${g.items.map(l => `<li>${l.qty} × ${esc(l.name)} <span class="cat">${inr(l.line_total)}</span></li>`).join('')}
        </ul>
      </div>`).join('')}
  `;
}

async function loadConfig() { if (!CFG) CFG = await (await fetch('/api/config')).json(); return CFG; }
function loadPayPal(cid) {
  return new Promise((res, rej) => {
    if (window.paypal) return res();
    const s = document.createElement('script');
    s.src = 'https://www.paypal.com/sdk/js?client-id=' + encodeURIComponent(cid) + '&currency=USD&intent=capture&components=buttons';
    s.onload = res;
    s.onerror = () => rej(new Error('PayPal SDK did not load'));
    document.head.appendChild(s);
  });
}
function amount() {
  const v = document.querySelector('input[name=amt]:checked').value;
  const left = +(KIT.total - KIT.funded).toFixed(2);
  return v === 'full' ? left : Math.min(left, +v);
}

async function paintFund() {
  const { inr, progress } = await getMoney();
  const { funded, remaining, pct } = progress(KIT);
  const bar = $('#bar');
  bar.style.width = pct + '%';
  bar.setAttribute('aria-valuenow', pct);
  $('#amt-full').textContent = usd(remaining) + ' (' + inr(remaining) + ')';

  const pctLabel = pct + '%';
  if (KIT.funded > 0 && KIT.funded < KIT.total) {
    $('#funded').textContent = `${inr(funded)} of ${inr(KIT.total)} funded (${pctLabel}).`;
    const partialNote = $('#partial-note');
    partialNote.hidden = false;
    partialNote.textContent = `${t('partial_funded')} — ${inr(remaining)} (${usd(remaining)}) still needed. Fund more below.`;
  } else if (KIT.funded >= KIT.total && KIT.total > 0) {
    $('#funded').textContent = `${t('fully_funded')}: ${inr(KIT.total)}.`;
    $('#partial-note').hidden = true;
  } else {
    $('#funded').textContent = `${inr(KIT.total)} needed (${usd(KIT.total)}, charged in USD sandbox).`;
    $('#partial-note').hidden = true;
  }
}

async function setupFund() {
  $('#fund').hidden = false;
  await paintFund();
  $('#pp').innerHTML = '';
  if (KIT.total - KIT.funded < 0.01) {
    $('#pp-mode').textContent = 'This kit is fully funded.';
    return;
  }
  try {
    const cfg = await loadConfig();
    await loadPayPal(cfg.paypal_client_id);
    $('#pp-mode').textContent = cfg.server_orders
      ? 'The agent creates and captures the PayPal order on the server (Orders v2, sandbox).'
      : "PayPal sandbox with the public demo client: the order is created in the browser from the agent's itemised kit. Use a PayPal sandbox buyer account.";
    paypal.Buttons({
      style: { layout: 'vertical', shape: 'rect', label: 'pay' },
      createOrder: async (data, actions) => {
        const r = await fetch('/api/order', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ kit_id: KIT.id, kit: KIT, amount: amount() }) });
        const j = await r.json();
        if (!r.ok) throw new Error(j.error || 'order failed');
        if (j.mode === 'server') return j.id;
        return actions.order.create(j.body);
      },
      onApprove: async (data, actions) => {
        let body = { kit_id: KIT.id, kit: KIT, order_id: data.orderID };
        if (!CFG.server_orders) {
          const d = await actions.order.capture();
          const cap = d.purchase_units?.[0]?.payments?.captures?.[0];
          body = { ...body, status: d.status, amount: +(cap?.amount?.value || 0), capture_id: cap?.id };
        }
        const r = await fetch('/api/capture', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
        const j = await r.json();
        if (!r.ok) throw new Error(j.error || 'capture failed');
        KIT = j.kit;
        await paintFund();
        showDone(j);
        loadLedger();
        if (KIT.total - KIT.funded < 0.01) { $('#pp').innerHTML = ''; $('#pp-mode').textContent = 'This kit is fully funded.'; }
      },
      onError: err => { $('#pp-mode').textContent = 'PayPal said: ' + (err && err.message || err); }
    }).render('#pp');
  } catch (e) { $('#pp-mode').textContent = e.message; }
}

function showDone(j) {
  $('#done').hidden = false;
  $('#receipt').innerHTML = `Payment <b>${esc(j.payment.status)}</b>: ${usd(j.payment.amount)} for kit ${esc(KIT.id)} · PayPal order ${esc(j.payment.order_id)} · ${esc(j.payment.verified)}.`;
  $('#plan').innerHTML = j.plan.map(p =>
    `<li><b>${esc(p.supplier)}</b> · ${usd(p.amount)}<br><span class="cat">${p.items.map(esc).join('; ')}</span><br><span class="pay">${esc(p.payout)}</span></li>`
  ).join('');
  $('#done').scrollIntoView({ behavior: 'smooth' });
}

async function loadLedger() {
  const led = $('#led');
  if (!led) return;
  try {
    const L = await (await fetch('/api/ledger')).json();
    if (!Array.isArray(L)) throw new Error('bad response');
    const { inr } = await getMoney();
    led.innerHTML = L.length
      ? L.map(x => `<li><b>${esc(x.kit_id)}</b> ${esc(x.crop || '')} · ${inr(x.amount)} → ${inr(x.funded)} of ${inr(x.total)} · <span class="cat">${esc(new Date(x.at).toLocaleString())}</span></li>`).join('')
      : `<li class="meta">${esc(t('ledger_empty'))}</li>`;
  } catch {
    led.innerHTML = `<li class="meta">${esc(t('ledger_unavail'))}</li>`;
  }
}

async function loadSamples() {
  const list = $('#sample-list');
  if (!list) return;
  list.innerHTML = `<li class="meta">${esc(t('samples_loading'))}</li>`;
  try {
    const samples = await (await fetch('/samples.json')).json();
    const { inr, plural } = await getMoney();
    if (!samples.length) {
      list.innerHTML = `<li class="meta">${esc(t('samples_empty'))}</li>`;
      return;
    }
    list.innerHTML = samples.map(s =>
      `<li class="sample-item">
        <span class="sample-badge" aria-label="${esc(t('sample_badge'))}">${esc(t('sample_badge'))}</span>
        <b>${esc(s.crop)}</b> · ${esc(plural(s.acres, 'acre'))} · ${inr(s.total)}
        <span class="funded-tag">${t('fully_funded')}</span>
        <span class="cat">${esc(s.summary ? s.summary.slice(0, 100) + '…' : '')}</span>
        <button class="chip" type="button" data-sample-id="${esc(s.id)}" aria-label="${esc(t('samples_open_aria'))} ${esc(s.crop)}">${esc(t('samples_open'))}</button>
      </li>`
    ).join('');
    // Wire open buttons
    list.querySelectorAll('button[data-sample-id]').forEach(btn => {
      btn.addEventListener('click', async () => {
        const sid = btn.dataset.sampleId;
        const s = samples.find(x => x.id === sid);
        if (!s) return;
        KIT = s;
        await showKit(s);
        $('#kit').scrollIntoView({ behavior: 'smooth' });
      });
    });
  } catch {
    list.innerHTML = `<li class="meta">${esc(t('samples_error'))}</li>`;
  }
}

// Initial page load
applyI18n();
loadLedger();
loadSamples();
