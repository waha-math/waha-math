/* =====================================================================
   M4-U2 «البرهان والمثلث» (المرحلة 4، المرجع reference/03_المناهج_والوحدات/M4_U2_البرهان_والمثلث.md، نسخة 1.2)
   د1 البرهان الأول: مجموع زوايا المثلث بمستقيم موازٍ عند الرأس (C408 أ) · د2 برهان المتقابلتين بالرأس وزوايا التبادل والمتحالفتين (C408 ب)
   د3 متباينة المثلث وبرهانها بأقصر طريق وحدود الضلع الثالث (C402) · د4 مجموع زوايا المضلع (ن − 2) × 180 والخارجية في المنتظم (C411)
   وإتقان شبه المنحرف متساوي الساقين (C178) · د5 «محكمة البرهان»: المراجعة والاختبار (12)
   البرهان: معطى ومطلوب وخطوات، ولكل خطوة «لأن»: تعريف أو مسلّمة معلنة (التناظر في U1 د3، والقطعة أقصر طريق C114) أو مبرهنة سابقة (D243).
   والقياس يتحقق ولا يبرهن. نصوص الخطوات والأسباب تسميات (pf.*) وجمل مسموعة (gen.pf.*).
   ===================================================================== */
const PF = { ink: '#24323a', a: '#2f9d6b', b: '#d9822b', c: '#7a4fb0', par: '#2f7fc1', q: '#c0392b', soft: '#eef6fb', card: '#fffdf6', edge: '#c9d6df', hl: SO.hl, ok: SO.ok };
/* البراهين: الشكل وخطواته الثلاث (التسمية pf.<k>.<n>) وسبب كل خطوة (pf.rs.<سبب>)؛ alt: ترتيبات أخرى صحيحة (خطوتان لا تعتمد إحداهما على الأخرى) */
const PF_PROOFS = {
  tri: { rs: ['draw', 'alt', 'line'] },
  vert: { rs: ['line', 'line', 'same'], alt: ['1,0,2'] },
  alt: { rs: ['corr', 'vert', 'trans'], alt: ['1,0,2'] },
  coint: { rs: ['corr', 'line', 'swap'], alt: ['1,0,2'] },
  ineq: { rs: ['path', 'short', 'so'], alt: ['1,0,2'] },
  poly: { rs: ['diag', 'convex', 'tri'] } };
const pfLab = (g, x, y, s, o = {}) => { const t = el('text', { x, y, 'text-anchor': o.anchor || 'middle', 'font-size': o.fs || 16, 'font-weight': 800, fill: o.col || PF.ink, stroke: '#fff', 'stroke-width': 4, 'paint-order': 'stroke', direction: 'rtl', 'pointer-events': 'none' }, g); t.textContent = s; return t; };
const pfDir = (V, P) => (Math.atan2(V[1] - P[1], P[0] - V[0]) * 180 / Math.PI + 360) % 360;
/* قوس زاوية بين اتجاهين بالأصغر منهما */
function pfAng(g, V, P, Q, o = {}) { let a1 = pfDir(V, P), a2 = pfDir(V, Q); if ((a2 - a1 + 360) % 360 > 180) [a1, a2] = [a2, a1]; if (a2 < a1) a2 += 360;
  return arArc(g, V, a1, a2, { r: o.r || 22, col: o.col || PF.a, fill: true, dl: o.dl || 14, fs: o.fs || 14, ...(o.deg != null ? { deg: o.deg } : o.lab != null ? { lab: o.lab } : {}) }); }
const pfDot = (g, P) => el('circle', { cx: P[0], cy: P[1], r: 4.5, fill: ANG.v, stroke: '#fff', 'stroke-width': 2, 'pointer-events': 'none' }, g);

/* ---------- الأشكال (ارتفاعها نحو 110 من y0)، ولكل برهان صور (v): حروف أخرى وشكل آخر، فبند التقييم مسألةٌ جديدة لا صورةُ ما رُئي (D240) ---------- */
const PF_TRI = [{ L: ['أ', 'ب', 'ج'], P: [[170, 38], [84, 112], [290, 112]] }, { L: ['د', 'هـ', 'و'], P: [[250, 38], [60, 112], [300, 112]] }, { L: ['ل', 'م', 'ن'], P: [[110, 38], [70, 112], [296, 112]] }, { L: ['س', 'ص', 'ع'], P: [[206, 38], [46, 112], [272, 112]] }, { L: ['ف', 'ق', 'ر'], P: [[136, 38], [62, 112], [300, 112]] }];   /* الرأس الأعلى 38 لا 30: حرفه داخل الإطار (المراجعان لبوابة M4-U1/U2) */
const PF_MK = { vert: [[40, [0, 1, 2]], [65, [1, 2, 3]], [110, [2, 3, 0]]], alt: [[3, 7, 6], [4, 8, 5], [2, 6, 7]], coint: [[3, 7, 5], [4, 8, 6]] }, PF_INEQ = [{ L: ['أ', 'ب', 'ج'], P: [[70, 104], [196, 38], [300, 104]] }, { L: ['د', 'هـ', 'و'], P: [[60, 100], [120, 40], [304, 100]] }, { L: ['س', 'ص', 'ع'], P: [[56, 106], [238, 44], [300, 106]] }]   /* صورة ثالثة للمتقابلتين وللتبادل وللمتباينة (المراجع A لبوابة M4-U1/U2، 2) */, PF_POLY = [5, 6, 7];
const pfKey = (k, v, n) => `pf.${k}${v ? '.v' + v : ''}.${n + 1}`;
/* متغيّرات الحروف لبراهين م4 التي ليس لها متغيّرات مرسومة (الرباعيات وفيثاغورس والدائرة والإنشاء): الشكل والخطوات بأسماء أخرى، فبند التقييم ليس مسألة المشهد
   نفسها (D240، المراجع B لبوابة M4-U1/U2، 14). الحرف يُبدَّل حين يكون اسماً قائماً وحده (أو بعد «وَ») لا حرفاً في كلمة */
const PF_GENERIC = ['paraSide', 'paraDiag', 'rectDiag', 'rhombDiag', 'conv', 'pyth', 'pyConv', 'perpPf', 'chordPf', 'inscPf', 'bisPf', 'pbPf', 'bisCon', 'perpCon'];
const PF_LMAP = { 1: { 'أ': 'س', 'ب': 'ص', 'ج': 'ع', 'د': 'ل', 'م': 'ك', 'ن': 'ط', 'ر': 'ح', 'ق': 'ف', 'و': 'ز' },
  2: { 'أ': 'ل', 'ب': 'ك', 'ج': 'ط', 'د': 'ي', 'م': 'ف', 'ن': 'س', 'ر': 'ع', 'ق': 'ص', 'و': 'ح' },
  3: { 'أ': 'ف', 'ب': 'ح', 'ج': 'ك', 'د': 'ط', 'م': 'س', 'ن': 'ل', 'ر': 'ص', 'ق': 'ع', 'و': 'ي' } };
const pfLetters = (s, v) => { const M = PF_LMAP[v]; return M ? String(s).replace(/(^|[^\u0621-\u064A\u064B-\u0652]|وَ)([أبجدمنرقو])(?![\u0621-\u064A\u064B-\u0652])/g, (m, p, c) => p + (M[c] || c)) : s; };
function pfText(k, v, n) { const key = pfKey(k, v, n), D = CUR ? LDATA[CUR.id] : null; if (!v || (D && D.labels && D.labels[key]) || LABELS.ui[key] || !PF_GENERIC.includes(k)) return labelText(key); return pfLetters(labelText(pfKey(k, 0, n)), v); }
function pfFig(g, k, o = {}) { if (o.v && PF_LMAP[o.v] && PF_GENERIC.includes(k)) { const h = el('g', {}, g), r = pfFig0(h, k, { ...o, v: 0 }), w = document.createTreeWalker(h, NodeFilter.SHOW_TEXT), L = []; while (w.nextNode()) L.push(w.currentNode); L.forEach(t => { t.data = pfLetters(t.data, o.v); }); return r; }
  return pfFig0(g, k, o); }
