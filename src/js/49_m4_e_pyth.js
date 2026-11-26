/* =====================================================================
   M4-U4 «نظرية فيثاغورس» (المرحلة 4، المرجع reference/03_المناهج_والوحدات/M4_U4_فيثاغورس.md، نسخة 1.2)
   د1 النظرية بمربعات الأضلاع وبرهانها بالمربع ذي الضلع أ + ب، والوتر والضلع والجذر التقريبي (C407 أ) · د2 العكس وبرهانه بـ SSS (C407 ب)
   د3 العمودي أقصر مسافة بالنظرية، وحالة الوتر وضلع قائم (C407 ج، واستدعاء C405) · د4 مشروع «السلّم والجدار» واستكشاف AA (استدعاء C406)
   د5 «محكمة الوتر»: المراجعة والاختبار (12). النظرية تُبرهَن لا تُقاس، والجذور التقريبية بمنزلة عشرية واحدة.
   ===================================================================== */
const PY = { a: '#2f7fc1', b: '#2f9d6b', c: '#d9822b', ink: '#24323a', fa: 'rgba(47,127,193,.16)', fb: 'rgba(47,157,107,.16)', fc: 'rgba(217,130,43,.16)', q: '#c0392b', grid: '#c9d6df', hl: SO.hl, ok: SO.ok, road: '#8a7f6e', wall: '#b9a98f' };
const pyRt = (a, b) => Math.sqrt(a * a + b * b);
const pyKey = v => String(+v.toFixed(1)).replace('.', '_');
const pyTxt = v => MS(String(+v.toFixed(1)));
/* مثلث قائم: القائمة عند C، والضلع الأفقي a يساره، والرأسي b فوقه */
function pyTri(g, C, a, b, u, o = {}) { const A = [C[0] - a * u, C[1]], B = [C[0], C[1] - b * u]; el('polygon', { points: polyStr([A, C, B]), fill: o.fill || PY.fa, stroke: o.col || PY.ink, 'stroke-width': 3.2, 'stroke-linejoin': 'round', 'pointer-events': 'none' }, g); preRight(g, C, A, B, 12); return { A, B, C }; }
/* المربعات على الأضلاع: على الأفقي تحته، وعلى الرأسي يمينه، وعلى الوتر خارجه؛ cells: شبكة الوحدات في مربّعي الضلعين القائمين */
function pySquares(g, C, a, b, u, o = {}) { const A = [C[0] - a * u, C[1]], B = [C[0], C[1] - b * u], n = [-(b * u), -(a * u)];
  const sq = (P, col, fill, cells, k) => { el('polygon', { points: polyStr(P), fill, stroke: col, 'stroke-width': 2.6, 'pointer-events': 'none' }, g);
    if (cells) for (let i = 1; i < k; i++) { const t = i / k; geoLine(g, P[0][0] + (P[1][0] - P[0][0]) * t, P[0][1] + (P[1][1] - P[0][1]) * t, P[3][0] + (P[2][0] - P[3][0]) * t, P[3][1] + (P[2][1] - P[3][1]) * t, { color: col, w: 1, dash: '2 2' }); geoLine(g, P[0][0] + (P[3][0] - P[0][0]) * t, P[0][1] + (P[3][1] - P[0][1]) * t, P[1][0] + (P[2][0] - P[1][0]) * t, P[1][1] + (P[2][1] - P[1][1]) * t, { color: col, w: 1, dash: '2 2' }); } };
  sq([A, C, [C[0], C[1] + a * u], [A[0], A[1] + a * u]], PY.a, PY.fa, o.cells !== false, a);
  sq([C, B, [B[0] + b * u, B[1]], [C[0] + b * u, C[1]]], PY.b, PY.fb, o.cells !== false, b);
  sq([A, B, [B[0] + n[0], B[1] + n[1]], [A[0] + n[0], A[1] + n[1]]], PY.c, PY.fc, !!o.hypCells, Math.round(pyRt(a, b)));
  pyTri(g, C, a, b, u, { fill: '#fffdf6' });
  const mid = P => [(P[0][0] + P[2][0]) / 2, (P[0][1] + P[2][1]) / 2];
  return { A, B, C, mA: mid([A, C, [C[0], C[1] + a * u], [A[0], A[1] + a * u]]), mB: mid([C, B, [B[0] + b * u, B[1]], [C[0] + b * u, C[1]]]), mC: mid([A, B, [B[0] + n[0], B[1] + n[1]], [A[0] + n[0], A[1] + n[1]]]) }; }

