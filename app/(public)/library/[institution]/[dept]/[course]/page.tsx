'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { COURSES, DEPARTMENTS, INSTITUTION } from '@/lib/constants';
import { INITIAL_RESOURCES, SAMPLE_PDF_BLOB } from '@/lib/data/mock-db';
import { Tabs } from '@/components/ui/Tabs';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';
import { ResourceType } from '@/types';
import { Download, FileText, Calendar, Layers, ArrowLeft, ExternalLink, ShieldCheck } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

export default function CoursePage({
  params,
}: {
  params: { institution: string; dept: string; course: string };
}) {
  const { toast, success } = useToast();
  const [activeTab, setActiveTab] = useState<ResourceType>('notes');

  // Decode route params (e.g. 'cse-213' or 'cse 213')
  const courseCode = decodeURIComponent(params.course).replace('-', ' ').toUpperCase();
  const course = COURSES.find((c) => c.code.toUpperCase() === courseCode);
  const department = DEPARTMENTS.find((d) => d.slug.toLowerCase() === params.dept.toLowerCase());

  if (!course) {
    // If not found in standard list, show fallback or notFound
    const fallbackCourse = COURSES[0];
    return (
      <div className="mx-auto max-w-container px-6 py-12 text-center">
        <h1 className="font-heading text-2xl font-bold">Course Not Found</h1>
        <p className="mt-2 text-muted">The course &quot;{courseCode}&quot; does not exist in the database.</p>
        <Link href="/library" className="mt-4 inline-block text-primary-soft hover:underline">
          Return to Library
        </Link>
      </div>
    );
  }

  // Get resources for this course
  const courseResources = useMemo(() => {
    return INITIAL_RESOURCES.filter((r) => r.course_id === course.id);
  }, [course.id]);

  const notes = courseResources.filter((r) => r.type === 'notes');
  const pastPapers = courseResources.filter((r) => r.type === 'past_paper');
  const slides = courseResources.filter((r) => r.type === 'slides');
  const other = courseResources.filter((r) => r.type === 'other');

  const tabs = [
    { id: 'notes', label: 'Lecture Notes', count: notes.length },
    { id: 'past_paper', label: 'Past Papers', count: pastPapers.length },
    { id: 'slides', label: 'Lecture Slides', count: slides.length },
    { id: 'other', label: 'Other Guides', count: other.length },
  ];

  const currentList =
    activeTab === 'notes'
      ? notes
      : activeTab === 'past_paper'
      ? pastPapers
      : activeTab === 'slides'
      ? slides
      : other;

  const handleDownload = (e: React.MouseEvent, title: string) => {
    e.preventDefault();
    success('Generating signed link...', 'Valid for 15 minutes via Supabase private bucket.');
    const a = document.createElement('a');
    a.href = SAMPLE_PDF_BLOB;
    a.download = `${title.replace(/\s+/g, '_')}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="mx-auto max-w-container px-6 py-8">
      {/* Back button */}
      <div className="mb-6">
        <Link
          href="/library"
          className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-primary-soft font-mono transition"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back to Library</span>
        </Link>
      </div>

      {/* Header block: course code in mono badge, course title h1, department and semester as muted meta, 24 px padding bottom (Blueprint 4.5) */}
      <div className="border-b border-border pb-6 mb-8">
        <div className="flex items-center gap-3 mb-3">
          {/* Course code in mono badge */}
          <span className="inline-flex h-7 items-center rounded-md border border-primary/40 bg-primary/15 px-3 font-mono text-xs font-bold text-primary-soft">
            {course.code}
          </span>
          <span className="text-xs text-muted font-mono">{INSTITUTION.name}</span>
        </div>

        {/* Course title h1 */}
        <h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-text">
          {course.title}
        </h1>

        {/* Department and semester as muted meta */}
        <div className="mt-3 flex flex-wrap items-center gap-4 text-sm text-muted">
          <span>{department?.name || 'Computer Science and Engineering'}</span>
          <span>•</span>
          <span className="font-mono text-xs text-primary-soft bg-surface-2 px-2 py-0.5 rounded">
            {course.semester}
          </span>
          <span>•</span>
          <span>{courseResources.length} Total Resources</span>
        </div>
      </div>

      {/* Tabs for Notes, Past Papers, Slides, Other (Blueprint 4.5) */}
      <Tabs
        tabs={tabs}
        activeTab={activeTab}
        onChange={(id) => setActiveTab(id as ResourceType)}
        className="mb-6"
      />

      {/* Under each tab a list (not a grid) of rows 72 px tall: title, size, date, download icon button (Blueprint 4.5) */}
      <div className="flex flex-col gap-2.5">
        {currentList.length > 0 ? (
          currentList.map((res) => (
            <div
              key={res.id}
              // List of rows 72 px tall (Blueprint 4.5)
              className="flex h-[72px] items-center justify-between rounded-lg border border-border bg-surface px-5 shadow-card transition duration-150 hover:border-primary/60 hover:bg-surface-2"
            >
              <div className="flex items-center gap-4 min-w-0 pr-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-2 text-primary-soft">
                  <FileText className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <Link
                    href={`/resource/${res.id}`}
                    className="font-heading text-sm sm:text-base font-semibold text-text hover:text-primary-soft transition line-clamp-1"
                  >
                    {res.title}
                  </Link>
                  <div className="flex items-center gap-3 text-xs text-muted mt-0.5">
                    <span className="font-mono">{res.file_size}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Layers className="h-3 w-3" />
                      {res.page_count} pages
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(res.created_at)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <Link
                  href={`/resource/${res.id}`}
                  className="hidden sm:inline-flex items-center gap-1 text-xs text-muted hover:text-primary-soft transition px-2 py-1 rounded"
                >
                  <span>Preview</span>
                  <ExternalLink className="h-3.5 w-3.5" />
                </Link>

                {/* Download icon button */}
                <button
                  onClick={(e) => handleDownload(e, res.title)}
                  className="flex h-9 w-9 items-center justify-center rounded-md bg-surface-2 text-primary-soft hover:bg-primary hover:text-white transition"
                  title="Download signed PDF"
                  aria-label="Download signed PDF"
                >
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-lg border border-border bg-surface p-12 text-center">
            <p className="text-sm text-muted">No files currently available under this category.</p>
          </div>
        )}
      </div>
    </div>
  );
}
