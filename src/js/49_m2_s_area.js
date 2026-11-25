/* =====================================================================
   S2-U7 «سور المدينة وأرضها» (المرحلة 2، نوفمبر 2026)
   د1 المحيط (C200) · د2 محيط المربع والمستطيل (C201) والضلع المجهول من المحيط (C202) · د3 المساحة بعدّ المربعات (C203) والسنتيمتر المربع (C204) والتقدير (C205)
   د4 مساحة المستطيل (C206) والضلع المجهول من المساحة (C207) · د5 الشكل المركّب: مساحته (C208) ومحيطه (C209)
   د6 المحيط والمساحة معاً (C210) والمسائل الحياتية (C211) · د7 «خطّط أرضك» والمتر المربع (C212، منقول من د6 لأنه فوق السقف، D248) · د8 الاختبار
   الشكل على الشبكة صفوفٌ من الأعلى: '#' مربع كامل، و b c a d نصف مربع مائل يُكتب بموضعه من الشكل: b ركن أعلى يسار الشكل (يُملأ نصفه السفلي الأيمن)، c أعلى يمين (السفلي الأيسر)، a أسفل يسار (العلوي الأيمن)، d أسفل يمين (العلوي الأيسر).
   المحيط والمساحة يُحسبان من الشكل نفسه، لا يُكتبان باليد. والأعداد تُقال بكلمتها (حتى 99) والوحدة في السؤال.
   ===================================================================== */
const ARC = { fill: '#cfe6f5', edge: '#24323a', grid: '#d5e2ea', tile: '#f2d38a', tileEd: '#b9862a', fence: '#b9794e', perim: '#c8392d', ok: '#2f9d6b', ink: '#33454c' };
const AR_U = { cm: ['rulCm', 'arCm2'], m: ['lenM', 'arM2'] };
/* الوحدة منطوقة بعد عددها: «اثنا عشر سنتيمتراً»، «ستة أمتار مربعة» */
async function sayArea(n, u = 'cm', opt = {}) { const k = u + '2'; opt = { append: true, ...opt }; if (n === 1) return S(`gen.ar.${k}.one`, opt); if (n === 2) return S(`gen.ar.${k}.two`, opt); await S(numc(n), { noGap: true, append: opt.append }); return S(`gen.ar.${k}.${n <= 10 ? 'few' : 'many'}`, opt); }
async function sayLenU(n, u = 'cm', opt = {}) { if (u === 'cm') return sayLen(n, 'cm', opt); opt = { append: true, ...opt }; if (n === 1) return S('gen.ar.m.one', opt); if (n === 2) return S('gen.ar.m.two', opt); await S(numc(n), { noGap: true, append: opt.append }); return S(`gen.ar.m.${n <= 10 ? 'few' : 'many'}`, opt); }
/* ---------- الشكل على الشبكة ---------- */
function shpParse(rows) { const full = [], half = [], H = rows.length, W = Math.max(...rows.map(r => r.length)); rows.forEach((r, y) => [...r].forEach((ch, x) => { if (ch === '#') full.push([x, y]); else if ('abcd'.includes(ch)) half.push([x, y, ch]); })); return { full, half, W, H }; }
const shpArea = rows => { const p = shpParse(rows); return p.full.length + p.half.length / 2; };
const shpHas = (p, x, y) => p.full.some(q => q[0] === x && q[1] === y);
function shpPerim(rows) { const p = shpParse(rows); let n = 0; for (const [x, y] of p.full) for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) if (!shpHas(p, x + dx, y + dy)) n++; return n; }
/* حدود الشكل قطعاً مستقيمة بالترتيب (مع عقارب الساعة على الشاشة): [{ a، b، len، dir }] */
function shpSegs(rows) { const p = shpParse(rows), E = new Map(), key = q => q.join(',');
  for (const [x, y] of p.full) { if (!shpHas(p, x, y - 1)) E.set(key([x, y]), [x + 1, y]); if (!shpHas(p, x + 1, y)) E.set(key([x + 1, y]), [x + 1, y + 1]); if (!shpHas(p, x, y + 1)) E.set(key([x + 1, y + 1]), [x, y + 1]); if (!shpHas(p, x - 1, y)) E.set(key([x, y + 1]), [x, y]); }
  const start = [...E.keys()].sort()[0].split(',').map(Number); let cur = start, segs = [], seg = null, guard = 0;
  do { const nx = E.get(key(cur)), d = [nx[0] - cur[0], nx[1] - cur[1]]; if (seg && seg.dir[0] === d[0] && seg.dir[1] === d[1]) { seg.b = nx; seg.len++; } else { seg = { a: cur, b: nx, dir: d, len: 1 }; segs.push(seg); } cur = nx; } while ((cur[0] !== start[0] || cur[1] !== start[1]) && guard++ < 400);
  if (segs.length > 1 && segs[0].dir[0] === seg.dir[0] && segs[0].dir[1] === seg.dir[1] && seg !== segs[0]) { segs[0].a = seg.a; segs[0].len += seg.len; segs.pop(); }
  return segs; }
/* رسم: شبكة (grid) والشكل ملوّناً؛ c ضلع المربع؛ o.at مركز الشكل */
function shpDraw(parent, rows, o = {}) { const p = shpParse(rows), c = o.c || (o.labeled ? Math.min(40, 212 / p.W, 160 / p.H) : Math.min(30, 280 / (p.W + 2), 190 / (p.H + 2))),   /* الشكل بأطواله: مربعه أكبر، فالكتابة عند الركن الداخلي تتّسع */ at = o.at || [180, 120], x0 = at[0] - p.W * c / 2, y0 = at[1] - p.H * c / 2, g = el('g', { 'data-shape': 1 }, parent), X = x => x0 + x * c, Y = y => y0 + y * c;
  if (o.grid !== false) { const gx = Math.ceil(p.W / 2) + 1, gy = Math.ceil(p.H / 2) + 1; for (let i = -1; i <= p.W + 1; i++) geoLine(g, X(i), Y(-1), X(i), Y(p.H + 1), { color: ARC.grid, w: 1.2 }); for (let j = -1; j <= p.H + 1; j++) geoLine(g, X(-1), Y(j), X(p.W + 1), Y(j), { color: ARC.grid, w: 1.2 }); }
  const fill = o.fill || ARC.fill; for (const [x, y] of p.full) el('rect', { x: X(x), y: Y(y), width: c, height: c, fill, stroke: o.cellLines === false ? 'none' : '#9fc3dc', 'stroke-width': 1 }, g);
  const T = { b: (x, y) => [[X(x), Y(y + 1)], [X(x + 1), Y(y + 1)], [X(x + 1), Y(y)]], c: (x, y) => [[X(x), Y(y)], [X(x), Y(y + 1)], [X(x + 1), Y(y + 1)]], a: (x, y) => [[X(x), Y(y)], [X(x + 1), Y(y)], [X(x + 1), Y(y + 1)]], d: (x, y) => [[X(x), Y(y)], [X(x + 1), Y(y)], [X(x), Y(y + 1)]] };
  for (const [x, y, ch] of p.half) el('polygon', { points: polyStr(T[ch](x, y)), fill, stroke: '#9fc3dc', 'stroke-width': 1 }, g);
  let segs = []; if (p.full.length && !p.half.length) { segs = shpSegs(rows); const d = segs.map((s, i) => (i ? 'L' : 'M') + X(s.a[0]) + ' ' + Y(s.a[1])).join(' ') + 'Z'; el('path', { d, fill: 'none', stroke: o.edge || ARC.edge, 'stroke-width': 3.4, 'stroke-linejoin': 'round' }, g); }
  const halfC = ([x, y, ch]) => { const f = { b: [2, 2], c: [1, 2], a: [2, 1], d: [1, 1] }[ch]; return [X(x + f[0] / 3), Y(y + f[1] / 3)]; };   /* مركز نصف المربع المائل */
  return { g, p, c, X, Y, x0, y0, segs, halfC }; }
/* طول كل قطعة مكتوباً خارج الشكل؛ hide: أرقام القطع التي لا يُكتب طولها (؟) */
function shpLabels(parent, D, o = {}) { const g = el('g', { 'pointer-events': 'none' }, parent), u = labelText(o.unit === 'm' ? 'lenM' : 'rulCm');
  /* وقطعتان قصيرتان عند ركن داخلي تتقارب أطوالهما: تُزاح الكتابة خارجاً حتى لا تلمس كتابة قبلها */
  const boxes = [], hit = b => boxes.some(q => b[0] < q[2] && b[2] > q[0] && b[1] < q[3] && b[3] > q[1]);
  /* القصيرة أولاً (المراجع B لبوابة U6/U7، 9): كتابة القطعة القصيرة عند الركن الداخلي لا مكان آخر لها، والطويلة تنزاح على طولها */
  D.segs.map((s, i) => [s, i]).sort((p, q) => p[0].len - q[0].len).forEach(([s, i]) => { const mx = (D.X(s.a[0]) + D.X(s.b[0])) / 2, my = (D.Y(s.a[1]) + D.Y(s.b[1])) / 2, nx = s.dir[1], ny = -s.dir[0], hid = (o.hide || []).includes(i), txt = hid ? '؟' : `${s.len} ${u}`, w = 8.6 * txt.length + 6;
    const half = s.len * D.c / 2; let x, y, b, found = null;
    for (const d of [0, 12, 24, 36]) { for (const t of [0, 12, -12, 24, -24, 36, -36, 48, -48]) { if (Math.abs(t) > half) continue; x = mx + s.dir[0] * t + nx * (6 + d) + nx * (w / 2 + 4); y = my + s.dir[1] * t + ny * (16 + d) + 5; b = [x - w / 2, y - 15, x + w / 2, y + 3]; if (!hit(b)) { found = [x, y, b]; break; } } if (found) break; }
    if (found) [x, y, b] = found; boxes.push(b); arLab(g, x - nx * (w / 2 + 4), y, txt, nx, hid ? css('--think') : ARC.ink);
    if (hid) geoLine(g, D.X(s.a[0]), D.Y(s.a[1]), D.X(s.b[0]), D.Y(s.b[1]), { color: css('--think'), w: 5 }); }); return g; }   /* الضلع غير المكتوب ملوّن بلون «؟» */
/* مستطيل بطولين مكتوبين (بلا شبكة، أو بشبكة grid) */
function rectLab(parent, w, h, o = {}) { const k = Math.min((o.maxW || 220) / w, (o.maxH || 130) / h, 34), W = w * k, Hh = h * k, x0 = 180 - W / 2, y0 = (o.cy || 116) - Hh / 2, g = el('g', {}, parent), u = labelText(o.unit === 'm' ? 'lenM' : 'rulCm');
  el('rect', { x: x0, y: y0, width: W, height: Hh, fill: o.fill || ARC.fill, stroke: ARC.edge, 'stroke-width': 3.4 }, g);
  if (o.grid === 'full') { for (let i = 1; i < w; i++) geoLine(g, x0 + i * k, y0, x0 + i * k, y0 + Hh, { color: '#9fc3dc', w: 1.2 }); for (let j = 1; j < h; j++) geoLine(g, x0, y0 + j * k, x0 + W, y0 + j * k, { color: '#9fc3dc', w: 1.2 }); }
  else if (o.grid === 'edge') { for (let i = 1; i < w; i++) geoLine(g, x0 + i * k, y0, x0 + i * k, y0 + k, { color: '#9fc3dc', w: 1.2 }); for (let j = 1; j < h; j++) geoLine(g, x0 + W - k, y0 + j * k, x0 + W, y0 + j * k, { color: '#9fc3dc', w: 1.2 }); geoLine(g, x0, y0 + k, x0 + W, y0 + k, { color: '#9fc3dc', w: 1.2 }); geoLine(g, x0 + W - k, y0, x0 + W - k, y0 + Hh, { color: '#9fc3dc', w: 1.2 }); }
  if (o.sq) [[x0 + W / 2, y0, 0], [x0 + W, y0 + Hh / 2, 1], [x0 + W / 2, y0 + Hh, 0], [x0, y0 + Hh / 2, 1]].forEach(([x, y, v]) => v ? geoLine(g, x - 7, y, x + 7, y, { color: ARC.edge, w: 2.6 }) : geoLine(g, x, y - 7, x, y + 7, { color: ARC.edge, w: 2.6 }));   /* علامات تساوي الأضلاع الأربعة */
  if (o.labels !== false) { arLab(g, 180, y0 - 12, o.hideW ? '؟' : `${w} ${u}`, 0, o.hideW ? css('--think') : ARC.ink); if (o.sq !== true || o.showH) arLab(g, x0 + W + 4, y0 + Hh / 2 + 6, o.hideH ? '؟' : `${h} ${u}`, 1, o.hideH ? css('--think') : ARC.ink); }
  return { g, x0, y0, W, H: Hh, k }; }
