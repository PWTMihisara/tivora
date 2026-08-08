import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// GET /api/settings — fetch all site settings
export async function GET() {
  const db = supabaseAdmin();
  const { data, error } = await db.from('site_settings').select('*');

  if (error) {
    // Table might not exist yet — return defaults
    return NextResponse.json({ announcement_bar: 'FREE SHIPPING ON ORDERS OVER Rs. 3,000 · 30-DAY RETURNS' });
  }

  const settings: Record<string, string> = {};
  (data ?? []).forEach((row: { key: string; value: string }) => {
    settings[row.key] = row.value;
  });

  // Return defaults if no rows
  if (!settings.announcement_bar) {
    settings.announcement_bar = 'FREE SHIPPING ON ORDERS OVER Rs. 3,000 · 30-DAY RETURNS';
  }

  return NextResponse.json(settings);
}

// PATCH /api/settings — update a setting
export async function PATCH(req: Request) {
  const body = await req.json();
  const { key, value } = body as { key: string; value: string };

  if (!key || typeof value !== 'string') {
    return NextResponse.json({ error: 'key and value required' }, { status: 400 });
  }

  const db = supabaseAdmin();
  const { error } = await db
    .from('site_settings')
    .upsert({ key, value }, { onConflict: 'key' });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
