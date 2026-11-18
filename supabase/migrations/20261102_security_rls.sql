-- ANTI-MATTER v2: Row Level Security, Role Protection & University Domain Check
-- Migration: 20261102_security_rls.sql (Items 1, 2, 4 from Blueprint)

-- Enable RLS on all tables
alter table public.institutions enable row level security;
alter table public.departments enable row level security;
alter table public.courses enable row level security;
alter table public.resources enable row level security;
alter table public.profiles enable row level security;
alter table public.cgpa_submissions enable row level security;
alter table public.leaderboard_optins enable row level security;
alter table public.reports enable row level security;

-- 1. INSTITUTIONS: Public read
create policy institutions_read on public.institutions
  for select to anon, authenticated using (true);

-- 2. DEPARTMENTS: Public read
create policy departments_read on public.departments
  for select to anon, authenticated using (true);

-- 3. COURSES: Public read
create policy courses_read on public.courses
  for select to anon, authenticated using (true);

-- 4. RESOURCES (from Blueprint page 15)
-- anyone can read published resource info
create policy resources_read on public.resources
  for select to anon, authenticated using (status = 'published');

-- only admins can add, change or delete
create policy resources_admin on public.resources
  for all to authenticated
  using (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin'))
  with check (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin'));

-- 5. PROFILES (from Blueprint page 15)
-- a user reads and edits only their own profile, and cannot make themselves admin
create policy profile_read on public.profiles
  for select to authenticated using (id = (select auth.uid()));

create policy profile_update on public.profiles
  for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()) and role = 'student');

-- Admins can read all profiles
create policy profile_admin_read on public.profiles
  for select to authenticated
  using (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin'));

-- 6. CGPA SUBMISSIONS (Items 5.5: CGPA proofs private, admin read only)
-- Student can view and create their own submissions
create policy cgpa_student_read on public.cgpa_submissions
  for select to authenticated using (profile_id = (select auth.uid()));

create policy cgpa_student_insert on public.cgpa_submissions
  for insert to authenticated
  with check (profile_id = (select auth.uid()) and status = 'pending');

-- Admins can view and update all cgpa submissions (for verification)
create policy cgpa_admin_all on public.cgpa_submissions
  for all to authenticated
  using (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin'));

-- 7. LEADERBOARD OPT-INS
-- Users can manage their own opt-in status
create policy optins_read on public.leaderboard_optins
  for select to anon, authenticated using (true);

create policy optins_own_manage on public.leaderboard_optins
  for all to authenticated
  using (profile_id = (select auth.uid()))
  with check (profile_id = (select auth.uid()));

-- 8. REPORTS
-- Authenticated users can insert reports
create policy reports_insert on public.reports
  for insert to authenticated
  with check (reporter_id = (select auth.uid()));

-- Admins manage all reports
create policy reports_admin on public.reports
  for all to authenticated
  using (exists (select 1 from public.profiles p where p.id = (select auth.uid()) and p.role = 'admin'));

-- 9. UNIVERSITY DOMAIN ENFORCEMENT TRIGGER (from Blueprint page 15)
-- allow only the university email domain (confirm the real domain first: iub.edu.bd)
create or replace function public.enforce_email_domain() returns trigger
language plpgsql security definer set search_path = '' as $$
begin
  if new.email is null or lower(split_part(new.email, '@', 2)) <> 'iub.edu.bd' then
    raise exception 'Email domain not allowed. Only @iub.edu.bd accounts are permitted.';
  end if;
  return new;
end $$;

drop trigger if exists enforce_domain on auth.users;
create trigger enforce_domain before insert on auth.users
  for each row execute function public.enforce_email_domain();
