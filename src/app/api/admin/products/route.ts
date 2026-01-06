import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
import { requireAdmin } from '@/middleware/auth';
import { handleApiError, ApiError } from '@/middleware/errorHandler';
import { z } from 'zod';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

const productSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  price: z.number().positive(),
  image: z.string().url().optional(),
  stock: z.number().int().min(0),
});

// GET all products (admin)
export async function GET(request: NextRequest) {
  try {
    requireAdmin(request);

    const { data: products, error } = await (supabaseAdmin as any)
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ products });
  } catch (error) {
    return handleApiError(error);
  }
}

// POST create product
export async function POST(request: NextRequest) {
  try {
    requireAdmin(request);

    const body = await request.json();
    const validatedData = productSchema.parse(body);

    const { data: product, error } = await (supabaseAdmin as any)
      .from('products')
      .insert(validatedData)
      .select()
      .single();

    if (error) throw error;

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
