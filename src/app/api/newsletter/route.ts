import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// GET /api/newsletter — list all subscribers
export async function GET() {
  const db = supabaseAdmin();
  const { data, error } = await db
    .from('newsletter_subscribers')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST /api/newsletter — subscribe an email
export async function POST(req: Request) {
  const body = await req.json();
  const email = (body.email ?? '').trim().toLowerCase();

  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'Valid email required' }, { status: 400 });
  }

  const db = supabaseAdmin();

  // Check if already subscribed
  const { data: existing } = await db
    .from('newsletter_subscribers')
    .select('id')
    .eq('email', email)
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ ok: true, message: 'Already subscribed' });
  }

  const { error } = await db
    .from('newsletter_subscribers')
    .insert({ email });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
