import json, os
ROOT=__import__('os').path.abspath(__import__('os').path.join(__import__('os').path.dirname(__import__('os').path.abspath(__file__)), '..', '..'))   # من موضع الملف: نسخة المراجعة تكتب في نفسها
def dump(path, obj):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    try:   # توقّعٌ قبل مشاهد الاكتشاف (tools/predmap.py، D284 (3))
        import importlib.util as _iu; _sp = _iu.spec_from_file_location('predmap', os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'predmap.py')); _pm = _iu.module_from_spec(_sp); _sp.loader.exec_module(_pm); _pm.inject(obj)
        _sp = _iu.spec_from_file_location('homemap', os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'homemap.py')); _hm = _iu.module_from_spec(_sp); _sp.loader.exec_module(_hm); _hm.inject(obj)   # مهمة البيت (tools/homemap.py، D284 (6))
    except FileNotFoundError: pass
    if path.endswith('unit.json') and os.path.exists(path) and 'workshop' not in obj:   # ورشة الوحدة يكتبها tools/wsgen/m34.py وحده، فلا يمحوها مولّد الوحدة (المراجع B لبوابة S3-U2/U3، 1)
        try:
            _old = json.load(open(path, encoding='utf8'))
            if 'workshop' in _old: obj['workshop'] = _old['workshop']
        except ValueError: pass
    if '/content/m4/' in path.replace(os.sep, '/') and isinstance(obj, dict) and 'flow' in obj: pf_vary(obj)
    json.dump(obj, open(path,'w'), ensure_ascii=False, indent=1); open(path,'a').write('\n')
# D240 (المراجع B لبوابة M4-U1/U2، 14): بنود البرهان في التقييم والتوائم لبراهين بلا متغيّرات مرسومة (الرباعيات وفيثاغورس والدائرة والإنشاء)
# بأسماء حروفٍ أخرى (v، PF_LMAP في 49_m4_c_proof.js)، فلا تكون مسألة المشهد نفسها؛ والعدّاد عامٌّ في التشغيل فلا تتكرّر بين الدروس
PF_GENERIC={'paraSide','paraDiag','rectDiag','rhombDiag','conv','pyth','pyConv','perpPf','chordPf','inscPf','bisPf','pbPf','bisCon','perpCon'}
_PFV={}
def pf_vary(d):
    def nxt(pf, step):
        k=(pf, step); _PFV[k]=_PFV.get(k,0)%3+1; return _PFV[k]
    def item(it, assess):
        if assess and it.get('t') in ('prChain','prReason') and it.get('pf') in PF_GENERIC and not it.get('v'): it['v']=nxt(it['pf'], it.get('step', 'c'))
        if isinstance(it.get('twin'), dict): item(it['twin'], True)
    def walk(x, assess):
        if isinstance(x, dict):
            if 't' in x: item(x, assess)
            for k, v in x.items():
                if k!='twin': walk(v, assess)
        elif isinstance(x, list):
            for v in x: walk(v, assess)
    for k in ('flow','practice','chaos'): walk(d.get(k), False)
    for k in ('mastery','review','test'): walk(d.get(k), True)
    pf_kinds(d)
# المشتّتان العامّان «قسناهما بالمنقلة» و«تبدوان متساويتين» عن زاويتين: لخطوةٍ عن أضلاعٍ أو مثلثاتٍ أو طولٍ مشتّتٌ من جنسها (المراجع A لبوابة M4-U3/U4، 9)
_LBL=None
def pf_kinds(d):
    global _LBL
    if _LBL is None:
        try: _LBL=json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)),'..','..','content','strings','labels.json'),encoding='utf8')).get('ui',{})
        except Exception: _LBL={}
    def kind(it):
        t=_LBL.get('pf.%s%s.%d'%(it['pf'], '.v%d'%it['v'] if it.get('v') and ('pf.%s.v%d.1'%(it['pf'],it['v'])) in _LBL else '', it['step']+1),'')
        import re as _re
        t=_re.sub('[\u064B-\u0652\u0670]','',t)
        if 'زاوي' in t: return None
        if '²' in t or 'مساح' in t or 'مربع' in t: return 'T'
        if 'أقصر' in t or 'أطول' in t: return 'L'
        return 'S'
    def walk(x):
        if isinstance(x, dict):
            if x.get('t')=='prReason' and isinstance(x.get('cands'), list):
                k=kind(x)
                if k: x['cands']=[({'measure':'measureT' if k=='T' else 'measureS','looks':'looksL' if k=='L' else 'looksS'}.get(c,c)) for c in x['cands']]
            for v in x.values(): walk(v)
        elif isinstance(x, list):
            for v in x: walk(v)
    if str(d.get('id','')).startswith(('m4.u3','m4.u4')): walk(d)
def merge_json(path, fn):
    d=json.load(open(path)); fn(d); json.dump(d, open(path,'w'), ensure_ascii=False, indent=1); open(path,'a').write('\n')

# D279: أرقام التسميات غربية في المصدر، وlabelText يجعلها مشرقية لمن اختارها (المراجع A لبوابة M4-U1/U2، 1)
def E2W(v):
    import re as _re
    if isinstance(v, str): return _re.sub('[٠-٩]', lambda m: str('٠١٢٣٤٥٦٧٨٩'.index(m.group(0))), v)
    if isinstance(v, list): return [E2W(x) for x in v]
    return v
