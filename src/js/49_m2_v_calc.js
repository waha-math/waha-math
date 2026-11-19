/* =====================================================================
   المرحلة 2 · الوحدات الحسابية المصغّرة أ–هـ (S2_نظام_التقييم، الجزء 2؛ D44): «إحماء الحساب» قبل S2-U0 وU3 وU6 وU7 وU8
   اختبار تخطٍّ قصير بلوحة أرقام (لا اختيار من ثلاثة: التخمين فيه الثلث)، بلا مساعدة أثناءه، ونتيجته شجرة لا رقم:
   🟢 85% فأكثر يبدأ الوحدة · 🟡 60–84% يبدأ مع تذكرة للكبار ونشاط · 🔴 أقل من 60% نشاط مع الكبار وإعادة الإحماء بعد أسبوع.
   لا يُقفل شيءٌ بالنتيجة: دروس الجسر الحسابية (عنقود N/F، D235) لم تُكتب بعد (docs/خطة_تقييم_المرحلة_2.md).
   الأعداد بكتابة الطفل (D229 (2))، والجملة العددية باتجاه كتابتها (D251).
   ===================================================================== */
/* كلمة العدد: حتى المئة من كلمات م1، وما فوقها كلمات قليلة بعينها (gen.numx.*) لا تُحسب «كلمة لكل عدد» في فحص الأعداد */
const calcw = n => n <= 100 ? numw(n) : 'gen.numx.' + n;
const CALC_OP = { '+': ['+', 'gen.op.plus'], '-': ['−', 'gen.op.minus'], 'x': ['×', 'gen.op.times'], '/': ['÷', 'gen.op.div'] };
const calcRes = (a, op, b) => op === '+' ? a + b : op === '-' ? a - b : op === 'x' ? a * b : a / b;
const calcInv = (a, op, b) => op === '+' ? a - b : op === '-' ? a + b : op === 'x' ? (b ? a / b : null) : a * b;

/* لوحة الأرقام: عشرة أرقام بكتابة الطفل، ومسح، و«تمّ» (كل مفتاح ≥ 56 بكسلاً على أضيق شاشة). max: أكثر الأرقام */
function numPad(want, o = {}) { const box = document.createElement('div'); box.className = 'choices numpad'; $('#stage').appendChild(box); let v = '', fin = false;
  const out = document.createElement('div'); out.className = 'npv'; out.setAttribute('aria-live', 'polite'); out.setAttribute('dir', 'ltr'); box.appendChild(out);
  const show = () => { out.textContent = v === '' ? '؟' : DG(v); out.classList.toggle('empty', v === ''); /*T*/window.__npV = v;/*/T*/ };
  const key = (d, lab, html, cls = '') => { const b = document.createElement('button'); b.className = 'pick npk ' + cls; b.dataset.k = d; b.innerHTML = html; b.setAttribute('aria-label', lab); box.appendChild(b); return b; };
  const keys = {};
  for (const d of [1, 2, 3, 4, 5, 6, 7, 8, 9, 0]) keys[d] = key(String(d), plain(T(numw(d))), `<b>${DG(d)}</b>`);
  const del = key('del', plain(labelText('padDel')), '<svg viewBox="0 0 40 30" width="38" height="28" aria-hidden="true"><path d="M14 3 H36 V27 H14 L3 15 Z" fill="none" stroke="currentColor" stroke-width="3" stroke-linejoin="round"/><path d="M19 10 L29 20 M29 10 L19 20" stroke="currentColor" stroke-width="3" stroke-linecap="round"/></svg>', 'npdel');
  const ok = key('ok', plain(labelText('done')), ICON.check + `<span>${esc(G(labelText('done')))}</span>`, 'done npok');
  const max = o.max || 4, put = d => { if (fin) return; if (v === '0') v = ''; if (v.length >= max) { SFX.soft(); return; } v += d; SFX.tick(); show(); };
  for (const d of Object.keys(keys)) keys[d].onclick = () => put(d);
  del.onclick = () => { if (fin) return; v = v.slice(0, -1); SFX.tick(); show(); };
  show();
  const p = gate(new Promise(res => { ok.onclick = () => { if (fin || v === '') { if (!fin) SFX.soft(); return; } fin = true; AUTO_CLEAR(); hush(); box.remove(); res(+v); }; }));
  const type = n => { v = ''; for (const ch of String(n)) put(ch); };
  AUTO({ kind: 'numPad', want, ok: () => { type(want); ok.click(); }, wrong: () => { type(want + 1); ok.click(); } });
  return { p, box }; }

