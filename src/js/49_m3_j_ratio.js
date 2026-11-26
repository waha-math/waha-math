/* =====================================================================
   S3-U10 «النسبة والتكبير ومقياس الرسم» (المرحلة 3، المرجع reference/03_المناهج_والوحدات/S3-U10_النسبة_والتكبير_والمقياس.md، نسخة 1.1)
   د1 النسب المتكافئة بالجدول وبضرب الطرفين أو قسمتهما (C324) · د2 التكبير بمعامل 2 و3 على الشبكة (C327): الأطوال × المعامل،
   والمساحة × مربّعه (تُعدّ المربعات أولاً)، والزوايا محفوظة، والتكبير غير التطابق · د3 مقياس الرسم «1 سم : 3 م» (C310): من الورق
   إلى الواقع بالضرب، ومن الواقع إلى الورق بالقسمة، والوحدة مع كل طول · د4 مشروع «خريطة غرفتي» · د5 المراجعة والاختبار
   النسبة «2 : 6» صيغة أعداد (MF: تُقرأ من اليمين مع المشرقية)، والمقياس نصٌّ من اليمين لأن فيه كلمتي الوحدة.
   ترقيم المسطرة غربيٌّ كالأداة الحقيقية (D229 (4)).
   ===================================================================== */
const RA = { a: '#2f7fc1', b: '#d9822b', ok: SO.ok, bad: SO.bad, hl: SO.hl, ink: SO.ink, grid: SO.grid, old: '#9cc7ea', big: '#f2c46b', paper: '#fffdf6', road: '#8f877a', tile: ['#f2c46b', '#9cc53b', '#7fb6d9', '#e9a3c0'] };
const raLab = (k, side) => labelText(`ra.h.${k}.${side}`);
/* كوب وملعقة (مشهد العصير) */
function raCup(g, x, y, s = 1) { el('path', { d: `M${x - 13 * s} ${y - 34 * s} L${x + 13 * s} ${y - 34 * s} L${x + 9 * s} ${y} L${x - 9 * s} ${y} Z`, fill: '#e8f4fc', stroke: RA.a, 'stroke-width': 2.2 }, g);
  el('path', { d: `M${x - 11.5 * s} ${y - 24 * s} L${x + 11.5 * s} ${y - 24 * s} L${x + 9 * s} ${y} L${x - 9 * s} ${y} Z`, fill: '#9cc7ea', stroke: 'none' }, g); }
function raSpoon(g, x, y) { el('ellipse', { cx: x, cy: y, rx: 7, ry: 4.5, fill: '#f3eee4', stroke: '#8a7a5a', 'stroke-width': 1.6 }, g); geoLine(g, x + 6, y + 2, x + 18, y + 7, { color: '#8a7a5a', w: 2.4 }); }
/* نقاط النسبة: a زرقاء وb برتقالية في صفّين */
function raDots(g, x, y, a, b) { const row = (n, yy, col) => { const w = Math.min(11, 120 / Math.max(n, 1)); for (let i = 0; i < n; i++) el('circle', { cx: x + (i - (n - 1) / 2) * w, cy: yy, r: Math.min(4.5, w / 2 - .5), fill: col }, g); };
  row(a, y, RA.a); row(b, y + 14, RA.b); }
/* جدول النسب: صفّان (عنوانهما من السياق)، والأعمدة من اليمين؛ قيمة null خانةٌ ناقصة */
function raTableDraw(g, ctx, cols, o = {}) { const n = cols.length, hw = 116, x1 = 338, cw = Math.min(62, (x1 - hw - 22) / n), y0 = o.y0 ?? 72, rh = 50;
  [0, 1].forEach(r => { const y = y0 + r * rh; el('rect', { x: x1 - hw, y, width: hw, height: rh, fill: r ? '#fdf1e2' : '#e8f1fb', stroke: RA.ink, 'stroke-width': 1.6 }, g);
    const t = el('text', { x: x1 - 8, y: y + 31, 'text-anchor': 'start', 'font-size': 14, 'font-weight': 800, fill: r ? RA.b : RA.a, direction: 'rtl', 'pointer-events': 'none' }, g); t.textContent = raLab(ctx, r ? 'b' : 'a'); });
  const cells = cols.map((c, i) => { const xr = x1 - hw - i * cw; return [0, 1].map(r => { const y = y0 + r * rh, miss = c[r] == null;
    el('rect', { x: xr - cw, y, width: cw, height: rh, fill: miss ? '#fff6d8' : '#fff', stroke: RA.ink, 'stroke-width': 1.6 }, g);
    if (miss && o.missMark !== false) el('rect', { x: xr - cw + 5, y: y + 5, width: cw - 10, height: rh - 10, rx: 6, fill: 'none', stroke: RA.hl, 'stroke-width': 2, 'stroke-dasharray': '5 4' }, g);
    const t = el('text', { x: xr - cw / 2, y: y + 33, 'text-anchor': 'middle', 'font-size': 22, 'font-weight': 800, fill: miss ? RA.hl : r ? RA.b : RA.a, 'pointer-events': 'none' }, g); t.textContent = miss ? '؟' : MS(String(c[r])); return t; }); });
  return { cells, cx: i => x1 - hw - (i + .5) * cw, y0, rh, cw }; }
/* سهم «× k» بين عمودين فوق الجدول وتحته */
function raFactorArrows(g, T, i, j, txt, col = RA.hl) { const xa = T.cx(i), xb = T.cx(j), mid = (xa + xb) / 2;
  for (const [y, bend] of [[T.y0 - 4, -22], [T.y0 + 2 * T.rh + 4, 22]]) { el('path', { d: `M${xa} ${y} Q${mid} ${y + bend} ${xb + (xa > xb ? 4 : -4)} ${y}`, fill: 'none', stroke: col, 'stroke-width': 2.4 }, g); geoArrow(g, xb + (xa > xb ? 4 : -4), y, xa > xb ? (bend < 0 ? 140 : 220) : (bend < 0 ? 40 : -40), col, 7);
    ciEq(g, mid, y + bend + (bend < 0 ? -4 : 14), txt, col, 15); } }
const raFactor = (c0, ci, r) => ci[r] >= c0[r] ? `× ${ci[r] / c0[r]}` : `÷ ${c0[r] / ci[r]}`;

/* ================= ① جدول النسب (C324): ctx، cols [[a b]…] وخانة واحدة null، وch [[الجواب]، [عدد، خطأ]…]؛ eq: «3 : 5 = 6 : ؟» ================= */
const raMiss = it => { for (let i = 0; i < it.cols.length; i++) for (const r of [0, 1]) if (it.cols[i][r] == null) return [i, r]; return [0, 0]; };
ITEM.raTable = cpItem({ H: 230, tLine: 'gen.ra.together.table', hint: 'gen.ra.hint.table', rLine: 'gen.ra.reveal.table', rSay: it => S(numw(it.want), { num: true, append: true }), num: true, praise: 'praiseThink',
  make: s => ({ want: s.ch[0][0], tag: 'ra-table' + (s.eq ? '-eq' : '') }),
  draw(svg, item, tries) { const [i, r] = raMiss(item), c0 = item.cols[0], ci = item.cols[i], k = raFactor(c0, ci, 1 - r);
    if (item.eq) { const [a, b] = c0, [c, d] = ci, s = `${a} : ${b} = ${c ?? '؟'} : ${d ?? '؟'}`; const t = ciEq(svg, 180, 104, s, RA.ink, 34); raDots(svg, 180, 150, Math.min(a, 12), Math.min(b, 12));
      if (tries >= 3) ciEq(helpG(svg), 180, 206, r ? `${a} ${k} = ${c} ، ${b} ${k} = ؟` : `${b} ${k} = ${d} ، ${a} ${k} = ؟`, RA.hl, 17); return { t }; }
    const T = raTableDraw(svg, item.ctx, item.cols); if (tries >= 3) raFactorArrows(helpG(svg), T, 0, i, k); return { T }; },
  h2: async (item, ctx) => { const m = helpG(ctx.svg), [i] = raMiss(item);
    if (ctx.T) for (const j of [0, i]) el('rect', { x: ctx.T.cx(j) - ctx.T.cw / 2 + 2, y: ctx.T.y0 - 2, width: ctx.T.cw - 4, height: 2 * ctx.T.rh + 4, rx: 6, fill: 'none', stroke: RA.hl, 'stroke-width': 3 }, m);
    else ciRule(m, 180, 208, labelText('raRule'), RA.hl, 14); await sleep(FAST ? 10 : 250); },
  show: async (item, ctx) => { if (!ctx || !ctx.svg) return; ctx.svg.querySelectorAll('[data-help]').forEach(n => n.remove()); const [i, r] = raMiss(item), m = helpG(ctx.svg);
    if (ctx.T) { const t = ctx.T.cells[i][r]; t.textContent = MS(String(item.want)); t.setAttribute('fill', RA.ok); raFactorArrows(m, ctx.T, 0, i, raFactor(item.cols[0], item.cols[i], 1 - r), RA.ok); }
    else { const C = item.cols.map(c => c.slice()); C[i][r] = item.want; ctx.t.remove(); ciEq(m, 180, 104, `${C[0][0]} : ${C[0][1]} = ${C[i][0]} : ${C[i][1]}`, RA.ok, 34); } },
  pick: (item, ctx) => { const np = numberPick(shuffle(item.ch.map(c => c[0])), item.want, { west: true }); ctx.np = np; return np.p; },
  errOf: (it, k) => (it.ch.find(c => c[0] === k) || [])[1] || 'raOff' });

