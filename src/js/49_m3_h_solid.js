/* =====================================================================
   S3-U8 «المجسّمات» (المرحلة 3، المرجع reference/03_المناهج_والوحدات/S3-U8_المجسمات.md، نسخة 1.2)
   د1 عدّ الأوجه والأحرف والرؤوس (C318) و«صائد الأحرف» وركن الفضول (أويلر، يُكتشف ولا يُختبر)
   د2 المنشور المستطيل والمكعب حالة خاصة منه (C319) · د3 شبكة المجسّم (C320) · د4 مساحة السطح (C321)
   د5 المساقط (C322) ومشروع «علبة الهدية» · د6 مراجعة الوحدة واختبارها
   العلبة بإسقاط مائل (soBox): الوجه الأمامي مستطيل حقيقي والعمق مائل، والأحرف المخفية متقطّعة.
   الشبكة تُطوى حساباً (soFold: يُدحرج المكعب على مربعات الشبكة)، فتُعرف صلاحيتها وأزواج أوجهها المتقابلة.
   الأوجه تُسمّى بموضعها («الوجه الأمامي») لا بالحروف (التعديل 4)، ولا ألوان جديدة للهوية (التعديل 5): ألوان الشبكة من ألوان الرفاق.
   ===================================================================== */
const SO = { ink: '#24323a', edge: '#2a5f94', hid: '#7a8a94', face: '#f1dfb6', top: '#f7ebcd', side: '#dcc28e', ok: '#2f9d6b', bad: '#c8392d', hl: '#8e6bbf', grid: '#dfe5ea',
  pair: [SOLIDC.cube, SOLIDC.sphere, '#7fb6d9'] };
/* العلبة: w العرض (أفقي)، h الارتفاع، d العمق (مائل)؛ s سنتيمترات الشاشة لكل وحدة؛ C مركز الوجه الأمامي تقريباً */
function soGeom(w, h, d, o = {}) { const s = o.s || 22, k = o.k ?? .55, a = (o.a ?? 38) * Math.PI / 180, dx = d * s * k * Math.cos(a), dy = -d * s * k * Math.sin(a), W = w * s, H = h * s,
    x0 = (o.cx ?? 180) - (W + dx) / 2, y0 = (o.cy ?? 128) + (H - dy) / 2;
  const P = { flb: [x0, y0], frb: [x0 + W, y0], frt: [x0 + W, y0 - H], flt: [x0, y0 - H] }; P.blb = [P.flb[0] + dx, P.flb[1] + dy]; P.brb = [P.frb[0] + dx, P.frb[1] + dy]; P.brt = [P.frt[0] + dx, P.frt[1] + dy]; P.blt = [P.flt[0] + dx, P.flt[1] + dy];
  const E = [['flb', 'frb'], ['frb', 'frt'], ['frt', 'flt'], ['flt', 'flb'], ['blb', 'brb'], ['brb', 'brt'], ['brt', 'blt'], ['blt', 'blb'], ['flb', 'blb'], ['frb', 'brb'], ['frt', 'brt'], ['flt', 'blt']];
  const hidden = e => e.includes('blb');   /* المخفي: ما يمسّ الرأس الخلفي الأسفل الأيسر */
  const F = { front: ['flb', 'frb', 'frt', 'flt'], back: ['blb', 'brb', 'brt', 'blt'], top: ['flt', 'frt', 'brt', 'blt'], bottom: ['flb', 'frb', 'brb', 'blb'], right: ['frb', 'brb', 'brt', 'frt'], left: ['flb', 'blb', 'blt', 'flt'] };
  return { P, E: E.map(([a, b], i) => ({ i, a, b, A: P[a], B: P[b], hid: hidden([a, b]) })), F, s, dx, dy, W, H }; }
/* مقياسٌ يُدخل العلبة وتسمياتها في المسرح: العرض مع العمق المائل حتى W، والارتفاع معه حتى H */
const soFit = (w, h, d, W = 210, H = 140) => Math.min(34, W / (w + d * .55 * Math.cos(38 * Math.PI / 180)), H / (h + d * .55 * Math.sin(38 * Math.PI / 180)));
function soBox(parent, w, h, d, o = {}) { const G = soGeom(w, h, d, o), g = el('g', { 'pointer-events': 'none' }, parent), pts = k => polyStr(G.F[k].map(v => G.P[v]));
  if (o.ghost !== false) for (const k of ['back', 'left', 'bottom']) el('polygon', { points: pts(k), fill: 'none' }, g);
  el('polygon', { points: pts('top'), fill: o.fill === false ? 'none' : (o.hl === 'top' ? SO.hl : SO.top), 'fill-opacity': o.hl === 'top' ? .45 : 1, 'data-face': 'top' }, g);
  el('polygon', { points: pts('right'), fill: o.fill === false ? 'none' : (o.hl === 'right' ? SO.hl : SO.side), 'fill-opacity': o.hl === 'right' ? .45 : 1, 'data-face': 'right' }, g);
  el('polygon', { points: pts('front'), fill: o.fill === false ? 'none' : (o.hl === 'front' ? SO.hl : SO.face), 'fill-opacity': o.hl === 'front' ? .45 : 1, 'data-face': 'front' }, g);
  for (const e of G.E) { if (e.hid && o.hidden === false) continue; geoLine(g, e.A[0], e.A[1], e.B[0], e.B[1], { color: e.hid ? SO.hid : SO.edge, w: e.hid ? 2 : 3, dash: e.hid ? '6 5' : null }); }
  if (o.dims) { const lab = (p, t, col) => labFit(htLab(g, p, t, col || SO.ink, 14));
    lab([(G.P.flb[0] + G.P.frb[0]) / 2, G.P.flb[1] + 16], ciTxt(w, o.u || 'cm')); lab([G.P.flb[0] - 24, (G.P.flb[1] + G.P.flt[1]) / 2], ciTxt(h, o.u || 'cm')); lab([(G.P.frb[0] + G.P.brb[0]) / 2 + 26, (G.P.frb[1] + G.P.brb[1]) / 2 + 6], ciTxt(d, o.u || 'cm')); }
  return { g, G }; }
/* الهرم: مثلث القاعدة (tri) أو مربعها (sq)؛ رسمٌ بالصورة وحدها (المرجع) */
function soPyr(parent, kind, cx = 180, cy = 196, s = 1) { const g = el('g', { 'pointer-events': 'none' }, parent), T = [cx + 6 * s, cy - 150 * s];
  const B = kind === 'sq' ? [[cx - 90 * s, cy], [cx + 70 * s, cy], [cx + 110 * s, cy - 40 * s], [cx - 50 * s, cy - 40 * s]] : [[cx - 90 * s, cy], [cx + 90 * s, cy - 8 * s], [cx + 10 * s, cy - 50 * s]];
  el('polygon', { points: polyStr([B[0], B[1], T]), fill: SO.face }, g); el('polygon', { points: polyStr([B[1], B[2], T]), fill: SO.side }, g);
  const hid = kind === 'sq' ? [[B[2], B[3]], [B[3], B[0]], [B[3], T]] : [[B[1], B[2]], [B[2], B[0]], [B[2], T]];
  for (const [p, q] of [[B[0], B[1]], [B[0], T], [B[1], T]].concat(kind === 'sq' ? [[B[1], B[2]], [B[2], T]] : [])) geoLine(g, p[0], p[1], q[0], q[1], { color: SO.edge, w: 3 });
  for (const [p, q] of kind === 'sq' ? hid : [[B[2], B[0]], [B[2], T], [B[1], B[2]]]) geoLine(g, p[0], p[1], q[0], q[1], { color: SO.hid, w: 2, dash: '6 5' });
  return g; }
