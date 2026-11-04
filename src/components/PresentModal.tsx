import React, { useState, useEffect, useRef } from 'react';
import { LangCode, t } from '../data/translations';
import { WorkedExampleCard } from './WorkedExampleCard';
import { PracticeItem, PracticeQuestion } from './PracticeItem';
import { Maximize2, Minimize2, X, ChevronLeft, ChevronRight } from 'lucide-react';

interface PresentModalProps {
  lesson: any;
  termName: string;
  lang: LangCode;
  onClose: () => void;
  onOpenStudio?: (code?: string) => void;
}

export const PresentModal: React.FC<PresentModalProps> = ({
  lesson,
  termName,
  lang,
  onClose,
  onOpenStudio,
}) => {
  const [slideIndex, setSlideIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Build slides
  const slides = [
    // Slide 0: Title & Learning Objectives
    {
      type: 'title',
      content: (
        <div className="max-w-4xl mx-auto py-8">
          <div className="eyebrow text-blue-600 mb-2">
            {t(lang, 'lessonN', lesson.k)} · {termName}
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6">
            {lesson.title}
          </h2>
          {lesson.aim && (
            <p className="lead text-xl text-slate-600 mb-8 leading-relaxed">
              {lesson.aim}
            </p>
          )}
          {lesson.sc && (
            <div className="bg-slate-50 border border-slate-200/90 rounded-2xl p-6 shadow-xs">
              <h3 className="text-lg font-bold text-slate-900 mb-3">{t(lang, 'sc')}</h3>
              <ul className="space-y-2.5 text-base md:text-lg text-slate-700">
                {lesson.sc.map((c: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2.5">
                    <span className="text-blue-600 font-bold">•</span>
                    <span dangerouslySetInnerHTML={{ __html: c }} />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      ),
    },
    // Slide 1: Hook / Warm-up
    {
      type: 'warmup',
      content: (
        <div className="max-w-4xl mx-auto py-8">
          <div className="eyebrow text-blue-600 mb-2">01-КЕЗЕҢ</div>
          <h3 className="text-3xl font-extrabold text-slate-900 mb-6">{t(lang, 's1')}</h3>
          <div
            className="text-xl md:text-2xl leading-relaxed text-slate-800 bg-blue-50/50 border border-blue-100 rounded-2xl p-8"
            dangerouslySetInnerHTML={{ __html: lesson.hook }}
          />
        </div>
      ),
    },
  ];

  // Slide 2: Explore CPA
  if (lesson.cpa) {
    slides.push({
      type: 'cpa',
      content: (
        <div className="max-w-5xl mx-auto py-6">
          <div className="eyebrow text-blue-600 mb-2">02-КЕЗЕҢ</div>
          <h3 className="text-3xl font-extrabold text-slate-900 mb-6">{t(lang, 's2')}</h3>
          <div className="cpa" style={{ marginTop: '16px' }}>
            <div className="c bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
              <h5 className="text-emerald-700 font-mono font-bold text-sm mb-2">{t(lang, 'concrete')}</h5>
              <div
                className="text-base md:text-lg leading-relaxed text-slate-800"
                dangerouslySetInnerHTML={{ __html: lesson.cpa[0] }}
              />
            </div>
            <div className="p bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
              <h5 className="text-blue-700 font-mono font-bold text-sm mb-2">{t(lang, 'pictorial')}</h5>
              <div
                className="text-base md:text-lg leading-relaxed text-slate-800"
                dangerouslySetInnerHTML={{ __html: lesson.cpa[1] }}
              />
            </div>
            <div className="a bg-white border border-slate-200 rounded-xl p-6 shadow-xs">
              <h5 className="text-rose-700 font-mono font-bold text-sm mb-2">{t(lang, 'abstract')}</h5>
              <div
                className="text-base md:text-lg leading-relaxed text-slate-800"
                dangerouslySetInnerHTML={{ __html: lesson.cpa[2] }}
              />
            </div>
          </div>
        </div>
      ),
    });
  }

  // Slide 3: Key Idea
  if (lesson.key) {
    slides.push({
      type: 'key',
      content: (
        <div className="max-w-4xl mx-auto py-6">
          <div className="eyebrow text-blue-600 mb-2">03-КЕЗЕҢ</div>
          <h3 className="text-3xl font-extrabold text-slate-900 mb-6">{t(lang, 'keyIdea')}</h3>
          <div
            className="key text-xl md:text-2xl p-8 leading-relaxed shadow-sm"
            dangerouslySetInnerHTML={{ __html: lesson.key }}
          />
          {lesson.keyNote && (
            <div
              className="mt-6 text-lg text-slate-700 p-4 bg-slate-50 border border-slate-200 rounded-xl"
              dangerouslySetInnerHTML={{ __html: lesson.keyNote }}
            />
          )}
        </div>
      ),
    });
  }

  // Worked Examples (one slide each for max clarity)
  if (lesson.ex && lesson.ex.length > 0) {
    lesson.ex.forEach((ex: any, idx: number) => {
      slides.push({
        type: `example-${idx}`,
        content: (
          <div className="max-w-5xl mx-auto py-4">
            <div className="eyebrow text-blue-600 mb-2">04-КЕЗЕҢ · ҮЛГІ ЕСЕП</div>
            <h3 className="text-2xl font-extrabold text-slate-900 mb-4">{t(lang, 'exampleN', idx + 1)}</h3>
            <WorkedExampleCard
              example={ex}
              index={idx}
              lang={lang}
              big={true}
              onOpenInStudio={onOpenStudio}
            />
          </div>
        ),
      });
    });
  }

  // Slide: Practice
  if (lesson.prac) {
    slides.push({
      type: 'prac',
      content: (
        <div className="max-w-5xl mx-auto py-4">
          <div className="eyebrow text-blue-600 mb-2">05-КЕЗЕҢ</div>
          <h3 className="text-2xl font-extrabold text-slate-900 mb-4">{t(lang, 's5')}</h3>
          <div className="tiers" style={{ marginTop: '14px' }}>
            <div className="tier border-t-4 border-t-blue-500">
              <h5 className="text-blue-700 font-bold">{t(lang, 'fluency')}</h5>
              <ol className="space-y-2">
                {lesson.prac[0]?.map((item: PracticeQuestion, idx: number) => (
                  <PracticeItem
                    key={idx}
                    item={item}
                    lang={lang}
                    onOpenInStudio={onOpenStudio}
                  />
                ))}
              </ol>
            </div>
            <div className="tier border-t-4 border-t-emerald-500">
              <h5 className="text-emerald-700 font-bold">{t(lang, 'reasoning')}</h5>
              <ol className="space-y-2">
                {lesson.prac[1]?.map((item: PracticeQuestion, idx: number) => (
                  <PracticeItem
                    key={idx}
                    item={item}
                    lang={lang}
                    onOpenInStudio={onOpenStudio}
                  />
                ))}
              </ol>
            </div>
            <div className="tier border-t-4 border-t-purple-500">
              <h5 className="text-purple-700 font-bold">{t(lang, 'challenge')}</h5>
              <ol className="space-y-2">
                {lesson.prac[2]?.map((item: PracticeQuestion, idx: number) => (
                  <PracticeItem
                    key={idx}
                    item={item}
                    lang={lang}
                    onOpenInStudio={onOpenStudio}
                  />
                ))}
              </ol>
            </div>
          </div>
        </div>
      ),
    });
  }

  // Slide: Exit Ticket
  if (lesson.exit) {
    slides.push({
      type: 'exit',
      content: (
        <div className="max-w-4xl mx-auto py-6">
          <div className="eyebrow text-blue-600 mb-2">06-КЕЗЕҢ</div>
          <h3 className="text-3xl font-extrabold text-slate-900 mb-6">{t(lang, 's6')}</h3>
          <ol className="exit-list space-y-3">
            {lesson.exit.map((item: PracticeQuestion, idx: number) => (
              <PracticeItem
                key={idx}
                item={item}
                lang={lang}
                onOpenInStudio={onOpenStudio}
              />
            ))}
          </ol>
          <div className="mt-8 p-6 bg-slate-50 border border-slate-200 rounded-2xl text-lg text-slate-700">
            <b className="text-slate-900">{t(lang, 'reflect')}:</b>{' '}
            {lesson.reflect || t(lang, 'reflectDef')}
          </div>
        </div>
      ),
    });
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === 'ArrowRight' || e.key === 'PageDown') {
        setSlideIndex(prev => Math.min(slides.length - 1, prev + 1));
      } else if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        setSlideIndex(prev => Math.max(0, prev - 1));
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [slides.length, onClose]);

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen?.().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      document.exitFullscreen?.().then(() => setIsFullscreen(false)).catch(() => {});
    }
  };

  const currentSlide = slides[slideIndex];

  return (
    <div ref={containerRef} className="present bg-white text-slate-900" role="dialog">
      <div className="pr-top px-4 py-3 border-b border-slate-200 bg-slate-50/70">
        <span className="eyebrow text-slate-600">
          {termName} · {t(lang, 'lessonN', lesson.k)}. {lesson.title}
        </span>
        <div className="row flex items-center gap-2">
          <span className="text-xs font-mono text-slate-400 mr-2">
            Слайд {slideIndex + 1} / {slides.length} (← / → пернелері)
          </span>
          <button 
            type="button" 
            className="btn text-xs py-1.5 px-3 flex items-center gap-1.5" 
            onClick={toggleFullscreen}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span>{isFullscreen ? 'Терезе' : t(lang, 'full')}</span>
          </button>
          <button 
            type="button" 
            className="btn text-xs py-1.5 px-2.5 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-300" 
            onClick={onClose}
            title={t(lang, 'close')}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="pr-slide">{currentSlide.content}</div>

      <div className="pr-bot px-6 py-4 border-t border-slate-200 bg-slate-50/70 flex items-center justify-between">
        <button
          type="button"
          className="btn flex items-center gap-1.5"
          disabled={slideIndex === 0}
          onClick={() => setSlideIndex(prev => Math.max(0, prev - 1))}
        >
          <ChevronLeft className="w-4 h-4" />
          <span>{t(lang, 'back')}</span>
        </button>

        <div className="pr-dots">
          {slides.map((_, idx) => (
            <i
              key={idx}
              className={idx === slideIndex ? 'on' : ''}
              onClick={() => setSlideIndex(idx)}
              style={{ cursor: 'pointer' }}
            />
          ))}
        </div>

        <button
          type="button"
          className="btn solid flex items-center gap-1.5"
          onClick={() => {
            if (slideIndex < slides.length - 1) {
              setSlideIndex(prev => prev + 1);
            } else {
              onClose();
            }
          }}
        >
          <span>{slideIndex === slides.length - 1 ? t(lang, 'finish') : t(lang, 'nextS')}</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
