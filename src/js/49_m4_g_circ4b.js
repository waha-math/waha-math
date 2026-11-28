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

/* ---------- د1 «وتر الدائرة» (c6ChordGame): r، L (طول الوتر المطلوب) أو diam، d0 موضعه الأول، rot دوران الشكل؛ يحرّك الوتر فيرى العمود من المركز ينصّفه، ثم بُعده عن المركز (أو القطر) ---------- */
function c6ChGeo(item) { const O = [180, 122], R = 92, u = R / item.r, a = (item.rot || 0) * Math.PI / 180, cs = Math.cos(a), sn = Math.sin(a), Rt = P => [O[0] + (P[0] - O[0]) * cs - (P[1] - O[1]) * sn, O[1] + (P[0] - O[0]) * sn + (P[1] - O[1]) * cs]; return { O, R, u, Rt }; }
const c6ChLen = (item, d) => Math.round(2 * Math.sqrt(Math.max(0, item.r * item.r - d * d)) * 10) / 10;
const c6Out = (G, M, k) => { const n = [M[0] - G.O[0], M[1] - G.O[1]], l = Math.hypot(n[0], n[1]); return l < 1 ? [M[0], M[1] + k] : [M[0] + n[0] / l * k, M[1] + n[1] / l * k]; };   /* من المركز إلى الخارج (وتحت القطر) */
const c6Side = (P, Q, k) => { const d = [Q[0] - P[0], Q[1] - P[1]], l = Math.hypot(d[0], d[1]) || 1; return [(P[0] + Q[0]) / 2 - d[1] / l * k, (P[1] + Q[1]) / 2 + d[0] / l * k]; };   /* جانب القطعة عند منتصفها */
function c6ChDraw(G, g, item, d, o = {}) { if (!o.keep) g.innerHTML = ''; const C0 = c6Chord(G.O, G.R, d * G.u), C = { A: G.Rt(C0.A), B: G.Rt(C0.B), M: G.Rt(C0.M) }, L = c6ChLen(item, d);
  c6Seg(g, C.A, C.B, o.ghost ? THINK_INK : C6.ch, o.ghost ? 2.4 : 4, o.ghost ? '6 5' : null);
  if (!o.ghost) { if (d) { c6Seg(g, G.O, C.M, C6.r, 2.4, '6 4'); preRight(g, C.M, C.B, G.O, 10); preTicks(g, C.A, C.M, 1, C6.ch); preTicks(g, C.M, C.B, 1, C6.ch); } [C.A, C.B].forEach(P => pfDot(g, P)); }
  if (o.ghost && o.end) { const E = o.end === 'A' ? C.A : C.B, F2 = o.end === 'A' ? C.B : C.A, l = Math.hypot(E[0] - F2[0], E[1] - F2[1]) || 1, Q = [E[0] + (E[0] - F2[0]) / l * 18, Math.max(26, Math.min(236, E[1] + (E[1] - F2[1]) / l * 18))]; c6Num(g, Q[0], Q[1] + 5, L, { col: THINK_INK, fs: 14 }); return { C, L }; }   /* الشبحان: طول كلٍّ بعد طرفه، لا يتراكبان ولا يقعان على طول الوتر (RUNGG) */
  if (item.L != null || o.ghost) { let Q = c6Out(G, C.M, o.ghost ? 15 : 22); if (G.R - d * G.u < 30) { const t = [C.B[0] - C.A[0], C.B[1] - C.A[1]], l = Math.hypot(t[0], t[1]) || 1, I = c6Out(G, C.M, -16); Q = [I[0] + t[0] / l * 26, I[1] + t[1] / l * 26]; }   /* قرب الحافة: داخل الدائرة بجانب العمود، لا على خطّها (المراجع B لدفعة U6/U5، 8) */
    c6Num(g, Q[0], Q[1] + 5, L, { col: o.ghost ? THINK_INK : C6.ch, fs: o.ghost ? 14 : 15 }); }   /* وفي «أطول وترٍ» لا يُكتب الطول: هو المسؤول عنه */
  return { C, L }; }
