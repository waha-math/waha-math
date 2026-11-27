/* =====================================================================
   S3-U6 «التحويلات والتطابق» (المرحلة 3، نوفمبر 2026)
   د1 الانعكاس تحويلاً (C312) · د2 الانسحاب (C313) · د3 الدوران حول نقطة (C338) · د4 التماثل الدوراني (C317) · د5 التطابق (C314) ومشروع «بلاطة القصر»
   على المستوى الإحداثي لـ S3-U5 (coPlane) في الربع الأول: خط الانعكاس موازٍ لأحد المحورين، والدوران بمضاعفات ربع الدورة حول نقطة تبقى الصورة حولها في الربع
   صورة النقطة أ تُكتب «أ'» (والشرطة علامة الصورة)، والتطابق بالكلمات «يطابق»
   ===================================================================== */
const XF = { org: '#3d7cc0', orgF: '#d8e8f6', img: '#e07b39', imgF: '#fbe3d1', line: '#8e6bbf', ctr: '#c8392d', ok: '#2f9d6b', ghost: '#9fb4c0' };
const XF_NM = ['a', 'b', 'j', 'd', 'h'];   /* والخماسيّ (بيت مدينة المرايا في M4-U9 د4): «هـ» لا undefined */
const xfName = (i, img) => LTR[XF_NM[i]] + (img ? '\u2019' : '');   /* الشرطة كما في دليل الرموز (المراجع A لبوابة S3-U6/U7، 23)، بـ«’» لأن «′» (U+2032) ليس في خطّ القراءة المضمّن فيُستبدل به خطٌّ آخر (D256) */
/* صورة نقطة بالتحويل: ref {axis v|h، at}، tr {dx، dy}، rot {c، q أرباع الدورة، cw مع عقارب الساعة} */
function xfApply(xf, [x, y]) {
  if (xf.k === 'ref') return xf.axis === 'v' ? [2 * xf.at - x, y] : [x, 2 * xf.at - y];
  if (xf.k === 'tr') return [x + xf.dx, y + xf.dy];
  let [u, v] = [x - xf.c[0], y - xf.c[1]]; const n = ((xf.cw ? 4 - xf.q : xf.q) % 4 + 4) % 4;
  for (let i = 0; i < n; i++) [u, v] = [-v, u];   /* ربع دورة عكس عقارب الساعة والمحور الرأسي إلى الأعلى */
  return [xf.c[0] + u, xf.c[1] + v]; }
const xfKey = pts => pts.map(p => p.join(',')).join(' ');
/* مضلّع على المستوى بأسماء رؤوسه */
/* أسماء الشكلين فوق تعبئتيهما (فحص الشكل المعتم، بوابة M4-U5/U6): تُنقل نصوص المجموعة إلى مجموعةٍ في الأعلى */
const xfUnder = svg => { const top = svg.querySelector('[data-xftop]'), g = el('g', { 'pointer-events': 'none' }, svg); if (top) svg.insertBefore(g, top); return g; };   /* ما يُرسم في الكشف تحت الأسماء */
const xfRaise = (from, to) => { for (const t of [...from.querySelectorAll('text')]) to.appendChild(t); };
function xfPoly(parent, Pl, pts, o = {}) { const Q = pts.map(p => Pl.P(...p)), g = el('g', { 'pointer-events': 'none' }, parent);
  if (Q.length > 2) el('polygon', { points: polyStr(Q), fill: o.fill || XF.orgF, stroke: o.col || XF.org, 'stroke-width': 3, 'stroke-linejoin': 'round', 'stroke-dasharray': o.dash || null, opacity: o.op ?? 1 }, g);
  else if (Q.length === 2) geoLine(g, Q[0][0], Q[0][1], Q[1][0], Q[1][1], { color: o.col || XF.org, w: 3 });
  const cen = [Q.reduce((a, q) => a + q[0], 0) / Q.length, Q.reduce((a, q) => a + q[1], 0) / Q.length];
  const own = parent.ownerSVGElement || parent, ct = own.querySelector ? own.querySelector('[data-ctr]') : null, cc = ct && ct.getAttribute('data-ctr').split(',').map(Number), ci = cc ? Q.findIndex(q => Math.hypot(cc[0] - q[0], cc[1] - q[1]) < 3) : -1;
  /* مركز الدوران رأسٌ من الشكل: يُسمّى «م» وحده (المرجع S3-U6 د3 (ج): المثلث م أ ب)، فيُبدأ «أ» من الرأس التالي (المراجع B لبوابة S3-U6/U7، 11) */
  pts.forEach(p => { const q = Pl.P(...p); el('circle', { cx: q[0], cy: q[1], r: 4.2, fill: o.col || XF.org }, g); });   /* النقاط قبل الأسماء: لا تغطّي النقطةُ حرفها (فحص الشكل المعتم، بوابة M4-U5/U6) */
  if (o.names !== false) pts.forEach((p, i) => { const q = Q[i], d = [q[0] - cen[0], q[1] - cen[1]], L = Math.hypot(...d) || 1;
    if (i === ci && !o.label) { if (!o.img) { ct.setAttribute('x', q[0] + d[0] / L * 13); ct.setAttribute('y', q[1] + d[1] / L * 13 + 5); } return; }
    let lx = q[0] + d[0] / L * 13, ly = q[1] + d[1] / L * 13 + 5; if (Pl.ax && ly > Pl.y0 + 6) ly = q[1] - 8; if (Pl.ax && lx < Pl.x0 - 4) lx = q[0] + 12;   /* لا على أعداد المحورين (فحص التراكب) */ if (ly < (Pl.top ?? 16) + 30 && lx > 150) ly = q[1] + 19;   /* ولا تحت عنوان الحركة أعلى اليمين (xfMark) */
    const j = ci >= 0 && i > ci && !o.label ? i - 1 : i, t = el('text', { x: lx, y: ly, 'text-anchor': 'middle', 'font-size': 14, 'font-weight': 800, fill: o.col || XF.org, stroke: '#fff', 'stroke-width': 4, 'paint-order': 'stroke', direction: 'rtl' }, g); t.textContent = o.label ? o.label(i) : xfName(j, o.img); });
  if (ct && ci < 0 && !o.img && o.names !== false) labAvoid(ct, [[0, 0], [22, 0], [0, -26], [22, -26], [-6, -30], [26, -14]]);   /* «م» لا على اسم رأسٍ قريب */
  return { g, Q }; }
/* المستوى الثاني (المراجع B: فعلٌ على المسرح): رأسٌ واحد يُنقل مرسوماً، والباقي للطفل؛ وحلقة على رأسٍ ونظيره */
/* النقطة الواحدة (المراجع B لبوابة S3-U6/U7، 2 و3): صورتها هي الجواب كله، فالمستوى الثاني نصف الطريق — الأفقي من الانسحاب، والعمود إلى الخطّ في جهة الأصل،
   ونصف القطر وقوس المقدار صغيراً عند المركز — والحلّ المشترك (full) الطريق كلّه بلا الطرف؛ ولا حلقة على الصورة في الحالين */
function xfHalf(svg, Pl, xf, p, full) { const m = helpG(svg), q = xfApply(xf, p), A = Pl.P(...p), B = Pl.P(...q), L = (a, b, o) => geoLine(m, a[0], a[1], b[0], b[1], o);
  if (xf.k === 'tr') { const dx = q[0] - p[0], dy = q[1] - p[1], C = Pl.P(q[0], p[1]);
    if (full) { if (dx) L(A, C, { color: css('--compass'), w: 3 }); if (dy) L(C, B, { color: THINK_INK, w: 3, dash: '6 4' }); }
    else if (dx) L(A, C, { color: css('--compass'), w: 3 }); else L(A, Pl.P(p[0], p[1] + dy / 2), { color: THINK_INK, w: 3 }); }
  else if (xf.k === 'ref') { const F = xf.axis === 'v' ? Pl.P(xf.at, p[1]) : Pl.P(p[0], xf.at); L(A, F, { color: THINK_INK, w: 2.6, dash: '5 4' });
    const u = xf.axis === 'v' ? [Math.sign(A[0] - F[0]) * 8, 0] : [0, Math.sign(A[1] - F[1]) * 8], v = xf.axis === 'v' ? [0, -8] : [8, 0];
    el('path', { d: `M${F[0] + u[0]} ${F[1] + u[1]} L${F[0] + u[0] + v[0]} ${F[1] + u[1] + v[1]} L${F[0] + v[0]} ${F[1] + v[1]}`, fill: 'none', stroke: THINK_INK, 'stroke-width': 2 }, m);
    if (full) L(F, B, { color: THINK_INK, w: 2.6, dash: '5 4' }); }
  else { const C = Pl.P(...xf.c); L(C, A, { color: THINK_INK, w: 2.4, dash: '5 4' }); if (full) L(C, B, { color: THINK_INK, w: 2.4, dash: '5 4' });
    else { const dA = Math.hypot(A[0] - C[0], A[1] - C[1]), r = Math.min(dA * .75, Math.max(dA * .5, Pl.c * 1.35)),   /* أبعد من قوس علامة الدوران */ a0 = Math.atan2(A[1] - C[1], A[0] - C[0]), sw = (xf.cw ? 1 : -1) * xf.q * Math.PI / 2, n = 12,
        pts = Array.from({ length: n + 1 }, (_, i) => [C[0] + r * Math.cos(a0 + sw * i / n), C[1] + r * Math.sin(a0 + sw * i / n)]);
      el('polyline', { points: polyStr(pts), fill: 'none', stroke: THINK_INK, 'stroke-width': 2.6 }, m); const e = pts[n], e2 = pts[n - 1]; geoArrow(m, e[0], e[1], Math.atan2(e[1] - e2[1], e[0] - e2[0]) * 180 / Math.PI, THINK_INK, 7); } }
  return m; }
