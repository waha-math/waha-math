/* =====================================================================
   M4-U7 «الحجوم الكاملة» (المرحلة 4، نوفمبر 2026)
   د1 حجم الأسطوانة (C415 أ) · د2 مساحة سطحها (C415 ب) · د3 الهرم والمخروط ثلث المنشور والأسطوانة، وصيغة الكرة بمثال (C416)
   د4 اللتر والمتر المكعب (C414) ومشروع «خزان الماء». π = 3.14، والنتائج بمنزلة عشرية واحدة (D95)
   ===================================================================== */
const C7 = { side: '#e6eef6', top: '#f4f8fc', edge: '#2f7fc1', cone: '#f6e3c8', coneEdge: '#c47a2c', water: 'rgba(80,160,220,.45)', r: CI.r, ink: '#24323a', hl: SO.hl, ok: SO.ok, q: '#c0392b' };
const c7Say = async (L, i) => { if (L[i]) await S(L[i]); };
const c7R1 = v => Math.round(v * 10) / 10;
/* رتبة الجواب بين الخيارات تتغيّر (المراجع A لبوابة M4-U7/U8، 1): rk 0 الجواب الأكبر، 1 الأوسط، 2 الأصغر؛ من مشتّتاتٍ هي أخطاءٌ حقيقية، أولها أولاها،
   ولا مشتّت أقرب إلى الجواب من near (حدّ الدقة). وإن لم تتيسّر الرتبة المطلوبة فالتي بعدها */
function rkPick(w, pool, rk = 0, near = 0) { const P = pool.filter(([v], i, X) => v > 0 && v !== w && Math.abs(v - w) > near + 1e-9 && X.findIndex(d => d[0] === v) === i), lo = P.filter(([v]) => v < w), hi = P.filter(([v]) => v > w);
  for (const k of [rk, (rk + 1) % 3, (rk + 2) % 3]) { const D = k === 0 ? lo.slice(0, 2) : k === 2 ? hi.slice(0, 2) : [lo[0], hi[0]]; if (D.length === 2 && D[0] && D[1]) return [[w, 'ok'], ...D]; }
  /*T*/if (TESTHOOK && P.length < 2) testBug('rkPick: أقلّ من مشتّتين لـ ' + w);/*/T*/
  return [[w, 'ok'], ...P.slice(0, 2)]; }
/* العدد بفاصل الآلاف (بـ«أرقامي»: «٬» مع المشرقية) */
const c7G = v => { const s = String(v); if (!/^\d{5,}$/.test(s)) return s; const t = s.replace(/\B(?=(\d{3})+(?!\d))/g, ','); return SET.digits === 'east' ? t.replace(/,/g, '٬') : t; };
const c7U = u => u === 'L' ? labelText('voL') : voU(u);
const c7Txt = (v, u) => MS(c7G(v)) + (u ? ' ' + c7U(u) : '');
const c7Line = (v, u) => `gen.vo.v.${v}.${u}`;

/* ---------- المجسّمات: cyl | cone | pyr | sph، بقاعدةٍ مركزها cx وأسفلها bot ---------- */
function c7Shape(g, fig, o = {}) { const cx = o.cx ?? 180, bot = o.bot ?? 200, rx = o.rx ?? 66, ry = o.ry ?? 17, H = o.H ?? 120, top = bot - H, P = { cx, bot, top, rx, ry };
  if (fig === 'sph') { const R = o.R ?? 72, cy = bot - R; el('circle', { cx, cy, r: R, fill: C7.top, stroke: C7.edge, 'stroke-width': 3 }, g); el('ellipse', { cx, cy, rx: R, ry: R * .26, fill: 'none', stroke: C7.edge, 'stroke-width': 2, 'stroke-dasharray': '5 4', opacity: .8 }, g); el('circle', { cx, cy, r: 4, fill: C7.ink }, g); return { ...P, cy, R, rEnd: [cx + R, cy] }; }
  if (fig === 'prism') { const w = rx * 1.5, d = ry * 2, A = [cx - w / 2 - d / 2, bot], B = [cx + w / 2 - d / 2, bot], Cc = [cx + w / 2 + d / 2, bot - d], D = [cx - w / 2 + d / 2, bot - d], U = X => [X[0], X[1] - H];   /* منشورٌ قاعدته قاعدة الهرم (المراجع A لبوابة M4-U7/U8، 8) */
    for (const [P, Q] of [[D, A], [D, Cc], [D, U(D)]]) geoLine(g, P[0], P[1], Q[0], Q[1], { color: C7.edge, w: 2, dash: '5 4' });
    el('polygon', { points: polyStr([A, B, U(B), U(A)]), fill: C7.side, stroke: C7.edge, 'stroke-width': 2.6 }, g); el('polygon', { points: polyStr([B, Cc, U(Cc), U(B)]), fill: '#d6e3ef', stroke: C7.edge, 'stroke-width': 2.6 }, g); el('polygon', { points: polyStr([U(A), U(B), U(Cc), U(D)]), fill: C7.top, stroke: C7.edge, 'stroke-width': 2.6 }, g);
    return { ...P, A, B, Cc, D, top: bot - d - H }; }
  if (fig === 'pyr') { const w = rx * 1.5, d = ry * 2, A = [cx - w / 2 - d / 2, bot], B = [cx + w / 2 - d / 2, bot], Cc = [cx + w / 2 + d / 2, bot - d], D = [cx - w / 2 + d / 2, bot - d], T = [cx, top];
    el('polygon', { points: polyStr([A, B, Cc, D]), fill: C7.cone, stroke: C7.coneEdge, 'stroke-width': 2.4 }, g); for (const X of [A, B, Cc]) geoLine(g, X[0], X[1], T[0], T[1], { color: C7.coneEdge, w: 3 }); geoLine(g, D[0], D[1], T[0], T[1], { color: C7.coneEdge, w: 2, dash: '5 4' });
    geoLine(g, cx, bot - d / 2, T[0], T[1], { color: C7.ink, w: 2, dash: '4 3' }); return { ...P, A, B, Cc, D, T, base: [A, B] }; }
  if (fig === 'cone') { const T = [cx, top]; el('path', { d: `M${cx - rx} ${bot} A${rx} ${ry} 0 0 0 ${cx + rx} ${bot} L${T[0]} ${T[1]} Z`, fill: C7.cone, stroke: C7.coneEdge, 'stroke-width': 3 }, g);
    el('path', { d: `M${cx - rx} ${bot} A${rx} ${ry} 0 0 1 ${cx + rx} ${bot}`, fill: 'none', stroke: C7.coneEdge, 'stroke-width': 2, 'stroke-dasharray': '5 4' }, g); geoLine(g, cx, bot, T[0], T[1], { color: C7.ink, w: 2, dash: '4 3' }); el('circle', { cx, cy: bot, r: 4, fill: C7.ink }, g); return { ...P, T, rEnd: [cx + rx, bot], ctr: [cx, bot] }; }
  el('path', { d: `M${cx - rx} ${top} L${cx - rx} ${bot} A${rx} ${ry} 0 0 0 ${cx + rx} ${bot} L${cx + rx} ${top}`, fill: C7.side, stroke: C7.edge, 'stroke-width': 3 }, g);
  el('path', { d: `M${cx - rx} ${bot} A${rx} ${ry} 0 0 1 ${cx + rx} ${bot}`, fill: 'none', stroke: C7.edge, 'stroke-width': 2, 'stroke-dasharray': '5 4', opacity: .7 }, g);
  el('ellipse', { cx, cy: top, rx, ry, fill: C7.top, stroke: C7.edge, 'stroke-width': 3 }, g); el('circle', { cx, cy: top, r: 4, fill: C7.ink }, g); return { ...P, rEnd: [cx + rx, top], ctr: [cx, top] }; }