/* ================= ② هل النسبتان متكافئتان؟ (C324): r1 [a b]، r2 [c d]؛ نعم بالضرب في العدد نفسه ================= */
const raIsEq = it => it.r1[0] * it.r2[1] === it.r1[1] * it.r2[0];
function raEqWork(it) { const [A, B] = it.r1[0] >= it.r2[0] ? it.r1 : it.r2, [a, b] = it.r1[0] >= it.r2[0] ? it.r2 : it.r1, k = A / a; return { s: `${a} × ${k} = ${A} ، ${b} × ${k} = ${b * k}`, ok: b * k === B }; }
ITEM.raEq = cpItem({ H: 230, tLine: 'gen.ra.together.eq', hint: 'gen.ra.hint.eq', rLine: it => raIsEq(it) ? 'gen.ra.reveal.eqYes' : 'gen.ra.reveal.eqNo', praise: 'praiseThink',
  sayQ: it => S(`gen.ra.pair.${it.r1.join('.')}.${it.r2.join('.')}`, { append: true }),
  make: s => ({ want: s.r1[0] * s.r2[1] === s.r1[1] * s.r2[0] ? 'yes' : 'no', tag: 'ra-eq' }),
  draw(svg, item, tries) { [[item.r1, 262], [item.r2, 98]].forEach(([[a, b], x]) => { el('rect', { x: x - 70, y: 46, width: 140, height: 70, rx: 14, fill: '#fff', stroke: RA.ink, 'stroke-width': 2 }, svg); ciEq(svg, x, 92, `${a} : ${b}`, RA.ink, 28); raDots(svg, x, 140, a, b); });
    htLab(svg, [180, 78], '؟', RA.hl, 30); if (tries >= 3) { const w = raEqWork(item); ciEq(helpG(svg), 180, 196, w.s.replace(/= \d+$/, '= ؟'), RA.hl, 16); } return {}; },
  h2: async (item, ctx) => { ciRule(helpG(ctx.svg), 180, 196, labelText('raRule'), RA.hl, 14); await sleep(FAST ? 10 : 250); },
  show: async (item, ctx) => { if (!ctx || !ctx.svg) return; ctx.svg.querySelectorAll('[data-help]').forEach(n => n.remove()); const w = raEqWork(item); ciEq(helpG(ctx.svg), 180, 196, w.s, w.ok ? RA.ok : RA.bad, 16); },
  pick: item => yesNo(item.want),
  errOf: (it, k) => k === 'no' ? 'raNotEq' : (it.r1[1] - it.r1[0] === it.r2[1] - it.r2[0] ? 'raDiff' : 'raEqOff') });

/* ================= التكبير (C327): الشكل على شبكة بلا محورين؛ shape rect | sq | tri (قائم، زاويته القائمة أسفل اليسار) ================= */
const enPoly = (shape, x, y, a, b) => shape === 'tri' ? [[x, y], [x + a, y], [x, y + b]] : [[x, y], [x + a, y], [x + a, y + b], [x, y + b]];
const enAreaOf = (shape, a, b) => shape === 'tri' ? a * b / 2 : a * b;
function enShape(g, Pl, shape, x, y, a, b, o = {}) { const P = enPoly(shape, x, y, a, b).map(p => Pl.P(...p));
  el('polygon', { points: polyStr(P), fill: o.fill || RA.old, 'fill-opacity': o.op ?? .8, stroke: o.stroke || RA.ink, 'stroke-width': o.w || 2.6, 'stroke-dasharray': o.dash, 'stroke-linejoin': 'round' }, g);
  if (o.right !== false) { const q = Math.min(10, Pl.c * .38), [X, Y] = P[0]; el('path', { d: `M${X + q} ${Y} L${X + q} ${Y - q} L${X} ${Y - q}`, fill: 'none', stroke: o.stroke || RA.ink, 'stroke-width': 1.8 }, g); }
  if (o.dims) { const [X0, Y0] = Pl.P(x, y), [X1] = Pl.P(x + a, y), [, Y1] = Pl.P(x, y + b); htLab(g, [(X0 + X1) / 2, Y0 + 13], MS(String(a)), o.dimCol || RA.ink, 15); htLab(g, [X0 - 12, (Y0 + Y1) / 2], MS(String(b)), o.dimCol || RA.ink, 15); }
  return P; }
/* نُسخ الشكل الصغير التي تملأ المكبَّر: k² نسخة (للمثلث: قائمة ومقلوبة) */
function enTiles(g, Pl, shape, x, y, a, b, k, o = {}) { const T = [];
  for (let r = 0; r < k; r++) for (let c = 0; c < k; c++) {
    if (shape !== 'tri') T.push(enPoly('rect', x + c * a, y + r * b, a, b));
    else { if (c + r <= k - 1) T.push([[x + c * a, y + r * b], [x + (c + 1) * a, y + r * b], [x + c * a, y + (r + 1) * b]]); if (c + r <= k - 2) T.push([[x + (c + 1) * a, y + r * b], [x + (c + 1) * a, y + (r + 1) * b], [x + c * a, y + (r + 1) * b]]); } }
  return T.map((q, i) => el('polygon', { points: polyStr(q.map(p => Pl.P(...p))), fill: RA.tile[i % 2 ? 1 : 0], 'fill-opacity': .75, stroke: RA.ink, 'stroke-width': 1.3, opacity: o.hidden ? 0 : 1 }, g)); }
async function enTileShow(g, Pl, shape, x, y, a, b, k, cnt) { const T = enTiles(g, Pl, shape, x, y, a, b, k, { hidden: true }); let n = 0;
  for (const t of T) { t.setAttribute('opacity', 1); n++; if (cnt) cnt.textContent = MS(String(n)); SFX.tick(); await sleep(FAST ? 2 : 260); } return T; }
/* شبكة التكبير: الأصلي يميناً والمكبَّر يساراً (يُقرأ من اليمين) */
const enBare = Pl => { const r = Pl.g.querySelector('rect'); if (r) { r.setAttribute('fill', 'none'); r.setAttribute('stroke', 'none'); } return Pl; };   /* إطار المسرح يكفي: لا إطارٌ ثانٍ للشبكة */
const enPlane = (svg, H = 250, n = 12, m = 7, top = 14) => enBare(coPlane(svg, { axes: false, n, m, H, top }));
const enBadge = (svg, k, x = 180, y = 30) => { const g = el('g', { 'pointer-events': 'none' }, svg); el('rect', { x: x - 34, y: y - 18, width: 68, height: 34, rx: 12, fill: '#fff6d8', stroke: RA.hl, 'stroke-width': 2.4 }, g); ciEq(g, x, y + 7, `× ${k}`, RA.hl, 20); return g; };

