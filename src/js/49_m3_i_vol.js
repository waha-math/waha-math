/* =====================================================================
   S3-U9 «الحجم» (المرحلة 3، المرجع reference/03_المناهج_والوحدات/S3-U9_الحجم.md، نسخة 1.1)
   د1 الحجم بعدّ مكعبات الوحدة طبقة بعد طبقة (C309) و«املأ الصندوق» · د2 الحجم = الطول × العرض × الارتفاع (C326)
   والوحدتان «سم مكعب» و«م مكعب» بالأسماء دون تحويل (C325) · د3 علبتان بالحجم نفسه ومساحتا سطح مختلفتان
   د4 مشروع «صندوق الكنز» (120 سم مكعب) · د5 مراجعة الوحدة واختبارها
   الوحدة المكعبة بالكلمات كما في المرجع («سم مكعب»): خط القراءة لا يحمل «³».
   المكعبات بإسقاط العلبة المائل نفسه (soGeom)، تُرسم من الخلف إلى الأمام ومن الأسفل إلى الأعلى.
   ===================================================================== */
const VO = { cube: '#f6cf7e', cubeTop: '#fbe3a8', cubeSide: '#e0b25a', edge: '#8a6a1e', box: SO.edge, ok: SO.ok, bad: SO.bad, hl: SO.hl };
const voU = u => labelText(u === 'm3' ? 'voM3' : u === 'cm3' ? 'voCm3' : u === 'm2' ? 'arM2' : u === 'cm2' ? 'arCm2' : u === 'm' ? 'lenM' : 'rulCm');
const voTxt = (v, u) => MS(String(v)) + (u && u !== 'n' ? ' ' + voU(u) : '');
const voLine = (v, u) => `gen.vo.v.${v}.${u}`;
/* مكعبات الوحدة: w عرضاً وd عمقاً وh ارتفاعاً، وn الطبقات المملوءة (من الأسفل)؛ والصندوق خطوطه حوله */
function voStack(parent, w, d, h, o = {}) { const s = o.s || Math.min(30, soFit(w, h, d, o.W || 250, o.H || 160)), G = soGeom(w, h, d, { s, cx: o.cx ?? 180, cy: o.cy ?? 128 }), g = el('g', { 'pointer-events': 'none' }, parent), n = o.layers ?? h;
  const ux = s, vx = G.dx / d, vy = G.dy / d, O = G.P.flb, Pt = (i, j, k) => [O[0] + i * ux + j * vx, O[1] - k * s + j * vy];
  if (o.box !== false) for (const e of G.E.filter(e => e.hid)) geoLine(g, e.A[0], e.A[1], e.B[0], e.B[1], { color: SO.hid, w: 2, dash: '6 5' });
  for (let k = 0; k < n; k++) for (let j = d - 1; j >= 0; j--) for (let i = 0; i < w; i++) { if (o.only && !o.only(i, j, k)) continue;
    const a = Pt(i, j, k), b = Pt(i + 1, j, k), c = Pt(i + 1, j, k + 1), e = Pt(i, j, k + 1), b2 = Pt(i + 1, j + 1, k), c2 = Pt(i + 1, j + 1, k + 1), e2 = Pt(i, j + 1, k + 1);
    const col = o.colOf ? o.colOf(i, j, k) : null;
    el('polygon', { points: polyStr([e, c, c2, e2]), fill: col ? mix(col, 'w', .35) : VO.cubeTop, stroke: VO.edge, 'stroke-width': 1 }, g);
    el('polygon', { points: polyStr([b, b2, c2, c]), fill: col ? mix(col, 'b', .12) : VO.cubeSide, stroke: VO.edge, 'stroke-width': 1 }, g);
    el('polygon', { points: polyStr([a, b, c, e]), fill: col || VO.cube, stroke: VO.edge, 'stroke-width': 1 }, g); }
  if (o.box !== false) for (const e of G.E.filter(e => !e.hid)) geoLine(g, e.A[0], e.A[1], e.B[0], e.B[1], { color: VO.box, w: 2.6 });
  if (o.dims) { htLab(g, [(G.P.flb[0] + G.P.frb[0]) / 2, G.P.flb[1] + 16], MS(String(w)), SO.ink, 14); htLab(g, [G.P.flb[0] - 16, (G.P.flb[1] + G.P.flt[1]) / 2], MS(String(h)), SO.ink, 14); htLab(g, [(G.P.frb[0] + G.P.brb[0]) / 2 + 18, (G.P.frb[1] + G.P.brb[1]) / 2 + 6], MS(String(d)), SO.ink, 14); }
  return { g, G, s }; }

