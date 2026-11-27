/* ================= M4-U7 الألعاب الحركية (D288 (2)، خطة ألعاب المرحلة 4) =================
   كل جولةٍ بندٌ حركيّ تشغّله SCENES.motion بنمط التمرين: يملأ الطفل بالأداة ويصبّ ثم يتحقّق بالحساب، وخطواته المنجزة تبقى بعد الخطأ (item.step)،
   وسلّم D240 من الخطأ الأول: سؤال الخطأ، ثم رسمٌ على المسرح (hint2)، ثم حلٌّ مشترك يقف قبل الخطوة الأخيرة، ثم الكشف. */
const c7Q = (id, live) => { const f = () => S(id); f(); REPLAY_HOOK = f; REPLAY_HOOK.live = live; };
const c7Pick = (ch, want, uk) => choosePick(shuffle(ch.map(([v]) => [String(v), c7Txt(v, uk), '<i></i>', c7Line(v, uk)])), String(want));
const c7PickOff = () => document.querySelectorAll('#stage .choices').forEach(x => x.remove());
/* زرّا الملء (أعلى وأسفل): n من lo إلى hi، وAUTO بنوعه للسائقين واللمس الحقيقي (window.__c7N) */
async function c7Fill(item, n0, lo, hi, want, kind, labels, redraw, guard) { let n = n0; redraw(n);
  const St = dqSteps(labels, d => { const v = Math.max(lo, Math.min(hi, n + d)); if (v === n) return false; n = v; redraw(n); return true; }, { vert: true });
  /*T*/window.__c7N = () => n;/*/T*/
  AUTO({ kind, ok: () => { n = want; redraw(n); rulDoneBtn().click(); }, wrong: () => { n = want > lo + 1 ? want - 1 : want + 1; redraw(n); rulDoneBtn().click(); } });
  await rulDone(() => { St.off(); REPLAY_HOOK = null; }, () => n > lo || !!guard); hush(); return n; }

/* ---------- د1 «كوب الماء» (c7Cup): r أو d، h؛ يملأ الأسطوانة طبقةً طبقة (كل طبقةٍ بمساحة القاعدة)، ثم يصبّها في الكأس المدرّج ويقرأ، ثم يتحقّق بالقانون ---------- */
function c7CupGeo(item) { const r = item.r ?? item.d / 2, u = Math.min(20, 130 / item.h, 44 / r), V = 3.14 * r * r * item.h, top = Math.max(60, Math.ceil((V * 1.25) / 20) * 20), J = { x: 236, w: 64, y0: 60, y1: 214 };
  return { r, u, cx: 130, bot: 214, rx: r * u, ry: Math.max(8, r * u * .26), H: item.h * u, V, base: 3.14 * r * r, J, jTop: top, jStep: top > 120 ? 20 : 10 }; }
function c7CupDraw(svg, item, G) { const g = el('g', { 'pointer-events': 'none' }, svg), F = c7Shape(g, 'cyl', { cx: G.cx, bot: G.bot, rx: G.rx, ry: G.ry, H: G.H });
  if (item.d != null) c7RLine(g, [F.cx - F.rx, F.top], [F.cx + F.rx, F.top], labelText('c7Diam') + ' ' + ciTxt(item.d, 'cm'), CI.d || C7.r); else c7RLine(g, F.ctr, F.rEnd, ciTxt(G.r, 'cm'));
  c7HArrow(g, F.cx - F.rx - 22, F.top, F.bot, ciTxt(item.h, 'cm'));
  const J = G.J, jh = J.y1 - J.y0, jg = el('g', { 'pointer-events': 'none' }, svg);   /* الكأس المدرّج: تدريجٌ كل jStep وعدده كل تدريجين إن ازدحم */
  el('rect', { x: J.x, y: J.y0, width: J.w, height: jh, rx: 6, fill: '#fbfdff', stroke: C7.edge, 'stroke-width': 2.6 }, jg);
  for (let v = G.jStep; v < G.jTop; v += G.jStep) { const y = J.y1 - jh * v / G.jTop, big = v % (2 * G.jStep) === 0 || G.jTop / G.jStep <= 7; geoLine(jg, J.x + J.w - (big ? 16 : 9), y, J.x + J.w, y, { color: C7.edge, w: 1.8 }); if (big) preLab(jg, J.x + J.w + 6, y + 5, MS(String(v)), { fs: 12, anchor: 'start', col: C7.edge }); }
  preLab(jg, J.x + J.w / 2, J.y0 - 8, labelText('voCm3'), { fs: 12, col: C7.edge });
  return { g, F, jg, cw: el('g', { 'pointer-events': 'none' }, svg), jw: el('g', { 'pointer-events': 'none' }, svg), lab: el('g', { 'pointer-events': 'none' }, svg) }; }
