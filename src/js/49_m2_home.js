/* =====================================================================
   مهمة البيت بإدخال (D221، D244؛ S2-U0): يقدّر الطفل طول ثلاثة أشياء ثم يقيسها بالمسطرة، ويمدّ خيطاً حول كوب ويفرده.
   في الدرس التالي يسأل فرجار: «هل قستَ؟»، فيُدخل الطفل تقديره وقياسه (سم وملم) بزرّين، ويرى الشريطين متجاورين.
   لا صواب ولا خطأ: القياس تمّ خارج الشاشة. والمحفوظ في PROG.home[الوحدة] = { at، items: [{ est، cm، mm }]، cup، again: { cm، mm } }، ويُعرض في لوحة الكبار.
   ===================================================================== */
/* عدّاد بزرّين (− و+) تحت المسرح: spec = [{ key، min، max، val، unit: تسمية الوحدة }]. يعيد القيم عند «تمّ» */
function stepperAsk(spec, o = {}) { const box = document.createElement('div'); box.className = 'choices steppers' + (spec.length > 2 ? ' many' : '') + (o.bare ? ' bare' : '');   /* o.bare: الزرّان وحدهما ووحدتهما فيهما، والقيمة مكتوبة على المسرح */ $('#stage').appendChild(box); const V = {}, shows = []; let touched = false;   /* o.auto: { ok، wrong } قيمٌ يضعها سائق الفحص قبل «تمّ»؛ وstep: مقدار الزيادة (1) */   /* الأعداد بأرقام المسطرة؛ وtouched: هل غيّر الطفل شيئاً قبل «تمّ» */
  for (const s of spec) { V[s.key] = s.val; const w = document.createElement('div'); w.className = 'stp'; const mk = (d, lab) => { const b = document.createElement('button'); b.className = 'pick stpb'; b.textContent = d < 0 ? '−' : '+'; if (o.bare) { const sm = document.createElement('small'); sm.textContent = G(labelText(s.unit)); b.appendChild(sm); } b.setAttribute('aria-label', plain(labelText(lab)) + ' ' + plain(labelText(s.unit)));
      const bump = k => { touched = true; const n = Math.max(s.min, Math.min(s.max, V[s.key] + d * k * (s.step || 1))); if (n === V[s.key]) return false; V[s.key] = n; show(); SFX.tick(); return true; };
      /* الضغط المطوّل يكرّر، ثم يسرع خمساً خمساً بعد ثماني لمسات: 165 سم من 140 لا تحتاج 25 لمسة (المراجع B لبوابة S3-U0/U1، 15) */
      let rep = null, held = false, n = 0; const stop = () => { clearTimeout(rep); rep = null; };
      b.addEventListener('pointerdown', () => { held = false; n = 0; stop(); rep = setTimeout(function tick() { held = true; n++; if (!bump(n > 8 ? 5 : 1)) return stop(); rep = setTimeout(tick, 110); }, 450); });
      b.addEventListener('pointerup', stop); b.addEventListener('pointerleave', stop); b.addEventListener('pointercancel', stop);
      b.onclick = () => { if (held) { held = false; return; } bump(1); }; return b; };
    const out = document.createElement('span'); out.className = 'stpv'; out.setAttribute('aria-live', 'polite'); const show = () => { out.innerHTML = `<b dir="ltr">${V[s.key]}</b><small>${esc(G(labelText(s.unit)))}</small>`; out.dataset.v = V[s.key]; if (o.onChange) o.onChange(V); };
    w.appendChild(mk(-1, 'stepLess')); w.appendChild(out); w.appendChild(mk(1, 'stepMore')); shows.push([s.key, show]);   /* الأقلّ يساراً والأكثر يميناً، كاتجاه طريق الأعداد والمسطرة */ box.appendChild(w); show(); }
  const d = doneBtn(); let fin = false; const put = vals => { if (vals) { Object.assign(V, vals); touched = true; shows.forEach(([, f]) => f()); } }; AUTO({ kind: o.kind || 'homeNum', ok: () => { put(o.auto && o.auto.ok); d.b.click(); }, wrong: () => { put(o.auto && o.auto.wrong); d.b.click(); } });
  return gate(new Promise(res => d.b.onclick = () => { if (fin) return; fin = true; AUTO_CLEAR(); hush(); box.remove(); d.bar.remove(); res({ ...V, touched }); })); }
