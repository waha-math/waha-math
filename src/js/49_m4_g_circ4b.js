/* ================= M4-U6 الألعاب الحركية (D288 (2)، خطة ألعاب المرحلة 4) =================
   كل جولةٍ بندٌ حركيّ تشغّله SCENES.motion بنمط التمرين: يحرّك الطفل الوتر أو المسطرة بزرّين، أو يجد المركز ويقيس بالمنقلة، ثم يحسب.
   الخطوات المنجزة تبقى بعد الخطأ (item.step)، والحلّ المشترك في الخطوة التي وقف عندها الطفل وحدها. */
const c6Q = (id, live) => { const f = () => S(id); f(); REPLAY_HOOK = f; REPLAY_HOOK.live = live; };
const c6Arr = up => `<svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true" style="vertical-align:middle"><path d="${up ? 'M2 15 L18 15 L10 3Z' : 'M2 5 L18 5 L10 17Z'}" fill="currentColor"/></svg>`;
/* زرّا التحريك: k من lo إلى hi، وAUTO بنوعه (خطاف __c6K للسائقين واللمس الحقيقي) */
async function c6Move(item, k0, lo, hi, want, labels, icons, redraw) { let k = k0; redraw(k);
  const St = dqSteps(labels, d => { const v = Math.max(lo, Math.min(hi, k + d)); if (v === k) return false; k = v; redraw(k); return true; }, { icons });
  /*T*/window.__c6K = () => k;/*/T*/
  AUTO({ kind: 'c6Move', ok: () => { k = want; redraw(k); rulDoneBtn().click(); }, wrong: () => { k = want > lo ? want - 1 : want + 1; redraw(k); rulDoneBtn().click(); } });
  await rulDone(() => { St.off(); REPLAY_HOOK = null; }); hush(); return k; }
const c6Pick = (nums, want, deg) => numberPick(shuffle(nums), want, deg ? { west: true, word: degw } : { west: true });
const c6Off = () => document.querySelectorAll('#stage .choices').forEach(x => x.remove());

/* ---------- د1 «وتر الدائرة» (c6ChordGame): r، L (طول الوتر المطلوب) أو diam؛ يحرّك الوتر فيرى العمود من المركز ينصّفه، ثم بُعده عن المركز (أو القطر) ---------- */
function c6ChGeo(item) { const O = [180, 122], R = 92, u = R / item.r; return { O, R, u }; }
function c6ChDraw(G, g, item, d) { g.innerHTML = ''; const C = c6Chord(G.O, G.R, d * G.u), L = 2 * Math.sqrt(Math.max(0, item.r * item.r - d * d));
  c6Seg(g, C.A, C.B, C6.ch, 4); if (d) { c6Seg(g, G.O, C.M, C6.r, 2.4, '6 4'); preRight(g, C.M, C.B, G.O, 10); preTicks(g, C.A, C.M, 1, C6.ch); preTicks(g, C.M, C.B, 1, C6.ch); }
  [C.A, C.B].forEach(P => pfDot(g, P)); if (item.L != null) c6Num(g, C.M[0], C.M[1] + 22, Math.round(L * 10) / 10, { col: C6.ch, fs: 15 }); return { C, L }; }   /* وفي «أطول وترٍ» لا يُكتب الطول: هو المسؤول عنه */