/* نصّ طولٍ بجانب ضلع: يُزاح خارجاً بنصف عرضه التقريبي فلا يغطّي الضلع (nx: −1 يسار، 0 فوق/تحت، 1 يمين) */
function arLab(g, x, y, txt, nx = 0, col = ARC.ink) { const w = 8.6 * String(txt).length + 6, t = el('text', { x: x + nx * (w / 2 + 4), y, 'text-anchor': 'middle', 'font-size': 15, 'font-weight': 800, fill: col, direction: 'rtl' }, g); t.textContent = txt; return t; }
const arStage = (H = 240) => { const svg = newStage(H, { oasis: false, ground: 0 }); plyFrame(svg, H - 28); return svg; };
const arNums = (w, lo = 1) => nearNums(w, 99, lo);
/* الخيارات الثلاثة: الجواب ومشتّتان من أخطاء حقيقية، ورتبة الجواب بينها عشوائية (المراجع B لبوابة U6/U7، 3: كان الأوسط أو الأكبر دائماً؛ والمراجع A، 13) */
function rankMix(want, cands, lo = 1, hi = 99) { const c = [...new Set(cands.filter(v => Number.isInteger(v) && v !== want && v >= lo && v <= hi))], L = shuffle(c.filter(v => v < want)), G = shuffle(c.filter(v => v > want)), r = Math.floor(rand() * 3);
  let pick = [...L.slice(0, r), ...G.slice(0, 2 - r)]; for (const v of [...L, ...G]) if (pick.length < 2 && !pick.includes(v)) pick.push(v);
  for (const v of shuffle(nearNums(want, hi, lo))) if (pick.length < 2 && v !== want && !pick.includes(v)) pick.push(v); return shuffle([want, ...pick.slice(0, 2)]); }
/* بند عددي عام: draw يرسم، want الجواب، errOf الخطأ؛ والحلّ المشترك together(svg، item) يرسم ما يساعد ثم يُسأل */
const arItem = d => ({ ...numItem,
  make(spec) { const it = { ...spec, ...d.make(spec) }; it.nums = d.nums ? d.nums(it) : arNums(it.want); return it; },
  async ask(item, mode, tries) { const svg = arStage(d.H || 240), ctx = d.draw(svg, item) || {}; ctx.svg = svg;
    if (tries >= 3) { await S(d.tLine); if (d.together) await d.together(item, ctx); } else await S(item.q);
    const np = numberPick(item.nums, item.want, { west: true }); return { ans: await np.p, ctx: { ...ctx, np } }; },
  judge(item, k) { return k === item.want ? { ok: true } : { ok: false, err: d.errOf(item, k) }; },
  async hint2(item, r) { if (d.h2 && r && r.ctx && r.ctx.svg) await d.h2(item, r.ctx, r.ans); await S(d.hint); }, async together() {},   /* المستوى الثاني فعلٌ على المسرح ثم الجملة (المراجعان A-9 وB-5 لبوابة U6/U7) */
  async reveal(item, r) { if (d.show) await d.show(item, r.ctx); await S(d.rLine, { noGap: true }); await (d.area ? sayArea(item.want, item.unit || 'cm') : sayLenU(item.want, item.unit || 'cm')); },
  praise: () => 'praiseCount', twin(item) { return item.twin || null; } });
/* المحيط يُمشى: شارات العدّ على الأضلاع، أو جمع الأطوال المكتوبة */
/* والعدّ الجاري رقمٌ صغير بهالة بيضاء داخل الشكل عند كل قطعة، لا شارة: القطع القصيرة عند الأركان متقاربة (30 وحدة) فتتراكب الشارات (الفحص: ladder) */
const runNum = (m, x, y, n) => { const t = el('text', { x, y: y + 5, 'text-anchor': 'middle', 'font-size': 14, 'font-weight': 800, fill: css('--think'), stroke: '#fff', 'stroke-width': 3.5, 'paint-order': 'stroke', direction: 'ltr' }, m); t.textContent = String(n); return t; };
async function walkSegs(svg, D, o = {}) { const m = helpG(svg); let tot = 0; for (const [si, s] of D.segs.entries()) { if (o.upTo != null && si >= o.upTo) break; tot += s.len; const quiet = o.stopLast && si === D.segs.length - 1;   /* الحلّ المشترك يقف قبل الخطوة الأخيرة: آخر قطعة تُرسم بلا مجموعها (المراجع B لبوابة U6/U7، 6) */ const mx = (D.X(s.a[0]) + D.X(s.b[0])) / 2, my = (D.Y(s.a[1]) + D.Y(s.b[1])) / 2; geoLine(m, D.X(s.a[0]), D.Y(s.a[1]), D.X(s.b[0]), D.Y(s.b[1]), { color: ARC.perim, w: 5 }); if (o.badges && !quiet) { const sg = o.out ? -1 : 1; runNum(m, mx - sg * s.dir[1] * 13, my + sg * s.dir[0] * 13, tot); SFX.tick(); await S(numw(tot), { noGap: true, num: true }); } else await sleep(FAST ? 10 : 220); } return m; }

/* ================= ① محيط مضلّع بأطوال أضلاعه (C200): k من مكتبة المضلعات، lens أطوال الأضلاع بالترتيب ================= */
ITEM.perimSides = arItem({ tLine: 'gen.ar.together.sides', hint: 'gen.ar.hint.sides', rLine: 'gen.ar.reveal.perim',
  make: s => ({ want: s.lens.reduce((a, b) => a + b, 0), tag: 'perim-sides' }),
  draw(svg, item) { const R = polyAt(svg, item.k, [180, 122], { rot: item.rot || 0, dots: false }), u = labelText(item.unit === 'm' ? 'lenM' : 'rulCm');
    /* الطول خارج الضلع على عموده، أبعد من شارة الحلّ المشترك على منتصفه (15) بنصف امتداد النصّ في اتجاه العمود (الفحص: ladder) */
    item.lens.forEach((L, i) => { const s = R.sides[i]; if (!s) return; const a = R.P[i], b = R.P[(i + 1) % R.n], dl = Math.hypot(b[0] - a[0], b[1] - a[1]) || 1; let nx = (b[1] - a[1]) / dl, ny = -(b[0] - a[0]) / dl; if (nx * (s.mid[0] - R.cen[0]) + ny * (s.mid[1] - R.cen[1]) < 0) { nx = -nx; ny = -ny; }
      const txt = `${L} ${u}`, w = 8.6 * txt.length + 6, off = 19 + Math.abs(nx) * w / 2 + Math.abs(ny) * 10, t = el('text', { x: s.mid[0] + nx * off, y: s.mid[1] + ny * off + 6, 'text-anchor': 'middle', 'font-size': 15, 'font-weight': 800, fill: ARC.ink, direction: 'rtl' }, svg); t.textContent = txt; }); return { R }; },
  nums: it => { const mn = Math.min(...it.lens), mx = Math.max(...it.lens); return rankMix(it.want, [it.want - mn, it.want - mx, it.want + mn]); },   /* نسي ضلعاً، أو عدّ ضلعاً مرّتين */
  h2: async (item, ctx) => { const m = helpG(ctx.svg); let tot = 0; for (const i of [0, 1]) { const sd = ctx.R.sides[i]; if (!sd) break; tot += item.lens[i]; polyHl(ctx.R, 'side', i, ARC.perim); badge(m, sd.mid[0], sd.mid[1], tot, css('--think')); SFX.tick(); await sleep(FAST ? 10 : 350); } },
  async together(item, ctx) { const m = helpG(ctx.svg), C = ctx.R.cen; let tot = 0; for (const [i, s] of ctx.R.sides.entries()) { tot += item.lens[i]; polyHl(ctx.R, 'side', i, ARC.perim); if (i === ctx.R.sides.length - 1) break; badge(m, s.mid[0], s.mid[1], tot, css('--think')); SFX.tick(); await S(numw(tot), { noGap: true, num: true }); } },   /* يقف قبل الضلع الأخير: آخر جمع للطفل */   /* الشارة على منتصف الضلع، وطوله مكتوب أبعد منها (32) */
  errOf: (it, k) => k < it.want ? 'perimMiss' : 'perimOff' });
/* ================= ② المحيط على الشبكة (C200): rows، ومربع الشبكة سنتيمتر ================= */
ITEM.perimGrid = arItem({ tLine: 'gen.ar.together.grid', hint: 'gen.ar.hint.grid', rLine: 'gen.ar.reveal.perim',
  make: s => ({ want: shpPerim(s.rows), area: shpArea(s.rows), tag: 'perim-grid' }),
  draw(svg, item) { return { D: shpDraw(svg, item.rows) }; },
  nums: it => rankMix(it.want, [it.area, it.want - 2, it.want + 2]),   /* عدّ المربعات (المساحة)، أو نسي ركناً أو عدّه مرّتين */
  h2: async (item, ctx) => { await walkSegs(ctx.svg, ctx.D, { badges: true, out: true, upTo: 2 }); },
  async together(item, ctx) { await walkSegs(ctx.svg, ctx.D, { badges: true, out: true, stopLast: true }); },   /* خارج الشكل: لا أطوال مكتوبة، والجسر بعرض مربع واحد لا يسع رقمين */
  show: async (item, ctx) => { await walkSegs(ctx.svg, ctx.D); },
  errOf: (it, k) => k === it.area ? 'perimArea' : 'perimOff' });
/* ================= ③ محيط المربع والمستطيل (C201): w، h (والمربع sq)، unit ================= */
ITEM.rectPerim = arItem({ tLine: 'gen.ar.together.rect', hint: 'gen.ar.hint.rect', rLine: 'gen.ar.reveal.perim',
  make: s => ({ want: 2 * (s.w + s.h), tag: 'rect-perim' + (s.sq ? '-sq' : '') }),
  nums: it => rankMix(it.want, [it.w + it.h, it.w * it.h, 2 * it.w + it.h, it.w + 2 * it.h]),   /* نصف السور، أو المساحة، أو ثلاثة أضلاع */
  h2: async (item, ctx) => { const m = helpG(ctx.svg), L = ctx.L; geoLine(m, L.x0, L.y0, L.x0 + L.W, L.y0, { color: ARC.perim, w: 5 }); geoLine(m, L.x0 + L.W, L.y0, L.x0 + L.W, L.y0 + L.H, { color: ARC.perim, w: 5 }); hintCard(ctx.svg, 180, 214, `${item.w} + ${item.h} = ${item.w + item.h}`); await sleep(FAST ? 10 : 300); },   /* ضلعان من الأربعة: نصف السور */
  draw(svg, item) { return { L: rectLab(svg, item.w, item.h, { sq: item.sq, unit: item.unit }) }; },
  async together(item, ctx) { const m = helpG(ctx.svg), L = ctx.L, P = [[L.x0, L.y0], [L.x0 + L.W, L.y0], [L.x0 + L.W, L.y0 + L.H], [L.x0, L.y0 + L.H]]; let tot = 0; for (let i = 0; i < 4; i++) { const a = P[i], b = P[(i + 1) % 4]; tot += i % 2 ? item.h : item.w; geoLine(m, a[0], a[1], b[0], b[1], { color: ARC.perim, w: 5 }); const iy = Math.min(22, L.H / 4), ix = Math.min(22, L.W / 4), B4 = [[L.x0 + L.W * .75, L.y0 + iy], [L.x0 + L.W - ix, L.y0 + L.H * .75], [L.x0 + L.W * .25, L.y0 + L.H - iy], [L.x0 + ix, L.y0 + L.H * .25]][i]; badge(m, B4[0], B4[1], tot, css('--think'));   /* داخل المستطيل ومتخالفة، فلا تتراكب في المستطيل النحيل ولا تغطّي الأطوال المكتوبة */ SFX.tick(); await S(numw(tot), { noGap: true, num: true }); } },
  errOf: (it, k) => k === it.w + it.h ? 'perimHalf' : k === it.w * it.h ? 'perimArea' : 'perimOff' });
