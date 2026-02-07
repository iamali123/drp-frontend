/**
 * Types for Auth API (login, forgot/reset/change password, refresh, send-sms).
 */

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponseData {
  accessToken: string;
  refreshToken?: string;
}

export interface LoginResponse {
  statusCode: number;
  succeeded: boolean;
  message: string;
  data: LoginResponseData | null;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  token: string;
  newPassword: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface RefreshRequest {
  refreshToken: string;
}

export interface RefreshResponseData {
  accessToken: string;
  refreshToken?: string;
}

export interface RefreshResponse {
  statusCode?: number;
  succeeded?: boolean;
  message?: string;
  data?: RefreshResponseData | null;
}

export interface SendSmsRequest {
  phoneNumber: string;
  message: string;
}

/** Generic API response shape for auth endpoints. */
export interface AuthApiResponse<T = unknown> {
  statusCode?: number;
  succeeded?: boolean;
  message?: string;
  data?: T | null;
  errors?: string[] | null;
}
