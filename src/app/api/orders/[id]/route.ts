import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { getAuthUser } from '@/middleware/auth';
import { handleApiError, ApiError } from '@/middleware/errorHandler';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// GET single order
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getAuthUser(request);

    const { data: order, error } = await (supabaseAdmin as any)
      .from('orders')
      .select(`
        *,
        items:order_items(
          *,
          product:products(*)
        )
      `)
      .eq('id', params.id)
      .eq('user_id', user.userId)
      .single();

    if (error || !order) {
      throw new ApiError(404, 'Order not found');
    }

    return NextResponse.json({ order });
  } catch (error) {
    return handleApiError(error);
  }
}
