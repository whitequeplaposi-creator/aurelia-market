const http = require('http');

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

console.log('🔍 Debuggar login-endpoint...\n');
console.log('Skickar förfrågan till: http://localhost:3000/api/auth/login');
console.log('Data:', postData);
console.log('\n---\n');

const req = http.request(options, (res) => {
  console.log('Status Code:', res.statusCode);
  console.log('Headers:', JSON.stringify(res.headers, null, 2));
  console.log('\n---\n');

  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    console.log('Raw Response:', data);
    console.log('\n---\n');
    
    if (data) {
      try {
        const parsed = JSON.parse(data);
        console.log('Parsed Response:', JSON.stringify(parsed, null, 2));
        
        if (res.statusCode === 200) {
          console.log('\n✅ Login lyckades!');
          console.log('User ID:', parsed.user?.id);
          console.log('Email:', parsed.user?.email);
          console.log('Role:', parsed.user?.role);
          console.log('Token:', parsed.token ? 'Finns' : 'Saknas');
        } else {
          console.log('\n❌ Login misslyckades!');
          console.log('Fel:', parsed.error);
        }
      } catch (e) {
        console.log('❌ Kunde inte parsa JSON:', e.message);
      }
    } else {
      console.log('❌ Tomt svar från servern!');
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Anslutningsfel:', error.message);
  console.log('\n⚠️  Kontrollera att:');
  console.log('   1. Servern körs (npm run dev)');
  console.log('   2. Servern lyssnar på port 3000');
  console.log('   3. Ingen brandvägg blockerar anslutningen');
});

req.write(postData);
req.end();
