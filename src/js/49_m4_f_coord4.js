/* =====================================================================
   M4-U5 «الإحداثيات الكاملة» (المرحلة 4، نوفمبر 2026)
   د1 المستوى الكامل والأرباع (C419) · د2 المسافة بفيثاغورس والميل (C410) · د3 معادلة المستقيم ص = م س + ب (C417، D190) · د4 مشروع «خريطة المدينة الكاملة»
   الزوج المرتب والسالب والمعادلة بحروفها العربية من اليمين، والسالب على يمين العدد (D280، يعدّل D84)؛ والأزواج بالأرقام الغربية وحدها من اليسار، والميل عددٌ يتبع «أرقامي» (D251)
   فتقع علامة السالب يمين العدد كما تُقرأ، ومن اليسار مع الغربية
   ===================================================================== */
const C4 = { grid: '#dfe5ea', ax: '#c9971c', ink: '#24323a', pt: '#2f7fc1', pt2: '#d9822b', ok: '#2f9d6b', q: '#c0392b', ln: '#7a4fb0', hl: SO.hl,
  quad: ['rgba(47,127,193,.14)', 'rgba(217,130,43,.16)', 'rgba(122,79,176,.14)', 'rgba(47,157,107,.15)'] };
const C4_QS = ['q1', 'q2', 'q3', 'q4'];
const c4QuadOf = (x, y) => !x || !y ? 'axis' : x > 0 ? (y > 0 ? 'q1' : 'q4') : (y > 0 ? 'q2' : 'q3');
const c4Same = (p, q) => p[0] === q[0] && p[1] === q[1];
const c4Say = async (L, i) => { if (L[i]) await S(L[i]); };

/* المستوى الكامل: n نصف المحور الأفقي، وny نصف الرأسي؛ الأصل في الوسط، والمحوران ذهبيان بسهمين واسميهما، والأعداد السالبة يساراً وإلى أسفل */
function c4Plane(svg, o = {}) { const n = o.n || 5, m = o.ny || n, top = Math.max(26, o.top ?? 50), H = o.H || 262, c = o.c || Math.min(22, 142 / n, (H - 38 - top) / (2 * m)),   /* المستوى وسهماه داخل الإطار الورقي (المعروف (1) لبوابة M4-U5/U6) */
    C = [o.cx || 180, top + m * c + 4], g = el('g', { 'pointer-events': 'none', 'data-plane4': 1 }, svg), P = (x, y) => [C[0] + x * c, C[1] - y * c];
  el('rect', { x: C[0] - n * c - 16, y: C[1] - m * c - 8, width: 2 * n * c + 32, height: 2 * m * c + 26, rx: 10, fill: '#fffdf6', stroke: C4.grid, 'stroke-width': 2 }, g);
  if (o.quads) [[1, 1], [-1, 1], [-1, -1], [1, -1]].forEach(([sx, sy], i) => el('rect', { x: Math.min(C[0], C[0] + sx * n * c), y: Math.min(C[1], C[1] - sy * m * c), width: n * c, height: m * c, fill: C4.quad[i] }, g));
  for (let i = -n; i <= n; i++) geoLine(g, C[0] + i * c, C[1] - m * c, C[0] + i * c, C[1] + m * c, { color: C4.grid, w: 1.1 });
  for (let j = -m; j <= m; j++) geoLine(g, C[0] - n * c, C[1] - j * c, C[0] + n * c, C[1] - j * c, { color: C4.grid, w: 1.1 });
  geoLine(g, C[0] - n * c - 6, C[1], C[0] + n * c + 6, C[1], { color: C4.ax, w: 3 }); geoArrow(g, C[0] + n * c + 9, C[1], 0, C4.ax, 7);
  geoLine(g, C[0], C[1] + m * c + 6, C[0], C[1] - m * c - 6, { color: C4.ax, w: 3 }); geoArrow(g, C[0], C[1] - m * c - 9, -90, C4.ax, 7);
  const tk = [], T = (t, B) => { tk.push({ t, B }); t.setAttribute('data-tk', ''); return t; };   /* أعداد المحورين واسماهما: تُخفى ما وقع عليها نقطةٌ أو اسمها (المعروف (1) لبوابة M4-U5/U6) */
  T(preLab(g, C[0] + n * c + 9, C[1] + 16, labelText('coX'), { col: C4.ax, fs: 13, dir: 'rtl' }), [C[0] + n * c, C[1] + 4, C[0] + n * c + 18, C[1] + 18]); T(preLab(g, C[0] + 13, C[1] - m * c + 2, labelText('coY'), { col: C4.ax, fs: 13, dir: 'rtl', anchor: 'start' }), [C[0] + 1, C[1] - m * c - 10, C[0] + 15, C[1] - m * c + 4]);
  const tf = o.tfs || 12, st = o.st || [1, 2, 4, 5].find(s => s * c >= tf * 1.8) || 8;   /* «−١» على المحورين لا تتراكبان عند الأصل */   /* أعداد المحورين 12 (كانت 9.5 فتصير 7.6 بكسلاً على iPhone SE؛ المراجع B لبوابة M4-U5/U6، 7) */
  if (o.nums !== false) for (let k = -Math.max(n, m); k <= Math.max(n, m); k++) { if (!k || k % st) continue;
    if (Math.abs(k) <= n) T(preLab(g, C[0] + k * c, C[1] + 4 + tf, preNumV(k), { fs: tf, col: '#5b6b72' }), [C[0] + k * c - tf * .75, C[1] + 5, C[0] + k * c + tf * .75, C[1] + 6 + tf]);
    if (Math.abs(k) <= m) T(preLab(g, C[0] - 5, C[1] - k * c + tf * .37, preNumV(k), { fs: tf, anchor: 'end', col: '#5b6b72' }), [C[0] - 5 - tf * 1.4, C[1] - k * c - tf * .45, C[0] - 4, C[1] - k * c + tf * .5]); }
  el('circle', { cx: C[0], cy: C[1], r: 3.5, fill: C4.ink }, g);
  if (o.qlab) [['q1', 1, 1], ['q2', -1, 1], ['q3', -1, -1], ['q4', 1, -1]].forEach(([k, sx, sy]) => preLab(g, C[0] + sx * n * c / 2, C[1] - sy * m * c / 2 + 5, labelText('c4Q.' + k), { fs: 14, col: '#7d8a90', dir: 'rtl' }));
  return { g, P, C, c, n, m, tk, pfs: o.pfs, inside: q => q[0] > C[0] - n * c - 16 && q[0] < C[0] + n * c + 16 && q[1] > C[1] - m * c - 14 && q[1] < C[1] + m * c + 14,
    snap: q => [Math.max(-n, Math.min(n, Math.round((q[0] - C[0]) / c))), Math.max(-m, Math.min(m, Math.round((C[1] - q[1]) / c)))] }; }
/* امتداد المستوى ليتّسع للنقاط (أربعٌ على الأقل وثمانٍ على الأكثر) */
const c4Ext = (pts, lo = 4) => ({ n: Math.min(8, Math.max(lo, ...pts.map(p => Math.abs(p[0]) + 1))), ny: Math.min(8, Math.max(lo, ...pts.map(p => Math.abs(p[1]) + 1))) });
/* نقطة بزوجها: الزوج في الجهة البعيدة عن المحورين */
function c4Dot(parent, Pl, x, y, o = {}) { const [px, py] = Pl.P(x, y), g = el('g', { 'pointer-events': 'none' }, parent), col = o.col || C4.pt;
  if (o.art === 'treasure') el('path', { d: `M${px - 8} ${py - 8} L${px + 8} ${py + 8} M${px + 8} ${py - 8} L${px - 8} ${py + 8}`, stroke: C4.q, 'stroke-width': 4, 'stroke-linecap': 'round' }, g);
  else if (o.art === 'house') { el('path', { d: `M${px - 9} ${py + 6} L${px - 9} ${py - 3} L${px} ${py - 11} L${px + 9} ${py - 3} L${px + 9} ${py + 6} Z`, fill: '#f6e3b8', stroke: col, 'stroke-width': 2.2, 'stroke-linejoin': 'round' }, g); el('circle', { cx: px, cy: py, r: 2.6, fill: col }, g); }
  else el('circle', { cx: px, cy: py, r: o.r || 6, fill: col, stroke: '#fff', 'stroke-width': 2 }, g);
  const right = o.side ? o.side > 0 : x >= 0 ? x < Pl.n - 1.5 : x <= -Pl.n + 1.5, below = o.below ?? (y < 0 ? y > -Pl.m : y >= Pl.m), dx = right ? 9 : -9, yy = below ? py + 19 : py - 10;
  if (o.name) preLab(g, px + (right ? -12 : 12), yy, LTR[o.name], { col, fs: 14, dir: 'rtl', anchor: right ? 'end' : 'start' });
  if (o.pair) coPairText(g, px + dx, yy, preNum(x), preNum(y), right ? 'start' : 'end', o.fs || Pl.pfs || 13, o.pcol || C4.ink);
  c4Hide(Pl, [[px - 8, py - 8, px + 8, py + 8], ...[...g.querySelectorAll('text')].map(t => { try { const b = t.getBBox(); return b.width ? [b.x, b.y, b.x + b.width, b.y + b.height] : null; } catch (e) { return null; } }).filter(Boolean)]);
  return g; }
