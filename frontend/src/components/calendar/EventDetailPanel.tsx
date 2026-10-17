import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import {
  X,
  Calendar,
  Clock,
  MapPin,
  Folder,
  Flame,
  Bell,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  ArrowRight,
  MessageSquare,
  FileText,
  Mail,
  Globe,
} from 'lucide-react';
import { CalendarEvent } from '../../types/event';

interface EventDetailPanelProps {
  event: CalendarEvent | null;
  allEvents: CalendarEvent[];
  onClose: () => void;
  onSelectEvent: (event: CalendarEvent) => void;
}

export const EventDetailPanel: React.FC<EventDetailPanelProps> = ({
  event,
  allEvents,
  onClose,
  onSelectEvent,
}) => {
  const navigate = useNavigate();

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (event) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [event, onClose]);

  if (!event) return null;

  const eventDate = parseISO(event.due_at);
  const now = new Date();

  // Find superseded / replacement events if applicable
  const oldEvent = event.supersedes_id
    ? allEvents.find((e) => e.id === event.supersedes_id)
    : null;
  const newEvent = event.superseded_by_id
    ? allEvents.find((e) => e.id === event.superseded_by_id)
    : null;

  // Source icon helper
  const getSourceIcon = (sourceType: string) => {
    switch (sourceType) {
      case 'telegram':
      case 'whatsapp':
        return <MessageSquare className="w-4 h-4 text-emerald-400" />;
      case 'pdf':
      case 'image':
        return <FileText className="w-4 h-4 text-amber-400" />;
      case 'email':
        return <Mail className="w-4 h-4 text-blue-400" />;
      case 'web':
      default:
        return <Globe className="w-4 h-4 text-purple-400" />;
    }
  };

  // Reminder status helper
  const getReminderStatus = (isSent: boolean, reminderAt?: string, hoursBefore = 24) => {
    if (isSent && reminderAt) {
      return {
        label: 'Sent',
        detail: format(parseISO(reminderAt), 'MMM d, h:mm a'),
        icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />,
        badge: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
      };
    }

    if (now > eventDate) {
      return {
        label: 'Not needed',
        detail: 'Event is in the past',
        icon: <Clock className="w-3.5 h-3.5 text-slate-500" />,
        badge: 'text-slate-400 bg-slate-800/80 border-slate-700',
      };
    }

    if (reminderAt) {
      return {
        label: 'Pending',
        detail: `Scheduled for ${format(parseISO(reminderAt), 'MMM d, h:mm a')}`,
        icon: <Clock className="w-3.5 h-3.5 text-blue-400" />,
        badge: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
      };
    }

    return {
      label: 'Scheduled',
      detail: `${hoursBefore} hours before event`,
      icon: <Clock className="w-3.5 h-3.5 text-slate-400" />,
      badge: 'text-slate-400 bg-slate-800 border-slate-700',
    };
  };

  const status24h = getReminderStatus(event.reminded_24h, event.reminder_24h_at, 24);
  const status2h = getReminderStatus(event.reminded_2h, event.reminder_2h_at, 2);

  const getTypeBadgeClass = () => {
    switch (event.type) {
      case 'exam':
        return 'text-rose-400 bg-rose-500/10 border-rose-500/20';
      case 'deadline':
        return 'text-amber-400 bg-amber-500/10 border-amber-500/20';
      case 'event':
        return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
      case 'other':
      default:
        return 'text-slate-400 bg-slate-800 border-slate-700';
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm transition-opacity"
      onClick={onClose}
    >
      {/* Slide-over panel on desktop, bottom sheet on mobile */}
      <div
        className="w-full md:max-w-md bg-[#090E1A] border-t md:border-t-0 md:border-l border-slate-800 h-[85vh] md:h-full flex flex-col shadow-2xl overflow-y-auto animate-slideLeft fixed bottom-0 md:relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Panel Header */}
        <div className="p-5 border-b border-slate-800/80 flex items-center justify-between sticky top-0 bg-[#090E1A]/95 backdrop-blur z-10">
          <div className="flex items-center gap-2">
            <span
              className={`text-[11px] font-semibold tracking-wider uppercase px-2.5 py-0.5 rounded-full border ${getTypeBadgeClass()}`}
            >
              {event.type}
            </span>

            {event.importance === 'high' && (
              <span className="flex items-center gap-1 text-[11px] font-medium text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-full">
                <Flame className="w-3 h-3 text-rose-400" />
                High Priority
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors focus:outline-none"
            aria-label="Close panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Panel Body */}
        <div className="p-6 space-y-6 flex-1">
          {/* Superseded Notices */}
          {event.status === 'superseded' && (
            <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/25 flex items-start gap-2.5 text-xs text-amber-300">
              <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="font-semibold text-amber-200">
                  This event was rescheduled
                </div>
                {newEvent ? (
                  <div>
                    Replaced by{' '}
                    <button
                      type="button"
                      onClick={() => onSelectEvent(newEvent)}
                      className="font-semibold underline text-amber-300 hover:text-white inline-flex items-center gap-1"
                    >
                      <span>
                        {format(parseISO(newEvent.due_at), 'MMMM d, yyyy')}
                      </span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <div>Replaced by a newer schedule item.</div>
                )}
              </div>
            </div>
          )}

          {/* Replacement Notice (Moved from old date) */}
          {oldEvent && (
            <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/25 text-xs text-blue-300 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                <span>
                  Moved from{' '}
                  <span className="line-through text-slate-400">
                    {format(parseISO(oldEvent.due_at), 'MMMM d, yyyy')}
                  </span>
                </span>
              </div>
              <button
                type="button"
                onClick={() => onSelectEvent(oldEvent)}
                className="text-[11px] underline text-blue-400 hover:text-white font-medium"
              >
                View previous
              </button>
            </div>
          )}

          {/* Title & Timing */}
          <div className="space-y-2">
            <h2 className="text-xl font-bold text-white tracking-tight leading-snug">
              {event.title}
            </h2>

            <div className="flex items-center gap-2 text-xs text-slate-300 font-medium pt-1">
              <Calendar className="w-4 h-4 text-blue-400 shrink-0" />
              <span>
                {format(eventDate, 'EEEE, MMMM d, yyyy')}
              </span>
            </div>

            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Clock className="w-4 h-4 text-slate-500 shrink-0" />
              <span>
                {event.all_day
                  ? 'All day event'
                  : format(eventDate, 'h:mm a (z)')}
              </span>
            </div>

            {event.location && (
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <MapPin className="w-4 h-4 text-slate-500 shrink-0" />
                <span>{event.location}</span>
              </div>
            )}

            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Folder className="w-4 h-4 text-slate-500 shrink-0" />
              <span>Subject: {event.subject}</span>
            </div>
          </div>

          {/* Summary / Notes */}
          <div className="space-y-2 pt-2 border-t border-slate-800/80">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Summary
            </h4>
            <p className="text-xs text-slate-200 leading-relaxed bg-[#060B14] p-3.5 rounded-xl border border-slate-800">
              {event.summary}
            </p>
          </div>

          {/* Reminder Status Section */}
          <div className="space-y-3 pt-2 border-t border-slate-800/80">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">
              <Bell className="w-3.5 h-3.5 text-blue-400" />
              <span>Reminders</span>
            </div>

            <div className="space-y-2">
              {/* 24 Hours Before */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
                <div className="space-y-0.5">
                  <div className="font-medium text-slate-200">24 hours before</div>
                  <div className="text-[11px] text-slate-400">{status24h.detail}</div>
                </div>
                <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${status24h.badge}`}>
                  {status24h.icon}
                  <span>{status24h.label}</span>
                </div>
              </div>

              {/* 2 Hours Before */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
                <div className="space-y-0.5">
                  <div className="font-medium text-slate-200">2 hours before</div>
                  <div className="text-[11px] text-slate-400">{status2h.detail}</div>
                </div>
                <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${status2h.badge}`}>
                  {status2h.icon}
                  <span>{status2h.label}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Source Card */}
          <div className="space-y-3 pt-2 border-t border-slate-800/80">
            <h4 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Source & Provenance
            </h4>

            <div className="p-3.5 rounded-xl bg-[#060B14] border border-slate-800 text-xs space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-slate-300 font-medium">
                  {getSourceIcon(event.source_type)}
                  <span className="capitalize">{event.source_type} forward</span>
                </div>
                <span className="text-[11px] text-slate-500">
                  Saved {format(parseISO(event.source_saved_at), 'MMM d, yyyy')}
                </span>
              </div>

              <div className="border-t border-slate-800/60 pt-2 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  Linked to memory <span className="font-mono text-slate-300">#{event.memory_id.substring(0, 10)}</span>
                </span>
                <button
                  type="button"
                  onClick={() => {
                    navigate(`/?openMemory=${event.memory_id}`);
                  }}
                  className="text-xs text-blue-400 hover:text-blue-300 font-medium inline-flex items-center gap-1 hover:underline"
                >
                  <span>View original</span>
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetailPanel;
