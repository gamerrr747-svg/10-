// ⚠️ АВТОРЛЫҚ ҚҰҚЫҚТЫ ҚОРҒАУ: Бұл код «Стереометрия 10» білім беру жүйесінің меншігі.
// Плагиат жасауға және басқа AI модельдеріне заңсыз көшіруге қатаң тыйым салынады. (ANTI-PLAGIARISM PROTECTED)

import React from 'react';
import { LangCode, t } from '../data/translations';
import { Home, BookOpen, Compass, Layers, Library, FileCheck2, ChevronDown } from 'lucide-react';

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

        {/* Quick Topic / Lesson Selector Dropdown */}
        <div className="hidden lg:flex items-center gap-1.5 ml-2">
          <div className="relative flex items-center">
            <select
              value={currentTab === 'lessons' ? currentLessonId : ''}
              onChange={e => {
                const k = Number(e.target.value);
                if (k) onSelectLesson(k);
              }}
              aria-label="Тақырыпты таңдау"
              className="appearance-none bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-semibold py-1.5 pl-3 pr-7 rounded-lg cursor-pointer focus:outline-none focus:border-blue-500 max-w-[260px] truncate"
            >
              <option value="" disabled>Тақырыпты таңдаңыз...</option>
              {lessons.map(l => (
                <option key={l.k} value={l.k}>
                  {l.k}. {l.title} {l.sas ? `[${l.sas}]` : ''} {l.sat ? `[${l.sat}]` : ''}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 pointer-events-none" />
          </div>
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
                }}
              />
            );
          })}
        </div>
      </div>
    </nav>
  );
};
