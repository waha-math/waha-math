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
const cgNotScale = (g, x, y) => { const t = el('text', { x, y, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 700, fill: '#6b7a84', direction: 'rtl', 'pointer-events': 'none' }, g); t.textContent = labelText('arNotScale'); return t; };
function cgTri(g, s, o = {}) { const P = cgTriPts(s, o);   /* fit [x0، x1]: يُزاح المثلث أفقياً حتى يسعه (الرسم داخل الإطار؛ المنفرج يمتدّ رأسه خارج قاعدته) */
  if (o.fit) { const xs = P.map(p => p[0]), lo = Math.min(...xs), hi = Math.max(...xs), d = lo < o.fit[0] ? o.fit[0] - lo : hi > o.fit[1] ? o.fit[1] - hi : 0; P.forEach(p => { p[0] += d; }); } el('polygon', { points: polyStr(P), fill: o.fill || CG.fa, stroke: o.col || CG.a, 'stroke-width': 3.2, 'stroke-linejoin': 'round', 'pointer-events': 'none' }, g);
  const C = [(P[0][0] + P[1][0] + P[2][0]) / 3, (P[0][1] + P[1][1] + P[2][1]) / 3], sides = [[0, 1, s[0]], [1, 2, s[1]], [2, 0, s[2]]];
  P.labs = []; if (o.labels !== false) sides.forEach(([i, j, v], n) => { const M = [(P[i][0] + P[j][0]) / 2, (P[i][1] + P[j][1]) / 2], d = Math.hypot(M[0] - C[0], M[1] - C[1]) || 1, L = [M[0] + (M[0] - C[0]) / d * 13, M[1] + (M[1] - C[1]) / d * 13 + 5];
    const t = el('text', { x: L[0], y: L[1], 'text-anchor': 'middle', 'font-size': o.fs || 14, 'font-weight': 800, fill: o.labCol && o.labCol[n] || CG.ink, stroke: '#fff', 'stroke-width': 3.5, 'paint-order': 'stroke', 'pointer-events': 'none' }, g); t.textContent = o.ask === n ? '؟' : MS(String(o.vals ? o.vals[n] : v)); if (o.ask === n) t.setAttribute('fill', CG.q); P.labs.push(t); });
  return P; }
const cgSorted = s => [...s].sort((x, y) => x - y);
const cgRel = (a, b) => { const A = cgSorted(a), B = cgSorted(b), k = B[0] / A[0]; return A.every((v, i) => v === B[i]) ? 'cong' : A.every((v, i) => Math.abs(B[i] - v * k) < 1e-9) ? 'sim' : 'none'; };

/* ================= ① مثلثان بأطوال أضلاعهما: متطابقان أم متشابهان فقط أم لا هذا ولا ذاك؟ (C405، C406): a، b، rot ================= */
ITEM.cgSides = cpItem({ H: 236, tLine: 'gen.cg.together.sides', hint: 'gen.cg.hint.sides', rLine: it => 'gen.cg.reveal.sides.' + it.want, praise: 'praiseThink',
  make: s => ({ want: cgRel(s.a, s.b), tag: 'cg-sides' }),
  draw(svg, item, tries) { const g = el('g', {}, svg), ua = Math.min(14, 118 / Math.max(...item.a)), ub = Math.min(14, 118 / Math.max(...item.b));   /* كلٌّ بمقياسه، فلا يُحكَم بالحجم بل بالأعداد (D254؛ المراجع A لبوابة M4-U3/U4، 20) */
    const Pa = cgTri(g, item.a, { cx: 268, y: 172, u: ua, fit: [198, 326] }), Pb = cgTri(g, item.b, { cx: 92, y: 172, u: ub, rot: item.rot || 0, flip: !!item.flip, col: CG.b, fill: CG.fb, fit: [34, 162] }); cgNotScale(g, 180, 226);
    if (tries >= 3) { const A = cgSorted(item.a), B = cgSorted(item.b), m = helpG(svg); A.forEach((v, i) => ciEq(m, 180, 40 + i * 22, `${B[i]} ÷ ${v} = ${+(B[i] / v).toFixed(2)}`, CG.hl, 15)); } return { Pa, Pb }; },
  h2: async (item, ctx) => { const m = helpG(ctx.svg); if (ctx.Pa) { rankSides(m, ctx.Pa, item.a); rankSides(m, ctx.Pb, item.b); }   /* المستوى الثاني رسمٌ: الأقصر مع الأقصر… */
    ciRule(m, 180, 30, labelText('cgRuleSides'), CG.hl, 15); await sleep(FAST ? 10 : 250); },
  pick: item => choosePick(['cong', 'sim', 'none'].map(k => [k, labelText('cgK.' + k), '<i></i>', 'gen.cg.k.' + k]), item.want),
  errOf: (it, k) => it.want === 'sim' && k === 'cong' ? 'cgSimAsCong' : it.want === 'cong' && k === 'sim' ? 'cgCongAsSim' : k === 'none' ? 'cgMissed' : 'cgFalse' });

