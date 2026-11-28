/* =====================================================================
   M4-U4 «نظرية فيثاغورس»: الألعاب الحركية (D288 (2))
   د1 «مربعات الشبكة» (pyGridGame): يبني مربّع كل ضلعٍ قائمٍ طبقةً طبقة على الشبكة، ثم مربّع الوتر (أو ضلعٍ من الوتر)
   د2 «القائم أم لا؟» (pyRightGame): من أربعة أعوادٍ يُبعد العود الزائد فيُبنى المثلث وتتحقّق المنقلة، ثم المربعات
   د3 «مضخة الماء بالفيثاغورس» (pyPumpGame): يحسب الأنبوب، ثم يحرّك المضخة حتى يقصر فيرى أن العمود أقصر (أو يحسب البعد ثم يضعها)
   ===================================================================== */
/* ---------- د1 «مربعات الشبكة» (pyGridGame): a الأفقي، b الرأسي؛ mode hyp: يبني a ثم b ثم مساحة مربّع الوتر؛ leg: مساحة الوتر A معلومة، يبني a ثم مساحة b ثم يبنيه ---------- */
const pyGrSeq = it => it.mode === 'leg' ? ['fa', 'pick', 'fb'] : ['fa', 'fb', 'pick'];
function pyGrGeo(it) { const a = it.a, b = it.b, u = Math.min(28, 296 / (a + 2 * b + 2), 218 / (2 * a + b + 2)), W = (a + 2 * b + 2) * u, Hh = (2 * a + b + 2) * u;
  const C = [32 + (296 - W) / 2 + (a + b) * u, 24 + (218 - Hh) / 2 + (a + b) * u], A = [C[0] - a * u, C[1]], B = [C[0], C[1] - b * u], n = [-b * u, -a * u], H4 = [A, B, [B[0] + n[0], B[1] + n[1]], [A[0] + n[0], A[1] + n[1]]];
  return { u, C, A, B, H4, mA: [(A[0] + C[0]) / 2, C[1] + a * u / 2], mB: [C[0] + b * u / 2, (B[1] + C[1]) / 2], mC: [(A[0] + H4[2][0]) / 2, (A[1] + H4[2][1]) / 2],
    eq: [C[0] + (b + 2) * u / 2, (C[1] - (a + b) * u + B[1]) / 2], x0: C[0] - (a + b) * u, x1: C[0] + (b + 2) * u, y0: C[1] - (a + b) * u, y1: C[1] + (a + 2) * u }; }   /* eq: الركن الأعلى الأيمن، فوق مربّع الرأسي ويمين مربّع الوتر */
function pyGrBase(svg, it, G) { const g = el('g', { 'pointer-events': 'none' }, svg), a = it.a, b = it.b, u = G.u;
  for (let k = -(a + b); k <= b + 2; k++) geoLine(g, G.C[0] + k * u, G.y0, G.C[0] + k * u, G.y1, { color: '#e2eaf0', w: 1 });
  for (let j = -(a + b); j <= a + 2; j++) geoLine(g, G.x0, G.C[1] + j * u, G.x1, G.C[1] + j * u, { color: '#e2eaf0', w: 1 });
  el('polygon', { points: polyStr(G.H4), fill: PY.fc, stroke: PY.c, 'stroke-width': 2.6 }, g);
  el('polygon', { points: polyStr([G.A, G.C, G.B]), fill: '#fffdf6', stroke: PY.ink, 'stroke-width': 3.2, 'stroke-linejoin': 'round' }, g); preRight(g, G.C, G.A, G.B, 11);
  preLab(g, (G.A[0] + G.C[0]) / 2, G.C[1] - 7, MS(String(a)), { fs: 15, col: PY.a }); preLab(g, G.C[0] - 7, (G.B[1] + G.C[1]) / 2 + 5, MS(String(b)), { fs: 15, col: PY.b, anchor: 'end' });   /* طولا الضلعين داخل المثلث: المربعات خارجه */
  const la = el('g', { 'pointer-events': 'none' }, svg), lb = el('g', { 'pointer-events': 'none' }, svg), lab = el('g', { 'pointer-events': 'none' }, svg); return { g, la, lb, lab }; }
