import React, { useState } from 'react';
import { LangCode, t } from '../data/translations';
import { evalAnswer } from '../engine/figEngine';
import { GeometryFigure } from './GeometryFigure';
import { CheckCircle2, AlertCircle, Eye, EyeOff, Check, HelpCircle } from 'lucide-react';

export interface PracticeQuestion {
  q: string;
  a?: string;
  v?: number;
  fig?: string;
  extra?: boolean;
}

interface PracticeItemProps {
  item: PracticeQuestion;
  lang: LangCode;
  showAnsGlobally?: boolean;
  onOpenInStudio?: (code: string, axesOn: boolean) => void;
}

export const PracticeItem: React.FC<PracticeItemProps> = ({
  item,
  lang,
  showAnsGlobally = false,
  onOpenInStudio,
}) => {
  const [showFigure, setShowFigure] = useState(false);
  const [showLocalAns, setShowLocalAns] = useState(false);
  const [userVal, setUserVal] = useState('');
  const [checkResult, setCheckResult] = useState<'ok' | 'no' | 'invalid' | null>(null);

  const handleCheck = () => {
    if (item.v === undefined || item.v === null) return;
    const evaluated = evalAnswer(userVal);
    if (evaluated === null || !isFinite(evaluated)) {
      setCheckResult('invalid');
      return;
    }
    const target = item.v;
    const ok = Math.abs(evaluated - target) <= Math.max(0.011, Math.abs(target) * 0.006);
    setCheckResult(ok ? 'ok' : 'no');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCheck();
    }
  };

  const isAnswerVisible = showAnsGlobally || showLocalAns;

  return (
    <li className="bg-white border border-slate-200/90 rounded-xl p-3.5 mb-2.5 shadow-2xs hover:border-slate-300 transition-colors">
      <div 
        className="font-medium text-slate-900 leading-relaxed" 
        dangerouslySetInnerHTML={{ __html: item.q }} 
      />

      {item.fig && (
        <div className="mt-2">
          <button
            type="button"
            className="fbtn inline-flex items-center gap-1.5 text-xs"
            onClick={() => setShowFigure(!showFigure)}
          >
            {showFigure ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>{showFigure ? t(lang, 'hideFigure') : t(lang, 'figure')}</span>
          </button>
          {showFigure && (
            <div className="mt-2.5 rounded-lg overflow-hidden border border-slate-200">
              <GeometryFigure
                figKey={item.fig}
                height={240}
                allSteps={true}
                lang={lang}
                onOpenInStudio={onOpenInStudio}
              />
            </div>
          )}
        </div>
      )}

      {/* Answer verification input */}
      {item.v !== undefined && item.v !== null && (
        <div className="flex flex-wrap items-center gap-2.5 mt-3 pt-2.5 border-t border-slate-100">
          <div className="relative">
            <input
              type="text"
              value={userVal}
              onChange={e => {
                setUserVal(e.target.value);
                setCheckResult(null);
              }}
              onKeyDown={handleKeyDown}
              placeholder={t(lang, 'yourAns')}
              aria-label={t(lang, 'yourAns')}
              className={`w-36 py-1 px-2.5 text-sm font-mono border rounded-lg transition-colors ${
                checkResult === 'ok' 
                  ? 'border-emerald-500 bg-emerald-50/40 text-emerald-900' 
                  : checkResult === 'no' 
                  ? 'border-rose-400 bg-rose-50/40 text-rose-900' 
                  : 'border-slate-300 focus:border-blue-500'
              }`}
            />
          </div>
          <button 
            type="button" 
            onClick={handleCheck}
            className="btn solid text-xs py-1 px-3"
          >
            <Check className="w-3.5 h-3.5" />
            <span>{t(lang, 'check')}</span>
          </button>

          {item.a && (
            <button
              type="button"
              onClick={() => setShowLocalAns(!showLocalAns)}
              className="text-xs text-slate-500 hover:text-blue-600 underline ml-auto"
            >
              {showLocalAns ? t(lang, 'hideAns') : t(lang, 'showAns')}
            </button>
          )}

          {checkResult === 'ok' && (
            <span className="flex items-center gap-1 text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{t(lang, 'correct')}</span>
            </span>
          )}
          {checkResult === 'no' && (
            <span className="flex items-center gap-1 text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{t(lang, 'notYet')}</span>
            </span>
          )}
          {checkResult === 'invalid' && (
            <span className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{t(lang, 'typeNum')}</span>
            </span>
          )}
        </div>
      )}

      {/* Answer reveal */}
      {item.a && isAnswerVisible && (
        <div
          className="mt-2.5 p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-200 text-emerald-900 text-xs font-mono leading-relaxed"
          dangerouslySetInnerHTML={{ __html: item.a }}
        />
      )}
    </li>
  );
};
