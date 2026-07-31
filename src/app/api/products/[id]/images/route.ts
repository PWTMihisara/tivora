import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';

export async function POST(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const db = supabaseAdmin();
  const formData = await req.formData();
  const files = formData.getAll('images') as File[];

  const urls: string[] = [];

  for (const file of files) {
    const ext = file.name.split('.').pop();
    const path = `products/${id}/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

    const { error: uploadError } = await db.storage
      .from('product-images')
      .upload(path, file, { contentType: file.type, upsert: true });

    if (uploadError) return NextResponse.json({ error: uploadError.message }, { status: 500 });

    const { data } = db.storage.from('product-images').getPublicUrl(path);
    urls.push(data.publicUrl);
  }

  const { data: product } = await db.from('products').select('images').eq('id', id).single();
  const existing: string[] = product?.images ?? [];
  const merged = [...existing, ...urls].slice(0, 3);

  const { error } = await db.from('products').update({ images: merged }).eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ images: merged });
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { images } = await req.json();
  const db = supabaseAdmin();

  const { error } = await db.from('products').update({ images }).eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ images });
}
