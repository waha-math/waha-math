# فحوص قبول قرارات فراس في 27 نوفمبر 2026 D287 (القرارات الثلاثة المعلّقة منذ بوابات م3):
#   B-1  العدسة (D275 ممدَّد): وضع نقطة على المستوى الإحداثي يُظهر عدسةً مكبّرة فوق الإصبع ما دام يلمس، داخل إطار المسرح ولا تغطّي موضع الإصبع،
#        وتختفي برفعه، والنقطة حيث رُفع (coordPlace في م3 وc4Place في م4).
#   B-17 الأسّ المشرقي مرفوع: «سم²» مع المشرقية «سم٢» والرقم مرفوع مصغَّر (tspan/sup)، والنصّ (textContent) هو MS نفسه؛ ولا يُرفع رقمٌ ليس أسّاً
#        («يخلط ٦ و٢»، «م٣» اسم المرحلة)؛ ومع الغربية «²» كما هو بلا رفع مصنوع.
#   A38  المنشور بلونه (العنابي) والمكعب يبقى بلونه.
#   D288 (5) مرحلة البدء من لوحة الكبار: ما قبلها مفتوحٌ بلا إتقان، و«الآن» والدرس التالي من أولها، والمرحلة الأولى تعيد الطريق.
# الاستعمال: python3 test/m4dec_run.py [ملف نسخة الفحص]   (يخرج بـ 1 مع أي إخفاق)
import asyncio, json, os, sys
from playwright.async_api import async_playwright
HERE = os.path.dirname(os.path.abspath(__file__))
FILE = os.path.abspath(sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, '..', 'dist', 'واحة_الرياضيات.dev.html'))
URL = 'file://' + FILE + '#fast&seed=5'
FAILS = []
def check(ok, what, info=''):
  print(('ok   ' if ok else 'FAIL ') + what + ('' if ok else '  ' + json.dumps(info, ensure_ascii=False)[:600]), flush=True)
  if not ok: FAILS.append(what)
KID = {'id': 'k1', 'name': 'سلمى', 'gender': 'f', 'photo': '', 'avatar': 'f3'}
FIND = """(t) => { const walk = (v, id) => { if (Array.isArray(v)) { for (const x of v) { const r = walk(x, id); if (r) return r; } return null; } if (!v || typeof v !== 'object') return null;
    if (v.t === t && !v.given && !v.poly) return [id, v]; for (const [k, x] of Object.entries(v)) if (k !== 'lines' && k !== 'labels') { const r = walk(x, id); if (r) return r; } return null; };
  for (const id of UNITS.flatMap(u => u.lessons)) { const r = walk(LDATA[id], id); if (r) return r; } return null; }"""
START = """([id, it]) => { hush(); CUR = LDATA[id]; FLOW++; show('lesson'); window.__res = null; runItem(JSON.parse(JSON.stringify(it)), 'practice', { scene: 'items' }).then(r => { window.__res = r.ok; }); }"""
LENS = """() => { const L = document.querySelector('#stage svg [data-lens]'); if (!L) return null; const c = L.querySelector(':scope > circle'), u = L.querySelector('use');
  const fr = document.querySelector('#stage svg rect[x="20"][y="14"][rx="14"]'), href = u && u.getAttribute('href');
  return { cx: +c.getAttribute('cx'), cy: +c.getAttribute('cy'), r: +c.getAttribute('r'), ref: !!(href && document.getElementById(href.slice(1))), fb: fr ? 14 + +fr.getAttribute('height') : 240 }; }"""
SVGPT = """([x, y]) => { const s = document.querySelector('#stage svg'), m = s.getScreenCTM().inverse(); return [m.a * x + m.c * y + m.e, m.b * x + m.d * y + m.f]; }"""

async def page(b, digits='east'):
  ctx = await b.new_context(viewport={'width': 375, 'height': 667}, has_touch=True); pg = await ctx.new_page(); errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
  await pg.goto(URL); await pg.wait_for_timeout(250)
  await pg.evaluate("""([kid, dg]) => { localStorage.clear(); localStorage.setItem('hp_kids', JSON.stringify([kid])); localStorage.setItem('hp_kid', JSON.stringify(kid.id)); localStorage.setItem('hp_digits', JSON.stringify(dg)); }""", [KID, digits])
  await pg.reload(); await pg.wait_for_timeout(400); return ctx, pg, errs

