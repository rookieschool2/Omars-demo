import { createContactSubmission } from '@/lib/queries';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  const body = await request.json();
  if (!body.name || !body.contact || !body.message) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 });
  }
  createContactSubmission(body);
  return Response.json({ ok: true });
}
