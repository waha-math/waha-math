/* =====================================================================
   M4-U3 «التطابق والتشابه»: الألعاب الحركية (D288 (2))، وأدوات ألعاب U3 وU4 المشتركة
   د1 «القطع المتطابقة» (cgPieceGame): يلمس القطعة المطابقة، ثم يديرها حتى توافق الأصل فتُنقل فوقه، ثم السبب
   د2 «أين الزاوية؟» (cgAngGame): يضع الفرجار حيث يبدأ الضلع الثالث، ثم يلمس ما يقطعه القوس من الشعاع، ثم يعلن التطابق أو عدمه
   د3 «مكبّر الصور» (enZoomGame): يختار المعامل (أو يستنتجه من ضلعٍ كبُر)، ثم يمدّ العرض والارتفاع، والقطر من الركن يتحقّق
   د5 «محقّق الرباعيات» (qdDetGame): يقلب بطاقات القطرين واحدةً واحدة، ويسمّي الرباعي حين تكفي، ثم السبب
   ===================================================================== */
const gmQ = (id, live) => { const f = () => S(id); f(); REPLAY_HOOK = f; REPLAY_HOOK.live = live; };
const gmOff = () => document.querySelectorAll('#stage .choices').forEach(x => x.remove());
const gmIco = plus => `<svg viewBox="0 0 20 20" width="20" height="20" aria-hidden="true" style="vertical-align:middle"><path d="${plus ? 'M3 8.5h5.5V3h3v5.5H17v3h-5.5V17h-3v-5.5H3z' : 'M3 8.5h14v3H3z'}" fill="currentColor"/></svg>`;
/* زرّا ضبطٍ و«تمّ»: n من lo إلى hi، والهدف في item.stepN (للّمس الحقيقي، __gmN)، وAUTO بنوع gmStep؛ atLeast: «تمّ» لا يُقبل قبل أول ضغطة فوق lo */
async function gmStep(item, n0, lo, hi, want, labels, redraw, o = {}) { let n = n0; redraw(n); item.stepN = want;
  const St = dqSteps(labels, d => { const v = Math.max(lo, Math.min(hi, n + d)); if (v === n) return false; n = v; redraw(n); return true; }, { vert: !!o.vert, icons: o.icons });
  /*T*/window.__gmN = () => n;/*/T*/
  AUTO({ kind: 'gmStep', ok: () => { n = want; redraw(n); rulDoneBtn().click(); }, wrong: () => { n = want > lo + (o.atLeast ? 1 : 0) ? want - 1 : want + 1; redraw(n); rulDoneBtn().click(); } });
  await rulDone(() => { St.off(); REPLAY_HOOK = null; }, o.atLeast ? () => n > lo : null); hush(); return n; }
/* أهدافٌ حلقاتٌ بلا تعبئة على المسرح (data-spot) */
/* gmSpots في 49_m4_b_pre.js (للألعاب كلها) */
const gmTween = (ms, fn) => symTween(FAST ? 20 : ms, fn);
/* دائرةٌ بما يقع منها داخل الإطار الورقي وحده (بلا clip-path: مساعدةٌ تُحمل إلى المسرح التالي تفقد مرجع القصّ) */
function gmArcIn(g, C, r, o = {}) { const sv = g.ownerSVGElement || g, vb = sv.viewBox && sv.viewBox.baseVal, H = vb && vb.height ? vb.height : 262, inF = P => P[0] > 22 && P[0] < 338 && P[1] > 16 && P[1] < H - 16; let d = '', on = false;
  for (let a = 0; a <= 360; a += 2) { const P = angP(C, a, r); if (inF(P)) { d += (on ? 'L' : 'M') + P[0].toFixed(1) + ' ' + P[1].toFixed(1); on = true; } else on = false; }
  return el('path', { d, fill: 'none', stroke: o.col || CG.b, 'stroke-width': o.w || 2.4, 'stroke-dasharray': o.dash || null, 'pointer-events': 'none' }, g); }

/* ---------- د1 «القطع المتطابقة» (cgPieceGame): orig، cands [المطابق بترتيبٍ دوريّ، ثم مشتّتان]، rots (دوران المشتّتين في بطاقتيهما)، kw ضغطات الدوران ---------- */
/* زاوية الدوران التي تجعل المطابقَ على وضع الأصل: الضلع الأول منه على ضلع الأصل الذي يساويه (بلا انعكاس: الترتيب دوريّ) */
function cgPcTheta(orig, cand) { const s = [0, 1, 2].find(i => cand.every((v, j) => v === orig[(j + i) % 3])); if (s == null) return null;
  const P = cgTriPts(orig, { u: 10, cx: 0, y: 0 }), Q = cgTriPts(cand, { u: 10, cx: 0, y: 0 }), A = (X, Y) => Math.atan2(Y[1] - X[1], Y[0] - X[0]) * 180 / Math.PI;
  return A(P[s], P[(s + 1) % 3]) - A(Q[0], Q[1]); }