function c7CupWater(D, G, n, item) { D.cw.innerHTML = ''; if (!n) return; const F = D.F, lh = G.H / item.h, hh = Math.min(n, item.h) * lh;
  el('rect', { x: F.cx - F.rx, y: F.bot - hh, width: 2 * F.rx, height: hh, fill: C7.water }, D.cw);
  for (let i = 1; i <= Math.min(n, item.h); i++) el('path', { d: `M${F.cx - F.rx} ${F.bot - i * lh} A${F.rx} ${F.ry} 0 0 0 ${F.cx + F.rx} ${F.bot - i * lh}`, fill: 'none', stroke: C7.edge, 'stroke-width': 1.4, opacity: .55 }, D.cw);   /* حدّ كل طبقة */
  if (n > item.h) { el('ellipse', { cx: F.cx + F.rx + 10, cy: F.bot + 8, rx: 22, ry: 5, fill: C7.water }, D.cw); el('path', { d: `M${F.cx + F.rx} ${F.top} q 8 6 10 ${F.bot - F.top + 6}`, fill: 'none', stroke: 'rgba(80,160,220,.7)', 'stroke-width': 4 }, D.cw); }   /* فاض الماء */
  preLab(D.cw, F.cx, F.bot + F.ry + 16, labelText('c7LayN').replace('N', MS(String(n))), { fs: 14, col: C7.edge, dir: 'rtl' }); }   /* تحت الأسطوانة: لا يقع على تسمية نصف القطر */
function c7JugFill(D, G, v) { D.jw.innerHTML = ''; if (!v) return; const J = G.J, jh = J.y1 - J.y0, h = jh * v / G.jTop; el('rect', { x: J.x + 2, y: J.y1 - h, width: J.w - 4, height: h - 2, fill: C7.water }, D.jw); }
ITEM.c7Cup = {
  make(spec) { const R = c7VolCh({ fig: 'cyl', r: spec.r, d: spec.d, h: spec.h, rk: spec.rk ?? 0 }), G = c7CupGeo(spec), rd = Math.round(G.V / G.jStep) * G.jStep;
    return { ...spec, step: 0, fillN: spec.h, want: R.ch[0][0], ch: R.ch, read: rd, reads: [rd, rd - G.jStep, rd + G.jStep].filter(v => v > 0 && v < G.jTop), tag: 'c7-cup' }; },
  async ask(item, mode, tries) { item.__try = tries; const svg = m3Stage(262), G = c7CupGeo(item), D = c7CupDraw(svg, item, G), ctx = { svg, G, D }; let live = true; const isLive = () => live && svg.isConnected;
    const t0 = item.step, TG = k => tries >= 3 && t0 === k, tg = TG(0);   /* الحلّ المشترك في الخطوة التي وقف عندها الطفل وحدها (في الملء: إلى طبقةٍ قبل الحافّة)، وما بعدها بأسئلته */
    if (item.step >= 1) c7JugFill(D, G, G.V); if (item.step >= 2) preLab(D.lab, G.J.x + G.J.w / 2, G.J.y0 - 24, '≈ ' + MS(String(item.read)), { fs: 15, col: C7.ok });
    if (item.step === 0) { c7Q(tg ? 'gen.c7.together.fill' : tries === 0 ? item.q || 'gen.c7.q.cupFill' : 'gen.c7.q.cupFill', isLive);
      const n = await c7Fill(item, tg ? item.h - 1 : 0, 0, item.h + 2, item.h, 'c7Fill', ['c7LayDown', 'c7LayUp'], v => c7CupWater(D, G, v, item));
      if (n !== item.h) { live = false; return { ans: 'fill|' + n, ctx }; } item.step = 1; SFX.tick();
      await symTween(FAST ? 20 : 900, u => { c7CupWater(D, G, u < 1 ? item.h : 0, item); D.cw.setAttribute('opacity', 1 - u); c7JugFill(D, G, G.V * u); }); D.cw.innerHTML = ''; D.cw.setAttribute('opacity', 1); }   /* يُصبّ في الكأس */
    if (item.step === 1) { if (TG(1)) { const h = helpG(svg), J = G.J, y = J.y1 - (J.y1 - J.y0) * G.V / G.jTop, yr = J.y1 - (J.y1 - J.y0) * item.read / G.jTop; geoLine(h, J.x - 6, y, J.x + J.w + 4, y, { color: THINK_INK, w: 2.4, dash: '5 4' }); el('circle', { cx: J.x + J.w, cy: yr, r: 7, fill: 'none', stroke: THINK_INK, 'stroke-width': 2.6 }, h); await S('gen.c7.together.jug'); }   /* سطح الماء ممدوداً، وحلقةٌ على أقرب تدريج */
      else c7Q('gen.c7.q.cupRead', isLive);
      const k = +(await c7Pick(item.reads.map(v => [v]), item.read, 'cm3')); c7PickOff(); if (k !== item.read) { live = false; return { ans: 'read|' + k, ctx }; }   /* بجملها المسموعة (أعداد الكأس فوق المئة) */
      item.step = 2; preLab(D.lab, G.J.x + G.J.w / 2, G.J.y0 - 24, '≈ ' + MS(String(item.read)), { fs: 15, col: C7.ok }); SFX.tick(); }
    c7PiNote(D.lab, 52, 244); if (TG(2)) { ciEq(helpG(svg), 130, 36, `3.14 × ${G.r} × ${G.r} × ${item.h} = ؟`, C7.hl, 15); await S('gen.c7.together.vol'); } else c7Q('gen.c7.q.cupLaw', isLive);   /* القانون: والحساب مكتوبٌ في الثالثة */
    const k = await c7Pick(item.ch, item.want, 'cm3'); live = false; c7PickOff(); return { ans: 'law|' + k, ctx }; },
  judge(item, a) { const [w, v] = String(a).split('|');
    if (w === 'fill') return { ok: false, err: +v < item.h ? 'c7FillShort' : 'c7FillOver' }; if (w === 'read') return { ok: false, err: 'c7JugRead' };
    return v === String(item.want) ? { ok: true } : { ok: false, err: (item.ch.find(([x]) => String(x) === v) || [])[1] || 'c7VolOff' }; },
  onOk(item, r) { SFX.good(); const c = r && r.ctx; if (c && c.svg.isConnected) ciEq(c.svg, 130, 36, `3.14 × ${c.G.r} × ${c.G.r} × ${item.h} = ${item.want}`, C7.ok, 15); },   /* والكأس قرأ قريباً منه */
  onWrong() { SFX.soft(); },
  async hint2(item, r, err) { const c = r && r.ctx; if (c && c.svg && c.svg.isConnected) { const m = helpG(c.svg), F = c.D.F, G = c.G;
      if (err === 'c7FillShort' || err === 'c7FillOver') { geoLine(m, F.cx - F.rx - 6, F.top, F.cx + F.rx + 6, F.top, { color: THINK_INK, w: 3, dash: '6 4' }); hlSeg(m, [F.cx - F.rx - 22, F.top], [F.cx - F.rx - 22, F.bot], H2C[1]); ciRule(m, 180, [30], labelText('c7AskFill'), C7.hl, 15); }   /* الحافّة والارتفاع */
      else if (err === 'c7JugRead') { const J = G.J, y = J.y1 - (J.y1 - J.y0) * G.V / G.jTop; geoLine(m, J.x - 6, y, J.x + J.w + 4, y, { color: THINK_INK, w: 2.4, dash: '5 4' }); ciRule(m, 180, [30], labelText('c7AskJug'), C7.hl, 15); }
      else { el('ellipse', { cx: F.cx, cy: F.top, rx: F.rx, ry: F.ry, fill: H2C[0], opacity: .35 }, m); hlSeg(m, [F.cx - F.rx - 22, F.top], [F.cx - F.rx - 22, F.bot], H2C[1]); ciRule(m, 180, [30], labelText('c7Ask.cyl'), C7.hl, 15); } }
    await S(err === 'c7FillShort' || err === 'c7FillOver' ? 'gen.c7.hint.fill' : err === 'c7JugRead' ? 'gen.c7.hint.jug' : 'gen.c7.hint.vol.cyl'); },
  async together() {},
  async reveal(item, r) { const c = r && r.ctx; if (c && c.svg.isConnected) { c7JugFill(c.D, c.G, c.G.V); ciEq(c.svg, 130, 36, `3.14 × ${c.G.r} × ${c.G.r} × ${item.h} = ${item.want}`, C7.ok, 15); }
    item.step = 3; await S('gen.ci.reveal.calc', { noGap: true }); await S(c7Line(item.want, 'cm3'), { append: true }); },
  praise: () => 'praiseMeasure', twin(item) { return item.twin || null; },
};

