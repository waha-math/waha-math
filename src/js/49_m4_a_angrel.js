/* =====================================================================
   M4-U1 «علاقات الزوايا والقاطع» (المرحلة 4 «المخترعون»، المرجع reference/03_المناهج_والوحدات/M4_U1_علاقات_الزوايا_والقاطع.md، نسخة 1.2)
   د1 المتتامتان (90) والمتكاملتان (180) والمجهولة بالطرح (C413 أ) · د2 المتقابلتان بالرأس (C413 ب)
   د3 القاطع والمتناظرتان ومسلّمة التناظر (C404 أ) · د4 زوايا التبادل من التناظر والمتقابلة بالرأس، والمتحالفتان 180 (C404 ب)
   (د3 في المرجع ست أفكار ⚠ فوق السقف، فقُسِم درسين، D244) · د5 مشروع «جسر الزوايا» · د6 المراجعة والاختبار
   الزوايا مضاعفات 5 (جمل gen.deg.*)، والقياس يؤكّد ولا يبرهن: البرهان المكتوب في U2.
   ترقيم زوايا القاطع: عند المستقيم الأعلى 1 (فوق، يسار القاطع) و2 (فوق، يمينه) و3 (تحت، يساره) و4 (تحت، يمينه)، وعند الأسفل 5 و6 و7 و8 بالترتيب نفسه.
   ===================================================================== */
const AR = { line: '#24323a', tr: '#7a4fb0', par: '#2f7fc1', a: '#2f9d6b', b: '#d9822b', q: '#c0392b', ok: SO.ok, bad: SO.bad, hl: SO.hl, soft: '#e8f1fb' };
/* قوس زاوية بين اتجاهين (درجات الرياضيات) مع رقمها أو قياسها */
function arArc(g0, V, a1, a2, o = {}) { const g = el('g', { 'pointer-events': 'none' }, g0), r = o.r || 24, col = o.col || AR.a, p = el('path', { d: angArc(V, r, a1, a2), fill: 'none', stroke: col, 'stroke-width': o.w || 3.4, 'pointer-events': 'none' }, g);
  if (o.fill) el('path', { d: `M${V[0]} ${V[1]} L${angP(V, a1, r)[0]} ${angP(V, a1, r)[1]} ${angArc(V, r, a1, a2).replace(/^M[^A]*/, '')} Z`, fill: col, opacity: .18, 'pointer-events': 'none' }, g);
  let t = null; const m = angP(V, (a1 + a2) / 2, r + (o.dl || 16));
  if (o.deg != null) t = degText(g, m[0], m[1] + 6, o.deg, { size: o.fs || 16, color: o.labCol || col });
  else if (o.lab != null) { t = el('text', { x: m[0], y: m[1] + 6, 'text-anchor': 'middle', 'font-size': o.fs || 16, 'font-weight': 800, fill: o.labCol || col, stroke: '#fff', 'stroke-width': 4, 'paint-order': 'stroke', 'pointer-events': 'none' }, g); t.textContent = o.lab; }
  return { p, t, m, g, sg: g, fs: o.fs || 16 }; }
/* «؟» يصير قياساً بدائرة الدرجة (خط القراءة بلا «°»، D256) */
const arSetDeg = (q, deg, col) => { if (!q || !q.t) return; q.t.remove(); q.t = degText(q.g, q.m[0], q.m[1] + 6, deg, { size: q.fs, color: col }); };
const arNum = n => MS(String(n));
/* مستقيمان متقاطعان في V: الأول أفقي، والثاني باتجاه th؛ الزوايا 1..4 عكس عقارب الساعة من اليمين */
const AR_X = th => [[0, th], [th, 180], [180, 180 + th], [180 + th, 360]];
/* طول نصف المستقيم من V في الاتجاه d حتى حافّة الإطار الورقي (x 20..340، y 14..H−14) بهامش: المستقيم لا نهاية له، فيُقصّ عند الورقة ولا يخرج عنها (المراجعان لبوابة M4-U1/U2) */
function frameReach(g, V, d, L) { const s = g.ownerSVGElement || g, fr = s && s.querySelector ? s.querySelector('rect[x="20"][y="14"][rx="14"]') : null; if (!fr) return L;
  const x0 = 27, x1 = 333, y0 = 21, y1 = 14 + (+fr.getAttribute('height')) - 7, c = Math.cos(d * Math.PI / 180), sn = -Math.sin(d * Math.PI / 180); let t = L;
  if (c > 1e-6) t = Math.min(t, (x1 - V[0]) / c); else if (c < -1e-6) t = Math.min(t, (x0 - V[0]) / c);
  if (sn > 1e-6) t = Math.min(t, (y1 - V[1]) / sn); else if (sn < -1e-6) t = Math.min(t, (y0 - V[1]) / sn);
  return Math.max(0, t); }
function arCross(g, V, th, o = {}) { const L = o.L || 120; for (const d of [0, th]) { const P = angP(V, d, frameReach(g, V, d, L)), Q = angP(V, d + 180, frameReach(g, V, d + 180, L)); geoLine(g, P[0], P[1], Q[0], Q[1], { color: o.col || AR.line, w: 4 }); }
  el('circle', { cx: V[0], cy: V[1], r: 5, fill: ANG.v, stroke: '#fff', 'stroke-width': 2, 'pointer-events': 'none' }, g); return AR_X(th); }