/* ================= ① مربع الوتر بعدّ المربعات (C407): a، b (المربع على الوتر a² + b²) ================= */
ITEM.pySq = cpItem({ H: 262, tLine: 'gen.py.together.sq', hint: 'gen.py.hint.sq', rLine: 'gen.py.reveal.sq', rSay: it => S(bigw(it.want), { append: true }), num: true, praise: 'praiseThink',
  make: s => { const want = s.a * s.a + s.b * s.b; /*T*/if (TESTHOOK && (want > 100 || (s.a + s.b) ** 2 > 100 && false)) testBug('pySq: المربع أكبر من مئة');/*/T*/ return { want, nums: [want, s.a + s.b, (s.a + s.b) ** 2 <= 100 ? (s.a + s.b) ** 2 : want + 1], tag: 'py-sq' }; },
  draw(svg, item, tries) { const g = el('g', {}, svg), a = item.a, b = item.b, u = Math.min(30, 320 / (a + 2 * b), 212 / (2 * a + b)), W = (a + 2 * b) * u, C = [180 - W / 2 + (a + b) * u, 18 + (212 - (2 * a + b) * u) / 2 + (a + b) * u];
    const Q = pySquares(g, C, a, b, u); preLab(g, Q.mC[0], Q.mC[1] + 6, '؟', { col: PY.q, fs: 20 });
    if (tries >= 2) { const m = helpG(svg); hlRing(m, Q.mA, Math.max(14, item.a * u * .42), H2C[0]); hlRing(m, Q.mB, Math.max(14, item.b * u * .42), H2C[1]); preLab(m, Q.mA[0], Q.mA[1] + 6, MS(String(item.a * item.a)), { col: PY.a, fs: 16 }); preLab(m, Q.mB[0], Q.mB[1] + 6, MS(String(item.b * item.b)), { col: PY.b, fs: 16 }); if (tries === 2) ciRule(m, 180, 246, labelText('pyRuleSq'), PY.hl, 15); }   /* المستوى الثاني رسمٌ: مربّعا الضلعين بمساحتيهما، والبطاقة معه (لا تُنسخ) */
    if (tries >= 3) ciEq(helpG(svg), 180, 246, `${item.a * item.a} + ${item.b * item.b} = ؟`, PY.hl, 17); return { Q }; },
  h2: async (item, ctx) => { ciRule(helpG(ctx.svg), 180, 246, labelText('pyRuleSq'), PY.hl, 15); await sleep(FAST ? 10 : 250); },
  pick: (item, ctx) => { const np = numberPick(shuffle(item.nums), item.want, { west: true }); ctx.np = np; return np.p; },
  errOf: (it, k) => k === it.a + it.b ? 'pyAdd' : k === (it.a + it.b) ** 2 ? 'pySqSum' : 'pyOff' });

