/* ================= M4-U5 الألعاب الحركية (D288 (2)، خطة ألعاب المرحلة 4) =================
   على المستوى الكامل: يلمس الربع ثم يضع النقطة فيُفتح الكنز؛ ويضع رأس الزاوية القائمة بين نقطتين فيظهر الضلعان ثم يحسب الوتر ويقيسه؛
   ويضع نقطتين من المعادلة فيُرسم المستقيم ثم يجد نقطةً عليه. الخطوات تبقى بعد الخطأ، والحلّ المشترك في الخطوة التي وقف عندها الطفل. */
const c5Q = (id, live, pair) => { const f = async () => { await S(id, pair ? { noGap: true } : {}); if (pair && live()) await S(pair, { append: true }); }; f(); REPLAY_HOOK = f; REPLAY_HOOK.live = live; };
const c5Off = () => document.querySelectorAll('#stage .choices').forEach(x => x.remove());
/* المستوى الثاني المنقول يُدرج قبل الانتظار، وأعداد المحورين تحته تُخفى من أول لحظة (كمرآة الكنز) */
const c5Carry = (svg, Pl) => { if (HELP_CARRY && HELP_CARRY.flow === FLOW) { for (const n of HELP_CARRY.nodes) svg.appendChild(n.cloneNode(true)); c9HelpHide(svg, Pl); } };
/* النقطة الموضوعة لا تقع على عدد محور (ما يرسمه c9PlaceOne لا يُخفي ما تحته) */
const c5Under = (Pl, cell) => { const P = Pl.P(...cell); c4Hide(Pl, [[P[0] - 9, P[1] - 9, P[0] + 9, P[1] + 9]]); };

/* ---------- د1 «صائد الكنز في الأرباع» (c5Hunt): x، y؛ يلمس ربع الزوج، ثم يضع النقطة فيُفتح الكنز ---------- */
ITEM.c5Hunt = {
  make(spec) { const ex = c4Ext([[spec.x, spec.y]], 5); return { ...spec, step: 0, want: [spec.x, spec.y], wq: c4QuadOf(spec.x, spec.y), n: ex.n, ny: ex.ny, tag: 'c5-hunt' }; },
  async ask(item, mode, tries) { item.__try = tries; const svg = m3Stage(262), Pl = c4Plane(svg, { n: item.n, ny: item.ny }), O = Pl.P(0, 0), ctx = { svg, Pl }, t0 = item.step; let live = true; const isLive = () => live && svg.isConnected;
    c4Card(svg, item.x, item.y); c5Carry(svg, Pl); const pair = 'gen.c4.pt.' + preKey(item.want);
    const qg = el('g', {}, svg), quad = (q, sx, sy, op) => { const x0 = Math.min(O[0], O[0] + sx * Pl.n * Pl.c), y0 = Math.min(O[1], O[1] - sy * Pl.m * Pl.c), g = el('g', {}, qg); el('rect', { x: x0 + 2, y: y0 + 2, width: Pl.n * Pl.c - 4, height: Pl.m * Pl.c - 4, rx: 8, fill: C4.hl || SO.hl, opacity: op }, g); return { g, k: q, label: labelText('c4Q.' + q) }; };
    const Q4 = [['q1', 1, 1], ['q2', -1, 1], ['q3', -1, -1], ['q4', 1, -1]];
    if (item.step === 0) { const tg = tries >= 3, T = Q4.filter(([, sx]) => !tg || sx === Math.sign(item.x)).map(([q, sx, sy]) => quad(q, sx, sy, .1));   /* الحلّ المشترك: ربعا جهة السين وحدهما، والربع من اثنين للطفل */
      if (tg) await S('gen.c5.together.quad'); else c5Q(tries === 0 ? item.q || 'gen.c5.q.quad' : 'gen.c5.q.quad', isLive, pair);
      const q = await tapOne(T, { ok: item.wq, pad: 56, pulse: false }); hush(); REPLAY_HOOK = null; untarget(T.map(t => t.g));
      T.forEach(t => t.g.querySelector('rect').setAttribute('opacity', t.k === item.wq && q === item.wq ? .22 : 0));   /* لا يُمحى ما رُسم: الربع الصحيح مظلَّلٌ والباقي شفّاف */
      if (q !== item.wq) { live = false; ctx.q = q; return { ans: 'quad|' + q, ctx }; } item.step = 1; SFX.tick(); }
    else { const [, sx, sy] = Q4.find(z => z[0] === item.wq); quad(item.wq, sx, sy, .22); }   /* الربع الصحيح مظلَّل */
    let walk = null; if (tries >= 3 && t0 === 1) { walk = await c4Walk(svg, Pl, item.x, item.y, { stop: 1 }); await S('gen.c4.together.pt'); } else c5Q('gen.c5.q.place', isLive);
    const [x, y] = item.want, bad = x ? [-x, y] : [x, -y || 1], cell = await c9PlaceOne(svg, Pl, item.want, bad); live = false; REPLAY_HOOK = null; hush(); if (walk) walk.remove(); ctx.cell = cell; c5Under(Pl, cell);
    return { ans: 'cell|' + preKey(cell), ctx }; },
  judge(item, a) { const [w, k] = String(a).split('|'); if (w === 'quad') return { ok: false, err: 'c5Quad' };
    const c = k.split('_').map(v => v[0] === 'm' ? -+v.slice(1) : +v), [x, y] = item.want; if (c4Same(c, item.want)) return { ok: true };
    return { ok: false, err: x && c4Same(c, [-x, y]) ? 'c4SignX' : y && c4Same(c, [x, -y]) ? 'c4SignY' : x && y && c4Same(c, [-x, -y]) ? 'c4SignBoth' : x !== y && c4Same(c, [y, x]) ? 'coordSwap' : 'c4Off' }; },
  onOk(item, r) { SFX.good(); const c = r && r.ctx; if (c && c.svg.isConnected) c9Chest(c.svg, c.Pl.P(...item.want), true); },   /* الكنز يُفتح حيث وُضعت النقطة */
  onWrong() { SFX.soft(); },
  async hint2(item, r, err) { const c = r && r.ctx; if (c && c.svg && c.svg.isConnected) { const m = helpG(c.svg);
      if (err === 'c5Quad') { ciRule(m, 180, [246], labelText('c5AskQuad'), C4.hl || SO.hl, 15); c9HelpHide(c.svg, c.Pl); await S('gen.c5.hint.quad'); return; }
      const w = await c4Walk(c.svg, c.Pl, item.x, item.y, { ms: 230, upTo: 'x', dir: true }); await S('gen.c4.hint.pt'); w.remove(); return; }
    await S(err === 'c5Quad' ? 'gen.c5.hint.quad' : 'gen.c4.hint.pt'); },
  async together() {},
  async reveal(item, r) { const c = r && r.ctx; if (c && c.svg.isConnected) { await c4Walk(c.svg, c.Pl, item.x, item.y, { ms: 140 }); c9Chest(c.svg, c.Pl.P(...item.want), true); }
    item.step = 2; await S('gen.c4.reveal.pt', { noGap: true }); await S('gen.c4.go.' + preKey(item.want), { append: true }); },
  praise: () => 'praisePlace', twin(item) { return item.twin || null; },
};

