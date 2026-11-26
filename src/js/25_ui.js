/* =====================================================================
   واجهة الدرس: الزرّ الكبير، وشريط المراحل، والمسرح، والفانوس، والخيارات المسموعة
   ===================================================================== */
const go = $('#go'), help = $('#helpBtn');
/* اللمسة الثانية من نقرةٍ مزدوجة لا تُحسب جواباً لما رُسم بعد الأولى (مراجعة الخصم X-01: في «لوحة المقاول» والإتقان كانت تقع بعد 250–300 م.ث
   على السؤال التالي فتُسجَّل خطأً لم يرتكبه الطفل). كل جوابٍ مسجَّل (logAttempt) يحفظ لحظة لمسته، ولمسةٌ بإصبع أو فأرة بدأت بعدها بأقلّ من TAP_ARM
   لا تصل إلى شيء. ولوحة المفاتيح (detail = 0) والنقر من الشيفرة لا يمرّان بهذا، ولا وضع الفحص السريع */
let TAP_DOWN = -1e9, ANS_DOWN = -1e9; const TAP_ARM = 450;
document.addEventListener('pointerdown', () => { TAP_DOWN = performance.now(); }, true);
window.addEventListener('click', e => { if (FAST || !e.isTrusted || !e.detail) return;
  if (TAP_DOWN !== ANS_DOWN && TAP_DOWN - ANS_DOWN < TAP_ARM) { e.stopImmediatePropagation(); e.preventDefault(); /*T*/window.__tapSwallowed = (window.__tapSwallowed || 0) + 1;/*/T*/ } }, true);
/* الإتقان بلا إشارة صواب أو خطأ (مراجعة الخصم A-01: علامةُ الخطأ وصوته و«حسناً» بعده مقابل التعليل بعد الصواب كانت تُعلِم الطفل أين أخطأ،
   فيقلب أجوبته في الدورة الثانية التي تعيد البنود نفسها): الخيار المختار يُعلَّم بعلامةٍ واحدة للحالين */
/* NEUTRAL_ANS معرّف في 00_core.js (تقرؤه نغمات 10_speech.js قبل هذا الملف) */
const tapAnswered = () => { if (performance.now() - TAP_DOWN < 1500) ANS_DOWN = TAP_DOWN; };
/* الزرّ الكبير يُخفى حين لا فعل له (M2)، ولا يبقى معطّلاً بعنوان مضلِّل */
function setGo(label, onClick) { go.innerHTML = `<span>${esc(G(label))}</span>${ICON.play}`; go.onclick = onClick; go.disabled = false; go.classList.remove('idle'); }
function lockGo() { go.disabled = true; go.onclick = null; go.classList.add('idle'); }
function nextBtn(lbl) { AUTO({ kind: 'go', ok: () => go.click() }); return gate(new Promise(res => setGo(lbl || label('next'), () => { lockGo(); hush(); AUTO_CLEAR(); res(); }))); }
/* شريط المراحل بعدد مراحل الدرس الفعلي */
function setSteps(n) { const s = $('#steps'); s.innerHTML = ''; s.style.setProperty('--n', n); for (let i = 0; i < n; i++) s.appendChild(document.createElement('i')); s.hidden = !n; }
function setStep(i) { [...$('#steps').children].forEach((d, k) => { d.className = k < i ? 'done' : (k === i ? 'now' : ''); }); }
let STAGE_RO = null, STAGE_MO = null;   /* إن تغيّر حجم المسرح (فقاعة أطول، أو شاشة قصيرة، أو تدوير) أُعيد حساب مناطق اللمس بالبكسل الفعلي */
/* أعداد المسرح بأرقام الطفل (D279، الخيار «أ»): كل نصّ يُكتب على المسرح بأرقام غربية يُحوَّل حين تكون «أرقامي» مشرقية — أطوال الأشكال ودرجاتها
   والصيغ والخيارات والبطاقات — إلا ترقيم الأدوات الحقيقية (المسطرة وشريط القياس والمنقلة والعدسة، وما عُلِّم data-west كمقابلة الأرقام في digitPairs).
   الصيغة (نصّ ltr فيه + − × ÷ = بلا حروف) تُعكس رموزها لتُقرأ من اليمين (D251) بـ mfSet، والنصّ ltr الذي فيه كلمات («1 ملم = 0.1 سم») يصير rtl.
   مراقبٌ واحد على المسرح بدل ضبط كل موضع: ما يُكتب بعد اليوم في م3 يتبع القرار وحده. ومع الأرقام الغربية يقلب النصَّ الذي فيه حرف عربي وحده إلى rtl (D280) */
const WEST_TOOL = '[data-ruler],[data-tape],[data-prot],[data-prot-lab],[data-lens],[data-west]';   /* وأعداد المنقلة إن رُفعت فوق ما يُرسم (protAt().top()) بقيت غربية (D279 (2)؛ المراجع A لبوابة S3-U0/U1، 7) */
function measFix(t) { if (!t || !t.closest || t.closest(WEST_TOOL)) return;
  /* وبالأرقام الغربية (D280): النصّ ltr الذي فيه حرف عربي وعدد يصير rtl كما يصير مع المشرقية، فالحرف العربي يُقرأ من اليمين بالكتابتين؛ والصيغة بالأعداد وحدها تبقى من اليسار (D251) */
  if (SET.digits !== 'east') { if (t instanceof SVGElement && t.tagName === 'text' && !t.hasAttribute('data-sent') && !t.childElementCount && !t.hasAttribute('unicode-bidi') && t.getAttribute('direction') === 'ltr' && /[0-9]/.test(t.textContent) && /[\u0621-\u064A]/.test(t.textContent)) t.setAttribute('direction', 'rtl'); return; }
  if (t instanceof SVGElement) { if (t.tagName !== 'text' || t.hasAttribute('data-sent') || t.childElementCount) return; const s = t.textContent; if (!/[0-9]/.test(s)) return;
    const ltr = t.getAttribute('direction') === 'ltr'; if (/[\u0621-\u064A]/.test(s)) { if (ltr) t.setAttribute('direction', 'rtl'); t.textContent = MS(s); } else if (ltr && /[+−×÷=]/.test(s)) mfSet(t, s); else t.textContent = MS(s); return; }
  const w = document.createTreeWalker(t, NodeFilter.SHOW_TEXT); for (let n = w.nextNode(); n; n = w.nextNode()) if (/[0-9]/.test(n.nodeValue) && !(n.parentElement && n.parentElement.closest(WEST_TOOL)) && !(n.parentElement instanceof SVGElement)) n.nodeValue = MS(n.nodeValue); }
