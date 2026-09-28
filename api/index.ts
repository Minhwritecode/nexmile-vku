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
let dbConnectionPromise: Promise<void> | null = null;
async function connectDB() {
  if (isDbConnected || mongoose.connection.readyState === 1) {
    return;
  }
  if (!dbConnectionPromise) {
    dbConnectionPromise = mongoose
      .connect(MONGODB_URI, {
        bufferCommands: false,
        serverSelectionTimeoutMS: 5000,
      })
      .then(() => {
        isDbConnected = true;
      })
      .catch((err) => {
        dbConnectionPromise = null;
        console.error('MongoDB Atlas Connection Error:', err);
        throw err;
      });
  }
  await dbConnectionPromise;
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

// Health is intentionally independent from MongoDB. It is used by the
// frontend as an informational probe and must stay fast during cold starts.
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    service: 'NexMile VKU Auth & FUTA Bus API',
    version: '1.2.0',
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  });
});

// Official FUTA Bus Lines (Phương Trang) & 3 Da Nang Stations endpoints
app.get('/api/futa/stations', (_req, res) => {
  res.json({
    success: true,
    operator: 'Công ty Cổ phần Xe khách Phương Trang (FUTA Bus Lines) • Danabus',
    hotline: '1900 6067',
    officialWebsite: 'https://futabus.vn',
    stations: [
      {
        id: 'station_central',
        name: 'Bến xe Trung tâm Đà Nẵng',
        address: '185 – 201 Tôn Đức Thắng, P. Hòa Minh, Q. Liên Chiểu, TP. Đà Nẵng',
        phone: '02363 786 786',
        hotline: '1900 6067',
        role: 'Bến xe chính & đầu mối điều hành xe buýt Phương Trang (FUTA Bus Lines) tại Đà Nẵng, kết nối Tuyến 06 và Tuyến 13 đến ĐH VKU.',
        connectingRoutes: ['Tuyến 06 (BX Trung Tâm - VKU)', 'Tuyến 13', 'Tuyến nội đô 05, 07, 08, 11, 12'],
      },
      {
        id: 'station_south',
        name: 'Bến xe Phía Nam Đà Nẵng (Đức Long)',
        address: 'Quốc lộ 1A, Xã Hòa Phước, Huyện Hòa Vang, TP. Đà Nẵng',
        phone: '02363 688 888',
        hotline: '1900 6067',
        role: 'Cửa ngõ phía Nam, bến xe trung chuyển FUTA kết nối Đà Nẵng – Quảng Nam (Tam Kỳ, Hội An, Điện Bàn) phục vụ sinh viên VKU.',
        connectingRoutes: ['Tuyến buýt liền kề FUTA Đà Nẵng - Tam Kỳ', 'Tuyến buýt phía Nam'],
      },
      {
        id: 'station_north',
        name: 'Bến xe Phía Bắc Đà Nẵng (Hòa Hiệp Nam)',
        address: 'Đường Nam Cao nối dài giao QL1A, P. Hòa Hiệp Nam, Q. Liên Chiểu, TP. Đà Nẵng',
        phone: '1900 6067',
        hotline: '1900 6067',
        role: 'Cửa ngõ Tây Bắc tiếp giáp đèo Hải Vân và Khu công nghệ cao, trạm trung chuyển xe buýt FUTA kết nối Bách Khoa và VKU.',
        connectingRoutes: ['Tuyến buýt Bắc - Nam nội đô', 'Tuyến xe buýt trợ giá FUTA'],
      },
    ],
  });
});

app.get('/api/futa/routes', (_req, res) => {
  res.json({
    success: true,
    operator: 'FUTA Bus Lines',
    routes: [
      {
        routeId: 'route_13',
        routeNumber: '13',
        routeName: 'Tuyến 13: Bệnh viện Ung Bướu Đà Nẵng ⇄ ĐH CNTT&TT Việt - Hàn (VKU)',
        hotline: '1900 6067',
        studentFareVnd: 5000,
        standardFareVnd: 8000,
        operatingHours: '05:30 – 19:00',
        headwayMinutes: 15,
        fleetCount: 4,
      },
      {
        routeId: 'route_6',
        routeNumber: '06',
        routeName: 'Tuyến 06: Bến xe Trung tâm Đà Nẵng / Sân bay ⇄ ĐH CNTT&TT Việt - Hàn (VKU)',
        hotline: '1900 6067',
        studentFareVnd: 5000,
        standardFareVnd: 8000,
        operatingHours: '05:30 – 19:00',
        headwayMinutes: 20,
        fleetCount: 3,
      },
    ],
  });
});

// Ensure DB connected on every request without crashing if IP not whitelisted
app.use(async (_req, _res, next) => {
  try {
    await connectDB();
  } catch (err) {
    console.warn('MongoDB Atlas connection deferred:', (err as any).message);
  }
  next();
});

// Auth Routes
app.post('/api/auth/register', register);
app.post('/api/auth/login', login);
app.post('/api/auth/forgot-password', forgotPassword);
app.post('/api/auth/reset-password', resetPassword);
app.get('/api/auth/me', protect, getMe);

export default app;