/* ================= ② الضلع القائم (C407): hyp، a معلوم؛ ctx tri | perp (عمود من نقطة إلى طريق) | ladder (سلّم على جدار) ================= */
function pyScene(g, ctx, hyp, a, want, o = {}) { const u = ctx === 'tri' ? Math.min(o.u || 34, 168 / Math.max(want, 1), 220 / Math.max(a, 1)) : Math.min(o.u || 14, 210 / Math.max(hyp, 1), 160 / Math.max(want, 1), 250 / Math.max(a, 1)), labs = {};   /* الارتفاع والعرض داخل الإطار */
  if (ctx === 'perp') { const y = 196, N = [150, y - want * u], Qf = [150, y], R = [150 + a * u, y]; geoLine(g, 24, y, 336, y, { color: PY.road, w: 5 }); geoLine(g, N[0], N[1], Qf[0], Qf[1], { color: PY.a, w: 3.4, dash: '7 5' }); geoLine(g, N[0], N[1], R[0], R[1], { color: PY.c, w: 4 });
    preRight(g, Qf, N, R, 12); [N, Qf, R].forEach(P => pfDot(g, P)); pfLab(g, N[0] - 14, N[1] + 6, 'ن'); pfLab(g, Qf[0] - 10, y + 20, 'ق'); pfLab(g, R[0] + 10, y + 20, 'ر');
    labs.hyp = preLab(g, (N[0] + R[0]) / 2 + 16, (N[1] + R[1]) / 2 - 6, MS(String(hyp)), { col: PY.c, fs: 16, anchor: 'start' }); labs.a = preLab(g, (Qf[0] + R[0]) / 2, y + 22, MS(String(a)), { fs: 16 }); labs.q = preLab(g, N[0] - 12, (N[1] + y) / 2 + 6, '؟', { col: PY.q, fs: 18, anchor: 'end' }); labs.pts = { h: [N, R], k: [Qf, R], C: Qf }; return labs; }
  if (ctx === 'ladder') { const y = 200, W = 300, B = [W - a * u, y], T = [W, y - want * u]; el('rect', { x: W, y: 24, width: 20, height: y - 24, fill: PY.wall, 'pointer-events': 'none' }, g); geoLine(g, 30, y, W + 20, y, { color: PY.road, w: 5 });
    geoLine(g, B[0], B[1], T[0], T[1], { color: PY.c, w: 7 }); for (let i = 1; i < 8; i++) { const P = [B[0] + (T[0] - B[0]) * i / 8, B[1] + (T[1] - B[1]) * i / 8]; geoLine(g, P[0] - 7, P[1] - 3, P[0] + 7, P[1] + 3, { color: PY.c, w: 3 }); }
    preRight(g, [W, y], B, T, 12); labs.hyp = preLab(g, (B[0] + T[0]) / 2 - 18, (B[1] + T[1]) / 2, ciTxt(hyp, 'm'), { col: PY.c, fs: 15, dir: 'rtl', anchor: 'start' }); labs.a = preLab(g, (B[0] + W) / 2, y + 22, ciTxt(a, 'm'), { fs: 15, dir: 'rtl' }); labs.q = preLab(g, W + 28, (y + T[1]) / 2, '؟', { col: PY.q, fs: 18, anchor: 'start' }); labs.pts = { h: [B, T], k: [B, [W, y]], C: [W, y] }; return labs; }
  if (o.rot) { const T = preRightTriPts(a, want, 34, { rot: o.rot, cen: [180, 146], box: [250, 128] }), cen = [(T.A[0] + T.B[0] + T.C[0]) / 3, (T.A[1] + T.B[1] + T.C[1]) / 3];   /* مداراً: الوتر قد يكون القاعدة (المراجع A لبوابة M4-U3/U4، 15) */
    el('polygon', { points: polyStr([T.A, T.C, T.B]), fill: PY.fa, stroke: PY.ink, 'stroke-width': 3.2, 'stroke-linejoin': 'round', 'pointer-events': 'none' }, g); preRight(g, T.C, T.A, T.B, 12);
    labs.a = preSegLab(g, T.A, T.C, cen, MS(String(a)), { fs: 16 }); labs.q = preSegLab(g, T.C, T.B, cen, '؟', { col: PY.q, fs: 18 }); labs.hyp = preSegLab(g, T.A, T.B, cen, MS(String(hyp)), { col: PY.c, fs: 16 }); labs.pts = { h: [T.A, T.B], k: [T.A, T.C], C: T.C }; return labs; }
  const C = [250, 196], T = pyTri(g, C, a, want, u); labs.a = preLab(g, (T.A[0] + C[0]) / 2, C[1] + 22, MS(String(a)), { fs: 16 }); labs.q = preLab(g, C[0] + 14, (T.B[1] + C[1]) / 2 + 6, '؟', { col: PY.q, fs: 18, anchor: 'start' });
  labs.hyp = preLab(g, (T.A[0] + T.B[0]) / 2 - 12, (T.A[1] + T.B[1]) / 2 - 8, MS(String(hyp)), { col: PY.c, fs: 16, anchor: 'end' }); labs.pts = { h: [T.A, T.B], k: [T.A, C], C }; return labs; }
