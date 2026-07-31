import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { sendStatusUpdate } from '@/lib/email';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { status } = await req.json();
  const db = supabaseAdmin();

  const { error } = await db.from('orders').update({ status }).eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  // Send status email to customer (fire-and-forget)
  const { data: order } = await db
    .from('orders')
    .select('customer, email')
    .eq('id', id)
    .single();

  if (order?.email) {
    sendStatusUpdate(id, order.customer, order.email, status).catch(err =>
      console.error('Status email failed:', err)
    );
  }

  return NextResponse.json({ success: true });
}