/* السهم الرأسي للارتفاع، ونصف القطر خطّاً ملوّناً بقيمته */
function c7HArrow(g, x, y1, y2, txt, col = C7.ink) { geoLine(g, x, y1, x, y2, { color: col, w: 2.4 }); geoArrow(g, x, y1, -90, col, 7); geoArrow(g, x, y2, 90, col, 7); return preLab(g, x - 8, (y1 + y2) / 2 + 6, txt, { fs: 15, anchor: 'start', dir: 'rtl', col }); }
function c7RLine(g, A, B, txt, col = C7.r) { geoLine(g, A[0], A[1], B[0], B[1], { color: col, w: 3.4 }); return preLab(g, (A[0] + B[0]) / 2, Math.min(A[1], B[1]) - 10, txt, { col, fs: 15, dir: 'rtl' }); }
const c7PiNote = (g, x = 58, y = 238) => { ciPi(g, x, y - 6, .34, C7.ink); preLab(g, x + 14, y, '= ' + MS('3.14'), { fs: 15, anchor: 'start' }); };

/* ================= ① حجم المجسّم (C415 أ، C416): fig cyl | cone | pyr | sph؛ r أو d، s (ضلع قاعدة الهرم المربعة) أو B (مساحة القاعدة)، h؛ ask vol | h (والحجم V)، u cm | m؛ hm ارتفاع بالمتر وout L (مشروع الخزان) ================= */
function c7VolCh(s) { const pi = 3.14, r = s.r ?? (s.d != null ? s.d / 2 : null), base = s.B ?? (s.fig === 'pyr' ? s.s * s.s : pi * r * r), hh = s.hm != null ? s.hm * 100 : s.h;
  const vol = s.fig === 'cyl' ? base * hh : s.fig === 'sph' ? 4 / 3 * pi * r ** 3 : base * hh / 3; let ch;
  const P = c7VolPool(s, r, base, hh, vol), w = c7R1(s.ask === 'h' ? s.V / base : s.frac ? vol / 1000 * s.frac / 4 : s.out === 'L' ? vol / 1000 : vol);
  return { r, base, ch: rkPick(w, P.map(([v, e]) => [c7R1(v), e]), s.rk ?? 0) }; }
/* المشتّتات أخطاءٌ حقيقية فوق الجواب وتحته (المراجع A لبوابة M4-U7/U8، 1 و15)؛ ولا «سطح الكرة» ولا «الجانب» في الحجم */
function c7VolPool(s, r, base, hh, vol) { const pi = 3.14;
  if (s.ask === 'h') return [...(s.d != null ? [[s.V / (pi * s.d * s.d), 'hDiam']] : []), [s.V / (pi * r), 'cylNoSq'], [s.V / (r * r), 'cylNoPi']];
  if (s.frac) return [[vol / 1000, 'fracNone'], [vol / 4000, 'fracQuarter'], [vol / 2000, 'fracHalf']];   /* ماء ثلاثة الأرباع (المراجع A لبوابة M4-U7/U8، 2) */
  if (s.out === 'L') return [[base * s.hm / 1000, 'tankNoConv'], [vol / 100, 'lit100'], [vol / 1e4, 'm10']];
  if (s.fig === 'cyl') return [...(s.d != null ? [[pi * s.d * s.d * hh, 'cylDiam']] : []), [r * r * hh, 'cylNoPi'], [pi * r * hh * hh, 'cylSqH'], [pi * r * hh, 'cylNoSq'], [2 * pi * r * hh, 'cylR2']];
  if (s.fig === 'sph') return [[pi * r ** 3, 'sphNo43'], [4 * pi * r ** 3, 'sphNo3'], [4 / 3 * pi * r * r, 'sphSq']];
  const third = [[base * hh, 'coneNoThird'], [base * hh / 2, 'coneHalf']];
  if (s.B != null) return [...third, [s.B / 3, 'coneNoH']];
  return [...third, [(s.fig === 'pyr' ? s.s : pi * r) * hh / 3, 'coneNoSq'], ...(s.fig === 'cone' ? [[r * r * hh / 3, 'coneNoPi']] : [])]; }
