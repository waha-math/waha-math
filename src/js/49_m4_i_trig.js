/* =====================================================================
   M4-U8 «الإنشاء والنسب المثلثية» (المرحلة 4، نوفمبر 2026)
   د1 منصّف الزاوية بالفرجار وبرهان البعد المتساوي بـ ASA (C401 أ) · د2 العمود المنصّف وبرهانه بـ SAS (C401 ب)
   د3 جا وجتا بالجدول المكتشف (C409 أ) · د4 ظا ومشروع «مسح الارتفاع» وحكاية البيروني (C409 ب، D196). الرموز بالعربية (D190)
   ===================================================================== */
const C8 = { ink: '#24323a', ray: '#2f7fc1', bis: '#c0392b', arc: '#7a4fb0', opp: '#d9822b', adj: '#2f9d6b', hyp: '#2f7fc1', fill: 'rgba(47,127,193,.10)', hl: SO.hl, ok: SO.ok, q: '#c0392b' };
const c8Say = async (L, i) => { if (L[i]) await S(L[i]); };
const c8Ray = (V, a, L) => angP(V, a, L);
/* طولٌ للشعاع لا يخرج به عن الإطار الورقي (المعروف (1) لبوابة M4-U7/U8): x في [24، 336] وy فوق 18 */
const c8Fit = (V, a, L) => { const c = Math.cos(a * Math.PI / 180), s = Math.sin(a * Math.PI / 180); let t = L; if (c > 1e-6) t = Math.min(t, (336 - V[0]) / c); if (c < -1e-6) t = Math.min(t, (V[0] - 24) / -c); if (s > 1e-6) t = Math.min(t, (V[1] - 18) / s); return t; };
/* جدول النسب المكتشف (المرجع، بمنزلتين) */
const C8_T = { sin: { 30: .5, 45: .71, 60: .87 }, cos: { 30: .87, 45: .71, 60: .5 }, tan: { 30: .58, 45: 1, 60: 1.73 } };
const c8Key = v => String(v).replace('.', '_');
/* «جا ٣٠° = ؟» من اليمين: الرمز، ثم الزاوية، ثم المساواة */
function c8FnLabel(g, x, y, fn, deg, o = {}) { const fs = o.fs || 19, col = o.col || C8.ink; preLab(g, x + 36, y, labelText('c8Fn.' + fn), { dir: 'rtl', fs, col }); if (deg != null) degText(g, x, y, deg, { size: fs, color: col }); preLab(g, deg != null ? x - 22 : x + 12, y, o.tail ?? '؟ =', { fs, col, anchor: 'end' }); }   /* الذيل بـ ltr وطرفه الأيمن «=» ملاصقاً للزاوية: «٠٫٥ =» */

/* ---------- المثلث القائم: القائمة عند C (أسفل اليمين)، والزاوية المدروسة عند A (أسفل اليسار) ---------- */
function c8Tri(g, a, b, o = {}) { const u = o.u || Math.min(230 / a, 150 / b), A = [o.x0 ?? 60, o.y0 ?? 200], C = [A[0] + a * u, A[1]], B = [C[0], A[1] - b * u];
  el('polygon', { points: polyStr([A, C, B]), fill: C8.fill, stroke: C8.ink, 'stroke-width': 3, 'stroke-linejoin': 'round', 'pointer-events': 'none' }, g); preRight(g, C, A, B, 12);
  const ang = Math.atan2(b, a) * 180 / Math.PI; return { A, B, C, u, ang }; }
function c8Sides(g, T, labs, o = {}) { const L = {}, hl = o.hl || {}, cA = o.flip ? C8.opp : C8.adj, cO = o.flip ? C8.adj : C8.opp;   /* flip: الزاوية المعلّمة عند B فيتبادل الضلعان اسماً ولوناً */
  const put = (k, P, Q, dx, dy, col, anchor) => { const t = labs[k]; if (t == null) return; if (hl[k]) geoLine(g, P[0], P[1], Q[0], Q[1], { color: col, w: 6 }); L[k] = preLab(g, (P[0] + Q[0]) / 2 + dx, (P[1] + Q[1]) / 2 + dy, t, { col, fs: 16, anchor: anchor || 'middle', dir: 'rtl' }); };
  put('adj', T.A, T.C, 0, 22, cA); put('opp', T.C, T.B, 10, 6, cO, 'end'); put('hyp', T.A, T.B, -12, -8, C8.hyp, 'start'); return L; }   /* بـ rtl: «end» يمدّ النص يميناً و«start» يساراً */

/* ================= ① نصف الزاوية بالمنصّف (C401 أ): deg، ask half | whole ================= */
function c8Angle(g, V, deg, o = {}) { const L = o.L || 210, r0 = o.rot || 0; for (const a of [r0, r0 + deg]) { const P = c8Ray(V, a, c8Fit(V, a, L)); geoLine(g, V[0], V[1], P[0], P[1], { color: C8.ray, w: 3.4 }); } pfDot(g, V); if (o.bis !== false) { const Q = c8Ray(V, r0 + deg / 2, c8Fit(V, r0 + deg / 2, L * .95)); geoLine(g, V[0], V[1], Q[0], Q[1], { color: C8.bis, w: 3, dash: '8 5' }); } }
/* أخطاءٌ حقيقية فوق الجواب وتحته (المراجع A لبوابة M4-U7/U8، 1 و15): الزاوية كلها، والربع بالتنصيف مرتين، ومكمّلتها إلى 180 */
function c8HalfCh(s) { const d = s.deg, h = d / 2; return s.ask === 'whole' ? rkPick(d, [[h, 'bisNoDouble'], [2 * d, 'bisQuad'], [180 - h, 'bisSupp']], s.rk ?? 0) : rkPick(h, [[d, 'bisNoHalf'], ...(d % 4 === 0 ? [[d / 4, 'bisQuarter']] : []), [180 - d, 'bisSupp'], [2 * d, 'bisTwice']], s.rk ?? 0); }
const c8HalfV = (deg, rot = 0) => [deg + rot > 90 ? 70 - 100 * Math.cos((deg + rot) * Math.PI / 180) : 70, 196];   /* المنفرجة: الرأس أبعد يميناً ليتّسع ضلعها والقوسان (المعروف (1)) */
ITEM.c8Half = cpItem({ H: 236, tLine: 'gen.c8.together.half', hint: it => 'gen.c8.hint.half.' + it.ask, rLine: 'gen.ci4.reveal.ang', rSay: it => sayDeg(it.want), num: true, praise: 'praiseThink',
  make: s => { const ch = c8HalfCh(s); return { want: ch[0][0], nums: ch.map(c => c[0]), ch, tag: 'c8-half-' + s.ask }; },
  draw(svg, item, tries) { const g = el('g', {}, svg), r0 = item.rot || 0, V = c8HalfV(item.deg, r0); c8Angle(g, V, item.deg, { rot: r0 });   /* rot: الضلع الأول مائل (المراجع A لبوابة M4-U7/U8، 14) */
    const w = arArc(g, V, r0, r0 + item.deg, { r: 42, col: C8.ray, ...(item.ask === 'whole' ? { lab: '؟' } : { deg: item.deg }), dl: 22, fs: 15, lt: .8 });   /* وسم الزاوية كلها قرب ضلعها الثاني لا على المنصّف (المراجع B لبوابة M4-U7/U8، 1) */
    const h = arArc(g, V, r0, r0 + item.deg / 2, { r: 74, col: C8.bis, ...(item.ask === 'whole' ? { deg: item.deg / 2 } : { lab: '؟' }), dl: 18, fs: 15, fill: true });
    if (tries >= 3) ciEq(helpG(svg), item.deg > 90 ? 270 : 220, 40, item.ask === 'whole' ? `${item.deg / 2} × 2 = ؟` : `${item.deg} ÷ 2 = ؟`, C8.hl, 17); return { q: item.ask === 'whole' ? w : h }; },
  h2: async (item, ctx) => { const m = helpG(ctx.svg), r0 = item.rot || 0, V = c8HalfV(item.deg, r0);   /* القسمان المتساويان بلونين (المعروف (2) لبوابة M4-U7/U8) */
    for (const [i, [a0, a1]] of [[r0, r0 + item.deg / 2], [r0 + item.deg / 2, r0 + item.deg]].entries()) el('path', { d: angArc(V, 58, a0, a1), fill: 'none', stroke: H2C[i], 'stroke-width': 6, opacity: .7, 'pointer-events': 'none' }, m);
    ciRule(m, 220, [40, 230], labelText('c8AskBis'), C8.hl, 15); await sleep(FAST ? 10 : 250); },
  show: async (item, ctx) => { if (ctx && ctx.q) arSetDeg(ctx.q, item.want, C8.ok); },
  pick: (item, ctx) => { const np = numberPick(shuffle(item.nums), item.want, { west: true, word: degw }); ctx.np = np; return np.p; },
  errOf: (it, k) => (it.ch.find(([v]) => v === +k) || [])[1] || 'bisOff' });

