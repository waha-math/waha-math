/* =====================================================================
   S3-U2 «أقطار الرباعيات» (المرحلة 3، نوفمبر 2026)
   الرباعي من قطريه («عودان ومسمار»): القطر أ ج طوله p، والقطر ب د طوله r، يلتقيان في م على الكسر s من أ ج وu من ب د (لا q ولا t: هما سؤال البند ونوعه)، والزاوية بينهما th.
   د1 تساوي القطرين (C316) · د2 التقاطع في المنتصف (C331) · د3 التعامد وقطر المحور (C332) · د4 التعريف الشمولي (C333) وصانع الرباعيات بالأقطار
   ===================================================================== */
const DQ = { ink: '#33454c', fill: '#eef4f8', d1: '#3d7cc0', d2: '#e07b39', m: '#c8392d', ok: '#2f9d6b' };
/* الأنواع بقطريها (المرجع S3-U2): أطوال بالسنتيمتر */
const DQ_K = {
  square: { p: 8, r: 8, s: .5, u: .5, th: 90, rot: 45 }, rect: { p: 10, r: 10, s: .5, u: .5, th: 74, lv: 1 }, para: { p: 8.6, r: 5, s: .5, u: .5, th: 62, lv: 1 },
  rhom: { p: 12, r: 7.2, s: .5, u: .5, th: 90 }, kite: { p: 10, r: 6, s: .4, u: .5, th: 90, rot: 90 }, isoTrap: { p: 10, r: 10, s: .3, u: .3, th: 76, lv: 1 },
  trap: { p: 10, r: 7, s: .36, u: .36, th: 64, lv: 1 }, other: { p: 9, r: 6, s: .3, u: .62, th: 70 } };
/* الجداول الثلاثة: دائماً (y) · لا (n) · ليس دائماً (s)؛ والتقاطع: كلاهما (both) · أحدهما (one) · لا أيّهما (none) */
const DQ_EQ = { square: 'y', rect: 'y', isoTrap: 'y', para: 'n', rhom: 'n', trap: 'n', kite: 's' };
const DQ_MID = { square: 'both', rect: 'both', para: 'both', rhom: 'both', kite: 'one', isoTrap: 'none', trap: 'none' };
const DQ_PERP = { square: 'y', rhom: 'y', kite: 'y', rect: 'n', para: 'n', isoTrap: 's' };
const dqSpec = spec => ({ ...(DQ_K[spec.k] || DQ_K.other), ...spec });
function dqPoints(D) { const r = (D.rot || 0) * Math.PI / 180, u = [Math.cos(r), Math.sin(r)], w = [Math.cos(r + D.th * Math.PI / 180), Math.sin(r + D.th * Math.PI / 180)];
  const A = [-D.s * D.p * u[0], -D.s * D.p * u[1]], C = [(1 - D.s) * D.p * u[0], (1 - D.s) * D.p * u[1]], B = [-D.u * D.r * w[0], -D.u * D.r * w[1]], Dd = [(1 - D.u) * D.r * w[0], (1 - D.u) * D.r * w[1]];
  return [A, B, C, Dd]; }
