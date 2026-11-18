import { NextRequest, NextResponse } from 'next/server';
import { searchLimit } from '@/lib/security/rate-limit';
import { searchSchema } from '@/lib/validation/schemas';
import { INITIAL_RESOURCES } from '@/lib/data/mock-db';
import { createClient } from '@/lib/supabase/server';

export async function GET(req: NextRequest) {
  // Rate limiting: 30 calls per minute per IP (Blueprint Page 17 Item 15)
  const ip = req.headers.get('x-forwarded-for') ?? 'anon';
  const { success } = await searchLimit.limit(`search:${ip}`);
  if (!success) {
    return new NextResponse('Too many requests. Please wait a minute.', { status: 429 });
  }

  // Parse and validate search parameters
  const url = new URL(req.url);
  const rawParams = {
    q: url.searchParams.get('q') || undefined,
    department: url.searchParams.get('department') || undefined,
    course: url.searchParams.get('course') || undefined,
    type: url.searchParams.get('type') || undefined,
    semester: url.searchParams.get('semester') || undefined,
    sort: url.searchParams.get('sort') || 'newest',
    page: url.searchParams.get('page') || 1,
    limit: url.searchParams.get('limit') || 12,
  };

  const parsed = searchSchema.safeParse(rawParams);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid search parameters' }, { status: 400 });
  }

  const { q, department, course, type, semester, sort, page, limit } = parsed.data;

  try {
    const supabase = await createClient();
    const isMock = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('mock');

    if (!isMock) {
      let dbQuery = supabase
        .from('resources')
        .select('*, course:courses(*, department:departments(*))')
        .eq('status', 'published');

      // Parameterized text search (Blueprint Item 5: no raw user text in .or() strings)
      if (q && q.trim()) {
        dbQuery = dbQuery.textSearch('search_vector', q.trim(), { type: 'websearch' });
      }

      if (type && type !== 'all') {
        dbQuery = dbQuery.eq('type', type);
      }

      const { data, error } = await dbQuery;
      if (!error && data) {
        return NextResponse.json({ resources: data, total: data.length });
      }
    }

    // Local / In-memory search with full ranking
    let results = [...INITIAL_RESOURCES];

    if (q && q.trim()) {
      const queryLower = q.trim().toLowerCase();
      // Safe parameterized filtering (resistant to SQL / regex injection)
      results = results.filter((res) => {
        const titleMatch = res.title.toLowerCase().includes(queryLower);
        const codeMatch = res.course?.code.toLowerCase().includes(queryLower);
        const typeMatch = res.type.toLowerCase().includes(queryLower);
        const deptMatch = res.course?.department?.name.toLowerCase().includes(queryLower);
        return titleMatch || codeMatch || typeMatch || deptMatch;
      });
    }

    if (department) {
      results = results.filter((res) => {
        const deptSlug = res.course?.department?.slug;
        return deptSlug === department;
      });
    }

    if (course) {
      results = results.filter((res) => res.course?.code.toLowerCase() === course.toLowerCase());
    }

    if (type && type !== 'all') {
      results = results.filter((res) => res.type === type);
    }

    if (semester) {
      results = results.filter((res) => res.course?.semester === semester);
    }

    // Sorting
    if (sort === 'oldest') {
      results.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
    } else if (sort === 'title') {
      results.sort((a, b) => a.title.localeCompare(b.title));
    } else if (sort === 'popular') {
      results.sort((a, b) => (b.download_count || 0) - (a.download_count || 0));
    } else {
      // Default: newest
      results.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }

    const total = results.length;
    const startIndex = (page - 1) * limit;
    const paginated = results.slice(startIndex, startIndex + limit);

    return NextResponse.json({
      resources: paginated,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch {
    return NextResponse.json({ error: 'Search operation failed' }, { status: 500 });
  }
}