/* القاطع: مستقيمان أفقيان (y1 فوق y2) وقاطع يمرّ بـ (cx، المنتصف) باتجاه phi؛ و tilt يميل المستقيم الأسفل (غير متوازيين) */
function arTrans(g, phi, o = {}) { const y1 = o.y1 ?? 76, y2 = o.y2 ?? 160, cx = o.cx ?? 180, tilt = o.tilt || 0, ym = (y1 + y2) / 2, k = 1 / Math.tan(phi * Math.PI / 180);
  const xAt = y => cx + (ym - y) * k, T = [xAt(y1), y1];
  const lineY = (x, y0, tl) => y0 - (x - cx) * Math.tan(tl * Math.PI / 180);
  geoLine(g, 28, y1, 332, y1, { color: o.parCol || AR.par, w: 4 });
  let B; if (!tilt) { B = [xAt(y2), y2]; geoLine(g, 28, y2, 332, y2, { color: o.parCol || AR.par, w: 4 }); }
  else { const t = Math.tan(tilt * Math.PI / 180); let x = cx; for (let i = 0; i < 30; i++) { const y = y2 - (x - cx) * t; x = xAt(y); } B = [x, y2 - (x - cx) * t]; geoLine(g, 28, lineY(28, y2, tilt), 332, lineY(332, y2, tilt), { color: o.parCol || AR.par, w: 4 }); }
  const P = angP(T, phi, frameReach(g, T, phi, o.ext || 52)), Q = angP(B, phi + 180, frameReach(g, B, phi + 180, o.ext || 52)); geoLine(g, P[0], P[1], Q[0], Q[1], { color: AR.tr, w: 4 });
  if (!tilt && o.marks !== false) for (const y of [y1, y2]) { el('path', { d: `M${300} ${y - 7} l9 7 l-9 7`, fill: 'none', stroke: o.parCol || AR.par, 'stroke-width': 3, 'pointer-events': 'none' }, g); }
  for (const V of [T, B]) el('circle', { cx: V[0], cy: V[1], r: 4.5, fill: ANG.v, stroke: '#fff', 'stroke-width': 2, 'pointer-events': 'none' }, g);
  const t2 = tilt || 0, sec = (V, base) => [[base, phi], [phi, 180 + base], [180 + base, 180 + phi], [180 + phi, 360 + base]];   /* A فوق يمين، B فوق يسار، C تحت يسار، D تحت يمين */
  const ST = sec(T, 0), SB = sec(B, t2), at = n => { const [V, S] = n <= 4 ? [T, ST] : [B, SB], i = [1, 0, 2, 3][(n - 1) % 4]; return { V, a1: S[i][0], a2: S[i][1] }; };
  return { T, B, at }; }
/* قياس الزاوية n على القاطع phi (مستقيمان متوازيان): 2 و3 و6 و7 = phi، والباقية 180 − phi */
const arTrVal = (phi, n) => [2, 3, 6, 7].includes(n) ? phi : 180 - phi;
/* العلاقة بين موضعين على القاطع (للحلّ المشترك بالاسم): كما في build/d240.mjs (arRel) */
const arRelOf = (g, a) => { const s = [g, a].sort((x, y) => x - y).join(','), top = n => n <= 4; if (Math.abs(g - a) === 4) return 'corr'; if (top(g) === top(a)) return ['1,4', '2,3', '5,8', '6,7'].includes(s) ? 'vert' : 'adj';
  return { '3,6': 'altIn', '4,5': 'altIn', '1,8': 'altOut', '2,7': 'altOut', '3,5': 'coint', '4,6': 'coint' }[s] || 'far'; };
const AR_REL = { corr: n => n <= 4 ? n + 4 : n - 4, vert: n => ({ 1: 4, 4: 1, 2: 3, 3: 2 })[(n - 1) % 4 + 1] + (n > 4 ? 4 : 0), altIn: n => ({ 3: 6, 4: 5, 5: 4, 6: 3 })[n], altOut: n => ({ 1: 8, 2: 7, 7: 2, 8: 1 })[n], coint: n => ({ 3: 5, 4: 6, 5: 3, 6: 4 })[n] };

/* ================= ① المتمّمة والمكمّلة (C413): a، kind comp | supp؛ الجواب 90 − a أو 180 − a ================= */
function arAdj(g, a, kind, o = {}) { const V = o.V || [180, 168], L = o.L || 120, tot = kind === 'comp' ? 90 : 180;
  geoLine(g, V[0], V[1], angP(V, 0, L)[0], angP(V, 0, L)[1], { color: AR.line, w: 4 }); const E = angP(V, tot, L); geoLine(g, V[0], V[1], E[0], E[1], { color: AR.line, w: 4 }); const M = angP(V, a, L); geoLine(g, V[0], V[1], M[0], M[1], { color: AR.tr, w: 4 });
  if (kind === 'comp') el('path', { d: `M${V[0] + 12} ${V[1]} L${V[0] + 12} ${V[1] - 12} L${V[0]} ${V[1] - 12}`, fill: 'none', stroke: AR.line, 'stroke-width': 1.6, opacity: .5 }, g);
  arArc(g, V, 0, a, { r: 40, col: AR.a, deg: a, dl: 18 }); const q = arArc(g, V, a, tot, o.showDeg != null ? { r: 30, col: AR.q, deg: o.showDeg, dl: 22 } : { r: 30, col: AR.q, lab: '؟', dl: 22 });
  el('circle', { cx: V[0], cy: V[1], r: 5, fill: ANG.v, stroke: '#fff', 'stroke-width': 2, 'pointer-events': 'none' }, g); return { V, q }; }
