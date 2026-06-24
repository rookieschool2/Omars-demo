import { createOrder } from '@/lib/queries';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  const body = await request.json();
  const { customerName, contact, items, total } = body;
  if (!customerName || !contact || !Array.isArray(items) || items.length === 0) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 });
  }
  const id = createOrder({ customerName, contact, items, total });
  return Response.json({ ok: true, id });
}
