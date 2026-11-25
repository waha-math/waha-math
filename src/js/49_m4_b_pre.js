/* =====================================================================
   بنود التشخيص الهندسي لبداية المرحلة 4 (المرجع reference/03_المناهج_والوحدات/M4_نظام_التقييم_المرحلة_4.md، أولاً)
   بندٌ لكل محور لم يُبنَ له بندٌ بعد: التطابق (C405) والتشابه (C406) وفيثاغورس (C407) والمسافة بين نقطتين (C410)
   والزاوية المحيطية (C412) وحجم الأسطوانة (C415) وجا 30 (C409) والانعكاس في المستوى الكامل (C420).
   هي النواة التي تبني عليها وحداتها (U3 إلى U9) بنودها، فتُكتب عامّةً بمواصفتها لا بالسؤال النموذجي وحده.
   ===================================================================== */
const PRE = { a: '#2f7fc1', b: '#d9822b', mk: '#c0392b', ink: '#24323a', q: '#c0392b', fillA: 'rgba(47,127,193,.14)', fillB: 'rgba(217,130,43,.16)', grid: '#dfe5ea', hl: SO.hl, ok: SO.ok };
const preNum = v => v < 0 ? '−' + MS(String(-v)) : MS(String(v));
/* نصّ مسمّى على الشكل: أبيض الحافة، لا يُلمس */
function preLab(parent, x, y, s, o = {}) { const t = el('text', { x, y, 'text-anchor': o.anchor || 'middle', 'font-size': o.fs || 17, 'font-weight': 800, fill: o.col || PRE.ink, stroke: '#fff', 'stroke-width': 4, 'paint-order': 'stroke', direction: o.dir || 'ltr', 'pointer-events': 'none' }, parent); t.textContent = s; return t; }
/* شرطات التساوي على ضلع، وأقواس التساوي في زاوية */
function preTicks(g, P, Q, n, col = PRE.mk) { const d = Math.hypot(Q[0] - P[0], Q[1] - P[1]), ux = (Q[0] - P[0]) / d, uy = (Q[1] - P[1]) / d, M = [(P[0] + Q[0]) / 2, (P[1] + Q[1]) / 2];
  for (let i = 0; i < n; i++) { const o = (i - (n - 1) / 2) * 6, c = [M[0] + ux * o, M[1] + uy * o]; geoLine(g, c[0] + uy * 8, c[1] - ux * 8, c[0] - uy * 8, c[1] + ux * 8, { color: col, w: 2.6 }); } }
const preDir = (V, A) => (Math.atan2(V[1] - A[1], A[0] - V[0]) * 180 / Math.PI + 360) % 360;
function preArcs(g, V, A, B, n, col = PRE.mk, r0 = 17) { let s = preDir(V, A), d = (preDir(V, B) - s + 360) % 360; if (d > 180) { s = preDir(V, B); d = 360 - d; }
  for (let i = 0; i < n; i++) el('path', { d: angArc(V, r0 + i * 5, s, s + d), fill: 'none', stroke: col, 'stroke-width': 2.4, 'pointer-events': 'none' }, g); return [s, s + d]; }
const preTri = (g, T, col, fill) => el('polygon', { points: polyStr(T), fill, stroke: col, 'stroke-width': 3.4, 'stroke-linejoin': 'round', 'pointer-events': 'none' }, g);
/* زاوية قائمة: مربّع صغير عند C بين اتجاهي A وB */
function preRight(g, C, A, B, s = 13) { const u = p => { const d = Math.hypot(p[0] - C[0], p[1] - C[1]); return [(p[0] - C[0]) / d * s, (p[1] - C[1]) / d * s]; }, a = u(A), b = u(B);
  el('path', { d: `M${C[0] + a[0]} ${C[1] + a[1]} L${C[0] + a[0] + b[0]} ${C[1] + a[1] + b[1]} L${C[0] + b[0]} ${C[1] + b[1]}`, fill: 'none', stroke: PRE.ink, 'stroke-width': 1.8, opacity: .7, 'pointer-events': 'none' }, g); }

/* ================= ① هل المثلثان متطابقان؟ (C405): case sas | sss | asa (نعم) · aaa | ssa (لا يكفي) =================
   العلامات المتشابهة قياسات متساوية: الشرطات للأضلاع والأقواس للزوايا */