ITEM.arComp = cpItem({ H: 236, tLine: 'gen.ar.together.comp', hint: 'gen.ar.hint.comp', rLine: 'gen.ar.reveal.comp', rSay: it => sayDeg(it.want), num: true, praise: 'praiseThink',
  sayQ: async it => { await sayDeg(it.a); await S(it.kind === 'comp' ? 'gen.ar.q.compEnd' : 'gen.ar.q.suppEnd', { append: true }); },
  make: s => { const tot = s.kind === 'comp' ? 90 : 180, want = tot - s.a, alt = s.kind === 'comp' ? 180 - s.a : Math.abs(90 - s.a);   /* المكمّلة من التسعين خطأً: الفرق بين الزاوية والقائمة (المراجع A لبوابة M4-U1/U2، 15) */ return { want, nums: [want, alt > 0 ? alt : s.a + 10, s.kind === 'comp' ? s.a : 360 - s.a].filter((v, i, A) => A.indexOf(v) === i), tag: 'ar-' + s.kind }; },
  draw(svg, item, tries) { const D = arAdj(svg, item.a, item.kind); if (tries >= 3) ciEq(helpG(svg), 180, 30, `${item.kind === 'comp' ? 90 : 180} − ${item.a} = ؟`, AR.hl, 18); return D; },
  h2: async (item, ctx) => { ciRule(helpG(ctx.svg), 180, 30, labelText(item.kind === 'comp' ? 'arRuleComp' : 'arRuleSupp'), AR.hl, 14); await sleep(FAST ? 10 : 250); },
  show: async (item, ctx) => { if (!ctx || !ctx.q) return; ctx.svg.querySelectorAll('[data-help]').forEach(n => n.remove()); arSetDeg(ctx.q, item.want, AR.ok); ciEq(helpG(ctx.svg), 180, 30, `${item.kind === 'comp' ? 90 : 180} − ${item.a} = ${item.want}`, AR.ok, 18); },
  pick: (item, ctx) => { const np = numberPick(shuffle(item.nums.length >= 3 ? item.nums : [...item.nums, item.want + 5]), item.want, { west: true, word: degw }); ctx.np = np; return np.p; },
  errOf: (it, k) => k === (it.kind === 'comp' ? 180 - it.a : Math.abs(90 - it.a)) ? 'arMix' : k === it.a ? 'arSame' : 'arOff' });

/* ② زاويتان: متتامتان أم متكاملتان أم لا هذه ولا تلك؟ (C413): a، b (متلاصقتان adj أو منفصلتان) */
ITEM.arPair = cpItem({ H: 220, tLine: 'gen.ar.together.pair', hint: 'gen.ar.hint.pair', rLine: it => 'gen.ar.reveal.pair.' + it.want, praise: 'praiseThink',
  make: s => ({ want: s.a + s.b === 90 ? 'comp' : s.a + s.b === 180 ? 'supp' : 'none', tag: 'ar-pair' }),
  draw(svg, item, tries) {   /* الزاويتان متجاورتان في الإطار: المنفرجة يمتدّ ضلعها يساراً، فيُحسب عرض كلٍّ ويُصغَّر الشكلان معاً إن لزم (المراجعان لبوابة M4-U1/U2) */
    const w = d => 100 - Math.min(0, 90 * Math.cos(d * Math.PI / 180)), s = Math.min(1, 256 / (w(item.a) + w(item.b))), left = 180 - ((w(item.a) + w(item.b)) * s + 24) / 2;
    [[item.a, left + w(item.b) * s + 24 + (w(item.a) - 100) * s], [item.b, left + (w(item.b) - 100) * s]].forEach(([d, x]) => { const V = [x, 150]; angleAt(svg, V, 0, d, { l1: 100 * s, l2: 90 * s, arc: 'in', r: 28 }); const m = angP(V, d / 2, 50); degText(svg, m[0], m[1] + 6, d, { size: 17, color: AR.a }); });
    if (tries >= 3) ciEq(helpG(svg), 180, 30, `${item.a} + ${item.b} = ؟`, AR.hl, 18); return {}; },
  h2: async (item, ctx) => { ciRule(helpG(ctx.svg), 180, 206, labelText('arRulePair'), AR.hl, 13); await sleep(FAST ? 10 : 250); },
  show: async (item, ctx) => { if (!ctx || !ctx.svg) return; ctx.svg.querySelectorAll('[data-help]').forEach(n => n.remove()); ciEq(helpG(ctx.svg), 180, 30, `${item.a} + ${item.b} = ${item.a + item.b}`, AR.ok, 18); },
  pick: item => choosePick([['comp', labelText('arComp2'), '<i></i>', 'gen.ar.comp2'], ['supp', labelText('arSupp2'), '<i></i>', 'gen.ar.supp2'], ['none', labelText('arNone'), '<i></i>', 'gen.ar.none']], item.want),
  errOf: (it, k) => it.want === 'none' ? 'arSumOff' : k === 'none' ? 'arNone' : 'arMix' });

/* ③ المتقابلتان بالرأس (C413): th، given (1..4) معطاة، ask (1..4) مطلوبة */
ITEM.arVert = cpItem({ H: 250, tLine: 'gen.ar.together.vert', hint: 'gen.ar.hint.vert', rLine: 'gen.ar.reveal.vert', rSay: it => sayDeg(it.want), num: true, praise: 'praiseThink',
  sayQ: async it => { await sayDeg(it.gv); await S(it.opp ? 'gen.ar.q.vertOpp' : 'gen.ar.q.vertAdj', { append: true }); },
  make: s => { const X = AR_X(s.th), val = n => (n % 2 ? s.th : 180 - s.th), gv = val(s.given), want = val(s.ask), opp = (s.given + 2 - 1) % 4 + 1 === s.ask;
    return { gv, want, opp, nums: [want, 180 - want === want ? want + 10 : 180 - want, opp ? 360 - want : (want < 90 ? 90 - want : want - 90) || want + 20], tag: 'ar-vert-' + (opp ? 'opp' : 'adj') }; },
  draw(svg, item, tries) { const g = el('g', {}, svg), V = [180, 128], X = arCross(g, V, item.th), [a1, a2] = X[item.given - 1], [b1, b2] = X[item.ask - 1];
    arArc(g, V, a1, a2, { r: 30, col: AR.a, deg: item.gv, dl: 20, fill: true }); const q = arArc(g, V, b1, b2, { r: 30, col: AR.q, lab: '؟', dl: 20, fill: true });
    if (tries >= 3) ciRule(helpG(svg), 180, 236, labelText('arRelN.' + (item.opp ? 'vert' : 'adj')) + ': ؟', AR.hl, 14); return { q, V }; },   /* الحلّ المشترك بالعلاقة لا بالقيمة (D240، المراجع A لبوابة M4-U1/U2، 6) */
  h2: async (item, ctx) => { ciRule(helpG(ctx.svg), 180, 236, labelText('arRule.vert'), AR.hl, 13); await sleep(FAST ? 10 : 250); },   /* كيف نعرف المتقابلتين، لا أيّ القاعدتين هنا */
  show: async (item, ctx) => { if (!ctx || !ctx.q) return; ctx.svg.querySelectorAll('[data-help]').forEach(n => n.remove()); arSetDeg(ctx.q, item.want, AR.ok); },
  pick: (item, ctx) => { const np = numberPick(shuffle(item.nums), item.want, { west: true, word: degw }); ctx.np = np; return np.p; },
  errOf: (it, k) => k === 180 - it.want ? (it.opp ? 'arVertSupp' : 'arVertAdj') : k === 360 - it.want ? 'arFull' : 'arOff' });

