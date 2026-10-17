import React from 'react';
import { format, parseISO } from 'date-fns';
import { Flame } from 'lucide-react';
import { CalendarEvent } from '../../types/event';

interface EventChipProps {
  event: CalendarEvent;
  onClick?: (event: CalendarEvent) => void;
  compact?: boolean;
}

export const EventChip: React.FC<EventChipProps> = ({ event, onClick, compact = false }) => {
  const isSuperseded = event.status === 'superseded';
  const isPast = new Date(event.valid_until || event.due_at) < new Date();

  // Color tokens by event type
  const getTypeStyles = () => {
    switch (event.type) {
      case 'exam':
        return {
          bar: 'bg-rose-500',
          badge: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
          hover: 'hover:bg-rose-500/15',
        };
      case 'deadline':
        return {
          bar: 'bg-amber-500',
          badge: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
          hover: 'hover:bg-amber-500/15',
        };
      case 'event':
        return {
          bar: 'bg-blue-500',
          badge: 'bg-blue-500/10 text-blue-300 border-blue-500/30',
          hover: 'hover:bg-blue-500/15',
        };
      case 'other':
      default:
        return {
          bar: 'bg-slate-400',
          badge: 'bg-slate-800 text-slate-300 border-slate-700',
          hover: 'hover:bg-slate-800/80',
        };
    }
  };

  const styles = getTypeStyles();

  const formattedTime = event.all_day
    ? 'All day'
    : format(parseISO(event.due_at), 'h:mm a');

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onClick?.(event);
      }}
      title={`${event.title} • ${formattedTime} • ${event.subject}${
        event.location ? ` (${event.location})` : ''
      }${isSuperseded ? ' (Superseded)' : ''}`}
      className={`group relative flex items-center gap-1.5 rounded-lg border border-slate-800/80 bg-[#090E1A]/95 pl-1.5 pr-2 py-1 text-xs cursor-pointer select-none transition-all shadow-sm ${
        styles.hover
      } ${
        isSuperseded
          ? 'opacity-50 line-through grayscale-[30%] bg-slate-900/60'
          : isPast
          ? 'opacity-65'
          : ''
      } ${compact ? 'text-[11px] py-0.5' : ''}`}
    >
      {/* Left Color Bar */}
      <div className={`w-1 h-3.5 rounded-full shrink-0 ${styles.bar}`} />

      {/* Time */}
      <span className="font-mono text-[10px] text-slate-400 shrink-0 font-medium">
        {formattedTime}
      </span>

      {/* Title */}
      <span className="font-medium text-slate-200 truncate flex-1 leading-tight">
        {event.title}
      </span>

      {/* High Importance Marker */}
      {event.importance === 'high' && (
        <span title="High priority" className="shrink-0 flex items-center">
          <Flame className="w-3 h-3 text-rose-400" />
        </span>
      )}

      {/* Moved Label if Superseded */}
      {isSuperseded && (
        <span className="text-[9px] font-sans no-underline font-semibold text-amber-400 bg-amber-500/10 px-1 rounded">
          moved
        </span>
      )}
    </div>
  );
};

export default EventChip;
