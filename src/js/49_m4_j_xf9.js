/* =====================================================================
   M4-U9 «التحويلات على المستوى الكامل» (المرحلة 4، نوفمبر 2026)
   د1 الانعكاس على المحورين (C420 أ) · د2 الدوران حول الأصل بمضاعفات 90° (C420 ب)
   د3 الدوران بزاوية بالمنقلة والفرجار (C422) وتركيب التحويلات · د4 مشروع «مدينة المرايا»
   الأسماء بالعربية والصيغ بالكلمات والأمثلة أولاً (المرجع، تعديل 1)
   ===================================================================== */
const C9 = { org: '#2f7fc1', img: '#d9822b', ok: SO.ok, hl: SO.hl, q: '#c0392b', ax: '#c0392b', arc: '#7a4fb0', ink: '#24323a', mir: '#3d9bd4' };
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
  async hint2(item, r) { if (r && r.ctx && r.ctx.Pl) { const m = helpG(r.ctx.svg); c9H2Card(m, c9H2(m, r.ctx.Pl, item.pts[0], item.xf)); } await S((item.pts.length === 1 && /^ref/.test(item.xf) ? 'gen.c9.hint.pt.' : 'gen.c9.hint.') + item.xf); }, async together() {},
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

/* ================= الألعاب الحركية (خطة ألعاب المرحلة 4؛ D288 (2)) =================
   كل جولةٍ بندٌ حركيّ تشغّله SCENES.motion بنمط التمرين (45_scenes.js): فلكلّ محاولةٍ سجلّها بـ firstTry، وسلّم D240 (سؤال الخطأ، ثم حركة الأداة،
   ثم حلٌّ مشترك يقف قبل الخطوة الأخيرة، ثم الكشف)، والفانوس، و«أعد الجملة» يعيد السؤال، والسائقون يخطئون فيها كما في البنود (المراجعان A وB لدفعة ألعاب U9) */
const c9Eq = (a, b) => a[0] === b[0] && a[1] === b[1];
/* صندوق الكنز عند نقطة، ومفتوحاً ببريقٍ حين تبلغه */
function c9Chest(parent, P, open) { const g = el('g', { transform: `translate(${P[0]} ${P[1]})`, 'pointer-events': 'none', 'data-chest': open ? 'open' : 'shut' }, parent);
  el('rect', { x: -11, y: -6, width: 22, height: 14, rx: 2, fill: '#b9813f', stroke: '#6e4a22', 'stroke-width': 1.6 }, g);
  if (open) { el('path', { d: 'M-11 -6 L-14 -17 L8 -17 L11 -6 Z', fill: '#d29a52', stroke: '#6e4a22', 'stroke-width': 1.6 }, g); for (const a of [60, 90, 120]) { const E = angP([0, -8], a, 15), F = angP([0, -8], a, 22); geoLine(g, E[0], E[1], F[0], F[1], { color: '#e8a317', w: 2.4 }); } }
  else el('path', { d: 'M-11 -6 Q0 -16 11 -6 Z', fill: '#d29a52', stroke: '#6e4a22', 'stroke-width': 1.6 }, g);
  el('rect', { x: -2.5, y: -3, width: 5, height: 6, fill: '#f2c94c', stroke: '#6e4a22', 'stroke-width': 1 }, g); return g; }
/* المرايا التي تقرّب p من الكنز t: مرآةٌ تبلغه، أو أولى مرآتين */
const c9Need = (p, t) => c9Eq(p, t) ? [] : ['refV', 'refH'].filter(k => { const q = C9_XF[k](p); return c9Eq(q, t) || !c9Eq(q, p) && c9Eq(C9_XF[k === 'refV' ? 'refH' : 'refV'](q), t); });
/* المرآتان على المسرح: شريطان على المحورين يلمسهما الطفل (لا بطاقات تحت المسرح؛ المراجع A لدفعة الألعاب، 9) */
function c9Mirrors(svg, Pl) { return ['refV', 'refH'].map(k => { const g = el('g', { 'data-mirror': k }, svg), [A, B] = k === 'refV' ? [Pl.P(0, -Pl.m), Pl.P(0, Pl.m)] : [Pl.P(-Pl.n, 0), Pl.P(Pl.n, 0)];
  el('line', { x1: A[0], y1: A[1], x2: B[0], y2: B[1], stroke: C9.mir, 'stroke-width': 7, 'stroke-linecap': 'round', opacity: .6 }, g);
  const H = k === 'refV' ? [A[0], A[1] + 18] : [A[0] - 18, A[1]]; el('rect', { x: H[0] - 9, y: H[1] - 9, width: 18, height: 18, rx: 4, fill: '#d6ecf8', stroke: C9.mir, 'stroke-width': 2 }, g); geoLine(g, H[0] - 4, H[1] + 4, H[0] + 4, H[1] - 4, { color: '#fff', w: 2.4 });   /* مقبضٌ مرآةٌ صغيرة عند طرف كلٍّ منهما: يُعرف أنها تُلمس، ولكلٍّ موضعٌ لا تتقاطع فيه المرآتان */
  return { g, k, label: labelText('c9S.' + k) }; }); }
/* نصف الطريق إلى المرآة بعلامة بُعده؛ وإن كانت النقطة على المحور الآخر يُزاح الخطّ عنه فيُرى (المراجعان A وB، 16) */
function c9Foot(h, Pl, p, xf) { let A = Pl.P(...p), K = xf === 'refV' ? Pl.P(0, p[1]) : Pl.P(p[0], 0); if (Math.hypot(A[0] - K[0], A[1] - K[1]) <= 2) return;
  if (xf === 'refV' && p[1] === 0) { A = [A[0], A[1] - 7]; K = [K[0], K[1] - 7]; } if (xf === 'refH' && p[0] === 0) { A = [A[0] + 7, A[1]]; K = [K[0] + 7, K[1]]; }
  geoLine(h, A[0], A[1], K[0], K[1], { color: THINK_INK, w: 2.4, dash: '5 4' }); preTicks(h, A, K, 1, THINK_INK); }
