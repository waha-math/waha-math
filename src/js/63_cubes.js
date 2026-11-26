/* =====================================================================
   ورشة المكعّبات في م3 وم4: التفكير المكاني (D197) بالورشة بعد كل وحدة (D198-2). اختيارية لا تحجب اختبار الوحدة
   (D245 جعل اللعبة المكانية الإلزامية لـ م1–م2)، ولا تُحسب في الحمل، ومحاولاتها استكشافٌ لا أخطاء في التقرير (D202).
   م3 (تبني على S3-U8 وS3-U9): views البناء من مساقطه الثلاثة · count عدّ مكعّبات بناءٍ بعضها مخفيّ · nets الشبكات الصالحة للمكعّب
   م4 (تبني على M4-U9 وM4-U7): rot هل البناءان متطابقان بعد دوران؟ · pic ابنِ ما في الصورة وقد رُئي من جهةٍ أخرى · cut ما شكل قطع المكعّب؟
   البناء خريطة ارتفاعات: t[r][c] مكعّبات العمود، والصفّ 0 الأبعد والأخير الأمامي، والعمود 0 أقصى اليسار كما يُرى من الأمام.
   ويُرسم بالإسقاط المائل نفسه في S3-U8 (soGeom): الوجه الأمامي مربّعٌ حقيقي والعمق إلى أعلى اليمين، فيُرى الأمام والأعلى واليمين،
   ولذلك «المسقط الجانبي» هنا مسقط اليمين، وأوّل أعمدته من اليسار هو الصفّ الأمامي.
   ===================================================================== */
const CU = { k: .55, a: 38 * Math.PI / 180, H: 3, front: '#8e6bbf', shade: ['#fffdf6', '#f7ebcd', '#ecd6a4', '#dcc28e', '#c9a96b'],
  colB: { top: '#e4f0fa', front: '#cfe3f3', right: '#a9c9e4' } };
const cuVoxOf = t => { const R = t.length, out = []; t.forEach((row, r) => row.forEach((h, c) => { for (let z = 0; z < h; z++) out.push([c, R - 1 - r, z]); })); return out; };
const cuSum = t => t.flat().reduce((a, b) => a + b, 0);
const cuEmpty = (R, C) => [...Array(R)].map(() => Array(C).fill(0));
/* المساقط: الأمامي لكل عمود أعلى ما فيه، والجانبي (من اليمين) لكل صفّ من الأمامي إلى الخلفي، والعلوي ما فيه مكعّب */
const cuViews = t => { const R = t.length, C = t[0].length;
  return { front: [...Array(C)].map((_, c) => Math.max(...t.map(row => row[c]))), side: [...Array(R)].map((_, j) => Math.max(...t[R - 1 - j])), top: t.map(row => row.map(h => h > 0 ? 1 : 0)) }; };
const cuJ = x => JSON.stringify(x);
/* الدوران ربع دورة (من الأعلى)، وقصّ الصفوف والأعمدة الفارغة: البناءان «الشكل نفسه» إن طابق أحدهما الآخر بدورانٍ ونقل */
const cuRot = t => t[0].map((_, c) => t.map(row => row[c]).reverse());
const cuTrim = t => { let a = t.filter(row => row.some(h => h)); if (!a.length) return [[]]; const cs = a[0].map((_, c) => c).filter(c => a.some(row => row[c])); return a.map(row => cs.map(c => row[c])); };
const cuSameShape = (a, b) => { const k = cuJ(cuTrim(a)); let x = cuTrim(b); for (let i = 0; i < 4; i++) { if (cuJ(x) === k) return true; x = cuTrim(cuRot(x)); } return false; };
/* المكعّبات المنفصلة (rot): [x يميناً، y عمقاً، z علوّاً]، تُنقل إلى الصفر */
const cuNorm = V => { const m = [0, 1, 2].map(i => Math.min(...V.map(v => v[i]))); return V.map(v => v.map((x, i) => x - m[i])); };
const CU_TF = { z: ([x, y, z]) => [y, -x, z], x: ([x, y, z]) => [x, -z, y], y: ([x, y, z]) => [z, y, -x], m: ([x, y, z]) => [-x, y, z] };
const cuApply = (V, seq) => [...seq].reduce((W, a) => W.map(CU_TF[a]), V);

/* رسم المكعّبات بالإسقاط المائل: من الخلف إلى الأمام، ثم من الأسفل إلى الأعلى، ثم من اليسار إلى اليمين؛ فما يُرسم لاحقاً أقرب إلى العين،
   ولا يُرسم وجهٌ يلاصقه مكعّب. o: cx وcy مركز الإطار، وW وH حدّاه، وs أقصى ضلع، وfloor [أعمدة، صفوف] أرضٌ بشبكتها وضلعها الأمامي ملوّن،
   وminZ أدنى ارتفاع يُحسب له الإطار، وhl مكعّبٌ مميَّز [x, y, z]، وcol ألوان الأوجه */
