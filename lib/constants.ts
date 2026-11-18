import { Department, Institution, Course } from '@/types';

export const INSTITUTION: Institution = {
  id: '11111111-1111-1111-1111-111111111111',
  name: 'Independent University, Bangladesh',
  slug: 'iub',
  domain: 'iub.edu.bd',
};

export const DEPARTMENTS: Department[] = [
  {
    id: '22222222-2222-2222-2222-222222222201',
    institution_id: INSTITUTION.id,
    name: 'Computer Science and Engineering',
    slug: 'cse',
    file_count: 48,
  },
  {
    id: '22222222-2222-2222-2222-222222222202',
    institution_id: INSTITUTION.id,
    name: 'Electrical and Electronic Engineering',
    slug: 'eee',
    file_count: 24,
  },
  {
    id: '22222222-2222-2222-2222-222222222203',
    institution_id: INSTITUTION.id,
    name: 'School of Business and Entrepreneurship',
    slug: 'bba',
    file_count: 22,
  },
  {
    id: '22222222-2222-2222-2222-222222222204',
    institution_id: INSTITUTION.id,
    name: 'Physical and Mathematical Sciences',
    slug: 'mps',
    file_count: 18,
  },
];

export const COURSES: Course[] = [
  {
    id: '33333333-3333-3333-3333-333333333301',
    department_id: '22222222-2222-2222-2222-222222222201',
    code: 'CSE 213',
    title: 'Object-Oriented Programming (Java)',
    semester: 'Autumn 2026',
  },
  {
    id: '33333333-3333-3333-3333-333333333302',
    department_id: '22222222-2222-2222-2222-222222222201',
    code: 'CSE 115',
    title: 'Introduction to Computing & C',
    semester: 'Autumn 2026',
  },
  {
    id: '33333333-3333-3333-3333-333333333303',
    department_id: '22222222-2222-2222-2222-222222222201',
    code: 'CSE 215',
    title: 'Data Structures & Algorithms',
    semester: 'Summer 2026',
  },
  {
    id: '33333333-3333-3333-3333-333333333304',
    department_id: '22222222-2222-2222-2222-222222222201',
    code: 'CSE 303',
    title: 'Database Management Systems',
    semester: 'Autumn 2026',
  },
  {
    id: '33333333-3333-3333-3333-333333333305',
    department_id: '22222222-2222-2222-2222-222222222201',
    code: 'CSE 317',
    title: 'Operating Systems',
    semester: 'Spring 2026',
  },
  {
    id: '33333333-3333-3333-3333-333333333306',
    department_id: '22222222-2222-2222-2222-222222222202',
    code: 'EEE 101',
    title: 'Electrical Circuits I',
    semester: 'Autumn 2026',
  },
  {
    id: '33333333-3333-3333-3333-333333333307',
    department_id: '22222222-2222-2222-2222-222222222203',
    code: 'ACT 201',
    title: 'Financial Accounting Principles',
    semester: 'Spring 2026',
  },
  {
    id: '33333333-3333-3333-3333-333333333308',
    department_id: '22222222-2222-2222-2222-222222222204',
    code: 'MAT 120',
    title: 'Integral Calculus & Differential Equations',
    semester: 'Summer 2026',
  },
];