const PRE_CASE_OK = { sas: 'yes', sss: 'yes', asa: 'yes', aaa: 'no', ssa: 'no' };
const PRE_CASE_V = [[[44, 192], [160, 192], [76, 86]], [[40, 188], [156, 192], [128, 84]], [[50, 176], [164, 196], [66, 90]], [[46, 190], [150, 180], [112, 80]], [[40, 172], [170, 192], [92, 94]]];   /* صور المثلث (v): مسألة جديدة بشكل آخر */
function preCaseTris(svg, cs, v = 0) { const g = el('g', { 'pointer-events': 'none' }, svg), A = PRE_CASE_V[v];
  const k = cs === 'aaa' ? .7 : 1, B = A.map(([x, y]) => [360 - x, y]);   /* الثاني صورة الأول بالمرآة، ومصغَّرٌ في «الزوايا وحدها» */
  const ctr = B.reduce((s, p) => [s[0] + p[0] / 3, s[1] + p[1] / 3], [0, 0]), B2 = B.map(([x, y]) => [ctr[0] + (x - ctr[0]) * k, ctr[1] + (y - ctr[1]) * k + (1 - k) * 40]);
  preTri(g, A, PRE.a, PRE.fillA); preTri(g, B2, PRE.b, PRE.fillB);
  for (const T of [A, B2]) { const [P, Q, R] = T;
    if (cs === 'sas') { preTicks(g, P, Q, 1); preTicks(g, P, R, 2); preArcs(g, P, Q, R, 1); }
    else if (cs === 'sss') { preTicks(g, P, Q, 1); preTicks(g, P, R, 2); preTicks(g, Q, R, 3); }
    else if (cs === 'asa') { preArcs(g, P, Q, R, 1); preTicks(g, P, Q, 1); preArcs(g, Q, P, R, 2); }
    else if (cs === 'aaa') { preArcs(g, P, Q, R, 1); preArcs(g, Q, P, R, 2); preArcs(g, R, P, Q, 3, PRE.mk, 14); }
    else { preTicks(g, P, Q, 1); preTicks(g, Q, R, 2); preArcs(g, P, Q, R, 1); } }
  return { g, A, B: B2 }; }
ITEM.cgCase = cpItem({ H: 236, tLine: 'gen.pre.together.case', hint: 'gen.pre.hint.case', rLine: it => 'gen.pre.reveal.case.' + it.want, praise: 'praiseThink',
  make: s => ({ want: PRE_CASE_OK[s.cs], tag: 'pre-case-' + s.cs }),
  draw(svg, item, tries) { const D = preCaseTris(svg, item.cs, item.v || 0); if (tries >= 3) ciRule(helpG(svg), 180, 30, labelText('preRuleCase'), PRE.hl, 13); return D; },
  h2: async (item, ctx) => { ciRule(helpG(ctx.svg), 180, 30, labelText('preRuleCase'), PRE.hl, 13); await sleep(FAST ? 10 : 250); },
  pick: item => yesNo(item.want),
  errOf: (it, k) => it.want === 'yes' ? 'preCaseNo' : it.cs === 'aaa' ? 'preCaseAaa' : 'preCaseSsa' });

/* ================= ② الضلع المجهول في المثلث المكبَّر (C406): s [ثلاثة أضلاع قائم، الأول أفقي والثاني رأسي]، k المعامل، ask رقم المجهول ================= */
function preRightTri(g, C, h, v, u, o = {}) { const A = [C[0] - h * u, C[1]], B = [C[0], C[1] - v * u]; preTri(g, [A, C, B], o.col || PRE.a, o.fill || PRE.fillA); preRight(g, C, A, B); return { A, B, C }; }
function preSideLabs(g, T, labs, cols) { const { A, B, C } = T, h = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2], d = Math.hypot(B[0] - A[0], B[1] - A[1]), nx = -(B[1] - A[1]) / d, ny = (B[0] - A[0]) / d;
  const P = [[(A[0] + C[0]) / 2, C[1] + 22], [C[0] + 16, (B[1] + C[1]) / 2 + 6], [h[0] - nx * 18 - 4, h[1] - ny * 18 + 4]];
  return labs.map((s, i) => preLab(g, P[i][0], P[i][1], s, { col: cols[i], anchor: i === 1 ? 'start' : i === 2 ? 'end' : 'middle' })); }