ITEM.c6ChordGame = {
  make(spec) { const r = spec.r, diam = spec.L == null, d = diam ? 0 : Math.round(Math.sqrt(r * r - spec.L * spec.L / 4));
    /*T*/if (TESTHOOK && !diam && d * d !== r * r - spec.L * spec.L / 4) testBug('c6ChordGame: البعد ليس عدداً صحيحاً');/*/T*/
    const want = diam ? 2 * r : d, P = diam ? [[r, 'c6DiamRad'], [r * r, 'c6DiamSq']] : [[spec.L / 2, 'c6HalfDist'], [r, 'c6RadDist'], [r - spec.L / 2, 'c6SubDist']];
    return { ...spec, step: 0, moveN: d, d, want, nums: rkPick(want, P, spec.rk ?? 0), tag: 'c6-chord-' + (diam ? 'diam' : 'dist') }; },
  async ask(item, mode, tries) { item.__try = tries; const svg = m3Stage(262), G = c6ChGeo(item), g0 = el('g', { 'pointer-events': 'none' }, svg); c6Circle(g0, G.O, G.R, { lab: 'م' });
    const g = el('g', { 'pointer-events': 'none' }, svg), ctx = { svg, G, g }; let live = true; const isLive = () => live && svg.isConnected, t0 = item.step, diam = item.L == null;
    if (!diam) preLab(g0, 180, 246, labelText('c6WantLen').replace('N', MS(String(item.L))), { fs: 15, col: C6.ch, dir: 'rtl' });   /* الطول المطلوب تحت الدائرة */
    else { const T = angP(G.O, 120, G.R); c6Seg(g0, G.O, T, C6.r, 3); c6Num(g0, (G.O[0] + T[0]) / 2 - 12, (G.O[1] + T[1]) / 2 - 4, item.r, { col: C6.r, fs: 15 }); }   /* نصف القطر معلوم */
    if (item.step === 0) { const tg = tries >= 3, k0 = tg ? (item.d0 ?? 0) > item.d ? item.d + 1 : item.d - 1 : item.d0 ?? 0;   /* الحلّ المشترك: حركةٌ واحدة قبل الموضع */
      c6Q(tg ? 'gen.c6.together.move' : tries === 0 ? item.q || 'gen.c6.q.chMove' : 'gen.c6.q.chMove', isLive);
      const k = await c6Move(item, tg ? Math.max(0, k0) : k0, 0, item.r - 1, item.d, ['c6Near', 'c6Far'], [c6Arr(true), c6Arr(false)], v => { ctx.F = c6ChDraw(G, g, item, v); });
      if (k !== item.d) { live = false; return { ans: 'move|' + k, ctx }; } item.step = 1; SFX.tick(); }
    const F = c6ChDraw(G, g, item, item.d), h = el('g', { 'pointer-events': 'none' }, svg); ctx.F = F;
    if (diam) c6Num(h, F.C.M[0], F.C.M[1] - 12, '؟', { col: C6.q, fs: 18 });
    else { c6Seg(h, G.O, F.C.B, C6.r, 3); c6Num(h, (G.O[0] + F.C.B[0]) / 2 + 12, (G.O[1] + F.C.B[1]) / 2 - 6, item.r, { col: C6.r, fs: 15 }); c6Num(h, G.O[0] - 12, (G.O[1] + F.C.M[1]) / 2 + 5, '؟', { col: C6.q, fs: 18 }); }   /* نصف القطر إلى طرف الوتر، والبعد مجهول */
    if (tries >= 3 && t0 === 1) { ciEq(helpG(svg), 180, 30, diam ? `${item.r} + ${item.r} = ؟` : `${item.r} × ${item.r} − ${item.L / 2} × ${item.L / 2} = ؟ × ؟`, C6.hl, 15); await S('gen.c6.together.chDist'); }
    else c6Q(diam ? 'gen.c6.q.chDiam' : 'gen.c6.q.chDist', isLive);
    const np = c6Pick(item.nums.map(([v]) => v), item.want); const k = await np.p; live = false; c6Off(); return { ans: 'calc|' + k, ctx }; },
  judge(item, a) { const [w, v] = String(a).split('|'); if (w === 'move') return { ok: false, err: item.L == null ? 'c6NotDiam' : 'c6ChordLen' };
    return +v === item.want ? { ok: true } : { ok: false, err: (item.nums.find(([x]) => x === +v) || [])[1] || 'c6ChOff' }; },
  onOk() { SFX.good(); }, onWrong() { SFX.soft(); },
  async hint2(item, r, err) { const c = r && r.ctx; if (c && c.svg && c.svg.isConnected) { const m = helpG(c.svg), G = c.G, F = c.F;
      if (err === 'c6ChordLen' || err === 'c6NotDiam') { hlRing(m, G.O, 10, H2C[0]); ciRule(m, 180, [30], labelText(err === 'c6NotDiam' ? 'c6AskDiam' : 'c6AskLen'), C6.hl, 15); }   /* المركز: أطول الأوتار يمرّ به، والأقرب إليه أطول */
      else if (F) { hlSeg(m, G.O, F.C.M, H2C[0]); hlSeg(m, F.C.M, F.C.B, H2C[1]); hlSeg(m, G.O, F.C.B, H2C[2]); ciRule(m, 180, [30], labelText('c6AskPy'), C6.hl, 15); } }   /* المثلث القائم: البعد ونصف الوتر ونصف القطر */
    await S(err === 'c6ChordLen' ? 'gen.c6.hint.chMove' : err === 'c6NotDiam' ? 'gen.c6.hint.chDiam' : item.L == null ? 'gen.c6.hint.diam' : 'gen.c6.hint.chDist'); },
  async together() {},
  async reveal(item, r) { const c = r && r.ctx; if (c && c.svg.isConnected) { c6ChDraw(c.G, c.g, item, item.d); }
    item.step = 2; await S('gen.ci4.reveal.half', { noGap: true }); await S(numw(item.want), { append: true }); },
  praise: () => 'praiseThink', twin(item) { return item.twin || null; },
};