/* ---------- د2 «الكاشف» (c5Detect): a، b؛ يضع رأس الزاوية القائمة فيظهر الضلعان بطوليهما، ثم يحسب الوتر، ثم تقيسه المسطرة ---------- */
function c5Ruler(g, Pl, a, b, txt) { const A = Pl.P(...a), B = Pl.P(...b), L = Math.hypot(B[0] - A[0], B[1] - A[1]), ang = Math.atan2(B[1] - A[1], B[0] - A[0]) * 180 / Math.PI, r = el('g', { transform: `rotate(${ang} ${A[0]} ${A[1]})`, 'pointer-events': 'none' }, g), u = Pl.c;
  el('rect', { x: A[0], y: A[1] - 16, width: L, height: 12, rx: 3, fill: 'rgba(246,217,138,.85)', stroke: '#b9813f', 'stroke-width': 1.4 }, r);
  for (let i = 0; i * u <= L + .5; i++) geoLine(r, A[0] + i * u, A[1] - 16, A[0] + i * u, A[1] - (i % 5 ? 11 : 8), { color: '#6e4a22', w: 1.2 });
  const M = [(A[0] + B[0]) / 2, (A[1] + B[1]) / 2], K = Pl.P(b[0], a[1]), s0 = (K[0] - M[0]) * (A[1] - B[1]) + (K[1] - M[1]) * (B[0] - A[0]) > 0 ? -1 : 1, nx = s0 * (A[1] - B[1]) / L, ny = s0 * (B[0] - A[0]) / L;
  const lb = preLab(g, M[0] + nx * 32, M[1] + ny * 32 + 5, txt, { fs: 15, col: '#6e4a22' });   /* العدد في الجهة البعيدة عن رأس القائمة، وعددُ المحور تحته يُخفى */
  try { const b = lb.getBBox(); c4Hide(Pl, [[b.x - 3, b.y - 2, b.x + b.width + 3, b.y + b.height + 2]]); } catch (e) {}
  c9Hush(Pl, ([x, y]) => { const u = Math.max(0, Math.min(1, ((x - A[0]) * (B[0] - A[0]) + (y - A[1]) * (B[1] - A[1])) / (L * L))); return Math.hypot(x - A[0] - u * (B[0] - A[0]), y - A[1] - u * (B[1] - A[1])) < 22; }); return r; }   /* مسطرةٌ على الوتر بوحدات المستوى، وأعداد المحورين تحتها تُخفى */
