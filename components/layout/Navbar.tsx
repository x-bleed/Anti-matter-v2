'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import {
  Search,
  BookOpen,
  Trophy,
  Shield,
  User,
  Menu,
  X,
  Sparkles,
  LogOut,
  ExternalLink,
} from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userRole, setUserRole] = useState<'guest' | 'student' | 'admin'>('guest');
  const [userName, setUserName] = useState<string>('');

  useEffect(() => {
    // Check session cookies or local mock storage
    const roleCookie = document.cookie
      .split('; ')
      .find((row) => row.startsWith('antimatter_user_role='))
      ?.split('=')[1];
    const nameCookie = document.cookie
      .split('; ')
      .find((row) => row.startsWith('antimatter_user_name='))
      ?.split('=')[1];

    if (roleCookie === 'admin') {
      setUserRole('admin');
      setUserName(decodeURIComponent(nameCookie || 'Fahad (Admin)'));
    } else if (roleCookie === 'student') {
      setUserRole('student');
      setUserName(decodeURIComponent(nameCookie || 'Student User'));
    } else {
      // Default to student for smooth preview unless explicitly logged out
      setUserRole('student');
      setUserName('Tanvir (Student)');
      document.cookie = 'antimatter_user_role=student; path=/; max-age=86400';
      document.cookie = 'antimatter_user_name=Tanvir%20(Student); path=/; max-age=86400';
    }
  }, []);

  const handleRoleSwitch = (newRole: 'guest' | 'student' | 'admin') => {
    setUserRole(newRole);
    if (newRole === 'admin') {
      document.cookie = 'antimatter_user_role=admin; path=/; max-age=86400';
      document.cookie = 'antimatter_user_name=Fahad%20(XS1_Reaper); path=/; max-age=86400';
      setUserName('Fahad (Admin)');
    } else if (newRole === 'student') {
      document.cookie = 'antimatter_user_role=student; path=/; max-age=86400';
      document.cookie = 'antimatter_user_name=Tanvir%20Hossain; path=/; max-age=86400';
      setUserName('Tanvir (Student)');
    } else {
      document.cookie = 'antimatter_user_role=; path=/; max-age=0';
      document.cookie = 'antimatter_user_name=; path=/; max-age=0';
      setUserName('');
      router.push('/login');
    }
    router.refresh();
  };

  const navLinks = [
    { label: 'Home', href: '/' },
    { label: 'Library', href: '/library' },
    { label: 'Leaderboard', href: '/leaderboard' },
  ];

  return (
    // Height 64px, sticky, 0 24px padding, surface at 80% with backdrop blur, 1px bottom border (Blueprint 4.4)
    <header className="sticky top-0 z-navbar h-16 w-full border-b border-border bg-surface/80 backdrop-blur-md transition-colors">
      <div className="mx-auto flex h-full max-w-[1264px] items-center justify-between px-6">
        {/* Logo left */}
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-gradient-to-br from-primary to-primary-hover shadow-[0_0_12px_rgba(124,58,237,0.4)] group-hover:shadow-[0_0_16px_rgba(124,58,237,0.7)] transition">
              <span className="font-heading font-bold text-lg text-white">α</span>
            </div>
            <div className="flex flex-col">
              <span className="font-heading text-lg font-bold tracking-tight text-text">
                ANTI-MATTER
              </span>
              <span className="text-[10px] font-mono uppercase tracking-widest text-primary-soft -mt-1">
                Blueprint v2.0
              </span>
            </div>
          </Link>
        </div>

        {/* Links center (Desktop) */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive =
              link.href === '/'
                ? pathname === '/'
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  'text-sm font-medium transition-colors hover:text-primary-soft',
                  isActive ? 'text-primary-soft font-semibold' : 'text-muted'
                )}
              >
                {link.label}
              </Link>
            );
          })}
          {userRole === 'admin' && (
            <Link
              href="/admin"
              className={cn(
                'flex items-center gap-1.5 text-sm font-medium text-amber-400 hover:text-amber-300 transition',
                pathname.startsWith('/admin') && 'font-semibold text-amber-300'
              )}
            >
              <Shield className="h-4 w-4" />
              <span>Admin Portal</span>
            </Link>
          )}
        </nav>

        {/* Search icon and Profile / Role switch right */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/library"
            className="flex h-9 w-9 items-center justify-center rounded-md text-muted hover:text-text hover:bg-surface-2 transition"
            title="Search resources (or press /)"
          >
            <Search className="h-4 w-4" />
          </Link>

          {/* Role test indicator (allows switching between Student and Admin directly) */}
          <div className="flex items-center rounded-md border border-border bg-surface-2 p-1 text-xs">
            <button
              onClick={() => handleRoleSwitch('student')}
              className={cn(
                'px-2.5 py-1 rounded transition font-medium',
                userRole === 'student'
                  ? 'bg-primary text-text shadow-sm'
                  : 'text-muted hover:text-text'
              )}
            >
              Student
            </button>
            <button
              onClick={() => handleRoleSwitch('admin')}
              className={cn(
                'px-2.5 py-1 rounded transition font-medium',
                userRole === 'admin'
                  ? 'bg-amber-600 text-text shadow-sm'
                  : 'text-muted hover:text-text'
              )}
            >
              Admin
            </button>
          </div>

          {userRole !== 'guest' ? (
            <div className="flex items-center gap-3">
              <Link
                href="/profile"
                className="flex items-center gap-2 rounded-md border border-border bg-surface-2 px-3 py-1.5 text-xs text-text hover:border-primary-soft transition"
              >
                <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center text-primary-soft font-semibold text-[10px]">
                  {userName.charAt(0) || 'U'}
                </div>
                <span className="font-medium max-w-[100px] truncate">{userName}</span>
              </Link>
            </div>
          ) : (
            <Link href="/login">
              <Button size="sm">Sign In</Button>
            </Link>
          )}
        </div>

        {/* Mobile: Logo plus hamburger (Blueprint 4.4) */}
        <div className="flex items-center gap-2 md:hidden">
          <Link
            href="/library"
            className="flex h-9 w-9 items-center justify-center rounded-md text-muted hover:text-text"
          >
            <Search className="h-4 w-4" />
          </Link>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="flex h-9 w-9 items-center justify-center rounded-md border border-border bg-surface-2 text-text"
            aria-label="Toggle Navigation"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-border bg-surface p-4 flex flex-col gap-3 animate-in slide-in-from-top-4 duration-150">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 text-base font-medium text-text hover:text-primary-soft"
            >
              {link.label}
            </Link>
          ))}
          {userRole === 'admin' && (
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 text-base font-medium text-amber-400 flex items-center gap-2"
            >
              <Shield className="h-4 w-4" /> Admin Portal
            </Link>
          )}
          <div className="pt-2 border-t border-border flex items-center justify-between">
            <span className="text-xs text-muted">Role preview:</span>
            <div className="flex gap-2">
              <button
                onClick={() => handleRoleSwitch('student')}
                className={cn('px-3 py-1 text-xs rounded', userRole === 'student' ? 'bg-primary text-text' : 'bg-surface-2 text-muted')}
              >
                Student
              </button>
              <button
                onClick={() => handleRoleSwitch('admin')}
                className={cn('px-3 py-1 text-xs rounded', userRole === 'admin' ? 'bg-amber-600 text-text' : 'bg-surface-2 text-muted')}
              >
                Admin
              </button>
            </div>
          </div>
          <Link
            href="/profile"
            onClick={() => setMobileMenuOpen(false)}
            className="py-2 text-sm text-primary-soft font-medium"
          >
            My Profile &amp; CGPA Settings
          </Link>
        </div>
      )}
    </header>
  );
}
