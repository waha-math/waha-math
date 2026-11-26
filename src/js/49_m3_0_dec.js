/* =====================================================================
   S3-U0 «جسر القياس العشري» (المرحلة 3، نوفمبر 2026)
   د1 الملّيمتر عُشر السنتيمتر (C328): القراءة العشرية على المسطرة بعدستها، والتحويل بين «7 سم 4 ملم» و«7.4 سم»، والمؤشر على خط الأعشار
   د2 أقارن وأجمع (C329): المقارنة والترتيب بالتحويل إلى وحدة أصغر، والمتر بالأجزاء من المئة، والجمع والطرح بالتحويل والتحقق بالتقريب
   الأطوال قيم [n، الوحدة] من نظام S2-U6 (lenTxt/lenLn): 'dcm' سنتيمتر عشري، و'dm' متر عشري، و'cmm' «سم وملم»؛ وجملة كل قيمة مولَّدة (gen.len.*)،
   وتُقرأ القراءة الفصيحة التي تحمل المعنى: «سَبْعَةُ سَنْتِيمِتْرَاتٍ وَأَرْبَعَةُ أَعْشَارٍ» (القراءة مقترحة، tools/m3gen/u0.py)
   ===================================================================== */
const DEC = { line: '#33454c', tick: '#6b7f88', ptr: '#e07b39', ok: '#2f9d6b', int: '#3d7cc0', frac: '#e07b39' };
/* الطول بالوحدة الأصغر التي تُحوَّل إليها المقارنة والحساب: الملم للسنتيمتر العشري، والسنتيمتر للمتر العشري */
const decSmall = v => v[1] === 'dm' ? ['cm', Math.round(v[0] * 100)] : v[1] === 'mc' ? ['cm', v[0]] : v[1] === 'pair' ? ['cm', v[0][0] * 100 + v[0][1]] : v[1] === 'cm' ? ['mm', v[0] * 10] : ['mm', Math.round(lenMM(v))];   /* والمتر والسنتيمتر إلى السنتيمتر لا الملّيمتر (المراجع A لبوابة S3-U0/U1، 9) */
const decSmallTxt = v => { const [u, n] = decSmall(v); return `${n} ${U_(u)}`; };
const decStage = (H = 232) => lenStage(H);
/* ---------- خط أعشار: من lo إلى hi سنتيمتراً، بتدريجة لكل عُشر، والأعداد الصحيحة مكتوبة ---------- */
function decLineAt(parent, lo, hi, o = {}) { const x0 = o.x0 ?? 40, W = o.W ?? 280, y = o.y ?? 120, k = W / (hi - lo), g = el('g', { 'data-decline': 1 }, parent), X = v => x0 + (v - lo) * k;
  geoLine(g, x0 - 8, y, x0 + W + 8, y, { color: DEC.line, w: 3 });
  for (let t = lo * 10; t <= hi * 10; t++) { const whole = t % 10 === 0, half = t % 5 === 0; el('line', { x1: X(t / 10), y1: y - (whole ? 16 : half ? 11 : 7), x2: X(t / 10), y2: y + (whole ? 16 : half ? 11 : 7), stroke: whole ? DEC.line : DEC.tick, 'stroke-width': whole ? 2.6 : 1.4 }, g);
    if (whole) { const tx = el('text', { x: X(t / 10), y: y + 38, 'text-anchor': 'middle', 'font-size': 20, 'font-weight': 800, fill: DEC.line, direction: 'ltr' }, g); tx.textContent = String(t / 10); }
    else if (o.tenths) { const tx = el('text', { x: X(t / 10), y: y - 22, 'text-anchor': 'middle', 'font-size': 12, 'font-weight': 700, fill: DEC.frac, direction: 'ltr' }, g); tx.textContent = decFmt(t / 10); } }
  return { g, X, y, k, lo, hi }; }
function decPtrAt(parent, L, v) { const g = el('g', { 'pointer-events': 'none', 'data-ptr': 1 }, parent); el('path', { d: 'M0 0 L-11 -20 L11 -20 Z', fill: DEC.ptr, stroke: '#fff', 'stroke-width': 2 }, g); el('line', { x1: 0, y1: 0, x2: 0, y2: 16, stroke: DEC.ptr, 'stroke-width': 3 }, g);
  const put = v => g.setAttribute('transform', `translate(${L.X(v)} ${L.y - 6})`); put(v); return { g, put }; }

