'use client';

import React, { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/components/ui/Toast';
import { createClient } from '@/lib/supabase/client';
import { ShieldCheck, Mail, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';
  const urlError = searchParams.get('error');
  const reason = searchParams.get('reason');
  const { success, error } = useToast();

  const [email, setEmail] = useState('');
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isEmailLoading, setIsEmailLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [formError, setFormError] = useState<string | null>(urlError || null);

  const supabase = createClient();

  // 1. Google SSO with @iub.edu.bd restriction
  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setFormError(null);

    try {
      const origin = window.location.origin;
      const { error: authError } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${origin}/auth/callback?next=${encodeURIComponent(redirect)}`,
          queryParams: {
            hd: 'iub.edu.bd', // prompts Google login to only allow @iub.edu.bd accounts
            access_type: 'offline',
            prompt: 'select_account',
          },
        },
      });

      if (authError) {
        setFormError(authError.message);
        error(authError.message);
      }
    } catch (err: any) {
      setFormError(err?.message || 'Failed to initiate Google sign in');
      error('Failed to connect to authentication server');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  // 2. University Email Magic Link / OTP Login
  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      setFormError('Please enter your university email address.');
      return;
    }

    const domain = cleanEmail.split('@')[1];
    if (domain !== 'iub.edu.bd') {
      const errMsg = 'Email domain not allowed. Only @iub.edu.bd student and faculty emails are permitted.';
      setFormError(errMsg);
      error(errMsg);
      return;
    }

    setIsEmailLoading(true);
    try {
      const origin = window.location.origin;
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email: cleanEmail,
        options: {
          emailRedirectTo: `${origin}/auth/callback?next=${encodeURIComponent(redirect)}`,
        },
      });

      if (otpError) {
        setFormError(otpError.message);
        error(otpError.message);
      } else {
        setOtpSent(true);
        success('Verification link sent!', `Check your inbox at ${cleanEmail}`);
      }
    } catch (err: any) {
      setFormError(err?.message || 'Failed to send login link');
      error('Failed to send verification link');
    } finally {
      setIsEmailLoading(false);
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
          Independent University, Bangladesh Academic Portal
        </p>

        {reason === 'admin_required' && (
          <div className="mt-4 w-full rounded-md border border-warning/30 bg-warning/10 p-2.5 text-xs text-warning text-left flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>Admin account required to access that dashboard.</span>
          </div>
        )}

        {formError && (
          <div className="mt-4 w-full rounded-md border border-danger/30 bg-danger/10 p-2.5 text-xs text-danger text-left flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{formError}</span>
          </div>
        )}

        {otpSent ? (
          <div className="mt-6 w-full rounded-lg border border-success/30 bg-success/10 p-5 text-center flex flex-col items-center">
            <CheckCircle2 className="h-10 w-10 text-success mb-2" />
            <h3 className="font-heading text-sm font-semibold text-text">Check Your University Email</h3>
            <p className="text-xs text-muted mt-1 leading-relaxed">
              We sent a secure sign-in link to <span className="font-mono text-primary-soft">{email}</span>. Click the link in your email to instantly log in.
            </p>
            <button
              onClick={() => setOtpSent(false)}
              className="mt-4 text-xs text-primary-soft hover:underline font-medium"
            >
              Use a different email
            </button>
          </div>
        ) : (
          <div className="mt-6 w-full flex flex-col gap-4">
            {/* Google SSO Button: Large, full width (Blueprint 4.5) */}
            <Button
              size="lg"
              variant="secondary"
              onClick={handleGoogleSignIn}
              isLoading={isGoogleLoading}
              className="w-full gap-3 border-border hover:border-primary-soft/60 shadow-sm"
            >
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

            <div className="flex items-center gap-3 my-1">
              <div className="h-px flex-1 bg-border" />
              <span className="text-[11px] font-mono text-muted uppercase tracking-wider">or sign in with email</span>
              <div className="h-px flex-1 bg-border" />
            </div>

            {/* University Email Magic Link Form */}
            <form onSubmit={handleEmailSignIn} className="flex flex-col gap-3 text-left">
              <Input
                label="IUB Student Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="studentID@iub.edu.bd"
                required
              />

              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isEmailLoading}
                className="w-full gap-2"
              >
                <Mail className="h-4 w-4" />
                <span>Send Magic Sign-In Link</span>
              </Button>
            </form>

            {/* Muted note about the university email requirement (Blueprint 4.5 & Item 4) */}
            <p className="text-[11px] text-muted leading-relaxed px-2 mt-2">
              Strictly restricted to students and faculty with an active <span className="font-mono text-primary-soft">@iub.edu.bd</span> university Google account.
            </p>
          </div>
        )}
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