/* شريطا التقدير والقياس على مسطرة 0–30 */
function homeBars(svg, it) { const k = 10, x0 = 30, g = el('g', {}, svg), R = rulerAt(g, { x: x0, y: 150, pxcm: k, from: 0, to: 30, mm: false, lead: 6 });
  for (const v of Object.keys(R.labels)) if (v % 5) R.labels[v].setAttribute('opacity', 0);
  /* فوق كل شريط اسمه وعدده (بأرقام المسطرة)، فلا يُبحث عن التسمية بعيداً عنه */
  const bar = (y, len, col, key, txt) => { el('rect', { x: x0, y, width: Math.max(2, len * k), height: 16, rx: 4, fill: col, opacity: .9 }, g); const e = el('text', { x: x0, y: y - 6, 'text-anchor': 'end', 'font-size': 14, 'font-weight': 700, fill: css('--ink'), direction: 'rtl' }, g); e.textContent = labelText(key) + ': ' + txt; };
  bar(74, it.est, css('--think'), 'homeEst', it.est + ' ' + labelText('rulCm')); bar(120, it.cm + it.mm / 10, css('--compass'), 'homeMeas', it.cm + ' ' + labelText('rulCm') + (it.mm ? ' ' + labelText('homeAnd') + it.mm + ' ' + labelText('rulMm') : '')); return g; }
/* c: unit (الوحدة صاحبة المهمة)، n (عدد الأشياء، 3)، cup (يُسأل عن خيط الكوب)، again (سؤال المراجعة: شيء واحد يُقاس من جديد)، lines: [خطّاف العودة] */
SCENES.homeMeasure = async c => { const unit = c.unit, n = c.n || 3, H = PROG.home = isObj(PROG.home) ? PROG.home : {}, [back] = c.lines; let rec = H[unit];
  /* again: سؤال «بعد أسبوع» (شيء واحد يُقاس من جديد، وأين وُضع الصفر). يُسأل متى مضت سبعة أيام على إدخال المهمة، في أول درس يحمله بعدها؛
     ومن لم يُدخل المهمة بعدُ («ليس بعد») يُسأل عنها هي من جديد في الموضع نفسه */
  const stage0 = () => { const v = newStage(230, { oasis: false, ground: 0 }); rulerAt(v, { x: 60, y: 96, pxcm: 30, from: 0, to: 8, mm: false }).g.setAttribute('transform', 'rotate(-6 180 110)'); return v; };
  let again = !!c.again && !!rec; if (again) { let due = !rec.again && Date.now() - rec.at >= 6.5 * 864e5; /*T*/if (TESTHOOK && window.__homeDue !== false && !rec.again) due = true;/*/T*/ if (!due) { if (back && !c.quiet) { stage0(); await S(back); } return; } }
  if (!again && rec) { if (back && !c.quiet) { stage0(); await S(back); } return; }   /* أُدخلت من قبل: خطّاف العودة وحده */
  stage0();
  await S(again ? 'gen.home.askAgain' : 'gen.home.ask'); const cp = cardPick([{ id: 'gen.home.yes', k: 'yes', ok: true }, { id: 'gen.home.no', k: 'no' }], { keepOrder: true, intro: again ? 'gen.home.askAgain' : 'gen.home.ask' }), pick = await cp.p; cp.done(); cp.box.remove();
  if (pick.k === 'no') { logAttempt({ scene: c.s || 'hook', tag: 'homeLater', ok: true }); await S('gen.home.later'); if (back && !c.quiet) await S(back); return; }
  if (again) { const svg = newStage(230, { oasis: false, ground: 0 }); rulerAt(svg, { x: 30, y: 96, pxcm: 30, from: 0, to: 10, mm: false }); S('gen.home.measQ', { free: true }); const v = await stepperAsk([{ key: 'cm', min: 0, max: 30, val: 10, unit: 'rulCm' }, { key: 'mm', min: 0, max: 9, val: 0, unit: 'rulMm' }]);
    if (v.cm || !v.mm) await sayLen(v.cm, 'cm', { append: false, ...(v.mm ? { noGap: true } : {}) }); if (v.mm) { if (v.cm) await S('gen.rul.and', { noGap: true, append: true }); await sayLen(v.mm, 'mm', { sep: '', ...(v.cm ? {} : { append: false }) }); }   /* بلا «صفر سنتيمترات» */
    await S('gen.home.zeroQ'); const zp = cardPick([{ id: 'gen.home.zeroA', k: 'start', ok: true }, { id: 'gen.home.zeroB', k: 'edge' }], { intro: 'gen.home.zeroQ' }), z = await zp.p; zp.done(); zp.box.remove();
    rec.again = { cm: v.cm, mm: v.mm, zero: z.k }; saveProg(); logAttempt({ scene: c.s || 'hook', tag: 'homeAgain', ok: z.k === 'start' }); await S('gen.home.zeroSay'); if (back && !c.quiet) await S(back); return; }
  const items = [];
  for (let i = 0; i < n; i++) { let svg = newStage(230, { oasis: false, ground: 0 }); badge(el('g', {}, svg), 180, 60, String(i + 1)); rulerAt(svg, { x: 30, y: 110, pxcm: 30, from: 0, to: 10, mm: false });
    S(i ? 'gen.home.estQ2' : 'gen.home.estQ', { free: true }); const e = await stepperAsk([{ key: 'est', min: 1, max: 30, val: 10, unit: 'rulCm' }]);
    S(i ? 'gen.home.measQ2' : 'gen.home.measQ', { free: true }); const m = await stepperAsk([{ key: 'cm', min: 0, max: 30, val: e.est, unit: 'rulCm' }, { key: 'mm', min: 0, max: 9, val: 0, unit: 'rulMm' }]);
    const it = { est: e.est, cm: m.cm, mm: m.mm }; items.push(it); svg = newStage(230, { oasis: false, ground: 0 }); homeBars(svg, it); SFX.pop();
    await S('gen.home.cmp'); if (m.touched) await S(Math.abs(it.est * 10 - (it.cm * 10 + it.mm)) <= 10 ? 'gen.home.close' : 'gen.home.far'); }   /* من لم يغيّر عدد القياس لا يُقال له «التقدير قريب»: العددان متطابقان لأنه لم يُدخل قياساً */
  rec = H[unit] = { at: Date.now(), items };
  if (c.cup) { const svg = newStage(230, { oasis: false, ground: 0 }), R = rulerAt(svg, { x: 30, y: 176, pxcm: 10, from: 0, to: 30, mm: false, lead: 6 }); for (const v of Object.keys(R.labels)) if (v % 5) R.labels[v].setAttribute('opacity', 0); el('ellipse', { cx: 180, cy: 84, rx: 46, ry: 16, fill: 'none', stroke: '#8a6a4a', 'stroke-width': 4.5 }, svg); el('path', { d: 'M134 84 L142 150 H218 L226 84', fill: '#dfeef4', stroke: '#9fb9c4', 'stroke-width': 2.5 }, svg);
    S('gen.home.cupQ', { free: true }); const v = await stepperAsk([{ key: 'cup', min: 1, max: 40, val: 20, unit: 'rulCm' }]); rec.cup = v.cup; }
  saveProg(); logAttempt({ scene: c.s || 'hook', tag: 'homeMeasure', ok: true }); SFX.good(); await S('gen.home.thanks'); if (back && !c.quiet) await S(back); };
