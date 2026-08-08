import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// GET /api/reviews?product_id=xxx
export async function GET(req: NextRequest) {
  const productId = req.nextUrl.searchParams.get('product_id');
  if (!productId) return NextResponse.json({ error: 'product_id required' }, { status: 400 });

  const db = supabaseAdmin();
  const { data, error } = await db
    .from('reviews')
    .select('*')
    .eq('product_id', productId)
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST /api/reviews — create a review
export async function POST(req: NextRequest) {
  const body = await req.json();
  const { product_id, user_id, user_name, rating, comment } = body;

  if (!product_id || !user_id || !user_name) {
    return NextResponse.json({ error: 'product_id, user_id, and user_name required' }, { status: 400 });
  }
  if (!rating || rating < 1 || rating > 5) {
    return NextResponse.json({ error: 'Rating must be between 1 and 5' }, { status: 400 });
  }
  if (!comment?.trim()) {
    return NextResponse.json({ error: 'Comment is required' }, { status: 400 });
  }

  const db = supabaseAdmin();
  const { error } = await db.from('reviews').insert({
    product_id,
    user_id,
    user_name,
    rating,
    comment: comment.trim(),
  });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true }, { status: 201 });
}
