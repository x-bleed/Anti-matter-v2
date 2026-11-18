'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { createClient } from '@/lib/supabase/client';
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
  ChevronDown,
} from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState<{ id: string; email: string; name: string; isAdmin: boolean } | null>(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    // 1. Initial user check via Supabase Auth
    const checkUser = async () => {
      try {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (authUser) {
          const email = authUser.email || '';
          const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'fahad@iub.edu.bd';
          
          // Check role from profiles table or admin email
          const { data: profile } = await supabase
            .from('profiles')
            .select('role, name')
            .eq('id', authUser.id)
            .single();

          const isAdmin = profile?.role === 'admin' || email.toLowerCase() === adminEmail.toLowerCase();
          const name = profile?.name || authUser.user_metadata?.full_name || email.split('@')[0];

          setUser({
            id: authUser.id,
            email,
            name,
            isAdmin,
          });
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      }
    };

    checkUser();

    // 2. Real-time auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const email = session.user.email || '';
        const adminEmail = process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'fahad@iub.edu.bd';
        const isAdmin = email.toLowerCase() === adminEmail.toLowerCase();

        setUser({
          id: session.user.id,
          email,
          name: session.user.user_metadata?.full_name || email.split('@')[0],
          isAdmin,
        });
      } else {
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    document.cookie = 'antimatter_user_role=; path=/; max-age=0';
    document.cookie = 'antimatter_user_name=; path=/; max-age=0';
    setUser(null);
    setUserDropdownOpen(false);
    router.push('/');
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
          {user?.isAdmin && (
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

        {/* Search icon and Profile Right */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            href="/library"
            className="flex h-9 w-9 items-center justify-center rounded-md text-muted hover:text-text hover:bg-surface-2 transition"
            title="Search resources (or press /)"
          >
            <Search className="h-4 w-4" />
          </Link>

          {user ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 rounded-md border border-border bg-surface-2 px-3 py-1.5 text-xs text-text hover:border-primary-soft transition"
              >
                <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center text-primary-soft font-semibold text-[10px]">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <span className="font-medium max-w-[120px] truncate">{user.name}</span>
                <ChevronDown className="h-3.5 w-3.5 text-muted" />
              </button>

              {userDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-lg border border-border bg-surface p-1 shadow-card z-dropdown animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-3 py-2 border-b border-border text-left">
                    <p className="text-xs font-semibold text-text truncate">{user.name}</p>
                    <p className="text-[10px] font-mono text-muted truncate">{user.email}</p>
                  </div>
                  <Link
                    href="/profile"
                    onClick={() => setUserDropdownOpen(false)}
                    className="flex w-full items-center gap-2 px-3 py-2 text-xs text-text hover:bg-surface-2 rounded-md transition"
                  >
                    <User className="h-3.5 w-3.5 text-primary-soft" />
                    <span>My Profile &amp; CGPA</span>
                  </Link>
                  {user.isAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setUserDropdownOpen(false)}
                      className="flex w-full items-center gap-2 px-3 py-2 text-xs text-amber-400 hover:bg-surface-2 rounded-md transition"
                    >
                      <Shield className="h-3.5 w-3.5" />
                      <span>Admin Dashboard</span>
                    </Link>
                  )}
                  <button
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-2 px-3 py-2 text-xs text-danger hover:bg-danger/10 rounded-md transition border-t border-border mt-1"
                  >
                    <LogOut className="h-3.5 w-3.5" />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login">
              <Button size="sm" variant="primary">Sign In</Button>
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
          {user?.isAdmin && (
            <Link
              href="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 text-base font-medium text-amber-400 flex items-center gap-2"
            >
              <Shield className="h-4 w-4" /> Admin Portal
            </Link>
          )}

          {user ? (
            <div className="pt-2 border-t border-border flex flex-col gap-2">
              <Link
                href="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="py-2 text-sm text-primary-soft font-medium flex items-center gap-2"
              >
                <User className="h-4 w-4" /> My Profile ({user.name})
              </Link>
              <button
                onClick={handleSignOut}
                className="py-2 text-sm text-danger text-left flex items-center gap-2"
              >
                <LogOut className="h-4 w-4" /> Sign Out
              </button>
            </div>
          ) : (
            <div className="pt-2 border-t border-border">
              <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button size="sm" variant="primary" className="w-full">Sign In with University Email</Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
}