/* ④ أيّ زاوية؟ (C413، C404): kind cross (مستقيمان، th) أو tr (قاطع، phi)؛ mark الزاوية الملوّنة، rel العلاقة، opts أرقام الخيارات (الأول الصحيح)؛
   lab ترقيمٌ آخر للمواضع (lab[n − 1] اسم الموضع n): في التقييم لا يُحفظ الزوج برقميه من المشاهد (المراجع A لبوابة M4-U1/U2، 9) */
const arLabN = (item, n) => item.lab ? item.lab[n - 1] : n;
ITEM.arWhich = cpItem({ H: 250, tLine: 'gen.ar.together.which', hint: 'gen.ar.hint.corr', rLine: it => 'gen.ar.reveal.' + it.rel, praise: 'praiseThink',
  make: s => ({ want: 'n' + s.opts[0], tag: 'ar-which-' + s.rel }),
  draw(svg, item, tries) { const g = el('g', {}, svg), arcs = {};
    if (item.kind === 'cross') { const V = [180, 128], X = arCross(g, V, item.th); X.forEach(([a1, a2], i) => { const n = i + 1; arcs[n] = arArc(g, V, a1, a2, { r: n === item.mark ? 30 : 22, col: n === item.mark ? AR.a : '#8a96a0', lab: arNum(arLabN(item, n)), dl: 18, fill: n === item.mark, w: n === item.mark ? 3.6 : 2 }); }); }
    else { const R = arTrans(g, item.phi); for (let n = 1; n <= 8; n++) { const { V, a1, a2 } = R.at(n); arcs[n] = arArc(g, V, a1, a2, { r: n === item.mark ? 22 : 16, col: n === item.mark ? AR.a : '#8a96a0', lab: arNum(arLabN(item, n)), dl: 12, fs: 14, fill: n === item.mark, w: n === item.mark ? 3.4 : 2 }); } }
    if (tries >= 3) { const m = helpG(svg);   /* لا يُعلَّم قوس الجواب: امتداد ضلعي الملوّنة (المتقابلة)، أو التقاطع الذي فيه المطلوبة (المراجع A لبوابة M4-U1/U2، 6) */
      if (item.kind === 'cross') { const V = [180, 128], [a1, a2] = AR_X(item.th)[item.mark - 1]; for (const d of [a1, a2]) { const P = angP(V, d + 180, 70); geoLine(m, V[0], V[1], P[0], P[1], { color: AR.hl, w: 3, dash: '6 5' }); } }
      else { const R = arTrans(el('g', { opacity: 0 }, m), item.phi), W = R.at(item.opts[0]).V; el('circle', { cx: W[0], cy: W[1], r: 34, fill: 'none', stroke: AR.hl, 'stroke-width': 3, 'stroke-dasharray': '6 5', 'pointer-events': 'none' }, m); } } return { arcs }; },
  h2: async (item, ctx) => { ciRule(helpG(ctx.svg), 180, 236, labelText('arRule.' + item.rel), AR.hl, 13); await sleep(FAST ? 10 : 250); },
  show: async (item, ctx) => { if (!ctx || !ctx.arcs) return; const w = ctx.arcs[item.opts[0]]; if (w) { w.p.setAttribute('stroke', AR.ok); w.p.removeAttribute('stroke-dasharray'); w.p.setAttribute('stroke-width', 4); } },
  pick: item => choosePick(shuffle(item.opts.map(n => ['n' + n, labelText('arAng') + ' ' + arNum(arLabN(item, n)), '<i></i>', 'gen.ar.ang.' + arLabN(item, n)])), item.want),
  errOf: (it, k) => { const n = +k.slice(1); if (it.kind === 'cross') return 'arVertAdj'; return n === AR_REL.vert(it.mark) ? 'arTrVert' : n === AR_REL.corr(it.mark) ? 'arTrCorr' : (n - 1) % 4 === (it.mark - 1) % 4 ? 'arTrCorr' : 'arTrSide'; } });

ITEM.arWhich.hint2 = async (item, r) => { if (r && r.ctx && r.ctx.svg) ciRule(helpG(r.ctx.svg), 180, 224, labelText('arRule.' + item.rel), AR.hl, 13); await S('gen.ar.hint.' + item.rel); };   /* التلميح بنوع العلاقة */

