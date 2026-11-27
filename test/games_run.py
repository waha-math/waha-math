# فحوص قبول إصلاحات الألعاب بعد تجربة فراس نسخة الويب (15 نوفمبر 2026، D267)؛ كل فحص يخفق على 6e2e386 ما لم يُذكر أنه ضابط:
#   STORY  «قصص الواحة»: القصة باقية في الفقاعة وقت البناء ووقت «كم معنا الآن؟»، وعدداها رقمان على المسرح؛ و«تمّ» ببرجٍ يخالف القصة
#          لا تسأل «كم؟»: «لا يطابق القصة بعد» والبرج كما بناه، ثم تلميحها، ثم نمثّلها معاً؛ والجواب عدد البرج، ولا يُحسب من أول محاولة (وفي المراجعة كذلك).
#   MINUS  «أبعد» تنطق العدد الجديد كـ«أضف»: بعد ثلاث إضافات وإبعادٍ آخر عددٍ مسموع عدد البرج (بزمنٍ حقيقي وصوتٍ غير مكتوم).
#   OFFER  عرض «هل نفكّر معاً؟» يُسمع والسؤال باقٍ في الفقاعة.
#   FRAME  لعبة «أكمل الإطار»: التعليمة كاملة بعددها في الجولات الثلاث.
#   TEN    قصص «نكوّن العشرة أولاً» و«نرجع إلى العشرة» باقية في الفقاعة وقت العمل ووقت السؤال؛ و«…عددها ستة. ابدئي…» بفاصلٍ بعد العدد؛
#          وحين يمتلئ الإطار (والحافلة) تومض القطع الزرقاء كلها، ما دخله وما بقي خارجه.
#   DRAW   «أيّ الجملتين تناسب الصورة؟»: السهم برأس؛ والمكعب الأبيض بحدٍّ غير أبيض.
#   PFL    براهين السلسلة: المتوازيان بالارتفاع المتاح، وبطاقة المستوى الثاني بجانب الشكل لا عليه
#   C6G    ألعاب M4-U6 الحركية (D288 (2)): يحرّك الوتر والمسطرة، ويجد المركز ويقرأ المنقلة؛ الخطأ المقصود، والخطوات تبقى، والحلّ المشترك
#   C7G    ألعاب M4-U7 الحركية (D288 (2)): يملأ ويصبّ ويغلّف ثم يحسب؛ الخطأ المقصود في كل خطوة، والخطوات تبقى، والحلّ المشترك من حيث وقف الطفل
#   C8G    ألعاب M4-U8 الحركية (D288 (2)): الخطأ المقصود في كل خطوة، والخطوات المنجزة تبقى، والحلّ المشترك من حيث وقف الطفل، والقراءة بوسمها
#   C9G    ألعاب M4-U9 الحركية (D288 (2)): جولاتها بنودٌ بسلّم D240؛ الخطأ المقصود في كل لعبة، والمرآتان بأيّ ترتيب، والزرّان والتكافؤ واللمستان،
#          والمنقلة بصفريها، وكل جولةٍ من الدروس الثلاثة بأربعة أخطاء حتى الكشف بلا خطأ في الصفحة (المراجع B لدفعة الألعاب، 2 و3 و4).
# والضوابط (تنجح على 6e2e386 أيضاً): «الصحيح من أول محاولة»، والجولة الأولى في «أكمل الإطار» وانتهاء اللعبة، و«بلا خطأ في الصفحة».
# الاستعمال: python3 test/games_run.py [ملف نسخة الفحص]   (ONLY=STORY,MINUS لبعضها؛ يخرج بـ 1 مع أي إخفاق)
import asyncio, json, os, re, sys
from playwright.async_api import async_playwright
HERE = os.path.dirname(os.path.abspath(__file__))
FILE = os.path.abspath(sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, '..', 'dist', 'واحة_الرياضيات.dev.html'))
ONLY = {x for x in os.environ.get('ONLY', '').split(',') if x}
FAILS = []
def on(k): return not ONLY or k in ONLY
def check(k, ok, what, info=''):
  print(('ok   ' if ok else 'FAIL ') + k + ' ' + what + ('' if ok else '  ' + json.dumps(info, ensure_ascii=False)[:900]), flush=True)
  if not ok: FAILS.append(k)
KID = {'id': 'k1', 'name': 'سلمى', 'gender': 'f', 'photo': '', 'avatar': 'f3'}
async def page(b, fast=True):
  ctx = await b.new_context(viewport={'width': 393, 'height': 851}); pg = await ctx.new_page(); errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
  await pg.goto('file://' + FILE + ('#fast&seed=5' if fast else '#test&seed=5')); await pg.wait_for_timeout(250)
  await pg.evaluate("""([kid, muted]) => { localStorage.clear(); localStorage.setItem('hp_kids', JSON.stringify([kid])); localStorage.setItem('hp_kid', JSON.stringify(kid.id));
    localStorage.setItem('hp_settings:' + kid.id, JSON.stringify({ sessionMax: 0, muted })); localStorage.setItem('hp_prog:' + kid.id, JSON.stringify({ schema: 3, unlockAll: true })); }""", [KID, fast])
  await pg.reload(); await pg.wait_for_timeout(400); return ctx, pg, errs
START = """([lid, spec, mode]) => { hush(); CUR = LDATA[lid]; FLOW++; show('lesson'); window.__res = null; window.__err = null; window.__clips = [];
  const p = typeof spec === 'number' ? (() => { const st = LDATA[lid].flow[spec]; return SCENES[st.scene](st, LDATA[lid]); })() : runItem(spec, mode, { scene: mode });
  p.then(r => { window.__res = { ok: !!(r && r.ok), first: !!(r && r.firstTry) }; }, e => { window.__err = String(e && e.message || e); }); }"""
ST = """() => { const a = window.__auto, st = document.querySelector('#stage'), svg = st && st.querySelector('svg');
  const cubes = svg ? [...svg.querySelectorAll('g')].filter(g => g.querySelector(':scope > polygon[data-face]')).length : 0;
  return { say: (document.querySelector('#say') || {}).textContent || '', auto: a ? { n: a.n, kind: a.kind } : null, res: window.__res, err: window.__err, clips: window.__clips || [],
    nums: st ? [...st.querySelectorAll('.choices.nums button')].map(b => +b.dataset.k) : [], cubes, storyNums: st ? [...st.querySelectorAll('[data-story-num]')].map(g => +g.dataset.storyNum) : [],
    glow: document.querySelector('#helpBtn') ? document.querySelector('#helpBtn').classList.contains('glow') : null }; }"""
