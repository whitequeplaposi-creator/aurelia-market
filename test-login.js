const { createClient } = require('@libsql/client');

const tursoUrl = 'libsql://dostar-dostar.aws-ap-northeast-1.turso.io';
const tursoAuthToken = 'eyJhbGciOiJFZERTQSIsInR5cCI6IkpXVCJ9.eyJhIjoicm8iLCJpYXQiOjE3Njc3Mzg4ODEsImlkIjoiYTU1OTcwMzctMzQ1Zi00ODQ2LTgyMTYtNWJkNzEyYmRkMmRlIiwicmlkIjoiMDMxOTcwYzYtMzllNS00MzYyLWIwMDItM2M4OGYzNDNjOGZkIn0.k8-Jabh4t8iRl5E7kbpXS79XUZMUwVyfqKBzee8ssYBxjZQxdHClWg4FRAF9rjdzj0j_UGmHS1GTDktldBWICQ';

async function testDatabase() {
  try {
    console.log('Connecting to Turso database...');
    const turso = createClient({
      url: tursoUrl,
      authToken: tursoAuthToken,
    });

    console.log('Checking users table...');
    const result = await turso.execute('SELECT id, email, role FROM users LIMIT 5');
    
    console.log(`Found ${result.rows.length} users:`);
    result.rows.forEach(user => {
      console.log(`  - ${user.email} (${user.role})`);
    });

    if (result.rows.length === 0) {
      console.log('\n⚠️  No users found in database!');
      console.log('You need to create a user first.');
    }

  } catch (error) {
    console.error('Database error:', error.message);
    console.error('Full error:', error);
  }
}

testDatabase();
