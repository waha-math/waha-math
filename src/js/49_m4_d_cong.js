/* =====================================================================
   M4-U3 «التطابق والتشابه» (المرحلة 4، المرجع reference/03_المناهج_والوحدات/M4_U3_التطابق_والتشابه.md، نسخة 1.2)
   د1 التطابق بثلاثة أضلاع SSS وتعليله بالإنشاء (C405 أ) · د2 SAS مسلّمةً وASA مبرهنةً منها، والزاوية المحصورة (C405 ب) · د3 التشابه بمعامل والضلع المجهول (C406)
   د4 براهين خصائص الرباعيات بالتطابق (C421 أ) · د5 العكس: تصنيف الرباعي من أقطاره، والشمول، وتعميم ½ × ق₁ × ق₂ (C421 ب)
   (د4 في المرجع ثماني أفكار فوق السقف، فقُسِم درسين كما في D248) · د6 مشروع «خريطة مكبّرة» · د7 «محكمة التطابق»: المراجعة والاختبار (14)
   التطابق والتشابه يُقبلان بالبرهان لا بالقياس (D134)، والخط بلا «≅» ولا «∥»: يُكتبان كلمةً.
   ===================================================================== */
const CG = { a: '#2f7fc1', b: '#d9822b', c: '#7a4fb0', ink: '#24323a', fa: 'rgba(47,127,193,.14)', fb: 'rgba(217,130,43,.16)', fc: 'rgba(122,79,176,.12)', q: '#c0392b', card: '#fffdf6', edge: '#c9d6df', hl: SO.hl, ok: SO.ok };
/* مثلث بأطوال أضلاعه [القاعدة، الأيمن، الأيسر]، قاعدته أفقية مركزها (cx، y)؛ rot دوران حول المركز، flip مرآة */
function cgTriPts(s, o = {}) { const [a, b, c] = s, u = o.u || 12, x = (a * a + c * c - b * b) / (2 * a), h = Math.sqrt(Math.max(0, c * c - x * x)), P = [[-a / 2, 0], [a / 2, 0], [x - a / 2, -h]].map(([X, Y]) => [X * u * (o.flip ? -1 : 1), Y * u]);
  const ctr = [0, -h * u / 3], r = (o.rot || 0) * Math.PI / 180, cs = Math.cos(r), sn = Math.sin(r);
  return P.map(([X, Y]) => { const dx = X - ctr[0], dy = Y - ctr[1]; return [(o.cx ?? 180) + ctr[0] + dx * cs - dy * sn, (o.y ?? 180) + ctr[1] + dx * sn + dy * cs]; }); }
function cgTri(g, s, o = {}) { const P = cgTriPts(s, o); el('polygon', { points: polyStr(P), fill: o.fill || CG.fa, stroke: o.col || CG.a, 'stroke-width': 3.2, 'stroke-linejoin': 'round', 'pointer-events': 'none' }, g);
  const C = [(P[0][0] + P[1][0] + P[2][0]) / 3, (P[0][1] + P[1][1] + P[2][1]) / 3], sides = [[0, 1, s[0]], [1, 2, s[1]], [2, 0, s[2]]];
  P.labs = []; if (o.labels !== false) sides.forEach(([i, j, v], n) => { const M = [(P[i][0] + P[j][0]) / 2, (P[i][1] + P[j][1]) / 2], d = Math.hypot(M[0] - C[0], M[1] - C[1]) || 1, L = [M[0] + (M[0] - C[0]) / d * 13, M[1] + (M[1] - C[1]) / d * 13 + 5];
    const t = el('text', { x: L[0], y: L[1], 'text-anchor': 'middle', 'font-size': o.fs || 14, 'font-weight': 800, fill: o.labCol && o.labCol[n] || CG.ink, stroke: '#fff', 'stroke-width': 3.5, 'paint-order': 'stroke', 'pointer-events': 'none' }, g); t.textContent = o.ask === n ? '؟' : MS(String(v)); if (o.ask === n) t.setAttribute('fill', CG.q); P.labs.push(t); });
  return P; }