/* ================= ② هل النقطة على المنصّف؟ (C401 أ): deg، at (نسبة اتجاه النقطة من الزاوية: 0.5 على المنصّف)، يبعد الضلعين بالتساوي؟ ================= */
ITEM.c8EqDist = cpItem({ H: 236, tLine: 'gen.c8.together.eqd', hint: 'gen.c8.hint.eqd', rLine: it => 'gen.c8.reveal.eqd.' + it.want, praise: 'praiseThink',
  make: s => ({ want: s.at === .5 ? 'yes' : 'no', tag: 'c8-eqd-' + (s.at === .5 ? 'on' : 'off') }),
  /* rot: الضلع الأول مائل (14)؛ ns: الرسم ليس بالقياس والزاويتان مكتوبتان، فلا يُجاب بمقارنة العمودين بالعين (20) — المراجع A لبوابة M4-U7/U8 */
  draw(svg, item, tries) { const g = el('g', {}, svg), r0 = item.rot || 0, V = [64 + (r0 > 0 ? 30 : 0), 200], d = item.deg, va = item.ns ? .5 + (item.at - .5) * .35 : item.at, N = c8Ray(V, r0 + d * va, 170); c8Angle(g, V, d, { bis: !!item.show, rot: r0 });
    const foot = a => { const u = [Math.cos(a * Math.PI / 180), -Math.sin(a * Math.PI / 180)], t = (N[0] - V[0]) * u[0] + (N[1] - V[1]) * u[1]; return [V[0] + u[0] * t, V[1] + u[1] * t]; }, F1 = foot(r0), F2 = foot(r0 + d);
    for (const F of [F1, F2]) { geoLine(g, N[0], N[1], F[0], F[1], { color: C8.opp, w: 2.6, dash: '5 4' }); preRight(g, F, N, V, 9); } pfDot(g, N); item._g = { N, F1, F2, V };
    if (item.ns) { const a1 = Math.round(d * item.at), a2 = d - a1; arArc(g, V, r0, r0 + d * va, { r: 46, col: C8.ray, deg: a1, dl: 16, fs: 14 }); arArc(g, V, r0 + d * va, r0 + d, { r: 62, col: C8.bis, deg: a2, dl: 16, fs: 14 }); cgNotScale(svg, 250, 30); }
    pfLab(g, N[0] + 12, N[1] - 6, 'ن', { fs: 15 });
    if (tries >= 3 && item.ns) { const a1 = Math.round(d * item.at); ciEq(helpG(svg), 230, 216, `${a1} ؟ ${d - a1}`, C8.hl, 17); }   /* ليس بالقياس: نقارن الزاويتين المكتوبتين */
    else if (tries >= 3) { const h = helpG(svg), r = 70, P1 = c8Ray(V, r0, r), P2 = c8Ray(V, r0 + d, r); el('path', { d: angArc(V, r, r0 - 6, r0 + d + 6), fill: 'none', stroke: C8.arc, 'stroke-width': 2.4 }, h);   /* الثالث حلٌّ مشترك: قوسٌ من الرأس وقوسان من النقطتين، ولا يُرسم المنصّف (المراجع A لبوابة M4-U7/U8، 6 (ب)) */
      const X = c8Ray(V, r0 + d / 2, r * Math.cos(d / 2 * Math.PI / 180) + Math.sqrt(Math.max(0, 64 * 64 - (r * Math.sin(d / 2 * Math.PI / 180)) ** 2)));
      for (const P of [P1, P2]) { const a = Math.atan2(P[1] - X[1], X[0] - P[0]) * 180 / Math.PI; el('path', { d: angArc(P, 64, a - 14, a + 14), fill: 'none', stroke: C8.arc, 'stroke-width': 2.4 }, h); pfDot(h, P); } pfDot(h, X); } return {}; },
  h2: async (item, ctx) => { const m = helpG(ctx.svg), G = item._g; if (G) { hlSeg(m, G.N, G.F1, H2C[0]); hlSeg(m, G.N, G.F2, H2C[1]); hlRing(m, G.N, 12); }   /* البعدان إلى الضلعين */
    ciRule(m, 190, [30, 230], labelText('c8AskEqd'), C8.hl, 15); await sleep(FAST ? 10 : 250); },
  pick: item => yesNo(item.want),
  errOf: (it, k) => k === 'yes' ? 'eqdOffYes' : 'eqdOnNo' });

/* ================= ③ العمود المنصّف: البعد عن الطرفين (C401 ب): half نصف القطعة، h ارتفاع ن عن المنتصف؛ ask mid | nb ================= */
function c8PbFig(g, half, h, o = {}) { const u = Math.min(110 / half, (o.hmax || 150) / Math.max(h, 1)) * (o.k || 1), M = [180, o.y ?? 196], A = [M[0] - half * u, M[1]], B = [M[0] + half * u, M[1]], N = [M[0], M[1] - h * u];
  geoLine(g, A[0], A[1], B[0], B[1], { color: C8.ink, w: 3.4 }); geoLine(g, M[0], M[1] + 18, M[0], Math.max(54, M[1] - 170), { color: C8.bis, w: 3, dash: '8 5' }); preRight(g, M, B, N, 10);
  [A, B, M].forEach(X => pfDot(g, X)); pfLab(g, A[0] - 10, A[1] + 18, 'أ', { fs: 15 }); pfLab(g, B[0] + 10, B[1] + 18, 'ب', { fs: 15 }); pfLab(g, M[0] + 12, M[1] + 18, 'م', { fs: 15 }); return { A, B, M, N, u }; }   /* م يمين القدم فلا يلامس نصف القطعة يسارها (TXSTRICT) */