ITEM.c7Vol = cpItem({ H: 262, tLine: 'gen.c7.together.vol', hint: it => 'gen.c7.hint.vol.' + (it.frac ? 'frac' : it.ask === 'h' ? 'h' : it.fig === 'pyr' ? 'cone' : it.fig),   /* المستوى الثاني سؤالٌ لا العملية (المراجع A لبوابة M4-U7/U8، 6) */ rLine: 'gen.ci.reveal.calc', rSay: it => S(c7Line(it.want, it.uk), { append: true }), praise: 'praiseThink',
  make: s => { const R = c7VolCh(s); return { want: R.ch[0][0], ch: R.ch, r0: R.r, base: R.base, uk: s.out === 'L' ? 'L' : s.ask === 'h' ? s.u : s.u + '3', tag: 'c7-vol-' + s.fig + (s.ask === 'h' ? '-h' : s.out ? '-tank' : '') }; },
  draw(svg, item, tries) { const g = el('g', { 'pointer-events': 'none' }, svg), tg = el('g', { 'pointer-events': 'none' }, svg), top = item.ask === 'h' || item.B != null, F = c7Shape(g, item.fig, item.rot ? { cx: 196, bot: 210, H: 96, rx: 50, ry: 13 } : top ? { cx: 196, bot: 230, H: 88, rx: 56, ry: 15 } : { cx: 196, bot: item.fig === 'pyr' ? 214 : 222, H: 116, R: 70 }), u = item.u, hu = item.hm != null ? 'm' : u; item._g = F;   /* بسطرٍ علويّ يصغر الشكل ليتّسع السطر والبطاقة وعملية المستوى الثالث فوقه (المعروف (1) لبوابة M4-U7/U8) */
    if (item.frac) { const hw = (F.bot - F.top) * item.frac / 4; el('rect', { x: F.cx - F.rx, y: F.bot - hw, width: 2 * F.rx, height: hw, fill: C7.water }, g); geoLine(g, F.cx - F.rx, F.bot - hw, F.cx + F.rx, F.bot - hw, { color: C7.edge, w: 2, dash: '6 4' }); }   /* الماء إلى ثلاثة أرباعه */
    if (item.fig === 'sph') c7RLine(g, [F.cx, F.cy], F.rEnd, ciTxt(item.r, u));
    else if (item.fig === 'pyr') { if (item.B != null) preLab(tg, 180, 46, labelText('c7Base') + ': ' + ciTxt(item.B, u + '2'), { fs: 15, dir: 'rtl', col: C7.coneEdge }); else preLab(g, (F.A[0] + F.B[0]) / 2, F.bot + 20, ciTxt(item.s, u), { fs: 15, dir: 'rtl', col: C7.coneEdge }); }
    else if (item.B != null) preLab(tg, 180, 46, labelText('c7Base') + ': ' + ciTxt(item.B, u + '2'), { fs: 15, dir: 'rtl', col: C7.r });
    else if (item.d != null) { const y = item.fig === 'cyl' ? F.top : F.bot; c7RLine(g, [F.cx - F.rx, y], [F.cx + F.rx, y], labelText('c7Diam') + ' ' + ciTxt(item.d, u), CI.d || C7.r); }
    else c7RLine(g, F.ctr, F.rEnd, ciTxt(item.r, u));
    if (item.fig !== 'sph') c7HArrow(g, F.cx - F.rx - 24, F.top, F.bot, item.ask === 'h' ? '؟' : ciTxt(item.hm ?? item.h, hu), item.ask === 'h' ? C7.q : C7.ink);
    if (item.ask === 'h') preLab(tg, 180, 46, labelText('c7Vol') + ': ' + c7Txt(item.V, u + '3'), { fs: 15, dir: 'rtl' });
    if (item.fig !== 'pyr' && item.B == null) c7PiNote(tg, 270, 240);   /* داخل الإطار (المعروف (1) لبوابة M4-U7/U8) */
    if (item.rot) { item._C = [F.cx, (F.top + F.bot) / 2]; c6Rot(g, item._C, item.rot); }   /* وضعٌ غير نمطي: أسطوانةٌ ملقاة ومخروطٌ مقلوب، والنصوص قائمة (المراجع A لبوابة M4-U7/U8، 14) */
    if (tries >= 3) ciEq(helpG(svg), 180, top ? 106 : 76, c7Calc(item), C7.hl, 15); return {}; },   /* بين البطاقة وتسمية نصف القطر (TXSTRICT في deepall) */
  h2: async (item, ctx) => { const m0 = helpG(ctx.svg), F = item._g, m = item.rot ? el('g', { transform: `rotate(${-item.rot} ${item._C[0]} ${item._C[1]})`, 'pointer-events': 'none' }, m0) : m0;   /* المستوى الثاني رسمٌ (المعروف (2) لبوابة M4-U7/U8): القاعدة مظلّلةً والارتفاع، أو نصف القطر للكرة */
    if (F) { if (item.fig === 'sph') hlSeg(m, [F.cx, F.cy], F.rEnd, H2C[0]); else { if (item.fig === 'pyr') el('polygon', { points: polyStr([F.A, F.B, F.Cc, F.D]), fill: H2C[0], opacity: .35, 'pointer-events': 'none' }, m); else el('ellipse', { cx: F.cx, cy: item.fig === 'cyl' ? F.top : F.bot, rx: F.rx, ry: F.ry, fill: H2C[0], opacity: .35, 'pointer-events': 'none' }, m); hlSeg(m, [F.cx - F.rx - 24, F.top], [F.cx - F.rx - 24, F.bot], H2C[1]); } }
    ciRule(m0, 180, item.ask === 'h' || item.B != null ? [76] : [36], labelText('c7Ask.' + (item.frac ? 'frac' : item.ask === 'h' ? 'h' : item.fig === 'pyr' ? 'cone' : item.fig)), C7.hl, 15); await sleep(FAST ? 10 : 250); },
  pick: item => choosePick(shuffle(item.ch.map(([v]) => [String(v), c7Txt(v, item.uk), '<i></i>', c7Line(v, item.uk)])), String(item.want)),
  errOf: (it, k) => (it.ch.find(([v]) => String(v) === k) || [])[1] || 'c7VolOff' });
