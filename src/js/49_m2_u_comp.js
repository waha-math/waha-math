/* =====================================================================
   S2-U9 «ورشة الفرجار» (المرحلة 2، نوفمبر 2026): الرسم الدقيق بالأدوات والإنشاء بالفرجار
   د1 أدوات الورشة ومستويات الرسم ومعيار الدقة (C230) · د2 مثلّث الرسم: العمودي والموازي (C231) والمستطيل بأبعاد (C232)
   د3 مثلث بضلعين وزاوية (C233) ومتوازي أضلاع (C234) · د4 الفرجار والدائرة: أجزاؤها (C235)، القطر ضعف نصف القطر (C236)، الفرجار والدوائر المتحدة المركز (C237)
   د5 الإنشاء: نقل قطعة (C238)، المثلث متساوي الأضلاع (C239)، المثلث بثلاثة أضلاع وحالة اللامثلث (C240)
   د6 السداسي المنتظم (C241، منقول من د5 لأنه فوق السقف بخمس أفكار، D248) والزهرة السداسية (C242) · د7 حارس القصر الأخير: المراجعة والاختبار (14)
   السنتيمتر 20 وحدة على المسرح (CM). الأدوات الافتراضية تُضبط بزرّين داخل المسرح أو بالخطوات (stepperAsk)، لا بالسحب الحرّ، فتعمل باللمس ولوحة المفاتيح.
   ===================================================================== */
const CPC = { ink: '#24323a', tool: '#7fb6d9', toolEdge: '#2a5f94', sq: 'rgba(127,182,217,.55)', arc: '#8e6bbf', ok: '#2f9d6b', bad: '#c8392d', pin: '#b0552f', paper: '#fffdf6' };
const CM = 20;
const cpStage = (H = 250) => { const svg = newStage(H, { oasis: false, ground: 0 }); plyFrame(svg, H - 28); return svg; };
/* مثلّث الرسم: قائمته عند (x، y)، ساقه الأفقية dx والرأسية dy (موجّهتان) */
function setSquareAt(parent, x, y, dx = 120, dy = -96) { const g = el('g', { 'pointer-events': 'none', 'data-setsq': 1 }, parent);
  el('polygon', { points: polyStr([[x, y], [x + dx, y], [x, y + dy]]), fill: CPC.sq, stroke: CPC.toolEdge, 'stroke-width': 2.5, 'stroke-linejoin': 'round' }, g);
  el('polygon', { points: polyStr([[x + dx * .22, y + dy * .18], [x + dx * .55, y + dy * .18], [x + dx * .22, y + dy * .5]]), fill: '#fff', opacity: .55, stroke: CPC.toolEdge, 'stroke-width': 1.2 }, g);
  el('path', { d: `M${x + Math.sign(dx) * 14} ${y} V${y + Math.sign(dy) * 14} H${x}`, fill: 'none', stroke: CPC.toolEdge, 'stroke-width': 1.6 }, g); return g; }
/* الفرجار: المسمار عند P والقلم عند Q، والمفصل فوق المنتصف */
function cpCompassAt(parent, P, Q, o = {}) { const g = el('g', { 'pointer-events': 'none', 'data-compass': 1 }, parent), mx = (P[0] + Q[0]) / 2, my = (P[1] + Q[1]) / 2, d = Math.hypot(Q[0] - P[0], Q[1] - P[1]), h = Math.max(46, 110 - d * .35), nx = (P[1] - Q[1]) / (d || 1), ny = (Q[0] - P[0]) / (d || 1), sg = ny > 0 ? -1 : 1, H = [mx + nx * h * sg, my + ny * h * sg];
  geoLine(g, H[0], H[1], P[0], P[1], { color: '#5b6b75', w: 5 }); geoLine(g, H[0], H[1], Q[0], Q[1], { color: '#5b6b75', w: 5 }); el('circle', { cx: H[0], cy: H[1], r: 7, fill: '#3b4a52' }, g); el('rect', { x: H[0] - 4, y: H[1] - 20, width: 8, height: 14, rx: 3, fill: '#3b4a52' }, g);
  el('circle', { cx: P[0], cy: P[1], r: 3.5, fill: CPC.pin }, g); el('circle', { cx: Q[0], cy: Q[1], r: 4, fill: '#e2b33c', stroke: '#8a6a1e', 'stroke-width': 1.5 }, g); return g; }
/* سهم: خطّ من P إلى Q ورأس عند Q */
function cpArrow(g, P, Q, o = {}) { geoLine(g, P[0], P[1], Q[0], Q[1], { color: o.color || CPC.ok, w: o.w || 2.6 }); geoArrow(g, Q[0], Q[1], Math.atan2(Q[1] - P[1], Q[0] - P[0]) * 180 / Math.PI, o.color || CPC.ok, 10); }
const arcPath = (C, r, a0, a1) => { const p = a => [C[0] + r * Math.cos(a * Math.PI / 180), C[1] - r * Math.sin(a * Math.PI / 180)], s = p(a0), e = p(a1), big = Math.abs(a1 - a0) > 180 ? 1 : 0; return `M${s[0]} ${s[1]} A${r} ${r} 0 ${big} ${a1 > a0 ? 0 : 1} ${e[0]} ${e[1]}`; };
async function drawCircleAnim(parent, C, r, col = CPC.ink, w = 3) { const p = el('path', { d: '', fill: 'none', stroke: col, 'stroke-width': w, 'stroke-linecap': 'round' }, parent); const N = FAST ? 3 : 18; for (let i = 1; i <= N; i++) { const a = 359.9 * i / N; p.setAttribute('d', arcPath(C, r, 0, a)); if (i < N) await sleep(FAST ? 5 : 30); } p.setAttribute('d', arcPath(C, r, 0, 180) + ' ' + arcPath(C, r, 180, 359.99).replace(/^M/, 'L')); return p; }
/* رمز الزرّ مرسوماً لا حرفاً (خط القراءة لا يغطّي المثلثات ولا علامة الطرح): - + أو سهم l r u d */
function cpGlyph(b, x, y, k) { const c = css('--compass'), P = { l: [[-9, 0], [7, -10], [7, 10]], r: [[9, 0], [-7, -10], [-7, 10]], u: [[0, -9], [-10, 7], [10, 7]], d: [[0, 9], [-10, -7], [10, -7]] }[k];
  if (P) el('polygon', { points: polyStr(P.map(([a, q]) => [x + a, y + q])), fill: c, 'pointer-events': 'none' }, b); else { geoLine(b, x - 9, y, x + 9, y, { color: c, w: 4.2 }); if (k === '+') geoLine(b, x, y - 9, x, y + 9, { color: c, w: 4.2 }); } }
/* زرّان داخل المسرح (−، +) بخطوات: المحرّك يحرّك أداةً بلا سحب حرّ */
function svgSteppers(svg, at, onStep, o = {}) { return [-1, 1].map((d, i) => { const [x, y] = at[i], b = el('g', { role: 'button', tabindex: 0, 'aria-label': plain(labelText(o.labels ? o.labels[i] : (d < 0 ? 'stepLess' : 'stepMore'))), style: 'cursor:pointer', 'data-step': (o.key || 's') + ':' + d }, svg); el('circle', { cx: x, cy: y, r: 24, fill: '#eef6fb', stroke: css('--compass'), 'stroke-width': 2.5 }, b); cpGlyph(b, x, y, o.glyphs ? o.glyphs[i] : d < 0 ? '-' : '+'); hitPad(b, 72);
    const go = () => onStep(d); b.onclick = go; b.onkeydown = e => { if (isActKey(e)) { e.preventDefault(); go(); } }; return b; }); }
const cpItem = d => ({
  make(spec) { return { ...spec, ...d.make(spec) }; },
  async ask(item, mode, tries) { const svg = cpStage(d.H || 240), ctx = d.draw(svg, item, tries) || {}; ctx.svg = svg;
    if (tries >= 3) { await S(d.tLine); if (d.together) await d.together(item, ctx); } else { await S(item.q, { noGap: !!d.sayQ }); if (d.sayQ) await d.sayQ(item); }
    const k = await d.pick(item, ctx); return { ans: k, ctx }; },
  judge(item, k) { return k === item.want ? { ok: true } : { ok: false, err: d.errOf(item, k) }; },
  onOk(item, r) { if (d.num) numItem.onOk(item, r); else SFX.good(); }, onWrong(item, r) { if (d.num) numItem.onWrong(item, r); else SFX.soft(); },
  async hint2() { await S(d.hint); }, async together() {},
  async reveal(item, r) { if (d.show) await d.show(item, r.ctx); await S(typeof d.rLine === 'function' ? d.rLine(item) : d.rLine, { noGap: !!d.rSay }); if (d.rSay) await d.rSay(item); },
  praise: () => d.praise || 'praiseThink', twin(item) { return item.twin || null; } });
const yesNo = want => choosePick([['yes', labelText('frYes'), '<i></i>', 'gen.fr.yes'], ['no', labelText('frNo'), '<i></i>', 'gen.fr.no']], want);
async function cpNum(item, ctx, unit = 'cm') { const np = numberPick(nearNums(item.want, 30, 1), item.want, { west: true }); ctx.np = np; return np.p; }

