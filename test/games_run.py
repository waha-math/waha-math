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
#   C5G    ألعاب M4-U5 الحركية (D288 (2)): الربع ثم النقطة، ورأس القائمة ثم الوتر، ونقطتا المستقيم ثم نقطةٌ عليه
#   X01G   لمستان بالإصبع بفاصل 150 م.ث على خطوةٍ وسطى في لعبة حركية (نمط #test): الثانية لا تجيب سؤال الخطوة التالية
#   HELPG  خطآن ثم صوابٌ في الخطوة الأولى من كل بندٍ حركي في م4: لا مساعدة باقية في انتظار الخطوة الثانية
#   HOLDG  الرسم في موضعه ومقياسه بين انتظارات الجولة في كل لعبةٍ حركية من م4 (ثلاثة أحجام)
#   RUNGG  كل خطوةٍ s من كل بندٍ حركي في م4: ما قبلها صحيح ثم أربعة أخطاء فيها حتى الكشف، وTEXTOV في كل انتظار وبعد الكشف (RUNG_ONLY لبعض الوحدات)
#   G87M   ما تدّعيه ألعاب U8/U7: القوسان والتقاطعان بأيّ ترتيب وبفتحةٍ واحدة، والكأس بحجمه، ولترات الطبقة، و«تمّ» بلا طبقة، والعدّ المكتوب
#   TOGG   الحلّ المشترك في كل خطوةٍ من كل بندٍ حركي في U5–U8 يرسم مساعدته
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
      check('C9G', s2['res'] and not s2['err'] and 4 * items <= sum(per.values()) <= 6 * items, '%s (%d): كل جولةٍ بأخطائها حتى الكشف (أربعةٌ في الخطوة أو ستةٌ في الجولة) بلا خطأ في الصفحة' % (lid, i), [s2['res'], s2['err'], per])
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
  async def opt(k): await pg.evaluate("(k) => { const b = document.querySelector('#stage .choices .pick[data-k=\"' + k + '\"]'); if (b) b.click(); }", k); await pg.wait_for_timeout(300)
  async def nx(st): return await until(pg, lambda s: s['res'] or s['err'] or (s['auto'] and s['auto']['n'] != nn(st)), 20000)
  # ---- صائد المنصّف: خطأ الرأس، ثم القوس من الرأس، والخطوة المنجزة تبقى، وفتحة الفرجار يقرّرها الطفل، والسلّم بأخطاء الخطوة الجارية (المراجع A لدفعة ألعاب U8/U7، 4 و8)
  spec = {'t': 'c8BisMake', 'deg': 72, 'q': 'gen.c8.q.bisV'}; await run('m4.u8.d1', spec); G = await pg.evaluate("(s) => c8BisGeo(s)", spec); st = await wk('tap')
  ok, st = await tapw(G['F1'], st); L = await logs()
  check('C8G', ok and L[:1] == [['c8-bis-make', False, True, 'c8BisNotV']], 'صائد المنصّف: الفرجار على غير الرأس خطأ c8BisNotV', [ok, L])
  ok1, st = await tapw(G['V'], st); ok2, st = await tapw(G['V'], st); L = await logs(); hp0 = await pg.evaluate(helps)
  check('C8G', ok1 and ok2 and L[1:] == [['c8-bis-make', False, False, 'c8BisArcV']] and hp0 == 0, 'صائد المنصّف: القوس الثاني من الرأس خطأ c8BisArcV، وأول خطأٍ في الخطوة سؤالٌ لا رسم', [ok1, ok2, L, hp0])
  has = await pg.evaluate(HAS, G['A'])
  check('C8G', has, 'صائد المنصّف: القوس الأول باقٍ بعد الخطأ، فالسؤال من نقطتي التقاطع', has)
  ok1, st = await tapw(G['A'], st); k1 = st['auto']['kind'] if st['auto'] else None; await opt('more'); st = await nx(st); await opt('less'); st = await nx(st); await pg.wait_for_timeout(300); hp = await pg.evaluate(helps); L = await logs()
  check('C8G', ok1 and k1 == 'pick' and [x[3] for x in L[2:]] == ['c8BisOpen', 'c8BisOpen'] and hp > 0, 'صائد المنصّف: تغيير الفتحة قبل القوس الآخر خطأ c8BisOpen، وثانيه شبحا قوسين', [ok1, k1, L, hp])
  await opt('more'); st = await nx(st); await pg.wait_for_timeout(600)
  tg = await pg.evaluate("([X, Y]) => [(" + HAS + ")(X), (" + HAS + ")(Y), (window.__clips || []).some(c => /^gen\\.c8\\.together\\.bisMake/.test(c)), document.querySelectorAll('#stage svg [data-help]').length]", [G['X'], G['Y']])
  check('C8G', tg[:3] == [True, True, True] and tg[3] > 0, 'صائد المنصّف: ثلاثة أخطاء في الفتحة ثم الحلّ المشترك يرسم الأقواس ويبرزها ويترك التقاطع للطفل', tg)
  ok, st = await tapw(G['Y'], st); r = await res(); L = await logs()
  check('C8G', ok and r['res'] and r['res']['ok'] is False and not r['err'] and L[-1][3] == 'c8BisCross' and len(L) == 6, 'صائد المنصّف: ستة أخطاء في الجولة كشف (شبيه التقاطع c8BisCross)', [r['res'], r['err'], L])
  # القراءة بالمنقلة: لا عدد للزاوية كلها، والتدريج الآخر مشتّت، ثم الحلّ المشترك في القراءة وحدها
  spec = {'t': 'c8BisMake', 'deg': 124, 'q': 'gen.c8.q.bisV'}; await run('m4.u8.d1', spec); G = await pg.evaluate("(s) => c8BisGeo(s)", spec); st = await wk('tap')
  for k in ('V', 'A'): ok, st = await tapw(G[k], st)
  await opt('keep'); st = await nx(st)
  for k in ('B', 'X'): ok, st = await tapw(G[k], st)
  ch = await pg.evaluate("(s) => ITEM.c8BisMake.make(s).ch", spec); bad = [c for c in ch if c[0] != 62]; tx = await pg.evaluate("() => [...document.querySelectorAll('#stage svg text')].map(t => t.textContent)")
  check('C8G', st['auto'] and st['auto']['kind'] == 'num' and len(bad) >= 2 and 'protScale' in [c[1] for c in ch] and not any(t.strip() in ('١٢٤', '124') for t in tx), 'صائد المنصّف: الخطوات ثم القراءة، والزاوية كلها غير مكتوبة، والتدريج الآخر مشتّت', [st['auto'], ch])
  for i in range(3):
    await num(bad[i % len(bad)][0]); st = await until(pg, lambda s: s['res'] or (s['auto'] and s['auto']['n'] != nn(st)), 20000)
  L = await logs(); await pg.wait_for_timeout(500); hp = await pg.evaluate(helps); cl = await pg.evaluate("() => (window.__clips || []).filter(c => /^gen\\.c8\\.together/.test(c))")
  check('C8G', [x[3] for x in L] == [bad[0][1], bad[1][1], bad[0][1] if len(bad) < 3 else bad[2][1]] and st['auto'] and st['auto']['kind'] == 'num' and hp > 0 and len(cl) == 1 and cl[0].startswith('gen.c8.together.bisRead'),
        'صائد المنصّف: القراءة الخاطئة بوسمها، والمنصّف باقٍ، والحلّ المشترك يعلّم النصف على التدريج', [L, st['auto'], hp, cl])
  await num(62); r = await res(); L = await logs()
  check('C8G', r['res'] and r['res']['ok'] and L[-1] == ['c8-bis-make', True, False, None], 'صائد المنصّف: ثم القراءة الصحيحة', [r['res'], L])
  # ---- أين المنتصف؟: الفتحة أولاً، ثم الطرفان والتقاطعان، ثم ن ب والمسطرة على ن أ وأ ب وم ن مكتوبان
  spec = {'t': 'c8PbMake', 'half': 30, 'h': 16, 'q': 'gen.c8.q.pbEnd1'}; await run('m4.u8.d2', spec); G = await pg.evaluate("(s) => c8PbGeo(s)", spec); st = await wk('pick')
  await opt('short'); st = await nx(st); L = await logs()
  check('C8G', L[:1] == [['c8-pb-make', False, True, 'c8PbShort']], 'أين المنتصف؟: فتحةٌ أقصر من نصف القطعة خطأ c8PbShort', L)
  await opt('long'); st = await nx(st)
  for k in ('B', 'A'): ok, st = await tapw(G[k], st)
  ok, st = await tapw(G['Z'], st); L = await logs()
  check('C8G', ok and L[1:] == [['c8-pb-make', False, False, 'c8PbCross']], 'أين المنتصف؟: البدء بالطرف الآخر صحيح، ونقطةٌ ليست تقاطعاً خطأ c8PbCross', [ok, L])
  has = await pg.evaluate(HAS, G['X1']); check('C8G', has, 'أين المنتصف؟: القوسان باقيان بعد الخطأ، فالسؤال عن التقاطع', has)
  for k in ('X2', 'X1'): ok, st = await tapw(G[k], st)
  tx = await pg.evaluate("() => [...document.querySelectorAll('#stage svg text')].map(t => t.textContent)")
  check('C8G', st['auto'] and st['auto']['kind'] == 'num' and any('٦٠' in t for t in tx) and any('١٦' in t for t in tx) and any('٣٤' in t for t in tx), 'أين المنتصف؟: التقاطعان بأيّ ترتيب ثم القراءة، وأ ب = ٦٠ وم ن = ١٦ ون أ = ٣٤ على المسرح', [st['auto'], tx])
  ch = await pg.evaluate("(s) => ITEM.c8PbMake.make(s).ch", spec); bad = [c for c in ch if c[0] != 34]
  for i in range(3):
    await num(bad[i % len(bad)][0]); st = await until(pg, lambda s: s['res'] or (s['auto'] and s['auto']['n'] != nn(st)), 20000)
    if i == 1: await pg.wait_for_timeout(400); hp2 = await pg.evaluate(helps)
  L = await logs(); await pg.wait_for_timeout(500); hp = await pg.evaluate(helps); cl = await pg.evaluate("() => (window.__clips || []).filter(c => /^gen\\.c8\\.together/.test(c))")
  check('C8G', len(L) == 5 and L[2][3] == bad[0][1] and hp2 > 0 and hp > 0 and len(cl) == 1 and cl[0].startswith('gen.c8.together.pbRead'), 'أين المنتصف؟: القراءة الخاطئة بوسمها، والمستوى الثاني قوسٌ من ن، والحلّ المشترك يعلّم البعدين متساويين', [L, ch, hp2, hp, cl])
  await num(34); r = await res(); L = await logs()
  check('C8G', r['res'] and r['res']['ok'] and L[-1] == ['c8-pb-make', True, False, None], 'أين المنتصف؟: ثم ن ب = ن أ', [r['res'], L])
  spec = {'t': 'c8PbMake', 'half': 40, 'h': 9, 'rot': -24}; await run('m4.u8.d2', spec); G = await pg.evaluate("(s) => c8PbGeo(s)", spec); st = await wk('pick'); await opt('long'); st = await nx(st)
  ok, st = await tapw(G['M'], st); L = await logs()
  ok2, st = await tapw(G['Qa'], st); await pg.wait_for_timeout(300); hp = await pg.evaluate("() => document.querySelectorAll('#stage svg [data-help] path').length"); L = await logs()
  check('C8G', ok and ok2 and [x[3] for x in L] == ['c8PbNotEnd', 'c8PbNotEnd'] and hp > 0 and abs(G['A'][1] - G['B'][1]) > 20, 'أين المنتصف؟: القطعة المائلة، والفرجار على غير الطرف خطأ c8PbNotEnd، وثانيه قوسٌ شبح', [ok, ok2, L, hp, G['A'], G['B']])
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
      check('C8G', s2['res'] and not s2['err'] and 4 * items <= sum(per.values()) <= 6 * items, '%s (%d): كل جولةٍ بأخطائها حتى الكشف (أربعةٌ في الخطوة أو ستةٌ في الجولة) بلا خطأ في الصفحة' % (lid, i), [s2['res'], s2['err'], per])
  check('C8G', not errs, 'بلا خطأ في الصفحة', errs[:2]); await ctx.close()