const pyHx = it => it.ctx === 'perp' ? 250 : 150;   /* سطر العون فوق الشكل: في العمود يسار النقطة ن مشغول، فيُزاح يميناً */
ITEM.pyLeg = cpItem({ H: 250, tLine: 'gen.py.together.leg', hint: 'gen.py.hint.leg', rLine: 'gen.py.reveal.leg', rSay: it => S(numw(it.want), { append: true }), num: true, praise: 'praiseThink',
  make: s => { const w2 = s.hyp * s.hyp - s.a * s.a, want = Math.round(Math.sqrt(w2)); /*T*/if (TESTHOOK && want * want !== w2) testBug('pyLeg: الضلع ليس عدداً صحيحاً');/*/T*/
    return { want, w2, nums: [want, s.hyp - s.a, w2 <= 100 ? w2 : s.hyp + s.a].filter((v, i, X) => X.indexOf(v) === i).concat([want + 1]).slice(0, 3), tag: 'py-leg-' + (s.ctx || 'tri') }; },
  draw(svg, item, tries) { const g = el('g', {}, svg), L = pyScene(g, item.ctx || 'tri', item.hyp, item.a, item.want, { rot: item.rot });
    if (tries >= 3) ciEq(helpG(svg), pyHx(item), 34, `${item.hyp} × ${item.hyp} − ${item.a} × ${item.a} = ${item.w2}`, PY.hl, 16); return { L }; },
  h2: async (item, ctx) => { const m = helpG(ctx.svg), P = ctx.L && ctx.L.pts; if (P) { hlSeg(m, P.h[0], P.h[1], H2C[2]); hlSeg(m, P.k[0], P.k[1], H2C[0]); hlRing(m, P.C, 18); }   /* المستوى الثاني رسمٌ: الوتر (الأطول، مقابل القائمة) والضلع المعلوم */
    ciRule(m, pyHx(item), 34, labelText('pyRuleLeg'), PY.hl, 15); await sleep(FAST ? 10 : 250); },
  show: async (item, ctx) => { if (ctx && ctx.L && ctx.L.q) { ctx.L.q.textContent = MS(String(item.want)); ctx.L.q.setAttribute('fill', PY.ok); } },
  pick: (item, ctx) => { const np = numberPick(shuffle(item.nums), item.want, { west: true }); ctx.np = np; return np.p; },
  errOf: (it, k) => k === it.hyp - it.a ? 'pySub' : k === it.w2 ? 'pyNoRoot' : k === it.hyp + it.a ? 'pyAddLeg' : 'pyLegOff' });   /* (المراجع A لبوابة M4-U3/U4، 16) */

/* ================= ③ الوتر بجذر تقريبي (C407): a، b؛ الجواب بمنزلة عشرية واحدة ================= */
ITEM.pyApprox = cpItem({ H: 236, tLine: 'gen.py.together.approx', hint: 'gen.py.hint.approx', rLine: 'gen.py.reveal.approx', rSay: it => S('gen.py.v.' + pyKey(it.r), { append: true }), praise: 'praiseThink',
  make: s => { const r = +pyRt(s.a, s.b).toFixed(1), cands = [r, +(r - .1).toFixed(1), +(r + .1).toFixed(1)]; return { r, cands, want: pyKey(r), tag: 'py-approx' }; },   /* ثلاثة أعداد عشرية متجاورة: أيّها مربعه أقرب إلى مربع الوتر؟ فلا يُعرف الجواب بشكله (المراجع A لبوابة M4-U3/U4، 3) */
  draw(svg, item, tries) { const g = el('g', {}, svg), u = Math.min(60, 150 / item.b, 200 / item.a);
    if (item.rot) { const T = preRightTriPts(item.a, item.b, 60, { rot: item.rot, cen: [190, 150], box: [240, 120] }), cen = [(T.A[0] + T.B[0] + T.C[0]) / 3, (T.A[1] + T.B[1] + T.C[1]) / 3]; item._T = T;
      el('polygon', { points: polyStr([T.A, T.C, T.B]), fill: PY.fa, stroke: PY.ink, 'stroke-width': 3.2, 'stroke-linejoin': 'round', 'pointer-events': 'none' }, g); preRight(g, T.C, T.A, T.B, 12);
      preSegLab(g, T.A, T.C, cen, MS(String(item.a)), { fs: 16 }); preSegLab(g, T.C, T.B, cen, MS(String(item.b)), { fs: 16 }); preSegLab(g, T.A, T.B, cen, '؟', { col: PY.q, fs: 18 }); }
    else { const C = [250, 196], T = pyTri(g, C, item.a, item.b, u); item._T = T;
    preLab(g, (T.A[0] + C[0]) / 2, C[1] + 22, MS(String(item.a)), { fs: 16 }); preLab(g, C[0] + 14, (T.B[1] + C[1]) / 2 + 6, MS(String(item.b)), { fs: 16, anchor: 'start' }); preLab(g, (T.A[0] + T.B[0]) / 2 - 12, (T.A[1] + T.B[1]) / 2 - 8, '؟', { col: PY.q, fs: 18, anchor: 'end' }); }
    if (tries >= 3) ciEq(helpG(svg), 130, 40, `${item.a * item.a} + ${item.b * item.b} = ${item.a * item.a + item.b * item.b}`, PY.hl, 16); return {}; },
  h2: async (item, ctx) => { const m = helpG(ctx.svg), T = item._T; if (T) { hlSeg(m, T.A, T.C, H2C[0]); hlSeg(m, T.C, T.B, H2C[1]); hlRing(m, T.C, 18); }   /* المستوى الثاني رسمٌ: الضلعان القائمان */
    ciRule(m, 130, 40, labelText('pyRuleApprox'), PY.hl, 15); await sleep(FAST ? 10 : 250); },
  pick: item => choosePick(shuffle(item.cands.map(v => [pyKey(v), pyTxt(v), '<i></i>', 'gen.py.v.' + pyKey(v)])), item.want),
  errOf: () => 'pyOff' });