/* ================= ④ الضلع المجهول من المحيط (C202): P، والمربع sq، أو l طول المستطيل ================= */
ITEM.sideFromPerim = arItem({ tLine: 'gen.ar.together.side', hint: 'gen.ar.hint.side', rLine: 'gen.ar.reveal.side',
  make: s => ({ want: s.sq ? s.P / 4 : s.P / 2 - s.l, tag: 'side-perim' + (s.sq ? '-sq' : '') }),
  nums: it => rankMix(it.want, it.sq ? [it.P / 2, it.P - 4, it.want + 2] : [it.P - it.l, it.P / 2, it.P % 4 === 0 ? it.P / 4 : it.want + 2]),
  h2: async (item, ctx) => { hintCard(ctx.svg, 180, 222, item.sq ? `؟ + ؟ + ؟ + ؟ = ${item.P}` : `${item.l} + ؟ + ${item.l} + ؟ = ${item.P}`); await sleep(FAST ? 10 : 300); },
  H: 250,
  draw(svg, item) { const w = item.sq ? item.P / 4 : item.l, h = item.sq ? item.P / 4 : item.P / 2 - item.l, L = rectLab(svg, w, h, { sq: item.sq, hideW: item.sq, hideH: !item.sq, showH: !item.sq, cy: 128, unit: item.unit }); const t = el('text', { x: 180, y: 34, 'text-anchor': 'middle', 'font-size': 17, 'font-weight': 800, fill: ARC.perim, direction: 'rtl' }, svg); t.textContent = `${labelText('arPerim')} ${item.P} ${labelText(item.unit === 'm' ? 'lenM' : 'rulCm')}`; return { L }; },
  async together(item) { if (item.sq) await S('gen.ar.sqFour'); else { await S('gen.ar.halfP', { noGap: true }); await S(numw(item.P / 2), { num: true, append: true }); } },
  errOf: (it, k) => it.sq ? (k === it.P / 2 ? 'sideSq' : 'sideOff') : k === it.P - it.l || k === it.P / 2 ? 'sideHalf' : k === it.P / 4 ? 'sideRectFour' : 'sideOff' });
/* ================= ⑤ عدّ المربعات (C203، C204): rows ================= */
ITEM.areaCount = arItem({ tLine: 'gen.ar.together.count', hint: 'gen.ar.hint.count', rLine: 'gen.ar.reveal.area', area: true,
  make: s => ({ want: shpArea(s.rows), per: shpPerim(s.rows), tag: 'area-count' }),
  draw(svg, item) { return { D: shpDraw(svg, item.rows) }; },
  nums: it => rankMix(it.want, [it.per, it.want - 1, it.want + 1]),
  h2: async (item, ctx) => { const m = helpG(ctx.svg), D = ctx.D, y0 = D.p.full.length ? D.p.full[0][1] : 0, row = D.p.full.filter(([, y]) => y === y0); row.forEach(([x, y]) => el('circle', { cx: D.X(x) + D.c / 2, cy: D.Y(y) + D.c / 2, r: 4, fill: css('--think') }, m)); SFX.tick(); await S(numw(row.length), { noGap: true, num: true }); },   /* الصفّ الأول معدوداً */
  async together(item, ctx) { const m = helpG(ctx.svg), D = ctx.D, n = D.p.full.length; for (const [i, [x, y]] of D.p.full.entries()) { el('circle', { cx: D.X(x) + D.c / 2, cy: D.Y(y) + D.c / 2, r: 4, fill: css('--think') }, m); if (i % 4 === 3 && i < n - 4) { SFX.tick(); await S(numw(i + 1), { noGap: true, num: true }); } } },   /* يعدّ أربعاً أربعاً ويقف قبل آخرها */
  errOf: (it, k) => k === it.per ? 'areaPerim' : 'areaCountOff' });
/* ================= ⑥ تقدير المساحة (C205): rows بأنصاف مربعات؛ الخيارات بعيدة بما يكفي ليكون التقدير حكماً ================= */
ITEM.areaEst = arItem({ tLine: 'gen.ar.together.est', hint: 'gen.ar.hint.est', rLine: 'gen.ar.reveal.est', area: true,
  make: s => { const p = shpParse(s.rows); /*T*/if (TESTHOOK && p.half.length % 2) testBug('areaEst بعدد فردي من الأنصاف: ' + s.rows.join('|'));/*/T*/ return { want: shpArea(s.rows), full: p.full.length, over: p.full.length + p.half.length, tag: 'area-est' }; },
  nums: it => rankMix(it.want, [it.full, it.over, it.want + (it.over - it.want) * 2, it.want - (it.want - it.full) * 2]),
  h2: async (item, ctx) => { const m = helpG(ctx.svg), D = ctx.D; for (const h of D.p.half.slice(0, 2)) { const [cx, cy] = D.halfC(h); el('circle', { cx, cy, r: 5, fill: '#fff', stroke: css('--think'), 'stroke-width': 2.5 }, m); } hintCard(ctx.svg, 180, 222, labelText('arHalves2')); await sleep(FAST ? 10 : 300); },   /* نصفان يكمّلان مربعاً */
  draw(svg, item) { return { D: shpDraw(svg, item.rows) }; },
  async together(item, ctx) { const m = helpG(ctx.svg), D = ctx.D; for (const [x, y] of D.p.full) el('circle', { cx: D.X(x) + D.c / 2, cy: D.Y(y) + D.c / 2, r: 4, fill: css('--think') }, m); await S(numw(D.p.full.length), { num: true, append: true }); for (const h of D.p.half) { const [cx, cy] = D.halfC(h); el('circle', { cx, cy, r: 4, fill: '#fff', stroke: css('--think'), 'stroke-width': 2 }, m); } await S('gen.ar.halves'); },
  errOf: (it, k) => k === it.full ? 'estFull' : k === it.over ? 'estHalfAsWhole' : 'estOff' });
/* ================= ⑦ مساحة المستطيل (C206): w، h، grid: full | edge | none، unit ================= */
ITEM.rectArea = arItem({ tLine: 'gen.ar.together.rows', hint: 'gen.ar.hint.rows', rLine: 'gen.ar.reveal.area', area: true,
  make: s => ({ want: s.w * s.h, tag: 'rect-area-' + (s.grid || 'none') }),
  nums: it => rankMix(it.want, [it.w + it.h, 2 * (it.w + it.h), it.w * (it.h - 1), it.w * (it.h + 1)]),
  h2: async (item, ctx) => { const m = helpG(ctx.svg), L = ctx.L; el('rect', { x: L.x0, y: L.y0, width: L.W, height: L.k, fill: css('--think'), opacity: .18 }, m); for (let i = 1; i < item.w; i++) geoLine(m, L.x0 + i * L.k, L.y0, L.x0 + i * L.k, L.y0 + L.k, { color: css('--think'), w: 1.4 }); badge(m, L.x0 - 16, L.y0 + L.k / 2, item.w, css('--think')); SFX.tick(); await S(numw(item.w), { noGap: true, num: true }); },   /* صفّ واحد معدوداً */
  draw(svg, item) { return { L: rectLab(svg, item.w, item.h, { grid: item.grid, sq: item.sq, showH: true, unit: item.unit }) }; },
  async together(item, ctx) { const m = helpG(ctx.svg), L = ctx.L; for (let j = 0; j < item.h; j++) { el('rect', { x: L.x0, y: L.y0 + j * L.k, width: L.W, height: L.k, fill: css('--think'), opacity: .18 }, m); if (j === item.h - 1) break; badge(m, L.x0 - 16 - (j % 2) * 30, L.y0 + (j + .5) * L.k, (j + 1) * item.w, css('--think'));   /* متعرّجة: الصفوف أقرب من الشارة */ SFX.tick(); await S(numw((j + 1) * item.w), { noGap: true, num: true }); } },
  errOf: (it, k) => k === it.w + it.h ? 'areaSum' : k === 2 * (it.w + it.h) ? 'areaPerim' : k === it.w ? 'areaRow' : 'areaOff' });
/* ================= ⑧ الضلع المجهول من المساحة (C207): A، l ================= */
ITEM.sideFromArea = arItem({ tLine: 'gen.ar.together.sideA', hint: 'gen.ar.hint.sideA', rLine: 'gen.ar.reveal.side',
  make: s => ({ want: s.A / s.l, tag: 'side-area' }),
  nums: it => rankMix(it.want, [it.A - it.l, it.want + 1, it.want - 1, it.A / 2]),
  h2: async (item, ctx) => { hintCard(ctx.svg, 180, 222, `${item.l} × ؟ = ${item.A}`); await sleep(FAST ? 10 : 300); },
  H: 250,
  draw(svg, item) { const L = rectLab(svg, item.l, item.A / item.l, { grid: 'none', hideH: true, showH: true, cy: 130, unit: item.unit }); const t = el('text', { x: 180, y: 34, 'text-anchor': 'middle', 'font-size': 17, 'font-weight': 800, fill: ARC.ok, direction: 'rtl' }, svg); t.textContent = `${labelText('arArea')} ${item.A} ${labelText(item.unit === 'm' ? 'arM2' : 'arCm2')}`; return { L }; },
  async together(item, ctx) { const m = helpG(ctx.svg), L = ctx.L; for (let i = 1; i < item.l; i++) geoLine(m, L.x0 + i * L.k, L.y0, L.x0 + i * L.k, L.y0 + L.k, { color: css('--think'), w: 1.6 }); el('rect', { x: L.x0, y: L.y0, width: L.W, height: L.k, fill: css('--think'), opacity: .18 }, m); await S('gen.ar.rowOf', { noGap: true }); await S(numw(item.l), { num: true, append: true }); },
  errOf: (it, k) => k === it.A - it.l ? 'sideSub' : 'sideAOff' });