function xfGuide(svg, Pl, xf, p) { const m = helpG(svg), q = xfApply(xf, p), A = Pl.P(...p), B = Pl.P(...q);
  if (xf.k === 'tr') { const C = Pl.P(q[0], p[1]); geoLine(m, A[0], A[1], C[0], C[1], { color: css('--compass'), w: 3 }); geoLine(m, C[0], C[1], B[0], B[1], { color: THINK_INK, w: 3 }); }
  else if (xf.k === 'ref') { geoLine(m, A[0], A[1], B[0], B[1], { color: THINK_INK, w: 2.4, dash: '5 4' }); el('circle', { cx: (A[0] + B[0]) / 2, cy: (A[1] + B[1]) / 2, r: 4.5, fill: THINK_INK }, m); }
  else { const C = Pl.P(...xf.c); for (const P of [A, B]) geoLine(m, C[0], C[1], P[0], P[1], { color: THINK_INK, w: 2.4, dash: '5 4' }); }
  el('circle', { cx: B[0], cy: B[1], r: 9, fill: 'none', stroke: THINK_INK, 'stroke-width': 2.6, 'stroke-dasharray': '4 3' }, m); return m; }
function xfRing(m, Pl, pts, dash) { for (const p of pts) { const P = Pl.P(...p); el('circle', { cx: P[0], cy: P[1], r: 10, fill: 'none', stroke: THINK_INK, 'stroke-width': 2.8, 'stroke-dasharray': dash || null }, m); } }
/* مؤشّر التحويل على المستوى: خط الانعكاس، أو بطاقة الانسحاب، أو المركز بقوس الدوران */
function xfMark(svg, Pl, xf) { const g = el('g', { 'pointer-events': 'none' }, svg);
  if (xf.k === 'ref') { const [a, b] = xf.axis === 'v' ? [Pl.P(xf.at, 0), Pl.P(xf.at, Pl.M)] : [Pl.P(0, xf.at), Pl.P(Pl.N, xf.at)]; geoLine(g, a[0], a[1] + (xf.axis === 'v' ? 6 : 0), b[0], b[1] - (xf.axis === 'v' ? 6 : 0), { color: XF.line, w: 3.4, dash: '9 5' }); }
  else if (xf.k === 'tr') { const t = el('text', { x: 334, y: (Pl.top ?? 16) + 21, 'text-anchor': 'start', 'font-size': 15, 'font-weight': 800, fill: XF.line, direction: 'rtl', stroke: '#fff', 'stroke-width': 4, 'paint-order': 'stroke' }, g); t.textContent = xfTrText(xf.dx, xf.dy); }
  else { const C = Pl.P(...xf.c), r = Pl.c * .9, a0 = -20, a1 = a0 - (xf.cw ? -1 : 1) * 90 * xf.q, pt = a => [C[0] + r * Math.cos(a * Math.PI / 180), C[1] + r * Math.sin(a * Math.PI / 180)];
    const big = xf.q === 3 ? 1 : 0, sw = xf.cw ? 1 : 0, p0 = pt(a0), p1 = pt(a1);
    if (xf.q === 2) { const pm = pt((a0 + a1) / 2); el('path', { d: `M${p0[0]} ${p0[1]} A${r} ${r} 0 0 ${sw} ${pm[0]} ${pm[1]} A${r} ${r} 0 0 ${sw} ${p1[0]} ${p1[1]}`, fill: 'none', stroke: XF.line, 'stroke-width': 2.6 }, g); }
    else el('path', { d: `M${p0[0]} ${p0[1]} A${r} ${r} 0 ${big} ${sw} ${p1[0]} ${p1[1]}`, fill: 'none', stroke: XF.line, 'stroke-width': 2.6 }, g);
    const tang = a1 + (xf.cw ? 90 : -90); geoArrow(g, p1[0], p1[1], tang, XF.line, 7);
    el('circle', { cx: C[0], cy: C[1], r: 5.5, fill: XF.ctr, stroke: '#fff', 'stroke-width': 2 }, g); htLab(g, [C[0] - 11, C[1] + 15], labelText('xfCenter'), XF.ctr, 14).setAttribute('data-ctr', C.map(Math.round).join(','));
    const t = el('text', { x: 334, y: (Pl.top ?? 16) + 21, 'text-anchor': 'start', 'font-size': 14, 'font-weight': 800, fill: XF.line, direction: 'rtl', stroke: '#fff', 'stroke-width': 4, 'paint-order': 'stroke' }, g); t.textContent = labelText('xf.rot.' + xf.q) + (xf.q === 2 ? '' : ' ' + labelText(xf.cw ? 'xf.cw' : 'xf.ccw')); }
  return g; }
/* نصّ الانسحاب: «3 يميناً و2 لأعلى» (الأفقي أولاً)، ومثله مسموعاً gen.xf.tr.DX.DY */
function xfTrText(dx, dy) { const p = []; if (dx) p.push(`${Math.abs(dx)} ${labelText(dx > 0 ? 'xfRight' : 'xfLeft')}`); if (dy) p.push(`${Math.abs(dy)} ${labelText(dy > 0 ? 'xfUp' : 'xfDown')}`); return p.join('، ' + labelText('a2And')); }
const xfTrLine = (dx, dy) => 'gen.xf.tr.' + dx + '.' + dy;
/* سؤال التحويل مسموعاً */
async function xfSay(item, tries) { const xf = item.xf;
  if (tries >= 3) { await S(item.pts && item.pts.length === 1 ? 'gen.xf.together.draw1' : 'gen.xf.together.draw'); return; }
  if (item.q) { await S(item.q); return; }
  if (xf.k === 'ref') await S(`gen.xf.q.ref.${xf.axis}.${xf.at}`);
  else if (xf.k === 'tr') { await S('gen.xf.q.tr', { noGap: true }); await S(xfTrLine(xf.dx, xf.dy), { append: true }); }
  else await S(`gen.xf.q.rot.${xf.q}${xf.q === 2 ? '' : xf.cw ? '.cw' : '.ccw'}`); }

/* ================= ① ارسم الصورة (C312، C313، C338): pts الشكل الأصلي (نقطة إلى أربع نقاط)، xf التحويل؛ يلمس الطفل صورة كل رأس بالترتيب (معاينة تحت الإصبع، والتعيين عند الرفع، ولمسة على آخر صورة تمحوها)، ثم «تمّ» ================= */
ITEM.xfDraw = {
  make(spec) { const want = spec.pts.map(p => xfApply(spec.xf, p)), n = spec.n || 10, m = spec.m || 8;
    /*T*/if (TESTHOOK && want.concat(spec.pts).some(([x, y]) => x < 0 || y < 0 || x > n || y > m || x % 1 || y % 1)) testBug('xfDraw: الصورة خارج الربع أو خارج الشبكة');/*/T*/
    /*T*/if (TESTHOOK && xfSame(xfWrongImg({ ...spec, img: want }), want)) testBug('xfDraw: الصورة الخاطئة المؤتمتة هي الصورة الصحيحة مجموعةً');/*/T*/
    return { ...spec, want: xfKey(want), img: want, tag: 'xf-' + spec.xf.k + (spec.pts.length === 1 ? '-pt' : '') }; },
  async ask(item, mode, tries) { const svg = m3Stage(262), Pl = coPlane(svg, { n: item.n, m: item.m }), placed = [], lay = el('g', { 'pointer-events': 'none' }, svg); let prev = null, lastQ = null;
    xfMark(svg, Pl, item.xf); xfPoly(svg, Pl, item.pts); const tg = el('g', { 'pointer-events': 'none', 'data-xftop': '' }, svg);
    const redraw = () => { lay.innerHTML = ''; tg.innerHTML = ''; if (placed.length > 1) xfPoly(lay, Pl, placed, { col: XF.img, fill: placed.length === item.pts.length ? XF.imgF : 'none', img: true }); else if (placed.length) xfPoly(lay, Pl, placed, { col: XF.img, img: true }); xfRaise(lay, tg);
      /*T*/window.__axPlaced = placed.length;/*/T*/ };
    const preview = q => { if (prev) prev.remove(); prev = null; if (!q || placed.length >= item.pts.length) return; const p = Pl.snap(q), P = Pl.P(...p); prev = el('circle', { cx: P[0], cy: P[1], r: 7, fill: 'none', stroke: XF.img, 'stroke-width': 2.5, 'stroke-dasharray': '3 3', 'pointer-events': 'none' }, svg); };
    let tAt = 0; const tapAt = q => { const p = Pl.snap(q), L = placed[placed.length - 1], now = performance.now(); if (L && L[0] === p[0] && L[1] === p[1]) { if (now - tAt < 400) return; placed.pop(); } else if (placed.length < item.pts.length) { placed.push(p); tAt = now; } SFX.tick(); redraw(); };   /* لمستان سريعتان على النقطة نفسها: الثانية لا تمحو الأولى (المراجع B لبوابة S3-U6/U7، 15) */
    if (tries >= 3) { if (item.pts.length === 1) xfHalf(svg, Pl, item.xf, item.pts[0], true); else { placed.push(...item.img.slice(0, item.img.length - 1).map(p => [...p])); redraw(); } }
    await xfSay(item, tries);
    const input = fingerInput(svg, { map: e => { const q = svgPoint(svg, e); return [q.x, q.y]; }, down(q) { if (q[1] > Pl.y0 + 22 || q[1] < Pl.y0 - Pl.M * Pl.c - 20) return false; lastQ = q; preview(q); }, move(q) { lastQ = q; preview(q); }, up(cancel) { preview(null); if (!cancel && lastQ) tapAt(lastQ); lastQ = null; }, lens: { Pl } });
    /*T*/window.__axWant = item.img; window.__axAt = (x, y) => { const m = svg.getScreenCTM(), [px, py] = Pl.P(x, y); return { x: m.a * px + m.e, y: m.d * py + m.f }; }; window.__axPlaced = placed.length;/*/T*/
    const kg = el('g', { role: 'grid', 'aria-label': labelText('coPlane') }, svg); for (let y = Pl.M; y >= 0; y--) { const row = el('g', { role: 'row' }, kg); for (let x = 0; x <= Pl.N; x++) { const [px, py] = Pl.P(x, y), b = el('g', { role: 'gridcell', tabindex: 0, 'aria-label': `${labelText('coRight')} ${x}، ${labelText('coUp')} ${y}` }, row); el('circle', { cx: px, cy: py, r: 8, fill: 'transparent', 'pointer-events': 'none' }, b); b.onkeydown = e => { if (isActKey(e)) { e.preventDefault(); tapAt([px, py]); } }; } }
    AUTO({ kind: 'axPts', ok: () => { placed.length = 0; placed.push(...item.img.map(p => [...p])); redraw(); rulDoneBtn().click(); }, wrong: () => { placed.length = 0; placed.push(...xfWrongImg(item).map(p => [...p])); redraw(); rulDoneBtn().click(); } });
    await rulDone(() => { input.off(); kg.remove(); preview(null); }); if (placed.length > 1 && xfSame(placed, item.img)) { placed.splice(0, placed.length, ...item.img.map(p => [...p])); redraw(); }   /* بترتيبٍ آخر: الصورة نفسها، فتُسمّى رؤوسها بنظائرها */
    return { ans: xfKey(placed), ctx: { svg, Pl } }; },
  judge(item, k) { if (k === item.want) return { ok: true }; const a = k ? k.split(' ').map(s => s.split(',').map(Number)) : [];
    if (a.length < item.pts.length) return { ok: false, err: 'xfShort' }; return { ok: false, err: xfErr(item, a) }; },
  onOk() { SFX.good(); }, onWrong() { SFX.soft(); },
  async hint2(item, r) { if (r && r.ctx && r.ctx.Pl) { (item.pts.length === 1 ? xfHalf : xfGuide)(r.ctx.svg, r.ctx.Pl, item.xf, item.pts[0]); await sleep(FAST ? 10 : 250); } await S('gen.xf.hint.' + item.xf.k); }, async together() {},
  async reveal(item, r) { if (r && r.ctx) xfPoly(r.ctx.svg, r.ctx.Pl, item.img, { col: XF.ok, fill: 'none', dash: '7 5', img: true }); await S('gen.xf.reveal.' + item.xf.k); },
  praise: () => 'praiseThink', twin(item) { return item.twin || null; },
};
/* تشخيص الصورة الخاطئة: النسخ بالاتجاه نفسه (انعكاس)، وقلب الإحداثيين (انسحاب)، والمقدار أو الاتجاه (دوران)، وتحريك رأس دون غيره */
/* الصورة مجموعةُ نقاط لا ترتيبُ لمس: المثلث نفسه بأيّ ترتيبٍ وُضعت رؤوسه (المراجع B لبوابة S3-U6/U7، 5) */
const xfSet = a => a.map(p => p.join(',')).sort().join(' ');
const xfSame = (a, b) => a.length === b.length && xfSet(a) === xfSet(b);
const xfShift = (a, b) => a.length === b.length && a.some(q => xfSame(a, b.map(p => [p[0] + q[0] - b[0][0], p[1] + q[1] - b[0][1]])));
function xfErr(item, a) { const xf = item.xf, P = item.pts;
  if (xf.k === 'ref') { const ds = A => A.map(p => Math.abs((xf.axis === 'v' ? p[0] : p[1]) - xf.at)).sort((u, v) => u - v).join(); return xfShift(a, P) ? 'refCopy' : ds(a) !== ds(P) ? 'refDist' : 'xfOff'; }
  if (xf.k === 'tr') return xfSame(a, P.map(p => [p[0] + xf.dy, p[1] + xf.dx])) ? 'trSwap' : !xfShift(a, P) ? 'trTurn' : 'xfOff';
  for (const q of [1, 2, 3]) if (q !== xf.q && xfSame(a, P.map(p => xfApply({ ...xf, q }, p)))) return xf.q + q === 4 ? 'rotDir' : 'rotAmount';
  if (xfSame(a, P.map(p => xfApply({ ...xf, cw: !xf.cw }, p)))) return 'rotDir';
  return xfShift(a, P) ? 'rotMove' : 'xfOff'; }