/* ================= ② القطع المتطابقة (C405): orig أضلاع الأصل، cands [ثلاث ثلاثيات، الأولى المطابقة]، rots ================= */
ITEM.cgPick = cpItem({ H: 284, tLine: 'gen.cg.together.pick', hint: 'gen.cg.hint.pick', rLine: 'gen.cg.reveal.pick', praise: 'praiseThink',
  make: s => { const order = shuffle([0, 1, 2]); /*T*/if (TESTHOOK && s.cands.filter(c => cgRel(s.orig, c) === 'cong').length !== 1) testBug('cgPick: ليست ثلاثية واحدة مطابقة');/*/T*/ return { order, want: String(order.indexOf(0)), tag: 'cg-pick' }; },
  draw(svg, item, tries) { const g = el('g', {}, svg), mx = Math.max(...item.cands.flat()), u = Math.min(10, 80 / mx), uo = u, X = [284, 180, 76];   /* الأصل والمرشّحون بمقياسٍ واحد (المراجع A لبوابة M4-U3/U4، 7) */
    const Po = cgTri(g, item.orig, { cx: 196, y: 86, u: uo, col: CG.c, fill: CG.fc }), Pc = []; preLab(g, 318, 40, labelText('cgOrig'), { dir: 'rtl', fs: 15, anchor: 'start' });
    item.order.forEach((ci, pos) => { el('rect', { x: X[pos] - 50, y: 112, width: 100, height: 118, rx: 12, fill: CG.card, stroke: CG.edge, 'stroke-width': 2, 'pointer-events': 'none' }, g);
      preLab(g, X[pos], 130, labelText('pfSet.' + pos), { dir: 'rtl', fs: 13 }); Pc.push([cgTri(g, item.cands[ci], { cx: X[pos], y: 206, u, rot: (item.rots || [30, -20, 15])[pos], col: CG.a, fill: CG.fa, fs: 13, fit: [X[pos] - 40, X[pos] + 40] }), item.cands[ci]]); });
    if (tries >= 3) { const m = helpG(svg), srt = s => cgSorted(s).map(v => MS(String(v))).join('، '); preLab(m, 196, 34, srt(item.orig), { col: CG.hl, fs: 15 }); item.order.forEach((ci, pos) => preLab(m, X[pos], 252, srt(item.cands[ci]), { col: CG.hl, fs: 14 })); }   /* الحلّ المشترك: الأطوال مرتّبة تحت كلٍّ، والمقارنة للطفل (5 (ب)) */
    return { Po, Pc }; },
  h2: async (item, ctx) => { const m = helpG(ctx.svg); if (ctx.Po) { rankSides(m, ctx.Po, item.orig); ctx.Pc.forEach(([P, s]) => rankSides(m, P, s)); }   /* المستوى الثاني رسمٌ: الأضلاع بألوان أطوالها */
    ciRule(m, 180, 250, labelText('cgRuleSss'), CG.hl, 15); await sleep(FAST ? 10 : 250); },   /* تحت بطاقات المرشّحين لا عليها (المراجع B لبوابة M4-U3/U4، 3) */
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
    const Sa = simShape(g, item.fig, item.a, { cx: 262, y: 186, u, col: CG.a, fill: CG.fa }), Sb = simShape(g, item.fig, item.b, { cx: 96, y: 186, u, col: CG.b, fill: CG.fb });
    if (tries >= 3) { const A = item.fig === 'tri' ? cgSorted(item.a) : item.a, B = item.fig === 'tri' ? cgSorted(item.b) : item.b, m = helpG(svg); A.forEach((v, i) => ciEq(m, 180, 36 + i * 22, `${B[i]} ÷ ${v} = ${+(B[i] / v).toFixed(2)}`, CG.hl, 15)); } return { Sa, Sb }; },
  h2: async (item, ctx) => { const m = helpG(ctx.svg);   /* المستوى الثاني رسمٌ: الطول مع الطول والعرض مع العرض بلونٍ واحد */
    if (ctx.Sa) for (const [P, d] of [[ctx.Sa, item.a], [ctx.Sb, item.b]]) { if (item.fig === 'tri') rankSides(m, P, d); else { const w = d[0], h = item.fig === 'sq' ? d[0] : d[1], cw = w === h ? H2C[1] : w > h ? H2C[2] : H2C[0], ch = w === h ? H2C[1] : h > w ? H2C[2] : H2C[0]; hlSeg(m, P[0], P[1], cw); hlSeg(m, P[3], P[2], cw); hlSeg(m, P[1], P[2], ch); hlSeg(m, P[0], P[3], ch); } }
    ciRule(m, 180, 30, labelText('cgRuleSim'), CG.hl, 15); await sleep(FAST ? 10 : 250); },
  pick: item => yesNo(item.want),
  errOf: (it, k) => k === 'yes' ? 'simAnglesOnly' : 'simNo' });

