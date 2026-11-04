import { Vec3, V3, COL, bboxOf, axes, boxPath, fmtN } from './v3';
import {
  stTokens,
  stParse,
  stEval,
  hexA,
  isPt,
  crd,
  num,
  ST_COL,
  RESERVED,
  ST_FN,
  clipLine,
  boxSection,
  fmtNum,
  fmtV,
  fmtPlane,
  polyArea,
  solidMeasures,
} from './studioEngine';

export const STYLE_WORDS = new Set([
  'find', 'given', 'aux', 'hide', 'dash', 'nolabel',
  'red', 'blue', 'teal', 'purple', 'gold', 'ink', 'bold', 'faint',
]);

export const NAMED_COL: Record<string, string> = {
  red: '#b4462c',
  blue: '#2450b8',
  teal: '#0f8a7a',
  purple: '#7a4fb5',
  gold: '#d18f00',
  ink: '#18233a',
};

export const FIND_COL = '#d18f00';
export const GIVEN_COL = '#2450b8';

export interface ParsedLine {
  text: string;
  step: number;
  style: Set<string>;
  label: string;
  raw: string;
}

export function parseLine(raw: string): ParsedLine {
  let s = String(raw);
  let step = 0;
  const m = s.match(/^\s*@(\d+)\s*/);
  if (m) {
    step = +m[1];
    s = s.slice(m[0].length);
  }
  const style = new Set<string>();
  let label = '';
  const ci = s.indexOf('//');
  if (ci >= 0) {
    const words = s.slice(ci + 2).trim().split(/\s+/).filter(Boolean);
    s = s.slice(0, ci);
    while (words.length && STYLE_WORDS.has(words[0])) {
      style.add(words.shift()!);
    }
    label = words.join(' ');
  }
  return { text: s.trim(), step, style, label, raw };
}

export function prettyName(n: string): string {
  const G: Record<string, string> = { al: 'α', be: 'β', ga: 'γ', ph: 'φ', th: 'θ' };
  if (G[n]) return G[n];
  return n.replace(/^([A-Za-z]+)(\d+)$/, (_, a, d) =>
    a + d.split('').map((c: string) => '₀₁₂₃₄₅₆₇₈₉'[+c]).join('')
  );
}