/* الرسم في صندوق: box [cx، cy، W، H]؛ o: diag (القطران)، lens (طولاهما)، parts (أطوال الأجزاء)، ticks، right، labels (أ ب ج د)، fill */
function dqDraw(parent, spec, box = [180, 118, 230, 150], o = {}) { const D = dqSpec(spec), P0 = dqPoints(D), lv = (o.level ?? D.lv) ? -Math.atan2(P0[1][1] - P0[0][1], P0[1][0] - P0[0][0]) : 0, P = P0.map(([x, y]) => [x * Math.cos(lv) - y * Math.sin(lv), x * Math.sin(lv) + y * Math.cos(lv)]), xs = P.map(p => p[0]), ys = P.map(p => p[1]), bw = Math.max(...xs) - Math.min(...xs), bh = Math.max(...ys) - Math.min(...ys);
  const k = Math.min(box[2] / bw, box[3] / bh, o.maxK || 26), ox = box[0] - (Math.max(...xs) + Math.min(...xs)) / 2 * k, oy = box[1] - (Math.max(...ys) + Math.min(...ys)) / 2 * k, X = p => [ox + p[0] * k, oy + p[1] * k];
  const Q = P.map(X), M = X([0, 0]), g = el('g', { 'data-dq': D.k || 'q' }, parent);
  el('polygon', { points: polyStr(Q), fill: o.fill || DQ.fill, stroke: DQ.ink, 'stroke-width': 3, 'stroke-linejoin': 'round' }, g);
  const dg = el('g', { 'pointer-events': 'none' }, g);
  if (o.diag !== false) { geoLine(dg, Q[0][0], Q[0][1], Q[2][0], Q[2][1], { color: DQ.d1, w: 3 }); geoLine(dg, Q[1][0], Q[1][1], Q[3][0], Q[3][1], { color: DQ.d2, w: 3 }); el('circle', { cx: M[0], cy: M[1], r: 4.5, fill: DQ.m, stroke: '#fff', 'stroke-width': 1.5 }, dg); }
  const lab = (a, b, txt, col, side = 1) => { const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, d = dirOf(a, b) + 90 * side, p = angP([mx, my], d, 15), t = el('text', { x: p[0], y: p[1] + 6, 'text-anchor': 'middle', 'font-size': 15, 'font-weight': 800, fill: col, stroke: '#fff', 'stroke-width': 4, 'paint-order': 'stroke', direction: 'rtl' }, dg); t.textContent = txt; return t; };
  if (o.lens) { lab(M, Q[2], lenTxt([D.p, 'dcm']), DQ.d1, 1); lab(Q[1], M, lenTxt([D.r, 'dcm']), DQ.d2, 1); }   /* في ربعين متقابلين، فلا يتراكبان */
  if (o.parts) { const r1 = v => Math.round(v * 10) / 10; lab(Q[0], M, decFmt(r1(D.s * D.p), 1), DQ.d1, 1); lab(M, Q[2], decFmt(r1((1 - D.s) * D.p), 1), DQ.d1, 1); if (o.parts !== 'p') { lab(Q[1], M, decFmt(r1(D.u * D.r), 1), DQ.d2, -1); lab(M, Q[3], decFmt(r1((1 - D.u) * D.r), 1), DQ.d2, -1); } }   /* parts: 'p' أجزاء القطر الأزرق وحده (ميزان الأقطار) */
  if (o.ticks) { const tick = (a, b, n, col) => { const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2, d = dirOf(a, b); for (let i = 0; i < n; i++) { const c = angP([mx, my], d, (i - (n - 1) / 2) * 5), p1 = angP(c, d + 90, 6), p2 = angP(c, d - 90, 6); geoLine(dg, p1[0], p1[1], p2[0], p2[1], { color: col, w: 2.2 }); } };
    if (Math.abs(D.s - .5) < .01) { tick(Q[0], M, 1, DQ.d1); tick(M, Q[2], 1, DQ.d1); } if (Math.abs(D.u - .5) < .01) { tick(Q[1], M, 2, DQ.d2); tick(M, Q[3], 2, DQ.d2); } }
  if (o.right && Math.abs(D.th - 90) < .5) { const a = angP(M, dirOf(M, Q[2]), 11), b = angP(M, dirOf(M, Q[3]), 11), c = [a[0] + b[0] - M[0], a[1] + b[1] - M[1]]; el('path', { d: `M${a[0]} ${a[1]} L${c[0]} ${c[1]} L${b[0]} ${b[1]}`, fill: 'none', stroke: DQ.ink, 'stroke-width': 2 }, dg); }
  if (o.labels) ['a', 'b', 'j', 'd'].forEach((n, i) => { const p = angP(Q[i], dirOf(M, Q[i]), 16), t = el('text', { x: p[0], y: p[1] + 6, 'text-anchor': 'middle', 'font-size': 17, 'font-weight': 800, fill: DQ.ink }, g); t.textContent = LTR[n]; });
  return { g, dg, Q, M, D, k }; }
const dqOpt = (grp, k) => [k, labelText('dq.' + grp + '.' + k), '<i></i>', 'gen.dq.' + grp + '.' + k];
const dqLen = v => Number.isInteger(v) ? [v, 'cm'] : [v, 'dcm'];
const dqName = k => k === 'isoTrap' ? ['isoTrap', labelText('dqIsoTrap'), '<i></i>', 'gen.dq.n.isoTrap'] : plyOpt('q', k);

/* ================= ① خاصية القطرين في نوع (C316 وC331 وC332): k، prop eq | mid | perp؛ الجواب من جدول المرجع ================= */
ITEM.diagProp = {
  make(spec) { const T = spec.prop === 'eq' ? DQ_EQ : spec.prop === 'mid' ? DQ_MID : DQ_PERP, want = T[spec.k]; /*T*/if (TESTHOOK && !want) testBug('diagProp: لا جواب لهذا النوع ' + spec.k + ' ' + spec.prop);/*/T*/ return { ...spec, want, tag: 'dq-' + spec.prop }; },
  async ask(item, mode, tries) { const svg = m3Stage(236), R = dqDraw(svg, item, [180, 112, 220, 150], { lens: tries >= 3 && item.prop === 'eq', ticks: tries >= 3 && item.prop === 'mid', right: tries >= 3 && item.prop === 'perp' });
    const nm = el('text', { x: 180, y: 214, 'text-anchor': 'middle', 'font-size': 17, 'font-weight': 800, fill: DQ.ink, direction: 'rtl' }, svg); nm.textContent = labelText(item.k === 'isoTrap' ? 'dqIsoTrap' : 'ply.q.' + item.k);
    if (tries >= 3) await S('gen.dq.together.' + item.prop); else if (item.q) await S(item.q); else { await S(item.k === 'isoTrap' ? 'gen.dq.n.isoTrap' : 'gen.poly.q.' + item.k, { noGap: true }); await S('gen.dq.q.' + item.prop, { append: true }); }
    const opts = item.prop === 'mid' ? ['both', 'one', 'none'].map(k => dqOpt('mid', k)) : ['y', 'n', 's'].map(k => dqOpt('al', k));
    const k = await choosePick(opts, item.want); return { ans: k, ctx: { svg, R } }; },
  judge(item, k) { if (k === item.want) return { ok: true }; return { ok: false, err: (k === 'n' && item.want === 's') || (k === 's' && item.want === 'n') ? 'dqNotAlways' : item.prop === 'eq' ? 'dqEqWrong' : item.prop === 'mid' ? 'dqMidWrong' : 'dqPerpWrong' }; },
  onOk() { SFX.good(); }, onWrong() { SFX.soft(); },
  async hint2(item, r) { if (r && r.ctx && r.ctx.svg) { const m = helpG(r.ctx.svg); dqDraw(m, item, [180, 112, 220, 150], { fill: 'none', diag: true, lens: item.prop === 'eq', ticks: item.prop === 'mid', right: item.prop === 'perp' }); } await S('gen.dq.hint.' + item.prop); }, async together() {},
  async reveal(item) { await S('gen.dq.reveal.' + item.prop + '.' + item.want); },
  praise: () => 'praiseThink', twin(item) { return item.twin || null; },
};

