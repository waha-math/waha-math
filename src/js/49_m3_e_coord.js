/* =====================================================================
   S3-U5 «الإحداثيات (الربع الأول)» (المرحلة 3، نوفمبر 2026)
   د1 المحوران والزوج المرتب (C311 أ) · د2 قراءة الإحداثيين وترتيبهما والمحوران وأنصاف الوحدة (C311 ب) · د3 المسافة على خط أفقي أو رأسي (C336)
   د4 الأشكال من إحداثيات رؤوسها والرأس المجهول (C337) ومشروع «خريطة مدينتي»
   الزوج المرتب يُكتب (الأفقي ، الرأسي) باتجاه خطّه: من اليمين مع الأرقام المشرقية، ومن اليسار مع الغربية (D280، يعدّل D84)، ويُقال ترتيبه بالكلمات: «… يميناً، و… لأعلى»
   المحوران «س وص» ذهبيان (هوية م3)، والنقاط عند التقاطعات لا داخل المربعات
   ===================================================================== */
const CO = { grid: '#d9e4ea', ax: '#c9971c', ink: '#33454c', pt: '#3d7cc0', pt2: '#e07b39', ok: '#2f9d6b', bad: '#c8392d', fill: '#eef4f8', path: '#8e6bbf' };
/* الزوج المرتب نصّاً (D280، قرار فراس 26 نوفمبر 2026، يعدّل D84): الاتجاه يتبع خطّ الرموز. مع الأرقام المشرقية أو الحروف العربية من اليمين،
   فالإحداثي الأول في أقصى اليمين والسالب على يمين العدد، معزولاً (RLI) لا مقلوباً فيبقى رقما العدد في موضعهما؛ ومع الأرقام الغربية من اليسار (LRO) */
const coRtl = (...s) => SET.digits === 'east' || /[\u0621-\u064A]/.test(s.join(''));
const coPair = (x, y) => coRtl(x, y) ? `\u2067(${x} ، ${y})\u2069` : `\u202D(${x} ، ${y})\u202C`;
const coKey = v => String(v).replace('.', '_');
const coLine = (x, y) => 'gen.co.p.' + coKey(x) + '.' + coKey(y);
/* المستوى الإحداثي: n تدريج المحور الأفقي، وm الرأسي؛ الأصل أسفل اليسار، والمحوران ذهبيان بسهمين واسميهما «س» و«ص» */
function coPlane(svg, o = {}) { const N = o.n || 10, Mx = o.m || 8, H = o.H || 262, c = Math.min(26, 286 / (N + .9), (H - 62) / (Mx + .9)), x0 = Math.round((360 - N * c) / 2) + 10, y0 = (o.top ?? 18) + Mx * c + 8, g = el('g', { 'pointer-events': 'none', 'data-plane': 1 }, svg);
  el('rect', { x: x0 - 30, y: y0 - Mx * c - 18, width: N * c + 54, height: Mx * c + 46, rx: 10, fill: '#fffdf6', stroke: CO.grid, 'stroke-width': 2 }, g);
  for (let i = 0; i <= N; i++) geoLine(g, x0 + i * c, y0, x0 + i * c, y0 - Mx * c, { color: CO.grid, w: 1.2 }); for (let j = 0; j <= Mx; j++) geoLine(g, x0, y0 - j * c, x0 + N * c, y0 - j * c, { color: CO.grid, w: 1.2 });
  if (o.axes !== false) { geoLine(g, x0, y0, x0 + N * c + 12, y0, { color: CO.ax, w: 3.4 }); geoArrow(g, x0 + N * c + 14, y0, 0, CO.ax, 8); geoLine(g, x0, y0, x0, y0 - Mx * c - 10, { color: CO.ax, w: 3.4 }); geoArrow(g, x0, y0 - Mx * c - 12, -90, CO.ax, 8);
    const T = (x, y, s, fs = 12, col = CO.ink) => { const t = el('text', { x, y, 'text-anchor': 'middle', 'font-size': fs, 'font-weight': 700, fill: col }, g); t.textContent = s; return t; };
    if (o.nums !== false) { for (let i = 0; i <= N; i++) T(x0 + i * c, y0 + 16, String(i)); for (let j = 1; j <= Mx; j++) T(x0 - 12, y0 - j * c + 4, String(j)); }
    T(x0 + N * c + 14, y0 + 20, labelText('coX'), 14, CO.ax); T(x0 - 14, y0 - Mx * c - 6, labelText('coY'), 14, CO.ax); }
  const P = (x, y) => [x0 + x * c, y0 - y * c];
  return { g, P, c, x0, y0, N, M: Mx, snap(q, half) { const s = half ? 2 : 1, f = v => Math.round(v * s) / s; return [Math.max(0, Math.min(N, f((q[0] - x0) / c))), Math.max(0, Math.min(Mx, f((y0 - q[1]) / c)))]; } }; }
/* نصّ الزوج على المسرح: من اليمين (rtl بلا تجاوز) مع المشرقية، ومن اليسار بتجاوز الاتجاه مع الغربية (D280) */
function coPairText(parent, px, py, x, y, anchor = 'middle', fs = 14, col = CO.ink) { const rtl = coRtl(x, y), an = rtl ? ({ start: 'end', end: 'start' }[anchor] || anchor) : anchor;   /* بـ rtl تتبادل البداية والنهاية، فيبقى الزوج في جهته من النقطة */
  const t = el('text', { x: px, y: py, 'text-anchor': an, 'font-size': fs, 'font-weight': 800, fill: col, stroke: '#fff', 'stroke-width': 4, 'paint-order': 'stroke', direction: rtl ? 'rtl' : 'ltr', ...(rtl ? {} : { 'unicode-bidi': 'bidi-override' }), 'pointer-events': 'none' }, parent); t.textContent = `(${x} ، ${y})`; return t; }
