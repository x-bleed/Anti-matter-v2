import { Resource, Course, Department, LeaderboardEntry, Profile, CGPASubmission, Report } from '@/types';
import { INSTITUTION, DEPARTMENTS, COURSES } from '@/lib/constants';

// Realistic sample PDF data URL (valid minimalist PDF header '%PDF-1.4 ...')
export const SAMPLE_PDF_BLOB = `data:application/pdf;base64,JVBERi0xLjQKJeLjz9MKMSAwIG9iajw8L1R5cGUvQ2F0YWxvZy9QYWdlcyAyIDAgUj4+ZW5kb2JqCjIgMCBvYmo8PC9UeXBlL1BhZ2VzL0tpZHNbMyAwIFJdL0NvdW50IDE+PmVuZG9iagozIDAgb2JqPDwvVHlwZS9QYWdlL1BhcmVudCAyIDAgUi9NZWRpYUJveFswIDAgNTk1IDg0Ml0vQ29udGVudHMgNCAwIFIvUmVzb3VyY2VzPDw+Pj4+ZW5kb2JqCjQgMCBvYmo8PC9MZW5ndGggNTQ+PnN0cmVhbQpCVAovRjEgMTIgVGYKNzIgNzEyIFRECihBTlRJLU1BVFRFUiB2MiAtIEFjYWRlbWljIFJlc291cmNlIFByZXZpZXcpIFRqCkUKZW5kc3RyZWFtCmVuZG9iagp4cmVmCjAgNQowMDAwMDAwMDAwIDY1NTM1IGYgCjAwMDAwMDAwMDkgMDAwMDAgbiAKMDAwMDAwMDA1NiAwMDAwMCBuIAowMDAwMDAwMTExIDAwMDAwIG4gCjAwMDAwMDAyMTIgMDAwMDAgbiAKdHJhaWxlcjw8L1NpemUgNT4+CnN0YXJ0eHJlZgoxMjM0CiUlRU9G`;

