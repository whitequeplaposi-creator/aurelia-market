import { createClient } from '@libsql/client/web';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const tursoUrl = process.env.TURSO_DATABASE_URL;
const tursoAuthToken = process.env.TURSO_AUTH_TOKEN;

if (!tursoUrl || !tursoAuthToken) {
  console.error('❌ TURSO_DATABASE_URL and TURSO_AUTH_TOKEN must be set in .env.local');
  process.exit(1);
}

async function setupDatabase() {
  console.log('🚀 Setting up Turso database...\n');

  // Create Turso client
  const client = createClient({
    url: tursoUrl!,
    authToken: tursoAuthToken!,
  });

  try {
    // Read schema file
    const schemaPath = path.join(process.cwd(), 'database', 'turso-schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf-8');

    // Split schema into individual statements
    const statements = schema
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    console.log(`📝 Executing ${statements.length} SQL statements...\n`);

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      try {
        await client.execute(statement);
        console.log(`✅ Statement ${i + 1}/${statements.length} executed successfully`);
      } catch (error: any) {
        console.error(`❌ Error executing statement ${i + 1}:`, error.message);
        console.error(`Statement: ${statement.substring(0, 100)}...`);
      }
    }

    console.log('\n✅ Database setup completed successfully!');
    console.log('\n📊 Verifying tables...\n');

    // Verify tables were created
    const tables = await client.execute(`
      SELECT name FROM sqlite_master 
      WHERE type='table' 
      ORDER BY name;
    `);

    console.log('Created tables:');
    tables.rows.forEach((row: any) => {
      console.log(`  - ${row.name}`);
    });

    console.log('\n🎉 Turso database is ready to use!');
  } catch (error: any) {
    console.error('\n❌ Error setting up database:', error.message);
    process.exit(1);
  }
}

setupDatabase();