/* بطاقة الكنز فوق المستوى (الشريط تحته لبطاقات المساعدة): «الكنز:» وزوجه */
function c9Clue(svg, P) { const g = el('g', { 'pointer-events': 'none', 'data-clue': preKey(P) }, svg); el('rect', { x: 110, y: 16, width: 140, height: 21, rx: 8, fill: '#fff8e6', stroke: '#b9813f', 'stroke-width': 1.6 }, g);
  preLab(g, 236, 31, labelText('c9TrClue'), { fs: 14, col: '#6e4a22', dir: 'rtl' }); coPairText(g, 128, 31, preNum(P[0]), preNum(P[1]), 'start', 14, '#6e4a22'); return g; }
/* أعداد المحورين تحت رسم المساعدة تُخفى (وعلى مسرح المحاولة التالية حين تُنقل إليه المساعدة) */
function c9HelpHide(svg, Pl) { c4Hide(Pl, [...svg.querySelectorAll('[data-help] *')].map(e => { try { const b = e.getBBox(); return b.width || b.height ? [b.x - 2, b.y - 2, b.x + b.width + 2, b.y + b.height + 2] : null; } catch (x) { return null; } }).filter(Boolean)); }
/* انقلاب النقطة على المرآة: المرآة تومض والنقطة تعبر إليها */
/* أعداد المحورين التي يعبرها مسارٌ متحرّك تُخفى مدّة الحركة ثم تعود (المراجع B لدفعة الألعاب، 13): near(مركز العدد) صحيحٌ لما على المسار */
function c9Hush(Pl, near) { const h = (Pl.tk || []).filter(({ t, B }) => t.getAttribute('visibility') !== 'hidden' && near([(B[0] + B[2]) / 2, (B[1] + B[3]) / 2])); h.forEach(({ t }) => t.setAttribute('visibility', 'hidden')); return () => h.forEach(({ t }) => t.removeAttribute('visibility')); }
async function c9Flip(svg, Pl, p, q, xf, o = {}) { const A = Pl.P(...p), B = Pl.P(...q), fl = c9Mark(svg, Pl, xf), gh = el('circle', { r: 7, cx: A[0], cy: A[1], fill: o.col || C9.org, stroke: '#fff', 'stroke-width': 2, opacity: o.op ?? 1, 'pointer-events': 'none' }, svg);
  const L = Math.hypot(B[0] - A[0], B[1] - A[1]) || 1, back = c9Hush(Pl, ([x, y]) => { const u = Math.max(0, Math.min(1, ((x - A[0]) * (B[0] - A[0]) + (y - A[1]) * (B[1] - A[1])) / (L * L))); return Math.hypot(x - A[0] - u * (B[0] - A[0]), y - A[1] - u * (B[1] - A[1])) < 13; });
  await symTween(FAST ? 20 : 420, u => { gh.setAttribute('cx', A[0] + (B[0] - A[0]) * u); gh.setAttribute('cy', A[1] + (B[1] - A[1]) * u); }); fl.remove(); back(); return gh; }
/* لمس خانةٍ واحدة على المستوى ثم «تمّ» (كما في c9Draw بنقطة): لمستان سريعتان لا تمحوان، ولوحة المفاتيح من الأصل، وAUTO axPts للسائقين واللمس الحقيقي */
function c9PlaceOne(svg, Pl, want, bad) { let placed = null, prev = null, lastQ = null, tAt = 0; const lay = el('g', { 'pointer-events': 'none' }, svg);
  const redraw = () => { lay.innerHTML = ''; svg.appendChild(lay); if (placed) { const P = Pl.P(...placed); el('circle', { cx: P[0], cy: P[1], r: 7, fill: C9.img, stroke: '#fff', 'stroke-width': 2 }, lay); } /*T*/window.__axPlaced = placed ? 1 : 0;/*/T*/ };
  const preview = q => { if (prev) prev.remove(); prev = null; if (!q) return; const P = Pl.P(...Pl.snap(q)); prev = el('circle', { cx: P[0], cy: P[1], r: 7, fill: 'none', stroke: C9.img, 'stroke-width': 2.5, 'stroke-dasharray': '3 3', 'pointer-events': 'none' }, svg); };
  const tapAt = p => { const now = performance.now(); if (placed && c9Eq(placed, p)) { if (now - tAt < 400) return; placed = null; } else { placed = p; tAt = now; } SFX.tick(); redraw(); };
  const input = fingerInput(svg, { map: e => { const q = svgPoint(svg, e); return [q.x, q.y]; }, down(q) { if (!Pl.inside(q)) return false; lastQ = q; preview(q); }, move(q) { lastQ = q; preview(q); }, up(cancel) { preview(null); if (!cancel && lastQ) tapAt(Pl.snap(lastQ)); lastQ = null; }, lens: { Pl } });
  /*T*/window.__axWant = [want]; window.__axAt = (x, y) => { const m = svg.getScreenCTM(), [px, py] = Pl.P(x, y); return { x: m.a * px + m.e, y: m.d * py + m.f }; }; window.__axPlaced = 0;/*/T*/
  const kg = el('g', { role: 'grid', 'aria-label': labelText('coPlane') }, svg);
  for (let y = Pl.m; y >= -Pl.m; y--) { const row = el('g', { role: 'row' }, kg); for (let x = -Pl.n; x <= Pl.n; x++) { const [px, py] = Pl.P(x, y), cb = el('g', { role: 'gridcell', tabindex: 0, ...(x === 0 && y === 0 ? { 'data-origin': '' } : {}), 'aria-label': plain(G(labelText('c4Cell'))).replace('X', x).replace('Y', y) }, row); el('circle', { cx: px, cy: py, r: 7, fill: 'transparent', 'pointer-events': 'none' }, cb); cb.onkeydown = e => { if (isActKey(e)) { e.preventDefault(); tapAt([x, y]); } }; } }
  AUTO({ kind: 'axPts', ok: () => { placed = [...want]; redraw(); rulDoneBtn().click(); }, wrong: () => { placed = [...bad]; redraw(); rulDoneBtn().click(); } });
  return rulDone(() => { input.off(); kg.remove(); preview(null); }, () => !!placed).then(() => placed); }

