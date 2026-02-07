/**
 * Central API client: base URL and global headers for all API requests.
 * X-Organization-Id is set globally from VITE_ORGANIZATION_ID — no per-API configuration needed.
 */

const API_BASE = import.meta.env.VITE_API_BASE ?? "";
const ORGANIZATION_ID = import.meta.env.VITE_ORGANIZATION_ID ?? "";

export function getApiBaseUrl(): string {
  return API_BASE.replace(/\/$/, "");
}

export function getOrganizationId(): string {
  return ORGANIZATION_ID;
}

/** Headers applied to every API request (base URL + org context). Add new global headers here. */
function getDefaultHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Accept: "application/json",
  };
  if (ORGANIZATION_ID) {
    headers["X-Organization-Id"] = ORGANIZATION_ID;
  }
  return headers;
}

export interface ApiRequestInit extends RequestInit {
  params?: Record<string, string | number | boolean | undefined>;
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
  if (!res.ok) {
    const err = await res.json().catch(() => ({ message: res.statusText }));
    const message =
      (err as { message?: string }).message ??
      (err as { error?: string }).error ??
      "Request failed";
    throw new Error(message);
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}
