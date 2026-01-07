import { NextRequest, NextResponse } from 'next/server';
import { turso } from '@/lib/turso';
import { getMockProduct, isDemoMode } from '@/lib/mockData';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Demo mode - använd mock data
    if (isDemoMode()) {
      const product = getMockProduct(params.id);
      
      if (!product) {
        return NextResponse.json(
          { error: 'Product not found' },
          { status: 404 }
        );
      }

      return NextResponse.json(product);
    }

    // Production mode - använd Turso
    if (!turso) {
      return NextResponse.json(
        { error: 'Databas ej tillgänglig' },
        { status: 500 }
      );
    }

    const result = await turso.execute({
      sql: 'SELECT * FROM products WHERE id = ? AND active = 1 LIMIT 1',
      args: [params.id]
    });

    if (result.rows.length === 0) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
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

    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}
