import { NextRequest, NextResponse } from 'next/server';
import { requireAdmin } from '@/middleware/auth';
import { supabase } from '@/lib/supabase';
import { ApiError } from '@/middleware/errorHandler';

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Validera produktdata
function validateProductData(product: any): boolean {
  return (
    typeof product.name === 'string' &&
    product.name.length > 0 &&
    typeof product.price === 'number' &&
    product.price > 0 &&
    (product.description === undefined || typeof product.description === 'string') &&
    (product.image === undefined || typeof product.image === 'string') &&
    (product.stock === undefined || (typeof product.stock === 'number' && product.stock >= 0))
  );
}

// POST /api/admin/products/import - Importera produkter från extern API
export async function POST(request: NextRequest) {
  try {
    requireAdmin(request);
    
    const body = await request.json();
    const { api_key, endpoint } = body;
    
    if (!api_key) {
      throw new ApiError(400, 'API key är obligatoriskt');
    }
    
    // Anropa extern API (exempel med generisk implementation)
    const externalEndpoint = endpoint || 'https://api.example.com/products';
    
    let externalProducts: any[];
    try {
      const response = await fetch(externalEndpoint, {
        headers: {
          'Authorization': `Bearer ${api_key}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new ApiError(502, `Extern API returnerade fel: ${response.status}`);
      }
      
      const data = await response.json();
      externalProducts = Array.isArray(data) ? data : data.products || [];
    } catch (error) {
      throw new ApiError(502, 'Kunde inte ansluta till extern API');
    }
    
    // Validera och importera produkter
    const importedProducts = [];
    const errors = [];
    
    for (const product of externalProducts) {
      if (!validateProductData(product)) {
        errors.push({
          product: product.name || 'Unknown',
          error: 'Ogiltig produktdata'
        });
        continue;
      }
      
      try {
        const { data, error } = await supabase
          .from('products')
          .insert({
            name: product.name,
            description: product.description || '',
            price: product.price,
            image: product.image || '',
            stock: product.stock || 0
          })
          .select()
          .single();
        
        if (error) {
          errors.push({
            product: product.name,
            error: 'Kunde inte spara i databas'
          });
        } else {
          importedProducts.push(data);
        }
      } catch (error) {
        errors.push({
          product: product.name,
          error: 'Oväntat fel vid import'
        });
      }
    }
    
    return NextResponse.json({
      success: true,
      imported: importedProducts.length,
      errors: errors.length,
      products: importedProducts,
      errorDetails: errors
    });
  } catch (error) {
    if (error instanceof ApiError) {
      return NextResponse.json({ error: error.message }, { status: error.statusCode });
    }
    return NextResponse.json({ error: 'Internt serverfel' }, { status: 500 });
  }
}