function cuVox(parent, V, o = {}) {
  const g = el('g', { 'pointer-events': 'none' }, parent), kc = CU.k * Math.cos(CU.a), ks = CU.k * Math.sin(CU.a), F = o.floor;
  const nx = F ? F[0] : Math.max(1, ...V.map(v => v[0] + 1)), ny = F ? F[1] : Math.max(1, ...V.map(v => v[1] + 1)), nz = Math.max(o.minZ || 1, ...V.map(v => v[2] + 1));
  const s = Math.min(o.s || 34, (o.W || 200) / (nx + ny * kc), (o.H || 160) / (nz + ny * ks)), X0 = (o.cx ?? 180) - (nx + ny * kc) * s / 2, Y0 = (o.cy ?? 120) + (nz + ny * ks) * s / 2;
  const P = (x, y, z) => [X0 + (x + y * kc) * s, Y0 - (z + y * ks) * s], poly = pts => polyStr(pts.map(p => P(...p)));
  if (F) { const fg = el('g', {}, g);
    el('polygon', { points: poly([[0, 0, 0], [nx, 0, 0], [nx, ny, 0], [0, ny, 0]]), fill: CU.shade[0], stroke: 'none' }, fg);
    for (let x = 0; x <= nx; x++) el('polyline', { points: poly([[x, 0, 0], [x, ny, 0]]), fill: 'none', stroke: SO.grid, 'stroke-width': 1.6 }, fg);
    for (let y = 0; y <= ny; y++) el('polyline', { points: poly([[0, y, 0], [nx, y, 0]]), fill: 'none', stroke: y ? SO.grid : CU.front, 'stroke-width': y ? 1.6 : 5, 'stroke-linecap': 'round', ...(y ? {} : { 'data-front': 1 }) }, fg); }
  const has = new Set(V.map(v => v.join(','))), at = (x, y, z) => has.has([x, y, z].join(',')), col = o.col || { top: SO.top, front: SO.face, right: SO.side }, hl = o.hl && o.hl.join(',');
  [...V].sort((a, b) => b[1] - a[1] || a[2] - b[2] || a[0] - b[0]).forEach(([x, y, z]) => { const me = hl === [x, y, z].join(','), c = me ? { top: '#d9c9ef', front: '#b79ae0', right: '#9c7cc9' } : col;
    const face = (pts, fill, k) => el('polygon', { points: poly(pts), fill, stroke: SO.edge, 'stroke-width': 2, 'stroke-linejoin': 'round', 'data-cf': k }, g);
    if (!at(x, y, z + 1)) face([[x, y, z + 1], [x + 1, y, z + 1], [x + 1, y + 1, z + 1], [x, y + 1, z + 1]], c.top, 'top');
    if (!at(x + 1, y, z)) face([[x + 1, y, z], [x + 1, y + 1, z], [x + 1, y + 1, z + 1], [x + 1, y, z + 1]], c.right, 'right');
    if (!at(x, y - 1, z)) face([[x, y, z], [x + 1, y, z], [x + 1, y, z + 1], [x, y, z + 1]], c.front, 'front'); });
  return { g, s, P }; }

/* بطاقة مسقط: عنوانها، وشبكتها بخلاياها (cols × rows)، والممتلئ منها؛ وعلامة ✓ حين يطابق بناء الطفل */
function cuCard(svg, x, y, w, h, title) { const g = el('g', { 'pointer-events': 'none', 'data-cucard': 1 }, svg);
  const box = el('rect', { x, y, width: w, height: h, rx: 10, fill: css('--paper'), stroke: css('--line'), 'stroke-width': 2 }, g);
  const t = el('text', { x: x + w / 2, y: y + 18, 'text-anchor': 'middle', 'font-size': 14, 'font-weight': 800, fill: css('--ink'), 'font-family': css('--f') }, g); t.textContent = G(title);
  const body = el('g', {}, g), mark = el('g', { opacity: 0 }, g);
  el('circle', { cx: x + 14, cy: y + 14, r: 10, fill: SO.ok }, mark); el('path', { d: `M${x + 9} ${y + 14} l4 4 l7 -8`, fill: 'none', stroke: '#fff', 'stroke-width': 3, 'stroke-linecap': 'round' }, mark);
  const draw = (cells, cols, rows) => { body.innerHTML = ''; const cs = Math.min(20, (w - 16) / cols, (h - 32) / rows), x0 = x + (w - cols * cs) / 2, y0 = y + 26 + (h - 30 - rows * cs) / 2;
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) el('rect', { x: x0 + c * cs, y: y0 + r * cs, width: cs, height: cs, fill: cells(r, c) ? SO.face : 'none', stroke: cells(r, c) ? SO.edge : SO.grid, 'stroke-width': cells(r, c) ? 1.8 : 1.2 }, body); };
  return { g, box, draw, ok: on => { mark.setAttribute('opacity', on ? 1 : 0); box.setAttribute('stroke', on ? SO.ok : css('--line')); box.setAttribute('stroke-width', on ? 3 : 2); } }; }
/* المساقط الثلاثة في بطاقاتها: الأمامي ثم الجانبي (من اليمين) ثم العلوي، من اليمين إلى اليسار */
function cuViewCards(svg, y, h, R, C, Hm) { const w = 112, xs = [242, 126, 10];
  const K = { front: cuCard(svg, xs[0], y, w, h, labelText('soV.front')), side: cuCard(svg, xs[1], y, w, h, labelText('soV.side')), top: cuCard(svg, xs[2], y, w, h, labelText('soV.top')) };
  const show = v => { K.front.draw((r, c) => v.front[c] >= Hm - r, C, Hm); K.side.draw((r, c) => v.side[c] >= Hm - r, R, Hm); K.top.draw((r, c) => v.top[r][c], C, R); };
  return { K, show }; }

/* خريطة البناء من الأعلى: مربّعاتٌ تُلمس، على كلٍّ عدد مكعّبات عموده، وضلعها الأمامي بلون ضلع الأرض في الصورة.
   كل لمسةٍ تضع مكعّباً، واللمسة بعد أعلى العمود تُفرغه (بلا زرّين: كانا تحت المسرح فصغّراه على iPhone SE فصار المربّع 52 بكسلاً).
   والمربّع هدفه كاملاً (72 وحدة، 57 بكسلاً على أضيق شاشة)، ورسمه أصغر قليلاً */
