import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

// POST /api/promo — validate a promo code
export async function POST(req: NextRequest) {
  const { code, subtotal } = await req.json();

  if (!code || typeof subtotal !== 'number') {
    return NextResponse.json({ valid: false, message: 'Code and subtotal required' });
  }

  const db = supabaseAdmin();
  const { data: promo, error } = await db
    .from('promo_codes')
    .select('*')
    .ilike('code', code.trim())
    .single();

  if (error || !promo) {
    return NextResponse.json({ valid: false, message: 'Invalid promo code' });
  }

  if (!promo.active) {
    return NextResponse.json({ valid: false, message: 'This code is no longer active' });
  }

  if (promo.max_uses !== null && promo.uses >= promo.max_uses) {
    return NextResponse.json({ valid: false, message: 'This code has reached its usage limit' });
  }

  if (subtotal < (promo.min_order ?? 0)) {
    const money = (n: number) => 'Rs. ' + n.toLocaleString('en-US', { minimumFractionDigits: 2 });
    return NextResponse.json({ valid: false, message: `Minimum order of ${money(promo.min_order)} required` });
  }

  let discount_amount: number;
  if (promo.discount_type === 'percentage') {
    discount_amount = Math.round(subtotal * (promo.discount_value / 100));
  } else {
    discount_amount = promo.discount_value;
  }
  // Cap discount at subtotal
  discount_amount = Math.min(discount_amount, subtotal);

  // Increment usage count
  await db.from('promo_codes').update({ uses: promo.uses + 1 }).eq('id', promo.id);

  return NextResponse.json({
    valid: true,
    discount_type: promo.discount_type,
    discount_value: promo.discount_value,
    discount_amount,
  });
}