/* ================= ② «نجّار فوضى» (C316، اللعبة): إطار ضلعاه المتقابلان a وb، وقطراه p وq مقيسان؛ مستطيل أم مائل؟ ================= */
ITEM.diagJudge = {
  make(spec) { const a = spec.a || 8, b = spec.b || 6, c = (spec.p * spec.p / 4 + spec.r * spec.r / 4 - a * a) / (spec.p * spec.r / 2), th = Math.acos(Math.max(-1, Math.min(1, c))) * 180 / Math.PI;
    /*T*/if (TESTHOOK && Math.abs(spec.p * spec.p + spec.r * spec.r - 2 * (a * a + b * b)) > 2) testBug('diagJudge: القطران لا يناسبان الأضلاع');/*/T*/
    return { ...spec, a, b, th, s: .5, u: .5, want: Math.abs(spec.p - spec.r) < .2 ? 'rect' : 'lean', tag: 'dq-judge' }; },
  async ask(item, mode, tries) { const svg = m3Stage(236), R = dqDraw(svg, { ...item, k: 'para' }, [180, 112, 220, 140], { lens: true, level: true }); const [A, B, C, D] = R.Q;
    const sl = (p1, p2, v) => { const mx = (p1[0] + p2[0]) / 2, my = (p1[1] + p2[1]) / 2, d = dirOf(R.M, [mx, my]), p = angP([mx, my], d, 16), t = el('text', { x: p[0], y: p[1] + 5, 'text-anchor': 'middle', 'font-size': 14, 'font-weight': 700, fill: '#6b7f88', direction: 'rtl' }, svg); t.textContent = lenTxt([v, 'cm']); };
    sl(A, B, item.a); sl(C, D, item.a); sl(B, C, item.b); sl(D, A, item.b);
    if (tries >= 3) { hintCard(svg, 180, 214, labelText('dqRectEq')); await S('gen.dq.together.judge'); } else await S(item.q || 'gen.dq.q.judge');
    const k = await choosePick([['rect', labelText('ply.q.rect'), '<i></i>', 'gen.poly.q.rect'], ['lean', labelText('dqLean'), '<i></i>', 'gen.dq.lean']], item.want); return { ans: k, ctx: { svg, R } }; },
  judge(item, k) { return k === item.want ? { ok: true } : { ok: false, err: item.want === 'lean' ? 'dqSidesOnly' : 'dqEqMissed' }; },
  onOk() { SFX.good(); }, onWrong() { SFX.soft(); },
  async hint2(item, r) { if (r && r.ctx && r.ctx.svg) hintCard(r.ctx.svg, 180, 214, labelText('dqCmpDiag')); await S('gen.dq.hint.judge'); }, async together() {},
  async reveal(item) { await S(item.want === 'rect' ? 'gen.dq.reveal.rect' : 'gen.dq.reveal.lean'); },
  praise: () => 'praiseMeasure', twin(item) { return item.twin || null; },
};

