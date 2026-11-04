export type Vec3 = [number, number, number];

export const V3 = {
  add: (a: Vec3, b: Vec3): Vec3 => [a[0] + b[0], a[1] + b[1], a[2] + b[2]],
  sub: (a: Vec3, b: Vec3): Vec3 => [a[0] - b[0], a[1] - b[1], a[2] - b[2]],
  mul: (a: Vec3, k: number): Vec3 => [a[0] * k, a[1] * k, a[2] * k],
  dot: (a: Vec3, b: Vec3): number => a[0] * b[0] + a[1] * b[1] + a[2] * b[2],
  cross: (a: Vec3, b: Vec3): Vec3 => [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0],
  ],
  len: (a: Vec3): number => Math.hypot(a[0], a[1], a[2]),
  norm: (a: Vec3): Vec3 => {
    const l = Math.hypot(a[0], a[1], a[2]) || 1;
    return [a[0] / l, a[1] / l, a[2] / l];
  },
  lerp: (a: Vec3, b: Vec3, t: number): Vec3 => [
    a[0] + (b[0] - a[0]) * t,
    a[1] + (b[1] - a[1]) * t,
    a[2] + (b[2] - a[2]) * t,
  ],
  mid: (a: Vec3, b: Vec3): Vec3 => [
    (a[0] + b[0]) / 2,
    (a[1] + b[1]) / 2,
    (a[2] + b[2]) / 2,
  ],
};

export const DEG = 180 / Math.PI;

export function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) {
    [a, b] = [b, a % b];
  }
  return a || 1;
}

export function angLines(u: Vec3, v: Vec3): number {
  const c = Math.abs(V3.dot(u, v)) / (V3.len(u) * V3.len(v));
  return Math.acos(Math.min(1, Math.max(0, c))) * DEG;
}

export function closestLines(p1: Vec3, d1: Vec3, p2: Vec3, d2: Vec3): [Vec3, Vec3] {
  const r = V3.sub(p1, p2);
  const a = V3.dot(d1, d1);
  const b = V3.dot(d1, d2);
  const c = V3.dot(d2, d2);
  const d = V3.dot(d1, r);
  const e = V3.dot(d2, r);
  const den = a * c - b * b;
  if (Math.abs(den) < 1e-12) {
    const s = e / c;
    return [p1, V3.add(p2, V3.mul(d2, s))];
  }
  const t = (b * e - c * d) / den;
  const s = (a * e - b * d) / den;
  return [V3.add(p1, V3.mul(d1, t)), V3.add(p2, V3.mul(d2, s))];
}

export function projPlane(p: Vec3, a: Vec3, n: Vec3): Vec3 {
  const dotNN = V3.dot(n, n) || 1;
  return V3.sub(p, V3.mul(n, V3.dot(V3.sub(p, a), n) / dotNN));
}

export function projLine(p: Vec3, a: Vec3, d: Vec3): Vec3 {
  const dotDD = V3.dot(d, d) || 1;
  return V3.add(a, V3.mul(d, V3.dot(V3.sub(p, a), d) / dotDD));
}

export function fmtN(v: number, k = 2): string {
  const r = Math.round(v * 10 ** k) / 10 ** k;
  return (Object.is(r, -0) ? 0 : r).toString();
}

/** exact form of v (≥0) as a·√b/c when v² is a simple fraction */
export function exactRoot(v: number): string | null {
  if (v < 1e-9) return '0';
  const v2 = v * v;
  for (let q = 1; q <= 36; q++) {
    const p = Math.round(v2 * q);
    if (p > 0 && Math.abs(v2 - p / q) < 1e-7) {
      let num = p * q;
      let out = 1;
      for (let f = 2; f * f <= num; f++) {
        while (num % (f * f) === 0) {
          num /= f * f;
          out *= f;
        }
      }
      const g = gcd(out, q);
      const o = out / g;
      const d = q / g;
      const top = num === 1 ? String(o) : o === 1 ? `\\sqrt{${num}}` : `${o}\\sqrt{${num}}`;
      return d === 1 ? top : `\\frac{${top}}{${d}}`;
    }
  }
  return null;
}

