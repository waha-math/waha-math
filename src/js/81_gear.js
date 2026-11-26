/* =====================================================================
   عُدّة المهندس (هويات المراحل: S1 «خوذة وحقيبة أدوات»، S2 «حقيبة الأدوات تُملأ بالمسطرة (S2-U0) والمنقلة (S2-U3) ومثلّث الرسم والفرجار (S2-U9)»،
   S3 «نظارات المقياس (S3-U10)»، M4 «قبعة زرقاء داكنة (U1) وقلم الفرجار الذهبي (U8) ومصباح البرهان (الجزء أ2)»؛ D176 بتعديل D230).
   صفٌّ صغير تحت التحية في الخريطة بما ناله الطفل، وجملةٌ ورسمٌ بعد مشهد الشارة التي أهدته القطعة. للزينة لا أهداف لمس فيها.
   ===================================================================== */
const GEAR = [
  { k: 'helmet', lab: 'gear.helmet', line: 'gen.gear.helmet', got: () => stageStones('m1').placed >= 6, by: u => stageOf(u) === 'm1' && stageStones('m1').placed >= 6 },
  { k: 'bag', lab: 'gear.bag', got: () => !!PROG['badge:m2.u0'], parts: () => ['m2.u0', 'm2.u3', 'm2.u9'].filter(u => PROG['badge:' + u]).length,
    line: null, lines: { 'm2.u0': 'gen.gear.ruler', 'm2.u3': 'gen.gear.prot', 'm2.u9': 'gen.gear.compass' } },
  { k: 'glasses', lab: 'gear.glasses', line: 'gen.gear.glasses', got: () => !!PROG['badge:m3.u10'], by: u => u === 'm3.u10' },
  { k: 'cap', lab: 'gear.cap', line: 'gen.gear.cap', got: () => !!PROG['badge:m4.u1'], by: u => u === 'm4.u1' },
  { k: 'pen', lab: 'gear.pen', line: 'gen.gear.pen', got: () => !!PROG['badge:m4.u8'], by: u => u === 'm4.u8' },
  { k: 'lamp', lab: 'gear.lamp', line: 'gen.gear.lamp', got: () => !!(PROG['m4.u10.d2'] || {}).done, by: u => u === 'a2:m4' },
];
/* أيقونة القطعة في مربّع 40 × 40؛ والحقيبة بما فيها من أدوات (n من ثلاث) */
function gearArt(k, n = 3) { const s = el('svg', { viewBox: '0 0 40 40', 'aria-hidden': 'true' }), E = (t, a) => el(t, a, s);
  if (k === 'helmet') { E('path', { d: 'M7 26 A13 13 0 0 1 33 26 Z', fill: '#f2b33d', stroke: '#c8831e', 'stroke-width': 2 }); E('rect', { x: 4, y: 25, width: 32, height: 5, rx: 2.5, fill: '#e09b26', stroke: '#c8831e', 'stroke-width': 1.5 }); E('rect', { x: 18, y: 12, width: 4, height: 13, rx: 2, fill: '#c8831e' }); }
  else if (k === 'bag') { if (n >= 1) E('rect', { x: 9, y: 6, width: 6, height: 18, rx: 1, fill: '#f7d76b', stroke: '#b58a1e', 'stroke-width': 1.2, transform: 'rotate(-12 12 15)' });
    if (n >= 2) E('path', { d: 'M17 16 A7 7 0 0 1 31 16 Z', fill: '#cfe3f3', stroke: '#2a5f94', 'stroke-width': 1.5 });
    if (n >= 3) E('path', { d: 'M24 4 L20 17 M24 4 L28 17', stroke: '#7a8a94', 'stroke-width': 2, 'stroke-linecap': 'round' });
    E('path', { d: 'M5 17 H35 L32 35 H8 Z', fill: '#c98f55', stroke: '#8a5a2b', 'stroke-width': 2, 'stroke-linejoin': 'round' }); E('path', { d: 'M14 23 H26', stroke: '#8a5a2b', 'stroke-width': 2, 'stroke-linecap': 'round' }); }
  else if (k === 'glasses') { for (const cx of [12, 28]) E('circle', { cx, cy: 21, r: 7, fill: '#e4f0fa', stroke: '#24323a', 'stroke-width': 2.4 }); E('path', { d: 'M19 20 Q20 17 21 20 M5 19 L2 15 M35 19 L38 15', stroke: '#24323a', 'stroke-width': 2, fill: 'none', 'stroke-linecap': 'round' }); }
  else if (k === 'cap') { E('path', { d: 'M8 25 A12 11 0 0 1 32 25 Z', fill: '#1f3f6b', stroke: '#13284a', 'stroke-width': 1.5 }); E('path', { d: 'M30 25 H38 Q37 29 30 28 Z', fill: '#13284a' }); E('circle', { cx: 20, cy: 14, r: 2, fill: '#f2b33d' }); }
  else if (k === 'pen') { E('path', { d: 'M20 4 L13 34 M20 4 L27 34', stroke: '#e0b13d', 'stroke-width': 3.2, 'stroke-linecap': 'round' }); E('circle', { cx: 20, cy: 6, r: 4, fill: '#f2c94c', stroke: '#b58a1e', 'stroke-width': 1.5 }); E('path', { d: 'M26 31 L29 37 L25 35 Z', fill: '#24323a' }); }
  else if (k === 'lamp') { E('path', { d: 'M8 28 Q20 34 32 26 L36 22 Q30 22 28 24 Q22 20 14 22 Q8 23 8 28 Z', fill: '#e0b13d', stroke: '#b58a1e', 'stroke-width': 1.5 }); E('path', { d: 'M8 26 Q2 24 4 20', stroke: '#b58a1e', 'stroke-width': 2, fill: 'none' });
    E('path', { d: 'M35 20 Q37 13 35 9 Q39 13 37 20 Z', fill: '#f7a23b' }); E('rect', { x: 14, y: 32, width: 12, height: 3, rx: 1.5, fill: '#b58a1e' }); }
  return s; }
