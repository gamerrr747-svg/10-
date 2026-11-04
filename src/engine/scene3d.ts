import { Vec3, V3, COL, setupCanvas } from './v3';

export interface Scene3DOptions {
  yaw?: number;
  pitch?: number;
  zoom?: number;
  center?: Vec3;
  scale?: number;
  h?: number;
}

export class Scene3D {
  cv: HTMLCanvasElement;
  yaw: number;
  pitch: number;
  zoom: number;
  center: Vec3;
  scale: number;
  h: number;
  items: any[] = [];
  y0: number;
  p0: number;
  W = 500;
  H = 380;
  S = 100;
  private drag: [number, number] | null = null;
  private pointerDownHandler: (e: PointerEvent) => void;
  private pointerMoveHandler: (e: PointerEvent) => void;
  private pointerUpHandler: (e: PointerEvent) => void;
  private wheelHandler: (e: WheelEvent) => void;

  constructor(cv: HTMLCanvasElement, o: Scene3DOptions = {}) {
    this.cv = cv;
    this.yaw = o.yaw ?? -0.85;
    this.pitch = o.pitch ?? 0.42;
    this.zoom = o.zoom ?? 1;
    this.center = o.center ? [...o.center] : [0, 0, 0];
    this.scale = o.scale ?? 0.32;
    this.h = o.h ?? 380;
    this.y0 = this.yaw;
    this.p0 = this.pitch;

    cv.style.touchAction = 'none';
    cv.style.cursor = 'grab';

    this.pointerDownHandler = (e: PointerEvent) => {
      this.drag = [e.clientX, e.clientY];
      try {
        cv.setPointerCapture(e.pointerId);
      } catch {}
      cv.style.cursor = 'grabbing';
    };

    this.pointerMoveHandler = (e: PointerEvent) => {
      if (!this.drag) return;
      this.yaw -= (e.clientX - this.drag[0]) * 0.008;
      this.pitch = Math.max(-1.45, Math.min(1.45, this.pitch + (e.clientY - this.drag[1]) * 0.008));
      this.drag = [e.clientX, e.clientY];
      this.render();
    };

    this.pointerUpHandler = () => {
      this.drag = null;
      cv.style.cursor = 'grab';
    };

    this.wheelHandler = (e: WheelEvent) => {
      e.preventDefault();
      this.zoom = Math.max(0.4, Math.min(3, this.zoom * (e.deltaY < 0 ? 1.1 : 0.9)));
      this.render();
    };

    cv.addEventListener('pointerdown', this.pointerDownHandler);
    cv.addEventListener('pointermove', this.pointerMoveHandler);
    cv.addEventListener('pointerup', this.pointerUpHandler);
    cv.addEventListener('pointercancel', this.pointerUpHandler);
    cv.addEventListener('wheel', this.wheelHandler, { passive: false });
  }

  destroy() {
    this.cv.removeEventListener('pointerdown', this.pointerDownHandler);
    this.cv.removeEventListener('pointermove', this.pointerMoveHandler);
    this.cv.removeEventListener('pointerup', this.pointerUpHandler);
    this.cv.removeEventListener('pointercancel', this.pointerUpHandler);
    this.cv.removeEventListener('wheel', this.wheelHandler);
  }

  reset() {
    this.yaw = this.y0;
    this.pitch = this.p0;
    this.zoom = 1;
    this.render();
  }

  rot(q: Vec3): Vec3 {
    const cy = Math.cos(this.yaw);
    const sy = Math.sin(this.yaw);
    const cp = Math.cos(this.pitch);
    const sp = Math.sin(this.pitch);
    const x1 = q[0] * cy - q[1] * sy;
    const y1 = q[0] * sy + q[1] * cy;
    const z1 = q[2];
    return [x1, y1 * sp + z1 * cp, y1 * cp - z1 * sp];
  }

