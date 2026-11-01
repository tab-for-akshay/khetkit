'use strict';
const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const usd = n => '$' + Number(n || 0).toFixed(2);
const EX = [
  { need: 'My 1 acre tomato is 40 days old. Leaves are curling upward and turning small, and tiny white insects fly up when I touch the plants. What should I buy?', crop: 'Tomato', acres: 1, budget: 60 },
  { need: 'मेरे 2 एकड़ टमाटर में फल में छेद हो रहे हैं और अंदर इल्ली मिल रही है। फूल अभी भी आ रहे हैं। कम खर्च में क्या लूँ?', crop: 'टमाटर', acres: 2, budget: 50 },
  { need: 'Rain-fed tur (pigeon pea) on 3 acres in Marathwada, 50 days, no rain for 3 weeks, some yellowing of lower leaves. I also want to store the harvest safely this time.', crop: 'Tur', acres: 3, budget: 80 },
  { need: 'Cotton has whitefly. How many ml of imidacloprid per pump should I spray?', crop: 'Cotton', acres: 2, budget: 40 }
];
let KIT = null, CFG = null;

document.querySelectorAll('.chip').forEach(b => b.addEventListener('click', () => {
  const e = EX[+b.dataset.ex]; $('#need').value = e.need; $('#crop').value = e.crop; $('#acres').value = e.acres; $('#budget').value = e.budget; $('#need').focus();
}));