/* ③ ما البعدان الجديدان؟ (C327): shape a b k، opts [[w h خطأ]…] (الأول الصحيح) */
ITEM.enDims = cpItem({ H: 250, tLine: 'gen.en.together.dims', hint: 'gen.en.hint.dims', rLine: 'gen.en.reveal.dims', praise: 'praiseThink',
  sayQ: async it => { await S(`gen.en.k.${it.k}`, { append: true }); await S(`gen.en.q.dimsEnd.${it.fig}`, { append: true }); },
  make: s => ({ want: s.cands[0][0] + 'x' + s.cands[0][1], tag: 'en-dims-' + s.fig }),
  draw(svg, item, tries) { const Pl = enPlane(svg); enShape(svg, Pl, item.fig, Pl.N - item.a - 1, 1, item.a, item.b, { dims: true }); enBadge(svg, item.k, 300, 30);
    if (tries >= 3) ciEq(helpG(svg), 120, 110, `${item.a} × ${item.k} ، ${item.b} × ${item.k}`, RA.hl, 16); return { Pl }; },
  h2: async (item, ctx) => { ciRule(helpG(ctx.svg), 150, 150, labelText('enRuleLen'), RA.hl, 14); await sleep(FAST ? 10 : 250); },
  show: async (item, ctx) => { if (!ctx || !ctx.Pl) return; ctx.svg.querySelectorAll('[data-help]').forEach(n => n.remove()); const k = item.k; enShape(helpG(ctx.svg), ctx.Pl, item.fig, 1, 1, item.a * k, item.b * k, { fill: RA.big, dims: true, dimCol: RA.ok }); },
  pick: item => choosePick(shuffle(item.cands.map(([w, h]) => [w + 'x' + h, `${MS(String(w))} × ${MS(String(h))}`, '<i></i>', `gen.en.dims.${w}x${h}`])), item.want),
  errOf: (it, k) => (it.cands.find(([w, h]) => w + 'x' + h === k) || [])[2] || 'enOff' });

/* ④ مساحة المكبَّر (C327): shape a b k، ch [[k²A]، [kA 'enAreaK']، …]؛ المساحة بالمربعات (تُعدّ في الكشف) */
ITEM.enArea = cpItem({ H: 250, tLine: 'gen.en.together.area', hint: 'gen.en.hint.area', rLine: 'gen.en.reveal.area', rSay: it => S(`gen.en.sq.${it.want}`, { append: true }), praise: 'praiseThink',
  sayQ: async it => { await S(`gen.en.sq.${enAreaOf(it.fig, it.a, it.b)}`, { append: true }); await S(`gen.en.q.areaEnd.${it.k}`, { append: true }); },
  make: s => ({ want: s.ch[0][0], tag: 'en-area-' + s.fig }),
  draw(svg, item, tries) { const Pl = enPlane(svg), x = Pl.N - item.a - 1, A = enAreaOf(item.fig, item.a, item.b); enShape(svg, Pl, item.fig, x, 1, item.a, item.b, { dims: true });
    const [X, Y] = Pl.P(x + item.a / 2, 1 + item.b); htLab(svg, [X, Y - 16], `${MS(String(A))} ${labelText(A === 1 ? 'enSq1' : A === 2 ? 'enSq2' : A <= 10 ? 'enSqFew' : 'enSqMany')}`, RA.a, 15); enBadge(svg, item.k, 300, 30);
    if (tries >= 3) { const k = item.k; ciEq(helpG(svg), 120, 110, `${k} × ${k} = ${k * k}`, RA.hl, 17); } return { Pl, x }; },
  h2: async (item, ctx) => { const m = helpG(ctx.svg); enTiles(m, ctx.Pl, item.fig, ctx.x, 1, item.a, item.b, 1); ciRule(m, 140, 150, labelText('enRuleArea'), RA.hl, 13); await sleep(FAST ? 10 : 250); },
  show: async (item, ctx) => { if (!ctx || !ctx.Pl) return; ctx.svg.querySelectorAll('[data-help]').forEach(n => n.remove()); const m = helpG(ctx.svg); enShape(m, ctx.Pl, item.fig, 1, 1, item.a * item.k, item.b * item.k, { fill: '#fff', op: 1 });
    await enTileShow(m, ctx.Pl, item.fig, 1, 1, item.a, item.b, item.k); },
  pick: (item, ctx) => { const np = numberPick(shuffle(item.ch.map(c => c[0])), item.want, { west: true }); ctx.np = np; return np.p; },
  errOf: (it, k) => (it.ch.find(c => c[0] === k) || [])[1] || 'enAreaOff' });

/* ⑤ «عدسة المكبّر»: كبّر المستطيل من ركنه بلمسة الركن المقابل (C327، إنتاج): a b k */
ITEM.enDraw = {
  make(spec) { /*T*/if (TESTHOOK && (spec.a * spec.k > 10 || spec.b * spec.k > 8)) testBug('enDraw: المكبَّر خارج الشبكة');/*/T*/ return { ...spec, tag: 'en-draw' }; },
  async ask(item, mode, tries) { const svg = m3Stage(262), Pl = enBare(coPlane(svg, { axes: false, n: 10, m: 8, H: 262, top: 20, bottom: 234 })), W = [item.a * item.k, item.b * item.k]; let cur = null, prev = null, done = false;
    enShape(svg, Pl, 'rect', 0, 0, item.a, item.b, { dims: true }); enBadge(svg, item.k, ...Pl.P(8.9, 7.45));   /* المعامل في الركن الأعلى (المكبَّر لا يتجاوز 6 صفوف)، وأطوال الضلع داخل الإطار (المراجع B) */ const host = el('g', { 'pointer-events': 'none' }, svg);
    if (tries >= 3) enShape(helpG(svg), Pl, 'rect', 0, 0, W[0], .02, { fill: RA.hl, stroke: RA.hl, w: 4, right: false });   /* الحلّ المشترك: الضلع السفلي المكبَّر مرسوم، والارتفاع للطفل */
    const askQ = async () => { await S(tries >= 3 ? 'gen.en.together.draw' : item.q); }; askQ(); REPLAY_HOOK = () => askQ(); REPLAY_HOOK.live = () => !done && svg.isConnected;
    const set = (x, y) => { cur = [x, y]; host.innerHTML = ''; if (x > 0 && y > 0) { enShape(host, Pl, 'rect', 0, 0, x, y, { fill: RA.big, op: .45, dash: '7 5', stroke: RA.hl, right: false }); const [X, Y] = Pl.P(x, y); el('circle', { cx: X, cy: Y, r: 8, fill: RA.hl, stroke: '#fff', 'stroke-width': 2 }, host); } /*T*/window.__gridPt = cur;/*/T*/ };
    const input = fingerInput(svg, { map: e => { const q = svgPoint(svg, e); return [q.x, q.y]; }, down(q) { if (q[1] > Pl.y0 + 22 || q[1] < Pl.y0 - Pl.M * Pl.c - 20) return false; set(...Pl.snap(q)); SFX.tick(); }, move(q) { set(...Pl.snap(q)); }, up() {} });
    /*T*/window.__gridPtAt = (x, y) => { const m = svg.getScreenCTM(), [px, py] = Pl.P(x, y); return { x: m.a * px + m.e, y: m.d * py + m.f }; }; window.__gridPtWant = W;/*/T*/
    const kg = el('g', { role: 'grid', 'aria-label': labelText('enGrid') }, svg);
    for (let y = Pl.M; y >= 1; y--) { const row = el('g', { role: 'row' }, kg); for (let x = 1; x <= Pl.N; x++) { const [px, py] = Pl.P(x, y), b = el('g', { role: 'gridcell', tabindex: 0, 'aria-label': `${x} × ${y}` }, row); el('circle', { cx: px, cy: py, r: 8, fill: 'transparent', 'pointer-events': 'none' }, b); b.onkeydown = e => { if (isActKey(e)) { e.preventDefault(); set(x, y); SFX.tick(); } }; } }
    const bad = item.a + item.k <= Pl.N && item.b + item.k <= Pl.M && (item.a + item.k !== W[0] || item.b + item.k !== W[1]) ? [item.a + item.k, item.b + item.k] : [W[0], item.b];
    AUTO({ kind: 'gridPt', ok: () => { set(...W); rulDoneBtn().click(); }, wrong: () => { set(...bad); rulDoneBtn().click(); } });
    await rulDone(() => { done = true; REPLAY_HOOK = null; input.off(); kg.remove(); }); return { ans: cur || [0, 0], ctx: { svg, Pl, host, set } }; },
  judge(item, a) { const k = item.k, w = item.a * k, h = item.b * k; if (a[0] === w && a[1] === h) return { ok: true };
    return { ok: false, err: a[0] === item.a + k && a[1] === item.b + k ? 'enAdd' : a[0] === h && a[1] === w ? 'enSwap' : a[0] === w || a[1] === h ? 'enOneSide' : 'enOff' }; },
  onOk() { SFX.good(); }, onWrong() { SFX.soft(); },
  async hint2(item, r) { if (r && r.ctx) { const m = helpG(r.ctx.svg); enShape(m, r.ctx.Pl, 'rect', 0, 0, item.a * item.k, .02, { fill: RA.hl, stroke: RA.hl, w: 4, right: false }); } await S('gen.en.hint.draw'); }, async together() {},
  async reveal(item, r) { if (r && r.ctx) { r.ctx.set(item.a * item.k, item.b * item.k); const m = helpG(r.ctx.svg); enShape(m, r.ctx.Pl, 'rect', 0, 0, item.a * item.k, item.b * item.k, { fill: 'none', op: 0, stroke: RA.ok, w: 3.4, right: false, dims: true, dimCol: RA.ok }); } await S('gen.en.reveal.draw'); },
  praise: () => 'praisePlace', twin(item) { return item.twin || null; },
};

