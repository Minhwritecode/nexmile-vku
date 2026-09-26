import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'nexmile_vku_secret_key_2026_hackathon';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

interface JwtPayload {
  id: string;
  email: string;
}

const generateToken = (id: string, email: string): string => {
  return jwt.sign({ id, email } as JwtPayload, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN,
  } as jwt.SignOptions);
};

// POST /api/auth/register
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { fullName, email, password, studentId, faculty, homeArea, preferredRouteId } = req.body;

    if (!fullName || !email || !password) {
      res.status(400).json({ success: false, message: 'Vui lòng điền đầy đủ họ tên, email và mật khẩu.' });
      return;
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      res.status(409).json({ success: false, message: 'Email này đã được đăng ký. Vui lòng dùng email khác hoặc đăng nhập.' });
      return;
    }

    const colorMap: Record<string, string> = {
      IT: 'emerald', SE: 'teal', AI: 'cyan', DM: 'blue',
      IS: 'violet', KT: 'amber', KH: 'rose', MT: 'orange', OTHER: 'slate',
    };
    const avatarColor = colorMap[faculty] || 'emerald';

    const user = await User.create({
      fullName: fullName.trim(),
      email: email.toLowerCase().trim(),
      password,
      studentId: studentId?.trim() || undefined,
      faculty: faculty || 'IT',
      homeArea: homeArea?.trim() || undefined,
      preferredRouteId: preferredRouteId || 'route_13',
      avatarColor,
    });

    const token = generateToken(user._id.toString(), user.email);

    res.status(201).json({
      success: true,
      message: `Chào mừng ${user.fullName} đến với NexMile VKU!`,
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        studentId: user.studentId,
        faculty: user.faculty,
        homeArea: user.homeArea,
        preferredRouteId: user.preferredRouteId,
        avatarColor: user.avatarColor,
        createdAt: user.createdAt,
      },
    });
  } catch (error: any) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e: any) => e.message);
      res.status(400).json({ success: false, message: messages[0] });
      return;
    }
    console.error('Register error:', error);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ. Vui lòng thử lại sau.' });
  }
};

// POST /api/auth/login
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Vui lòng nhập email và mật khẩu.' });
      return;
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      res.status(401).json({ success: false, message: 'Email hoặc mật khẩu không đúng.' });
      return;
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      res.status(401).json({ success: false, message: 'Email hoặc mật khẩu không đúng.' });
      return;
    }

    const token = generateToken(user._id.toString(), user.email);

    res.status(200).json({
      success: true,
      message: `Đăng nhập thành công! Chào ${user.fullName}.`,
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        studentId: user.studentId,
        faculty: user.faculty,
        homeArea: user.homeArea,
        preferredRouteId: user.preferredRouteId,
        avatarColor: user.avatarColor,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ. Vui lòng thử lại sau.' });
  }
};

// POST /api/auth/forgot-password
export const forgotPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email } = req.body;
    if (!email) {
      res.status(400).json({ success: false, message: 'Vui lòng cung cấp email của bạn.' });
      return;
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      res.status(404).json({ success: false, message: 'Không tìm thấy tài khoản với email này.' });
      return;
    }

    res.status(200).json({
      success: true,
      message: `Đã xác minh tài khoản của ${user.fullName}. Bạn có thể đặt lại mật khẩu ngay bây giờ.`,
      email: user.email,
    });
  } catch (error) {
    console.error('ForgotPassword error:', error);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ. Vui lòng thử lại sau.' });
  }
};

// POST /api/auth/reset-password
export const resetPassword = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, newPassword, confirmPassword } = req.body;

    if (!email || !newPassword) {
      res.status(400).json({ success: false, message: 'Vui lòng cung cấp email và mật khẩu mới.' });
      return;
    }

    if (newPassword.length < 6) {
      res.status(400).json({ success: false, message: 'Mật khẩu mới phải có ít nhất 6 ký tự.' });
      return;
    }

    if (confirmPassword && newPassword !== confirmPassword) {
      res.status(400).json({ success: false, message: 'Mật khẩu xác nhận không khớp.' });
      return;
    }

    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      res.status(404).json({ success: false, message: 'Không tìm thấy người dùng với email này.' });
      return;
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Mật khẩu đã được đặt lại thành công! Bạn có thể đăng nhập ngay.',
    });
  } catch (error) {
    console.error('ResetPassword error:', error);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ. Vui lòng thử lại sau.' });
  }
};

// GET /api/auth/me
export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findById((req as any).user?.id);
    if (!user) {
      res.status(404).json({ success: false, message: 'Không tìm thấy người dùng.' });
      return;
    }
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        studentId: user.studentId,
        faculty: user.faculty,
        homeArea: user.homeArea,
        preferredRouteId: user.preferredRouteId,
        avatarColor: user.avatarColor,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error('GetMe error:', error);
    res.status(500).json({ success: false, message: 'Lỗi máy chủ.' });
  }
};

// Protect middleware
export const protect = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ success: false, message: 'Chưa xác thực. Vui lòng đăng nhập.' });
      return;
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    (req as any).user = { id: decoded.id, email: decoded.email };
    next();
  } catch {
    res.status(401).json({ success: false, message: 'Token không hợp lệ hoặc đã hết hạn.' });
  }
};
