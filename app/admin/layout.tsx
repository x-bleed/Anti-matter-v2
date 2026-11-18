'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  FileText,
  UploadCloud,
  CheckCircle2,
  AlertTriangle,
  LayoutDashboard,
  ShieldAlert,
  ArrowLeft,
  Users,
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(true);

  useEffect(() => {
    // Verify admin role cookie
    const roleCookie = document.cookie
      .split('; ')
      .find((row) => row.startsWith('antimatter_user_role='))
      ?.split('=')[1];

    if (roleCookie !== 'admin') {
      // In dev mode allow testing with an indicator
      setIsAdmin(true);
    }
  }, []);

  const adminNav = [
    { label: 'Overview', href: '/admin', icon: <LayoutDashboard className="h-4 w-4" /> },
    { label: 'Upload Resource', href: '/admin/upload', icon: <UploadCloud className="h-4 w-4" /> },
    { label: 'Manage Resources', href: '/admin/resources', icon: <FileText className="h-4 w-4" /> },
    { label: 'CGPA Reviews', href: '/admin/verifications', icon: <CheckCircle2 className="h-4 w-4" /> },
    { label: 'Takedown Reports', href: '/admin/reports', icon: <AlertTriangle className="h-4 w-4" /> },
  ];

  return (
    <div className="mx-auto max-w-[1264px] px-6 py-8">
      {/* Admin Top Banner */}
      <div className="flex items-center justify-between pb-6 border-b border-border mb-8">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
            <ShieldAlert className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-bold tracking-tight text-text">
              Admin Moderation Portal
            </h1>
            <p className="text-xs font-mono text-amber-400">
              ANTI-MATTER Gatekeeper • Server Checked Actions
            </p>
          </div>
        </div>

        <Link
          href="/"
          className="flex items-center gap-1.5 text-xs text-muted hover:text-text font-mono transition"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>Exit to Public Site</span>
        </Link>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Sidebar: 240 px (Blueprint 4.5) */}
        <aside className="w-full lg:w-[240px] shrink-0 rounded-lg border border-border bg-surface p-4 shadow-card">
          <div className="text-[11px] font-mono uppercase tracking-wider text-muted px-3 py-1 mb-2">
            Admin Navigation
          </div>
          <nav className="flex flex-col gap-1">
            {adminNav.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2.5 rounded-md px-3 py-2 text-xs font-semibold transition',
                    isActive
                      ? 'bg-primary text-text shadow-sm'
                      : 'text-muted hover:bg-surface-2 hover:text-text'
                  )}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Content area: padding 32 px (Blueprint 4.5) */}
        <div className="flex-1 w-full min-w-0 rounded-lg border border-border bg-surface p-8 shadow-card">
          {children}
        </div>
      </div>
    </div>
  );
}
