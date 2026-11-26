/* =====================================================================
   S3-U7 «الدائرة» (المرحلة 3، المرجع reference/03_المناهج_والوحدات/S3-U7_الدائرة.md، نسخة 1.1)
   د1 أجزاء الدائرة والقطر بالفرجار (C235، C236: بنود S2-U9 circPart وradDia وcompassDraw، و«رامي الهدف»)
   د2 المحيط والعدد π (C306): الخيط يُلفّ ويُفرد، والنسبة نحو 3.1، وπ نحو 3.14، والمحيط = 3.14 × القطر = 2 × 3.14 × نصف القطر
   د3 مساحة القرص (C307): العدّ على الشبكة وحصرها بين مربعين، والمساحة = 3.14 × نصف القطر × نصف القطر
   د4 مشروع «حديقة مستديرة» ومعه تضاعف نصف القطر يضاعف المساحة 4 مرات (C307 (ج)، منقول من د3 إلى المشروع: D248)
   π = 3.14، والمحيط بمنزلة عشرية واحدة (التعديل 2)؛ وخط القراءة لا يحمل الحرف π فيُرسم (ciPi) ويُقال ويُكتب «باي».
   خيارات الأعداد من المولّد (tools/m3gen/u7.py): ch [[القيمة، وسم الخطأ]] والأول الجواب، فجملها مولَّدة معها (gen.ci.v.*).
   ===================================================================== */
const CI = { disc: '#dcefd6', edge: '#3f8f5a', grid: '#dfe5ea', fence: '#a0643a', str: '#c8392d', can: '#f3e3bf', canEdge: '#9a7a3c', ink: CPC.ink, ok: CPC.ok, bad: CPC.bad, r: '#c8392d', d: '#2a5f94', think: '#8e6bbf' };
const ciR = v => +(+v).toFixed(2);
const ciKey = v => String(ciR(v)).replace('.', '_');
const ciLine = (v, u) => `gen.ci.v.${ciKey(v)}.${u || 'n'}`;
const ciU = u => ({ cm: labelText('rulCm'), m: labelText('lenM'), cm2: labelText('arCm2'), m2: labelText('arM2') })[u] || '';
const ciTxt = (v, u) => MS(String(ciR(v))) + (u && u !== 'n' ? ' ' + ciU(u) : '');
/* وحدة الجواب: الطول للمحيط والقطر ونصفه، والمربعة للمساحة ونصفها */
const ciUnitOf = (ask, u) => ['area', 'half'].includes(ask) ? u + '2' : ['ratio', 'times'].includes(ask) ? 'n' : u;
/* حسابٌ بالأعداد وحدها: يُكتب من اليسار ويُعكس للأرقام العربية (MF)، فيُقرأ من اليمين «3.14 × 10 = 31.4» */
function ciEq(parent, x, y, s, col = CI.ok, fs = 18) { const t = el('text', { x, y, 'text-anchor': 'middle', 'font-size': fs, 'font-weight': 800, fill: col, stroke: '#fff', 'stroke-width': 4, 'paint-order': 'stroke', 'pointer-events': 'none' }, parent); return mfSet(t, s); }
/* قانونٌ بالكلمات (نصٌّ من اليمين) */
function ciRule(parent, x, y, txt, col = CI.think, fs = 16) { const g = el('g', { 'pointer-events': 'none' }, parent), w = Math.min(312, Math.max(120, 9.4 * plain(txt).length + 30));
  /* البطاقة داخل الإطار الورقي أياً كان موضعها المطلوب (المراجع B لبوابة S3-U8/U9، 4) */
  { const sv = parent.ownerSVGElement || parent, vb = sv.viewBox && sv.viewBox.baseVal, H = vb && vb.height ? vb.height : 250; y = Math.min(Math.max(y, 14 + 22), H - 14 - 20); x = Math.min(Math.max(x, 20 + w / 2 + 2), 340 - w / 2 - 2); }
  el('rect', { x: x - w / 2, y: y - 19, width: w, height: 36, rx: 12, fill: '#fff', stroke: col, 'stroke-width': 2.4 }, g); const t = el('text', { x, y: y + 6, 'text-anchor': 'middle', 'font-size': fs, 'font-weight': 800, fill: col, direction: 'rtl' }, g); t.textContent = txt; return g; }
/* الحرف π مرسوماً (لا يحمله خط القراءة) */
function ciPi(parent, x, y, s = 1, col = CI.think) { const g = el('g', { transform: `translate(${x} ${y}) scale(${s})`, 'pointer-events': 'none' }, parent);
  el('path', { d: 'M-22 -14 Q-20 -22 -10 -21 L22 -21', fill: 'none', stroke: col, 'stroke-width': 6, 'stroke-linecap': 'round' }, g);
  el('path', { d: 'M-8 -20 Q-9 6 -18 20', fill: 'none', stroke: col, 'stroke-width': 6, 'stroke-linecap': 'round' }, g);
  el('path', { d: 'M9 -20 Q7 10 14 18 Q19 22 23 14', fill: 'none', stroke: col, 'stroke-width': 6, 'stroke-linecap': 'round' }, g); return g; }
/* دائرة بنصف قطرها أو قطرها مسمّى بطوله؛ disc: قرصٌ ملوّن */
function ciCircle(parent, C, R, o = {}) { const g = el('g', { 'pointer-events': 'none' }, parent);
  el('circle', { cx: C[0], cy: C[1], r: R, fill: o.disc ? CI.disc : '#fffdf6', stroke: o.ring ? CI.str : CI.edge, 'stroke-width': o.ring ? 5 : 3 }, g); el('circle', { cx: C[0], cy: C[1], r: 3.5, fill: CI.ink }, g);
  if (o.seg === 'r') { const Q = angP(C, 20, R); geoLine(g, C[0], C[1], Q[0], Q[1], { color: CI.r, w: 4 }); if (o.lab) htLab(g, [(C[0] + Q[0]) / 2 + 2, (C[1] + Q[1]) / 2 - 16], o.lab, CI.r, 15); }
  if (o.seg === 'd') { const P1 = angP(C, 180, R), P2 = angP(C, 0, R); geoLine(g, P1[0], P1[1], P2[0], P2[1], { color: CI.d, w: 4 }); if (o.lab) htLab(g, [C[0], C[1] - 14], o.lab, CI.d, 15); }
  return g; }