/* ================= ⑨ مساحة الشكل المركّب (C208): rows بأطوال قطعه مكتوبة ================= */
ITEM.compArea = arItem({ tLine: 'gen.ar.together.comp', hint: 'gen.ar.hint.comp', rLine: 'gen.ar.reveal.area', area: true, H: 250,
  make: s => { const p = shpParse(s.rows), big = p.W * p.H; return { want: shpArea(s.rows), big, tag: 'comp-area' }; },
  nums: it => rankMix(it.want, [it.big, it.big - it.want, it.want + (it.big - it.want)]),
  h2: async (item, ctx) => { const D = ctx.D, m = helpG(ctx.svg), rows = item.rows; let y2 = 0; while (y2 + 1 < rows.length && rows[y2 + 1] === rows[0]) y2++; const xs = [...rows[0]].map((ch, i) => ch === '#' ? i : -1).filter(i => i >= 0); el('rect', { x: D.X(Math.min(...xs)), y: D.Y(0), width: xs.length * D.c, height: (y2 + 1) * D.c, fill: '#f2d38a', opacity: .7 }, m); SFX.tick(); await sleep(FAST ? 10 : 300); },   /* المستطيل الأول ملوّناً، بلا عدد */
  draw(svg, item) { const D = shpDraw(svg, item.rows, { grid: false, cellLines: false, labeled: true, at: [180, 128] }); shpLabels(svg, D, { unit: item.unit }); return { D }; },
  async together(item, ctx) { const D = ctx.D, m = helpG(ctx.svg); /* تقسيم إلى مستطيلات أفقية متصلة: صفّاً صفّاً، وكل صفّين متطابقين معاً */ const rows = item.rows; let y = 0, tot = 0, col = 0; const cols = ['#f2d38a', '#bfe0b5', '#e6c6e8'];
    while (y < rows.length) { let y2 = y; while (y2 + 1 < rows.length && rows[y2 + 1] === rows[y]) y2++; const xs = [...rows[y]].map((ch, i) => ch === '#' ? i : -1).filter(i => i >= 0), x0 = Math.min(...xs), w = xs.length, h = y2 - y + 1; el('rect', { x: D.X(x0), y: D.Y(y), width: w * D.c, height: h * D.c, fill: cols[col++ % 3], opacity: .7 }, m); tot += w * h; y = y2 + 1; if (y >= rows.length) break; badge(m, D.X(x0) + w * D.c / 2, D.Y(y - h) + h * D.c / 2, tot, css('--think')); SFX.tick(); await S(numw(tot), { noGap: true, num: true }); } },   /* آخر جزء ملوّن بلا مجموعه */
  errOf: (it, k) => k === it.big ? 'compWhole' : k < it.want ? 'compPart' : 'compDouble' });
/* ================= ⑩ محيط الشكل المركّب (C209): rows، hide أرقام القطع التي لا يُكتب طولها ================= */
ITEM.compPerim = arItem({ tLine: 'gen.ar.together.compP', hint: 'gen.ar.hint.compP', rLine: 'gen.ar.reveal.perim', H: 250,
  make: s => { const segs = shpSegs(s.rows), w = segs.reduce((a, g) => a + g.len, 0), miss = w - (s.hide || []).reduce((a, i) => a + segs[i].len, 0);
    /*T*/if (TESTHOOK) { const d = new Set((s.hide || []).map(i => segs[i].dir.join(','))); if ((d.has('1,0') && d.has('-1,0')) || (d.has('0,1') && d.has('0,-1'))) testBug('compPerim: ضلعان مخفيّان على جهتين متقابلتين فلا يُستنتج المحيط ' + s.rows.join('|')); }/*/T*/   /* المراجع B لبوابة U6/U7، 10 */
    return { want: w, miss, tag: 'comp-perim' }; },
  nums: it => rankMix(it.want, [it.miss, it.want - 2, it.want + 2]),
  h2: async (item, ctx) => { await walkSegs(ctx.svg, ctx.D, { badges: true, upTo: 2 }); },
  draw(svg, item) { const D = shpDraw(svg, item.rows, { grid: false, cellLines: false, labeled: true, at: [180, 128] }); return { D, Lb: shpLabels(svg, D, { hide: item.hide, unit: item.unit }) }; },
  async together(item, ctx) { ctx.Lb.remove(); ctx.Lb = shpLabels(ctx.svg, ctx.D, { unit: item.unit }); await walkSegs(ctx.svg, ctx.D, { badges: true, stopLast: true }); },
  show: async (item, ctx) => { ctx.Lb.remove(); shpLabels(ctx.svg, ctx.D, { unit: item.unit }); },
  errOf: (it, k) => k === it.miss ? 'compMissing' : 'perimOff' });
/* ================= ⑪ محيط أم مساحة؟ (C211): sit موقف من الحياة، ask: kind (المفهوم) أو unit (الوحدة) ================= */
const AR_SIT = { fence: 'p', ribbon: 'p', frame: 'p', walk: 'p', rope: 'p', lace: 'p', border: 'p', tiles: 'a', paint: 'a', grass: 'a', carpet: 'a', cloth: 'a', cover: 'a', card: 'a', page: 'a', screen: 'a', cake: 'a' };   /* الأشياء الصغيرة (غلاف، بطاقة، صفحة، شاشة، كعكة، خيط، حافة) لوحدة السنتيمتر في د3 */
function arSitAt(parent, k, x, y, s = 1) { const g = el('g', { transform: `translate(${x} ${y}) scale(${s})`, 'pointer-events': 'none' }, parent);
  if (k === 'fence' || k === 'walk' || k === 'grass') { el('rect', { x: -70, y: -46, width: 140, height: 92, fill: k === 'grass' ? '#8fca7a' : '#e9f4dc', stroke: 'none' }, g); if (k === 'fence') for (let i = 0; i <= 14; i++) { const t = i / 14; for (const [x1, y1] of [[-70 + 140 * t, -46], [-70 + 140 * t, 46]]) el('rect', { x: x1 - 3, y: y1 - 10, width: 6, height: 20, fill: ARC.fence }, g); } if (k === 'fence') { el('rect', { x: -70, y: -46, width: 140, height: 92, fill: 'none', stroke: ARC.fence, 'stroke-width': 5 }, g); } if (k === 'walk') { el('rect', { x: -70, y: -46, width: 140, height: 92, fill: 'none', stroke: ARC.perim, 'stroke-width': 3, 'stroke-dasharray': '6 5' }, g); for (const [fx, fy] of [[-50, -52], [10, -52], [76, -10]]) el('ellipse', { cx: fx, cy: fy, rx: 6, ry: 9, fill: '#8a5a3a' }, g); } }
  else if (k === 'ribbon' || k === 'frame') { el('rect', { x: -52, y: -40, width: 104, height: 80, fill: '#fffdf6', stroke: k === 'frame' ? '#8a5a3a' : '#c8392d', 'stroke-width': k === 'frame' ? 12 : 6 }, g); el('path', { d: 'M-30 20 L-6 -10 L10 8 L20 -4 L36 20 Z', fill: '#7fb6d9' }, g); if (k === 'ribbon') el('path', { d: 'M46 -46 l10 -10 l4 14 Z M46 -46 l14 -4 l-4 14 Z', fill: '#c8392d' }, g); }
  else if (k === 'tiles' || k === 'carpet') { for (let i = 0; i < 4; i++) for (let j = 0; j < 3; j++) el('rect', { x: -64 + i * 32, y: -48 + j * 32, width: 32, height: 32, fill: k === 'tiles' ? ((i + j) % 2 ? '#e6d3b3' : '#f2e6cf') : '#c8392d', stroke: k === 'tiles' ? '#b9794e' : '#a52a20', 'stroke-width': 1.5 }, g); }
  else if (k === 'rope') { el('rect', { x: -70, y: -46, width: 140, height: 92, fill: '#e9d9b6' }, g); el('rect', { x: -70, y: -46, width: 140, height: 92, fill: 'none', stroke: '#8a6a3a', 'stroke-width': 4, 'stroke-dasharray': '10 4' }, g); for (const [x1, y1] of [[-70, -46], [70, -46], [70, 46], [-70, 46]]) el('circle', { cx: x1, cy: y1, r: 6, fill: '#6b4a2a' }, g); }
  else if (k === 'cloth') { el('rect', { x: -66, y: -30, width: 132, height: 60, fill: '#8a5a3a' }, g); el('rect', { x: -60, y: -36, width: 120, height: 56, fill: '#e8eef8', stroke: '#9fb4c0', 'stroke-width': 1.5 }, g); for (let i = 0; i < 6; i++) for (let j = 0; j < 3; j++) el('circle', { cx: -50 + i * 20, cy: -26 + j * 18, r: 3, fill: '#7fb6d9' }, g); el('rect', { x: -56, y: 30, width: 6, height: 24, fill: '#6b4a2a' }, g); el('rect', { x: 50, y: 30, width: 6, height: 24, fill: '#6b4a2a' }, g); }
  else if (k === 'cover') { el('rect', { x: -48, y: -56, width: 96, height: 112, rx: 4, fill: '#7fb6d9', stroke: '#4f86a8', 'stroke-width': 2 }, g); for (let i = 0; i < 4; i++) for (let j = 0; j < 5; j++) el('circle', { cx: -33 + i * 22, cy: -40 + j * 20, r: 4, fill: '#fffdf6', opacity: .8 }, g); el('rect', { x: -48, y: -56, width: 10, height: 112, fill: '#4f86a8' }, g); }
  else if (k === 'card' || k === 'lace') { el('rect', { x: -60, y: -40, width: 120, height: 80, rx: 6, fill: k === 'card' ? '#f2d38a' : '#fffdf6', stroke: '#b9794e', 'stroke-width': 2 }, g); el('path', { d: 'M0 -16 L6 -4 L19 -3 L9 6 L12 19 L0 12 L-12 19 L-9 6 L-19 -3 L-6 -4 Z', fill: k === 'card' ? '#e07a2e' : '#d9c6a0' }, g); if (k === 'lace') { el('rect', { x: -54, y: -34, width: 108, height: 68, rx: 4, fill: 'none', stroke: '#c8392d', 'stroke-width': 4, 'stroke-dasharray': '8 5' }, g); el('path', { d: 'M54 -34 l12 -10 l2 14 Z M54 -34 l14 -2 l-8 12 Z', fill: '#c8392d' }, g); } }
  else if (k === 'page') { el('rect', { x: -46, y: -56, width: 92, height: 112, rx: 3, fill: '#bfe0b5', stroke: '#8a9aa8', 'stroke-width': 2 }, g); el('circle', { cx: 18, cy: -26, r: 13, fill: '#f2c14e' }, g); el('path', { d: 'M-46 44 Q-20 14 4 36 T46 30 L46 56 L-46 56 Z', fill: '#6fae5c' }, g); for (let i = 0; i < 6; i++) el('circle', { cx: -36 + i * 14.4, cy: -56, r: 3.5, fill: 'none', stroke: '#6b7b88', 'stroke-width': 2 }, g); }
  else if (k === 'screen') { el('rect', { x: -34, y: -60, width: 68, height: 120, rx: 12, fill: '#3a3f46' }, g); el('rect', { x: -28, y: -50, width: 56, height: 100, rx: 4, fill: '#bfe3f2' }, g); el('path', { d: 'M-28 10 L16 -50 L28 -50 L-28 26 Z', fill: '#fff', opacity: .55 }, g); }
  else if (k === 'border') { el('rect', { x: -46, y: -56, width: 92, height: 112, rx: 4, fill: '#f2e6cf', stroke: '#e07a2e', 'stroke-width': 6 }, g); for (let i = 0; i < 4; i++) el('rect', { x: -28, y: -30 + i * 18, width: 56, height: 4, rx: 2, fill: '#d9c6a0' }, g); }
  else if (k === 'cake') { el('rect', { x: -60, y: -6, width: 120, height: 50, fill: '#e9a7b4' }, g); el('ellipse', { cx: 0, cy: 44, rx: 60, ry: 14, fill: '#e9a7b4' }, g); el('ellipse', { cx: 0, cy: -6, rx: 60, ry: 18, fill: '#fff3e0', stroke: '#e9c9a0', 'stroke-width': 2 }, g); for (const [cx, cy] of [[-28, -8], [0, -14], [26, -6], [6, 2]]) el('circle', { cx, cy, r: 5, fill: '#c8392d' }, g); }
  else if (k === 'paint') { el('rect', { x: -70, y: -50, width: 140, height: 100, fill: '#f6e7c8' }, g); el('rect', { x: -70, y: -50, width: 80, height: 100, fill: '#7fb6d9' }, g); el('rect', { x: 4, y: -20, width: 30, height: 12, rx: 3, fill: '#8a5a3a', transform: 'rotate(-30 20 -14)' }, g); }
  return g; }