ITEM.c8Pb = cpItem({ H: 250, tLine: 'gen.c8.together.pb', hint: it => 'gen.c8.hint.pb.' + it.ask, rLine: 'gen.ci4.reveal.half', rSay: it => S(numw(it.want), { append: true }), num: true, praise: 'praiseThink',
  make: s => { const na = Math.round(Math.hypot(s.half, s.h || 0)); /*T*/if (TESTHOOK && s.ask === 'nb' && na * na !== s.half * s.half + s.h * s.h) testBug('c8Pb: ن أ ليس عدداً صحيحاً');/*/T*/
    const ch = s.ask === 'mid' ? rkPick(s.half, [[2 * s.half, 'midNoHalf'], ...(s.half % 2 === 0 ? [[s.half / 2, 'midQuarter']] : []), [2 * s.half - 2, 'midSub2']], s.rk ?? 0) : rkPick(na, [[s.half + s.h, 'pyAdd'], [s.half, 'pbHalf'], [s.h, 'pbLeg'], [2 * s.half, 'pbWhole']], s.rk ?? 0);   /* أخطاءٌ حقيقية (المراجع A لبوابة M4-U7/U8، 1 و15) */
    return { na, want: ch[0][0], nums: ch.map(c => c[0]), ch, tag: 'c8-pb-' + s.ask }; },
  draw(svg, item, tries) { const g = el('g', {}, svg), F = c8PbFig(g, item.half, item.ask === 'nb' ? item.h : Math.max(2, item.half * .8), item.rot ? { y: 162, k: .76, hmax: 96 } : { y: item.ask === 'mid' ? 186 : 196, hmax: 96 });   /* ن تحت البطاقة وعملية الثالث (TXSTRICT في deepall) */ item._g = F;
    if (item.rot) { queueMicrotask(() => c6Rot(g, F.M, item.rot)); item._g = c6RotG(F, F.M, item.rot); }   /* القطعة مائلة والنصوص قائمة (المراجع A لبوابة M4-U7/U8، 14) */
    if (item.ask === 'mid') { preLab(g, 180, F.M[1] + 40, MS(String(2 * item.half)), { fs: 17, col: C8.ink }); preLab(g, (F.A[0] + F.M[0]) / 2, F.M[1] - 10, '؟', { fs: 18, col: C8.q }); }
    else { geoLine(g, F.N[0], F.N[1], F.A[0], F.A[1], { color: C8.opp, w: 3 }); geoLine(g, F.N[0], F.N[1], F.B[0], F.B[1], { color: C8.opp, w: 3 }); pfDot(g, F.N); pfLab(g, F.N[0] + 12, F.N[1] - 4, 'ن', { fs: 15 });
      preLab(g, (F.A[0] + F.M[0]) / 2, F.M[1] + 22, MS(String(item.half)), { fs: 16 }); preLab(g, F.M[0] + 10, (F.M[1] + F.N[1]) / 2 + 6, MS(String(item.h)), { fs: 16, anchor: 'start', col: C8.bis }); { const dx = F.B[0] - F.N[0], dy = F.B[1] - F.N[1], l = Math.hypot(dx, dy) || 1; preLab(g, (F.N[0] + F.B[0]) / 2 + 20 * dy / l, (F.N[1] + F.B[1]) / 2 - 20 * dx / l + 6, '؟', { fs: 18, col: C8.q, anchor: 'start' }); } }   /* «؟» خارج ن ب لا عند تسمية الارتفاع (TXSTRICT) */
    if (tries >= 3) ciEq(helpG(svg), 180, 36, item.ask === 'mid' ? `${2 * item.half} ÷ 2 = ؟` : `${item.half} × ${item.half} + ${item.h} × ${item.h} = ${item.na * item.na}`, C8.hl, 16); return {}; },
  h2: async (item, ctx) => { const m = helpG(ctx.svg), F = item._g; if (F) { if (item.ask === 'mid') { hlSeg(m, F.A, F.M, H2C[0]); hlSeg(m, F.M, F.B, H2C[1]); } else { hlSeg(m, F.M, F.A, H2C[0]); hlSeg(m, F.M, F.N, H2C[1]); hlSeg(m, F.N, F.A, H2C[2]); hlRing(m, F.M, 12); } }   /* النصفان، أو المثلث القائم عند م */
    ciRule(m, 180, [24, 230], labelText(item.ask === 'mid' ? 'c8AskMid' : 'c8AskPb'), C8.hl, 15); await sleep(FAST ? 10 : 250); },
  pick: (item, ctx) => { const np = numberPick(shuffle(item.nums), item.want, { west: true }); ctx.np = np; return np.p; },
  errOf: (it, k) => (it.ch.find(([v]) => v === +k) || [])[1] || (it.ask === 'mid' ? 'midOff' : 'pbOff') });

/* ================= ④ أيّ ضلعٍ هذا بالنسبة إلى الزاوية؟ (C409 أ): a، b ضلعا القائمة، side opp | adj | hyp، flip (الزاوية عند الرأس العلوي) ================= */
ITEM.c8Which = cpItem({ H: 236, tLine: 'gen.c8.together.which', hint: 'gen.c8.hint.which', rLine: it => 'gen.c8.side.' + it.side, praise: 'praiseThink',
  make: s => ({ want: s.side, tag: 'c8-which-' + s.side + (s.flip ? '-f' : '') }),
  draw(svg, item, tries) { const g = el('g', {}, svg), u = Math.min(200 / item.a, 124 / item.b), T = c8Tri(g, item.a, item.b, { y0: 190, u, x0: item.flip ? 266 - item.a * u : 60 }), V = item.flip ? T.B : T.A;   /* المقلوب يميناً: الحلقتان على ضلعٍ واحد فتسع البطاقةُ يسارهما (المراجع B لبوابة M4-U7/U8، 5) */ item._g = { ...T, V };   /* أسماء الأضلاع في المستوى الثالث داخل الإطار */
    if (item.flip) arArc(g, T.B, 180 + T.ang, 270, { r: 30, col: C8.bis, fill: true }); else arArc(g, T.A, 0, T.ang, { r: 34, col: C8.bis, fill: true });
    const real = item.flip ? { opp: 'adj', adj: 'opp', hyp: 'hyp' }[item.side] : item.side, P = { opp: [T.C, T.B], adj: [T.A, T.C], hyp: [T.A, T.B] }[real];
    geoLine(g, P[0][0], P[0][1], P[1][0], P[1][1], { color: C8.q, w: 7 }); pfDot(g, V);
    if (tries >= 3) { const L = item.flip ? { adj: labelText('c8S.opp'), opp: labelText('c8S.adj'), hyp: labelText('c8S.hyp') } : { adj: labelText('c8S.adj'), opp: labelText('c8S.opp'), hyp: labelText('c8S.hyp') }; delete L[real]; c8Sides(helpG(svg), T, L, { flip: item.flip }); } return {}; },   /* الثالث يسمّي الضلعين الآخرين ويترك الملوّن (المراجع A لبوابة M4-U7/U8، 6 (ب)) */
  h2: async (item, ctx) => { const m = helpG(ctx.svg), G = item._g; if (G) { hlRing(m, G.C, 14); hlRing(m, G.V, 14, H2C[1]); }   /* الزاوية القائمة والزاوية المعلّمة: الوتر يقابل الأولى، والمقابل يقابل الثانية */
    ciRule(m, 180, [24, 230, [0, 24], [400, 24], [0, 230], [400, 230]], labelText('c8AskSides'), C8.hl, 15); await sleep(FAST ? 10 : 250); },
  pick: item => choosePick(['opp', 'adj', 'hyp'].map(k => [k, labelText('c8S.' + k), '<i></i>', 'gen.c8.side.' + k]), item.want),
  errOf: (it, k) => k === 'hyp' || it.want === 'hyp' ? 'trigHyp' : 'trigSwap' });