/* ================= ③ نصف القطر (C331): القطر p يقطعه الآخر في منتصفه؛ كم كل جزء؟ (بالتحويل إلى ملم، S3-U0) ================= */
ITEM.diagHalf = {
  make(spec) { const mm = Math.round(spec.p * 10); /*T*/if (TESTHOOK && mm % 2) testBug('diagHalf: طول بملّيمترات فردية ' + spec.p);/*/T*/
    const want = [mm / 20, 'dcm'], c = Math.floor(spec.p), r = mm % 10, dig = [Math.floor(c / 2) + Math.floor(r / 2) / 10, 'dcm'], whole = [spec.p, 'dcm'], near = [mm / 20 + .5, 'dcm'];
    const wrong = lenKey(dig) !== lenKey(want) ? dig : near; return { ...spec, want: lenKey(want), vals: [want, wrong, whole], errs: { [lenKey(wrong)]: wrong === dig ? 'dqHalfDigits' : 'dqHalfOff', [lenKey(whole)]: 'dqHalfNone' }, tag: 'dq-half' }; },
  async ask(item, mode, tries) { const svg = m3Stage(236), R = dqDraw(svg, { k: item.k || 'para', p: item.p, r: item.r || DQ_K[item.k || 'para'].r }, [180, 108, 220, 140], { ticks: true }); const [A, , C] = R.Q;
    const t = el('text', { x: 180, y: 206, 'text-anchor': 'middle', 'font-size': 17, 'font-weight': 800, fill: DQ.d1, direction: 'rtl' }, svg); t.textContent = labelText('dqBlue') + ' ' + lenTxt([item.p, 'dcm']);
    if (tries >= 3) { hintCard(svg, 180, 30, `${Math.round(item.p * 10)} ÷ 2 (${U_('mm')})`); await S('gen.dq.together.half'); } else await S(item.q || 'gen.dq.q.half');
    const k = await choosePick(shuffle(lenOpts(item.vals)), item.want); return { ans: k, ctx: { svg, R } }; },
  judge(item, k) { return k === item.want ? { ok: true } : { ok: false, err: item.errs[k] || 'dqHalfOff' }; },
  onOk() { SFX.good(); }, onWrong() { SFX.soft(); },
  async hint2(item, r) { if (r && r.ctx && r.ctx.svg) hintCard(r.ctx.svg, 180, 30, `${lenTxt([item.p, 'dcm'])} = ${Math.round(item.p * 10)} ${U_('mm')}`); await S('gen.dq.hint.half'); }, async together() {},
  async reveal(item) { await S('gen.dec.reveal.conv', { noGap: true }); await S(lenLn(item.vals[0]), { append: true }); },
  praise: () => 'praiseThink', twin(item) { return item.twin || null; },
};

/* ---------- ضبط بأزرار (مشترك للعبتين): زرّان بسهمين، ثم «تمّ» ---------- */
function dqSteps(labels, onStep) { const box = document.createElement('div'); box.className = 'choices icons'; box.style.direction = 'ltr'; $('#stage').appendChild(box);
  const arrow = left => '<svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true" style="vertical-align:middle"><path d="' + (left ? 'M16 2 L4 10 L16 18Z' : 'M4 2 L16 10 L4 18Z') + '" fill="currentColor"/></svg>';
  const btns = [-1, 1].map((d, i) => { const b = document.createElement('button'); b.className = 'pick'; b.style.direction = 'ltr'; b.innerHTML = `<span style="display:inline-flex;align-items:center;gap:6px">${d < 0 ? arrow(true) : ''}<span>${esc(labelText(labels[i]))}</span>${d > 0 ? arrow(false) : ''}</span>`; b.setAttribute('aria-label', plain(labelText(labels[i])));
    b.onclick = () => { if (onStep(d)) SFX.tick(); }; box.appendChild(b); return b; });
  return { box, btns, off() { btns.forEach(b => b.onclick = null); box.remove(); } }; }

/* ================= ④ «ميزان الأقطار» (C331، اللعبة): يُنقل التقاطع على القطر الأزرق حتى منتصفه (والبرتقالي منصَّف)، فيصير متوازي أضلاع ================= */
ITEM.diagBalance = {
  make(spec) { return { ...spec, want: 5, tag: 'dq-balance' }; },
  async ask(item, mode, tries) { const svg = m3Stage(236); let s = item.s0 ?? 2, R = null; const draw = () => { if (R) R.g.remove(); R = dqDraw(svg, { p: item.p, r: item.r, s: s / 10, u: .5, th: item.th || 64, rot: item.rot || 0 }, [180, 108, 250, 170], { parts: 'p', ticks: true, maxK: 24 }); };
    draw(); if (tries >= 3) { s = s < 5 ? 4 : 6; draw(); await S('gen.dq.together.balance'); } else await S(item.q || 'gen.dq.q.balance');
    const St = dqSteps(['dqMoveL', 'dqMoveR'], d => { const n = Math.max(1, Math.min(9, s + d)); if (n === s) return false; s = n; draw(); return true; });
    /*T*/window.__dqS = () => s;/*/T*/
    AUTO({ kind: 'dqBal', ok: () => { s = 5; draw(); rulDoneBtn().click(); }, wrong: () => { s = s === 4 ? 3 : 4; draw(); rulDoneBtn().click(); } });
    await rulDone(() => St.off()); return { ans: s, ctx: { svg, R: () => R, set: v => { s = v; draw(); } } }; },
  judge(item, k) { return k === 5 ? { ok: true } : { ok: false, err: 'dqMidMissed' }; },
  onOk(item, r) { SFX.good(); }, onWrong() { SFX.soft(); },
  async hint2(item, r) { await S('gen.dq.hint.balance'); }, async together() {},
  async reveal(item, r) { if (r && r.ctx && r.ctx.set) r.ctx.set(5); await S('gen.dq.reveal.balance'); },
  praise: () => 'praiseMeasure', twin(item) { return item.twin || null; },
};