/* طبقات المربّع: على الأفقي صفوفٌ تحته، وعلى الرأسي أعمدةٌ يمينه؛ وما زاد على طول الضلع يبقى مستطيلاً */
function pyGrLay(D, G, it, side, n) { const g = side === 'a' ? D.la : D.lb, len = it[side], u = G.u, col = side === 'a' ? PY.a : PY.b, fill = side === 'a' ? PY.fa : PY.fb; g.innerHTML = '';
  for (let k = 0; k < n; k++) for (let i = 0; i < len; i++) el('rect', { x: side === 'a' ? G.A[0] + i * u : G.C[0] + k * u, y: side === 'a' ? G.C[1] + k * u : G.B[1] + i * u, width: u, height: u, fill, stroke: col, 'stroke-width': 1.2 }, g);
  if (n) el('rect', { x: side === 'a' ? G.A[0] : G.C[0], y: side === 'a' ? G.C[1] : G.B[1], width: side === 'a' ? len * u : n * u, height: side === 'a' ? n * u : len * u, fill: 'none', stroke: col, 'stroke-width': 2.6 }, g); }
function pyGrState(D, G, it) { const SQ = pyGrSeq(it), done = k => SQ.indexOf(k) < it.step; D.lab.innerHTML = ''; D.la.innerHTML = ''; D.lb.innerHTML = '';
  if (done('fa')) { pyGrLay(D, G, it, 'a', it.a); preLab(D.lab, G.mA[0], G.mA[1] + 6, MS(String(it.a * it.a)), { fs: 17, col: PY.a }); }
  if (done('fb')) { pyGrLay(D, G, it, 'b', it.b); preLab(D.lab, G.mB[0], G.mB[1] + 6, MS(String(it.b * it.b)), { fs: 17, col: PY.b }); }
  else if (it.mode === 'leg') preLab(D.lab, G.mB[0], G.mB[1] + 6, done('pick') ? MS(String(it.b * it.b)) : '؟', { fs: 18, col: done('pick') ? PY.b : PY.q });   /* مساحة مربّع الرأسي قبل أن يُبنى */
  const hy = it.mode === 'leg' || done('pick'); preLab(D.lab, G.mC[0], G.mC[1] + 6, hy ? MS(String(it.A)) : '؟', { fs: 18, col: hy ? PY.c : PY.q }); }
