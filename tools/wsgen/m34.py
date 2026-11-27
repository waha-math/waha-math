# ورشة المكعّبات في م3 وم4 (D197، D198-2؛ المحرّك src/js/63_cubes.js): ثلاثة ألغاز لكل وحدة، تُولَّد بمولّد مبذور وتُفحص قبل الكتابة:
#  - كل بناءٍ في صورة (pic، count): أعلى مكعّب في كل عمود يُرى منه جزءٌ كافٍ (رسم نقطي بالإسقاط المائل نفسه، بترتيب الرسم نفسه)، فيُعرف العمود من الصورة
#    ولا مكعّب مخفيٌّ إلا تحت مكعّبٍ يُرى (لا مكعّب معلّق)؛ وفي count مكعّبٌ مخفيٌّ واحد على الأقل بعد الوحدة الأولى
#  - rot: البناء غير متماثل بالمرآة (صورته لا تطابقه بدوران)، وكل مكعّب منه يُرى في الرسمين، والثاني ليس في اتجاه الأول نفسه
#  - cut: شكل سطح القطع يُحسب بالخوارزمية نفسها، وهو من الستة (مثلث، مربع، مستطيل، شبه منحرف، خماسي، سداسي)
#  - التسلسل بحسب ما دُرس (D197 «بلا مفاهيم جديدة»): المساقط الأمامي والجانبي (C322) والشبكات (C320) من S3-U8، والقطع بعد M4-U7؛
#    وقبل ذلك في م3: البناء من صورة باتجاهها (مهارة م2) والعدّ، والخريطة من الأعلى معروفة من S1-U3 (C012)
# python3 tools/wsgen/m34.py
import json, os, random, math, itertools
from PIL import Image, ImageDraw
ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..')
KC, KS = .55 * math.cos(math.radians(38)), .55 * math.sin(math.radians(38))

def vox_of(t):
    R = len(t); return [(c, R - 1 - r, z) for r, row in enumerate(t) for c, h in enumerate(row) for z in range(h)]
def rot(t): return [list(reversed([row[c] for row in t])) for c in range(len(t[0]))]
def trim(t):
    a = [row for row in t if any(row)]; cs = [c for c in range(len(a[0])) if any(row[c] for row in a)]; return [[row[c] for c in cs] for row in a]
def same_shape(a, b):
    k = trim(a); x = trim(b)
    for _ in range(4):
        if x == k: return True
        x = trim(rot(x))
    return False
def views(t):
    R, C = len(t), len(t[0]); return ([max(t[r][c] for r in range(R)) for c in range(C)], [max(t[R - 1 - j]) for j in range(R)], [[1 if h else 0 for h in row] for row in t])

def visible(V, s=40):
    """مساحة ما يُرى من كل مكعّب (بكسل) في الرسم المائل، بترتيب الرسم في cuVox، والأوجه الملاصقة لا تُرسم"""
    has = set(V); W = 12 * s; img = Image.new('I', (W, W), 0); d = ImageDraw.Draw(img); ids = {}
    P = lambda x, y, z: (W / 3 + (x + y * KC) * s, W * .8 - (z + y * KS) * s)
    for i, (x, y, z) in enumerate(sorted(V, key=lambda v: (-v[1], v[2], v[0]))):
        ids[i + 1] = (x, y, z)
        if (x, y, z + 1) not in has: d.polygon([P(x, y, z + 1), P(x + 1, y, z + 1), P(x + 1, y + 1, z + 1), P(x, y + 1, z + 1)], fill=i + 1)
        if (x + 1, y, z) not in has: d.polygon([P(x + 1, y, z), P(x + 1, y + 1, z), P(x + 1, y + 1, z + 1), P(x + 1, y, z + 1)], fill=i + 1)
        if (x, y - 1, z) not in has: d.polygon([P(x, y, z), P(x + 1, y, z), P(x + 1, y, z + 1), P(x, y, z + 1)], fill=i + 1)
    cnt = {}
    for v in img.get_flattened_data():
        if v: cnt[v] = cnt.get(v, 0) + 1
    return {ids[k]: n for k, n in cnt.items()}, s * s
def tops_seen(t, frac=.14):
    V = vox_of(t); A, F = visible(V); R = len(t)
    return all(A.get((c, R - 1 - r, h - 1), 0) >= frac * F for r, row in enumerate(t) for c, h in enumerate(row) if h)