function cuPlan(svg, t, o) { const R = t.length, C = t[0].length, cs = o.cs || 72, x0 = o.x0, y0 = o.y0, g = el('g', {}, svg), cells = [];
  for (let r = 0; r < R; r++) for (let c = 0; c < C; c++) {
    const cg = el('g', { role: 'button', tabindex: 0, 'data-cell': r + ',' + c, style: 'cursor:pointer' }, g);
    el('rect', { x: x0 + c * cs, y: y0 + r * cs, width: cs, height: cs, fill: 'transparent' }, cg);
    const rc = el('rect', { x: x0 + c * cs + 2, y: y0 + r * cs + 2, width: cs - 4, height: cs - 4, rx: 8, fill: CU.shade[0], stroke: SO.edge, 'stroke-width': 2 }, cg);
    const tx = el('text', { x: x0 + (c + .5) * cs, y: y0 + (r + .5) * cs + 10, 'text-anchor': 'middle', 'font-size': 28, 'font-weight': 800, fill: SO.ink, 'pointer-events': 'none' }, cg);
    cg.onclick = () => o.tap(r, c); cells.push({ r, c, g: cg, rc, tx }); }
  el('line', { x1: x0 + 2, y1: y0 + R * cs + 3, x2: x0 + C * cs - 2, y2: y0 + R * cs + 3, stroke: CU.front, 'stroke-width': 5, 'stroke-linecap': 'round', 'data-front': 1 }, g);
  const fl = el('text', { x: x0 + C * cs / 2, y: y0 + R * cs + 16, 'text-anchor': 'middle', 'font-size': 14, 'font-weight': 800, fill: '#6a4a9e', stroke: '#fff', 'stroke-width': 4, 'paint-order': 'stroke', 'font-family': css('--f') }, g); fl.textContent = G(labelText('cuFront'));   /* بنفسجي أغمق بهالة بيضاء: يُقرأ بالفاتح والداكن (المراجع B لبوابة S3-U2/U3، 14) */
  const update = () => cells.forEach(q => { const h = t[q.r][q.c]; q.rc.setAttribute('fill', h ? CU.shade[Math.min(h, CU.shade.length - 1)] : css('--paper')); q.tx.textContent = h ? DG(h) : '';
    q.g.setAttribute('aria-label', plain(G(labelText('cuCell'))) + ' ' + DG(q.r + 1) + '، ' + DG(q.c + 1) + ': ' + DG(h)); q.g.dataset.h = h; });
  update(); return { g, cells, update }; }
/* زرٌّ في المسرح (لا تحته، فلا يصغّره): مستطيلٌ بأيقونة واسم، 72 وحدة ارتفاعاً على الأقلّ */
function cuSvgBtn(svg, x, y, w, h, lbl, icon, fn) { const g = el('g', { role: 'button', tabindex: 0, 'aria-label': plain(G(labelText(lbl))), style: 'cursor:pointer', 'data-cubtn': lbl }, svg);
  el('rect', { x, y, width: w, height: h, rx: 14, fill: css('--paper'), stroke: css('--compass'), 'stroke-width': 3 }, g);
  const ic = el('g', { transform: `translate(${x + w / 2 - 17} ${y + 10})`, 'pointer-events': 'none' }, g); ic.innerHTML = icon;
  const t = el('text', { x: x + w / 2, y: y + h - 12, 'text-anchor': 'middle', 'font-size': 16, 'font-weight': 800, fill: css('--ink'), 'font-family': css('--f'), 'pointer-events': 'none' }, g); t.textContent = G(labelText(lbl));
  g.onclick = fn; return { g, on: v => { g.style.opacity = v ? 1 : .45; g.setAttribute('aria-disabled', !v); } }; }
const CU_IC = { fold: '<path d="M2 26h16V10H2zM18 26l14-7V3L18 10" fill="currentColor" fill-opacity=".3" stroke="#2a5f94" stroke-width="2.5" stroke-linejoin="round"/>',
  save: '<path d="M17 2l4.6 9.4 10.4 1.5-7.5 7.3 1.8 10.3L17 25.6l-9.3 4.9 1.8-10.3L2 12.9l10.4-1.5z" fill="#f2b33d" stroke="#c8831e" stroke-width="2" stroke-linejoin="round"/>' };