function pfFig0(g, k, o = {}) { if (['paraSide', 'paraDiag', 'rectDiag', 'rhombDiag', 'conv'].includes(k)) return cgQuad(g, k, { y0: o.y0, s: o.s });   /* براهين الرباعيات (M4-U3) */
  if (['pyth', 'pyConv', 'perpPf'].includes(k)) return pyFig(g, k, o);   /* براهين فيثاغورس (M4-U4) */
  if (['chordPf', 'inscPf'].includes(k)) return c6Fig(g, k, o);   /* براهين الدائرة (M4-U6) */
  if (['bisPf', 'pbPf', 'bisCon', 'perpCon'].includes(k)) return c8Fig(g, k, o);   /* الإنشاء وبرهاناه (M4-U8) */
  const y0 = o.y0 ?? 0, s = o.s || 1, v = o.v || 0, T = (x, y) => [180 + (x - 180) * s, y0 + y * s];
  if (k === 'tri') { const V = PF_TRI[v], [A, B, C] = V.P.map(p => T(...p)), [nA, nB, nC] = V.L;
    if (o.par !== false) { geoLine(g, T(40, 30)[0], A[1], T(320, 30)[0], A[1], { color: PF.par, w: 3.4, dash: o.parDash ? '7 5' : null }); }
    el('polygon', { points: polyStr([A, B, C]), fill: 'rgba(122,79,176,.08)', stroke: PF.ink, 'stroke-width': 3.4, 'stroke-linejoin': 'round', 'pointer-events': 'none' }, g);
    pfAng(g, B, A, C, { col: PF.a, r: 24 }); pfAng(g, C, A, B, { col: PF.b, r: 24 });
    if (o.par !== false) { pfAng(g, A, [A[0] - 60, A[1]], B, { col: PF.a, r: 22, lab: arNum(1), dl: 12 }); pfAng(g, A, C, [A[0] + 60, A[1]], { col: PF.b, r: 22, lab: arNum(2), dl: 12 }); }
    pfAng(g, A, B, C, { col: PF.c, r: 16 });
    pfLab(g, A[0], A[1] - 9, nA); pfLab(g, B[0] - 12, B[1] + 14, nB); pfLab(g, C[0] + 12, C[1] + 14, nC); [A, B, C].forEach(P => pfDot(g, P)); return { A, B, C }; }
  if (k === 'vert') { const [th, mk] = PF_MK.vert[v], V = T(180, 62), X = arCross(g, V, th, { L: 96 * s });
    mk.forEach((i, j) => arArc(g, V, X[i][0], X[i][1], { r: 24, col: [PF.a, PF.b, PF.a][j], lab: arNum(i + 1), dl: 13, fs: 14, fill: true })); return { V }; }
  if (k === 'alt' || k === 'coint') { const R = arTrans(g, 60, { y1: y0 + 22 * s, y2: y0 + 96 * s, ext: 22 });
    PF_MK[k][v].forEach((n, j) => { const { V, a1, a2 } = R.at(n); arArc(g, V, a1, a2, { r: 15, col: [PF.a, PF.b, k === 'alt' ? PF.a : PF.c][j], lab: arNum(n), dl: 10, fs: 13, fill: true }); }); return R; }
  if (k === 'ineq') { const V = PF_INEQ[v], [A, B, C] = V.P.map(p => T(...p)), [nA, nB, nC] = V.L;
    geoLine(g, A[0], A[1], B[0], B[1], { color: PF.b, w: 4 }); geoLine(g, B[0], B[1], C[0], C[1], { color: PF.b, w: 4 }); geoLine(g, A[0], A[1], C[0], C[1], { color: PF.a, w: 4.4 });
    pfLab(g, A[0] - 12, A[1] + 6, nA); pfLab(g, B[0], B[1] - 9, nB); pfLab(g, C[0] + 12, C[1] + 6, nC); [A, B, C].forEach(P => pfDot(g, P)); return { A, B, C }; }
  if (k === 'poly') { return polyFig(g, PF_POLY[v], { cx: 180, cy: y0 + 62 * s, r: 52 * s, diag: true }); }
  return {}; }

/* ---------- المضلع: منتظم (rot يدير أول رأس)، وأقطار من الرأس الأول، والمثلثات ملوّنة ---------- */
const PF_FILLS = ['rgba(47,157,107,.16)', 'rgba(217,130,43,.18)', 'rgba(122,79,176,.15)', 'rgba(47,127,193,.16)'];
function polyPts(n, cx, cy, r, rot = 90) { return Array.from({ length: n }, (_, i) => angP([cx, cy], rot + 360 * i / n, r)); }
function polyFig(g, n, o = {}) { const P = o.pts || polyPts(n, o.cx ?? 180, o.cy ?? 112, o.r ?? 80, o.rot ?? (n % 2 ? 90 : 90 + 180 / n));
  if (o.diag) for (let i = 1; i < n - 1; i++) el('polygon', { points: polyStr([P[0], P[i], P[i + 1]]), fill: PF_FILLS[(i - 1) % 4], stroke: 'none', 'pointer-events': 'none' }, g);
  el('polygon', { points: polyStr(P), fill: o.diag ? 'none' : o.fill || 'rgba(47,127,193,.10)', stroke: PF.ink, 'stroke-width': 3.2, 'stroke-linejoin': 'round', 'pointer-events': 'none' }, g);
  if (o.diag) for (let i = 2; i < n - 1; i++) geoLine(g, P[0][0], P[0][1], P[i][0], P[i][1], { color: PF.c, w: 2.6, dash: '6 4' });
  P.forEach(Q => pfDot(g, Q)); return { P }; }

/* ---------- نصّ خطوة: عبارة ثم «لأن…» بخطّ أصغر ---------- */
function pfStep(g, y, k, n, o = {}) { const rs = PF_PROOFS[k].rs[n], t = el('text', { x: o.x ?? 324, y, 'text-anchor': 'start', 'font-size': o.fs || 15, 'font-weight': 800, fill: o.col || PF.ink, direction: 'rtl', 'pointer-events': 'none' }, g);
  t.textContent = MX(pfText(k, o.v, n)); if (o.reason === false) return t;   /* الخطوة العددية الخالصة بالغربية من اليسار (D280 (2)، المراجع A لبوابة M4-U1/U2، 1) */
  const r = o.two ? el('text', { x: o.x ?? 324, y: y + (o.fs || 15) + 5, 'text-anchor': 'start', direction: 'rtl', 'pointer-events': 'none' }, g) : el('tspan', {}, t);   /* two: السبب سطرٌ ثانٍ تحت العبارة */
  r.setAttribute('font-size', (o.fs || 15) - (o.two ? 1 : 2));   /* السبب في سطره الثاني بخطّ يُقرأ (المراجع B لبوابة M4-U1/U2، 11) */ r.setAttribute('font-weight', 700); r.setAttribute('fill', o.ask ? PF.q : o.rcol || '#5b6b75');
  r.textContent = (o.two ? '' : '  ') + labelText('pfBecause') + ' ' + (o.ask ? '؟' : labelText('pf.rs.' + rs)); return t; }

/* ================= ① سلسلة السبب (C408): pf؛ ثلاث بطاقات خطوات تُرتَّب باللمس ================= */
/* شكل البرهان في شريطٍ [T، B] بأسمائه وأقواسه داخله (المراجعان لبوابة M4-U1/U2): مدى الشكل مع تسمياته خطّيٌّ في s، فيُختار أكبر s ≤ sMax يسعه ثم y0.
   [a، b، c، d]: أعلى نقطة y0 + a·s + b، وأدناها y0 + c·s + d؛ وما لا يُعرف مداه (براهين U3 فما بعد) بـ y0 وs كما كانا */
const PF_SPAN = { tri: [38, -21, 112, 18], ineq: [38, -21, 106, 10], vert: [62, -45, 62, 45], alt: [22, -33, 96, 33], coint: [22, -33, 96, 33], poly: [10, -6, 114, 6] };
function pfFitFig(g, k, T, B, o = {}) { const S = PF_SPAN[k]; if (!S) return pfFig(g, k, { y0: o.y0 ?? 2, s: o.s ?? .7, v: o.v });
  const [a, b, c, d] = S, s = Math.min(o.sMax || .72, c > a ? (B - T - (d - b)) / (c - a) : 1), y0 = T - (a * s + b); return pfFig(g, k, { y0, s, v: o.v }); }