export const COL = {
  ink: '#18233a',
  ink2: '#4a566d',
  ink3: '#7b8699',
  grid: '#e8edf4',
  axis: '#9aa5b8',
  blue: '#2450b8',
  blueS: 'rgba(36,80,184,.14)',
  gold: '#f4b400',
  goldS: 'rgba(244,180,0,.30)',
  red: '#b4462c',
  teal: '#0f8a7a',
  tealS: 'rgba(15,138,122,.16)',
};

export const CUBE_F: number[][] = [
  [0, 3, 2, 1],
  [4, 5, 6, 7],
  [0, 1, 5, 4],
  [1, 2, 6, 5],
  [2, 3, 7, 6],
  [3, 0, 4, 7],
];

export function boxV(a: number, b: number, c: number): Vec3[] {
  return [
    [0, 0, 0],
    [a, 0, 0],
    [a, b, 0],
    [0, b, 0],
    [0, 0, c],
    [a, 0, c],
    [a, b, c],
    [0, b, c],
  ];
}

export const CUBE_L = ['A', 'B', 'C', 'D', 'A₁', 'B₁', 'C₁', 'D₁'];

export function axes(L = 3, ticks = true) {
  const it: any[] = [];
  const dirs: [number, number, number, string][] = [
    [1, 0, 0, 'x'],
    [0, 1, 0, 'y'],
    [0, 0, 1, 'z'],
  ];
  dirs.forEach(a => {
    const d: Vec3 = [a[0], a[1], a[2]];
    it.push({ t: 'seg', a: V3.mul(d, -L), b: V3.mul(d, L + 0.4), c: COL.axis, w: 1.3, arrow: true });
    it.push({ t: 'pt', p: V3.mul(d, L + 0.6), r: 0, label: a[3], lc: COL.ink2 });
    if (ticks) {
      for (let k = -L; k <= L; k++) {
        if (k) it.push({ t: 'txt', p: V3.mul(d, k), s: String(k), c: '#9aa5b8', f: '10px JetBrains Mono, monospace' });
      }
    }
  });
  it.push({ t: 'pt', p: [0, 0, 0], r: 2.5, c: COL.ink2, label: 'O', dx: -14, dy: 14 });
  return it;
}

export function boxPath(p: Vec3, c: string) {
  const it: any[] = [];
  const o: Vec3 = [p[0], 0, 0];
  const q: Vec3 = [p[0], p[1], 0];
  it.push(
    { t: 'seg', a: [0, 0, 0], b: o, c, w: 1, dash: true },
    { t: 'seg', a: o, b: q, c, w: 1, dash: true },
    { t: 'seg', a: q, b: p, c, w: 1, dash: true },
    { t: 'seg', a: [0, p[1], 0], b: q, c, w: 1, dash: true }
  );
  return it;
}

export function bboxOf(pts: Vec3[]) {
  if (!pts.length) return { c: [0, 0, 0] as Vec3, r: 3 };
  const lo = [0, 1, 2].map(k => Math.min(...pts.map(p => p[k])));
  const hi = [0, 1, 2].map(k => Math.max(...pts.map(p => p[k])));
  return {
    c: lo.map((v, k) => (v + hi[k]) / 2) as Vec3,
    r: Math.max(0.5, Math.hypot(hi[0] - lo[0], hi[1] - lo[1], hi[2] - lo[2]) / 2),
  };
}

export function setupCanvas(cv: HTMLCanvasElement, h: number) {
  const dpr = window.devicePixelRatio || 1;
  const w = cv.clientWidth || 500;
  cv.width = w * dpr;
  cv.height = h * dpr;
  cv.style.height = h + 'px';
  const c = cv.getContext('2d')!;
  c.setTransform(dpr, 0, 0, dpr, 0, 0);
  return { c, w, h };
}