/* مهمة بيت S2-U1: خيط مشدود بين نقطتين: طول القطعة، ثم طولا الجزأين بعد طيّه نصفين. c: unit، lines: [خطّاف العودة].
   المحفوظ بالبنية نفسها: items = [القطعة، الجزء الأول، الجزء الثاني] (وest = 0) */
SCENES.homeSeg = async c => { const unit = c.unit, H = PROG.home = isObj(PROG.home) ? PROG.home : {}, [back] = c.lines; const svg0 = newStage(230, { oasis: false, ground: 0 }); geoObj(svg0, 'seg', [70, 120], [290, 120], { names: ['a', 'b'], labP: [0, -14], labQ: [0, -14] }); ptAt(svg0, 180, 120, 'm', { r: 6, color: css('--chaos'), lab: [0, -14] });
  if (H[unit]) { if (back) await S(back); return; }
  await S('gen.home.askSeg'); const cp = cardPick([{ id: 'gen.home.yes', k: 'yes', ok: true }, { id: 'gen.home.no', k: 'no' }], { keepOrder: true, intro: 'gen.home.askSeg' }), pick = await cp.p; cp.done(); cp.box.remove();
  if (pick.k === 'no') { logAttempt({ scene: c.s || 'hook', tag: 'homeLater', ok: true }); await S('gen.home.later'); if (back) await S(back); return; }
  const ask = async (q, val) => { S(q, { free: true }); const v = await stepperAsk([{ key: 'cm', min: 0, max: 99, val, unit: 'rulCm' }, { key: 'mm', min: 0, max: 9, val: 0, unit: 'rulMm' }]); return { est: 0, cm: v.cm, mm: v.mm }; };
  const whole = await ask('gen.home.segQ', 20), p1 = await ask('gen.home.part1Q', Math.round(whole.cm / 2)), p2 = await ask('gen.home.part2Q', p1.cm); H[unit] = { at: Date.now(), items: [whole, p1, p2].map(({ est, cm, mm }) => ({ est, cm, mm })) }; saveProg();
  const mm = x => x.cm * 10 + x.mm; logAttempt({ scene: c.s || 'hook', tag: 'homeSeg', ok: true }); SFX.good(); await S(Math.abs(mm(p1) - mm(p2)) <= 2 ? 'gen.home.segEq' : 'gen.home.segNe'); await S('gen.home.thanks'); if (back) await S(back); };