/* السطر العلوي: ما أُعطي (نصف القطر 5 سم / القطر 8 سم / المحيط 15.7 سم / المساحة 12.56 سم²) */
const CI_GIVEN = { r: 'cpPart.radius', d: 'cpPart.diameter', C: 'ciPerim', A: 'ciArea' };
function ciTop(svg, k, v, u, y = 40) {   /* تحت حافة الإطار لا عليها (المراجع B لبوابة S3-U6/U7، 12) */ const t = el('text', { x: 180, y, 'text-anchor': 'middle', 'font-size': 17, 'font-weight': 800, fill: k === 'r' ? CI.r : k === 'd' ? CI.d : CI.ink, direction: 'rtl', 'pointer-events': 'none' }, svg); t.textContent = `${labelText(CI_GIVEN[k])}: ${ciTxt(v, k === 'A' ? u + '2' : u)}`; return t; }
/* الحساب كاملاً لكل سؤال (الكشف)، وبعلامة استفهام (الحلّ المشترك) */
function ciCalcStr(item, q) { const r = item.fig === 'r' ? item.v : item.fig === 'd' ? item.v / 2 : null, d = item.fig === 'd' ? item.v : r != null ? 2 * r : null, w = ciR(item.want),
    eq = exact => q ? '؟' : ciR(exact) === w ? String(w) : `${ciR(exact)} ≈ ${w}`;   /* المحيط بمنزلة واحدة (التعديل 2): «25.12 ≈ 25.1» */
  if (item.ask === 'perim') return item.fig === 'r' ? `2 × 3.14 × ${item.v} = ${eq(6.28 * item.v)}` : `3.14 × ${d} = ${eq(3.14 * d)}`;
  if (item.ask === 'area') return `3.14 × ${r} × ${r} = ${eq(3.14 * r * r)}`;
  if (item.ask === 'half') return `${ciR(3.14 * r * r)} ÷ 2 = ${eq(1.57 * r * r)}`;
  if (item.ask === 'dia') return `${item.v} ÷ 3.14 = ${eq(item.v / 3.14)}`;
  if (item.ask === 'rad') return q ? `${item.v} ÷ 3.14 = ؟ × ؟` : `${item.v} ÷ 3.14 = ${w * w} = ${w} × ${w}`;
  return ''; }
/* الكشف يحلّ محلّ الحلّ المشترك وتلميح القانون في الموضع نفسه، فلا يتراكب نصّان */
const ciClearHelp = svg => svg.querySelectorAll('[data-help]').forEach(n => n.remove());
/* الحديقة: قرص عشب وسياج حوله */
function ciGarden(parent, C, R) { const g = el('g', { 'pointer-events': 'none' }, parent); el('circle', { cx: C[0], cy: C[1], r: R, fill: '#bfe3a8', stroke: CI.edge, 'stroke-width': 2 }, g);
  for (let a = 0; a < 360; a += 15) { const P = angP(C, a, R + 6), Q = angP(C, a, R + 14); geoLine(g, P[0], P[1], Q[0], Q[1], { color: CI.fence, w: 3 }); }
  el('circle', { cx: C[0], cy: C[1], r: R + 9, fill: 'none', stroke: CI.fence, 'stroke-width': 2.5 }, g);
  for (const [dx, dy, c] of [[-24, -18, '#e86f8f'], [20, -26, '#f2c14e'], [26, 16, '#e86f8f'], [-18, 22, '#f2c14e'], [0, 0, '#ffffff']]) { el('circle', { cx: C[0] + dx * R / 70, cy: C[1] + dy * R / 70, r: 5, fill: c, stroke: '#8a6a1e', 'stroke-width': 1 }, g); }
  el('circle', { cx: C[0], cy: C[1], r: 3.5, fill: CI.ink }, g); return g; }

/* ================= ① احسب: المحيط | المساحة | نصف المساحة | القطر من المحيط | نصف القطر من المساحة (C306، C307) =================
   fig r | d | C | A وقيمته v، وu cm | m؛ garden: حديقة بسياج (مهندس الحدائق والمشروع)؛ ch من المولّد */
/* لا خياران بنصٍّ واحد بعد التقريب (المراجع B لبوابة S3-U6/U7، 10) */
const ciChk = (s, t) => { /*T*/if (TESTHOOK && new Set(s.ch.map(([v]) => String(ciR(v)))).size !== s.ch.length) testBug(t + ': خياران متطابقان');/*/T*/ return s; };
ITEM.circCalc = cpItem({ H: 262, tLine: 'gen.ci.together.calc', hint: 'gen.ci.hint.calc',
  rLine: 'gen.ci.reveal.calc', rSay: it => S(ciLine(it.want, ciUnitOf(it.ask, it.u)), { append: true }), praise: 'praiseThink',
  make: s => (ciChk(s, 'circCalc'), { want: ciR(s.ch[0][0]), tag: 'circ-' + s.ask + '-' + s.fig }),
  draw(svg, item, tries) { const C = [180, 128], R = 70;
    if (item.garden) ciGarden(svg, C, R - 8); else ciCircle(svg, C, R, { disc: ['area', 'half', 'rad'].includes(item.ask) || item.fig === 'A', ring: item.fig === 'C' || item.ask === 'perim', seg: item.fig === 'r' || item.ask === 'rad' ? 'r' : item.fig === 'd' || item.ask === 'dia' ? 'd' : null });
    if (item.garden) { const Q = angP(C, 20, R - 8); geoLine(svg, C[0], C[1], Q[0], Q[1], { color: CI.r, w: 4 }); }
    if (item.ask === 'half') { geoLine(svg, C[0] - R, C[1], C[0] + R, C[1], { color: CI.d, w: 3, dash: '7 4' }); }
    ciTop(svg, item.fig, item.v, item.u);
    if (tries >= 3) ciEq(helpG(svg), 180, 228, ciCalcStr(item, true), CI.think, 17);
    return {}; },
  h2: async (item, ctx) => { ciRule(helpG(ctx.svg), 180, 226, labelText('ciRule.' + item.ask + (item.ask === 'perim' && item.fig === 'r' ? 'R' : ''))); await sleep(FAST ? 10 : 250); },
  show: async (item, ctx) => { if (ctx && ctx.svg) { ciClearHelp(ctx.svg); ciEq(helpG(ctx.svg), 180, 228, ciCalcStr(item, false), CI.ok, 17); } },
  sayQ: item => S(ciLine(item.v, item.fig === 'A' ? item.u + '2' : item.u), { append: true }),   /* السؤال ينتهي باسم المعطى («نصف قطرها:»)، فتُقال قيمته بعده */
  pick: item => { const u = ciUnitOf(item.ask, item.u); return choosePick(shuffle(item.ch.map(([v]) => [String(ciR(v)), ciTxt(v, u), '<i></i>', ciLine(v, u)])), String(item.want)); },
  errOf: (it, k) => { const hit = it.ch.find(([v]) => String(ciR(v)) === k); return (hit && hit[1]) || 'ciOff'; } });
