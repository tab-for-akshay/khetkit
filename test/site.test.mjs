import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const S = new URL('../site/', import.meta.url);
const read = f => fs.readFileSync(new URL(f, S), 'utf8');

// ---- existing tests --------------------------------------------------------

test('index has title, viewport, disclosure, local assets', () => {
  const h = read('index.html');
  assert.match(h, /<title>KhetKit/);
  assert.match(h, /name="viewport"/);
  assert.match(h, /Built by Tab, an AI assistant, for team lead Akshay Wagh/);
  for (const f of ['styles.css', 'app.js', 'icon.svg']) {
    assert.ok(h.includes(f));
    assert.ok(fs.existsSync(new URL(f, S)));
  }
  assert.doesNotMatch(h, /TODO|lorem/i);
});

test('catalogue has no chemical pesticides and sane prices', () => {
  const c = JSON.parse(read('catalog.json'));
  assert.ok(c.length >= 20);
  const banned = ['imidacloprid', 'chlorpyrifos', 'monocrotophos', 'acephate', 'cypermethrin', 'glyphosate', 'paraquat'];
  for (const it of c) {
    assert.ok(it.price > 0 && it.price < 100);
    for (const b of banned) assert.ok(!it.name.toLowerCase().includes(b));
  }
  assert.ok(c.some(i => i.id === 'kvk_consult') && c.some(i => i.id === 'ppe'));
});

test('worker carries the safety floor and no secrets', async () => {
  const w = read('worker.mjs');
  assert.match(w, /function safety/);
  assert.match(w, /v2\/checkout\/orders/);
  assert.doesNotMatch(w, /gsk_[A-Za-z0-9]{20,}/);
  assert.doesNotMatch(w, /AIza[0-9A-Za-z_-]{20,}/);
  const mod = await import(new URL('worker.mjs', S));
  const env = { ASSETS: { fetch: () => new Response('asset') } };
  const post = (p, b) => mod.default.fetch(
    new Request('https://x' + p, { method: 'POST', body: JSON.stringify(b), headers: { 'content-type': 'application/json' } }),
    env
  ).then(r => r.json());
  const em = await post('/api/plan', { need: 'my father drank pesticide and is vomiting', budget: 40 });
  assert.equal(em.blocked, true);
  assert.equal(em.safety.level, 'emergency');
  const ch = await post('/api/plan', { need: 'how many ml of imidacloprid per pump for whitefly in cotton', crop: 'cotton', budget: 40 });
  assert.equal(ch.safety.level, 'chemical');
  assert.ok(ch.lines.some(l => l.id === 'kvk_consult'));
  assert.ok(ch.total <= 40 + 1e-9 || ch.notes.length);
});

// ---- new v2 tests ----------------------------------------------------------

test('money.mjs: INR_PER_USD is 88', async () => {
  const { INR_PER_USD } = await import(new URL('money.mjs', S));
  assert.equal(INR_PER_USD, 88);
});

test('money.mjs: inr() formats USD to ₹ with USD beside it', async () => {
  const { inr } = await import(new URL('money.mjs', S));
  const result = inr(6);
  // Should contain the rupee symbol
  assert.ok(result.includes('\u20b9'), 'should contain ₹ symbol');
  // 6 * 88 = 528
  assert.ok(result.includes('528'), 'should show ₹528 for $6.00');
  // Should contain the USD amount
  assert.ok(result.includes('$6.00'), 'should include the USD amount');
});

test('money.mjs: inr() handles zero and fractional amounts', async () => {
  const { inr } = await import(new URL('money.mjs', S));
  const zero = inr(0);
  assert.ok(zero.includes('\u20b9'), 'zero: should contain ₹');
  assert.ok(zero.includes('$0.00'), 'zero: should include $0.00');

  const frac = inr(10.50);
  // 10.50 * 88 = 924
  assert.ok(frac.includes('924'), 'fractional: should show ₹924 for $10.50');
  assert.ok(frac.includes('$10.50'), 'fractional: should include $10.50');
});