function paIcons(svg, item) { const m = helpG(svg), u = item.unit || 'cm';
  [[304, 'p', 'arAroundIt', item.ask === 'unit' ? AR_U[u][0] : 'arPerim0'], [56, 'a', 'arCoversIt', item.ask === 'unit' ? AR_U[u][1] : 'arArea0']].forEach(([x, k, l1, l2]) => { const g = el('g', { 'pointer-events': 'none' }, m);
    el('rect', { x: x - 32, y: 52, width: 64, height: 118, rx: 10, fill: '#fff', stroke: css('--think'), 'stroke-width': 2 }, g);
    if (k === 'p') el('rect', { x: x - 17, y: 64, width: 34, height: 34, fill: 'none', stroke: css('--think'), 'stroke-width': 3.5, 'stroke-dasharray': '6 4' }, g);
    else for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) el('rect', { x: x - 17 + i * 34 / 3, y: 64 + j * 34 / 3, width: 34 / 3, height: 34 / 3, fill: '#f2e0b8', stroke: css('--think'), 'stroke-width': 1.2 }, g);
    [[l1, 124, 13], [l2, 152, 15]].forEach(([l, y, fs]) => { const t = el('text', { x, y, 'text-anchor': 'middle', 'font-size': fs, 'font-weight': 800, fill: css('--think'), direction: 'rtl' }, g); t.textContent = labelText(l); });
    anim(g, [{ opacity: 0 }, { opacity: 1 }], { duration: 300 }); }); }