/* القيمة المختارة نصٌّ؛ والحكم بالنصّ نفسه */
ITEM.circCalc.judge = (item, k) => k === String(item.want) ? { ok: true } : { ok: false, err: (item.ch.find(([v]) => String(ciR(v)) === k) || [])[1] || 'ciOff' };

/* ================= ② «ساعي الخيط»: يُلفّ الخيط حول العلبة ثم يُفرد على المسطرة (C306) =================
   d القطر (سم)؛ ask perim: كم طول الخيط؟ (يتوقّع الطفل ثم يُفرد الخيط فيُقاس) | ratio: len طول الخيط المقيس، كم ناتج المحيط ÷ القطر؟ */
async function ciUnroll(svg, C, R, len, o = {}) { const y = o.y || 186, x0 = 36, k = o.k || Math.min(11, 290 / len),   /* المسطرة داخل الإطار */ g = el('g', { 'pointer-events': 'none' }, svg), rul = rulerAt(g, { x: x0, y: y + 6, pxcm: k, from: 0, to: Math.ceil(len), mm: false });
  for (const [v, t] of Object.entries(rul.labels)) if (+v % (k < 16 ? 5 : 1)) t.remove();   /* أرقام كل خمسة على المسطرة الضيّقة، غربيةً كسائر المساطر (D279 (2)؛ المراجع B لبوابة S3-U6/U7، 9) */ const p = el('path', { d: '', fill: 'none', stroke: CI.str, 'stroke-width': 5, 'stroke-linecap': 'round' }, g), N = FAST ? 3 : 24;
  for (let i = 1; i <= N; i++) { const t = i / N, a = 360 * (1 - t), ring = a > 1 ? arcPath(C, R, 270, 270 + a) : '', L = len * k * t; p.setAttribute('d', `${ring ? ring + ' ' : ''}M${x0} ${y} H${x0 + L}`); if (i < N) await sleep(FAST ? 5 : 45); }
  p.setAttribute('d', `M${x0} ${y} H${x0 + len * k}`); el('circle', { cx: x0 + len * k, cy: y, r: 5, fill: CI.str }, g); labFit(htLab(g, [x0 + len * k, y - 18], ciTxt(len, 'cm'), CI.str, 15)); SFX.tick(); return g; }
async function ciStringOut(item, r) { if (item.ask === 'ratio' || !r || !r.ctx || !r.ctx.svg || !r.ctx.svg.isConnected || r.ctx.out) return; r.ctx.out = 1; const svg = r.ctx.svg;
  svg.querySelectorAll('circle[stroke="' + CI.str + '"]').forEach(n => n.remove()); await ciUnroll(svg, r.ctx.C, r.ctx.R + 4, Math.round(31.4 * item.d) / 10, {}); }   /* بمنزلة واحدة */
ITEM.circString = {
  make(spec) { ciChk(spec, 'circString'); return { ...spec, want: ciR(spec.ch[0][0]), tag: 'circ-string-' + (spec.ask || 'perim') }; },
  async ask(item, mode, tries) { const svg = m3Stage(262), C = [180, 112], R = Math.min(64, item.d * 7); el('circle', { cx: C[0], cy: C[1], r: R, fill: CI.can, stroke: CI.canEdge, 'stroke-width': 3, 'pointer-events': 'none' }, svg);
    el('circle', { cx: C[0], cy: C[1], r: R - 7, fill: 'none', stroke: CI.canEdge, 'stroke-width': 1.5, opacity: .6, 'pointer-events': 'none' }, svg); geoLine(svg, C[0] - R, C[1], C[0] + R, C[1], { color: CI.d, w: 3.4 });
    htLab(svg, [C[0], C[1] - 14], ciTxt(item.d, 'cm'), CI.d, 15);
    if (item.ask === 'ratio') { await ciUnroll(svg, C, R + 4, item.len, { k: Math.min(10, 290 / item.len) }); }
    else el('circle', { cx: C[0], cy: C[1], r: R + 4, fill: 'none', stroke: CI.str, 'stroke-width': 4, 'pointer-events': 'none' }, svg);
    if (tries >= 3) { const m = helpG(svg); if (item.ask === 'ratio') ciEq(m, 180, 36, `${item.len} ÷ ${item.d} = ؟`, CI.think, 17); else ciEq(m, 180, 36, `3.14 × ${item.d} = ؟`, CI.think, 17); }
    await S(tries >= 3 ? 'gen.ci.together.' + (item.ask === 'ratio' ? 'ratio' : 'string') : item.q || 'gen.ci.q.' + (item.ask === 'ratio' ? 'ratio' : 'string'), { noGap: true }); await S(ciLine(item.d, 'cm'), { append: true });
    const u = item.ask === 'ratio' ? 'n' : 'cm', k = await choosePick(shuffle(item.ch.map(([v]) => [String(ciR(v)), ciTxt(v, u), '<i></i>', ciLine(v, u)])), String(item.want));
    return { ans: k, ctx: { svg, C, R } }; },
  judge(item, k) { return k === String(item.want) ? { ok: true } : { ok: false, err: (item.ch.find(([v]) => String(ciR(v)) === k) || [])[1] || 'ciOff' }; },
  /* الخيط يُفرد بعد الحكم لا قبله: القياس يؤكّد الصواب، أو يأتي مع الكشف؛ فلا تُحلّ المحاولة الثانية بالذاكرة (المراجع B لبوابة S3-U6/U7، 8) */
  async onOk(item, r) { SFX.good(); await ciStringOut(item, r); }, onWrong() { SFX.soft(); },
  async hint2(item, r) { if (r && r.ctx && r.ctx.svg) ciRule(helpG(r.ctx.svg), 180, 36, labelText(item.ask === 'ratio' ? 'ciRule.ratio' : 'ciRule.perim')); await S(item.ask === 'ratio' ? 'gen.ci.hint.ratio' : 'gen.ci.hint.string'); }, async together() {},
  async reveal(item, r) { if (r && r.ctx && r.ctx.svg) { ciClearHelp(r.ctx.svg); await ciStringOut(item, r); } if (r && r.ctx && r.ctx.svg) ciEq(helpG(r.ctx.svg), 180, 36, item.ask === 'ratio' ? `${item.len} ÷ ${item.d} ≈ ${item.want}` : `3.14 × ${item.d} = ${item.want}`, CI.ok, 17); await S('gen.ci.reveal.calc', { noGap: true }); await S(ciLine(item.want, item.ask === 'ratio' ? 'n' : 'cm'), { append: true }); },
  praise: () => 'praiseMeasure', twin(item) { return item.twin || null; },
};

