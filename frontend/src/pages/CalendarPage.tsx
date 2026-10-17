import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Flame,
  Sparkles,
  RefreshCw,
  AlertCircle,
  Inbox,
  ArrowRight,
} from 'lucide-react';
import {
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  format,
  startOfWeek,
  endOfWeek,
  parseISO,
} from 'date-fns';

import { getEvents } from '../api/events';
import {
  CalendarEvent,
  CalendarViewMode,
  CalendarFilterState,
  EventType,
  EventImportance,
} from '../types/event';

import { MonthView } from '../components/calendar/MonthView';
import { WeekView } from '../components/calendar/WeekView';
import { AgendaView } from '../components/calendar/AgendaView';
import { CalendarFilters } from '../components/calendar/CalendarFilters';
import { EventDetailPanel } from '../components/calendar/EventDetailPanel';

const STORAGE_VIEW_KEY = 'campusmind_calendar_view';

export const CalendarPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // Current anchor date for calendar views
  const [currentDate, setCurrentDate] = useState<Date>(new Date());

  // View mode (Month, Week, Agenda) - responsive default and localStorage persistence
  const [viewMode, setViewMode] = useState<CalendarViewMode>(() => {
    const saved = localStorage.getItem(STORAGE_VIEW_KEY) as CalendarViewMode;
    if (saved && ['month', 'week', 'agenda'].includes(saved)) {
      return saved;
    }
    return typeof window !== 'undefined' && window.innerWidth < 768 ? 'agenda' : 'month';
  });

  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

  // Parse filters from URL search params
  const filters = useMemo<CalendarFilterState>(() => {
    const subjectsParam = searchParams.get('subjects');
    const typesParam = searchParams.get('types');
    const importanceParam = searchParams.get('importance');
    const changesParam = searchParams.get('changes');
    const pastParam = searchParams.get('past');

    return {
      subjects: subjectsParam ? subjectsParam.split(',').filter(Boolean) : [],
      types: (typesParam ? typesParam.split(',').filter(Boolean) : []) as EventType[],
      importance: (importanceParam ? importanceParam.split(',').filter(Boolean) : []) as EventImportance[],
      showChanges: changesParam === 'true',
      showPast: pastParam === 'true',
    };
  }, [searchParams]);

  // Synchronize filter updates with URL parameters
  const updateFilters = useCallback(
    (next: CalendarFilterState) => {
      const params = new URLSearchParams();
      if (next.subjects.length > 0) params.set('subjects', next.subjects.join(','));
      if (next.types.length > 0) params.set('types', next.types.join(','));
      if (next.importance.length > 0) params.set('importance', next.importance.join(','));
      if (next.showChanges) params.set('changes', 'true');
      if (next.showPast) params.set('past', 'true');

      setSearchParams(params, { replace: true });
    },
    [setSearchParams]
  );

  const clearFilters = useCallback(() => {
    setSearchParams(new URLSearchParams(), { replace: true });
  }, [setSearchParams]);

  // Handle View Switch
  const handleViewChange = (mode: CalendarViewMode) => {
    setViewMode(mode);
    try {
      localStorage.setItem(STORAGE_VIEW_KEY, mode);
    } catch {
      // Ignore localStorage errors
    }
  };

  // Fetch all calendar events
  const loadEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Request all events including superseded ones so lifecycle filtering is responsive client-side
      const data = await getEvents({ include_superseded: true });
      setEvents(data);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to load events. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadEvents();
  }, [loadEvents]);

  // Navigation handlers
  const handlePrev = () => {
    if (viewMode === 'month' || viewMode === 'agenda') {
      setCurrentDate((prev) => subMonths(prev, 1));
    } else if (viewMode === 'week') {
      setCurrentDate((prev) => subWeeks(prev, 1));
    }
  };

  const handleNext = () => {
    if (viewMode === 'month' || viewMode === 'agenda') {
      setCurrentDate((prev) => addMonths(prev, 1));
    } else if (viewMode === 'week') {
      setCurrentDate((prev) => addWeeks(prev, 1));
    }
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  // Extract all distinct available subjects for filtering
  const availableSubjects = useMemo(() => {
    const set = new Set<string>();
    events.forEach((e) => {
      if (e.subject) set.add(e.subject);
    });
    return Array.from(set).sort();
  }, [events]);

  // Apply filters to events
  const filteredEvents = useMemo(() => {
    const now = new Date();

    return events.filter((e) => {
      // Deleted events never appear
      if (e.status === 'deleted') return false;

      // Superseded events logic
      if (e.status === 'superseded' && !filters.showChanges) {
        return false;
      }

      // Past events logic
      const isPast = new Date(e.valid_until || e.due_at) < now;
      if (isPast && !filters.showPast) {
        return false;
      }

      // Subject filter
      if (filters.subjects.length > 0 && !filters.subjects.includes(e.subject)) {
        return false;
      }

      // Type filter
      if (filters.types.length > 0 && !filters.types.includes(e.type)) {
        return false;
      }

      // Importance filter
      if (filters.importance.length > 0 && !filters.importance.includes(e.importance)) {
        return false;
      }

      return true;
    });
  }, [events, filters]);

  // "Next up" upcoming active events (Next 3)
  const nextUpEvents = useMemo(() => {
    const now = new Date();
    return events
      .filter((e) => {
        if (e.status !== 'active') return false;
        if (new Date(e.due_at) < now) return false;

        // Apply active criteria filters to next-up strip
        if (filters.subjects.length > 0 && !filters.subjects.includes(e.subject)) return false;
        if (filters.types.length > 0 && !filters.types.includes(e.type)) return false;
        if (filters.importance.length > 0 && !filters.importance.includes(e.importance)) return false;

        return true;
      })
      .sort((a, b) => new Date(a.due_at).getTime() - new Date(b.due_at).getTime())
      .slice(0, 3);
  }, [events, filters]);

  // Header Title based on view mode and current date
  const headerDateLabel = useMemo(() => {
    if (viewMode === 'month' || viewMode === 'agenda') {
      return format(currentDate, 'MMMM yyyy');
    }
    const start = startOfWeek(currentDate, { weekStartsOn: 1 });
    const end = endOfWeek(currentDate, { weekStartsOn: 1 });
    return `${format(start, 'MMM d')} – ${format(end, 'MMM d, yyyy')}`;
  }, [currentDate, viewMode]);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* Page Title & Controls Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800/60">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <CalendarIcon className="w-6 h-6 text-blue-400" />
            <span>Academic Calendar</span>
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Synchronized schedule of examinations, assignment deadlines, and campus events.
          </p>
        </div>

        {/* View Switcher & Refresh */}
        <div className="flex items-center gap-2 self-start md:self-auto">
          {/* View Switcher */}
          <div className="flex items-center p-1 bg-[#060B14] border border-slate-800 rounded-xl text-xs font-medium">
            <button
              type="button"
              onClick={() => handleViewChange('month')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'month'
                  ? 'bg-slate-800 text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Month
            </button>
            <button
              type="button"
              onClick={() => handleViewChange('week')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'week'
                  ? 'bg-slate-800 text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Week
            </button>
            <button
              type="button"
              onClick={() => handleViewChange('agenda')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                viewMode === 'agenda'
                  ? 'bg-slate-800 text-white shadow-sm font-semibold'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Agenda
            </button>
          </div>

          <button
            type="button"
            onClick={loadEvents}
            disabled={loading}
            className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 transition-colors focus:outline-none"
            title="Refresh events"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-blue-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* Date Navigation & Month/Week Title */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-[#090E1A] border border-slate-800 rounded-xl p-3">
        <div className="flex items-center gap-2">
          {/* Previous Button */}
          <button
            type="button"
            onClick={handlePrev}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800 transition-colors focus:outline-none"
            title="Previous"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          {/* Today Button */}
          <button
            type="button"
            onClick={handleToday}
            className="px-3 py-1 text-xs font-semibold rounded-lg bg-slate-800 text-slate-200 hover:text-white hover:bg-slate-700/80 border border-slate-700/60 transition-colors focus:outline-none"
          >
            Today
          </button>

          {/* Next Button */}
          <button
            type="button"
            onClick={handleNext}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-800 transition-colors focus:outline-none"
            title="Next"
          >
            <ChevronRight className="w-4 h-4" />
          </button>

          <span className="text-sm sm:text-base font-bold text-white ml-2 tracking-tight">
            {headerDateLabel}
          </span>
        </div>
      </div>

      {/* "Next up" Upcoming Active Events Strip */}
      {nextUpEvents.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>Next up</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {nextUpEvents.map((evt) => (
              <div
                key={`nextup-${evt.id}`}
                onClick={() => setSelectedEvent(evt)}
                className="group p-3 rounded-xl bg-[#090E1A] hover:bg-[#0E1626] border border-slate-800 hover:border-blue-500/40 transition-all cursor-pointer shadow-sm flex items-center justify-between select-none"
              >
                <div className="space-y-1 min-w-0 pr-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-[9px] font-bold uppercase px-1.5 py-0.2 rounded-full border ${
                        evt.type === 'exam'
                          ? 'text-rose-400 bg-rose-500/10 border-rose-500/25'
                          : evt.type === 'deadline'
                          ? 'text-amber-400 bg-amber-500/10 border-amber-500/25'
                          : evt.type === 'event'
                          ? 'text-blue-400 bg-blue-500/10 border-blue-500/25'
                          : 'text-slate-400 bg-slate-800 border-slate-700'
                      }`}
                    >
                      {evt.type}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      {evt.all_day ? 'All day' : format(parseISO(evt.due_at), 'MMM d, h:mm a')}
                    </span>
                  </div>

                  <div className="font-semibold text-xs text-slate-100 group-hover:text-blue-300 transition-colors truncate">
                    {evt.title}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {evt.importance === 'high' && (
                    <span title="High priority" className="flex items-center">
                      <Flame className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                    </span>
                  )}
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-white transition-colors" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Calendar Filters Bar */}
      <CalendarFilters
        filters={filters}
        availableSubjects={availableSubjects}
        onChange={updateFilters}
        onClear={clearFilters}
      />

      {/* Error State */}
      {error && (
        <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-300 flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-xs font-medium">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            <span>{error}</span>
          </div>
          <button
            type="button"
            onClick={loadEvents}
            className="px-3 py-1 bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 text-xs font-semibold rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      )}

      {/* Loading Skeletons */}
      {loading && (
        <div className="w-full bg-[#090E1A] border border-slate-800 rounded-2xl p-6 space-y-4 animate-pulse">
          <div className="h-8 bg-slate-800/60 rounded-xl w-48" />
          <div className="grid grid-cols-7 gap-2">
            {[...Array(7)].map((_, i) => (
              <div key={i} className="h-6 bg-slate-800/40 rounded" />
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {[...Array(28)].map((_, i) => (
              <div key={i} className="h-24 bg-slate-800/30 rounded-xl" />
            ))}
          </div>
        </div>
      )}

      {/* Views */}
      {!loading && !error && (
        <>
          {filteredEvents.length === 0 && viewMode === 'agenda' ? (
            <div className="w-full bg-[#090E1A] border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
              <Inbox className="w-12 h-12 mx-auto mb-3 text-slate-600" />
              <h3 className="text-base font-semibold text-slate-200 mb-1">
                No upcoming events
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
                Forward an exam date or deadline to the CampusMind bot and it will show up here.
              </p>
            </div>
          ) : viewMode === 'month' ? (
            <MonthView
              currentDate={currentDate}
              events={filteredEvents}
              onSelectEvent={setSelectedEvent}
              onOpenDayInAgenda={(day) => {
                setCurrentDate(day);
                handleViewChange('agenda');
              }}
            />
          ) : viewMode === 'week' ? (
            <WeekView
              currentDate={currentDate}
              events={filteredEvents}
              onSelectEvent={setSelectedEvent}
            />
          ) : (
            <AgendaView
              events={filteredEvents}
              allEvents={events}
              onSelectEvent={setSelectedEvent}
            />
          )}
        </>
      )}

      {/* Event Detail Panel */}
      <EventDetailPanel
        event={selectedEvent}
        allEvents={events}
        onClose={() => setSelectedEvent(null)}
        onSelectEvent={setSelectedEvent}
      />
    </div>
  );
};

export default CalendarPage;
