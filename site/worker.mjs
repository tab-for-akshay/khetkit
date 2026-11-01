// KhetKit Worker — AI-built farm input kits funded through PayPal (sandbox).
// Built by Tab, an AI assistant, for team lead Akshay Wagh.
// Secrets are injected at deploy time (never committed): GROQ_API_KEY, PAYPAL_CLIENT_ID, PAYPAL_SECRET.
const CATALOG = [{"id": "soil_test", "name": "Soil test at an accredited lab (Soil Health Card style: NPK, pH, EC, OC, micronutrients)", "category": "Diagnosis", "unit": "1 sample", "price": 4.0, "tags": ["soil", "fertility", "yield", "all"], "note": "Test before you buy fertiliser: it decides how much is really needed.", "max_qty": 6}, {"id": "kvk_consult", "name": "KVK / agri-expert field visit voucher", "category": "Diagnosis", "unit": "1 visit", "price": 6.0, "tags": ["disease", "pest", "virus", "diagnosis", "chemical", "all"], "note": "A human expert confirms the problem before any chemical is used. Required when the kit stops at a chemical decision.", "max_qty": 6}, {"id": "yellow_traps", "name": "Yellow sticky traps (pack of 25)", "category": "Pest monitoring", "unit": "pack", "price": 5.0, "tags": ["whitefly", "aphid", "jassid", "leaf curl", "sucking pest", "vegetable", "cotton"], "note": "Monitors and mass-traps whiteflies/aphids; no spraying.", "max_qty": 6}, {"id": "blue_traps", "name": "Blue sticky traps (pack of 25)", "category": "Pest monitoring", "unit": "pack", "price": 5.0, "tags": ["thrips", "chilli", "onion", "flower"], "note": "For thrips monitoring.", "max_qty": 6}, {"id": "pheromone_kit", "name": "Pheromone traps + lures for fruit borer / pink bollworm (set of 5)", "category": "Pest monitoring", "unit": "set", "price": 9.0, "tags": ["borer", "fruit borer", "bollworm", "tomato", "cotton", "brinjal", "caterpillar"], "note": "Catches male moths; tells you when the pest is building up.", "max_qty": 6}, {"id": "neem_oil", "name": "Neem oil based botanical (azadirachtin, 1 L)", "category": "Bio-inputs", "unit": "litre", "price": 7.0, "tags": ["sucking pest", "whitefly", "aphid", "mite", "organic", "caterpillar"], "note": "Botanical repellent; follow the label. Not a cure for virus diseases.", "max_qty": 6}, {"id": "trichoderma", "name": "Trichoderma viride bio-fungicide (1 kg)", "category": "Bio-inputs", "unit": "kg", "price": 4.0, "tags": ["wilt", "root rot", "damping off", "soil-borne", "nursery", "seed treatment"], "note": "Seed/soil treatment against soil-borne fungi; mix in compost as per label.", "max_qty": 6}, {"id": "pseudomonas", "name": "Pseudomonas fluorescens bio-agent (1 kg)", "category": "Bio-inputs", "unit": "kg", "price": 4.0, "tags": ["blast", "blight", "leaf spot", "rice", "seed treatment", "wilt"], "note": "Seed treatment / soil application bio-agent.", "max_qty": 6}, {"id": "beauveria", "name": "Beauveria bassiana bio-insecticide (1 kg)", "category": "Bio-inputs", "unit": "kg", "price": 5.0, "tags": ["caterpillar", "borer", "whitefly", "hopper", "organic"], "note": "Fungus that infects insects; works best in humid weather.", "max_qty": 6}, {"id": "biofert", "name": "Bio-fertiliser trio: Rhizobium/Azotobacter + PSB + KSB (3 x 1 L)", "category": "Nutrition", "unit": "set", "price": 8.0, "tags": ["fertility", "pulses", "legume", "yield", "organic", "all"], "note": "Cuts chemical fertiliser need; crop-specific strain matters.", "max_qty": 6}, {"id": "vermicompost", "name": "Vermicompost (50 kg bag)", "category": "Nutrition", "unit": "bag", "price": 6.0, "tags": ["fertility", "organic", "vegetable", "soil", "all"], "note": "Organic matter for soil health.", "max_qty": 6}, {"id": "micronutrient", "name": "Crop micronutrient mixture (Zn/B/Fe, 1 kg, as per state formulation)", "category": "Nutrition", "unit": "kg", "price": 5.0, "tags": ["yellowing", "zinc", "boron", "deficiency", "flower drop", "fruit crack"], "note": "Use only if deficiency is confirmed (soil test / symptoms checked by expert).", "max_qty": 6}, {"id": "zinc_sulphate", "name": "Zinc sulphate (5 kg)", "category": "Nutrition", "unit": "bag", "price": 5.0, "tags": ["zinc", "rice", "wheat", "khaira", "yellowing"], "note": "Common zinc correction in rice-wheat systems; soil test first.", "max_qty": 6}, {"id": "seed_tomato", "name": "Certified tomato seed, ToLCV-tolerant hybrid (10 g)", "category": "Seeds", "unit": "packet", "price": 12.0, "tags": ["tomato", "leaf curl", "resowing", "nursery"], "note": "Tolerant (not immune) to leaf curl virus; buy only certified/truthfully-labelled seed with a bill.", "max_qty": 6}, {"id": "seed_chilli", "name": "Certified chilli hybrid seed (10 g)", "category": "Seeds", "unit": "packet", "price": 10.0, "tags": ["chilli", "nursery"], "note": "Certified seed with bill.", "max_qty": 6}, {"id": "seed_pulse", "name": "Certified pulse seed, local recommended variety (5 kg)", "category": "Seeds", "unit": "bag", "price": 9.0, "tags": ["pulses", "gram", "tur", "moong", "resowing", "drought"], "note": "Use the state-recommended variety for your district.", "max_qty": 6}, {"id": "nursery_net", "name": "Insect-proof nursery net, 40 mesh (10 m)", "category": "Protection", "unit": "roll", "price": 8.0, "tags": ["nursery", "whitefly", "leaf curl", "virus", "vegetable"], "note": "Keeps vectors off seedlings: the cheapest leaf-curl prevention.", "max_qty": 6}, {"id": "mulch", "name": "Silver-black plastic mulch film (1 roll, ~400 m)", "category": "Water & soil", "unit": "roll", "price": 18.0, "tags": ["water", "weed", "vegetable", "whitefly", "mulch"], "note": "Saves water, suppresses weeds, reflective side repels some sucking pests.", "max_qty": 1}, {"id": "drip_kit", "name": "Drip irrigation starter kit (0.25 acre)", "category": "Water & soil", "unit": "kit", "price": 40.0, "tags": ["water", "drought", "irrigation", "vegetable", "orchard"], "note": "Saves water; government drip subsidy may apply (PMKSY).", "max_qty": 1}, {"id": "rain_gauge", "name": "Plastic rain gauge", "category": "Water & soil", "unit": "piece", "price": 3.0, "tags": ["water", "rain", "drought", "all"], "note": "Simple record for irrigation decisions.", "max_qty": 6}, {"id": "sprayer", "name": "Knapsack sprayer, 16 L, with nozzles", "category": "Equipment", "unit": "piece", "price": 22.0, "tags": ["spray", "equipment"], "note": "Needed for any bio-input spray.", "max_qty": 1}, {"id": "ppe", "name": "Spray safety kit: gloves, mask, goggles, apron", "category": "Safety", "unit": "kit", "price": 6.0, "tags": ["spray", "safety", "chemical", "all"], "note": "Mandatory with any spraying. Always added when a spray item is in the kit.", "max_qty": 6}, {"id": "crates", "name": "Plastic harvest crates (set of 5)", "category": "Post-harvest", "unit": "set", "price": 15.0, "tags": ["harvest", "tomato", "fruit", "vegetable", "storage"], "note": "Cuts bruising losses vs. gunny bags.", "max_qty": 1}, {"id": "tarpaulin", "name": "Tarpaulin sheet 6x8 m (grain drying / rain cover)", "category": "Post-harvest", "unit": "piece", "price": 12.0, "tags": ["harvest", "grain", "rain", "storage", "drying"], "note": "Protects harvested produce from rain.", "max_qty": 6}, {"id": "hermetic_bag", "name": "Hermetic grain storage bags (pack of 5)", "category": "Post-harvest", "unit": "pack", "price": 10.0, "tags": ["storage", "grain", "pulses", "weevil"], "note": "Stops storage pests without chemicals.", "max_qty": 6}];
const SECRETS = {};
const MODEL = 'openai/gpt-oss-120b (Groq), falling back to qwen3.8-27b / gpt-oss-20b (Groq), gemini-3.5-flash-lite, then rules';
const PAYPAL_API = 'https://api-m.sandbox.paypal.com';
const BYID = Object.fromEntries(CATALOG.map(c => [c.id, c]));

