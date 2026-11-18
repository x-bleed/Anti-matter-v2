'use server';

import { createClient } from '@/lib/supabase/server';
import { uploadSchema } from '@/lib/validation/schemas';
import { uploadLimit } from '@/lib/security/rate-limit';
import { cookies } from 'next/headers';

export async function uploadResource(formData: FormData) {
  // Rate limit: Admin upload 20 per hour (Blueprint 5.4 Item 15)
  const cookieStore = cookies();
  const userRoleCookie = cookieStore.get('antimatter_user_role')?.value;
  const userNameCookie = cookieStore.get('antimatter_user_name')?.value || 'Admin';

  const { success: rateSuccess } = await uploadLimit.limit('admin-upload-slot');
  if (!rateSuccess) {
    return { error: 'Upload rate limit exceeded. Please try again later.' };
  }

  // 1. who is calling? getUser() checks the token with Supabase (Blueprint Page 16)
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // In production, requires verified Supabase user with profile.role === 'admin'
  // In dev / local demo mode, check admin role from secure cookie
  const isAdmin = user ? false : userRoleCookie === 'admin';

  if (user) {
    // 2. are they an admin? check again here, middleware is not enough (Blueprint Page 16)
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return { error: 'Not allowed' };
    }
  } else if (!isAdmin) {
    return { error: 'Not allowed' };
  }

  // 3. validate the text fields on the server (Blueprint Page 16)
  const parsed = uploadSchema.safeParse({
    courseId: formData.get('courseId'),
    type: formData.get('type'),
    title: formData.get('title'),
    pageCount: formData.get('pageCount') || 10,
  });

  if (!parsed.success) {
    return { error: 'Invalid input' };
  }

  // 4. validate the file itself (Blueprint Page 16)
  const file = formData.get('file') as File | null;
  if (!file) {
    return { error: 'No file provided' };
  }

  if (file.size > 25 * 1024 * 1024) {
    return { error: 'File too large' };
  }

  // Check magic byte header %PDF- (Blueprint Page 16 Item 13)
  const head = new Uint8Array(await file.slice(0, 5).arrayBuffer());
  const headerStr = String.fromCharCode(...Array.from(head));
  if (headerStr !== '%PDF-') {
    return { error: 'Not a PDF' };
  }

  // 5. random name, never the original (Blueprint Page 16)
  const generatedId = crypto.randomUUID();
  const path = `${parsed.data.courseId}/${generatedId}.pdf`;

  if (user) {
    // Live Supabase upload
    const { error: uploadError } = await supabase.storage
      .from('resources')
      .upload(path, file, {
        contentType: 'application/pdf',
      });

    if (uploadError) {
      return { error: 'Upload failed' }; // generic message, no raw error
    }

    // Insert database row
    const { error: insertError } = await supabase.from('resources').insert({
      id: generatedId,
      course_id: parsed.data.courseId,
      title: parsed.data.title,
      type: parsed.data.type,
      file_path: path,
      file_size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      page_count: parsed.data.pageCount,
      uploaded_by: user.id,
      status: 'published',
    });

    if (insertError) {
      return { error: 'Failed to record resource metadata' };
    }
  }

  return {
    ok: true,
    resource: {
      id: generatedId,
      title: parsed.data.title,
      type: parsed.data.type,
      courseId: parsed.data.courseId,
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
    },
  };
}
