/* =====================================================================
   M4-U6 «الدائرة الكاملة» (المرحلة 4، نوفمبر 2026)
   د1 الأوتار والأقواس والعمود من المركز ينصّف الوتر (C403 أ) · د2 المماس وعموديته على نصف القطر (C403 ب) · د3 الزاوية المحيطية نصف المركزية (C412)
   د4 طول القوس ومساحة القطاع (C418) ومشروع «حديقة القوس»
   البرهانان داخل الوحدة (D242): العمود ينصّف الوتر بالقائمين المتطابقين، والمحيطية نصف المركزية في حالة الضلع المارّ بالمركز
   ===================================================================== */
const C6 = { disc: '#f6fbf4', ink: '#24323a', r: '#2f7fc1', ch: '#d9822b', tan: '#7a4fb0', arc: '#c0392b', ok: '#2f9d6b', q: '#c0392b', sec: 'rgba(217,130,43,.28)', hl: SO.hl };
const c6Say = async (L, i) => { if (L[i]) await S(L[i]); };
function c6Circle(g, O, R, o = {}) { el('circle', { cx: O[0], cy: O[1], r: R, fill: o.fill || C6.disc, stroke: C6.ink, 'stroke-width': o.w || 3, 'pointer-events': 'none' }, g); if (o.center !== false) pfDot(g, O); if (o.lab) pfLab(g, O[0] + 12, O[1] - 8, o.lab, { fs: 15 }); }
const c6Seg = (g, P, Q, col, w = 3.4, dash) => geoLine(g, P[0], P[1], Q[0], Q[1], { color: col, w, dash });
/* نصّ عددٍ عند موضع (بـ«أرقامي») */
const c6Num = (g, x, y, v, o = {}) => preLab(g, x, y, v === '؟' ? '؟' : MS(String(v)), { col: o.col || C6.ink, fs: o.fs || 16, anchor: o.anchor || 'middle' });
/* الوتر الأفقي على بعد d تحت المركز: يعيد طرفيه ومنتصفه */
function c6Chord(O, R, d) { const h = Math.sqrt(Math.max(0, R * R - d * d)), y = O[1] + d; return { A: [O[0] - h, y], B: [O[0] + h, y], M: [O[0], y], h }; }

/* ================= ① هل القطعة وتر؟ (C403 أ): seg chord | diam | rad | in، rot زاوية البدء ================= */
const C6_SEG = (O, R, seg, a) => seg === 'diam' ? [angP(O, a, R), angP(O, a + 180, R)] : seg === 'rad' ? [O, angP(O, a, R)] : seg === 'in' ? [angP(O, a, R), angP(O, a + 150, R * .42)] : [angP(O, a, R), angP(O, a + 115, R)];
ITEM.ci4Chord = cpItem({ H: 236, tLine: 'gen.ci4.together.chord', hint: 'gen.ci4.hint.chord', rLine: it => 'gen.ci4.reveal.chord.' + it.seg, praise: 'praiseThink',
  make: s => ({ want: ['chord', 'diam'].includes(s.seg) ? 'yes' : 'no', tag: 'ci4-chord-' + s.seg }),
  draw(svg, item, tries) { const g = el('g', {}, svg), O = [180, 118], R = 88, [P, Q] = C6_SEG(O, R, item.seg, item.rot ?? 200); c6Circle(g, O, R); c6Seg(g, P, Q, C6.ch, 4.4); [P, Q].forEach(X => pfDot(g, X));
    if (tries >= 3) { const h = helpG(svg); [P, Q].forEach(X => el('circle', { cx: X[0], cy: X[1], r: 11, fill: 'none', stroke: C6.hl, 'stroke-width': 3, 'stroke-dasharray': '4 3' }, h)); } return {}; },
  h2: async (item, ctx) => { ciRule(helpG(ctx.svg), 180, 18, labelText('ci4RuleChord'), C6.hl, 13); await sleep(FAST ? 10 : 250); },
  pick: item => yesNo(item.want),
  errOf: (it, k) => it.seg === 'diam' ? 'ciDiamNotChord' : it.seg === 'chord' ? 'ciChordNo' : it.seg === 'rad' ? 'ciRadChord' : 'ciInsideChord' });

