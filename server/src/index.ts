import path from 'path';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import authRoutes from './routes/auth';

// Load .env from both local server dir and project root
dotenv.config();
dotenv.config({ path: path.resolve(__dirname, '../../.env') });
dotenv.config({ path: path.resolve(__dirname, '../.env') });

const app = express();
const PORT = process.env.PORT || 3001;
const MONGODB_URI =
  process.env.MONGODB_URI ||
  'mongodb+srv://minhdtt23it_db_user:Uc4pZ3578dLbldvE@cluster0.0yx8pww.mongodb.net/nexmile_vku?retryWrites=true&w=majority&appName=Cluster0';

// Global cached connection for Serverless / Express
let isDbConnected = false;
export const connectDB = async (): Promise<void> => {
  if (isDbConnected || mongoose.connection.readyState === 1) {
    return;
  }
  try {
    await mongoose.connect(MONGODB_URI);
    isDbConnected = true;
    console.log('✅ MongoDB Atlas kết nối thành công!');
  } catch (error) {
    console.error('❌ Lỗi kết nối MongoDB Atlas:', error);
    throw error;
  }
};

// Middleware: ensure DB is connected for every request
app.use(async (_req, _res, next) => {
  try {
    await connectDB();
    next();
  } catch (err) {
    next(err);
  }
});

// Middleware: permissive CORS for local dev and Vercel domains
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

// Routes
app.use('/api/auth', authRoutes);

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

// Only listen on port if running as standalone server (not on Vercel)
if (process.env.VERCEL !== '1' && process.env.NODE_ENV !== 'test') {
  connectDB()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`🚀 NexMile Auth Server chạy tại http://localhost:${PORT}`);
        console.log(`📋 Health check: http://localhost:${PORT}/api/health`);
      });
    })
    .catch((err) => {
      console.error('Không thể khởi động server:', err);
    });
}

export default app;