/* اختيار الوتر ووسم الخطأ كبند المسافة (ITEM.c4Dist)، ومن خياراته نفسها */
const c5DistPick = item => item.dec ? choosePick(shuffle(item.cands.map(v => [pyKey(v), pyTxt(v), '<i></i>', 'gen.py.v.' + pyKey(v)])), item.want) : numberPick(shuffle(item.nums), item.want, { west: true }).p;
const c5DistErr = (it, k) => it.dec ? 'pyOff' : k === it.dx + it.dy ? 'coDistAdd' : k === it.alt ? 'c4DistSign' : k === it.dx * it.dx + it.dy * it.dy ? 'pyNoRoot' : k === Math.max(it.dx, it.dy) || k === Math.min(it.dx, it.dy) ? 'c4DistOne' : k === Math.abs(it.dx - it.dy) ? 'c4DistSub' : 'coDistOff2';
ITEM.c5Detect = {
  make(spec) { const D = ITEM.c4Dist.make(spec); return { ...spec, ...D, step: 0, corner: [spec.b[0], spec.a[1]], alt2: [spec.a[0], spec.b[1]], tag: 'c5-detect' }; },
  async ask(item, mode, tries) { item.__try = tries; const svg = m3Stage(262), Pl = c4Plane(svg, { ...item.ext, top: 26, H: 226 }), ctx = { svg, Pl }, t0 = item.step; let live = true; const isLive = () => live && svg.isConnected;
    const A = Pl.P(...item.a), B = Pl.P(...item.b); c5Carry(svg, Pl); geoLine(svg, A[0], A[1], B[0], B[1], { color: C4.ln, w: 3.4 }); c4Dot(svg, Pl, ...item.a, { name: 'a', pair: true, col: C4.pt2 }); c4Dot(svg, Pl, ...item.b, { name: 'b', pair: true, col: C4.pt2 });
    if (item.step === 0) { let h = null; if (tries >= 3) { h = helpG(svg); const K = Pl.P(...item.corner); geoLine(h, A[0], A[1], K[0] + (K[0] - A[0]) * .3, K[1], { color: C4.hl, w: 2.6, dash: '6 4' }); await S('gen.c4.together.corner'); }   /* أفقيٌّ من أ: الرأس عليه، والرأسيّ للطفل */
      else c5Q(tries === 0 ? item.q || 'gen.c5.q.corner' : 'gen.c5.q.corner', isLive);
      const cell = await c9PlaceOne(svg, Pl, item.corner, [item.a[0], item.a[1] === 0 ? 1 : 0]); live = false; REPLAY_HOOK = null; hush(); if (h) h.remove(); c5Under(Pl, cell);
      if (!c4Same(cell, item.corner) && !c4Same(cell, item.alt2)) { ctx.cell = cell; return { ans: 'corner|' + preKey(cell), ctx }; } item.k = cell; item.step = 1; live = true; SFX.tick(); }
    const K = item.k || item.corner; c4Dot(svg, Pl, ...K, { col: C4.hl || SO.hl }); c4RunRise(svg, Pl, item.a[1] === K[1] ? item.a : item.b, item.a[1] === K[1] ? item.b : item.a, { abs: true });   /* الضلعان بطوليهما */
    if (tries >= 3 && t0 === 1) { ciEq(helpG(svg), 180, 246, item.dec ? `${item.dx} × ${item.dx} + ${item.dy} × ${item.dy} = ؟ × ؟` : `${item.dx * item.dx} + ${item.dy * item.dy} = ؟ × ؟`, C4.hl || SO.hl, 15); await S('gen.c4.together.dist'); } else c5Q('gen.c5.q.hyp', isLive);
    const k = await c5DistPick(item); live = false; c5Off(); return { ans: 'hyp|' + k, ctx }; },
  judge(item, a) { const [w, k] = String(a).split('|'); if (w === 'corner') return { ok: false, err: 'c4CornerOff' };
    return String(k) === String(item.want) ? { ok: true } : { ok: false, err: c5DistErr(item, item.dec ? k : +k) }; },
  onOk(item, r) { SFX.good(); const c = r && r.ctx; if (c && c.svg.isConnected) c5Ruler(c.svg, c.Pl, item.a, item.b, item.dec ? '≈ ' + pyTxt(item.r) : MS(String(item.want))); },   /* المسطرة تقيس الوتر كما حُسب */
  onWrong() { SFX.soft(); },
  async hint2(item, r, err) { const c = r && r.ctx; if (c && c.svg && c.svg.isConnected) { const m = helpG(c.svg);
      if (err === 'c4CornerOff') { const A = c.Pl.P(...item.a), B = c.Pl.P(...item.b); geoLine(m, A[0], A[1], A[0] + (B[0] - A[0]), A[1], { color: H2C[0], w: 3, dash: '6 4' }); geoLine(m, B[0], B[1], B[0], A[1], { color: H2C[1], w: 3, dash: '6 4' }); ciRule(m, 180, [248], labelText('c5AskCorner'), C4.hl || SO.hl, 15); }   /* أفقيٌّ من أ ورأسيٌّ من ب */
      else { c4Legs(m, c.Pl, item.a, item.b); ciRule(m, 180, [22, 248], labelText('c4RuleDist'), C4.hl || SO.hl, 15); } c9HelpHide(c.svg, c.Pl); }
    await S(err === 'c4CornerOff' ? 'gen.c4.hint.corner' : 'gen.c4.hint.dist'); },
  async together() {},
  async reveal(item, r) { const c = r && r.ctx; if (c && c.svg.isConnected) { c4RunRise(helpG(c.svg), c.Pl, item.a, item.b, { abs: true }); c5Ruler(c.svg, c.Pl, item.a, item.b, item.dec ? '≈ ' + pyTxt(item.r) : MS(String(item.want))); }
    item.step = 2; await S('gen.c4.reveal.dist', { noGap: true }); await S(item.dec ? 'gen.py.v.' + item.want : numw(item.want), { append: true }); },
  praise: () => 'praiseThink', twin(item) { return item.twin || null; },
};