/* ---------- د1 «مرآة الكنز» (c9Trs): p، goal؛ يلمس الطفل المرآة على المسرح، ثم الخانة التي تصلها النقطة فيؤكّدها الانقلاب؛ وإن بقي الكنز أبعد فمرآةٌ أخرى.
   الجولة محاولةٌ واحدة حتى خطأٍ أو الكنز، وما قطعته النقطة صحيحاً يبقى (item.cur) ---------- */
ITEM.c9Trs = {
  make(spec) { /*T*/if (TESTHOOK && !c9Need(spec.p, spec.goal).length) testBug('c9Trs: الكنز لا تبلغه المرآتان');/*/T*/ return { ...spec, cur: [...spec.p], want: preKey(spec.goal), tag: 'c9-treasure' }; },
  async ask(item, mode, tries) { let first = c9Eq(item.cur, item.p); item.__try = tries;
    while (true) { const svg = m3Stage(262), Pl = c4Plane(svg, { n: 5, ny: 4, top: 48, c: 20 }), need = c9Need(item.cur, item.goal), M = c9Mirrors(svg, Pl), ctx = { svg, Pl };
      c9Clue(svg, item.goal); ctx.dot = c4Dot(svg, Pl, ...item.cur, { pair: true, col: C9.org });   /* الكنز مدفونٌ عند زوجه المكتوب، فخانة الوصول تُنتَج لا تُرى (المراجع A لإغلاق ألعاب U9، 3) */
      if (HELP_CARRY && HELP_CARRY.flow === FLOW) { for (const n of HELP_CARRY.nodes) svg.appendChild(n.cloneNode(true)); c9HelpHide(svg, Pl); }   /* المستوى الثاني ينقله البند بنفسه قبل الانتظار، فتُخفى الأعداد تحته من أول لحظة */
      let mir; if (tries >= 3) { mir = need[0]; M.forEach(m => m.g.setAttribute('opacity', m.k === mir ? 1 : .2)); c9Foot(helpG(svg), Pl, item.cur, mir); c9HelpHide(svg, Pl); await S('gen.c9.together.trs'); }   /* الحلّ المشترك: المرآة ونصف الطريق إليها، والخانة للطفل */
      else { let live = true; const qa = () => S(first ? item.q || 'gen.c9.q.trs' : 'gen.c9.q.trNext'); qa(); REPLAY_HOOK = qa; REPLAY_HOOK.live = () => live && svg.isConnected;
        mir = await tapOne(M, { ok: need, pad: 56, pulse: false }); live = false; REPLAY_HOOK = null; hush(); M.forEach(m => m.g.setAttribute('opacity', m.k === mir ? 1 : .2)); }
      ctx.mir = mir; const q = C9_XF[mir](item.cur); ctx.q = q;
      if (c9Eq(q, item.cur)) return { ans: 'stay|' + mir, ctx };
      if (!need.includes(mir)) return { ans: 'far|' + mir, ctx };
      { let live = true; const qa = () => S('gen.c9.q.trCell'); if (tries < 3) { qa(); REPLAY_HOOK = qa; REPLAY_HOOK.live = () => live && svg.isConnected; }
        const bad = c9WrongImg({ pts: [item.cur], img: [q], xf: mir, n: Pl.n })[0], cell = await c9PlaceOne(svg, Pl, q, bad); live = false; REPLAY_HOOK = null; hush(); ctx.cell = cell;
        if (!c9Eq(cell, q)) return { ans: `cell|${mir}|${preKey(cell)}`, ctx }; }
      ctx.dot.remove(); (await c9Flip(svg, Pl, item.cur, q, mir)).remove(); item.cur = q; ctx.dot = c4Dot(svg, Pl, ...q, { pair: true, col: C9.org }); SFX.tick();
      if (c9Eq(q, item.goal)) return { ans: 'goal', ctx };
      first = false; HELP_CARRY = null; await sleep(FAST ? 10 : 450); } },   /* ما رُسم للمساعدة يخصّ الموضع السابق */
  judge(item, a) { if (a === 'goal') return { ok: true }; const [k, mir, c] = String(a).split('|');
    if (k === 'stay') return { ok: false, err: 'c9TrStay' }; if (k === 'far') return { ok: false, err: 'c9TrFar' };
    return { ok: false, err: c9ErrOf(mir, [item.cur], [c.split('_').map(v => v[0] === 'm' ? -+v.slice(1) : +v)]) }; },
  async onOk(item, r) { SFX.good(); const c = r && r.ctx; if (c && c.svg.isConnected) c9Chest(c.svg, c.Pl.P(...item.goal), true); },   /* الصندوق يظهر مفتوحاً حيث وصلت */
  async onWrong(item, r) { SFX.soft(); const c = r && r.ctx; if (!c || !c.svg || !c.svg.isConnected || item.__try >= 2) return;   /* بعد الخطأ الثالث يأتي الحلّ المشترك فوراً على مسرحٍ جديد */
    if (String(r.ans).startsWith('far')) { const gh = await c9Flip(c.svg, c.Pl, item.cur, c.q, c.mir, { op: .6 }); gh.setAttribute('stroke-dasharray', '3 2'); }   /* النقطة تنقلب فعلاً فتبتعد عن الكنز: يرى أثر اختياره */
    else if (String(r.ans).startsWith('stay')) { const fl = c9Mark(c.svg, c.Pl, c.mir); await sleep(FAST ? 10 : 500); fl.remove(); }   /* المرآة تومض والنقطة لا تتحرّك */
    await sleep(FAST ? 10 : 300); },
  async hint2(item, r, err) { const c = r && r.ctx, mirErr = err === 'c9TrStay' || err === 'c9TrFar';
    if (c && c.svg && c.svg.isConnected) { const m = helpG(c.svg); if (mirErr) { c9H2(m, c.Pl, item.cur, 'refV'); c9H2(m, c.Pl, item.cur, 'refH'); ciRule(m, 180, C9_POS, labelText('c9Ask.trs'), C9.hl, 15); } else c9H2Card(m, c9H2(m, c.Pl, item.cur, c.mir)); c9HelpHide(c.svg, c.Pl); }   /* المستوى الثاني: بُعدا النقطة عن المرآتين، أو عن المرآة التي اختارها */
    await S(mirErr ? 'gen.c9.hint.trs' : 'gen.c9.hint.pt.' + ((c && c.mir) || 'refV')); },
  async together() {},
  async reveal(item, r) { const c = r && r.ctx; if (c && c.svg && c.svg.isConnected) { let p = item.cur; if (c.dot) c.dot.remove(); while (!c9Eq(p, item.goal)) { const k = c9Need(p, item.goal)[0], q = C9_XF[k](p); (await c9Flip(c.svg, c.Pl, p, q, k, { col: C9.ok })).remove(); c4Dot(c.svg, c.Pl, ...q, { col: C9.ok }); p = q; } }
    if (c && c.svg && c.svg.isConnected) c9Chest(c.svg, c.Pl.P(...item.goal), true); item.cur = [...item.goal]; await S('gen.c9.reveal.trs'); },
  praise: () => 'praisePlace', twin(item) { return item.twin || null; },   /* بلا توأم: جولة اللعبة لا تتسلسل */
};