/* ---------- د2 «غلّف العلبة» (c7Wrap): r، h، lid؛ يلمس وجوه العلبة المفكوكة فتُغلَّف (الغطاء والقاع والجانب)، ثم طول المستطيل، ثم الورق كله ---------- */
function c7WrapGeo(item) { const u = Math.min(16, 100 / item.h, 44 / item.r), rx = item.r * u, ry = Math.max(7, rx * .28), H = item.h * u, cx = 128, top = 66;   /* سهم الارتفاع وعدده داخل الإطار */
  return { u, cx, rx, ry, H, top, bot: top + H, lidY: top - ry - 22, baseY: top + H + ry + 22 }; }
function c7WrapCh(item) { const pi = 3.14, b = pi * item.r * item.r, lat = 2 * pi * item.r * item.h;
  if (item.lid !== false) return c7SACh({ r: item.r, h: item.h, ask: 'sa', rk: item.rk ?? 0 });
  return rkPick(c7R1(b + lat), [[2 * b + lat, 'saLidAdd'], [lat, 'saLatOnly'], [b + pi * item.r * item.h, 'saHalfC']].map(([v, e]) => [c7R1(v), e]), 1); }   /* علبةٌ بلا غطاء: قاعٌ واحد، وإضافة الغطاء بين الخيارات دائماً (الجواب أوسطها) */
