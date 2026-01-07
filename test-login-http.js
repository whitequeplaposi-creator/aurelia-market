async function testLogin() {
  try {
    console.log('Testing login endpoint...\n');
    
    // Test med en test-användare
    const testEmail = 'test@example.com';
    const testPassword = 'test123456';
    
    console.log(`Attempting login with:`);
    console.log(`  Email: ${testEmail}`);
    console.log(`  Password: ${testPassword}\n`);
    
    const response = await fetch('http://localhost:3000/api/auth/login', {
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
    
    console.log(`Response status: ${response.status}`);
    console.log(`Response data:`, JSON.stringify(data, null, 2));
    
    if (response.ok) {
      console.log('\n✅ Login successful!');
    } else {
      console.log('\n❌ Login failed!');
      console.log('Error:', data.error);
    }

  } catch (error) {
    console.error('Test error:', error.message);
  }
}

testLogin();