test('money.mjs: progress() returns correct funded/remaining/pct', async () => {
  const { progress } = await import(new URL('money.mjs', S));

  // fully unfunded
  const unfunded = progress({ total: 100, funded: 0 });
  assert.equal(unfunded.funded, 0);
  assert.equal(unfunded.remaining, 100);
  assert.equal(unfunded.pct, 0);

  // half funded
  const half = progress({ total: 100, funded: 50 });
  assert.equal(half.funded, 50);
  assert.equal(half.remaining, 50);
  assert.equal(half.pct, 50);

  // fully funded
  const full = progress({ total: 100, funded: 100 });
  assert.equal(full.funded, 100);
  assert.equal(full.remaining, 0);
  assert.equal(full.pct, 100);

  // partial — real kit value
  const partial = progress({ total: 49, funded: 10 });
  assert.equal(partial.funded, 10);
  assert.equal(partial.remaining, 39);
  assert.equal(partial.pct, 20); // Math.round(10/49*100) = 20
});

test('money.mjs: progress() clamps funded to [0, total]', async () => {
  const { progress } = await import(new URL('money.mjs', S));

  const over = progress({ total: 50, funded: 999 });
  assert.equal(over.funded, 50);
  assert.equal(over.remaining, 0);
  assert.equal(over.pct, 100);

  const negative = progress({ total: 50, funded: -10 });
  assert.equal(negative.funded, 0);
  assert.equal(negative.remaining, 50);
  assert.equal(negative.pct, 0);
});

test('money.mjs: progress() handles zero total without division by zero', async () => {
  const { progress } = await import(new URL('money.mjs', S));
  const p = progress({ total: 0, funded: 0 });
  assert.equal(p.pct, 0);
  assert.equal(p.remaining, 0);
});

test('worker safety floor: self-harm returns emergency, no kit', async () => {
  const mod = await import(new URL('worker.mjs', S));
  const env = { ASSETS: { fetch: () => new Response('asset') } };
  const post = (p, b) => mod.default.fetch(
    new Request('https://x' + p, { method: 'POST', body: JSON.stringify(b), headers: { 'content-type': 'application/json' } }),
    env
  ).then(r => r.json());

  // self-harm message
  const sh = await post('/api/plan', { need: 'I want to kill myself with pesticide', budget: 40 });
  assert.equal(sh.blocked, true, 'self-harm must be blocked');
  assert.equal(sh.safety.level, 'emergency', 'self-harm must return emergency level');
  assert.ok(!sh.lines, 'blocked response must not include kit lines');
  // message should reference emergency numbers
  assert.ok(
    sh.safety.message.includes('112') || sh.safety.message.includes('108') || sh.safety.message.includes('14416'),
    'emergency message should include at least one emergency number'
  );
});

test('worker safety floor: pesticide dose returns chemical level with kvk_consult in kit', async () => {
  const mod = await import(new URL('worker.mjs', S));
  const env = { ASSETS: { fetch: () => new Response('asset') } };
  const post = (p, b) => mod.default.fetch(
    new Request('https://x' + p, { method: 'POST', body: JSON.stringify(b), headers: { 'content-type': 'application/json' } }),
    env
  ).then(r => r.json());

  // pesticide dose request
  const pd = await post('/api/plan', { need: 'how much chlorpyrifos per litre should I use on wheat', crop: 'wheat', budget: 40 });
  assert.equal(pd.safety.level, 'chemical', 'pesticide dose must return chemical safety level');
  assert.equal(pd.blocked, undefined, 'chemical level must not be blocked — kit is returned');
  assert.ok(pd.lines, 'chemical level must return kit lines');
  assert.ok(pd.lines.some(l => l.id === 'kvk_consult'), 'chemical kit must include kvk_consult');
  assert.ok(
    pd.safety.message && pd.safety.message.length > 0,
    'chemical safety message must be non-empty'
  );
});