ITEM.c7Vol.judge = (item, k) => k === String(item.want) ? { ok: true } : { ok: false, err: (item.ch.find(([v]) => String(v) === k) || [])[1] || 'c7VolOff' };
function c7Calc(it) { const r = it.r0, h = it.hm != null ? it.hm * 100 : it.h;
  if (it.frac) return `${c7R1(3.14 * r * r * h / 1000)} × ${it.frac} ÷ 4 = ؟`;
  if (it.ask === 'h') return `${it.V} ÷ (3.14 × ${r} × ${r}) = ؟`;
  if (it.fig === 'sph') return `4 ÷ 3 × 3.14 × ${r} × ${r} × ${r} = ؟`;
  const B = it.fig === 'pyr' ? (it.B ?? `${it.s} × ${it.s}`) : it.B ?? `3.14 × ${r} × ${r}`;
  return it.fig === 'cyl' ? `${B} × ${h} = ؟` : `${B} × ${h} ÷ 3 = ؟`; }

/* ================= ② مساحة سطح الأسطوانة (C415 ب): r، h، ask sa | lat | len (طول المستطيل الملفوف = المحيط)، u ================= */
function c7SACh(s) { const pi = 3.14, b2 = 2 * pi * s.r * s.r, lat = 2 * pi * s.r * s.h, len = 2 * pi * s.r;   /* والمحيط بالقطر مضروباً في اثنين فوق الجواب (المراجع A لبوابة M4-U7/U8، 1) */
  const [w, P] = { sa: [b2 + lat, [[lat, 'saLatOnly'], [b2 + 2 * lat, 'saDiamC'], [pi * s.r * s.r + lat, 'saOneBase'], [b2 + pi * s.r * s.h, 'saHalfC']]], lat: [lat, [[pi * s.r * s.h, 'saHalfC'], [b2 + lat, 'saAll'], [pi * s.r * s.r * s.h, 'saVol'], [2 * lat, 'latDiamC']]], len: [len, [[pi * s.r, 'lenHalf'], [2 * len, 'lenDiamC'], [2 * s.r, 'lenDiam'], [pi * s.r * s.r, 'lenArea']]] }[s.ask];
  return rkPick(c7R1(w), P.map(([v, e]) => [c7R1(v), e]), s.rk ?? 0); }
function c7Net(g, r, h, o = {}) { const k = Math.min(210 / (2 * 3.14 * r), (o.hmax ?? 116) / h, (o.fit ?? 160) / (h + 4 * r)), W = 2 * 3.14 * r * k, Hh = h * k, R = r * k, x0 = 180 - W / 2, y0 = o.y0 ?? 112 - Hh / 2;   /* الدائرتان داخل الإطار (المعروف (1)) */
  el('rect', { x: x0, y: y0, width: W, height: Hh, fill: C7.side, stroke: C7.edge, 'stroke-width': 3 }, g);
  for (const cy of [y0 - R, y0 + Hh + R]) { el('circle', { cx: x0 + W / 2, cy, r: R, fill: C7.top, stroke: C7.edge, 'stroke-width': 3 }, g); el('circle', { cx: x0 + W / 2, cy, r: 3, fill: C7.ink }, g); }
  return { x0, y0, W, Hh, R, cTop: [x0 + W / 2, y0 - R] }; }