/* مجسّمٌ للعدّ أو للصورة */
const SO_COUNT = { cube: { faces: 6, edges: 12, verts: 8, vis: [3, 9, 7], meet: 3 }, box: { faces: 6, edges: 12, verts: 8, vis: [3, 9, 7], meet: 3 }, triPyr: { faces: 4, edges: 6, verts: 4, vis: [2, 5, 3], meet: 3 }, sqPyr: { faces: 5, edges: 8, verts: 5, vis: [3, 6, 4], meet: 3 },
  cyl: { faces: 3, vis: [2] }, cone: { faces: 2, vis: [2] } };
function soSolid(parent, k, o = {}) { if (k === 'cube') return soBox(parent, 4, 4, 4, { s: o.s || 26, cx: o.cx, cy: o.cy });
  if (k === 'box') { const [w, h, d] = o.dims || [6, 3, 4]; return soBox(parent, w, h, d, { s: o.s || Math.min(24, 150 / Math.max(w, h, d)), cx: o.cx, cy: o.cy }); } if (k === 'triPyr' || k === 'sqPyr') return { g: soPyr(parent, k === 'sqPyr' ? 'sq' : 'tri', o.cx ?? 180, o.cy ?? 200, o.sc || 1) };
  return { g: solidAt(parent, { solid: k === 'cyl' ? 'cylinder' : 'cone', size: o.size || 150, noShadow: true }, o.cx ?? 180, o.cy ?? 140) }; }

/* ================= ① عدّ الأوجه والأحرف والرؤوس (C318): solid، ask faces | edges | verts | meet ================= */
const soNumPick = (item, ctx, cands) => { const np = numberPick(rankMix(item.want, cands, 1, 30), item.want, { west: true }); ctx.np = np; return np.p; };
ITEM.soCount = cpItem({ H: 250, tLine: 'gen.so.together.count', hint: 'gen.so.hint.count', rLine: 'gen.so.reveal.count', rSay: it => S(numw(it.want), { num: true, append: true }), num: true, praise: 'praiseCount',
  make: s => { const T = SO_COUNT[s.solid], want = s.ask === 'meet' ? 3 : T[s.ask]; return { want, tag: 'so-count-' + s.ask }; },
  draw(svg, item, tries) { const S1 = soSolid(svg, item.solid, { dims: item.dims });
    if (tries >= 3 && S1.G) { const m = helpG(svg), G = S1.G; if (item.ask === 'edges') G.E.filter(e => e.hid).forEach(e => geoLine(m, e.A[0], e.A[1], e.B[0], e.B[1], { color: SO.hl, w: 4, dash: '6 5' })); else if (item.ask === 'verts' || item.ask === 'meet') el('circle', { cx: G.P.blb[0], cy: G.P.blb[1], r: 9, fill: 'none', stroke: SO.hl, 'stroke-width': 3.4 }, m); else for (const k of ['back', 'left', 'bottom']) el('polygon', { points: polyStr(G.F[k].map(v => G.P[v])), fill: SO.hl, 'fill-opacity': .18, stroke: SO.hl, 'stroke-width': 2, 'stroke-dasharray': '6 4' }, m); }
    return { G: S1.G }; },
  h2: async (item, ctx) => { if (ctx.G) { const m = helpG(ctx.svg), G = ctx.G; if (item.ask === 'meet' || item.ask === 'verts') { const v = G.P.frt; el('circle', { cx: v[0], cy: v[1], r: 10, fill: 'none', stroke: SO.hl, 'stroke-width': 3.4 }, m); } else G.E.filter(e => e.hid).forEach(e => geoLine(m, e.A[0], e.A[1], e.B[0], e.B[1], { color: SO.hl, w: 3.4, dash: '6 5' })); } await sleep(FAST ? 10 : 250); },
  pick: (item, ctx) => { const T = SO_COUNT[item.solid], v = T.vis || []; return soNumPick(item, ctx, item.ask === 'faces' ? [v[0], T.edges, item.want + 2] : item.ask === 'edges' ? [v[1], T.faces, T.verts] : item.ask === 'verts' ? [v[2], T.edges, T.faces] : [2, 4, 6]); },
  errOf: (it, k) => { const T = SO_COUNT[it.solid], v = T.vis || [], vis = { faces: v[0], edges: v[1], verts: v[2] }[it.ask]; return k === vis ? 'soHidden' : [T.faces, T.edges, T.verts].includes(k) ? 'soMix' : 'soCountOff'; } });

/* ================= ② «صائد الأحرف»: يلمس الطفل أحرف المكعب كلها، الظاهرة والمخفية (C318، إنتاج) ================= */
function soEdgeSpots(G) { const segD = (p, A, B) => { const vx = B[0] - A[0], vy = B[1] - A[1], t = Math.max(0, Math.min(1, ((p[0] - A[0]) * vx + (p[1] - A[1]) * vy) / (vx * vx + vy * vy))); return Math.hypot(p[0] - A[0] - t * vx, p[1] - A[1] - t * vy); };
  return G.E.map(e => { let best = null, bd = -1; for (let t = .2; t <= .801; t += .05) { const p = [e.A[0] + (e.B[0] - e.A[0]) * t, e.A[1] + (e.B[1] - e.A[1]) * t], d = Math.min(...G.E.filter(f => f !== e).map(f => segD(p, f.A, f.B))); if (d > bd) { bd = d; best = p; } } return best; }); }
