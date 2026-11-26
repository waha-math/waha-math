/* =====================================================================
   المرحلة 3 «المهندسون» · S3-U1 مجموع الزوايا
   د1: مجموع زوايا المثلث 180° بالقصّ والتجميع (القصّ هو الحَكَم، والقياس تأكيد بين 175° و185°)،
   والزاوية المجهولة بالطرح من 180، واستحالة زاويتين قائمتين أو منفرجتين.
   الزوايا كلها من مضاعفات 5 (كلمات الدرجات gen.deg.*).
   ===================================================================== */
const TRI_COL = ['#e9894a', '#3d7cc0', '#4f9a6a'];
const dirOf = (P, Q) => Math.atan2(-(Q[1] - P[1]), Q[0] - P[0]) * 180 / Math.PI;   /* اتجاه Q من P بالدرجات، عكس عقارب الساعة من الشرق */
/* مثلث بزاويتي القاعدة a عند أ وb عند ب، والقاعدة أفقية، مُحجَّماً في المربع box = [x0، y0، w، h] */
function triFromAngles(a, b, box) { const r = Math.PI / 180, L = 1, AC = L * Math.sin(b * r) / Math.sin((a + b) * r), A0 = [0, 0], B0 = [L, 0], C0 = [AC * Math.cos(a * r), -AC * Math.sin(a * r)];
  const xs = [A0[0], B0[0], C0[0]], ys = [A0[1], B0[1], C0[1]], mnx = Math.min(...xs), mxx = Math.max(...xs), mny = Math.min(...ys), mxy = Math.max(...ys), [x0, y0, w, h] = box, k = Math.min(w / (mxx - mnx), h / (mxy - mny));
  const ox = x0 + (w - (mxx - mnx) * k) / 2 - mnx * k, oy = y0 + (h - (mxy - mny) * k) / 2 - mny * k, P = p => [ox + p[0] * k, oy + p[1] * k]; return [P(A0), P(B0), P(C0)]; }
/* زاوية الرأس V بين الضلعين إلى P وQ: قوس ولون وكتابة الدرجة (أو «؟») عند منصّفها */
function triCorner(parent, V, P, Q, deg, col, o = {}) { let d1 = dirOf(V, P), d2 = dirOf(V, Q); let sw = ((d2 - d1) % 360 + 360) % 360; if (sw > 180) { [d1, d2] = [d2, d1]; sw = 360 - sw; }
  const r = o.r || (sw > 100 ? 20 : 26), g = el('g', { 'pointer-events': 'none' }, parent);
  if (o.wedge) el('path', { d: `M${V[0]} ${V[1]} L${angP(V, d1, r)} A${r} ${r} 0 0 0 ${angP(V, d1 + sw, r)} Z`, fill: col, opacity: .8 }, g);
  else el('path', { d: angArc(V, r, d1, d1 + sw), fill: 'none', stroke: col, 'stroke-width': 3 }, g);
  if (o.label !== false) { const m = angP(V, d1 + sw / 2, r + 18); if (deg == null) { const t = el('text', { x: m[0], y: m[1] + 7, 'text-anchor': 'middle', 'font-size': (o.fs || 15) + 3, 'font-weight': 800, fill: col }, g); t.textContent = '؟'; } else degText(g, m[0], m[1] + 6, deg, { size: o.fs || 15, color: col }); }
  return { g, d1, sw }; }
/* تدوير مثلث حول مركزه ثم تصغيره ليبقى في إطاره (الوضع غير النمطي، المراجع A لبوابة S3-U0/U1، 11) */
function rotFit(P, rot, box) { const [x0, y0, w, h] = box, cx = x0 + w / 2, cy = y0 + h / 2, r = rot * Math.PI / 180, m = P.reduce((s, p) => [s[0] + p[0] / P.length, s[1] + p[1] / P.length], [0, 0]);
  let Q = P.map(p => [(p[0] - m[0]) * Math.cos(r) - (p[1] - m[1]) * Math.sin(r), (p[0] - m[0]) * Math.sin(r) + (p[1] - m[1]) * Math.cos(r)]);
  const xs = Q.map(p => p[0]), ys = Q.map(p => p[1]), k = Math.min(1, w / (Math.max(...xs) - Math.min(...xs)), h / (Math.max(...ys) - Math.min(...ys))), ox = cx - (Math.max(...xs) + Math.min(...xs)) / 2 * k, oy = cy - (Math.max(...ys) + Math.min(...ys)) / 2 * k;
  return Q.map(p => [ox + p[0] * k, oy + p[1] * k]); }
function triDraw(parent, a, b, box, o = {}) { const [A, B, C] = o.rot ? rotFit(triFromAngles(a, b, box), o.rot, box) : triFromAngles(a, b, box), g = el('g', {}, parent), c = 180 - a - b;
  el('polygon', { points: polyStr([A, B, C]), fill: o.fill || '#fdf7e8', stroke: GEO.ink, 'stroke-width': 3, 'stroke-linejoin': 'round' }, g);
  const show = o.show || [a, b, c], cs = [[A, B, C], [B, C, A], [C, A, B]].map(([V, P, Q], i) => o.corners === false ? null : triCorner(g, V, P, Q, show[i], TRI_COL[i], { wedge: o.wedge, label: o.labels !== false }));
  if (o.names) [[A, [-14, 14]], [B, [14, 14]], [C, [0, -12]]].forEach(([p, d], i) => { const t = el('text', { x: p[0] + d[0], y: p[1] + d[1], 'text-anchor': 'middle', 'font-size': 16, 'font-weight': 800, fill: GEO.ink }, g); t.textContent = LTR[['a', 'b', 'j'][i]]; });
  return { g, P: [A, B, C], cs }; }
/* توقّعٌ بالدرجات: خياراتٌ من أخطاء حقيقية (مضاعفات 5 حتى 360، ولكلٍّ كلمته gen.deg.*) */
async function axPredictDeg(n, q, errs = []) { say(...lineOf(q), { free: true }); const np = numberPick(rankMix(n, [...errs, n - 30, n + 30].filter(v => v > 0 && v <= 360 && v % 5 === 0), 5, 360), n, { west: true, word: degw }); const a = await np.p; hush(); np.box.remove(); logAttempt({ scene: 'explore', tag: 'axPredict', ok: a === n }); return a; }
const m3Stage = (H = 250) => { const svg = newStage(H, { oasis: false, ground: 0 }); plyFrame(svg, H - 28); return svg; };
/* قطاعٌ في الأصل من الاتجاه 0 إلى sw، يُنقل ويُدار: الزاوية الممزّقة */
function wedgeAt(parent, sw, r, col) { const g = el('g', { 'pointer-events': 'none' }, parent); el('path', { d: `M0 0 L${r} 0 A${r} ${r} 0 0 0 ${angP([0, 0], sw, r)} Z`, fill: col, stroke: '#7a4a2a', 'stroke-width': 1.2, opacity: .9 }, g); return g; }
const wedgeT = (V, start) => `translate(${V[0]}px,${V[1]}px) rotate(${-start}deg)`;
async function wedgeMove(g, from, to, ms) { const an = anim(g, [{ transform: wedgeT(...from) }, { transform: wedgeT(...to) }], { duration: FAST ? 10 : ms, fill: 'forwards', easing: 'ease-in-out' }); await an.done; g.setAttribute('transform', `translate(${to[0][0]} ${to[0][1]}) rotate(${-to[1]})`); if (an.cancel) an.cancel(); }