/* ---------- د2 «عجلة الدوران» (c9Whl): p، k أرباعٌ عكس العقارب (1–3)؛ match: الصورة ظاهرة والبطاقة «حتى تنطبق» (تحقّق «مرآتان» في د3).
   يتوقّع الطفل الربع بلمسه على المستوى، ثم يدير الذراع بزرّين تحت المسرح ربعاً ربعاً (اللمسات المتتالية تُصفّ ولا تضيع، والنقرة لربعٍ دار فعلاً) و«تمّ»؛
   وربعٌ مع العقارب لثلاثة أرباعٍ عكسها صحيحٌ بجملة التكافؤ (المراجعان A، 7؛ وB، 4 و5 و11 و20) ---------- */
const C9_KXF = ['', 'rot90', 'rot180', 'rot270'];
const c9RotK = (p, k) => { let q = [...p]; for (let i = 0; i < ((k % 4) + 4) % 4; i++) q = C9_XF.rot90(q); return q; };
function c9TurnIcon(s) { const V = [12, 12], a0 = s > 0 ? -40 : 220, a1 = s > 0 ? 220 : -40, E = angP(V, a1, 7.5), t = a1 + (s > 0 ? 90 : -90), T = angP(E, t, 4.5), L = angP(E, t + 140, 4.5), R = angP(E, t - 140, 4.5);
  return `<svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" style="vertical-align:middle"><path d="${angArc(V, 7.5, Math.min(a0, a1), Math.max(a0, a1))}" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/><path d="M${T.join(' ')} L${L.join(' ')} L${R.join(' ')} Z" fill="currentColor"/></svg>`; }