/* ⑥ نعم أم لا بعد التكبير (C327): ask angle (هل تغيّرت الزوايا؟ لا) | len (هل تغيّرت الأطوال؟ نعم) | cong (هل الشكلان متطابقان؟ لا)؛ shape a b k */
ITEM.enYN = cpItem({ H: 250, tLine: 'gen.en.together.yn', hint: 'gen.en.hint.yn', rLine: it => 'gen.en.reveal.' + it.ask, praise: 'praiseThink',
  make: s => ({ want: s.ask === 'len' ? 'yes' : 'no', tag: 'en-yn-' + s.ask }),
  draw(svg, item, tries) { const Pl = enPlane(svg), k = item.k; enShape(svg, Pl, item.fig, Pl.N - item.a - 1, 1, item.a, item.b, { dims: true }); enShape(svg, Pl, item.fig, 1, 1, item.a * k, item.b * k, { fill: RA.big, dims: true }); enBadge(svg, k, 300, 30);
    if (tries >= 3) { const m = helpG(svg); enShape(m, Pl, item.fig, 1, 1, item.a, item.b, { fill: '#fff', op: .45, dash: '6 4', stroke: RA.a }); } return { Pl }; },
  h2: async (item, ctx) => { ciRule(helpG(ctx.svg), 180, 30, labelText(item.ask === 'cong' ? 'enRuleCong' : 'enRuleKeep'), RA.hl, 13); await sleep(FAST ? 10 : 250); },
  pick: item => yesNo(item.want),
  errOf: it => ({ angle: 'enAngle', len: 'enLenSame', cong: 'enCong' }[it.ask]) });

/* ================= مقياس الرسم (C310): ورقٌ مربّع، 1 سم = SCU بكسلاً على الشاشة، ومسطرة غربية الترقيم ================= */
const SCU = 24;
const scText = k => `${MS('1')} ${labelText('rulCm')} : ${MS(String(k))} ${labelText('lenM')}`;
function scBadge(g, x, y, k, col = RA.a) { const b = el('g', { 'pointer-events': 'none' }, g); el('rect', { x: x - 62, y: y - 17, width: 124, height: 34, rx: 10, fill: '#fff', stroke: col, 'stroke-width': 2.4 }, b);
  const t = el('text', { x, y: y + 7, 'text-anchor': 'middle', 'font-size': 17, 'font-weight': 800, fill: col, direction: 'rtl' }, b); t.textContent = scText(k); return b; }
/* U: طول السنتيمتر على المسرح؛ يصغر حين يطول الخطّ عن اثني عشر، فيبقى الورق والمسطرة داخل الإطار */
function scPaper(g, y, n = 12, x0 = 36, U = SCU) { el('rect', { x: x0 - 14, y, width: n * U + 28, height: 44, rx: 6, fill: RA.paper, stroke: RA.grid, 'stroke-width': 1.6 }, g);
  for (let i = 0; i <= n; i++) geoLine(g, x0 + i * U, y + 4, x0 + i * U, y + 40, { color: '#e6dcc4', w: 1 }); }
function scRuler(g0, y, n = 12, x0 = 36, U = SCU) { const g = el('g', { 'data-ruler': 1, 'pointer-events': 'none' }, g0); el('rect', { x: x0 - 10, y, width: n * U + 20, height: 30, rx: 4, fill: '#f6d77a', stroke: '#8a6a1a', 'stroke-width': 1.6 }, g);
  for (let i = 0; i <= n; i++) { geoLine(g, x0 + i * U, y, x0 + i * U, y + 10, { color: '#8a6a1a', w: 1.6 }); const t = el('text', { x: x0 + i * U, y: y + 24, 'text-anchor': 'middle', 'font-size': 11, 'font-weight': 700, fill: '#5a4410' }, g); t.textContent = String(i); } }
const scLine = (g, y, n, col = RA.a, x0 = 36, U = SCU) => { const l = geoLine(g, x0, y, x0 + n * U, y, { color: col, w: 5 }); [x0, x0 + n * U].forEach(x => geoLine(g, x, y - 8, x, y + 8, { color: col, w: 3 })); return l; };
/* الشيء الحقيقي فوق الورقة (ليس بالمقياس): obj road | wall | pool | fence | bus | track، بسهم طوله المكتوب */
function scObj(g, kind, n, o = {}) { const y = o.y ?? 70, x0 = 40, x1 = 320, m = el('g', { 'pointer-events': 'none' }, g);
  if (kind === 'road') { el('rect', { x: x0, y: y - 14, width: x1 - x0, height: 28, fill: '#9a948a', stroke: '#6d675e', 'stroke-width': 2 }, m); geoLine(m, x0 + 8, y, x1 - 8, y, { color: '#fff', w: 3, dash: '14 10' }); }
  else if (kind === 'pool') { el('rect', { x: x0, y: y - 16, width: x1 - x0, height: 32, rx: 6, fill: '#8fd0f0', stroke: '#2f7fc1', 'stroke-width': 2.4 }, m); el('path', { d: `M${x0 + 10} ${y} q12 -7 24 0 t24 0 t24 0 t24 0 t24 0 t24 0 t24 0 t24 0 t24 0 t24 0 t24 0`, fill: 'none', stroke: '#fff', 'stroke-width': 2 }, m); }
  else if (kind === 'fence') { geoLine(m, x0, y - 6, x1, y - 6, { color: '#9b6b3a', w: 4 }); geoLine(m, x0, y + 8, x1, y + 8, { color: '#9b6b3a', w: 4 }); for (let x = x0; x <= x1; x += 28) geoLine(m, x, y - 16, x, y + 16, { color: '#7a4f25', w: 5 }); }
  else if (kind === 'bus') { el('rect', { x: x0 + 20, y: y - 22, width: x1 - x0 - 40, height: 36, rx: 10, fill: '#f2c46b', stroke: '#8a6a1a', 'stroke-width': 2.4 }, m); for (let x = x0 + 34; x < x1 - 40; x += 34) el('rect', { x, y: y - 16, width: 24, height: 13, rx: 3, fill: '#e8f4fc', stroke: '#8a6a1a', 'stroke-width': 1.4 }, m); for (const x of [x0 + 60, x1 - 60]) el('circle', { cx: x, cy: y + 15, r: 8, fill: '#444', stroke: '#222', 'stroke-width': 2 }, m); }
  else if (kind === 'shelf') { el('rect', { x: x0, y: y + 6, width: x1 - x0, height: 10, rx: 2, fill: '#b5835a', stroke: '#7a4f25', 'stroke-width': 2 }, m); for (let x = x0 + 8, i = 0; x < x1 - 14; x += 16, i++) el('rect', { x, y: y - 16 + (i % 3) * 3, width: 12, height: 22 - (i % 3) * 3, fill: ['#2f7fc1', '#d9822b', '#9cc53b', '#c0392b'][i % 4], stroke: '#444', 'stroke-width': 1 }, m); }
  else if (kind === 'track') { geoLine(m, x0, y - 8, x1, y - 8, { color: '#6d675e', w: 3 }); geoLine(m, x0, y + 8, x1, y + 8, { color: '#6d675e', w: 3 }); for (let x = x0 + 6; x < x1; x += 16) geoLine(m, x, y - 13, x, y + 13, { color: '#9b6b3a', w: 4 }); }
  else { el('rect', { x: x0, y: y - 16, width: x1 - x0, height: 32, fill: '#e6a476', stroke: '#8a4f2a', 'stroke-width': 2 }, m); for (let r = 0; r < 2; r++) for (let x = x0 + (r ? 14 : 0); x < x1; x += 28) el('rect', { x, y: y - 16 + r * 16, width: Math.min(28, x1 - x), height: 16, fill: 'none', stroke: '#8a4f2a', 'stroke-width': 1.2 }, m); }
  const ya = y - 30; geoLine(m, x0, ya, x1, ya, { color: RA.ink, w: 1.8 }); geoArrow(m, x0, ya, 180, RA.ink, 7); geoArrow(m, x1, ya, 0, RA.ink, 7);
  el('rect', { x: 140, y: ya - 13, width: 80, height: 24, rx: 8, fill: '#fff', stroke: 'none' }, m); htLab(m, [180, ya - 2], `${MS(String(n))} ${labelText('lenM')}`, RA.ink, 16); return m; }