# M4-U5 الألعاب الحركية (خطة ألعاب المرحلة 4): صائد الكنز في الأرباع، والكاشف، وأين المستقيم؟
async def c5g(b):
  """ألعاب M4-U5 الحركية (D288 (2)): الربع ثم النقطة، ورأس القائمة ثم الوتر، ونقطتا المستقيم ثم نقطةٌ عليه. الخطأ المقصود، والخطوات تبقى،
  والحلّ المشترك من حيث وقف الطفل، والرأس الآخر والنقطة الثانية الأخرى صحيحتان، والدرجات الأربع حتى الكشف بلا خطأ في الصفحة"""
  ctx, pg, errs = await page(b)
  async def run(lid, spec): await pg.evaluate("() => { LOG.attempts.length = 0; }"); await pg.evaluate(START, [lid, spec, 'practice'])
  async def logs(): return await pg.evaluate("() => LOG.attempts.filter(x => /^c5-/.test(x.tag || '')).map(x => [x.tag, x.ok, x.firstTry === undefined ? null : x.firstTry, x.err || null])")
  async def wk(kind, after=-1): return await until(pg, lambda s: s['res'] or (s['auto'] and s['auto']['kind'] == kind and s['auto']['n'] != after))
  async def res(): return await until(pg, lambda s: s['res'] or s['err'], 30000)
  nn = lambda st: st['auto']['n'] if st and st.get('auto') else -1
  async def nxt(st): return await until(pg, lambda s: s['res'] or s['err'] or (s['auto'] and s['auto']['n'] != nn(st)), 20000)
  async def auto(f): await pg.evaluate("(f) => { const a = window.__auto; if (a) a[f](); }", f); await pg.wait_for_timeout(700)
  async def tapk(ok): await pg.evaluate("(ok) => { const t = document.querySelector('#stage svg [role=button][data-ok=' + ok + ']'); if (t) t.dispatchEvent(new MouseEvent('click', { bubbles: true })); }", 'true' if ok else 'false'); await pg.wait_for_timeout(700)
  async def place(x, y):   # لمسةٌ حقيقية بالمؤشّر على خانة المستوى ثم «تمّ»
    q = await pg.evaluate("([x, y]) => window.__axAt(x, y)", [x, y]); await pg.mouse.click(q['x'], q['y']); await pg.wait_for_timeout(300)
    await pg.evaluate("() => { const d = document.querySelector('#stage .pick.done'); if (d) d.click(); }"); await pg.wait_for_timeout(700)
  async def num(v): await pg.evaluate("(v) => { const b = [...document.querySelectorAll('#stage .choices.nums button')].find(b => +b.dataset.k === v); if (b) b.click(); }", v); await pg.wait_for_timeout(600)
  helps = "() => document.querySelectorAll('#stage svg [data-help] *').length"
  # ---- صائد الكنز
  spec = {'t': 'c5Hunt', 'x': -3, 'y': 2, 'q': 'ht.01'}; await run('m4.u5.d1', spec); st = await wk('tap'); await tapk(False); L = await logs()
  check('C5G', L[:1] == [['c5-hunt', False, True, 'c5Quad']], 'صائد الكنز: الربع الخطأ خطأ c5Quad', L)
  st = await wk('tap', nn(st)); await tapk(True); st = await wk('axPts', nn(st)); await auto('wrong'); L = await logs()
  check('C5G', L[1:] == [['c5-hunt', False, False, 'c4SignX']], 'صائد الكنز: الربع الصحيح ثم إشارة السين المعكوسة خطأ c4SignX', L)
  st = await nxt(st); await pg.wait_for_timeout(300); hp = await pg.evaluate(helps); k3 = st['auto']['kind'] if st['auto'] else None; await auto('ok'); r = await res(); L = await logs()
  ch = await pg.evaluate("() => document.querySelectorAll('#stage svg [data-chest=open]').length")
  check('C5G', k3 == 'axPts' and r['res'] and r['res']['ok'] and ch == 1, 'صائد الكنز: الربع باقٍ بعد الخطأ (المستوى الثاني مشيٌ على المحورين كبند النقطة)، ثم يُفتح الكنز', [k3, hp, r['res'], ch, L])
  await run('m4.u5.d1', spec); st = await wk('tap')
  for _ in range(3): await tapk(False); st = await wk('tap', nn(st))
  await pg.wait_for_timeout(300); tq = await pg.evaluate("() => document.querySelectorAll('#stage svg [role=button]').length")
  check('C5G', tq == 2, 'صائد الكنز: الحلّ المشترك يُبقي ربعي جهة السين', tq)
  async def tapsel(sel): await pg.evaluate("(sel) => { const t = document.querySelector(sel); if (t) t.dispatchEvent(new MouseEvent('click', { bubbles: true })); }", sel); await pg.wait_for_timeout(700)
  async def opt(k): await pg.evaluate("(k) => { const b = document.querySelector('#stage .choices .pick[data-k=\"' + k + '\"]'); if (b) b.click(); }", k); await pg.wait_for_timeout(600)
  async def card(lab): return await pg.evaluate("(lab) => [...document.querySelectorAll('#stage svg text')].some(t => t.textContent.includes(labelText(lab).slice(0, 8)))", lab)
  await run('m4.u5.d1', spec); st = await wk('tap'); await tapsel('#stage svg [role=button][data-axis]'); L = await logs()
  check('C5G', L[:1] == [['c5-hunt', False, True, 'c5NotAxis']], 'صائد الكنز: «على محور» لنقطةٍ في ربع خطأ c5NotAxis (المراجع A لدفعة U6/U5، 17)', L)
  spec = {'t': 'c5Hunt', 'x': 0, 'y': 3, 'q': 'ht.03'}; await run('m4.u5.d1', spec); st = await wk('tap'); await tapk(False); L = await logs()
  check('C5G', L[:1] == [['c5-hunt', False, True, 'c5AxisQuad']], 'صائد الكنز: ربعٌ لنقطةٍ على محور خطأ c5AxisQuad', L)
  st = await wk('tap', nn(st)); await tapk(False); st = await nxt(st); await pg.wait_for_timeout(300); ar = await pg.evaluate(helps); cz = await card('c5AskZero')
  await tapk(True); st = await wk('axPts', nn(st)); await place(0, 3); r = await res()
  check('C5G', ar > 0 and cz and r['res'] and r['res']['ok'], 'صائد الكنز: المستوى الثاني سهم الإشارة وبطاقة الصفر، ثم «على محور» والنقطة (٠، ٣)', [ar, cz, r['res']])
  await run('m4.u5.d1', spec); st = await wk('tap')
  for _ in range(3): await tapk(False); st = await wk('tap', nn(st))
  await pg.wait_for_timeout(300); tq = await pg.evaluate("() => [document.querySelectorAll('#stage svg [role=button]').length, document.querySelectorAll('#stage svg [role=button][data-axis]').length, (window.__clips || []).filter(c => /^gen\\.c5\\.together\\.axis/.test(c)).length]")
  check('C5G', tq == [3, 1, 1], 'صائد الكنز: الحلّ المشترك لنقطة المحور يُبقي ربعي جهة الصاد و«على محور»', tq)
  # ---- الكاشف
  spec = {'t': 'c5Detect', 'a': [-2, 1], 'b': [1, 5], 'q': 'dt.01'}; await run('m4.u5.d2', spec); st = await wk('axPts'); await auto('wrong'); L = await logs()
  check('C5G', L[:1] == [['c5-detect', False, True, 'c4CornerOff']], 'الكاشف: رأسٌ ليس رأس القائمة خطأ c4CornerOff', L)
  st = await wk('axPts', nn(st)); await place(-2, 5); st = await nxt(st); k2 = st['auto']['kind'] if st['auto'] else None; await num(7); L = await logs()
  check('C5G', k2 == 'num' and L[1:] == [['c5-detect', False, False, 'coDistAdd']], 'الكاشف: الرأس الآخر صحيح، وجمع الضلعين خطأ coDistAdd', [k2, L])
  st = await nxt(st); k3 = st['auto']['kind'] if st['auto'] else None; await num(5); r = await res(); await pg.wait_for_timeout(300)
  ru = await pg.evaluate("() => [...document.querySelectorAll('#stage svg rect')].filter(r => r.getAttribute('fill') === 'rgba(246,217,138,.85)').length + ([...document.querySelectorAll('#stage svg text')].some(t => t.getAttribute('fill') === '#6e4a22' && t.textContent.trim() === MS('5')) ? 0 : 10)")
  check('C5G', k3 == 'num' and r['res'] and r['res']['ok'] and ru == 1, 'الكاشف: الرأس باقٍ بعد الخطأ، والوتر 5 والمسطرة تقيسه', [k3, r['res'], ru])
  await run('m4.u5.d2', spec); st = await wk('axPts'); await auto('wrong'); st = await wk('axPts', nn(st)); await auto('wrong'); st = await nxt(st); await pg.wait_for_timeout(300)
  hl = await pg.evaluate("() => document.querySelectorAll('#stage svg [data-help] line, #stage svg [data-help] path').length"); cv = await card('c5AskVert')
  check('C5G', cv and 0 < hl <= 2, 'الكاشف: المستوى الثاني الأفقيّ من أ وحده وسؤال الرأسيّ (لا الخطّان، المراجع A لدفعة U6/U5، 3 ب)', [cv, hl])
  spec = {'t': 'c5Detect', 'a': [-4, -2], 'b': [-1, 4], 'q': 'dt.02'}; await run('m4.u5.d2', spec); st = await wk('axPts'); await place(-1, -2); st = await nxt(st)
  ks = await pg.evaluate("() => [...document.querySelectorAll('#stage .choices .pick')].map(b => b.dataset.k).sort()"); await opt('9'); st = await nxt(st); await opt('45'); st = await nxt(st); await opt('6_7'); r = await res(); L = await logs()
  check('C5G', ks == ['45', '6_7', '9'] and [x[3] for x in L] == ['coDistAdd', 'pyNoRoot', None] and r['res'] and r['res']['ok'], 'الكاشف العشريّ: الجمع (٩) والمربّعان بلا جذر (٤٥) خطآن بوسميهما، ثم ٦٫٧ (المراجع A لدفعة U6/U5، 16)', [ks, L, r['res']])
  # ---- أين المستقيم؟
  spec = {'t': 'c5Detect', 'a': [-2, 4], 'b': [2, -2], 'q': 'dt.03'}; await run('m4.u5.d2', spec); st = await wk('axPts'); await place(2, 4); st = await nxt(st); await pg.wait_for_timeout(300)
  sd = await pg.evaluate("() => { const T = [...document.querySelectorAll('#stage svg text')].filter(t => [C4.pt, C4.pt2].includes(t.getAttribute('fill'))).map(t => t.textContent.trim()); return [T.includes(MS('4')), T.includes(MS('6')), T.some(x => /[−-]/.test(x))]; }")
  check('C5G', sd == [True, True, False], 'الكاشف: الضلعان بطوليهما بلا سالب والفرقان سالبان (الطفرة: preNumV)', sd)
  spec = {'t': 'c5Line', 'm': 2, 'i0': -1, 'cand': [[3, 5], [-2, 1], [2, 1]], 'q': 'lg.01'}; await run('m4.u5.d3', spec); st = await wk('axPts'); await auto('wrong'); L = await logs()
  check('C5G', L[:1] == [['c5-line', False, True, 'c4IntSwap']], 'المستقيم: نقطة الصادات مقلوبة خطأ c4IntSwap', L)
  st = await wk('axPts', nn(st)); await auto('ok'); st = await wk('axPts', nn(st)); await auto('wrong'); L = await logs()
  check('C5G', L[1:] == [['c5-line', False, False, 'c5SlopeSign']], 'المستقيم: الميل المعكوس في النقطة الثانية خطأ c5SlopeSign', L)
  st = await wk('axPts', nn(st)); await auto('wrong'); st = await nxt(st); await pg.wait_for_timeout(300); hs = await pg.evaluate("() => document.querySelectorAll('#stage svg [data-help]').length")
  check('C5G', hs > 0 and not st.get('err') and st.get('auto') and st['auto']['kind'] == 'axPts', 'المستقيم: الخطأ الثاني في النقطة الثانية يرسم الميل من نقطة الصادات (المستوى الثاني)', [hs, st])
  k3 = st['auto']['kind'] if st['auto'] else None; await place(2, 3); st = await wk('tap', nn(st)); await tapk(False); L = await logs()
  check('C5G', k3 == 'axPts' and L[-1:] == [['c5-line', False, False, 'c5NotOn']], 'المستقيم: نقطةٌ ثانية أخرى على المستقيم صحيحة، ونقطةٌ ليست عليه خطأ c5NotOn', [k3, L])
  spec = {'t': 'c5Line', 'm': 2, 'i0': -1, 'cand': [[3, 5], [-2, 1], [2, 1]], 'q': 'lg.01'}; await run('m4.u5.d3', spec); st = await wk('axPts'); await auto('ok'); st = await wk('axPts', nn(st)); await auto('ok'); st = await wk('tap', nn(st))
  for _ in range(3): await tapk(False); st = await nxt(st)   # ثلاثة أخطاء في الخطوة الأخيرة ثم الحلّ المشترك
  await pg.wait_for_timeout(300); tr = await pg.evaluate("() => document.querySelectorAll('#stage svg [role=button]').length"); await tapk(True); r = await res()
  check('C5G', tr == 2 and r['res'] and r['res']['ok'], 'المستقيم: الحلّ المشترك يُبعد نقطةً ويُبقي اثنتين، ثم الصحيحة', [tr, r['res']])
  spec = {'t': 'c5Line', 'm': 2, 'i0': -2, 'cand': [[3, 4], [-1, -3], [1, 2]], 'q': 'lg.01'}; await run('m4.u5.d3', spec); st = await wk('axPts'); await place(0, -2); st = await wk('axPts', nn(st)); await place(1, 0); st = await wk('tap', nn(st))   # مرشّحٌ خاطئ قرب نقطة القطع (كما في مسبار المراجع B): اللمسة على نقطة الطفل لا تذهب إليه
  q = await pg.evaluate("() => window.__axAt(0, -2)"); await pg.mouse.click(q['x'], q['y']); await pg.wait_for_timeout(800); L = await logs(); st2 = await pg.evaluate(ST)
  check('C5G', L == [] and not st2['res'] and st2['auto'] and st2['auto']['kind'] == 'tap', 'المستقيم: لمس نقطة الطفل (نقطة القطع) لا يُحسب مرشّحاً (D255، المراجع B لدفعة U6/U5، 6)', [L, st2['res']])
  spec = {'t': 'c5Line', 'm': -2, 'i0': 2, 'cand': [[-1, 4], [4, -5], [2, -4]], 'pt': [2, -2], 'q': 'lg.03'}; await run('m4.u5.d3', spec); st = await wk('axPts')
  ec = await pg.evaluate("() => [...document.querySelectorAll('#stage svg text')].some(t => /=/.test(t.textContent))"); await place(2, 0); st = await wk('axPts', nn(st)); await place(0, 1); st = await nxt(st); await pg.wait_for_timeout(300)
  hb = await pg.evaluate(helps); cb = await card('c5AskBack'); await place(0, 2); st = await wk('axPts', nn(st)); await place(1, 0); st = await wk('tap', nn(st)); await tapk(True); r = await res(); L = await logs()
  check('C5G', not ec and [x[3] for x in L] == ['c4IntSwap', 'c4IntOff', None] and L[-1][0] == 'c5-line-pt' and hb > 0 and cb and r['res'] and r['res']['ok'],
        'المستقيم من الميل ونقطة: بلا معادلة، والخطآن بوسميهما، والمستوى الثاني خطوةٌ رجوعاً من النقطة، ثم (٠، ٢) و(١، ٠) والنقطة (المراجع A لدفعة U6/U5، 17)', [ec, L, hb, cb, r['res']])
  spec = {'t': 'c5Line', 'm': 2, 'i0': -2, 'cand': [[3, 4], [-2, -5], [1, 2]], 'q': 'lg.01'}; await run('m4.u5.d3', spec); st = await wk('axPts')
  for _ in range(6):
    await auto('wrong'); st = await nxt(st)
    if st['res'] or st['err']: break
  st = await until(pg, lambda s: s['res'] or s['err'], 30000)
  check('C5G', st['res'] and any(c.startswith('gen.c5.reveal.int') for c in st['clips']) and not any(c.startswith('gen.c4.reveal.pt') for c in st['clips']), 'المستقيم: الكشف بعد إخفاق الخطوة الأولى يُري نقطة القطع ويقولها (المراجع A لدفعة U6/U5، 13)', [st['res'], [c for c in st['clips'] if 'reveal' in c]])
  # ---- الدروس الثلاثة: كل جولةٍ بأربعة أخطاء ثم الكشف
  for lid in ('m4.u5.d1', 'm4.u5.d2', 'm4.u5.d3'):
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
      check('C5G', s2['res'] and not s2['err'] and 4 * items <= sum(per.values()) <= 6 * items, '%s (%d): كل جولةٍ بأخطائها حتى الكشف (أربعةٌ في الخطوة أو ستةٌ في الجولة) بلا خطأ في الصفحة' % (lid, i), [s2['res'], s2['err'], per])
  le = await pg.evaluate("() => (LOG.errors || []).map(e => String(e.msg || e.message || e).slice(0, 120))")
  check('C5G', not errs and not le, 'بلا خطأ في الصفحة ولا في سجلّ الأخطاء (LOG.errors)', [errs[:2], le[:2]]); await ctx.close()

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
  async def opt(k): await pg.evaluate("(k) => { const b = document.querySelector('#stage .choices .pick[data-k=\"' + k + '\"]'); if (b) b.click(); }", k); await pg.wait_for_timeout(600)
  async def tapsel(sel): await pg.evaluate("(sel) => { const t = document.querySelector(sel); if (t) t.dispatchEvent(new MouseEvent('click', { bubbles: true })); }", sel); await pg.wait_for_timeout(700)
  async def card(lab): return await pg.evaluate("(lab) => [...document.querySelectorAll('#stage svg text')].some(t => t.textContent.includes(labelText(lab).slice(0, 8)))", lab)
  async def tapk(ok): await pg.evaluate("(ok) => { const t = document.querySelector('#stage svg [role=button][data-ok=' + ok + ']'); if (t) t.dispatchEvent(new MouseEvent('click', { bubbles: true })); }", 'true' if ok else 'false'); await pg.wait_for_timeout(700)
  async def done(): await pg.wait_for_timeout(200); await pg.evaluate("() => { const d = document.querySelector('#stage .pick.done'); if (d) d.click(); }"); await pg.wait_for_timeout(400)
  async def num(v): await pg.evaluate("(v) => { const b = [...document.querySelectorAll('#stage .choices.nums button')].find(b => +b.dataset.k === v); if (b) b.click(); }", v); await pg.wait_for_timeout(600)
  helps = "() => document.querySelectorAll('#stage svg [data-help] *').length"
  # ---- وتر الدائرة
  spec = {'t': 'c6ChordGame', 'r': 15, 'L': 24, 'd0': 6, 'q': 'cg.01'}; await run('m4.u6.d1', spec); st = await wk('c6Move')
  await press(1, 2); await done(); L = await logs()
  check('C6G', L[:1] == [['c6-chord-dist', False, True, 'c6ChordLen']], 'وتر الدائرة: الطول غير المطلوب خطأ c6ChordLen', L)
  st = await wk('c6Move', nn(st)); k0 = await pg.evaluate("() => window.__c6K()"); await press(1, 3); await done(); st = await wk('num', nn(st)); await num(12); L = await logs()
  check('C6G', k0 == 6 and L[1:] == [['c6-chord-dist', False, False, 'c6HalfDist']], 'وتر الدائرة: من موضعه الأول، ثم نصف الوتر بُعداً خطأ c6HalfDist', [k0, L])
  st = await nxt(st); await pg.wait_for_timeout(300); hp1 = await pg.evaluate(helps); await num(12); st = await nxt(st); await pg.wait_for_timeout(300); hp = await pg.evaluate(helps); k3 = st['auto']['kind'] if st['auto'] else None; await num(9); r = await res(); L = await logs()
  check('C6G', k3 == 'num' and hp1 == 0 and hp > 0 and r['res'] and r['res']['ok'] and L[-1] == ['c6-chord-dist', True, False, None], 'وتر الدائرة: الموضع باقٍ بعد الخطأ، وأول خطأٍ في البعد سؤالٌ وثانيه المستوى الثاني منقولاً، ثم البعد', [k3, hp1, hp, r['res'], L])
  await run('m4.u6.d1', spec); st = await wk('c6Move'); lens = []
  for i in range(5):
    lens.append(await pg.evaluate("() => { const k = window.__c6K(), L = Math.round(2 * Math.sqrt(15 * 15 - k * k) * 10) / 10; return [...document.querySelectorAll('#stage svg text')].some(t => t.textContent.trim() === MS(String(L))); }")); await press(0 if i < 2 else 1, 1)
  check('C6G', all(lens), 'وتر الدائرة: الطول المكتوب على الوتر ٢√(ر² − ك²) في كل موضع (الطفرة: طولٌ ثابت)', lens)
  await run('m4.u6.d1', spec); st = await wk('c6Move')
  for _ in range(3): await press(1, 1); await done(); st = await wk('c6Move', nn(st))
  await pg.wait_for_timeout(300); tm = await pg.evaluate("() => [window.__c6K(), (window.__clips || []).filter(c => /^gen\\.c6\\.together\\.move/.test(c)).length]")
  check('C6G', tm == [8, 1], 'وتر الدائرة: الحلّ المشترك حركةٌ قبل الموضع', tm)
  spec = {'t': 'c6ChordGame', 'r': 5, 'd0': 3, 'q': 'cg.03'}; await run('m4.u6.d1', spec); st = await wk('c6Move'); await press(0, 2); await done(); L = await logs()
  st = await wk('c6Move', nn(st)); await press(0, 3); await done(); st = await wk('num', nn(st))
  lk = await pg.evaluate("() => [...document.querySelectorAll('#stage svg text')].some(t => t.textContent.replace(/\\s/g, '') === MS('10'))")
  ns = await pg.evaluate("() => [...document.querySelectorAll('#stage .choices.nums button')].map(b => +b.dataset.k).sort((a, b) => a - b)"); await num(8); st = await nxt(st); await num(10); r = await res(); L2 = await logs()
  check('C6G', L[:1] == [['c6-chord-diam', False, True, 'c6NotDiam']] and not lk and ns == [5, 8, 10] and L2[-2][3] == 'c6DiamStart' and r['res'] and r['res']['ok'], 'وتر الدائرة: أطول وترٍ يمرّ بالمركز، ولا يُكتب طوله قبل الجواب، والوتر الذي بدأ منه (٨) خطأ c6DiamStart', [L, lk, ns, L2])
  spec = {'t': 'c6ChordGame', 'r': 15, 'L': 24, 'd0': 6, 'q': 'cg.01'}; await run('m4.u6.d1', spec); st = await wk('c6Move'); await press(1, 1); await done(); st = await wk('c6Move', nn(st)); await press(1, 1); await done(); st = await nxt(st); await pg.wait_for_timeout(300)
  gh = await pg.evaluate("() => [...document.querySelectorAll('#stage svg [data-help] line, #stage svg [data-help] path')].filter(e => e.getAttribute('stroke-dasharray')).length"); cc = await card('c6AskCmp')
  check('C6G', gh >= 2 and cc, 'وتر الدائرة: المستوى الثاني وتران شبحان قبل الموضع وبعده بطوليهما (المراجع A لدفعة U6/U5، 21)', [gh, cc])
  for _ in range(6):
    await press(0, 1); await done(); st = await nxt(st)
    if st['res'] or st['err']: break
  st = await until(pg, lambda s: s['res'] or s['err'], 30000)
  check('C6G', st['res'] and any(c.startswith('gen.c6.reveal.dist') for c in st['clips']), 'وتر الدائرة: الكشف يقول البعد باسمه (المراجع A لدفعة U6/U5، 13)', [c for c in st['clips'] if 'reveal' in c])
  # ---- المماس
  spec = {'t': 'c6TanGame', 'mode': 'slide', 'a': 270, 'q': 'tg.01'}; await run('m4.u6.d2', spec); st = await wk('c6Move'); cm = []
  for i in range(7):
    cm.append(await pg.evaluate("() => { const n = [...document.querySelectorAll('#stage svg circle')].filter(c => c.getAttribute('r') === '6' && c.getAttribute('fill') === C6.q).length, h = labelText('c6Common').split('N')[0].trim(), t = [...document.querySelectorAll('#stage svg text')].find(x => x.textContent.includes(h.slice(0, 6))); return t ? t.textContent.includes(MS(String(n))) : false; }")); await press(1 if i < 6 else 0, 1)
  check('C6G', all(cm), 'المماس: «نقاط مشتركة» بعدد النقاط المرسومة في كل موضع (الطفرة: عددٌ ثابت)', cm)
  await run('m4.u6.d2', spec); st = await wk('c6Move')
  await press(1, 2); await done(); st = await wk('c6Move', nn(st)); await press(1, 6); await done(); L = await logs()
  check('C6G', [x[3] for x in L] == ['c6Secant', 'c6Miss'], 'المماس: قاطعٌ ثم بعيدٌ عن الدائرة، كلٌّ بوسمه', L)
  await run('m4.u6.d2', spec); st = await wk('c6Move'); await pg.evaluate("() => { const a = window.__auto; if (a) a.ok(); }"); st = await wk('tap', nn(st)); await tapk(False); L = await logs()
  check('C6G', L[:1] == [['c6-tan-slide', False, True, 'c6PaperSpot']], 'المماس: ركن الورقة بعيداً عن نقطة التماس خطأ c6PaperSpot', L)
  st = await wk('tap', nn(st)); await tapk(True); st = await wk('pick', nn(st))
  for _ in range(3): await opt('acute'); st = await nxt(st)   # ثلاثة أخطاء في الحكم ثم الحلّ المشترك (السلّم بأخطاء الخطوة)
  await pg.wait_for_timeout(300)
  tg = await pg.evaluate("() => [document.querySelectorAll('#stage svg [data-help] *').length, (window.__clips || []).filter(c => /^gen\\.c6\\.together\\.kind/.test(c)).length, [...document.querySelectorAll('#stage .choices .pick')].map(b => b.dataset.k).sort()]"); await opt('right'); r = await res(); L = await logs()
  check('C6G', len(L) > 2 and L[2][3] == 'c6TanNotRight' and tg[0] > 0 and tg[1] == 1 and tg[2] == ['obtuse', 'right'] and r['res'] and r['res']['ok'], 'المماس: «حادّة» خطأ c6TanNotRight، والحلّ المشترك يرسم القائمة ويُسقط ما جُرِّب، ثم «قائمة» (المراجع A لدفعة U6/U5، 10)', [L, tg, r['res']])
  spec = {'t': 'c6TanGame', 'mode': 'slide', 'a': 30, 'noAng': True, 'q': 'tg.02'}; await run('m4.u6.d2', spec); st = await wk('c6Move'); ic = await pg.evaluate("() => document.querySelectorAll('#stage .choices.icons .pick svg, #stage .choices.icons .pick i').length")
  await pg.evaluate("() => { const a = window.__auto; if (a) a.ok(); }"); r = await res(); L = await logs()
  check('C6G', ic == 0 and r['res'] and L[-1][0] == 'c6-tan-move', 'المماس المائل: زرّا التحريك بلا سهمٍ رأسيّ، والجولة تنتهي بالتماسّ (المراجع A لدفعة U6/U5، 22)', [ic, r['res'], L])
  spec = {'t': 'c6TanGame', 'mode': 'pivot', 'r': 5, 'op': 13, 'q': 'tg.03'}; await run('m4.u6.d2', spec); st = await wk('c6Move'); await press(1, 3); await done(); st = await wk('num', nn(st)); await num(12); r = await res(); L = await logs()
  check('C6G', L == [['c6-tan-pivot', True, True, None]], 'المماس: المسطرة تدور حتى تلامس، وطول المماس 12', L)
  # ---- أين المركز؟
  spec = {'t': 'c6CenGame', 'cen': 100, 'q': 'cn.01'}; await run('m4.u6.d3', spec); st = await wk('tap')
  await pg.evaluate("() => { const t = document.querySelector('#stage svg [role=button][data-ok=false]'); if (t) t.dispatchEvent(new MouseEvent('click', { bubbles: true })); }"); await pg.wait_for_timeout(900); L = await logs()
  check('C6G', L[:1] == [['c6-center', False, True, 'c6NotCenter']], 'أين المركز؟: نقطةٌ ليست المركز خطأ c6NotCenter', L)
  st = await wk('tap', nn(st)); await tapk(False); st = await nxt(st); await pg.wait_for_timeout(300)
  ry = await pg.evaluate("() => { const h = [...document.querySelectorAll('#stage svg [data-help]')]; const ls = h.reduce((a, g) => a + g.querySelectorAll('line, path').length, 0), ts = h.reduce((a, g) => a + [...g.querySelectorAll('text')].filter(t => /[٠-٩]/.test(t.textContent)).length, 0); return [ls >= 3, ts >= 3]; }")
  check('C6G', ry == [True, True], 'أين المركز؟: الخطأ الثاني يرسم أشعّة النقطة الثلاثة بأطوالها (الطفرة: بلا أشعّة)', ry)
  await run('m4.u6.d3', spec); st = await wk('tap'); await tapk(False)
  st = await wk('tap', nn(st)); await pg.evaluate("() => { const t = document.querySelector('#stage svg [role=button][data-ok=true]'); if (t) t.dispatchEvent(new MouseEvent('click', { bubbles: true })); }")
  st = await wk('num', nn(st)); await num(80); L = await logs(); st = await nxt(st); k3 = st['auto']['kind'] if st['auto'] else None
  check('C6G', L[1:] == [['c6-center', False, False, 'c6ReadOther']] and k3 == 'num', 'أين المركز؟: التدريج الآخر خطأ، والمركز باقٍ بعد الخطأ', [L, k3])
  await num(100); st = await wk('num', nn(st))
  for _ in range(3): await num(130); st = await nxt(st)
  L = await logs(); await pg.wait_for_timeout(300)
  tr = await pg.evaluate("() => (window.__clips || []).filter(c => /^gen\\.c6\\.together\\.read/.test(c)).length"); await num(50); r = await res(); L2 = await logs()
  check('C6G', len(L) > 0 and L[-1][3] == 'c6ReadOther' and tr == 1 and r['res'] and r['res']['ok'], 'أين المركز؟: التدريج الآخر في المحيطية خطأ (المشتّت الأول، المراجع A لدفعة U6/U5، 16)، والحلّ المشترك في القراءة، ثم نصف المركزية', [L, tr, L2])
  await run('m4.u6.d3', spec); st = await wk('tap')
  for _ in range(3): await pg.evaluate("() => { const t = document.querySelector('#stage svg [role=button][data-ok=false]'); if (t) t.dispatchEvent(new MouseEvent('click', { bubbles: true })); }"); st = await wk('tap', nn(st))
  await pg.wait_for_timeout(400); rm = await pg.evaluate("() => document.querySelectorAll('#stage svg [role=button][data-ok=false]').length")
  check('C6G', rm == 1, 'أين المركز؟: الحلّ المشترك يجرّب نقطةً ويُبقي اثنتين', rm)
  spec = {'t': 'c6CenGame', 'cen': 140, 'pAt': 60, 'rot': 25, 'q': 'cn.02'}; await run('m4.u6.d3', spec); st = await wk('tap'); await tapk(True); st = await wk('num', nn(st)); await pg.wait_for_timeout(300)
  ly = await pg.evaluate("() => { const d = [...document.querySelectorAll('#stage svg circle')].find(c => +c.getAttribute('r') === 80), p = document.querySelector('#stage svg [data-prot]'); return !!(d && p && (d.compareDocumentPosition(p) & Node.DOCUMENT_POSITION_FOLLOWING)); }")
  check('C6G', ly, 'أين المركز؟: المنقلة فوق القرص المعبّأ (تُرى بتدريجها، المراجع A لدفعة U6/U5، 5)', ly)
  await run('m4.u6.d3', spec); st = await wk('tap')
  for _ in range(6):
    await tapk(False); st = await nxt(st)
    if st['res'] or st['err']: break
  st = await until(pg, lambda s: s['res'] or s['err'], 30000)
  rv = st; await pg.evaluate("() => hush()"); gi = await pg.evaluate("() => LDATA['m4.u6.d3'].flow.findIndex(s => s.scene === 'motion')"); await pg.evaluate("() => { LOG.attempts.length = 0; }"); await pg.evaluate(START, ['m4.u6.d3', gi, 'game']); await until(pg, lambda s: s['auto'] or s['res'], 20000); st = rv   # اللعبة بمشهدها (SCENES.motion)، لا بندٌ وحده
  lk = await pg.evaluate("() => { const on = MOTION_ON; show('home'); const b = document.querySelector('#bubble'), L = document.querySelector('#lesson'); return [on, MOTION_ON, !!document.querySelector('#stage .mhold'), L.classList.contains('dense'), b.style.minHeight || '']; }")
  check('C6G', lk == [True, False, False, False, ''], 'الخروج من اللعبة إلى الخريطة يُزيل حالها (المراجع B لدفعة U6/U5، 5)', lk)
  check('C6G', st['res'] and any(c.startswith('gen.c6.reveal.cen') for c in st['clips']) and not any(c.startswith('gen.ci4.reveal.ang') for c in st['clips']), 'أين المركز؟: الكشف بعد إخفاق الخطوة الأولى يُري المركز بأشعّته (المراجع A لدفعة U6/U5، 13)', [c for c in st['clips'] if 'reveal' in c])
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
      check('C6G', s2['res'] and not s2['err'] and 4 * items <= sum(per.values()) <= 6 * items, '%s (%d): كل جولةٍ بأخطائها حتى الكشف (أربعةٌ في الخطوة أو ستةٌ في الجولة) بلا خطأ في الصفحة' % (lid, i), [s2['res'], s2['err'], per])
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
  check('C7G', st['auto'] and st['auto']['kind'] == 'pick' and hp == 0, 'كوب الماء: الملء باقٍ بعد الخطأ فالمحاولة تبدأ من الكأس، وأول خطأٍ فيها سؤالٌ لا رسم', [st['auto'], hp])
  await pick(M['read']); st = await wk('pick', nn(st)); badl = [c for c in M['ch'] if c[0] != M['want']][0]; await pick(badl[0]); L = await logs()
  check('C7G', L[-1] == ['c7-cup', False, False, badl[1]], 'كوب الماء: القانون الخاطئ بوسمه', [L, badl])
  st = await nxt(st); await pg.wait_for_timeout(200); await pick(badl[0]); st = await nxt(st); await pg.wait_for_timeout(300); hp2 = await pg.evaluate(helps)
  check('C7G', hp2 > 0, 'كوب الماء: الخطأ الثاني في القانون المستوى الثاني رسماً', hp2)
  await pick(badl[0]); st = await nxt(st); await pg.wait_for_timeout(400); tg = await pg.evaluate("() => [document.querySelectorAll('#stage svg [data-help] text').length, (window.__clips || []).filter(c => /^gen\\.c7\\.together\\.vol/.test(c)).length]")
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
  check('C7G', L[:1] == [['c7-wrap', False, True, 'c7WrapMiss']], 'غلّف العلبة: الجانب وحده يترك وجهين (c7WrapMiss)', L)
  st = await wk('c7Wrap', nn(st)); await face('lid', 'base'); await done(); L = await logs()
  check('C7G', L[1:] == [['c7-wrap', False, False, 'saNoSide']], 'غلّف العلبة: القاعدتان بلا الجانب خطأ saNoSide', L)
  st = await wk('c7Wrap', nn(st)); await face('lid', 'side', 'base'); await done(); st = await wk('pick', nn(st)); bl = [c for c in M['lens'] if c[0] != M['len']][0]; await pick(bl[0]); L = await logs()
  check('C7G', L[-1] == ['c7-wrap', False, False, bl[1]], 'غلّف العلبة: الوجوه الثلاثة ثم الطول الخاطئ بوسمه', [L, bl])
  h1 = await pg.evaluate("() => document.querySelectorAll('#stage svg [data-help]').length")
  for _ in range(2): st = await nxt(st); await pg.wait_for_timeout(200); await pick(bl[0])   # درجة السلّم بأخطاء الخطوة الجارية: ثلاثة أخطاء في الطول ثم الحلّ المشترك
  st = await nxt(st); await pg.wait_for_timeout(300); tg = await pg.evaluate("() => [document.querySelectorAll('#stage svg [data-face][role=button]').length, document.querySelectorAll('#stage svg [data-help] text').length]")
  await pick(M['len']); st = await wk('pick', nn(st)); await pick(M['want']); r = await res(); L = await logs()
  check('C7G', tg[0] == 0 and tg[1] > 0 and r['res'] and r['res']['ok'] and L[-1] == ['c7-wrap', True, False, None], 'غلّف العلبة: التغليف باقٍ بعد الخطأ، والحلّ المشترك في الطول بعد ثلاثة أخطاء فيه، ثم الورق كله', [tg, r['res'], L])
  spec = {'t': 'c7Wrap', 'r': 2, 'h': 7, 'lid': False, 'q': 'wr.03'}; M = await pg.evaluate("(s) => ITEM.c7Wrap.make(s)", spec); await run('m4.u7.d2', spec); st = await wk('c7Wrap')
  fs = await pg.evaluate("() => [...document.querySelectorAll('#stage svg [data-face]')].map(g => g.dataset.face + g.dataset.need).sort()"); await face('side', 'base', 'lid'); await done(); L0 = await logs()
  st = await wk('c7Wrap', nn(st)); await face('side', 'base'); await done(); st = await wk('pick', nn(st)); await pick(M['len']); st = await wk('pick', nn(st))
  lid = [c for c in M['ch'] if c[1] == 'saLidAdd']; await pick(lid[0][0] if lid else -1); L = await logs()
  check('C7G', fs == ['base1', 'lid0', 'side1'] and L0 == [['c7-wrap-open', False, True, 'saLidAdd']] and bool(lid) and L[-1] == ['c7-wrap-open', False, False, 'saLidAdd'], 'غلّف العلبة: فتحة العلبة المفتوحة وجهٌ يُلمس ولا يُغلَّف (saLidAdd)، وإضافة الغطاء في الورق خطأ saLidAdd', [fs, L0, M['ch'], L])
  # ---- ثلاثة مخاريط وأسطوانة
  spec = {'t': 'c7Thirds', 'fig': 'cone', 'V': 36, 'q': 'fl.01'}; M = await pg.evaluate("(s) => ITEM.c7Thirds.make(s)", spec); await run('m4.u7.d3', spec); st = await wk('c7Pour')
  await press(1, 2); await done(); st = await wk('c7Pour', nn(st)); await press(1, 4); await done(); L = await logs()
  check('C7G', [x[3] for x in L] == ['c7PourShort', 'c7PourOver'], 'ثلاثة مخاريط: تعبئتان قبل الامتلاء خطأ، وأربعٌ تفيض خطأ', L)
  st = await wk('c7Pour', nn(st)); await press(1, 3); await done(); st = await wk('pick', nn(st)); bt = [c for c in M['ch'] if c[0] != M['want']][0]; await pick(bt[0])
  st = await nxt(st); await pg.wait_for_timeout(300); k4 = st['auto']['kind'] if st['auto'] else None; await pick(M['want']); r = await res(); L = await logs()
  check('C7G', L[2][3] == bt[1] and k4 == 'pick' and r['res'] and r['res']['ok'], 'ثلاثة مخاريط: ثلاث تعبئات ثم الحساب، والتعبئة باقيةٌ بعد خطأ الحساب', [L, bt, k4])
  spec = {'t': 'c7Thirds', 'fig': 'cone', 'v': 14, 'q': 'fl.03'}; await run('m4.u7.d3', spec); st = await wk('c7Pour'); await press(1, 3); await done(); st = await wk('pick', nn(st)); await pick(42); r = await res(); L = await logs()
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
      check('C7G', s2['res'] and not s2['err'] and 4 * items <= sum(per.values()) <= 6 * items, '%s (%d): كل جولةٍ بأخطائها حتى الكشف (أربعةٌ في الخطوة أو ستةٌ في الجولة) بلا خطأ في الصفحة' % (lid, i), [s2['res'], s2['err'], per])
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