/* ================= ④ هل المثلث قائم؟ (C407 العكس): s ثلاثة أطوال ================= */
ITEM.pyIsRight = cpItem({ H: 236, tLine: 'gen.py.together.isRight', hint: 'gen.py.hint.isRight', rLine: it => 'gen.py.reveal.isRight.' + it.want, praise: 'praiseThink',
  make: s => { const [a, b, c] = [...s.s].sort((x, y) => x - y); return { want: a * a + b * b === c * c ? 'yes' : 'no', sq: [a * a, b * b, c * c], tag: 'py-isright' }; },
  draw(svg, item, tries) { const g = el('g', {}, svg), [a, b, c] = [...item.s].sort((x, y) => x - y), u = Math.min(22, 230 / c), P = cgTri(g, [c, a, b], { cx: 180, y: 180, u, rot: item.rot || 0 }); item._P = P;
    if (tries >= 3) ciEq(helpG(svg), 180, 36, `${item.sq[0]} + ${item.sq[1]} ؟ ${item.sq[2]}`, PY.hl, 18); return {}; },
  h2: async (item, ctx) => { const m = helpG(ctx.svg), P = item._P; if (P) { hlSeg(m, P[0], P[1], H2C[2]); hlRing(m, P[2], 18); }   /* المستوى الثاني رسمٌ: الأطول، والزاوية المقابلة له: أهي قائمة؟ */
    ciRule(m, 180, 36, labelText('pyRuleConv'), PY.hl, 15); await sleep(FAST ? 10 : 250); },
  pick: item => yesNo(item.want),
  errOf: (it, k) => k === 'no' ? 'pyConvNo' : Math.abs(it.sq[0] + it.sq[1] - it.sq[2]) <= 6 ? 'pyNear' : 'pyConvYes' });