ITEM.pyGridGame = {
  make(spec) { const a = spec.a, b = spec.b, leg = spec.mode === 'leg', A = a * a + b * b, want = leg ? b * b : A;
    const P = leg ? [[A + a * a, 'pyGrAddLeg'], [A - a, 'pyGrSubSide'], [b, 'pyGrSide']] : [[a + b, 'pyAdd'], [(a + b) ** 2, 'pySqSum'], [a * b, 'pyOff']];
    /*T*/if (TESTHOOK && (A > 100 || (a + b) ** 2 > 100 || A + a * a > 100)) testBug('pyGridGame: عددٌ فوق المئة');/*/T*/
    return { ...spec, step: 0, A, want, nums: rkPick(want, P, spec.rk ?? 0), tag: 'py-grid-' + (leg ? 'leg' : 'hyp') }; },
  async ask(item, mode, tries) { item.__try = tries; const svg = m3Stage(262), G = pyGrGeo(item), D = pyGrBase(svg, item, G), ctx = { svg, G, D }, t0 = item.step, SQ = pyGrSeq(item), TG = k => tries >= 3 && t0 === k; let live = true; const isLive = () => live && svg.isConnected;
    for (;;) { pyGrState(D, G, item); const st = item.step, cur = SQ[st];
      if (cur === 'pick') { const leg = item.mode === 'leg', aa = item.a * item.a;
        if (TG(st)) { ciEq(helpG(svg), G.eq[0], G.eq[1] + 6, leg ? `${item.A} − ${aa} = ؟` : `${aa} + ${item.b * item.b} = ؟`, PY.hl, 15); await S(leg ? 'gen.py.together.grLeg' : 'gen.py.together.sq'); }   /* الحساب مكتوب، والناتج للطفل */
        else gmQ(leg ? 'gen.py.q.grLeg' : 'gen.py.q.grHyp', isLive);
        const np = numberPick(shuffle(item.nums.map(([v]) => v)), item.want, { west: true }), k = await np.p; gmOff();
        if (st === SQ.length - 1 || +k !== item.want) { live = false; return { ans: 'pick|' + k, ctx }; } item.step = st + 1; SFX.tick(); continue; }   /* في leg: مساحة الرأسي، ثم يبنيه فيتحقّق */
      const side = cur === 'fa' ? 'a' : 'b', len = item[side], tg = TG(st);
      gmQ(tg ? 'gen.py.together.grFill' : st === 0 ? (tries === 0 ? item.q || 'gen.py.q.grFillA' : 'gen.py.q.grFillA') : item.mode === 'leg' ? 'gen.py.q.grFillB2' : 'gen.py.q.grFillB', isLive);
      if (tg) el('rect', { x: side === 'a' ? G.A[0] : G.C[0], y: side === 'a' ? G.C[1] : G.B[1], width: len * G.u, height: len * G.u, fill: 'none', stroke: THINK_INK, 'stroke-width': 2.6, 'stroke-dasharray': '7 5', 'pointer-events': 'none' }, helpG(svg));   /* الحلّ المشترك: المربّع الشبح، وطبقةٌ باقية */
      const n = await gmStep(item, tg ? len - 1 : 0, 0, len + 2, len, ['pyGrLess', 'pyGrMore'], v => pyGrLay(D, G, item, side, v), { icons: [gmIco(false), gmIco(true)], atLeast: true });
      if (n !== len) { live = false; ctx.side = side; return { ans: 'fill|' + side + '|' + n, ctx }; }
      SFX.tick(); item.step = st + 1; if (item.step >= SQ.length) { pyGrState(D, G, item); live = false; return { ans: 'done|1', ctx }; } } },
  judge(item, a) { const [w, s, v] = String(a).split('|');
    if (w === 'fill') return { ok: false, err: +v < item[s] ? 'pyGrShort' : 'pyGrTall' }; if (w === 'done') return { ok: true };
    return +s === item.want ? { ok: true } : { ok: false, err: (item.nums.find(([x]) => x === +s) || [])[1] || 'pyOff' }; },
  onOk(item, r) { SFX.good(); const c = r && r.ctx; if (c && c.svg.isConnected) { const aa = item.a * item.a, bb = item.b * item.b; c.svg.querySelectorAll('[data-help]').forEach(e => e.remove()); item.step = 3; pyGrState(c.D, c.G, item); ciEq(c.svg, c.G.eq[0], c.G.eq[1] + 6, item.mode === 'leg' ? `${item.A} − ${aa} = ${bb}` : `${aa} + ${bb} = ${item.A}`, PY.ok, 15); } },
  onWrong() { SFX.soft(); },
  async hint2(item, r, err) { const c = r && r.ctx; if (c && c.svg && c.svg.isConnected) { const m = helpG(c.svg), G = c.G, u = G.u;
      if (err === 'pyGrShort' || err === 'pyGrTall') { const s = c.side, len = item[s]; el('rect', { x: s === 'a' ? G.A[0] : G.C[0], y: s === 'a' ? G.C[1] : G.B[1], width: len * u, height: len * u, fill: 'none', stroke: THINK_INK, 'stroke-width': 3, 'stroke-dasharray': '7 5' }, m);   /* المربّع الشبح: ارتفاعه كطول ضلعه */
        ciRule(m, 180, [[G.eq[0], G.eq[1]], [180, 236], [180, 30]], labelText('pyGrAskSq'), PY.hl, 14); }
      else { hlRing(m, G.mA, Math.max(14, item.a * u * .42), H2C[0]); if (item.mode !== 'leg') hlRing(m, G.mB, Math.max(14, item.b * u * .42), H2C[1]); else hlRing(m, G.mC, Math.max(16, u * 1.2), H2C[1]);   /* المربّعان المعدودان */
        ciRule(m, 180, [[180, 236], [G.eq[0], G.eq[1]], [180, 30]], labelText(item.mode === 'leg' ? 'pyRuleLeg' : 'pyRuleSq'), PY.hl, 14); } }
    await S(err === 'pyGrShort' || err === 'pyGrTall' ? 'gen.py.hint.grFill' : item.mode === 'leg' ? 'gen.py.hint.leg' : 'gen.py.hint.sq'); },
  async together() {},
  async reveal(item, r) { const c = r && r.ctx; item.step = 3; if (c && c.svg.isConnected) { c.svg.querySelectorAll('[data-help]').forEach(e => e.remove()); pyGrState(c.D, c.G, item); }
    await S(item.mode === 'leg' ? 'gen.py.reveal.grLeg' : 'gen.py.reveal.sq', { noGap: true }); await S(numw(item.want), { append: true }); },
  praise: () => 'praiseThink', twin(item) { return item.twin || null; },
};

