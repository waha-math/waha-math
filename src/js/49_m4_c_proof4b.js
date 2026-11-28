/* =====================================================================
   M4-U2 «البرهان والمثلث»: الألعاب الحركية (D288 (2)، خطة ألعاب المرحلة 4)
   د1 «سلسلة السبب» (prChainGame): يلمس خطوات البرهان بترتيبها (الأولى ثم الثانية)، ثم يختار سبب الخطوة المسؤولة
   د2 «أغلق البرهان» (prFixGame): البرهان مكتوبٌ وأسبابٌ منه ناقصة: يملأ كلّ ناقصٍ بترتيبه
   د3 «القطع الذكية» (ineqGame): يلمس ثلاثة أعواد فتقوم على طرفي أطولها: تلتقي أم لا، ثم يقارن مجموع القصيرين بالطويل
   د4 «بنّاء المضلعات» (polyGame): يضيف مثلثاتٍ متّصلة من رأسٍ واحد حتى ينطبق المضلع على الإطار، ثم يعدّ المثلثات، ثم يضرب في 180
   ===================================================================== */
/* بطاقات أسبابٍ على المسرح (لا HTML تحته، فلا يصغر الرسم بين الخطوات): ثلاث بطاقاتٍ تُقرأ بالترتيب، ومنطقة لمسها 56 بكسلاً */
async function pfReasonChips(svg, ks, ok, y0, isLive, o = {}) { const CH = ks.map((k, i) => { const y = y0 + i * 46, t = el('g', { 'data-rs': k }, svg);
    el('rect', { x: 34, y, width: 292, height: 40, rx: 10, fill: '#fff', stroke: PF.c, 'stroke-width': 2 }, t); const tx = el('text', { x: 312, y: y + 26, 'text-anchor': 'start', 'font-size': 15, 'font-weight': 800, fill: PF.ink, direction: 'rtl', 'pointer-events': 'none' }, t); tx.textContent = plain(T('gen.pf.rs.' + k)); pfFitW(tx, 264, 15);
    return { g: t, k, label: plain(T('gen.pf.rs.' + k)) }; });
  const p = tapOne(CH, { ok, bad: o.bad, pad: 56 }); (async () => { for (const t of CH) { if (!isLive()) return; t.g.querySelector('rect').setAttribute('stroke-width', 4); await S('gen.pf.rs.' + t.k); t.g.querySelector('rect').setAttribute('stroke-width', 2); } })();   /* تُقرأ البطاقات (الطفل قد لا يقرأ، المبدأ 8) */
  const k = await p; hush(); CH.forEach(t => t.g.remove()); return k; }