ITEM.pOrA = {
  make(spec) { const want = AR_SIT[spec.sit]; return { ...spec, want: spec.ask === 'unit' ? want + (spec.unit || 'cm') : want, tag: 'p-or-a-' + (spec.ask || 'kind') }; },
  async ask(item, mode, tries) { const svg = arStage(222); arSitAt(svg, item.sit, 180, 112, 1.1); const t = el('text', { x: 180, y: 200, 'text-anchor': 'middle', 'font-size': 17, 'font-weight': 800, fill: ARC.ink }, svg); t.textContent = labelText('ar.sit.' + item.sit);
    if (tries >= 3) { await S('gen.ar.sit.' + item.sit); await S('gen.ar.together.pa'); } else { await S(item.q, { noGap: true }); await S('gen.ar.sit.' + item.sit, { append: true }); }
    const u = item.unit || 'cm', opts = item.ask === 'unit' ? [['p' + u, labelText(AR_U[u][0]), '<i></i>', 'gen.ar.u.' + u], ['a' + u, labelText(AR_U[u][1]), '<i></i>', 'gen.ar.u.' + u + '2']] : [['p', labelText('arPerim0'), '<i></i>', 'gen.ar.k.p'], ['a', labelText('arArea0'), '<i></i>', 'gen.ar.k.a']];
    const k = await choosePick(opts, item.want); return { ans: k, ctx: { svg } }; },
  judge(item, k) { return k === item.want ? { ok: true } : { ok: false, err: item.ask === 'unit' ? (AR_SIT[item.sit] === 'a' ? 'unitSquare' : 'unitLen') : 'perimOrArea' }; },   /* سؤال الخطأ بنوع الموقف (المراجع A لبوابة U6/U7، 17 (و)) */
  onOk() { SFX.good(); }, onWrong() { SFX.soft(); },
  async hint2(item, r) { if (r && r.ctx && r.ctx.svg) paIcons(r.ctx.svg, item); await S('gen.ar.hint.pa'); }, async together() {},   /* المستوى الثاني: المعنيان مرسومان على جانبي الموقف (سورٌ يدور، وبلاطٌ يغطّي)، والحكم للطفل (المراجع B لبوابة U6/U7، 5) */
  async reveal(item) { await S('gen.ar.reveal.pa.' + AR_SIT[item.sit]); },
  praise: () => 'praiseThink', twin(item) { return item.twin || null; },
};
/* ================= لعبة «مفتّش السور» (د2، المراجع A لبوابة U6/U7، 19): المقاول يكتب طول السور لأرض مستطيلة؛ صحيح أم خطأ؟ claim: ما كتبه ================= */
ITEM.perimClaim = {
  make(spec) { const P = 2 * (spec.w + spec.h); return { ...spec, P, want: spec.claim === P ? 'yes' : 'no', tag: 'perim-claim' }; },
  async ask(item, mode, tries) { const svg = arStage(232), Rl = rectLab(svg, item.w, item.h, { sq: item.w === item.h, showH: true, cy: 108, maxH: 110 }), sign = el('g', {}, svg);
    el('rect', { x: 110, y: 184, width: 140, height: 34, rx: 8, fill: '#fff3d6', stroke: '#b9862a', 'stroke-width': 2 }, sign); const t = el('text', { x: 180, y: 207, 'text-anchor': 'middle', 'font-size': 17, 'font-weight': 800, fill: ARC.ink, direction: 'rtl' }, sign); t.textContent = `${labelText('arFence')} ${item.claim} ${labelText('rulCm')}`;
    if (tries >= 3) { hintCard(svg, 180, 30, `2 × (${item.w} + ${item.h}) = ؟`); await S('gen.ar.together.claim'); } else { await S(item.q, { noGap: true }); await sayLen(item.claim, 'cm', { noGap: true }); await S('gen.ar.isRight', { append: true }); }
    const k = await choosePick([['yes', labelText('yes'), PICKICON.yes, 'gen.opt.yes'], ['no', labelText('no'), PICKICON.no, 'gen.opt.no']], item.want); return { ans: k, ctx: { svg, Rl } }; },
  judge(item, k) { if (k === item.want) return { ok: true }; const { w, h, claim } = item; return { ok: false, err: claim === w + h ? 'perimHalf' : claim === w * h ? 'perimArea' : 'perimOff' }; },
  onOk() { SFX.good(); }, onWrong() { SFX.soft(); },
  async hint2(item, r) { if (r && r.ctx && r.ctx.svg) hintCard(r.ctx.svg, 180, 30, `${item.w} + ${item.h} + ${item.w} + ${item.h} = ؟`); await S('gen.ar.hint.claim'); }, async together() {},   /* الأضلاع الأربعة مكتوبة للجمع */
  async reveal(item) { await S('gen.ar.reveal.claim', { noGap: true }); await sayLen(item.P, 'cm'); },
  praise: () => 'praiseThink', twin(item) { return item.twin || null; },
};
/* ================= لعبة «مهندس الأراضي» (د4، المراجع A لبوابة U6/U7، 19): ثلاث أراضٍ مستطيلة تُرتَّب من الأصغر مساحةً إلى الأكبر، ثم «تمّ» ================= */
const AO_X = [290, 180, 70];
ITEM.areaOrder = {
  make(spec) { const order = spec.rects.map((r, i) => i).sort((i, j) => spec.rects[i][0] * spec.rects[i][1] - spec.rects[j][0] * spec.rects[j][1]); /*T*/if (TESTHOOK && new Set(spec.rects.map(([w, h]) => w * h)).size < spec.rects.length) testBug('areaOrder: مساحتان متساويتان');/*/T*/ return { ...spec, want: order.join(','), tag: 'area-order' }; },
  async ask(item, mode, tries) { const svg = arStage(232), k = Math.min(10, 86 / Math.max(...item.rects.map(r => r[0])), 96 / Math.max(...item.rects.map(r => r[1]))), picked = [], badges = el('g', { 'pointer-events': 'none' }, svg);
    const cards = item.rects.map(([w, h], i) => { const cx = AO_X[i], g = el('g', { role: 'button', tabindex: 0, 'aria-label': `${w} × ${h}` }, svg); g.style.cursor = 'pointer'; el('rect', { x: cx - 50, y: 34, width: 100, height: 158, rx: 12, fill: '#fffdf6', stroke: css('--line'), 'stroke-width': 2 }, g); el('rect', { x: cx - w * k / 2, y: 100 - h * k / 2, width: w * k, height: h * k, fill: ARC.fill, stroke: ARC.edge, 'stroke-width': 2.4 }, g); const d = el('text', { x: cx, y: 178, 'text-anchor': 'middle', 'font-size': 16, 'font-weight': 800, fill: ARC.ink, direction: 'ltr' }, g); d.textContent = `${w} × ${h}`; return g; });
    if (tries >= 3) { const m = helpG(svg); item.rects.forEach(([w, h], i) => { const t = el('text', { x: AO_X[i], y: 214, 'text-anchor': 'middle', 'font-size': 15, 'font-weight': 800, fill: css('--think'), direction: 'rtl' }, m); t.textContent = `${labelText('arArea0')} ${w * h}`; }); await S('gen.ar.together.order'); }
    else await S(item.q);
    /*T*/window.__ordWant = item.want.split(',').map(Number); window.__ordAt = i => { const r = cards[i].getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; };/*/T*/
    const fill0 = cards.map(c => c.querySelector('rect').getAttribute('fill'));
    await gate(new Promise(res => { let bar = null; const draw = () => { badges.innerHTML = ''; cards.forEach((c, i) => c.querySelector('rect').setAttribute('fill', fill0[i])); picked.forEach((i, n) => { badge(badges, AO_X[i] + 36, 46, n + 1, css('--compass')); cards[i].querySelector('rect').setAttribute('fill', '#eef6fb'); });
        if (picked.length === cards.length && !bar) { bar = doneBtn(); bar.b.onclick = () => { if (picked.length !== cards.length) return; AUTO_CLEAR(); hush(); bar.bar.remove(); res(); }; } else if (picked.length < cards.length && bar) { bar.bar.remove(); bar = null; } };
      const pick = i => { const at = picked.indexOf(i); if (at >= 0) picked.splice(at); else picked.push(i); SFX.tick(); draw(); };
      cards.forEach((g, i) => { g.onclick = () => pick(i); g.onkeydown = e => { if (isActKey(e)) { e.preventDefault(); pick(i); } }; });
      const fin = () => setTimeout(() => { const d = document.querySelector('#stage .pick.done'); if (d) d.click(); }, 0);
      AUTO({ kind: 'lenOrder', ok: () => { item.want.split(',').forEach(i => pick(+i)); fin(); }, wrong: () => { [...item.want.split(',')].reverse().forEach(i => pick(+i)); fin(); } }); }));
    cards.forEach(g => { g.onclick = null; g.onkeydown = null; g.removeAttribute('role'); }); return { ans: picked.join(','), ctx: { svg, badges, cards } }; },
  judge(item, k) { if (k === item.want) return { ok: true }; const byP = item.rects.map((r, i) => i).sort((i, j) => (item.rects[i][0] + item.rects[i][1]) - (item.rects[j][0] + item.rects[j][1])).join(','); return { ok: false, err: k === byP ? 'perimBigArea' : 'areaOrder' }; },
  onOk() { SFX.good(); }, onWrong() { SFX.soft(); },
  async hint2(item, r) { if (r && r.ctx && r.ctx.svg) { const m = helpG(r.ctx.svg); item.rects.forEach(([w, h], i) => { const t = el('text', { x: AO_X[i], y: 214, 'text-anchor': 'middle', 'font-size': 15, 'font-weight': 800, fill: css('--think'), direction: 'ltr' }, m); t.textContent = `${w} × ${h} = ؟`; }); } await S('gen.ar.hint.order'); }, async together() {},
  async reveal(item, r) { const b = r.ctx.badges; b.innerHTML = ''; item.want.split(',').forEach((i, n) => badge(b, AO_X[+i] + 36, 46, n + 1, ARC.ok)); await S('gen.ar.reveal.order'); },
  praise: () => 'praiseThink', twin(item) { return item.twin || null; },
};
/* ================= ⑫ محيط واحد ومساحتان (C210): a وb مستطيلان [w، h]، ask: area | perim ================= */
ITEM.sameCmp = {
  make(spec) { const f = spec.ask === 'perim' ? ([w, h]) => 2 * (w + h) : ([w, h]) => w * h, A = f(spec.a), B = f(spec.b); return { ...spec, want: A === B ? 'eq' : A > B ? 'a' : 'b', tag: 'same-cmp-' + spec.ask }; },
  async ask(item, mode, tries) { const svg = arStage(232), g = el('g', {}, svg), k = Math.min(16, 130 / Math.max(item.a[0], item.b[0]), 104 / Math.max(item.a[1], item.b[1]));
    [[item.a, 264, ARC.fill], [item.b, 96, '#f6e2cf']].forEach(([[w, h], cx, f], i) => { const x0 = cx - w * k / 2, y0 = 106 - h * k / 2; el('rect', { x: x0, y: y0, width: w * k, height: h * k, fill: f, stroke: ARC.edge, 'stroke-width': 2.5 }, g); for (let a = 1; a < w; a++) geoLine(g, x0 + a * k, y0, x0 + a * k, y0 + h * k, { color: '#9fc3dc', w: 1 }); for (let b = 1; b < h; b++) geoLine(g, x0, y0 + b * k, x0 + w * k, y0 + b * k, { color: '#9fc3dc', w: 1 }); const t = el('text', { x: cx, y: 186, 'text-anchor': 'middle', 'font-size': 16, 'font-weight': 800, fill: ARC.ink, direction: 'ltr' }, g); t.textContent = `${w} × ${h}`; const nm = el('text', { x: cx, y: 210, 'text-anchor': 'middle', 'font-size': 16, 'font-weight': 800, fill: css('--compass') }, g); nm.textContent = labelText(i ? 'arSecond' : 'arFirst'); });
    if (tries >= 3) { const m = helpG(svg); [[item.a, 264], [item.b, 96]].forEach(([[w, h], cx]) => { const t = el('text', { x: cx, y: 34, 'text-anchor': 'middle', 'font-size': 15, 'font-weight': 800, fill: css('--think'), direction: 'rtl' }, m); t.textContent = `${labelText('arPerim0')} ${2 * (w + h)} · ${labelText('arArea0')} ${w * h}`; }); await S('gen.ar.together.same'); }
    else await S(item.q);
    const k2 = await choosePick([['a', labelText('arFirst'), '<i></i>', 'gen.ar.first'], ['b', labelText('arSecond'), '<i></i>', 'gen.ar.second'], ['eq', labelText('arEq'), '<i></i>', 'gen.ar.eq']], item.want); return { ans: k2, ctx: { svg } }; },
  judge(item, k) { if (k === item.want) return { ok: true }; const P = ([w, h]) => 2 * (w + h), Ar = ([w, h]) => w * h;   /* (المراجع A لبوابة U6/U7، 17 (ب) و(ج)) */
    if (k === 'eq') return { ok: false, err: item.ask === 'perim' ? 'sameAreaPerim' : 'samePerimArea' };
    if (item.ask === 'area' && P(item[k]) > P(item[k === 'a' ? 'b' : 'a']) && Ar(item[k]) <= Ar(item[k === 'a' ? 'b' : 'a'])) return { ok: false, err: 'perimBigArea' };
    return { ok: false, err: 'sameOff' }; },
  onOk() { SFX.good(); }, onWrong() { SFX.soft(); },
  async hint2(item, r) { if (r && r.ctx && r.ctx.svg) { const m = helpG(r.ctx.svg); [[item.a, 264], [item.b, 96]].forEach(([[w, h], cx]) => { const t = el('text', { x: cx, y: 34, 'text-anchor': 'middle', 'font-size': 15, 'font-weight': 800, fill: css('--think'), direction: 'ltr' }, m); t.textContent = item.ask === 'perim' ? `2 × (${w} + ${h}) = ؟` : `${w} × ${h} = ؟`; }); } await S('gen.ar.hint.same'); }, async together() {},   /* حساب كل أرض فوقها، والناتج للطفل */
  async reveal(item) { await S(`gen.ar.reveal.same.${item.ask}.${item.want}`); },
  praise: () => 'praiseCompare', twin(item) { return item.twin || null; },
};
/* ================= ⑬ ارسم مستطيلاً (C201، C206، إنتاج): need: perim | area، val. يلمس الطفل ركنه المقابل على الشبكة، والمحيط أو المساحة يُكتب ================= */
const RD = { c: 26, cols: 11, rows: 6, x0: 37, y0: 190 };
ITEM.rectDraw = {
  make(spec) { return { ...spec, want: spec.need === 'dims' ? [...spec.val].sort((a, b) => a - b).join('x') : spec.val, tag: 'rect-draw-' + spec.need }; },
  async ask(item, mode, tries) { const svg = newStage(256, { oasis: false, ground: 0 }), { c, cols, rows, x0, y0 } = RD, P = (r, u) => [x0 + r * c, y0 - u * c], g = el('g', {}, svg);
    el('rect', { x: x0 - 10, y: y0 - rows * c - 10, width: cols * c + 20, height: rows * c + 20, rx: 10, fill: GEO.paper, stroke: css('--line'), 'stroke-width': 2 }, g); for (let i = 0; i <= cols; i++) geoLine(g, ...P(i, 0), ...P(i, rows), { color: ARC.grid, w: 1.2 }); for (let j = 0; j <= rows; j++) geoLine(g, ...P(0, j), ...P(cols, j), { color: ARC.grid, w: 1.2 });
    el('circle', { cx: P(0, 0)[0], cy: P(0, 0)[1], r: 7, fill: css('--compass') }, g);
    const rect = el('rect', { fill: ARC.fill, stroke: ARC.edge, 'stroke-width': 3, opacity: 0 }, g), rd = el('text', { x: 180, y: 240, 'text-anchor': 'middle', 'font-size': 17, 'font-weight': 800, fill: ARC.ink, direction: 'rtl' }, svg); let cur = null;
    const set = (r, u) => { if (r < 1 || u < 1) return; cur = [r, u]; const [ax, ay] = P(0, u); rect.setAttribute('x', ax); rect.setAttribute('y', ay); rect.setAttribute('width', r * c); rect.setAttribute('height', u * c); rect.setAttribute('opacity', .85); rd.textContent = item.need === 'dims' || NEUTRAL_ANS ? `${r} × ${u}` : item.need === 'perim' ? `${labelText('arPerim0')}: ${2 * (r + u)} ${labelText('rulCm')}` : `${labelText('arArea0')}: ${r * u} ${labelText('arCm2')}`; SFX.tick(); /*T*/window.__rdCur = cur;/*/T*/ };
    if (tries >= 3) { const m = helpG(svg), [w, h] = rdSol(item); geoLine(m, ...P(0, h), ...P(w, h), { color: css('--think'), w: 2, dash: '5 4' }); }
    await S(tries >= 3 ? (item.need === 'perim' ? 'gen.ar.together.drawP' : item.need === 'dims' ? 'gen.ar.together.drawD' : 'gen.ar.together.drawA') : item.q, { noGap: true }); if (item.need === 'dims') { await sayLen(item.val[0], 'cm'); await S('gen.cp.and', { noGap: true, append: true }); await sayLen(item.val[1], 'cm'); } else await (item.need === 'perim' ? sayLen(item.val, 'cm') : sayArea(item.val));   /* dims: الطول والعرض (S2-U9) */
    const input = fingerInput(svg, { map: e => { const p = svgPoint(svg, e); return [p.x, p.y]; }, down(q) { if (q[1] > y0 + 16) return false; set(Math.max(0, Math.min(cols, Math.round((q[0] - x0) / c))), Math.max(0, Math.min(rows, Math.round((y0 - q[1]) / c)))); }, move(q) { set(Math.max(0, Math.min(cols, Math.round((q[0] - x0) / c))), Math.max(0, Math.min(rows, Math.round((y0 - q[1]) / c)))); }, up() {} });
    const kg = el('g', { role: 'grid', 'aria-label': labelText('geoGrid') }, svg); for (let u = rows; u >= 1; u--) { const row = el('g', { role: 'row' }, kg); for (let r = 1; r <= cols; r++) { const [x, y] = P(r, u), b = el('g', { role: 'gridcell', tabindex: 0, 'aria-label': `${DG(r)} × ${DG(u)}` }, row); el('circle', { cx: x, cy: y, r: 10, fill: 'transparent', 'pointer-events': 'none' }, b); b.onkeydown = e => { if (isActKey(e)) { e.preventDefault(); set(r, u); } }; } }
    /*T*/window.__rdAt = (r, u) => { const m = svg.getScreenCTM(), [x, y] = P(r, u); return { x: m.a * x + m.e, y: m.d * y + m.f }; }; window.__rdWant = rdSol(item);/*/T*/
    AUTO({ kind: 'rectDraw', ok: () => { set(...rdSol(item)); rulDoneBtn().click(); }, wrong: () => { const [w, h] = rdSol(item); set(w + 1, h); rulDoneBtn().click(); } });
    await rulDone(() => { input.off(); kg.remove(); }); const v = cur ? (item.need === 'dims' ? [...cur].sort((a, b) => a - b).join('x') : item.need === 'perim' ? 2 * (cur[0] + cur[1]) : cur[0] * cur[1]) : 0; return { ans: v, ctx: { svg, cur, set, rd } }; },
  judge(item, v) { return v === item.want ? { ok: true } : { ok: false, err: item.need === 'perim' ? 'drawPerim' : item.need === 'dims' ? 'drawDims' : 'drawArea' }; },
  onOk() { SFX.good(); }, onWrong() { SFX.soft(); },
  async hint2(item, r) { const svg = r && r.ctx && r.ctx.svg; if (svg) { const { c, cols, rows, x0, y0 } = RD;   /* الطول والعرض معدودان على الحافتين، وللمحيط والمساحة علاقتهما بالقيمة المطلوبة */
      if (item.need === 'dims') { const m = helpG(svg); for (let i = 1; i <= cols; i++) { const t = el('text', { x: x0 + i * c - c / 2, y: y0 + 26, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 800, fill: css('--think') }, m); t.textContent = DG(i); } for (let j = 1; j <= rows; j++) { const t = el('text', { x: x0 - 22, y: y0 - j * c + c / 2 + 5, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 800, fill: css('--think') }, m); t.textContent = DG(j); } }
      else { if (r.ctx.rd) r.ctx.rd.setAttribute('y', 252); hintCard(svg, 180, 220, `${labelText(item.need === 'perim' ? 'arLplusW' : 'arLxW')} ${item.need === 'perim' ? item.val / 2 : item.val}`); } }
    await S(item.need === 'perim' ? 'gen.ar.hint.drawP' : item.need === 'dims' ? 'gen.ar.hint.drawD' : 'gen.ar.hint.drawA'); }, async together() {},
  async reveal(item, r) { const [w, h] = rdSol(item); if (r && r.ctx && r.ctx.set) r.ctx.set(w, h); await S('gen.ar.reveal.draw', { noGap: true }); await S(numw(w), { num: true, append: true }); await S('gen.ar.andW', { noGap: true, append: true }); await S(numw(h), { num: true, append: true }); },
  praise: () => 'praiseNewWay', twin(item) { return item.twin || null; },
};
/* مثالٌ واحد: أقرب مستطيل (غير مربع) إلى المربع، الطول أفقي */
const rdSol = item => { if (item.need === 'dims') return [Math.max(...item.val), Math.min(...item.val)]; let best = null; for (let h = 1; h <= RD.rows; h++) for (let w = h + 1; w <= RD.cols; w++) if ((item.need === 'perim' ? 2 * (w + h) : w * h) === item.val && (!best || w - h < best[0] - best[1])) best = [w, h]; if (best) return best; for (let h = 1; h <= RD.rows; h++) for (let w = 1; w <= RD.cols; w++) if ((item.need === 'perim' ? 2 * (w + h) : w * h) === item.val) return [w, h]; return [1, 1]; };
/* ================= ⑭ مزارع فرجار (C210، إنتاج): fence طول السور بالمتر؛ يغيّر الطفل العرض فتتغيّر الأرض ومساحتها؛ الأكبر مساحةً هو الأقرب إلى المربع ================= */
ITEM.maxArea = {
  make(spec) { const half = spec.fence / 2, w = Math.floor(half / 2); return { ...spec, want: w * (half - w), tag: 'max-area' }; },
  async ask(item, mode, tries) { const svg = newStage(270, { oasis: false, ground: 0 }), half = item.fence / 2, g = el('g', {}, svg); let w = 1;
    const land = el('g', {}, g), dm = el('text', { x: 180, y: 32, 'text-anchor': 'middle', 'font-size': 17, 'font-weight': 800, fill: ARC.ink, direction: 'ltr' }, svg), rd = el('text', { x: 180, y: 58, 'text-anchor': 'middle', 'font-size': 17, 'font-weight': 800, fill: ARC.ok, direction: 'rtl' }, svg), k = Math.min(150 / (half - 1), 18);
    let reg = null, hint = false; const draw = () => { land.innerHTML = ''; const h = half - w, x0 = 180 - w * k / 2, y0 = 146 - h * k / 2; el('rect', { x: x0, y: y0, width: w * k, height: h * k, fill: '#8fca7a', stroke: ARC.fence, 'stroke-width': 4 }, land);
      if (hint) { for (let a = 1; a < w; a++) geoLine(land, x0 + a * k, y0, x0 + a * k, y0 + h * k, { color: '#5f9a4e', w: 1.2 }); for (let b = 1; b < h; b++) geoLine(land, x0, y0 + b * k, x0 + w * k, y0 + b * k, { color: '#5f9a4e', w: 1.2 }); }
      dm.textContent = hint ? `${w} + ${h} = ${half}` : `${w} × ${h}`; dm.setAttribute('fill', hint ? css('--think') : ARC.ink); rd.textContent = NEUTRAL_ANS ? '' : `${labelText('arArea0')}: ${w * h}` + (item.m2 ? ` ${labelText('arM2')}` : ''); /*T*/window.__maxW = w; window.__maxWant = Math.floor(half / 2);/*/T*/ if (reg) reg(); };
    const btns = [-1, 1].map(d => { const b = el('g', { role: 'button', tabindex: 0, 'aria-label': plain(labelText(d < 0 ? 'stepLess' : 'stepMore')), style: 'cursor:pointer', 'data-step': d }, svg), x = d < 0 ? 44 : 316; el('circle', { cx: x, cy: 146, r: 26, fill: '#eef6fb', stroke: css('--compass'), 'stroke-width': 2.5 }, b); const t = el('text', { x, y: 156, 'text-anchor': 'middle', 'font-size': 30, 'font-weight': 800, fill: css('--compass'), 'pointer-events': 'none' }, b); t.textContent = d < 0 ? '−' : '+'; hitPad(b, 64);
      const go = () => { w = Math.max(1, Math.min(half - 1, w + d)); SFX.tick(); draw(); }; b.onclick = go; b.onkeydown = e => { if (isActKey(e)) { e.preventDefault(); go(); } }; return b; });
    const ft = el('text', { x: 180, y: 258, 'text-anchor': 'middle', 'font-size': 15, 'font-weight': 700, fill: ARC.fence, direction: 'rtl' }, svg); ft.textContent = `${labelText('arFence')} ${item.fence} ${labelText('lenM')}`;
    if (tries >= 3) { w = Math.max(1, Math.floor(half / 2) - 1); } draw();
    await S(tries >= 3 ? 'gen.ar.together.max' : item.q);
    /* سائق الفحص يلمس الزرّين لمسةً لمسة (وبمفتاح الفعل عليهما)، فكل تغيير يسجّل انتظاراً جديداً */
    const t = Math.floor(half / 2), tap = b => b.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    reg = () => AUTO({ kind: 'maxArea', ok: () => w === t ? rulDoneBtn().click() : tap(btns[w < t ? 1 : 0]), wrong: () => w === 1 ? rulDoneBtn().click() : tap(btns[0]) });
    const fin = rulDone(() => { reg = null; btns.forEach(b => { b.onclick = null; b.onkeydown = null; b.removeAttribute('role'); }); }); reg(); await fin;
    return { ans: w * (half - w), ctx: { svg, set: v => { w = v; draw(); }, hint: () => { hint = true; draw(); } } }; },
  judge(item, a) { return a === item.want ? { ok: true } : { ok: false, err: 'maxNotSquare' }; },
  onOk() { SFX.good(); }, onWrong() { SFX.soft(); },
  async hint2(item, r) { if (r && r.ctx && r.ctx.hint) r.ctx.hint(); await S('gen.ar.hint.max'); }, async together() {},   /* مربعات الأرض مرسومة، ومجموع الطول والعرض ثابت بطول السور */
  async reveal(item, r) { if (r && r.ctx && r.ctx.set) r.ctx.set(Math.floor(item.fence / 4)); await S('gen.ar.reveal.max'); },
  praise: () => 'praiseThink', twin(item) { return item.twin || null; },
};

