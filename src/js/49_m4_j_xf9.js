/* =====================================================================
   M4-U9 «التحويلات على المستوى الكامل» (المرحلة 4، نوفمبر 2026)
   د1 الانعكاس على المحورين (C420 أ) · د2 الدوران حول الأصل بمضاعفات 90° (C420 ب)
   د3 الدوران بزاوية بالمنقلة والفرجار (C422) وتركيب التحويلات · د4 مشروع «مدينة المرايا»
   الأسماء بالعربية والصيغ بالكلمات والأمثلة أولاً (المرجع، تعديل 1)
   ===================================================================== */
const C9 = { org: '#2f7fc1', img: '#d9822b', ok: SO.ok, hl: SO.hl, q: '#c0392b', ax: '#c0392b', arc: '#7a4fb0', ink: '#24323a' };
const c9Say = async (L, i) => { if (L[i]) await S(L[i]); };
const c9Clear = svg => { const fr = svg.querySelector('rect[x="20"][y="14"][rx="14"]'); if (fr) while (fr.nextSibling) fr.nextSibling.remove(); };   /* المسرح خالياً إلا إطاره، قبل بطاقة القاعدة في آخر المشهد */
/* التحويلات: الدوران عكس عقارب الساعة حول الأصل */
const C9_XF = { refV: ([x, y]) => [-x, y], refH: ([x, y]) => [x, -y], rot90: ([x, y]) => [-y, x], rot180: ([x, y]) => [-x, -y], rot270: ([x, y]) => [y, -x] };
const c9Ap = (s, p) => Array.isArray(s) ? [p[0] + s[1], p[1] + s[2]] : C9_XF[s](p);   /* خطوة: اسم تحويل، أو ['tr', dx، dy] */
const c9Run = (seq, p) => seq.reduce((q, s) => c9Ap(s, q), p);
const c9K = ps => ps.map(preKey).join(' ');
const c9Set = ps => ps.map(p => typeof p === 'string' ? p : preKey(p)).sort().join(' ');   /* مجموعة الرؤوس بلا ترتيب */
const c9Same = (a, b) => a.length === b.length && a.every((p, i) => p[0] === b[i][0] && p[1] === b[i][1]);
/* المحور المرآة مُبرَزاً، أو الأصل مركزاً للدوران */
function c9Mark(parent, Pl, xf) { const g = el('g', { 'pointer-events': 'none' }, parent);
  if (xf === 'refV' || xf === 'refVH') { const A = Pl.P(0, -Pl.m), B = Pl.P(0, Pl.m); geoLine(g, A[0], A[1], B[0], B[1], { color: C9.ax, w: 5 }); }
  if (xf === 'refH' || xf === 'refVH') { const A = Pl.P(-Pl.n, 0), B = Pl.P(Pl.n, 0); geoLine(g, A[0], A[1], B[0], B[1], { color: C9.ax, w: 5 }); }
  if (/^rot/.test(xf)) { const O = Pl.P(0, 0); el('circle', { cx: O[0], cy: O[1], r: 7, fill: C9.ax, stroke: '#fff', 'stroke-width': 2 }, g); }
  return g; }
/* شكلٌ على المستوى الكامل: أعداد المحورين تحت رؤوسه وداخله تُخفى، واسم الرأس يُزاح عن نصٍّ تحته (TXSTRICT لبوابة M4-U9 والختامي) */
function c9Poly(parent, Pl, pts, o = {}) { const r = xfPoly(parent, Pl, pts, o);
  if (Pl && Pl.tk) { const B = r.Q.map(q => [q[0] - 6, q[1] - 6, q[0] + 6, q[1] + 6]); if (pts.length > 2 && (o.fill || XF.orgF) !== 'none') { const xs = r.Q.map(q => q[0]), ys = r.Q.map(q => q[1]); B.push([Math.min(...xs), Math.min(...ys), Math.max(...xs), Math.max(...ys)]); } c4Hide(Pl, B);
    const T = [...r.g.querySelectorAll('text')]; T.forEach((t, i) => { const x = +t.getAttribute('x'), y = +t.getAttribute('y'), q = T.length === r.Q.length ? r.Q[i] : null;
      if (!q) { c9Free(t, [[x + 14, y], [x - 14, y], [x, y - 16], [x, y + 16], [x + 14, y - 14], [x - 14, y + 14], [x + 14, y + 14], [x - 14, y - 14]], Pl); return; }
      const a0 = Math.atan2(y - 5 - q[1], x - q[0]), A = [0, 1, -1, 2, -2, 3, -3, 4].map(k => a0 + k * Math.PI / 4);   /* حول رأسه نفسه: الجهة الخارجية أولاً ثم ما يليها، فلا يبتعد الاسم عن نقطته */
      c9Free(t, A.map(a => [q[0] + 17 * Math.cos(a), q[1] + 17 * Math.sin(a) + 5]).concat(A.map(a => [q[0] + 24 * Math.cos(a), q[1] + 24 * Math.sin(a) + 5])), Pl); }); }
  return r; }
/* كـ c4Free، والنقاط الصغيرة الملوّنة عوائق أيضاً: لا يُكتب اسمٌ فوق مركز نقطة (المراجع B لبوابة M4-U9، 9؛ فحص «نصٌّ فوق نقطة») */
function c9Free(t, alts, Pl) { const sv = t.ownerSVGElement; if (!sv) return t; const bb = e => { try { const b = e.getBBox(); return b && b.width ? b : null; } catch (er) { return null; } };
  const B = [...sv.querySelectorAll('text')].filter(e => e !== t && !e.hasAttribute('data-tk') && e.getAttribute('visibility') !== 'hidden' && !e.closest('[visibility=hidden]')).map(bb).filter(Boolean), D = [];
  for (const c of sv.querySelectorAll('circle')) { const r = +c.getAttribute('r'), f = c.getAttribute('fill'); if (r < 3 || r > 8 || !f || f === 'none' || f === 'transparent' || c.closest('[data-help]')) continue; D.push({ x: +c.getAttribute('cx') - 2.5, y: +c.getAttribute('cy') - 2.5, width: 5, height: 5 }); }
  const hit = () => { const b = t.getBBox(); return B.some(c => b.x < c.x + c.width - 1 && b.x + b.width > c.x + 1 && b.y < c.y + c.height - 1 && b.y + b.height > c.y + 1) || D.some(c => b.x < c.x + c.width && b.x + b.width > c.x && b.y < c.y + c.height && b.y + b.height > c.y); };
  for (const [x, y, an] of alts) { if (!hit()) break; t.setAttribute('x', x); t.setAttribute('y', y); if (an) t.setAttribute('text-anchor', an); }
  if (Pl) { const b = t.getBBox(); c4Hide(Pl, [[b.x, b.y, b.x + b.width, b.y + b.height]]); } return t; }
/* بطاقة التحويل أعلى المسرح: اسمه بالكلمات */
function c9Card(svg, txt, o = {}) { const g = el('g', { 'pointer-events': 'none' }, svg), w = o.w || 230, cx = o.cx || 180, y = o.y ?? 16;   /* داخل الإطار الورقي (TXSTRICT لبوابة M4-U9 والختامي) */
  el('rect', { x: cx - w / 2, y, width: w, height: 26, rx: 10, fill: '#fff', stroke: o.col || C9.ax, 'stroke-width': 2 }, g); const t = preLab(g, cx, y + 18, txt, { fs: 15, col: o.col || C9.ax, dir: 'rtl' });
  let tw = 0; try { tw = t.getComputedTextLength(); } catch (e) {} if (tw > w - 18) t.setAttribute('font-size', Math.max(11, Math.floor(15 * (w - 18) / tw * 10) / 10)); return g; }   /* النصّ الطويل («ربع دورة عكس العقارب» مرتين) يُصغَّر حتى يسعه الإطار */
/* المستوى تحت بطاقة التحويل وفوق شريطٍ خالٍ لبطاقة المستوى الثاني (كما في U5) */
const C9_PL = (ext, H = 262, top = 56) => ({ ...ext, n: Math.min(8, ext.n + 1), top, H: H - 36 });   /* عمودٌ زائد يميناً ويساراً فيبقى الزوج خارج النقطتين لا بينهما */
const c9Name = xf => labelText('c9N.' + xf);
/* قاعدة التحويل: اسمه بالكلمات سطراً، وصيغته بالرمز تحته من اليمين لأن رموزها عربية (D280): (س ، ص) ← (−س ، ص)، والسالب على يمين الحرف */
const C9_FORM = { refV: ['−X', 'Y'], refH: ['X', '−Y'], rot90: ['−Y', 'X'], rot180: ['−X', '−Y'], rot270: ['Y', '−X'] };
function c9RuleCard(parent, cx, y, xf, o = {}) { const g = el('g', { 'pointer-events': 'none' }, parent), w = o.w || 250, col = o.col || C9.hl, X = labelText('coX'), Y = labelText('coY'), sub = t => t.replace('X', X).replace('Y', Y);
  el('rect', { x: cx - w / 2, y: y - 20, width: w, height: 50, rx: 12, fill: '#fff', stroke: col, 'stroke-width': 2.4 }, g); preLab(g, cx, y, labelText('c9Rule.' + xf), { fs: 14, col, dir: 'rtl' });
  /* كل رمزٍ في موضعه من اليمين، وبـ rtl فينعكس القوس كما في السطر العربي */
  const tok = ['(', 'X', '،', 'Y', ')', '←', '('].concat(...C9_FORM[xf].map((t, i) => (t[0] === '−' ? ['−', t[1]] : [t]).concat(i ? [] : ['،'])), [')']), W = { '(': 8, ')': 8, '،': 12, '←': 28, '−': 10 };
  const ws = tok.map(t => W[t] || 15), tot = ws.reduce((a, b) => a + b, 0); let x = cx + tot / 2;
  tok.forEach((t, i) => { const c = x - ws[i] / 2; x -= ws[i]; if (t === '←') { geoLine(g, c + 10, y + 16, c - 9, y + 16, { color: col, w: 2.6 }); geoArrow(g, c - 10, y + 16, 180, col, 7); return; }   /* السهم مرسوماً: خطّ القراءة لا يحمل U+2190 (المراجع B لبوابة M4-U9، 1) */
    const e = el('text', { x: c, y: y + 22, 'text-anchor': 'middle', 'font-size': 16, 'font-weight': 800, fill: col, direction: 'rtl' }, g); e.textContent = sub(t); });
  return g; }
