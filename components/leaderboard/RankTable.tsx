'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { LeaderboardEntry } from '@/types';
import { RankRow } from './RankRow';
import { Tabs } from '@/components/ui/Tabs';
import { Button } from '@/components/ui/Button';
import { Trophy, ShieldCheck, Sparkles, PlusCircle } from 'lucide-react';

export interface RankTableProps {
  initialEntries: LeaderboardEntry[];
}

export function RankTable({ initialEntries }: RankTableProps) {
  const [activeTab, setActiveTab] = useState<'overall' | 'cse' | 'autumn'>('overall');

  const tabs = [
    { id: 'overall', label: 'Overall University' },
    { id: 'cse', label: 'My Department (CSE)' },
    { id: 'autumn', label: 'My Semester (Autumn 2026)' },
  ];

  const getFilteredEntries = () => {
    switch (activeTab) {
      case 'cse':
        return initialEntries.filter((e) => e.department_code === 'CSE');
      case 'autumn':
        return initialEntries.filter((e) => e.semester === 'Autumn 2026');
      default:
        return initialEntries;
    }
  };

  const filteredEntries = getFilteredEntries();

  return (
    <div className="flex flex-col gap-6">
      {/* Top banner: 72px tall explains that the board is opt in and verified. Button to join sits right (Blueprint 4.5) */}
      <div className="flex min-h-[72px] flex-col sm:flex-row items-start sm:items-center justify-between rounded-xl border border-primary/30 bg-gradient-to-r from-surface to-surface-2 p-4 px-6 shadow-card gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/20 text-primary-soft">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <h4 className="font-heading text-sm font-semibold text-text">
              Verified Academic Ranking (Opt-In Only)
            </h4>
            <p className="text-xs text-muted">
              Student submissions require official grade report verification. You can choose to rank with your name or an anonymous alias.
            </p>
          </div>
        </div>

        <Link href="/profile" className="shrink-0 self-end sm:self-center">
          <Button size="sm" variant="primary" className="gap-1.5 shadow-[0_0_12px_rgba(124,58,237,0.3)]">
            <PlusCircle className="h-4 w-4" />
            <span>Join Leaderboard</span>
          </Button>
        </Link>
      </div>

      {/* Tabs */}
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onChange={(id) => setActiveTab(id as any)}
      />

      {/* Rows Container */}
      <div className="flex flex-col gap-2.5">
        {filteredEntries.length > 0 ? (
          filteredEntries.map((entry, idx) => (
            <RankRow key={entry.profile_id} entry={{ ...entry, rank: idx + 1 }} />
          ))
        ) : (
          <div className="rounded-xl border border-border bg-surface p-12 text-center">
            <Trophy className="mx-auto h-8 w-8 text-muted mb-2" />
            <p className="text-sm font-medium text-text">No verified rankings for this filter yet.</p>
            <p className="text-xs text-muted mt-1">
              Be the first to submit your verified grade sheet!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
