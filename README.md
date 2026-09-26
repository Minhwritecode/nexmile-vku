<div align="center">

# 🚌 NexMile — Trợ lý AI Lộ trình Xe buýt Sinh viên VKU

**"Choose smarter. Wait less. Arrive on time."**

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-nexmile--vku.vercel.app-10b981?style=for-the-badge)](https://nexmile-vku.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-Minhwritecode%2Fnexmile--vku-181717?style=for-the-badge&logo=github)](https://github.com/Minhwritecode/nexmile-vku)
[![MongoDB Atlas](https://img.shields.io/badge/MongoDB-Atlas_Cloud-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?style=for-the-badge&logo=vercel)](https://vercel.com)

</div>

---

## 📖 Giới thiệu

**NexMile** là ứng dụng trợ lý AI thông minh hỗ trợ sinh viên **Đại học Công nghệ Thông tin và Truyền thông Việt - Hàn (VKU)** tại Đà Nẵng đưa ra quyết định tốt nhất khi di chuyển bằng xe buýt công cộng trên **Tuyến 06** và **Tuyến 13**.

Ứng dụng tích hợp mô hình AI dự báo thời gian đến, phân tích dữ liệu thời tiết theo giờ, cảnh báo bất thường giao thông theo thời gian thực, và màn hình xác thực người dùng 3D Three.js cao cấp kết nối **MongoDB Atlas**.

> 🏆 **AI for Everyday Life Hackathon 2026** — ĐH Công nghệ Thông tin & TT Việt - Hàn (VKU)

---

## ✨ Tính năng chính

| Tính năng | Mô tả |
|---|---|
| 🤖 **AI Dự báo thông minh** | Thuật toán AI đa tầng dự báo thời gian xe đến dựa trên thời tiết, giao thông, giờ cao điểm |
| 🌤️ **Biểu đồ thời tiết theo giờ** | Hiển thị thay đổi nhiệt độ và điều kiện thời tiết theo giờ trên màn hình Home |
| 🔔 **Cảnh báo bất thường** | Phát hiện và thông báo tắc đường, trễ chuyến, thời tiết xấu theo thời gian thực |
| 📊 **So sánh lộ trình** | So sánh thông minh Tuyến 06 và Tuyến 13, với animation pulse nổi bật "Đề xuất tốt nhất" |
| 🗺️ **Theo dõi chuyến đi** | Bản đồ theo dõi hành trình và vị trí xe buýt mô phỏng GPS |
| 📜 **Lịch sử hành trình** | Lưu trữ và phân tích lịch sử di chuyển cá nhân |
| 🔐 **Xác thực tài khoản 3D** | Đăng nhập / Đăng ký / Quên mật khẩu với animation Three.js đồng bộ trang Splash |
| 🎮 **Demo Tour có hướng dẫn** | Luồng demo tương tác từng bước cho người dùng mới |
| 📱 **Cử chỉ 1 tay Mobile** | Vuốt ngang chuyển tab, bánh xe quay nhanh, phím tắt bàn phím |

---

## 🏗️ Kiến trúc Hệ thống

```
nexmile-vku/
├── 🖥️  src/                    # Frontend React + TypeScript + Vite
│   ├── components/             # UI components (Header, AuthScreen, 3D Splash...)
│   ├── context/                # React Context (SimulationContext, AuthContext)
│   ├── utils/                  # AI Engine, Auth API client
│   ├── types/                  # TypeScript types
│   └── data/                   # Mock data (routes, weather, history)
│
├── ☁️  api/                    # Vercel Serverless Functions (Express-based)
│   ├── index.ts                # Main handler: CORS, MongoDB connect, routes
│   ├── controllers/
│   │   └── authController.ts   # register, login, forgotPassword, resetPassword, getMe
│   └── models/
│       └── User.ts             # Mongoose schema (bcrypt, VKU student ID validation)
│
├── 🖧  server/                  # Standalone Express server (development)
│   └── src/
│       ├── index.ts            # Dev server (port 3001)
│       ├── controllers/        # Auth controllers
│       ├── models/             # User model
│       └── routes/             # API routes
│
├── vercel.json                 # Vercel deployment config (API rewrite rules)
└── vite.config.ts              # Vite + Tailwind + dev proxy
```

---

## 🚀 Chạy Local (Development)

### Yêu cầu
- **Node.js** v18 trở lên
- Tài khoản **MongoDB Atlas** (hoặc MongoDB local)

### 1. Cài đặt dependencies

```bash
# Frontend
npm install --legacy-peer-deps

# Backend
cd server && npm install
```

### 2. Cấu hình biến môi trường

Tạo file `server/.env`:

```env
MONGODB_URI=mongodb+srv://<user>:<password>@cluster0.mongodb.net/nexmile_vku?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_here
JWT_EXPIRES_IN=7d
PORT=3001
```

> 💡 Xem file [`.env.example`](.env.example) để biết thêm chi tiết.

### 3. Khởi chạy

Mở **2 terminal** song song:

```bash
# Terminal 1 — Backend API server
npm run server:dev

# Terminal 2 — Frontend Vite dev server
npm run dev
```

Truy cập: **http://localhost:3000**

---

## 🌐 Deploy lên Vercel

```bash
# Link project (lần đầu)
npx vercel link --project nexmile-vku

# Thêm biến môi trường
npx vercel env add MONGODB_URI production
npx vercel env add JWT_SECRET production

# Deploy production
npx vercel --prod --yes
```

> ⚠️ **Quan trọng với MongoDB Atlas**: Vào [Atlas Network Access](https://cloud.mongodb.com/) → Add IP Address → **Allow Access from Anywhere** (`0.0.0.0/0`) để Vercel Serverless kết nối được.

---

## 🔌 API Endpoints

| Method | Endpoint | Mô tả |
|--------|----------|-------|
| `GET` | `/api/health` | Kiểm tra trạng thái server & MongoDB |
| `POST` | `/api/auth/register` | Đăng ký tài khoản sinh viên VKU |
| `POST` | `/api/auth/login` | Đăng nhập, nhận JWT token |
| `GET` | `/api/auth/me` | Lấy thông tin tài khoản (yêu cầu Bearer token) |
| `POST` | `/api/auth/forgot-password` | Xác minh email tài khoản |
| `POST` | `/api/auth/reset-password` | Đặt lại mật khẩu mới |

---

## 🛠️ Công nghệ sử dụng

**Frontend**
- [React 19](https://react.dev/) + [Vite 8](https://vite.dev/) + TypeScript
- [Tailwind CSS v4](https://tailwindcss.com/)
- [Three.js](https://threejs.org/) — animation 3D trang Splash & Auth
- [Lucide React](https://lucide.dev/) — icon library
- [Recharts](https://recharts.org/) — biểu đồ dữ liệu

**Backend**
- [Express.js](https://expressjs.com/) — REST API framework
- [Mongoose](https://mongoosejs.com/) + [MongoDB Atlas](https://www.mongodb.com/atlas) — cơ sở dữ liệu
- [bcryptjs](https://www.npmjs.com/package/bcryptjs) — mã hóa mật khẩu (12 rounds)
- [JSON Web Token (JWT)](https://jwt.io/) — xác thực stateless

**Deployment**
- [Vercel](https://vercel.com/) — Serverless Functions + Static Frontend
- [GitHub](https://github.com/Minhwritecode/nexmile-vku) — Version control

---

## 👥 Tác giả

<table>
  <tr>
    <td align="center">
      <strong>Đinh Trần Tiến Minh</strong><br/>
      <code>23IT162</code> — Khoa CNTT<br/>
      ĐH VKU Đà Nẵng
    </td>
    <td align="center">
      <strong>Nguyễn Thị Yến Nhi</strong><br/>
      <code>24DM078</code> — Khoa Kỹ thuật số<br/>
      ĐH VKU Đà Nẵng
    </td>
  </tr>
</table>

---

<div align="center">
  <sub>Xây dựng với ❤️ bởi sinh viên VKU • AI for Everyday Life Hackathon 2026</sub>
</div>
