'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Report } from '@/types';
import { Button } from '@/components/ui/Button';
import { formatDate } from '@/lib/utils';
import { useToast } from '@/components/ui/Toast';
import { createClient } from '@/lib/supabase/client';
import { AlertTriangle, CheckCircle, Trash2, RefreshCw } from 'lucide-react';

export default function AdminReportsPage() {
  const { success, info, error } = useToast();
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    const fetchReports = async () => {
      setIsLoading(true);
      try {
        const { data, error: err } = await supabase
          .from('reports')
          .select('*, resource:resources(*), reporter:profiles(*)')
          .order('created_at', { ascending: false });

        if (!err && data) {
          setReports(data as Report[]);
        } else {
          setReports([]);
        }
      } catch {
        setReports([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchReports();
  }, [supabase]);

  const handleAction = async (id: string, action: 'resolve' | 'dismiss') => {
    try {
      await supabase
        .from('reports')
        .update({ status: action === 'resolve' ? 'resolved' : 'dismissed' })
        .eq('id', id);

      setReports((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, status: action === 'resolve' ? 'resolved' : 'dismissed' } : r
        )
      );

      if (action === 'resolve') {
        success('Report Resolved', 'Takedown routine completed.');
      } else {
        info('Report Dismissed', 'Flag cleared with no action required.');
      }
    } catch {
      error('Failed to update report status');
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

      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-12 text-muted">
          <RefreshCw className="h-6 w-6 animate-spin text-primary-soft mb-2" />
          <span>Loading copyright reports...</span>
        </div>
      ) : reports.length > 0 ? (
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
                    <span>Reported by: {rep.reporter?.name || 'Student'}</span>
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
        </div>
      ) : (
        <div className="rounded-lg border border-border bg-surface-2 p-12 text-center text-muted text-sm">
          <CheckCircle className="h-8 w-8 mx-auto text-success/60 mb-2" />
          <p className="font-medium text-text">No pending copyright reports</p>
          <p className="text-xs text-muted mt-1">
            Community takedown requests and quality flags will appear here.
          </p>
        </div>
      )}
    </div>
  );
}