const cgPcRot = (item, k) => item.th - 30 * (k - item.kw);
const cgPcU = item => Math.min(10, 80 / Math.max(...item.cands.flat()));
ITEM.cgPieceGame = {
  make(spec) { const th = cgPcTheta(spec.orig, spec.cands[0]); /*T*/if (TESTHOOK && (th == null || spec.cands.filter(c => cgRel(spec.orig, c) === 'cong').length !== 1)) testBug('cgPieceGame: المطابق ليس بترتيبٍ دوريّ أو ليس وحده');/*/T*/
    const order = shuffle([0, 1, 2]), whys = shuffle(['sss', 'looks', 'ang']); return { ...spec, step: 0, th, order, want: String(order.indexOf(0)), whys, ch: whys.map(k => [k]), chLab: whys.map(k => labelText('cgWhy.' + k)), tag: 'cg-piece' }; },
  async ask(item, mode, tries) { item.__try = tries; const svg = m3Stage(284), g = el('g', { 'pointer-events': 'none' }, svg), ctx = { svg, g }, t0 = item.step, TG = k => tries >= 3 && t0 === k; let live = true; const isLive = () => live && svg.isConnected;
    const u = cgPcU(item), X = [284, 180, 76];   /* مسرح 284 كـ cgPick: الأطوال المرتّبة تحت البطاقات في الحلّ المشترك */
    if (item.step === 0) { const Po = cgTri(g, item.orig, { cx: 196, y: 86, u, col: CG.c, fill: CG.fc }); preLab(g, 318, 40, labelText('cgOrig'), { dir: 'rtl', fs: 15, anchor: 'start' }); ctx.Po = Po; ctx.Pc = [];
      const T = item.order.map((ci, pos) => { const t = el('g', { 'data-card': pos }, svg); el('rect', { x: X[pos] - 50, y: 112, width: 100, height: 118, rx: 12, fill: CG.card, stroke: CG.edge, 'stroke-width': 2 }, t);
        const rot = ci === 0 ? cgPcRot(item, 0) : (item.rots || [30, -20])[ci - 1], P = cgTri(t, item.cands[ci], { cx: X[pos], y: 198, u, rot, col: CG.a, fill: CG.fa, fs: 13, fit: [X[pos] - 40, X[pos] + 40] }); ctx.Pc.push([P, item.cands[ci]]); return { g: t, k: String(pos), label: labelText('pfSet.' + pos) }; });
      if (TG(0)) { const m = helpG(svg), srt = s => cgSorted(s).map(v => MS(String(v))).join('، '); preLab(m, 196, 34, srt(item.orig), { col: CG.hl, fs: 15 }); item.order.forEach((ci, pos) => preLab(m, X[pos], 252, srt(item.cands[ci]), { col: CG.hl, fs: 14 })); await S('gen.cg.together.pcPick'); }   /* الأطوال مرتّبة، والمقارنة للطفل */
      else gmQ(tries === 0 ? item.q || 'gen.cg.q.pcPick' : 'gen.cg.q.pcPick', isLive);
      const k = await tapOne(T, { ok: item.want, pad: false }); hush(); T.forEach(t => { t.g.onclick = null; t.g.removeAttribute('role'); t.g.removeAttribute('tabindex'); });
      if (k !== item.want) { live = false; ctx.pick = +k; return { ans: 'pick|' + k, ctx }; } item.step = 1; SFX.tick(); }
    svg.querySelectorAll('[data-card]').forEach(e => e.remove()); g.innerHTML = '';
    const u2 = Math.min(13, 118 / Math.max(...item.orig)), O = [262, 168], L = [96, 168], Po = cgTri(g, item.orig, { cx: O[0], y: O[1], u: u2, col: CG.c, fill: CG.fc }); preLab(g, O[0], 258, labelText('cgOrig'), { dir: 'rtl', fs: 15 }); ctx.Po = Po;
    const lo = item.orig.indexOf(Math.max(...item.orig)), lc = item.cands[0].indexOf(Math.max(...item.cands[0])), pc = el('g', { 'pointer-events': 'none' }, svg); ctx.pc = pc;
    const draw = (k, at = L, hl) => { pc.innerHTML = ''; ctx.P = cgTri(pc, item.cands[0], { cx: at[0], y: at[1], u: u2, rot: cgPcRot(item, k), col: CG.b, fill: CG.fb }); if (hl) hlSeg(pc, ctx.P[lc], ctx.P[(lc + 1) % 3], H2C[2]); };   /* hl: الأطول ملوّناً يدور معها */
    if (item.step === 1) { const tg = TG(1), k0 = tg ? item.kw - 1 : 0;
      if (tg) { draw(k0, L, true); hlSeg(helpG(svg), Po[lo], Po[(lo + 1) % 3], H2C[2]); await S('gen.cg.together.pcRot'); }   /* الأطولان بلونٍ واحد، وبقيت ضغطةٌ واحدة */
      else gmQ('gen.cg.q.pcRot', isLive);
      const hl = tg || !!item.hlRot, k = await gmStep(item, k0, item.kw - 5, item.kw + 6, item.kw, ['c9TurnCw', 'c9TurnCcw'], v => draw(v, L, hl), { icons: [c9TurnIcon(-1), c9TurnIcon(1)] });   /* بعد المستوى الثاني: الأطول ملوّناً يدور معها */
      if (k !== item.kw) { live = false; ctx.k = k; return { ans: 'rot|' + k, ctx }; }
      item.step = 2; SFX.tick(); await gmTween(700, t => draw(item.kw, [L[0] + (O[0] - L[0]) * t, L[1] + (O[1] - L[1]) * t])); }   /* تُنقل فوق الأصل فتنطبق */
    else draw(item.kw, O);
    cgPcTicks(g, Po); ctx.done = true;
    if (TG(2)) { ciRule(helpG(svg), 180, [36, 70], labelText('cgRuleSss'), CG.hl, 15); await S('gen.cg.together.pcWhy'); } else gmQ('gen.cg.q.pcWhy', isLive);
    const k = await choosePick(item.whys.map(w => [w, labelText('cgWhy.' + w), '<i></i>', 'gen.cg.why.' + w]), 'sss'); live = false; gmOff(); return { ans: 'why|' + k, ctx }; },
  judge(item, a) { const [w, v] = String(a).split('|');
    if (w === 'pick') return { ok: false, err: cgRel(item.orig, item.cands[item.order[+v]]) === 'sim' ? 'cgSimAsCong' : 'cgSideOff' }; if (w === 'rot') return { ok: false, err: 'cgRotOff' };
    return v === 'sss' ? { ok: true } : { ok: false, err: v === 'ang' ? 'preCaseAaa' : 'cgLooks' }; },
  onOk() { SFX.good(); }, onWrong() { SFX.soft(); },
  async hint2(item, r, err) { const c = r && r.ctx; if (c && c.svg && c.svg.isConnected) { const m = helpG(c.svg);
      if (err === 'cgRotOff') { const lo = item.orig.indexOf(Math.max(...item.orig)); hlSeg(m, c.Po[lo], c.Po[(lo + 1) % 3], H2C[2]); item.hlRot = true; ciRule(m, 180, [36, 70], labelText('cgAskRot'), CG.hl, 15); }   /* الأطول في الأصل، وفي القطعة يدور معها من المحاولة التالية */
      else if (!c.done && c.Pc) { const thin = (P, s) => { const V = [...new Set(s)].sort((x, y) => x - y); [[0, 1, s[0]], [1, 2, s[1]], [2, 0, s[2]]].forEach(([i, j, v]) => hlSeg(m, P[i], P[j], H2C[V.length === 3 ? V.indexOf(v) : V.indexOf(v) ? 2 : 0], { w: 5 })); }; thin(c.Po, item.orig); c.Pc.forEach(([P, s]) => thin(P, s)); ciRule(m, 180, 252, labelText('cgRuleSss'), CG.hl, 15); }   /* الأضلاع بألوان أطوالها، والقاعدة تحت البطاقات */
      else ciRule(m, 180, [36, 70], labelText('cgRuleSss'), CG.hl, 15); }
    await S(err === 'cgRotOff' ? 'gen.cg.hint.pcRot' : err === 'cgLooks' || err === 'preCaseAaa' ? 'gen.cg.hint.pcWhy' : 'gen.cg.hint.pick'); },
  async together() {},
  async reveal(item, r) { const c = r && r.ctx; if (c && c.svg.isConnected) { c.svg.querySelectorAll('[data-card], [data-help]').forEach(e => e.remove()); if (c.pc) c.pc.remove(); c.g.innerHTML = '';
      const u2 = Math.min(13, 118 / Math.max(...item.orig)), Po = cgTri(c.g, item.orig, { cx: 262, y: 168, u: u2, col: CG.c, fill: CG.fc }); preLab(c.g, 262, 258, labelText('cgOrig'), { dir: 'rtl', fs: 15 });
      cgTri(c.g, item.cands[0], { cx: 262, y: 168, u: u2, rot: cgPcRot(item, item.kw), col: CG.b, fill: CG.fb }); cgPcTicks(c.g, Po); }
    item.step = 3; await S('gen.cg.reveal.pc'); },
  praise: () => 'praiseThink', twin(item) { return item.twin || null; },
};
function cgPcTicks(g, P) { [0, 1, 2].forEach(i => preTicks(g, P[i], P[(i + 1) % 3], i + 1, CG.ok)); }