let MEAS_MO = null;
function measWatch(st) { if (MEAS_MO || !st || typeof MutationObserver === 'undefined') return;
  MEAS_MO = new MutationObserver(muts => { for (const m of muts) { const tg = m.type === 'characterData' ? m.target.parentElement : m.target;
    if (tg instanceof SVGElement && tg.tagName === 'text') measFix(tg);
    for (const n of m.addedNodes || []) { if (n.nodeType === 3) { if (n.parentElement instanceof SVGElement) measFix(n.parentElement); else if (n.parentElement) measFix(n.parentElement); } else if (n.nodeType === 1) { if (n instanceof SVGElement) { if (n.tagName === 'text') measFix(n); n.querySelectorAll && n.querySelectorAll('text').forEach(measFix); } else { measFix(n); n.querySelectorAll('svg text').forEach(measFix); } } } } });
  MEAS_MO.observe(st, { childList: true, subtree: true, characterData: true }); }
function newStage(H = 300, bg = {}, aria) { const st = $('#stage'); measWatch(st); st.innerHTML = ''; const LS = $('#lesson'); if (LS) LS.classList.remove('dense'); STAGE_T = performance.now(); HIST = []; BACK_I = null; if (typeof updateSkip === 'function') updateSkip(); if (PEND_INTRO) Promise.resolve().then(flushIntro);   /* المقدّمة بعد رسم المشهد (D270) */ const svg = el('svg', { viewBox: `0 0 360 ${H}`, preserveAspectRatio: 'xMidYMid meet', role: 'img', 'aria-label': aria || (CUR ? plain(CUR.title || '') : '') }); st.appendChild(svg);
  setTimeout(() => { if (svg.isConnected && typeof angDeclutter === 'function' && svg.querySelector('[data-alab]')) angDeclutter(svg); }, 0);   /* تسميات الزوايا المتراكبة تُبعد على منصّفاتها بعد الرسم (المراجع B لبوابة S3-U0/U1، 3) */
  if (HELP_CARRY && HELP_CARRY.flow === FLOW && HELP_CARRY.nodes.length) { const keep = HELP_CARRY.nodes, fl = FLOW; setTimeout(() => { if (fl === FLOW && svg.isConnected && !svg.querySelector('[data-help]')) for (const n of keep) svg.appendChild(n.cloneNode(true)); }, 0); }   /* المستوى الثاني يبقى على مسرح المحاولة التالية، إلا إن رسم البندُ مساعدته بنفسه (D240) */
  try { if (STAGE_RO) STAGE_RO.disconnect(); STAGE_RO = new ResizeObserver(() => refreshPads(svg)); STAGE_RO.observe(svg); } catch (e) {}
  /* وحين تظهر الخيارات تحت المسرح أو تزول يصغر أو يكبر قبل أن يُبلغ ResizeObserver: يُعاد الحساب فوراً، فلا تبقى منطقة لمس دون حدّها لحظةً
     (الفحصان المستقلان C وD: زرّ تحريك الطريق 55 بكسلاً، وقطعة الورشة 61، على iPhone SE) */
  try { if (STAGE_MO) STAGE_MO.disconnect(); STAGE_MO = new MutationObserver(() => refreshPads(svg)); STAGE_MO.observe(st, { childList: true }); } catch (e) {}
  kbdStage(svg); if (bg !== null) backdrop(svg, H, bg); return svg; }
function label(svgOrKey, x, y, text, size = 19, color) {
  if (typeof svgOrKey === 'string') return labelText(svgOrKey);
  const t = el('text', { x, y, 'text-anchor': 'middle', 'font-size': size, 'font-weight': 800, fill: color || css('--ink'), 'font-family': css('--f'), 'paint-order': 'stroke', stroke: css('--paper'), 'stroke-width': 5 }, svgOrKey); t.textContent = G(text); return t; }
/* تسمية تُطوى سطرين إن زادت على العرض المتاح، فلا تُقصّ عند حافة المسرح */
function labelFit(svg, x, y, text, size, color, maxW) { if (!text) return null; const t = label(svg, x, y, text, size, color); try { if (t.getComputedTextLength() <= maxW) return t;
  const w = G(text).split(' '); if (w.length < 2) { t.setAttribute('font-size', size * maxW / t.getComputedTextLength()); return t; } const mid = Math.ceil(w.length / 2); t.textContent = '';
  [w.slice(0, mid).join(' '), w.slice(mid).join(' ')].forEach((s, i) => { const sp = el('tspan', { x, dy: i ? size * 1.15 : -size * .2 }, t); sp.textContent = s; }); } catch (e) {} return t; }
/* لون التفكير على ورقٍ فاتح ثابت (الإطار والبطاقة): بنّي غامق بالفاتح والداكن، فـ--think في الداكن فاتح على الورق الفاتح (1.8:1؛ المراجع B لبوابة S3-U0/U1، 5) */
const THINK_INK = '#9a5f08';
/* D287 (2) (قرار فراس 27 نوفمبر 2026، الخيار أ؛ المراجع B لبوابة S3-U6/U7): الأسّ المشرقي مرفوع («سم٢»، «أ٢ + ب٢»). الأسّ ما كان «²» أو «³» في النصّ وحده: MS يجعله
   علامةً غير مرئية (U+2063، لا تُرسم) ثم الرقم المشرقي، فلا يُرفع «١ و٢» ولا «م٣» (المرحلة) ولا «يخلط ٦ و٢». والعلامة والرقم يُلفّان معاً
   في الرسم (tspan) وفي الصفحة (sup)، فالنصّ نفسه لا يتغيّر (textContent = MS)؛ ومع الغربية «²» حرفٌ مرفوع أصلاً */
