# رتبة الجواب بين الخيارات تتغيّر (المراجع A لبوابة M4-U7/U8، 1): نظير rkPick في 49_m4_h_vol4.js تماماً، ودورة rk لكل نوع بند
RKC={}
def RK(t):
    v=RKC.get(t,0); RKC[t]=v+1; return v%3
def rk_pick(w,pool,rk=0,near=0):
    P=[]
    for v,e in pool:
        if v>0 and v!=w and abs(v-w)>near+1e-9 and v not in [x for x,_ in P]: P.append((v,e))
    lo=[p for p in P if p[0]<w]; hi=[p for p in P if p[0]>w]
    for k in (rk,(rk+1)%3,(rk+2)%3):
        D=lo[:2] if k==0 else hi[:2] if k==2 else ([lo[0],hi[0]] if lo and hi else [])
        if len(D)==2: return [(w,'ok')]+D
    assert len(P)>=2, (w,pool)
    return [(w,'ok')]+P[:2]
def rank_of(ch):   # 0 الأكبر، 1 الأوسط، 2 الأصغر
    w=ch[0][0]; return sum(1 for v,_ in ch[1:] if v>w)
# الدرجات بالكلمات (كما في u6.py)
F1={1:'إِحْدَى',2:'اثْنَتَانِ',3:'ثَلَاثٌ',4:'أَرْبَعٌ',5:'خَمْسٌ',6:'سِتٌّ',7:'سَبْعٌ',8:'ثَمَانٍ',9:'تِسْعٌ'}
FF={3:'ثَلَاثُ',4:'أَرْبَعُ',5:'خَمْسُ',6:'سِتُّ',7:'سَبْعُ',8:'ثَمَانِي',9:'تِسْعُ',10:'عَشْرُ'}
FT={11:'إِحْدَى عَشْرَةَ',12:'اثْنَتَا عَشْرَةَ',13:'ثَلَاثَ عَشْرَةَ',14:'أَرْبَعَ عَشْرَةَ',15:'خَمْسَ عَشْرَةَ',16:'سِتَّ عَشْرَةَ',17:'سَبْعَ عَشْرَةَ',18:'ثَمَانِيَ عَشْرَةَ',19:'تِسْعَ عَشْرَةَ'}
TN={20:'عِشْرُونَ',30:'ثَلَاثُونَ',40:'أَرْبَعُونَ',50:'خَمْسُونَ',60:'سِتُّونَ',70:'سَبْعُونَ',80:'ثَمَانُونَ',90:'تِسْعُونَ'}
HN={1:'مِئَةٌ',2:'مِئَتَانِ',3:'ثَلَاثُمِئَةٍ'}; HC={1:'مِئَةُ',2:'مِئَتَا',3:'ثَلَاثُمِئَةِ'}
def deg_below(r):
    if r==1: return 'دَرَجَةٌ وَاحِدَةٌ'
    if r==2: return 'دَرَجَتَانِ'
    if r<=10: return FF[r]+' دَرَجَاتٍ'
    if r<20: return FT[r]+' دَرَجَةً'
    u,t=r%10,r-r%10
    return (F1[u]+' وَ' if u else '')+TN[t]+' دَرَجَةً'
def degphrase(n):
    h,r=divmod(n,100)
    if not h: return deg_below(r)
    if not r: return HC[h]+' دَرَجَةٍ'
    return HN[h]+' وَ'+deg_below(r)
def rank_report(lessons, RANKS, types):
    """رتبة الجواب في بنود التقييم (الإتقان والبديل والمراجعة والاختبار) لكل درس ونوع: لا رتبةً واحدة لثلاثة بنود فأكثر"""
    import json
    key=lambda it: json.dumps({k:v for k,v in it.items() if k not in ('twin','c')},sort_keys=True,ensure_ascii=False)
    R={key(it):r for t,it,r in RANKS}; bad=[]
    for L in lessons:
        items=[]
        m=L.get('mastery') or {}
        for grp in ('concepts','alt'):
            for v in (m.get(grp) or {}).values(): items+=v
        items+=L.get('review') or []
        items+=[x['item'] for x in (L.get('test') or {}).get('items',[])]
        by={}
        for it in items:
            if it.get('t') in types: by.setdefault(it['t'],[]).append(R.get(key(it)))
        for t,rs in by.items():
            pass
            if len(rs)>=3 and len(set(rs))==1: bad.append((L['id'],t,rs))
    return bad