ITEM.soEdgeHunt = {
  make(spec) { return { ...spec, want: 12, tag: 'so-edge-hunt' }; },
  async ask(item, mode, tries) { const [w, h, d] = item.dims || [4, 4, 4], svg = m3Stage(262), B = soBox(svg, w, h, d, { s: 120 / Math.max(w, h, d), cx: 180, cy: 132, k: .62 }), G = B.G, spots = soEdgeSpots(G), on = new Set(), marks = el('g', { 'pointer-events': 'none' }, svg);
    const cnt = el('text', { x: 310, y: 40, 'text-anchor': 'middle', 'font-size': 22, 'font-weight': 800, fill: SO.hl, 'pointer-events': 'none' }, svg);
    const redraw = () => { marks.innerHTML = ''; for (const i of on) { const e = G.E[i]; geoLine(marks, e.A[0], e.A[1], e.B[0], e.B[1], { color: SO.ok, w: 6 }); } cnt.textContent = MS(String(on.size)); /*T*/window.__dsgOn = [...on].map(i => 'e' + i);/*/T*/ };
    if (tries >= 3) { const m = helpG(svg); G.E.filter(e => e.hid).forEach(e => geoLine(m, e.A[0], e.A[1], e.B[0], e.B[1], { color: SO.hl, w: 4, dash: '6 5' })); }
    const hit = el('rect', { x: 10, y: 10, width: 340, height: 240, fill: 'transparent', role: 'button', tabindex: 0, 'aria-label': plain(labelText('soEdgesTap')), style: 'cursor:pointer' }, svg);
    const tapAt = q => { let bi = -1, bd = 1e9; G.E.forEach((e, i) => { const vx = e.B[0] - e.A[0], vy = e.B[1] - e.A[1], t = Math.max(0, Math.min(1, ((q[0] - e.A[0]) * vx + (q[1] - e.A[1]) * vy) / (vx * vx + vy * vy))), d = Math.hypot(q[0] - e.A[0] - t * vx, q[1] - e.A[1] - t * vy); if (d < bd) { bd = d; bi = i; } }); if (bd < 26 && !on.has(bi)) { on.add(bi); SFX.tick(); redraw(); } };
    hit.onclick = ev => { const q = svgPoint(svg, ev); tapAt([q.x, q.y]); };
    let kb = 0; hit.onkeydown = e => { if (isActKey(e)) { e.preventDefault(); while (on.has(kb % 12) && on.size < 12) kb++; on.add(kb % 12); SFX.tick(); redraw(); } };   /* بلوحة المفاتيح: مفتاح الفعل يعلّم الحرف التالي */
    redraw(); await S(tries >= 3 ? 'gen.so.together.hunt' : item.q || 'gen.so.q.hunt');
    /*T*/window.__dsgWant = G.E.map(e => 'e' + e.i); window.__dsgCell = k => { const m = svg.getScreenCTM(), p = spots[+k.slice(1)]; return { x: m.a * p[0] + m.e, y: m.d * p[1] + m.f }; };/*/T*/
    AUTO({ kind: 'dsg', ok: () => { G.E.forEach(e => on.add(e.i)); redraw(); rulDoneBtn().click(); }, wrong: () => { G.E.filter(e => !e.hid).forEach(e => on.add(e.i)); redraw(); rulDoneBtn().click(); } });
    await rulDone(() => { hit.onclick = null; hit.onkeydown = null; hit.removeAttribute('role'); hit.style.cursor = ''; });
    return { ans: [...on], ctx: { svg, G, on } }; },
  judge(item, a) { if (a.length === 12) return { ok: true }; const [w, h, d] = item.dims || [4, 4, 4], G = soGeom(w, h, d, { s: 120 / Math.max(w, h, d), k: .62 }); return { ok: false, err: G.E.filter(e => !e.hid).every(e => a.includes(e.i)) ? 'soHidden' : 'soEdgeMiss' }; },
  onOk() { SFX.good(); }, onWrong() { SFX.soft(); },
  async hint2(item, r) { if (r && r.ctx && r.ctx.G) { const m = helpG(r.ctx.svg); r.ctx.G.E.filter(e => e.hid).forEach(e => geoLine(m, e.A[0], e.A[1], e.B[0], e.B[1], { color: SO.hl, w: 4, dash: '6 5' })); } await S('gen.so.hint.hunt'); }, async together() {},
  async reveal(item, r) { if (r && r.ctx && r.ctx.G) { const m = helpG(r.ctx.svg); r.ctx.G.E.forEach(e => geoLine(m, e.A[0], e.A[1], e.B[0], e.B[1], { color: SO.ok, w: 5 })); } await S('gen.so.reveal.count', { noGap: true }); await S(numw(12), { num: true, append: true }); },
  praise: () => 'praiseCount', twin(item) { return item.twin || null; },
};

/* ================= ③ هل العلبة مكعب؟ (C319): w h d؛ faces: تُعرض أوجهها الثلاثة مسطّحة («علبة مجهولة») ================= */
function soFaces(parent, w, h, d, o = {}) { const g = el('g', { 'pointer-events': 'none' }, parent), fr = [[w, h, 'soF.front'], [d, h, 'soF.right'], [w, d, 'soF.top']], s = Math.min(14, 76 / Math.max(w, h, d));
  fr.forEach(([a, b], i) => { const cx = [280, 180, 80][i], W = a * s, H = b * s; el('rect', { x: cx - W / 2, y: 128 - H / 2, width: W, height: H, fill: [SO.face, SO.side, SO.top][i], stroke: SO.edge, 'stroke-width': 2.5 }, g); });
  fr.forEach(([a, b, k], i) => { const cx = [280, 180, 80][i], W = a * s, H = b * s; htLab(g, [cx, 128 + H / 2 + 16], ciTxt(a, o.u || 'cm'), SO.ink, 13); htLab(g, [cx + W / 2 + 10, 128], MS(String(b)), SO.ink, 13);   /* داخل الإطار (المراجع B) */ htLab(g, [cx, 128 - H / 2 - 14], labelText(k), SO.edge, 13); }); return g; }
ITEM.soKind = cpItem({ H: 250, tLine: 'gen.so.together.kind', hint: 'gen.so.hint.kind', rLine: it => 'gen.so.reveal.' + (it.want === 'yes' ? 'cube' : 'box'), praise: 'praiseThink',
  make: s => ({ want: s.w === s.h && s.h === s.d ? 'yes' : 'no', tag: 'so-kind' + (s.faces ? '-faces' : '') }),
  draw(svg, item, tries) { const B = item.faces ? soFaces(svg, item.w, item.h, item.d) && null : soBox(svg, item.w, item.h, item.d, { dims: true, s: soFit(item.w, item.h, item.d), cy: 116 });
    if (tries >= 3) ciEq(helpG(svg), 180, 232, `${item.w} ، ${item.h} ، ${item.d}`, SO.hl, 18); return B ? { G: B.G } : {}; },
  h2: async (item, ctx) => { const m = helpG(ctx.svg);   /* الأطوال الثلاثة مرسومة: هل تتساوى؟ */
    if (ctx.G) { const P = ctx.G.P; for (const [a, b] of [['flb', 'frb'], ['flb', 'flt'], ['frb', 'brb']]) geoLine(m, P[a][0], P[a][1], P[b][0], P[b][1], { color: THINK_INK, w: 5 }); }
    else { const s = Math.min(14, 76 / Math.max(item.w, item.h, item.d)); [[item.w, item.h], [item.d, item.h], [item.w, item.d]].forEach(([a, b], i) => { const cx = [290, 180, 70][i], W = a * s, H = b * s, q = Math.min(W, H); el('rect', { x: cx - W / 2, y: 128 + H / 2 - q, width: q, height: q, fill: 'none', stroke: THINK_INK, 'stroke-width': 2.6, 'stroke-dasharray': '5 4' }, m); }); }
    await sleep(FAST ? 10 : 250); },
  pick: item => yesNo(item.want),
  errOf: it => it.want === 'no' ? 'soAllCube' : 'soCubeNo' });

