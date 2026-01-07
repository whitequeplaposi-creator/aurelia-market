// Test admin login with demo mode
const http = require('http');

const testAdminLogin = async () => {
  console.log('🧪 Testing ADMIN login with demo mode...\n');

  const postData = JSON.stringify({
    email: 'admin@demo.com',
    password: 'admin123'
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
        console.log('\n📦 Response Body:');
        
        try {
          const parsed = JSON.parse(data);
          console.log(JSON.stringify(parsed, null, 2));
          
          if (res.statusCode === 200 && parsed.token) {
            console.log('\n✅ ADMIN LOGIN FUNGERAR!');
            console.log('✅ Token mottagen');
            console.log('✅ Användare:', parsed.user.email);
            console.log('✅ Roll:', parsed.user.role);
            
            if (parsed.user.role === 'admin') {
              console.log('✅ Admin-behörighet bekräftad!');
            }
          } else {
            console.log('\n❌ Admin login misslyckades');
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

testAdminLogin().catch(console.error);