const PF_CY = i => 126 + i * 76;
/* ما تعتمد عليه كل خطوة: [] الرسم نفسه (المعلوم)، أو أرقام الخطوات قبلها (المستوى الثاني في سلسلة السبب وأغلق البرهان: المراجع B لبوابة M4-U1/U2، 8) */
const PF_DEP = k => k === 'tri' || k === 'poly' ? [[], [0], [0, 1]] : [[], [], [0, 1]];
function pfFigGlow(m, fig) { let b = null; try { b = fig.getBBox(); } catch (e) {} if (!b || !b.width) return null;
  const x0 = Math.max(24, b.x - 8), x1 = Math.min(336, b.x + b.width + 8), y0 = Math.max(18, b.y - 6), y1 = b.y + b.height + 6;
  const r = 12; el('path', { d: `M${x0 + r} ${y0} H${x1 - r} A${r} ${r} 0 0 1 ${x1} ${y0 + r} V${y1 - r} A${r} ${r} 0 0 1 ${x1 - r} ${y1} H${x0 + r} A${r} ${r} 0 0 1 ${x0} ${y1 - r} V${y0 + r} A${r} ${r} 0 0 1 ${x0 + r} ${y0} Z`,
    fill: 'rgba(242,201,76,.10)', stroke: PF.hl, 'stroke-width': 2.4, 'stroke-dasharray': '7 5', 'pointer-events': 'none' }, m); return [x0, y0, x1, y1]; }
const pfUpArrow = (m, x, y0, y1) => { geoLine(m, x, y0, x, y1, { color: PF.hl, w: 2.6, dash: '5 4' }); geoArrow(m, x, y1, -90, PF.hl, 8); };   /* بطاقات 70 وحدة: 56 بكسلاً على أضيق شاشة (0.8 بكسل للوحدة، كـ ORD_XY؛ المراجع B لبوابة M4-U1/U2، 1) */   /* البطاقات تحت الشكل كله، لا على رأسيه (المراجع B لبوابة M4-U1/U2) */
ITEM.prChain = {
  make(spec) { const P = PF_PROOFS[spec.pf], order = shuffle([0, 1, 2]); const ok = ['0,1,2', ...(P.alt || [])].map(s => s.split(',').map(i => order.indexOf(+i)).join(','));
    return { ...spec, order, okSet: ok, want: ok[0], tag: 'pf-chain-' + spec.pf }; },
  async ask(item, mode, tries) { const svg = m3Stage(390), g = el('g', { 'pointer-events': 'none' }, svg), v = item.v || 0, cg = ['sas', 'asa', 'sss'].some(r => PF_PROOFS[item.pf].rs.includes(r)); pfFitFig(g, item.pf, 18, 120, { v, sMax: .7, y0: 8, s: cg ? .5 : .56 });
    const cards = item.order.map((n, i) => { const c = el('g', { role: 'button', tabindex: 0, style: 'cursor:pointer' }, svg), y = PF_CY(i);
      el('rect', { x: 20, y, width: 320, height: 70, rx: 10, fill: PF.card, stroke: PF.edge, 'stroke-width': 2 }, c); pfStep(c, y + 30, item.pf, n, { x: 330, fs: 15, two: true, v }); c.setAttribute('aria-label', plain(pfText(item.pf, v, n) + ' ' + labelText('pfBecause') + ' ' + labelText('pf.rs.' + PF_PROOFS[item.pf].rs[n]))); return c; });
    if (tries >= 3) { const m = helpG(svg); badge(m, 38, PF_CY(item.order.indexOf(0)) + 35, 1, THINK_INK); await S('gen.pf.together.chain'); }
    else await S(item.q || 'gen.pf.q.chain');
    const picked = await orderTap(svg, cards, item.want, i => [38, PF_CY(i) + 35]); return { ans: picked.join(','), ctx: { svg, cards, fig: g } }; },
  judge(item, k) { if (item.okSet.includes(k)) return { ok: true }; const first = +k.split(',')[0]; return { ok: false, err: item.order[first] === 2 ? 'pfJump' : 'pfOrder' }; },
  onOk() { SFX.good(); }, onWrong() { SFX.soft(); },
  async hint2(item, r) { if (r && r.ctx && r.ctx.svg) { if (r.ctx.fig) pfFigGlow(helpG(r.ctx.svg), r.ctx.fig);   /* المستوى الثاني رسمٌ: المعلوم في الرسم أولاً (المراجع B، 8) */
      hintCard(r.ctx.svg, 180, 358, labelText('pfRuleChain')); } await S('gen.pf.hint.chain'); }   /* تحت البطاقات، لا على الشكل (المراجع B لبوابة M4-U1/U2، 6) */, async together() {},
  async reveal(item, r) { const m = helpG(r.ctx.svg); item.want.split(',').forEach((i, n) => badge(m, 38, PF_CY(+i) + 35, n + 1, PF.ok)); await S('gen.pf.reveal.chain'); },
  praise: () => 'praiseThink', twin(item) { return item.twin || null; } };

/* ================= ② أغلق البرهان (C408، C402، C411): pf، step (0..2)، cands [أسباب، الأول الصحيح] بطاقاتٍ مسموعة ================= */
const PF_ERR = { measure: 'pfMeasure', looks: 'pfLooks', circ: 'pfCircular' };
ITEM.prReason = {
  make(spec) { /*T*/if (TESTHOOK && spec.cands[0] !== PF_PROOFS[spec.pf].rs[spec.step]) testBug('prReason: السبب الأول ليس سبب الخطوة');/*/T*/ return { ...spec, want: spec.cands[0], tag: 'pf-reason-' + spec.pf }; },
  async ask(item, mode, tries) { const svg = m3Stage(276), g = el('g', { 'pointer-events': 'none' }, svg), v = item.v || 0; pfFitFig(g, item.pf, 18, 124, { v, sMax: .72, y0: 12, s: .72 });   /* على الورقة: تُقرأ في الوضع الداكن (المراجع B لبوابة M4-U1/U2، 3) */
    for (let n = 0; n < 3; n++) pfStep(g, 148 + n * 30, item.pf, n, { fs: 14, v, reason: n === item.step ? true : false, ask: n === item.step, col: n === item.step ? PF.ink : '#5b6b75' });
    el('rect', { x: 22, y: 148 + item.step * 30 - 19, width: 316, height: 27, rx: 8, fill: 'rgba(192,57,43,.07)', stroke: PF.q, 'stroke-width': 1.6, 'pointer-events': 'none' }, svg);
    if (tries >= 3) { await S('gen.pf.together.reason'); } else await S(item.q || 'gen.pf.q.reason');
    const cp = cardPick(item.cands.map((o, i) => ({ id: 'gen.pf.rs.' + o, k: o, ok: i === 0 })), { intro: item.q || 'gen.pf.q.reason' }); const c = await cp.p; cp.done(); return { ans: c.k, ctx: { svg, cp, c, fig: g } }; },
  judge(item, k) { return k === item.cands[0] ? { ok: true } : { ok: false, err: PF_ERR[k] || 'pfWrongRule' }; },
  onOk(item, r) { SFX.good(); r.ctx.cp.btns.find(b => b.dataset.k === r.ctx.c.k).classList.add('ok'); }, onWrong(item, r) { SFX.soft(); r.ctx.cp.btns.find(b => b.dataset.k === r.ctx.c.k).classList.add('no'); },
  async hint2(item, r) { if (r && r.ctx && r.ctx.svg) { const m = helpG(r.ctx.svg), dep = PF_DEP(item.pf)[item.step], yA = 148 + item.step * 30 - 19;   /* المستوى الثاني رسمٌ: سهمٌ من الخطوة المعلَّمة إلى ما تعتمد عليه (الرسم أو خطوةٌ قبلها؛ المراجع B، 8) */
      if (!dep.length) { const B = r.ctx.fig ? pfFigGlow(m, r.ctx.fig) : null; pfUpArrow(m, 32, yA, B ? B[3] + 2 : 128); }
      else for (const d of dep) { const y = 148 + d * 30; el('rect', { x: 22, y: y - 19, width: 316, height: 27, rx: 8, fill: 'none', stroke: PF.hl, 'stroke-width': 2.2, 'stroke-dasharray': '6 4', 'pointer-events': 'none' }, m); if (yA > y + 8) pfUpArrow(m, 30 + d * 6, yA, y + 9); }
      hintCard(r.ctx.svg, 180, 238, labelText('pfRuleReason')); } await S('gen.pf.hint.reason'); }, async together() {},
  async reveal(item, r) { const b = r.ctx.cp.btns.find(x => x.dataset.k === item.cands[0]); if (b) b.classList.add('ok'); await S('gen.pf.rs.' + item.cands[0]); },
  praise: () => 'praiseThink', twin(item) { return item.twin || null; } };

