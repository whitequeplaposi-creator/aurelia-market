import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { requireAdmin } from '@/middleware/auth';
import { handleApiError, ApiError } from '@/middleware/errorHandler';
import { z } from 'zod';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

const productUpdateSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  price: z.number().positive().optional(),
  image: z.string().url().optional(),
  stock: z.number().int().min(0).optional(),
  active: z.boolean().optional(),
});

// GET single product
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    requireAdmin(request);

    const { data: product, error } = await (supabaseAdmin as any)
      .from('products')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error) throw new ApiError(404, 'Product not found');

    return NextResponse.json({ product });
  } catch (error) {
    return handleApiError(error);
  }
}

// PUT update product
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    requireAdmin(request);

    const body = await request.json();
    const validatedData = productUpdateSchema.parse(body);

    const { data: product, error } = await (supabaseAdmin as any)
      .from('products')
      .update(validatedData)
      .eq('id', params.id)
      .select()
      .single();

    if (error) throw new ApiError(404, 'Product not found');

    return NextResponse.json({ product });
  } catch (error) {
    return handleApiError(error);
  }
}

// DELETE product (soft delete by setting active = false)
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    requireAdmin(request);

    const { data: product, error } = await (supabaseAdmin as any)
      .from('products')
      .update({ active: false })
      .eq('id', params.id)
      .select()
      .single();

    if (error) throw new ApiError(404, 'Product not found');

    return NextResponse.json({ message: 'Product deleted', product });
  } catch (error) {
    return handleApiError(error);
  }
}
