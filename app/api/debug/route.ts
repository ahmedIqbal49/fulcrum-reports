import { NextRequest } from 'next/server';
import { list } from '@vercel/blob';

export async function GET(request: NextRequest) {
  try {
    const { blobs } = await list({
      token: process.env.BLOB_READ_WRITE_TOKEN
    });
    return Response.json({ 
      count: blobs.length,
      blobs: blobs.map(b => ({ url: b.url, pathname: b.pathname }))
    });
  } catch (error: any) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
