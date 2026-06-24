import { createReservation } from '@/lib/queries';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  const body = await request.json();
  const { name, contact, date, time, partySize } = body;
  if (!name || !contact || !date || !time || !partySize) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 });
  }
  if (Number(partySize) < 1 || Number(partySize) > 20) {
    return Response.json({ error: 'Party size must be between 1 and 20' }, { status: 400 });
  }
  const id = createReservation({ ...body, partySize: Number(partySize) });
  return Response.json({ ok: true, id });
}