/* ================= ④ أيّ وجهٍ يقابل الوجه الملوّن؟ أو يساويه؟ (C318، C319): w h d، face front | top | right ================= */
const SO_OPP = { front: 'back', top: 'bottom', right: 'left', back: 'front', bottom: 'top', left: 'right' };
ITEM.soOpp = cpItem({ H: 250, tLine: 'gen.so.together.opp', hint: 'gen.so.hint.opp', rLine: it => 'gen.so.f.' + it.want, praise: 'praiseThink',
  make: s => ({ want: SO_OPP[s.face], tag: 'so-opp-' + (s.ask || 'opp') }),
  draw(svg, item, tries) { const B = soBox(svg, item.w, item.h, item.d, { hl: item.face, dims: !!item.dimsOn, s: soFit(item.w, item.h, item.d), cy: 116 });
    if (tries >= 3) { const m = helpG(svg), G = B.G; el('polygon', { points: polyStr(G.F[item.want].map(v => G.P[v])), fill: SO.hl, 'fill-opacity': .2, stroke: SO.hl, 'stroke-width': 3, 'stroke-dasharray': '7 4' }, m); } return { G: B.G }; },
  h2: async (item, ctx) => { if (ctx.G) { const m = helpG(ctx.svg), cenOf = ks => [ks.reduce((a, k) => a + ctx.G.P[k][0], 0) / ks.length, ks.reduce((a, k) => a + ctx.G.P[k][1], 0) / ks.length], A = cenOf(ctx.G.F[item.face]), O = cenOf(Object.keys(ctx.G.P)), ang = Math.atan2(O[1] - A[1], O[0] - A[0]) * 180 / Math.PI;   /* من الوجه الملوّن إلى داخل العلبة: المقابل في الجهة الأخرى */
    geoLine(m, A[0], A[1], O[0], O[1], { color: THINK_INK, w: 3, dash: '6 4' }); geoArrow(m, O[0], O[1], ang, THINK_INK, 11); el('circle', { cx: A[0], cy: A[1], r: 4.5, fill: THINK_INK }, m); } await sleep(FAST ? 10 : 250); },
  pick: item => { const adj = ['back', 'bottom', 'left'].filter(k => k !== item.want), opts = shuffle([item.want, ...adj]); return choosePick(opts.map(k => [k, labelText('soF.' + k), '<i></i>', 'gen.so.f.' + k]), item.want); },
  errOf: () => 'soAdjacent' });

/* ================= ⑤ الشبكة تُطوى (C320): يُدحرج المكعب على مربعات الشبكة؛ الصالحة ستة أوجه مختلفة ================= */
function soFold(net) { const key = ([c, r]) => c + ',' + r, cells = new Map(net.map((p, i) => [key(p), i])), out = new Array(net.length), N = v => v.join(',');
  const go = (i, n, u, v) => { if (out[i] !== undefined) return; out[i] = N(n); const [c, r] = net[i];
    for (const [dc, dr, f] of [[1, 0, () => [u, n.map(x => -x), v]], [-1, 0, () => [u.map(x => -x), n, v]], [0, 1, () => [v, u, n.map(x => -x)]], [0, -1, () => [v.map(x => -x), u, n]]]) { const j = cells.get(key([c + dc, r + dr])); if (j !== undefined && out[j] === undefined) { const [n2, u2, v2] = f(); go(j, n2, u2, v2); } } };
  go(0, [0, 0, -1], [1, 0, 0], [0, 1, 0]); const faces = out.filter(x => x !== undefined), ok = faces.length === 6 && new Set(faces).size === 6;
  return { ok, face: out, connected: faces.length === net.length }; }
function soNetDraw(parent, net, o = {}) { const g = el('g', { 'pointer-events': 'none' }, parent), cs = net.map(p => p[0]), rs = net.map(p => p[1]), c0 = Math.min(...cs), r0 = Math.min(...rs), nc = Math.max(...cs) - c0 + 1, nr = Math.max(...rs) - r0 + 1,
    s = o.s || Math.min(44, (o.W || 300) / nc, (o.H || 190) / nr), x0 = (o.cx ?? 180) - nc * s / 2, y0 = (o.cy ?? 120) - nr * s / 2, F = o.fold ? soFold(net) : null;
  const colOf = i => { if (!F || !F.face[i]) return SO.face; const n = F.face[i].split(',').map(Number), ax = n.findIndex(x => x !== 0); return SO.pair[ax]; };
  net.forEach(([c, r], i) => el('rect', { x: x0 + (c - c0) * s, y: y0 + (r - r0) * s, width: s, height: s, fill: colOf(i), 'fill-opacity': F ? .8 : 1, stroke: SO.edge, 'stroke-width': 2.4 }, g));
  if (F && !F.ok) { const seen = {}; net.forEach(([c, r], i) => { const f = F.face[i]; if (f === undefined) return; if (seen[f] !== undefined) [seen[f], i].forEach(j => el('rect', { x: x0 + (net[j][0] - c0) * s + 3, y: y0 + (net[j][1] - r0) * s + 3, width: s - 6, height: s - 6, fill: 'none', stroke: SO.bad, 'stroke-width': 4 }, g)); seen[f] = i; });
    if (!F.connected) net.forEach(([c, r], i) => { if (F.face[i] === undefined) el('rect', { x: x0 + (c - c0) * s + 3, y: y0 + (r - r0) * s + 3, width: s - 6, height: s - 6, fill: 'none', stroke: SO.bad, 'stroke-width': 4 }, g); }); }
  return { g, s, x0, y0 }; }
const soNetSvg = net => { const d = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); d.setAttribute('viewBox', '0 0 120 90'); d.setAttribute('width', '84'); d.setAttribute('height', '63'); d.setAttribute('aria-hidden', 'true'); soNetDraw(d, net, { cx: 60, cy: 45, W: 112, H: 84 }); return d.outerHTML; };
ITEM.soNetYN = cpItem({ H: 250, tLine: 'gen.so.together.net', hint: 'gen.so.hint.net', rLine: it => 'gen.so.reveal.net.' + it.want, praise: 'praiseThink',
  make: s => ({ want: soFold(s.net).ok ? 'yes' : 'no', tag: 'so-net-yn' }),
  draw(svg, item, tries) { return { N: soNetDraw(svg, item.net, { fold: tries >= 3 && soFold(item.net).ok }) }; },
  h2: async (item, ctx) => { if (ctx.N) { const m = helpG(ctx.svg), F = soFold(item.net), { s, x0, y0 } = ctx.N, c0 = Math.min(...item.net.map(p => p[0])), r0 = Math.min(...item.net.map(p => p[1]));   /* القاعدة وما يقابلها بعد الطيّ */
    item.net.forEach(([c, r], i) => { if (i && F.face[i] !== '0,0,1') return; el('rect', { x: x0 + (c - c0) * s + 4, y: y0 + (r - r0) * s + 4, width: s - 8, height: s - 8, fill: SO.pair[2], 'fill-opacity': .55, stroke: THINK_INK, 'stroke-width': 2.6, 'stroke-dasharray': i ? '5 4' : null }, m); }); } await sleep(FAST ? 10 : 250); },
  show: async (item, ctx) => { if (ctx && ctx.svg) { ctx.svg.querySelectorAll('[data-help]').forEach(n => n.remove()); soNetDraw(helpG(ctx.svg), item.net, { fold: true }); } },
  pick: item => yesNo(item.want),
  errOf: it => it.want === 'no' ? 'netAnySix' : 'netNo' });
/* أيّ الشبكات الثلاث تُطوى مكعباً؟ */
ITEM.soNetPick = cpItem({ H: 214,   /* الأرقام داخل الإطار لا على حافته (المراجع B) */ tLine: 'gen.so.together.netPick', hint: 'gen.so.hint.net', rLine: 'gen.so.reveal.netPick', praise: 'praiseThink',
  make: s => { const i = s.nets.findIndex(n => soFold(n).ok); return { want: 'n' + i, tag: 'so-net-pick' }; },
  draw(svg, item, tries) { item.nets.forEach((n, i) => { const cx = [296, 180, 64][i]; soNetDraw(svg, n, { cx, cy: 104, W: 96, H: 140, fold: tries >= 3 }); badge(svg, cx, 186, i + 1); });
    if (tries >= 3) { const m = helpG(svg); ciRule(m, 180, 22, labelText('soRule.net'), SO.hl, 14); } return {}; },
  h2: async (item, ctx) => { ciRule(helpG(ctx.svg), 180, 22, labelText('soRule.net'), SO.hl, 14); await sleep(FAST ? 10 : 250); },
  pick: item => choosePick(item.nets.map((n, i) => ['n' + i, labelText('soNet.' + (i + 1)), '<i></i>', 'gen.so.net.' + (i + 1)]), item.want),
  errOf: () => 'netAnySix' });