/* ================= ⑤ «حارس التقاطع» (C332، اللعبة): تُدار الزاوية بين القطرين بعشر درجات حتى تنطبق ورقة الزاوية القائمة؛ s 0.5 (معيّن) أو 0.4 (طائرة) ================= */
ITEM.diagPerp = {
  make(spec) { return { ...spec, want: 90, tag: 'dq-perp' }; },
  async ask(item, mode, tries) { const svg = m3Stage(236); let th = item.th0 ?? 50, R = null, paper = null;
    const draw = () => { if (R) R.g.remove(); R = dqDraw(svg, { p: item.p, r: item.r, s: item.s ?? .5, u: .5, th, rot: item.rot ?? 90 }, [180, 112, 230, 160], { maxK: 14 });
      if (paper) paper.remove(); paper = el('g', { 'pointer-events': 'none', opacity: .85 }, svg); const M = R.M, a = dirOf(M, R.Q[2]); el('path', { d: `M${M[0]} ${M[1]} L${angP(M, a, 26)} L${angP(angP(M, a, 26), a + 90, 26)} L${angP(M, a + 90, 26)} Z`, fill: '#fdf2c4', stroke: '#c9a54a', 'stroke-width': 2 }, paper); };   /* ورقة الزاوية القائمة على القطر الأزرق */
    draw(); if (tries >= 3) { th = th < 90 ? 80 : 100; draw(); await S('gen.dq.together.perp2'); } else await S(item.q || 'gen.dq.q.perp2');
    const St = dqSteps(['dqTurnL', 'dqTurnR'], d => { const n = Math.max(30, Math.min(150, th + 10 * d)); if (n === th) return false; th = n; draw(); return true; });
    /*T*/window.__dqTh = () => th;/*/T*/
    AUTO({ kind: 'dqPerp', ok: () => { th = 90; draw(); rulDoneBtn().click(); }, wrong: () => { th = 80; draw(); rulDoneBtn().click(); } });
    await rulDone(() => St.off()); return { ans: th, ctx: { svg, set: v => { th = v; draw(); } } }; },
  judge(item, k) { return k === 90 ? { ok: true } : { ok: false, err: 'dqPerpMissed' }; },
  onOk() { SFX.good(); }, onWrong() { SFX.soft(); },
  async hint2() { await S('gen.dq.hint.perp2'); }, async together() {},
  async reveal(item, r) { if (r && r.ctx && r.ctx.set) r.ctx.set(90); await S(item.s && item.s !== .5 ? 'gen.dq.reveal.perpKite' : 'gen.dq.reveal.perpRhom'); },
  praise: () => 'praiseMeasure', twin(item) { return item.twin || null; },
};

/* ================= ⑥ القطر يقسم زاوية المعيّن (C332، استدعاء C301): ang زاوية الرأس؛ ask half (نصفها) | other (الزاوية المجاورة) ================= */
ITEM.rhombAngle = { ...numItem,
  make(spec) { const want = spec.ask === 'half' ? spec.ang / 2 : 180 - spec.ang, errs = spec.ask === 'half' ? [spec.ang, 90 - spec.ang / 2, 180 - spec.ang] : [spec.ang, 90 - spec.ang / 2, (180 - spec.ang) / 2];
    return { ...spec, want, nums: rankMix(want, [...errs, want + 10, want - 10].filter(v => v > 0 && v < 180 && v % 5 === 0 && v !== want), 5, 175), tag: 'rhomb-' + spec.ask }; },
  async ask(item, mode, tries) { const svg = m3Stage(236), h = Math.tan(item.ang / 2 * Math.PI / 180), p = 10, r = 2 * (p / 2) * h, R = dqDraw(svg, { p, r, s: .5, u: .5, th: 90 }, [180, 108, 230, 150], { right: true }), [A, B, C, D] = R.Q;
    triCorner(R.g, A, B, D, item.ang, TRI_COL[0], { label: false }); { const o = angP(A, dirOf(A, C) + 180, 26); degText(R.g, o[0], o[1] + 6, item.ang, { size: 16, color: TRI_COL[0] }); }   /* الزاوية المعلومة خارج رأسها، فلا تزاحم السؤال */
    if (item.ask === 'half') triCorner(R.g, A, B, C, null, TRI_COL[2], { r: 44 }); else triCorner(R.g, B, C, A, null, TRI_COL[2]);
    if (tries >= 3) { const m = helpG(svg), t = el('text', { x: 180, y: 216, 'text-anchor': 'middle', 'font-size': 17, 'font-weight': 800, fill: css('--think'), direction: 'ltr' }, m); t.textContent = item.ask === 'half' ? `${item.ang} ÷ 2 = ؟` : `180 − ${item.ang} = ؟`; await S('gen.dq.together.rhomb'); }
    else await S(item.q || (item.ask === 'half' ? 'gen.dq.q.rhombHalf' : 'gen.dq.q.rhombOther'));
    const np = numberPick(shuffle(item.nums), item.want, { west: true, word: degw }); return { ans: await np.p, ctx: { svg, R } }; },
  judge(item, k) { return k === item.want ? { ok: true } : { ok: false, err: k === item.ang ? 'rhombSame' : 'rhombOff' }; },
  async hint2(item, r) { await S(item.ask === 'half' ? 'gen.dq.hint.rhombHalf' : 'gen.dq.hint.rhombOther'); }, async together() {},
  async reveal(item) { await S('gen.as.reveal.missing', { noGap: true }); await S(degw(item.want), { append: true }); },
  praise: () => 'praiseThink', twin(item) { return item.twin || null; },
};