/* نقطة باسمها وزوجها (pair) إن طُلب؛ at: side (يميناً، ويساراً عند الحافة) أو up (فوقها) أو away (بعيداً عن مركز الشكل from) */
function coDot(parent, Pl, x, y, o = {}) { const [px, py] = Pl.P(x, y), g = el('g', { 'pointer-events': 'none' }, parent), left = x > Pl.N - 2.5;
  if (o.art === 'treasure') { el('path', { d: `M${px - 8} ${py - 8} L${px + 8} ${py + 8} M${px + 8} ${py - 8} L${px - 8} ${py + 8}`, stroke: CO.bad, 'stroke-width': 4, 'stroke-linecap': 'round' }, g); }
  else if (o.art === 'island') { el('ellipse', { cx: px, cy: py + 2, rx: 13, ry: 7, fill: '#e9d9a6', stroke: '#b9a26a', 'stroke-width': 1.5 }, g); el('path', { d: `M${px} ${py + 1} L${px + 1} ${py - 14} M${px + 1} ${py - 14} Q${px + 9} ${py - 18} ${px + 12} ${py - 12} M${px + 1} ${py - 14} Q${px - 7} ${py - 19} ${px - 11} ${py - 12}`, fill: 'none', stroke: '#4c8a3a', 'stroke-width': 2.4, 'stroke-linecap': 'round' }, g); el('circle', { cx: px, cy: py, r: 3.5, fill: CO.ink }, g); }
  else el('circle', { cx: px, cy: py, r: o.r || 6.5, fill: o.col || CO.pt, stroke: '#fff', 'stroke-width': 2 }, g);
  const fs = o.fs || 15, lab = (s, X, Y, anchor) => { const t = el('text', { x: X, y: Y, 'text-anchor': anchor, 'font-size': fs, 'font-weight': 800, fill: o.col || CO.ink, stroke: '#fff', 'stroke-width': 4, 'paint-order': 'stroke', direction: 'rtl' }, g); t.textContent = s; return t; };
  const pw = fs * 3.2;   /* عرض الزوج تقريباً */
  if (o.at === 'away' && o.from) { const d = [px - o.from[0], py - o.from[1]], L = Math.hypot(...d) || 1, u = [d[0] / L, d[1] / L], a = u[0] > .35 ? 'start' : u[0] < -.35 ? 'end' : 'middle';
    if (o.pair) coPairText(g, px + u[0] * 10, py + u[1] * 14 + 5, x, y, a, fs); return g; }
  if (o.at === 'up') { if (o.pair) coPairText(g, px - (o.name ? 7 : 0), py - 11, x, y, 'middle', fs); if (o.name) lab(LTR[o.name], px + (o.pair ? pw / 2 + 2 : 0), py - 11, 'middle'); return g; }
  if (o.name) lab(LTR[o.name], left ? px - 10 : px + 10, py - 10, left ? 'end' : 'start');
  if (o.pair) coPairText(g, left ? px - (o.name ? 24 : 10) : px + (o.name ? 24 : 10), py - 10, x, y, left ? 'end' : 'start', fs);
  return g; }
/* السير من الأصل: قفزات يميناً ثم إلى الأعلى (الحلّ المشترك والكشف) */
async function coWalk(svg, Pl, x, y, o = {}) { const m = helpG(svg); let last = Pl.P(0, 0);
  for (let i = 1; i <= Math.ceil(x); i++) { const nx = Math.min(i, x), q = Pl.P(nx, 0); el('path', { d: `M${last[0]} ${last[1]} Q${(last[0] + q[0]) / 2} ${last[1] - 14} ${q[0]} ${q[1]}`, fill: 'none', stroke: css('--compass'), 'stroke-width': 2.6 }, m); last = q; SFX.tick(); await sleep(FAST ? 2 : (o.ms || 170)); }
  if (o.upTo === 'x') return m;
  for (let j = 1; j <= Math.ceil(y); j++) { const ny = Math.min(j, y), q = Pl.P(x, ny); el('path', { d: `M${last[0]} ${last[1]} Q${last[0] + 14} ${(last[1] + q[1]) / 2} ${q[0]} ${q[1]}`, fill: 'none', stroke: THINK_INK, 'stroke-width': 2.6 }, m); last = q; SFX.tick(); await sleep(FAST ? 2 : (o.ms || 170)); }
  return m; }
/* بطاقة الهدف فوق المستوى: الحرف والزوج */
function coCard(svg, x, y, name, o = {}) { const g = el('g', { 'pointer-events': 'none' }, svg), w = o.w || (name ? 126 : 106), col = o.col || CO.pt; el('rect', { x: 352 - w, y: 4, width: w, height: 30, rx: 10, fill: '#fff', stroke: col, 'stroke-width': 2 }, g);
  coPairText(g, 352 - w / 2 - (name ? 9 : 0), 25, x, y, 'middle', 17, col);   /* الزوج وحده نصٌّ باتجاه خطّه (D280)، والحرف نصٌّ آخر */
  if (name) { const a = el('text', { x: 342, y: 25, 'text-anchor': 'start', 'font-size': 17, 'font-weight': 800, fill: col, direction: 'rtl' }, g); a.textContent = LTR[name]; } return g; }

/* ================= ① عيّن النقطة (C311): x، y، name، half (أنصاف الوحدة، د2)، given نقاط مرسومة [[x، y، حرف]]، poly أضلاع متقطّعة بينها، art treasure ================= */
ITEM.coordPlace = {
  make(spec) { /*T*/if (TESTHOOK && (!Number.isInteger(spec.x * 2) || !Number.isInteger(spec.y * 2) || (!spec.half && (spec.x % 1 || spec.y % 1)))) testBug('coordPlace: إحداثي غير صالح');/*/T*/ return { ...spec, tag: 'coord-place' + (spec.half ? '-half' : '') + (spec.given ? '-vertex' : '') }; },
  async ask(item, mode, tries) { const svg = m3Stage(262), Pl = coPlane(svg, { n: item.n, m: item.m }); let cur = null, dot = null, walk = null, done = false;
    if (item.poly) { const Q = item.poly.map(p => Pl.P(...p)); el('polyline', { points: polyStr(Q), fill: 'none', stroke: CO.path, 'stroke-width': 3, 'stroke-dasharray': '7 5', 'pointer-events': 'none' }, svg); }
    for (const [gx, gy, gk] of item.given || []) coDot(svg, Pl, gx, gy, { name: gk, pair: true, col: CO.pt2, fs: 13 });
    if (!item.given && !item.hideCard) coCard(svg, item.x, item.y, item.name);
    if (tries >= 3) walk = await coWalk(svg, Pl, item.x, item.y, { upTo: 'x' });   /* الحلّ المشترك: قفزات اليمين مرسومة، والصعود للطفل */
    const askQ = async () => { await S(tries >= 3 ? 'gen.co.together.place' : item.q || 'gen.co.q.place', { noGap: true }); if (!item.given && !item.noPair) await S(coLine(item.x, item.y), { append: true }); };
    askQ(); REPLAY_HOOK = () => askQ(); REPLAY_HOOK.live = () => !done && svg.isConnected;
    const set = (x, y) => { cur = [x, y]; if (dot) dot.remove(); dot = coDot(svg, Pl, x, y, { name: item.given ? null : item.name, art: item.art, col: CO.pt }); /*T*/window.__gridPt = cur;/*/T*/ };
    const input = fingerInput(svg, { map: e => { const q = svgPoint(svg, e); return [q.x, q.y]; }, down(q) { if (q[1] > Pl.y0 + 22 || q[1] < Pl.y0 - Pl.M * Pl.c - 20) return false; set(...Pl.snap(q, item.half)); SFX.tick(); }, move(q) { set(...Pl.snap(q, item.half)); }, up() {} });
    /*T*/window.__gridPtAt = (x, y) => { const m = svg.getScreenCTM(), [px, py] = Pl.P(x, y); return { x: m.a * px + m.e, y: m.d * py + m.f }; }; window.__gridPtWant = [item.x, item.y];/*/T*/
    /* بلوحة المفاتيح: كل تقاطع خانةٌ تُركَّز، ومفتاح الفعل يضع النقطة عندها (كما في S2-U1) */
    const kg = el('g', { role: 'grid', 'aria-label': labelText('coPlane') }, svg), st = item.half ? .5 : 1;
    for (let y = Pl.M; y >= 0; y -= st) { const row = el('g', { role: 'row' }, kg); for (let x = 0; x <= Pl.N; x += st) { const [px, py] = Pl.P(x, y), b = el('g', { role: 'gridcell', tabindex: 0, 'aria-label': `${labelText('coRight')} ${x}، ${labelText('coUp')} ${y}` }, row); el('circle', { cx: px, cy: py, r: 8, fill: 'transparent', 'pointer-events': 'none' }, b); b.onkeydown = e => { if (isActKey(e)) { e.preventDefault(); set(x, y); SFX.tick(); } }; } }
    AUTO({ kind: 'gridPt', ok: () => { set(item.x, item.y); rulDoneBtn().click(); }, wrong: () => { set(item.y <= Pl.N && item.x <= Pl.M && item.x !== item.y ? item.y : Math.min(Pl.N, item.x + 1), item.x !== item.y ? item.x : item.y); rulDoneBtn().click(); } });
    await rulDone(() => { done = true; REPLAY_HOOK = null; input.off(); kg.remove(); }); return { ans: cur || [-1, -1], ctx: { svg, Pl, set, walk } }; },
  judge(item, a) { if (a[0] === item.x && a[1] === item.y) return { ok: true }; if (item.mid) return { ok: false, err: 'rotMid' }; return { ok: false, err: a[0] === item.y && a[1] === item.x ? 'coordSwap' : (a[0] === item.x - 1 && a[1] === item.y - 1) || (a[0] === item.x + 1 && a[1] === item.y + 1) ? 'coordFromOne' : item.half && (a[0] === Math.floor(item.x) || a[0] === Math.ceil(item.x) || a[1] === Math.floor(item.y) || a[1] === Math.ceil(item.y)) && (item.x % 1 || item.y % 1) ? 'coordHalf' : item.given ? 'coordVertex' : 'coordOff' }; },
  onOk() { SFX.good(); }, onWrong() { SFX.soft(); },
  /* المستوى الثاني يبقى حتى يجيب (D240؛ المراجع A لبوابة S3-U4/U5، 8): القفزات من الأصل، أو خطّا الشبكة المارّان بالرأسين المعلومين */
  async hint2(item, r) { if (item.mid) { await S('gen.xf.hint.mid'); return; }
    if (item.given) { const m = helpG(r.ctx.svg), Pl = r.ctx.Pl; for (const [gx, gy] of item.given) { const P = Pl.P(gx, gy); geoLine(m, Pl.x0, P[1], Pl.x0 + Pl.N * Pl.c, P[1], { color: THINK_INK, w: 1.6, dash: '5 4' }); geoLine(m, P[0], Pl.y0, P[0], Pl.y0 - Pl.M * Pl.c, { color: THINK_INK, w: 1.6, dash: '5 4' }); } await S('gen.co.hint.vertex'); return; }
    await coWalk(r.ctx.svg, r.ctx.Pl, item.x, item.y, { ms: 230 }); await S('gen.co.hint.place'); }, async together() {},
  async reveal(item, r) { if (r.ctx.walk) r.ctx.walk.remove(); if (!item.given) await coWalk(r.ctx.svg, r.ctx.Pl, item.x, item.y, { ms: 140 }); r.ctx.set(item.x, item.y); await S('gen.co.reveal.place', { noGap: true }); await S(coLine(item.x, item.y), { append: true }); },
  praise: () => 'praisePlace', twin(item) { return item.twin || null; },
};