/* ================= ② العمود من المركز ينصّف الوتر (C403 أ): r، d (بعد الوتر عن المركز)، ask half | chord | r | d ================= */
ITEM.ci4Half = cpItem({ H: 262, tLine: 'gen.ci4.together.half', hint: 'gen.ci4.hint.half', rLine: 'gen.ci4.reveal.half', rSay: it => S(numw(it.want), { append: true }), num: true, praise: 'praiseThink',
  make: s => { const h = Math.round(Math.sqrt(s.r * s.r - s.d * s.d)); /*T*/if (TESTHOOK && h * h !== s.r * s.r - s.d * s.d) testBug('ci4Half: نصف الوتر ليس عدداً صحيحاً');/*/T*/
    const want = { half: h, chord: 2 * h, r: s.r, d: s.d }[s.ask], alt = { half: [2 * h, s.r], chord: [h, s.r + s.d], r: [h + s.d, 2 * h], d: [s.r - h, h] }[s.ask];
    const nums = [want, ...alt].filter((v, i, X) => X.indexOf(v) === i && v > 0); while (nums.length < 3) nums.push(want + nums.length);
    return { h, want, alt, nums, tag: 'ci4-half-' + s.ask }; },
  draw(svg, item, tries) { const g = el('g', {}, svg), O = [180, 118], R = 92, k = R / item.r, C = c6Chord(O, R, item.d * k); c6Circle(g, O, R, { lab: 'م' });
    c6Seg(g, C.A, C.B, C6.ch, 4.2); if (item.ask !== 'half') c6Seg(g, O, C.A, C6.r, 3.4); c6Seg(g, O, C.M, C6.ok, 3, '7 5'); preRight(g, C.M, O, C.B, 10); [C.A, C.B, C.M].forEach(X => pfDot(g, X));
    const q = '؟', ask = item.ask, L = {}, red = k => ask === k ? C6.q : null, fy = C.M[1] + 22 < O[1] + R - 12 ? C.M[1] + 22 : O[1] + R + 18;
    if (ask === 'half') L.q = c6Num(g, (C.A[0] + C.M[0]) / 2, C.M[1] - 8, q, { col: C6.q, fs: 18 });
    L.full = ['half', 'r', 'd'].includes(ask) ? c6Num(g, 180, fy, 2 * item.h, { col: C6.ch }) : c6Num(g, 180, fy, q, { col: C6.q, fs: 18 });
    if (ask !== 'half') { L.r = c6Num(g, (O[0] + C.A[0]) / 2 - 12, (O[1] + C.A[1]) / 2, ask === 'r' ? q : item.r, { col: red('r') || C6.r, anchor: 'end' });
      L.d = c6Num(g, O[0] + 10, (O[1] + C.M[1]) / 2 + 6, ask === 'd' ? q : item.d, { col: red('d') || C6.ok, anchor: 'start' }); }
    if (tries >= 3) { const h = helpG(svg);
      const s = { half: `${2 * item.h} ÷ 2 = ؟`, chord: `${item.r} × ${item.r} − ${item.d} × ${item.d} = ${item.h * item.h}`, r: `${item.h} × ${item.h} + ${item.d} × ${item.d} = ${item.r * item.r}`, d: `${item.r} × ${item.r} − ${item.h} × ${item.h} = ${item.d * item.d}` }[ask];
      ciEq(h, 180, 248, s, C6.hl, 16); } return { L }; },
  h2: async (item, ctx) => { ciRule(helpG(ctx.svg), 180, 18, labelText(item.ask === 'half' ? 'ci4RuleHalf' : 'ci4RulePy'), C6.hl, 13); await sleep(FAST ? 10 : 250); },
  pick: (item, ctx) => { const np = numberPick(shuffle(item.nums), item.want, { west: true }); ctx.np = np; return np.p; },
  errOf: (it, k) => ({ half: { [2 * it.h]: 'ciNoHalf' }, chord: { [it.h]: 'ciChordHalfOnly', [it.r + it.d]: 'pyAdd' }, r: { [it.h + it.d]: 'pyAdd', [2 * it.h]: 'ciFullChord' }, d: { [it.r - it.h]: 'pySub', [it.h]: 'ciDOff' } }[it.ask][k] || 'ciHalfOff') });

/* ================= ③ هل المستقيم مماس؟ (C403 ب): kind tan | sec | out، dir اتجاه العمود عليه من المركز ================= */
function c6LineAt(g, O, R, a, dist, col = C6.tan) { const N = angP(O, a, dist), u = [Math.cos((a + 90) * Math.PI / 180), -Math.sin((a + 90) * Math.PI / 180)], L = 150;
  c6Seg(g, [N[0] - u[0] * L, N[1] - u[1] * L], [N[0] + u[0] * L, N[1] + u[1] * L], col, 4); const pts = [];
  if (dist < R - .5) { const t = Math.sqrt(R * R - dist * dist); pts.push([N[0] - u[0] * t, N[1] - u[1] * t], [N[0] + u[0] * t, N[1] + u[1] * t]); } else if (Math.abs(dist - R) < .5) pts.push(N);
  return { N, pts }; }
ITEM.ci4Tan = cpItem({ H: 236, tLine: 'gen.ci4.together.tan', hint: 'gen.ci4.hint.tan', rLine: it => 'gen.ci4.reveal.tan.' + it.kind, praise: 'praiseThink',
  make: s => ({ want: s.kind === 'tan' ? 'yes' : 'no', tag: 'ci4-tan-' + s.kind }),
  draw(svg, item, tries) { const g = el('g', {}, svg), O = [180, 120], R = 74; c6Circle(g, O, R); const X = c6LineAt(g, O, R, item.dir ?? 60, { tan: R, sec: R * .62, out: R * 1.22 }[item.kind]);
    if (tries >= 3) { const h = helpG(svg); X.pts.forEach(P => el('circle', { cx: P[0], cy: P[1], r: 9, fill: 'none', stroke: C6.hl, 'stroke-width': 3 }, h)); } return { X }; },
  h2: async (item, ctx) => { ciRule(helpG(ctx.svg), 180, 18, labelText('ci4RuleTan'), C6.hl, 13); await sleep(FAST ? 10 : 250); },
  pick: item => yesNo(item.want),
  errOf: (it, k) => it.kind === 'tan' ? 'ciTanNo' : it.kind === 'sec' ? 'ciSecTan' : 'ciOutTan' });

