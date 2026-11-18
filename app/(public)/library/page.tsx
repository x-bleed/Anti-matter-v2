'use client';

import React, { useState, useEffect, useMemo, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { FilterPanel, FilterState } from '@/components/library/FilterPanel';
import { ResourceCard } from '@/components/library/ResourceCard';
import { SearchBar } from '@/components/library/SearchBar';
import { Button } from '@/components/ui/Button';
import { INITIAL_RESOURCES } from '@/lib/data/mock-db';
import { DEPARTMENTS, COURSES } from '@/lib/constants';
import { Resource, ResourceType } from '@/types';
import { Filter, SlidersHorizontal, ChevronLeft, ChevronRight, X, BookOpen, Layers } from 'lucide-react';

function LibraryContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // Search query from URL
  const queryParam = searchParams.get('q') || '';
  const deptParam = searchParams.get('dept') || '';
  const courseParam = searchParams.get('course') || '';
  const typeParam = (searchParams.get('type') as ResourceType | 'all') || 'all';

  const [filters, setFilters] = useState<FilterState>({
    department: deptParam,
    course: courseParam,
    type: typeParam,
    semester: '',
  });

  const [searchQuery, setSearchQuery] = useState(queryParam);
  const [sortOption, setSortOption] = useState<'newest' | 'oldest' | 'title' | 'popular'>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Sync state if URL changes
  useEffect(() => {
    setSearchQuery(queryParam);
    setFilters((prev) => ({
      ...prev,
      department: deptParam,
      course: courseParam,
      type: typeParam,
    }));
    setCurrentPage(1);
  }, [queryParam, deptParam, courseParam, typeParam]);

  // Filter and sort items
  const filteredResources = useMemo(() => {
    let list = [...INITIAL_RESOURCES];

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          r.course?.code.toLowerCase().includes(q) ||
          r.course?.title.toLowerCase().includes(q)
      );
    }

    if (filters.department) {
      list = list.filter((r) => r.course?.department?.slug === filters.department);
    }

    if (filters.course) {
      list = list.filter((r) => r.course?.code.toLowerCase() === filters.course.toLowerCase());
    }

    if (filters.type && filters.type !== 'all') {
      list = list.filter((r) => r.type === filters.type);
    }

    if (filters.semester) {
      list = list.filter((r) => r.course?.semester === filters.semester);
    }

    // Sort
    if (sortOption === 'oldest') {
      list.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    } else if (sortOption === 'title') {
      list.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sortOption === 'popular') {
      list.sort((a, b) => (b.download_count || 0) - (a.download_count || 0));
    } else {
      list.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    return list;
  }, [searchQuery, filters, sortOption]);

  // Pagination: 12 cards per page (Blueprint 4.5)
  const pageSize = 12;
  const totalPages = Math.ceil(filteredResources.length / pageSize) || 1;
  const paginatedResources = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredResources.slice(start, start + pageSize);
  }, [filteredResources, currentPage, pageSize]);

  const handleResetFilters = () => {
    setFilters({
      department: '',
      course: '',
      type: 'all',
      semester: '',
    });
    setSearchQuery('');
    router.push('/library');
  };

  const removeFilterChip = (key: keyof FilterState) => {
    setFilters((prev) => ({
      ...prev,
      [key]: key === 'type' ? 'all' : '',
    }));
  };

  return (
    <div className="mx-auto max-w-[1264px] px-6 py-6">
      {/* Breadcrumb row: 40 px high (Blueprint 4.5) */}
      <nav className="flex h-10 items-center gap-2 text-xs text-muted mb-2 font-mono">
        <Link href="/" className="hover:text-primary-soft transition">
          Home
        </Link>
        <span>/</span>
        <span className="text-text font-semibold">Academic Library</span>
        {filters.department && (
          <>
            <span>/</span>
            <span className="uppercase text-primary-soft">{filters.department}</span>
          </>
        )}
        {filters.course && (
          <>
            <span>/</span>
            <span className="uppercase text-text">{filters.course}</span>
          </>
        )}
      </nav>

      {/* Page title h1 with result count in muted text (Blueprint 4.5) */}
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between pb-6 gap-2">
        <div className="flex items-baseline gap-3">
          <h1 className="font-heading text-3xl sm:text-4xl font-bold tracking-tight text-text">
            Resource Library
          </h1>
          <span className="font-mono text-sm text-muted">
            ({filteredResources.length} {filteredResources.length === 1 ? 'file' : 'files'} found)
          </span>
        </div>

        {/* Mobile filter button */}
        <div className="flex sm:hidden items-center gap-2 mt-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => setIsMobileFilterOpen(true)}
            className="w-full gap-2"
          >
            <Filter className="h-4 w-4" />
            <span>Filters</span>
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6 max-w-full">
        <SearchBar
          initialQuery={searchQuery}
          onSearch={(q) => {
            setSearchQuery(q);
            setCurrentPage(1);
          }}
        />
      </div>

      {/* Two column layout: filter sidebar 280 px, results grid fills the rest (Blueprint 4.5) */}
      <div className="flex gap-8 items-start">
        {/* Filter sidebar 280 px */}
        <FilterPanel
          filters={filters}
          onChange={(newFilters) => {
            setFilters(newFilters);
            setCurrentPage(1);
          }}
          onReset={handleResetFilters}
          isOpenMobile={isMobileFilterOpen}
          onCloseMobile={() => setIsMobileFilterOpen(false)}
        />

        {/* Results column */}
        <div className="flex-1 min-w-0">
          {/* Toolbar above results: sort dropdown right, active filter chips left, 16 px gap (Blueprint 4.5) */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-5 border-b border-border/60 mb-6">
            {/* Active filter chips left */}
            <div className="flex flex-wrap items-center gap-2">
              {searchQuery && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/15 border border-primary/30 px-3 py-1 text-xs text-primary-soft">
                  <span>Search: &ldquo;{searchQuery}&rdquo;</span>
                  <button onClick={() => setSearchQuery('')} className="hover:text-text">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {filters.department && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-2 border border-border px-3 py-1 text-xs text-text">
                  <span className="uppercase font-mono">{filters.department}</span>
                  <button onClick={() => removeFilterChip('department')} className="hover:text-primary-soft">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {filters.course && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-2 border border-border px-3 py-1 text-xs text-text">
                  <span className="font-mono">{filters.course}</span>
                  <button onClick={() => removeFilterChip('course')} className="hover:text-primary-soft">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {filters.type !== 'all' && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-2 border border-border px-3 py-1 text-xs text-text">
                  <span className="capitalize">{filters.type.replace('_', ' ')}</span>
                  <button onClick={() => removeFilterChip('type')} className="hover:text-primary-soft">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {filters.semester && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-2 border border-border px-3 py-1 text-xs text-text">
                  <span>{filters.semester}</span>
                  <button onClick={() => removeFilterChip('semester')} className="hover:text-primary-soft">
                    <X className="h-3 w-3" />
                  </button>
                </span>
              )}
              {(searchQuery || filters.department || filters.course || filters.type !== 'all' || filters.semester) && (
                <button
                  onClick={handleResetFilters}
                  className="text-xs text-muted hover:text-danger ml-2 transition"
                >
                  Clear all
                </button>
              )}
            </div>

            {/* Sort dropdown right */}
            <div className="flex items-center gap-2">
              <span className="text-xs text-muted">Sort by:</span>
              <select
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as any)}
                className="h-9 rounded-md border border-border bg-surface-2 px-2.5 text-xs text-text focus:border-primary focus:outline-none"
              >
                <option value="newest">Newest Uploads</option>
                <option value="popular">Most Downloaded</option>
                <option value="title">Alphabetical (Title)</option>
                <option value="oldest">Oldest</option>
              </select>
            </div>
          </div>

          {/* Results grid: 3 cards wide on xl, 2 on lg, 1 on mobile (Blueprint 4.5) */}
          {paginatedResources.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {paginatedResources.map((res) => (
                <ResourceCard key={res.id} resource={res} />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-border bg-surface p-16 text-center">
              <BookOpen className="mx-auto h-12 w-12 text-muted/60 mb-3" />
              <h3 className="font-heading text-lg font-semibold text-text">
                No matching academic files found
              </h3>
              <p className="mt-1 text-sm text-muted max-w-md mx-auto">
                Try loosening your filters or search for another course code like CSE 213, EEE 101, or ACT 201.
              </p>
              <Button onClick={handleResetFilters} variant="secondary" className="mt-5">
                Reset all filters
              </Button>
            </div>
          )}

          {/* Pagination below, 12 cards per page, 48 px top margin (Blueprint 4.5) */}
          {totalPages > 1 && (
            <div className="mt-12 flex items-center justify-between border-t border-border pt-6">
              <span className="text-xs text-muted font-mono">
                Showing {(currentPage - 1) * pageSize + 1} -{' '}
                {Math.min(currentPage * pageSize, filteredResources.length)} of{' '}
                {filteredResources.length} files
              </span>

              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  disabled={currentPage <= 1}
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  className="gap-1"
                >
                  <ChevronLeft className="h-4 w-4" />
                  <span>Previous</span>
                </Button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`h-9 w-9 rounded-md text-xs font-mono transition ${
                        currentPage === page
                          ? 'bg-primary text-white font-bold'
                          : 'text-muted hover:bg-surface-2 hover:text-text'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                <Button
                  size="sm"
                  variant="secondary"
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  className="gap-1"
                >
                  <span>Next</span>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function LibraryPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-muted">Loading academic library...</div>}>
      <LibraryContent />
    </Suspense>
  );
}
