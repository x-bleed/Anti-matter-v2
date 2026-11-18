import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Resource } from '@/types';
import { FileText, ArrowUpRight, Sparkles } from 'lucide-react';

export interface NebulaMessage {
  id: string;
  sender: 'user' | 'nebula';
  text: string;
  timestamp: string;
  suggestedCourses?: string[];
  matchedResources?: Resource[];
}

export function MessageBubble({ message }: { message: NebulaMessage }) {
  const isUser = message.sender === 'user';

  return (
    <div className={cn('flex flex-col', isUser ? 'items-end' : 'items-start')}>
      {/* Sender indicator */}
      {!isUser && (
        <div className="flex items-center gap-1.5 mb-1.5 pl-1 text-[11px] font-mono uppercase tracking-wider text-primary-soft">
          <Sparkles className="h-3 w-3" />
          <span>NEBULA Search</span>
        </div>
      )}

      {/* Bubble: Message bubble padding 12 16px, radius 16px (Blueprint 4.4) */}
      <div
        className={cn(
          'max-w-[85%] rounded-lg px-4 py-3 text-sm leading-relaxed',
          isUser
            ? 'bg-primary text-white rounded-br-none'
            : 'bg-surface-2 border border-border text-text rounded-bl-none shadow-sm'
        )}
      >
        {/* Render text safely as plain text (Blueprint 5.3 Item 14) */}
        <p className="whitespace-pre-wrap">{message.text}</p>

        {/* Suggested course quick-chips */}
        {message.suggestedCourses && message.suggestedCourses.length > 0 && (
          <div className="mt-3 pt-2.5 border-t border-border/50">
            <span className="text-[11px] text-muted block mb-1.5 font-medium">
              Suggested Courses:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {message.suggestedCourses.map((code) => (
                <Link
                  key={code}
                  href={`/library?course=${encodeURIComponent(code)}`}
                  className="rounded-full bg-primary/20 hover:bg-primary/30 text-primary-soft border border-primary/30 px-2.5 py-0.5 text-xs font-mono font-medium transition"
                >
                  {code}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Matched top 3 resources (Blueprint 3.5: returns top three matching PDFs) */}
        {message.matchedResources && message.matchedResources.length > 0 && (
          <div className="mt-3 pt-2.5 border-t border-border/50 flex flex-col gap-2">
            <span className="text-[11px] text-muted block font-medium">
              Top Ranked PDF Matches:
            </span>
            {message.matchedResources.slice(0, 3).map((res) => (
              <Link
                key={res.id}
                href={`/resource/${res.id}`}
                className="group/item flex items-center justify-between rounded-md bg-surface border border-border/70 p-2 text-xs hover:border-primary transition"
              >
                <div className="flex items-center gap-2 min-w-0 pr-2">
                  <FileText className="h-4 w-4 text-primary-soft shrink-0" />
                  <div className="min-w-0">
                    <p className="font-medium text-text truncate group-hover/item:text-primary-soft">
                      {res.title}
                    </p>
                    <p className="text-[10px] font-mono text-muted">
                      {res.course?.code} • {res.file_size}
                    </p>
                  </div>
                </div>
                <ArrowUpRight className="h-3.5 w-3.5 text-muted group-hover/item:text-primary-soft shrink-0" />
              </Link>
            ))}
          </div>
        )}
      </div>

      <span className="text-[10px] text-muted/60 mt-1 px-1 font-mono">
        {message.timestamp}
      </span>
    </div>
  );
}