/* ================= ④ الرباعي من قطريه (C421 ب): info { mid، eq، perp } بطاقاتٍ؛ الجواب اسمه، أو «لا نعرف» (شبه المنحرف متساوي الساقين قطراه متساويان) ================= */
/* القطران كما تقول البطاقات: يتناصفان أو لا، ومتساويان أو لا، ومتعامدان أو لا (بلا أضلاع الرباعي: لا يُرسم اسمه) */
function qdSketch(m, info, C, outline) { const L = 40, th = (info.perp ? 90 : 55) * Math.PI / 180, L2 = info.eq ? L : L * .62, f = info.mid ? .5 : .32;
  const A = [C[0] - L, C[1]], Cc = [C[0] + L, C[1]], O = [A[0] + 2 * L * f, C[1]], u = [Math.cos(th), -Math.sin(th)], B = [O[0] + u[0] * L2 * (info.mid ? 1 : 1.3), O[1] + u[1] * L2 * (info.mid ? 1 : 1.3)], D = [O[0] - u[0] * L2 * (info.mid ? 1 : .7), O[1] - u[1] * L2 * (info.mid ? 1 : .7)];
  geoLine(m, A[0], A[1], Cc[0], Cc[1], { color: H2C[0], w: 3.4 }); geoLine(m, B[0], B[1], D[0], D[1], { color: H2C[1], w: 3.4 });
  if (info.mid) { preTicks(m, A, O, 1); preTicks(m, O, Cc, 1); preTicks(m, B, O, 2); preTicks(m, O, D, 2); }
  if (outline) el('polygon', { points: polyStr([A, B, Cc, D]), fill: 'none', stroke: CG.ink, 'stroke-width': 2.6, 'pointer-events': 'none' }, m);
  if (info.perp) preRight(m, O, Cc, B, 9); [A, Cc, B, D, O].forEach(P => el('circle', { cx: P[0], cy: P[1], r: 3.5, fill: CG.ink, 'pointer-events': 'none' }, m)); }