ITEM.simMiss = cpItem({ H: 250, tLine: 'gen.pre.together.sim', hint: 'gen.pre.hint.sim', rLine: 'gen.pre.reveal.sim', rSay: it => S(numw(it.want), { append: true }), num: true, praise: 'praiseThink',
  make: s => { const want = s.s[s.ask] * s.k, add = [0, 1, 2].filter(i => i !== s.ask).map(i => s.s[s.ask] + s.s[i] * (s.k - 1)), nums = [...new Set([want, ...add])];   /* الجمع بدل الضرب: يُزاد على المجهول ما زاده ضلعٌ آخر */
    for (let d = 1; nums.length < 3; d++) if (!nums.includes(want + d)) nums.push(want + d); return { want, add, nums: nums.slice(0, 3), tag: 'pre-sim' }; },
  draw(svg, item, tries) { const g = el('g', {}, svg), u = Math.min(15, 150 / (item.s[1] * item.k)), sm = preRightTri(g, [318, 204], item.s[0], item.s[1], u), bg = preRightTri(g, [214, 204], item.s[0] * item.k, item.s[1] * item.k, u, { col: PRE.b, fill: PRE.fillB });
    preSideLabs(g, sm, item.s.map(v => MS(String(v))), [PRE.ink, PRE.ink, PRE.ink]);
    const labs = preSideLabs(g, bg, item.s.map((v, i) => i === item.ask ? '؟' : MS(String(v * item.k))), item.s.map((v, i) => i === item.ask ? PRE.q : PRE.ink));
    if (tries >= 3) ciEq(helpG(svg), 110, 34, `${item.s[0] * item.k} ÷ ${item.s[0]} = ${item.k}`, PRE.hl, 17); return { q: labs[item.ask] }; },
  h2: async (item, ctx) => { ciRule(helpG(ctx.svg), 120, 34, labelText('preRuleSim'), PRE.hl, 13); await sleep(FAST ? 10 : 250); },
  show: async (item, ctx) => { if (ctx && ctx.q) { ctx.q.textContent = MS(String(item.want)); ctx.q.setAttribute('fill', PRE.ok); } },
  pick: (item, ctx) => { const np = numberPick(shuffle(item.nums), item.want, { west: true }); ctx.np = np; return np.p; },
  errOf: (it, k) => it.add.includes(k) ? 'preSimAdd' : 'preSimOff' });

/* ================= ③ الوتر (C407): a ضلع أفقي، b ضلع رأسي؛ الجواب √(a² + b²) عدد صحيح ================= */
ITEM.pyHyp = cpItem({ H: 250, tLine: 'gen.pre.together.py', hint: 'gen.pre.hint.py', rLine: 'gen.pre.reveal.py', rSay: it => S(numw(it.want), { append: true }), num: true, praise: 'praiseThink',
  make: s => { const want = Math.round(Math.hypot(s.a, s.b)); /*T*/if (TESTHOOK && want * want !== s.a * s.a + s.b * s.b) testBug('pyHyp: الوتر ليس عدداً صحيحاً');/*/T*/
    return { want, nums: [want, s.a + s.b, s.a * s.a + s.b * s.b <= 100 ? s.a * s.a + s.b * s.b : want + 2], tag: 'pre-py' }; },
  draw(svg, item, tries) { const g = el('g', {}, svg), u = Math.min(17, 150 / Math.max(item.a, item.b * 1.1)), T = preRightTri(g, [262, 206], item.a, item.b, u);
    const labs = preSideLabs(g, T, [MS(String(item.a)), MS(String(item.b)), '؟'], [PRE.ink, PRE.ink, PRE.q]);
    if (tries >= 3) ciEq(helpG(svg), 110, 34, `${item.a} × ${item.a} + ${item.b} × ${item.b} = ؟`, PRE.hl, 16); return { q: labs[2] }; },
  h2: async (item, ctx) => { ciRule(helpG(ctx.svg), 120, 34, labelText('preRulePy'), PRE.hl, 13); await sleep(FAST ? 10 : 250); },
  show: async (item, ctx) => { if (ctx && ctx.q) { ctx.q.textContent = MS(String(item.want)); ctx.q.setAttribute('fill', PRE.ok); } },
  pick: (item, ctx) => { const np = numberPick(shuffle(item.nums), item.want, { west: true }); ctx.np = np; return np.p; },
  errOf: (it, k) => k === it.a + it.b ? 'pyAdd' : k === it.a * it.a + it.b * it.b ? 'pyNoRoot' : 'pyOff' });

