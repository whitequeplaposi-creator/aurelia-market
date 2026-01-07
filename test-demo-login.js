// Test login with demo mode
const http = require('http');

const testLogin = async () => {
  console.log('🧪 Testing login with demo mode...\n');

  const postData = JSON.stringify({
    email: 'demo@example.com',
    password: 'demo123'
  });

  const options = {
    hostname: 'localhost',
    port: 3001,
    path: '/api/auth/login',
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
            console.log('\n✅ LOGIN FUNGERAR! Demo mode är aktivt.');
            console.log('✅ Token mottagen:', parsed.token.substring(0, 20) + '...');
            console.log('✅ Användare:', parsed.user.email);
            console.log('✅ Roll:', parsed.user.role);
          } else {
            console.log('\n❌ Login misslyckades');
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
};

// Wait for server to be ready
setTimeout(() => {
  testLogin().catch(console.error);
}, 2000);