const QD_OF = i => i.mid ? (i.eq && i.perp ? 'square' : i.eq ? 'rect' : i.perp ? 'rhom' : 'para') : 'unk';
ITEM.quadDiag = cpItem({ H: 262, tLine: 'gen.cg.together.qd', hint: 'gen.cg.hint.qd', rLine: it => 'gen.cg.reveal.qd.' + it.want, praise: 'praiseThink',
  make: s => ({ want: QD_OF(s.info), tag: 'quad-diag' }),
  draw(svg, item, tries) { const g = el('g', { 'pointer-events': 'none' }, svg); ['mid', 'eq', 'perp'].forEach((k, i) => { const y = 34 + i * 52, on = !!item.info[k];
      el('rect', { x: 108, y, width: 222, height: 42, rx: 10, fill: on ? 'rgba(47,157,107,.10)' : '#f6f2ea', stroke: on ? CG.ok : CG.edge, 'stroke-width': 2 }, g);   /* والرسم يساراً في المستوى الثاني */
      preLab(g, 318, y + 27, labelText('qdInfo.' + k), { dir: 'rtl', fs: 14, anchor: 'start' }); preLab(g, 132, y + 28, on ? labelText('qdYes') : labelText('qdNo'), { dir: 'rtl', fs: 14, col: on ? CG.ok : '#8a7f6e' }); });
    if (tries >= 3) { const m = helpG(svg); qdSketch(m, item.info, [64, 110], true); ciRule(m, 180, 228, labelText('cgRuleQd'), CG.hl, 15); } return {}; },   /* الحلّ المشترك: الرباعي من قطريه مرسوماً، والاسم للطفل */
  h2: async (item, ctx) => { const m = helpG(ctx.svg); qdSketch(m, item.info, [64, 110]); ciRule(m, 180, 228, labelText('cgRuleQd'), CG.hl, 15); await sleep(FAST ? 10 : 250); },   /* المستوى الثاني رسمٌ: القطران كما تقول البطاقات */
  pick: item => choosePick(item.cands.map(k => [k, labelText('qdName.' + k), '<i></i>', 'gen.cg.qd.' + k]), item.want),
  errOf: (it, k) => it.want === 'unk' ? (it.info.eq && !it.info.perp ? 'qdEqOnly' : it.info.perp && !it.info.eq ? 'qdPerpOnly' : 'qdNoMid') : k === 'para' ? 'qdMissProp' : k === 'unk' ? 'qdNoConv' : it.want === 'square' && (k === 'rect' || k === 'rhom') ? 'qdGeneral' : 'qdWrongName' });   /* الوسم بما في البطاقات (المراجع A لبوابة M4-U3/U4، 16) */

/* خطّ قياسٍ بسهمين للطول كله خارج الشكل، بخطّي امتداد من طرفيه، وعدده عند منتصفه (المراجع A لبوابة M4-U3/U4، 14): n إزاحة الخطّ عن القطعة */
function cgDim(g, P, Q, n, txt, col, fs = 15) { const P2 = [P[0] + n[0], P[1] + n[1]], Q2 = [Q[0] + n[0], Q[1] + n[1]], ln = Math.hypot(n[0], n[1]) || 1, nu = [n[0] / ln, n[1] / ln];
  [[P, P2], [Q, Q2]].forEach(([A, B]) => el('line', { x1: A[0], y1: A[1], x2: B[0] + nu[0] * 5, y2: B[1] + nu[1] * 5, stroke: '#9a8f7c', 'stroke-width': 1.3, 'stroke-dasharray': '3 3' }, g));
  el('line', { x1: P2[0], y1: P2[1], x2: Q2[0], y2: Q2[1], stroke: col, 'stroke-width': 2 }, g); const L = Math.hypot(Q2[0] - P2[0], Q2[1] - P2[1]) || 1, d = [(Q2[0] - P2[0]) / L, (Q2[1] - P2[1]) / L], pp = [-d[1], d[0]];
  [[P2, d], [Q2, [-d[0], -d[1]]]].forEach(([A, e]) => el('polygon', { points: polyStr([A, [A[0] + e[0] * 9 + pp[0] * 4, A[1] + e[1] * 9 + pp[1] * 4], [A[0] + e[0] * 9 - pp[0] * 4, A[1] + e[1] * 9 - pp[1] * 4]]), fill: col }, g));
  const mx = (P2[0] + Q2[0]) / 2 + nu[0] * 12, my = (P2[1] + Q2[1]) / 2 + nu[1] * 12 + (Math.abs(nu[1]) > .5 ? (nu[1] > 0 ? 5 : 0) : 5);
  return preLab(g, mx, my, MS(String(txt)), { col, fs, anchor: Math.abs(nu[0]) > .5 ? (nu[0] > 0 ? 'start' : 'end') : 'middle' }); }