/* ---------- براهين الوحدة: النظرية بالمربع ذي الضلع أ + ب، والعكس بالأضلاع الثلاثة، والعمودي أقصر ---------- */
Object.assign(PF_PROOFS, { pyth: { rs: ['sas', 'areaSum', 'algebra'] }, pyConv: { rs: ['draw2', 'pyth', 'sss'] }, perpPf: { rs: ['pyth', 'pos', 'so2'], alt: ['1,0,2'] } });
function pyFig(g, k, o = {}) { const y0 = o.y0 ?? 0, s = o.s || 1, T = (x, y) => [180 + (x - 180) * s, y0 + y * s];
  if (k === 'ladder') { const [h, a, b] = o.dims || [5, 3, 4], L = pyScene(g, 'ladder', h, a, b, { u: Math.min(26, 150 / b) });   /* dims: سلّمٌ آخر؛ askHyp: المجهول طول السلّم (المراجع A لبوابة M4-U3/U4، 7) */
    if (o.askHyp) { L.hyp.textContent = '؟'; L.hyp.setAttribute('fill', PY.q); L.q.textContent = ciTxt(b, 'm'); L.q.setAttribute('fill', PY.ink); L.q.setAttribute('font-size', 15); L.q.setAttribute('direction', 'rtl'); } return {}; }
  if (k === 'pyth') { const a = 28, b = 56, z = 1.3 * s, S2 = (a + b) * z, O = [180 - S2 / 2, y0 + 32], P = (x, y) => [O[0] + x * z, O[1] + y * z];
    el('rect', { x: O[0], y: O[1], width: S2, height: S2, fill: 'none', stroke: PY.ink, 'stroke-width': 3, 'pointer-events': 'none' }, g);
    const Q = [P(a, 0), P(a + b, a), P(b, a + b), P(0, b)]; el('polygon', { points: polyStr(Q), fill: PY.fc, stroke: PY.c, 'stroke-width': 2.6, 'pointer-events': 'none' }, g);
    for (const tri of [[P(0, 0), P(a, 0), P(0, b)], [P(a + b, 0), P(a + b, a), P(a, 0)], [P(a + b, a + b), P(b, a + b), P(a + b, a)], [P(0, a + b), P(0, b), P(b, a + b)]]) el('polygon', { points: polyStr(tri), fill: PY.fa, stroke: PY.a, 'stroke-width': 2, 'pointer-events': 'none' }, g);
    pfLab(g, (P(0, 0)[0] + P(a, 0)[0]) / 2, O[1] - 4, 'أ', { fs: 14 }); pfLab(g, (P(a, 0)[0] + P(a + b, 0)[0]) / 2, O[1] - 4, 'ب', { fs: 14 }); pfLab(g, (Q[0][0] + Q[1][0]) / 2 - 6, (Q[0][1] + Q[1][1]) / 2 + 14, 'ج', { fs: 14, col: PY.c }); return { O }; }
  if (k === 'pyConv') { cgTri(g, [5, 3, 4], { cx: 268, y: y0 + 100 * s, u: 18 * s, labels: false }); const R = cgTriPts([5, 3, 4], { cx: 92, y: y0 + 100 * s, u: 18 * s });
    el('polygon', { points: polyStr(R), fill: PY.fb, stroke: PY.b, 'stroke-width': 3, 'pointer-events': 'none' }, g); pfLab(g, 268, y0 + 30 * s + 6, labelText('pyGiven'), { fs: 13 }); pfLab(g, 92, y0 + 30 * s + 6, labelText('pyDrawn'), { fs: 13 }); return {}; }
  const y = y0 + 96 * s, N = T(140, 30), Qf = [N[0], y], R = T(276, 96); geoLine(g, T(30, 0)[0], y, T(330, 0)[0], y, { color: PY.road, w: 4 }); geoLine(g, N[0], N[1], Qf[0], Qf[1], { color: PY.a, w: 3.4, dash: '7 5' }); geoLine(g, N[0], N[1], R[0], R[1], { color: PY.c, w: 3.6 });
  preRight(g, Qf, N, R, 11); [N, Qf, R].forEach(P => pfDot(g, P)); pfLab(g, N[0] - 12, N[1] + 2, 'ن', { fs: 15 }); pfLab(g, Qf[0] - 10, y + 18, 'ق', { fs: 15 }); pfLab(g, R[0] + 10, y + 18, 'ر', { fs: 15 }); return {}; }

/* ================= المشاهد ================= */
const pySay = async (L, i) => { if (L[i]) await S(L[i]); };
/* د1 الإشعال: «الوتر سبعة»، والعدّ على الشبكة خمسة */
SCENES.pyHook = async c => { const L = c.lines, svg = m3Stage(250), g = el('g', { 'pointer-events': 'none' }, svg), u = 30, C = [250, 200], T = pyTri(g, C, 3, 4, u);
  for (let i = 0; i <= 8; i++) { geoLine(g, 40 + i * u, 50, 40 + i * u, 200, { color: PY.grid, w: 1 }); } for (let j = 0; j <= 5; j++) geoLine(g, 40, 50 + j * u, 280, 50 + j * u, { color: PY.grid, w: 1 });
  g.appendChild(g.firstChild); preLab(g, (T.A[0] + C[0]) / 2, C[1] + 22, MS('3'), { fs: 16 }); preLab(g, C[0] + 14, (T.B[1] + C[1]) / 2 + 6, MS('4'), { fs: 16, anchor: 'start' }); await pySay(L, 0);
  const t = preLab(g, (T.A[0] + T.B[0]) / 2 - 14, (T.A[1] + T.B[1]) / 2 - 8, MS('7'), { col: PY.q, fs: 18, anchor: 'end' }); await pySay(L, 1);
  for (let i = 1; i <= 5; i++) { const P = [T.A[0] + (T.B[0] - T.A[0]) * i / 5, T.A[1] + (T.B[1] - T.A[1]) * i / 5]; el('circle', { cx: P[0], cy: P[1], r: 5, fill: PY.c }, g); SFX.tick(); await sleep(FAST ? 1 : 220); }
  t.textContent = MS('5'); t.setAttribute('fill', PY.ok); for (const l of L.slice(2)) await S(l); };