/* ================= ② اقرأ إحداثيي النقطة (C311): x، y، name، art island (قبطان السفينة)؛ والخيارات أزواج: الصحيح، والمقلوب، وعدّ المربعات أو جار ================= */
ITEM.coordRead = {
  make(spec) { const { x, y } = spec, alt = [[y, x], [x + 1, y + 1], [x - 1, y], [x, y + 1], [x + 1, y]].filter(([a, b]) => (a !== x || b !== y) && a >= 0 && b >= 0 && a <= (spec.n || 10) && b <= (spec.m || 8)), ch = [];
    for (const p of alt) if (ch.length < 2 && !ch.some(q => q[0] === p[0] && q[1] === p[1])) ch.push(p);
    return { ...spec, ch: [[x, y], ...ch], want: x + ',' + y, tag: 'coord-read' + (spec.art ? '-' + spec.art : '') }; },
  async ask(item, mode, tries) { const svg = m3Stage(262), Pl = coPlane(svg, { n: item.n, m: item.m }); coDot(svg, Pl, item.x, item.y, { name: item.art ? null : item.name || 'a', art: item.art }); let walk = null;
    if (tries >= 3) { walk = await coWalk(svg, Pl, item.x, item.y); await S('gen.co.together.read'); } else await S(item.q || (item.art ? 'gen.co.q.ship' : 'gen.co.q.read'));
    const k = await choosePick(shuffle(item.ch.map(([a, b]) => [a + ',' + b, coPair(a, b), '<i></i>', coLine(a, b)])), item.want); return { ans: k, ctx: { svg, Pl, walk } }; },
  judge(item, k) { if (k === item.want) return { ok: true }; const [a, b] = k.split(',').map(Number); return { ok: false, err: a === item.y && b === item.x ? 'coordSwap' : a === item.x + 1 && b === item.y + 1 ? 'coordSquare' : 'coordOff' }; },
  onOk() { SFX.good(); }, onWrong() { SFX.soft(); },
  async hint2(item, r) { if (r && r.ctx && r.ctx.Pl) { const m = helpG(r.ctx.svg), Pl = r.ctx.Pl, P = Pl.P(item.x, item.y); geoLine(m, P[0], P[1], P[0], Pl.y0, { color: THINK_INK, w: 2, dash: '5 4' }); geoLine(m, P[0], P[1], Pl.x0, P[1], { color: THINK_INK, w: 2, dash: '5 4' }); }   /* النزول إلى المحور الأفقي والسير إلى الرأسي على خطّي الشبكة */
    await S('gen.co.hint.read'); }, async together() {},
  async reveal(item, r) { if (!r.ctx.walk) await coWalk(r.ctx.svg, r.ctx.Pl, item.x, item.y, { ms: 140 }); await S(coLine(item.x, item.y)); },
  praise: () => 'praisePlace', twin(item) { return item.twin || null; },
};