// ---------- safety floor (ported from KrishiDesk) ----------
const INGEST = ['drank','drink','drunk','swallow','ingest','consumed','poison','overdose','pi liya','pee liya','kha liya','zeher','zahar','जहर','ज़हर','विष','पी लिया'];
const SYMPTOM = ['headache','dizzy','dizziness','vomit','nausea','sweating','breath','unconscious','faint','fits','seizure','convulsion','blurred','froth','chest pain','collapsed','chakkar','ulti','चक्कर','उल्टी'];
const EXPOSURE = ['spray','sprayed','spraying','pesticide','insecticide','fungicide','herbicide','weedicide','chemical','dawai','davai','keetnashak','kitnashak','कीटनाशक'];
const SELF_HARM = ['suicide','suicidal','kill myself','end my life','want to die','aatmahatya','आत्महत्या','मरना चाहता'];
const PESTICIDES = ['monocrotophos','chlorpyrifos','imidacloprid','acephate','profenofos','cypermethrin','lambda','cyhalothrin','emamectin','fipronil','thiamethoxam','carbofuran','phorate','thimet','quinalphos','dimethoate','dichlorvos','endosulfan','paraquat','glyphosate','2,4-d','atrazine','mancozeb','carbendazim','tricyclazole','hexaconazole','propiconazole','chlorantraniliprole','spinosad','malathion','triazophos','parathion','aluminium phosphide','celphos','carbaryl','acetamiprid','flubendiamide','indoxacarb','methomyl'];
const DOSE = ['how many ml','how much ml',' ml ','ml per','dose','dosage','how much to spray','per litre','per liter','per pump','per tank','kitna'];
const norm = s => ' ' + String(s || '').toLowerCase().replace(/\s+/g, ' ') + ' ';
const has = (t, list) => list.some(w => t.includes(w));