/* ================= ④ طول المماس من نقطة خارجية (C403 ب): r، op؛ ask len | op | r (نصف القطر عمودي على المماس) ================= */
function c6TanFig(g, r, op, o = {}) { const u = Math.min(62 / r, 236 / op), R = r * u, O = [64 + R * .4, o.y || 132], P = [O[0] + op * u, O[1]], th = Math.acos(r / op) * 180 / Math.PI, T = angP(O, th, R);
  c6Circle(g, O, R, { lab: 'م' }); c6Seg(g, T, P, C6.tan, 4); c6Seg(g, O, T, C6.r, 3.4); c6Seg(g, O, P, C6.ink, 2.6, '7 5'); preRight(g, T, O, P, 10); [T, P].forEach(X => pfDot(g, X));
  pfLab(g, T[0], T[1] - 10, 'ت', { fs: 15 }); pfLab(g, P[0] + 12, P[1] + 5, 'ن', { fs: 15 }); return { O, P, T, R, th }; }
ITEM.ci4TanLen = cpItem({ H: 250, tLine: 'gen.ci4.together.tanLen', hint: 'gen.ci4.hint.tanLen', rLine: 'gen.ci4.reveal.half', rSay: it => S(numw(it.want), { append: true }), num: true, praise: 'praiseThink',
  make: s => { const len = Math.round(Math.sqrt(s.op * s.op - s.r * s.r)); /*T*/if (TESTHOOK && len * len !== s.op * s.op - s.r * s.r) testBug('ci4TanLen: طول المماس ليس عدداً صحيحاً');/*/T*/
    const want = { len, op: s.op, r: s.r }[s.ask], alt = { len: [s.op - s.r, s.op + s.r], op: [len + s.r, len], r: [s.op - len, len] }[s.ask];
    const nums = [want, ...alt].filter((v, i, X) => X.indexOf(v) === i && v > 0); while (nums.length < 3) nums.push(want + nums.length); return { len, want, nums, tag: 'ci4-tanlen-' + s.ask }; },
  draw(svg, item, tries) { const g = el('g', {}, svg), F = c6TanFig(g, item.r, item.op), a = item.ask, q = '؟';
    const lr = c6Num(g, (F.O[0] + F.T[0]) / 2 - 10, (F.O[1] + F.T[1]) / 2, a === 'r' ? q : item.r, { col: a === 'r' ? C6.q : C6.r, anchor: 'end' });
    const ll = c6Num(g, (F.T[0] + F.P[0]) / 2 + 8, (F.T[1] + F.P[1]) / 2 - 8, a === 'len' ? q : item.len, { col: a === 'len' ? C6.q : C6.tan, anchor: 'start' });
    const lo = c6Num(g, (F.O[0] + F.P[0]) / 2 + 20, F.O[1] + 22, a === 'op' ? q : item.op, { col: a === 'op' ? C6.q : C6.ink });
    if (tries >= 3) { const s = { len: `${item.op} × ${item.op} − ${item.r} × ${item.r} = ${item.len * item.len}`, op: `${item.len} × ${item.len} + ${item.r} × ${item.r} = ${item.op * item.op}`, r: `${item.op} × ${item.op} − ${item.len} × ${item.len} = ${item.r * item.r}` }[a]; ciEq(helpG(svg), 180, 238, s, C6.hl, 16); }
    return { L: { r: lr, len: ll, op: lo } }; },
  h2: async (item, ctx) => { ciRule(helpG(ctx.svg), 180, 22, labelText('ci4RuleTanR'), C6.hl, 13); await sleep(FAST ? 10 : 250); },
  pick: (item, ctx) => { const np = numberPick(shuffle(item.nums), item.want, { west: true }); ctx.np = np; return np.p; },
  errOf: (it, k) => ({ len: { [it.op - it.r]: 'pySub', [it.op + it.r]: 'pyAdd' }, op: { [it.len + it.r]: 'pyAdd', [it.len]: 'ciTanOff' }, r: { [it.op - it.len]: 'pySub', [it.len]: 'ciTanOff' } }[it.ask][k] || 'ciTanOff') });