/* ================= ⑤ النسبة من أضلاع المثلث (C409): a (المجاور)، b (المقابل)، hy (الوتر)، fn sin | cos | tan ================= */
const c8R2 = v => Math.round(v * 100) / 100;
function c8RatioCh(s0) { const s = s0.flip ? { ...s0, a: s0.b, b: s0.a } : s0, r = { sin: [s.b, s.hy], cos: [s.a, s.hy], tan: [s.b, s.a] }[s.fn], w = c8R2(r[0] / r[1]);   /* flip: الزاوية عند الرأس العلوي، فالمقابل الأفقي (المراجع A لبوابة M4-U7/U8، 4) */   /* ولا مشتّت أقرب من حدّ الدقة 0.05 (المراجع A لبوابة M4-U7/U8، 1 و15) */
  const alt = { sin: [[s.a / s.hy, 'trigSwap'], [s.hy / s.b, 'trigFlip'], [s.b / s.a, 'trigTanFor'], [s.hy / s.a, 'trigOff']], cos: [[s.b / s.hy, 'trigSwap'], [s.hy / s.a, 'trigFlip'], [s.a / s.b, 'trigTanFor'], [s.hy / s.b, 'trigOff']], tan: [[s.a / s.b, 'trigFlip'], [s.b / s.hy, 'trigHypFor'], [s.a / s.hy, 'trigSwap'], [s.hy / s.a, 'trigOff']] }[s.fn];
  return rkPick(w, alt.map(([v, e]) => [c8R2(v), e]), s.rk ?? 0, .05); }
ITEM.c8Ratio = cpItem({ H: 250, tLine: 'gen.c8.together.ratio', hint: it => 'gen.c8.hint.ratio.' + it.fn, rLine: 'gen.c8.reveal.ratio', rSay: it => S('gen.c8.v.' + c8Key(it.want), { append: true }), praise: 'praiseThink',
  make: s => { const ch = c8RatioCh(s); return { want: ch[0][0], ch, tag: 'c8-ratio-' + s.fn }; },
  draw(svg, item, tries) { const g = el('g', {}, svg), u = Math.min(200 / item.a, 132 / item.b), T = c8Tri(g, item.a, item.b, { y0: 204, x0: item.flip ? 266 - item.a * u : 70, u }); item._g = { ...T, V: item.flip ? T.B : T.A };
    const ra = Math.max(14, Math.min(34, .6 * (T.C[0] - T.A[0]), .6 * (T.C[1] - T.B[1])));   /* القوس لا يبلغ القائمة (المراجع B لبوابة M4-U7/U8، 7) */
    if (item.flip) arArc(g, T.B, 180 + T.ang, 270, { r: ra, col: C8.bis, fill: true }); else arArc(g, T.A, 0, T.ang, { r: ra, col: C8.bis, fill: true });
    c8Sides(g, T, { adj: MS(String(item.a)), opp: MS(String(item.b)), hyp: MS(String(item.hy)) }, { flip: item.flip }); c8FnLabel(g, 270, 40, item.fn, null, { tail: '؟ =' });
    if (tries >= 3) { const o = item.flip ? item.a : item.b, j = item.flip ? item.b : item.a, r = { sin: [o, item.hy], cos: [j, item.hy], tan: [o, j] }[item.fn]; ciEq(helpG(svg), 110, 40, `${r[0]} ÷ ${r[1]} = ؟`, C8.hl, 17); } return {}; },
  h2: async (item, ctx) => { const m = helpG(ctx.svg), G = item._g; if (G) { hlRing(m, G.C, 14); hlRing(m, G.V, 14, H2C[1]); }   /* القائمة والزاوية المعلّمة، والسؤال عن الضلع أمام كلٍّ منهما (المراجع A لبوابة M4-U7/U8، 6) */
    ciRule(m, 180, [70, [180, 54], [0, 70], [400, 70], 236, [0, 236], [400, 236]], labelText('c8AskRatio'), C8.hl, 15); await sleep(FAST ? 10 : 250); },
  pick: item => choosePick(shuffle(item.ch.map(([v]) => [String(v), MS(String(v)), '<i></i>', 'gen.c8.v.' + c8Key(v)])), String(item.want)),
  errOf: (it, k) => (it.ch.find(([v]) => String(v) === k) || [])[1] || 'trigOff' });
ITEM.c8Ratio.judge = (item, k) => k === String(item.want) ? { ok: true } : { ok: false, err: (item.ch.find(([v]) => String(v) === k) || [])[1] || 'trigOff' };

/* ================= ⑥ من الجدول المكتشف (C409): fn، deg (30 | 45 | 60) ================= */
ITEM.c8Table = cpItem({ H: 250, tLine: 'gen.c8.together.table', hint: 'gen.c8.hint.table', rLine: 'gen.c8.reveal.ratio', rSay: it => S('gen.c8.v.' + c8Key(it.want), { append: true }), praise: 'praiseThink',
  make: s => { const w = C8_T[s.fn][s.deg], other = s.fn === 'tan' ? [C8_T.sin[s.deg], s.deg === 45 ? 45 : C8_T.tan[90 - s.deg]] : [C8_T[s.fn === 'sin' ? 'cos' : 'sin'][s.deg], s.deg === 30 && s.fn === 'sin' ? .3 : +(s.deg / 100).toFixed(2)];   /* والزاوية عند الرأس العلوي بـ flip (المراجع A لبوابة M4-U7/U8، 4) */
    const ch = [w, ...other].filter((v, i, X) => X.indexOf(v) === i); if (ch.length < 3) ch.push(s.fn === 'tan' ? .5 : 1); return { want: w, ch, tag: 'c8-table-' + s.fn }; },
  draw(svg, item, tries) { const g = el('g', {}, svg), d = item.flip ? 90 - item.deg : item.deg, a = d === 30 ? 1.73 : 1, u = d === 30 ? 120 : d === 45 ? 140 : 92, sh = item.flip || d === 60, T = c8Tri(g, a, d === 60 ? 1.73 : 1, { y0: 204, x0: sh ? 266 - a * u : d === 30 ? 60 : 80, u });   /* الطويل والمقلوب يميناً، والدالة يساراً، فتسع البطاقةُ أعلى اليسار (المراجع B لبوابة M4-U7/U8، 5) */ item._g = { ...T, V: item.flip ? T.B : T.A };
    if (item.flip) arArc(g, T.B, 180 + T.ang, 270, { r: 34, col: C8.bis, deg: item.deg, dl: 22, fs: 14, fill: true }); else arArc(g, T.A, 0, T.ang, { r: 34, col: C8.bis, deg: item.deg, dl: 22, fs: 14, fill: true }); c8FnLabel(g, sh ? 110 : 250, 40, item.fn, item.deg);
    if (tries >= 3) { const h = helpG(svg); c8Sides(h, T, { adj: labelText('c8S.adj'), opp: labelText('c8S.opp'), hyp: labelText('c8S.hyp') }, { flip: item.flip }); } return {}; },
  sayQ: async it => { await sayDeg(it.deg); await S('gen.c8.q.tableEnd', { append: true, sep: '، ' }); },
  h2: async (item, ctx) => { const m = helpG(ctx.svg), G = item._g; if (G) { hlRing(m, G.C, 14); hlRing(m, G.V, 14, H2C[1]); }
    ciRule(m, 150, [80, [0, 80], [400, 80], 236, [0, 236], [400, 236]], labelText('c8AskRatio'), C8.hl, 15); await sleep(FAST ? 10 : 250); },
  pick: item => choosePick(shuffle(item.ch.map(v => [String(v), MS(String(v)), '<i></i>', 'gen.c8.v.' + c8Key(v)])), String(item.want)),
  errOf: (it, k) => +k === .3 ? 'trig03' : +k === it.deg ? 'trigDeg' : it.fn !== 'tan' && +k === +(it.deg / 100).toFixed(2) ? 'trigDeg100' : it.fn === 'tan' && it.deg !== 45 && +k === C8_T.tan[90 - it.deg] ? 'trigTanSwap' : it.fn !== 'tan' && +k === C8_T[it.fn === 'sin' ? 'cos' : 'sin'][it.deg] ? 'trigSinCos' : 'trigOff' });   /* وسومٌ لأخطاءٍ حقيقية (المراجع A لبوابة M4-U7/U8، 7) */

