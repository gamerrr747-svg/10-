import React, { useState, useEffect } from 'react';
import { LangCode, t } from '../data/translations';
import { WorkedExampleCard } from './WorkedExampleCard';
import { PracticeItem, PracticeQuestion } from './PracticeItem';
import curriculumData from '../data/curriculumData.json';
import { 
  Maximize2, 
  CheckCircle2, 
  Compass, 
  BookOpen, 
  Sparkles, 
  ChevronLeft, 
  ChevronRight, 
  FileCheck2,
  Check,
  Eye,
  EyeOff
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

  const STG = [
    { id: 'stg-warmup', titleKey: 's1', min: 5, num: '01' },
    { id: 'stg-explore', titleKey: 's2', min: 8, num: '02' },
    { id: 'stg-theory', titleKey: 's3', min: 8, num: '03' },
    { id: 'stg-examples', titleKey: 's4', min: 7, num: '04' },
    { id: 'stg-practice', titleKey: 's5', min: 10, num: '05' },
    { id: 'stg-exit', titleKey: 's6', min: 2, num: '06' },
  ];

  const scrollToStage = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="space-y-6">
      {/* Informational language banner if Term 3 in Kazakh */}
      {lang !== 'en' && term === 't3' && (
        <div className="sasbar langnote">
          <span className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            {t(lang, 'enOnly')}
          </span>
        </div>
      )}

      {/* Summative assessment alert banner */}
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

      {/* Lesson View Header */}
      <div className="view-head">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="eyebrow">
            {t(lang, 'lessonOf', lesson.k, allLessons.length)} ·{' '}
            {u ? `${u.code} ${u.name}` : t(lang, 'closure')} ·{' '}
            {t(lang, 'yearNo', lesson.n)}
          </div>
          {isTaught && (
            <span className="inline-flex items-center gap-1 text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5" />
              Өтілді
            </span>
          )}
        </div>

        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">{lesson.title}</h2>

        {/* Objectives Chips */}
        <div className="chips">
          {(lesson.obj || []).map((o: string, idx: number) => (
            <span key={idx} className="chip" title={o}>
              {o.split(' ')[0]}
            </span>
          ))}
          {lesson.book && (
            <span className="chip gold">
              {lesson.book.pages}
            </span>
          )}
        </div>

        {lesson.aim && <p className="lead">{lesson.aim}</p>}

        {/* Action Toolbar */}
        <div className="lessonbar flex flex-wrap items-center gap-2.5 mt-2">
          <button 
            type="button" 
            className="btn solid flex items-center gap-2 px-4 py-2"
            onClick={onOpenPresent}
          >
            <Maximize2 className="w-4 h-4" />
            <span>{t(lang, 'present')}</span>
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
              className="btn flex items-center gap-1.5 px-3 py-2 text-slate-700"
              onClick={() => onOpenStudio(undefined, false)}
            >
              <Compass className="w-4 h-4 text-blue-600" />
              <span>3D Студия</span>
            </button>
          )}

          <div className="ml-auto flex items-center gap-1 text-xs font-mono text-slate-400">
            <span>{lesson.k} / {allLessons.length}</span>
          </div>
        </div>

        {/* 6-Stage Quick Jump Strip */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-2 px-1 mt-2 border-y border-slate-100 text-xs font-semibold">
          <span className="text-slate-400 text-[11px] font-mono mr-1 shrink-0">КЕЗЕҢДЕР:</span>
          {STG.map(st => (
            <button
              key={st.id}
              type="button"
              onClick={() => scrollToStage(st.id)}
              className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-blue-100 hover:text-blue-700 text-slate-600 whitespace-nowrap transition-colors flex items-center gap-1"
            >
              <span className="font-mono text-slate-400">{st.num}.</span>
              <span>{t(lang, st.titleKey)}</span>
              <span className="text-[10px] text-slate-400">({st.min}м)</span>
            </button>
          ))}
        </div>
      </div>

      <div className="cols">
        <div className="flow">
          {/* Stage 1: Warm-up */}
          <section id="stg-warmup" className="stage scroll-mt-24">
            <div className="num">
              <b>01</b>
              {STG[0].min} {t(lang, 'min')}
            </div>
            <div>
              <h3>{t(lang, STG[0].titleKey)}</h3>
              <p dangerouslySetInnerHTML={{ __html: lesson.hook }} />
            </div>
          </section>

          {/* Stage 2: Explore CPA */}
          {lesson.cpa && (
            <section id="stg-explore" className="stage scroll-mt-24">
              <div className="num">
                <b>02</b>
                {STG[1].min} {t(lang, 'min')}
              </div>
              <div>
                <h3>{t(lang, STG[1].titleKey)}</h3>
                <div className="cpa">
                  <div className="c">
                    <h5>{t(lang, 'concrete')}</h5>
                    <p dangerouslySetInnerHTML={{ __html: lesson.cpa[0] }} />
                  </div>
                  <div className="p">
                    <h5>{t(lang, 'pictorial')}</h5>
                    <p dangerouslySetInnerHTML={{ __html: lesson.cpa[1] }} />
                  </div>
                  <div className="a">
                    <h5>{t(lang, 'abstract')}</h5>
                    <p dangerouslySetInnerHTML={{ __html: lesson.cpa[2] }} />
                  </div>
                </div>

                {lesson.lab && (
                  <div className="row" style={{ marginTop: '14px' }}>
                    <button
                      type="button"
                      className="btn blue"
                      onClick={() => onOpenLab(lesson.lab.id, lesson.lab.p)}
                    >
                      <Compass className="w-4 h-4" />
                      <span>
                        {t(
                          lang,
                          'openIn',
                          labs.find(x => x.id === lesson.lab.id)?.name || lesson.lab.id
                        )}
                      </span>
                    </button>
                    {lesson.lab.note && (
                      <span style={{ color: 'var(--ink-3)', fontSize: '14px' }}>
                        {lesson.lab.note}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Stage 3: Formalise Key Idea */}
          {lesson.key && (
            <section id="stg-theory" className="stage scroll-mt-24">
              <div className="num">
                <b>03</b>
                {STG[2].min} {t(lang, 'min')}
              </div>
              <div>
                <h3>{t(lang, STG[2].titleKey)}</h3>
                <div
                  className="key"
                  dangerouslySetInnerHTML={{ __html: lesson.key }}
                />
                {lesson.keyNote && (
                  <p className="mt-2 text-slate-600" dangerouslySetInnerHTML={{ __html: lesson.keyNote }} />
                )}
              </div>
            </section>
          )}

          {/* Stage 4: Worked Examples */}
          {lesson.ex && lesson.ex.length > 0 && (
            <section id="stg-examples" className="stage scroll-mt-24">
              <div className="num">
                <b>04</b>
                {STG[3].min} {t(lang, 'min')}
              </div>
              <div>
                <h3>{t(lang, STG[3].titleKey)}</h3>
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

          {/* Stage 5: Practice */}
          {lesson.prac && (
            <section id="stg-practice" className="stage scroll-mt-24">
              <div className="num">
                <b>05</b>
                {STG[4].min} {t(lang, 'min')}
              </div>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3>{t(lang, STG[4].titleKey)}</h3>
                  <button
                    type="button"
                    className="fbtn inline-flex items-center gap-1.5"
                    onClick={() => setShowAllPracAns(!showAllPracAns)}
                  >
                    {showAllPracAns ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{showAllPracAns ? t(lang, 'hideAns') : t(lang, 'showAllAns')}</span>
                  </button>
                </div>

                <div className={`tiers ${showAllPracAns ? 'show-ans' : ''}`}>
                  {/* Tier A: Fluency */}
                  <div className="tier border-t-4 border-t-blue-500">
                    <h5 className="flex items-center justify-between">
                      <span className="text-blue-700">{t(lang, 'fluency')}</span>
                      <i>{t(lang, 'forAll')}</i>
                    </h5>
                    <ol className="list-decimal pl-5 space-y-2">
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
                  <div className="tier border-t-4 border-t-emerald-500">
                    <h5 className="flex items-center justify-between">
                      <span className="text-emerald-700">{t(lang, 'reasoning')}</span>
                      <i>{t(lang, 'forMost')}</i>
                    </h5>
                    <ol className="list-decimal pl-5 space-y-2">
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
                  <div className="tier border-t-4 border-t-purple-500">
                    <h5 className="flex items-center justify-between">
                      <span className="text-purple-700">{t(lang, 'challenge')}</span>
                      <i>{t(lang, 'forSome')}</i>
                    </h5>
                    <ol className="list-decimal pl-5 space-y-2">
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
              </div>
            </section>
          )}

          {/* Stage 6: Exit Ticket */}
          {lesson.exit && (
            <section id="stg-exit" className="stage scroll-mt-24">
              <div className="num">
                <b>06</b>
                {STG[5].min} {t(lang, 'min')}
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3>{t(lang, STG[5].titleKey)}</h3>
                  <button
                    type="button"
                    className="fbtn inline-flex items-center gap-1.5"
                    onClick={() => setShowExitAns(!showExitAns)}
                  >
                    {showExitAns ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{showExitAns ? t(lang, 'hideAns') : t(lang, 'showAns')}</span>
                  </button>
                </div>
                <ol className={`exit-list list-decimal pl-5 space-y-2 ${showExitAns ? 'show-ans' : ''}`}>
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
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl mt-3 text-sm text-slate-700">
                  <b className="text-slate-900">{t(lang, 'reflect')}:</b>{' '}
                  {lesson.reflect || t(lang, 'reflectDef')}
                </div>
              </div>
            </section>
          )}

          {/* Homework */}
          {lesson.hw && (
            <section className="stage">
              <div className="num">
                <b className="text-amber-600">{lang === 'en' ? 'HW' : lang === 'kz' ? 'ҮЖ' : 'ДЗ'}</b>
              </div>
              <div>
                <h3>{t(lang, 'hw')}</h3>
                <div className="p-3.5 bg-amber-50/60 border border-amber-200/80 rounded-xl text-slate-800 text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: lesson.hw }} />
              </div>
            </section>
          )}
        </div>

        {/* Right Sidebar widgets */}
        <div className="aside">
          {lesson.book && (
            <div className="box book">
              <h4>{t(lang, 'textbook')}</h4>
              <p>
                <b>{lesson.book.pages}</b>
              </p>
              {lesson.book.ex && <p>{lesson.book.ex}</p>}
              {lesson.book.b && (
                <p style={{ color: 'var(--ink-2)' }}>{lesson.book.b}</p>
              )}
            </div>
          )}

          {lesson.sc && lesson.sc.length > 0 && (
            <div className="box checks">
              <h4>{t(lang, 'sc')} (Жетістік критерийлері)</h4>
              {lesson.sc.map((c: string, j: number) => (
                <label key={j}>
                  <input
                    type="checkbox"
                    checked={!!checkedCriteria[j]}
                    onChange={() => handleToggleCriterion(j)}
                  />
                  <span dangerouslySetInnerHTML={{ __html: c }} />
                </label>
              ))}
            </div>
          )}

          {lesson.obj && lesson.obj.length > 0 && (
            <div className="box">
              <h4>{t(lang, 'lo')}</h4>
              <ul style={{ fontSize: '14px' }}>
                {lesson.obj.map((o: string, idx: number) => (
                  <li key={idx}>{o}</li>
                ))}
              </ul>
            </div>
          )}

          {lesson.vocab && lesson.vocab.length > 0 && (
            <div className="box">
              <h4>{t(lang, 'terms')}</h4>
              <table className="vocab">
                <tbody>
                  {lesson.vocab.map((w: string, idx: number) => {
                    const g = (curriculumData.glossary as Record<string, string[]>)[w] || ['', ''];
                    return (
                      <tr key={idx}>
                        <td>{g[0]}</td>
                        <td>{w}</td>
                        <td>{g[1]}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {lesson.mis && (
            <div className="note">
              <b>{t(lang, 'watch')}</b> {lesson.mis}
            </div>
          )}

          {lesson.diff && (
            <div className="box">
              <h4>{t(lang, 'diff')}</h4>
              <p
                style={{ margin: 0, fontSize: '15px' }}
                dangerouslySetInnerHTML={{ __html: lesson.diff }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Pager */}
      <div className="pager">
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