/* ---------- د2 «امسك المماس» (c6TanGame): mode slide (مسطرةٌ موازية تُقرَّب، a اتجاهها من المركز) أو pivot (تدور حول نقطةٍ خارجها، op)؛ حتى تلامس في نقطةٍ واحدة، ثم الزاوية أو طول المماس ---------- */
function c6TnGeo(item) { const R = item.mode === 'pivot' ? 6 * 9 : 70, O = item.mode === 'pivot' ? [120, 132] : [180, 128], n = 6, kt = item.mode === 'pivot' ? 3 : 5;
  if (item.mode === 'pivot') { const OP = item.op * 9, P = angP(O, item.a ?? 0, OP), ft = Math.asin(R / OP) * 180 / Math.PI; return { R, O, P, OP, n, kt, ft, at: k => { const f = ft + 6 * (k - kt); return { aN: (item.a ?? 0) + 90 - f, dist: OP * Math.sin(f * Math.PI / 180) }; } }; }
  return { R, O, n: 7, kt, at: k => ({ aN: item.a ?? 270, dist: k * R / kt }) }; }
function c6TnDraw(G, g, k) { g.innerHTML = ''; const { aN, dist } = G.at(k), pts = c6LineAt(g, G.O, G.R, aN, dist).pts; pts.forEach(P => el('circle', { cx: P[0], cy: P[1], r: 6, fill: C6.q, stroke: '#fff', 'stroke-width': 2 }, g));
  if (G.P) pfDot(g, G.P); preLab(g, 262, 36, labelText('c6Common').replace('N', MS(String(pts.length))), { fs: 15, col: C6.tan, dir: 'rtl' }); return { pts, aN, dist }; }   /* النقاط المشتركة بعددها */
