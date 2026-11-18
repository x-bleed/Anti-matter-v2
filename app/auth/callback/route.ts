import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data?.user) {
      const { email, id, user_metadata } = data.user;
      const domain = email?.split('@')[1]?.toLowerCase();

      // Enforce university email domain check (Blueprint 5.1 Item 4)
      // Allow only @iub.edu.bd emails
      if (domain !== 'iub.edu.bd') {
        await supabase.auth.signOut();
        return NextResponse.redirect(
          `${origin}/login?error=${encodeURIComponent('Only @iub.edu.bd student emails are allowed.')}`
        );
      }

      // Check if user is configured as admin
      const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'fahad@iub.edu.bd';
      const isAdmin = email?.toLowerCase() === adminEmail.toLowerCase();

      // Auto-create/sync profile in public.profiles table
      try {
        await supabase.from('profiles').upsert(
          {
            id,
            email: email!,
            name: user_metadata?.full_name || user_metadata?.name || email!.split('@')[0],
            avatar_url: user_metadata?.avatar_url || user_metadata?.picture || null,
            role: isAdmin ? 'admin' : 'student',
          },
          { onConflict: 'id' }
        );
      } catch {
        // Continue even if table migration is pending
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_failed`);
}
