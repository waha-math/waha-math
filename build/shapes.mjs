// تشابه الأشكال في مكتبة POLYS (للفحص D240): الشكل الذي يطابق آخر بعد الدوران والقلب والتكبير مسألةٌ واحدة مع الآخر،
// ولو اختلف مفتاحاه. البصمة: الأضلاع نسبةً إلى المحيط والزوايا، تُقرأ من كل رأس وفي الاتجاهين.
// ويُجمع الشكلان إذا تقاربت زواياهما (6 درجات) وأضلاعهما (8%) وكان صنفهما واحداً (تساوي الأضلاع والقوائم والتوازي)،
// فمثلث قائم مختلف الأضلاع قريب من القائم المتطابق الضلعين ليس مسألته: جوابه بالقياس آخر.
import fs from 'fs';
export function loadPolys(file) {
  const L = fs.readFileSync(file, 'utf8').split('\n');
  const a = L.findIndex(l => l.startsWith('const polyReg')), b0 = L.findIndex(l => l.startsWith('const POLYS'));
  let b = b0; while (!L[b].startsWith('};')) b++;
  const asg = []; for (let i = b + 1; i < L.length; i++) if (L[i].startsWith('Object.assign(POLYS')) { let j = i; while (true) { asg.push(L[j]); if (/\}\);\s*$/.test(L[j])) break; j++; } i = j; }
  return Function([L[a], ...L.slice(b0, b + 1), ...asg, 'return POLYS;'].join('\n'))();
}
export function sig(P) {
  const n = P.length, len = [], ang = [];
  for (let i = 0; i < n; i++) { const p = P[i], q = P[(i + 1) % n], o = P[(i - 1 + n) % n];
    len.push(Math.hypot(q[0] - p[0], q[1] - p[1]));
    const a1 = Math.atan2(o[1] - p[1], o[0] - p[0]), a2 = Math.atan2(q[1] - p[1], q[0] - p[0]); let d = Math.abs(a1 - a2) * 180 / Math.PI; if (d > 180) d = 360 - d; ang.push(d); }
  const per = len.reduce((s, x) => s + x, 0); return { n, len: len.map(x => x / per), ang };
}
export function dev(A, B) {
  if (A.n !== B.n) return null; const n = A.n; let best = null;
  for (const dir of [1, -1]) for (let s = 0; s < n; s++) { let da = 0, dl = 0;
    for (let i = 0; i < n; i++) { const j = dir > 0 ? (s + i) % n : (s - i + 2 * n) % n, jl = dir > 0 ? j : (j - 1 + n) % n;
      da = Math.max(da, Math.abs(A.ang[i] - B.ang[j])); dl = Math.max(dl, Math.abs(A.len[i] - B.len[jl]) / Math.max(A.len[i], B.len[jl])); }
    if (!best || da + 100 * dl < best[0] + 100 * best[1]) best = [da, dl]; }
  return best;
}
export function kind(P) {
  const S = sig(P), n = S.n, eqL = S.len.map(x => S.len.filter(y => Math.abs(x - y) / Math.max(x, y) < 0.015).length).sort().join(''),
    right = S.ang.filter(a => Math.abs(a - 90) < 1).length, obt = S.ang.filter(a => a > 91).length;
  let par = 0; if (n === 4) for (const [i, j] of [[0, 2], [1, 3]]) { const u = [P[i + 1][0] - P[i][0], P[i + 1][1] - P[i][1]], w = [P[(j + 1) % 4][0] - P[j][0], P[(j + 1) % 4][1] - P[j][1]];
    if (Math.abs(u[0] * w[1] - u[1] * w[0]) / (Math.hypot(...u) * Math.hypot(...w)) < 0.02) par++; }
  return `${n}|${eqL}|${right}|${obt}|${par}`;
}
export const similar = (A, B, ta = 6, tl = 0.08) => { const d = dev(A, B); return !!d && d[0] <= ta && d[1] <= tl; };
/* خريطة المفتاح إلى ممثّل مجموعته (أول المفاتيح بترتيب المكتبة) */
export function canonMap(POLYS) {
  const K = Object.keys(POLYS).filter(k => POLYS[k].p), S = {}, C = {};   /* والمفتوح والمنحني بهيئة رؤوسه ونوع عيبه */
  for (const k of K) S[k] = { s: sig(POLYS[k].p), c: (POLYS[k].open ? 'open|' : POLYS[k].curve ? 'curve|' : '') + kind(POLYS[k].p) };
  for (const k of K) { C[k] = k; for (const r of K) { if (r === k) break; if (C[r] === r && S[r].c === S[k].c && similar(S[r].s, S[k].s)) { C[k] = r; break; } } }
  return C;
}
