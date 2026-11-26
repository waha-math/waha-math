/* =====================================================================
   S3-U3 «الارتفاع والمساحات (1)» (المرحلة 3، نوفمبر 2026)
   د1 أقصر مسافة من نقطة إلى مستقيم (C126) · د2 ارتفاع المثلث (C315) · د3 مساحة متوازي الأضلاع (C304) · د4 مساحة المثلث (C303)
   د5 القاعدة أو الارتفاع المجهول (C335) ومشروع «الأرض ذات القطر»
   على ورق المربعات: نقطة الشبكة [x، y] وy إلى الأعلى، وكل مربع سنتيمتر (أو متر في المشروع)
   ===================================================================== */
const HT = { grid: '#d9e4ea', ink: '#33454c', fill: '#eef4f8', h: '#e07b39', side: '#3d7cc0', mid: '#8e6bbf', ok: '#2f9d6b', bad: '#c8392d', ext: '#9fb4c0' };
/* الشبكة: cols × rows مربعاً، وأسفلها y0؛ تُوسَّط في الإطار */
function htGrid(parent, cols, rows, o = {}) { const c = o.c || Math.min(26, 300 / cols, (o.H || 170) / rows), x0 = 180 - cols * c / 2, y0 = (o.top ?? 24) + rows * c, g = el('g', { 'pointer-events': 'none', 'data-grid': 1 }, parent);
  for (let i = 0; i <= cols; i++) geoLine(g, x0 + i * c, y0 - rows * c, x0 + i * c, y0, { color: HT.grid, w: 1 }); for (let j = 0; j <= rows; j++) geoLine(g, x0, y0 - j * c, x0 + cols * c, y0 - j * c, { color: HT.grid, w: 1 });
  return { g, c, x0, y0, cols, rows, P: p => [x0 + p[0] * c, y0 - p[1] * c] }; }
const htLab = (parent, p, txt, col = HT.ink, fs = 15) => { const t = el('text', { x: p[0], y: p[1] + 5, 'text-anchor': 'middle', 'font-size': fs, 'font-weight': 800, fill: col, stroke: '#fff', 'stroke-width': 4, 'paint-order': 'stroke', direction: 'rtl', 'pointer-events': 'none' }, parent); t.textContent = txt; return t; };
const htCm = (v, u) => `${v} ${U_(u || 'cm')}`;
/* علامة الزاوية القائمة عند F بين الاتجاهين a وb (بالدرجات) */
function htRight(parent, F, a, b, s = 9, col = HT.ink) { const p1 = angP(F, a, s), p2 = angP(F, b, s), p3 = [p1[0] + p2[0] - F[0], p1[1] + p2[1] - F[1]]; return el('path', { d: `M${p1[0]} ${p1[1]} L${p3[0]} ${p3[1]} L${p2[0]} ${p2[1]}`, fill: 'none', stroke: col, 'stroke-width': 2, 'pointer-events': 'none' }, parent); }
/* مستقيم أفقي على الصف y من a إلى b، وامتداده متقطّعاً إلى حدّي الشبكة */
function htLine(parent, G, y, a, b, o = {}) { const L = G.P([a, y]), R = G.P([b, y]); if (o.ext !== false) geoLine(parent, G.x0, L[1], G.x0 + G.cols * G.c, L[1], { color: HT.ext, w: 2, dash: '6 5' }); geoLine(parent, L[0], L[1], R[0], R[1], { color: o.color || HT.ink, w: o.w || 4 }); }
/* اختيار عددي فيه أنصاف: الكلمة «سبعة عشر ونصف» (gen.half.N) والعدد بأرقام القياس */
const halfw = n => Number.isInteger(n) ? numw(n) : 'gen.half.' + Math.floor(n);
function halfMix(want, cands) { const c = [...new Set(cands.filter(v => v > 0 && v <= 100 && v !== want && (Number.isInteger(v) || Number.isInteger(v * 2))))], pick = shuffle(c).slice(0, 2);
  for (const d of [1, 2, 4, 10]) for (const v of [want + d, want - d]) if (pick.length < 2 && v > 0 && v <= 100 && !pick.includes(v)) pick.push(v); return shuffle([want, ...pick]); }
const htNumItem = { ...numItem, async askNum(item) { const np = numberPick(shuffle(item.nums), item.want, { west: true, word: halfw }); return np; } };

/* ================= ① «مضخة الماء» و«رافعة البناء» (C126، C315؛ اللعبتان): تُحرَّك القدم على مستقيم أفقي حتى يصير الأنبوب أو الخيط عمودياً ================= */
/* spec: mode pump | crane، pt [x، y] النقطة (البئر أو رأس المثلث)، y صف المستقيم، seg [a، b] القطعة المرسومة، at بداية القدم، tri [A، B] قاعدة المثلث في الرافعة */
/* المستوى الثاني: خيط الشاقول يتدلّى من النقطة نحو المستقيم (نصف الطريق)، فيُرى اتجاه العمود ولا تُعلَّم القدم (D240؛ المراجع B لبوابة S3-U2/U3، 3) */
function htPlumb(svg, G, item) { const m = helpG(svg), Q = G.P(item.pt), F = G.P([item.pt[0], item.y ?? 1]), e = [Q[0], Q[1] + (F[1] - Q[1]) * .55];
  geoLine(m, Q[0], Q[1] + 8, e[0], e[1], { color: THINK_INK, w: 2.6, dash: '6 5' }); el('path', { d: `M${e[0] - 7} ${e[1] - 2} L${e[0] + 7} ${e[1] - 2} L${e[0]} ${e[1] + 10} Z`, fill: THINK_INK }, m); return m; }
