import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { INITIAL_LEADERBOARD } from '@/lib/data/mock-db';

export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient();
    const isMock =
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      process.env.NEXT_PUBLIC_SUPABASE_URL.includes('mock');

    if (!isMock) {
      // Query verified submissions joined with profiles and opt-in status
      const { data, error } = await supabase
        .from('cgpa_submissions')
        .select(`
          id,
          profile_id,
          cgpa,
          credits_completed,
          created_at,
          profile:profiles (
            id,
            name,
            alias,
            avatar_url,
            department:departments (name, slug)
          )
        `)
        .eq('status', 'verified')
        .order('cgpa', { ascending: false })
        .order('credits_completed', { ascending: false });

      if (!error && data) {
        const mapped = data.map((item: any, idx: number) => {
          const profile = item.profile;
          const dept = profile?.department;
          return {
            rank: idx + 1,
            profile_id: item.profile_id,
            name: profile?.name || 'Verified Student',
            alias: profile?.alias || undefined,
            avatar_url: profile?.avatar_url || undefined,
            department_code: dept?.slug ? dept.slug.toUpperCase() : 'CSE',
            department_name: dept?.name || 'Independent University, Bangladesh',
            cgpa: Number(item.cgpa),
            credits_completed: Number(item.credits_completed) || 0,
            verified: true,
          };
        });

        return NextResponse.json({ leaderboard: mapped });
      }
    }

    return NextResponse.json({ leaderboard: INITIAL_LEADERBOARD });
  } catch {
    return NextResponse.json({ leaderboard: [] });
  }
}