// Function to generate 100+ realistic resources across courses
function generateInitialResources(): Resource[] {
  const items: Resource[] = [];
  const types: Resource['type'][] = ['notes', 'past_paper', 'slides', 'other'];

  const courseResourceTemplates: Record<string, Array<{ title: string; type: Resource['type']; pages: number; size: string }>> = {
    'CSE 213': [
      { title: 'Complete Lecture Notes on OOP Concepts (Polymorphism & Inheritance)', type: 'notes', pages: 38, size: '3.4 MB' },
      { title: 'Midterm Examination Question Paper with Solutions - Autumn 2025', type: 'past_paper', pages: 6, size: '1.2 MB' },
      { title: 'Final Examination Question Paper & Rubric - Summer 2025', type: 'past_paper', pages: 8, size: '1.5 MB' },
      { title: 'Java Collections Framework, Generics & Iterators Lecture Slides', type: 'slides', pages: 44, size: '5.1 MB' },
      { title: 'JavaFX GUI Development & Event Handling Comprehensive Guide', type: 'notes', pages: 29, size: '2.8 MB' },
      { title: 'Exception Handling & File I/O Stream Lecture Slides', type: 'slides', pages: 32, size: '3.7 MB' },
      { title: 'CSE 213 Comprehensive Lab Manual & Project Guidelines', type: 'other', pages: 22, size: '2.1 MB' },
      { title: 'Midterm Past Papers Collection (2022-2024)', type: 'past_paper', pages: 18, size: '4.2 MB' },
      { title: 'Multithreading & Concurrency in Java Master Notes', type: 'notes', pages: 26, size: '2.9 MB' },
      { title: 'Final Past Papers Archive (2021-2024)', type: 'past_paper', pages: 24, size: '4.8 MB' },
      { title: 'Abstract Classes, Interfaces and Lambda Expressions Slides', type: 'slides', pages: 36, size: '4.0 MB' },
      { title: 'Sample Project Architecture & Design Patterns (Singleton, Factory, MVC)', type: 'other', pages: 15, size: '1.8 MB' },
      { title: 'Spring 2025 Midterm Question Paper with Marking Scheme', type: 'past_paper', pages: 5, size: '1.1 MB' },
      { title: 'Java Memory Management & Garbage Collection Study Sheet', type: 'notes', pages: 12, size: '1.4 MB' },
    ],
    'CSE 115': [
      { title: 'Introduction to C Programming: Syntax, Variables and Control Structures', type: 'notes', pages: 34, size: '2.9 MB' },
      { title: 'Functions, Pointers and Memory Allocation in C Lecture Slides', type: 'slides', pages: 48, size: '4.6 MB' },
      { title: 'Midterm Exam Past Paper (Autumn 2025)', type: 'past_paper', pages: 5, size: '980 KB' },
      { title: 'Final Exam Past Paper (Spring 2025)', type: 'past_paper', pages: 6, size: '1.1 MB' },
      { title: 'Arrays, Strings and 2D Matrices Practical Guide', type: 'notes', pages: 28, size: '2.5 MB' },
      { title: 'Structure, Union and File Handling in C Complete Slide Deck', type: 'slides', pages: 42, size: '4.3 MB' },
      { title: 'Midterm Question Bank with 100 Solved Problems', type: 'other', pages: 52, size: '6.2 MB' },
      { title: 'Autumn 2024 Final Examination Question Paper', type: 'past_paper', pages: 6, size: '1.0 MB' },
      { title: 'Recursive Functions and Stack Memory Deep Dive', type: 'notes', pages: 18, size: '1.7 MB' },
      { title: 'Summer 2025 Midterm Paper with Code Snippet Tracing', type: 'past_paper', pages: 4, size: '850 KB' },
      { title: 'C Programming Lab Manual and Exercises Sheet', type: 'other', pages: 30, size: '3.1 MB' },
      { title: 'Bitwise Operators & Low-Level Manipulation Slides', type: 'slides', pages: 26, size: '2.7 MB' },
      { title: 'Pointers Demystified: Double Pointers & Function Pointers', type: 'notes', pages: 20, size: '2.2 MB' },
    ],
    'CSE 215': [
      { title: 'Asymptotic Analysis & Big-O Notation Formal Notes', type: 'notes', pages: 22, size: '2.0 MB' },
      { title: 'Linked Lists (Singly, Doubly, Circular) Implementations & Slides', type: 'slides', pages: 50, size: '5.4 MB' },
      { title: 'Stacks and Queues Applications (Infix to Postfix, BFS/DFS)', type: 'notes', pages: 30, size: '3.2 MB' },
      { title: 'Midterm Past Examination Papers with Complete Solutions (2024)', type: 'past_paper', pages: 12, size: '2.6 MB' },
      { title: 'Binary Search Trees & AVL Trees Balancing Operations Slides', type: 'slides', pages: 46, size: '4.9 MB' },
      { title: 'Final Past Exam Paper Summer 2025 with Proofs', type: 'past_paper', pages: 7, size: '1.4 MB' },
      { title: 'Heap Sort, Priority Queues and Huffman Coding Notes', type: 'notes', pages: 25, size: '2.8 MB' },
      { title: 'Graph Algorithms: Dijkstra, Bellman-Ford, Prim & Kruskal', type: 'slides', pages: 54, size: '6.1 MB' },
      { title: 'Dynamic Programming: 0/1 Knapsack, LCS, Matrix Chain Multiplication', type: 'notes', pages: 36, size: '3.9 MB' },
      { title: 'Hashing Techniques, Collision Resolution & Bloom Filters', type: 'slides', pages: 38, size: '4.1 MB' },
      { title: 'Spring 2025 Final Examination Question Paper', type: 'past_paper', pages: 8, size: '1.6 MB' },
      { title: 'CSE 215 Competitive Programming Cheat Sheet', type: 'other', pages: 16, size: '1.9 MB' },
      { title: 'Midterm Examination Past Papers Archive (2020-2023)', type: 'past_paper', pages: 28, size: '5.8 MB' },
    ],
    'CSE 303': [
      { title: 'Relational Database Model and Relational Algebra Notes', type: 'notes', pages: 32, size: '3.3 MB' },
      { title: 'Advanced SQL: Nested Queries, Joins, Triggers and Stored Procedures', type: 'notes', pages: 40, size: '4.2 MB' },
      { title: 'Database Normalization: 1NF, 2NF, 3NF and BCNF with Step-by-Step Examples', type: 'slides', pages: 44, size: '4.8 MB' },
      { title: 'Autumn 2025 Midterm Examination Paper with ER Diagram Solutions', type: 'past_paper', pages: 6, size: '1.3 MB' },
      { title: 'Transaction Processing, ACID Properties and Serializability Slides', type: 'slides', pages: 38, size: '4.0 MB' },
      { title: 'Concurrency Control: Two-Phase Locking (2PL) and Timestamp Ordering', type: 'notes', pages: 28, size: '2.9 MB' },
      { title: 'Final Examination Past Papers Summer 2025', type: 'past_paper', pages: 8, size: '1.7 MB' },
      { title: 'Indexing & B+ Trees Internal Mechanics Guide', type: 'notes', pages: 24, size: '2.6 MB' },
      { title: 'PostgreSQL & MySQL Database Administration Lab Handout', type: 'other', pages: 18, size: '2.0 MB' },
      { title: 'Midterm Papers Collection 2023-2025', type: 'past_paper', pages: 20, size: '4.1 MB' },
      { title: 'NoSQL Databases vs Relational: MongoDB and Redis Overview', type: 'slides', pages: 34, size: '3.5 MB' },
      { title: 'Database Query Optimization and Execution Engine Explained', type: 'notes', pages: 26, size: '2.8 MB' },
    ],
    'CSE 317': [
      { title: 'Operating System Architectures, System Calls and Kernel Modes', type: 'slides', pages: 42, size: '4.5 MB' },
      { title: 'Process Scheduling Algorithms (FCFS, SJF, Round Robin, Multi-Level)', type: 'notes', pages: 35, size: '3.6 MB' },
      { title: 'Midterm Examination Past Paper Autumn 2025', type: 'past_paper', pages: 5, size: '1.1 MB' },
      { title: 'Inter-Process Communication & Synchronization (Semaphores, Mutex)', type: 'notes', pages: 30, size: '3.1 MB' },
      { title: 'Deadlock Detection, Prevention and Banker Algorithm Slides', type: 'slides', pages: 36, size: '3.9 MB' },
      { title: 'Virtual Memory, Paging, Page Replacement Algorithms (FIFO, LRU)', type: 'notes', pages: 34, size: '3.5 MB' },
      { title: 'Final Exam Past Paper Spring 2025 with Answers', type: 'past_paper', pages: 7, size: '1.5 MB' },
      { title: 'Linux File System Architecture & Inode Structures', type: 'other', pages: 19, size: '2.2 MB' },
      { title: 'Summer 2025 Midterm Question Paper', type: 'past_paper', pages: 5, size: '1.2 MB' },
      { title: 'Operating Systems Lab Manual: POSIX Threads & Fork Calls', type: 'other', pages: 25, size: '2.9 MB' },
      { title: 'Storage Management, RAID Levels and Disk Scheduling', type: 'slides', pages: 40, size: '4.3 MB' },
    ],
    'EEE 101': [
      { title: 'Ohm Law, Kirchhoff Laws (KCL, KVL) and Nodal Analysis Handout', type: 'notes', pages: 28, size: '2.7 MB' },
      { title: 'Thevenin and Norton Equivalent Circuits Comprehensive Guide', type: 'notes', pages: 24, size: '2.4 MB' },
      { title: 'Midterm Past Papers Collection with Circuit Diagrams (2024-2025)', type: 'past_paper', pages: 14, size: '3.2 MB' },
      { title: 'Sinusoidal Steady-State AC Circuit Analysis Slides', type: 'slides', pages: 46, size: '5.0 MB' },
      { title: 'First-Order RC and RL Transient Response Lecture Notes', type: 'notes', pages: 30, size: '3.0 MB' },
      { title: 'Final Exam Past Paper Summer 2025', type: 'past_paper', pages: 6, size: '1.3 MB' },
      { title: 'Maximum Power Transfer Theorem and Superposition Theorem', type: 'slides', pages: 32, size: '3.4 MB' },
      { title: 'EEE 101 Laboratory Experiments and Multisim Simulation Guide', type: 'other', pages: 26, size: '3.1 MB' },
      { title: 'Autumn 2024 Midterm Exam Paper with Worked Solutions', type: 'past_paper', pages: 5, size: '1.1 MB' },
      { title: 'Three-Phase Balanced and Unbalanced Systems Lecture Notes', type: 'notes', pages: 22, size: '2.3 MB' },
    ],
    'ACT 201': [
      { title: 'Accounting Equation, Double-Entry Bookkeeping and Journal Entries', type: 'notes', pages: 30, size: '2.8 MB' },
      { title: 'Adjusting Entries, Trial Balance and Financial Statements Preparation', type: 'slides', pages: 42, size: '4.2 MB' },
      { title: 'Midterm Examination Past Paper Autumn 2025', type: 'past_paper', pages: 6, size: '1.2 MB' },
      { title: 'Inventory Accounting Methods: FIFO, LIFO and Weighted Average', type: 'notes', pages: 26, size: '2.5 MB' },
      { title: 'Cash Flow Statements (Direct and Indirect Method) Slides', type: 'slides', pages: 36, size: '3.8 MB' },
      { title: 'Final Exam Past Paper Spring 2025 with Balance Sheet Solutions', type: 'past_paper', pages: 8, size: '1.6 MB' },
      { title: 'Depreciation Methods: Straight-Line vs Declining Balance', type: 'notes', pages: 18, size: '1.8 MB' },
      { title: 'ACT 201 Financial Accounting Formula Sheet & Case Studies', type: 'other', pages: 14, size: '1.5 MB' },
      { title: 'Summer 2025 Midterm Past Paper', type: 'past_paper', pages: 5, size: '1.0 MB' },
    ],
    'MAT 120': [
      { title: 'Techniques of Integration (Substitution, By Parts, Partial Fractions)', type: 'notes', pages: 36, size: '3.5 MB' },
      { title: 'Improper Integrals and Differential Calculus Applications', type: 'slides', pages: 38, size: '4.0 MB' },
      { title: 'Midterm Past Papers Collection 2024-2025', type: 'past_paper', pages: 12, size: '2.7 MB' },
      { title: 'First-Order and Second-Order Linear Differential Equations Notes', type: 'notes', pages: 32, size: '3.1 MB' },
      { title: 'Multiple Integrals (Double and Triple Integrals in Polar Coordinates)', type: 'slides', pages: 44, size: '4.7 MB' },
      { title: 'Final Exam Past Paper Summer 2025 with Step-by-Step Proofs', type: 'past_paper', pages: 7, size: '1.5 MB' },
      { title: 'Infinite Series, Convergence Tests (Ratio, Root, Comparison) Guide', type: 'notes', pages: 28, size: '2.8 MB' },
      { title: 'MAT 120 Formula Sheet and Calculus Cheat Sheet', type: 'other', pages: 10, size: '1.2 MB' },
      { title: 'Spring 2025 Midterm Exam Paper with Answer Key', type: 'past_paper', pages: 5, size: '1.1 MB' },
    ],
  };

  let idCounter = 1;
  for (const course of COURSES) {
    const templates = courseResourceTemplates[course.code] || [];
    for (let i = 0; i < templates.length; i++) {
      const t = templates[i];
      const paddedId = String(idCounter).padStart(12, '0');
      items.push({
        id: `44444444-4444-4444-4444-${paddedId}`,
        course_id: course.id,
        title: t.title,
        type: t.type,
        file_path: `resources/${course.id}/${paddedId}.pdf`,
        file_size: t.size,
        page_count: t.pages,
        uploaded_by: '00000000-0000-0000-0000-000000000001',
        status: 'published',
        created_at: new Date(Date.now() - (items.length * 3600000 * 18)).toISOString(),
        course,
        download_count: Math.floor(Math.random() * 240) + 12,
      });
      idCounter++;
    }
  }

  return items;
}

