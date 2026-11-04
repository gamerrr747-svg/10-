import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Scene3D } from '../engine/scene3d';
import { parseLine, evalLines, sceneItems } from '../engine/figEngine';
import { bboxOf, axes, Vec3 } from '../engine/v3';
import { LangCode, figLabel, t } from '../data/translations';
import curriculumData from '../data/curriculumData.json';
import { ChevronLeft, ChevronRight, RotateCcw, Compass, Eye, EyeOff } from 'lucide-react';

interface GeometryFigureProps {
  figKey: string;
  height?: number;
  allSteps?: boolean;
  step?: number;
  onStepChange?: (step: number) => void;
  lang?: LangCode;
  onOpenInStudio?: (code: string, axesOn: boolean) => void;
}

export const GeometryFigure: React.FC<GeometryFigureProps> = ({
  figKey,
  height = 300,
  allSteps = false,
  step: controlledStep,
  onStepChange,
  lang = 'kz',
  onOpenInStudio,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const sceneRef = useRef<Scene3D | null>(null);
  const [reveal, setReveal] = useState(false);

  const rawSrc = useMemo(() => {
    return (curriculumData.figs as Record<string, string>)[figKey] || '';
  }, [figKey]);

  const { parsedLines, options, maxStep } = useMemo(() => {
    const lines = rawSrc.split('\n');
    const opts = { axes: false, grid: false, yaw: -0.45, pitch: 0.36, zoom: 1 };
    const P: any[] = [];
    lines.forEach(l => {
      const trimmed = l.trim();
      if (trimmed.startsWith('#')) {
        const [k, ...a] = trimmed.slice(1).split(/\s+/);
        if (k === 'axes') opts.axes = true;
        if (k === 'grid') opts.grid = true;
        if (k === 'view') {
          opts.yaw = +a[0];
          opts.pitch = +a[1];
        }
        if (k === 'zoom') opts.zoom = +a[0];
        return;
      }
      if (trimmed) {
        const pl = parseLine(l);
        pl.label = figLabel(lang, pl.label);
        P.push(pl);
      }
    });
    const maxS = Math.max(0, ...P.map(p => p.step));
    return { parsedLines: P, options: opts, maxStep: maxS };
  }, [rawSrc, lang]);

  const [internalStep, setInternalStep] = useState(allSteps ? maxStep : 0);
  const currentStep = controlledStep !== undefined ? controlledStep : internalStep;

  const ev = useMemo(() => evalLines(parsedLines), [parsedLines]);

  const full = useMemo(() => {
    return sceneItems(parsedLines, ev, { step: Infinity, L: 6 });
  }, [parsedLines, ev]);

  const computedMetrics = useMemo(() => {
    if (options.axes) {
      const ptsWithOrigin = full.pts.concat([[0, 0, 0]]);
      const L = Math.max(3, Math.ceil(Math.max(...ptsWithOrigin.flat().map(Math.abs), 2) + 0.5));
      return {
        center: [0, 0, 0] as Vec3,
        scale: (0.42 / L) * options.zoom,
        L,
        unit: 1,
      };
    } else {
      const bb = bboxOf(full.pts);
      return {
        center: bb.c,
        scale: (0.43 / bb.r) * options.zoom,
        L: 6,
        unit: bb.r / 3,
      };
    }
  }, [full.pts, options.axes, options.zoom]);

  useEffect(() => {
    if (!canvasRef.current) return;
    const sc = new Scene3D(canvasRef.current, {
      yaw: options.yaw,
      pitch: options.pitch,
      h: height,
      center: computedMetrics.center,
      scale: computedMetrics.scale,
    });
    sceneRef.current = sc;

    return () => {
      sc.destroy();
    };
  }, [options.yaw, options.pitch, height, computedMetrics.center, computedMetrics.scale]);

  const renderedScene = useMemo(() => {
    return sceneItems(parsedLines, ev, {
      step: currentStep,
      reveal,
      L: computedMetrics.L,
      unit: computedMetrics.unit,
    });
  }, [parsedLines, ev, currentStep, reveal, computedMetrics.L, computedMetrics.unit]);

  useEffect(() => {
    if (!sceneRef.current) return;
    let items = renderedScene.items;
    if (options.axes) {
      items = axes(computedMetrics.L, computedMetrics.L <= 7).concat(items);
    }
    sceneRef.current.render(items);
  }, [renderedScene, options.axes, computedMetrics.L]);

  const handleStepChange = (newStep: number) => {
    const clamped = Math.max(0, Math.min(maxStep, newStep));
    setInternalStep(clamped);
    onStepChange?.(clamped);
  };

  const handleReset = () => {
    sceneRef.current?.reset();
  };

  const handleOpenStudio = () => {
    const code = parsedLines.map(p => p.raw).join('\n');
    if (onOpenInStudio) {
      onOpenInStudio(code, options.axes);
    } else {
      window.location.hash = 'studio';
    }
  };

  const givens = renderedScene.legend.filter(x => x.kind === 'given');
  const finds = renderedScene.legend.filter(x => x.kind === 'find');

  if (!rawSrc) {
    return null;
  }

  return (
    <div className="fig">
      <canvas ref={canvasRef} style={{ height: `${height}px` }} />
      <div className="fig-bar">
        {maxStep > 0 && (
          <>
            <button
              type="button"
              className="fbtn flex items-center justify-center p-1.5"
              onClick={() => handleStepChange(currentStep - 1)}
              aria-label="Previous step"
              disabled={currentStep <= 0}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="fstep font-mono text-xs font-semibold">
              {currentStep
                ? `${t(lang, 'step')} ${currentStep} / ${maxStep}`
                : `${t(lang, 'given0')} · ${maxStep} ${t(lang, 'steps')}`}
            </span>
            <button
              type="button"
              className="fbtn flex items-center justify-center p-1.5"
              onClick={() => handleStepChange(currentStep + 1)}
              aria-label="Next step"
              disabled={currentStep >= maxStep}
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </>
        )}
        <button
          type="button"
          className={`fbtn inline-flex items-center gap-1.5 ${reveal ? 'on' : ''}`}
          onClick={() => setReveal(!reveal)}
        >
          {reveal ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
          <span>{reveal ? t(lang, 'hide') : t(lang, 'show')}</span>
        </button>
        <button
          type="button"
          className="fbtn p-1.5"
          onClick={handleReset}
          title={t(lang, 'reset')}
        >
          <RotateCcw className="w-3.5 h-3.5" />
        </button>
        <button
          type="button"
          className="fbtn inline-flex items-center gap-1 ml-auto text-blue-600 font-semibold"
          onClick={handleOpenStudio}
          title={t(lang, 'studio')}
        >
          <Compass className="w-3.5 h-3.5" />
          <span>{t(lang, 'studio')} ↗</span>
        </button>
      </div>

      <div className="fig-legend">
        {givens.length > 0 && (
          <>
            <span className="lg-given">{t(lang, 'Given')}</span>
            {givens.map((item, idx) => (
              <span key={idx} className="lg-item">
                {item.text}
              </span>
            ))}
          </>
        )}
        {finds.length > 0 && (
          <>
            <span className="lg-find">{t(lang, 'Find')}</span>
            {finds.map((item, idx) => (
              <span key={idx} className="lg-item">
                {reveal && item.val ? (
                  item.text.includes('?') ? (
                    item.text.replace('?', ` ${item.val} `)
                  ) : (
                    <>
                      {item.text} = <b>{item.val}</b>
                    </>
                  )
                ) : (
                  item.text
                )}
              </span>
            ))}
          </>
        )}
      </div>
    </div>
  );
};