/* ---------- د2 «القائم أم لا؟» (pyRightGame): s أربعة أعواد، منها ثلاثةٌ وحدها تصنع مثلثاً قائماً؛ يُبعد العود الزائد، فيُبنى المثلث والمنقلة على زاويته الكبرى، ثم المربعات ---------- */
function pyRtOut(s) { const R = []; for (let o = 0; o < s.length; o++) { const t = s.filter((_, i) => i !== o).sort((x, y) => x - y); if (t[0] * t[0] + t[1] * t[1] === t[2] * t[2]) R.push(o); } return R; }
const pyRtTri = (s, o) => s.filter((_, i) => i !== o).sort((x, y) => x - y);
const pyRtAng = t => Math.acos((t[0] * t[0] + t[1] * t[1] - t[2] * t[2]) / (2 * t[0] * t[1])) * 180 / Math.PI;   /* الزاوية المقابلة للأطول */
const pyRtUs = it => 200 / Math.max(...it.s);   /* ومربّع العود بجانبه داخل الإطار */
function pyRtSticks(svg, it) { const us = pyRtUs(it); return it.s.map((v, i) => { const y = 34 + i * 24, t = el('g', { 'data-stick': i }, svg); geoLine(t, 76, y, 76 + v * us, y, { color: PY.road, w: 9 }); preLab(t, 62, y + 5, MS(String(v)), { fs: 15, anchor: 'end' }); return { g: t, k: String(i), seg: [[76, y], [76 + v * us, y]], label: labelText('pyStick') }; }); }
function pyRtGeo(t) { const th = pyRtAng(t), c = Math.cos(th * Math.PI / 180), s = Math.sin(th * Math.PI / 180), ut = Math.min(84 / (t[0] * s), 236 / t[1], c < 0 ? 56 / (t[0] * -c) : 1e9), V = [86, 214];   /* وعدد القاعدة تحتها داخل الإطار */
  return { th, ut, V, P: [V[0] + t[1] * ut, V[1]], Q: angP(V, th, t[0] * ut) }; }   /* الرأس المقابل للأطول يساراً، والضلع الأوسط أفقيٌّ عليه */
function pyRtDraw(svg, t, o = {}) { const G = pyRtGeo(t), g = el('g', { 'pointer-events': 'none', 'data-tri': 1 }, svg), cen = [(G.V[0] + G.P[0] + G.Q[0]) / 3, (G.V[1] + G.P[1] + G.Q[1]) / 3];
  el('polygon', { points: polyStr([G.V, G.P, G.Q]), fill: o.ok ? 'rgba(47,157,107,.12)' : PY.fa, stroke: PY.ink, 'stroke-width': 3.2, 'stroke-linejoin': 'round' }, g);
  preSegLab(g, G.V, G.Q, cen, MS(String(t[0])), { fs: 15 }); preSegLab(g, G.V, G.P, cen, MS(String(t[1])), { fs: 15 }); preSegLab(g, G.P, G.Q, cen, MS(String(t[2])), { fs: 15, col: PY.c });
  if (o.right) preRight(g, G.V, G.P, G.Q, 12); G.g = g; return G; }