/* ================= ④ المسافة بين نقطتين ليستا على خط أفقي ولا رأسي (C410): a، b في الربع الأول ================= */
ITEM.coDist2 = cpItem({ H: 262, tLine: 'gen.pre.together.dist', hint: 'gen.pre.hint.dist', rLine: 'gen.pre.reveal.dist', rSay: it => S(numw(it.want), { append: true }), num: true, praise: 'praiseThink',
  make: s => { const dx = Math.abs(s.a[0] - s.b[0]), dy = Math.abs(s.a[1] - s.b[1]), want = Math.round(Math.hypot(dx, dy));
    /*T*/if (TESTHOOK && (want * want !== dx * dx + dy * dy || !dx || !dy)) testBug('coDist2: المسافة ليست عدداً صحيحاً أو النقطتان على خط');/*/T*/
    return { dx, dy, want, nums: [want, dx + dy, dx * dx + dy * dy], tag: 'pre-dist' }; },
  draw(svg, item, tries) { const n = Math.max(6, item.a[0], item.b[0]) + 1, m = Math.max(6, item.a[1], item.b[1]) + 1, Pl = coPlane(svg, { n, m, H: 262 }), A = Pl.P(...item.a), B = Pl.P(...item.b);
    geoLine(svg, A[0], A[1], B[0], B[1], { color: PRE.b, w: 3.4, dash: '8 5' });
    coDot(svg, Pl, ...item.a, { name: 'a', pair: true, fs: 13 }); coDot(svg, Pl, ...item.b, { name: 'b', pair: true, fs: 13 });
    if (tries >= 3) { const m2 = helpG(svg), K = Pl.P(item.b[0], item.a[1]); geoLine(m2, A[0], A[1], K[0], K[1], { color: PRE.hl, w: 3, dash: '5 4' }); geoLine(m2, K[0], K[1], B[0], B[1], { color: PRE.hl, w: 3, dash: '5 4' });
      preLab(m2, (A[0] + K[0]) / 2, A[1] + 22, MS(String(item.dx)), { col: PRE.hl }); preLab(m2, K[0] + 14, (K[1] + B[1]) / 2 + 6, MS(String(item.dy)), { col: PRE.hl, anchor: 'start' }); }
    return { Pl }; },
  h2: async (item, ctx) => { ciRule(helpG(ctx.svg), 180, 30, labelText('preRuleDist'), PRE.hl, 13); await sleep(FAST ? 10 : 250); },
  pick: (item, ctx) => { const np = numberPick(shuffle(item.nums), item.want, { west: true }); ctx.np = np; return np.p; },
  errOf: (it, k) => k === it.dx + it.dy ? 'coDistAdd' : k === it.dx * it.dx + it.dy * it.dy ? 'pyNoRoot' : 'coDistOff2' });