ITEM.footSlide = {
  make(spec) { return { ...spec, want: spec.pt[0], tag: 'foot-' + spec.mode }; },
  async ask(item, mode, tries) { const svg = m3Stage(250), G = htGrid(svg, 12, 7, { H: 168 }), y = item.y ?? 1, seg = item.seg || [1, 11]; let at = item.at ?? seg[0], live = null;
    htLine(svg, G, y, seg[0], seg[1]); if (item.mode === 'crane') { const [A, B] = item.tri, C = G.P(item.pt); el('polygon', { points: polyStr([G.P([A, y]), G.P([B, y]), C]), fill: HT.fill, stroke: HT.ink, 'stroke-width': 3, 'stroke-linejoin': 'round' }, svg); }
    else { const w = G.P(item.pt); el('circle', { cx: w[0], cy: w[1], r: 9, fill: '#5aa0c8', stroke: '#fff', 'stroke-width': 2 }, svg); htLab(svg, [w[0], w[1] - 18], labelText('htWell'), HT.side, 13); }
    const draw = () => { if (live) live.remove(); live = el('g', { 'pointer-events': 'none' }, svg); const F = G.P([at, y]), Q = G.P(item.pt); geoLine(live, Q[0], Q[1], F[0], F[1], { color: item.mode === 'pump' ? '#3d7cc0' : HT.h, w: 3, dash: item.mode === 'crane' ? '5 4' : null });
      if (item.mode === 'pump') { el('rect', { x: F[0] - 9, y: F[1] - 9, width: 18, height: 18, rx: 4, fill: '#e0a32e', stroke: HT.ink, 'stroke-width': 2 }, live); const d = Math.hypot(at - item.pt[0], y - item.pt[1]); htLab(live, [(F[0] + Q[0]) / 2 + 22, (F[1] + Q[1]) / 2], htCm(decFmt(Math.round(d * 10) / 10, 1)), '#3d7cc0', 14); }
      else { el('circle', { cx: F[0], cy: F[1], r: 6, fill: HT.h, stroke: '#fff', 'stroke-width': 2 }, live); const pc = el('path', { d: `M${F[0]} ${F[1] - 22} L${F[0]} ${F[1]} L${F[0] + 22} ${F[1]}`, fill: 'none', stroke: '#c9a54a', 'stroke-width': 2.4 }, live); } };   /* ركن الورقة عند القدم: يُرى أهو على الخيط */
    if (tries >= 2) htPlumb(svg, G, item); draw(); if (tries >= 3) { at = item.want + (at < item.want ? -1 : 1); draw(); await S('gen.ht.together.' + item.mode); } else await S(item.q || 'gen.ht.q.' + item.mode);
    const St = dqSteps(['htLeft', 'htRight'], d => { const n = Math.max(0, Math.min(12, at + d)); if (n === at) return false; at = n; draw(); return true; });
    /*T*/window.__htAt = () => at;/*/T*/
    AUTO({ kind: 'htFoot', ok: () => { at = item.want; draw(); rulDoneBtn().click(); }, wrong: () => { at = item.want + (item.want < 11 ? 1 : -1); draw(); rulDoneBtn().click(); } });
    await rulDone(() => St.off()); return { ans: at, ctx: { svg, G, set: v => { at = v; draw(); } } }; },
  judge(item, k) { return k === item.want ? { ok: true } : { ok: false, err: item.mode === 'pump' ? 'distSlant' : 'heightSlant' }; },
  onOk() { SFX.good(); }, onWrong() { SFX.soft(); },
  async hint2(item, r) { if (r && r.ctx && r.ctx.G) htPlumb(r.ctx.svg, r.ctx.G, item); await S('gen.ht.hint.' + item.mode); }, async together() {},
  async reveal(item, r) { if (r && r.ctx && r.ctx.set) { r.ctx.set(item.want); const F = r.ctx.G.P([item.want, item.y ?? 1]); htRight(r.ctx.svg, F, -90, 0, 11, HT.ok); } await S('gen.ht.reveal.' + item.mode); },
  praise: () => 'praiseMeasure', twin(item) { return item.twin || null; },
};

/* ================= ② أيّ القطع هي المسافة؟ أيّها الارتفاع؟ (C126، C315): ثلاث قطع بحروفها، واحدة عمودية ================= */
/* spec: kind dist | height؛ pt النقطة (أو الرأس)، y صف المستقيم (أو القاعدة)، seg قطعة المستقيم المرسومة (أو القاعدة)، others: موضعا القدمين الأخريين (أو side/mid في الارتفاع) */
ITEM.perpPick = {
  make(spec) { const keys = shuffle(['a', 'b', 'j']), feet = [spec.pt[0], ...spec.others]; return { ...spec, keys, feet, want: keys[0], tag: 'perp-' + spec.kind }; },
  async ask(item, mode, tries) { const svg0 = m3Stage(250), svg = item.rot ? el('g', { transform: `rotate(${item.rot} 180 116)` }, svg0) : svg0, G = htGrid(svg, 12, 7, { H: 168 }), y = item.y ?? 1, seg = item.seg;   /* rot: مستقيمٌ أو قاعدةٌ مائلة (الوضع غير النمطي، المراجع A لبوابة S3-U2/U3، 11) */
    if (item.rot) G.g.setAttribute('opacity', 0);   /* المائل بلا شبكة: الشبكة المدوَّرة تشوّش */
    htLine(svg, G, y, seg[0], seg[1], { ext: item.ext !== false, color: item.kind === 'height' ? '#3f9e93' : HT.ink }); const Q = G.P(item.pt);
    if (item.kind === 'height') { el('polygon', { points: polyStr([G.P([seg[0], y]), G.P([seg[1], y]), Q]), fill: HT.fill, stroke: HT.ink, 'stroke-width': 3, 'stroke-linejoin': 'round' }, svg); const b0 = G.P([seg[0], y]), b1 = G.P([seg[1], y]); geoLine(svg, b0[0], b0[1], b1[0], b1[1], { color: '#3f9e93', w: 6 }); }   /* القاعدة ملوّنة بلونٍ لا تحمله القطع */
    else el('circle', { cx: Q[0], cy: Q[1], r: 6, fill: HT.ink }, svg);
    const cols = [HT.h, HT.side, HT.mid]; item.feet.forEach((fx, i) => { const F = G.P([fx, y]); geoLine(svg, Q[0], Q[1], F[0], F[1], { color: cols[i], w: 3 }); let L = [F[0], F[1] + 20];
      if (item.rot) { const r = item.rot * Math.PI / 180, W = [180 + (L[0] - 180) * Math.cos(r) - (L[1] - 116) * Math.sin(r), 116 + (L[0] - 180) * Math.sin(r) + (L[1] - 116) * Math.cos(r)], C = [Math.max(36, Math.min(324, W[0])), Math.max(34, Math.min(212, W[1]))];   /* موضع الحرف بعد التدوير داخل الإطار، ثم يُعاد إلى إحداثيات المجموعة (المراجع B لبوابة S3-U2/U3، 12) */
        L = [180 + (C[0] - 180) * Math.cos(-r) - (C[1] - 116) * Math.sin(-r), 116 + (C[0] - 180) * Math.sin(-r) + (C[1] - 116) * Math.cos(-r)]; } else L[0] = Math.max(34, Math.min(326, L[0]));
      const t = htLab(svg, L, LTR[item.keys[i]], cols[i], 17); if (item.rot) t.setAttribute('transform', `rotate(${-item.rot} ${L[0]} ${L[1] - 5})`); });   /* الحرف تحت قدم قطعته، فلا يتراكب حرفان (8) */
    if (tries >= 3) { const F = G.P([item.pt[0], y]); htRight(helpG(svg), F, -90, 0, 11, THINK_INK); await S('gen.ht.together.pick'); } else await S(item.q || (item.rot && item.kind === 'height' ? 'gen.ht.q.heightRot' : 'gen.ht.q.' + item.kind));
    const k = await choosePick(['a', 'b', 'j'].map(x => [x, LTR[x], '<i></i>', 'gen.ltr.' + x]), item.want); return { ans: k, ctx: { svg, G } }; },
  judge(item, k) { if (k === item.want) return { ok: true }; const i = item.keys.indexOf(k); return { ok: false, err: item.kind === 'height' ? (item.roles && item.roles[i - 1] === 'mid' ? 'heightMid' : 'heightSide') : 'distSlant' }; },
  onOk() { SFX.good(); }, onWrong() { SFX.soft(); },
  async hint2(item, r) { if (r && r.ctx && r.ctx.G) { const m = helpG(r.ctx.svg), y = item.y ?? 1; for (const fx of item.feet) { const F = r.ctx.G.P([fx, y]); el('path', { d: `M${F[0]} ${F[1] - 20} L${F[0]} ${F[1]} L${F[0] + 20} ${F[1]}`, fill: 'none', stroke: '#c9a54a', 'stroke-width': 2.4 }, m); } }   /* ركن الورقة عند كل قدم: أيّها على القطعة؟ (10) */
    await S(item.kind === 'height' ? 'gen.ht.hint.heightPick' : 'gen.ht.hint.dist'); }, async together() {},
  async reveal(item, r) { if (r && r.ctx && r.ctx.G) htRight(r.ctx.svg, r.ctx.G.P([item.pt[0], item.y ?? 1]), -90, 0, 11, HT.ok); await S('gen.ht.reveal.pick'); },
  praise: () => 'praiseThink', twin(item) { return item.twin || null; },
};