/* ===== البناء: views (المساقط الثلاثة) وpic (صورة من جهةٍ أخرى) والبناء الحرّ (free: زرّ الحفظ في العمود الأيسر) ===== */
function cuBuild(U, P, free) {
  const svg = newStage(330, { oasis: false, ground: 0 }), R = 3, C = 3, Hm = CU.H, t = cuEmpty(R, C), goal = P && P.t, pic = P && P.kind === 'pic';
  const view = el('g', {}, svg); let cards = null, mine = null, done = false;
  if (pic) { el('rect', { x: 6, y: 6, width: 128, height: 214, rx: 10, fill: css('--paper'), stroke: css('--line'), 'stroke-width': 2 }, svg);
    const gt = el('text', { x: 70, y: 26, 'text-anchor': 'middle', 'font-size': 14, 'font-weight': 800, fill: css('--ink'), 'font-family': css('--f') }, svg); gt.textContent = G(labelText('cuGoal'));
    let rt = goal; for (let i = 0; i < (P.rot || 0); i++) rt = cuRot(rt); cuVox(svg, cuVoxOf(rt), { cx: 70, cy: 126, W: 116, H: 176, s: 30, col: CU.colB, ...(P.rot ? {} : { floor: [3, 3] }) });
    mine = cuCard(svg, 10, 244, 340, 84, labelText('cuMine')); }
  else { cards = cuViewCards(svg, 244, 84, R, C, Hm); if (goal) cards.show(cuViews(goal)); }
  const draw = () => { view.innerHTML = ''; if (pic) { mine.g.querySelectorAll('[data-mine]').forEach(n => n.remove()); const m = el('g', { 'data-mine': 1 }, mine.g); cuVox(m, cuVoxOf(t), { cx: 180, cy: 292, W: 300, H: 58, s: 18, floor: [C, R], minZ: 1 }); }
    else cuVox(view, cuVoxOf(t), free ? { cx: 70, cy: 74, W: 124, H: 132, s: 30, floor: [C, R], minZ: Hm } : { cx: 70, cy: 120, W: 124, H: 200, s: 34, floor: [C, R], minZ: Hm });
    if (free) cards.show(cuViews(t)); };
  let resolve; const doneP = gate(new Promise(r => resolve = r));
  const check = () => { if (free || done) return; const v = cuViews(t), w = goal && cuViews(goal);
    if (!pic) for (const k of ['front', 'side', 'top']) cards.K[k].ok(cuJ(v[k]) === cuJ(w[k]));
    const ok = pic ? cuSum(t) && (P.rot ? cuSameShape(t, goal) : cuJ(cuTrim(t)) === cuJ(cuTrim(goal))) : cuJ(v) === cuJ(w);   /* الصورة باتجاهها (rot 0، D281 (3)): يُطابَق البناء بعد قصّ الفارغ دون تدوير؛ والمُدارة (م4) بأيّ دوران (المراجع B لبوابة S3-U2/U3، 10) */ if (pic) mine.ok(ok);
    if (ok) { done = true; disarmIdle(); hush(); AUTO_CLEAR(); plan.cells.forEach(q => untarget([q.g])); logAttempt({ scene: 'ws', tag: P.id, ok: true });
      SFX.win(); confetti(); S(pic ? 'gen.ws.cv.solvedPic' : 'gen.ws.cv.solved').then(() => resolve()); } };
  const tap = (r, c) => { if (done) return; resetIdle(); t[r][c] = (t[r][c] + 1) % (Hm + 1); t[r][c] ? SFX.pop() : SFX.tick(); plan.update(); draw(); check(); };
  const plan = cuPlan(svg, t, { x0: 140, y0: 4, cs: 72, tap }); draw();
  return { svg, t, plan, draw, check, doneP, resolve, tap, cards }; }
function cuViewsPuzzle(U, P) { const B = cuBuild(U, P, false), pic = P.kind === 'pic';
  armIdle(async () => { if (pic) await S('gen.ws.cv.hintPic'); else { const v = cuViews(B.t), w = cuViews(P.t), k = ['front', 'side', 'top'].find(k => cuJ(v[k]) !== cuJ(w[k]));
    if (k) anim(B.cards.K[k].box, [{ strokeWidth: 2 }, { strokeWidth: 6 }, { strokeWidth: 2 }], { duration: 900, iterations: 2 }); await S('gen.ws.cv.hint'); } });
  AUTO({ kind: 'ws', ok: async () => { for (let r = 0; r < 3; r++) for (let c = 0; c < 3; c++) while (B.t[r][c] !== P.t[r][c]) { B.tap(r, c); await new Promise(z => setTimeout(z, 10)); } } });   /* للفحص: يبني الهدف من أيّ بناءٍ سبق */
  (async () => { await S(P.name); await S(pic ? (P.rot ? 'gen.ws.cv.picRot' : 'gen.ws.cv.pic') : 'gen.ws.cv.how'); await S('gen.ws.cv.tap'); })();
  return B.doneP; }
async function cuFree(U) {
  /*T*/window.__scene = 'ws:free';/*/T*/ SCENE_NOW = 'ws:free'; setSteps(0); const B = cuBuild(U, null, true);
  const sv = cuSvgBtn(B.svg, 6, 146, 128, 74, 'save', CU_IC.save, async () => { if (!cuSum(B.t)) { SFX.soft(); return; } const list = designsGet(); list.unshift({ t: Date.now(), unit: U.id, cubes: B.t.map(r => r.slice()) }); store.set(designsKey(), list.slice(0, 30));
    logAttempt({ scene: 'ws', tag: 'save', ok: true }); SFX.win(); confetti(); await S('gen.ws.saved'); }); sv.g.id = 'wsSave';
  await S('gen.ws.cube.free'); await S('gen.ws.cv.tap');
  await nextBtn(labelText('toMap')); showHome(); }
/* ===== count: كم مكعّباً في البناء؟ والمخفيّ يُعدّ: لا مكعّب معلّق، فكل مكعّبٍ عالٍ تحته عمود ===== */
/* المرئي: ما له وجهٌ لا يلاصقه مكعّب ولا يغطّيه آخر أمامه (تقريبٌ للخطأ الشائع: عدُّ ما يُرى وحده) */
const cuSeen = t => { const V = cuVoxOf(t), has = new Set(V.map(v => v.join(','))), at = (x, y, z) => has.has([x, y, z].join(','));
  return V.filter(([x, y, z]) => !at(x, y, z + 1) || !at(x + 1, y, z) || !at(x, y - 1, z)).length; };
