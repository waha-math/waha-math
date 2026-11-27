/* =====================================================================
   M4-U9 «التحويلات على المستوى الكامل» (المرحلة 4، نوفمبر 2026)
   د1 الانعكاس على المحورين (C420 أ) · د2 الدوران حول الأصل بمضاعفات 90° (C420 ب)
   د3 الدوران بزاوية بالمنقلة والفرجار (C422) وتركيب التحويلات · د4 مشروع «مدينة المرايا»
   الأسماء بالعربية والصيغ بالكلمات والأمثلة أولاً (المرجع، تعديل 1)
   ===================================================================== */
const C9 = { org: '#2f7fc1', img: '#d9822b', ok: SO.ok, hl: SO.hl, q: '#c0392b', ax: '#c0392b', arc: '#7a4fb0', ink: '#24323a' };
const c9Say = async (L, i) => { if (L[i]) await S(L[i]); };
/* التحويلات: الدوران عكس عقارب الساعة حول الأصل */
const C9_XF = { refV: ([x, y]) => [-x, y], refH: ([x, y]) => [x, -y], rot90: ([x, y]) => [-y, x], rot180: ([x, y]) => [-x, -y], rot270: ([x, y]) => [y, -x] };
const c9Ap = (s, p) => Array.isArray(s) ? [p[0] + s[1], p[1] + s[2]] : C9_XF[s](p);   /* خطوة: اسم تحويل، أو ['tr', dx، dy] */
const c9Run = (seq, p) => seq.reduce((q, s) => c9Ap(s, q), p);
const c9K = ps => ps.map(preKey).join(' ');
const c9Same = (a, b) => a.length === b.length && a.every((p, i) => p[0] === b[i][0] && p[1] === b[i][1]);
/* المحور المرآة مُبرَزاً، أو الأصل مركزاً للدوران */
function c9Mark(parent, Pl, xf) { const g = el('g', { 'pointer-events': 'none' }, parent);
  if (xf === 'refV' || xf === 'refVH') { const A = Pl.P(0, -Pl.m), B = Pl.P(0, Pl.m); geoLine(g, A[0], A[1], B[0], B[1], { color: C9.ax, w: 5 }); }
  if (xf === 'refH' || xf === 'refVH') { const A = Pl.P(-Pl.n, 0), B = Pl.P(Pl.n, 0); geoLine(g, A[0], A[1], B[0], B[1], { color: C9.ax, w: 5 }); }
  if (/^rot/.test(xf)) { const O = Pl.P(0, 0); el('circle', { cx: O[0], cy: O[1], r: 7, fill: C9.ax, stroke: '#fff', 'stroke-width': 2 }, g); }
  return g; }
/* بطاقة التحويل أعلى المسرح: اسمه بالكلمات */
function c9Card(svg, txt, o = {}) { const g = el('g', { 'pointer-events': 'none' }, svg), w = o.w || 230, cx = o.cx || 180, y = o.y ?? 4;
  el('rect', { x: cx - w / 2, y, width: w, height: 28, rx: 10, fill: '#fff', stroke: o.col || C9.ax, 'stroke-width': 2 }, g); preLab(g, cx, y + 20, txt, { fs: 15, col: o.col || C9.ax, dir: 'rtl' }); return g; }
const c9Name = xf => labelText('c9N.' + xf);
/* قاعدة التحويل: اسمه بالكلمات سطراً، وصيغته بالرمز تحته من اليمين لأن رموزها عربية (D280): (س ، ص) ← (−س ، ص)، والسالب على يمين الحرف */
const C9_FORM = { refV: ['−X', 'Y'], refH: ['X', '−Y'], rot90: ['−Y', 'X'], rot180: ['−X', '−Y'], rot270: ['Y', '−X'] };
function c9RuleCard(parent, cx, y, xf, o = {}) { const g = el('g', { 'pointer-events': 'none' }, parent), w = o.w || 250, col = o.col || C9.hl, X = labelText('coX'), Y = labelText('coY'), sub = t => t.replace('X', X).replace('Y', Y);
  el('rect', { x: cx - w / 2, y: y - 20, width: w, height: 50, rx: 12, fill: '#fff', stroke: col, 'stroke-width': 2.4 }, g); preLab(g, cx, y, labelText('c9Rule.' + xf), { fs: 14, col, dir: 'rtl' });
  /* كل رمزٍ في موضعه من اليمين، وبـ rtl فينعكس القوس كما في السطر العربي */
  const tok = ['(', 'X', '،', 'Y', ')', '←', '('].concat(...C9_FORM[xf].map((t, i) => (t[0] === '−' ? ['−', t[1]] : [t]).concat(i ? [] : ['،'])), [')']), W = { '(': 8, ')': 8, '،': 12, '←': 28, '−': 10 };
  const ws = tok.map(t => W[t] || 15), tot = ws.reduce((a, b) => a + b, 0); let x = cx + tot / 2;
  tok.forEach((t, i) => { const e = el('text', { x: x - ws[i] / 2, y: y + 22, 'text-anchor': 'middle', 'font-size': 16, 'font-weight': 800, fill: col, direction: 'rtl' }, g); e.textContent = sub(t); x -= ws[i]; });
  return g; }
