const bcrypt = require('bcryptjs');

async function generateHash() {
  const password = 'test123456';
  const hash = await bcrypt.hash(password, 10);
  
  console.log('Password:', password);
  console.log('Hash:', hash);
  console.log('\nSQL för att skapa testanvändare:');
  console.log(`INSERT INTO users (email, password_hash, role) VALUES ('test@example.com', '${hash}', 'customer');`);
  
  console.log('\nSQL för att skapa admin:');
  const adminHash = await bcrypt.hash('admin123456', 10);
  console.log(`INSERT INTO users (email, password_hash, role) VALUES ('ngabulokana75@gmail.com', '${adminHash}', 'admin');`);
}

generateHash();
