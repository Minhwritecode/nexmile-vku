// Types for Auth system
export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  studentId?: string;
  faculty?: string;
  homeArea?: string;
  preferredRouteId?: 'route_6' | 'route_13' | 'both';
  avatarColor: string;
  createdAt: string;
}

export interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
  studentId?: string;
  faculty?: string;
  homeArea?: string;
  preferredRouteId?: 'route_6' | 'route_13' | 'both';
}

export interface AuthApiResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: AuthUser;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  email: string;
  newPassword: string;
  confirmPassword?: string;
}

export type AuthMode = 'login' | 'register' | 'forgot' | 'reset';