/* ---------- د1 «سلسلة السبب» (prChainGame): pf، v صورة البرهان، rs الخطوة المسؤول عن سببها، opts [الصحيح ثم مشتّتان] ---------- */
ITEM.prChainGame = {
  make(spec) { const order = shuffle([0, 1, 2]), rs = spec.rs ?? 1; /*T*/if (TESTHOOK && spec.cands[0] !== PF_PROOFS[spec.pf].rs[rs]) testBug('prChainGame: السبب الأول ليس سبب الخطوة');/*/T*/
    return { ...spec, step: 0, order, rs, picked: [], tag: 'pf-chain-g-' + spec.pf }; },
  async ask(item, mode, tries) { item.__try = tries; const svg = m3Stage(390), v = item.v || 0, top = el('g', { 'pointer-events': 'none' }, svg), ctx = { svg, top }, t0 = item.step, TG = k => tries >= 3 && t0 === k; let live = true; const isLive = () => live && svg.isConnected;
    pfGiven(top, item.pf, v, 16); const fig = el('g', {}, top); pfFitFig(fig, item.pf, 74, 146, { v, sMax: .56, y0: 64, s: .48 }); ctx.fig = fig;
    const drawCards = () => item.order.map((n, i) => { const c = el('g', { 'data-step': n }, svg), y = PF_CY(i), done = item.picked.includes(n);
      el('rect', { x: 20, y, width: 320, height: 70, rx: 10, fill: done ? 'rgba(47,157,107,.10)' : PF.card, stroke: done ? PF.ok : PF.edge, 'stroke-width': 2 }, c); pfStep(c, y + 30, item.pf, n, { x: 300, fs: 15, two: true, v, ask: n === item.rs && item.step < 3 });
      if (done) badge(c, 34, y + 35, item.picked.indexOf(n) + 1, PF.ok); return { g: c, n, i }; });
    let C = drawCards(); ctx.C = C;
    while (item.step < 2) { const want = item.step, tg = TG(item.step);   /* الخطوة 0 ثم 1، والثالثة تبقى وحدها فتُرقَّم */
      if (tg && want) hlRing(helpG(svg), [34, PF_CY(item.order.indexOf(0)) + 35], 13, H2C[1]);
      if (tg && !want) { const c2 = C.find(c => c.n === 2); if (c2) c2.g.setAttribute('opacity', .35); }   /* والنتيجة المُبعَدة باهتةٌ ظاهراً */   /* الحلّ المشترك: الأولى مضاءة، والثانية تُبنى عليها */
      if (tg) await S(want ? 'gen.pf.together.chainNext' : 'gen.pf.together.chainFirst'); else gmQ(want ? 'gen.pf.q.chainNext' : tries === 0 ? item.q || 'gen.pf.q.chainFirst' : 'gen.pf.q.chainFirst', isLive);
      const TT = C.filter(c => !item.picked.includes(c.n) && !(tg && !want && c.n === 2)).map(c => ({ g: c.g, k: String(c.n), label: plain(pfText(item.pf, v, c.n)) }));   /* وفي الأولى تُبعَد النتيجة */
      const k = await tapOne(TT, { ok: String(want), pad: 56 }); hush(); untarget(TT.map(t => t.g));
      if (+k !== want) { live = false; ctx.tap = +k; return { ans: 'order|' + k, ctx }; } item.picked.push(want); item.step++; SFX.tick(); if (item.step === 2) item.picked.push(2);
      svg.querySelectorAll('[data-step], [data-help]').forEach(e => e.remove()); C = drawCards(); ctx.C = C; }
    /* السبب: بطاقاته مكان المعطى والشكل (الخطوات تبقى مرقّمةً تحته) */
    top.setAttribute('visibility', 'hidden'); const ks = (TG(2) ? item.cands.filter((o, i) => i !== 2) : item.cands).slice(); const order = shuffle(ks);
    if (TG(2)) { const y = PF_CY(item.order.indexOf(item.rs)); hlRing(helpG(svg), [34, y + 35], 13, H2C[1]); await S('gen.pf.together.chainWhy'); } else gmQ('gen.pf.q.chainWhy', isLive);
    const k = await pfReasonChips(svg, order, item.cands[0], 14, isLive, { bad: item.cands[1] }); top.removeAttribute('visibility'); live = false; return { ans: 'why|' + k, ctx }; },
  judge(item, a) { const [w, v] = String(a).split('|'); if (w === 'order') return { ok: false, err: +v === 2 ? 'pfJump' : 'pfOrder' };
    return v === item.cands[0] ? { ok: true } : { ok: false, err: v === 'sss' && /^(bisPf|pbPf)$/.test(item.pf) ? 'pfCircular' : PF_ERR[v] || 'pfWrongRule' }; },
  onOk(item, r) { SFX.good(); const c = r && r.ctx; if (c && c.svg.isConnected) { c.svg.querySelectorAll('[data-step]').forEach(e => e.remove()); item.step = 3; item.order.forEach((n, i) => { const g = el('g', { 'data-step': n, 'pointer-events': 'none' }, c.svg), y = PF_CY(i); el('rect', { x: 20, y, width: 320, height: 70, rx: 10, fill: 'rgba(47,157,107,.10)', stroke: PF.ok, 'stroke-width': 2 }, g); pfStep(g, y + 30, item.pf, n, { x: 300, fs: 15, two: true, v: item.v || 0 }); badge(g, 34, y + 35, n + 1, PF.ok); }); } },
  onWrong() { SFX.soft(); },
  async hint2(item, r, err) { const c = r && r.ctx, s = item.step; if (c && c.svg && c.svg.isConnected) { const m = helpG(c.svg);
      if (s < 2) { if (c.fig) pfFigGlow(m, c.fig); pfSideCard(c.svg, c.fig, labelText(s ? 'pfAskNext' : 'pfRuleChain')); }   /* الشكل والمعلوم أولاً؛ وفي الثانية: ما يُبنى على الأولى */
      else { const dep = PF_DEP(item.pf)[item.rs]; dep.forEach(d => hlRing(m, [34, PF_CY(item.order.indexOf(d)) + 35], 13, H2C[0])); } }   /* والخطوة التي لا تعتمد على خطوة: الصوت وحده (الشكل مخفيٌّ تحت بطاقات الأسباب) */   /* ما تعتمد عليه الخطوة مُعلَّماً (أو الشكل) */
    await S(s < 2 ? (s ? 'gen.pf.hint.chainNext' : 'gen.pf.hint.chain') : 'gen.pf.hint.reason'); },
  async together() {},
  async reveal(item, r) { const c = r && r.ctx, s0 = item.step; if (c && c.svg.isConnected) { c.svg.querySelectorAll('[data-help], [data-step]').forEach(e => e.remove()); item.step = 3; item.order.forEach((n, i) => { const g = el('g', { 'data-step': n, 'pointer-events': 'none' }, c.svg), y = PF_CY(i); el('rect', { x: 20, y, width: 320, height: 70, rx: 10, fill: 'rgba(47,157,107,.10)', stroke: PF.ok, 'stroke-width': 2 }, g); pfStep(g, y + 30, item.pf, n, { x: 300, fs: 15, two: true, v: item.v || 0 }); badge(g, 34, y + 35, n + 1, PF.ok); }); }
    item.step = 3; if (s0 < 2) await S('gen.pf.reveal.chain'); else await S('gen.pf.rs.' + item.cands[0]); },   /* الكشف بالخطوة: الترتيب، أو السبب */
  praise: () => 'praiseThink', twin(item) { return item.twin || null; } };

