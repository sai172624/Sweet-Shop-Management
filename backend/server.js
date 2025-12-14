const mongoose = require('mongoose');
const app = require('./app'); // Imports the logic from your massive app.js
const dotenv = require('dotenv');

dotenv.config();

// Ensure this port matches what your React app is calling (5001)
const PORT = process.env.PORT || 5001; 
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sweet-shop';

console.log('⏳ Connecting to MongoDB...');

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
    
    // Server ONLY starts after DB is ready
    app.listen(PORT, () => {
      console.log('=================================================');
      console.log(`🚀 Server running on: http://localhost:${PORT}`);
      console.log('=================================================');
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err);
    process.exit(1);
  });