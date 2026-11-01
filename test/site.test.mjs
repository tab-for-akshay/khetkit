import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
const S = new URL('../site/', import.meta.url);
const read = f => fs.readFileSync(new URL(f, S), 'utf8');
test('index has title, viewport, disclosure, local assets', () => {
  const h = read('index.html');
  assert.match(h, /<title>KhetKit/); assert.match(h, /name="viewport"/);
  assert.match(h, /Built by Tab, an AI assistant, for team lead Akshay Wagh/);
  for (const f of ['styles.css', 'app.js', 'icon.svg']) { assert.ok(h.includes(f)); assert.ok(fs.existsSync(new URL(f, S))); }
  assert.doesNotMatch(h, /TODO|lorem/i);
});
test('catalogue has no chemical pesticides and sane prices', () => {
  const c = JSON.parse(read('catalog.json'));
  assert.ok(c.length >= 20);
  const banned = ['imidacloprid', 'chlorpyrifos', 'monocrotophos', 'acephate', 'cypermethrin', 'glyphosate', 'paraquat'];
  for (const it of c) { assert.ok(it.price > 0 && it.price < 100); for (const b of banned) assert.ok(!it.name.toLowerCase().includes(b)); }
  assert.ok(c.some(i => i.id === 'kvk_consult') && c.some(i => i.id === 'ppe'));
});
test('worker carries the safety floor and no secrets', async () => {
  const w = read('worker.mjs');
  assert.match(w, /function safety/); assert.match(w, /v2\/checkout\/orders/);
  assert.doesNotMatch(w, /gsk_[A-Za-z0-9]{20,}/); assert.doesNotMatch(w, /AIza[0-9A-Za-z_-]{20,}/);
  const mod = await import(new URL('worker.mjs', S));
  const env = { ASSETS: { fetch: () => new Response('asset') } };
  const post = (p, b) => mod.default.fetch(new Request('https://x' + p, { method: 'POST', body: JSON.stringify(b), headers: { 'content-type': 'application/json' } }), env).then(r => r.json());
  const em = await post('/api/plan', { need: 'my father drank pesticide and is vomiting', budget: 40 });
  assert.equal(em.blocked, true); assert.equal(em.safety.level, 'emergency');
  const ch = await post('/api/plan', { need: 'how many ml of imidacloprid per pump for whitefly in cotton', crop: 'cotton', budget: 40 });
  assert.equal(ch.safety.level, 'chemical'); assert.ok(ch.lines.some(l => l.id === 'kvk_consult'));
  assert.ok(ch.total <= 40 + 1e-9 || ch.notes.length);
});