# مساعدة الخطوة تُمحى حين تُنجز: في كل بندٍ من الألعاب الحركية لـ م4، خطآن في الخطوة الأولى (المستوى الثاني منقول) ثم صوابها، فلا [data-help] في انتظار الخطوة الثانية
async def helpg(b):
  """المراجع B لدفعة ألعاب U8/U7، 2: كانت تبقى في الألعاب السبع فتشير إلى مشتّت الخطوة التالية أو تغطّي معطاها"""
  ctx, pg, errs = await page(b)
  items = await pg.evaluate("() => Object.keys(LDATA).filter(l => /^m4\\./.test(l)).flatMap(l => LDATA[l].flow.filter(s => s.scene === 'motion').flatMap(s => s.items.map(it => [l, it])))")
  nn = lambda st: st['auto']['n'] if st and st.get('auto') else -1
  async def nxt(after): return await until(pg, lambda s: s['res'] or s['err'] or (s['auto'] and s['auto']['n'] != after), 20000)
  bad, seen = [], 0
  for lid, spec in items:
    await pg.evaluate("() => { hush(); LOG.attempts.length = 0; }"); await pg.evaluate(START, [lid, spec, 'practice']); st = await nxt(-1)
    if not st or not st.get('auto'): continue
    k0 = st['auto']['kind']
    for _ in range(2): await pg.evaluate("() => window.__auto && window.__auto.wrong()"); st = await nxt(nn(st))
    if not st or not st.get('auto') or st['auto']['kind'] != k0: continue
    s0 = await pg.evaluate("() => window.__item ? window.__item.step : null"); await pg.evaluate("() => window.__auto && window.__auto.ok()"); st = await nxt(nn(st))
    if not st or not st.get('auto'): continue
    await pg.wait_for_timeout(120); s1, h = await pg.evaluate("() => [window.__item ? window.__item.step : null, document.querySelectorAll('#stage svg [data-help]').length]")
    if s0 is None or s1 is None or s1 <= s0: continue
    seen += 1
    if h: bad.append([lid, spec.get('t'), s0, s1, h])
    await pg.evaluate("() => { hush(); show('home'); }")
  check('HELPG', seen >= 20 and not bad, 'مساعدة الخطوة الأولى (خطآن ثم صوابها) لا تبقى في انتظار الخطوة الثانية، في %d بنداً' % seen, bad[:6])
  check('HELPG', not errs, 'بلا خطأ في الصفحة', errs[:2]); await ctx.close()

