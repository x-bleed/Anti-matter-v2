'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Search, CornerDownLeft, Sparkles, BookOpen, X } from 'lucide-react';
import { COURSES } from '@/lib/constants';

export interface SearchBarProps {
  initialQuery?: string;
  onSearch?: (query: string) => void;
  autoFocus?: boolean;
  className?: string;
}

export function SearchBar({ initialQuery = '', onSearch, autoFocus, className }: SearchBarProps) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [isFocused, setIsFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<Array<{ code: string; title: string }>>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut listener ('/' to focus)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement !== inputRef.current) {
        // Prevent default if not typing in an input
        if (!['INPUT', 'TEXTAREA'].includes((document.activeElement as HTMLElement)?.tagName)) {
          e.preventDefault();
          inputRef.current?.focus();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Update suggestions on query change (Blueprint 3.5: course code suggestions)
  useEffect(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) {
      setSuggestions([]);
      return;
    }

    const matches = COURSES.filter(
      (c) =>
        c.code.toLowerCase().includes(trimmed) ||
        c.title.toLowerCase().includes(trimmed)
    ).slice(0, 5);

    setSuggestions(matches);
  }, [query]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const targetQuery = query.trim();
    if (onSearch) {
      onSearch(targetQuery);
    } else {
      router.push(`/library?q=${encodeURIComponent(targetQuery)}`);
    }
    setIsFocused(false);
  };

  const selectSuggestion = (courseCode: string) => {
    setQuery(courseCode);
    if (onSearch) {
      onSearch(courseCode);
    } else {
      router.push(`/library?q=${encodeURIComponent(courseCode)}`);
    }
    setIsFocused(false);
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-[640px] mx-auto">
      {/* Search Input Box: Height 56px, max 640px, 0 20px padding, 14px radius (Blueprint 4.4) */}
      <form onSubmit={handleSubmit} className="relative w-full">
        <div
          className={`flex h-14 w-full items-center rounded-[14px] border bg-surface-2 px-5 transition duration-200 ${
            isFocused
              ? 'border-primary ring-4 ring-primary/20 bg-surface'
              : 'border-border hover:border-primary-soft/50'
          }`}
        >
          {/* Search icon 20px at left */}
          <Search className="h-5 w-5 text-muted shrink-0 mr-3.5" />

          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            autoFocus={autoFocus}
            placeholder="Search course code (e.g. CSE 213, EEE 101), topics, or exam notes..."
            className="w-full bg-transparent text-sm md:text-base text-text placeholder:text-muted/60 focus:outline-none"
          />

          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery('');
                if (onSearch) onSearch('');
              }}
              className="mr-2 text-muted hover:text-text p-1 rounded transition"
            >
              <X className="h-4 w-4" />
            </button>
          )}

          {/* Keyboard hint at right on desktop (Blueprint 4.4) */}
          <div className="hidden sm:flex items-center gap-1 shrink-0">
            <kbd className="flex h-6 items-center justify-center rounded border border-border bg-surface px-1.5 font-mono text-[11px] text-muted shadow-sm">
              /
            </kbd>
          </div>
        </div>
      </form>

      {/* Dropdown of suggestions below, 8px gap (Blueprint 4.4) */}
      {isFocused && (suggestions.length > 0 || query.trim().length > 0) && (
        <div className="absolute top-[calc(100%+8px)] left-0 right-0 z-dropdown rounded-xl border border-border bg-surface p-2 shadow-card backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-150">
          {suggestions.length > 0 && (
            <div className="mb-2 px-2 pt-1 text-[11px] font-mono uppercase tracking-wider text-muted">
              Course Code Suggestions
            </div>
          )}
          {suggestions.map((course) => (
            <button
              key={course.code}
              onClick={() => selectSuggestion(course.code)}
              className="flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm text-text hover:bg-surface-2 hover:text-primary-soft transition"
            >
              <div className="flex items-center gap-2.5">
                <BookOpen className="h-4 w-4 text-primary-soft" />
                <span className="font-mono font-semibold">{course.code}</span>
                <span className="text-xs text-muted truncate max-w-[320px]">
                  {course.title}
                </span>
              </div>
              <span className="text-xs text-muted font-mono">Select</span>
            </button>
          ))}

          {query.trim().length > 0 && (
            <button
              onClick={() => handleSubmit()}
              className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-xs text-primary-soft hover:bg-primary/10 border-t border-border/50 mt-1"
            >
              <span className="flex items-center gap-1.5">
                <Search className="h-3.5 w-3.5" />
                Search all files matching &ldquo;<span className="font-semibold text-text">{query}</span>&rdquo;
              </span>
              <CornerDownLeft className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