const SUP_RX = /\u2063[٢٣]/;
function supRaise(n) { if (!n || n.nodeType !== 3 || SET.digits !== 'east') return; const p = n.parentNode; if (!p || p.dataset && p.dataset.sup) return; const m = SUP_RX.exec(n.data); if (!m) return;
  const rest = n.splitText(m.index), after = rest.splitText(2), svg = p.namespaceURI === 'http://www.w3.org/2000/svg';
  const s = svg ? document.createElementNS(p.namespaceURI, 'tspan') : document.createElement('sup'); s.dataset.sup = 1;
  if (svg) { s.setAttribute('baseline-shift', 'super'); s.setAttribute('font-size', '70%'); } else s.style.fontSize = '70%';
  p.insertBefore(s, rest); s.appendChild(rest); supRaise(after); }
function supScan(root) { if (!root) return; if (root.nodeType === 3) return supRaise(root); if (root.nodeType !== 1) return; const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), L = []; while (w.nextNode()) L.push(w.currentNode); L.forEach(supRaise); }
{ const on = () => { new MutationObserver(ms => { if (SET.digits !== 'east') return; for (const m of ms) { if (m.type === 'characterData') supRaise(m.target); else m.addedNodes.forEach(supScan); } })
    .observe(document.body, { childList: true, subtree: true, characterData: true }); supScan(document.body); };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', on); else on(); }
function labelText(k) { const D = CUR ? LDATA[CUR.id] : null, t = (D && D.labels && D.labels[k]) || LABELS.ui[k] || k; return k === 'myDigits' ? t : MS(G(t)); }   /* والتسمية بصيغتين {للولد|للبنت} تُحلّ هنا (بطاقة «قارِنِ القطرين» كُتبت بقوسيها على المسرح: المراجع B لبوابة S3-U2/U3) */   /* أعداد التسميات بأرقام الطفل (D279)، إلا زرّ «أرقامي» نفسه */
/* شارة العدّ: لون النص يُختار بحسب الخلفية (T10) */
function badge(parent, x, y, n, col) { const bg = col || css('--compass'); const m = el('g', { transform: `translate(${x} ${y})`, 'pointer-events': 'none', 'data-badge': 1 }, parent);
  el('circle', { r: 15, fill: bg, stroke: '#fff', 'stroke-width': 3 }, m);
  if (digitsShown()) { const t = el('text', { y: 6, 'text-anchor': 'middle', 'font-size': 17, 'font-weight': 800, fill: onColor(bg), 'font-family': css('--f') }, m); t.textContent = typeof n === 'string' ? n : DG(n); }   /* نصّ جاهز (أرقام المسطرة في المرحلة 2) يُكتب كما هو */
  else el('circle', { r: 4.5, fill: onColor(bg) }, m);   /* قبل «أرقام الواحة» لا رقم مكتوباً: الشارة نقطة، والعدد مسموع */
  anim(m, [{ transform: `translate(${x}px,${y}px) scale(.2)` }, { transform: `translate(${x}px,${y}px) scale(1)` }], { duration: 260, easing: 'cubic-bezier(.3,1.6,.6,1)' }); return m; }
function renderMute() { for (const id of ['#muteBtn', '#muteBtn2']) { const b = $(id); if (b) { b.innerHTML = SET.muted ? ICON.mute : ICON.sound; b.setAttribute('aria-pressed', SET.muted); } } }
for (const id of ['#muteBtn', '#muteBtn2']) $(id).onclick = () => { SET.muted = !SET.muted; saveSet();
  if (SET.muted) { try { speechSynthesis.cancel(); } catch (e) {} if (currentAudio) { currentAudio.pause(); currentAudio = null; } if (currentFinish) currentFinish(); }   // الكتم لا يُسقط الجمل التالية: تُعرض مكتوبةً بزمن القراءة
  renderMute(); };
$('#replay').innerHTML = ICON.replay; $('#replay').onclick = () => replayLine();
/* «تخطَّ» (D270): ظاهرٌ ما دام الكلام جارياً أو ينتظر، ويختفي بلا أن يحرّك ما حوله (visibility) */
/* والزرّ نفسه «السابق» حين يسكت الكلام وفي الشاشة جملتان فأكثر (D271) */
$('#skipBtn').onclick = () => { if ($('#skipBtn').dataset.m === 'back') backLine(); else skipNow(); updateSkip(); };
function updateSkip() { const b = $('#skipBtn'); if (!b) return; const busy = speechBusy(), m = busy ? (SKIPPING ? '' : 'skip') : (HIST.length >= 2 && BACK_I !== 0 ? 'back' : '');
  if (b.dataset.m !== m) { b.dataset.m = m; if (m) { b.innerHTML = m === 'back' ? ICON.back : ICON.skip; b.setAttribute('aria-label', m === 'back' ? 'الجملة السابقة' : 'تخطَّ القراءة'); } }
  b.classList.toggle('on', !!m); }
$('#mapBtn').innerHTML = ICON.map;
help.innerHTML = ICON.lantern;

/* ---------- خطافات الفحص الآلي: كل انتظار لفعل الطفل يسجّل حلّه الصحيح وخطأً مقصوداً (تُحذف من نسخة الأطفال) ---------- */
function AUTO(d) { SKIPPING = false; /*T*/if (TESTHOOK) { window.__autoN = (window.__autoN || 0) + 1; window.__auto = { ...d, n: window.__autoN, scene: SCENE_NOW }; }/*/T*/ }
function AUTO_CLEAR() { STAGE_FOC = null; /*T*/if (TESTHOOK) window.__auto = null;/*/T*/ }   /* وانتهاء الانتظار ينهي إعادة التركيز (الفحص المستقل E2: قفز التركيز بوهجه إلى كفّة الميزان بعد التوقّع، وEnter ثانية تجيب بالتوقّع) */

/* ---------- الفانوس (M3، M4): ظاهر في كل لحظة تفاعل، ويتوهّج بعد الخمول، ولمسه يعطي المساعدة فوراً ---------- */
let idleTimer = null, idleHandler = null;
function armIdle(h, opt = {}) { idleHandler = h; help.hidden = false; help.classList.remove('glow');
  help.onclick = () => { help.classList.remove('glow'); if (idleTimer) idleTimer.cancel(); const f = idleHandler; if (f) Promise.resolve(f()).then(() => { if (idleHandler === f) resetIdle(opt); }); };
  resetIdle(opt); }
function resetIdle(opt = {}) { if (idleTimer) idleTimer.cancel(); idleTimer = null; if (!idleHandler) return;
  const wait = FAST ? 1500 : (opt.first ? 10000 : 20000);   // T9: أقصر في أول لقاء بالأداة
  idleTimer = ptimeout(async () => { if (speechBusy() || PAUSED) { resetIdle(opt); return; }   /* ولا يعرض المساعدة تحت غطاء الخروج (F2 (3)) */ help.classList.add('glow'); await S('gen.hintOffer.01', { ifIdle: true, free: true, aside: true, keep: true }); }, wait); }   /* keep: يُسمع العرض ويتوهّج الفانوس، والسؤال باقٍ في الفقاعة (الألعاب، 15 نوفمبر: كان يحلّ محلّه بعد 10 ثوانٍ أو 20) */
function disarmIdle() { idleHandler = null; if (idleTimer) idleTimer.cancel(); idleTimer = null; help.hidden = true; help.classList.remove('glow'); }
document.addEventListener('pointerdown', e => { if (idleHandler && !help.contains(e.target)) { help.classList.remove('glow'); resetIdle(); } }, true);
/* أول لقاء بأداة (M4): عرض تلقائي قصير، ثم يبدأ الطفل. يُحفظ لكل طفل */
function firstTime(tool) { if (SET.seen[tool]) return false; SET.seen[tool] = 1; saveSet(); return true; }
/* نبض خفيف على ما يُلمس حتى أول لمسة (M4) */
function pulse(nodes) { const list = [].concat(nodes).filter(Boolean); list.forEach(n => n.classList.add('pulse'));
  const off = () => { list.forEach(n => n.classList.remove('pulse')); document.removeEventListener('pointerdown', off, true); };
  document.addEventListener('pointerdown', off, true); return off; }
/* يد شبح تعرض الحركة (M4) */
async function ghostHand(svg, path, ms = 1200) {
  const h = el('g', { 'pointer-events': 'none', opacity: .85, 'data-step': 1 }, svg);   /* يد تُري الحركة ثم تذهب: حركةٌ لا رسمٌ يُمحى (data-step، فحص الدرجات) */
  el('path', { d: 'M0 0 l-6 -20 q-1 -5 4 -5 q4 0 5 5 l2 9 l1 -14 q1 -5 5 -5 q4 0 4 5 l0 14 l2 -10 q1 -4 5 -4 q4 1 3 5 l-1 12 q3 -5 6 -4 q4 2 2 6 l-6 14 q-4 8 -14 8 q-9 0 -12 -6 z', fill: '#fff', stroke: '#1b3440', 'stroke-width': 2, 'stroke-linejoin': 'round' }, h);
  const [x0, y0] = path[0]; h.setAttribute('transform', `translate(${x0} ${y0})`);
  await tween(ms, t => { const k = t * (path.length - 1); const i = Math.min(path.length - 2, Math.floor(k)), f = k - i; const [ax, ay] = path[i], [bx, by] = path[i + 1] || path[i];
    h.setAttribute('transform', `translate(${ax + (bx - ax) * f} ${ay + (by - ay) * f})`); });
  await sleep(250); h.remove();
}

/* ---------- اختيار بأيقونة وكلمة (الكلام يقوله المرشد) ----------
   options: [k، النص، الأيقونة، جملة اسمه]؛ إن كان لكل خيار جملة قُرئت الخيارات بعد السؤال وهي تُضاء (المبدأ 8: الطفل قد لا يقرأ) */
/* الدرس «الكثيف» (Gate، 26 نوفمبر 2026): بنود التعليل في م3 وم4 بسؤالٍ من أربعة أسطر وثلاث بطاقات من سطرين صغّرت الرسم إلى 22–41٪ على Pixel 5
   حين يعود السؤال إلى الفقاعة (D254 (5))، فلا يُرى الشكل الذي يُعلَّل. إن صغُر الرسم عن 85٪ من عرضه حين تظهر الخيارات، صارت الفقاعة ثلاثة أسطر تُمرَّر
   وخطّ البطاقات أصغر، كالشاشات القصيرة؛ ويزول مع المسرح التالي. يُقاس فوراً (لا في الإطار التالي) فلا يسبقه الانتظار. وبالعرض تخطيطه الخاص */
function fitDense() { try { const s = $('#stage svg'), L = $('#lesson'); if (!s || !L || L.classList.contains('dense') || matchMedia('(orientation: landscape) and (max-height: 520px)').matches) return;
  const r = s.getBoundingClientRect(), vb = s.viewBox.baseVal; if (!vb || !vb.width || !vb.height || !r.width) return;   /* بالمستطيل لا بـ getScreenCTM: رسمٌ انضغط إلى صفر يُرجع مقياسه 1 */
  if (Math.min(1, r.height / vb.height / (r.width / vb.width)) < .85) { L.classList.add('dense'); if (typeof bubbleMore === 'function') bubbleMore(); } } catch (e) {} }
function choosePick(options, okKey, opt = {}) {
  const box = document.createElement('div'); box.className = 'choices icons' + (opt.cls ? ' ' + opt.cls : ''); (opt.host || $('#stage')).appendChild(box);
  const btns = options.map(([k, t, ic]) => { const b = document.createElement('button'); b.className = 'pick'; b.innerHTML = (ic || PICKICON[k] || '') + `<span>${esc(G(t))}</span>`; b.dataset.k = k; b.setAttribute('aria-label', plain(G(t)));
    /*T*/if (TESTHOOK) b.dataset.ok = okKey == null ? '' : (Array.isArray(okKey) ? okKey.includes(k) : k === okKey);/*/T*/ box.appendChild(b); return b; });
  fitDense();
  AUTO({ kind: 'pick', ok: () => (btns.find(b => okKey == null || (Array.isArray(okKey) ? okKey.includes(b.dataset.k) : b.dataset.k === okKey)) || btns[0]).click(), wrong: () => (btns.find(b => okKey != null && !(Array.isArray(okKey) ? okKey.includes(b.dataset.k) : b.dataset.k === okKey)) || btns[0]).click() });
  const r = gate(new Promise(res => btns.forEach(b => b.onclick = () => { if (box.dataset.done) return; box.dataset.done = 1; AUTO_CLEAR(); hush();
    b.classList.add(NEUTRAL_ANS ? 'chosen' : okKey == null || (Array.isArray(okKey) ? okKey.includes(b.dataset.k) : b.dataset.k === okKey) ? 'ok' : 'no'); SFX.tick(); res(b.dataset.k); })))
    .then(k => { psleep(FAST ? 30 : 700).then(() => box.remove()); return k; });
  if (options.every(o => o[3])) readChoices(options.map((o, i) => ({ line: lineOf(o[3]), el: btns[i] })), { host: box });
  return r;
}
/* بطاقات مسموعة: يقرأ المرشد كل بطاقة وهو يضيئها، ويمكن الإجابة قبل انتهاء القراءة (م1: الطفل قد لا يقرأ).
   والبطاقة المخفية (hide) بلا نصّ: رمز سماع واحد على كل البطاقات المخفية فلا تتميّز بالنظر (D236)، ويُكشف نصّ الصحيحة بعد الاختيار (reveal).
   و«أعد الجملة» أثناءها يعيد قراءة البطاقات كلها بالترتيب، كلٌّ بتمهيده، لا آخر جملة وحدها */
const EAR = '<svg viewBox="0 0 40 28" width="44" height="30" aria-hidden="true"><path d="M8 11h6l7-6v18l-7-6H8z" fill="currentColor"/><path d="M26 9a7 7 0 0 1 0 10M30 5a12 12 0 0 1 0 18" fill="none" stroke="currentColor" stroke-width="2.6" stroke-linecap="round"/></svg>';
let REPLAY_HOOK = null;
function cardPick(cards, opt = {}) {   // cards: [{id(line), k, ok, icon, hide, pre}]؛ opt.intro: معرّف السؤال، يُعاد قبل البطاقات عند «أعد الجملة»
  const box = document.createElement('div'); box.className = 'choices cards'; (opt.host || $('#stage')).appendChild(box);
  const list = opt.keepOrder ? cards : shuffle(cards);
  const btns = list.map(c => { const b = document.createElement('button'); b.className = 'pick card' + (c.hide ? ' hidden-text' : ''); b.dataset.k = c.k;
    b.innerHTML = (c.hide && list.length > 1 ? `<b class="cn">${DG(list.indexOf(c) + 1)}</b>` : '') + (c.icon || '') + (c.hide ? `<span class="q">${EAR}</span>` : `<span>${esc(T(c.id))}</span>`);   /* رقم البطاقة المخفية: الأولى تُقرأ أولاً (D271) */ b.setAttribute('aria-label', c.hide ? plain(labelText('listenCard')) : plain(T(c.id)));
    /*T*/if (TESTHOOK) b.dataset.ok = !!c.ok;/*/T*/ box.appendChild(b); return b; });
  /* بطاقتان مسموعتان بلا نصّ: جنباً إلى جنب، فلا تأخذان من المسرح ارتفاع بطاقتين (Gate، 18 نوفمبر 2026: في S1-U3 د6 صغر الطريق إلى 71٪ وسهماه إلى 45 بكسل على Pixel 5)؛ وحين يُكتب نصّ أيٍّ منهما تعودان عموداً */
  if (list.length === 2 && list.every(c => c.hide)) box.classList.add('pair');
  fitDense();
  let answered = false, run = 0, shown = false;
  /* بطاقةٌ مخفيّة لم تُسمع (كتمٌ، أو «بلا صوت»، أو «تخطَّ»، أو جهازٌ بلا صوت عربي): تُكتب البطاقتان، وبطاقة فوضى بنغمتها المكتوبة «فوضى تظنّ:»
     بلونها، كما تُسمع (D271)؛ فلا يبقى سؤالٌ بلا نصّ ولا صوت */
  const showAll = () => { if (shown) return; shown = true; if (!answered) box.classList.remove('pair'); btns.forEach((b, i) => { const c = list[i]; if (!c.hide || answered) return; b.classList.remove('hidden-text'); b.classList.toggle('chaos', !!c.chaos);
    b.innerHTML = `<b class="cn">${DG(i + 1)}</b>${c.icon || ''}<span>${c.chaos ? esc(T('gen.chaos.thinks')) + ' ' : ''}${esc(T(c.id))}</span>`; b.setAttribute('aria-label', plain(T(c.id))); }); };
  AUTO({ kind: 'card', ok: () => btns.find(b => list[btns.indexOf(b)].ok).click(), wrong: () => (btns.find(b => !list[btns.indexOf(b)].ok) || btns[0]).click() });
  const p = gate(new Promise(res => btns.forEach((b, i) => b.onclick = () => { if (box.dataset.done) return; answered = true; REPLAY_HOOK = null; AUTO_CLEAR(); hush(); btns.forEach(x => x.classList.remove('reading')); res(list[i]); })));
  const lines = list.map(c => lineOf(c.id)), intro = opt.intro ? lineOf(opt.intro) : null, flow = FLOW;   /* النصوص من درسها وقت الإنشاء، لا من الدرس الجاري وقت اللمس */
  const readAll = async withIntro => { const me = ++run; btns.forEach(x => x.classList.remove('reading'));
    if (withIntro && intro) { await say(...intro, { free: true }); if (answered || me !== run || flow !== FLOW) return;
      if (opt.replayPre) { await opt.replayPre(); if (answered || me !== run) return; } }   /* replayPre: ما يُعاد مع السؤال، كحركة الروبوت في «أيّ أمر اتّبع؟» */
    for (const [i, b] of btns.entries()) { if (PAUSED) await PAUSED.p; if (answered || me !== run || flow !== FLOW) break; b.classList.add('reading');   /* وبعد الخروج إلى الخريطة لا تُقرأ بطاقة (المراجع B لبوابة S3-U0/U1، 10) */ const c = list[i]; if (c.pre) await c.pre(); if (answered || me !== run) break;   /* والدرس موقوف لا تضيء البطاقة التالية ولا تدقّ نغمتها (H2 (4أ)) */
      await say(...lines[i], { hideText: c.hide && !opt.keepQ, keep: !!opt.keepQ, free: true, question: true, onSilent: c.hide ? showAll : undefined }); b.classList.remove('reading'); }
    /* بعد آخر بطاقة مكتوبة يعود السؤال إلى الفقاعة بلا صوت: الخيار المقروء لا يحلّ محلّ السؤال (D254 (5)؛ المراجع A لبوابة U6/U7، 26) */
    if (!answered && me === run && intro && !opt.keepQ && list.every(c => !c.hide) && flow === FLOW) bubbleBack(intro); };   /* keepQ: بطاقات الأعداد المسموعة تُقرأ والسؤال باقٍ في الفقاعة (S1-U3) */
  /* الخطّاف حيّ ما دامت البطاقات على الشاشة في المسار نفسه: الخروج إلى الخريطة أو مسرح جديد يُسقطه (الدرس الآخر لا يسمع بطاقات هذا) */
  REPLAY_HOOK = () => readAll(true); REPLAY_HOOK.live = () => !answered && !box.dataset.done && flow === FLOW && box.isConnected;
  readAll(false);
  return { box, btns, p, list, done: () => { box.dataset.done = 1; REPLAY_HOOK = null; },
    reveal: k => { const i = list.findIndex(c => c.k === k); if (i >= 0) { box.classList.remove('pair'); btns[i].innerHTML = `<span>${esc(T(list[i].id))}</span>`; btns[i].classList.remove('hidden-text'); btns[i].setAttribute('aria-label', plain(T(list[i].id))); } } };
}
/* الخيارات المقروءة بعد السؤال (D254 (3)): يضيء كل خيار حين يُقرأ، ولا يصير «آخر جملة» ولا يغيّر نصّ الفقاعة، فيبقى السؤال ظاهراً؛
   و«أعد الجملة» ما دامت الخيارات على الشاشة يعيد السؤال ثم الخيارات (D254 (5))، لا اسم آخر خيار وحده (فهو أحياناً الجواب وأحياناً الخطأ).
   items: [{line, el}]؛ opt.intro: جمل السؤال، وإلا آخر جملة قيلت قبل أول خيار؛ opt.host: ما يزول بزوال الخيارات أو يُعلَّم done عند الجواب */
function readChoices(items, opt = {}) {
  /* والسؤال آخر جملة دخلت الطابور ساعة الإنشاء (الفحص المستقل G2 (1): كان يُعرف عند بدء الخيار الأول، فالغطاء بعد السؤال وقبله يعيد الخيارين بلا سؤالهما) */
  /* intro: مصفوفة جمل [lineOf(id)]، أو معرّفٌ واحد يُحوَّل؛ سلسلةٌ هنا كان كلّ حرف منها «جملة» فانهار «أعد الجملة» (المراجع B لبوابة S3-U2/U3، 2) */
  let intro = opt.intro ? (Array.isArray(opt.intro) ? opt.intro : [lineOf(opt.intro)]) : (LASTQS ? LASTQS.map(l => [...l]) : LASTQ ? [LASTQ] : null), run = 0; const flow = FLOW, host = opt.host;   /* والسؤال بتتمّته كلّه */
  const dead = () => flow !== FLOW || !!(host && (!host.isConnected || host.dataset.done));
  /* والخيار المخفيّ (زرّ أداةٍ أدّت عملها: «اُفْرُدِي» و«حاذِ البدايات» بـ barGone) لا يُقرأ، والخطّاف بلا خيارٍ ظاهر ميت (الفحص المستقل H2 (6): قالت «أعد» و«نبقى» اسم زرٍّ غير ظاهر) */
  const shown = it => !it.el || (it.el.isConnected && getComputedStyle(it.el).visibility !== 'hidden' && !it.el.closest('[hidden]'));
  const readAll = async withIntro => { const me = ++run, g0 = speechGen; const stop = () => me !== run || speechGen !== g0 || dead();   /* لمسة تُسكت القراءة (hush) توقف ما بقي منها */
    items.forEach(it => it.el && it.el.classList.remove('reading'));
    if (withIntro && intro) for (const l of intro) { await say(l[0], l[1], l[2], { free: true, ...(l[3] || {}) }); if (stop()) return; }   /* l[3]: خيارات الجملة (append) */
    for (const it of items) { if (PAUSED) await PAUSED.p; if (stop()) break; if (!shown(it)) continue; const seq = it.lines || [it.line];   /* الخيار جملة واحدة، أو جمل متتابعة (بطاقة جملة عددية) */
      for (const [j, l] of seq.entries()) { await say(l[0], l[1], l[2], { free: true, keep: true, noGap: j < seq.length - 1 || opt.noGap, onStart: j ? undefined : () => { if (!intro && lastLine) intro = [[lastLine.who, lastLine.id, lastLine.text]]; items.forEach(x => x.el && x.el.classList.remove('reading')); if (it.el) it.el.classList.add('reading'); } });
        if (stop()) break; }
      if (it.el) it.el.classList.remove('reading'); } };
  REPLAY_HOOK = () => readAll(true); REPLAY_HOOK.live = () => !dead() && (!items.length || items.some(shown));   /* وبلا خيارات (السؤال وحده يُعاد) حيّ */
  if (!opt.quiet) readAll(false);   /* quiet: لا تُقرأ الخيارات الآن، ويعيدها «أعد الجملة» (أقنعني بسببين في محاولتيه الوسطيين) */
}
/* اختيار عدد: الكلمة مسموعة دائماً، والرقم مكتوب بعد أن يتعلّمه الطفل (D229) */
const digitsKnown = () => !!(PROG['m1.u1.d5'] || {}).done || !!PROG.unlockAll;
/* الأرقام المكتوبة في الرسم (الشارات والعدّادات): من درس «أرقام الواحة» نفسه فصاعداً (N003)، وقبله نقاط وعلامات عدّ */
const LESSON_SEQ = () => UNITS.flatMap(u => u.lessons);
const digitsShown = () => digitsKnown() || (!!CUR && LESSON_SEQ().indexOf(CUR.id) >= LESSON_SEQ().indexOf('m1.u1.d5'));
/* «ركن» يُعرَّف في درس المستطيل (m1.u1.d3): من بعده يقول الحلّ المشترك للمربع إن كل ركن فيه مثل ركن الورقة (مراجعة الخصم M-05: «أربعة أضلاع متساوية» وحدها تعريف المعيّن)، وقبله لا */
const cornerKnown = () => !!(PROG['m1.u1.d3'] || {}).done || (!!CUR && LESSON_SEQ().indexOf(CUR.id) >= LESSON_SEQ().indexOf('m1.u1.d3'));
const solveLine = kind => 'gen.solve.' + (kind === 'square' && cornerKnown() ? 'squareC' : kind);
const tallyText = n => '•'.repeat(n);
/* الأعداد فوق العشرة تُسمع منذ طريق الأعداد (S1-U3 د5) ولا تُكتب في خيار قبل درس «عشرة وآحاد» (N010، S1-U4 د5) الذي يعلّم كتابتها (D229):
   داخل الدرس بموضعه من المنهاج (فتدريب الفحص بفتح كل الدروس لا يغيّره)، وخارجه بإنجاز درس الجسر */
const teenDigits = () => { const S = LESSON_SEQ(), d = S.indexOf('m1.u4.d5'); if (d < 0) return false; if (CUR && S.includes(CUR.id)) return S.indexOf(CUR.id) >= d; return !!(PROG['m1.u4.d5'] || {}).done; };
function numberPick(nums, ok, opt = {}) {
  /*T*/if (TESTHOOK && new Set(nums).size < 3) testBug('numberPick بأقلّ من ثلاثة خيارات: ' + nums.join(','));/*/T*/   /* (الفحص المستقل J2 (5): ترشيحٌ بعد nearNums أنقصها في موضع ندائه، فالحارس يراها في كل موضع) */
  const box = document.createElement('div'); box.className = 'choices nums' + (nums.some(n => String(MS(n)).length > 4) ? ' long' : ''); (opt.host || $('#stage')).appendChild(box);   /* العدد الطويل بخطٍّ أصغر يلتفّ، فلا يخرج زرٌّ عن 320 بكسلاً (المراجع B لبوابة S3-U4/U5، 1) */
  const showDigits = opt.digits ?? digitsKnown(), teens = teenDigits(), W = opt.word || numw;   /* word: كلمة العدد مع تمييزه (الدرجات في S2-U3: «تسعون درجة») */
  const btns = nums.map(n => { const b = document.createElement('button'); b.className = 'pick num'; b.dataset.k = n;
    b.innerHTML = (opt.west ? `<b dir="ltr">${MS(n)}</b>` : showDigits && (n <= 10 || teens) ? `<b>${DG(n)}</b>` : '') + `<span>${esc(T(W(n)))}</span>`; b.setAttribute('aria-label', plain(T(W(n))));
    /*T*/if (TESTHOOK) b.dataset.ok = n === ok;/*/T*/ box.appendChild(b); return b; });
  let answered = false; fitDense();
  AUTO({ kind: 'num', ok: () => btns.find(b => +b.dataset.k === ok).click(), wrong: () => (btns.find(b => +b.dataset.k !== ok) || btns[0]).click() });
  const p = gate(new Promise(res => btns.forEach(b => b.onclick = () => { if (box.dataset.done) return; box.dataset.done = 1; answered = true; AUTO_CLEAR(); hush(); SFX.tick(); res(+b.dataset.k); })));
  if (opt.read !== false) readChoices(btns.map(b => ({ line: lineOf(W(+b.dataset.k)), el: b })), { intro: opt.intro, host: box, noGap: true });   /* الأعداد خيارات: لا تحلّ محلّ السؤال، و«أعد الجملة» يعيد السؤال ثم الأعداد */
  return { box, btns, p };
}
/* خيارات عددية حول الجواب: ثلاثة أعداد متجاورة غير سالبة، مخلوطة */
/* أعداد «معي» التي فعلها الطفل بيديه للتوّ لا تكون مشتّتاً مولَّداً في أسئلة الشاشة التي تخدمها (الفحص المستقل H1 (10أ): قال «أربعة عشر» ثم سُئل عن ثلاثة عشر
   وخياراه 14 و4)؛ يملؤها مشهد «معي» من mat.avoid (يكتبها البناء من مسائلها)، ويُفرغها المسار عند الخطوة التالية غير الموصولة. والمشتّت المشخِّص (العمود
   واحداً في teenOpts، وerrs في optsWith) كذلك: مَن اختاره وهو عددٌ من «معي» لا يُعرف أخطأ أم تذكّر، فيُترك تشخيصه في هذا السؤال وحده (كان «4» في د5 عموداً
   واحداً وثلاثة، وهو منفردات «معي»: السائق، «mat distractors»). والعشرة ليست في mat.avoid */
let MAT_AVOID = null; const avoidOk = v => !MAT_AVOID || !MAT_AVOID.has(v);
/* وثلاثة خيارات دائماً: إن لم تبلغها المسافات القريبة (أعداد «معي» أو حدّ المدى) تُوسَّع، ثم يُقبل عددٌ من «معي» آخراً (الفحص المستقل I2 (7): nearNums(0) بأعداد «معي»
   من واحد إلى ستة أعطت خياراً واحداً). وما بلغ ثلاثة لا يمرّ هنا، فلا يتغيّر ما يُولَّد اليوم */
function fillOpts(s, n, lo, hi) { for (const strict of [true, false]) for (let d = 1; s.size < 3 && d <= hi - lo; d++) for (const v of shuffle([n - d, n + d])) if (s.size < 3 && v >= lo && v <= hi && (!strict || avoidOk(v))) s.add(v); return s; }
/* ورتبة الجواب بين الخيارات الثلاثة (أصغرها أو أوسطها أو أكبرها) بالتساوي ما أمكن (مراجعة الخصم A-10: كان الأوسطَ في ثلثي الحالات، فـ«اختر الأوسط» يصيب
   ضعف الصدفة): تُختار الرتبة أولاً ثم المشتّتان من جهتيهما على مسافة 1–3، وما لا تسعه الحدود أو أعداد «معي» يرجع إلى الطريقة الأولى */
function nearNums(n, max = 10, lo = 0) { const ok = v => v >= lo && v <= max && avoidOk(v), side = s => [1, 2, 3].map(d => n + s * d).filter(ok);
  const B = side(-1), A = side(1), two = L => [L[0], L[R(1, Math.min(2, L.length - 1))]];
  for (const rk of shuffle([0, 1, 2])) {
    if (rk === 0 && A.length >= 2) return shuffle([n, ...two(A)]);
    if (rk === 2 && B.length >= 2) return shuffle([n, ...two(B)]);
    if (rk === 1 && A.length && B.length) return shuffle([n, B[R(0, Math.min(1, B.length - 1))], A[R(0, Math.min(1, A.length - 1))]]); }
  const set = new Set([n]); for (const d of [...shuffle([-1, 1, -2, 2]), ...shuffle([-3, 3])]) { if (set.size >= 3) break; const v = n + d; if (ok(v)) set.add(v); } return shuffle([...fillOpts(set, n, lo, max)]); }   /* lo: أصغر خيار (1 حيث لا صفر)، لا ترشيحٌ بعده يُنقص الثلاثة (الفحص المستقل J2 (5)) */
/* زرّ «تمّ» على المسرح للمهام المفتوحة (الإخراج والبناء) */
function doneBtn(onClick) { const b = document.createElement('button'); b.className = 'pick done'; b.innerHTML = ICON.check + `<span>${esc(G(labelText('done')))}</span>`; b.setAttribute('aria-label', plain(labelText('done')));
  const bar = document.createElement('div'); bar.className = 'choices donebar'; bar.appendChild(b); $('#stage').appendChild(bar); b.onclick = onClick; return { bar, b }; }
/* الشبكات بلوحة المفاتيح (role=grid): خانةٌ واحدة في ترتيب Tab والأسهم تنقل التركيز بين الخانات (roving tabindex)، فلا تمرّ Tab على مئة خانة،
   وrole=grid يفي بما يَعِد به قارئَ الشاشة (المراجع B لبوابتي S3-U4/U5، 12 وS3-U6/U7، 14). تُهيَّأ كل شبكةٍ تُضاف إلى المسرح، والبدء من خانة الأصل (أوّل الصفّ الأخير) */
function gridRoveInit(kg) { if (kg.__rove) return; const rows = [...kg.querySelectorAll('[role=row]')].map(r => [...r.querySelectorAll('[role=gridcell]')]).filter(r => r.length); if (!rows.length) return; kg.__rove = rows;
  const start = rows[rows.length - 1][0]; rows.flat().forEach(c => c.setAttribute('tabindex', c === start ? 0 : -1));
  kg.addEventListener('focusin', e => { const c = e.target.closest && e.target.closest('[role=gridcell]'); if (c) rows.flat().forEach(x => x.setAttribute('tabindex', x === c ? 0 : -1)); }); }
document.addEventListener('keydown', e => { const c = e.target && e.target.closest && e.target.closest('[role=gridcell]'), kg = c && c.closest('[role=grid]'), rows = kg && kg.__rove; if (!rows) return;
  const d = e.key === 'ArrowUp' ? [-1, 0] : e.key === 'ArrowDown' ? [1, 0] : e.key === 'ArrowRight' ? [0, 1] : e.key === 'ArrowLeft' ? [0, -1] : e.key === 'Home' ? [0, -1e9] : e.key === 'End' ? [0, 1e9] : null; if (!d) return;
  let ri = rows.findIndex(r => r.includes(c)), ci = rows[ri].indexOf(c); ri += d[0]; ci += d[1];
  ri = Math.max(0, Math.min(rows.length - 1, ri)); ci = Math.max(0, Math.min(rows[ri].length - 1, ci)); e.preventDefault(); rows[ri][ci].focus(); });
{ const st = document.getElementById('stage'); if (st) new MutationObserver(ms => { for (const m of ms) for (const n of m.addedNodes) if (n.nodeType === 1 && n.namespaceURI === 'http://www.w3.org/2000/svg')
  (n.getAttribute('role') === 'grid' ? [n] : [...n.querySelectorAll('[role=grid]')]).forEach(gridRoveInit); }).observe(st, { childList: true, subtree: true }); }
