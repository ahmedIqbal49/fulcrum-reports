import { NextRequest } from 'next/server';

const reportStore = new Map<string, any>();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { company_name, role_title, scored_json } = body;

    if (!company_name || !scored_json) {
      return Response.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const data = typeof scored_json === 'string' ? JSON.parse(scored_json) : scored_json;

    const slug = company_name
      .toLowerCase()
      .replace(/pty\.?\s*ltd\.?/gi, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .trim();

    const uniqueSlug = `${slug}-${Date.now()}`;

    reportStore.set(uniqueSlug, {
      ...data,
      company_name,
      role_title,
      generatedAt: new Date().toISOString()
    });

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://fulcrum-reports.vercel.app';
    const reportUrl = `${baseUrl}/report/${uniqueSlug}`;

    return Response.json({
      success: true,
      reportUrl,
      slug: uniqueSlug,
      overall_rag: data.overall_rag,
      hero_summary: data.hero_summary,
      score_counts: data.score_counts
    }, { status: 201 });

  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  const slug = request.nextUrl.searchParams.get('slug');
  if (!slug) return Response.json({ error: 'No slug' }, { status: 400 });
  const data = reportStore.get(slug);
  if (!data) return Response.json({ error: 'Not found' }, { status: 404 });
  return Response.json(data);
}
