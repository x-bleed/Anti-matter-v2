import React from 'react';
import Link from 'next/link';
import { ShieldCheck, Mail, BookOpen, ExternalLink, Heart } from 'lucide-react';

export function Footer() {
  return (
    // Footer: Auto height, 48 24px padding, four link columns, 32px gap, copyright line 14px muted (Blueprint 4.4)
    <footer className="w-full border-t border-border bg-surface mt-20">
      <div className="mx-auto max-w-[1264px] px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Column 1: Brand & Blueprint summary */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
                <span className="font-heading font-bold text-white">α</span>
              </div>
              <span className="font-heading text-lg font-bold tracking-tight text-text">
                ANTI-MATTER
              </span>
            </div>
            <p className="text-sm text-muted leading-relaxed">
              Design, Architecture and Security Blueprint v2.0 for university students. Built for fast, reliable academic resource sharing and verified rankings.
            </p>
            <div className="flex items-center gap-2 mt-2 text-xs text-primary-soft">
              <ShieldCheck className="h-4 w-4" />
              <span>19/19 Security Gates Passed</span>
            </div>
          </div>

          {/* Column 2: Platform Links */}
          <div className="flex flex-col gap-3">
            <h4 className="font-heading text-sm font-semibold uppercase tracking-wider text-text">
              Platform
            </h4>
            <ul className="flex flex-col gap-2.5 text-sm text-muted">
              <li>
                <Link href="/library" className="hover:text-primary-soft transition">
                  Browse All Resources
                </Link>
              </li>
              <li>
                <Link href="/leaderboard" className="hover:text-primary-soft transition">
                  Opt-In Leaderboard
                </Link>
              </li>
              <li>
                <Link href="/profile" className="hover:text-primary-soft transition">
                  Submit CGPA for Verification
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-primary-soft transition">
                  Admin Verification Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Academic Departments */}
          <div className="flex flex-col gap-3">
            <h4 className="font-heading text-sm font-semibold uppercase tracking-wider text-text">
              Departments
            </h4>
            <ul className="flex flex-col gap-2.5 text-sm text-muted">
              <li>
                <Link href="/library?dept=cse" className="hover:text-primary-soft transition">
                  Computer Science (CSE)
                </Link>
              </li>
              <li>
                <Link href="/library?dept=eee" className="hover:text-primary-soft transition">
                  Electrical Engineering (EEE)
                </Link>
              </li>
              <li>
                <Link href="/library?dept=bba" className="hover:text-primary-soft transition">
                  Business School (BBA)
                </Link>
              </li>
              <li>
                <Link href="/library?dept=mps" className="hover:text-primary-soft transition">
                  Mathematics &amp; Sciences
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Legal, Copyright & Safety (Blueprint 3.6 & 5.5) */}
          <div className="flex flex-col gap-3">
            <h4 className="font-heading text-sm font-semibold uppercase tracking-wider text-text">
              Security &amp; Legal
            </h4>
            <ul className="flex flex-col gap-2.5 text-sm text-muted">
              <li>
                <Link href="/terms" className="hover:text-primary-soft transition">
                  Terms of Service &amp; Fair Use
                </Link>
              </li>
              <li>
                <Link href="/terms#copyright" className="hover:text-primary-soft transition">
                  Copyright &amp; Takedown Policy
                </Link>
              </li>
              <li>
                <Link href="/terms#privacy" className="hover:text-primary-soft transition">
                  Leaderboard Privacy Policy
                </Link>
              </li>
              <li className="pt-1">
                <span className="text-xs text-muted/80 flex items-center gap-1.5">
                  <Mail className="h-3.5 w-3.5 text-primary-soft" />
                  security@iub.edu.bd
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright line: 14px muted (Blueprint 4.4) */}
        <div className="border-t border-border pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted">
          <p>© {new Date().getFullYear()} ANTI-MATTER. Built by Fahad (XS1_Reaper). All rights reserved.</p>
          <p className="flex items-center gap-1 text-xs">
            Restricted to <span className="font-mono text-primary-soft">@iub.edu.bd</span> student community.
          </p>
        </div>
      </div>
    </footer>
  );
}