/* ================= المشاهد ================= */
/* الإشعال: شريط زينة حول لوحة فوضى */
SCENES.arRibbonHook = async c => { const L = c.lines, svg = arStage(232); arSitAt(svg, 'frame', 180, 116, 1.4); await S(L[0]); await lenPredict([['all', labelText('arRbAll'), '<i></i>', 'gen.ar.pr.rbAll'], ['one', labelText('arRbOne'), '<i></i>', 'gen.ar.pr.rbOne']], 'all', 'gen.ar.pr.ribbon'); const P = [[107, 60], [253, 60], [253, 172], [107, 172]], m = el('g', {}, svg); for (let i = 0; i < 4; i++) { const a = P[i], b = P[(i + 1) % 4], ln = geoLine(m, a[0], a[1], a[0], a[1], { color: '#c8392d', w: 6 }); await axTween(400, t => { ln.setAttribute('x2', a[0] + (b[0] - a[0]) * t); ln.setAttribute('y2', a[1] + (b[1] - a[1]) * t); }); SFX.tick(); } await S(L[1]); };
/* الخيط حول الكتاب يُفرد على المسطرة */
SCENES.stringAround = async c => { const L = c.lines, svg = arStage(240), w = c.w || 9, h = c.h || 6, k = 12, x0 = 180 - w * k / 2, y0 = 70 - h * k / 2; el('rect', { x: x0, y: y0, width: w * k, height: h * k, fill: '#3d7cc0', stroke: '#2a5f94', 'stroke-width': 2 }, svg); await S(L[0]);
  const st = el('rect', { x: x0 - 3, y: y0 - 3, width: w * k + 6, height: h * k + 6, fill: 'none', stroke: '#8a6a4a', 'stroke-width': 3.5 }, svg); SFX.tick(); await sleep(FAST ? 20 : 500);
  const P = 2 * (w + h), R = rulerAt(svg, { x: 30, y: 168, pxcm: 300 / Math.max(P, 30), from: 0, to: Math.max(P, 30), mm: false }); for (const v of Object.keys(R.labels)) if (v % 5) R.labels[v].setAttribute('opacity', 0); st.remove(); const ln = geoLine(svg, R.X(0), 160, R.X(0), 160, { color: '#8a6a4a', w: 4 }); await axTween(800, t => ln.setAttribute('x2', R.X(P * t))); R.mark(P); await S(L[1]); if (L[2]) { await axPredictYN('yes', 'gen.ar.pr.sum'); const t = el('text', { x: 180, y: 226, 'text-anchor': 'middle', 'font-size': 18, 'font-weight': 800, fill: ARC.perim, direction: 'ltr' }, svg); t.textContent = `${w} + ${h} + ${w} + ${h} = ${P}`; SFX.tick(); await S(L[2]); } };
/* المشي على حدود الشكل في الشبكة: شارة لكل ضلع مربع */
SCENES.gridBorder = async c => { const L = c.lines, svg = arStage(240), D = shpDraw(svg, c.rows || ['####', '####', '##..']); await S(L[0]); await axPredictNum(D.segs.reduce((a, g) => a + g.len, 0), 'gen.ar.pr.count'); const m = helpG(svg); let n = 0; for (const s of D.segs) for (let i = 0; i < s.len; i++) { n++; const a = [s.a[0] + s.dir[0] * i, s.a[1] + s.dir[1] * i], b = [a[0] + s.dir[0], a[1] + s.dir[1]]; geoLine(m, D.X(a[0]), D.Y(a[1]), D.X(b[0]), D.Y(b[1]), { color: ARC.perim, w: 5 }); badge(m, (D.X(a[0]) + D.X(b[0])) / 2 + s.dir[1] * 16, (D.Y(a[1]) + D.Y(b[1])) / 2 - s.dir[0] * 16, n, css('--think')); SFX.tick(); await sleep(FAST ? 10 : 220); } await S(L[1]); if (L[2]) await S(L[2]); };
/* محيط المربع والمستطيل: الأضلاع تُجمع ثم تُختصر بالضرب */
SCENES.perimShow = async c => { const L = c.lines, svg = arStage(240), sq = !!c.sq, w = c.w || 5, h = sq ? w : (c.h || 3), Rl = rectLab(svg, w, h, { sq, showH: !sq, maxH: c.area ? 110 : 130 }); if (!c.area) { await S(L[0]); await axPredictNum(2 * (w + h), 'gen.ar.pr.perim'); } const m = helpG(svg), P = [[Rl.x0, Rl.y0], [Rl.x0 + Rl.W, Rl.y0], [Rl.x0 + Rl.W, Rl.y0 + Rl.H], [Rl.x0, Rl.y0 + Rl.H]]; let tot = 0;
  for (let i = 0; i < 4; i++) { const a = P[i], b = P[(i + 1) % 4]; tot += i % 2 ? h : w; geoLine(m, a[0], a[1], b[0], b[1], { color: ARC.perim, w: 5 }); badge(m, (a[0] + b[0]) / 2, (a[1] + b[1]) / 2, tot, css('--think')); SFX.tick(); await sleep(FAST ? 10 : 300); }
  const t = el('text', { x: 180, y: c.area ? 36 : 214, 'text-anchor': 'middle', 'font-size': 20, 'font-weight': 800, fill: ARC.perim, direction: 'ltr' }, svg); t.textContent = sq ? `4 × ${w} = ${4 * w}` : `2 × (${w} + ${h}) = ${2 * (w + h)}`;
  if (c.area) { await S(L[0]); await axPredictNum(w * h, 'gen.ar.pr.area'); for (let i = 1; i < w; i++) geoLine(m, Rl.x0 + i * Rl.k, Rl.y0, Rl.x0 + i * Rl.k, Rl.y0 + Rl.H, { color: '#9fc3dc', w: 1.2 }); for (let j = 1; j < h; j++) geoLine(m, Rl.x0, Rl.y0 + j * Rl.k, Rl.x0 + Rl.W, Rl.y0 + j * Rl.k, { color: '#9fc3dc', w: 1.2 }); el('rect', { x: Rl.x0, y: Rl.y0, width: Rl.W, height: Rl.H, fill: ARC.ok, opacity: .18 }, m); SFX.tick(); const a = el('text', { x: 180, y: 214, 'text-anchor': 'middle', 'font-size': 20, 'font-weight': 800, fill: ARC.ok, direction: 'ltr' }, svg); a.textContent = `${h} × ${w} = ${w * h}`; await S(L[1]); return; }
  await S(L[1]); if (L[2]) await S(L[2]); };