async def lens_case(b, kind):
  ctx, pg, errs = await page(b); found = await pg.evaluate(FIND, kind)
  if not found: check(False, 'B-1 %s: لا بند في المحتوى' % kind); return
  await pg.evaluate(START, found); await pg.wait_for_timeout(900)
  want = await pg.evaluate('() => window.__gridPtWant'); a = await pg.evaluate('(w) => window.__gridPtAt(w[0], w[1])', want)
  near = [want[0] + (1 if want[0] < 3 else -1), want[1]]; s0 = await pg.evaluate('(w) => window.__gridPtAt(w[0], w[1])', near)
  check(await pg.evaluate(LENS) is None, 'B-1 %s: لا عدسة قبل اللمس' % kind)
  await pg.mouse.move(s0['x'], s0['y']); await pg.mouse.down(); await pg.wait_for_timeout(120); L0 = await pg.evaluate(LENS)
  await pg.mouse.move(a['x'], a['y'], steps=8); await pg.wait_for_timeout(120); L1 = await pg.evaluate(LENS); fq = await pg.evaluate(SVGPT, [a['x'], a['y']])
  check(bool(L0 and L1 and L0['ref'] and L1['ref']), 'B-1 %s: العدسة ظاهرة ما دام الإصبع يلمس، وتعرض المستوى نفسه' % kind, [L0, L1])
  if L1:
    inside = 20 <= L1['cx'] - L1['r'] and L1['cx'] + L1['r'] <= 340 and 14 <= L1['cy'] - L1['r'] and L1['cy'] + L1['r'] <= L1['fb']
    clear = abs(L1['cy'] - fq[1]) >= L1['r'] + 20
    check(inside and clear, 'B-1 %s: العدسة داخل الإطار ولا تغطّي موضع الإصبع' % kind, [L1, fq])
  await pg.mouse.up(); await pg.wait_for_timeout(150)
  check(await pg.evaluate(LENS) is None, 'B-1 %s: العدسة تختفي برفع الإصبع' % kind)
  got = await pg.evaluate('() => window.__gridPt'); check(got == want, 'B-1 %s: النقطة حيث رُفع الإصبع' % kind, [got, want])
  check(not errs, 'B-1 %s: بلا أخطاء صفحة' % kind, errs); await ctx.close()

SUPS = """(txt) => { const d = document.createElement('div'), s = document.createElementNS('http://www.w3.org/2000/svg', 'svg'), t = document.createElementNS('http://www.w3.org/2000/svg', 'text');
  d.id = 'supT'; s.appendChild(t); document.body.append(d, s); d.textContent = MS(txt); t.textContent = MS(txt); return new Promise(r => setTimeout(() => {
    const out = { html: d.textContent, svg: t.textContent, ms: MS(txt), sup: [...d.querySelectorAll('sup')].map(e => e.textContent.replace('\\u2063', '')), tsp: [...t.querySelectorAll('tspan')].map(e => [e.textContent.replace('\\u2063', ''), e.getAttribute('baseline-shift')]) };
    d.remove(); s.remove(); r(out); }, 60)); }"""
async def sup_case(b):
  ctx, pg, errs = await page(b, 'east')
  r = await pg.evaluate(SUPS, 'المساحة 12 سم² و أ² + ب² = ج²')
  check(r['html'] == r['ms'] and r['svg'] == r['ms'], 'B-17 المشرقية: النصّ كما يعطيه MS (لا يتغيّر بالرفع)', r)
  check(r['sup'] == ['٢'] * 4 and r['tsp'] == [['٢', 'super']] * 4, 'B-17 المشرقية: «سم٢» و«أ٢ + ب٢ = ج٢» مرفوعة في الصفحة وفي الرسم', r)
  for t in ['يخلط 6 و2', 'لمن أنهى م3 بشهادة', '1 و2 و3', 'الجزء أ2']:
    r = await pg.evaluate(SUPS, t); check(not r['sup'] and not r['tsp'], 'B-17 لا يُرفع ما ليس أسّاً: «%s»' % r['ms'], r)
  check(not errs, 'B-17 المشرقية: بلا أخطاء صفحة', errs); await ctx.close()
  ctx, pg, errs = await page(b, 'west'); r = await pg.evaluate(SUPS, 'المساحة 12 سم²')
  check(r['html'] == 'المساحة 12 سم²' and not r['sup'] and not r['tsp'], 'B-17 الغربية: «سم²» كما هو بلا رفع مصنوع', r); await ctx.close()

PRISM = """() => { if (typeof PRISM === 'undefined') return null; const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg'); document.body.appendChild(svg);
  const fills = g => [...new Set([...g.querySelectorAll('polygon, path, rect')].map(e => (e.getAttribute('fill') || '').toLowerCase()).filter(f => f && f !== 'none'))];
  const a = el('g', {}, svg), c = el('g', {}, svg); soBox(a, 6, 3, 4, {}); soBox(c, 3, 3, 3, {}); const r = { box: fills(a), cube: fills(c), P: PRISM }; svg.remove(); return r; }"""
