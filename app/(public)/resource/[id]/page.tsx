'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { INITIAL_RESOURCES, SAMPLE_PDF_BLOB } from '@/lib/data/mock-db';
import { Resource } from '@/types';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { formatDate } from '@/lib/utils';
import { useToast } from '@/components/ui/Toast';
import {
  Download,
  AlertTriangle,
  ArrowLeft,
  Calendar,
  Layers,
  User,
  BookOpen,
  Clock,
  Shield,
  FileText,
  Share2,
} from 'lucide-react';

export default function ResourceViewPage() {
  const params = useParams();
  const router = useRouter();
  const { success, error } = useToast();

  const [resource, setResource] = useState<Resource | null>(null);
  const [signedUrl, setSignedUrl] = useState<string>(SAMPLE_PDF_BLOB);
  const [expiresIn, setExpiresIn] = useState<number>(15 * 60); // 15 minutes in seconds (Blueprint 1 & 3.5)
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [isSubmittingReport, setIsSubmittingReport] = useState(false);

  useEffect(() => {
    const id = params?.id as string;
    const found = INITIAL_RESOURCES.find((r) => r.id === id) || INITIAL_RESOURCES[0];
    setResource(found);

    // 15-minute expiration countdown timer (Blueprint 1 & 3.5)
    const interval = setInterval(() => {
      setExpiresIn((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [params]);

  const formatTimer = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleDownload = () => {
    if (!resource) return;
    success('Generating signed download token...', 'Token verified for 15-minute session.');
    const a = document.createElement('a');
    a.href = signedUrl;
    a.download = `${resource.title.replace(/\s+/g, '_')}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      success('Link copied to clipboard!');
    }
  };

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (reportReason.trim().length < 10) {
      error('Report reason must be at least 10 characters.');
      return;
    }

    setIsSubmittingReport(true);
    try {
      const res = await fetch('/api/reports', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          resourceId: resource?.id,
          reason: reportReason,
        }),
      });

      if (res.ok) {
        success('Report submitted', 'Our academic moderation team will review this file.');
        setIsReportModalOpen(false);
        setReportReason('');
      } else {
        const data = await res.json();
        error(data.error || 'Failed to submit report');
      }
    } catch {
      error('Failed to submit report');
    } finally {
      setIsSubmittingReport(false);
    }
  };

  if (!resource) {
    return <div className="p-12 text-center text-muted">Loading resource viewer...</div>;
  }

  return (
    <div className="mx-auto max-w-[1264px] px-6 py-6 pb-24 md:pb-8">
      {/* Top back navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => router.back()}
          className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-primary-soft font-mono transition"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Back</span>
        </button>

        <div className="flex items-center gap-2">
          {/* 15-minute signed token indicator (Blueprint 1 & 3.5) */}
          <div className="flex items-center gap-1.5 rounded-full bg-surface-2 border border-border px-3 py-1 font-mono text-xs text-muted">
            <Clock className="h-3.5 w-3.5 text-primary-soft" />
            <span>Signed URL expires in:</span>
            <span className="font-semibold text-text">{formatTimer(expiresIn)}</span>
          </div>

          <button
            onClick={handleShare}
            className="flex h-8 items-center gap-1.5 rounded-md border border-border bg-surface px-2.5 text-xs text-muted hover:text-text hover:bg-surface-2 transition"
          >
            <Share2 className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Share</span>
          </button>
        </div>
      </div>

      {/* Main Layout: 848 px viewer beside 320 px panel (Blueprint 4.3 & 4.5) */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* Left: PDF viewer, width 848 px, min height 70 vh, on a white page surface inside a dark frame with 16 px padding (Blueprint 4.5) */}
        <div className="w-full lg:w-[848px] shrink-0">
          <div className="rounded-xl border border-border bg-[#0E0B1F] p-4 shadow-card">
            {/* Viewer toolbar header */}
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-border/60 text-xs text-muted">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-primary-soft" />
                <span className="font-mono text-text truncate max-w-[320px]">
                  {resource.title}.pdf
                </span>
              </div>
              <span className="font-mono text-[11px] bg-surface-2 px-2 py-0.5 rounded text-muted">
                Standard PDF Viewport (100%)
              </span>
            </div>

            {/* White page surface inside dark frame (Blueprint 4.5) */}
            <div className="min-h-[70vh] w-full rounded-lg bg-white overflow-hidden shadow-inner flex flex-col items-center justify-between p-8 text-neutral-900 border border-neutral-200">
              {/* Document Header representation */}
              <div className="w-full border-b border-neutral-300 pb-6 flex items-start justify-between">
                <div>
                  <span className="text-xs uppercase font-mono tracking-widest text-neutral-500 block">
                    Independent University, Bangladesh
                  </span>
                  <h2 className="text-xl sm:text-2xl font-bold font-serif text-neutral-900 mt-1">
                    {resource.title}
                  </h2>
                  <p className="text-xs font-mono text-neutral-600 mt-1">
                    Course: {resource.course?.code} — {resource.course?.title}
                  </p>
                </div>
                <div className="text-right">
                  <span className="inline-block rounded border border-neutral-400 bg-neutral-100 px-2 py-1 text-[11px] font-mono uppercase">
                    {resource.type.replace('_', ' ')}
                  </span>
                  <p className="text-[10px] text-neutral-500 font-mono mt-1">
                    Page 1 of {resource.page_count || 12}
                  </p>
                </div>
              </div>

              {/* Sample PDF page body content */}
              <div className="w-full py-12 flex flex-col gap-6 font-serif text-neutral-800 leading-relaxed text-sm sm:text-base">
                <p>
                  <strong>Abstract &amp; Summary:</strong> This academic document contains official coursework notes, midterm exam formulations, or presentation slides preserved for student revision and exam preparation at IUB.
                </p>
                <div className="rounded border border-neutral-300 bg-neutral-50 p-4 font-mono text-xs text-neutral-700 leading-normal">
                  <p className="font-bold mb-1">Key Curriculum Highlights:</p>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>Core problem solving methodologies and algorithmic verification</li>
                    <li>Step-by-step solutions for semester past examination papers</li>
                    <li>Theoretical concepts, design diagrams and syntax breakdowns</li>
                  </ul>
                </div>
                <p className="text-xs text-neutral-500 italic">
                  [In-browser PDF stream preview rendered with security tokens. Click &ldquo;Download PDF&rdquo; on the right to save the full high-resolution original file.]
                </p>
              </div>

              {/* Document Footer */}
              <div className="w-full border-t border-neutral-200 pt-4 flex items-center justify-between text-[11px] font-mono text-neutral-500">
                <span>ANTI-MATTER v2 Protected Stream</span>
                <span>UUID: {resource.id.slice(0, 18)}...</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: info panel 320 px wide, sticky. Title, course, type, uploader, date, Download button (large), Report link (small, muted) (Blueprint 4.5) */}
        <div className="w-full lg:w-[320px] shrink-0 sticky top-24">
          <div className="rounded-xl border border-border bg-surface p-6 shadow-card flex flex-col gap-5">
            <div>
              <Badge variant={resource.type} className="mb-2.5">
                {resource.type.replace('_', ' ')}
              </Badge>
              <h2 className="font-heading text-xl font-bold text-text leading-snug">
                {resource.title}
              </h2>
            </div>

            {/* Metadata list */}
            <div className="flex flex-col gap-3 py-3 border-y border-border text-xs text-muted">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <BookOpen className="h-3.5 w-3.5 text-primary-soft" />
                  Course:
                </span>
                <span className="font-mono font-semibold text-text">
                  {resource.course?.code}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Layers className="h-3.5 w-3.5 text-primary-soft" />
                  Pages:
                </span>
                <span className="font-mono text-text">{resource.page_count || 12}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5 text-primary-soft" />
                  File Size:
                </span>
                <span className="font-mono text-text">{resource.file_size || '2.4 MB'}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5 text-primary-soft" />
                  Uploader:
                </span>
                <span className="font-medium text-text">Admin (Verified)</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-primary-soft" />
                  Date Added:
                </span>
                <span className="text-text">{formatDate(resource.created_at)}</span>
              </div>
            </div>

            {/* Download button: Large (Blueprint 4.5: 52 px height) */}
            <Button
              size="lg"
              variant="primary"
              onClick={handleDownload}
              className="w-full gap-2 shadow-[0_0_16px_rgba(124,58,237,0.4)]"
            >
              <Download className="h-5 w-5" />
              <span>Download PDF</span>
            </Button>

            {/* Small muted report link (Blueprint 4.5) */}
            <div className="text-center pt-1">
              <button
                onClick={() => setIsReportModalOpen(true)}
                className="text-xs text-muted hover:text-danger hover:underline transition inline-flex items-center gap-1"
              >
                <AlertTriangle className="h-3.5 w-3.5" />
                <span>Report copyright issue or error</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sticky Bottom Bar with Download (Blueprint 4.5 & 4.6) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 p-4 border-t border-border bg-surface/95 backdrop-blur-md md:hidden">
        <Button size="md" variant="primary" onClick={handleDownload} className="w-full gap-2">
          <Download className="h-4 w-4" />
          <span>Download PDF ({resource.file_size || '2.4 MB'})</span>
        </Button>
      </div>

      {/* Report Takedown Modal Dialog (Blueprint 3.6 & 5.5) */}
      <Modal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
        title="Report Resource"
        description="Submit a copyright takedown request or report incorrect content."
        footer={
          <>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsReportModalOpen(false)}
              disabled={isSubmittingReport}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleReportSubmit}
              isLoading={isSubmittingReport}
            >
              Submit Report
            </Button>
          </>
        }
      >
        <form onSubmit={handleReportSubmit} className="flex flex-col gap-4">
          <div>
            <label className="text-xs font-semibold text-text uppercase tracking-wider block mb-1">
              Resource Title
            </label>
            <p className="text-xs font-mono text-muted bg-surface-2 p-2 rounded border border-border">
              {resource.title}
            </p>
          </div>

          <div>
            <label htmlFor="reason" className="text-xs font-semibold text-text uppercase tracking-wider block mb-1">
              Reason for Report / Copyright claim *
            </label>
            <textarea
              id="reason"
              rows={4}
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
              placeholder="Please explain the copyright concern, faculty ownership, or inaccuracy in detail (minimum 10 characters)..."
              className="w-full rounded-md border border-border bg-surface-2 p-3 text-xs text-text placeholder:text-muted/60 focus:border-primary focus:outline-none"
              required
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}
