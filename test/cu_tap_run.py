# ورشة المكعّبات في م3 وم4 (63_cubes.js) باللمس الحقيقي على ثلاث شاشات (D246، D255): كل لغز يُحلّ بأصابع الطفل لا بالحلّ الآلي:
# خريطة البناء مربّعاً مربّعاً بزرّي «ضع» و«ارفع»، والشبكة ستة مربّعات ثم «اطوِ»، والعدد والجواب ببطاقته. وكل لمسة تذهب إلى هدفها
# (المربّع الملموس وحده يتغيّر)، وكل هدف 56 بكسلاً على الأقلّ، ولا خطأ في الصفحة؛ وعلى الجهاز الثالث لوحة المفاتيح (التركيز ثم Enter) بدل اللمس.
# والبناء الحرّ: يُحفظ في المعرض ويُرسم فيه. python3 test/cu_tap_run.py [جهاز…]   (FILE=نسخة أخرى)
import asyncio, os, sys, json
from playwright.async_api import async_playwright
HERE = os.path.dirname(os.path.abspath(__file__))
FILE = os.environ.get('FILE', os.path.join(HERE, '..', 'dist', 'واحة_الرياضيات.dev.html'))
DEVICES = sys.argv[1:] or ['iPhone SE', 'Pixel 5', 'Galaxy S5']
FAILS = []
def check(ok, what): print(('ok   ' if ok else 'FAIL ') + what, flush=True); (None if ok else FAILS.append(what))
SMALL = """() => [...document.querySelectorAll('#stage svg [data-cell], #stage svg [data-cubtn], #stage .choices .pick')].filter(e => { const r = e.getBoundingClientRect(); return r.width && Math.min(r.width, r.height) < 55.5 && !e.closest('[hidden]'); })
  .map(e => (e.dataset.cell || e.dataset.k || e.id) + ':' + Math.round(e.getBoundingClientRect().width) + 'x' + Math.round(e.getBoundingClientRect().height))"""
async def tap(pg, sel, kbd):
  if kbd:
    ok = await pg.evaluate("(s) => { const e = document.querySelector(s); if (!e) return false; e.focus(); return document.activeElement === e; }", sel)
    if not ok: return 'no focus'
    await pg.keyboard.press('Enter'); return None
  r = await pg.evaluate("(s) => { const e = document.querySelector(s); if (!e) return null; e.scrollIntoView({ block: 'nearest' }); const b = (e.querySelector('rect') || e).getBoundingClientRect(); return [b.left + b.width / 2, b.top + b.height / 2]; }", sel)
  if not r: return 'missing'
  await pg.touchscreen.tap(r[0], r[1]); return None
