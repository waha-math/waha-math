# يولّد docs/SCENES_m2.md: كتالوج مشاهد المرحلة 2 وأنواع بنودها من الكود نفسه (التعليق الذي يسبق كل تعريف)، ومواضع استعمالها في content/m2.
# التشغيل: python3 tools/scenes_m2_doc.py  (يُعاد بعد كل بوابة؛ لا يُعدَّل الملف الناتج باليد)
import os, re, json, glob
ROOT = os.path.abspath(os.path.join(os.path.dirname(os.path.abspath(__file__)), '..'))
files = sorted(glob.glob(ROOT + '/src/js/49_m2_*.js'))
DEF = re.compile(r'^(SCENES|ITEM)\.(\w+)\s*=', re.M)
def comment_before(src, pos):
    head = src[:pos].rstrip()
    if not head.endswith('*/'): return ''
    i = head.rfind('/*')
    c = head[i + 2:-2].strip()
    c = re.sub(r'^=+\s*|\s*=+$', '', c).strip()
    return re.sub(r'\s+', ' ', c)
defs = {}
for f in files:
    src = open(f, encoding='utf8').read()
    for m in DEF.finditer(src):
        kind, name = m.group(1), m.group(2)
        c = comment_before(src, m.start())
        if not c:   # وإلا فأول تعليق في سطر التعريف أو السطرين بعده
            seg = src[m.start():].split('\n', 3); seg = '\n'.join(seg[:3]); cm = re.search(r'/\*(?!T\*/)(?!/T\*/)(.*?)\*/', seg, re.S)
            c = re.sub(r'\s+', ' ', cm.group(1)).strip() if cm and not cm.group(1).startswith('T') else ''
        defs.setdefault((kind, name), (os.path.basename(f), src[:m.start()].count('\n') + 1, c))
use = {}
def walk(x, where):
    if isinstance(x, dict):
        if isinstance(x.get('scene'), str): use.setdefault(('SCENES', x['scene']), set()).add(where)
        if isinstance(x.get('t'), str): use.setdefault(('ITEM', x['t']), set()).add(where)
        for v in x.values(): walk(v, where)
    elif isinstance(x, list):
        for v in x: walk(v, where)
for p in sorted(glob.glob(ROOT + '/content/m2/u*/d*.json')):
    d = json.load(open(p, encoding='utf8')); walk(d, d.get('id', p))
def lessons(k):
    s = sorted(use.get(k, ()), key=lambda w: [int(t) if t.isdigit() else t for t in re.split(r'\D+', w) if t])
    return '، '.join(w.replace('m2.', '') for w in s) or '—'
out = ['# كتالوج المرحلة 2: المشاهد وأنواع البنود', '',
       '> **مولَّد** من `src/js/49_m2_*.js` (التعليق الذي يسبق كل تعريف) ومن `content/m2/` (مواضع الاستعمال) بالأداة `tools/scenes_m2_doc.py`. لا يُعدَّل باليد: يُصلَح التعليق في الكود ثم يُعاد التوليد. مخطط الدرس ولغة الخطوات في `docs/SCENES.md`.', '']
for kind, title in (('ITEM', 'أنواع البنود'), ('SCENES', 'المشاهد')):
    ks = sorted([k for k in defs if k[0] == kind], key=lambda k: (defs[k][0], defs[k][1]))
    out += ['## %s (%d)' % (title, len(ks)), '', '| الاسم | الملف:السطر | الوصف (من الكود) | الدروس |', '|---|---|---|---|']
    for k in ks:
        f, ln, c = defs[k]
        out.append('| `%s` | `%s:%d` | %s | %s |' % (k[1], f, ln, (c or '—').replace('|', '\\|'), lessons(k)))
    out.append('')
unused = [k[1] for k in defs if k not in use and k[1] not in ('chaosItem',)]
out += ['## غير مستعمل في محتوى م2', '', ('، '.join('`%s`' % u for u in sorted(unused)) or '—'), '']
open(ROOT + '/docs/SCENES_m2.md', 'w', encoding='utf8').write('\n'.join(out))
print('items', sum(1 for k in defs if k[0] == 'ITEM'), 'scenes', sum(1 for k in defs if k[0] == 'SCENES'), 'undocumented', sum(1 for k in defs if not defs[k][2]), 'unused', len(unused))