/* صفّ العُدّة تحت التحية: ما ناله الطفل وحده، ولا صفّ إن لم ينل شيئاً */
function renderGear() { let row = $('#gear'); if (!row) { row = document.createElement('div'); row.id = 'gear'; row.className = 'gear'; row.setAttribute('role', 'list'); const h = $('#home .hello'); if (!h) return; h.after(row); }
  row.innerHTML = ''; row.setAttribute('aria-label', plain(G(labelText('gearRow'))));
  for (const g of GEAR) { if (!g.got()) continue; const i = document.createElement('i'); i.setAttribute('role', 'listitem'); i.setAttribute('aria-label', plain(G(labelText(g.lab)))); i.title = plain(G(labelText(g.lab))); i.dataset.gear = g.k;
    i.appendChild(gearArt(g.k, g.parts ? g.parts() : 3)); row.appendChild(i); }
  row.hidden = !row.children.length; }
/* بعد مشهد الشارة: القطعة التي أهدتها هذه الشارة كبيرةً في المسرح، وجملتها */
async function gearScene(uid) { const hit = []; for (const g of GEAR) { if (g.lines && g.lines[uid]) hit.push([g, g.lines[uid]]); else if (g.by && g.line && g.by(uid)) hit.push([g, g.line]); }
  for (const [g, line] of hit) { const svg = newStage(240, { oasisOpacity: .3 }), art = gearArt(g.k, g.parts ? g.parts() : 3), w = el('g', { transform: 'translate(180 120)' }, svg), inner = el('g', { 'data-gearshow': g.k }, w);
    art.setAttribute('x', -60); art.setAttribute('y', -60); art.setAttribute('width', 120); art.setAttribute('height', 120); inner.appendChild(art);
    SFX.pop(); await anim(inner, [{ transform: 'scale(.2)' }, { transform: 'scale(1.08)' }, { transform: 'scale(1)' }], { duration: 700, easing: 'cubic-bezier(.3,1.4,.6,1)' }).done; await S(line); } }