/* ================= ③ أين النقطة؟ (C311 ب): على المحور الأفقي، أو الرأسي، أو الأصل، أو داخل الربع؛ x، y ================= */
const CO_WHERE = (x, y) => x === 0 && y === 0 ? 'origin' : y === 0 ? 'h' : x === 0 ? 'v' : 'in';
ITEM.coordWhere = {
  make(spec) { return { ...spec, want: CO_WHERE(spec.x, spec.y), tag: 'coord-where' }; },
  async ask(item, mode, tries) { const svg = m3Stage(262), Pl = coPlane(svg, {}); coCard(svg, item.x, item.y, null); if (tries >= 3) { const m = await coWalk(svg, Pl, item.x, item.y); void m; await S('gen.co.together.where'); } else { await S(item.q || 'gen.co.q.where', { noGap: true }); await S(coLine(item.x, item.y), { append: true }); }
    const k = await choosePick(['h', 'v', 'origin', 'in'].map(w => [w, labelText('coW.' + w), '<i></i>', 'gen.co.w.' + w]), item.want); return { ans: k, ctx: { svg, Pl } }; },
  judge(item, k) { return k === item.want ? { ok: true } : { ok: false, err: (k === 'h' && item.want === 'v') || (k === 'v' && item.want === 'h') ? 'coordAxisSwap' : 'coordWhereOff' }; },
  onOk(item, r) { SFX.good(); coDot(r.ctx.svg, r.ctx.Pl, item.x, item.y, { pair: true }); }, onWrong() { SFX.soft(); },
  async hint2(item, r) { if (r && r.ctx && r.ctx.Pl) { const m = helpG(r.ctx.svg), Pl = r.ctx.Pl; geoLine(m, Pl.x0, Pl.y0, Pl.x0 + Pl.N * Pl.c, Pl.y0, { color: '#3d7cc0', w: 6 }); geoLine(m, Pl.x0, Pl.y0, Pl.x0, Pl.y0 - Pl.M * Pl.c, { color: '#2f9d6b', w: 6 }); el('circle', { cx: Pl.x0, cy: Pl.y0, r: 8, fill: THINK_INK }, m); }   /* المحوران ملوّنان والأصل معلَّم */
    await S('gen.co.hint.where'); }, async together() {},
  async reveal(item, r) { coDot(r.ctx.svg, r.ctx.Pl, item.x, item.y, { pair: true }); await S('gen.co.w.' + item.want); },
  praise: () => 'praiseThink', twin(item) { return item.twin || null; },
};

/* ================= ④ المسافة بين نقطتين على خط أفقي أو رأسي (C336): a [x، y]، b [x، y]؛ art stations (لعبة المسافر) ================= */
ITEM.coordDist = { ...numItem,
  make(spec) { const [a, b] = [spec.a, spec.b], hz = a[1] === b[1], want = hz ? Math.abs(a[0] - b[0]) : Math.abs(a[1] - b[1]);
    /*T*/if (TESTHOOK && a[0] !== b[0] && a[1] !== b[1]) testBug('coordDist: النقطتان ليستا على خط أفقي أو رأسي');/*/T*/
    const sum = hz ? a[0] + b[0] : a[1] + b[1]; return { ...spec, hz, want, nums: rulNear(want, sum !== want ? sum : want + 2, want + 1, want - 1), tag: 'coord-dist-' + (hz ? 'h' : 'v') + (spec.art ? '-' + spec.art : '') }; },
  async ask(item, mode, tries) { const svg = m3Stage(262), Pl = coPlane(svg, { n: item.n, m: item.m }); const st = item.art === 'stations';
    if (st) { const A = Pl.P(...item.a), B = Pl.P(...item.b); geoLine(svg, A[0], A[1], B[0], B[1], { color: CO.path, w: 4 }); }
    const at = item.hz ? 'up' : 'side'; coDot(svg, Pl, ...item.a, { name: 'a', pair: true, at, fs: 13, col: st ? CO.pt2 : CO.pt }); coDot(svg, Pl, ...item.b, { name: 'b', pair: true, at, fs: 13, col: st ? CO.pt2 : CO.pt });
    if (tries >= 3) { const m = helpG(svg), [lo, hi] = item.hz ? [Math.min(item.a[0], item.b[0]), Math.max(item.a[0], item.b[0])] : [Math.min(item.a[1], item.b[1]), Math.max(item.a[1], item.b[1])];
      for (let v = lo; v < Math.min(hi, lo + 2); v++) { const p = item.hz ? Pl.P(v, item.a[1]) : Pl.P(item.a[0], v), q = item.hz ? Pl.P(v + 1, item.a[1]) : Pl.P(item.a[0], v + 1); el('path', { d: item.hz ? `M${p[0]} ${p[1]} Q${(p[0] + q[0]) / 2} ${p[1] - 14} ${q[0]} ${q[1]}` : `M${p[0]} ${p[1]} Q${p[0] + 14} ${(p[1] + q[1]) / 2} ${q[0]} ${q[1]}`, fill: 'none', stroke: THINK_INK, 'stroke-width': 2.6 }, m); }
      await S('gen.co.together.dist'); }
    else await S(item.q || (st ? 'gen.co.q.travel' : 'gen.co.q.dist'));
    const np = numberPick(shuffle(item.nums), item.want, { west: true }); return { ans: await np.p, ctx: { svg, Pl } }; },
  judge(item, k) { if (k === item.want) return { ok: true }; const sum = item.hz ? item.a[0] + item.b[0] : item.a[1] + item.b[1]; return { ok: false, err: k === sum ? 'coordDistSum' : k === item.want + 1 ? 'coordDistLines' : 'coordDistOff' }; },
  async hint2(item, r) { if (r && r.ctx && r.ctx.Pl) { const A = r.ctx.Pl.P(...item.a), B = r.ctx.Pl.P(...item.b); geoLine(helpG(r.ctx.svg), A[0], A[1], B[0], B[1], { color: THINK_INK, w: 5 }); }   /* المسافة على هذا الخطّ */
    await S('gen.co.hint.dist'); }, async together() {},
  async reveal(item) { await S('gen.ht.reveal.num', { noGap: true }); await S(numw(item.want), { append: true }); },
  praise: () => 'praiseThink', twin(item) { return item.twin || null; },
};

/* ================= ⑤ على أيّ خطّ؟ (C336): a، b؛ أفقي أم رأسي أم لا هذا ولا ذاك (فتُقاس بالمسطرة) ================= */
ITEM.coordAlign = {
  make(spec) { const w = spec.a[1] === spec.b[1] ? 'h' : spec.a[0] === spec.b[0] ? 'v' : 'none'; return { ...spec, want: w, tag: 'coord-align' }; },
  async ask(item, mode, tries) { const svg = m3Stage(262), Pl = coPlane(svg, {}); coDot(svg, Pl, ...item.a, { name: 'a', pair: true }); coDot(svg, Pl, ...item.b, { name: 'b', pair: true });
    if (tries >= 3) { const m = helpG(svg), A = Pl.P(...item.a); geoLine(m, Pl.x0, A[1], Pl.x0 + Pl.N * Pl.c, A[1], { color: THINK_INK, w: 1.6, dash: '5 4' }); geoLine(m, A[0], Pl.y0, A[0], Pl.y0 - Pl.M * Pl.c, { color: THINK_INK, w: 1.6, dash: '5 4' }); await S('gen.co.together.align'); } else await S(item.q || 'gen.co.q.align');
    const k = await choosePick(['h', 'v', 'none'].map(w => [w, labelText('coA.' + w), '<i></i>', 'gen.co.a.' + w]), item.want); return { ans: k, ctx: { svg, Pl } }; },
  judge(item, k) { return k === item.want ? { ok: true } : { ok: false, err: item.want === 'none' ? 'coordDiag' : k === 'none' ? 'coordAlignMiss' : 'coordAxisSwap' }; },
  onOk() { SFX.good(); }, onWrong() { SFX.soft(); },
  async hint2(item, r) { if (r && r.ctx && r.ctx.Pl) { const Pl = r.ctx.Pl, A = Pl.P(...item.a); geoLine(helpG(r.ctx.svg), Pl.x0, A[1], Pl.x0 + Pl.N * Pl.c, A[1], { color: THINK_INK, w: 1.8, dash: '5 4' }); }   /* الخطّ الأفقي المارّ بالأولى: أتمرّ به الثانية؟ */
    await S('gen.co.hint.align'); }, async together() {},
  async reveal(item, r) { const A = r.ctx.Pl.P(...item.a), B = r.ctx.Pl.P(...item.b); geoLine(r.ctx.svg, A[0], A[1], B[0], B[1], { color: CO.ok, w: 3, dash: item.want === 'none' ? '6 4' : null }); await S('gen.co.a.' + item.want); },
  praise: () => 'praiseLook', twin(item) { return item.twin || null; },
};