/* ================= ① اقرأ الطول بالسنتيمتر العشري (C328): b بالملم (الشيء من صفر المسطرة)، والعدسة عند نهايته ================= */
ITEM.decRuler = {
  make(spec) { const b = spec.b, c = Math.floor(b / 10), r = b % 10; /*T*/if (TESTHOOK && (!r || b > 79)) testBug('decRuler: طول بلا ملّيمترات أو أطول من المسطرة: ' + b);/*/T*/
    const want = [b / 10, 'dcm'], near = [(b + (r === 9 ? -1 : 1)) / 10, 'dcm'], zero = [c + r / 100, 'dcm'];   /* المشتّتان: «5.08» (الملّيمترات أجزاء من مئة)، وتدريجة مجاورة */
    return { ...spec, c, r, want: lenKey(want), ch: [want, zero, near], errs: { [lenKey(zero)]: 'decZero', [lenKey(near)]: 'decTick' }, tag: 'dec-ruler' }; },
  async ask(item, mode, tries) { const svg = decStage(250), to = item.c + 2, R = rulerAt(svg, { x: 30, y: 176, pxcm: 300 / to, from: 0, to, mm: true }); rulThingAt(svg, item.thing || 'pencil', R.X(0), R.X(item.b / 10), 174, item.color);
    const Ln = rulerLens(svg, R, item.b / 10, { y: 34, thing: item.thing || 'pencil', color: item.color }); let aid = null;
    if (tries >= 3) { aid = helpG(svg); const t = el('text', { x: 180, y: 160, 'text-anchor': 'middle', 'font-size': 17, 'font-weight': 800, fill: css('--think'), direction: 'rtl' }, aid); t.textContent = cmmTxt(item.b); await S('gen.dec.together.ruler'); }
    else await S(item.q || 'gen.dec.q.ruler');
    const k = await choosePick(shuffle(lenOpts(item.ch)), item.want); return { ans: k, ctx: { svg, R, Ln, aid } }; },
  judge(item, k) { return k === item.want ? { ok: true } : { ok: false, err: item.errs[k] || 'decRead' }; },
  onOk() { SFX.good(); }, onWrong() { SFX.soft(); },
  async hint2(item, r) { if (r && r.ctx && r.ctx.svg) hintCard(r.ctx.svg, 180, 152, `1 ${U_('mm')} = 0.1 ${U_('cm')}`); await S('gen.dec.hint.ruler'); }, async together() {},
  async reveal(item) { await S('gen.dec.reveal.cm', { noGap: true }); await S(lenLn([item.b / 10, 'dcm']), { append: true }); },
  praise: () => 'praiseMeasure', twin(item) { return item.twin || null; },
};