ITEM.c7SA = cpItem({ H: 262, tLine: 'gen.c7.together.sa', hint: it => 'gen.c7.hint.sa.' + it.ask, rLine: 'gen.ci.reveal.calc', rSay: it => S(c7Line(it.want, it.uk), { append: true }), praise: 'praiseThink',
  make: s => { const ch = c7SACh(s); return { want: ch[0][0], ch, uk: s.ask === 'len' ? s.u : s.u + '2', tag: 'c7-sa-' + s.ask }; },
  draw(svg, item, tries) { const g = el('g', { 'pointer-events': 'none' }, svg), N = c7Net(g, item.r, item.h), u = item.u; item._g = N;
    c7RLine(g, N.cTop, [N.cTop[0] + N.R, N.cTop[1]], ciTxt(item.r, u)); c7HArrow(g, N.x0 - 14, N.y0, N.y0 + N.Hh, ciTxt(item.h, u));
    preLab(g, 180, N.y0 + N.Hh / 2 + 6, item.ask === 'len' ? '؟' : labelText('c7Perim'), { fs: item.ask === 'len' ? 20 : 15, col: item.ask === 'len' ? C7.q : C7.edge, dir: 'rtl' });
    if (item.ask === 'sa') for (const cy of [N.y0 - N.R, N.y0 + N.Hh + N.R]) el('circle', { cx: 180, cy, r: N.R, fill: 'rgba(217,130,43,.25)', stroke: 'none' }, g);
    if (tries < 3) c7PiNote(g, 270, 240);
    if (tries >= 3) ciEq(helpG(svg), 150, 252, { sa: `2 × 3.14 × ${item.r} × ${item.r} + 2 × 3.14 × ${item.r} × ${item.h}`, lat: `2 × 3.14 × ${item.r} × ${item.h} = ؟`, len: `2 × 3.14 × ${item.r} = ؟` }[item.ask], C7.hl, 13); return {}; },
  h2: async (item, ctx) => { const m = helpG(ctx.svg), N = item._g;   /* الجزء المطلوب من الشبكة مظلّلاً: طول المستطيل حول الدائرة، أو المستطيل، أو الثلاثة */
    if (N) { if (item.ask === 'len') { el('circle', { cx: N.cTop[0], cy: N.cTop[1], r: N.R + 3, fill: 'none', stroke: H2C[0], 'stroke-width': 5, opacity: .7, 'pointer-events': 'none' }, m); hlSeg(m, [N.x0, N.y0], [N.x0 + N.W, N.y0], H2C[0]);
        for (const t of ctx.svg.querySelectorAll('text')) { if (t.closest('[data-help]')) continue; let b = null; try { b = t.getBBox(); } catch (e) {} if (b && Math.hypot(b.x + b.width / 2 - N.cTop[0], b.y + b.height / 2 - N.cTop[1]) < N.R + 12) m.appendChild(t.cloneNode(true)); } }   /* تسمية نصف القطر فوق حلقة المحيط لا تحتها */
      else { el('polygon', { points: polyStr([[N.x0, N.y0], [N.x0 + N.W, N.y0], [N.x0 + N.W, N.y0 + N.Hh], [N.x0, N.y0 + N.Hh]]), fill: H2C[0], opacity: .3, 'pointer-events': 'none' }, m); if (item.ask === 'sa') for (const cy of [N.y0 - N.R, N.y0 + N.Hh + N.R]) el('circle', { cx: N.x0 + N.W / 2, cy, r: N.R, fill: H2C[1], opacity: .3, 'pointer-events': 'none' }, m); } }
    ciRule(m, 180, [212], labelText('c7AskSA.' + item.ask), C7.hl, 15); await sleep(FAST ? 10 : 250); },
  pick: item => choosePick(shuffle(item.ch.map(([v]) => [String(v), c7Txt(v, item.uk), '<i></i>', c7Line(v, item.uk)])), String(item.want)),
  errOf: (it, k) => (it.ch.find(([v]) => String(v) === k) || [])[1] || 'c7SAOff' });
ITEM.c7SA.judge = (item, k) => k === String(item.want) ? { ok: true } : { ok: false, err: (item.ch.find(([v]) => String(v) === k) || [])[1] || 'c7SAOff' };

/* ================= ③ التحويل بين اللتر وسم³ وم³ (C414): v، from، to ================= */
const C7_F = { 'L>cm3': 1000, 'cm3>L': .001, 'm3>L': 1000, 'm3>cm3': 1e6 };
function c7ConvCh(s) { const f = C7_F[s.from + '>' + s.to], R3 = v => Math.round(v * 1000) / 1000, w = R3(s.v * f);   /* فوق الجواب وتحته في كل اتجاه (المراجع A لبوابة M4-U7/U8، 1) */
  const P = { 'L>cm3': [[s.v * 100, 'lit100'], [s.v * 1e6, 'litM'], [s.v, 'lit1']], 'cm3>L': [[s.v / 100, 'lit100'], [s.v / 10, 'lit10'], [s.v, 'lit1']], 'm3>L': [[s.v * 100, 'm3L100'], [s.v * 1e6, 'm3cm3'], [s.v, 'convNone']], 'm3>cm3': [[s.v * 1000, 'm3L'], [s.v * 1e9, 'm1000'], [s.v * 100, 'm3cm100']] }[s.from + '>' + s.to];
  return rkPick(w, P.map(([v, e]) => [R3(v), e]), s.rk ?? 0); }
ITEM.c7Conv = cpItem({ H: 236, tLine: 'gen.c7.together.conv', hint: 'gen.c7.hint.conv', rLine: 'gen.ci.reveal.calc', rSay: it => S(c7Line(it.want, it.to), { append: true }), praise: 'praiseThink',
  make: s => { const ch = c7ConvCh(s); return { want: ch[0][0], ch, tag: 'c7-conv-' + s.from + '-' + s.to }; },
  draw(svg, item, tries) { const g = el('g', { 'pointer-events': 'none' }, svg); soBox(g, 3, 3, 3, { s: 30, cx: 180, cy: 132 });
    el('rect', { x: 70, y: 14, width: 220, height: 40, rx: 12, fill: '#fff', stroke: C7.edge, 'stroke-width': 2 }, g); preLab(g, 180, 41, c7Txt(item.v, item.from) + ' = ؟ ' + c7U(item.to), { fs: 19, dir: 'rtl', col: C7.edge });
    if (tries >= 3) ciEq(helpG(svg), 180, 236, `${item.v} ${item.from === 'cm3' ? '÷' : '×'} ${item.from === 'm3' && item.to === 'cm3' ? 1000000 : 1000} = ؟`, C7.hl, 17); return {}; },   /* الثالث حلٌّ مشترك يقف قبل الناتج (المراجع A لبوابة M4-U7/U8، 6 (ج)) */
  h2: async (item, ctx) => { const m = helpG(ctx.svg); el('polygon', { points: polyStr([[128, 80], [232, 80], [232, 184], [128, 184]]), fill: 'none', stroke: H2C[0], 'stroke-width': 3, 'stroke-dasharray': '7 5', 'pointer-events': 'none' }, m);   /* المكعب كلّه: كم مكعباً صغيراً فيه؟ */
    ciRule(m, 180, 206, labelText(item.from === 'm3' ? 'c7AskM3' : 'c7AskL'), C7.hl, 15); await sleep(FAST ? 10 : 250); },
  sayQ: async it => { await S(c7Line(it.v, it.from), { append: true }); await S('gen.c7.q.convTo.' + it.to, { append: true }); },
  pick: item => choosePick(shuffle(item.ch.map(([v]) => [String(v), c7Txt(v, item.to), '<i></i>', c7Line(v, item.to)])), String(item.want)),
  errOf: (it, k) => (it.ch.find(([v]) => String(v) === k) || [])[1] || 'c7ConvOff' });