/* ================= الإشعال: «مثلث بزاويتين قائمتين» لفوضى — الضلعان القائمان لا يلتقيان ================= */
SCENES.twoRightHook = async c => { const L = c.lines, svg = m3Stage(250), A = [100, 200], B = [260, 200], g = el('g', {}, svg);
  geoLine(g, A[0], A[1], B[0], B[1], { color: GEO.ink, w: 3.4 }); for (const P of [A, B]) { el('path', { d: `M${P[0] + (P === A ? 16 : -16)} ${P[1]} L${P[0] + (P === A ? 16 : -16)} ${P[1] - 16} L${P[0]} ${P[1] - 16}`, fill: 'none', stroke: TRI_COL[0], 'stroke-width': 2.4 }, g); }
  const up = el('g', {}, svg); geoLine(up, A[0], A[1], A[0], 130, { color: GEO.ink, w: 3.4 }); geoLine(up, B[0], B[1], B[0], 130, { color: GEO.ink, w: 3.4 });
  await S(L[0]); await axPredictYN('no', 'gen.as.pr.meet');
  const ext = el('g', {}, svg); for (const x of [A[0], B[0]]) { const l = geoLine(ext, x, 130, x, 30, { color: '#c8392d', w: 3, dash: '7 6' }); anim(l, [{ opacity: 0 }, { opacity: 1 }], { duration: 500 }); } SFX.tick();
  for (const l of L.slice(1)) await S(l); };

/* ================= الاكتشاف (أ): القصّ والتجميع — زوايا المثلث الثلاث تتجاور على مستقيم فتكوّن زاوية مستقيمة ================= */
SCENES.tearCorners = async c => { const L = c.lines, tris = c.tris || [[60, 70], [90, 35], [120, 25]];
  for (const [i, [a, b]] of tris.entries()) { const svg = m3Stage(262), T = triDraw(svg, a, b, [70, 34, 220, 112], { wedge: true, labels: i === 0 ? false : true }), P0 = [180, 218];
    geoLine(svg, 50, P0[1], 310, P0[1], { color: GEO.ink, w: 2.4, dash: '5 5' });
    await S(L[2 * i]);
    if (i === 0) await axPick3(['right', 'straight', 'full'], 'straight', 'gen.as.pr.three');
    /* الزوايا تُمزَّق من الرؤوس وتتجاور على المستقيم من الشرق: الأولى ثم الثانية ثم الثالثة */
    let start = 0; for (const [j, cs] of T.cs.entries()) { const w = wedgeAt(svg, cs.sw, 30, TRI_COL[j]); w.setAttribute('transform', `translate(${T.P[j][0]} ${T.P[j][1]}) rotate(${-cs.d1})`); T.cs[j].g.setAttribute('opacity', .25);
      await wedgeMove(w, [T.P[j], cs.d1], [P0, start], 900); start += cs.sw; SFX.tick(); }
    degText(svg, 180, P0[1] - 44, 180, { size: 20, color: ARC.ok }); geoLine(svg, 50, P0[1], 310, P0[1], { color: ARC.ok, w: 3.4 });
    await S(L[2 * i + 1]); } };
async function axPick3(set, ok, q) { say(...lineOf(q), { free: true }); const k = await choosePick(set.map(s => [s, labelText('angK.' + s), '<i></i>', 'gen.ang.k.' + s]), ok); hush(); logAttempt({ scene: 'explore', tag: 'axPredict', ok: k === ok }); return k; }

/* ================= الاكتشاف (ج): مثلث كبير وصغير بالزوايا نفسها — المجموع واحد ================= */
SCENES.sizeSum = async c => { const L = c.lines, [a, b] = c.ang || [50, 70], svg = m3Stage(250);
  triDraw(svg, a, b, [196, 40, 140, 150], { show: [a, b, 180 - a - b] }); triDraw(svg, a, b, [34, 100, 120, 100], { show: [a, b, 180 - a - b] });
  await S(L[0]); await axPredictYN('no', 'gen.as.pr.bigger');
  for (const [x, txt] of [[266, `${a} + ${b} + ${180 - a - b} = 180`], [85, `${a} + ${b} + ${180 - a - b} = 180`]]) { const t = el('text', { x, y: 226, 'text-anchor': 'middle', 'font-size': 14, 'font-weight': 800, fill: ARC.ok, direction: 'ltr' }, svg); t.textContent = txt; }
  SFX.tick(); for (const l of L.slice(1)) await S(l); };

/* ================= مثال محلول: الزاوية المجهولة بالطرح من 180 ================= */
SCENES.missingShow = async c => { const L = c.lines, [a, b] = c.ang || [90, 35], w = 180 - a - b, svg = m3Stage(262), T = triDraw(svg, a, b, [80, 30, 200, 130], { show: [a, b, null] });
  await S(L[0]); const lines = [`180 − ${a} = ${180 - a}`, `${180 - a} − ${b} = ؟`];
  for (const [i, s] of lines.entries()) { const t = el('text', { x: 180, y: 196 + i * 28, 'text-anchor': 'middle', 'font-size': 19, 'font-weight': 800, fill: css('--think'), direction: 'ltr' }, svg); t.textContent = s; SFX.tick(); await sleep(FAST ? 10 : 500); }
  await axPredictDeg(w, 'gen.as.pr.missing', [180 - a, a + b, 360 - a - b]); T.cs[2].g.remove(); triCorner(T.g, T.P[2], T.P[0], T.P[1], w, ARC.ok);
  for (const l of L.slice(1)) await S(l); };

