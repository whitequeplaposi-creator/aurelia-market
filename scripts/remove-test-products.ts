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

async function removeTestProducts() {
  console.log('🧹 Removing test products...\n');

  const client = createClient({
    url: tursoUrl!,
    authToken: tursoAuthToken!,
  });

  try {
    // Find all test products
    const testProducts = await client.execute(`
      SELECT id, name, price FROM products 
      WHERE category = 'test' OR name LIKE 'TEST%' OR id LIKE 'test-%'
    `);

    if (testProducts.rows.length === 0) {
      console.log('✅ No test products found. Database is clean!');
      return;
    }

    console.log(`Found ${testProducts.rows.length} test product(s):\n`);
    testProducts.rows.forEach((row: any) => {
      console.log(`   - ${row.name} (${row.price} SEK) [ID: ${row.id}]`);
    });

    // Delete test products
    const result = await client.execute(`
      DELETE FROM products 
      WHERE category = 'test' OR name LIKE 'TEST%' OR id LIKE 'test-%'
    `);

    console.log(`\n✅ Successfully removed ${testProducts.rows.length} test product(s)!`);
    console.log('\n🎉 Your database now contains only real products.');

  } catch (error: any) {
    console.error('\n❌ Error removing test products:', error.message);
    process.exit(1);
  }
}

removeTestProducts();