/* قوس الدوران حول الأصل من النقطة إلى صورتها (عكس عقارب الساعة) */
function c9TurnArc(parent, Pl, p, q, o = {}) { const O = Pl.P(0, 0), A = Pl.P(...p), r = Math.hypot(A[0] - O[0], A[1] - O[1]), a0 = Math.atan2(O[1] - A[1], A[0] - O[0]) * 180 / Math.PI, B = Pl.P(...q);
  let a1 = Math.atan2(O[1] - B[1], B[0] - O[0]) * 180 / Math.PI; while (a1 <= a0 + 1) a1 += 360; if (o.cw) a1 -= 360;
  const g = el('g', { 'pointer-events': 'none' }, parent); el('path', { d: angArc(O, r, Math.min(a0, a1), Math.max(a0, a1)), fill: 'none', stroke: o.col || C9.arc, 'stroke-width': 2.6, 'stroke-dasharray': '6 4' }, g);
  geoArrow(g, B[0], B[1], -(a1 + (o.cw ? -90 : 90)), o.col || C9.arc, 7); return g; }

/* المستوى الثاني رسمٌ (المعروف (2) لبوابة M4-U9 والختامي): للانعكاس العمودُ من النقطة إلى المرآة على خطّ الشبكة، وللدوران خطوتا النقطة من الأصل (الأفقية ثم الرأسية)؛ وسؤالٌ على الرسم لا القاعدة */
const C9_POS = [[180, 248], [0, 248], [400, 248], [180, 60], [0, 60], [400, 60]];   /* الشريط الخالي تحت المستوى أولاً */
function c9H2(m, Pl, p, xf) { const P = Pl.P(...p);
  if (xf === 'refV' || xf === 'refH') { const K = xf === 'refV' ? Pl.P(0, p[1]) : Pl.P(p[0], 0); if (Math.hypot(P[0] - K[0], P[1] - K[1]) < 2) { const E = xf === 'refV' ? [Pl.P(0, -Pl.m), Pl.P(0, Pl.m)] : [Pl.P(-Pl.n, 0), Pl.P(Pl.n, 0)]; hlSeg(m, E[0], E[1], H2C[0]); return 'ref'; }   /* النقطة على المرآة: المرآة كلّها مُبرزة لا حلقةٌ على الجواب */
    hlSeg(m, P, K, H2C[0]); hlRing(m, K, 9, H2C[0]); return 'ref'; }
  const O = Pl.P(0, 0), X = Pl.P(p[0], 0); hlSeg(m, O, X, H2C[0]); hlSeg(m, X, P, H2C[1]); hlRing(m, O, 10, C9.arc); return 'rot'; }
function c9H2Card(m, kind) { ciRule(m, 180, C9_POS, labelText('c9Ask.' + kind), C9.hl, 15); }
/* ================= ① ارسم الصورة على المستوى الكامل (C420): pts (نقطة إلى ثلاث)، xf؛ يلمس الطفل صورة كل رأس بالترتيب ================= */
function c9WrongImg(item) { const P = item.pts, alt = { refV: 'refH', refH: 'refV', rot90: 'rot270', rot270: 'rot90', rot180: 'refV' }[item.xf];
  let W = P.map(p => C9_XF[alt](p)); if (!c9Same(W, item.img)) return W; W = P.map(p => [p[0], p[1]]); if (!c9Same(W, item.img)) return W;
  return item.img.map(p => [p[0] + (p[0] < item.n ? 1 : -1), p[1]]); }