/* ================= ② حوّل (C328، C329): v الطول المعطى، ch [الجواب، [مشتّت، وسم خطئه]…]؛ والتحويل يمرّ بالوحدة الأصغر ================= */
ITEM.decConv = {
  make(spec) { const [ok, ...bad] = spec.ch, want = lenKey(ok), errs = {}; bad.forEach(([v, e]) => { errs[lenKey(v)] = e; }); return { ...spec, want, vals: [ok, ...bad.map(b => b[0])], errs, tag: 'dec-conv-' + spec.v[1] }; },
  async ask(item, mode, tries) { const svg = decStage(200); lenCard(svg, 180, 66, item.v, { w: 190, h: 64, fs: 26 }); const eq = el('text', { x: 180, y: 136, 'text-anchor': 'middle', 'font-size': 30, 'font-weight': 800, fill: LENC.ink }, svg); eq.textContent = '= ؟';
    let aid = null; if (tries >= 3) { aid = helpG(svg); const t = el('text', { x: 180, y: 172, 'text-anchor': 'middle', 'font-size': 17, 'font-weight': 800, fill: css('--think'), direction: 'rtl' }, aid); const [su, sn] = decSmall(item.v), ans = item.vals[0], bare = item.v[1] === su || (ans[1] === su && ans[0] === sn);   /* الصغرى هي المعطى أو الجواب: الخطوة قبلها لا الجواب */
      t.textContent = bare ? (su === 'mm' ? `1 ${U_('cm')} = 10 ${U_('mm')}` : `1 ${U_('m')} = 100 ${U_('cm')}`) : '= ' + decSmallTxt(item.v); await S('gen.dec.together.conv'); }
    else if (item.say === false) await S(item.q); else { await S(item.q || 'gen.dec.q.conv', { noGap: true }); await S(lenLn(item.v), { append: true }); }   /* say: false: السؤال يقول الطول بنفسه (فوضى) */
    const k = await choosePick(shuffle(lenOpts(item.vals)), item.want); return { ans: k, ctx: { svg, aid } }; },
  judge(item, k) { return k === item.want ? { ok: true } : { ok: false, err: item.errs[k] || 'decConv' }; },
  onOk() { SFX.good(); }, onWrong() { SFX.soft(); },
  async hint2(item, r) { const m = item.v[1] === 'dm' || item.v[1] === 'mc' || item.vals[0][1] === 'dm'; if (r && r.ctx && r.ctx.svg) hintCard(r.ctx.svg, 180, 172, m ? `1 ${U_('cm')} = 0.01 ${U_('m')}` : `1 ${U_('mm')} = 0.1 ${U_('cm')}`); await S(m ? 'gen.dec.hint.convM' : 'gen.dec.hint.convCm'); }, async together() {},
  async reveal(item) { await S('gen.dec.reveal.conv', { noGap: true }); await S(lenLn(item.vals[0]), { append: true }); },
  praise: () => 'praiseThink', twin(item) { return item.twin || null; },
};

/* ================= ③ «مسطرة فوضى العشرية» (C328، اللعبة): مؤشر على خط أعشار من lo إلى hi، يُحرَّك بأزرار الملّيمتر والسنتيمتر؛ want بالملّيمتر ================= */
ITEM.decPointer = {
  make(spec) { /*T*/if (TESTHOOK && (spec.want <= spec.lo * 10 || spec.want >= spec.hi * 10)) testBug('decPointer: الهدف خارج الخط');/*/T*/ return { ...spec, tag: 'dec-pointer' }; },
  async ask(item, mode, tries) { const svg = decStage(214), L = decLineAt(svg, item.lo, item.hi, { y: 120 }); let pos = item.lo * 10;
    const tgt = lenCard(svg, 180, 40, [item.want / 10, 'dcm'], { w: 150, h: 50, fs: 24 }), P = decPtrAt(svg, L, pos / 10);
    if (tries >= 3) { pos = Math.floor(item.want / 10) * 10; P.put(pos / 10); await S('gen.dec.together.ptr'); } else { await S(item.q || 'gen.dec.q.ptr', { noGap: true }); await S(lenLn([item.want / 10, 'dcm']), { append: true }); }
    const box = document.createElement('div'); box.className = 'choices icons four'; $('#stage').appendChild(box);
    const steps = (item.hi - item.lo > 1 ? [[-10, 'decStepCmL'], [-1, 'decStepMmL'], [1, 'decStepMmR'], [10, 'decStepCmR']] : [[-1, 'decStepMmL'], [1, 'decStepMmR']]);
    if (steps.length === 2) box.className = 'choices icons';
    box.style.direction = 'ltr';   /* الأزرار كالخطّ: النقصان يساراً والزيادة يميناً، في الكتابتين */
    /* السهم مرسوماً (الخطّ بلا رموز المثلثات، D256): رأس واحد للملّيمتر ورأسان للسنتيمتر، والخطّ يكبر يميناً كالمسطرة */
    const arrow = (n, left) => { let p = ''; for (let i = 0; i < n; i++) { const x = i * 14; p += '<path d="' + (left ? 'M' + (x + 16) + ' 2 L' + (x + 4) + ' 10 L' + (x + 16) + ' 18Z' : 'M' + (x + 2) + ' 2 L' + (x + 14) + ' 10 L' + (x + 2) + ' 18Z') + '" fill="currentColor"/>'; }
      return '<svg viewBox="0 0 ' + (n * 14 + 4) + ' 20" width="' + (n * 14 + 4) + '" height="20" aria-hidden="true" style="vertical-align:middle">' + p + '</svg>'; };
    const btns = steps.map(([d, lb]) => { const b = document.createElement('button'); b.className = 'pick'; const n = Math.abs(d) === 10 ? 2 : 1, u = esc(U_(n === 2 ? 'cm' : 'mm'));
      b.style.direction = 'ltr'; b.innerHTML = `<span style="display:inline-flex;align-items:center;gap:6px;direction:ltr">${d < 0 ? arrow(n, true) + '<span>' + u + '</span>' : '<span>' + u + '</span>' + arrow(n, false)}</span>`; b.setAttribute('aria-label', plain(labelText(lb + '.a')));
      b.onclick = () => { const n = Math.max(item.lo * 10, Math.min(item.hi * 10, pos + d)); if (n === pos) return; pos = n; P.put(pos / 10); SFX.tick(); }; box.appendChild(b); return b; });
    /*T*/window.__decPos = () => pos;/*/T*/
    AUTO({ kind: 'decPtr', ok: () => { pos = item.want; P.put(pos / 10); rulDoneBtn().click(); }, wrong: () => { pos = item.want + (item.want % 10 === 9 ? -2 : 2); P.put(pos / 10); rulDoneBtn().click(); } });
    await rulDone(() => { btns.forEach(b => b.onclick = null); box.remove(); });
    return { ans: pos, ctx: { svg, L, P, tgt } }; },
  judge(item, k) { if (k === item.want) return { ok: true }; const d = Math.abs(k - item.want); return { ok: false, err: d % 10 === 0 ? 'decLineCm' : Math.floor(k / 10) !== Math.floor(item.want / 10) ? 'decLineInt' : 'decLineTenth' }; },
  onOk() { SFX.good(); }, onWrong() { SFX.soft(); },
  async hint2(item, r) { if (r && r.ctx && r.ctx.L) { const L = r.ctx.L, a = Math.floor(item.want / 10), m = helpG(r.ctx.svg); el('rect', { x: L.X(a), y: L.y - 4, width: L.k, height: 8, rx: 3, fill: css('--think'), opacity: .55 }, m); } await S('gen.dec.hint.ptr'); }, async together() {},
  async reveal(item, r) { if (r && r.ctx && r.ctx.P) r.ctx.P.put(item.want / 10); await S('gen.dec.reveal.ptr'); },
  praise: () => 'praiseMeasure', twin(item) { return item.twin || null; },
};