def hidden_n(t):
    A, F = visible(vox_of(t)); return sum(1 for v in vox_of(t) if A.get(v, 0) < .02 * F)
def connected(t):
    cells = {(r, c) for r in range(3) for c in range(3) if t[r][c]}
    if not cells: return False
    st = [next(iter(cells))]; seen = set(st)
    while st:
        r, c = st.pop()
        for q in ((r + 1, c), (r - 1, c), (r, c + 1), (r, c - 1)):
            if q in cells and q not in seen: seen.add(q); st.append(q)
    return seen == cells

def rand_map(rng, n_cols, hmax, total):
    for _ in range(4000):
        cells = rng.sample([(r, c) for r in range(3) for c in range(3)], n_cols); t = [[0] * 3 for _ in range(3)]
        for (r, c) in cells: t[r][c] = rng.randint(1, hmax)
        if connected(t) and sum(map(sum, t)) in total and max(map(max, t)) == hmax: return t
    raise RuntimeError('map')
USED = set()
def fresh(t):
    k = json.dumps(trim(t))
    if k in USED: return False
    USED.add(k); return True

def pic(rng, lvl, rot_n, pid):
    n_cols, hmax, total = [(3, 2, range(4, 6)), (4, 2, range(5, 8)), (5, 3, range(7, 10)), (6, 3, range(8, 12)), (6, 3, range(10, 14))][lvl]
    for _ in range(4000):
        t = rand_map(rng, n_cols, hmax, total); shown = t
        for _ in range(rot_n): shown = rot(shown)
        if rot_n and trim(shown) == trim(t): continue          # الدوران يغيّر الصورة فعلاً
        if tops_seen(shown) and fresh(t): return {'id': pid, 'kind': 'pic', 'name': 'gen.ws.p.cu.' + ('picRot' if rot_n else 'pic'), 't': t, 'rot': rot_n}
    raise RuntimeError('pic')
def count(rng, lvl, pid, hid_min):
    n_cols, hmax, total = [(4, 2, range(5, 9)), (5, 2, range(6, 10)), (5, 3, range(8, 12)), (6, 3, range(9, 14)), (7, 3, range(11, 16))][lvl]   # ثلاثة أعداد على الأقل لكل مستوى
    out = []
    for _ in range(20000):
        t = rand_map(rng, n_cols, hmax, total)
        if tops_seen(t) and hidden_n(t) >= hid_min and sum(map(sum, t)) not in [sum(map(sum, x)) for x in out] and fresh(t): out.append(t)   # أعدادٌ مختلفة للأبنية الثلاثة، فلا يُعرف الثاني من الأول بلا عدّ (المراجع A لبوابة S3-U8/U9، 33)
        if len(out) == 3: return {'id': pid, 'kind': 'count', 'name': 'gen.ws.p.cu.count', 'builds': out}
    raise RuntimeError('count')
def views_p(rng, lvl, pid):
    n_cols, hmax, total = [(4, 2, range(5, 8)), (5, 3, range(7, 10)), (6, 3, range(8, 12)), (7, 3, range(10, 15))][lvl]
    for _ in range(4000):
        t = rand_map(rng, n_cols, hmax, total); f, s, _ = views(t)
        if len(set(f)) > 1 and len(set(s)) > 1 and fresh(t): return {'id': pid, 'kind': 'views', 'name': 'gen.ws.p.cu.views', 't': t}
    raise RuntimeError('views')

# ===== rot: بناءات من أذرع متعامدة (على طريقة شِبرد ومِتزلر)
TF = {'z': lambda v: (v[1], -v[0], v[2]), 'x': lambda v: (v[0], -v[2], v[1]), 'y': lambda v: (v[2], v[1], -v[0]), 'm': lambda v: (-v[0], v[1], v[2])}
def apply(V, seq):
    for a in seq: V = [TF[a](v) for v in V]
    return V
def norm(V):
    m = [min(v[i] for v in V) for i in range(3)]; return sorted(tuple(v[i] - m[i] for i in range(3)) for v in V)
def all_rots(V):
    out = set(); fr = [tuple(V)]
    seen = {tuple(norm(V))}
    while fr:
        nx = []
        for W in fr:
            for a in 'zxy':
                X = tuple(norm(apply(list(W), a)))
                if X not in seen: seen.add(X); nx.append(X)
        fr = nx
    return seen