# الرسم ثابتٌ بين انتظارات الجولة في اللعبة الحركية نفسها (SCENES.motion): موضعه ومقياسه حين تتبدّل الأزرار تحته
async def holdg(b):
  """المراجع B لدفعة ألعاب U8/U7، 4: نزل 24 بكسلاً وصعد 59 على iPhone SE، و80 مع تصغيرٍ على Pixel 5، بين خطوات الجولة"""
  for vp in ((320, 568), (393, 727), (393, 851), (640, 360)):
    ctx = await b.new_context(viewport={'width': vp[0], 'height': vp[1]}); pg = await ctx.new_page(); errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
    mix = vp == (393, 727)   # Pixel 5: بالأخطاء أيضاً لا بالطريق الصحيح وحده (المراجع B لدفعة U6/U5، 4)
    await pg.goto('file://' + FILE + '#fast&seed=5'); await pg.wait_for_timeout(250)
    await pg.evaluate("""([kid]) => { localStorage.clear(); localStorage.setItem('hp_kids', JSON.stringify([kid])); localStorage.setItem('hp_kid', JSON.stringify(kid.id));
      localStorage.setItem('hp_settings:' + kid.id, JSON.stringify({ sessionMax: 0, muted: true })); localStorage.setItem('hp_prog:' + kid.id, JSON.stringify({ schema: 3, unlockAll: true })); }""", [KID])
    await pg.reload(); await pg.wait_for_timeout(400)
    games = await pg.evaluate("() => Object.keys(LDATA).filter(l => /^m4\\./.test(l)).flatMap(l => LDATA[l].flow.map((s, i) => [l, i, s.scene]).filter(x => x[2] === 'motion'))")
    bad, n = [], 0
    for lid, i0, _ in games:
      await pg.evaluate("() => { hush(); }"); await pg.evaluate(START, [lid, i0, 'game']); last, per = -1, {}
      for _ in range(400):
        st = await pg.evaluate(ST)
        if st['res'] or st['err']: break
        a = st['auto']
        if a and a['n'] != last:
          last = a['n']; await pg.wait_for_timeout(80)
          g = await pg.evaluate("() => { const sv = document.querySelector('#stage svg'), r = sv && sv.getBoundingClientRect(); return [window.__itemSeq || 0, r ? Math.round(r.top) : null, r ? Math.round(r.height) : null]; }")
          per.setdefault(g[0], []).append(g[1:]); n += 1
          await pg.evaluate("(w) => window.__auto && (w && window.__auto.wrong ? window.__auto.wrong() : window.__auto.ok())", mix and n % 2 == 0)
        await pg.wait_for_timeout(30)
      for seq, v in per.items():
        if len(v) > 1 and (max(x[0] for x in v) - min(x[0] for x in v) > 2 or max(x[1] for x in v) - min(x[1] for x in v) > 2): bad.append([lid, seq, v[:5]])
    check('HOLDG', n > 40 and not bad, '%dx%d: الرسم في موضعه ومقياسه بين انتظارات الجولة في الألعاب الحركية (%d انتظاراً)' % (vp[0], vp[1], n), bad[:5])
    # الفقاعة لا تنمو بلا حدّ إن بدأت اللعبة والدرس كثيف (المراجع B لدفعة U6/U5، 1)، والخروج إلى الخريطة لا يترك حال اللعبة (5)
    gr = []
    for lid, i0, _ in games[:4]:
      await pg.evaluate("() => { hush(); }"); await pg.evaluate("() => { const L = document.querySelector('#lesson'); if (L) L.classList.add('dense'); }"); await pg.evaluate(START, [lid, i0, 'game'])
      await pg.wait_for_timeout(700); h0 = await pg.evaluate("() => Math.round(document.querySelector('#bubble').getBoundingClientRect().height)"); await pg.wait_for_timeout(1800)
      h1 = await pg.evaluate("() => Math.round(document.querySelector('#bubble').getBoundingClientRect().height)")
      if h1 - h0 > 30 or h1 > 300: gr.append([lid, h0, h1])
    check('HOLDG', not gr, '%dx%d: الفقاعة لا تنمو حين تبدأ اللعبة والدرس كثيف' % vp, gr)
    await pg.evaluate("() => { hush(); }"); await pg.evaluate(START, [games[0][0], games[0][1], 'game']); await until(pg, lambda s: s['auto'] or s['res'], 20000)
    lk = await pg.evaluate("() => { show('home'); const b = document.querySelector('#bubble'), L = document.querySelector('#lesson'); return [MOTION_ON, !!document.querySelector('#stage .mhold'), L.classList.contains('dense'), b.style.minHeight || '', L.style.alignContent || '']; }")
    check('HOLDG', lk == [False, False, False, '', ''], '%dx%d: الخروج من اللعبة إلى الخريطة يُزيل حالها (MOTION_ON والحجز والكثيف وارتفاع الفقاعة)' % vp, lk)
    check('HOLDG', not errs, 'بلا خطأ في الصفحة (%dx%d)' % vp, errs[:2]); await ctx.close()