FLASH = "() => { const f = [...document.querySelectorAll('#stage svg [data-counter][data-flash]')]; return [f.length, f.filter(k => k.closest('[data-frame]')).length, f.filter(k => !k.closest('[data-frame]')).length]; }"
async def until(pg, pred, t=20000):
  """ينتظر حالةً تحقّق pred، ويعيدها (أو آخر حالة عند المهلة)"""
  st = None
  for _ in range(t // 50):
    st = await pg.evaluate(ST)
    if st['err'] or pred(st): return st
    await pg.wait_for_timeout(50)
  return st
def wait_kind(kind, after=-1): return lambda s: s['auto'] and s['auto']['kind'] == kind and s['auto']['n'] != after
async def ok_now(pg): await pg.evaluate("() => { const a = window.__auto; if (a) a.ok(); }")
async def tap(pg, k): await pg.click('#stage .build [data-k="%s"]' % k, timeout=8000)
S01 = {'t': 'story', 'op': '+', 'a': 3, 'b': 2, 'line': 'gen.story.s01'}
S02 = {'t': 'story', 'op': '-', 'a': 6, 'b': 2, 'line': 'gen.story.s02'}

async def story(b):
  ctx, pg, errs = await page(b)
  # (1) الطريق الصحيح: القصة في الفقاعة والتعليمة مسموعة، والعددان رقمان؛ ثم السؤال بعد القصة
  await pg.evaluate(START, ['m1.u2.d5', S01, 'practice']); st = await until(pg, wait_kind('story'))
  check('STORY', 'ثَلَاثُ تَمَرَاتٍ' in st['say'] and 'المُكَعَّبَاتِ كَمَا' not in st['say'] and any(c.startswith('gen.story.add') for c in st['clips']),
        'وقت البناء: القصة في الفقاعة، و«أضيفي المكعبات كما في القصة» مسموعة لا تمحوها', st['say'])
  check('STORY', st['storyNums'] == [3, 2], 'عددا القصة رقمان على المسرح (٣ ثم ٢)', st['storyNums'])
  a0 = st['auto']['n']; await ok_now(pg); st = await until(pg, wait_kind('num', a0))
  check('STORY', 'ثَلَاثُ تَمَرَاتٍ' in st['say'] and 'كَمْ مَعَنَا الآنَ؟' in st['say'] and st['storyNums'] == [3, 2], 'وقت «كم معنا الآن؟»: القصة والسؤال في الفقاعة، والرقمان باقيان', st['say'])
  await ok_now(pg); st = await until(pg, lambda s: s['res']); check('STORY', st['res'] == {'ok': True, 'first': True} and not errs, 'والصحيح من أول محاولة', [st['res'], errs[:1]])
  # (2) برجٌ يخالف القصة: لا سؤال، والبرج كما بناه، ثم يصلحه فيكون جوابه ما يراه
  for mode in ('practice', 'review'):
    await pg.evaluate(START, ['m1.u2.d5', S01, mode]); st = await until(pg, wait_kind('story')); a0 = st['auto']['n']
    await tap(pg, 'plus'); await pg.wait_for_timeout(120); await tap(pg, 'done')
    st = await until(pg, lambda s: any(c.startswith('gen.story.notYet') for c in s['clips']) or s['nums'])
    check('STORY', not st['nums'] and st['cubes'] == 4 and any(c.startswith('gen.story.notYet') for c in st['clips']),
          '(%s) «تمّ» ببرجٍ من أربعة: لا «كم؟»، بل «برجكِ لا يطابق القصة بعد»، والبرج أربعة كما بناه' % mode, [st['nums'], st['cubes'], st['clips'][-4:]])
    st = await until(pg, wait_kind('story', a0)); check('STORY', 'ثَلَاثُ تَمَرَاتٍ' in st['say'] and st['cubes'] == 4, '(%s) ثم تُعاد القصة، والبرج باقٍ ليصلحه' % mode, [st['say'], st['cubes']])
    await tap(pg, 'plus'); await pg.wait_for_timeout(120); await tap(pg, 'done'); st = await until(pg, lambda s: s['nums'])
    check('STORY', st['cubes'] == 5 and 5 in st['nums'], '(%s) أصلحه فصار خمسة: «كم؟» وبين الخيارات عدد برجه' % mode, [st['cubes'], st['nums']])
    await pg.click('#stage .choices.nums button[data-k="5"]', timeout=8000); st = await until(pg, lambda s: s['res'])
    check('STORY', st['res'] == {'ok': True, 'first': False} and not errs, '(%s) جوابه عدد برجه صحيح، ولا يُحسب من أول محاولة' % mode, [st['res'], errs[:1]])
  # (3) ثلاث مرات يخالفها: التلميح في الثانية، ونمثّلها معاً في الثالثة؛ وفي الإبعاد كذلك
  for spec, want in ((S01, 5), (S02, 4)):
    await pg.evaluate(START, ['m1.u2.d5', spec, 'practice']); last = -1
    for i in range(3):
      st = await until(pg, wait_kind('story', last)); last = st['auto']['n']; await tap(pg, 'done')
      if i < 2: await until(pg, lambda s: s['auto'] and s['auto']['n'] != last)
    st = await until(pg, lambda s: s['nums'], 30000); hint = 'gen.story.hintAdd' if spec['op'] == '+' else 'gen.story.hintRemove'
    check('STORY', st['cubes'] == want and any(c.startswith(hint) for c in st['clips']) and any(c.startswith('gen.story.together') for c in st['clips']) and spec['line'] in ' '.join(st['clips']),
          '%s: ثلاث مرات «تمّ» بالبرج الأول: تلميح القصة، ثم «نمثّل القصة معاً» فيصير البرج %d، ثم «كم؟»' % (spec['op'], want), [st['cubes'], st['clips'][-8:]])
    await ok_now(pg); st = await until(pg, lambda s: s['res']); check('STORY', st['res'] == {'ok': True, 'first': False}, '%s: ولا يُحسب من أول محاولة' % spec['op'], st['res'])
  # (4) بعد خطأ العدّ يبقى البرج مبنياً كما في القصة، والقصة في الفقاعة
  await pg.evaluate(START, ['m1.u2.d5', S01, 'practice']); st = await until(pg, wait_kind('story')); a0 = st['auto']['n']; await ok_now(pg)
  st = await until(pg, wait_kind('num', a0)); a1 = st['auto']['n']; await pg.evaluate("() => { const a = window.__auto; if (a) (a.wrong || a.ok)(); }")
  st = await until(pg, wait_kind('num', a1), 30000)
  check('STORY', st['cubes'] == 5 and 'ثَلَاثُ تَمَرَاتٍ' in st['say'] and 'كَمْ مَعَنَا الآنَ؟' in st['say'], 'بعد خطأ العدّ: البرج خمسة كما في القصة، والقصة والسؤال في الفقاعة', [st['cubes'], st['say']])
  await ok_now(pg); await until(pg, lambda s: s['res']); check('STORY', not errs, 'بلا خطأ في الصفحة', errs[:2]); await ctx.close()

async def minus(b):
  ctx, pg, errs = await page(b, fast=False)
  await pg.evaluate(START, ['m1.u2.d5', S01, 'practice']); await pg.wait_for_selector('#stage .build [data-k="plus"]'); await until(pg, wait_kind('story'), 30000)
  for k in ('plus', 'plus', 'plus', 'minus'): await tap(pg, k); await pg.wait_for_timeout(1300)
  num = lambda s: [c for c in s['clips'] if c.startswith('gen.numw.')]
  st = await until(pg, lambda s: num(s)[-1:] == ['gen.numw.05'] and len(num(s)) >= 4, 8000); nums = num(st)   # العدد ينتظر دور ما قبله في الطابور
  check('MINUS', st['cubes'] == 5 and nums[-1:] == ['gen.numw.05'], 'ثلاث إضافات ثم إبعاد: البرج خمسة، وآخر عددٍ مسموع «خمسة» لا «ستة»', [st['cubes'], nums[-4:]])
  check('MINUS', not errs, 'بلا خطأ في الصفحة', errs[:2]); await ctx.close()

async def offer(b):
  ctx, pg, errs = await page(b)
  await pg.evaluate(START, ['m1.u2.d5', S01, 'practice']); st = await until(pg, wait_kind('story')); before = st['say']
  st = await until(pg, lambda s: any(c.startswith('gen.hintOffer') for c in s['clips']), 15000); await pg.wait_for_timeout(300); st = await pg.evaluate(ST)
  check('OFFER', any(c.startswith('gen.hintOffer') for c in st['clips']) and st['glow'] and st['say'] == before and 'ثَلَاثُ تَمَرَاتٍ' in st['say'],
        'عرض «هل نفكّر معاً؟» مسموع والفانوس يتوهّج، والقصة باقية في الفقاعة', [st['say'], before, st['glow']])
  check('OFFER', not errs, 'بلا خطأ في الصفحة', errs[:2]); await ctx.close()

async def frame(b):
  ctx, pg, errs = await page(b)
  await pg.evaluate(START, ['m1.u4.d6', 3, 'game']); last = -1; seen = []
  for i, w in enumerate(('ثَلَاثَة', 'خَمْسَة', 'اثْنَان')):
    st = await until(pg, wait_kind('tap', last)); last = st['auto']['n']; seen.append(st['say'])
    check('FRAME', 'يَكْتَمِلُ بِهَذَا العَدَدِ' in st['say'] and w in st['say'], 'الجولة %d: التعليمة كاملة بعددها في الفقاعة' % (i + 1), st['say'])
    await ok_now(pg)
  st = await until(pg, lambda s: s['res']); check('FRAME', st['res'] is not None and not errs, 'وتنتهي اللعبة بلا خطأ', [st['res'], errs[:1]]); await ctx.close()

async def ten(b):
  ctx, pg, errs = await page(b)
  for spec, words, kinds in (({'t': 'makeTen', 'a': 7, 'b': 6, 'ask': 'total', 'story': 'pr.st2'}, 'سَبْعَةُ مَشَابِكَ', ('frameMove', 'num')),
                             ({'t': 'backTen', 'a': 12, 'b': 5, 'story': 'pr.st4'}, 'بُرْتُقَالَةً', ('frameTake', 'num'))):
    await pg.evaluate(START, ['m1.u4.d7', spec, 'practice']); last = -1
    for k in kinds:
      st = await until(pg, wait_kind(k, last)); last = st['auto']['n']
      check('TEN', words in st['say'], '%s: القصة في الفقاعة وقت %s' % (spec['t'], k), st['say'])
      if spec['t'] == 'makeTen' and k == 'num':
        fl = await pg.evaluate(FLASH); check('TEN', fl == [6, 3, 3], 'makeTen: حين امتلأ الإطار ومضت الزرقاء الست كلها: ثلاث فيه وثلاث خارجه', fl)
      await ok_now(pg)
    await until(pg, lambda s: s['res'])
  # ولعبة «حافلة الواحة»: الجولة الأولى 7 و5، فحين تمتلئ يومض الركّاب الخمسة الجدد: ثلاثة صعدوا واثنان ينتظرون
  await pg.evaluate(START, ['m1.u4.d7', 3, 'game']); st = await until(pg, wait_kind('frameMove')); a0 = st['auto']['n']; await ok_now(pg)
  st = await until(pg, wait_kind('num', a0)); fl = await pg.evaluate(FLASH)
  check('TEN', fl == [5, 3, 2], '«حافلة الواحة»: حين امتلأت ومض الركّاب الخمسة الجدد كلهم: ثلاثة فيها واثنان ينتظرون', fl)
  for _ in range(12):
    st = await until(pg, lambda s: s['res'] or s['auto'], 8000)
    if st['res']: break
    await ok_now(pg); await pg.wait_for_timeout(60)
  await pg.evaluate(START, ['m1.u4.d7', {'t': 'backTen', 'a': 14, 'b': 6}, 'practice']); st = await until(pg, wait_kind('frameTake'))
  check('TEN', re.search(r'سِتَّة\. اِبْدَئِي', st['say']) is not None, '«أبعدي قطعاً عددها ستة. ابدئي بالتي خارج الإطار»: فاصلٌ بعد العدد', st['say'])
  await ok_now(pg); st = await until(pg, wait_kind('num')); await ok_now(pg); await until(pg, lambda s: s['res'])
  check('TEN', not errs, 'بلا خطأ في الصفحة', errs[:2]); await ctx.close()

async def draw(b):
  ctx, pg, errs = await page(b)
  for op in ('+', '-'):
    await pg.evaluate(START, ['m1.u2.d5', {'t': 'sentence', 'op': op, 'a': 6, 'b': 2}, 'practice']); await until(pg, wait_kind('sentence'))
    n = await pg.evaluate("() => document.querySelectorAll('#stage svg [data-arrowhead]').length")
    check('DRAW', n == 1, '«أيّ الجملتين…» (%s): للسهم رأس' % op, n); await ok_now(pg); await until(pg, lambda s: s['res'])
  await pg.evaluate(START, ['m1.u2.d5', {'t': 'join', 'a': 4, 'b': 3}, 'practice']); await until(pg, wait_kind('tap'))
  w = await pg.evaluate("() => { const st = [...document.querySelectorAll('#stage svg polygon[data-face]')].map(p => p.getAttribute('stroke')); const E = typeof CUBE_EDGE_W === 'undefined' ? '#ffffff' : CUBE_EDGE_W; return [st.filter(s => s === E).length, st.length, E]; }")
  check('DRAW', w[0] >= 3 * 2 and w[2].lower() != '#ffffff', 'المكعبات البيضاء الثلاثة بحدٍّ غير أبيض', w)
  await ok_now(pg); st = await until(pg, wait_kind('num')); await ok_now(pg); await until(pg, lambda s: s['res'])
  check('DRAW', not errs, 'بلا خطأ في الصفحة', errs[:2]); await ctx.close()

# M4-U9 الألعاب الحركية (خطة ألعاب المرحلة 4): مرآة الكنز (المرآة الخاطئة تُبعد، والنقطة على المرآة لا تتحرّك)، وعجلة الدوران («تمّ» بربعٍ ناقص خطأ)، والباب الدوّار (مركزٌ خاطئ يُسجَّل) ثم المرآتان
async def c9g(b):
  """ألعاب M4-U9 الحركية (D288 (2)): كل جولةٍ بندٌ حركيّ بنمط التمرين. الخطأ المقصود في كل لعبة، ومن أيّ مرآةٍ بدأ، والزرّان والتكافؤ واللمستان،
  والمنقلة بتدريجيها، والدرجات الأربع حتى الكشف في كل جولةٍ من الدروس الثلاثة بلا خطأ في الصفحة (المراجع B لدفعة الألعاب، 2 و3 و4)"""
  ctx, pg, errs = await page(b)
  async def run(lid, spec): await pg.evaluate("() => { LOG.attempts.length = 0; }"); await pg.evaluate(START, [lid, spec, 'practice'])
  async def logs(): return await pg.evaluate("() => LOG.attempts.filter(x => /^c9-/.test(x.tag || '')).map(x => [x.tag, x.ok, x.firstTry === undefined ? null : x.firstTry, x.err || null])")
  async def wk(kind, after=-1): return await until(pg, lambda s: s['res'] or (s['auto'] and s['auto']['kind'] == kind and s['auto']['n'] != after))
  async def click(sel, i=0): await pg.evaluate("([sel, i]) => { const e = [...document.querySelectorAll(sel)][i]; if (e) e.dispatchEvent(new MouseEvent('click', { bubbles: true })); }", [sel, i])
  async def done(): await pg.wait_for_timeout(450); await pg.evaluate("() => { const d = document.querySelector('#stage .pick.done'); if (d) d.click(); }"); await pg.wait_for_timeout(600)
  async def res(): return await until(pg, lambda s: s['res'] or s['err'], 30000)
  helps = "() => document.querySelectorAll('#stage svg [data-help]').length"
  nn = lambda st: st['auto']['n'] if st and st.get('auto') else -1   # وبعد خطأٍ في الصفحة يمضي الفحص إلى رسالته لا إلى استثناء
  # ---- مرآة الكنز
  await run('m4.u9.d1', {'t': 'c9Trs', 'p': [-4, 2], 'goal': [-4, -2], 'q': 'tr.01'}); st = await wk('tap')
  cl = await pg.evaluate("() => [[...document.querySelectorAll('#stage svg [data-clue]')].map(g => g.dataset.clue), document.querySelectorAll('#stage svg [data-chest]').length]")
  check('C9G', cl == [['m4_m2'], 0], 'مرآة الكنز: الكنز مدفونٌ عند زوجه المكتوب، ولا صندوق على الخانة قبل الوصول (المراجع A لإغلاق ألعاب U9، 3)', cl)
  HID = "() => { const f = () => document.querySelectorAll('#stage svg [data-tk][visibility=hidden]').length; window.__hid = 0; window.__hid0 = f(); if (window.__hidMo) window.__hidMo.disconnect(); window.__hidMo = new MutationObserver(() => { window.__hid = Math.max(window.__hid, f()); }); window.__hidMo.observe(document.querySelector('#stage'), { subtree: true, attributes: true, attributeFilter: ['visibility'] }); window.__hidIv = 0; }"   # أقصى ما أُخفي في أي لحظة (بمراقب التغيّرات، فلا يفوته إطارٌ في السرعة)
  await pg.evaluate(HID); await click('#stage svg [data-mirror="refV"]'); await pg.wait_for_timeout(900); L = await logs(); hd = await pg.evaluate("() => { clearInterval(window.__hidIv); return [window.__hid0, window.__hid]; }")
  check('C9G', hd[1] > hd[0], 'مرآة الكنز: أعداد المحورين على طريق الانقلاب تُخفى مدّته (المراجع B لإغلاق ألعاب U9، 2)', hd)
  check('C9G', L[:1] == [['c9-treasure', False, True, 'c9TrFar']], 'مرآة الكنز: المرآة التي تُبعد النقطة خطأ c9TrFar من أول محاولة', L)
  st = await wk('tap', nn(st)); await click('#stage svg [data-mirror="refH"]'); st = await wk('axPts'); await pg.evaluate("() => { const a = window.__auto; if (a) (a.wrong || a.ok)(); }"); await pg.wait_for_timeout(900); L = await logs()
  check('C9G', len(L) == 2 and L[1][1] is False and L[1][3] not in (None, 'c9TrFar', 'c9TrStay'), 'مرآة الكنز: المرآة الصحيحة والخانة الخاطئة خطأ الخانة', L)
  st = await wk('tap', nn(st)); h2 = await pg.evaluate(helps); await click('#stage svg [data-mirror="refV"]')
  st = await wk('axPts', nn(st)); h3 = await pg.evaluate("() => { const m = document.querySelector('#stage svg [data-mirror=refV]'); return [document.querySelectorAll('#stage svg [data-help]').length, m ? +m.getAttribute('opacity') : 1]; }")
  check('C9G', h2 > 0 and h3[0] > 0 and h3[1] < .5, 'مرآة الكنز: المستوى الثاني مرسوم، والثالث يختار المرآة ويرسم نصف الطريق', [h2, h3])
  await pg.evaluate("() => { const a = window.__auto; if (a) (a.wrong || a.ok)(); }"); r = await res(); L = await logs()
  check('C9G', r['res'] and r['res']['ok'] is False and len([x for x in L if x[1] is False]) == 4 and not r['err'], 'مرآة الكنز: أربعة أخطاء ثم الكشف بلا خطأ', [r['res'], r['err'], L])
  await run('m4.u9.d1', {'t': 'c9Trs', 'p': [3, 0], 'goal': [-3, 0], 'q': 'tr.02'}); await wk('tap'); await click('#stage svg [data-mirror="refH"]'); await pg.wait_for_timeout(900); L = await logs()
  check('C9G', L[:1] == [['c9-treasure', False, True, 'c9TrStay']], 'مرآة الكنز: النقطة على المرآة لا تتحرّك بها، ويُسجَّل c9TrStay', L)
  await run('m4.u9.d1', {'t': 'c9Trs', 'p': [-5, 4], 'goal': [5, -4], 'q': 'tr.03'}); st = await wk('tap')
  for _ in range(2): await click('#stage svg [data-mirror="refH"]'); st = await wk('axPts', nn(st)); await pg.evaluate("() => { const a = window.__auto; if (a) a.wrong(); }"); st = await wk('tap', nn(st))
  await click('#stage svg [data-mirror="refH"]'); st = await wk('axPts', nn(st)); await pg.wait_for_timeout(300); h0 = await pg.evaluate(helps); await pg.evaluate("() => { const a = window.__auto; if (a) a.ok(); }"); st = await wk('tap', nn(st)); await pg.wait_for_timeout(400); h1 = await pg.evaluate(helps)
  check('C9G', h0 > 0 and h1 == 0, 'مرآة الكنز: المستوى الثاني للموضع الذي أخطأ فيه، ولا يبقى بعد الخطوة الصحيحة (المراجع B لإغلاق ألعاب U9، 2)', [h0, h1])
  # والفقاعة بارتفاعٍ ثابت في هذا الفحص: يُقاس أثر شريط «تمّ» وحده
  i0 = await pg.evaluate("() => LDATA['m4.u9.d1'].flow.findIndex(s => s.scene === 'motion')"); await pg.evaluate("() => { LOG.attempts.length = 0; }"); await pg.evaluate(START, ['m4.u9.d1', i0, 'game']); st = await wk('tap')   # في مشهد اللعبة نفسه (الفقاعة بأسطرها الثلاثة)
  y0 = await pg.evaluate("() => { const b = document.querySelector('#bubble'); b.style.height = '170px'; b.style.overflow = 'hidden'; const r = document.querySelector('#stage svg').getBoundingClientRect(); return [Math.round(r.top), Math.round(r.height)]; }"); xy = await pg.evaluate("() => { const r = document.querySelector('#stage svg [data-mirror=refH] line').getBoundingClientRect(); return [r.left + r.width * .3, r.top + r.height / 2]; }")
  await pg.mouse.click(*xy); await pg.wait_for_timeout(150); await pg.mouse.click(*xy); await pg.wait_for_timeout(500)
  dd = await pg.evaluate("() => { const r = document.querySelector('#stage svg').getBoundingClientRect(), b = document.querySelector('#bubble'); b.style.height = ''; b.style.overflow = ''; return [window.__axPlaced, [Math.round(r.top), Math.round(r.height)], !!document.querySelector('#stage .pick.done:not([disabled])')]; }")
  await pg.evaluate("() => { hush(); FLOW++; }")
  check('C9G', dd[0] == 0 and dd[1] == y0 and dd[2], 'مرآة الكنز: لمستان سريعتان على المرآة تختارانها ولا تضعان نقطة، والمسرح لا يصغر حين يظهر «تمّ» (مكانه محجوز فلا يتحرّك المستوى؛ المراجع B لإغلاق ألعاب U9، 3)', [y0, dd])
  await run('m4.u9.d1', {'t': 'c9Trs', 'p': [3, 0], 'goal': [-3, 0], 'q': 'tr.02'}); st = await wk('tap'); await click('#stage svg [data-mirror="refV"]'); st = await wk('axPts', nn(st))
  mt = await pg.evaluate("() => document.querySelectorAll('#stage svg [data-mirror][role=button], #stage svg [data-mirror][tabindex]').length")
  check('C9G', mt == 0, 'مرآة الكنز: المرآتان بعد الاختيار ليستا هدفين (المراجع B لإغلاق ألعاب U9، 6)', mt)
  await pg.evaluate("() => { const q = window.__axAt(3, 0); const e = document.elementFromPoint(q.x, q.y); for (const t of ['pointerdown', 'pointerup']) document.querySelector('#stage svg').dispatchEvent(new PointerEvent(t, { bubbles: true, clientX: q.x, clientY: q.y, pointerId: 1, isPrimary: true, pointerType: 'mouse' })); }"); await pg.wait_for_timeout(200)
  await pg.evaluate("() => { const d = document.querySelector('#stage .pick.done'); if (d) d.click(); }"); await pg.wait_for_timeout(900); L = await logs()
  check('C9G', L[:1] == [['c9-treasure', False, True, 'c9Keep']], 'مرآة الكنز: لمس خانة النقطة نفسها إبقاءٌ ولو كانت على المحور الآخر (المراجع B لإغلاق ألعاب U9، 5)', L)
  await run('m4.u9.d1', {'t': 'c9Trs', 'p': [-5, 4], 'goal': [5, -4], 'q': 'tr.03'}); st = await wk('tap'); await click('#stage svg [data-mirror="refH"]')
  st = await wk('axPts'); await pg.evaluate("() => { const a = window.__auto; if (a) a.ok(); }"); st = await wk('tap', nn(st)); await click('#stage svg [data-mirror="refV"]'); st = await wk('axPts', nn(st)); await pg.evaluate("() => { const a = window.__auto; if (a) a.ok(); }")
  r = await res(); L = await logs()
  check('C9G', L == [['c9-treasure', True, True, None]] and r['res'] and r['res']['ok'], 'مرآة الكنز: مرآتان بدءاً بالأفقية صحيحٌ من أول محاولة', [L, r['res']])
  ch = await pg.evaluate("() => [...document.querySelectorAll('#stage svg [data-chest]')].map(g => g.dataset.chest)")
  check('C9G', ch == ['open'], 'مرآة الكنز: الصندوق يظهر مفتوحاً حين تبلغه النقطة', ch)
  # ---- عجلة الدوران
  await run('m4.u9.d2', {'t': 'c9Whl', 'p': [3, -1], 'k': 1, 'q': 'wh.01'}); await wk('tap')
  pr = await pg.evaluate("() => { const ok = [...document.querySelectorAll('#stage svg [role=button]')].filter(g => g.dataset.ok === 'true').map(g => g.getAttribute('aria-label')); return [ok, plain(G(labelText('c4Q.' + c4QuadOf(...c9RotK([3, -1], 1)))))]; }")
  check('C9G', len(pr[0]) == 1 and pr[0][0] == pr[1], 'عجلة الدوران: مفتاح التوقّع ربع الصورة', pr)
  await click('#stage svg [role=button][data-ok=true]'); st = await wk('c9Turn'); await click('#stage .choices.icons .pick', 0); await done(); L = await logs()
  check('C9G', L[:2] == [['c9-wheel-predict', True, True, None], ['c9-wheel', False, True, 'c9WhDir']], 'عجلة الدوران: زرّ «مع العقارب» في جولة الربع خطأ الاتجاه', L)
  st = await wk('c9Turn', nn(st)); await click('#stage .choices.icons .pick', 1); await done(); r = await res(); L = await logs()
  check('C9G', L[2:] == [['c9-wheel', True, False, None]] and r['res'] and r['res']['ok'], 'عجلة الدوران: ثم ربعٌ عكس العقارب صحيح', L)
  await run('m4.u9.d2', {'t': 'c9Whl', 'p': [3, -1], 'k': 1, 'q': 'wh.01'}); await wk('tap'); await click('#stage svg [role=button][data-ok=false]', 0); st = await wk('c9Turn')
  b0 = await pg.evaluate("() => document.querySelectorAll('#stage svg [data-tk][visibility=hidden]').length"); await pg.evaluate(HID); await click('#stage .choices.icons .pick', 1); await pg.wait_for_timeout(700)
  hd = await pg.evaluate("() => { clearInterval(window.__hidIv); return window.__hid; }"); await done(); r = await res(); cl = await pg.evaluate("() => (window.__clips || []).filter(c => /^gen\\.c9\\.wh\\.pred/.test(c))")
  check('C9G', hd >= b0 + 4, 'عجلة الدوران: أعداد المحورين في قرص الذراع تُخفى مدّة الدوران (المراجع B لإغلاق ألعاب U9، 2)', [b0, hd])
  check('C9G', len(cl) == 1 and cl[0].startswith('gen.c9.wh.predNo'), 'عجلة الدوران: التوقّع الخاطئ يقال «لا كما توقّعت» (المراجع B لإغلاق ألعاب U9، 2)', cl)
  # ربعٌ واحد بثلاثة أخطاء: الحلّ المشترك يرسم نصف الطريق ولا يكشفه (المراجع A لإغلاق ألعاب U9، 1)
  await run('m4.u9.d2', {'t': 'c9Whl', 'p': [3, -1], 'k': 1, 'q': 'wh.01'}); await wk('tap'); await click('#stage svg [role=button][data-ok=true]'); st = None
  for _ in range(3): st = await wk('c9Turn', nn(st)); await click('#stage .choices.icons .pick', 0); await done()
  st = await wk('c9Turn', nn(st)); await pg.wait_for_timeout(300); tg = await pg.evaluate("() => [document.querySelectorAll('#stage svg [data-help] path').length, window.__c9K(), (window.__clips || []).filter(c => /^gen\\.c9\\.together\\.wheel/.test(c))]")
  check('C9G', tg[0] > 0 and tg[1] == 0 and len(tg[2]) > 0 and re.match(r'^gen\.c9\.together\.wheel1(_[mf])?$', tg[2][-1]) is not None, 'عجلة الدوران: لربعٍ واحد يرسم الحلّ المشترك نصف الطريق والذراع في مكانها', tg)
  # البطاقة «حتى تنطبق» بلا عددٍ ولا جهة، ونصف الدورة بلا جهة: الخطأ بما على البطاقة (المراجع A لإغلاق ألعاب U9، 2)
  await run('m4.u9.d3', {'t': 'c9Whl', 'p': [-1, -3], 'k': 2, 'q': 'mr.03', 'match': True}); await wk('c9Turn'); await click('#stage .choices.icons .pick', 1); await done(); L = await logs()
  check('C9G', L[:1] == [['c9-wheel-match', False, True, 'c9WhMatch']], 'مرآتان: ربعٌ واحد لا ينطبق خطأ الانطباق لا خطأ الاتجاه', L)
  await run('m4.u9.d2', {'t': 'c9Whl', 'p': [0, 2], 'k': 2, 'q': 'wh.02'}); await wk('c9Turn'); await click('#stage .choices.icons .pick', 0); await done(); L = await logs()
  check('C9G', L[:1] == [['c9-wheel', False, True, 'c9WhShort']], 'عجلة الدوران: ربعٌ مع العقارب لنصف دورةٍ ناقصٌ لا عكس الاتجاه', L)
  await run('m4.u9.d2', {'t': 'c9Whl', 'p': [-3, -2], 'k': 3, 'q': 'wh.03'}); await wk('tap'); await click('#stage svg [role=button][data-ok=true]'); await wk('c9Turn'); await click('#stage .choices.icons .pick', 0); await done(); r = await res(); L = await logs()
  check('C9G', L[1:] == [['c9-wheel', True, True, None]], 'عجلة الدوران: ربعٌ مع العقارب لثلاثة أرباعٍ عكسها صحيح بالتكافؤ', L)
  await run('m4.u9.d2', {'t': 'c9Whl', 'p': [0, 2], 'k': 2, 'q': 'wh.02'}); await wk('c9Turn')
  await pg.evaluate("() => { window.__ticks = 0; if (!SFX.__w) { const o = SFX.tick; SFX.tick = (...a) => { window.__ticks++; return o.apply(SFX, a); }; SFX.__w = 1; } }")
  await pg.evaluate("() => { const b = document.querySelectorAll('#stage .choices.icons .pick')[1]; b.click(); b.click(); }"); await pg.wait_for_timeout(900); kk = await pg.evaluate("() => [window.__c9K(), window.__ticks]"); await done(); L = await logs()
  check('C9G', kk == [2, 2] and L == [['c9-wheel', True, True, None]], 'عجلة الدوران: لمستان متتاليتان تديران ربعين بنقرتين', [kk, L])
  await run('m4.u9.d3', {'t': 'c9Whl', 'p': [-1, -3], 'k': 2, 'q': 'mr.03', 'match': True}); await wk('c9Turn'); await click('#stage .choices.icons .pick', 0); await pg.wait_for_timeout(500); await click('#stage .choices.icons .pick', 0); await done(); L = await logs()
  check('C9G', L == [['c9-wheel-match', True, True, None]], 'مرآتان: نصف دورةٍ مع العقارب ينطبق على الصورة', L)
  # ---- الباب الدوّار
  await run('m4.u9.d3', {'t': 'c9DrC', 'kind': 'door', 'th': 60, 'b': 10, 'q': 'dr.01'}); await wk('tap'); await click('#stage svg [role=button][data-ok=false]'); await pg.wait_for_timeout(1500); L = await logs()
  check('C9G', L[:1] == [['c9-door-centre-door', False, True, 'c9CtrMoved']], 'الباب الدوّار: نقطةٌ تحرّكت مع الباب ليست المركز', L)
  await run('m4.u9.d3', {'t': 'c9DrC', 'kind': 'flag', 'th': 150, 'cw': True, 'b': 10, 'q': 'dr.03'}); st = await wk('tap'); await pg.evaluate("() => { window.__nc0 = (window.__clips || []).length; }"); await click('#stage svg [role=button][data-ok=false]'); await pg.wait_for_timeout(1500); L = await logs()
  check('C9G', L[:1] == [['c9-door-centre-flag', False, True, 'c9CtrOff']], 'الباب الدوّار: مركزٌ لا ينطبق حوله الشفّاف خطأ', L)
  st = await wk('tap', nn(st)); await pg.wait_for_timeout(300); qc = await pg.evaluate("() => [(window.__clips || []).slice(window.__nc0 || 0), Math.min(...[...document.querySelectorAll('#stage svg [role=button] circle')].map(c => c.getBoundingClientRect().width))]")
  check('C9G', any(re.match(r'^gen\.c9\.q\.ctr(_[mf])?$', c) for c in qc[0]) and qc[1] >= 16, 'الباب الدوّار: السؤال يعاد بعد الخطأ، ونقاط المركز 16 بكسلاً فأكثر (المراجع B لإغلاق ألعاب U9، 2)', qc)
  await click('#stage svg [role=button][data-ok=false]', 0); await pg.wait_for_timeout(1500)
  st = await wk('tap', nn(st)); await pg.wait_for_timeout(300); await click('#stage svg [role=button][data-ok=false]', 0); await pg.wait_for_timeout(1500)
  st = await wk('tap', nn(st)); await pg.wait_for_timeout(600)
  lf = await pg.evaluate("() => { const c = b => { const e = document.querySelector('#stage svg [role=button][data-ok=' + b + '] circle'); return e ? +e.getAttribute('cx') : null; }; return [document.querySelectorAll('#stage svg [role=button][data-ok=false]').length, c('false'), c('true')]; }")
  check('C9G', lf[0] == 1 and lf[1] is not None and lf[2] is not None and lf[1] < lf[2], 'الباب الدوّار: الحلّ المشترك يجرّب نقطةً لم يلمسها الطفل ويُبقي التي لمسها (المراجع A لإغلاق ألعاب U9، 8)', lf)
  TOP = "() => { const sv = document.querySelector('#stage svg'), l = sv && sv.lastElementChild, p = sv && sv.querySelector('[data-prot]'), d = sv && sv.querySelector('[data-door]'); return [!!(l && l.matches('[data-prot-lab]')) && !!p && !!d && !!(p.compareDocumentPosition(d) & Node.DOCUMENT_POSITION_FOLLOWING), sv ? sv.querySelectorAll('[data-help]').length : -1]; }"   # الأعداد آخر ما على المسرح، وجسم المنقلة تحت الشكل
  await run('m4.u9.d3', {'t': 'c9DrA', 'kind': 'door', 'th': 60, 'b': 10, 'b0': -20, 'q': 'dr.02'}); st = await wk('c9Prot'); tp = [await pg.evaluate(TOP)]; await done(); L = await logs()
  check('C9G', L[:1] == [['c9-door-angle-door', False, True, 'c9ProtZero']], 'الباب الدوّار: المنقلة وصفرها على غير الخطّين خطأ', L)
  st = await wk('c9Prot', nn(st))
  for _ in range(3): await click('#stage .choices.icons .pick', 1); await pg.wait_for_timeout(120)
  bb = await pg.evaluate("() => window.__c9B()"); await done(); st = await wk('num'); await pg.evaluate("() => { const b = [...document.querySelectorAll('#stage .choices.nums button')].find(b => +b.dataset.k === 120); if (b) b.click(); }"); await pg.wait_for_timeout(900); L = await logs()
  check('C9G', bb == 10 and L[1:] == [['c9-door-angle-door', False, False, 'c9AngSup']], 'الباب الدوّار: المنقلة تدور بالزرّين، وقراءة التدريج الآخر خطأ c9AngSup', [bb, L])
  la = st['auto']['n']; s3 = await until(pg, lambda s: s['res'] or (s['auto'] and s['auto']['n'] != la))
  check('C9G', s3['auto'] and s3['auto']['kind'] == 'num', 'الباب الدوّار: المنقلة الموضوعة صحيحاً تبقى، فالمحاولة التالية قراءةٌ فقط (المراجع A لإغلاق ألعاب U9، 8)', s3['auto'])
  await pg.wait_for_timeout(400); tp.append(await pg.evaluate(TOP)); await pg.evaluate("() => { const b = [...document.querySelectorAll('#stage .choices.nums button')].find(b => +b.dataset.k === 120); if (b) b.click(); }")
  s4 = await until(pg, lambda s: s['res'] or (s['auto'] and s['auto']['n'] != s3['auto']['n'])); await pg.wait_for_timeout(400); tp.append(await pg.evaluate(TOP))
  await pg.evaluate("() => { const b = [...document.querySelectorAll('#stage .choices.nums button')].find(b => +b.dataset.k === 120); if (b) b.click(); }"); r = await res(); await pg.wait_for_timeout(300); tp.append(await pg.evaluate(TOP))
  check('C9G', [t[0] for t in tp] == [True] * 4 and tp[1][1] > 0 and tp[2][1] > 0 and r['res'] and r['res']['ok'] is False, 'الباب الدوّار: أعداد المنقلة فوق كل رسمٍ في المحاولة الأولى والدرجتين الثانية والثالثة والكشف (المراجع B لإغلاق ألعاب U9، 1)', [tp, r['res']])
  await run('m4.u9.d3', {'t': 'c9DrA', 'kind': 'flag', 'th': 150, 'cw': True, 'b': 10, 'b0': 40, 'q': 'dr.04'}); st = await wk('c9Prot')
  for _ in range(6): await click('#stage .choices.icons .pick', 0); await pg.wait_for_timeout(120)
  bb = await pg.evaluate("() => window.__c9B()"); await done(); st = await wk('num'); await pg.evaluate("() => { const b = [...document.querySelectorAll('#stage .choices.nums button')].find(b => +b.dataset.k === 150); if (b) b.click(); }"); r = await res(); L = await logs()
  check('C9G', bb == -20 and L == [['c9-door-angle-flag', True, True, None]], 'الباب الدوّار: صفر التدريج الداخلي على الخطّ الآخر صحيح', [bb, L])
  # ---- الدروس الثلاثة: كل جولةٍ بأربعة أخطاء ثم الكشف، والجولات كلها تنتهي (الدرجات الثانية والثالثة والكشف تُرسم بلا استثناء)
  for lid in ('m4.u9.d1', 'm4.u9.d2', 'm4.u9.d3'):
    for i in await pg.evaluate("(lid) => LDATA[lid].flow.map((s, i) => s.scene === 'motion' ? i : -1).filter(i => i >= 0)", lid):
      await pg.evaluate("() => { LOG.attempts.length = 0; }"); await pg.evaluate(START, [lid, i, 'game']); last = None
      for _ in range(200):
        s2 = await until(pg, lambda s: s['res'] or s['err'] or (s['auto'] and s['auto']['n'] != last), 20000)
        if s2['res'] or s2['err'] or not s2['auto']: break
        last = s2['auto']['n']; await pg.wait_for_timeout(120)
        await pg.evaluate("() => { const a = window.__auto; if (a) (a.wrong || a.ok)(); }")
      L = await logs(); per = {}
      for x in L:
        if x[0] != 'c9-wheel-predict' and x[1] is False: per[x[0]] = per.get(x[0], 0) + 1
      items = await pg.evaluate("([lid, i]) => LDATA[lid].flow[i].items.length", [lid, i])
      check('C9G', s2['res'] and not s2['err'] and sum(per.values()) == 4 * items, '%s (%d): كل جولةٍ بأربعة أخطاء حتى الكشف بلا خطأ في الصفحة' % (lid, i), [s2['res'], s2['err'], per])
  check('C9G', not errs, 'بلا خطأ في الصفحة', errs[:2]); await ctx.close()

# M4-U8 الألعاب الحركية (خطة ألعاب المرحلة 4): صائد المنصّف (الفرجار خطوةً خطوة)، وأين المنتصف؟ (العمود المنصّف)، وصائد الوتر (الوتر ثم النسبة)
async def c8g(b):
  """ألعاب M4-U8 الحركية (D288 (2)): الخطأ المقصود في كل خطوة، والخطوات المنجزة تبقى بعد الخطأ، والحلّ المشترك من حيث وقف الطفل،
  والقراءة الخاطئة بوسمها، والدرجات الأربع حتى الكشف في كل جولةٍ من الدروس الثلاثة بلا خطأ في الصفحة"""
  ctx, pg, errs = await page(b)
  async def run(lid, spec): await pg.evaluate("() => { LOG.attempts.length = 0; }"); await pg.evaluate(START, [lid, spec, 'practice'])
  async def logs(): return await pg.evaluate("() => LOG.attempts.filter(x => /^c8-/.test(x.tag || '')).map(x => [x.tag, x.ok, x.firstTry === undefined ? null : x.firstTry, x.err || null])")
  async def wk(kind, after=-1): return await until(pg, lambda s: s['res'] or (s['auto'] and s['auto']['kind'] == kind and s['auto']['n'] != after))
  async def res(): return await until(pg, lambda s: s['res'] or s['err'], 30000)
  nn = lambda st: st['auto']['n'] if st and st.get('auto') else -1
  HAS = "(P) => !![...document.querySelectorAll('#stage svg [role=button]')].find(g => { const c = g.querySelector('circle'); return c && Math.hypot(+c.getAttribute('cx') - P[0], +c.getAttribute('cy') - P[1]) < 1.5; })"
  async def tap(P, st):   # يلمس الهدف الذي مركزه P، وينتظر السؤال التالي
    ok = await pg.evaluate("(P) => { const t = [...document.querySelectorAll('#stage svg [role=button]')].find(g => { const c = g.querySelector('circle'); return c && Math.hypot(+c.getAttribute('cx') - P[0], +c.getAttribute('cy') - P[1]) < 1.5; }); if (t) t.dispatchEvent(new MouseEvent('click', { bubbles: true })); return !!t; }", P)
    await pg.wait_for_timeout(250); return ok
  async def tapw(P, st): ok = await tap(P, st); s2 = await until(pg, lambda s: s['res'] or s['err'] or (s['auto'] and s['auto']['n'] != nn(st)), 20000); return ok, s2
  async def num(v): await pg.evaluate("(v) => { const b = [...document.querySelectorAll('#stage .choices.nums button')].find(b => +b.dataset.k === v); if (b) b.click(); }", v); await pg.wait_for_timeout(700)
  helps = "() => document.querySelectorAll('#stage svg [data-help] *').length"
  # ---- صائد المنصّف: خطأ الرأس، ثم القوس من الرأس، والخطوة المنجزة تبقى، والحلّ المشترك من التقاطع
  spec = {'t': 'c8BisMake', 'deg': 72, 'q': 'gen.c8.q.bisV'}; await run('m4.u8.d1', spec); G = await pg.evaluate("(s) => c8BisGeo(s)", spec); st = await wk('tap')
  ok, st = await tapw(G['F1'], st); L = await logs()
  check('C8G', ok and L[:1] == [['c8-bis-make', False, True, 'c8BisNotV']], 'صائد المنصّف: الفرجار على غير الرأس خطأ c8BisNotV', [ok, L])
  ok1, st = await tapw(G['V'], st); ok2, st = await tapw(G['V'], st); L = await logs()
  check('C8G', ok1 and ok2 and L[1:] == [['c8-bis-make', False, False, 'c8BisArcV']], 'صائد المنصّف: القوس الثاني من الرأس خطأ c8BisArcV', [ok1, ok2, L])
  has = await pg.evaluate(HAS, G['A']); h = await pg.evaluate("() => document.querySelectorAll('#stage svg path').length")
  check('C8G', has, 'صائد المنصّف: القوس الأول باقٍ بعد الخطأ، فالسؤال من نقطتي التقاطع', [has, h])
  ok1, st = await tapw(G['A'], st); ok2, st = await tapw(G['V'], st); await pg.wait_for_timeout(600)
  tg = await pg.evaluate("([X, Y]) => [(" + HAS + ")(X), (" + HAS + ")(Y), (window.__clips || []).some(c => /^gen\\.c8\\.together\\.bisMake/.test(c))]", [G['X'], G['Y']])
  check('C8G', ok1 and ok2 and tg == [True, True, True], 'صائد المنصّف: الحلّ المشترك يرسم الأقواس ويترك التقاطع للطفل', [ok1, ok2, tg])
  ok, st = await tapw(G['Y'], st); r = await res(); L = await logs()
  check('C8G', ok and r['res'] and r['res']['ok'] is False and not r['err'] and L[-1][3] == 'c8BisCross' and len(L) == 4, 'صائد المنصّف: شبيه التقاطع خطأ c8BisCross، ثم الكشف بلا خطأ', [r['res'], r['err'], L])
  # القراءة: الزاوية كلها خطأٌ بوسمه، ثم الحلّ المشترك في القراءة وحدها يعلّم النصف على التدريج
  spec = {'t': 'c8BisMake', 'deg': 124, 'q': 'gen.c8.q.bisV'}; await run('m4.u8.d1', spec); G = await pg.evaluate("(s) => c8BisGeo(s)", spec); st = await wk('tap')
  for k in ('V', 'A', 'B', 'X'): ok, st = await tapw(G[k], st)
  ch = await pg.evaluate("() => c8HalfCh({ deg: 124, ask: 'half', rk: 0 })"); bad = [c for c in ch if c[0] != 62]
  check('C8G', st['auto'] and st['auto']['kind'] == 'num' and len(bad) >= 2, 'صائد المنصّف: الخطوات الأربع ثم القراءة', [st['auto'], ch])
  for i in range(3):
    await num(bad[i % len(bad)][0]); st = await until(pg, lambda s: s['res'] or (s['auto'] and s['auto']['n'] != nn(st)), 20000)
  L = await logs(); await pg.wait_for_timeout(500); hp = await pg.evaluate(helps); cl = await pg.evaluate("() => (window.__clips || []).filter(c => /^gen\\.c8\\.together/.test(c))")
  check('C8G', [x[3] for x in L] == [bad[0][1], bad[1][1], bad[0][1] if len(bad) < 3 else bad[2][1]] and st['auto'] and st['auto']['kind'] == 'num' and hp > 0 and len(cl) == 1 and cl[0].startswith('gen.c8.together.bisRead'),
        'صائد المنصّف: القراءة الخاطئة بوسمها، والمنصّف باقٍ، والحلّ المشترك يعلّم النصف على التدريج', [L, st['auto'], hp, cl])
  await num(62); r = await res(); L = await logs()
  check('C8G', r['res'] and r['res']['ok'] and L[-1] == ['c8-bis-make', True, False, None], 'صائد المنصّف: ثم القراءة الصحيحة', [r['res'], L])
  # ---- أين المنتصف؟
  spec = {'t': 'c8PbMake', 'half': 30, 'h': 16, 'q': 'gen.c8.q.pbEnd1'}; await run('m4.u8.d2', spec); G = await pg.evaluate("(s) => c8PbGeo(s)", spec); st = await wk('tap')
  ok, st = await tapw(G['M'], st); L = await logs()
  check('C8G', ok and L[:1] == [['c8-pb-make', False, True, 'c8PbNotEnd']], 'أين المنتصف؟: الفرجار على المنتصف قبل رسمه خطأ c8PbNotEnd', [ok, L])
  for k in ('B', 'A'): ok, st = await tapw(G[k], st)
  ok, st = await tapw(G['Z'], st); L = await logs()
  check('C8G', ok and L[1:] == [['c8-pb-make', False, False, 'c8PbCross']], 'أين المنتصف؟: البدء بالطرف الآخر صحيح، ونقطةٌ ليست تقاطعاً خطأ c8PbCross', [ok, L])
  has = await pg.evaluate(HAS, G['X1']); check('C8G', has, 'أين المنتصف؟: القوسان باقيان بعد الخطأ، فالسؤال عن التقاطع', has)
  for k in ('X2', 'X1'): ok, st = await tapw(G[k], st)
  check('C8G', st['auto'] and st['auto']['kind'] == 'num', 'أين المنتصف؟: التقاطعان بأيّ ترتيب ثم القراءة', st['auto'])
  ch = await pg.evaluate("(s) => ITEM.c8PbMake.make(s).ch", spec); bad = [c for c in ch if c[0] != 34]
  await num(bad[0][0]); st = await until(pg, lambda s: s['res'] or (s['auto'] and s['auto']['n'] != nn(st)), 20000); L = await logs(); await pg.wait_for_timeout(500); hp = await pg.evaluate(helps)
  cl = await pg.evaluate("() => (window.__clips || []).filter(c => /^gen\\.c8\\.together/.test(c))")
  check('C8G', len(L) == 3 and L[-1][3] == bad[0][1] and hp > 0 and len(cl) == 1 and cl[0].startswith('gen.c8.together.pbRead'), 'أين المنتصف؟: القراءة الخاطئة بوسمها، والحلّ المشترك في القراءة يعلّم البعدين متساويين', [L, ch, hp, cl])
  await num(34); r = await res(); L = await logs()
  check('C8G', r['res'] and r['res']['ok'] and L[-1] == ['c8-pb-make', True, False, None], 'أين المنتصف؟: ثم ن ب = ن أ', [r['res'], L])
  # ---- صائد الوتر
  spec = {'t': 'c8HypHunt', 'a': 24, 'b': 7, 'hy': 25, 'fn': 'sin', 'q': 'gen.c8.q.hypTap'}; await run('m4.u8.d3', spec); st = await wk('tap')
  await pg.evaluate("() => { const t = [...document.querySelectorAll('#stage svg [role=button]')].find(g => g.dataset.ok === 'false'); if (t) t.dispatchEvent(new MouseEvent('click', { bubbles: true })); }"); await pg.wait_for_timeout(900); L = await logs()
  check('C8G', L[:1] == [['c8-hyp-sin', False, True, 'c8HypLeg']], 'صائد الوتر: ضلعٌ قائم خطأ c8HypLeg', L)
  st = await wk('tap', nn(st)); await pg.evaluate("() => { const t = document.querySelector('#stage svg [role=button][data-ok=true]'); if (t) t.dispatchEvent(new MouseEvent('click', { bubbles: true })); }")
  st = await wk('pick', nn(st)); w = await pg.evaluate("() => c8RatioCh({ a: 24, b: 7, hy: 25, fn: 'sin' })")
  check('C8G', st['auto'] and st['auto']['kind'] == 'pick', 'صائد الوتر: لمس الوتر ثم النسبة', [st['auto'], w])
  await pg.evaluate("(v) => { const b = [...document.querySelectorAll('#stage .choices .pick')].find(b => b.dataset.k === v); if (b) b.click(); }", str(w[0][0])); r = await res(); L = await logs()
  check('C8G', r['res'] and r['res']['ok'] and L[-1] == ['c8-hyp-sin', True, False, None], 'صائد الوتر: ثم النسبة الصحيحة', [r['res'], L])
  # ---- الدروس الثلاثة: كل جولةٍ بأربعة أخطاء ثم الكشف، والجولات كلها تنتهي
  for lid in ('m4.u8.d1', 'm4.u8.d2', 'm4.u8.d3'):
    for i in await pg.evaluate("(lid) => LDATA[lid].flow.map((s, i) => s.scene === 'motion' ? i : -1).filter(i => i >= 0)", lid):
      await pg.evaluate("() => { LOG.attempts.length = 0; }"); await pg.evaluate(START, [lid, i, 'game']); last = None
      for _ in range(200):
        s2 = await until(pg, lambda s: s['res'] or s['err'] or (s['auto'] and s['auto']['n'] != last), 20000)
        if s2['res'] or s2['err'] or not s2['auto']: break
        last = s2['auto']['n']; await pg.wait_for_timeout(120)
        await pg.evaluate("() => { const a = window.__auto; if (a) (a.wrong || a.ok)(); }")
      L = await logs(); per = {}
      for x in L:
        if x[1] is False: per[x[0]] = per.get(x[0], 0) + 1
      items = await pg.evaluate("([lid, i]) => LDATA[lid].flow[i].items.length", [lid, i])
      check('C8G', s2['res'] and not s2['err'] and sum(per.values()) == 4 * items, '%s (%d): كل جولةٍ بأربعة أخطاء حتى الكشف بلا خطأ في الصفحة' % (lid, i), [s2['res'], s2['err'], per])
  check('C8G', not errs, 'بلا خطأ في الصفحة', errs[:2]); await ctx.close()

# M4-U6 الألعاب الحركية (خطة ألعاب المرحلة 4): وتر الدائرة، والمماس، وأين المركز؟
async def c6g(b):
  """ألعاب M4-U6 الحركية (D288 (2)): يحرّك الوتر والمسطرة بزرّين، ويجد المركز ويقرأ المنقلة. الخطأ المقصود في كل خطوة، والخطوات تبقى بعد الخطأ،
  والحلّ المشترك من حيث وقف الطفل، والدرجات الأربع حتى الكشف في كل جولةٍ من الدروس الثلاثة بلا خطأ في الصفحة"""
  ctx, pg, errs = await page(b)
  async def run(lid, spec): await pg.evaluate("() => { LOG.attempts.length = 0; }"); await pg.evaluate(START, [lid, spec, 'practice'])
  async def logs(): return await pg.evaluate("() => LOG.attempts.filter(x => /^c6-/.test(x.tag || '')).map(x => [x.tag, x.ok, x.firstTry === undefined ? null : x.firstTry, x.err || null])")
  async def wk(kind, after=-1): return await until(pg, lambda s: s['res'] or (s['auto'] and s['auto']['kind'] == kind and s['auto']['n'] != after))
  async def res(): return await until(pg, lambda s: s['res'] or s['err'], 30000)
  nn = lambda st: st['auto']['n'] if st and st.get('auto') else -1
  async def nxt(st): return await until(pg, lambda s: s['res'] or s['err'] or (s['auto'] and s['auto']['n'] != nn(st)), 20000)
  async def press(i, k):
    for _ in range(k): await pg.evaluate("(i) => { const b = document.querySelectorAll('#stage .choices.icons .pick')[i]; if (b) b.click(); }", i); await pg.wait_for_timeout(40)
  async def done(): await pg.wait_for_timeout(200); await pg.evaluate("() => { const d = document.querySelector('#stage .pick.done'); if (d) d.click(); }"); await pg.wait_for_timeout(400)
  async def num(v): await pg.evaluate("(v) => { const b = [...document.querySelectorAll('#stage .choices.nums button')].find(b => +b.dataset.k === v); if (b) b.click(); }", v); await pg.wait_for_timeout(600)
  helps = "() => document.querySelectorAll('#stage svg [data-help] *').length"
  # ---- وتر الدائرة
  spec = {'t': 'c6ChordGame', 'r': 15, 'L': 24, 'd0': 6, 'q': 'cg.01'}; await run('m4.u6.d1', spec); st = await wk('c6Move')
  await press(1, 2); await done(); L = await logs()
  check('C6G', L[:1] == [['c6-chord-dist', False, True, 'c6ChordLen']], 'وتر الدائرة: الطول غير المطلوب خطأ c6ChordLen', L)
  st = await wk('c6Move', nn(st)); k0 = await pg.evaluate("() => window.__c6K()"); await press(1, 3); await done(); st = await wk('num', nn(st)); await num(12); L = await logs()
  check('C6G', k0 == 6 and L[1:] == [['c6-chord-dist', False, False, 'c6HalfDist']], 'وتر الدائرة: من موضعه الأول، ثم نصف الوتر بُعداً خطأ c6HalfDist', [k0, L])
  st = await nxt(st); await pg.wait_for_timeout(300); hp = await pg.evaluate(helps); k3 = st['auto']['kind'] if st['auto'] else None; await num(9); r = await res(); L = await logs()
  check('C6G', k3 == 'num' and hp > 0 and r['res'] and r['res']['ok'] and L[-1] == ['c6-chord-dist', True, False, None], 'وتر الدائرة: الموضع باقٍ بعد الخطأ والمستوى الثاني منقول، ثم البعد', [k3, hp, r['res'], L])
  await run('m4.u6.d1', spec); st = await wk('c6Move')
  for _ in range(3): await press(1, 1); await done(); st = await wk('c6Move', nn(st))
  await pg.wait_for_timeout(300); tm = await pg.evaluate("() => [window.__c6K(), (window.__clips || []).filter(c => /^gen\\.c6\\.together\\.move/.test(c)).length]")
  check('C6G', tm == [8, 1], 'وتر الدائرة: الحلّ المشترك حركةٌ قبل الموضع', tm)
  spec = {'t': 'c6ChordGame', 'r': 6, 'd0': 3, 'q': 'cg.03'}; await run('m4.u6.d1', spec); st = await wk('c6Move'); await press(0, 2); await done(); L = await logs()
  st = await wk('c6Move', nn(st)); await press(0, 3); await done(); st = await wk('num', nn(st))
  lk = await pg.evaluate("() => [...document.querySelectorAll('#stage svg text')].some(t => t.textContent.replace(/\\s/g, '') === MS('12'))")
  await num(12); r = await res(); L2 = await logs()
  check('C6G', L[:1] == [['c6-chord-diam', False, True, 'c6NotDiam']] and not lk and r['res'] and r['res']['ok'], 'وتر الدائرة: أطول وترٍ يمرّ بالمركز، ولا يُكتب طوله قبل الجواب', [L, lk, L2])
  # ---- المماس
  spec = {'t': 'c6TanGame', 'mode': 'slide', 'a': 270, 'q': 'tg.01'}; await run('m4.u6.d2', spec); st = await wk('c6Move')
  await press(1, 2); await done(); st = await wk('c6Move', nn(st)); await press(1, 6); await done(); L = await logs()
  check('C6G', [x[3] for x in L] == ['c6Secant', 'c6Miss'], 'المماس: قاطعٌ ثم بعيدٌ عن الدائرة، كلٌّ بوسمه', L)
  st = await wk('c6Move', nn(st)); await press(1, 4); await done(); st = await wk('num', nn(st)); await num(180); st = await nxt(st); await pg.wait_for_timeout(300)
  tg = await pg.evaluate("() => [document.querySelectorAll('#stage svg [data-help] *').length, (window.__clips || []).filter(c => /^gen\\.c6\\.together\\.tanAng/.test(c)).length]"); await num(90); r = await res(); L = await logs()
  check('C6G', len(L) > 2 and L[2][3] == 'c6TanStraight' and tg[0] > 0 and tg[1] == 1 and r['res'] and r['res']['ok'], 'المماس: الزاوية المستقيمة خطأ، والحلّ المشترك يضع الزاوية القائمة، ثم 90', [L, tg, r['res']])
  spec = {'t': 'c6TanGame', 'mode': 'pivot', 'op': 10, 'q': 'tg.03'}; await run('m4.u6.d2', spec); st = await wk('c6Move'); await press(1, 3); await done(); st = await wk('num', nn(st)); await num(8); r = await res(); L = await logs()
  check('C6G', L == [['c6-tan-pivot', True, True, None]], 'المماس: المسطرة تدور حتى تلامس، وطول المماس 8', L)
  # ---- أين المركز؟
  spec = {'t': 'c6CenGame', 'cen': 100, 'q': 'cn.01'}; await run('m4.u6.d3', spec); st = await wk('tap')
  await pg.evaluate("() => { const t = document.querySelector('#stage svg [role=button][data-ok=false]'); if (t) t.dispatchEvent(new MouseEvent('click', { bubbles: true })); }"); await pg.wait_for_timeout(900); L = await logs()
  check('C6G', L[:1] == [['c6-center', False, True, 'c6NotCenter']], 'أين المركز؟: نقطةٌ ليست المركز خطأ c6NotCenter', L)
  st = await wk('tap', nn(st)); await pg.evaluate("() => { const t = document.querySelector('#stage svg [role=button][data-ok=true]'); if (t) t.dispatchEvent(new MouseEvent('click', { bubbles: true })); }")
  st = await wk('num', nn(st)); await num(80); L = await logs(); st = await nxt(st); k3 = st['auto']['kind'] if st['auto'] else None
  check('C6G', L[1:] == [['c6-center', False, False, 'c6ReadOther']] and k3 == 'num', 'أين المركز؟: التدريج الآخر خطأ، والمركز باقٍ بعد الخطأ', [L, k3])
  await num(100); st = await wk('num', nn(st)); await num(100); L = await logs(); st = await nxt(st); await pg.wait_for_timeout(300)
  tr = await pg.evaluate("() => (window.__clips || []).filter(c => /^gen\\.c6\\.together\\.read/.test(c)).length"); await num(50); r = await res(); L2 = await logs()
  check('C6G', len(L) > 0 and L[-1][3] == 'c6InsEq' and tr == 1 and r['res'] and r['res']['ok'], 'أين المركز؟: المحيطية مثل المركزية خطأ، والحلّ المشترك في القراءة، ثم نصفها', [L, tr, L2])
  await run('m4.u6.d3', spec); st = await wk('tap')
  for _ in range(3): await pg.evaluate("() => { const t = document.querySelector('#stage svg [role=button][data-ok=false]'); if (t) t.dispatchEvent(new MouseEvent('click', { bubbles: true })); }"); st = await wk('tap', nn(st))
  await pg.wait_for_timeout(400); rm = await pg.evaluate("() => document.querySelectorAll('#stage svg [role=button][data-ok=false]').length")
  check('C6G', rm == 1, 'أين المركز؟: الحلّ المشترك يجرّب نقطةً ويُبقي اثنتين', rm)
  # ---- الدروس الثلاثة: كل جولةٍ بأربعة أخطاء ثم الكشف
  for lid in ('m4.u6.d1', 'm4.u6.d2', 'm4.u6.d3'):
    for i in await pg.evaluate("(lid) => LDATA[lid].flow.map((s, i) => s.scene === 'motion' ? i : -1).filter(i => i >= 0)", lid):
      await pg.evaluate("() => { LOG.attempts.length = 0; }"); await pg.evaluate(START, [lid, i, 'game']); last = None
      for _ in range(200):
        s2 = await until(pg, lambda s: s['res'] or s['err'] or (s['auto'] and s['auto']['n'] != last), 20000)
        if s2['res'] or s2['err'] or not s2['auto']: break
        last = s2['auto']['n']; await pg.wait_for_timeout(120)
        await pg.evaluate("() => { const a = window.__auto; if (a) (a.wrong || a.ok)(); }")
      L = await logs(); per = {}
      for x in L:
        if x[1] is False: per[x[0]] = per.get(x[0], 0) + 1
      items = await pg.evaluate("([lid, i]) => LDATA[lid].flow[i].items.length", [lid, i])
      check('C6G', s2['res'] and not s2['err'] and sum(per.values()) == 4 * items, '%s (%d): كل جولةٍ بأربعة أخطاء حتى الكشف بلا خطأ في الصفحة' % (lid, i), [s2['res'], s2['err'], per])
  check('C6G', not errs, 'بلا خطأ في الصفحة', errs[:2]); await ctx.close()

# M4-U7 الألعاب الحركية (خطة ألعاب المرحلة 4): كوب الماء، وغلّف العلبة، وثلاثة مخاريط وأسطوانة، ومحوّل الخزان
async def c7g(b):
  """ألعاب M4-U7 الحركية (D288 (2)): يملأ ويصبّ ويغلّف ثم يحسب. الخطأ المقصود في كل خطوة، والخطوات المنجزة تبقى بعد الخطأ،
  والمستوى الثاني منقول، والحلّ المشترك من حيث وقف الطفل، والدرجات الأربع حتى الكشف في كل جولةٍ من الدروس الأربعة بلا خطأ في الصفحة"""
  ctx, pg, errs = await page(b)
  async def run(lid, spec): await pg.evaluate("() => { LOG.attempts.length = 0; }"); await pg.evaluate(START, [lid, spec, 'practice'])
  async def logs(): return await pg.evaluate("() => LOG.attempts.filter(x => /^c7-/.test(x.tag || '')).map(x => [x.tag, x.ok, x.firstTry === undefined ? null : x.firstTry, x.err || null])")
  async def wk(kind, after=-1): return await until(pg, lambda s: s['res'] or (s['auto'] and s['auto']['kind'] == kind and s['auto']['n'] != after))
  async def res(): return await until(pg, lambda s: s['res'] or s['err'], 30000)
  nn = lambda st: st['auto']['n'] if st and st.get('auto') else -1
  async def nxt(st): return await until(pg, lambda s: s['res'] or s['err'] or (s['auto'] and s['auto']['n'] != nn(st)), 20000)
  async def press(i, k):
    for _ in range(k): await pg.evaluate("(i) => { const b = document.querySelectorAll('#stage .choices.icons .pick')[i]; if (b) b.click(); }", i); await pg.wait_for_timeout(40)
  async def done(): await pg.wait_for_timeout(200); await pg.evaluate("() => { const d = document.querySelector('#stage .pick.done'); if (d) d.click(); }"); await pg.wait_for_timeout(400)
  async def pick(v): await pg.evaluate("(v) => { const b = [...document.querySelectorAll('#stage .choices .pick, #stage .choices.nums button')].find(b => b.dataset.k === v); if (b) b.click(); }", str(v)); await pg.wait_for_timeout(500)
  async def face(*fs):
    for f in fs: await pg.evaluate("(f) => { const g = document.querySelector('#stage svg [data-face=' + f + ']'); if (g) g.dispatchEvent(new MouseEvent('click', { bubbles: true })); }", f); await pg.wait_for_timeout(60)
  helps = "() => document.querySelectorAll('#stage svg [data-help] *').length"
  clip = lambda rx: "() => (window.__clips || []).filter(c => /%s/.test(c))" % rx
  # ---- كوب الماء: يتوقّف قبل الحافّة، ثم الكأس يُقرأ بعيداً، ثم القانون، والخطوات تبقى
  spec = {'t': 'c7Cup', 'r': 2, 'h': 7, 'q': 'cp.01'}; M = await pg.evaluate("(s) => ITEM.c7Cup.make(s)", spec); await run('m4.u7.d1', spec); st = await wk('c7Fill')
  await press(1, 5); await done(); L = await logs()
  check('C7G', L[:1] == [['c7-cup', False, True, 'c7FillShort']], 'كوب الماء: «تمّ» قبل الحافّة خطأ c7FillShort', L)
  st = await wk('c7Fill', nn(st)); n0 = await pg.evaluate("() => window.__c7N()"); await press(1, 7); await done(); st = await wk('pick', nn(st))
  jw = await pg.evaluate("() => [...document.querySelectorAll('#stage svg rect')].filter(r => r.getAttribute('fill') === C7.water && +r.getAttribute('x') > 200).length")
  check('C7G', n0 == 0 and st['auto'] and st['auto']['kind'] == 'pick' and jw > 0, 'كوب الماء: يملأ من جديد، والماء في الكأس بعد الملء', [n0, st['auto'], jw])
  bad = [v for v in M['reads'] if v != M['read']]; await pick(bad[0]); L = await logs()
  check('C7G', L[1:] == [['c7-cup', False, False, 'c7JugRead']], 'كوب الماء: قراءة الكأس بعيداً عن سطح الماء خطأ c7JugRead', L)
  st = await nxt(st); await pg.wait_for_timeout(300); hp = await pg.evaluate(helps)
  check('C7G', st['auto'] and st['auto']['kind'] == 'pick' and hp > 0, 'كوب الماء: الملء باقٍ بعد الخطأ فالمحاولة تبدأ من الكأس، والمستوى الثاني منقول', [st['auto'], hp])
  await pick(M['read']); st = await wk('pick', nn(st)); badl = [c for c in M['ch'] if c[0] != M['want']][0]; await pick(badl[0]); L = await logs()
  check('C7G', L[-1] == ['c7-cup', False, False, badl[1]], 'كوب الماء: القانون الخاطئ بوسمه', [L, badl])
  st = await nxt(st); await pg.wait_for_timeout(400); tg = await pg.evaluate("() => [document.querySelectorAll('#stage svg [data-help] text').length, (window.__clips || []).filter(c => /^gen\\.c7\\.together\\.vol/.test(c)).length]")
  await pick(M['want']); r = await res(); L = await logs()
  check('C7G', tg[0] > 0 and tg[1] == 1 and r['res'] and r['res']['ok'] and L[-1] == ['c7-cup', True, False, None], 'كوب الماء: الحلّ المشترك يكتب الحساب في خطوة القانون، ثم الصحيح', [tg, r['res'], L])
  await run('m4.u7.d1', spec); st = await wk('c7Fill')
  for _ in range(3): await press(1, 1); await done(); st = await wk('c7Fill', nn(st))
  await pg.wait_for_timeout(300); tf = await pg.evaluate("() => [window.__c7N(), (window.__clips || []).filter(c => /^gen\\.c7\\.together\\.fill/.test(c)).length]")
  check('C7G', tf == [6, 1], 'كوب الماء: الحلّ المشترك في الملء يقف قبل الحافّة بطبقة', tf)
  await press(1, 1); await done(); st = await nxt(st); check('C7G', st['auto'] and st['auto']['kind'] == 'pick' and await pg.evaluate("() => (window.__clips || []).some(c => /^gen\\.c7\\.q\\.cupRead/.test(c))"), 'كوب الماء: ثم يُصبّ في الكأس ويُسأل عن قراءته', st['auto'])
  # ---- غلّف العلبة: الجانب وحده، ثم بلا جانب، ثم الطول، والحلّ المشترك
  spec = {'t': 'c7Wrap', 'r': 2, 'h': 6, 'q': 'wr.01'}; M = await pg.evaluate("(s) => ITEM.c7Wrap.make(s)", spec); await run('m4.u7.d2', spec); st = await wk('c7Wrap')
  await face('side'); await done(); L = await logs()
  check('C7G', L[:1] == [['c7-wrap', False, True, 'saOneBase']], 'غلّف العلبة: الجانب وحده ينسى القاعدتين (saOneBase)', L)
  st = await wk('c7Wrap', nn(st)); await face('lid', 'base'); await done(); L = await logs()
  check('C7G', L[1:] == [['c7-wrap', False, False, 'saNoSide']], 'غلّف العلبة: القاعدتان بلا الجانب خطأ saNoSide', L)
  st = await wk('c7Wrap', nn(st)); await face('lid', 'side', 'base'); await done(); st = await wk('pick', nn(st)); bl = [c for c in M['lens'] if c[0] != M['len']][0]; await pick(bl[0]); L = await logs()
  check('C7G', L[-1] == ['c7-wrap', False, False, bl[1]], 'غلّف العلبة: الوجوه الثلاثة ثم الطول الخاطئ بوسمه', [L, bl])
  st = await nxt(st); await pg.wait_for_timeout(300); tg = await pg.evaluate("() => [document.querySelectorAll('#stage svg [data-face][role=button]').length, document.querySelectorAll('#stage svg [data-help] text').length]")
  await pick(M['len']); st = await wk('pick', nn(st)); await pick(M['want']); r = await res(); L = await logs()
  check('C7G', tg[0] == 0 and tg[1] > 0 and r['res'] and r['res']['ok'] and L[-1] == ['c7-wrap', True, False, None], 'غلّف العلبة: التغليف باقٍ بعد الخطأ، والحلّ المشترك في الطول، ثم الورق كله', [tg, r['res'], L])
  spec = {'t': 'c7Wrap', 'r': 2, 'h': 7, 'lid': False, 'q': 'wr.03'}; M = await pg.evaluate("(s) => ITEM.c7Wrap.make(s)", spec); await run('m4.u7.d2', spec); st = await wk('c7Wrap')
  fs = await pg.evaluate("() => [...document.querySelectorAll('#stage svg [data-face]')].map(g => g.dataset.face).sort()"); await face('side', 'base'); await done(); st = await wk('pick', nn(st)); await pick(M['len']); st = await wk('pick', nn(st))
  lid = [c for c in M['ch'] if c[1] == 'saLidAdd']; await pick(lid[0][0] if lid else -1); L = await logs()
  check('C7G', fs == ['base', 'side'] and bool(lid) and L == [['c7-wrap-open', False, True, 'saLidAdd']], 'غلّف العلبة: العلبة بلا غطاء وجهان، وإضافة الغطاء في الورق خطأ saLidAdd', [fs, M['ch'], L])
  # ---- ثلاثة مخاريط وأسطوانة
  spec = {'t': 'c7Thirds', 'fig': 'cone', 'V': 36, 'q': 'th.01'}; M = await pg.evaluate("(s) => ITEM.c7Thirds.make(s)", spec); await run('m4.u7.d3', spec); st = await wk('c7Pour')
  await press(1, 2); await done(); st = await wk('c7Pour', nn(st)); await press(1, 4); await done(); L = await logs()
  check('C7G', [x[3] for x in L] == ['c7PourShort', 'c7PourOver'], 'ثلاثة مخاريط: تعبئتان قبل الامتلاء خطأ، وأربعٌ تفيض خطأ', L)
  st = await wk('c7Pour', nn(st)); await press(1, 3); await done(); st = await wk('pick', nn(st)); bt = [c for c in M['ch'] if c[0] != M['want']][0]; await pick(bt[0])
  st = await nxt(st); await pg.wait_for_timeout(300); k4 = st['auto']['kind'] if st['auto'] else None; await pick(M['want']); r = await res(); L = await logs()
  check('C7G', L[2][3] == bt[1] and k4 == 'pick' and r['res'] and r['res']['ok'], 'ثلاثة مخاريط: ثلاث تعبئات ثم الحساب، والتعبئة باقيةٌ بعد خطأ الحساب', [L, bt, k4])
  spec = {'t': 'c7Thirds', 'fig': 'cone', 'v': 14, 'q': 'th.03'}; await run('m4.u7.d3', spec); st = await wk('c7Pour'); await press(1, 3); await done(); st = await wk('pick', nn(st)); await pick(42); r = await res(); L = await logs()
  check('C7G', L == [['c7-thirds-cone', True, True, None]], 'ثلاثة مخاريط: الكبير ثلاثة أمثال الصغير صحيحٌ من أول محاولة', L)
  # ---- محوّل الخزان
  spec = {'t': 'c7Tank', 'a': 30, 'b': 20, 'c': 40, 'to': 'cm3', 'q': 'tc.01'}; M = await pg.evaluate("(s) => ITEM.c7Tank.make(s)", spec); await run('m4.u7.d4', spec); st = await wk('c7Tank')
  await press(1, 3); await done(); st = await wk('c7Tank', nn(st)); await press(1, 4); await done(); st = await wk('pick', nn(st)); bl = [c for c in M['lits'] if c[1] == 'c7TankLayers']; await pick(bl[0][0] if bl else -1); L = await logs()
  check('C7G', [x[3] for x in L] == ['c7FillShort', 'c7TankLayers'], 'محوّل الخزان: طبقاتٌ ناقصة، ثم عدّ الطبقات لترات (c7TankLayers)', [L, M['lits']])
  st = await nxt(st); k3 = st['auto']['kind'] if st['auto'] else None; await pick(24); st = await wk('pick', nn(st)); bc = [c for c in M['ch'] if c[0] != M['want']][0]; await pick(bc[0]); L = await logs()
  check('C7G', k3 == 'pick' and L[-1] == ['c7-tank-cm3', False, False, bc[1]], 'محوّل الخزان: الملء باقٍ بعد الخطأ، والتحويل الخاطئ بوسمه', [k3, L, bc])
  st = await nxt(st); await pick(M['want']); r = await res(); L = await logs()
  check('C7G', r['res'] and r['res']['ok'] and L[-1] == ['c7-tank-cm3', True, False, None], 'محوّل الخزان: ثم بالسنتيمتر المكعب', [r['res'], L])
  spec = {'t': 'c7Tank', 'a': 200, 'b': 500, 'c': 60, 'to': 'm3', 'q': 'tc.03'}; await run('m4.u7.d4', spec); st = await wk('c7Tank'); await press(1, 6); await done(); st = await wk('pick', nn(st)); await pick(6000); st = await wk('pick', nn(st)); await pick(6); r = await res(); L = await logs()
  check('C7G', L == [['c7-tank-m3', True, True, None]], 'محوّل الخزان: ستّ طبقاتٍ من ألف لتر ستة أمتارٍ مكعبة', L)
  # ---- الدروس الأربعة: كل جولةٍ بأربعة أخطاء ثم الكشف، والجولات كلها تنتهي
  for lid in ('m4.u7.d1', 'm4.u7.d2', 'm4.u7.d3', 'm4.u7.d4'):
    for i in await pg.evaluate("(lid) => LDATA[lid].flow.map((s, i) => s.scene === 'motion' ? i : -1).filter(i => i >= 0)", lid):
      await pg.evaluate("() => { LOG.attempts.length = 0; }"); await pg.evaluate(START, [lid, i, 'game']); last = None
      for _ in range(200):
        s2 = await until(pg, lambda s: s['res'] or s['err'] or (s['auto'] and s['auto']['n'] != last), 20000)
        if s2['res'] or s2['err'] or not s2['auto']: break
        last = s2['auto']['n']; await pg.wait_for_timeout(120)
        await pg.evaluate("() => { const a = window.__auto; if (a) (a.wrong || a.ok)(); }")
      L = await logs(); per = {}
      for x in L:
        if x[1] is False: per[x[0]] = per.get(x[0], 0) + 1
      items = await pg.evaluate("([lid, i]) => LDATA[lid].flow[i].items.length", [lid, i])
      check('C7G', s2['res'] and not s2['err'] and sum(per.values()) == 4 * items, '%s (%d): كل جولةٍ بأربعة أخطاء حتى الكشف بلا خطأ في الصفحة' % (lid, i), [s2['res'], s2['err'], per])
  check('C7G', not errs, 'بلا خطأ في الصفحة', errs[:2]); await ctx.close()

# براهين M4 في السلسلة: المتوازيان لا يُطبقان في الشريط فوق البطاقات، وبطاقة المستوى الثاني بجانب الشكل لا عليه
async def pfl(b):
  """PFL: في «رتّب خطوات البرهان» (prChain) يُرسم المتوازيان بالارتفاع المتاح (كان بُعدهما 6 وحدات فتتراكب أعداد الزوايا)،
  وبطاقة «المعلوم أولاً» في المستوى الثاني لا تقطع الشكل (كانت فوق رؤوسه منذ صار الشكل فوق البطاقات)"""
  ctx, pg, errs = await page(b)
  for pf, vs, lid in (('alt', (0, 1, 2), 'm4.u2.d2'), ('coint', (0, 1), 'm4.u2.d2'), ('pbPf', (0, 1), 'm4.u8.d2'), ('paraSide', (0,), 'm4.u3.d4')):
    for v in vs:
      await pg.evaluate(START, [lid, {'t': 'prChain', 'pf': pf, 'q': 'gen.pf.q.chain', 'v': v}, 'practice']); st = await until(pg, lambda s: s['auto'] is not None)
      for _ in range(2):
        n0 = st['auto']['n'] if st['auto'] else -1; await pg.wait_for_timeout(150); await pg.evaluate("() => { const a = window.__auto; if (a) a.wrong(); }")
        st = await until(pg, lambda s: s['res'] or (s['auto'] and s['auto']['n'] != n0))
      await pg.wait_for_timeout(500)
      m = await pg.evaluate("""() => { const sv = document.querySelector('#stage svg'), fig = sv.querySelector(':scope > g[pointer-events=none]'), fb = fig.getBBox();
        const ys = [...fig.querySelectorAll('line')].filter(l => Math.abs(+l.getAttribute('y1') - +l.getAttribute('y2')) < .5 && Math.abs(+l.getAttribute('x2') - +l.getAttribute('x1')) > 200).map(l => +l.getAttribute('y1'));
        const T = [...sv.querySelectorAll('[data-help] text')].map(t => t.getBBox()), hit = T.filter(r => r.x < fb.x + fb.width - 2 && r.x + r.width > fb.x + 2 && r.y < fb.y + fb.height - 2 && r.y + r.height > fb.y + 2).length;
        const mn = Math.min(...[...sv.querySelectorAll('[data-help] text')].map(t => +t.getAttribute('font-size') || 99), 99);
        return [ys.length >= 2 ? Math.max(...ys) - Math.min(...ys) : null, hit, mn]; }""")
      if pf in ('alt', 'coint'): check('PFL', m[0] is not None and m[0] >= 30, '%s/%d: المتوازيان متباعدان في الشريط فوق البطاقات' % (pf, v), m)
      check('PFL', m[1] == 0 and m[2] >= 13, '%s/%d: نصّ المستوى الثاني لا يقطع الشكل، وخطّه 13 فأكثر' % (pf, v), m)
  check('PFL', not errs, 'بلا خطأ في الصفحة', errs[:2]); await ctx.close()

async def main():
  async with async_playwright() as p:
    b = await p.chromium.launch()
    for k, f in (('STORY', story), ('MINUS', minus), ('OFFER', offer), ('FRAME', frame), ('TEN', ten), ('DRAW', draw), ('C9G', c9g), ('C8G', c8g), ('C7G', c7g), ('C6G', c6g), ('PFL', pfl)):
      if not on(k): continue
      try: await f(b)
      except Exception as e: check(k, False, 'توقّف القسم باستثناء', str(e)[:300])   # (على النسخة القديمة يمضي البند إلى «كم؟» فلا تُلمس أزرار البناء)
    await b.close()
  print('FAILS: %d' % len(FAILS)); sys.exit(1 if FAILS else 0)
asyncio.run(main())
