import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// GET /api/collections
export async function GET() {
  const db = supabaseAdmin();
  const { data, error } = await db.from('collections').select('*').order('name');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// PATCH /api/collections — update banner_url for a collection
export async function PATCH(req: NextRequest) {
  const { name, banner_url } = await req.json();
  const db = supabaseAdmin();
  const { error } = await db.from('collections').update({ banner_url }).eq('name', name);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
