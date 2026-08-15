const fs = require('fs');
const bcrypt = require('bcryptjs');

// Manually read the .env file
const envContent = fs.readFileSync('.env', 'utf8');
const lines = envContent.split('\n');
const env = {};

lines.forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length) {
        env[key.trim()] = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
    }
});

const email = env.ADMIN_EMAIL;
const hash = env.ADMIN_PASSWORD_HASH;
const testPassword = 'admin123'; // The password you are trying to log in with

console.log('--- ENV VARIABLES READ FROM FILE ---');
console.log('Email:', email);
console.log('Hash:', hash);

if (!hash || !email) {
  console.error('\n❌ ERROR: Could not find ADMIN_EMAIL or ADMIN_PASSWORD_HASH in your .env file!');
  process.exit(1);
}

console.log('\n--- TESTING BCRYPT ---');
const isMatch = bcrypt.compareSync(testPassword, hash);

if (isMatch) {
  console.log(`✅ SUCCESS: The password "${testPassword}" matches the hash!`);
} else {
  console.log(`❌ FAILED: The password "${testPassword}" does NOT match the hash.`);
}