/* ================= ⑦ «صانع الرباعيات بالأقطار» (C333 واستدعاء C316 وC331 وC332): عودان بطوليهما ووضع تقاطعهما؛ ما الرباعي؟ ================= */
const DQ_MAKE = { para: { p: 10, r: 6, s: .5, u: .5, th: 60 }, rhom: { p: 10, r: 6, s: .5, u: .5, th: 90 }, rect: { p: 10, r: 10, s: .5, u: .5, th: 60 }, square: { p: 10, r: 10, s: .5, u: .5, th: 90, rot: 45 }, kite: { p: 10, r: 6, s: .4, u: .5, th: 90, rot: 90 }, isoTrap: { p: 10, r: 10, s: .3, u: .3, th: 76, rot: 52 } };
ITEM.diagMake = {
  make(spec) { return { ...DQ_MAKE[spec.k], ...spec, want: spec.k, tag: 'dq-make' }; },
  async ask(item, mode, tries) { const svg = m3Stage(236), R = dqDraw(svg, item, [180, 104, 220, 150], { parts: true, right: true, ticks: true, fill: tries >= 3 ? DQ.fill : 'none' });
    if (tries < 3) R.g.querySelector('polygon').setAttribute('stroke', 'none');   /* العودان وحدهما: الأضلاع تُرى في الحلّ المشترك */
    const t = el('text', { x: 180, y: 214, 'text-anchor': 'middle', 'font-size': 16, 'font-weight': 800, fill: DQ.ink, direction: 'rtl' }, svg); t.textContent = labelText('dqSticks') + ' ' + lenTxt(dqLen(item.p)) + ' ' + labelText('dqAnd') + ' ' + lenTxt(dqLen(item.r));
    await S(tries >= 3 ? 'gen.dq.together.make' : item.q || 'gen.dq.q.make');
    const k = await choosePick(shuffle(item.pick).map(dqName), item.want); return { ans: k, ctx: { svg, R } }; },
  judge(item, k) { return k === item.want ? { ok: true } : { ok: false, err: 'dqMakeWrong' }; },
  onOk() { SFX.good(); }, onWrong() { SFX.soft(); },
  async hint2(item, r) { await S('gen.dq.hint.make'); }, async together() {},
  async reveal(item, r) { if (r && r.ctx && r.ctx.R) { const p = r.ctx.R.g.querySelector('polygon'); p.setAttribute('stroke', DQ.ink); p.setAttribute('fill', DQ.fill); } await S(dqName(item.want)[3]); },
  praise: () => 'praiseThink', twin(item) { return item.twin || null; },
};

/* ================= ⑧ أسماء الشكل بالتعريف الشمولي (C333، إتقان C158): كم اسماً؟ (مربع 7، معيّن 5، مستطيل 4، متوازي أضلاع 3) ================= */
const DQ_NAMES = { square: 7, rhom: 5, rect: 4, para: 3 };
ITEM.quadNames = { ...numItem,
  make(spec) { const want = DQ_NAMES[spec.k], old = { square: 4, rhom: 2, rect: 3, para: 2 }[spec.k]; return { ...spec, want, old, nums: rankMix(want, [old, want + 1, want - 1], 1, 9), tag: 'quad-names' }; },
  async ask(item, mode, tries) { const svg = m3Stage(236); polyAt(svg, POLYS[{ square: 'qSq', rhom: 'qRhom', rect: 'qRect', para: 'qPara' }[item.k]], [180, 104], {}); const nm = el('text', { x: 180, y: 206, 'text-anchor': 'middle', 'font-size': 17, 'font-weight': 800, fill: DQ.ink, direction: 'rtl' }, svg); nm.textContent = labelText('ply.q.' + item.k);
    if (tries >= 3) { await S('gen.dq.together.names'); } else { await S(item.q || 'gen.dq.q.names', { noGap: true }); await S('gen.poly.q.' + item.k, { append: true }); }
    const np = numberPick(shuffle(item.nums), item.want); return { ans: await np.p, ctx: { svg } }; },
  judge(item, k) { return k === item.want ? { ok: true } : { ok: false, err: k === item.old ? 'dqNamesOld' : 'dqNamesOff' }; },
  async hint2(item) { await S('gen.dq.hint.names'); }, async together() {},
  async reveal(item) { await S('gen.dq.names.' + item.k); },
  praise: () => 'praiseThink', twin(item) { return item.twin || null; },
};