const cgSorted = s => [...s].sort((x, y) => x - y);
const cgRel = (a, b) => { const A = cgSorted(a), B = cgSorted(b), k = B[0] / A[0]; return A.every((v, i) => v === B[i]) ? 'cong' : A.every((v, i) => Math.abs(B[i] - v * k) < 1e-9) ? 'sim' : 'none'; };

/* ================= ① مثلثان بأطوال أضلاعهما: متطابقان أم متشابهان فقط أم لا هذا ولا ذاك؟ (C405، C406): a، b، rot ================= */
ITEM.cgSides = cpItem({ H: 236, tLine: 'gen.cg.together.sides', hint: 'gen.cg.hint.sides', rLine: it => 'gen.cg.reveal.sides.' + it.want, praise: 'praiseThink',
  make: s => ({ want: cgRel(s.a, s.b), tag: 'cg-sides' }),
  draw(svg, item, tries) { const g = el('g', {}, svg), mx = Math.max(...item.a, ...item.b), u = Math.min(14, 140 / mx);
    cgTri(g, item.a, { cx: 268, y: 172, u }); cgTri(g, item.b, { cx: 92, y: 172, u, rot: item.rot || 0, flip: !!item.flip, col: CG.b, fill: CG.fb });
    if (tries >= 3) { const A = cgSorted(item.a), B = cgSorted(item.b), m = helpG(svg); A.forEach((v, i) => ciEq(m, 180, 40 + i * 22, `${B[i]} ÷ ${v} = ${+(B[i] / v).toFixed(2)}`, CG.hl, 15)); } return {}; },
  h2: async (item, ctx) => { ciRule(helpG(ctx.svg), 180, 30, labelText('cgRuleSides'), CG.hl, 15); await sleep(FAST ? 10 : 250); },
  pick: item => choosePick(['cong', 'sim', 'none'].map(k => [k, labelText('cgK.' + k), '<i></i>', 'gen.cg.k.' + k]), item.want),
  errOf: (it, k) => it.want === 'sim' && k === 'cong' ? 'cgSimAsCong' : it.want === 'cong' && k === 'sim' ? 'cgCongAsSim' : k === 'none' ? 'cgMissed' : 'cgFalse' });

/* ================= ② القطع المتطابقة (C405): orig أضلاع الأصل، cands [ثلاث ثلاثيات، الأولى المطابقة]، rots ================= */
ITEM.cgPick = cpItem({ H: 262, tLine: 'gen.cg.together.pick', hint: 'gen.cg.hint.pick', rLine: 'gen.cg.reveal.pick', praise: 'praiseThink',
  make: s => { const order = shuffle([0, 1, 2]); /*T*/if (TESTHOOK && s.cands.filter(c => cgRel(s.orig, c) === 'cong').length !== 1) testBug('cgPick: ليست ثلاثية واحدة مطابقة');/*/T*/ return { order, want: String(order.indexOf(0)), tag: 'cg-pick' }; },
  draw(svg, item, tries) { const g = el('g', {}, svg), mx = Math.max(...item.cands.flat()), u = Math.min(10, 80 / mx), uo = Math.min(11, 62 / Math.max(...item.orig)), X = [292, 180, 68];
    cgTri(g, item.orig, { cx: 196, y: 88, u: uo, col: CG.c, fill: CG.fc }); preLab(g, 318, 40, labelText('cgOrig'), { dir: 'rtl', fs: 15, anchor: 'start' });
    item.order.forEach((ci, pos) => { el('rect', { x: X[pos] - 54, y: 104, width: 108, height: 126, rx: 12, fill: CG.card, stroke: CG.edge, 'stroke-width': 2, 'pointer-events': 'none' }, g);
      preLab(g, X[pos], 124, labelText('pfSet.' + pos), { dir: 'rtl', fs: 13 }); cgTri(g, item.cands[ci], { cx: X[pos], y: 206, u, rot: (item.rots || [30, -20, 15])[pos], col: CG.a, fill: CG.fa, fs: 13 }); });
    if (tries >= 3) ciRule(helpG(svg), 180, 244, labelText('cgRuleSss'), CG.hl, 15); return {}; },
  h2: async (item, ctx) => { ciRule(helpG(ctx.svg), 180, 244, labelText('cgRuleSss'), CG.hl, 15); await sleep(FAST ? 10 : 250); },
  pick: item => choosePick([0, 1, 2].map(p => [String(p), labelText('pfSet.' + p), '<i></i>', 'gen.pf.set.' + p]), item.want),
  errOf: (it, k) => cgRel(it.orig, it.cands[it.order[+k]]) === 'sim' ? 'cgSimAsCong' : 'cgSideOff' });