/* ================= ③ هل تصنع الأعواد مثلثاً؟ (C402): s [ثلاثة أطوال] ================= */
const ineqOk = s => { const [a, b, c] = [...s].sort((x, y) => x - y); return a + b > c; };
/* أعواد الطرفين على الأكبر: قوسان من طرفيه بطولي الآخرين؛ يلتقيان أم لا (meet: يُرسم المثلث) */
function ineqSticks(g, s, o = {}) { const [a, b, c] = [...s].sort((x, y) => x - y), y = o.y ?? 186, u = Math.min(o.u || 26, 280 / c, (y - (o.top ?? 40)) / b),   /* والعودان القائمان داخل الإطار */ L = [180 - c * u / 2, y], Rr = [180 + c * u / 2, y];
  geoLine(g, L[0], y, Rr[0], y, { color: PF.par, w: 5 }); pfLab(g, 180, y + 22, MS(String(c)), { fs: 15 });
  const ok = a + b > c, xA = ok ? (c * c + b * b - a * a) / (2 * c) : null;   /* من الطرف الأيمن: b، ومن الأيسر: a */
  if (ok && o.meet) { const h = Math.sqrt(Math.max(0, b * b - xA * xA)), P = [Rr[0] - xA * u, y - h * u]; geoLine(g, Rr[0], y, P[0], P[1], { color: PF.a, w: 5 }); geoLine(g, L[0], y, P[0], P[1], { color: PF.b, w: 5 });
    pfLab(g, (Rr[0] + P[0]) / 2 + 14, (y + P[1]) / 2, MS(String(b)), { fs: 15, anchor: 'start' }); pfLab(g, (L[0] + P[0]) / 2 - 14, (y + P[1]) / 2, MS(String(a)), { fs: 15, anchor: 'end' }); }
  else { const ang = 90; const P = angP(Rr, 180 - ang, b * u), Q = angP(L, ang, a * u);   /* قائمان على الطرفين: لا يوحيان بالالتقاء */ geoLine(g, Rr[0], y, P[0], P[1], { color: PF.a, w: 5 }); geoLine(g, L[0], y, Q[0], Q[1], { color: PF.b, w: 5 });
    pfLab(g, P[0] + 4, P[1] - 8, MS(String(b)), { fs: 15 }); pfLab(g, Q[0] - 4, Q[1] - 8, MS(String(a)), { fs: 15 });
    if (o.arcs) { const ag = o.arcsG || g; el('path', { d: angArc(Rr, b * u, 90, 180), fill: 'none', stroke: PF.a, 'stroke-width': 2, 'stroke-dasharray': '4 4', 'pointer-events': 'none' }, ag); el('path', { d: angArc(L, a * u, 0, 90), fill: 'none', stroke: PF.b, 'stroke-width': 2, 'stroke-dasharray': '4 4', 'pointer-events': 'none' }, ag); } }
  [L, Rr].forEach(P => pfDot(g, P)); return { ok, a, b, c }; }
ITEM.ineqYN = cpItem({ H: 280, tLine: 'gen.pf.together.ineq', hint: 'gen.pf.hint.ineq', rLine: it => 'gen.pf.reveal.ineq.' + it.want, praise: 'praiseThink',
  make: s => { const [a, b, c] = [...s.s].sort((x, y) => x - y); return { want: a + b > c ? 'yes' : 'no', eq: a + b === c, tag: 'ineq-yn' }; },
  draw(svg, item, tries) { const g = el('g', {}, svg); ineqSticks(g, item.s, { arcs: tries >= 2, arcsG: tries >= 2 ? helpG(svg) : null, y: 200, top: 84 }); if (tries >= 2) ciRule(helpG(svg), 180, 36, labelText('pfRuleIneq'), PF.hl, 15);   /* ما يرسمه البند من المستوى الثاني يُغني عن نسخه، فالبطاقة معه */   /* العودان تحت بطاقة المستوى الثاني (المراجع B لبوابة M4-U1/U2، 6) */
    if (tries >= 3) { const [a, b, c] = [...item.s].sort((x, y) => x - y); ciEq(helpG(svg), 180, 250, `${a} + ${b} ؟ ${c}`, PF.hl, 18); } return { g }; },
  h2: async (item, ctx) => { ciRule(helpG(ctx.svg), 180, 36, labelText('pfRuleIneq'), PF.hl, 15); await sleep(FAST ? 10 : 250); },
  show: async (item, ctx) => { if (ctx && ctx.g && item.want === 'yes') { ctx.g.innerHTML = ''; ineqSticks(ctx.g, item.s, { meet: true, y: 200, top: 84 }); } },
  pick: item => yesNo(item.want),
  errOf: (it, k) => k === 'no' ? 'ineqNo' : it.eq ? 'ineqEqual' : 'ineqTwoOnly' });

/* ================= ④ حدود الضلع الثالث (C402): a، b، ask max | min (أعداد صحيحة) ================= */
ITEM.ineqRange = cpItem({ H: 262, tLine: 'gen.pf.together.range', hint: 'gen.pf.hint.range', rLine: 'gen.pf.reveal.range', rSay: it => S(numw(it.want), { append: true }), num: true, praise: 'praiseThink',
  make: s => { const hi = s.a + s.b, lo = Math.abs(s.a - s.b), want = s.ask === 'max' ? hi - 1 : lo + 1, eq = s.ask === 'max' ? hi : lo, far = s.ask === 'max' ? hi + 1 : Math.max(lo - 1, want + 2);
    return { want, eq, nums: [want, eq, far === eq || far === want ? want + 3 : far], tag: 'ineq-' + s.ask }; },
  draw(svg, item, tries) { const g = el('g', { 'pointer-events': 'none' }, svg), u = Math.min(14, 250 / (item.a + item.b)), V = [180, 176], th = item.ask === 'max' ? 140 : 30, A = angP(V, 0, item.b * u), B = angP(V, th, item.a * u);
    geoLine(g, V[0], V[1], A[0], A[1], { color: PF.a, w: 5 }); geoLine(g, V[0], V[1], B[0], B[1], { color: PF.b, w: 5 }); geoLine(g, A[0], A[1], B[0], B[1], { color: PF.q, w: 3, dash: '7 5' });
    pfLab(g, (V[0] + A[0]) / 2, V[1] + 22, MS(String(item.b)), { fs: 15 }); const mb = [(V[0] + B[0]) / 2, (V[1] + B[1]) / 2]; pfLab(g, mb[0] - 4, mb[1] - 10, MS(String(item.a)), { fs: 15 });
    const mq = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2]; pfLab(g, mq[0], mq[1] - 10, '؟', { col: PF.q, fs: 18 }); [V, A, B].forEach(P => pfDot(g, P));
    if (tries >= 3) ciEq(helpG(svg), 180, 238, item.ask === 'max' ? `${item.a} + ${item.b} = ${item.a + item.b}` : `${Math.max(item.a, item.b)} − ${Math.min(item.a, item.b)} = ${Math.abs(item.a - item.b)}`, PF.hl, 17); return {}; },
  h2: async (item, ctx) => { const m = helpG(ctx.svg), u = Math.min(14, 250 / (item.a + item.b)), y = 212;   /* المستوى الثاني رسمٌ: العودان على استقامة (أطول ما يبلغه الضلع الثالث، أو أقصره)؛ المراجع B، 8 */
    if (item.ask === 'max') { const T = (item.a + item.b) * u, X0 = 180 - T / 2; geoLine(m, X0, y, X0 + item.b * u, y, { color: PF.a, w: 5 }); geoLine(m, X0 + item.b * u, y, X0 + T, y, { color: PF.b, w: 5 }); [X0, X0 + item.b * u, X0 + T].forEach(x => pfDot(m, [x, y])); }
    else { const Lg = Math.max(item.a, item.b), Sh = Math.min(item.a, item.b), cL = item.b >= item.a ? PF.a : PF.b, cS = item.b >= item.a ? PF.b : PF.a, X0 = 180 - Lg * u / 2;
      geoLine(m, X0, y, X0 + Lg * u, y, { color: cL, w: 5 }); geoLine(m, X0 + Lg * u, y + 7, X0 + (Lg - Sh) * u, y + 7, { color: cS, w: 4 }); geoLine(m, X0, y - 7, X0 + (Lg - Sh) * u, y - 7, { color: PF.q, w: 3, dash: '5 4' }); [X0, X0 + Lg * u].forEach(x => pfDot(m, [x, y])); }
    ciRule(m, 180, 34, labelText(item.ask === 'max' ? 'pfRuleMax' : 'pfRuleMin'), PF.hl, 15); await sleep(FAST ? 10 : 250); },
  pick: (item, ctx) => { const np = numberPick(shuffle(item.nums), item.want, { west: true }); ctx.np = np; return np.p; },
  errOf: (it, k) => k === it.eq ? 'ineqEqual' : 'ineqRangeOff' });

