/* =====================================================================
   M4-U1 «علاقات الزوايا والقاطع»: الألعاب الحركية (D288 (2)، خطة ألعاب المرحلة 4)
   د1 «أكمل الزاوية» (arCompGame): يدوّر الشعاع حتى تكتمل القائمة أو المستقيمة بورقة الزاوية أو المسطرة، ثم الزاوية الجديدة، ثم اسم الزوج
   د2 «مرآة الرأس» (arVertGame): يدوّر العود حتى تصير الخضراء المطلوبة، ثم يلمس مقابلتها بالرأس، ثم قياسها (والمجاورة)
   د3 «سكّة القطار» (arTrGame): يدوّر القاطع حتى تصير الخضراء المطلوبة، ثم يلمس المتناظرة عند السكّة الأخرى، ثم قياسها أو الحكم إن لم تتوازَ السكّتان
   الدوران بخطوات 5° (gmStep بوحدة 5)، والأدوات المشتركة gmQ وgmStep وgmSpots
   ===================================================================== */
const arRayTo = (g, V, d, L, col, w = 4, dash) => { const E = angP(V, d, frameReach(g, V, d, L)); geoLine(g, V[0], V[1], E[0], E[1], { color: col, w, dash }); return E; };
const arTurnIcons = () => [c9TurnIcon(-1), c9TurnIcon(1)];
const arVdot = (g, V) => el('circle', { cx: V[0], cy: V[1], r: 5, fill: ANG.v, stroke: '#fff', 'stroke-width': 2, 'pointer-events': 'none' }, g);

/* ---------- د1 «أكمل الزاوية» (arCompGame): k comp | supp، a الخضراء، rot دوران الشكل، then: مكمّلة الخضراء بعدها (تركيب) ---------- */
function arCgGeo(item) { const rot = item.rot || 0, V = rot ? [180, 160] : [180, 196], L = rot ? 112 : 128, tot = item.k === 'comp' ? 90 : 180; return { V, L, rot, tot, R: d => d + rot }; }
function arCgBase(g, item, G) { const { V, L, R } = G;
  arRayTo(g, V, R(0), L, AR.line); arRayTo(g, V, R(item.a), L, AR.line);
  if (item.k === 'comp') { const s = 26, A = angP(V, R(0), s), B = angP(V, R(90), s), C = angP(A, R(90), s); el('polygon', { points: polyStr([V, A, C, B]), fill: 'rgba(255,236,170,.8)', stroke: '#b9813f', 'stroke-width': 2, 'pointer-events': 'none' }, g); }   /* ورقة الزاوية القائمة على الضلع */
  else arRayTo(g, V, R(180), L, '#8a96a0', 3, '7 5');   /* المسطرة: المستقيم يمتدّ من الرأس */
  arArc(g, V, R(0), R(item.a), { r: 46, col: AR.a, deg: item.a, dl: 18, fill: true }); }
function arCgSpan(m, G, r) { const { V, R, tot } = G; el('path', { d: angArc(V, r, R(0), R(tot)), fill: 'none', stroke: AR.hl, 'stroke-width': 3, 'stroke-dasharray': '6 5', 'pointer-events': 'none' }, m);   /* الكلّ منقّطاً (القائمة بمربّعها، أو نصف الدائرة) */
  if (tot === 90) { const A = angP(V, R(0), 16), B = angP(V, R(90), 16), C = angP(A, R(90), 16); el('path', { d: `M${A[0]} ${A[1]} L${C[0]} ${C[1]} L${B[0]} ${B[1]}`, fill: 'none', stroke: AR.hl, 'stroke-width': 2.6, 'pointer-events': 'none' }, m); } }
