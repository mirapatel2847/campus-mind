import { Memory, Space } from '../types/memory';

export const INITIAL_SPACES: Space[] = [
  { id: 'space_dbms', name: 'DBMS', emoji: '📚', description: 'Database Management Systems & SQL Labs' },
  { id: 'space_maths', name: 'Maths', emoji: '🧮', description: 'Discrete Mathematics & Linear Algebra' },
  { id: 'space_notices', name: 'Notices', emoji: '📢', description: 'Campus circulars and administrative alerts' },
  { id: 'space_projects', name: 'Projects', emoji: '💻', description: 'Capstones, Hackathons & Software Lab' },
];

export const INITIAL_MEMORIES: Memory[] = [
  // 1. Rescheduled DBMS Exam (Active, supersedes older one)
  {
    id: 'mem_dbms_rescheduled',
    title: 'DBMS Mid-Term Exam Rescheduled to 28 Oct',
    summary: 'The Mid-Term exam for CS302 Database Systems is rescheduled to Tuesday, Oct 28 at 10:00 AM.',
    content: `Attention all 3rd Year CS Students:
The CS302 Database Management Systems Mid-Term examination has been moved from Friday, 24 October to Tuesday, 28 October 2026 (10:00 AM - 12:00 PM) in Hall B.
Syllabus: Relational Algebra, ER Modeling, Normalization (1NF through BCNF), and SQL Query Optimization.
Please bring your student ID and non-programmable calculators.`,
    category: 'exam',
    subject: 'DBMS',
    importance: 'high',
    source_type: 'whatsapp',
    source_ref: 'Prof. Sharma (CS Dept Group)',
    tags: [
      { name: 'exam-schedule', ai: true },
      { name: 'dbms', ai: true },
      { name: 'mandatory', ai: false },
    ],
    note: 'Make sure to finish past year questions on 3NF vs BCNF before Monday.',
    attachments: [
      { id: 'att_1', name: 'DBMS_Revised_Schedule.pdf', size: '240 KB', type: 'application/pdf' },
    ],
    observed_at: '2026-10-15T14:30:00Z',
    valid_until: '2026-10-28T12:00:00Z',
    status: 'active',
    supersedes_id: 'mem_dbms_original',
    space_id: 'space_dbms',
    is_favourite: true,
    is_archived: false,
  },

  // 2. Original DBMS Exam (Superseded - should NOT appear on Home)
  {
    id: 'mem_dbms_original',
    title: 'DBMS Mid-Term Exam Date (24 Oct)',
    summary: 'Preliminary date for DBMS Mid-Term exam set for 24 October 2026.',
    content: `CS302 DBMS Mid-Term originally scheduled on 24 October 2026 in Exam Hall A.`,
    category: 'exam',
    subject: 'DBMS',
    importance: 'high',
    source_type: 'telegram',
    source_ref: 'Official Notices Channel',
    tags: [
      { name: 'exam', ai: true },
      { name: 'dbms', ai: true },
    ],
    note: 'Superceded by recent departmental memo.',
    attachments: [],
    observed_at: '2026-10-05T10:00:00Z',
    valid_until: '2026-10-24T12:00:00Z',
    status: 'superseded',
    space_id: 'space_dbms',
    is_favourite: false,
    is_archived: false,
  },

  // 3. Link Card: Distributed Systems Reading Group
  {
    id: 'mem_dist_sys_paper',
    title: 'Raft Consensus Algorithm Paper & Interactive Guide',
    summary: 'Essential reading on distributed consensus algorithms with visual state transitions.',
    content: `The secret to distributed databases: Raft consensus algorithm explained with interactive step-by-step visualizations. Covers leader election, log replication, and split-brain recovery.`,
    category: 'resource',
    subject: 'DBMS',
    importance: 'medium',
    source_type: 'web',
    source_ref: 'raft.github.io',
    preview_image_url: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=60',
    tags: [
      { name: 'distributed-systems', ai: true },
      { name: 'consensus', ai: true },
      { name: 'reading', ai: false },
    ],
    note: 'Read sections 5.1 and 5.2 before the lab on Wednesday.',
    attachments: [],
    observed_at: '2026-10-14T11:15:00Z',
    status: 'active',
    space_id: 'space_dbms',
    is_favourite: true,
    is_archived: false,
  },

  // 4. Image/PDF Card: Discrete Mathematics Formula Sheet
  {
    id: 'mem_math_formula_sheet',
    title: 'Discrete Maths Exam Formula Sheet & Graph Theory Proofs',
    summary: 'Approved formula summary for recurrence relations, generating functions, and planar graphs.',
    content: `Official reference formula sheet approved by Mathematics Faculty for the upcoming End-Sem. Includes Master Theorem variants, Euler formula for planar graphs, and Pigeonhole principle applications.`,
    category: 'resource',
    subject: 'Maths',
    importance: 'high',
    source_type: 'pdf',
    source_ref: 'Prof. Ramanujan Moodle Upload',
    preview_image_url: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&auto=format&fit=crop&q=60',
    tags: [
      { name: 'formulas', ai: true },
      { name: 'graph-theory', ai: true },
      { name: 'exam-prep', ai: false },
    ],
    note: 'Print out 2 copies for the open-book quiz.',
    attachments: [
      { id: 'att_math_1', name: 'Discrete_Math_Formula_CheatSheet.pdf', size: '1.2 MB', type: 'application/pdf' },
    ],
    observed_at: '2026-10-12T16:00:00Z',
    status: 'active',
    space_id: 'space_maths',
    is_favourite: true,
    is_archived: false,
  },

  // 5. Text Card: Capstone Project Phase 1 Deadline
  {
    id: 'mem_project_deadline',
    title: 'Capstone Project Phase 1 Submission Portal Open',
    summary: 'Submit architectural diagram, SRS document, and GitHub repository link by 20 October 11:59 PM.',
    content: `All teams must upload their Software Requirements Specification (SRS) along with the initial architecture diagram to Canvas by Monday, 20 October at 23:59 IST.
Requirements:
1. IEEE standard SRS format.
2. High-level architecture including database schema draft.
3. Public GitHub link with CI/CD workflow initialized.
Late submissions will receive a 10% penalty per day.`,
    category: 'deadline',
    subject: 'Projects',
    importance: 'high',
    source_type: 'email',
    source_ref: 'HOD Computer Science',
    tags: [
      { name: 'deadline', ai: true },
      { name: 'capstone', ai: true },
      { name: 'submission', ai: false },
    ],
    note: 'Need to review Figma wireframes before final PDF export.',
    attachments: [
      { id: 'att_proj_1', name: 'SRS_Template_v2.docx', size: '115 KB', type: 'application/msword' },
    ],
    observed_at: '2026-10-13T08:20:00Z',
    valid_until: '2026-10-20T23:59:00Z',
    status: 'active',
    space_id: 'space_projects',
    is_favourite: false,
    is_archived: false,
  },

  // 6. Notice Card: Campus Wi-Fi Maintenance Window
  {
    id: 'mem_wifi_maintenance',
    title: 'Central Library & Hostel Wi-Fi Scheduled Downtime',
    summary: 'Core fiber switch upgrade this Saturday night from 2:00 AM to 6:00 AM.',
    content: `IT Services announcement: Routine maintenance and bandwidth expansion for Hostel blocks 4-8 and Central Library will occur Saturday night, 18 October, between 02:00 AM and 06:00 AM.
Internet connectivity and local intranet portals will be temporarily intermittent during this maintenance window.`,
    category: 'notice',
    subject: 'Notices',
    importance: 'low',
    source_type: 'telegram',
    source_ref: 'Campus IT Services Bot',
    tags: [
      { name: 'campus-maintenance', ai: true },
      { name: 'it-services', ai: true },
    ],
    note: 'Download lecture slides beforehand.',
    attachments: [],
    observed_at: '2026-10-16T18:00:00Z',
    status: 'active',
    space_id: 'space_notices',
    is_favourite: false,
    is_archived: false,
  },

  // 7. Event Card: Google Developer Student Club Hackathon
  {
    id: 'mem_gdg_hackathon',
    title: 'HackCampus 2026 - 36-Hour National Hackathon',
    summary: 'Annual hackathon registration open with tracks in AI/ML, Cloud Infrastructure, and Campus Life.',
    content: `GDG on Campus presents HackCampus 2026!
Dates: November 7-8, 2026 at the Main Auditorium.
Prizes worth $5,000 + cloud credits for all participants.
Food, caffeine, mentorship, and API workshops will be provided. Teams of 2 to 4 students.`,
    category: 'event',
    subject: 'Projects',
    importance: 'medium',
    source_type: 'web',
    source_ref: 'hackcampus.dev',
    preview_image_url: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&auto=format&fit=crop&q=60',
    tags: [
      { name: 'hackathon', ai: true },
      { name: 'gdg', ai: true },
      { name: 'networking', ai: false },
    ],
    note: 'Pitching CampusMind as our submission idea.',
    attachments: [],
    observed_at: '2026-10-11T13:45:00Z',
    valid_until: '2026-11-07T09:00:00Z',
    status: 'active',
    space_id: 'space_projects',
    is_favourite: true,
    is_archived: false,
  },

  // 8. Text Card: Linear Algebra Matrix Factorization Lecture Notes
  {
    id: 'mem_linear_algebra_notes',
    title: 'SVD & Eigenvalues Quick Summary',
    summary: 'Singular Value Decomposition intuition, geometric interpretation, and PCA connection.',
    content: `Prof. Rao's lecture notes recap:
Any m×n matrix A can be factored as A = U Σ V^T.
- Columns of U: eigenvectors of AA^T (left singular vectors).
- Columns of V: eigenvectors of A^T A (right singular vectors).
- Diagonal entries of Σ: square roots of non-zero eigenvalues.
Key application in machine learning: Low-rank matrix approximations and Principal Component Analysis.`,
    category: 'resource',
    subject: 'Maths',
    importance: 'medium',
    source_type: 'whatsapp',
    source_ref: 'Math Study Cohort',
    tags: [
      { name: 'linear-algebra', ai: true },
      { name: 'pca', ai: true },
      { name: 'math-recap', ai: false },
    ],
    note: 'Solve problem 4 from chapter 7 tonight.',
    attachments: [],
    observed_at: '2026-10-13T17:10:00Z',
    status: 'active',
    space_id: 'space_maths',
    is_favourite: false,
    is_archived: false,
  },

  // 9. Link Card: SQL Indexing Deep Dive
  {
    id: 'mem_sql_indexing',
    title: 'Use The Index, Luke! - A Guide to Database Performance',
    summary: 'Clear guide on B-Tree index structures, composite indexing, and avoiding sequential scans.',
    content: `Great guide recommended by TA for the DBMS optimization lab. Explains why functions in WHERE clauses disable indexes, how clustered indexes physically sort data, and index coverage for high-throughput queries.`,
    category: 'resource',
    subject: 'DBMS',
    importance: 'low',
    source_type: 'web',
    source_ref: 'use-the-index-luke.com',
    preview_image_url: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&auto=format&fit=crop&q=60',
    tags: [
      { name: 'sql-indexing', ai: true },
      { name: 'performance', ai: true },
      { name: 'b-tree', ai: false },
    ],
    note: 'Bookmark for future interview revision.',
    attachments: [],
    observed_at: '2026-10-09T20:15:00Z',
    status: 'active',
    space_id: 'space_dbms',
    is_favourite: false,
    is_archived: false,
  },

  // 10. Notice Card: Scholarship Renewal Application
  {
    id: 'mem_scholarship_notice',
    title: 'Merit-cum-Means Scholarship Renewal Fall 2026',
    summary: 'Submit grade cards and verified income certificate to Academic Section counter 3.',
    content: `Students availing the Merit-cum-Means scholarship must submit physical copies of their previous semester grade sheet (min CGPA 7.5 requirement) and updated family income certificate before 31 October 2026.
Incomplete files will not be processed for the semester tuition fee waiver.`,
    category: 'notice',
    subject: 'Notices',
    importance: 'medium',
    source_type: 'email',
    source_ref: 'Dean Academic Affairs',
    tags: [
      { name: 'scholarship', ai: true },
      { name: 'academics', ai: true },
    ],
    note: 'Collect grade card signature from tutor tomorrow morning.',
    attachments: [
      { id: 'att_schol_1', name: 'Renewal_Form_2026.pdf', size: '180 KB', type: 'application/pdf' },
    ],
    observed_at: '2026-10-14T09:00:00Z',
    valid_until: '2026-10-31T17:00:00Z',
    status: 'active',
    space_id: 'space_notices',
    is_favourite: false,
    is_archived: false,
  },

  // 11. Image/PDF Card: Lab Whiteboard Schema Design
  {
    id: 'mem_lab_schema_board',
    title: 'E-Commerce Database Schema Whiteboard Session',
    summary: 'Photo of the normalized schema discussed during Tuesday lab session with Prof. Nair.',
    content: `Whiteboard sketch showing foreign key constraints between Orders, LineItems, Inventory, and PaymentLedger tables. Highlights composite primary keys on OrderItems (order_id, item_seq) and audit timestamps.`,
    category: 'general',
    subject: 'DBMS',
    importance: 'low',
    source_type: 'image',
    source_ref: 'Mobile Photo (Lab 4)',
    preview_image_url: 'https://images.unsplash.com/photo-1543269865-cbf427effbad?w=800&auto=format&fit=crop&q=60',
    tags: [
      { name: 'schema-design', ai: true },
      { name: 'normalization', ai: true },
      { name: 'lab-work', ai: false },
    ],
    note: 'Convert into DDL SQL script for submission.',
    attachments: [
      { id: 'att_board_1', name: 'whiteboard_schema_oct14.jpg', size: '3.4 MB', type: 'image/jpeg' },
    ],
    observed_at: '2026-10-14T15:20:00Z',
    status: 'active',
    space_id: 'space_dbms',
    is_favourite: false,
    is_archived: false,
  },

  // 12. Text Card: Graph Theory Quiz Announcement
  {
    id: 'mem_graph_theory_quiz',
    title: 'Maths Surprise Quiz Announced for Monday',
    summary: 'Quiz on Euler tours, Hamiltonian cycles, and Dijkstra algorithm.',
    content: `Reminder from TA: There will be a 20-minute closed-book quiz at the start of Monday's lecture (20 October).
Topics covered:
1. Necessary and sufficient conditions for Eulerian graphs.
2. Dirac's and Ore's theorems for Hamiltonian cycles.
3. Handshaking lemma problem solving.`,
    category: 'deadline',
    subject: 'Maths',
    importance: 'high',
    source_type: 'telegram',
    source_ref: 'Maths CS Batch Telegram',
    tags: [
      { name: 'quiz', ai: true },
      { name: 'maths', ai: true },
      { name: 'upcoming', ai: false },
    ],
    note: 'Practice Dirac theorem proofs.',
    attachments: [],
    observed_at: '2026-10-16T12:00:00Z',
    valid_until: '2026-10-20T09:30:00Z',
    status: 'active',
    space_id: 'space_maths',
    is_favourite: false,
    is_archived: false,
  },
];