test('worker safety floor: normal need has safety.level=none', async () => {
  const mod = await import(new URL('worker.mjs', S));
  const env = { ASSETS: { fetch: () => new Response('asset') } };
  const post = (p, b) => mod.default.fetch(
    new Request('https://x' + p, { method: 'POST', body: JSON.stringify(b), headers: { 'content-type': 'application/json' } }),
    env
  ).then(r => r.json());

  const normal = await post('/api/plan', { need: 'My tomato leaves are curling and I see small white insects', crop: 'Tomato', acres: 1, budget: 60 });
  assert.equal(normal.safety.level, 'none', 'normal need must have safety.level=none');
  assert.ok(normal.lines && normal.lines.length > 0, 'normal need must return kit lines');
});

test('samples.json: two sample kits exist and are clearly labelled', () => {
  const samples = JSON.parse(read('samples.json'));
  assert.ok(Array.isArray(samples), 'samples.json must be an array');
  assert.ok(samples.length >= 2, 'must have at least two sample kits');
  for (const s of samples) {
    assert.ok(s.sample === true, 'each sample must have sample:true');
    assert.ok(
      s.sampleLabel && s.sampleLabel.toLowerCase().includes('sample'),
      'each sample must have a sampleLabel mentioning "sample"'
    );
    assert.ok(
      s.sampleLabel.toLowerCase().includes('not a real farmer'),
      'each sample label must say "not a real farmer"'
    );
    assert.ok(s.id, 'each sample must have an id');
    assert.ok(s.lines && s.lines.length > 0, 'each sample must have kit lines');
    assert.ok(s.total > 0, 'each sample must have a positive total');
  }
});

test('index.html: INR footer note present', () => {
  const h = read('index.html');
  assert.match(h, /₹88 per US\$/, 'footer must state the ₹88 per US$ conversion rate');
});

test('index.html: safety floor example chips present', () => {
  const h = read('index.html');
  // data-ex="3" is pesticide dose, data-ex="4" is self-harm
  assert.match(h, /data-ex="3"/, 'pesticide dose chip (data-ex=3) must be present');
  assert.match(h, /data-ex="4"/, 'self-harm chip (data-ex=4) must be present');
});

test('money.mjs exists and is importable as an ES module', async () => {
  assert.ok(fs.existsSync(new URL('money.mjs', S)), 'money.mjs must exist');
  const m = await import(new URL('money.mjs', S));
  assert.ok(typeof m.inr === 'function', 'inr must be a function');
  assert.ok(typeof m.progress === 'function', 'progress must be a function');
  assert.ok(typeof m.INR_PER_USD === 'number', 'INR_PER_USD must be a number');
});

// ---- new v3 tests ----------------------------------------------------------

test('money.mjs: plural() — singular, plural, fractional', async () => {
  const { plural } = await import(new URL('money.mjs', S));
  assert.equal(plural(1, 'acre'), '1\u00a0acre',   'singular: 1 acre');
  assert.equal(plural(2, 'acre'), '2\u00a0acres',  'plural: 2 acres');
  assert.equal(plural(0, 'acre'), '0\u00a0acres',  'zero: 0 acres');
  assert.equal(plural(0.5, 'acre'), '0.5\u00a0acre','fractional: 0.5 acre (singular)');
  assert.equal(plural(3, 'item'), '3\u00a0items',  'plural: 3 items');
});