/* ================= ⑤ القطع الذكية (C402): sets [ثلاث ثلاثيات، واحدة فقط تصنع مثلثاً] ================= */
ITEM.ineqPick = cpItem({ H: 246, tLine: 'gen.pf.together.pick', hint: 'gen.pf.hint.ineq', rLine: 'gen.pf.reveal.pick', praise: 'praiseThink',
  make: s => { const ok = s.sets.filter(ineqOk); /*T*/if (TESTHOOK && ok.length !== 1) testBug('ineqPick: ليست ثلاثية واحدة تصنع مثلثاً');/*/T*/ return { want: s.sets.findIndex(ineqOk) + '', tag: 'ineq-pick' }; },
  draw(svg, item, tries) { const g = el('g', { 'pointer-events': 'none' }, svg), X = [288, 180, 72]; item.sets.forEach((st, i) => { const u = Math.min(9, 92 / Math.max(...st)), sorted = [...st].sort((x, y) => x - y);
      el('rect', { x: X[i] - 52, y: 52, width: 104, height: 140, rx: 12, fill: PF.card, stroke: PF.edge, 'stroke-width': 2 }, g); pfLab(g, X[i], 76, labelText('pfSet.' + i), { fs: 15 });
      sorted.forEach((v, j) => { const y = 104 + j * 28; geoLine(g, X[i] - v * u / 2, y, X[i] + v * u / 2, y, { color: [PF.b, PF.a, PF.par][j], w: 6 }); pfLab(g, X[i], y + 17, MS(String(v)), { fs: 14 }); });
      if (tries >= 3) { const [a, b, c] = sorted; ciEq(helpG(svg), X[i], 212, `${a} + ${b} ؟ ${c}`, PF.hl, 14); } }); return {}; },
  h2: async (item, ctx) => { const m = helpG(ctx.svg), X = [288, 180, 72];   /* المستوى الثاني رسمٌ: القصيران على الطويل من طرفيه، يتداخلان أو تبقى فجوة (المراجع B، 8) */
    item.sets.forEach((st, i) => { const u = Math.min(9, 92 / Math.max(...st)), [a, b, c] = [...st].sort((x, y) => x - y), L = X[i] - c * u / 2, R = X[i] + c * u / 2, y = 160;
      geoLine(m, L, y - 3.5, L + a * u, y - 3.5, { color: PF.b, w: 3.5 }); geoLine(m, R, y + 3.5, R - b * u, y + 3.5, { color: PF.a, w: 3.5 }); });   /* على الطويل نفسه: نصفه الأعلى والأسفل، لا على أعداد الأعواد */
    ciRule(m, 180, 32, labelText('pfRuleIneq'), PF.hl, 15); await sleep(FAST ? 10 : 250); },
  pick: item => choosePick(item.sets.map((st, i) => [String(i), labelText('pfSet.' + i), '<i></i>', 'gen.pf.set.' + i]), item.want),
  errOf: (it, k) => { const [a, b, c] = [...it.sets[+k]].sort((x, y) => x - y); return a + b === c ? 'ineqEqual' : 'ineqTwoOnly'; } });

/* ================= ⑥ كم مثلثاً من رأس واحد؟ (C411): n ================= */
ITEM.polyTri = cpItem({ H: 262, tLine: 'gen.pf.together.polyTri', hint: 'gen.pf.hint.polyTri', rLine: 'gen.pf.reveal.polyTri', rSay: it => S(numw(it.want), { append: true }), num: true, praise: 'praiseThink',
  make: s => ({ want: s.n - 2, nums: [s.n - 2, s.n, s.n - 1], tag: 'poly-tri' }),
  draw(svg, item, tries) { const g = el('g', {}, svg); polyFig(g, item.n, { cy: 116, r: 84, diag: tries >= 3 }); pfLab(svg, 330, 34, labelText('pfSides') + ' ' + MS(String(item.n)), { fs: 15, anchor: 'start' }); return { g }; },
  h2: async (item, ctx) => { const m = helpG(ctx.svg), { P } = polyFig(el('g', { opacity: 0 }, m), item.n, { cy: 116, r: 84 }); geoLine(m, P[0][0], P[0][1], P[2][0], P[2][1], { color: PF.hl, w: 3, dash: '6 5' });   /* المستوى الثاني رسمٌ: القطر الأول من الرأس (D286 (3)) */
    ciRule(m, 180, 230, labelText('pfRuleTri'), PF.hl, 15); await sleep(FAST ? 10 : 250); },
  show: async (item, ctx) => { if (ctx && ctx.g) { ctx.g.innerHTML = ''; polyFig(ctx.g, item.n, { cy: 116, r: 84, diag: true }); } },
  pick: (item, ctx) => { const np = numberPick(shuffle(item.nums), item.want, { west: true }); ctx.np = np; return np.p; },
  errOf: (it, k) => k === it.n ? 'polyTriN' : 'polyTriN1' });

/* ================= ⑦ مجموع زوايا المضلع (C411): n؛ الجواب (n − 2) × 180 ================= */
ITEM.polySum = cpItem({ H: 262, tLine: 'gen.pf.together.polySum', hint: 'gen.pf.hint.polySum', rLine: 'gen.pf.reveal.polySum', rSay: it => sayDeg(it.want), num: true, praise: 'praiseThink',
  make: s => { const want = (s.n - 2) * 180; return { want, nums: [want, s.n === 4 ? 540 : 360, s.n * 180].filter((v, i, X) => X.indexOf(v) === i).concat(s.n === 4 ? [180] : []).slice(0, 3), tag: 'poly-sum' }; },
  draw(svg, item, tries) { const g = el('g', {}, svg); polyFig(g, item.n, { cy: 116, r: 84 }); if (tries >= 2) { polyFig(helpG(svg), item.n, { cy: 116, r: 84, diag: true }); ciRule(helpG(svg), 180, 230, labelText('pfRuleSum'), PF.hl, 15); } pfLab(svg, 330, 34, labelText('pfSides') + ' ' + MS(String(item.n)), { fs: 15, anchor: 'start' });
    if (tries >= 3) ciEq(helpG(svg), 104, 34, `${item.n - 2} × 180 = ؟`, PF.hl, 16); return { g }; },   /* فوق يساراً، وبطاقة المستوى الثاني تحت، وعدد الأضلاع فوق يميناً */
  h2: async (item, ctx) => { ciRule(helpG(ctx.svg), 180, 230, labelText('pfRuleSum'), PF.hl, 15); await sleep(FAST ? 10 : 250); },
  pick: (item, ctx) => { const np = numberPick(shuffle(item.nums), item.want, { west: true, word: degw }); ctx.np = np; return np.p; },
  errOf: (it, k) => k === 360 ? 'poly360' : k === it.n * 180 ? 'polyN180' : 'polySumOff' });