/* ---------- الأشكال على الشبكة: متوازي أضلاع وقاعدته على الصف 1 من x0، ورأسه العلوي مزاح off؛ ومثلث قاعدته b ورأسه فوق النقطة foot ---------- */
function htPara(parent, G, b, h, off, o = {}) { const x = o.x ?? Math.max(1, Math.round((G.cols - b - Math.max(0, off)) / 2) - Math.min(0, off)), y = 1, A = G.P([x, y]), B = G.P([x + b, y]), C = G.P([x + b + off, y + h]), D = G.P([x + off, y + h]);
  el('polygon', { points: polyStr([A, B, C, D]), fill: o.fill || HT.fill, stroke: HT.ink, 'stroke-width': 3, 'stroke-linejoin': 'round' }, parent); return { A, B, C, D, x, y }; }
function htTri(parent, G, b, h, foot, o = {}) { const lo = Math.min(0, foot), hi = Math.max(b, foot), x = o.x ?? Math.max(1, Math.round((G.cols - (hi - lo)) / 2) - lo), y = 1, A = G.P([x, y]), B = G.P([x + b, y]), C = G.P([x + foot, y + h]);
  el('polygon', { points: polyStr([A, B, C]), fill: o.fill || HT.fill, stroke: HT.ink, 'stroke-width': 3, 'stroke-linejoin': 'round' }, parent); return { A, B, C, x, y, F: G.P([x + foot, y]) }; }
/* الارتفاع مرسوماً: متقطّع من الرأس إلى القدم، وامتداد القاعدة إن وقعت القدم خارجها، وعلامة القائمة، والطول */
function htHeight(parent, G, T, hLab, o = {}) { const g = el('g', { 'pointer-events': 'none' }, parent), C = o.top || T.C, F = o.foot || T.F;
  if (o.extend) geoLine(g, Math.min(T.A[0], F[0]) - 10, T.A[1], Math.max(T.B[0], F[0]) + 10, T.A[1], { color: HT.ext, w: 2, dash: '6 5' });
  geoLine(g, C[0], C[1], F[0], F[1], { color: HT.h, w: 3, dash: '6 4' }); htRight(g, F, -90, F[0] > (T.A[0] + T.B[0]) / 2 ? 180 : 0, 9, HT.h); if (hLab != null) { let dx = F[0] < Math.min(T.A[0], T.B[0]) - 2 ? -20 : F[0] > Math.max(T.A[0], T.B[0]) + 2 ? 20 : F[0] < (T.A[0] + T.B[0]) / 2 ? 20 : -20; if (F[0] + dx < 46 || F[0] + dx > 314) dx = -dx;   /* لا يخرج الطول عن الإطار (المراجع B لبوابة S3-U2/U3، 12) */
    htLab(g, [F[0] + dx, (C[1] + F[1]) / 2], hLab, HT.h, 15); } return g; }   /* الطول في جهة الشكل من الخط فلا يلاصق الضلع المائل، وخارجه حين تقع القدم خارج القاعدة */