/* «المفتاح المطوي»: أيّ شبكةٍ تُطوى هذا المجسّم؟ solid cube | box | sqPyr */
const SO_NETS = { cube: [[1, 0], [0, 1], [1, 1], [2, 1], [3, 1], [1, 2]] };
function soNetIcon(k, d) { if (!d) { d = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); d.setAttribute('viewBox', '0 0 120 90'); d.setAttribute('width', '84'); d.setAttribute('height', '63'); d.setAttribute('aria-hidden', 'true'); }
  if (k === 'cube') soNetDraw(d, SO_NETS.cube, { cx: 60, cy: 45, W: 112, H: 84 });
  else if (k === 'box') { const g = el('g', {}, d), R = (x, y, w, h, f) => el('rect', { x, y, width: w, height: h, fill: f, stroke: SO.edge, 'stroke-width': 2 }, g); R(30, 30, 36, 18, SO.face); R(30, 12, 36, 18, SO.top); R(30, 48, 36, 18, SO.top); R(30, 66, 36, 18, SO.face); R(6, 30, 24, 18, SO.side); R(66, 30, 24, 18, SO.side); }
  else if (k === 'triPyr') { const g = el('g', {}, d), A = [60, 6], B = [16, 82], C = [104, 82], m = (p, q) => [(p[0] + q[0]) / 2, (p[1] + q[1]) / 2];
    for (const t of [[A, m(A, B), m(A, C)], [m(A, B), B, m(B, C)], [m(A, C), m(B, C), C], [m(A, B), m(B, C), m(A, C)]]) el('polygon', { points: polyStr(t), fill: t[0] === A || t[1] === B || t[2] === C ? SO.side : SO.face, stroke: SO.edge, 'stroke-width': 2 }, g); }
  else { const g = el('g', {}, d), c = [60, 45], s = 22; el('rect', { x: c[0] - s, y: c[1] - s, width: 2 * s, height: 2 * s, fill: SO.face, stroke: SO.edge, 'stroke-width': 2 }, g);
    for (const [a, b, t] of [[[c[0] - s, c[1] - s], [c[0] + s, c[1] - s], [c[0], c[1] - s - 20]], [[c[0] - s, c[1] + s], [c[0] + s, c[1] + s], [c[0], c[1] + s + 20]], [[c[0] - s, c[1] - s], [c[0] - s, c[1] + s], [c[0] - s - 20, c[1]]], [[c[0] + s, c[1] - s], [c[0] + s, c[1] + s], [c[0] + s + 20, c[1]]]]) el('polygon', { points: polyStr([a, b, t]), fill: SO.side, stroke: SO.edge, 'stroke-width': 2 }, g); }
  return d; }
const SO_NF = { cube: 6, box: 6, sqPyr: 5, triPyr: 4 };   /* عدد الأوجه: ما خالفه يبهت في الحلّ المشترك */
ITEM.soNetMatch = cpItem({ H: 262, tLine: 'gen.so.together.match', hint: 'gen.so.hint.match', rLine: 'gen.so.reveal.match', praise: 'praiseThink',
  make: s => { const order = s.order || shuffle(['cube', 'box', 'sqPyr', 'triPyr']); return { order, want: 'p' + order.indexOf(s.solid), tag: 'so-net-match' }; },
  draw(svg, item, tries) { const top = el('g', { transform: 'translate(90 0) scale(.5)', 'pointer-events': 'none' }, svg); soSolid(top, item.solid, { cy: item.solid.endsWith('Pyr') ? 196 : 112, sc: .9, s: 26 });
    item.order.forEach((k, i) => { const cx = [315, 225, 135, 45][i], g = el('g', { transform: `translate(${cx - 42} 132) scale(.7)`, 'pointer-events': 'none', opacity: tries >= 3 && SO_NF[k] !== SO_NF[item.solid] ? .3 : null }, svg); soNetIcon(k, g); badge(svg, cx, 212, i + 1); });
    if (tries >= 3) ciRule(helpG(svg), 180, 240, labelText('soMatch.' + item.solid), SO.hl, 14); return {}; },
  h2: async (item, ctx) => { ciRule(helpG(ctx.svg), 180, 240, labelText('soMatch.' + item.solid), SO.hl, 14); await sleep(FAST ? 10 : 250); },
  pick: item => choosePick(item.order.map((k, i) => ['p' + i, labelText('soNet.' + (i + 1)), '<i></i>', 'gen.so.net.' + (i + 1)]), item.want, { cls: 'four' }),
  errOf: () => 'netMatchOff' });

/* ================= ⑥ مساحة السطح (C321): w h d وu؛ wrap: أيّ ورقٍ يكفي («مغلّف المجسّمات»)؛ ch من المولّد ================= */
const soSA = it => 2 * (it.w * it.h + it.w * it.d + it.h * it.d);
const soLine = (v, u) => `gen.so.v.${v}.${u}`;
ITEM.soArea = cpItem({ H: 250, tLine: 'gen.so.together.sa', hint: 'gen.so.hint.sa', rLine: 'gen.ci.reveal.calc', rSay: it => S(soLine(it.want, it.u + '2'), { append: true }), praise: 'praiseThink',
  make: s => ({ want: s.ch[0][0], tag: 'so-area' + (s.wrap ? '-wrap' : '') + (s.w === s.h && s.h === s.d ? '-cube' : '') }),
  draw(svg, item, tries) { soBox(svg, item.w, item.h, item.d, { dims: true, u: item.u, s: soFit(item.w, item.h, item.d, 210, 130), cy: 112 });
    if (tries >= 3) ciEq(helpG(svg), 180, 232, `2 × (${item.w} × ${item.h} + ${item.w} × ${item.d} + ${item.h} × ${item.d}) = ؟`, SO.hl, 15); return {}; },
  h2: async (item, ctx) => { ciRule(helpG(ctx.svg), 180, 230, labelText('soRule.sa'), SO.hl, 14); await sleep(FAST ? 10 : 250); },
  show: async (item, ctx) => { if (ctx && ctx.svg) { ctx.svg.querySelectorAll('[data-help]').forEach(n => n.remove()); ciEq(helpG(ctx.svg), 180, 232, `2 × (${item.w * item.h} + ${item.w * item.d} + ${item.h * item.d}) = ${soSA(item)}`, SO.ok, 16); } },
  pick: item => choosePick(shuffle(item.ch.map(([v]) => [String(v), (item.wrap ? labelText('soPaper') + ' ' : '') + ciTxt(v, item.u + '2'), '<i></i>', soLine(v, item.u + '2')])), String(item.want)),
  errOf: (it, k) => (it.ch.find(([v]) => String(v) === k) || [])[1] || 'saOff' });
ITEM.soArea.judge = (item, k) => k === String(item.want) ? { ok: true } : { ok: false, err: (item.ch.find(([v]) => String(v) === k) || [])[1] || 'saOff' };

