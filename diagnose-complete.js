const http = require('http');

async function makeRequest(path, data) {
  const postData = JSON.stringify(data);
  
  const options = {
    hostname: 'localhost',
    port: 3001,
    path: path,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let responseData = '';

      res.on('data', (chunk) => {
        responseData += chunk;
      });

      res.on('end', () => {
        try {
          const parsed = JSON.parse(responseData);
          resolve({ status: res.statusCode, data: parsed, headers: res.headers });
        } catch (e) {
          resolve({ status: res.statusCode, data: responseData, headers: res.headers, parseError: true });
        }
      });
    });

    req.on('error', (e) => {
      reject(e);
    });

    req.write(postData);
    req.end();
  });
}

async function runDiagnostics() {
  console.log('🔍 KOMPLETT DIAGNOSTIK\n');
  console.log('='.repeat(60));
  
  // Test 1: Registrera ny användare
  console.log('\n📝 TEST 1: Registrera ny användare');
  console.log('-'.repeat(60));
  
  const newEmail = `test${Date.now()}@gmail.com`;
  const newPassword = 'testpassword123';
  
  try {
    const regResult = await makeRequest('/api/auth/register', {
      email: newEmail,
      password: newPassword
    });
    
    console.log('Status:', regResult.status);
    console.log('Content-Type:', regResult.headers['content-type']);
    
    if (regResult.parseError) {
      console.log('❌ PARSE ERROR - Raw response:', regResult.data);
    } else if (regResult.status === 200) {
      console.log('✅ Registrering lyckades!');
      console.log('   Email:', regResult.data.user.email);
      console.log('   Roll:', regResult.data.user.role);
      console.log('   Token:', regResult.data.token ? 'Ja' : 'Nej');
    } else {
      console.log('❌ Registrering misslyckades');
      console.log('   Fel:', regResult.data.error);
    }
  } catch (error) {
    console.log('❌ Request error:', error.message);
  }
  
  // Test 2: Logga in med den nya användaren
  console.log('\n🔐 TEST 2: Logga in med ny användare');
  console.log('-'.repeat(60));
  
  try {
    const loginResult = await makeRequest('/api/auth/login', {
      email: newEmail,
      password: newPassword
    });
    
    console.log('Status:', loginResult.status);
    console.log('Content-Type:', loginResult.headers['content-type']);
    
    if (loginResult.parseError) {
      console.log('❌ PARSE ERROR - Raw response:', loginResult.data);
    } else if (loginResult.status === 200) {
      console.log('✅ Login lyckades!');
      console.log('   Email:', loginResult.data.user.email);
      console.log('   Roll:', loginResult.data.user.role);
      console.log('   Token:', loginResult.data.token ? 'Ja' : 'Nej');
    } else {
      console.log('❌ Login misslyckades');
      console.log('   Fel:', loginResult.data.error);
    }
  } catch (error) {
    console.log('❌ Request error:', error.message);
  }
  
  // Test 3: Logga in med fel lösenord
  console.log('\n🔐 TEST 3: Logga in med fel lösenord');
  console.log('-'.repeat(60));
  
  try {
    const wrongLoginResult = await makeRequest('/api/auth/login', {
      email: newEmail,
      password: 'wrongpassword'
    });
    
    console.log('Status:', wrongLoginResult.status);
    
    if (wrongLoginResult.status === 401) {
      console.log('✅ Korrekt felhantering - Fel lösenord avvisades');
    } else if (wrongLoginResult.status === 200) {
      console.log('❌ SÄKERHETSPROBLEM - Fel lösenord accepterades!');
    } else {
      console.log('⚠️  Oväntat svar:', wrongLoginResult.status);
    }
  } catch (error) {
    console.log('❌ Request error:', error.message);
  }
  
  // Test 4: Registrera admin-användare
  console.log('\n👤 TEST 4: Registrera admin-användare');
  console.log('-'.repeat(60));
  
  const adminEmail = 'ngabulokana@gmail.com';
  const adminPassword = 'a-z, A-Z, 0-9';
  
  try {
    const adminRegResult = await makeRequest('/api/auth/register', {
      email: adminEmail,
      password: adminPassword
    });
    
    console.log('Status:', adminRegResult.status);
    
    if (adminRegResult.status === 200) {
      console.log('✅ Admin registrerad!');
      console.log('   Email:', adminRegResult.data.user.email);
      console.log('   Roll:', adminRegResult.data.user.role);
      
      if (adminRegResult.data.user.role === 'admin') {
        console.log('   ✅ Korrekt roll: admin');
      } else {
        console.log('   ❌ FEL ROLL:', adminRegResult.data.user.role);
      }
    } else if (adminRegResult.status === 400 && adminRegResult.data.error.includes('redan registrerad')) {
      console.log('ℹ️  Admin redan registrerad (OK)');
      
      // Testa login istället
      const adminLoginResult = await makeRequest('/api/auth/login', {
        email: adminEmail,
        password: adminPassword
      });
      
      if (adminLoginResult.status === 200) {
        console.log('✅ Admin login fungerar!');
        console.log('   Roll:', adminLoginResult.data.user.role);
      } else {
        console.log('❌ Admin login misslyckades');
        console.log('   Fel:', adminLoginResult.data.error);
      }
    } else {
      console.log('❌ Admin-registrering misslyckades');
      console.log('   Fel:', adminRegResult.data.error);
    }
  } catch (error) {
    console.log('❌ Request error:', error.message);
  }
  
  console.log('\n' + '='.repeat(60));
  console.log('✅ DIAGNOSTIK KLAR\n');
}

runDiagnostics().catch(console.error);