function c4Hide(Pl, boxes) { if (!Pl || !Pl.tk) return; for (const { t, B } of Pl.tk) if (boxes.some(b => b[0] < B[2] && b[2] > B[0] && b[1] < B[3] && b[3] > B[1])) t.setAttribute('visibility', 'hidden'); }
/* السير من الأصل: قفزات أفقية (يميناً أو يساراً) ثم رأسية (لأعلى أو لأسفل) */
/* المشي من الأصل: الأفقي ثم الرأسي. upTo 'x' مع dir: المستوى الثاني يمشي الأفقي ويضيء جهة الرأسي بسهم (أو جهة الأفقي إن كانت النقطة على محوره)؛ stop: يقف قبل الخطوات الأخيرة (المستوى الثالث، المراجع A لبوابة M4-U5/U6، 10) */
async function c4Walk(svg, Pl, x, y, o = {}) { const m = helpG(svg); let last = Pl.P(0, 0); const sx = Math.sign(x), sy = Math.sign(y), O = Pl.P(0, 0), ex = Pl.P(1, 0)[0] - O[0], ey = Pl.P(0, 1)[1] - O[1];
  const dirArrow = (ux, uy) => cpArrow(m, last, [last[0] + ex * .8 * ux, last[1] + ey * .8 * uy], { color: THINK_INK, w: 3 });
  if (o.upTo === 'x' && o.dir && !y) { dirArrow(sx, 0); return m; }
  let left = Math.abs(x) + Math.abs(y) - (o.stop || 0);
  for (let i = 1; i <= Math.abs(x) && left > 0; i++, left--) { const q = Pl.P(sx * i, 0); el('path', { d: `M${last[0]} ${last[1]} Q${(last[0] + q[0]) / 2} ${last[1] - 12} ${q[0]} ${q[1]}`, fill: 'none', stroke: css('--compass'), 'stroke-width': 2.6 }, m); last = q; SFX.tick(); await sleep(FAST ? 2 : (o.ms || 170)); }
  if (o.upTo === 'x') { if (o.dir && y) dirArrow(0, sy); return m; }
  for (let j = 1; j <= Math.abs(y) && left > 0; j++, left--) { const q = Pl.P(x, sy * j); el('path', { d: `M${last[0]} ${last[1]} Q${last[0] + 12} ${(last[1] + q[1]) / 2} ${q[0]} ${q[1]}`, fill: 'none', stroke: THINK_INK, 'stroke-width': 2.6 }, m); last = q; SFX.tick(); await sleep(FAST ? 2 : (o.ms || 170)); }
  return m; }
function c4Card(svg, x, y, o = {}) { const g = el('g', { 'pointer-events': 'none' }, svg), w = o.w || 116, col = o.col || C4.pt, cx = o.cx || 180;
  el('rect', { x: cx - w / 2, y: 15, width: w, height: 28, rx: 10, fill: '#fff', stroke: col, 'stroke-width': 2 }, g); coPairText(g, cx, 35, preNum(x), preNum(y), 'middle', 17, col); return g; }   /* البطاقة داخل الإطار، والمستوى تحتها */

/* ---------- المعادلة ص = م س + ب جملةً (D190، D280): ذرّاتٌ بترتيب القراءة، تُعكس دائماً فتُقرأ من اليمين لأن فيها س وص ---------- */
function c4EqAtoms(m, b) { const A = [labelText('coY'), ' ', '=', ' '], d = v => String(Math.abs(v)), x = labelText('coX');
  if (m) { if (m < 0) A.push('−'); if (Math.abs(m) !== 1) A.push(d(m)); A.push(x); if (b) A.push(' ', b < 0 ? '−' : '+', ' ', d(b)); }
  else { if (b < 0) A.push('−'); A.push(d(b)); }
  return A; }
const c4EqVis = (m, b) => c4EqAtoms(m, b).map(t => /\d/.test(t) ? MS(t) : t).reverse().join('');   /* فيها س وص: من اليمين بالكتابتين (D280)، والذرّات معكوسة تحت ltr مع bidi-override */
function c4EqText(parent, x, y, m, b, o = {}) { const t = el('text', { x, y, 'text-anchor': o.anchor || 'middle', 'font-size': o.fs || 20, 'font-weight': 800, fill: o.col || C4.ln, stroke: '#fff', 'stroke-width': 4, 'paint-order': 'stroke', direction: 'ltr', 'unicode-bidi': 'bidi-override', 'pointer-events': 'none' }, parent); t.textContent = c4EqVis(m, b); return t; }
function c4EqCard(svg, m, b, o = {}) { const g = el('g', { 'pointer-events': 'none' }, svg), w = o.w || 156, cx = o.cx || 180, y = o.y ?? 15;
  el('rect', { x: cx - w / 2, y, width: w, height: 28, rx: 10, fill: '#fff', stroke: C4.ln, 'stroke-width': 2 }, g); c4EqText(g, cx, y + 21, m, b, { fs: 19 }); return g; }
const c4LKey = ([m, b]) => preKey([m, b]);
/* المستقيم ص = م س + ب داخل حدود المستوى، أو الرأسي س = vx */
function c4Line(parent, Pl, m, b, o = {}) { if (o.vx != null) { const A = Pl.P(o.vx, -Pl.m), B = Pl.P(o.vx, Pl.m); return geoLine(parent, A[0], A[1], B[0], B[1], { color: o.col || C4.ln, w: o.w || 3.2, dash: o.dash }); }
  let x1 = -Pl.n, x2 = Pl.n; if (m) { const xa = (-Pl.m - b) / m, xb = (Pl.m - b) / m; x1 = Math.max(x1, Math.min(xa, xb)); x2 = Math.min(x2, Math.max(xa, xb)); }
  const A = Pl.P(x1, m * x1 + b), B = Pl.P(x2, m * x2 + b); return geoLine(parent, A[0], A[1], B[0], B[1], { color: o.col || C4.ln, w: o.w || 3.2, dash: o.dash }); }
const c4Through = (parent, Pl, a, b, o = {}) => a[0] === b[0] ? c4Line(parent, Pl, 0, 0, { ...o, vx: a[0] }) : c4Line(parent, Pl, (b[1] - a[1]) / (b[0] - a[0]), a[1] - (b[1] - a[1]) / (b[0] - a[0]) * a[0], o);
/* الفرق الأفقي ثم الرأسي بين نقطتين (الحلّ المشترك والمشاهد) */
/* التعويض بالسالب (المراجع A لبوابة M4-U5/U6، 29): السالب بعلامته، والعامل السالب بين قوسين، والجزء المقطوع السالب طرحاً */
/* r: الجملة تُعكس (المشرقية، أو فيها حرفٌ عربي): السالب يمين أرقامه، والقوسان رمزان مستقلّان يقلبهما MF */
const c4N = (v, r) => v < 0 ? (r ? -v + '−' : '−' + -v) : String(v), c4P = (v, r) => v < 0 ? (r ? '( ' + c4N(v, r) + ' )' : '(' + c4N(v, r) + ')') : String(v);
const c4Sub = (m, x, b) => { const r = SET.digits === 'east'; return `${c4N(m, r)} × ${c4P(x, r)}` + (b > 0 ? ` + ${b}` : b < 0 ? ` − ${-b}` : ''); };
/* تسميةٌ في أوّل موضعٍ لا يقع على نصٍّ مرسوم (زوج نقطةٍ أو عدد محور ظاهر)؛ وإلا فالأول (المراجع B لبوابة M4-U5/U6، 4) */
function c4Free(t, alts, Pl) { const sv = t.ownerSVGElement; if (!sv) return t; const B = [...sv.querySelectorAll('text')].filter(e => e !== t && !e.hasAttribute('data-tk') && e.getAttribute('visibility') !== 'hidden' && !e.closest('[visibility=hidden]')).map(e => { try { return e.getBBox(); } catch (er) { return null; } }).filter(b => b && b.width);
  const hit = () => { const b = t.getBBox(); return B.some(c => b.x < c.x + c.width - 1 && b.x + b.width > c.x + 1 && b.y < c.y + c.height - 1 && b.y + b.height > c.y + 1); };
  for (const [x, y, an] of alts) { if (!hit()) break; t.setAttribute('x', x); t.setAttribute('y', y); if (an) t.setAttribute('text-anchor', an); }
  if (Pl) { const b = t.getBBox(); c4Hide(Pl, [[b.x, b.y, b.x + b.width, b.y + b.height]]); } return t; }   /* وعددُ محورٍ تحتها يُخفى كما تحت أسماء النقاط */