/* =====================================================================
   مهمة البيت بأعداد (S2-U2 فما بعدها، D221، D244): يُدخل الطفل أعداد مهمته (عدد، أو قياس بالسنتيمتر، أو اختيار)، ويُقال له ما تعنيه بلا حكم على البيت.
   c: unit، art (رسم المسرح: corner | clock | shapes)، fields: [{ key، q، min، max، val، unit } أو { key، q، pick: [[k، تسمية، جملة]…] }]، say (تعليق بعد الإدخال)،
   again: الحقول نفسها لسؤال «بعد سبعة أيام» (يُسأل في أول درس يحمله بعد مرورها، وquiet بلا خطّاف)، lines: [خطّاف العودة].
   المحفوظ: PROG.home[الوحدة] = { at، items: []، n: { مفتاح: عدد }، an: { مفتاح: عدد } } (الاختيار برقم موضعه)
   ===================================================================== */
function homeArt(svg, art) { const g = el('g', { 'pointer-events': 'none' }, svg);
  if (art === 'clock') { el('circle', { cx: 180, cy: 112, r: 80, fill: '#fffdf6', stroke: GEO.ink, 'stroke-width': 4 }, g); for (let k = 0; k < 12; k++) { const a = k * Math.PI / 6; geoLine(g, 180 + Math.cos(a) * 68, 112 + Math.sin(a) * 68, 180 + Math.cos(a) * (k % 3 ? 62 : 56), 112 + Math.sin(a) * (k % 3 ? 62 : 56), { color: GEO.ink, w: k % 3 ? 2 : 3.5 }); } }
  else if (art === 'corner') { el('rect', { x: 70, y: 40, width: 220, height: 150, rx: 6, fill: '#efe6d6', stroke: css('--line'), 'stroke-width': 2 }, g); for (let x = 70; x <= 290; x += 44) geoLine(g, x, 40, x, 190, { color: '#c9b79c', w: 2 }); paperCornerAt(g, [70, 190], 0, 60); }
  else if (art === 'fold') { el('rect', { x: 110, y: 46, width: 140, height: 140, fill: '#fffdf6', stroke: css('--line'), 'stroke-width': 2.5 }, g); geoLine(g, 180, 40, 180, 192, { color: '#c8392d', w: 3, dash: '8 6' }); geoLine(g, 104, 116, 256, 116, { color: '#c8392d', w: 3, dash: '8 6' }); }   /* S2-U6: مهمة المحاور */
  else if (art === 'tile') { el('rect', { x: 120, y: 56, width: 120, height: 120, fill: '#e6d3b3', stroke: '#b9794e', 'stroke-width': 3 }, g); el('rect', { x: 150, y: 86, width: 60, height: 60, transform: 'rotate(45 180 116)', fill: '#3d7cc0', opacity: .7 }, g); }
  else if (art === 'rug') { el('rect', { x: 100, y: 70, width: 160, height: 100, rx: 8, fill: '#c8392d', stroke: '#8a2a20', 'stroke-width': 4 }, g); el('rect', { x: 116, y: 84, width: 128, height: 72, fill: 'none', stroke: '#f2d38a', 'stroke-width': 3 }, g); }   /* S2-U7: السجادة */
  else if (art === 'frame') { el('rect', { x: 120, y: 50, width: 120, height: 130, fill: '#dff0fb', stroke: '#8a5a3a', 'stroke-width': 12 }, g); el('path', { d: 'M136 160 L164 120 L184 142 L198 128 L226 160 Z', fill: '#7fb6d9' }, g); }
  else if (art === 'lid') { el('circle', { cx: 180, cy: 116, r: 78, fill: '#e8eef8', stroke: '#6b7b88', 'stroke-width': 5 }, g); el('circle', { cx: 180, cy: 116, r: 12, fill: '#6b7b88' }, g); geoLine(g, 102, 116, 258, 116, { color: '#c8392d', w: 3, dash: '8 6' }); }   /* S2-U9: غطاء وقطره */
  else if (art === 'tape') { tapeAt(g, { x: 50, y: 92, to: 100, pxcm: 2.6, label: 10 }); }   /* S2-U6: شريط القياس */
  else if (art === 'window') { el('rect', { x: 110, y: 36, width: 140, height: 152, rx: 4, fill: '#dff0fb', stroke: '#8a6a4a', 'stroke-width': 6 }, g); geoLine(g, 180, 36, 180, 188, { color: '#8a6a4a', w: 5 }); geoLine(g, 110, 112, 250, 112, { color: '#8a6a4a', w: 5 }); }   /* S2-U5: نافذة الغرفة */
  else if (art === 'shadow') { el('circle', { cx: 300, cy: 46, r: 22, fill: '#f6c945', stroke: '#e0a92a', 'stroke-width': 3 }, g); geoLine(g, 40, 180, 330, 180, { color: '#b9a27a', w: 3 });   /* S3-U10: ظلّا الطفل والوالد في الشمس */
    for (const [x, h] of [[110, 62], [250, 92]]) { el('ellipse', { cx: x - h * .55, cy: 181, rx: h * .55, ry: 6, fill: '#6b6b6b', opacity: .45 }, g); geoLine(g, x, 180, x, 180 - h * .62, { color: '#2a5f94', w: 6 }); el('circle', { cx: x, cy: 180 - h * .62 - h * .14, r: h * .14, fill: '#f1c9a5', stroke: '#2a5f94', 'stroke-width': 2.5 }, g); geoLine(g, x - h * .2, 180 - h * .42, x + h * .2, 180 - h * .42, { color: '#2a5f94', w: 4 }); } }
  else if (art === 'shapes') { [['tScaR', 100, 110, .6], ['cRect', 250, 110, .7]].forEach(([k, x, y, s]) => polyAt(g, k, [x, y], { s, dots: false, fill: '#f2d38a' })); }
  return g; }