ITEM.c9Draw = {
  make(spec) { const img = spec.pts.map(p => C9_XF[spec.xf](p)), ex = c4Ext(spec.pts.concat(img), 4);
    /*T*/if (TESTHOOK && img.some(([x, y]) => Math.abs(x) > ex.n || Math.abs(y) > ex.ny)) testBug('c9Draw: الصورة خارج المستوى');/*/T*/
    return { ...spec, img, want: c9K(img), n: ex.n, ny: ex.ny, tag: 'c9-draw-' + spec.xf + (spec.pts.length === 1 ? '-pt' : '') }; },
  async ask(item, mode, tries) { const svg = m3Stage(262), Pl = c4Plane(svg, C9_PL({ n: item.n, ny: item.ny })), placed = [], lay = el('g', { 'pointer-events': 'none' }, svg); let prev = null, lastQ = null, done = false;
    const one = item.pts.length === 1; c9Mark(svg, Pl, item.xf); c9Poly(svg, Pl, item.pts, { col: C9.org, names: !one }); c9Card(svg, c9Name(item.xf));   /* النقطة الواحدة بلا اسمٍ فوقها: زوجها بجانبها (المراجع B لبوابة M4-U9، 9) */
    if (item.pts.length === 1) { const p = Pl.P(...item.pts[0]); coPairText(svg, p[0] + (item.pts[0][0] >= 0 ? 9 : -9), p[1] + (item.pts[0][1] >= 0 ? -10 : 19), preNum(item.pts[0][0]), preNum(item.pts[0][1]), item.pts[0][0] >= 0 ? 'start' : 'end', 12); }
    const redraw = () => { lay.innerHTML = ''; svg.appendChild(lay);   /* الصورة فوق الأصل وعلامة المحور فلا تغطّي نقطةٌ اسمها */ if (placed.length) c9Poly(lay, Pl, placed, { col: C9.img, fill: placed.length === item.pts.length && placed.length > 2 ? 'rgba(217,130,43,.14)' : 'none', img: true, names: !one });
      /*T*/window.__axPlaced = placed.length;/*/T*/ };
    const preview = q => { if (prev) prev.remove(); prev = null; if (!q || placed.length >= item.pts.length) return; const P = Pl.P(...Pl.snap(q)); prev = el('circle', { cx: P[0], cy: P[1], r: 7, fill: 'none', stroke: C9.img, 'stroke-width': 2.5, 'stroke-dasharray': '3 3', 'pointer-events': 'none' }, svg); };
    let tAt = 0; const tapAt = p => { const L = placed[placed.length - 1], now = performance.now(); if (L && L[0] === p[0] && L[1] === p[1]) { if (now - tAt < 400) return; placed.pop(); } else if (placed.length < item.pts.length) { placed.push(p); tAt = now; } SFX.tick(); redraw(); };   /* لمستان سريعتان على الخانة نفسها: الثانية لا تمحو الأولى (كما في xfDraw؛ المراجع B لبوابة M4-U9، 8) */
    if (tries >= 3) { const h = helpG(svg), O = Pl.P(0, 0); (one ? item.pts : item.pts.slice(0, -1)).forEach(p => { const A = Pl.P(...p);   /* للشكل طرق الرؤوس الموضوعة وحدها، والأخير كلّه للطفل (المراجع B لبوابة M4-U9، 5) */   /* نصف الطريق من كل رأس: العمود إلى المرآة بعلامة بُعده، أو ذراع الأصل وبداية القوس؛ والصورة للطفل (المراجع A لبوابة M4-U9، 7) */
        if (/^rot/.test(item.xf)) { geoLine(h, O[0], O[1], A[0], A[1], { color: THINK_INK, w: 2, dash: '5 4' }); const r = Math.hypot(A[0] - O[0], A[1] - O[1]), a = Math.atan2(O[1] - A[1], A[0] - O[0]) * 180 / Math.PI, d = item.xf === 'rot270' ? -20 : 20; if (r > 4) el('path', { d: angArc(O, r, Math.min(a, a + d), Math.max(a, a + d)), fill: 'none', stroke: THINK_INK, 'stroke-width': 2.4 }, h); }
        else { const K = item.xf === 'refV' ? Pl.P(0, p[1]) : Pl.P(p[0], 0); if (Math.hypot(A[0] - K[0], A[1] - K[1]) <= 2) { const u = item.xf === 'refV' ? [Pl.P(1, 0)[0] - Pl.P(0, 0)[0], 0] : [0, Pl.P(0, 1)[1] - Pl.P(0, 0)[1]]; for (const sg of [-1, 1]) geoLine(h, A[0] + sg * .45 * u[0], A[1] + sg * .45 * u[1], A[0] + sg * 1.6 * u[0], A[1] + sg * 1.6 * u[1], { color: THINK_INK, w: 2.4, dash: '5 4' }); }   /* على المرآة: العمود عليها من الجهتين بلا طولٍ إليها، ولا خطّ ينتهي على الجواب */
          if (Math.hypot(A[0] - K[0], A[1] - K[1]) > 2) { geoLine(h, A[0], A[1], K[0], K[1], { color: THINK_INK, w: 2, dash: '5 4' }); preTicks(h, A, K, 1, THINK_INK); } } });
      if (!one) { placed.push(...item.img.slice(0, item.img.length - 1).map(p => [...p])); redraw(); } }
    const askQ = async () => { if (tries >= 3) await S('gen.c9.together.draw'); else await S(item.q || 'gen.c9.q.draw.' + item.xf); };
    askQ(); REPLAY_HOOK = () => askQ(); REPLAY_HOOK.live = () => !done && svg.isConnected;
    const input = fingerInput(svg, { map: e => { const q = svgPoint(svg, e); return [q.x, q.y]; }, down(q) { if (!Pl.inside(q)) return false; lastQ = q; preview(q); }, move(q) { lastQ = q; preview(q); }, up(cancel) { preview(null); if (!cancel && lastQ) tapAt(Pl.snap(lastQ)); lastQ = null; }, lens: { Pl } });
    /*T*/window.__axWant = item.img; window.__axAt = (x, y) => { const m = svg.getScreenCTM(), [px, py] = Pl.P(x, y); return { x: m.a * px + m.e, y: m.d * py + m.f }; }; window.__axPlaced = placed.length;/*/T*/
    const kg = el('g', { role: 'grid', 'aria-label': labelText('coPlane') }, svg);
    for (let y = Pl.m; y >= -Pl.m; y--) { const row = el('g', { role: 'row' }, kg); for (let x = -Pl.n; x <= Pl.n; x++) { const [px, py] = Pl.P(x, y), b = el('g', { role: 'gridcell', tabindex: 0, ...(x === 0 && y === 0 ? { 'data-origin': '' } : {}), 'aria-label': plain(G(labelText('c4Cell'))).replace('X', x).replace('Y', y) }, row); el('circle', { cx: px, cy: py, r: 7, fill: 'transparent', 'pointer-events': 'none' }, b); b.onkeydown = e => { if (isActKey(e)) { e.preventDefault(); tapAt([x, y]); } }; } }   /* لوحة المفاتيح تبدأ من الأصل (المراجع B لبوابة M4-U9، 12) */
    AUTO({ kind: 'axPts', ok: () => { placed.length = 0; placed.push(...item.img.map(p => [...p])); redraw(); rulDoneBtn().click(); }, wrong: () => { placed.length = 0; placed.push(...c9WrongImg(item).map(p => [...p])); redraw(); rulDoneBtn().click(); } });
    await rulDone(() => { done = true; REPLAY_HOOK = null; input.off(); kg.remove(); preview(null); }); if (placed.length > 1 && c9Set(placed) === c9Set(item.img)) { placed.splice(0, placed.length, ...item.img.map(p => [...p])); redraw(); }   /* بترتيبٍ آخر: الصورة نفسها، فتُسمّى رؤوسها بنظائرها (كما في xfDraw؛ المراجع B لبوابة M4-U9، 6) */
    return { ans: c9K(placed), ctx: { svg, Pl } }; },
  judge(item, k) { if (k === item.want || (k && c9Set(k.split(' ')) === c9Set(item.want.split(' ')))) return { ok: true }; const a = k ? k.split(' ').map(s => s.split('_').map(v => v[0] === 'm' ? -+v.slice(1) : +v)) : [];
    if (a.length < item.pts.length) return { ok: false, err: 'c9Short' }; return { ok: false, err: c9ErrOf(item.xf, item.pts, a) }; },
  onOk() { SFX.good(); }, onWrong() { SFX.soft(); },
  async hint2(item, r) { if (r && r.ctx && r.ctx.Pl) { const m = helpG(r.ctx.svg); c9H2Card(m, c9H2(m, r.ctx.Pl, item.pts[0], item.xf)); } await S('gen.c9.hint.' + item.xf); }, async together() {},
  async reveal(item, r) { if (r && r.ctx) c9Poly(r.ctx.svg, r.ctx.Pl, item.img, { col: C9.ok, fill: 'none', dash: '7 5', img: true, names: item.pts.length > 1 }); await S(item.r || 'gen.c9.reveal.draw'); },
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
  make: s => { const img = C9_XF[s.xf](s.p); return { want: preKey(img), img, cands: c9PickCands(s.p, s.xf), ext: c4Ext([s.p, img], 4), tag: 'c9-pick-' + s.xf }; },
  draw(svg, item, tries) { const Pl = c4Plane(svg, C9_PL(item.ext)); c9Mark(svg, Pl, item.xf); c4Dot(svg, Pl, ...item.p, { pair: true, col: C9.org }); c9Card(svg, c9Name(item.xf));
    if (tries >= 3) { const h = helpG(svg), q = Pl.P(...item.img); if (/^rot/.test(item.xf)) c9TurnArc(h, Pl, item.p, item.img, { col: THINK_INK }); el('circle', { cx: q[0], cy: q[1], r: 9, fill: 'none', stroke: C9.hl, 'stroke-width': 3, 'stroke-dasharray': '4 3' }, h); }
    return { Pl }; },
  h2: async (item, ctx) => { const m = helpG(ctx.svg); if (ctx.Pl) c9H2Card(m, c9H2(m, ctx.Pl, item.p, item.xf)); await sleep(FAST ? 10 : 250); },
  show: async (item, ctx) => { if (ctx && ctx.Pl) c4Dot(helpG(ctx.svg), ctx.Pl, ...item.img, { col: C9.ok, pair: true }); },
  pick: item => choosePick(shuffle(item.cands.map(p => [preKey(p), coPair(preNum(p[0]), preNum(p[1])), '<i></i>', 'gen.c4.pt.' + preKey(p)])), item.want),
  errOf: (it, k) => { const a = [k.split('_').map(v => v[0] === 'm' ? -+v.slice(1) : +v)]; return c9ErrOf(it.xf, [it.p], a); } });

/* ================= ③ أيّ إحداثيٍّ تتغيّر إشارته؟ (C420 أ): xf refV | refH | rot180، p للرسم ================= */
ITEM.c9Which = cpItem({ H: 250, tLine: 'gen.c9.together.which', hint: 'gen.c9.hint.which', rLine: it => 'gen.c9.reveal.which.' + it.want, praise: 'praiseThink',
  make: s => ({ want: { refV: 'x', refH: 'y', rot180: 'both' }[s.xf], tag: 'c9-which-' + s.xf }),
  draw(svg, item, tries) { const Pl = c4Plane(svg, C9_PL(c4Ext([item.p, C9_XF[item.xf](item.p)], 4), 250)); c9Mark(svg, Pl, item.xf); c9Card(svg, c9Name(item.xf));
    c4Dot(svg, Pl, ...item.p, { pair: tries >= 3, col: C9.org }); if (tries >= 3) c4Dot(helpG(svg), Pl, ...C9_XF[item.xf](item.p), { pair: true, col: C9.img }); return { Pl }; },
  h2: async (item, ctx) => { const m = helpG(ctx.svg); if (ctx.Pl) c9H2Card(m, c9H2(m, ctx.Pl, item.p, item.xf)); await sleep(FAST ? 10 : 250); },
  pick: item => choosePick([['x', labelText('c9C.x'), '<i></i>', 'gen.c9.c.x'], ['y', labelText('c9C.y'), '<i></i>', 'gen.c9.c.y'], ['both', labelText('c9C.both'), '<i></i>', 'gen.c9.c.both']], item.want),
  errOf: (it, k) => k === 'both' ? 'c9Both' : it.want === 'both' ? 'c9Half' : 'c9Axis' });

/* ================= ④ أيّ تحويل؟ (C420): pts الأصل (شكل غير متماثل)، xf؛ الخيارات الأربعة ================= */
ITEM.c9NameIt = cpItem({ H: 262, tLine: 'gen.c9.together.name', hint: 'gen.c9.hint.name', rLine: it => 'gen.c9.n.' + it.xf, praise: 'praiseLook',
  make: s => { const img = s.pts.map(p => C9_XF[s.xf](p)); return { img, want: s.xf, ext: c4Ext(s.pts.concat(img), 4), tag: 'c9-name' }; },
  draw(svg, item, tries) { const Pl = c4Plane(svg, C9_PL(item.ext, 262, 26)); c9Poly(svg, Pl, item.pts, { col: C9.org, fill: 'rgba(47,127,193,.12)' }); c9Poly(svg, Pl, item.img, { col: C9.img, fill: 'rgba(217,130,43,.14)', img: true });
    if (tries >= 3) { const h = helpG(svg), A = Pl.P(...item.pts[0]), B = Pl.P(...item.img[0]); geoLine(h, A[0], A[1], B[0], B[1], { color: THINK_INK, w: 2.4, dash: '5 4' }); el('circle', { cx: A[0], cy: A[1], r: 9, fill: 'none', stroke: THINK_INK, 'stroke-width': 2.6 }, h); el('circle', { cx: B[0], cy: B[1], r: 9, fill: 'none', stroke: THINK_INK, 'stroke-width': 2.6 }, h); }
    return { Pl }; },
  h2: async (item, ctx) => { const m = helpG(ctx.svg); if (ctx.Pl) { hlRing(m, ctx.Pl.P(...item.pts[0]), 11, H2C[0]); hlRing(m, ctx.Pl.P(...item.img[0]), 11, H2C[1]); } c9H2Card(m, 'name'); await sleep(FAST ? 10 : 250); },   /* رأسٌ وصورته محاطان، والخطّ بينهما للثالث */
  show: async (item, ctx) => { if (ctx && ctx.Pl) c9Mark(helpG(ctx.svg), ctx.Pl, item.xf); },
  pick: item => choosePick(['refV', 'refH', 'rot90', 'rot180'].map(k => [k, labelText('c9S.' + k), '<i></i>', 'gen.c9.n.' + k]), item.want, { cls: 'four' }),
  errOf: (it, k) => /^ref/.test(k) && /^ref/.test(it.want) ? 'c9NameAxis' : /^rot/.test(k) && /^rot/.test(it.want) ? 'c9Amount' : 'c9NameKind' });

