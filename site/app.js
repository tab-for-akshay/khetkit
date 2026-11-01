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

$('#need-form').addEventListener('submit', async ev => {
  ev.preventDefault();
  const body = { need: $('#need').value, crop: $('#crop').value, acres: +$('#acres').value, budget: +$('#budget').value };
  $('#go').disabled = true;
  $('#status').textContent = 'The agent is reading the need and the catalogue…';
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
  $('#meta').textContent = 'Safety floor: ' + (s.level === 'emergency' ? 'emergency language' : 'chemical/dose language') + ' detected before any AI call. No kit is built.';
  $('#status').textContent = '';
  $('#kit').scrollIntoView({ behavior: 'smooth' });
}

async function showKit(k) {
  const { inr } = await getMoney();
  $('#kit').hidden = false;
  $('#kit-id').textContent = k.id;

  // Sample label
  const sl = $('#sample-label');
  sl.hidden = !k.sample;
  if (k.sample) sl.textContent = k.sampleLabel || 'Sample — not a real farmer';

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
  $('#meta').textContent += ' Not a diagnosis: confirm with your KVK.';
  $('#done').hidden = true;
  await setupFund();
  $('#kit').scrollIntoView({ behavior: 'smooth' });
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
    partialNote.textContent = `Partially funded — ${inr(remaining)} (${usd(remaining)}) still needed. Fund more below.`;
  } else if (KIT.funded >= KIT.total && KIT.total > 0) {
    $('#funded').textContent = `Fully funded: ${inr(KIT.total)}.`;
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
  try {
    const L = await (await fetch('/api/ledger')).json();
    if (!Array.isArray(L)) throw new Error('bad response');
    const { inr } = await getMoney();
    $('#led').innerHTML = L.length
      ? L.map(x => `<li><b>${esc(x.kit_id)}</b> ${esc(x.crop || '')} · ${inr(x.amount)} → ${inr(x.funded)} of ${inr(x.total)} · <span class="cat">${esc(new Date(x.at).toLocaleString())}</span></li>`).join('')
      : '<li class="meta">No kits funded yet — fund the first one (sandbox).</li>';
  } catch {
    $('#led').innerHTML = '<li class="meta">Ledger unavailable.</li>';
  }
}

async function loadSamples() {
  const list = $('#sample-list');
  try {
    const samples = await (await fetch('/samples.json')).json();
    const { inr } = await getMoney();
    if (!samples.length) {
      list.innerHTML = '<li class="meta">No sample kits available.</li>';
      return;
    }
    list.innerHTML = samples.map(s =>
      `<li class="sample-item">
        <span class="sample-badge">Sample — not a real farmer</span>
        <b>${esc(s.crop)}</b> · ${esc(s.acres)} acres · ${inr(s.total)} (${usd(s.total)})
        <span class="cat">${esc(s.summary ? s.summary.slice(0, 100) + '…' : '')}</span>
        <button class="chip" type="button" data-sample-id="${esc(s.id)}" aria-label="Open sample kit for ${esc(s.crop)}">Open this sample kit →</button>
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
    list.innerHTML = '<li class="meta">Could not load sample kits.</li>';
  }
}

loadLedger();
loadSamples();