/* ================= ⑦ المسقط (C322): w d h، view front | side | top؛ الخيارات مستطيلات بأبعادها ================= */
const SO_VIEW = (it, v) => v === 'front' ? [it.w, it.h] : v === 'side' ? [it.d, it.h] : [it.w, it.d];
function soRectIcon(a, b) { const d = document.createElementNS('http://www.w3.org/2000/svg', 'svg'), s = Math.min(9, 70 / Math.max(a, b)); d.setAttribute('viewBox', '0 0 100 80'); d.setAttribute('width', '80'); d.setAttribute('height', '64'); d.setAttribute('aria-hidden', 'true');
  el('rect', { x: 50 - a * s / 2, y: 36 - b * s / 2, width: a * s, height: b * s, fill: SO.face, stroke: SO.edge, 'stroke-width': 2.4 }, d); return d.outerHTML; }
ITEM.soView = cpItem({ H: 240, tLine: 'gen.so.together.view', hint: 'gen.so.hint.view', rLine: it => 'gen.so.view.' + it.view, praise: 'praiseThink',
  make: s => ({ want: s.view, tag: 'so-view-' + s.view }),
  draw(svg, item, tries) { const B = soBox(svg, item.w, item.h, item.d, { dims: true, s: soFit(item.w, item.h, item.d, 200, 120), cy: 108 });
    const G = B.G, eye = { front: [G.P.flb[0] + G.W / 2, G.P.flb[1] + 34, -90], side: [G.P.frb[0] + G.dx + 40, G.P.frb[1] - G.H / 2, 180], top: [G.P.flt[0] + G.W / 2 + G.dx / 2, G.P.flt[1] + G.dy - 30, 90] }[item.view];
    const m = el('g', { 'pointer-events': 'none' }, svg), a = eye[2] * Math.PI / 180, tail = [eye[0] - 30 * Math.cos(a), eye[1] - 30 * Math.sin(a)]; geoLine(m, tail[0], tail[1], eye[0], eye[1], { color: SO.hl, w: 3.4 }); geoArrow(m, eye[0], eye[1], eye[2], SO.hl, 12); el('circle', { cx: tail[0], cy: tail[1], r: 8, fill: '#fff', stroke: SO.hl, 'stroke-width': 2.6 }, m); el('circle', { cx: tail[0], cy: tail[1], r: 3, fill: SO.hl }, m);   /* عينٌ وسهمٌ إلى الوجه المنظور */
    if (tries >= 3) { const h = helpG(svg); el('polygon', { points: polyStr(G.F[item.view === 'side' ? 'right' : item.view].map(v => G.P[v])), fill: SO.hl, 'fill-opacity': .3, stroke: SO.hl, 'stroke-width': 3 }, h); } return { G, eye }; },
  h2: async (item, ctx) => { if (ctx.G) { const m = helpG(ctx.svg), G = ctx.G, ks = G.F[item.view === 'side' ? 'right' : item.view], A = [ks.reduce((a, k) => a + G.P[k][0], 0) / 4, ks.reduce((a, k) => a + G.P[k][1], 0) / 4], E = ctx.eye;   /* خطّ النظر حتى الوجه الذي تلقاه العين */
    geoLine(m, E[0], E[1], A[0], A[1], { color: SO.hl, w: 3, dash: '6 4' }); el('circle', { cx: A[0], cy: A[1], r: 5.5, fill: SO.hl, stroke: '#fff', 'stroke-width': 2 }, m); } await sleep(FAST ? 10 : 250); },
  pick: item => choosePick(shuffle(['front', 'side', 'top'].map(v => { const [a, b] = SO_VIEW(item, v); return [v, `${MS(String(a))} × ${MS(String(b))}`, soRectIcon(a, b), 'gen.so.view.' + v]; })), item.want),
  errOf: () => 'viewSwap' });

/* ================= صورة التعليل (sopic): box [w h d] | solid | net | faces ================= */
function soReasonPic(g, P) { if (P.box) soBox(g, P.box[0], P.box[1], P.box[2], { dims: !!P.dims, s: soFit(...P.box, 200, 120), cy: 96 });
  else if (P.solid) soSolid(g, P.solid, { cy: P.solid.endsWith('Pyr') ? 190 : 104, sc: .8, s: 22 }); else if (P.net) soNetDraw(g, P.net, { cy: 100 });
  if (P.f) ciEq(g, 180, 200, P.f, P.bad ? SO.bad : SO.ink, 18); }

/* ================= المشاهد ================= */
const soSay = async (L, i) => { if (L[i]) await S(L[i]); };
/* د1 الإشعال: «للمكعب 4 أوجه وحسب!»: نعلّم الأوجه الظاهرة ثم المخفية حتى ستة */
SCENES.soHook = async c => { const L = c.lines, svg = m3Stage(250), B = soBox(svg, 4, 4, 4, { s: 30, cy: 132 }), G = B.G; await soSay(L, 0);
  const m = el('g', { 'pointer-events': 'none' }, svg); let n = 0; for (const k of ['front', 'top', 'right', 'back', 'left', 'bottom']) { const Q = G.F[k].map(v => G.P[v]), cx = Q.reduce((a, p) => a + p[0], 0) / 4, cy = Q.reduce((a, p) => a + p[1], 0) / 4;
    const hid = ['back', 'left', 'bottom'].includes(k); badge(m, cx + (hid ? (k === 'left' ? -18 : k === 'bottom' ? -10 : 14) : 0), cy + (hid ? (k === 'bottom' ? 10 : -12) : 0), ++n, hid ? SO.hl : SO.ok); SFX.tick(); await sleep(FAST ? 2 : 380); } await soSay(L, 1); };
/* د1 الاكتشاف (أ): المكعب 6 أوجه، والأسطوانة 3 أسطح، والمخروط سطحان */
SCENES.soFacesShow = async c => { const L = c.lines, svg = m3Stage(250); let g = el('g', { 'pointer-events': 'none' }, svg);
  soBox(g, 4, 4, 4, { s: 26, cy: 116 }); htLab(g, [180, 220], MS('6'), SO.ok, 20);   /* فوق حافة الإطار */ await soSay(L, 0);
  g.remove(); g = el('g', { 'pointer-events': 'none' }, svg); solidAt(g, { solid: 'cylinder', size: 130, noShadow: true }, 100, 130); solidAt(g, { solid: 'cone', size: 130, noShadow: true }, 262, 140); htLab(g, [100, 220], MS('3'), SO.ok, 20); htLab(g, [262, 220], MS('2'), SO.ok, 20); await soSay(L, 1); };
/* د1 الاكتشاف (ب) و(ج): الأحرف 12 تتلوّن واحداً واحداً، والرؤوس 8، وعند كل رأس ثلاثة أحرف؛ ثم الأزواج المتقابلة الثلاثة */
SCENES.soEdgesShow = async c => { const L = c.lines, svg = m3Stage(250), B = soBox(svg, 4, 4, 4, { s: 30, cy: 132, k: .62 }), G = B.G, m = el('g', { 'pointer-events': 'none' }, svg), cnt = el('text', { x: 330, y: 34, 'text-anchor': 'end', 'font-size': 22, 'font-weight': 800, fill: SO.ok, 'pointer-events': 'none' }, svg);
  for (const [i, e] of G.E.entries()) { geoLine(m, e.A[0], e.A[1], e.B[0], e.B[1], { color: SO.ok, w: 5 }); cnt.textContent = MS(String(i + 1)); SFX.tick(); await sleep(FAST ? 2 : 180); } await soSay(L, 0);
  m.innerHTML = ''; let n = 0; for (const k of Object.keys(G.P)) { el('circle', { cx: G.P[k][0], cy: G.P[k][1], r: 7, fill: SO.hl }, m); cnt.textContent = MS(String(++n)); cnt.setAttribute('fill', SO.hl); SFX.tick(); await sleep(FAST ? 2 : 200); }
  const v = G.P.frt; el('circle', { cx: v[0], cy: v[1], r: 16, fill: 'none', stroke: SO.hl, 'stroke-width': 3 }, m); await soSay(L, 1);
  m.innerHTML = ''; cnt.textContent = ''; [['front', 'back'], ['top', 'bottom'], ['right', 'left']].forEach(([a, b], i) => [a, b].forEach(k => el('polygon', { points: polyStr(G.F[k].map(p => G.P[p])), fill: SO.pair[i], 'fill-opacity': .45, stroke: SO.pair[i], 'stroke-width': 2.4 }, m))); await soSay(L, 2); };