export const INITIAL_RESOURCES: Resource[] = generateInitialResources();

export const INITIAL_PROFILES: Profile[] = [
  {
    id: '00000000-0000-0000-0000-000000000001',
    name: 'Fahad (XS1_Reaper)',
    email: 'fahad@iub.edu.bd',
    role: 'admin',
    department_id: '22222222-2222-2222-2222-222222222201',
    alias: 'XS1_Reaper',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
  },
  {
    id: '00000000-0000-0000-0000-000000000002',
    name: 'Tanvir Hossain',
    email: 'tanvir.h@iub.edu.bd',
    role: 'student',
    department_id: '22222222-2222-2222-2222-222222222201',
    alias: 'ByteCipher',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=faces',
  },
  {
    id: '00000000-0000-0000-0000-000000000003',
    name: 'Nusrat Jahan',
    email: 'nusrat.j@iub.edu.bd',
    role: 'student',
    department_id: '22222222-2222-2222-2222-222222222201',
    alias: 'Starlight',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=faces',
  },
  {
    id: '00000000-0000-0000-0000-000000000004',
    name: 'Rafiqul Islam',
    email: 'rafiqul.i@iub.edu.bd',
    role: 'student',
    department_id: '22222222-2222-2222-2222-222222222202',
    alias: 'VoltMaster',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=faces',
  },
  {
    id: '00000000-0000-0000-0000-000000000005',
    name: 'Samira Anjum',
    email: 'samira.a@iub.edu.bd',
    role: 'student',
    department_id: '22222222-2222-2222-2222-222222222203',
    alias: 'FinAce',
    avatar_url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=faces',
  },
];