/* ================= ① مستوى الرسم (C230): sit موقف؛ الجواب free | tools | cons ================= */
const CP_SIT = { idea: 'free', map: 'free', rect: 'tools', angle: 'tools', copy: 'cons', equi: 'cons' };
const CP_LVL_IC = { free: '<svg viewBox="0 0 40 40" width="34" height="34" aria-hidden="true"><path d="M6 30 q8 -16 14 -6 t14 -10" fill="none" stroke="#3b3a36" stroke-width="3" stroke-linecap="round"/></svg>', tools: '<svg viewBox="0 0 40 40" width="34" height="34" aria-hidden="true"><rect x="4" y="22" width="32" height="10" fill="#f6e3a1" stroke="#c9a54a" stroke-width="2"/><path d="M8 18 L32 18" stroke="#3b3a36" stroke-width="3"/></svg>', cons: '<svg viewBox="0 0 40 40" width="34" height="34" aria-hidden="true"><path d="M20 6 L10 34 M20 6 L30 34" stroke="#5b6b75" stroke-width="3"/><circle cx="20" cy="6" r="3" fill="#3b4a52"/></svg>' };
ITEM.levelPick = cpItem({ tLine: 'gen.cp.together.level', hint: 'gen.cp.hint.level', rLine: it => 'gen.cp.reveal.level.' + it.want,
  make: s => ({ want: CP_SIT[s.sit], tag: 'level-pick' }),
  draw(svg, item) { const t = el('text', { x: 180, y: 118, 'text-anchor': 'middle', 'font-size': 22, 'font-weight': 800, fill: CPC.ink }, svg); t.textContent = labelText('cp.sit.' + item.sit); return {}; },
  sayQ: it => S('gen.cp.sit.' + it.sit, { append: true }),
  pick: item => choosePick(['free', 'tools', 'cons'].map(k => [k, labelText('cpLvl.' + k), CP_LVL_IC[k], 'gen.cp.lvl.' + k]), item.want),
  errOf: (it, k) => k === 'free' ? 'lvlTooFree' : 'lvlOff' });
/* ================= ② مقبول أم لا؟ (C230، C233): kind len (aim وdrawn بالمليمتر، يُقبل فرق مليمتر) | ang (aim وdrawn بالدرجات، يُقبل فرق درجتين)؛ المطلوب يُكتب ولا يُقرأ ================= */
ITEM.accCheck = cpItem({ tLine: 'gen.cp.together.acc', hint: 'gen.cp.hint.acc', rLine: it => 'gen.cp.reveal.acc.' + it.want, H: 250,
  make: s => { const tol = s.kind === 'ang' ? 2 : 1, d = Math.abs(s.drawn - s.aim); return { want: d <= tol ? 'yes' : 'no', diff: d, tag: 'acc-' + s.kind }; },
  draw(svg, item, tries) { const lab = el('text', { x: 180, y: 40, 'text-anchor': 'middle', 'font-size': 17, 'font-weight': 800, fill: CPC.ink, direction: 'rtl' }, svg);
    if (item.kind === 'ang') { lab.textContent = `${labelText('cpWant')} ${item.aim} ${labelText('cpDeg')}`; const V = [180, 196]; protAt(svg, V, 0, { R: 128 }); angleAt(svg, V, 0, item.drawn, { arc: 'in', l1: 150, l2: 150 });
      if (tries >= 3) { const m = helpG(svg), t = el('text', { x: 180, y: 222, 'text-anchor': 'middle', 'font-size': 16, 'font-weight': 800, fill: css('--think') }, m); t.textContent = `${item.drawn} ${labelText('cpDeg')} · ${labelText('cpDiff')} ${item.diff}`; } }
    else { const cm = Math.floor(item.aim / 10), mm = item.aim % 10; lab.textContent = `${labelText('cpWant')} ${cm} ${labelText('rulCm')}` + (mm ? ` ${labelText('homeAnd')} ${mm} ${labelText('rulMm')}` : ''); const R = rulerAt(svg, { x: 34, y: 132, pxcm: 30, from: 0, to: 10, mm: true }); geoLine(svg, R.X(0), 120, R.X(item.drawn / 10), 120, { color: RUL.ink, w: 4 });
      if (tries >= 3) { const m = helpG(svg); geoLine(m, R.X((item.aim - 1) / 10), 98, R.X((item.aim - 1) / 10), 126, { color: css('--think'), w: 2.4, dash: '4 3' }); geoLine(m, R.X((item.aim + 1) / 10), 98, R.X((item.aim + 1) / 10), 126, { color: css('--think'), w: 2.4, dash: '4 3' }); el('rect', { x: R.X((item.aim - 1) / 10), y: 100, width: R.X(.2) - R.X(0), height: 10, fill: css('--think'), opacity: .25 }, m); } }
    return {}; },
  pick: item => yesNo(item.want),
  errOf: it => it.want === 'yes' ? 'tolStrict' : 'tolLoose' });
/* ================= ③ أيّ أداة؟ (C230، C231، C237): task، opts من ruler | prot | setsq | compass ================= */
const CP_TASK = { len: 'ruler', angle: 'prot', perp: 'setsq', para: 'setsq', circle: 'compass', copy: 'compass', measure: 'ruler', angle2: 'prot' };
const CP_TOOL_IC = { ruler: CP_LVL_IC.tools, prot: '<svg viewBox="0 0 40 40" width="34" height="34" aria-hidden="true"><path d="M4 30 A16 16 0 0 1 36 30 Z" fill="#eaf4fa" stroke="#4f86a8" stroke-width="2"/></svg>', setsq: '<svg viewBox="0 0 40 40" width="34" height="34" aria-hidden="true"><polygon points="6,34 34,34 6,8" fill="rgba(127,182,217,.6)" stroke="#2a5f94" stroke-width="2"/></svg>', compass: CP_LVL_IC.cons };
ITEM.toolPick = cpItem({ tLine: 'gen.cp.together.tool', hint: 'gen.cp.hint.tool', rLine: it => 'gen.cp.reveal.tool.' + it.want,
  make: s => ({ want: CP_TASK[s.task], tag: 'tool-pick' }),
  draw(svg, item) { const t = el('text', { x: 180, y: 118, 'text-anchor': 'middle', 'font-size': 21, 'font-weight': 800, fill: CPC.ink }, svg); t.textContent = labelText('cp.task.' + item.task); return {}; },
  sayQ: it => S('gen.cp.task.' + it.task, { append: true }),
  pick: item => choosePick((item.tools || ['ruler', 'prot', 'setsq', 'compass']).map(k => [k, labelText('cpTool.' + k), CP_TOOL_IC[k], 'gen.cp.tool.' + k]), item.want),
  errOf: () => 'toolOff' });
/* ================= ④ مثلّث الرسم ينزلق (C231، إنتاج): mode perp (ينزلق على المستقيم حتى يمرّ ضلعه الرأسي بالنقطة) | para (ينزلق على مسطرة ثابتة حتى يمرّ ضلعه الأفقي بالنقطة)؛ p موضع النقطة بالسنتيمتر ================= */
ITEM.squareSlide = {
  make(spec) { return { ...spec, want: spec.p, tag: 'square-slide-' + spec.mode }; },
  async ask(item, mode, tries) { const svg = cpStage(276), perp = item.mode === 'perp', L0 = 214, X0 = 70, g = el('g', {}, svg), tool = el('g', {}, svg); let v = item.start ?? (perp ? (item.p <= 6 ? 10 : 1) : 0);
    geoLine(g, 30, L0, 330, L0, { color: CPC.ink, w: 3.4 }); const P = perp ? [X0 + item.p * CM, L0 - (item.h || 5) * CM] : [X0 + 6 * CM, L0 - item.p * CM]; el('circle', { cx: P[0], cy: P[1], r: 6, fill: CPC.bad }, g); const nm = el('text', { x: P[0] + 12, y: P[1] - 8, 'font-size': 18, 'font-weight': 800, fill: CPC.bad }, g); nm.textContent = LTR.n || 'ن';
    if (!perp) { el('rect', { x: 36, y: 40, width: 26, height: 190, fill: RUL.body, stroke: RUL.edge, 'stroke-width': 2 }, g); for (let i = 0; i <= 9; i++) geoLine(g, 50, L0 - i * CM, 62, L0 - i * CM, { color: RUL.ink, w: 1.2 }); }
    const draw = () => { tool.innerHTML = ''; if (perp) setSquareAt(tool, X0 + v * CM, L0, X0 + v * CM > 190 ? -110 : 110, -150);   /* يُقلب المثلث بعد المنتصف فلا يخرج من المسرح، وضلعه الرأسي في موضعه */ else setSquareAt(tool, 62, L0 - v * CM, 180, 110 > (L0 - v * CM) - 30 ? -100 : -100); /*T*/window.__slideV = v; window.__slideWant = item.p;/*/T*/ if (reg) reg(); };
    let reg = null; draw();
    const btns = svgSteppers(svg, perp ? [[44, 252], [316, 252]] : [[316, 250], [316, 60]], d => { v = Math.max(0, Math.min(perp ? 12 : 8, v + d)); SFX.tick(); draw(); }, { key: 'sq', labels: perp ? ['cpLeft', 'cpRight'] : ['cpDown', 'cpUp'], glyphs: perp ? ['l', 'r'] : ['d', 'u'] });
    if (tries >= 3) { const m = helpG(svg); if (perp) geoLine(m, P[0], P[1] - 20, P[0], L0, { color: css('--think'), w: 2.4, dash: '6 5' }); else geoLine(m, 70, P[1], P[0] + 30, P[1], { color: css('--think'), w: 2.4, dash: '6 5' }); }
    await S(tries >= 3 ? 'gen.cp.together.slide.' + item.mode : item.q);
    const t = item.p, tap = b => b.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    const fin = rulDone(() => { reg = null; btns.forEach(b => { b.onclick = null; b.onkeydown = null; b.removeAttribute('role'); }); });
    reg = () => AUTO({ kind: 'slide', ok: () => v === t ? rulDoneBtn().click() : tap(btns[v < t ? 1 : 0]), wrong: () => v === t ? tap(btns[t > 0 ? 0 : 1]) : rulDoneBtn().click() }); reg(); await fin;
    const m2 = el('g', {}, svg); if (perp) geoLine(m2, X0 + v * CM, L0, X0 + v * CM, 40, { color: CPC.ok, w: 3 }); else geoLine(m2, 40, L0 - v * CM, 330, L0 - v * CM, { color: CPC.ok, w: 3 });
    return { ans: v, ctx: { svg, set: x => { v = x; draw(); } } }; },
  judge(item, v) { return v === item.p ? { ok: true } : { ok: false, err: Math.abs(v - item.p) === 1 ? 'slideNear' : 'slideOff' }; },
  onOk() { SFX.good(); }, onWrong() { SFX.soft(); },
  async hint2(item) { await S('gen.cp.hint.slide.' + item.mode); }, async together() {},
  async reveal(item, r) { r.ctx.set(item.p); await S('gen.cp.reveal.slide.' + item.mode); },
  praise: () => 'praiseMeasure', twin(item) { return item.twin || null; },
};
/* ================= ⑤ هل هو مستطيل؟ (C232): w، h، ang زاوية الرأس الأيسر الأسفل (90 مستطيل)، وsides اختيارياً أطوال مكتوبة مختلفة ================= */
ITEM.rectCheck = cpItem({ tLine: 'gen.cp.together.rect', hint: 'gen.cp.hint.rect', rLine: it => 'gen.cp.reveal.rect.' + it.want, H: 244,
  make: s => ({ want: (s.ang || 90) === 90 && (!s.sides || (s.sides[0] === s.sides[2] && s.sides[1] === s.sides[3])) ? 'yes' : 'no', tag: 'rect-check' }),
  draw(svg, item, tries) { const a = (item.ang || 90) * Math.PI / 180, W = item.w * CM, Hh = item.h * CM, dx = Hh * Math.cos(a), A = [180 - W / 2 - dx / 2, 186], B = [A[0] + W, 186], D = [A[0] + dx, 186 - Hh * Math.sin(a)], C = [B[0] + dx, D[1]];
    el('polygon', { points: polyStr([A, B, C, D]), fill: '#eef6fb', stroke: CPC.ink, 'stroke-width': 3 }, svg); const s = item.sides || [item.w, item.h, item.w, item.h], u = labelText('rulCm');
    [[[(A[0] + B[0]) / 2, 210], s[0]], [[(B[0] + C[0]) / 2 + 30, (B[1] + C[1]) / 2], s[1]], [[(C[0] + D[0]) / 2, D[1] - 12], s[2]], [[(D[0] + A[0]) / 2 - 30, (D[1] + A[1]) / 2], s[3]]].forEach(([p, v]) => { const t = el('text', { x: p[0], y: p[1], 'text-anchor': 'middle', 'font-size': 15, 'font-weight': 800, fill: CPC.ink, direction: 'rtl' }, svg); t.textContent = `${v} ${u}`; });
    const ang = item.ang || 90, angs = [[A, ang], [B, 180 - ang], [C, ang], [D, 180 - ang]], m = tries >= 3 ? helpG(svg) : null;
    angs.forEach(([p, v], i) => { const dx2 = i === 0 || i === 3 ? 14 : -14, dy2 = i < 2 ? -12 : 20; degText(m || svg, p[0] + dx2 * 1.6, p[1] + dy2, v, { size: 13, color: v === 90 ? CPC.ok : CPC.bad }); }); return {}; },
  pick: item => yesNo(item.want),
  errOf: (it, k) => it.want === 'yes' ? 'rectMissed' : (it.ang || 90) !== 90 ? 'rectAngles' : 'rectSides' });