/* ================= ① الزاوية المجهولة في مثلث (C301): a وb زاويتان معلومتان، والثالثة «؟» ================= */
ITEM.triMissing = { ...numItem,
  make(spec) { const want = 180 - spec.a - spec.b; /*T*/if (TESTHOOK && (want <= 0 || [spec.a, spec.b].some(v => v % 5))) testBug('triMissing: زوايا غير صالحة');/*/T*/
    return { ...spec, want, nums: rankMix(want, [180 - spec.a, 180 - spec.b, spec.a + spec.b, 360 - spec.a - spec.b].filter(v => v > 0 && v < 360 && v !== want), 0, 355), tag: 'tri-missing' }; },
  async ask(item, mode, tries) { const svg = m3Stage(250), T = triDraw(svg, item.a, item.b, [70, 30, 220, 160], { show: [item.a, item.b, null] });
    if (tries >= 3) { const m = helpG(svg), t = el('text', { x: 180, y: 222, 'text-anchor': 'middle', 'font-size': 18, 'font-weight': 800, fill: css('--think'), direction: 'ltr' }, m); t.textContent = `180 − ${item.a} − ${item.b} = ؟`; await S('gen.as.together.missing'); }
    else await S(item.q || 'gen.as.q.missing');
    const np = numberPick(shuffle(item.nums), item.want, { west: true, word: degw }); return { ans: await np.p, ctx: { svg, np, T } }; },
  judge(item, k) { if (k === item.want) return { ok: true }; return { ok: false, err: k === 180 - item.a || k === 180 - item.b ? 'sumForgot' : k === item.a + item.b ? 'sumAdded' : k === 360 - item.a - item.b ? 'sum360' : 'sumOff' }; },
  async hint2(item, r) { if (r && r.ctx && r.ctx.svg) hintCard(r.ctx.svg, 180, 222, `${item.a} + ${item.b} + ؟ = 180`); await S('gen.as.hint.missing'); }, async together() {},
  async reveal(item, r) { if (r && r.ctx && r.ctx.T) { r.ctx.T.cs[2].g.remove(); triCorner(r.ctx.T.g, r.ctx.T.P[2], r.ctx.T.P[0], r.ctx.T.P[1], item.want, ARC.ok); } await S('gen.as.reveal.missing', { noGap: true }); await S(degw(item.want), { append: true }); },
  praise: () => 'praiseThink', twin(item) { return item.twin || null; },
};
/* ================= ② هل تكون هذه زوايا مثلث؟ (C301): degs ثلاث زوايا تُرسم قطاعاتٍ منفصلة، والجواب بمجموعها ================= */
ITEM.triPossible = {
  make(spec) { const s = spec.degs.reduce((x, y) => x + y, 0), T = spec.tess || spec.degs.length === 4 ? 360 : 180, tol = spec.tol || 0; return { ...spec, sum: s, T, sfx: spec.tess ? 'T' : tol ? 'M' : T === 360 ? 'Q' : '', want: Math.abs(s - T) <= tol ? 'yes' : 'no', tag: spec.tess ? 'tess-fit' : tol ? 'tri-measure' : spec.degs.length === 4 ? 'quad-possible' : 'tri-possible' }; },   /* tol: قياسٌ بالمنقلة يُقبل إن قرب من 180 (المراجع A لبوابة S3-U0/U1، 10) */   /* tess: زوايا حول رأس واحد في البلاط (C339) */
  async ask(item, mode, tries) { const svg = m3Stage(240), n = item.degs.length, xs = n === 3 ? [290, 180, 70] : Array.from({ length: n }, (_, i) => 318 - i * (276 / Math.max(1, n - 1))), g = el('g', {}, svg);
    item.degs.forEach((d, i) => { const V = [xs[i] - (d > 90 ? 0 : 20), 140]; const w = wedgeAt(g, d, n >= 5 ? 22 : n === 4 ? 34 : 44, POLY_COL[i % POLY_COL.length]); w.setAttribute('transform', `translate(${V[0]} ${V[1]})`); degText(g, xs[i], 190, d, { size: n >= 5 ? 13 : 16, color: POLY_COL[i % POLY_COL.length] }); });
    if (tries >= 3) { const m = helpG(svg), t = el('text', { x: 180, y: 40, 'text-anchor': 'middle', 'font-size': 18, 'font-weight': 800, fill: css('--think'), direction: 'ltr' }, m); t.textContent = `${item.degs.join(' + ')} = ؟`; await S(item.sfx === 'T' ? 'gen.as.together.possT' : item.sfx === 'Q' ? 'gen.as.together.possQ' : item.sfx === 'M' ? 'gen.as.together.possM' : 'gen.as.together.possTri'); }
    else await S(item.q || (item.sfx === 'T' ? 'gen.as.q.possT' : item.sfx === 'Q' ? 'gen.as.q.possQ' : item.sfx === 'M' ? 'gen.as.q.possM' : 'gen.as.q.possTri'));
    const k = await choosePick([['yes', labelText('yes'), PICKICON.yes, 'gen.opt.yes'], ['no', labelText('no'), PICKICON.no, 'gen.opt.no']], item.want); return { ans: k, ctx: { svg } }; },
  judge(item, k) { if (k === item.want) return { ok: true }; return { ok: false, err: item.tess ? (item.want === 'no' ? 'tessAny' : 'tessMissed') : item.tol ? 'measTol' : item.T === 180 && item.want === 'no' && item.degs.filter(d => d >= 90).length >= 2 ? 'twoBig' : item.T === 360 ? 'sumNot360' : 'sumNot180' }; },
  onOk() { SFX.good(); }, onWrong() { SFX.soft(); },
  async hint2(item, r) { if (r && r.ctx && r.ctx.svg) hintCard(r.ctx.svg, 180, 40, labelText(item.T === 360 ? 'asSum360' : 'asSum180')); await S(item.sfx === 'T' ? 'gen.as.hint.possT' : item.sfx === 'Q' ? 'gen.as.hint.possQ' : item.sfx === 'M' ? 'gen.as.hint.possM' : 'gen.as.hint.possTri'); }, async together() {},
  async reveal(item, r) { if (r && r.ctx && r.ctx.svg) { const t = el('text', { x: 180, y: 40, 'text-anchor': 'middle', 'font-size': 18, 'font-weight': 800, fill: item.want === 'yes' ? ARC.ok : '#c8392d', direction: 'ltr' }, r.ctx.svg); t.textContent = `${item.degs.join(' + ')} = ${item.sum}`; } await S((item.want === 'yes' ? 'gen.as.reveal.possYes' : 'gen.as.reveal.possNo') + item.sfx); },
  praise: () => 'praiseThink', twin(item) { return item.twin || null; },
};
/* ================= الختام ================= */
/* الاكتشاف (ب) د1: قياسٌ بالمنقلة يخطئ درجة أو درجتين، فالمجموع قريب من 180، والقصّ هو الحَكَم (المراجع A لبوابة S3-U0/U1، 10) */
SCENES.protCheck = async c => { const L = c.lines, [a, b] = c.ang || [62, 48], read = c.read || [62, 47, 69], svg = m3Stage(262), box = [120, 60, 200, 120];
  const T = triDraw(svg, a, b, box, { labels: false }), P = protAt(svg, T.P[0], 0, { R: 108, step: 20 }); P.mark(a); P.top(); await S(L[0]);
  P.g.remove(); P.lab.remove(); T.g.remove(); triDraw(svg, a, b, box, { show: read }); SFX.tick();
  await axPredictYN('no', 'gen.as.pr.meas'); const t = el('text', { x: 180, y: 232, 'text-anchor': 'middle', 'font-size': 20, 'font-weight': 800, fill: css('--think'), direction: 'ltr' }, svg);
  t.textContent = `${read.join(' + ')} = ${read.reduce((x, y) => x + y, 0)}`; SFX.tick(); await S(L[1]);
  for (const l of L.slice(2)) await S(l); };
SCENES.asRecap = async c => { const L = c.lines, svg = m3Stage(250); WRAP_ART.triSum(svg); await S(L[0]);
  const s2 = m3Stage(250); polyDraw(s2, quadFromAngles([40, 50, 60, 210]), [90, 40, 180, 150], { arcs: true, arcCol: (q, sw) => sw > 180 ? '#c8392d' : '#4f9a6a' }); SFX.tick(); await S(L[1]);
  for (const l of L.slice(2)) await S(l); };
