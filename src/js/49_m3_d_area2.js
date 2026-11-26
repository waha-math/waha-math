/* =====================================================================
   S3-U4 «المساحات (2)» (المرحلة 3، نوفمبر 2026)
   د1 مساحة شبه المنحرف (C305) · د2 المعيّن والطائرة والمربع بالقطرين (C334) · د3 الشكل المركّب (C323) · د4 بين سم² وم² (C308) · د5 مشروع «بلّط القاعة»
   على ورق المربعات كما في S3-U3 (htGrid): نقطة الشبكة [x، y] وy إلى الأعلى، وكل مربع سنتيمتر (أو متر في المشروع)
   ===================================================================== */
const A2 = { ...HT, top: '#3d7cc0', bot: '#2f9d6b', legs: '#8e6bbf', p1: '#f2d38a', p2: '#bfe0b5', p3: '#e6c6e8', ghost: '#9fb4c0' };
const a2U2 = u => labelText(u === 'm' ? 'arM2' : 'arCm2');
/* العدد المسموع: الأنصاف كما في S3-U3، وما فوق المئة جملته مولّدة (gen.big.N) */
const bigw = n => n > 100 && Number.isInteger(n) ? 'gen.big.' + n : halfw(n);
const a2NumItem = { ...numItem, async askNum(item) { return numberPick(shuffle(item.nums), item.want, { west: true, word: bigw }); } };
/* خياران من أخطاء البند بترتيبها، ثم جيران الجواب إن لزم (والمولّد tools/m3gen/u4.py يكرّر هذا الترتيب ليولّد جمل الأعداد) */
function a2Mix(want, cands) { const ok = v => v > 0 && v !== want && Number.isInteger(v * 2), pick = [];
  for (const v of cands) if (ok(v) && !pick.includes(v) && pick.length < 2) pick.push(v);
  for (const d of [2, 4, 1, 10, 8]) for (const v of [want + d, want - d]) if (pick.length < 2 && ok(v) && !pick.includes(v)) pick.push(v);
  return shuffle([want, ...pick]); }
/* الشبكة الطويلة (أكثر من سبعة صفوف) تأخذ المسرح كلّه */
const a2Grid = (svg, cols, rows) => { if (rows > 7) return htGrid(svg, cols, rows, { c: Math.min(26, 280 / cols, 162 / rows), top: 38 }); const c = Math.min(26, 280 / cols, 168 / rows);   /* داخل الورقة بهامشٍ لتسميات الأطراف، والطويلة تحت سطر «المساحة الآن» (المراجع B لبوابة S3-U4/U5، 4 و5) */ return htGrid(svg, cols, rows, { H: 168, top: 24 + Math.max(0, (168 - rows * c) / 2 - 6) }); };   /* القصيرة تتوسّط المسرح؛ والصيغة تحتها (a2Formula) */
/* الشكل على الشبكة: نقاطه المحلية، وrot 0 | 180 (مقلوب) | 90 (القاعدتان قائمتان)؛ يُوسَّط ويُعاد M من المحلي إلى الشاشة */
function a2Fig(svg, pts, o = {}) { const R = o.rot || 0, Y = Math.max(...pts.map(p => p[1])), tf = p => R === 90 ? [p[1], p[0]] : R === 180 ? [p[0], Y - p[1]] : p;
  const Q = pts.map(tf), xs = Q.map(p => p[0]), ys = Q.map(p => p[1]), x0 = Math.min(...xs), y0 = Math.min(...ys), w = Math.max(...xs) - x0, hh = Math.max(...ys) - y0;
  const cols = Math.max(o.cols || 12, Math.ceil(w) + 2), rows = Math.max(o.rows || 7, Math.ceil(hh) + 2), G = o.G || a2Grid(svg, cols, rows), dx = Math.floor((G.cols - w) / 2) - x0, dy = Math.floor((G.rows - hh) / 2) - y0;
  return { G, M: p => { const q = tf(p); return G.P([q[0] + dx, q[1] + dy]); } }; }
/* علامة القائمة عند F: U نقطة على الارتفاع، وV نقطة على القاعدة في جهة الشكل */
function a2Right(parent, F, U, V, s = 9, col = A2.h) { const u = [U[0] - F[0], U[1] - F[1]], v = [V[0] - F[0], V[1] - F[1]], nu = Math.hypot(...u) || 1, nv = Math.hypot(...v) || 1, p1 = [F[0] + u[0] / nu * s, F[1] + u[1] / nu * s], p2 = [F[0] + v[0] / nv * s, F[1] + v[1] / nv * s];
  return el('path', { d: `M${p1[0]} ${p1[1]} L${p1[0] + p2[0] - F[0]} ${p1[1] + p2[1] - F[1]} L${p2[0]} ${p2[1]}`, fill: 'none', stroke: col, 'stroke-width': 2, 'pointer-events': 'none' }, parent); }
const a2Poly = (parent, Q, fill, o = {}) => el('polygon', { points: polyStr(Q), fill, stroke: o.stroke || A2.ink, 'stroke-width': o.w ?? 3, 'stroke-linejoin': 'round', 'fill-opacity': o.op ?? 1, 'pointer-events': 'none' }, parent);
const a2Formula = (parent, txt, col = A2.ok, y = 232) => { const t = el('text', { x: 180, y, 'text-anchor': 'middle', 'font-size': 18, 'font-weight': 800, fill: col, stroke: '#fff', 'stroke-width': 4, 'paint-order': 'stroke', direction: 'ltr', 'pointer-events': 'none' }, parent); t.textContent = txt; return t; };

/* التسمية داخل الورقة: إن خرجت عن الإطار انتقلت إلى داخل الضلع edgeX (s جهتها خارجه)، وإلا أُزيحت بقدر ما خرجت */
const a2Fit = (t, edgeX, s) => { const b = t && t.getBBox ? t.getBBox() : null; if (!b || !b.width || (b.x >= 23 && b.x + b.width <= 337)) return t;
  t.setAttribute('x', edgeX != null ? edgeX - s * (8 + b.width / 2) : +t.getAttribute('x') + (b.x < 23 ? 23 - b.x : 337 - b.x - b.width)); return t; };
/* ================= شبه المنحرف: القاعدة السفلى b من (0،0)، والعليا a على الارتفاع h تبدأ عند off (افتراضاً متساوي الساقين)؛ legs [اليسرى، اليمنى] أطوال الساقين إن كُتبت ================= */
function a2TrapPts(it) { const off = it.off ?? (it.b - it.a) / 2; return { off, pts: [[0, 0], [it.b, 0], [off + it.a, it.h], [off, it.h]] }; }
function a2Trap(svg, it, o = {}) { const { off, pts } = a2TrapPts(it), u = it.u || 'cm', F = a2Fig(svg, pts, { rot: it.rot, G: o.G }), M = F.M, Q = pts.map(M), g = el('g', { 'pointer-events': 'none' }, svg);
  a2Poly(g, Q, o.fill || A2.fill); const k90 = it.rot === 90 ? 1.9 : 1, L = (p, d, txt, col) => htLab(g, M([p[0] + d[0], p[1] + d[1] * k90]), txt, col);   /* القاعدتان قائمتان (rot 90): الطول أبعد عن الضلع، فلا يقطعه (المراجع A لبوابة S3-U4/U5، 17) */
  if (o.bases !== false) { L([it.b / 2, 0], [0, -.75], htCm(it.b, u), A2.ink); L([off + it.a / 2, it.h], [0, .75], htCm(it.a, u), A2.ink); }
  const vL = off === 0 ? 0 : off + it.a === it.b ? it.b : null;   /* القائم: ساقه العمودية هي الارتفاع */
  if (o.height !== false) { if (vL != null) { const s = vL ? 1 : -1; a2Fit(L([vL, it.h / 2], [.85 * s, 0], htCm(it.h, u), A2.h), M([vL, 0])[0], s); a2Right(g, M([vL, 0]), M([vL, 1]), M([vL - s, 0]), 9, A2.h); }
    else { const hx = off > 0 && off < it.b ? off : off + it.a, s = hx === off ? 1 : -1, T = M([hx, it.h]), Fo = M([hx, 0]); geoLine(g, T[0], T[1], Fo[0], Fo[1], { color: A2.h, w: 3, dash: '6 4' }); a2Right(g, Fo, T, M([hx + s, 0]), 9, A2.h); L([hx, it.h / 2], [.85 * s, 0], htCm(it.h, u), A2.h); } }
  if (it.legs && o.legs !== false) { if (vL !== 0) a2Fit(L([off / 2, it.h / 2], [-.9, 0], htCm(it.legs[0], u), A2.legs)); if (vL !== it.b) a2Fit(L([(it.b + off + it.a) / 2, it.h / 2], [.9, 0], htCm(it.legs[1], u), A2.legs)); }
  return { F, M, Q, off, g }; }
/* علامة التوازي (سهم صغير) في منتصف الضلع PQ */
function a2Chev(parent, P, Q, col) { const m = [(P[0] + Q[0]) / 2, (P[1] + Q[1]) / 2], L = Math.hypot(Q[0] - P[0], Q[1] - P[1]) || 1, d = [(Q[0] - P[0]) / L, (Q[1] - P[1]) / L], n = [-d[1], d[0]];
  el('path', { d: `M${m[0] - d[0] * 6 + n[0] * 6} ${m[1] - d[1] * 6 + n[1] * 6} L${m[0] + d[0] * 3} ${m[1] + d[1] * 3} L${m[0] - d[0] * 6 - n[0] * 6} ${m[1] - d[1] * 6 - n[1] * 6}`, fill: 'none', stroke: col, 'stroke-width': 3, 'stroke-linecap': 'round', 'pointer-events': 'none' }, parent); }