/* ---------- د2 «أين الزاوية؟» (cgAngGame): cs sas | ssa، p القاعدة، L طول الضلع الثالث المعلوم، th الزاوية عند رأسها V، mir: الزاوية عند ب ---------- */
/* sas: الضلع الثالث من V على الشعاع (الزاوية بين الضلعين) فمثلثٌ واحد؛ ssa: من W الطرف الآخر فقد يقطع الشعاع مرتين */
function cgAgRoots(it) { const p = it.p, q = it.L, c = Math.cos(it.th * Math.PI / 180), s = Math.sin(it.th * Math.PI / 180);
  if (it.cs === 'sas') return [q]; const D = q * q - p * p * s * s; if (D < 0) return []; const r = Math.sqrt(D); return [p * c - r, p * c + r].filter(t => t > .2); }
function cgAgGeo(it) { const R = cgAgRoots(it), Lr = Math.max(...R, it.L) + 1.6, c = Math.cos(it.th * Math.PI / 180), s = Math.sin(it.th * Math.PI / 180);
  const xl = Math.min(0, Lr * c), xr = Math.max(it.p, Lr * c), u = Math.min(26, 262 / (xr - xl), 114 / (Lr * s)), sg = it.mir ? -1 : 1, x0 = it.mir ? 316 + xl * u : 44 - xl * u;
  const V = [x0, 180], W = [x0 + sg * it.p * u, 180], dir = it.mir ? 180 - it.th : it.th, at = t => angP(V, dir, t * u);
  return { u, V, W, dir, at, R, Lr, Cn: it.cs === 'sas' ? V : W, nV: it.mir ? 'ب' : 'أ', nW: it.mir ? 'أ' : 'ب' }; }
function cgAgSpots(it, G) { const T = G.R.map((t, i) => ['x' + i, G.at(t)]), D = [];
  if (it.cs === 'ssa' && G.R.length === 2) D.push(['d0', G.at((G.R[0] + G.R[1]) / 2)]); else D.push(['d0', G.at(it.L + 1.5)]);   /* على الشعاع داخل القوس أو بعده */
  const B = [G.Cn[0] + (it.cs === 'sas' ? 1 : -1) * (it.mir ? -1 : 1) * it.L * G.u, G.Cn[1]]; D.push(['d1', B]);   /* على القوس، على القاعدة لا على الشعاع */
  return T.concat(D); }