ITEM.c6ChordGame = {
  make(spec) { const r = spec.r, diam = spec.L == null, d = diam ? 0 : Math.round(Math.sqrt(r * r - spec.L * spec.L / 4));
    /*T*/if (TESTHOOK && !diam && d * d !== r * r - spec.L * spec.L / 4) testBug('c6ChordGame: البعد ليس عدداً صحيحاً');/*/T*/
    const L0 = c6ChLen(spec, spec.d0 ?? 0), want = diam ? 2 * r : d, P = diam ? [[r, 'c6DiamRad'], [L0, 'c6DiamStart']] : [[spec.L / 2, 'c6HalfDist'], [r, 'c6RadDist'], [r - spec.L / 2, 'c6SubDist']];   /* القطر: نصف القطر، والوتر الذي بدأ منه (المراجع A لدفعة U6/U5، 16) */
    return { ...spec, step: 0, moveN: d, d, want, nums: rkPick(want, P, diam ? 0 : spec.rk ?? 0), tag: 'c6-chord-' + (diam ? 'diam' : 'dist') }; },
  async ask(item, mode, tries) { item.__try = tries; const svg = m3Stage(262), G = c6ChGeo(item), g0 = el('g', { 'pointer-events': 'none' }, svg); c6Circle(g0, G.O, G.R, { lab: 'م' });
    const g = el('g', { 'pointer-events': 'none' }, svg), ctx = { svg, G, g }; let live = true; const isLive = () => live && svg.isConnected, t0 = item.step, diam = item.L == null;
    if (!diam) preLab(g0, 180, 238, labelText('c6WantLen').replace('N', MS(String(item.L))), { fs: 15, col: C6.ch, dir: 'rtl' });   /* الطول المطلوب تحت الدائرة */
    else { const T = angP(G.O, 120, G.R); c6Seg(g0, G.O, T, C6.r, 3); c6Num(g0, (G.O[0] + T[0]) / 2 - 12, (G.O[1] + T[1]) / 2 - 4, item.r, { col: C6.r, fs: 15 }); }   /* نصف القطر معلوم */
    if (item.step === 0) { const tg = tries >= 3, d0 = item.d0 ?? 0, k0 = tg ? (d0 > item.d ? item.d + 1 : item.d - 1) : d0;   /* الحلّ المشترك: حركةٌ واحدة قبل الموضع */
      c6Q(tg ? 'gen.c6.together.move' : tries === 0 || diam ? item.q || 'gen.c6.q.chMove' : 'gen.c6.q.chMove', isLive);   /* وفي «أطول وترٍ» سؤال الجولة نفسه بعد الخطأ (لا «طوله المطلوب») */
      const k = await c6Move(item, Math.max(0, k0), 0, item.r - 1, item.d, ['c6Near', 'c6Far'], item.rot ? ['', ''] : [c6Arr(true), c6Arr(false)], v => { ctx.F = c6ChDraw(G, g, item, v); ctx.k = v; });   /* والوتر المائل بلا سهمين لا يصدقان عليه */
      if (k !== item.d) { live = false; ctx.k = k; return { ans: 'move|' + k, ctx }; } item.step = 1; SFX.tick(); }
    const F = c6ChDraw(G, g, item, item.d), h = el('g', { 'pointer-events': 'none' }, svg); ctx.F = F;
    if (diam) c6Num(h, ...c6Out(G, F.C.M, -14), '؟', { col: C6.q, fs: 18 });
    else { c6Seg(h, G.O, F.C.B, C6.r, 3); const Rl = c6Side(G.O, F.C.B, -12), Dl = c6Side(G.O, F.C.M, 13); c6Num(h, Rl[0], Rl[1] + 5, item.r, { col: C6.r, fs: 15 }); c6Num(h, Dl[0], Dl[1] + 6, '؟', { col: C6.q, fs: 18 }); }   /* نصف القطر إلى طرف الوتر، والبعد مجهول */
    if (tries >= 3 && t0 === 1) { ciEq(helpG(svg), 180, 34, diam ? `${item.r} + ${item.r} = ؟` : `${item.r} × ${item.r} − ${item.L / 2} × ${item.L / 2} = ؟ × ؟`, C6.hl, 15); await S('gen.c6.together.chDist'); }
    else c6Q(diam ? 'gen.c6.q.chDiam' : 'gen.c6.q.chDist', isLive);
    const np = c6Pick(item.nums.map(([v]) => v), item.want); const k = await np.p; live = false; c6Off(); return { ans: 'calc|' + k, ctx }; },
  judge(item, a) { const [w, v] = String(a).split('|'); if (w === 'move') return { ok: false, err: item.L == null ? 'c6NotDiam' : 'c6ChordLen' };
    return +v === item.want ? { ok: true } : { ok: false, err: (item.nums.find(([x]) => x === +v) || [])[1] || 'c6ChOff' }; },
  onOk() { SFX.good(); }, onWrong() { SFX.soft(); },
  async hint2(item, r, err) { const c = r && r.ctx; if (c && c.svg && c.svg.isConnected) { const m = helpG(c.svg), G = c.G, F = c.F;
      if (err === 'c6ChordLen' || err === 'c6NotDiam') { const k = c.k ?? item.d0 ?? 0; for (const d of [k - 1, k + 1]) if (d >= 0 && d <= item.r - 1) c6ChDraw(G, m, item, d, { ghost: true, keep: true, end: d < k ? 'A' : 'B' }); ciRule(m, 180, [30], labelText('c6AskCmp'), C6.hl, 15); }   /* وتران شبحان بخطوةٍ قبل موضعه وبعده بطوليهما (لا حلقة على المركز) */
      else if (item.L == null && F) { hlSeg(m, G.O, F.C.A, H2C[0]); hlSeg(m, G.O, F.C.B, H2C[1]); ciRule(m, 180, [30], labelText('c6AskDiam2'), C6.hl, 15); }   /* القطر نصفا قطرٍ بلونين */
      else if (F) { hlSeg(m, G.O, F.C.M, H2C[0]); hlSeg(m, F.C.M, F.C.B, H2C[1]); hlSeg(m, G.O, F.C.B, H2C[2]); ciRule(m, 180, [30], labelText('c6AskPy'), C6.hl, 15); } }   /* المثلث القائم: البعد ونصف الوتر ونصف القطر (وترُه) */
    await S(err === 'c6ChordLen' ? 'gen.c6.hint.chMove' : err === 'c6NotDiam' ? 'gen.c6.hint.chDiam' : item.L == null ? 'gen.c6.hint.diam' : 'gen.c6.hint.chDist'); },
  async together() {},
  async reveal(item, r) { const c = r && r.ctx; if (c && c.svg.isConnected) { c.svg.querySelectorAll('[data-help]').forEach(e => e.remove()); [...c.svg.querySelectorAll('text')].filter(t => t.textContent.trim() === '؟').forEach(t => t.remove()); const F = c6ChDraw(c.G, c.g, item, item.d), G = c.G;   /* الجواب مكان «؟» (RUNGG) */
      if (item.L != null) { c6Seg(c.g, G.O, F.C.B, C6.r, 3); const Dl = c6Side(G.O, F.C.M, 13); c6Num(c.g, Dl[0], Dl[1] + 6, item.d, { col: C6.ok, fs: 17 }); } else c6Num(c.g, ...c6Out(G, F.C.M, -14), item.want, { col: C6.ok, fs: 17 }); }   /* الكشف يُري ما سُئل عنه: البعد أو القطر */
    item.step = 2; await S(item.L == null ? 'gen.c6.reveal.diam' : 'gen.c6.reveal.dist', { noGap: true }); await S(numw(item.want), { append: true }); },
  praise: () => 'praiseThink', twin(item) { return item.twin || null; },
};

