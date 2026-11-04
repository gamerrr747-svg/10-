import React from 'react';
import { LangCode, t } from '../data/translations';
import { Home, BookOpen, Compass, Layers, Library, FileCheck2 } from 'lucide-react';

interface NavRibbonProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  lessons: any[];
  units: any[];
  currentLessonId?: number;
  onSelectLesson: (k: number) => void;
  taughtSet: Set<string>;
  term: 't2' | 't3';
  lang: LangCode;
}

export const NavRibbon: React.FC<NavRibbonProps> = ({
  currentTab,
  onTabChange,
  lessons,
  units,
  currentLessonId,
  onSelectLesson,
  taughtSet,
  term,
  lang,
}) => {
  const tabs = [
    { id: 'home', label: t(lang, 'home'), icon: Home },
    { id: 'lessons', label: t(lang, 'lessons'), icon: BookOpen },
    { id: 'studio', label: t(lang, 'studio'), icon: Compass },
    { id: 'labs', label: t(lang, 'labs'), icon: Layers },
    { id: 'theory', label: t(lang, 'theory'), icon: Library },
    { id: 'assessment', label: t(lang, 'assessment'), icon: FileCheck2 },
  ];

  return (
    <nav className="ribbon" aria-label="Sections">
      <div className="wrap">
        {/* Navigation Tabs */}
        <div className="tabs">
          {tabs.map(tb => {
            const Icon = tb.icon;
            const isActive = currentTab === tb.id;
            return (
              <button
                key={tb.id}
                type="button"
                className="tab"
                aria-current={isActive}
                onClick={() => onTabChange(tb.id)}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                <span>{tb.label}</span>
              </button>
            );
          })}
        </div>

        {/* Visual Timeline of Lessons */}
        <div className="cells" title="Сабақтар барысы (сабаққа өту үшін басыңыз)">
          {lessons.map(l => {
            const u = units.find(unit => unit.id === l.unit);
            const isDone = taughtSet.has(`${term}-${l.k}`);
            const isActive = currentTab === 'lessons' && currentLessonId === l.k;
            const tooltip = `${l.k}-сабақ: ${l.title} ${l.sas ? `[${l.sas}]` : ''} ${l.sat ? `[${l.sat}]` : ''} ${isDone ? '✓ Өтілді' : ''}`;

            return (
              <button
                key={l.k}
                type="button"
                className={`cell ${l.sas ? 'as' : ''} ${l.sat ? 'sat' : ''} ${
                  isDone ? 'done' : ''
                } ${isActive ? 'on' : ''}`}
                style={{ background: u ? u.color : 'var(--ink)' }}
                title={tooltip}
                aria-label={tooltip}
                onClick={() => {
                  onSelectLesson(l.k);
                  onTabChange('lessons');
                }}
              />
            );
          })}
        </div>
      </div>
    </nav>
  );
};