/* ================= ③ القرص على الشبكة بين مربعين (C307، استدعاء C205): r؛ المربع حوله (2r × 2r) والمعيّن داخله (2 × r × r) ================= */
function ciGridDisc(svg, r, o = {}) { const n = 2 * r + 2, G = htGrid(svg, n, n, { H: o.H || 196, top: o.top ?? 14 }), C = G.P([r + 1, r + 1]), R = r * G.c;
  const disc = el('circle', { cx: C[0], cy: C[1], r: R, fill: CI.disc, 'fill-opacity': .75, stroke: CI.edge, 'stroke-width': 3, 'pointer-events': 'none' }, svg); el('circle', { cx: C[0], cy: C[1], r: 3, fill: CI.ink, 'pointer-events': 'none' }, svg);
  return { G, C, R, disc }; }
function ciBounds(svg, D, o = {}) { const g = el('g', { 'pointer-events': 'none' }, svg), [cx, cy] = D.C, R = D.R;
  el('rect', { x: cx - R, y: cy - R, width: 2 * R, height: 2 * R, fill: 'none', stroke: CI.d, 'stroke-width': 3, 'stroke-dasharray': '8 5' }, g);
  el('polygon', { points: polyStr([[cx, cy - R], [cx + R, cy], [cx, cy + R], [cx - R, cy]]), fill: 'none', stroke: CI.fence, 'stroke-width': 3, 'stroke-dasharray': '8 5' }, g);
  if (o.labs) { labFit(htLab(g, [cx + R + 18, cy - R + 8], MS(String(4 * o.r * o.r)), CI.d, 15));   /* بجانب ركن المربع لا فوق الإطار (المراجع B) */ htLab(g, [cx, cy + 6], MS(String(2 * o.r * o.r)), CI.fence, 15); } return g; }
ITEM.discGrid = cpItem({ H: 262, tLine: 'gen.ci.together.grid', hint: 'gen.ci.hint.grid', rLine: 'gen.ci.reveal.calc', rSay: it => S(ciLine(it.want, 'n'), { append: true }), praise: 'praiseMeasure',
  make: s => (ciChk(s, 'discGrid'), { want: ciR(s.ch[0][0]), tag: 'disc-grid' }),
  draw(svg, item, tries) { const D = ciGridDisc(svg, item.r, { H: 176, top: 24 }); ciBounds(svg, D, { labs: true, r: item.r }); if (tries >= 3) ciEq(helpG(svg), 180, 226, `3.14 × ${item.r} × ${item.r} = ؟`, CI.think, 16); return { D }; },
  h2: async (item, ctx) => { ciRule(helpG(ctx.svg), 180, 224, labelText('ciRule.area'), CI.think, 15); await sleep(FAST ? 10 : 250); },
  show: async (item, ctx) => { if (ctx && ctx.svg) { ciClearHelp(ctx.svg); ciEq(helpG(ctx.svg), 180, 226, `3.14 × ${item.r} × ${item.r} = ${item.want}`, CI.ok, 16); } },
  pick: item => choosePick(shuffle(item.ch.map(([v]) => [String(ciR(v)), ciTxt(v, 'n'), '<i></i>', ciLine(v, 'n')])), String(item.want)),
  errOf: (it, k) => (it.ch.find(([v]) => String(ciR(v)) === k) || [])[1] || 'ciOff' });
ITEM.discGrid.judge = (item, k) => k === String(item.want) ? { ok: true } : { ok: false, err: (item.ch.find(([v]) => String(ciR(v)) === k) || [])[1] || 'ciOff' };