/* ================= ① كم مكعباً في الصندوق؟ (C309): w d h؛ والمكعبات كلها مرسومة ================= */
const voVisible = (w, d, h) => w * h + w * d + d * h - w - d - h + 1;
ITEM.voCount = cpItem({ H: 250, tLine: 'gen.vo.together.count', hint: 'gen.vo.hint.count', rLine: 'gen.so.reveal.count', rSay: it => S(numw(it.want), { num: true, append: true }), num: true, praise: 'praiseCount',
  make: s => ({ want: s.w * s.d * s.h, tag: 'vo-count' }),
  draw(svg, item, tries) { const V = voStack(svg, item.w, item.d, item.h, { cy: 120 }); if (tries >= 3) { const m = helpG(svg); voStack(m, item.w, item.d, item.h, { cy: 120, layers: 1, box: false, colOf: () => VO.hl }); ciEq(m, 180, 232, `${item.w} × ${item.d} = ؟`, VO.hl, 17); } return { V }; },
  h2: async (item, ctx) => { const m = helpG(ctx.svg); voStack(m, item.w, item.d, item.h, { cy: 120, box: false, colOf: (i, j, k) => k % 2 ? '#9cc53b' : '#7fb6d9' }); await sleep(FAST ? 10 : 300); },
  pick: (item, ctx) => { const { w, d, h } = item, np = numberPick(rankMix(item.want, [voVisible(w, d, h), w * d, w + d + h, item.want + w * d], 1, 99), item.want, { west: true }); ctx.np = np; return np.p; },
  errOf: (it, k) => k === voVisible(it.w, it.d, it.h) ? 'voVisible' : k === it.w * it.d ? 'voLayer' : k === it.w + it.d + it.h ? 'voSum' : 'voCountOff' });

/* ================= ② «املأ الصندوق»: طبقة بعد طبقة حتى يمتلئ، والعدّاد يعدّ المكعبات (C309، إنتاج) ================= */
ITEM.voFill = {
  make(spec) { return { ...spec, want: spec.h, tag: 'vo-fill' }; },
  async ask(item, mode, tries) { const svg = m3Stage(262), host = el('g', {}, svg); let v = 0, reg = null;
    const cnt = el('text', { x: 310, y: 40, 'text-anchor': 'middle', 'font-size': 20, 'font-weight': 800, fill: VO.ok, 'pointer-events': 'none' }, svg);
    const draw = () => { host.innerHTML = ''; voStack(host, item.w, item.d, item.h, { cy: 118, layers: v }); cnt.textContent = MS(String(v * item.w * item.d)); /*T*/window.__cdV = v; window.__cdWant = item.h;/*/T*/ if (reg) reg(); };
    draw(); if (tries >= 3) ciEq(helpG(svg), 180, 30, `${item.w} × ${item.d} = ${item.w * item.d}`, VO.hl, 16);
    const btns = svgSteppers(svg, [[44, 238], [316, 238]], dd => { v = Math.max(0, Math.min(item.h + 1, v + dd)); SFX.tick(); draw(); }, { key: 'cd', labels: ['voLess', 'voMore'] });
    await S(tries >= 3 ? 'gen.vo.together.fill' : item.q || 'gen.vo.q.fill');
    const t = item.h, tap = b => b.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    const fin = rulDone(() => { reg = null; btns.forEach(b => { b.onclick = null; b.onkeydown = null; b.removeAttribute('role'); }); });
    reg = () => AUTO({ kind: 'compass', ok: () => v === t ? rulDoneBtn().click() : tap(btns[v < t ? 1 : 0]), wrong: () => { const w = t - 1; if (v === w) rulDoneBtn().click(); else tap(btns[v < w ? 1 : 0]); } }); reg(); await fin;
    return { ans: v, ctx: { svg } }; },
  judge(item, v) { return v === item.h ? { ok: true } : { ok: false, err: v < item.h ? 'voFillShort' : 'voFillOver' }; },
  onOk() { SFX.good(); }, onWrong() { SFX.soft(); },
  async hint2(item, r) { if (r && r.ctx) ciEq(helpG(r.ctx.svg), 180, 30, `${item.w} × ${item.d} = ${item.w * item.d}`, VO.hl, 16); await S('gen.vo.hint.fill'); }, async together() {},
  async reveal(item, r) { if (r && r.ctx) { const m = helpG(r.ctx.svg); voStack(m, item.w, item.d, item.h, { cy: 118 }); } await S('gen.so.reveal.count', { noGap: true }); await S(numw(item.w * item.d * item.h), { num: true, append: true }); },
  praise: () => 'praiseCount', twin(item) { return item.twin || null; },
};

