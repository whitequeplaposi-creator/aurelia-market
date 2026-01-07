import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { turso } from '@/lib/turso';
import { z } from 'zod';
import { strictRateLimit } from '@/lib/rateLimit';
import { sanitizeInput } from '@/middleware/security';
import { isDemoMode, mockDemoUser } from '@/lib/mockData';

// Force dynamic rendering
export const dynamic = 'force-dynamic';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export async function POST(request: NextRequest) {
  console.log('🔐 Login request received');
  
  try {
    // Rate limiting
    try {
      strictRateLimit(request);
    } catch (rateLimitError: any) {
      console.error('❌ Rate limit exceeded');
      return NextResponse.json(
        { error: rateLimitError.message || 'För många förfrågningar, försök igen senare' },
        { 
          status: 429,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    let body;
    try {
      body = await request.json();
      console.log('📧 Login attempt for:', body.email);
    } catch (jsonError) {
      console.error('❌ JSON parse error:', jsonError);
      return NextResponse.json(
        { error: 'Ogiltig förfrågan - JSON-fel' },
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    // Sanitera input
    const sanitizedBody = sanitizeInput(body);
    
    // Validera input
    let validatedData;
    try {
      validatedData = loginSchema.parse(sanitizedBody);
    } catch (validationError) {
      console.error('❌ Validation error:', validationError);
      return NextResponse.json(
        { error: 'Ogiltig e-postadress eller lösenord' },
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    const { email, password } = validatedData;

    // Demo mode - returnera mock user
    if (isDemoMode()) {
      console.log('🎭 Demo mode active - returning mock user');
      const token = jwt.sign(
        { userId: mockDemoUser.id, email: mockDemoUser.email, role: mockDemoUser.role },
        process.env.JWT_SECRET || 'demo-secret',
        { expiresIn: '7d' }
      );

      return NextResponse.json(
        {
          user: mockDemoUser,
          token,
        },
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    // Production mode - använd Turso
    if (!turso) {
      console.error('❌ Turso client not initialized');
      console.error('TURSO_DATABASE_URL:', process.env.TURSO_DATABASE_URL ? 'Set' : 'Not set');
      console.error('TURSO_AUTH_TOKEN:', process.env.TURSO_AUTH_TOKEN ? 'Set' : 'Not set');
      return NextResponse.json(
        { error: 'Databas ej tillgänglig' },
        { 
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    console.log('🔍 Querying database for user...');
    
    // Get user
    const result = await turso.execute({
      sql: 'SELECT * FROM users WHERE email = ? LIMIT 1',
      args: [email]
    });

    const user = result.rows[0];

    if (!user) {
      console.log('❌ User not found');
      return NextResponse.json(
        { error: 'Felaktig e-postadress eller lösenord' },
        { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('✅ User found, verifying password...');

    // Verify password
    const validPassword = await bcrypt.compare(password, user.password_hash as string);

    if (!validPassword) {
      console.log('❌ Invalid password');
      return NextResponse.json(
        { error: 'Felaktig e-postadress eller lösenord' },
        { 
          status: 401,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('✅ Password valid, generating token...');

    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    console.log('✅ Login successful for:', email);

    return NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          createdAt: user.created_at,
          updatedAt: user.updated_at,
        },
        token,
      },
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );
  } catch (error) {
    console.error('❌ Login error:', error);
    
    // Ge mer specifika felmeddelanden
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Ogiltig e-postadress eller lösenord' },
        { 
          status: 400,
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    return NextResponse.json(
      { error: 'Inloggning misslyckades. Försök igen.' },
      { 
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