/* ساعة بعقربين: الصغير عند h والكبير عند الثانية عشرة، وقوس الزاوية الصغرى بينهما */
function homeClock(svg, h) { const g = el('g', { 'pointer-events': 'none' }, svg), C = [180, 112], a = 90 - h * 30, P = angP(C, a, 46), Q = angP(C, 90, 66); geoLine(g, C[0], C[1], Q[0], Q[1], { color: GEO.ink, w: 4 }); geoLine(g, C[0], C[1], P[0], P[1], { color: '#b0552f', w: 6 });
  const d = ((h % 12) * 30), sm = d > 180 ? 360 - d : d; if (sm) el('path', { d: d > 180 ? angArc(C, 24, 90, 90 + sm) : angArc(C, 24, 90 - sm, 90), fill: 'none', stroke: ANG.arc, 'stroke-width': 3.2 }, g); return sm; }
/* شاشات ما بعد مهمة البيت على ورقة الإطار: ما يُكتب بالحبر يُقرأ بالفاتح والداكن (المراجع B لبوابة S3-U0/U1، 5) */
const homeStage = () => { const svg = newStage(230, { oasis: false, ground: 0 }); plyFrame(svg, 202); return svg; };
const HOME_SAY = {
  par: async (r, v) => S(Math.abs(v.d1 - v.d2) <= 1 ? 'gen.home.parEq' : 'gen.home.parNe'),
  parAgain: async (r, v) => S(r.n && Math.abs(v.d3 - r.n.d1) <= 1 ? 'gen.home.par3Eq' : 'gen.home.par3Ne'),
  clock: async (r, v) => { const svg = homeStage(); homeArt(svg, 'clock'); const sm = homeClock(svg, v.hour); await S(sm === 90 ? 'gen.home.clockRight' : 'gen.home.clockNot'); if (sm !== 90) { const s2 = homeStage(); homeArt(s2, 'clock'); homeClock(s2, 3); await S('gen.home.clockThree'); } },
  cut: async (r, v) => S(v.shapes >= 3 ? 'gen.home.cutMany' : 'gen.home.cutFew'),   /* S2-U4: أشكال من مثلثين */
  axes: async () => S('gen.home.axesSay'),   /* S2-U5 */
  tape: async (r, v) => S([1, 2, 3].every(i => Math.abs(v['e' + i] - v['m' + i]) <= 20) ? 'gen.home.tapeClose' : 'gen.home.tapeFar'),   /* S2-U6: التقدير قريب حتى عشرين سنتيمتراً */
  roomAgain: async (r, v) => S(v.rt === v.rm * 100 + v.rc ? 'gen.home.roomOk' : 'gen.home.roomNo'),
  rug: async () => S('gen.home.rugSay'),
  lids: async () => S('gen.home.lidsSay'),   /* S2-U9 */
  potAgain: async (r, v) => S(v.op === 12 ? 'gen.home.potOk' : 'gen.home.potNo'),   /* S2-U7 */
  frameAgain: async (r, v) => S(v.fk === 0 && v.fu === 0 ? 'gen.home.frameOk' : 'gen.home.frameNo'),
  tileAgain: async (r, v) => S(v.tile === 4 ? 'gen.home.tileOk' : 'gen.home.tileNo'),
  winAgain: async (r, v) => S(v.sides === v.verts ? 'gen.home.winEq' : 'gen.home.winNe'),
  /* S3-U0 (المراجع A لبوابة S3-U0/U1، 8): أطوال ثلاثة بالسنتيمتر تُكتب بالمتر بخانتين، مرتّبةً، والفرق بين الأطول والأقصر */
  decHome: async (r, v) => { const svg = homeStage(), hs =   /* على الورقة: الأطوال بحبرها تُقرأ بالداكن أيضاً (المراجع B لبوابة S3-U0/U1، 5) */ ['h1', 'h2', 'h3'].map(k => v[k]).sort((a, b) => a - b), m = c => `${(c / 100).toFixed(2)} ${labelText('lenM')}`, k = 190 / Math.max(...hs);
    hs.forEach((c, i) => { const y = 40 + i * 48; el('rect', { x: 330 - c * k, y, width: c * k, height: 18, rx: 5, fill: i === 2 ? DEC.ok : i ? LENC.soft : DEC.frac, opacity: .85 }, svg);
      const t = el('text', { x: 322 - c * k, y: y + 15, 'text-anchor': 'start', 'font-size': 17, 'font-weight': 800, fill: LENC.ink, direction: 'rtl' }, svg); t.textContent = m(c); });   /* العدد يسار شريطه */
    const d = el('text', { x: 180, y: 204, 'text-anchor': 'middle', 'font-size': 20, 'font-weight': 800, fill: DEC.ok, direction: 'rtl' }, svg); d.textContent = `${m(hs[2])} − ${m(hs[0])} = ${m(hs[2] - hs[0])}`;
    await S('gen.home.decDiff'); },
  ropeAgain: async (r, v) => { const svg = homeStage(); homeArt(svg, 'tape'); const t = el('text', { x: 180, y: 190, 'text-anchor': 'middle', 'font-size': 22, 'font-weight': 800, fill: DEC.ok, direction: 'rtl' }, svg);
    t.textContent = `${mcTxt(v.rm, v.rc)} = ${((v.rm * 100 + v.rc) / 100).toFixed(2)} ${labelText('lenM')}`; await S('gen.home.ropeSay'); },
  /* S3-U4 إلى S3-U9 (tools/homemap.py، D284 (6)) */
  tileRoom: async (r, v) => { const svg = homeStage(), a1 = Math.round(v.r * v.c * v.s * v.s / 1000) / 10, T = (y, t, col) => { const e = el('text', { x: 180, y, 'text-anchor': 'middle', 'font-size': 19, 'font-weight': 800, fill: col, direction: 'rtl' }, svg); e.textContent = t; };
    T(70, `${v.r} × ${v.c} × ${v.s} × ${v.s} = ${v.r * v.c * v.s * v.s} ${labelText('arCm2')}`, LENC.ink); T(118, `≈ ${decFmt(a1)} ${labelText('arM2')}`, DEC.ok); T(170, `${v.am} ${labelText('arM2')}`, DEC.frac);
    await S(Math.abs(a1 - v.am) <= Math.max(1, v.am * .1) ? 'gen.home.roomClose' : 'gen.home.roomFar'); },
  rugArea: async (r, v) => { const svg = homeStage(), A = v.l * v.w, T = (y, t, col) => { const e = el('text', { x: 180, y, 'text-anchor': 'middle', 'font-size': 20, 'font-weight': 800, fill: col, direction: 'rtl' }, svg); e.textContent = t; };
    T(90, `${v.l} × ${v.w} = ${A} ${labelText('arCm2')}`, LENC.ink); T(150, `= ${decFmt(Math.round(A / 100) / 100)} ${labelText('arM2')}`, DEC.ok); await S('gen.home.rugSay'); },
  treasureAgain: async (r, v) => S(v.found === 0 ? 'gen.home.trFound' : 'gen.home.trNot'),
  fanSay: async (r, v) => S(Math.abs(360 / v.n - v.ang) <= 5 ? 'gen.home.fanOk' : 'gen.home.fanNo'),
  mirrorAgain: async (r, v) => S(v.hand === 1 ? 'gen.home.mirOk' : 'gen.home.mirNo'),
  wheelSay: async (r, v) => S(Math.abs(v.c - 3.14 * v.d) > 3 ? 'gen.home.wheelCalc' : Math.abs(v.m - v.c) <= 10 ? 'gen.home.wheelOk' : 'gen.home.wheelFar'),
  plateAgain: async (r, v) => S(Math.abs(v.c - 3.14 * v.d) <= 2 ? 'gen.home.plateOk' : 'gen.home.plateNo'),
  boxSay: async (r, v) => S(Math.abs(v.sa - 2 * (v.a * v.b + v.b * v.c + v.a * v.c)) <= 10 ? 'gen.home.boxOk' : 'gen.home.boxNo'),
  viewsAgain: async () => S('gen.home.viewsSay'),
  volSay: async (r, v) => { const r1 = v.v1 / v.v2, r2 = v.k1 / v.k2; return S(Math.abs(r1 - r2) <= .3 * r1 ? 'gen.home.volClose' : 'gen.home.volFar'); },
  estAgain: async (r, v) => S(Math.abs(v.est - v.calc) <= .25 * v.calc ? 'gen.home.estClose' : 'gen.home.estFar'),
  /* S3-U2: فحص النجّار على الباب (فرقٌ حتى 1 سم مقبول في الكبير)، وبعد أسبوع باب الثلاجة أو إطار صورة؛ S3-U3: مساحة العلّاقة ومثلث الشريحة */
  doorSay: async (r, v) => S((Math.abs(v.d1 - v.d2) <= 1) === (v.v === 0) ? 'gen.home.doorOk' : 'gen.home.doorNo'),
  frameDiag: async (r, v) => S(Math.abs(v.f1 - v.f2) <= 1 ? 'gen.home.frameRect' : 'gen.home.frameLean'),
  hangerSay: async (r, v) => S(Math.abs(v.a - v.b * v.h / 2) <= 5 ? 'gen.home.hangOk' : 'gen.home.hangNo'),
  toastAgain: async (r, v) => S(Math.abs(v.a - v.b * v.h / 2) <= 2 ? 'gen.home.toastOk' : 'gen.home.toastNo'),
  /* S3-U1: عدد البلاطات حول الرأس × زاوية الركن، وزوايا الشطيرة بعد أسبوع */
  tileSum: async (r, v) => S(v.n * v.ang === 360 ? 'gen.home.tile360' : 'gen.home.tileNot360'),
  sandAgain: async (r, v) => S(v.a + v.b + v.c === 180 ? 'gen.home.sandOk' : 'gen.home.sandNo'),   /* الثالثة محسوبةٌ قبل قياسها: المجموع 180 تماماً */
  clockAgain: async (r, v) => { const svg = homeStage(); homeArt(svg, 'clock'); homeClock(svg, 6); await S(v.kind === 2 ? 'gen.home.sixOk' : 'gen.home.sixNo'); await S(v.q === 1 ? 'gen.home.quarterOk' : 'gen.home.quarterNo'); },
};
/* صورة ناتج مهمة البيت عبر «صيد الكاميرا» (المرجع: U7 السجادة والخيط، U8 الشريحتان؛ المراجع A لبوابتي U6/U7 (30) وU8/U9 (21)):
   بطاقتان «أُصوّر الآن» و«بلا صورة»، والصورة تُحفظ في معرض الطفل باسمها. اختيارية: الطفل بلا كاميرا يكمل. يعيد 1 إن حُفظت */