ITEM.pyRightGame = {
  make(spec) { const O = pyRtOut(spec.s); /*T*/if (TESTHOOK && O.length !== 1) testBug('pyRightGame: ليس عودٌ زائدٌ واحد');/*/T*/ const t = pyRtTri(spec.s, O[0]), c2 = t[2] * t[2];
    return { ...spec, step: 0, out: O[0], t, want: c2, nums: rkPick(c2, [[(t[0] + t[1]) ** 2, 'pySqSum'], [t[0] + t[1], 'pyAdd'], [t[0] * t[0] + t[1], 'pyOff']], spec.rk ?? 0), tag: 'py-right' }; },
  async ask(item, mode, tries) { item.__try = tries; const svg = m3Stage(262), ctx = { svg }, t0 = item.step, TG = k => tries >= 3 && t0 === k; let live = true; const isLive = () => live && svg.isConnected, us = pyRtUs(item);
    if (item.step === 0) { const T = pyRtSticks(svg, item); ctx.T = T;
      if (TG(0)) { const m = helpG(svg); item.s.forEach((v, i) => preLab(m, 76 + v * us + 10, 39 + i * 24, MS(String(v * v)), { fs: 14, col: PY.hl, anchor: 'start' })); const L = item.s.indexOf(Math.max(...item.s)); hlSeg(m, T[L].seg[0], T[L].seg[1], H2C[2], { w: 15 });
        ciEq(m, 180, 196, `؟ + ؟ = ${Math.max(...item.s) ** 2}`, PY.hl, 16); await S('gen.py.together.rtLeave'); }   /* مربّع كل عود، والأطول معلَّماً */
      else gmQ(tries === 0 ? item.q || 'gen.py.q.rtLeave' : 'gen.py.q.rtLeave', isLive);
      const k = +(await tapOne(T, { ok: String(item.out), pad: 56 })); hush(); T.forEach(x => { x.g.onclick = null; x.g.removeAttribute('role'); x.g.removeAttribute('tabindex'); });
      T[k].g.setAttribute('opacity', .3); const t = pyRtTri(item.s, k), G = pyRtDraw(svg, t), pr = protAt(svg, G.V, 0, { R: 54, inner: false }); pr.mark(G.th); SFX.tick();
      const rd = Math.round(G.th); degText(svg, 300, 152, rd, { size: 17, color: rd === 90 ? PY.ok : PY.q }).setAttribute('data-deg', 1); await sleep(FAST ? 20 : 1100);   /* المنقلة تتحقّق: القراءة على الزاوية المقابلة للأطول */
      if (k !== item.out) { live = false; ctx.t = t; return { ans: 'leave|' + k, ctx }; }
      item.step = 1; svg.innerHTML = ''; }
    const s2 = m3Stage(262); ctx.svg = s2; const G = pyRtDraw(s2, item.t, { right: true }); ctx.G = G; degText(s2, 300, 152, 90, { size: 17, color: PY.ok });
    if (TG(1)) { ciEq(helpG(s2), 180, 60, `${item.t[0] * item.t[0]} + ${item.t[1] * item.t[1]} = ؟`, PY.hl, 17); await S('gen.py.together.sq'); } else gmQ('gen.py.q.rtSum', () => live && s2.isConnected);
    const np = numberPick(shuffle(item.nums.map(([v]) => v)), item.want, { west: true, word: bigw }), k = await np.p; live = false; gmOff(); return { ans: 'sum|' + k, ctx }; },
  judge(item, a) { const [w, v] = String(a).split('|'); if (w === 'leave') return { ok: false, err: 'pyConvYes' };
    return +v === item.want ? { ok: true } : { ok: false, err: (item.nums.find(([x]) => x === +v) || [])[1] || 'pyOff' }; },
  onOk(item, r) { SFX.good(); const c = r && r.ctx; if (c && c.svg.isConnected) { c.svg.querySelectorAll('[data-help]').forEach(e => e.remove()); ciEq(c.svg, 180, 60, `${item.t[0] * item.t[0]} + ${item.t[1] * item.t[1]} = ${item.want}`, PY.ok, 17); } },
  onWrong() { SFX.soft(); },
  async hint2(item, r, err) { const c = r && r.ctx; if (c && c.svg && c.svg.isConnected) { const m = helpG(c.svg);
      if (err === 'pyConvYes') { c.svg.querySelectorAll('[data-tri], [data-prot], [data-deg]').forEach(e => e.remove()); const us = pyRtUs(item); item.s.forEach((v, i) => preLab(m, 76 + v * us + 10, 39 + i * 24, MS(String(v * v)), { fs: 14, col: PY.hl, anchor: 'start' })); ciRule(m, 180, [170], labelText('pyRuleConv'), PY.hl, 14); }   /* المثلث الخطأ يُرفع، ومربّع كل عود بجانبه */
      else { const G = c.G; hlSeg(m, G.V, G.Q, H2C[0]); hlSeg(m, G.V, G.P, H2C[1]); ciRule(m, 180, [40, 70], labelText('pyRuleSq'), PY.hl, 14); } }   /* الضلعان القصيران: مربّعاهما لا هما */
    await S(err === 'pyConvYes' ? 'gen.py.hint.isRight' : 'gen.py.hint.sq'); },
  async together() {},
  async reveal(item, r) { const c = r && r.ctx; if (c && c.svg.isConnected) { const s2 = m3Stage(262); c.svg = s2; pyRtDraw(s2, item.t, { right: true, ok: true }); degText(s2, 300, 152, 90, { size: 17, color: PY.ok }); ciEq(s2, 180, 60, `${item.t[0] * item.t[0]} + ${item.t[1] * item.t[1]} = ${item.want}`, PY.ok, 17); }
    item.step = 2; await S('gen.py.reveal.sq', { noGap: true }); await S(bigw(item.want), { append: true }); },
  praise: () => 'praiseThink', twin(item) { return item.twin || null; },
};

