const http = require('http');

console.log('═══════════════════════════════════════════════════════');
console.log('🔍 KRITISK LOGIN-DIAGNOSTIK');
console.log('═══════════════════════════════════════════════════════\n');

console.log('⚠️  VIKTIGT: Servern MÅSTE köras för att detta test ska fungera!');
console.log('   Kör: npm run dev\n');

// Vänta 2 sekunder innan vi börjar
setTimeout(() => {
  console.log('📡 Startar test...\n');
  
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
    },
    timeout: 10000 // 10 sekunder timeout
  };

  console.log('📤 Skickar request till: http://localhost:3000/api/auth/login');
  console.log('📧 Email: test@example.com');
  console.log('🔑 Password: test123456\n');

  const req = http.request(options, (res) => {
    console.log('✅ Servern svarade!');
    console.log(`📊 Status: ${res.statusCode} ${res.statusMessage}`);
    console.log(`📋 Headers:`, JSON.stringify(res.headers, null, 2));
    console.log('');

    let data = '';
    let chunks = [];

    res.on('data', (chunk) => {
      chunks.push(chunk);
      data += chunk;
      console.log(`📦 Mottog chunk: ${chunk.length} bytes`);
    });

    res.on('end', () => {
      console.log(`\n📥 Total data mottagen: ${data.length} bytes`);
      console.log('─────────────────────────────────────────────────────');
      
      if (data.trim() === '') {
        console.log('❌ KRITISKT PROBLEM: TOMT SVAR!');
        console.log('');
        console.log('🔧 MÖJLIGA ORSAKER:');
        console.log('   1. Servern kraschar innan den skickar svar');
        console.log('   2. Middleware blockerar svaret');
        console.log('   3. Turso-klienten initialiseras inte korrekt');
        console.log('   4. Environment-variabler saknas');
        console.log('');
        console.log('🔍 KONTROLLERA:');
        console.log('   1. Server-loggar (terminalen där npm run dev körs)');
        console.log('   2. .env.local finns och har rätt värden');
        console.log('   3. DEMO_MODE=false i .env.local');
        console.log('   4. TURSO_DATABASE_URL och TURSO_AUTH_TOKEN är satta');
        return;
      }

      console.log('📄 RAW RESPONSE:');
      console.log(data.substring(0, 500));
      console.log('');

      try {
        const parsed = JSON.parse(data);
        console.log('✅ JSON PARSE SUCCESS!');
        console.log('');
        
        if (res.statusCode === 200) {
          console.log('🎉 LOGIN LYCKADES!');
          console.log('─────────────────────────────────────────────────────');
          console.log('👤 User Information:');
          console.log(`   ID: ${parsed.user?.id}`);
          console.log(`   Email: ${parsed.user?.email}`);
          console.log(`   Role: ${parsed.user?.role}`);
          console.log(`   Created: ${parsed.user?.createdAt}`);
          console.log('');
          console.log('🔐 Token:');
          console.log(`   Length: ${parsed.token?.length} characters`);
          console.log(`   Preview: ${parsed.token?.substring(0, 50)}...`);
          console.log('');
          console.log('✅ ALLT FUNGERAR PERFEKT!');
        } else {
          console.log('❌ LOGIN MISSLYCKADES!');
          console.log('─────────────────────────────────────────────────────');
          console.log(`⚠️  Felmeddelande: ${parsed.error}`);
          console.log('');
          console.log('🔧 MÖJLIGA ORSAKER:');
          console.log('   1. Fel email eller lösenord');
          console.log('   2. Användaren finns inte i databasen');
          console.log('   3. Lösenordet är fel hashat');
          console.log('   4. Databasen är tom');
        }
      } catch (error) {
        console.log('❌ JSON PARSE ERROR!');
        console.log('─────────────────────────────────────────────────────');
        console.log(`⚠️  Error: ${error.message}`);
        console.log('');
        console.log('📄 Raw data (första 200 tecken):');
        console.log(data.substring(0, 200));
        console.log('');
        console.log('🔧 MÖJLIGA ORSAKER:');
        console.log('   1. Servern returnerar HTML istället för JSON');
        console.log('   2. Servern kraschar och returnerar error-sida');
        console.log('   3. Next.js error boundary aktiveras');
      }
    });
  });

  req.on('error', (error) => {
    console.log('❌ REQUEST ERROR!');
    console.log('─────────────────────────────────────────────────────');
    console.log(`⚠️  Error: ${error.message}`);
    console.log('');
    console.log('🔧 MÖJLIGA ORSAKER:');
    console.log('   1. Servern körs INTE (npm run dev)');
    console.log('   2. Servern körs på fel port');
    console.log('   3. Firewall blockerar anslutningen');
    console.log('   4. Servern har kraschat');
    console.log('');
    console.log('✅ LÖSNING:');
    console.log('   1. Öppna en ny terminal');
    console.log('   2. Kör: npm run dev');
    console.log('   3. Vänta tills servern startat');
    console.log('   4. Kör detta test igen');
  });

  req.on('timeout', () => {
    console.log('⏱️  REQUEST TIMEOUT!');
    console.log('─────────────────────────────────────────────────────');
    console.log('⚠️  Servern svarade inte inom 10 sekunder');
    console.log('');
    console.log('🔧 MÖJLIGA ORSAKER:');
    console.log('   1. Servern hänger sig');
    console.log('   2. Databas-query tar för lång tid');
    console.log('   3. Turso-anslutning timeout');
    req.destroy();
  });

  req.write(postData);
  req.end();
}, 2000);
