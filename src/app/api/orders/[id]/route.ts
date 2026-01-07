import { NextRequest, NextResponse } from 'next/server';
import { turso } from '@/lib/turso';
import { getAuthUser } from '@/middleware/auth';
import { handleApiError, ApiError } from '@/middleware/errorHandler';
import { isDemoMode, getMockOrder } from '@/lib/mockData';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

// GET single order
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getAuthUser(request);

    // Demo mode - använd mock data
    if (isDemoMode()) {
      const order = getMockOrder(params.id);
      if (!order || order.userId !== user.userId) {
        throw new ApiError(404, 'Order not found');
      }
      return NextResponse.json(order);
    }

    // Production mode - använd Turso
    if (!turso) {
      return NextResponse.json(
        { error: 'Databas ej tillgänglig' },
        { status: 500 }
      );
    }

    // Get order
    const orderResult = await turso.execute({
      sql: 'SELECT * FROM orders WHERE id = ? AND user_id = ? LIMIT 1',
      args: [params.id, user.userId]
    });

    if (orderResult.rows.length === 0) {
      throw new ApiError(404, 'Order not found');
    }

    const order = orderResult.rows[0];

    // Get order items with product details
    const itemsResult = await turso.execute({
      sql: `
        SELECT oi.*, p.name as product_name, p.image as product_image, p.description as product_description
        FROM order_items oi
        LEFT JOIN products p ON oi.product_id = p.id
        WHERE oi.order_id = ?
      `,
      args: [params.id]
    });

    const orderData = {
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
          image: item.product_image,
          description: item.product_description
        }
      }))
    };

    return NextResponse.json(orderData);
  } catch (error) {
    return handleApiError(error);
  }
}

// PATCH - Update order (cancel order)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = getAuthUser(request);
    const body = await request.json();
    const { action } = body;

    if (action !== 'cancel') {
      throw new ApiError(400, 'Invalid action');
    }

    // Demo mode
    if (isDemoMode()) {
      return NextResponse.json({ 
        message: 'Order cancelled successfully (demo mode)',
        success: true 
      });
    }

    // Production mode - använd Turso
    if (!turso) {
      return NextResponse.json(
        { error: 'Databas ej tillgänglig' },
        { status: 500 }
      );
    }

    // Get order to verify ownership and status
    const orderResult = await turso.execute({
      sql: 'SELECT * FROM orders WHERE id = ? AND user_id = ? LIMIT 1',
      args: [params.id, user.userId]
    });

    if (orderResult.rows.length === 0) {
      throw new ApiError(404, 'Order not found');
    }

    const order = orderResult.rows[0];

    // Only allow cancellation of pending or paid orders
    if (!['pending', 'paid'].includes(order.status as string)) {
      throw new ApiError(400, 'Order cannot be cancelled at this stage');
    }

    // Update order status to cancelled
    await turso.execute({
      sql: 'UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      args: ['cancelled', params.id]
    });

    return NextResponse.json({ 
      message: 'Order cancelled successfully',
      success: true 
    });
  } catch (error) {
    return handleApiError(error);
  }
}