/* ================= ① مساحة شبه المنحرف أو محيطه (C305): a، b، h، off، rot، legs، ask area | perim ================= */
ITEM.trapArea = { ...a2NumItem,
  make(spec) { const { off } = a2TrapPts(spec), A = (spec.a + spec.b) * spec.h / 2, legs = spec.legs, P = legs ? spec.a + spec.b + legs[0] + legs[1] : 0, big = Math.max(spec.a, spec.b);
    /*T*/if (TESTHOOK && (A > 100 || !Number.isInteger(A * 2) || off < 0 || off + spec.a > spec.b || (spec.ask === 'perim' && !legs))) testBug('trapArea: أبعاد غير صالحة');/*/T*/
    const want = spec.ask === 'perim' ? P : A, errs = spec.ask === 'perim' ? [P - spec.a, A, spec.a + spec.b + 2 * spec.h] : [big * spec.h, (spec.a + spec.b) * spec.h, legs ? (spec.a + spec.b) * Math.max(...legs) / 2 : Math.min(spec.a, spec.b) * spec.h];
    return { ...spec, A, want, nums: a2Mix(want, errs), tag: 'trap-' + (spec.ask || 'area') + (spec.rot ? '-rot' : '') }; },
  async ask(item, mode, tries) { const svg = m3Stage(250), D = a2Trap(svg, item);
    if (tries >= 3) { hintCard(svg, 180, 220, item.ask === 'perim' ? `${item.a} + ${item.b} + ${item.legs[0]} + ${item.legs[1]} = ؟` : `(${item.a} + ${item.b}) × ${item.h} ÷ 2 = ؟`); await S(item.ask === 'perim' ? 'gen.a2.together.perim' : 'gen.a2.together.trap'); }
    else await S(item.q || 'gen.a2.q.trap.' + (item.ask || 'area'));
    const np = await this.askNum(item); return { ans: await np.p, ctx: { svg, D } }; },
  judge(item, k) { if (k === item.want) return { ok: true }; if (item.ask === 'perim') return { ok: false, err: k === item.A ? 'perimInside' : 'perimOff' };
    return { ok: false, err: k === Math.max(item.a, item.b) * item.h ? 'trapBig' : k === (item.a + item.b) * item.h ? 'trapNoHalf' : item.legs && k === (item.a + item.b) * Math.max(...item.legs) / 2 ? 'trapSlant' : 'a2AreaOff' }; },
  async hint2(item, r) { if (r && r.ctx && r.ctx.D) { const m = helpG(r.ctx.svg), Q = r.ctx.D.Q;   /* المستوى الثاني (D240؛ المراجع A لبوابة S3-U4/U5، 8): المحيط أضلاعه الأربعة مُبرزة، والمساحة قاعدتاه ملوّنتان */
      if (item.ask === 'perim') el('polygon', { points: polyStr(Q), fill: 'none', stroke: THINK_INK, 'stroke-width': 5, opacity: .75 }, m);
      else { geoLine(m, Q[0][0], Q[0][1], Q[1][0], Q[1][1], { color: A2.bot, w: 6 }); geoLine(m, Q[3][0], Q[3][1], Q[2][0], Q[2][1], { color: A2.top, w: 6 }); } }
    await S(item.ask === 'perim' ? 'gen.ht.hint.perim' : 'gen.a2.hint.trap'); }, async together() {},
  async reveal(item) { await S('gen.ht.reveal.num', { noGap: true }); await S(bigw(item.want), { append: true }); },
  praise: () => 'praiseThink', twin(item) { return item.twin || null; },
};

/* ================= ② أين القاعدتان؟ (C305، الأسماء): أضلاع بحروفها، والخيارات أزواج: القاعدتان، الساقان، ضلعان متجاوران ================= */
ITEM.trapParts = {
  make(spec) { return { ...spec, keys: shuffle(['a', 'b', 'j', 'd']), want: 'bases', tag: 'trap-parts' + (spec.rot ? '-rot' : '') }; },
  async ask(item, mode, tries) { const svg = m3Stage(250), D = a2Trap(svg, item, { bases: false, height: false, legs: false }), it = item, off = D.off;
    const mids = [[[it.b / 2, 0], [0, -.75]], [[(it.b + off + it.a) / 2, it.h / 2], [.9, 0]], [[off + it.a / 2, it.h], [0, .75]], [[off / 2, it.h / 2], [-.9, 0]]];
    mids.forEach(([p, d], i) => htLab(svg, D.M([p[0] + d[0], p[1] + d[1]]), LTR[item.keys[i]], A2.ink, 19));
    if (tries >= 3) { const m = helpG(svg); a2Chev(m, D.Q[0], D.Q[1], THINK_INK); a2Chev(m, D.Q[3], D.Q[2], THINK_INK); await S('gen.a2.together.parts'); } else await S(item.q || 'gen.a2.q.parts');
    const pair = (i, j) => { const ks = [item.keys[i], item.keys[j]].sort((x, y) => 'abjd'.indexOf(x) - 'abjd'.indexOf(y)); return [`${LTR[ks[0]]} ${labelText('a2And')} ${LTR[ks[1]]}`, 'gen.a2.pair.' + ks.join('')]; };
    const opts = [['bases', ...pair(0, 2)], ['legs', ...pair(1, 3)], ['adj', ...pair(0, 1)]].map(([k, t, l]) => [k, t, '<i></i>', l]);
    const k = await choosePick(shuffle(opts), 'bases'); return { ans: k, ctx: { svg, D } }; },
  judge(item, k) { return k === 'bases' ? { ok: true } : { ok: false, err: k === 'legs' ? 'trapLegsBases' : 'trapAdjBases' }; },
  onOk() { SFX.good(); }, onWrong() { SFX.soft(); },
  async hint2(item, r) { if (r && r.ctx && r.ctx.D) { const m = helpG(r.ctx.svg), Q = r.ctx.D.Q;   /* الضلعان المتوازيان ممدودان: لا يلتقيان */
      for (const [P, R] of [[Q[0], Q[1]], [Q[3], Q[2]]]) { const L = Math.hypot(R[0] - P[0], R[1] - P[1]) || 1, d = [(R[0] - P[0]) / L, (R[1] - P[1]) / L]; geoLine(m, P[0] - d[0] * 34, P[1] - d[1] * 34, R[0] + d[0] * 34, R[1] + d[1] * 34, { color: THINK_INK, w: 2.4, dash: '7 5' }); } }
    await S('gen.a2.hint.parts'); }, async together() {},
  async reveal(item, r) { if (r && r.ctx && r.ctx.D) { const Q = r.ctx.D.Q; for (const [P, R] of [[Q[0], Q[1]], [Q[3], Q[2]]]) geoLine(r.ctx.svg, P[0], P[1], R[0], R[1], { color: A2.ok, w: 6 }); } await S('gen.a2.reveal.parts'); },
  praise: () => 'praiseLook', twin(item) { return item.twin || null; },
};

/* ================= المعيّن والطائرة والمربع بقطريهما على الشبكة: القطر الأفقي p، والعمودي r يقطعه عند cut من طرفه الأيسر (cut = p/2 في المعيّن والمربع) ================= */
function a2DiagPts(it) { const cut = it.cut ?? it.p / 2; return { cut, pts: [[0, it.r / 2], [cut, 0], [it.p, it.r / 2], [cut, it.r]] }; }
function a2Diag(svg, it, o = {}) { const { cut, pts } = a2DiagPts(it), u = it.u || 'cm', F = a2Fig(svg, pts, { rows: o.rows, cols: o.cols, G: o.G }), M = F.M, Q = pts.map(M), g = el('g', { 'pointer-events': 'none' }, svg);
  a2Poly(g, Q, o.fill || A2.fill); geoLine(g, Q[0][0], Q[0][1], Q[2][0], Q[2][1], { color: DQ.d1, w: 3 }); geoLine(g, Q[1][0], Q[1][1], Q[3][0], Q[3][1], { color: DQ.d2, w: 3 });
  const C = M([cut, it.r / 2]); if (o.right !== false) a2Right(g, C, Q[3], Q[2], 9, A2.ink);
  const L = (p, d, txt, col) => htLab(g, M([p[0] + d[0], p[1] + d[1]]), txt, col);
  if (o.lens !== false) { if (it.r < 4) { L([it.p / 2, 0], [0, -.75], htCm(it.p, u), DQ.d1); L([cut, it.r], [0, .7], htCm(it.r, u), DQ.d2); } else { L([(cut + it.p) / 2 + .4, it.r / 2], [0, .6], htCm(it.p, u), DQ.d1); L([cut, it.r / 4], [1, 0], htCm(it.r, u), DQ.d2); } }   /* الطائرة القصيرة: الطولان خارجها لا على أضلاعها (المراجع B، 14) */
  if (o.parts) { L([cut / 2, it.r / 2], [0, -.6], String(cut), DQ.d1); L([(cut + it.p) / 2, it.r / 2], [0, -.6], String(it.p - cut), DQ.d1); L([cut, it.r * .75], [-.7, 0], String(it.r / 2), DQ.d2); L([cut, it.r / 4], [-.7, 0], String(it.r / 2), DQ.d2); }
  return { F, M, Q, C, cut, g }; }

/* ================= ③ المساحة بالقطرين (C334): k rhom | kite | square، p، r، cut ================= */
ITEM.diagArea = { ...a2NumItem,
  make(spec) { const A = spec.p * spec.r / 2; /*T*/if (TESTHOOK && (A > 100 || !Number.isInteger(A * 2))) testBug('diagArea: أبعاد غير صالحة');/*/T*/
    return { ...spec, want: A, nums: a2Mix(A, [spec.p * spec.r, spec.p + spec.r, A / 2]), tag: 'diag-area-' + spec.k }; },
  async ask(item, mode, tries) { const svg = m3Stage(250), D = a2Diag(svg, item);
    if (tries >= 3) { hintCard(svg, 180, 220, `${item.p} × ${item.r} ÷ 2 = ؟`); await S('gen.a2.together.diag'); } else await S(item.q || 'gen.a2.q.diag.' + item.k);
    const np = await this.askNum(item); return { ans: await np.p, ctx: { svg, D } }; },
  judge(item, k) { if (k === item.want) return { ok: true }; return { ok: false, err: k === item.p * item.r ? 'dgNoHalf' : k === item.p + item.r ? 'dgSum' : k === item.want / 2 ? 'dgQuarter' : 'a2AreaOff' }; },
  async hint2(item, r) { if (r && r.ctx && r.ctx.D) { const Q = r.ctx.D.Q, xs = Q.map(q => q[0]), ys = Q.map(q => q[1]); el('rect', { x: Math.min(...xs), y: Math.min(...ys), width: Math.max(...xs) - Math.min(...xs), height: Math.max(...ys) - Math.min(...ys), fill: 'none', stroke: THINK_INK, 'stroke-width': 2.6, 'stroke-dasharray': '7 5' }, helpG(r.ctx.svg)); }   /* المستطيل الذي حوله */
    await S('gen.a2.hint.diag'); }, async together() {},
  async reveal(item) { await S('gen.ht.reveal.num', { noGap: true }); await S(bigw(item.want), { append: true }); },
  praise: () => 'praiseThink', twin(item) { return item.twin || null; },
};