function c7WrapDraw(svg, item, G) { const g = el('g', {}, svg), P = {}, mk = (k, f) => { const t = el('g', { 'data-face': k }, g); f(t); P[k] = t; };
  if (item.lid !== false) mk('lid', t => { el('ellipse', { cx: G.cx, cy: G.lidY, rx: G.rx, ry: G.ry, fill: C7.top, stroke: C7.edge, 'stroke-width': 2.6 }, t); });
  mk('side', t => { el('path', { d: `M${G.cx - G.rx} ${G.top} L${G.cx - G.rx} ${G.bot} A${G.rx} ${G.ry} 0 0 0 ${G.cx + G.rx} ${G.bot} L${G.cx + G.rx} ${G.top} A${G.rx} ${G.ry} 0 0 1 ${G.cx - G.rx} ${G.top}`, fill: C7.side, stroke: C7.edge, 'stroke-width': 2.6 }, t);
    el('ellipse', { cx: G.cx, cy: G.top, rx: G.rx, ry: G.ry, fill: item.lid === false ? '#cfdbe6' : 'none', stroke: C7.edge, 'stroke-width': 1.6, 'stroke-dasharray': item.lid === false ? '' : '4 3' }, t); });
  mk('base', t => { el('ellipse', { cx: G.cx, cy: G.baseY, rx: G.rx, ry: G.ry, fill: C7.top, stroke: C7.edge, 'stroke-width': 2.6 }, t); });
  const lg = el('g', { 'pointer-events': 'none' }, g); c7RLine(lg, [G.cx, G.top], [G.cx + G.rx, G.top], ciTxt(item.r, 'cm')); c7HArrow(lg, G.cx - G.rx - 20, G.top, G.bot, ciTxt(item.h, 'cm'));
  return { g, P, net: el('g', { 'pointer-events': 'none' }, svg) }; }
/* الورقة على الوجه، وقطعتها مسطّحةً في الشبكة يميناً (دائرتان ومستطيل) */
function c7WrapPaper(D, G, item, on) { D.net.innerHTML = ''; const W = 2 * 3.14 * G.rx, k = Math.min(1, 150 / W), w = W * k, hh = G.H * k, R = G.rx * k, x0 = 258 - w / 2, y0 = 132 - hh / 2;
  for (const [f, t] of Object.entries(D.P)) { const s = t.querySelector('ellipse, path'); s.setAttribute('fill', on[f] ? '#f6d98a' : f === 'side' ? C7.side : C7.top); }
  if (on.side) el('rect', { x: x0, y: y0, width: w, height: hh, fill: '#f6d98a', stroke: '#b9813f', 'stroke-width': 2 }, D.net);
  if (on.lid) el('circle', { cx: x0 + w / 2, cy: y0 - R - 2, r: R, fill: '#f6d98a', stroke: '#b9813f', 'stroke-width': 2 }, D.net);
  if (on.base) el('circle', { cx: x0 + w / 2, cy: y0 + hh + R + 2, r: R, fill: '#f6d98a', stroke: '#b9813f', 'stroke-width': 2 }, D.net);
  return { x0, y0, w, hh, R }; }