/* ================= ③ هل الشكلان متشابهان؟ (C406): fig rect | sq | tri، a وb أبعادهما ================= */
function simShape(g, fig, d, o) { const u = o.u, cx = o.cx, y = o.y;
  if (fig === 'tri') return cgTri(g, d, { cx, y, u, col: o.col, fill: o.fill });
  const w = d[0] * u, h = (fig === 'sq' ? d[0] : d[1]) * u, P = [[cx - w / 2, y], [cx + w / 2, y], [cx + w / 2, y - h], [cx - w / 2, y - h]];
  el('polygon', { points: polyStr(P), fill: o.fill, stroke: o.col, 'stroke-width': 3.2, 'pointer-events': 'none' }, g);
  preLab(g, cx, y + 18, MS(String(d[0])), { fs: 14 }); if (fig !== 'sq') preLab(g, cx + w / 2 + 6, y - h / 2 + 5, MS(String(d[1])), { fs: 14, anchor: 'start' });
  for (const Q of P) el('path', { d: `M${Q[0] + (Q[0] < cx ? 9 : -9)} ${Q[1]} L${Q[0] + (Q[0] < cx ? 9 : -9)} ${Q[1] + (Q[1] < y ? 9 : -9)} L${Q[0]} ${Q[1] + (Q[1] < y ? 9 : -9)}`, fill: 'none', stroke: CG.ink, 'stroke-width': 1.4, opacity: .6, 'pointer-events': 'none' }, g); return P; }
ITEM.simYN = cpItem({ H: 236, tLine: 'gen.cg.together.simYN', hint: 'gen.cg.hint.simYN', rLine: it => 'gen.cg.reveal.simYN.' + it.want, praise: 'praiseThink',
  make: s => { const A = s.fig === 'sq' ? [s.a[0], s.a[0]] : s.a, B = s.fig === 'sq' ? [s.b[0], s.b[0]] : s.b, k = B[0] / A[0], ok = s.fig === 'tri' ? cgRel(s.a, s.b) !== 'none' : A.every((v, i) => Math.abs(B[i] - v * k) < 1e-9); return { want: ok ? 'yes' : 'no', tag: 'sim-yn-' + s.fig }; },
  draw(svg, item, tries) { const g = el('g', {}, svg), mx = Math.max(...item.a, ...item.b), u = Math.min(22, 130 / mx);
    simShape(g, item.fig, item.a, { cx: 262, y: 186, u, col: CG.a, fill: CG.fa }); simShape(g, item.fig, item.b, { cx: 96, y: 186, u, col: CG.b, fill: CG.fb });
    if (tries >= 3) { const A = item.fig === 'tri' ? cgSorted(item.a) : item.a, B = item.fig === 'tri' ? cgSorted(item.b) : item.b, m = helpG(svg); A.forEach((v, i) => ciEq(m, 180, 36 + i * 22, `${B[i]} ÷ ${v} = ${+(B[i] / v).toFixed(2)}`, CG.hl, 15)); } return {}; },
  h2: async (item, ctx) => { ciRule(helpG(ctx.svg), 180, 30, labelText('cgRuleSim'), CG.hl, 15); await sleep(FAST ? 10 : 250); },
  pick: item => yesNo(item.want),
  errOf: (it, k) => k === 'yes' ? 'simAnglesOnly' : 'simNo' });

