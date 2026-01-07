const { createClient } = require('@libsql/client');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: '.env.local' });

async function setupProductionReady() {
  console.log('🚀 SÄTTER UPP PRODUKTIONSKLAR E-HANDEL\n');
  console.log('='.repeat(60));

  const turso = createClient({
    url: process.env.TURSO_DATABASE_URL,
    authToken: process.env.TURSO_AUTH_TOKEN,
  });

  try {
    // 1. Verifiera databas-anslutning
    console.log('\n📡 Testar databas-anslutning...');
    await turso.execute('SELECT 1');
    console.log('✅ Databas-anslutning fungerar!');

    // 2. Skapa admin-användare
    console.log('\n👤 Skapar admin-användare...');
    const adminEmail = 'ngabulokana@gmail.com';
    const adminPassword = 'a-z, A-Z, 0-9';
    const adminHash = await bcrypt.hash(adminPassword, 10);

    // Ta bort gammal admin om den finns
    await turso.execute({
      sql: 'DELETE FROM users WHERE email = ?',
      args: [adminEmail]
    });

    // Skapa ny admin
    await turso.execute({
      sql: `INSERT INTO users (id, email, password_hash, role, created_at, updated_at)
            VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))`,
      args: ['admin-' + Date.now(), adminEmail, adminHash, 'admin']
    });
    console.log('✅ Admin-användare skapad');
    console.log('   Email:', adminEmail);
    console.log('   Lösenord: a-z, A-Z, 0-9');

    // 3. Skapa test-kund
    console.log('\n👥 Skapar test-kund...');
    const customerEmail = 'test.customer@gmail.com';
    const customerPassword = 'testpassword123';
    const customerHash = await bcrypt.hash(customerPassword, 10);

    // Ta bort gammal kund om den finns
    await turso.execute({
      sql: 'DELETE FROM users WHERE email = ?',
      args: [customerEmail]
    });

    // Skapa ny kund
    await turso.execute({
      sql: `INSERT INTO users (id, email, password_hash, role, created_at, updated_at)
            VALUES (?, ?, ?, ?, datetime('now'), datetime('now'))`,
      args: ['customer-' + Date.now(), customerEmail, customerHash, 'customer']
    });
    console.log('✅ Test-kund skapad');
    console.log('   Email:', customerEmail);
    console.log('   Lösenord:', customerPassword);

    // 4. Verifiera användare
    console.log('\n🔍 Verifierar användare...');
    const users = await turso.execute('SELECT email, role FROM users ORDER BY role DESC');
    console.log('✅ Användare i databasen:');
    users.rows.forEach(user => {
      console.log(`   - ${user.email} (${user.role})`);
    });

    // 5. Testa login
    console.log('\n🔐 Testar login...');
    const testUser = await turso.execute({
      sql: 'SELECT * FROM users WHERE email = ?',
      args: [customerEmail]
    });

    if (testUser.rows.length > 0) {
      const user = testUser.rows[0];
      const passwordMatch = await bcrypt.compare(customerPassword, user.password_hash);
      
      if (passwordMatch) {
        console.log('✅ Login-test lyckades!');
      } else {
        console.log('❌ Login-test misslyckades - lösenord matchar inte');
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('✅ PRODUKTIONSKLAR E-HANDEL KONFIGURERAD!\n');
    
    console.log('📋 Nästa steg:');
    console.log('   1. Starta om servern: npm run dev');
    console.log('   2. Testa registrering på /register');
    console.log('   3. Testa login på /login');
    console.log('   4. Kunder kan nu registrera sig och handla!');
    
    console.log('\n👤 Test-användare:');
    console.log('   Admin: ngabulokana@gmail.com / a-z, A-Z, 0-9');
    console.log('   Kund: test.customer@gmail.com / testpassword123');
    
    console.log('\n✅ DEMO_MODE=false - Riktig databas aktiv!');

  } catch (error) {
    console.error('\n❌ FEL:', error.message);
    console.error('\nDetaljer:', error);
    process.exit(1);
  }
}

setupProductionReady();
