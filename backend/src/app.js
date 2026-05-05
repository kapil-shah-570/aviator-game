require('dotenv').config();

const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const connectDB = require('./config/db');
const gameState = require('./services/gameState');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const fairnessRoutes = require('./routes/fairness');
const { protect } = require('./middleware/auth');

const app = express();
const server = http.createServer(app);
const FRONTEND_URLS = (process.env.FRONTEND_URL || 'http://localhost:3000')
  .split(',')
  .map((origin) => origin.trim().replace(/\/$/, ''))
  .filter(Boolean);

const corsOptions = {
  origin(origin, callback) {
    if (!origin || FRONTEND_URLS.includes('*') || FRONTEND_URLS.includes(origin.replace(/\/$/, ''))) {
      return callback(null, true);
    }

    return callback(new Error('Not allowed by CORS'));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

const io = new Server(server, {
  cors: {
    origin: FRONTEND_URLS.includes('*') ? '*' : FRONTEND_URLS,
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  const dbConnected = await connectDB();

  // Middleware
  app.use(cors(corsOptions));
  app.use(express.json());

  // Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/admin', adminRoutes);
  app.use('/api/fairness', fairnessRoutes);

  // Socket.io
  require('./socket/gameSocket')(io);

  // Initialize game state
  gameState.init();

  server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    if (!dbConnected) {
      console.warn('MongoDB is not connected. Database-backed routes will fail until the Atlas network access is fixed.');
    }
  });
};

startServer().catch((error) => {
  console.error('Failed to start server:', error.message);
  process.exit(1);
});