/* ================= ⑨ هل هو أيضاً…؟ (C333): k الشكل، as الاسم الأعمّ (kite | trap | rect)؛ نعم أم لا ================= */
const DQ_IS = { 'rhom.kite': 'yes', 'square.kite': 'yes', 'rect.kite': 'no', 'para.trap': 'yes', 'rect.trap': 'yes', 'square.trap': 'yes', 'rhom.trap': 'yes', 'kite.trap': 'no', 'square.rect': 'yes', 'rhom.rect': 'no', 'para.kite': 'no' };
ITEM.quadIs = {
  make(spec) { const want = DQ_IS[spec.k + '.' + spec.as]; /*T*/if (TESTHOOK && !want) testBug('quadIs: لا جواب ' + spec.k + '.' + spec.as);/*/T*/ return { ...spec, want, tag: 'quad-is-' + want }; },
  async ask(item, mode, tries) { const svg = m3Stage(236); polyAt(svg, POLYS[{ square: 'qSq', rhom: 'qRhom', rect: 'qRect', para: 'qPara', kite: 'qKite' }[item.k]], [180, 100], { marks: tries >= 3 ? true : item.marks }); const nm = el('text', { x: 180, y: 206, 'text-anchor': 'middle', 'font-size': 17, 'font-weight': 800, fill: DQ.ink, direction: 'rtl' }, svg); nm.textContent = labelText('ply.q.' + item.k);
    if (tries >= 3) { hintCard(svg, 180, 30, labelText('dqDef.' + item.as)); await S('gen.dq.together.is'); } else await S(item.q || 'gen.dq.q.is.' + item.k + '.' + item.as);
    const k = await choosePick([['yes', labelText('yes'), PICKICON.yes, 'gen.opt.yes'], ['no', labelText('no'), PICKICON.no, 'gen.opt.no']], item.want); return { ans: k, ctx: { svg } }; },
  judge(item, k) { return k === item.want ? { ok: true } : { ok: false, err: item.want === 'yes' ? 'dqInclNo' : 'dqInclYes' }; },
  onOk() { SFX.good(); }, onWrong() { SFX.soft(); },
  async hint2(item, r) { if (r && r.ctx && r.ctx.svg) hintCard(r.ctx.svg, 180, 30, labelText('dqDef.' + item.as)); await S('gen.dq.hint.is.' + item.as); }, async together() {},
  async reveal(item) { await S('gen.dq.why.' + item.k + '.' + item.as); },
  praise: () => 'praiseThink', twin(item) { return item.twin || null; },
};

/* ================= المشاهد ================= */
/* الإشعال (د1): إطار فوضى 8 × 6 مستطيل، تدفعه فيميل */
SCENES.frameHook = async c => { const L = c.lines, svg = m3Stage(250), fr = p => ITEM.diagJudge.make({ p, r: Math.sqrt(200 - p * p) }); let R = dqDraw(svg, fr(10), [180, 112, 220, 150], { diag: false, level: true }); await S(L[0]);
  const fz = chaosAt(svg, 318, 40, .4); chaosGiggle(fz); for (const p of [10.5, 11, 11.5, 12]) { await sleep(FAST ? 5 : 140); R.g.remove(); R = dqDraw(svg, fr(p), [180, 112, 220, 150], { diag: false, level: true }); }
  SFX.tick(); for (const l of L.slice(1)) await S(l); };
/* الاكتشاف (د1): فحص النجّار، ثم طيّ المستطيل على محوره فينطبق القطر على الآخر */
SCENES.carpenterShow = async c => { const L = c.lines, svg = m3Stage(262); let R = dqDraw(svg, ITEM.diagJudge.make({ p: 10, r: 10 }), [180, 112, 220, 150], { lens: true, level: true }); await S(L[0]);
  R.g.remove(); R = dqDraw(svg, ITEM.diagJudge.make({ p: 12, r: 7.5 }), [180, 112, 220, 150], { lens: true, level: true }); SFX.tick(); await S(L[1]);
  R.g.remove(); R = dqDraw(svg, ITEM.diagJudge.make({ p: 10, r: 10 }), [180, 112, 220, 150], { level: true }); const [A, B, C, D] = R.Q, mx = (A[0] + B[0]) / 2;
  geoLine(svg, mx, Math.min(A[1], B[1]) - 14, mx, Math.max(C[1], D[1]) + 14, { color: '#8e6bbf', w: 2.6, dash: '6 5' }); await S(L[2]);
  const dl = el('line', { x1: A[0], y1: A[1], x2: C[0], y2: C[1], stroke: DQ.d1, 'stroke-width': 5, opacity: .8 }, svg);
  await anim(dl, [{ transform: 'scale(1,1)' }, { transform: `translate(${2 * mx}px,0px) scale(-1,1)` }], { duration: FAST ? 10 : 900, fill: 'forwards' }).done; SFX.good();
  for (const l of L.slice(3)) await S(l); };
/* الاكتشاف (د2): متوازي الأضلاع يُدار نصف دورة حول التقاطع فينطبق؛ ثم الطائرة (أحدهما فقط)، وشبه المنحرف (لا أيّهما) */
SCENES.midShow = async c => { const L = c.lines, svg = m3Stage(262); let R = dqDraw(svg, { k: 'para' }, [180, 112, 220, 150], { parts: true, ticks: true }); await S(L[0]);
  const ghost = el('polygon', { points: polyStr(R.Q), fill: 'none', stroke: DQ.ok, 'stroke-width': 3, 'stroke-dasharray': '7 5', 'pointer-events': 'none' }, svg);
  await anim(ghost, [{ transform: `rotate(0deg)`, transformOrigin: `${R.M[0]}px ${R.M[1]}px` }, { transform: `rotate(180deg)`, transformOrigin: `${R.M[0]}px ${R.M[1]}px` }], { duration: FAST ? 10 : 1400, fill: 'forwards' }).done; SFX.good(); await S(L[1]); ghost.remove();
  R.g.remove(); R = dqDraw(svg, { k: 'kite' }, [180, 112, 220, 150], { parts: true, ticks: true }); SFX.tick(); await S(L[2]);
  R.g.remove(); R = dqDraw(svg, { k: 'isoTrap' }, [180, 112, 220, 150], { parts: true }); SFX.tick(); for (const l of L.slice(3)) await S(l); };