/* ================= ④ الرباعي من قطريه (C421 ب): info { mid، eq، perp } بطاقاتٍ؛ الجواب اسمه، أو «لا نعرف» (شبه المنحرف متساوي الساقين قطراه متساويان) ================= */
const QD_OF = i => i.mid ? (i.eq && i.perp ? 'square' : i.eq ? 'rect' : i.perp ? 'rhom' : 'para') : 'unk';
ITEM.quadDiag = cpItem({ H: 220, tLine: 'gen.cg.together.qd', hint: 'gen.cg.hint.qd', rLine: it => 'gen.cg.reveal.qd.' + it.want, praise: 'praiseThink',
  make: s => ({ want: QD_OF(s.info), tag: 'quad-diag' }),
  draw(svg, item, tries) { const g = el('g', { 'pointer-events': 'none' }, svg); ['mid', 'eq', 'perp'].forEach((k, i) => { const y = 34 + i * 52, on = !!item.info[k];
      el('rect', { x: 34, y, width: 292, height: 42, rx: 10, fill: on ? 'rgba(47,157,107,.10)' : '#f6f2ea', stroke: on ? CG.ok : CG.edge, 'stroke-width': 2 }, g);
      preLab(g, 312, y + 27, labelText('qdInfo.' + k), { dir: 'rtl', fs: 15, anchor: 'start' }); preLab(g, 62, y + 28, on ? labelText('qdYes') : labelText('qdNo'), { dir: 'rtl', fs: 15, col: on ? CG.ok : '#8a7f6e' }); });
    if (tries >= 3) ciRule(helpG(svg), 180, 204, labelText('cgRuleQd'), CG.hl, 15); return {}; },
  h2: async (item, ctx) => { ciRule(helpG(ctx.svg), 180, 204, labelText('cgRuleQd'), CG.hl, 15); await sleep(FAST ? 10 : 250); },
  pick: item => choosePick(item.cands.map(k => [k, labelText('qdName.' + k), '<i></i>', 'gen.cg.qd.' + k]), item.want),
  errOf: (it, k) => it.want === 'unk' ? 'qdEqOnly' : k === 'para' ? 'qdMissProp' : k === 'unk' ? 'qdNoConv' : 'qdWrongName' });

/* ================= ⑤ مساحة رباعي محدّب قطراه متعامدان (C421 ب): القطر الأفقي x1 + x2 (x1 يسار التقاطع)، والرأسي y1 + y2 (y1 فوقه)؛ لا c في المواصفة (وسم المفهوم) ================= */
ITEM.perpArea = cpItem({ H: 250, tLine: 'gen.cg.together.perp', hint: 'gen.cg.hint.perp', rLine: 'gen.cg.reveal.perp', rSay: it => S(bigw(it.want), { append: true }), num: true, praise: 'praiseThink',
  make: s => { const p = s.x1 + s.x2, r = s.y1 + s.y2, A = p * r / 2; /*T*/if (TESTHOOK && (!Number.isInteger(A) || A > 100)) testBug('perpArea: المساحة ليست عدداً صحيحاً حتى مئة');/*/T*/ return { p, r, want: A, nums: [A, p * r, p + r].filter((v, i, X) => X.indexOf(v) === i).concat([A + 5]).slice(0, 3), tag: 'perp-area' }; },
  draw(svg, item, tries) { const g = el('g', { 'pointer-events': 'none' }, svg), u = Math.min(17, 260 / item.p, 96 / Math.max(item.y1, item.y2)), L = [180 - item.p * u / 2, 118], M = [L[0] + item.x1 * u, 118], R = [L[0] + item.p * u, 118], T = [M[0], 118 - item.y1 * u], B = [M[0], 118 + item.y2 * u];
    el('polygon', { points: polyStr([L, T, R, B]), fill: CG.fc, stroke: CG.ink, 'stroke-width': 3.2, 'stroke-linejoin': 'round' }, g);
    geoLine(g, L[0], L[1], R[0], R[1], { color: CG.a, w: 3, dash: '7 4' }); geoLine(g, T[0], T[1], B[0], B[1], { color: CG.b, w: 3, dash: '7 4' });
    el('path', { d: `M${M[0] + 10} ${M[1]} L${M[0] + 10} ${M[1] - 10} L${M[0]} ${M[1] - 10}`, fill: 'none', stroke: CG.ink, 'stroke-width': 1.6 }, g);
    preLab(g, (L[0] + R[0]) / 2 + 30, M[1] + 22, MS(String(item.p)), { col: CG.a, fs: 15 }); preLab(g, M[0] + 14, (T[1] + M[1]) / 2, MS(String(item.r)), { col: CG.b, fs: 15, anchor: 'start' });
    if (tries >= 3) ciEq(helpG(svg), 180, 238, `${item.p} × ${item.r} ÷ 2 = ؟`, CG.hl, 17); return {}; },
  h2: async (item, ctx) => { ciRule(helpG(ctx.svg), 180, 236, labelText('cgRulePerp'), CG.hl, 15); await sleep(FAST ? 10 : 250); },
  pick: (item, ctx) => { const np = numberPick(shuffle(item.nums), item.want, { west: true }); ctx.np = np; return np.p; },
  errOf: (it, k) => k === it.p * it.r ? 'dgNoHalf' : k === it.p + it.r ? 'dgSum' : 'a2AreaOff' });

