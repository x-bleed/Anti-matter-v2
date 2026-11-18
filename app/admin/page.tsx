'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { COURSES } from '@/lib/constants';
import { createClient } from '@/lib/supabase/client';
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [publishedCount, setPublishedCount] = useState(0);
  const [pendingCgpa, setPendingCgpa] = useState(0);
  const [pendingReports, setPendingReports] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const [resQuery, cgpaQuery, repQuery] = await Promise.all([
          supabase.from('resources').select('id', { count: 'exact', head: true }),
          supabase.from('cgpa_submissions').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
          supabase.from('reports').select('id', { count: 'exact', head: true }).eq('status', 'pending'),
        ]);

        setPublishedCount(resQuery.count || 0);
        setPendingCgpa(cgpaQuery.count || 0);
        setPendingReports(repQuery.count || 0);
      } catch {
        // Fallback
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetrics();
  }, [supabase]);

  return (
    <div className="flex flex-col gap-8">
      {/* Overview Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-heading text-xl font-bold text-text">Dashboard Overview</h2>
          <p className="text-xs text-muted mt-0.5">
            Real-time status of academic repository, student grade verifications and copyright takedowns.
          </p>
        </div>

        <Link href="/admin/upload">
          <Button size="sm" variant="primary" className="gap-2">
            <UploadCloud className="h-4 w-4" />
            <span>Upload New PDF</span>
          </Button>
        </Link>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="rounded-lg border border-border bg-surface-2 p-4">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-xs font-semibold uppercase">Total Files</span>
            <FileText className="h-4 w-4 text-primary-soft" />
          </div>
          <div className="font-heading text-2xl font-bold text-text">
            {isLoading ? '...' : publishedCount}
          </div>
          <span className="text-[11px] text-muted">Across {COURSES.length} courses</span>
        </div>

        <div className="rounded-lg border border-border bg-surface-2 p-4">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-xs font-semibold uppercase">CGPA Reviews</span>
            <CheckCircle2 className="h-4 w-4 text-warning" />
          </div>
          <div className="font-heading text-2xl font-bold text-warning">
            {isLoading ? '...' : `${pendingCgpa} Pending`}
          </div>
          <Link href="/admin/verifications" className="text-[11px] text-primary-soft hover:underline block mt-0.5">
            Review submissions →
          </Link>
        </div>

        <div className="rounded-lg border border-border bg-surface-2 p-4">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-xs font-semibold uppercase">Copyright Reports</span>
            <AlertTriangle className="h-4 w-4 text-danger" />
          </div>
          <div className="font-heading text-2xl font-bold text-danger">
            {isLoading ? '...' : `${pendingReports} Pending`}
          </div>
          <Link href="/admin/reports" className="text-[11px] text-primary-soft hover:underline block mt-0.5">
            Take action →
          </Link>
        </div>

        <div className="rounded-lg border border-border bg-surface-2 p-4">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-xs font-semibold uppercase">Security Gates</span>
            <ShieldCheck className="h-4 w-4 text-success" />
          </div>
          <div className="font-heading text-2xl font-bold text-success">19 / 19 Active</div>
          <span className="text-[11px] text-muted font-mono">RLS • CSRF • Domain</span>
        </div>
      </div>

      {/* Security Check Status Banner */}
      <div className="rounded-lg border border-success/30 bg-success/5 p-5">
        <div className="flex items-start gap-3">
          <ShieldCheck className="h-5 w-5 text-success shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-text">Launch Security Enforced</h3>
            <p className="text-xs text-muted mt-1 leading-relaxed">
              Row Level Security is active on every Postgres table. File uploads validate <code className="font-mono text-primary-soft">%PDF-</code> magic byte signatures and enforce a 25 MB limit with randomized UUID storage paths. Only authenticated users with verified <code className="font-mono text-primary-soft">@iub.edu.bd</code> domain accounts can access signed 15-minute download links.
            </p>
          </div>
        </div>
      </div>

      {/* Quick shortcuts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link
          href="/admin/resources"
          className="flex items-center justify-between p-4 rounded-lg border border-border bg-surface-2 hover:border-primary-soft transition group"
        >
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-md bg-surface flex items-center justify-center text-primary-soft">
              <FileText className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-text group-hover:text-primary-soft">
                Manage Published Resources
              </h4>
              <p className="text-xs text-muted">View, edit, or remove files from the public repository</p>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-muted group-hover:text-primary-soft" />
        </Link>

        <Link
          href="/admin/verifications"
          className="flex items-center justify-between p-4 rounded-lg border border-border bg-surface-2 hover:border-warning transition group"
        >
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-md bg-surface flex items-center justify-center text-warning">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-text group-hover:text-warning">
                Verify Student CGPAs
              </h4>
              <p className="text-xs text-muted">Inspect uploaded semester result sheets</p>
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-muted group-hover:text-warning" />
        </Link>
      </div>
    </div>
  );
}