function cgAgBase(svg, it, G) { const g = el('g', { 'pointer-events': 'none' }, svg), E = G.at(G.Lr);
  geoLine(g, G.V[0], G.V[1], E[0], E[1], { color: CG.q, w: 3 }); geoLine(g, G.V[0], G.V[1], G.W[0], G.W[1], { color: CG.a, w: 4.4 });
  arArc(g, G.V, it.mir ? 180 - it.th : 0, it.mir ? 180 : it.th, { r: 30, col: CG.c, deg: it.th, dl: 22, fs: 14, fill: true });
  [G.V, G.W].forEach(P => pfDot(g, P)); pfLab(g, G.V[0] + (it.mir ? 12 : -12), G.V[1] + 20, G.nV, { fs: 15 }); pfLab(g, G.W[0] + (it.mir ? -12 : 12), G.W[1] + 20, G.nW, { fs: 15 });
  preLab(g, (G.V[0] + G.W[0]) / 2, G.V[1] + 22, MS(String(it.p)), { fs: 15, col: CG.a });
  const sd = it.cs === 'sas' ? G.nV : G.nW, cx = it.mir ? 82 : 278, card = el('g', { 'data-card3': 1 }, g); el('rect', { x: cx - 52, y: 22, width: 104, height: 34, rx: 9, fill: CG.card, stroke: CG.edge, 'stroke-width': 2 }, card);
  preLab(card, cx, 45, sd + ' ج = ' + MS(String(it.L)), { dir: 'rtl', fs: 16, col: CG.b }); G.card = [cx - 52, 22, 104, 34]; return g; }   /* البطاقة في الركن البعيد عن الشعاع */   /* الضلع الثالث المعلوم: اسمه يقول من أين يبدأ */
function cgAgArc(svg, it, G, Cn, col = CG.b, dash) { const g = el('g', { 'pointer-events': 'none' }, svg); gmArcIn(g, Cn, it.L * G.u, { col, dash }); pfDot(g, Cn); return g; }
function cgAgTri(svg, G, X, col) { const g = el('g', { 'pointer-events': 'none' }, svg); el('polygon', { points: polyStr([G.V, G.W, X]), fill: col, opacity: .22, stroke: 'none' }, g); geoLine(g, G.Cn[0], G.Cn[1], X[0], X[1], { color: CG.b, w: 3.6 }); el('circle', { cx: X[0], cy: X[1], r: 6, fill: CG.b, stroke: '#fff', 'stroke-width': 2 }, g); return g; }
ITEM.cgAngGame = {
  make(spec) { const R = cgAgRoots(spec); /*T*/if (TESTHOOK && R.length !== (spec.cs === 'sas' ? 1 : 2)) testBug('cgAngGame: عدد المثلثات لا يوافق الحالة');/*/T*/
    return { ...spec, step: 0, found: [], want: spec.cs === 'sas' ? 'one' : 'two', ch: [['one'], ['two']], chLab: ['one', 'two'].map(k => labelText('cgAg.' + k)), tag: 'cg-ang-' + spec.cs }; },
  async ask(item, mode, tries) { item.__try = tries; const svg = m3Stage(262), G = cgAgGeo(item), ctx = { svg, G }, t0 = item.step, TG = k => tries >= 3 && t0 === k; let live = true; const isLive = () => live && svg.isConnected;
    cgAgBase(svg, item, G); const TC = [H2C[1], H2C[2]];
    if (item.step === 0) { if (TG(0)) { const m = helpG(svg), [x, y, w, h] = G.card; hlSeg(m, G.V, G.W, H2C[0]); el('rect', { x: x - 4, y: y - 4, width: w + 8, height: h + 8, rx: 11, fill: 'none', stroke: THINK_INK, 'stroke-width': 2.6, 'stroke-dasharray': '6 4' }, m); await S('gen.cg.together.agCenter'); }   /* القاعدة واسم الضلع الثالث */
      else gmQ(tries === 0 ? item.q || 'gen.cg.q.agCenter' : 'gen.cg.q.agCenter', isLive);
      const k = await gmSpots(svg, [['V', G.V], ['W', G.W]], G.Cn === G.V ? 'V' : 'W', { label: 'cgSpotC' }); hush();
      if ((k === 'V') !== (G.Cn === G.V)) { live = false; ctx.wrongC = k === 'V' ? G.V : G.W; return { ans: 'center|' + k, ctx }; } item.step = 1; SFX.tick();
      if (!FAST) { const a = await c8Sweep(svg, G.Cn, item.L * G.u, 0, 180, true); a.remove(); } }   /* نصف القوس فوق القاعدة داخل الإطار، ثم الدائرة مقصوصةً عليه */
    cgAgArc(svg, item, G, G.Cn); item.found.forEach(i => cgAgTri(svg, G, G.at(G.R[i]), TC[i]));
    if (item.step === 1) { const tg = TG(1); if (tg) { const m = helpG(svg); hlSeg(m, G.V, G.at(G.Lr), H2C[0], { w: 7 }); await S('gen.cg.together.agCut'); }   /* الشعاع ملوّناً: النقاط عليه وعلى القوس معاً */
      else gmQ(item.found.length ? 'gen.cg.q.agMore' : t0 === 1 && tries > 0 ? 'gen.cg.q.agCut' : 'gen.cg.q.agCut', isLive);
      for (;;) { const S0 = cgAgSpots(item, G).filter(([k]) => !(k[0] === 'x' && item.found.includes(+k.slice(1)))), ok = S0.filter(([k]) => k[0] === 'x').map(([k]) => k);
        const k = await gmSpots(svg, S0, ok, { bad: 'd0' }); hush();
        if (k[0] !== 'x') { live = false; ctx.dec = S0.find(x => x[0] === k)[1]; return { ans: 'cut|' + k, ctx }; }
        const i = +k.slice(1); item.found.push(i); cgAgTri(svg, G, G.at(G.R[i]), TC[i]); SFX.tick(); if (item.found.length >= G.R.length) break; gmQ('gen.cg.q.agMore', isLive); }
      item.step = 2; }
    if (TG(2)) { ciRule(helpG(svg), 180, [236], labelText('cgRulePost'), CG.hl, 15); await S('gen.cg.together.agSay'); } else gmQ('gen.cg.q.agSay', isLive);
    const k = await choosePick(item.ch.map(([w]) => [w, labelText('cgAg.' + w), '<i></i>', 'gen.cg.ag.' + w]), item.want); live = false; gmOff(); return { ans: 'say|' + k, ctx }; },
  judge(item, a) { const [w, v] = String(a).split('|'); if (w === 'center') return { ok: false, err: 'cgAgCenter' }; if (w === 'cut') return { ok: false, err: 'cgAgNotOn' };
    return v === item.want ? { ok: true } : { ok: false, err: item.cs === 'ssa' ? 'preCaseSsa' : 'preCaseNo' }; },
  onOk() { SFX.good(); }, onWrong() { SFX.soft(); },
  async hint2(item, r, err) { const c = r && r.ctx; if (c && c.svg && c.svg.isConnected) { const m = helpG(c.svg), G = c.G;
      if (err === 'cgAgCenter' && c.wrongC) { gmArcIn(m, c.wrongC, item.L * G.u, { col: THINK_INK, w: 2.2, dash: '6 5' }); ciRule(m, 180, [236], labelText('cgAgAskFrom').split('X').join(item.cs === 'sas' ? G.nV : G.nW), CG.hl, 14); }   /* قوسٌ شبحٌ من النقطة التي اختارها: الضلع لا يبدأ منها */
      else if (err === 'cgAgNotOn') { hlSeg(m, G.V, G.at(G.Lr), H2C[0]); if (c.dec) hlRing(m, c.dec, 14, THINK_INK); ciRule(m, 180, [236], labelText('cgAgAskOn'), CG.hl, 14); }   /* على الشعاع وعلى القوس معاً */
      else ciRule(m, 180, [236], labelText('cgRulePost'), CG.hl, 14); }   /* تحت القاعدة: الأعلى للشعاع وبطاقة الضلع */
    await S(err === 'cgAgCenter' ? 'gen.cg.hint.agCenter' : err === 'cgAgNotOn' ? 'gen.cg.hint.agCut' : 'gen.cg.hint.agSay'); },
  async together() {},
  async reveal(item, r) { const c = r && r.ctx; if (c && c.svg.isConnected) { const G = c.G; cgAgArc(c.svg, item, G, G.Cn); G.R.forEach((t, i) => { if (!item.found.includes(i)) cgAgTri(c.svg, G, G.at(t), [H2C[1], H2C[2]][i]); }); }
    item.step = 3; await S('gen.cg.reveal.ag.' + item.cs); },
  praise: () => 'praiseThink', twin(item) { return item.twin || null; },
};