/* ---------- د2 «امسك المماس» (c6TanGame): mode slide (مسطرةٌ موازية تُقرَّب، a اتجاهها من المركز) أو pivot (تدور حول نقطةٍ خارجها، r وop)؛ حتى تلامس في نقطةٍ واحدة،
   ثم ورقة الزاوية القائمة عند نقطة التماس والحكم (noAng: بلا هذه الخطوة)، أو طول المماس ---------- */
function c6TnGeo(item) { const pv = item.mode === 'pivot', r = item.r || 6, R = pv ? r * 9 : 70, O = pv ? [120, 132] : [180, 128], n = 6, kt = pv ? 3 : 5;
  if (pv) { const OP = item.op * 9, P = angP(O, item.a ?? 0, OP), ft = Math.asin(R / OP) * 180 / Math.PI; return { R, O, P, OP, n, kt, ft, r, at: k => { const f = ft + 6 * (k - kt); return { aN: (item.a ?? 0) + 90 - f, dist: OP * Math.sin(f * Math.PI / 180) }; } }; }
  return { R, O, n: 7, kt, r, at: k => ({ aN: item.a ?? 270, dist: k * R / kt }) }; }
function c6TnDraw(G, g, k) { g.innerHTML = ''; const { aN, dist } = G.at(k), pts = c6LineAt(g, G.O, G.R, aN, dist).pts; pts.forEach(P => el('circle', { cx: P[0], cy: P[1], r: 6, fill: C6.q, stroke: '#fff', 'stroke-width': 2 }, g));
  if (G.P) pfDot(g, G.P); preLab(g, 262, 36, labelText('c6Common').replace('N', MS(String(pts.length))), { fs: 15, col: C6.tan, dir: 'rtl' }); return { pts, aN, dist }; }   /* النقاط المشتركة بعددها */