ITEM.c7Conv.judge = (item, k) => k === String(item.want) ? { ok: true } : { ok: false, err: (item.ch.find(([v]) => String(v) === k) || [])[1] || 'c7ConvOff' };

/* ---------- صورة بطاقة التعليل (pfReasonPic، المفتاح c7): fig، أو pour (مخروط وأسطوانة)، أو litre (مكعب 10 سم) ---------- */
function c7Pic(g, P) {
  /* صورٌ جديدة لا صور المشاهد (المراجع A لبوابة M4-U7/U8، 5) */
  if (P.base) { const F = c7Shape(g, 'cyl', { cx: 196, bot: 170, rx: 56, ry: 14, H: 110 }); el('ellipse', { cx: F.cx, cy: F.top, rx: F.rx, ry: F.ry, fill: 'rgba(217,130,43,.35)', stroke: C7.edge, 'stroke-width': 2 }, g); c7HArrow(g, F.cx - F.rx - 22, F.top, F.bot, ''); return; }
  if (P.coins) { for (let i = 0; i < 9; i++) { const y = 168 - i * 11; el('path', { d: `M${120} ${y} L${120} ${y + 6} A60 13 0 0 0 ${240} ${y + 6} L${240} ${y}`, fill: '#d9a441', stroke: '#9a6b16', 'stroke-width': 1.6 }, g); el('ellipse', { cx: 180, cy: y, rx: 60, ry: 13, fill: '#f2cd6b', stroke: '#9a6b16', 'stroke-width': 1.6 }, g); } return; }
  if (P.label) { c7Shape(g, 'cyl', { cx: 90, bot: 160, rx: 40, ry: 11, H: 96 }); el('path', { d: 'M150 64 L318 64 Q330 112 318 160 L150 160 Z', fill: '#fbe3b6', stroke: '#c47a2c', 'stroke-width': 2.4 }, g); for (const cy of [52, 172]) el('ellipse', { cx: 236, cy, rx: 26, ry: 8, fill: C7.top, stroke: C7.edge, 'stroke-width': 2 }, g); return; }
  if (P.pair) { c7Shape(g, 'cone', { cx: 110, bot: 160, rx: 46, ry: 12, H: 110 }); c7Shape(g, 'cyl', { cx: 250, bot: 160, rx: 46, ry: 12, H: 110 }); geoLine(g, 40, 50, 320, 50, { color: '#7d8a90', w: 1.6, dash: '6 5' }); return; }
  if (P.funnel) { el('path', { d: 'M126 40 L234 40 L190 112 L190 128 L170 128 L170 112 Z', fill: C7.cone, stroke: C7.coneEdge, 'stroke-width': 2.6 }, g); el('ellipse', { cx: 180, cy: 40, rx: 54, ry: 10, fill: '#fbeedc', stroke: C7.coneEdge, 'stroke-width': 2 }, g); c7Shape(g, 'cyl', { cx: 180, bot: 186, rx: 54, ry: 12, H: 50 }); return; }
  if (P.bottle) { el('path', { d: 'M160 30 L200 30 L200 58 Q232 74 232 104 L232 184 Q232 194 222 194 L138 194 Q128 194 128 184 L128 104 Q128 74 160 58 Z', fill: 'rgba(80,160,220,.25)', stroke: C7.edge, 'stroke-width': 2.6 }, g); el('rect', { x: 132, y: 116, width: 96, height: 40, rx: 6, fill: '#fff', stroke: C7.edge, 'stroke-width': 1.6 }, g); preLab(g, 180, 142, MS('1.5') + ' ' + labelText('voL'), { fs: 15, dir: 'rtl', col: C7.edge }); return; }
  if (P.cylPrism) { c7Shape(g, 'cyl', { cx: 110, bot: 170, rx: 46, ry: 12, H: 110 }); c7Shape(g, 'prism', { cx: 254, bot: 176, rx: 40, ry: 12, H: 104 }); return; }
  if (P.pyrPrism) { c7Shape(g, 'pyr', { cx: 110, bot: 176, rx: 40, ry: 12, H: 110 }); c7Shape(g, 'prism', { cx: 254, bot: 176, rx: 40, ry: 12, H: 110 }); return; }
  if (P.three) { for (const x of [60, 130, 200]) c7Shape(g, 'cone', { cx: x, bot: 160, rx: 28, ry: 8, H: 90 }); const F = c7Shape(g, 'cyl', { cx: 296, bot: 160, rx: 40, ry: 11, H: 90 }); el('rect', { x: F.cx - F.rx, y: F.bot - 90, width: 2 * F.rx, height: 90, fill: C7.water }, g); return; }
  if (P.layers) { c7Shape(g, 'cyl', { cx: 180, bot: 176, rx: 56, ry: 14, H: 120 }); for (let i = 1; i <= 5; i++) el('ellipse', { cx: 180, cy: 176 - i * 20, rx: 56, ry: 14, fill: 'rgba(80,160,220,.15)', stroke: C7.edge, 'stroke-width': 1.2 }, g); return; }
  if (P.tank) { const F = c7Shape(g, 'cyl', { cx: 196, bot: 176, rx: 58, ry: 15, H: 120 }); c7RLine(g, F.ctr, F.rEnd, ciTxt(P.r ?? 50, 'cm')); c7HArrow(g, F.cx - F.rx - 22, F.top, F.bot, ciTxt(P.h ?? 1, 'm')); return; }
  if (P.pour) { c7Shape(g, 'cone', { cx: 110, bot: 160, rx: 44, ry: 12, H: 110 }); const F = c7Shape(g, 'cyl', { cx: 250, bot: 160, rx: 44, ry: 12, H: 110 }); el('rect', { x: F.cx - F.rx, y: F.bot - 110 / 3, width: 2 * F.rx, height: 110 / 3, fill: C7.water }, g); return; }
  if (P.litre && P.noEq) { soBox(g, 3, 3, 3, { s: 30, cx: 180, cy: 104 }); preLab(g, 180, 192, ciTxt(10, 'cm'), { fs: 15, dir: 'rtl' }); return; }   /* بلا معادلته في سؤال «لماذا ألف؟» */
  if (P.litre) { soBox(g, 3, 3, 3, { s: P.small ? 26 : 34, cx: 180, cy: 104 }); if (!P.small) preLab(g, 180, 190, MX(MS('10') + ' × ' + MS('10') + ' × ' + MS('10')), { fs: 15 }); else ciEq(g, 180, 190, '10 × 10 × 10 = 1000', C7.ok, 15); return; }
  if (P.net && P.perim) { const N = c7Net(g, 2, 3, { y0: 64, hmax: 80, fit: 130 }); preLab(g, 180, N.y0 + N.Hh / 2 + 6, labelText('c7Perim'), { fs: 15, col: C7.edge, dir: 'rtl' }); return; }
  if (P.net) { c7Net(g, 2, 3, { y0: 64, hmax: 80, fit: 130 }); return; }
  c7Shape(g, P.fig || 'cyl', { cx: 180, bot: 176, rx: 56, ry: 14, H: 120, R: 70 }); }