/* ================= ⑥ مثلث بضلعين وزاوية بينهما (C233، إنتاج): ab القاعدة، ac الضلع الثاني (سم)، deg الزاوية عند أ ================= */
ITEM.sasBuild = {
  make(spec) { return { ...spec, want: spec.deg + '|' + spec.ac, tag: 'sas-build' }; },
  async ask(item, mode, tries) { const xs = [0, item.ab * CM, item.ac * CM * Math.cos(item.deg * Math.PI / 180)], ax = 180 - (Math.min(...xs) + Math.max(...xs)) / 2, svg = cpStage(250), A = [ax, 206], B = [ax + item.ab * CM, 206],   /* المثلث المطلوب في وسط المسرح */ g = el('g', {}, svg), live = el('g', {}, svg), rd = el('text', { x: 180, y: 40, 'text-anchor': 'middle', 'font-size': 16, 'font-weight': 800, fill: CPC.ink, direction: 'rtl' }, svg);
    geoLine(g, A[0], A[1], B[0], B[1], { color: CPC.ink, w: 4 }); [[A, 'a'], [B, 'b']].forEach(([p, k]) => { const t = el('text', { x: p[0], y: p[1] + 24, 'text-anchor': 'middle', 'font-size': 18, 'font-weight': 800, fill: CPC.ink }, g); t.textContent = LTR[k]; });
    let cur = { ang: 90, len: 3 };
    const redraw = V0 => { const V = cur = { ang: V0.ang ?? cur.ang, len: V0.len ?? cur.len }; live.innerHTML = '';   /* المدرّجان يُبنيان واحداً بعد الآخر، فأوّل نداء بقيمة واحدة */ const C = angP(A, V.ang, V.len * CM); geoLine(live, A[0], A[1], C[0], C[1], { color: CPC.arc, w: 3.4 }); el('path', { d: angArc(A, 30, 0, V.ang), fill: 'none', stroke: ANG.arc, 'stroke-width': 2.6 }, live); geoLine(live, B[0], B[1], C[0], C[1], { color: '#9fb4c0', w: 2.4, dash: '6 5' }); el('circle', { cx: C[0], cy: C[1], r: 5, fill: CPC.arc }, live); const t = el('text', { x: C[0], y: C[1] - 12, 'text-anchor': 'middle', 'font-size': 18, 'font-weight': 800, fill: CPC.arc }, live); t.textContent = LTR.j || 'ج';
      rd.textContent = `${labelText('cpAngA')} ${V.ang} ${labelText('cpDeg')} · ${labelText('cpSideAC')} ${V.len} ${labelText('rulCm')}`; /*T*/window.__sasCur = [V.ang, V.len];/*/T*/ };
    redraw(cur); const sg = el('text', { x: (A[0] + B[0]) / 2, y: 232, 'text-anchor': 'middle', 'font-size': 14, 'font-weight': 700, fill: CPC.ink, direction: 'rtl' }, g); sg.textContent = `${item.ab} ${labelText('rulCm')}`;
    if (tries >= 3) { const m = helpG(svg), C = angP(A, item.deg, 170); geoLine(m, A[0], A[1], C[0], C[1], { color: css('--think'), w: 2.2, dash: '6 5' }); }
    await S(tries >= 3 ? 'gen.cp.together.sas' : item.q, { noGap: true }); await sayDeg(item.deg); await S('gen.cp.sideIs', { noGap: true, append: true }); await sayLen(item.ac, 'cm');
    const v = await stepperAsk([{ key: 'ang', min: 10, max: 170, val: 90, step: 5, unit: 'cpDeg' }, { key: 'len', min: 1, max: 7, val: 3, unit: 'rulCm' }], { kind: 'sas', onChange: redraw, auto: { ok: { ang: item.deg, len: item.ac }, wrong: { ang: 180 - item.deg === item.deg ? item.deg + 10 : 180 - item.deg, len: item.ac } } });
    return { ans: v.ang + '|' + v.len, ctx: { svg, redraw } }; },
  judge(item, k) { const [a, l] = k.split('|').map(Number); return a === item.deg && l === item.ac ? { ok: true } : { ok: false, err: a === 180 - item.deg ? 'protScale' : a !== item.deg ? 'sasAngle' : 'sasSide' }; },
  onOk() { SFX.good(); }, onWrong() { SFX.soft(); },
  async hint2() { await S('gen.cp.hint.sas'); }, async together() {},
  async reveal(item, r) { r.ctx.redraw({ ang: item.deg, len: item.ac }); await S('gen.cp.reveal.sas'); },
  praise: () => 'praiseNewWay', twin(item) { return item.twin || null; },
};
/* ================= ⑦ أكمل متوازي الأضلاع (C234، إنتاج): a وb وd رؤوس على الشبكة؛ يلمس الطفل ج ================= */
const PG = { c: 28, cols: 10, rows: 6, x0: 40, y0: 206 };
ITEM.paraComplete = {
  make(spec) { const c = [spec.b[0] + spec.d[0] - spec.a[0], spec.b[1] + spec.d[1] - spec.a[1]]; return { ...spec, cpt: c, want: c.join(','), tag: 'para-complete' }; },
  async ask(item, mode, tries) { const svg = newStage(262, { oasis: false, ground: 0 }), { c, cols, rows, x0, y0 } = PG, P = (r, u) => [x0 + r * c, y0 - u * c], g = el('g', {}, svg); let cur = null, mark = null;
    el('rect', { x: x0 - 12, y: y0 - rows * c - 12, width: cols * c + 24, height: rows * c + 24, rx: 10, fill: GEO.paper, stroke: css('--line'), 'stroke-width': 2 }, g); for (let i = 0; i <= cols; i++) geoLine(g, ...P(i, 0), ...P(i, rows), { color: '#d5e2ea', w: 1.3 }); for (let j = 0; j <= rows; j++) geoLine(g, ...P(0, j), ...P(cols, j), { color: '#d5e2ea', w: 1.3 });
    const [A, B, D] = [item.a, item.b, item.d].map(q => P(...q)); geoLine(g, ...A, ...B, { color: CPC.ink, w: 3.4 }); geoLine(g, ...A, ...D, { color: CPC.ink, w: 3.4 }); [[A, 'a'], [B, 'b'], [D, 'd']].forEach(([p, k]) => { el('circle', { cx: p[0], cy: p[1], r: 5, fill: CPC.ink }, g); const t = el('text', { x: p[0] - 12, y: p[1] - 8, 'font-size': 17, 'font-weight': 800, fill: CPC.ink }, g); t.textContent = LTR[k]; });
    const set = q => { cur = q; if (mark) mark.remove(); mark = el('g', { 'pointer-events': 'none' }, svg); const Cq = P(...q); geoLine(mark, ...B, ...Cq, { color: CPC.arc, w: 3, dash: '7 5' }); geoLine(mark, ...D, ...Cq, { color: CPC.arc, w: 3, dash: '7 5' }); el('circle', { cx: Cq[0], cy: Cq[1], r: 7, fill: CPC.arc }, mark); SFX.tick(); /*T*/window.__pcCur = q.join(',');/*/T*/ };
    if (tries >= 3) { const m = helpG(svg), dv = [item.d[0] - item.a[0], item.d[1] - item.a[1]]; cpArrow(m, B, P(item.b[0] + dv[0], item.b[1] + dv[1]), { color: css('--think') }); cpArrow(m, A, D, { color: css('--think') }); }
    await S(tries >= 3 ? 'gen.cp.together.para' : item.q);
    const input = fingerInput(svg, { map: e => { const p = svgPoint(svg, e); return [p.x, p.y]; }, down(q) { const r = Math.round((q[0] - x0) / c), u = Math.round((y0 - q[1]) / c); if (r < 0 || r > cols || u < 0 || u > rows) return false; set([r, u]); return false; }, move() {}, up() {} });
    const kg = el('g', { role: 'grid', 'aria-label': labelText('geoGrid') }, svg); for (let u = rows; u >= 0; u--) { const row = el('g', { role: 'row' }, kg); for (let r = 0; r <= cols; r++) { const [x, y] = P(r, u), b = el('g', { role: 'gridcell', tabindex: 0, 'aria-label': `${DG(r)}، ${DG(u)}` }, row); el('circle', { cx: x, cy: y, r: 9, fill: 'transparent', 'pointer-events': 'none' }, b); b.onkeydown = e => { if (isActKey(e)) { e.preventDefault(); set([r, u]); } }; } }
    /*T*/window.__pcAt = (r, u) => { const m = svg.getScreenCTM(), [x, y] = P(r, u); return { x: m.a * x + m.e, y: m.d * y + m.f }; }; window.__pcWant = item.cpt;/*/T*/
    AUTO({ kind: 'paraC', ok: () => { set(item.cpt); rulDoneBtn().click(); }, wrong: () => { set([item.cpt[0] + 1, item.cpt[1]]); rulDoneBtn().click(); } });
    await rulDone(() => { input.off(); kg.remove(); }); return { ans: cur ? cur.join(',') : '', ctx: { svg, set } }; },
  judge(item, k) { return k === item.want ? { ok: true } : { ok: false, err: 'paraOff' }; },
  onOk() { SFX.good(); }, onWrong() { SFX.soft(); },
  async hint2() { await S('gen.cp.hint.para'); }, async together() {},
  async reveal(item, r) { r.ctx.set(item.cpt); await S('gen.cp.reveal.para'); },
  praise: () => 'praiseNewWay', twin(item) { return item.twin || null; },
};
/* ================= ⑧ أجزاء الدائرة (C235): part center | radius | diameter ================= */
function circleFig(parent, C, r, part, col = CPC.bad, rot = null) { const g = el('g', { 'pointer-events': 'none' }, parent); el('circle', { cx: C[0], cy: C[1], r, fill: '#fffdf6', stroke: CPC.ink, 'stroke-width': 3 }, g); el('circle', { cx: C[0], cy: C[1], r: 3.5, fill: CPC.ink }, g);
  if (part === 'center') el('circle', { cx: C[0], cy: C[1], r: 9, fill: 'none', stroke: col, 'stroke-width': 3.4 }, g);
  else if (part === 'radius') { const Q = angP(C, rot ?? 35, r); geoLine(g, C[0], C[1], Q[0], Q[1], { color: col, w: 4.4 }); }
  else if (part === 'diameter') { const P1 = angP(C, rot ?? 160, r), P2 = angP(C, (rot ?? 160) + 180, r); geoLine(g, P1[0], P1[1], P2[0], P2[1], { color: col, w: 4.4 }); }
  return g; }
