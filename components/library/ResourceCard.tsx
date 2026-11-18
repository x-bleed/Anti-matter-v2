import React from 'react';
import Link from 'next/link';
import { Resource } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { formatDate } from '@/lib/utils';
import { FileText, Download, Calendar, Layers } from 'lucide-react';

export interface ResourceCardProps {
  resource: Resource;
}

export function ResourceCard({ resource }: ResourceCardProps) {
  const typeLabels: Record<Resource['type'], string> = {
    notes: 'Notes',
    past_paper: 'Past Paper',
    slides: 'Lecture Slides',
    other: 'Reference',
  };

  return (
    // Resource card: Min 280px wide, 20px padding, 16px radius (rounded-lg), surface, 1px border (Blueprint 4.4 & 6)
    // Hover: lift 2px, border turns primary, shadow-card
    <article className="group relative flex flex-col justify-between min-w-[280px] rounded-lg border border-border bg-surface p-5 shadow-card transition-all duration-250 hover:-translate-y-0.5 hover:border-primary">
      <div>
        {/* Top row: Type badge & downloads */}
        <div className="flex items-center justify-between">
          <Badge variant={resource.type}>
            {typeLabels[resource.type] || resource.type}
          </Badge>
          {resource.course?.semester && (
            <span className="text-xs font-mono text-muted/80">
              {resource.course.semester}
            </span>
          )}
        </div>

        {/* Title: h4, 2 lines max (Blueprint 4.4 & 6) */}
        <Link href={`/resource/${resource.id}`} className="block focus:outline-none">
          <h4 className="mt-3 line-clamp-2 font-heading text-lg font-semibold text-text group-hover:text-primary-soft transition-colors">
            {resource.title}
          </h4>
        </Link>

        {/* Course code in mono (Blueprint 4.4 & 6) */}
        <p className="mt-1.5 font-mono text-sm text-primary-soft">
          {resource.course?.code || 'GEN-101'}
          {resource.course?.title && (
            <span className="ml-2 font-sans text-xs text-muted font-normal truncate">
              • {resource.course.title}
            </span>
          )}
        </p>
      </div>

      {/* Meta row: pages, size, date (Blueprint 4.4 & 6) */}
      <div className="mt-5 pt-3 border-t border-border/60 flex items-center justify-between text-xs text-muted">
        <div className="flex items-center gap-3">
          {resource.page_count && (
            <span className="flex items-center gap-1">
              <Layers className="h-3.5 w-3.5 text-muted/70" />
              {resource.page_count}p
            </span>
          )}
          {resource.file_size && (
            <span className="flex items-center gap-1 font-mono">
              {resource.file_size}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5 text-muted/70" />
            {formatDate(resource.created_at)}
          </span>
        </div>

        <Link
          href={`/resource/${resource.id}`}
          className="flex h-7 w-7 items-center justify-center rounded-md bg-surface-2 text-muted hover:text-text hover:bg-primary/20 hover:text-primary-soft transition"
          title="View & Download PDF"
          aria-label="View and Download Resource"
        >
          <Download className="h-3.5 w-3.5" />
        </Link>
      </div>
    </article>
  );
}