// Fixed safety-floor notices in all three languages. Never generated by the model.
const SAFETY_MSG = {
  emergency_self_harm: {
    en: 'This sounds like someone may be in danger. Please call 112 (emergency) or the Tele-MANAS helpline 14416 now, and stay with the person. KhetKit does not build a kit for this request; a human must respond.',
    hi: 'यह किसी के लिए खतरे की स्थिति लगती है। अभी 112 (आपातकाल) या टेली-मानस हेल्पलाइन 14416 पर कॉल करें और उस व्यक्ति के साथ रहें। KhetKit इस अनुरोध के लिए कोई किट नहीं बनाता; एक इंसान को जवाब देना होगा।',
    mr: 'हे कोणाला धोका असल्याचे वाटते. आत्ता 112 (आणीबाणी) किंवा टेली-मानस हेल्पलाइन 14416 वर कॉल करा आणि त्या व्यक्तीसोबत राहा. KhetKit या विनंतीसाठी कोणतेही किट बनवत नाही; एखाद्या माणसाने प्रतिसाद द्यावा.',
  },
  emergency_poisoning: {
    en: 'SAFETY FIRST: this may be pesticide poisoning. Stop work, move the person to fresh air, remove contaminated clothes, wash skin with soap and water, and call 108 or go to the nearest hospital now with the product label. KhetKit does not build a kit for this request.',
    hi: 'सुरक्षा पहले: यह कीटनाशक विषाक्तता हो सकती है। काम रोकें, व्यक्ति को ताज़ी हवा में ले जाएं, दूषित कपड़े हटाएं, साबुन-पानी से त्वचा धोएं, और अभी 108 पर कॉल करें या उत्पाद का लेबल लेकर नज़दीकी अस्पताल जाएं। KhetKit इस अनुरोध के लिए कोई किट नहीं बनाता।',
    mr: 'सुरक्षितता प्रथम: हे कीटकनाशक विषबाधा असू शकते. काम थांबवा, व्यक्तीला ताज्या हवेत न्या, दूषित कपडे काढा, साबण-पाण्याने त्वचा धुवा आणि आत्ता 108 वर कॉल करा किंवा उत्पादाचे लेबल घेऊन जवळच्या रुग्णालयात जा. KhetKit या विनंतीसाठी कोणतेही किट बनवत नाही.',
  },
  chemical: {
    en: 'You named a chemical pesticide or asked for a dose. KhetKit never sells or doses chemical pesticides: an expert visit is added to the kit, and the expert decides any chemical and its label dose.',
    hi: 'आपने एक रासायनिक कीटनाशक का नाम लिया या खुराक पूछी। KhetKit कभी रासायनिक कीटनाशक नहीं बेचता और न ही मात्रा बताता है: किट में एक विशेषज्ञ विज़िट जोड़ी जाती है, और विशेषज्ञ कोई भी रसायन और उसकी लेबल खुराक तय करता है।',
    mr: 'तुम्ही रासायनिक कीटकनाशकाचे नाव घेतले किंवा डोस विचारला. KhetKit कधीही रासायनिक कीटकनाशके विकत नाही किंवा डोस सांगत नाही: किटमध्ये एक तज्ज्ञ भेट जोडली जाते, आणि तज्ज्ञ कोणताही रसायन आणि त्याचा लेबल डोस ठरवतो.',
  },
};

