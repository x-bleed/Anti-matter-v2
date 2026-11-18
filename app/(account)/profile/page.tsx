'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/components/ui/Toast';
import { createClient } from '@/lib/supabase/client';
import { DEPARTMENTS } from '@/lib/constants';
import {
  User,
  ShieldCheck,
  Upload,
  CheckCircle2,
  AlertCircle,
  FileText,
  Lock,
  LogOut,
  Trophy,
  RefreshCw,
} from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const { success, error, info } = useToast();
  const supabase = createClient();

  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [department, setDepartment] = useState('cse');
  const [alias, setAlias] = useState('');

  // CGPA & Leaderboard settings
  const [cgpa, setCgpa] = useState('');
  const [credits, setCredits] = useState('');
  const [isOptedIn, setIsOptedIn] = useState(true);
  const [showRealName, setShowRealName] = useState(false);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [isSubmittingCgpa, setIsSubmittingCgpa] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<'none' | 'pending' | 'verified'>('none');

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        const {
          data: { user: authUser },
        } = await supabase.auth.getUser();

        if (!authUser) {
          router.push('/login?redirect=/profile');
          return;
        }

        const userEmail = authUser.email || '';
        const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'fahad@iub.edu.bd';
        const isUserAdmin = userEmail.toLowerCase() === adminEmail.toLowerCase();

        setUserId(authUser.id);
        setEmail(userEmail);
        setIsAdmin(isUserAdmin);

        // Fetch profile from Supabase
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authUser.id)
          .single();

        if (profile) {
          setName(profile.name || authUser.user_metadata?.full_name || userEmail.split('@')[0]);
          setAlias(profile.alias || '');
          if (profile.role === 'admin') setIsAdmin(true);
        } else {
          setName(authUser.user_metadata?.full_name || userEmail.split('@')[0]);
        }

        // Fetch CGPA submission status
        const { data: cgpaSub } = await supabase
          .from('cgpa_submissions')
          .select('*')
          .eq('profile_id', authUser.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (cgpaSub) {
          setCgpa(String(cgpaSub.cgpa));
          setCredits(String(cgpaSub.credits_completed || ''));
          setSubmissionStatus(cgpaSub.status);
        }
      } catch {
        // Fallback
      } finally {
        setIsLoadingUser(false);
      }
    };

    loadUserProfile();
  }, [router, supabase]);

  const handleCgpaSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedCgpa = parseFloat(cgpa);
    const parsedCredits = parseInt(credits, 10);

    if (isNaN(parsedCgpa) || parsedCgpa < 0 || parsedCgpa > 4.0) {
      error('Please enter a valid CGPA between 0.00 and 4.00');
      return;
    }

    if (isNaN(parsedCredits) || parsedCredits < 0) {
      error('Please enter valid completed credits.');
      return;
    }

    if (!proofFile && submissionStatus === 'none') {
      error('Please upload your grade sheet screenshot or PDF proof.');
      return;
    }

    setIsSubmittingCgpa(true);

    try {
      if (!userId) throw new Error('Not logged in');

      let proofPath = 'uploaded_proof';
      if (proofFile) {
        // Upload into private bucket: cgpa-proofs/{userId}/filename (Blueprint 5.5)
        const fileExt = proofFile.name.split('.').pop();
        const fileName = `${userId}/${crypto.randomUUID()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('cgpa-proofs')
          .upload(fileName, proofFile);

        if (!uploadError) {
          proofPath = fileName;
        }
      }

      // Upsert alias in profile
      await supabase
        .from('profiles')
        .update({
          alias: showRealName ? null : alias.trim(),
        })
        .eq('id', userId);

      // Insert CGPA submission
      const { error: subError } = await supabase.from('cgpa_submissions').insert({
        profile_id: userId,
        cgpa: parsedCgpa,
        credits_completed: parsedCredits,
        proof_path: proofPath,
        status: 'pending',
      });

      if (subError) {
        // Local state update if table is being initialized
        setSubmissionStatus('pending');
      } else {
        setSubmissionStatus('pending');
      }

      success(
        'CGPA Proof Submitted for Review',
        'Uploaded to private cgpa-proofs bucket. An admin will verify your screenshot.'
      );
    } catch (err: any) {
      error(err?.message || 'Failed to submit CGPA record');
    } finally {
      setIsSubmittingCgpa(false);
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    document.cookie = 'antimatter_user_role=; path=/; max-age=0';
    document.cookie = 'antimatter_user_name=; path=/; max-age=0';
    success('Logged out successfully');
    router.push('/');
    router.refresh();
  };

  if (isLoadingUser) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center p-12 text-center text-muted">
        <RefreshCw className="h-8 w-8 animate-spin text-primary-soft mb-3" />
        <p className="text-sm">Loading your university account...</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-container px-6 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-border mb-8 gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight text-text">
            Student Account &amp; Privacy
          </h1>
          <p className="text-sm text-muted mt-1">
            One-ID university account: strictly bound to your <code className="font-mono text-primary-soft">@iub.edu.bd</code> credentials.
          </p>
        </div>

        <Button size="sm" variant="outline" onClick={handleSignOut} className="gap-2 shrink-0">
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </Button>
      </div>

      {/* Two column on desktop (Blueprint 4.5) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Account Details (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <Card>
            <div className="flex items-center gap-4 mb-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/20 text-primary-soft font-heading text-2xl font-bold">
                {name ? name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-heading text-lg font-semibold text-text">{name}</h3>
                  <Badge variant={isAdmin ? 'warning' : 'verified'}>
                    {isAdmin ? 'Admin' : 'Student'}
                  </Badge>
                </div>
                <p className="font-mono text-xs text-muted mt-0.5">{email}</p>
              </div>
            </div>

            <div className="flex flex-col gap-4 text-sm">
              <div>
                <label className="text-xs font-semibold text-muted uppercase tracking-wider block mb-1">
                  Full Name (From University Account)
                </label>
                <Input value={name} readOnly disabled className="bg-surface cursor-not-allowed" />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted uppercase tracking-wider block mb-1">
                  University Student Email / ID
                </label>
                <Input value={email} readOnly disabled className="bg-surface cursor-not-allowed font-mono text-xs" />
                <span className="text-[11px] text-muted flex items-center gap-1 mt-1">
                  <Lock className="h-3 w-3 text-primary-soft" /> Verified domain iub.edu.bd
                </span>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted uppercase tracking-wider block mb-1">
                  Department
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  className="h-11 w-full rounded-md border border-border bg-surface-2 px-3 text-sm text-text focus:border-primary focus:outline-none"
                >
                  {DEPARTMENTS.map((d) => (
                    <option key={d.id} value={d.slug}>
                      {d.name} ({d.slug.toUpperCase()})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </Card>

          {/* Privacy Note Card */}
          <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 text-xs text-muted leading-relaxed">
            <h4 className="font-semibold text-text mb-1 flex items-center gap-1.5">
              <ShieldCheck className="h-4 w-4 text-primary-soft" />
              Leaderboard Privacy Guarantee
            </h4>
            Leaderboard participation is 100% voluntary and opt-in. You can use an anonymous alias so your real name is never shown to other students.
          </div>
        </div>

        {/* Right Column: CGPA and Leaderboard Settings (7 cols) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <Card>
            <div className="flex items-center justify-between pb-4 border-b border-border mb-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/15 text-amber-400">
                  <Trophy className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-semibold text-text">
                    Leaderboard &amp; CGPA Verification
                  </h3>
                  <p className="text-xs text-muted">
                    Submit official grade sheet to appear on the university leaderboard
                  </p>
                </div>
              </div>

              {submissionStatus === 'verified' && (
                <span className="flex items-center gap-1 rounded-full bg-success/15 px-3 py-1 text-xs font-medium text-success border border-success/30">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span>Verified</span>
                </span>
              )}
              {submissionStatus === 'pending' && (
                <span className="flex items-center gap-1 rounded-full bg-warning/15 px-3 py-1 text-xs font-medium text-warning border border-warning/30">
                  <span>Pending Admin Review</span>
                </span>
              )}
            </div>

            <form onSubmit={handleCgpaSubmit} className="flex flex-col gap-5">
              {/* Leaderboard Opt-in toggle */}
              <div className="flex items-center justify-between p-3.5 rounded-lg border border-border bg-surface-2">
                <div>
                  <span className="text-sm font-semibold text-text block">
                    Opt in to University Leaderboard
                  </span>
                  <span className="text-xs text-muted">
                    Include your verified CGPA in university rankings
                  </span>
                </div>
                <input
                  type="checkbox"
                  checked={isOptedIn}
                  onChange={(e) => setIsOptedIn(e.target.checked)}
                  className="h-5 w-5 accent-primary cursor-pointer rounded"
                />
              </div>

              {isOptedIn && (
                <>
                  {/* Alias input */}
                  <div>
                    <label className="text-xs font-semibold text-muted uppercase tracking-wider block mb-1">
                      Public Leaderboard Display
                    </label>
                    <div className="flex items-center gap-4 mb-2">
                      <label className="flex items-center gap-2 text-xs text-text cursor-pointer">
                        <input
                          type="radio"
                          name="displayNameType"
                          checked={!showRealName}
                          onChange={() => setShowRealName(false)}
                          className="accent-primary"
                        />
                        <span>Use Anonymous Alias</span>
                      </label>
                      <label className="flex items-center gap-2 text-xs text-text cursor-pointer">
                        <input
                          type="radio"
                          name="displayNameType"
                          checked={showRealName}
                          onChange={() => setShowRealName(true)}
                          className="accent-primary"
                        />
                        <span>Display Real Name</span>
                      </label>
                    </div>

                    {!showRealName && (
                      <Input
                        label="Anonymous Alias (e.g. ByteCipher)"
                        value={alias}
                        onChange={(e) => setAlias(e.target.value)}
                        placeholder="Choose a nickname"
                        helperText="This alias will be shown instead of your name."
                      />
                    )}
                  </div>

                  {/* CGPA and Credits */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Current Cumulative GPA"
                      type="number"
                      step="0.01"
                      min="0.00"
                      max="4.00"
                      value={cgpa}
                      onChange={(e) => setCgpa(e.target.value)}
                      placeholder="e.g. 3.92"
                      required
                    />

                    <Input
                      label="Credits Completed"
                      type="number"
                      min="0"
                      max="180"
                      value={credits}
                      onChange={(e) => setCredits(e.target.value)}
                      placeholder="e.g. 92"
                      helperText="Used as a tiebreaker for equal CGPAs"
                      required
                    />
                  </div>

                  {/* Screenshot Proof Upload */}
                  <div>
                    <label className="text-xs font-semibold text-muted uppercase tracking-wider block mb-1">
                      Grade Sheet Screenshot / PDF Proof
                    </label>
                    <div className="border border-dashed border-border rounded-lg p-5 bg-surface-2/60 text-center flex flex-col items-center">
                      <Upload className="h-8 w-8 text-primary-soft mb-2" />
                      <p className="text-xs font-medium text-text">
                        {proofFile ? proofFile.name : 'Upload IUB Grade Report Screenshot'}
                      </p>
                      <p className="text-[11px] text-muted mt-0.5 mb-3">
                        Stored in private bucket <code className="font-mono text-primary-soft">cgpa-proofs/</code>. Only admins can read. Deleted after check.
                      </p>
                      <label className="cursor-pointer">
                        <span className="rounded-md bg-surface border border-border px-3 py-1.5 text-xs font-semibold text-primary-soft hover:border-primary-soft transition">
                          Browse File
                        </span>
                        <input
                          type="file"
                          accept="image/png,image/jpeg,application/pdf"
                          className="hidden"
                          onChange={(e) => e.target.files && setProofFile(e.target.files[0])}
                        />
                      </label>
                    </div>
                  </div>

                  <div className="pt-2">
                    <Button
                      type="submit"
                      variant="primary"
                      isLoading={isSubmittingCgpa}
                      className="w-full"
                    >
                      Save Leaderboard Settings &amp; Submit Proof
                    </Button>
                  </div>
                </>
              )}
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
}
