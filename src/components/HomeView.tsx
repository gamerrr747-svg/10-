import React, { useState, useMemo } from 'react';
import { LangCode, t } from '../data/translations';
import { GeometryFigure } from './GeometryFigure';
import { 
  Play, 
  Compass, 
  Layers, 
  BookOpen, 
  FileCheck2, 
  Search, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight,
  Calculator,
  RotateCw
} from 'lucide-react';

interface HomeViewProps {
  term: 't2' | 't3';
  termData: any;
  assessData: any[];
  cycleData: any[];
  taughtSet: Set<string>;
  onSelectLesson: (k: number) => void;
  onOpenStudio: () => void;
  onSelectAssess: (id: string) => void;
  lang: LangCode;
}

export const HomeView: React.FC<HomeViewProps> = ({
  term,
  termData,
  assessData,
  cycleData,
  taughtSet,
  onSelectLesson,
  onOpenStudio,
  onSelectAssess,
  lang,
}) => {
  const lessons: any[] = termData.lessons || [];
  const units: any[] = termData.units || [];
  const glossary: Record<string, [string, string]> = termData.glossary || {};

  const [searchTerm, setSearchTerm] = useState('');

  const doneCount = lessons.filter(l => taughtSet.has(`${term}-${l.k}`)).length;
  const progressPercent = Math.round((doneCount / (lessons.length || 1)) * 100);
  const nextLesson = lessons.find(l => !taughtSet.has(`${term}-${l.k}`)) || lessons[0];

  // Filtered glossary
  const filteredGlossary = useMemo(() => {
    if (!searchTerm.trim()) return Object.entries(glossary);
    const q = searchTerm.toLowerCase();
    return Object.entries(glossary).filter(([en, [kz, ru]]) => 
      en.toLowerCase().includes(q) || kz.toLowerCase().includes(q) || ru.toLowerCase().includes(q)
    );
  }, [glossary, searchTerm]);

  return (
    <div className="space-y-8">
      {/* Informational language banner if Term 3 in Kazakh */}
      {lang !== 'en' && term === 't3' && (
        <div className="sasbar langnote">
          <span className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            {t(lang, 'enOnly')}
          </span>
        </div>
      )}

      {/* Hero 2-column showcase */}
      <div className="hero2">
        <div className="flex flex-col justify-between z-10">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700 tracking-wide font-mono">
                <Sparkles className="w-3.5 h-3.5" />
                {termData.eyebrow}
              </span>
            </div>

            <h2>{termData.ovTitle}</h2>
            <p className="lead mt-3">{termData.ovLead}</p>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-3 my-5 max-w-md">
              <div className="bg-white/80 backdrop-blur-sm border border-slate-200/80 rounded-xl p-3 text-center shadow-xs">
                <div className="text-xl font-extrabold text-slate-900 font-mono tabular-nums">{lessons.length}</div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">Сабақ</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm border border-slate-200/80 rounded-xl p-3 text-center shadow-xs">
                <div className="text-xl font-extrabold text-blue-600 font-mono tabular-nums">9</div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">3D Зертхана</div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm border border-slate-200/80 rounded-xl p-3 text-center shadow-xs">
                <div className="text-xl font-extrabold text-emerald-600 font-mono tabular-nums">
                  {doneCount}/{lessons.length}
                </div>
                <div className="text-xs text-slate-500 font-medium mt-0.5">Өтілді ({progressPercent}%)</div>
              </div>
            </div>

            {/* Progress bar */}
            <div className="max-w-md">
              <div className="flex justify-between items-center text-xs font-semibold font-mono text-slate-500 mb-1">
                <span>{t(lang, 'taughtOf', doneCount, lessons.length)}</span>
                <span className="text-emerald-700">{progressPercent}%</span>
              </div>
              <div className="progress">
                <i style={{ width: `${progressPercent}%` }} />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="cont">
            {nextLesson && (
              <button
                type="button"
                className="btn solid flex items-center gap-2 px-5 py-2.5 text-base shadow-md"
                onClick={() => onSelectLesson(nextLesson.k)}
              >
                <Play className="w-4 h-4 fill-white" />
                <span>
                  {t(lang, 'cont')}: {nextLesson.k}. {nextLesson.title}
                </span>
                <ArrowRight className="w-4 h-4 opacity-80" />
              </button>
            )}
            <button 
              type="button" 
              className="btn flex items-center gap-2" 
              onClick={onOpenStudio}
            >
              <Compass className="w-4 h-4 text-blue-600" />
              <span>{t(lang, 'openStudio')}</span>
            </button>
          </div>
        </div>

        {/* Hero 3D interactive figure */}
        <div className="flex flex-col items-center justify-center">
          {termData.heroFig && (
            <div className="w-full bg-white rounded-2xl p-2.5 border border-slate-200/80 shadow-sm relative group">
              <div className="absolute top-4 left-4 z-10 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-white/90 backdrop-blur-sm border border-slate-200 text-xs font-semibold text-slate-700 shadow-xs">
                <RotateCw className="w-3.5 h-3.5 text-blue-600 animate-spin-slow" />
                <span>Интерактивті 3D модель</span>
              </div>
              <GeometryFigure
                figKey={termData.heroFig}
                height={350}
                allSteps={true}
                lang={lang}
              />
              <div className="text-center text-xs text-slate-400 font-mono mt-1">
                Курсормен сүйреп айналдырыңыз · масштабтау үшін дөңгелекті айналдырыңыз
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4 Feature Spotlight Bento Cards */}
      <div>
        <h3 className="section-title">{t(lang, 'f1t')} & Ресурстар</h3>
        <div className="feat">
          <button
            type="button"
            onClick={() => nextLesson && onSelectLesson(nextLesson.k)}
            className="group"
          >
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <BookOpen className="w-5 h-5" />
            </div>
            <b>{t(lang, 'f1t')}</b>
            <span>{t(lang, 'f1')}</span>
          </button>

          <button type="button" onClick={onOpenStudio} className="group">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <Compass className="w-5 h-5" />
            </div>
            <b>{t(lang, 'studio')}</b>
            <span>{t(lang, 'f2')}</span>
          </button>

          <button
            type="button"
            onClick={() => nextLesson && onSelectLesson(nextLesson.k)}
            className="group"
          >
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <Layers className="w-5 h-5" />
            </div>
            <b>{t(lang, 'f3t')}</b>
            <span>{t(lang, 'f3')}</span>
          </button>

          <button
            type="button"
            onClick={() => nextLesson && onSelectLesson(nextLesson.k)}
            className="group"
          >
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <b>{t(lang, 'f4t')}</b>
            <span>{t(lang, 'f4')}</span>
          </button>
        </div>
      </div>

      {/* Curriculum Units Grid */}
      <div>
        <h3 className="section-title">Оқу бөлімдері (Курс модульдері)</h3>
        <div className="units">
          {units.map(u => {
            const unitLessons = lessons.filter(l => l.unit === u.id);
            const firstK = unitLessons[0]?.k;
            const lastK = unitLessons[unitLessons.length - 1]?.k;
            const sau = u.sau && assessData.find(a => a.id === u.sau);

            return (
              <div
                key={u.id}
                className="ucard bg-white border border-slate-200/90 hover:border-blue-500 shadow-xs hover:shadow-md transition-all"
              >
                <div className="flex items-center justify-between">
                  <span 
                    className="meta font-mono font-bold text-xs uppercase px-2.5 py-1 rounded-md"
                    style={{ backgroundColor: `${u.color}15`, color: u.color }}
                  >
                    {u.code} · {t(lang, 'nLessons', unitLessons.length)}
                  </span>
                  <span className="text-xs font-mono text-slate-400">
                    № {firstK}–{lastK} сабақтар
                  </span>
                </div>

                <h3>{u.name}</h3>
                <p className="text-slate-600">{u.big}</p>

                <ul className="space-y-1.5 text-slate-600 my-2">
                  {u.goals?.map((g: string, i: number) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-blue-600 font-bold">•</span>
                      <span>{g}</span>
                    </li>
                  ))}
                </ul>

                <div className="row pt-2 mt-auto border-t border-slate-100">
                  {firstK && (
                    <button
                      type="button"
                      className="btn solid text-xs py-1.5 px-3"
                      onClick={() => onSelectLesson(firstK)}
                    >
                      <span>{t(lang, 'startUnit')}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  )}
                  {sau && (
                    <button
                      type="button"
                      className="btn blue text-xs py-1.5 px-3"
                      onClick={() => onSelectAssess(sau.id)}
                    >
                      <FileCheck2 className="w-3.5 h-3.5" />
                      <span>{sau.short}</span>
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6-Stage Lesson Cycle Visualization */}
      <div>
        <h3 className="section-title">{t(lang, 'howRuns')}</h3>
        <div className="cycle">
          {cycleData.map((c, i) => (
            <div key={i} className="hover:bg-blue-50/40 transition-colors">
              <b>{String(i + 1).padStart(2, '0')} · {c[0]}</b>
              <h4>{c[1]}</h4>
              <p>{c[2]}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Lesson Plan Matrix */}
      <div>
        <h3 className="section-title">{t(lang, 'plan')}</h3>
        <div className="tbl shadow-xs">
          <table className="plan">
            <thead>
              <tr>
                <th className="w-20">{t(lang, 'no')}</th>
                <th>{t(lang, 'lesson')}</th>
                <th>{t(lang, 'objectives')}</th>
                <th className="w-32">{t(lang, 'textbook')}</th>
                <th className="w-16 text-center">Күйі</th>
              </tr>
            </thead>
            <tbody>
              {lessons.map(l => {
                const isTaught = taughtSet.has(`${term}-${l.k}`);
                return (
                  <tr
                    key={l.k}
                    onClick={() => onSelectLesson(l.k)}
                    className="hover:bg-blue-50/50 transition-colors cursor-pointer"
                  >
                    <td>
                      <span className="font-mono font-bold text-slate-500">
                        {l.k}
                      </span>
                      <span className="text-slate-400 text-xs ml-1">/ {l.n}</span>
                    </td>
                    <td>
                      <div className="font-semibold text-slate-900 flex items-center gap-2">
                        <span>{l.title}</span>
                        {(l.sas || l.sat) && (
                          <span className="chip dark text-[10px] py-0.5 px-1.5">
                            {l.sas || l.sat}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="text-xs font-mono text-slate-600">
                      {(l.obj || []).map((o: string) => o.split(' ')[0]).join(', ')}
                    </td>
                    <td className="text-xs text-slate-500 font-mono">
                      {l.book ? l.book.pages : '—'}
                    </td>
                    <td className="text-center">
                      {isTaught ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 inline" />
                      ) : (
                        <span className="text-slate-300">○</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Trilingual Interactive Glossary */}
      <div>
        <div className="flex flex-wrap items-center justify-between gap-4 mb-3">
          <h3 className="section-title m-0">{t(lang, 'glossary')} (Үштілді терминдер)</h3>
          
          {/* Quick Search */}
          <div className="relative w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Терминді іздеу (қаз, eng, рус)..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-sm bg-white border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        <div className="tbl shadow-xs">
          <table className="plan gloss">
            <thead>
              <tr>
                <th className="w-1/3 text-blue-700">Қазақша</th>
                <th className="w-1/3 text-slate-700">English</th>
                <th className="w-1/3 text-slate-700">Русский</th>
              </tr>
            </thead>
            <tbody>
              {filteredGlossary.map(([enWord, [kzWord, ruWord]]) => (
                <tr key={enWord}>
                  <td className="font-semibold text-slate-900">{kzWord}</td>
                  <td className="font-mono text-blue-600">{enWord}</td>
                  <td className="text-slate-600">{ruWord}</td>
                </tr>
              ))}
              {filteredGlossary.length === 0 && (
                <tr>
                  <td colSpan={3} className="text-center py-6 text-slate-400 font-mono">
                    «{searchTerm}» бойынша терминдер табылмады
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