/* ================= ④ أيّهما أطول؟ (C329): a وb، والتحويل إلى الوحدة الأصغر يحسم ================= */
ITEM.decCmp = {
  make(spec) { const a = lenMM(spec.a), b = lenMM(spec.b); return { ...spec, want: a === b ? 'eq' : a > b ? 'a' : 'b', tag: 'dec-cmp' }; },
  async ask(item, mode, tries) { const svg = decStage(220); lenCard(svg, 262, 84, item.a, { w: 150 }); lenCard(svg, 98, 84, item.b, { w: 150, stroke: LENC.bar2 }); let aid = null;
    if (tries >= 3) { aid = helpG(svg); [item.a, item.b].forEach((v, i) => { const t = el('text', { x: i ? 98 : 262, y: 140, 'text-anchor': 'middle', 'font-size': 17, 'font-weight': 800, fill: css('--think'), direction: 'rtl' }, aid); t.textContent = '= ' + decSmallTxt(v); }); await S('gen.dec.together.cmp'); }
    else await S(item.q || 'gen.dec.q.cmp');
    const k = await choosePick([['a', lenTxt(item.a), '<i></i>', lenLn(item.a)], ['b', lenTxt(item.b), '<i></i>', lenLn(item.b)], ['eq', labelText('lenEq'), '<i></i>', 'gen.len.eq']], item.want); return { ans: k, ctx: { svg, aid } }; },
  judge(item, k) { if (k === item.want) return { ok: true }; const fr = v => +String(v[0]).split('.')[1] || 0, dig = fr(item.a) > fr(item.b) ? 'a' : fr(item.b) > fr(item.a) ? 'b' : null; return { ok: false, err: k === dig ? 'decCmpDigits' : 'decCmpOff' }; },
  async onOk(item, r) { SFX.good(); lenBars(r.ctx.svg, [item.a, item.b], 150); await sleep(400); }, onWrong() { SFX.soft(); },
  async hint2(item, r) { if (r && r.ctx && r.ctx.svg) hintCard(r.ctx.svg, 262, 140, '= ' + decSmallTxt(item.a)); await S('gen.dec.hint.cmp'); }, async together() {},   /* طولٌ واحد يُحوَّل، والثاني للطفل */
  async reveal(item, r) { lenBars(r.ctx.svg, [item.a, item.b], 150); await S('gen.len.reveal.cmp.' + item.want); },
  praise: () => 'praiseCompare', twin(item) { return item.twin || null; },
};