ITEM.c7Wrap = {
  make(spec) { const L = c7SACh({ r: spec.r, h: spec.h, ask: 'len', rk: spec.rk ?? 0 }), T = c7WrapCh(spec); return { ...spec, step: 0, lens: L, len: L[0][0], ch: T, want: T[0][0], tag: 'c7-wrap' + (spec.lid === false ? '-open' : '') }; },
  async ask(item, mode, tries) { item.__try = tries; const svg = m3Stage(262), Q = c7WrapGeo(item), D = c7WrapDraw(svg, item, Q), ctx = { svg, Q, D }; let live = true; const isLive = () => live && svg.isConnected;
    const faces = Object.keys(D.P), on = Object.fromEntries(faces.map(f => [f, item.step >= 1])), t0 = item.step, TG = k => tries >= 3 && t0 === k, tg = TG(0); if (tg) faces.forEach(f => { on[f] = f !== 'base'; });   /* الحلّ المشترك: غلّفنا ما عدا القاع */
    let N = c7WrapPaper(D, Q, item, on);
    if (item.step === 0) { c7Q(tg ? 'gen.c7.together.wrap' : tries === 0 ? item.q || 'gen.c7.q.wrap' : 'gen.c7.q.wrap', isLive);
      const T = faces.map(f => ({ g: D.P[f], f })); T.forEach(t => { t.g.setAttribute('role', 'button'); t.g.setAttribute('tabindex', 0); t.g.setAttribute('aria-label', plain(G(labelText('c7Face.' + t.f)))); t.g.style.cursor = 'pointer'; hitPad(t.g, 56);
        t.g.onclick = () => { on[t.f] = !on[t.f]; N = c7WrapPaper(D, Q, item, on); SFX.tick(); /*T*/window.__c7W = faces.filter(f => on[f]).join(',');/*/T*/ }; });
      routeClicks(T.map(t => t.g)); /*T*/window.__c7W = faces.filter(f => on[f]).join(',');/*/T*/
      AUTO({ kind: 'c7Wrap', ok: () => { faces.forEach(f => { on[f] = true; }); N = c7WrapPaper(D, Q, item, on); rulDoneBtn().click(); }, wrong: () => { faces.forEach(f => { on[f] = f === 'side'; }); N = c7WrapPaper(D, Q, item, on); rulDoneBtn().click(); } });
      await rulDone(() => { REPLAY_HOOK = null; untarget(T.map(t => t.g)); }, () => faces.some(f => on[f])); hush();
      const miss = faces.filter(f => !on[f]); if (miss.length) { live = false; return { ans: 'wrap|' + miss.join(','), ctx }; } item.step = 1; SFX.tick(); }
    if (item.step === 1) { const h = el('g', { 'pointer-events': 'none' }, svg); geoLine(h, N.x0, N.y0 + N.hh + 10, N.x0 + N.w, N.y0 + N.hh + 10, { color: C7.r, w: 2.6 }); preLab(h, N.x0 + N.w / 2, N.y0 + N.hh / 2 + 6, '؟', { fs: 18, col: C7.q });
      if (TG(1)) { ciEq(helpG(svg), 258, 30, `2 × 3.14 × ${item.r} = ؟`, C7.hl, 15); await S('gen.c7.together.len'); } else c7Q('gen.c7.q.wrapLen', isLive);
      const k = await c7Pick(item.lens, item.len, 'cm'); c7PickOff(); h.remove(); if (k !== String(item.len)) { live = false; return { ans: 'len|' + k, ctx }; } item.step = 2; SFX.tick(); }
    preLab(D.net, N.x0 + N.w / 2, N.y0 + N.hh / 2 + 6, c7Txt(item.len, 'cm'), { fs: 13, col: C7.r });
    c7PiNote(D.net, 196, 244); if (TG(2)) { ciEq(helpG(svg), 180, 30, (item.lid === false ? `3.14 × ${item.r} × ${item.r}` : `2 × 3.14 × ${item.r} × ${item.r}`) + ` + ${item.len} × ${item.h} = ؟`, C7.hl, 14); await S('gen.c7.together.sa'); } else c7Q('gen.c7.q.wrapAll', isLive);
    const k = await c7Pick(item.ch, item.want, 'cm2'); live = false; c7PickOff(); return { ans: 'all|' + k, ctx }; },
  judge(item, a) { const [w, v] = String(a).split('|');
    if (w === 'wrap') return { ok: false, err: v.split(',').includes('side') ? 'saNoSide' : 'saOneBase' };   /* القاع أو الغطاء ناقص: «ينسى إحدى القاعدتين» */
    if (w === 'len') return { ok: false, err: (item.lens.find(([x]) => String(x) === v) || [])[1] || 'c7SAOff' };
    return v === String(item.want) ? { ok: true } : { ok: false, err: (item.ch.find(([x]) => String(x) === v) || [])[1] || 'c7SAOff' }; },
  onOk() { SFX.good(); }, onWrong() { SFX.soft(); },
  async hint2(item, r, err) { const c = r && r.ctx; if (c && c.svg && c.svg.isConnected) { const m = helpG(c.svg), Q = c.Q;
      if (err === 'saOneBase' || err === 'saNoSide') { for (const f of Object.keys(c.D.P)) { const b = c.D.P[f].getBBox(); el('rect', { x: b.x - 4, y: b.y - 4, width: b.width + 8, height: b.height + 8, rx: 8, fill: 'none', stroke: H2C[f === 'side' ? 1 : 0], 'stroke-width': 3, 'stroke-dasharray': '6 4' }, m); } ciRule(m, 180, [30, 246], labelText('c7AskWrap'), C7.hl, 15); }   /* كل وجهٍ في إطار: كم وجهاً؟ */
      else { hlSeg(m, [Q.cx - Q.rx, Q.top], [Q.cx + Q.rx, Q.top], H2C[0]); ciRule(m, 180, [30, 246], labelText('c7AskSA.' + (err && /^len/.test(err) ? 'len' : 'sa')), C7.hl, 15); } }
    await S(err === 'saOneBase' || err === 'saNoSide' ? 'gen.c7.hint.wrap' : err && /^len/.test(err) ? 'gen.c7.hint.sa.len' : 'gen.c7.hint.sa.sa'); },
  async together() {},
  async reveal(item, r) { const c = r && r.ctx; if (c && c.svg.isConnected) { const on = Object.fromEntries(Object.keys(c.D.P).map(f => [f, true])); const N = c7WrapPaper(c.D, c.Q, item, on); preLab(c.D.net, N.x0 + N.w / 2, N.y0 + N.hh / 2 + 6, c7Txt(item.len, 'cm'), { fs: 13, col: C7.ok }); }
    item.step = 3; await S('gen.ci.reveal.calc', { noGap: true }); await S(c7Line(item.want, 'cm2'), { append: true }); },
  praise: () => 'praiseThink', twin(item) { return item.twin || null; },
};

/* ---------- د3 «ثلاثة مخاريط وأسطوانة» (c7Thirds): fig cone|pyr، V (حجم الأسطوانة أو المنشور) أو v (حجم المخروط)؛ يصبّ تعبئةً تعبئة حتى تمتلئ، ثم يحسب ---------- */
function c7ThirdsDraw(svg, item) { const g = el('g', { 'pointer-events': 'none' }, svg), a = item.fig === 'pyr' ? 'pyr' : 'cone', b = item.fig === 'pyr' ? 'prism' : 'cyl', o = { bot: 206, rx: 50, ry: 13, H: 124 };
  const A = c7Shape(g, a, { ...o, cx: 96 }), B = c7Shape(g, b, { ...o, cx: 262 }), x0 = b === 'prism' ? B.A[0] : B.cx - B.rx, wd = b === 'prism' ? B.B[0] - B.A[0] : 2 * B.rx;
  return { g, A, B, x0, wd, w: el('g', { 'pointer-events': 'none' }, svg), lab: el('g', { 'pointer-events': 'none' }, svg) }; }
