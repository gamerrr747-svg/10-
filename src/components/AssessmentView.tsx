import React, { useState } from 'react';
import { LangCode, t } from '../data/translations';
import { GeometryFigure } from './GeometryFigure';

interface AssessmentViewProps {
  currentAssessId?: string;
  assessments: any[];
  term: 't2' | 't3';
  termName: string;
  onSelectAssess: (id: string) => void;
  lang: LangCode;
}

export const AssessmentView: React.FC<AssessmentViewProps> = ({
  currentAssessId,
  assessments,
  term,
  termName,
  onSelectAssess,
  lang,
}) => {
  const [activeTab, setActiveTab] = useState<string>('spec');

  // If no specific assessment is selected, show list
  const activeAssess = assessments.find(a => a.id === currentAssessId);

  if (!activeAssess) {
    return (
      <div>
        {lang !== 'en' && term === 't3' && (
          <div className="sasbar langnote">
            <span>{t(lang, 'enOnly')}</span>
          </div>
        )}

        <div className="view-head">
          <div className="eyebrow">
            {t(lang, 'summ')} · {termName}
          </div>
          <h2>{t(lang, 'assessment')}</h2>
          <p className="lead">{t(lang, 'asmLead')}</p>
        </div>

        <div className="labgrid">
          {assessments.map(a => (
            <button
              key={a.id}
              type="button"
              className="labcard"
              style={{ textAlign: 'left', cursor: 'pointer' }}
              onClick={() => {
                onSelectAssess(a.id);
                setActiveTab(a.tabs?.[0]?.id || 'spec');
              }}
            >
              <span className="eyebrow">
                {a.short} · {t(lang, 'lessonW')} {a.lesson} ·{' '}
                {a.time?.replace('min', t(lang, 'min'))} · {a.marks} {t(lang, 'marksW')}
              </span>
              <h3>{a.title}</h3>
              <p>{a.objs?.join('; ')}</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const currentTabObj = activeAssess.tabs?.find((tb: any) => tb.id === activeTab);

  return (
    <div>
      {lang !== 'en' && term === 't3' && (
        <div className="sasbar langnote">
          <span>{t(lang, 'enOnly')}</span>
        </div>
      )}

      <div className="view-head">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => onSelectAssess('')}
            className="text-xs font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded-md transition-colors"
          >
            ← БЖБ / ТЖБ тізімі
          </button>
          <div className="eyebrow">
            {activeAssess.short} · {t(lang, 'lessonW')} {activeAssess.lesson} ·{' '}
            {activeAssess.time?.replace('min', t(lang, 'min'))} · {activeAssess.marks}{' '}
            {t(lang, 'marksW')}
          </div>
        </div>
        <h2>{activeAssess.title}</h2>
      </div>

      <div className="asm-tabs" id="asmTabs">
        {activeAssess.tabs?.map((tb: any) => (
          <button
            key={tb.id}
            type="button"
            aria-pressed={activeTab === tb.id}
            onClick={() => setActiveTab(tb.id)}
          >
            {tb.name}
          </button>
        ))}
        {activeAssess.figs && activeAssess.figs.length > 0 && (
          <button
            type="button"
            aria-pressed={activeTab === 'figs'}
            onClick={() => setActiveTab('figs')}
          >
            {t(lang, 'solFigs')}
          </button>
        )}
      </div>

      <div className="paper mjx">
        {activeTab === 'figs' && activeAssess.figs ? (
          <div>
            <p className="lead" style={{ fontSize: '16px' }}>
              {t(lang, 'figLead')}
            </p>
            {activeAssess.figs.map((f: any, idx: number) => (
              <div key={idx} className="wex">
                <div>
                  <div className="lbl">
                    {t(lang, 'task')} {f.task}
                  </div>
                  <p className="q" dangerouslySetInnerHTML={{ __html: f.text }} />
                </div>
                <div style={{ marginTop: '8px' }}>
                  <GeometryFigure figKey={f.fig} height={320} lang={lang} />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div
            className="table-wrap"
            dangerouslySetInnerHTML={{ __html: currentTabObj?.html || '' }}
          />
        )}
      </div>
    </div>
  );
};
