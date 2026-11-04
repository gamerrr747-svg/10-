import React, { useState, useEffect, useRef } from 'react';
import { LangCode, t } from '../data/translations';
import { Scene3D } from '../engine/scene3d';
import {
  SCENES,
  ST_COL,
  fmtV,
  fmtNum,
  fmtPlane,
  polyArea,
  solidMeasures,
  boxSection,
  clipLine,
} from '../engine/studioEngine';
import {
  parseLine,
  evalLines,
  sceneItems,
  ParsedLine,
} from '../engine/figEngine';
import { axes, V3, fmtN } from '../engine/v3';

interface StudioRow {
  text: string;
  color: string;
  hidden: boolean;
  min: number | null;
  max: number | null;
  play: boolean;
  dir?: number;
}

interface StudioViewProps {
  initialScene?: string;
  initialCustomCode?: string;
  initialAxes?: boolean;
  lang: LangCode;
}

export const StudioView: React.FC<StudioViewProps> = ({
  initialScene = 'tp',
  initialCustomCode,
  initialAxes = true,
  lang,
}) => {
  const [selectedScene, setSelectedScene] = useState<string>(
    initialCustomCode ? 'custom' : initialScene
  );
  const [rows, setRows] = useState<StudioRow[]>(() => {
    if (initialCustomCode) {
      return initialCustomCode
        .split('\n')
        .filter(t => t.trim())
        .map((text, i) => ({
          text,
          color: ST_COL[i % ST_COL.length],
          hidden: false,
          min: null,
          max: null,
          play: false,
        }));
    }
    const sceneLines = (SCENES[initialScene] || SCENES.tp)[1].split('\n');
    return sceneLines.map((text, i) => ({
      text,
      color: ST_COL[i % ST_COL.length],
      hidden: false,
      min: null,
      max: null,
      play: false,
    }));
  });

  const [showAxes, setShowAxes] = useState(initialAxes);
  const [showGrid, setShowGrid] = useState(true);
  const [isSpinning, setIsSpinning] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sceneRef = useRef<Scene3D | null>(null);
  const rafRef = useRef<number | null>(null);

  // Load a new preset scene
  const handleLoadScene = (id: string) => {
    setSelectedScene(id);
    const scene = SCENES[id] || SCENES.tp;
    const newRows = scene[1].split('\n').map((text, i) => ({
      text,
      color: ST_COL[i % ST_COL.length],
      hidden: false,
      min: null,
      max: null,
      play: false,
    }));
    setRows(newRows);
  };

  // Evaluate rows
  const parsedLines: ParsedLine[] = rows.map(r => {
    const p = parseLine(r.text);
    if (r.hidden) p.style.add('hide');
    return p;
  });

  const ev = evalLines(parsedLines);

  // Compute bounding scale
  const pre = sceneItems(parsedLines, ev, { L: 6 });
  let maxCoord = 4;
  pre.pts.forEach(p =>
    p.forEach(x => {
      if (isFinite(x)) maxCoord = Math.max(maxCoord, Math.abs(x));
    })
  );
  const currentL = Math.min(30, Math.ceil(maxCoord + 0.5));

  // Initialize Scene3D
  useEffect(() => {
    if (!canvasRef.current) return;
    const sc = new Scene3D(canvasRef.current, {
      scale: 0.44 / currentL,
      yaw: -0.75,
      pitch: 0.38,
      h: 540,
    });
    sceneRef.current = sc;

    return () => {
      sc.destroy();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  // Render to canvas
  const renderCanvas = () => {
    if (!sceneRef.current) return;
    const it: any[] = [];
    if (showGrid) {
      for (let k = -currentL; k <= currentL; k++) {
        it.push(
          { t: 'seg', a: [k, -currentL, 0], b: [k, currentL, 0], c: '#e3e9f2', w: 1 },
          { t: 'seg', a: [-currentL, k, 0], b: [currentL, k, 0], c: '#e3e9f2', w: 1 }
        );
      }
    }
    if (showAxes) {
      it.push(...axes(currentL, currentL <= 8));
    }

    const r = sceneItems(parsedLines, ev, {
      rainbow: true,
      colors: rows.map(x => x.color),
      L: currentL,
      reveal: true,
    });

    sceneRef.current.scale = 0.44 / currentL;
    sceneRef.current.render(it.concat(r.items));
  };

  useEffect(() => {
    renderCanvas();
  }, [rows, showAxes, showGrid, currentL]);

  // Tick animation loop for sliders and spin
  useEffect(() => {
    const hasPlay = rows.some(r => r.play);
    if (!hasPlay && !isSpinning) {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      return;
    }

    const tick = () => {
      if (isSpinning && sceneRef.current) {
        sceneRef.current.yaw -= 0.006;
      }

      if (hasPlay) {
        setRows(prevRows =>
          prevRows.map((r, i) => {
            if (!r.play) return r;
            const a = ev.an[i];
            if (!a || a.kind !== 'def') return r;
            let val = +ev.env[a.name] || 0;
            const min = r.min ?? (val >= 0 && val <= 10 ? 0 : Math.floor(val - 10));
            const max = r.max ?? (val >= 0 && val <= 10 ? 10 : Math.ceil(val + 10));
            const step = (max - min) / 240;
            let dir = r.dir || 1;
            val += step * dir;
            if (val > max) {
              val = max;
              dir = -1;
            }
            if (val < min) {
              val = min;
              dir = 1;
            }
            return {
              ...r,
              text: `${a.name} = ${+val.toFixed(3)}`,
              dir,
            };
          })
        );
      } else {
        renderCanvas();
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [rows, isSpinning]);

  const handleRowChange = (index: number, newText: string) => {
    setRows(prev =>
      prev.map((r, idx) => (idx === index ? { ...r, text: newText, min: null, max: null } : r))
    );
  };

  const handleAddRow = () => {
    setRows(prev => [
      ...prev,
      {
        text: '',
        color: ST_COL[prev.length % ST_COL.length],
        hidden: false,
        min: null,
        max: null,
        play: false,
      },
    ]);
  };

  const handleClear = () => {
    setRows([
      {
        text: '',
        color: ST_COL[0],
        hidden: false,
        min: null,
        max: null,
        play: false,
      },
    ]);
  };

  const handleCopyAll = () => {
    const text = rows.map(r => r.text).join('\n');
    navigator.clipboard?.writeText(text).then(() => {
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 1500);
    });
  };

  const handleDeleteRow = (index: number) => {
    setRows(prev => {
      const next = prev.filter((_, idx) => idx !== index);
      return next.length > 0
        ? next
        : [
            {
              text: '',
              color: ST_COL[0],
              hidden: false,
              min: null,
              max: null,
              play: false,
            },
          ];
    });
  };

  const handleToggleRowHidden = (index: number) => {
    setRows(prev =>
      prev.map((r, idx) => (idx === index ? { ...r, hidden: !r.hidden } : r))
    );
  };

  const handleSliderChange = (index: number, varName: string, val: number) => {
    setRows(prev =>
      prev.map((r, idx) => (idx === index ? { ...r, text: `${varName} = ${val}` } : r))
    );
  };

  const handleTogglePlay = (index: number) => {
    setRows(prev =>
      prev.map((r, idx) => (idx === index ? { ...r, play: !r.play } : r))
    );
  };

  return (
    <div>
      <div className="view-head">
        <div className="eyebrow">{t(lang, 'tools')} · 3D</div>
        <h2>{t(lang, 'studio')}</h2>
        <p className="lead">{t(lang, 'studioLead')}</p>
      </div>

      <div className="studio">
        <div className="st-left">
          <div className="row" style={{ gap: '6px' }}>
            <select
              id="stScene"
              value={selectedScene}
              onChange={e => handleLoadScene(e.target.value)}
              aria-label="Scene"
            >
              {selectedScene === 'custom' && (
                <option value="custom">Figure from a lesson</option>
              )}
              {Object.entries(SCENES).map(([k, v]) => (
                <option key={k} value={k}>
                  {v[0]}
                </option>
              ))}
            </select>
          </div>

          <div className="st-list" id="stList">
            {rows.map((row, i) => {
              const v = ev.res[i];
              const a = ev.an[i];
              let infoText = '';
              let isErr = false;

              if (v instanceof Error) {
                infoText = v.message;
                isErr = true;
              } else if (a?.kind === 'def' && a.slider) {
                infoText = '';
              } else if (typeof v === 'number') {
                const isAng = a.ast && a.ast.op === 'call' && a.ast.f === 'angle';
                infoText = isAng ? `= ${fmtN(v, 2)}°` : `= ${fmtNum(v)}`;
              } else if (v && v.k === 'pt') {
                infoText = fmtV(v.v);
              } else if (v && v.k === 'vec') {
                infoText = `${fmtV(v.v)}, |v| = ${fmtNum(V3.len(v.v))}`;
              } else if (v && v.k === 'seg') {
                infoText = `length ${fmtNum(V3.len(V3.sub(v.b, v.a)))}`;
              } else if (v && (v.k === 'line' || v.k === 'ray')) {
                infoText = `direction ${fmtV(v.d)}`;
              } else if (v && v.k === 'plane') {
                infoText = fmtPlane(v.eq || [...v.n, V3.dot(v.n, v.p)]);
              } else if (v && v.k === 'surf') {
                infoText = 'surface z = f(x, y)';
              } else if (v && v.k === 'curve') {
                infoText = 'curve';
              } else if (v && v.k === 'poly') {
                infoText = `area ${fmtNum(polyArea(v.pts))}`;
              } else if (v && v.k === 'solid') {
                const m = solidMeasures(v.V, v.F);
                infoText = `V = ${fmtNum(m.vol)}, S = ${fmtNum(m.area)}`;
              } else if (v && v.k === 'sphere') {
                infoText = `r = ${fmtN(v.r, 3)}, V = ${fmtN((4 / 3) * Math.PI * v.r ** 3, 3)}`;
              } else if (v && v.k === 'circle') {
                infoText = `r = ${fmtN(v.r, 3)}`;
              }

              const isSlider = a?.kind === 'def' && a.slider && typeof v === 'number';
              const sMin = row.min ?? (v >= 0 && v <= 10 ? 0 : Math.floor(v - 10));
              const sMax = row.max ?? (v >= 0 && v <= 10 ? 10 : Math.ceil(v + 10));

              return (
                <div key={i} className="st-row" data-i={i}>
                  <button
                    type="button"
                    className="st-dot"
                    title="Show or hide"
                    style={{
                      backgroundColor: row.hidden ? 'transparent' : row.color,
                      borderColor: row.color,
                    }}
                    onClick={() => handleToggleRowHidden(i)}
                  />

                  <div className="st-main">
                    <input
                      className="st-in mono"
                      type="text"
                      value={row.text}
                      onChange={e => handleRowChange(i, e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleAddRow();
                        }
                      }}
                      spellCheck={false}
                      aria-label={`Expression ${i + 1}`}
                    />
                    {infoText && (
                      <div className={`st-info ${isErr ? 'err' : ''}`}>{infoText}</div>
                    )}

                    {isSlider && (
                      <div className="st-sl">
                        <input
                          type="number"
                          className="st-mm"
                          value={sMin}
                          onChange={e =>
                            setRows(prev =>
                              prev.map((r, idx) =>
                                idx === i ? { ...r, min: +e.target.value } : r
                              )
                            )
                          }
                          aria-label="Minimum"
                        />
                        <input
                          type="range"
                          min={sMin}
                          max={sMax}
                          step={(sMax - sMin) / 200}
                          value={v}
                          onChange={e =>
                            handleSliderChange(i, a.name, +(+e.target.value).toFixed(3))
                          }
                          aria-label={a.name}
                        />
                        <input
                          type="number"
                          className="st-mm"
                          value={sMax}
                          onChange={e =>
                            setRows(prev =>
                              prev.map((r, idx) =>
                                idx === i ? { ...r, max: +e.target.value } : r
                              )
                            )
                          }
                          aria-label="Maximum"
                        />
                        <button
                          type="button"
                          className="st-play"
                          title="Animate"
                          onClick={() => handleTogglePlay(i)}
                        >
                          {row.play ? '❚❚' : '▶'}
                        </button>
                      </div>
                    )}
                  </div>

                  <button
                    type="button"
                    className="st-del"
                    title="Delete"
                    aria-label="Delete line"
                    onClick={() => handleDeleteRow(i)}
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>

          <div className="row" style={{ gap: '6px' }}>
            <button type="button" className="btn" onClick={handleAddRow}>
              + Add line
            </button>
            <button type="button" className="btn" onClick={handleClear}>
              Clear
            </button>
            <button type="button" className="btn" onClick={handleCopyAll}>
              {copyFeedback ? 'Copied ✓' : 'Copy all'}
            </button>
          </div>

          <details className="st-help">
            <summary>What can I type?</summary>
            <table className="dtable" style={{ marginTop: '8px' }}>
              <tbody>
                <tr>
                  <td>A = (1, 2, 3)</td>
                  <td>point</td>
                </tr>
                <tr>
                  <td>a = 4</td>
                  <td>number with a slider</td>
                </tr>
                <tr>
                  <td>segment(A, B), line(A, B), ray(A, B)</td>
                  <td>lines</td>
                </tr>
                <tr>
                  <td>vector(A, B), vector(1, 2, 0)</td>
                  <td>vectors</td>
                </tr>
                <tr>
                  <td>polygon(A, B, C, …)</td>
                  <td>flat figure</td>
                </tr>
                <tr>
                  <td>plane(A, B, C), 2x + y − z = 3</td>
                  <td>planes</td>
                </tr>
                <tr>
                  <td>cube(a), box(a, b, c), cuboid(P, Q)</td>
                  <td>boxes</td>
                </tr>
                <tr>
                  <td>tetra(A, B, C, D), pyramid(A, B, C, D, S), octahedron(r)</td>
                  <td>solids</td>
                </tr>
                <tr>
                  <td>sphere(O, r), circle(O, r, n)</td>
                  <td>round shapes</td>
                </tr>
                <tr>
                  <td>curve((cos(t), sin(t), t), t, 0, 6), z = sin(x)*y</td>
                  <td>curves and surfaces</td>
                </tr>
                <tr>
                  <td>dist(X, Y), angle(A, B, C), angle(X, Y)</td>
                  <td>measure</td>
                </tr>
                <tr>
                  <td>mid, proj, commonperp, len, dot, cross, det, area, volume, guide</td>
                  <td>tools</td>
                </tr>
              </tbody>
            </table>
            <p style={{ marginTop: '8px' }}>
              Angles are in degrees; inside sin and cos write <span className="mono">t*deg</span> for degrees.
              Press Enter for a new line.
            </p>
          </details>
        </div>

        <div className="st-right">
          <canvas ref={canvasRef} id="stCv" style={{ height: '540px' }} />
          <div className="row" style={{ marginTop: '8px', gap: '6px' }}>
            <button
              type="button"
              className="btn"
              onClick={() => sceneRef.current?.reset()}
            >
              Reset view
            </button>
            <button
              type="button"
              className="btn"
              onClick={() => {
                if (sceneRef.current) {
                  sceneRef.current.zoom = Math.min(3, sceneRef.current.zoom * 1.15);
                  renderCanvas();
                }
              }}
            >
              ＋
            </button>
            <button
              type="button"
              className="btn"
              onClick={() => {
                if (sceneRef.current) {
                  sceneRef.current.zoom = Math.max(0.4, sceneRef.current.zoom / 1.15);
                  renderCanvas();
                }
              }}
            >
              －
            </button>
            <button
              type="button"
              className="btn"
              onClick={() => {
                if (sceneRef.current) {
                  sceneRef.current.yaw = 0;
                  sceneRef.current.pitch = 1.45;
                  renderCanvas();
                }
              }}
            >
              Top
            </button>
            <button
              type="button"
              className="btn"
              onClick={() => {
                if (sceneRef.current) {
                  sceneRef.current.yaw = 0;
                  sceneRef.current.pitch = 0;
                  renderCanvas();
                }
              }}
            >
              Front
            </button>

            <label className="st-tg">
              <input
                type="checkbox"
                checked={showAxes}
                onChange={e => setShowAxes(e.target.checked)}
              />{' '}
              Axes
            </label>
            <label className="st-tg">
              <input
                type="checkbox"
                checked={showGrid}
                onChange={e => setShowGrid(e.target.checked)}
              />{' '}
              Grid
            </label>
            <label className="st-tg">
              <input
                type="checkbox"
                checked={isSpinning}
                onChange={e => setIsSpinning(e.target.checked)}
              />{' '}
              Spin
            </label>
          </div>
        </div>
      </div>
    </div>
  );
};