/* ================= المشاهد ================= */
/* د1: الأسطوانة طبقاتٌ من الأقراص: مساحة القاعدة × الارتفاع */
/* الإشعال يقف عند سؤال فرجار (المراجع A لبوابة M4-U7/U8، 8): مكعباتٌ في الأسطوانة تترك فراغاً عند جدارها */
SCENES.c7CylHook = async c => { const L = c.lines, svg = m3Stage(250), g = el('g', { 'pointer-events': 'none' }, svg); c7Shape(g, 'cyl', { cx: 180, bot: 210, H: 140 }); await c7Say(L, 0);
  const w = el('g', { 'pointer-events': 'none' }, svg); for (let j = 0; j < 3; j++) for (let i = 0; i < 4; i++) { el('rect', { x: 128 + i * 26, y: 196 - (j + 1) * 26, width: 24, height: 24, rx: 3, fill: '#f6c56b', stroke: '#9a6b16', 'stroke-width': 1.4 }, w); } SFX.tick(); await c7Say(L, 1); for (const l of L.slice(2)) await S(l); };
/* الاكتشاف: أقراصٌ متطابقة طبقةً فوق طبقة، ثم المثال، ثم الارتفاع من الحجم بتوقّع (المراجع A لبوابة M4-U7/U8، 8 و9) */
SCENES.c7CylShow = async c => { const L = c.lines, svg = m3Stage(250); let g = el('g', { 'pointer-events': 'none' }, svg), F = c7Shape(g, 'cyl', { cx: 210, bot: 210, H: 130 });
  const w = el('g', { 'pointer-events': 'none' }, g); for (let i = 1; i <= 6; i++) { el('ellipse', { cx: F.cx, cy: F.bot - i * 130 / 6, rx: F.rx, ry: F.ry, fill: 'rgba(80,160,220,.16)', stroke: C7.edge, 'stroke-width': 1.3 }, w); SFX.tick(); await sleep(FAST ? 2 : 140); } await c7Say(L, 0);
  el('ellipse', { cx: F.cx, cy: F.top, rx: F.rx, ry: F.ry, fill: 'rgba(217,130,43,.3)' }, g); c7RLine(g, F.ctr, F.rEnd, ciTxt(2, 'cm')); await c7Say(L, 1);   /* الوجه قبل التسمية فلا يغطّيها */
  c7HArrow(g, F.cx - F.rx - 24, F.top, F.bot, ciTxt(10, 'cm')); SFX.tick(); await c7Say(L, 2); ciEq(g, 180, 30, '3.14 × 2 × 2 × 10 = 125.6', C7.ok, 17); c7PiNote(g, 44, 228); SFX.tick(); await c7Say(L, 3); await c7Say(L, 4);
  if (L[5]) { g.remove(); g = el('g', { 'pointer-events': 'none' }, svg); F = c7Shape(g, 'cyl', { cx: 210, bot: 214, H: 110 }); c7RLine(g, F.ctr, F.rEnd, ciTxt(5, 'cm')); c7HArrow(g, F.cx - F.rx - 24, F.top, F.bot, '؟', C7.q);
    preLab(g, 180, 40, labelText('c7Vol') + ': ' + c7Txt(392.5, 'cm3'), { fs: 15, dir: 'rtl' }); SFX.tick(); await c7Say(L, 5);
    ciEq(g, 180, 66, '392.5 ÷ (3.14 × 5 × 5) = 5', C7.ok, 16); SFX.tick(); await c7Say(L, 6); }
  for (const l of L.slice(7)) await S(l); };
/* د2: نفتح العلبة: دائرتان ومستطيلٌ طوله المحيط */
SCENES.c7NetShow = async c => { const L = c.lines, svg = m3Stage(262); let g = el('g', { 'pointer-events': 'none' }, svg);
  if (c.hook) { c7Shape(g, 'cyl', { cx: 180, bot: 200, H: 120 }); await c7Say(L, 0); await c7Say(L, 1); for (const l of L.slice(2)) await S(l); return; }   /* الإشعال: العلبة وسؤال فرجار (المراجع A لبوابة M4-U7/U8، 8) */
  const N = c7Net(g, 2, 10); preLab(g, 180, N.y0 + N.Hh / 2 + 6, labelText('c7Perim'), { fs: 14, col: C7.edge, dir: 'rtl' }); c7HArrow(g, N.x0 - 14, N.y0, N.y0 + N.Hh, ciTxt(10, 'cm')); SFX.tick(); await c7Say(L, 0);
  ciEq(g, 180, 252, '25.1 + 125.6 = 150.7', C7.ok, 17); SFX.tick(); await c7Say(L, 1); for (const l of L.slice(2)) await S(l); };
