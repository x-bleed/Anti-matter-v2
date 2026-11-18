import { NextRequest, NextResponse } from 'next/server';
import { INITIAL_RESOURCES } from '@/lib/data/mock-db';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');

  if (id) {
    const resource = INITIAL_RESOURCES.find((r) => r.id === id);
    if (!resource) {
      return NextResponse.json({ error: 'Resource not found' }, { status: 404 });
    }
    return NextResponse.json({ resource });
  }

  return NextResponse.json({ resources: INITIAL_RESOURCES });
}
