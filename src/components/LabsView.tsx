import React, { useState, useEffect, useRef } from 'react';
import { LangCode, t } from '../data/translations';
import { Scene3D } from '../engine/scene3d';
import {
  Vec3,
  V3,
  COL,
  DEG,
  fmtN,
  exactRoot,
  angLines,
  closestLines,
  projPlane,
  projLine,
  axes,
  boxPath,
  boxV,
  CUBE_F,
  CUBE_L,
} from '../engine/v3';

interface LabsViewProps {
  currentLabId?: string;
  presetParams?: any;
  onSelectLab: (id: string) => void;
  onOpenStudio: () => void;
  lang: LangCode;
  labsList: any[];
}

export const LabsView: React.FC<LabsViewProps> = ({
  currentLabId,
  presetParams,
  onSelectLab,
  onOpenStudio,
  lang,
  labsList,
}) => {
  // If no specific lab is chosen, show the index
  if (!currentLabId || currentLabId === 'index') {
    return (
      <div className="space-y-6">
        <div className="view-head">
          <div className="eyebrow">{t(lang, 'i3d')}</div>
          <h2>{t(lang, 'labs')} (9 Интерактивті 3D Зертхана)</h2>
          <p className="lead">{t(lang, 'labsLead')}</p>
        </div>

        <div className="labgrid">
          <button
            type="button"
            className="labcard border-2 border-blue-500 bg-blue-50/30 hover:bg-blue-50"
            style={{ textAlign: 'left', cursor: 'pointer' }}
            onClick={onOpenStudio}
          >
            <span className="eyebrow text-blue-700">{t(lang, 'allUnits')}</span>
            <h3 className="text-blue-900 font-extrabold flex items-center gap-2">
              <span>◆</span>
              <span>{t(lang, 'studio')}</span>
            </h3>
            <p className="text-slate-600">{t(lang, 'studioDesc')}</p>
          </button>
        </div>

        <h3 className="section-title">{t(lang, 't2labs')} (Кеңістіктегі перпендикулярлық)</h3>
        <div className="labgrid">
          {labsList
            .filter(l => l.term === 't2')
            .map(l => (
              <button
                key={l.id}
                type="button"
                className="labcard hover:border-blue-500 hover:shadow-md transition-all"
                style={{ textAlign: 'left', cursor: 'pointer' }}
                onClick={() => onSelectLab(l.id)}
              >
                <div className="flex items-center justify-between">
                  <span className="eyebrow text-slate-500">{l.units}</span>
                  <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
                    {l.id}
                  </span>
                </div>
                <h3 className="text-slate-900 font-bold">{l.name}</h3>
                <p className="text-slate-600">{l.desc}</p>
              </button>
            ))}
        </div>

        <h3 className="section-title">{t(lang, 't3labs')} (Координаталар мен векторлар)</h3>
        <div className="labgrid">
          {labsList
            .filter(l => l.term === 't3')
            .map(l => (
              <button
                key={l.id}
                type="button"
                className="labcard hover:border-emerald-500 hover:shadow-md transition-all"
                style={{ textAlign: 'left', cursor: 'pointer' }}
                onClick={() => onSelectLab(l.id)}
              >
                <div className="flex items-center justify-between">
                  <span className="eyebrow text-slate-500">{l.units}</span>
                  <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                    {l.id}
                  </span>
                </div>
                <h3 className="text-slate-900 font-bold">{l.name}</h3>
                <p className="text-slate-600">{l.desc}</p>
              </button>
            ))}
        </div>
      </div>
    );
  }

  const activeLab = labsList.find(l => l.id === currentLabId);

  return (
    <div className="space-y-6">
      {/* Quick Lab Switcher Bar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 border-b border-slate-200">
        <button
          type="button"
          onClick={() => onSelectLab('index')}
          className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 shrink-0"
        >
          ← Барлық зертханалар
        </button>
        {labsList.map(l => {
          const isCurrent = l.id === currentLabId;
          return (
            <button
              key={l.id}
              type="button"
              onClick={() => onSelectLab(l.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors shrink-0 ${
                isCurrent 
                  ? 'bg-blue-600 text-white shadow-xs' 
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {l.name}
            </button>
          );
        })}
      </div>

      <div className="view-head">
        <div className="eyebrow">
          {t(lang, 'lab')} · {activeLab?.units || ''}
        </div>
        <h2>{activeLab?.name || currentLabId}</h2>
        <p className="lead">{activeLab?.desc || ''}</p>
        {lang !== 'en' && <p className="langnote-sm">{t(lang, 'labUi')}</p>}
      </div>

      {currentLabId === 'perp' && <LabPerp preset={presetParams} />}
      {currentLabId === 'incl' && <LabIncl preset={presetParams} />}
      {currentLabId === 'dihed' && <LabDihed preset={presetParams} />}
      {currentLabId === 'cube' && <LabCube preset={presetParams} />}
      {currentLabId === 'box' && <LabBox preset={presetParams} />}
      {currentLabId === 'proj' && <LabProj preset={presetParams} />}
      {currentLabId === 'coord' && <LabCoord preset={presetParams} />}
      {currentLabId === 'vec' && <LabVec preset={presetParams} />}
      {currentLabId === 'hunt' && <LabHunt />}
    </div>
  );
};

/* LAB 1: PERP */
const LabPerp: React.FC<{ preset?: any }> = ({ preset }) => {
  const [th, setTh] = useState(preset?.th ?? 25);
  const [ps, setPs] = useState(preset?.ps ?? 30);
  const [mu, setMu] = useState(preset?.mu ?? 120);

  const cvRef = useRef<HTMLCanvasElement | null>(null);
  const scRef = useRef<Scene3D | null>(null);

  useEffect(() => {
    if (!cvRef.current) return;
    const sc = new Scene3D(cvRef.current, { scale: 0.2 });
    scRef.current = sc;
    return () => sc.destroy();
  }, []);

  useEffect(() => {
    if (!scRef.current) return;
    const thRad = th / DEG;
    const psRad = ps / DEG;
    const muRad = mu / DEG;

    const da: Vec3 = [
      Math.sin(thRad) * Math.cos(psRad),
      Math.sin(thRad) * Math.sin(psRad),
      Math.cos(thRad),
    ];
    const db: Vec3 = [1, 0, 0];
    const dc: Vec3 = [Math.cos(Math.PI / 3), Math.sin(Math.PI / 3), 0];
    const dm: Vec3 = [Math.cos(muRad), Math.sin(muRad), 0];
    const O: Vec3 = [0, 0, 0];

    const ab = angLines(da, db);
    const ac = angLines(da, dc);
    const am = angLines(da, dm);

    const it: any[] = [
      {
        t: 'poly',
        p: [
          [-3, -3, 0],
          [3, -3, 0],
          [3, 3, 0],
          [-3, 3, 0],
        ],
        fill: 'rgba(36,80,184,.10)',
        stroke: '#9fb3e0',
      },
      { t: 'pt', p: [2.6, -2.7, 0], r: 0, label: 'α', lc: COL.blue },
      { t: 'seg', a: V3.mul(db, -2.6), b: V3.mul(db, 2.6), c: COL.teal, w: 2.2 },
      { t: 'pt', p: V3.mul(db, 2.6), r: 0, label: 'b', lc: COL.teal },
      { t: 'seg', a: V3.mul(dc, -2.6), b: V3.mul(dc, 2.6), c: COL.teal, w: 2.2 },
      { t: 'pt', p: V3.mul(dc, 2.6), r: 0, label: 'c', lc: COL.teal },
      { t: 'seg', a: V3.mul(dm, -2.4), b: V3.mul(dm, 2.4), c: COL.gold, w: 2.4 },
      { t: 'pt', p: V3.mul(dm, 2.4), r: 0, label: 'm', lc: '#9a6200' },
      { t: 'seg', a: V3.mul(da, -1.4), b: O, c: COL.red, w: 2.4, dash: true },
      { t: 'seg', a: O, b: V3.mul(da, 3.2), c: COL.red, w: 2.6 },
      { t: 'pt', p: V3.mul(da, 3.2), r: 0, label: 'a', lc: COL.red },
      { t: 'pt', p: O, label: 'O', dx: 8, dy: 16 },
    ];

    [
      [db, ab],
      [dc, ac],
      [dm, am],
    ].forEach(([d, an]: any) => {
      if (Math.abs(an - 90) < 0.05) {
        it.push({
          t: 'angle',
          o: O,
          a: V3.mul(da, 1),
          b: V3.mul(d, 1),
          r: 0.45,
          c: COL.red,
        });
      }
    });

    scRef.current.render(it);
  }, [th, ps, mu]);

  const thRad = th / DEG;
  const psRad = ps / DEG;
  const muRad = mu / DEG;
  const da: Vec3 = [
    Math.sin(thRad) * Math.cos(psRad),
    Math.sin(thRad) * Math.sin(psRad),
    Math.cos(thRad),
  ];
  const db: Vec3 = [1, 0, 0];
  const dc: Vec3 = [Math.cos(Math.PI / 3), Math.sin(Math.PI / 3), 0];
  const dm: Vec3 = [Math.cos(muRad), Math.sin(muRad), 0];
  const ab = angLines(da, db);
  const ac = angLines(da, dc);
  const am = angLines(da, dm);

  const formatAngle = (val: number) =>
    Math.abs(val - 90) < 0.05 ? (
      <b style={{ color: 'var(--good)' }}>90° ✓</b>
    ) : (
      `${fmtN(val, 1)}°`
    );

  return (
    <div className="lab">
      <div className="ctrl">
        <div>
          <label>Tilt of line a from normal: {th}°</label>
          <input
            type="range"
            min={0}
            max={80}
            step={1}
            value={th}
            onChange={e => setTh(+e.target.value)}
          />
        </div>
        <div>
          <label>Direction of the tilt: {ps}°</label>
          <input
            type="range"
            min={0}
            max={360}
            step={1}
            value={ps}
            onChange={e => setPs(+e.target.value)}
          />
        </div>
        <div>
          <label>Turn line m inside α: {mu}°</label>
          <input
            type="range"
            min={0}
            max={180}
            step={1}
            value={mu}
            onChange={e => setMu(+e.target.value)}
          />
        </div>

        <div className="row">
          <button
            type="button"
            className="btn blue"
            onClick={() => {
              setTh(0);
            }}
          >
            a ⊥ α
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => {
              setTh(40);
              setPs(90);
            }}
          >
            a ⊥ b only
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => {
              setTh(0);
              setPs(0);
            }}
          >
            a ⊥ b and a ⊥ c
          </button>
        </div>

        <div className="out">
          <table className="dtable">
            <thead>
              <tr>
                <th style={{ textAlign: 'left' }}>Angle</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ textAlign: 'left' }}>∠(a, b)</td>
                <td>{formatAngle(ab)}</td>
              </tr>
              <tr>
                <td style={{ textAlign: 'left' }}>∠(a, c)</td>
                <td>{formatAngle(ac)}</td>
              </tr>
              <tr>
                <td style={{ textAlign: 'left' }}>∠(a, m)</td>
                <td>{formatAngle(am)}</td>
              </tr>
              <tr>
                <td style={{ textAlign: 'left' }}>∠(a, α)</td>
                <td>{fmtN(90 - th, 1)}°</td>
              </tr>
            </tbody>
          </table>
          <p style={{ margin: '8px 0 0', fontSize: '15px' }}>
            {th === 0
              ? 'Line a is perpendicular to b and to c, which intersect. By the criterion, a ⊥ α, so a is perpendicular to every line in α.'
              : Math.abs(ab - 90) < 0.05 || Math.abs(ac - 90) < 0.05
              ? 'Line a is perpendicular to only one line of α. That is not enough: turn m and the angle changes.'
              : 'Line a is inclined to α. Its angles with lines of α change as m turns.'}
          </p>
        </div>
      </div>

      <div className="canvases">
        <canvas ref={cvRef} style={{ height: '380px' }} />
        <div className="row" style={{ marginTop: '6px' }}>
          <button type="button" className="btn" onClick={() => scRef.current?.reset()}>
            Reset view
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => {
              if (scRef.current) {
                scRef.current.zoom = Math.min(3, scRef.current.zoom * 1.15);
                scRef.current.render();
              }
            }}
          >
            ＋
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => {
              if (scRef.current) {
                scRef.current.zoom = Math.max(0.4, scRef.current.zoom / 1.15);
                scRef.current.render();
              }
            }}
          >
            －
          </button>
          <span style={{ color: 'var(--ink-3)', fontSize: '13px' }}>
            Drag the picture to rotate it.
          </span>
        </div>
      </div>
    </div>
  );
};