/* ================= ⑤ مساحة رباعي محدّب قطراه متعامدان (C421 ب): القطر الأفقي x1 + x2 (x1 يسار التقاطع)، والرأسي y1 + y2 (y1 فوقه)؛ لا c في المواصفة (وسم المفهوم) ================= */
ITEM.perpArea = cpItem({ H: 268, tLine: 'gen.cg.together.perp', hint: 'gen.cg.hint.perp', rLine: 'gen.cg.reveal.perp', rSay: it => S(bigw(it.want), { append: true }), num: true, praise: 'praiseThink',
  make: s => { const p = s.x1 + s.x2, r = s.y1 + s.y2, A = p * r / 2; /*T*/if (TESTHOOK && (!Number.isInteger(A) || A > 100)) testBug('perpArea: المساحة ليست عدداً صحيحاً حتى مئة');/*/T*/ return { p, r, want: A, nums: [A, p * r, p + r].filter((v, i, X) => X.indexOf(v) === i).concat([A + 5]).slice(0, 3), tag: 'perp-area' }; },
  draw(svg, item, tries) { const g = el('g', { 'pointer-events': 'none' }, svg), rd = (item.rot || 0) * Math.PI / 180, cs = Math.cos(rd), sn = Math.sin(rd), Rt = p => [p[0] * cs - p[1] * sn, p[0] * sn + p[1] * cs];
    /* القطران متعامدان عند التقاطع؛ وبالدوران rot لا يكون القطران أفقياً ورأسياً (المراجع A لبوابة M4-U3/U4، 15) */
    const U = [[-item.x1, 0], [0, -item.y1], [item.x2, 0], [0, item.y2]].map(Rt);
    /* الملاءمة مع خطّي القياس: لكل قطرٍ جهتان، فيُختار ما يتّسع له أكبر مقياس داخل الإطار وفوق سطر القاعدة */
    const lay = (u, s1, s2) => { const P = U.map(p => [p[0] * u, p[1] * u]), n1 = Rt([0, s1 * ((s1 > 0 ? item.y2 : item.y1) * u + 18)]), n2 = Rt([s2 * ((s2 > 0 ? item.x2 : item.x1) * u + 20), 0]), ln = n => Math.hypot(n[0], n[1]);
      const ex = [...P, [P[0][0] + n1[0], P[0][1] + n1[1]], [P[2][0] + n1[0], P[2][1] + n1[1]], [P[1][0] + n2[0], P[1][1] + n2[1]], [P[3][0] + n2[0], P[3][1] + n2[1]]];
      [[P[0], P[2], n1], [P[1], P[3], n2]].forEach(([A, B, n]) => { const k = (ln(n) + 26) / ln(n); ex.push([(A[0] + B[0]) / 2 + n[0] * k, (A[1] + B[1]) / 2 + n[1] * k]); });
      const xs = ex.map(q => q[0]), ys = ex.map(q => q[1]); return { P, n1, n2, w: Math.max(...xs) - Math.min(...xs), h: Math.max(...ys) - Math.min(...ys), cx: (Math.max(...xs) + Math.min(...xs)) / 2, cy: (Math.max(...ys) + Math.min(...ys)) / 2 }; };
    let best = null; for (const s1 of [1, -1]) for (const s2 of [1, -1]) for (let u = 17; u > 4; u -= .25) { const Y = lay(u, s1, s2); if (Y.w <= 316 && Y.h <= 194) { if (!best || u > best.u + .01) best = { u, Y }; break; } }
    const Y = best ? best.Y : lay(5, 1, 1), ox = 180 - Y.cx, oy = 116 - Y.cy, [L, T, R, B] = Y.P.map(p => [ox + p[0], oy + p[1]]), M = [ox, oy];
    el('polygon', { points: polyStr([L, T, R, B]), fill: CG.fc, stroke: CG.ink, 'stroke-width': 3.2, 'stroke-linejoin': 'round' }, g);
    geoLine(g, L[0], L[1], R[0], R[1], { color: CG.a, w: 3, dash: '7 4' }); geoLine(g, T[0], T[1], B[0], B[1], { color: CG.b, w: 3, dash: '7 4' }); preRight(g, M, R, T, 10);
    cgDim(g, L, R, Y.n1, item.p, CG.a); cgDim(g, T, B, Y.n2, item.r, CG.b);   /* القطران كلٌّ بطوله، لا جزءاً منه (المراجع A لبوابة M4-U3/U4، 14) */
    if (tries >= 3) ciEq(helpG(svg), 180, 252, `${item.p} × ${item.r} ÷ 2 = ؟`, CG.hl, 17); return { Q: [L, T, R, B] }; },   /* مكان بطاقة القاعدة: في المحاولة الثالثة لا تُحمَل البطاقة */
  h2: async (item, ctx) => { const m = helpG(ctx.svg); if (ctx.Q) { const [L, T, R, B] = ctx.Q; el('polygon', { points: polyStr([L, T, R]), fill: H2C[0], opacity: .22, 'pointer-events': 'none' }, m); el('polygon', { points: polyStr([L, B, R]), fill: H2C[1], opacity: .22, 'pointer-events': 'none' }, m); }   /* المستوى الثاني رسمٌ: مثلثان على القطر الأفقي */
    ciRule(m, 180, 250, labelText('cgRulePerp'), CG.hl, 15); await sleep(FAST ? 10 : 250); },
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
  [['أ', A, [-14, 8]], ['ب', B, [14, 8]], ['ج', C, [14, -2]], ['د', D, [-14, -2]], ['م', M, k === 'rhombDiag' ? [-13, 18] : [0, -10]]].forEach(([n, P, d]) => { if (n === 'م' && k === 'paraSide') return; pfLab(g, Math.min(330, Math.max(30, P[0] + d[0])), Math.max(30, P[1] + d[1]), n, { fs: 15 }); pfDot(g, P); });   /* الاسم داخل الورقة */
  return { A, B, C, D, M }; }

/* ================= المشاهد ================= */
/* جدول المشروع (U3 د6، U4 د4): ما حسبه الطفل في لعبة المشروع، صفوفاً تحت رؤوس (cols مفاتيح تسميات، rows أعداد)، ثم الجمل (المراجع A لبوابة M4-U3/U4، 4) */
SCENES.projTable = async c => { const L = c.lines, cols = c.cols || [], rows = c.rows || [], svg = m3Stage(Math.max(200, 76 + rows.length * 40)), g = el('g', { 'pointer-events': 'none' }, svg), n = cols.length, W = 300 / n;
  cols.forEach((k, j) => { const x = 330 - W * (j + .5); el('rect', { x: 330 - W * (j + 1) + 2, y: 30, width: W - 4, height: 34, rx: 8, fill: CG.card, stroke: CG.edge, 'stroke-width': 2 }, g); preLab(g, x, 52, labelText(k), { dir: 'rtl', fs: 14 }); });
  for (const [i, r] of rows.entries()) { const y = 72 + i * 40; for (const [j, v] of r.entries()) { const x = 330 - W * (j + .5); el('rect', { x: 330 - W * (j + 1) + 2, y, width: W - 4, height: 34, rx: 8, fill: '#fffdf6', stroke: CG.edge, 'stroke-width': 1.5 }, g);
      preLab(g, x, y + 23, MS(String(v)), { fs: 16, col: j === r.length - 1 && c.lastCol ? CG.ok : CG.ink }); } SFX.tick(); await sleep(FAST ? 1 : 260); }
  for (const l of L) await S(l); };
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
  const one = cs => { g.remove(); g = el('g', { 'pointer-events': 'none' }, svg); return preCaseTris(g, cs); };
  one('sas'); await cgSay(L, 0); one('ssa'); SFX.tick(); await cgSay(L, 1); one('asa'); SFX.tick(); await cgSay(L, 2);
  /* برهان ASA من المسلّمة مرئياً (المرجع U3 د2؛ المراجع A لبوابة M4-U3/U4، 23): لو اختلف الضلع لكانت نقطةٌ أخرى س على الضلع، فبالمسلّمة تساوي زاويتُها الزاويةَ الثانية، فتنطبق س على الرأس */
  const T = one('asa'), [P, Q, R] = T.B, X = [P[0] + (R[0] - P[0]) * .66, P[1] + (R[1] - P[1]) * .66]; ciRule(g, 180, 30, labelText('cgRulePost'), CG.ok, 15);
  geoLine(g, Q[0], Q[1], X[0], X[1], { color: CG.q, w: 2.6, dash: '6 4' }); el('circle', { cx: X[0], cy: X[1], r: 5, fill: '#fff', stroke: CG.q, 'stroke-width': 2.4 }, g); pfLab(g, X[0] - 12, X[1] - 6, 'س', { col: CG.q, fs: 16 });
  for (const l of L.slice(3)) await S(l); };
