import React, { useState } from 'react';
import { LangCode, t } from '../data/translations';
import { GeometryFigure } from './GeometryFigure';
import { ChevronRight, RotateCcw, Eye, Sparkles } from 'lucide-react';

interface WorkedExampleCardProps {
  example: {
    q: string;
    s: string[];
    fig?: string;
  };
  index: number;
  lang: LangCode;
  onOpenInStudio?: (code: string, axesOn: boolean) => void;
  big?: boolean;
}

export const WorkedExampleCard: React.FC<WorkedExampleCardProps> = ({
  example,
  index,
  lang,
  onOpenInStudio,
  big = false,
}) => {
  const [step, setStep] = useState(0);
  const totalSteps = example.s.length;

  const label =
    index === 0
      ? t(lang, 'ido')
      : index === 1
      ? t(lang, 'wedo')
      : `${t(lang, 'example')} ${index + 1}`;

  const handleNext = () => {
    setStep(prev => Math.min(totalSteps, prev + 1));
  };

  const handleShowAll = () => {
    setStep(totalSteps);
  };

  const handleReset = () => {
    setStep(0);
  };

  return (
    <div className={`wex bg-white border border-slate-200/90 rounded-2xl p-5 shadow-xs mb-4 ${!example.fig ? 'nofig' : ''}`}>
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="lbl inline-flex items-center gap-1 text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-200/60">
            <Sparkles className="w-3.5 h-3.5 text-blue-600" />
            {label}
          </span>
          <span className="wcount ml-auto text-xs font-mono font-semibold text-slate-500">
            Қадам: {step} / {totalSteps}
          </span>
        </div>

        <p className="q text-slate-900 font-semibold text-base leading-relaxed" dangerouslySetInnerHTML={{ __html: example.q }} />

        <ol className="wsteps my-3 space-y-2">
          {example.s.map((stepText, idx) => (
            <li
              key={idx}
              className={`transition-all duration-200 ${idx < step ? 'shown' : ''} ${
                idx === step - 1 ? 'cur' : ''
              }`}
              dangerouslySetInnerHTML={{ __html: stepText }}
            />
          ))}
        </ol>

        <div className="wctl mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
          <button
            type="button"
            className="btn solid text-xs py-1.5 px-3 flex items-center gap-1.5"
            onClick={handleNext}
            disabled={step >= totalSteps}
          >
            <span>{t(lang, 'next')}</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <button 
            type="button" 
            className="btn text-xs py-1.5 px-3 flex items-center gap-1" 
            onClick={handleShowAll}
          >
            <Eye className="w-3.5 h-3.5 text-slate-500" />
            <span>{t(lang, 'all')}</span>
          </button>
          <button 
            type="button" 
            className="btn text-xs py-1.5 px-2.5" 
            onClick={handleReset}
            title={t(lang, 'restart')}
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
          </button>
        </div>
      </div>

      {example.fig && (
        <div className="rounded-xl overflow-hidden border border-slate-200/80 bg-white">
          <GeometryFigure
            figKey={example.fig}
            height={big ? 400 : 310}
            step={step}
            onStepChange={newStep => setStep(newStep)}
            lang={lang}
            onOpenInStudio={onOpenInStudio}
          />
        </div>
      )}
    </div>
  );
};