ITEM.c9Whl = {
  make(spec) { /*T*/if (TESTHOOK && !(spec.k >= 1 && spec.k <= 3)) testBug('c9Whl: k من 1 إلى 3');/*/T*/ return { ...spec, img: c9RotK(spec.p, spec.k), want: spec.k, tag: 'c9-wheel' + (spec.match ? '-match' : '') }; },
  async ask(item, mode, tries) { const svg = m3Stage(262), Pl = c4Plane(svg, { n: 4, ny: 4, top: 50, H: 262 }), O = Pl.P(0, 0), ctx = { svg, Pl }, qg = el('g', {}, svg), wantQ = c4QuadOf(...item.img);
    c9Mark(svg, Pl, 'rot90'); c9Card(svg, item.match ? labelText('c9WhMatch') : c9Name(C9_KXF[item.k]), { w: 250 });
    let k = 0, shown = 0, anim = false; const arm = el('g', { 'pointer-events': 'none' }, svg), dot = el('g', { 'pointer-events': 'none' }, svg);
    const draw = (deg = 0) => { arm.innerHTML = ''; dot.innerHTML = ''; Pl.tk.forEach(({ t }) => t.removeAttribute('visibility'));   /* أعداد المحورين تعود ثم يُخفى ما تحت النقاط الآن */
      c4Dot(dot, Pl, ...item.p, { pair: !(shown % 4 === 0 && !deg), col: '#8a9aa8' }); if (item.match) c4Dot(dot, Pl, ...item.img, { pair: true, col: C9.img });
      const A = Pl.P(...item.p), a0 = Math.atan2(O[1] - A[1], A[0] - O[0]), r = Math.hypot(A[0] - O[0], A[1] - O[1]), t = a0 + (shown * 90 + deg) * Math.PI / 180, B = [O[0] + r * Math.cos(t), O[1] - r * Math.sin(t)];
      geoLine(arm, O[0], O[1], B[0], B[1], { color: C9.arc, w: 3, dash: '7 4' }); if (deg) el('circle', { cx: B[0], cy: B[1], r: 7, fill: C9.img, stroke: '#fff', 'stroke-width': 2 }, dot); else c4Dot(dot, Pl, ...c9RotK(item.p, shown), { pair: true, col: shown % 4 ? C9.img : C9.org }); };   /* في مكانها الأول بلون الأصل، وبعد الدوران بلون الصورة */
    draw(); ctx.draw = draw;
    if (tries === 0 && !item.match && wantQ !== 'axis') {   /* التوقّع: يلمس الربع على المستوى، ويُقارن بما يصل إليه (المراجع A، 7) */
      const T = [['q1', 1, 1], ['q2', -1, 1], ['q3', -1, -1], ['q4', 1, -1]].map(([q, sx, sy]) => { const g = el('g', {}, qg), x0 = Math.min(O[0], O[0] + sx * Pl.n * Pl.c), y0 = Math.min(O[1], O[1] - sy * Pl.m * Pl.c);
        el('rect', { x: x0 + 3, y: y0 + 3, width: Pl.n * Pl.c - 6, height: Pl.m * Pl.c - 6, rx: 8, fill: C9.hl, opacity: .12 }, g); return { g, k: q, label: labelText('c4Q.' + q) }; });
      let live = true; const qa = () => S(item.q || 'gen.c9.q.whPred'); qa(); REPLAY_HOOK = qa; REPLAY_HOOK.live = () => live && svg.isConnected;
      const q = await tapOne(T, { ok: wantQ, pad: false, pulse: false }); live = false; REPLAY_HOOK = null; hush(); item.pred = q;
      T.forEach(t => { if (t.k !== q) t.g.remove(); else { t.g.querySelector('rect').setAttribute('opacity', .3); ['role', 'tabindex', 'aria-label'].forEach(a => t.g.removeAttribute(a)); t.g.style.cursor = ''; } });
      logAttempt({ scene: 'game', mode, type: 'c9Whl', tag: 'c9-wheel-predict', ans: q, ok: q === wantQ, firstTry: true, try: 1 }); SFX.tick(); }   /* التوقّع يُسجَّل ولا يُحكم عليه بسلّم: يُرى ما يصل إليه */
    else if (tries === 0) item.pred = null;
    if (tries >= 3) { k = shown = item.k - 1; draw(); if (item.k === 1) { const h = helpG(svg), A = Pl.P(...item.p), rr = Math.hypot(A[0] - O[0], A[1] - O[1]), a = Math.atan2(O[1] - A[1], A[0] - O[0]) * 180 / Math.PI, H = angP(O, a + 45, rr);   /* لربعٍ واحد: نصف الطريق معاً */
      el('path', { d: angArc(O, rr, a, a + 45), fill: 'none', stroke: THINK_INK, 'stroke-width': 2.4, 'stroke-dasharray': '5 4' }, h); geoLine(h, O[0], O[1], H[0], H[1], { color: THINK_INK, w: 2.4, dash: '5 4' }); } }   /* الحلّ المشترك: أدرناها معاً حتى ربعٍ قبل الصورة، والأخير للطفل */
    const R0 = (() => { const A = Pl.P(...item.p); return Math.hypot(A[0] - O[0], A[1] - O[1]); })();
    const run = async () => { if (anim) return; anim = true; while (shown !== k) { const s = Math.sign(k - shown); for (let i = 1; i <= 5; i++) { draw(s * 15 * i); c9Hush(Pl, ([x, y]) => Math.abs(Math.hypot(x - O[0], y - O[1]) - R0) < 13); await sleep(FAST ? 1 : 40); } shown += s; draw(); SFX.tick(); } anim = false; };   /* وأعداد المحورين على مسار الذراع تُخفى مدّة الدوران (draw تعيدها) */
    const tq = tries >= 3 ? (item.k === 1 ? 'gen.c9.together.wheel1' : 'gen.c9.together.wheel') : tries === 0 && item.pred == null ? (item.q || 'gen.c9.q.whTurn') : 'gen.c9.q.whTurn';
    let live = true; const ta = () => S(tq); ta(); REPLAY_HOOK = ta; REPLAY_HOOK.live = () => live && svg.isConnected;
    const St = dqSteps(['c9TurnCw', 'c9TurnCcw'], d => { k += d; run(); return false; }, { icons: [c9TurnIcon(-1), c9TurnIcon(1)] });
    /*T*/window.__c9K = () => k;/*/T*/
    AUTO({ kind: 'c9Turn', ok: () => { k = shown = item.k; draw(); rulDoneBtn().click(); }, wrong: () => { k = shown = item.k + 1; draw(); rulDoneBtn().click(); } });
    await rulDone(() => { live = false; REPLAY_HOOK = null; St.off(); }); while (anim) await sleep(20);
    return { ans: k, ctx: { ...ctx, setK: v => { k = shown = v; draw(); } } }; },
  judge(item, k) { if (k === item.k) return { ok: true }; if (k < 0 && k > -4 && ((k % 4) + 4) % 4 === item.k) return { ok: true, alt: true };
    if (item.match) return { ok: false, err: 'c9WhMatch' };   /* البطاقة «حتى تنطبق» بلا عددٍ ولا جهة */
    if (item.k === 2) { const a = Math.abs(k); return { ok: false, err: a === 0 ? 'c9WhNone' : a < 2 ? 'c9WhShort' : 'c9WhOver' }; }   /* نصف الدورة بلا جهة: الخطأ في المقدار (المراجع A لإغلاق ألعاب U9، 2) */
    return { ok: false, err: k === 0 ? 'c9WhNone' : k < 0 ? 'c9WhDir' : k < item.k ? 'c9WhShort' : 'c9WhOver' }; },
  altLine: item => ({ 1: 'gen.c9.wh.alt1', 2: 'gen.c9.wh.alt2', 3: 'gen.c9.wh.alt3' })[item.k],
  async onOk(item) { SFX.good(); const at = c4QuadOf(...item.img); if (at !== 'axis') await S('gen.c9.wh.at.' + at); if (item.pred) await S(item.pred === at ? 'gen.c9.wh.predOk' : 'gen.c9.wh.predNo'); },   /* الربع الذي وصلت إليه، ومقارنته بالتوقّع */
  onWrong() { SFX.soft(); },
  async hint2(item, r) { const c = r && r.ctx; if (c && c.svg && c.svg.isConnected) { const m = helpG(c.svg), O = c.Pl.P(0, 0), rr = c.Pl.c * 1.5, a0 = 0;   /* ذراعٌ مرجعية قصيرة من محور السينات: ربع دورة عكس العقارب، لا طريق النقطة إلى جوابها (المراجع A لإغلاق ألعاب U9، 1) */
      const gh = el('circle', { r: 7, fill: THINK_INK, opacity: .6 }, m), at = u => { const t = a0 + u * Math.PI / 2; gh.setAttribute('cx', O[0] + rr * Math.cos(t)); gh.setAttribute('cy', O[1] - rr * Math.sin(t)); };
      await symTween(FAST ? 20 : 700, at); await sleep(FAST ? 10 : 300); await symTween(FAST ? 20 : 500, u => at(1 - u)); gh.remove(); el('path', { d: angArc(O, rr, 0, 90), fill: 'none', stroke: THINK_INK, 'stroke-width': 2.4, 'stroke-dasharray': '4 3' }, m); c9Clock(m, 316, 226); }   /* المستوى الثاني: الأداة تدير ربعاً واحداً عكس العقارب ثم تعود، وساعةٌ بالاتجاه */
    await S(item.match ? 'gen.c9.hint.wheelMatch' : 'gen.c9.hint.wheel'); },
  async together() {},
  async reveal(item, r) { const c = r && r.ctx; if (c && c.setK && c.svg.isConnected) c.setK(item.k); await S('gen.c9.reveal.wheel'); },
  praise: () => 'praisePlace', twin(item) { return item.twin || null; },   /* بلا توأم: جولة اللعبة لا تتسلسل */
};