/* ================= ⑤ الزاوية المحيطية نصف المركزية (C412): c المركزية (زوجية، مضاعف 10)؛ المحيطية على القوس الأكبر ================= */
ITEM.ciInsc = cpItem({ H: 250, tLine: 'gen.pre.together.insc', hint: 'gen.pre.hint.insc', rLine: 'gen.pre.reveal.insc', rSay: it => sayDeg(it.want), num: true, praise: 'praiseThink',
  sayQ: async it => { await sayDeg(it.c); await S('gen.pre.q.inscEnd', { append: true }); },
  make: s => ({ want: s.c / 2, nums: [s.c / 2, s.c, 2 * s.c], tag: 'pre-insc' }),
  draw(svg, item, tries) { const g = el('g', {}, svg), O = [180, 126], R = 80, A = angP(O, 270 - item.c / 2, R), B = angP(O, 270 + item.c / 2, R), P = angP(O, 90, R);
    el('circle', { cx: O[0], cy: O[1], r: R, fill: '#f6fbf4', stroke: PRE.ink, 'stroke-width': 3, 'pointer-events': 'none' }, g);
    el('path', { d: angArc(O, R, 270 - item.c / 2, 270 + item.c / 2), fill: 'none', stroke: PRE.b, 'stroke-width': 6, 'stroke-linecap': 'round', 'pointer-events': 'none' }, g);
    for (const X of [A, B]) { geoLine(g, O[0], O[1], X[0], X[1], { color: PRE.a, w: 3 }); geoLine(g, P[0], P[1], X[0], X[1], { color: AR.tr, w: 3 }); }
    arArc(g, O, 270 - item.c / 2, 270 + item.c / 2, { r: 22, col: PRE.a, deg: item.c, dl: 18, fs: 15, fill: true });
    const q = arArc(g, P, 270 - item.c / 4, 270 + item.c / 4, { r: 28, col: AR.q, lab: '؟', dl: 16, fs: 16, fill: true });
    for (const X of [O, A, B, P]) el('circle', { cx: X[0], cy: X[1], r: 4.5, fill: ANG.v, stroke: '#fff', 'stroke-width': 2, 'pointer-events': 'none' }, g);
    if (tries >= 3) ciEq(helpG(svg), 180, 236, `${item.c} ÷ 2 = ؟`, PRE.hl, 16); return { q }; },
  h2: async (item, ctx) => { ciRule(helpG(ctx.svg), 180, 236, labelText('preRuleInsc'), PRE.hl, 13); await sleep(FAST ? 10 : 250); },
  show: async (item, ctx) => { if (ctx && ctx.q) arSetDeg(ctx.q, item.want, PRE.ok); },
  pick: (item, ctx) => { const np = numberPick(shuffle(item.nums), item.want, { west: true, word: degw }); ctx.np = np; return np.p; },
  errOf: (it, k) => k === it.c ? 'inscSame' : k === 2 * it.c ? 'inscDouble' : 'inscOff' });

/* ================= ⑥ حجم الأسطوانة (C415): r، h، u؛ ch [[الصحيح]، [قيمة، وسم]…]، و«باي» 3.14 مكتوبٌ ومسموع ================= */
function preCyl(svg, item) { const g = el('g', { 'pointer-events': 'none' }, svg), cx = 190, top = 66, bot = 196, rx = 66, ry = 17;
  el('path', { d: `M${cx - rx} ${top} L${cx - rx} ${bot} A${rx} ${ry} 0 0 0 ${cx + rx} ${bot} L${cx + rx} ${top}`, fill: '#e6eef6', stroke: PRE.a, 'stroke-width': 3 }, g);
  el('path', { d: `M${cx - rx} ${bot} A${rx} ${ry} 0 0 1 ${cx + rx} ${bot}`, fill: 'none', stroke: PRE.a, 'stroke-width': 2, 'stroke-dasharray': '5 4', opacity: .7 }, g);
  el('ellipse', { cx, cy: top, rx, ry, fill: '#f4f8fc', stroke: PRE.a, 'stroke-width': 3 }, g);
  geoLine(g, cx, top, cx + rx, top, { color: CI.r, w: 3.4 }); el('circle', { cx, cy: top, r: 4, fill: PRE.ink }, g);
  preLab(g, cx + rx / 2, top - ry - 7, ciTxt(item.r, item.u), { col: CI.r, fs: 15, dir: 'rtl' });
  geoLine(g, cx - rx - 22, top, cx - rx - 22, bot, { color: PRE.ink, w: 2.4 }); geoArrow(g, cx - rx - 22, top, -90, PRE.ink, 7); geoArrow(g, cx - rx - 22, bot, 90, PRE.ink, 7);
  preLab(g, cx - rx - 30, (top + bot) / 2 + 6, ciTxt(item.h, item.u), { fs: 15, anchor: 'start', dir: 'rtl' });   /* في النصّ العربي «البداية» يمينه: يمتدّ يساراً عن السهم */
  ciPi(g, 58, 232, .34, PRE.ink); preLab(g, 72, 238, '= ' + MS('3.14'), { fs: 15, anchor: 'start' }); return g; }