/* ================= ⑤ زاوية عند النقطة الخارجية (C403 ب): th الزاوية عند المركز؛ الزاوية عند ن = 90 − th ================= */
ITEM.ci4TanAng = cpItem({ H: 250, tLine: 'gen.ci4.together.tanAng', hint: 'gen.ci4.hint.tanAng', rLine: 'gen.ci4.reveal.ang', rSay: it => sayDeg(it.want), num: true, praise: 'praiseThink',
  make: s => ({ want: 90 - s.th, nums: [90 - s.th, s.th, 180 - s.th], tag: 'ci4-tanang' }),
  draw(svg, item, tries) { const g = el('g', {}, svg), op = 1 / Math.cos(item.th * Math.PI / 180), F = c6TanFig(g, 1, op);
    arArc(g, F.O, 0, item.th, { r: 26, col: C6.r, deg: item.th, dl: 18, fs: 14, fill: true }); const q = arArc(g, F.P, 180 - (90 - item.th), 180, { r: 34, col: C6.q, lab: '؟', dl: 16, fs: 15, fill: true });
    if (tries >= 3) ciEq(helpG(svg), 180, 238, `180 − 90 − ${item.th} = ؟`, C6.hl, 16); return { q }; },
  sayQ: async it => { await sayDeg(it.th); await S('gen.ci4.q.tanAngEnd', { append: true }); },
  h2: async (item, ctx) => { ciRule(helpG(ctx.svg), 180, 22, labelText('ci4RuleTanR'), C6.hl, 13); await sleep(FAST ? 10 : 250); },
  show: async (item, ctx) => { if (ctx && ctx.q) arSetDeg(ctx.q, item.want, C6.ok); },
  pick: (item, ctx) => { const np = numberPick(shuffle(item.nums), item.want, { west: true, word: degw }); ctx.np = np; return np.p; },
  errOf: (it, k) => k === it.th ? 'ciTanAngSame' : k === 180 - it.th ? 'ciTanAng180' : 'ciTanAngOff' });

/* ================= ⑥ المحيطية والمركزية على القوس نفسه (C412): cen، ask ins | cen؛ والقطر (cen 180) يعطي قائمة ================= */
function c6Insc(g, cen, o = {}) { const O = o.O || [180, 126], R = o.R || 80, a1 = 270 - cen / 2, a2 = 270 + cen / 2, A = angP(O, a1, R), B = angP(O, a2, R), P = angP(O, o.pAt ?? 90, R);
  c6Circle(g, O, R); el('path', { d: angArc(O, R, a1, a2), fill: 'none', stroke: C6.arc, 'stroke-width': 6, 'stroke-linecap': 'round', 'pointer-events': 'none' }, g);
  if (cen < 180) for (const X of [A, B]) c6Seg(g, O, X, C6.r, 3); else c6Seg(g, A, B, C6.r, 3);
  for (const X of [A, B]) c6Seg(g, P, X, C6.ch, 3); [O, A, B, P].forEach(X => pfDot(g, X)); return { O, R, A, B, P, a1, a2 }; }
ITEM.ci4Ang = cpItem({ H: 250, tLine: 'gen.ci4.together.ang', hint: 'gen.ci4.hint.ang', rLine: 'gen.ci4.reveal.ang', rSay: it => sayDeg(it.want), num: true, praise: 'praiseThink',
  make: s => { const ins = s.cen / 2, want = s.ask === 'cen' ? s.cen : ins, nums = s.ask === 'cen' ? [s.cen, ins, 180 - ins, 2 * s.cen] : [ins, s.cen, s.cen === 180 ? 45 : Math.min(2 * s.cen, 360), 90 + ins]; return { ins, want, nums: nums.filter((v, i, X) => X.indexOf(v) === i).slice(0, 3), tag: 'ci4-ang-' + s.ask + (s.cen === 180 ? '-diam' : '') }; },
  draw(svg, item, tries) { const g = el('g', {}, svg), F = c6Insc(g, item.cen, { pAt: item.pAt }), cq = item.ask === 'cen';
    const c = item.cen < 180 ? arArc(g, F.O, F.a1, F.a2, { r: 24, col: C6.r, ...(cq ? { lab: '؟' } : { deg: item.cen }), dl: 18, fs: 15, fill: true }) : null;
    const pd = (a => (a + 360) % 360)(Math.atan2(F.P[1] - F.A[1], F.A[0] - F.P[0]) * 180 / Math.PI), pe = (a => (a + 360) % 360)(Math.atan2(F.P[1] - F.B[1], F.B[0] - F.P[0]) * 180 / Math.PI);
    const i = arArc(g, F.P, Math.min(pd, pe), Math.max(pd, pe), { r: 30, col: C6.ch, ...(cq ? { deg: item.ins } : { lab: '؟' }), dl: 16, fs: 15, fill: true });
    if (tries >= 3) ciEq(helpG(svg), 180, 238, cq ? `${item.ins} × 2 = ؟` : item.cen === 180 ? `180 ÷ 2 = ؟` : `${item.cen} ÷ 2 = ؟`, C6.hl, 16); return { q: cq ? c : i }; },
  sayQ: async it => { await sayDeg(it.ask === 'cen' ? it.ins : it.cen); await S('gen.ci4.q.ang.' + it.ask + 'End', { append: true }); },
  h2: async (item, ctx) => { ciRule(helpG(ctx.svg), 180, 238, labelText('ci4RuleInsc'), C6.hl, 13); await sleep(FAST ? 10 : 250); },
  show: async (item, ctx) => { if (ctx && ctx.q) arSetDeg(ctx.q, item.want, C6.ok); },
  pick: (item, ctx) => { const np = numberPick(shuffle(item.nums), item.want, { west: true, word: degw }); ctx.np = np; return np.p; },
  errOf: (it, k) => it.ask === 'cen' ? (k === it.ins ? 'ciInsEqCen' : 'ciCenOff') : k === it.cen ? 'ciInsEqCen' : k === 2 * it.cen ? 'ciInsDouble' : 'ciInsOff' });

