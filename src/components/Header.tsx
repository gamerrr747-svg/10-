import React, { useEffect, useRef } from 'react';
import { LangCode, LANGS, t } from '../data/translations';
import { Scene3D } from '../engine/scene3d';
import { boxV, CUBE_F, COL } from '../engine/v3';
import { Box, Compass, Sparkles } from 'lucide-react';

interface HeaderProps {
  term: 't2' | 't3';
  setTerm: (term: 't2' | 't3') => void;
  lang: LangCode;
  setLang: (lang: LangCode) => void;
  onOpenStudio: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  term,
  setTerm,
  lang,
  setLang,
  onOpenStudio,
}) => {
  const heroCvRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const cv = heroCvRef.current;
    if (!cv) return;
    const sc = new Scene3D(cv, {
      yaw: -0.5,
      pitch: 0.4,
      h: 175,
      scale: 0.32,
      center: [0.5, 0.5, 0.5],
    });
    const V = boxV(1, 1, 1);
    sc.render([
      { t: 'solid', V, F: CUBE_F, c: '#1e293b', w: 1.8, fill: 'rgba(37,99,235,.06)' },
      { t: 'poly', p: [V[4], V[1], V[3]], fill: 'rgba(217,119,6,.32)', stroke: '#d97706' },
      { t: 'seg', a: V[0], b: [1 / 3, 1 / 3, 1 / 3], c: '#d97706', w: 2.8 },
      { t: 'pt', p: [1 / 3, 1 / 3, 1 / 3], r: 3.5, c: '#d97706' },
    ]);

    let animId: number;
    const run = !window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const loop = () => {
      if (run && document.visibilityState === 'visible') {
        sc.yaw -= 0.0035;
        sc.render();
      }
      animId = requestAnimationFrame(loop);
    };
    animId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(animId);
      sc.destroy();
    };
  }, []);

  const titles = {
    t2: {
      badge: lang === 'kz' ? '2-ТОҚСАН · СТЕРЕОМЕТРИЯ' : lang === 'ru' ? '2 ЧЕТВЕРТЬ · СТЕРЕОМЕТРИЯ' : 'TERM 2 · STEREOMETRY',
      title: lang === 'kz' ? 'Кеңістіктегі перпендикулярлық' : lang === 'ru' ? 'Перпендикулярность в пространстве' : 'Perpendicularity in space',
      sub:
        lang === 'kz'
          ? '16 интерактивті сабақ, БЖБ 2 және ТЖБ 2. «Геометрия 10» оқулығына және үлестірме материалдарға негізделген кешенді зертхана.'
          : lang === 'ru'
          ? '16 интерактивных уроков, СОР 2 и СОЧ 2. На основе учебника «Геометрия 10» и раздаточных материалов.'
          : '16 interactive lessons, SAU 2 and SAT 2. Built on Geometry 10 and classroom worksheets.',
    },
    t3: {
      badge: lang === 'kz' ? '3-ТОҚСАН · ВЕКТОРЛАР МЕН КООРДИНАТАЛАР' : lang === 'ru' ? '3 ЧЕТВЕРТЬ · КООРДИНАТЫ И ВЕКТОРЫ' : 'TERM 3 · COORDINATES & VECTORS',
      title: lang === 'kz' ? 'Кеңістіктегі координаталар мен векторлар' : lang === 'ru' ? 'Координаты и векторы в пространстве' : 'Space in coordinates and vectors',
      sub:
        lang === 'kz'
          ? '20 интерактивті сабақ, БЖБ 3, БЖБ 4 және ТЖБ 3. Декарттық координаттар, векторлар скаляр көбейтіндісі және жазықтық теңдеулері.'
          : lang === 'ru'
          ? '20 уроков, СОР 3, СОР 4 и СОЧ 3. Декартова система координат, скалярное произведение и уравнения плоскостей.'
          : '20 lessons, SAU 3, SAU 4 and SAT 3. Cartesian coordinate system, dot products and plane equations.',
    },
  };

  const currentInfo = titles[term];

  return (
    <header className="top">
      <div className="wrap">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="eyebrow">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              {currentInfo.badge}
            </span>
          </div>

          <h1>{currentInfo.title}</h1>
          <p className="sub">{currentInfo.sub}</p>

          <div className="swrow">
            {/* Term segmented switcher */}
            <nav className="termsw" aria-label="Term Selector">
              <button
                type="button"
                aria-pressed={term === 't2'}
                onClick={() => setTerm('t2')}
                className="flex items-center gap-2"
              >
                <Box className="w-4 h-4 opacity-80" />
                {t(lang, 'term2')}
              </button>
              <button
                type="button"
                aria-pressed={term === 't3'}
                onClick={() => setTerm('t3')}
                className="flex items-center gap-2"
              >
                <Compass className="w-4 h-4 opacity-80" />
                {t(lang, 'term3')}
              </button>
            </nav>

            {/* Language switcher */}
            <nav className="termsw langsw" aria-label="Language Selector">
              {LANGS.map(([k, s, n]) => (
                <button
                  key={k}
                  type="button"
                  aria-pressed={lang === k}
                  title={n}
                  onClick={() => setLang(k)}
                >
                  {s}
                </button>
              ))}
            </nav>

            {/* Quick 3D Studio Shortcut button */}
            <button
              type="button"
              className="btn blue ml-auto text-xs py-1.5 px-3"
              onClick={onOpenStudio}
              title={t(lang, 'openStudio')}
            >
              <Compass className="w-3.5 h-3.5" />
              <span>3D Студия ↗</span>
            </button>
          </div>
        </div>

        {/* 3D Interactive Hero Canvas */}
        <div className="relative group flex flex-col items-center">
          <canvas
            ref={heroCvRef}
            id="heroCv"
            title={t(lang, 'heroTip')}
            onDoubleClick={onOpenStudio}
            aria-label="3D geometric cube"
          />
          <span className="text-[11px] text-slate-400 mt-1 font-mono tracking-tight group-hover:text-blue-600 transition-colors">
            ↻ Айналдыру · 2 рет басып студияны ашу
          </span>
        </div>
      </div>
    </header>
  );
};