  P(p: Vec3): [number, number, number] {
    const r = this.rot(V3.sub(p, this.center));
    const S = this.S;
    return [this.W / 2 + r[0] * S, this.H / 2 - r[1] * S, r[2]];
  }

  render(items?: any[]) {
    if (items) this.items = items;
    if (!this.cv) return;
    const { c, w, h } = setupCanvas(this.cv, this.h);
    this.W = w;
    this.H = h;
    this.S = this.scale * this.zoom * Math.min(w, h);
    c.clearRect(0, 0, w, h);
    c.lineCap = 'round';
    c.lineJoin = 'round';

    const polys: { d: number; it: any }[] = [];
    const lines: any[] = [];
    const tops: any[] = [];
    const facing = (n: Vec3) => this.rot(n)[2] < 0;

    for (const it of this.items) {
      if (it.t === 'poly') {
        const d = it.p.reduce((s: number, p: Vec3) => s + this.P(p)[2], 0) / it.p.length;
        polys.push({ d, it });
      } else if (it.t === 'solid') {
        const vis = new Map<string, boolean>();
        it.F.forEach((f: number[]) => {
          const n = V3.cross(V3.sub(it.V[f[1]], it.V[f[0]]), V3.sub(it.V[f[2]], it.V[f[0]]));
          const fr = facing(n);
          if (it.fill) {
            polys.push({
              d: f.reduce((s: number, i: number) => s + this.P(it.V[i])[2], 0) / f.length,
              it: {
                p: f.map((i: number) => it.V[i]),
                fill: fr ? it.fill : it.fillBack || 'rgba(0,0,0,0)',
              },
            });
          }
          for (let k = 0; k < f.length; k++) {
            const a = f[k];
            const b = f[(k + 1) % f.length];
            const key = a < b ? a + '-' + b : b + '-' + a;
            vis.set(key, (vis.get(key) || false) || fr);
          }
        });
        vis.forEach((v, key) => {
          const [a, b] = key.split('-').map(Number);
          lines.push({ a: it.V[a], b: it.V[b], c: it.c || COL.ink, w: it.w || 1.6, dash: !v });
        });
        if (it.labels) {
          it.labels.forEach((l: string, i: number) => {
            if (l) tops.push({ t: 'pt', p: it.V[i], label: l, r: 0, c: COL.ink });
          });
        }
      } else if (it.t === 'seg' || it.t === 'path') {
        lines.push(it);
      } else if (it.t === 'sph') {
        polys.push({ d: this.P(it.c)[2] + 1e-6, it });
      } else {
        tops.push(it);
      }
    }

    polys.sort((x, y) => y.d - x.d);

    for (const { it } of polys) {
      if (it.t === 'sph') {
        const q = this.P(it.c);
        const R = it.r * this.S;
        const g = c.createRadialGradient(
          q[0] - R * 0.35,
          q[1] - R * 0.35,
          R * 0.1,
          q[0],
          q[1],
          R
        );
        g.addColorStop(0, 'rgba(255,255,255,.55)');
        g.addColorStop(1, it.fill || 'rgba(36,80,184,.28)');
        c.fillStyle = g;
        c.beginPath();
        c.arc(q[0], q[1], R, 0, 7);
        c.fill();
        c.strokeStyle = it.stroke || COL.blue;
        c.lineWidth = 1.2;
        c.stroke();
        continue;
      }
      c.beginPath();
      it.p.forEach((p: Vec3, i: number) => {
        const q = this.P(p);
        i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1]);
      });
      c.closePath();
      c.fillStyle = it.fill || 'rgba(36,80,184,.08)';
      c.fill();
      if (it.stroke) {
        c.strokeStyle = it.stroke;
        c.lineWidth = 1;
        c.stroke();
      }
    }

    for (const l of lines) {
      if (l.t === 'path') {
        c.strokeStyle = l.c || COL.ink;
        c.lineWidth = l.w || 2;
        c.setLineDash(l.dash ? [5, 4] : []);
        c.beginPath();
        l.pts.forEach((p: Vec3, i: number) => {
          const q = this.P(p);
          i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1]);
        });
        c.stroke();
        c.setLineDash([]);
        continue;
      }
      const a = this.P(l.a);
      const b = this.P(l.b);
      c.strokeStyle = l.c || COL.ink;
      c.lineWidth = l.w || 2;
      c.setLineDash(l.dash ? [5, 4] : []);
      c.beginPath();
      c.moveTo(a[0], a[1]);
      c.lineTo(b[0], b[1]);
      c.stroke();
      c.setLineDash([]);
      if (l.arrow) {
        const ang = Math.atan2(b[1] - a[1], b[0] - a[0]);
        const s = 10;
        c.fillStyle = l.c || COL.ink;
        c.beginPath();
        c.moveTo(b[0], b[1]);
        c.lineTo(b[0] - s * Math.cos(ang - 0.4), b[1] - s * Math.sin(ang - 0.4));
        c.lineTo(b[0] - s * Math.cos(ang + 0.4), b[1] - s * Math.sin(ang + 0.4));
        c.closePath();
        c.fill();
      }
      if (l.label) {
        const m = [(a[0] + b[0]) / 2, (a[1] + b[1]) / 2];
        c.font = '600 13px Source Sans 3, sans-serif';
        c.fillStyle = l.c || COL.ink;
        c.fillText(l.label, m[0] + 6, m[1] - 6);
      }
    }

    for (const it of tops) {
      if (it.t === 'angle') {
        const u = V3.norm(V3.sub(it.a, it.o));
        const w2 = V3.norm(V3.sub(it.b, it.o));
        const th = Math.acos(Math.max(-1, Math.min(1, V3.dot(u, w2))));
        const r = it.r || 0.35;
        c.strokeStyle = it.c || COL.red;
        c.lineWidth = 1.6;
        c.beginPath();
        if (Math.abs(th - Math.PI / 2) < 0.004 && !it.arc) {
          const p1 = V3.add(it.o, V3.mul(u, r * 0.7));
          const p2 = V3.add(p1, V3.mul(w2, r * 0.7));
          const p3 = V3.add(it.o, V3.mul(w2, r * 0.7));
          [p1, p2, p3].forEach((p, i) => {
            const q = this.P(p);
            i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1]);
          });
        } else {
          const vp = V3.norm(V3.sub(w2, V3.mul(u, V3.dot(u, w2))));
          for (let i = 0; i <= 24; i++) {
            const t = (th * i) / 24;
            const p = V3.add(
              it.o,
              V3.add(V3.mul(u, r * Math.cos(t)), V3.mul(vp, r * Math.sin(t)))
            );
            const q = this.P(p);
            i ? c.lineTo(q[0], q[1]) : c.moveTo(q[0], q[1]);
          }
        }
        c.stroke();
        if (it.label) {
          const mid = V3.add(it.o, V3.mul(V3.norm(V3.add(u, w2)), r * 1.45));
          const q = this.P(mid);
          c.font = '600 13px Source Sans 3, sans-serif';
          c.fillStyle = it.c || COL.red;
          c.fillText(it.label, q[0] - 6, q[1] + 4);
        }
      } else if (it.t === 'pt') {
        const q = this.P(it.p);
        if (it.r !== 0) {
          c.fillStyle = it.c || COL.ink;
          c.beginPath();
          c.arc(q[0], q[1], it.r || 4, 0, 7);
          c.fill();
        }
        if (it.label) {
          c.font = '600 14px Source Sans 3, sans-serif';
          c.fillStyle = it.lc || COL.ink;
          c.fillText(it.label, q[0] + (it.dx ?? 6), q[1] + (it.dy ?? -6));
        }
      } else if (it.t === 'txt') {
        const q = this.P(it.p);
        c.font = it.f || '600 13px JetBrains Mono, monospace';
        c.fillStyle = it.c || COL.ink3;
        c.fillText(it.s, q[0], q[1]);
      }
    }
  }
}