/* قوس الدوران حول الأصل من النقطة إلى صورتها (عكس عقارب الساعة) */
function c9TurnArc(parent, Pl, p, q, o = {}) { const O = Pl.P(0, 0), A = Pl.P(...p), r = Math.hypot(A[0] - O[0], A[1] - O[1]), a0 = Math.atan2(O[1] - A[1], A[0] - O[0]) * 180 / Math.PI, B = Pl.P(...q);
  let a1 = Math.atan2(O[1] - B[1], B[0] - O[0]) * 180 / Math.PI; while (a1 <= a0 + 1) a1 += 360; if (o.cw) a1 -= 360;
  const g = el('g', { 'pointer-events': 'none' }, parent); el('path', { d: angArc(O, r, Math.min(a0, a1), Math.max(a0, a1)), fill: 'none', stroke: o.col || C9.arc, 'stroke-width': 2.6, 'stroke-dasharray': '6 4' }, g);
  geoArrow(g, B[0], B[1], -(a1 + (o.cw ? -90 : 90)), o.col || C9.arc, 7); return g; }

/* ================= ① ارسم الصورة على المستوى الكامل (C420): pts (نقطة إلى ثلاث)، xf؛ يلمس الطفل صورة كل رأس بالترتيب ================= */
function c9WrongImg(item) { const P = item.pts, alt = { refV: 'refH', refH: 'refV', rot90: 'rot270', rot270: 'rot90', rot180: 'refV' }[item.xf];
  let W = P.map(p => C9_XF[alt](p)); if (!c9Same(W, item.img)) return W; W = P.map(p => [p[0], p[1]]); if (!c9Same(W, item.img)) return W;
  return item.img.map(p => [p[0] + (p[0] < item.n ? 1 : -1), p[1]]); }
ITEM.c9Draw = {
  make(spec) { const img = spec.pts.map(p => C9_XF[spec.xf](p)), ex = c4Ext(spec.pts.concat(img), 5);
    /*T*/if (TESTHOOK && img.some(([x, y]) => Math.abs(x) > ex.n || Math.abs(y) > ex.ny)) testBug('c9Draw: الصورة خارج المستوى');/*/T*/
    return { ...spec, img, want: c9K(img), n: ex.n, ny: ex.ny, tag: 'c9-draw-' + spec.xf + (spec.pts.length === 1 ? '-pt' : '') }; },
  async ask(item, mode, tries) { const svg = m3Stage(262), Pl = c4Plane(svg, { n: item.n, ny: item.ny, top: 38 }), placed = [], lay = el('g', { 'pointer-events': 'none' }, svg); let prev = null, lastQ = null, done = false;
    c9Mark(svg, Pl, item.xf); xfPoly(svg, Pl, item.pts, { col: C9.org }); c9Card(svg, c9Name(item.xf));
    if (item.pts.length === 1) { const p = Pl.P(...item.pts[0]); coPairText(svg, p[0] + (item.pts[0][0] >= 0 ? 9 : -9), p[1] + (item.pts[0][1] >= 0 ? -10 : 19), preNum(item.pts[0][0]), preNum(item.pts[0][1]), item.pts[0][0] >= 0 ? 'start' : 'end', 12); }
    const redraw = () => { lay.innerHTML = ''; if (placed.length) xfPoly(lay, Pl, placed, { col: C9.img, fill: placed.length === item.pts.length && placed.length > 2 ? 'rgba(217,130,43,.14)' : 'none', img: true });
      /*T*/window.__axPlaced = placed.length;/*/T*/ };
    const preview = q => { if (prev) prev.remove(); prev = null; if (!q || placed.length >= item.pts.length) return; const P = Pl.P(...Pl.snap(q)); prev = el('circle', { cx: P[0], cy: P[1], r: 7, fill: 'none', stroke: C9.img, 'stroke-width': 2.5, 'stroke-dasharray': '3 3', 'pointer-events': 'none' }, svg); };
    const tapAt = p => { const L = placed[placed.length - 1]; if (L && L[0] === p[0] && L[1] === p[1]) placed.pop(); else if (placed.length < item.pts.length) placed.push(p); SFX.tick(); redraw(); };
    if (tries >= 3) { const h = helpG(svg); item.pts.forEach((p, i) => { const q = item.img[i]; if (/^rot/.test(item.xf)) c9TurnArc(h, Pl, p, q, { col: THINK_INK }); else { const A = Pl.P(...p), B = Pl.P(...q); geoLine(h, A[0], A[1], B[0], B[1], { color: THINK_INK, w: 2, dash: '5 4' }); } });
      placed.push(...item.img.slice(0, item.img.length - 1).map(p => [...p])); redraw(); }
    const askQ = async () => { if (tries >= 3) await S('gen.c9.together.draw'); else await S(item.q || 'gen.c9.q.draw.' + item.xf); };
    askQ(); REPLAY_HOOK = () => askQ(); REPLAY_HOOK.live = () => !done && svg.isConnected;
    const input = fingerInput(svg, { map: e => { const q = svgPoint(svg, e); return [q.x, q.y]; }, down(q) { if (!Pl.inside(q)) return false; lastQ = q; preview(q); }, move(q) { lastQ = q; preview(q); }, up(cancel) { preview(null); if (!cancel && lastQ) tapAt(Pl.snap(lastQ)); lastQ = null; }, lens: { Pl } });
    /*T*/window.__axWant = item.img; window.__axAt = (x, y) => { const m = svg.getScreenCTM(), [px, py] = Pl.P(x, y); return { x: m.a * px + m.e, y: m.d * py + m.f }; }; window.__axPlaced = placed.length;/*/T*/
    const kg = el('g', { role: 'grid', 'aria-label': labelText('coPlane') }, svg);
    for (let y = Pl.m; y >= -Pl.m; y--) { const row = el('g', { role: 'row' }, kg); for (let x = -Pl.n; x <= Pl.n; x++) { const [px, py] = Pl.P(x, y), b = el('g', { role: 'gridcell', tabindex: 0, 'aria-label': plain(G(labelText('c4Cell'))).replace('X', x).replace('Y', y) }, row); el('circle', { cx: px, cy: py, r: 7, fill: 'transparent', 'pointer-events': 'none' }, b); b.onkeydown = e => { if (isActKey(e)) { e.preventDefault(); tapAt([x, y]); } }; } }
    AUTO({ kind: 'axPts', ok: () => { placed.length = 0; placed.push(...item.img.map(p => [...p])); redraw(); rulDoneBtn().click(); }, wrong: () => { placed.length = 0; placed.push(...c9WrongImg(item).map(p => [...p])); redraw(); rulDoneBtn().click(); } });
    await rulDone(() => { done = true; REPLAY_HOOK = null; input.off(); kg.remove(); preview(null); }); return { ans: c9K(placed), ctx: { svg, Pl } }; },
  judge(item, k) { if (k === item.want) return { ok: true }; const a = k ? k.split(' ').map(s => s.split('_').map(v => v[0] === 'm' ? -+v.slice(1) : +v)) : [];
    if (a.length < item.pts.length) return { ok: false, err: 'c9Short' }; return { ok: false, err: c9ErrOf(item.xf, item.pts, a) }; },
  onOk() { SFX.good(); }, onWrong() { SFX.soft(); },
  async hint2(item) { await S('gen.c9.hint.' + item.xf); }, async together() {},
  async reveal(item, r) { if (r && r.ctx) xfPoly(r.ctx.svg, r.ctx.Pl, item.img, { col: C9.ok, fill: 'none', dash: '7 5', img: true }); await S('gen.c9.reveal.draw'); },
  praise: () => 'praisePlace', twin(item) { return item.twin || null; },
};
/* تشخيص الصورة: المحور الآخر، أو عكس الإشارتين، أو الإبقاء، أو الدوران بالاتجاه الآخر أو بمقدار آخر، أو تبديل الإحداثيين بلا إشارة */
function c9ErrOf(xf, P, a) { const is = f => c9Same(a, P.map(f));
  if (xf === 'refV' || xf === 'refH') return is(C9_XF[xf === 'refV' ? 'refH' : 'refV']) ? 'c9Axis' : is(C9_XF.rot180) ? 'c9Both' : is(p => p) ? 'c9Keep' : 'c9Off';
  if (xf === 'rot180') return is(C9_XF.refV) || is(C9_XF.refH) ? 'c9Half' : is(C9_XF.rot90) || is(C9_XF.rot270) ? 'c9Amount' : 'c9Off';
  if (is(C9_XF[xf === 'rot90' ? 'rot270' : 'rot90'])) return 'c9Dir';
  if (is(([x, y]) => [y, x])) return 'c9Swap';
  return is(C9_XF.rot180) ? 'c9Amount' : 'c9Off'; }

