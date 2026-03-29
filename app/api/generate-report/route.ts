import { NextRequest } from 'next/server';

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
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://fulcrum-reports.vercel.app';
    
    // Encode all data in URL so no storage needed
    const encodedData = Buffer.from(JSON.stringify({
      ...data,
      company_name,
      role_title
    })).toString('base64');

    const reportUrl = `${baseUrl}/report/${uniqueSlug}?d=${encodedData}`;

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