function c4RunRise(parent, Pl, a, b, o = {}) { const A = Pl.P(...a), K = Pl.P(b[0], a[1]), B = Pl.P(...b), dx = b[0] - a[0], dy = b[1] - a[1];
  if (dx) { geoLine(parent, A[0], A[1], K[0], K[1], { color: C4.pt, w: 3, dash: '5 4' }); const mx = (A[0] + K[0]) / 2, y1 = A[1] + (dy > 0 ? 18 : -9), y2 = A[1] + (dy > 0 ? -9 : 18); c4Free(preLab(parent, mx, y1, o.abs ? MS(String(Math.abs(dx))) : preNumV(dx), { col: C4.pt, fs: 14 }), [[mx, y2], [mx + (K[0] - A[0]) / 4, y1], [mx - (K[0] - A[0]) / 4, y1], [K[0] + 12 * Math.sign(dx), A[1] + 5, dx > 0 ? 'start' : 'end'], [A[0] - 12 * Math.sign(dx), A[1] + 5, dx > 0 ? 'end' : 'start'], [mx, y1 + (dy > 0 ? 14 : -14)], [mx, y2 + (dy > 0 ? -14 : 14)]], Pl); }
  if (dy) { geoLine(parent, K[0], K[1], B[0], B[1], { color: C4.pt2, w: 3, dash: '5 4' }); const my = (K[1] + B[1]) / 2 + 5, s = dx >= 0 ? 1 : -1; c4Free(preLab(parent, K[0] + 8 * s, my, o.abs ? MS(String(Math.abs(dy))) : preNumV(dy), { col: C4.pt2, fs: 14, anchor: s > 0 ? 'start' : 'end' }), [[K[0] - 8 * s, my, s > 0 ? 'end' : 'start'], [K[0] + 8 * s, my + (B[1] - K[1]) / 4, s > 0 ? 'start' : 'end'], [K[0] + 8 * s, my - (B[1] - K[1]) / 4, s > 0 ? 'start' : 'end'], [K[0], K[1] + (B[1] > K[1] ? -10 : 22)], [K[0] + 20 * s, my, s > 0 ? 'start' : 'end'], [K[0] - 20 * s, my, s > 0 ? 'end' : 'start']], Pl); }
  if (dx && dy && o.right !== false) preRight(parent, K, A, B, 9); }

/* ---------- الميل: كسرٌ مختزل [بسط، مقام موجب] أو none للرأسي ---------- */
const c4Frac = (p, q) => { const gcd = (a, b) => b ? gcd(b, a % b) : a, k = gcd(Math.abs(p), Math.abs(q)) || 1; let n = p / k, d = q / k; if (d < 0) { n = -n; d = -d; } return [n === 0 ? 0 : n, d]; };
const c4MKey = v => v === 'none' ? 'none' : (v[0] < 0 ? 'm' + -v[0] : '' + v[0]) + (v[1] === 1 ? '' : 'o' + v[1]);
function c4MIcon(v) { const T = (x, y, s, fs) => `<text x="${x}" y="${y}" text-anchor="middle" font-size="${fs}" font-weight="800" fill="currentColor">${s}</text>`;   /* بلون نصّ الزرّ: يُرى بالداكن (المراجع B، 5) */
  if (v === 'none') return `<svg viewBox="0 0 64 48" width="58" height="42" aria-hidden="true">${T(32, 32, esc(labelText('c4NoSlope')), 20)}</svg>`;   /* بلا خطٍّ رأسي يطابق المرسوم في البند (المراجع A، 16) */
  const [n, d] = v, neg = n < 0, east = SET.digits === 'east', a = DG(Math.abs(n));
  if (d === 1) return `<svg viewBox="0 0 56 48" width="48" height="42" aria-hidden="true">${T(28, 36, neg ? (east ? a + '−' : '−' + a) : a, 30)}</svg>`.replace('<text ', '<text direction="ltr" unicode-bidi="bidi-override" ');
  const fx = neg ? (east ? 22 : 34) : 28, sx = east ? 48 : 9;
  return `<svg viewBox="0 0 56 48" width="48" height="42" aria-hidden="true">${neg ? T(sx, 31, '−', 24) : ''}${T(fx, 19, a, 18)}<line x1="${fx - 12}" y1="24" x2="${fx + 12}" y2="24" stroke="currentColor" stroke-width="2.4"/>${T(fx, 43, DG(d), 18)}</svg>`; }
/* الميل نصّاً على المسرح (كسرٌ رأسي، والسالب في جهته) */
function c4MDraw(parent, x, y, v, o = {}) { const g = el('g', { 'pointer-events': 'none' }, parent), col = o.col || C4.ln;
  if (v === 'none') { preLab(g, x, y + 6, labelText('c4NoSlope'), { col, fs: 17, dir: 'rtl' }); return g; }
  const [n, d] = v, neg = n < 0, east = SET.digits === 'east';
  if (d === 1) { preLab(g, x, y + 7, (neg ? '−' : '') + MS(String(Math.abs(n))), { col, fs: 22, dir: east ? 'rtl' : 'ltr' }); return g; }
  if (neg) preLab(g, x + (east ? 23 : -23), y + 7, '−', { col, fs: 22 }); preLab(g, x, y - 4, MS(String(Math.abs(n))), { col, fs: 17 }); geoLine(g, x - 11, y + 1, x + 11, y + 1, { color: col, w: 2.4 }); preLab(g, x, y + 20, MS(String(d)), { col, fs: 17 }); return g; }

/* ================= ① عيّن النقطة في المستوى الكامل (C419): kind pt (x، y)، أو int (مقطع المحور الرأسي من المعادلة ln)، أو corner (رأس الزاوية القائمة بين a وb)؛ art treasure ================= */
ITEM.c4Place = {
  make(spec) { const kind = spec.kind || 'pt', want = kind === 'int' ? [0, spec.ln[1]] : kind === 'corner' ? [spec.b[0], spec.a[1]] : [spec.x, spec.y];
    const pts = kind === 'corner' ? [spec.a, spec.b] : [want], ex = c4Ext(pts, spec.n || 5);
    return { ...spec, kind, want, alt: kind === 'corner' ? [spec.a[0], spec.b[1]] : null, n: ex.n, ny: ex.ny, tag: 'c4-place-' + kind + (spec.art ? '-' + spec.art : '') }; },
  async ask(item, mode, tries) { const svg = m3Stage(262), Pl = c4Plane(svg, { n: item.n, ny: item.ny }); let cur = null, dot = null, walk = null, done = false;
    if (item.kind === 'int') { c4EqCard(svg, ...item.ln); if (tries >= 3) { const h = helpG(svg), A = Pl.P(0, -Pl.m), B = Pl.P(0, Pl.m); geoLine(h, A[0], A[1], B[0], B[1], { color: C4.hl, w: 6 }); } }
    else if (item.kind === 'corner') { const A = Pl.P(...item.a), B = Pl.P(...item.b); geoLine(svg, A[0], A[1], B[0], B[1], { color: C4.ln, w: 3.4 }); c4Dot(svg, Pl, ...item.a, { name: 'a', pair: true, col: C4.pt2 }); c4Dot(svg, Pl, ...item.b, { name: 'b', pair: true, col: C4.pt2 });
      if (tries >= 3) { const h = helpG(svg), K = Pl.P(item.b[0], item.a[1]); geoLine(h, A[0], A[1], K[0] + (K[0] - A[0]) * .3, K[1], { color: C4.hl, w: 2.6, dash: '6 4' }); geoLine(h, B[0], B[1], K[0], K[1] + (K[1] - B[1]) * .3, { color: C4.hl, w: 2.6, dash: '6 4' }); } }
    else { c4Card(svg, item.x, item.y); if (tries >= 3) walk = await c4Walk(svg, Pl, item.x, item.y, { stop: 1 }); }
    const askQ = async () => { await S(tries >= 3 ? 'gen.c4.together.' + item.kind : item.q || 'gen.c4.q.' + item.kind, { noGap: item.kind !== 'corner' }); if (done || !svg.isConnected) return;   /* لا يُلحَق الزوج بعد «تمّ» (المراجع B، 6) */
      if (item.kind === 'pt') await S('gen.c4.pt.' + preKey([item.x, item.y]), { append: true }); else if (item.kind === 'int') await S('gen.c4.eq.' + c4LKey(item.ln), { append: true }); };
    askQ(); REPLAY_HOOK = () => askQ(); REPLAY_HOOK.live = () => !done && svg.isConnected;
    const set = (x, y) => { cur = [x, y]; if (dot) dot.remove(); dot = c4Dot(svg, Pl, x, y, { art: item.art, col: item.art ? C4.q : C4.pt }); /*T*/window.__gridPt = cur;/*/T*/ };
    const input = fingerInput(svg, { map: e => { const q = svgPoint(svg, e); return [q.x, q.y]; }, down(q) { if (!Pl.inside(q)) return false; set(...Pl.snap(q)); SFX.tick(); }, move(q) { set(...Pl.snap(q)); }, up() {}, lens: { Pl } });
    /*T*/window.__gridPtAt = (x, y) => { const m = svg.getScreenCTM(), [px, py] = Pl.P(x, y); return { x: m.a * px + m.e, y: m.d * py + m.f }; }; window.__gridPtWant = item.want;/*/T*/
    const kg = el('g', { role: 'grid', 'aria-label': labelText('coPlane') }, svg);
    for (let y = Pl.m; y >= -Pl.m; y--) { const row = el('g', { role: 'row' }, kg); for (let x = -Pl.n; x <= Pl.n; x++) { const [px, py] = Pl.P(x, y), b = el('g', { role: 'gridcell', tabindex: 0, ...(x === 0 && y === 0 ? { 'data-origin': '' } : {}), 'aria-label': plain(G(labelText('c4Cell'))).replace('X', x).replace('Y', y) }, row); el('circle', { cx: px, cy: py, r: 7, fill: 'transparent', 'pointer-events': 'none' }, b); b.onkeydown = e => { if (isActKey(e)) { e.preventDefault(); set(x, y); SFX.tick(); } }; } }
    const [wx, wy] = item.want, bad = item.kind === 'int' ? [Math.max(-Pl.n, Math.min(Pl.n, wy || 1)), 0] : wx ? [-wx, wy] : [wx, -wy || 1];
    AUTO({ kind: 'gridPt', ok: () => { set(wx, wy); rulDoneBtn().click(); }, wrong: () => { set(...bad); rulDoneBtn().click(); } });
    await rulDone(() => { done = true; REPLAY_HOOK = null; input.off(); kg.remove(); }, () => { if (cur) return true; SFX.soft(); S('gen.c4.placeFirst'); return false; }); return { ans: cur, ctx: { svg, Pl, set, walk } }; },
  judge(item, a) { if (c4Same(a, item.want) || (item.alt && c4Same(a, item.alt))) return { ok: true };
    if (item.kind === 'int') return { ok: false, err: a[1] === 0 && a[0] === item.ln[1] ? 'c4IntSwap' : 'c4IntOff' };
    if (item.kind === 'corner') return { ok: false, err: 'c4CornerOff' };
    const [x, y] = item.want; return { ok: false, err: x && c4Same(a, [-x, y]) ? 'c4SignX' : y && c4Same(a, [x, -y]) ? 'c4SignY' : x && y && c4Same(a, [-x, -y]) ? 'c4SignBoth' : x !== y && c4Same(a, [y, x]) ? 'coordSwap' : 'c4Off' }; },
  onOk() { SFX.good(); }, onWrong() { SFX.soft(); },
  async hint2(item, r) { if (item.kind === 'pt' && r && r.ctx) { const m = await c4Walk(r.ctx.svg, r.ctx.Pl, item.x, item.y, { ms: 230, upTo: 'x', dir: true }); await S('gen.c4.hint.pt'); m.remove(); } else await S('gen.c4.hint.' + item.kind); }, async together() {},
  async reveal(item, r) { if (r.ctx.walk) r.ctx.walk.remove(); if (item.kind === 'pt') await c4Walk(r.ctx.svg, r.ctx.Pl, item.x, item.y, { ms: 140 });
    if (item.kind === 'corner') c4RunRise(helpG(r.ctx.svg), r.ctx.Pl, item.a, item.b, { abs: true }); r.ctx.set(...item.want);
    await S('gen.c4.reveal.' + item.kind, { noGap: true }); await S('gen.c4.go.' + preKey(item.want), { append: true }); },
  praise: () => 'praisePlace', twin(item) { return item.twin || null; },
};

