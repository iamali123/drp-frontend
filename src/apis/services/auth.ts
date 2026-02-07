/**
 * Auth API service. Login/forgot/reset/refresh use fetch with base URL only (no Bearer).
 * Change-password and send-sms use apiRequest (authenticated).
 */

import { getApiBaseUrl } from "@/apis/client";
import { apiRequest } from "@/apis/client";
import type {
  LoginRequest,
  LoginResponse,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
  RefreshRequest,
  RefreshResponse,
  SendSmsRequest,
  AuthApiResponse,
} from "@/apis/types/auth";

const AUTH_PATH = "api/auth";

function authFetch<T>(suffix: string, init: RequestInit & { body?: object }): Promise<T> {
  const base = getApiBaseUrl();
  const path = suffix.replace(/^\//, "");
  const url = `${base}/${AUTH_PATH}/${path}`;
  const { body, ...rest } = init;
  return fetch(url, {
    ...rest,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(rest.headers as Record<string, string>),
    },
    body: body ? JSON.stringify(body) : undefined,
  }).then(async (res) => {
    const data = (await res.json().catch(() => ({}))) as T & { message?: string };
    if (!res.ok) throw new Error((data as { message?: string }).message ?? "Request failed");
    return data as T;
  });
}

/**
 * POST /api/auth/login — no auth headers.
 */
export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  const data = await authFetch<LoginResponse>("login", {
    method: "POST",
    body: credentials,
  });
  if (!data.succeeded || !data.data?.accessToken) {
    throw new Error(data.message ?? "Invalid login response");
  }
  return data;
}

/**
 * POST /api/auth/forgot-password
 */
export async function forgotPassword(payload: ForgotPasswordRequest): Promise<AuthApiResponse> {
  return authFetch<AuthApiResponse>("forgot-password", { method: "POST", body: payload });
}

/**
 * POST /api/auth/reset-password
 */
export async function resetPassword(payload: ResetPasswordRequest): Promise<AuthApiResponse> {
  return authFetch<AuthApiResponse>("reset-password", { method: "POST", body: payload });
}

/**
 * POST /api/auth/change-password — requires Authorization header (use apiRequest or pass token).
 */
export async function changePassword(payload: ChangePasswordRequest): Promise<AuthApiResponse> {
  return apiRequest<AuthApiResponse>("api/auth/change-password", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

/**
 * POST /api/auth/refresh — no auth headers; body contains refreshToken.
 */
export async function refresh(payload: RefreshRequest): Promise<RefreshResponse> {
  const data = await authFetch<RefreshResponse>("refresh", { method: "POST", body: payload });
  if (!data.succeeded || !data.data?.accessToken) {
    throw new Error(data.message ?? "Refresh failed");
  }
  return data;
}

/**
 * POST /api/auth/send-sms — authenticated.
 */
export async function sendSms(payload: SendSmsRequest): Promise<AuthApiResponse> {
  return apiRequest<AuthApiResponse>("api/auth/send-sms", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