export function analyseStmt(text: string): any {
  const t = text.trim();
  if (!t) return { kind: 'empty' };
  const eq = t.indexOf('=');
  if (eq >= 0) {
    const lhs = t.slice(0, eq).trim();
    const rhs = t.slice(eq + 1).trim();
    if (
      /^[A-Za-zα-ωΑ-Ω_][A-Za-z0-9α-ωΑ-Ω_'₀-₉]*$/.test(lhs) &&
      !RESERVED.has(lhs) &&
      !ST_FN.has(lhs) &&
      !['pi', 'e', 'deg'].includes(lhs)
    ) {
      const ast = stParse(stTokens(rhs));
      const lit = ast.num !== undefined || (ast.op === 'neg' && ast.a.num !== undefined);
      return {
        kind: 'def',
        name: lhs.replace(/[₀-₉]/g, d => String(d.charCodeAt(0) - 8320)),
        ast,
        slider: lit,
      };
    }
    return { kind: 'eq', L: stParse(stTokens(lhs)), R: stParse(stTokens(rhs)), lhs };
  }
  return { kind: 'expr', ast: stParse(stTokens(t)) };
}

export function equationOf(a: any, env: any): any {
  const F = (x: number, y: number, z: number) => {
    const e = Object.assign(Object.create(env), { x, y, z });
    return num(stEval(a.L, e)) - num(stEval(a.R, e));
  };
  const d = F(0, 0, 0);
  const A = F(1, 0, 0) - d;
  const B = F(0, 1, 0) - d;
  const C = F(0, 0, 1) - d;
  const lin = [
    [0.7, -1.3, 2.1],
    [-2.2, 0.4, -0.9],
    [1.6, 2.5, -1.7],
  ].every(
    p => Math.abs(F(p[0], p[1], p[2]) - (A * p[0] + B * p[1] + C * p[2] + d)) < 1e-7 * (1 + Math.abs(d))
  );
  if (lin) {
    if (Math.hypot(A, B, C) < 1e-12) throw new Error('This is not an equation of a plane.');
    const n: Vec3 = [A, B, C];
    const k = -d / V3.dot(n, n);
    return { k: 'plane', p: V3.mul(n, k), n, eq: [A, B, C, -d] };
  }
  if (a.lhs.trim() === 'z') {
    return {
      k: 'surf',
      f: (x: number, y: number) => num(stEval(a.R, Object.assign(Object.create(env), { x, y }))),
    };
  }
  throw new Error('Only planes ax + by + cz = d and surfaces z = f(x, y) can be drawn.');
}

export function evalLines(P: ParsedLine[]) {
  const env: any = {};
  const res: any[] = P.map(() => null);
  const an = P.map(r => {
    try {
      return analyseStmt(r.text);
    } catch (e: any) {
      return { kind: 'err', err: e.message };
    }
  });

  let progress = true;
  let pass = 0;
  while (progress && pass++ <= P.length) {
    progress = false;
    an.forEach((a, i) => {
      if (res[i] !== null && !(res[i] instanceof Error)) return;
      try {
        let v;
        if (a.kind === 'def') {
          v = stEval(a.ast, env);
          env[a.name] = v;
        } else if (a.kind === 'expr') {
          v = stEval(a.ast, env);
        } else if (a.kind === 'eq') {
          v = equationOf(a, env);
        } else if (a.kind === 'err') {
          throw new Error(a.err);
        } else return;
        res[i] = v;
        progress = true;
      } catch (e) {
        res[i] = e;
      }
    });
  }
  return { res, an, env };
}

export function angleArgs(a: any, env: any): [Vec3, Vec3, Vec3] | null {
  if (!a || !a.ast || a.ast.op !== 'call' || a.ast.f !== 'angle' || a.ast.args.length !== 3) return null;
  try {
    const P = a.ast.args.map((x: any) => stEval(x, env));
    return P.every(isPt) ? (P.map((p: any) => p.v) as [Vec3, Vec3, Vec3]) : null;
  } catch {
    return null;
  }
}

export function valText(v: any, a: any, env: any): string {
  if (typeof v === 'number') {
    return angleArgs(a, env) || (a.ast && a.ast.op === 'call' && a.ast.f === 'angle')
      ? fmtN(v, 2) + '°'
      : fmtNum(v);
  }
  if (!v) return '';
  if (v.k === 'pt') return fmtV(v.v);
  if (v.k === 'vec') return `${fmtV(v.v)}, |v| = ${fmtNum(V3.len(v.v))}`;
  if (v.k === 'seg') return fmtNum(V3.len(V3.sub(v.b, v.a)));
  if (v.k === 'poly') return 'S = ' + fmtNum(polyArea(v.pts));
  if (v.k === 'solid') {
    const m = solidMeasures(v.V, v.F);
    return `V = ${fmtNum(m.vol)}`;
  }
  if (v.k === 'plane') return fmtPlane(v.eq || [...v.n, V3.dot(v.n, v.p)]);
  return '';
}

export function niceText(t: string): string {
  const pn = (x: string) => prettyName(x.trim());
  return t
    .replace(/vector\(\s*(\w+)\s*,\s*(\w+)\s*\)/g, (_, a, b) => `<span class="ov">${pn(a)}${pn(b)}</span>`)
    .replace(/segment\(\s*(\w+)\s*,\s*(\w+)\s*\)/g, (_, a, b) => pn(a) + pn(b))
    .replace(/angle\(\s*(\w+)\s*,\s*(\w+)\s*,\s*(\w+)\s*\)/g, (_, a, b, c) => '∠' + pn(a) + pn(b) + pn(c))
    .replace(/polygon\(([\w\s,]+)\)/g, (_, l) => {
      const p = l.split(',').map(pn);
      return (p.length === 3 ? '△' : '') + p.join('');
    });
}

export function legendText(r: ParsedLine, name?: string): string {
  const base = name ? prettyName(name) : niceText(r.text);
  const lab = r.label;
  if (!lab) return base;
  if (/^[\d√.,\s°]+$/.test(lab) && !/[(]/.test(base)) return `${base} = ${lab}`;
  return lab;
}

export function sceneItems(P: ParsedLine[], ev: any, o: any = {}) {
  const items: any[] = [];
  const legend: any[] = [];
  const pts: Vec3[] = [];
  const step = o.step ?? Infinity;
  const L = o.L || 6;
  const add = (p: any) => {
    if (p && p.every((x: any) => isFinite(x))) pts.push(p);
  };

  ev.res.forEach((v: any, i: number) => {
    const r = P[i];
    const a = ev.an[i];
    if (!r || r.step > step || v === null || v instanceof Error || r.style.has('hide')) return;
    const st = r.style;
    const find = st.has('find');
    const given = st.has('given');
    const aux = st.has('aux');

    let col = find
      ? FIND_COL
      : given
      ? GIVEN_COL
      : aux
      ? COL.ink3
      : o.rainbow
      ? (o.colors && o.colors[i]) || ST_COL[i % ST_COL.length]
      : COL.ink;

    st.forEach(w => {
      if (NAMED_COL[w]) col = NAMED_COL[w];
    });
    if (st.has('faint')) col = '#8a94a8';
    if (o.colors && o.colors[i] && o.rainbow) col = o.colors[i];

    const w = find ? 3.6 : given ? 2.9 : aux ? 1.5 : st.has('bold') ? 2.9 : st.has('faint') ? 1.4 : 2.2;
    const dash = st.has('dash') || (aux && v.k !== 'poly');
    const name = a.kind === 'def' ? a.name : '';
    const vt = (valText(v, a, ev.env) || '').replace(/^[SV] = /, '');

    let label = r.label || (find ? '?' : '');
    if (find && o.reveal && vt) {
      label = label.includes('?') ? label.replace('?', vt) : label ? label + ' = ' + vt : vt;
    }
    if (find || given || (r.label && typeof v === 'number')) {
      legend.push({
        kind: find ? 'find' : given ? 'given' : 'note',
        text: legendText(r, name),
        val: find ? vt : '',
        rowLabel: label,
      });
    }

    if (typeof v === 'number') {
      const ap = angleArgs(a, ev.env);
      if (ap) {
        const r1 = Math.min(V3.len(V3.sub(ap[0], ap[1])), V3.len(V3.sub(ap[2], ap[1])));
        items.push({
          t: 'angle',
          o: ap[1],
          a: ap[0],
          b: ap[2],
          r: Math.max(0.18, Math.min(0.9, r1 * 0.28)) * (o.unit || 1),
          c: find ? FIND_COL : given ? GIVEN_COL : COL.red,
          label: st.has('nolabel') ? '' : label,
          arc: Math.abs(v - 90) > 0.01 || (!!label && !st.has('nolabel') && false),
        });
        ap.forEach(add);
      }
      return;
    }

    switch (v.k) {
      case 'pt':
        items.push({
          t: 'pt',
          p: v.v,
          c: find || given ? col : COL.ink,
          r: find ? 6 : 4.2,
          label: st.has('nolabel')
            ? ''
            : (name ? prettyName(name) : '') + (label ? (name ? ' ' : '') + label : ''),
          lc: find || given ? col : COL.ink,
        });
        add(v.v);
        break;
      case 'vec': {
        const o0 = v.o || [0, 0, 0];
        const e = V3.add(o0, v.v);
        items.push({
          t: 'seg',
          a: o0,
          b: e,
          c: col,
          w: w + 0.2,
          arrow: true,
          dash: st.has('dash'),
        });
        if (name || label) {
          items.push({
            t: 'pt',
            p: V3.lerp(o0, e, 0.6),
            r: 0,
            label: (name ? prettyName(name) : '') + (label ? ' ' + label : ''),
            lc: col,
          });
        }
        add(o0);
        add(e);
        break;
      }
      case 'seg':
        items.push({
          t: 'seg',
          a: v.a,
          b: v.b,
          c: v.perp ? FIND_COL : col,
          w: v.perp ? 3.4 : w,
          dash,
          label: st.has('nolabel') ? '' : label,
        });
        add(v.a);
        add(v.b);
        break;
      case 'line':
      case 'ray': {
        const q = clipLine(v.a, v.d, L, v.k === 'ray');
        if (q) {
          items.push({ t: 'seg', a: q[0], b: q[1], c: col, w, dash });
          if (name || label) {
            items.push({
              t: 'pt',
              p: V3.lerp(q[0], q[1], 0.92),
              r: 0,
              label: (name ? prettyName(name) : '') + (label ? ' ' + label : ''),
              lc: col,
            });
          }
        }
        break;
      }
      case 'plane': {
        const B = boxSection(v.p, v.n, L);
        if (B) {
          items.push({
            t: 'poly',
            p: B,
            fill: hexA(
              find ? FIND_COL : given ? GIVEN_COL : col === COL.ink ? '#2450b8' : col,
              find ? 0.16 : 0.1
            ),
            stroke: hexA(col, 0.4),
          });
          if (label) items.push({ t: 'pt', p: B[0], r: 0, label, lc: col });
        }
        break;
      }
      case 'poly': {
        const base = find
          ? FIND_COL
          : given
          ? GIVEN_COL
          : aux
          ? '#2450b8'
          : col === COL.ink
          ? '#2450b8'
          : col;
        items.push({
          t: 'poly',
          p: v.pts,
          fill: hexA(base, find ? 0.28 : aux ? 0.07 : given ? 0.16 : 0.12),
          stroke: aux ? hexA('#2450b8', 0.35) : null,
        });
        if (!aux) {
          v.pts.forEach((p: Vec3, j: number) =>
            items.push({
              t: 'seg',
              a: p,
              b: v.pts[(j + 1) % v.pts.length],
              c: col,
              w: Math.min(w, 2.4),
              dash: st.has('dash'),
            })
          );
        }
        if (label) {
          const c0 = v.pts.reduce((s: Vec3, p: Vec3) => V3.add(s, V3.mul(p, 1 / v.pts.length)), [0, 0, 0]);
          items.push({
            t: 'pt',
            p: aux ? V3.lerp(v.pts[0], c0, 0.18) : c0,
            r: 0,
            label,
            lc: aux ? '#2450b8' : col,
            dx: -8,
            dy: find ? 22 : given ? -10 : 4,
          });
        }
        v.pts.forEach(add);
        break;
      }
      case 'solid':
        items.push({
          t: 'solid',
          V: v.V,
          F: v.F,
          c: col,
          w: Math.min(w, 2),
          fill: hexA(find ? FIND_COL : '#2450b8', find ? 0.14 : 0.05),
        });
        v.V.forEach(add);
        break;
      case 'sphere':
        items.push({
          t: 'sph',
          c: v.c,
          r: v.r,
          fill: hexA(col === COL.ink ? '#2450b8' : col, 0.3),
          stroke: col,
        });
        add(V3.add(v.c, [v.r, v.r, v.r]));
        add(V3.sub(v.c, [v.r, v.r, v.r]));
        break;
      case 'circle': {
        const n = V3.norm(v.n);
        const e1 = V3.norm(
          Math.abs(n[0]) < 0.9 ? V3.cross(n, [1, 0, 0]) : V3.cross(n, [0, 1, 0])
        );
        const e2 = V3.cross(n, e1);
        const cp: Vec3[] = Array.from({ length: 97 }, (_, j) => {
          const t = (j / 96) * 2 * Math.PI;
          return V3.add(v.c, V3.add(V3.mul(e1, v.r * Math.cos(t)), V3.mul(e2, v.r * Math.sin(t))));
        });
        items.push(
          { t: 'poly', p: cp.slice(0, 96), fill: hexA(col === COL.ink ? '#2450b8' : col, 0.12) },
          { t: 'path', pts: cp, c: col, w: Math.min(w, 2.4) }
        );
        cp.forEach(add);
        break;
      }
      case 'curve':
        items.push({
          t: 'path',
          pts: v.pts.filter((p: Vec3) => p.every(isFinite)),
          c: col,
          w: w + 0.4,
        });
        v.pts.forEach(add);
        break;
      case 'guide':
        items.push(
          ...boxPath(v.p, col === COL.ink ? COL.ink3 : col),
          { t: 'pt', p: [v.p[0], v.p[1], 0], r: 2.5, c: COL.ink3 }
        );
        add(v.p);
        add([0, 0, 0]);
        break;
      case 'surf': {
        const N = 24;
        const h = (2 * L) / N;
        const Z: number[][] = [];
        for (let a1 = 0; a1 <= N; a1++) {
          Z.push([]);
          for (let b1 = 0; b1 <= N; b1++) {
            let z;
            try {
              z = v.f(-L + a1 * h, -L + b1 * h);
            } catch {
              z = NaN;
            }
            Z[a1].push(z);
          }
        }
        for (let a1 = 0; a1 < N; a1++) {
          for (let b1 = 0; b1 < N; b1++) {
            const zs = [Z[a1][b1], Z[a1 + 1][b1], Z[a1 + 1][b1 + 1], Z[a1][b1 + 1]];
            if (zs.some(z => !isFinite(z) || Math.abs(z) > L)) continue;
            const x0 = -L + a1 * h;
            const y0 = -L + b1 * h;
            const m = (zs[0] + zs[1] + zs[2] + zs[3]) / 4;
            const tt = Math.max(0, Math.min(1, (m + L) / (2 * L)));
            items.push({
              t: 'poly',
              p: [
                [x0, y0, zs[0]],
                [x0 + h, y0, zs[1]],
                [x0 + h, y0 + h, zs[2]],
                [x0, y0 + h, zs[3]],
              ],
              fill: `hsla(${Math.round(220 - 200 * tt)},70%,${48 + 10 * tt}%,.55)`,
              stroke: 'rgba(255,255,255,.35)',
            });
          }
        }
        add([L, L, L]);
        add([-L, -L, -L]);
        break;
      }
    }
  });

  return { items, legend, pts };
}

/** evaluate a student's typed answer: numbers, fractions, sqrt, pi, degrees sign */
export function evalAnswer(t: string | number): number | null {
  const s = String(t)
    .trim()
    .replace(/°/g, '')
    .replace(/,/g, '.')
    .replace(/√\s*\(/g, 'sqrt(')
    .replace(/√\s*([0-9.]+)/g, 'sqrt($1)');
  if (!s) return null;
  try {
    const v = stEval(stParse(stTokens(s)), {});
    return typeof v === 'number' && isFinite(v) ? v : null;
  } catch {
    return null;
  }
}