async function cuCountPuzzle(U, P) { const n = P.builds.length;
  for (let i = 0; i < n; i++) { const t = P.builds[i], want = cuSum(t), seen = cuSeen(t);
    const svg = newStage(250, { oasis: false, ground: 0 }); cuVox(svg, cuVoxOf(t), { cx: 180, cy: 122, W: 250, H: 220, s: 40, floor: [3, 3] });
    const nums = shuffle([...new Set([want, seen, want + 1, want - 1, want + 2].filter(x => x > 0))].slice(0, 4));
    if (!i) await S(P.name);
    for (let tries = 0; ; tries++) { if (!tries) await S('gen.ws.cc.q'); const np = numberPick(nums, want, { intro: [lineOf('gen.ws.cc.q')] }); const a = await np.p;
      if (a === want) { SFX.good(); np.btns.find(b => +b.dataset.k === a).classList.add('ok'); logAttempt({ scene: 'ws', tag: P.id + ':' + i, ok: true }); cuCountPlan(svg, t, want); await S('gen.ws.cc.ok'); np.box.remove(); break; }
      SFX.soft(); np.btns.find(b => +b.dataset.k === a).classList.add('no'); await sleep(500); np.box.remove();
      if (!tries) { cuCountPlan(svg, t, null); await S('gen.ws.cc.hint'); continue; }
      cuCountPlan(svg, t, want); await S('gen.ws.cc.reveal'); await S(numw(want), { num: true }); break; }
    await sleep(400); }
  SFX.win(); confetti(); await S('gen.ws.cc.solved'); }
/* الخريطة من الأعلى بأعداد أعمدتها، صغيرةً في الركن؛ ومع المجموع حين يُكشف */
function cuCountPlan(svg, t, total) { svg.querySelectorAll('[data-ccplan]').forEach(n => n.remove()); const g = el('g', { 'pointer-events': 'none', 'data-ccplan': 1 }, svg), cs = 26, x0 = 270, y0 = 12;
  t.forEach((row, r) => row.forEach((h, c) => { el('rect', { x: x0 + c * cs, y: y0 + r * cs, width: cs, height: cs, fill: CU.shade[Math.min(h, 4)], stroke: SO.edge, 'stroke-width': 1.5 }, g);
    if (h) { const tx = el('text', { x: x0 + (c + .5) * cs, y: y0 + (r + .5) * cs + 6, 'text-anchor': 'middle', 'font-size': 16, 'font-weight': 800, fill: SO.ink }, g); tx.textContent = DG(h); } }));
  el('line', { x1: x0, y1: y0 + 3 * cs + 2, x2: x0 + 3 * cs, y2: y0 + 3 * cs + 2, stroke: CU.front, 'stroke-width': 4, 'stroke-linecap': 'round' }, g);
  if (total != null) { const tx = el('text', { x: x0 + 1.5 * cs, y: y0 + 3 * cs + 26, 'text-anchor': 'middle', 'font-size': 18, 'font-weight': 800, fill: SO.ok, stroke: '#fff', 'stroke-width': 4, 'paint-order': 'stroke' }, g);
    tx.textContent = G(labelText('cuTotal')) + ' ' + DG(total); } }

/* ===== nets: شبكات المكعّب. ستّة مربّعات متّصلة بأضلاعها تُطوى (soFold)؛ والمكرّرة بدورانٍ أو قلبٍ شبكةٌ واحدة، وللطفل مجموعته من الإحدى عشرة.
   المربّع يُلمس فيُلوَّن ويُلمس ثانيةً فيُمحى، و«اطوِ» في المسرح تحت الشبكة، والشبكات التي وُجدت على الرفّ بجانبه ===== */
const cuNetKey = net => { const forms = []; let N = net.map(p => p.slice());
  for (let f = 0; f < 2; f++) { for (let i = 0; i < 4; i++) { N = N.map(([c, r]) => [r, -c]); const m = [Math.min(...N.map(p => p[0])), Math.min(...N.map(p => p[1]))];
      forms.push(N.map(([c, r]) => [c - m[0], r - m[1]]).sort((a, b) => a[1] - b[1] || a[0] - b[0]).join(';')); } N = N.map(([c, r]) => [-c, r]); }
  return forms.sort()[0]; };
