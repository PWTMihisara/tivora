import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { sendStatusUpdate } from '@/lib/email';

// GET /api/orders/[id] — fetch single order with items
export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = supabaseAdmin();
  const { data, error } = await db
    .from('orders')
    .select('*, order_items(*)')
    .eq('id', id)
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 404 });
  return NextResponse.json(data);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { status } = await req.json();
  const db = supabaseAdmin();

  // Fetch current order status + items before updating
  const { data: order } = await db
    .from('orders')
    .select('customer, email, status, order_items(product_name, size, qty)')
    .eq('id', id)
    .single();

  const { error } = await db.from('orders').update({ status }).eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Restore inventory stock when cancelling a non-cancelled order
  if (status === 'Cancelled' && order?.status !== 'Cancelled') {
    const items: { product_name: string; size: string; qty: number }[] = order?.order_items ?? [];
    for (const item of items) {
      // Find the product id from product name
      const { data: product } = await db.from('products').select('id').eq('name', item.product_name).single();
      if (!product) continue;
      const sku = `TIV-${product.id}-${item.size}`;
      // Increment stock for that SKU
      const { data: inv } = await db.from('inventory').select('id, stock').eq('sku', sku).single();
      if (inv) {
        await db.from('inventory').update({ stock: inv.stock + item.qty }).eq('id', inv.id);
      }
    }
  }

  // Send status email to customer
  if (order?.email) {
    sendStatusUpdate(id, order.customer, order.email, status).catch(err =>
      console.error('Status email failed:', err)
    );
  }

  return NextResponse.json({ success: true });
}
