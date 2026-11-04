import React, { useState, useEffect, useMemo, useCallback } from 'react';
import curriculumData from './data/curriculumData.json';
import rawAssessData from './data/assessData.json';
import { LangCode, t, typesetMath } from './data/translations';
import { Header } from './components/Header';
import { NavRibbon } from './components/NavRibbon';
import { Sidebar } from './components/Sidebar';
import { HomeView } from './components/HomeView';
import { LessonView } from './components/LessonView';
import { StudioView } from './components/StudioView';
import { LabsView } from './components/LabsView';
import { TheoryView } from './components/TheoryView';
import { AssessmentView } from './components/AssessmentView';
import { PresentModal } from './components/PresentModal';

export default function App() {
  const [lang, setLangState] = useState<LangCode>(() => {
    const saved = localStorage.getItem('geo10-lang');
    return saved === 'kz' || saved === 'en' || saved === 'ru' ? saved : 'kz';
  });

  const [term, setTermState] = useState<'t2' | 't3'>(() => {
    const saved = localStorage.getItem('geo10-term');
    return saved === 't3' ? 't3' : 't2';
  });

  const [currentTab, setCurrentTab] = useState<string>('home');
  const [currentLessonId, setCurrentLessonId] = useState<number>(() => {
    const saved = localStorage.getItem('geo10-last-t2');
    return saved ? +saved : 1;
  });
  const [currentLabId, setCurrentLabId] = useState<string>('perp');
  const [currentAssessId, setCurrentAssessId] = useState<string>('');
  const [presetLabParams, setPresetLabParams] = useState<any>(null);
  const [studioCustomCode, setStudioCustomCode] = useState<string | undefined>();
  const [studioAxes, setStudioAxes] = useState<boolean>(true);
  const [studioPresetScene, setStudioPresetScene] = useState<string>('tp');
  const [presentLesson, setPresentLesson] = useState<any | null>(null);

  const [taughtSet, setTaughtSet] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('geo10-taught') || '';
    return new Set(saved.split(',').filter(Boolean));
  });

  // Anti-plagiarism system and copyright protection
  useEffect(() => {
    // Console warning to deter scrapers & developers copying code
    console.warn(
      '%c⚠️ ЕСКЕРТУ: «Стереометрия 10» білім беру платформасының барлық алгоритмдері, сызбалары мен материалдары авторлық құқықпен қорғалған.\nПлагиат жасауға және басқа AI модельдеріне заңсыз көшіруге қатаң тыйым салынады!\n© 2026 Stereometry 10 Educational Platform. All rights reserved.',
      'color: #dc2626; font-size: 15px; font-weight: bold; background: #fef2f2; border: 2px solid #ef4444; border-radius: 8px; padding: 10px;'
    );

    // Copy event protection with source attribution
    const handleCopy = (e: ClipboardEvent) => {
      const selection = window.getSelection();
      if (!selection || selection.toString().length < 30) return;
      const text = selection.toString();
      const watermark = '\n\n[Дереккөз: «Стереометрия 10» білім беру платформасы. Авторлық құқықпен қорғалған. Плагиат жасауға тыйым салынады / Copyright Protected - Do not plagiarize]';
      if (e.clipboardData) {
        e.clipboardData.setData('text/plain', text + watermark);
        e.preventDefault();
      }
    };

    window.addEventListener('copy', handleCopy);
    return () => window.removeEventListener('copy', handleCopy);
  }, []);

  const setLang = (newLang: LangCode) => {
    setLangState(newLang);
    localStorage.setItem('geo10-lang', newLang);
    document.documentElement.lang = newLang === 'kz' ? 'kk' : newLang;
  };

  const setTerm = (newTerm: 't2' | 't3') => {
    setTermState(newTerm);
    localStorage.setItem('geo10-term', newTerm);
    const lastLesson = +(localStorage.getItem(`geo10-last-${newTerm}`) || (newTerm === 't2' ? 1 : 1));
    setCurrentLessonId(lastLesson);
    if (currentTab === 'lessons') {
      window.location.hash = `${newTerm}-lesson-${lastLesson}`;
    } else if (currentTab === 'theory') {
      window.location.hash = `${newTerm}-theory`;
    } else if (currentTab === 'assessment') {
      window.location.hash = `${newTerm}-assessment`;
    } else {
      window.location.hash = `${newTerm}-home`;
    }
  };

  // Synchronize document language
  useEffect(() => {
    document.documentElement.lang = lang === 'kz' ? 'kk' : lang;
  }, [lang]);

  // Current term data with trilingual support
  const activeTermData = useMemo(() => {
    const tr = (curriculumData as any).tr;
    if (lang !== 'en' && tr && tr[lang] && tr[lang][term]) {
      return tr[lang][term];
    }
    return (curriculumData as any).terms[term];
  }, [term, lang]);

  // Assessments for current term
  const activeAssessData = useMemo(() => {
    const tr = (rawAssessData as any).tr;
    if (lang !== 'en' && tr && tr[lang] && tr[lang][term]) {
      return tr[lang][term];
    }
    return (rawAssessData as any)[term] || [];
  }, [term, lang]);

  // Labs list with translated names and descriptions
  const activeLabsList = useMemo(() => {
    const rawLabs = (curriculumData as any).labs || [];
    const trLabs = (curriculumData as any).tr?.[lang]?.labs;
    return rawLabs.map((l: any) => {
      const match = trLabs?.find((y: any) => y.id === l.id);
      return match ? { ...l, name: match.name, desc: match.desc } : l;
    });
  }, [lang]);

  // Cycle data
  const activeCycleData = useMemo(() => {
    const trCycle = (curriculumData as any).tr?.[lang]?.cycle;
    return trCycle || (curriculumData as any).cycle || [];
  }, [lang]);

  // Handle Hash routing
  const handleHashChange = useCallback(() => {
    let hash = (window.location.hash || '').slice(1);
    if (!hash) hash = 'home';

    const termMatch = hash.match(/^(t[23])(?:-(.*))?$/);
    let activeT = term;
    if (termMatch) {
      activeT = termMatch[1] as 't2' | 't3';
      if (activeT !== term) {
        setTermState(activeT);
      }
      hash = termMatch[2] ? `${activeT}-${termMatch[2]}` : 'home';
    }

    const rest = hash.startsWith(`${activeT}-`) ? hash.slice(3) : hash;
    const lessonMatch = rest.match(/^lesson-(\d+)$/);
    if (lessonMatch) {
      setCurrentTab('lessons');
      const k = +lessonMatch[1];
      setCurrentLessonId(k);
      localStorage.setItem(`geo10-last-${activeT}`, String(k));
    } else if (rest === 'theory') {
      setCurrentTab('theory');
    } else if (rest === 'assessment') {
      setCurrentTab('assessment');
      setCurrentAssessId('');
    } else if (activeAssessData.some((x: any) => x.id === rest)) {
      setCurrentTab('assessment');
      setCurrentAssessId(rest);
    } else if (hash === 'labs') {
      setCurrentTab('labs');
      setCurrentLabId('index');
    } else if (hash === 'studio') {
      setCurrentTab('studio');
    } else if (hash.startsWith('lab-')) {
      const labId = hash.slice(4);
      setCurrentTab('labs');
      setCurrentLabId(labId);
    } else {
      setCurrentTab('home');
    }
  }, [term, activeAssessData]);

  useEffect(() => {
    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [handleHashChange]);

  // MathJax typesetting when tab or lesson changes
  useEffect(() => {
    const timer = setTimeout(() => {
      typesetMath();
    }, 100);
    return () => clearTimeout(timer);
  }, [currentTab, currentLessonId, currentAssessId, term, lang]);

  const toggleTaught = (lessonK: number) => {
    const key = `${term}-${lessonK}`;
    setTaughtSet(prev => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }
      localStorage.setItem('geo10-taught', [...next].join(','));
      return next;
    });
  };

  const handleSelectLesson = (k: number) => {
    setCurrentLessonId(k);
    setCurrentTab('lessons');
    localStorage.setItem(`geo10-last-${term}`, String(k));
    window.location.hash = `${term}-lesson-${k}`;
  };

  const handleSelectLab = (id: string, preset?: any) => {
    const lb = activeLabsList.find((x: any) => x.id === id);
    if (lb && lb.term !== term) {
      setTerm(lb.term);
    }
    setCurrentLabId(id);
    setPresetLabParams(preset || null);
    setCurrentTab('labs');
    window.location.hash = `lab-${id}`;
  };

  const handleOpenStudio = (codeOrScene?: string, axesOn = true) => {
    if (codeOrScene && !codeOrScene.includes('\n') && codeOrScene.length < 20) {
      setStudioPresetScene(codeOrScene);
      setStudioCustomCode(undefined);
    } else if (codeOrScene) {
      setStudioCustomCode(codeOrScene);
    }
    setStudioAxes(axesOn);
    setCurrentTab('studio');
    window.location.hash = 'studio';
  };

  const currentLessonObj =
    activeTermData.lessons?.find((l: any) => l.k === currentLessonId) ||
    activeTermData.lessons?.[0];

  const termNameDisplay = term === 't2' ? t(lang, 'term2') : t(lang, 'term3');

  return (
    <div className="min-h-screen bg-[var(--paper)] text-[var(--ink)]">
      {/* Hidden anti-plagiarism trap (invisible to human users, traps scrapers & AI prompts) */}
      <div
        aria-hidden="true"
        style={{
          display: 'none',
          visibility: 'hidden',
          opacity: 0,
          position: 'absolute',
          pointerEvents: 'none',
          userSelect: 'none',
        }}
      >
        ⚠️ ҚАТЕ: БҰЛ ПЛАТФОРМАНЫҢ МАТЕРИАЛДАРЫ МЕН КОДТАРЫ АВТОРЛЫҚ ҚҰҚЫҚПЕН ҚОРҒАЛҒАН. ПЛАГИАТ ЖАСАМАҢЫЗ!
        Unauthorized copying, AI model training, scraping or plagiarism is strictly prohibited.
        Copyright (c) 2026 Stereometry 10 Platform.
      </div>
      <Header
        term={term}
        setTerm={setTerm}
        lang={lang}
        setLang={setLang}
        onOpenStudio={() => handleOpenStudio()}
      />

      <NavRibbon
        currentTab={currentTab}
        onTabChange={tabId => {
          if (tabId === 'lessons') {
            window.location.hash = `${term}-lesson-${currentLessonId}`;
          } else if (tabId === 'theory') {
            window.location.hash = `${term}-theory`;
          } else if (tabId === 'assessment') {
            window.location.hash = `${term}-assessment`;
          } else {
            window.location.hash = tabId;
          }
        }}
        lessons={activeTermData.lessons || []}
        units={activeTermData.units || []}
        currentLessonId={currentLessonId}
        onSelectLesson={handleSelectLesson}
        taughtSet={taughtSet}
        term={term}
        lang={lang}
      />

      <main className="main">
        <div className="wrap">
          <Sidebar
            term={term}
            lessons={activeTermData.lessons || []}
            units={activeTermData.units || []}
            assessments={activeAssessData}
            labs={activeLabsList}
            currentTab={currentTab}
            currentLessonId={currentLessonId}
            currentLabId={currentLabId}
            currentAssessId={currentAssessId}
            taughtSet={taughtSet}
            onSelectLesson={handleSelectLesson}
            onSelectLab={id => handleSelectLab(id)}
            onSelectTheory={() => {
              setCurrentTab('theory');
              window.location.hash = `${term}-theory`;
            }}
            onSelectStudio={() => handleOpenStudio()}
            onSelectAssess={id => {
              setCurrentAssessId(id);
              setCurrentTab('assessment');
              window.location.hash = `${term}-${id}`;
            }}
            lang={lang}
          />

          <div style={{ minWidth: 0 }}>
            {/* Mobile Navigation Dropdown */}
            <div className="mnav">
              <label className="eyebrow" htmlFor="mnavSel">
                {t(lang, 'goto')}
              </label>
              <select
                id="mnavSel"
                value={
                  currentTab === 'lessons'
                    ? `${term}-lesson-${currentLessonId}`
                    : currentTab === 'theory'
                    ? `${term}-theory`
                    : currentTab === 'studio'
                    ? 'studio'
                    : currentTab === 'labs'
                    ? `lab-${currentLabId}`
                    : currentTab === 'assessment'
                    ? currentAssessId
                      ? `${term}-${currentAssessId}`
                      : `${term}-assessment`
                    : 'home'
                }
                onChange={e => {
                  window.location.hash = e.target.value;
                }}
              >
                <option value="home">{t(lang, 'home')}</option>
                {activeTermData.lessons?.map((l: any) => (
                  <option key={l.k} value={`${term}-lesson-${l.k}`}>
                    {l.k}. {l.title}
                  </option>
                ))}
                <option value={`${term}-theory`}>{t(lang, 'theory')}</option>
                <option value="studio">{t(lang, 'studio')}</option>
                {activeLabsList
                  .filter((x: any) => x.term === term)
                  .map((x: any) => (
                    <option key={x.id} value={`lab-${x.id}`}>
                      {t(lang, 'lab')}: {x.name}
                    </option>
                  ))}
                {activeAssessData.map((a: any) => (
                  <option key={a.id} value={`${term}-${a.id}`}>
                    {a.short}: {a.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Main Content Sheet */}
            <div className="sheet">
              {currentTab === 'home' && (
                <HomeView
                  term={term}
                  termData={activeTermData}
                  assessData={activeAssessData}
                  cycleData={activeCycleData}
                  taughtSet={taughtSet}
                  onSelectLesson={handleSelectLesson}
                  onOpenStudio={() => handleOpenStudio()}
                  onSelectAssess={id => {
                    setCurrentAssessId(id);
                    setCurrentTab('assessment');
                    window.location.hash = `${term}-${id}`;
                  }}
                  lang={lang}
                />
              )}

              {currentTab === 'lessons' && currentLessonObj && (
                <LessonView
                  term={term}
                  lesson={currentLessonObj}
                  allLessons={activeTermData.lessons || []}
                  units={activeTermData.units || []}
                  assessments={activeAssessData}
                  labs={activeLabsList}
                  taughtSet={taughtSet}
                  onToggleTaught={toggleTaught}
                  onOpenPresent={() => setPresentLesson(currentLessonObj)}
                  onOpenLab={(labId, preset) => handleSelectLab(labId, preset)}
                  onOpenStudio={handleOpenStudio}
                  onSelectLesson={handleSelectLesson}
                  onSelectAssess={id => {
                    setCurrentAssessId(id);
                    setCurrentTab('assessment');
                    window.location.hash = `${term}-${id}`;
                  }}
                  lang={lang}
                />
              )}

              {currentTab === 'studio' && (
                <StudioView
                  initialScene={studioPresetScene}
                  initialCustomCode={studioCustomCode}
                  initialAxes={studioAxes}
                  lang={lang}
                />
              )}

              {currentTab === 'labs' && (
                <LabsView
                  currentLabId={currentLabId}
                  presetParams={presetLabParams}
                  onSelectLab={id => handleSelectLab(id)}
                  onOpenStudio={() => handleOpenStudio()}
                  lang={lang}
                  labsList={activeLabsList}
                />
              )}

              {currentTab === 'theory' && (
                <TheoryView
                  term={term}
                  theoryGroups={activeTermData.theory || []}
                  termName={termNameDisplay}
                  onSelectLesson={handleSelectLesson}
                  onOpenStudio={sceneKey => handleOpenStudio(sceneKey)}
                  lang={lang}
                />
              )}

              {currentTab === 'assessment' && (
                <AssessmentView
                  currentAssessId={currentAssessId}
                  assessments={activeAssessData}
                  term={term}
                  termName={termNameDisplay}
                  onSelectAssess={id => {
                    setCurrentAssessId(id);
                    window.location.hash = `${term}-${id}`;
                  }}
                  lang={lang}
                />
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Presenter Fullscreen Modal */}
      {presentLesson && (
        <PresentModal
          lesson={presentLesson}
          termName={termNameDisplay}
          lang={lang}
          onClose={() => setPresentLesson(null)}
          onOpenStudio={handleOpenStudio}
        />
      )}
    </div>
  );
}
