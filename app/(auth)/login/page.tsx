'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import { ShieldCheck, Mail, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';
  const reason = searchParams.get('reason');
  const { success, error } = useToast();

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [domainError, setDomainError] = useState<string | null>(null);

  const handleGoogleSignIn = async (chosenEmail?: string, chosenRole?: 'student' | 'admin') => {
    setIsLoading(true);
    setDomainError(null);

    const targetEmail = chosenEmail || (email.trim() ? email.trim() : 'student@iub.edu.bd');

    // University email domain check (Blueprint Item 4: enforce iub.edu.bd domain)
    const domain = targetEmail.split('@')[1]?.toLowerCase();
    if (domain !== 'iub.edu.bd') {
      const errMsg = 'Email domain not allowed. Only @iub.edu.bd student emails are permitted.';
      setDomainError(errMsg);
      error(errMsg);
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/demo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: targetEmail,
          role: chosenRole || (targetEmail.includes('admin') || targetEmail.includes('fahad') ? 'admin' : 'student'),
        }),
      });

      if (res.ok) {
        success('Signed in successfully', `Welcome to ANTI-MATTER (${targetEmail})`);
        router.push(redirect);
        router.refresh();
      } else {
        const data = await res.json();
        error(data.error || 'Authentication failed');
      }
    } catch {
      error('Failed to connect to authentication service');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-140px)] items-center justify-center px-4 py-12">
      {/* Centered card, width 420 px, padding 32 px, radius 20 px (Blueprint 4.5) */}
      <div className="w-full max-w-[420px] rounded-xl border border-border bg-surface p-8 shadow-card flex flex-col items-center text-center">
        {/* Logo: 48 px on top (Blueprint 4.5) */}
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-primary-hover shadow-[0_0_16px_rgba(124,58,237,0.5)] mb-5">
          <span className="font-heading text-2xl font-bold text-white">α</span>
        </div>

        <h1 className="font-heading text-2xl font-bold tracking-tight text-text">
          Sign In to ANTI-MATTER
        </h1>
        <p className="mt-1.5 text-xs text-muted">
          Access course notes, PDF previews, and verified CGPA leaderboard
        </p>

        {reason === 'admin_required' && (
          <div className="mt-4 w-full rounded-md border border-warning/30 bg-warning/10 p-2.5 text-xs text-warning text-left flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>Admin privileges required to access that dashboard.</span>
          </div>
        )}

        {domainError && (
          <div className="mt-4 w-full rounded-md border border-danger/30 bg-danger/10 p-2.5 text-xs text-danger text-left flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{domainError}</span>
          </div>
        )}

        {/* Google SSO Button: Large, full width (Blueprint 4.5) */}
        <div className="mt-6 w-full flex flex-col gap-3">
          <Button
            size="lg"
            variant="secondary"
            onClick={() => handleGoogleSignIn('student@iub.edu.bd', 'student')}
            isLoading={isLoading}
            className="w-full gap-3 border-border hover:border-primary-soft/60"
          >
            {/* Google G Icon */}
            <svg className="h-5 w-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 9.98 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span className="text-sm font-semibold">Continue with Google</span>
          </Button>

          {/* Muted note about the university email requirement (Blueprint 4.5 & Item 4) */}
          <p className="text-[11px] text-muted leading-relaxed px-2">
            Restricted to students and faculty with an active <span className="font-mono text-primary-soft">@iub.edu.bd</span> university Google account.
          </p>
        </div>

        {/* Demo Fast-Login Selector */}
        <div className="mt-8 pt-6 border-t border-border w-full text-left">
          <span className="text-[11px] font-mono uppercase tracking-wider text-muted block mb-3">
            Quick Test Accounts
          </span>
          <div className="flex flex-col gap-2">
            <button
              onClick={() => handleGoogleSignIn('tanvir.h@iub.edu.bd', 'student')}
              className="flex items-center justify-between p-2.5 rounded-md border border-border bg-surface-2 hover:border-primary-soft text-xs text-text transition"
            >
              <div className="flex flex-col">
                <span className="font-semibold">Student Account</span>
                <span className="text-muted font-mono text-[10px]">tanvir.h@iub.edu.bd</span>
              </div>
              <span className="text-[10px] text-primary-soft font-mono">Select</span>
            </button>

            <button
              onClick={() => handleGoogleSignIn('fahad@iub.edu.bd', 'admin')}
              className="flex items-center justify-between p-2.5 rounded-md border border-border bg-surface-2 hover:border-amber-400 text-xs text-text transition"
            >
              <div className="flex flex-col">
                <span className="font-semibold text-amber-300">Admin Account</span>
                <span className="text-muted font-mono text-[10px]">fahad@iub.edu.bd</span>
              </div>
              <span className="text-[10px] text-amber-400 font-mono">Select</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-muted">Loading authentication...</div>}>
      <LoginContent />
    </Suspense>
  );
}
