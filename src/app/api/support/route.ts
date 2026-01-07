import { NextRequest, NextResponse } from 'next/server';
import { turso } from '@/lib/turso';
import { getAuthUser } from '@/middleware/auth';
import { handleApiError } from '@/middleware/errorHandler';
import { isDemoMode } from '@/lib/mockData';
import { z } from 'zod';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

const supportSchema = z.object({
  orderId: z.string().optional(),
  subject: z.string().min(1).max(200),
  message: z.string().min(1).max(2000),
  category: z.enum(['order', 'product', 'payment', 'shipping', 'other']).default('other'),
});

// POST - Create support ticket
export async function POST(request: NextRequest) {
  try {
    const user = getAuthUser(request);
    const body = await request.json();
    
    // Validate input
    const validatedData = supportSchema.parse(body);
    const { orderId, subject, message, category } = validatedData;

    // Demo mode - simulera framgång
    if (isDemoMode()) {
      return NextResponse.json({
        success: true,
        message: 'Ditt meddelande har skickats! Vi återkommer inom 24 timmar.',
        ticketId: `DEMO-${Date.now()}`,
      });
    }

    // Production mode - spara i databas
    if (!turso) {
      return NextResponse.json(
        { error: 'Databas ej tillgänglig' },
        { status: 500 }
      );
    }

    // Skapa support ticket i databas
    const ticketId = `TICKET-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    await turso.execute({
      sql: `
        INSERT INTO support_tickets (id, user_id, order_id, subject, message, category, status, created_at)
        VALUES (?, ?, ?, ?, ?, ?, 'open', CURRENT_TIMESTAMP)
      `,
      args: [ticketId, user.userId, orderId || null, subject, message, category]
    });

    // I en riktig applikation skulle du här:
    // 1. Skicka email till support-teamet
    // 2. Skicka bekräftelse-email till kunden
    // 3. Eventuellt integrera med ett ticket-system som Zendesk

    return NextResponse.json({
      success: true,
      message: 'Ditt meddelande har skickats! Vi återkommer inom 24 timmar.',
      ticketId,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Ogiltig data', details: error.errors },
        { status: 400 }
      );
    }
    return handleApiError(error);
  }
}

// GET - Get user's support tickets
export async function GET(request: NextRequest) {
  try {
    const user = getAuthUser(request);

    // Demo mode
    if (isDemoMode()) {
      return NextResponse.json([
        {
          id: 'DEMO-1',
          subject: 'Fråga om leverans',
          message: 'När kommer min order?',
          category: 'shipping',
          status: 'open',
          createdAt: new Date().toISOString(),
        }
      ]);
    }

    // Production mode
    if (!turso) {
      return NextResponse.json(
        { error: 'Databas ej tillgänglig' },
        { status: 500 }
      );
    }

    const result = await turso.execute({
      sql: `
        SELECT st.*, o.id as order_number
        FROM support_tickets st
        LEFT JOIN orders o ON st.order_id = o.id
        WHERE st.user_id = ?
        ORDER BY st.created_at DESC
      `,
      args: [user.userId]
    });

    const tickets = result.rows.map(row => ({
      id: row.id,
      orderId: row.order_id,
      orderNumber: row.order_number,
      subject: row.subject,
      message: row.message,
      category: row.category,
      status: row.status,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    }));

    return NextResponse.json(tickets);
  } catch (error) {
    return handleApiError(error);
  }
}