/* ---------- د3 «أين المستقيم؟» (c5Line): m، b، cand (ثلاث نقاط: الأولى على المستقيم)؛ يضع نقطة التقاطع مع محور الصادات، ثم نقطةً ثانية، فيُرسم المستقيم، ثم يلمس نقطةً عليه ---------- */
ITEM.c5Line = {
  make(spec) { const ex = c4Ext([[0, spec.i0], [1, spec.m + spec.i0], ...spec.cand], 5); return { ...spec, step: 0, want: preKey(spec.cand[0]), n: ex.n, ny: ex.ny, tag: 'c5-line' }; },
  async ask(item, mode, tries) { item.__try = tries; const svg = m3Stage(262), Pl = c4Plane(svg, { n: item.n, ny: item.ny }), ctx = { svg, Pl }, t0 = item.step, on = ([x, y]) => y === item.m * x + item.i0; let live = true; const isLive = () => live && svg.isConnected;
    c4EqCard(svg, item.m, item.i0); c5Carry(svg, Pl); const eq = 'gen.c4.eq.' + c4LKey([item.m, item.i0]);
    if (item.step >= 1) c4Dot(svg, Pl, 0, item.i0, { col: C4.pt });
    if (item.step >= 2) c4Dot(svg, Pl, ...item.p2, { col: C4.pt });
    if (item.step === 0) { if (tries >= 3) { const h = helpG(svg), A = Pl.P(0, -Pl.m), B = Pl.P(0, Pl.m); geoLine(h, A[0], A[1], B[0], B[1], { color: C4.hl, w: 6 }); await S('gen.c4.together.int'); } else c5Q(tries === 0 ? item.q || 'gen.c5.q.int' : 'gen.c5.q.int', isLive, eq);
      const cell = await c9PlaceOne(svg, Pl, [0, item.i0], [item.i0 || 1, 0]); live = false; REPLAY_HOOK = null; hush(); c5Under(Pl, cell);
      if (!c4Same(cell, [0, item.i0])) return { ans: 'int|' + preKey(cell), ctx }; item.step = 1; live = true; SFX.tick(); }
    if (item.step === 1) { if (tries >= 3 && t0 === 1) { c4RunRise(helpG(svg), Pl, [0, item.i0], [1, item.m + item.i0], { abs: false }); await S('gen.c5.together.p2'); } else c5Q('gen.c5.q.p2', isLive, eq);   /* الثانية: ميلٌ من نقطة الصادات */
      const want = [1, item.m + item.i0], cell = await c9PlaceOne(svg, Pl, want, [1, item.i0 - item.m]); live = false; REPLAY_HOOK = null; hush(); c5Under(Pl, cell);
      if (cell[0] === 0 || !on(cell)) return { ans: 'p2|' + preKey(cell), ctx }; item.p2 = cell; item.step = 2; live = true; c4Dot(svg, Pl, ...cell, { col: C4.pt }); SFX.tick(); }
    c4Line(svg, Pl, item.m, item.i0, { col: C4.ln });   /* المستقيم من النقطتين */
    let cand = item.cand.map(p => [preKey(p), p]); if (tries >= 3 && t0 === 2) { const x = cand.find(c => c[0] !== item.want && !(item.tried || []).includes(c[0])) || cand[1]; cand = cand.filter(c => c !== x); await S('gen.c5.together.on'); } else c5Q('gen.c5.q.on', isLive);
    const T = cand.map(([k, p]) => { const t = el('g', {}, svg), P = Pl.P(...p); el('circle', { cx: P[0], cy: P[1], r: 9, fill: '#fff', stroke: C4.pt2, 'stroke-width': 3 }, t); c4Hide(Pl, [[P[0] - 11, P[1] - 11, P[0] + 11, P[1] + 11]]); return { g: t, k, label: labelText('c9Spot') }; });   /* عدد المحور تحت الدائرة يُخفى */
    const k = await tapOne(T, { ok: item.want, pad: 44 }); live = false; REPLAY_HOOK = null; hush(); (item.tried = item.tried || []).push(k); return { ans: 'on|' + k, ctx }; },
  judge(item, a) { const [w, k] = String(a).split('|'); if (w === 'int') { const c = k.split('_').map(v => v[0] === 'm' ? -+v.slice(1) : +v); return { ok: false, err: c[1] === 0 && c[0] === item.i0 ? 'c4IntSwap' : 'c4IntOff' }; }
    if (w === 'p2') { const c = k.split('_').map(v => v[0] === 'm' ? -+v.slice(1) : +v); return { ok: false, err: c[0] && c[1] === item.i0 - item.m * c[0] ? 'c5SlopeSign' : 'c5P2Off' }; }
    return k === item.want ? { ok: true } : { ok: false, err: 'c5NotOn' }; },
  onOk() { SFX.good(); }, onWrong() { SFX.soft(); },
  async hint2(item, r, err) { const c = r && r.ctx; if (c && c.svg && c.svg.isConnected) { const m = helpG(c.svg);
      if (err === 'c4IntSwap' || err === 'c4IntOff') { const A = c.Pl.P(0, -c.Pl.m), B = c.Pl.P(0, c.Pl.m); geoLine(m, A[0], A[1], B[0], B[1], { color: H2C[0], w: 5, dash: '6 4' }); ciRule(m, 180, [248], labelText('c5AskInt'), C4.hl || SO.hl, 15); }   /* محور الصادات: السين صفر */
      else if (err === 'c5SlopeSign' || err === 'c5P2Off') { c4RunRise(m, c.Pl, [0, item.i0], [1, item.m + item.i0], { abs: false }); ciRule(m, 180, [248], labelText('c5AskP2'), C4.hl || SO.hl, 15); }
      else ciRule(m, 180, [248], labelText('c5AskOn'), C4.hl || SO.hl, 15); c9HelpHide(c.svg, c.Pl); }
    await S(err === 'c4IntSwap' || err === 'c4IntOff' ? 'gen.c4.hint.int' : err === 'c5SlopeSign' || err === 'c5P2Off' ? 'gen.c5.hint.p2' : 'gen.c5.hint.on'); },
  async together() {},
  async reveal(item, r) { const c = r && r.ctx; if (c && c.svg.isConnected) { c4Line(c.svg, c.Pl, item.m, item.i0, { col: C4.ok || SO.ok }); c4Dot(c.svg, c.Pl, ...item.cand[0], { col: C4.ok || SO.ok, pair: true }); }
    item.step = 3; await S('gen.c4.reveal.pt', { noGap: true }); await S('gen.c4.go.' + preKey(item.cand[0]), { append: true }); },
  praise: () => 'praisePlace', twin(item) { return item.twin || null; },
};