ITEM.cylVol = cpItem({ H: 250, tLine: 'gen.pre.together.cyl', hint: 'gen.pre.hint.cyl', rLine: 'gen.ci.reveal.calc', rSay: it => S(voLine(it.want, it.u + '3'), { append: true }), praise: 'praiseThink',
  make: s => ({ want: s.ch[0][0], tag: 'pre-cyl' }),
  draw(svg, item, tries) { preCyl(svg, item); if (tries >= 3) ciEq(helpG(svg), 270, 238, `3.14 × ${item.r} × ${item.r} × ${item.h}`, PRE.hl, 15); return {}; },
  h2: async (item, ctx) => { ciRule(helpG(ctx.svg), 180, 30, labelText('preRuleCyl'), PRE.hl, 13); await sleep(FAST ? 10 : 250); },
  pick: item => choosePick(shuffle(item.ch.map(([v]) => [String(v), voTxt(v, item.u + '3'), '<i></i>', voLine(v, item.u + '3')])), String(item.want)),
  errOf: (it, k) => (it.ch.find(([v]) => String(v) === k) || [])[1] || 'cylOff' });
ITEM.cylVol.judge = (item, k) => k === String(item.want) ? { ok: true } : { ok: false, err: (item.ch.find(([v]) => String(v) === k) || [])[1] || 'cylOff' };

/* ================= ⑦ جا الزاوية من المثلث القائم (C409): deg 30؛ الوتر 2 والمقابل 1 مكتوبان ================= */
const PRE_TG = { '0.5': 'half', '2': 'two', '1': 'one' };
ITEM.trigVal = cpItem({ H: 250, tLine: 'gen.pre.together.tg', hint: 'gen.pre.hint.tg', rLine: 'gen.pre.reveal.tg', praise: 'praiseThink',
  make: s => ({ want: '0.5', tag: 'pre-tg-' + s.deg }),
  draw(svg, item, tries) { const g = el('g', {}, svg), A = [56, 200], C = [300, 200], B = [300, 200 - 244 * Math.tan(item.deg * Math.PI / 180)];
    preTri(g, [A, C, B], PRE.a, PRE.fillA); preRight(g, C, A, B); arArc(g, A, 0, item.deg, { r: 46, col: PRE.b, deg: item.deg, dl: 18, fs: 15 });
    preLab(g, C[0] + 14, (B[1] + C[1]) / 2 + 6, MS('1'), { anchor: 'start' }); const h = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2]; preLab(g, h[0] - 8, h[1] - 12, MS('2'));
    const t = el('g', { 'pointer-events': 'none' }, svg); preLab(t, 210, 44, labelText('preSin'), { dir: 'rtl', fs: 19 }); degText(t, 176, 44, item.deg, { size: 19, color: PRE.ink }); preLab(t, 138, 44, '؟ =', { fs: 19 });   /* يُقرأ من اليمين: جا ٣٠ = ؟ */
    if (tries >= 3) ciEq(helpG(svg), 180, 236, '1 ÷ 2', PRE.hl, 17); return {}; },
  h2: async (item, ctx) => { ciRule(helpG(ctx.svg), 180, 236, labelText('preRuleTg'), PRE.hl, 13); await sleep(FAST ? 10 : 250); },
  pick: item => choosePick(shuffle(Object.entries(PRE_TG).map(([v, w]) => [v, MS(v), '<i></i>', 'gen.pre.tg.' + w])), item.want),
  errOf: (it, k) => k === '2' ? 'tgInv' : 'tgOff' });

