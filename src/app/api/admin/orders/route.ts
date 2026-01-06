import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { requireAdmin } from '@/middleware/auth';
import { handleApiError } from '@/middleware/errorHandler';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// GET all orders (admin)
export async function GET(request: NextRequest) {
  try {
    requireAdmin(request);

    const { data: orders, error } = await (supabaseAdmin as any)
      .from('orders')
      .select(`
        *,
        user:users(id, email),
        items:order_items(
          *,
          product:products(*)
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ orders: orders || [] });
  } catch (error) {
    return handleApiError(error);
  }
}
