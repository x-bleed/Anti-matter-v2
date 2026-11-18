import { NextRequest, NextResponse } from 'next/server';
import { reportLimit } from '@/lib/security/rate-limit';
import { reportSchema } from '@/lib/validation/schemas';
import { cookies } from 'next/headers';

export async function POST(req: NextRequest) {
  try {
    const cookieStore = cookies();
    const userRole = cookieStore.get('antimatter_user_role')?.value;
    const ip = req.headers.get('x-forwarded-for') ?? 'anon';

    // Rate limit: 5 per hour per user (Blueprint 5.4 Item 15)
    const { success } = await reportLimit.limit(`report:${userRole ? 'user' : ip}`);
    if (!success) {
      return NextResponse.json(
        { error: 'You have submitted too many reports recently. Please wait an hour.' },
        { status: 429 }
      );
    }

    const body = await req.json();
    const parsed = reportSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Invalid report details. Reason must be between 10 and 500 characters.' },
        { status: 400 }
      );
    }

    // In production, insert into public.reports table with RLS
    return NextResponse.json({
      ok: true,
      message: 'Report submitted successfully. Our academic moderators will review it within 24 hours.',
    });
  } catch {
    return NextResponse.json({ error: 'Failed to submit report' }, { status: 500 });
  }
}