# درجات السلّم في كل خطوة: لكل بندٍ حركي في م4 ولكل خطوةٍ s فيه، ما قبلها صحيح ثم أربعة أخطاء فيها حتى الكشف؛ وفحص TEXTOV (من auto_run) في كل انتظار وبعد الكشف
async def rungg(b):
  """المراجع B لدفعة ألعاب U8/U7، 3 و8: السائقون يخطئون في الخطوة الأولى دائماً، فلا يبلغ فحصٌ الدرجات اللاحقة في الخطوات اللاحقة (نصٌّ فوق نصّ، والكشف فوق الحلّ المشترك)"""
  import re as _re
  TX = _re.search(r'^TEXTOV = """(.*?)"""', open(os.path.join(os.path.dirname(os.path.abspath(__file__)), 'auto_run.py')).read(), _re.S | _re.M).group(1)
  ctx = await b.new_context(viewport={'width': 320, 'height': 568}); pg = await ctx.new_page(); errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
  await pg.goto('file://' + FILE + '#fast&seed=5'); await pg.wait_for_timeout(250)
  await pg.evaluate("""([kid]) => { localStorage.clear(); localStorage.setItem('hp_kids', JSON.stringify([kid])); localStorage.setItem('hp_kid', JSON.stringify(kid.id));
    localStorage.setItem('hp_settings:' + kid.id, JSON.stringify({ sessionMax: 0, muted: true })); localStorage.setItem('hp_prog:' + kid.id, JSON.stringify({ schema: 3, unlockAll: true })); }""", [KID])
  await pg.reload(); await pg.wait_for_timeout(400)
  only = os.environ.get('RUNG_ONLY', 'm4.u5.,m4.u6.,m4.u7.,m4.u8.,m4.u9.').split(',')
  await pg.evaluate("(src) => { window.__tx = eval('(' + src + ')'); window.__onReveal = () => { window.__revTX = (window.__revTX || []).concat(window.__tx()); }; }", TX)   # المسرح بعد الكشف مباشرةً، قبل أن يبدأ التوأم
  items = await pg.evaluate("(only) => Object.keys(LDATA).filter(l => only.some(o => l.startsWith(o))).flatMap(l => LDATA[l].flow.filter(s => s.scene === 'motion').flatMap(s => s.items.map(it => [l, it])))", only)
  bad, n = {}, 0
  for lid, spec in items:
    for S in range(5):
      await pg.evaluate("() => { hush(); show('home'); window.__revTX = null; }"); await pg.evaluate(START, [lid, spec, 'practice']); last, wr, reached = -1, 0, False
      for _ in range(500):
        st = await pg.evaluate("() => [window.__auto ? window.__auto.n : null, window.__item ? window.__item.step : null, window.__res, window.__err]")
        if st[2] or st[3]: break
        if st[0] is not None and st[0] != last:
          last = st[0]; await pg.wait_for_timeout(60)
          if st[1] is not None and st[1] < S and wr == 0: await pg.evaluate("() => window.__auto.ok()"); continue
          if wr >= 4: await pg.evaluate("() => window.__auto.ok()"); continue   # التوأم بعد الكشف يُجاب صحيحاً
          reached = True; n += 1
          for f in await pg.evaluate(TX):
            if f.startswith('نصٌّ فوق نقطة') and not lid.startswith(('m4.u5.', 'm4.u6.', 'm4.u7.', 'm4.u8.', 'm4.u9.', 'm4.u10.')): continue
            bad.setdefault((lid, spec.get('t'), S, f[:60]), wr)
          await pg.evaluate("() => window.__auto.wrong()"); wr += 1
        await pg.wait_for_timeout(25)
      if reached and wr >= 4:
        await pg.wait_for_timeout(150)
        for f in (await pg.evaluate("() => window.__revTX") or []):
          if f.startswith('نصٌّ فوق نقطة') and not lid.startswith(('m4.u5.', 'm4.u6.', 'm4.u7.', 'm4.u8.', 'm4.u9.', 'm4.u10.')): continue
          bad.setdefault((lid, spec.get('t'), S, f[:60]), 'كشف')
      if not reached: break
  B = [list(k) + [v] for k, v in bad.items()]
  if os.environ.get('RUNG_OUT'): json.dump(B, open(os.environ['RUNG_OUT'], 'w'), ensure_ascii=False, indent=0)   # القائمة كاملة
  check('RUNGG', n > (200 if 'RUNG_ONLY' not in os.environ else 10) and not B, 'لا نصّ فوق نصّ ولا خارج الإطار ولا مساعدة تغطّي معطًى في درجات السلّم لكل خطوة، ولا بعد الكشف (%d انتظاراً)' % n, B[:40])
  check('RUNGG', not errs, 'بلا خطأ في الصفحة', errs[:2]); await ctx.close()