{ const j0 = ITEM.c8Table.judge; ITEM.c8Table.judge = (item, k) => k === String(item.want) ? { ok: true } : j0(item, k); }   /* مفاتيح الاختيار نصوص والجواب عدد */
/* ================= ⑦ الارتفاع بزاوية النظر (C409 ب): dist، deg (30 | 45 | 60)، what tree | pole ================= */
function c8Survey(g, dist, deg, o = {}) { const G0 = [52, o.y ?? 206], k = Math.min(230 / dist, (o.hmax || 150) / (dist * C8_T.tan[deg])), X = [G0[0] + dist * k, G0[1]], Top = [X[0], G0[1] - dist * C8_T.tan[deg] * k];
  geoLine(g, 20, G0[1], 340, G0[1], { color: '#8b7d6b', w: 4 });
  if (o.lamp) { el('rect', { x: X[0] - 3, y: Top[1], width: 6, height: X[1] - Top[1], fill: '#5b6b75' }, g); el('path', { d: `M${X[0]} ${Top[1]} Q${X[0] - 14} ${Top[1] - 6} ${X[0] - 22} ${Top[1] + 4}`, fill: 'none', stroke: '#5b6b75', 'stroke-width': 4 }, g); el('circle', { cx: X[0] - 22, cy: Top[1] + 9, r: 6, fill: '#f6d55c', stroke: '#9a7b16', 'stroke-width': 1.4 }, g); }   /* عمود إنارة (المراجع A لبوابة M4-U7/U8، 5) */
  else { el('rect', { x: X[0] - 5, y: Top[1], width: 10, height: X[1] - Top[1], fill: '#7d5a3a' }, g); el('circle', { cx: X[0], cy: Top[1] + 6, r: 18, fill: '#6aa84f', opacity: .9 }, g); } geoLine(g, G0[0], G0[1], Top[0], Top[1], { color: C8.bis, w: 2.6, dash: '7 5' });
  el('circle', { cx: G0[0], cy: G0[1] - 8, r: 7, fill: '#e8b989', stroke: C8.ink, 'stroke-width': 1.6 }, g); preRight(g, X, G0, Top, 11); return { G0, X, Top, k }; }
ITEM.c8Height = cpItem({ H: 262, tLine: 'gen.c8.together.height', hint: 'gen.c8.hint.height', rLine: 'gen.c8.reveal.height', rSay: it => S(ciLine(it.want, 'm'), { append: true }), praise: 'praiseThink',
  make: s => { const t = C8_T.tan[s.deg], R = v => Math.round(v * 10) / 10, w = R(s.dist * t);   /* المسافة ÷ ظا وجتا فوق الجواب أو تحته بحسب الزاوية (المراجع A لبوابة M4-U7/U8، 1) */
    const P = [[R(s.dist * C8_T.sin[s.deg]), 'hSin'], [R(s.dist / t), 'hDiv'], [R(s.dist * C8_T.cos[s.deg]), 'hCos'], [R(s.dist / C8_T.cos[s.deg]), 'hHyp']], n = new Set(P.map(([v]) => v).filter(v => v > 0 && v !== w)).size;   /* خطّ النظر خطأٌ حقيقي، و«المسافة × الدرجات» احتياطٌ لا يُرى إلا عند الحاجة (المراجع A لبوابة M4-U7/U8، 15) */
    return { want: w, ch: rkPick(w, n >= 2 ? P : [...P, [s.dist * s.deg, 'hAngle']], s.rk ?? 0), tag: 'c8-height' }; },
  draw(svg, item, tries) { const g = el('g', {}, svg), F = c8Survey(g, item.dist, item.deg, { y: 180, hmax: 124 }); item._g = F; arArc(g, F.G0, 0, Math.atan2(F.G0[1] - F.Top[1], F.Top[0] - F.G0[0]) * 180 / Math.PI, { r: 40, col: C8.bis, deg: item.deg, dl: 20, fs: 14, fill: true });
    preLab(g, (F.G0[0] + F.X[0]) / 2, F.G0[1] + 22, ciTxt(item.dist, 'm'), { fs: 15, dir: 'rtl' }); preLab(g, F.X[0] + 26, (F.X[1] + F.Top[1]) / 2, '؟', { fs: 20, col: C8.q });
    const tl = el('g', { 'pointer-events': 'none' }, svg); c8FnLabel(tl, 110, 40, 'tan', item.deg, { fs: 16, tail: MS(String(C8_T.tan[item.deg])) + ' =' });
    if (tries >= 3) ciEq(helpG(svg), 270, 40, `${item.dist} × ${C8_T.tan[item.deg]} = ؟`, C8.hl, 16); return {}; },
  h2: async (item, ctx) => { const m = helpG(ctx.svg), F = item._g; if (F) { hlSeg(m, F.G0, F.X, H2C[0]); hlSeg(m, F.X, F.Top, H2C[1]); hlRing(m, F.X, 13); }   /* المثلث القائم: المسافة والارتفاع */
    ciRule(m, 250, [236, [250, 62]], labelText('c8AskHeight'), C8.hl, 15);   /* تحت تسمية المسافة لا عليها (المراجع B لبوابة M4-U7/U8، 5) */ await sleep(FAST ? 10 : 250); },
  pick: item => choosePick(shuffle(item.ch.map(([v]) => [String(v), ciTxt(v, 'm'), '<i></i>', ciLine(v, 'm')])), String(item.want)),
  errOf: (it, k) => (it.ch.find(([v]) => String(v) === k) || [])[1] || 'hOff' });
ITEM.c8Height.judge = (item, k) => k === String(item.want) ? { ok: true } : { ok: false, err: (item.ch.find(([v]) => String(v) === k) || [])[1] || 'hOff' };