/* ================= ⑦ طول القوس ومساحة القطاع (C418): kind arc | area، ang، والمعطى C (المحيط) أو A (المساحة) أو r (بـ 3.14)، u cm | m ================= */
const c6Whole = s => s.C ?? s.A ?? (s.kind === 'arc' ? 2 * 3.14 * s.r : 3.14 * s.r * s.r);
const c6R = v => Math.round(v * 100) / 100;
ITEM.ci4Sector = cpItem({ H: 262, tLine: 'gen.ci4.together.sector', hint: 'gen.ci4.hint.sector', rLine: it => 'gen.ci4.reveal.' + it.kind, rSay: it => S(ciLine(it.want, it.uk), { append: true }), praise: 'praiseThink',
  make: s => { const W = c6R(c6Whole(s)), want = c6R(W * s.ang / 360), uk = s.kind === 'area' ? s.u + '2' : s.u, C = [want];
    for (const v of [c6R(W / 2), c6R(W - want), c6R(W * s.ang / 180), c6R(W / 4)]) if (C.length < 3 && !C.includes(v)) C.push(v);
    return { W, want, uk, cands: C, tag: 'ci4-sector-' + s.kind + (s.r != null ? '-r' : '') }; },
  draw(svg, item, tries) { const g = el('g', {}, svg), O = [180, 134], R = 82, a1 = 90, a2 = 90 + item.ang;
    if (item.kind === 'area') el('path', { d: `M${O[0]} ${O[1]} L${angP(O, a1, R).join(' ')} ` + angArc(O, R, a1, a2).replace(/^M[^A]*/, '') + ' Z', fill: C6.sec, stroke: 'none', 'pointer-events': 'none' }, g);
    c6Circle(g, O, R); const P1 = angP(O, a1, R), P2 = angP(O, a2, R); c6Seg(g, O, P1, C6.r, 3); c6Seg(g, O, P2, C6.r, 3);
    if (item.kind === 'arc') el('path', { d: angArc(O, R, a1, a2), fill: 'none', stroke: C6.arc, 'stroke-width': 6, 'stroke-linecap': 'round', 'pointer-events': 'none' }, g);
    arArc(g, O, a1, a2, { r: 22, col: C6.r, deg: item.ang, dl: 20, fs: 14, fill: true });
    if (item.r != null) ciTop(svg, 'r', item.r, item.u, 24); else ciTop(svg, item.C != null ? 'C' : 'A', item.C ?? item.A, item.u, 24);
    if (tries >= 3) ciEq(helpG(svg), 180, 252, `${item.ang} ÷ 360 × ${item.W} = ؟`, C6.hl, 15); return {}; },
  h2: async (item, ctx) => { ciRule(helpG(ctx.svg), 180, 252, labelText(item.kind === 'arc' ? 'ci4RuleArc' : 'ci4RuleArea').replace('N', MS('360')), C6.hl, 13); await sleep(FAST ? 10 : 250); },
  pick: item => choosePick(shuffle(item.cands.map(v => [String(v), ciTxt(v, item.uk), '<i></i>', ciLine(v, item.uk)])), String(item.want)),
  errOf: (it, k) => +k === c6R(it.W / 2) ? 'ciArcHalf' : +k === c6R(it.W - it.want) ? 'ciArcOther' : +k === c6R(it.W * it.ang / 180) ? 'ciArcDouble' : 'ciArcOff' });

/* ---------- البرهانان (D242) ورسماهما في pfFig ---------- */
Object.assign(PF_PROOFS, { chordPf: { rs: ['radii', 'rhs', 'cpct'] }, inscPf: { rs: ['radii', 'isoBase', 'ext'] } });
function c6Fig(g, k, o = {}) { const y0 = o.y0 ?? 0, s = o.s || 1, T = (x, y) => [180 + (x - 180) * s, y0 + y * s], O = T(180, 72), R = 64 * s;
  c6Circle(g, O, R, { w: 2.8 }); pfLab(g, O[0] + 11, O[1] - 7, 'م', { fs: 15 });
  if (k === 'chordPf') { const C = c6Chord(O, R, 34 * s); c6Seg(g, C.A, C.B, C6.ch, 3.6); c6Seg(g, O, C.A, C6.r, 3); c6Seg(g, O, C.B, C6.r, 3); c6Seg(g, O, C.M, C6.ok, 2.8, '6 4'); preRight(g, C.M, O, C.B, 9);
    [C.A, C.B, C.M].forEach(X => pfDot(g, X)); pfLab(g, C.A[0] - 11, C.A[1] + 6, 'أ', { fs: 15 }); pfLab(g, C.B[0] + 11, C.B[1] + 6, 'ب', { fs: 15 }); pfLab(g, C.M[0], C.M[1] + 18, 'ج', { fs: 15 }); return C; }
  const P = angP(O, 160, R), B = angP(O, 340, R), A = angP(O, 250, R); c6Seg(g, P, B, C6.r, 3); c6Seg(g, P, A, C6.ch, 3.2); c6Seg(g, O, A, C6.r, 3);
  pfAng(g, P, A, B, { col: C6.ch, r: 26 }); pfAng(g, A, P, O, { col: C6.ch, r: 22 }); pfAng(g, O, A, B, { col: C6.tan, r: 18 });
  [P, A, B].forEach(X => pfDot(g, X)); pfLab(g, P[0] - 12, P[1], 'ن', { fs: 15 }); pfLab(g, A[0] - 4, A[1] + 18, 'أ', { fs: 15 }); pfLab(g, B[0] + 12, B[1] + 6, 'ب', { fs: 15 }); return { P, A, B, O }; }