/* ورقة الزاوية القائمة عند T: ضلعٌ على نصف القطر وضلعٌ على المسطرة */
function c6Paper(g, G, T, col) { const u1 = [G.O[0] - T[0], G.O[1] - T[1]], l1 = Math.hypot(u1[0], u1[1]) || 1, e1 = [u1[0] / l1 * 30, u1[1] / l1 * 30], aN = G.at(G.kt).aN, e2 = angU(aN + 90).map(v => v * 30);
  return el('polygon', { points: polyStr([T, [T[0] + e1[0], T[1] + e1[1]], [T[0] + e1[0] + e2[0], T[1] + e1[1] + e2[1]], [T[0] + e2[0], T[1] + e2[1]]]), fill: col ? 'none' : 'rgba(255,236,170,.75)', stroke: col || '#b9813f', 'stroke-width': col ? 3 : 2, 'stroke-dasharray': col ? '6 4' : null, 'pointer-events': 'none' }, g); }
ITEM.c6TanGame = {
  make(spec) { const pv = spec.mode === 'pivot', r = spec.r || 6;
    if (pv) { const want = Math.round(Math.sqrt(spec.op * spec.op - r * r)); /*T*/if (TESTHOOK && want * want !== spec.op * spec.op - r * r) testBug('c6TanGame: طول المماس ليس عدداً صحيحاً');/*/T*/
      return { ...spec, step: 0, moveN: 3, want, nums: rkPick(want, [[spec.op, 'c6TanOP'], [spec.op - r, 'c6TanSub'], [r, 'c6TanR']], spec.rk ?? 0), tag: 'c6-tan-pivot' }; }
    return { ...spec, step: 0, moveN: 5, want: 'right', ch: [['right'], ['acute'], ['obtuse']], chLab: ['right', 'acute', 'obtuse'].map(k => labelText('c6Kind.' + k)), tag: 'c6-tan-' + (spec.noAng ? 'move' : 'slide') }; },
  async ask(item, mode, tries) { item.__try = tries; const svg = m3Stage(262), G = c6TnGeo(item), g0 = el('g', { 'pointer-events': 'none' }, svg); c6Circle(g0, G.O, G.R); { const L = angP(G.O, G.at(G.kt).aN + 145, 17); pfLab(g0, L[0], L[1] + 5, 'م', { fs: 15 }); }   /* «م» في الجهة البعيدة عن نقطة التماس وعن بُعد النقطة (المراجع B لدفعة U6/U5، 12) */
    const g = el('g', { 'pointer-events': 'none' }, svg), ctx = { svg, G, g }; let live = true; const isLive = () => live && svg.isConnected, t0 = item.step, pv = item.mode === 'pivot', TG = k => tries >= 3 && t0 === k;
    if (pv) { c6Seg(g0, G.O, G.P, C6.ink, 2, '5 4'); c6Num(g0, Math.max((G.O[0] + G.P[0]) / 2, G.O[0] + G.R + 20), G.O[1] + 20, item.op, { fs: 15 }); }   /* بُعد النقطة خارج الدائرة (المراجع B لدفعة U6/U5، 12) */
    if (item.step === 0) { const tg = TG(0), k0 = tg ? G.kt - 1 : pv ? 0 : 1;   /* يبدأ قاطعاً، و«أبعد» تزيد المسافة */
      c6Q(tg ? 'gen.c6.together.tan' : tries === 0 ? item.q || 'gen.c6.q.tanMove' : 'gen.c6.q.tanMove', isLive);
      const icons = pv ? [c9TurnIcon(1), c9TurnIcon(-1)] : (item.a ?? 270) === 270 ? [c6Arr(true), c6Arr(false)] : ['', ''];   /* المائلة بلا سهمين رأسيين لا يصدقان عليها */
      const k = await c6Move(item, k0, 0, G.n, G.kt, pv ? ['c6TurnIn', 'c6TurnOut'] : ['c6Near', 'c6Far'], icons, v => { ctx.F = c6TnDraw(G, g, v); ctx.k = v; });
      if (k !== G.kt) { live = false; return { ans: 'move|' + (k < G.kt ? 'sec' : 'miss'), ctx }; }   /* أقلّ من التماس: المسافة أصغر من نصف القطر فيقطع */
      if (item.noAng) { live = false; return { ans: 'move|ok', ctx }; } item.step = 1; SFX.tick(); }
    const F = c6TnDraw(G, g, G.kt), T = F.pts[0], h = el('g', { 'pointer-events': 'none' }, svg); ctx.F = F; ctx.T = T; c6Seg(h, G.O, T, C6.r, 3);
    if (pv) { const Rl = c6Side(G.O, T, -12), Ql = c6Side(G.P, T, 14); c6Num(h, Rl[0], Rl[1] + 5, G.r, { col: C6.r, fs: 15 }); c6Num(h, Ql[0], Ql[1] + 6, '؟', { col: C6.q, fs: 18 });
      if (TG(1)) { ciEq(helpG(svg), 180, 242, `${item.op} × ${item.op} − ${G.r} × ${G.r} = ؟ × ؟`, C6.hl, 15); await S('gen.c6.together.tanLen'); } else c6Q('gen.c6.q.tanLen', isLive);   /* تحت، بعيداً عن «نقاط مشتركة» (RUNGG) */
      const np = c6Pick(item.nums.map(([v]) => v), item.want); const k = await np.p; live = false; c6Off(); return { ans: 'calc|' + k, ctx }; }
    if (item.step === 1) {   /* ورقة الزاوية القائمة: أين تُوضع؟ */
      if (TG(1)) { hlSeg(helpG(svg), G.O, T, H2C[0]); await S('gen.c6.together.paper'); } else c6Q('gen.c6.q.paper', isLive);
      const X = [2 * G.O[0] - T[0], 2 * G.O[1] - T[1]], k = await gmSpots(svg, [['T', T], ['O', G.O], ['X', X]].filter(c => !TG(1) || c[0] !== 'X'), 'T', { label: 'c6SpotPaper', bad: 'O' }); hush();   /* الحلّ المشترك: يبقى موضعان */
      if (k !== 'T') { live = false; ctx.spot = k; return { ans: 'spot|' + k, ctx }; } item.step = 2; SFX.tick(); }
    c6Paper(h, G, T);
    if (TG(2)) { preRight(helpG(svg), T, G.O, angP(T, G.at(G.kt).aN + 90, 30), 14); await S('gen.c6.together.kind'); } else c6Q('gen.c6.q.kind', isLive);
    const k = await choosePick(item.ch.filter(([w]) => !TG(2) || w !== (item.kTry || 'obtuse')).map(([w]) => [w, labelText('c6Kind.' + w), '<i></i>', 'gen.c6.kind.' + w]), 'right'); live = false; c6Off(); if (k !== 'right') item.kTry = k; return { ans: 'kind|' + k, ctx }; },   /* الحلّ المشترك: يسقط ما جرّبه */
  judge(item, a) { const [w, v] = String(a).split('|'); if (w === 'move') return v === 'ok' ? { ok: true } : { ok: false, err: v === 'sec' ? 'c6Secant' : 'c6Miss' };
    if (w === 'spot') return { ok: false, err: 'c6PaperSpot' }; if (w === 'kind') return v === 'right' ? { ok: true } : { ok: false, err: 'c6TanNotRight' };
    return +v === item.want ? { ok: true } : { ok: false, err: (item.nums.find(([x]) => x === +v) || [])[1] || 'c6TanOff' }; },
  onOk() { SFX.good(); }, onWrong() { SFX.soft(); },
  async hint2(item, r, err) { const c = r && r.ctx; if (c && c.svg && c.svg.isConnected) { const m = helpG(c.svg), G = c.G;
      if (err === 'c6Secant' || err === 'c6Miss') { const k = c.k ?? 0, gh = el('g', {}, m); for (const kk of [k - 1, k + 1]) if (kk >= 0 && kk <= G.n) { const { aN, dist } = G.at(kk), L = c6LineAt(gh, G.O, G.R, aN, dist, THINK_INK); gh.lastElementChild.setAttribute('stroke-dasharray', '6 5'); gh.lastElementChild.setAttribute('stroke-width', 2.6); const N = angP(G.O, aN, dist); c6Num(gh, N[0], N[1] - 8, L.pts.length, { col: THINK_INK, fs: 14 }); } ciRule(m, 180, [246], labelText('c6AskTouch'), C6.hl, 15); }   /* مسطرتان شبحان بخطوةٍ قبل موضعها وبعده بعدد نقاطهما */
      else if (err === 'c6PaperSpot') { hlSeg(m, G.O, c.T, H2C[0]); ciRule(m, 180, [246], labelText('c6AskMeet'), C6.hl, 15); }   /* نصف القطر إلى المسطرة */
      else if (err === 'c6TanNotRight') { c6Paper(m, G, c.T, THINK_INK); ciRule(m, 180, [246], labelText('c6AskTanAng'), C6.hl, 15); }   /* حدّ الورقة على الضلعين */
      else if (c.F) { hlSeg(m, G.O, G.P, H2C[0]); ciRule(m, 180, [246], labelText('c6AskTanPy'), C6.hl, 15); } }   /* وتر المثلث: من النقطة إلى المركز (القائمة عند نقطة التماس) */
    await S(err === 'c6Secant' || err === 'c6Miss' ? 'gen.c6.hint.tanMove' : err === 'c6PaperSpot' ? 'gen.c6.hint.paper' : err === 'c6TanNotRight' ? 'gen.c6.hint.tanAng' : 'gen.c6.hint.tanLen'); },
  async together() {},
  async reveal(item, r) { const c = r && r.ctx, pv = item.mode === 'pivot'; if (c && c.svg.isConnected) { c.svg.querySelectorAll('[data-help]').forEach(e => e.remove()); [...c.svg.querySelectorAll('text')].filter(t => t.textContent.trim() === '؟').forEach(t => t.remove()); const G = c.G, F = c6TnDraw(G, c.g, G.kt), T = F.pts[0]; c6Seg(c.g, G.O, T, C6.r, 3);
      if (pv) { c6Seg(c.g, G.P, T, C6.ok, 3.6); const Ql = c6Side(G.P, T, 14); c6Num(c.g, Ql[0], Ql[1] + 6, item.want, { col: C6.ok, fs: 17 }); preRight(c.g, T, G.O, G.P, 10); } else if (!item.noAng) { c6Paper(c.g, G, T); } }   /* الكشف يُري المثلث بطول المماس، أو الورقة على القائمة */
    item.step = 3; if (pv) { await S('gen.c6.reveal.tanLen', { noGap: true }); await S(numw(item.want), { append: true }); } else await S(item.noAng ? 'gen.c6.reveal.tanMove' : 'gen.c6.reveal.tan'); },
  praise: () => 'praiseThink', twin(item) { return item.twin || null; },
};