/* ================= ⑥ «رسّام الإحداثيات» (C337، اللعبة): pts رؤوس بالترتيب؛ يلمس الطفل كل رأس فيُوصَل بما قبله، ولمسة على آخر رأس تمحوه، ثم «تمّ» ================= */
ITEM.coordDraw = {
  make(spec) { return { ...spec, want: spec.pts.map(p => p.join(',')).join(' '), tag: 'coord-draw' }; },
  async ask(item, mode, tries) { const svg = m3Stage(262), Pl = coPlane(svg, { n: item.n, m: item.m, top: item.pts.length > 4 ? 46 : 40 }), placed = [], lay = el('g', { 'pointer-events': 'none' }, svg); let done = false;
    const list = el('g', { 'pointer-events': 'none' }, svg), NM = ['a', 'b', 'j', 'd', 'h', 'w'], per = item.pts.length > 4 ? Math.ceil(item.pts.length / 2) : item.pts.length, W = Math.min(84, 344 / per);   /* القائمة من اليمين بالترتيب، كل رأس بحرفه؛ وفوق أربعة رؤوس صفّان (المراجع A لبوابة S3-U4/U5، 22) */
    item.pts.forEach((p, i) => { const x = 352 - (i % per) * W, yy = 18 + Math.floor(i / per) * 17, a = el('text', { x, y: yy, 'text-anchor': 'start', 'font-size': 13, 'font-weight': 800, fill: CO.pt2, direction: 'rtl' }, list); a.textContent = LTR[NM[i]]; coPairText(list, x - 12, yy, p[0], p[1], 'end', 12, CO.pt); });
    const redraw = () => { lay.innerHTML = ''; const Q = placed.map(p => Pl.P(...p)); if (Q.length > 1) el('polyline', { points: polyStr(Q), fill: 'none', stroke: CO.pt, 'stroke-width': 3 }, lay);
      if (placed.length === item.pts.length && placed.length > 2) { geoLine(lay, Q[Q.length - 1][0], Q[Q.length - 1][1], Q[0][0], Q[0][1], { color: CO.pt, w: 3 }); el('polygon', { points: polyStr(Q), fill: CO.fill, opacity: .6 }, lay); }
      placed.forEach((p, i) => coDot(lay, Pl, ...p, { r: 5.5, name: NM[i], fs: 13 })); /*T*/window.__axPlaced = placed.length;/*/T*/ };
    let lastQ = null; const tapAt = q => { const p = Pl.snap(q); const L = placed[placed.length - 1]; if (L && L[0] === p[0] && L[1] === p[1]) placed.pop(); else if (placed.length < item.pts.length) placed.push(p); SFX.tick(); redraw(); };
    if (tries >= 3) { placed.push(...item.pts.slice(0, item.pts.length - 1)); redraw(); }   /* الحلّ المشترك: الرؤوس إلا الأخير */
    await S(tries >= 3 ? 'gen.co.together.draw' : item.q || 'gen.co.q.draw');
    const input = fingerInput(svg, { map: e => { const q = svgPoint(svg, e); return [q.x, q.y]; }, down(q) { if (q[1] > Pl.y0 + 22 || q[1] < Pl.y0 - Pl.M * Pl.c - 20) return false; lastQ = q; }, move(q) { lastQ = q; }, up(cancel) { if (!cancel && lastQ) tapAt(lastQ); lastQ = null; } });   /* يُعيَّن الرأس عند رفع الإصبع */
    /*T*/window.__axWant = item.pts; window.__axAt = (x, y) => { const m = svg.getScreenCTM(), [px, py] = Pl.P(x, y); return { x: m.a * px + m.e, y: m.d * py + m.f }; }; window.__axPlaced = placed.length;/*/T*/
    const kg = el('g', { role: 'grid', 'aria-label': labelText('coPlane') }, svg); for (let y = Pl.M; y >= 0; y--) { const row = el('g', { role: 'row' }, kg); for (let x = 0; x <= Pl.N; x++) { const [px, py] = Pl.P(x, y), b = el('g', { role: 'gridcell', tabindex: 0, 'aria-label': `${labelText('coRight')} ${x}، ${labelText('coUp')} ${y}` }, row); el('circle', { cx: px, cy: py, r: 8, fill: 'transparent', 'pointer-events': 'none' }, b); b.onkeydown = e => { if (isActKey(e)) { e.preventDefault(); tapAt([px, py]); } }; } }
    AUTO({ kind: 'axPts', ok: () => { placed.length = 0; placed.push(...item.pts.map(p => [...p])); redraw(); rulDoneBtn().click(); }, wrong: () => { placed.length = 0; placed.push(...item.pts.map(p => [p[1], p[0]])); redraw(); rulDoneBtn().click(); } });
    await rulDone(() => { done = true; input.off(); kg.remove(); }); void done; return { ans: placed.map(p => p.join(',')).join(' '), ctx: { svg, Pl } }; },
  judge(item, k) { if (k === item.want) return { ok: true }; const a = k ? k.split(' ').map(s => s.split(',').map(Number)) : [];
    if (a.length < item.pts.length) return { ok: false, err: 'coordDrawShort' }; const i = item.pts.findIndex((p, j) => p[0] !== a[j][0] || p[1] !== a[j][1]), p = item.pts[i], b = a[i];
    return { ok: false, err: b[0] === p[1] && b[1] === p[0] ? 'coordSwap' : item.pts.some(q => q[0] === b[0] && q[1] === b[1]) ? 'coordDrawOrder' : 'coordOff' }; },
  onOk() { SFX.good(); }, onWrong() { SFX.soft(); },
  async hint2(item, r) { if (r && r.ctx && r.ctx.Pl) { const P = r.ctx.Pl.P(...item.pts[0]); el('circle', { cx: P[0], cy: P[1], r: 11, fill: 'none', stroke: THINK_INK, 'stroke-width': 3, 'stroke-dasharray': '4 3' }, helpG(r.ctx.svg)); }   /* الرأس الأول معلَّماً: من هنا نبدأ */
    await S('gen.co.hint.draw'); }, async together() {},
  async reveal(item, r) { const Q = item.pts.map(p => r.ctx.Pl.P(...p)); el('polygon', { points: polyStr(Q), fill: 'none', stroke: CO.ok, 'stroke-width': 4, 'pointer-events': 'none' }, r.ctx.svg); await S('gen.co.reveal.draw'); },
  praise: () => 'praiseThink', twin(item) { return item.twin || null; },
};