/* ================= ② في أيّ ربع؟ (C419): x، y؛ الخيارات الأرباع الأربعة، أو «على محور» مع ربعين مجاورين ================= */
/* المستوى الثاني رسمٌ في أنواع U5 (المعروف (2) لبوابة M4-U5/U6) */
const c4Legs = (m, Pl, a, b) => { const A = Pl.P(...a), B = Pl.P(...b), K = Pl.P(b[0], a[1]); geoLine(m, A[0], A[1], K[0], K[1], { color: H2C[0], w: 3.2, dash: '7 5' }); geoLine(m, K[0], K[1], B[0], B[1], { color: H2C[1], w: 3.2, dash: '7 5' }); hlRing(m, K, 12); };   /* المشي والصعود بلا أطوال */
ITEM.c4Quad = cpItem({ H: 262, tLine: 'gen.c4.together.quad', hint: 'gen.c4.hint.quad', rLine: it => 'gen.c4.reveal.quad.' + it.want, praise: 'praiseThink',
  make: s => { const want = c4QuadOf(s.x, s.y), cands = want === 'axis' ? ['axis', ...(s.x ? [c4QuadOf(s.x, 1), c4QuadOf(s.x, -1), c4QuadOf(-s.x, 1)] : [c4QuadOf(1, s.y), c4QuadOf(-1, s.y), c4QuadOf(1, -s.y)])] : [want, c4QuadOf(-s.x, s.y), c4QuadOf(s.x, -s.y), 'axis'];   /* «على محور» خيارٌ دائماً، فظهوره ليس الجواب (المراجع A، 2) */
    return { want, cands: [...C4_QS, 'axis'].filter(k => cands.includes(k)), ext: c4Ext([[s.x, s.y]], 5), tag: 'c4-quad' + (want === 'axis' ? '-axis' : '') }; },
  draw(svg, item, tries) { const Pl = c4Plane(svg, item.ext); c4Card(svg, item.x, item.y); if (tries >= 3) c4Walk(svg, Pl, item.x, item.y, { ms: 60 }); return { Pl }; },
  h2: async (item, ctx) => { const m = helpG(ctx.svg), Pl = ctx.Pl; if (Pl) { [[Pl.n, 0, '+', 0], [-Pl.n, 0, '−', 0], [0, Pl.m, '+', 1], [0, -Pl.m, '−', 1]].forEach(([x, y, t, i]) => { const P = Pl.P(x, y); preLab(m, P[0] + (x > 0 ? -9 : x < 0 ? 9 : 15), P[1] + (y > 0 ? 26 : y < 0 ? -6 : -8), t, { col: H2C[i], fs: 20 }); }); hlRing(m, Pl.P(0, 0), 12); } await sleep(FAST ? 10 : 250); },   /* إشارتا كل محور عند طرفيه */
  sayQ: it => S('gen.c4.pt.' + preKey([it.x, it.y]), { append: true }),
  show: async (item, ctx) => { if (ctx && ctx.Pl) c4Dot(helpG(ctx.svg), ctx.Pl, item.x, item.y, { col: C4.ok }); },
  pick: item => choosePick(item.cands.map(k => [k, labelText('c4Q.' + k), '<i></i>', 'gen.c4.quad.' + k]), item.want, { cls: item.cands.length > 3 ? 'four' : '' }),
  errOf: (it, k) => it.want === 'axis' ? 'c4AxisQuad' : k === 'axis' ? 'c4QuadAxis' : k === c4QuadOf(-it.x, it.y) ? 'c4SignX' : k === c4QuadOf(it.x, -it.y) ? 'c4SignY' : 'c4SignBoth' });

/* ================= ③ اقرأ زوج النقطة (C419): x، y؛ الخيارات الصحيح، وعكس إشارة، وتبديل ================= */
ITEM.c4Read = cpItem({ H: 262, tLine: 'gen.c4.together.read', hint: 'gen.c4.hint.read', rLine: 'gen.c4.reveal.read', rSay: it => S('gen.c4.pt.' + it.want, { append: true }), praise: 'praisePlace',
  make: s => { const { x, y } = s, ch = [];
    for (const p of [[-x, y], [x, -y], [y, x], [-x, -y], [x + 1, y]]) if (ch.length < 2 && !c4Same(p, [x, y]) && !ch.some(q => c4Same(p, q))) ch.push(p);
    return { cands: [[x, y], ...ch], want: preKey([x, y]), ext: c4Ext([[x, y]], 5), tag: 'c4-read' }; },
  draw(svg, item, tries) { const Pl = c4Plane(svg, { ...item.ext, top: 16 }); c4Dot(svg, Pl, item.x, item.y, { name: 'a', col: C4.pt2 }); if (tries >= 3) c4Walk(svg, Pl, item.x, item.y, { ms: 60 }); return { Pl }; },
  h2: async (item, ctx) => { const m = helpG(ctx.svg), Pl = ctx.Pl; if (Pl) { const P = Pl.P(item.x, item.y), X = Pl.P(item.x, 0), Y = Pl.P(0, item.y); geoLine(m, P[0], P[1], X[0], X[1], { color: H2C[0], w: 3, dash: '6 5' }); geoLine(m, P[0], P[1], Y[0], Y[1], { color: H2C[1], w: 3, dash: '6 5' }); } await sleep(FAST ? 10 : 250); },   /* عمودان من النقطة إلى المحورين */
  pick: item => choosePick(shuffle(item.cands.map(p => [preKey(p), coPair(preNum(p[0]), preNum(p[1])), '<i></i>', 'gen.c4.pt.' + preKey(p)])), item.want),
  errOf: (it, k) => { const { x, y } = it; return k === preKey([-x, y]) ? 'c4SignX' : k === preKey([x, -y]) ? 'c4SignY' : k === preKey([-x, -y]) ? 'c4SignBoth' : k === preKey([y, x]) ? 'coordSwap' : 'c4Off'; } });

