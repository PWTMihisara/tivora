import { createClient } from '@supabase/supabase-js';

const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;

// Client-side (browser) — uses publishable key
export const supabase = createClient(
  url,
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!
);

// Server-side (API routes) — uses secret key, bypasses RLS
export function supabaseAdmin() {
  return createClient(url, process.env.SUPABASE_SECRET_KEY!);
}