function c7ThirdsWater(D, n, cnt = true) { D.w.innerHTML = ''; const H = 124, h = H * Math.min(n, 3) / 3; if (n) el('rect', { x: D.x0, y: D.B.bot - h, width: D.wd, height: h, fill: C7.water }, D.w);
  for (let i = 1; i < 3; i++) geoLine(D.w, D.x0 + D.wd - 12, D.B.bot - H * i / 3, D.x0 + D.wd, D.B.bot - H * i / 3, { color: C7.edge, w: 1.6 });   /* علامتا الثلث والثلثين على الجدار */
  if (n > 3) el('ellipse', { cx: D.x0 + D.wd + 16, cy: D.B.bot + 6, rx: 22, ry: 5, fill: C7.water }, D.w);   /* فاض */
  if (cnt) preLab(D.w, D.x0 + D.wd / 2, 52, MS(String(n)) + ' ×', { fs: 18, col: C7.coneEdge }); }   /* العدّ في خطوة الصبّ وحدها */
ITEM.c7Thirds = {
  make(spec) { const whole = spec.v != null, x = whole ? spec.v : spec.V, w = whole ? 3 * x : c7R1(x / 3), P = whole ? [[x, 'c7ThWhSame'], [2 * x, 'coneHalf'], [c7R1(x / 3), 'c7ThWhDiv'], [4 * x, 'c7ThFour']] : [[x, 'coneNoThird'], [c7R1(x / 2), 'coneHalf'], [3 * x, 'c7ThTimes'], [c7R1(x / 4), 'c7ThFour']];   /* كـ thirds في u7.py */
    return { ...spec, step: 0, pourN: 3, want: w, ch: rkPick(w, P, spec.rk ?? 0), tag: 'c7-thirds-' + (spec.fig || 'cone') }; },
  async ask(item, mode, tries) { item.__try = tries; const svg = m3Stage(262), D = c7ThirdsDraw(svg, item), ctx = { svg, D }; let live = true; const isLive = () => live && svg.isConnected;
    const t0 = item.step, tg = tries >= 3 && t0 === 0, small = item.fig === 'pyr' ? 'c7Pyr' : 'c7Cone';
    if (item.step >= 1) c7ThirdsWater(D, 3, false);
    if (item.step === 0) { c7Q(tg ? 'gen.c7.together.pour' : tries === 0 ? item.q || 'gen.c7.q.pour' : 'gen.c7.q.pour', isLive);
      const n = await c7Fill(item, tg ? 2 : 0, 0, 4, 3, 'c7Pour', ['c7PourDown', 'c7PourUp'], v => c7ThirdsWater(D, v));
      if (n !== 3) { live = false; return { ans: 'pour|' + n, ctx }; } item.step = 1; SFX.tick(); }
    const known = item.v != null ? item.v : item.V; preLab(D.lab, item.v != null ? 96 : 262, 236, labelText(item.v != null ? small : item.fig === 'pyr' ? 'c7Prism' : 'c7Cyl') + ': ' + c7Txt(known, 'cm3'), { fs: 14, col: C7.ink, dir: 'rtl' });   /* المعلوم تحت صاحبه */
    preLab(D.lab, item.v != null ? 262 : 96, 236, '؟', { fs: 18, col: C7.q });
    if (tries >= 3 && t0 === 1) { ciEq(helpG(svg), 180, 30, item.v != null ? `3 × ${item.v} = ؟` : `${item.V} ÷ 3 = ؟`, C7.hl, 15); await S('gen.c7.together.thirds'); } else c7Q(item.v != null ? 'gen.c7.q.thWhole' : 'gen.c7.q.thPart', isLive);
    const k = await c7Pick(item.ch, item.want, 'cm3'); live = false; c7PickOff(); return { ans: 'calc|' + k, ctx }; },
  judge(item, a) { const [w, v] = String(a).split('|'); if (w === 'pour') return { ok: false, err: +v < 3 ? 'c7PourShort' : 'c7PourOver' };
    return v === String(item.want) ? { ok: true } : { ok: false, err: (item.ch.find(([x]) => String(x) === v) || [])[1] || 'c7VolOff' }; },
  onOk() { SFX.good(); }, onWrong() { SFX.soft(); },
  async hint2(item, r, err) { const c = r && r.ctx; if (c && c.svg && c.svg.isConnected) { const m = helpG(c.svg), D = c.D;
      if (err === 'c7PourShort' || err === 'c7PourOver') { geoLine(m, D.x0 - 6, D.B.bot - 124, D.x0 + D.wd + 6, D.B.bot - 124, { color: THINK_INK, w: 3, dash: '6 4' }); for (let i = 1; i <= 3; i++) preLab(m, D.x0 - 14, D.B.bot - 124 * (i - .5) / 3 + 5, MS(String(i)), { fs: 13, col: THINK_INK }); ciRule(m, 180, [244], labelText('c7AskPour'), C7.hl, 15); }   /* تحت المجسّمين: لا تغطّي العدّ فوق الكبير */   /* الحافّة، والأثلاث مرقّمة */
      else ciRule(m, 180, [30], labelText('c7Ask.cone'), C7.hl, 15); }
    await S(err === 'c7PourShort' || err === 'c7PourOver' ? 'gen.c7.hint.pour' : 'gen.c7.hint.vol.cone'); },
  async together() {},
  async reveal(item, r) { const c = r && r.ctx; if (c && c.svg.isConnected) { c7ThirdsWater(c.D, 3, false); ciEq(c.svg, 180, 30, item.v != null ? `3 × ${item.v} = ${item.want}` : `${item.V} ÷ 3 = ${item.want}`, C7.ok, 15); }
    item.step = 2; await S('gen.ci.reveal.calc', { noGap: true }); await S(c7Line(item.want, 'cm3'), { append: true }); },
  praise: () => 'praiseThink', twin(item) { return item.twin || null; },
};