export const INITIAL_LEADERBOARD: LeaderboardEntry[] = [
  {
    rank: 1,
    profile_id: '00000000-0000-0000-0000-000000000001',
    name: 'Fahad',
    alias: 'XS1_Reaper',
    department_code: 'CSE',
    department_name: 'Computer Science and Engineering',
    cgpa: 3.98,
    credits_completed: 105,
    verified: true,
    semester: 'Autumn 2026',
  },
  {
    rank: 2,
    profile_id: '00000000-0000-0000-0000-000000000003',
    name: 'Nusrat Jahan',
    alias: 'Starlight',
    department_code: 'CSE',
    department_name: 'Computer Science and Engineering',
    cgpa: 3.96,
    credits_completed: 96,
    verified: true,
    semester: 'Autumn 2026',
  },
  {
    rank: 3,
    profile_id: '00000000-0000-0000-0000-000000000002',
    name: 'Tanvir Hossain',
    alias: 'ByteCipher',
    department_code: 'CSE',
    department_name: 'Computer Science and Engineering',
    cgpa: 3.92,
    credits_completed: 92,
    verified: true,
    semester: 'Autumn 2026',
  },
  {
    rank: 4,
    profile_id: '00000000-0000-0000-0000-000000000005',
    name: 'Samira Anjum',
    alias: 'FinAce',
    department_code: 'BBA',
    department_name: 'School of Business and Entrepreneurship',
    cgpa: 3.90,
    credits_completed: 88,
    verified: true,
    semester: 'Spring 2026',
  },
  {
    rank: 5,
    profile_id: '00000000-0000-0000-0000-000000000004',
    name: 'Rafiqul Islam',
    alias: 'VoltMaster',
    department_code: 'EEE',
    department_name: 'Electrical and Electronic Engineering',
    cgpa: 3.86,
    credits_completed: 84,
    verified: true,
    semester: 'Autumn 2026',
  },
];