/* ---------- براهين الرباعيات (C421): الشكل وخطواته الثلاث، تُضاف إلى براهين الوحدة السابقة ---------- */
Object.assign(PF_PROOFS, {
  paraSide: { rs: ['alt', 'alt', 'asa'], alt: ['1,0,2'] }, paraDiag: { rs: ['alt', 'oppSides', 'asa'], alt: ['1,0,2'] },
  rectDiag: { rs: ['oppSides', 'rectDef', 'sas'], alt: ['1,0,2'] }, rhombDiag: { rs: ['rhomb', 'sss', 'cpct'] }, conv: { rs: ['given', 'sas', 'altConv'] } });
const CG_QUAD = { para: [[70, 112], [236, 112], [292, 28], [126, 28]], rect: [[70, 112], [292, 112], [292, 28], [70, 28]], rhom: [[60, 70], [180, 118], [300, 70], [180, 22]] };
function cgQuad(g, k, o = {}) { const y0 = o.y0 ?? 0, s = o.s || 1, P = CG_QUAD[k === 'rhombDiag' ? 'rhom' : k === 'rectDiag' ? 'rect' : 'para'].map(([x, y]) => [180 + (x - 180) * s, y0 + y * s]), [A, B, C, D] = P, M = [(A[0] + C[0]) / 2, (A[1] + C[1]) / 2];
  el('polygon', { points: polyStr(P), fill: 'rgba(47,127,193,.08)', stroke: CG.ink, 'stroke-width': 3.2, 'stroke-linejoin': 'round', 'pointer-events': 'none' }, g);
  geoLine(g, A[0], A[1], C[0], C[1], { color: CG.c, w: 2.6 }); if (k !== 'paraSide') geoLine(g, B[0], B[1], D[0], D[1], { color: CG.c, w: 2.6 });
  if (k === 'paraSide') { pfAng(g, A, B, C, { col: CG.a, r: 22 }); pfAng(g, C, D, A, { col: CG.a, r: 22 }); pfAng(g, C, A, B, { col: CG.b, r: 30 }); pfAng(g, A, C, D, { col: CG.b, r: 30 }); }
  if (k === 'paraDiag' || k === 'conv') { pfAng(g, A, B, M, { col: CG.a, r: 22 }); pfAng(g, C, D, M, { col: CG.a, r: 22 }); if (k === 'paraDiag') { pfAng(g, B, M, A, { col: CG.b, r: 20 }); pfAng(g, D, M, C, { col: CG.b, r: 20 }); } else { preTicks(g, A, M, 1); preTicks(g, M, C, 1); preTicks(g, B, M, 2); preTicks(g, M, D, 2); } }
  if (k === 'rectDiag') for (const [V, X, Y] of [[B, A, C], [C, B, D]]) preRight(g, V, X, Y, 12);
  if (k === 'rhombDiag') { preTicks(g, A, B, 1); preTicks(g, C, B, 1); preTicks(g, A, M, 2); preTicks(g, M, C, 2); preRight(g, M, C, D, 11); }
  [['أ', A, [-14, 8]], ['ب', B, [14, 8]], ['ج', C, [14, -2]], ['د', D, [-14, -2]], ['م', M, [0, -10]]].forEach(([n, P, d]) => { if (n === 'م' && k === 'paraSide') return; pfLab(g, P[0] + d[0], P[1] + d[1], n, { fs: 15 }); pfDot(g, P); });
  return { A, B, C, D, M }; }

