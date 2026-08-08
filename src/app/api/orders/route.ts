import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { sendOrderConfirmation, sendAdminOrderAlert } from '@/lib/email';

// GET /api/orders — list all orders (admin)
export async function GET() {
  const db = supabaseAdmin();
  const { data, error } = await db
    .from('orders')
    .select('*, order_items(*)')
    .order('created_at', { ascending: false });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

// POST /api/orders — create order from storefront checkout
export async function POST(req: NextRequest) {
  const body = await req.json();
  const db = supabaseAdmin();

  const orderId = 'ORD-' + (Math.floor(Math.random() * 9000) + 1000);

  const { error: orderError } = await db.from('orders').insert({
    id:       orderId,
    customer: body.customer,
    email:    body.email,
    phone:    body.phone ?? null,
    address:  body.address,
    payment:  body.payment ?? 'Pending',
    status:   'Pending',
    shipping: body.shipping ?? 0,
    tax:      body.tax ?? 0,
    subtotal: body.subtotal,
    total:    body.total,
  });

  if (orderError) return NextResponse.json({ error: orderError.message }, { status: 500 });

  const items = (body.items as { name: string; size: string; qty: number; price: number }[]).map(i => ({
    order_id:     orderId,
    product_name: i.name,
    size:         i.size,
    qty:          i.qty,
    price:        i.price,
  }));

  const { error: itemsError } = await db.from('order_items').insert(items);
  if (itemsError) return NextResponse.json({ error: itemsError.message }, { status: 500 });

  // Decrement inventory stock for each ordered item
  for (const item of body.items as { name: string; size: string; qty: number; price: number }[]) {
    const { data: product } = await db.from('products').select('id').eq('name', item.name).single();
    if (product) {
      await db.rpc('decrement_inventory', {
        p_product_id: product.id,
        p_variant:    item.size,
        p_qty:        item.qty,
      });
    }
  }

  // Send emails — must be awaited on Vercel or function terminates before emails send
  const emailData = {
    orderId:  orderId,
    customer: body.customer,
    email:    body.email,
    address:  body.address ?? '',
    items:    body.items,
    subtotal: body.subtotal,
    tax:      body.tax ?? 0,
    shipping: body.shipping ?? 0,
    total:    body.total,
  };
  await Promise.all([
    sendOrderConfirmation(emailData),
    sendAdminOrderAlert(emailData),
  ]).catch(err => console.error('Email send failed:', err));

  return NextResponse.json({ id: orderId }, { status: 201 });
}