function arCgDraw(h, item, G, v, o = {}) { h.innerHTML = ''; const { V, L, R } = G; arRayTo(h, V, R(v), L, o.col || AR.tr, 5); if (v > item.a) arArc(h, V, R(item.a), R(v), { r: 32, col: o.col || AR.tr, fill: true, ...(o.deg != null ? { deg: o.deg, dl: 22 } : o.q ? { lab: '؟', dl: 22 } : {}) }); arVdot(h, V); }
ITEM.arCompGame = {
  make(spec) { const tot = spec.k === 'comp' ? 90 : 180, oth = spec.k === 'comp' ? 180 : 90, want = tot - spec.a;
    const nums = rkPick(want, [[oth - spec.a, 'arMix'], [spec.a, 'arCopy'], [tot + spec.a, 'arAdd']], spec.rk ?? 0), s3 = 180 - spec.a;
    return { ...spec, step: 0, tot, want, nums, nums3: spec.then ? rkPick(s3, [[90 - spec.a, 'arMix'], [180 - want, 'arChain'], [spec.a, 'arCopy']], 0) : null, want3: s3,
      ch: [['comp'], ['supp'], ['vert']], chLab: ['comp', 'supp', 'vert'].map(k => labelText('arName.' + k)), tag: 'ar-cg-' + spec.k }; },
  async ask(item, mode, tries) { item.__try = tries; const svg = m3Stage(262), G = arCgGeo(item), g0 = el('g', { 'pointer-events': 'none' }, svg), h = el('g', { 'pointer-events': 'none' }, svg), ctx = { svg, G, h }, t0 = item.step, TG = k => tries >= 3 && t0 === k; let live = true; const isLive = () => live && svg.isConnected;
    arCgBase(g0, item, G);
    if (item.step === 0) { const want = G.tot / 5, lo = item.a / 5 + 1, k0 = TG(0) ? want - 1 : item.a / 5 + 2;
      if (TG(0)) await S('gen.ar.together.cgTurn'); else gmQ(tries === 0 ? item.q || 'gen.ar.q.cgTurn.' + item.k : 'gen.ar.q.cgTurn.' + item.k, isLive);
      const k = await gmStep(item, k0, lo, 36, want, ['arLess', 'arMore'], n => { ctx.k = n; arCgDraw(h, item, G, n * 5); }, { icons: arTurnIcons() });
      if (k !== want) { live = false; return { ans: 'turn|' + k * 5, ctx }; } item.step = 1; SFX.tick(); }
    arCgDraw(h, item, G, G.tot, { q: item.step === 1, deg: item.step > 1 ? item.want : null });
    if (item.step === 1) { if (TG(1)) { ciEq(helpG(svg), 180, 34, `${G.tot} − ${item.a} = ؟`, AR.hl, 17); await S('gen.ar.together.cgVal'); } else gmQ('gen.ar.q.cgVal', isLive);
      const np = numberPick(shuffle(item.nums.map(([v]) => v)), item.want, { west: true, word: degw }), k = await np.p; gmOff();
      if (+k !== item.want) { live = false; return { ans: 'val|' + k, ctx }; } item.step = 2; SFX.tick(); arCgDraw(h, item, G, G.tot, { deg: item.want }); }
    if (item.step === 2) { if (TG(2)) { arCgSpan(helpG(svg), G, 64); await S('gen.ar.together.cgName'); } else gmQ('gen.ar.q.cgName', isLive);
      const k = await choosePick(item.ch.filter(([w]) => !TG(2) || w !== 'vert').map(([w]) => [w, labelText('arName.' + w), '<i></i>', 'gen.ar.name.' + w]), item.k); gmOff();
      if (k !== item.k) { live = false; return { ans: 'name|' + k, ctx }; } if (!item.then) { live = false; return { ans: 'ok', ctx }; } item.step = 3; SFX.tick(); }
    /* التركيب: والمكمّلة للخضراء نفسها، والمستقيم مسطرةٌ من الرأس */
    arRayTo(g0, G.V, G.R(180), G.L, '#8a96a0', 3, '7 5'); arArc(h, G.V, G.R(item.a), G.R(180), { r: 62, col: AR.par, lab: '؟', dl: 18 });
    if (TG(3)) { ciEq(helpG(svg), 180, 34, `180 − ${item.a} = ؟`, AR.hl, 17); await S('gen.ar.together.cgSupp'); } else gmQ('gen.ar.q.cgSupp', isLive);
    const np = numberPick(shuffle(item.nums3.map(([v]) => v)), item.want3, { west: true, word: degw }), k = await np.p; gmOff(); live = false; return { ans: 'supp|' + k, ctx }; },
  judge(item, a) { const [w, v] = String(a).split('|'); if (w === 'ok') return { ok: true };
    if (w === 'turn') return { ok: false, err: +v === (item.k === 'comp' ? 180 : 90) ? 'arMix' : 'arTurnOff' };
    if (w === 'val') return { ok: false, err: (item.nums.find(([x]) => x === +v) || [])[1] || 'arTurnOff' };
    if (w === 'name') return { ok: false, err: v === 'vert' ? 'arNameVert' : 'arMix' };
    return +v === item.want3 ? { ok: true } : { ok: false, err: (item.nums3.find(([x]) => x === +v) || [])[1] || 'arMix' }; },
  onOk(item, r) { SFX.good(); }, onWrong() { SFX.soft(); },
  async hint2(item, r, err) { const c = r && r.ctx, s = item.step; if (c && c.svg && c.svg.isConnected) { const m = helpG(c.svg), G = c.G;
      if (s === 0) { const k = c.k ?? item.a / 5 + 2, t = G.tot / 5, k2 = k + Math.sign(t - k || 1); arRayTo(m, G.V, G.R(k2 * 5), G.L, THINK_INK, 3, '6 5'); arCgSpan(m, G, 70); ciRule(m, 180, [34], labelText(item.k === 'comp' ? 'arAskRight' : 'arAskStraight'), AR.hl, 15); }   /* شعاعٌ شبحٌ بضغطةٍ نحو الكلّ، والكلّ منقّطاً */
      else if (s === 1) { arCgSpan(m, G, 70); arArc(m, G.V, G.R(0), G.R(item.a), { r: 46, col: H2C[1], w: 6 }); ciRule(m, 180, [34], labelText('arAskRest'), AR.hl, 15); }   /* الكلّ والخضراء: الباقي بينهما */
      else if (s === 2) { arCgSpan(m, G, 70); ciRule(m, 180, [34], labelText('arAskWholeName'), AR.hl, 15); }
      else { arRayTo(m, G.V, G.R(180), G.L, H2C[0], 4); arArc(m, G.V, G.R(0), G.R(item.a), { r: 46, col: H2C[1], w: 6 }); ciRule(m, 180, [34], labelText('arAskSuppG'), AR.hl, 15); } }
    await S(s === 0 ? 'gen.ar.hint.cgTurn.' + item.k : s === 1 ? 'gen.ar.hint.cgVal' : s === 2 ? 'gen.ar.hint.cgName' : 'gen.ar.hint.cgSupp'); },
  async together() {},
  async reveal(item, r) { const c = r && r.ctx, s0 = item.step; if (c && c.svg.isConnected) { c.svg.querySelectorAll('[data-help]').forEach(e => e.remove()); [...c.svg.querySelectorAll('text')].filter(t => t.textContent.trim() === '؟').forEach(t => t.remove());
      if (s0 < 3) arCgDraw(c.h, item, c.G, c.G.tot, { col: AR.ok, deg: item.want }); else arArc(c.h, c.G.V, c.G.R(item.a), c.G.R(180), { r: 62, col: AR.ok, deg: item.want3, dl: 18 }); }   /* الكشف بالخطوة التي أُخفقت */
    item.step = 4; if (s0 === 2) await S('gen.ar.reveal.cgName.' + item.k); else { await S(s0 === 3 ? 'gen.ar.reveal.cgSupp' : 'gen.ar.reveal.cgVal.' + item.k, { noGap: true }); await sayDeg(s0 === 3 ? item.want3 : item.want); } },
  praise: () => 'praiseThink', twin(item) { return item.twin || null; },
};

