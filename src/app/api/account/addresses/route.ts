import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// GET /api/account/addresses?user_id=xxx
export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('user_id');
  if (!userId) return NextResponse.json({ error: 'user_id required' }, { status: 400 });
  const db = supabaseAdmin();
  const { data, error } = await db.from('addresses').select('*').eq('user_id', userId).order('created_at');
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST /api/account/addresses — create new address
export async function POST(req: NextRequest) {
  const body = await req.json();
  const db = supabaseAdmin();
  // If is_default, clear other defaults first
  if (body.is_default) {
    await db.from('addresses').update({ is_default: false }).eq('user_id', body.user_id);
  }
  const { data, error } = await db.from('addresses').insert(body).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
