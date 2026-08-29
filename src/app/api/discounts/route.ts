import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// GET — list all product discounts
export async function GET() {
  const db = supabaseAdmin();
  const { data, error } = await db
    .from('product_discounts')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST — create or update a discount for a product
export async function POST(req: Request) {
  const body = await req.json();
  const { product_id, discount_type, discount_value, label, active } = body;

  if (!product_id || !discount_type || discount_value == null) {
    return NextResponse.json({ error: 'product_id, discount_type, and discount_value are required' }, { status: 400 });
  }

  if (!['percentage', 'fixed'].includes(discount_type)) {
    return NextResponse.json({ error: 'discount_type must be "percentage" or "fixed"' }, { status: 400 });
  }

  const db = supabaseAdmin();
  const { data, error } = await db
    .from('product_discounts')
    .upsert(
      {
        product_id,
        discount_type,
        discount_value: Number(discount_value),
        label: label || null,
        active: active ?? true,
      },
      { onConflict: 'product_id' }
    )
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// DELETE — remove a discount
export async function DELETE(req: Request) {
  const { product_id } = await req.json();
  if (!product_id) return NextResponse.json({ error: 'product_id required' }, { status: 400 });

  const db = supabaseAdmin();
  const { error } = await db.from('product_discounts').delete().eq('product_id', product_id);

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
