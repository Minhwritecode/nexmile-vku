import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { AuthUser, LoginPayload, RegisterPayload, ResetPasswordPayload } from '../types/auth';
import { authApi } from '../utils/authApi';

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  serverConnected: boolean;
  login: (payload: LoginPayload) => Promise<{ success: boolean; message: string }>;
  register: (payload: RegisterPayload) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  forgotPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  resetPassword: (payload: ResetPasswordPayload) => Promise<{ success: boolean; message: string }>;
  refreshAuth: () => Promise<void>;
}

const TOKEN_KEY = 'nexmile_auth_token';
const USER_KEY = 'nexmile_auth_user';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try {
      const savedUser = localStorage.getItem(USER_KEY);
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem(TOKEN_KEY) || null;
  });
  // Authentication is optimistic on boot: a missing session must not wait for
  // the API/DB before the login screen can be displayed.
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [serverConnected, setServerConnected] = useState<boolean>(false);

  // Validate a cached session without blocking the first paint.
  const verifyTokenAndServer = useCallback(async () => {
    const savedToken = localStorage.getItem(TOKEN_KEY);

    // There is nothing to verify for a new/anonymous visitor. In particular,
    // do not block the login screen on a serverless function cold start.
    if (!savedToken) {
      setServerConnected(false);
      setUser(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      // One request is enough. getMe also proves both API and DB availability.
      const res = await authApi.getMe(savedToken);
      setServerConnected(true);
      if (res.success && res.user) {
        setUser(res.user);
        localStorage.setItem(USER_KEY, JSON.stringify(res.user));
      } else {
        // Token invalid or expired
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        setToken(null);
        setUser(null);
      }
    } catch (err) {
      setServerConnected(false);
      console.warn('Auth verification fallback:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    // Validate a cached session in the background. Anonymous visitors render
    // immediately because verifyTokenAndServer exits without a network call.
    void verifyTokenAndServer();

    // Health is informational only and must never gate the first paint.
    void authApi.checkHealth().then(setServerConnected);

    // Re-check server health periodically every 30 seconds
    const interval = setInterval(async () => {
      const ok = await authApi.checkHealth();
      setServerConnected(ok);
    }, 30000);
    return () => clearInterval(interval);
  }, [verifyTokenAndServer]);

  const login = async (payload: LoginPayload): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await authApi.login(payload);
      if (res.success && res.token && res.user) {
        setToken(res.token);
        setUser(res.user);
        localStorage.setItem(TOKEN_KEY, res.token);
        localStorage.setItem(USER_KEY, JSON.stringify(res.user));
        setServerConnected(true);
        return { success: true, message: res.message || 'Đăng nhập thành công!' };
      }
      return { success: false, message: res.message || 'Đăng nhập thất bại.' };
    } catch (err: any) {
      return { 
        success: false, 
        message: 'Không thể kết nối đến máy chủ xác thực. Hãy đảm bảo server backend đang chạy.' 
      };
    }
  };

  const register = async (payload: RegisterPayload): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await authApi.register(payload);
      if (res.success && res.token && res.user) {
        setToken(res.token);
        setUser(res.user);
        localStorage.setItem(TOKEN_KEY, res.token);
        localStorage.setItem(USER_KEY, JSON.stringify(res.user));
        setServerConnected(true);
        return { success: true, message: res.message || 'Đăng ký thành công!' };
      }
      return { success: false, message: res.message || 'Đăng ký thất bại.' };
    } catch (err: any) {
      return { 
        success: false, 
        message: 'Không thể kết nối đến máy chủ MongoDB. Vui lòng thử lại sau.' 
      };
    }
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  };

  const forgotPassword = async (email: string): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await authApi.forgotPassword(email);
      return { success: res.success, message: res.message };
    } catch (err) {
      return { success: false, message: 'Lỗi kết nối máy chủ.' };
    }
  };

  const resetPassword = async (payload: ResetPasswordPayload): Promise<{ success: boolean; message: string }> => {
    try {
      const res = await authApi.resetPassword(payload.email, payload.newPassword, payload.confirmPassword);
      return { success: res.success, message: res.message };
    } catch (err) {
      return { success: false, message: 'Lỗi kết nối máy chủ.' };
    }
  };

  const refreshAuth = async () => {
    await verifyTokenAndServer();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        isLoading,
        serverConnected,
        login,
        register,
        logout,
        forgotPassword,
        resetPassword,
        refreshAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
