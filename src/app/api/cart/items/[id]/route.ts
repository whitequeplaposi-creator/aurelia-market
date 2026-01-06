import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { getAuthUser } from '@/middleware/auth';
import { handleApiError, ApiError } from '@/middleware/errorHandler';
import { z } from 'zod';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

const updateQuantitySchema = z.object({
  quantity: z.number().int().positive(),
});

// PUT update cart item quantity
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getAuthUser(request);
    const body = await request.json();
    const { quantity } = updateQuantitySchema.parse(body);

    // Get cart item
    const { data: cartItem, error: cartError } = await (supabaseAdmin as any)
      .from('cart_items')
      .select('*, product:products(*)')
      .eq('id', params.id)
      .eq('user_id', user.userId)
      .single();

    if (cartError || !cartItem) {
      throw new ApiError(404, 'Cart item not found');
    }

    // Check stock
    if (cartItem.product.stock < quantity) {
      throw new ApiError(400, 'Insufficient stock');
    }

    // Update quantity
    const { data: updatedItem, error } = await (supabaseAdmin as any)
      .from('cart_items')
      .update({ quantity })
      .eq('id', params.id)
      .select(`
        *,
        product:products(*)
      `)
      .single();

    if (error) throw error;

    return NextResponse.json({ item: updatedItem });
  } catch (error) {
    return handleApiError(error);
  }
}

// DELETE remove cart item
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getAuthUser(request);

    const { error } = await (supabaseAdmin as any)
      .from('cart_items')
      .delete()
      .eq('id', params.id)
      .eq('user_id', user.userId);

    if (error) throw error;

    return NextResponse.json({ message: 'Item removed from cart' });
  } catch (error) {
    return handleApiError(error);
  }
}
