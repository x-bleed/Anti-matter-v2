'use client';

import React, { useState, useEffect } from 'react';
import { CGPASubmission } from '@/types';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { formatDate } from '@/lib/utils';
import { useToast } from '@/components/ui/Toast';
import { createClient } from '@/lib/supabase/client';
import { CheckCircle2, XCircle, Eye, ShieldCheck, FileCheck, Trash2, RefreshCw } from 'lucide-react';

export default function AdminVerificationsPage() {
  const { success, error } = useToast();
  const [submissions, setSubmissions] = useState<CGPASubmission[]>([]);
  const [selectedProof, setSelectedProof] = useState<CGPASubmission | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    const fetchSubmissions = async () => {
      setIsLoading(true);
      try {
        const { data, error: err } = await supabase
          .from('cgpa_submissions')
          .select('*, profile:profiles(*)')
          .order('created_at', { ascending: false });

        if (!err && data) {
          setSubmissions(data as CGPASubmission[]);
        } else {
          setSubmissions([]);
        }
      } catch {
        setSubmissions([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSubmissions();
  }, [supabase]);

  const handleVerify = async (id: string, approve: boolean) => {
    try {
      await supabase
        .from('cgpa_submissions')
        .update({
          status: approve ? 'verified' : 'rejected',
          verified_at: new Date().toISOString(),
        })
        .eq('id', id);

      setSubmissions((prev) =>
        prev.map((s) =>
          s.id === id ? { ...s, status: approve ? 'verified' : 'rejected' } : s
        )
      );

      if (approve) {
        success('CGPA Verified', 'Verified badge granted. Ranked on university leaderboard.');
      } else {
        error('Submission Rejected', 'Student notified of rejection.');
      }
    } catch {
      error('Failed to update verification status');
    }
    setSelectedProof(null);
  };

  const handleDeleteScreenshot = async (id: string, proofPath?: string) => {
    // Blueprint 5.5: Delete screenshot right after verification for privacy
    try {
      if (proofPath && proofPath.includes('/')) {
        await supabase.storage.from('cgpa-proofs').remove([proofPath]);
      }
      await supabase
        .from('cgpa_submissions')
        .update({ proof_path: '[Deleted for student privacy]' })
        .eq('id', id);

      setSubmissions((prev) =>
        prev.map((s) =>
          s.id === id ? { ...s, proof_path: '[Deleted for student privacy]' } : s
        )
      );
      success('Privacy Cleanup Complete', 'Screenshot file permanently removed from cgpa-proofs bucket.');
    } catch {
      error('Failed to remove screenshot file');
    }
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

      {isLoading ? (
        <div className="flex flex-col items-center justify-center p-12 text-muted">
          <RefreshCw className="h-6 w-6 animate-spin text-primary-soft mb-2" />
          <span>Loading student submissions...</span>
        </div>
      ) : submissions.length > 0 ? (
        <div className="flex flex-col gap-3">
          {submissions.map((sub) => (
            <div
              key={sub.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between rounded-lg border border-border bg-surface-2 p-4 gap-4"
            >
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-primary/20 text-primary-soft flex items-center justify-center font-bold font-mono text-sm">
                  {sub.profile?.name ? sub.profile.name.charAt(0).toUpperCase() : 'S'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-text text-sm">
                      {sub.profile?.name || 'Student'}
                    </span>
                    <span className="font-mono text-xs text-primary-soft bg-surface px-2 py-0.5 rounded border border-border">
                      {sub.profile?.alias || 'No alias'}
                    </span>
                  </div>
                  <p className="text-xs text-muted mt-0.5 font-mono">
                    Submitted CGPA:{' '}
                    <span className="font-bold text-text">{Number(sub.cgpa).toFixed(2)}</span> •{' '}
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
      ) : (
        <div className="rounded-lg border border-border bg-surface-2 p-12 text-center text-muted text-sm">
          <CheckCircle2 className="h-8 w-8 mx-auto text-success/60 mb-2" />
          <p className="font-medium text-text">No pending CGPA submissions</p>
          <p className="text-xs text-muted mt-1">
            Student submissions will appear here once submitted from their profile page.
          </p>
        </div>
      )}

      {/* Proof Inspection Modal */}
      {selectedProof && (
        <Modal
          isOpen={Boolean(selectedProof)}
          onClose={() => setSelectedProof(null)}
          title="Verify Academic Grade Report"
          description={`Submitted by ${selectedProof.profile?.name || 'Student'} (${selectedProof.profile?.email || 'N/A'})`}
          footer={
            <div className="flex items-center justify-between w-full">
              <button
                onClick={() => handleDeleteScreenshot(selectedProof.id, selectedProof.proof_path)}
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
                  {Number(selectedProof.cgpa).toFixed(2)}
                </span>
              </div>
              <div>
                <span className="text-muted block">Completed Credits:</span>
                <span className="font-bold text-text text-sm">
                  {selectedProof.credits_completed}
                </span>
              </div>
            </div>

            <div className="rounded-lg border border-border bg-[#0B0820] p-4 text-center">
              <span className="text-xs font-mono text-muted uppercase tracking-wider block mb-2">
                Grade Sheet Screenshot Reference
              </span>
              <div className="h-40 rounded bg-surface-2 border border-border flex flex-col items-center justify-center p-4">
                <FileCheck className="h-10 w-10 text-primary-soft mb-2" />
                <p className="text-xs font-mono text-text">Stored under private storage</p>
                <p className="text-[11px] text-muted font-mono mt-1 truncate max-w-xs">
                  {selectedProof.proof_path}
                </p>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