/* ⑤ زاوية على القاطع (C404): phi، given (1..8) معطاة، ask (1..8) مطلوبة؛ والمستقيمان متوازيان */
ITEM.arTrCalc = cpItem({ H: 250, tLine: 'gen.ar.together.trCalc', hint: 'gen.ar.hint.trCalc', rLine: 'gen.ar.reveal.trCalc', rSay: it => sayDeg(it.want), num: true, praise: 'praiseThink',
  sayQ: async it => { await sayDeg(it.gv); await S('gen.ar.q.trCalcEnd', { append: true }); },
  make: s => { const gv = arTrVal(s.phi, s.given), want = arTrVal(s.phi, s.ask); return { gv, want, nums: [want, want === 90 ? 100 : 180 - want, 360 - want], tag: 'ar-tr-calc' }; },
  draw(svg, item, tries) { const g = el('g', {}, svg), R = arTrans(g, item.phi), G = R.at(item.given), Q = R.at(item.ask);
    arArc(g, G.V, G.a1, G.a2, { r: 22, col: AR.a, deg: item.gv, dl: 16, fs: 14, fill: true }); const q = arArc(g, Q.V, Q.a1, Q.a2, { r: 22, col: AR.q, lab: '؟', dl: 16, fs: 15, fill: true });
    if (tries >= 3) ciRule(helpG(svg), 180, 226, labelText('arRelN.' + arRelOf(item.given, item.ask)) + ': ؟', AR.hl, 14); return { q, G, Q }; },   /* بالعلاقة لا بالقيمة (D240) */
  h2: async (item, ctx) => { const m = helpG(ctx.svg); for (const P of [ctx.G, ctx.Q]) if (P) el('circle', { cx: P.V[0], cy: P.V[1], r: 32, fill: 'none', stroke: AR.hl, 'stroke-width': 3, 'stroke-dasharray': '6 5', 'pointer-events': 'none' }, m); await sleep(FAST ? 10 : 250); },   /* المستوى الثاني رسمٌ: موضعا الزاويتين (D285 (4)) */
  show: async (item, ctx) => { if (!ctx || !ctx.q) return; ctx.svg.querySelectorAll('[data-help]').forEach(n => n.remove()); arSetDeg(ctx.q, item.want, AR.ok); },
  pick: (item, ctx) => { const np = numberPick(shuffle(item.nums), item.want, { west: true, word: degw }); ctx.np = np; return np.p; },
  errOf: (it, k) => k === 180 - it.want ? 'arTrMix' : k === 360 - it.want ? 'arFull' : 'arOff' });

/* ⑥ هل المستقيمان متوازيان؟ (C404، شرط التوازي): phi، tilt (0 متوازيان)؛ والمتناظرتان 2 و6 مكتوبتان */
ITEM.arPar = cpItem({ H: 250, tLine: 'gen.ar.together.par', hint: 'gen.ar.hint.par', rLine: it => it.tilt ? 'gen.ar.reveal.parNo' : 'gen.ar.reveal.parYes', praise: 'praiseThink',
  make: s => ({ want: s.tilt ? 'no' : 'yes', tag: 'ar-par' }),
  draw(svg, item, tries) { const g = el('g', {}, svg), R = arTrans(g, item.phi, { tilt: Math.min(item.tilt, 3), marks: false }), A = R.at(2), B = R.at(6);   /* الميل في الرسم ثلاث درجات على الأكثر: يُحكم بالعددين لا بالعين، والرسم ليس بالقياس (D254، المراجع A لبوابة M4-U1/U2، 10) */
    arArc(g, A.V, A.a1, A.a2, { r: 22, col: AR.a, deg: item.phi, dl: 16, fs: 14, fill: true }); arArc(g, B.V, B.a1, B.a2, { r: 22, col: AR.b, deg: item.phi - item.tilt, dl: 16, fs: 14, fill: true });
    const ns = el('text', { x: 330, y: 34, 'text-anchor': 'start', 'font-size': 12, 'font-weight': 700, fill: '#6b7a84', direction: 'rtl', 'pointer-events': 'none' }, g); ns.textContent = labelText('arNotScale');
    if (tries >= 3) ciRule(helpG(svg), 180, 224, labelText('arRulePar'), AR.hl, 13); return { A, B }; },
  h2: async (item, ctx) => { const m = helpG(ctx.svg); for (const P of [ctx.A, ctx.B]) if (P) el('circle', { cx: P.V[0], cy: P.V[1], r: 32, fill: 'none', stroke: AR.hl, 'stroke-width': 3, 'stroke-dasharray': '6 5', 'pointer-events': 'none' }, m); await sleep(FAST ? 10 : 250); },   /* المستوى الثاني رسمٌ: المتناظرتان (D286 (3)، المراجع A لبوابة M4-U1/U2، 22) */
  pick: item => yesNo(item.want),
  errOf: it => it.tilt ? 'arParAlways' : 'arParNo' });

/* ⑦ «أكمل الزاوية» و«مرآة الرأس» و«سكّة القطار» (إنتاج بزرّين، 5 درجات): mode comp | supp (a معطاة، والطفل يدوّر الضلع حتى تكمّلها)،
   vert (المستقيم الثاني يدور، والمطلوب أن تصير الزاوية 3 want)، tr (القاطع يدور، والمطلوب أن تصير الزاوية 6 want) */