/* ================= ④ «مفتّش المساحات» (C334): أربعة أشكال بقطريها؛ يلمس الطفل ما تصحّ عليه صيغة القطرين (القطران متعامدان) ثم «تمّ» ================= */
const fitK = k => String(k).split('@')[0], FIT_NAME = { rect: 'dqOnly.rectNS', para: 'dqOnly.paraNRh' };
ITEM.diagFit = {
  make(spec) { const ks = spec.ks || ['rhom', 'rect', 'kite', 'para']; return { ...spec, ks, want: ks.filter(k => DQ_PERP[fitK(k)] === 'y').sort().join(), tag: 'diag-fit' }; },
  async ask(item, mode, tries) { const svg = m3Stage(250), order = item.order || (item.order = shuffle(item.ks.map((_, i) => i))), on = new Set(), marks = el('g', { 'pointer-events': 'none' }, svg);
    const ring = c => { const r = el('rect', { x: c.x - 82, y: c.y - 50, width: 164, height: 104, rx: 16, fill: 'none', stroke: css('--compass'), 'stroke-width': 5 }, marks); return r; };
    const redraw = () => { marks.innerHTML = ''; cells.forEach(c => { if (on.has(c.ki)) ring(c); c.g.setAttribute('aria-pressed', on.has(c.ki)); }); };
    const cells = order.map((ki, pos) => { const x = pos % 2 ? 92 : 268, y = pos < 2 ? 64 : 178, k = item.ks[ki], kk = fitK(k), rot = +(String(k).split('@')[1] || 0), g = el('g', { role: 'button', tabindex: 0 }, svg), nm = labelText(FIT_NAME[kk] || 'ply.q.' + kk);
      const R = dqDraw(g, { k: kk, ...(rot ? { rot: ((DQ_K[kk] || {}).rot || 0) + rot } : {}) }, [x, y - 8, 128, 66], { right: tries >= 3, maxK: 8, ...(rot ? { level: false } : {}) }); htLab(g, [x, y + 40], nm, A2.ink, 13); g.setAttribute('aria-label', plain(nm)); hitPad(g, 96); g.style.cursor = 'pointer';   /* k@rot: الشكل مُداراً (وضع غير نمطي في الاختبار)؛ والمستطيل ومتوازي الأضلاع بقيدهما (D284 (4)) */
      /*T*/if (TESTHOOK) g.dataset.ok = DQ_PERP[kk] === 'y';/*/T*/
      g.onclick = () => { if (on.has(ki)) on.delete(ki); else on.add(ki); SFX.tick(); redraw(); }; return { g, ki, x, y, k, R }; });
    redraw(); await S(tries >= 3 ? 'gen.a2.together.fit' : item.q || 'gen.a2.q.fit');
    const set = keys => { on.clear(); cells.forEach(c => { if (keys.includes(c.k)) on.add(c.ki); }); redraw(); };
    AUTO({ kind: 'diagFit', ok: () => { set(item.want.split(',')); rulDoneBtn().click(); }, wrong: () => { set([...item.want.split(','), item.ks.find(k => DQ_PERP[fitK(k)] !== 'y')]); rulDoneBtn().click(); } });
    await rulDone(() => cells.forEach(c => { c.g.onclick = null; c.g.style.cursor = ''; }));
    return { ans: [...on].map(i => item.ks[i]).sort().join(), ctx: { svg, cells } }; },
  judge(item, k) { if (k === item.want) return { ok: true }; const a = k ? k.split(',') : []; return { ok: false, err: a.some(x => DQ_PERP[fitK(x)] !== 'y') ? 'dgFitNotPerp' : 'dgFitMiss' }; },
  onOk() { SFX.good(); }, onWrong() { SFX.soft(); },
  async hint2(item, r) { if (r && r.ctx && r.ctx.cells) { const m = helpG(r.ctx.svg); for (const c of r.ctx.cells) { const P = dqPaper(m, c.R.M, dirOf(c.R.M, c.R.Q[2])); P.setAttribute('transform', `scale(.62)`); P.setAttribute('transform-origin', `${c.R.M[0]} ${c.R.M[1]}`); } }   /* ورقة الزاوية القائمة عند كل تقاطع */
    await S('gen.a2.hint.fit'); }, async together() {},
  async reveal(item, r) { if (r && r.ctx && r.ctx.cells) r.ctx.cells.filter(c => DQ_PERP[fitK(c.k)] === 'y').forEach(c => el('rect', { x: c.x - 82, y: c.y - 50, width: 164, height: 104, rx: 16, fill: 'none', stroke: A2.ok, 'stroke-width': 5, 'pointer-events': 'none' }, r.ctx.svg)); await S('gen.a2.reveal.fit'); },
  praise: () => 'praiseLook', twin(item) { return item.twin || null; },
};

/* ================= ⑤ «الطائرة الورقية» (C334، اللعبة): العود الأفقي p ثابت، ويُضبط العود القائم حتى تطابق المساحة المطلوبة A ================= */
ITEM.kiteTune = {
  make(spec) { const want = 2 * spec.A / spec.p; /*T*/if (TESTHOOK && (!Number.isInteger(want) || want < 2 || want > 8)) testBug('kiteTune: قطر غير صالح');/*/T*/ return { ...spec, want, tag: 'kite-tune' }; },
  async ask(item, mode, tries) { const svg = m3Stage(250), u = item.u || 'cm', cut = item.cut ?? Math.round(item.p * .4), G = a2Grid(svg, Math.max(12, item.p + 2), 10); let r = item.r0 ?? 2, sh = null;
    const goal = el('text', { x: 180, y: 226, 'text-anchor': 'middle', 'font-size': 16, 'font-weight': 800, fill: A2.ink, stroke: '#fff', 'stroke-width': 4, 'paint-order': 'stroke', direction: 'rtl' }, svg); goal.textContent = `${labelText('htGoal')} ${item.A} ${a2U2(u)}`;
    const draw = () => { if (sh) sh.remove(); sh = el('g', {}, svg); svg.insertBefore(sh, goal); a2Diag(sh, { p: item.p, r, cut, u }, { G }); if (tries >= 2) htAreaNow(sh, { fig: 'tri', b: item.p, u }, r, 31); };   /* المستوى الثاني: المساحة الآن (p × r ÷ 2) */
    draw(); if (tries >= 3) { r = item.want + (r < item.want ? -1 : 1); draw(); await S('gen.a2.together.kite'); } else await S(item.q || 'gen.a2.q.kite');
    const St = dqSteps(['htLower', 'htHigher'], d => { const n = Math.max(2, Math.min(8, r + d)); if (n === r) return false; r = n; draw(); return true; }, { vert: true });
    /*T*/window.__a2R = () => r;/*/T*/
    AUTO({ kind: 'kiteTune', ok: () => { r = item.want; draw(); rulDoneBtn().click(); }, wrong: () => { r = item.want === 8 ? 7 : item.want + 1; draw(); rulDoneBtn().click(); } });
    await rulDone(() => St.off()); return { ans: r, ctx: { svg, set: v => { r = v; draw(); } } }; },
  judge(item, k) { return k === item.want ? { ok: true } : { ok: false, err: k * 2 === item.want ? 'dgNoHalf' : 'dgTuneOff' }; },
  onOk() { SFX.good(); }, onWrong() { SFX.soft(); },
  async hint2(item, r) { if (r && r.ctx && r.ctx.svg) htAreaNow(r.ctx.svg, { fig: 'tri', b: item.p, u: item.u }, r.ans, 31); await S('gen.a2.hint.kite'); }, async together() {},
  async reveal(item, r) { if (r && r.ctx && r.ctx.set) r.ctx.set(item.want); await S('gen.a2.reveal.kite'); },
  praise: () => 'praiseThink', twin(item) { return item.twin || null; },
};