/* ================= ③ مساحة متوازي الأضلاع أو محيطه (C304): b القاعدة، h الارتفاع، s الضلع المائل (يُحسب منه الإزاحة)، ask area | perim | heightOther ================= */
ITEM.paraArea = { ...htNumItem,
  make(spec) { const off = Math.sqrt(Math.max(0, spec.s * spec.s - spec.h * spec.h)), A = spec.b * spec.h, P = 2 * (spec.b + spec.s);
    /*T*/if (TESTHOOK && (spec.s < spec.h || A > 100 || P > 100)) testBug('paraArea: أبعاد غير صالحة');/*/T*/
    const want = spec.ask === 'perim' ? P : A, errs = spec.ask === 'perim' ? [A, spec.b + spec.s, 2 * (spec.b + spec.h)] : [spec.b * spec.s, P, A / 2];
    return { ...spec, off, want, nums: halfMix(want, errs), tag: 'para-' + spec.ask }; },
  async ask(item, mode, tries) { const svg = m3Stage(250), G = htGrid(svg, Math.max(12, Math.ceil(item.b + item.off) + 2), 7, { H: 168 }), T = htPara(svg, G, item.b, item.h, item.off), u = item.u || 'cm';
    htLab(svg, [(T.A[0] + T.B[0]) / 2, T.A[1] + 16], htCm(item.b, u), HT.ink); htLab(svg, [(T.A[0] + T.D[0]) / 2 - 22, (T.A[1] + T.D[1]) / 2], htCm(item.s, u), HT.side);
    const F = [T.D[0], T.A[1]]; htHeight(svg, G, { A: T.A, B: T.B }, htCm(item.h, u), { top: T.D, foot: F, extend: F[0] < T.A[0] || F[0] > T.B[0] });
    if (tries >= 3) { const m = helpG(svg), t = el('text', { x: 180, y: 227, 'text-anchor': 'middle', 'font-size': 17, 'font-weight': 800, fill: THINK_INK, direction: 'ltr' }, m); t.textContent = item.ask === 'perim' ? `2 × (${item.b} + ${item.s}) = ؟` : `${item.b} × ${item.h} = ؟`; await S('gen.ht.together.' + item.ask); }
    else await S(item.q || 'gen.ht.q.para.' + item.ask);
    const np = await this.askNum(item); return { ans: await np.p, ctx: { svg, T } }; },
  judge(item, k) { if (k === item.want) return { ok: true }; return { ok: false, err: item.ask === 'perim' ? (k === item.b * item.h ? 'perimArea' : 'perimOff') : k === item.b * item.s ? 'areaSlant' : k === 2 * (item.b + item.s) ? 'perimArea' : k === item.want / 2 ? 'areaHalf' : k === item.b + item.h ? 'htAddBH' : 'htMulOff' }; },
  async hint2(item, r) { if (item.ask === 'perim' && r && r.ctx && r.ctx.T) { const T = r.ctx.T, m = helpG(r.ctx.svg), u = item.u || 'cm';   /* المحيط: الضلعان المقابلان مكتوبان، فالأضلاع الأربعة أمامه */
      htLab(m, [(T.D[0] + T.C[0]) / 2, T.D[1] - 14], htCm(item.b, u), THINK_INK); htLab(m, [(T.B[0] + T.C[0]) / 2 + 24, (T.B[1] + T.C[1]) / 2], htCm(item.s, u), THINK_INK); }
    if (item.ask !== 'perim' && r && r.ctx && r.ctx.T) { const T = r.ctx.T, m = helpG(r.ctx.svg); el('polygon', { points: polyStr([T.A, T.B, [T.B[0], T.D[1]], [T.A[0], T.D[1]]]), fill: 'none', stroke: THINK_INK, 'stroke-width': 2.6, 'stroke-dasharray': '7 5' }, m); }   /* المستطيل الذي يصير إليه (10) */
    await S(item.ask === 'perim' ? 'gen.ht.hint.perim' : 'gen.ht.hint.paraArea'); }, async together() {},
  async reveal(item) { await S('gen.ht.reveal.num', { noGap: true }); await S(halfw(item.want), { append: true }); },
  praise: () => 'praiseThink', twin(item) { return item.twin || null; },
};

/* ================= ④ مساحة المثلث (C303): b، h، foot موضع قدم الارتفاع من أول القاعدة (سالب أو أكبر من b: خارجي)، side طول ضلع مائل يُكتب (اختياري، للإغراء) ================= */
ITEM.triArea = { ...htNumItem,
  make(spec) { const A = spec.b * spec.h / 2; /*T*/if (TESTHOOK && A > 100) testBug('triArea: مساحة فوق المئة');/*/T*/ const errs = [spec.b * spec.h, spec.side ? spec.b * spec.side / 2 : 0, spec.b + spec.h];
    return { ...spec, want: A, nums: halfMix(A, errs), tag: 'tri-area' + (spec.foot < 0 || spec.foot > spec.b ? '-out' : '') }; },
  async ask(item, mode, tries) { const svg = m3Stage(250), G = htGrid(svg, Math.max(12, Math.max(item.b, item.foot) - Math.min(0, item.foot) + 2), 7, { H: 168 }), T = htTri(svg, G, item.b, item.h, item.foot), u = item.u || 'cm', out = item.foot < 0 || item.foot > item.b;
    if (item.land) { const D = [T.A[0] + T.C[0] - T.B[0], T.C[1]]; el('polygon', { points: polyStr([T.A, T.B, T.C, D]), fill: 'none', stroke: HT.ink, 'stroke-width': 2.6, 'stroke-dasharray': '7 5' }, svg); el('polygon', { points: polyStr([T.A, T.B, T.C]), fill: '#8aa040', 'fill-opacity': .3, 'pointer-events': 'none' }, svg); }   /* أرض متوازي أضلاع بقطرها، والمثلث ملوّن (17) */
    htLab(svg, [(T.A[0] + T.B[0]) / 2, T.A[1] + 16], htCm(item.b, u), HT.ink);
    if (item.foot !== 0 && item.foot !== item.b) htHeight(svg, G, T, htCm(item.h, u), { extend: out }); else htLab(svg, [(item.foot ? T.B[0] + 20 : T.A[0] - 20), (T.C[1] + T.A[1]) / 2], htCm(item.h, u), HT.h);   /* القائم: الارتفاع ضلعه */
    if (item.side) { const S0 = item.foot > item.b / 2 ? [T.A, T.C] : [T.B, T.C]; htLab(svg, [(S0[0][0] + S0[1][0]) / 2 + (S0[0] === T.A ? -20 : 20), (S0[0][1] + S0[1][1]) / 2], htCm(item.side, u), HT.side); }
    if (tries >= 3) { const m = helpG(svg), t = el('text', { x: 180, y: 227, 'text-anchor': 'middle', 'font-size': 17, 'font-weight': 800, fill: THINK_INK, direction: 'ltr' }, m); t.textContent = `${item.b} × ${item.h} ÷ 2 = ؟`; await S('gen.ht.together.tri'); }
    else await S(item.q || 'gen.ht.q.tri');
    const np = await this.askNum(item); return { ans: await np.p, ctx: { svg, T } }; },
  judge(item, k) { if (k === item.want) return { ok: true }; return { ok: false, err: k === item.b * item.h ? 'triNoHalf' : item.side && k === item.b * item.side / 2 ? 'triSlant' : k === item.b + item.h ? 'htAddBH' : 'htMulOff' }; },
  async hint2(item, r) { if (r && r.ctx && r.ctx.T && !item.land) { const T = r.ctx.T, m = helpG(r.ctx.svg); el('polygon', { points: polyStr([T.B, [T.B[0] + T.C[0] - T.A[0], T.C[1]], T.C]), fill: 'none', stroke: THINK_INK, 'stroke-width': 2.6, 'stroke-dasharray': '7 5' }, m); }   /* نسخة المثلث تُكمل متوازي أضلاع (10) */
    await S('gen.ht.hint.tri'); }, async together() {},
  async reveal(item) { await S('gen.ht.reveal.num', { noGap: true }); await S(halfw(item.want), { append: true }); },
  praise: () => 'praiseThink', twin(item) { return item.twin || null; },
};

