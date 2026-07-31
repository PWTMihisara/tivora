import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// GET /api/products — list all products with images
export async function GET() {
  const db = supabaseAdmin();
  const { data, error } = await db
    .from('products')
    .select('*')
    .order('id');

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}