# ما تدّعيه ألعاب U8/U7 ولا يقتله فحص (المراجع B لدفعة ألعاب U8/U7، 8: الطفرات الحيّة L1–L13): الترتيب والفتحة والكأس واللترات و«تمّ» بلا طبقة والعدّ
async def g87m(b):
  """القوسان والتقاطعان بأيّ ترتيب، والأقواس بنصف قطرٍ واحد، والكأس بحجمه، ولترات الطبقة، و«تمّ» بلا طبقة لا يُحسب، والعدّ المكتوب = __c7N"""
  ctx, pg, errs = await page(b)
  async def run(lid, spec): await pg.evaluate("() => { hush(); LOG.attempts.length = 0; }"); await pg.evaluate(START, [lid, spec, 'practice'])
  async def wk(kind, after=-1): return await until(pg, lambda s: s['res'] or s['err'] or (s['auto'] and s['auto']['kind'] == kind and s['auto']['n'] != after), 20000)
  nn = lambda st: st['auto']['n'] if st and st.get('auto') else -1
  async def spot(k): await pg.evaluate("(k) => { const g = document.querySelector('#stage svg [data-spot=\"' + k + '\"]'); if (g) g.dispatchEvent(new MouseEvent('click', { bubbles: true })); }", k); await pg.wait_for_timeout(250)
  okk = "() => [...document.querySelectorAll('#stage svg [data-spot]')].filter(g => g.dataset.ok === 'true').map(g => g.dataset.spot)"
  async def opt(k): await pg.evaluate("(k) => { const b = [...document.querySelectorAll('#stage .choices .pick')].find(x => x.dataset.k === k); if (b) b.click(); }", k); await pg.wait_for_timeout(300)
  # صائد المنصّف: الرأس، ثم ب أولاً، فالمطلوب أ (L1)
  await run('m4.u8.d1', {'t': 'c8BisMake', 'deg': 80}); st = await wk('tap'); await spot('V'); st = await wk('tap', nn(st))
  ns = await pg.evaluate("() => [...document.querySelectorAll('#stage svg [data-spot]')].map(g => g.dataset.spot)")
  check('G87M', sorted(ns) == ['A', 'B', 'F1', 'V'], 'صائد المنصّف: نقاط الخطوة السابقة تُزال، فلا يبقى إلا مرشّحو الخطوة الجارية', ns)
  await spot('B'); st = await wk('pick', nn(st)); await opt('keep'); st = await wk('tap', nn(st))   # الفتحة تُبقى ثم القوس الآخر
  f, o2 = await pg.evaluate("() => window.__item ? window.__item.first : null"), await pg.evaluate(okk)
  check('G87M', f == 'B' and o2 == ['A'], 'صائد المنصّف: القوس الأول من ب، فالثاني من أ (بأيّ ترتيب)', [f, o2])
  # أين المنتصف؟: أ ثم ب، ثم التقاطع العلوي أولاً فالمطلوب السفلي (L2)، والأقواس كلها بنصف قطرٍ واحد (L3)
  await run('m4.u8.d2', {'t': 'c8PbMake', 'half': 4, 'h': 3}); st = await wk('pick'); await opt('long'); st = await wk('tap', nn(st)); await spot('A'); st = await wk('tap', nn(st)); await spot('B'); st = await wk('tap', nn(st))
  rs = await pg.evaluate("() => [...new Set([...document.querySelectorAll('#stage svg path[data-arc]')].map(p => { const m = /A\\s*([\\d.]+)/.exec(p.getAttribute('d') || ''); return m ? Math.round(+m[1] * 10) / 10 : null; }))]")
  check('G87M', len(rs) == 1 and rs[0], 'أين المنتصف؟: أقواس الطرفين الأربعة بنصف قطرٍ واحد (بالفتحة نفسها)', rs)
  await spot('X1'); st = await wk('tap', nn(st)); x1, o3 = await pg.evaluate("() => window.__item ? window.__item.x1 : null"), await pg.evaluate(okk)
  check('G87M', x1 == 'X1' and o3 == ['X2'], 'أين المنتصف؟: التقاطع الأول محفوظ، فالمطلوب بعده الآخر (بأيّ ترتيب)', [x1, o3])
  # كوب الماء: «تمّ» بلا طبقة لا يُحسب (L7)، ثم الكأس بعد الصبّ بحجم الأسطوانة (L5)
  spec = {'t': 'c7Cup', 'r': 2, 'h': 7, 'q': 'cp.01'}; await run('m4.u7.d1', spec); st = await wk('c7Fill')
  await pg.evaluate("() => { const d = document.querySelector('#stage .pick.done'); if (d) d.click(); }"); await pg.wait_for_timeout(500); st2 = await pg.evaluate(ST); n0 = await pg.evaluate("() => LOG.attempts.length")
  check('G87M', n0 == 0 and st2['auto'] and st2['auto']['kind'] == 'c7Fill' and st2['auto']['n'] == nn(st), 'الملء: «تمّ» بلا طبقة لا يُحسب جواباً ولا يمضي', [n0, st2['auto']])
  await pg.evaluate("() => window.__auto.ok()"); st = await wk('pick', nn(st)); await pg.wait_for_timeout(300)
  v = await pg.evaluate("(s) => { const G = c7CupGeo(ITEM.c7Cup.make(s)), r = document.querySelector('#stage svg [data-jw] rect'); if (!r) return null; return [(+r.getAttribute('height') + 2) / (G.J.y1 - G.J.y0) * G.jTop, G.V]; }", spec)
  check('G87M', v and abs(v[0] - v[1]) < .02 * v[1], 'كوب الماء: الكأس بعد الصبّ بحجم الأسطوانة', v)
  # ثلاثة مخاريط: العدّ المكتوب بعد كل تعبئة = ما صُبّ (L10)
  await run('m4.u7.d3', {'t': 'c7Thirds', 'fig': 'cone', 'V': 36, 'q': 'fl.01'}); st = await wk('c7Pour'); cn = []
  for _ in range(2):
    await pg.evaluate("() => { const b = document.querySelectorAll('#stage .choices.icons .pick')[1]; if (b) b.click(); }"); await pg.wait_for_timeout(300)
    cn.append(await pg.evaluate("() => [window.__c7N ? window.__c7N() : null, [...document.querySelectorAll('#stage svg text')].map(t => t.textContent).filter(t => / ×$/.test(t))]"))
  check('G87M', all(c[1] == [str(c[0]).translate(str.maketrans('0123456789', '٠١٢٣٤٥٦٧٨٩')) + ' ×'] for c in cn), 'ثلاثة مخاريط: العدّ المكتوب هو ما صُبّ', cn)
  # محوّل الخزان: لترات الطبقة المكتوبة = الطول × العرض × 10 ÷ 1000 (L6)
  spec = {'t': 'c7Tank', 'a': 30, 'b': 20, 'c': 40, 'to': 'cm3'}; await run('m4.u7.d4', spec); st = await wk('c7Tank')
  per, tx = await pg.evaluate("(s) => c7TankGeo(ITEM.c7Tank.make(s)).per", spec), await pg.evaluate("() => [...document.querySelectorAll('#stage svg text')].map(t => t.textContent)")
  w = str(per).replace('.', '٫').translate(str.maketrans('0123456789', '٠١٢٣٤٥٦٧٨٩'))
  tx = [re.sub('[\u064b-\u0652]', '', t) for t in tx]
  check('G87M', per == 30 * 20 * 10 / 1000 and any(('= ' + w + ' لتر') in t or ('= ' + str(per).rstrip('0').rstrip('.') + ' لتر') in t for t in tx), 'محوّل الخزان: لترات الطبقة المكتوبة صحيحة (%s)' % w, [per, [t for t in tx if 'لتر' in t]])
  # غلّف العلبة: بعد «تمّ» لا وجه هدفاً (L8)
  await run('m4.u7.d2', {'t': 'c7Wrap', 'r': 2, 'h': 6, 'rk': 0, 'q': 'wr.01'}); st = await wk('c7Wrap'); await pg.evaluate("() => window.__auto.ok()"); st = await wk('pick', nn(st))
  nf = await pg.evaluate("() => document.querySelectorAll('#stage svg [data-face][role=button], #stage svg [data-face][tabindex]').length")
  check('G87M', nf == 0, 'غلّف العلبة: الوجوه ليست أهدافاً بعد «تمّ»', nf)
  # صائد الوتر: لمسةٌ على 14 بكسلاً داخل المثلث من ضلعٍ قائم له لا للوتر، وعلى 14 من الوتر للوتر (خارج شريط الخطّ نفسه) (المراجع B، 5)
  await run('m4.u8.d3', {'t': 'c8HypHunt', 'a': 4, 'b': 3, 'hy': 5, 'fn': 'sin'}); st = await wk('tap')
  rt = await pg.evaluate("""() => { const G = [...document.querySelectorAll('#stage svg g[role=button]')], seg = g => { const l = g.querySelector('line'), sv = g.ownerSVGElement, m = sv.getScreenCTM(); return [[+l.getAttribute('x1'), +l.getAttribute('y1')], [+l.getAttribute('x2'), +l.getAttribute('y2')]].map(p => new DOMPoint(p[0], p[1]).matrixTransform(m)); };
      const S = G.map(g => [g, seg(g)]), hz = S.find(([, [P, Q]]) => Math.abs(P.y - Q.y) < 1), hy = S.find(([, [P, Q]]) => Math.abs(P.y - Q.y) > 1 && Math.abs(P.x - Q.x) > 1); if (!hz || !hy) return null;
      const [P, Q] = hz[1], M = [(P.x + Q.x) / 2, (P.y + Q.y) / 2 - 14], [A, B] = hy[1], H = [(A.x + B.x) / 2, (A.y + B.y) / 2], nx = -(B.y - A.y), ny = B.x - A.x, L = Math.hypot(nx, ny), s = ((M[0] - H[0]) * nx + (M[1] - H[1]) * ny) > 0 ? 1 : -1, H7 = [H[0] + s * 14 * nx / L, H[1] + s * 14 * ny / L];
      return [G[0].__route(M[0], M[1]) === hz[0], G[0].__route(H7[0], H7[1]) === hy[0]]; }""")
  check('G87M', rt == [True, True], 'صائد الوتر: اللمسة لأقرب ضلعٍ إلى الإصبع', rt)
  check('G87M', not errs, 'بلا خطأ في الصفحة', errs[:2]); await ctx.close()