/* ================= ⑤ الدوران على الورق بالمنقلة والفرجار (C422): th الزاوية، cw الاتجاه، r البعد، a0 اتجاه م أ؛ ask ang | len | dir ================= */
function c9RotFig(g, o) { const M = o.M || [150, 160], u = o.u || 18, a0 = o.a0 ?? 10, a1 = a0 + (o.cw ? -o.th : o.th), A = angP(M, a0, o.r * u), B = angP(M, a1, o.r * u);
  for (const [P, col] of [[A, C9.org], [B, C9.img]]) geoLine(g, M[0], M[1], P[0], P[1], { color: col, w: 2.6, dash: '6 4' });
  pfDot(g, M); pfLab(g, M[0] - 12, M[1] + 18, 'م', { fs: 15 });
  for (const [P, col, t, a] of [[A, C9.org, 'أ', a0], [B, C9.img, 'أ’', a1]]) { el('circle', { cx: P[0], cy: P[1], r: 6, fill: col, stroke: '#fff', 'stroke-width': 2 }, g); const L = angP(M, a, o.r * u + 18); pfLab(g, L[0], L[1] + 5, t, { fs: 15, col }); }
  return { M, A, B, a0, a1, u }; }
/* ساعةٌ صغيرة بعقربٍ وقوسٍ باتجاه حركته: مرجعٌ للمقارنة لا جواب */
function c9Clock(parent, x, y) { const g = el('g', { 'pointer-events': 'none' }, parent); el('circle', { cx: x, cy: y, r: 20, fill: '#fff', stroke: C9.ink, 'stroke-width': 2 }, g);
  for (let k = 0; k < 12; k += 3) { const a = 90 - 30 * k, p = angP([x, y], a, 20), q = angP([x, y], a, 15); geoLine(g, p[0], p[1], q[0], q[1], { color: C9.ink, w: 1.6 }); }
  geoLine(g, x, y, x, y - 14, { color: C9.ink, w: 2.4 }); el('path', { d: angArc([x, y], 27, 30, 80), fill: 'none', stroke: C9.ink, 'stroke-width': 2 }, g); const E = angP([x, y], 30, 27); geoArrow(g, E[0], E[1], 60, C9.ink, 6); return g; }
const C9_RPOS = [[400, 248], [180, 248], [0, 248], [400, 36], [0, 36]];   /* بطاقة المستوى الثاني تحت الشكل في الجهة التي لا تنزل إليها المنقلة */
ITEM.c9Rot = cpItem({ H: 250, tLine: 'gen.c9.together.rot', hint: 'gen.c9.hint.rot', rLine: it => it.ask === 'dir' ? 'gen.c9.d.' + it.want : 'gen.c9.reveal.rot.' + it.ask, praise: 'praiseThink', together: item => S('gen.c9.together.rot.' + item.ask),
  rSay: it => it.ask === 'ang' ? sayDeg(it.want) : it.ask === 'len' ? S(numw(it.want), { append: true }) : null, num: true,
  make: s => { const ask = s.ask || 'ang', th = s.th, r = s.r || 5;
    if (ask === 'dir') return { ask, r, want: s.cw ? 'cw' : 'ccw', tag: 'c9-rot-dir' };
    if (ask === 'len') return { ask, r, want: r, nums: rankMix(r, [2 * r, r + 2, r + 1, r - 1, r - 2], 1, 20), tag: 'c9-rot-len' };
    const o = 180 - th, ds = [th - 10, th + 10, th - 20, th + 20].filter(v => v >= 10 && v <= 170 && v !== o), lo = ds.filter(v => v < th), hi = ds.filter(v => v > th);
    const nums = th === 90 ? rankMix(th, ds, 10, 170) : [th, o, shuffle(rand() < .5 ? (lo.length ? lo : hi) : (hi.length ? hi : lo))[0]];
    return { ask, r, want: th, nums, tag: 'c9-rot-ang' }; },   /* قراءة التدريج الآخر دائماً، ومشتّتٌ ثالث يجعل الجواب أصغرها أو أوسطها أو أكبرها (المراجع B لبوابة M4-U9، 3) */
  draw(svg, item, tries) { const b = item.b ?? 10, a0 = item.cw ? b + item.th : b, R = (item.r || 5) * 18, ang = item.ask === 'ang', PR = 96, cs = d => Math.cos(d * Math.PI / 180);
    /* الشعاع الأدنى عند b والدوران فوقه، والمركز أفقياً حيث يتوسّط الشكلُ واسماه والمنقلةُ الإطار (المراجع B لبوابة M4-U9، 2 و11) */
    const xs = [cs(b) * (R + 18), cs(b + item.th) * (R + 18), -22, 8].concat(ang ? [-PR, PR * cs(b)] : []), M = [Math.round(180 - (Math.min(...xs) + Math.max(...xs)) / 2), 160];
    const pg = el('g', {}, svg), g = el('g', {}, svg), F = c9RotFig(g, { th: item.th, cw: item.cw, r: item.r, a0, M });
    /*T*/if (TESTHOOK) { const lab = a => angP(M, a, R + 18), P = [F.A, F.B, lab(F.a0), lab(F.a1)].concat(ang ? [angP(M, b + 180, PR), [M[0] - PR, M[1]]] : []); if (P.some(([x, y]) => x < 26 || x > 334 || y < 20 || y > 232)) testBug('c9Rot: الشكل خارج الإطار ' + JSON.stringify([item.th, item.cw, b, item.r])); }/*/T*/
    if (ang) { arArc(g, F.M, b, b + item.th, { r: 16, col: C9.arc, fill: true }); protAt(pg, F.M, b, { R: PR, step: 30, fs: 1.27 });   /* المنقلة بتدريجيها وأعدادها الغربية من المحاولة الأولى، صفرها على الخطّ الأدنى (المراجع A لبوابة M4-U9، 3؛ D279 (2)؛ المراجع B، 7) */
      if (tries >= 3) el('path', { d: angArc(F.M, PR - 19, b, b + item.th), fill: 'none', stroke: THINK_INK, 'stroke-width': 4, opacity: .8 }, helpG(svg)); }   /* الثالث يبرز التدريج الخارجي من صفره، والقراءة للطفل */
    else { arArc(g, F.M, b, b + item.th, { r: 34, col: C9.arc, deg: item.th, dl: 18, fs: 14, fill: true }); }
    if (item.ask === 'len') { const m = [(F.M[0] + F.A[0]) / 2, (F.M[1] + F.A[1]) / 2]; preLab(g, m[0], m[1] + 20, MS(String(item.r)), { fs: 16, col: C9.org }); const n = [(F.M[0] + F.B[0]) / 2, (F.M[1] + F.B[1]) / 2]; preLab(g, n[0] - 14, n[1], '؟', { fs: 18, col: C9.q });
      if (tries >= 3) { const h = helpG(svg); el('path', { d: angArc(F.M, R, b - 6, b + item.th + 6), fill: 'none', stroke: THINK_INK, 'stroke-width': 2.6 }, h); } }
    if (item.ask === 'dir' && tries >= 3) { const h = helpG(svg); el('path', { d: angArc(F.M, R + 10, b, b + item.th), fill: 'none', stroke: THINK_INK, 'stroke-width': 2.6 }, h); c9Clock(h, 300, 200); }   /* القوس بلا رأس، وساعةٌ صغيرة يُقارن بها اتجاه الحركة من أ (المراجع B لبوابة M4-U9، 17) */
    return { F }; },
  h2: async (item, ctx) => { const m = helpG(ctx.svg), F = ctx.F; if (F) { hlRing(m, F.M, 10, C9.arc); if (item.ask === 'dir') { hlRing(m, F.A, 11, H2C[0]); hlRing(m, F.B, 11, H2C[1]); } else hlSeg(m, F.M, item.ask === 'ang' && F.a1 < F.a0 ? F.B : F.A, H2C[0]); }   /* الصفر على م أ، أو البعد الثابت، أو البداية والنهاية */
    ciRule(m, 180, C9_RPOS, labelText('c9Ask.rot' + { ang: 'Ang', len: 'Len', dir: 'Dir' }[item.ask]), C9.hl, 15); await sleep(FAST ? 10 : 250); },
  pick: (item, ctx) => { if (item.ask === 'dir') return choosePick([['ccw', labelText('c9D.ccw'), '<i></i>', 'gen.c9.d.ccw'], ['cw', labelText('c9D.cw'), '<i></i>', 'gen.c9.d.cw']], item.want);
    const np = numberPick(shuffle(item.nums), item.want, item.ask === 'ang' ? { west: true, word: degw } : { west: true }); ctx.np = np; return np.p; },
  errOf: (it, k) => it.ask === 'dir' ? 'c9DirWord' : it.ask === 'len' ? 'c9LenOff' : k === 180 - it.want ? 'c9AngSup' : 'c9AngOff' });