/* ================= الأشكال المركّبة (C323): fig وأبعاده، والأجزاء ومساحاتها، وقطع التقسيم أو الجزء الناقص (الإتمام) ================= */
/* labs: [نقطة، إزاحة، طول، لون]؛ hts: ارتفاعات متقطّعة [القمة، القدم، الطول، جهة الكتابة]؛ cut: خطّ التقسيم؛ ghost: الركن الناقص في الإتمام */
const A2_FIG = {
  house: s => ({ pts: [[0, 0], [s.w, 0], [s.w, s.hw], [s.w / 2, s.hw + s.hr], [0, s.hw]], cut: [[0, s.hw], [s.w, s.hw]], bad: [[0, 0], [s.w, s.hw]],
    parts: [{ poly: [[0, 0], [s.w, 0], [s.w, s.hw], [0, s.hw]], A: s.w * s.hw }, { poly: [[0, s.hw], [s.w, s.hw], [s.w / 2, s.hw + s.hr]], A: s.w * s.hr / 2, full: s.w * s.hr }],
    labs: [[[s.w / 2, 0], [0, -.75], s.w], [[s.w, s.hw / 2], [.9, 0], s.hw]], hts: [[[s.w / 2, s.hw + s.hr], [s.w / 2, s.hw], s.hr, 1]] }),
  notch: s => ({ pts: [[0, 0], [s.W, 0], [s.W, s.H - s.b], [s.W - s.a, s.H], [0, s.H]], ghost: [[s.W - s.a, s.H], [s.W, s.H], [s.W, s.H - s.b]], whole: s.W * s.H,
    parts: [{ poly: [[0, 0], [s.W, 0], [s.W, s.H], [0, s.H]], A: s.W * s.H }, { poly: [[s.W - s.a, s.H], [s.W, s.H], [s.W, s.H - s.b]], A: -s.a * s.b / 2, full: -s.a * s.b }],
    labs: [[[s.W / 2, 0], [0, -.75], s.W], [[0, s.H / 2], [-.9, 0], s.H], [[s.W - s.a / 2, s.H], [0, .75], s.a, A2.ghost], [[s.W, s.H - s.b / 2], [.9, 0], s.b, A2.ghost]], hts: [] }),
  paraRect: s => ({ pts: [[0, 0], [s.b, 0], [s.b, s.k], [s.b + s.off, s.k + s.h], [s.off, s.k + s.h], [0, s.k]], cut: [[0, s.k], [s.b, s.k]], bad: [[0, 0], [s.b + s.off, s.k + s.h]],
    parts: [{ poly: [[0, 0], [s.b, 0], [s.b, s.k], [0, s.k]], A: s.b * s.k }, { poly: [[0, s.k], [s.b, s.k], [s.b + s.off, s.k + s.h], [s.off, s.k + s.h]], A: s.b * s.h, para: true }],
    labs: [[[s.b / 2, 0], [0, -.75], s.b], [[s.b, s.k / 2], [.9, 0], s.k]], hts: [[[s.off, s.k + s.h], [s.off, s.k], s.h, 1]] }),
  trapRect: s => { const off = s.off ?? (s.b - s.a) / 2; return { pts: [[0, 0], [s.b, 0], [s.b, s.k], [off + s.a, s.k + s.h], [off, s.k + s.h], [0, s.k]], cut: [[0, s.k], [s.b, s.k]], bad: [[0, 0], [off + s.a, s.k + s.h]],
    parts: [{ poly: [[0, 0], [s.b, 0], [s.b, s.k], [0, s.k]], A: s.b * s.k }, { poly: [[0, s.k], [s.b, s.k], [off + s.a, s.k + s.h], [off, s.k + s.h]], A: (s.a + s.b) * s.h / 2, full: (s.a + s.b) * s.h, big: s.b * s.h }],
    labs: [[[s.b / 2, 0], [0, -.75], s.b], [[s.b, s.k / 2], [.9, 0], s.k], [[off + s.a / 2, s.k + s.h], [0, .75], s.a]],
    hts: off === 0 ? [[[0, s.k + s.h], [0, s.k], s.h, -1, true]] : [[[off, s.k + s.h], [off, s.k], s.h, 1]] }; },
};
function a2CompData(spec) { const F = A2_FIG[spec.fig](spec), want = F.parts.reduce((a, p) => a + p.A, 0), half = F.parts.find(p => p.full != null), big = F.parts.find(p => p.big != null), para = F.parts.find(p => p.para);
  const errs = []; if (half) errs.push(want - half.A + half.full); if (F.ghost) errs.push(F.whole); if (big) errs.push(want - big.A + big.big); if (para) errs.push(want - para.A / 2); errs.push(Math.max(...F.parts.map(p => p.A)));
  return { F, want, errs }; }
function a2CompDraw(svg, spec, o = {}) { const { F } = a2CompData(spec), u = spec.u || 'cm', D = a2Fig(svg, F.pts.concat(F.ghost || []), {}), M = D.M, g = el('g', { 'pointer-events': 'none' }, svg);
  if (F.ghost && o.ghost !== false) { const Gq = F.ghost.map(M); el('polygon', { points: polyStr(Gq), fill: '#fff', 'fill-opacity': .5, stroke: A2.ghost, 'stroke-width': 2.4, 'stroke-dasharray': '6 5' }, g); }
  a2Poly(g, F.pts.map(M), o.fill || A2.fill); const L = (p, d, txt, col) => htLab(g, M([p[0] + d[0], p[1] + d[1]]), txt, col);
  for (const [p, d, v, col] of F.labs) a2Fit(L(p, d, htCm(v, u), col || A2.ink));
  for (const [T, Fo, v, s, edge] of F.hts) { const t = M(T), f = M(Fo); if (!edge) { geoLine(g, t[0], t[1], f[0], f[1], { color: A2.h, w: 3, dash: '6 4' }); a2Right(g, f, t, M([Fo[0] + s, Fo[1]]), 9, A2.h); } a2Fit(L([Fo[0], (T[1] + Fo[1]) / 2], [.85 * s, 0], htCm(v, u), A2.h), edge ? f[0] : null, s); }
  if (F.cut && o.cut !== false) { const a = M(F.cut[0]), b = M(F.cut[1]); geoLine(g, a[0], a[1], b[0], b[1], { color: A2.ink, w: 2, dash: '5 5' }); }
  return { D, M, F, g }; }
/* الأجزاء ملوّنة ومساحاتها (الحلّ المشترك والكشف): upTo عدد الأجزاء التي تُكتب مساحتها */
function a2CompParts(svg, C, upTo = 9) { const m = helpG(svg), cols = [A2.p1, A2.p2, A2.p3]; C.F.parts.forEach((p, i) => { const Q = p.poly.map(C.M); a2Poly(m, Q, p.A < 0 ? '#fff' : cols[i % 3], { op: .75, w: 1.5 }); if (i < upTo) { const cx = Q.reduce((a, q) => a + q[0], 0) / Q.length, cy = Q.reduce((a, q) => a + q[1], 0) / Q.length; labAvoid(htLab(m, [cx, cy], (p.A < 0 ? '− ' : '') + Math.abs(p.A), THINK_INK, 16)); } }); return m; }

/* ================= ⑥ مساحة الشكل المركّب (C323): fig وأبعاده؛ بالتقسيم (cut) أو بالإتمام (notch) ================= */
ITEM.comp2 = { ...a2NumItem,
  make(spec) { const { want, errs } = a2CompData(spec); /*T*/if (TESTHOOK && (want <= 0 || !Number.isInteger(want * 2))) testBug('comp2: مساحة غير صالحة');/*/T*/ return { ...spec, want, nums: a2Mix(want, errs), tag: 'comp2-' + spec.fig }; },
  async ask(item, mode, tries) { const svg = m3Stage(250), C = a2CompDraw(svg, item);
    if (tries >= 3) { a2CompParts(svg, C, C.F.parts.length - 1); await S(C.F.ghost ? 'gen.a2.together.notch' : 'gen.a2.together.comp'); } else await S(item.q || (C.F.ghost ? 'gen.a2.q.notch' : 'gen.a2.q.comp'));
    const np = await this.askNum(item); return { ans: await np.p, ctx: { svg, C } }; },
  judge(item, k) { if (k === item.want) return { ok: true }; const { F } = a2CompData(item), half = F.parts.find(p => p.full != null), big = F.parts.find(p => p.big != null), para = F.parts.find(p => p.para);
    if (F.ghost) return { ok: false, err: k === F.whole ? 'compWhole' : k === item.want - half.A + half.full ? 'compSubNoHalf' : 'a2AreaOff' };
    return { ok: false, err: half && k === item.want - half.A + half.full ? 'compNoHalf' : big && k === item.want - big.A + big.big ? 'trapBig' : para && k === item.want - para.A / 2 ? 'areaHalf' : k === Math.max(...F.parts.map(p => p.A)) ? 'compPart' : 'a2AreaOff' }; },
  async hint2(item, r) { if (r && r.ctx && r.ctx.C) a2CompParts(r.ctx.svg, r.ctx.C, 0);   /* الأجزاء ملوّنة بلا مساحاتها */
    await S(A2_FIG[item.fig](item).ghost ? 'gen.a2.hint.notch' : 'gen.a2.hint.comp'); }, async together() {},
  async reveal(item, r) { if (r && r.ctx && r.ctx.C) a2CompParts(r.ctx.svg, r.ctx.C); await S('gen.ht.reveal.num', { noGap: true }); await S(bigw(item.want), { append: true }); },
  praise: () => 'praiseThink', twin(item) { return item.twin || null; },
};

/* ================= ⑦ محيط «البيت» (C323 تطبيقاً لـ C209): w القاعدة، hw الجدار، s ضلع السقف (يُقاس)، والقطع الداخلي مكتوب طوله إغراءً ================= */
ITEM.comp2Perim = { ...a2NumItem,
  make(spec) { const want = spec.w + 2 * spec.hw + 2 * spec.s; return { ...spec, want, nums: a2Mix(want, [want + spec.w, want - spec.hw, want - spec.s]), tag: 'comp2-perim' }; },
  async ask(item, mode, tries) { const svg = m3Stage(250), u = item.u || 'cm', pts = [[0, 0], [item.w, 0], [item.w, item.hw], [item.w / 2, item.hw + item.hr], [0, item.hw]], D = a2Fig(svg, pts, {}), M = D.M, Q = pts.map(M), g = el('g', { 'pointer-events': 'none' }, svg);
    a2Poly(g, Q, A2.fill); const a = M([0, item.hw]), b = M([item.w, item.hw]); geoLine(g, a[0], a[1], b[0], b[1], { color: A2.ghost, w: 2, dash: '5 5' });
    const L = (p, d, v, col) => htLab(g, M([p[0] + d[0], p[1] + d[1]]), htCm(v, u), col || A2.ink);
    L([item.w / 2, 0], [0, -.75], item.w); L([0, item.hw / 2], [-.9, 0], item.hw); L([item.w, item.hw / 2], [.9, 0], item.hw); L([item.w / 2, item.hw], [0, .6], item.w, A2.ghost);
    L([item.w / 4, item.hw + item.hr / 2], [-.8, .5], item.s, A2.side); L([item.w * .75, item.hw + item.hr / 2], [.8, .5], item.s, A2.side);
    if (tries >= 3) { const m = helpG(svg); el('polygon', { points: polyStr(Q), fill: 'none', stroke: THINK_INK, 'stroke-width': 6, opacity: .7 }, m); await S('gen.a2.together.perimH'); } else await S(item.q || 'gen.a2.q.perimH');
    const np = await this.askNum(item); return { ans: await np.p, ctx: { svg, a, b } }; },
  judge(item, k) { return k === item.want ? { ok: true } : { ok: false, err: k === item.want + item.w ? 'perimInner' : k < item.want ? 'perimMiss' : 'perimOff' }; },
  async hint2(item, r) { if (r && r.ctx && r.ctx.a) { const m = helpG(r.ctx.svg), c = [(r.ctx.a[0] + r.ctx.b[0]) / 2, (r.ctx.a[1] + r.ctx.b[1]) / 2]; for (const s of [1, -1]) geoLine(m, c[0] - 11, c[1] - 11 * s, c[0] + 11, c[1] + 11 * s, { color: A2.bad, w: 4 }); }   /* الخطّ الداخلي مشطوب: ليس على الحافة */
    await S('gen.a2.hint.perimH'); }, async together() {},
  async reveal(item) { await S('gen.ht.reveal.num', { noGap: true }); await S(bigw(item.want), { append: true }); },
  praise: () => 'praiseThink', twin(item) { return item.twin || null; },
};

