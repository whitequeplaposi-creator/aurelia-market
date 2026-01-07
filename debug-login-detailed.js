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

console.log('🔍 Testar login-endpoint i detalj...\n');
console.log('📤 Request:');
console.log('  URL: http://localhost:3000/api/auth/login');
console.log('  Method: POST');
console.log('  Body:', postData);
console.log('');

const req = http.request(options, (res) => {
  console.log('📥 Response:');
  console.log('  Status:', res.statusCode, res.statusMessage);
  console.log('  Headers:', JSON.stringify(res.headers, null, 2));
  console.log('');

  let data = '';
  let chunks = [];

  res.on('data', (chunk) => {
    chunks.push(chunk);
    data += chunk;
  });

  res.on('end', () => {
    console.log('📄 Raw Response Data:');
    console.log('  Length:', data.length, 'bytes');
    console.log('  First 200 chars:', data.substring(0, 200));
    console.log('');

    if (data.trim() === '') {
      console.log('❌ PROBLEM: Tomt svar från servern!');
      return;
    }

    try {
      const parsed = JSON.parse(data);
      console.log('✅ JSON Parse Success!');
      console.log('  Parsed data:', JSON.stringify(parsed, null, 2));
      
      if (res.statusCode === 200) {
        console.log('\n✅ Login lyckades!');
        console.log('  User ID:', parsed.user?.id);
        console.log('  Email:', parsed.user?.email);
        console.log('  Role:', parsed.user?.role);
        console.log('  Token length:', parsed.token?.length);
      } else {
        console.log('\n❌ Login misslyckades!');
        console.log('  Error:', parsed.error);
      }
    } catch (error) {
      console.log('❌ JSON Parse Error:', error.message);
      console.log('  Raw data:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Request Error:', error.message);
  console.log('\n⚠️  Kontrollera att:');
  console.log('  1. Servern körs (npm run dev)');
  console.log('  2. Servern lyssnar på port 3000');
  console.log('  3. Ingen firewall blockerar anslutningen');
});

req.write(postData);
req.end();