$('#need-form').addEventListener('submit', async ev => {
  ev.preventDefault();
  const body = { need: $('#need').value, crop: $('#crop').value, acres: +$('#acres').value, budget: +$('#budget').value };
  $('#go').disabled = true; $('#status').textContent = 'The agent is reading the need and the catalogue…';
  try {
    const r = await fetch('/api/plan', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
    const j = await r.json();
    if (!r.ok) throw new Error(j.error || r.status);
    if (j.blocked) { showBlocked(j.safety); return; }
    KIT = j; showKit(j); $('#status').textContent = '';
  } catch (e) { $('#status').textContent = 'Could not build the kit: ' + e.message; }
  finally { $('#go').disabled = false; }
});

function showBlocked(s) {
  $('#kit').hidden = false; $('#fund').hidden = true; $('#done').hidden = true;
  $('#kit-id').textContent = 'no kit';
  const sf = $('#safety'); sf.hidden = false; sf.className = 'safety emergency'; sf.textContent = s.message;
  $('#summary').textContent = ''; $('#lines tbody').innerHTML = ''; $('#total').textContent = ''; $('#notes').innerHTML = ''; $('#eq').innerHTML = ''; $('#expert').hidden = true; $('#meta').textContent = 'Safety floor: emergency language detected before any AI call.';
  $('#status').textContent = ''; $('#kit').scrollIntoView({ behavior: 'smooth' });
}

function showKit(k) {
  $('#kit').hidden = false; $('#kit-id').textContent = k.id;
  const sf = $('#safety'); sf.hidden = k.safety.level === 'none'; sf.className = 'safety ' + k.safety.level; sf.textContent = k.safety.message || '';
  $('#summary').textContent = k.summary;
  $('#lines tbody').innerHTML = k.lines.map(l => `<tr><td><b>${esc(l.name)}</b><span class="cat">${esc(l.category)} · ${usd(l.price)}/${esc(l.unit)}</span></td><td>${esc(l.why)}</td><td class="n">${l.qty}</td><td class="n">${usd(l.line_total)}</td></tr>`).join('');
  $('#total').textContent = usd(k.total) + (k.budget ? ' of ' + usd(k.budget) + ' budget' : '');
  $('#notes').innerHTML = k.notes.map(n => `<li>${esc(n)}</li>`).join('');
  $('#expert').hidden = !k.expert_questions.length; $('#eq').innerHTML = k.expert_questions.map(q => `<li>${esc(q)}</li>`).join('');
  $('#meta').textContent = (k.source === 'ai' ? `Chosen by ${k.model} in ${k.model_ms} ms, then checked by the safety floor in code.` : `Chosen by ${k.source}.`) + ' Not a diagnosis: confirm with your KVK.';
  $('#done').hidden = true; setupFund(); $('#kit').scrollIntoView({ behavior: 'smooth' });
}

async function loadConfig() { if (!CFG) CFG = await (await fetch('/api/config')).json(); return CFG; }
function loadPayPal(cid) {
  return new Promise((res, rej) => { if (window.paypal) return res(); const s = document.createElement('script');
    s.src = 'https://www.paypal.com/sdk/js?client-id=' + encodeURIComponent(cid) + '&currency=USD&intent=capture&components=buttons'; s.onload = res; s.onerror = () => rej(new Error('PayPal SDK did not load')); document.head.appendChild(s); });
}
function amount() { const v = document.querySelector('input[name=amt]:checked').value; const left = +(KIT.total - KIT.funded).toFixed(2); return v === 'full' ? left : Math.min(left, +v); }
function paintFund() {
  const pct = KIT.total ? Math.round(100 * KIT.funded / KIT.total) : 0; $('#bar').style.width = pct + '%';
  $('#funded').textContent = `${usd(KIT.funded)} of ${usd(KIT.total)} funded (${pct}%).`; $('#amt-full').textContent = usd(KIT.total - KIT.funded);
}
async function setupFund() {
  $('#fund').hidden = false; paintFund(); $('#pp').innerHTML = '';
  if (KIT.total - KIT.funded < 0.01) { $('#pp-mode').textContent = 'This kit is fully funded.'; return; }
  try {
    const cfg = await loadConfig(); await loadPayPal(cfg.paypal_client_id);
    $('#pp-mode').textContent = cfg.server_orders ? 'The agent creates and captures the PayPal order on the server (Orders v2, sandbox).' : 'PayPal sandbox with the public demo client: the order is created in the browser from the agent\'s itemised kit. Use a PayPal sandbox buyer account.';
    paypal.Buttons({
      style: { layout: 'vertical', shape: 'rect', label: 'pay' },
      createOrder: async (data, actions) => {
        const r = await fetch('/api/order', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ kit_id: KIT.id, kit: KIT, amount: amount() }) });
        const j = await r.json(); if (!r.ok) throw new Error(j.error || 'order failed');
        if (j.mode === 'server') return j.id;
        return actions.order.create(j.body);
      },
      onApprove: async (data, actions) => {
        let body = { kit_id: KIT.id, kit: KIT, order_id: data.orderID };
        if (!CFG.server_orders) { const d = await actions.order.capture(); const cap = d.purchase_units?.[0]?.payments?.captures?.[0]; body = { ...body, status: d.status, amount: +(cap?.amount?.value || 0), capture_id: cap?.id }; }
        const r = await fetch('/api/capture', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });
        const j = await r.json(); if (!r.ok) throw new Error(j.error || 'capture failed');
        KIT = j.kit; paintFund(); showDone(j); loadLedger(); if (KIT.total - KIT.funded < 0.01) { $('#pp').innerHTML = ''; $('#pp-mode').textContent = 'This kit is fully funded.'; }
      },
      onError: err => { $('#pp-mode').textContent = 'PayPal said: ' + (err && err.message || err); }
    }).render('#pp');
  } catch (e) { $('#pp-mode').textContent = e.message; }
}
function showDone(j) {
  $('#done').hidden = false;
  $('#receipt').innerHTML = `Payment <b>${esc(j.payment.status)}</b>: ${usd(j.payment.amount)} for kit ${esc(KIT.id)} · PayPal order ${esc(j.payment.order_id)} · ${esc(j.payment.verified)}.`;
  $('#plan').innerHTML = j.plan.map(p => `<li><b>${esc(p.supplier)}</b> · ${usd(p.amount)}<br><span class="cat">${p.items.map(esc).join('; ')}</span><br><span class="pay">${esc(p.payout)}</span></li>`).join('');
  $('#done').scrollIntoView({ behavior: 'smooth' });
}
async function loadLedger() {
  try { const L = await (await fetch('/api/ledger')).json();
    $('#led').innerHTML = L.length ? L.map(x => `<li><b>${esc(x.kit_id)}</b> ${esc(x.crop || '')} · ${usd(x.amount)} → ${usd(x.funded)} of ${usd(x.total)} · <span class="cat">${esc(new Date(x.at).toLocaleString())}</span></li>`).join('') : '<li class="meta">No kits funded yet. Be the first (sandbox).</li>';
  } catch { $('#led').innerHTML = '<li class="meta">Ledger unavailable.</li>'; }
}
loadLedger();