/* LAB 2: INCL */
const LabIncl: React.FC<{ preset?: any }> = ({ preset }) => {
  const [h, setH] = useState(preset?.h ?? 3);
  const [d, setD] = useState(preset?.d ?? 2.5);
  const [be, setBe] = useState(preset?.be ?? 60);
  const [d2, setD2] = useState(preset?.d2 ?? 1.5);
  const az = 20;

  const cvRef = useRef<HTMLCanvasElement | null>(null);
  const scRef = useRef<Scene3D | null>(null);

  useEffect(() => {
    if (!cvRef.current) return;
    const sc = new Scene3D(cvRef.current, {
      scale: 0.17,
      center: [0, 0, 1.2],
    });
    scRef.current = sc;
    return () => sc.destroy();
  }, []);

  const azRad = az / DEG;
  const H: Vec3 = [0, 0, 0];
  const P: Vec3 = [0, 0, h];
  const A: Vec3 = [d * Math.cos(azRad), d * Math.sin(azRad), 0];
  const az2Rad = azRad + 2.3;
  const B: Vec3 = [d2 * Math.cos(az2Rad), d2 * Math.sin(az2Rad), 0];
  const ul: Vec3 = [Math.cos(azRad + be / DEG), Math.sin(azRad + be / DEG), 0];

  const PA = Math.hypot(h, d);
  const PB = Math.hypot(h, d2);
  const phi = Math.atan2(h, d) * DEG;
  const aHA = angLines(ul, V3.sub(A, H));
  const aPA = angLines(ul, V3.sub(A, P));
  const ttp = Math.abs(aHA - 90) < 0.05;

  useEffect(() => {
    if (!scRef.current) return;
    const it: any[] = [
      {
        t: 'poly',
        p: [
          [-4, -4, 0],
          [4, -4, 0],
          [4, 4, 0],
          [-4, 4, 0],
        ],
        fill: 'rgba(36,80,184,.09)',
        stroke: '#9fb3e0',
      },
      { t: 'pt', p: [3.6, -3.8, 0], r: 0, label: 'α', lc: COL.blue },
      { t: 'seg', a: P, b: H, c: COL.ink, w: 2.4 },
      { t: 'seg', a: P, b: A, c: COL.red, w: 2.6 },
      { t: 'seg', a: H, b: A, c: COL.blue, w: 2.2, dash: true },
      {
        t: 'seg',
        a: V3.sub(A, V3.mul(ul, 2.2)),
        b: V3.add(A, V3.mul(ul, 2.2)),
        c: COL.teal,
        w: 2.2,
      },
      {
        t: 'pt',
        p: V3.add(A, V3.mul(ul, 2.2)),
        r: 0,
        label: 'l',
        lc: COL.teal,
      },
      { t: 'angle', o: H, a: P, b: A, r: 0.4, c: COL.ink2 },
      { t: 'angle', o: A, a: H, b: P, r: 0.7, c: COL.red, arc: true, label: 'φ' },
      { t: 'pt', p: P, label: 'P' },
      { t: 'pt', p: H, label: 'H', dx: -16, dy: 16 },
      { t: 'pt', p: A, label: 'A', dx: 8, dy: 16 },
      { t: 'seg', a: P, b: B, c: '#7a4fb5', w: 2 },
      { t: 'seg', a: H, b: B, c: '#7a4fb5', w: 1.5, dash: true },
      { t: 'pt', p: B, label: 'B', c: '#7a4fb5', dx: -16, dy: 16 },
    ];

    if (ttp) {
      it.push(
        {
          t: 'angle',
          o: A,
          a: V3.add(A, ul),
          b: H,
          r: 0.35,
          c: COL.teal,
        },
        {
          t: 'angle',
          o: A,
          a: V3.add(A, ul),
          b: P,
          r: 0.35,
          c: COL.teal,
        }
      );
    }
    scRef.current.render(it);
  }, [h, d, be, d2, ttp]);

  return (
    <div className="lab">
      <div className="ctrl">
        <div>
          <label>Perpendicular PH: {h}</label>
          <input
            type="range"
            min={0.5}
            max={4}
            step={0.1}
            value={h}
            onChange={e => setH(+e.target.value)}
          />
        </div>
        <div>
          <label>Projection HA: {d}</label>
          <input
            type="range"
            min={0.2}
            max={4}
            step={0.1}
            value={d}
            onChange={e => setD(+e.target.value)}
          />
        </div>
        <div>
          <label>Angle between line l and HA: {be}°</label>
          <input
            type="range"
            min={0}
            max={180}
            step={1}
            value={be}
            onChange={e => setBe(+e.target.value)}
          />
        </div>
        <div>
          <label>Projection HB of second inclined line: {d2}</label>
          <input
            type="range"
            min={0.2}
            max={4}
            step={0.1}
            value={d2}
            onChange={e => setD2(+e.target.value)}
          />
        </div>

        <div className="row">
          <button type="button" className="btn blue" onClick={() => setBe(90)}>
            l ⊥ HA (three perpendiculars)
          </button>
          <button type="button" className="btn" onClick={() => setD2(d)}>
            PA = PB
          </button>
        </div>

        <div className="out">
          <table className="dtable">
            <thead>
              <tr>
                <th style={{ textAlign: 'left' }}>Quantity</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ textAlign: 'left' }}>Perpendicular PH</td>
                <td>{fmtN(h)}</td>
              </tr>
              <tr>
                <td style={{ textAlign: 'left' }}>Projection HA</td>
                <td>{fmtN(d)}</td>
              </tr>
              <tr>
                <td style={{ textAlign: 'left' }}>Inclined PA = √(PH² + HA²)</td>
                <td>{fmtN(PA, 3)}</td>
              </tr>
              <tr>
                <td style={{ textAlign: 'left' }}>Inclined PB (projection {fmtN(d2)})</td>
                <td>{fmtN(PB, 3)}</td>
              </tr>
              <tr>
                <td style={{ textAlign: 'left' }}>∠(PA, α) = φ</td>
                <td>{fmtN(phi, 1)}°</td>
              </tr>
              <tr>
                <td style={{ textAlign: 'left' }}>∠(l, HA)</td>
                <td className={ttp ? 'hl' : ''}>{fmtN(aHA, 1)}°</td>
              </tr>
              <tr>
                <td style={{ textAlign: 'left' }}>∠(l, PA)</td>
                <td className={ttp ? 'hl' : ''}>{fmtN(aPA, 1)}°</td>
              </tr>
            </tbody>
          </table>
          <p style={{ margin: '8px 0 0', fontSize: '15px' }}>
            {ttp
              ? 'Three perpendiculars: l ⊥ projection HA, so l ⊥ inclined PA.'
              : 'Turn l until it is perpendicular to the projection HA and watch the angle with PA.'}
          </p>
        </div>
      </div>

      <div className="canvases">
        <canvas ref={cvRef} style={{ height: '380px' }} />
        <div className="row" style={{ marginTop: '6px' }}>
          <button type="button" className="btn" onClick={() => scRef.current?.reset()}>
            Reset view
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => {
              if (scRef.current) {
                scRef.current.zoom = Math.min(3, scRef.current.zoom * 1.15);
                scRef.current.render();
              }
            }}
          >
            ＋
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => {
              if (scRef.current) {
                scRef.current.zoom = Math.max(0.4, scRef.current.zoom / 1.15);
                scRef.current.render();
              }
            }}
          >
            －
          </button>
        </div>
      </div>
    </div>
  );
};