const cuRow4 = net => [0, 1].some(ax => net.some(p => [0, 1, 2, 3].every(d => net.some(q => q[1 - ax] === p[1 - ax] && q[ax] === p[ax] + d))));
async function cuNetsPuzzle(U, P) {
  const svg = newStage(330, { oasis: false, ground: 0 }), NC = 5, NR = 3, cs = 71, x0 = 2.5, y0 = 4, on = new Set(), found = [];
  PROG.nets = Array.isArray(PROG.nets) ? PROG.nets.filter(k => typeof k === 'string').slice(0, 11) : [];
  const g = el('g', {}, svg), mark = el('g', { 'pointer-events': 'none' }, svg), cells = [];
  for (let r = 0; r < NR; r++) for (let c = 0; c < NC; c++) { const cg = el('g', { role: 'button', tabindex: 0, 'data-cell': c + ',' + r, style: 'cursor:pointer' }, g);
    el('rect', { x: x0 + c * cs, y: y0 + r * cs, width: cs, height: cs, fill: 'transparent' }, cg);
    const rc = el('rect', { x: x0 + c * cs + 2, y: y0 + r * cs + 2, width: cs - 4, height: cs - 4, rx: 6, fill: CU.shade[0], stroke: SO.grid, 'stroke-width': 2 }, cg); cells.push({ c, r, g: cg, rc }); cg.onclick = () => tap(c, r); }
  const shelf = el('g', { 'pointer-events': 'none' }, svg); el('rect', { x: 6, y: 226, width: 226, height: 100, rx: 10, fill: css('--paper'), stroke: css('--line'), 'stroke-width': 2 }, shelf);
  const st = el('text', { x: 119, y: 245, 'text-anchor': 'middle', 'font-size': 14, 'font-weight': 800, fill: css('--ink'), 'font-family': css('--f') }, shelf);
  const all = el('text', { x: 296, y: 322, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 800, fill: css('--muted'), 'font-family': css('--f') }, svg);
  const showShelf = () => { st.textContent = G(labelText('cuNets')) + ' ' + DG(found.length) + ' / ' + DG(P.need); all.textContent = G(labelText('cuAll')) + ' ' + DG(PROG.nets.length) + ' / ' + DG(11);
    shelf.querySelectorAll('[data-fnet]').forEach(n => n.remove()); found.forEach((net, i) => { const fg = el('g', { 'data-fnet': 1 }, shelf); soNetDraw(fg, net, { cx: 194 - i * 74, cy: 288, W: 66, H: 54, fold: true }); }); };
  const paint = () => { mark.innerHTML = ''; cells.forEach(q => { const k = q.c + ',' + q.r, a = on.has(k); q.rc.setAttribute('fill', a ? SO.face : css('--paper')); q.rc.setAttribute('stroke', a ? SO.edge : css('--line')); q.g.dataset.on = a ? 1 : 0;
    q.g.setAttribute('aria-label', plain(G(labelText('cuSq'))) + ' ' + DG(q.r + 1) + '، ' + DG(q.c + 1) + (a ? ' ✓' : '')); }); fold.on(on.size === 6); };
  const ring = keys => keys.forEach(k => { const [c, r] = k.split(',').map(Number); el('rect', { x: x0 + c * cs + 6, y: y0 + r * cs + 6, width: cs - 12, height: cs - 12, rx: 6, fill: 'none', stroke: SO.bad, 'stroke-width': 5 }, mark); });
  let resolve, busy = false, done = false, warned = false; const doneP = gate(new Promise(r => resolve = r));
  const tap = (c, r) => { if (busy || done) return; resetIdle(); const k = c + ',' + r;
    if (on.has(k)) { on.delete(k); SFX.tick(); } else if (on.size >= 6) { SFX.soft(); if (!warned) { warned = true; S('gen.ws.nt.six', { ifIdle: true }); } return; } else { on.add(k); SFX.pop(); } paint(); };
  const submit = async () => { if (busy || done) return; if (on.size !== 6) { SFX.soft(); S('gen.ws.nt.six', { ifIdle: true }); return; } busy = true; resetIdle(); const net = [...on].map(k => k.split(',').map(Number)), F = soFold(net);
    try { if (!F.connected) { ring(net.filter((p, i) => F.face[i] === undefined).map(p => p.join(','))); SFX.soft(); await S('gen.ws.nt.apart'); return; }
      if (!F.ok) { const seen = {}, bad = []; net.forEach((p, i) => { const f = F.face[i]; if (seen[f]) bad.push(seen[f], p.join(',')); seen[f] = p.join(','); }); ring(bad); SFX.soft(); await S('gen.ws.nt.overlap'); return; }
      const key = cuNetKey(net); if (found.some(n => cuNetKey(n) === key)) { SFX.soft(); await S('gen.ws.nt.same'); return; }
      if (P.no4 && cuRow4(net)) { SFX.soft(); await S('gen.ws.nt.row4'); return; }
      found.push(net); if (!PROG.nets.includes(key)) PROG.nets.push(key); saveProg(); logAttempt({ scene: 'ws', tag: P.id + ':net', ok: true });
      mark.innerHTML = ''; soNetDraw(mark, net, { cx: x0 + NC * cs / 2, cy: y0 + NR * cs / 2, W: NC * cs - 20, H: NR * cs - 20, fold: true }); SFX.good(); showShelf(); await S('gen.ws.nt.ok');
      on.clear(); paint();
      if (found.length >= P.need) { done = true; disarmIdle(); AUTO_CLEAR(); cells.forEach(q => untarget([q.g])); untarget([fold.g]); fold.g.style.opacity = .45; SFX.win(); confetti();
        await S(PROG.nets.length >= 11 ? 'gen.ws.nt.all' : 'gen.ws.nt.solved'); resolve(); } else armAuto(); } finally { busy = false; } };
  const fold = cuSvgBtn(svg, 240, 228, 114, 78, 'cuFold', CU_IC.fold, () => submit()); fold.g.id = 'cuFold';
  const ALL = CU_NETS.filter(n => !P.no4 || !cuRow4(n));
  const armAuto = () => AUTO({ kind: 'ws', ok: async () => { const n = ALL.find(n => !found.some(f => cuNetKey(f) === cuNetKey(n))); on.clear(); n.forEach(p => on.add(p.join(','))); paint(); await submit(); } });
  armIdle(async () => { await S('gen.ws.nt.hint'); }); armAuto(); paint(); showShelf();
  (async () => { await S(P.name); await S('gen.ws.nt.how'); await S(P.no4 ? 'gen.ws.nt.no4' : P.need === 3 ? 'gen.ws.nt.need3' : 'gen.ws.nt.need2'); })();
  return doneP; }
