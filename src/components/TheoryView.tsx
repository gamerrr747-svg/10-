import React from 'react';
import { LangCode, t } from '../data/translations';
import { GeometryFigure } from './GeometryFigure';

interface TheoryViewProps {
  term: 't2' | 't3';
  theoryGroups: any[];
  termName: string;
  onSelectLesson: (k: number) => void;
  onOpenStudio: (sceneKey?: string) => void;
  lang: LangCode;
}

export const TheoryView: React.FC<TheoryViewProps> = ({
  term,
  theoryGroups,
  termName,
  onSelectLesson,
  onOpenStudio,
  lang,
}) => {
  return (
    <div>
      {lang !== 'en' && term === 't3' && (
        <div className="sasbar langnote">
          <span>{t(lang, 'enOnly')}</span>
        </div>
      )}

      <div className="view-head">
        <div className="eyebrow">
          {t(lang, 'handbook')} · {termName}
        </div>
        <h2>{t(lang, 'theory')}</h2>
        <p className="lead">{t(lang, 'thLead')}</p>
      </div>

      {theoryGroups.map((group, gIdx) => (
        <div key={gIdx}>
          <h3 className="section-title">{group.unit}</h3>
          <div className="thgrid">
            {group.items?.map((it: any, itIdx: number) => {
              const kindColor =
                it.kind === 'Theorem'
                  ? 'var(--u3)'
                  : it.kind === 'Definition'
                  ? 'var(--cobalt)'
                  : 'var(--u2)';

              return (
                <div key={itIdx} className="thcard">
                  <span className="kind" style={{ color: kindColor }}>
                    {t(lang, it.kind)}
                  </span>
                  <h4>{it.t}</h4>
                  <p dangerouslySetInnerHTML={{ __html: it.s }} />

                  {it.f && (
                    <div className="fx">
                      {it.f.startsWith('\\[') ? it.f : `\\[${it.f}\\]`}
                    </div>
                  )}

                  {it.why && (
                    <p style={{ color: 'var(--ink-2)', fontSize: '14px' }}>
                      <b>{t(lang, 'why')}</b> {it.why}
                    </p>
                  )}

                  {it.fig && (
                    <GeometryFigure
                      figKey={it.fig}
                      height={230}
                      allSteps={true}
                      lang={lang}
                    />
                  )}

                  <div className="row" style={{ marginTop: 'auto' }}>
                    {it.scene && (
                      <button
                        type="button"
                        className="btn solid"
                        onClick={() => onOpenStudio(it.scene)}
                      >
                        {t(lang, 'studio')} ↗
                      </button>
                    )}
                    {it.k && (
                      <button
                        type="button"
                        className="btn"
                        onClick={() => onSelectLesson(it.k)}
                      >
                        {t(lang, 'lessonN', it.k)}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};
