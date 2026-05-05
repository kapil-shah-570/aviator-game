const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const envPath = path.join(__dirname, '..', '..', '.env');
const envExamplePath = path.join(__dirname, '..', '..', '.env.example');

if (!process.env.MONGO_URI) {
  if (fs.existsSync(envPath)) {
    require('dotenv').config({ path: envPath });
  } else if (fs.existsSync(envExamplePath)) {
    require('dotenv').config({ path: envExamplePath });
  }
}

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    throw new Error(
      'MONGO_URI is not set. Create backend/.env from backend/.env.example before starting the server.'
    );
  }

  try {
    await mongoose.connect(mongoUri);
    console.log('MongoDB Connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

module.exports = connectDB;
