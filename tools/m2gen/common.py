import json, os
ROOT=__import__('os').path.abspath(__import__('os').path.join(__import__('os').path.dirname(__import__('os').path.abspath(__file__)), '..', '..'))   # من موضع الملف: نسخة المراجعة تكتب في نفسها
def dump(path, obj):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    try:   # توقّعٌ قبل مشاهد الاكتشاف (tools/predmap.py، D284 (3))
        import importlib.util as _iu; _sp = _iu.spec_from_file_location('predmap', os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'predmap.py')); _pm = _iu.module_from_spec(_sp); _sp.loader.exec_module(_pm); _pm.inject(obj)
        _sp = _iu.spec_from_file_location('homemap', os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'homemap.py')); _hm = _iu.module_from_spec(_sp); _sp.loader.exec_module(_hm); _hm.inject(obj)   # مهمة البيت (tools/homemap.py، D284 (6))
    except FileNotFoundError: pass
    json.dump(obj, open(path,'w'), ensure_ascii=False, indent=1); open(path,'a').write('\n')
def merge_json(path, fn):
    d=json.load(open(path)); fn(d); json.dump(d, open(path,'w'), ensure_ascii=False, indent=1); open(path,'a').write('\n')