/* ================= ② صورة نقطة: اختيار الزوج (C420): p، xf ================= */
function c9PickCands(p, xf) { const [x, y] = p, img = C9_XF[xf](p), alt = { refV: [[x, -y], [-x, -y]], refH: [[-x, y], [-x, -y]], rot90: [[y, -x], [y, x], [-x, -y]], rot270: [[-y, x], [y, x], [-x, -y]], rot180: [[-x, y], [x, -y], [-y, x]] }[xf];
  return [img, ...alt, [-y, -x], [x + 1, y]].filter((q, i, X) => X.findIndex(r => r[0] === q[0] && r[1] === q[1]) === i && !(q[0] === x && q[1] === y)).slice(0, 3); }
ITEM.c9Pick = cpItem({ H: 262, tLine: 'gen.c9.together.pick', hint: 'gen.c9.hint.pick', rLine: 'gen.c9.reveal.pick', praise: 'praiseThink',
  make: s => { const img = C9_XF[s.xf](s.p); return { want: preKey(img), img, cands: c9PickCands(s.p, s.xf), ext: c4Ext([s.p, img], 5), tag: 'c9-pick-' + s.xf }; },
  draw(svg, item, tries) { const Pl = c4Plane(svg, { ...item.ext, top: 38 }); c9Mark(svg, Pl, item.xf); c4Dot(svg, Pl, ...item.p, { pair: true, col: C9.org }); c9Card(svg, c9Name(item.xf));
    if (tries >= 3) { const h = helpG(svg), q = Pl.P(...item.img); if (/^rot/.test(item.xf)) c9TurnArc(h, Pl, item.p, item.img, { col: THINK_INK }); el('circle', { cx: q[0], cy: q[1], r: 9, fill: 'none', stroke: C9.hl, 'stroke-width': 3, 'stroke-dasharray': '4 3' }, h); }
    return { Pl }; },
  h2: async (item, ctx) => { c9RuleCard(helpG(ctx.svg), 180, 58, item.xf); await sleep(FAST ? 10 : 250); },
  show: async (item, ctx) => { if (ctx && ctx.Pl) c4Dot(helpG(ctx.svg), ctx.Pl, ...item.img, { col: C9.ok, pair: true }); },
  pick: item => choosePick(shuffle(item.cands.map(p => [preKey(p), coPair(preNum(p[0]), preNum(p[1])), '<i></i>', 'gen.c4.pt.' + preKey(p)])), item.want),
  errOf: (it, k) => { const a = [k.split('_').map(v => v[0] === 'm' ? -+v.slice(1) : +v)]; return c9ErrOf(it.xf, [it.p], a); } });

