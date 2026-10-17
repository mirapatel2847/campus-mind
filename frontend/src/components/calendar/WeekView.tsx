import React from 'react';
import {
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isToday,
  isSameDay,
  format,
  parseISO,
} from 'date-fns';
import { CalendarEvent } from '../../types/event';
import { EventChip } from './EventChip';

interface WeekViewProps {
  currentDate: Date;
  events: CalendarEvent[];
  onSelectEvent: (event: CalendarEvent) => void;
}

export const WeekView: React.FC<WeekViewProps> = ({
  currentDate,
  events,
  onSelectEvent,
}) => {
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  return (
    <div className="w-full bg-[#090E1A] border border-slate-800 rounded-2xl overflow-hidden shadow-xl select-none flex flex-col">
      {/* 7 Day Column Headers */}
      <div className="grid grid-cols-7 border-b border-slate-800 bg-[#060B14]">
        {weekDays.map((day) => {
          const isCurrentDay = isToday(day);
          return (
            <div
              key={day.toISOString()}
              className={`p-3 text-center border-r last:border-r-0 border-slate-800/80 ${
                isCurrentDay ? 'bg-blue-950/20' : ''
              }`}
            >
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                {format(day, 'EEE')}
              </div>
              <div
                className={`text-sm font-bold mt-1 inline-flex items-center justify-center w-7 h-7 rounded-full ${
                  isCurrentDay
                    ? 'bg-blue-600 text-white ring-2 ring-blue-500/40'
                    : 'text-slate-200'
                }`}
              >
                {format(day, 'd')}
              </div>
            </div>
          );
        })}
      </div>

      {/* All-Day Events Section at Top */}
      <div className="grid grid-cols-7 border-b border-slate-800/80 bg-slate-900/30 min-h-[44px]">
        {weekDays.map((day) => {
          const allDayEvents = events.filter(
            (e) => isSameDay(parseISO(e.due_at), day) && e.all_day
          );

          return (
            <div
              key={`allday-${day.toISOString()}`}
              className="p-1.5 border-r last:border-r-0 border-slate-800/80 space-y-1"
            >
              {allDayEvents.map((evt) => (
                <EventChip
                  key={evt.id}
                  event={evt}
                  compact
                  onClick={onSelectEvent}
                />
              ))}
            </div>
          );
        })}
      </div>

      {/* Timed Events Listed in Time Order */}
      <div className="grid grid-cols-7 divide-x divide-slate-800/80 min-h-[450px]">
        {weekDays.map((day) => {
          const isCurrentDay = isToday(day);

          // Get timed events for this day, sorted chronologically
          const timedEvents = events
            .filter((e) => isSameDay(parseISO(e.due_at), day) && !e.all_day)
            .sort((a, b) => new Date(a.due_at).getTime() - new Date(b.due_at).getTime());

          return (
            <div
              key={`timed-${day.toISOString()}`}
              className={`p-2 space-y-1.5 transition-colors ${
                isCurrentDay ? 'bg-blue-950/10' : 'bg-[#090E1A]'
              }`}
            >
              {timedEvents.length === 0 ? (
                <div className="h-full flex items-center justify-center text-[11px] text-slate-600 italic py-10">
                  No events
                </div>
              ) : (
                timedEvents.map((evt) => (
                  <EventChip
                    key={evt.id}
                    event={evt}
                    onClick={onSelectEvent}
                  />
                ))
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeekView;