/* ---------- البراهين والإنشاءان (pfFig) ---------- */
Object.assign(PF_PROOFS, { bisPf: { rs: ['distPerp', 'tri', 'asa'] }, pbPf: { rs: ['mid', 'perpDef', 'sas'] }, bisCon: { rs: ['conArcV', 'conArcs', 'sss'] }, perpCon: { rs: ['conHalf', 'conSame', 'conJoin'] } });
function c8Fig(g, k, o = {}) { const y0 = o.y0 ?? 0, s = o.s || 1, T = (x, y) => [180 + (x - 180) * s, y0 + y * s];
  if (k === 'bisPf' || k === 'bisCon') { const V = T(70, 130), d = 44, L = 230 * s; for (const a of [0, d]) { const P = c8Ray(V, a, a ? 165 * s : L);   /* أقصر ارتفاعاً ليكبر في السلسلة والتعليل داخل الإطار (المعروف (1) لبوابة M4-U7/U8) */ geoLine(g, V[0], V[1], P[0], P[1], { color: C8.ray, w: 3 }); }
    const Q = c8Ray(V, d / 2, 205 * s); geoLine(g, V[0], V[1], Q[0], Q[1], { color: C8.bis, w: 2.8, dash: '7 5' }); pfDot(g, V); pfLab(g, V[0] - 12, V[1] + 4, 'أ', { fs: 15 });
    if (k === 'bisCon') { const r1 = 90 * s, P1 = c8Ray(V, 0, r1), P2 = c8Ray(V, d, r1); el('path', { d: angArc(V, r1, -8, d + 8), fill: 'none', stroke: C8.arc, 'stroke-width': 2.2 }, g);
      const t = r1 * Math.cos(d / 2 * Math.PI / 180) + Math.sqrt((80 * s) ** 2 - (r1 * Math.sin(d / 2 * Math.PI / 180)) ** 2), X = c8Ray(V, d / 2, t);
      for (const P of [P1, P2]) { const a = Math.atan2(P[1] - X[1], X[0] - P[0]) * 180 / Math.PI; el('path', { d: angArc(P, 80 * s, a - 16, a + 16), fill: 'none', stroke: C8.arc, 'stroke-width': 2.2 }, g); pfDot(g, P); } pfDot(g, X); return { V, X }; }   /* القوسان يتقاطعان عند X (كانا في الجهة المقابلة) */
    const N = c8Ray(V, d / 2, 150 * s), F1 = [N[0], V[1]], u = [Math.cos(d * Math.PI / 180), -Math.sin(d * Math.PI / 180)], t = (N[0] - V[0]) * u[0] + (N[1] - V[1]) * u[1], F2 = [V[0] + u[0] * t, V[1] + u[1] * t];
    for (const F of [F1, F2]) { geoLine(g, N[0], N[1], F[0], F[1], { color: C8.opp, w: 2.6 }); preRight(g, F, N, V, 8); pfDot(g, F); } pfDot(g, N); pfLab(g, N[0] + 11, N[1] + 15, 'ن', { fs: 15 });   /* تحت المنصّف لا عليه */
    pfLab(g, F1[0], F1[1] + 17, 'هـ', { fs: 14 }); pfLab(g, F2[0] - 14, F2[1] + 1, 'و', { fs: 14 });   /* يسار القدم لا فوق طرف الشعاع (المراجعة البصرية للبوابة) */ return { V, N }; }
  const M = T(180, 130), h = 96 * s, A = [M[0] - 110 * s, M[1]], B = [M[0] + 110 * s, M[1]];
  geoLine(g, A[0], A[1], B[0], B[1], { color: C8.ink, w: 3.2 }); [A, B].forEach(X => pfDot(g, X)); pfLab(g, A[0] - 10, A[1] + 6, 'أ', { fs: 15 }); pfLab(g, B[0] + 10, B[1] + 6, 'ب', { fs: 15 });
  if (k === 'perpCon') { const r = 140 * s, dy = Math.sqrt(r * r - (110 * s) ** 2), X1 = [M[0], M[1] - dy], X2 = [M[0], M[1] + dy];
    for (const [P, sg] of [[A, 1], [B, -1]]) for (const X of [X1, X2]) { const a = Math.atan2(P[1] - X[1], X[0] - P[0]) * 180 / Math.PI; el('path', { d: angArc(P, r, a - 9, a + 9), fill: 'none', stroke: C8.arc, 'stroke-width': 2.2 }, g); void sg; }
    geoLine(g, X1[0], X1[1], X2[0], X2[1], { color: C8.bis, w: 2.8, dash: '7 5' }); [X1, X2].forEach(X => pfDot(g, X)); return { M }; }
  const N = [M[0], M[1] - h]; geoLine(g, M[0], M[1] + 8, M[0], M[1] - h - 14, { color: C8.bis, w: 2.6, dash: '7 5' }); geoLine(g, N[0], N[1], A[0], A[1], { color: C8.opp, w: 2.8 }); geoLine(g, N[0], N[1], B[0], B[1], { color: C8.opp, w: 2.8 });
  preRight(g, M, B, N, 9); [M, N].forEach(X => pfDot(g, X)); pfLab(g, M[0] - 10, M[1] + 16, 'م', { fs: 15 }); pfLab(g, N[0] + 12, N[1] - 2, 'ن', { fs: 15 }); return { M, N }; }
/* صورة بطاقة التعليل (pfReasonPic، المفتاح c8): fig (أحد الأشكال أعلاه)، أو tri [a، b]، أو survey [dist، deg]، أو bis deg */
function c8Pic(g, P) { if (P.fig) return c8Fig(g, P.fig, { y0: 20, s: .9 }); if (P.survey) return c8Survey(g, P.survey[0], P.survey[1], { y: 186, lamp: P.lamp });
  /* صورٌ جديدة لا صور المشاهد ولا أشكال البرهان (المراجع A لبوابة M4-U7/U8، 5) */
  if (P.bisPt) { const V = [62, 176], d = P.bisPt, N = c8Ray(V, d / 2, 150); c8Angle(g, V, d, { L: 220 }); const u = [Math.cos(d * Math.PI / 180), -Math.sin(d * Math.PI / 180)], t = (N[0] - V[0]) * u[0] + (N[1] - V[1]) * u[1], F2 = [V[0] + u[0] * t, V[1] + u[1] * t], F1 = [N[0], V[1]];
    for (const F of [F1, F2]) { geoLine(g, N[0], N[1], F[0], F[1], { color: C8.opp, w: 2.6, dash: '5 4' }); preRight(g, F, N, V, 8); } pfDot(g, N); pfLab(g, N[0] + 12, N[1] - 4, 'ن', { fs: 15 }); return; }
  if (P.seg) { const A = [70, 150], B = [290, 150], M = [180, 150]; geoLine(g, A[0], A[1], B[0], B[1], { color: C8.ink, w: 3.2 }); [A, B].forEach(X => pfDot(g, X)); pfLab(g, A[0] - 10, A[1] + 6, 'أ', { fs: 15 }); pfLab(g, B[0] + 10, B[1] + 6, 'ب', { fs: 15 });
    if (P.through) { geoLine(g, A[0], A[1] + 20, A[0], 30, { color: C8.bis, w: 2.8, dash: '7 5' }); preRight(g, A, B, [A[0], 40], 9); return; }
    const N = [180, 54]; geoLine(g, M[0], M[1] + 16, M[0], 34, { color: C8.bis, w: 2.6, dash: '7 5' }); preRight(g, M, B, N, 9); for (const X of [A, B]) geoLine(g, N[0], N[1], X[0], X[1], { color: C8.opp, w: 2.6 }); pfDot(g, N); pfLab(g, N[0] + 14, N[1] - 2, 'ن', { fs: 15 }); return; }
  if (P.nest) { const T = c8Tri(g, 2, 1.2, { y0: 176, x0: 70, u: 110 }), s = .5, Cs = [T.A[0] + (T.C[0] - T.A[0]) * s, T.A[1]], Bs = [Cs[0], T.A[1] - (T.A[1] - T.B[1]) * s]; geoLine(g, Cs[0], Cs[1], Bs[0], Bs[1], { color: C8.opp, w: 3 }); preRight(g, Cs, T.A, Bs, 9); arArc(g, T.A, 0, T.ang, { r: 30, col: C8.bis, fill: true }); return; }
  if (P.ramps) { for (const [x0, u] of [[40, 50], [150, 100]]) { const T = c8Tri(g, 1.6, .7, { y0: 170, x0, u }); arArc(g, T.A, 0, T.ang, { r: 24, col: C8.bis, fill: true }); } return; }
  if (P.bis) { const V = [70, 170]; c8Angle(g, V, P.bis, { L: 200 }); arArc(g, V, 0, P.bis / 2, { r: 60, col: C8.bis, deg: P.bis / 2, dl: 18, fs: 14, fill: true }); arArc(g, V, P.bis / 2, P.bis, { r: 60, col: C8.ray, deg: P.bis / 2, dl: 18, fs: 14, fill: true }); return; }
  const T = c8Tri(g, P.tri[0], P.tri[1], { y0: 176, x0: 80, u: Math.min(190 / P.tri[0], 130 / P.tri[1]) }); arArc(g, T.A, 0, T.ang, { r: 30, col: C8.bis, ...(P.deg ? { deg: P.deg, dl: 20, fs: 13 } : {}), fill: true });
  if (P.labs) c8Sides(g, T, { adj: MS(String(P.tri[0])), opp: MS(String(P.tri[1])), hyp: P.tri[2] != null ? MS(String(P.tri[2])) : null }); }