/* ---------- د3 «مكبّر الصور» (enZoomGame): fig rect | tri، w، h؛ ks معاملان يختار أحدهما، أو k وW (العرض كبُر، فالمعامل يُستنتج)، والمكبَّر من الركن نفسه ---------- */
function enZmGeo(it) { const kmax = it.ks ? Math.max(...it.ks) : it.k, Wm = kmax * it.w + 2, Hm = kmax * it.h + 2, u = Math.min(26, 260 / Wm, 172 / Hm); return { u, O: [44, 222], Wm, Hm, kmax }; }   /* الشبكة بأكبر ما تبلغه الأزرار، وأعداد الأبعاد داخل الإطار */
const enZmPts = (G, w, h, fig) => { const O = G.O, u = G.u, X = O[0] + w * u, Y = O[1] - h * u; return fig === 'tri' ? [O, [X, O[1]], [X, Y]] : [O, [X, O[1]], [X, Y], [O[0], Y]]; };
function enZmGrid(g, G) { for (let i = 0; i <= G.Wm; i++) geoLine(g, G.O[0] + i * G.u, G.O[1], G.O[0] + i * G.u, G.O[1] - G.Hm * G.u, { color: '#dbe5ec', w: 1 }); for (let j = 0; j <= G.Hm; j++) geoLine(g, G.O[0], G.O[1] - j * G.u, G.O[0] + G.Wm * G.u, G.O[1] - j * G.u, { color: '#dbe5ec', w: 1 }); }
function enZmDraw(g, G, it, W, H) { g.innerHTML = ''; const P = enZmPts(G, W, H, it.fig); el('polygon', { points: polyStr(P), fill: 'rgba(217,130,43,.10)', stroke: CG.b, 'stroke-width': 3, 'stroke-linejoin': 'round' }, g);
  preLab(g, (G.O[0] + P[1][0]) / 2, G.O[1] + 18, MS(String(W)), { fs: 15, col: CG.b }); preLab(g, P[1][0] + 9, (G.O[1] + P[2][1]) / 2 + 5, MS(String(H)), { fs: 15, col: CG.b, anchor: 'start' }); }   /* أبعاد المكبَّر خارجه: تحته ويمينه */