/* ---------- د4 «محوّل الخزان» (c7Tank): a، b، c بالسنتيمتر (مضاعفات 10)، to cm3|m3؛ يملأ الخزان طبقاتٍ (كل طبقةٍ عمقها 10 سم لتراتٌ معلومة)، ثم اللترات، ثم الوحدة الأخرى ---------- */
function c7TankGeo(item) { const s = Math.min(156 / item.a, 120 / item.c), W = item.a * s, H = item.c * s, D = Math.min(56, item.b * s * .5), dx = D * .8, dy = D * .5, x0 = Math.max(90, 168 - (W + dx) / 2), bot = 222;   /* سهم الارتفاع وعدده داخل الإطار */
  return { s, W, H, dx, dy, x0, bot, top: bot - H, per: item.a * item.b / 100, layers: item.c / 10, L: item.a * item.b * item.c / 1000 }; }
function c7TankDraw(svg, item, T) { const g = el('g', { 'pointer-events': 'none' }, svg), { x0, bot, top, W, dx, dy } = T;
  el('polygon', { points: polyStr([[x0 + W, bot], [x0 + W + dx, bot - dy], [x0 + W + dx, top - dy], [x0 + W, top]]), fill: '#d6e3ef', stroke: C7.edge, 'stroke-width': 2.4 }, g);
  el('polygon', { points: polyStr([[x0, top], [x0 + W, top], [x0 + W + dx, top - dy], [x0 + dx, top - dy]]), fill: C7.top, stroke: C7.edge, 'stroke-width': 2.4 }, g);
  el('rect', { x: x0, y: top, width: W, height: bot - top, fill: 'rgba(230,238,246,.55)', stroke: C7.edge, 'stroke-width': 2.6 }, g);
  preLab(g, x0 + W / 2, bot + 17, ciTxt(item.a, 'cm'), { fs: 14, col: C7.ink }); preLab(g, x0 + W + dx / 2 + 16, bot - dy / 2 + 4, ciTxt(item.b, 'cm'), { fs: 14, col: C7.ink, anchor: 'start' });
  c7HArrow(g, x0 - 18, top, bot, ciTxt(item.c, 'cm'));
  preLab(g, 180, 34, labelText('c7PerLayer').replace('N', MS(String(T.per))), { fs: 15, col: C7.edge, dir: 'rtl' });   /* كل طبقةٍ عمقها 10 سم: كم لتراً (معلوم) */
  return { g, w: el('g', { 'pointer-events': 'none' }, svg), lab: el('g', { 'pointer-events': 'none' }, svg) }; }
function c7TankWater(D, T, n) { D.w.innerHTML = ''; const lh = T.H / T.layers, h = Math.min(n, T.layers) * lh, { x0, bot, W, dx, dy } = T; if (n) {
    el('rect', { x: x0 + 1.5, y: bot - h, width: W - 3, height: h - 1.5, fill: C7.water }, D.w); el('polygon', { points: polyStr([[x0 + W, bot], [x0 + W + dx, bot - dy], [x0 + W + dx, bot - dy - h], [x0 + W, bot - h]]), fill: 'rgba(80,160,220,.3)' }, D.w);
    for (let i = 1; i < Math.min(n, T.layers); i++) geoLine(D.w, x0, bot - i * lh, x0 + W, bot - i * lh, { color: C7.edge, w: 1.2, dash: '4 3' }); }
  if (n > T.layers) el('ellipse', { cx: x0 + W + dx + 18, cy: bot + 4, rx: 24, ry: 5, fill: C7.water }, D.w);
  preLab(D.w, x0 + W / 2, T.top + T.H / 2 + 5, labelText('c7LayN').replace('N', MS(String(n))), { fs: 14, col: C7.edge, dir: 'rtl' }); }   /* على وجه الخزان: لا تقع عليه بطاقة المساعدة فوقه */