/* ================= ④ المسافة بين نقطتين في المستوى الكامل (C410): a، b؛ وترٌ ضلعاه الفرقان ================= */
ITEM.c4Dist = cpItem({ H: 262, tLine: 'gen.c4.together.dist', hint: 'gen.c4.hint.dist', rLine: 'gen.c4.reveal.dist', rSay: it => S(it.dec ? 'gen.py.v.' + it.want : numw(it.want), { append: true }), num: true, praise: 'praiseThink',
  make: s => { const dx = Math.abs(s.b[0] - s.a[0]), dy = Math.abs(s.b[1] - s.a[1]), want = Math.round(Math.hypot(dx, dy));
    /*T*/if (TESTHOOK && (!dx || !dy)) testBug('c4Dist: النقطتان على خطٍّ أفقي أو رأسي');/*/T*/
    /* المسافة غير الصحيحة بمنزلة عشرية (كالوتر التقريبي في U4): فلا تنحصر المسافات في ٥ و١٠ (المراجع A لبوابة M4-U5/U6، 3 و6) */
    if (want * want !== dx * dx + dy * dy) { const r = +Math.hypot(dx, dy).toFixed(1), k = (dx + dy) % 3, cands = [r, ...[[-.1, .1], [.1, .2], [-.1, -.2]][k].map(e => +(r + e).toFixed(1))]; return { dx, dy, dec: true, r, cands, want: pyKey(r), ext: c4Ext([s.a, s.b], 4), tag: 'c4-dist-dec' }; }
    const ax = Math.abs(Math.abs(s.b[0]) - Math.abs(s.a[0])), ay = Math.abs(Math.abs(s.b[1]) - Math.abs(s.a[1])), sg = Math.hypot(ax, ay), alt = (ax !== dx || ay !== dy) && ax && ay && Number.isInteger(sg) && sg !== want ? sg : null;
    /* رتبة الجواب بين الخيارات تتغيّر بالبند (المراجع A لبوابة M4-U5/U6، 3): الأصغرَ، أو الأوسطَ بفرقٍ واحد، أو الأكبرَ بفرقٍ واحد وبطرح الفرقين */
    const k = (dx * 7 + dy * 3 + Math.abs(s.a[0]) + Math.abs(s.b[1])) % 3, mx = Math.max(dx, dy), mn = Math.min(dx, dy), sub = Math.abs(dx - dy) || mn;
    const nums = (k === 0 ? [want, dx + dy, alt ?? dx * dx + dy * dy] : k === 1 ? [want, mx, dx + dy] : [want, mx, sub]).filter((v, i, X) => X.indexOf(v) === i && v > 0); while (nums.length < 3) nums.push(want + nums.length);
    return { dx, dy, want, alt, nums, ext: c4Ext([s.a, s.b], 4), tag: 'c4-dist' }; },
  draw(svg, item, tries) { const Pl = c4Plane(svg, { ...item.ext, top: 26, H: 226 }), A = Pl.P(...item.a), B = Pl.P(...item.b); geoLine(svg, A[0], A[1], B[0], B[1], { color: C4.ln, w: 3.4 });   /* شريطٌ خالٍ تحت المستوى لبطاقة المستوى الثاني (المراجع B لبوابة M4-U5/U6، 4) */
    c4Dot(svg, Pl, ...item.a, { name: 'a', pair: true, col: C4.pt2 }); c4Dot(svg, Pl, ...item.b, { name: 'b', pair: true, col: C4.pt2 });
    if (tries >= 3) c4RunRise(helpG(svg), Pl, item.a, item.b, { abs: true }); return { Pl }; },
  h2: async (item, ctx) => { const m = helpG(ctx.svg); if (ctx.Pl) c4Legs(m, ctx.Pl, item.a, item.b); ciRule(m, 180, [22, 248], labelText('c4RuleDist'), C4.hl, 15); await sleep(FAST ? 10 : 250); },
  pick: (item, ctx) => { if (item.dec) return choosePick(shuffle(item.cands.map(v => [pyKey(v), pyTxt(v), '<i></i>', 'gen.py.v.' + pyKey(v)])), item.want); const np = numberPick(shuffle(item.nums), item.want, { west: true }); ctx.np = np; return np.p; },
  errOf: (it, k) => it.dec ? 'pyOff' : k === it.dx + it.dy ? 'coDistAdd' : k === it.alt ? 'c4DistSign' : k === it.dx * it.dx + it.dy * it.dy ? 'pyNoRoot' : k === Math.max(it.dx, it.dy) || k === Math.min(it.dx, it.dy) ? 'c4DistOne' : k === Math.abs(it.dx - it.dy) ? 'c4DistSub' : 'coDistOff2' });

/* ================= ⑤ الميل بين نقطتين (C410): a، b؛ الفرق الرأسي ÷ الفرق الأفقي، والرأسي لا ميل له ================= */
function c4SlopeCands(a, b) { const dx = b[0] - a[0], dy = b[1] - a[1], want = dx ? c4Frac(dy, dx) : 'none', C = [want], add = v => { if (C.length < 3 && !C.some(u => c4MKey(u) === c4MKey(v))) C.push(v); };
  if (want === 'none') { add([0, 1]); add([dy, 1]); add([-dy, 1]); }
  else if (!dy) { add('none'); add([dx, 1]); add([-dx, 1]); }
  else { add(c4Frac(dx, dy)); add(c4Frac(-dy, dx)); add([dy, 1]); add(c4Frac(-dx, dy)); }
  return { dx, dy, want, C }; }
ITEM.c4Slope = cpItem({ H: 262, tLine: 'gen.c4.together.slope', hint: 'gen.c4.hint.slope', rLine: 'gen.c4.reveal.slope', rSay: it => S('gen.c4.m.' + it.want, { append: true }), praise: 'praiseThink',
  make: s => { const r = c4SlopeCands(s.a, s.b); return { dx: r.dx, dy: r.dy, want: c4MKey(r.want), wv: r.want, cands: r.C, ext: c4Ext([s.a, s.b], 4), tag: 'c4-slope' + (r.want === 'none' ? '-v' : !r.dy ? '-h' : '') }; },
  draw(svg, item, tries) { const Pl = c4Plane(svg, { ...item.ext, top: 26, H: 226 }); c4Through(svg, Pl, item.a, item.b, { col: 'rgba(122,79,176,.35)', w: 2.4 }); const A = Pl.P(...item.a), B = Pl.P(...item.b); geoLine(svg, A[0], A[1], B[0], B[1], { color: C4.ln, w: 3.6 });
    c4Dot(svg, Pl, ...item.a, { name: 'a', pair: true, col: C4.pt2 }); c4Dot(svg, Pl, ...item.b, { name: 'b', pair: true, col: C4.pt2 });
    if (tries >= 3) c4RunRise(helpG(svg), Pl, item.a, item.b, { right: false }); return { Pl }; },
  h2: async (item, ctx) => { const m = helpG(ctx.svg); if (ctx.Pl && item.a[0] !== item.b[0] && item.a[1] !== item.b[1]) c4Legs(m, ctx.Pl, item.a, item.b); else if (ctx.Pl) [item.a, item.b].forEach(p => hlRing(m, ctx.Pl.P(...p), 12, H2C[0])); ciRule(m, 180, [22, 248], labelText('c4AskSlope'), C4.hl, 15); await sleep(FAST ? 10 : 250); },
  show: async (item, ctx) => { if (ctx && ctx.Pl) c4RunRise(helpG(ctx.svg), ctx.Pl, item.a, item.b, { right: false }); },
  pick: item => choosePick(shuffle(item.cands.map(v => [c4MKey(v), labelText('c4m.' + c4MKey(v)), c4MIcon(v), 'gen.c4.m.' + c4MKey(v)])), item.want, { cls: 'symonly' }),
  errOf: (it, k) => it.want === 'none' ? (k === '0' ? 'slopeVert0' : 'slopeNoDiv') : it.want === '0' ? (k === 'none' ? 'slopeHorNone' : 'slopeRun')
    : k === c4MKey(c4Frac(it.dx, it.dy)) ? 'slopeFlip' : k === c4MKey(c4Frac(-it.dy, it.dx)) ? 'slopeSign' : k === c4MKey([it.dy, 1]) ? 'slopeNoDiv' : 'slopeOff' });

/* ================= ⑥ معادلة المستقيم المرسوم (C417): ln [م، ب]؛ الخيارات: الصحيحة، وتبديل م وب، وعكس إشارة ================= */
function c4EqCands(m, b, extra = []) { const C = [[m, b]], add = p => { if (C.length < 3 && !C.some(q => c4Same(p, q))) C.push(p); };
  for (const p of [...extra, [b, m], [m, -b], [-m, b], [m, b + 1], [m + 1, b]]) add(p); return C; }
const c4EqPick = (C, want) => choosePick(shuffle(C.map(p => [c4LKey(p), c4EqVis(...p), '<i></i>', 'gen.c4.eq.' + c4LKey(p)])), want, { cls: 'eqs' });
ITEM.c4Eq = cpItem({ H: 262, tLine: 'gen.c4.together.eq', hint: 'gen.c4.hint.eq', rLine: 'gen.c4.reveal.eq', rSay: it => S('gen.c4.eq.' + it.want, { append: true }), praise: 'praiseThink',
  make: s => { const [m, b] = s.ln, p2 = Math.abs(m + b) <= 5 ? [1, m + b] : [-1, b - m]; return { want: c4LKey(s.ln), cands: c4EqCands(m, b), p2, ext: c4Ext([[0, b], p2], 5), tag: 'c4-eq' }; },
  draw(svg, item, tries) { const Pl = c4Plane(svg, { ...item.ext, top: 26, H: 226 }), [m, b] = item.ln; c4Line(svg, Pl, m, b, {});
    c4Dot(svg, Pl, 0, b, { pair: true, col: C4.pt2, side: 1 }); c4Dot(svg, Pl, ...item.p2, { pair: true, col: C4.pt2 });
    if (tries >= 3) { const h = helpG(svg), I = Pl.P(0, b), sg = item.p2[0] < 0 ? 1 : -1, k = Math.abs(m) <= 2 && Math.abs(b + 2 * sg * m) <= Pl.m - 1 && Pl.n >= 3 ? 2 : 1;   /* المثلث في الجهة الخالية من النقطة الثانية وزوجها، و«ب» في الجهة الأخرى */
      preLab(h, I[0] - 10 * sg, I[1] + (sg < 0 ? 20 : 5), labelText('c4B'), { col: C4.hl, fs: 16, anchor: sg < 0 ? 'start' : 'end', dir: 'rtl' }); c4RunRise(h, Pl, [0, b], [sg * k, b + sg * k * m], { right: false }); }   /* «ب» أولاً فيتفاداها طولا الفرقين، والمثلث خطوتان إن اتّسع فلا تتزاحم التسميات عند الأصل */ return { Pl }; },
  h2: async (item, ctx) => { const m = helpG(ctx.svg); if (ctx.Pl) hlRing(m, ctx.Pl.P(0, item.ln[1]), 14, H2C[0]); ciRule(m, 180, [22, 248], labelText('c4RuleEq'), C4.hl, 15); await sleep(FAST ? 10 : 250); },   /* أين يقطع المحور الرأسي؟ */
  pick: item => c4EqPick(item.cands, item.want),
  errOf: (it, k) => { const [m, b] = it.ln; return k === c4LKey([b, m]) ? 'eqSwapMB' : k === c4LKey([m, -b]) ? 'eqSignB' : k === c4LKey([-m, b]) ? 'eqSignM' : 'eqOff'; } });