async def prism_case(b):
  ctx, pg, errs = await page(b); r = await pg.evaluate(PRISM)
  if not r: check(False, 'A38 لا ألوان للمنشور (PRISM)'); await ctx.close(); return
  P = r['P']
  check(P['face'] in r['box'] and P['top'] in r['box'] and P['side'] in r['box'], 'A38 المنشور (علبة 6×3×4) بألوان المنشور العنابية', r)
  check(not set(P[k] for k in ('face', 'top', 'side')) & set(r['cube']), 'A38 المكعب يبقى بلونه', r)
  check(not errs, 'A38 بلا أخطاء صفحة', errs); await ctx.close()

# D288 (5): مرحلة البدء يختارها الكبير في التجربة؛ ما قبلها مفتوحٌ بلا إتقان، و«الآن» والدرس التالي من أولها، وما بعد أول وحداتها مقفل، ولا شيء يُحسب منتهياً
START_MAP = """() => { const s = [...document.querySelectorAll('#path .stop[data-lesson]')], at = id => s.find(b => b.dataset.lesson === id);
  const U3 = UNITS.filter(u => stageOf(u.id) === 'm3'), now = document.querySelector('#path .stop.now[data-lesson]');
  return { now: now ? now.dataset.lesson : null, first3: U3[0].lessons[0], m1open: at('m1.u1.d2') ? at('m1.u1.d2').getAttribute('aria-disabled') === 'false' : null,
    m2open: at(UNITS.filter(u => stageOf(u.id) === 'm2')[3].lessons[1]).getAttribute('aria-disabled') === 'false', u3b: U3[1].lessons.every(id => at(id).getAttribute('aria-disabled') === 'true'),
    m4: at(UNITS.find(u => stageOf(u.id) === 'm4').lessons[0]).getAttribute('aria-disabled') === 'true', next: nextLessonId(), done: Object.keys(PROG).filter(k => PROG[k] && PROG[k].done).length, digits: digitsKnown() }; }"""
async def start_case(b):
  ctx, pg, errs = await page(b)
  await pg.evaluate("() => { show('home'); showHome(); }"); await pg.wait_for_timeout(300); r0 = await pg.evaluate(START_MAP)
  check(r0['now'] == 'm1.u1.d1' and r0['m1open'] is False and r0['next'] == 'm1.u1.d1' and not r0['digits'], 'D288 (5) بلا اختيار: يبدأ من م1 والطريق مقفلٌ بعد الدرس الأول', r0)
  await pg.evaluate("() => { openPanel(); }"); await pg.wait_for_timeout(200); await pg.click('#segStart .pick[data-m="m3"]'); await pg.wait_for_timeout(200)
  st = await pg.evaluate("() => [PROG.start, document.querySelector('#segStart .pick[data-m=m3]').getAttribute('aria-pressed')]")
  await pg.evaluate("() => { $('#panel').hidden = true; showHome(); }"); await pg.wait_for_timeout(300); r = await pg.evaluate(START_MAP)
  check(st == ['m3', 'true'], 'D288 (5) اللوحة: «المرحلة الثالثة» تُحفظ وتُعلَّم', st)
  check(r['now'] == r['first3'] and r['next'] == r['first3'], 'D288 (5) «الآن» والدرس التالي أول دروس م3', r)
  check(r['m1open'] and r['m2open'] and r['u3b'] and r['m4'], 'D288 (5) م1 وم2 مفتوحتان للعودة، والوحدة الثانية في م3 وم4 مقفلتان', r)
  check(r['done'] == 0 and r['digits'], 'D288 (5) لا درس يُحسب منتهياً بالاختيار، والأرقام معروفة', r)
  await pg.evaluate("() => { openPanel(); }"); await pg.wait_for_timeout(200); await pg.click('#segStart .pick[data-m="m1"]'); await pg.wait_for_timeout(200)
  await pg.evaluate("() => { $('#panel').hidden = true; showHome(); }"); await pg.wait_for_timeout(300); r2 = await pg.evaluate(START_MAP); st2 = await pg.evaluate("() => 'start' in PROG")
  check(not st2 and r2['now'] == 'm1.u1.d1' and r2['m1open'] is False, 'D288 (5) «المرحلة الأولى» تعيد الطريق كما كان', [st2, r2])
  check(not errs, 'D288 (5) بلا أخطاء صفحة', errs); await ctx.close()

async def main():
  async with async_playwright() as p:
    b = await p.chromium.launch()
    for k in ('coordPlace', 'c4Place'): await lens_case(b, k)
    await sup_case(b); await prism_case(b); await start_case(b); await b.close()
  print('FAILS: %d' % len(FAILS)); sys.exit(1 if FAILS else 0)
asyncio.run(main())