/* ================= ③ الحجم بالضرب (C326، C325): w d h وu؛ ch من المولّد (الجمع، وبُعدان، والسطح) ================= */
ITEM.voCalc = cpItem({ H: 250, tLine: 'gen.vo.together.calc', hint: 'gen.vo.hint.calc', rLine: 'gen.ci.reveal.calc', rSay: it => S(voLine(it.want, it.u + '3'), { append: true }), praise: 'praiseThink',
  make: s => ({ want: s.ch[0][0], tag: 'vo-calc' + (s.w === s.d && s.d === s.h ? '-cube' : '') }),
  draw(svg, item, tries) { soBox(svg, item.w, item.h, item.d, { dims: true, u: item.u, s: soFit(item.w, item.h, item.d, 210, 130), cy: 112 }); if (tries >= 3) ciEq(helpG(svg), 180, 232, `${item.w} × ${item.d} × ${item.h} = ؟`, VO.hl, 17); return {}; },
  h2: async (item, ctx) => { ciRule(helpG(ctx.svg), 180, 230, labelText('voRule'), VO.hl, 14); await sleep(FAST ? 10 : 250); },
  show: async (item, ctx) => { if (ctx && ctx.svg) { ctx.svg.querySelectorAll('[data-help]').forEach(n => n.remove()); ciEq(helpG(ctx.svg), 180, 232, `${item.w} × ${item.d} × ${item.h} = ${item.want}`, VO.ok, 17); } },
  pick: item => choosePick(shuffle(item.ch.map(([v, , u]) => [String(v) + (u || ''), voTxt(v, u || item.u + '3'), '<i></i>', voLine(v, u || item.u + '3')])), String(item.want)),
  errOf: (it, k) => (it.ch.find(([v, , u]) => String(v) + (u || '') === k) || [])[1] || 'voOff' });
ITEM.voCalc.judge = (item, k) => k === String(item.want) ? { ok: true } : { ok: false, err: (item.ch.find(([v, , u]) => String(v) + (u || '') === k) || [])[1] || 'voOff' };

/* ================= ④ وحدة الحجم (C325): u cm | m؛ المكعب الوحدة حرفه 1 سم أو 1 م (بالصورة) ================= */
ITEM.voUnit = cpItem({ H: 230, tLine: 'gen.vo.together.unit', hint: 'gen.vo.hint.unit', rLine: it => 'gen.vo.unit.' + it.want, praise: 'praiseThink',
  make: s => ({ want: s.u + '3', tag: 'vo-unit' }),
  draw(svg, item, tries) { const B = soBox(svg, 1, 1, 1, { s: 96, cy: 116, dims: false }); htLab(svg, [130, 196], `1 ${item.u === 'm' ? labelText('lenM') : labelText('rulCm')}`.replace('1', MS('1')), SO.ink, 16);
    if (tries >= 3) ciRule(helpG(svg), 180, 26, labelText('voUnitHint'), VO.hl, 14); return { G: B.G }; },
  h2: async (item, ctx) => { if (ctx.G) { const m = helpG(ctx.svg), P = ctx.G.P; for (const [a, b] of [['flb', 'frb'], ['flb', 'flt'], ['frb', 'brb']]) geoLine(m, P[a][0], P[a][1], P[b][0], P[b][1], { color: VO.hl, w: 5 }); } await sleep(FAST ? 10 : 250); },   /* طولٌ وعرضٌ وارتفاع: مكعّب */
  pick: item => { const u = item.u; return choosePick(shuffle([u + '3', u + '2', u]).map(k => [k, voU(k), '<i></i>', 'gen.vo.unit.' + k]), item.want); },
  errOf: (it, k) => k.endsWith('2') ? 'voUnitSq' : 'voUnitLen' });

