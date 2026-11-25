/* =====================================================================
   المرحلة 2 · التقييم الختامي «بوّابة البنّائين» (S2_نظام_التقييم، ثالثاً؛ docs/خطة_تقييم_المرحلة_2.md)
   d1 الجزء أ: عشرون سؤالاً بجدول التغطية (16 + 4 «لماذا/اكتشف الخطأ»)، بنود جديدة لا تكرّر اختبارات الوحدات (فحص D240).
   d2 الجزء أ2: أربع مهام بالأدوات على الورق يحكم بها الكبير (بطاقة)، وبديلها على الشاشة.
   d3 الجزء ب: «مخطط مدينتي» على ورق مربعات بمحطات مسموعة، وبطاقة المعايير الثمانية 🌱🌿🌳 للكبير.
   d4 النتيجة: مستوى لا رقم أمام الطفل، وشهادة «بنّاء ماهر» بالشارات العشر و«متقن».
   ===================================================================== */
/* أسئلة بلا مساعدة ولا «أخطأت» (كاختبار الوحدة)، والدرجة في تقدّم الدرس */
SCENES.finalCheck = async (c, L) => { const P = progOf(L.id); if (c.intro) await S(c.intro);
  /* ما أُجيب محفوظٌ بعد كل بند (P.trun كاختبار الوحدة، D266 (2)): من خرج عند البند الخامس عشر يُكمل من السادس عشر بأجوبته (المراجع B لبوابة U8/U9، 23) */
  const known = new Set(c.checks.map(q => q.id)), run = isObj(P.trun) ? P.trun : { a: [], w: [] }; run.a = (run.a || []).filter(id => known.has(id)); run.w = (run.w || []).filter(id => run.a.includes(id)); P.trun = run;
  let ok = run.a.length - run.w.length; const wrong = run.w.slice();
  for (const q of c.checks.filter(q => !run.a.includes(q.id))) { const r = await runItem(q.item, 'test', { scene: 'final' }); run.a.push(q.id); if (r.ok) ok++; else { wrong.push(q.id); run.w.push(q.id); } saveProg(); }
  delete P.trun; P.score = ok; P.of = c.checks.length; P.at = Date.now(); saveProg();
  logAttempt({ scene: 'final', tag: 'result', ok: ok >= Math.ceil(.85 * c.checks.length), score: ok, of: c.checks.length, wrongIds: wrong });
  if (c.after) await S(c.after); };

/* النتيجة من الأجزاء الثلاثة (S2_نظام_التقييم، تفسير النتيجة): أ وأ2 = 24 بنداً والعتبة 21 (85%، المبدأ 3)، والمهمة 6 معايير 🌳 من 8 بلا 🌱 */
const FINAL_M2 = { a: 'm2.u10.d1', a2: 'm2.u10.d2', b: 'm2.u10.d3', units: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(i => 'm2.u' + i) };
function finalM2() { const pa = PROG[FINAL_M2.a] || {}, pa2 = PROG[FINAL_M2.a2] || {}, LA2 = LDATA[FINAL_M2.a2], LB = LDATA[FINAL_M2.b];
  const card2 = LA2 && LA2.adultCard ? adultAnswers(LA2) : [], cardB = LB && LB.adultCard ? adultAnswers(LB) : [];
  const a2Paper = card2.length && card2.every(x => x === true || x === false), a2 = a2Paper ? card2.filter(x => x === true).length : (pa2.score ?? null);
  const of = (pa.of || 0) + 4, score = pa.score != null && a2 != null ? pa.score + a2 : null;
  const bDone = cardB.length && cardB.every(x => Number.isInteger(x)), b3 = bDone ? cardB.filter(x => x === 2).length : null, b1 = bDone && cardB.some(x => x === 0);
  const need = Math.ceil(.85 * of), low = Math.ceil(.6 * of);
  const level = score == null ? null : score < low ? 'support' : score >= need && bDone && b3 >= 6 && !b1 ? 'master' : !bDone && score >= need ? 'pending' : 'adv';
  const badges = FINAL_M2.units.filter(u => PROG['badge:' + u]).length;
  return { score, of, a2Paper: !!a2Paper, bDone: !!bDone, b3, b1, level, badges, cert: level === 'master' && badges === FINAL_M2.units.length }; }

/* شهادة «بنّاء ماهر»: ورقة بإطار وعنوانها ونجوم (بلا اسم: خط القراءة لا يضمن حروف كل اسم) */
function certAt(svg, x, y) { const g = el('g', {}, el('g', { transform: `translate(${x} ${y})` }, svg));   /* الحركة على المجموعة الداخلية: تحويل CSS يمحو translate الخارجية */
  el('rect', { x: -150, y: -96, width: 300, height: 192, rx: 18, fill: '#fffdf6', stroke: '#c9a54a', 'stroke-width': 6 }, g);
  el('rect', { x: -138, y: -84, width: 276, height: 168, rx: 12, fill: 'none', stroke: '#e8d5a8', 'stroke-width': 2 }, g);
  const t = el('text', { x: 0, y: -26, 'text-anchor': 'middle', 'font-size': 30, 'font-weight': 800, fill: '#7a5b1e' }, g); t.textContent = G(labelText('certTitle'));
  const s2 = el('text', { x: 0, y: 12, 'text-anchor': 'middle', 'font-size': 17, 'font-weight': 700, fill: css('--ink') }, g); s2.textContent = labelText('certSub');
  for (const dx of [-60, 0, 60]) el('path', { d: `M${dx} 34 l7 15 16 2 -12 11 3 16 -14 -8 -14 8 3 -16 -12 -11 16 -2 Z`, fill: '#f2b33d', stroke: '#b9862a', 'stroke-width': 1.5 }, g);
  return g; }

SCENES.finalResult = async (c, L) => { const R = finalM2(), svg = newStage(250, { oasisOpacity: .25 });
  PROG['final:m2'] = { at: Date.now(), level: R.level || 'none', score: R.score ?? -1, of: R.of, b3: R.b3 ?? -1, cert: R.cert }; saveProg();
  logAttempt({ scene: 'final', tag: 'level', ok: R.level === 'master', level: R.level, score: R.score, of: R.of, b3: R.b3, cert: R.cert });
  if (R.cert) { const g = certAt(svg, 180, 130); anim(g, [{ opacity: 0, transform: 'scale(.8)' }, { opacity: 1, transform: 'none' }], { duration: 700, fill: 'both' }); SFX.good(); await S(c.results.cert); if (c.results.cert2) await S(c.results.cert2); return; }
  const T = calcTree(svg, 180, 220, R.level === 'master' ? 1 : R.level === 'adv' || R.level === 'pending' ? .75 : .5); anim(T, [{ opacity: 0 }, { opacity: 1 }], { duration: 600, fill: 'both' });
  await S(c.results[R.level || 'none']);
  if (R.level === 'master' && R.badges < FINAL_M2.units.length) await S(c.results.badges); };
WRAP_ART.certArt = svg => { const g = certAt(svg, 180, 150); anim(g, [{ opacity: 0 }, { opacity: 1 }], { duration: 500, delay: 200, fill: 'both' }); };
