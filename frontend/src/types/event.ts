export type EventType = 'exam' | 'deadline' | 'event' | 'other';
export type EventImportance = 'high' | 'medium' | 'low';
export type EventStatus = 'active' | 'superseded' | 'deleted';
export type EventSourceType = 'telegram' | 'whatsapp' | 'pdf' | 'image' | 'email' | 'web';

export interface CalendarEvent {
  id: string;
  memory_id: string;
  title: string;
  type: EventType;
  due_at: string; // ISO datetime
  all_day: boolean;
  location?: string;
  subject: string;
  space_id: string;
  importance: EventImportance;
  summary: string;
  status: EventStatus;
  supersedes_id?: string;
  superseded_by_id?: string;
  valid_until: string;
  reminded_24h: boolean;
  reminded_2h: boolean;
  reminder_24h_at?: string;
  reminder_2h_at?: string;
  source_type: EventSourceType;
  source_saved_at: string;
}

export interface GetEventsParams {
  from?: string;
  to?: string;
  subject?: string;
  type?: string;
  importance?: string;
  include_superseded?: boolean;
}

export type CalendarViewMode = 'month' | 'week' | 'agenda';

export interface CalendarFilterState {
  subjects: string[];
  types: EventType[];
  importance: EventImportance[];
  showChanges: boolean;
  showPast: boolean;
}