/* ================= ⑤ أيّ الأبعاد تعطي هذا الحجم؟ (C326 عكساً، المشروع): v؛ opts ثلاثة أبعاد (الأول الصحيح) ================= */
ITEM.voDims = cpItem({ H: 200, tLine: 'gen.vo.together.dims', hint: 'gen.vo.hint.dims', rLine: 'gen.vo.reveal.dims', praise: 'praiseThink',
  make: s => ({ want: s.opts[0].join('x'), tag: 'vo-dims' }),
  draw(svg, item, tries) { soBox(svg, 3, 2, 2, { s: 30, cy: 96 }); htLab(svg, [180, 166], voTxt(item.v, item.u + '3'), VO.ok, 20);   /* فوق حافة الإطار (المراجع B) */ if (tries >= 3) ciRule(helpG(svg), 180, 26, labelText('voRule'), VO.hl, 14); return {}; },
  h2: async (item, ctx) => { ciEq(helpG(ctx.svg), 180, 30, `؟ × ؟ × ؟ = ${item.v}`, VO.hl, 17); await sleep(FAST ? 10 : 250); },   /* ضربٌ لا جمع */
  pick: item => choosePick(shuffle(item.opts.map(o => [o.join('x'), o.map(x => MS(String(x))).join(' × '), '<i></i>', 'gen.vo.dims.' + o.join('x')])), item.want),
  errOf: (it, k) => { const o = k.split('x').map(Number); return o[0] + o[1] + o[2] === it.v ? 'voSum' : 'voDimsOff'; } });

/* ================= ⑥ «علبة الهدية الذكية»: علب بالحجم نفسه، أيّها أقلّ ورقاً؟ (C326، C321): boxes [[w h d]…] ================= */
ITEM.voSmart = cpItem({ H: 250, tLine: 'gen.vo.together.smart', hint: 'gen.vo.hint.smart', rLine: 'gen.vo.reveal.smart', praise: 'praiseThink',
  make: s => { const sa = s.boxes.map(([w, h, d]) => 2 * (w * h + w * d + h * d)), i = sa.indexOf(s.ask === 'most' ? Math.max(...sa) : Math.min(...sa)); return { want: 'b' + i, sa, tag: 'vo-smart-' + (s.ask || 'least') }; },
  draw(svg, item, tries) { item.boxes.forEach(([w, h, d], i) => { const cx = [288, 180, 72][i]; soBox(svg, w, h, d, { s: soFit(w, h, d, 84, 100), cx, cy: 112 }); htLab(svg, [cx, 196], [w, h, d].map(x => MS(String(x))).join(' × '), SO.ink, 14); badge(svg, cx, 222, i + 1);
      if (tries >= 3) htLab(helpG(svg), [cx, 30], voTxt(item.sa[i], 'cm2'), VO.hl, 14); }); return {}; },
  h2: async (item, ctx) => { ciRule(helpG(ctx.svg), 180, 28, labelText('soRule.sa'), SO.hl, 14); await sleep(FAST ? 10 : 250); },   /* الورق مساحة السطح */
  pick: item => choosePick(item.boxes.map((b, i) => ['b' + i, labelText('voBox.' + (i + 1)), '<i></i>', 'gen.vo.box.' + (i + 1)]), item.want),
  errOf: () => 'voMostPaper' });

/* ================= صورة التعليل (vopic): stack [w d h] أو box مع dims، وf حساب ================= */
function voReasonPic(g, P) { if (P.stack) voStack(g, P.stack[0], P.stack[1], P.stack[2], { cy: 100, W: 200, H: 120 }); else if (P.boxes) P.boxes.forEach(([w, h, d], i) => { const cx = [255, 105][i]; soBox(g, w, h, d, { s: soFit(w, h, d, 110, 100), cx, cy: 96 }); htLab(g, [cx, 172], [w, h, d].map(x => MS(String(x))).join(' × '), SO.ink, 15); });
  if (P.f) ciEq(g, 180, 200, P.f, P.bad ? SO.bad : SO.ink, 18); }