WRAP_ART.triSum = svg => { const T = triDraw(svg, 60, 70, [110, 40, 140, 100], { wedge: true, labels: false }); const P0 = [180, 196]; geoLine(svg, 90, P0[1], 270, P0[1], { color: GEO.ink, w: 2.4 }); let s = 0; [60, 70, 50].forEach((d, j) => { const w = wedgeAt(svg, d, 30, TRI_COL[j]); w.setAttribute('transform', `translate(${P0[0]} ${P0[1]}) rotate(${-s})`); s += d; }); };

/* =====================================================================
   د2: المحدّب والمقعّر (C161) ومجموع زوايا الرباعي 360 (C302)، والمقعّر بزاويته المنعكسة (360 − س)
   الأشكال بإحداثيات رياضية (ص إلى أعلى) ورؤوسٌ عكس عقارب الساعة، فالداخل يسار المسير
   ===================================================================== */
const POLY_COL = ['#e9894a', '#3d7cc0', '#4f9a6a', '#8e6bbf', '#c8392d', '#b9862a'];
const M3_SH = { hexI: [[0, 0], [3, -0.4], [4.4, 1.2], [3.6, 2.8], [1, 3.2], [-0.6, 1.6]], dent5: [[0, 0], [3.6, 0.4], [2.6, 1.7], [3.4, 3.2], [0.2, 2.8]],
  bolt: [[0, 0], [2.4, 0.2], [1.5, 1.4], [3.2, 1.6], [0.6, 3.6], [1.3, 2], [-0.4, 1.8]], crown: [[0, 0], [4, 0], [4, 3], [3, 1.6], [2, 3], [1, 1.6], [0, 3]],
  triO: [[0, 0], [3, 0], [4.6, 2.2]], triR: [[0, 0], [4, 0], [4, 3]], tri: [[0, 0], [4, 0], [1.6, 3]], hex: [0, 1, 2, 3, 4, 5].map(i => [Math.cos(i * Math.PI / 3) * 2, Math.sin(i * Math.PI / 3) * 2]), sq: [[0, 0], [3, 0], [3, 3], [0, 3]],
  arrow: [[0, 0], [4, 1.6], [0, 3.2], [1.3, 1.6]], ell: [[0, 0], [3, 0], [3, 1], [1, 1], [1, 3], [0, 3]], kite: [[0, 0], [2, -1.2], [4, 0], [2, 2.6]], dart: [[0, 0], [2, 1], [4, 0], [2, 3]], gen: [[0, 0], [4, 0], [3.4, 2.6], [0.6, 2]], para: [[0, 0], [3.4, 0], [4.4, 2], [1, 2]], chev: [[0, 0], [2, 1.2], [4, 0], [4, 1.6], [2, 2.8], [0, 1.6]],
  trap: [[0, 0], [4, 0], [3, 2], [1, 2]], pent: [[0, 0], [3, 0], [3.8, 1.8], [1.5, 3], [-0.8, 1.8]], notch: [[0, 0], [4, 0], [4, 3], [2, 1.5], [0, 3]], boom: [[0, 0], [3.5, 0.6], [1.2, 1.2], [0.6, 3.4]],
  zig: [[0, 0], [4, 0], [4, 2], [2.5, 1], [1.5, 2.5], [0, 1.5]], house: [[0, 0], [3, 0], [3, 2], [1.5, 3.2], [0, 2]], arrow6: [[0, 0], [3, 0], [3, 1.2], [4.4, 1.2], [1.5, 3.2], [-1.2, 1.2]], oct: [0, 1, 2, 3, 4, 5, 6, 7].map(i => [Math.cos((i + .5) * Math.PI / 4) * 2, Math.sin((i + .5) * Math.PI / 4) * 2]) };
/* زوايا داخلية بالدرجات لرؤوسٍ عكس عقارب الساعة */
const polyAng = pts => pts.map((V, i) => { const P = pts[(i + pts.length - 1) % pts.length], N = pts[(i + 1) % pts.length], d1 = Math.atan2(N[1] - V[1], N[0] - V[0]), d2 = Math.atan2(P[1] - V[1], P[0] - V[0]); return ((d2 - d1) * 180 / Math.PI % 360 + 360) % 360; });
/* رباعي بزواياه الأربع (مجموعها 360) وضلعين أوّلين: يُغلق بالضلعين الباقيين */
function quadFromAngles(degs) { const r = Math.PI / 180; for (const s2 of [1, .8, 1.2, .6, 1.5, .45]) { let h = 0; const A = [0, 0], B = [1, 0]; h += 180 - degs[1]; const C = [B[0] + s2 * Math.cos(h * r), B[1] + s2 * Math.sin(h * r)]; h += 180 - degs[2]; const u = [Math.cos(h * r), Math.sin(h * r)]; const h3 = h + 180 - degs[3], v = [Math.cos(h3 * r), Math.sin(h3 * r)];
    /* C + s3·u + s4·v = A */ const det = u[0] * v[1] - u[1] * v[0]; if (Math.abs(det) < 1e-6) continue; const rx = A[0] - C[0], ry = A[1] - C[1], s3 = (rx * v[1] - ry * v[0]) / det, s4 = (u[0] * ry - u[1] * rx) / det; if (s3 > .25 && s4 > .25) return [A, B, C, [C[0] + s3 * u[0], C[1] + s3 * u[1]]]; }
  return null; }
function polyDraw(parent, pts, box, o = {}) { const xs = pts.map(p => p[0]), ys = pts.map(p => p[1]), [x0, y0, w, h] = box, k = Math.min(w / (Math.max(...xs) - Math.min(...xs)), h / (Math.max(...ys) - Math.min(...ys)));
  const ox = x0 + (w - (Math.max(...xs) - Math.min(...xs)) * k) / 2 - Math.min(...xs) * k, oy = y0 + (h - (Math.max(...ys) - Math.min(...ys)) * k) / 2 + Math.max(...ys) * k, S2 = pts.map(p => [ox + p[0] * k, oy - p[1] * k]);
  const g = el('g', {}, parent); el('polygon', { points: polyStr(S2), fill: o.fill || '#fdf7e8', stroke: GEO.ink, 'stroke-width': 3, 'stroke-linejoin': 'round' }, g); const ang = polyAng(pts), cs = [];
  if (o.arcs) S2.forEach((V, i) => { const N = S2[(i + 1) % S2.length], d1 = dirOf(V, N), sw = ang[i], r = sw > 180 ? 16 : 22, big = sw > 180 ? 1 : 0, col = o.arcCol ? o.arcCol(i, sw) : POLY_COL[i % POLY_COL.length], cg = el('g', { 'pointer-events': 'none' }, g);
    el('path', { d: `M${angP(V, d1, r)} A${r} ${r} 0 ${big} 0 ${angP(V, d1 + sw, r)}`, fill: 'none', stroke: col, 'stroke-width': sw > 180 ? 4 : 3 }, cg);
    const show = o.show ? o.show[i] : Math.round(sw / 5) * 5; if (o.labels) { const m = angP(V, d1 + sw / 2, r + (sw > 180 ? 16 : 18)); if (show == null) { const t = el('text', { x: m[0], y: m[1] + 7, 'text-anchor': 'middle', 'font-size': 18, 'font-weight': 800, fill: col }, cg); t.textContent = '؟'; } else if (show !== false) degText(cg, m[0], m[1] + 6, show, { size: 14, color: col }); }
    cs.push({ g: cg, V, d1, sw }); });
  return { g, P: S2, ang, cs }; }