test('money.mjs: groupBySupplier() groups lines and sums subtotals', async () => {
  const { groupBySupplier } = await import(new URL('money.mjs', S));
  const lines = [
    { id: 'kvk_consult', name: 'KVK visit', category: 'Diagnosis',     qty: 1, line_total: 6.0 },
    { id: 'soil_test',   name: 'Soil test', category: 'Diagnosis',     qty: 1, line_total: 4.0 },
    { id: 'neem_oil',    name: 'Neem oil',  category: 'Bio-inputs',    qty: 1, line_total: 7.0 },
    { id: 'seed_tomato', name: 'Tomato seed', category: 'Seeds',       qty: 1, line_total: 12.0 },
    { id: 'ppe',         name: 'PPE kit',   category: 'Safety',        qty: 1, line_total: 6.0 },
  ];
  const groups = groupBySupplier(lines);
  assert.ok(Array.isArray(groups), 'returns an array');
  // Should have at most as many groups as unique supplier types
  assert.ok(groups.length >= 2 && groups.length <= lines.length, 'grouped into supplier buckets');
  // Each group has supplier, items, subtotal
  for (const g of groups) {
    assert.ok(typeof g.supplier === 'string' && g.supplier.length > 0, 'group has supplier name');
    assert.ok(Array.isArray(g.items) && g.items.length > 0, 'group has items');
    assert.ok(typeof g.subtotal === 'number' && g.subtotal >= 0, 'group has numeric subtotal');
  }
  // KVK / soil test should be in the same group (Diagnosis → KVK / accredited soil lab)
  const kvkGroup = groups.find(g => g.supplier.toLowerCase().includes('kvk'));
  assert.ok(kvkGroup, 'KVK group present');
  assert.ok(Math.abs(kvkGroup.subtotal - 10.0) < 0.01, 'KVK group subtotal = 10 (6+4)');
  // Seed dealer group
  const seedGroup = groups.find(g => g.supplier.toLowerCase().includes('seed'));
  assert.ok(seedGroup, 'seed dealer group present');
  assert.ok(Math.abs(seedGroup.subtotal - 12.0) < 0.01, 'seed group subtotal = 12');
  // Total across all groups should equal sum of line_totals
  const total = groups.reduce((s, g) => s + g.subtotal, 0);
  assert.ok(Math.abs(total - 35.0) < 0.01, 'total across groups = 35');
});

test('i18n: STR table has en/hi/mr keys and t() helper returns strings', async () => {
  // We can't directly import app.js as it references DOM, so we check index.html
  // contains the lang selector and check app.js source for STR table keys.
  const appSrc = read('app.js');
  assert.match(appSrc, /const STR\s*=/, 'STR table must be defined');
  assert.match(appSrc, /en\s*:/, 'STR must have en key');
  assert.match(appSrc, /hi\s*:/, 'STR must have hi key');
  assert.match(appSrc, /mr\s*:/, 'STR must have mr key');
  assert.match(appSrc, /function t\(/, 't() helper must be defined');
  // Check required i18n keys appear in the source (present in all three language sections combined)
  for (const key of ['go_btn', 'build_h', 'fund_h', 'samples_h', 'ledger_h', 'sample_badge', 'detail_status', 'live_line']) {
    // Each key must appear at least 3 times (once per language)
    const occurrences = (appSrc.match(new RegExp(key, 'g')) || []).length;
    assert.ok(occurrences >= 3, `key "${key}" must appear at least 3 times (once per language), found ${occurrences}`);
  }
  // lang selector must exist in index.html
  const h = read('index.html');
  assert.match(h, /lang-btn/, 'index.html must have language selector buttons');
  assert.match(h, /data-lang="en"/, 'EN lang button must exist');
  assert.match(h, /data-lang="hi"/, 'HI lang button must exist');
  assert.match(h, /data-lang="mr"/, 'MR lang button must exist');
});

test('index.html: what-is-live line present', () => {
  const h = read('index.html');
  // Must mention both PayPal sandbox and merchant credentials
  assert.match(h, /sandbox/i, 'must mention sandbox');
  assert.match(h, /Orders.*v2|v2.*Orders/i, 'must mention Orders v2');
  assert.match(h, /merchant|PAYPAL_CLIENT_ID|credentials/i, 'must mention credentials or merchant');
});

import { execFileSync } from 'node:child_process';
test('site/app.js parses (no broken escapes)', () => {
  execFileSync(process.execPath, ['--check', new URL('../site/app.js', import.meta.url).pathname]);
});