/* ================= ③ أيّ إحداثيٍّ تتغيّر إشارته؟ (C420 أ): xf refV | refH | rot180، p للرسم ================= */
ITEM.c9Which = cpItem({ H: 250, tLine: 'gen.c9.together.which', hint: 'gen.c9.hint.which', rLine: it => 'gen.c9.reveal.which.' + it.want, praise: 'praiseThink',
  make: s => ({ want: { refV: 'x', refH: 'y', rot180: 'both' }[s.xf], tag: 'c9-which-' + s.xf }),
  draw(svg, item, tries) { const Pl = c4Plane(svg, { n: 5, ny: 5, top: 38 }); c9Mark(svg, Pl, item.xf); c9Card(svg, c9Name(item.xf));
    c4Dot(svg, Pl, ...item.p, { pair: tries >= 3, col: C9.org }); if (tries >= 3) c4Dot(helpG(svg), Pl, ...C9_XF[item.xf](item.p), { pair: true, col: C9.img }); return { Pl }; },
  pick: item => choosePick([['x', labelText('c9C.x'), '<i></i>', 'gen.c9.c.x'], ['y', labelText('c9C.y'), '<i></i>', 'gen.c9.c.y'], ['both', labelText('c9C.both'), '<i></i>', 'gen.c9.c.both']], item.want),
  errOf: (it, k) => k === 'both' ? 'c9Both' : it.want === 'both' ? 'c9Half' : 'c9Axis' });

/* ================= ④ أيّ تحويل؟ (C420): pts الأصل (شكل غير متماثل)، xf؛ الخيارات الأربعة ================= */
ITEM.c9NameIt = cpItem({ H: 262, tLine: 'gen.c9.together.name', hint: 'gen.c9.hint.name', rLine: it => 'gen.c9.n.' + it.xf, praise: 'praiseLook',
  make: s => { const img = s.pts.map(p => C9_XF[s.xf](p)); return { img, want: s.xf, ext: c4Ext(s.pts.concat(img), 5), tag: 'c9-name' }; },
  draw(svg, item, tries) { const Pl = c4Plane(svg, { ...item.ext, top: 12 }); xfPoly(svg, Pl, item.pts, { col: C9.org, fill: 'rgba(47,127,193,.12)' }); xfPoly(svg, Pl, item.img, { col: C9.img, fill: 'rgba(217,130,43,.14)', img: true });
    if (tries >= 3) { const h = helpG(svg), A = Pl.P(...item.pts[0]), B = Pl.P(...item.img[0]); geoLine(h, A[0], A[1], B[0], B[1], { color: THINK_INK, w: 2.4, dash: '5 4' }); el('circle', { cx: A[0], cy: A[1], r: 9, fill: 'none', stroke: THINK_INK, 'stroke-width': 2.6 }, h); el('circle', { cx: B[0], cy: B[1], r: 9, fill: 'none', stroke: THINK_INK, 'stroke-width': 2.6 }, h); }
    return { Pl }; },
  show: async (item, ctx) => { if (ctx && ctx.Pl) c9Mark(helpG(ctx.svg), ctx.Pl, item.xf); },
  pick: item => choosePick(['refV', 'refH', 'rot90', 'rot180'].map(k => [k, labelText('c9S.' + k), '<i></i>', 'gen.c9.n.' + k]), item.want, { cls: 'four' }),
  errOf: (it, k) => /^ref/.test(k) && /^ref/.test(it.want) ? 'c9NameAxis' : /^rot/.test(k) && /^rot/.test(it.want) ? 'c9Amount' : 'c9NameKind' });

/* ================= ⑤ الدوران على الورق بالمنقلة والفرجار (C422): th الزاوية، cw الاتجاه، r البعد، a0 اتجاه م أ؛ ask ang | len | dir ================= */
function c9RotFig(g, o) { const M = o.M || [150, 160], u = o.u || 18, a0 = o.a0 ?? 10, a1 = a0 + (o.cw ? -o.th : o.th), A = angP(M, a0, o.r * u), B = angP(M, a1, o.r * u);
  for (const [P, col] of [[A, C9.org], [B, C9.img]]) geoLine(g, M[0], M[1], P[0], P[1], { color: col, w: 2.6, dash: '6 4' });
  pfDot(g, M); pfLab(g, M[0] - 12, M[1] + 18, 'م', { fs: 15 });
  for (const [P, col, t, a] of [[A, C9.org, 'أ', a0], [B, C9.img, 'أ’', a1]]) { el('circle', { cx: P[0], cy: P[1], r: 6, fill: col, stroke: '#fff', 'stroke-width': 2 }, g); const L = angP(M, a, o.r * u + 18); pfLab(g, L[0], L[1] + 5, t, { fs: 15, col }); }
  return { M, A, B, a0, a1, u }; }