function enZmOrig(g, G, it) { const P = enZmPts(G, it.w, it.h, it.fig); el('polygon', { points: polyStr(P), fill: CG.fa, stroke: CG.a, 'stroke-width': 3, 'stroke-linejoin': 'round' }, g);
  preLab(g, (G.O[0] + P[1][0]) / 2 + (it.fig === 'tri' ? G.u * it.w / 6 : 0), G.O[1] - 7, MS(String(it.w)), { fs: 15, col: CG.a }); preLab(g, it.fig === 'tri' ? P[1][0] - 7 : G.O[0] - 8, (G.O[1] + P[2][1]) / 2 + (it.fig === 'tri' ? 12 : 5), MS(String(it.h)), { fs: 15, col: CG.a, anchor: 'end' }); return P; }   /* أبعاد الأصل داخله (وارتفاع المستطيل يساره) */
function enZmDiag(g, G, it, col, solid) { const C = [G.O[0] + it.w * G.u, G.O[1] - it.h * G.u], t = Math.min((G.Wm * G.u) / (C[0] - G.O[0]), (G.Hm * G.u) / (G.O[1] - C[1])), E = [G.O[0] + (C[0] - G.O[0]) * t, G.O[1] - (G.O[1] - C[1]) * t]; geoLine(g, G.O[0], G.O[1], E[0], E[1], { color: col, w: 2.6, dash: solid ? null : '7 5' }); }   /* القطر من الركن عبر رأس الأصل: يمرّ برأس المكبَّر إن تناسبت الأضلاع */
ITEM.enZoomGame = {
  make(spec) { const ded = spec.k != null, ks = ded ? null : spec.ks, ch = ded ? rkPick(spec.k, [[spec.k * spec.w - spec.w, 'enAdd'], [Math.round(spec.k * spec.w / spec.h * 100) / 100, 'enCross'], [spec.k + 1, 'enOff']], spec.rk ?? 0) : ks.map(k => [k]);
    /*T*/if (TESTHOOK && ded && !Number.isInteger(spec.k * spec.h)) testBug('enZoomGame: الارتفاع المكبَّر ليس عدداً صحيحاً');/*/T*/
    return { ...spec, step: 0, kk: ded ? spec.k : null, ch, tag: 'en-zoom-' + (ded ? 'ded' : 'pick') }; },
  async ask(item, mode, tries) { item.__try = tries; const svg = m3Stage(262), G = enZmGeo(item), g0 = el('g', { 'pointer-events': 'none' }, svg), ctx = { svg, G }, t0 = item.step, TG = k => tries >= 3 && t0 === k; let live = true; const isLive = () => live && svg.isConnected;
    enZmGrid(g0, G); const ge = el('g', { 'pointer-events': 'none' }, svg); ctx.ge = ge; enZmOrig(svg, G, item); const ded = item.k != null;
    const kTxt = v => '× ' + MS(String(v)), kLab = el('g', { 'pointer-events': 'none' }, svg), showK = () => { kLab.innerHTML = ''; if (item.kk != null) preLab(kLab, 300, 40, kTxt(item.kk), { fs: 18, col: CG.c }); };
    if (item.step === 0) { if (ded) enZmDraw(ge, G, item, item.k * item.w, item.h);
      if (TG(0)) { ciEq(helpG(svg), 170, 40, `${item.k * item.w} ÷ ${item.w} = ؟`, CG.hl, 16); await S('gen.en.together.zmK'); }   /* القسمة مكتوبة، والناتج للطفل */
      else gmQ(ded ? (tries === 0 ? item.q || 'gen.en.q.zmDed' : 'gen.en.q.zmDed') : tries === 0 ? item.q || 'gen.en.q.zmPick' : 'gen.en.q.zmPick', isLive);
      const k = await choosePick((ded ? shuffle(item.ch) : item.ch).map(([v]) => [String(v), kTxt(v), '<i></i>', 'gen.en.k.' + v]), ded ? String(item.k) : null); gmOff();
      if (ded && +k !== item.k) { live = false; return { ans: 'k|' + k, ctx }; } item.kk = +k; item.step = ded ? 2 : 1; SFX.tick(); }   /* بالاستنتاج: العرض مكبَّرٌ، فالارتفاع بعده */
    showK(); const k = item.kk, Wt = k * item.w, Ht = k * item.h; let W = ded || item.step > 1 ? Wt : item.w, H = item.h;
    if (item.step === 1) { const tg = TG(1); if (tg) { enZmDiag(helpG(svg), G, item, THINK_INK); ciEq(helpG(svg), 170, 40, `${item.w} × ${k} = ؟`, CG.hl, 16); await S('gen.en.together.zmW'); } else gmQ('gen.en.q.zmW', isLive);
      const n = await gmStep(item, tg ? Wt - 1 : item.w, 1, Math.round(G.kmax * item.w) + 2, Wt, ['enNarrow', 'enWider'], v => { W = v; enZmDraw(ge, G, item, v, H); });
      if (n !== Wt) { live = false; ctx.W = n; return { ans: 'w|' + n, ctx }; } item.step = 2; SFX.tick(); }
    W = Wt; const tg = TG(2); if (tg) { enZmDiag(helpG(svg), G, item, THINK_INK); await S('gen.en.together.zmH'); } else gmQ('gen.en.q.zmH', isLive);
    const n = await gmStep(item, tg ? Ht - 1 : item.h, 1, Math.round(G.kmax * item.h) + 2, Ht, ['enLower', 'enTaller'], v => { H = v; enZmDraw(ge, G, item, W, v); }, { vert: true });
    live = false; ctx.W = W; ctx.H = n; return { ans: 'h|' + n, ctx }; },
  judge(item, a) { const [w, v] = String(a).split('|'), n = +v, k = item.kk;
    if (w === 'k') return { ok: false, err: (item.ch.find(([x]) => String(x) === v) || [])[1] || 'enOff' };
    if (w === 'w') return { ok: false, err: n === item.w ? 'enLenSame' : n === item.w + k ? 'enAdd' : 'enOff' };
    return n === k * item.h ? { ok: true } : { ok: false, err: n === item.h ? 'enOneSide' : n - item.h === k * item.w - item.w ? 'enAdd' : 'enOff' }; },
  onOk(item, r) { SFX.good(); const c = r && r.ctx; if (c && c.svg.isConnected) { enZmDiag(c.svg, c.G, item, CG.ok, true); ciEq(c.svg, 170, 40, `${c.W} ÷ ${item.w} = ${c.H} ÷ ${item.h}`, CG.ok, 15); } },   /* القطر يمرّ بالرأسين: الأضلاع متناسبة */
  onWrong() { SFX.soft(); },
  async hint2(item, r, err) { const c = r && r.ctx; if (c && c.svg && c.svg.isConnected) { const m = helpG(c.svg);
      if (item.step >= 1 && item.kk != null) { enZmDiag(m, c.G, item, THINK_INK); ciRule(m, 170, [36], labelText('enAskDiag'), CG.hl, 14); }   /* القطر الشبح من الركن عبر رأس الأصل: رأس المكبَّر عليه */
      else ciRule(m, 170, [36], labelText('enAskK'), CG.hl, 14); }
    await S(item.step === 0 ? 'gen.en.hint.zmK' : 'gen.en.hint.zm'); },
  async together() {},
  async reveal(item, r) { const c = r && r.ctx; if (item.kk == null) item.kk = item.k ?? item.ks[0]; if (c && c.svg.isConnected) { enZmDraw(c.ge, c.G, item, item.kk * item.w, item.kk * item.h); enZmDiag(c.svg, c.G, item, CG.ok, true); }
    item.step = 3; await S('gen.en.reveal.zm'); },
  praise: () => 'praiseThink', twin(item) { return item.twin || null; },
};

