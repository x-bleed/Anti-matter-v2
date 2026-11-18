'use client';

import React, { useState } from 'react';
import { INITIAL_CGPA_SUBMISSIONS, INITIAL_PROFILES } from '@/lib/data/mock-db';
import { CGPASubmission } from '@/types';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { formatDate } from '@/lib/utils';
import { useToast } from '@/components/ui/Toast';
import { CheckCircle2, XCircle, Eye, ShieldCheck, FileCheck, Trash2 } from 'lucide-react';

export default function AdminVerificationsPage() {
  const { success, error } = useToast();
  const [submissions, setSubmissions] = useState<CGPASubmission[]>(INITIAL_CGPA_SUBMISSIONS);
  const [selectedProof, setSelectedProof] = useState<CGPASubmission | null>(null);

  const handleVerify = (id: string, approve: boolean) => {
    setSubmissions((prev) =>
      prev.map((s) =>
        s.id === id
          ? {
              ...s,
              status: approve ? 'verified' : 'rejected',
              verified_at: new Date().toISOString(),
              verified_by: '00000000-0000-0000-0000-000000000001',
            }
          : s
      )
    );

    if (approve) {
      success('CGPA Verified', 'Verified badge granted. Ranked on public leaderboard.');
    } else {
      error('Submission Rejected', 'Student notified of rejection.');
    }
    setSelectedProof(null);
  };

  const handleDeleteScreenshot = (id: string) => {
    // Blueprint 5.5: Delete the screenshot right after verification. Keep only the verified flag and the number.
    setSubmissions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, proof_path: '[Deleted after verification for privacy]' } : s))
    );
    success('Privacy Cleanup Complete', 'Screenshot file permanently removed from cgpa-proofs bucket.');
    setSelectedProof(null);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="border-b border-border pb-4">
        <h2 className="font-heading text-xl font-bold text-text">CGPA Submission Reviews</h2>
        <p className="text-xs text-muted mt-0.5">
          Inspect student semester grade sheets, verify CGPA claims, and delete sensitive screenshots after verification.
        </p>
      </div>

      {/* Submissions List */}
      <div className="flex flex-col gap-3">
        {submissions.map((sub) => (
          <div
            key={sub.id}
            className="flex flex-col sm:flex-row sm:items-center justify-between rounded-lg border border-border bg-surface-2 p-4 gap-4"
          >
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-primary/20 text-primary-soft flex items-center justify-center font-bold font-mono text-sm">
                {sub.profile?.name.charAt(0) || 'S'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-text text-sm">
                    {sub.profile?.name}
                  </span>
                  <span className="font-mono text-xs text-primary-soft bg-surface px-2 py-0.5 rounded border border-border">
                    {sub.profile?.alias || 'No alias'}
                  </span>
                </div>
                <p className="text-xs text-muted mt-0.5 font-mono">
                  Submitted CGPA:{' '}
                  <span className="font-bold text-text">{sub.cgpa.toFixed(2)}</span> •{' '}
                  {sub.credits_completed} credits • {formatDate(sub.created_at)}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider ${
                  sub.status === 'verified'
                    ? 'bg-success/15 text-success border border-success/30'
                    : sub.status === 'rejected'
                    ? 'bg-danger/15 text-danger border border-danger/30'
                    : 'bg-warning/15 text-warning border border-warning/30'
                }`}
              >
                {sub.status}
              </span>

              <Button
                size="sm"
                variant="secondary"
                onClick={() => setSelectedProof(sub)}
                className="gap-1.5"
              >
                <Eye className="h-3.5 w-3.5" />
                <span>Inspect Proof</span>
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Proof Inspection Modal */}
      {selectedProof && (
        <Modal
          isOpen={Boolean(selectedProof)}
          onClose={() => setSelectedProof(null)}
          title="Verify Academic Grade Report"
          description={`Submitted by ${selectedProof.profile?.name} (${selectedProof.profile?.email})`}
          footer={
            <div className="flex items-center justify-between w-full">
              <button
                onClick={() => handleDeleteScreenshot(selectedProof.id)}
                className="text-xs text-danger hover:underline inline-flex items-center gap-1"
                title="Privacy requirement (Blueprint 5.5)"
              >
                <Trash2 className="h-3.5 w-3.5" /> Delete Proof Screenshot
              </button>
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => handleVerify(selectedProof.id, false)}
                >
                  Reject
                </Button>
                <Button
                  size="sm"
                  variant="primary"
                  onClick={() => handleVerify(selectedProof.id, true)}
                >
                  Approve &amp; Verify
                </Button>
              </div>
            </div>
          }
        >
          <div className="flex flex-col gap-4">
            <div className="grid grid-cols-2 gap-3 text-xs bg-surface-2 p-3 rounded-lg border border-border font-mono">
              <div>
                <span className="text-muted block">Claimed CGPA:</span>
                <span className="font-bold text-text text-sm">
                  {selectedProof.cgpa.toFixed(2)}
                </span>
              </div>
              <div>
                <span className="text-muted block">Completed Credits:</span>
                <span className="font-bold text-text text-sm">
                  {selectedProof.credits_completed}
                </span>
              </div>
            </div>

            {/* Simulated Screenshot Proof Display */}
            <div className="rounded-lg border border-border bg-[#0B0820] p-4 text-center">
              <span className="text-xs font-mono text-muted uppercase tracking-wider block mb-2">
                IUB Grade Sheet Preview (cgpa-proofs)
              </span>
              <div className="h-48 rounded bg-surface-2 border border-border flex flex-col items-center justify-center p-4">
                <FileCheck className="h-12 w-12 text-primary-soft mb-2" />
                <p className="text-xs font-mono text-text">Official IUB Transcript Record</p>
                <p className="text-[11px] text-muted font-mono mt-1">
                  Path: {selectedProof.proof_path}
                </p>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