/* ================= ⑧ المضلع المنتظم (C411): n، ask in (الداخلية) | ex (الخارجية، تكملتها) ================= */
ITEM.polyReg = cpItem({ H: 262, tLine: 'gen.pf.together.polyReg', hint: 'gen.pf.hint.regIn', rLine: 'gen.pf.reveal.polyReg', rSay: it => sayDeg(it.want), num: true, praise: 'praiseThink',
  make: s => { const inn = (s.n - 2) * 180 / s.n, ex = 360 / s.n, want = s.ask === 'in' ? inn : ex; return { inn, ex, want, nums: s.ask === 'in' ? [inn, ex, (s.n - 2) * 180] : [ex, inn, 180 / s.n === ex ? ex + 10 : 180 / s.n], tag: 'poly-reg-' + s.ask }; },
  draw(svg, item, tries) { const g = el('g', {}, svg), { P } = polyFig(g, item.n, { cy: 120, r: 80, fill: 'rgba(47,127,193,.12)' }), n = item.n, A = P[1], prev = P[0], next = P[2];
    if (item.ask === 'in') pfAng(g, A, prev, next, { col: PF.q, r: 22, lab: '؟', dl: 14, fs: 16 });
    else { const E = [A[0] + (A[0] - prev[0]) * .55, A[1] + (A[1] - prev[1]) * .55]; geoLine(g, A[0], A[1], E[0], E[1], { color: PF.ink, w: 3, dash: '6 4' }); pfAng(g, A, E, next, { col: PF.q, r: 22, lab: '؟', dl: 14, fs: 16 }); }
    pfLab(svg, 330, 34, labelText('pfReg') + ' ' + MS(String(n)), { fs: 15, anchor: 'start' });
    if (tries >= 3) ciEq(helpG(svg), 104, 34, item.ask === 'in' ? `${(n - 2) * 180} ÷ ${n} = ؟` : `180 − ${item.inn} = ؟`, PF.hl, 17); return {}; },   /* الخارجة تكملة الداخلية، بلا مصطلحٍ جديد (المراجع A لبوابة M4-U1/U2، 28) */
  h2: async (item, ctx) => { polyRegH2(ctx.svg, item); await sleep(FAST ? 10 : 250); },
  pick: (item, ctx) => { const np = numberPick(shuffle(item.nums), item.want, { west: true, word: degw }); ctx.np = np; return np.p; },
  errOf: (it, k) => it.ask === 'in' ? (k === it.ex ? 'polyExIn' : 'polyTotal') : (k === it.inn ? 'polyExIn' : 'polyRegOff') });
/* المستوى الثاني رسمٌ: الداخلية بمثلثات الرأس الواحد (المجموع)، والخارجة بالمستقيمة عند الرأس (تكمل الداخلية)؛ المراجع B، 8 */
function polyRegH2(svg, item) { const m = helpG(svg);
  if (item.ask === 'in') polyFig(el('g', {}, m), item.n, { cy: 120, r: 80, diag: true });
  else { const P = polyPts(item.n, 180, 120, 80, item.n % 2 ? 90 : 90 + 180 / item.n), A = P[1], E = [A[0] + (A[0] - P[0][0]) * .55, A[1] + (A[1] - P[0][1]) * .55], a1 = pfDir(A, P[0]), dn = pfDir(A, P[2]), s0 = (dn - a1 + 360) % 360 < 180 ? a1 : a1 + 180;
    el('path', { d: angArc(A, 36, s0, s0 + 180), fill: 'none', stroke: PF.hl, 'stroke-width': 3, 'stroke-dasharray': '6 5', 'pointer-events': 'none' }, m); }
  ciRule(m, 180, 230, labelText(item.ask === 'in' ? 'pfRuleRegIn' : 'pfRuleRegEx'), PF.hl, 15); }
ITEM.polyReg.hint2 = async (item, r) => { if (r && r.ctx && r.ctx.svg) polyRegH2(r.ctx.svg, item); await S(item.ask === 'in' ? 'gen.pf.hint.regIn' : 'gen.pf.hint.regEx'); };

/* ================= ⑨ شبه المنحرف متساوي الساقين (C178): a زاوية القاعدة السفلى، ask base (الأخرى عليها) | top ================= */
function isoTrapAt(g, a, o = {}) { const y1 = o.y1 ?? 70, y2 = o.y2 ?? 178, h = y2 - y1, dx = h / Math.tan(a * Math.PI / 180), w2 = o.w2 ?? 128, B1 = [180 - w2, y2], B2 = [180 + w2, y2], T1 = [B1[0] + dx, y1], T2 = [B2[0] - dx, y1];
  el('polygon', { points: polyStr([B1, B2, T2, T1]), fill: 'rgba(84,170,214,.16)', stroke: PF.ink, 'stroke-width': 3.4, 'stroke-linejoin': 'round', 'pointer-events': 'none' }, g);
  for (const [P, Q] of [[B1, T1], [B2, T2]]) { const M = [(P[0] + Q[0]) / 2, (P[1] + Q[1]) / 2], d = Math.hypot(Q[0] - P[0], Q[1] - P[1]), ux = (Q[0] - P[0]) / d, uy = (Q[1] - P[1]) / d; geoLine(g, M[0] + uy * 8, M[1] - ux * 8, M[0] - uy * 8, M[1] + ux * 8, { color: PF.q, w: 2.6 }); }
  if (o.axis) geoLine(o.axisG || g, 180, y1 - 16, 180, y2 + 12, { color: PF.par, w: 2.4, dash: '6 5' });
  [B1, B2, T1, T2].forEach(P => pfDot(g, P)); return { B1, B2, T1, T2 }; }
ITEM.isoTrap = cpItem({ H: 262, tLine: 'gen.pf.together.trap', hint: 'gen.pf.hint.trap', rLine: 'gen.pf.reveal.trap', rSay: it => sayDeg(it.want), num: true, praise: 'praiseThink',
  make: s => { const want = s.ask === 'base' ? s.a : 180 - s.a, n3 = 90 - s.a > 0 && 90 - s.a !== s.a ? 90 - s.a : s.a + 20; return { want, nums: s.ask === 'base' ? [s.a, 180 - s.a, n3] : [180 - s.a, s.a, 360 - s.a], tag: 'iso-trap-' + s.ask }; },   /* ثلاثة خيارات مختلفة (45: 90 − 45 = 45؛ المراجع B لبوابة M4-U1/U2، 5) */
  draw(svg, item, tries) { const g = el('g', {}, svg), Q = isoTrapAt(g, item.a, { axis: tries >= 2, axisG: tries >= 2 ? helpG(svg) : null }); if (tries >= 2) ciRule(helpG(svg), 180, 34, labelText(item.ask === 'base' ? 'pfRuleTrap' : 'pfRuleTrapTop'), PF.hl, 15);
    pfAng(g, Q.B1, Q.B2, Q.T1, { col: PF.a, r: 26, deg: item.a, dl: 20, fs: 16 });
    const q = item.ask === 'base' ? pfAng(g, Q.B2, Q.T2, Q.B1, { col: PF.q, r: 26, lab: '؟', dl: 16, fs: 16 }) : pfAng(g, Q.T1, Q.B1, Q.T2, { col: PF.q, r: 24, lab: '؟', dl: 16, fs: 16 });
    if (tries >= 3) { if (item.ask === 'base') ciRule(helpG(svg), 180, 238, labelText('pfTrapEq'), PF.hl, 15); else ciEq(helpG(svg), 180, 238, `180 − ${item.a} = ؟`, PF.hl, 16); } return { q }; },
  h2: async (item, ctx) => { ciRule(helpG(ctx.svg), 180, 34, labelText(item.ask === 'base' ? 'pfRuleTrap' : 'pfRuleTrapTop'), PF.hl, 15); await sleep(FAST ? 10 : 250); },
  show: async (item, ctx) => { if (ctx && ctx.q) arSetDeg(ctx.q, item.want, PF.ok); },
  pick: (item, ctx) => { const np = numberPick(shuffle(item.nums), item.want, { west: true, word: degw }); ctx.np = np; return np.p; },
  errOf: (it, k) => it.ask === 'base' ? (k === 180 - it.a ? 'trapSupp' : 'trapOff') : (k === it.a ? 'trapTopSame' : 'trapOff') });

