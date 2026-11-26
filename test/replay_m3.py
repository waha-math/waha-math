# «أعد الجملة» و«نبقى» والخروج في بنود م3 (المراجع B لبوابة S3-U0/U1، 1 و2 و6 و10 و16):
# 1) السؤال بتتمّته (decConv: «اكتبيه بالسنتيمتر وحده:» ثم الطول، وdecPointer وclaimJudge): «أعد الجملة» والخيارات ظاهرة يعيد الجزأين كليهما،
#    والفقاعة بعده على السؤال كله لا على التتمّة وحدها؛ و«نبقى» بعد غطاء الخروج كذلك.
# 2) «أقنعني بسببين»: الخروج إلى الخريطة أثناء قراءة البطاقات لا عطل بعده ولا بطاقة تُقال، و«أعد الجملة» يعيد السؤال ثم البطاقات، و«تمّ» لا يُلمس قبل بطاقتين.
# 3) بند التعليل (cardPick): الخروج أثناء قراءة الأسباب لا يُقال بعده سبب والخريطة ظاهرة.
# python3 test/replay_m3.py
import asyncio, os, sys
from playwright.async_api import async_playwright
HERE = os.path.dirname(os.path.abspath(__file__))
FILE = os.environ.get('FILE', os.path.join(HERE, '..', 'dist', 'واحة_الرياضيات.dev.html'))
FAILS = []
def check(ok, what): print(('ok   ' if ok else 'FAIL ') + what, flush=True); (None if ok else FAILS.append(what))

async def boot(p, fast=True):
  b = await p.chromium.launch(); ctx = await b.new_context(**p.devices['Pixel 5']); pg = await ctx.new_page(); errs = []
  pg.on('pageerror', lambda e: errs.append(str(e)))
  await pg.goto('file://' + os.path.abspath(FILE) + ('#fast' if fast else '#test') + '&seed=7'); await pg.wait_for_timeout(300)
  await pg.evaluate("""() => { localStorage.clear(); localStorage.setItem('hp_kids', JSON.stringify([{ id: 'k1', name: 'سلمى', gender: 'f' }])); localStorage.setItem('hp_kid', JSON.stringify('k1'));
    localStorage.setItem('hp_settings:k1', JSON.stringify({ sessionMax: 0, muted: true })); localStorage.setItem('hp_prog:k1', JSON.stringify({ schema: 3, unlockAll: true })); }""")
  await pg.reload(); await pg.wait_for_timeout(500)
  return b, pg, errs

# أول بندٍ من نوعٍ في درس (الاختبار ثم الإتقان ثم التمرين)
FIND = """([lid, type]) => { const L = LDATA[lid], all = [...((L.test && L.test.items) || []).map(q => q.item), ...Object.values((L.mastery || {}).concepts || {}).flat(), ...((L.practice || {}).normal || []), ...(L.review || []), ...(L.flow || []).flatMap(s => s.scene === 'items' ? s.items || [] : [])];
  return all.find(it => it && itemType(it) === type) || null; }"""
START = """([lid, spec, mode]) => { hush(); CUR = LDATA[lid]; FLOW++; show('lesson'); window.__res = null; window.__clips = [];
  runItem(JSON.parse(JSON.stringify(spec)), mode, { scene: 'replay-m3' }).then(r => { window.__res = r; }, e => { window.__res = { err: String(e && e.message || e) }; }); }"""
TEXT = "(id) => { const l = lineOf(id); return l ? plain(G(l[2])) : ''; }"

