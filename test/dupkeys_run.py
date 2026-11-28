# مفتاحٌ مكرّر في قاموسٍ واحد بمولّدات المحتوى يغلب أخيرُه أوّلَه بلا خطأ: أسئلة جولات «أين المستقيم؟» محت اكتشاف درسها (ln.01–03)، و«ثلاثة مخاريط» إشعالَ درسها (th.01–03)
# (المراجع A لدفعة الألعاب U6/U5، 1 و2). يفحص كل قاموسٍ حرفيّ في tools/**.py ويخرج بـ 1 مع أي تكرار
import ast, glob, os, sys
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
bad = []
for f in sorted(glob.glob(os.path.join(ROOT, 'tools', '**', '*.py'), recursive=True)):
  try: t = ast.parse(open(f, encoding='utf8').read())
  except SyntaxError as e: bad.append('%s: لا يُقرأ (%s)' % (os.path.relpath(f, ROOT), e)); continue
  for n in ast.walk(t):
    if isinstance(n, ast.Dict):
      seen = {}
      for k in n.keys:
        if isinstance(k, ast.Constant):
          if k.value in seen: bad.append('%s:%d: المفتاح «%s» مكرّر (أوّله في السطر %d)' % (os.path.relpath(f, ROOT), k.lineno, k.value, seen[k.value]))
          else: seen[k.value] = k.lineno
for b in bad: print('FAIL', b)
print('dupkeys: %d' % len(bad)); sys.exit(1 if bad else 0)
