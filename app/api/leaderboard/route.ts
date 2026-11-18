import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_LEADERBOARD } from '@/lib/data/mock-db';

export async function GET(req: NextRequest) {
  // View sorts verified submissions by CGPA with a tie break on credits completed (Blueprint 3.5)
  const sorted = [...INITIAL_LEADERBOARD].sort((a, b) => {
    if (b.cgpa !== a.cgpa) {
      return b.cgpa - a.cgpa;
    }
    return b.credits_completed - a.credits_completed;
  });

  return NextResponse.json({
    leaderboard: sorted.map((item, idx) => ({
      ...item,
      rank: idx + 1,
    })),
  });
}