/* ================= المشاهد ================= */
const voSay = async (L, i) => { if (L[i]) await S(L[i]); };
/* د1 الإشعال: «تسع 50 قطعة!»: نملؤها فإذا هي 24 */
SCENES.voHook = async c => { const L = c.lines, svg = m3Stage(250); voStack(svg, 3, 2, 4, { layers: 0, cy: 124 }); const t = htLab(svg, [180, 30], MS('50') + '؟', VO.bad, 22); await voSay(L, 0); t.remove();
  const host = el('g', {}, svg); for (let n = 1; n <= 4; n++) { host.innerHTML = ''; voStack(host, 3, 2, 4, { layers: n, cy: 124 }); SFX.tick(); await sleep(FAST ? 2 : 400); } htLab(svg, [180, 30], MS('24'), VO.ok, 22); await voSay(L, 1); };
/* د1 الاكتشاف (أ): صندوق 3 × 2 × 4: كل طبقة 6، والطبقات 4، فالمجموع 24 */
SCENES.voFillShow = async c => { const L = c.lines, svg = m3Stage(250), host = el('g', {}, svg), cnt = el('text', { x: 310, y: 40, 'text-anchor': 'middle', 'font-size': 20, 'font-weight': 800, fill: VO.ok, 'pointer-events': 'none' }, svg);
  for (let n = 1; n <= 4; n++) { host.innerHTML = ''; voStack(host, 3, 2, 4, { layers: n, cy: 124, colOf: (i, j, k) => k === n - 1 ? '#9cc53b' : null }); cnt.textContent = MS(String(6 * n)); SFX.tick(); if (n === 1) await voSay(L, 0); else await sleep(FAST ? 2 : 500); } await voSay(L, 1); };
/* د1 الاكتشاف (ب): المساحة تعدّ مربعات على سطح، والحجم يعدّ مكعبات داخل مجسّم */
SCENES.voVsArea = async c => { const L = c.lines, svg = m3Stage(250), g = el('g', { 'pointer-events': 'none' }, svg);
  for (let i = 0; i < 3; i++) for (let j = 0; j < 2; j++) el('rect', { x: 40 + i * 30, y: 90 + j * 30, width: 30, height: 30, fill: '#cfe6f5', stroke: SO.edge, 'stroke-width': 1.6 }, g); htLab(g, [85, 176], MS('6') + ' ' + labelText('voSquares'), SO.edge, 15);
  await voSay(L, 0); voStack(g, 3, 2, 2, { cx: 260, cy: 128, s: 28 }); htLab(g, [260, 206], MS('12') + ' ' + labelText('voCubes'), VO.edge, 15); SFX.tick(); await voSay(L, 1); };
/* د1 الاكتشاف (ج): الطبقة = الطول × العرض، والطبقات = الارتفاع */
SCENES.voToMul = async c => { const L = c.lines, svg = m3Stage(250); voStack(svg, 3, 2, 4, { cy: 120, colOf: (i, j, k) => k % 2 ? '#9cc53b' : '#7fb6d9' }); ciEq(svg, 180, 230, '3 × 2 = 6 ، 6 × 4 = 24', VO.ok, 17); for (const l of L) await S(l); };
/* د2 الإشعال: «الحجم مجموع الأطوال!»: 5 + 4 + 3 = 12، والمكعبات 60 */
SCENES.voSumHook = async c => { const L = c.lines, svg = m3Stage(250); soBox(svg, 5, 3, 4, { s: 24, cy: 116, dims: true }); const t = ciEq(svg, 180, 232, '5 + 4 + 3 = 12', VO.bad, 18); await voSay(L, 0); t.remove();
  const host = el('g', {}, svg); voStack(host, 5, 4, 3, { s: 24, cy: 116 }); ciEq(svg, 180, 232, '5 × 4 × 3 = 60', VO.ok, 18); SFX.tick(); await voSay(L, 1); };
/* د2 الاكتشاف: 5 × 4 × 3 بطبقاته، ثم المكعب الوحدة سم ومتر، ثم المكعب 3 × 3 × 3 */
SCENES.voMulShow = async c => { const L = c.lines, svg = m3Stage(250); let g = el('g', {}, svg); voStack(g, 5, 4, 3, { s: 24, cy: 116, dims: true, colOf: (i, j, k) => k === 0 ? '#9cc53b' : null }); ciEq(g, 180, 232, '5 × 4 = 20 ، 20 × 3 = 60', VO.ok, 17); await voSay(L, 0);
  g.remove(); g = el('g', { 'pointer-events': 'none' }, svg); soBox(g, 1, 1, 1, { s: 40, cx: 90, cy: 120 }); htLab(g, [90, 190], `${MS('1')} ${labelText('rulCm')}`, SO.ink, 15); htLab(g, [90, 220], labelText('voCm3w'), VO.ok, 16);
  soBox(g, 1, 1, 1, { s: 110, cx: 250, cy: 110 }); htLab(g, [250, 200], `${MS('1')} ${labelText('lenM')}`, SO.ink, 15); htLab(g, [250, 228], labelText('voM3w'), VO.ok, 16); await voSay(L, 1);
  g.remove(); g = el('g', {}, svg); voStack(g, 3, 3, 3, { s: 30, cy: 116, dims: true }); ciEq(g, 180, 232, '3 × 3 × 3 = 27', VO.ok, 18); await voSay(L, 2); for (const l of L.slice(3)) await S(l); };
