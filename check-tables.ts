import { createClient } from '@libsql/client/web';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const tursoUrl = process.env.TURSO_DATABASE_URL!;
const tursoAuthToken = process.env.TURSO_AUTH_TOKEN!;

async function checkTables() {
  const client = createClient({
    url: tursoUrl,
    authToken: tursoAuthToken,
  });

  try {
    const tables = await client.execute(`
      SELECT name FROM sqlite_master 
      WHERE type='table' 
      ORDER BY name;
    `);

    console.log(`Found ${tables.rows.length} tables:`);
    tables.rows.forEach((row: any) => {
      console.log(`  - ${row.name}`);
    });

    if (tables.rows.length === 0) {
      console.log('\n⚠️  No tables found! Database needs to be initialized.');
      console.log('\nThe Turso token has read-only access.');
      console.log('You need to create tables using Turso CLI or dashboard with a write token.');
    }
  } catch (error: any) {
    console.error('Error:', error.message);
  }
}

checkTables();