const scUnitLab = (v, u) => `${MS(String(v))} ${labelText(u === 'm' ? 'lenM' : 'rulCm')}`;
const scLine$ = (v, u) => `gen.sc.v.${v}.${u}`;

/* ⑦ من الورق إلى الواقع وبالعكس (C310): dir up (ورقٌ n سم → حقيقي) | down (حقيقي n م → ورق)؛ k؛ obj؛ ch [[v u خطأ]…] (الأول الصحيح) */
ITEM.scConv = cpItem({ H: 250, tLine: 'gen.sc.together.conv', hint: 'gen.sc.hint.conv', rLine: 'gen.sc.reveal.conv', rSay: it => S(scLine$(it.ch[0][0], it.ch[0][1]), { append: true }), praise: 'praiseThink',
  sayQ: async it => { await S(scLine$(it.n, it.dir === 'up' ? 'cm' : 'm'), { append: true }); await S(it.dir === 'up' ? 'gen.sc.q.upEnd' : 'gen.sc.q.downEnd', { append: true }); },
  make: s => ({ want: s.ch[0][0] + s.ch[0][1], tag: 'sc-conv-' + s.dir }),
  draw(svg, item, tries) { scBadge(svg, 270, 32, item.k); const g = el('g', {}, svg);
    if (item.dir === 'up') { const n = Math.max(12, Math.ceil(item.n)), U = Math.min(SCU, 288 / n); scPaper(g, 112, n, 36, U); scLine(g, 134, item.n, RA.a, 36, U); scRuler(g, 162, n, 36, U); htLab(g, [36 + item.n * U / 2, 100], scUnitLab(item.n, 'cm'), RA.a, 16); }
    else { scObj(g, item.thing || 'wall', item.n, { y: 96 }); scPaper(g, 150); }
    if (tries >= 3) ciEq(helpG(svg), 100, 36, item.dir === 'up' ? `${item.n} × ${item.k} = ؟` : `${item.n} ÷ ${item.k} = ؟`, RA.hl, 17); return {}; },
  h2: async (item, ctx) => { const m = helpG(ctx.svg); ciRule(m, 180, 228, labelText(item.dir === 'up' ? 'scRuleUp' : 'scRuleDown'), RA.hl, 13); await sleep(FAST ? 10 : 250); },
  show: async (item, ctx) => { if (!ctx || !ctx.svg) return; ctx.svg.querySelectorAll('[data-help]').forEach(n => n.remove()); const m = helpG(ctx.svg), v = item.ch[0][0];
    if (item.dir === 'down') { scLine(m, 172, v, RA.ok); } ciEq(m, 100, 36, item.dir === 'up' ? `${item.n} × ${item.k} = ${v}` : `${item.n} ÷ ${item.k} = ${v}`, RA.ok, 17); },
  pick: item => choosePick(shuffle(item.ch.map(([v, u]) => [v + u, scUnitLab(v, u), '<i></i>', scLine$(v, u)])), item.want),
  errOf: (it, k) => (it.ch.find(([v, u]) => v + u === k) || [])[2] || 'scOff' });

/* ⑧ أيّ المقياسين يرسم أكبر؟ (C310): a b (1 سم : a م و1 سم : b م)، obj بطول n */
ITEM.scBig = cpItem({ H: 250, tLine: 'gen.sc.together.big', hint: 'gen.sc.hint.big', rLine: 'gen.sc.reveal.big', praise: 'praiseThink',
  make: s => ({ want: 's' + Math.min(s.a, s.b), tag: 'sc-big' }),
  draw(svg, item, tries) { const g = el('g', {}, svg); scObj(g, item.thing || 'wall', item.n, { y: 86 }); [[item.a, 140], [item.b, 200]].forEach(([k, y]) => { scBadge(g, 276, y, k, RA.ink); scPaper(g, y - 22, 6, 36); });
    if (tries >= 3) { const U = Math.min(SCU, 288 / Math.max(item.n / item.a, item.n / item.b)); [[item.a, 140], [item.b, 200]].forEach(([k, y]) => scLine(helpG(svg), y, item.n / k, RA.hl, 36, U)); } return {}; },   /* الخطّان داخل الإطار */
  h2: async (item, ctx) => { ciRule(helpG(ctx.svg), 180, 28, labelText('scRuleBig'), RA.hl, 13); await sleep(FAST ? 10 : 250); },
  show: async (item, ctx) => { if (!ctx || !ctx.svg) return; ctx.svg.querySelectorAll('[data-help]').forEach(n => n.remove()); const U = Math.min(SCU, 288 / Math.max(item.n / item.a, item.n / item.b)); [[item.a, 140], [item.b, 200]].forEach(([k, y]) => scLine(helpG(ctx.svg), y, item.n / k, k === Math.min(item.a, item.b) ? RA.ok : RA.ink, 36, U)); },
  pick: item => choosePick(shuffle([['s' + item.a, scText(item.a), '<i></i>', `gen.sc.scale.${item.a}`], ['s' + item.b, scText(item.b), '<i></i>', `gen.sc.scale.${item.b}`], ['same', labelText('scSame'), '<i></i>', 'gen.sc.same']]), 's' + Math.min(item.a, item.b)),
  errOf: (it, k) => k === 'same' ? 'scSame' : 'scBigNum' });

