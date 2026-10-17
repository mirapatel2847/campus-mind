/**
 * ==========================================
 * BACKEND CONTRACT (FastAPI Endpoints)
 * ==========================================
 * GET /events?from=&to=&subject=&type=&importance=&include_superseded=false -> CalendarEvent[]
 * GET /events/{id} -> CalendarEvent
 * (Events are created by the backend's organizing step, so there are no create or edit endpoints.)
 * ==========================================
 */

import { addDays, subDays, setHours, setMinutes, formatISO, subHours } from 'date-fns';
import { CalendarEvent, GetEventsParams } from '../types/event';
import { USE_MOCK } from '../lib/env';
import { apiClient } from './client';

const delay = (ms = 200): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));

// Helper to generate dynamic ISO dates relative to today
const createRelativeDate = (daysOffset: number, hours = 10, minutes = 0): string => {
  const base = daysOffset >= 0 ? addDays(new Date(), daysOffset) : subDays(new Date(), Math.abs(daysOffset));
  return formatISO(setMinutes(setHours(base, hours), minutes));
};

export const generateMockEvents = (): CalendarEvent[] => {
  const now = new Date();

  return [
    // 1. DBMS Mid-Term Exam (Active, supersedes older one)
    {
      id: 'evt_dbms_rescheduled',
      memory_id: 'mem_dbms_rescheduled',
      title: 'DBMS Mid-Term Exam (Hall B)',
      type: 'exam',
      due_at: createRelativeDate(4, 10, 0), // in 4 days at 10:00 AM
      all_day: false,
      location: 'Examination Hall B, Academic Block 2',
      subject: 'DBMS',
      space_id: 'space_dbms',
      importance: 'high',
      summary: 'Relational Algebra, ER Modeling, Normalization (1NF through BCNF), and SQL Query Optimization.',
      status: 'active',
      supersedes_id: 'evt_dbms_original',
      valid_until: createRelativeDate(4, 12, 0),
      reminded_24h: false,
      reminded_2h: false,
      reminder_24h_at: formatISO(subHours(new Date(createRelativeDate(4, 10, 0)), 24)),
      reminder_2h_at: formatISO(subHours(new Date(createRelativeDate(4, 10, 0)), 2)),
      source_type: 'whatsapp',
      source_saved_at: createRelativeDate(-2, 14, 30),
    },

    // 2. Older DBMS Mid-Term Exam (Superseded, moved to the above date)
    {
      id: 'evt_dbms_original',
      memory_id: 'mem_dbms_original',
      title: 'DBMS Mid-Term Exam (Hall A)',
      type: 'exam',
      due_at: createRelativeDate(0, 10, 0), // was originally today
      all_day: false,
      location: 'Examination Hall A',
      subject: 'DBMS',
      space_id: 'space_dbms',
      importance: 'high',
      summary: 'Originally scheduled mid-term exam date before departmental rescheduling.',
      status: 'superseded',
      superseded_by_id: 'evt_dbms_rescheduled',
      valid_until: createRelativeDate(0, 12, 0),
      reminded_24h: true,
      reminded_2h: false,
      reminder_24h_at: formatISO(subHours(now, 24)),
      source_type: 'telegram',
      source_saved_at: createRelativeDate(-7, 9, 0),
    },

    // 3. Capstone Project Phase 1 Submission Deadline
    {
      id: 'evt_capstone_phase1',
      memory_id: 'mem_project_deadline',
      title: 'Capstone Project Phase 1 SRS & Architecture',
      type: 'deadline',
      due_at: createRelativeDate(2, 23, 59), // in 2 days at 11:59 PM
      all_day: false,
      location: 'Canvas Portal',
      subject: 'Projects',
      space_id: 'space_projects',
      importance: 'high',
      summary: 'Upload Software Requirements Specification (SRS) and architecture diagram to Canvas.',
      status: 'active',
      valid_until: createRelativeDate(2, 23, 59),
      reminded_24h: false,
      reminded_2h: false,
      reminder_24h_at: formatISO(subHours(new Date(createRelativeDate(2, 23, 59)), 24)),
      reminder_2h_at: formatISO(subHours(new Date(createRelativeDate(2, 23, 59)), 2)),
      source_type: 'email',
      source_saved_at: createRelativeDate(-4, 8, 20),
    },

    // 4. Discrete Mathematics Surprise Quiz
    {
      id: 'evt_maths_quiz',
      memory_id: 'mem_graph_theory_quiz',
      title: 'Discrete Maths Quiz: Graph Theory',
      type: 'deadline',
      due_at: createRelativeDate(1, 9, 30), // tomorrow morning at 9:30 AM
      all_day: false,
      location: 'Room 304, Maths Dept',
      subject: 'Maths',
      space_id: 'space_maths',
      importance: 'high',
      summary: '20-minute closed book quiz on Euler tours, Hamiltonian cycles, and Handshaking lemma.',
      status: 'active',
      valid_until: createRelativeDate(1, 10, 0),
      reminded_24h: true,
      reminded_2h: false,
      reminder_24h_at: formatISO(subHours(now, 6)),
      reminder_2h_at: formatISO(subHours(new Date(createRelativeDate(1, 9, 30)), 2)),
      source_type: 'telegram',
      source_saved_at: createRelativeDate(-1, 12, 0),
    },

    // 5. HackCampus 2026 National Hackathon
    {
      id: 'evt_hackcampus',
      memory_id: 'mem_gdg_hackathon',
      title: 'HackCampus 2026 - 36-Hour Hackathon',
      type: 'event',
      due_at: createRelativeDate(12, 9, 0), // in 12 days
      all_day: true,
      location: 'Main Auditorium & Innovation Lab',
      subject: 'Projects',
      space_id: 'space_projects',
      importance: 'medium',
      summary: '36-hour hackathon with tracks in AI/ML, Cloud Infrastructure, and Campus Life.',
      status: 'active',
      valid_until: createRelativeDate(13, 20, 0),
      reminded_24h: false,
      reminded_2h: false,
      source_type: 'web',
      source_saved_at: createRelativeDate(-5, 13, 45),
    },

    // 6. Central Library Wi-Fi Scheduled Maintenance
    {
      id: 'evt_wifi_maint',
      memory_id: 'mem_wifi_maintenance',
      title: 'Central Library & Hostel Wi-Fi Downtime',
      type: 'other',
      due_at: createRelativeDate(1, 2, 0), // tomorrow at 2:00 AM
      all_day: false,
      location: 'Central Library & Hostels 4-8',
      subject: 'Notices',
      space_id: 'space_notices',
      importance: 'low',
      summary: 'Routine maintenance and fiber switch upgrade between 02:00 AM and 06:00 AM.',
      status: 'active',
      valid_until: createRelativeDate(1, 6, 0),
      reminded_24h: true,
      reminded_2h: false,
      reminder_24h_at: formatISO(subHours(now, 12)),
      source_type: 'telegram',
      source_saved_at: createRelativeDate(-1, 18, 0),
    },

    // 7. Scholarship Renewal Deadline
    {
      id: 'evt_scholarship_due',
      memory_id: 'mem_scholarship_notice',
      title: 'Merit Scholarship Renewal Submission',
      type: 'deadline',
      due_at: createRelativeDate(7, 17, 0), // in 7 days at 5:00 PM
      all_day: false,
      location: 'Academic Section Counter 3',
      subject: 'Notices',
      space_id: 'space_notices',
      importance: 'medium',
      summary: 'Submit grade sheets (min CGPA 7.5) and verified income certificate.',
      status: 'active',
      valid_until: createRelativeDate(7, 17, 0),
      reminded_24h: false,
      reminded_2h: false,
      source_type: 'email',
      source_saved_at: createRelativeDate(-3, 9, 0),
    },

    // 8. Distributed Systems Paper Discussion Group
    {
      id: 'evt_raft_discussion',
      memory_id: 'mem_dist_sys_paper',
      title: 'Distributed Systems Raft Paper Study Group',
      type: 'event',
      due_at: createRelativeDate(3, 16, 0), // in 3 days at 4:00 PM
      all_day: false,
      location: 'Discussion Room C, Library 2nd Floor',
      subject: 'DBMS',
      space_id: 'space_dbms',
      importance: 'low',
      summary: 'Discussion on leader election, log replication, and Raft consensus mechanics.',
      status: 'active',
      valid_until: createRelativeDate(3, 17, 30),
      reminded_24h: false,
      reminded_2h: false,
      source_type: 'web',
      source_saved_at: createRelativeDate(-2, 11, 15),
    },

    // 9. Linear Algebra Assignment 3 Due (Today afternoon)
    {
      id: 'evt_linear_algebra_hw',
      memory_id: 'mem_linear_algebra_notes',
      title: 'Linear Algebra Assignment 3: SVD & Eigenvectors',
      type: 'deadline',
      due_at: createRelativeDate(0, 17, 0), // today at 5:00 PM
      all_day: false,
      location: 'Moodle Submission Box',
      subject: 'Maths',
      space_id: 'space_maths',
      importance: 'medium',
      summary: 'Problems 4, 7, and 12 from Chapter 7 on low-rank matrix approximations.',
      status: 'active',
      valid_until: createRelativeDate(0, 17, 0),
      reminded_24h: true,
      reminded_2h: false,
      reminder_24h_at: formatISO(subHours(now, 24)),
      reminder_2h_at: formatISO(subHours(new Date(createRelativeDate(0, 17, 0)), 2)),
      source_type: 'whatsapp',
      source_saved_at: createRelativeDate(-3, 17, 10),
    },

    // 10. Past Event: Lab Schema Whiteboard Session (2 days ago)
    {
      id: 'evt_lab_schema_past',
      memory_id: 'mem_lab_schema_board',
      title: 'E-Commerce Schema Design Lab Session',
      type: 'event',
      due_at: createRelativeDate(-2, 14, 0), // 2 days ago
      all_day: false,
      location: 'Software Lab 4',
      subject: 'DBMS',
      space_id: 'space_dbms',
      importance: 'low',
      summary: 'Normalized schema discussion and foreign key constraints on OrderItems.',
      status: 'active',
      valid_until: createRelativeDate(-2, 16, 0),
      reminded_24h: true,
      reminded_2h: true,
      reminder_24h_at: formatISO(subDays(now, 3)),
      reminder_2h_at: formatISO(subDays(now, 2)),
      source_type: 'image',
      source_saved_at: createRelativeDate(-3, 15, 20),
    },

    // 11. Past Deadline: Capstone Team Formation (5 days ago)
    {
      id: 'evt_team_formation_past',
      memory_id: 'mem_project_deadline',
      title: 'Capstone Project Team Formation Final List',
      type: 'deadline',
      due_at: createRelativeDate(-5, 18, 0), // 5 days ago
      all_day: false,
      location: 'Dept Office Google Sheet',
      subject: 'Projects',
      space_id: 'space_projects',
      importance: 'medium',
      summary: 'Register teams of 3 to 4 with appointed mentor faculty.',
      status: 'active',
      valid_until: createRelativeDate(-5, 18, 0),
      reminded_24h: true,
      reminded_2h: true,
      source_type: 'email',
      source_saved_at: createRelativeDate(-7, 10, 0),
    },

    // 12. DBMS SQL Indexing Hands-on Workshop
    {
      id: 'evt_sql_workshop',
      memory_id: 'mem_sql_indexing',
      title: 'Hands-on SQL Index Tuning Workshop',
      type: 'event',
      due_at: createRelativeDate(6, 14, 0), // in 6 days
      all_day: false,
      location: 'Lab 2, CS Block',
      subject: 'DBMS',
      space_id: 'space_dbms',
      importance: 'medium',
      summary: 'Practical optimization of composite indexes and query execution plans in PostgreSQL.',
      status: 'active',
      valid_until: createRelativeDate(6, 16, 0),
      reminded_24h: false,
      reminded_2h: false,
      source_type: 'web',
      source_saved_at: createRelativeDate(-6, 20, 15),
    },

    // 13. End-Semester Examination Schedule Announcement
    {
      id: 'evt_endsem_schedule',
      memory_id: 'mem_endsem_circular',
      title: 'End-Semester Exam Timetable Circular Release',
      type: 'other',
      due_at: createRelativeDate(9, 11, 0), // in 9 days
      all_day: false,
      location: 'Notice Board & Website',
      subject: 'Notices',
      space_id: 'space_notices',
      importance: 'medium',
      summary: 'Publication of final exam timetable and hall tickets on portal.',
      status: 'active',
      valid_until: createRelativeDate(9, 12, 0),
      reminded_24h: false,
      reminded_2h: false,
      source_type: 'pdf',
      source_saved_at: createRelativeDate(-2, 11, 0),
    },

    // 14. Linear Algebra Mid-Term Exam
    {
      id: 'evt_maths_midterm',
      memory_id: 'mem_math_formula_sheet',
      title: 'Discrete Maths & Linear Algebra Mid-Term',
      type: 'exam',
      due_at: createRelativeDate(15, 14, 0), // in 15 days
      all_day: false,
      location: 'Hall C, Main Building',
      subject: 'Maths',
      space_id: 'space_maths',
      importance: 'high',
      summary: 'Closed-book examination covering Matrix Factorization, Eigenvalues, and Recurrence Relations.',
      status: 'active',
      valid_until: createRelativeDate(15, 16, 0),
      reminded_24h: false,
      reminded_2h: false,
      source_type: 'pdf',
      source_saved_at: createRelativeDate(-4, 16, 0),
    },

    // 15. All-Day Project Sprint Demo Day
    {
      id: 'evt_sprint_demo',
      memory_id: 'mem_project_deadline',
      title: 'Mid-Sprint Capstone Prototype Review',
      type: 'event',
      due_at: createRelativeDate(8, 9, 0), // in 8 days
      all_day: true,
      location: 'Conference Hall B',
      subject: 'Projects',
      space_id: 'space_projects',
      importance: 'medium',
      summary: 'Live demo of frontend UI and API stubs to review committee.',
      status: 'active',
      valid_until: createRelativeDate(8, 18, 0),
      reminded_24h: false,
      reminded_2h: false,
      source_type: 'email',
      source_saved_at: createRelativeDate(-2, 10, 0),
    },
  ];
};