/* ---------- د2 «مرآة الرأس» (arVertGame): want قياس الخضراء، start موضع العود أولاً، rot دوران الشكل، all: والمجاورة أيضاً (تركيب) ---------- */
function arVgGeo(item) { const rot = item.rot || 0, V = [180, 130]; return { V, rot, R: d => d + rot, L: 118 }; }
function arVgDraw(h, item, G, v, o = {}) { h.innerHTML = ''; const { V, R, L } = G, X = AR_X(v).map(([a, b]) => [R(a), R(b)]);
  for (const d of [0, v]) { arRayTo(h, V, R(d), L, d ? AR.tr : AR.line, d ? 5 : 4); arRayTo(h, V, R(d + 180), L, d ? AR.tr : AR.line, d ? 5 : 4); }
  arArc(h, V, X[0][0], X[0][1], { r: 30, col: AR.a, deg: v, dl: 18, fill: true });
  if (o.marks) { (o.vals || []).forEach(([i, deg, col]) => arArc(h, V, X[i][0], X[i][1], { r: 30, col: col || AR.q, ...(deg == null ? { lab: '؟' } : { deg }), dl: 18, fill: true })); }
  arVdot(h, V); return X; }
ITEM.arVertGame = {
  make(spec) { const w = spec.want, P = [[180 - w, 'arVertSupp'], 90 - w > 0 ? [90 - w, 'arVertOff'] : [360 - w, 'arVertFull'], [w + 20 < 180 ? w + 20 : w - 20, 'arVertOff']];
    return { ...spec, step: 0, nums: rkPick(w, P, spec.rk ?? 0), nums3: spec.all ? rkPick(180 - w, [[w, 'arVertAdj'], [360 - w, 'arVertFull'], [90 + w < 180 ? 90 + w : 90, 'arVertOff']], 0) : null, tag: 'ar-vg' + (spec.all ? '-all' : '') }; },
  async ask(item, mode, tries) { item.__try = tries; const svg = m3Stage(262), G = arVgGeo(item), h = el('g', { 'pointer-events': 'none' }, svg), ctx = { svg, G, h }, t0 = item.step, TG = k => tries >= 3 && t0 === k; let live = true; const isLive = () => live && svg.isConnected;
    if (item.step === 0) { const want = item.want / 5, k0 = TG(0) ? want + (item.start > item.want ? 1 : -1) : item.start / 5;
      if (TG(0)) await S('gen.ar.together.vgTurn'); else { gmQ(tries === 0 ? item.q || 'gen.ar.q.vgTurn' : 'gen.ar.q.vgTurn', isLive); }
      const k = await gmStep(item, k0, 4, 32, want, ['arLess', 'arMore'], n => { ctx.k = n; arVgDraw(h, item, G, n * 5); }, { icons: arTurnIcons() });
      if (k !== want) { live = false; return { ans: 'turn|' + k * 5, ctx }; } item.step = 1; SFX.tick(); }
    const X = arVgDraw(h, item, G, item.want, { marks: item.step >= 2, vals: item.step >= 2 ? [[2, item.step > 2 ? item.want : null], ...(item.step === 3 ? [[1, null, AR.par]] : [])] : [] }); ctx.X = X;
    if (item.step === 1) { const sp = [[1, 'S2'], [2, 'S3'], [3, 'S4']].filter(([i, k]) => !TG(1) || k !== (item.tried1 || 'S4')).map(([i, k]) => [k, angP(G.V, (X[i][0] + X[i][1]) / 2, 44)]);   /* الحلّ المشترك: تسقط مجاورةٌ جُرِّبت */
      if (TG(1)) { hlSeg(helpG(svg), angP(G.V, G.R(0), 60), angP(G.V, G.R(180), 60), H2C[0]); await S('gen.ar.together.vgOpp'); } else gmQ('gen.ar.q.vgOpp', isLive);
      const k = await gmSpots(svg, sp, 'S3', { label: 'arSpotAng', bad: 'S2' }); hush(); if (k !== 'S3') { item.tried1 = k; live = false; return { ans: 'opp|' + k, ctx }; } item.step = 2; SFX.tick(); arVgDraw(h, item, G, item.want, { marks: true, vals: [[2, null]] }); }
    if (item.step === 2) { if (TG(2)) { arArc(helpG(svg), G.V, X[1][0], X[1][1], { r: 30, col: THINK_INK, deg: 180 - item.want, dl: 18 }); ciEq(helpG(svg), 180, 238, `180 − ${180 - item.want} = ؟`, AR.hl, 17); await S('gen.ar.together.vgVal'); } else gmQ('gen.ar.q.vgVal', isLive);
      const np = numberPick(shuffle(item.nums.map(([v]) => v)), item.want, { west: true, word: degw }), k = await np.p; gmOff();
      if (+k !== item.want) { live = false; return { ans: 'val|' + k, ctx }; } if (!item.all) { live = false; return { ans: 'ok', ctx }; } item.step = 3; SFX.tick(); arVgDraw(h, item, G, item.want, { marks: true, vals: [[2, item.want], [1, null, AR.par]] }); }
    if (TG(3)) { ciEq(helpG(svg), 180, 238, `180 − ${item.want} = ؟`, AR.hl, 17); await S('gen.ar.together.vgAdj'); } else gmQ('gen.ar.q.vgAdj', isLive);
    const np = numberPick(shuffle(item.nums3.map(([v]) => v)), 180 - item.want, { west: true, word: degw }), k = await np.p; gmOff(); live = false; return { ans: 'adj|' + k, ctx }; },
  judge(item, a) { const [w, v] = String(a).split('|'); if (w === 'ok') return { ok: true };
    if (w === 'turn') return { ok: false, err: 'arTurnOff' }; if (w === 'opp') return { ok: false, err: 'arVertAdj' };
    if (w === 'val') return { ok: false, err: (item.nums.find(([x]) => x === +v) || [])[1] || 'arVertOff' };
    return +v === 180 - item.want ? { ok: true } : { ok: false, err: (item.nums3.find(([x]) => x === +v) || [])[1] || 'arVertOff' }; },
  onOk() { SFX.good(); }, onWrong() { SFX.soft(); },
  async hint2(item, r, err) { const c = r && r.ctx, s = item.step; if (c && c.svg && c.svg.isConnected) { const m = helpG(c.svg), G = c.G, X = c.X || AR_X(item.want);
      if (s === 0) { const k = c.k ?? item.start / 5, t = item.want / 5, k2 = k + Math.sign(t - k || 1); arRayTo(m, G.V, G.R(k2 * 5), G.L, THINK_INK, 3, '6 5'); arRayTo(m, G.V, G.R(k2 * 5 + 180), G.L, THINK_INK, 3, '6 5'); ciRule(m, 180, [238], labelText('arAskGreen'), AR.hl, 15); }   /* عودٌ شبحٌ بضغطةٍ نحو المطلوب */
      else if (s === 1) { [[0, H2C[0]], [item.want, H2C[1]]].forEach(([d, col]) => hlSeg(m, angP(G.V, G.R(d), 30), angP(G.V, G.R(d), 70), col, { w: 6 })); ciRule(m, 180, [238], labelText('arAskOpp'), AR.hl, 15); }   /* ضلعا الخضراء: المقابلة لا تشاركها أحدهما */
      else { hlSeg(m, angP(G.V, G.R(0), 70), angP(G.V, G.R(180), 70), H2C[0], { w: 6 }); arArc(m, G.V, X[1][0], X[1][1], { r: 40, col: H2C[1], w: 5 }); ciRule(m, 180, [238], labelText('arRuleAdj'), AR.hl, 15); } }   /* المجاورة على المستقيم: كلتاهما تكمّلانها إلى 180 */
    await S(s === 0 ? 'gen.ar.hint.vgTurn' : s === 1 ? 'gen.ar.hint.vgOpp' : s === 2 ? 'gen.ar.hint.vgVal' : 'gen.ar.hint.vgAdj'); },
  async together() {},
  async reveal(item, r) { const c = r && r.ctx, s0 = item.step; if (c && c.svg.isConnected) { c.svg.querySelectorAll('[data-help]').forEach(e => e.remove()); arVgDraw(c.h, item, c.G, item.want, { marks: true, vals: [[2, item.want, AR.ok], ...(s0 === 3 ? [[1, 180 - item.want, AR.ok]] : [])] }); }
    item.step = 4; await S(s0 === 3 ? 'gen.ar.reveal.vgAdj' : 'gen.ar.reveal.vgOpp', { noGap: true }); await sayDeg(s0 === 3 ? 180 - item.want : item.want); },
  praise: () => 'praiseThink', twin(item) { return item.twin || null; },
};

