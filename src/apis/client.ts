/**
 * Central API client: base URL and global headers for all API requests.
 * Authorization (Bearer token) and X-Organization-Id come from auth store (set after login).
 * Env VITE_ORGANIZATION_ID is only used when no token is present (e.g. before login).
 */

import { authStore } from "@/lib/authStore";

const API_BASE = import.meta.env.VITE_API_BASE ?? "";
const ENV_ORGANIZATION_ID = import.meta.env.VITE_ORGANIZATION_ID ?? "";

export function getApiBaseUrl(): string {
  return API_BASE.replace(/\/$/, "");
}

/** Current organization ID: from logged-in token (decoded JWT) or env fallback. */
export function getOrganizationId(): string {
  return authStore.getOrganizationId() ?? ENV_ORGANIZATION_ID;
}

/** Headers applied to every API request: base URL, Bearer token, X-Organization-Id. */
function getDefaultHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  const token = authStore.getToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  const orgId = authStore.getOrganizationId() ?? ENV_ORGANIZATION_ID;
  if (orgId) {
    headers["X-Organization-Id"] = orgId;
  }
  return headers;
}

export interface ApiRequestInit extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
}

/** API error shape: { Message?, Errors?, message?, error? } */
function getApiErrorMessage(err: Record<string, unknown>, fallback: string): string {
  const msg =
    (typeof err.Message === "string" && err.Message) ||
    (typeof err.message === "string" && err.message) ||
    (typeof err.error === "string" && err.error);
  const errors = Array.isArray(err.Errors)
    ? err.Errors.filter((e): e is string => typeof e === "string")
    : Array.isArray(err.errors)
      ? err.errors.filter((e): e is string => typeof e === "string")
      : [];
  const parts: string[] = [];
  if (msg) parts.push(msg);
  if (errors.length) parts.push(errors.join(" "));
  return parts.length ? parts.join(" — ") : fallback || "Request failed";
}

/**
 * Performs a fetch with base URL and global headers (including X-Organization-Id).
 * All APIs using this client get the same headers; no per-call setup required.
 */
export async function apiRequest<T>(
  path: string,
  options?: ApiRequestInit
): Promise<T> {
  const { params, ...init } = options ?? {};
  const base = getApiBaseUrl();
  const url = new URL(
    path.startsWith("http") ? path : `${base}/${path.replace(/^\//, "")}`,
    window.location.origin
  );
  if (params) {
    Object.entries(params).forEach(([k, v]) => {
      if (v != null && v !== "") url.searchParams.set(k, String(v));
    });
  }
  const headers: HeadersInit = {
    ...getDefaultHeaders(),
    ...(init.headers as Record<string, string>),
  };
  const res = await fetch(url.toString(), { ...init, headers });
  const text = await res.text();
  if (!res.ok) {
    const err = (() => {
      try {
        return (JSON.parse(text) as Record<string, unknown>) || {};
      } catch {
        return {};
      }
    })();
    const message = getApiErrorMessage(err, res.statusText);
    throw new Error(message);
  }
  if (res.status === 204) return undefined as T;
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error("Invalid JSON response");
  }
}