function xfWrongImg(item) { const xf = item.xf, P = item.pts;
  if (xf.k === 'ref') { const d = xf.axis === 'v' ? [item.img[0][0] - P[0][0], 0] : [0, item.img[0][1] - P[0][1]], W = P.map(p => [p[0] + d[0], p[1] + d[1]]);
    if (!xfSame(W, item.img)) return W;   /* نقطة واحدة: نسخها هو صورتها، فالخطأ بُعدٌ زائد عن الخط (refDist) */
    const n = item.n || 10, m = item.m || 8; return item.img.map(p => xf.axis === 'v' ? [p[0] + (p[0] < n ? 1 : -1), p[1]] : [p[0], p[1] + (p[1] < m ? 1 : -1)]); }
  if (xf.k === 'tr') return P.map(p => [p[0] + xf.dy, p[1] + xf.dx]);
  return P.map(p => xfApply({ ...xf, q: xf.q === 2 ? 1 : 2 }, p)); }

/* ================= ② أيّ تحويل؟ (C312، C313، C338): pts الأصل، xf التحويل؛ يختار الطفل الاسم ================= */
ITEM.xfWhich = {
  make(spec) { return { ...spec, img: spec.pts.map(p => xfApply(spec.xf, p)), want: spec.is ? (spec.xf.k === spec.is ? 'yes' : 'no') : spec.xf.k, tag: 'xf-which' + (spec.is ? '-is-' + spec.is : '') }; },
  async ask(item, mode, tries) { const svg = m3Stage(262), Pl = coPlane(svg, { n: item.n, m: item.m, nums: false }); if (item.line) xfMark(svg, Pl, item.line); { const a = xfPoly(svg, Pl, item.pts), b = xfPoly(svg, Pl, item.img, { col: XF.img, fill: XF.imgF, img: true }), tg = el('g', { 'pointer-events': 'none', 'data-xftop': '' }, svg); xfRaise(a.g, tg); xfRaise(b.g, tg); }
    if (item.is) { if (tries >= 3) { const m = helpG(svg); item.pts.forEach((p, i) => { const a = Pl.P(...p), b = Pl.P(...item.img[i]); geoLine(m, a[0], a[1], b[0], b[1], { color: THINK_INK, w: 2, dash: '5 4' }); }); await S('gen.xf.together.is.' + item.is); } else await S(item.q || 'gen.xf.q.is.' + item.is);
      return { ans: await yesNo(item.want), ctx: { svg, Pl } }; }
    if (tries >= 3) { const m = helpG(svg); item.pts.forEach((p, i) => { const a = Pl.P(...p), b = Pl.P(...item.img[i]); geoLine(m, a[0], a[1], b[0], b[1], { color: THINK_INK, w: 2, dash: '5 4' }); }); await S('gen.xf.together.which'); } else await S(item.q || 'gen.xf.q.which');
    const k = await choosePick(['ref', 'tr', 'rot'].map(t => [t, labelText('xf.n.' + t), '<i></i>', 'gen.xf.n.' + t]), item.want); return { ans: k, ctx: { svg, Pl } }; },
  judge(item, k) { if (k === item.want) return { ok: true }; if (item.is) return { ok: false, err: item.want === 'no' ? 'xfIsNot' : 'xfIsYes' }; return { ok: false, err: (k === 'ref' && item.want === 'rot') || (k === 'rot' && item.want === 'ref') ? 'xfRefRot' : 'xfWhich' }; },
  onOk() { SFX.good(); }, onWrong() { SFX.soft(); },
  async hint2(item, r) { if (r && r.ctx && r.ctx.Pl) { const m = helpG(r.ctx.svg); xfRing(m, r.ctx.Pl, [item.pts[0], item.img[0]]); xfRing(m, r.ctx.Pl, [item.pts[1], item.img[1]], '4 3'); } await S('gen.xf.hint.which'); }, async together() {},
  async reveal(item, r) { xfMark(xfUnder(r.ctx.svg), r.ctx.Pl, item.xf); await S(item.is ? 'gen.xf.is.' + item.is + '.' + item.want : 'gen.xf.n.' + item.want); },
  praise: () => 'praiseLook', twin(item) { return item.twin || null; },
};

/* ================= ③ أين خط الانعكاس؟ (C312): pts الأصل، axis، k؛ الخيارات k والجاران ================= */
ITEM.refLine = {
  make(spec) { const ks = [spec.k, spec.k + 1, spec.k - 1].filter(v => v > 0); return { ...spec, xf: { k: 'ref', axis: spec.axis, at: spec.k }, ks, want: String(spec.k), tag: 'ref-line' }; },
  async ask(item, mode, tries) { const svg = m3Stage(262), Pl = coPlane(svg, { n: item.n, m: item.m }), img = item.pts.map(p => xfApply(item.xf, p)); xfPoly(svg, Pl, item.pts); xfPoly(svg, Pl, img, { col: XF.img, fill: XF.imgF, img: true });
    if (tries >= 3) { const m = helpG(svg), a = Pl.P(...item.pts[0]), b = Pl.P(...img[0]); geoLine(m, a[0], a[1], b[0], b[1], { color: THINK_INK, w: 2.4, dash: '5 4' }); const M = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2]; el('circle', { cx: M[0], cy: M[1], r: 5, fill: THINK_INK }, m); await S('gen.xf.together.line'); } else await S(item.q || 'gen.xf.q.line');
    const k = await choosePick(shuffle(item.ks.map(v => [String(v), `${labelText(item.axis === 'v' ? 'xfVline' : 'xfHline')} ${v}`, '<i></i>', `gen.xf.${item.axis}line.${v}`])), item.want, { cls: 'cards' }); return { ans: k, ctx: { svg, Pl } }; },
  judge(item, k) { return k === item.want ? { ok: true } : { ok: false, err: 'refLineMid' }; },
  onOk() { SFX.good(); }, onWrong() { SFX.soft(); },
  async hint2(item, r) { if (r && r.ctx && r.ctx.Pl) xfRing(helpG(r.ctx.svg), r.ctx.Pl, [item.pts[0], xfApply(item.xf, item.pts[0])]); await S('gen.xf.hint.line'); }, async together() {},
  async reveal(item, r) { xfMark(xfUnder(r.ctx.svg), r.ctx.Pl, item.xf); await S(`gen.xf.${item.axis}line.${item.k}`); },
  praise: () => 'praiseThink', twin(item) { return item.twin || null; },
};