/* ================= ⑤ القاعدة أو الارتفاع المجهول (C335): fig para | tri، A المساحة، give b | h والقيمة v؛ والجواب الآخر ================= */
ITEM.missingDim = { ...htNumItem,
  make(spec) { const k = spec.fig === 'tri' ? 2 : 1, want = k * spec.A / spec.v; /*T*/if (TESTHOOK && !Number.isInteger(want)) testBug('missingDim: جواب غير صحيح');/*/T*/
    const errs = spec.fig === 'tri' ? [spec.A / spec.v, spec.A * 2, spec.A - spec.v] : [spec.A / spec.v * 2, spec.A - spec.v, spec.A / 2];
    return { ...spec, want, nums: halfMix(want, errs), tag: 'missing-' + spec.fig }; },
  async ask(item, mode, tries) { const svg = m3Stage(250), G = htGrid(svg, 14, 7, { H: 168 }), u = item.u || 'cm', b = item.give === 'b' ? item.v : item.want, h = item.give === 'h' ? item.v : item.want;
    G.g.setAttribute('display', 'none'); const hs = item.give === 'h' ? Math.min(h, 6) : 4, bs = item.give === 'b' ? Math.min(b, 12) : 9, T = item.fig === 'tri' ? htTri(svg, G, bs, hs, Math.round(bs * .35)) : htPara(svg, G, bs, hs, 2);   /* بلا شبكة، والمجهول بطولٍ ثابت لا يُعدّ ولا يطابق خياراً (المراجع A لبوابة S3-U2/U3، 5) */
    const top = item.fig === 'tri' ? T.C : T.D, F = [top[0], T.A[1]]; htHeight(svg, G, { A: T.A, B: T.B, C: top, F }, item.give === 'h' ? htCm(h, u) : '؟', { top, foot: F });
    htLab(svg, [(T.A[0] + T.B[0]) / 2, T.A[1] + 16], item.give === 'b' ? htCm(b, u) : '؟', HT.ink);
    const t = el('text', { x: 180, y: 226, 'text-anchor': 'middle', 'font-size': 17, 'font-weight': 800, fill: HT.ok, direction: 'rtl' }, svg); t.textContent = `${labelText('arArea0')} ${item.A} ${labelText(u === 'm' ? 'arM2' : 'arCm2')}`;
    if (tries >= 3) { const m = helpG(svg), f = el('text', { x: 180, y: 30, 'text-anchor': 'middle', 'font-size': 18, 'font-weight': 800, fill: THINK_INK, direction: 'ltr' }, m); f.textContent = item.fig === 'tri' ? `2 × ${item.A} ÷ ${item.v} = ؟` : `${item.A} ÷ ${item.v} = ؟`; await S('gen.ht.together.missing'); }   /* الصيغة بلا حرف عربي: من اليسار، وتنقلب مع المشرقية (D251، 21) */
    else await S(item.q || 'gen.ht.q.missing.' + item.fig + '.' + item.give);
    const np = await this.askNum(item); return { ans: await np.p, ctx: { svg } }; },
  judge(item, k) { if (k === item.want) return { ok: true }; return { ok: false, err: item.fig === 'tri' && k === item.A / item.v ? 'triNoDouble' : 'dimOff' }; },
  async hint2(item, r) { if (r && r.ctx && r.ctx.svg) hintCard(r.ctx.svg, 180, 30, labelText(item.fig === 'tri' ? 'htRuleTri' : 'htRulePara')); await S(item.fig === 'tri' ? 'gen.ht.hint.missingTri' : 'gen.ht.hint.missingPara'); }, async together() {},
  async reveal(item) { await S('gen.ht.reveal.num', { noGap: true }); await S(halfw(item.want), { append: true }); },
  praise: () => 'praiseThink', twin(item) { return item.twin || null; },
};

/* ================= ⑥ «مهندس المساحات» (C335، اللعبة): قاعدة ثابتة، ويُضبط الارتفاع بزرّين حتى تطابق المساحة المطلوبة ================= */
/* المستوى الثاني: مساحة الشكل الآن مقروءةً فوقه، تتغيّر مع كل ضبط، فيقارنها الطفل بالمطلوبة (D240) */
function htAreaNow(parent, item, h) { const m = helpG(parent), A = item.fig === 'tri' ? item.b * h / 2 : item.b * h, t = el('text', { x: 180, y: 26, 'text-anchor': 'middle', 'font-size': 16, 'font-weight': 800, fill: THINK_INK, stroke: '#fff', 'stroke-width': 4, 'paint-order': 'stroke', direction: 'rtl' }, m);
  t.textContent = `${labelText('htNow')} ${decFmt(A)} ${labelText((item.u || 'cm') === 'm' ? 'arM2' : 'arCm2')}`; return m; }
ITEM.areaTune = {
  make(spec) { const want = (spec.fig === 'tri' ? 2 : 1) * spec.A / spec.b; /*T*/if (TESTHOOK && (!Number.isInteger(want) || want > 6)) testBug('areaTune: ارتفاع غير صالح');/*/T*/ return { ...spec, want, tag: 'area-tune' }; },
  async ask(item, mode, tries) { const svg = m3Stage(250), G = htGrid(svg, 14, 7, { H: 168 }); let h = item.h0 ?? 1, sh = null; const u = item.u || 'cm';
    const goal = el('text', { x: 180, y: 227, 'text-anchor': 'middle', 'font-size': 16, 'font-weight': 800, fill: HT.ink, direction: 'rtl' }, svg); goal.textContent = `${labelText('htGoal')} ${item.A} ${labelText(u === 'm' ? 'arM2' : 'arCm2')}`;
    const draw = () => { if (sh) sh.remove(); sh = el('g', {}, svg); const T = item.fig === 'tri' ? htTri(sh, G, item.b, h, Math.round(item.b / 2)) : htPara(sh, G, item.b, h, 2), top = item.fig === 'tri' ? T.C : T.D;
      htHeight(sh, G, { A: T.A, B: T.B }, htCm(h, u), { top, foot: [top[0], T.A[1]] }); htLab(sh, [(T.A[0] + T.B[0]) / 2, T.A[1] + 16], htCm(item.b, u)); if (tries >= 2) htAreaNow(sh, item, h); };
    draw(); if (tries >= 3) { h = item.want + (h < item.want ? -1 : 1); draw(); await S('gen.ht.together.tune'); } else await S(item.q || 'gen.ht.q.tune');
    const St = dqSteps(['htLower', 'htHigher'], d => { const n = Math.max(1, Math.min(6, h + d)); if (n === h) return false; h = n; draw(); return true; }, { vert: true });
    /*T*/window.__htH = () => h;/*/T*/
    AUTO({ kind: 'htTune', ok: () => { h = item.want; draw(); rulDoneBtn().click(); }, wrong: () => { h = item.want === 6 ? 5 : item.want + 1; draw(); rulDoneBtn().click(); } });
    await rulDone(() => St.off()); return { ans: h, ctx: { svg, set: v => { h = v; draw(); } } }; },
  judge(item, k) { return k === item.want ? { ok: true } : { ok: false, err: item.fig === 'tri' && k * 2 === item.want ? 'triNoDouble' : 'dimOff' }; },
  onOk() { SFX.good(); }, onWrong() { SFX.soft(); },
  async hint2(item, r) { if (r && r.ctx && r.ctx.svg) htAreaNow(r.ctx.svg, item, r.ans); await S(item.fig === 'tri' ? 'gen.ht.hint.missingTri' : 'gen.ht.hint.missingPara'); }, async together() {},
  async reveal(item, r) { if (r && r.ctx && r.ctx.set) r.ctx.set(item.want); await S('gen.ht.reveal.tune'); },
  praise: () => 'praiseThink', twin(item) { return item.twin || null; },
};

