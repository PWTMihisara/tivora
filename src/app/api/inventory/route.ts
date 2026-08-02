import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function GET() {
  const db = supabaseAdmin();
  const { data, error } = await db
    .from('inventory')
    .select('*, products(name)')
    .order('product_id')
    .order('variant');

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// PATCH /api/inventory — update stock for a row
export async function PATCH(req: NextRequest) {
  const { id, stock } = await req.json();
  const db = supabaseAdmin();
  const { error } = await db.from('inventory').update({ stock }).eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