/* ================= ④ ضاعفنا نصف القطر: كم مرة تتضاعف المساحة؟ (C307 (ج)): r الصغير، k الضعف (2 أو 3) ================= */
ITEM.circScale = cpItem({ H: 250, tLine: 'gen.ci.together.scale', hint: 'gen.ci.hint.scale', rLine: it => 'gen.ci.times.' + it.want, praise: 'praiseThink',
  make: s => ({ want: (s.k || 2) * (s.k || 2), tag: 'circ-scale' }),
  draw(svg, item, tries) { const k = item.k || 2, s = Math.min(18, 88 / (item.r * k)), A = [96, 132], B = [238, 132];   /* الكبيرة داخل الإطار */
    ciCircle(svg, A, item.r * s, { disc: true, seg: 'r', lab: ciTxt(item.r, 'cm') }); ciCircle(svg, B, item.r * k * s, { disc: true, seg: 'r', lab: ciTxt(item.r * k, 'cm') });
    if (tries >= 3) { const m = helpG(svg); el('rect', { x: B[0] - item.r * k * s, y: B[1] - item.r * k * s, width: 2 * item.r * k * s, height: 2 * item.r * k * s, fill: 'none', stroke: CI.think, 'stroke-width': 2.4, 'stroke-dasharray': '6 4' }, m); for (let i = 1; i < k; i++) { const x = B[0] - item.r * k * s + i * 2 * item.r * s, y = B[1] - item.r * k * s + i * 2 * item.r * s; geoLine(m, x, B[1] - item.r * k * s, x, B[1] + item.r * k * s, { color: CI.think, w: 1.6, dash: '4 3' }); geoLine(m, B[0] - item.r * k * s, y, B[0] + item.r * k * s, y, { color: CI.think, w: 1.6, dash: '4 3' }); } }
    return {}; },
  h2: async (item, ctx) => { const k = item.k || 2, s = Math.min(18, 88 / (item.r * k)), B = [238, 132], R = item.r * k * s, m = helpG(ctx.svg); el('rect', { x: B[0] - R, y: B[1] - R, width: 2 * R, height: 2 * R, fill: 'none', stroke: CI.think, 'stroke-width': 2.4, 'stroke-dasharray': '6 4' }, m); geoLine(m, B[0] - R + 2 * item.r * s, B[1] - R, B[0] - R + 2 * item.r * s, B[1] + R, { color: CI.think, w: 1.6, dash: '4 3' }); await sleep(FAST ? 10 : 250); },   /* المربع حول الكبير وخطٌّ واحد بلا عدد: كم مربعاً كمربع الصغير؟ */
  pick: item => { const k = item.k || 2, opts = [k * k, k, k === 2 ? 8 : 2 * k]; return choosePick(shuffle(opts.map(n => [String(n), labelText('ciTimes.' + n), '<i></i>', 'gen.ci.times.' + n])), String(k * k)); },   /* كنصف القطر (k)، وضعفه أو مكعّبه */
  errOf: (it, k) => +k === (it.k || 2) ? 'scaleTwo' : 'scaleOff' });
ITEM.circScale.judge = (item, k) => +k === item.want ? { ok: true } : { ok: false, err: +k === (item.k || 2) ? 'scaleTwo' : 'scaleOff' };

/* ================= صورة بطاقة التعليل (cipic): r أو d، disc، وf حسابٌ بالأعداد ================= */
function ciReasonPic(g, P) { const C = [180, 92], R = 62; if (P.can) { el('circle', { cx: C[0], cy: C[1], r: R, fill: CI.can, stroke: CI.canEdge, 'stroke-width': 3 }, g); el('circle', { cx: C[0], cy: C[1], r: R + 4, fill: 'none', stroke: CI.str, 'stroke-width': 4 }, g); }
  else if (P.pi) ciPi(g, 180, 92, 1.6); else ciCircle(g, C, R, { disc: !!P.disc, seg: P.r ? 'r' : P.d ? 'd' : null, lab: P.r ? ciTxt(P.r, P.u || 'cm') : P.d ? ciTxt(P.d, P.u || 'cm') : null });
  if (P.two) { g.querySelectorAll('circle,line,path,text').forEach(n => n.remove()); [[[262, 100], 34, P.two[0]], [[104, 100], 68, P.two[1]]].forEach(([Q, r, v]) => ciCircle(g, Q, r, { disc: true, seg: 'r', lab: ciTxt(v, P.u || 'cm') })); }   /* دائرتان بنصفي قطريهما (المراجع A لبوابة S3-U10، 24) */
  if (P.compass) cpCompassAt(g, C, angP(C, 20, R));
  if (P.spokes) { for (let i = 0; i < P.spokes; i++) { const q = angP(C, 360 * i / P.spokes + 15, R); geoLine(g, C[0], C[1], q[0], q[1], { color: CI.r, w: 2.4 }); } el('circle', { cx: C[0], cy: C[1], r: 6, fill: CI.ink }, g); }
  if (P.quad) { const s = 26, A = [86, 120], B = [232, 92]; g.querySelectorAll('circle').forEach(n => n.remove()); for (const [Q, r] of [[A, s], [B, 2 * s]]) { el('circle', { cx: Q[0], cy: Q[1], r, fill: CI.disc, stroke: CI.edge, 'stroke-width': 2.6 }, g); el('rect', { x: Q[0] - r, y: Q[1] - r, width: 2 * r, height: 2 * r, fill: 'none', stroke: CI.think, 'stroke-width': 2.2, 'stroke-dasharray': '6 4' }, g); }
    geoLine(g, B[0], B[1] - 2 * s, B[0], B[1] + 2 * s, { color: CI.think, w: 1.6, dash: '4 3' }); geoLine(g, B[0] - 2 * s, B[1], B[0] + 2 * s, B[1], { color: CI.think, w: 1.6, dash: '4 3' }); }
  if (P.f) ciEq(g, 180, 186, P.f, P.bad ? CI.bad : CI.ink, 19); }

/* ================= المشاهد ================= */
const ciSay = async (L, i) => { if (L[i]) await S(L[i]); };
/* د1 الإشعال: دائرة فوضى باليد الحرّة، ثم الفرجار: الحافة منحنية بلا رؤوس، وكل نقاطها على البعد نفسه من المركز */
SCENES.circHook = async c => { const L = c.lines, svg = m3Stage(250), C = [180, 124], R = 84;
  const wob = []; for (let a = 0; a <= 360; a += 30) { const rr = R + (a % 60 ? 9 : -7); wob.push(angP(C, a, rr)); }
  const bad = el('polyline', { points: polyStr(wob), fill: 'none', stroke: CI.bad, 'stroke-width': 3.4, 'stroke-linejoin': 'miter', 'pointer-events': 'none' }, svg); await ciSay(L, 0);
  bad.remove(); const g = el('g', { 'pointer-events': 'none' }, svg); cpCompassAt(g, C, angP(C, 0, R)); await drawCircleAnim(g, C, R, CI.edge); el('circle', { cx: C[0], cy: C[1], r: 4, fill: CI.ink }, g);
  for (const a of [30, 150, 250]) { const Q = angP(C, a, R); geoLine(g, C[0], C[1], Q[0], Q[1], { color: CI.r, w: 2.4, dash: '6 4' }); } SFX.tick(); await ciSay(L, 1); };