let cachedEvents: CalendarEvent[] | null = null;

const getStoredMockEvents = (): CalendarEvent[] => {
  if (!cachedEvents) {
    cachedEvents = generateMockEvents();
  }
  return cachedEvents;
};

export async function getEvents(params: GetEventsParams = {}): Promise<CalendarEvent[]> {
  if (!USE_MOCK) {
    return apiClient.get<CalendarEvent[]>('events', {
      from: params.from,
      to: params.to,
      subject: params.subject,
      type: params.type,
      importance: params.importance,
      include_superseded: params.include_superseded !== undefined ? String(params.include_superseded) : 'false',
    });
  }

  await delay(200);
  const events = getStoredMockEvents();

  return events.filter((e) => {
    // Deleted events never appear
    if (e.status === 'deleted') return false;

    // Superseded events filtered unless explicitly requested
    if (!params.include_superseded && e.status === 'superseded') return false;

    if (params.type && e.type !== params.type) return false;
    if (params.subject && e.subject.toLowerCase() !== params.subject.toLowerCase()) return false;
    if (params.importance && e.importance !== params.importance) return false;

    if (params.from && new Date(e.due_at) < new Date(params.from)) return false;
    if (params.to && new Date(e.due_at) > new Date(params.to)) return false;

    return true;
  });
}

export async function getEventById(id: string): Promise<CalendarEvent> {
  if (!USE_MOCK) {
    return apiClient.get<CalendarEvent>(`events/${id}`);
  }

  await delay(150);
  const events = getStoredMockEvents();
  const event = events.find((e) => e.id === id);

  if (!event) {
    throw new Error(`Event with ID ${id} not found`);
  }

  return event;
}