/* ---------- د2 «أغلق البرهان» (prFixGame): pf، v، miss [خطواتٌ أسبابها ناقصة بترتيبها]، opts {خطوة: [الصحيح ثم مشتّتان]} ---------- */
ITEM.prFixGame = {
  make(spec) { /*T*/if (TESTHOOK && spec.miss.some(n => spec.cands[n][0] !== PF_PROOFS[spec.pf].rs[n])) testBug('prFixGame: السبب الأول ليس سبب الخطوة');/*/T*/ return { ...spec, step: 0, tag: 'pf-fix-' + spec.pf + (spec.miss.length > 2 ? '-all' : '') }; },
  async ask(item, mode, tries) { item.__try = tries; const sh = motionShort(), svg = m3Stage(166), g = el('g', { 'pointer-events': 'none' }, svg), v = item.v || 0, ctx = { svg, fig: g }, t0 = item.step, TG = k => tries >= 3 && t0 === k; let live = true; const isLive = () => live && svg.isConnected; svg.style.minHeight = innerHeight <= 600 ? '60px' : '90px';
    pfFitFig(g, item.pf, 18, 146, { v, sMax: .72, y0: 10, s: .72 });   /* الشاشة القصيرة: شكلٌ أصغر فتظهر البطاقات الثلاث (iPhone SE) */
    const rows = pfRows(item.pf, v, -1); ctx.rows = rows; const W = n => rows.steps[n].querySelector('.why');
    const paint = () => [0, 1, 2].forEach(n => { const mi = item.miss.indexOf(n), open = mi >= item.step, cur = mi === item.step; W(n).textContent = labelText('pfBecause') + ' ' + (open ? '؟' : labelText('pf.rs.' + PF_PROOFS[item.pf].rs[n])); rows.steps[n].classList.toggle('ask', cur); });
    paint();
    while (item.step < item.miss.length) { const n = item.miss[item.step], opts = item.cands[n], tg = TG(item.step) && item.step === t0;
      const qk = tg ? 'gen.pf.together.fix' : item.step === 0 && tries === 0 ? item.q || 'gen.pf.q.fix' : item.step === 0 ? 'gen.pf.q.fix' : 'gen.pf.q.fixNext';   /* والسؤال يعود إلى الفقاعة بعد قراءة البطاقات */
      if (tg) { const dep = PF_DEP(item.pf)[n]; (dep.length ? dep.map(d => rows.steps[d]) : [rows.given]).forEach(e => e && e.classList.add('dep')); await S(qk); } else gmQ(qk, isLive);
      const cp = cardPick(opts.filter((o, i) => !tg || i !== 2).map((o, i) => ({ id: 'gen.pf.rs.' + o, k: o, ok: i === 0 })), { intro: qk, cls: 'row3' }); const c = await cp.p; cp.done(); ctx.cp = cp; ctx.c = c;
      if (c.k !== opts[0]) { live = false; return { ans: 'why|' + c.k, ctx }; } item.step++; SFX.tick(); gmOff(); rows.steps.forEach(e => e.classList.remove('dep')); paint(); }
    live = false; return { ans: 'ok', ctx }; },
  judge(item, a) { const [w, v] = String(a).split('|'); if (w === 'ok') return { ok: true }; return { ok: false, err: PF_ERR[v] || 'pfWrongRule' }; },
  onOk() { SFX.good(); }, onWrong(item, r) { SFX.soft(); const c = r && r.ctx; if (c && c.cp) { const b = c.cp.btns.find(x => x.dataset.k === c.c.k); if (b) b.classList.add('no'); } },
  async hint2(item, r) { const c = r && r.ctx; if (c && c.svg && c.svg.isConnected) { const m = helpG(c.svg), n = item.miss[item.step], dep = PF_DEP(item.pf)[n], R = c.rows;
      if (c.fig) pfFigGlow(m, c.fig); if (R) { (dep.length ? dep.map(d => R.steps[d]) : [R.given]).forEach(e => e && e.classList.add('dep')); R.rule.hidden = false; } }   /* ما تعتمد عليه الخطوة مُعلَّماً، والشكل يتوهّج */
    await S('gen.pf.hint.reason'); },
  async together() {},
  async reveal(item, r) { const c = r && r.ctx; if (c && c.rows) { const n = item.miss[item.step]; if (n != null) { const w = c.rows.steps[n].querySelector('.why'); w.textContent = labelText('pfBecause') + ' ' + labelText('pf.rs.' + PF_PROOFS[item.pf].rs[n]); c.rows.steps[n].classList.add('dep'); } }
    const n = item.miss[item.step]; item.step = item.miss.length; await S('gen.pf.rs.' + PF_PROOFS[item.pf].rs[n ?? 0]); },
  praise: () => 'praiseThink', twin(item) { return item.twin || null; } };