/* د3: التكبير بمعامل والتطابق بمعامل 1، والضلع المجهول */
SCENES.simShow = async c => { const L = c.lines, svg = m3Stage(250), g = el('g', { 'pointer-events': 'none' }, svg), a = c.a || [4, 6, 8], k = c.k || 1.5;
  cgTri(g, a, { cx: 266, y: 190, u: 12 }); await cgSay(L, 0); cgTri(g, a.map(v => v * k), { cx: 100, y: 190, u: 12, col: CG.b, fill: CG.fb }); SFX.tick();
  ciEq(g, 100, 40, `× ${k}`, CG.ok, 20); await cgSay(L, 1); for (const l of L.slice(2)) await S(l); };
/* د4 ود5: خطوات برهان رباعي تحت شكله */
SCENES.quadProof = async c => { const L = c.lines, svg = m3Stage(262), pfs = c.pfs || [c.pf]; let g = null;
  for (const [i, pf] of pfs.entries()) { if (g) g.remove(); g = el('g', { 'pointer-events': 'none' }, svg); pfFitFig(g, pf, 16, 122, { sMax: .82, y0: 2, s: .82 }); await cgSay(L, i * 4); await pfWrite(g, pf, L, i * 4 + 1); }
  for (const l of L.slice(pfs.length * 4)) await S(l); };