/* ---------- د3 «مضخة الماء بالفيثاغورس» (pyPumpGame): h ارتفاع البيت عن الطريق، x بُعد المضخة عن قدم العمود، st خطوة الزرّ؛ mode hyp: الأنبوب ثم أقصر أنبوب، leg: L معلوم، البعد ثم وضعها (x0 موضعها الأول) ---------- */
const pyR1 = v => Math.round(v * 10) / 10;
function pyPmGeo(it) { const st = it.st || 1, lo = it.mode === 'leg' ? 0 : -2, hi = Math.round(it.x / st) + 2, span = (hi - lo) * st, u = Math.min(16, 252 / span, 148 / it.h), Qx = 54 - lo * st * u + (252 - span * u) / 2, y = 206;
  return { u, st, lo, hi, y, Q: [Qx, y], N: [Qx, y - it.h * u], at: k => [Qx + k * st * u, y] }; }
function pyPmBase(svg, it, G) { const g = el('g', { 'pointer-events': 'none' }, svg); geoLine(g, 28, G.y, 332, G.y, { color: PY.road, w: 5 });
  const N = G.N; el('rect', { x: N[0] - 13, y: N[1] - 16, width: 26, height: 16, fill: '#f1e3c8', stroke: PY.ink, 'stroke-width': 2 }, g); el('polygon', { points: polyStr([[N[0] - 17, N[1] - 15], [N[0] + 17, N[1] - 15], [N[0], N[1] - 29]]), fill: '#c8573b', stroke: PY.ink, 'stroke-width': 2 }, g);
  geoLine(g, N[0], N[1], G.Q[0], G.Q[1], { color: PY.a, w: 3, dash: '7 5' }); pfDot(g, G.Q); pfLab(g, G.Q[0] - 10, G.y + 20, 'ق', { fs: 14 });
  preLab(g, N[0] - 9, (N[1] + G.y) / 2 + 5, MS(String(it.h)), { fs: 15, col: PY.a, anchor: 'end' });
  if (it.mode === 'leg') { const c = el('g', {}, g); el('rect', { x: 236, y: 22, width: 94, height: 32, rx: 9, fill: '#fffdf6', stroke: PY.c, 'stroke-width': 2 }, c); preLab(c, 283, 44, labelText('pyPipe') + ' ' + MS(String(it.L)), { dir: 'rtl', fs: 15, col: PY.c }); }   /* طول الأنبوب المعلوم */
  return el('g', { 'pointer-events': 'none' }, svg); }