function safety(text, lang) {
  const t = norm(text);
  const L = ['en','hi','mr'].includes(lang) ? lang : 'en';
  if (has(t, SELF_HARM)) return { level: 'emergency', message: SAFETY_MSG.emergency_self_harm[L] };
  if (has(t, INGEST) || (has(t, SYMPTOM) && (has(t, EXPOSURE) || has(t, PESTICIDES)))) return { level: 'emergency', message: SAFETY_MSG.emergency_poisoning[L] };
  if (has(t, PESTICIDES) || has(t, DOSE)) return { level: 'chemical', message: SAFETY_MSG.chemical[L] };
  return { level: 'none' };
}

// ---------- helpers ----------
const json = (o, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' } });
const rid = () => 'KK-' + Date.now().toString(36).toUpperCase().slice(-5) + Math.random().toString(36).slice(2, 6).toUpperCase();
const money = n => Math.round(n * 100) / 100;
const SPRAY_ITEMS = ['neem_oil', 'beauveria', 'pseudomonas'];

function ruleKit(need, budget) {
  const t = norm(need); const scored = CATALOG.map(c => ({ c, s: c.tags.filter(g => g !== 'all' && t.includes(g)).length })).filter(x => x.s > 0).sort((a, b) => b.s - a.s);
  const items = scored.slice(0, 5).map(x => ({ id: x.c.id, qty: 1, why: 'Matches: ' + x.c.tags.filter(g => t.includes(g)).join(', ') + '. ' + x.c.note }));
  if (!items.length) items.push({ id: 'soil_test', qty: 1, why: 'Start with a soil test.' }, { id: 'kvk_consult', qty: 1, why: 'An expert visit to pin down the problem.' });
  return { summary: 'Rule-based kit (AI unavailable): items whose tags match your words.', assumptions: [], expert_questions: [], needs_expert: true, items };
}

function validate(plan, budget, safetyLevel) {
  const notes = []; let items = [];
  const seen = new Set();
  for (const it of (plan.items || [])) {
    const c = BYID[it.id]; if (!c) { notes.push('Dropped an unknown item the model suggested (' + String(it.id).slice(0, 30) + ').'); continue; }
    if (seen.has(c.id)) continue; seen.add(c.id);
    let q = Math.max(1, Math.min(c.max_qty, parseInt(it.qty) || 1));
    if (q !== (parseInt(it.qty) || 1)) notes.push(c.name + ': quantity capped at ' + c.max_qty + '.');
    items.push({ id: c.id, qty: q, why: String(it.why || c.note).slice(0, 300) });
  }
  if ((plan.needs_expert || safetyLevel === 'chemical') && !seen.has('kvk_consult')) { items.unshift({ id: 'kvk_consult', qty: 1, why: safetyLevel === 'chemical' ? 'You asked about a chemical or a dose: an expert decides that, not the agent.' : 'The agent is not sure of the diagnosis: an expert confirms it first.' }); seen.add('kvk_consult'); notes.push('Safety floor: expert visit added.'); }
  if (items.some(i => SPRAY_ITEMS.includes(i.id)) && !seen.has('ppe')) { items.push({ id: 'ppe', qty: 1, why: 'Safety kit is mandatory whenever the kit includes something to spray.' }); seen.add('ppe'); notes.push('Safety floor: spray safety kit added.'); }
  const total = () => money(items.reduce((s, i) => s + BYID[i.id].price * i.qty, 0));
  const locked = new Set(['kvk_consult', 'ppe']);
  if (budget > 0) {
    // trim quantities first, then drop the lowest-priority (last) unlocked items
    while (total() > budget) {
      const big = [...items].reverse().find(i => i.qty > 1 && !locked.has(i.id));
      if (big) { big.qty--; continue; }
      const idx = [...items].map((i, k) => [i, k]).reverse().find(([i]) => !locked.has(i.id));
      if (!idx) break;
      notes.push('Over budget: removed ' + BYID[idx[0].id].name + '.'); items.splice(idx[1], 1);
    }
    if (total() > budget) notes.push('Even the safety-floor items exceed the budget; funders can cover the gap.');
  }
  const lines = items.map(i => ({ ...i, name: BYID[i.id].name, category: BYID[i.id].category, unit: BYID[i.id].unit, price: BYID[i.id].price, line_total: money(BYID[i.id].price * i.qty) }));
  return { lines, total: total(), notes };
}

// Language names for the AI prompt instruction.
const LANG_INSTRUCTION = {
  hi: 'Write every item reason (why), the summary, assumptions, and expert_questions in Hindi using Devanagari script. Item names may stay as on the product label.',
  mr: 'Write every item reason (why), the summary, assumptions, and expert_questions in Marathi using Devanagari script. Item names may stay as on the product label.',
  en: '',
};

async function aiPlan(env, p) {
  const key = SECRETS.GROQ_API_KEY; if (!key) throw new Error('no model key');
  const lang = ['en','hi','mr'].includes(p.lang) ? p.lang : 'en';
  const langLine = LANG_INSTRUCTION[lang] ? '\n- ' + LANG_INSTRUCTION[lang] : '';
  const cat = CATALOG.map(c => `${c.id} | ${c.name} | $${c.price}/${c.unit} | max ${c.max_qty} | ${c.note}`).join('\n');
  const sys = `You are KhetKit, a careful procurement agent for small farmers in India. You turn a farmer's need into a SMALL kit of inputs chosen ONLY from the catalogue below, within the budget.
Rules:
- Only catalogue ids. 2 to 7 items. Quantities sized to the stated area (acres) and the item's max.
- NEVER recommend chemical pesticides, doses or mixtures (they are not in the catalogue). If the problem may need a chemical, set needs_expert=true and include kvk_consult.
- Do not claim any item cures a virus disease. For virus symptoms (leaf curl, mosaic), focus on vector control, nursery protection, resistant/tolerant seed, and an expert visit.
- Prefer diagnosis (soil_test, kvk_consult) when the cause is unclear. Prefer prevention and bio-inputs.
- "why" = one plain sentence a farmer understands; no exaggeration.
- Write summary, assumptions, expert_questions and every why in the SAME language and script the farmer used in the need text (English need -> English; Hindi in Devanagari -> Hindi; Marathi -> Marathi). Place names do not change the language.${langLine}
- soil_test: 1 per field, not per acre. For fruit/pod borers prefer pheromone traps; for sucking pests prefer sticky traps; neem only as a botanical support.
Return JSON only: {"summary": string (2 sentences, what you think is going on and the plan; say it is not a diagnosis), "assumptions": [string], "expert_questions": [string] (what an expert should check), "needs_expert": boolean, "items": [{"id": string, "qty": integer, "why": string}]}
Catalogue (id | name | price | max qty | note):
${cat}`;
  const user = `Farmer need: ${p.need}\nCrop: ${p.crop || 'not stated'}\nArea: ${p.acres || 'not stated'} acres\nBudget: $${p.budget || 'not stated'}`;
  const tries = [];
  for (const m of ['openai/gpt-oss-120b', 'qwen/qwen3.8-27b', 'openai/gpt-oss-20b']) {
    const t0 = Date.now();
    try {
      const r = await fetch('https://api.groq.com/openai/v1/chat/completions', { method: 'POST', headers: { authorization: 'Bearer ' + key, 'content-type': 'application/json' },
        body: JSON.stringify({ model: m, temperature: 0.2, response_format: { type: 'json_object' }, messages: [{ role: 'system', content: sys }, { role: 'user', content: user }] }) });
      if (!r.ok) { tries.push(m + ' ' + r.status); continue; }
      const j = await r.json(); const plan = JSON.parse(j.choices[0].message.content.replace(/^[^{]*/, '').replace(/[^}]*$/, ''));
      return { plan, ms: Date.now() - t0, model: m + ' (Groq)', tries };
    } catch (e) { tries.push(m + ' ' + e.message); }
  }
  if (SECRETS.GEMINI_API_KEY) {
    const t0 = Date.now(); const m = 'gemini-3.5-flash-lite';
    try {
      const ctl = new AbortController(); const to = setTimeout(() => ctl.abort(), 25000);
      const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${m}:generateContent?key=${SECRETS.GEMINI_API_KEY}`, { method: 'POST', signal: ctl.signal, headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ systemInstruction: { parts: [{ text: sys }] }, contents: [{ role: 'user', parts: [{ text: user }] }], generationConfig: { responseMimeType: 'application/json', temperature: 0.2 } }) });
      clearTimeout(to);
      if (r.ok) { const j = await r.json(); const plan = JSON.parse(j.candidates[0].content.parts.map(x => x.text || '').join('')); return { plan, ms: Date.now() - t0, model: m + ' (Gemini API)', tries }; }
      tries.push(m + ' ' + r.status);
    } catch (e) { tries.push(m + ' ' + e.message); }
  }
  throw new Error('all models busy: ' + tries.join('; '));
}

async function ppToken() {
  const r = await fetch(PAYPAL_API + '/v1/oauth2/token', { method: 'POST', headers: { authorization: 'Basic ' + btoa(SECRETS.PAYPAL_CLIENT_ID + ':' + SECRETS.PAYPAL_SECRET), 'content-type': 'application/x-www-form-urlencoded' }, body: 'grant_type=client_credentials' });
  const j = await r.json(); if (!j.access_token) throw new Error('paypal auth ' + r.status); return j.access_token;
}
function orderBody(kit, amount) {
  const full = Math.abs(amount - kit.total) < 0.01;
  const pu = { reference_id: kit.id, custom_id: kit.id, description: ('KhetKit ' + kit.id + ' for ' + (kit.crop || 'a farm')).slice(0, 127), amount: { currency_code: 'USD', value: amount.toFixed(2) } };
  if (full) { pu.amount.breakdown = { item_total: { currency_code: 'USD', value: kit.total.toFixed(2) } }; pu.items = kit.lines.map(l => ({ name: l.name.slice(0, 127), quantity: String(l.qty), unit_amount: { currency_code: 'USD', value: l.price.toFixed(2) }, category: l.id === 'kvk_consult' || l.id === 'soil_test' ? 'DIGITAL_GOODS' : 'PHYSICAL_GOODS' })); }
  return { intent: 'CAPTURE', purchase_units: [pu] };
}

// Storage: KV when bound; otherwise the kit travels with the browser, signed (HMAC) so prices and lines cannot be edited.
const MEM = globalThis.__KK_MEM || (globalThis.__KK_MEM = { kits: new Map(), ledger: [] });
async function hmac(s) { const k = await crypto.subtle.importKey('raw', new TextEncoder().encode('khetkit:' + (SECRETS.GROQ_API_KEY || 'dev')), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return [...new Uint8Array(await crypto.subtle.sign('HMAC', k, new TextEncoder().encode(s)))].map(b => b.toString(16).padStart(2, '0')).join(''); }
const canon = k => JSON.stringify([k.id, k.total, k.lines.map(l => [l.id, l.qty, l.price])]);
async function sign(kit) { kit.sig = await hmac(canon(kit)); return kit; }
async function getKit(env, id, carried) {
  if (env.DATA) { const v = await env.DATA.get('kit:' + id); if (v) return JSON.parse(v); }
  if (MEM.kits.has(id)) return MEM.kits.get(id);
  if (carried && carried.id === id && carried.sig && carried.sig === await hmac(canon(carried))) { carried.funded = Math.max(0, Math.min(carried.total, Number(carried.funded) || 0)); carried.payments = Array.isArray(carried.payments) ? carried.payments.slice(-10) : []; return carried; }
  return null;
}
async function putKit(env, kit) { await sign(kit); MEM.kits.set(kit.id, kit); if (MEM.kits.size > 500) MEM.kits.delete(MEM.kits.keys().next().value); if (env.DATA) await env.DATA.put('kit:' + kit.id, JSON.stringify(kit), { expirationTtl: 60 * 60 * 24 * 30 }); }
async function ledgerGet(env) { if (env.DATA) return JSON.parse(await env.DATA.get('ledger') || '[]'); return MEM.ledger; }
async function ledgerAdd(env, row) { const L = await ledgerGet(env); L.unshift(row); const S = L.slice(0, 30); if (env.DATA) await env.DATA.put('ledger', JSON.stringify(S)); else MEM.ledger = S; }

async function limited(env, req) {
  if (!env.DATA) { const ip = req.headers.get('cf-connecting-ip') || 'x'; const k = ip + new Date().toISOString().slice(0, 13); MEM.rl = MEM.rl || {}; MEM.rl[k] = (MEM.rl[k] || 0) + 1; return MEM.rl[k] > 40; } const ip = req.headers.get('cf-connecting-ip') || 'x'; const k = 'rl:' + ip + ':' + new Date().toISOString().slice(0, 13);
  const n = parseInt(await env.DATA.get(k) || '0') + 1; await env.DATA.put(k, String(n), { expirationTtl: 7200 }); return n > 40;
}

export default {
  async fetch(req, env) {
    for (const k of ['GROQ_API_KEY', 'PAYPAL_CLIENT_ID', 'PAYPAL_SECRET']) if (env[k]) SECRETS[k] = env[k];
    const url = new URL(req.url); const p = url.pathname;
    try {
      if (p === '/api/config') return json({ storage: env.DATA ? 'kv' : 'signed-in-browser', paypal_client_id: SECRETS.PAYPAL_CLIENT_ID || 'sb', server_orders: !!(SECRETS.PAYPAL_CLIENT_ID && SECRETS.PAYPAL_SECRET), model: MODEL, ai: !!SECRETS.GROQ_API_KEY, catalog_size: CATALOG.length });
      if (p === '/api/catalog') return json(CATALOG);
      if (p === '/api/plan' && req.method === 'POST') {
        if (await limited(env, req)) return json({ error: 'Too many kits from this network this hour. Try again later.' }, 429);
        const b = await req.json(); const need = String(b.need || '').slice(0, 1200); const budget = Math.max(0, Math.min(500, Number(b.budget) || 0));
        if (need.trim().length < 8) return json({ error: 'Describe the need in a sentence or two.' }, 400);
        const s = safety(need + ' ' + (b.crop || ''));
        if (s.level === 'emergency') return json({ blocked: true, safety: s });
        let plan, ms = null, source = 'ai';
        let usedModel = null; try { const r = await aiPlan(env, { ...b, need, budget }); plan = r.plan; ms = r.ms; usedModel = r.model; } catch (e) { plan = ruleKit(need, budget); source = 'rules (' + e.message + ')'; }
        const v = validate(plan, budget, s.level);
        const kit = { id: rid(), created: new Date().toISOString(), crop: String(b.crop || '').slice(0, 40), acres: Number(b.acres) || null, budget, need, summary: String(plan.summary || '').slice(0, 600), assumptions: (plan.assumptions || []).slice(0, 4), expert_questions: (plan.expert_questions || []).slice(0, 4), needs_expert: !!plan.needs_expert || s.level === 'chemical', safety: s, lines: v.lines, total: v.total, notes: v.notes, source, model: usedModel, model_ms: ms, funded: 0, payments: [] };
        await putKit(env, kit);
        return json(kit);
      }
      if (p === '/api/kit') { const k = await getKit(env, url.searchParams.get('id')); return k ? json(k) : json({ error: 'not found' }, 404); }
      if (p === '/api/order' && req.method === 'POST') {
        const b = await req.json(); const kit = await getKit(env, b.kit_id, b.kit); if (!kit) return json({ error: 'kit not found' }, 404);
        const left = money(kit.total - kit.funded); const amount = money(Math.min(left, Math.max(1, Number(b.amount) || left)));
        if (!(SECRETS.PAYPAL_CLIENT_ID && SECRETS.PAYPAL_SECRET)) return json({ mode: 'client', body: orderBody(kit, amount) });
        const tok = await ppToken();
        const r = await fetch(PAYPAL_API + '/v2/checkout/orders', { method: 'POST', headers: { authorization: 'Bearer ' + tok, 'content-type': 'application/json', 'PayPal-Request-Id': kit.id + '-' + Date.now() }, body: JSON.stringify(orderBody(kit, amount)) });
        const j = await r.json(); return json({ mode: 'server', id: j.id, status: j.status, debug_id: j.debug_id || null }, r.ok ? 200 : 502);
      }
      if (p === '/api/capture' && req.method === 'POST') {
        const b = await req.json(); const kit = await getKit(env, b.kit_id, b.kit); if (!kit) return json({ error: 'kit not found' }, 404);
        let rec;
        if (SECRETS.PAYPAL_CLIENT_ID && SECRETS.PAYPAL_SECRET) {
          const tok = await ppToken();
          const r = await fetch(PAYPAL_API + '/v2/checkout/orders/' + encodeURIComponent(b.order_id) + '/capture', { method: 'POST', headers: { authorization: 'Bearer ' + tok, 'content-type': 'application/json' } });
          const j = await r.json(); const cap = j.purchase_units?.[0]?.payments?.captures?.[0];
          rec = { order_id: j.id, status: j.status, amount: Number(cap?.amount?.value || 0), capture_id: cap?.id || null, verified: 'server-captured (PayPal sandbox)' };
        } else {
          rec = { order_id: String(b.order_id).slice(0, 40), status: String(b.status || 'COMPLETED').slice(0, 20), amount: Number(b.amount) || 0, capture_id: String(b.capture_id || '').slice(0, 40) || null, verified: 'client-captured (PayPal sandbox, demo client id)' };
        }
        if (rec.status === 'COMPLETED') { kit.funded = money(Math.min(kit.total, kit.funded + rec.amount)); kit.payments.push({ ...rec, at: new Date().toISOString() }); await putKit(env, kit);
          await ledgerAdd(env, { kit_id: kit.id, crop: kit.crop, amount: rec.amount, total: kit.total, funded: kit.funded, at: new Date().toISOString(), verified: rec.verified }); }
        return json({ kit, payment: rec, plan: fulfilment(kit) });
      }
      if (p === '/api/ledger') return json(await ledgerGet(env));
      return env.ASSETS.fetch(req);
    } catch (e) { return json({ error: 'server error: ' + e.message }, 500); }
  }
};

function fulfilment(kit) {
  const route = { 'Diagnosis': 'Krishi Vigyan Kendra / accredited soil lab', 'Pest monitoring': 'FPO input shop', 'Bio-inputs': 'State-approved bio-input lab or FPO shop', 'Nutrition': 'FPO input shop', 'Seeds': 'Licensed seed dealer (certified seed, bill)', 'Protection': 'FPO input shop', 'Water & soil': 'Registered drip/mulch dealer (check PMKSY subsidy first)', 'Equipment': 'FPO custom hiring centre or dealer', 'Safety': 'FPO input shop', 'Post-harvest': 'FPO input shop' };
  const by = {}; for (const l of kit.lines) { const k = route[l.category] || 'FPO input shop'; (by[k] = by[k] || []).push(l); }
  return Object.entries(by).map(([supplier, ls]) => ({ supplier, items: ls.map(l => l.qty + ' x ' + l.name), amount: money(ls.reduce((s, l) => s + l.line_total, 0)), payout: kit.funded >= kit.total ? 'ready for PayPal Payouts to the supplier on delivery confirmation' : 'waiting for full funding' }));
}