/* ---------- د3 «سكّة القطار» (arTrGame): want قياس الخضراء (الزاوية 2)، start موضع القاطع أولاً، tilt ميل السكّة السفلى (غير متوازيتين)، rot دوران الشكل ---------- */
function arTgDraw(h, item, v, o = {}) { h.innerHTML = ''; const rot = item.rot || 0;
  if (o.rail !== false) for (const [y0, tl] of [[100, 0], [184, item.tilt || 0]]) { const t = Math.tan(tl * Math.PI / 180), u = angU(rot + tl + 90).map(c => c * 6);   /* عوارض السكّة عموديةٌ عليها، تتبع ميلها ودوران الشكل */
    for (let x = 36; x <= 324; x += 18) { const P = arRotPt([x, y0 - (x - 180) * t], rot, [180, 142]); geoLine(h, P[0] - u[0], P[1] - u[1], P[0] + u[0], P[1] + u[1], { color: '#c9b49a', w: 2.4 }); } }
  const R = arTrans(h, v, { y1: 100, y2: 184, tilt: item.tilt || 0, rot: item.rot || 0, marks: !item.tilt }), A = R.at(2); arArc(h, A.V, A.a1, A.a2, { r: 22, col: AR.a, deg: v, dl: 16, fs: 14, fill: true });
  if (o.low) { const B = R.at(6), deg = item.tilt ? arTrVal(v - item.tilt, 6) : v; arArc(h, B.V, B.a1, B.a2, { r: 22, col: o.lowCol || AR.q, ...(o.lowDeg ? { deg } : { lab: '؟' }), dl: 16, fs: 15, fill: true }); }
  return R; }