# الحلّ المشترك في كل خطوة: لكل بندٍ حركي في م4 ولكل خطوةٍ s، ما قبلها صحيح ثم ثلاثة أخطاء فيها، فالمحاولة الرابعة فيها مساعدةٌ مرسومة ([data-help]) أو حالٌ أكملناها
async def togg(b):
  """المراجع B لدفعة ألعاب U8/U7، 7 و8 (L11–L13): الحلّ المشترك فارغٌ في خطوات التقاطع، ولا فحص يرى الحلّ المشترك في الخطوات اللاحقة"""
  ctx, pg, errs = await page(b)
  only = os.environ.get('RUNG_ONLY', 'm4.u5.,m4.u6.,m4.u7.,m4.u8.').split(',')
  items = await pg.evaluate("(only) => Object.keys(LDATA).filter(l => only.some(o => l.startsWith(o))).flatMap(l => LDATA[l].flow.filter(s => s.scene === 'motion').flatMap(s => s.items.map(it => [l, it])))", only)
  # حلٌّ مشترك بالحال لا بالرسم: الربعان الباقيان، ونقطةٌ مُبعَدة، وحركةٌ واحدة باقية، وطبقةٌ قبل الحافّة، وما عدا القاع مغلَّف
  STATE_TG = {('c5Hunt', 0), ('c5Line', 2), ('c6ChordGame', 0), ('c6TanGame', 0), ('c7Cup', 0), ('c7Wrap', 0), ('c7Thirds', 0), ('c7Tank', 0)}
  bad, n = [], 0
  for lid, spec in items:
    for S in range(5):
      await pg.evaluate("() => { hush(); LOG.attempts.length = 0; }"); await pg.evaluate(START, [lid, spec, 'practice']); last, wr, got = -1, 0, None
      for _ in range(400):
        st = await pg.evaluate("() => [window.__auto ? window.__auto.n : null, window.__item ? window.__item.step : null, window.__res, window.__err, window.__auto ? window.__auto.kind : null]")
        if st[2] or st[3]: break
        if st[0] is not None and st[0] != last:
          last = st[0]; await pg.wait_for_timeout(80)
          if st[1] is not None and st[1] < S and wr == 0: await pg.evaluate("() => window.__auto.ok()"); continue
          if wr == 3: got = await pg.evaluate("() => [document.querySelectorAll('#stage svg [data-help]').length, (window.__clips || []).slice(-3).join(' ')]"); got.append(st[4]); break
          await pg.evaluate("() => window.__auto.wrong()"); wr += 1
        await pg.wait_for_timeout(25)
      if got is None:
        if wr == 0: break
        continue
      n += 1
      if not got[0] and (spec.get('t'), S) not in STATE_TG: bad.append([lid, spec.get('t'), S, got[2], got[1][-60:]])
  if os.environ.get('RUNG_OUT'): json.dump(bad, open(os.environ['RUNG_OUT'], 'w'), ensure_ascii=False)
  check('TOGG', n > (60 if 'RUNG_ONLY' not in os.environ else 2) and not bad, 'الحلّ المشترك يرسم مساعدته في كل خطوة (%d خطوة)' % n, bad[:12])
  check('TOGG', not errs, 'بلا خطأ في الصفحة', errs[:2]); await ctx.close()

