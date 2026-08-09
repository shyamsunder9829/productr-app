const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5000;
let databaseReady = false;
const allowedOrigins = [
  'http://localhost:3000',
  'https://productr-app.netlify.app',
  process.env.CORS_ORIGINS,
  process.env.CLIENT_ORIGINS
]
  .filter(Boolean)
  .join(',')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    callback(new Error(`CORS blocked origin: ${origin}`));
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const requireDatabase = (req, res, next) => {
  if (!databaseReady) {
    return res.status(503).json({
      success: false,
      message: 'Database unavailable. Start MongoDB and try again.'
    });
  }
  next();
};

app.use('/api/auth', requireDatabase, require('./routes/auth'));
app.use('/api/products', requireDatabase, require('./routes/products'));

app.get('/api/health', (req, res) => {
  res.status(databaseReady ? 200 : 503).json({
    status: databaseReady ? 'OK' : 'DEGRADED',
    database: databaseReady ? 'connected' : 'disconnected',
    message: 'Productr API is running'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/productr', {
      serverSelectionTimeoutMS: 5000
    });
    databaseReady = true;
    console.log('✅ MongoDB Connected');
  } catch (err) {
    databaseReady = false;
    console.error('❌ MongoDB connection error:', err.message);
    console.error('Check MONGODB_URI, Atlas network access, and database credentials. Retrying in 5 seconds...');
    setTimeout(connectToDatabase, 5000);
  }
};

connectToDatabase();