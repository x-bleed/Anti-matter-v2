-- ANTI-MATTER v2: Storage Rules & Policies
-- Migration: 20261103_storage_policies.sql (Items 1, 13 and CGPA Proofs rule)

-- Buckets: resources (private) and cgpa-proofs (private). Create in dashboard.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values 
  ('resources', 'resources', false, 26214400, array['application/pdf']),
  ('cgpa-proofs', 'cgpa-proofs', false, 10485760, array['image/png', 'image/jpeg', 'application/pdf'])
on conflict (id) do nothing;

-- Storage Policies for resources bucket:
create policy resources_files_read on storage.objects
  for select to authenticated using (bucket_id = 'resources');

create policy resources_files_admin_write on storage.objects
  for insert to authenticated
  with check (bucket_id = 'resources' and exists (
    select 1 from public.profiles p
    where p.id = (select auth.uid()) and p.role = 'admin'
  ));

-- Storage Policies for cgpa-proofs bucket:
create policy proofs_upload_own on storage.objects
  for insert to authenticated
  with check (
    bucket_id = 'cgpa-proofs'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy proofs_admin_read on storage.objects
  for select to authenticated
  using (
    bucket_id = 'cgpa-proofs' and exists (
      select 1 from public.profiles p
      where p.id = (select auth.uid()) and p.role = 'admin'
    )
  );