/* مسرح السؤال: الجملة العددية أو العبارة أو الصورة */
const calcStage = (H = 130) => { const svg = newStage(H, { oasis: false, ground: 0 }); el('rect', { x: 30, y: 14, width: 300, height: H - 30, rx: 16, fill: '#fffdf6', stroke: css('--line'), 'stroke-width': 2.5 }, svg); return svg; };
function calcLine(svg, toks, y = 80, fs = 40) { const t = el('text', { x: 180, y, 'text-anchor': 'middle', 'font-size': fs, 'font-weight': 800, fill: css('--ink'), direction: 'ltr', 'unicode-bidi': 'bidi-override', 'data-sent': 1 }, svg); t.textContent = visualLine(toks); return t; }
function calcPhrase(svg, text, y = 80, fs = 36) { const t = el('text', { x: 180, y, 'text-anchor': 'middle', 'font-size': fs, 'font-weight': 800, fill: css('--ink'), direction: 'rtl' }, svg); t.textContent = text; return t; }

/* ================= البند: a op b | fn half/double/quarter مع n | seq متتالية بفراغ (null) | round [متر، سم] لأقرب متر وسؤاله في q | share [الكل، المجموعات] وسؤاله في q ================= */
ITEM.calc = {
  make(spec) { let want;
    if (spec.op) want = calcRes(spec.a, spec.op, spec.b);
    else if (spec.fn) want = spec.fn === 'half' ? spec.n / 2 : spec.fn === 'double' ? spec.n * 2 : spec.n / 4;
    else if (spec.seq) { const i = spec.seq.indexOf(null), d = (spec.seq[i === 0 ? 2 : 1] - spec.seq[i === 0 ? 1 : 0]); want = i === 0 ? spec.seq[1] - d : spec.seq[i - 1] + d; }
    else if (spec.share) want = spec.share[0] / spec.share[1];
    else if (spec.round) want = Math.round(spec.round[0] + spec.round[1] / 100);
    else want = spec.want;
    /*T*/if (TESTHOOK && !(Number.isInteger(want) && want >= 0)) testBug('calc: الجواب عدد صحيح غير سالب: ' + JSON.stringify(spec));/*/T*/
    return { ...spec, want, tag: 'calc-' + (spec.op ? 'op' + ({ '+': 'add', '-': 'sub', 'x': 'mul', '/': 'div' })[spec.op] : spec.fn || (spec.seq ? 'seq' : spec.share ? 'share' : spec.round ? 'round' : 'phrase')) }; },
  async ask(item, mode, tries) { const svg = calcStage(item.share ? 176 : 130);   /* مسرح قصير: لوحة الأرقام تحته على أقصر شاشة */
    if (item.op) calcLine(svg, [DG(item.a), CALC_OP[item.op][0], DG(item.b), '=', '؟']);
    else if (item.fn) calcPhrase(svg, `${labelText('calc.' + item.fn)} ${DG(item.n)}`);
    else if (item.seq) calcLine(svg, item.seq.flatMap((x, i) => (i ? [NUM_DIR() === 'rtl' ? '،' : ','] : []).concat([x == null ? '؟' : DG(x)])), 80, 32);
    else if (item.share) calcShare(svg, item.share, item.what || 'cookie');
    else if (item.round) calcPhrase(svg, `${DG(item.round[0])} ${labelText('lenM')} ${DG(item.round[1])} ${labelText('rulCm')}`, 80, 36);
    else calcPhrase(svg, item.show, 80, 34);
    await S(item.q || 'gen.calc.q', { noGap: true });
    if (item.op) { await S(calcw(item.a), { noGap: true, append: true }); await S(CALC_OP[item.op][1], { noGap: true, append: true }); await S(calcw(item.b), { noGap: true, append: true }); await S('gen.calc.eqHow', { append: true }); }
    else if (item.fn) { await S(calcw(item.n), { noGap: true, append: true }); await S('gen.calc.' + item.fn + 'Q', { append: true }); }
    else if (item.seq) { for (const x of item.seq) if (x != null) await S(calcw(x), { noGap: true, append: true }); await S('gen.calc.seqQ', { append: true }); }
    const np = numPad(item.want, { max: String(item.want).length + 1 }); return { ans: await np.p, ctx: { svg } }; },
  judge(item, v) { if (v === item.want) return { ok: true };
    const inv = item.op ? calcInv(item.a, item.op, item.b) : item.fn === 'half' ? item.n * 2 : item.fn === 'double' ? item.n / 2 : null;
    return { ok: false, err: inv != null && v === inv ? 'calcInverse' : v === item.want * 10 || v * 10 === item.want ? 'calcPlace' : 'calcOff' }; },
  onOk() { SFX.good(); }, onWrong() { SFX.soft(); },
  async hint2() { await S('gen.calc.hint'); }, async together() {},
  async reveal(item) { await S('gen.calc.reveal', { noGap: true }); await S(calcw(item.want), { append: true }); },
  praise: () => 'praiseCount', twin(item) { return item.twin || null; },
};
/* التوزيع بالتساوي: الكلّ أشياء في صفوف، والمجموعات أطباق فارغة تحتها */
function calcShare(svg, [n, k], what) { const per = Math.min(10, n), rows = Math.ceil(n / per), sp = Math.min(28, 270 / per);
  for (let i = 0; i < n; i++) { const r = Math.floor(i / per), c = i % per, x = 180 + (c - (Math.min(per, n - r * per) - 1) / 2) * sp; frThing(svg, what, x, 38 + r * 28, .45); }
  const py = 38 + rows * 28 + 30, ps = Math.min(76, 280 / k); for (let j = 0; j < k; j++) { const x = 180 + (j - (k - 1) / 2) * ps; el('ellipse', { cx: x, cy: py, rx: ps * .42, ry: 14, fill: '#f4f0e6', stroke: '#9fb4c0', 'stroke-width': 2.5 }, svg); } }