/* ================= ⑧ «مهندس المخططات» (C323، اللعبة): قطعان مقترحان؛ يختار الطفل القطع الذي يعطي أجزاء مألوفة، ثم يحسب المساحة كلها ================= */
ITEM.compCut = { ...a2NumItem,
  make(spec) { const { want, errs } = a2CompData(spec), ks = shuffle(['a', 'b']); return { ...spec, want, nums: a2Mix(want, errs), good: ks[0], badK: ks[1], tag: 'comp-cut-' + spec.fig }; },
  async ask(item, mode, tries) { const svg = m3Stage(250), C = a2CompDraw(svg, item, { cut: false }), F = C.F, lines = {};
    for (const [k, seg, col] of [[item.good, F.cut, A2.side], [item.badK, F.bad, A2.mid]]) { const a = C.M(seg[0]), b = C.M(seg[1]), g = el('g', { 'pointer-events': 'none' }, svg); geoLine(g, a[0], a[1], b[0], b[1], { color: col, w: 3, dash: '7 5' }); const os = k === item.good ? F.bad : F.cut, om = C.M([(os[0][0] + os[1][0]) / 2, (os[0][1] + os[1][1]) / 2]), far = Math.hypot(a[0] - om[0], a[1] - om[1]) > Math.hypot(b[0] - om[0], b[1] - om[1]) ? [a, b] : [b, a], L0 = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1, nx = -(b[1] - a[1]) / L0, ny = (b[0] - a[0]) / L0, sg = (om[0] - far[0][0]) * nx + (om[1] - far[0][1]) * ny > 0 ? -1 : 1, p = [far[0][0] + (far[1][0] - far[0][0]) * .2 + sg * nx * 14, far[0][1] + (far[1][1] - far[0][1]) * .2 + sg * ny * 14 + 6]; htLab(g, p, LTR[k], col, 18);   /* حرف القطع الغريب قرب طرفه، لا فوق طول ضلع (المراجع A لبوابة S3-U4/U5، 22) */ lines[k] = g; }
    if (tries >= 3) { lines[item.badK].remove(); a2CompParts(svg, C, F.parts.length - 1); await S('gen.a2.together.cut'); }
    else { await S(item.q || 'gen.a2.q.cut'); const k = await choosePick(['a', 'b'].map(x => [x, LTR[x], '<i></i>', 'gen.ltr.' + x]), item.good); if (k !== item.good) return { ans: 'odd', ctx: { svg, C } };
      lines[item.badK].remove(); const m = helpG(svg); F.parts.forEach((p, i) => a2Poly(m, p.poly.map(C.M), [A2.p1, A2.p2][i % 2], { op: .7, w: 1.5 })); SFX.tick(); await S('gen.a2.q.cutTotal'); }
    const np = await this.askNum(item); return { ans: await np.p, ctx: { svg, C } }; },
  judge(item, k) { if (k === 'odd') return { ok: false, err: 'compCutOdd' }; return ITEM.comp2.judge(item, k); },
  async hint2(item, r) { if (r && r.ctx && r.ctx.C && r.ans !== 'odd') a2CompParts(r.ctx.svg, r.ctx.C, 0);
    else if (r && r.ctx && r.ctx.C) { const C = r.ctx.C, a = C.M(C.F.bad[0]), b = C.M(C.F.bad[1]), c = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2], m = helpG(r.ctx.svg); for (const s2 of [1, -1]) geoLine(m, c[0] - 12, c[1] - 12 * s2, c[0] + 12, c[1] + 12 * s2, { color: A2.bad, w: 4 }); }   /* القطع الغريب مشطوب: يعطي أجزاءً غير مألوفة */   /* الأجزاء ملوّنة بلا مساحاتها؛ وبعد القطع الغريب جملته وحدها، فالبطاقة تُعاد بالقطعين */
    await S(r && r.ans === 'odd' ? 'gen.a2.hint.cut' : 'gen.a2.hint.comp'); }, async together() {},
  async reveal(item, r) { if (r && r.ctx && r.ctx.C) a2CompParts(r.ctx.svg, r.ctx.C); await S('gen.ht.reveal.num', { noGap: true }); await S(bigw(item.want), { append: true }); },
  praise: () => 'praiseThink', twin(item) { return item.twin || null; },
};

/* ================= بطاقة مساحة بوحدتها (د4 ود5): [القيمة، 'm2' | 'cm2'] ================= */
function a2Card(parent, x, y, v, u, o = {}) { const g = el('g', { transform: `translate(${x} ${y})`, 'pointer-events': 'none' }, parent), w = o.w || 136;
  el('rect', { x: -w / 2, y: -30, width: w, height: 60, rx: 14, fill: o.fill || '#fff', stroke: o.stroke || A2.ink, 'stroke-width': 2.5, 'stroke-dasharray': o.dash || null }, g);
  const t = el('text', { x: 0, y: 9, 'text-anchor': 'middle', 'font-size': o.fs || 22, 'font-weight': 800, fill: o.col || A2.ink, direction: 'rtl' }, g); t.textContent = v == null ? '؟ ' + labelText(u === 'm2' ? 'arM2' : 'arCm2') : `${v} ${labelText(u === 'm2' ? 'arM2' : 'arCm2')}`; return { g, t }; }
const a2Line = (v, u) => 'gen.a2.v.' + v + '.' + u;

/* ================= ⑨ التحويل بين سم² وم² (C308): v، from m2 | cm2؛ أو room [ط، ع] بوحدة u (غرفة بالمتر تُطلب بالسم²، أو مستطيل بالسم يُطلب بالم²) ================= */
ITEM.a2Conv = { ...a2NumItem,
  make(spec) { const room = spec.room, from = room ? (spec.u === 'm' ? 'm2' : 'cm2') : spec.from, v = room ? room[0] * room[1] : spec.v, toCm = from === 'm2', want = toCm ? v * 10000 : v / 10000;
    /*T*/if (TESTHOOK && !Number.isInteger(want)) testBug('a2Conv: تحويل غير صحيح');/*/T*/
    const errs = (toCm ? [v * 100, room ? v : v * 1000] : [v / 100, room ? v : v / 1000]).filter(n => Number.isInteger(n) && n > 0 && n !== want);
    return { ...spec, from, v, want, nums: shuffle([want, ...[...new Set(errs)].slice(0, 2)]), tag: 'a2conv-' + from + (room ? '-room' : '') }; },
  async ask(item, mode, tries) { const svg = m3Stage(250), to = item.from === 'm2' ? 'cm2' : 'm2';
    if (item.room) { const [l, w] = item.room, k = Math.min(200 / l, 96 / w, 40), u = item.u === 'm' ? 'm' : 'cm', W = item.u === 'm' ? l * k : 210, H = item.u === 'm' ? w * k : 100, x0 = 180 - W / 2, y0 = 56;
      el('rect', { x: x0, y: y0, width: W, height: H, fill: '#f2e6cf', stroke: '#b9794e', 'stroke-width': 3, 'pointer-events': 'none' }, svg); htLab(svg, [180, y0 + H + 18], htCm(l, u)); htLab(svg, [x0 + W + 30, y0 + H / 2], htCm(w, u)); a2Card(svg, 180, 210, null, to, { stroke: THINK_INK, col: THINK_INK, dash: '6 4', w: 150 }); }
    else { a2Card(svg, 262, 110, item.v, item.from, { w: 150 }); const eq = el('text', { x: 180, y: 120, 'text-anchor': 'middle', 'font-size': 30, 'font-weight': 800, fill: A2.ink }, svg); eq.textContent = '='; a2Card(svg, 92, 110, null, to, { stroke: THINK_INK, col: THINK_INK, dash: '6 4', w: 140 }); }
    if (tries >= 3) { hintCard(svg, 180, item.room ? 34 : 190, `1 ${labelText('arM2')} = 10000 ${labelText('arCm2')}`); await S('gen.a2.together.conv'); }
    else await S(item.q || (item.room ? 'gen.a2.q.room.' + to : 'gen.a2.q.to.' + to));
    const np = await this.askNum(item); return { ans: await np.p, ctx: { svg } }; },
  judge(item, k) { if (k === item.want) return { ok: true }; const v = item.v; return { ok: false, err: k === v * 100 || k === v / 100 ? 'a2Conv100' : item.room && k === v ? 'a2NoConv' : (item.from === 'm2' ? k < v : k > v) ? 'convDir' : 'a2Factor' }; },
  async hint2(item, r) { if (r && r.ctx && r.ctx.svg) a2Grid100(helpG(r.ctx.svg), item.room ? 46 : 180, item.room ? 84 : 186, item.room ? 46 : 60); await S(item.from === 'm2' ? 'gen.a2.hint.toCm2' : 'gen.a2.hint.toM2'); }, async together() {},
  async reveal(item) { await S('gen.ht.reveal.num', { noGap: true }); await S(bigw(item.want), { append: true }); },
  praise: () => 'praiseThink', twin(item) { return item.twin || null; },
};