ITEM.arTurn = {
  make(spec) { const want = spec.mode === 'comp' ? 90 : spec.mode === 'supp' ? 180 : spec.want; return { ...spec, want, tag: 'ar-turn-' + spec.mode }; },
  async ask(item, mode, tries) { const svg = m3Stage(278), host = el('g', {}, svg), m = item.mode;   /* 278: زرّا الدوران داخل الإطار */ let v = m === 'comp' || m === 'supp' ? item.a + 20 : item.start || 60, reg = null;
    const lo = m === 'comp' || m === 'supp' ? item.a + 5 : 20, hi = m === 'comp' ? 175 : m === 'supp' ? 180 : 160, tv = m === 'vert' || m === 'tr' ? 180 - item.want : item.want;   /* tv: قياس الخضراء الصحيح */
    const draw = () => { host.innerHTML = '';
      if (m === 'comp' || m === 'supp') { const V = [180, 196], L = 130; geoLine(host, V[0], V[1], V[0] + L, V[1], { color: AR.line, w: 4 }); const M = angP(V, item.a, L), E = angP(V, v, L); geoLine(host, V[0], V[1], M[0], M[1], { color: AR.line, w: 4 }); geoLine(host, V[0], V[1], E[0], E[1], { color: AR.tr, w: 5 });
        arArc(host, V, 0, item.a, { r: 44, col: AR.a, deg: item.a, dl: 18 }); arArc(host, V, item.a, v, { r: 32, col: AR.tr, deg: v - item.a, dl: 20 }); el('circle', { cx: V[0], cy: V[1], r: 5, fill: ANG.v, 'pointer-events': 'none' }, host); }
      /* المطلوبة تكمّل الخضراء (المجاورة، أو مناظرةُ مجاورتها): يحسب الطفل قبل أن يدوّر، لا يقرأ العدد المطلوب على الخضراء (المراجع A لبوابة M4-U1/U2، 33) */
      else if (m === 'vert') { const V = [180, 128], X = arCross(host, V, v); arArc(host, V, X[0][0], X[0][1], { r: 30, col: AR.a, deg: v, dl: 18, fill: true }); arArc(host, V, X[1][0], X[1][1], { r: 30, col: AR.q, lab: '؟', dl: 18, fill: true }); }
      else { const R = arTrans(host, v), A = R.at(2), B = R.at(8); arArc(host, A.V, A.a1, A.a2, { r: 22, col: AR.a, deg: v, dl: 16, fs: 14, fill: true }); arArc(host, B.V, B.a1, B.a2, { r: 22, col: AR.q, lab: '؟', dl: 16, fs: 15, fill: true }); }
      /*T*/window.__cdV = v / 5; window.__cdWant = tv / 5;/*/T*/ if (reg) reg(); };
    draw(); if (tries >= 3) ciRule(helpG(svg), 180, 26, labelText(m === 'comp' ? 'arRuleComp' : m === 'supp' ? 'arRuleSupp' : m === 'vert' ? 'arRuleAdj' : 'arRule.corr'), AR.hl, 13);
    const btns = svgSteppers(svg, [[44, 238], [316, 238]], d => { v = Math.max(lo, Math.min(hi, v + 5 * d)); SFX.tick(); draw(); }, { key: 'cd', labels: ['arLess', 'arMore'] });
    if (tries >= 3) await S('gen.ar.together.turn'); else { await S(item.q, { noGap: m === 'vert' || m === 'tr' }); if (m === 'vert' || m === 'tr') await sayDeg(item.want); }
    const t = tv / 5, tap = b => b.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    const fin = rulDone(() => { reg = null; btns.forEach(b => { b.onclick = null; b.onkeydown = null; b.removeAttribute('role'); }); });
    reg = () => AUTO({ kind: 'compass', ok: () => v / 5 === t ? rulDoneBtn().click() : tap(btns[v / 5 < t ? 1 : 0]), wrong: () => { const w = (t + 1) * 5 <= hi ? t + 1 : t - 1; if (v / 5 === w) rulDoneBtn().click(); else tap(btns[v / 5 < w ? 1 : 0]); } }); reg(); await fin;
    return { ans: v, ctx: { svg } }; },
  judge(item, v) { const m = item.mode, tv = m === 'vert' || m === 'tr' ? 180 - item.want : item.want; if (v === tv) return { ok: true }; return { ok: false, err: m === 'comp' && v === 180 ? 'arMix' : m === 'supp' && v === 90 ? 'arMix' : m === 'vert' && v === item.want ? 'arVertAdj' : m === 'tr' && v === item.want ? 'arTrMix' : 'arTurnOff' }; },
  onOk() { SFX.good(); }, onWrong() { SFX.soft(); },
  async hint2(item, r) { if (r && r.ctx) ciRule(helpG(r.ctx.svg), 180, 26, labelText(item.mode === 'comp' ? 'arRuleComp' : item.mode === 'supp' ? 'arRuleSupp' : item.mode === 'vert' ? 'arRuleAdj' : 'arRule.corr'), AR.hl, 13); await S('gen.ar.hint.turn.' + item.mode); }, async together() {},
  async reveal(item, r) { await S('gen.ar.reveal.turn.' + item.mode); },
  praise: () => 'praisePlace', twin(item) { return item.twin || null; },
};

