// Simple test script to verify backend setup
// Run with: node test-setup.js

require('dotenv').config();

console.log('\n🔍 Testing Backend Configuration...\n');

// Test environment variables
console.log('1. Checking Environment Variables:');
console.log('   ✓ PORT:', process.env.PORT || '5000 (default)');
console.log('   ✓ MONGODB_URI:', process.env.MONGODB_URI ? '✓ Set' : '✗ NOT SET');
console.log('   ✓ JWT_SECRET:', process.env.JWT_SECRET ? '✓ Set' : '✗ NOT SET');
console.log('   ✓ FRONTEND_URL:', process.env.FRONTEND_URL || 'http://localhost:3000 (default)');

// Test Node modules
console.log('\n2. Checking Required Modules:');
const modules = [
  'express',
  'mongoose',
  'socket.io',
  'jsonwebtoken',
  'bcryptjs',
  'cors',
  'dotenv'
];

let allModulesInstalled = true;
modules.forEach(mod => {
  try {
    require.resolve(mod);
    console.log(`   ✓ ${mod} installed`);
  } catch (e) {
    console.log(`   ✗ ${mod} NOT INSTALLED`);
    allModulesInstalled = false;
  }
});

// Test MongoDB connection
console.log('\n3. Testing MongoDB Connection:');
if (!process.env.MONGODB_URI) {
  console.log('   ✗ MongoDB URI not configured in .env file');
  console.log('   Please add MONGODB_URI to your .env file');
} else {
  const mongoose = require('mongoose');
  
  mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
      console.log('   ✓ MongoDB connection successful!');
      console.log('   Database:', mongoose.connection.name);
      console.log('\n✅ All tests passed! Backend is ready to start.');
      console.log('\nRun: npm start');
      process.exit(0);
    })
    .catch((error) => {
      console.log('   ✗ MongoDB connection failed');
      console.log('   Error:', error.message);
      console.log('\n❌ Please fix the issues above before starting the server.');
      process.exit(1);
    });
}

// Summary
if (!allModulesInstalled) {
  console.log('\n❌ Some modules are missing. Run: npm install');
  process.exit(1);
}

if (!process.env.MONGODB_URI || !process.env.JWT_SECRET) {
  console.log('\n❌ Environment variables not configured. Copy .env.example to .env and fill in values.');
  process.exit(1);
}