ITEM.circPart = cpItem({ tLine: 'gen.cp.together.part', hint: 'gen.cp.hint.part', rLine: it => 'gen.cp.reveal.part.' + it.want,
  make: s => ({ want: s.part, tag: 'circ-part' }),
  draw(svg, item, tries) { circleFig(svg, [180, 118], item.r || 82, item.part, CPC.bad, item.rot ?? null); if (tries >= 3) { const m = helpG(svg), t = el('text', { x: 180, y: 222, 'text-anchor': 'middle', 'font-size': 15, 'font-weight': 800, fill: css('--think') }, m); t.textContent = labelText('cpPartHint.' + item.part); } return {}; },
  pick: item => choosePick(['center', 'radius', 'diameter'].map(k => [k, labelText('cpPart.' + k), '<i></i>', 'gen.cp.part.' + k]), item.want),
  errOf: (it, k) => it.want === 'diameter' && k === 'radius' || it.want === 'radius' && k === 'diameter' ? 'radDiaMix' : 'partOff' });
/* ================= ⑨ القطر ونصف القطر (C236): r معلوم يُسأل عن القطر، أو d معلوم يُسأل عن نصف القطر (فتحة الفرجار) ================= */
ITEM.radDia = cpItem({ tLine: 'gen.cp.together.rd', hint: 'gen.cp.hint.rd', rLine: it => it.r ? 'gen.cp.reveal.dia' : 'gen.cp.reveal.rad', rSay: it => sayLen(it.want, 'cm'), num: true, praise: 'praiseCount',
  make: s => ({ want: s.r ? 2 * s.r : s.d / 2, tag: s.r ? 'rad-to-dia' : 'dia-to-rad' }),
  draw(svg, item, tries) { const C = [180, 132], R = 76; circleFig(svg, C, R, item.r ? 'radius' : 'diameter', item.r ? CPC.bad : CPC.ok); const t = el('text', { x: 180, y: 38, 'text-anchor': 'middle', 'font-size': 17, 'font-weight': 800, fill: CPC.ink, direction: 'rtl' }, svg); t.textContent = item.r ? `${labelText('cpPart.radius')}: ${item.r} ${labelText('rulCm')}` : `${labelText('cpPart.diameter')}: ${item.d} ${labelText('rulCm')}`;
    if (tries >= 3) { const m = helpG(svg); if (item.r) { const P1 = angP(C, 215, R); geoLine(m, C[0], C[1], P1[0], P1[1], { color: css('--think'), w: 4, dash: '7 4' }); } else { const Q = angP(C, 90, R); geoLine(m, C[0], C[1], Q[0], Q[1], { color: css('--think'), w: 4, dash: '7 4' }); } } return {}; },
  pick: (item, ctx) => { const np = numberPick(shuffle([...fillOpts(new Set([item.want, item.r ? item.r : item.d]), item.want, 1, 30)].slice(0, 3)), item.want, { west: true }); ctx.np = np; return np.p; },
  errOf: (it, k) => k === (it.r || it.d) ? (it.r ? 'diaIsRad' : 'openIsDia') : 'rdOff' });
