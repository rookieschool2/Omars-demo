import { createNewsletterSignup } from '@/lib/queries';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  const { email } = await request.json();
  if (!email || !email.includes('@')) {
    return Response.json({ error: 'Please enter a valid email' }, { status: 400 });
  }
  try {
    createNewsletterSignup({ email });
  } catch {
    return Response.json({ error: 'You are already signed up' }, { status: 400 });
  }
  return Response.json({ ok: true });
}