/* منقلة نصف دائرية مركزها م وصفرها على م أ، بعلامات كل عشر وأعداد كل ثلاثين */
function c9Prot(g, M, a0, cw, R = 64) { const s = cw ? -1 : 1, P = el('g', { 'pointer-events': 'none' }, g);
  el('path', { d: `M${angP(M, a0, R)} A${R} ${R} 0 0 ${cw ? 1 : 0} ${angP(M, a0 + s * 180, R)} Z`, fill: 'rgba(122,79,176,.08)', stroke: C9.arc, 'stroke-width': 2 }, P);
  for (let d = 0; d <= 180; d += 10) { const a = a0 + s * d, p1 = angP(M, a, R), p2 = angP(M, a, R - (d % 30 ? 6 : 11)); geoLine(P, p1[0], p1[1], p2[0], p2[1], { color: C9.arc, w: 1.6 });
    if (d % 30 === 0 && d && d < 180) { const t = angP(M, a, R - 20); preLab(P, t[0], t[1] + 4, MS(String(d)), { fs: 9.5, col: C9.arc }); } }
  return P; }
ITEM.c9Rot = cpItem({ H: 250, tLine: 'gen.c9.together.rot', hint: 'gen.c9.hint.rot', rLine: it => it.ask === 'dir' ? 'gen.c9.d.' + it.want : 'gen.c9.reveal.rot.' + it.ask, praise: 'praiseThink', together: item => S('gen.c9.together.rot.' + item.ask),
  rSay: it => it.ask === 'ang' ? sayDeg(it.want) : it.ask === 'len' ? S(numw(it.want), { append: true }) : null, num: true,
  make: s => { const ask = s.ask || 'ang', th = s.th, r = s.r || 5;
    if (ask === 'dir') return { ask, r, want: s.cw ? 'cw' : 'ccw', tag: 'c9-rot-dir' };
    if (ask === 'len') return { ask, r, want: r, nums: [r, r + 2, 2 * r].filter((v, i, X) => X.indexOf(v) === i), tag: 'c9-rot-len' };
    return { ask, r, want: th, nums: [th, 180 - th, th + (th > 90 ? -20 : 20), 2 * th].filter((v, i, X) => X.indexOf(v) === i && v > 0 && v <= 360).slice(0, 3), tag: 'c9-rot-ang' }; },   /* ثلاثة خياراتٍ دائماً (90: 180 − 90 = 90) */
  draw(svg, item, tries) { const g = el('g', {}, svg), F = c9RotFig(g, { th: item.th, cw: item.cw, r: item.r, a0: item.a0 ?? 10 }); el('rect', { x: 18, y: 14, width: 324, height: 226, rx: 12, fill: 'none', stroke: css('--line'), 'stroke-width': 1.5 }, g);
    if (item.ask === 'ang') { if (tries >= 3) c9Prot(helpG(svg), F.M, F.a0, item.cw); else arArc(g, F.M, Math.min(F.a0, F.a1), Math.max(F.a0, F.a1), { r: 34, col: C9.arc, lab: '؟', dl: 18, fs: 15, fill: true }); }
    else { arArc(g, F.M, Math.min(F.a0, F.a1), Math.max(F.a0, F.a1), { r: 34, col: C9.arc, deg: item.th, dl: 18, fs: 14, fill: true }); }
    if (item.ask === 'len') { const m = [(F.M[0] + F.A[0]) / 2, (F.M[1] + F.A[1]) / 2]; preLab(g, m[0], m[1] + 20, MS(String(item.r)), { fs: 16, col: C9.org }); const n = [(F.M[0] + F.B[0]) / 2, (F.M[1] + F.B[1]) / 2]; preLab(g, n[0] - 14, n[1], '؟', { fs: 18, col: C9.q });
      if (tries >= 3) { const h = helpG(svg); el('path', { d: angArc(F.M, item.r * F.u, Math.min(F.a0, F.a1) - 6, Math.max(F.a0, F.a1) + 6), fill: 'none', stroke: THINK_INK, 'stroke-width': 2.6 }, h); } }
    if (item.ask === 'dir' && tries >= 3) { const h = helpG(svg); el('path', { d: angArc(F.M, item.r * F.u + 10, Math.min(F.a0, F.a1), Math.max(F.a0, F.a1)), fill: 'none', stroke: THINK_INK, 'stroke-width': 2.6 }, h); const E = angP(F.M, F.a1, item.r * F.u + 10); geoArrow(h, E[0], E[1], -(F.a1 + (item.cw ? -90 : 90)), THINK_INK, 7); }
    return { F }; },
  h2: async (item, ctx) => { ciRule(helpG(ctx.svg), 250, 36, labelText('c9Rule.rot'), C9.hl, 12); await sleep(FAST ? 10 : 250); },
  pick: (item, ctx) => { if (item.ask === 'dir') return choosePick([['ccw', labelText('c9D.ccw'), '<i></i>', 'gen.c9.d.ccw'], ['cw', labelText('c9D.cw'), '<i></i>', 'gen.c9.d.cw']], item.want);
    const np = numberPick(shuffle(item.nums), item.want, item.ask === 'ang' ? { west: true, word: degw } : { west: true }); ctx.np = np; return np.p; },
  errOf: (it, k) => it.ask === 'dir' ? 'c9DirWord' : it.ask === 'len' ? 'c9LenOff' : k === 180 - it.want ? 'c9AngSup' : 'c9AngOff' });