/* ================= ⑥ التركيب (C312، C338، D89): p، seq خطوتان؛ ask img (الصورة) | one (أيّ تحويل واحد يساويهما) | order (هل يتغيّر الناتج إن بدّلنا الترتيب؟) ================= */
const c9StepTxt = s => Array.isArray(s) ? labelText('c9Tr').replace('X', MS(String(s[1]))) : labelText((/^rot(90|270)$/.test(s) ? 'c9N.' : 'c9S.') + s);   /* الربع بجهته في بطاقة التركيب (المراجع B لبوابة M4-U9، 20) */
ITEM.c9Comp = cpItem({ H: 262, tLine: 'gen.c9.together.rot', together: item => S(item.ask === 'order' ? 'gen.c9.together.comp.order' : 'gen.c9.together.comp'), hint: 'gen.c9.hint.comp', rLine: it => it.ask === 'one' ? 'gen.c9.n.' + it.want : it.ask === 'order' ? 'gen.c9.reveal.order.' + it.want : 'gen.c9.reveal.pick', praise: 'praiseThink',
  make: s => { const ask = s.ask || 'img', mid = c9Ap(s.seq[0], s.p), img = c9Run(s.seq, s.p), back = c9Run([s.seq[1], s.seq[0]], s.p);
    if (ask === 'one') return { ask, mid, img, want: Object.keys(C9_XF).find(k => { const q = C9_XF[k](s.p); return q[0] === img[0] && q[1] === img[1]; }), tag: 'c9-comp-one' };
    if (ask === 'order') return { ask, mid, img, back, want: img[0] === back[0] && img[1] === back[1] ? 'no' : 'yes', tag: 'c9-comp-order' };
    const cands = [img, mid, c9Ap(s.seq[1], s.p), back, [img[0], -img[1]], [-img[0], img[1]]].filter((q, i, X) => X.findIndex(r => r[0] === q[0] && r[1] === q[1]) === i && !(q[0] === s.p[0] && q[1] === s.p[1])).slice(0, 3);
    return { ask, mid, img, want: preKey(img), cands, tag: 'c9-comp-img' }; },
  draw(svg, item, tries) { const pts = [item.p, item.mid, item.img].concat(item.back ? [item.back] : []), Pl = c4Plane(svg, C9_PL(c4Ext(pts, 4)));
    c9Card(svg, labelText('c9Seq').replace('A', c9StepTxt(item.seq[0])).replace('B', c9StepTxt(item.seq[1])), { w: 316 });
    c4Dot(svg, Pl, ...item.p, { pair: true, col: C9.org });
    if (tries >= 3) { const h = helpG(svg), A = Pl.P(...item.p); for (const [i, q] of (item.ask === 'order' ? [item.mid, c9Ap(item.seq[1], item.p)] : [item.mid]).entries()) { c4Dot(h, Pl, ...q, { pair: true, col: THINK_INK, below: i === 1 }); const B = Pl.P(...q); geoLine(h, A[0], A[1], B[0], B[1], { color: THINK_INK, w: 2, dash: '5 4' }); } }   /* في «الترتيب»: ناتجا الخطوة الأولى في الترتيبين، والتطبيق والمقارنة للطفل (المراجع B لبوابة M4-U9، 14) */
    return { Pl }; },
  h2: async (item, ctx) => { const m = helpG(ctx.svg), s = item.seq[item.ask === 'order' ? 1 : 0]; if (ctx.Pl) { if (!Array.isArray(s)) c9Mark(m, ctx.Pl, s); hlRing(m, ctx.Pl.P(...item.p), 11, H2C[0]); } c9H2Card(m, item.ask === 'order' ? 'order' : 'comp'); await sleep(FAST ? 10 : 250); },   /* أداة الخطوة الأولى (أو الثانية إن بدّلنا الترتيب)، وناتجها للثالث */
  sayQ: async it => { for (const [i, s] of it.seq.entries()) { await S(i ? 'gen.c9.then' : 'gen.c9.first', { append: true, noGap: true }); await S(Array.isArray(s) ? 'gen.c9.tr.' + s[1] : 'gen.c9.n.' + s, { append: true, noGap: true }); } await S('gen.c9.q.compEnd.' + it.ask, { append: true }); },
  show: async (item, ctx) => { if (ctx && ctx.Pl) { const h = helpG(ctx.svg); c4Dot(h, ctx.Pl, ...item.mid, { col: '#8a9aa8' }); c4Dot(h, ctx.Pl, ...item.img, { col: C9.ok, pair: item.ask === 'img' }); if (item.back) c4Dot(h, ctx.Pl, ...item.back, { col: C9.img, pair: true }); } },
  pick: item => item.ask === 'one' ? choosePick(shuffle(['rot90', 'rot180', 'refV', 'refH']).map(k => [k, labelText('c9S.' + k), '<i></i>', 'gen.c9.n.' + k]), item.want, { cls: 'four' })
    : item.ask === 'order' ? yesNo(item.want)
    : choosePick(shuffle(item.cands.map(p => [preKey(p), coPair(preNum(p[0]), preNum(p[1])), '<i></i>', 'gen.c4.pt.' + preKey(p)])), item.want),
  errOf: (it, k) => it.ask === 'one' ? 'c9CompOne' : it.ask === 'order' ? (k === 'yes' ? (it.seq.some(Array.isArray) ? 'c9OrderPar' : 'c9OrderYes') : 'c9OrderNo') : k === preKey(it.mid) ? 'c9CompHalf' : 'c9Off' });

/* ================= صور التعليل ================= */
function c9Pic(g, P) {
  if (P.lake) { el('rect', { x: 40, y: 112, width: 280, height: 80, rx: 10, fill: '#cfe8f3' }, g); geoLine(g, 40, 112, 320, 112, { color: '#2f7fc1', w: 3 });   /* بحيرةٌ هادئة: شجرةٌ على الشاطئ وصورتها في الماء (المراجع A لبوابة M4-U9، 13) */
    for (const [sg, op] of [[-1, 1], [1, .45]]) { const y0 = 112; el('rect', { x: 172, y: sg < 0 ? y0 - 46 : y0, width: 12, height: 46, fill: '#7d5a3a', opacity: op }, g); el('circle', { cx: 178, cy: y0 + sg * 68, r: 28, fill: '#6aa84f', opacity: op }, g); }
    return; }
  if (P.door) { const H = [96, 176], th = P.door[0], C = angP(H, 0, 170), O = angP(H, th, 170); el('path', { d: angArc(H, 170, 0, th), fill: 'none', stroke: C9.arc, 'stroke-width': 2.4, 'stroke-dasharray': '6 4' }, g);   /* بابٌ ومفصّلته، وطرفه يرسم قوساً */
    geoLine(g, H[0], H[1], C[0], C[1], { color: '#b08a57', w: 7 }); geoLine(g, H[0], H[1], O[0], O[1], { color: '#8a6a43', w: 7 }); el('circle', { cx: H[0], cy: H[1], r: 7, fill: C9.ink }, g); return; }
  if (P.rot) { const F = c9RotFig(g, { th: P.rot[0], cw: !!P.rot[1], r: 5, a0: P.rot[1] ? 90 + P.rot[0] / 2 : 90 - P.rot[0] / 2, M: [150, 150] }); arArc(g, F.M, Math.min(F.a0, F.a1), Math.max(F.a0, F.a1), { r: 34, col: C9.arc, deg: P.rot[0], dl: 18, fs: 14, fill: true }); return; }
  const p = P.p || [3, 1], seq = P.seq || [], ps = [p, ...seq.map((s, i) => c9Run(seq.slice(0, i + 1), p))];
  if (P.shape) { const sq = [p, [p[0] + 1, p[1]], [p[0] + 1, p[1] + 1], [p[0], p[1] + 1]], im = sq.map(q => c9Run(seq, q)), Pl = c4Plane(g, { ...c4Ext(sq.concat(im), 4), top: 12, H: 200 }); if (P.xf) c9Mark(g, Pl, P.xf);
    c9Poly(g, Pl, sq, { col: C9.org, fill: 'rgba(47,127,193,.14)', names: false }); c9Poly(g, Pl, im, { col: C9.img, fill: 'rgba(217,130,43,.14)', names: false }); if (P.turn) c9TurnArc(g, Pl, p, im[0]); return; }
  const Pl = c4Plane(g, { ...c4Ext(ps, 4), top: 12, H: 200 });
  if (P.xf) c9Mark(g, Pl, P.xf);
  ps.forEach((q, i) => c4Dot(g, Pl, ...q, { pair: true, col: i ? (i === ps.length - 1 ? C9.img : '#8a9aa8') : C9.org }));
  if (P.turn) c9TurnArc(g, Pl, p, ps[ps.length - 1]); }