const c7TankTo = (L, to) => to === 'm3' ? [[L / 1000, null], [L / 100, 'm3L100'], [L, 'convNone']] : [[L * 1000, null], [L * 100, 'lit100'], [L * 1e6, 'litM'], [L, 'lit1']];   /* كـ tank في u7.py */
ITEM.c7Tank = {
  make(spec) { const T = c7TankGeo(spec), L = T.L, P1 = [[T.layers, 'c7TankLayers'], [L * 10, 'lit100'], [spec.a * spec.b * spec.c, 'c7TankCm3']], C = c7TankTo(L, spec.to), R3 = v => Math.round(v * 1e6) / 1e6;
    return { ...spec, step: 0, tankN: T.layers, L, lits: rkPick(L, P1, spec.rk ?? 0), want: R3(C[0][0]), ch: rkPick(R3(C[0][0]), C.slice(1).map(([v, e]) => [R3(v), e]), spec.rk ?? 0), tag: 'c7-tank-' + spec.to }; },
  async ask(item, mode, tries) { item.__try = tries; const svg = m3Stage(262), T = c7TankGeo(item), D = c7TankDraw(svg, item, T), ctx = { svg, T, D }; let live = true; const isLive = () => live && svg.isConnected;
    const t0 = item.step, TG = k => tries >= 3 && t0 === k, tg = TG(0);
    if (item.step >= 1) c7TankWater(D, T, T.layers);
    if (item.step === 0) { c7Q(tg ? 'gen.c7.together.tank' : tries === 0 ? item.q || 'gen.c7.q.tankFill' : 'gen.c7.q.tankFill', isLive);
      const n = await c7Fill(item, tg ? T.layers - 1 : 0, 0, T.layers + 2, T.layers, 'c7Tank', ['c7LayDown', 'c7LayUp'], v => c7TankWater(D, T, v));
      if (n !== T.layers) { live = false; return { ans: 'fill|' + n, ctx }; } item.step = 1; SFX.tick(); }
    if (item.step === 1) { if (TG(1)) { ciEq(helpG(svg), 180, 58, `${T.per} × ${T.layers} = ؟`, C7.hl, 15); await S('gen.c7.together.tankL'); } else c7Q('gen.c7.q.tankL', isLive);
      const k = await c7Pick(item.lits, item.L, 'L'); c7PickOff(); if (k !== String(item.L)) { live = false; return { ans: 'lit|' + k, ctx }; } item.step = 2; SFX.tick(); }
    preLab(D.lab, 180, 58, c7Txt(item.L, 'L'), { fs: 15, col: C7.ok });
    if (TG(2)) { ciEq(helpG(svg), 180, 82, item.to === 'm3' ? `${item.L} ÷ 1000 = ؟` : `${item.L} × 1000 = ؟`, C7.hl, 15); await S('gen.c7.together.conv'); } else c7Q('gen.c7.q.tankTo.' + item.to, isLive);
    const k = await c7Pick(item.ch, item.want, item.to); live = false; c7PickOff(); return { ans: 'to|' + k, ctx }; },
  judge(item, a) { const [w, v] = String(a).split('|'); if (w === 'fill') return { ok: false, err: +v < item.tankN ? 'c7FillShort' : 'c7FillOver' };
    if (w === 'lit') return { ok: false, err: (item.lits.find(([x]) => String(x) === v) || [])[1] || 'c7ConvOff' };
    return v === String(item.want) ? { ok: true } : { ok: false, err: (item.ch.find(([x]) => String(x) === v) || [])[1] || 'c7ConvOff' }; },
  onOk() { SFX.good(); }, onWrong() { SFX.soft(); },
  async hint2(item, r, err) { const c = r && r.ctx; if (c && c.svg && c.svg.isConnected) { const m = helpG(c.svg), T = c.T;
      if (err === 'c7FillShort' || err === 'c7FillOver') { geoLine(m, T.x0 - 6, T.top, T.x0 + T.W + 6, T.top, { color: THINK_INK, w: 3, dash: '6 4' }); hlSeg(m, [T.x0 - 18, T.top], [T.x0 - 18, T.bot], H2C[1]); ciRule(m, 180, [82], labelText('c7AskTank'), C7.hl, 15); }   /* الحافّة، والارتفاع طبقاتٌ من 10 */
      else if (c.D && item.step <= 1) ciRule(m, 180, [82], labelText('c7AskTankL'), C7.hl, 15);
      else ciRule(m, 180, [82], labelText(item.to === 'm3' ? 'c7AskM3' : 'c7AskL'), C7.hl, 15); }
    await S(err === 'c7FillShort' || err === 'c7FillOver' ? 'gen.c7.hint.tank' : item.step <= 1 ? 'gen.c7.hint.tankL' : 'gen.c7.hint.conv'); },
  async together() {},
  async reveal(item, r) { const c = r && r.ctx; if (c && c.svg.isConnected) { c7TankWater(c.D, c.T, c.T.layers); preLab(c.D.lab, 180, 58, c7Txt(item.L, 'L') + ' = ' + c7Txt(item.want, item.to), { fs: 15, col: C7.ok, dir: 'rtl' }); }
    item.step = 3; await S('gen.ci.reveal.calc', { noGap: true }); await S(c7Line(item.want, item.to), { append: true }); },
  praise: () => 'praiseMeasure', twin(item) { return item.twin || null; },
};