/* د1 الاكتشاف (أ): المربعات 9 و16 و25 */
SCENES.pySqShow = async c => { const L = c.lines, svg = m3Stage(262), g = el('g', { 'pointer-events': 'none' }, svg), [a, b] = c.ab || [3, 4], Q = pySquares(g, [214, 140], a, b, 18, { hypCells: true });
  await pySay(L, 0); preLab(g, Q.mA[0], Q.mA[1] + 6, MS(String(a * a)), { col: PY.a, fs: 18 }); SFX.tick(); preLab(g, Q.mB[0], Q.mB[1] + 6, MS(String(b * b)), { col: PY.b, fs: 18 }); await pySay(L, 1);
  preLab(g, Q.mC[0], Q.mC[1] + 6, MS(String(a * a + b * b)), { col: PY.c, fs: 20 }); SFX.tick(); ciEq(g, 100, 236, `${a * a} + ${b * b} = ${a * a + b * b}`, PY.ok, 18); for (const l of L.slice(2)) await S(l); };
/* د3: المضخة على الطريق: كلما بعدت عن القدم طال الأنبوب، والعمودي أقصرها */
SCENES.pyPumpShow = async c => { const L = c.lines, svg = m3Stage(250); let g = el('g', { 'pointer-events': 'none' }, svg); const h = c.h || 12;
  for (const [i, d] of (c.ds || [9, 5, 0]).entries()) { g.remove(); g = el('g', { 'pointer-events': 'none' }, svg); const y = 200, u = 11, N = [130, y - h * u], R = [130 + d * u, y];
    geoLine(g, 20, y, 340, y, { color: PY.road, w: 5 }); if (d) { geoLine(g, N[0], N[1], N[0], y, { color: PY.a, w: 2.4, dash: '6 5' }); preRight(g, [N[0], y], N, R, 11); }
    geoLine(g, N[0], N[1], R[0], R[1], { color: d ? PY.c : PY.ok, w: 5 }); [N, R].forEach(P => pfDot(g, P)); const len = Math.sqrt(h * h + d * d);
    preLab(g, (N[0] + R[0]) / 2 + 14, (N[1] + R[1]) / 2, MS(String(+len.toFixed(1))), { col: d ? PY.c : PY.ok, fs: 17, anchor: 'start' }); SFX.tick(); await pySay(L, i); }
  for (const l of L.slice((c.ds || [0, 0, 0]).length)) await S(l); };
/* د4: السلّم والجدار، ثم السلّم ضعفه */
/* from وto: أجزاء المشهد، فالسلّم الأول قبل لعبة المشروع، والسلّم الضعف والتشابه بعدها (المراجع A لبوابة M4-U3/U4، 4: لا يحلّ المشهد خطوات الطفل قبله) */
SCENES.ladderShow = async c => { const L = c.lines, from = c.from || 0, to = c.to ?? 3, svg = m3Stage(250); let g = null;
  const parts = [() => pyScene(g, 'ladder', 5, 3, 4, { u: 30 }), () => pyScene(g, 'ladder', 10, 6, 8, { u: 17 }),
    () => { const t1 = preRightTri(g, [128, 200], 3, 4, 18), t2 = preRightTri(g, [330, 200], 6, 8, 18, { col: PRE.b, fill: PRE.fillB }); for (const t of [t1, t2]) { preArcs(g, t.A, t.C, t.B, 1); preArcs(g, t.B, t.A, t.C, 2); } }];
  for (let i = from; i < to; i++) { if (g) g.remove(); g = el('g', { 'pointer-events': 'none' }, svg); parts[i](); if (i > from) SFX.tick(); await pySay(L, i - from); }
  for (const l of L.slice(to - from)) await S(l); };
WRAP_ART.pythArt = svg => { const g = el('g', { 'pointer-events': 'none' }, svg); pySquares(g, [214, 150], 3, 4, 16); };