/* ⑨ «خريطة المدينة»: ارسم الطول على الورق بزرّين (C310، إنتاج): n م حقيقية، k، obj؛ والجواب n/k سم */
ITEM.scDraw = {
  make(spec) { /*T*/if (TESTHOOK && spec.n % spec.k) testBug('scDraw: الطول لا ينقسم على المقياس');/*/T*/ return { ...spec, want: spec.n / spec.k, tag: 'sc-draw' }; },
  async ask(item, mode, tries) { const svg = m3Stage(262), g = el('g', {}, svg); scBadge(svg, 270, 32, item.k); scObj(g, item.thing || 'road', item.n, { y: 86 }); scPaper(g, 124); scRuler(g, 170);   /* والزرّان تحت المسطرة داخل الإطار */
    const host = el('g', { 'pointer-events': 'none' }, svg); let v = 0, reg = null;
    const draw = () => { host.innerHTML = ''; if (v > 0) { scLine(host, 146, v, RA.hl); htLab(host, [36 + v * SCU / 2, 134], scUnitLab(v, 'cm'), RA.hl, 14); } /*T*/window.__cdV = v; window.__cdWant = item.want;/*/T*/ if (reg) reg(); };
    draw(); if (tries >= 3) ciEq(helpG(svg), 100, 36, `${item.n} ÷ ${item.k} = ؟`, RA.hl, 17);
    const btns = svgSteppers(svg, [[50, 224], [310, 224]], d => { v = Math.max(0, Math.min(12, v + d)); SFX.tick(); draw(); }, { key: 'cd', labels: ['scLess', 'scMore'] });
    if (tries >= 3) await S('gen.sc.together.draw'); else { await S(item.q, { noGap: true }); await S(scLine$(item.n, 'm'), { append: true }); await S('gen.sc.q.drawEnd', { append: true }); }
    const t = item.want, tap = b => b.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    const fin = rulDone(() => { reg = null; btns.forEach(b => { b.onclick = null; b.onkeydown = null; b.removeAttribute('role'); }); });
    reg = () => AUTO({ kind: 'compass', ok: () => v === t ? rulDoneBtn().click() : tap(btns[v < t ? 1 : 0]), wrong: () => { const w = t + 1; if (v === w) rulDoneBtn().click(); else tap(btns[v < w ? 1 : 0]); } }); reg(); await fin;
    return { ans: v, ctx: { svg, host } }; },
  judge(item, v) { return v === item.want ? { ok: true } : { ok: false, err: v === item.n ? 'scNoDiv' : v === item.n - item.k ? 'scSub' : v < item.want ? 'scShort' : 'scLong' }; },
  onOk() { SFX.good(); }, onWrong() { SFX.soft(); },
  async hint2(item, r) { if (r && r.ctx) ciRule(helpG(r.ctx.svg), 180, 30, labelText('scRuleDown'), RA.hl, 13); await S('gen.sc.hint.draw'); }, async together() {},
  async reveal(item, r) { if (r && r.ctx) { r.ctx.host.innerHTML = ''; const m = helpG(r.ctx.svg); scLine(m, 146, item.want, RA.ok); ciEq(m, 100, 36, `${item.n} ÷ ${item.k} = ${item.want}`, RA.ok, 17); } await S('gen.sc.reveal.conv', { noGap: true }); await S(scLine$(item.want, 'cm'), { append: true }); },
  praise: () => 'praisePlace', twin(item) { return item.twin || null; },
};

/* ⑩ أبعاد الغرفة على الورق (C310): a b (م)، k، opts [[w h خطأ]…] (الأول الصحيح) */
ITEM.scRoom = cpItem({ H: 250, tLine: 'gen.sc.together.room', hint: 'gen.sc.hint.room', rLine: 'gen.sc.reveal.room', praise: 'praiseThink',
  sayQ: async it => { await S(`gen.sc.room.${it.a}x${it.b}`, { append: true }); await S('gen.sc.q.roomEnd', { append: true }); },
  make: s => ({ want: s.cands[0][0] + 'x' + s.cands[0][1], tag: 'sc-room' }),
  draw(svg, item, tries) { scBadge(svg, 270, 32, item.k); const g = el('g', { 'pointer-events': 'none' }, svg), s = Math.min(150 / item.a, 104 / item.b), w = item.a * s, h = item.b * s;
    el('rect', { x: 180 - w / 2, y: 140 - h / 2, width: w, height: h, fill: '#f6eccf', stroke: RA.ink, 'stroke-width': 3 }, g);
    htLab(g, [180, 140 + h / 2 + 18], scUnitLab(item.a, 'm'), RA.ink, 16); htLab(g, [180 - w / 2 - 26, 140], scUnitLab(item.b, 'm'), RA.ink, 16);
    if (tries >= 3) ciEq(helpG(svg), 100, 36, `${item.a} ÷ ${item.k} ، ${item.b} ÷ ${item.k}`, RA.hl, 16); return {}; },
  h2: async (item, ctx) => { ciRule(helpG(ctx.svg), 180, 226, labelText('scRuleDown'), RA.hl, 13); await sleep(FAST ? 10 : 250); },
  show: async (item, ctx) => { if (!ctx || !ctx.svg) return; ctx.svg.querySelectorAll('[data-help]').forEach(n => n.remove()); const [w, h] = item.cands[0]; ciEq(helpG(ctx.svg), 100, 36, `${item.a} ÷ ${item.k} = ${w} ، ${item.b} ÷ ${item.k} = ${h}`, RA.ok, 15); },
  pick: item => choosePick(shuffle(item.cands.map(([w, h]) => [w + 'x' + h, `${MS(String(w))} × ${MS(String(h))} ${labelText('rulCm')}`, '<i></i>', `gen.sc.dims.${w}x${h}`])), item.want),
  errOf: (it, k) => (it.cands.find(([w, h]) => w + 'x' + h === k) || [])[2] || 'scOff' });

/* ================= صورة التعليل (rapic): ra [a b] نسبة بنقاطها · en {shape a b k} صغيرٌ ومكبَّر · sc k مقياسٌ وخطّ n · f حساب ================= */
function raReasonPic(g, P) {
  if (P.ra) { ciEq(g, 180, 70, `${P.ra[0]} : ${P.ra[1]}`, RA.ink, 28); raDots(g, 180, 110, P.ra[0], P.ra[1]); }
  else if (P.en) { const E = P.en, Pl = coPlane(g, { axes: false, n: 12, m: 6, H: 190, top: 8 }); enShape(g, Pl, E.fig, Pl.N - E.a - 1, .5, E.a, E.b, { dims: true }); if (E.k) enShape(g, Pl, E.fig, 1, .5, E.a * E.k, E.b * E.k, { fill: RA.big, dims: true }); }
  else if (P.sc) { scBadge(g, 180, 40, P.sc); if (P.n) { scPaper(g, 76, 8, 84); scLine(g, 98, P.n, RA.a, 84); } }
  if (P.f) ciEq(g, 180, 200, P.f, P.bad ? SO.bad : SO.ink, 18); }

/* ================= المشاهد ================= */
const raSay = async (L, i) => { if (L[i]) await S(L[i]); };
/* د1 الإشعال: «كوبان وست ملاعق، وكوب وثلاث ملاعق: الطعم نفسه!» */
SCENES.raHook = async c => { const L = c.lines, svg = m3Stage(250), g = el('g', { 'pointer-events': 'none' }, svg);
  [[262, 2, 6], [98, 1, 3]].forEach(([x, cups, sp]) => { for (let i = 0; i < cups; i++) raCup(g, x - (cups - 1) * 16 + i * 32, 92); for (let i = 0; i < sp; i++) raSpoon(g, x - 44 + (i % 3) * 36, 122 + Math.floor(i / 3) * 22); });
  await raSay(L, 0); ciEq(g, 262, 196, '2 : 6', RA.ink, 24); ciEq(g, 98, 196, '1 : 3', RA.ink, 24); SFX.tick(); await raSay(L, 1);
  ciEq(g, 180, 196, '=', RA.ok, 26); htLab(g, [180, 228], labelText('raPerCup'), RA.ok, 15); SFX.good(); for (const l of L.slice(2)) await S(l); };
/* د1 الاكتشاف (أ): النسبة 2 : 6، وبالقسمة على 2: 1 : 3، وبالضرب في 2: 4 : 12 */
SCENES.raShow = async c => { const L = c.lines, svg = m3Stage(250), g = el('g', { 'pointer-events': 'none' }, svg);
  ciEq(g, 180, 62, '2 : 6', RA.ink, 30); raDots(g, 180, 92, 2, 6); await raSay(L, 0);
  const arrow = (x, lab) => { el('path', { d: `M180 126 Q${(180 + x) / 2} 140 ${x} 160`, fill: 'none', stroke: RA.hl, 'stroke-width': 2.4 }, g); geoArrow(g, x, 160, x > 180 ? 60 : 120, RA.hl, 7); ciEq(g, (180 + x) / 2 + (x > 180 ? 22 : -22), 146, lab, RA.hl, 15); };
  arrow(270, '÷ 2'); ciEq(g, 270, 196, '1 : 3', RA.ok, 26); SFX.tick(); await raSay(L, 1);
  arrow(90, '× 2'); ciEq(g, 90, 196, '4 : 12', RA.ok, 26); SFX.tick(); await raSay(L, 2); for (const l of L.slice(3)) await S(l); };