/* ================= ⑤ رتّب من الأقصر إلى الأطول (C329): vals أربعة ================= */
ITEM.decOrder = {
  make(spec) { const order = spec.vals.map((v, i) => i).sort((i, j) => lenMM(spec.vals[i]) - lenMM(spec.vals[j])); return { ...spec, want: order.join(','), tag: 'dec-order' }; },
  async ask(item, mode, tries) { const svg = decStage(222), cards = item.vals.map((v, i) => { const g = lenCard(svg, ORD_XY[i][0], ORD_XY[i][1], v, { w: 146, h: 70 }); g.setAttribute('role', 'button'); g.setAttribute('tabindex', 0); g.setAttribute('aria-label', plain(lenTxt(v))); g.style.cursor = 'pointer'; return g; });
    if (tries >= 3) { const m = helpG(svg); item.vals.forEach((v, i) => { const t = el('text', { x: ORD_XY[i][0], y: ORD_XY[i][1] + 44, 'text-anchor': 'middle', 'font-size': 15, 'font-weight': 700, fill: css('--think'), direction: 'rtl' }, m); t.textContent = '= ' + decSmallTxt(v); }); await S('gen.dec.together.order'); }
    else await S(item.q || 'gen.dec.q.order');
    const picked = await orderTap(svg, cards, item.want, i => [ORD_XY[i][0] + 66, ORD_XY[i][1] - 26]); return { ans: picked.join(','), ctx: { svg, cards } }; },
  judge(item, k) { if (k === item.want) return { ok: true }; const fr = v => +String(v[0]).split('.')[1] || 0, byFrac = item.vals.map((v, i) => i).sort((i, j) => fr(item.vals[i]) - fr(item.vals[j])).join(','); return { ok: false, err: k === byFrac ? 'decOrderFrac' : 'orderOff' }; },
  onOk() { SFX.good(); }, onWrong() { SFX.soft(); },
  async hint2(item, r) { if (r && r.ctx && r.ctx.svg) hintCard(r.ctx.svg, 180, 108, labelText('decIntFirst')); await S('gen.dec.hint.order'); }, async together() {},
  async reveal(item, r) { const m = helpG(r.ctx.svg); item.want.split(',').forEach((i, n) => badge(m, ORD_XY[+i][0] + 66, ORD_XY[+i][1] - 26, n + 1, LENC.ok)); await S('gen.len.reveal.order'); },
  praise: () => 'praiseOrder', twin(item) { return item.twin || null; },
};

