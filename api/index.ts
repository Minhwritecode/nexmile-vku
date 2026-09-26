import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import {
  register,
  login,
  forgotPassword,
  resetPassword,
  getMe,
  protect,
} from './controllers/authController.js';

const app = express();

const MONGODB_URI =
  process.env.MONGODB_URI ||
  'mongodb+srv://minhdtt23it_db_user:Uc4pZ3578dLbldvE@cluster0.0yx8pww.mongodb.net/nexmile_vku?retryWrites=true&w=majority&appName=Cluster0';

// Global cached connection for Serverless
let isDbConnected = false;
async function connectDB() {
  if (isDbConnected || mongoose.connection.readyState === 1) {
    return;
  }
  try {
    await mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    });
    isDbConnected = true;
  } catch (err) {
    console.error('MongoDB Atlas Connection Error:', err);
    throw err;
  }
}

// Middleware
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json({ limit: '50kb' }));
app.use(express.urlencoded({ extended: true }));

// Ensure DB connected on every request without crashing if IP not whitelisted
app.use(async (_req, _res, next) => {
  try {
    await connectDB();
  } catch (err) {
    console.warn('MongoDB Atlas connection deferred:', (err as any).message);
  }
  next();
});

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'NexMile VKU Auth API',
    version: '1.0.0',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  });
});

// Auth Routes
app.post('/api/auth/register', register);
app.post('/api/auth/login', login);
app.post('/api/auth/forgot-password', forgotPassword);
app.post('/api/auth/reset-password', resetPassword);
app.get('/api/auth/me', protect, getMe);

export default app;