/* ---------- د3 «القطع الذكية» (ineqGame): s أطوال الأعواد، fixed [عودان ثابتان، ويُختار الثالث] ---------- */
function ineqGeo(item) { const u = Math.min(26, 248 / Math.max(...item.s)), d = Math.min(38, 168 / Math.max(1, item.s.length - 1)); return { u, Y: i => 36 + i * d }; }   /* الأعواد على ارتفاع المسرح كلّه */
function ineqList(g, item, G, sel, dim = []) { g.innerHTML = ''; return item.s.map((L, i) => { const y = G.Y(i), on = sel.includes(i), t = el('g', { 'data-stick': i, ...(dim.includes(i) ? { opacity: .3 } : {}) }, g), w = L * G.u;
    el('rect', { x: 330 - w - 6, y: y - 11, width: w + 12, height: 22, rx: 8, fill: on ? 'rgba(242,201,76,.35)' : 'rgba(0,0,0,0)', stroke: on ? PF.hl : 'none', 'stroke-width': 2 }, t);
    geoLine(t, 330 - w, y, 330, y, { color: [PF.b, PF.a, PF.par, PF.c, '#8a6d3b'][i % 5], w: 8 }); pfLab(t, 330 - w - 18, y + 6, MS(String(L)), { fs: 17 }); return { g: t, k: String(i), i }; }); }