/* ---------- صورة بطاقة التعليل (pfReasonPic، المفتاح ci4): k chord | diam | rad | tan | sec | insc | arc | sector ---------- */
function c6Pic(g, P) { const O = [180, 100], R = 70;
  if (P.k === 'insc') { c6Insc(g, P.cen || 80, { O, R: 66, pAt: P.pAt }); return; }
  if (P.k === 'perp') { c6Circle(g, O, R); const C = c6Chord(O, R, 36); c6Seg(g, C.A, C.B, C6.ch, 4); c6Seg(g, O, C.A, C6.r, 3); c6Seg(g, O, C.B, C6.r, 3); c6Seg(g, O, C.M, C6.ok, 3, '6 4'); preRight(g, C.M, O, C.B, 9); [C.A, C.B, C.M].forEach(X => pfDot(g, X)); return; }
  if (P.k === 'tan' || P.k === 'sec') { c6Circle(g, O, R); const X = c6LineAt(g, O, R, P.dir ?? 60, P.k === 'tan' ? R : R * .62); X.pts.forEach(Q => pfDot(g, Q)); if (P.k === 'tan' && P.radius) { c6Seg(g, O, X.N, C6.r, 3); preRight(g, X.N, O, angP(X.N, (P.dir ?? 60) + 90, 20), 9); } return; }
  if (P.k === 'arc' || P.k === 'sector') { const a = P.ang || 90; if (P.k === 'sector') el('path', { d: `M${O[0]} ${O[1]} L${angP(O, 90, R).join(' ')} ` + angArc(O, R, 90, 90 + a).replace(/^M[^A]*/, '') + ' Z', fill: C6.sec, 'pointer-events': 'none' }, g);
    c6Circle(g, O, R); if (P.k === 'arc') el('path', { d: angArc(O, R, 90, 90 + a), fill: 'none', stroke: C6.arc, 'stroke-width': 6, 'pointer-events': 'none' }, g); c6Seg(g, O, angP(O, 90, R), C6.r, 3); c6Seg(g, O, angP(O, 90 + a, R), C6.r, 3); arArc(g, O, 90, 90 + a, { r: 20, col: C6.r, deg: a, dl: 18, fs: 13, fill: true }); return; }
  c6Circle(g, O, R); const [A, B] = C6_SEG(O, R, P.k, P.rot ?? 200); c6Seg(g, A, B, C6.ch, 4); [A, B].forEach(X => pfDot(g, X));
  if (P.perp) { const C = c6Chord(O, R, 36); c6Seg(g, C.A, C.B, C6.ch, 4); c6Seg(g, O, C.M, C6.ok, 3, '6 4'); preRight(g, C.M, O, C.B, 9); } }

/* ================= المشاهد ================= */
/* د1: فوضى تسمّي الوتر قطراً */
SCENES.ci4ChordHook = async c => { const L = c.lines, svg = m3Stage(250), O = [180, 124], R = 92; c6Circle(svg, O, R, { lab: 'م' }); let g = el('g', { 'pointer-events': 'none' }, svg);
  const [A, B] = C6_SEG(O, R, 'chord', 200); c6Seg(g, A, B, C6.ch, 4.4); [A, B].forEach(X => pfDot(g, X)); await c6Say(L, 0);
  el('circle', { cx: O[0], cy: O[1], r: 12, fill: 'none', stroke: C6.hl, 'stroke-width': 3 }, g); SFX.tick(); await c6Say(L, 1);
  const [D1, D2] = C6_SEG(O, R, 'diam', 200); c6Seg(g, D1, D2, C6.r, 4); [D1, D2].forEach(X => pfDot(g, X)); SFX.tick(); await c6Say(L, 2); for (const l of L.slice(3)) await S(l); };
/* د1: الوتر يقسم الدائرة قوسين، والعمود من المركز ينصّفه */
SCENES.ci4ChordShow = async c => { const L = c.lines, svg = m3Stage(250), O = [180, 118], R = 92, C = c6Chord(O, R, 46); c6Circle(svg, O, R, { lab: 'م' }); let g = el('g', { 'pointer-events': 'none' }, svg);
  const a1 = Math.atan2(O[1] - C.A[1], C.A[0] - O[0]) * 180 / Math.PI, a2 = Math.atan2(O[1] - C.B[1], C.B[0] - O[0]) * 180 / Math.PI;
  el('path', { d: angArc(O, R, (a1 + 360) % 360, (a2 + 360) % 360), fill: 'none', stroke: C6.arc, 'stroke-width': 6, 'stroke-linecap': 'round' }, g); c6Seg(g, C.A, C.B, C6.ch, 4.4); [C.A, C.B].forEach(X => pfDot(g, X)); await c6Say(L, 0);
  c6Seg(g, O, C.M, C6.ok, 3, '7 5'); preRight(g, C.M, O, C.B, 10); pfDot(g, C.M); SFX.tick(); await c6Say(L, 1);
  preTicks(g, C.A, C.M, 1, C6.ok); preTicks(g, C.M, C.B, 1, C6.ok); c6Seg(g, O, C.A, C6.r, 3); c6Seg(g, O, C.B, C6.r, 3); SFX.tick(); await c6Say(L, 2); for (const l of L.slice(3)) await S(l); };