const isConvex = pts => polyAng(pts).every(a => a < 180);

/* ================= الإشعال: «رأس سهم» لفوضى — «زواياه كلها أقل من نصف دورة!» ================= */
SCENES.arrowHook = async c => { const L = c.lines, svg = m3Stage(250), D = polyDraw(svg, M3_SH.arrow, [80, 40, 200, 170]);
  await S(L[0]); await axPredictYN('no', 'gen.as.pr.allSmall');
  const i = D.ang.findIndex(a => a > 180), V = D.P[i], N = D.P[(i + 1) % D.P.length], d1 = dirOf(V, N), sw = D.ang[i]; el('path', { d: `M${angP(V, d1, 26)} A26 26 0 1 0 ${angP(V, d1 + sw, 26)}`, fill: 'none', stroke: '#c8392d', 'stroke-width': 4 }, svg); SFX.tick();
  for (const l of L.slice(1)) await S(l); };
/* ================= الجزء أ: قوس داخل الشكل عند كل رأس — المحدّب كل زواياه أقل من 180، والمقعّر فيه منعكسة ================= */
SCENES.convexShow = async c => { const L = c.lines, ks = c.polys || ['tri', 'hex', 'arrow', 'ell'];
  for (const [i, pair] of [ks.slice(0, 2), ks.slice(2, 4)].entries()) { const svg = m3Stage(250), bare = pair.map((k, j) => polyDraw(svg, M3_SH[k], [j ? 30 : 196, 50, 134, 140], {}));   /* توقّعٌ قبل الأقواس (المراجع A لبوابة S3-U0/U1، 15) */
    await axPredictYN(pair.some(k => !isConvex(M3_SH[k])) ? 'yes' : 'no', 'gen.as.pr.dent'); bare.forEach(D => D.g.remove());
    pair.forEach((k, j) => { const D = polyDraw(svg, M3_SH[k], [j ? 30 : 196, 50, 134, 140], { arcs: true, arcCol: (q, sw) => sw > 180 ? '#c8392d' : '#4f9a6a' }); const t = el('text', { x: j ? 97 : 263, y: 224, 'text-anchor': 'middle', 'font-size': 16, 'font-weight': 800, fill: isConvex(M3_SH[k]) ? '#4f9a6a' : '#c8392d' }, svg); t.textContent = labelText(isConvex(M3_SH[k]) ? 'asConvex' : 'asConcave'); });
    SFX.tick(); await S(L[i]); }
  for (const l of L.slice(2)) await S(l); };
/* ================= الجزء ب: القطر يقسّم الرباعي مثلثين — 2 × 180 = 360 ================= */
SCENES.quadSplit = async c => { const L = c.lines, degs = c.degs || [85, 95, 110, 70], pts = quadFromAngles(degs), svg = m3Stage(262), D = polyDraw(svg, pts, [70, 30, 220, 140], { arcs: true, labels: true, show: degs });
  await S(L[0]); await axPredictDeg(360, 'gen.as.pr.quadSum', [180, 270, 720]);
  geoLine(svg, D.P[0][0], D.P[0][1], D.P[2][0], D.P[2][1], { color: '#8e6bbf', w: 3, dash: '7 5' }); el('polygon', { points: polyStr([D.P[0], D.P[1], D.P[2]]), fill: '#f2d38a', opacity: .45, 'pointer-events': 'none' }, svg); el('polygon', { points: polyStr([D.P[0], D.P[2], D.P[3]]), fill: '#bfe0b5', opacity: .45, 'pointer-events': 'none' }, svg); SFX.tick();
  await S(L[1]); const t = el('text', { x: 180, y: 214, 'text-anchor': 'middle', 'font-size': 20, 'font-weight': 800, fill: ARC.ok, direction: 'ltr' }, svg); t.textContent = '180 + 180 = 360'; SFX.tick();
  for (const l of L.slice(2)) await S(l); };
/* ================= الجزء ج: الرباعي المقعّر — المنقلة تقرأ الجهة الخارجية (150)، والداخلية 360 − 150 ================= */
SCENES.concaveSum = async c => { const L = c.lines, degs = c.degs || [40, 50, 60, 210], pts = quadFromAngles(degs), svg = m3Stage(262), D = polyDraw(svg, pts, [60, 30, 240, 150], { arcs: true, labels: true, show: [degs[0], degs[1], degs[2], null] }), i = 3, V = D.P[i];
  const P = D.P[2], N = D.P[0], out = 360 - degs[3]; el('path', { d: angArc(V, 34, dirOf(V, P), dirOf(V, P) + out), fill: 'none', stroke: '#8a9aa8', 'stroke-width': 2.6, 'stroke-dasharray': '4 3' }, svg); const m = angP(V, dirOf(V, P) + out / 2, 50); degText(svg, m[0], m[1] + 6, out, { size: 15, color: '#6b7b88' });
  await S(L[0]); await axPredictDeg(degs[3], 'gen.as.pr.inner', [360 - degs[3], 180 - (360 - degs[3]), 180]);
  D.cs[i].g.remove(); polyDraw(svg, pts, [60, 30, 240, 150], { arcs: true, labels: true, show: degs, fill: 'none' }); SFX.tick();
  await S(L[1]); geoLine(svg, D.P[1][0], D.P[1][1], D.P[3][0], D.P[3][1], { color: '#4f9a6a', w: 3, dash: '7 5' }); geoLine(svg, D.P[0][0], D.P[0][1], D.P[2][0], D.P[2][1], { color: '#c8392d', w: 2.4, dash: '3 5' }); SFX.tick();
  for (const l of L.slice(2)) await S(l); };