ITEM.ineqGame = {
  make(spec) { const fx = spec.fixed || [], idx = fx.map(v => spec.s.indexOf(v)); /*T*/if (TESTHOOK && idx.some(i => i < 0)) testBug('ineqGame: العود الثابت ليس بين الأعواد');/*/T*/
    const ok = [], n = spec.s.length; for (let a = 0; a < n; a++) for (let b = a + 1; b < n; b++) for (let c = b + 1; c < n; c++) { const T = [a, b, c]; if (idx.every(i => T.includes(i)) && ineqOk(T.map(i => spec.s[i]))) ok.push(T); }
    /*T*/if (TESTHOOK && !ok.length) testBug('ineqGame: لا ثلاثية تصنع مثلثاً');/*/T*/ return { ...spec, step: 0, fixIdx: idx, okSets: ok, tag: 'ineq-game' + (fx.length ? '-fix' : '') }; },
  async ask(item, mode, tries) { item.__try = tries; const svg = m3Stage(262), g = el('g', {}, svg), G = ineqGeo(item), ctx = { svg, G, g }, t0 = item.step, TG = k => tries >= 3 && t0 === k; let live = true; const isLive = () => live && svg.isConnected;
    if (item.step === 0) { const sel = item.fixIdx.slice(); let dim = [];
      if (TG(0) && !sel.length) { const T3 = item.okSets[0]; T3.slice(0, 2).forEach(i => sel.push(i)); }   /* الحلّ المشترك: عودان من ثلاثيةٍ تلتقي، والثالث للطفل */
      else if (TG(0)) { const ok3 = new Set(item.okSets.flat()), bad = item.s.map((_, i) => i).filter(i => !sel.includes(i) && !ok3.has(i)), keep = bad.find(i => { const [x, y, z] = [...sel.map(j => item.s[j]), item.s[i]].sort((p, q) => p - q); return x + y === z; }) ?? bad[0]; dim = bad.filter(i => i !== keep); }   /* وفي العودين المعلومين: تُبعَد الأعواد التي لا تُغلقه إلا واحداً */
      if (TG(0)) await S(dim.length ? 'gen.pf.together.sticksFix' : 'gen.pf.together.sticks'); else gmQ(tries === 0 ? item.q || (item.fixIdx.length ? 'gen.pf.q.sticksFix' : 'gen.pf.q.sticks') : item.fixIdx.length ? 'gen.pf.q.sticksFix' : 'gen.pf.q.sticks', isLive);
      while (sel.length < 3) { const L = ineqList(g, item, G, sel, dim), T = L.filter(t => !sel.includes(t.i) && !dim.includes(t.i)), okI = (item.okSets.find(S3 => sel.every(i => S3.includes(i))) || item.okSets[0]).find(i => !sel.includes(i)), badI = T.find(t => !item.okSets.some(S3 => S3.includes(t.i) && sel.every(i => S3.includes(i))));
        /*T*/window.__stickOk = okI;/*/T*/ const k = await tapOne(T.map(t => ({ g: t.g, k: t.k, label: MS(String(item.s[t.i])) })), { ok: String(okI), bad: badI ? badI.k : undefined, pad: 56 }); hush(); sel.push(+k); SFX.tick(); }
      ineqList(g, item, G, sel); ctx.sel = sel; const tri = sel.map(i => item.s[i]);
      g.innerHTML = ''; const res = ineqSticks(g, tri, { meet: true, arcs: true, y: 210, top: 40, u: 60 }); ctx.tri = tri;   /* العودان على طرفي أطولها: يلتقيان أم تبقى فجوة */
      if (!res.ok) { live = false; return { ans: 'sel|' + tri.join(','), ctx }; } item.tri = tri; item.step = 1; SFX.tick(); await sleep(FAST ? 10 : 500); }
    const tri = item.tri || ctx.tri, [a, b, c] = [...tri].sort((x, y) => x - y); if (!ctx.tri) { g.innerHTML = ''; ineqSticks(g, tri, { meet: true, y: 210, top: 40, u: 60 }); }
    ciEq(svg, 180, 34, `${a} + ${b} ؟ ${c}`, PF.q, 18);
    if (TG(1)) { ciEq(helpG(svg), 180, 62, `${a} + ${b} = ${a + b}`, PF.hl, 16); await S('gen.pf.together.cmp'); } else gmQ('gen.pf.q.cmp', isLive);
    const k = await choosePick([['gt'], ['eq'], ['lt']].map(([w]) => [w, labelText('pfCmp.' + w), '<i></i>', 'gen.pf.cmp.' + w]), 'gt'); gmOff(); live = false; return { ans: 'cmp|' + k, ctx }; },
  judge(item, a) { const [w, v] = String(a).split('|'); if (w === 'sel') { const [x, y, z] = v.split(',').map(Number).sort((p, q) => p - q); return { ok: false, err: x + y === z ? 'ineqEqual' : 'ineqGap' }; }
    return v === 'gt' ? { ok: true } : { ok: false, err: v === 'eq' ? 'ineqEqual' : 'ineqCmp' }; },
  onOk(item, r) { SFX.good(); }, onWrong() { SFX.soft(); },
  async hint2(item, r, err) { const c = r && r.ctx, s = item.step; if (c && c.svg && c.svg.isConnected) { const m = helpG(c.svg);
      if (s === 0 && c.tri) { const [a, b, x] = [...c.tri].sort((p, q) => p - q), u = Math.min(40, 280 / x), y = 244, L = 180 - x * u / 2, R = 180 + x * u / 2;   /* القصيران مبسوطان على الطويل من طرفيه: فجوةٌ أو تداخل */
        geoLine(m, L, y, R, y, { color: PF.par, w: 4 }).setAttribute('opacity', .45); geoLine(m, L, y - 6, L + a * u, y - 6, { color: PF.b, w: 4 }); geoLine(m, R, y + 6, R - b * u, y + 6, { color: PF.a, w: 4 }); }   /* الطويل باهتاً والقصيران عليه من طرفيه: هل يغطّيانه؟ (والسؤال بالصوت) */
      else ciRule(m, 180, [62], labelText('pfAskSum2'), PF.hl, 15); }
    await S(s === 0 ? 'gen.pf.hint.sticks' : 'gen.pf.hint.cmp'); },
  async together() {},
  async reveal(item, r) { const c = r && r.ctx, s0 = item.step; if (c && c.svg.isConnected) { c.svg.querySelectorAll('[data-help]').forEach(e => e.remove()); if (s0 === 0) { const T = item.okSets[0].map(i => item.s[i]); c.g.innerHTML = ''; ineqSticks(c.g, T, { meet: true, y: 210, top: 40 }); item.tri = T; } }
    item.step = 2; await S(s0 === 0 ? 'gen.pf.reveal.sticks' : 'gen.pf.reveal.cmp'); },
  praise: () => 'praiseThink', twin(item) { return item.twin || null; } };

