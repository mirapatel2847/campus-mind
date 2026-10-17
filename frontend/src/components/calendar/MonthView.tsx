import React from 'react';
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isSameMonth,
  isToday,
  isSameDay,
  format,
  parseISO,
} from 'date-fns';
import { CalendarEvent } from '../../types/event';
import { EventChip } from './EventChip';

interface MonthViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onSelectEvent: (event: CalendarEvent) => void;
  onOpenDayInAgenda: (day: Date) => void;
}

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export const MonthView: React.FC<MonthViewProps> = ({
  currentDate,
  events,
  onSelectEvent,
  onOpenDayInAgenda,
}) => {
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const calendarDays = eachDayOfInterval({ start: calendarStart, end: calendarEnd });

  return (
    <div className="w-full bg-[#090E1A] border border-slate-800 rounded-2xl overflow-hidden shadow-xl select-none">
      {/* Weekday Headers */}
      <div className="grid grid-cols-7 border-b border-slate-800 bg-[#060B14] text-center text-xs font-semibold text-slate-400 py-3">
        {WEEKDAYS.map((day) => (
          <div key={day} className="uppercase tracking-wider text-[11px]">
            {day}
          </div>
        ))}
      </div>

      {/* 7-Column Calendar Grid */}
      <div className="grid grid-cols-7 auto-rows-fr divide-x divide-y divide-slate-800/80 bg-slate-900/30">
        {calendarDays.map((day) => {
          const isCurrentMonth = isSameMonth(day, currentDate);
          const isCurrentDay = isToday(day);

          // Find events for this day
          const dayEvents = events.filter((e) => isSameDay(parseISO(e.due_at), day));
          const visibleEvents = dayEvents.slice(0, 3);
          const remainingCount = dayEvents.length - 3;

          return (
            <div
              key={day.toISOString()}
              className={`min-h-[110px] sm:min-h-[125px] p-2 flex flex-col justify-between transition-colors ${
                isCurrentMonth ? 'bg-[#090E1A]' : 'bg-[#060B14]/70 opacity-40'
              }`}
            >
              {/* Day Header */}
              <div className="flex items-center justify-between mb-1.5">
                <span
                  className={`text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full ${
                    isCurrentDay
                      ? 'bg-blue-600 text-white font-bold ring-2 ring-blue-500/40'
                      : isCurrentMonth
                      ? 'text-slate-300'
                      : 'text-slate-600'
                  }`}
                >
                  {format(day, 'd')}
                </span>

                {dayEvents.length > 0 && (
                  <span className="text-[10px] text-slate-500 font-mono hidden sm:inline">
                    {dayEvents.length} {dayEvents.length === 1 ? 'item' : 'items'}
                  </span>
                )}
              </div>

              {/* Event Chips List (up to 3) */}
              <div className="space-y-1 flex-1 overflow-hidden">
                {visibleEvents.map((evt) => (
                  <EventChip
                    key={evt.id}
                    event={evt}
                    compact
                    onClick={onSelectEvent}
                  />
                ))}
              </div>

              {/* "+N more" link */}
              {remainingCount > 0 && (
                <div className="pt-1 mt-auto">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenDayInAgenda(day);
                    }}
                    className="text-[10px] text-blue-400 hover:text-blue-300 font-medium hover:underline block w-full text-left"
                  >
                    +{remainingCount} more
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MonthView;