/* ================= ⑩ بنّاء المضلعات (C411): sum (مجموع مطلوب)؛ زرّان يغيّران عدد الأضلاع، والمثلثات تُرسم بلا مجموع ================= */
ITEM.polyBuild = {
  make(spec) { const want = spec.sum / 180 + 2; /*T*/if (TESTHOOK && (want % 1 || want < 3 || want > 10)) testBug('polyBuild: المجموع لا يصنع مضلعاً بين 3 و10 أضلاع');/*/T*/ return { ...spec, want, tag: 'poly-build' }; },
  async ask(item, mode, tries) { const svg = m3Stage(300), host = el('g', {}, svg); let n = item.start || 4, reg = null; const lo = 3, hi = 10;
    const draw = () => { host.innerHTML = ''; const { P } = polyFig(host, n, { cy: 128, r: 82, diag: true });
      if (tries >= 2) { const m = el('g', { 'data-help': 1, 'pointer-events': 'none' }, host), T = [P[0], P[1], P[2]], C = [(T[0][0] + T[1][0] + T[2][0]) / 3, (T[0][1] + T[1][1] + T[2][1]) / 3];   /* المستوى الثاني رسمٌ: مثلثٌ واحد بحدوده ومجموعه ١٨٠، يتبع عدد الأضلاع (المراجع B، 8) */
        el('polygon', { points: polyStr(T), fill: 'rgba(242,201,76,.22)', stroke: PF.hl, 'stroke-width': 3, 'stroke-dasharray': '6 4', 'stroke-linejoin': 'round' }, m); degText(m, C[0], C[1] + 6, 180, { size: 15, color: PF.ink }); }
      pfLab(host, 330, 30, labelText('pfSides') + ' ' + MS(String(n)), { fs: 15, anchor: 'start' }); pfLab(host, 30, 30, labelText('pfTris') + ' ' + MS(String(n - 2)), { fs: 15, anchor: 'end' });
      /*T*/window.__cdV = n; window.__cdWant = item.want;/*/T*/ if (reg) reg(); };
    draw(); if (tries >= 2) ciRule(helpG(svg), 180, 222, labelText('pfRuleSum'), PF.hl, 15);
    const btns = svgSteppers(svg, [[44, 262], [316, 262]], d => { n = Math.max(lo, Math.min(hi, n + d)); SFX.tick(); draw(); }, { key: 'cd', labels: ['pfFewer', 'pfMore'] });
    if (tries >= 3) await S('gen.pf.together.build'); else { await S(item.q || 'gen.pf.q.build', { noGap: true }); await sayDeg(item.sum); }
    const t = item.want, tap = b => b.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    const fin = rulDone(() => { reg = null; btns.forEach(b => { b.onclick = null; b.onkeydown = null; b.removeAttribute('role'); }); });
    reg = () => AUTO({ kind: 'compass', ok: () => n === t ? rulDoneBtn().click() : tap(btns[n < t ? 1 : 0]), wrong: () => { const w = t + 1 <= hi ? t + 1 : t - 1; if (n === w) rulDoneBtn().click(); else tap(btns[n < w ? 1 : 0]); } }); reg(); await fin;
    return { ans: n, ctx: { svg } }; },
  judge(item, k) { return k === item.want ? { ok: true } : { ok: false, err: k === item.sum / 180 ? 'polyTriN' : 'polyBuildOff' }; },
  onOk() { SFX.good(); }, onWrong() { SFX.soft(); },
  async hint2(item, r) { if (r && r.ctx && r.ctx.svg) ciRule(helpG(r.ctx.svg), 180, 222, labelText('pfRuleSum'), PF.hl, 15); await S('gen.pf.hint.build'); }, async together() {},   /* والرسم في المحاولة التالية يتبع عدد الأضلاع (ask) */
  async reveal(item) { await S('gen.pf.reveal.build', { noGap: true }); await S(numw(item.want), { append: true }); },
  praise: () => 'praiseThink', twin(item) { return item.twin || null; } };

/* صورة بند التعليل في الوحدة (reasonPic بـ kind pfpic): fig شكل برهان، أو ineq [أطوال]، أو poly n، أو trap a، أو tri3 (ثلاثة مثلثات مقيسة)؛ f معادلة تحت الشكل */
function pfReasonPic(g, P) { const sc = el('g', {}, g);
  if (P.fig) pfFig(sc, P.fig, { y0: 20, s: 1.05, par: P.par, v: P.v });
  else if (P.ineq) ineqSticks(sc, P.ineq, { y: 150, u: 22, meet: P.meet });
  else if (P.poly) polyFig(sc, P.poly, { cy: 100, r: 76, diag: !!P.diag });
  else if (P.trap) { const Q = isoTrapAt(sc, P.trap, { y1: 50, y2: 150, axis: !!P.axis }); pfAng(sc, Q.B1, Q.B2, Q.T1, { col: PF.a, r: 24, deg: P.trap, dl: 18, fs: 14 }); }
  else if (P.cg) { cgTri(sc, P.cg[0], { cx: 268, y: 160, u: P.u || 13 }); cgTri(sc, P.cg[1], { cx: 92, y: 160, u: P.u || 13, col: CG.b, fill: CG.fb, rot: P.rot || 0 }); }   /* M4-U3 */
  else if (P.cs) preCaseTris(sc, P.cs, P.v || 0);
  else if (P.sim) { const mx = Math.max(...P.sim.a, ...P.sim.b), u = Math.min(22, 120 / mx); simShape(sc, P.sim.fig, P.sim.a, { cx: 262, y: 160, u, col: CG.a, fill: CG.fa }); simShape(sc, P.sim.fig, P.sim.b, { cx: 96, y: 160, u, col: CG.b, fill: CG.fb }); }
  else if (P.trapD) { const Q = isoTrapAt(sc, P.trapD, { y1: 50, y2: 150 }); geoLine(sc, Q.B1[0], Q.B1[1], Q.T2[0], Q.T2[1], { color: CG.c, w: 2.6 }); geoLine(sc, Q.B2[0], Q.B2[1], Q.T1[0], Q.T1[1], { color: CG.c, w: 2.6 }); }
  else if (P.qd) pfFig(sc, P.qd, { y0: 30, s: 1, v: P.v });   /* v: حروفٌ أخرى (PF_LMAP)، فصورة التقييم ليست صورة المشهد */
  else if (P.py) (PF_GENERIC.includes(P.py) ? pfFig : pyFig)(sc, P.py, { y0: 20, s: 1, ...P });
  else if (P.c4) c4Pic(sc, P.c4);   /* M4-U5 */
  else if (P.ci4) c6Pic(sc, P.ci4);   /* M4-U6 */
  else if (P.c7) c7Pic(sc, P.c7);   /* M4-U7 */
  else if (P.c8) c8Pic(sc, P.c8);   /* M4-U8 */
  else if (P.c9) c9Pic(sc, P.c9);   /* M4-U9 */
  else if (P.tri3) [[70, 0], [180, 1], [284, 2]].forEach(([x, i]) => { const S3 = [[[x - 48, 140], [x + 48, 140], [x - 10, 70]], [[x - 50, 140], [x + 44, 140], [x + 26, 86]], [[x - 40, 140], [x + 50, 140], [x - 30, 60]]][i];
      el('polygon', { points: polyStr(S3), fill: 'rgba(122,79,176,.08)', stroke: PF.ink, 'stroke-width': 3, 'stroke-linejoin': 'round', 'pointer-events': 'none' }, sc); pfLab(sc, x, 166, MS('180'), { fs: 15, col: PF.a }); });
  if (P.f) ciEq(g, 180, 200, P.f, P.bad ? SO.bad : SO.ink, 18); }

