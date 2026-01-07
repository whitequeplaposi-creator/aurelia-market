import { createClient } from '@libsql/client/web';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const tursoUrl = process.env.TURSO_DATABASE_URL;
const tursoAuthToken = process.env.TURSO_AUTH_TOKEN;

if (!tursoUrl || !tursoAuthToken) {
  console.error('❌ TURSO_DATABASE_URL and TURSO_AUTH_TOKEN must be set in .env.local');
  process.exit(1);
}

async function addTestProduct() {
  console.log('🧪 Adding test product for payment testing...\n');

  const client = createClient({
    url: tursoUrl!,
    authToken: tursoAuthToken!,
  });

  try {
    // Check if test product already exists
    const existing = await client.execute(`
      SELECT id FROM products WHERE name = 'TEST - Betalningstest 4kr'
    `);

    if (existing.rows.length > 0) {
      console.log('⚠️  Test product already exists!');
      console.log('Product ID:', existing.rows[0].id);
      return;
    }

    // Insert test product
    const result = await client.execute({
      sql: `
        INSERT INTO products (
          id, name, description, price, image, stock, category, active
        ) VALUES (
          ?, ?, ?, ?, ?, ?, ?, ?
        )
      `,
      args: [
        'test-product-4kr',
        'TEST - Betalningstest 4kr',
        '🧪 TESTPRODUKT - Endast för att testa betalningsflödet. Denna produkt kommer att tas bort automatiskt när riktiga produkter läggs till.',
        4.00,
        'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=800&h=800&fit=crop',
        999,
        'test',
        1
      ]
    });

    console.log('✅ Test product added successfully!');
    console.log('\n📦 Product Details:');
    console.log('   ID: test-product-4kr');
    console.log('   Name: TEST - Betalningstest 4kr');
    console.log('   Price: 4.00 SEK');
    console.log('   Stock: 999');
    console.log('   Category: test');
    console.log('\n🎯 Next Steps:');
    console.log('   1. Go to /products to see the test product');
    console.log('   2. Add it to cart');
    console.log('   3. Go to checkout');
    console.log('   4. Complete payment with Stripe');
    console.log('   5. Verify payment in Stripe Dashboard');
    console.log('\n⚠️  Remember: This test product will be automatically removed');
    console.log('   when you add real products using the admin panel.');

  } catch (error: any) {
    console.error('\n❌ Error adding test product:', error.message);
    process.exit(1);
  }
}

addTestProduct();