/* ================= ⑩ ارسم الدائرة بالفرجار (C237، إنتاج): r أو d؛ يضبط الطفل الفتحة على المسطرة ثم «تمّ» فيدور القلم ================= */
ITEM.compassDraw = {
  make(spec) { return { ...spec, want: spec.r || spec.d / 2, tag: 'compass-draw' + (spec.d ? '-dia' : '') }; },
  async ask(item, mode, tries) { const svg = cpStage(272), C = [96, 146], tool = el('g', {}, svg), R = rulerAt(svg, { x: C[0], y: 156, pxcm: CM, from: 0, to: 11, mm: false }); let v = 1;
    const lab = el('text', { x: 180, y: 38, 'text-anchor': 'middle', 'font-size': 17, 'font-weight': 800, fill: CPC.ink, direction: 'rtl' }, svg); lab.textContent = item.r ? `${labelText('cpPart.radius')}: ${item.r} ${labelText('rulCm')}` : `${labelText('cpPart.diameter')}: ${item.d} ${labelText('rulCm')}`;
    const draw = () => { tool.innerHTML = ''; cpCompassAt(tool, [R.X(0), 154], [R.X(v), 154]); const t = el('text', { x: 180, y: 232, 'text-anchor': 'middle', 'font-size': 16, 'font-weight': 800, fill: CPC.arc, direction: 'rtl' }, tool); t.textContent = `${labelText('cpOpen')} ${v} ${labelText('rulCm')}`; /*T*/window.__cdV = v; window.__cdWant = item.want;/*/T*/ if (reg) reg(); };
    let reg = null; draw();
    const btns = svgSteppers(svg, [[44, 232], [316, 232]], d => { v = Math.max(1, Math.min(10, v + d)); SFX.tick(); draw(); }, { key: 'cd', labels: ['cpClose', 'cpOpenMore'] });
    if (tries >= 3) { const m = helpG(svg); geoLine(m, R.X(item.want), 120, R.X(item.want), 152, { color: css('--think'), w: 3, dash: '5 4' }); }
    await S(tries >= 3 ? 'gen.cp.together.cd' : item.q, { noGap: true }); await sayLen(item.r || item.d, 'cm');
    const t = item.want, tap = b => b.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    const fin = rulDone(() => { reg = null; btns.forEach(b => { b.onclick = null; b.onkeydown = null; b.removeAttribute('role'); }); });
    reg = () => AUTO({ kind: 'compass', ok: () => v === t ? rulDoneBtn().click() : tap(btns[v < t ? 1 : 0]), wrong: () => { const w = item.d && item.d <= 10 ? item.d : t < 10 ? t + 1 : t - 1; if (v === w) rulDoneBtn().click(); else tap(btns[v < w ? 1 : 0]); } }); reg(); await fin;
    const s2 = cpStage(272), K = Math.min(CM, 104 / Math.max(v, item.want)); cpCompassAt(s2, [180, 146], [180 + v * K, 146]); await drawCircleAnim(s2, [180, 146], v * K, CPC.arc); const t2 = el('text', { x: 180, y: 38, 'text-anchor': 'middle', 'font-size': 17, 'font-weight': 800, fill: CPC.arc, direction: 'rtl' }, s2); t2.textContent = `${labelText('cpPart.radius')}: ${v} ${labelText('rulCm')}`;
    return { ans: v, ctx: { svg: s2, K } }; },
  judge(item, v) { return v === item.want ? { ok: true } : { ok: false, err: item.d && v === item.d ? 'openIsDia' : 'openOff' }; },
  onOk() { SFX.good(); }, onWrong() { SFX.soft(); },
  async hint2(item) { await S(item.d ? 'gen.cp.hint.cdDia' : 'gen.cp.hint.cd'); }, async together() {},
  async reveal(item, r) { const m = helpG(r.ctx.svg); await drawCircleAnim(m, [180, 146], item.want * r.ctx.K, CPC.ok); await S('gen.cp.reveal.cd', { noGap: true }); await sayLen(item.want, 'cm'); },
  praise: () => 'praiseMeasure', twin(item) { return item.twin || null; },
};
/* ================= ⑪ أيّ القطع بطول أب؟ (C238): ab وopts ثلاثة أطوال بالسنتيمتر (واحد يساويه) ================= */
ITEM.transferPick = {
  make(spec) { const want = spec.opts.indexOf(spec.ab); /*T*/if (TESTHOOK && spec.opts.filter(x => x === spec.ab).length !== 1) testBug('transferPick: قطعة واحدة بالطول');/*/T*/ return { ...spec, want, tag: 'transfer-pick' }; },
  async ask(item, mode, tries) { const svg = cpStage(290), Y = [154, 200, 246], g = el('g', {}, svg), A = [70, 104];
    geoLine(g, A[0], A[1], A[0] + item.ab * CM, A[1], { color: CPC.ink, w: 4 }); [[A, 'a'], [[A[0] + item.ab * CM, A[1]], 'b']].forEach(([p, k]) => { const t = el('text', { x: p[0], y: p[1] - 10, 'text-anchor': 'middle', 'font-size': 17, 'font-weight': 800, fill: CPC.ink }, g); t.textContent = LTR[k]; });
    const T = item.opts.map((L, i) => { const s = el('g', {}, svg), x1 = 300 - L * CM; el('rect', { x: x1 - 10, y: Y[i] - 22, width: L * CM + 20, height: 44, fill: 'transparent' }, s); geoLine(s, x1, Y[i], 300, Y[i], { color: CPC.toolEdge, w: 4 }); return { g: s, k: i, label: labelText('cpSeg' + (i + 1)) }; });
    if (tries >= 3) { const m = helpG(svg); cpCompassAt(m, A, [A[0] + item.ab * CM, A[1]]); item.opts.forEach((L, i) => { const x1 = 300 - L * CM; el('path', { d: arcPath([x1, Y[i]], item.ab * CM, -12, 12), fill: 'none', stroke: CPC.arc, 'stroke-width': 3 }, m); }); await S('gen.cp.together.transfer'); } else await S(item.q);
    const k = await tapOne(T, { ok: item.want, pad: 64 }); return { ans: k, ctx: { svg } }; },
  judge(item, k) { return k === item.want ? { ok: true } : { ok: false, err: 'transferOff' }; },
  onOk() { SFX.good(); }, onWrong() { SFX.soft(); },
  async hint2() { await S('gen.cp.hint.transfer'); }, async together() {},
  async reveal() { await S('gen.cp.reveal.transfer'); },
  praise: () => 'praiseMeasure', twin(item) { return item.twin || null; },
};
/* ================= ⑫ هل يتكوّن مثلث؟ (C240): s ثلاثة أطوال بالسنتيمتر ================= */
function arcsMeet(base, r1, r2) { const c = base; if (r1 + r2 <= c || r1 + c <= r2 || r2 + c <= r1) return null; const x = (r1 * r1 - r2 * r2 + c * c) / (2 * c), y = Math.sqrt(Math.max(0, r1 * r1 - x * x)); return [x, y]; }
async function arcsShow(svg, s, o = {}) { const [c, a, b] = [...s].sort((p, q) => q - p), A = [180 - c * CM / 2, o.y || 196], B = [A[0] + c * CM, A[1]], m = o.g || helpG(svg);
  geoLine(m, A[0], A[1], B[0], B[1], { color: CPC.ink, w: 4 }); const meet = arcsMeet(c, a, b);
  el('path', { d: arcPath(A, a * CM, 5, 120), fill: 'none', stroke: CPC.arc, 'stroke-width': 2.6 }, m); SFX.tick(); await sleep(FAST ? 10 : 300); el('path', { d: arcPath(B, b * CM, 60, 175), fill: 'none', stroke: CPC.toolEdge, 'stroke-width': 2.6 }, m); SFX.tick(); await sleep(FAST ? 10 : 300);
  if (meet) { const Cp = [A[0] + meet[0] * CM, A[1] - meet[1] * CM]; geoLine(m, A[0], A[1], Cp[0], Cp[1], { color: CPC.ok, w: 3 }); geoLine(m, B[0], B[1], Cp[0], Cp[1], { color: CPC.ok, w: 3 }); el('circle', { cx: Cp[0], cy: Cp[1], r: 5, fill: CPC.ok }, m); } return { m, meet }; }
ITEM.triExists = cpItem({ tLine: 'gen.cp.together.tri', hint: 'gen.cp.hint.tri', rLine: it => 'gen.cp.reveal.tri.' + it.want, H: 256,
  make: s => { const [c, a, b] = [...s.s].sort((p, q) => q - p); return { want: a + b > c ? 'yes' : 'no', tag: 'tri-exists' }; },
  draw(svg, item) { item.s.forEach((L, i) => { const y = 54 + i * 26, x1 = 300 - L * CM; geoLine(svg, x1, y, 300, y, { color: ['#c8392d', '#2f9d6b', '#2a5f94'][i], w: 5 }); const t = el('text', { x: x1 - 10, y: y + 6, 'text-anchor': 'end', 'font-size': 15, 'font-weight': 800, fill: CPC.ink, direction: 'rtl' }, svg); t.textContent = `${L} ${labelText('rulCm')}`; }); return {}; },
  async together(item, ctx) { await arcsShow(ctx.svg, item.s, { y: 230 }); },
  pick: item => yesNo(item.want),
  errOf: it => it.want === 'no' ? 'triAlways' : 'triMissed' });