ITEM.c6TanGame = {
  make(spec) { const pv = spec.mode === 'pivot', want = pv ? Math.round(Math.sqrt(spec.op * spec.op - 36)) : 90, P = pv ? [[spec.op, 'c6TanOP'], [spec.op - 6, 'c6TanSub'], [6, 'c6TanR']] : [[180, 'c6TanStraight'], [45, 'c6TanHalf'], [60, 'c6TanAng']];
    return { ...spec, step: 0, moveN: pv ? 3 : 5, want, nums: rkPick(want, P, pv ? spec.rk ?? 0 : 1), tag: 'c6-tan-' + (spec.mode || 'slide') }; },   /* والزاوية المستقيمة بين الخيارات دائماً */
  async ask(item, mode, tries) { item.__try = tries; const svg = m3Stage(262), G = c6TnGeo(item), g0 = el('g', { 'pointer-events': 'none' }, svg); c6Circle(g0, G.O, G.R, { lab: 'م' });
    const g = el('g', { 'pointer-events': 'none' }, svg), ctx = { svg, G, g }; let live = true; const isLive = () => live && svg.isConnected, t0 = item.step, pv = item.mode === 'pivot';
    if (pv) { c6Seg(g0, G.O, G.P, C6.ink, 2, '5 4'); c6Num(g0, (G.O[0] + G.P[0]) / 2, G.O[1] + 20, item.op, { fs: 15 }); }
    if (item.step === 0) { const tg = tries >= 3, k0 = tg ? G.kt - 1 : pv ? 0 : 1;   /* يبدأ قاطعاً، و«أبعد» تزيد المسافة */
      c6Q(tg ? 'gen.c6.together.tan' : tries === 0 ? item.q || 'gen.c6.q.tanMove' : 'gen.c6.q.tanMove', isLive);
      const k = await c6Move(item, k0, 0, G.n, G.kt, pv ? ['c6TurnIn', 'c6TurnOut'] : ['c6Near', 'c6Far'], pv ? [c9TurnIcon(1), c9TurnIcon(-1)] : [c6Arr(true), c6Arr(false)], v => { ctx.F = c6TnDraw(G, g, v); });
      if (k !== G.kt) { live = false; return { ans: 'move|' + (k < G.kt ? 'sec' : 'miss'), ctx }; } item.step = 1; SFX.tick(); }   /* أقلّ من التماس: المسافة أصغر من نصف القطر فيقطع */
    const F = c6TnDraw(G, g, G.kt), T = F.pts[0], h = el('g', { 'pointer-events': 'none' }, svg); ctx.F = F; c6Seg(h, G.O, T, C6.r, 3);
    if (pv) { c6Num(h, (G.O[0] + T[0]) / 2 - 10, (G.O[1] + T[1]) / 2 - 6, 6, { col: C6.r, fs: 15 }); c6Num(h, (G.P[0] + T[0]) / 2 + 12, (G.P[1] + T[1]) / 2 - 8, '؟', { col: C6.q, fs: 18 }); }
    else { const a = Math.atan2(G.O[1] - T[1], T[0] - G.O[0]) * 180 / Math.PI; el('path', { d: angArc(T, 18, a + 180, a + 270), fill: 'none', stroke: C6.q, 'stroke-width': 2.4 }, h); c6Num(h, ...angP(T, a + 225, 34), '؟', { col: C6.q, fs: 17 }); }
    if (tries >= 3 && t0 === 1) { if (pv) ciEq(helpG(svg), 180, 30, `${item.op} × ${item.op} − 6 × 6 = ؟ × ؟`, C6.hl, 15); else preRight(helpG(svg), T, G.O, angP(T, Math.atan2(G.O[1] - T[1], T[0] - G.O[0]) * 180 / Math.PI + 270, 30), 14); await S(pv ? 'gen.c6.together.tanLen' : 'gen.c6.together.tanAng'); }
    else c6Q(pv ? 'gen.c6.q.tanLen' : 'gen.c6.q.tanAng', isLive);
    const np = c6Pick(item.nums.map(([v]) => v), item.want, !pv); const k = await np.p; live = false; c6Off(); return { ans: 'calc|' + k, ctx }; },
  judge(item, a) { const [w, v] = String(a).split('|'); if (w === 'move') return { ok: false, err: v === 'sec' ? 'c6Secant' : 'c6Miss' };
    return +v === item.want ? { ok: true } : { ok: false, err: (item.nums.find(([x]) => x === +v) || [])[1] || 'c6TanOff' }; },
  onOk() { SFX.good(); }, onWrong() { SFX.soft(); },
  async hint2(item, r, err) { const c = r && r.ctx; if (c && c.svg && c.svg.isConnected) { const m = helpG(c.svg), G = c.G;
      if (err === 'c6Secant' || err === 'c6Miss') { el('circle', { cx: G.O[0], cy: G.O[1], r: G.R + 4, fill: 'none', stroke: THINK_INK, 'stroke-width': 3, 'stroke-dasharray': '6 5' }, m); ciRule(m, 180, [246], labelText('c6AskTouch'), C6.hl, 15); }   /* حافّة الدائرة: نقطةٌ واحدة عليها */
      else if (c.F) { hlSeg(m, G.O, c.F.pts[0], H2C[0]); ciRule(m, 180, [246], labelText(item.mode === 'pivot' ? 'c6AskPy' : 'c6AskTanAng'), C6.hl, 15); } }
    await S(err === 'c6Secant' || err === 'c6Miss' ? 'gen.c6.hint.tanMove' : item.mode === 'pivot' ? 'gen.c6.hint.tanLen' : 'gen.c6.hint.tanAng'); },
  async together() {},
  async reveal(item, r) { const c = r && r.ctx; if (c && c.svg.isConnected) c6TnDraw(c.G, c.g, c.G.kt);
    item.step = 2; if (item.mode === 'pivot') { await S('gen.ci4.reveal.half', { noGap: true }); await S(numw(item.want), { append: true }); } else { await S('gen.ci4.reveal.ang'); await sayDeg(90); } },
  praise: () => 'praiseThink', twin(item) { return item.twin || null; },
};

