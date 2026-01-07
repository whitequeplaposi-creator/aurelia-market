// Test Login Functionality
// Testar både registrering och inloggning

const testEmail = `test${Date.now()}@gmail.com`;
const testPassword = 'testpassword123';
const adminEmail = 'ngabulokana@gmail.com';
const adminPassword = 'a-z, A-Z, 0-9';

console.log('🧪 TESTAR LOGIN-FUNKTIONALITET\n');
console.log('='.repeat(50));

async function testRegistration() {
  console.log('\n📝 TEST 1: Registrera ny användare');
  console.log('Email:', testEmail);
  console.log('Lösenord:', testPassword);
  
  try {
    const response = await fetch('http://localhost:3001/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword,
      }),
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Registrering lyckades!');
      console.log('   Användare:', data.user.email);
      console.log('   Roll:', data.user.role);
      console.log('   Token:', data.token ? 'Genererad ✓' : 'Saknas ✗');
      return true;
    } else {
      console.log('❌ Registrering misslyckades:', data.error);
      return false;
    }
  } catch (error) {
    console.log('❌ Fel vid registrering:', error.message);
    return false;
  }
}

async function testLogin() {
  console.log('\n🔐 TEST 2: Logga in med ny användare');
  console.log('Email:', testEmail);
  
  try {
    const response = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword,
      }),
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Inloggning lyckades!');
      console.log('   Användare:', data.user.email);
      console.log('   Roll:', data.user.role);
      console.log('   Token:', data.token ? 'Genererad ✓' : 'Saknas ✗');
      return true;
    } else {
      console.log('❌ Inloggning misslyckades:', data.error);
      return false;
    }
  } catch (error) {
    console.log('❌ Fel vid inloggning:', error.message);
    return false;
  }
}

async function testAdminLogin() {
  console.log('\n👑 TEST 3: Logga in som admin');
  console.log('Email:', adminEmail);
  
  try {
    const response = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: adminEmail,
        password: adminPassword,
      }),
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Admin-inloggning lyckades!');
      console.log('   Användare:', data.user.email);
      console.log('   Roll:', data.user.role);
      console.log('   Token:', data.token ? 'Genererad ✓' : 'Saknas ✗');
      return true;
    } else {
      console.log('⚠️  Admin-inloggning misslyckades:', data.error);
      console.log('   Detta är OK om admin-användaren inte finns i databasen än');
      console.log('   Kör SQL-kommandona i PRODUKTIONSKLAR-SETUP.md för att skapa admin');
      return false;
    }
  } catch (error) {
    console.log('❌ Fel vid admin-inloggning:', error.message);
    return false;
  }
}

async function testInvalidLogin() {
  console.log('\n🚫 TEST 4: Testa felaktigt lösenord');
  
  try {
    const response = await fetch('http://localhost:3001/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: testEmail,
        password: 'felaktigt-lösenord',
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      console.log('✅ Felaktigt lösenord avvisades korrekt');
      console.log('   Felmeddelande:', data.error);
      return true;
    } else {
      console.log('❌ Felaktigt lösenord accepterades (BUG!)');
      return false;
    }
  } catch (error) {
    console.log('❌ Fel vid test:', error.message);
    return false;
  }
}

async function runAllTests() {
  console.log('Startar tester...\n');
  
  const results = {
    registration: await testRegistration(),
    login: await testLogin(),
    adminLogin: await testAdminLogin(),
    invalidLogin: await testInvalidLogin(),
  };
  
  console.log('\n' + '='.repeat(50));
  console.log('📊 TESTRESULTAT\n');
  console.log('Registrering:', results.registration ? '✅ OK' : '❌ MISSLYCKADES');
  console.log('Inloggning:', results.login ? '✅ OK' : '❌ MISSLYCKADES');
  console.log('Admin-inloggning:', results.adminLogin ? '✅ OK' : '⚠️  Kräver SQL-setup');
  console.log('Felaktigt lösenord:', results.invalidLogin ? '✅ OK' : '❌ MISSLYCKADES');
  
  const allPassed = results.registration && results.login && results.invalidLogin;
  
  console.log('\n' + '='.repeat(50));
  if (allPassed) {
    console.log('✅ ALLA KRITISKA TESTER GODKÄNDA!');
    console.log('\nSystemet fungerar korrekt. Om du inte kan logga in i webbläsaren:');
    console.log('1. Öppna webbläsarens DevTools (F12)');
    console.log('2. Gå till Console-fliken');
    console.log('3. Försök logga in och se vilka fel som visas');
    console.log('4. Kontrollera Network-fliken för API-anrop');
  } else {
    console.log('❌ VISSA TESTER MISSLYCKADES');
    console.log('\nKontrollera:');
    console.log('1. Att servern körs på http://localhost:3001');
    console.log('2. Att DEMO_MODE=false i .env.local');
    console.log('3. Att Turso-databasen är tillgänglig');
  }
  
  console.log('\n📝 NÄSTA STEG:');
  console.log('1. Kör SQL-kommandona i PRODUKTIONSKLAR-SETUP.md för att skapa admin');
  console.log('2. Testa registrera dig på http://localhost:3001/register');
  console.log('3. Testa logga in på http://localhost:3001/login');
  console.log('4. Testa admin-login på http://localhost:3001/admin/login');
}

runAllTests().catch(console.error);