async function homePhoto(f, unit) { for (let round = 0; round < 2; round++) {
    await S(f.q); const cp = cardPick([{ id: 'gen.home.phTake', k: 'take' }, { id: 'gen.home.phSkip', k: 'skip', ok: true }], { keepOrder: true, intro: f.q }), pick = await cp.p; cp.done(); cp.box.remove();
    if (pick.k === 'skip') return 0;
    const file = await new Promise(res => { const inp = document.createElement('input'); inp.type = 'file'; inp.accept = 'image/*'; inp.setAttribute('capture', 'environment'); inp.hidden = true; document.body.appendChild(inp);
      let done = false; const end = v => { if (done) return; done = true; inp.remove(); window.removeEventListener('focus', onF); res(v); }, onF = () => setTimeout(() => end(inp.files && inp.files[0] || null), 900);
      inp.onchange = () => end(inp.files && inp.files[0] || null); inp.addEventListener('cancel', () => end(null)); window.addEventListener('focus', onF);
      /*T*/if (TESTHOOK) { setTimeout(() => end(null), 30); return; }/*/T*/ inp.click(); });   /* في الفحص لا نافذة ملفات: يعود بلا صورة */
    if (!file) { if (round) return 0; continue; }
    const sv = await new Promise(res => { const rd = new FileReader(); rd.onerror = () => res(null); rd.onload = () => { const img = new Image(); img.onerror = () => res(null); img.onload = async () => { const Z = 360, k = Math.min(1, Z / Math.max(img.width, img.height)), cv = document.createElement('canvas');
      cv.width = Math.round(img.width * k); cv.height = Math.round(img.height * k); cv.getContext('2d').drawImage(img, 0, 0, cv.width, cv.height);
      res(await IDB.put({ id: 'p' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6), kid: KID, k: 'home.' + f.photo, t: Date.now(), data: cv.toDataURL('image/jpeg', .72) })); }; img.src = rd.result; }; rd.readAsDataURL(file); });   // rng-ok: معرّف الصورة
    photoMemNote(sv);
    if (sv === 'ok' || sv === 'mem') { SFX.good(); await S('gen.home.phSaved'); return 1; }
    SFX.soft(); await S('gen.hunt.again'); }
  return 0; }
