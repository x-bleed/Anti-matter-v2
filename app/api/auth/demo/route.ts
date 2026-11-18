import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    const { role, email } = await req.json();

    // Enforce university email domain check (Blueprint Item 4)
    if (email) {
      const domain = email.split('@')[1]?.toLowerCase();
      if (domain !== 'iub.edu.bd') {
        return NextResponse.json(
          { error: 'Email domain not allowed. Only @iub.edu.bd addresses are permitted.' },
          { status: 400 }
        );
      }
    }

    const cookieStore = cookies();
    const effectiveRole = role === 'admin' ? 'admin' : 'student';
    const effectiveName =
      effectiveRole === 'admin' ? 'Fahad (XS1_Reaper)' : email ? email.split('@')[0] : 'Tanvir Hossain';

    cookieStore.set('antimatter_user_role', effectiveRole, {
      path: '/',
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    });

    cookieStore.set('antimatter_user_name', effectiveName, {
      path: '/',
      httpOnly: false,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
    });

    return NextResponse.json({
      ok: true,
      user: {
        role: effectiveRole,
        name: effectiveName,
        email: email || `${effectiveRole}@iub.edu.bd`,
      },
    });
  } catch {
    return NextResponse.json({ error: 'Auth operation failed' }, { status: 500 });
  }
}

export async function DELETE() {
  const cookieStore = cookies();
  cookieStore.delete('antimatter_user_role');
  cookieStore.delete('antimatter_user_name');
  cookieStore.delete('sb-access-token');
  return NextResponse.json({ ok: true });
}