/* البلاط يغطّي الشكل بلا فراغ ولا تراكب، ثم يُعدّ */
SCENES.tileCover = async c => { const L = c.lines, svg = arStage(240), D = shpDraw(svg, c.rows || ['####', '###.', '##..'], { fill: '#fff' }); await S(L[0]); await axPredictNum(D.p.full.length, 'gen.ar.pr.tiles'); const m = el('g', {}, svg); for (const [i, [x, y]] of D.p.full.entries()) { el('rect', { x: D.X(x) + 1, y: D.Y(y) + 1, width: D.c - 2, height: D.c - 2, rx: 2, fill: ARC.tile, stroke: ARC.tileEd, 'stroke-width': 1.5 }, m); SFX.tick(); await sleep(FAST ? 5 : 140); } const ut = el('text', { x: 180, y: 40, 'text-anchor': 'middle', 'font-size': 22, 'font-weight': 800, fill: ARC.ok, direction: 'rtl', stroke: '#fffdf6', 'stroke-width': 5, 'paint-order': 'stroke' }, svg); ut.textContent = `${D.p.full.length} ${labelText('arCm2')}`; SFX.pop(); await S(L[1]); if (L[2]) await S(L[2]); };   /* الرمز «سم²» يُقدَّم مكتوباً مع جملته (المراجع A لبوابة U6/U7، 20) */
/* نصفا مربع = مربع كامل */
SCENES.halfShow = async c => { const L = c.lines, svg = arStage(232), D = shpDraw(svg, c.rows || ['b##c', '####', 'a##d'], { at: [180, 116] }); await S(L[0]); if (D.p.half.length % 2 === 0) await axPredictNum(D.p.half.length / 2, 'gen.ar.pr.halves'); const m = helpG(svg); for (const h of D.p.half) { const [cx, cy] = D.halfC(h); el('circle', { cx, cy, r: 7, fill: 'none', stroke: css('--think'), 'stroke-width': 3 }, m); } SFX.tick(); await S(L[1]); if (L[2]) await S(L[2]); };
/* الصفوف × الأعمدة */
SCENES.rowsCols = async c => { const L = c.lines, svg = arStage(240), w = c.w || 4, h = c.h || 5, Rl = rectLab(svg, w, h, { grid: 'full', showH: true }); await S(L[0]); await axPredictNum(w * h, 'gen.ar.pr.all'); const m = helpG(svg); for (let j = 0; j < h; j++) { el('rect', { x: Rl.x0, y: Rl.y0 + j * Rl.k, width: Rl.W, height: Rl.k, fill: css('--think'), opacity: .18 }, m); badge(m, Rl.x0 - 16 - (j % 2) * 30, Rl.y0 + (j + .5) * Rl.k, (j + 1) * w, css('--think')); SFX.tick(); await sleep(FAST ? 10 : 300); }
  const t = el('text', { x: 180, y: 222, 'text-anchor': 'middle', 'font-size': 20, 'font-weight': 800, fill: ARC.ok, direction: 'ltr' }, svg); t.textContent = `${h} × ${w} = ${w * h}`; await S(L[1]); if (L[2]) await S(L[2]); };
/* الشكل المركّب بطريقتين: التقسيم، والإتمام ثم الطرح */
SCENES.lTwoWays = async c => { const L = c.lines, rows = c.rows || ['######', '######', '####..', '####..']; let svg = arStage(250), D = shpDraw(svg, rows, { grid: false, labeled: true, at: [180, 130] }); shpLabels(svg, D); await S(L[0]);
  const m = helpG(svg); el('rect', { x: D.X(0), y: D.Y(0), width: 6 * D.c, height: 2 * D.c, fill: '#f2d38a', opacity: .7 }, m); el('rect', { x: D.X(0), y: D.Y(2), width: 4 * D.c, height: 2 * D.c, fill: '#bfe0b5', opacity: .7 }, m); await S(L[1]);
  svg = arStage(250); D = shpDraw(svg, rows, { grid: false, at: [180, 130] }); const p = shpParse(rows), m2 = helpG(svg); el('rect', { x: D.X(0), y: D.Y(0), width: p.W * D.c, height: p.H * D.c, fill: 'none', stroke: css('--think'), 'stroke-width': 3, 'stroke-dasharray': '7 5' }, m2); el('rect', { x: D.X(4), y: D.Y(2), width: 2 * D.c, height: 2 * D.c, fill: '#c8392d', opacity: .25 }, m2); await axPredictYN('yes', 'gen.ar.pr.same'); await S(L[2]); if (L[3]) await S(L[3]); };
/* محيط L يساوي محيط المستطيل المحيط به؛ وشكل U لا */
SCENES.lPerimShow = async c => { const L = c.lines; for (const [i, rows] of [c.l || ['######', '######', '####..', '####..'], c.u || ['######', '######', '##..##', '##..##']].entries()) { const svg = arStage(250), D = shpDraw(svg, rows, { grid: false, labeled: true, at: [180, 130] }), p = shpParse(rows); shpLabels(svg, D); el('rect', { x: D.X(0), y: D.Y(0), width: p.W * D.c, height: p.H * D.c, fill: 'none', stroke: css('--think'), 'stroke-width': 2.5, 'stroke-dasharray': '7 5', 'pointer-events': 'none' }, svg); await S(L[2 * i]); await axPredictYN(shpSegs(rows).reduce((a, g) => a + g.len, 0) === 2 * (p.W + p.H) ? 'yes' : 'no', 'gen.ar.pr.lperim'); await walkSegs(svg, D); await S(L[2 * i + 1]); } };
/* جدولا «محيط واحد ومساحات مختلفة» و«مساحة واحدة ومحيطات مختلفة» */
SCENES.sameTables = async c => { const L = c.lines; for (const [i, set] of [c.p || [[1, 5], [2, 4], [3, 3]], c.a || [[1, 12], [2, 6], [3, 4]]].entries()) { const svg = arStage(250), g = el('g', {}, svg); await S(L[2 * i]);
    /* الأشكال وما يتساوى فيها أولاً (السور أو البلاط)، ثم توقّع الطفل، ثم الآخر يُكشف */
    const Y = j => 62 + j * 64, P = ([w, h]) => 2 * (w + h), A = ([w, h]) => w * h, same = i ? A : P, other = i ? P : A;
    for (const [j, [w, h]] of set.entries()) { const y = Y(j), k = Math.min(10, 108 / Math.max(w, 1), 52 / h); el('rect', { x: 326 - w * k, y: y - h * k / 2, width: w * k, height: h * k, fill: ARC.fill, stroke: ARC.edge, 'stroke-width': 2 }, g); const d = el('text', { x: 196, y: y + 6, 'text-anchor': 'middle', 'font-size': 15, 'font-weight': 800, fill: ARC.ink, direction: 'ltr' }, g); d.textContent = `${w} × ${h}`;
      if (i) arLab(g, 62, y + 6, `${labelText('arArea0')} ${A([w, h])}`, 0, ARC.ok); else arLab(g, 132, y + 6, `${labelText('arPerim0')} ${P([w, h])}`, 0, ARC.perim); SFX.tick(); await sleep(FAST ? 10 : 400); }
    await axPredictYN(set.every(r => other(r) === other(set[0])) ? 'yes' : 'no', i ? 'gen.ar.pr.sameP' : 'gen.ar.pr.sameA');
    for (const [j, r] of set.entries()) { if (i) arLab(g, 132, Y(j) + 6, `${labelText('arPerim0')} ${P(r)}`, 0, ARC.perim); else arLab(g, 62, Y(j) + 6, `${labelText('arArea0')} ${A(r)}`, 0, ARC.ok); SFX.tick(); await sleep(FAST ? 10 : 400); }
    await S(L[2 * i + 1]); } };
/* سور أم بلاط؟ */
SCENES.fenceOrTile = async c => { const L = c.lines; await S(L[0]); for (const k of c.sits || ['fence', 'tiles']) { const svg = arStage(222); arSitAt(svg, k, 180, 112, 1.1); await S('gen.ar.sit.' + k); await lenPredict([['p', labelText('arPerim0'), '<i></i>', 'gen.ar.k.p'], ['a', labelText('arArea0'), '<i></i>', 'gen.ar.k.a']], AR_SIT[k], 'gen.ar.pr.pa'); await S('gen.ar.reveal.pa.' + AR_SIT[k]); } if (L[1]) await S(L[1]); };
/* المتر المربع: مربع ضلعه متر على الأرض، وحديقة 3 م × 2 م */
/* مشروع «خطّط أرضك» (U7 د7، المراجع A لبوابة U6/U7، 19): الأرض المركّبة بالمتر مقسومةً حديقةً وملعباً، وجدول النتائج بوحداتها بعد أن حسبها الطفل بنفسه في بنود المشروع */
SCENES.landTable = async c => { const L = c.lines, rows = c.rows || ['######', '######', '######', '####..'], gw = c.gw || 4, svg = arStage(262), D = shpDraw(svg, rows, { grid: false, at: [104, 112], c: 22 }), p = shpParse(rows);
  const m = el('g', { 'pointer-events': 'none' }, svg); for (const [x, y] of p.full) el('rect', { x: D.X(x) + 1, y: D.Y(y) + 1, width: D.c - 2, height: D.c - 2, fill: x < gw ? '#8fca7a' : '#f2b46d', opacity: .85 }, m);
  const segs = shpSegs(rows), P = segs.reduce((a, g) => a + g.len, 0), A = p.full.length, G = p.full.filter(([x]) => x < gw).length;
  const T = [['arFence', P, 'lenM'], ['prjGrass', A, 'arM2'], ['prjGarden', G, 'arM2'], ['prjPlay', A - G, 'arM2']], x0 = 326;
  for (const [i, [k, v, u]] of T.entries()) { const y = 52 + i * 44; el('rect', { x: 188, y: y - 26, width: 146, height: 38, rx: 8, fill: '#fffdf6', stroke: css('--line'), 'stroke-width': 2 }, svg); const t = el('text', { x: x0, y, 'text-anchor': 'start', 'font-size': 15, 'font-weight': 800, fill: ARC.ink, direction: 'rtl' }, svg); t.textContent = `${labelText(k)} ${v} ${labelText(u)}`; SFX.tick(); await sleep(FAST ? 10 : 400); }
  for (const l of L) await S(l); };
SCENES.m2Show = async c => { const L = c.lines; let svg = arStage(232); el('rect', { x: 110, y: 46, width: 140, height: 140, fill: '#f6e7c8', stroke: '#c8392d', 'stroke-width': 5, 'stroke-dasharray': '12 6' }, svg); const t = el('text', { x: 180, y: 124, 'text-anchor': 'middle', 'font-size': 22, 'font-weight': 800, fill: ARC.ink, direction: 'rtl' }, svg); t.textContent = `1 ${labelText('arM2')}`; await S(L[0]);
  svg = arStage(232); const Rl = rectLab(svg, c.w || 3, c.h || 2, { grid: 'full', showH: true, unit: 'm', fill: '#8fca7a' }); await axPredictNum((c.w || 3) * (c.h || 2), 'gen.ar.pr.m2'); await S(L[1]); if (L[2]) await S(L[2]); };
/* التذكّر */
SCENES.recallPerim = async c => { const svg = arStage(240), D = shpDraw(svg, c.rows || ['####', '####']); await walkSegs(svg, D); await S(c.lines[0]); };
SCENES.recallArea = async c => { const svg = arStage(240); if (c.w) { const Rl = rectLab(svg, c.w, c.h, { grid: 'full', showH: true, unit: c.unit }); } else shpDraw(svg, c.rows || ['###', '###']); await S(c.lines[0]); };
WRAP_ART.areaArt = svg => { const g = el('g', {}, svg); el('rect', { x: 90, y: 70, width: 180, height: 120, fill: '#8fca7a', stroke: ARC.fence, 'stroke-width': 8 }, g); for (let i = 1; i < 6; i++) geoLine(g, 90 + i * 30, 70, 90 + i * 30, 190, { color: '#6aa85a', w: 1.5 }); for (let j = 1; j < 4; j++) geoLine(g, 90, 70 + j * 30, 270, 70 + j * 30, { color: '#6aa85a', w: 1.5 }); anim(g, [{ opacity: 0 }, { opacity: 1 }], { duration: 500, delay: 200, fill: 'both' }); palmAt(svg, 326, 250, .8); palmAt(svg, 34, 250, .9); };
