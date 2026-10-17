import React from 'react';
import { Filter, X, Eye, History } from 'lucide-react';
import { EventType, EventImportance, CalendarFilterState } from '../../types/event';

interface CalendarFiltersProps {
  filters: CalendarFilterState;
  availableSubjects: string[];
  onChange: (nextFilters: CalendarFilterState) => void;
  onClear: () => void;
}

const EVENT_TYPES: { id: EventType; label: string; color: string }[] = [
  { id: 'exam', label: 'Exam', color: 'border-rose-500/40 text-rose-300' },
  { id: 'deadline', label: 'Deadline', color: 'border-amber-500/40 text-amber-300' },
  { id: 'event', label: 'Event', color: 'border-blue-500/40 text-blue-300' },
  { id: 'other', label: 'Other', color: 'border-slate-500/40 text-slate-300' },
];

const IMPORTANCE_LEVELS: { id: EventImportance; label: string }[] = [
  { id: 'high', label: 'High Priority' },
  { id: 'medium', label: 'Medium' },
  { id: 'low', label: 'Low' },
];

export const CalendarFilters: React.FC<CalendarFiltersProps> = ({
  filters,
  availableSubjects,
  onChange,
  onClear,
}) => {
  const activeCount =
    filters.subjects.length +
    filters.types.length +
    filters.importance.length +
    (filters.showChanges ? 1 : 0) +
    (filters.showPast ? 1 : 0);

  const toggleSubject = (subject: string) => {
    const exists = filters.subjects.includes(subject);
    const next = exists
      ? filters.subjects.filter((s) => s !== subject)
      : [...filters.subjects, subject];
    onChange({ ...filters, subjects: next });
  };

  const toggleType = (type: EventType) => {
    const exists = filters.types.includes(type);
    const next = exists
      ? filters.types.filter((t) => t !== type)
      : [...filters.types, type];
    onChange({ ...filters, types: next });
  };

  const toggleImportance = (level: EventImportance) => {
    const exists = filters.importance.includes(level);
    const next = exists
      ? filters.importance.filter((i) => i !== level)
      : [...filters.importance, level];
    onChange({ ...filters, importance: next });
  };

  return (
    <div className="bg-[#090E1A] border border-slate-800 rounded-xl p-3.5 space-y-3 shadow-sm select-none">
      <div className="flex flex-wrap items-center justify-between gap-2.5 pb-2 border-b border-slate-800/60">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
          <Filter className="w-3.5 h-3.5 text-blue-400" />
          <span>Filters</span>
          {activeCount > 0 && (
            <span className="bg-blue-600/20 text-blue-400 border border-blue-500/30 text-[10px] font-bold px-1.5 py-0.2 rounded-full">
              {activeCount}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* Show changes toggle */}
          <button
            type="button"
            onClick={() => onChange({ ...filters, showChanges: !filters.showChanges })}
            className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg border transition-all ${
              filters.showChanges
                ? 'bg-amber-500/10 border-amber-500/40 text-amber-300 font-medium'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            title="Reveal superseded and rescheduled events"
          >
            <History className="w-3 h-3" />
            <span>Show changes</span>
          </button>

          {/* Show past events toggle */}
          <button
            type="button"
            onClick={() => onChange({ ...filters, showPast: !filters.showPast })}
            className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg border transition-all ${
              filters.showPast
                ? 'bg-blue-500/10 border-blue-500/40 text-blue-300 font-medium'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            title="Display past events that have passed valid_until"
          >
            <Eye className="w-3 h-3" />
            <span>Show past</span>
          </button>

          {/* Clear button */}
          {activeCount > 0 && (
            <button
              type="button"
              onClick={onClear}
              className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 font-medium transition-colors"
            >
              <X className="w-3 h-3" />
              <span>Clear</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Row: Type, Subject, Importance */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs">
        {/* Type Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider mr-1">
            Type:
          </span>
          {EVENT_TYPES.map((t) => {
            const isSelected = filters.types.includes(t.id);
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => toggleType(t.id)}
                className={`px-2 py-0.5 rounded-md border text-[11px] font-medium transition-colors ${
                  isSelected
                    ? `${t.color} bg-slate-800 shadow-sm`
                    : 'border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Subject Filter Pills */}
        {availableSubjects.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider mr-1">
              Subject:
            </span>
            {availableSubjects.map((sub) => {
              const isSelected = filters.subjects.includes(sub);
              return (
                <button
                  key={sub}
                  type="button"
                  onClick={() => toggleSubject(sub)}
                  className={`px-2 py-0.5 rounded-md border text-[11px] font-medium transition-colors ${
                    isSelected
                      ? 'border-blue-500/40 text-blue-300 bg-blue-950/30'
                      : 'border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  {sub}
                </button>
              );
            })}
          </div>
        )}

        {/* Importance Filter Pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] font-medium text-slate-500 uppercase tracking-wider mr-1">
            Priority:
          </span>
          {IMPORTANCE_LEVELS.map((imp) => {
            const isSelected = filters.importance.includes(imp.id);
            return (
              <button
                key={imp.id}
                type="button"
                onClick={() => toggleImportance(imp.id)}
                className={`px-2 py-0.5 rounded-md border text-[11px] font-medium transition-colors ${
                  isSelected
                    ? 'border-purple-500/40 text-purple-300 bg-purple-950/30'
                    : 'border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                }`}
              >
                {imp.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CalendarFilters;