/* د1 الاكتشاف (ب): جدول الأكواب والملاعق 1..4 و3..12 */
SCENES.raTableShow = async c => { const L = c.lines, svg = m3Stage(250), g = el('g', { 'pointer-events': 'none' }, svg), full = [[1, 3], [2, 6], [3, 9], [4, 12]];
  const T = raTableDraw(g, 'juice', full.map(() => [null, null]), { missMark: false }); T.cells.forEach(r => r.forEach(t => { t.textContent = ''; }));
  for (let i = 0; i < 4; i++) { T.cells[i][0].textContent = MS(String(full[i][0])); T.cells[i][0].setAttribute('fill', RA.a); T.cells[i][1].textContent = MS(String(full[i][1])); T.cells[i][1].setAttribute('fill', RA.b); SFX.tick(); if (i === 0) await raSay(L, 0); else await sleep(FAST ? 2 : 450); }
  raFactorArrows(g, T, 0, 3, '× 4'); await raSay(L, 1); for (const l of L.slice(2)) await S(l); };
/* د1 الاكتشاف (ج): 1 : 3 و2 : 6 و4 : 12 كالكسور المتكافئة ثُلث وسُدسان وأربعة أجزاء من اثني عشر */
function raFrac(g, x, y, n, d, col) { const a = el('text', { x, y: y - 6, 'text-anchor': 'middle', 'font-size': 18, 'font-weight': 800, fill: col }, g); a.textContent = MS(String(n)); geoLine(g, x - 13, y, x + 13, y, { color: col, w: 2.4 }); const b = el('text', { x, y: y + 20, 'text-anchor': 'middle', 'font-size': 18, 'font-weight': 800, fill: col }, g); b.textContent = MS(String(d)); }
SCENES.raFracShow = async c => { const L = c.lines, svg = m3Stage(250), g = el('g', { 'pointer-events': 'none' }, svg);
  [[1, 3], [2, 6], [4, 12]].forEach(([n, d], i) => { const y = 58 + i * 62, x0 = 30, W = 190; for (let j = 0; j < d; j++) el('rect', { x: x0 + j * W / d, y: y - 16, width: W / d, height: 32, fill: j < n ? RA.old : '#fff', stroke: RA.ink, 'stroke-width': 1.4 }, g);
    raFrac(g, 248, y, n, d, RA.ink); ciEq(g, 300, y + 6, `${n} : ${d}`, RA.a, 16); });
  await raSay(L, 0); geoLine(g, 30 + 190 / 3, 32, 30 + 190 / 3, 212, { color: RA.ok, w: 2.4, dash: '6 5' }); SFX.tick(); for (const l of L.slice(1)) await S(l); };

/* د2 الإشعال: «ضاعفت الضلع فضاعفت المساحة!»: المثلث الصغير مربعان، والمكبَّر ثمانية (أربع نسخ) */
SCENES.enHook = async c => { const L = c.lines, svg = m3Stage(250), Pl = enPlane(svg, 250, 12, 7, 40), g = el('g', { 'pointer-events': 'none' }, svg);
  enShape(g, Pl, 'tri', 9, 1, 2, 2, { dims: true }); enShape(g, Pl, 'tri', 1, 1, 4, 4, { fill: RA.big, dims: true }); const t = htLab(g, [120, 32], `${MS('4')} ${labelText('enSqFew')}؟`, RA.bad, 18); await raSay(L, 0); t.remove();
  const cnt = htLab(g, [130, 32], '', RA.ok, 22); await enTileShow(g, Pl, 'tri', 1, 1, 2, 2, 2, cnt); ciEq(g, 260, 32, '4 × 2 = 8', RA.ok, 18); await raSay(L, 1); for (const l of L.slice(2)) await S(l); };
/* د2 الاكتشاف (أ، ب): مربع ضلعه 2 يُكبَّر ×2: ضلعه 4، والزوايا قائمة، والمساحة 4 ثم 16 بالعدّ */
SCENES.enSqShow = async c => { const L = c.lines, svg = m3Stage(250), Pl = enPlane(svg, 250, 12, 7, 40), g = el('g', { 'pointer-events': 'none' }, svg);
  enShape(g, Pl, 'sq', 9, 1, 2, 2, { dims: true }); enBadge(g, 2, 300, 34); const big = el('g', {}, g); await sleep(FAST ? 2 : 300);
  enShape(big, Pl, 'sq', 1, 1, 4, 4, { fill: RA.big, dims: true }); for (const [x, y] of [[5, 1], [5, 5], [1, 5]]) { const [X, Y] = Pl.P(x, y), q = 8, sx = x === 5 ? -1 : 1, sy = y === 5 ? 1 : -1; el('path', { d: `M${X + sx * q} ${Y} L${X + sx * q} ${Y + sy * q} L${X} ${Y + sy * q}`, fill: 'none', stroke: RA.ink, 'stroke-width': 1.8 }, big); }
  await raSay(L, 0); big.remove(); enShape(g, Pl, 'sq', 1, 1, 4, 4, { fill: '#fff', op: 1, dims: true }); const cnt = htLab(g, [60, 32], '', RA.ok, 22);
  enTiles(g, Pl, 'rect', 9, 1, 1, 1, 2).forEach(t => t.setAttribute('fill', RA.tile[2]));
  for (let n = 1, r = 0; r < 4; r++) for (let cc = 0; cc < 4; cc++, n++) { el('rect', { x: Pl.P(1 + cc, 2 + r)[0] + 2, y: Pl.P(1 + cc, 2 + r)[1] + 2, width: Pl.c - 4, height: Pl.c - 4, rx: 3, fill: RA.tile[(Math.floor(r / 2) + Math.floor(cc / 2)) % 2], opacity: .8 }, g); cnt.textContent = MS(String(n)); SFX.tick(); await sleep(FAST ? 1 : 110); }
  ciEq(g, 262, 92, '2 × 2 = 4', RA.ok, 15); ciEq(g, 124, 52, '4 × 4 = 16', RA.ok, 15); await raSay(L, 1); for (const l of L.slice(2)) await S(l); };
/* د2 الاكتشاف (ج): مثلث ساقاه 1 و2 يُكبَّر ×3: تسع نسخ، والورق الشفّاف يطابق زواياه عند كل رأس */
SCENES.enTriShow = async c => { const L = c.lines, svg = m3Stage(250), Pl = enPlane(svg, 250, 12, 7, 40), g = el('g', { 'pointer-events': 'none' }, svg);
  enShape(g, Pl, 'tri', 9, 0, 1, 2, { dims: true }); enBadge(g, 3, 300, 34); enShape(g, Pl, 'tri', 1, 0, 3, 6, { fill: '#fff', op: 1, dims: true }); const cnt = htLab(g, [200, 70], '', RA.ok, 22);
  await enTileShow(g, Pl, 'tri', 1, 0, 1, 2, 3, cnt); ciEq(g, 220, 104, '3 × 3 = 9', RA.ok, 17); await raSay(L, 0);
  const tr = el('g', {}, g); enShape(tr, Pl, 'tri', 9, 0, 1, 2, { fill: '#fff', op: .5, dash: '6 4', stroke: RA.a, w: 2.4 });
  for (const [dx, dy] of [[-8, 0], [-6, 0], [-8, 4]]) { tr.setAttribute('transform', `translate(${dx * Pl.c} ${-dy * Pl.c})`); SFX.tick(); await sleep(FAST ? 2 : 650); }
  await raSay(L, 1); for (const l of L.slice(2)) await S(l); };
/* د2 القاعدة: المعامل يضرب الأطوال، ومربعه يضرب المساحات؛ والتكبير غير التطابق */
SCENES.enRuleShow = async c => { const L = c.lines, svg = m3Stage(250), g = el('g', { 'pointer-events': 'none' }, svg);
  ciRule(g, 180, 46, labelText('enRule'), RA.ok, 14); [['2', '2', '4', 112], ['3', '3', '9', 170]].forEach(([k, a, s, y]) => { el('rect', { x: 30, y: y - 24, width: 300, height: 46, rx: 12, fill: '#fff', stroke: RA.grid, 'stroke-width': 2 }, g); ciEq(g, 250, y + 6, `× ${k}`, RA.hl, 20); ciEq(g, 110, y + 6, `${k} × ${k} = ${s}`, RA.a, 18); });
  await raSay(L, 0); ciRule(g, 180, 222, labelText('enRuleCong'), RA.b, 13); await raSay(L, 1); for (const l of L.slice(2)) await S(l); };