function pyPmDraw(m, it, G, k, o = {}) { m.innerHTML = ''; const R = G.at(k), d = Math.abs(k * G.st), N = G.N, L = Math.hypot(it.h, k * G.st);
  if (k) { geoLine(m, N[0], N[1], R[0], R[1], { color: o.ghost ? THINK_INK : PY.c, w: o.ghost ? 2.6 : 4.4, dash: o.ghost ? '6 5' : null }); if (!o.ghost) preRight(m, G.Q, N, R, 10); }
  else if (o.ghost) { geoLine(m, N[0], N[1], G.Q[0], G.Q[1], { color: THINK_INK, w: 3.4, dash: '6 5' }); preLab(m, N[0] + 9, (N[1] + G.y) / 2 + 5, MS(String(it.h)), { fs: 15, col: THINK_INK, anchor: 'start' }); }   /* الشبح على القدم: الأنبوب هو العمود، بطوله */
  if (!o.ghost) { el('rect', { x: R[0] - 9, y: G.y - 19, width: 18, height: 14, rx: 3, fill: '#4f86a8', stroke: PY.ink, 'stroke-width': 1.6 }, m); el('circle', { cx: R[0], cy: G.y - 12, r: 3, fill: '#fff' }, m);
    if (k) { preLab(m, (G.Q[0] + R[0]) / 2, G.y + 20, MS(String(d)), { fs: 14 }); } }
  if (o.len !== false && k) { const M = [(N[0] + R[0]) / 2, (N[1] + R[1]) / 2], ln = Math.hypot(R[0] - N[0], R[1] - N[1]) || 1, nn = [(R[1] - N[1]) / ln, -(R[0] - N[0]) / ln], s = nn[0] < 0 ? -1 : 1;
    preLab(m, M[0] + s * nn[0] * 16, M[1] + s * nn[1] * 16 + 5, o.len === '?' ? '؟' : MS(String(pyR1(L))), { fs: 15, col: o.len === '?' ? PY.q : o.ghost ? THINK_INK : PY.c, anchor: 'start' }); }   /* طول الأنبوب بجانبه (يمينه) */
  return { R, L }; }