/* د5: تعميم نصف حاصل ضرب القطرين: المثلثان على القطر الأفقي وارتفاعاهما */
SCENES.cgPerpShow = async c => { const L = c.lines, svg = m3Stage(250), g = el('g', { 'pointer-events': 'none' }, svg), [a, b, cc, d] = c.dims || [3, 7, 4, 2], u = 20, Lp = [180 - (a + b) * u / 2, 112], M = [Lp[0] + a * u, 112], R = [Lp[0] + (a + b) * u, 112], T = [M[0], 112 - cc * u], B = [M[0], 112 + d * u];
  el('polygon', { points: polyStr([Lp, T, R]), fill: CG.fa, stroke: CG.ink, 'stroke-width': 3 }, g); el('polygon', { points: polyStr([Lp, R, B]), fill: CG.fb, stroke: CG.ink, 'stroke-width': 3 }, g);
  geoLine(g, T[0], T[1], B[0], B[1], { color: CG.b, w: 3, dash: '7 4' }); geoLine(g, Lp[0], Lp[1], R[0], R[1], { color: CG.a, w: 3 });
  cgDim(g, Lp, R, [0, B[1] - 112 + 16], a + b, CG.a); preLab(g, M[0] - 8, (T[1] + M[1]) / 2 + 5, MS(String(cc)), { col: CG.b, fs: 15, anchor: 'end' }); preLab(g, M[0] - 8, (B[1] + M[1]) / 2 + 5, MS(String(d)), { col: CG.b, fs: 15, anchor: 'end' });
  await cgSay(L, 0);   /* البرهان مرئياً: مثلثان قاعدتهما القطر، وارتفاعاهما جزءا الآخر (المراجع A لبوابة M4-U3/U4، 14) */
  ciEq(g, 180, 214, `${a + b} × ${cc} ÷ 2 + ${a + b} × ${d} ÷ 2 = ${(a + b) * cc / 2} + ${(a + b) * d / 2}`, CG.q, 16); SFX.tick(); await sleep(FAST ? 10 : 700);
  ciEq(g, 180, 240, `= ${a + b} × ${cc + d} ÷ 2 = ${(a + b) * (cc + d) / 2}`, CG.ok, 18); SFX.tick(); await cgSay(L, 1);
  if (L[2]) { g.innerHTML = ''; const P = [[108, 62], [252, 62], [252, 170], [108, 170]];   /* والمستطيل ٦ × ٨: قطراه عشرة لا يتعامدان، فنصف حاصل ضربهما ٥٠ ومساحته ٤٨ (المراجع A لبوابة M4-U3/U4، 10) */
    el('polygon', { points: polyStr(P), fill: CG.fc, stroke: CG.ink, 'stroke-width': 3.2 }, g); geoLine(g, P[0][0], P[0][1], P[2][0], P[2][1], { color: CG.a, w: 3, dash: '7 4' }); geoLine(g, P[1][0], P[1][1], P[3][0], P[3][1], { color: CG.b, w: 3, dash: '7 4' });
    preLab(g, 180, 188, MS('8'), { fs: 15 }); preLab(g, 266, 121, MS('6'), { fs: 15, anchor: 'start' }); preLab(g, 146, 84, MS('10'), { fs: 15, col: CG.a });
    ciEq(g, 180, 214, '10 × 10 ÷ 2 = 50', CG.q, 17); ciEq(g, 180, 238, '6 × 8 = 48', CG.ok, 17); SFX.tick(); await cgSay(L, 2); }
  for (const l of L.slice(3)) await S(l); };