/* ================= المشاهد ================= */
const cgSay = async (L, i) => { if (L[i]) await S(L[i]); };
/* د1 الإشعال: مثلثان 3 و4 و5 بحجمين؛ الشفّاف لا يطابقهما */
SCENES.cgHook = async c => { const L = c.lines, svg = m3Stage(250), g = el('g', { 'pointer-events': 'none' }, svg); const a = c.a || [3, 4, 5], k = c.k || 2;
  cgTri(g, a, { cx: 280, y: 196, u: 16 }); cgTri(g, a.map(v => v * k), { cx: 110, y: 206, u: 16, col: CG.b, fill: CG.fb }); await cgSay(L, 0);
  const t = el('g', { opacity: .55 }, g); el('polygon', { points: polyStr(cgTriPts(a, { cx: 280, y: 196, u: 16 })), fill: 'none', stroke: CG.q, 'stroke-width': 3, 'stroke-dasharray': '6 4' }, t);
  for (let i = 0; i <= 10; i++) { t.setAttribute('transform', `translate(${-170 * i / 10} ${10 * i / 10})`); await sleep(FAST ? 1 : 50); } SFX.tick(); for (const l of L.slice(1)) await S(l); };
/* د1 الاكتشاف: الإنشاء بالفرجار من ثلاثة أضلاع، قوسان يتقاطعان في نقطة واحدة في كل جهة */
SCENES.sssBuild = async c => { const L = c.lines, svg = m3Stage(262), g = el('g', { 'pointer-events': 'none' }, svg), s = c.sides || [6, 5, 4], u = 22, P = cgTriPts(s, { cx: 180, y: 160, u }), [A, B, C] = P;
  geoLine(g, A[0], A[1], B[0], B[1], { color: CG.a, w: 4 }); preLab(g, 180, 184, MS(String(s[0])), { fs: 15 }); await cgSay(L, 0);
  el('path', { d: angArc(B, s[1] * u, 60, 180), fill: 'none', stroke: CG.b, 'stroke-width': 2.2, 'stroke-dasharray': '5 4' }, g); el('path', { d: angArc(A, s[2] * u, 0, 120), fill: 'none', stroke: CG.b, 'stroke-width': 2.2, 'stroke-dasharray': '5 4' }, g); SFX.tick(); await cgSay(L, 1);
  geoLine(g, B[0], B[1], C[0], C[1], { color: CG.a, w: 4 }); geoLine(g, A[0], A[1], C[0], C[1], { color: CG.a, w: 4 }); pfDot(g, C); for (const P2 of [A, B]) pfDot(g, P2);
  ciRule(g, 180, 30, labelText('cgRuleSss'), CG.ok, 15); for (const l of L.slice(2)) await S(l); };
/* د2: الزاوية المحصورة وغير المحصورة، ثم ASA */
SCENES.cgSasShow = async c => { const L = c.lines, svg = m3Stage(250); let g = el('g', { 'pointer-events': 'none' }, svg);
  const one = cs => { g.remove(); g = el('g', { 'pointer-events': 'none' }, svg); preCaseTris(g, cs); };
  one('sas'); await cgSay(L, 0); one('ssa'); SFX.tick(); await cgSay(L, 1); one('asa'); SFX.tick(); await cgSay(L, 2); one('sas'); ciRule(g, 180, 30, labelText('cgRulePost'), CG.ok, 15); for (const l of L.slice(3)) await S(l); };
