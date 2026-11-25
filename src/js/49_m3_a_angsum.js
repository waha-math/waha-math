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
function triDraw(parent, a, b, box, o = {}) { const [A, B, C] = triFromAngles(a, b, box), g = el('g', {}, parent), c = 180 - a - b;
  el('polygon', { points: polyStr([A, B, C]), fill: o.fill || '#fdf7e8', stroke: GEO.ink, 'stroke-width': 3, 'stroke-linejoin': 'round' }, g);
  const show = o.show || [a, b, c], cs = [[A, B, C], [B, C, A], [C, A, B]].map(([V, P, Q], i) => o.corners === false ? null : triCorner(g, V, P, Q, show[i], TRI_COL[i], { wedge: o.wedge, label: o.labels !== false }));
  if (o.names) [[A, [-14, 14]], [B, [14, 14]], [C, [0, -12]]].forEach(([p, d], i) => { const t = el('text', { x: p[0] + d[0], y: p[1] + d[1], 'text-anchor': 'middle', 'font-size': 16, 'font-weight': 800, fill: GEO.ink }, g); t.textContent = LTR[['a', 'b', 'j'][i]]; });
  return { g, P: [A, B, C], cs }; }
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
  await axPredictNum(w, 'gen.as.pr.missing'); T.cs[2].g.remove(); triCorner(T.g, T.P[2], T.P[0], T.P[1], w, ARC.ok);
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
  make(spec) { const s = spec.degs.reduce((x, y) => x + y, 0); return { ...spec, sum: s, want: s === 180 ? 'yes' : 'no', tag: 'tri-possible' }; },
  async ask(item, mode, tries) { const svg = m3Stage(240), xs = [290, 180, 70], g = el('g', {}, svg);
    item.degs.forEach((d, i) => { const V = [xs[i] - (d > 90 ? 0 : 20), 140]; const w = wedgeAt(g, d, 44, TRI_COL[i]); w.setAttribute('transform', `translate(${V[0]} ${V[1]})`); degText(g, xs[i], 190, d, { size: 16, color: TRI_COL[i] }); });
    if (tries >= 3) { const m = helpG(svg), t = el('text', { x: 180, y: 40, 'text-anchor': 'middle', 'font-size': 18, 'font-weight': 800, fill: css('--think'), direction: 'ltr' }, m); t.textContent = `${item.degs.join(' + ')} = ؟`; await S('gen.as.together.possible'); }
    else await S(item.q || 'gen.as.q.possible');
    const k = await choosePick([['yes', labelText('yes'), PICKICON.yes, 'gen.opt.yes'], ['no', labelText('no'), PICKICON.no, 'gen.opt.no']], item.want); return { ans: k, ctx: { svg } }; },
  judge(item, k) { if (k === item.want) return { ok: true }; return { ok: false, err: item.want === 'no' && item.degs.filter(d => d >= 90).length >= 2 ? 'twoBig' : 'sumNot180' }; },
  onOk() { SFX.good(); }, onWrong() { SFX.soft(); },
  async hint2(item, r) { if (r && r.ctx && r.ctx.svg) hintCard(r.ctx.svg, 180, 40, labelText('asSum180')); await S('gen.as.hint.possible'); }, async together() {},
  async reveal(item, r) { if (r && r.ctx && r.ctx.svg) { const t = el('text', { x: 180, y: 40, 'text-anchor': 'middle', 'font-size': 18, 'font-weight': 800, fill: item.want === 'yes' ? ARC.ok : '#c8392d', direction: 'ltr' }, r.ctx.svg); t.textContent = `${item.degs.join(' + ')} = ${item.sum}`; } await S(item.want === 'yes' ? 'gen.as.reveal.possYes' : 'gen.as.reveal.possNo'); },
  praise: () => 'praiseThink', twin(item) { return item.twin || null; },
};
/* ================= الختام ================= */
WRAP_ART.triSum = svg => { const T = triDraw(svg, 60, 70, [110, 40, 140, 100], { wedge: true, labels: false }); const P0 = [180, 196]; geoLine(svg, 90, P0[1], 270, P0[1], { color: GEO.ink, w: 2.4 }); let s = 0; [60, 70, 50].forEach((d, j) => { const w = wedgeAt(svg, d, 30, TRI_COL[j]); w.setAttribute('transform', `translate(${P0[0]} ${P0[1]}) rotate(${-s})`); s += d; }); };