/* ================= ⑥ اجمع واطرح بالتحويل (C329): a وb عشريان بوحدة واحدة، op، ch [الجواب، [مشتّت، وسم]…]؛ والتحقق بالتقريب في الحلّ المشترك ================= */
ITEM.decCalc = {
  make(spec) { const [ok, ...bad] = spec.ch, errs = {}; bad.forEach(([v, e]) => { errs[lenKey(v)] = e; });
    /*T*/if (TESTHOOK) { const s = decSmall(spec.a)[1], t = decSmall(spec.b)[1], w = decSmall(ok)[1]; if ((spec.op === '-' ? s - t : s + t) !== w) testBug('decCalc: الجواب لا يطابق الحساب');}/*/T*/
    return { ...spec, want: lenKey(ok), vals: [ok, ...bad.map(b => b[0])], errs, tag: 'dec-calc' + (spec.op === '-' ? '-sub' : '-add') }; },
  async ask(item, mode, tries) { const svg = decStage(214), sg = item.op === '-' ? '−' : '+', t = el('text', { x: 180, y: 70, 'text-anchor': 'middle', 'font-size': 28, 'font-weight': 800, fill: LENC.ink, direction: 'ltr' }, svg);
    const u = item.a[1] === 'dm' ? U_('m') : U_('cm'); t.textContent = `${decFmt(item.a[0], item.a[1] === 'dcm' ? 1 : 0)} ${sg} ${decFmt(item.b[0], item.b[1] === 'dcm' ? 1 : 0)} = ؟`;
    const ut = el('text', { x: 180, y: 104, 'text-anchor': 'middle', 'font-size': 18, 'font-weight': 700, fill: LENC.soft, direction: 'rtl' }, svg); ut.textContent = labelText(item.a[1] === 'dm' ? 'decInM' : 'decInCm'); let aid = null;
    if (tries >= 3) { aid = helpG(svg); const [su, a] = decSmall(item.a), b = decSmall(item.b)[1], w = el('text', { x: 180, y: 146, 'text-anchor': 'middle', 'font-size': 18, 'font-weight': 800, fill: css('--think'), direction: 'ltr' }, aid); w.textContent = `${a} ${sg} ${b} (${U_(su)})`;
      const ra = Math.round(item.a[0]), rb = Math.round(item.b[0]), e = el('text', { x: 180, y: 180, 'text-anchor': 'middle', 'font-size': 17, 'font-weight': 800, fill: css('--think'), direction: 'ltr' }, aid); e.textContent = `≈ ${ra} ${sg} ${rb} = ${item.op === '-' ? ra - rb : ra + rb}`; await S('gen.dec.together.calc'); }
    else await S(item.q || (item.op === '-' ? 'gen.dec.q.sub' : 'gen.dec.q.add'));
    const k = await choosePick(shuffle(lenOpts(item.vals)), item.want); return { ans: k, ctx: { svg, aid } }; },
  judge(item, k) { return k === item.want ? { ok: true } : { ok: false, err: item.errs[k] || 'decCalc' }; },
  onOk() { SFX.good(); }, onWrong() { SFX.soft(); },
  async hint2(item, r) { const [su, a] = decSmall(item.a), b = decSmall(item.b)[1]; if (r && r.ctx && r.ctx.svg) hintCard(r.ctx.svg, 180, 150, `${a} ${U_(su)} ${item.op === '-' ? '−' : '+'} ${b} ${U_(su)}`); await S('gen.dec.hint.calc'); }, async together() {},
  async reveal(item) { await S('gen.dec.reveal.conv', { noGap: true }); await S(lenLn(item.vals[0]), { append: true }); },
  praise: () => 'praiseThink', twin(item) { return item.twin || null; },
};

/* ================= المشاهد ================= */
/* الإشعال (د1): قلم ينتهي عند 5 سم 8 ملم، وفوضى تكتب «5.08 سم» */
SCENES.decHook = async c => { const L = c.lines, b = c.mm || 58, svg = decStage(250), R = rulerAt(svg, { x: 30, y: 176, pxcm: 300 / 7, from: 0, to: 7, mm: true }); rulThingAt(svg, 'pencil', R.X(0), R.X(b / 10), 174);
  rulerLens(svg, R, b / 10, { y: 34, thing: 'pencil' }); await S(L[0]);
  const card = lenCard(svg, 180, 152, [Math.floor(b / 10) + (b % 10) / 100, 'dcm'], { w: 150, h: 40, fs: 22, stroke: RUL.chaos }); card.querySelector('text').setAttribute('fill', RUL.chaos); SFX.tick();
  await S(L[1]); await axPredictYN('no', 'gen.dec.pr.hook'); for (const l of L.slice(2)) await S(l); };
