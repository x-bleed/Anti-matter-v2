import React from 'react';
import { LeaderboardEntry } from '@/types';
import { cn } from '@/lib/utils';
import { CheckCircle2, Award } from 'lucide-react';

export interface RankRowProps {
  entry: LeaderboardEntry;
}

export function RankRow({ entry }: RankRowProps) {
  // Top three badges: gold (#FACC15), silver (#CBD5E1), bronze (#D97706) (Blueprint 4.1 & 4.4)
  const getRankBadge = (rank: number) => {
    if (rank === 1) {
      return (
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FACC15]/20 text-[#FACC15] border border-[#FACC15]/40 font-bold text-sm shadow-[0_0_10px_rgba(250,204,21,0.3)]">
          1
        </span>
      );
    }
    if (rank === 2) {
      return (
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#CBD5E1]/20 text-[#CBD5E1] border border-[#CBD5E1]/40 font-bold text-sm">
          2
        </span>
      );
    }
    if (rank === 3) {
      return (
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#D97706]/20 text-[#D97706] border border-[#D97706]/40 font-bold text-sm">
          3
        </span>
      );
    }
    return <span className="font-mono text-sm text-muted font-medium w-8 text-center">{rank}</span>;
  };

  return (
    // Leaderboard row: Height 60px, 0 20px padding, radius 12px (Blueprint 4.4)
    // Columns: rank (48px), avatar (36px), name, department, CGPA (right aligned, mono)
    <div className="flex h-[60px] items-center justify-between rounded-xl border border-border/60 bg-surface px-5 transition duration-150 hover:bg-surface-2 hover:border-primary/40">
      <div className="flex items-center gap-4">
        {/* Rank column: 48px width */}
        <div className="w-12 flex items-center justify-start shrink-0">
          {getRankBadge(entry.rank)}
        </div>

        {/* Avatar: 36px (Blueprint 4.4) */}
        <div className="relative h-9 w-9 shrink-0 overflow-hidden rounded-full border border-border bg-surface-2 flex items-center justify-center text-xs font-semibold text-primary-soft">
          {entry.avatar_url ? (
            <img
              src={entry.avatar_url}
              alt={entry.alias || entry.name}
              className="h-full w-full object-cover"
            />
          ) : (
            (entry.alias || entry.name).charAt(0).toUpperCase()
          )}
        </div>

        {/* Name / Alias and Verified Badge */}
        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-sm font-semibold text-text truncate">
              {entry.alias || entry.name}
            </span>
            {entry.verified && (
              <span title="Verified by Academic Admin" className="shrink-0 text-success">
                <CheckCircle2 className="h-4 w-4" />
              </span>
            )}
          </div>
          <span className="text-xs text-muted/80 font-mono">
            {entry.credits_completed} credits completed
          </span>
        </div>
      </div>

      <div className="flex items-center gap-6">
        {/* Department: Hidden on mobile (Blueprint 4.6) */}
        <div className="hidden sm:block text-right">
          <span className="inline-block rounded-md bg-surface-2 px-2.5 py-1 font-mono text-xs text-muted border border-border/50">
            {entry.department_code}
          </span>
        </div>

        {/* CGPA: right-aligned, mono (Blueprint 4.4) */}
        <div className="text-right min-w-[70px]">
          <span className="font-mono text-base font-bold text-text">
            {entry.cgpa.toFixed(2)}
          </span>
          <span className="text-[10px] text-muted block -mt-1 font-mono">CGPA</span>
        </div>
      </div>
    </div>
  );
}