/* ---------- د3 «أين المركز؟» (c6CenGame): cen (المركزية)، pAt (رأس المحيطية)، rot دوران الشكل؛ يجد المركز بين نقاطٍ على العمود المنصّف لطرفي القوس (أشعّتها الثلاثة إلى أ وب ورأس المحيطية)،
   ثم يقرأ المركزية بالمنقلة، ثم المحيطية ---------- */
function c6CnGeo(item) { const rot = item.rot || 0, O = [180, 146], R = 80, a1 = 270 - item.cen / 2 + rot, a2 = 270 + item.cen / 2 + rot, A = angP(O, a1, R), B = angP(O, a2, R), P = angP(O, (item.pAt ?? 90) + rot, R);
  return { O, R, a1, a2, A, B, P, cand: [['O', O], ['Y', angP(O, 270 + rot, 54)], ['Z', angP(O, 90 + rot, 56)]] }; }   /* المرشّحان على العمود المنصّف لـ أ ب: شعاعاهما إلى أ وب متساويان، والثالث إلى الرأس يفرّق */
const c6Len = (P, Q) => Math.round(Math.hypot(Q[0] - P[0], Q[1] - P[1]) / 16 * 10) / 10;   /* بوحدات الشبكة (نصف القطر خمس) */
function c6Rays(g, X, G, o = {}) { for (const Q of [G.A, G.B, G.P]) { c6Seg(g, X, Q, o.col || C6.r, o.w || 3, o.dash); if (o.len) { const L = c6Side(X, Q, 11); c6Num(g, L[0], L[1] + 5, c6Len(X, Q), { col: o.col || C6.r, fs: 13 }); } } }
ITEM.c6CenGame = {
  make(spec) { const ins = spec.cen / 2, C = rkPick(spec.cen, [[180 - spec.cen, 'c6ReadOther'], [ins, 'c6CenHalf']], spec.rk ?? 0), I = rkPick(ins, [[180 - ins, 'c6ReadOther'], [spec.cen, 'c6InsEq'], [ins / 2, 'c6InsHalf']], spec.rk ?? 0);   /* كـ ceng في u6.py: والتدريج الآخر أولاً (المراجع A لدفعة U6/U5، 16) */
    return { ...spec, step: 0, want: ins, cens: C, ins: I, tag: 'c6-center' }; },
  async ask(item, mode, tries) { item.__try = tries; const svg = m3Stage(262), G = c6CnGeo(item), g = el('g', { 'pointer-events': 'none' }, svg), pg = el('g', {}, svg), top = el('g', { 'pointer-events': 'none' }, svg); let live = true; const isLive = () => live && svg.isConnected, t0 = item.step, ctx = { svg, G, top };
    el('circle', { cx: G.O[0], cy: G.O[1], r: G.R, fill: C6.disc, stroke: C6.ink, 'stroke-width': 3 }, g); el('path', { d: angArc(G.O, G.R, G.a1, G.a2), fill: 'none', stroke: C6.arc, 'stroke-width': 5 }, g);   /* القوس المقابل */
    c6Seg(top, G.P, G.A, C6.ch, 3); c6Seg(top, G.P, G.B, C6.ch, 3); [G.A, G.B, G.P].forEach(X => pfDot(top, X));   /* فوق المنقلة: الضلعان يُقرآن عليها */
    const lab = el('g', { 'pointer-events': 'none' }, svg); let pl = null; const prot = (V, base, PR) => { pg.innerHTML = ''; if (pl) pl.remove(); pl = protAt(pg, V, base, { R: PR, step: 30, fs: 1.15, inner: PR >= 80 }).lab; svg.insertBefore(pl, top); ctx.pr = { V, base, PR }; };   /* المنقلة فوق القرص بتدريجها، والأعداد تحت الأضلاع (المراجع A لدفعة U6/U5، 5) */
    if (item.step >= 1) { c6Seg(top, G.O, G.A, C6.r, 3); c6Seg(top, G.O, G.B, C6.r, 3); pfDot(top, G.O); }
    if (item.step === 0) { const tg = tries >= 3; let cand = G.cand;
      if (tg) { const x = cand.find(c => c[0] !== 'O' && !(item.tried || []).includes(c[0])) || cand[1]; c6Rays(helpG(svg), x[1], G, { col: THINK_INK, w: 2.4, dash: '5 4', len: true }); cand = cand.filter(c => c !== x); await S('gen.c6.together.cen'); }   /* جرّبنا نقطةً: أشعّتها الثلاثة غير متساوية */
      else c6Q(tries === 0 ? item.q || 'gen.c6.q.cen' : 'gen.c6.q.cen', isLive);
      const T = cand.map(([k, P]) => { const t = el('g', {}, svg); el('circle', { cx: P[0], cy: P[1], r: 12, fill: 'rgba(255,255,255,.85)', stroke: C6.ink, 'stroke-width': 2.4 }, t); return { g: t, k, label: labelText('c9Spot') }; });
      const k = await tapOne(T, { ok: 'O', pad: 56 }); hush(); T.forEach(t => t.g.remove()); (item.tried = item.tried || []).push(k);
      if (k !== 'O') { const X = G.cand.find(c => c[0] === k)[1], w = el('g', { 'data-wrong': 1 }, top); c6Rays(w, X, G); pfDot(w, X); ctx.X = X; live = false; return { ans: 'cen|' + k, ctx }; }   /* الأشعّة من النقطة الخاطئة ظاهرة */
      c6Seg(top, G.O, G.A, C6.r, 3); c6Seg(top, G.O, G.B, C6.r, 3); pfDot(top, G.O); item.step = 1; SFX.tick(); }
    if (item.step === 1) { prot(G.O, G.a1, 84);   /* بحجم الدائرة: الحلقة الداخلية على 43 فلا تتراكب أعدادها، وخطّها أكبر (المراجع B لدفعة U6/U5، 2) */ arArc(lab, G.O, G.a1, G.a2, { r: 22, col: C6.arc, fill: true });   /* القوس بلا «؟» فلا يقع على أعداد المنقلة */
      if (tries >= 3 && t0 === 1) { el('path', { d: angArc(G.O, 84 - 14, G.a1, G.a2), fill: 'none', stroke: THINK_INK, 'stroke-width': 4, opacity: .8 }, helpG(svg)); await S('gen.c6.together.read'); } else c6Q('gen.c6.q.cenRead', isLive);
      const np = c6Pick(item.cens.map(([v]) => v), item.cen, true); const k = await np.p; c6Off(); if (k !== item.cen) { live = false; return { ans: 'cr|' + k, ctx }; } item.step = 2; SFX.tick(); }
    lab.innerHTML = ''; arArc(lab, G.O, G.a1, G.a2, { r: 22, col: C6.r, deg: item.cen, dl: 16, fs: 14 }); const pa = Math.atan2(G.P[1] - G.A[1], G.A[0] - G.P[0]) * 180 / Math.PI, pb = Math.atan2(G.P[1] - G.B[1], G.B[0] - G.P[0]) * 180 / Math.PI, na = ((pa % 360) + 360) % 360, nb = ((pb % 360) + 360) % 360, lo = Math.abs(((nb - na + 360) % 360) - item.want) < 1 ? na : nb;   /* المحيطية من رأسها P: من الشعاع الذي يدور منه بعكس العقارب */
    prot(G.P, lo, 56); arArc(lab, G.P, lo, lo + item.want, { r: 18, col: C6.ch, fill: true }); ctx.lo = lo;
    if (tries >= 3 && t0 === 2) { el('path', { d: angArc(G.P, 56 - 12, lo, lo + item.want), fill: 'none', stroke: THINK_INK, 'stroke-width': 4, opacity: .8 }, helpG(svg)); await S('gen.c6.together.read'); } else c6Q('gen.c6.q.insRead', isLive);
    const np = c6Pick(item.ins.map(([v]) => v), item.want, true); const k = await np.p; live = false; c6Off(); return { ans: 'ir|' + k, ctx }; },
  judge(item, a) { const [w, v] = String(a).split('|'); if (w === 'cen') return { ok: false, err: 'c6NotCenter' };
    if (w === 'cr') return { ok: false, err: (item.cens.find(([x]) => x === +v) || [])[1] || 'c6CenOff' };
    return +v === item.want ? { ok: true } : { ok: false, err: (item.ins.find(([x]) => x === +v) || [])[1] || 'c6InsOff' }; },
  onOk(item, r) { SFX.good(); const c = r && r.ctx; if (c && c.svg.isConnected) { c.svg.querySelectorAll('[data-prot], [data-prot-lab]').forEach(e => e.remove()); ciEq(c.svg, 180, 34, `${item.want} = ${item.cen} ÷ 2`, C6.ok, 15); } },   /* المنقلة تُرفع، والمحيطية نصف المركزية */
  onWrong() { SFX.soft(); },
  async hint2(item, r, err) { const c = r && r.ctx; if (c && c.svg && c.svg.isConnected) { const m = helpG(c.svg), G = c.G, pr = c.pr, cy = item.step === 2 ? 248 : 30;   /* في المحيطية المنقلة أعلى المسرح: البطاقة تحته (RUNGG) */
      if (err === 'c6NotCenter') { if (c.X) c6Rays(m, c.X, G, { col: THINK_INK, w: 2.4, dash: '5 4', len: true }); ciRule(m, 180, [30], labelText('c6AskCen3'), C6.hl, 14); }   /* الأشعّة الثلاثة من النقطة التي لمسها بأطوالها، والبطاقة فوق المسرح */
      else if (err === 'c6ReadOther' && pr) { [[pr.base, H2C[0]], [pr.base + 180, H2C[1]]].forEach(([a, col]) => { const Q = angP(pr.V, a, pr.PR - 6); Q[1] = Math.max(26, Math.min(236, Q[1])); el('circle', { cx: Q[0], cy: Q[1], r: 9, fill: 'none', stroke: col, 'stroke-width': 3 }, m); }); ciRule(m, 180, [cy], labelText('c9Ask.rotAng'), C6.hl, 15); }   /* الصفران بلونين */
      else if (err === 'c6InsEq') { el('path', { d: angArc(G.O, 30, G.a1, G.a2), fill: 'none', stroke: H2C[0], 'stroke-width': 5 }, m); if (c.lo != null) el('path', { d: angArc(G.P, 26, c.lo, c.lo + item.want), fill: 'none', stroke: H2C[1], 'stroke-width': 5 }, m); ciRule(m, 180, [cy], labelText('c6AskInsCen'), C6.hl, 15); }   /* الزاويتان من رأسيهما */
      else { const V = pr ? pr.V : G.O; hlRing(m, V, 14, H2C[0]); ciRule(m, 180, [cy], labelText('c6AskVertex'), C6.hl, 15); } }   /* الرأس الذي نقيس منه */
    await S(err === 'c6NotCenter' ? 'gen.c6.hint.cen' : err === 'c6InsEq' ? 'gen.c6.hint.insEq' : 'gen.c9.hint.prot'); },
  async together() {},
  async reveal(item, r) { const c = r && r.ctx; if (c && c.svg.isConnected) { const G = c.G; c.svg.querySelectorAll('[data-prot], [data-prot-lab], [data-wrong], [data-help]').forEach(e => e.remove());
      const s0 = item.step; c6Seg(c.top, G.O, G.A, C6.ok, 3); c6Seg(c.top, G.O, G.B, C6.ok, 3); pfDot(c.top, G.O); hlRing(c.top, G.O, 12, C6.ok);
      if (s0 === 0) c6Rays(c.top, G.O, G, { col: C6.ok, w: 2.6, dash: '5 4', len: true });   /* أخفق في المركز: أشعّته الثلاثة بأطوالها المتساوية */
      else { arArc(c.top, G.O, G.a1, G.a2, { r: 22, col: C6.r, deg: item.cen, dl: 16, fs: 14 }); if (s0 === 2) ciEq(c.svg, 180, 34, `${item.want} = ${item.cen} ÷ 2`, C6.ok, 15); } }   /* المركز مُعلَّماً، ولا أشعّة من نقطةٍ خاطئة */
    const s0 = item.step; item.step = 3;   /* الكشف بالخطوة التي أُخفقت (المراجع A لدفعة U6/U5، 13) */
    if (s0 === 0) await S('gen.c6.reveal.cen'); else if (s0 === 1) { await S('gen.c6.reveal.cenAng'); await sayDeg(item.cen); } else { await S('gen.ci4.reveal.ang'); await sayDeg(item.want); } },
  praise: () => 'praiseThink', twin(item) { return item.twin || null; },
};
