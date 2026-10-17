import React from 'react';
import {
  isToday,
  isTomorrow,
  isYesterday,
  format,
  parseISO,
} from 'date-fns';
import { Calendar, MapPin, Folder, Flame, ArrowRight } from 'lucide-react';
import { CalendarEvent } from '../../types/event';

interface AgendaViewProps {
  events: CalendarEvent[];
  allEvents: CalendarEvent[];
  onSelectEvent: (event: CalendarEvent) => void;
}

export const AgendaView: React.FC<AgendaViewProps> = ({
  events,
  allEvents,
  onSelectEvent,
}) => {
  // Sort events chronologically
  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.due_at).getTime() - new Date(b.due_at).getTime()
  );

  // Group events by YYYY-MM-DD
  const groupedEvents: Record<string, CalendarEvent[]> = {};
  sortedEvents.forEach((evt) => {
    const key = format(parseISO(evt.due_at), 'yyyy-MM-dd');
    if (!groupedEvents[key]) {
      groupedEvents[key] = [];
    }
    groupedEvents[key].push(evt);
  });

  const groupKeys = Object.keys(groupedEvents);

  const getGroupTitle = (dateStr: string) => {
    const date = parseISO(dateStr);
    if (isToday(date)) {
      return `Today • ${format(date, 'EEEE, MMMM d')}`;
    }
    if (isTomorrow(date)) {
      return `Tomorrow • ${format(date, 'EEEE, MMMM d')}`;
    }
    if (isYesterday(date)) {
      return `Yesterday • ${format(date, 'EEEE, MMMM d')}`;
    }
    return format(date, 'EEEE, MMMM d, yyyy');
  };

  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'exam':
        return {
          bar: 'bg-rose-500',
          badge: 'text-rose-400 bg-rose-500/10 border-rose-500/20',
        };
      case 'deadline':
        return {
          bar: 'bg-amber-500',
          badge: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
        };
      case 'event':
        return {
          bar: 'bg-blue-500',
          badge: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
        };
      case 'other':
      default:
        return {
          bar: 'bg-slate-400',
          badge: 'text-slate-400 bg-slate-800 border-slate-700',
        };
    }
  };

  if (groupKeys.length === 0) {
    return (
      <div className="w-full bg-[#090E1A] border border-slate-800 rounded-2xl p-12 text-center text-slate-400">
        <Calendar className="w-10 h-10 mx-auto mb-3 text-slate-600" />
        <h3 className="text-base font-semibold text-slate-200">No events found</h3>
        <p className="text-xs text-slate-500 mt-1">
          Adjust your filters or toggle "Show past events" to view completed events.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 select-none">
      {groupKeys.map((dateKey) => {
        const dayEvents = groupedEvents[dateKey];
        const dateObj = parseISO(dateKey);
        const isCurrentDay = isToday(dateObj);

        return (
          <div
            key={dateKey}
            className="bg-[#090E1A] border border-slate-800 rounded-2xl overflow-hidden shadow-lg"
          >
            {/* Date Group Header */}
            <div
              className={`px-5 py-3 border-b border-slate-800 flex items-center justify-between text-xs font-semibold ${
                isCurrentDay
                  ? 'bg-blue-950/30 text-blue-300'
                  : 'bg-[#060B14] text-slate-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <Calendar className={`w-4 h-4 ${isCurrentDay ? 'text-blue-400' : 'text-slate-500'}`} />
                <span>{getGroupTitle(dateKey)}</span>
              </div>
              <span className="text-[11px] font-mono text-slate-500">
                {dayEvents.length} {dayEvents.length === 1 ? 'event' : 'events'}
              </span>
            </div>

            {/* Event Rows */}
            <div className="divide-y divide-slate-800/60">
              {dayEvents.map((evt) => {
                const isSuperseded = evt.status === 'superseded';
                const isPast = new Date(evt.valid_until || evt.due_at) < new Date();
                const styles = getTypeStyles(evt.type);

                // Check replacement event if superseded
                const replacement = evt.superseded_by_id
                  ? allEvents.find((e) => e.id === evt.superseded_by_id)
                  : null;

                return (
                  <div
                    key={evt.id}
                    onClick={() => onSelectEvent(evt)}
                    className={`group p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#0E1626] transition-colors cursor-pointer ${
                      isSuperseded ? 'opacity-50 line-through bg-slate-900/40' : isPast ? 'opacity-65' : ''
                    }`}
                  >
                    {/* Left: Color Bar + Time + Title */}
                    <div className="flex items-start sm:items-center gap-3 flex-1 min-w-0">
                      <div className={`w-1 h-8 sm:h-5 rounded-full shrink-0 ${styles.bar}`} />

                      <div className="w-20 shrink-0 font-mono text-xs text-slate-400 font-medium">
                        {evt.all_day ? 'All day' : format(parseISO(evt.due_at), 'h:mm a')}
                      </div>

                      <div className="flex-1 min-w-0 space-y-1 sm:space-y-0 sm:flex sm:items-center sm:gap-2.5">
                        <span className="font-semibold text-slate-100 text-sm group-hover:text-blue-300 transition-colors truncate block">
                          {evt.title}
                        </span>

                        {isSuperseded && replacement && (
                          <span className="no-underline text-[11px] font-sans text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20 inline-flex items-center gap-1">
                            <span>Moved to {format(parseISO(replacement.due_at), 'MMM d')}</span>
                            <ArrowRight className="w-2.5 h-2.5" />
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Right: Badges, Subject, Location */}
                    <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-auto text-xs no-underline">
                      {/* High Importance Marker */}
                      {evt.importance === 'high' && (
                        <div
                          className="flex items-center gap-1 text-[10px] font-medium text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/20"
                          title="High priority"
                        >
                          <Flame className="w-3 h-3 text-rose-400" />
                          <span className="hidden sm:inline">High</span>
                        </div>
                      )}

                      {/* Subject */}
                      <div className="flex items-center gap-1 text-slate-400 bg-slate-800/80 px-2.5 py-0.5 rounded-full border border-slate-700/60 text-[11px]">
                        <Folder className="w-3 h-3 text-slate-500" />
                        <span>{evt.subject}</span>
                      </div>

                      {/* Location if present */}
                      {evt.location && (
                        <div className="hidden md:flex items-center gap-1 text-slate-400 max-w-[150px] truncate text-[11px]">
                          <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                          <span className="truncate">{evt.location}</span>
                        </div>
                      )}

                      {/* Type Badge */}
                      <span
                        className={`text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full border ${styles.badge}`}
                      >
                        {evt.type}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AgendaView;