/* ركن الفضول: سرّ أويلر (يُكتشف ولا يُختبر، D196): الرؤوس − الأحرف + الأوجه = 2 */
SCENES.eulerShow = async c => { const L = c.lines, svg = m3Stage(250), g = el('g', { 'pointer-events': 'none' }, svg), rows = [['soN.cube', 8, 12, 6], ['soN.triPyr', 4, 6, 4], ['soN.sqPyr', 5, 8, 5]];
  const hd = [['soH.name', 300], ['soH.v', 222], ['soH.e', 162], ['soH.f', 102], ['soH.r', 42]]; hd.forEach(([k, x]) => { const t = el('text', { x, y: 40, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 800, fill: SO.ink, direction: 'rtl' }, g); t.textContent = labelText(k); });
  for (const [i, [k, v, e, f]] of rows.entries()) { const y = 82 + i * 52; el('rect', { x: 14, y: y - 28, width: 332, height: 44, rx: 10, fill: i % 2 ? '#f6eccf' : '#fff', stroke: SO.grid, 'stroke-width': 2 }, g); htLab(g, [300, y - 6], labelText(k), SO.ink, 14);
    for (const [val, x] of [[v, 222], [e, 162], [f, 102]]) htLab(g, [x, y - 6], MS(String(val)), SO.edge, 16); if (i === 0) await soSay(L, 0); else await sleep(FAST ? 2 : 300); }
  for (const i of [0, 1, 2]) { const y = 82 + i * 52; htLab(g, [42, y - 6], MS('2'), SO.ok, 18); SFX.tick(); await sleep(FAST ? 2 : 300); } for (const l of L.slice(1)) await S(l); };
/* د2 الإشعال: «هذه مكعب!»: نقيس الأطوال الثلاثة 8 و6 و3 */
SCENES.boxHook = async c => { const L = c.lines, svg = m3Stage(250); soBox(svg, 8, 3, 6, { s: 17, cy: 130 }); await soSay(L, 0); soBox(svg, 8, 3, 6, { s: 17, cy: 130, dims: true, fill: false }); SFX.tick(); await soSay(L, 1); };
/* د2 الاكتشاف: ستة مستطيلات، والأحرف أربعة بكل طول، والمكعب حين تتساوى الأطوال، والمتقابلان متساويان */
SCENES.boxShow = async c => { const L = c.lines, svg = m3Stage(250); let g = el('g', { 'pointer-events': 'none' }, svg); const B = soBox(g, 8, 3, 6, { s: 17, cy: 130, dims: true }), G = B.G; await soSay(L, 0);
  const groups = [[0, 2, 4, 6], [1, 3, 5, 7], [8, 9, 10, 11]], m = el('g', { 'pointer-events': 'none' }, g); for (const [i, grp] of groups.entries()) { for (const j of grp) { const e = G.E[j]; geoLine(m, e.A[0], e.A[1], e.B[0], e.B[1], { color: SO.pair[i], w: 5 }); } SFX.tick(); await sleep(FAST ? 2 : 450); } await soSay(L, 1);
  g.remove(); g = el('g', { 'pointer-events': 'none' }, svg); soBox(g, 5, 5, 5, { s: 22, cy: 130, dims: true }); await soSay(L, 2);
  g.remove(); g = el('g', { 'pointer-events': 'none' }, svg); const B2 = soBox(g, 8, 3, 6, { s: 17, cy: 130 }); [['front', 'back'], ['top', 'bottom'], ['right', 'left']].forEach(([a, b], i) => [a, b].forEach(k => el('polygon', { points: polyStr(B2.G.F[k].map(p => B2.G.P[p])), fill: SO.pair[i], 'fill-opacity': .45, stroke: SO.pair[i], 'stroke-width': 2.4 }, g))); await soSay(L, 3); };
/* د3 الإشعال: «تبقى الأوجه متصلة!»: من قصّ الأحرف كلها تتفرّق ستة أوجه */
SCENES.netHook = async c => { const L = c.lines, svg = m3Stage(250); let g = el('g', { 'pointer-events': 'none' }, svg); soBox(g, 4, 4, 4, { s: 28, cy: 128 }); await soSay(L, 0);
  g.remove(); g = el('g', { 'pointer-events': 'none' }, svg); [[40, 40], [150, 30], [260, 50], [60, 150], [170, 160], [270, 150]].forEach(([x, y], i) => el('rect', { x, y, width: 56, height: 56, fill: SO.face, stroke: SO.bad, 'stroke-width': 2.4, transform: `rotate(${[-8, 6, -4, 10, -6, 4][i]} ${x + 28} ${y + 28})` }, g)); SFX.soft(); await soSay(L, 1); };
/* د3 الاكتشاف: الشبكة تُطوى مكعباً (أزواج الأوجه المتقابلة بلون واحد)، وشبكتان مختلفتان للمكعب نفسه، وما لا يصلح */
SCENES.netShow = async c => { const L = c.lines, svg = m3Stage(250); let g = el('g', { 'pointer-events': 'none' }, svg); soNetDraw(g, SO_NETS.cube, { cy: 120, s: 46 }); await soSay(L, 0);
  g.remove(); g = el('g', { 'pointer-events': 'none' }, svg); soNetDraw(g, SO_NETS.cube, { cy: 120, s: 46, fold: true }); SFX.tick(); await soSay(L, 1);
  g.remove(); g = el('g', { 'pointer-events': 'none' }, svg); soNetDraw(g, SO_NETS.cube, { cx: 96, cy: 120, s: 30, fold: true }); soNetDraw(g, [[0, 0], [1, 0], [1, 1], [2, 1], [2, 2], [3, 2]], { cx: 266, cy: 120, s: 30, fold: true }); await soSay(L, 2);
  g.remove(); g = el('g', { 'pointer-events': 'none' }, svg); soNetDraw(g, [[0, 0], [1, 0], [2, 0], [3, 0], [4, 0], [2, 1]], { cx: 100, cy: 110, s: 30, fold: true }); soNetDraw(g, [[0, 0], [1, 0], [0, 1], [1, 1], [2, 1], [1, 2]], { cx: 270, cy: 110, s: 30, fold: true }); SFX.soft(); await soSay(L, 3); };
/* د4 الإشعال: «يكفي مستطيل صغير!»: الورقة 30 والعلبة 52 */
SCENES.wrapHook = async c => { const L = c.lines, svg = m3Stage(250); soBox(svg, 4, 2, 3, { s: 26, cx: 136, cy: 132, dims: true }); el('rect', { x: 244, y: 92, width: 90, height: 60, fill: '#f6cf7e', stroke: SO.bad, 'stroke-width': 2.4, 'pointer-events': 'none' }, svg); htLab(svg, [289, 128], MS('30') + ' ' + labelText('arCm2'), SO.bad, 14); await soSay(L, 0);
  ciEq(svg, 180, 230, '2 × (12 + 8 + 6) = 52', SO.ok, 18); SFX.tick(); await soSay(L, 1); };
