'use client';

import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { NebulaMessage, MessageBubble } from './MessageBubble';
import { X, Send, Sparkles, BookOpen, AlertCircle, RefreshCw } from 'lucide-react';
import { COURSES } from '@/lib/constants';
import { INITIAL_RESOURCES } from '@/lib/data/mock-db';
import { Resource } from '@/types';

export interface NebulaPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NebulaPanel({ isOpen, onClose }: NebulaPanelProps) {
  const [messages, setMessages] = useState<NebulaMessage[]>([
    {
      id: 'init-1',
      sender: 'nebula',
      text: 'Hello! I am NEBULA v1, your academic resource assistant. Ask me for course past papers, lecture slides, or exam notes (e.g. "Find CSE 213 midterm past papers" or "Algorithms notes").',
      timestamp: 'Just now',
      suggestedCourses: ['CSE 213', 'CSE 215', 'CSE 303', 'EEE 101'],
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [rateLimitError, setRateLimitError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const handleSend = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = inputText.trim();
    if (!query || isSearching) return;

    setRateLimitError(null);

    const userMsg: NebulaMessage = {
      id: `usr-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric' }).format(new Date()),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsSearching(true);

    try {
      // Query search endpoint with rate limiting
      const res = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=3`);
      
      if (res.status === 429) {
        setRateLimitError('Rate limit exceeded (10 calls/min). Please slow down.');
        setMessages((prev) => [
          ...prev,
          {
            id: `neb-${Date.now()}`,
            sender: 'nebula',
            text: 'Rate limit exceeded (10 calls/min). Please pause for a moment.',
            timestamp: new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric' }).format(new Date()),
          },
        ]);
        setIsSearching(false);
        return;
      }

      let matchedResources: Resource[] = [];
      let detectedCourses: string[] = [];

      if (res.ok) {
        const data = await res.json();
        matchedResources = data.resources || [];
      } else {
        // Fallback local ranking
        const queryLower = query.toLowerCase();
        matchedResources = INITIAL_RESOURCES.filter(
          (r) =>
            r.title.toLowerCase().includes(queryLower) ||
            r.course?.code.toLowerCase().includes(queryLower) ||
            r.type.toLowerCase().includes(queryLower)
        ).slice(0, 3);
      }

      // Detect relevant course codes
      const queryLower = query.toLowerCase();
      detectedCourses = COURSES.filter(
        (c) => queryLower.includes(c.code.toLowerCase()) || c.title.toLowerCase().includes(queryLower)
      ).map((c) => c.code);

      if (detectedCourses.length === 0 && matchedResources.length > 0) {
        detectedCourses = Array.from(new Set(matchedResources.map((r) => r.course?.code || ''))).filter(Boolean);
      }

      let replyText = '';
      if (matchedResources.length > 0) {
        replyText = `Found ${matchedResources.length} relevant academic resource${
          matchedResources.length > 1 ? 's' : ''
        } for "${query}". Here are the top matches:`;
      } else {
        replyText = `I couldn't find exact matches for "${query}". Try searching for specific course codes like CSE 213, CSE 115, or keywords like "midterm", "notes", or "slides".`;
        detectedCourses = ['CSE 213', 'CSE 215', 'CSE 303'];
      }

      const nebulaMsg: NebulaMessage = {
        id: `neb-${Date.now()}`,
        sender: 'nebula',
        text: replyText,
        timestamp: new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: 'numeric' }).format(new Date()),
        suggestedCourses: detectedCourses.length > 0 ? detectedCourses : undefined,
        matchedResources: matchedResources.length > 0 ? matchedResources : undefined,
      };

      setMessages((prev) => [...prev, nebulaMsg]);
    } catch {
      // Local fallback on network failure
      const queryLower = query.toLowerCase();
      const localMatches = INITIAL_RESOURCES.filter(
        (r) =>
          r.title.toLowerCase().includes(queryLower) ||
          r.course?.code.toLowerCase().includes(queryLower)
      ).slice(0, 3);

      setMessages((prev) => [
        ...prev,
        {
          id: `neb-${Date.now()}`,
          sender: 'nebula',
          text: `Found ${localMatches.length} matching resources:`,
          timestamp: 'Just now',
          matchedResources: localMatches,
        },
      ]);
    } finally {
      setIsSearching(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-drawer flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer: Width 400px, full height, right side drawer. Header 56px, left edge radius 20px. Mobile: full screen sheet (Blueprint 4.4 & 4.6) */}
      <div className="relative z-10 flex h-full w-full sm:w-[400px] flex-col rounded-l-xl border-l border-border bg-surface shadow-card animate-in slide-in-from-right duration-250">
        {/* Header: 56px height (Blueprint 4.4) */}
        <div className="flex h-14 shrink-0 items-center justify-between border-b border-border px-5 bg-surface/90">
          <div className="flex items-center gap-2.5">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary shadow-[0_0_10px_rgba(124,58,237,0.5)]">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div>
              <h3 className="font-heading text-sm font-bold text-text">NEBULA Smart Search</h3>
              <span className="text-[10px] font-mono text-primary-soft uppercase tracking-wider block -mt-0.5">
                Version 1.0 • Ranked Search
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-md p-1.5 text-muted hover:text-text hover:bg-surface-2 transition"
            aria-label="Close NEBULA panel"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Messages List: 8px gap between messages (Blueprint 4.4) */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
          {messages.map((msg) => (
            <MessageBubble key={msg.id} message={msg} />
          ))}
          {isSearching && (
            <div className="flex items-center gap-2 text-xs text-muted pl-1 py-2">
              <RefreshCw className="h-3.5 w-3.5 animate-spin text-primary-soft" />
              <span>Querying academic index...</span>
            </div>
          )}
          {rateLimitError && (
            <div className="rounded-md border border-danger/30 bg-danger/10 p-2.5 text-xs text-danger flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{rateLimitError}</span>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area: 72px tall (Blueprint 4.4) */}
        <div className="h-[72px] shrink-0 border-t border-border px-4 flex items-center bg-surface-2/60">
          <form onSubmit={handleSend} className="relative flex w-full items-center">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask for notes, past papers, courses..."
              disabled={isSearching}
              className="h-11 w-full rounded-md border border-border bg-surface px-4 pr-12 text-sm text-text placeholder:text-muted/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <button
              type="submit"
              disabled={!inputText.trim() || isSearching}
              className="absolute right-2 flex h-8 w-8 items-center justify-center rounded-md bg-primary text-white hover:bg-primary-hover disabled:opacity-40 transition"
              aria-label="Send query"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