/* ---------- د5 «محقّق الرباعيات» (qdDetGame): info { mid، eq، perp }، order ترتيب البطاقات؛ يقلب ما يشاء منها ويسمّي حين تكفي، ثم السبب ---------- */
const QD_NAMES = ['para', 'rect', 'rhom', 'square', 'other'];
const qdNm = i => i.mid ? QD_OF(i) : 'other';
function qdCan(rev) { const S2 = new Set(); for (const mid of [false, true]) for (const eq of [false, true]) for (const perp of [false, true]) { const i = { mid, eq, perp }; if (Object.keys(rev).every(k => rev[k] === i[k])) S2.add(qdNm(i)); } return S2; }   /* الأسماء الممكنة بما قُلب */
const QD_WHY = { rect: ['rect', 'eqOnly', 'looks'], other: ['other', 'eqRect', 'looks'], square: ['square', 'perpOnly', 'looks'], rhom: ['rhom', 'perpOnly', 'looks'], para: ['para', 'eqOnly', 'looks'] };
ITEM.qdDetGame = {
  make(spec) { const want = qdNm(spec.info), need = want === 'other' ? 1 : 3; return { ...spec, step: 0, rev: {}, flips: 0, want, need, whys: shuffle(QD_WHY[want].slice()), ch: QD_WHY[want].map(k => [k]), chLab: QD_WHY[want].map(k => labelText('qdWhy.' + k)), tag: 'qd-det-' + want }; },
  async ask(item, mode, tries) { item.__try = tries; const svg = m3Stage(262), ctx = { svg }, t0 = item.step, TG = k => tries >= 3 && t0 === k; let live = true; const isLive = () => live && svg.isConnected;
    const order = item.order || ['mid', 'eq', 'perp'], sk = el('g', { 'pointer-events': 'none' }, svg), cards = el('g', {}, svg), CY = i => 22 + i * 44;
    const sketch = () => { sk.innerHTML = ''; const i = { mid: !!item.rev.mid, eq: !!item.rev.eq, perp: !!item.rev.perp }; qdSketch(sk, i, [80, 90], true); };   /* رباعيٌّ ممكنٌ بما قُلب (وما لم يُقلب «لا») */
    const drawCards = () => { cards.innerHTML = ''; const T = []; order.forEach((k, i) => { const y = CY(i), on = k in item.rev, t = el('g', { 'data-qd': k }, cards);
      el('rect', { x: 146, y, width: 186, height: 38, rx: 10, fill: on ? (item.rev[k] ? 'rgba(47,157,107,.10)' : '#f6f2ea') : '#e9eef3', stroke: on ? (item.rev[k] ? CG.ok : CG.edge) : '#9fb3c2', 'stroke-width': 2 }, t);
      preLab(t, 322, y + 24, labelText('qdAsk.' + k), { dir: 'rtl', fs: 13, anchor: 'start' }); preLab(t, 164, y + 25, on ? labelText(item.rev[k] ? 'qdYes' : 'qdNo') : '؟', { dir: 'rtl', fs: on ? 14 : 18, col: on ? (item.rev[k] ? CG.ok : '#8a7f6e') : CG.q });
      if (!on) T.push({ g: t, k: 'c:' + k, label: labelText('qdAsk.' + k) }); }); return T; };
    const chips = () => QD_NAMES.map((k, i) => { const row = i < 3 ? 0 : 1, w = 98, x = row ? 78 + (i - 3) * 106 : 25 + i * 106, y = row ? 204 : 164, t = el('g', { 'data-qn': k }, svg);
      el('rect', { x, y, width: w, height: 34, rx: 9, fill: CG.card, stroke: CG.a, 'stroke-width': 2 }, t); preLab(t, x + w / 2, y + 22, labelText('qdName.' + k), { dir: 'rtl', fs: 12.5 }); return { g: t, k: 'n:' + k, label: labelText('qdName.' + k) }; });
    if (item.step === 0) { if (TG(0)) order.forEach(k => { if (!(k in item.rev)) item.rev[k] = !!item.info[k]; });   /* الحلّ المشترك: البطاقات كلها مقلوبة، والقاعدة في الجملة */
      sketch(); let C = chips(); if (TG(0)) await S('gen.cg.together.qdDet'); else gmQ(tries === 0 ? item.q || 'gen.cg.q.qdDet' : 'gen.cg.q.qdDet', isLive);
      for (;;) { const T = drawCards(), can = qdCan(item.rev), done = can.size === 1, need = order.filter(k => !(k in item.rev));
        const ok = done ? 'n:' + item.want : 'c:' + (item.want === 'other' && need.includes('mid') ? 'mid' : need[0]), bad = 'n:' + (item.want === 'para' ? 'rect' : 'para');   /* السائق: يقلب ما يلزم ثم يسمّي، ويخطئ باسمٍ */
        const k = await tapOne(T.concat(C), { ok, bad, pad: 56 }); hush();   /* منطقة لمسٍ 56 بكسلاً (البطاقة 38 وحدة)، واللمسة لما تحت الإصبع (tapRoute) */
        if (k.startsWith('c:')) { const kk = k.slice(2); item.rev[kk] = !!item.info[kk]; item.flips++; SFX.tick(); sketch(); C.forEach(t => t.g.remove()); C = chips(); continue; }
        const nm = k.slice(2); C.forEach(t => t.g.remove()); cards.querySelectorAll('[data-qd]').forEach(e => { e.onclick = null; e.removeAttribute('role'); });
        if (nm !== item.want || !done) { live = false; ctx.nm = nm; ctx.early = nm === item.want || can.has(nm); return { ans: 'name|' + nm + '|' + (done ? 1 : 0), ctx }; }
        break; }
      item.step = 1; SFX.tick(); if (item.flips > item.need) await S('gen.cg.qdDet.fewer'); }
    else { order.forEach(k => { if (!(k in item.rev)) item.rev[k] = !!item.info[k]; }); sketch(); }
    drawCards(); preLab(svg, 180, 196, labelText('qdName.' + item.want), { dir: 'rtl', fs: 18, col: CG.ok });
    if (TG(1)) { cards.querySelectorAll('[data-qd]').forEach((e, i) => { if (item.rev[order[i]]) hlRing(helpG(svg), [164, CY(i) + 19], 16, THINK_INK); }); await S('gen.cg.together.qdWhy'); } else gmQ('gen.cg.q.qdWhy', isLive);
    const k = await choosePick(item.whys.map(w => [w, labelText('qdWhy.' + w), '<i></i>', 'gen.cg.qdWhy.' + w]), item.want); live = false; gmOff(); return { ans: 'why|' + k, ctx }; },
  judge(item, a) { const [w, v] = String(a).split('|');
    if (w === 'name') { const k = v, want = item.want; if (k === want || qdCan(item.rev).has(k)) return { ok: false, err: 'qdEarly' };
      return { ok: false, err: want === 'other' ? (k === 'rect' ? 'qdEqOnly' : k === 'rhom' ? 'qdPerpOnly' : 'qdNoMid') : k === 'para' ? 'qdMissProp' : k === 'other' ? 'qdNoConv' : want === 'square' && (k === 'rect' || k === 'rhom') ? 'qdGeneral' : 'qdWrongName' }; }
    return v === item.want ? { ok: true } : { ok: false, err: v === 'looks' ? 'cgLooks' : v === 'perpOnly' ? 'qdPerpOnly' : 'qdEqOnly' }; },
  onOk() { SFX.good(); }, onWrong() { SFX.soft(); },
  async hint2(item, r, err) { const c = r && r.ctx; if (c && c.svg && c.svg.isConnected) { const m = helpG(c.svg), order = item.order || ['mid', 'eq', 'perp'];
      if (err === 'qdEarly') order.forEach((k, i) => { if (!(k in item.rev)) hlRing(m, [164, 22 + i * 44 + 19], 16, THINK_INK); });   /* البطاقات المقلوبة بعد */
      else if (item.step >= 1) ciRule(m, 180, [232], labelText('cgRuleQd'), CG.hl, 13);
      else order.forEach((k, i) => { if (k in item.rev) hlRing(m, [164, 22 + i * 44 + 19], 16, item.rev[k] ? CG.ok : THINK_INK); }); }   /* ما قُلب: نعم ولا */
    await S(err === 'qdEarly' ? 'gen.cg.hint.qdEarly' : item.step >= 1 ? 'gen.cg.hint.qdWhy' : 'gen.cg.hint.qd'); },
  async together() {},
  async reveal(item, r) { const c = r && r.ctx; (item.order || ['mid', 'eq', 'perp']).forEach(k => { item.rev[k] = !!item.info[k]; });
    if (c && c.svg.isConnected) { c.svg.querySelectorAll('[data-qn]').forEach(e => e.remove()); preLab(c.svg, 180, 196, labelText('qdName.' + item.want), { dir: 'rtl', fs: 18, col: CG.ok }); }
    item.step = 2; await S('gen.cg.reveal.qdDet.' + item.want); },
  praise: () => 'praiseThink', twin(item) { return item.twin || null; },
};