/* ================= الألعاب الحركية (خطة ألعاب المرحلة 4) ================= */
/* صندوق الكنز عند نقطة */
function c9Chest(parent, P) { const g = el('g', { transform: `translate(${P[0]} ${P[1]})`, 'pointer-events': 'none' }, parent);
  el('rect', { x: -11, y: -6, width: 22, height: 14, rx: 2, fill: '#b9813f', stroke: '#6e4a22', 'stroke-width': 1.6 }, g); el('path', { d: 'M-11 -6 Q0 -16 11 -6 Z', fill: '#d29a52', stroke: '#6e4a22', 'stroke-width': 1.6 }, g);
  el('rect', { x: -2.5, y: -3, width: 5, height: 6, fill: '#f2c94c', stroke: '#6e4a22', 'stroke-width': 1 }, g); return g; }
/* د1 «مرآة الكنز»: يختار الطفل المرآة فتنقلب النقطة عليها حتى تبلغ الكنز. c.rounds [[p، t]…]؛ lines: [الدعوة، (لكل جولة جملة)…، وصلنا، لم تتحرّك، ابتعدت، الختام] */
const C9_TREASURE = [[[3, 2], [-3, 2]], [[-2, 3], [2, -3]], [[0, 3], [0, -3]]];   /* مرآة · مرآتان بأيّ ترتيب · نقطةٌ على المرآة الرأسية فلا تنقلها */
const c9Need = (p, t) => p[0] === t[0] && p[1] === t[1] ? [] : ['refV', 'refH'].filter(k => { const q = C9_XF[k](p); return (q[0] === t[0] && q[1] === t[1]) || (q[0] !== p[0] || q[1] !== p[1]) && (C9_XF[k === 'refV' ? 'refH' : 'refV'](q)[0] === t[0] && C9_XF[k === 'refV' ? 'refH' : 'refV'](q)[1] === t[1]); });
SCENES.c9Treasure = async c => { const L = c.lines, R = c.rounds || C9_TREASURE, nR = R.length; await c9Say(L, 0);
  for (const [ri, [p0, t]] of R.entries()) { const svg = m3Stage(262), Pl = c4Plane(svg, { n: 5, ny: 4, top: 30 }), mk = el('g', { 'pointer-events': 'none' }, svg); { const T = Pl.P(...t); c9Chest(svg, T); c4Hide(Pl, [[T[0] - 13, T[1] - 15, T[0] + 13, T[1] + 10]]); } let p = [...p0], dot = c4Dot(svg, Pl, ...p, { pair: true, col: C9.org }), bad = 0, moves = 0;
    const help = n => { mk.innerHTML = ''; if (n < 2) return; const need = c9Need(p, t); if (!need.length) return; c9Mark(mk, Pl, need[0]); if (n >= 3) { const A = Pl.P(...p), K = need[0] === 'refV' ? Pl.P(0, p[1]) : Pl.P(p[0], 0); if (Math.hypot(A[0] - K[0], A[1] - K[1]) > 2) { geoLine(mk, A[0], A[1], K[0], K[1], { color: THINK_INK, w: 2.4, dash: '5 4' }); preTicks(mk, A, K, 1, THINK_INK); } } };   /* الثاني يبرز المرآة، والثالث نصف الطريق إليها */
    await c9Say(L, 1 + ri);
    while (p[0] !== t[0] || p[1] !== t[1]) { const need = c9Need(p, t), k = await choosePick([['refV', labelText('c9S.refV'), '<i></i>', 'gen.c9.n.refV'], ['refH', labelText('c9S.refH'), '<i></i>', 'gen.c9.n.refH']], need);
      document.querySelectorAll('#stage .choices').forEach(b => b.remove()); moves++; const q = C9_XF[k](p), ok = need.includes(k);
      if (q[0] === p[0] && q[1] === p[1]) { SFX.soft(); bad++; logAttempt({ scene: c.s || 'game', tag: 'c9Treasure-stay', ok: false }); await c9Say(L, nR + 2); help(bad); continue; }   /* على هذه المرآة نفسها: لا تتحرّك */
      const A = Pl.P(...p), B = Pl.P(...q); c9Mark(svg, Pl, k).setAttribute('data-flash', ''); dot.remove(); const ghost = el('circle', { r: 7, fill: C9.org, stroke: '#fff', 'stroke-width': 2, 'pointer-events': 'none' }, svg);
      await symTween(FAST ? 20 : 420, u => { ghost.setAttribute('cx', A[0] + (B[0] - A[0]) * u); ghost.setAttribute('cy', A[1] + (B[1] - A[1]) * u); }); ghost.remove(); svg.querySelectorAll('[data-flash]').forEach(e => e.remove());
      p = q; dot = c4Dot(svg, Pl, ...p, { pair: true, col: ok ? C9.org : C9.q }); SFX.tick();
      if (!ok) { bad++; logAttempt({ scene: c.s || 'game', tag: 'c9Treasure-far', ok: false }); await c9Say(L, nR + 3); help(bad); } else help(bad); }
    SFX.good(); logAttempt({ scene: c.s || 'game', tag: 'c9Treasure', ok: true, firstTry: bad === 0 }); await c9Say(L, nR + 1); }
  await c9Say(L, nR + 4); };

/* د2 «عجلة الدوران»: يتوقّع الطفل ربع الصورة، ثم يدير ذراع النقطة حول الأصل ربعاً ربعاً بالزرّين حتى المطلوب، و«تمّ». c.rounds [[p، أرباعٌ عكس العقارب]…]؛
   lines: [الدعوة، (لكل جولة جملة)…، أدِر الذراع، هنا صورتها، ليس بعد، الختام] */
const C9_WHEEL = [[[4, 2], 1], [[-1, 3], 2], [[2, -3], 3]];
/* زرّا الإدارة داخل الإطار عن جانبي المستوى: سهمٌ دائري بجهته (عكس العقارب يميناً)، 72 وحدةً فلا يقلّ عن 56 بكسلاً، وبلوحة المفاتيح */
function c9TurnBtns(svg, y, step) { return [-1, 1].map(s => { const cx = 180 + s * 122, b = el('g', { role: 'button', tabindex: 0, 'aria-label': plain(G(labelText(s > 0 ? 'c9TurnCcw' : 'c9TurnCw'))), style: 'cursor:pointer' }, svg);
  el('circle', { cx, cy: y, r: 36, fill: '#fffdf6', stroke: css('--compass'), 'stroke-width': 3 }, b); const a0 = s > 0 ? -40 : 220, a1 = s > 0 ? 220 : -40;
  el('path', { d: angArc([cx, y], 17, Math.min(a0, a1), Math.max(a0, a1)), fill: 'none', stroke: css('--compass'), 'stroke-width': 4, 'stroke-linecap': 'round' }, b); const E = angP([cx, y], a1, 17); geoArrow(b, E[0], E[1], s > 0 ? -(a1 + 90) : 90 - a1, css('--compass'), 8);
  const go = e => { if (e) e.stopPropagation(); step(s); SFX.tick(); }; b.onclick = go; b.onpointerdown = e => e.stopPropagation(); b.onkeydown = e => { if (isActKey(e)) { e.preventDefault(); go(); } }; return b; }); }
const c9RotK = (p, k) => { let q = [...p]; for (let i = 0; i < ((k % 4) + 4) % 4; i++) q = C9_XF.rot90(q); return q; };
SCENES.c9Wheel = async c => { const L = c.lines, R = c.rounds || C9_WHEEL, nR = R.length; await c9Say(L, 0);
  for (const [ri, [p0, q]] of R.entries()) { const svg = m3Stage(262), Pl = c4Plane(svg, { n: 4, ny: 4, top: 50, H: 250, c: 17 }), O = Pl.P(0, 0); c9Mark(svg, Pl, 'rot90');   /* مستوى أصغر يترك جانبيه لزرّي الإدارة */ c9Card(svg, c9Name(q === 1 ? 'rot90' : q === 2 ? 'rot180' : 'rot270'), { w: 300 }); c4Dot(svg, Pl, ...p0, { pair: true, col: '#8a9aa8' });
    const want = c4QuadOf(...c9RotK(p0, q)); await c9Say(L, 1 + ri);
    { const k = await choosePick(['q1', 'q2', 'q3', 'q4'].map(x => [x, labelText('c4Q.' + x), '<i></i>', 'gen.c4.quad.' + x]), want, { cls: 'four' }); document.querySelectorAll('#stage .choices').forEach(b => b.remove()); logAttempt({ scene: c.s || 'game', tag: 'c9Wheel-predict', ok: k === want }); SFX.tick(); }   /* التوقّع قبل الإدارة، ولا حكم عليه إلا بما يراه بعدها */
    let k = 0, bad = 0; const arm = el('g', { 'pointer-events': 'none' }, svg), dot = el('g', { 'pointer-events': 'none' }, svg);
    const draw = (deg = 0) => { arm.innerHTML = ''; dot.innerHTML = ''; const A = Pl.P(...p0), a0 = Math.atan2(O[1] - A[1], A[0] - O[0]), r = Math.hypot(A[0] - O[0], A[1] - O[1]), t = a0 + (k * 90 + deg) * Math.PI / 180, B = [O[0] + r * Math.cos(t), O[1] - r * Math.sin(t)];
      geoLine(arm, O[0], O[1], B[0], B[1], { color: C9.arc, w: 3, dash: '7 4' }); if (deg) el('circle', { cx: B[0], cy: B[1], r: 7, fill: C9.img, stroke: '#fff', 'stroke-width': 2 }, dot); else c4Dot(dot, Pl, ...c9RotK(p0, k), { pair: true, col: C9.img }); };
    draw(); let busy = false; await c9Say(L, nR + 1);
    const nudge = c9TurnBtns(svg, 150, s => { if (busy) return; busy = true; (async () => { for (let i = 1; i <= 6; i++) { draw(s * 15 * i); await sleep(FAST ? 1 : 40); } k += s; draw(); busy = false; })(); });
    AUTO({ kind: 'c9Wheel', ok: () => { k = q; draw(); rulDoneBtn().click(); }, wrong: () => { k = q + 1; draw(); rulDoneBtn().click(); } });
    while (true) { await rulDone(() => {}); while (busy) await sleep(20); const ok = ((k % 4) + 4) % 4 === q; logAttempt({ scene: c.s || 'game', tag: 'c9Wheel', ok, firstTry: bad === 0 }); if (ok) break;
      bad++; SFX.soft(); await c9Say(L, nR + 3); if (bad >= 2) { const m = helpG(svg); c9TurnArc(m, Pl, p0, c9RotK(p0, q), { col: THINK_INK }).querySelectorAll('path')[1]?.remove(); }   /* الثاني: قوس الطريق بلا رأسه */
      AUTO({ kind: 'c9Wheel', ok: () => { k = q; draw(); rulDoneBtn().click(); } }); }
    nudge.forEach(b => b.remove()); SFX.good(); await c9Say(L, nR + 2); }
  await c9Say(L, nR + 4); };