/* د1 الاكتشاف: المركز ونصف القطر (نصفا قطر متساويان)، والقطر يمرّ بالمركز، ثم جدول القطر = 2 × نصف القطر */
SCENES.compassShow = async c => { const L = c.lines, svg = m3Stage(250); let g = el('g', { 'pointer-events': 'none' }, svg); const C = [180, 128], R = 3 * 26;
  cpCompassAt(g, C, angP(C, 0, R)); await drawCircleAnim(g, C, R, CI.edge); g.remove(); g = el('g', { 'pointer-events': 'none' }, svg); ciCircle(g, C, R); htLab(g, [C[0] + 34, C[1] + 20], labelText('ciCenter'), CI.ink, 14); await ciSay(L, 0);
  for (const a of [40, 140, 215]) { const Q = angP(C, a, R); geoLine(g, C[0], C[1], Q[0], Q[1], { color: CI.r, w: 3.4 }); htLab(g, [(C[0] + Q[0]) / 2, (C[1] + Q[1]) / 2 - 12], ciTxt(3, 'cm'), CI.r, 13); SFX.tick(); await sleep(FAST ? 2 : 300); } await ciSay(L, 1);
  geoLine(g, C[0] - R, C[1], C[0] + R, C[1], { color: CI.d, w: 4.4 }); htLab(g, [C[0] + 40, C[1] - 12], ciTxt(6, 'cm'), CI.d, 15); SFX.tick(); await ciSay(L, 2);
  g.remove(); g = el('g', { 'pointer-events': 'none' }, svg); const rows = [[2, 4], [3, 6], [4, 8]];
  const hdr = [['cpPart.radius', 262, CI.r], ['cpPart.diameter', 98, CI.d]]; hdr.forEach(([k, x, col]) => { const t = el('text', { x, y: 40, 'text-anchor': 'middle', 'font-size': 16, 'font-weight': 800, fill: col, direction: 'rtl' }, g); t.textContent = labelText(k); });
  for (const [i, [r, d]] of rows.entries()) { const y = 80 + i * 48; el('rect', { x: 30, y: y - 26, width: 300, height: 40, rx: 10, fill: i % 2 ? '#f6eccf' : '#fff', stroke: CI.grid, 'stroke-width': 2 }, g); htLab(g, [262, y - 6], ciTxt(r, 'cm'), CI.r, 16); htLab(g, [98, y - 6], ciTxt(d, 'cm'), CI.d, 16); SFX.tick(); await sleep(FAST ? 2 : 350); }
  ciRule(g, 180, 222, labelText('ciRule.d2r'), CI.ok, 17); await ciSay(L, 3); };
/* د2 الإشعال: «ثلاثة أضعاف القطر بالضبط!»: يُفرد الخيط، وتوضع عليه ثلاثة أقطار فيبقى منه جزء */
SCENES.piHook = async c => { const L = c.lines, svg = m3Stage(250), C = [180, 82], R = 56, d = 6; el('circle', { cx: C[0], cy: C[1], r: R, fill: CI.can, stroke: CI.canEdge, 'stroke-width': 3, 'pointer-events': 'none' }, svg); geoLine(svg, C[0] - R, C[1], C[0] + R, C[1], { color: CI.d, w: 3.4 });
  await ciSay(L, 0); const k = 300 / 20; await ciUnroll(svg, C, R + 4, 18.8, { k, y: 182 });   /* المسطرة تحته داخل الإطار */
  for (let i = 0; i < 3; i++) { geoLine(svg, 26 + i * d * k + 2, 168, 26 + (i + 1) * d * k - 2, 168, { color: CI.d, w: 5 }); badge(svg, 26 + (i + .5) * d * k, 153, i + 1, CI.d); SFX.tick(); await sleep(FAST ? 2 : 350); }
  const m = el('g', { 'pointer-events': 'none' }, svg); el('rect', { x: 26 + 18 * k - 2, y: 172, width: .8 * k + 6, height: 20, fill: 'none', stroke: CI.think, 'stroke-width': 2.4 }, m); await ciSay(L, 1); };
/* د2 الاكتشاف (أ): ثلاث علب، والخيط حول كل منها، والنسبة نحو 3.1 */
SCENES.ciStringShow = async c => { const L = c.lines, svg = m3Stage(250); let g = el('g', { 'pointer-events': 'none' }, svg); const cans = [[4, 12.5], [6, 18.8], [8, 25.1]];   /* أطوال الخيط مقيسة (لا محسوبة): النسبة 3.1 في كل علبة */
  for (const [i, [d, len]] of cans.entries()) { g.remove(); g = el('g', { 'pointer-events': 'none' }, svg); const C = [180, 96], R = d * 7.5; el('circle', { cx: C[0], cy: C[1], r: R, fill: CI.can, stroke: CI.canEdge, 'stroke-width': 3 }, g); geoLine(g, C[0] - R, C[1], C[0] + R, C[1], { color: CI.d, w: 3.4 }); htLab(g, [C[0], C[1] - 14], ciTxt(d, 'cm'), CI.d, 15);
    await ciUnroll(g, C, R + 4, len, { k: 11, y: 180 }); if (i === 0) await ciSay(L, 0); else await sleep(FAST ? 2 : 500); }
  g.remove(); g = el('g', { 'pointer-events': 'none' }, svg); const hdr = [['ciPerim', 290], ['cpPart.diameter', 180], ['ciDiv', 70]];
  hdr.forEach(([k, x]) => { const t = el('text', { x, y: 36, 'text-anchor': 'middle', 'font-size': 15, 'font-weight': 800, fill: CI.ink, direction: 'rtl' }, g); t.textContent = labelText(k); });
  for (const [i, [d, len]] of cans.entries()) { const y = 76 + i * 46; el('rect', { x: 20, y: y - 24, width: 320, height: 38, rx: 10, fill: i % 2 ? '#f6eccf' : '#fff', stroke: CI.grid, 'stroke-width': 2 }, g); htLab(g, [290, y - 6], ciTxt(len, 'cm'), CI.str, 15); htLab(g, [180, y - 6], ciTxt(d, 'cm'), CI.d, 15); const t = el('text', { x: 70, y: y, 'text-anchor': 'middle', 'font-size': 15, 'font-weight': 800, fill: CI.ok, 'pointer-events': 'none' }, g); mfSet(t, `≈ ${ciR(Math.round(len / d * 10) / 10)}`); SFX.tick(); await sleep(FAST ? 2 : 400); }
  await ciSay(L, 1); };