/* ================= ④ أيّ انسحاب؟ (C313): a النقطة، dx، dy؛ art train (قطار الانسحاب: القطار والمحطة) ================= */
ITEM.trVector = {
  make(spec) { const { dx, dy } = spec, alt = [[dy, dx], [-dx, -dy], [dx, -dy], [dx + 1, dy]].filter(([u, v]) => (u !== dx || v !== dy) && (u || v)), ch = [];
    for (const p of alt) if (ch.length < 2 && !ch.some(q => q[0] === p[0] && q[1] === p[1])) ch.push(p);
    return { ...spec, ch: [[dx, dy], ...ch], want: dx + ',' + dy, tag: 'tr-vector' + (spec.art ? '-train' : '') }; },
  async ask(item, mode, tries) { const svg = m3Stage(262), Pl = coPlane(svg, { n: item.n, m: item.m }), b = [item.a[0] + item.dx, item.a[1] + item.dy];
    if (item.art === 'train') { const A = Pl.P(...item.a), B = Pl.P(...b); const tr = el('g', { 'pointer-events': 'none' }, svg); el('rect', { x: A[0] - 11, y: A[1] - 9, width: 22, height: 14, rx: 3, fill: '#c8392d' }, tr); el('rect', { x: A[0] - 7, y: A[1] - 15, width: 8, height: 7, fill: '#c8392d' }, tr); for (const dx of [-6, 6]) el('circle', { cx: A[0] + dx, cy: A[1] + 6, r: 3.4, fill: CO.ink }, tr);
      const st = el('g', { 'pointer-events': 'none' }, svg); el('rect', { x: B[0] - 12, y: B[1] - 16, width: 24, height: 18, rx: 2, fill: '#f2d38a', stroke: CO.ink, 'stroke-width': 1.5 }, st); el('path', { d: `M${B[0] - 15} ${B[1] - 15} L${B[0]} ${B[1] - 25} L${B[0] + 15} ${B[1] - 15}Z`, fill: '#b9794e' }, st); el('circle', { cx: B[0], cy: B[1], r: 3, fill: CO.ink }, st); }
    else { coDot(svg, Pl, ...item.a, { name: 'a', pair: true, fs: 13, col: XF.org }); const A2p = Pl.P(...b), g = el('g', { 'pointer-events': 'none' }, svg); el('circle', { cx: A2p[0], cy: A2p[1], r: 6.5, fill: XF.img, stroke: '#fff', 'stroke-width': 2 }, g); const t = el('text', { x: A2p[0] + 10, y: A2p[1] - 10, 'text-anchor': 'start', 'font-size': 14, 'font-weight': 800, fill: XF.img, stroke: '#fff', 'stroke-width': 4, 'paint-order': 'stroke', direction: 'rtl' }, g); t.textContent = LTR.a + "'"; coPairText(g, A2p[0] + 34, A2p[1] - 10, ...b, 'start', 13); }
    if (tries >= 3) { const m = helpG(svg), A = Pl.P(...item.a), C = Pl.P(b[0], item.a[1]), B = Pl.P(...b); geoLine(m, A[0], A[1], C[0], C[1], { color: css('--compass'), w: 3 }); geoLine(m, C[0], C[1], B[0], B[1], { color: THINK_INK, w: 3 }); await S('gen.xf.together.vec'); } else await S(item.q || (item.art ? 'gen.xf.q.train' : 'gen.xf.q.vec'));
    const k = await choosePick(shuffle(item.ch.map(([u, v]) => [u + ',' + v, xfTrText(u, v), '<i></i>', xfTrLine(u, v)])), item.want, { cls: 'cards' }); return { ans: k, ctx: { svg, Pl } }; },
  judge(item, k) { if (k === item.want) return { ok: true }; const [u, v] = k.split(',').map(Number); return { ok: false, err: u === item.dy && v === item.dx ? 'trSwap' : u === -item.dx && v === -item.dy ? 'trBack' : 'trOff' }; },
  onOk() { SFX.good(); }, onWrong() { SFX.soft(); },
  async hint2(item, r) { if (r && r.ctx && r.ctx.Pl) { const m = helpG(r.ctx.svg), A = r.ctx.Pl.P(...item.a), C = r.ctx.Pl.P(item.a[0] + item.dx, item.a[1]); geoLine(m, A[0], A[1], C[0], C[1], { color: css('--compass'), w: 3 }); geoArrow(m, C[0], C[1], item.dx >= 0 ? 0 : 180, css('--compass'), 9); } await S('gen.xf.hint.vec'); }, async together() {},   /* الأفقيّ وحده مرسوماً، والرأسيّ للطفل */
  async reveal(item) { await S(xfTrLine(item.dx, item.dy)); },
  praise: () => 'praiseThink', twin(item) { return item.twin || null; },
};

/* ================= أشكال التماثل الدوراني (C317): نقاط حول المركز، وعدد الانطباقات (order) والمحاور (axes) ================= */
const RS_REG = n => Array.from({ length: n }, (_, i) => [Math.cos(Math.PI / 2 + 2 * Math.PI * i / n), Math.sin(Math.PI / 2 + 2 * Math.PI * i / n)]);
const RS_STAR = n => Array.from({ length: 2 * n }, (_, i) => { const a = Math.PI / 2 + Math.PI * i / n, r = i % 2 ? .46 : 1.15; return [r * Math.cos(a), r * Math.sin(a)]; });
const RS = {
  eqTri: { pts: RS_REG(3), order: 3, axes: 3 }, sq: { pts: RS_REG(4), order: 4, axes: 4, rot: 45 }, pent: { pts: RS_REG(5), order: 5, axes: 5 }, hex: { pts: RS_REG(6), order: 6, axes: 6 }, oct: { pts: RS_REG(8), order: 8, axes: 8 },
  rect: { pts: [[-1.35, -.8], [1.35, -.8], [1.35, .8], [-1.35, .8]], order: 2, axes: 2 }, rhom: { pts: [[0, -1.2], [.75, 0], [0, 1.2], [-.75, 0]], order: 2, axes: 2 },
  para: { pts: [[-1.5, -.75], [.7, -.75], [1.5, .75], [-.7, .75]], order: 2, axes: 0 }, kite: { pts: [[0, 1.25], [.8, .35], [0, -1.1], [-.8, .35]], order: 1, axes: 1 },
  isoTrap: { pts: [[-1.4, -.75], [1.4, -.75], [.7, .75], [-.7, .75]], order: 1, axes: 1 }, scal: { pts: [[-1.2, -.7], [1.3, -.7], [-.3, .9]], order: 1, axes: 0 },
  fan3: { fan: 3, order: 3, axes: 0 }, fan4: { fan: 4, order: 4, axes: 0 }, fan8: { fan: 8, order: 8, axes: 0 }, flower6: { petal: 6, order: 6, axes: 6 },
  fan5: { fan: 5, order: 5, axes: 0 }, fan6: { fan: 6, order: 6, axes: 0 },
  star4: { pts: RS_STAR(4), order: 4, axes: 4 }, star5: { pts: RS_STAR(5), order: 5, axes: 5 }, star6: { pts: RS_STAR(6), order: 6, axes: 6 },
  cross: { pts: [[.35, 1.1], [.35, .35], [1.1, .35], [1.1, -.35], [.35, -.35], [.35, -1.1], [-.35, -1.1], [-.35, -.35], [-1.1, -.35], [-1.1, .35], [-.35, .35], [-.35, 1.1]], order: 4, axes: 4 },
  zig: { pts: [[-1.2, .8], [.4, .8], [.4, 0], [1.2, 0], [1.2, -.8], [-.4, -.8], [-.4, 0], [-1.2, 0]], order: 2, axes: 0 },
  arrow: { pts: [[0, 1.2], [.95, .15], [.38, .15], [.38, -1.1], [-.38, -1.1], [-.38, .15], [-.95, .15]], order: 1, axes: 1 },
  house: { pts: [[-.95, -.95], [.95, -.95], [.95, .3], [0, 1.15], [-.95, .3]], order: 1, axes: 1 },
  paraT: { pts: [[-1.5, -.75], [.7, -.75], [1.5, .75], [-.7, .75]], order: 2, axes: 0, rot: -28 },   /* متوازي أضلاع مائل غير رسم الإشعال */
};
function rsDraw(parent, k, cx, cy, s, o = {}) { const D = RS[k], g = el('g', { transform: `translate(${cx} ${cy})`, 'pointer-events': 'none' }, parent), inner = el('g', {}, g);
  if (D.fan) { el('circle', { cx: 0, cy: 0, r: s * .16, fill: o.col || XF.org }, inner); for (let i = 0; i < D.fan; i++) el('path', { d: `M0 0 C${s * .15} ${-s * .35} ${s * .55} ${-s * .55} ${s * .3} ${-s} C${s * .05} ${-s * .7} ${-s * .2} ${-s * .4} 0 0Z`, fill: o.fill || XF.orgF, stroke: o.col || XF.org, 'stroke-width': 2.4, transform: `rotate(${360 * i / D.fan})` }, inner); }
  else if (D.petal) { for (let i = 0; i < D.petal; i++) el('ellipse', { cx: 0, cy: -s * .52, rx: s * .2, ry: s * .48, fill: o.fill || XF.orgF, stroke: o.col || XF.org, 'stroke-width': 2.2, transform: `rotate(${360 * i / D.petal})` }, inner); el('circle', { cx: 0, cy: 0, r: s * .14, fill: '#f2c14e' }, inner); }
  else el('polygon', { points: D.pts.map(([x, y]) => `${x * s},${-y * s}`).join(' '), fill: o.fill || XF.orgF, stroke: o.col || XF.org, 'stroke-width': 3, 'stroke-linejoin': 'round', transform: D.rot ? `rotate(${D.rot})` : null }, inner);
  if (o.mark !== false && !D.fan && !D.petal) { const p = D.pts[0]; el('circle', { cx: p[0] * s * .7, cy: -p[1] * s * .7, r: 3.5, fill: '#f2c14e', transform: D.rot ? `rotate(${D.rot})` : null }, inner); }   /* علامة صغيرة نعرف بها الانطباق */
  el('circle', { cx: 0, cy: 0, r: 3, fill: XF.ctr }, g); return { g, inner }; }
