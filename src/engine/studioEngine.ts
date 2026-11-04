import { Vec3, V3, DEG, gcd, exactRoot, fmtN, angLines, closestLines, projPlane, projLine, boxV, CUBE_F } from './v3';

export { fmtN };

export const ST_COL = ['#b4462c', '#2450b8', '#0f8a7a', '#7a4fb5', '#c47f00', '#18233a', '#d14d8b', '#3b8f3b'];

export function hexA(h: string, a: number): string {
  if (h.startsWith('rgba') || h.startsWith('hsla')) return h;
  const n = parseInt(h.slice(1), 16);
  return `rgba(${n >> 16},${(n >> 8) & 255},${n & 255},${a})`;
}

export const RESERVED = new Set(['x', 'y', 'z']);

export interface Token {
  t: string;
  v?: any;
}

export function stTokens(src: string): Token[] {
  const out: Token[] = [];
  let i = 0;
  const s = src
    .replace(/[₀-₉]/g, d => String(d.charCodeAt(0) - 8320))
    .replace(/·|×/g, '*')
    .replace(/−/g, '-')
    .replace(/π/g, 'pi')
    .replace(/√/g, 'sqrt');

  while (i < s.length) {
    const ch = s[i];
    if (/\s/.test(ch)) {
      i++;
      continue;
    }
    if (/[0-9.]/.test(ch)) {
      let j = i;
      while (j < s.length && /[0-9.]/.test(s[j])) j++;
      out.push({ t: 'n', v: parseFloat(s.slice(i, j)) });
      i = j;
      continue;
    }
    if (/[A-Za-zα-ωΑ-Ω_]/.test(ch)) {
      let j = i;
      while (j < s.length && /[A-Za-z0-9α-ωΑ-Ω_']/.test(s[j])) j++;
      out.push({ t: 'id', v: s.slice(i, j) });
      i = j;
      continue;
    }
    if ('+-*/^(),='.includes(ch)) {
      out.push({ t: ch });
      i++;
      continue;
    }
    throw new Error(`I don't understand “${ch}”.`);
  }
  return out;
}

export const ST_FN = new Set([
  'sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'sqrt', 'abs', 'min', 'max',
  'segment', 'line', 'ray', 'vector', 'polygon', 'plane', 'sphere', 'circle',
  'box', 'cuboid', 'cube', 'tetra', 'pyramid', 'octahedron', 'mid', 'dist',
  'angle', 'len', 'dot', 'cross', 'det', 'proj', 'commonperp', 'area', 'volume',
  'curve', 'surface', 'guide', 'centroid', 'normal',
]);

export function stParse(tokens: Token[]): any {
  let p = 0;
  const peek = () => tokens[p];
  const eat = (t: string) => {
    const k = tokens[p];
    if (!k || k.t !== t) throw new Error(`Expected “${t}”.`);
    p++;
    return k;
  };

  function expr(): any {
    let n = term();
    while (peek() && (peek().t === '+' || peek().t === '-')) {
      const o = tokens[p++].t;
      n = { op: o, a: n, b: term() };
    }
    return n;
  }

  function startsFactor(k?: Token) {
    return k && (k.t === 'n' || k.t === 'id' || k.t === '(');
  }

  function term(): any {
    let n = unary();
    for (;;) {
      const k = peek();
      if (k && (k.t === '*' || k.t === '/')) {
        p++;
        n = { op: k.t, a: n, b: unary() };
      } else if (
        startsFactor(k) &&
        (n.num !== undefined ||
          n.op === 'call' ||
          n.paren ||
          n.id ||
          (n.op === 'neg' && (n.a.num !== undefined || n.a.op === '*'))) &&
        !(n.id && ST_FN.has(n.id))
      ) {
        n = { op: '*', a: n, b: power() };
      } else return n;
    }
  }

  function unary(): any {
    if (peek() && peek().t === '-') {
      p++;
      return { op: 'neg', a: unary() };
    }
    if (peek() && peek().t === '+') {
      p++;
      return unary();
    }
    return power();
  }

  function power(): any {
    const b = atom();
    if (peek() && peek().t === '^') {
      p++;
      return { op: '^', a: b, b: unary() };
    }
    return b;
  }

  function atom(): any {
    const k = tokens[p++];
    if (!k) throw new Error('The line ends too early.');
    if (k.t === 'n') return { num: k.v };
    if (k.t === 'id') {
      if (ST_FN.has(k.v) && peek() && peek().t === '(') {
        p++;
        const args = [];
        if (peek() && peek().t !== ')') {
          args.push(expr());
          while (peek() && peek().t === ',') {
            p++;
            args.push(expr());
          }
        }
        eat(')');
        return { op: 'call', f: k.v, args };
      }
      return { id: k.v };
    }
    if (k.t === '(') {
      const first = expr();
      if (peek() && peek().t === ',') {
        const el = [first];
        while (peek() && peek().t === ',') {
          p++;
          el.push(expr());
        }
        eat(')');
        if (el.length !== 3) throw new Error('A point needs three coordinates.');
        return { op: 'tuple', el };
      }
      eat(')');
      first.paren = true;
      return first;
    }
    throw new Error(`Unexpected “${k.t}”.`);
  }

  const r = expr();
  if (p < tokens.length) {
    throw new Error(`Unexpected “${tokens[p].t === 'id' || tokens[p].t === 'n' ? tokens[p].v : tokens[p].t}”.`);
  }
  return r;
}

export const isPt = (v: any) => v && (v.k === 'pt' || v.k === 'vec');

export function crd(v: any, what?: string): Vec3 {
  if (isPt(v)) return v.v;
  throw new Error(`${what || 'This'} must be a point or a vector.`);
}

export function num(v: any, what?: string): number {
  if (typeof v === 'number') return v;
  throw new Error(`${what || 'This'} must be a number.`);
}

export function lineOf(v: any): { p: Vec3; d: Vec3 } | null {
  if (v.k === 'line' || v.k === 'ray') return { p: v.a, d: v.d };
  if (v.k === 'seg') return { p: v.a, d: V3.sub(v.b, v.a) };
  if (v.k === 'vec') return { p: v.o || [0, 0, 0], d: v.v };
  return null;
}

export function orient(V: Vec3[], F: number[][]): number[][] {
  const c = V.reduce((s, p) => V3.add(s, V3.mul(p, 1 / V.length)), [0, 0, 0] as Vec3);
  return F.map(f => {
    const n = V3.cross(V3.sub(V[f[1]], V[f[0]]), V3.sub(V[f[2]], V[f[0]]));
    const fc = f.reduce((s, i) => V3.add(s, V3.mul(V[i], 1 / f.length)), [0, 0, 0] as Vec3);
    return V3.dot(n, V3.sub(fc, c)) < 0 ? f.slice().reverse() : f;
  });
}

export function solidMeasures(V: Vec3[], F: number[][]): { vol: number; area: number } {
  let vol = 0;
  let ar = 0;
  F.forEach(f => {
    for (let i = 1; i < f.length - 1; i++) {
      const a = V[f[0]];
      const b = V[f[i]];
      const c = V[f[i + 1]];
      vol += V3.dot(a, V3.cross(b, c)) / 6;
      ar += V3.len(V3.cross(V3.sub(b, a), V3.sub(c, a))) / 2;
    }
  });
  return { vol: Math.abs(vol), area: ar };
}

export function polyArea(P: Vec3[]): number {
  let s: Vec3 = [0, 0, 0];
  for (let i = 0; i < P.length; i++) {
    s = V3.add(s, V3.cross(P[i], P[(i + 1) % P.length]));
  }
  return V3.len(s) / 2;
}

export function stCall(f: string, A: any[], env: any): any {
  const n = A.length;
  const need = (k: number, msg: string) => {
    if (n < k) throw new Error(msg);
  };
  switch (f) {
    case 'sin':
    case 'cos':
    case 'tan':
    case 'asin':
    case 'acos':
    case 'atan':
    case 'sqrt':
    case 'abs': {
      need(1, `${f} needs one number.`);
      if (f === 'abs' && isPt(A[0])) return V3.len(A[0].v);
      const x = num(A[0]);
      if (f === 'sqrt' && x < 0) throw new Error('sqrt of a negative number.');
      return (Math as any)[f](x);
    }
    case 'min':
      return Math.min(...A.map(a => num(a)));
    case 'max':
      return Math.max(...A.map(a => num(a)));
    case 'segment':
      need(2, 'segment(A, B) needs two points.');
      return { k: 'seg', a: crd(A[0]), b: crd(A[1]) };
    case 'line': {
      need(2, 'line(A, B) needs two points.');
      const a = crd(A[0]);
      const b = crd(A[1]);
      if (A[1].k === 'vec' && A[0].k === 'pt') return { k: 'line', a, d: b };
      if (V3.len(V3.sub(b, a)) < 1e-12) throw new Error('The two points coincide.');
      return { k: 'line', a, d: V3.sub(b, a) };
    }
    case 'ray':
      need(2, 'ray(A, B) needs two points.');
      return { k: 'ray', a: crd(A[0]), d: V3.sub(crd(A[1]), crd(A[0])) };
    case 'vector':
      if (n === 3 && A.every(a => typeof a === 'number')) return { k: 'vec', v: A as Vec3, o: [0, 0, 0] as Vec3 };
      if (n === 1) return { k: 'vec', v: crd(A[0]), o: [0, 0, 0] as Vec3 };
      need(2, 'vector(A, B) or vector(x, y, z).');
      return { k: 'vec', v: V3.sub(crd(A[1]), crd(A[0])), o: crd(A[0]) };
    case 'polygon':
      need(3, 'polygon needs at least three points.');
      return { k: 'poly', pts: A.map(a => crd(a)) };
    case 'plane':
      if (n === 2) {
        const pt = crd(A[0]);
        const nn = crd(A[1]);
        return { k: 'plane', p: pt, n: nn };
      }
      need(3, 'plane(A, B, C) needs three points.');
      {
        const [a, b, c] = A.map(x => crd(x));
        const nn = V3.cross(V3.sub(b, a), V3.sub(c, a));
        if (V3.len(nn) < 1e-12) throw new Error('The three points are on one line.');
        return { k: 'plane', p: a, n: nn };
      }
    case 'normal':
      need(1, 'normal(plane)');
      if (A[0].k !== 'plane') throw new Error('normal() needs a plane.');
      return { k: 'vec', v: A[0].n, o: A[0].p };
    case 'sphere':
      need(2, 'sphere(centre, radius).');
      return { k: 'sphere', c: crd(A[0]), r: Math.abs(num(A[1], 'The radius')) };
    case 'circle':
      need(2, 'circle(centre, radius, normal).');
      return {
        k: 'circle',
        c: crd(A[0]),
        r: Math.abs(num(A[1])),
        n: n > 2 ? crd(A[2]) : ([0, 0, 1] as Vec3),
      };
    case 'box':
      need(3, 'box(a, b, c).');
      return stCall('cuboid', [{ k: 'pt', v: [0, 0, 0] }, { k: 'pt', v: [num(A[0]), num(A[1]), num(A[2])] }], env);
    case 'cube': {
      need(1, 'cube(a).');
      const a = num(A[0]);
      return stCall('cuboid', [{ k: 'pt', v: [0, 0, 0] }, { k: 'pt', v: [a, a, a] }], env);
    }
    case 'cuboid': {
      need(2, 'cuboid(P, Q) with opposite corners.');
      const [p, q] = [crd(A[0]), crd(A[1])];
      const V: Vec3[] = [
        [p[0], p[1], p[2]],
        [q[0], p[1], p[2]],
        [q[0], q[1], p[2]],
        [p[0], q[1], p[2]],
        [p[0], p[1], q[2]],
        [q[0], p[1], q[2]],
        [q[0], q[1], q[2]],
        [p[0], q[1], q[2]],
      ];
      return { k: 'solid', V, F: orient(V, CUBE_F), name: 'box' };
    }
    case 'tetra':
      need(4, 'tetra(A, B, C, D).');
      return stCall('pyramid', A, env);
    case 'pyramid': {
      need(4, 'pyramid(base points…, apex).');
      const P: Vec3[] = A.map(a => crd(a));
      const m = P.length - 1;
      const V = P;
      const F = [Array.from({ length: m }, (_, i) => i)];
      for (let i = 0; i < m; i++) F.push([i, (i + 1) % m, m]);
      return { k: 'solid', V, F: orient(V, F), name: 'pyramid' };
    }
    case 'octahedron': {
      const r = n ? num(A[0]) : 1;
      const V: Vec3[] = [
        [r, 0, 0],
        [-r, 0, 0],
        [0, r, 0],
        [0, -r, 0],
        [0, 0, r],
        [0, 0, -r],
      ];
      const F = [
        [0, 2, 4],
        [2, 1, 4],
        [1, 3, 4],
        [3, 0, 4],
        [2, 0, 5],
        [1, 2, 5],
        [3, 1, 5],
        [0, 3, 5],
      ];
      return { k: 'solid', V, F: orient(V, F), name: 'octahedron' };
    }
    case 'mid':
      need(2, 'mid(A, B).');
      return { k: 'pt', v: V3.mid(crd(A[0]), crd(A[1])) };
    case 'centroid':
      need(1, 'centroid(A, B, …).');
      return {
        k: 'pt',
        v: A.map(a => crd(a)).reduce((s, p) => V3.add(s, V3.mul(p, 1 / n)), [0, 0, 0]),
      };
    case 'len':
      need(1, 'len(v).');
      if (A[0].k === 'seg') return V3.len(V3.sub(A[0].b, A[0].a));
      return V3.len(crd(A[0]));
    case 'dot':
      need(2, 'dot(u, v).');
      return V3.dot(crd(A[0]), crd(A[1]));
    case 'cross':
      need(2, 'cross(u, v).');
      return { k: 'vec', v: V3.cross(crd(A[0]), crd(A[1])), o: [0, 0, 0] as Vec3 };
    case 'det':
      need(3, 'det(a, b, c).');
      return V3.dot(crd(A[0]), V3.cross(crd(A[1]), crd(A[2])));
    case 'area':
      need(1, 'area(polygon) or area(solid).');
      if (A[0].k === 'poly') return polyArea(A[0].pts);
      if (A[0].k === 'solid') return solidMeasures(A[0].V, A[0].F).area;
      if (A[0].k === 'sphere') return 4 * Math.PI * A[0].r ** 2;
      if (A[0].k === 'circle') return Math.PI * A[0].r ** 2;
      throw new Error('area() needs a polygon, solid, sphere or circle.');
    case 'volume':
      need(1, 'volume(solid).');
      if (A[0].k === 'solid') return solidMeasures(A[0].V, A[0].F).vol;
      if (A[0].k === 'sphere') return (4 / 3) * Math.PI * A[0].r ** 3;
      throw new Error('volume() needs a solid or a sphere.');
    case 'proj': {
      need(2, 'proj(P, plane or line).');
      const P = crd(A[0]);
      const o = A[1];
      if (o.k === 'plane') return { k: 'pt', v: projPlane(P, o.p, o.n) };
      const l = lineOf(o);
      if (l) return { k: 'pt', v: projLine(P, l.p, l.d) };
      throw new Error('proj needs a plane or a line.');
    }
    case 'commonperp': {
      need(2, 'commonperp(line1, line2).');
      const l1 = lineOf(A[0]);
      const l2 = lineOf(A[1]);
      if (!l1 || !l2) throw new Error('commonperp needs two lines.');
      const [q1, q2] = closestLines(l1.p, l1.d, l2.p, l2.d);
      return { k: 'seg', a: q1, b: q2, perp: true };
    }
    case 'dist': {
      need(2, 'dist(X, Y).');
      let [a, b] = A;
      const rank = (o: any) =>
        isPt(o) && o.k === 'pt' ? 0 : lineOf(o) ? 1 : o.k === 'plane' ? 2 : 3;
      if (rank(a) > rank(b)) [a, b] = [b, a];
      const ra = rank(a);
      const rb = rank(b);
      if (ra === 0 && rb === 0) return V3.len(V3.sub(a.v, b.v));
      if (ra === 0 && rb === 1) {
        const l = lineOf(b)!;
        return V3.len(V3.sub(a.v, projLine(a.v, l.p, l.d)));
      }
      if (ra === 0 && rb === 2) return V3.len(V3.sub(a.v, projPlane(a.v, b.p, b.n)));
      if (ra === 1 && rb === 1) {
        const l1 = lineOf(a)!;
        const l2 = lineOf(b)!;
        const [q1, q2] = closestLines(l1.p, l1.d, l2.p, l2.d);
        return V3.len(V3.sub(q1, q2));
      }
      if (ra === 1 && rb === 2) {
        const l = lineOf(a)!;
        if (Math.abs(V3.dot(l.d, b.n)) > 1e-9) return 0;
        return V3.len(V3.sub(l.p, projPlane(l.p, b.p, b.n)));
      }
      if (ra === 2 && rb === 2) {
        if (V3.len(V3.cross(a.n, b.n)) > 1e-9 * V3.len(a.n) * V3.len(b.n)) return 0;
        return V3.len(V3.sub(a.p, projPlane(a.p, b.p, b.n)));
      }
      throw new Error('dist works with points, lines and planes.');
    }
    case 'angle': {
      if (n === 3 && A.every(isPt)) {
        const [a, b, c] = A.map(x => x.v);
        const u = V3.sub(a, b);
        const w = V3.sub(c, b);
        return Math.acos(Math.max(-1, Math.min(1, V3.dot(u, w) / (V3.len(u) * V3.len(w))))) * DEG;
      }
      need(2, 'angle(A, B, C) or angle(X, Y).');
      const [a, b] = A;
      if (a.k === 'vec' && b.k === 'vec') {
        return Math.acos(Math.max(-1, Math.min(1, V3.dot(a.v, b.v) / (V3.len(a.v) * V3.len(b.v))))) * DEG;
      }
      const la = lineOf(a);
      const lb = lineOf(b);
      if (la && lb) return angLines(la.d, lb.d);
      if (la && b.k === 'plane') {
        return Math.asin(Math.min(1, Math.abs(V3.dot(la.d, b.n)) / (V3.len(la.d) * V3.len(b.n)))) * DEG;
      }
      if (lb && a.k === 'plane') {
        return Math.asin(Math.min(1, Math.abs(V3.dot(lb.d, a.n)) / (V3.len(lb.d) * V3.len(a.n)))) * DEG;
      }
      if (a.k === 'plane' && b.k === 'plane') return angLines(a.n, b.n);
      throw new Error('angle works with three points, two lines, a line and a plane, or two planes.');
    }
    case 'guide':
      need(1, 'guide(P).');
      return { k: 'guide', p: crd(A[0]) };
    case 'curve':
    case 'surface':
      throw new Error(`${f}() must be on its own line.`);
  }
  throw new Error(`Unknown function ${f}.`);
}

export function stEval(nd: any, env: any): any {
  if (nd.num !== undefined) return nd.num;
  if (nd.id !== undefined) {
    if (nd.id === 'pi') return Math.PI;
    if (nd.id === 'e') return Math.E;
    if (nd.id === 'deg') return Math.PI / 180;
    if (nd.id in env) {
      const v = env[nd.id];
      if (v instanceof Error) throw new Error(`${nd.id} has an error.`);
      return v;
    }
    if (RESERVED.has(nd.id)) throw new Error(`${nd.id} is only used in equations like 2x + y − z = 3.`);
    throw new Error(`“${nd.id}” is not defined yet. Add a line ${nd.id} = …`);
  }
  if (nd.op === 'tuple') {
    return { k: 'pt', v: nd.el.map((e: any) => num(stEval(e, env), 'A coordinate')) };
  }
  if (nd.op === 'call') {
    if (nd.f === 'curve') {
      if (nd.args.length < 4 || nd.args[1].id === undefined) {
        throw new Error('curve((x(t), y(t), z(t)), t, from, to).');
      }
      const tv = nd.args[1].id;
      const a = num(stEval(nd.args[2], env));
      const b = num(stEval(nd.args[3], env));
      const pts: Vec3[] = [];
      for (let i = 0; i <= 240; i++) {
        const t = a + ((b - a) * i) / 240;
        const v = stEval(nd.args[0], Object.assign(Object.create(env), { [tv]: t }));
        pts.push(crd(v, 'The curve'));
      }
      return { k: 'curve', pts };
    }
    if (nd.f === 'surface') {
      if (nd.args.length < 1) throw new Error('surface(f(x, y)).');
      return {
        k: 'surf',
        f: (x: number, y: number) => num(stEval(nd.args[0], Object.assign(Object.create(env), { x, y }))),
      };
    }
    return stCall(
      nd.f,
      nd.args.map((a: any) => stEval(a, env)),
      env
    );
  }
  if (nd.op === 'neg') {
    const a = stEval(nd.a, env);
    if (typeof a === 'number') return -a;
    return { k: a.k, v: V3.mul(crd(a), -1), o: a.o };
  }
  const a = stEval(nd.a, env);
  const b = stEval(nd.b, env);
  const T = (x: any, y: any) =>
    x.k === 'vec' && y.k === 'vec' ? 'vec' : x.k === 'pt' && y.k === 'pt' && nd.op === '-' ? 'vec' : 'pt';
  switch (nd.op) {
    case '+':
      if (typeof a === 'number' && typeof b === 'number') return a + b;
      if (isPt(a) && isPt(b)) return { k: T(a, b), v: V3.add(a.v, b.v) };
      throw new Error('You can add two numbers or two points/vectors.');
    case '-':
      if (typeof a === 'number' && typeof b === 'number') return a - b;
      if (isPt(a) && isPt(b)) return { k: T(a, b), v: V3.sub(a.v, b.v) };
      throw new Error('You can subtract two numbers or two points/vectors.');
    case '*':
      if (typeof a === 'number' && typeof b === 'number') return a * b;
      if (typeof a === 'number' && isPt(b)) return { k: b.k, v: V3.mul(b.v, a) };
      if (isPt(a) && typeof b === 'number') return { k: a.k, v: V3.mul(a.v, b) };
      throw new Error('Use dot(u, v) or cross(u, v) to multiply two vectors.');
    case '/':
      if (typeof b !== 'number') throw new Error('Divide by a number.');
      if (b === 0) throw new Error('Division by zero.');
      if (typeof a === 'number') return a / b;
      if (isPt(a)) return { k: a.k, v: V3.mul(a.v, 1 / b) };
      break;
    case '^':
      return Math.pow(num(a), num(b));
  }
  throw new Error('This expression cannot be computed.');
}

export const fmtV = (v: number[]) => `(${v.map(x => fmtN(x, 3)).join('; ')})`;

export function fmtNum(v: number): string {
  const e = exactRoot(Math.abs(v));
  return (
    (e && !/^\d+$/.test(e) && Math.abs(v) > 1e-9
      ? `${v < 0 ? '−' : ''}${e.replace(/\\sqrt\{(\d+)\}/g, '√$1').replace(/\\frac\{([^}]*)\}\{([^}]*)\}/, '$1/$2')} ≈ `
      : '') + fmtN(v, 4)
  );
}

export function fmtPlane(e: number[]): string {
  let k = e.slice();
  if (k.every(x => Math.abs(x - Math.round(x)) < 1e-9)) {
    const g = k.reduce((a, b) => gcd(Math.round(a), Math.round(b)), 0) || 1;
    k = k.map(x => Math.round(x) / g);
  }
  const first = k.slice(0, 3).find(x => Math.abs(x) > 1e-9);
  if (first && first < 0) k = k.map(x => -x);
  let out = '';
  ['x', 'y', 'z'].forEach((n, i) => {
    const c = k[i];
    if (Math.abs(c) < 1e-9) return;
    const a = Math.abs(c);
    const cs = Math.abs(a - 1) < 1e-9 ? '' : fmtN(a, 3);
    out += (out ? (c < 0 ? ' − ' : ' + ') : c < 0 ? '−' : '') + cs + n;
  });
  return out + ' = ' + fmtN(k[3], 3);
}

export function clipLine(p: Vec3, d: Vec3, L: number, ray = false): [Vec3, Vec3] | null {
  let t0 = ray ? 0 : -Infinity;
  let t1 = Infinity;
  for (let k = 0; k < 3; k++) {
    if (Math.abs(d[k]) < 1e-12) {
      if (Math.abs(p[k]) > L) return null;
      continue;
    }
    let a = (-L - p[k]) / d[k];
    let b = (L - p[k]) / d[k];
    if (a > b) [a, b] = [b, a];
    t0 = Math.max(t0, a);
    t1 = Math.min(t1, b);
  }
  if (t0 > t1) return null;
  return [V3.add(p, V3.mul(d, t0)), V3.add(p, V3.mul(d, t1))];
}

export function boxSection(a: Vec3, n: Vec3, L: number): Vec3[] | null {
  const V = boxV(2 * L, 2 * L, 2 * L).map(v => V3.sub(v, [L, L, L]));
  const E = [
    [0, 1], [1, 2], [2, 3], [3, 0],
    [4, 5], [5, 6], [6, 7], [7, 4],
    [0, 4], [1, 5], [2, 6], [3, 7],
  ];
  const pts: Vec3[] = [];
  const f = (q: Vec3) => V3.dot(V3.sub(q, a), n);
  E.forEach(([i, j]) => {
    const fi = f(V[i]);
    const fj = f(V[j]);
    if (Math.abs(fi) < 1e-9) pts.push(V[i]);
    if (Math.abs(fj) < 1e-9) pts.push(V[j]);
    if (fi * fj < 0) pts.push(V3.lerp(V[i], V[j], fi / (fi - fj)));
  });
  const u: Vec3[] = [];
  pts.forEach(p => {
    if (!u.some(q => V3.len(V3.sub(p, q)) < 1e-7)) u.push(p);
  });
  if (u.length < 3) return null;
  const c = u.reduce((s, p) => V3.add(s, V3.mul(p, 1 / u.length)), [0, 0, 0]);
  const e1 = V3.norm(V3.sub(u[0], c));
  const e2 = V3.cross(V3.norm(n), e1);
  return u.sort(
    (p, q) =>
      Math.atan2(V3.dot(V3.sub(p, c), e2), V3.dot(V3.sub(p, c), e1)) -
      Math.atan2(V3.dot(V3.sub(q, c), e2), V3.dot(V3.sub(q, c), e1))
  );
}

export const SCENES: Record<string, [string, string]> = {
  tp: [
    'Three perpendiculars',
    `h = 3
t = 0
P = (0, 0, h)
H = (0, 0, 0)
A = (3, 1, 0)
al = plane(H, (1, 0, 0), (0, 1, 0))
segment(P, H)
segment(P, A)
segment(H, A)
l = line(A, A + (-1, 3, 0)*cos(t*deg) + (3, 1, 0)*sin(t*deg))
angle(l, line(H, A))
angle(l, line(P, A))
angle(P, A, H)`,
  ],
  perp: [
    'Line perpendicular to a plane',
    `th = 25
al = plane((0, 0, 0), (1, 0, 0), (0, 1, 0))
a = line((0, 0, 0), (sin(th*deg), 0, cos(th*deg)))
b = line((0, 0, 0), (1, 0, 0))
c = line((0, 0, 0), (0.5, 0.87, 0))
angle(a, b)
angle(a, c)`,
  ],
  lineplane: [
    'Angle between line and plane',
    `a = 4
A = (0, 0, 0)
B = (a, 0, 0)
D = (0, a, 0)
B1 = (a, 0, a)
cube(a)
segment(B1, D)
segment(B, D)
angle(line(B1, D), plane(A, B, C))`,
  ],
  cubesec: [
    'Distance from a vertex to a section',
    `a = 4
A = (0, 0, 0)
B = (a, 0, 0)
D = (0, a, 0)
A1 = (0, 0, a)
cube(a)
p = plane(A1, B, D)
polygon(A1, B, D)
H = proj(A, p)
segment(A, H)
dist(A, p)
a*sqrt(3)/3`,
  ],
  skew: [
    'Skew lines and the common perpendicular',
    `a = 4
A = (0, 0, 0)
B = (a, 0, 0)
D = (0, a, 0)
A1 = (0, 0, a)
cube(a)
m = line(A, A1)
n = line(B, D)
commonperp(m, n)
dist(m, n)
angle(m, n)`,
  ],
  cubeang: [
    'Angle between face diagonals',
    `a = 4
A = (0, 0, 0)
B = (a, 0, 0)
B1 = (a, 0, a)
C1 = (a, a, a)
D1 = (0, a, a)
cube(a)
segment(A, B1)
segment(B, C1)
segment(A, D1)
polygon(A, B1, D1)
angle(line(A, B1), line(B, C1))`,
  ],
  dihedral: [
    'Dihedral angle',
    `t = 60
O = (0, 0, 0)
K = (0, 4*cos(t*deg), 4*sin(t*deg))
polygon((-4, 0, 0), (4, 0, 0), (4, 4, 0), (-4, 4, 0))
polygon((-4, 0, 0), (4, 0, 0), (4, 0, 0) + K, (-4, 0, 0) + K)
segment(O, (0, 3, 0))
segment(O, K*0.75)
angle((0, 3, 0), O, K)
M = (-2, 0, 0) + K*0.6
dist(M, plane(O, (1, 0, 0), (0, 1, 0)))`,
  ],
  perpplanes: [
    'Segment between perpendicular planes',
    `z = 0
y = 0
C = (0, 0, 0)
D = (4, 0, 0)
A = (0, 0, 3)
B = (4, 4, 0)
segment(A, C)
segment(B, D)
segment(C, D)
segment(A, B)
dist(A, B)
sqrt(3^2 + 4^2 + 4^2)`,
  ],
  fold: [
    'Folding a triangle along its altitude',
    `f = 90
D = (0, 0, 0)
C = (0, 2, 0)
B = (2, 0, 0)
A = (2*cos(f*deg), 0, 2*sin(f*deg))
polygon(D, B, C)
polygon(D, A, C)
segment(A, B)
angle(A, D, B)
angle(A, C, B)
dist(A, B)`,
  ],
  pyramid: [
    'Regular pyramid',
    `a = 4
h = 3
A = (-a/2, -a/2, 0)
B = (a/2, -a/2, 0)
C = (a/2, a/2, 0)
D = (-a/2, a/2, 0)
S = (0, 0, h)
O = (0, 0, 0)
pyramid(A, B, C, D, S)
segment(S, O)
M = mid(B, C)
segment(S, M)
segment(O, M)
angle(S, A, O)
angle(S, M, O)
volume(pyramid(A, B, C, D, S))`,
  ],
  sphere: [
    'Sphere cut by a plane',
    `r = 3
O = (0, 0, 0)
sphere(O, r)
d = 1.5
z = d
circle((0, 0, d), sqrt(r^2 - d^2), (0, 0, 1))
sqrt(r^2 - d^2)`,
  ],
  box: [
    'Rectangular parallelepiped',
    `a = 4
b = 3
c = 2
box(a, b, c)
A = (0, 0, 0)
C1 = (a, b, c)
segment(A, C1)
segment(A, (a, b, 0))
dist(A, C1)
angle(C1, A, (a, b, 0))
volume(box(a, b, c))`,
  ],
  projarea: [
    'Area of a projection',
    `f = 50
P1 = (-2, 0.5*cos(f*deg), 0.5*sin(f*deg))
P2 = (2, 0.5*cos(f*deg), 0.5*sin(f*deg))
P3 = (0, 3.5*cos(f*deg), 3.5*sin(f*deg))
T = polygon(P1, P2, P3)
Q = polygon((-2, 0.5*cos(f*deg), 0), (2, 0.5*cos(f*deg), 0), (0, 3.5*cos(f*deg), 0))
area(T)
area(Q)
area(Q)/area(T)
cos(f*deg)`,
  ],
  vectors: [
    'Adding vectors',
    `u = vector(2, 1, 0)
v = vector(0, 2, 2)
k = 1
vector(u + v)
vector(k*u)
polygon((0, 0, 0), u, u + v, v)
len(u + v)
dot(u, v)
angle(u, v)`,
  ],
  coords: [
    'Points, distance, midpoint',
    `A = (1, 2, 3)
B = (-1, 1, 1)
segment(A, B)
M = mid(A, B)
guide(A)
guide(B)
dist(A, B)
vector(A, B)`,
  ],
  ratio: [
    'Dividing a segment in a ratio',
    `A = (1, 1, -5)
B = (7, 4, 1)
l = 0.5
M = (A + l*B)/(1 + l)
segment(A, B)
dist(A, M)/dist(M, B)`,
  ],
  basis: [
    'Decomposing a vector in a basis',
    `a = vector(1, 1, 0)
b = vector(0, 1, 1)
c = vector(1, 0, 1)
p = 2.5
q = 0.5
s = 1.5
d = vector(p*a + q*b + s*c)
det(a, b, c)`,
  ],
  octa: [
    'Octahedron centred at the origin',
    `r = 2
octahedron(r)
X1 = (r, 0, 0)
Y1 = (0, r, 0)
Z1 = (0, 0, r)
volume(octahedron(r))
area(octahedron(r))`,
  ],
  plane: [
    'Plane from its equation',
    `k = 1
2x + y + k*z = 4
N = (0, 0, 0)
n = vector(2, 1, k)
P = (2, 2, 2)
dist(P, plane((2, 0, 0), (2, 1, k)))`,
  ],
  helix: [
    'Helix (spiral staircase)',
    `R = 2
n = 2
curve((R*cos(t), R*sin(t), t/3 - 2), t, 0, 2*pi*n)
P = (R, 0, -2)
P`,
  ],
  waves: ['Surface z = f(x, y)', `k = 1\nz = k*sin(x)*cos(y)`],
  saddle: ['Saddle surface', `z = (x^2 - y^2)/5`],
};