/* ================= المشاهد ================= */
/* الإشعال (د1): البئر والطريق، وخيوط إلى أربع نقاط بأطوالها، والأقصر العمودي */
SCENES.pumpHook = async c => { const L = c.lines, svg = m3Stage(250), G = htGrid(svg, 12, 7, { H: 168 }); htLine(svg, G, 1, 0, 12, { ext: false }); const W = [3, 5], w = G.P(W);
  el('circle', { cx: w[0], cy: w[1], r: 9, fill: '#5aa0c8', stroke: '#fff', 'stroke-width': 2 }, svg); htLab(svg, [w[0], w[1] - 18], labelText('htWell'), HT.side, 13); const fz = chaosAt(svg, 318, 38, .4); chaosGiggle(fz); await S(L[0]);
  await axPredictYN('no', 'gen.dec.pr.cmp');   /* توقّعٌ قبل الخيوط (المراجع A لبوابة S3-U2/U3، 20) */
  for (const [i, dx] of [8, 6, 3, 0].entries()) { const F = G.P([W[0] + dx, 1]), d = Math.hypot(dx, 4); geoLine(svg, w[0], w[1], F[0], F[1], { color: dx ? HT.side : HT.ok, w: dx ? 2.4 : 3.4 }); htLab(svg, [F[0] + 4, F[1] + 18], decFmt(Math.round(d * 10) / 10, 1), dx ? HT.side : HT.ok, 13); SFX.tick(); await sleep(FAST ? 5 : 450); }
  htRight(svg, G.P([W[0], 1]), -90, 0, 11, HT.ok); for (const l of L.slice(1)) await S(l); };
/* الاكتشاف (د1): المستقيم يمتدّ حين تقع القدم خارج القطعة، والمتوازيان: عمودان متساويان */
SCENES.perpDist = async c => { const L = c.lines, svg = m3Stage(250), G = htGrid(svg, 12, 7, { H: 168 }); htLine(svg, G, 1, 2, 7); const p = G.P([10, 5]); el('circle', { cx: p[0], cy: p[1], r: 6, fill: HT.ink }, svg); await S(L[0]); await axPredictYN('yes', 'gen.ht.pr.extend');
  const F = G.P([10, 1]); geoLine(svg, p[0], p[1], F[0], F[1], { color: HT.h, w: 3 }); htRight(svg, F, -90, 180, 10, HT.h); htLab(svg, [F[0] + 22, (p[1] + F[1]) / 2], htCm(4), HT.h); SFX.tick(); await S(L[1]);
  const top = G.P([0, 5]), top2 = G.P([12, 5]); geoLine(svg, top[0], top[1], top2[0], top2[1], { color: HT.side, w: 3 }); for (const x of [3, 6]) { const a = G.P([x, 5]), b = G.P([x, 1]); geoLine(svg, a[0], a[1], b[0], b[1], { color: HT.ok, w: 3, dash: '6 4' }); htLab(svg, [a[0] - 16, (a[1] + b[1]) / 2], '4', HT.ok); }
  SFX.tick(); for (const l of L.slice(2)) await S(l); };
/* الاكتشاف (د2): ارتفاعات المثلث القائم الثلاثة (8 و6 و4.8)، ثم الخارجي في المنفرج، ثم الرأس يتحرّك على موازٍ والارتفاع ثابت */
SCENES.heightShow = async c => { const L = c.lines, svg = m3Stage(250); let G = htGrid(svg, 14, 7, { H: 168 }), g = el('g', {}, svg);
  if (c.three) { const TL = c.three, T0 = htTri(g, G, 8, 6, 8, { x: 3 }), [A, B, C] = [T0.A, T0.B, T0.C];   /* ارتفاعات المثلث 6-8-10 الثلاثة: 6 و8 و4.8 (المراجع A لبوابة S3-U2/U3، 12) */
    htLab(g, [(A[0] + B[0]) / 2, A[1] + 16], htCm(8)); htLab(g, [B[0] + 20, (B[1] + C[1]) / 2], htCm(6)); htLab(g, [(A[0] + C[0]) / 2 - 18, (A[1] + C[1]) / 2 - 8], htCm(10), HT.side); await S(TL[0]);
    geoLine(g, C[0], C[1], B[0], B[1], { color: HT.h, w: 5 }); htRight(g, B, 180, -90, 10, HT.h); SFX.tick(); await S(TL[1]);
    await axPredictYN('yes', 'gen.ht.pr.inside'); const t = ((B[0] - A[0]) * (C[0] - A[0]) + (B[1] - A[1]) * (C[1] - A[1])) / ((C[0] - A[0]) ** 2 + (C[1] - A[1]) ** 2), F = [A[0] + t * (C[0] - A[0]), A[1] + t * (C[1] - A[1])];
    geoLine(g, B[0], B[1], F[0], F[1], { color: HT.mid, w: 3, dash: '6 4' }); htLab(g, [(B[0] + F[0]) / 2 + 22, (B[1] + F[1]) / 2], decFmt(4.8), HT.mid); SFX.tick(); await S(TL[2]); g.remove(); g = el('g', {}, svg); }
  const T = htTri(g, G, 6, 4, 6, { x: 4 }); htLab(g, [(T.A[0] + T.B[0]) / 2, T.A[1] + 16], htCm(6)); htLab(g, [T.B[0] + 22, (T.B[1] + T.C[1]) / 2], htCm(4), HT.h); htRight(g, T.B, 180, -90, 10, HT.h); await S(L[0]);
  g.remove(); g = el('g', {}, svg); const T2 = htTri(g, G, 6, 3, 8, { x: 2 }); htLab(g, [(T2.A[0] + T2.B[0]) / 2, T2.A[1] + 16], htCm(6)); htHeight(g, G, T2, htCm(3), { extend: true }); SFX.tick(); await S(L[1]);
  g.remove(); g = el('g', {}, svg); let tri = null; const par = G.P([0, 5]), par2 = G.P([14, 5]); geoLine(g, par[0], par[1], par2[0], par2[1], { color: HT.side, w: 2.4, dash: '6 5' });
  for (const f of [-1, 1, 3, 6, 8]) { if (tri) tri.remove(); tri = el('g', {}, g); const Tt = htTri(tri, G, 6, 4, f, { x: 4 }); htHeight(tri, G, Tt, htCm(4), { extend: f < 0 || f > 6 }); SFX.tick(); await sleep(FAST ? 5 : 650); }
  for (const l of L.slice(2)) await S(l); };