async def continuation(p, lid, typ, label):
  b, pg, errs = await boot(p, fast=False)
  spec = await pg.evaluate(FIND, [lid, typ]); check(bool(spec), '%s: بندٌ في %s' % (label, lid))
  if not spec: await b.close(); return
  await pg.evaluate(START, [lid, spec, 'test'])
  try: await pg.wait_for_function("() => !!window.__auto && !speechBusy()", timeout=30000, polling=50)
  except Exception: pass
  await pg.wait_for_timeout(300); said = await pg.evaluate("() => (window.__clips || []).slice()")
  # جزآ السؤال: آخر جملتين قيلتا قبل الخيارات بلا خيارات (q ثم تتمّته)
  qs = await pg.evaluate("() => (LASTQS || []).map(l => l[1])")
  check(len(qs) >= 2, '%s: السؤال جملتان (%s)' % (label, qs))
  full = ' '.join([await pg.evaluate(TEXT, q) for q in qs])
  await pg.evaluate("() => { window.__clips = []; }"); await pg.click('#replay')
  try: await pg.wait_for_function("(n) => (window.__clips || []).length >= n && !speechBusy()", arg=len(qs), timeout=30000, polling=50)
  except Exception: pass
  got = await pg.evaluate("() => window.__clips"); say = await pg.evaluate("() => plain(document.querySelector('#say').textContent)")
  check([c.split('|')[0].split('#')[0] for c in got[:len(qs)]] == qs or all(any(q in c for c in got) for q in qs), '%s: «أعد الجملة» يعيد السؤال بجزأيه %s (قيل %s)' % (label, qs, got[:4]))
  first = await pg.evaluate(TEXT, qs[0])
  check(first[:12] in say, '%s: الفقاعة بعد الإعادة على السؤال لا على التتمّة وحدها («%s»)' % (label, say[:50]))
  # «نبقى» بعد غطاء الخروج
  await pg.click('#mapBtn'); await pg.wait_for_timeout(600); await pg.evaluate("() => { window.__clips = []; }"); await pg.click('#exStay')
  try: await pg.wait_for_function("(n) => (window.__clips || []).length >= n && !speechBusy()", arg=len(qs), timeout=30000, polling=50)
  except Exception: pass
  say2 = await pg.evaluate("() => plain(document.querySelector('#say').textContent)")
  check(first[:12] in say2, '%s: بعد «نبقى» الفقاعة على السؤال كله («%s»)' % (label, say2[:50]))
  check(not errs, '%s: لا خطأ %s' % (label, errs[:2])); await b.close()

async def two_reasons(p):
  b, pg, errs = await boot(p, fast=False)
  spec = await pg.evaluate(FIND, ['m3.u0.d2', 'twoReasons']) or await pg.evaluate(FIND, ['m3.u1.d4', 'twoReasons'])
  lid = 'm3.u0.d2' if await pg.evaluate(FIND, ['m3.u0.d2', 'twoReasons']) else 'm3.u1.d4'
  check(bool(spec), 'أقنعني بسببين: بندٌ في %s' % lid)
  if not spec: await b.close(); return
  await pg.evaluate(START, [lid, spec, 'practice'])
  try: await pg.wait_for_function("() => !!document.querySelector('#stage .choices .pick.card.reading')", timeout=30000, polling=30)
  except Exception: pass
  dis = await pg.evaluate("() => { const d = document.querySelector('#stage .pick.done'); return !!d && d.disabled; }")
  check(dis, 'أقنعني بسببين: «تمّ» معطّل قبل اختيار بطاقتين')
  await pg.click('#mapBtn'); await pg.wait_for_timeout(250); await pg.click('#exLeave'); await pg.wait_for_timeout(200)
  await pg.evaluate("() => { window.__clips = []; }"); await pg.wait_for_timeout(4000)
  after = await pg.evaluate("() => window.__clips"); crash = await pg.evaluate("() => { const c = document.querySelector('#crashCover'); return !!c && !c.hidden; }")
  le = await pg.evaluate("() => (LOG.errors || []).map(e => String(e.msg || e)).slice(-3)")
  check(not crash and not errs and not le, 'أقنعني بسببين: الخروج أثناء البطاقات بلا عطل (%s %s)' % (errs[:1], le[:1]))
  check(not after, 'أقنعني بسببين: لا بطاقة تُقال بعد الخروج (%s)' % after[:3])
  # «أعد الجملة» بعد قراءة البطاقات: السؤال ثم البطاقات الثلاث
  b2, pg2, errs2 = await boot(p, fast=False)
  await pg2.evaluate(START, [lid, spec, 'test'])
  try: await pg2.wait_for_function("() => !!window.__auto && !speechBusy()", timeout=40000, polling=50)
  except Exception: pass
  await pg2.wait_for_timeout(300); await pg2.evaluate("() => { window.__clips = []; }"); await pg2.click('#replay')
  ids = [o['id'] for o in spec['opts']]
  try: await pg2.wait_for_function("([q, ids]) => { const c = window.__clips || [], i = c.findIndex(x => x.includes('.' + q + '_') || x.endsWith('.' + q)); return i >= 0 && ids.every(id => c.slice(i + 1).some(x => x.includes('.' + id))); }", arg=[spec['q'], ids], timeout=40000, polling=50)
  except Exception: pass
  got = await pg2.evaluate("() => window.__clips"); qi = next((i for i, c in enumerate(got) if ('.' + spec['q'] + '_') in c or c.endswith('.' + spec['q'])), -1)
  check(qi >= 0 and all(any(('.' + i) in c for c in got[qi + 1:]) for i in ids), 'أقنعني بسببين: «أعد الجملة» يعيد السؤال ثم البطاقات الثلاث (%s)' % got[:6])
  await b2.close(); await b.close()

