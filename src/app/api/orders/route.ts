import { NextRequest, NextResponse } from 'next/server';
import { turso } from '@/lib/turso';
import { getAuthUser } from '@/middleware/auth';
import { handleApiError } from '@/middleware/errorHandler';
import { isDemoMode, getMockOrders } from '@/lib/mockData';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// GET user's orders
export async function GET(request: NextRequest) {
  try {
    const user = getAuthUser(request);

    // Demo mode - använd mock data
    if (isDemoMode()) {
      const orders = getMockOrders(user.userId);
      return NextResponse.json(orders || []);
    }

    // Production mode - använd Turso
    if (!turso) {
      return NextResponse.json(
        { error: 'Databas ej tillgänglig' },
        { status: 500 }
      );
    }

    // Get orders
    const ordersResult = await turso.execute({
      sql: 'SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC',
      args: [user.userId]
    });

    const orders = [];
    
    // Get items for each order
    for (const order of ordersResult.rows) {
      const itemsResult = await turso.execute({
        sql: `
          SELECT oi.*, p.name as product_name, p.image as product_image
          FROM order_items oi
          LEFT JOIN products p ON oi.product_id = p.id
          WHERE oi.order_id = ?
        `,
        args: [order.id]
      });

      orders.push({
        id: order.id,
        userId: order.user_id,
        totalPrice: order.total_price,
        status: order.status,
        stripePaymentIntentId: order.stripe_payment_intent_id,
        createdAt: order.created_at,
        updatedAt: order.updated_at,
        items: itemsResult.rows.map(item => ({
          id: item.id,
          orderId: item.order_id,
          productId: item.product_id,
          quantity: item.quantity,
          priceAtPurchase: item.price_at_purchase,
          product: {
            name: item.product_name,
            image: item.product_image
          }
        }))
      });
    }

    return NextResponse.json(orders);
  } catch (error) {
    return handleApiError(error);
  }
}
