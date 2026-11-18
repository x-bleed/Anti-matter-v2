import React from 'react';
import { RankTable } from '@/components/leaderboard/RankTable';
import { INITIAL_LEADERBOARD } from '@/lib/data/mock-db';
import { Trophy, ShieldCheck, Sparkles } from 'lucide-react';

export default function LeaderboardPage() {
  return (
    <div className="mx-auto max-w-container px-6 py-8">
      {/* Header */}
      <div className="flex flex-col gap-2 mb-8">
        <div className="inline-flex items-center gap-2 text-xs font-mono text-primary-soft uppercase tracking-wider">
          <Trophy className="h-4 w-4" />
          <span>IUB Certified Academic Rankings</span>
        </div>
        <h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-text">
          University Leaderboard
        </h1>
        <p className="text-sm text-muted max-w-2xl">
          Recognizing academic excellence through verified CGPA records. Rankings are strictly opt-in and validated by academic administrators.
        </p>
      </div>

      {/* Main Rank Table */}
      <RankTable initialEntries={INITIAL_LEADERBOARD} />
    </div>
  );
}
