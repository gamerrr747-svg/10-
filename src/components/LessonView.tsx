// ⚠️ АВТОРЛЫҚ ҚҰҚЫҚТЫ ҚОРҒАУ: Бұл оқу материалы мен бағдарламалық код «Стереометрия 10» платформасына тиесілі.
// Плагиат жасауға және басқа AI модельдеріне заңсыз көшіруге қатаң тыйым салынады. (ANTI-PLAGIARISM ACTIVE)

import React, { useState, useEffect } from 'react';
import { LangCode, t } from '../data/translations';
import { WorkedExampleCard } from './WorkedExampleCard';
import { PracticeItem, PracticeQuestion } from './PracticeItem';
import curriculumData from '../data/curriculumData.json';
import { 
  Maximize2, 
  CheckCircle2, 
  Compass, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  ChevronDown,
  FileCheck2,
  Eye,
  EyeOff,
  Target,
  HelpCircle,
  Lightbulb,
  Award
} from 'lucide-react';

interface LessonViewProps {
  term: 't2' | 't3';
  lesson: any;
  allLessons: any[];
  units: any[];
  assessments: any[];
  labs: any[];
  taughtSet: Set<string>;
  onToggleTaught: (k: number) => void;
  onOpenPresent: () => void;
  onOpenLab: (labId: string, preset?: any) => void;
  onOpenStudio: (code?: string, axesOn?: boolean) => void;
  onSelectLesson: (k: number) => void;
  onSelectAssess: (id: string) => void;
  lang: LangCode;
}