/* د4 الاكتشاف: علبة 4 و3 و2: كل زوج متقابل بمساحة واحدة، فثلاثة أوجه × 2 = 52 سم²؛ ثم غطاء مكعب ضلعه 3 م: 54 م² */
SCENES.saShow = async c => { const L = c.lines, svg = m3Stage(250); let g = el('g', { 'pointer-events': 'none' }, svg); const B = soBox(g, 4, 2, 3, { s: 26, cx: 110, cy: 130, dims: true }), G = B.G, t = el('g', { 'pointer-events': 'none' }, svg);
  const rows = [['front', 'back', '2 × (4 × 2) = 16', 0], ['top', 'bottom', '2 × (4 × 3) = 24', 1], ['right', 'left', '2 × (3 × 2) = 12', 2]];
  for (const [i, [a, b, f, ci]] of rows.entries()) { [a, b].forEach(k => el('polygon', { points: polyStr(G.F[k].map(p => G.P[p])), fill: SO.pair[ci], 'fill-opacity': .45 }, g)); ciEq(t, 270, 60 + i * 46, f, SO.pair[ci] === SOLIDC.cube ? '#5a7d16' : SO.pair[ci] === SOLIDC.sphere ? '#b03a6a' : '#2a5f94', 16); SFX.tick(); if (i === 0) await soSay(L, 0); else await sleep(FAST ? 2 : 500); }
  ciEq(t, 270, 204, '16 + 24 + 12 = 52', SO.ok, 17); await soSay(L, 1);
  g.remove(); t.remove(); g = el('g', { 'pointer-events': 'none' }, svg); soBox(g, 3, 3, 3, { s: 30, cy: 120, dims: true, u: 'm' }); ciEq(g, 180, 232, '6 × 3 × 3 = 54', SO.ok, 18); await soSay(L, 2); };
/* د5 الإشعال: «هذه العلبة مربعة!» من الجانب، والعلبة نفسها من الأمام مستطيل */
SCENES.viewHook = async c => { const L = c.lines, svg = m3Stage(250), sq = el('rect', { x: 140, y: 80, width: 80, height: 80, fill: SO.side, stroke: SO.bad, 'stroke-width': 3, 'pointer-events': 'none' }, svg); await soSay(L, 0);
  sq.remove(); const g = el('g', { 'pointer-events': 'none' }, svg); soBox(g, 7, 3, 3, { s: 20, cy: 132, dims: true }); SFX.tick(); await soSay(L, 1); };
/* د5 الاكتشاف: علبة 4 و3 و2: الأمامي 4 × 2، والجانبي 3 × 2، والعلوي 4 × 3؛ ثم المكعب مساقطه مربعات */
SCENES.viewsShow = async c => { const L = c.lines, svg = m3Stage(250); let g = el('g', { 'pointer-events': 'none' }, svg); soBox(g, 4, 2, 3, { s: 24, cx: 180, cy: 110, dims: true }); await soSay(L, 0);
  g.remove(); g = el('g', { 'pointer-events': 'none' }, svg); const s = 22; [[4, 2, 'soV.front', 296], [3, 2, 'soV.side', 180], [4, 3, 'soV.top', 64]].forEach(([a, b, k, cx]) => { el('rect', { x: cx - a * s / 2, y: 120 - b * s / 2, width: a * s, height: b * s, fill: SO.face, stroke: SO.edge, 'stroke-width': 2.6 }, g); htLab(g, [cx, 120 + b * s / 2 + 18], `${MS(String(a))} × ${MS(String(b))}`, SO.ink, 15); htLab(g, [cx, 120 - b * s / 2 - 16], labelText(k), SO.edge, 14); });
  SFX.tick(); await soSay(L, 1);
  g.remove(); g = el('g', { 'pointer-events': 'none' }, svg); soBox(g, 4, 4, 4, { s: 24, cx: 110, cy: 130 }); soBox(g, 4, 4, 2, { s: 24, cx: 262, cy: 130 }); el('rect', { x: 150, y: 196, width: 60, height: 40, fill: 'none', 'pointer-events': 'none' }, g); await soSay(L, 2); for (const l of L.slice(3)) await S(l); };
/* د5 المشروع «علبة الهدية»: علبة 6 و4 و3: شبكتها ومساقطها ومساحة سطحها 108 سم²، ثم الجدول */
SCENES.giftShow = async c => { const L = c.lines, svg = m3Stage(262);
  if (c.table) { const rows = [['soT.net', '6'], ['soT.views', '6 × 3 ، 4 × 3 ، 6 × 4'], ['soT.sa', `108 ${labelText('arCm2')}`]], g = el('g', { 'pointer-events': 'none' }, svg);
    rows.forEach(([k, v], i) => { const y = 40 + i * 64; el('rect', { x: 28, y, width: 304, height: 54, rx: 12, fill: i % 2 ? '#f6eccf' : '#fff', stroke: SO.grid, 'stroke-width': 2 }, g); const a = el('text', { x: 318, y: y + 33, 'text-anchor': 'start', 'font-size': 15, 'font-weight': 800, fill: SO.ink, direction: 'rtl' }, g); a.textContent = labelText(k); const b = el('text', { x: 42, y: y + 33, 'text-anchor': 'end', 'font-size': 15, 'font-weight': 800, fill: SO.ok, direction: 'rtl' }, g); b.textContent = MS(v); });
    for (const l of L) await S(l); return; }
  let g = el('g', { 'pointer-events': 'none' }, svg); soBox(g, 6, 3, 4, { s: 22, cy: 128, dims: true }); await soSay(L, 0);
  if (c.setup) return;   /* المشروع: العلبة وحدها قبل بنود الطفل، والشبكة والورق بعدها في الجدول (D286 (1)) */
  g.remove(); g = el('g', { 'pointer-events': 'none' }, svg); const R = (x, y, w, h, f) => el('rect', { x, y, width: w, height: h, fill: f, stroke: SO.edge, 'stroke-width': 2 }, g), k = 13, X = 180 - 3 * k - 4 * k, Y = 20;
  R(X + 4 * k, Y, 6 * k, 4 * k, SO.top); R(X + 4 * k, Y + 4 * k, 6 * k, 3 * k, SO.face); R(X + 4 * k, Y + 7 * k, 6 * k, 4 * k, SO.top); R(X + 4 * k, Y + 11 * k, 6 * k, 3 * k, SO.face); R(X, Y + 4 * k, 4 * k, 3 * k, SO.side); R(X + 10 * k, Y + 4 * k, 4 * k, 3 * k, SO.side); SFX.tick(); await soSay(L, 1);
  g.remove(); g = el('g', { 'pointer-events': 'none' }, svg); ciEq(g, 180, 110, '2 × (6 × 3 + 6 × 4 + 3 × 4)', SO.ink, 18); ciEq(g, 180, 150, '2 × (18 + 24 + 12) = 108', SO.ok, 18); SFX.tick(); await soSay(L, 2); };
WRAP_ART.solidArt = svg => { soBox(svg, 5, 3, 4, { s: 22, cx: 130, cy: 120 }); soNetDraw(svg, SO_NETS.cube, { cx: 280, cy: 110, s: 22, fold: true }); };