const STORAGE_MEMORIES_KEY = 'campusmind_memories';
const STORAGE_SPACES_KEY = 'campusmind_spaces';

export function getMockSpaces(): Space[] {
  try {
    const raw = localStorage.getItem(STORAGE_SPACES_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_SPACES_KEY, JSON.stringify(INITIAL_SPACES));
      return INITIAL_SPACES;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load spaces from localStorage', err);
    return INITIAL_SPACES;
  }
}

export function getMockMemories(): Memory[] {
  try {
    const raw = localStorage.getItem(STORAGE_MEMORIES_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_MEMORIES_KEY, JSON.stringify(INITIAL_MEMORIES));
      return INITIAL_MEMORIES;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load memories from localStorage', err);
    return INITIAL_MEMORIES;
  }
}

export function saveMockMemories(memories: Memory[]): void {
  try {
    localStorage.setItem(STORAGE_MEMORIES_KEY, JSON.stringify(memories));
  } catch (err) {
    console.error('Failed to save memories to localStorage', err);
  }
}

export function saveMockSpaces(spaces: Space[]): void {
  try {
    localStorage.setItem(STORAGE_SPACES_KEY, JSON.stringify(spaces));
  } catch (err) {
    console.error('Failed to save spaces to localStorage', err);
  }
}

export const UNASSIGNED_SPACE: Space = {
  id: 'unassigned',
  name: 'Unassigned',
  emoji: '📥',
  description: 'Items without an assigned space',
};

export function deleteMockSpace(id: string): void {
  const spaces = getMockSpaces();
  const filteredSpaces = spaces.filter((s) => s.id !== id);
  saveMockSpaces(filteredSpaces);

  const memories = getMockMemories();
  const updatedMemories = memories.map((m) => {
    if (m.space_id === id) {
      return { ...m, space_id: undefined };
    }
    return m;
  });
  saveMockMemories(updatedMemories);
}