/* ================= ③ محدّب أم مقعّر؟ (C161): k شكل من M3_SH ================= */
ITEM.convexPick = {
  make(spec) { return { ...spec, want: isConvex(M3_SH[spec.k]) ? 'convex' : 'concave', tag: 'convex-pick' }; },
  async ask(item, mode, tries) { const svg = m3Stage(236), D = polyDraw(svg, M3_SH[item.k], [70, 34, 220, 160], { arcs: tries >= 3, arcCol: (q, sw) => css('--think') });
    await S(tries >= 3 ? 'gen.as.together.convex' : item.q || 'gen.as.q.convex');
    const k = await choosePick([['convex', labelText('asConvex'), '<i></i>', 'gen.as.convex'], ['concave', labelText('asConcave'), '<i></i>', 'gen.as.concave']], item.want); return { ans: k, ctx: { svg, D } }; },
  judge(item, k) { return k === item.want ? { ok: true } : { ok: false, err: item.want === 'concave' ? 'dentMissed' : 'dentFalse' }; },
  onOk() { SFX.good(); }, onWrong() { SFX.soft(); },
  async hint2(item, r) { if (r && r.ctx && r.ctx.svg) hintCard(r.ctx.svg, 180, 216, labelText('asHintConvex')); await S('gen.as.hint.convex'); }, async together() {},
  async reveal(item, r) { if (r && r.ctx) { r.ctx.D.g.remove(); polyDraw(r.ctx.svg, M3_SH[item.k], [70, 34, 220, 160], { arcs: true, arcCol: (q, sw) => sw > 180 ? '#c8392d' : '#4f9a6a' }); } await S(item.want === 'convex' ? 'gen.as.reveal.convex' : 'gen.as.reveal.concave'); },
  praise: () => 'praiseThink', twin(item) { return item.twin || null; },
};
/* ================= ④ الزاوية الرابعة في رباعي (C302): degs الثلاث المعلومة، والرابعة 360 − مجموعها (منعكسة في المقعّر) ================= */
ITEM.quadMissing = { ...numItem,
  make(spec) { const s = spec.degs.reduce((a, b) => a + b, 0), want = 360 - s; /*T*/if (TESTHOOK && (want <= 0 || want >= 360 || !quadFromAngles([...spec.degs, want]))) testBug('quadMissing: رباعي لا يُرسم');/*/T*/
    const [a, b, c] = spec.degs; return { ...spec, want, nums: rankMix(want, [360 - a - b, 360 - b - c, 360 - a - c, s, 180 - s].filter(v => v > 0 && v < 360 && v % 5 === 0 && v !== want), 0, 355), tag: 'quad-missing' + (want > 180 ? '-rfx' : '') }; },
  async ask(item, mode, tries) { const degs = [...item.degs, item.want], svg = m3Stage(250), D = polyDraw(svg, quadFromAngles(degs), [70, 30, 220, 160], { arcs: true, labels: true, show: [...item.degs, null] });
    if (tries >= 3) { const m = helpG(svg), t = el('text', { x: 180, y: 222, 'text-anchor': 'middle', 'font-size': 18, 'font-weight': 800, fill: css('--think'), direction: 'ltr' }, m); t.textContent = `360 − ${item.degs.join(' − ')} = ؟`; await S('gen.as.together.quad'); }
    else await S(item.q || 'gen.as.q.missing');
    const np = numberPick(shuffle(item.nums), item.want, { west: true, word: degw }); return { ans: await np.p, ctx: { svg, np, D } }; },
  judge(item, k) { if (k === item.want) return { ok: true }; const s = item.degs.reduce((a, b) => a + b, 0); return { ok: false, err: k === 180 - s ? 'quad180' : k === s ? 'sumAdded' : 'quadForgot' }; },   /* quad180: طرحٌ من 180 بدل 360 */
  async hint2(item, r) { if (r && r.ctx && r.ctx.svg) hintCard(r.ctx.svg, 180, 222, `${item.degs.join(' + ')} + ؟ = 360`); await S('gen.as.hint.quad'); }, async together() {},
  async reveal(item, r) { if (r && r.ctx && r.ctx.D) { const c = r.ctx.D.cs[3]; c.g.remove(); } await S('gen.as.reveal.missing', { noGap: true }); await S(degw(item.want), { append: true }); },
  praise: () => 'praiseThink', twin(item) { return item.twin || null; },
};
WRAP_ART.quadSum = svg => { const D = polyDraw(svg, quadFromAngles([85, 95, 110, 70]), [100, 40, 160, 150], { arcs: true }); geoLine(svg, D.P[0][0], D.P[0][1], D.P[2][0], D.P[2][1], { color: '#8e6bbf', w: 3, dash: '7 5' }); };

/* =====================================================================
   د3: تعميق (لا مثلث مقعّر، ومنعكسة واحدة على الأكثر في الرباعي)، والتبليط بالمضلّعات المنتظمة (C339)
   ===================================================================== */
/* ================= ⑤ ممكن أم مستحيل؟ (C301، C302، C161): cl عبارة من CLAIMS، ورسمها رمزٌ لا يكشف الجواب ================= */
const CLAIMS = { tri2obt: ['tri', 0], tri2right: ['tri', 0], triConcave: ['tri', 0], quad2rfx: ['quad', 0], quad4obt: ['quad', 0], tri1obt: ['tri', 1], triRight: ['tri', 1], quad1rfx: ['quad', 1], quad3obt: ['quad', 1], quad4right: ['quad', 1] };
ITEM.claimJudge = {
  make(spec) { const [pic, ok] = CLAIMS[spec.cl]; return { ...spec, pic, want: ok ? 'yes' : 'no', tag: 'claim-' + (ok ? 'yes' : 'no') }; },
  async ask(item, mode, tries) { const svg = m3Stage(230), g = el('g', {}, svg);
    el('rect', { x: 40, y: 40, width: 280, height: 150, rx: 14, fill: '#fffdf6', stroke: css('--line'), 'stroke-width': 2 }, g);
    el('path', { d: item.pic === 'tri' ? 'M150 112 L210 112 L186 64 Z' : 'M146 112 L214 112 L204 70 L156 78 Z', fill: '#fdf7e8', stroke: GEO.ink, 'stroke-width': 2.4, 'stroke-linejoin': 'round' }, g);
    const t = el('text', { x: 180, y: 158, 'text-anchor': 'middle', 'font-size': 17, 'font-weight': 800, fill: GEO.ink, direction: 'rtl' }, g); t.textContent = labelText('asC.' + item.cl);
    if (tries >= 3) { const m = helpG(svg), h = el('text', { x: 180, y: 216, 'text-anchor': 'middle', 'font-size': 15, 'font-weight': 800, fill: css('--think'), direction: 'rtl' }, m); h.textContent = labelText('asM.' + item.cl); await S('gen.as.together.claim'); }   /* الحلّ المشترك: أصغر ما تكون عليه زوايا العبارة، خطوةٌ بعد المستوى الثاني (المراجع A لبوابة S3-U0/U1، 23) */
    else { await S(item.q || 'gen.as.q.claim', { noGap: true }); await S('gen.as.c.' + item.cl, { append: true }); }
    const k = await choosePick([['yes', labelText('asPossible'), PICKICON.yes, 'gen.as.possible'], ['no', labelText('asImpossible'), PICKICON.no, 'gen.as.impossible']], item.want); return { ans: k, ctx: { svg } }; },
  judge(item, k) { return k === item.want ? { ok: true } : { ok: false, err: item.want === 'no' ? 'claimYes' : 'claimNo' }; },
  onOk() { SFX.good(); }, onWrong() { SFX.soft(); },
  async hint2(item, r) { if (r && r.ctx && r.ctx.svg) hintCard(r.ctx.svg, 180, 216, labelText(item.pic === 'tri' ? 'asSum180' : 'asSum360')); await S('gen.as.hint.claim'); }, async together() {},
  async reveal(item) { await S('gen.as.why.' + item.cl); },
  praise: () => 'praiseThink', twin(item) { return item.twin || null; },
};
/* ================= الإشعال: «مثلث مقعّر» لفوضى ================= */
SCENES.concaveTriHook = async c => { const L = c.lines, svg = m3Stage(250), g = el('g', {}, svg);
  el('path', { d: 'M90 200 L270 200 L180 150 L200 70 Z', fill: '#fdf7e8', stroke: GEO.ink, 'stroke-width': 3, 'stroke-linejoin': 'round' }, g);   /* شكلٌ منبعج تسمّيه فوضى «مثلثاً» */
  await S(L[0]); await axPredictNum(4, 'gen.as.pr.sides');
  [[90, 200], [270, 200], [180, 150], [200, 70]].forEach(([x, y], i) => { badge(g, x, y - (i === 2 ? -16 : 16), i + 1, css('--think')); }); SFX.tick();
  for (const l of L.slice(1)) await S(l); };