/* د3: علبتان حجم كلٍّ 24: 4 × 3 × 2 مساحتها 52، و6 × 4 × 1 مساحتها 68 */
SCENES.voSameShow = async c => { const L = c.lines, svg = m3Stage(250), g = el('g', { 'pointer-events': 'none' }, svg);
  const s = Math.min(soFit(4, 2, 3, 130, 110), soFit(6, 1, 4, 130, 110)); voStack(g, 4, 3, 2, { cx: 262, cy: 118, s }); voStack(g, 6, 4, 1, { cx: 98, cy: 118, s }); await voSay(L, 0);
  htLab(g, [262, 40], `24 ${labelText('voCm3')}`.replace('24', MS('24')), VO.ok, 15); htLab(g, [98, 40], `24 ${labelText('voCm3')}`.replace('24', MS('24')), VO.ok, 15); SFX.tick(); await voSay(L, 1);
  htLab(g, [262, 196], `52 ${labelText('arCm2')}`.replace('52', MS('52')), SO.edge, 15); htLab(g, [98, 196], `68 ${labelText('arCm2')}`.replace('68', MS('68')), SO.edge, 15); SFX.tick(); await voSay(L, 2); for (const l of L.slice(3)) await S(l); };
/* د4 المشروع «صندوق الكنز»: 120 سم مكعب بأبعاد مختلفة، ثم الجدول */
SCENES.treasureShow = async c => { const L = c.lines, svg = m3Stage(262);
  if (c.table) { const rows = [['voT.dims', '5 × 4 × 6 ، 10 × 3 × 4'], ['voT.vol', `120 ${labelText('voCm3')}`], ['voT.sa', `148 ${labelText('arCm2')}`]], g = el('g', { 'pointer-events': 'none' }, svg);
    rows.forEach(([k, v], i) => { const y = 40 + i * 64; el('rect', { x: 28, y, width: 304, height: 54, rx: 12, fill: i % 2 ? '#f6eccf' : '#fff', stroke: SO.grid, 'stroke-width': 2 }, g); const a = el('text', { x: 318, y: y + 33, 'text-anchor': 'start', 'font-size': 15, 'font-weight': 800, fill: SO.ink, direction: 'rtl' }, g); a.textContent = labelText(k); const b = el('text', { x: 42, y: y + 33, 'text-anchor': 'end', 'font-size': 14, 'font-weight': 800, fill: SO.ok, direction: 'rtl' }, g); b.textContent = MS(v); });
    for (const l of L) await S(l); return; }
  let g = el('g', { 'pointer-events': 'none' }, svg); [[5, 6, 4, 288], [10, 4, 3, 180], [4, 5, 6, 72]].forEach(([w, h, d, cx]) => { soBox(g, w, h, d, { s: soFit(w, h, d, 84, 110), cx, cy: 120, dims: false }); htLab(g, [cx, 206], [w, d, h].map(x => MS(String(x))).join(' × '), SO.ink, 14); });
  await voSay(L, 0); htLab(g, [180, 30], `120 ${labelText('voCm3')}`.replace('120', MS('120')), VO.ok, 18); SFX.tick(); await voSay(L, 1);
  g.remove(); g = el('g', { 'pointer-events': 'none' }, svg); soBox(g, 5, 6, 4, { s: 22, cy: 116, dims: true }); ciEq(g, 180, 236, '2 × (20 + 30 + 24) = 148', VO.ok, 17); await voSay(L, 2); };
WRAP_ART.volArt = svg => { voStack(svg, 4, 3, 3, { cx: 180, cy: 116, s: 22 }); };