/* ================= المشاهد ================= */
/* د1: فوضى تنصّف بالمسطرة والنظر؛ والإنشاء بالفرجار خطوةً خطوة */
SCENES.c8BisHook = async c => { const L = c.lines, svg = m3Stage(250), g = el('g', { 'pointer-events': 'none' }, svg), V = [70, 200]; c8Angle(g, V, 60, { bis: false }); arArc(g, V, 0, 60, { r: 40, col: C8.ray, deg: 60, dl: 20, fs: 15 }); await c8Say(L, 0);
  const Q = c8Ray(V, 34, 220); geoLine(g, V[0], V[1], Q[0], Q[1], { color: C8.q, w: 3, dash: '6 5' }); SFX.tick(); await c8Say(L, 1); for (const l of L.slice(2)) await S(l); };
SCENES.c8BisBuild = async c => { const L = c.lines, svg = m3Stage(250), g = el('g', { 'pointer-events': 'none' }, svg), V = [64, 206], d = c.deg || 60, r1 = 100, r2 = 86;
  for (const a of [0, d]) { const P = c8Ray(V, a, c8Fit(V, a, 250)); geoLine(g, V[0], V[1], P[0], P[1], { color: C8.ray, w: 3.4 }); } pfDot(g, V);   /* الأشعة داخل الإطار (TXSTRICT) */
  const P1 = c8Ray(V, 0, r1), P2 = c8Ray(V, d, r1); el('path', { d: angArc(V, r1, -8, d + 8), fill: 'none', stroke: C8.arc, 'stroke-width': 2.6 }, g); [P1, P2].forEach(X => pfDot(g, X)); SFX.tick(); await c8Say(L, 0);
  const t = r1 * Math.cos(d / 2 * Math.PI / 180) + Math.sqrt(r2 * r2 - (r1 * Math.sin(d / 2 * Math.PI / 180)) ** 2), X = c8Ray(V, d / 2, t);
  for (const P of [P1, P2]) { const a = Math.atan2(P[1] - X[1], X[0] - P[0]) * 180 / Math.PI; el('path', { d: angArc(P, r2, a - 14, a + 14), fill: 'none', stroke: C8.arc, 'stroke-width': 2.6 }, g); SFX.tick(); await sleep(FAST ? 5 : 400); }
  pfDot(g, X); await c8Say(L, 1); const Q = c8Ray(V, d / 2, c8Fit(V, d / 2, 250)); geoLine(g, V[0], V[1], Q[0], Q[1], { color: C8.bis, w: 3.4 }); arArc(g, V, 0, d / 2, { r: 54, col: C8.bis, deg: d / 2, dl: 18, fs: 14, fill: true }); arArc(g, V, d / 2, d, { r: 54, col: C8.ray, deg: d / 2, dl: 18, fs: 14, fill: true }); SFX.tick(); await c8Say(L, 2); for (const l of L.slice(3)) await S(l); };
/* د2: المنتصف بالنظر؛ والإنشاء: قوسان بالفتحة نفسها من الطرفين */
SCENES.c8PbHook = async c => { const L = c.lines, svg = m3Stage(250), g = el('g', { 'pointer-events': 'none' }, svg), A = [70, 140], B = [290, 140]; geoLine(g, A[0], A[1], B[0], B[1], { color: C8.ink, w: 3.6 }); [A, B].forEach(X => pfDot(g, X)); await c8Say(L, 0);
  el('circle', { cx: 196, cy: 140, r: 6, fill: C8.q }, g); preLab(g, 196, 120, '؟', { fs: 20, col: C8.q }); SFX.tick(); await c8Say(L, 1); for (const l of L.slice(2)) await S(l); };
SCENES.c8PbBuild = async c => { const L = c.lines, svg = m3Stage(250), g = el('g', { 'pointer-events': 'none' }, svg), A = [80, 130], B = [280, 130], r = 130, dy = Math.sqrt(r * r - 100 * 100), X1 = [180, 130 - dy], X2 = [180, 130 + dy];
  geoLine(g, A[0], A[1], B[0], B[1], { color: C8.ink, w: 3.6 }); [A, B].forEach(X => pfDot(g, X)); pfLab(g, A[0] - 10, A[1] + 6, 'أ', { fs: 15 }); pfLab(g, B[0] + 10, B[1] + 6, 'ب', { fs: 15 });
  for (const [i, P] of [A, B].entries()) { for (const X of [X1, X2]) { const a = Math.atan2(P[1] - X[1], X[0] - P[0]) * 180 / Math.PI; el('path', { d: angArc(P, r, a - 12, a + 12), fill: 'none', stroke: C8.arc, 'stroke-width': 2.6 }, g); } SFX.tick(); await c8Say(L, i); }
  [X1, X2].forEach(X => pfDot(g, X)); geoLine(g, X1[0], X1[1], X2[0], X2[1], { color: C8.bis, w: 3.4 }); preRight(g, [180, 130], B, X1, 10); preTicks(g, A, [180, 130], 1, C8.ok); preTicks(g, [180, 130], B, 1, C8.ok); SFX.tick(); await c8Say(L, 2); for (const l of L.slice(3)) await S(l); };
/* د3: الوتر أطول الأضلاع؛ والجدول المكتشف بالقياس */
SCENES.c8TrigHook = async c => { const L = c.lines, svg = m3Stage(250), g = el('g', { 'pointer-events': 'none' }, svg), T = c8Tri(g, 8.7, 5, { u: 24, y0: 200 }); arArc(g, T.A, 0, 30, { r: 40, col: C8.bis, deg: 30, dl: 20, fs: 14, fill: true }); await c8Say(L, 0);
  c8Sides(g, T, { adj: MS('8.7'), opp: MS('5'), hyp: MS('10') }, { hl: { hyp: true } }); SFX.tick(); await c8Say(L, 1); for (const l of L.slice(2)) await S(l); };
/* المقابل والمجاور بالنسبة إلى الزاوية، وتبادلهما حين تُعلَّم الزاوية الأخرى، بتوقّعٍ بينهما (المراجع A لبوابة M4-U7/U8، 4) */
SCENES.c8SidesShow = async c => { const L = c.lines, svg = m3Stage(250); let g = el('g', { 'pointer-events': 'none' }, svg), T = c8Tri(g, 4, 3, { u: 46, y0: 200, x0: 80 });
  arArc(g, T.A, 0, T.ang, { r: 34, col: C8.bis, fill: true }); c8Sides(g, T, { adj: labelText('c8S.adj'), opp: labelText('c8S.opp'), hyp: labelText('c8S.hyp') }); await c8Say(L, 0);
  g.remove(); g = el('g', { 'pointer-events': 'none' }, svg); T = c8Tri(g, 4, 3, { u: 46, y0: 200, x0: 80 }); arArc(g, T.B, 180 + T.ang, 270, { r: 30, col: C8.bis, fill: true });
  c8Sides(g, T, { adj: labelText('c8S.opp'), opp: labelText('c8S.adj'), hyp: labelText('c8S.hyp') }, { flip: true }); SFX.tick(); await c8Say(L, 1); for (const l of L.slice(2)) await S(l); };