/* د2: يلامس في نقطتين؟ المسطرة تنزلق: نقطتان، ثم واحدة، ثم لا شيء */
SCENES.ci4TanHook = async c => { const L = c.lines, svg = m3Stage(250), O = [180, 128], R = 80; c6Circle(svg, O, R); let g = el('g', { 'pointer-events': 'none' }, svg);
  const X = c6LineAt(g, O, R, 90, R * .7, C6.ch); X.pts.forEach(P => pfDot(g, P)); await c6Say(L, 0); for (const P of X.pts) el('circle', { cx: P[0], cy: P[1], r: 11, fill: 'none', stroke: C6.hl, 'stroke-width': 3 }, g); SFX.tick(); await c6Say(L, 1); for (const l of L.slice(2)) await S(l); };
SCENES.ci4TanShow = async c => { const L = c.lines, svg = m3Stage(250), O = [180, 132], R = 80; c6Circle(svg, O, R, { lab: 'م' }); let g = null;
  for (const [i, f] of [.6, 1, 1.25].entries()) { if (g) g.remove(); g = el('g', { 'pointer-events': 'none' }, svg); const X = c6LineAt(g, O, R, 90, R * f); X.pts.forEach(P => pfDot(g, P)); preLab(g, 312, 30, MS(String(X.pts.length)), { col: C6.tan, fs: 22 }); SFX.tick(); if (i === 1) await c6Say(L, 0); else await sleep(FAST ? 10 : 700); }
  g.remove(); g = el('g', { 'pointer-events': 'none' }, svg); const X = c6LineAt(g, O, R, 90, R); c6Seg(g, O, X.N, C6.r, 3.4); preRight(g, X.N, O, [X.N[0] + 30, X.N[1]], 11); pfDot(g, X.N); pfLab(g, X.N[0] + 10, X.N[1] - 10, 'ت', { fs: 15 }); SFX.tick(); await c6Say(L, 1);
  const Q = [X.N[0] + 52, X.N[1]]; c6Seg(g, O, Q, C6.q, 2.6, '6 4'); pfDot(g, Q); pfLab(g, Q[0] + 4, Q[1] - 10, 'ق', { fs: 15, col: C6.q }); await c6Say(L, 2); for (const l of L.slice(3)) await S(l); };
/* د2: مماسان من نقطة خارجية متساويان بالقياس */
SCENES.ci4TwoTanShow = async c => { const L = c.lines, svg = m3Stage(250), O = [120, 128], R = 62, P = [310, 128], th = Math.acos(R / (P[0] - O[0])) * 180 / Math.PI, T1 = angP(O, th, R), T2 = angP(O, -th, R);
  c6Circle(svg, O, R, { lab: 'م' }); const g = el('g', { 'pointer-events': 'none' }, svg); for (const T of [T1, T2]) { c6Seg(g, T, P, C6.tan, 4); c6Seg(g, O, T, C6.r, 3); preRight(g, T, O, P, 9); pfDot(g, T); } pfDot(g, P); pfLab(g, P[0] + 12, P[1] + 5, 'ن', { fs: 15 }); await c6Say(L, 0);
  for (const T of [T1, T2]) preTicks(g, T, P, 2, C6.ok); SFX.tick(); await c6Say(L, 1); for (const l of L.slice(2)) await S(l); };
/* د3: فوضى: المحيطية تساوي المركزية؛ نقيس 80° و40° */
SCENES.ci4InscHook = async c => { const L = c.lines, svg = m3Stage(250), g = el('g', { 'pointer-events': 'none' }, svg), cen = c.cen || 80, F = c6Insc(g, cen); await c6Say(L, 0);
  arArc(g, F.O, F.a1, F.a2, { r: 24, col: C6.r, deg: cen, dl: 18, fs: 15, fill: true }); SFX.tick(); await c6Say(L, 1);
  const pd = (Math.atan2(F.P[1] - F.A[1], F.A[0] - F.P[0]) * 180 / Math.PI + 360) % 360, pe = (Math.atan2(F.P[1] - F.B[1], F.B[0] - F.P[0]) * 180 / Math.PI + 360) % 360; arArc(g, F.P, Math.min(pd, pe), Math.max(pd, pe), { r: 30, col: C6.ch, deg: cen / 2, dl: 16, fs: 15, fill: true }); SFX.tick(); await c6Say(L, 2); for (const l of L.slice(3)) await S(l); };
