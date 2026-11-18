import React from 'react';
import Link from 'next/link';
import { ShieldCheck, FileText, AlertTriangle, Lock, Mail, ArrowLeft } from 'lucide-react';

export default function TermsAndCopyrightPage() {
  return (
    <div className="mx-auto max-w-reading px-6 py-12">
      <Link
        href="/"
        className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-primary-soft font-mono mb-8 transition"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        <span>Return to Home</span>
      </Link>

      <div className="border-b border-border pb-6 mb-8">
        <h1 className="font-heading text-3xl font-bold tracking-tight text-text">
          Terms of Service, Copyright &amp; Privacy Policy
        </h1>
        <p className="text-xs font-mono text-muted mt-1">
          ANTI-MATTER v2.0 • Updated November 2026 • Independent University, Bangladesh
        </p>
      </div>

      <div className="flex flex-col gap-10 text-sm leading-relaxed text-muted">
        {/* Section 1: Academic Fair Use */}
        <section className="flex flex-col gap-3">
          <h2 className="font-heading text-xl font-semibold text-text flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary-soft" />
            1. Purpose and Fair Academic Use
          </h2>
          <p>
            ANTI-MATTER is an academic resource repository created by students for Independent University, Bangladesh (IUB) students. All course materials, lecture summaries, past question papers, and study guides are shared exclusively for non-commercial educational reference and revision.
          </p>
          <p>
            Access is restricted to active students and faculty authenticated through authorized Google Workspace accounts under the <code className="font-mono text-primary-soft">@iub.edu.bd</code> domain.
          </p>
        </section>

        {/* Section 2: Copyright & Takedown Routine */}
        <section id="copyright" className="flex flex-col gap-3">
          <h2 className="font-heading text-xl font-semibold text-text flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-warning" />
            2. Copyright Policy &amp; Expedited Takedown Routine
          </h2>
          <p>
            We respect the intellectual property of faculty members and the university. Lecture slides, course handouts, and proprietary exam questions belong to their respective faculty instructors or university departments.
          </p>
          <div className="rounded-lg border border-border bg-surface p-4">
            <h4 className="font-semibold text-text mb-1">One-Click Takedown Mechanism:</h4>
            <p className="text-xs">
              Every document viewer on ANTI-MATTER features an immediate &ldquo;Report&rdquo; option. Faculty members and copyright owners may submit an instant removal request. Our administrative team will verify and take down flagged materials within 24 hours of notification.
            </p>
            <div className="mt-3 flex items-center gap-2 text-xs font-mono text-primary-soft">
              <Mail className="h-4 w-4" />
              <span>Direct moderation contact: security@iub.edu.bd</span>
            </div>
          </div>
        </section>

        {/* Section 3: Leaderboard Privacy */}
        <section id="privacy" className="flex flex-col gap-3">
          <h2 className="font-heading text-xl font-semibold text-text flex items-center gap-2">
            <Lock className="h-5 w-5 text-success" />
            3. Leaderboard Privacy &amp; Data Safeguards
          </h2>
          <p>
            Participation in the ANTI-MATTER University Leaderboard is 100% voluntary and opt-in.
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs">
            <li>
              <strong>Alias Protection:</strong> Students may select an anonymous alias so their real name is never exposed publicly.
            </li>
            <li>
              <strong>Private Verification Buckets:</strong> Submitted transcript and grade sheet screenshots are stored in private Supabase Storage buckets (<code className="font-mono text-primary-soft">cgpa-proofs</code>) readable only by designated administrators.
            </li>
            <li>
              <strong>Immediate Deletion:</strong> After an administrator verifies a CGPA claim, the proof screenshot is deleted immediately. Only the verified numeric score and completion credits are preserved.
            </li>
          </ul>
        </section>

        {/* Section 4: Security Architecture */}
        <section className="flex flex-col gap-3">
          <h2 className="font-heading text-xl font-semibold text-text flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 text-primary-soft" />
            4. Security Standards &amp; Architecture
          </h2>
          <p>
            ANTI-MATTER is built adhering to the 19-point launch security blueprint:
          </p>
          <ul className="list-disc pl-5 space-y-1.5 text-xs">
            <li>Strict Row Level Security (RLS) on all database tables.</li>
            <li>Server-side session management using HTTP-only cookies (<code className="font-mono text-primary-soft">@supabase/ssr</code>).</li>
            <li>Content Security Policy (CSP), anti-clickjacking (<code className="font-mono text-primary-soft">X-Frame-Options: DENY</code>), and strict transport security headers.</li>
            <li>Signed 15-minute expiring download links to prevent unauthorized resource hotlinking.</li>
          </ul>
        </section>
      </div>
    </div>
  );
}