/* ================= ⑩ أيّ المساحتين أكبر؟ (C308): a وb أزواج [القيمة، الوحدة]؛ الجواب بالتحويل إلى الوحدة الأصغر ================= */
ITEM.a2Cmp = {
  make(spec) { const cm = ([v, u]) => u === 'm2' ? v * 10000 : v, x = cm(spec.a), y = cm(spec.b); return { ...spec, want: x > y ? 'a' : y > x ? 'b' : 'eq', tag: 'a2cmp' }; },
  async ask(item, mode, tries) { const svg = m3Stage(250); a2Card(svg, 266, 100, item.a[0], item.a[1], { w: 140, fs: 20 }); a2Card(svg, 94, 100, item.b[0], item.b[1], { w: 140, fs: 20 }); const q = el('text', { x: 180, y: 110, 'text-anchor': 'middle', 'font-size': 26, 'font-weight': 800, fill: A2.ink }, svg); q.textContent = '؟';
    if (tries >= 3) { hintCard(svg, 180, 220, `1 ${labelText('arM2')} = 10000 ${labelText('arCm2')}`); await S('gen.a2.together.cmp'); } else await S(item.q || 'gen.a2.q.cmp');
    const txt = ([v, u]) => `${v} ${labelText(u === 'm2' ? 'arM2' : 'arCm2')}`;
    const k = await choosePick([['a', txt(item.a), '<i></i>', a2Line(...item.a)], ['b', txt(item.b), '<i></i>', a2Line(...item.b)], ['eq', labelText('a2Eq'), '<i></i>', 'gen.a2.cmp.eq']], item.want); return { ans: k, ctx: { svg } }; },
  judge(item, k) { if (k === item.want) return { ok: true }; if (k === 'eq') return { ok: false, err: 'a2CmpEq' }; const raw = k === 'a' ? item.a[0] > item.b[0] : item.b[0] > item.a[0]; return { ok: false, err: raw ? 'a2CmpDigits' : 'a2CmpOff' }; },
  onOk() { SFX.good(); }, onWrong() { SFX.soft(); },
  async hint2(item, r) { if (r && r.ctx && r.ctx.svg) { const m = helpG(r.ctx.svg); [['a', 266], ['b', 94]].forEach(([k, x]) => { if (item[k][1] === 'm2') { geoArrow(m, x, 148, 90, THINK_INK, 8); a2Card(m, x, 178, null, 'cm2', { w: 136, fs: 17, stroke: THINK_INK, col: THINK_INK, dash: '6 4' }); } }); }   /* بطاقة «؟ سم²» تحت المتر المربع: إلى الوحدة الأصغر */
    await S('gen.a2.hint.cmp'); }, async together() {},
  async reveal(item) { await S(item.want === 'eq' ? 'gen.a2.cmp.eq' : a2Line(...item[item.want])); },
  praise: () => 'praiseThink', twin(item) { return item.twin || null; },
};

/* ================= ⑪ البلاط (C308): A المساحة بالمتر المربع (أو room [ط، ع] بالمتر)، وبلاطة 50 سم × 50 سم: أربع في المتر المربع ================= */
function a2TileSq(parent, x, y, s, o = {}) { const g = el('g', { 'pointer-events': 'none' }, parent);
  for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++) el('rect', { x: x + i * s / 2, y: y + j * s / 2, width: s / 2, height: s / 2, fill: (i + j) % 2 ? '#e6d3b3' : '#f2e6cf', stroke: '#b9794e', 'stroke-width': 2 }, g);
  if (o.lab !== false) { htLab(g, [x + s / 4, y + s + 16], htCm(50), A2.ink, 13); htLab(g, [x + s / 2, y - 12], `1 ${U_('m')}`, A2.ink, 14); } return g; }
ITEM.a2Tiles = { ...a2NumItem,
  make(spec) { const A = spec.room ? spec.room[0] * spec.room[1] : spec.A, want = A * 4; return { ...spec, A, want, nums: shuffle([want, A * 2, A]), tag: 'a2tiles' + (spec.room ? '-room' : '') }; },
  async ask(item, mode, tries) { const svg = m3Stage(250); a2TileSq(svg, 228, 50, 100);
    if (item.room) { const [l, w] = item.room, k = Math.min(130 / l, 110 / w), W = l * k, H = w * k, x0 = 20 + (130 - W) / 2, y0 = 50; el('rect', { x: x0, y: y0, width: W, height: H, fill: '#f2e6cf', stroke: '#b9794e', 'stroke-width': 3, 'pointer-events': 'none' }, svg); htLab(svg, [x0 + W / 2, y0 + H + 18], htCm(l, 'm')); htLab(svg, [x0 + W + 24, y0 + H / 2], htCm(w, 'm')); }
    else a2Card(svg, 96, 100, item.A, 'm2', { w: 150 });
    if (tries >= 3) { hintCard(svg, 180, 210, `${item.A} × 4 = ؟`); await S('gen.a2.together.tiles'); } else await S(item.q || 'gen.a2.q.tiles');
    const np = await this.askNum(item); return { ans: await np.p, ctx: { svg } }; },
  judge(item, k) { return k === item.want ? { ok: true } : { ok: false, err: k === item.A * 2 ? 'tileTwo' : k === item.A ? 'tileOne' : 'tileOff' }; },
  async hint2(item, r) { if (r && r.ctx && r.ctx.svg) { const m = helpG(r.ctx.svg); [[253, 75], [303, 75], [253, 125], [303, 125]].forEach(([x, y], i) => badge(m, x, y, i + 1, THINK_INK)); }   /* البلاطات الأربع في المتر المربع مرقّمة */
    await S('gen.a2.hint.tiles'); }, async together() {},
  async reveal(item) { await S('gen.ht.reveal.num', { noGap: true }); await S(bigw(item.want), { append: true }); },
  praise: () => 'praiseThink', twin(item) { return item.twin || null; },
};

/* ================= ⑫ «محوّل فرجار للمساحات» (C308، اللعبة): v، from؛ يختار الطفل العملية ثم العدد (100، 1000، 10000) ================= */
const A2_F = [100, 1000, 10000];
/* المستوى الثاني في التحويل (المراجع A لبوابة S3-U4/U5، 9): متر مربع مقسوم عشرةً في عشرة، وضلعه «١٠٠ سم»، بلا العملية: يعدّ الطفل ولا يُعطاها */
function a2Grid100(parent, cx, cy, s) { const g = el('g', { 'pointer-events': 'none' }, parent), x = cx - s / 2, y = cy - s / 2; el('rect', { x, y, width: s, height: s, fill: '#fff', stroke: THINK_INK, 'stroke-width': 2.4 }, g);
  for (let i = 1; i < 10; i++) { geoLine(g, x + i * s / 10, y, x + i * s / 10, y + s, { color: '#d7c2a0', w: 1 }); geoLine(g, x, y + i * s / 10, x + s, y + i * s / 10, { color: '#d7c2a0', w: 1 }); }
  htLab(g, [cx, y + s + 13], htCm(100), THINK_INK, 12); return g; }
ITEM.a2Machine = {
  make(spec) { const op = spec.from === 'm2' ? 'mul' : 'div'; return { ...spec, op, want: op + 10000, tag: 'a2-machine' }; },
  async ask(item, mode, tries) { const svg = m3Stage(250), g = el('g', {}, svg), to = item.from === 'm2' ? 'cm2' : 'm2';
    el('rect', { x: 138, y: 62, width: 84, height: 92, rx: 16, fill: '#6c7fa8', stroke: '#4a5a80', 'stroke-width': 3 }, g); el('circle', { cx: 180, cy: 82, r: 9, fill: '#f2b33d' }, g); const disp = el('text', { x: 180, y: 130, 'text-anchor': 'middle', 'font-size': 22, 'font-weight': 800, fill: '#fff', direction: 'ltr' }, g); disp.textContent = '؟';
    a2Card(g, 283, 108, item.v, item.from, { w: 98, fs: 16 }); const out = a2Card(g, 77, 108, null, to, { w: 98, fs: 16, stroke: THINK_INK, col: THINK_INK, dash: '6 4' });   /* داخل الورقة (المراجع B، 5) */
    for (const x2 of [228, 130]) geoArrow(g, x2, 108, 180, A2.ink, 8);
    if (tries >= 3) hintCard(svg, 158, 198, `1 ${labelText('arM2')} = 10000 ${labelText('arCm2')}`);   /* بجانب متر المستوى الثاني لا عليه (المراجع B، 11) */
    await S(tries >= 3 ? 'gen.a2.together.machine' : item.q || 'gen.a2.q.machine');
    const op = await choosePick([['mul', '×', '<i></i>', 'gen.len.op.mul'], ['div', '÷', '<i></i>', 'gen.len.op.div']], item.op); disp.textContent = op === 'mul' ? '×' : '÷'; SFX.tick();
    await S('gen.len.byWhat'); const f = await choosePick(A2_F.map(n => [String(n), String(n), '<i></i>', n === 10000 ? 'gen.a2.f.10000' : 'gen.len.f.' + n]), '10000'); disp.textContent = (op === 'mul' ? '× ' : '÷ ') + f;
    const res = op === 'mul' ? item.v * +f : item.v / +f; out.t.textContent = (Number.isInteger(res) ? res : '…') + ' ' + labelText(to === 'm2' ? 'arM2' : 'arCm2');
    return { ans: op + f, ctx: { svg, out } }; },
  judge(item, k) { return k === item.want ? { ok: true } : { ok: false, err: !k.startsWith(item.op) ? 'convDir' : k.endsWith('00') && !k.endsWith('000') ? 'a2Conv100' : 'a2Factor' }; },
  onOk() { SFX.good(); }, onWrong() { SFX.soft(); },
  async hint2(item, r) { if (r && r.ctx && r.ctx.svg) a2Grid100(helpG(r.ctx.svg), 294, 186, 46); await S(item.from === 'm2' ? 'gen.a2.hint.toCm2' : 'gen.a2.hint.toM2'); }, async together() {},
  async reveal(item, r) { const res = item.op === 'mul' ? item.v * 10000 : item.v / 10000; if (r && r.ctx && r.ctx.out) r.ctx.out.t.textContent = res + ' ' + labelText(item.from === 'm2' ? 'arCm2' : 'arM2'); await S(item.op === 'mul' ? 'gen.a2.reveal.mul' : 'gen.a2.reveal.div'); },
  praise: () => 'praiseThink', twin(item) { return item.twin || null; },
};

