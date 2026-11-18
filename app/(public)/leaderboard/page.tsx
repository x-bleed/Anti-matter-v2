'use client';

import React, { useState, useEffect } from 'react';
import { RankTable } from '@/components/leaderboard/RankTable';
import { LeaderboardEntry } from '@/types';
import { Trophy, RefreshCw } from 'lucide-react';

export default function LeaderboardPage() {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch('/api/leaderboard');
        if (res.ok) {
          const data = await res.json();
          setEntries(data.leaderboard || []);
        }
      } catch {
        setEntries([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

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

      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-16 text-muted">
          <RefreshCw className="h-8 w-8 animate-spin text-primary-soft mb-3" />
          <p className="text-sm">Fetching verified rankings...</p>
        </div>
      ) : (
        <RankTable initialEntries={entries} />
      )}
    </div>
  );
}