def arms(rng, lens):
    dirs = [(1, 0, 0), (-1, 0, 0), (0, 1, 0), (0, -1, 0), (0, 0, 1), (0, 0, -1)]
    for _ in range(1000):
        V = [(0, 0, 0)]; prev = None; ok = True
        for L in lens:
            d = rng.choice([d for d in dirs if prev is None or sum(a * b for a, b in zip(d, prev)) == 0])
            for _ in range(L):
                p = tuple(a + b for a, b in zip(V[-1], d))
                if p in V: ok = False; break
                V.append(p)
            prev = d
            if not ok: break
        if ok: return norm(V)
def rot_pair(rng, lens, mirror, used, seen=None):   # seen: مجسّمات اللغز نفسه، فلا يتكرّر مجسّمٌ في زوجين (المراجع B لبوابة M4-U7/U8، 12)
    for _ in range(4000):
        A = arms(rng, lens)
        if not A: continue
        R = all_rots(A)
        if tuple(norm(apply(A, 'm'))) in R: continue                    # متماثل بالمرآة: لا لغز
        seq = rng.choice(['z', 'zz', 'zzz', 'x', 'xz', 'y', 'zy', 'xx', 'xzz', 'yzz'])
        B = norm(apply(A, ('m' if mirror else '') + seq))
        if tuple(B) == tuple(A) or tuple(B) == tuple(norm(apply(A, 'm'))): continue   # الثاني في اتجاه الأول نفسه
        okv = True
        for X in (A, B):
            Av, F = visible(X)
            if any(Av.get(v, 0) < .18 * F for v in X): okv = False; break
        if not okv or (tuple(A), seq, mirror) in used or (seen is not None and tuple(A) in seen): continue
        used.add((tuple(A), seq, mirror))
        if seen is not None: seen.add(tuple(A))
        # المكعّب الملوّن: طرفُ ذراعٍ (له جارٌ واحد) يُرى أوضح ما يكون في الرسمين معاً
        Bm = apply(A, ('m' if mirror else '') + seq); off = [min(v[k] for v in Bm) for k in range(3)]; Av, F = visible(A); Bv, _ = visible(B)
        ends = [i for i, v in enumerate(A) if sum(1 for w in A if sum(abs(v[k] - w[k]) for k in range(3)) == 1) == 1]
        hl = max(ends, key=lambda i: min(Av.get(A[i], 0), Bv.get(tuple(Bm[i][k] - off[k] for k in range(3)), 0)))
        return {'a': [list(v) for v in A], 'tf': seq, 'mirror': mirror, 'hl': hl}
    raise RuntimeError('rot')

# ===== cut: سطح القطع بثلاث نقاط على الأحرف
def section(pts):
    A, B, C = pts; sub = lambda a, b: [a[i] - b[i] for i in range(3)]; dot = lambda a, b: sum(a[i] * b[i] for i in range(3))
    crs = lambda a, b: [a[1] * b[2] - a[2] * b[1], a[2] * b[0] - a[0] * b[2], a[0] * b[1] - a[1] * b[0]]
    n = crs(sub(B, A), sub(C, A)); d = dot(n, A); out = []; cor = list(itertools.product([0, 1], repeat=3))
    if math.hypot(*n) < 1e-9: return None
    for p in cor:
        for q in cor:
            if json.dumps(p) >= json.dumps(q) or sum(abs(p[i] - q[i]) for i in range(3)) != 1: continue
            fp, fq = dot(n, p) - d, dot(n, q) - d
            if abs(fp) < 1e-9: out.append(list(p))
            elif abs(fq) < 1e-9: out.append(list(q))
            elif fp * fq < 0: s = fp / (fp - fq); out.append([p[i] + s * (q[i] - p[i]) for i in range(3)])
    U = []
    for p in out:
        if not any(math.dist(p, q) < 1e-6 for q in U): U.append(p)
    if len(U) < 3: return None
    c = [sum(p[i] for p in U) / len(U) for i in range(3)]; nr = lambda a: [x / math.hypot(*a) for x in a]
    e1 = nr(sub(U[0], c)); e2 = nr(crs(n, e1)); fl = [(dot(sub(p, c), e1), dot(sub(p, c), e2)) for p in U]
    return sorted(fl, key=lambda q: math.atan2(q[1], q[0]))