/* ---------- د3 «الباب الدوّار»: kind door (البابُ مغلقاً بالداكن ومفتوحاً بالفاتح، والمفصّلة مشتركة) أو flag (رايةٌ وصورتها، والمركز بعيدٌ عنهما)؛
   th زاوية الدوران، cw، b الشعاع الأدنى (مضاعف 10). c9DrC: يلمس المركز فيدور الشفّاف حوله وينطبق أو لا؛ c9DrA: يدير المنقلة حتى يقع صفرها على أحد
   الخطّين ثم يقرأ الزاوية (المنقلة بيد الطفل وأعدادها فوق الباب؛ المراجعان A، 8 و14؛ وB، 1) ---------- */
function c9DrGeo(item) { const th = item.th, cw = !!item.cw, b = item.b, aA = cw ? b + th : b, aB = cw ? b : b + th, flag = item.kind === 'flag', O = [flag ? 180 : 136, 150];   /* المنقلة بين −40 و40 داخل الإطار */
  if (flag) { const F = [[64, 0], [108, 0], [90, 13]], at = a => F.map(([r, d]) => angP(O, a + d, r)); return { O, aA, aB, flag, P: at(aA), Q: at(aB), cand: [['O', O], ['Y', [O[0] - 44, O[1] - 30]], ['Z', [O[0] + 44, O[1] - 30]]] }; }   /* متباعدان لا على امتداد ضلع، ودوران الراية حول أيٍّ منهما داخل الإطار */
  return { O, aA, aB, flag, P: [O, angP(O, aA, 104)], Q: [O, angP(O, aB, 104)], cand: [['O', O], ['M', angP(O, aA, 52)], ['D', angP(O, aA, 104)]] }; }
function c9DrDraw(svg, item, o = {}) { const D = c9DrGeo(item), g = el('g', { 'pointer-events': 'none' }, svg), thin = !!o.thin;
  if (D.flag) { for (const [V, col, f] of [[D.P, C9.org, 'rgba(47,127,193,.18)'], [D.Q, C9.img, 'rgba(217,130,43,.18)']]) el('polygon', { points: V.map(p => p.join(',')).join(' '), fill: f, stroke: col, 'stroke-width': 2.4, 'stroke-linejoin': 'round', opacity: thin ? .65 : 1 }, g);
    if (o.rays) for (const a of [D.aA, D.aB]) { const E = angP(D.O, a, 108); geoLine(g, D.O[0], D.O[1], E[0], E[1], { color: C9.ink, w: 2, dash: '6 4' }); } }   /* الخطّان من المركز إلى الرأس وصورته */
  else { for (const [V, col] of [[D.P, '#8a6a43'], [D.Q, '#d2b48c']]) geoLine(g, V[0][0], V[0][1], V[1][0], V[1][1], { color: col, w: thin ? 4 : 7 }); el('circle', { cx: D.O[0], cy: D.O[1], r: 6, fill: C9.ink }, g); }   /* والبابُ أنحف ما دامت المنقلة عليه */
  return { ...D, g }; }
/* الشفّاف يدور حول C بزاوية الدوران: ينطبق على الصورة إن كان C المركز */
async function c9DrSpin(svg, D, item, C, o = {}) { const s = item.cw ? -item.th : item.th, pol = D.P.map(p => [Math.atan2(C[1] - p[1], p[0] - C[0]) * 180 / Math.PI, Math.hypot(p[0] - C[0], p[1] - C[1])]);
  const sh = el(D.flag ? 'polygon' : 'polyline', { fill: D.flag ? 'rgba(120,120,120,.18)' : 'none', stroke: o.col || '#6b7a83', 'stroke-width': D.flag ? 2 : 5, 'stroke-dasharray': '6 4', 'stroke-linejoin': 'round', 'pointer-events': 'none' }, svg);
  const at = u => sh.setAttribute('points', pol.map(([a, r]) => angP(C, a + s * u, r).join(',')).join(' ')); el('circle', { cx: C[0], cy: C[1], r: 5, fill: o.col || '#6b7a83', 'pointer-events': 'none' }, svg);
  await symTween(FAST ? 20 : 900, at); return sh; }