SCENES.homeNums = async c => { const unit = c.unit, H = PROG.home = isObj(PROG.home) ? PROG.home : {}, [back] = c.lines || []; let rec = H[unit];
  const stage0 = () => { const v = newStage(230, { oasis: false, ground: 0 }); homeArt(v, c.art); return v; };
  const again = !!c.again && !!rec; if (again) { let due = !rec.an && Date.now() - rec.at >= 6.5 * 864e5; /*T*/if (TESTHOOK && window.__homeDue !== false && !rec.an) due = true;/*/T*/ if (!due) { if (back && !c.quiet) { stage0(); await S(back); } return; } }
  else if (c.again) return;   /* سؤال المراجعة لمهمة لم تُدخل بعد: لا شيء هنا (تُسأل في درسها) */
  if (!again && rec) { if (back && !c.quiet) { stage0(); await S(back); } return; }
  stage0(); const askId = again ? c.askAgain || 'gen.home.askAgain' : c.ask || 'gen.home.ask'; await S(askId); const cp = cardPick([{ id: 'gen.home.did', k: 'yes', ok: true }, { id: 'gen.home.no', k: 'no' }], { keepOrder: true, intro: askId }), pick = await cp.p; cp.done(); cp.box.remove();
  if (pick.k === 'no') { logAttempt({ scene: c.s || 'hook', tag: 'homeLater', ok: true }); await S('gen.home.later'); if (back && !c.quiet) await S(back); return; }
  const vals = {}; for (const f of again ? c.again : c.fields) { stage0(); if (f.pick) { await S(f.q); const k = await choosePick(f.pick.map(([k2, line]) => [k2, T(line), '<i></i>', line]), null); vals[f.key] = f.pick.findIndex(x => x[0] === k); }
    else if (f.photo) vals[f.key] = await homePhoto(f, unit);
    else { S(f.q, { free: true }); const v = await stepperAsk([{ key: f.key, min: f.min ?? 0, max: f.max ?? 99, val: f.val ?? 1, unit: f.unit || 'rulCm', step: f.step || 1 }]); vals[f.key] = v[f.key]; } }
  if (again) rec.an = vals; else rec = H[unit] = { at: Date.now(), items: [], n: vals }; saveProg();
  logAttempt({ scene: c.s || 'hook', tag: again ? 'homeAgain' : 'homeNums', ok: true }); SFX.good(); const say = again ? c.sayAgain : c.say; if (say && HOME_SAY[say]) await HOME_SAY[say](rec, vals);
  await S('gen.home.saved'); if (back && !c.quiet) await S(back); };