/* ================= ⑬ أنشئ المثلث بثلاثة أضلاع (C239، C240، إنتاج): base القاعدة، a وb الضلعان الآخران؛ يضبط الطفل فتحتي القوسين من طرفي القاعدة ================= */
ITEM.sssBuild = {
  make(spec) { return { ...spec, want: [spec.a, spec.b].sort().join(','), tag: 'sss-build' + (spec.a === spec.b && spec.b === spec.base ? '-eq' : '') }; },
  async ask(item, mode, tries) { const svg = cpStage(262), c = item.base, A = [180 - c * CM / 2, 222], B = [A[0] + c * CM, 222], g = el('g', {}, svg), live = el('g', {}, svg), rd = el('text', { x: 180, y: 38, 'text-anchor': 'middle', 'font-size': 16, 'font-weight': 800, fill: CPC.ink, direction: 'rtl' }, svg);
    geoLine(g, A[0], A[1], B[0], B[1], { color: CPC.ink, w: 4 }); [[A, 'a'], [B, 'b']].forEach(([p, k]) => { const t = el('text', { x: p[0], y: p[1] + 22, 'text-anchor': 'middle', 'font-size': 17, 'font-weight': 800, fill: CPC.ink }, g); t.textContent = LTR[k]; }); const sl = el('text', { x: 180, y: 244, 'text-anchor': 'middle', 'font-size': 14, 'font-weight': 700, fill: CPC.ink, direction: 'rtl' }, g); sl.textContent = `${c} ${labelText('rulCm')}`;
    const redraw = V0 => { const V = { r1: V0.r1 ?? 2, r2: V0.r2 ?? 2 }; live.innerHTML = ''; el('path', { d: arcPath(A, V.r1 * CM, 8, 150), fill: 'none', stroke: CPC.arc, 'stroke-width': 2.6 }, live); el('path', { d: arcPath(B, V.r2 * CM, 30, 172), fill: 'none', stroke: CPC.toolEdge, 'stroke-width': 2.6 }, live); const meet = arcsMeet(c, V.r1, V.r2);
      if (meet) { const Cp = [A[0] + meet[0] * CM, A[1] - meet[1] * CM]; geoLine(live, A[0], A[1], Cp[0], Cp[1], { color: '#9fb4c0', w: 2.4, dash: '6 5' }); geoLine(live, B[0], B[1], Cp[0], Cp[1], { color: '#9fb4c0', w: 2.4, dash: '6 5' }); el('circle', { cx: Cp[0], cy: Cp[1], r: 5, fill: CPC.ok }, live); }
      rd.textContent = `${labelText('cpArcA')} ${V.r1} · ${labelText('cpArcB')} ${V.r2} ${labelText('rulCm')}`; /*T*/window.__sssCur = [V.r1, V.r2];/*/T*/ };
    redraw({ r1: 2, r2: 2 });
    if (tries >= 3) { const m = helpG(svg); el('circle', { cx: A[0], cy: A[1], r: item.a * CM, fill: 'none', stroke: css('--think'), 'stroke-width': 1.6, 'stroke-dasharray': '5 5' }, m); }
    await S(tries >= 3 ? 'gen.cp.together.sss' : item.q, { noGap: true }); await sayLen(item.a, 'cm'); await S('gen.cp.and', { noGap: true, append: true }); await sayLen(item.b, 'cm');
    const v = await stepperAsk([{ key: 'r1', min: 1, max: 9, val: 2, unit: 'rulCm' }, { key: 'r2', min: 1, max: 9, val: 2, unit: 'rulCm' }], { kind: 'sss', onChange: redraw, auto: { ok: { r1: item.a, r2: item.b }, wrong: { r1: item.a, r2: item.a === item.b ? item.b + 1 : item.a } } });
    return { ans: [v.r1, v.r2].sort().join(','), ctx: { svg, redraw } }; },
  judge(item, k) { return k === item.want ? { ok: true } : { ok: false, err: k.split(',').map(Number).some(x => x === item.base) ? 'sssBase' : 'sssOff' }; },
  onOk() { SFX.good(); }, onWrong() { SFX.soft(); },
  async hint2() { await S('gen.cp.hint.sss'); }, async together() {},
  async reveal(item, r) { r.ctx.redraw({ r1: item.a, r2: item.b }); await S('gen.cp.reveal.sss'); },
  praise: () => 'praiseNewWay', twin(item) { return item.twin || null; },
};
/* ================= ⑭ رتّب خطوات الإنشاء (C237، C238، C239، C241): kind circle | copy | equi | sss | hex؛ يلمس الطفل البطاقات بالترتيب ================= */
const CP_STEPS = { equi: ['ab', 'open', 'arcs', 'join'], sss: ['base', 'arc1', 'arc2', 'join'], hex: ['circle', 'keep', 'mark', 'join'], copy: ['line', 'open', 'move', 'arc'], circle: ['measure', 'pin', 'turn', 'check'] };
const CO_XY = [[262, 84], [98, 84], [262, 184], [98, 184]];
ITEM.consOrder = {
  make(spec) { const st = CP_STEPS[spec.kind], shown = spec.shown || [2, 0, 3, 1]; return { ...spec, st, shown, want: st.map((s, i) => shown.indexOf(i)).join(','), tag: 'cons-order-' + spec.kind }; },
  async ask(item, mode, tries) { const svg = cpStage(262), picked = [], badges = el('g', { 'pointer-events': 'none' }, svg);
    const cards = item.shown.map((si, i) => { const g = el('g', { role: 'button', tabindex: 0, 'aria-label': plain(labelText('cpStep.' + item.kind + '.' + item.st[si])), style: 'cursor:pointer' }, svg); el('rect', { x: CO_XY[i][0] - 76, y: CO_XY[i][1] - 40, width: 152, height: 80, rx: 14, fill: '#fffdf6', stroke: css('--line'), 'stroke-width': 2.5 }, g); const t = el('text', { x: CO_XY[i][0], y: CO_XY[i][1] + 6, 'text-anchor': 'middle', 'font-size': 15, 'font-weight': 800, fill: CPC.ink }, g); t.textContent = labelText('cpStep.' + item.kind + '.' + item.st[si]); return g; });
    if (tries >= 3) { const m = helpG(svg), w0 = item.want.split(',').map(Number)[0]; el('rect', { x: CO_XY[w0][0] - 80, y: CO_XY[w0][1] - 44, width: 160, height: 88, rx: 16, fill: 'none', stroke: css('--think'), 'stroke-width': 3.4, 'stroke-dasharray': '7 5' }, m); await S('gen.cp.together.order'); } else await S(item.q);
    /*T*/window.__coWant = item.want.split(',').map(Number); window.__coAt = i => { const r = cards[i].getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2 }; };/*/T*/
    await gate(new Promise(res => { const pick = i => { if (picked.includes(i) || picked.length >= cards.length) return; picked.push(i); SFX.tick(); badge(badges, CO_XY[i][0] + 64, CO_XY[i][1] - 34, picked.length, css('--compass')); cards[i].querySelector('rect').setAttribute('fill', '#eef6fb'); if (picked.length === cards.length) { AUTO_CLEAR(); res(); } };
      cards.forEach((g, i) => { g.onclick = () => pick(i); g.onkeydown = e => { if (isActKey(e)) { e.preventDefault(); pick(i); } }; });
      AUTO({ kind: 'consOrder', ok: () => item.want.split(',').forEach(i => pick(+i)), wrong: () => [...item.want.split(',')].reverse().forEach(i => pick(+i)) }); }));
    cards.forEach(g => { g.onclick = null; g.onkeydown = null; g.removeAttribute('role'); }); return { ans: picked.join(','), ctx: { svg } }; },
  judge(item, k) { return k === item.want ? { ok: true } : { ok: false, err: 'stepsOff' }; },
  onOk() { SFX.good(); }, onWrong() { SFX.soft(); },
  async hint2() { await S('gen.cp.hint.order'); }, async together() {},
  async reveal(item) { for (const s of item.st) await S('gen.cp.step.' + item.kind + '.' + s); },
  praise: () => 'praiseThink', twin(item) { return item.twin || null; },
};
/* ================= ⑮ السداسي بالفرجار (C241، إنتاج): r نصف قطر الدائرة؛ يضبط الطفل الفتحة ثم يعلّم ستّ نقاط ================= */
ITEM.hexStep = {
  make(spec) { return { ...spec, want: spec.r, tag: 'hex-step' }; },
  async ask(item, mode, tries) { const svg = cpStage(276), C = [180, 148], K = Math.min(CM, 92 / item.r), R = item.r * K, g = el('g', {}, svg), tool = el('g', {}, svg); let v = Math.max(1, item.r - 2);   /* المقياس يصغر مع نصف القطر الكبير فتبقى الدائرة في المسرح */
    el('circle', { cx: C[0], cy: C[1], r: R, fill: 'none', stroke: CPC.ink, 'stroke-width': 3 }, g); el('circle', { cx: C[0], cy: C[1], r: 3.5, fill: CPC.ink }, g); const P0 = [C[0] + R, C[1]]; el('circle', { cx: P0[0], cy: P0[1], r: 5, fill: CPC.bad }, g);
    const lab = el('text', { x: 180, y: 36, 'text-anchor': 'middle', 'font-size': 16, 'font-weight': 800, fill: CPC.ink, direction: 'rtl' }, svg);
    const draw = () => { tool.innerHTML = ''; const a = 2 * Math.asin(Math.min(1, v / (2 * item.r))), Q = [C[0] + R * Math.cos(a), C[1] - R * Math.sin(a)]; cpCompassAt(tool, P0, Q); lab.textContent = `${labelText('cpPart.radius')} ${item.r} · ${labelText('cpOpen')} ${v} ${labelText('rulCm')}`; /*T*/window.__hxV = v; window.__hxWant = item.r;/*/T*/ if (reg) reg(); };
    let reg = null; draw();
    const btns = svgSteppers(svg, [[40, 248], [320, 248]], d => { v = Math.max(1, Math.min(10, v + d)); SFX.tick(); draw(); }, { key: 'hx', labels: ['cpClose', 'cpOpenMore'] });
    if (tries >= 3) { const m = helpG(svg); geoLine(m, C[0], C[1], P0[0], P0[1], { color: css('--think'), w: 3, dash: '6 4' }); }
    await S(tries >= 3 ? 'gen.cp.together.hex' : item.q);
    const t = item.r, tap = b => b.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    const fin = rulDone(() => { reg = null; btns.forEach(b => { b.onclick = null; b.onkeydown = null; b.removeAttribute('role'); }); });
    reg = () => AUTO({ kind: 'hex', ok: () => v === t ? rulDoneBtn().click() : tap(btns[v < t ? 1 : 0]), wrong: () => v === t ? tap(btns[t < 10 ? 1 : 0]) : rulDoneBtn().click() }); reg(); await fin;
    tool.innerHTML = ''; const m2 = el('g', {}, svg), a = 2 * Math.asin(Math.min(1, v / (2 * item.r))), pts = []; for (let i = 0; i <= 6; i++) { const q = [C[0] + R * Math.cos(a * i), C[1] - R * Math.sin(a * i)]; pts.push(q); el('circle', { cx: q[0], cy: q[1], r: 5, fill: i === 6 && v !== item.r ? CPC.bad : CPC.arc }, m2); if (i) el('path', { d: arcPath(pts[i - 1], v * K, a * i * 180 / Math.PI + 60 - 25, a * i * 180 / Math.PI + 60 + 25), fill: 'none', stroke: CPC.arc, 'stroke-width': 2 }, m2); SFX.tick(); await sleep(FAST ? 5 : 180); }
    if (v === item.r) el('polygon', { points: polyStr(pts.slice(0, 6)), fill: 'none', stroke: CPC.ok, 'stroke-width': 3 }, m2);
    return { ans: v, ctx: { svg } }; },
  judge(item, v) { return v === item.r ? { ok: true } : { ok: false, err: 'hexOpen' }; },
  onOk() { SFX.good(); }, onWrong() { SFX.soft(); },
  async hint2() { await S('gen.cp.hint.hex'); }, async together() {},
  async reveal(item) { await S('gen.cp.reveal.hex', { noGap: true }); await sayLen(item.r, 'cm'); },
  praise: () => 'praiseNewWay', twin(item) { return item.twin || null; },
};
/* ================= ⑯ ضلع السداسي (C241): r ================= */
function hexInCircle(parent, C, R, o = {}) { const g = el('g', { 'pointer-events': 'none' }, parent), P = [...Array(6).keys()].map(i => angP(C, 30 + 60 * i, R)); el('circle', { cx: C[0], cy: C[1], r: R, fill: 'none', stroke: '#9fb4c0', 'stroke-width': 2 }, g); el('polygon', { points: polyStr(P), fill: o.fill || '#eef6fb', stroke: CPC.ink, 'stroke-width': 3 }, g); el('circle', { cx: C[0], cy: C[1], r: 3.5, fill: CPC.ink }, g); return { g, P }; }
ITEM.hexSide = cpItem({ tLine: 'gen.cp.together.hexS', hint: 'gen.cp.hint.hexS', rLine: 'gen.cp.reveal.hexS', rSay: it => sayLen(it.want, 'cm'), num: true, praise: 'praiseCount',
  make: s => ({ want: s.r, tag: 'hex-side' }),
  draw(svg, item, tries) { const C = [180, 132], H = hexInCircle(svg, C, 78); const Q = angP(C, 330, 78); geoLine(svg, C[0], C[1], Q[0], Q[1], { color: CPC.bad, w: 3.4 }); const t = el('text', { x: 180, y: 32, 'text-anchor': 'middle', 'font-size': 17, 'font-weight': 800, fill: CPC.ink, direction: 'rtl' }, svg); t.textContent = `${labelText('cpPart.radius')}: ${item.r} ${labelText('rulCm')}`;
    if (tries >= 3) { const m = helpG(svg); el('polygon', { points: polyStr([C, H.P[5], H.P[0]]), fill: css('--think'), opacity: .25 }, m); } return {}; },
  pick: (item, ctx) => { const np = numberPick(shuffle([...fillOpts(new Set([item.want, 2 * item.want]), item.want, 1, 30)].slice(0, 3)), item.want, { west: true }); ctx.np = np; return np.p; },
  errOf: (it, k) => k === 2 * it.r ? 'hexSideDia' : 'hexSideOff' });