/* الجدول بالقياس: المسطرة على المقابل يقرؤها الطفل ثم يقسم (المراجع A لبوابة M4-U7/U8، 8) */
SCENES.c8TableShow = async c => { const L = c.lines, svg = m3Stage(262), mz = L[0] === 'tb.00' ? 1 : 0; let g = null;
  for (const [i, [d, a, b]] of [[30, 1.73, 1], [45, 1, 1], [60, 1, 1.73]].entries()) { if (g) g.remove(); g = el('g', { 'pointer-events': 'none' }, svg); const T = c8Tri(g, a, b, { u: d === 45 ? 120 : d === 30 ? 118 : 80, y0: 206, x0: !i && mz ? 26 : 50 }); arArc(g, T.A, 0, d, { r: 36, col: C8.bis, deg: d, dl: 22, fs: 14, fill: true });
    c8Sides(g, T, { adj: labelText('c8S.adj'), opp: labelText('c8S.opp'), hyp: labelText('c8S.hyp') });
    if (!i && mz) { const rg = el('g', {}, g), x = T.C[0] + 76, y0 = T.C[1], y1 = T.B[1], st = (y0 - y1) / 5; el('rect', { x: x - 8, y: y1 - 6, width: 24, height: y0 - y1 + 12, rx: 3, fill: '#fbf1c7', stroke: '#9a7b16', 'stroke-width': 1.4 }, rg);
      for (let k = 0; k <= 5; k++) { geoLine(rg, x - 8, y0 - k * st, x + 2, y0 - k * st, { color: '#7a5a16', w: 1.4 }); el('text', { x: x + 9, y: y0 - k * st + 4, 'text-anchor': 'middle', 'font-size': 10, fill: '#7a5a16', direction: 'ltr' }, rg).textContent = String(k); }
      preLab(rg, (T.A[0] + T.B[0]) / 2 - 18, (T.A[1] + T.B[1]) / 2 + 27, MS('10'), { fs: 15, col: C8.hyp }); await c8Say(L, 0); rg.remove(); }   /* المسطرة بعد تسمية المقابل لا تحتها، وتُرفع قبل الجدول (المراجعة البصرية للبوابة) */   /* الوتر عشرة، والمقابل يُقرأ على المسطرة */
    c8FnLabel(g, 260, 34, 'sin', d, { fs: 16, tail: MS(String(C8_T.sin[d])) + ' =' }); c8FnLabel(g, 260, 64, 'cos', d, { fs: 16, tail: MS(String(C8_T.cos[d])) + ' =' }); if (!i) preLab(g, 300, 92, '(sin ، cos)', { fs: 14, col: '#7d8a90' });   /* اللاتيني عند أول ظهور فقط (D190) */ SFX.tick(); await c8Say(L, i + mz); }
  for (const l of L.slice(3 + mz)) await S(l); };
/* د3: النسبة ثابتة للزاوية الواحدة: مثلثان متشابهان */
SCENES.c8SimShow = async c => { const L = c.lines, svg = m3Stage(250), g = el('g', { 'pointer-events': 'none' }, svg), T1 = c8Tri(g, 4, 3, { u: 22, x0: 30, y0: 200 }), T2 = c8Tri(g, 8, 6, { u: 22, x0: 140, y0: 200 });
  for (const T of [T1, T2]) arArc(g, T.A, 0, T.ang, { r: 24, col: C8.bis, fill: true }); c8Sides(g, T1, { adj: MS('4'), opp: MS('3'), hyp: MS('5') }); c8Sides(g, T2, { adj: MS('8'), opp: MS('6'), hyp: MS('10') }); await c8Say(L, 0);
  ciEq(g, 180, 30, '3 ÷ 5 = 6 ÷ 10 = 0.6', C8.ok, 17); SFX.tick(); await c8Say(L, 1); for (const l of L.slice(2)) await S(l); };
/* د4: ظا، ومسح الارتفاع، وحكاية البيروني (تُروى ولا تُختبر) */
SCENES.c8TanShow = async c => { const L = c.lines, svg = m3Stage(250), g = el('g', { 'pointer-events': 'none' }, svg), T = c8Tri(g, 1, 1, { u: 140, y0: 210, x0: 70 }); arArc(g, T.A, 0, 45, { r: 40, col: C8.bis, deg: 45, dl: 22, fs: 14, fill: true });
  c8Sides(g, T, { adj: labelText('c8S.adj'), opp: labelText('c8S.opp') }, { hl: { adj: true, opp: true } }); await c8Say(L, 0); c8FnLabel(g, 270, 40, 'tan', 45, { fs: 17, tail: MS('1') + ' =' }); preLab(g, 300, 66, '(tan)', { fs: 14, col: '#7d8a90' }); SFX.tick(); await c8Say(L, 1); for (const l of L.slice(2)) await S(l); };
SCENES.c8SurveyShow = async c => { const L = c.lines, svg = m3Stage(250); let g = null;
  if (c.mapOnly) { g = el('g', { 'pointer-events': 'none' }, svg); const F = c8Survey(g, 12, 30); arArc(g, F.G0, 0, Math.atan2(F.G0[1] - F.Top[1], F.Top[0] - F.G0[0]) * 180 / Math.PI, { r: 40, col: C8.bis, lab: '؟', dl: 20, fs: 15, fill: true });
    preLab(g, (F.G0[0] + F.X[0]) / 2, F.G0[1] + 22, ciTxt(12, 'm'), { fs: 15, dir: 'rtl' }); preLab(g, F.X[0] + 26, (F.X[1] + F.Top[1]) / 2, '؟', { fs: 20, col: C8.q }); await c8Say(L, 0); await c8Say(L, 1); for (const l of L.slice(2)) await S(l); return; }   /* المشروع بمعطياته وحدها (المراجع A لبوابة M4-U7/U8، 2) */
  for (const [i, [dist, deg, h]] of [[10, 45, '10'], [10, 30, '5.8']].entries()) { if (g) g.remove(); g = el('g', { 'pointer-events': 'none' }, svg); const F = c8Survey(g, dist, deg); arArc(g, F.G0, 0, Math.atan2(F.G0[1] - F.Top[1], F.Top[0] - F.G0[0]) * 180 / Math.PI, { r: 40, col: C8.bis, deg, dl: 20, fs: 14, fill: true });
    preLab(g, (F.G0[0] + F.X[0]) / 2, F.G0[1] + 22, ciTxt(dist, 'm'), { fs: 15, dir: 'rtl' }); ciEq(g, 180, 30, `${dist} × ${C8_T.tan[deg]} = ${h}`, C8.ok, 17); SFX.tick(); await c8Say(L, i); }
  for (const l of L.slice(2)) await S(l); };
SCENES.c8BiruniShow = async c => { const L = c.lines, svg = m3Stage(250), g = el('g', { 'pointer-events': 'none' }, svg), O = [180, 330], R = 200, P = [180, 112], T = angP(O, 90 - 26, R);
  el('path', { d: angArc(O, R, 40, 140), fill: 'none', stroke: '#5c8f43', 'stroke-width': 4 }, g); el('path', { d: `M${P[0] - 30} ${O[1] - R + 2} L${P[0]} ${P[1]} L${P[0] + 30} ${O[1] - R + 2} Z`, fill: '#a58f6f', stroke: '#7b6a50', 'stroke-width': 2 }, g); await c8Say(L, 0);
  geoLine(g, P[0], P[1], T[0] + (T[0] - P[0]) * .3, T[1] + (T[1] - P[1]) * .3, { color: C8.bis, w: 2.6, dash: '7 5' }); { const k = (O[1] - 232) / (O[1] - T[1]); geoLine(g, O[0] + (T[0] - O[0]) * k, 232, T[0], T[1], { color: C8.hyp, w: 2.6 }); }   /* نصف القطر من حافة الإطار، والمركز تحته */ preRight(g, T, O, P, 10); pfDot(g, T); SFX.tick(); await c8Say(L, 1);
  for (const l of L.slice(2)) await S(l); };
WRAP_ART.trigArt = svg => { const g = el('g', { 'pointer-events': 'none' }, svg), T = c8Tri(g, 4, 3, { u: 30, x0: 120, y0: 190 }); arArc(g, T.A, 0, T.ang, { r: 30, col: C8.bis, fill: true }); };
