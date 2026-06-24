import { addWineItem, updateWineItem, deleteWineItem, getWineList } from '@/lib/queries';

export const dynamic = 'force-dynamic';

function checkAuth(request) {
  return request.headers.get('x-admin-password') === process.env.ADMIN_PASSWORD;
}

export async function GET(request) {
  if (!checkAuth(request)) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  return Response.json(getWineList());
}

export async function POST(request) {
  if (!checkAuth(request)) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await request.json();
  if (!body.name || !body.category || !body.price) {
    return Response.json({ error: 'Missing required fields' }, { status: 400 });
  }
  const id = addWineItem(body);
  return Response.json({ ok: true, id });
}

export async function PUT(request) {
  if (!checkAuth(request)) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  const body = await request.json();
  if (!body.id) return Response.json({ error: 'Missing id' }, { status: 400 });
  updateWineItem(body.id, body);
  return Response.json({ ok: true });
}

export async function DELETE(request) {
  if (!checkAuth(request)) return Response.json({ error: 'Unauthorized' }, { status: 401 });
  const { id } = await request.json();
  if (!id) return Response.json({ error: 'Missing id' }, { status: 400 });
  deleteWineItem(id);
  return Response.json({ ok: true });
}
