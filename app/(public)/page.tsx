import React from 'react';
import Link from 'next/link';
import { SearchBar } from '@/components/library/SearchBar';
import { DEPARTMENTS, COURSES } from '@/lib/constants';
import { INITIAL_RESOURCES, INITIAL_LEADERBOARD } from '@/lib/data/mock-db';
import { RankRow } from '@/components/leaderboard/RankRow';
import { Button } from '@/components/ui/Button';
import {
  Search,
  Download,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  FileCheck,
  Award,
  Users,
  Compass,
} from 'lucide-react';

export default function HomePage() {
  // Stats strip metrics
  const totalResources = INITIAL_RESOURCES.length;
  const totalCourses = COURSES.length;
  const totalStudents = 1420;

  // Top 5 verified leaderboard preview (Blueprint 4.5)
  const topLeaderboard = INITIAL_LEADERBOARD.slice(0, 5);

  return (
    <div className="flex flex-col">
      {/* 1. Hero Section (Blueprint 4.5) */}
      {/* Min height 560px, top padding 96px, display headline max 12 words, body-lg subtext 16px below, hero search bar 32px below. Soft purple radial glow behind, no heavy image */}
      <section className="relative min-h-[560px] pt-24 pb-20 px-6 flex flex-col items-center justify-center text-center overflow-hidden">
        {/* Soft purple radial glow behind */}
        <div
          className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[680px] rounded-full bg-primary/20 blur-[130px] -z-10"
          aria-hidden="true"
        />

        <div className="mx-auto max-w-container w-full flex flex-col items-center">
          {/* Badge indicator */}
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary-soft mb-6">
            <span className="h-2 w-2 rounded-full bg-primary animate-ping" />
            <span>Independent University, Bangladesh Academic Hub</span>
          </div>

          {/* Display headline: Max 12 words (Blueprint 4.5 & 4.2: 56/60px desktop, 36/40px mobile, weight 700) */}
          <h1 className="font-heading text-4xl sm:text-5xl lg:text-[56px] lg:leading-[60px] font-bold tracking-tight text-text max-w-4xl">
            Academic resources, past papers, and verified university rankings in one place.
          </h1>

          {/* Body-lg subtext: 16px below headline (Blueprint 4.5 & 4.2: 18/28px desktop, 400 weight) */}
          <p className="mt-4 text-base sm:text-lg lg:text-[18px] lg:leading-[28px] text-muted max-w-2xl font-normal">
            Discover verified lecture notes, exam papers, and syllabus guides curated for IUB students. Opt in to the community leaderboard with certified CGPA.
          </p>

          {/* Hero search bar: 32px below subtext (Blueprint 4.5) */}
          <div className="mt-8 w-full max-w-[640px]">
            <SearchBar autoFocus={false} />
          </div>

          {/* Quick course shortcut chips */}
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs text-muted">
            <span>Popular searches:</span>
            {COURSES.slice(0, 4).map((c) => (
              <Link
                key={c.code}
                href={`/library?course=${encodeURIComponent(c.code)}`}
                className="rounded-full bg-surface-2 border border-border px-2.5 py-1 font-mono text-primary-soft hover:border-primary-soft transition"
              >
                {c.code}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Stats Strip (Blueprint 4.5) */}
      {/* 3 items (resources, courses, students), 48px padding, 1px borders top and bottom */}
      <section className="w-full border-y border-border bg-surface/50 py-12 px-6">
        <div className="mx-auto max-w-container grid grid-cols-1 md:grid-cols-3 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-border">
          <div className="flex flex-col items-center px-4">
            <span className="font-heading font-bold text-3xl lg:text-4xl text-primary-soft">
              100+
            </span>
            <span className="text-sm text-muted mt-1 font-medium">Verified PDF Resources</span>
            <span className="text-xs text-muted/60 mt-0.5">Notes, Midterms &amp; Slide Decks</span>
          </div>

          <div className="flex flex-col items-center px-4 pt-6 md:pt-0">
            <span className="font-heading font-bold text-3xl lg:text-4xl text-primary-soft">
              {totalCourses} Courses
            </span>
            <span className="text-sm text-muted mt-1 font-medium">Active University Curriculum</span>
            <span className="text-xs text-muted/60 mt-0.5">Across CSE, EEE, BBA &amp; MPS</span>
          </div>

          <div className="flex flex-col items-center px-4 pt-6 md:pt-0">
            <span className="font-heading font-bold text-3xl lg:text-4xl text-primary-soft">
              1,400+
            </span>
            <span className="text-sm text-muted mt-1 font-medium">Active IUB Students</span>
            <span className="text-xs text-muted/60 mt-0.5">Strict @iub.edu.bd Authentication</span>
          </div>
        </div>
      </section>

      {/* 3. How It Works (Blueprint 4.5) */}
      {/* 3 cards in a row (search, find, download), 24px gap, icon 40px at top */}
      <section className="mx-auto max-w-container w-full py-20 px-6">
        <div className="text-center mb-12">
          <h2 className="font-heading text-2xl sm:text-3xl font-semibold text-text">
            How ANTI-MATTER Works
          </h2>
          <p className="mt-2 text-sm text-muted">
            Engineered for frictionless academic access and zero broken download links.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Search */}
          <div className="flex flex-col items-start rounded-lg border border-border bg-surface p-6 shadow-card transition duration-250 hover:-translate-y-1 hover:border-primary">
            {/* Icon 40px at top */}
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary-soft mb-5">
              <Search className="h-6 w-6" />
            </div>
            <h3 className="font-heading text-lg font-semibold text-text">1. Search &amp; Filter</h3>
            <p className="mt-2 text-sm text-muted leading-relaxed">
              Find files instantly by course code, lecture title, or semester using Postgres full-text indexing or the conversational NEBULA assistant.
            </p>
          </div>

          {/* Card 2: Find */}
          <div className="flex flex-col items-start rounded-lg border border-border bg-surface p-6 shadow-card transition duration-250 hover:-translate-y-1 hover:border-primary">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary-soft mb-5">
              <FileCheck className="h-6 w-6" />
            </div>
            <h3 className="font-heading text-lg font-semibold text-text">2. In-Browser Preview</h3>
            <p className="mt-2 text-sm text-muted leading-relaxed">
              Inspect notes and past papers directly inside the high-contrast 848 px viewer with signed security tokens before downloading.
            </p>
          </div>

          {/* Card 3: Download */}
          <div className="flex flex-col items-start rounded-lg border border-border bg-surface p-6 shadow-card transition duration-250 hover:-translate-y-1 hover:border-primary">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary-soft mb-5">
              <Download className="h-6 w-6" />
            </div>
            <h3 className="font-heading text-lg font-semibold text-text">3. 15-Minute Signed Link</h3>
            <p className="mt-2 text-sm text-muted leading-relaxed">
              Download clean, verified PDF documents through secure Supabase storage buckets protected by Row Level Security policies.
            </p>
          </div>
        </div>
      </section>

      {/* 4. Departments Grid (Blueprint 4.5) */}
      {/* 4 columns desktop, 2 mobile, each tile 120px tall with department name and file count */}
      <section className="w-full bg-surface/30 border-t border-border py-20 px-6">
        <div className="mx-auto max-w-container">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="font-heading text-2xl font-semibold text-text">
                Explore Departments
              </h2>
              <p className="text-sm text-muted mt-1">
                Curated course catalogs for all major disciplines at Independent University, Bangladesh
              </p>
            </div>
            <Link
              href="/library"
              className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-primary-soft hover:underline"
            >
              <span>View all files</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {DEPARTMENTS.map((dept) => (
              <Link
                key={dept.id}
                href={`/library?dept=${dept.slug}`}
                // Each tile 120px tall with department name and file count (Blueprint 4.5)
                className="group flex h-[120px] flex-col justify-between rounded-lg border border-border bg-surface p-4 shadow-card transition duration-250 hover:-translate-y-0.5 hover:border-primary"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold uppercase text-primary-soft group-hover:text-primary transition">
                    {dept.slug}
                  </span>
                  <BookOpen className="h-4 w-4 text-muted group-hover:text-primary-soft transition" />
                </div>
                <div>
                  <h4 className="font-heading text-sm font-semibold text-text group-hover:text-primary-soft transition line-clamp-1">
                    {dept.name}
                  </h4>
                  <span className="font-mono text-xs text-muted block mt-0.5">
                    {dept.file_count || 18} files
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 5. Leaderboard Preview (Blueprint 4.5) */}
      {/* Top 5 rows in a card, link to full page */}
      <section className="mx-auto max-w-container w-full py-20 px-6">
        <div className="rounded-xl border border-border bg-surface p-6 sm:p-8 shadow-card">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-border gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/15 text-amber-400">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-heading text-xl font-semibold text-text">
                  Verified Academic Leaderboard
                </h2>
                <p className="text-xs text-muted mt-0.5">
                  Top academic performers with admin-verified grade sheets (Opt-in only with alias support)
                </p>
              </div>
            </div>

            <Link href="/leaderboard">
              <Button size="sm" variant="secondary" className="gap-1.5">
                <span>View Full Rankings</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>

          <div className="mt-6 flex flex-col gap-2.5">
            {topLeaderboard.map((entry) => (
              <RankRow key={entry.profile_id} entry={entry} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