/* ================= ⑦ محيط شكل أو مساحته من رؤوسه (C337): pts رؤوس (الأضلاع على خطوط الشبكة، أو مثلث قاعدته أفقية)، ask area | perim | side ================= */
function coPolyMeasure(pts) { const n = pts.length; let A = 0, P = 0; for (let i = 0; i < n; i++) { const [x1, y1] = pts[i], [x2, y2] = pts[(i + 1) % n]; A += x1 * y2 - x2 * y1; P += Math.hypot(x2 - x1, y2 - y1); } return { A: Math.abs(A) / 2, P }; }
ITEM.coordShape = { ...numItem,
  make(spec) { const { A, P } = coPolyMeasure(spec.pts), tri = spec.pts.length === 3, xs = spec.pts.map(p => p[0]), ys = spec.pts.map(p => p[1]), w = Math.max(...xs) - Math.min(...xs), h = Math.max(...ys) - Math.min(...ys);
    const want = spec.ask === 'perim' ? P : spec.ask === 'side' ? w : A; /*T*/if (TESTHOOK && (!Number.isInteger(want) || want > 100)) testBug('coordShape: جواب غير صالح');/*/T*/
    /* المشتّتات أخطاء حقيقية (المراجع A لبوابة S3-U4/U5، 16): المساحة بدل المحيط، ونصف المحيط، وضلعٌ منسيّ؛ وفي المساحة: المحيط، وعدّ نقاط الشبكة لا المربعات، ونسيان النصف في المثلث */
    const errs = spec.ask === 'perim' ? [A, w + h, P - Math.min(w, h)] : spec.ask === 'side' ? [Math.max(...xs), Math.max(...xs) + Math.min(...xs), w + 1] : tri ? [w * h, (w + 1) * (h + 1) / 2, w + h] : [P, (w + 1) * (h + 1), A / 2];
    return { ...spec, want, nums: rulNear(want, ...errs.filter(v => v > 0 && v !== want && v <= 100 && Number.isInteger(v))), A, P, w, h, tag: 'coord-shape-' + (spec.ask || 'area') }; },
  async ask(item, mode, tries) { const svg = m3Stage(262), Pl = coPlane(svg, { n: item.n, m: item.m }), Q = item.pts.map(p => Pl.P(...p)); el('polygon', { points: polyStr(Q), fill: CO.fill, stroke: CO.ink, 'stroke-width': 3, 'stroke-linejoin': 'round', 'pointer-events': 'none' }, svg);
    const cen = [Q.reduce((a, q) => a + q[0], 0) / Q.length, Q.reduce((a, q) => a + q[1], 0) / Q.length]; item.pts.forEach(p => coDot(svg, Pl, ...p, { pair: !item.noPairs, fs: 12, r: 5, at: 'away', from: cen }));
    if (tries >= 3) { hintCard(svg, 180, 16, item.ask === 'perim' ? labelText('coHintPerim') : item.pts.length === 3 ? `${item.w} × ${item.h} ÷ 2 = ؟` : labelText('coHintArea')); await S('gen.co.together.shape'); } else await S(item.q || 'gen.co.q.shape.' + (item.ask || 'area'));
    const np = numberPick(shuffle(item.nums), item.want, { west: true }); return { ans: await np.p, ctx: { svg, Pl } }; },
  judge(item, k) { if (k === item.want) return { ok: true }; return { ok: false, err: item.ask === 'perim' ? (k === item.A ? 'perimInside' : k === item.w + item.h ? 'perimHalf' : 'perimOff') : item.ask === 'side' ? (k === item.w + 1 ? 'coordDistLines' : 'coordDistOff') : item.pts.length === 3 && k === item.w * item.h ? 'triNoHalf' : k === item.P ? 'perimInside' : k === (item.w + 1) * (item.h + 1) ? 'coordDistLines' : 'a2AreaOff' }; },
  async hint2(item, r) { if (r && r.ctx && r.ctx.Pl) { const m = helpG(r.ctx.svg), Pl = r.ctx.Pl, xs = item.pts.map(p => p[0]), ys = item.pts.map(p => p[1]), x0 = Math.min(...xs), x1 = Math.max(...xs), y0 = Math.min(...ys), y1 = Math.max(...ys);
      if (item.pts.length === 3 && item.ask !== 'perim') { const a = Pl.P(x0, y1), b = Pl.P(x1, y0); el('rect', { x: a[0], y: a[1], width: b[0] - a[0], height: b[1] - a[1], fill: 'none', stroke: THINK_INK, 'stroke-width': 2.4, 'stroke-dasharray': '7 5' }, m); }   /* المثلث نصف المستطيل الذي حوله */
      else { const n = item.pts.length; for (let i = 0; i < n; i++) { const [p, q] = [item.pts[i], item.pts[(i + 1) % n]], L = Math.hypot(q[0] - p[0], q[1] - p[1]); if (!Number.isInteger(L)) continue; const P = Pl.P((p[0] + q[0]) / 2, (p[1] + q[1]) / 2), c = Pl.P((x0 + x1) / 2, (y0 + y1) / 2), d = Math.hypot(P[0] - c[0], P[1] - c[1]) || 1;
        htLab(m, [P[0] + (P[0] - c[0]) / d * 16, P[1] + (P[1] - c[1]) / d * 16 + 5], String(L), THINK_INK, 14); } } }   /* طول كل ضلع مكتوباً عليه */
    await S(item.ask === 'perim' ? 'gen.co.hint.perim' : 'gen.co.hint.shape'); }, async together() {},
  async reveal(item) { await S('gen.ht.reveal.num', { noGap: true }); await S(numw(item.want), { append: true }); },
  praise: () => 'praiseThink', twin(item) { return item.twin || null; },
};

/* ================= المشاهد ================= */
/* الإشعال (د1): ورقة مربعات بلا محورين، وفوضى تضع ملصقاً «الكنز هنا!»؛ ثم نصفه من نقطة البداية: 3 يميناً و2 لأعلى */
SCENES.coordHook = async c => { const L = c.lines, svg = m3Stage(262), Pl = coPlane(svg, { axes: false }), fz = chaosAt(svg, 318, 40, .4); chaosGiggle(fz);
  const s = Pl.P(3, 2); el('rect', { x: s[0] - 9, y: s[1] - 9, width: 18, height: 18, rx: 4, fill: '#f2c14e', stroke: CO.ink, 'stroke-width': 1.5, transform: `rotate(12 ${s[0]} ${s[1]})` }, svg); await S(L[0]);
  el('circle', { cx: Pl.x0, cy: Pl.y0, r: 7, fill: css('--compass'), stroke: '#fff', 'stroke-width': 2 }, svg); await S(L[1]); await coWalk(svg, Pl, 3, 2, { ms: 300 }); for (const l of L.slice(2)) await S(l); };
