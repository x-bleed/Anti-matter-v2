'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { INITIAL_REPORTS } from '@/lib/data/mock-db';
import { Report } from '@/types';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/lib/utils';
import { useToast } from '@/components/ui/Toast';
import { AlertTriangle, CheckCircle, Trash2, ExternalLink } from 'lucide-react';

export default function AdminReportsPage() {
  const { success, info } = useToast();
  const [reports, setReports] = useState<Report[]>(INITIAL_REPORTS);

  const handleAction = (id: string, action: 'resolve' | 'dismiss') => {
    setReports((prev) =>
      prev.map((r) =>
        r.id === id ? { ...r, status: action === 'resolve' ? 'resolved' : 'dismissed' } : r
      )
    );
    if (action === 'resolve') {
      success('Report Resolved', 'Takedown routine completed. Content flagged or replaced.');
    } else {
      info('Report Dismissed', 'Flag cleared with no action required.');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="border-b border-border pb-4">
        <h2 className="font-heading text-xl font-bold text-text">Content &amp; Copyright Reports</h2>
        <p className="text-xs text-muted mt-0.5">
          Review community reports regarding faculty lecture notes, DMCA inquiries, or corrupt PDFs.
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {reports.map((rep) => (
          <div
            key={rep.id}
            className="flex flex-col sm:flex-row sm:items-start justify-between rounded-lg border border-border bg-surface-2 p-5 gap-4"
          >
            <div className="flex items-start gap-3.5">
              <div className="h-9 w-9 rounded-lg bg-danger/10 text-danger flex items-center justify-center shrink-0 mt-0.5">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-text text-sm">
                    {rep.resource?.title || 'Reported Academic Resource'}
                  </span>
                  <span
                    className={`text-[10px] font-mono uppercase px-2 py-0.5 rounded-full ${
                      rep.status === 'pending'
                        ? 'bg-warning/15 text-warning border border-warning/30'
                        : 'bg-success/15 text-success border border-success/30'
                    }`}
                  >
                    {rep.status}
                  </span>
                </div>
                <p className="text-xs text-text/90 mt-2 bg-surface p-3 rounded border border-border leading-relaxed">
                  &ldquo;{rep.reason}&rdquo;
                </p>
                <div className="flex items-center gap-3 text-[11px] text-muted mt-2 font-mono">
                  <span>Reported by: {rep.reporter?.name || 'Anonymous Student'}</span>
                  <span>•</span>
                  <span>{formatDate(rep.created_at)}</span>
                </div>
              </div>
            </div>

            {rep.status === 'pending' && (
              <div className="flex items-center gap-2 self-end sm:self-start shrink-0">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handleAction(rep.id, 'dismiss')}
                >
                  Dismiss
                </Button>
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleAction(rep.id, 'resolve')}
                >
                  Take Down / Resolve
                </Button>
              </div>
            )}
          </div>
        ))}

        {reports.length === 0 && (
          <div className="rounded-lg border border-border bg-surface p-12 text-center text-muted text-sm">
            No pending copyright reports.
          </div>
        )}
      </div>
    </div>
  );
}