def shape(P2):
    n = len(P2)
    if n != 4: return {3: 'tri', 5: 'pent', 6: 'hex'}.get(n)
    vec = lambda i: (P2[(i + 1) % 4][0] - P2[i][0], P2[(i + 1) % 4][1] - P2[i][1]); side = lambda i: math.hypot(*vec(i))
    right = all(abs(vec(i)[0] * vec((i + 1) % 4)[0] + vec(i)[1] * vec((i + 1) % 4)[1]) < 1e-6 for i in range(4))
    if right: return 'square' if abs(side(0) - side(1)) < 1e-6 else 'rect'
    par = lambda i: abs(vec(i)[0] * vec(i + 2)[1] - vec(i)[1] * vec(i + 2)[0]) < 1e-6
    return 'para' if par(0) and par(1) else 'trap' if par(0) or par(1) else 'other'
CUTS = {   # لكل وحدة بعد M4-U7 ثلاثة أشكالٍ مختلفة؛ والمربّع والمستطيل يفترقان بطول الضلع: حرفُ المكعّب أم قطرُ وجهه
 'm4.u7': [[[.5, 0, 1], [1, 0, .5], [1, .5, 1]], [[0, 0, .5], [1, 0, .5], [1, 1, .5]], [[0, .5, 1], [.5, 0, 1], [.5, 1, 0]]],
 'm4.u8': [[[0, 0, 0], [1, 1, 0], [0, 0, 1]], [[0, 0, 1], [.5, 1, 1], [1, 0, 0]], [[0, 0, 1], [0, .5, 0], [1, 1, .5]]],
 'm4.u9': [[[0, .5, 0], [.5, 1, 1], [1, 1, 0]], [[1, 0, .25], [.25, 1, 0], [0, .25, 1]], [[0, 0, 0], [1, 0, 0], [0, 1, 1]]],
}
WANT = {'m4.u7': ['tri', 'square', 'hex'], 'm4.u8': ['rect', 'trap', 'pent'], 'm4.u9': ['trap', 'hex', 'rect']}
def check_cuts():
    for u, L in CUTS.items():
        got = [shape(section(p)) for p in L]
        assert got == WANT[u], (u, got)
check_cuts()