/* د3 «باب المدينة الدوّار» ثم «مرآتان»: يلمس الطفل مركز الدوران (المفصّلة) بين ثلاث نقاط، ثم يقرأ زاوية الباب بالمنقلة؛ ثم يعكس نقطةً على المرآتين بنفسه
   ويختار الدوران الذي يعطي صورتها. c.rounds [[θ، مع العقارب، b]…]، c.p؛ lines: [الدعوة، أين المفصّلة، المفصّلة ثابتة، المنقلة، اقرأ من الصفر، مرآتان: الرأسية، ثم الأفقية، أيّ دوران، نصف دورة، الختام] */
const C9_DOOR = [[70, false, 14], [120, true, 8]];
SCENES.c9Door = async c => { const L = c.lines, R = c.rounds || C9_DOOR; await c9Say(L, 0);
  for (const [th, cw, b] of R) { const svg = m3Stage(250), g = el('g', {}, svg), len = 104, PR = 96, cs = d => Math.cos(d * Math.PI / 180), a0 = cw ? b + th : b, a1 = cw ? b : b + th;
    const xs = [cs(a0) * (len + 16), cs(a1) * (len + 16), -PR, PR * cs(b)], H = [Math.round(180 - (Math.min(...xs) + Math.max(...xs)) / 2), 176], D = angP(H, a0, len), D2 = angP(H, a1, len), Mid = [(D[0] + D2[0]) / 2, (D[1] + D2[1]) / 2];
    el('path', { d: angArc(H, len, b, b + th), fill: 'none', stroke: C9.arc, 'stroke-width': 2, 'stroke-dasharray': '5 4' }, g); geoLine(g, H[0], H[1], D[0], D[1], { color: '#8a6a43', w: 7 }); geoLine(g, H[0], H[1], D2[0], D2[1], { color: '#d2b48c', w: 7 });   /* البابُ مغلقاً (داكن) ومفتوحاً (فاتح)، وطرفه يرسم قوساً */
    const cand = [['H', H], ['D', D], ['M', Mid]].map(([k, P]) => { const t = el('g', {}, svg); el('circle', { cx: P[0], cy: P[1], r: 9, fill: '#fff', stroke: C9.ink, 'stroke-width': 2.4 }, t); return { g: t, k, label: labelText('c9Spot') }; });
    let n = 0; S(L[1], { free: true });
    while (true) { const k = await tapOne(cand, { ok: 'H', pad: 56 }); hush(); const ok = k === 'H'; logAttempt({ scene: c.s || 'game', tag: 'c9Door-centre', ok, firstTry: n === 0 }); if (ok) { SFX.good(); break; } n++; SFX.soft(); await c9Say(L, 2); if (n >= 2) hlRing(helpG(svg), H, 16, H2C[0]); }
    cand.forEach(t => t.g.remove()); el('circle', { cx: H[0], cy: H[1], r: 7, fill: C9.ink }, g);
    const pg = el('g', {}, svg); svg.insertBefore(pg, g); protAt(pg, H, b, { R: PR, step: 30, fs: 1.27 }); await c9Say(L, 3);
    const it = ITEM.c9Rot.make({ th, ask: 'ang' }); let m = 0;
    while (true) { const np = numberPick(shuffle(it.nums), th, { west: true, word: degw }); const k = await np.p; document.querySelectorAll('#stage .choices').forEach(x => x.remove()); const ok = k === th; logAttempt({ scene: c.s || 'game', tag: 'c9Door-angle', ok, firstTry: m === 0 }); if (ok) { SFX.good(); break; }
      m++; SFX.soft(); await c9Say(L, 4); if (m >= 2) el('path', { d: angArc(H, PR - 19, b, b + th), fill: 'none', stroke: THINK_INK, 'stroke-width': 4, opacity: .8 }, helpG(svg)); }   /* الثالث يبرز التدريج الخارجي من صفره */
    pg.remove(); arArc(g, H, b, b + th, { r: 34, col: C9.arc, deg: th, dl: 18, fs: 14, fill: true }); await sleep(FAST ? 10 : 600); }   /* المنقلة تُرفع فلا يقع عدد الزاوية على أعدادها */
  /* «مرآتان»: الرأسية ثم الأفقية بيد الطفل، ثم أيّ دورانٍ يعطي الصورة نفسها */
  const p0 = c.p || [3, 1], svg = m3Stage(262), Pl = c4Plane(svg, { n: 4, ny: 4, top: 30 }); c4Dot(svg, Pl, ...p0, { pair: true, col: C9.org }); let p = [...p0];
  for (const [i, xf] of ['refV', 'refH'].entries()) { await c9Say(L, 5 + i); let n = 0;
    while (true) { const k = await choosePick([['refV', labelText('c9S.refV'), '<i></i>', 'gen.c9.n.refV'], ['refH', labelText('c9S.refH'), '<i></i>', 'gen.c9.n.refH']], xf); document.querySelectorAll('#stage .choices').forEach(x => x.remove()); const ok = k === xf; logAttempt({ scene: c.s || 'game', tag: 'c9Door-mirror', ok, firstTry: n === 0 }); if (ok) break; n++; SFX.soft(); }
    c9Mark(svg, Pl, xf); const q = C9_XF[xf](p), A = Pl.P(...p), B = Pl.P(...q); geoLine(svg, A[0], A[1], B[0], B[1], { color: C9.arc, w: 2, dash: '5 4' }); p = q; c4Dot(svg, Pl, ...p, { pair: true, col: i ? C9.img : '#8a9aa8' }); SFX.tick(); }
  await c9Say(L, 7); { let n = 0; while (true) { const k = await choosePick(['rot90', 'rot180', 'rot270'].map(x => [x, labelText('c9S.' + x), '<i></i>', 'gen.c9.n.' + x]), 'rot180'); document.querySelectorAll('#stage .choices').forEach(x => x.remove()); const ok = k === 'rot180'; logAttempt({ scene: c.s || 'game', tag: 'c9Door-two', ok, firstTry: n === 0 }); if (ok) break; n++; SFX.soft(); } }
  c9TurnArc(svg, Pl, p0, p); SFX.good(); await c9Say(L, 8); await c9Say(L, 9); };

/* ================= المشاهد ================= */
/* د1: فوضى: «المرآة الرأسية تغيّر الإحداثي الرأسي!»؛ والانعكاس على المحورين */
SCENES.c9MirrorHook = async c => { const L = c.lines, svg = m3Stage(262), Pl = c4Plane(svg, { n: 5, ny: 4, top: 30 }); c9Mark(svg, Pl, 'refV'); c4Dot(svg, Pl, 3, 2, { pair: true, col: C9.org }); await c9Say(L, 0);
  const w = c4Dot(svg, Pl, 3, -2, { pair: true, col: C9.q }); SFX.tick(); await c9Say(L, 1); w.remove(); for (const l of L.slice(2)) await S(l); };
SCENES.c9RefShow = async c => { const L = c.lines, svg = m3Stage(262), Pl = c4Plane(svg, { n: 5, ny: 4, top: 30 }); let g = null;
  for (const [i, [xf, q]] of [['refV', [-3, 2]], ['refH', [3, -2]]].entries()) { if (g) g.remove(); g = el('g', { 'pointer-events': 'none' }, svg); c9Mark(g, Pl, xf); c4Dot(g, Pl, 3, 2, { pair: true, col: C9.org });
    const A = Pl.P(3, 2), B = Pl.P(...q), K = xf === 'refV' ? Pl.P(0, 2) : Pl.P(3, 0); geoLine(g, A[0], A[1], B[0], B[1], { color: C9.arc, w: 2, dash: '5 4' }); preTicks(g, A, K, 1, C9.ok); preTicks(g, K, B, 1, C9.ok); await c9Say(L, 2 * i);
    c4Dot(g, Pl, ...q, { pair: true, col: C9.img }); SFX.tick(); await c9Say(L, 2 * i + 1); }
  g.remove(); c9Clear(svg); g = el('g', { 'pointer-events': 'none' }, svg); c9RuleCard(g, 180, 90, 'refV'); c9RuleCard(g, 180, 180, 'refH'); for (const l of L.slice(4)) await S(l); };   /* القاعدتان وحدهما بعد المستوى (TXSTRICT) */
