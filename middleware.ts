import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protected Admin Routes: /admin/*
  if (pathname.startsWith('/admin')) {
    // Check auth cookie (Supabase session token or antimatter_session)
    const adminSessionCookie = request.cookies.get('antimatter_user_role')?.value;
    const supabaseToken = request.cookies.get('sb-access-token')?.value;

    // In demo / preview mode, antimatter_user_role cookie can signify admin role
    const isAdmin = adminSessionCookie === 'admin';

    // If neither real admin session nor verified role, redirect to login
    if (!isAdmin && !supabaseToken) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      loginUrl.searchParams.set('reason', 'admin_required');
      return NextResponse.redirect(loginUrl);
    }
  }

  // Protected Student Routes: /resource/[id], /leaderboard, /profile
  if (pathname.startsWith('/profile') || pathname.startsWith('/resource/')) {
    const userRole = request.cookies.get('antimatter_user_role')?.value;
    const supabaseToken = request.cookies.get('sb-access-token')?.value;
    const isUserLoggedIn = Boolean(userRole || supabaseToken);

    if (!isUserLoggedIn) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/profile/:path*', '/resource/:id*'],
};