/* ================= ⑧ صورة نقطة في المستوى الكامل (C420): p [x، y]، xf refV | refH | rot90 (عكس عقارب الساعة حول الأصل) ================= */
const PRE_XF = { refV: ([x, y]) => [-x, y], refH: ([x, y]) => [x, -y], rot90: ([x, y]) => [-y, x] };
const preKey = ([x, y]) => (x < 0 ? 'm' + -x : '' + x) + '_' + (y < 0 ? 'm' + -y : '' + y);
function prePlane4(svg, o = {}) { const n = o.n || 5, c = o.c || 19, C = o.C || [180, 128], g = el('g', { 'pointer-events': 'none' }, svg), P = (x, y) => [C[0] + x * c, C[1] - y * c];
  el('rect', { x: C[0] - n * c - 14, y: C[1] - n * c - 14, width: 2 * n * c + 28, height: 2 * n * c + 28, rx: 10, fill: '#fffdf6', stroke: PRE.grid, 'stroke-width': 2 }, g);
  for (let i = -n; i <= n; i++) { geoLine(g, C[0] + i * c, C[1] - n * c, C[0] + i * c, C[1] + n * c, { color: PRE.grid, w: 1.2 }); geoLine(g, C[0] - n * c, C[1] + i * c, C[0] + n * c, C[1] + i * c, { color: PRE.grid, w: 1.2 }); }
  geoLine(g, C[0] - n * c - 8, C[1], C[0] + n * c + 8, C[1], { color: o.hl === 'h' ? PRE.b : PRE.ink, w: o.hl === 'h' ? 4 : 2.6 }); geoLine(g, C[0], C[1] + n * c + 8, C[0], C[1] - n * c - 8, { color: o.hl === 'v' ? PRE.b : PRE.ink, w: o.hl === 'v' ? 4 : 2.6 });
  for (const k of [-4, -2, 2, 4]) { preLab(g, C[0] + k * c, C[1] + 15, preNum(k), { fs: 10 }); preLab(g, C[0] - 9, C[1] - k * c + 4, preNum(k), { fs: 10, anchor: 'end' }); }
  el('circle', { cx: C[0], cy: C[1], r: 3.5, fill: PRE.ink }, g); return { g, P, C, c, n }; }
ITEM.xf4Pick = cpItem({ H: 262, tLine: 'gen.pre.together.xf4', hint: 'gen.pre.hint.xf4', rLine: 'gen.pre.reveal.xf4', praise: 'praiseThink',
  make: s => { const [x, y] = s.p, img = PRE_XF[s.xf](s.p), alt = { refV: [[x, -y], [-x, -y]], refH: [[-x, y], [-x, -y]], rot90: [[y, -x], [-x, -y], [-x, y]] }[s.xf];   /* المحور الآخر، وعكس الإشارتين، والدوران بالاتجاه الآخر */
    const cands = [img, ...alt, [-y, x]].filter((p, i, X) => X.findIndex(q => q[0] === p[0] && q[1] === p[1]) === i && !(p[0] === s.p[0] && p[1] === s.p[1])).slice(0, 3);
    return { want: preKey(img), img, cands, tag: 'pre-xf4-' + s.xf }; },
  draw(svg, item, tries) { const Pl = prePlane4(svg, { hl: item.xf === 'refV' ? 'v' : item.xf === 'refH' ? 'h' : null }), p = Pl.P(...item.p);
    el('circle', { cx: p[0], cy: p[1], r: 6.5, fill: CO.pt, stroke: '#fff', 'stroke-width': 2, 'pointer-events': 'none' }, svg); coPairText(svg, p[0], p[1] + (item.p[1] < 0 ? 22 : -12), preNum(item.p[0]), preNum(item.p[1]), 'middle', 13);
    if (tries >= 3) { const q = Pl.P(...item.img); el('circle', { cx: q[0], cy: q[1], r: 9, fill: 'none', stroke: PRE.hl, 'stroke-width': 3, 'stroke-dasharray': '4 3', 'pointer-events': 'none' }, helpG(svg)); }
    return { Pl }; },
  h2: async (item, ctx) => { ciRule(helpG(ctx.svg), 180, 30, labelText('preRuleXf4.' + item.xf), PRE.hl, 13); await sleep(FAST ? 10 : 250); },
  show: async (item, ctx) => { if (ctx && ctx.Pl) { const q = ctx.Pl.P(...item.img); el('circle', { cx: q[0], cy: q[1], r: 6.5, fill: PRE.ok, stroke: '#fff', 'stroke-width': 2, 'pointer-events': 'none' }, helpG(ctx.svg)); } },
  pick: item => choosePick(shuffle(item.cands.map(p => [preKey(p), coPair(preNum(p[0]), preNum(p[1])), '<i></i>', 'gen.pre.pt.' + preKey(p)])), item.want),
  errOf: (it, k) => { const [x, y] = it.p; return k === preKey([x, -y]) || k === preKey([-x, y]) ? 'xf4Axis' : k === preKey([-x, -y]) ? 'xf4Both' : it.xf === 'rot90' && k === preKey([y, -x]) ? 'xf4Dir' : 'xf4Off'; } });