# X-01 في خطوات الألعاب الحركية: لمستان حقيقيتان بالإصبع بفاصل 150 م.ث (نمط #test، فالحارس معطّل في السريع) على «تمّ» أو على خيارٍ صحيح في خطوةٍ وسطى
async def x01g(b):
  """الثانية لا تجيب سؤال الخطوة التالية: السجلّ فارغ والخطوة تقدّمت واحدةً فقط (المراجع B لدفعة ألعاب U8/U7، 1: أجابت الثانية في 54 من 63 تجربة)"""
  ctx = await b.new_context(viewport={'width': 320, 'height': 568}, has_touch=True, is_mobile=True, device_scale_factor=2); pg = await ctx.new_page(); errs = []; pg.on('pageerror', lambda e: errs.append(str(e)))
  await pg.goto('file://' + FILE + '#test&seed=5'); await pg.wait_for_timeout(250)
  await pg.evaluate("""([kid]) => { localStorage.clear(); localStorage.setItem('hp_kids', JSON.stringify([kid])); localStorage.setItem('hp_kid', JSON.stringify(kid.id));
    localStorage.setItem('hp_settings:' + kid.id, JSON.stringify({ sessionMax: 0, muted: true })); localStorage.setItem('hp_prog:' + kid.id, JSON.stringify({ schema: 3, unlockAll: true })); }""", [KID])
  await pg.reload(); await pg.wait_for_timeout(400)
  async def run(lid, spec): await pg.evaluate("() => { LOG.attempts.length = 0; }"); await pg.evaluate(START, [lid, spec, 'practice'])
  async def wk(kind, after=-1): return await until(pg, lambda s: s['res'] or s['err'] or (s['auto'] and s['auto']['kind'] == kind and s['auto']['n'] != after), 40000)
  nn = lambda st: st['auto']['n'] if st and st.get('auto') else -1
  async def dbl(sel):
    xy = await pg.evaluate("(sel) => { const e = document.querySelector(sel); if (!e) return null; const r = e.getBoundingClientRect(); return [r.left + r.width / 2, r.top + r.height / 2]; }", sel)
    if not xy: return False
    await pg.wait_for_timeout(700); await pg.touchscreen.tap(*xy); await pg.wait_for_timeout(150); await pg.touchscreen.tap(*xy); await pg.wait_for_timeout(1500); return True
  async def state(): return await pg.evaluate("() => [window.__item ? window.__item.step : null, LOG.attempts.map(a => [a.ok, a.err, a.ans])]")
  # كوب الماء: القراءة الصحيحة مرّتين (الخيارات التالية في مكانها)
  await run('m4.u7.d1', {'t': 'c7Cup', 'r': 2, 'h': 7, 'q': 'cp.01'}); st = await wk('c7Fill'); await pg.evaluate("() => window.__auto.ok()"); st = await wk('pick', nn(st))
  t = await dbl("#stage .choices .pick[data-ok=true]"); s1 = await state()
  check('X01G', t and s1[0] == 2 and not s1[1], 'كوب الماء: لمستان على القراءة الصحيحة تقدّمان خطوةً واحدة ولا تجيبان سؤال القانون', s1)
  # ثلاثة مخاريط: «تمّ» مرّتين بعد ثلاث تعبئات
  await pg.evaluate("() => hush()"); await run('m4.u7.d3', {'t': 'c7Thirds', 'fig': 'cone', 'V': 36, 'q': 'fl.01'}); st = await wk('c7Pour')
  for _ in range(3): await pg.evaluate("() => { const b = document.querySelectorAll('#stage .choices.icons .pick')[1]; if (b) b.click(); }"); await pg.wait_for_timeout(1300)
  t = await dbl("#stage .pick.done"); s2 = await state()
  check('X01G', t and s2[0] == 1 and not s2[1], 'ثلاثة مخاريط: «تمّ» مرّتين يقدّم خطوةً واحدة ولا يجيب سؤال الحساب', s2)
  # صائد الكنز: لمستان على الربع الصحيح لا تضعان نقطةً في الخطوة التالية (المراجع B لدفعة U6/U5، 3)
  await pg.evaluate("() => hush()"); await run('m4.u5.d1', {'t': 'c5Hunt', 'x': -3, 'y': 2, 'q': 'ht.01'}); st = await wk('tap')
  t = await dbl("#stage svg [role=button][data-ok=true]"); s3 = await state(); pl = await pg.evaluate("() => window.__axPlaced || 0")
  check('X01G', t and s3[0] == 1 and not s3[1] and pl == 0, 'صائد الكنز: لمستان على الربع تقدّمان خطوةً ولا تضعان نقطة', [s3, pl])
  check('X01G', not errs, 'بلا خطأ في الصفحة', errs[:2]); await ctx.close()

async def main():
  async with async_playwright() as p:
    b = await p.chromium.launch()
    for k, f in (('STORY', story), ('MINUS', minus), ('OFFER', offer), ('FRAME', frame), ('TEN', ten), ('DRAW', draw), ('C9G', c9g), ('C8G', c8g), ('C7G', c7g), ('C6G', c6g), ('C5G', c5g), ('X01G', x01g), ('HELPG', helpg), ('HOLDG', holdg), ('RUNGG', rungg), ('G87M', g87m), ('TOGG', togg), ('PFL', pfl)):
      if not on(k): continue
      try: await f(b)
      except Exception as e: check(k, False, 'توقّف القسم باستثناء', str(e)[:300])   # (على النسخة القديمة يمضي البند إلى «كم؟» فلا تُلمس أزرار البناء)
    await b.close()
  print('FAILS: %d' % len(FAILS)); sys.exit(1 if FAILS else 0)
asyncio.run(main())
