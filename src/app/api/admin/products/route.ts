import { NextRequest, NextResponse } from 'next/server';
import { turso } from '@/lib/turso';
import { requireAdmin } from '@/middleware/auth';
import { handleApiError, ApiError } from '@/middleware/errorHandler';
import { z } from 'zod';
import { isDemoMode } from '@/lib/mockData';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

const productSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  price: z.number().positive(),
  image: z.string().url().optional(),
  stock: z.number().int().min(0),
  category: z.string().optional(),
});

// GET all products (admin)
export async function GET(request: NextRequest) {
  try {
    requireAdmin(request);

    if (isDemoMode()) {
      return NextResponse.json({ products: [] });
    }

    if (!turso) {
      throw new ApiError(500, 'Databas ej tillgänglig');
    }

    const result = await turso.execute({
      sql: 'SELECT * FROM products ORDER BY created_at DESC',
      args: []
    });

    const products = result.rows.map(row => ({
      id: row.id,
      name: row.name,
      description: row.description,
      price: row.price,
      image: row.image,
      stock: row.stock,
      category: row.category,
      active: row.active === 1,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    }));

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

    if (isDemoMode()) {
      return NextResponse.json(
        { error: 'Demo mode - kan inte skapa produkter' },
        { status: 403 }
      );
    }

    if (!turso) {
      throw new ApiError(500, 'Databas ej tillgänglig');
    }

    const result = await turso.execute({
      sql: `INSERT INTO products (name, description, price, image, stock, category, active) 
            VALUES (?, ?, ?, ?, ?, ?, 1) 
            RETURNING *`,
      args: [
        validatedData.name,
        validatedData.description,
        validatedData.price,
        validatedData.image || null,
        validatedData.stock,
        validatedData.category || null
      ]
    });

    if (result.rows.length === 0) {
      throw new ApiError(500, 'Failed to create product');
    }

    const row = result.rows[0];
    const product = {
      id: row.id,
      name: row.name,
      description: row.description,
      price: row.price,
      image: row.image,
      stock: row.stock,
      category: row.category,
      active: row.active === 1,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