/* ================= ⑥ التركيب (C312، C338، D89): p، seq خطوتان؛ ask img (الصورة) | one (أيّ تحويل واحد يساويهما) | order (هل يتغيّر الناتج إن بدّلنا الترتيب؟) ================= */
const c9StepTxt = s => Array.isArray(s) ? labelText('c9Tr').replace('X', MS(String(s[1]))) : labelText('c9S.' + s);
ITEM.c9Comp = cpItem({ H: 262, tLine: 'gen.c9.together.comp', hint: 'gen.c9.hint.comp', rLine: it => it.ask === 'one' ? 'gen.c9.n.' + it.want : it.ask === 'order' ? 'gen.c9.reveal.order.' + it.want : 'gen.c9.reveal.pick', praise: 'praiseThink',
  make: s => { const ask = s.ask || 'img', mid = c9Ap(s.seq[0], s.p), img = c9Run(s.seq, s.p), back = c9Run([s.seq[1], s.seq[0]], s.p);
    if (ask === 'one') return { ask, mid, img, want: Object.keys(C9_XF).find(k => { const q = C9_XF[k](s.p); return q[0] === img[0] && q[1] === img[1]; }), tag: 'c9-comp-one' };
    if (ask === 'order') return { ask, mid, img, back, want: img[0] === back[0] && img[1] === back[1] ? 'no' : 'yes', tag: 'c9-comp-order' };
    const cands = [img, mid, c9Ap(s.seq[1], s.p), back, [img[0], -img[1]], [-img[0], img[1]]].filter((q, i, X) => X.findIndex(r => r[0] === q[0] && r[1] === q[1]) === i && !(q[0] === s.p[0] && q[1] === s.p[1])).slice(0, 3);
    return { ask, mid, img, want: preKey(img), cands, tag: 'c9-comp-img' }; },
  draw(svg, item, tries) { const pts = [item.p, item.mid, item.img].concat(item.back ? [item.back] : []), Pl = c4Plane(svg, { ...c4Ext(pts, 5), top: 40 });
    c9Card(svg, labelText('c9Seq').replace('A', c9StepTxt(item.seq[0])).replace('B', c9StepTxt(item.seq[1])), { w: 330 });
    c4Dot(svg, Pl, ...item.p, { pair: true, col: C9.org });
    if (tries >= 3) { const h = helpG(svg); c4Dot(h, Pl, ...item.mid, { pair: true, col: THINK_INK }); const A = Pl.P(...item.p), B = Pl.P(...item.mid); geoLine(h, A[0], A[1], B[0], B[1], { color: THINK_INK, w: 2, dash: '5 4' }); }
    return { Pl }; },
  sayQ: async it => { for (const [i, s] of it.seq.entries()) { await S(i ? 'gen.c9.then' : 'gen.c9.first', { append: true, noGap: true }); await S(Array.isArray(s) ? 'gen.c9.tr.' + s[1] : 'gen.c9.n.' + s, { append: true, noGap: true }); } await S('gen.c9.q.compEnd.' + it.ask, { append: true }); },
  show: async (item, ctx) => { if (ctx && ctx.Pl) { const h = helpG(ctx.svg); c4Dot(h, ctx.Pl, ...item.mid, { col: '#8a9aa8' }); c4Dot(h, ctx.Pl, ...item.img, { col: C9.ok, pair: item.ask === 'img' }); if (item.back) c4Dot(h, ctx.Pl, ...item.back, { col: C9.img, pair: true }); } },
  pick: item => item.ask === 'one' ? choosePick(['rot90', 'rot180', 'refV'].map(k => [k, labelText('c9S.' + k), '<i></i>', 'gen.c9.n.' + k]), item.want)
    : item.ask === 'order' ? yesNo(item.want)
    : choosePick(shuffle(item.cands.map(p => [preKey(p), coPair(preNum(p[0]), preNum(p[1])), '<i></i>', 'gen.c4.pt.' + preKey(p)])), item.want),
  errOf: (it, k) => it.ask === 'one' ? 'c9CompOne' : it.ask === 'order' ? (k === 'yes' ? 'c9OrderYes' : 'c9OrderNo') : k === preKey(it.mid) ? 'c9CompHalf' : 'c9Off' });