async def reason_exit(p):
  b, pg, errs = await boot(p, fast=False)
  spec = await pg.evaluate(FIND, ['m3.u0.d1', 'reason']); check(bool(spec), 'التعليل: بندٌ في m3.u0.d1')
  if not spec: await b.close(); return
  await pg.evaluate(START, ['m3.u0.d1', spec, 'mastery'])
  try: await pg.wait_for_function("() => !!document.querySelector('#stage .choices .pick.card.reading')", timeout=30000, polling=30)
  except Exception: pass
  await pg.click('#mapBtn'); await pg.wait_for_timeout(250); await pg.click('#exLeave'); await pg.wait_for_timeout(200)
  await pg.evaluate("() => { window.__clips = []; }"); await pg.wait_for_timeout(4000)
  after = await pg.evaluate("() => window.__clips")
  check(not after and not errs, 'التعليل: لا سبب يُقال بعد الخروج والخريطة ظاهرة (%s %s)' % (after[:3], errs[:1])); await b.close()

# السؤال بجزأين على REPLAY_HOOK (coordPlace: الجملة ثم الزوج): «أعد الجملة» يعيدهما معاً، والجواب قبل الزوج لا يُلحقه بعده (المراجع B لبوابة S3-U4/U5، 9 و11)
async def hook_two_part(p, lid, typ, label):
  b, pg, errs = await boot(p, fast=False)
  spec = await pg.evaluate(FIND, [lid, typ]); check(bool(spec), '%s: بندٌ في %s' % (label, lid))
  if not spec: await b.close(); return
  spec = dict(spec); spec.pop('given', None); spec.pop('noPair', None)
  await pg.evaluate(START, [lid, spec, 'test'])
  try: await pg.wait_for_function("() => !!window.__auto && !speechBusy()", timeout=30000, polling=50)
  except Exception: pass
  pair = 'gen.co.p.%s.%s' % (str(spec['x']).replace('.', '_'), str(spec['y']).replace('.', '_'))
  try: await pg.wait_for_function("(p) => (window.__clips || []).some(c => c.includes(p)) && !speechBusy()", arg=pair, timeout=15000, polling=50)
  except Exception: pass
  said = await pg.evaluate("() => (window.__clips || []).slice()")
  check(any(pair in c for c in said), '%s: قيل الزوج بعد الجملة (%s)' % (label, said[-2:]))
  await pg.evaluate("() => { window.__clips = []; }"); await pg.click('#replay')
  try: await pg.wait_for_function("() => (window.__clips || []).length >= 2 && !speechBusy()", timeout=30000, polling=50)
  except Exception: pass
  got = await pg.evaluate("() => window.__clips")
  check(len(got) >= 2 and pair in got[-1] and pair not in got[0], '%s: «أعد الجملة» يعيد الجملة ثم الزوج (%s)' % (label, got[:3]))
  await b.close()
  # الجواب أثناء الجملة: لا يُقال الزوج بعده
  b, pg, errs2 = await boot(p, fast=False)
  await pg.evaluate(START, [lid, spec, 'test'])
  try: await pg.wait_for_function("() => !!window.__auto && (window.__clips || []).length >= 1", timeout=30000, polling=30)
  except Exception: pass
  await pg.evaluate("() => { const a = window.__auto; if (a) a.ok(); }")
  try: await pg.wait_for_function("() => window.__res !== null", timeout=30000, polling=50)
  except Exception: pass
  await pg.wait_for_timeout(500); said = await pg.evaluate("() => (window.__clips || []).slice()")
  i = next((k for k, c in enumerate(said) if pair in c), -1)
  check(i == -1, '%s: الجواب قبل الزوج لا يُلحقه بعده (%s)' % (label, said[:4]))
  check(not errs and not errs2, '%s: لا خطأ %s' % (label, (errs + errs2)[:2])); await b.close()

async def main():
  async with async_playwright() as p:
    await continuation(p, 'm3.u0.d3', 'decConv', 'التحويل')
    await continuation(p, 'm3.u0.d1', 'decPointer', 'المؤشّر')
    await continuation(p, 'm3.u1.d3', 'claimJudge', 'ممكن أم مستحيل')
    await hook_two_part(p, 'm3.u5.d1', 'coordPlace', 'عيّن النقطة')
    await two_reasons(p)
    await reason_exit(p)
  print('FAILS:', len(FAILS)); sys.exit(1 if FAILS else 0)
asyncio.run(main())