/* ================= المشاهد ================= */
const pfSay = async (L, i) => { if (L[i]) await S(L[i]); };
/* خطوات البرهان تُكتب واحدةً بعد واحدة تحت الشكل، وكلّ جملةٍ تُقال معها */
async function pfWrite(g, k, L, from, y0 = 129, o = {}) { for (let n = 0; n < 3; n++) { pfStep(g, y0 + n * 39, k, n, { fs: 14, two: true, v: o.v }); SFX.tick(); if (L[from + n]) await S(L[from + n]); else await sleep(FAST ? 1 : 500); } }
/* إشعالٌ بصورة من صور التعليل (c.pic) ثم جمله */
SCENES.pfPicHook = async c => { const L = c.lines, svg = m3Stage(250), g = el('g', { 'pointer-events': 'none' }, svg); pfReasonPic(g, c.pic || {}); for (const l of L) await S(l); };
/* د1 الإشعال: فوضى قاست ثلاثة مثلثات */
SCENES.pfHook = async c => { const L = c.lines, svg = m3Stage(250), g = el('g', { 'pointer-events': 'none' }, svg); pfReasonPic(g, { tri3: true }); await pfSay(L, 0);
  const q = pfLab(g, 180, 216, labelText('pfAnyTri'), { fs: 17, col: PF.q }); SFX.tick(); for (const l of L.slice(1)) await S(l); };
/* د1 الاكتشاف: المستقيم الموازي عند الرأس، وزاويتا التبادل، والمستقيم 180، ثم الخطوات الثلاث بأسبابها */
SCENES.pfTriShow = async c => { const L = c.lines, svg = m3Stage(262); let g = el('g', { 'pointer-events': 'none' }, svg);
  pfFig(g, 'tri', { y0: 10, s: .8, par: false }); await pfSay(L, 0);
  g.remove(); g = el('g', { 'pointer-events': 'none' }, svg); pfFig(g, 'tri', { y0: 10, s: .8, parDash: true }); SFX.tick(); await pfSay(L, 1);
  await pfWrite(g, 'tri', L, 2, 136); for (const l of L.slice(5)) await S(l); };
/* د2: المتقابلتان بالرأس بالمكمّلة المشتركة */
SCENES.pfVertShow = async c => { const L = c.lines, svg = m3Stage(262), g = el('g', { 'pointer-events': 'none' }, svg); pfFig(g, 'vert', { y0: 0, s: .88 }); await pfSay(L, 0); await pfWrite(g, 'vert', L, 1); for (const l of L.slice(4)) await S(l); };
/* د2: زاويتا التبادل من مسلّمة التناظر والمتقابلة بالرأس، والمتحالفتان */
SCENES.pfAltShow = async c => { const L = c.lines, svg = m3Stage(262); let g = el('g', { 'pointer-events': 'none' }, svg); pfFig(g, 'alt', { y0: 4, s: 1 }); await pfSay(L, 0); await pfWrite(g, 'alt', L, 1);
  if (c.coint) { g.remove(); g = el('g', { 'pointer-events': 'none' }, svg); pfFig(g, 'coint', { y0: 4, s: 1 }); await pfWrite(g, 'coint', L, 4); }
  for (const l of L.slice(c.coint ? 7 : 4)) await S(l); };
/* د3 الإشعال: أعواد فوضى 2 و3 و8 لا تلتقي، ثم 4 و5 و6 تلتقي */
SCENES.ineqShow = async c => { const L = c.lines, svg = m3Stage(250); let g = el('g', { 'pointer-events': 'none' }, svg);
  for (const [i, s] of (c.sets || [[2, 3, 8], [4, 5, 6]]).entries()) { g.remove(); g = el('g', { 'pointer-events': 'none' }, svg); ineqSticks(g, s, { arcs: true, meet: true, u: 26 }); SFX.tick(); await pfSay(L, i); }
  if (c.rule) ciRule(g, 180, 34, labelText('pfRuleIneq'), PF.ok, 15); for (const l of L.slice((c.sets || [0, 0]).length)) await S(l); };
/* د3 الاكتشاف (ب): الطريق عبر ب أطول من القطعة أ ج */
SCENES.ineqProof = async c => { const L = c.lines, svg = m3Stage(262), g = el('g', { 'pointer-events': 'none' }, svg); pfFig(g, 'ineq', { y0: 8, s: .9 }); await pfSay(L, 0); await pfWrite(g, 'ineq', L, 1); for (const l of L.slice(4)) await S(l); };
/* د4 الإشعال والاكتشاف: «الخماسي 360!»، ثم التقسيم من رأس واحد، وجدول ن − 2 */
SCENES.polyShow = async c => { const L = c.lines, svg = m3Stage(262); let g = el('g', { 'pointer-events': 'none' }, svg);
  polyFig(g, 5, { cy: 112, r: 84 }); await pfSay(L, 0); for (const l of L.slice(1)) await S(l); };   /* الإشعال يقف عند السؤال: التقسيم وعدد المثلثات بعد التوقّع (المراجع A لبوابة M4-U1/U2، 14) */
SCENES.polyTable = async c => { const L = c.lines, svg = m3Stage(262), g = el('g', { 'pointer-events': 'none' }, svg), X = [258, 192, 126, 62];   /* داخل الإطار، وعمود التسميات يمينها */
  [3, 4, 5, 6].forEach((n, i) => { const sg = el('g', {}, g); polyFig(sg, n, { cx: X[i], cy: 74, r: 34, diag: true }); pfLab(g, X[i], 136, MS(String(n)), { fs: 15 }); pfLab(g, X[i], 166, MS(String(n - 2)), { fs: 15, col: PF.c }); degText(g, X[i], 198, (n - 2) * 180, { size: 15, color: PF.ok }); });
  pfLab(g, 334, 136, labelText('pfRowSides'), { fs: 12, anchor: 'start' }); pfLab(g, 334, 166, labelText('pfRowTris'), { fs: 12, anchor: 'start' });
  await pfSay(L, 0); ciRule(g, 180, 232, labelText('pfRuleSum'), PF.ok, 15); for (const l of L.slice(1)) await S(l); };
/* د4 (ب): المنتظم والخارجية، و(ج) شبه المنحرف متساوي الساقين بمحوره */
SCENES.regExShow = async c => { const L = c.lines, svg = m3Stage(250), g = el('g', { 'pointer-events': 'none' }, svg), { P } = polyFig(g, 6, { cy: 120, r: 80 }), A = P[1], E = [A[0] + (A[0] - P[0][0]) * .6, A[1] + (A[1] - P[0][1]) * .6];
  pfAng(g, A, P[0], P[2], { col: PF.a, r: 24, deg: 120, dl: 16 }); await pfSay(L, 0); geoLine(g, A[0], A[1], E[0], E[1], { color: PF.ink, w: 3, dash: '6 4' }); pfAng(g, A, E, P[2], { col: PF.b, r: 30, deg: 60, dl: 18 }); SFX.tick(); await pfSay(L, 1); for (const l of L.slice(2)) await S(l); };
SCENES.trapShow = async c => { const L = c.lines, svg = m3Stage(250), g = el('g', { 'pointer-events': 'none' }, svg), Q = isoTrapAt(g, 70, { axis: true });
  pfAng(g, Q.B1, Q.B2, Q.T1, { col: PF.a, r: 26, deg: 70, dl: 18 }); await pfSay(L, 0); pfAng(g, Q.B2, Q.T2, Q.B1, { col: PF.a, r: 26, deg: 70, dl: 18 }); SFX.tick(); await pfSay(L, 1);
  pfAng(g, Q.T1, Q.B1, Q.T2, { col: PF.b, r: 22, deg: 110, dl: 16 }); pfAng(g, Q.T2, Q.T1, Q.B2, { col: PF.b, r: 22, deg: 110, dl: 16 }); for (const l of L.slice(2)) await S(l); };
WRAP_ART.proofArt = svg => { const g = el('g', { 'pointer-events': 'none' }, svg); pfFig(g, 'tri', { y0: 60, s: 1.1 }); };