ITEM.pyPumpGame = {
  make(spec) { const h = spec.h, x = spec.x, leg = spec.mode === 'leg', L = Math.hypot(h, x); /*T*/if (TESTHOOK && (!Number.isInteger(L) || (leg && L !== spec.L) || x % (spec.st || 1))) testBug('pyPumpGame: الأعداد لا تصنع مثلثاً قائماً صحيحاً');/*/T*/
    const want = leg ? x : L, P = leg ? [[L - h, 'pySub'], [L * L - h * h, 'pyNoRoot'], [L + h, 'pyAddLeg']] : [[h, 'pyPipePerp'], [h + x, 'pyAdd'], [h * h + x * x, 'pyNoRoot']];
    return { ...spec, step: 0, Lh: L, want, nums: rkPick(want, P, spec.rk ?? 0), tag: 'py-pump-' + (leg ? 'leg' : 'hyp') }; },
  async ask(item, mode, tries) { item.__try = tries; const svg = m3Stage(262), G = pyPmGeo(item), m = pyPmBase(svg, item, G), ctx = { svg, G, m }, t0 = item.step, TG = k => tries >= 3 && t0 === k, leg = item.mode === 'leg', st = G.st; let live = true; const isLive = () => live && svg.isConnected;
    if (item.step === 0) { if (!leg) pyPmDraw(m, item, G, item.x / st, { len: '?' });
      if (TG(0)) { ciEq(helpG(svg), 236, leg ? 82 : 46, leg ? `${item.L * item.L} − ${item.h * item.h} = ؟ × ؟` : `${item.h * item.h} + ${item.x * item.x} = ؟ × ؟`, PY.hl, 15); await S(leg ? 'gen.py.together.leg' : 'gen.py.together.pump'); }   /* الحساب مكتوب، والجذر للطفل */
      else gmQ(tries === 0 ? item.q || (leg ? 'gen.py.q.pumpLeg' : 'gen.py.q.pumpHyp') : leg ? 'gen.py.q.pumpLeg' : 'gen.py.q.pumpHyp', isLive);
      const np = numberPick(shuffle(item.nums.map(([v]) => v)), item.want, { west: true, word: bigw }), k = await np.p; gmOff();
      if (+k !== item.want) { live = false; return { ans: 'calc|' + k, ctx }; } item.step = 1; SFX.tick(); }
    const tg = TG(1), want = leg ? item.x / st : 0, k0 = tg ? (leg ? want - 1 : 1) : leg ? (item.x0 ?? 0) / st : item.x / st;
    if (tg) await S(leg ? 'gen.py.together.pumpPut' : 'gen.py.together.pumpShort'); else gmQ(leg ? 'gen.py.q.pumpPut' : 'gen.py.q.pumpShort', isLive);
    const k = await gmStep(item, k0, G.lo, G.hi, want, ['pyLeft', 'pyRight'], v => { ctx.k = v; pyPmDraw(m, item, G, v); });
    live = false; ctx.k = k; return { ans: 'move|' + k, ctx }; },
  judge(item, a) { const [w, v] = String(a).split('|'), leg = item.mode === 'leg', st = item.st || 1;
    if (w === 'calc') return { ok: false, err: (item.nums.find(([x]) => x === +v) || [])[1] || 'pyOff' };
    return +v === (leg ? item.x / st : 0) ? { ok: true } : { ok: false, err: leg ? 'pyPumpPos' : 'pyPumpNotPerp' }; },
  onOk(item, r) { SFX.good(); const c = r && r.ctx; if (c && c.svg.isConnected) { const G = c.G; if (item.mode !== 'leg') { geoLine(c.svg, G.N[0], G.N[1], G.Q[0], G.Q[1], { color: PY.ok, w: 4.4 }); preLab(c.svg, G.N[0] + 10, (G.N[1] + G.y) / 2 + 5, labelText('pyShortest'), { dir: 'rtl', fs: 14, col: PY.ok, anchor: 'end' }); } } },   /* العمود أقصر الأنابيب */
  onWrong() { SFX.soft(); },
  async hint2(item, r, err) { const c = r && r.ctx; if (c && c.svg && c.svg.isConnected) { const m = helpG(c.svg), G = c.G, leg = item.mode === 'leg';
      if (err === 'pyPumpNotPerp' || err === 'pyPumpPos') { const k = c.k ?? 0, t = leg ? item.x / G.st : 0, k2 = k + Math.sign(t - k); pyPmDraw(el('g', {}, m), item, G, k2, { ghost: true });   /* أنبوبٌ شبحٌ بضغطةٍ واحدة نحو الجواب، بطوله */
        ciRule(m, 180, [[236, 46], [236, 82], [180, 236]], labelText(leg ? 'pyAskPipe' : 'pyAskShort'), PY.hl, 14); }
      else { const R = G.at(item.x / G.st); hlSeg(m, G.N, G.Q, H2C[0]); hlSeg(m, G.Q, R, H2C[1]); hlSeg(m, G.N, R, H2C[2]); ciRule(m, 180, [[236, 46], [236, 82], [180, 236]], labelText(leg ? 'pyRuleLeg' : 'pyRuleSq'), PY.hl, 14); } }   /* المثلث القائم: العمود والبعد والأنبوب */
    await S(err === 'pyPumpNotPerp' ? 'gen.py.hint.pumpShort' : err === 'pyPumpPos' ? 'gen.py.hint.pumpPut' : item.mode === 'leg' ? 'gen.py.hint.leg' : 'gen.py.hint.sq'); },
  async together() {},
  async reveal(item, r) { const c = r && r.ctx, leg = item.mode === 'leg'; if (c && c.svg.isConnected) { c.svg.querySelectorAll('[data-help]').forEach(e => e.remove()); const G = c.G; pyPmDraw(c.m, item, G, item.x / G.st); }
    item.step = 2; await S(leg ? 'gen.py.reveal.pumpLeg' : 'gen.py.reveal.pumpHyp', { noGap: true }); await S(numw(item.want), { append: true }); },
  praise: () => 'praiseThink', twin(item) { return item.twin || null; },
};