/* الاكتشاف (د3): متوازي أضلاع 6 × 4 يُقصّ منه مثلث ويُنقل فيصير مستطيلاً؛ ثم الإطار المدفوع: المحيط 28 والمساحة 48 ثم 32 ثم 24 */
SCENES.paraCut = async c => { const L = c.lines, svg = m3Stage(250), G = htGrid(svg, 14, 7, { H: 168 }), T = htPara(svg, G, 6, 4, 2, { x: 3 }); htLab(svg, [(T.A[0] + T.B[0]) / 2, T.A[1] + 16], htCm(6)); await S(L[0]);
  const F = [T.D[0], T.A[1]], cut = el('polygon', { points: polyStr([T.A, F, T.D]), fill: '#f2d38a', stroke: HT.ink, 'stroke-width': 2 }, svg); geoLine(svg, T.D[0], T.D[1], F[0], F[1], { color: HT.h, w: 3, dash: '6 4' }); SFX.tick(); await S(L[1]);
  await axPredictNum(24, 'gen.ht.pr.rect');   /* توقّعٌ قبل النقل (20) */
  await anim(cut, [{ transform: 'translate(0px,0px)' }, { transform: `translate(${T.B[0] - T.A[0]}px,0px)` }], { duration: FAST ? 10 : 1000, fill: 'forwards' }).done; SFX.good();
  const t = el('text', { x: 180, y: 227, 'text-anchor': 'middle', 'font-size': 18, 'font-weight': 800, fill: HT.ok, direction: 'ltr' }, svg); t.textContent = `6 × 4 = 24`; await S(L[2]);
  for (const l of L.slice(3)) await S(l);
  if (c.two) { const s2 = m3Stage(250), G2 = htGrid(s2, 14, 7, { H: 168 }), P1 = htPara(s2, G2, 8, 3, Math.sqrt(27), { x: 1 });   /* القاعدتان: 8 × 3 = 6 × 4 (12) */
    htLab(s2, [(P1.A[0] + P1.B[0]) / 2, P1.A[1] + 16], htCm(8)); htHeight(s2, G2, { A: P1.A, B: P1.B }, htCm(3), { top: P1.D, foot: [P1.D[0], P1.A[1]] }); const t1 = el('text', { x: 180, y: 227, 'text-anchor': 'middle', 'font-size': 18, 'font-weight': 800, fill: HT.ok, direction: 'ltr' }, s2); t1.textContent = '8 × 3 = 24'; await S(c.two[0]);
    const s3 = m3Stage(250), G3 = htGrid(s3, 14, 7, { H: 168 }), P2 = htPara(s3, G3, 6, 4, Math.sqrt(48), { x: 1 }); htLab(s3, [(P2.A[0] + P2.B[0]) / 2, P2.A[1] + 16], htCm(6)); htHeight(s3, G3, { A: P2.A, B: P2.B }, htCm(4), { top: P2.D, foot: [P2.D[0], P2.A[1]] });
    await axPredictNum(24, 'gen.ht.pr.other'); const t2 = el('text', { x: 180, y: 227, 'text-anchor': 'middle', 'font-size': 18, 'font-weight': 800, fill: HT.ok, direction: 'ltr' }, s3); t2.textContent = '6 × 4 = 24'; SFX.good(); await S(c.two[1]); } };
SCENES.frameArea = async c => { const L = c.lines, svg = m3Stage(250), G = htGrid(svg, 14, 7, { H: 168 }); let sh = null; const t = el('text', { x: 180, y: 227, 'text-anchor': 'middle', 'font-size': 16, 'font-weight': 800, fill: HT.ink, direction: 'rtl' }, svg);
  for (const [i, h] of [6, 4, 3].entries()) { if (sh) sh.remove(); sh = el('g', {}, svg); const off = Math.sqrt(36 - h * h), T = htPara(sh, G, 8, h, off, { x: 2 }); if (h < 6) htHeight(sh, G, { A: T.A, B: T.B }, htCm(h), { top: T.D, foot: [T.D[0], T.A[1]] });
    t.textContent = `${labelText('arPerim0')} 28 ${U_('cm')} · ${labelText('arArea0')} ${8 * h} ${labelText('arCm2')}`; SFX.tick(); await S(L[i]); }
  for (const l of L.slice(3)) await S(l); };