/* ================= التبليط: نسخ مضلّع منتظم حول رأس واحد — تكمل الدورة أم يبقى فراغ؟ ================= */
const regPoly = (V, n, s, rot) => { const P = [V], ext = 360 / n; let p = V, h = rot; for (let i = 0; i < n - 1; i++) { p = angP(p, h, s); P.push(p); h += ext; } return P; };
SCENES.tessShow = async c => { const L = c.lines, rounds = c.rounds || [[3, 6], [4, 4], [6, 3], [5, 3]];
  for (const [ri, [n, cnt]] of rounds.entries()) { const svg = m3Stage(262), V = [180, 132], s = n === 3 ? 62 : n === 4 ? 56 : n === 6 ? 46 : 52, ang = 180 - 360 / n, g = el('g', {}, svg);
    el('circle', { cx: V[0], cy: V[1], r: 5, fill: '#c8392d' }, svg);
    await S(L[2 * ri]);
    if (n === 5) await axPredictYN('no', 'gen.as.pr.pentTile'); else await axPredictNum(cnt, 'gen.as.pr.tessCount');
    let rot = 0; const total = n === 5 ? 4 : cnt; for (let k = 0; k < total; k++) { const over = n === 5 && k === 3, P = regPoly(V, n, s, rot);
      const pg = el('polygon', { points: polyStr(P), fill: over ? '#f6b8b0' : POLY_COL[k % POLY_COL.length], 'fill-opacity': over ? .55 : .55, stroke: over ? '#c8392d' : GEO.ink, 'stroke-width': 2, 'stroke-dasharray': over ? '5 4' : null }, g);
      anim(pg, [{ opacity: 0 }, { opacity: 1 }], { duration: 300 }); SFX.tick(); await sleep(FAST ? 10 : 350); rot += ang; }
    if (n === 5) { const gap = el('path', { d: `M${V[0]} ${V[1]} L${angP(V, 3 * ang, 40)} A40 40 0 0 0 ${angP(V, 360, 40)} Z`, fill: '#c8392d', opacity: .35 }, svg); }
    const t = el('text', { x: 180, y: 240, 'text-anchor': 'middle', 'font-size': 18, 'font-weight': 800, fill: n === 5 ? '#c8392d' : ARC.ok, direction: 'ltr' }, svg); t.textContent = n === 5 ? '108 × 3 = 324 · 108 × 4 = 432' : `${ang} × ${cnt} = 360`;
    await S(L[2 * ri + 1]); }
  for (const l of L.slice(2 * rounds.length)) await S(l); };
WRAP_ART.tessArt = svg => { const V = [180, 130]; for (let k = 0; k < 3; k++) el('polygon', { points: polyStr(regPoly(V, 6, 46, k * 120)), fill: ['#f2d38a', '#bfe0b5', '#c9dcf2'][k], stroke: GEO.ink, 'stroke-width': 2 }, svg); el('circle', { cx: V[0], cy: V[1], r: 5, fill: '#c8392d' }, svg); };

/* =====================================================================
   د4: زاويتا القاعدة في المتساوي الساقين (C330)، و«أقنعني بسببين»، ومشروع «الزاوية الناقصة»
   ===================================================================== */
/* مثلث متساوي الساقين رأسه أعلى: زاوية الرأس apex، وعلامتا التساوي على الساقين */
/* show لكل رأس: عدد، أو null («؟»)، أو 'arc' (قوس بلا رقم)؛ وزاويتا القاعدة بلون واحد لأنهما متساويتان */
function isoDraw(parent, apex, box, show, rot = 0) { const b = (180 - apex) / 2, T = triDraw(parent, b, b, box, { corners: false, rot }); const [A, B, C] = T.P;
  T.cs = [[A, B, C, 0], [B, C, A, 0], [C, A, B, 2]].map(([V, P, Q, k], i) => triCorner(T.g, V, P, Q, show[i], TRI_COL[k], { label: show[i] !== 'arc' }));
  for (const [P, Q] of [[A, C], [B, C]]) { const m = [(P[0] + Q[0]) / 2, (P[1] + Q[1]) / 2], d = dirOf(P, Q) + 90, a1 = angP(m, d, 7), a2 = angP(m, d + 180, 7); geoLine(T.g, a1[0], a1[1], a2[0], a2[1], { color: GEO.ink, w: 2.4 }); }
  return T; }