/* ================= ⑰ محاور الزخرفة (C242): pat من FLW_PAT — ألوان البتلات الست ================= */
const FLW_PAT = { all: [0, 0, 0, 0, 0, 0], alt: [0, 1, 0, 1, 0, 1], one: [1, 0, 0, 0, 0, 0], two: [1, 0, 0, 1, 0, 0], opp2: [0, 1, 0, 0, 1, 0], adj: [1, 1, 0, 0, 0, 0], adjB: [0, 0, 0, 1, 1, 0], half: [1, 1, 1, 0, 0, 0], skip: [1, 0, 1, 0, 0, 0], pairs: [1, 1, 0, 1, 1, 0], quad: [1, 1, 1, 1, 0, 0], five: [0, 1, 1, 1, 1, 1] };
/* محاور الزخرفة بألوانها: البتلة i عند الزاوية 90+60i، والمحور k عند 90+30k يرسلها إلى (k−i) بباقي 6؛ فالمحور ما طابق كلّ لون لونه */
const FLW_AX = Object.fromEntries(Object.entries(FLW_PAT).map(([k, p]) => [k, [0, 1, 2, 3, 4, 5].filter(a => p.every((c, i) => c === p[((a - i) % 6 + 6) % 6])).length]));
function flowerAt(parent, C, R, pat, o = {}) { const g = el('g', { 'pointer-events': 'none' }, parent), cols = ['#e9894a', '#3d7cc0']; el('circle', { cx: C[0], cy: C[1], r: R, fill: '#fffdf6', stroke: '#9fb4c0', 'stroke-width': 2 }, g);
  for (let i = 0; i < 6; i++) { const a = (90 + 60 * i) * Math.PI / 180, P = [C[0] + R * Math.cos(a) / 2, C[1] - R * Math.sin(a) / 2], w = R * .29; el('ellipse', { cx: P[0], cy: P[1], rx: w, ry: R * .5, transform: `rotate(${-(90 + 60 * i) + 90} ${P[0]} ${P[1]})`, fill: cols[(FLW_PAT[pat] || FLW_PAT.all)[i]], stroke: '#7a4a2a', 'stroke-width': 1.6, opacity: .9 }, g); }
  el('circle', { cx: C[0], cy: C[1], r: 6, fill: '#f2d38a', stroke: '#7a4a2a', 'stroke-width': 1.5 }, g); return g; }
ITEM.flowerAxes = cpItem({ tLine: 'gen.cp.together.flower', hint: 'gen.cp.hint.flower', rLine: 'gen.cp.reveal.flower', rSay: it => S(numw(it.want), { num: true, append: true }), num: true, praise: 'praiseSym',
  make: s => ({ want: FLW_AX[s.pat], tag: 'flower-axes' }),
  draw(svg, item, tries) { const C = [180, 120]; flowerAt(svg, C, 88, item.pat); if (tries >= 3) { const m = helpG(svg); for (let k = 0; k < 6; k++) { const a = 90 + 30 * k, P1 = angP(C, a, 100), P2 = angP(C, a + 180, 100); geoLine(m, P1[0], P1[1], P2[0], P2[1], { color: css('--think'), w: 1.6, dash: '5 4' }); } } return {}; },
  pick: (item, ctx) => { const np = numberPick(shuffle([...fillOpts(new Set([item.want, 6].concat(item.want === 6 ? [3] : [])), item.want, 1, 8)].slice(0, 3)), item.want, { west: true }); ctx.np = np; return np.p; },
  errOf: (it, k) => k === 6 && it.want !== 6 ? 'axesIgnoreColor' : 'axesOff' });

/* ================= صور التعليل (reason pic kind cp*) ================= */
function cpReasonPic(g, P) { rayFrame(g);
  if (P.kind === 'cpacc') { const R = rulerAt(g, { x: 34, y: 140, pxcm: 28, from: 0, to: 10, mm: true }); geoLine(g, R.X(0), 126, R.X(P.drawn / 10), 126, { color: RUL.ink, w: 4 }); }
  else if (P.kind === 'cpsq') { geoLine(g, 30, 196, 330, 196, { color: CPC.ink, w: 3.4 }); el('rect', { x: 40, y: 34, width: 24, height: 176, fill: RUL.body, stroke: RUL.edge, 'stroke-width': 2 }, g); setSquareAt(g, 64, 136, 150, -86); geoLine(g, 64, 136, 330, 136, { color: CPC.ok, w: 3 }); }
  else if (P.kind === 'cpsas') { const A = [90, 192], B = [A[0] + P.ab * CM, 192], C = angP(A, P.deg, P.ac * CM); el('polygon', { points: polyStr([A, B, C]), fill: '#eef6fb', stroke: CPC.ink, 'stroke-width': 3 }, g); el('path', { d: angArc(A, 30, 0, P.deg), fill: 'none', stroke: ANG.arc, 'stroke-width': 2.6 }, g); }
  else if (P.kind === 'cpcirc' || P.kind === 'cpradii') { const C = [180, 116]; el('circle', { cx: C[0], cy: C[1], r: 84, fill: '#fffdf6', stroke: CPC.ink, 'stroke-width': 3 }, g); el('circle', { cx: C[0], cy: C[1], r: 3.5, fill: CPC.ink }, g);
    if (P.kind === 'cpcirc') { const P1 = angP(C, 160, 84), P2 = angP(C, 340, 84); if (P.d) { const t = el('text', { x: 180, y: 222 - 4, 'text-anchor': 'middle', 'font-size': 15, 'font-weight': 800, fill: CPC.ink, direction: 'rtl' }, g); t.textContent = `${labelText('cpPart.diameter')}: ${P.d} ${labelText('rulCm')}`; } geoLine(g, P1[0], P1[1], C[0], C[1], { color: CPC.bad, w: 4 }); geoLine(g, C[0], C[1], P2[0], P2[1], { color: CPC.toolEdge, w: 4 }); }
    else for (const a of [20, 110, 200, 290]) { const Q = angP(C, a, 84); geoLine(g, C[0], C[1], Q[0], Q[1], { color: CPC.bad, w: 3 }); } }
  else if (P.kind === 'cpequi' || P.kind === 'cpcopy') { const s = 5, A = [180 - s * CM / 2, 190], B = [A[0] + s * CM, 190]; geoLine(g, A[0], A[1], B[0], B[1], { color: CPC.ink, w: 4 });
    if (P.kind === 'cpequi') { const Cp = [180, 190 - s * CM * Math.sqrt(3) / 2]; el('path', { d: arcPath(A, s * CM, 40, 80), fill: 'none', stroke: CPC.arc, 'stroke-width': 2.8 }, g); el('path', { d: arcPath(B, s * CM, 100, 140), fill: 'none', stroke: CPC.toolEdge, 'stroke-width': 2.8 }, g); geoLine(g, A[0], A[1], Cp[0], Cp[1], { color: CPC.ok, w: 3.4 }); geoLine(g, B[0], B[1], Cp[0], Cp[1], { color: CPC.ok, w: 3.4 }); }
    else { cpCompassAt(g, A, B); geoLine(g, 60, 214 - 14, 300, 214 - 14, { color: '#9fb4c0', w: 2 }); } }
  else if (P.kind === 'cphex') hexInCircle(g, [180, 116], 84);
  else if (P.kind === 'cptri') { const [c, a, b] = [...P.s].sort((p, q) => q - p), K = Math.min(CM, 240 / c), A = [180 - c * K / 2, 196], B = [A[0] + c * K, 196]; geoLine(g, A[0], A[1], B[0], B[1], { color: CPC.ink, w: 4 }); el('path', { d: arcPath(A, a * K, 5, 120), fill: 'none', stroke: CPC.arc, 'stroke-width': 2.6 }, g); el('path', { d: arcPath(B, b * K, 60, 175), fill: 'none', stroke: CPC.toolEdge, 'stroke-width': 2.6 }, g); }
  else if (P.kind === 'cppara') { const A = [90, 180], B = [250, 180], D = [130, 80], C = [290, 80]; el('polygon', { points: polyStr([A, B, C, D]), fill: '#eef6fb', stroke: CPC.ink, 'stroke-width': 3 }, g); cpArrow(g, B, C); cpArrow(g, A, D); } }