/* د3: المحيطية على القوس نفسه نصف المركزية أينما كان رأسها، وعلى القطر قائمة */
SCENES.ci4InscShow = async c => { const L = c.lines, svg = m3Stage(250); let g = null;
  for (const [i, [cen, pAt]] of [[100, 60], [100, 130], [180, 90]].entries()) { if (g) g.remove(); g = el('g', { 'pointer-events': 'none' }, svg); const F = c6Insc(g, cen, { pAt });
    if (cen < 180) arArc(g, F.O, F.a1, F.a2, { r: 22, col: C6.r, deg: cen, dl: 18, fs: 14, fill: true });
    const pd = (Math.atan2(F.P[1] - F.A[1], F.A[0] - F.P[0]) * 180 / Math.PI + 360) % 360, pe = (Math.atan2(F.P[1] - F.B[1], F.B[0] - F.P[0]) * 180 / Math.PI + 360) % 360;
    if (cen === 180) preRight(g, F.P, F.A, F.B, 12); else arArc(g, F.P, Math.min(pd, pe), Math.max(pd, pe), { r: 28, col: C6.ch, deg: cen / 2, dl: 16, fs: 14, fill: true }); SFX.tick(); await c6Say(L, i); }
  for (const l of L.slice(3)) await S(l); };
/* د4: القوس جزءٌ من المحيط بكسر الزاوية من 360، والقطاع جزءٌ من القرص بالكسر نفسه */
SCENES.ci4ArcShow = async c => { const L = c.lines, svg = m3Stage(250), O = [180, 132], R = 84; c6Circle(svg, O, R); let g = null; await c6Say(L, 0);
  for (const [i, a] of [90, 180, 360].entries()) { if (g) g.remove(); g = el('g', { 'pointer-events': 'none' }, svg); el('path', { d: a === 360 ? angArc(O, R, 0, 0, true) : angArc(O, R, 90, 90 + a), fill: 'none', stroke: C6.arc, 'stroke-width': 6, 'stroke-linecap': 'round' }, g);
    if (a < 360) { c6Seg(g, O, angP(O, 90, R), C6.r, 3); c6Seg(g, O, angP(O, 90 + a, R), C6.r, 3); arArc(g, O, 90, 90 + a, { r: 22, col: C6.r, deg: a, dl: 20, fs: 14, fill: true }); }
    ciEq(g, 180, 24, `${a} ÷ 360 = ${['1 ÷ 4', '1 ÷ 2', '1'][i]}`, C6.arc, 17); SFX.tick(); await c6Say(L, i + 1); }
  for (const l of L.slice(4)) await S(l); };
SCENES.ci4SectorShow = async c => { const L = c.lines, svg = m3Stage(250), O = [180, 132], R = 84, a = c.ang || 90; const g = el('g', { 'pointer-events': 'none' }, svg);
  el('path', { d: `M${O[0]} ${O[1]} L${angP(O, 90, R).join(' ')} ` + angArc(O, R, 90, 90 + a).replace(/^M[^A]*/, '') + ' Z', fill: C6.sec }, g); c6Circle(g, O, R); c6Seg(g, O, angP(O, 90, R), C6.r, 3); c6Seg(g, O, angP(O, 90 + a, R), C6.r, 3);
  arArc(g, O, 90, 90 + a, { r: 22, col: C6.r, deg: a, dl: 20, fs: 14, fill: true }); await c6Say(L, 0); ciEq(g, 180, 24, `${a} ÷ 360 × 100 = ${a * 100 / 360}`, C6.ok, 17); SFX.tick(); await c6Say(L, 1); for (const l of L.slice(2)) await S(l); };
/* د4: حديقة القوس: نصف قطرها 5 م، وممرٌّ على قوس 90° */
SCENES.ci4GardenShow = async c => { const L = c.lines, svg = m3Stage(250), O = [180, 136], R = 88, g = el('g', { 'pointer-events': 'none' }, svg);
  el('circle', { cx: O[0], cy: O[1], r: R, fill: '#bfe3a8', stroke: '#5c8f43', 'stroke-width': 3 }, g); c6Seg(g, O, angP(O, 0, R), C6.r, 3); c6Num(g, O[0] + R / 2, O[1] + 18, '5', { col: C6.r }); pfDot(g, O); await c6Say(L, 0);
  el('path', { d: angArc(O, R, 90, 180), fill: 'none', stroke: '#c99a5b', 'stroke-width': 10, 'stroke-linecap': 'round' }, g); const e1 = ciEq(g, 180, 24, `31.4 ÷ 4 = 7.85`, C6.arc, 17); SFX.tick(); await c6Say(L, 1); e1.remove();
  el('path', { d: `M${O[0]} ${O[1]} L${angP(O, 90, R).join(' ')} ` + angArc(O, R, 90, 180).replace(/^M[^A]*/, '') + ' Z', fill: 'rgba(217,130,43,.3)' }, g); ciEq(g, 180, 24, `78.5 ÷ 4 = 19.625`, C6.ok, 17); SFX.tick(); await c6Say(L, 2); for (const l of L.slice(3)) await S(l); };
WRAP_ART.circ4Art = svg => { const g = el('g', { 'pointer-events': 'none' }, svg), O = [214, 120], R = 70; c6Circle(g, O, R); const C = c6Chord(O, R, 30); c6Seg(g, C.A, C.B, C6.ch, 4); c6Seg(g, O, C.M, C6.ok, 3, '6 4');
  const X = c6LineAt(g, O, R, 90, R); pfDot(g, X.N); el('path', { d: angArc(O, R, 200, 250), fill: 'none', stroke: C6.arc, 'stroke-width': 6 }, g); };