async def run(p, dev, kbd):
  b = await p.chromium.launch(); ctx = await b.new_context(**p.devices[dev]); pg = await ctx.new_page(); errs = []
  pg.on('pageerror', lambda e: errs.append(str(e)))
  await pg.goto('file://' + os.path.abspath(FILE) + '#fast&seed=7'); await pg.wait_for_timeout(300)
  await pg.evaluate("""() => { localStorage.clear(); localStorage.setItem('hp_kids', JSON.stringify([{ id: 'k1', name: 'سلمى', gender: 'f' }])); localStorage.setItem('hp_kid', JSON.stringify('k1'));
    localStorage.setItem('hp_settings:k1', JSON.stringify({ sessionMax: 0, muted: true })); localStorage.setItem('hp_prog:k1', JSON.stringify({ schema: 3, unlockAll: true })); }""")
  await pg.reload(); await pg.wait_for_timeout(500)
  puzzles = await pg.evaluate("() => UNITS.filter(u => WS[u.id] && WS[u.id].kind === 'cubes').flatMap(u => WS[u.id].puzzles.map((P, i) => [u.id, i, P.kind]))")
  check(len(puzzles) == 60, '%s: ستون لغزاً في عشرين ورشة (%d)' % (dev, len(puzzles)))
  for uid, i, kind in puzzles:
    await pg.evaluate("([uid, i]) => { hush(); CUR = null; FLOW++; reseed('cutap|' + uid + '|' + i); show('lesson'); window.__cuDone = false; const U = UNITS.find(u => u.id === uid); cuPuzzle(U, WS[uid].puzzles[i], i).then(() => { window.__cuDone = true; }); }", [uid, i])
    await pg.wait_for_timeout(300); P = await pg.evaluate("([uid, i]) => WS[uid].puzzles[i]", [uid, i]); bad = []; small = set(); nets_i = 0
    for step in range(400):
      if await pg.evaluate("() => window.__cuDone"): break
      for x in await pg.evaluate(SMALL): small.add(x)
      if kind in ('views', 'pic'):
        cells = await pg.evaluate("() => [...document.querySelectorAll('#stage svg [data-cell][role=button]')].map(e => [e.dataset.cell, +e.dataset.h])")
        if not cells: await pg.wait_for_timeout(100); continue
        have = {c: h for c, h in cells}; diff = [(c, P['t'][int(c[0])][int(c[2])] - h) for c, h in have.items() if P['t'][int(c[0])][int(c[2])] != h]
        if not diff: await pg.wait_for_timeout(100); continue
        c, d = diff[0]   # كل لمسة تضع مكعّباً، والتي بعد الثالث تُفرغ العمود
        before = {c2: h for c2, h in cells}; e = await tap(pg, '#stage svg [data-cell="%s"]' % c, kbd); await pg.wait_for_timeout(80)
        if e: bad.append(c + ' ' + e); continue
        after = {c2: h for c2, h in await pg.evaluate("() => [...document.querySelectorAll('#stage svg [data-cell]')].map(e => [e.dataset.cell, +e.dataset.h])")}
        ch = [k for k in after if after[k] != before.get(k)]
        if after and ch != [c] and not await pg.evaluate("() => window.__cuDone"): bad.append('لمسة %s غيّرت %s' % (c, ch))
      elif kind == 'nets':
        if not await pg.evaluate("() => !!document.querySelector('#cuFold')"): await pg.wait_for_timeout(100); continue
        if await pg.evaluate("() => document.querySelector('#cuFold').getAttribute('aria-disabled') === 'false'"): await pg.wait_for_timeout(100); continue
        on = await pg.evaluate("() => document.querySelectorAll('#stage svg [data-cell][data-on=\"1\"]').length")
        if on: await pg.wait_for_timeout(100); continue
        nets = await pg.evaluate("(P) => CU_NETS.filter(n => !P.no4 || !cuRow4(n))", P); net = nets[nets_i]; nets_i += 1
        for c, r in net:
          e = await tap(pg, '#stage svg [data-cell="%d,%d"]' % (c, r), kbd); await pg.wait_for_timeout(50)
          if e: bad.append('%d,%d %s' % (c, r, e))
        n6 = await pg.evaluate("() => document.querySelectorAll('#stage svg [data-cell][data-on=\"1\"]').length")
        if n6 != 6: bad.append('بعد ست لمسات %d مربّعاً' % n6)
        e = await tap(pg, '#cuFold', kbd); await pg.wait_for_timeout(200)
        if e: bad.append('fold ' + e)
      else:
        sel = '#stage .choices:not([data-done]) .pick[data-ok="true"]'
        if not await pg.evaluate("(s) => !!document.querySelector(s)", sel): await pg.wait_for_timeout(100); continue
        e = await tap(pg, sel, kbd); await pg.wait_for_timeout(150)
        if e: bad.append('pick ' + e)
    done = await pg.evaluate("() => window.__cuDone")
    check(done and not bad, '%s %s %s (%s): يُحلّ %s%s' % (dev, uid, i, kind, 'بلوحة المفاتيح' if kbd else 'باللمس', '' if done and not bad else ': ' + ('لم ينتهِ ' if not done else '') + '; '.join(bad[:4])))
    check(not small, '%s %s %s: كل هدف 56 بكسلاً على الأقلّ%s' % (dev, uid, i, '' if not small else ': ' + ', '.join(sorted(small)[:6])))
  # البناء الحرّ يُحفظ ويُرسم في المعرض
  n0 = await pg.evaluate("() => designsGet().length")
  await pg.evaluate("() => { hush(); CUR = null; FLOW++; show('lesson'); cuFree(UNITS.find(u => u.id === 'm4.u3')); }"); await pg.wait_for_timeout(400)
  for c in ['2,0', '2,0', '1,1']:
    await tap(pg, '#stage svg [data-cell="%s"]' % c, kbd); await pg.wait_for_timeout(60)
  await tap(pg, '#wsSave', kbd); await pg.wait_for_timeout(400)
  d = await pg.evaluate("() => { const L = designsGet(); return [L.length, L[0] && L[0].cubes, (() => { try { return designSVG(L[0]).length; } catch (e) { return String(e); } })()]; }")
  check(d[0] == n0 + 1 and d[1] == [[0, 0, 0], [0, 1, 0], [2, 0, 0]] and isinstance(d[2], int) and d[2] > 500, '%s: البناء الحرّ يُحفظ في المعرض ويُرسم (%s)' % (dev, json.dumps(d[:2])))
  check(not errs, '%s: لا خطأ في الصفحة%s' % (dev, '' if not errs else ': ' + '; '.join(errs[:3])))
  await b.close()
async def main():
  async with async_playwright() as p:
    for k, dev in enumerate(DEVICES): await run(p, dev, kbd=(k == 2))
  print('cu_tap: %d failures' % len(FAILS)); sys.exit(1 if FAILS else 0)
asyncio.run(main())
