import React, { useState, useMemo } from 'react';
import { LangCode, t } from '../data/translations';
import { 
  BookOpen, 
  Search, 
  Compass, 
  Layers, 
  Library, 
  FileCheck2, 
  CheckCircle2, 
  ChevronRight 
} from 'lucide-react';

interface SidebarProps {
  term: 't2' | 't3';
  lessons: any[];
  units: any[];
  assessments: any[];
  labs: any[];
  currentTab: string;
  currentLessonId?: number;
  currentLabId?: string;
  currentAssessId?: string;
  taughtSet: Set<string>;
  onSelectLesson: (k: number) => void;
  onSelectLab: (id: string) => void;
  onSelectTheory: () => void;
  onSelectStudio: () => void;
  onSelectAssess: (id: string) => void;
  lang: LangCode;
}

export const Sidebar: React.FC<SidebarProps> = ({
  term,
  lessons,
  units,
  assessments,
  labs,
  currentTab,
  currentLessonId,
  currentLabId,
  currentAssessId,
  taughtSet,
  onSelectLesson,
  onSelectLab,
  onSelectTheory,
  onSelectStudio,
  onSelectAssess,
  lang,
}) => {
  const [filterQuery, setFilterQuery] = useState('');

  const filteredLessons = useMemo(() => {
    if (!filterQuery.trim()) return lessons;
    const q = filterQuery.toLowerCase();
    return lessons.filter(l => 
      String(l.k).includes(q) || 
      l.title.toLowerCase().includes(q) ||
      (l.obj || []).some((o: string) => o.toLowerCase().includes(q))
    );
  }, [lessons, filterQuery]);

  let curUnit: string | null = null;

  return (
    <aside className="side">
      {/* Quick Lesson Filter */}
      <div className="relative mb-3">
        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
        <input
          type="text"
          placeholder="Сабақты іздеу..."
          value={filterQuery}
          onChange={e => setFilterQuery(e.target.value)}
          className="w-full pl-8 pr-2.5 py-1 text-xs bg-white border border-slate-200 rounded-md focus:outline-none focus:border-blue-500"
        />
      </div>

      <div className="flex items-center justify-between mb-1">
        <h4 className="flex items-center gap-1.5">
          <BookOpen className="w-3.5 h-3.5 text-blue-600" />
          <span>{t(lang, 'lessons')}</span>
        </h4>
        <span className="text-[11px] font-mono text-slate-400">
          {taughtSet.size}/{lessons.length}
        </span>
      </div>

      {filteredLessons.map(l => {
        let unitHeader = null;
        if (l.unit !== curUnit && !filterQuery) {
          curUnit = l.unit;
          const u = units.find(item => item.id === curUnit);
          unitHeader = u ? (
            <div key={`u-${u.id}`} className="unit">
              <i style={{ background: u.color }} />
              <span className="truncate">{u.code} {u.name}</span>
            </div>
          ) : (
            <div key="u-closure" className="unit">
              <i style={{ background: 'var(--ink)' }} />
              <span>{t(lang, 'closure')}</span>
            </div>
          );
        }

        const isTaught = taughtSet.has(`${term}-${l.k}`);
        const isCurrent = currentTab === 'lessons' && currentLessonId === l.k;
        const tag = l.sas || l.sat ? <span className="tag">{l.sas || l.sat}</span> : null;

        return (
          <React.Fragment key={l.k}>
            {unitHeader}
            <a
              href={`#${term}-lesson-${l.k}`}
              className={`item ${isTaught ? 'done' : ''}`}
              aria-current={isCurrent}
              onClick={e => {
                e.preventDefault();
                onSelectLesson(l.k);
              }}
            >
              <span>{l.k}</span>
              <span className="truncate">
                {l.title}
                {tag}
              </span>
            </a>
          </React.Fragment>
        );
      })}

      {/* Handbook / Theory */}
      <h4 className="flex items-center gap-1.5 mt-5">
        <Library className="w-3.5 h-3.5 text-purple-600" />
        <span>{t(lang, 'handbook')}</span>
      </h4>
      <a
        href={`#${term}-theory`}
        className="item"
        aria-current={currentTab === 'theory'}
        onClick={e => {
          e.preventDefault();
          onSelectTheory();
        }}
      >
        <span className="font-mono">§</span>
        <span>{t(lang, 'theoryItem')}</span>
      </a>

      {/* 3D Tools & Labs */}
      <h4 className="flex items-center gap-1.5 mt-5">
        <Compass className="w-3.5 h-3.5 text-amber-600" />
        <span>{t(lang, 'tools')}</span>
      </h4>
      <a
        href="#studio"
        className="item"
        aria-current={currentTab === 'studio'}
        onClick={e => {
          e.preventDefault();
          onSelectStudio();
        }}
      >
        <span className="text-blue-600">◆</span>
        <span>{t(lang, 'studio')}</span>
      </a>
      {labs
        .filter(l => l.term === term)
        .map(l => (
          <a
            key={l.id}
            href={`#lab-${l.id}`}
            className="item"
            aria-current={currentTab === 'labs' && currentLabId === l.id}
            onClick={e => {
              e.preventDefault();
              onSelectLab(l.id);
            }}
          >
            <span className="text-emerald-600">◇</span>
            <span className="truncate">{l.name}</span>
          </a>
        ))}

      {/* Summative Assessments */}
      <h4 className="flex items-center gap-1.5 mt-5">
        <FileCheck2 className="w-3.5 h-3.5 text-rose-600" />
        <span>{t(lang, 'assessment')}</span>
      </h4>
      {assessments.map(a => (
        <a
          key={a.id}
          href={`#${term}-${a.id}`}
          className="item"
          aria-current={currentTab === 'assessment' && currentAssessId === a.id}
          onClick={e => {
            e.preventDefault();
            onSelectAssess(a.id);
          }}
        >
          <span className="font-mono text-xs">{a.short}</span>
          <span className="truncate">{a.title}</span>
        </a>
      ))}
    </aside>
  );
};