/* ================= ⑥ زوايا المتساوي الساقين (C330): ask base (الرأس معلوم) أو apex (زاوية القاعدة معلومة) ================= */
ITEM.isoAngle = { ...numItem,
  make(spec) { const apex = spec.ask === 'base' ? spec.apex : 180 - 2 * spec.base, base = (180 - apex) / 2; /*T*/if (TESTHOOK && (base % 5 || apex <= 0)) testBug('isoAngle: زوايا غير صالحة');/*/T*/
    const want = spec.ask === 'base' ? base : apex, ok = v => v > 0 && v < 360 && v % 5 === 0 && v !== want, real = [...new Set((spec.ask === 'base' ? [180 - apex, 90, apex] : [180 - base, base]).filter(ok))], errs = real.length >= 2 ? real : [...real, want - 10, want + 10, want + 20];   /* الأخطاء الحقيقية أولاً، و±10 احتياطاً (المراجع A لبوابة S3-U0/U1، 12) */   /* أخطاء المرجع: بلا قسمة، و180 ÷ 2، والمتساويتان عند الرأس، وقاعدة واحدة */
    return { ...spec, apex, base, want, nums: rankMix(want, errs.filter(v => v > 0 && v < 360 && v % 5 === 0 && v !== want), 5, 355), tag: 'iso-' + spec.ask }; },
  async ask(item, mode, tries) { const svg = m3Stage(250), T = isoDraw(svg, item.apex, [80, 30, 200, 160], item.ask === 'base' ? [null, null, item.apex] : [item.base, 'arc', null], item.rot || 0);
    if (tries >= 3) { const m = helpG(svg), t = el('text', { x: 180, y: 222, 'text-anchor': 'middle', 'font-size': 18, 'font-weight': 800, fill: css('--think'), direction: 'ltr' }, m); t.textContent = item.ask === 'base' ? `(180 − ${item.apex}) ÷ 2 = ؟` : `180 − ${item.base} − ${item.base} = ؟`; await S('gen.as.together.iso'); }
    else await S(item.q || (item.ask === 'base' ? 'gen.as.q.isoBase' : 'gen.as.q.isoApex'));
    const np = numberPick(shuffle(item.nums), item.want, { west: true, word: degw }); return { ans: await np.p, ctx: { svg, np, T } }; },
  judge(item, k) { if (k === item.want) return { ok: true }; return { ok: false, err: item.ask === 'base' ? (k === 180 - item.apex ? 'isoNoHalf' : k === 90 ? 'isoHalfAll' : k === item.apex ? 'isoAtApex' : 'isoOff') : (k === 180 - item.base ? 'isoOneBase' : 'isoOff') }; },
  async hint2(item, r) { if (r && r.ctx && r.ctx.svg) hintCard(r.ctx.svg, 180, 222, labelText('asIsoHint')); await S('gen.as.hint.iso'); }, async together() {},
  async reveal(item) { await S('gen.as.reveal.missing', { noGap: true }); await S(degw(item.want), { append: true }); },
  praise: () => 'praiseThink', twin(item) { return item.twin || null; },
};
/* ================= ⑦ «أقنعني بسببين» (D244): ثلاث بطاقات، اثنتان صحيحتان؛ يلمس الطفل اثنتين ثم «تمّ» ================= */
ITEM.twoReasons = {
  make(spec) { return { ...spec, want: 'ab', tag: 'two-reasons' }; },
  async ask(item, mode, tries) { newStage(24, null); const ids = item.opts.map(o => o.id);   /* بلا رسم: ثلاث بطاقات وزرّ «تمّ» تحتاج المسرح كلّه */ await S(tries >= 3 ? 'gen.as.together.two' : item.q);   /* opts: [صحيح، صحيح، مشتّت] */
    const box = document.createElement('div'); box.className = 'choices cards'; $('#stage').appendChild(box); const on = new Set(), order = shuffle([0, 1, 2]);
    const btns = order.map(i => { const b = document.createElement('button'); b.className = 'pick card'; b.innerHTML = `<span>${esc(T(ids[i]))}</span>`; b.setAttribute('aria-pressed', 'false'); b.dataset.k = 'abc'[i]; /*T*/if (TESTHOOK) b.dataset.ok = i < 2;/*/T*/
      b.onclick = () => { if (on.has(i)) on.delete(i); else on.add(i); b.classList.toggle('sel', on.has(i)); b.setAttribute('aria-pressed', on.has(i)); SFX.tick(); }; box.appendChild(b); return b; });
    fitDense();   /* سؤالٌ وثلاث بطاقات طويلة (م4): الدرس الكثيف */
    if (tries >= 3) { const b0 = btns[order.indexOf(0)]; b0.click(); }   /* الحلّ المشترك: البطاقة الأولى الصحيحة مختارة، والثانية للطفل */
    if (!tries || tries >= 3) for (const i of order) await S(ids[i], { keep: true, free: true });   /* تُقرأ البطاقات أول مرة وفي الحلّ المشترك */
    AUTO({ kind: 'two', ok: () => { [0, 1].forEach(i => { if (!on.has(i)) btns[order.indexOf(i)].click(); }); if (on.has(2)) btns[order.indexOf(2)].click(); rulDoneBtn().click(); }, wrong: () => { [0, 2].forEach(i => { if (!on.has(i)) btns[order.indexOf(i)].click(); }); if (on.has(1)) btns[order.indexOf(1)].click(); rulDoneBtn().click(); } });
    const dn = rulDone(() => { btns.forEach(b => b.onclick = null); }); fitDense(); await dn;   /* وبعد زرّ «تمّ» أيضاً: هو ما يضغط المسرح */
    const ans = [...on].sort().map(i => 'abc'[i]).join(''); box.remove(); return { ans, ctx: {} }; },
  judge(item, k) { return k === 'ab' ? { ok: true } : { ok: false, err: k.includes('c') ? (item.errFalse || 'reasonFalse') : 'reasonOne' }; },   /* errFalse: وسمٌ لبطاقات غير المثلثات (U0: «reasonWrong») */
  onOk() { SFX.good(); }, onWrong() { SFX.soft(); },
  async hint2(item) { await S(item.hint || 'gen.as.hint.two'); }, async together() {},   /* hint: تلميح خاصّ بالبند (S3-U4) */
  async reveal(item) { await S(item.opts[0].id); await S(item.opts[1].id); },
  praise: () => 'praiseThink', twin(item) { return item.twin || null; },
};
/* ================= المقطع: طيّ المتساوي الساقين على محوره — زاويتا القاعدة تنطبقان ================= */
SCENES.isoFold = async c => { const L = c.lines, apex = c.apex || 40, svg = m3Stage(262), T = isoDraw(svg, apex, [90, 30, 180, 160], ['arc', 'arc', apex]), [A, B, C] = T.P, M = [(A[0] + B[0]) / 2, A[1]];
  await S(L[0]); geoLine(svg, C[0], C[1] - 10, M[0], M[1] + 10, { color: '#8e6bbf', w: 2.6, dash: '6 5' }); svg.appendChild(T.cs[2].g); T.cs[2].g.querySelectorAll('text').forEach(t => { t.setAttribute('stroke', '#fdf7e8'); t.setAttribute('stroke-width', 5); t.setAttribute('paint-order', 'stroke'); }); SFX.tick();   /* المحور تحت رقم زاوية الرأس، وحوله هالة */
  await axPredictYN('yes', 'gen.as.pr.isoEq');
  const half = el('polygon', { points: polyStr([B, C, M]), fill: '#c9dcf2', opacity: .8, stroke: GEO.ink, 'stroke-width': 2 }, svg);
  const an = anim(half, [{ transform: 'scale(1,1)' }, { transform: `translate(${2 * M[0]}px,0px) scale(-1,1)` }], { duration: FAST ? 10 : 900, fill: 'forwards' }); await an.done; SFX.tick();
  await S(L[1]); await anim(half, [{ transform: `translate(${2 * M[0]}px,0px) scale(-1,1)` }, { transform: 'scale(1,1)' }], { duration: FAST ? 10 : 700, fill: 'forwards' }).done; half.remove();   /* نفتح الطيّة: الزاويتان في مكانيهما، والرقمان ظاهران */
  const b = (180 - apex) / 2; T.cs[0].g.remove(); T.cs[1].g.remove(); triCorner(T.g, A, B, C, b, TRI_COL[0]); triCorner(T.g, B, C, A, b, TRI_COL[0]);
  const t = el('text', { x: 180, y: 232, 'text-anchor': 'middle', 'font-size': 19, 'font-weight': 800, fill: ARC.ok, direction: 'ltr' }, svg); t.textContent = `(180 − ${apex}) ÷ 2 = ${b}`; SFX.tick();
  for (const l of L.slice(2)) await S(l); };
WRAP_ART.isoArt = svg => { isoDraw(svg, 40, [110, 40, 140, 150], [70, 70, 40]); };