export const INITIAL_CGPA_SUBMISSIONS: CGPASubmission[] = [
  {
    id: 'sub-001',
    profile_id: '00000000-0000-0000-0000-000000000002',
    cgpa: 3.92,
    credits_completed: 92,
    proof_path: 'cgpa-proofs/00000000-0000-0000-0000-000000000002/grade_report_2026.png',
    status: 'verified',
    verified_by: '00000000-0000-0000-0000-000000000001',
    verified_at: '2026-11-10T10:00:00Z',
    created_at: '2026-11-09T14:30:00Z',
    profile: INITIAL_PROFILES[1],
  },
  {
    id: 'sub-002',
    profile_id: '00000000-0000-0000-0000-000000000004',
    cgpa: 3.86,
    credits_completed: 84,
    proof_path: 'cgpa-proofs/00000000-0000-0000-0000-000000000004/result_sheet_autumn.png',
    status: 'pending',
    created_at: '2026-11-17T09:15:00Z',
    profile: INITIAL_PROFILES[3],
  },
];

export const INITIAL_REPORTS: Report[] = [
  {
    id: 'rep-001',
    resource_id: INITIAL_RESOURCES[0].id,
    reporter_id: '00000000-0000-0000-0000-000000000002',
    reason: 'Page 14 is blurry in the scanned diagram.',
    status: 'pending',
    created_at: '2026-11-16T18:20:00Z',
    resource: INITIAL_RESOURCES[0],
    reporter: INITIAL_PROFILES[1],
  },
];