/* ================= ⑦ هل النقطة على المستقيم؟ (C417، التحقق بالتعويض): ln [م، ب]، p [س، ص] — أعدادٌ غير سالبة في جملة التعويض ================= */
ITEM.c4On = cpItem({ H: 236, tLine: 'gen.c4.together.on', hint: 'gen.c4.hint.on', rLine: it => 'gen.c4.reveal.on.' + it.want, praise: 'praiseThink',
  make: s => { const [m, b] = s.ln, [x, y] = s.p; return { want: m * x + b === y ? 'yes' : 'no', v: m * x + b, tag: 'c4-on' }; },
  draw(svg, item, tries) { const [m, b] = item.ln; c4EqCard(svg, m, b, { y: 30, w: 200 }); const g = el('g', { 'pointer-events': 'none' }, svg);
    el('rect', { x: 110, y: 82, width: 140, height: 34, rx: 10, fill: '#fff', stroke: C4.pt2, 'stroke-width': 2 }, g); coPairText(g, 180, 106, preNum(item.p[0]), preNum(item.p[1]), 'middle', 19, C4.pt2);
    if (tries >= 3) ciEq(helpG(svg), 180, 168, c4Sub(m, item.p[0], b), C4.hl, 20); return {}; },   /* الطرف الأيسر بلا ناتج (المراجع A، 10 ج) */
  sayQ: async it => { await S('gen.c4.eq.' + c4LKey(it.ln), { append: true }); await S('gen.c4.q.onPt', { append: true }); await S('gen.c4.pt.' + preKey(it.p), { append: true }); },
  h2: async (item, ctx) => { const m = helpG(ctx.svg); el('rect', { x: 102, y: 75, width: 156, height: 48, rx: 12, fill: 'none', stroke: H2C[0], 'stroke-width': 3, 'stroke-dasharray': '7 5', 'pointer-events': 'none' }, m); cpArrow(m, [180, 74], [180, 62], { color: H2C[0] }); ciRule(m, 180, [210, 22], labelText('c4RuleOn'), C4.hl, 15); await sleep(FAST ? 10 : 250); },   /* النقطة إلى المعادلة: نعوّض */
  pick: item => yesNo(item.want),
  errOf: (it, k) => k === 'yes' ? 'eqOnYes' : 'eqOnNo' });

/* ================= ⑧ المعادلة من ميلٍ ونقطة (C417): sl الميل، p نقطة؛ ب = ص − م س ================= */
ITEM.c4FindB = cpItem({ H: 262, tLine: 'gen.c4.together.findB', hint: 'gen.c4.hint.findB', rLine: 'gen.c4.reveal.eq', rSay: it => S('gen.c4.eq.' + it.want, { append: true }), praise: 'praiseThink',
  make: s => { const m = s.sl, [x, y] = s.p, b = y - m * x;
    const k = ((m + x + y) % 3 + 3) % 3, ex = [[[m, y], [m, y + m * x]], [[m, -b], [m, y]], [[m, -b], [m, b - m]]][k];   /* ب الصحيحة ليست أصغر الخيارات دائماً (المراجع A، 3)؛ ومثله في u5.py */
    return { b, want: c4LKey([m, b]), cands: c4EqCands(m, b, ex), ext: c4Ext([[x, y], [0, b]], 5), tag: 'c4-findb' }; },
  draw(svg, item, tries) { const Pl = c4Plane(svg, { ...item.ext, H: 224 }), g = el('g', { 'pointer-events': 'none' }, svg); c4Dot(svg, Pl, ...item.p, { pair: true, col: C4.pt2 });
    el('rect', { x: 104, y: 15, width: 152, height: 28, rx: 10, fill: '#fff', stroke: C4.ln, 'stroke-width': 2 }, g); preLab(g, 214, 34, labelText('c4SlopeIs'), { col: C4.ln, fs: 16, dir: 'rtl', anchor: 'middle' }); c4MDraw(g, 140, 28, [item.sl, 1], { col: C4.ln });
    if (tries >= 3) { const h = helpG(svg), [x, y] = item.p, Q = [x - 1, y - item.sl], A = Pl.P(x, y), B = Pl.P(...Q); c4Legs(h, Pl, item.p, Q); geoLine(h, A[0], A[1], B[0], B[1], { color: 'rgba(122,79,176,.55)', w: 2.6, dash: '6 5' }); ciEq(h, 180, 252, `${c4N(item.p[1], 1)} = ${c4N(item.sl, 1)} × ${c4P(item.p[0], 1)} + ${labelText('c4B')}`, C4.hl, 17); } return { Pl }; },
  sayQ: async it => { await S('gen.c4.slope.' + (it.sl < 0 ? 'm' + -it.sl : it.sl), { append: true }); await S('gen.c4.q.findBPt', { append: true }); await S('gen.c4.pt.' + preKey(it.p), { append: true }); },
  h2: async (item, ctx) => { const m = helpG(ctx.svg); if (ctx.Pl) { const P = ctx.Pl.P(...item.p), Y = ctx.Pl.P(0, item.p[1]); geoLine(m, P[0], P[1], Y[0], Y[1], { color: H2C[0], w: 3, dash: '6 5' }); hlRing(m, P, 13, H2C[1]); } ciRule(m, 180, [252, 22], labelText('c4AskFindB'), C4.hl, 15); await sleep(FAST ? 10 : 250); },   /* من النقطة إلى المحور الرأسي: كم خطوةً نرجع؟ */
  pick: item => c4EqPick(item.cands, item.want),
  errOf: (it, k) => k === c4LKey([it.sl, it.p[1]]) ? 'eqBNoSub' : k === c4LKey([it.sl, it.p[1] + it.sl * it.p[0]]) ? 'eqBSign' : k === c4LKey([it.sl, -it.b]) ? 'eqBRev' : 'eqOff' });

/* ================= ⑨ الشارعان المتعامدان (د4، الإبداع): sl ميل الأول؛ ميل الثاني مقلوبه بإشارة معاكسة، وحاصل ضربهما −1 ================= */
ITEM.c4Perp = cpItem({ H: 262, tLine: 'gen.c4.together.perp', hint: 'gen.c4.hint.perp', rLine: 'gen.c4.reveal.perp', rSay: it => S('gen.c4.m.' + it.want, { append: true }), praise: 'praiseThink',
  make: s => { const w = c4Frac(-1, s.sl), C = [w, c4Frac(1, s.sl), [-s.sl, 1], [s.sl, 1]].filter((v, i, X) => X.findIndex(u => c4MKey(u) === c4MKey(v)) === i); return { want: c4MKey(w), cands: C, tag: 'c4-perp' }; },
  draw(svg, item, tries) { const Pl = c4Plane(svg, { n: 5, H: 232 }), g = el('g', { 'pointer-events': 'none' }, svg); c4Line(svg, Pl, item.sl, 0, { col: C4.pt, w: 4 });   /* الشارع الثاني يُرسم بعد الجواب لا قبله، فلا يُقرأ ميله بالنظر (المراجع A لبوابة M4-U5/U6، 16) */
    el('rect', { x: 104, y: 15, width: 152, height: 28, rx: 10, fill: '#fff', stroke: C4.pt, 'stroke-width': 2 }, g); preLab(g, 214, 34, labelText('c4SlopeIs'), { col: C4.pt, fs: 16, dir: 'rtl', anchor: 'middle' }); c4MDraw(g, 140, 28, [item.sl, 1], { col: C4.pt });
    if (tries >= 3) ciRule(helpG(svg), 180, 246, labelText('c4RulePerp'), C4.hl, 15); return { Pl }; },
  sayQ: async it => { await S('gen.c4.slope.' + (it.sl < 0 ? 'm' + -it.sl : it.sl), { append: true }); await S('gen.c4.q.perpEnd', { append: true }); },
  showOnOk: true, show: async (item, ctx) => { if (!ctx || !ctx.Pl) return; const h = helpG(ctx.svg), Pl = ctx.Pl; c4Line(h, Pl, -1 / item.sl, 0, { col: C4.pt2, w: 4, dash: '8 6' }); preRight(h, Pl.P(0, 0), Pl.P(1, item.sl), Pl.P(-item.sl, 1), 11); },
  h2: async (item, ctx) => { const m = helpG(ctx.svg); if (ctx.Pl) { const P = ctx.Pl.P, s = item.sl, k = Math.abs(s) > 2 ? 1 / Math.abs(s) : 1; c4Legs(m, ctx.Pl, [0, 0], [k, s * k]); const R1 = P(0, k), R2 = P(-s * k, k), O = P(0, 0); geoLine(m, O[0], O[1], R1[0], R1[1], { color: H2C[0], w: 3, dash: '3 4' }); geoLine(m, R1[0], R1[1], R2[0], R2[1], { color: H2C[1], w: 3, dash: '3 4' }); } ciRule(m, 180, [246, 22], labelText('c4AskPerp'), C4.hl, 15); await sleep(FAST ? 10 : 250); },   /* مثلث الميل ومثلثه مداراً ربع دورة */
  pick: item => choosePick(shuffle(item.cands.map(v => [c4MKey(v), labelText('c4m.' + c4MKey(v)), c4MIcon(v), 'gen.c4.m.' + c4MKey(v)])), item.want, { cls: 'symonly four' }),
  errOf: (it, k) => k === c4MKey(c4Frac(1, it.sl)) ? 'perpNoSign' : k === c4MKey([-it.sl, 1]) ? 'perpNoInv' : 'perpSame' });

