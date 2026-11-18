'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useToast } from '@/components/ui/Toast';
import { DEPARTMENTS } from '@/lib/constants';
import {
  User,
  ShieldCheck,
  Upload,
  CheckCircle2,
  AlertCircle,
  FileText,
  Lock,
  Eye,
  EyeOff,
  LogOut,
  Trophy,
} from 'lucide-react';

export default function ProfilePage() {
  const router = useRouter();
  const { success, error, info } = useToast();

  const [name, setName] = useState('Tanvir Hossain');
  const [email, setEmail] = useState('tanvir.h@iub.edu.bd');
  const [role, setRole] = useState<'student' | 'admin'>('student');
  const [department, setDepartment] = useState('cse');
  const [alias, setAlias] = useState('ByteCipher');

  // CGPA & Leaderboard settings
  const [cgpa, setCgpa] = useState('3.92');
  const [credits, setCredits] = useState('92');
  const [isOptedIn, setIsOptedIn] = useState(true);
  const [showRealName, setShowRealName] = useState(false);
  const [proofFile, setProofFile] = useState<File | null>(null);
  const [isSubmittingCgpa, setIsSubmittingCgpa] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<'none' | 'pending' | 'verified'>('verified');

  useEffect(() => {
    // Read session cookies
    const roleCookie = document.cookie
      .split('; ')
      .find((row) => row.startsWith('antimatter_user_role='))
      ?.split('=')[1];
    const nameCookie = document.cookie
      .split('; ')
      .find((row) => row.startsWith('antimatter_user_name='))
      ?.split('=')[1];

    if (roleCookie === 'admin') {
      setRole('admin');
      setName(decodeURIComponent(nameCookie || 'Fahad (XS1_Reaper)'));
      setEmail('fahad@iub.edu.bd');
      setAlias('XS1_Reaper');
      setCgpa('3.98');
      setCredits('105');
    }
  }, []);

  const handleCgpaSubmit = (e: React.FormEvent) => {
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

    setIsSubmittingCgpa(true);
    setTimeout(() => {
      setIsSubmittingCgpa(false);
      setSubmissionStatus('pending');
      success(
        'CGPA Proof Submitted for Review',
        'Uploaded to private cgpa-proofs bucket. An admin will verify your screenshot.'
      );
    }, 1000);
  };

  const handleSignOut = async () => {
    await fetch('/api/auth/demo', { method: 'DELETE' });
    document.cookie = 'antimatter_user_role=; path=/; max-age=0';
    document.cookie = 'antimatter_user_name=; path=/; max-age=0';
    success('Logged out successfully');
    router.push('/login');
    router.refresh();
  };

  return (
    <div className="mx-auto max-w-container px-6 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-border mb-8 gap-4">
        <div>
          <h1 className="font-heading text-3xl font-bold tracking-tight text-text">
            Student Account &amp; Privacy
          </h1>
          <p className="text-sm text-muted mt-1">
            Manage your university identity, leaderboard alias and verified academic credentials.
          </p>
        </div>

        <Button size="sm" variant="outline" onClick={handleSignOut} className="gap-2 shrink-0">
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </Button>
      </div>

      {/* Two column on desktop (account details left, CGPA and leaderboard settings right), single column on mobile (Blueprint 4.5) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Account Details (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <Card>
            <div className="flex items-center gap-4 mb-6">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/20 text-primary-soft font-heading text-2xl font-bold">
                {name.charAt(0)}
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-heading text-lg font-semibold text-text">{name}</h3>
                  <Badge variant={role === 'admin' ? 'warning' : 'verified'}>
                    {role === 'admin' ? 'Admin' : 'Student'}
                  </Badge>
                </div>
                <p className="font-mono text-xs text-muted mt-0.5">{email}</p>
              </div>
            </div>

            <div className="flex flex-col gap-4 text-sm">
              <div>
                <label className="text-xs font-semibold text-muted uppercase tracking-wider block mb-1">
                  Full Name (From Google SSO)
                </label>
                <Input value={name} readOnly disabled className="bg-surface cursor-not-allowed" />
              </div>

              <div>
                <label className="text-xs font-semibold text-muted uppercase tracking-wider block mb-1">
                  University Email
                </label>
                <Input value={email} readOnly disabled className="bg-surface cursor-not-allowed font-mono text-xs" />
                <span className="text-[11px] text-muted flex items-center gap-1 mt-1">
                  <Lock className="h-3 w-3 text-primary-soft" /> Verified domain iub.edu.bd
                </span>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted uppercase tracking-wider block mb-1">
                  Academic Department
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
            CGPA ranking is 100% opt-in. If you choose to participate, you may use an anonymous alias so your real name is never exposed to classmates.
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
                        label="Anonymous Alias (e.g. ByteCipher, XS1_Reaper)"
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
                    />

                    <Input
                      label="Credits Completed (Tiebreaker)"
                      type="number"
                      min="0"
                      max="180"
                      value={credits}
                      onChange={(e) => setCredits(e.target.value)}
                      placeholder="e.g. 92"
                      helperText="Used as a tiebreaker for equal CGPAs"
                    />
                  </div>

                  {/* Screenshot Proof Upload (Private bucket cgpa-proofs) */}
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
                        Stored in private bucket <code className="font-mono text-primary-soft">cgpa-proofs/{'{uid}'}/</code>. Only admins can read. Deleted after check.
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