/* د2 الاكتشاف (ب) و(ج): π («باي») عددٌ ثابت لا ينتهي و3.14 تقريبه؛ المحيط = 3.14 × القطر، ثم بنصف القطر 2 × 3.14 × 5 = 31.4 */
SCENES.piShow = async c => { const L = c.lines, svg = m3Stage(250); let g = el('g', { 'pointer-events': 'none' }, svg); ciPi(g, 180, 80, 1.8);
  const t = el('text', { x: 180, y: 150, 'text-anchor': 'middle', 'font-size': 20, 'font-weight': 800, fill: CI.think, 'pointer-events': 'none' }, g); mfSet(t, '3.14159265…'); await ciSay(L, 0);
  ciRule(g, 180, 200, labelText('ciRule.perim'), CI.ok, 17); await ciSay(L, 1);
  g.remove(); g = el('g', { 'pointer-events': 'none' }, svg); ciCircle(g, [180, 96], 66, { seg: 'r', lab: ciTxt(5, 'cm'), ring: true }); ciRule(g, 180, 188, labelText('ciRule.perimR'), CI.think, 16); await sleep(FAST ? 2 : 300);
  ciEq(g, 180, 224, '2 × 3.14 × 5 = 31.4', CI.ok, 18); SFX.tick(); await ciSay(L, 2); for (const l of L.slice(3)) await S(l); };
/* حكاية أرخميدس: مضلعات داخل الدائرة يزيد عدد أضلاعها فيقترب محيطها من محيط الدائرة */
SCENES.archShow = async c => { const L = c.lines, svg = m3Stage(250), C = [180, 122], R = 92; el('circle', { cx: C[0], cy: C[1], r: R, fill: '#fffdf6', stroke: CI.edge, 'stroke-width': 3, 'pointer-events': 'none' }, svg);
  let g = null; for (const [i, n] of [6, 12, 24].entries()) { if (g) g.remove(); g = el('g', { 'pointer-events': 'none' }, svg); const P = []; for (let k = 0; k < n; k++) P.push(angP(C, 90 + 360 * k / n, R)); el('polygon', { points: polyStr(P), fill: 'rgba(142,107,191,.12)', stroke: CI.think, 'stroke-width': 2.4 }, g); const Ro = R / Math.cos(Math.PI / n), O = []; for (let k = 0; k < n; k++) O.push(angP(C, 90 + 360 * k / n, Ro)); el('polygon', { points: polyStr(O), fill: 'none', stroke: CI.d, 'stroke-width': 2.4 }, g); SFX.tick(); await ciSay(L, i); }
  for (const l of L.slice(3)) await S(l); };
/* د3 الإشعال: «المساحة = المحيط × نصف القطر!»: 31.4 × 5 = 157، والقرص على الشبكة أصغر من المربع حوله (100) */
SCENES.areaHook = async c => { const L = c.lines, svg = m3Stage(262), D = ciGridDisc(svg, 5, { H: 186, top: 34 }); const t = ciEq(svg, 180, 24, '31.4 × 5 = 157', CI.bad, 18); await ciSay(L, 0); t.remove();
  const b = ciBounds(svg, D); b.querySelector('polygon').remove(); htLab(svg, [D.C[0] + D.R + 2, D.C[1] - D.R - 14], MS('100'), CI.d, 15); SFX.tick(); await ciSay(L, 1); };
/* د3 الاكتشاف (أ): القرص ونصف قطره 2 على الشبكة: 4 مربعات كاملة و8 شبه كاملة وأربع قطع صغيرة تكمل نحو نصف مربع، فنحو 12.5 */
let DSC_N = 0;
SCENES.discShow = async c => { const L = c.lines, svg = m3Stage(262), r = 2, D = ciGridDisc(svg, r, { H: 190, top: 18 }), G = D.G, cid = 'dsc' + (++DSC_N), cp = el('clipPath', { id: cid }, el('defs', {}, svg)), cnt = el('g', { 'pointer-events': 'none', 'clip-path': `url(#${cid})` }, svg); el('circle', { cx: D.C[0], cy: D.C[1], r: D.R }, cp); await ciSay(L, 0);
  const sq = (i, j, col) => { const [x, y] = G.P([i, j + 1]); el('rect', { x: x + 1, y: y + 1, width: G.c - 2, height: G.c - 2, fill: col, opacity: .75 }, cnt); };
  const kind = (i, j) => { const cx = i + .5 - (r + 1), cy = j + .5 - (r + 1), far = Math.hypot(Math.abs(cx) + .5, Math.abs(cy) + .5), near = Math.hypot(Math.max(0, Math.abs(cx) - .5), Math.max(0, Math.abs(cy) - .5)); return far <= r ? 'full' : near >= r ? null : Math.abs(cx) > 1 && Math.abs(cy) > 1 ? 'bit' : 'most'; };
  for (const [k, col] of [['full', '#3f8f5a'], ['most', '#8fcf7a'], ['bit', '#e9dcb8']]) { for (let i = 0; i < 2 * r + 2; i++) for (let j = 0; j < 2 * r + 2; j++) if (kind(i, j) === k) sq(i, j, col); SFX.tick(); await ciSay(L, k === 'full' ? 1 : k === 'most' ? 2 : 3); }
  ciEq(svg, 180, 238, '3.14 × 2 × 2 = 12.56', CI.ok, 18); await ciSay(L, 4); };
