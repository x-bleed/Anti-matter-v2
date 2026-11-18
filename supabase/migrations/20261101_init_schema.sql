-- ANTI-MATTER v2: Database Schema
-- Migration: 20261101_init_schema.sql

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. institutions table
create table if not exists public.institutions (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text not null unique,
  domain text not null,
  created_at timestamptz default now()
);

-- 2. departments table
create table if not exists public.departments (
  id uuid primary key default uuid_generate_v4(),
  institution_id uuid not null references public.institutions(id) on delete cascade,
  name text not null,
  slug text not null,
  created_at timestamptz default now(),
  unique(institution_id, slug)
);

-- 3. courses table
create table if not exists public.courses (
  id uuid primary key default uuid_generate_v4(),
  department_id uuid not null references public.departments(id) on delete cascade,
  code text not null,
  title text not null,
  semester text not null,
  created_at timestamptz default now(),
  unique(department_id, code)
);

-- 4. profiles table
create table if not exists public.profiles (
  id uuid primary key,
  name text not null,
  email text not null unique,
  role text not null check (role in ('student', 'admin')) default 'student',
  department_id uuid references public.departments(id),
  alias text,
  avatar_url text,
  created_at timestamptz default now()
);

-- 5. resources table
create table if not exists public.resources (
  id uuid primary key default uuid_generate_v4(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  type text not null check (type in ('notes', 'past_paper', 'slides', 'other')),
  file_path text not null,
  file_size text default '2.4 MB',
  page_count integer default 12,
  uploaded_by uuid references public.profiles(id),
  status text not null check (status in ('draft', 'published', 'flagged')) default 'published',
  created_at timestamptz default now(),
  search_vector tsvector
);

-- 6. cgpa_submissions table
create table if not exists public.cgpa_submissions (
  id uuid primary key default uuid_generate_v4(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  cgpa numeric(3,2) not null check (cgpa >= 0.00 and cgpa <= 4.00),
  credits_completed integer default 0,
  proof_path text not null,
  status text not null check (status in ('pending', 'verified', 'rejected')) default 'pending',
  verified_by uuid references public.profiles(id),
  verified_at timestamptz,
  created_at timestamptz default now()
);

-- 7. leaderboard_optins table
create table if not exists public.leaderboard_optins (
  profile_id uuid primary key references public.profiles(id) on delete cascade,
  show_name boolean default false,
  created_at timestamptz default now()
);

-- 8. reports table (copyright & takedowns)
create table if not exists public.reports (
  id uuid primary key default uuid_generate_v4(),
  resource_id uuid not null references public.resources(id) on delete cascade,
  reporter_id uuid references public.profiles(id),
  reason text not null,
  status text not null check (status in ('pending', 'resolved', 'dismissed')) default 'pending',
  created_at timestamptz default now()
);

-- Indexes for performance & search
create index if not exists idx_resources_search on public.resources using gin(search_vector);
create index if not exists idx_courses_code on public.courses(code);
create index if not exists idx_resources_course_id on public.resources(course_id);
create index if not exists idx_resources_status on public.resources(status);
create index if not exists idx_cgpa_status on public.cgpa_submissions(status);

-- Automatic tsvector update trigger for full-text search
create or replace function public.resources_search_update() returns trigger as $$
begin
  new.search_vector := 
    setweight(to_tsvector('english', coalesce(new.title, '')), 'A') ||
    setweight(to_tsvector('english', coalesce(new.type, '')), 'B');
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_resources_search_update on public.resources;
create trigger trg_resources_search_update
  before insert or update on public.resources
  for each row execute function public.resources_search_update();