/* ---------- صورة بطاقة التعليل (pfReasonPic، kind pfpic، المفتاح c4): pts [[س، ص، حرف؟]]، seg [أ، ب]، ln [م، ب]، vx، mirror ---------- */
function c4Pic(g, P) { const pts = (P.pts || []).map(p => p.slice(0, 2)), Pl = c4Plane(g, { ...c4Ext(pts.length ? pts : [[0, 0]], P.n || 4), top: 12, H: 200, tfs: 15, pfs: 17 });   /* صورة التعليل تُصغَّر: خطُّها أكبر (المراجع B، 7) */
  if (P.ln) c4Line(g, Pl, P.ln[0], P.ln[1], {}); if (P.ln2) { c4Line(g, Pl, P.ln2[0], P.ln2[1], { col: C4.pt2, dash: '8 6' }); preRight(g, Pl.P(0, P.ln[1]), Pl.P(1, P.ln[0] + P.ln[1]), Pl.P(-P.ln[0], 1 + P.ln[1]), 10); }   /* شارعان متعامدان (المراجع A، 9) */ if (P.vx != null) c4Line(g, Pl, 0, 0, { vx: P.vx });
  if (P.seg) { const A = Pl.P(...P.seg[0]), B = Pl.P(...P.seg[1]); geoLine(g, A[0], A[1], B[0], B[1], { color: C4.ln, w: 3.4 }); if (P.rr) c4RunRise(g, Pl, P.seg[0], P.seg[1], { abs: true }); }
  if (P.mirror) { const [a, b] = pts, A = Pl.P(...a), B = Pl.P(...b); geoLine(g, A[0], A[1], B[0], B[1], { color: C4.hl, w: 2.2, dash: '6 5' }); }
  (P.pts || []).forEach(([x, y, k], i) => c4Dot(g, Pl, x, y, { pair: true, name: k, col: i ? C4.pt2 : C4.pt })); }

/* ================= المشاهد ================= */
/* د1: الكنز في (−3 ، 2) ليس في (3 ، 2) */
SCENES.c4Hook = async c => { const L = c.lines, svg = m3Stage(262), Pl = c4Plane(svg, { n: 5, top: 16 }); c4Dot(svg, Pl, -3, 2, { art: 'treasure', pair: true }); SFX.tick(); await c4Say(L, 0);
  c4Dot(svg, Pl, 3, 2, { pair: true, col: C4.pt }); SFX.tick(); await c4Say(L, 1);
  const g = el('g', { 'pointer-events': 'none' }, svg), A = Pl.P(-3, 2), B = Pl.P(3, 2), V1 = Pl.P(0, -5), V2 = Pl.P(0, 5); geoLine(g, V1[0], V1[1], V2[0], V2[1], { color: C4.hl, w: 5 }); geoLine(g, A[0], A[1], B[0], B[1], { color: C4.hl, w: 2.4, dash: '6 5' }); await c4Say(L, 2); for (const l of L.slice(3)) await S(l); };
/* د1: الأرباع الأربعة بإشاراتها، ونقاط المحورين بلا ربع */
SCENES.c4QuadShow = async c => { const L = c.lines, svg = m3Stage(262), Pl = c4Plane(svg, { n: 5, top: 16 }); await c4Say(L, 0);
  const sh = el('g', { 'pointer-events': 'none' }, svg);
  for (const [i, [k, sx, sy]] of [['q1', 1, 1], ['q2', -1, 1], ['q3', -1, -1], ['q4', 1, -1]].entries()) { const n = Pl.n, c = Pl.c, C = Pl.C;
    el('rect', { x: Math.min(C[0], C[0] + sx * n * c), y: Math.min(C[1], C[1] - sy * n * c), width: n * c, height: n * c, fill: C4.quad[i] }, sh);
    preLab(sh, C[0] + sx * n * c / 2, C[1] - sy * n * c / 2 - 4, labelText('c4Q.' + k), { fs: 14, col: C4.ink, dir: 'rtl' }); coPairText(sh, C[0] + sx * n * c / 2, C[1] - sy * n * c / 2 + 16, sx > 0 ? '+' : '−', sy > 0 ? '+' : '−', 'middle', 15, C4.ln); SFX.tick();   /* قالب الإشارتين زوجٌ كالأزواج حوله: من اليمين بالمشرقية (D280؛ المراجع A لبوابة M4-U5/U6، 1) */
    if (i === 1 || i === 3) await c4Say(L, (i + 1) / 2); else await sleep(FAST ? 10 : 500); }
  c4Dot(svg, Pl, 0, 4, { pair: true, col: C4.q }); c4Dot(svg, Pl, -3, 0, { pair: true, col: C4.q, below: true }); SFX.tick(); await c4Say(L, 3); for (const l of L.slice(4)) await S(l); };
/* د1: السالب يساراً وإلى أسفل */
SCENES.c4SignShow = async c => { const L = c.lines, svg = m3Stage(262), Pl = c4Plane(svg, { n: 5, top: 16 });
  for (const [i, [x, y]] of [[-3, 2], [3, -2]].entries()) { const m = await c4Walk(svg, Pl, x, y, { ms: 200 }); c4Dot(svg, Pl, x, y, { pair: true, col: i ? C4.pt2 : C4.pt }); await c4Say(L, i); m.remove(); }
  for (const l of L.slice(2)) await S(l); };
/* د2: من (1 ، 1) إلى (4 ، 5): الجمع سبعة، والوتر خمسة */
SCENES.c4DistShow = async c => { const L = c.ans ? [null, ...c.lines] : c.lines, svg = m3Stage(262), Pl = c4Plane(svg, { n: 5 }), a = c.a || [1, 1], b = c.b || [4, 5], A = Pl.P(...a), B = Pl.P(...b);
  geoLine(svg, A[0], A[1], B[0], B[1], { color: C4.ln, w: 3.6 }); c4Dot(svg, Pl, ...a, { pair: true, col: C4.pt2 }); c4Dot(svg, Pl, ...b, { pair: true, col: C4.pt2, side: 1 }); await c4Say(L, 0);   /* اسم النقطة يمينها، والطول يسار القطعة (المعروف (1)) */
  const h = el('g', { 'pointer-events': 'none' }, svg); c4RunRise(h, Pl, a, b, { abs: true }); SFX.tick(); if (c.ans) hlSeg(h, A, B, C4.hl); await c4Say(L, 1);   /* ans: المعطى صامتاً، ثم القياس فالحساب */
  if (c.noAns) { for (const l of L.slice(2)) await S(l); return; }   /* الإشعال يقف عند السؤال، والوتر بعد التوقّع والقياس (المراجع A لبوابة M4-U5/U6، 12) */
  const dx = Math.abs(b[0] - a[0]), dy = Math.abs(b[1] - a[1]), d = Math.round(Math.hypot(dx, dy)); ciEq(h, 180, 26, `${dx} × ${dx} + ${dy} × ${dy} = ${d * d}`, C4.ok, 18);
  preLab(h, (A[0] + B[0]) / 2 - 12, (A[1] + B[1]) / 2 - 4, MS(String(d)), { col: C4.ok, fs: 19, anchor: 'end' }); SFX.tick(); await c4Say(L, 2); for (const l of L.slice(3)) await S(l); };
/* د2: الميل صعودٌ على مشي، والرأسي لا ميل له، والأفقي ميله صفر */
SCENES.c4SlopeShow = async c => { const L = c.lines, svg = m3Stage(262), Pl = c4Plane(svg, { n: 5 }); let g = el('g', { 'pointer-events': 'none' }, svg);
  const seg = (a, b, col = C4.ln) => { const A = Pl.P(...a), B = Pl.P(...b); geoLine(g, A[0], A[1], B[0], B[1], { color: col, w: 3.6 }); c4Dot(g, Pl, ...a, { col: C4.pt2 }); c4Dot(g, Pl, ...b, { col: C4.pt2 }); };
  seg([1, 1], [4, 5]); c4RunRise(g, Pl, [1, 1], [4, 5], { right: false }); await c4Say(L, 0); c4MDraw(g, 326, 70, [4, 3]); SFX.tick(); await c4Say(L, 1);
  g.remove(); g = el('g', { 'pointer-events': 'none' }, svg); seg([-3, -4], [-3, 3]); preLab(g, Pl.P(-3, 4)[0], Pl.P(-3, 4)[1], labelText('c4NoSlope'), { col: C4.ln, fs: 15, dir: 'rtl' }); seg([0, -2], [4, -2], C4.pt); preLab(g, Pl.P(2, -3)[0], Pl.P(2, -3)[1] + 6, labelText('c4ZeroSlope'), { col: C4.pt, fs: 15, dir: 'rtl' }); SFX.tick(); await c4Say(L, 2);
  for (const l of L.slice(3)) await S(l); };