/* الدوران الكامل مرسوماً: النسخة تدور فوق الأصل، ويومض كل انطباق ويُعدّ */
async function rsSpin(svg, k, cx, cy, s, o = {}) { const D = RS[k], m = helpG(svg); rsDraw(m, k, cx, cy, s, { fill: 'none', col: XF.ghost, mark: false }); const top = rsDraw(m, k, cx, cy, s, { fill: 'none', col: XF.img }); let n = 0; const cnt = el('text', { x: cx + s + 18, y: cy - s + 8, 'text-anchor': 'middle', 'font-size': 22, 'font-weight': 800, fill: THINK_INK }, m);
  const steps = 72, per = FAST ? 1 : (o.ms || 2600) / steps;
  for (let i = 1; i <= steps; i++) { const a = 360 * i / steps; top.inner.setAttribute('transform', `rotate(${-a})`); if (Math.abs((a * D.order / 360) - Math.round(a * D.order / 360)) < 1e-9) { n++; cnt.textContent = String(n); SFX.tick(); top.inner.setAttribute('opacity', .4); await sleep(FAST ? 1 : 260); top.inner.setAttribute('opacity', 1); } await sleep(per); }
  return m; }

/* ================= ⑤ التماثل الدوراني (C317): k الشكل، ask count (عدد الانطباقات) | angle (أصغر زاوية) | kinds (محور، دوراني، كلاهما، لا شيء) ================= */
ITEM.rotSym = { ...numItem,
  make(spec) { const D = RS[spec.k], ask = spec.ask || 'count'; let want, nums;
    if (ask === 'count') { want = D.order; nums = rulNear(want, D.axes !== want && D.axes ? D.axes : want + 1, want * 2 <= 12 ? want * 2 : want - 1, want + 2); }
    else if (ask === 'angle') { want = 360 / D.order; nums = [want, ...[180, 120, 90, 72, 60, 45].filter(v => v !== want).sort((a, b) => Math.abs(a - want) - Math.abs(b - want)).slice(0, 2)]; }
    else want = D.order > 1 && D.axes ? 'both' : D.order > 1 ? 'rot' : D.axes ? 'axis' : 'none';
    /*T*/if (TESTHOOK && ask === 'angle' && D.order < 2) testBug('rotSym: لا زاوية لشكل بلا تماثل دوراني');/*/T*/
    return { ...spec, ask, want, nums, tag: 'rot-sym-' + ask }; },
  async ask(item, mode, tries) { const svg = m3Stage(250); rsDraw(svg, item.k, 180, 122, 68);
    if (tries >= 3) { await S('gen.xf.together.sym'); await rsSpin(svg, item.k, 180, 122, 68); } else await S(item.q || 'gen.xf.q.sym.' + item.ask);
    if (item.ask === 'kinds') { const k = await choosePick(['axis', 'rot', 'both', 'none'].map(w => [w, labelText('xfK.' + w), '<i></i>', 'gen.xf.k.' + w]), item.want); return { ans: k, ctx: { svg } }; }
    const np = numberPick(shuffle(item.nums), item.want, { west: true, word: item.ask === 'angle' ? n => 'gen.deg.' + n : undefined }); return { ans: await np.p, ctx: { svg } }; },
  judge(item, k) { if (k === item.want) return { ok: true }; const D = RS[item.k];
    if (item.ask === 'kinds') return { ok: false, err: item.want === 'rot' && k !== 'rot' ? 'rsNoAxisRot' : item.want === 'axis' ? 'rsAxisNoRot' : 'rsKinds' };
    if (item.ask === 'angle') return { ok: false, err: 'rsAngle' };
    return { ok: false, err: k === D.axes ? 'rsAxes' : k === D.order + 1 ? 'rsFull' : 'rsCount' }; },
  onOk() { SFX.good(); }, onWrong() { SFX.soft(); },
  async hint2(item, r) { if (r && r.ctx && r.ctx.svg) { const m = helpG(r.ctx.svg), C = [180, 112], R = 22, P = a => [C[0] + R * Math.cos(a * Math.PI / 180), C[1] + R * Math.sin(a * Math.PI / 180)], a0 = P(40), a1 = P(-220);   /* قوسٌ يدور حول المركز: نُدير ولا نطوي */
      el('path', { d: `M${a0[0]} ${a0[1]} A${R} ${R} 0 1 0 ${a1[0]} ${a1[1]}`, fill: 'none', stroke: THINK_INK, 'stroke-width': 3.4, 'stroke-linecap': 'round' }, m); const t = -220 * Math.PI / 180; geoArrow(m, a1[0], a1[1], Math.atan2(-Math.cos(t), Math.sin(t)) * 180 / Math.PI, THINK_INK, 10); el('circle', { cx: C[0], cy: C[1], r: 6.5, fill: 'none', stroke: THINK_INK, 'stroke-width': 2.4 }, m); }
    await S(item.ask === 'angle' ? 'gen.xf.hint.angle' : 'gen.xf.hint.sym'); }, async together() {},
  async reveal(item, r) { if (r && r.ctx && item.ask !== 'kinds') await rsSpin(r.ctx.svg, item.k, 180, 122, 68, { ms: 1600 }); if (item.ask === 'kinds') await S('gen.xf.k.' + item.want); else { await S('gen.ht.reveal.num', { noGap: true }); await S(item.ask === 'angle' ? 'gen.deg.' + item.want : numw(item.want), { append: true }); } },
  praise: () => 'praiseThink', twin(item) { return item.twin || null; },
};

/* ================= التطابق (C314): مثلثان؛ الثاني صورة الأول بحركة (mv: tr | rot | ref) أو مكبَّر (scale) ================= */
function cgTris(spec) { const a = spec.pts, mv = spec.mv; let b;
  if (mv === 'scale') { const s = spec.s || 1.5, o = spec.at || [6, 1]; b = a.map(([x, y]) => [o[0] + (x - a[0][0]) * s, o[1] + (y - a[0][1]) * s]); }
  else b = a.map(p => xfApply(spec.xf, p));
  return [a, b]; }
/* صورة بطاقة التعليل (S3-U6): rs شكلٌ من RS وحده؛ أو pts وxf (أو mv: 'scale' وs وat) على شبكة بلا أعداد */
function xfReasonPic(g, P) { if (P.rs) { rsDraw(g, P.rs, 180, 104, 74); return; }
  const [a, b] = P.mv === 'scale' ? cgTris(P) : [P.pts, P.img || P.pts.map(p => xfApply(P.xf, p))], all = a.concat(b, P.xf && P.xf.c ? [P.xf.c] : [], P.xf && P.xf.k === 'ref' ? [P.xf.axis === 'v' ? [P.xf.at, 0] : [0, P.xf.at]] : []),
    Pl = coPlane(g, { n: P.n || Math.max(5, ...all.map(p => p[0] + 1)), m: P.m || Math.max(4, ...all.map(p => p[1] + 1)), H: 214, top: 8, nums: false, axes: false });
  if (P.xf && P.mv !== 'scale') xfMark(g, Pl, P.xf); xfPoly(g, Pl, a, { names: false }); xfPoly(g, Pl, b, { col: XF.img, fill: XF.imgF, names: false, img: true }); }
/* نسخةٌ تتحرّك بالحركة نفسها (الحلّ المشترك): انسحابٌ خطّي، ودورانٌ حول المركز، وقلبٌ يمرّ بالخطّ، وفي «scale» تُنقل بحجمها إلى موضع الكبير فلا تنطبق */
function xfTween(poly, Pl, a, spec, ms = FAST ? 20 : 1400) { const n = 24, xf = spec.xf || {}, at = (t, [x, y]) => {
    if (spec.mv === 'scale') { const [, b] = cgTris(spec); return [x + (b[0][0] - a[0][0]) * t, y + (b[0][1] - a[0][1]) * t]; }
    if (xf.k === 'tr') return [x + xf.dx * t, y + xf.dy * t];
    if (xf.k === 'ref') return xf.axis === 'v' ? [xf.at + (x - xf.at) * (1 - 2 * t), y] : [x, xf.at + (y - xf.at) * (1 - 2 * t)];
    const q = (xf.cw ? -1 : 1) * xf.q * t * Math.PI / 2, u = x - xf.c[0], v = y - xf.c[1]; return [xf.c[0] + u * Math.cos(q) - v * Math.sin(q), xf.c[1] + u * Math.sin(q) + v * Math.cos(q)]; };
  (async () => { const fl = FLOW; await sleep(300); for (let k = 0; k <= n; k++) { if (!poly.isConnected || fl !== FLOW) return; poly.setAttribute('points', polyStr(a.map(p => Pl.P(...at(k / n, p))))); await sleep(ms / n); } })().catch(() => {}); }   /* بـ sleep: تقف بالإيقاف وتنقطع بالخروج (المراجع B لبوابة S3-U6/U7، 16) */