/* LAB 3: DIHED */
const LabDihed: React.FC<{ preset?: any }> = ({ preset }) => {
  const [mode, setMode] = useState<'angle' | 'fold'>(preset?.mode ?? 'angle');
  const [phi, setPhi] = useState(preset?.phi ?? 60);
  const [m, setM] = useState(preset?.m ?? 2);

  const cvRef = useRef<HTMLCanvasElement | null>(null);
  const scRef = useRef<Scene3D | null>(null);

  useEffect(() => {
    if (!cvRef.current) return;
    const sc = new Scene3D(cvRef.current, {
      scale: 0.17,
      center: [0, 0.8, 0.8],
      yaw: -0.5,
      pitch: 0.35,
    });
    scRef.current = sc;
    return () => sc.destroy();
  }, []);

  const f = phi / DEG;

  useEffect(() => {
    if (!scRef.current) return;
    if (mode === 'angle') {
      scRef.current.center = [0, 0.8, 0.8];
      const e2: Vec3 = [0, Math.cos(f), Math.sin(f)];
      const L = 3.2;
      const O: Vec3 = [0.8, 0, 0];
      const K1: Vec3 = [0.8, 2.2, 0];
      const K2: Vec3 = V3.add(O, V3.mul(e2, 2.2));
      const Mb: Vec3 = [-1.2, 0, 0];
      const M: Vec3 = V3.add(Mb, V3.mul(e2, m));
      const Mf: Vec3 = [M[0], M[1], 0];

      const it: any[] = [
        {
          t: 'poly',
          p: [
            [-2.5, 0, 0],
            [2.5, 0, 0],
            [2.5, L, 0],
            [-2.5, L, 0],
          ],
          fill: 'rgba(36,80,184,.12)',
          stroke: '#9fb3e0',
        },
        {
          t: 'poly',
          p: [
            [-2.5, 0, 0],
            [2.5, 0, 0],
            V3.add([2.5, 0, 0], V3.mul(e2, L)),
            V3.add([-2.5, 0, 0], V3.mul(e2, L)),
          ],
          fill: 'rgba(15,138,122,.14)',
          stroke: '#8fcfc4',
        },
        { t: 'seg', a: [-2.8, 0, 0], b: [2.8, 0, 0], c: COL.ink, w: 3 },
        { t: 'pt', p: [2.9, 0, 0], r: 0, label: 'edge', lc: COL.ink2 },
        { t: 'seg', a: O, b: K1, c: COL.blue, w: 2.2 },
        { t: 'seg', a: O, b: K2, c: COL.teal, w: 2.2 },
        { t: 'angle', o: O, a: K1, b: K2, r: 0.7, c: COL.red, arc: true, label: 'φ' },
        { t: 'angle', o: O, a: [2, 0, 0], b: K1, r: 0.3, c: COL.ink2 },
        { t: 'angle', o: O, a: [2, 0, 0], b: K2, r: 0.3, c: COL.ink2 },
        { t: 'pt', p: O, label: 'O', dx: 6, dy: 16 },
        { t: 'pt', p: [-2.3, 2.9, 0], r: 0, label: 'α', lc: COL.blue },
        { t: 'pt', p: V3.add([-2.3, 0, 0], V3.mul(e2, 2.9)), r: 0, label: 'β', lc: COL.teal },
        { t: 'pt', p: M, label: 'M', c: COL.red },
        { t: 'seg', a: M, b: Mb, c: COL.red, w: 1.6, dash: true },
        { t: 'seg', a: M, b: Mf, c: COL.red, w: 1.8 },
        { t: 'pt', p: Mf, label: 'H', r: 3, dx: 6, dy: 14 },
        { t: 'pt', p: Mb, label: 'K', r: 3, dx: -14, dy: 14 },
      ];
      if (phi !== 90 && phi < 180) {
        it.push({ t: 'angle', o: Mf, a: M, b: Mb, r: 0.25, c: COL.ink2 });
      }
      scRef.current.render(it);
    } else {
      scRef.current.center = [0, 1, 0.6];
      const D: Vec3 = [0, 0, 0];
      const C: Vec3 = [0, 2, 0];
      const B: Vec3 = [2, 0, 0];
      const A: Vec3 = [2 * Math.cos(f), 0, 2 * Math.sin(f)];
      const it = [
        { t: 'poly', p: [D, B, C], fill: 'rgba(36,80,184,.14)', stroke: '#9fb3e0' },
        { t: 'poly', p: [D, A, C], fill: 'rgba(15,138,122,.16)', stroke: '#8fcfc4' },
        { t: 'seg', a: C, b: D, c: COL.ink, w: 2.6 },
        { t: 'seg', a: D, b: B, c: COL.ink, w: 2 },
        { t: 'seg', a: C, b: B, c: COL.ink, w: 2 },
        { t: 'seg', a: D, b: A, c: COL.ink, w: 2 },
        { t: 'seg', a: C, b: A, c: COL.ink, w: 2 },
        { t: 'seg', a: A, b: B, c: COL.red, w: 2.2, dash: true },
        { t: 'angle', o: D, a: A, b: B, r: 0.5, c: COL.red, arc: phi !== 90, label: phi === 90 ? '' : 'φ' },
        { t: 'angle', o: D, a: C, b: B, r: 0.3, c: COL.ink2 },
        { t: 'angle', o: D, a: C, b: A, r: 0.3, c: COL.ink2 },
        { t: 'pt', p: A, label: 'A' },
        { t: 'pt', p: B, label: 'B', dx: 8, dy: 14 },
        { t: 'pt', p: C, label: 'C' },
        { t: 'pt', p: D, label: 'D', dx: -16, dy: 14 },
      ];
      scRef.current.render(it);
    }
  }, [mode, phi, m, f]);

  return (
    <div className="lab">
      <div className="ctrl">
        <div>
          <label>Model</label>
          <div className="seg">
            <button
              type="button"
              aria-pressed={mode === 'angle'}
              onClick={() => setMode('angle')}
            >
              Dihedral angle
            </button>
            <button
              type="button"
              aria-pressed={mode === 'fold'}
              onClick={() => {
                setMode('fold');
                setPhi(120);
              }}
            >
              Fold a triangle
            </button>
          </div>
        </div>

        <div>
          <label>Angle φ: {phi}°</label>
          <input
            type="range"
            min={5}
            max={180}
            step={1}
            value={phi}
            onChange={e => setPhi(+e.target.value)}
          />
        </div>

        {mode === 'angle' && (
          <div>
            <label>Distance from M to edge: {m}</label>
            <input
              type="range"
              min={0.5}
              max={3}
              step={0.1}
              value={m}
              onChange={e => setM(+e.target.value)}
            />
          </div>
        )}

        <div className="row">
          <button type="button" className="btn blue" onClick={() => setPhi(90)}>
            Make it 90°
          </button>
        </div>

        <div className="out">
          <table className="dtable">
            <thead>
              <tr>
                <th style={{ textAlign: 'left' }}>Quantity</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ textAlign: 'left' }}>Linear angle φ</td>
                <td>{phi}°</td>
              </tr>
              {mode === 'angle' ? (
                <>
                  <tr>
                    <td style={{ textAlign: 'left' }}>MK (to the edge)</td>
                    <td>{fmtN(m)}</td>
                  </tr>
                  <tr>
                    <td style={{ textAlign: 'left' }}>MH (to plane α) = MK·sin φ</td>
                    <td>{fmtN(m * Math.sin(f), 3)}</td>
                  </tr>
                </>
              ) : (
                <tr>
                  <td style={{ textAlign: 'left' }}>AB = 2·DA·sin(φ/2)</td>
                  <td>{fmtN(2 * 2 * Math.sin(f / 2), 3)}</td>
                </tr>
              )}
            </tbody>
          </table>
          <p style={{ margin: '8px 0 0', fontSize: '15px' }}>
            {phi === 90
              ? 'At 90° the planes are perpendicular.'
              : 'The linear angle is formed by two rays drawn in the faces perpendicular to the edge at one point.'}
          </p>
        </div>
      </div>

      <div className="canvases">
        <canvas ref={cvRef} style={{ height: '380px' }} />
        <div className="row" style={{ marginTop: '6px' }}>
          <button type="button" className="btn" onClick={() => scRef.current?.reset()}>
            Reset view
          </button>
        </div>
      </div>
    </div>
  );
};