/* ================= المشاهد ================= */
/* الإشعال (د1): شبه منحرف 6 و10 وارتفاعه 4؛ فوضى تضرب القاعدة الكبرى، والعدّ: مستطيل 24 ومثلثان يكوّنان 8 */
SCENES.trapHook = async c => { const L = c.lines, svg = m3Stage(250), it = { a: 6, b: 10, h: 4 }, D = a2Trap(svg, it), fz = chaosAt(svg, 318, 38, .4); chaosGiggle(fz);
  const t = a2Formula(svg, '10 × 4 = 40', A2.bad); await S(L[0]); t.remove(); const m = el('g', { 'pointer-events': 'none' }, svg);
  a2Poly(m, [[2, 0], [8, 0], [8, 4], [2, 4]].map(D.M), A2.p1, { op: .75, w: 1.5 }); const t2 = a2Formula(svg, '6 × 4 = 24'); SFX.tick(); await sleep(FAST ? 5 : 900);
  a2Poly(m, [[0, 0], [2, 0], [2, 4]].map(D.M), A2.p2, { op: .8, w: 1.5 }); a2Poly(m, [[8, 0], [10, 0], [8, 4]].map(D.M), A2.p2, { op: .8, w: 1.5 }); t2.textContent = '24 + 4 + 4 = 32'; SFX.good(); D.g.querySelectorAll('text').forEach(x => svg.appendChild(x));   /* الأطوال فوق التلوين */
  for (const l of L.slice(1)) await S(l); };
/* الاكتشاف (د1): الأسماء، ثم نسخة مقلوبة نصف دورة حول منتصف الساق تكوّن متوازي أضلاع 16 × 4، ثم التحقق بالقطر */
SCENES.trapCopies = async c => { const L = c.lines, svg = m3Stage(250), G = a2Grid(svg, 20, 7), it = { a: 6, b: 10, h: 4 }, F = a2Fig(svg, [[0, 0], [18, 0], [18, 4], [0, 4]], { G }), M = F.M;
  const Q = [[0, 0], [10, 0], [8, 4], [2, 4]].map(M), g = el('g', { 'pointer-events': 'none' }, svg); a2Poly(g, Q, A2.fill);
  const ln = (P, R, col, w = 6) => geoLine(g, P[0], P[1], R[0], R[1], { color: col, w }); const lb = (p, txt, col) => htLab(g, p, txt, col, 14);
  ln(Q[0], Q[1], A2.bot); ln(Q[3], Q[2], A2.top); ln(Q[0], Q[3], A2.legs, 4); ln(Q[1], Q[2], A2.legs, 4); const H = [M([2, 4]), M([2, 0])]; geoLine(g, H[0][0], H[0][1], H[1][0], H[1][1], { color: A2.h, w: 3, dash: '6 4' }); a2Right(g, H[1], H[0], M([3, 0]));
  const names = el('g', { 'pointer-events': 'none' }, svg); htLab(names, [(Q[0][0] + Q[1][0]) / 2, Q[0][1] + 17], labelText('a2Base'), A2.bot, 14); htLab(names, [(Q[3][0] + Q[2][0]) / 2, Q[3][1] - 14], labelText('a2Base'), A2.top, 14); htLab(names, M([.2, 2.6]), labelText('a2Leg'), A2.legs, 13); htLab(names, M([3.9, 2]), labelText('a2Height'), A2.h, 13);
  await S(L[0]); names.remove();
  lb([(Q[0][0] + Q[1][0]) / 2, Q[0][1] + 17], htCm(10), A2.bot); lb([(Q[3][0] + Q[2][0]) / 2, Q[3][1] - 14], htCm(6), A2.top); lb(M([2.9, 2]), '4', A2.h);
  const Mm = M([9, 2]), cp = a2Poly(svg, Q, A2.p1, { op: .85, w: 2 }); SFX.tick();
  await anim(cp, [{ transform: 'rotate(0deg)', transformOrigin: `${Mm[0]}px ${Mm[1]}px` }, { transform: 'rotate(180deg)', transformOrigin: `${Mm[0]}px ${Mm[1]}px` }], { duration: FAST ? 10 : 1400, fill: 'forwards' }).done; SFX.good();
  const t = a2Formula(svg, '(10 + 6) × 4 = 64'); await S(L[1]); t.textContent = '64 ÷ 2 = 32'; await S(L[2]);
  cp.remove(); t.textContent = ''; const d = M([8, 4]); geoLine(g, Q[0][0], Q[0][1], d[0], d[1], { color: A2.mid, w: 3 }); a2Poly(g, [Q[0], Q[1], Q[2]], A2.p2, { op: .55, w: 1 }); a2Poly(g, [Q[0], Q[2], Q[3]], A2.p3, { op: .55, w: 1 });
  t.textContent = '20 + 12 = 32'; SFX.tick(); await S(L[3]); t.textContent = '(6 + 10) × 4 ÷ 2 = 32'; for (const l of L.slice(4)) await S(l); };
/* الإشعال (د2): معيّن قطراه 8 و6؛ فوضى تضرب القطرين، والمستطيل حوله 48 والمعيّن نصفه */
SCENES.diagHook = async c => { const L = c.lines, svg = m3Stage(250), it = { k: 'rhom', p: 8, r: 6 }, D = a2Diag(svg, it), fz = chaosAt(svg, 318, 38, .4); chaosGiggle(fz);
  const t = a2Formula(svg, '8 × 6 = 48', A2.bad); await S(L[0]); const m = el('g', { 'pointer-events': 'none' }, svg); el('polygon', { points: polyStr([[0, 0], [8, 0], [8, 6], [0, 6]].map(D.M)), fill: 'none', stroke: A2.bad, 'stroke-width': 2.4, 'stroke-dasharray': '6 5' }, m);
  for (const [a, b, cc] of [[[0, 3], [4, 0], [0, 0]], [[4, 0], [8, 3], [8, 0]], [[8, 3], [4, 6], [8, 6]], [[4, 6], [0, 3], [0, 6]]]) a2Poly(m, [a, b, cc].map(D.M), A2.p1, { op: .6, w: 1 });
  t.textContent = '48 ÷ 2 = 24'; t.setAttribute('fill', A2.ok); SFX.good(); for (const l of L.slice(1)) await S(l); };
/* الاكتشاف (د2): أربعة مثلثات قائمة، ثم مثلثان بالقطر الأطول، ثم الطائرة والمربع */
SCENES.rhombFour = async c => { const L = c.lines, svg = m3Stage(250); let g = el('g', {}, svg); const t = a2Formula(svg, '');
  let D = a2Diag(g, { k: 'rhom', p: 8, r: 6 }, { parts: true, lens: false, cols: 14, rows: 9 }); const cols = [A2.p1, A2.p2, A2.p1, A2.p2], C = [4, 3];
  for (const [i, [a, b]] of [[[0, 3], [4, 0]], [[4, 0], [8, 3]], [[8, 3], [4, 6]], [[4, 6], [0, 3]]].entries()) { a2Poly(g, [a, b, C].map(D.M), cols[i], { op: .7, w: 1 }); SFX.tick(); await sleep(FAST ? 5 : 350); }
  t.textContent = '4 × (3 × 4 ÷ 2) = 24'; await S(L[0]); a2Poly(g, [[0, 3], [8, 3], [4, 6]].map(D.M), A2.p3, { op: .8, w: 1.5 }); t.textContent = '8 × 3 ÷ 2 = 12 · 12 + 12 = 24'; await S(L[1]); t.textContent = '8 × 6 ÷ 2 = 24'; await S(L[2]);
  g.remove(); g = el('g', {}, svg); D = a2Diag(g, { k: 'kite', p: 10, r: 6, cut: 4 }, { parts: true, lens: false, cols: 14, rows: 9 }); a2Poly(g, [[0, 3], [4, 0], [4, 6]].map(D.M), A2.p1, { op: .7, w: 1 }); a2Poly(g, [[4, 0], [10, 3], [4, 6]].map(D.M), A2.p2, { op: .7, w: 1 }); t.textContent = '12 + 18 = 30 = 10 × 6 ÷ 2'; SFX.tick(); await S(L[3]);
  g.remove(); g = el('g', {}, svg); D = a2Diag(g, { k: 'square', p: 8, r: 8 }, { cols: 14, rows: 10 }); t.textContent = '8 × 8 ÷ 2 = 32'; SFX.tick(); for (const l of L.slice(4)) await S(l); };
/* المثال المضاد (د2): مستطيل 8 × 6 قطراه 10 و10؛ الصيغة تعطي 50 والمساحة 48 */
SCENES.rectCounter = async c => { const L = c.lines, svg = m3Stage(250), G = a2Grid(svg, 12, 8), M = p => G.P([p[0] + 2, p[1] + 1]), Q = [[0, 0], [8, 0], [8, 6], [0, 6]].map(M), g = el('g', { 'pointer-events': 'none' }, svg);
  a2Poly(g, Q, A2.fill); geoLine(g, Q[0][0], Q[0][1], Q[2][0], Q[2][1], { color: DQ.d1, w: 3 }); geoLine(g, Q[1][0], Q[1][1], Q[3][0], Q[3][1], { color: DQ.d2, w: 3 });
  htLab(g, M([2.4, 2.2]), htCm(10), DQ.d1, 14); htLab(g, M([5.6, 2.2]), htCm(10), DQ.d2, 14); htLab(g, M([4, -.75]), htCm(8)); htLab(g, M([8.9, 3]), htCm(6));
  a2Formula(svg, '10 × 10 ÷ 2 = 50', A2.bad); await S(L[0]); a2Formula(svg, '8 × 6 = 48', A2.ok, 32); SFX.tick(); for (const l of L.slice(1)) await S(l); };