/* د3: كل مستقيمٍ يمرّ بالأصل معادلته ص = 0؟ */
SCENES.c4LineHook = async c => { const L = c.lines, svg = m3Stage(262), Pl = c4Plane(svg, { n: 5, top: 50 }); c4EqCard(svg, 0, 0); const A = Pl.P(-5, 0), B = Pl.P(5, 0); geoLine(svg, A[0], A[1], B[0], B[1], { color: C4.ln, w: 4 }); await c4Say(L, 0);
  c4Line(svg, Pl, 2, 0, { col: C4.q, w: 4 }); SFX.tick(); await c4Say(L, 1); for (const l of L.slice(2)) await S(l); };
/* د3: الميل 2 والمقطع 1: النقاط على المستقيم كلها تحقّق ص = 2 س + 1 */
SCENES.c4LineShow = async c => { const L = c.lines, svg = m3Stage(262), Pl = c4Plane(svg, { n: 5, top: 50 }), [m, b] = c.ln || [2, 1];
  const pts = [[0, b], [1, m + b], [2, 2 * m + b], [-1, b - m], [-2, b - 2 * m]].filter(p => Math.abs(p[1]) < 5);   /* لا نقطة على حافّة المستوى تحت بطاقة المعادلة */ c4Dot(svg, Pl, 0, b, { pair: true, col: C4.pt2, side: 1 }); await c4Say(L, 0);
  for (const p of pts.slice(1)) { c4Dot(svg, Pl, ...p, { pair: true, col: C4.pt2, fs: 11, below: p[1] >= Pl.m ? false : undefined }); SFX.tick(); await sleep(FAST ? 10 : 450); }
  c4Line(svg, Pl, m, b, {}); c4EqCard(svg, m, b); await c4Say(L, 1);
  const lat = preLab(svg, 286, 24, '(y = m x + b)', { col: '#7d8a90', fs: 12 });   /* الرمز اللاتيني عند أول ظهور فقط (D190) */ lat.style.opacity = 0;
  const I = Pl.P(0, b), h = el('g', { 'pointer-events': 'none' }, svg); el('circle', { cx: I[0], cy: I[1], r: 11, fill: 'none', stroke: C4.hl, 'stroke-width': 3 }, h); preLab(h, I[0] - 14, I[1] + 5, labelText('c4B'), { col: C4.hl, fs: 17, anchor: 'end', dir: 'rtl' }); SFX.tick(); await c4Say(L, 2);
  lat.style.opacity = 1; for (const l of L.slice(3)) await S(l); };
/* د3: التحقق بالتعويض: (2 ، 5) على المستقيم، و(2 ، 2) ليست عليه */
SCENES.c4CheckShow = async c => { const L = c.lines, svg = m3Stage(250), [m, b] = c.ln || [2, 1]; c4EqCard(svg, m, b, { y: 16, w: 200 });
  for (const [i, [x, y]] of (c.pts || [[2, 5], [2, 2]]).entries()) { const yy = 84 + i * 84, ok = m * x + b === y, g = el('g', { 'pointer-events': 'none' }, svg);
    el('rect', { x: 222, y: yy - 22, width: 112, height: 32, rx: 10, fill: '#fff', stroke: C4.pt2, 'stroke-width': 2 }, g); coPairText(g, 278, yy, preNum(x), preNum(y), 'middle', 17, C4.pt2);
    ciEq(g, 116, yy, `${m} × ${x} + ${b} = ${m * x + b}`, ok ? C4.ok : C4.q, 18); preLab(g, 180, yy + 34, labelText(ok ? 'c4OnYes' : 'c4OnNo'), { col: ok ? C4.ok : C4.q, fs: 15, dir: 'rtl' }); SFX.tick(); await c4Say(L, i); }
  for (const l of L.slice(2)) await S(l); };
/* د4: المدينة في الأرباع: مبانٍ، وطريقٌ بطوله وميله، وشارعٌ بمعادلته، وشارعان متعامدان */
SCENES.c4CityShow = async c => { const L = c.lines, svg = m3Stage(262), Pl = c4Plane(svg, { n: 5, top: 16 }), B = { a: [-3, 2], b: [1, -1], j: [-3, -2], d: [2, 3] };
  for (const [k, p] of Object.entries(B)) c4Dot(svg, Pl, ...p, { art: 'house', name: k, pair: true, fs: 11, col: C4.pt }); await c4Say(L, 0);
  if (c.mapOnly) { for (const l of L.slice(1)) await S(l); return; }   /* المشروع: الخريطة بمعطياتها وحدها، والحساب للطفل في البنود (المراجع A لبوابة M4-U5/U6، 5) */
  let g = el('g', { 'pointer-events': 'none' }, svg); const A1 = Pl.P(...B.a), B1 = Pl.P(...B.b); geoLine(g, A1[0], A1[1], B1[0], B1[1], { color: C4.pt2, w: 4 }); c4RunRise(g, Pl, B.a, B.b, { abs: true }); SFX.tick(); await c4Say(L, 1);
  g.remove(); g = el('g', { 'pointer-events': 'none' }, svg); c4Line(g, Pl, 1, 1, { col: C4.ln, w: 4 }); c4EqText(g, 92, 32, 1, 1, { fs: 18 }); c4Dot(g, Pl, 0, 1, { col: C4.ok }); SFX.tick(); await c4Say(L, 2);
  c4Line(g, Pl, -1, 5, { col: C4.pt2, w: 4, dash: '8 6' }); preRight(g, Pl.P(2, 3), Pl.P(3, 4), Pl.P(3, 2), 10); SFX.tick(); await c4Say(L, 3); for (const l of L.slice(4)) await S(l); };
/* د4 (الإبداع): شارعان متعامدان؛ الزاوية تُقاس، ومثلث الميل يدور معه ربع دورة، ثم حاصل ضرب الميلين (المراجع A لبوابة M4-U5/U6، 12) */
SCENES.c4PerpShow = async c => { const L = c.lines, s = c.sl || 2, svg = m3Stage(262), Pl = c4Plane(svg, { n: 3, top: 76 }), P = Pl.P, O = P(0, 0), g = el('g', { 'pointer-events': 'none' }, svg);
  c4Line(g, Pl, s, 0, { col: C4.pt, w: 4 }); c4Legs(g, Pl, [0, 0], [1, s]); preLab(g, (O[0] + P(1, 0)[0]) / 2 + 3, O[1] - 6, MS('1'), { col: H2C[0], fs: 15 }); preLab(g, P(1, 0)[0] + 9, (O[1] + P(1, s)[1]) / 2 + 5, MS(String(Math.abs(s))), { col: H2C[1], fs: 15, anchor: 'start' }); SFX.tick(); await c4Say(L, 0);
  c4Line(g, Pl, -1 / s, 0, { col: C4.pt2, w: 4, dash: '8 6' }); preRight(g, O, P(-1, -s), P(s, -1), 12); degText(g, O[0] + 16, O[1] + 42, 90, { size: 14, color: C4.ok });   /* القائمة في الزاوية السفلى، والعليا لمثلثي الميل */ SFX.tick(); await c4Say(L, 1);
  const R1 = P(0, 1), R2 = P(-s, 1); geoLine(g, O[0], O[1], R1[0], R1[1], { color: H2C[0], w: 3.2, dash: '7 5' }); geoLine(g, R1[0], R1[1], R2[0], R2[1], { color: H2C[1], w: 3.2, dash: '7 5' }); hlRing(g, R2, 11); SFX.tick(); await c4Say(L, 2);
  const east = SET.digits === 'east', X = east ? [266, 228, 180, 132, 94] : [94, 132, 180, 228, 266];   /* حاصل الضرب: من اليمين بالمشرقية ومن اليسار بالغربية (D280 (2)) */
  el('rect', { x: 62, y: 18, width: 236, height: 46, rx: 12, fill: '#fff', stroke: C4.ln, 'stroke-width': 2 }, g); c4MDraw(g, X[0], 38, [s, 1], { col: C4.pt }); preLab(g, X[1], 46, '×', { col: C4.ink, fs: 20 }); c4MDraw(g, X[2], 38, c4Frac(-1, s), { col: C4.pt2 }); preLab(g, X[3], 46, '=', { col: C4.ink, fs: 20 }); c4MDraw(g, X[4], 38, [-1, 1], { col: C4.ok });
  SFX.tick(); await c4Say(L, 3); for (const l of L.slice(4)) await S(l); };
WRAP_ART.coord4Art = svg => { const g = el('g', { 'pointer-events': 'none', transform: 'translate(64 18) scale(.64)' }, svg), Pl = c4Plane(g, { n: 4, top: 10, H: 230, nums: false });
  [[2, 3], [-3, 1], [-2, -3], [3, -2]].forEach((p, i) => c4Dot(g, Pl, ...p, { col: [C4.pt, C4.pt2, C4.ln, C4.ok][i], r: 8 })); };