/* الاكتشاف (د1): المحوران الذهبيان «س وص» ونقطة الأصل والأعداد عند الخطوط، ثم الزوج المرتب (3 ، 2) سيراً، ثم ب وج ود */
SCENES.axesShow = async c => { const L = c.lines, svg = m3Stage(262), Pl0 = coPlane(svg, { axes: false }); await sleep(FAST ? 2 : 200); const Pl = coPlane(svg, {}); void Pl0;
  const face = (x, y) => { const g = el('g', { 'pointer-events': 'none' }, svg); el('circle', { cx: x, cy: y, r: 9, fill: '#f6e1a3', stroke: CO.ax, 'stroke-width': 2 }, g); el('circle', { cx: x - 3, cy: y - 2, r: 1.5, fill: CO.ink }, g); el('circle', { cx: x + 3, cy: y - 2, r: 1.5, fill: CO.ink }, g); el('path', { d: `M${x - 3.5} ${y + 2.5} Q${x} ${y + 5.5} ${x + 3.5} ${y + 2.5}`, fill: 'none', stroke: CO.ink, 'stroke-width': 1.3 }, g); return g; };
  face(Pl.x0 + Pl.N * Pl.c + 14, Pl.y0 - 16); face(Pl.x0 + 16, Pl.y0 - Pl.M * Pl.c - 10); el('circle', { cx: Pl.x0, cy: Pl.y0, r: 6, fill: css('--compass'), stroke: '#fff', 'stroke-width': 2 }, svg); await S(L[0]);
  await coWalk(svg, Pl, 3, 2, { ms: 260 }); coDot(svg, Pl, 3, 2, { name: 'a', pair: true, at: 'up' }); await S(L[1]);
  for (const [x, y, k] of [[5, 1, 'b'], [1, 4, 'j'], [4, 4, 'd']]) { coDot(svg, Pl, x, y, { name: k, pair: true, fs: 13, at: 'up' }); SFX.tick(); await sleep(FAST ? 2 : 400); }
  for (const l of L.slice(2)) await S(l); };
/* الإشعال (د2): فوضى عيّنت (4 ، 1) وقالت (1 ، 4)؛ النقطتان مختلفتان */
SCENES.orderHook = async c => { const L = c.lines, svg = m3Stage(262), Pl = coPlane(svg, {}), fz = chaosAt(svg, 318, 40, .4); chaosGiggle(fz); coDot(svg, Pl, 4, 1, { art: 'treasure' }); coCard(svg, 1, 4, null, { col: CO.bad });
  await S(L[0]); const m = await coWalk(svg, Pl, 1, 4, { ms: 230 }); coDot(svg, Pl, 1, 4, { pair: true }); coDot(svg, Pl, 4, 1, { pair: true, col: CO.pt2 }); void m; for (const l of L.slice(1)) await S(l); };
/* الاكتشاف (د2): قراءة نقطة بالنزول إلى المحورين، والترتيب، والنقاط على المحورين، ونصف الوحدة */
SCENES.readShow = async c => { const L = c.lines, svg = m3Stage(262), Pl = coPlane(svg, {}); let g = el('g', { 'pointer-events': 'none' }, svg);
  const P = Pl.P(6, 3); coDot(g, Pl, 6, 3, { name: 'h' }); geoLine(g, P[0], P[1], P[0], Pl.y0, { color: css('--compass'), w: 2.4, dash: '5 4' }); geoLine(g, P[0], P[1], Pl.x0, P[1], { color: THINK_INK, w: 2.4, dash: '5 4' }); await S(L[0]); coDot(g, Pl, 6, 3, { pair: true }); SFX.tick(); await S(L[1]);
  g.remove(); g = el('g', { 'pointer-events': 'none' }, svg); for (const [x, y, col] of [[0, 0, CO.bad], [6, 0, CO.pt], [0, 5, CO.pt2]]) { coDot(g, Pl, x, y, { pair: true, col }); SFX.tick(); await sleep(FAST ? 2 : 350); } await S(L[2]);
  g.remove(); g = el('g', { 'pointer-events': 'none' }, svg); const H = Pl.P(2.5, 3); geoLine(g, H[0], H[1], H[0], Pl.y0, { color: css('--compass'), w: 2.4, dash: '5 4' }); coDot(g, Pl, 2.5, 3, { pair: true }); SFX.tick(); for (const l of L.slice(3)) await S(l); };
/* الإشعال (د3): فوضى تجمع 2 + 7 = 9، والقفزات على الشبكة 5 */
SCENES.distHook = async c => { const L = c.lines, svg = m3Stage(262), Pl = coPlane(svg, {}), fz = chaosAt(svg, 318, 40, .4); chaosGiggle(fz); coDot(svg, Pl, 2, 3, { name: 'a', pair: true }); coDot(svg, Pl, 7, 3, { name: 'b', pair: true });
  const t = a2Formula(svg, '2 + 7 = 9', CO.bad, 252); await S(L[0]); const m = helpG(svg); for (let v = 2; v < 7; v++) { const p = Pl.P(v, 3), q = Pl.P(v + 1, 3); el('path', { d: `M${p[0]} ${p[1]} Q${(p[0] + q[0]) / 2} ${p[1] - 16} ${q[0]} ${q[1]}`, fill: 'none', stroke: THINK_INK, 'stroke-width': 2.8 }, m); badge(m, (p[0] + q[0]) / 2, p[1] - 22, v - 1, THINK_INK); SFX.tick(); await sleep(FAST ? 2 : 300); }
  t.textContent = '7 − 2 = 5'; t.setAttribute('fill', CO.ok); for (const l of L.slice(1)) await S(l); };
/* الاكتشاف (د3): الأفقي بالفرق، والرأسي بالفرق، والنقطة على المحور، والمائلتان بالمسطرة */
SCENES.coDistShow = async c => { const L = c.lines, svg = m3Stage(262), Pl = coPlane(svg, {}); let g = el('g', { 'pointer-events': 'none' }, svg); const t = a2Formula(svg, '', CO.ok, 252);
  const seg = (a, b, col) => { const A = Pl.P(...a), B = Pl.P(...b); geoLine(g, A[0], A[1], B[0], B[1], { color: col, w: 4 }); coDot(g, Pl, ...a, { pair: true, fs: 13 }); coDot(g, Pl, ...b, { pair: true, fs: 13 }); };
  seg([2, 3], [7, 3], CO.pt); t.textContent = '7 − 2 = 5'; await S(L[0]); seg([4, 1], [4, 6], CO.pt2); t.textContent = '6 − 1 = 5'; SFX.tick(); await S(L[1]);
  g.remove(); g = el('g', { 'pointer-events': 'none' }, svg); seg([0, 3], [7, 3], CO.pt); t.textContent = '7 − 0 = 7'; await S(L[2]);
  g.remove(); g = el('g', { 'pointer-events': 'none' }, svg); seg([1, 1], [4, 5], CO.path); t.textContent = ''; const A = Pl.P(1, 1), B = Pl.P(4, 5), ang = Math.atan2(B[1] - A[1], B[0] - A[0]) * 180 / Math.PI;
  const rl = el('g', { transform: `translate(${A[0]} ${A[1]}) rotate(${ang})`, 'data-ruler': 1 }, g);   /* المسطرة في الجهة الأخرى من الخطّ، فلا تغطّي زوج النقطة (المراجع A لبوابة S3-U4/U5، 22) */ el('rect', { x: -4, y: -22, width: Pl.c * 5 + 8, height: 18, rx: 3, fill: '#f6e7b0', stroke: '#b9952e', 'stroke-width': 1.5 }, rl); for (let i = 0; i <= 5; i++) { geoLine(rl, i * Pl.c, -4, i * Pl.c, -12, { color: CO.ink, w: 1.5 }); const tt = el('text', { x: i * Pl.c, y: -14, 'text-anchor': 'middle', 'font-size': 9, fill: CO.ink }, rl); tt.textContent = String(i); }
  SFX.tick(); for (const l of L.slice(3)) await S(l); };