/* الشبكات الإحدى عشرة، كلٌّ في شبكة 5 × 3 */
const CU_NETS = [[[0, 1], [1, 1], [2, 1], [3, 1], [0, 0], [0, 2]], [[0, 1], [1, 1], [2, 1], [3, 1], [0, 0], [1, 2]], [[0, 1], [1, 1], [2, 1], [3, 1], [0, 0], [2, 2]], [[0, 1], [1, 1], [2, 1], [3, 1], [0, 0], [3, 2]],
  [[0, 1], [1, 1], [2, 1], [3, 1], [1, 0], [1, 2]], [[0, 1], [1, 1], [2, 1], [3, 1], [1, 0], [2, 2]], [[0, 0], [1, 0], [1, 1], [2, 1], [3, 1], [3, 2]], [[0, 0], [1, 0], [1, 1], [2, 1], [3, 1], [2, 2]],
  [[0, 0], [1, 0], [1, 1], [2, 1], [3, 1], [1, 2]], [[0, 0], [1, 0], [1, 1], [2, 1], [2, 2], [3, 2]], [[0, 0], [1, 0], [2, 0], [2, 1], [3, 1], [4, 1]]];

/* ===== rot: هل البناءان متطابقان بعد دوران؟ الثاني دورانُ الأول، أو دورانُ صورته في المرآة؛ والمكعّب الملوّن نظيرُه فيهما بعد الجواب ===== */
async function cuRotPuzzle(U, P) { const n = P.pairs.length;
  for (let i = 0; i < n; i++) { const Q = P.pairs[i], A = cuNorm(Q.a), seq = (Q.mirror ? 'm' : '') + Q.tf, Bm = cuApply(Q.a, seq), B = cuNorm(Bm), off = [0, 1, 2].map(k => Math.min(...Bm.map(v => v[k])));
    const hlA = A[Q.hl || 0], hlB = cuApply([Q.a[Q.hl || 0]], seq)[0].map((x, k) => x - off[k]), want = Q.mirror ? 'no' : 'yes';
    const draw = hl => { const svg = newStage(230, { oasis: false, ground: 0 }); el('line', { x1: 180, y1: 18, x2: 180, y2: 212, stroke: css('--line'), 'stroke-width': 2, 'stroke-dasharray': '6 6' }, svg);
      cuVox(svg, A, { cx: 270, cy: 115, W: 160, H: 200, s: 30, hl: hl && hlA }); cuVox(svg, B, { cx: 90, cy: 115, W: 160, H: 200, s: 30, col: CU.colB, hl: hl && hlB }); return svg; };
    draw(false); if (!i) await S(P.name);
    for (let tries = 0; ; tries++) { if (!tries) await S('gen.ws.rt.q'); const a = await yesNo(want);
      if (a === want) { SFX.good(); logAttempt({ scene: 'ws', tag: P.id + ':' + i, ok: true }); draw(true); await S(Q.mirror ? 'gen.ws.rt.mirror' : 'gen.ws.rt.same'); break; }
      SFX.soft(); if (!tries) { draw(true); await S('gen.ws.rt.hint'); continue; }
      await S(Q.mirror ? 'gen.ws.rt.mirror' : 'gen.ws.rt.same'); break; }
    await sleep(400); }
  SFX.win(); confetti(); await S('gen.ws.rt.solved'); }

/* ===== cut: ما شكل قطع المكعّب؟ السطح يمرّ بثلاث نقاط على أحرف المكعّب (أجزاء من 1)، ومقطعه يُحسب، ثم يُرسم بشكله الحقيقي ===== */
const cuV3 = { sub: (a, b) => a.map((x, i) => x - b[i]), dot: (a, b) => a.reduce((s, x, i) => s + x * b[i], 0), crs: (a, b) => [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]],
  len: a => Math.hypot(...a), nrm: a => { const l = Math.hypot(...a); return a.map(x => x / l); } };
function cuSection(pts) { const [A, B, C] = pts, n = cuV3.crs(cuV3.sub(B, A), cuV3.sub(C, A)), d = cuV3.dot(n, A), out = [];
  const corners = [0, 1].flatMap(x => [0, 1].flatMap(y => [0, 1].map(z => [x, y, z])));
  for (const p of corners) for (const q of corners) { if (cuJ(p) >= cuJ(q) || cuV3.len(cuV3.sub(p, q)) !== 1) continue; const fp = cuV3.dot(n, p) - d, fq = cuV3.dot(n, q) - d;
    if (Math.abs(fp) < 1e-9) out.push(p); else if (Math.abs(fq) < 1e-9) out.push(q); else if (fp * fq < 0) { const s = fp / (fp - fq); out.push(p.map((x, i) => x + s * (q[i] - x))); } }
  const U = []; for (const p of out) if (!U.some(q => cuV3.len(cuV3.sub(p, q)) < 1e-6)) U.push(p);
  const c = [0, 1, 2].map(i => U.reduce((s, p) => s + p[i], 0) / U.length), e1 = cuV3.nrm(cuV3.sub(U[0], c)), e2 = cuV3.nrm(cuV3.crs(n, e1));
  const flat = U.map(p => { const v = cuV3.sub(p, c); return [cuV3.dot(v, e1), cuV3.dot(v, e2)]; }), ord = flat.map((p, i) => i).sort((i, j) => Math.atan2(flat[i][1], flat[i][0]) - Math.atan2(flat[j][1], flat[j][0]));
  return { P3: ord.map(i => U[i]), P2: ord.map(i => flat[i]) }; }
const cuShapeOf = P2 => { const n = P2.length, side = i => cuV3.len(cuV3.sub([...P2[(i + 1) % n], 0], [...P2[i], 0])), vec = i => cuV3.sub([...P2[(i + 1) % n], 0], [...P2[i], 0]);
  if (n !== 4) return { 3: 'tri', 5: 'pent', 6: 'hex' }[n]; const right = [0, 1, 2, 3].every(i => Math.abs(cuV3.dot(vec(i), vec((i + 1) % 4))) < 1e-6);
  if (right) return Math.abs(side(0) - side(1)) < 1e-6 ? 'square' : 'rect'; const par = i => Math.abs(cuV3.crs(vec(i), vec(i + 2))[2]) < 1e-6; return par(0) && par(1) ? 'para' : par(0) || par(1) ? 'trap' : 'other'; };