/* د3: التكبير بمعامل والتطابق بمعامل 1، والضلع المجهول */
SCENES.simShow = async c => { const L = c.lines, svg = m3Stage(250), g = el('g', { 'pointer-events': 'none' }, svg), a = c.a || [4, 6, 8], k = c.k || 1.5;
  cgTri(g, a, { cx: 266, y: 190, u: 12 }); await cgSay(L, 0); cgTri(g, a.map(v => v * k), { cx: 100, y: 190, u: 12, col: CG.b, fill: CG.fb }); SFX.tick();
  ciEq(g, 100, 40, `× ${k}`, CG.ok, 20); await cgSay(L, 1); for (const l of L.slice(2)) await S(l); };
/* د4 ود5: خطوات برهان رباعي تحت شكله */
SCENES.quadProof = async c => { const L = c.lines, svg = m3Stage(262), pfs = c.pfs || [c.pf]; let g = null;
  for (const [i, pf] of pfs.entries()) { if (g) g.remove(); g = el('g', { 'pointer-events': 'none' }, svg); pfFig(g, pf, { y0: 2, s: .82 }); await cgSay(L, i * 4); await pfWrite(g, pf, L, i * 4 + 1); }
  for (const l of L.slice(pfs.length * 4)) await S(l); };
/* د5: تعميم نصف حاصل ضرب القطرين: المثلثان على القطر الأفقي وارتفاعاهما */
SCENES.cgPerpShow = async c => { const L = c.lines, svg = m3Stage(250), g = el('g', { 'pointer-events': 'none' }, svg), [a, b, cc, d] = c.dims || [3, 7, 4, 2], u = 20, Lp = [180 - (a + b) * u / 2, 112], M = [Lp[0] + a * u, 112], R = [Lp[0] + (a + b) * u, 112], T = [M[0], 112 - cc * u], B = [M[0], 112 + d * u];
  el('polygon', { points: polyStr([Lp, T, R]), fill: CG.fa, stroke: CG.ink, 'stroke-width': 3 }, g); el('polygon', { points: polyStr([Lp, R, B]), fill: CG.fb, stroke: CG.ink, 'stroke-width': 3 }, g);
  geoLine(g, T[0], T[1], B[0], B[1], { color: CG.b, w: 3, dash: '7 4' }); geoLine(g, Lp[0], Lp[1], R[0], R[1], { color: CG.a, w: 3 }); await cgSay(L, 0);
  ciEq(g, 180, 226, `${a + b} × ${cc + d} ÷ 2 = ${(a + b) * (cc + d) / 2}`, CG.ok, 18); SFX.tick(); for (const l of L.slice(1)) await S(l); };
/* د5: البطاقات الثلاث للأقطار والعائلة (الشمول) */
SCENES.quadFamily = async c => { const L = c.lines, svg = m3Stage(250), g = el('g', { 'pointer-events': 'none' }, svg), N = [['para', 180, 44], ['rect', 96, 118], ['rhom', 264, 118], ['square', 180, 192]];
  for (const [k, x, y] of N) { el('rect', { x: x - 62, y: y - 22, width: 124, height: 38, rx: 10, fill: CG.card, stroke: CG.edge, 'stroke-width': 2 }, g); preLab(g, x, y + 4, labelText('qdName.' + k), { dir: 'rtl', fs: 15 }); }
  for (const [a, b] of [[0, 1], [0, 2], [1, 3], [2, 3]]) { const P = N[a], Q = N[b]; cpArrow(g, [P[1] + (Q[1] - P[1]) * .45, P[2] + 18], [Q[1] - (Q[1] - P[1]) * .1, Q[2] - 24], { color: CG.c }); }
  for (const l of L) await S(l); };
WRAP_ART.congArt = svg => { const g = el('g', { 'pointer-events': 'none' }, svg); cgTri(g, [5, 4, 3], { cx: 250, y: 200, u: 16, labels: false }); cgTri(g, [5, 4, 3], { cx: 110, y: 200, u: 16, flip: true, labels: false, col: CG.b, fill: CG.fb }); };
