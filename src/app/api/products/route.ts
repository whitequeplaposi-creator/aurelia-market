import { NextRequest, NextResponse } from 'next/server';
import { turso } from '@/lib/turso';
import { getMockProducts, isDemoMode } from '@/lib/mockData';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    // Demo mode - använd mock data
    if (isDemoMode()) {
      const products = getMockProducts();
      return NextResponse.json({ products });
    }

    // Production mode - använd Turso
    if (!turso) {
      return NextResponse.json(
        { error: 'Databas ej tillgänglig' },
        { status: 500 }
      );
    }

    const result = await turso.execute({
      sql: 'SELECT * FROM products WHERE active = 1 ORDER BY created_at DESC',
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
    console.error('Get products error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