/* ================= ⑥ هل الشكلان متطابقان؟ (C314): ask yn | move («قاضي التطابق»: وبأيّ حركة؟) ================= */
ITEM.congJudge = {
  make(spec) { const want = spec.ask === 'move' ? (spec.mv === 'scale' ? 'no' : spec.mv) : spec.mv === 'scale' ? 'no' : 'yes'; return { ...spec, want, tag: 'cong-' + (spec.ask || 'yn') }; },
  async ask(item, mode, tries) { const svg = m3Stage(262), Pl = coPlane(svg, { n: item.n || 12, m: item.m || 8, axes: false }), [a, b] = cgTris(item); xfPoly(svg, Pl, a, { names: false }); xfPoly(svg, Pl, b, { col: XF.img, fill: XF.imgF, names: false });
    if (tries >= 3) { const m = helpG(svg), sh = el('polygon', { points: polyStr(a.map(p => Pl.P(...p))), fill: 'none', stroke: THINK_INK, 'stroke-width': 3, 'stroke-dasharray': '6 4' }, m); xfTween(sh, Pl, a, item); await S('gen.xf.together.cong'); } else await S(item.q || (item.ask === 'move' ? 'gen.xf.q.congMove' : 'gen.xf.q.cong'));
    const opts = item.ask === 'move' ? ['tr', 'rot', 'ref', 'no'].map(w => [w, labelText(w === 'no' ? 'xfC.no' : 'xf.n.' + w), '<i></i>', w === 'no' ? 'gen.xf.c.no' : 'gen.xf.n.' + w]) : [['yes', labelText('xfC.yes'), '<i></i>', 'gen.xf.c.yes'], ['no', labelText('xfC.no'), '<i></i>', 'gen.xf.c.no']];
    const k = await choosePick(opts, item.want); return { ans: k, ctx: { svg, Pl } }; },
  judge(item, k) { if (k === item.want) return { ok: true }; return { ok: false, err: item.mv === 'scale' ? 'congSize' : k === 'no' ? (item.mv === 'ref' ? 'congFlip' : 'congMoved') : 'congMove' }; },
  onOk() { SFX.good(); }, onWrong() { SFX.soft(); },
  async hint2(item, r) { if (r && r.ctx && r.ctx.Pl) { const m = helpG(r.ctx.svg), [a, b] = cgTris(item); for (const T of [a, b]) { const P = r.ctx.Pl.P(...T[0]), Q = r.ctx.Pl.P(...T[1]); geoLine(m, P[0], P[1], Q[0], Q[1], { color: THINK_INK, w: 5 }); } } await S('gen.xf.hint.cong'); }, async together() {},   /* ضلعٌ ونظيره: هل الطول نفسه؟ */
  async reveal(item, r) { await S(item.mv === 'scale' ? 'gen.xf.reveal.scale' : 'gen.xf.n.' + item.mv); },
  praise: () => 'praiseLook', twin(item) { return item.twin || null; },
};
/* ================= ⑦ الأجزاء المتناظرة (C314): المثلث أ ب ج يطابق د هـ و؛ side «أب» | «بج» | «أج»، والثاني بحركة xf تُخفي الترتيب ================= */
const CG_SIDES = { ab: [0, 1], bj: [1, 2], aj: [0, 2] };
function xfCongSym(g, x, y, s = 1, col = CO.ink) { el('path', { d: `M${x - 7 * s} ${y - 7 * s} q${3.5 * s} ${-4 * s} ${7 * s} 0 t${7 * s} 0`, fill: 'none', stroke: col, 'stroke-width': 2.2 * s, 'stroke-linecap': 'round' }, g);
  for (const dy of [-1.5, 3.5]) geoLine(g, x - 7 * s, y + dy * s, x + 7 * s, y + dy * s, { color: col, w: 2.2 * s }); }
function xfTriSym(g, x, y, s = 1, col = CO.ink) { el('polygon', { points: polyStr([[x, y - 8 * s], [x + 7 * s, y + 4 * s], [x - 7 * s, y + 4 * s]]), fill: 'none', stroke: col, 'stroke-width': 2 * s, 'stroke-linejoin': 'round' }, g); }
/* «∆ أ ب ج ≅ ∆ د هـ و» من اليمين: المثلّث ورؤوسه، ثم الرمز، ثم صورته */
function xfCongStmt(parent, cx, y, o = {}) { const g = el('g', { 'pointer-events': 'none' }, parent), fs = o.fs || 16, col = o.col || CO.ink, t1 = ['a', 'b', 'j'].map(k => LTR[k]).join(' '), t2 = (o.n2 || ['d', 'h', 'w']).map(k => LTR[k]).join(' ');
  const T = s => { const t = el('text', { x: 0, y: y + fs * .35, 'text-anchor': 'middle', 'font-size': fs, 'font-weight': 800, fill: col, direction: 'rtl' }, g); t.textContent = s; let w = 0; try { w = t.getComputedTextLength(); } catch (e) {} return [t, w || s.length * fs * .45]; };
  const [a, wa] = T(t1), [b, wb] = T(t2), W = 14 + 6 + wa + 12 + 16 + 12 + 14 + 6 + wb; let x = cx + W / 2;
  xfTriSym(g, x - 7, y, 1, col); x -= 20; a.setAttribute('x', x - wa / 2); x -= wa + 12; xfCongSym(g, x - 8, y + 1, 1, col); x -= 28; xfTriSym(g, x - 7, y, 1, col); x -= 20; b.setAttribute('x', x - wb / 2);
  return g; }
ITEM.congPart = {
  make(spec) { return { ...spec, want: spec.side, tag: 'cong-part' }; },
  async ask(item, mode, tries) { const svg = m3Stage(262), Pl = coPlane(svg, { n: 12, m: 8, axes: false, top: 40 }), a = item.pts, b = a.map(p => xfApply(item.xf, p)), N2 = item.perm ? item.perm.map(i => ['d', 'h', 'w'][i]) : ['d', 'h', 'w'];   /* perm: رؤوس الثاني بترتيب عبارة التطابق (المراجع A لبوابة M4-U3/U4، 2) */   /* العبارة فوق الورقة الداخلية لا على حافة الإطار (المراجع B) */
    xfPoly(svg, Pl, a); xfPoly(svg, Pl, b, { col: XF.img, fill: XF.imgF, label: i => LTR[N2[i]] });
    xfCongStmt(svg, 180, 34, { n2: N2 });
    const sideTxt = (k, two) => { const [i, j] = CG_SIDES[k], n = two ? N2 : XF_NM; return LTR[n[i]] + ' ' + LTR[n[j]]; };
    if (tries >= 3) { const m = helpG(svg); a.forEach((p, i) => { const P = Pl.P(...p), Q = Pl.P(...b[i]); geoLine(m, P[0], P[1], Q[0], Q[1], { color: THINK_INK, w: 1.6, dash: '4 4' }); }); await S('gen.xf.together.part'); } else { await S(item.perm ? item.q : 'gen.xf.q.part.' + item.side); }
    const sideLine = s => item.perm ? 'gen.xf.side2p.' + CG_SIDES[s].map(i => N2[i]).join('') : 'gen.xf.side2.' + s, k = await choosePick(shuffle(Object.keys(CG_SIDES).map(s => [s, sideTxt(s, true), '<i></i>', sideLine(s)])), item.want); void sideTxt; return { ans: k, ctx: { svg, Pl } }; },
  judge(item, k) { return k === item.want ? { ok: true } : { ok: false, err: 'congOrder' }; },
  onOk() { SFX.good(); }, onWrong() { SFX.soft(); },
  async hint2(item, r) { if (r && r.ctx && r.ctx.Pl) { const m = helpG(r.ctx.svg), P = r.ctx.Pl.P(...item.pts[0]), Q = r.ctx.Pl.P(...xfApply(item.xf, item.pts[0])); geoLine(m, P[0], P[1], Q[0], Q[1], { color: THINK_INK, w: 2.2, dash: '4 4' }); xfRing(m, r.ctx.Pl, [item.pts[0], xfApply(item.xf, item.pts[0])]); } await S('gen.xf.hint.part'); }, async together() {},   /* الأوّل مع الأوّل مرسوماً، والباقي للطفل */
  async reveal(item) { await S(item.perm ? 'gen.xf.side2p.' + CG_SIDES[item.side].map(i => ['d', 'h', 'w'][item.perm[i]]).join('') : 'gen.xf.side2.' + item.side); },
  praise: () => 'praiseThink', twin(item) { return item.twin || null; },
};
/* ================= ⑧ هل تحدّد المعطيات مثلثاً واحداً؟ (C314 د، تجريبياً): case sas | sss | ss | aaa | asa ================= */
const TD_ONE = { sas: true, sss: true, asa: true, ss: false, aaa: false };
/* رسم المعطيات بالأدوات (المراجع B لبوابة S3-U6/U7، 6): المستوى الثاني بناءٌ بالمسطرة والفرجار والمنقلة يبقى ويترك الحكم — قوسٌ واحد للضلع الحرّ،
   أو قوسان أو شعاعان يلتقيان، أو قاعدةٌ بلا طول في الزوايا وحدها؛ والحلّ المشترك مثلثا طالبين بالمعطيات نفسها جنباً إلى جنب، والحكم للطفل */
function tdTri(m, A, u, c, s = 1) { const B = [A[0] + 5 * u * s, A[1]], P = (d, r) => [A[0] + r * u * s * Math.cos(d * Math.PI / 180), A[1] - r * u * s * Math.sin(d * Math.PI / 180)];
  const C = c === 'sss' ? P(36.87, 4) : c === 'sas' ? P(60, 4) : c === 'ss' ? P(50, 4) : c === 'ss2' ? P(112, 4) : P(50, 5 * Math.sin(60 * Math.PI / 180) / Math.sin(70 * Math.PI / 180));
  el('polygon', { points: polyStr([A, B, C]), fill: XF.orgF, stroke: XF.org, 'stroke-width': 2.6, 'stroke-linejoin': 'round' }, m); return { A, B, C }; }
function tdDraw(svg, item, full) { const m = helpG(svg), c = item.case, u = 21, Lb = (p, s, col = THINK_INK) => htLab(m, p, s, col, 12), dash = { color: THINK_INK, w: 2.2, dash: '5 4' };
  if (full) {   /* طالبان: مثلثان بالمعطيات نفسها */
    if (c === 'aaa') { tdTri(m, [44, 214], u, 'aaa', .62); tdTri(m, [170, 214], u, 'aaa', 1.1); }
    else { tdTri(m, [40, 214], u, c); tdTri(m, [196, 214], u, c === 'ss' ? 'ss2' : c); }
    return m; }
  const A = [124, 210], B = [A[0] + 5 * u, A[1]];   /* طول القاعدة تحتها داخل الإطار */ geoLine(m, A[0], A[1], B[0], B[1], { color: XF.org, w: 3 }); Lb([(A[0] + B[0]) / 2, A[1] + 15], c === 'aaa' ? '؟' : MS('5'), XF.org);
  const ray = (V, deg, len) => { const E = [V[0] + len * Math.cos(deg * Math.PI / 180), V[1] - len * Math.sin(deg * Math.PI / 180)]; geoLine(m, V[0], V[1], E[0], E[1], dash); return E; };
  const arc = (V, r, a0, a1) => el('path', { d: arcPath(V, r, a0, a1), fill: 'none', stroke: THINK_INK, 'stroke-width': 2.2, 'stroke-dasharray': '5 4' }, m);
  if (c === 'ss') arc(A, 4 * u, 12, 168);   /* الضلع الثاني يدور حول طرفه: أين رأسه؟ */
  else if (c === 'sss') { arc(A, 4 * u, 20, 75); arc(B, 3 * u, 105, 160); }
  else if (c === 'sas') { ray(A, 60, 5.2 * u); arc(A, 4 * u, 40, 80); degText(m, A[0] + 30, A[1] - 8, 60, { size: 13, color: THINK_INK }); }
  else if (c === 'asa' || c === 'aaa') { ray(A, 50, 5.2 * u); ray(B, 120, 5.2 * u); degText(m, A[0] + 32, A[1] - 7, 50, { size: 13, color: THINK_INK }); degText(m, B[0] - 30, B[1] - 7, 60, { size: 13, color: THINK_INK }); }
  return m; }