/* ---------- د4 «بنّاء المضلعات» (polyGame): n أضلاع الإطار، irr مضلعٌ غير منتظم، sum: المجموع المعطى (والإطار لا يُرسم، والمطلوب عدد الأضلاع) ---------- */
function polyGmPts(item, n) { const cx = 180, cy = 132, r = 84; if (!item.irr) return polyPts(n, cx, cy, r); const J = [1, .86, .97, .8, 1, .9, .84, .98, .88, .95];   /* غير منتظم: أنصاف أقطارٍ مختلفة، محدّبٌ دائماً */
  return Array.from({ length: n }, (_, i) => angP([cx, cy], 90 + 360 * (i + (i % 2 ? .12 : 0)) / n, r * J[i % J.length])); }
function polyGmDraw(h, item, t, o = {}) { h.innerHTML = ''; const n = t + 2, P = polyGmPts(item, n);
  if (!item.sum) el('polygon', { points: polyStr(polyGmPts(item, item.n)), fill: 'none', stroke: '#8a96a0', 'stroke-width': 3, 'stroke-dasharray': '7 6', 'pointer-events': 'none' }, h);   /* الإطار المطلوب منقّطاً */
  polyFig(h, n, { pts: P, diag: true }); if (o.count) P.slice(1, -1).slice(0, o.all ? n : n - 3).forEach((Q, i) => { const T = [P[0], P[i + 1], P[i + 2]], C = [(T[0][0] + T[1][0] + T[2][0]) / 3, (T[0][1] + T[1][1] + T[2][1]) / 3]; pfLab(o.cg || h, C[0], C[1] + 6, MS(String(i + 1)), { fs: 14, col: PF.c }); });   /* cg: العدّ في طبقة المساعدة (الحلّ المشترك) */
  if (item.sum) pfLab(h, 330, 30, labelText('pfTris') + ' ' + MS(String(t)), { fs: 15, anchor: 'start' }); else pfLab(h, 330, 30, labelText('pfSides') + ' ' + MS(String(n)), { fs: 15, anchor: 'start' }); return P; }   /* المطلوب لا يُكتب: في البناء عدد الأضلاع، وفي المجموع عدد المثلثات */