/* ================= صورة التعليل (arpic): cross th مع أرقام، أو tr phi (tilt)، و mark أرقام ملوّنة، و f حساب ================= */
function arReasonPic(g, P) { const sc = el('g', { transform: 'translate(0 -6) scale(1)' }, g);
  if (P.cross != null) { const V = [180, 100], X = arCross(sc, V, P.cross, { L: 95 }); (P.mark || []).forEach(n => { const [a1, a2] = X[n - 1]; arArc(sc, V, a1, a2, { r: 26, col: AR.a, ...(P.vals ? { deg: n % 2 ? P.cross : 180 - P.cross } : { lab: arNum(n) }), dl: 16, fill: true }); }); }
  else if (P.tr != null) { const R = arTrans(sc, P.tr, { y1: 56, y2: 140, tilt: P.tilt || 0, marks: !P.tilt }); (P.mark || []).forEach(n => { const { V, a1, a2 } = R.at(n); arArc(sc, V, a1, a2, { r: 20, col: AR.a, ...(P.vals ? { deg: P.tilt && n > 4 ? arTrVal(P.tr - P.tilt, n) : arTrVal(P.tr, n) } : { lab: arNum(n) }), dl: 14, fs: 14, fill: true }); }); }
  else if (P.adj && P.show != null && P.adj[0] + P.show !== (P.adj[1] === 'comp' ? 90 : 180)) { const V = [180, 150], a = P.adj[0], b = a + P.show, tot = P.adj[1] === 'comp' ? 90 : 180;   /* ادّعاءٌ خاطئ: الزاويتان كما قيل، تتجاوزان القائمة المنقّطة أو تقصران عنها (المراجع A لبوابة M4-U1/U2، 16) */
    const T = angP(V, tot, 100); geoLine(sc, V[0], V[1], T[0], T[1], { color: AR.line, w: 2.4, dash: '6 5' });
    for (const d of [0, a, b]) { const P2 = angP(V, d, 100); geoLine(sc, V[0], V[1], P2[0], P2[1], { color: d === a ? AR.tr : AR.line, w: 4 }); }
    arArc(sc, V, 0, a, { r: 40, col: AR.a, deg: a, dl: 18 }); arArc(sc, V, a, b, { r: 30, col: AR.q, deg: P.show, dl: 22 }); el('circle', { cx: V[0], cy: V[1], r: 5, fill: ANG.v, 'pointer-events': 'none' }, sc); }
  else if (P.adj) arAdj(sc, P.adj[0], P.adj[1], { V: [180, 150], L: 100, showDeg: P.show });
  if (P.f) ciEq(g, 180, 200, P.f, P.bad ? SO.bad : SO.ink, 18); }

/* ================= المشاهد ================= */
const arSay = async (L, i) => { if (L[i]) await S(L[i]); };
/* د1 الإشعال: «30 و70 متتامتان!»، والمنقلة تجمعهما 100 */
SCENES.arHook = async c => { const L = c.lines, svg = m3Stage(250), g = el('g', { 'pointer-events': 'none' }, svg), V = [180, 196];
  geoLine(g, V[0], V[1], V[0] + 130, V[1], { color: AR.line, w: 4 }); for (const d of [30, 100]) { const P = angP(V, d, 130); geoLine(g, V[0], V[1], P[0], P[1], { color: AR.line, w: 4 }); }
  arArc(g, V, 0, 30, { r: 46, col: AR.a, deg: 30, dl: 18 }); arArc(g, V, 30, 100, { r: 34, col: AR.b, deg: 70, dl: 20 }); await arSay(L, 0);
  protAt(el('g', { opacity: .55 }, g), V, 0, { R: 120 }); arArc(g, V, 0, 100, { r: 64, col: AR.bad, deg: 100, dl: 74 });   /* عددُها خارج المنقلة لا فوق أرقامها */ ciEq(g, 180, 30, '30 + 70 = 100', AR.bad, 18); SFX.tick(); await arSay(L, 1); for (const l of L.slice(2)) await S(l); };
/* د1 الاكتشاف (أ، ب): 40 و50 تملآن القائمة، و65 و115 تملآن المستقيمة */
SCENES.arCompShow = async c => { const L = c.lines, svg = m3Stage(250); let g = el('g', { 'pointer-events': 'none' }, svg); arAdj(g, 40, 'comp', { showDeg: 50 }); ciEq(g, 180, 30, '40 + 50 = 90', AR.ok, 18); await arSay(L, 0);
  g.remove(); g = el('g', { 'pointer-events': 'none' }, svg); arAdj(g, 65, 'supp', { showDeg: 115 }); ciEq(g, 180, 30, '65 + 115 = 180', AR.ok, 18); SFX.tick(); await arSay(L, 1); ciEq(g, 180, 220, '180 − 65 = 115', AR.hl, 17); await arSay(L, 2); for (const l of L.slice(3)) await S(l); };
/* د2 الإشعال والاكتشاف: عودان متقاطعان، والمتقابلتان بالرأس لا تشتركان في ضلع */
SCENES.arCrossShow = async c => { const L = c.lines, svg = m3Stage(250), g = el('g', { 'pointer-events': 'none' }, svg), V = [180, 126], X = arCross(g, V, 50);
  const a = arArc(g, V, X[0][0], X[0][1], { r: 30, col: AR.a, lab: arNum(1), dl: 18, fill: true }), b = arArc(g, V, X[1][0], X[1][1], { r: 30, col: AR.b, lab: arNum(2), dl: 18, fill: true }); await arSay(L, 0);
  b.sg.remove(); arArc(g, V, X[2][0], X[2][1], { r: 30, col: AR.a, lab: arNum(3), dl: 18, fill: true }); SFX.tick(); await arSay(L, 1); for (const l of L.slice(2)) await S(l); };
/* د2 الاكتشاف (ب): ورقٌ شفّاف يدور نصف دورة حول الرأس، فتنطبق الزاوية على مقابلتها */
SCENES.arVertShow = async c => { const L = c.lines, svg = m3Stage(250), g = el('g', { 'pointer-events': 'none' }, svg), V = [180, 126], X = arCross(g, V, 50);
  arArc(g, V, X[0][0], X[0][1], { r: 30, col: AR.a, deg: 50, dl: 18, fill: true }); const q = arArc(g, V, X[2][0], X[2][1], { r: 30, col: AR.a, lab: '؟', dl: 18, fill: true }); await arSay(L, 0);
  const t = el('g', {}, g); arArc(t, V, X[0][0], X[0][1], { r: 30, col: AR.par, w: 4 }); for (let d = 0; d <= 180; d += 15) { t.setAttribute('transform', `rotate(${-d} ${V[0]} ${V[1]})`); await sleep(FAST ? 1 : 60); } SFX.tick(); arSetDeg(q, 50, AR.a);   /* بعد الانطباق يُكتب قياسها (المراجع A لبوابة M4-U1/U2، 32) */
  arArc(g, V, X[1][0], X[1][1], { r: 22, col: AR.b, deg: 130, dl: 18 }); arArc(g, V, X[3][0], X[3][1], { r: 22, col: AR.b, deg: 130, dl: 18 }); await arSay(L, 1); for (const l of L.slice(2)) await S(l); };