/* الاكتشاف (د4): نسختان من المثلث، الثانية مقلوبة نصف دورة، تكوّنان متوازي أضلاع؛ والمثلث نصفه */
SCENES.triDouble = async c => { const L = c.lines, svg = m3Stage(250), G = htGrid(svg, 14, 7, { H: 168 }), T = htTri(svg, G, 6, 4, 2, { x: 2 }); await S(L[0]);
  await axPredictYN('yes', 'gen.ht.pr.copy'); const cp = el('polygon', { points: polyStr([T.A, T.B, T.C]), fill: '#f2d38a', 'fill-opacity': .8, stroke: HT.ink, 'stroke-width': 2 }, svg), M = [(T.B[0] + T.C[0]) / 2, (T.B[1] + T.C[1]) / 2];
  await anim(cp, [{ transform: 'rotate(0deg)', transformOrigin: `${M[0]}px ${M[1]}px` }, { transform: 'rotate(180deg)', transformOrigin: `${M[0]}px ${M[1]}px` }], { duration: FAST ? 10 : 1300, fill: 'forwards' }).done; SFX.good(); await S(L[1]);
  const t = el('text', { x: 180, y: 227, 'text-anchor': 'middle', 'font-size': 18, 'font-weight': 800, fill: HT.ok, direction: 'ltr' }, svg); t.textContent = `6 × 4 ÷ 2 = 12`; for (const l of L.slice(2)) await S(l);
  if (c.same) { const s2 = m3Stage(250), G2 = htGrid(s2, 14, 7, { H: 168 }); [[0, '#8aa040'], [3, '#5aa0c8'], [8, '#e0a32e']].forEach(([f, col]) => htTri(s2, G2, 6, 4, f, { x: 3, fill: col }));   /* ثلاثة مثلثات بالقاعدة والارتفاع نفسهما (12) */
    s2.querySelectorAll('polygon').forEach(p => p.setAttribute('fill-opacity', .35)); const t2 = el('text', { x: 180, y: 227, 'text-anchor': 'middle', 'font-size': 18, 'font-weight': 800, fill: HT.ok, direction: 'ltr' }, s2); t2.textContent = '6 × 4 ÷ 2 = 12';
    for (const l of c.same) await S(l); } };
/* المشروع (د5): أرض متوازي أضلاع 12 × 4 وضلعها المائل 5، يقسمها قطر إلى مثلثين */
SCENES.landProject = async c => { const L = c.lines, svg = m3Stage(250), G = htGrid(svg, 16, 6, { H: 150 }), T = htPara(svg, G, 12, 4, 3, { x: 1 });
  htLab(svg, [(T.A[0] + T.B[0]) / 2, T.A[1] + 16], htCm(12, 'm')); htLab(svg, [(T.A[0] + T.D[0]) / 2 - 20, (T.A[1] + T.D[1]) / 2], htCm(5, 'm'), HT.side); htHeight(svg, G, { A: T.A, B: T.B }, htCm(4, 'm'), { top: T.D, foot: [T.D[0], T.A[1]] }); await S(L[0]);
  await axPredictYN('yes', 'gen.ht.pr.halves');
  geoLine(svg, T.A[0], T.A[1], T.C[0], T.C[1], { color: HT.mid, w: 3 }); el('polygon', { points: polyStr([T.A, T.B, T.C]), fill: '#8aa040', 'fill-opacity': .25, 'pointer-events': 'none' }, svg); el('polygon', { points: polyStr([T.A, T.C, T.D]), fill: '#e0a32e', 'fill-opacity': .25, 'pointer-events': 'none' }, svg); SFX.tick();
  for (const l of L.slice(1)) await S(l); };
/* إشعال بادّعاء فوضى (د2 ود4 ود5): مثلث قاعدته b وارتفاعه h، وفوضى تعلّم ضلعاً مائلاً «ارتفاعاً» (side) أو تكتب صيغتها */
SCENES.htClaim = async c => { const L = [...c.lines], svg = m3Stage(250), G = htGrid(svg, 14, 7, { H: 168 }), T = htTri(svg, G, c.b || 6, c.h || 4, c.foot ?? 2); const fz = chaosAt(svg, 318, 38, .4); chaosGiggle(fz);
  htLab(svg, [(T.A[0] + T.B[0]) / 2, T.A[1] + 16], htCm(c.b || 6));
  if (c.side) { geoLine(svg, T.B[0], T.B[1], T.C[0], T.C[1], { color: HT.bad, w: 4 }); htLab(svg, [(T.B[0] + T.C[0]) / 2 + 26, (T.B[1] + T.C[1]) / 2], labelText('htHeightQ'), HT.bad, 14); }
  else htHeight(svg, G, T, htCm(c.h || 4));
  if (c.pred) { await S(L[0]); await axPredictYN(c.pred[0], c.pred[1]); L.splice(0, 1); }   /* توقّعٌ بعد ادّعاء فوضى (20) */
  for (const l of L) await S(l); };
/* مثال محلول (د5، المراجع A لبوابة S3-U2/U3، 6): الارتفاع المجهول بالقسمة، وضعف المساحة في المثلث، والتحقّق بالتعويض */
SCENES.mdShow = async c => { const L = c.lines, T0 = (svg, y, s, col = HT.ink, dir = 'ltr') => { const t = el('text', { x: 180, y, 'text-anchor': 'middle', 'font-size': 20, 'font-weight': 800, fill: col, direction: dir }, svg); t.textContent = s; return t; };
  let svg = m3Stage(250), G = htGrid(svg, 14, 7, { H: 150 }); G.g.remove(); const P = htPara(svg, G, 9, 4, 2); htLab(svg, [(P.A[0] + P.B[0]) / 2, P.A[1] + 16], htCm(9)); htHeight(svg, G, { A: P.A, B: P.B }, '؟', { top: P.D, foot: [P.D[0], P.A[1]] });
  T0(svg, 30, `${labelText('arArea0')} 36 ${labelText('arCm2')}`, HT.ok, 'rtl'); await S(L[0]); await axPredictNum(4, 'gen.ht.pr.mdPara'); T0(svg, 226, '36 ÷ 9 = 4', THINK_INK); SFX.tick(); await S(L[1]);
  svg = m3Stage(250); G = htGrid(svg, 14, 7, { H: 150 }); G.g.remove(); const T = htTri(svg, G, 6, 4, 2); htLab(svg, [(T.A[0] + T.B[0]) / 2, T.A[1] + 16], htCm(6)); htHeight(svg, G, T, '؟');
  T0(svg, 30, `${labelText('arArea0')} 15 ${labelText('arCm2')}`, HT.ok, 'rtl'); await S(L[2]); await axPredictNum(5, 'gen.ht.pr.mdTri'); T0(svg, 214, '15 × 2 = 30', THINK_INK); T0(svg, 240, '30 ÷ 6 = 5', THINK_INK); SFX.tick(); await S(L[3]);
  svg = m3Stage(250); G = htGrid(svg, 14, 7, { H: 150 }); G.g.remove(); const T2 = htTri(svg, G, 6, 5, 2); htLab(svg, [(T2.A[0] + T2.B[0]) / 2, T2.A[1] + 16], htCm(6)); htHeight(svg, G, T2, htCm(5));
  T0(svg, 226, '6 × 5 ÷ 2 = 15', HT.ok); SFX.good(); await S(L[4]); for (const l of L.slice(5)) await S(l); };
WRAP_ART.heightArt = svg => { const G = htGrid(svg, 10, 6, { H: 150, top: 30 }), T = htTri(svg, G, 6, 4, 2, { x: 2 }); htHeight(svg, G, T, null); };