/* الاكتشاف (د1): المسافة بين 7 و8 عشرة أجزاء، وكل جزء عُشر؛ ثم خط الأعشار وموضع 7.4؛ ثم تصحيح فوضى */
SCENES.decTenths = async c => { const L = c.lines, svg = decStage(262), R = rulerAt(svg, { x: 50, y: 40, pxcm: 260, from: 7, to: 8, mm: true, broken: true });
  await lenPredict([5, 10, 100].map(n => [String(n), DG(n), '']), '10', 'gen.dec.pr.parts'); await S(L[0]);   /* توقّعٌ قبل العدّ (المراجع A لبوابة S3-U0/U1، 15) */
  const hops = el('g', { 'pointer-events': 'none' }, svg); for (let i = 0; i < 10; i++) { el('path', { d: `M${R.X(7 + i / 10)} 36 Q${R.X(7 + (i + .5) / 10)} 14 ${R.X(7 + (i + 1) / 10)} 36`, fill: 'none', stroke: DEC.frac, 'stroke-width': 2.4 }, hops); SFX.tick(); await sleep(FAST ? 5 : 160); }
  const t = el('text', { x: 180, y: 128, 'text-anchor': 'middle', 'font-size': 22, 'font-weight': 800, fill: DEC.frac, direction: 'ltr' }, svg); t.textContent = `1 ${U_('mm')} = 0.1 ${U_('cm')}`; await S(L[1]);
  hops.remove(); R.g.remove(); t.setAttribute('y', 40); const N = decLineAt(svg, 7, 8, { y: 150, tenths: true }), P = decPtrAt(svg, N, 7.4); SFX.tick();
  const s = el('text', { x: 180, y: 232, 'text-anchor': 'middle', 'font-size': 20, 'font-weight': 800, fill: LENC.ink, direction: 'rtl' }, svg); s.textContent = `${cmmTxt(74)} = ${lenTxt([7.4, 'dcm'])}`;
  await S(L[2]); N.g.remove(); P.g.remove(); s.textContent = `${cmmTxt(58)} = ${lenTxt([5.8, 'dcm'])}`; s.setAttribute('fill', DEC.ok); s.setAttribute('y', 150); SFX.good();
  await S(L[3]);
  for (const l of L.slice(4)) await S(l); };
/* الإشعال (د2): فوضى تقول 2.35 م أطول من 2.5 م */
SCENES.decCmpHook = async c => { const L = c.lines, svg = decStage(232); lenCard(svg, 262, 84, [2.35, 'dm'], { w: 150 }); lenCard(svg, 98, 84, [2.5, 'dm'], { w: 150 });
  const tag = el('text', { x: 262, y: 40, 'text-anchor': 'middle', 'font-size': 20, 'font-weight': 800, fill: RUL.chaos, direction: 'rtl' }, svg); tag.textContent = labelText('decLonger');   /* ادّعاء فوضى فوق بطاقتها، بلا رمز «>» يلتبس اتجاهه */
  await S(L[0]); await axPredictYN('no', 'gen.dec.pr.cmp'); await S(L[1]);
  [[262, [2.35, 'dm']], [98, [2.5, 'dm']]].forEach(([x, v]) => { const t = el('text', { x, y: 140, 'text-anchor': 'middle', 'font-size': 19, 'font-weight': 800, fill: LENC.ok, direction: 'rtl' }, svg); t.textContent = '= ' + decSmallTxt(v); });
  tag.setAttribute('x', 98); tag.setAttribute('fill', LENC.ok); tag.textContent = labelText('decLongest'); lenBars(svg, [[2.35, 'dm'], [2.5, 'dm']], 160); SFX.good();
  for (const l of L.slice(2)) await S(l); };