# ===== الوحدات
M3 = ['m3.u%d' % i for i in range(11)]; M4 = ['m4.u%d' % i for i in range(1, 10)]
def build():
    rng = random.Random(1197); W = {}; used = set()
    # م3 قبل S3-U8: صورة باتجاهها، وعدّ، وصورة أصعب
    for i, u in enumerate(M3[:8]):
        lv = min(4, i // 2); p1 = pic(rng, min(4, lv), 0, 'p1'); c1 = count(rng, min(4, lv), 'c1', 0 if i == 0 else 1)
        for _ in range(200):   # اللغز الثاني غير الأول: أربع خاناتٍ تختلف على الأقل (المراجع A لبوابة S3-U6/U7، 22)
            p2 = pic(rng, min(4, lv + 1), 0, 'p2')
            if sum(1 for r in range(3) for c in range(3) if p1['t'][r][c] != p2['t'][r][c]) >= 4: break
        W[u] = [p1, c1, p2]
    W['m3.u8'] = [{'id': 'n1', 'kind': 'nets', 'name': 'gen.ws.p.cu.nets', 'need': 2}, views_p(rng, 0, 'v1'), count(rng, 3, 'c1', 2)]
    W['m3.u9'] = [count(rng, 4, 'c1', 2), views_p(rng, 1, 'v1'), {'id': 'n1', 'kind': 'nets', 'name': 'gen.ws.p.cu.nets', 'need': 2, 'no4': True}]
    W['m3.u10'] = [views_p(rng, 2, 'v1'), {'id': 'n1', 'kind': 'nets', 'name': 'gen.ws.p.cu.nets', 'need': 3}, pic(rng, 4, 0, 'p1')]
    # م4: التدوير الذهني والصورة من جهة أخرى والمساقط، والقطع بعد M4-U7
    for i, u in enumerate(M4):
        L = [[2, 1, 1], [2, 2, 1], [2, 2, 1], [3, 2, 1], [2, 2, 2], [3, 2, 2], [3, 2, 2], [3, 3, 2], [3, 3, 2]][i]
        mir = [True, False, True] if i % 2 else [False, True, True]
        seen = set(); r = {'id': 'r1', 'kind': 'rot', 'name': 'gen.ws.p.cu.rot', 'pairs': [rot_pair(rng, L, m, used, seen) for m in mir]}
        if i < 6: W[u] = [r, pic(rng, min(4, 2 + i // 2), 1 + i % 3, 'p1'), views_p(rng, min(3, 1 + i // 2), 'v1')]
        else: W[u] = [r, {'id': 't1', 'kind': 'cut', 'name': 'gen.ws.p.cu.cut', 'cuts': [{'p': p} for p in CUTS[u]]}, (pic(rng, 4, 1 + i % 3, 'p1') if i % 2 else views_p(rng, 3, 'v1'))]
    return W

G = {
 'gen.ws.introCube': 'أَهْلًا فِي وَرْشَةِ المُكَعَّبَاتِ! أَلْغَازٌ، أَمْ بِنَاءٌ حُرٌّ؟',
 'gen.ws.firstCube': 'أَهْلًا فِي وَرْشَةِ المُكَعَّبَاتِ! أَلْغَازٌ تَحْتَاجُ إِلَى خَيَالِ مُهَنْدِسٍ.',
 'gen.ws.againCube': 'لُغْزٌ آخَرُ مِنْ أَلْغَازِ المُكَعَّبَاتِ!',
 'gen.ws.p.cu.pic': 'لُغْزُ الصُّورَةِ',
 'gen.ws.p.cu.picRot': 'لُغْزُ الصُّورَةِ مِنْ جِهَةٍ أُخْرَى',
 'gen.ws.p.cu.count': 'لُغْزُ العَدِّ',
 'gen.ws.p.cu.views': 'لُغْزُ المَسَاقِطِ',
 'gen.ws.p.cu.nets': 'لُغْزُ الشَّبَكَاتِ',
 'gen.ws.p.cu.rot': 'لُغْزُ التَّدْوِيرِ',
 'gen.ws.p.cu.cut': 'لُغْزُ القَطْعِ',
 'gen.ws.cv.how': 'هَذِهِ مَسَاقِطُ بِنَاءٍ مِنَ الأَمَامِ وَالجَانِبِ وَالأَعْلَى. {اِبْنِهِ|اِبْنِيهِ}!',
 'gen.ws.cv.tap': 'كُلُّ لَمْسَةٍ عَلَى مُرَبَّعٍ فِي الخَرِيطَةِ تَضَعُ عَلَيْهِ مُكَعَّبًا، وَالرَّابِعَةُ تُفْرِغُهُ.',
 'gen.ws.cv.pic': '{اِبْنِ|اِبْنِي} مِثْلَ البِنَاءِ الأَزْرَقِ!',
 'gen.ws.cv.picRot': 'رَأَيْنَا هَذَا البِنَاءَ مِنْ جِهَةٍ أُخْرَى. {اِبْنِ|اِبْنِي} مِثْلَهُ بِأَيِّ اتِّجَاهٍ.',
 'gen.ws.cv.hint': '{قَارِنْ|قَارِنِي} مَسْقَطًا مَسْقَطًا: المُضِيءُ لَمْ يُطَابِقْ بَعْدُ.',
 'gen.ws.cv.hintPic': '{عُدَّ|عُدِّي} مُكَعَّبَاتِ كُلِّ عَمُودٍ فِي الصُّورَةِ، {وَابْدَأْ|وَابْدَئِي} بِأَعْلَى عَمُودٍ.',
 'gen.ws.cv.solved': '{بَنَيْتَ|بَنَيْتِ} بِنَاءً يُطَابِقُ المَسَاقِطَ الثَّلَاثَةَ!',
 'gen.ws.cv.solvedPic': '{بَنَيْتَ|بَنَيْتِ} البِنَاءَ نَفْسَهُ!',
 'gen.ws.cube.free': '{اِبْنِ|اِبْنِي} مَا {تُحِبُّ|تُحِبِّينَ} بِالمُكَعَّبَاتِ، {وَانْظُرْ|وَانْظُرِي} إِلَيْهِ مِنْ كُلِّ جِهَةٍ.',
 'gen.ws.cc.q': 'كَمْ مُكَعَّبًا فِي هَذَا البِنَاءِ؟ {عُدَّ|عُدِّي} المَخْفِيَّ أَيْضًا.',
 'gen.ws.cc.hint': 'عَلَى كُلِّ مُرَبَّعٍ فِي الخَرِيطَةِ الصَّغِيرَةِ عَدَدُ مُكَعَّبَاتِ عَمُودِهِ، فَلَا مُكَعَّبَ مُعَلَّقٌ فِي الهَوَاءِ.',
 'gen.ws.cc.ok': 'صَحِيحٌ! وَبَعْضُهَا مَخْفِيٌّ تَحْتَ غَيْرِهِ أَوْ خَلْفَهُ.',
 'gen.ws.cc.reveal': '{اِجْمَعْ|اِجْمَعِي} أَعْدَادَ الخَرِيطَةِ، فَعَدَدُ المُكَعَّبَاتِ كُلِّهَا:',
 'gen.ws.cc.solved': '{عَدَدْتَ|عَدَدْتِ} مُكَعَّبَاتِ الأَبْنِيَةِ الثَّلَاثَةِ!',
 'gen.ws.nt.how': '{كَوِّنْ|كَوِّنِي} شَبَكَةَ مُكَعَّبٍ: {اِلْمِسْ|اِلْمِسِي} سِتَّةَ مُرَبَّعَاتٍ، ثُمَّ زِرَّ الطَّيِّ.',
 'gen.ws.nt.need2': 'المَطْلُوبُ شَبَكَتَانِ مُخْتَلِفَتَانِ.',
 'gen.ws.nt.need3': 'المَطْلُوبُ ثَلَاثُ شَبَكَاتٍ مُخْتَلِفَةٍ.',
 'gen.ws.nt.no4': 'المَطْلُوبُ شَبَكَتَانِ لَيْسَ فِي أَيٍّ مِنْهُمَا أَرْبَعَةُ مُرَبَّعَاتٍ فِي صَفٍّ.',
 'gen.ws.nt.six': 'سِتَّةُ مُرَبَّعَاتٍ فَقَطْ، فَلِلْمُكَعَّبِ سِتَّةُ أَوْجُهٍ.',
 'gen.ws.nt.apart': 'كُلُّ مُرَبَّعٍ يَلْمِسُ جَارَهُ بِضِلْعٍ كَامِلٍ، وَالمُحَاطُ بِالأَحْمَرِ مُنْفَصِلٌ.',
 'gen.ws.nt.overlap': 'المُرَبَّعَانِ المُحَاطَانِ بِالأَحْمَرِ يَقَعَانِ عَلَى الوَجْهِ نَفْسِهِ، فَيَبْقَى وَجْهٌ مَفْتُوحٌ.',
 'gen.ws.nt.ok': 'تُطْوَى مُكَعَّبًا! وَكُلُّ لَوْنٍ وَجْهَانِ مُتَقَابِلَانِ.',
 'gen.ws.nt.same': 'هَذِهِ {وَجَدْتَهَا|وَجَدْتِهَا} مِنْ قَبْلُ، وَلَوْ دَارَتْ أَوِ انْقَلَبَتْ. {اِبْحَثْ|اِبْحَثِي} عَنْ غَيْرِهَا!',
 'gen.ws.nt.row4': 'تُطْوَى مُكَعَّبًا، لَكِنَّ فِيهَا أَرْبَعَةَ مُرَبَّعَاتٍ فِي صَفٍّ. {اِبْحَثْ|اِبْحَثِي} عَنْ غَيْرِهَا!',
 'gen.ws.nt.hint': '{حَرِّكْ|حَرِّكِي} مُرَبَّعًا وَاحِدًا مِنْ شَبَكَةٍ {وَجَدْتَهَا|وَجَدْتِهَا} إِلَى مَكَانٍ آخَرَ.',
 'gen.ws.nt.solved': '{وَجَدْتَ|وَجَدْتِ} الشَّبَكَاتِ المَطْلُوبَةَ!',
 'gen.ws.nt.all': '{وَجَدْتَ|وَجَدْتِ} شَبَكَاتِ المُكَعَّبِ الإِحْدَى عَشْرَةَ كُلَّهَا!',
 'gen.ws.rt.q': 'هَلْ يَتَطَابَقُ البِنَاءَانِ إِذَا دَارَ أَحَدُهُمَا؟',
 'gen.ws.rt.same': 'نَعَمْ، يَتَطَابَقَانِ بِدَوَرَانٍ: المُكَعَّبُ البَنَفْسَجِيُّ فِي المَوْضِعِ نَفْسِهِ مِنْ كُلٍّ مِنْهُمَا.',
 'gen.ws.rt.mirror': 'لَا: أَحَدُهُمَا صُورَةُ الآخَرِ فِي المِرْآةِ، وَلَا يَجْعَلُهُمَا الدَّوَرَانُ مُتَطَابِقَيْنِ.',
 'gen.ws.rt.hint': '{اُنْظُرْ|اُنْظُرِي} إِلَى المُكَعَّبِ البَنَفْسَجِيِّ فِي البِنَاءَيْنِ: هَلْ جِيرَانُهُ فِي الجِهَاتِ نَفْسِهَا؟',
 'gen.ws.rt.solved': '{أَنْهَيْتَ|أَنْهَيْتِ} لُغْزَ التَّدْوِيرِ!',
 'gen.ws.cu.q': 'قُطِعَ المُكَعَّبُ عَلَى السَّطْحِ البَنَفْسَجِيِّ: مَا شَكْلُ سَطْحِ القَطْعِ؟',
 'gen.ws.cu.ok': 'صَحِيحٌ! وَهَذَا شَكْلُهُ الحَقِيقِيُّ.',
 'gen.ws.cu.hint': '{اُنْظُرْ|اُنْظُرِي} إِلَى أَضْلَاعِ سَطْحِ القَطْعِ: كَمْ ضِلْعًا؟ وَهَلْ هِيَ أَحْرُفٌ مِنَ المُكَعَّبِ أَمْ أَقْطَارٌ لِأَوْجُهِهِ؟',
 'gen.ws.cu.reveal': 'هَذَا شَكْلُهُ الحَقِيقِيُّ:',
 'gen.ws.cu.s.tri': 'مُثَلَّثٌ.', 'gen.ws.cu.s.square': 'مُرَبَّعٌ.', 'gen.ws.cu.s.rect': 'مُسْتَطِيلٌ.', 'gen.ws.cu.s.trap': 'شِبْهُ مُنْحَرِفٍ.', 'gen.ws.cu.s.pent': 'خُمَاسِيٌّ.', 'gen.ws.cu.s.hex': 'سُدَاسِيٌّ.',
 'gen.ws.cu.solved': '{أَنْهَيْتَ|أَنْهَيْتِ} لُغْزَ القَطْعِ!',
}
LB = {
 'wsPuzzlesCube': 'أَلْغَازُ المُكَعَّبَاتِ', 'wsShadowsCube': 'أَلْغَازُ المُكَعَّبَاتِ:',
 'cuFold': '{اِطْوِ|اِطْوِي}',
 'cuCell': 'مُرَبَّعٌ فِي الخَرِيطَةِ', 'cuSq': 'مُرَبَّعٌ', 'cuFront': 'الأَمَامُ', 'cuGoal': 'البِنَاءُ المَطْلُوبُ', 'cuMine': '{بِنَاؤُكَ|بِنَاؤُكِ}',
 'cuNets': '{شَبَكَاتُكَ|شَبَكَاتُكِ}:', 'cuAll': 'المَجْمُوعَةُ:', 'cuTotal': 'المَجْمُوعُ:',
}
if __name__ == '__main__':
    W = build(); n = 0
    for u, P in W.items():
        p = os.path.join(ROOT, 'content', u.split('.')[0], u.split('.')[1], 'unit.json'); raw = open(p, encoding='utf8').read(); d = json.loads(raw)
        d['workshop'] = {'kind': 'cubes', 'optional': True, 'puzzles': P}; n += len(P)
        open(p, 'w', encoding='utf8').write(json.dumps(d, ensure_ascii=False, indent=1) + ('\n' if raw.endswith('\n') else ''))
    p = os.path.join(ROOT, 'content/strings/gen.json'); g = json.load(open(p, encoding='utf8'))
    for k, v in G.items(): g['lines'][k] = v
    open(p, 'w', encoding='utf8').write(json.dumps(g, ensure_ascii=False, indent=1) + '\n')
    p = os.path.join(ROOT, 'content/strings/labels.json'); raw = open(p, encoding='utf8').read(); l = json.loads(raw)
    for k, v in LB.items(): l['ui'][k] = v
    open(p, 'w', encoding='utf8').write(json.dumps(l, ensure_ascii=False, indent=1) + ('\n' if raw.endswith('\n') else ''))
    print('units', len(W), 'puzzles', n)