/* ================= المشهد: إحماء الحساب (بلا مساعدة ولا «أخطأت»، ثم الشجرة بالنطاق) =================
   c.items: [{id, item}]، وc.lines: { go, help, build } جمل النتيجة؛ والنتيجة في تقدّم الدرس: calc = go | help | build */
SCENES.calcCheck = async (c, L) => { const P = progOf(L.id); if (c.intro) await S(c.intro);
  let ok = 0; const wrong = [];
  for (const q of c.items) { const r = await runItem(q.item, 'test', { scene: 'calc' }); if (r.ok) ok++; else wrong.push(q.id); }
  const n = c.items.length, f = ok / n, band = f >= .85 ? 'go' : f >= .6 ? 'help' : 'build';
  P.calc = band; P.score = ok; P.of = n; P.at = Date.now(); saveProg();
  logAttempt({ scene: 'calc', tag: 'result', ok: band === 'go', band, score: ok, of: n, wrongIds: wrong });
  const svg = newStage(230, { oasisOpacity: .25 }), T = calcTree(svg, 180, 200, band === 'go' ? 1 : band === 'help' ? .7 : .45); anim(T, [{ opacity: 0, transform: 'translateY(10px)' }, { opacity: 1, transform: 'none' }], { duration: 600, fill: 'both' });
  await S(c.lines[band]); if (band !== 'go' && c.lines.adult) await S(c.lines.adult); };
/* شجرة النتيجة: تكبر بالنطاق (مستويات لا أرقام أمام الطفل) */
function calcTree(svg, x, y, k = 1) { const g = el('g', { transform: `translate(${x} ${y})` }, svg);
  el('rect', { x: -7, y: -70 * k, width: 14, height: 70 * k, rx: 5, fill: '#9a6b42' }, g);
  for (const [dx, dy, r] of [[0, -100, 46], [-36, -78, 34], [36, -78, 34], [-20, -120, 30], [22, -122, 30]]) el('circle', { cx: dx * k, cy: dy * k, r: r * k, fill: '#5aa469', opacity: .92 }, g);
  return g; }