/* الإشعال (د3): «بيت» مستطيل 8 × 6 وسقف مثلث قاعدته 8 وارتفاعه 3؛ فوضى تنسى القسمة على 2 */
SCENES.houseHook = async c => { const L = c.lines, svg = m3Stage(250), C = a2CompDraw(svg, { fig: 'house', w: 8, hw: 6, hr: 3 }), fz = chaosAt(svg, 318, 38, .4); chaosGiggle(fz);
  const t = a2Formula(svg, '48 + 24 = 72', A2.bad); await S(L[0]); a2CompParts(svg, C); t.textContent = '48 + 8 × 3 ÷ 2 = 60'; t.setAttribute('fill', A2.ok); SFX.good(); for (const l of L.slice(1)) await S(l); };
/* الاكتشاف (د3): part a التقسيم («البيت») والإتمام (مستطيل ناقص ركن)؛ part b الشكل نفسه بطريقتين، والمحيط بالسير على الحافة */
SCENES.compShow = async c => { const L = c.lines, svg = m3Stage(250); let g = el('g', {}, svg); const t = a2Formula(svg, '');
  if (c.part !== 'b') { let C = a2CompDraw(g, { fig: 'house', w: 8, hw: 6, hr: 3 }); a2CompParts(g, C); t.textContent = '48 + 12 = 60'; await S(L[0]);
    g.remove(); g = el('g', {}, svg); C = a2CompDraw(g, { fig: 'notch', W: 10, H: 8, a: 4, b: 3 }); t.textContent = '10 × 8 − 4 × 3 ÷ 2 = 74'; SFX.tick(); for (const l of L.slice(1)) await S(l); return; }
  let C = a2CompDraw(g, { fig: 'trapRect', a: 6, b: 10, h: 4, k: 4, off: 0 }); a2CompParts(g, C); t.textContent = '40 + 32 = 72'; await S(L[0]);
  g.remove(); g = el('g', {}, svg); C = a2CompDraw(g, { fig: 'notch', W: 10, H: 8, a: 4, b: 4 }); a2CompParts(g, C); t.textContent = '80 − 8 = 72'; SFX.tick(); await S(L[1]);
  g.remove(); g = el('g', {}, svg); const pts = [[0, 0], [8, 0], [8, 6], [4, 9], [0, 6]], D = a2Fig(g, pts, {}), Q = pts.map(D.M); a2Poly(g, Q, A2.fill); const a = D.M([0, 6]), b = D.M([8, 6]); geoLine(g, a[0], a[1], b[0], b[1], { color: A2.ghost, w: 2, dash: '5 5' });
  for (const [p, d, v] of [[[4, 0], [0, -.75], 8], [[8, 3], [.9, 0], 6], [[6, 7.5], [.8, .5], 5], [[2, 7.5], [-.8, .5], 5], [[0, 3], [-.9, 0], 6]]) htLab(g, D.M([p[0] + d[0], p[1] + d[1]]), htCm(v, 'm'), A2.ink, 14);
  const walk = el('polygon', { points: polyStr(Q), fill: 'none', stroke: THINK_INK, 'stroke-width': 6, opacity: .7, 'pointer-events': 'none' }, g); void walk; t.textContent = '8 + 6 + 5 + 5 + 6 = 30'; SFX.tick(); for (const l of L.slice(2)) await S(l); };
/* الإشعال (د4): المتر المربع، ومربع 100 سم² (ضلعه 10 سم) صغير في ركنه */
SCENES.m2Hook = async c => { const L = c.lines, svg = m3Stage(250), x0 = 120, y0 = 20, s = 172, g = el('g', { 'pointer-events': 'none' }, svg); el('rect', { x: x0, y: y0, width: s, height: s, fill: '#f6eccf', stroke: A2.ink, 'stroke-width': 3 }, g);
  htLab(g, [x0 + s / 2, y0 + s + 16], `1 ${U_('m')} = 100 ${U_('cm')}`, A2.ink, 14); const fz = chaosAt(svg, 50, 60, .4); chaosGiggle(fz); const t = a2Formula(svg, `1 ${labelText('arM2')} = 100 ${labelText('arCm2')} ؟`, A2.bad); await S(L[0]);
  el('rect', { x: x0 + s - s / 10, y: y0, width: s / 10, height: s / 10, fill: A2.bad, opacity: .85 }, g); htLab(g, [x0 + s - s / 10 - 44, y0 + 14], `100 ${labelText('arCm2')}`, A2.bad, 13); SFX.tick(); for (const l of L.slice(1)) await S(l); };
/* الاكتشاف (د4): تغطية المتر المربع بمربعات ضلعها 10 سم: عشرة صفوف في كل منها عشرة، ثم 100 × 100 */
/* مثال محلول (د4): مِتْران مربّعان أم ١٥٠٠٠ سم²؟ يُحوَّل الكبير إلى سم² تحت بطاقته ثم يُقارن */
SCENES.a2CmpShow = async c => { const L = c.lines, svg = m3Stage(250); a2Card(svg, 266, 70, 2, 'm2', { w: 124, fs: 20 }); a2Card(svg, 94, 70, 15000, 'cm2', { w: 128, fs: 18 }); const q = el('text', { x: 180, y: 80, 'text-anchor': 'middle', 'font-size': 28, 'font-weight': 800, fill: A2.ink }, svg); q.textContent = '؟';
  await S(L[0]); geoLine(svg, 266, 102, 266, 124, { color: THINK_INK, w: 3 }); geoArrow(svg, 266, 128, 90, THINK_INK, 9); a2Card(svg, 266, 166, 20000, 'cm2', { w: 128, fs: 18, stroke: THINK_INK, col: THINK_INK }); SFX.tick(); await sleep(FAST ? 5 : 600);
  q.textContent = '<'; q.setAttribute('fill', A2.ok); q.setAttribute('direction', 'ltr'); el('rect', { x: 196, y: 32, width: 140, height: 174, rx: 16, fill: 'none', stroke: A2.ok, 'stroke-width': 4 }, svg); SFX.good(); for (const l of L.slice(1)) await S(l); };   /* الفتحة نحو الأكبر (البطاقة اليمنى)، مرسومةً كما تُرى */
SCENES.m2Cover = async c => { const L = c.lines, svg = m3Stage(250), x0 = 95, y0 = 20, s = 170,   /* المعادلة تحت «١٠٠ سم» داخل الإطار (فحص التراكب) */ k = s / 10, g = el('g', { 'pointer-events': 'none' }, svg); el('rect', { x: x0, y: y0, width: s, height: s, fill: '#fff', stroke: A2.ink, 'stroke-width': 3 }, g);
  const t = a2Formula(svg, '', A2.ok, 230); for (let j = 0; j < 10; j++) { for (let i = 0; i < 10; i++) el('rect', { x: x0 + i * k, y: y0 + s - (j + 1) * k, width: k, height: k, fill: (i + j) % 2 ? '#f2d38a' : '#f6e7c8', stroke: '#c9a54a', 'stroke-width': .8 }, g); t.textContent = `${(j + 1) * 10}`; if (!FAST) await sleep(160); }
  t.textContent = '10 × 10 = 100'; SFX.tick(); await S(L[0]); htLab(g, [x0 + s + 34, y0 + s - k / 2], `100 ${labelText('arCm2')}`, A2.h, 12); t.textContent = '100 × 100 = 10000'; await S(L[1]);
  htLab(g, [x0 + s / 2, y0 + s + 13], htCm(100), A2.ink, 13); htLab(g, [x0 - 30, y0 + s / 2], htCm(100), A2.ink, 13); t.textContent = `1 ${labelText('arM2')} = 10000 ${labelText('arCm2')}`; for (const l of L.slice(2)) await S(l); };
/* المثال المحلول (د4): بلاطة 50 سم × 50 سم، وأربع منها في المتر المربع */
SCENES.tileShow = async c => { const L = c.lines, svg = m3Stage(250); a2TileSq(svg, 110, 40, 150); const t = a2Formula(svg, `50 × 50 = 2500 ${labelText('arCm2')}`); await S(L[0]); t.textContent = `2 × 2 = 4`; SFX.tick(); for (const l of L.slice(1)) await S(l); };
/* المشروع (د5): القاعة «بيتاً» على ورق المربعات (كل مربع متر)، ثم جدول الحساب مكتملاً */
SCENES.hallProject = async c => { const L = c.lines, svg = m3Stage(250);
  if (c.table) { const rows = [['a2T.area', '48 + 12', `60 ${labelText('arM2')}`], ['a2T.fence', '8 + 6 + 6 + 5 + 5', `30 ${U_('m')}`], ['a2T.tiles', '60 × 4', '240'], ['a2T.cm2', '60 × 10000', `600000 ${labelText('arCm2')}`]], g = el('g', { 'pointer-events': 'none' }, svg);   /* وعمود الحساب بين العنصر والناتج (المرجع، المشروع؛ المراجع A لبوابة S3-U4/U5، 20) */
    rows.forEach(([k, f, v], i) => { const y = 34 + i * 50; el('rect', { x: 22, y, width: 316, height: 42, rx: 10, fill: i % 2 ? '#f6eccf' : '#fff', stroke: A2.grid, 'stroke-width': 2 }, g); const a = el('text', { x: 328, y: y + 27, 'text-anchor': 'start', 'font-size': 14, 'font-weight': 800, fill: A2.ink, direction: 'rtl' }, g); a.textContent = labelText(k);
      const m = el('text', { x: 172, y: y + 27, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 700, fill: THINK_INK, direction: 'ltr' }, g); m.textContent = f; const b = el('text', { x: 32, y: y + 27, 'text-anchor': 'end', 'font-size': 15, 'font-weight': 800, fill: A2.ok, direction: 'rtl' }, g); b.textContent = v; });
    for (const l of L) await S(l); return; }
  const C = a2CompDraw(svg, { fig: 'house', w: 8, hw: 6, hr: 3, u: 'm' }); await S(L[0]); a2TileSq(svg, 292, 20, 48, { lab: false }); htLab(svg, [316, 84], htCm(50), A2.ink, 12); SFX.tick(); for (const l of L.slice(1)) await S(l); void C; };
WRAP_ART.area2Art = svg => { const G = htGrid(svg, 12, 6, { H: 150, top: 30 }); a2Trap(svg, { a: 4, b: 8, h: 3 }, { G, bases: false }); };
