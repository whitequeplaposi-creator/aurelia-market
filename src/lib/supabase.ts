import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-side client with service key (lazy initialization)
let _supabaseAdmin: ReturnType<typeof createClient> | null = null;

export function getSupabaseAdmin() {
  if (!_supabaseAdmin) {
    const serviceKey = process.env.SUPABASE_SERVICE_KEY || supabaseAnonKey;
    _supabaseAdmin = createClient(supabaseUrl, serviceKey);
  }
  return _supabaseAdmin;
}

// For backwards compatibility - use getter to avoid module-level initialization
export const supabaseAdmin = new Proxy({} as ReturnType<typeof createClient>, {
  get(target, prop) {
    const admin = getSupabaseAdmin();
    return (admin as any)[prop];
  }
});
