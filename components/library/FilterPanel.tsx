'use client';

import React, { useState } from 'react';
import { cn } from '@/lib/utils';
import { DEPARTMENTS, COURSES, INSTITUTION } from '@/lib/constants';
import { ResourceType } from '@/types';
import { Filter, ChevronDown, ChevronUp, RotateCcw, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export interface FilterState {
  department: string;
  course: string;
  type: ResourceType | 'all';
  semester: string;
}

export interface FilterPanelProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  onReset: () => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  className?: string;
}

export function FilterPanel({
  filters,
  onChange,
  onReset,
  isOpenMobile = false,
  onCloseMobile,
  className,
}: FilterPanelProps) {
  // Collapsible sections state
  const [collapsed, setCollapsed] = useState({
    department: false,
    course: false,
    type: false,
    semester: false,
  });

  const toggleCollapse = (section: keyof typeof collapsed) => {
    setCollapsed((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const types: Array<{ id: ResourceType | 'all'; label: string }> = [
    { id: 'all', label: 'All Resource Types' },
    { id: 'notes', label: 'Lecture Notes' },
    { id: 'past_paper', label: 'Past Exam Papers' },
    { id: 'slides', label: 'Lecture Slides' },
    { id: 'other', label: 'Guides & Manuals' },
  ];

  const semesters = ['All Semesters', 'Autumn 2026', 'Summer 2026', 'Spring 2026'];

  const filteredCourses = filters.department
    ? COURSES.filter((c) => {
        const dept = DEPARTMENTS.find((d) => d.slug === filters.department);
        return dept ? c.department_id === dept.id : true;
      })
    : COURSES;

  const content = (
    <div className="flex flex-col gap-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-border">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-primary-soft" />
          <h3 className="font-heading text-base font-semibold text-text">Filters</h3>
        </div>
        <button
          onClick={onReset}
          className="flex items-center gap-1 text-xs text-muted hover:text-primary-soft transition"
        >
          <RotateCcw className="h-3 w-3" />
          <span>Reset</span>
        </button>
      </div>

      {/* Group 1: Department */}
      <div className="flex flex-col border-b border-border/50 pb-3">
        <button
          onClick={() => toggleCollapse('department')}
          className="flex items-center justify-between py-1 text-xs font-semibold uppercase tracking-wider text-muted hover:text-text transition"
        >
          <span>Department</span>
          {collapsed.department ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronUp className="h-3.5 w-3.5" />}
        </button>

        {!collapsed.department && (
          <div className="mt-2.5 flex flex-col gap-1.5">
            <button
              onClick={() => onChange({ ...filters, department: '', course: '' })}
              className={cn(
                'flex items-center justify-between rounded-md px-2.5 py-1.5 text-xs text-left transition',
                !filters.department
                  ? 'bg-primary/20 text-primary-soft font-semibold'
                  : 'text-muted hover:bg-surface-2 hover:text-text'
              )}
            >
              <span>All Departments</span>
            </button>
            {DEPARTMENTS.map((dept) => {
              const isSelected = filters.department === dept.slug;
              return (
                <button
                  key={dept.id}
                  onClick={() =>
                    onChange({
                      ...filters,
                      department: isSelected ? '' : dept.slug,
                      course: '',
                    })
                  }
                  className={cn(
                    'flex items-center justify-between rounded-md px-2.5 py-1.5 text-xs text-left transition',
                    isSelected
                      ? 'bg-primary/20 text-primary-soft font-semibold'
                      : 'text-muted hover:bg-surface-2 hover:text-text'
                  )}
                >
                  <span className="truncate">{dept.name}</span>
                  {dept.file_count && (
                    <span className="ml-2 font-mono text-[10px] opacity-70">
                      {dept.file_count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Group 2: Course */}
      <div className="flex flex-col border-b border-border/50 pb-3">
        <button
          onClick={() => toggleCollapse('course')}
          className="flex items-center justify-between py-1 text-xs font-semibold uppercase tracking-wider text-muted hover:text-text transition"
        >
          <span>Course Code</span>
          {collapsed.course ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronUp className="h-3.5 w-3.5" />}
        </button>

        {!collapsed.course && (
          <div className="mt-2.5 flex flex-col gap-1.5 max-h-48 overflow-y-auto pr-1">
            <button
              onClick={() => onChange({ ...filters, course: '' })}
              className={cn(
                'flex items-center justify-between rounded-md px-2.5 py-1.5 text-xs text-left transition',
                !filters.course
                  ? 'bg-primary/20 text-primary-soft font-semibold'
                  : 'text-muted hover:bg-surface-2 hover:text-text'
              )}
            >
              <span>All Courses</span>
            </button>
            {filteredCourses.map((c) => {
              const isSelected = filters.course === c.code;
              return (
                <button
                  key={c.id}
                  onClick={() => onChange({ ...filters, course: isSelected ? '' : c.code })}
                  className={cn(
                    'flex items-center justify-between rounded-md px-2.5 py-1.5 text-xs text-left transition',
                    isSelected
                      ? 'bg-primary/20 text-primary-soft font-semibold'
                      : 'text-muted hover:bg-surface-2 hover:text-text'
                  )}
                >
                  <span className="font-mono font-medium">{c.code}</span>
                  <span className="text-[10px] text-muted truncate max-w-[120px]">{c.title}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Group 3: Resource Type */}
      <div className="flex flex-col border-b border-border/50 pb-3">
        <button
          onClick={() => toggleCollapse('type')}
          className="flex items-center justify-between py-1 text-xs font-semibold uppercase tracking-wider text-muted hover:text-text transition"
        >
          <span>Type</span>
          {collapsed.type ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronUp className="h-3.5 w-3.5" />}
        </button>

        {!collapsed.type && (
          <div className="mt-2.5 flex flex-col gap-1.5">
            {types.map((t) => {
              const isSelected = filters.type === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => onChange({ ...filters, type: t.id })}
                  className={cn(
                    'flex items-center justify-between rounded-md px-2.5 py-1.5 text-xs text-left transition',
                    isSelected
                      ? 'bg-primary/20 text-primary-soft font-semibold'
                      : 'text-muted hover:bg-surface-2 hover:text-text'
                  )}
                >
                  <span>{t.label}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Group 4: Semester */}
      <div className="flex flex-col pb-1">
        <button
          onClick={() => toggleCollapse('semester')}
          className="flex items-center justify-between py-1 text-xs font-semibold uppercase tracking-wider text-muted hover:text-text transition"
        >
          <span>Semester</span>
          {collapsed.semester ? <ChevronDown className="h-3.5 w-3.5" /> : <ChevronUp className="h-3.5 w-3.5" />}
        </button>

        {!collapsed.semester && (
          <div className="mt-2.5 flex flex-col gap-1.5">
            {semesters.map((sem) => {
              const semVal = sem === 'All Semesters' ? '' : sem;
              const isSelected = filters.semester === semVal;
              return (
                <button
                  key={sem}
                  onClick={() => onChange({ ...filters, semester: semVal })}
                  className={cn(
                    'flex items-center justify-between rounded-md px-2.5 py-1.5 text-xs text-left transition',
                    isSelected
                      ? 'bg-primary/20 text-primary-soft font-semibold'
                      : 'text-muted hover:bg-surface-2 hover:text-text'
                  )}
                >
                  <span>{sem}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Filter sidebar: Width 280px, sticky top 88px, 24px padding, 16px radius (Blueprint 4.4 & 4.6) */}
      <aside
        className={cn(
          'hidden lg:block w-[280px] shrink-0 sticky top-[88px] rounded-lg border border-border bg-surface p-6 shadow-card h-fit max-h-[calc(100vh-112px)] overflow-y-auto',
          className
        )}
      >
        {content}
      </aside>

      {/* Mobile Bottom Sheet (Blueprint 4.6) */}
      {isOpenMobile && (
        <div className="fixed inset-0 z-modal lg:hidden flex flex-col justify-end">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onCloseMobile}
          />
          <div className="relative z-10 w-full max-h-[85vh] rounded-t-2xl border-t border-border bg-surface p-6 overflow-y-auto animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-border mb-4">
              <h3 className="font-heading text-lg font-semibold text-text">Resource Filters</h3>
              <button
                onClick={onCloseMobile}
                className="rounded-md p-1.5 text-muted hover:text-text hover:bg-surface-2"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {content}
            <div className="mt-6 pt-4 border-t border-border">
              <Button onClick={onCloseMobile} className="w-full">
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