ITEM.triDet = {
  make(spec) { return { ...spec, want: TD_ONE[spec.case] ? 'one' : 'many', tag: 'tri-det' }; },
  async ask(item, mode, tries) { const svg = m3Stage(250), g = el('g', { 'pointer-events': 'none' }, svg); el('rect', { x: 24, y: 20, width: 312, height: 84, rx: 16, fill: '#fff', stroke: XF.org, 'stroke-width': 2.5 }, g);   /* البطاقة أعلى، وتحتها مساحة الرسم */
    const lines = labelText('xfTD.' + item.case + (item.v ? '.' + item.v : '')).split('|'); lines.forEach((s, i) => { const t = el('text', { x: 180, y: 68 + i * 30 - (lines.length - 1) * 15, 'text-anchor': 'middle', 'font-size': 17, 'font-weight': 800, fill: CO.ink, direction: 'rtl' }, g); t.textContent = s; });
    if (tries >= 3) tdDraw(svg, item, true);
    await S(tries >= 3 ? 'gen.xf.together.det' : item.q || 'gen.xf.q.det', { noGap: true }); await S('gen.xf.td.' + item.case + (item.v ? '.' + item.v : ''), { append: true });
    const k = await choosePick([['one', labelText('xfTD.one'), '<i></i>', 'gen.xf.td.one'], ['many', labelText('xfTD.many'), '<i></i>', 'gen.xf.td.many']], item.want, { cls: 'cards' }); return { ans: k, ctx: { svg } }; },
  judge(item, k) { return k === item.want ? { ok: true } : { ok: false, err: item.case === 'aaa' ? 'detAngles' : item.case === 'ss' ? 'detTwoSides' : 'detFixed' }; },
  onOk() { SFX.good(); }, onWrong() { SFX.soft(); },
  async hint2(item, r) { if (r && r.ctx && r.ctx.svg) { tdDraw(r.ctx.svg, item, false); await sleep(FAST ? 10 : 250); } await S(item.case === 'aaa' ? 'gen.xf.hint.detA' : 'gen.xf.hint.det'); }, async together() {},
  async reveal(item) { await S('gen.xf.td.' + item.want); },
  praise: () => 'praiseThink', twin(item) { return item.twin || null; },
};

/* ================= المشاهد ================= */
SCENES.triDetShow = async c => { const L = c.lines, svg = m3Stage(250), A = [104, 204], u = 34, AB = 5 * u, AC = 4 * u, Bp = [A[0] + AB, A[1]], g = el('g', { 'pointer-events': 'none' }, svg);
  const tri = (ang, o = {}) => { const C = [A[0] + AC * Math.cos(-ang * Math.PI / 180), A[1] + AC * Math.sin(-ang * Math.PI / 180)]; return el('polygon', { points: polyStr([A, Bp, C]), fill: o.fill || 'none', stroke: o.col || XF.org, 'stroke-width': o.w || 3, 'stroke-dasharray': o.dash || null, 'stroke-linejoin': 'round' }, g); };
  const lab = (p, s, col) => { const t = el('text', { x: p[0], y: p[1], 'text-anchor': 'middle', 'font-size': 15, 'font-weight': 800, fill: col || CO.ink, stroke: '#fff', 'stroke-width': 4, 'paint-order': 'stroke' }, g); t.textContent = s; return t; };
  lab([A[0] + AB / 2, A[1] + 22], ciTxt(5, 'cm')); tri(60, { fill: XF.orgF }); lab([A[0] + 30, A[1] - 52], ciTxt(4, 'cm')); el('path', { d: `M${A[0] + 26} ${A[1]} A26 26 0 0 0 ${A[0] + 26 * Math.cos(Math.PI / 3)} ${A[1] - 26 * Math.sin(Math.PI / 3)}`, fill: 'none', stroke: THINK_INK, 'stroke-width': 3 }, g); lab([A[0] + 46, A[1] - 12], MS('60'), THINK_INK); el('circle', { cx: A[0] + 58, cy: A[1] - 24, r: 2.6, fill: 'none', stroke: THINK_INK, 'stroke-width': 1.6 }, g);
  await S(L[0]); const t2 = tri(60, { col: XF.img, dash: '7 5', w: 3.4 }); SFX.tick(); await sleep(FAST ? 2 : 500); await S(L[1]); t2.remove();
  g.innerHTML = ''; lab([A[0] + AB / 2, A[1] + 22], ciTxt(5, 'cm')); for (const [i, ang] of [38, 62, 92, 122].entries()) { tri(ang, { col: [XF.org, XF.img, XF.ok, XF.line][i], w: 2.6 }); SFX.tick(); await sleep(FAST ? 2 : 350); } const arc = (a, b) => `M${A[0] + AC * Math.cos(-a * Math.PI / 180)} ${A[1] + AC * Math.sin(-a * Math.PI / 180)} A${AC} ${AC} 0 0 0 ${A[0] + AC * Math.cos(-b * Math.PI / 180)} ${A[1] + AC * Math.sin(-b * Math.PI / 180)}`; el('path', { d: arc(30, 125), fill: 'none', stroke: THINK_INK, 'stroke-width': 2, 'stroke-dasharray': '5 5' }, g); lab([A[0] + (AC + 18) * Math.cos(-107 * Math.PI / 180), A[1] + (AC + 18) * Math.sin(-107 * Math.PI / 180)], ciTxt(4, 'cm'), THINK_INK);   /* طرف الضلع الثاني يدور على قوسٍ كالمفصل */
  for (const l of L.slice(2)) await S(l); };
/* الإشعال (د1): فوضى تنسخ المثلث بالاتجاه نفسه «هذه صورته في المرآة!»، والورقة المقلوبة تُظهر الصورة الصحيحة */
SCENES.mirrorHook = async c => { const L = c.lines, svg = m3Stage(262), Pl = coPlane(svg, { nums: false }), P = [[1, 1], [4, 1], [2, 4]], xf = { k: 'ref', axis: 'v', at: 5 }; xfMark(svg, Pl, xf); xfPoly(svg, Pl, P); const fz = chaosAt(svg, 318, 40, .4); chaosGiggle(fz);
  const bad = xfPoly(svg, Pl, P.map(([x, y]) => [x + 5, y]), { col: XF.ctr, fill: '#f6d5d2', img: true }); await S(L[0]); bad.g.remove(); xfPoly(svg, Pl, P.map(p => xfApply(xf, p)), { col: XF.img, fill: XF.imgF, img: true }); SFX.good(); for (const l of L.slice(1)) await S(l); };
/* الاكتشاف (د1): الصورة بالبعد نفسه والواصل عمودي؛ الخط الرأسي عند 5 ثم الأفقي عند 4؛ ما يبقى وما ينقلب */
SCENES.refShow = async c => { const L = c.lines, svg = m3Stage(262), Pl = coPlane(svg, {}); let g = el('g', {}, svg); const P = [[1, 1], [4, 1], [2, 4]], X1 = { k: 'ref', axis: 'v', at: 5 };
  xfMark(g, Pl, X1); xfPoly(g, Pl, P); const m = el('g', { 'pointer-events': 'none' }, g); const J = Pl.P(2, 4), Jm = Pl.P(5, 4), J2 = Pl.P(8, 4); geoLine(m, J[0], J[1], Jm[0], Jm[1], { color: css('--compass'), w: 3 }); badge(m, (J[0] + Jm[0]) / 2, J[1] - 14, 3, css('--compass')); await S(L[0]);
  geoLine(m, Jm[0], Jm[1], J2[0], J2[1], { color: THINK_INK, w: 3 }); badge(m, (Jm[0] + J2[0]) / 2, J[1] - 14, 3, THINK_INK); xfPoly(g, Pl, P.map(p => xfApply(X1, p)), { col: XF.img, fill: XF.imgF, img: true }); SFX.tick(); await S(L[1]);
  g.remove(); g = el('g', {}, svg); const P2 = [[2, 1], [5, 1], [3, 3]], X2 = { k: 'ref', axis: 'h', at: 4 }; xfMark(g, Pl, X2); xfPoly(g, Pl, P2); await sleep(FAST ? 2 : 400); xfPoly(g, Pl, P2.map(p => xfApply(X2, p)), { col: XF.img, fill: XF.imgF, img: true }); SFX.tick(); for (const l of L.slice(2)) await S(l); };
/* الإشعال (د2): فوضى تنقل المثلث وتديره قليلاً «هذا انسحاب!» */
SCENES.trHook = async c => { const L = c.lines, svg = m3Stage(262), Pl = coPlane(svg, { nums: false }), P = [[1, 1], [4, 1], [2, 4]]; xfPoly(svg, Pl, P); const fz = chaosAt(svg, 318, 40, .4); chaosGiggle(fz);
  const bad = xfPoly(svg, Pl, P.map(p => xfApply({ k: 'rot', c: [5, 3], q: 1 }, [p[0] + 1, p[1]])), { col: XF.ctr, fill: '#f6d5d2', img: true, names: false }); await S(L[0]); bad.g.remove(); xfPoly(svg, Pl, P.map(p => [p[0] + 3, p[1] + 2]), { col: XF.img, fill: XF.imgF, img: true }); SFX.good(); for (const l of L.slice(1)) await S(l); };