/* د3: ثلاث تعبئات من المخروط تملأ الأسطوانة */
SCENES.c7ThirdShow = async c => { const L = c.lines, svg = m3Stage(250);
  if (c.hook) { c7Shape(svg, 'cone', { cx: 100, bot: 200, rx: 52, ry: 14, H: 130 }); c7Shape(svg, 'cyl', { cx: 260, bot: 200, rx: 52, ry: 14, H: 130 }); await c7Say(L, 0); await c7Say(L, 1); for (const l of L.slice(2)) await S(l); return; }   /* الإشعال يقف عند «كم مرة؟» (المراجع A لبوابة M4-U7/U8، 8) */
  const fill = async (a, b) => { let g = el('g', { 'pointer-events': 'none' }, svg); c7Shape(g, a, { cx: 100, bot: 200, rx: 52, ry: 14, H: 130 }); const F = c7Shape(g, b, { cx: 260, bot: 200, rx: 52, ry: 14, H: 130 });
    const x0 = b === 'prism' ? F.A[0] : F.cx - F.rx, wd = b === 'prism' ? F.B[0] - F.A[0] : 2 * F.rx, w = el('rect', { x: x0, y: F.bot, width: wd, height: 0, fill: C7.water, 'pointer-events': 'none' }, g), t = preLab(g, 260, 40, '', { fs: 20, col: C7.edge });
    for (let i = 1; i <= 3; i++) { const h = 130 * i / 3; w.setAttribute('y', F.bot - h); w.setAttribute('height', h); t.textContent = MS(String(i)); SFX.tick(); await sleep(FAST ? 10 : 700); } return g; };
  const g1 = await fill('cone', 'cyl'); await c7Say(L, 0); g1.remove(); await fill('pyr', 'prism'); await c7Say(L, 1); for (const l of L.slice(2)) await S(l); };
SCENES.c7SphereShow = async c => { const L = c.lines, svg = m3Stage(250), g = el('g', { 'pointer-events': 'none' }, svg), F = c7Shape(g, 'sph', { cx: 180, bot: 214, R: 80 }); c7RLine(g, [F.cx, F.cy], F.rEnd, ciTxt(3, 'cm')); await c7Say(L, 0);
  ciEq(g, 180, 30, '4 ÷ 3 × 3.14 × 3 × 3 × 3 ≈ 113.0', C7.ok, 15);   /* بمنزلةٍ واحدة (D95؛ المراجع A لبوابة M4-U7/U8، 22) */ SFX.tick(); await c7Say(L, 1); for (const l of L.slice(2)) await S(l); };
/* د4: المكعب 10 سم لترٌ، والمتر المكعب ألف لتر */
SCENES.c7LiterShow = async c => { const L = c.lines, svg = m3Stage(250); let g = el('g', { 'pointer-events': 'none' }, svg); soBox(g, 3, 3, 3, { s: 36, cx: 180, cy: 140 }); ciEq(g, 180, 28, '10 × 10 × 10 = 1000', C7.ok, 17); await c7Say(L, 0);
  preLab(g, 180, 228, '1000 ' + labelText('voCm3') + ' = 1 ' + labelText('voL'), { fs: 16, dir: 'rtl', col: C7.edge }); SFX.tick(); await c7Say(L, 1);
  g.remove(); g = el('g', { 'pointer-events': 'none' }, svg); soBox(g, 4, 4, 4, { s: 30, cx: 180, cy: 140 }); ciEq(g, 180, 28, `100 × 100 × 100 = ${c7G(1000000)}`, C7.ok, 16); preLab(g, 180, 228, MS('1') + ' ' + labelText('voM3') + ' = ' + MS('1000') + ' ' + labelText('voL'), { fs: 16, dir: 'rtl', col: C7.edge }); SFX.tick(); await c7Say(L, 2); for (const l of L.slice(3)) await S(l); };
/* د4: خزان الماء: نصف قطره 50 سم وارتفاعه 1 م */
/* المشروع بمعطياته وحدها: الطفل يحسب في البنود بعده (المراجع A لبوابة M4-U7/U8، 2) */
SCENES.c7TankShow = async c => { const L = c.lines, svg = m3Stage(262), g = el('g', { 'pointer-events': 'none' }, svg), F = c7Shape(g, 'cyl', { cx: 200, bot: 222, rx: 72, ry: 18, H: 150 });
  const hw = 150 * .75, wg = el('g', { 'pointer-events': 'none', opacity: 0 }, g); el('rect', { x: F.cx - F.rx, y: F.bot - hw, width: 2 * F.rx, height: hw, fill: C7.water }, wg); geoLine(wg, F.cx - F.rx, F.bot - hw, F.cx + F.rx, F.bot - hw, { color: C7.edge, w: 2, dash: '6 4' });   /* الماء تحت التسميات */
  c7RLine(g, F.ctr, F.rEnd, ciTxt(50, 'cm')); c7HArrow(g, F.cx - F.rx - 24, F.top, F.bot, ciTxt(1, 'm')); await c7Say(L, 0);
  wg.setAttribute('opacity', 1); SFX.tick(); await c7Say(L, 1);
  for (const l of L.slice(2)) await S(l); };
WRAP_ART.vol4Art = svg => { const g = el('g', { 'pointer-events': 'none' }, svg); c7Shape(g, 'cyl', { cx: 150, bot: 190, rx: 46, ry: 12, H: 100 }); c7Shape(g, 'cone', { cx: 262, bot: 190, rx: 40, ry: 11, H: 100 }); };