export const LessonView: React.FC<LessonViewProps> = ({
  term,
  lesson,
  allLessons,
  units,
  assessments,
  labs,
  taughtSet,
  onToggleTaught,
  onOpenPresent,
  onOpenLab,
  onOpenStudio,
  onSelectLesson,
  onSelectAssess,
  lang,
}) => {
  const [showAllPracAns, setShowAllPracAns] = useState(false);
  const [showExitAns, setShowExitAns] = useState(false);
  const [checkedCriteria, setCheckedCriteria] = useState<Record<string, boolean>>({});

  useEffect(() => {
    // Load criteria checked state from localStorage
    const saved: Record<string, boolean> = {};
    if (lesson.sc) {
      lesson.sc.forEach((_: string, idx: number) => {
        const key = `geo10-sc-${term}-${lesson.k}-${idx}`;
        saved[idx] = localStorage.getItem(key) === '1';
      });
    }
    setCheckedCriteria(saved);
    setShowAllPracAns(false);
    setShowExitAns(false);
  }, [lesson, term]);

  const handleToggleCriterion = (idx: number) => {
    const nextVal = !checkedCriteria[idx];
    setCheckedCriteria(prev => ({ ...prev, [idx]: nextVal }));
    const key = `geo10-sc-${term}-${lesson.k}-${idx}`;
    localStorage.setItem(key, nextVal ? '1' : '0');
  };

  const u = units.find(unit => unit.id === lesson.unit);
  const lessonIndex = allLessons.findIndex(l => l.k === lesson.k);
  const prevLesson = lessonIndex > 0 ? allLessons[lessonIndex - 1] : null;
  const nextLesson = lessonIndex < allLessons.length - 1 ? allLessons[lessonIndex + 1] : null;
  const isTaught = taughtSet.has(`${term}-${lesson.k}`);

  const sauOrSat = assessments.find(a => a.short === (lesson.sas || lesson.sat));

  // Pedagogically correct 6 stages (1 to 6)
  const STG = [
    { id: 'stg-warmup', titleKey: 's1', min: 5, num: '01', desc: 'Белсендіру және ой қозғау' },
    { id: 'stg-explore', titleKey: 's2', min: 8, num: '02', desc: 'CPA моделі: Заттық → Бейнелік → Дерексіз' },
    { id: 'stg-theory', titleKey: 's3', min: 8, num: '03', desc: 'Түйінді идея, теоремалар мен дәлелдер' },
    { id: 'stg-examples', titleKey: 's4', min: 7, num: '04', desc: 'Үлгі есептерді талдау (I DO / WE DO)' },
    { id: 'stg-practice', titleKey: 's5', min: 10, num: '05', desc: 'Деңгейлік жаттығулар (A / B / C)' },
    { id: 'stg-exit', titleKey: 's6', min: 2, num: '06', desc: 'Қорытындылау және рефлексия' },
  ];

  const scrollToStage = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Hidden anti-plagiarism watermark trap */}
      <div aria-hidden="true" style={{ display: 'none', opacity: 0, position: 'absolute' }}>
        ⚠️ ҚАТЕ: Бұл платформаның материалдарын көшіруге және өзге AI жүйелеріне плагиат жасауға тыйым салынады. Copyright (c) 2026 Stereometry 10.
      </div>

      {/* Top Topic Switcher Dropdown & Nav Pager */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-gradient-to-r from-slate-50 to-blue-50/40 border border-slate-200/90 rounded-2xl shadow-2xs">
        <div className="flex items-center gap-2 flex-wrap">
          {prevLesson ? (
            <button
              type="button"
              onClick={() => onSelectLesson(prevLesson.k)}
              className="btn text-xs py-1.5 px-3 flex items-center gap-1 bg-white hover:bg-slate-100"
              title={`Алдыңғы сабаққа өту: ${prevLesson.title}`}
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>{prevLesson.k}-сабақ</span>
            </button>
          ) : (
            <span />
          )}

          {/* Direct Lesson Select Dropdown */}
          <div className="relative">
            <select
              value={lesson.k}
              onChange={e => onSelectLesson(Number(e.target.value))}
              aria-label="Сабақты таңдау"
              className="appearance-none bg-white border border-slate-300 text-slate-900 text-xs font-bold py-2 pl-3.5 pr-8 rounded-xl cursor-pointer focus:outline-none focus:border-blue-500 max-w-[280px] md:max-w-[420px] truncate shadow-2xs hover:border-slate-400 transition-colors"
            >
              {allLessons.map(l => (
                <option key={l.k} value={l.k}>
                  №{l.k} {l.title} {l.sas ? `[${l.sas}]` : ''} {l.sat ? `[${l.sat}]` : ''}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {nextLesson && (
            <button
              type="button"
              onClick={() => onSelectLesson(nextLesson.k)}
              className="btn text-xs py-1.5 px-3 flex items-center gap-1 bg-white hover:bg-slate-100"
              title={`Келесі сабаққа өту: ${nextLesson.title}`}
            >
              <span>{nextLesson.k}-сабақ</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 ml-auto text-xs font-mono font-bold text-blue-700 bg-blue-100/60 px-3 py-1 rounded-lg">
          {u ? `${u.code} · ${u.name}` : ''}
        </div>
      </div>

      {/* Summative assessment banner */}
      {sauOrSat && (
        <div className="sasbar">
          <span className="flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-amber-300" />
            <span
              dangerouslySetInnerHTML={{
                __html: t(
                  lang,
                  'sasIn',
                  sauOrSat.short,
                  sauOrSat.time?.replace('min', t(lang, 'min')) || ''
                ),
              }}
            />
            {lesson.sas && <span className="ml-1 opacity-90">{t(lang, 'sasRun')}</span>}
          </span>
          <button
            type="button"
            className="btn"
            style={{ color: '#fde047', borderColor: '#fde047', background: 'transparent' }}
            onClick={() => onSelectAssess(sauOrSat.id)}
          >
            {t(lang, 'openPaper', sauOrSat.short)} →
          </button>
        </div>
      )}

      {/* Lesson View Main Header */}
      <div className="view-head">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="eyebrow">
            {t(lang, 'lessonOf', lesson.k, allLessons.length)} ·{' '}
            {u ? `${u.code} ${u.name}` : t(lang, 'closure')} ·{' '}
            {t(lang, 'yearNo', lesson.n)}
          </div>
          {isTaught && (
            <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 shadow-2xs">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Өтілді (Орындалды)
            </span>
          )}
        </div>

        <h2 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
          {lesson.title}
        </h2>

        {/* Objectives Chips (No Textbook references) */}
        <div className="chips my-2">
          {(lesson.obj || []).map((o: string, idx: number) => (
            <span key={idx} className="chip bg-blue-50 text-blue-700 border border-blue-200/80 font-mono text-xs font-bold px-2.5 py-1 rounded-lg" title={o}>
              🎯 {o.split(' ')[0]}
            </span>
          ))}
          {u && (
            <span className="chip dark text-xs font-mono px-2.5 py-1">
              Бөлім: {u.code}
            </span>
          )}
        </div>

        {lesson.aim && (
          <p className="lead text-slate-700 text-base md:text-lg leading-relaxed mt-1">
            {lesson.aim}
          </p>
        )}

        {/* Action Toolbar */}
        <div className="lessonbar flex flex-wrap items-center gap-2.5 mt-3 pt-2 border-t border-slate-100">
          <button 
            type="button" 
            className="btn solid flex items-center gap-2 px-4 py-2 shadow-xs"
            onClick={onOpenPresent}
          >
            <Maximize2 className="w-4 h-4" />
            <span>{t(lang, 'present')} (Проектор)</span>
          </button>

          <button
            type="button"
            className={`btn flex items-center gap-1.5 px-3.5 py-2 ${isTaught ? 'bg-emerald-600 text-white border-emerald-600 hover:bg-emerald-700' : ''}`}
            onClick={() => onToggleTaught(lesson.k)}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isTaught ? t(lang, 'taught') : t(lang, 'markTaught')}</span>
          </button>

          {lesson.scene && (
            <button
              type="button"
              className="btn flex items-center gap-1.5 px-3 py-2 text-slate-700 hover:border-blue-400"
              onClick={() => onOpenStudio(undefined, false)}
            >
              <Compass className="w-4 h-4 text-blue-600" />
              <span>3D Студияда зерттеу</span>
            </button>
          )}

          <div className="ml-auto text-xs font-mono text-slate-400">
            {lesson.k} / {allLessons.length} сабақ
          </div>
        </div>

        {/* 6-Stage Quick Jump Strip */}
        <div className="flex items-center gap-2 overflow-x-auto py-2.5 px-1 mt-3 border-y border-slate-100 text-xs font-semibold">
          <span className="text-slate-400 text-[11px] font-mono mr-1 shrink-0 font-bold">САБАҚ КЕЗЕҢДЕРІ:</span>
          {STG.map(st => (
            <button
              key={st.id}
              type="button"
              onClick={() => scrollToStage(st.id)}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-blue-100 hover:text-blue-700 text-slate-700 whitespace-nowrap transition-colors flex items-center gap-1.5 shrink-0"
            >
              <span className="font-mono font-bold text-blue-600">{st.num}.</span>
              <span>{t(lang, st.titleKey)}</span>
              <span className="text-[10px] text-slate-400">({st.min}м)</span>
            </button>
          ))}
        </div>
      </div>

      <div className="cols">
        <div className="flow space-y-6">
          {/* Stage 1: Warm-up */}
          <section id="stg-warmup" className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs scroll-mt-24">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <span className="font-mono text-xs font-bold text-white bg-blue-600 px-2.5 py-1 rounded-md">
                  01-КЕЗЕҢ
                </span>
                <h3 className="text-xl font-bold text-slate-900 m-0">
                  {t(lang, STG[0].titleKey)}
                </h3>
              </div>
              <span className="text-xs font-mono font-semibold text-slate-400">
                {STG[0].min} минут
              </span>
            </div>
            <div className="text-slate-800 text-base leading-relaxed bg-blue-50/40 p-4 rounded-xl border border-blue-100/60" dangerouslySetInnerHTML={{ __html: lesson.hook }} />
          </section>

          {/* Stage 2: Explore CPA */}
          {lesson.cpa && (
            <section id="stg-explore" className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs scroll-mt-24">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-bold text-white bg-emerald-600 px-2.5 py-1 rounded-md">
                    02-КЕЗЕҢ
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 m-0">
                    {t(lang, STG[1].titleKey)}
                  </h3>
                </div>
                <span className="text-xs font-mono font-semibold text-slate-400">
                  {STG[1].min} минут
                </span>
              </div>

              <div className="cpa">
                <div className="c border-t-4 border-t-emerald-500">
                  <h5>{t(lang, 'concrete')}</h5>
                  <p dangerouslySetInnerHTML={{ __html: lesson.cpa[0] }} />
                </div>
                <div className="p border-t-4 border-t-blue-500">
                  <h5>{t(lang, 'pictorial')}</h5>
                  <p dangerouslySetInnerHTML={{ __html: lesson.cpa[1] }} />
                </div>
                <div className="a border-t-4 border-t-rose-500">
                  <h5>{t(lang, 'abstract')}</h5>
                  <p dangerouslySetInnerHTML={{ __html: lesson.cpa[2] }} />
                </div>
              </div>

              {lesson.lab && (
                <div className="row mt-4 pt-3 border-t border-slate-100 flex items-center gap-3">
                  <button
                    type="button"
                    className="btn blue flex items-center gap-2"
                    onClick={() => onOpenLab(lesson.lab.id, lesson.lab.p)}
                  >
                    <Compass className="w-4 h-4 text-blue-600" />
                    <span>
                      {t(
                        lang,
                        'openIn',
                        labs.find(x => x.id === lesson.lab.id)?.name || lesson.lab.id
                      )}
                    </span>
                  </button>
                  {lesson.lab.note && (
                    <span className="text-slate-500 text-sm">
                      {lesson.lab.note}
                    </span>
                  )}
                </div>
              )}
            </section>
          )}

          {/* Stage 3: Key Theory & Proof (Formalise) */}
          {lesson.key && (
            <section id="stg-theory" className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs scroll-mt-24">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-bold text-white bg-indigo-600 px-2.5 py-1 rounded-md">
                    03-КЕЗЕҢ
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 m-0">
                    {t(lang, STG[2].titleKey)}
                  </h3>
                </div>
                <span className="text-xs font-mono font-semibold text-slate-400">
                  {STG[2].min} минут
                </span>
              </div>

              <div
                className="key text-base md:text-lg leading-relaxed shadow-2xs"
                dangerouslySetInnerHTML={{ __html: lesson.key }}
              />
              {lesson.keyNote && (
                <div className="mt-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-700 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: lesson.keyNote }} />
              )}
            </section>
          )}

          {/* Stage 4: Worked Examples */}
          {lesson.ex && lesson.ex.length > 0 && (
            <section id="stg-examples" className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs scroll-mt-24">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-bold text-white bg-amber-600 px-2.5 py-1 rounded-md">
                    04-КЕЗЕҢ
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 m-0">
                    {t(lang, STG[3].titleKey)}
                  </h3>
                </div>
                <span className="text-xs font-mono font-semibold text-slate-400">
                  {STG[3].min} минут
                </span>
              </div>

              <div className="space-y-4">
                {lesson.ex.map((e: any, j: number) => (
                  <WorkedExampleCard
                    key={j}
                    example={e}
                    index={j}
                    lang={lang}
                    onOpenInStudio={code => onOpenStudio(code)}
                  />
                ))}
              </div>
            </section>
          )}

          {/* Stage 5: Practice (A / B / C Tiers) */}
          {lesson.prac && (
            <section id="stg-practice" className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs scroll-mt-24">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-bold text-white bg-purple-600 px-2.5 py-1 rounded-md">
                    05-КЕЗЕҢ
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 m-0">
                    {t(lang, STG[4].titleKey)}
                  </h3>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    className="fbtn inline-flex items-center gap-1.5"
                    onClick={() => setShowAllPracAns(!showAllPracAns)}
                  >
                    {showAllPracAns ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{showAllPracAns ? t(lang, 'hideAns') : t(lang, 'showAllAns')}</span>
                  </button>
                  <span className="text-xs font-mono font-semibold text-slate-400">
                    {STG[4].min} минут
                  </span>
                </div>
              </div>

              <div className={`tiers ${showAllPracAns ? 'show-ans' : ''}`}>
                {/* Tier A: Fluency */}
                <div className="tier border-t-4 border-t-blue-500 bg-slate-50/40">
                  <h5 className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-blue-700 font-bold flex items-center gap-1.5">
                      <Target className="w-4 h-4" />
                      А деңгейі: {t(lang, 'fluency')}
                    </span>
                    <i className="text-xs text-slate-400">барлық оқушылар үшін</i>
                  </h5>
                  <ol className="list-decimal pl-4 space-y-2 mt-3">
                    {lesson.prac[0]?.map((item: PracticeQuestion, idx: number) => (
                      <PracticeItem
                        key={idx}
                        item={item}
                        lang={lang}
                        showAnsGlobally={showAllPracAns}
                        onOpenInStudio={code => onOpenStudio(code)}
                      />
                    ))}
                  </ol>
                </div>

                {/* Tier B: Reasoning */}
                <div className="tier border-t-4 border-t-emerald-500 bg-slate-50/40">
                  <h5 className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-emerald-700 font-bold flex items-center gap-1.5">
                      <Lightbulb className="w-4 h-4" />
                      В деңгейі: {t(lang, 'reasoning')}
                    </span>
                    <i className="text-xs text-slate-400">көпшілік оқушылар үшін</i>
                  </h5>
                  <ol className="list-decimal pl-4 space-y-2 mt-3">
                    {lesson.prac[1]?.map((item: PracticeQuestion, idx: number) => (
                      <PracticeItem
                        key={idx}
                        item={item}
                        lang={lang}
                        showAnsGlobally={showAllPracAns}
                        onOpenInStudio={code => onOpenStudio(code)}
                      />
                    ))}
                  </ol>
                </div>

                {/* Tier C: Challenge */}
                <div className="tier border-t-4 border-t-purple-500 bg-slate-50/40">
                  <h5 className="flex items-center justify-between pb-2 border-b border-slate-100">
                    <span className="text-purple-700 font-bold flex items-center gap-1.5">
                      <Award className="w-4 h-4" />
                      С деңгейі: {t(lang, 'challenge')}
                    </span>
                    <i className="text-xs text-slate-400">ізденушілерге арналған</i>
                  </h5>
                  <ol className="list-decimal pl-4 space-y-2 mt-3">
                    {lesson.prac[2]?.map((item: PracticeQuestion, idx: number) => (
                      <PracticeItem
                        key={idx}
                        item={item}
                        lang={lang}
                        showAnsGlobally={showAllPracAns}
                        onOpenInStudio={code => onOpenStudio(code)}
                      />
                    ))}
                  </ol>
                </div>
              </div>
            </section>
          )}

          {/* Stage 6: Exit Ticket & Reflection */}
          {lesson.exit && (
            <section id="stg-exit" className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs scroll-mt-24">
              <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-bold text-white bg-rose-600 px-2.5 py-1 rounded-md">
                    06-КЕЗЕҢ
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 m-0">
                    {t(lang, STG[5].titleKey)}
                  </h3>
                </div>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    className="fbtn inline-flex items-center gap-1.5"
                    onClick={() => setShowExitAns(!showExitAns)}
                  >
                    {showExitAns ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{showExitAns ? t(lang, 'hideAns') : t(lang, 'showAns')}</span>
                  </button>
                  <span className="text-xs font-mono font-semibold text-slate-400">
                    {STG[5].min} минут
                  </span>
                </div>
              </div>

              <ol className={`exit-list list-decimal pl-4 space-y-2 ${showExitAns ? 'show-ans' : ''}`}>
                {lesson.exit.map((item: PracticeQuestion, idx: number) => (
                  <PracticeItem
                    key={idx}
                    item={item}
                    lang={lang}
                    showAnsGlobally={showExitAns}
                    onOpenInStudio={code => onOpenStudio(code)}
                  />
                ))}
              </ol>

              <div className="mt-4 p-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-800 text-sm">
                <b className="text-blue-700">Ой-толғаныс сұрағы:</b>{' '}
                {lesson.reflect || t(lang, 'reflectDef')}
              </div>
            </section>
          )}

          {/* Homework */}
          {lesson.hw && (
            <section className="bg-amber-50/40 border border-amber-200 rounded-2xl p-5">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-mono text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                  {lang === 'en' ? 'HOMEWORK' : lang === 'kz' ? 'ҮЙ ТАПСЫРМАСЫ' : 'ДОМАШНЕЕ ЗАДАНИЕ'}
                </span>
              </div>
              <div className="text-slate-800 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: lesson.hw }} />
            </section>
          )}
        </div>

        {/* Right Sidebar widgets: ONLY Learning Objectives & Success Criteria (No Textbook pages) */}
        <div className="aside space-y-4">
          {/* Learning Objectives Box (Prominent) */}
          {lesson.obj && lesson.obj.length > 0 && (
            <div className="box border-blue-200 bg-blue-50/20">
              <h4 className="text-blue-800 flex items-center gap-1.5">
                <Target className="w-4 h-4 text-blue-600" />
                <span>{t(lang, 'lo')} (Оқу мақсаттары)</span>
              </h4>
              <ul className="space-y-2 text-sm text-slate-800">
                {lesson.obj.map((o: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">•</span>
                    <span>{o}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Success Criteria Box with Checkboxes */}
          {lesson.sc && lesson.sc.length > 0 && (
            <div className="box checks border-emerald-200 bg-emerald-50/20">
              <h4 className="text-emerald-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>{t(lang, 'sc')} (Табыс критерийлері)</span>
              </h4>
              {lesson.sc.map((c: string, j: number) => (
                <label key={j} className="text-sm text-slate-800 hover:text-slate-900">
                  <input
                    type="checkbox"
                    checked={!!checkedCriteria[j]}
                    onChange={() => handleToggleCriterion(j)}
                    className="accent-emerald-600 w-4 h-4 rounded mt-0.5"
                  />
                  <span dangerouslySetInnerHTML={{ __html: c }} />
                </label>
              ))}
            </div>
          )}

          {/* Key Terminology in 3 Languages */}
          {lesson.vocab && lesson.vocab.length > 0 && (
            <div className="box">
              <h4>{t(lang, 'terms')}</h4>
              <table className="vocab text-xs">
                <thead>
                  <tr className="text-slate-400 border-b border-slate-100">
                    <th className="text-left pb-1">ҚАЗ</th>
                    <th className="text-left pb-1">ENG</th>
                    <th className="text-left pb-1">РУС</th>
                  </tr>
                </thead>
                <tbody>
                  {lesson.vocab.map((w: string, idx: number) => {
                    const g = (curriculumData.glossary as Record<string, string[]>)[w] || ['', ''];
                    return (
                      <tr key={idx}>
                        <td className="font-semibold text-slate-900 py-1">{g[0]}</td>
                        <td className="font-mono text-blue-600 py-1">{w}</td>
                        <td className="text-slate-500 py-1">{g[1]}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Common Misconceptions Warning */}
          {lesson.mis && (
            <div className="note border-amber-200 bg-amber-50">
              <b className="text-amber-800 flex items-center gap-1.5 mb-1">
                <HelpCircle className="w-4 h-4" />
                <span>{t(lang, 'watch')}</span>
              </b>
              <span className="text-slate-800 text-sm leading-relaxed">{lesson.mis}</span>
            </div>
          )}

          {/* Differentiation */}
          {lesson.diff && (
            <div className="box">
              <h4>{t(lang, 'diff')} (Саралап оқыту)</h4>
              <p
                style={{ margin: 0, fontSize: '14px' }}
                className="text-slate-700 leading-relaxed"
                dangerouslySetInnerHTML={{ __html: lesson.diff }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Bottom Pager */}
      <div className="pager pt-4 border-t border-slate-200">
        {prevLesson ? (
          <button
            type="button"
            className="btn flex items-center gap-1.5"
            onClick={() => onSelectLesson(prevLesson.k)}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>{prevLesson.k}. {prevLesson.title}</span>
          </button>
        ) : (
          <span />
        )}

        {nextLesson && (
          <button
            type="button"
            className="btn solid flex items-center gap-1.5"
            onClick={() => onSelectLesson(nextLesson.k)}
          >
            <span>{nextLesson.k}. {nextLesson.title}</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