/* ================= صور التعليل ================= */
function c9Pic(g, P) {
  if (P.rot) { const F = c9RotFig(g, { th: P.rot[0], cw: !!P.rot[1], r: 5, a0: 10, M: [150, 150] }); arArc(g, F.M, Math.min(F.a0, F.a1), Math.max(F.a0, F.a1), { r: 34, col: C9.arc, deg: P.rot[0], dl: 18, fs: 14, fill: true }); return; }
  const p = P.p || [3, 1], seq = P.seq || [], ps = [p, ...seq.map((s, i) => c9Run(seq.slice(0, i + 1), p))];
  if (P.shape) { const sq = [p, [p[0] + 1, p[1]], [p[0] + 1, p[1] + 1], [p[0], p[1] + 1]], im = sq.map(q => c9Run(seq, q)), Pl = c4Plane(g, { ...c4Ext(sq.concat(im), 4), top: 12, H: 200 }); if (P.xf) c9Mark(g, Pl, P.xf);
    xfPoly(g, Pl, sq, { col: C9.org, fill: 'rgba(47,127,193,.14)', names: false }); xfPoly(g, Pl, im, { col: C9.img, fill: 'rgba(217,130,43,.14)', names: false }); if (P.turn) c9TurnArc(g, Pl, p, im[0]); return; }
  const Pl = c4Plane(g, { ...c4Ext(ps, 4), top: 12, H: 200 });
  if (P.xf) c9Mark(g, Pl, P.xf);
  ps.forEach((q, i) => c4Dot(g, Pl, ...q, { pair: true, col: i ? (i === ps.length - 1 ? C9.img : '#8a9aa8') : C9.org }));
  if (P.turn) c9TurnArc(g, Pl, p, ps[ps.length - 1]); }

/* ================= المشاهد ================= */
/* د1: فوضى: «المرآة الرأسية تغيّر الإحداثي الرأسي!»؛ والانعكاس على المحورين */
SCENES.c9MirrorHook = async c => { const L = c.lines, svg = m3Stage(262), Pl = c4Plane(svg, { n: 5, ny: 4, top: 30 }); c9Mark(svg, Pl, 'refV'); c4Dot(svg, Pl, 3, 2, { pair: true, col: C9.org }); await c9Say(L, 0);
  const w = c4Dot(svg, Pl, 3, -2, { pair: true, col: C9.q }); SFX.tick(); await c9Say(L, 1); w.remove(); for (const l of L.slice(2)) await S(l); };
SCENES.c9RefShow = async c => { const L = c.lines, svg = m3Stage(262), Pl = c4Plane(svg, { n: 5, ny: 4, top: 30 }); let g = null;
  for (const [i, [xf, q]] of [['refV', [-3, 2]], ['refH', [3, -2]]].entries()) { if (g) g.remove(); g = el('g', { 'pointer-events': 'none' }, svg); c9Mark(g, Pl, xf); c4Dot(g, Pl, 3, 2, { pair: true, col: C9.org });
    const A = Pl.P(3, 2), B = Pl.P(...q), K = xf === 'refV' ? Pl.P(0, 2) : Pl.P(3, 0); geoLine(g, A[0], A[1], B[0], B[1], { color: C9.arc, w: 2, dash: '5 4' }); preTicks(g, A, K, 1, C9.ok); preTicks(g, K, B, 1, C9.ok); await c9Say(L, 2 * i);
    c4Dot(g, Pl, ...q, { pair: true, col: C9.img }); SFX.tick(); await c9Say(L, 2 * i + 1); }
  g.remove(); g = el('g', { 'pointer-events': 'none' }, svg); c9RuleCard(g, 180, 60, 'refV'); c9RuleCard(g, 180, 190, 'refH'); for (const l of L.slice(4)) await S(l); };
/* د2: فوضى: «ربع الدورة يغيّر الإحداثيين بالإشارة نفسها!»؛ والدوران حول الأصل بالورق الشفّاف */
SCENES.c9RotHook = async c => { const L = c.lines, svg = m3Stage(262), Pl = c4Plane(svg, { n: 4, ny: 4, top: 30 }); c9Mark(svg, Pl, 'rot90'); c4Dot(svg, Pl, 3, 1, { pair: true, col: C9.org }); await c9Say(L, 0);
  const w = c4Dot(svg, Pl, -3, -1, { pair: true, col: C9.q }); SFX.tick(); await c9Say(L, 1); w.remove(); for (const l of L.slice(2)) await S(l); };
SCENES.c9RotShow = async c => { const L = c.lines, svg = m3Stage(262), Pl = c4Plane(svg, { n: 4, ny: 4, top: 30 }), O = Pl.P(0, 0); c9Mark(svg, Pl, 'rot90'); c4Dot(svg, Pl, 3, 1, { pair: true, col: C9.org });
  const arm = el('g', { 'pointer-events': 'none' }, svg), A = Pl.P(3, 1); el('line', { x1: O[0], y1: O[1], x2: A[0], y2: A[1], stroke: C9.arc, 'stroke-width': 3, 'stroke-dasharray': '7 4' }, arm);
  const turn = async to => { for (let k = 1; k <= 12; k++) { arm.setAttribute('transform', `rotate(${-(to - 90) - 90 * k / 12} ${O[0]} ${O[1]})`); await sleep(FAST ? 1 : 45); } };
  for (const [i, q] of [[-1, 3], [-3, -1], [1, -3]].entries()) { await turn(90 * (i + 1)); c4Dot(svg, Pl, ...q, { pair: true, col: C9.img }); SFX.tick(); await c9Say(L, i); }
  const g = el('g', { 'pointer-events': 'none' }, svg); c9RuleCard(g, 250, 212, 'rot90', { w: 200 }); for (const l of L.slice(3)) await S(l); };
