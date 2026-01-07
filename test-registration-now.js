const http = require('http');

async function testRegistration() {
  console.log('🧪 Testar registrering...\n');

  const testEmail = 'test.user@gmail.com';
  const testPassword = 'testpassword123';

  const postData = JSON.stringify({
    email: testEmail,
    password: testPassword
  });

  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/api/auth/register',
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        console.log('📊 Status Code:', res.statusCode);
        console.log('📋 Headers:', JSON.stringify(res.headers, null, 2));
        console.log('\n📦 Response Body:');
        
        try {
          const parsed = JSON.parse(data);
          console.log(JSON.stringify(parsed, null, 2));
          
          if (res.statusCode === 200 && parsed.token) {
            console.log('\n✅ REGISTRERING FUNGERAR!');
            console.log('✅ Token mottagen');
            console.log('✅ Användare:', parsed.user.email);
            console.log('✅ Roll:', parsed.user.role);
          } else {
            console.log('\n❌ Registrering misslyckades');
            console.log('Felmeddelande:', parsed.error || 'Okänt fel');
          }
        } catch (e) {
          console.log('Raw response:', data);
          console.log('Parse error:', e.message);
        }
        
        resolve();
      });
    });

    req.on('error', (e) => {
      console.error('❌ Request error:', e.message);
      reject(e);
    });

    req.write(postData);
    req.end();
  });
}

testRegistration().catch(console.error);