const CU_SHAPES = { tri: 'ply.q.tri', square: 'ply.q.square', rect: 'ply.q.rect', trap: 'ply.q.trap', pent: 'ply.n.5', hex: 'ply.n.6', para: 'ply.q.para' };
function cuCutDraw(svg, sec, cx, cy, s) { const G0 = soGeom(4, 4, 4, { s, cx, cy }), Pp = G0.P, M = ([x, y, z]) => [0, 1].map(i => Pp.flb[i] + x * (Pp.frb[i] - Pp.flb[i]) + y * (Pp.blb[i] - Pp.flb[i]) + z * (Pp.flt[i] - Pp.flb[i]));
  const g = el('g', { 'pointer-events': 'none' }, svg), pts = k => polyStr(G0.F[k].map(v => Pp[v]));
  for (const k of ['top', 'right', 'front']) el('polygon', { points: pts(k), fill: k === 'top' ? SO.top : k === 'right' ? SO.side : SO.face, 'fill-opacity': .35 }, g);
  el('polygon', { points: polyStr(sec.P3.map(M)), fill: SO.hl, 'fill-opacity': .62, stroke: '#5b3f8c', 'stroke-width': 3, 'stroke-linejoin': 'round', 'data-cut': 1 }, g);
  for (const e of G0.E) geoLine(g, e.A[0], e.A[1], e.B[0], e.B[1], { color: e.hid ? SO.hid : SO.edge, w: e.hid ? 2 : 3, dash: e.hid ? '6 5' : null }); return g; }
function cuTrueShape(svg, sec, cx, cy, size) { const xs = sec.P2.map(p => p[0]), ys = sec.P2.map(p => p[1]), k = size / Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys));
  const mx = (Math.max(...xs) + Math.min(...xs)) / 2, my = (Math.max(...ys) + Math.min(...ys)) / 2, g = el('g', { 'pointer-events': 'none', 'data-true': 1 }, svg);
  el('polygon', { points: polyStr(sec.P2.map(([x, y]) => [cx + (x - mx) * k, cy - (y - my) * k])), fill: SO.hl, 'fill-opacity': .62, stroke: '#5b3f8c', 'stroke-width': 3, 'stroke-linejoin': 'round' }, g); return g; }
async function cuCutPuzzle(U, P) { const n = P.cuts.length;
  for (let i = 0; i < n; i++) { const sec = cuSection(P.cuts[i].p), want = cuShapeOf(sec.P2);
    const svg = newStage(230, { oasis: false, ground: 0 }); cuCutDraw(svg, sec, 250, 118, 34);
    const pairK = { square: 'rect', rect: 'square' }[want], opts = shuffle([want, ...(pairK ? [pairK] : []), ...shuffle(Object.keys(CU_SHAPES).filter(k => k !== want && k !== 'para' && k !== pairK))].slice(0, 4));   /* المربّع والمستطيل معاً: يفترقان بطول الضلع */
    const ic = k => { const d = el('svg', { viewBox: '0 0 40 28', width: 40, height: 28, 'aria-hidden': 'true' }); const F = { tri: [[20, 3], [36, 25], [4, 25]], square: [[9, 2], [31, 2], [31, 24], [9, 24]], rect: [[3, 6], [37, 6], [37, 22], [3, 22]], trap: [[12, 4], [28, 4], [37, 24], [3, 24]],
      pent: [[20, 2], [37, 12], [31, 26], [9, 26], [3, 12]], hex: [[11, 2], [29, 2], [38, 14], [29, 26], [11, 26], [2, 14]] }[k]; el('polygon', { points: polyStr(F), fill: 'currentColor', 'fill-opacity': .3, stroke: 'currentColor', 'stroke-width': 2.5 }, d); return d.outerHTML; };
    if (!i) await S(P.name);
    for (let tries = 0; ; tries++) { if (!tries) await S('gen.ws.cu.q'); const a = await choosePick(opts.map(k => [k, labelText(CU_SHAPES[k]), ic(k), 'gen.ws.cu.s.' + k]), want, { cls: 'four' });
      if (a === want) { SFX.good(); logAttempt({ scene: 'ws', tag: P.id + ':' + i, ok: true }); cuTrueShape(svg, sec, 82, 118, 120); await S('gen.ws.cu.ok'); break; }
      SFX.soft(); if (!tries) { await S('gen.ws.cu.hint'); continue; }
      cuTrueShape(svg, sec, 82, 118, 120); await S('gen.ws.cu.reveal'); await S('gen.ws.cu.s.' + want); break; }
    await sleep(400); }
  SFX.win(); confetti(); await S('gen.ws.cu.solved'); }

/* المُوزِّع: لغز المكعّبات بنوعه */
function cuPuzzle(U, P, ix) {
  /*T*/window.__scene = 'ws:' + P.id;/*/T*/ SCENE_NOW = 'ws:' + P.id;
  const f = { views: cuViewsPuzzle, pic: cuViewsPuzzle, count: cuCountPuzzle, nets: cuNetsPuzzle, rot: cuRotPuzzle, cut: cuCutPuzzle }[P.kind];
  return Promise.resolve(f(U, P)).then(() => AUTO_CLEAR()); }
