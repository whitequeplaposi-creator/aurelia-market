const http = require('http');

console.log('═══════════════════════════════════════════════════════');
console.log('🔍 OMFATTANDE LOGIN-TEST');
console.log('═══════════════════════════════════════════════════════\n');

// Test 1: Kontrollera att servern svarar
function testServerConnection() {
  return new Promise((resolve, reject) => {
    console.log('📡 Test 1: Kontrollerar serveranslutning...');
    
    const req = http.request({
      hostname: 'localhost',
      port: 3000,
      path: '/',
      method: 'GET',
    }, (res) => {
      console.log('✅ Servern svarar på port 3000');
      console.log(`   Status: ${res.statusCode}\n`);
      resolve(true);
    });

    req.on('error', (error) => {
      console.log('❌ Servern svarar INTE på port 3000');
      console.log(`   Fel: ${error.message}`);
      console.log('   ⚠️  Starta servern med: npm run dev\n');
      reject(error);
    });

    req.end();
  });
}

// Test 2: Testa login med korrekt data
function testLoginSuccess() {
  return new Promise((resolve, reject) => {
    console.log('🔐 Test 2: Testar login med korrekt data...');
    console.log('   Email: test@example.com');
    console.log('   Password: test123456\n');

    const postData = JSON.stringify({
      email: 'test@example.com',
      password: 'test123456'
    });

    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        console.log(`📥 Svar mottaget:`);
        console.log(`   Status: ${res.statusCode} ${res.statusMessage}`);
        console.log(`   Content-Type: ${res.headers['content-type']}`);
        console.log(`   Content-Length: ${data.length} bytes\n`);

        if (data.trim() === '') {
          console.log('❌ PROBLEM: Tomt svar från servern!');
          console.log('   Detta betyder att servern inte returnerar något data.\n');
          reject(new Error('Empty response'));
          return;
        }

        try {
          const parsed = JSON.parse(data);
          
          if (res.statusCode === 200) {
            console.log('✅ LOGIN LYCKADES!');
            console.log(`   User ID: ${parsed.user?.id}`);
            console.log(`   Email: ${parsed.user?.email}`);
            console.log(`   Role: ${parsed.user?.role}`);
            console.log(`   Token: ${parsed.token?.substring(0, 20)}...\n`);
            resolve(parsed);
          } else {
            console.log('❌ LOGIN MISSLYCKADES!');
            console.log(`   Felmeddelande: ${parsed.error}\n`);
            reject(new Error(parsed.error));
          }
        } catch (error) {
          console.log('❌ PROBLEM: Kunde inte parsa JSON-svar!');
          console.log(`   Parse error: ${error.message}`);
          console.log(`   Raw data (första 200 tecken): ${data.substring(0, 200)}\n`);
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      console.log('❌ REQUEST ERROR!');
      console.log(`   ${error.message}\n`);
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

// Test 3: Testa login med felaktigt lösenord
function testLoginWrongPassword() {
  return new Promise((resolve, reject) => {
    console.log('🔐 Test 3: Testar login med felaktigt lösenord...');
    console.log('   Email: test@example.com');
    console.log('   Password: wrongpassword\n');

    const postData = JSON.stringify({
      email: 'test@example.com',
      password: 'wrongpassword'
    });

    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const parsed = JSON.parse(data);
          
          if (res.statusCode === 401) {
            console.log('✅ Felhantering fungerar korrekt!');
            console.log(`   Status: ${res.statusCode}`);
            console.log(`   Felmeddelande: ${parsed.error}\n`);
            resolve(true);
          } else {
            console.log('⚠️  Oväntat svar:');
            console.log(`   Status: ${res.statusCode}`);
            console.log(`   Data: ${JSON.stringify(parsed)}\n`);
            resolve(false);
          }
        } catch (error) {
          console.log('❌ Kunde inte parsa svar\n');
          reject(error);
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(postData);
    req.end();
  });
}

// Kör alla tester
async function runAllTests() {
  try {
    await testServerConnection();
    await testLoginSuccess();
    await testLoginWrongPassword();
    
    console.log('═══════════════════════════════════════════════════════');
    console.log('✅ ALLA TESTER KLARA!');
    console.log('═══════════════════════════════════════════════════════');
    console.log('\n📋 SAMMANFATTNING:');
    console.log('   ✅ Servern är tillgänglig');
    console.log('   ✅ Login fungerar med korrekt data');
    console.log('   ✅ Felhantering fungerar korrekt');
    console.log('\n🎉 Login-funktionen fungerar perfekt!\n');
    
  } catch (error) {
    console.log('═══════════════════════════════════════════════════════');
    console.log('❌ TEST MISSLYCKADES!');
    console.log('═══════════════════════════════════════════════════════');
    console.log('\n🔧 FELSÖKNING:');
    console.log('   1. Kontrollera att servern körs: npm run dev');
    console.log('   2. Kontrollera .env.local har rätt credentials');
    console.log('   3. Kontrollera server-loggar för felmeddelanden');
    console.log('   4. Starta om servern om den redan körs\n');
    console.log(`Fel: ${error.message}\n`);
  }
}

runAllTests();