/* LAB 4: CUBE INVESTIGATOR */
const LabCube: React.FC<{ preset?: any }> = ({ preset }) => {
  const [o1, setO1] = useState(preset?.o1 ?? 'line');
  const [o2, setO2] = useState(preset?.o2 ?? 'line');
  const [v1, setV1] = useState<string[]>(preset?.v1 ?? ['A', 'B₁', 'C']);
  const [v2, setV2] = useState<string[]>(preset?.v2 ?? ['B', 'C₁', 'D']);

  const cvRef = useRef<HTMLCanvasElement | null>(null);
  const scRef = useRef<Scene3D | null>(null);

  useEffect(() => {
    if (!cvRef.current) return;
    const sc = new Scene3D(cvRef.current, {
      scale: 0.4,
      center: [0.5, 0.5, 0.5],
      yaw: -0.55,
      pitch: 0.38,
    });
    scRef.current = sc;
    return () => sc.destroy();
  }, []);

  const getObj = (type: string, vs: string[]) => {
    const Vs = boxV(1, 1, 1);
    const P = vs.map(l => Vs[CUBE_L.indexOf(l)]);
    if (type === 'point') return { type, p: P[0], name: vs[0] };
    if (type === 'line') {
      if (V3.len(V3.sub(P[1], P[0])) < 1e-9)
        return { err: `Choose two different points for line ${vs[0]}${vs[1]}.` };
      return { type, p: P[0], d: V3.sub(P[1], P[0]), a: P[0], b: P[1], name: vs[0] + vs[1] };
    }
    const n = V3.cross(V3.sub(P[1], P[0]), V3.sub(P[2], P[0]));
    if (V3.len(n) < 1e-9)
      return { err: `Points ${vs.join(', ')} lie on one line, so they do not define a plane.` };
    return { type, p: P[0], n, name: '(' + vs.join('') + ')' };
  };

  const getSection = (a: Vec3, n: Vec3) => {
    const Vs = boxV(1, 1, 1);
    const E = [
      [0, 1], [1, 2], [2, 3], [3, 0],
      [4, 5], [5, 6], [6, 7], [7, 4],
      [0, 4], [1, 5], [2, 6], [3, 7],
    ];
    const pts: Vec3[] = [];
    const f = (p: Vec3) => V3.dot(V3.sub(p, a), n);
    E.forEach(([i, j]) => {
      const fi = f(Vs[i]);
      const fj = f(Vs[j]);
      if (Math.abs(fi) < 1e-9) pts.push(Vs[i]);
      if (Math.abs(fj) < 1e-9) pts.push(Vs[j]);
      if (fi * fj < -1e-12) pts.push(V3.lerp(Vs[i], Vs[j], fi / (fi - fj)));
    });
    const u: Vec3[] = [];
    pts.forEach(p => {
      if (!u.some(q => V3.len(V3.sub(p, q)) < 1e-7)) u.push(p);
    });
    if (u.length < 3) return u;
    const c = u.reduce((s, p) => V3.add(s, V3.mul(p, 1 / u.length)), [0, 0, 0]);
    const e1 = V3.norm(V3.sub(u[0], c));
    const e2 = V3.cross(V3.norm(n), e1);
    return u.sort(
      (p, q) =>
        Math.atan2(V3.dot(V3.sub(p, c), e2), V3.dot(V3.sub(p, c), e1)) -
        Math.atan2(V3.dot(V3.sub(q, c), e2), V3.dot(V3.sub(q, c), e1))
    );
  };

  const A = getObj(o1, v1);
  const B = getObj(o2, v2);

  useEffect(() => {
    if (!scRef.current) return;
    const it: any[] = [
      { t: 'solid', V: boxV(1, 1, 1), F: CUBE_F, c: COL.ink, w: 1.6, labels: CUBE_L },
    ];
    if (A.err || B.err) {
      scRef.current.render(it);
      return;
    }
    const col = [COL.red, COL.blue];
    [A, B].forEach((o: any, i) => {
      if (o.type === 'point') it.push({ t: 'pt', p: o.p, c: col[i], r: 6 });
      if (o.type === 'line') {
        const d = V3.norm(o.d);
        it.push({
          t: 'seg',
          a: V3.sub(o.a, V3.mul(d, 0.35)),
          b: V3.add(o.b, V3.mul(d, 0.35)),
          c: col[i],
          w: 3,
        });
      }
      if (o.type === 'plane') {
        const sec = getSection(o.p, o.n);
        if (sec.length >= 3)
          it.push({
            t: 'poly',
            p: sec,
            fill: i ? 'rgba(36,80,184,.22)' : 'rgba(180,70,44,.20)',
            stroke: col[i],
          });
      }
    });

    scRef.current.render(it);
  }, [o1, o2, v1, v2]);

  return (
    <div className="lab">
      <div className="ctrl">
        <div>
          <label>Object 1</label>
          <div className="seg">
            {['point', 'line', 'plane'].map(type => (
              <button
                key={type}
                type="button"
                aria-pressed={o1 === type}
                onClick={() => setO1(type)}
              >
                {type}
              </button>
            ))}
          </div>
          <div className="row" style={{ marginTop: '6px' }}>
            {[0, 1, 2].slice(0, o1 === 'point' ? 1 : o1 === 'line' ? 2 : 3).map(idx => (
              <select
                key={idx}
                value={v1[idx]}
                onChange={e => {
                  const copy = [...v1];
                  copy[idx] = e.target.value;
                  setV1(copy);
                }}
              >
                {CUBE_L.map(l => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            ))}
          </div>
        </div>

        <div>
          <label>Object 2</label>
          <div className="seg">
            {['point', 'line', 'plane'].map(type => (
              <button
                key={type}
                type="button"
                aria-pressed={o2 === type}
                onClick={() => setO2(type)}
              >
                {type}
              </button>
            ))}
          </div>
          <div className="row" style={{ marginTop: '6px' }}>
            {[0, 1, 2].slice(0, o2 === 'point' ? 1 : o2 === 'line' ? 2 : 3).map(idx => (
              <select
                key={idx}
                value={v2[idx]}
                onChange={e => {
                  const copy = [...v2];
                  copy[idx] = e.target.value;
                  setV2(copy);
                }}
              >
                {CUBE_L.map(l => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>
            ))}
          </div>
        </div>

        <div className="out">
          {A.err || B.err ? (
            <p>{A.err || B.err}</p>
          ) : (
            <p style={{ margin: 0 }}>
              Analyzing relationship between {A.name} and {B.name}. Drag to rotate the cube.
            </p>
          )}
        </div>
      </div>

      <div className="canvases">
        <canvas ref={cvRef} style={{ height: '380px' }} />
        <div className="row" style={{ marginTop: '6px' }}>
          <button type="button" className="btn" onClick={() => scRef.current?.reset()}>
            Reset view
          </button>
        </div>
      </div>
    </div>
  );
};

/* LAB 5: BOX (Rectangular Parallelepiped) */
const LabBox: React.FC<{ preset?: any }> = ({ preset }) => {
  const [a, setA] = useState(preset?.a ?? 4);
  const [b, setB] = useState(preset?.b ?? 3);
  const [c, setC] = useState(preset?.c ?? 2);

  const cvRef = useRef<HTMLCanvasElement | null>(null);
  const scRef = useRef<Scene3D | null>(null);

  useEffect(() => {
    if (!cvRef.current) return;
    const sc = new Scene3D(cvRef.current, { scale: 0.065, yaw: -0.6, pitch: 0.35 });
    scRef.current = sc;
    return () => sc.destroy();
  }, []);

  const d = Math.sqrt(a * a + b * b + c * c);
  const dxy = Math.hypot(a, b);

  useEffect(() => {
    if (!scRef.current) return;
    scRef.current.center = [a / 2, b / 2, c / 2];
    scRef.current.scale = 0.5 / Math.max(a, b, c);
    const Vs = boxV(a, b, c);
    const it = [
      { t: 'solid', V: Vs, F: CUBE_F, fill: 'rgba(36,80,184,.05)', labels: CUBE_L },
      { t: 'seg', a: Vs[0], b: Vs[6], c: COL.red, w: 2.8 },
      { t: 'seg', a: Vs[0], b: Vs[2], c: COL.blue, w: 2, dash: true },
      {
        t: 'angle',
        o: Vs[0],
        a: Vs[2],
        b: Vs[6],
        r: (0.25 * Math.max(a, b, c)) / 3,
        c: COL.red,
        arc: true,
        label: 'φ',
      },
    ];
    scRef.current.render(it);
  }, [a, b, c]);

  return (
    <div className="lab">
      <div className="ctrl">
        <div>
          <label>a = AB: {a}</label>
          <input
            type="range"
            min={1}
            max={6}
            step={0.5}
            value={a}
            onChange={e => setA(+e.target.value)}
          />
        </div>
        <div>
          <label>b = AD: {b}</label>
          <input
            type="range"
            min={1}
            max={6}
            step={0.5}
            value={b}
            onChange={e => setB(+e.target.value)}
          />
        </div>
        <div>
          <label>c = AA₁: {c}</label>
          <input
            type="range"
            min={1}
            max={6}
            step={0.5}
            value={c}
            onChange={e => setC(+e.target.value)}
          />
        </div>

        <div className="row">
          <button
            type="button"
            className="btn"
            onClick={() => {
              setA(3);
              setB(3);
              setC(3);
            }}
          >
            Cube
          </button>
          <button
            type="button"
            className="btn"
            onClick={() => {
              setA(1);
              setB(2);
              setC(2);
            }}
          >
            1 × 2 × 2
          </button>
        </div>

        <div className="out">
          <div className="eyebrow">Diagonal</div>
          <div className="big">
            d² = a² + b² + c² = {a * a + b * b + c * c}, d = {exactRoot(d) || fmtN(d, 3)}
          </div>
          <table className="dtable" style={{ marginTop: '8px' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left' }}>Quantity</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ textAlign: 'left' }}>Angle φ of AC₁ with base</td>
                <td>{fmtN(Math.atan2(c, dxy) * DEG, 2)}°</td>
              </tr>
              <tr>
                <td style={{ textAlign: 'left' }}>Surface area 2(ab + bc + ca)</td>
                <td>{fmtN(2 * (a * b + b * c + c * a))}</td>
              </tr>
              <tr>
                <td style={{ textAlign: 'left' }}>Volume abc</td>
                <td>{fmtN(a * b * c)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="canvases">
        <canvas ref={cvRef} style={{ height: '380px' }} />
        <div className="row" style={{ marginTop: '6px' }}>
          <button type="button" className="btn" onClick={() => scRef.current?.reset()}>
            Reset view
          </button>
        </div>
      </div>
    </div>
  );
};

/* LAB 6: PROJ (Orthogonal projection area) */
const LabProj: React.FC<{ preset?: any }> = ({ preset }) => {
  const [fig, setFig] = useState<string>(preset?.fig ?? 'tri');
  const [phi, setPhi] = useState(preset?.phi ?? 45);

  const cvRef = useRef<HTMLCanvasElement | null>(null);
  const scRef = useRef<Scene3D | null>(null);

  useEffect(() => {
    if (!cvRef.current) return;
    const sc = new Scene3D(cvRef.current, {
      scale: 0.16,
      center: [0, 1.6, 0.8],
      yaw: -0.35,
      pitch: 0.45,
    });
    scRef.current = sc;
    return () => sc.destroy();
  }, []);

  const getPoints = (): [number, number][] => {
    if (fig === 'sq') return [[-1.4, 0.4], [1.4, 0.4], [1.4, 3.2], [-1.4, 3.2]];
    if (fig === 'hex')
      return Array.from({ length: 6 }, (_, i) => [
        1.5 * Math.cos((i * Math.PI) / 3),
        1.9 + 1.5 * Math.sin((i * Math.PI) / 3),
      ]);
    return [[-1.5, 0.4], [1.5, 0.4], [0, 0.4 + 1.5 * Math.sqrt(3)]];
  };

  const f = phi / DEG;
  const P = getPoints();
  const up = ([x, y]: [number, number]): Vec3 => [x, y * Math.cos(f), y * Math.sin(f)];
  const dn = ([x, y]: [number, number]): Vec3 => [x, y * Math.cos(f), 0];

  const area = (pts: [number, number][]) =>
    Math.abs(
      pts.reduce((acc, p, i) => {
        const q = pts[(i + 1) % pts.length];
        return acc + p[0] * q[1] - q[0] * p[1];
      }, 0)
    ) / 2;

  const S = area(P);
  const Sp = S * Math.cos(f);

  useEffect(() => {
    if (!scRef.current) return;
    const it: any[] = [
      {
        t: 'poly',
        p: [
          [-3, 0, 0],
          [3, 0, 0],
          [3, 4.2, 0],
          [-3, 4.2, 0],
        ],
        fill: 'rgba(36,80,184,.08)',
        stroke: '#9fb3e0',
      },
      {
        t: 'poly',
        p: [[-3, 0, 0], [3, 0, 0], up([3, 4.2]), up([-3, 4.2])],
        fill: 'rgba(15,138,122,.08)',
        stroke: '#8fcfc4',
      },
      { t: 'poly', p: P.map(up), fill: 'rgba(15,138,122,.35)', stroke: COL.teal },
      { t: 'poly', p: P.map(dn), fill: 'rgba(36,80,184,.30)', stroke: COL.blue },
      { t: 'seg', a: [-3.3, 0, 0], b: [3.3, 0, 0], c: COL.ink, w: 2.4 },
      {
        t: 'angle',
        o: [2.6, 0, 0],
        a: [2.6, 1, 0],
        b: up([2.6, 1]),
        r: 0.6,
        c: COL.red,
        arc: true,
        label: 'φ',
      },
      { t: 'pt', p: [-2.8, 4, 0], r: 0, label: 'α', lc: COL.blue },
      { t: 'pt', p: up([-2.8, 4]), r: 0, label: 'β', lc: COL.teal },
    ];
    P.forEach(p => {
      it.push({ t: 'seg', a: up(p), b: dn(p), c: COL.ink3, w: 1, dash: true });
    });
    scRef.current.render(it);
  }, [fig, phi, f]);

  return (
    <div className="lab">
      <div className="ctrl">
        <div>
          <label>Figure</label>
          <div className="seg">
            <button
              type="button"
              aria-pressed={fig === 'tri'}
              onClick={() => setFig('tri')}
            >
              Triangle
            </button>
            <button
              type="button"
              aria-pressed={fig === 'sq'}
              onClick={() => setFig('sq')}
            >
              Square
            </button>
            <button
              type="button"
              aria-pressed={fig === 'hex'}
              onClick={() => setFig('hex')}
            >
              Hexagon
            </button>
          </div>
        </div>

        <div>
          <label>Angle φ between planes: {phi}°</label>
          <input
            type="range"
            min={0}
            max={89}
            step={1}
            value={phi}
            onChange={e => setPhi(+e.target.value)}
          />
        </div>

        <div className="out">
          <div className="big">S_proj = S · cos φ</div>
          <table className="dtable" style={{ marginTop: '8px' }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left' }}>Quantity</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={{ textAlign: 'left' }}>Area S of figure</td>
                <td>{fmtN(S, 3)}</td>
              </tr>
              <tr>
                <td style={{ textAlign: 'left' }}>Area of projection</td>
                <td className="hl">{fmtN(Sp, 3)}</td>
              </tr>
              <tr>
                <td style={{ textAlign: 'left' }}>cos φ</td>
                <td>{fmtN(Math.cos(f), 4)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="canvases">
        <canvas ref={cvRef} style={{ height: '380px' }} />
        <div className="row" style={{ marginTop: '6px' }}>
          <button type="button" className="btn" onClick={() => scRef.current?.reset()}>
            Reset view
          </button>
        </div>
      </div>
    </div>
  );
};

/* LAB 7: COORD */
const LabCoord: React.FC<{ preset?: any }> = ({ preset }) => {
  const [coordA, setCoordA] = useState(preset?.A ?? '1; 2; 3');
  const [coordB, setCoordB] = useState(preset?.B ?? '-1; 1; 1');
  const [lam, setLam] = useState(preset?.lam ?? 1);
  const [showBox, setShowBox] = useState(true);

  const cvRef = useRef<HTMLCanvasElement | null>(null);
  const scRef = useRef<Scene3D | null>(null);

  const parseTriple = (str: string): Vec3 | null => {
    const parts = str.replace(/[()]/g, '').split(/[;,\s]+/).filter(Boolean).map(Number);
    return parts.length === 3 && parts.every(x => !isNaN(x)) ? (parts as Vec3) : null;
  };

  const A = parseTriple(coordA) || [1, 2, 3];
  const B = parseTriple(coordB) || [-1, 1, 1];
  const M: Vec3 = V3.mul(V3.add(A, V3.mul(B, lam)), 1 / (1 + lam));
  const AB = V3.sub(B, A);
  const dist = V3.len(AB);

  useEffect(() => {
    if (!cvRef.current) return;
    const sc = new Scene3D(cvRef.current, { scale: 0.065, yaw: -0.75, pitch: 0.3, h: 420 });
    scRef.current = sc;
    return () => sc.destroy();
  }, []);

  useEffect(() => {
    if (!scRef.current) return;
    const L = Math.max(4, Math.ceil(Math.max(...A.map(Math.abs), ...B.map(Math.abs))));
    scRef.current.scale = 0.42 / L;
    const it: any[] = axes(L).concat([
      { t: 'seg', a: A, b: B, c: COL.red, w: 2.6 },
      { t: 'pt', p: A, c: COL.red, label: `A(${A.join('; ')})` },
      { t: 'pt', p: B, c: COL.blue, label: `B(${B.join('; ')})` },
      { t: 'pt', p: M, c: COL.gold, r: 5, label: 'M', dx: 8, dy: 16 },
    ]);
    if (showBox) {
      it.push(...boxPath(A, COL.red), ...boxPath(B, COL.blue));
    }
    scRef.current.render(it);
  }, [coordA, coordB, lam, showBox]);

  return (
    <div className="lab">
      <div className="ctrl">
        <div>
          <label>Point A (x; y; z)</label>
          <input
            type="text"
            value={coordA}
            onChange={e => setCoordA(e.target.value)}
          />
        </div>
        <div>
          <label>Point B (x; y; z)</label>
          <input
            type="text"
            value={coordB}
            onChange={e => setCoordB(e.target.value)}
          />
        </div>
        <div>
          <label>Ratio λ = AM : MB: {lam}</label>
          <input
            type="range"
            min={0.1}
            max={5}
            step={0.1}
            value={lam}
            onChange={e => setLam(+e.target.value)}
          />
        </div>
        <label style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <input
            type="checkbox"
            checked={showBox}
            onChange={e => setShowBox(e.target.checked)}
          />
          Show coordinate boxes
        </label>

        <div className="out">
          <div className="eyebrow">Vector AB</div>
          <div>({AB.join('; ')})</div>
          <div className="eyebrow" style={{ marginTop: '8px' }}>
            Distance
          </div>
          <div className="big">
            AB = {exactRoot(dist) || fmtN(dist, 3)}
          </div>
          <div className="eyebrow" style={{ marginTop: '8px' }}>
            Point M
          </div>
          <div>M({M.map(x => fmtN(x, 2)).join('; ')})</div>
        </div>
      </div>

      <div className="canvases">
        <canvas ref={cvRef} style={{ height: '420px' }} />
        <div className="row" style={{ marginTop: '6px' }}>
          <button type="button" className="btn" onClick={() => scRef.current?.reset()}>
            Reset view
          </button>
        </div>
      </div>
    </div>
  );
};

/* LAB 8: VEC (Vectors in Space) */
const LabVec: React.FC<{ preset?: any }> = ({ preset }) => {
  const [mode, setMode] = useState<string>(preset?.mode ?? 'sum');
  const [vecA, setVecA] = useState('2; 1; 0');
  const [vecB, setVecB] = useState('0; 2; 1');
  const [k, setK] = useState(1.5);

  const cvRef = useRef<HTMLCanvasElement | null>(null);
  const scRef = useRef<Scene3D | null>(null);

  const parseTriple = (str: string): Vec3 => {
    const parts = str.replace(/[()]/g, '').split(/[;,\s]+/).filter(Boolean).map(Number);
    return parts.length === 3 && parts.every(x => !isNaN(x)) ? (parts as Vec3) : [1, 0, 0];
  };

  const a = parseTriple(vecA);
  const b = parseTriple(vecB);

  useEffect(() => {
    if (!cvRef.current) return;
    const sc = new Scene3D(cvRef.current, { scale: 0.065, yaw: -0.75, pitch: 0.3, h: 420 });
    scRef.current = sc;
    return () => sc.destroy();
  }, []);

  useEffect(() => {
    if (!scRef.current) return;
    const O: Vec3 = [0, 0, 0];
    const ar = (p: Vec3, col: string, lab: string, from = O) => [
      { t: 'seg', a: from, b: p, c: col, w: 2.6, arrow: true },
      { t: 'pt', p, r: 0, label: lab, lc: col },
    ];
    let it: any[] = [];
    if (mode === 'sum') {
      const S = V3.add(a, b);
      it = [
        ...ar(a, COL.red, 'a'),
        ...ar(b, COL.blue, 'b'),
        { t: 'seg', a, b: S, c: COL.blue, w: 1.2, dash: true },
        { t: 'seg', a: b, b: S, c: COL.red, w: 1.2, dash: true },
        ...ar(S, COL.teal, 'a+b'),
        { t: 'poly', p: [O, a, S, b], fill: 'rgba(15,138,122,.10)' },
      ];
    } else if (mode === 'scal') {
      const K = V3.mul(a, k);
      it = [...ar(K, COL.teal, 'k·a'), ...ar(a, COL.red, 'a')];
    }
    const L = 4;
    scRef.current.scale = 0.42 / L;
    scRef.current.render(axes(L, false).concat(it));
  }, [mode, vecA, vecB, k]);

  return (
    <div className="lab">
      <div className="ctrl">
        <div>
          <label>Operation</label>
          <div className="seg">
            <button
              type="button"
              aria-pressed={mode === 'sum'}
              onClick={() => setMode('sum')}
            >
              a + b
            </button>
            <button
              type="button"
              aria-pressed={mode === 'scal'}
              onClick={() => setMode('scal')}
            >
              k · a
            </button>
          </div>
        </div>

        <div>
          <label>Vector a (x; y; z)</label>
          <input
            type="text"
            value={vecA}
            onChange={e => setVecA(e.target.value)}
          />
        </div>
        {mode === 'sum' && (
          <div>
            <label>Vector b (x; y; z)</label>
            <input
              type="text"
              value={vecB}
              onChange={e => setVecB(e.target.value)}
            />
          </div>
        )}
        {mode === 'scal' && (
          <div>
            <label>Scalar k: {k}</label>
            <input
              type="range"
              min={-3}
              max={3}
              step={0.1}
              value={k}
              onChange={e => setK(+e.target.value)}
            />
          </div>
        )}

        <div className="out">
          {mode === 'sum' ? (
            <div>
              <div className="eyebrow">Sum Vector</div>
              <div className="big">
                a + b = ({V3.add(a, b).join('; ')})
              </div>
            </div>
          ) : (
            <div>
              <div className="eyebrow">Scaled Vector</div>
              <div className="big">
                k·a = ({V3.mul(a, k).map(x => fmtN(x, 2)).join('; ')})
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="canvases">
        <canvas ref={cvRef} style={{ height: '420px' }} />
        <div className="row" style={{ marginTop: '6px' }}>
          <button type="button" className="btn" onClick={() => scRef.current?.reset()}>
            Reset view
          </button>
        </div>
      </div>
    </div>
  );
};

/* LAB 9: HUNT (Point Hunt Game) */
const LabHunt: React.FC = () => {
  const [targetPoint, setTargetPoint] = useState<Vec3>([2, 3, 1]);
  const [userGuess, setUserGuess] = useState('');
  const [score, setScore] = useState(0);
  const [tries, setTries] = useState(0);
  const [streak, setStreak] = useState(0);
  const [message, setMessage] = useState('');
  const [showGuide, setShowGuide] = useState(true);

  const cvRef = useRef<HTMLCanvasElement | null>(null);
  const scRef = useRef<Scene3D | null>(null);

  const generateNewPoint = () => {
    const r = () => Math.floor(Math.random() * 9) - 4;
    let p: Vec3;
    do {
      p = [r(), r(), r()];
    } while (p.filter(x => x === 0).length > 1);
    setTargetPoint(p);
    setUserGuess('');
    setMessage('');
  };

  useEffect(() => {
    if (!cvRef.current) return;
    const sc = new Scene3D(cvRef.current, {
      scale: 0.105,
      yaw: -0.75,
      pitch: 0.3,
      h: 420,
    });
    scRef.current = sc;
    return () => sc.destroy();
  }, []);

  useEffect(() => {
    if (!scRef.current) return;
    const it: any[] = axes(4).concat([{ t: 'pt', p: targetPoint, c: COL.red, r: 6 }]);
    if (showGuide) {
      it.push(
        ...boxPath(targetPoint, COL.red),
        { t: 'pt', p: [targetPoint[0], targetPoint[1], 0], r: 3, c: COL.ink3 }
      );
    }
    scRef.current.render(it);
  }, [targetPoint, showGuide]);

  const handleCheck = () => {
    const parts = userGuess
      .replace(/[()]/g, '')
      .split(/[;,\s]+/)
      .filter(Boolean)
      .map(Number);
    if (parts.length !== 3 || parts.some(isNaN)) {
      setMessage('Type three numbers separated by semicolons, e.g. 2; -1; 3');
      return;
    }
    setTries(prev => prev + 1);
    const ok = parts.every((v, i) => v === targetPoint[i]);
    if (ok) {
      setScore(prev => prev + 1);
      setStreak(prev => prev + 1);
      setMessage('✓ Correct! Great job.');
      setTimeout(generateNewPoint, 1000);
    } else {
      setStreak(0);
      const wrong = ['x', 'y', 'z'].filter((_, i) => parts[i] !== targetPoint[i]);
      setMessage(`Not yet: check coordinate ${wrong.join(', ')}. Rotate view to see box.`);
    }
  };

  return (
    <div className="lab">
      <div className="ctrl">
        <p style={{ margin: 0, fontSize: '15px' }}>
          Read the coordinates of the red point in space and type them as x; y; z.
        </p>

        <div>
          <label>Your answer</label>
          <input
            type="text"
            value={userGuess}
            placeholder="e.g. 2; 3; 1"
            onChange={e => setUserGuess(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleCheck()}
          />
        </div>

        <div className="row">
          <button type="button" className="btn solid" onClick={handleCheck}>
            Check
          </button>
          <button type="button" className="btn" onClick={generateNewPoint}>
            New point
          </button>
        </div>

        <label style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <input
            type="checkbox"
            checked={showGuide}
            onChange={e => setShowGuide(e.target.checked)}
          />
          Show coordinate box
        </label>

        <div className="out">
          <div className="row" style={{ gap: '18px' }}>
            <div>
              <div className="eyebrow">Score</div>
              <div className="big mono">
                {score} / {tries}
              </div>
            </div>
            <div>
              <div className="eyebrow">Streak</div>
              <div className="big mono">{streak}</div>
            </div>
          </div>
          {message && <p style={{ margin: '8px 0 0' }}>{message}</p>}
        </div>
      </div>

      <div className="canvases">
        <canvas ref={cvRef} style={{ height: '420px' }} />
        <div className="row" style={{ marginTop: '6px' }}>
          <button type="button" className="btn" onClick={() => scRef.current?.reset()}>
            Reset view
          </button>
        </div>
      </div>
    </div>
  );
};