/* د3 الإشعال والاكتشاف (أ): القاطع على سكّتين، والزوايا الثماني بأرقامها */
SCENES.arTransShow = async c => { const L = c.lines, svg = m3Stage(250), g = el('g', { 'pointer-events': 'none' }, svg), R = arTrans(g, 60); await arSay(L, 0);
  for (let n = 1; n <= 8; n++) { const { V, a1, a2 } = R.at(n); arArc(g, V, a1, a2, { r: 18, col: n <= 4 ? AR.a : AR.b, lab: arNum(n), dl: 12, fs: 14 }); SFX.tick(); await sleep(FAST ? 1 : 180); } for (const l of L.slice(1)) await S(l); };
/* د3 الاكتشاف (ج): المتناظرتان 2 و6 متساويتان ما توازى المستقيمان، ثم يميل الأسفل فتختلفان: مسلّمة التناظر */
SCENES.arCorrShow = async c => { const L = c.lines, svg = m3Stage(250); let g = el('g', { 'pointer-events': 'none' }, svg);
  const one = tilt => { g.remove(); g = el('g', { 'pointer-events': 'none' }, svg); const R = arTrans(g, 60, { tilt, marks: !tilt }), A = R.at(2), B = R.at(6); arArc(g, A.V, A.a1, A.a2, { r: 22, col: AR.a, deg: 60, dl: 16, fill: true }); arArc(g, B.V, B.a1, B.a2, { r: 22, col: tilt ? AR.b : AR.a, deg: 60 - tilt, dl: 16, fill: true }); };
  one(0); await arSay(L, 0); one(15); SFX.tick(); await arSay(L, 1); one(0); ciRule(g, 180, 222, labelText('arRule.post'), AR.ok, 13); await arSay(L, 2); for (const l of L.slice(3)) await S(l); };
/* د4: زاوية التبادل 3 تساوي المتناظرة 7… (التبادل من التناظر والمتقابلة بالرأس)، والمتحالفتان مجموعهما 180 */
SCENES.arAltShow = async c => { const L = c.lines, svg = m3Stage(250); let g = el('g', { 'pointer-events': 'none' }, svg), R = arTrans(g, 60);
  const mk = (n, col, v) => { const { V, a1, a2 } = R.at(n); return arArc(g, V, a1, a2, { r: 22, col, ...(v != null ? { deg: v } : { lab: arNum(n) }), dl: 16, fill: true }); };
  mk(2, AR.a, 60); mk(6, AR.a, 60); await arSay(L, 0); mk(3, AR.b, 60); SFX.tick(); await arSay(L, 1);
  g.remove(); g = el('g', { 'pointer-events': 'none' }, svg); R = arTrans(g, 60); mk(4, AR.a, 120); mk(6, AR.b, 60); ciEq(g, 180, 224, '120 + 60 = 180', AR.ok, 17); SFX.tick(); await arSay(L, 2); for (const l of L.slice(3)) await S(l); };
/* د5 المشروع «جسر الزوايا»: طريقان متوازيان وطريق قاطع بزاويةٍ معلومة، وبعد بنود الطفل الجدول */
SCENES.arBridgeShow = async c => { const L = c.lines, svg = m3Stage(262);
  if (c.table) { const g = el('g', { 'pointer-events': 'none' }, svg), rows = [['arT.k', 'arT.v', 1], ['arT.given', '70'], ['arT.alt', '70'], ['arT.coint', '110'], ['arT.vert', '70']];
    rows.forEach(([k, v, head], i) => { const y = 24 + i * 46; el('rect', { x: 28, y, width: 304, height: 40, rx: 10, fill: head ? '#e8f1fb' : i % 2 ? '#fff' : '#f6eccf', stroke: SO.grid, 'stroke-width': 2 }, g);
      const a = el('text', { x: 318, y: y + 26, 'text-anchor': 'start', 'font-size': 14, 'font-weight': 800, fill: AR.line, direction: 'rtl' }, g); a.textContent = labelText(k);
      if (head) { const t = el('text', { x: 90, y: y + 26, 'text-anchor': 'middle', 'font-size': 14, 'font-weight': 800, fill: AR.line, direction: 'rtl' }, g); t.textContent = labelText(v); } else degText(g, 90, y + 26, +v, { size: 16, color: AR.a }); });
    for (const l of L) await S(l); return; }
  const g = el('g', { 'pointer-events': 'none' }, svg); for (const y of [70, 170]) { el('rect', { x: 20, y: y - 14, width: 320, height: 28, fill: '#9a948a' }, g); geoLine(g, 26, y, 334, y, { color: '#fff', w: 2.5, dash: '12 9' }); }
  const R = arTrans(g, 70, { y1: 70, y2: 170, marks: false, parCol: 'transparent' }); const mk = (n, col, v) => { const { V, a1, a2 } = R.at(n); arArc(g, V, a1, a2, { r: 22, col, deg: v, dl: 16, fill: true }); };
  mk(2, AR.a, 70); await arSay(L, 0); for (const l of L.slice(1)) await S(l); };   /* الزاوية المعلومة وحدها: الطفل يجد الباقية في البنود، ثم يجمعها الجدول (D286 (1)، المراجع A لبوابة M4-U1/U2، 3) */
WRAP_ART.angRelArt = svg => { const g = el('g', { 'pointer-events': 'none' }, svg), R = arTrans(g, 60, { y1: 90, y2: 170 }); for (const n of [2, 3, 6, 7]) { const { V, a1, a2 } = R.at(n); arArc(g, V, a1, a2, { r: 20, col: AR.a, fill: true }); } };