/* ---------- د3 «أين المركز؟» (c6CenGame): cen (المركزية)، pAt (رأس المحيطية)؛ يجد المركز بين نقاط (الشعاعان منه إلى طرفي القوس متساويان)، ثم يقرأ المركزية بالمنقلة، ثم المحيطية ---------- */
function c6CnGeo(item) { const O = [180, 150], R = 80, a1 = 270 - item.cen / 2, a2 = 270 + item.cen / 2, A = angP(O, a1, R), B = angP(O, a2, R), P = angP(O, item.pAt ?? 90, R);
  return { O, R, a1, a2, A, B, P, cand: [['O', O], ['Y', [O[0] - 46, O[1] - 34]], ['Z', [O[0] + 48, O[1] - 30]]] }; }
ITEM.c6CenGame = {
  make(spec) { const ins = spec.cen / 2, C = rkPick(spec.cen, [[180 - spec.cen, 'c6ReadOther'], [ins, 'c6CenHalf'], [2 * spec.cen > 180 ? spec.cen - 20 : 2 * spec.cen, 'c6CenOff']], spec.rk ?? 0), I = rkPick(ins, [[spec.cen, 'c6InsEq'], [180 - ins, 'c6ReadOther'], [ins / 2, 'c6InsHalf']], spec.rk ?? 0);   /* كـ ceng في u6.py */
    return { ...spec, step: 0, want: ins, cens: C, ins: I, tag: 'c6-center' }; },
  async ask(item, mode, tries) { item.__try = tries; const svg = m3Stage(262), G = c6CnGeo(item), pg = el('g', {}, svg), g = el('g', { 'pointer-events': 'none' }, svg); let live = true; const isLive = () => live && svg.isConnected, t0 = item.step, ctx = { svg, G };
    el('circle', { cx: G.O[0], cy: G.O[1], r: G.R, fill: C6.disc, stroke: C6.ink, 'stroke-width': 3 }, g); el('path', { d: angArc(G.O, G.R, G.a1, G.a2), fill: 'none', stroke: C6.arc, 'stroke-width': 5 }, g);   /* القوس المقابل */
    c6Seg(g, G.P, G.A, C6.ch, 3); c6Seg(g, G.P, G.B, C6.ch, 3); [G.A, G.B, G.P].forEach(X => pfDot(g, X));
    const lab = el('g', { 'pointer-events': 'none' }, svg); let pl = null; const prot = (V, base, PR) => { pg.innerHTML = ''; if (pl) pl.remove(); pl = protAt(pg, V, base, { R: PR, step: 30, fs: 1 }).lab; svg.appendChild(pl); };   /* داخل الإطار: 64 على المركز و50 على رأس المحيطية */
    if (item.step >= 1) { c6Seg(g, G.O, G.A, C6.r, 3); c6Seg(g, G.O, G.B, C6.r, 3); pfDot(g, G.O); }
    if (item.step === 0) { const tg = tries >= 3; let cand = G.cand;
      if (tg) { const x = cand.find(c => c[0] !== 'O' && !(item.tried || []).includes(c[0])) || cand[1], h = helpG(svg); c6Seg(h, x[1], G.A, THINK_INK, 2.4, '5 4'); c6Seg(h, x[1], G.B, THINK_INK, 2.4, '5 4'); cand = cand.filter(c => c !== x); await S('gen.c6.together.cen'); }   /* جرّبنا نقطةً: شعاعاها غير متساويين */
      else c6Q(tries === 0 ? item.q || 'gen.c6.q.cen' : 'gen.c6.q.cen', isLive);
      const T = cand.map(([k, P]) => { const t = el('g', {}, svg); el('circle', { cx: P[0], cy: P[1], r: 12, fill: 'rgba(255,255,255,.85)', stroke: C6.ink, 'stroke-width': 2.4 }, t); return { g: t, k, label: labelText('c9Spot') }; });
      const k = await tapOne(T, { ok: 'O', pad: 56 }); hush(); T.forEach(t => t.g.remove()); (item.tried = item.tried || []).push(k);
      if (k !== 'O') { const X = G.cand.find(c => c[0] === k)[1]; c6Seg(g, X, G.A, C6.r, 3); c6Seg(g, X, G.B, C6.r, 3); ctx.X = X; live = false; return { ans: 'cen|' + k, ctx }; }   /* الشعاعان من النقطة الخاطئة ظاهران غير متساويين */
      c6Seg(g, G.O, G.A, C6.r, 3); c6Seg(g, G.O, G.B, C6.r, 3); pfDot(g, G.O); item.step = 1; SFX.tick(); }
    if (item.step === 1) { prot(G.O, G.a1, 64); arArc(lab, G.O, G.a1, G.a2, { r: 22, col: C6.arc, fill: true });   /* القوس بلا «؟» فلا يقع على أعداد المنقلة */
      if (tries >= 3 && t0 === 1) { el('path', { d: angArc(G.O, 64 - 14, G.a1, G.a2), fill: 'none', stroke: THINK_INK, 'stroke-width': 4, opacity: .8 }, helpG(svg)); await S('gen.c6.together.read'); } else c6Q('gen.c6.q.cenRead', isLive);
      const np = c6Pick(item.cens.map(([v]) => v), item.cen, true); const k = await np.p; c6Off(); if (k !== item.cen) { live = false; return { ans: 'cr|' + k, ctx }; } item.step = 2; SFX.tick(); }
    lab.innerHTML = ''; arArc(lab, G.O, G.a1, G.a2, { r: 22, col: C6.r, deg: item.cen, dl: 16, fs: 14 }); const pa = Math.atan2(G.P[1] - G.A[1], G.A[0] - G.P[0]) * 180 / Math.PI, pb = Math.atan2(G.P[1] - G.B[1], G.B[0] - G.P[0]) * 180 / Math.PI, na = ((pa % 360) + 360) % 360, nb = ((pb % 360) + 360) % 360, lo = Math.abs(((nb - na + 360) % 360) - item.want) < 1 ? na : nb;   /* المحيطية من رأسها P: من الشعاع الذي يدور منه بعكس العقارب */
    prot(G.P, lo, 50); arArc(lab, G.P, lo, lo + item.want, { r: 18, col: C6.ch, fill: true });
    if (tries >= 3 && t0 === 2) { el('path', { d: angArc(G.P, 50 - 12, lo, lo + item.want), fill: 'none', stroke: THINK_INK, 'stroke-width': 4, opacity: .8 }, helpG(svg)); await S('gen.c6.together.read'); } else c6Q('gen.c6.q.insRead', isLive);
    const np = c6Pick(item.ins.map(([v]) => v), item.want, true); const k = await np.p; live = false; c6Off(); return { ans: 'ir|' + k, ctx }; },
  judge(item, a) { const [w, v] = String(a).split('|'); if (w === 'cen') return { ok: false, err: 'c6NotCenter' };
    if (w === 'cr') return { ok: false, err: (item.cens.find(([x]) => x === +v) || [])[1] || 'c6CenOff' };
    return +v === item.want ? { ok: true } : { ok: false, err: (item.ins.find(([x]) => x === +v) || [])[1] || 'c6InsOff' }; },
  onOk(item, r) { SFX.good(); const c = r && r.ctx; if (c && c.svg.isConnected) { c.svg.querySelectorAll('[data-prot], [data-prot-lab]').forEach(e => e.remove()); ciEq(c.svg, 180, 30, `${item.want} = ${item.cen} ÷ 2`, C6.ok, 15); } },   /* المنقلة تُرفع، والمحيطية نصف المركزية */
  onWrong() { SFX.soft(); },
  async hint2(item, r, err) { const c = r && r.ctx; if (c && c.svg && c.svg.isConnected) { const m = helpG(c.svg), G = c.G;
      if (err === 'c6NotCenter') { hlSeg(m, G.O, G.A, H2C[0]); ciRule(m, 180, [246], labelText('c6AskCen'), C6.hl, 15); }   /* المركز: بعده عن كل نقطةٍ على الدائرة واحد */
      else ciRule(m, 180, [246], labelText('c9Ask.rotAng'), C6.hl, 15); }
    await S(err === 'c6NotCenter' ? 'gen.c6.hint.cen' : 'gen.c9.hint.prot'); },
  async together() {},
  async reveal(item, r) { const c = r && r.ctx; if (c && c.svg.isConnected) { c.svg.querySelectorAll('[data-prot], [data-prot-lab]').forEach(e => e.remove()); ciEq(c.svg, 180, 30, `${item.want} = ${item.cen} ÷ 2`, C6.ok, 15); } item.step = 3; await S('gen.ci4.reveal.ang'); await sayDeg(item.want); },
  praise: () => 'praiseMeasure', twin(item) { return item.twin || null; },
};