/* ================= المشاهد ================= */
SCENES.chaosRect = async c => { const L = c.lines, svg = cpStage(232); el('path', { d: 'M92 70 Q170 58 262 76 Q272 130 258 178 Q170 190 98 172 Q86 120 92 70 Z', fill: '#fff6e8', stroke: CPC.ink, 'stroke-width': 3 }, svg); const fz = chaosAt(svg, 318, 52, .34); chaosGiggle(fz); await S(L[0]); if (L[1]) await S(L[1]); };
SCENES.drawLevels = async c => { const L = c.lines, svg = cpStage(240), X = [292, 180, 68]; ['free', 'tools', 'cons'].forEach((k, i) => { const g = el('g', { transform: `translate(${X[i] - 34} 60) scale(2)` }, svg); g.innerHTML = CP_LVL_IC[k].replace(/<svg[^>]*>|<\/svg>/g, ''); const t = el('text', { x: X[i], y: 172, 'text-anchor': 'middle', 'font-size': 16, 'font-weight': 800, fill: CPC.ink }, svg); t.textContent = labelText('cpLvl.' + k); }); for (const l of L) await S(l); };
SCENES.tolShow = async c => { const L = c.lines, svg = cpStage(240), R = rulerAt(svg, { x: 34, y: 132, pxcm: 30, from: 0, to: 10, mm: true }), m = el('g', {}, svg); await S(L[0]); for (const [mm, ok] of [[69, true], [70, true], [71, true], [73, false]]) { m.innerHTML = ''; geoLine(m, R.X(0), 118, R.X(mm / 10), 118, { color: ok ? CPC.ok : CPC.bad, w: 4 }); SFX.tick(); await sleep(FAST ? 10 : 500); } await S(L[1]); if (L[2]) await S(L[2]); };
SCENES.setSqShow = async c => { const L = c.lines, svg = cpStage(250); geoLine(svg, 30, 210, 330, 210, { color: CPC.ink, w: 3.4 }); setSquareAt(svg, 140, 210, 120, -150); await S(L[0]); geoLine(svg, 140, 210, 140, 50, { color: CPC.ok, w: 3 }); await S(L[1]);
  const s2 = cpStage(250); geoLine(s2, 30, 210, 330, 210, { color: CPC.ink, w: 3.4 }); el('rect', { x: 36, y: 40, width: 26, height: 190, fill: RUL.body, stroke: RUL.edge, 'stroke-width': 2 }, s2); const tool = el('g', {}, s2); for (let k = 0; k <= 4; k++) { tool.innerHTML = ''; setSquareAt(tool, 62, 210 - k * 20, 180, -100); SFX.tick(); await sleep(FAST ? 5 : 260); } geoLine(s2, 40, 130, 330, 130, { color: CPC.ok, w: 3 }); await S(L[2]); if (L[3]) await S(L[3]); };
SCENES.rectSteps = async c => { const L = c.lines, svg = cpStage(244), w = c.w || 7, h = c.h || 4, A = [180 - w * CM / 2, 200], B = [A[0] + w * CM, 200]; geoLine(svg, A[0], A[1], B[0], B[1], { color: CPC.ink, w: 3.4 }); await S(L[0]); for (const P of [A, B]) { geoLine(svg, P[0], P[1], P[0], P[1] - h * CM, { color: CPC.arc, w: 3.4 }); SFX.tick(); await sleep(FAST ? 10 : 400); } geoLine(svg, A[0], A[1] - h * CM, B[0], B[1] - h * CM, { color: CPC.ok, w: 3.4 }); await S(L[1]); if (L[2]) await S(L[2]); };
SCENES.sasShow = async c => { const L = c.lines, svg = cpStage(250), A = [112, 210], B = [112 + (c.ab || 6) * CM, 210], deg = c.deg || 50, Cp = angP(A, deg, (c.ac || 5) * CM); geoLine(svg, A[0], A[1], B[0], B[1], { color: CPC.ink, w: 4 }); await S(L[0]); protAt(svg, A, 0, { R: 70 }); await sleep(FAST ? 10 : 400); const r = angP(A, deg, 150); geoLine(svg, A[0], A[1], r[0], r[1], { color: CPC.arc, w: 2.6, dash: '6 4' }); await S(L[1]); geoLine(svg, A[0], A[1], Cp[0], Cp[1], { color: CPC.arc, w: 4 }); geoLine(svg, B[0], B[1], Cp[0], Cp[1], { color: CPC.ok, w: 4 }); await S(L[2]); if (L[3]) await S(L[3]); };
SCENES.circleParts = async c => { const L = c.lines, svg = cpStage(250), C = [180, 128]; cpCompassAt(svg, C, [C[0] + 80, C[1]]); await drawCircleAnim(svg, C, 80, CPC.ink); await S(L[0]); const s2 = cpStage(250); for (const p of ['center', 'radius', 'diameter']) { s2.querySelectorAll('[data-cp]').forEach(e => e.remove()); const g = circleFig(s2, [180, 128], 80, p); g.setAttribute('data-cp', 1); await sleep(FAST ? 10 : 500); } await S(L[1]); if (L[2]) await S(L[2]); };
SCENES.ringsShow = async c => { const L = c.lines, svg = cpStage(250), C = [180, 130]; await S(L[0]); for (const r of c.rs || [1, 2, 3, 4]) { await drawCircleAnim(svg, C, r * 22, [CPC.bad, CPC.toolEdge, CPC.ok, CPC.arc][r % 4], 3); } await S(L[1]); };
SCENES.equiShow = async c => { const L = c.lines, svg = cpStage(256), s = c.side || 5, A = [180 - s * CM / 2, 210], B = [A[0] + s * CM, 210], Cp = [180, 210 - s * CM * Math.sqrt(3) / 2]; geoLine(svg, A[0], A[1], B[0], B[1], { color: CPC.ink, w: 4 }); await S(L[0]);
  cpCompassAt(svg, A, B); await sleep(FAST ? 10 : 300); el('path', { d: arcPath(A, s * CM, 40, 80), fill: 'none', stroke: CPC.arc, 'stroke-width': 2.8 }, svg); el('path', { d: arcPath(B, s * CM, 100, 140), fill: 'none', stroke: CPC.toolEdge, 'stroke-width': 2.8 }, svg); SFX.tick(); await S(L[1]);
  geoLine(svg, A[0], A[1], Cp[0], Cp[1], { color: CPC.ok, w: 4 }); geoLine(svg, B[0], B[1], Cp[0], Cp[1], { color: CPC.ok, w: 4 }); await S(L[2]); if (L[3]) await S(L[3]); };
SCENES.sssShow = async c => { const L = c.lines; for (const [i, s] of (c.sets || [[5, 4, 3], [7, 3, 2]]).entries()) { const svg = cpStage(256); await arcsShow(svg, s, { y: 218, g: el('g', {}, svg) }); s.forEach((v, j) => { const t = el('text', { x: 300, y: 40 + j * 22, 'text-anchor': 'end', 'font-size': 14, 'font-weight': 800, fill: CPC.ink, direction: 'rtl' }, svg); t.textContent = `${v} ${labelText('rulCm')}`; }); await S(L[i]); } if (L[2]) await S(L[2]); };
SCENES.hexShow = async c => { const L = c.lines, svg = cpStage(276), C = [180, 140], R = (c.r || 4) * CM; el('circle', { cx: C[0], cy: C[1], r: R, fill: 'none', stroke: CPC.ink, 'stroke-width': 3 }, svg); await S(L[0]); const pts = []; for (let i = 0; i <= 6; i++) { const q = angP(C, 60 * i, R); pts.push(q); el('circle', { cx: q[0], cy: q[1], r: 5, fill: CPC.arc }, svg); SFX.tick(); await sleep(FAST ? 5 : 220); } el('polygon', { points: polyStr(pts.slice(0, 6)), fill: 'none', stroke: CPC.ok, 'stroke-width': 3 }, svg); await S(L[1]); if (L[2]) await S(L[2]); };
SCENES.flowerShow = async c => { const L = c.lines, svg = cpStage(262), C = [180, 134], R = 90; el('circle', { cx: C[0], cy: C[1], r: R, fill: 'none', stroke: '#9fb4c0', 'stroke-width': 2 }, svg); await S(L[0]); for (let i = 0; i < 6; i++) { const P = angP(C, 90 + 60 * i, R); el('path', { d: arcPath(P, R, 90 + 60 * i + 180 - 60, 90 + 60 * i + 180 + 60), fill: 'none', stroke: CPC.arc, 'stroke-width': 2.6 }, svg); SFX.tick(); await sleep(FAST ? 5 : 260); } await S(L[1]); const s2 = cpStage(262); flowerAt(s2, C, R, 'alt'); if (L[2]) await S(L[2]); };
SCENES.recallComp = async c => { const svg = cpStage(232); if (c.part) circleFig(svg, [180, 116], 80, c.part); else if (c.hex) hexInCircle(svg, [180, 116], 80); else if (c.tri) await arcsShow(svg, c.tri, { y: 200, g: el('g', {}, svg) }); else setSquareAt(svg, 120, 190, 120, -130); await S(c.lines[0]); };
WRAP_ART.compArt = svg => { const g = flowerAt(svg, [180, 140], 92, 'alt'); anim(g, [{ opacity: 0 }, { opacity: 1 }], { duration: 500, delay: 200, fill: 'both' }); palmAt(svg, 330, 250, .8); palmAt(svg, 30, 250, .9); };