ITEM.c9DrC = {
  make(spec) { return { ...spec, want: 'O', tag: 'c9-door-centre-' + spec.kind }; },
  async ask(item, mode, tries) { const svg = m3Stage(250), D = c9DrDraw(svg, item), ctx = { svg, D }; let cand = D.cand; item.__try = tries;
    if (tries >= 3) { const x = cand.find(c => c[0] !== 'O' && !(item.tried || []).includes(c[0])) || cand.find(c => c[0] !== 'O'); await c9DrSpin(svg, D, item, x[1], { col: THINK_INK }); cand = cand.filter(c => c !== x); await S('gen.c9.together.ctr'); }   /* الحلّ المشترك: نجرّب معاً نقطةً خاطئة بالشفّاف، والاختيار من الباقيتين للطفل */
    const T = cand.map(([k, P]) => { const t = el('g', {}, svg); el('circle', { cx: P[0], cy: P[1], r: 12, fill: '#fff', stroke: C9.ink, 'stroke-width': 2.6 }, t);   /* 12 وحدةً تُرى على أضيق شاشة (المراجع B، 12) */ return { g: t, k, label: labelText('c9Spot') }; });
    let live = true; const qa = () => S(tries >= 3 ? 'gen.c9.q.ctrLast' : tries ? 'gen.c9.q.ctr' : item.q || 'gen.c9.q.ctr'); if (tries < 3) qa(); REPLAY_HOOK = qa; REPLAY_HOOK.live = () => live && svg.isConnected;
    const k = await tapOne(T, { ok: 'O', pad: 56 }); live = false; REPLAY_HOOK = null; hush(); (item.tried = item.tried || []).push(k); ctx.P = cand.find(c => c[0] === k)[1]; T.forEach(t => t.g.remove()); return { ans: k, ctx }; },
  judge(item, k) { return k === 'O' ? { ok: true } : { ok: false, err: item.kind === 'door' ? 'c9CtrMoved' : 'c9CtrOff' }; },
  async onOk(item, r) { SFX.good(); const c = r && r.ctx; if (c && c.svg.isConnected) await c9DrSpin(c.svg, c.D, item, c.D.O, { col: C9.ok }); },   /* الشفّاف يدور حول ما لمسه فينطبق */
  async onWrong(item, r) { SFX.soft(); const c = r && r.ctx; if (c && c.svg.isConnected && c.P && item.__try < 2) await c9DrSpin(c.svg, c.D, item, c.P); },   /* ويدور حول الخاطئة فلا ينطبق: يرى النتيجة */
  async hint2(item, r) { const c = r && r.ctx; if (c && c.svg && c.svg.isConnected) { const m = helpG(c.svg), D = c.D;
      if (D.flag) { const V = D.P[1], W = D.Q[1]; hlRing(m, V, 9, H2C[0]); hlRing(m, W, 9, H2C[1]);
        for (const [, C] of D.cand) { const l1 = el('line', { stroke: THINK_INK, 'stroke-width': 1.8, 'stroke-dasharray': '5 4' }, m), l2 = el('line', { stroke: THINK_INK, 'stroke-width': 1.8, 'stroke-dasharray': '5 4' }, m);
          await symTween(FAST ? 20 : 450, u => { for (const [l, E] of [[l1, V], [l2, W]]) { l.setAttribute('x1', C[0]); l.setAttribute('y1', C[1]); l.setAttribute('x2', C[0] + (E[0] - C[0]) * u); l.setAttribute('y2', C[1] + (E[1] - C[1]) * u); } }); } }   /* من كل نقطة خطّان إلى رأس الراية وصورته: المركز وحده على البعد نفسه منهما */
      else { const gh = el('polyline', { fill: 'none', stroke: THINK_INK, 'stroke-width': 4, 'stroke-dasharray': '6 4' }, m), dots = D.cand.map(() => el('circle', { r: 6, fill: THINK_INK }, m)), pol = D.cand.map(([, P]) => [Math.atan2(D.O[1] - P[1], P[0] - D.O[0]) * 180 / Math.PI, Math.hypot(P[0] - D.O[0], P[1] - D.O[1])]), s = item.cw ? -item.th : item.th;
        await symTween(FAST ? 20 : 1200, u => { const Q = pol.map(([a, rr]) => angP(D.O, a + s * u, rr)); gh.setAttribute('points', [D.O, Q[2]].map(p => p.join(',')).join(' ')); dots.forEach((d, i) => { d.setAttribute('cx', Q[i][0]); d.setAttribute('cy', Q[i][1]); }); }); } }   /* البابُ يدور والنقاط الثلاث معه: واحدةٌ لا تتحرّك */
    await S(c && c.D && c.D.flag ? 'gen.c9.hint.ctr.flag' : 'gen.c9.hint.ctr.door'); },
  async together() {},
  async reveal(item, r) { const c = r && r.ctx; if (c && c.svg.isConnected) { hlRing(c.svg, c.D.O, 14, C9.ok); await c9DrSpin(c.svg, c.D, item, c.D.O, { col: C9.ok }); } await S('gen.c9.reveal.ctr'); },
  reason: item => item.kind === 'door' ? 'gen.c9.ctr.hinge' : null,   /* «المفصّلة» مركز الدوران (المراجع A، 12) */
  praise: () => 'praiseLook', twin(item) { return item.twin || null; },   /* بلا توأم: جولة اللعبة لا تتسلسل */
};
ITEM.c9DrA = {
  make(spec) { const it = ITEM.c9Rot.make({ th: spec.th, ask: 'ang' }), lo = spec.b; return { ...spec, nums: it.nums, want: spec.th, zero: lo, okB: [lo, lo + spec.th - 180], b0: spec.b0 ?? lo - 30, tag: 'c9-door-angle-' + spec.kind }; },   /* want الجواب العددي، وzero موضع الصفر على الخطّ الأدنى */
  async ask(item, mode, tries) { const svg = m3Stage(250), D = c9DrDraw(svg, item, { thin: true, rays: true }), ctx = { svg, D }, pg = el('g', {}, svg); svg.insertBefore(pg, D.g); el('circle', { cx: D.O[0], cy: D.O[1], r: 6, fill: C9.ink, 'pointer-events': 'none' }, svg);
    let beta = tries >= 3 || item.zeroOk ? item.zero : item.b0, lab = null; const draw = () => { pg.innerHTML = ''; if (lab) lab.remove(); lab = protAt(pg, D.O, beta, { R: 96, step: 30, fs: 1.27 }).lab; svg.appendChild(lab); /*T*/window.__c9B = () => beta;/*/T*/ }; draw(); ctx.draw = draw;   /* المنقلة تحت الشكل فيُرى الخطّان عليها كأنها شفّافة، وأعدادها فوقهما (المراجع B، 1) */
    if (tries < 3 && !item.zeroOk) { let live = true; const qa = () => S(tries ? 'gen.c9.q.prot' : item.q || 'gen.c9.q.prot'); qa(); REPLAY_HOOK = qa; REPLAY_HOOK.live = () => live && svg.isConnected;
      const St = dqSteps(['c9TurnCw', 'c9TurnCcw'], d => { const n = Math.max(-40, Math.min(40, beta + 10 * d)); if (n === beta) return false; beta = n; draw(); return true; }, { icons: [c9TurnIcon(-1), c9TurnIcon(1)] });
      AUTO({ kind: 'c9Prot', ok: () => { beta = item.zero; draw(); rulDoneBtn().click(); }, wrong: () => { beta = item.b0; draw(); rulDoneBtn().click(); } });
      await rulDone(() => { live = false; REPLAY_HOOK = null; St.off(); }); ctx.beta = beta; if (!item.okB.includes(((beta % 360) + 540) % 360 - 180)) return { ans: 'zero|' + beta, ctx }; item.zeroOk = true; }   /* وضعُها الصحيح يبقى للمحاولة التالية (المراجع A لإغلاق ألعاب U9، 8) */
    else if (item.zeroOk && tries < 3) ctx.beta = beta;
    else { el('path', { d: angArc(D.O, 96 - 19, item.zero, item.zero + item.th - 10), fill: 'none', stroke: THINK_INK, 'stroke-width': 4, opacity: .8 }, helpG(svg)); await S('gen.c9.together.prot'); }   /* الحلّ المشترك: المنقلة موضوعة، والتدريج الخارجي يُبرز من صفره ويقف قبل الجواب؛ والقراءة للطفل */
    ctx.beta = beta; let live = true; const qr = () => S('gen.c9.q.protRead'); if (tries < 3) qr(); REPLAY_HOOK = qr; REPLAY_HOOK.live = () => live && svg.isConnected;
    const np = numberPick(shuffle(item.nums), item.th, { west: true, word: degw }); const k = await np.p; live = false; REPLAY_HOOK = null; document.querySelectorAll('#stage .choices').forEach(x => x.remove()); return { ans: 'read|' + beta + '|' + k, ctx }; },
  judge(item, a) { const [w, , k] = String(a).split('|'); if (w === 'zero') return { ok: false, err: 'c9ProtZero' }; return +k === item.th ? { ok: true } : { ok: false, err: +k === 180 - item.th ? 'c9AngSup' : 'c9AngOff' }; },
  async onOk(item, r) { SFX.good(); const c = r && r.ctx; if (c && c.svg.isConnected) { c.svg.querySelectorAll('[data-prot], [data-prot-lab]').forEach(e => e.remove()); arArc(c.svg, c.D.O, Math.min(c.D.aA, c.D.aB), Math.max(c.D.aA, c.D.aB), { r: 34, col: C9.arc, deg: item.th, dl: 18, fs: 14, fill: true }); } },   /* المنقلة تُرفع، والزاوية بعددها */
  onWrong() { SFX.soft(); },
  async hint2(item, r, err) { const c = r && r.ctx; if (c && c.svg && c.svg.isConnected) { const m = helpG(c.svg), D = c.D, E = angP(D.O, c.beta ?? item.b0, 96), Z = angP(D.O, item.zero, 104);
      hlRing(m, D.O, 10, C9.arc); if (err === 'c9ProtZero') { el('circle', { cx: E[0], cy: E[1], r: 8, fill: 'none', stroke: C9.q, 'stroke-width': 3 }, m); for (const a of [D.aA, D.aB]) { const T = angP(D.O, a, 104); hlSeg(m, D.O, T, H2C[0]); } }   /* أين الصفر الآن، والخطّان اللذان يوضع على أحدهما */
      else hlSeg(m, D.O, Z, H2C[0]); ciRule(m, 180, C9_RPOS, labelText(err === 'c9ProtZero' ? 'c9Ask.protZero' : 'c9Ask.rotAng'), C9.hl, 15); }
    await S(err === 'c9ProtZero' ? 'gen.c9.hint.prot' : 'gen.c9.hint.door'); },
  async together() {},
  async reveal(item, r) { const c = r && r.ctx; if (c && c.svg.isConnected) { c.svg.querySelectorAll('[data-prot], [data-prot-lab]').forEach(e => e.remove()); protAt(c.svg, c.D.O, item.zero, { R: 96, step: 30, fs: 1.27 }); el('path', { d: angArc(c.D.O, 96 - 19, item.zero, item.zero + item.th), fill: 'none', stroke: C9.ok, 'stroke-width': 4 }, c.svg); }
    await S('gen.c9.reveal.rot.ang', { noGap: true }); await sayDeg(item.th); },
  praise: () => 'praiseMeasure', twin(item) { return item.twin || null; },   /* بلا توأم: جولة اللعبة لا تتسلسل */
};

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