ITEM.polyGame = {
  make(spec) { const S2 = spec.sum, n = S2 ? S2 / 180 + 2 : spec.n; /*T*/if (TESTHOOK && (n % 1 || n < 4 || n > 10)) testBug('polyGame: الأضلاع بين 4 و10');/*/T*/
    return { ...spec, step: 0, nn: n, nums: S2 ? rkPick(n, [[n - 2, 'polyTriN'], [n - 1, 'polyTriN1'], [n + 1, 'polySidesOff']], 0) : rkPick(n - 2, [[n, 'polyTriN'], [n - 1, 'polyTriN1'], [n - 3, 'polyTriOff']], 0),
      nums2: S2 ? null : rkPick((n - 2) * 180, [[n * 180, 'polyNx180'], [(n - 1) * 180, 'polyTriN1'], [(n - 3) * 180, 'polyTriOff']], 0), tag: 'poly-game' + (S2 ? '-sum' : '') }; },
  async ask(item, mode, tries) { item.__try = tries; const svg = m3Stage(262), h = el('g', { 'pointer-events': 'none' }, svg), ctx = { svg, h }, t0 = item.step, TG = k => tries >= 3 && t0 === k, n = item.nn; let live = true; const isLive = () => live && svg.isConnected;
    if (item.sum) { el('rect', { x: 110, y: 220, width: 140, height: 25, rx: 10, fill: '#fff', stroke: PF.c, 'stroke-width': 2, 'pointer-events': 'none' }, svg); preLab(svg, 214, 238, labelText('pfSumIs'), { dir: 'rtl', fs: 15, col: PF.c }); degText(svg, 150, 238, item.sum, { size: 16, color: PF.c });   /* داخل الإطار (أسفله 248) */ }   /* المجموع المعطى */
    if (item.step === 0) { const want = n - 2, k0 = TG(0) ? want - 1 : 1;
      if (TG(0)) await S(item.sum ? 'gen.pf.together.polySumB' : 'gen.pf.together.polyBuild'); else gmQ(tries === 0 ? item.q || (item.sum ? 'gen.pf.q.polySumBuild' : 'gen.pf.q.polyBuild') : item.sum ? 'gen.pf.q.polySumBuild' : 'gen.pf.q.polyBuild', isLive);
      const k = await gmStep(item, k0, 1, 8, want, ['pfFewerTri', 'pfMoreTri'], v => { ctx.k = v; polyGmDraw(h, item, v); }, { icons: [gmIco(false), gmIco(true)] });
      if (k !== want) { live = false; return { ans: 'build|' + k, ctx }; } item.step = 1; SFX.tick(); }
    polyGmDraw(h, item, n - 2, { count: item.step === 1 && TG(1), cg: item.step === 1 && TG(1) ? helpG(svg) : null });
    if (item.step === 1) { if (TG(1)) await S(item.sum ? 'gen.pf.together.polySides' : 'gen.pf.together.polyCount'); else gmQ(item.sum ? 'gen.pf.q.polySides' : 'gen.pf.q.polyCount', isLive);
      const np = numberPick(shuffle(item.nums.map(([v]) => v)), item.sum ? n : n - 2, { west: true }), k = await np.p; gmOff();
      if (+k !== (item.sum ? n : n - 2)) { live = false; return { ans: 'count|' + k, ctx }; } if (item.sum) { live = false; return { ans: 'ok', ctx }; } item.step = 2; SFX.tick(); }
    if (TG(2)) { ciEq(helpG(svg), 180, 246, `${n - 2} × 180 = ؟`, PF.hl, 17); await S('gen.pf.together.polyTimes'); } else gmQ('gen.pf.q.polyTimes', isLive);
    const np = numberPick(shuffle(item.nums2.map(([v]) => v)), (n - 2) * 180, { west: true, word: degw }), k = await np.p; gmOff(); live = false; return { ans: 'sum|' + k, ctx }; },
  judge(item, a) { const [w, v] = String(a).split('|'), n = item.nn; if (w === 'ok') return { ok: true };
    if (w === 'build') return { ok: false, err: +v === n ? 'polyTriN' : 'polyBuildOff' };
    if (w === 'count') return { ok: false, err: (item.nums.find(([x]) => x === +v) || [])[1] || 'polyTriN' };
    return +v === (n - 2) * 180 ? { ok: true } : { ok: false, err: (item.nums2.find(([x]) => x === +v) || [])[1] || 'polyNx180' }; },
  onOk(item, r) { SFX.good(); }, onWrong() { SFX.soft(); },
  async hint2(item, r, err) { const c = r && r.ctx, s = item.step; if (c && c.svg && c.svg.isConnected) { const m = helpG(c.svg), n = item.nn;
      if (s === 0 && item.sum) { const k = c.k ?? 1; ciEq(m, 104, 30, `${k} × 180 = ${k * 180}`, PF.hl, 17); }   /* بلا إطار: مجموع ما بُني الآن، لا شبح المضلع المطلوب */
      else if (s === 0) { const k = c.k ?? 1, t = n - 2, k2 = k + Math.sign(t - k || 1), P = polyGmPts(item, k2 + 2); el('polygon', { points: polyStr(P), fill: 'none', stroke: THINK_INK, 'stroke-width': 2.6, 'stroke-dasharray': '6 5', 'pointer-events': 'none' }, m); ciRule(m, 180, [228], labelText('pfAskFrame'), PF.hl, 14); }   /* مضلعٌ شبحٌ بمثلثٍ واحد نحو المطلوب */
      else if (s === 1) { const P = polyGmPts(item, n); el('polygon', { points: polyStr([P[0], P[1], P[2]]), fill: 'rgba(242,201,76,.22)', stroke: PF.hl, 'stroke-width': 3, 'stroke-dasharray': '6 4', 'pointer-events': 'none' }, m); [P[0], P[1]].forEach(Q => hlRing(m, Q, 10, H2C[0])); ciRule(m, 180, [item.sum ? 52 : 228], labelText(item.sum ? 'pfAskSides' : 'pfAskFan'), PF.hl, 14); }   /* المثلث الأول: الضلعان عند الرأس لا يصنعان مثلثاً وحدهما */
      else { const P = polyGmPts(item, n), T = [P[0], P[1], P[2]], C = [(T[0][0] + T[1][0] + T[2][0]) / 3, (T[0][1] + T[1][1] + T[2][1]) / 3]; el('polygon', { points: polyStr(T), fill: 'rgba(242,201,76,.22)', stroke: PF.hl, 'stroke-width': 3, 'stroke-dasharray': '6 4', 'pointer-events': 'none' }, m); degText(m, C[0], C[1] + 6, 180, { size: 15, color: PF.ink }); ciRule(m, 180, [228], labelText('pfRuleSum'), PF.hl, 14); } }
    await S(s === 0 ? (item.sum ? 'gen.pf.hint.polySumB' : 'gen.pf.hint.polyBuild') : s === 1 ? (item.sum ? 'gen.pf.hint.polySides' : 'gen.pf.hint.polyCount') : 'gen.pf.hint.polyTimes'); },
  async together() {},
  async reveal(item, r) { const c = r && r.ctx, s0 = item.step, n = item.nn; if (c && c.svg.isConnected) { c.svg.querySelectorAll('[data-help]').forEach(e => e.remove()); polyGmDraw(c.h, item, n - 2, { count: true, all: true }); }
    item.step = 3; if (s0 === 2) { await S('gen.pf.reveal.polyTimes', { noGap: true }); await sayDeg((n - 2) * 180); } else if (s0 === 1 && item.sum) { await S('gen.pf.reveal.polySides', { noGap: true }); await S(numw(n), { append: true }); } else { await S('gen.pf.reveal.polyCount', { noGap: true }); await S(numw(n - 2), { append: true }); } },
  praise: () => 'praiseThink', twin(item) { return item.twin || null; } };
