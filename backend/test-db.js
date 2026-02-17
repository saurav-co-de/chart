const mongoose = require('mongoose');
try { require('dns').setServers(['8.8.8.8', '8.8.4.4']); } catch (e) { }
require('dotenv').config();

const uri = process.env.MONGODB_URI;
console.log('Testing connection to:', uri.replace(/:([^:@]+)@/, ':****@'));

mongoose.connect(uri)
  .then(() => {
    console.log('Successfully connected to MongoDB!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Connection failed:', err.message);
    if (err.cause) console.error('Cause:', err.cause);
    process.exit(1);
  });
