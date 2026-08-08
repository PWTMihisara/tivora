import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// GET /api/wishlist?user_id=xxx
export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get('user_id');
  if (!userId) return NextResponse.json({ error: 'user_id required' }, { status: 400 });

  const db = supabaseAdmin();
  const { data, error } = await db
    .from('wishlists')
    .select('product_id')
    .eq('user_id', userId);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST /api/wishlist — add to wishlist
export async function POST(req: NextRequest) {
  const { user_id, product_id } = await req.json();
  if (!user_id || !product_id) return NextResponse.json({ error: 'user_id and product_id required' }, { status: 400 });

  const db = supabaseAdmin();
  const { error } = await db
    .from('wishlists')
    .upsert({ user_id, product_id }, { onConflict: 'user_id,product_id' });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}

// DELETE /api/wishlist — remove from wishlist
export async function DELETE(req: NextRequest) {
  const { user_id, product_id } = await req.json();
  if (!user_id || !product_id) return NextResponse.json({ error: 'user_id and product_id required' }, { status: 400 });

  const db = supabaseAdmin();
  const { error } = await db
    .from('wishlists')
    .delete()
    .eq('user_id', user_id)
    .eq('product_id', product_id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