/* د3: الدوران بالمنقلة والفرجار خطوةً خطوة، والانعكاسان على المحورين */
SCENES.c9ProtHook = async c => { const L = c.lines, svg = m3Stage(250), g = el('g', { 'pointer-events': 'none' }, svg), H = [120, 200], D = angP(H, 0, 150), D2 = angP(H, 40, 150);
  geoLine(g, H[0], H[1], D[0], D[1], { color: '#8a6a43', w: 8 }); pfDot(g, H); await c9Say(L, 0);
  geoLine(g, H[0], H[1], D2[0], D2[1], { color: '#b08a57', w: 8 }); arArc(g, H, 0, 40, { r: 44, col: C9.arc, deg: 40, dl: 20, fs: 14, fill: true }); SFX.tick(); await c9Say(L, 1); for (const l of L.slice(2)) await S(l); };
SCENES.c9ProtShow = async c => { const L = c.lines, svg = m3Stage(250), g = el('g', { 'pointer-events': 'none' }, svg), M = [150, 170], u = 20, A = angP(M, 10, 5 * u), A2 = angP(M, 60, 5 * u);
  pfDot(g, M); pfLab(g, M[0] - 12, M[1] + 18, 'م', { fs: 15 }); el('circle', { cx: A[0], cy: A[1], r: 6, fill: C9.org, stroke: '#fff', 'stroke-width': 2 }, g); pfLab(g, A[0] + 10, A[1] + 18, 'أ', { fs: 15, col: C9.org });
  const R1 = angP(M, 10, 170); geoLine(g, M[0], M[1], R1[0], R1[1], { color: C9.org, w: 2.6 }); SFX.tick(); await c9Say(L, 0);
  const pr = c9Prot(g, M, 10, false, 70); await c9Say(L, 1); const R2 = angP(M, 60, 170); geoLine(g, M[0], M[1], R2[0], R2[1], { color: C9.img, w: 2.6 }); SFX.tick(); await c9Say(L, 2); pr.remove();
  arArc(g, M, 10, 60, { r: 34, col: C9.arc, deg: 50, dl: 18, fs: 14, fill: true }); el('path', { d: angArc(M, 5 * u, 2, 70), fill: 'none', stroke: C9.arc, 'stroke-width': 2.6 }, g);
  el('circle', { cx: A2[0], cy: A2[1], r: 6, fill: C9.img, stroke: '#fff', 'stroke-width': 2 }, g); pfLab(g, A2[0] - 14, A2[1] - 6, 'أ’', { fs: 15, col: C9.img }); preTicks(g, M, A, 1, C9.ok); preTicks(g, M, A2, 1, C9.ok); SFX.tick(); await c9Say(L, 3);
  for (const l of L.slice(4)) await S(l); };
SCENES.c9TwoMirrorShow = async c => { const L = c.lines, svg = m3Stage(262), Pl = c4Plane(svg, { n: 4, ny: 4, top: 30 }), p = [3, 1];
  c9Mark(svg, Pl, 'refV'); c4Dot(svg, Pl, ...p, { pair: true, col: C9.org }); c4Dot(svg, Pl, -3, 1, { pair: true, col: '#8a9aa8' }); SFX.tick(); await c9Say(L, 0);
  c9Mark(svg, Pl, 'refH'); c4Dot(svg, Pl, -3, -1, { pair: true, col: C9.img }); SFX.tick(); await c9Say(L, 1);
  c9TurnArc(svg, Pl, p, [-3, -1]); SFX.tick(); await c9Say(L, 2); for (const l of L.slice(3)) await S(l); };
/* د4: مدينة المرايا: مبانٍ في الأرباع، ومبنى ينعكس ومبنى يدور */
const C9_CITY = { a: [[3, 1], [5, 1], [5, 3], [4, 4], [3, 3]], b: [[4, -1], [5, -1], [5, -3], [4, -3]] };
SCENES.c9CityShow = async c => { const L = c.lines, svg = m3Stage(262), Pl = c4Plane(svg, { n: 5, ny: 5, top: 30 });
  xfPoly(svg, Pl, C9_CITY.a, { col: C9.org, fill: 'rgba(47,127,193,.14)', names: false }); xfPoly(svg, Pl, C9_CITY.b, { col: '#4f9a6a', fill: 'rgba(79,154,106,.14)', names: false }); await c9Say(L, 0);
  c9Mark(svg, Pl, 'refV'); xfPoly(svg, Pl, C9_CITY.a.map(C9_XF.refV), { col: C9.img, fill: 'rgba(217,130,43,.14)', names: false }); SFX.tick(); await c9Say(L, 1);
  const r = C9_CITY.b.map(C9_XF.rot90); c9TurnArc(svg, Pl, C9_CITY.b[0], r[0]); xfPoly(svg, Pl, r, { col: C9.img, fill: 'rgba(217,130,43,.14)', names: false }); SFX.tick(); await c9Say(L, 2);
  for (const l of L.slice(3)) await S(l); };
WRAP_ART.xf9Art = svg => { const Pl = c4Plane(svg, { n: 4, ny: 4, top: 40, H: 240, nums: false }); const T = [[1, 1], [3, 1], [1, 3]]; xfPoly(svg, Pl, T, { col: C9.org, fill: 'rgba(47,127,193,.16)', names: false });
  for (const xf of ['refV', 'rot180', 'refH']) xfPoly(svg, Pl, T.map(C9_XF[xf]), { col: C9.img, fill: 'rgba(217,130,43,.14)', names: false }); };