/* د2: فوضى: «ربع الدورة يغيّر الإحداثيين بالإشارة نفسها!»؛ والدوران حول الأصل بالورق الشفّاف */
SCENES.c9RotHook = async c => { const L = c.lines, svg = m3Stage(262), Pl = c4Plane(svg, { n: 4, ny: 4, top: 30 }); c9Mark(svg, Pl, 'rot90'); c4Dot(svg, Pl, 3, 1, { pair: true, col: C9.org }); await c9Say(L, 0);
  const w = c4Dot(svg, Pl, -3, -1, { pair: true, col: C9.q }); SFX.tick(); await c9Say(L, 1); w.remove(); for (const l of L.slice(2)) await S(l); };
SCENES.c9RotShow = async c => { const L = c.lines, svg = m3Stage(262), Pl = c4Plane(svg, { n: 4, ny: 4, top: 30 }), O = Pl.P(0, 0); c9Mark(svg, Pl, 'rot90'); c4Dot(svg, Pl, 3, 1, { pair: true, col: C9.org });
  const arm = el('g', { 'pointer-events': 'none' }, svg), A = Pl.P(3, 1); el('line', { x1: O[0], y1: O[1], x2: A[0], y2: A[1], stroke: C9.arc, 'stroke-width': 3, 'stroke-dasharray': '7 4' }, arm);
  const turn = async to => { for (let k = 1; k <= 12; k++) { arm.setAttribute('transform', `rotate(${-(to - 90) - 90 * k / 12} ${O[0]} ${O[1]})`); await sleep(FAST ? 1 : 45); } };
  for (const [i, q] of [[-1, 3], [-3, -1], [1, -3]].entries()) { await turn(90 * (i + 1)); c4Dot(svg, Pl, ...q, { pair: true, col: C9.img }); SFX.tick(); await c9Say(L, i); }
  c9Clear(svg); const g = el('g', { 'pointer-events': 'none' }, svg); c9RuleCard(g, 180, 130, 'rot90'); for (const l of L.slice(3)) await S(l); };
/* د3: الدوران بالمنقلة والفرجار خطوةً خطوة، والانعكاسان على المحورين */
SCENES.c9ProtHook = async c => { const L = c.lines, svg = m3Stage(250), g = el('g', { 'pointer-events': 'none' }, svg), H = [120, 200], D = angP(H, 0, 150), D2 = angP(H, 40, 150);
  geoLine(g, H[0], H[1], D[0], D[1], { color: '#8a6a43', w: 8 }); pfDot(g, H); await c9Say(L, 0);
  geoLine(g, H[0], H[1], D2[0], D2[1], { color: '#b08a57', w: 8 }); arArc(g, H, 0, 40, { r: 44, col: C9.arc, deg: 40, dl: 20, fs: 14, fill: true }); SFX.tick(); await c9Say(L, 1); for (const l of L.slice(2)) await S(l); };
SCENES.c9ProtShow = async c => { const L = c.lines, svg = m3Stage(250), g = el('g', { 'pointer-events': 'none' }, svg), M = [150, 170], u = 20, A = angP(M, 10, 5 * u), A2 = angP(M, 60, 5 * u);
  pfDot(g, M); pfLab(g, M[0] - 12, M[1] + 18, 'م', { fs: 15 }); el('circle', { cx: A[0], cy: A[1], r: 6, fill: C9.org, stroke: '#fff', 'stroke-width': 2 }, g); pfLab(g, A[0] + 10, A[1] + 18, 'أ', { fs: 15, col: C9.org });
  const R1 = angP(M, 10, 170); geoLine(g, M[0], M[1], R1[0], R1[1], { color: C9.org, w: 2.6 }); SFX.tick(); await c9Say(L, 0);
  const pr = protAt(g, M, 10, { R: 96, step: 30, fs: 1.27 }); await c9Say(L, 1); const R2 = angP(M, 60, 170); geoLine(g, M[0], M[1], R2[0], R2[1], { color: C9.img, w: 2.6 }); SFX.tick(); await c9Say(L, 2); pr.g.remove();   /* منقلة المشهد بتدريجيها وأعدادها الغربية (D279 (2)) */
  arArc(g, M, 10, 60, { r: 34, col: C9.arc, deg: 50, dl: 18, fs: 14, fill: true }); el('path', { d: angArc(M, 5 * u, 2, 70), fill: 'none', stroke: C9.arc, 'stroke-width': 2.6 }, g);
  el('circle', { cx: A2[0], cy: A2[1], r: 6, fill: C9.img, stroke: '#fff', 'stroke-width': 2 }, g); pfLab(g, A2[0] - 14, A2[1] - 6, 'أ’', { fs: 15, col: C9.img }); preTicks(g, M, A, 1, C9.ok); preTicks(g, M, A2, 1, C9.ok); SFX.tick(); await c9Say(L, 3);
  for (const l of L.slice(4)) await S(l); };
SCENES.c9TwoMirrorShow = async c => { const L = c.lines, svg = m3Stage(262), Pl = c4Plane(svg, { n: 4, ny: 4, top: 30 }), p = [3, 1];
  c9Mark(svg, Pl, 'refV'); c4Dot(svg, Pl, ...p, { pair: true, col: C9.org }); c4Dot(svg, Pl, -3, 1, { pair: true, col: '#8a9aa8' }); SFX.tick(); await c9Say(L, 0);
  c9Mark(svg, Pl, 'refH'); c4Dot(svg, Pl, -3, -1, { pair: true, col: C9.img }); SFX.tick(); await c9Say(L, 1);
  c9TurnArc(svg, Pl, p, [-3, -1]); SFX.tick(); await c9Say(L, 2); await c9Say(L, 3); if (!L[4]) return;
  /* متى يهمّ الترتيب: مرآةٌ رأسية وانسحابٌ ثلاثةً يميناً للنقطة (1، 2) بالترتيبين، وصورتان مختلفتان (المراجع A لبوابة M4-U9، 2) */
  c9Clear(svg); const P2 = c4Plane(svg, { n: 5, ny: 3, top: 66, H: 250 }); c9Mark(svg, P2, 'refV'); c9Card(svg, labelText('c9OrdA'), { w: 150, cx: 262, col: C9.img }); c9Card(svg, labelText('c9OrdB'), { w: 150, cx: 98, col: '#4f9a6a' });
  c4Dot(svg, P2, 1, 2, { pair: true, col: C9.org }); c4Dot(svg, P2, 2, 2, { pair: true, col: C9.img, below: true }); SFX.tick(); await sleep(FAST ? 5 : 500); c4Dot(svg, P2, -4, 2, { pair: true, col: '#4f9a6a' }); SFX.tick(); await c9Say(L, 4);
  for (const l of L.slice(5)) await S(l); };
/* د4: مدينة المرايا: مبانٍ في الأرباع، ومبنى ينعكس ومبنى يدور */
const C9_CITY = { a: [[3, 1], [5, 1], [5, 3], [4, 4], [3, 3]], b: [[4, -1], [5, -1], [5, -3], [4, -3]] };
SCENES.c9CityShow = async c => { const L = c.lines, svg = m3Stage(262), Pl = c4Plane(svg, { n: 5, ny: 5, top: 30 }); let i = 0;   /* mapOnly: المبنيان وحدهما قبل بنود الطفل؛ وبعدها المشهد الجامع بصورتيهما (المراجع A لبوابة M4-U9، 1) */
  c9Poly(svg, Pl, C9_CITY.a, { col: C9.org, fill: 'rgba(47,127,193,.14)', names: false }); c9Poly(svg, Pl, C9_CITY.b, { col: '#4f9a6a', fill: 'rgba(79,154,106,.14)', names: false }); if (c.mapOnly) await c9Say(L, i++);
  else { c9Mark(svg, Pl, 'refV'); c9Poly(svg, Pl, C9_CITY.a.map(C9_XF.refV), { col: C9.img, fill: 'rgba(217,130,43,.14)', names: false }); SFX.tick(); await c9Say(L, i++);
    const r = C9_CITY.b.map(C9_XF.rot90); c9TurnArc(svg, Pl, C9_CITY.b[0], r[0]); c9Poly(svg, Pl, r, { col: C9.img, fill: 'rgba(217,130,43,.14)', names: false }); SFX.tick(); await c9Say(L, i++); }
  for (const l of L.slice(i)) await S(l); };
WRAP_ART.xf9Art = svg => { const Pl = c4Plane(svg, { n: 4, ny: 4, top: 40, H: 240, nums: false }); const T = [[1, 1], [3, 1], [1, 3]]; c9Poly(svg, Pl, T, { col: C9.org, fill: 'rgba(47,127,193,.16)', names: false });
  for (const xf of ['refV', 'rot180', 'refH']) c9Poly(svg, Pl, T.map(C9_XF[xf]), { col: C9.img, fill: 'rgba(217,130,43,.14)', names: false }); };
