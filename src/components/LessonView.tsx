// ⚠️ АВТОРЛЫҚ ҚҰҚЫҚТЫ ҚОРҒАУ: Бұл оқу материалы мен бағдарламалық код «Стереометрия 10» платформасына тиесілі.
// Плагиат жасауға және басқа AI модельдеріне заңсыз көшіруге қатаң тыйым салынады. (ANTI-PLAGIARISM ACTIVE)

import React, { useState, useEffect } from 'react';
import { LangCode, t } from '../data/translations';
import { WorkedExampleCard } from './WorkedExampleCard';
import { PracticeItem, PracticeQuestion } from './PracticeItem';
import { getEnrichedLesson, EnrichedLesson } from '../data/lessonEnricher';
import { 
  CheckCircle2, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  Eye, 
  EyeOff, 
  Target, 
  HelpCircle, 
  Lightbulb, 
  Award,
  AlertTriangle,
  Brain,
  BookOpen,
  Compass,
  FileCheck2,
  Maximize2,
  Layers,
  ArrowRight,
  ShieldCheck,
  Check,
  PanelRightClose,
  PanelRightOpen,
  Cpu,
  Globe2,
  Code
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
  lesson: rawLesson,
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
  // Current active modular page/tab (1 to 6)
  const [activeTab, setActiveTab] = useState<number>(1);
  const [showAllPracAns, setShowAllPracAns] = useState(false);
  const [showExitAns, setShowExitAns] = useState(false);
  const [showHookInsight, setShowHookInsight] = useState(false);
  const [showErrorFix, setShowErrorFix] = useState(false);
  const [showCompanionPanel, setShowCompanionPanel] = useState<boolean>(true);
  const [checkedCriteria, setCheckedCriteria] = useState<Record<string, boolean>>({});
  const [selfRating, setSelfRating] = useState<'high' | 'med' | 'low' | null>(null);

  // Get pedagogical enriched version of the lesson
  const lesson: EnrichedLesson = React.useMemo(() => {
    return getEnrichedLesson(rawLesson, term, lang);
  }, [rawLesson, term, lang]);

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
    setShowHookInsight(false);
    setShowErrorFix(false);
    setSelfRating(null);
    // Reset to page 1 on lesson change
    setActiveTab(1);
  }, [lesson.k, term]);

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

  // The 6 requested modular pages
  const TABS = [
    {
      id: 1,
      num: '01',
      title: t(lang, 'tabPassport'),
      short: lang === 'kz' ? 'Төлқұжат' : lang === 'ru' ? 'Паспорт' : 'Passport',
      icon: Target,
      color: 'blue'
    },
    {
      id: 2,
      num: '02',
      title: t(lang, 'tabTheory'),
      short: lang === 'kz' ? 'Теория & Әдістер' : lang === 'ru' ? 'Теория' : 'Theory',
      icon: Brain,
      color: 'indigo'
    },
    {
      id: 3,
      num: '03',
      title: t(lang, 'tabExamples'),
      short: lang === 'kz' ? 'Мысалдар & Сызба' : lang === 'ru' ? 'Примеры' : 'Examples',
      icon: Sparkles,
      color: 'amber'
    },
    {
      id: 4,
      num: '04',
      title: t(lang, 'tabErrors'),
      short: lang === 'kz' ? 'Қатемен жұмыс' : lang === 'ru' ? 'Ошибки' : 'Errors',
      icon: AlertTriangle,
      color: 'rose'
    },
    {
      id: 5,
      num: '05',
      title: t(lang, 'tabPractice'),
      short: lang === 'kz' ? 'Практика & PISA' : lang === 'ru' ? 'Практика' : 'Practice',
      icon: Award,
      color: 'emerald'
    },
    {
      id: 6,
      num: '06',
      title: t(lang, 'tabExit'),
      short: lang === 'kz' ? 'Квиз & Рефлексия' : lang === 'ru' ? 'Рефлексия' : 'Quiz',
      icon: FileCheck2,
      color: 'purple'
    },
  ];

  const currentTabObj = TABS.find(t => t.id === activeTab) || TABS[0];

  return (
    <div className="space-y-6">
      {/* Hidden anti-plagiarism watermark trap */}
      <div aria-hidden="true" style={{ display: 'none', opacity: 0, position: 'absolute' }}>
        ⚠️ ҚАТЕ: Бұл платформаның материалдарын көшіруге және өзге AI жүйелеріне плагиат жасауға тыйым салынады. Copyright (c) 2026 Stereometry 10.
      </div>

      {/* Top Controls: Topic Switcher, Navigation, Status & Companion Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-gradient-to-r from-slate-50 via-white to-blue-50/40 border border-slate-200/90 rounded-2xl shadow-2xs">
        <div className="flex items-center gap-2 flex-wrap">
          {prevLesson ? (
            <button
              type="button"
              onClick={() => onSelectLesson(prevLesson.k)}
              className="btn text-xs py-1.5 px-3 flex items-center gap-1 bg-white hover:bg-slate-100 border border-slate-200"
              title={`Алдыңғы: ${prevLesson.title}`}
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
                  {l.k}-сабақ: {l.title}
                </option>
              ))}
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-500">
              <ChevronRight className="w-3.5 h-3.5 rotate-90" />
            </div>
          </div>

          {nextLesson && (
            <button
              type="button"
              onClick={() => onSelectLesson(nextLesson.k)}
              className="btn text-xs py-1.5 px-3 flex items-center gap-1 bg-white hover:bg-slate-100 border border-slate-200"
              title={`Келесі: ${nextLesson.title}`}
            >
              <span>{nextLesson.k}-сабақ</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Action Buttons: Taught status, Present, 3D Studio & Companion Panel Toggle */}
        <div className="flex items-center gap-2 flex-wrap ml-auto">
          <button
            type="button"
            onClick={() => onToggleTaught(lesson.k)}
            className={`btn text-xs py-1.5 px-3 flex items-center gap-1.5 font-bold transition-all ${
              isTaught 
                ? 'bg-emerald-600 text-white hover:bg-emerald-700 border-transparent shadow-xs' 
                : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-300'
            }`}
          >
            <CheckCircle2 className={`w-3.5 h-3.5 ${isTaught ? 'text-white' : 'text-slate-400'}`} />
            <span>{isTaught ? t(lang, 'taught') : t(lang, 'markTaught')}</span>
          </button>

          <button
            type="button"
            onClick={onOpenPresent}
            className="btn text-xs py-1.5 px-3 flex items-center gap-1.5 bg-white hover:bg-slate-100 border border-slate-200"
            title={t(lang, 'present')}
          >
            <Maximize2 className="w-3.5 h-3.5 text-blue-600" />
            <span className="font-semibold">{t(lang, 'present')}</span>
          </button>

          {/* Toggle Right Companion Panel */}
          <button
            type="button"
            onClick={() => setShowCompanionPanel(prev => !prev)}
            className={`btn text-xs py-1.5 px-3 flex items-center gap-1.5 border transition-all ${
              showCompanionPanel
                ? 'bg-blue-50 text-blue-800 border-blue-300 font-bold'
                : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
            }`}
            title="Оң жақтағы назар аударыңыз, ескерту және терминдер панелін ашу/жабу"
          >
            {showCompanionPanel ? (
              <PanelRightClose className="w-3.5 h-3.5 text-blue-600" />
            ) : (
              <PanelRightOpen className="w-3.5 h-3.5 text-slate-500" />
            )}
            <span className="hidden sm:inline">{t(lang, 'togglePanel')}</span>
          </button>
        </div>
      </div>

      {/* Main Lesson Hero Card with Section Badge */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-blue-700 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              {u?.code || '10.2A'} · {lesson.k}-САБАҚ
            </span>
            {lesson.n && (
              <span className="text-xs font-mono text-slate-500">
                (Жылдық жоспар: №{lesson.n})
              </span>
            )}
          </div>
          {sauOrSat && (
            <button
              type="button"
              onClick={() => onSelectAssess(sauOrSat.id)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 px-3 py-1 rounded-full border border-amber-300 transition-colors"
            >
              <Award className="w-3.5 h-3.5 text-amber-600" />
              <span>{sauOrSat.short} бағалау жұмысы →</span>
            </button>
          )}
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
          {lesson.title}
        </h1>
        <p className="text-sm sm:text-base text-slate-600 font-medium leading-relaxed max-w-4xl">
          {lesson.aim}
        </p>
      </div>

      {/* Modular 6-Page Navigation Stepper Tabs */}
      <nav aria-label="Lesson Stages" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {TABS.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              aria-current={isActive ? 'step' : undefined}
              className={`flex flex-col text-left p-3 rounded-2xl border transition-all text-xs font-medium cursor-pointer relative ${
                isActive
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm ring-2 ring-blue-600/20'
                  : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50/80'
              }`}
            >
              <div className="flex items-center justify-between w-full mb-1.5">
                <span className={`font-mono font-extrabold text-[11px] px-1.5 py-0.5 rounded ${
                  isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                }`}>
                  {tab.num}
                </span>
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-400'}`} />
              </div>
              <span className={`font-bold tracking-tight line-clamp-1 ${isActive ? 'text-white' : 'text-slate-900'}`}>
                {tab.short}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Main Workspace Layout (Content + Collapsible Right Companion Panel) */}
      <div className={`grid gap-6 items-start ${showCompanionPanel ? 'lg:grid-cols-[minmax(0,1fr)_340px]' : 'grid-cols-1'}`}>
        
        {/* Main Modular Stage Container */}
        <div className="space-y-6">

          {/* PAGE 1: ТӨЛҚҰЖАТ ЖӘНЕ ҚҰНДЫЛЫҚТАР */}
          {activeTab === 1 && (
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-6 animate-fade-in">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
                <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-extrabold font-mono text-sm">
                  01
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    {t(lang, 'tabPassport')}
                  </h2>
                  <p className="text-xs text-slate-500">
                    Мемлекеттік стандарт оқу мақсаттары, жетістік критерийлері және мектеп құндылықтары
                  </p>
                </div>
              </div>

              {/* Official Learning Objectives */}
              <div className="p-4 bg-blue-50/50 border border-blue-200/70 rounded-xl space-y-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-900 flex items-center gap-1.5">
                  <Target className="w-3.5 h-3.5 text-blue-600" />
                  {t(lang, 'lo')}
                </span>
                <ul className="space-y-1.5">
                  {lesson.obj && lesson.obj.map((o: string, idx: number) => (
                    <li key={idx} className="text-sm font-semibold text-slate-800 flex items-start gap-2">
                      <span className="text-blue-600 font-bold mt-0.5">•</span>
                      <span>{o}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Core School Values */}
              <div className="space-y-2">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  {t(lang, 'valuesTitle')}
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                  {lesson.values && lesson.values.map((val: string, idx: number) => (
                    <div 
                      key={idx}
                      className="p-3 rounded-xl bg-gradient-to-br from-slate-50 to-emerald-50/40 border border-slate-200/90 text-center shadow-2xs hover:border-emerald-300 transition-colors"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-emerald-600 mx-auto mb-1" />
                      <span className="text-xs font-bold text-slate-800 line-clamp-2">
                        {val}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Interactive Success Criteria */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                    {t(lang, 'sc')}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    (Орындалуын белгілеңіз)
                  </span>
                </div>
                <div className="space-y-2">
                  {lesson.sc && lesson.sc.map((crit: string, idx: number) => {
                    const isChecked = !!checkedCriteria[idx];
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => handleToggleCriterion(idx)}
                        className={`w-full text-left p-3 rounded-xl border flex items-start gap-3 transition-all cursor-pointer ${
                          isChecked 
                            ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950 font-semibold' 
                            : 'bg-white border-slate-200 hover:border-slate-300 text-slate-700'
                        }`}
                      >
                        <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                          isChecked ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300 bg-white'
                        }`}>
                          {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                        </div>
                        <span className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: crit }} />
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Hook & Problem Inquiry */}
              <div className="p-4 bg-amber-50/60 border border-amber-200/80 rounded-xl space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                    <Lightbulb className="w-4 h-4 text-amber-600" />
                    Ой қозғау · Проблемалық жағдаят
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowHookInsight(prev => !prev)}
                    className="text-xs text-amber-800 hover:text-amber-900 font-bold underline cursor-pointer"
                  >
                    {showHookInsight ? 'Жасыру' : 'Ой бөлісу / Тұжырым →'}
                  </button>
                </div>
                <p className="text-sm font-semibold text-slate-900 leading-relaxed">
                  {lesson.hook}
                </p>
                {showHookInsight && (
                  <div className="p-3 bg-white/90 border border-amber-300/70 rounded-lg text-xs font-medium text-slate-800 leading-relaxed animate-fade-in">
                    💡 <b>Сабақ басындағы талқылау:</b> Оқушылар алдымен пайымдап, өз пікірлерін ұсынады. Содан кейін кеңістіктік геометриялық анықтаманың дәлдігіне көз жеткізеді.
                  </div>
                )}
              </div>

              {/* Bottom Stepper Advance Button */}
              <div className="pt-4 border-t border-slate-100 flex justify-end">
                <button
                  type="button"
                  onClick={() => setActiveTab(2)}
                  className="btn blue py-2 px-4 flex items-center gap-2 text-xs font-bold"
                >
                  <span>2-бет: Түйінді теория & Әдістерге өту</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* PAGE 2: ТҮЙІНДІ ТЕОРИЯ ЖӘНЕ ӘЛЕМДІК ӘДІСТЕР */}
          {activeTab === 2 && (
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-6 animate-fade-in">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-extrabold font-mono text-sm">
                    02
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      {t(lang, 'tabTheory')}
                    </h2>
                    <p className="text-xs text-slate-500">
                      Формулалар, теоремалар және халықаралық оқыту тәсілдері
                    </p>
                  </div>
                </div>

                {lesson.lab && (
                  <button
                    type="button"
                    onClick={() => onOpenLab(lesson.lab.id, lesson.lab.p)}
                    className="btn text-xs py-1.5 px-3 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200 flex items-center gap-1.5 font-bold"
                  >
                    <Compass className="w-3.5 h-3.5 text-indigo-600" />
                    <span>3D Зертхананы ашу ↗</span>
                  </button>
                )}
              </div>

              {/* Formal Mathematical Statement / Box */}
              <div className="p-5 bg-gradient-to-r from-blue-50/70 to-indigo-50/50 border-2 border-blue-200/90 rounded-2xl">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="w-4 h-4 text-blue-700" />
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-900">
                    Негізгі теорема мен математикалық қағида
                  </span>
                </div>
                <div 
                  className="math-content text-slate-900 font-medium leading-relaxed text-sm sm:text-base"
                  dangerouslySetInnerHTML={{ __html: lesson.key }}
                />
              </div>

              {/* World-Class Pedagogical Frameworks (Feynman, Dual Coding, CPA) */}
              <div className="space-y-4">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Globe2 className="w-3.5 h-3.5 text-blue-600" />
                  Әлемдік деңгейдегі түсіндіру әдістері
                </span>

                {/* 1. Feynman Technique */}
                {lesson.feynman && (
                  <div className="p-4 bg-emerald-50/50 border border-emerald-200/70 rounded-xl space-y-1.5">
                    <span className="text-xs font-mono font-bold text-emerald-900 flex items-center gap-1.5">
                      <Lightbulb className="w-3.5 h-3.5 text-emerald-600" />
                      {t(lang, 'feynmanTitle')}
                    </span>
                    <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                      {lesson.feynman}
                    </p>
                  </div>
                )}

                {/* 2. Dual Coding */}
                {lesson.dualCoding && (
                  <div className="p-4 bg-indigo-50/50 border border-indigo-200/70 rounded-xl space-y-1.5">
                    <span className="text-xs font-mono font-bold text-indigo-900 flex items-center gap-1.5">
                      <Layers className="w-3.5 h-3.5 text-indigo-600" />
                      {t(lang, 'dualCodingTitle')}
                    </span>
                    <p className="text-xs sm:text-sm text-slate-800 leading-relaxed font-medium">
                      {lesson.dualCoding}
                    </p>
                  </div>
                )}

                {/* 3. CPA Framework */}
                {lesson.cpaExplanation && (
                  <div className="p-4 bg-slate-50 border border-slate-200/90 rounded-xl space-y-1.5">
                    <span className="text-xs font-mono font-bold text-slate-800 flex items-center gap-1.5">
                      <Cpu className="w-3.5 h-3.5 text-slate-600" />
                      {t(lang, 'cpaTitle')}
                    </span>
                    <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                      {lesson.cpaExplanation}
                    </p>
                  </div>
                )}
              </div>

              {/* Navigation Stepper Bottom Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setActiveTab(1)}
                  className="btn py-2 px-3 text-xs flex items-center gap-1 bg-white hover:bg-slate-100 border border-slate-200"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>1-бет: Төлқұжат</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab(3)}
                  className="btn blue py-2 px-4 flex items-center gap-2 text-xs font-bold"
                >
                  <span>3-бет: Мысалдар мен сызбаларға өту</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* PAGE 3: МЫСАЛДАР МЕН СЫЗБАЛАР */}
          {activeTab === 3 && (
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-6 animate-fade-in">
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-extrabold font-mono text-sm">
                    03
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      {t(lang, 'tabExamples')}
                    </h2>
                    <p className="text-xs text-slate-500">
                      I DO (мұғалім моделі) және WE DO (бірге талдау) қадамдық сызбалары
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => onOpenStudio(undefined, true)}
                  className="btn text-xs py-1.5 px-3 bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-300 flex items-center gap-1.5 font-bold"
                >
                  <Compass className="w-3.5 h-3.5 text-amber-700" />
                  <span>3D Студияда ашу ↗</span>
                </button>
              </div>

              {/* Worked Example Cards */}
              <div className="space-y-4">
                {lesson.ex && lesson.ex.length > 0 ? (
                  lesson.ex.map((item: any, idx: number) => (
                    <WorkedExampleCard
                      key={idx}
                      example={item}
                      index={idx}
                      lang={lang}
                      onOpenInStudio={(code, axes) => onOpenStudio(code, axes)}
                      big={idx === 0}
                    />
                  ))
                ) : (
                  <div className="p-8 text-center text-slate-500 text-sm">
                    Бұл сабақ үшін негізгі мысалдар теориялық карталарда толық қамтылған.
                  </div>
                )}
              </div>

              {/* Navigation Stepper Bottom Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setActiveTab(2)}
                  className="btn py-2 px-3 text-xs flex items-center gap-1 bg-white hover:bg-slate-100 border border-slate-200"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>2-бет: Теория</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab(4)}
                  className="btn blue py-2 px-4 flex items-center gap-2 text-xs font-bold"
                >
                  <span>4-бет: Қатемен жұмысқа өту</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* PAGE 4: ҚАТЕМЕН ЖҰМЫС */}
          {activeTab === 4 && (
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-6 animate-fade-in">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
                <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-extrabold font-mono text-sm">
                  04
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    {t(lang, 'tabErrors')}
                  </h2>
                  <p className="text-xs text-slate-500">
                    Типтік жаңылыстарды талдау, себебін түсіну және дұрыс шешу дағдысы
                  </p>
                </div>
              </div>

              {/* Misconception 3-Block Card */}
              {lesson.misconceptions && (
                <div className="space-y-4">
                  {/* Block 1: Typical Misconception */}
                  <div className="p-4 bg-rose-50 border border-rose-200 rounded-xl space-y-1.5">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-900 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
                      {t(lang, 'misconceptionTitle')}
                    </span>
                    <p className="text-sm font-semibold text-rose-950 leading-relaxed">
                      ❌ {lesson.misconceptions.wrong}
                    </p>
                  </div>

                  {/* Block 2: Why it fails */}
                  <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl space-y-1.5">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                      <HelpCircle className="w-3.5 h-3.5 text-amber-600" />
                      {t(lang, 'whyWrongTitle')}
                    </span>
                    <p className="text-sm font-medium text-slate-800 leading-relaxed">
                      {lesson.misconceptions.why}
                    </p>
                  </div>

                  {/* Block 3: The Correct Way */}
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1.5">
                    <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      {t(lang, 'correctWayTitle')}
                    </span>
                    <p className="text-sm font-semibold text-emerald-950 leading-relaxed">
                      ✓ {lesson.misconceptions.correct}
                    </p>
                  </div>
                </div>
              )}

              {/* Interactive "Spot the Error" Challenge */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                    <Brain className="w-3.5 h-3.5 text-blue-600" />
                    Интерактивті жаттығу: «Қатені тап және түзет!»
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowErrorFix(prev => !prev)}
                    className="text-xs font-bold text-blue-700 hover:text-blue-900 underline cursor-pointer"
                  >
                    {showErrorFix ? 'Түсіндірмені жасыру' : 'Дұрыс жауабын тексеру →'}
                  </button>
                </div>
                <p className="text-sm font-medium text-slate-800 leading-relaxed">
                  Оқушы есеп шығару барысында: <i>«Берілген екі түзу жазықтықта қиылыспаса да, екеуі бірдей 90° жасап тұр, демек олар параллель»</i> деп қорытты. Оның тұжырымы дұрыс па?
                </p>
                {showErrorFix && (
                  <div className="p-3 bg-white border border-blue-200 rounded-lg text-xs font-medium text-slate-900 leading-relaxed animate-fade-in">
                    <b>Талдау:</b> Бұл пікір қате! Жазықтықта үшінші түзуге перпендикуляр екі түзу параллель болады. Ал 3D кеңістікте олар қиылысуы да, айқас болуы да мүмкін (мысалы, кубтың бір төбесінен шығатын екі қыры ортақ үшінші қырға перпендикуляр, бірақ өзара қиылысады).
                  </div>
                )}
              </div>

              {/* Navigation Stepper Bottom Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setActiveTab(3)}
                  className="btn py-2 px-3 text-xs flex items-center gap-1 bg-white hover:bg-slate-100 border border-slate-200"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>3-бет: Мысалдар</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab(5)}
                  className="btn blue py-2 px-4 flex items-center gap-2 text-xs font-bold"
                >
                  <span>5-бет: Практика & PISA-ға өту</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* PAGE 5: ТӘЖІРИБЕ ЖӘНЕ PISA ТАПСЫРМАЛАРЫ */}
          {activeTab === 5 && (
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-6 animate-fade-in">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-extrabold font-mono text-sm">
                    05
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      {t(lang, 'tabPractice')}
                    </h2>
                    <p className="text-xs text-slate-500">
                      Деңгейлік сараланған тапсырмалар (A, B, C) және өмірмен байланысты есептер
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowAllPracAns(prev => !prev)}
                  className="btn text-xs py-1.5 px-3 flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-800"
                >
                  {showAllPracAns ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showAllPracAns ? t(lang, 'hideAns') : t(lang, 'showAllAns')}</span>
                </button>
              </div>

              {/* Real-World / PISA Task Card */}
              {lesson.pisaTask && (
                <div className="p-4 bg-gradient-to-r from-emerald-50/70 to-teal-50/50 border border-emerald-300 rounded-xl space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-emerald-900 uppercase tracking-wider">
                    <Globe2 className="w-4 h-4 text-emerald-700" />
                    {t(lang, 'pisaTitle')}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 font-medium leading-relaxed">
                    <b>Контекст:</b> {lesson.pisaTask.context}
                  </p>
                  <p className="text-xs sm:text-sm text-slate-900 font-bold leading-relaxed">
                    <b>Сұрақ:</b> {lesson.pisaTask.question}
                  </p>
                  <div className="pt-2 border-t border-emerald-200/60 text-xs text-emerald-950 font-semibold">
                    <b>Шешімі:</b> {lesson.pisaTask.solution}
                  </div>
                </div>
              )}

              {/* Tiered Practice Problems (A, B, C) */}
              <div className="space-y-6">
                {lesson.prac && lesson.prac.length > 0 ? (
                  lesson.prac.map((tierList: any[], tIdx: number) => {
                    const tierName =
                      tIdx === 0
                        ? `A-деңгей · Есептеу дағдысы (${t(lang, 'fluency')})`
                        : tIdx === 1
                        ? `B-деңгей · Логикалық дәлелдеу (${t(lang, 'reasoning')})`
                        : `C-деңгей · Күрделі / Зерттеулік (${t(lang, 'challenge')})`;

                    const badgeColor =
                      tIdx === 0
                        ? 'bg-blue-100 text-blue-800 border-blue-200'
                        : tIdx === 1
                        ? 'bg-emerald-100 text-emerald-800 border-emerald-200'
                        : 'bg-rose-100 text-rose-800 border-rose-200';

                    return (
                      <div key={tIdx} className="space-y-2.5">
                        <div className="flex items-center gap-2">
                          <span className={`text-[11px] font-mono font-extrabold px-2.5 py-0.5 rounded-full border ${badgeColor}`}>
                            {tierName}
                          </span>
                        </div>
                        <ol className="space-y-2">
                          {tierList.map((item: any, qIdx: number) => (
                            <PracticeItem
                              key={qIdx}
                              item={item}
                              lang={lang}
                              showAnsGlobally={showAllPracAns}
                              onOpenInStudio={(code, axes) => onOpenStudio(code, axes)}
                            />
                          ))}
                        </ol>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-8 text-center text-slate-500 text-sm">
                    Тапсырмалар әзірленуде...
                  </div>
                )}
              </div>

              {/* Navigation Stepper Bottom Buttons */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setActiveTab(4)}
                  className="btn py-2 px-3 text-xs flex items-center gap-1 bg-white hover:bg-slate-100 border border-slate-200"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>4-бет: Қатемен жұмыс</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab(6)}
                  className="btn blue py-2 px-4 flex items-center gap-2 text-xs font-bold"
                >
                  <span>6-бет: Рефлексия & Квизге өту</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* PAGE 6: РЕФЛЕКСИЯ ЖӘНЕ ЭКСПРЕСС-ТЕСТ */}
          {activeTab === 6 && (
            <div className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-xs space-y-6 animate-fade-in">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-4">
                <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-extrabold font-mono text-sm">
                  06
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900">
                    {t(lang, 'tabExit')}
                  </h2>
                  <p className="text-xs text-slate-500">
                    Шығу парағы (Exit ticket), өзін-өзі бағалау және сабақ түйіні
                  </p>
                </div>
              </div>

              {/* Exit Ticket Express Check */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-purple-900 flex items-center gap-1.5">
                    <FileCheck2 className="w-3.5 h-3.5 text-purple-600" />
                    {t(lang, 'quickCheck')} (Шығу парағы)
                  </span>
                  <button
                    type="button"
                    onClick={() => setShowExitAns(prev => !prev)}
                    className="text-xs font-bold text-purple-700 hover:text-purple-900 underline cursor-pointer"
                  >
                    {showExitAns ? t(lang, 'hide') : t(lang, 'show')}
                  </button>
                </div>

                <div className="space-y-2">
                  {lesson.exit && lesson.exit.map((exItem: any, idx: number) => (
                    <div key={idx} className="p-3.5 bg-purple-50/40 border border-purple-200/80 rounded-xl space-y-1.5">
                      <p className="text-sm font-semibold text-slate-900" dangerouslySetInnerHTML={{ __html: exItem.q }} />
                      {showExitAns && (
                        <div className="pt-2 border-t border-purple-200/60 text-xs font-bold text-purple-950 animate-fade-in">
                          Жауабы: {exItem.a}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* 3-Level Self-Assessment Rating */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
                <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-600">
                  Өзін-өзі бағалау шкаласы:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelfRating('high')}
                    className={`p-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      selfRating === 'high'
                        ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-emerald-300'
                    }`}
                  >
                    <span>🟢 Толық меңгердім</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelfRating('med')}
                    className={`p-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      selfRating === 'med'
                        ? 'bg-amber-500 text-white border-amber-500 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-amber-300'
                    }`}
                  >
                    <span>🟡 Сұрақтарым бар</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelfRating('low')}
                    className={`p-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                      selfRating === 'low'
                        ? 'bg-rose-600 text-white border-rose-600 shadow-sm'
                        : 'bg-white text-slate-700 border-slate-200 hover:border-rose-300'
                    }`}
                  >
                    <span>🔴 Қайталау қажет</span>
                  </button>
                </div>
                {selfRating && (
                  <p className="text-xs text-slate-500 italic text-center pt-1 animate-fade-in">
                    Бағалауыңыз тіркелді. Келесі сабақта осы тақырып бойынша бекіту жаттығулары ұсынылады.
                  </p>
                )}
              </div>

              {/* Reflection Prompts & Homework */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                {lesson.diff && (
                  <div className="p-3.5 bg-blue-50/50 border border-blue-200 rounded-xl space-y-1">
                    <span className="text-[11px] font-mono font-bold text-blue-900 uppercase">
                      {t(lang, 'diff')}:
                    </span>
                    <p className="text-xs text-slate-700 font-medium" dangerouslySetInnerHTML={{ __html: lesson.diff }} />
                  </div>
                )}
                {lesson.hw && (
                  <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                    <span className="text-[11px] font-mono font-bold text-slate-700 uppercase">
                      {t(lang, 'hw')}:
                    </span>
                    <p className="text-xs text-slate-700 font-medium">
                      {lesson.hw}
                    </p>
                  </div>
                )}
              </div>

              {/* Bottom Navigation */}
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setActiveTab(5)}
                  className="btn py-2 px-3 text-xs flex items-center gap-1 bg-white hover:bg-slate-100 border border-slate-200"
                >
                  <ChevronLeft className="w-3.5 h-3.5" />
                  <span>5-бет: Практика</span>
                </button>
                {nextLesson && (
                  <button
                    type="button"
                    onClick={() => onSelectLesson(nextLesson.k)}
                    className="btn blue py-2 px-4 flex items-center gap-2 text-xs font-bold"
                  >
                    <span>Келесі сабаққа өту ({nextLesson.k}-сабақ)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          )}

        </div>

        {/* RIGHT-HAND COMPANION PANEL (Назар аударыңыз, Ескерту, 3 тілді терминдер, Формулалар) */}
        {showCompanionPanel && (
          <aside className="space-y-4 animate-fade-in sticky top-4">
            
            {/* Header of Companion Panel */}
            <div className="flex items-center justify-between p-3 bg-white border border-slate-200 rounded-2xl shadow-2xs">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-blue-600" />
                {t(lang, 'togglePanel')}
              </span>
              <button
                type="button"
                onClick={() => setShowCompanionPanel(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-md text-xs font-bold"
                title="Панельді жабу"
              >
                ✕
              </button>
            </div>

            {/* 1. Назар аударыңыз! (Key Note) */}
            {lesson.sideNote && (
              <div className="p-4 bg-gradient-to-br from-blue-50 to-indigo-50/60 border border-blue-200/90 rounded-2xl shadow-2xs space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-blue-900 uppercase">
                  <Lightbulb className="w-3.5 h-3.5 text-blue-600" />
                  {t(lang, 'sideNote')}
                </div>
                <p className="text-xs text-slate-800 font-medium leading-relaxed">
                  {lesson.sideNote}
                </p>
              </div>
            )}

            {/* 2. Ескерту! (Caution / Pitfall Warning) */}
            {lesson.sideWarning && (
              <div className="p-4 bg-gradient-to-br from-amber-50 to-rose-50/40 border border-amber-200/90 rounded-2xl shadow-2xs space-y-1.5">
                <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-900 uppercase">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  {t(lang, 'sideWarning')}
                </div>
                <p className="text-xs text-slate-800 font-medium leading-relaxed">
                  {lesson.sideWarning}
                </p>
              </div>
            )}

            {/* 3. Trilingual Terminology (ҚАЗ / РУС / ENG) */}
            {lesson.terms && lesson.terms.length > 0 && (
              <div className="p-4 bg-white border border-slate-200 rounded-2xl shadow-2xs space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-slate-800 uppercase border-b border-slate-100 pb-2">
                  <Globe2 className="w-3.5 h-3.5 text-indigo-600" />
                  {t(lang, 'sideTerms')}
                </div>
                <div className="space-y-2">
                  {lesson.terms.map((item: any, idx: number) => (
                    <div key={idx} className="p-2.5 bg-slate-50/80 rounded-xl text-xs space-y-1 border border-slate-100">
                      <div className="font-bold text-slate-900 flex items-center justify-between">
                        <span>🇰🇿 {item.kz}</span>
                      </div>
                      <div className="text-slate-600 font-medium flex items-center justify-between">
                        <span>🇷🇺 {item.ru}</span>
                      </div>
                      <div className="text-blue-700 font-semibold font-mono flex items-center justify-between">
                        <span>🇬🇧 {item.en}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 4. Quick Action Studio Launcher */}
            <div className="p-4 bg-gradient-to-br from-slate-900 to-indigo-950 text-white rounded-2xl shadow-xs space-y-2.5">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-blue-300 flex items-center gap-1.5">
                <Code className="w-3.5 h-3.5 text-blue-400" />
                3D Графиктік Студия
              </span>
              <p className="text-xs text-slate-300 leading-relaxed">
                Кез келген координата мен жазықтықты енгізіп, кеңістіктегі бұрыштарды тікелей есептеңіз.
              </p>
              <button
                type="button"
                onClick={() => onOpenStudio(undefined, true)}
                className="w-full btn blue py-2 text-xs font-bold flex items-center justify-center gap-1.5"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Студияны іске қосу</span>
              </button>
            </div>

          </aside>
        )}

      </div>
    </div>
  );
};