/* الاكتشاف (د2): المتر مئة سنتيمتر، فالسنتيمتر جزء من مئة؛ وثلاثة أمثلة، والصفر يحجز خانة الأعشار */
SCENES.decMeter = async c => { const L = c.lines, svg = decStage(262), x0 = 40, W = 280, y = 50; el('rect', { x: x0, y, width: W, height: 22, rx: 4, fill: '#e6eef3', stroke: LENC.ink, 'stroke-width': 2 }, svg);
  for (let i = 0; i <= 100; i++) el('line', { x1: x0 + W * i / 100, y1: y + 22, x2: x0 + W * i / 100, y2: y + 22 + (i % 10 ? 5 : 11), stroke: LENC.ink, 'stroke-width': i % 10 ? .8 : 1.6 }, svg);
  const t0 = el('text', { x: 180, y: 34, 'text-anchor': 'middle', 'font-size': 19, 'font-weight': 800, fill: LENC.ink, direction: 'ltr' }, svg); t0.textContent = `1 ${U_('m')} = ؟ ${U_('cm')}`; await lenPredict([10, 100, 1000].map(n => [String(n), DG(n), '']), '100', 'gen.dec.pr.meter'); t0.textContent = `1 ${U_('m')} = 100 ${U_('cm')}`; await S(L[0]);
  el('rect', { x: x0, y: y + 1, width: W / 100, height: 20, fill: DEC.frac }, svg); const t1 = el('text', { x: 180, y: 112, 'text-anchor': 'middle', 'font-size': 20, 'font-weight': 800, fill: DEC.frac, direction: 'ltr' }, svg); t1.textContent = `1 ${U_('cm')} = 0.01 ${U_('m')}`; SFX.tick(); await S(L[1]);
  const rows = c.rows || [[1, 50], [2, 35], [3, 5]];
  for (const [i, [m, cm]] of rows.entries()) { const t = el('text', { x: 180, y: 152 + i * 34, 'text-anchor': 'middle', 'font-size': 20, 'font-weight': 800, fill: i === 2 ? DEC.ok : LENC.ink, direction: 'rtl' }, svg); t.textContent = `${mcTxt(m, cm)} = ${lenTxt([(m * 100 + cm) / 100, 'dm'])}`; SFX.tick(); if (L[2 + i]) await S(L[2 + i]); }
  for (const l of L.slice(2 + rows.length)) await S(l); };
/* المثال المحلول (د2؛ المراجع A لبوابة S3-U0/U1، 1): الجمع والطرح بالتحويل إلى الوحدة الأصغر ثم العودة، والتحقّق بالتقريب، وقبل الأول تقديرٌ من الطفل.
   rows: [[أ، op، ب]…]، وجمل كل صفّ ثلاث: السؤال، والتحويل والحساب، والعودة والتقريب */
SCENES.decCalcShow = async c => { const L = c.lines, svg = decStage(250), rows = c.rows || [[[5.4, 'dcm'], '+', [3.3, 'dcm']], [[8.3, 'dcm'], '-', [2.7, 'dcm']], [[1.2, 'dm'], '+', [2.45, 'dm']]];
  const T = (y, s, col, fs = 24) => { const t = el('text', { x: 180, y, 'text-anchor': 'middle', 'font-size': fs, 'font-weight': 800, fill: col || LENC.ink, direction: 'ltr', 'data-calcrow': 1 }, svg); t.textContent = s; return t; };
  for (const [i, [a, op, b]] of rows.entries()) { svg.querySelectorAll('[data-calcrow]').forEach(n => n.remove()); const sg = op === '-' ? '−' : '+', f = v => decFmt(v[0], v[1] === 'dcm' ? 1 : 0), [su, sa] = decSmall(a), sb = decSmall(b)[1], sw = op === '-' ? sa - sb : sa + sb;
    const w = [su === 'mm' ? sw / 10 : sw / 100, a[1]], ra = Math.round(a[0]), rb = Math.round(b[0]), re = op === '-' ? ra - rb : ra + rb, uu = U_(a[1] === 'dm' ? 'm' : 'cm');
    T(54, `${f(a)} ${sg} ${f(b)} = ؟ ${uu}`); await S(L[3 * i]);
    if (!i) await lenPredict([re, re + 1, sw].map(n => [String(n), DG(n), '']), String(re), 'gen.dec.pr.est');   /* تقديرٌ قبل الحساب: بالأعداد الكاملة */
    T(112, `${sa} ${sg} ${sb} = ${sw} ${U_(su)}`, DEC.frac, 22); SFX.tick(); await S(L[3 * i + 1]);
    T(160, `= ${f(w)} ${uu}`, DEC.ok); T(204, `≈ ${ra} ${sg} ${rb} = ${re}`, css('--think'), 19); SFX.good(); await S(L[3 * i + 2]); }
  for (const l of L.slice(3 * rows.length)) await S(l); };
WRAP_ART.decArt = svg => { const R = rulerAt(svg, { x: 70, y: 120, pxcm: 55, from: 5, to: 9, mm: true, broken: true }); rulThingAt(svg, 'pencil', R.X(5) - 60, R.X(7.4), 118); const t = el('text', { x: 180, y: 70, 'text-anchor': 'middle', 'font-size': 30, 'font-weight': 800, fill: DEC.frac, direction: 'ltr' }, svg); t.textContent = '7.4'; };