ITEM.arTrGame = {
  make(spec) { const w = spec.want; return { ...spec, step: 0, nums: spec.tilt ? null : rkPick(w, [[180 - w, 'arTrMix'], [w + 10 < 180 ? w + 10 : w - 10, 'arTrOff'], [90 - w > 0 ? 90 - w : w - 20, 'arTrOff']], spec.rk ?? 0),
    ch: [['eq'], ['neq']], chLab: ['eq', 'neq'].map(k => labelText('arTrJ.' + k)), tag: 'ar-tg' + (spec.tilt ? '-tilt' : '') }; },
  async ask(item, mode, tries) { item.__try = tries; const svg = m3Stage(262), h = el('g', { 'pointer-events': 'none' }, svg), ctx = { svg, h }, t0 = item.step, TG = k => tries >= 3 && t0 === k; let live = true; const isLive = () => live && svg.isConnected;
    if (item.step === 0) { const want = item.want / 5, k0 = TG(0) ? want + (item.start > item.want ? 1 : -1) : item.start / 5;
      if (TG(0)) await S('gen.ar.together.tgTurn'); else gmQ(tries === 0 ? item.q || 'gen.ar.q.tgTurn' : 'gen.ar.q.tgTurn', isLive);
      const k = await gmStep(item, k0, 5, 31, want, ['arLess', 'arMore'], n => { ctx.k = n; ctx.R = arTgDraw(h, item, n * 5); }, { icons: arTurnIcons() });
      if (k !== want) { live = false; return { ans: 'turn|' + k * 5, ctx }; } item.step = 1; SFX.tick(); }
    let R = arTgDraw(h, item, item.want, { low: item.step >= 2, lowDeg: item.step >= 2 && !!item.tilt }); ctx.R = R;
    if (item.step === 1) { const sp = [5, 6, 7, 8].filter(n => !TG(1) || n !== (item.tried1 || 5)).map(n => { const B = R.at(n); return [String(n), angP(B.V, (B.a1 + B.a2) / 2, 36)]; });   /* الحلّ المشترك: يسقط موضعٌ جُرِّب */
      if (TG(1)) { const A = R.at(2); hlRing(helpG(svg), A.V, 14, H2C[1]); await S('gen.ar.together.tgCorr'); } else gmQ('gen.ar.q.tgCorr', isLive);
      const k = await gmSpots(svg, sp, '6', { label: 'arSpotAng', bad: '5', r: 13 }); hush(); if (k !== '6') { item.tried1 = +k; live = false; ctx.tap = +k; return { ans: 'corr|' + k, ctx }; } item.step = 2; SFX.tick(); R = arTgDraw(h, item, item.want, { low: true, lowDeg: !!item.tilt }); ctx.R = R; }
    if (item.tilt) { if (TG(2)) { const r0 = item.rot || 0, P = angP(R.B, r0, frameReach(svg, R.B, r0, 160)), Q = angP(R.B, r0 + 180, frameReach(svg, R.B, r0 + 180, 160)); geoLine(helpG(svg), P[0], P[1], Q[0], Q[1], { color: THINK_INK, w: 3, dash: '7 5' }); await S('gen.ar.together.tgTilt'); } else gmQ('gen.ar.q.tgJudge', isLive);   /* سكّةٌ موازيةٌ منقّطة: لا تنطبق على السفلى */
      const k = await choosePick(item.ch.map(([w]) => [w, labelText('arTrJ.' + w), '<i></i>', 'gen.ar.trJ.' + w]), 'neq'); gmOff(); live = false; return { ans: 'judge|' + k, ctx }; }
    if (TG(2)) { arGhost(helpG(svg), R.at(6).V, R.at(2).a1, R.at(2).a2, null); await S('gen.ar.together.tgVal'); } else gmQ('gen.ar.q.tgVal', isLive);   /* الخضراء منقولةً شفافةً إلى موضعها (الحلّ المشترك)، والعدد للطفل */
    const np = numberPick(shuffle(item.nums.map(([v]) => v)), item.want, { west: true, word: degw }), k = await np.p; gmOff(); live = false; return { ans: 'val|' + k, ctx }; },
  judge(item, a) { const [w, v] = String(a).split('|');
    if (w === 'turn') return { ok: false, err: 'arTurnOff' }; if (w === 'corr') return { ok: false, err: +v === 7 ? 'arTrAlt' : 'arTrPos' };
    if (w === 'judge') return v === 'neq' ? { ok: true } : { ok: false, err: 'arTrTilt' };
    return +v === item.want ? { ok: true } : { ok: false, err: (item.nums.find(([x]) => x === +v) || [])[1] || 'arTrOff' }; },
  onOk() { SFX.good(); }, onWrong() { SFX.soft(); },
  async hint2(item, r, err) { const c = r && r.ctx, s = item.step; if (c && c.svg && c.svg.isConnected && c.R) { const m = helpG(c.svg), R = c.R;
      if (s === 0) { const k = c.k ?? item.start / 5, t = item.want / 5, k2 = k + Math.sign(t - k || 1), g = el('g', { opacity: .55 }, m); arTrans(g, k2 * 5, { y1: 100, y2: 184, tilt: item.tilt || 0, rot: item.rot || 0, marks: false, parCol: 'rgba(0,0,0,0)' }); ciRule(m, 180, [238], labelText('arAskGreen'), AR.hl, 15); }   /* قاطعٌ شبحٌ بضغطةٍ نحو المطلوب */
      else if (s === 1) { for (const V of [R.T, R.B]) { hlRing(m, V, 12, H2C[0]); } const A = R.at(2); arArc(m, A.V, A.a1, A.a2, { r: 30, col: H2C[1], w: 5 }); ciRule(m, 180, [238], labelText('arRule.corr'), AR.hl, 15); }   /* التقاطعان، وموضع الخضراء عند الأعلى */
      else if (item.tilt) { ciRule(m, 180, [238], labelText('arAskPar'), AR.hl, 15); }
      else { for (const y of [100, 184]) { const P = arRotPt([300, y], item.rot || 0); hlRing(m, P, 13, H2C[0]); } ciRule(m, 180, [238], labelText('arAskPar'), AR.hl, 15); } }   /* علامتا التوازي على السكّتين */
    await S(s === 0 ? 'gen.ar.hint.tgTurn' : s === 1 ? 'gen.ar.hint.tgCorr' : item.tilt ? 'gen.ar.hint.tgTilt' : 'gen.ar.hint.tgVal'); },
  async together() {},
  async reveal(item, r) { const c = r && r.ctx, s0 = item.step; if (c && c.svg.isConnected) { c.svg.querySelectorAll('[data-help]').forEach(e => e.remove()); arTgDraw(c.h, item, item.want, { low: true, lowDeg: true, lowCol: AR.ok }); }
    item.step = 3; if (item.tilt && s0 === 2) await S('gen.ar.reveal.tgTilt'); else { await S('gen.ar.reveal.tgCorr', { noGap: true }); await sayDeg(item.tilt ? arTrVal(item.want - item.tilt, 6) : item.want); } },
  praise: () => 'praiseThink', twin(item) { return item.twin || null; },
};