/* الإشعال (د4): فوضى تقول الرأس الرابع (1 ، 5)؛ الصحيح (1 ، 4) */
SCENES.vertexHook = async c => { const L = c.lines, svg = m3Stage(262), Pl = coPlane(svg, {}), fz = chaosAt(svg, 318, 40, .4); chaosGiggle(fz); const V = [[1, 1], [5, 1], [5, 4]]; V.forEach((p, i) => coDot(svg, Pl, ...p, { name: ['a', 'b', 'j'][i], pair: true, fs: 13 }));
  const Q = V.map(p => Pl.P(...p)); el('polyline', { points: polyStr(Q), fill: 'none', stroke: CO.ink, 'stroke-width': 3, 'pointer-events': 'none' }, svg); coDot(svg, Pl, 1, 5, { col: CO.bad, pair: true, fs: 13, at: 'up' }); const D5 = Pl.P(1, 5); geoLine(svg, Q[2][0], Q[2][1], D5[0], D5[1], { color: CO.bad, w: 2.4, dash: '6 4' }); await S(L[0]);
  const D4 = Pl.P(1, 4); el('polygon', { points: polyStr([...Q, D4]), fill: CO.fill, opacity: .7, stroke: CO.ok, 'stroke-width': 3, 'pointer-events': 'none' }, svg); coDot(svg, Pl, 1, 4, { name: 'd', pair: true, col: CO.ok, fs: 13 }); SFX.good(); for (const l of L.slice(1)) await S(l); };
/* الاكتشاف (د4): مستطيل من رؤوسه (4 و3، محيط 14 ومساحة 12)، والمربع ورأسه الرابع، ومثلث قاعدته أفقية (10)، وشكل L (21 و22) */
SCENES.shapeShow = async c => { const L = c.lines, svg = m3Stage(262), Pl = coPlane(svg, {}); let g = el('g', { 'pointer-events': 'none' }, svg); const t = a2Formula(svg, '', CO.ok, 252);
  const poly = (pts, names) => { const Q = pts.map(p => Pl.P(...p)); el('polygon', { points: polyStr(Q), fill: CO.fill, stroke: CO.ink, 'stroke-width': 3, 'stroke-linejoin': 'round' }, g); pts.forEach((p, i) => coDot(g, Pl, ...p, { name: names ? names[i] : null, pair: true, fs: 12, r: 5 })); return Q; };
  poly([[2, 1], [6, 1], [6, 4], [2, 4]], ['a', 'b', 'j', 'd']); t.textContent = '2 × (4 + 3) = 14 · 4 × 3 = 12'; await S(L[0]);
  g.remove(); g = el('g', { 'pointer-events': 'none' }, svg); poly([[2, 2], [6, 2], [6, 6], [2, 6]]); t.textContent = ''; await S(L[1]);
  g.remove(); g = el('g', { 'pointer-events': 'none' }, svg); const Q = poly([[1, 1], [6, 1], [3, 5]]); const F = Pl.P(3, 1); geoLine(g, Q[2][0], Q[2][1], F[0], F[1], { color: HT.h, w: 3, dash: '6 4' }); t.textContent = '5 × 4 ÷ 2 = 10'; SFX.tick(); await S(L[2]);
  g.remove(); g = el('g', { 'pointer-events': 'none' }, svg); poly([[1, 1], [7, 1], [7, 3], [4, 3], [4, 6], [1, 6]]); const a = Pl.P(1, 3), b = Pl.P(4, 3); geoLine(g, a[0], a[1], b[0], b[1], { color: CO.ink, w: 2, dash: '5 5' }); t.textContent = '12 + 9 = 21 · 2 × (6 + 5) = 22'; SFX.tick(); for (const l of L.slice(3)) await S(l); };
/* المشروع (د4): خريطة المدينة — المدرسة مستطيل والحديقة مثلث؛ ثم الجدول مكتملاً */
SCENES.cityMap = async c => { const L = c.lines, svg = m3Stage(262), Pl = coPlane(svg, { n: 12, m: 7 }), g = el('g', { 'pointer-events': 'none' }, svg);
  const sh = (pts, fill) => { const Q = pts.map(p => Pl.P(...p)); el('polygon', { points: polyStr(Q), fill, stroke: CO.ink, 'stroke-width': 2.6, 'stroke-linejoin': 'round' }, g); pts.forEach(p => coDot(g, Pl, ...p, { r: 4.5 })); return Q; };
  const S1 = sh([[1, 1], [5, 1], [5, 4], [1, 4]], '#f2d38a'); htLab(g, [(S1[0][0] + S1[1][0]) / 2, (S1[0][1] + S1[2][1]) / 2], labelText('coSchool'), CO.ink, 13); await S(L[0]);
  const S2 = sh([[7, 1], [11, 1], [9, 5]], '#bfe0b5'); htLab(g, [S2[2][0], (S2[0][1] + S2[2][1]) / 2 + 12], labelText('coPark'), CO.ink, 13); SFX.tick(); for (const l of L.slice(1)) await S(l); };
/* جدول «خريطة مدينتي» بعد بنود المشروع: المبنى وأضلاعه ومحيطه ومساحته بوحداتها (المرجع، المشروع (4)) */
SCENES.cityTable = async c => { const svg = m3Stage(262), g = el('g', { 'pointer-events': 'none' }, svg), X = [300, 214, 136, 62], u = labelText('coU'), u2 = labelText('coU2'), a = labelText('coAnd');
  const rows = [['coT.b', 'coT.s', 'coT.p', 'coT.a'].map(k => labelText(k)), [labelText('coSchool'), `4 ${a}3`, `14 ${u}`, `12 ${u2}`], [labelText('coPark'), `${labelText('coBase')} 4`, '—', `8 ${u2}`], [labelText('coBakery'), '2', `8 ${u}`, `4 ${u2}`]];
  rows.forEach((r, i) => { const y = 28 + i * 52; el('rect', { x: 26, y, width: 308, height: 46, rx: 10, fill: i ? (i % 2 ? '#f6eccf' : '#fff') : '#e4eef5', stroke: CO.grid, 'stroke-width': 2 }, g);
    r.forEach((t, j) => { const e = el('text', { x: X[j], y: y + 29, 'text-anchor': 'middle', 'font-size': j ? 13 : 15, 'font-weight': 800, fill: i ? CO.ink : CO.pt, direction: 'rtl' }, g); e.textContent = t; }); });
  for (const l of c.lines) await S(l); };
WRAP_ART.coordArt = svg => { const Pl = coPlane(svg, { n: 6, m: 4, H: 200, top: 30, nums: false }); coDot(svg, Pl, 4, 3, { name: 'a' }); };
