-- ANTI-MATTER v2: Initial Seed Data
-- Migration: 20261104_seed_data.sql

-- Insert Institution: IUB
insert into public.institutions (id, name, slug, domain)
values ('11111111-1111-1111-1111-111111111111', 'Independent University, Bangladesh', 'iub', 'iub.edu.bd')
on conflict (slug) do nothing;

-- Insert Departments
insert into public.departments (id, institution_id, name, slug) values
  ('22222222-2222-2222-2222-222222222201', '11111111-1111-1111-1111-111111111111', 'Computer Science and Engineering', 'cse'),
  ('22222222-2222-2222-2222-222222222202', '11111111-1111-1111-1111-111111111111', 'Electrical and Electronic Engineering', 'eee'),
  ('22222222-2222-2222-2222-222222222203', '11111111-1111-1111-1111-111111111111', 'School of Business and Entrepreneurship', 'bba'),
  ('22222222-2222-2222-2222-222222222204', '11111111-1111-1111-1111-111111111111', 'Physical and Mathematical Sciences', 'mps')
on conflict do nothing;

-- Insert Courses
insert into public.courses (id, department_id, code, title, semester) values
  ('33333333-3333-3333-3333-333333333301', '22222222-2222-2222-2222-222222222201', 'CSE 213', 'Object-Oriented Programming (Java)', 'Autumn 2026'),
  ('33333333-3333-3333-3333-333333333302', '22222222-2222-2222-2222-222222222201', 'CSE 115', 'Introduction to Computing & C', 'Autumn 2026'),
  ('33333333-3333-3333-3333-333333333303', '22222222-2222-2222-2222-222222222201', 'CSE 215', 'Data Structures & Algorithms', 'Summer 2026'),
  ('33333333-3333-3333-3333-333333333304', '22222222-2222-2222-2222-222222222201', 'CSE 303', 'Database Management Systems', 'Autumn 2026'),
  ('33333333-3333-3333-3333-333333333305', '22222222-2222-2222-2222-222222222202', 'EEE 101', 'Electrical Circuits I', 'Autumn 2026'),
  ('33333333-3333-3333-3333-333333333306', '22222222-2222-2222-2222-222222222203', 'ACT 201', 'Financial Accounting Principles', 'Spring 2026')
on conflict do nothing;