/* د5: البطاقات الثلاث للأقطار والعائلة (الشمول) */
SCENES.quadFamily = async c => { const L = c.lines, svg = m3Stage(250), g = el('g', { 'pointer-events': 'none' }, svg), N = [['para', 180, 44], ['rect', 96, 118], ['rhom', 264, 118], ['square', 180, 192]];
  for (const [k, x, y] of N) { el('rect', { x: x - 62, y: y - 22, width: 124, height: 38, rx: 10, fill: CG.card, stroke: CG.edge, 'stroke-width': 2 }, g); preLab(g, x, y + 4, labelText('qdName.' + k), { dir: 'rtl', fs: 15 }); }
  for (const [a, b] of [[0, 1], [0, 2], [1, 3], [2, 3]]) { const P = N[a], Q = N[b]; cpArrow(g, [P[1] + (Q[1] - P[1]) * .45, P[2] + 18], [Q[1] - (Q[1] - P[1]) * .1, Q[2] - 24], { color: CG.c }); }
  for (const l of L) await S(l); };
WRAP_ART.congArt = svg => { const g = el('g', { 'pointer-events': 'none' }, svg); cgTri(g, [5, 4, 3], { cx: 250, y: 200, u: 16, labels: false }); cgTri(g, [5, 4, 3], { cx: 110, y: 200, u: 16, flip: true, labels: false, col: CG.b, fill: CG.fb }); };