/* د3 الاكتشاف (ب): نصف القطر 3: المربع حوله 36، والمعيّن داخله 18، والقانون 28.26 بينهما */
SCENES.boundShow = async c => { const L = c.lines, svg = m3Stage(262), D = ciGridDisc(svg, 3, { H: 190, top: 18 }); await ciSay(L, 0); ciBounds(svg, D, { labs: true, r: 3 }); SFX.tick(); await ciSay(L, 1);
  ciEq(svg, 180, 238, '3.14 × 3 × 3 = 28.26', CI.ok, 18); await ciSay(L, 2); };
/* د4: نصف القطر 2 ثم 4: المربع حول الكبير يسع أربعة مربعات كالصغير، والمساحة 12.56 ثم 50.24 */
SCENES.ciDoubleShow = async c => { const L = c.lines, svg = m3Stage(250), A = [90, 120], B = [250, 120], s = 22;
  ciCircle(svg, A, 2 * s, { disc: true, seg: 'r', lab: ciTxt(2, 'cm') }); ciEq(svg, A[0], 206, '12.56', CI.ok, 17); await ciSay(L, 0);
  ciCircle(svg, B, 4 * s, { disc: true, seg: 'r', lab: ciTxt(4, 'cm') }); ciEq(svg, B[0], 226, '50.24', CI.ok, 17); await ciSay(L, 1);
  const m = el('g', { 'pointer-events': 'none' }, svg); el('rect', { x: B[0] - 4 * s, y: B[1] - 4 * s, width: 8 * s, height: 8 * s, fill: 'none', stroke: CI.think, 'stroke-width': 2.4, 'stroke-dasharray': '6 4' }, m); geoLine(m, B[0], B[1] - 4 * s, B[0], B[1] + 4 * s, { color: CI.think, w: 1.6, dash: '4 3' }); geoLine(m, B[0] - 4 * s, B[1], B[0] + 4 * s, B[1], { color: CI.think, w: 1.6, dash: '4 3' });
  el('rect', { x: A[0] - 2 * s, y: A[1] - 2 * s, width: 4 * s, height: 4 * s, fill: 'none', stroke: CI.think, 'stroke-width': 2.4, 'stroke-dasharray': '6 4' }, m); SFX.tick(); await ciSay(L, 2);
  ciEq(svg, 180, 30, '12.56 × 4 = 50.24', CI.ok, 18); await ciSay(L, 3); for (const l of L.slice(4)) await S(l); };
/* د4 المشروع: حديقة نصف قطرها 5 م على الشبكة (كل مربع متر): السياج 31.4 م، والعشب 78.5 م²، ونصفاه 39.25 م²، ثم الجدول */
SCENES.gardenShow = async c => { const L = c.lines, svg = m3Stage(262);
  if (c.table) { const rows = [['ciT.fence', '2 × 3.14 × 5', `31.4 ${labelText('lenM')}`], ['ciT.grass', '3.14 × 5 × 5', `78.5 ${labelText('arM2')}`], ['ciT.half', '78.5 ÷ 2', `39.25 ${labelText('arM2')}`]], g = el('g', { 'pointer-events': 'none' }, svg);
    rows.forEach(([k, f, v], i) => { const y = 40 + i * 64; el('rect', { x: 22, y, width: 316, height: 54, rx: 12, fill: i % 2 ? '#f6eccf' : '#fff', stroke: CI.grid, 'stroke-width': 2 }, g); const a = el('text', { x: 330, y: y + 33, 'text-anchor': 'start', 'font-size': 16, 'font-weight': 800, fill: CI.ink, direction: 'rtl' }, g); a.textContent = labelText(k);
      ciEq(g, 180, y + 33, f, CI.think, 15); const b = el('text', { x: 30, y: y + 33, 'text-anchor': 'end', 'font-size': 16, 'font-weight': 800, fill: CI.ok, direction: 'rtl' }, g); b.textContent = MS(v); });
    for (const l of L) await S(l); return; }
  const G = htGrid(svg, 12, 12, { H: 220, top: 14 }), C = G.P([6, 6]), R = 5 * G.c, g = el('g', { 'pointer-events': 'none' }, svg); cpCompassAt(g, C, angP(C, 0, R)); await drawCircleAnim(g, C, R, CI.edge); g.remove();
  el('circle', { cx: C[0], cy: C[1], r: R, fill: '#bfe3a8', 'fill-opacity': .7, stroke: CI.edge, 'stroke-width': 3, 'pointer-events': 'none' }, svg); el('circle', { cx: C[0], cy: C[1], r: 3.5, fill: CI.ink }, svg);
  const Q = angP(C, 0, R); geoLine(svg, C[0], C[1], Q[0], Q[1], { color: CI.r, w: 4 }); htLab(svg, [(C[0] + Q[0]) / 2, C[1] - 12], ciTxt(5, 'm'), CI.r, 14); await ciSay(L, 0);
  if (c.setup) return;   /* المشروع: الحديقة وحدها قبل بنود الطفل، والحساب في الجدول بعدها (المراجع A لبوابة S3-U6/U7، 9) */
  el('circle', { cx: C[0], cy: C[1], r: R + 4, fill: 'none', stroke: CI.fence, 'stroke-width': 5, 'stroke-dasharray': '3 4', 'pointer-events': 'none' }, svg); ciEq(svg, 180, 252, '2 × 3.14 × 5 = 31.4', CI.fence, 16); SFX.tick(); await ciSay(L, 1);
  svg.lastChild.remove(); ciEq(svg, 180, 252, '3.14 × 5 × 5 = 78.5', CI.ok, 16); SFX.tick(); await ciSay(L, 2);
  svg.lastChild.remove(); geoLine(svg, C[0] - R, C[1], C[0] + R, C[1], { color: CI.d, w: 3.4, dash: '8 5' }); ciEq(svg, 180, 252, '78.5 ÷ 2 = 39.25', CI.ok, 16); SFX.tick(); await ciSay(L, 3); };
WRAP_ART.circArt = svg => { const C = [180, 112]; ciGarden(svg, C, 70); ciPi(svg, 300, 60, .9); };