/* د3 الإشعال: «الغرفة خمسة عشر متراً تدخل في الورقة!» */
SCENES.scHook = async c => { const L = c.lines, svg = m3Stage(250), g = el('g', { 'pointer-events': 'none' }, svg);
  el('rect', { x: 120, y: 60, width: 120, height: 160, rx: 4, fill: RA.paper, stroke: RA.grid, 'stroke-width': 2 }, g); htLab(g, [180, 46], labelText('scSheet'), RA.ink, 14);
  const ln = geoLine(g, 140, 140, 140, 140, { color: RA.bad, w: 5 }); await raSay(L, 0);
  for (let x = 140; x <= 320; x += 12) { ln.setAttribute('x2', x); await sleep(FAST ? 1 : 40); } geoArrow(g, 326, 140, 0, RA.bad, 9);   /* يخرج عن الورقة الصغيرة ويبقى في الإطار */ htLab(g, [300, 126], `${MS('15')} ${labelText('lenM')}`, RA.bad, 16); await raSay(L, 1); for (const l of L.slice(2)) await S(l); };
/* د3 الاكتشاف (أ): المقياس «1 سم : 3 م»، وجدارٌ 6 م يُرسم 2 سم */
SCENES.scShow = async c => { const L = c.lines, svg = m3Stage(250), g = el('g', { 'pointer-events': 'none' }, svg); scBadge(g, 180, 34, 3); scPaper(g, 84, 12); scRuler(g, 130, 12);
  for (let i = 0; i < 6; i++) { const x = 36 + i * SCU; htLab(g, [x + SCU / 2, 74], MS('3'), RA.a, 12); SFX.tick(); await sleep(FAST ? 2 : 200); }
  await raSay(L, 0); scObj(g, 'wall', 6, { y: 212 }); scLine(g, 106, 2, RA.ok); htLab(g, [36 + 2 * SCU + 34, 106], scUnitLab(2, 'cm'), RA.ok, 15); SFX.tick(); await raSay(L, 1); for (const l of L.slice(2)) await S(l); };
/* د3 الاكتشاف (ب، د): خطٌّ 5 سم على الورق = 5 × 3 = 15 م حقيقية، والوحدة مع كل طول */
SCENES.scUpShow = async c => { const L = c.lines, svg = m3Stage(250), g = el('g', { 'pointer-events': 'none' }, svg); scBadge(g, 270, 32, 3); scPaper(g, 74, 12); scLine(g, 96, 5); scRuler(g, 122, 12);
  for (let i = 0; i < 5; i++) { htLab(g, [36 + (i + .5) * SCU, 64], MS('3'), RA.a, 12); SFX.tick(); await sleep(FAST ? 2 : 260); }
  ciEq(g, 180, 184, '5 × 3 = 15', RA.ok, 20); await raSay(L, 0); const t = el('g', {}, g); el('rect', { x: 40, y: 200, width: 280, height: 36, rx: 10, fill: '#fff', stroke: RA.ok, 'stroke-width': 2 }, t);
  htLab(t, [180, 216], `${scUnitLab(5, 'cm')} ${labelText('scOnPaper')} = ${scUnitLab(15, 'm')} ${labelText('scReal')}`, RA.ok, 14); SFX.tick(); await raSay(L, 1); for (const l of L.slice(2)) await S(l); };
/* د3 الاكتشاف (ج): حافلة صغيرة 6 م تُرسم 6 ÷ 3 = 2 سم */
SCENES.scDownShow = async c => { const L = c.lines, svg = m3Stage(250), g = el('g', { 'pointer-events': 'none' }, svg); scBadge(g, 270, 32, 3); scObj(g, 'bus', 6, { y: 100 }); scPaper(g, 146, 12);
  await raSay(L, 0); scLine(g, 168, 2, RA.ok); ciEq(g, 180, 222, '6 ÷ 3 = 2', RA.ok, 20); SFX.tick(); await raSay(L, 1); for (const l of L.slice(2)) await S(l); };
/* د4 المشروع «خريطة غرفتي»: غرفة 9 × 6 م بمقياس 1 سم : 3 م (3 × 2 سم)، والسجادة 3 × 3 م والرفّ 6 م، ثم الجدول */
SCENES.roomShow = async c => { const L = c.lines, svg = m3Stage(262);
  if (c.table) { const g = el('g', { 'pointer-events': 'none' }, svg), rows = [['scT.item', 'scT.real', 'scT.paper', 1], ['scT.room', '9 × 6', '3 × 2'], ['scT.rug', '3 × 3', '1 × 1'], ['scT.shelf', '6', '2']];
    rows.forEach(([k, r, p, head], i) => { const y = 30 + i * 52; el('rect', { x: 26, y, width: 308, height: 44, rx: 10, fill: head ? '#e8f1fb' : i % 2 ? '#fff' : '#f6eccf', stroke: RA.grid, 'stroke-width': 2 }, g);
      const a = el('text', { x: 322, y: y + 28, 'text-anchor': 'start', 'font-size': 14, 'font-weight': 800, fill: RA.ink, direction: 'rtl' }, g); a.textContent = labelText(k);
      if (head) { for (const [x, kk] of [[188, r], [80, p]]) { const t = el('text', { x, y: y + 28, 'text-anchor': 'middle', 'font-size': 14, 'font-weight': 800, fill: RA.ink, direction: 'rtl' }, g); t.textContent = labelText(kk); } }
      else { ciEq(g, 188, y + 28, r, RA.b, 15); htLab(g, [228, y + 22], labelText('lenM'), RA.b, 13); ciEq(g, 80, y + 28, p, RA.a, 15); htLab(g, [122, y + 22], labelText('rulCm'), RA.a, 13); } });
    for (const l of L) await S(l); return; }
  const g = el('g', { 'pointer-events': 'none' }, svg), U = 56, x0 = 180 - 1.5 * U, y0 = 70; scBadge(g, 270, 32, 3);
  for (let i = 0; i <= 5; i++) geoLine(g, x0 - U + i * U, y0 - 16, x0 - U + i * U, y0 + 2 * U + 30, { color: '#e6dcc4', w: 1 }); for (let j = 0; j <= 3; j++) geoLine(g, x0 - U, y0 + j * U, x0 + 4 * U, y0 + j * U, { color: '#e6dcc4', w: 1 });
  el('rect', { x: x0, y: y0, width: 3 * U, height: 2 * U, fill: '#fffdf6', stroke: RA.ink, 'stroke-width': 3.4 }, g); htLab(g, [180, y0 + 2 * U + 18], scUnitLab(3, 'cm'), RA.a, 15); htLab(g, [x0 - 26, y0 + U], scUnitLab(2, 'cm'), RA.a, 15);
  await raSay(L, 0); el('rect', { x: x0 + 2 * U, y: y0 + U, width: U, height: U, fill: '#e9a3c0', 'fill-opacity': .7, stroke: RA.ink, 'stroke-width': 2 }, g); geoLine(g, x0 + 4, y0 + 6, x0 + 2 * U, y0 + 6, { color: '#9b6b3a', w: 7 }); SFX.tick(); await raSay(L, 1);
  const d = geoLine(g, x0, y0 + 2 * U - 10, x0 + 2 * U, y0 + 2 * U - 10, { color: RA.hl, w: 3, dash: '6 5' }); el('rect', { x: x0 - 2, y: y0 + U + 18, width: 6, height: U - 20, fill: '#8a4f2a' }, g); ciEq(g, x0 + U, y0 + 2 * U - 18, '2 × 3 = 6', RA.hl, 14); SFX.tick(); await raSay(L, 2); for (const l of L.slice(3)) await S(l); };
WRAP_ART.mapArt = svg => { const g = el('g', { 'pointer-events': 'none' }, svg); el('rect', { x: 70, y: 40, width: 220, height: 150, rx: 8, fill: RA.paper, stroke: RA.grid, 'stroke-width': 2 }, g);
  geoLine(g, 70, 110, 290, 110, { color: '#9a948a', w: 10 }); geoLine(g, 180, 40, 180, 190, { color: '#9a948a', w: 10 }); for (const [x, y] of [[100, 60], [220, 60], [100, 130], [220, 140]]) el('rect', { x, y, width: 40, height: 30, rx: 4, fill: '#f2c46b', stroke: '#8a6a1a', 'stroke-width': 2 }, g); scBadge(g, 180, 210, 3); };