/* الاكتشاف (د2): 3 يميناً و2 لأعلى، والأسهم متوازية ومتساوية، ثم 4 يساراً و3 لأسفل */
SCENES.trShow = async c => { const L = c.lines, svg = m3Stage(262), Pl = coPlane(svg, { n: 11 }); let g = el('g', {}, svg); const P = [[1, 1], [4, 1], [2, 4]];
  xfMark(g, Pl, { k: 'tr', dx: 3, dy: 2 }); xfPoly(g, Pl, P); await sleep(FAST ? 2 : 300); const I = P.map(p => [p[0] + 3, p[1] + 2]); xfPoly(g, Pl, I, { col: XF.img, fill: XF.imgF, img: true }); await S(L[0]);
  P.forEach((p, i) => { const a = Pl.P(...p), b = Pl.P(...I[i]), ang = Math.atan2(b[1] - a[1], b[0] - a[0]) * 180 / Math.PI; geoLine(g, a[0], a[1], b[0], b[1], { color: THINK_INK, w: 2.4 }); geoArrow(g, b[0], b[1], ang, THINK_INK, 7); }); SFX.tick(); await S(L[1]);
  g.remove(); g = el('g', {}, svg); const R = [[5, 4], [9, 4], [9, 6], [5, 6]]; xfMark(g, Pl, { k: 'tr', dx: -4, dy: -3 }); xfPoly(g, Pl, R); await sleep(FAST ? 2 : 400); xfPoly(g, Pl, R.map(p => [p[0] - 4, p[1] - 3]), { col: XF.img, fill: XF.imgF, img: true }); SFX.tick(); for (const l of L.slice(2)) await S(l); };
/* الإشعال (د3): فوضى تدير ربع دورة وتقول «نصف دورة!» */
SCENES.rotHook = async c => { const L = c.lines, svg = m3Stage(262), Pl = coPlane(svg, { nums: false }), P = [[5, 4], [8, 4], [8, 6]], X = { k: 'rot', c: [5, 4], q: 1 }; xfPoly(svg, Pl, P); const fz = chaosAt(svg, 318, 40, .4); chaosGiggle(fz);
  xfPoly(svg, Pl, P.map(p => xfApply(X, p)), { col: XF.ctr, fill: '#f6d5d2', img: true }); const C = Pl.P(5, 4); el('circle', { cx: C[0], cy: C[1], r: 5.5, fill: XF.ctr }, svg); await S(L[0]);
  const m = helpG(svg), A = Pl.P(8, 4), A2 = Pl.P(5, 7); el('path', { d: `M${C[0] + 12} ${C[1]} L${C[0] + 12} ${C[1] - 12} L${C[0]} ${C[1] - 12}`, fill: 'none', stroke: THINK_INK, 'stroke-width': 2.4 }, m); geoLine(m, C[0], C[1], A[0], A[1], { color: THINK_INK, w: 2 }); geoLine(m, C[0], C[1], A2[0], A2[1], { color: THINK_INK, w: 2 }); SFX.tick(); for (const l of L.slice(1)) await S(l); };
/* الاكتشاف (د3): المركز م (5 ، 4) والمثلث م (5 ، 4) أ (8 ، 4) ب (8 ، 6): ربع ونصف وثلاثة أرباع دورة عكس عقارب الساعة؛ ثم نصف الدورة: المركز منتصف الواصل */
SCENES.rotShow = async c => { const L = c.lines, svg = m3Stage(262), Pl = coPlane(svg, {}); const P = [[5, 4], [8, 4], [8, 6]], lab = i => i ? xfName(i - 1, false) : labelText('xfCenter');
  const og = xfPoly(svg, Pl, P, { label: lab }); let g = el('g', {}, svg); svg.insertBefore(g, og.g);   /* الصور تحت الأصل: لا تغطّي «م» */
  for (const [q, li] of [[1, 0], [2, 1], [3, 2]]) { g.remove(); g = el('g', {}, svg); svg.insertBefore(g, og.g); const X = { k: 'rot', c: [5, 4], q }; xfMark(g, Pl, X); const I = P.map(p => xfApply(X, p)); await sleep(FAST ? 2 : 300); xfPoly(g, Pl, I, { col: XF.img, fill: XF.imgF, label: i => i ? xfName(i - 1, true) : '' }); SFX.tick(); await S(L[li]); }
  g.remove(); g = el('g', {}, svg); svg.insertBefore(g, og.g); const A = Pl.P(8, 4), A2 = Pl.P(2, 4), C = Pl.P(5, 4); geoLine(g, A[0], A[1], A2[0], A2[1], { color: THINK_INK, w: 2.4, dash: '6 4' }); { const bg = el('g', { 'pointer-events': 'none' }, svg); badge(bg, (A[0] + C[0]) / 2, A[1] - 14, 3, THINK_INK); badge(bg, (A2[0] + C[0]) / 2, A[1] - 14, 3, THINK_INK); }   /* الشارتان فوق الأصل */ xfPoly(g, Pl, P.map(p => xfApply({ k: 'rot', c: [5, 4], q: 2 }, p)), { col: XF.img, fill: XF.imgF, label: i => i ? xfName(i - 1, true) : '' });
  for (const l of L.slice(3)) await S(l); };
/* الإشعال (د4): «متوازي الأضلاع لا تماثل فيه!»، ثم ينطبق بنصف دورة */
SCENES.rsHook = async c => { const L = c.lines, svg = m3Stage(250); rsDraw(svg, 'para', 180, 118, 82); const fz = chaosAt(svg, 318, 40, .4); chaosGiggle(fz); await S(L[0]); const m = await rsSpin(svg, 'para', 180, 118, 82); void m; for (const l of L.slice(1)) await S(l); };
/* الاكتشاف (د4): المربع 4، والمثلث المتساوي الأضلاع 3، والقاعدة 360 ÷ عدد الانطباقات، والنوعان مستقلّان (الطائرة والمروحة) */
SCENES.rsShow = async c => { const L = c.lines, svg = m3Stage(250); let g = el('g', {}, svg); const t = a2Formula(svg, '', CO.ok, 222);
  rsDraw(g, 'sq', 180, 112, 74); await rsSpin(g, 'sq', 180, 112, 74); t.textContent = '360 ÷ 4 = 90'; await S(L[0]);
  g.remove(); g = el('g', {}, svg); rsDraw(g, 'eqTri', 180, 120, 80); await rsSpin(g, 'eqTri', 180, 120, 80); t.textContent = '360 ÷ 3 = 120'; await S(L[1]);
  g.remove(); g = el('g', {}, svg); t.textContent = ''; rsDraw(g, 'kite', 100, 112, 62); rsDraw(g, 'fan4', 262, 112, 66); for (const l of L.slice(2)) await S(l); };
/* الإشعال (د5): مثلثان بالزوايا نفسها وحجمين مختلفين «متطابقان!» */
SCENES.congHook = async c => { const L = c.lines, svg = m3Stage(262), Pl = coPlane(svg, { n: 12, m: 8, axes: false }), P = [[1, 1], [4, 1], [2, 3]]; xfPoly(svg, Pl, P, { names: false }); const big = P.map(([x, y]) => [5 + (x - 1) * 2, 1 + (y - 1) * 2]); xfPoly(svg, Pl, big, { col: XF.img, fill: XF.imgF, names: false }); const fz = chaosAt(svg, 318, 40, .4); chaosGiggle(fz);
  await S(L[0]); const m = helpG(svg), Q = P.map(p => Pl.P(p[0] + 4, p[1])); el('polygon', { points: polyStr(Q), fill: 'none', stroke: THINK_INK, 'stroke-width': 3, 'stroke-dasharray': '6 4' }, m); SFX.soft(); for (const l of L.slice(1)) await S(l); };
/* الاكتشاف (د5): الانطباق بحركة، والأجزاء المتناظرة بالترتيب */
SCENES.congShow = async c => { const L = c.lines, svg = m3Stage(262), Pl = coPlane(svg, { n: 12, m: 8, axes: false, top: 40 }), P = [[1, 1], [5, 1], [2, 4]], X = { k: 'ref', axis: 'v', at: 6 }, B = P.map(p => xfApply(X, p)), N2 = ['d', 'h', 'w'];
  xfPoly(svg, Pl, P); xfPoly(svg, Pl, B, { col: XF.img, fill: XF.imgF, label: i => LTR[N2[i]] }); xfMark(svg, Pl, X); await S(L[0]); const st = xfCongStmt(svg, 180, 34); anim(st, [{ opacity: 0 }, { opacity: 1 }], { duration: 400 });
  const m = helpG(svg); P.forEach((p, i) => { const a = Pl.P(...p), b = Pl.P(...B[i]); geoLine(m, a[0], a[1], b[0], b[1], { color: THINK_INK, w: 1.6, dash: '4 4' }); }); SFX.tick(); for (const l of L.slice(1)) await S(l); };
/* المشروع (د5): بلاطة القصر — المثلث م (4 ، 4) أ (8 ، 4) ب (8 ، 6) يدور ثلاث مرات ربع دورة حول م */
SCENES.tileShow2 = async c => { const L = c.lines, svg = m3Stage(262), Pl = coPlane(svg, { n: 8, m: 8 }), P = [[4, 4], [8, 4], [8, 6]], cols = ['#d8e8f6', '#fbe3d1', '#d8f0e0', '#efe0f5'];
  for (let q = 0; q < 4; q++) { const I = P.map(p => xfApply({ k: 'rot', c: [4, 4], q }, p)); xfPoly(svg, Pl, I, { fill: cols[q], col: [XF.org, XF.img, XF.ok, XF.line][q], names: false }); SFX.tick(); await sleep(FAST ? 2 : 500); if (q === 0) await S(L[0]); }
  for (const l of L.slice(1)) await S(l); };
WRAP_ART.xfArt = svg => { const Pl = coPlane(svg, { n: 8, m: 4, H: 200, top: 30, nums: false, axes: false }); xfMark(svg, Pl, { k: 'ref', axis: 'v', at: 4 }); xfPoly(svg, Pl, [[1, 1], [3, 1], [2, 3]], { names: false }); xfPoly(svg, Pl, [[7, 1], [5, 1], [6, 3]], { col: XF.img, fill: XF.imgF, names: false }); };