/* الاكتشاف (د3): ورقة الزاوية القائمة عند التقاطع: المعيّن والطائرة نعم، والمستطيل لا؛ ثم طيّ المعيّن على قطره يقسم الزاوية */
SCENES.dqPerpShow = async c => { const L = c.lines, svg = m3Stage(262), paper = (R, ok) => { const M = R.M, a = dirOf(M, R.Q[2]), g = el('g', { 'pointer-events': 'none' }, svg); el('path', { d: `M${M[0]} ${M[1]} L${angP(M, a, 30)} L${angP(angP(M, a, 30), a + 90, 30)} L${angP(M, a + 90, 30)} Z`, fill: '#fdf2c4', stroke: ok ? DQ.ok : DQ.m, 'stroke-width': 2.5, opacity: .9 }, g); return g; };
  let R = dqDraw(svg, { k: 'rhom' }, [180, 112, 220, 150], {}); let P = paper(R, true); await S(L[0]);
  R.g.remove(); P.remove(); R = dqDraw(svg, { k: 'rect' }, [180, 112, 220, 150], {}); P = paper(R, false); SFX.tick(); await S(L[1]);
  R.g.remove(); P.remove(); R = dqDraw(svg, { k: 'rhom', p: 10, r: 10 * Math.tan(30 * Math.PI / 180), rot: 0 }, [180, 112, 230, 150], { right: true }); const [A, B, C, D] = R.Q;
  triCorner(R.g, A, B, C, 30, TRI_COL[0], { r: 46, fs: 13 }); triCorner(R.g, A, C, D, 30, TRI_COL[0], { r: 46, fs: 13 }); SFX.tick(); for (const l of L.slice(2)) await S(l); };
/* الاكتشاف (د4): مخطط العائلة متداخلاً: الرباعيات ⊃ شبه المنحرف ⊃ متوازي الأضلاع ⊃ المستطيل والمعيّن، والمربع في تقاطعهما؛ والطائرة تحوي المعيّن */
function famNestAt(parent, o = {}) { const g = el('g', { transform: 'translate(24 12) scale(.866)' }, parent),   /* داخل إطار المسرح */ box = (x, y, w, h, col, key, lx, ly) => { el('rect', { x, y, width: w, height: h, rx: 12, fill: col, 'fill-opacity': .2, stroke: col, 'stroke-width': 2.4 }, g); const t = el('text', { x: lx, y: ly, 'text-anchor': 'middle', 'font-size': 13, 'font-weight': 800, fill: DQ.ink, direction: 'rtl', stroke: '#fff', 'stroke-width': 3, 'paint-order': 'stroke' }, g); t.textContent = labelText(key); return t; };
  /* مجموعات صحيحة: الطائرة تخرج من شبه المنحرف من أسفله، فلا يلتقيان إلا في المعيّن؛ والمربع تقاطع المستطيل والمعيّن، وهو في الطائرة */
  box(10, 6, 340, 226, '#9fb4c0', 'ply.q.other', 300, 22); box(96, 28, 246, 142, '#5aa0c8', 'ply.q.trap', 296, 44); box(106, 50, 228, 120, '#8aa040', 'ply.q.para', 282, 66);
  box(114, 110, 166, 112, '#c98a5a', 'ply.q.kite', 196, 210); box(230, 74, 96, 96, '#e0a32e', 'ply.q.rect', 296, 92); box(114, 110, 166, 60, '#a77bc6', 'ply.q.rhom', 166, 144);
  el('rect', { x: 230, y: 110, width: 50, height: 60, rx: 8, fill: '#3f9e93', 'fill-opacity': .35, stroke: '#3f9e93', 'stroke-width': 2.4 }, g); const st = el('text', { x: 255, y: 145, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 800, fill: DQ.ink, direction: 'rtl' }, g); st.textContent = labelText('ply.q.square');
  return g; }
/* إشعال بادّعاء فوضى على شكل (د2 ود3 ود4): k والرسم (show)، وورقة حمراء (paper)، والجمل */
SCENES.dqClaimHook = async c => { const L = c.lines, svg = m3Stage(250), R = dqDraw(svg, { k: c.k }, [176, 118, 220, 150], c.show || {}); const fz = chaosAt(svg, 322, 36, .4); chaosGiggle(fz);
  if (c.paper) { const M = R.M, a = dirOf(M, R.Q[2]); el('path', { d: `M${M[0]} ${M[1]} L${angP(M, a, 30)} L${angP(angP(M, a, 30), a + 90, 30)} L${angP(M, a + 90, 30)} Z`, fill: '#fdf2c4', stroke: DQ.m, 'stroke-width': 2.5, opacity: .9, 'pointer-events': 'none' }, svg); }
  for (const l of L) await S(l); };
SCENES.familyShow = async c => { const L = c.lines, svg = m3Stage(262); famNestAt(svg); for (const l of L) await S(l); };
WRAP_ART.diagArt = svg => { dqDraw(svg, { k: 'rhom' }, [180, 120, 200, 150], { ticks: true, right: true }); };
