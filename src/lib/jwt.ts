/**
 * Decode JWT payload without verification (client-side only; server must verify).
 * Used to read organizationId and user claims from the login access token.
 *
 * Expected payload shape (matches backend JWT):
 * - userId, organizationId, exp, iss, aud
 * - "http://schemas.microsoft.com/ws/2008/06/identity/claims/role" (e.g. "SuperAdmin")
 * - "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"
 */

export interface JwtPayload {
  userId?: string;
  organizationId?: string;
  exp?: number;
  iss?: string;
  aud?: string;
  /** Microsoft role claim (e.g. "SuperAdmin", "Admin", "Driver") */
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"?: string;
  /** Microsoft email claim */
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"?: string;
  [key: string]: unknown;
}

export function decodeJwt(token: string): JwtPayload {
  const parts = token.trim().split(".");
  if (parts.length !== 3) throw new Error("Invalid JWT format");
  const base64url = parts[1];
  const base64 = base64url.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
  try {
    const json = atob(padded);
    return JSON.parse(json) as JwtPayload;
  } catch {
    throw new Error("Invalid JWT payload");
  }
}

/** Get organization ID from decoded JWT (used for X-Organization-Id header). */
export function getOrganizationIdFromPayload(payload: JwtPayload): string {
  return payload.organizationId ?? "";
}

/** Get email from decoded JWT (Microsoft claim or fallback). */
export function getEmailFromPayload(payload: JwtPayload): string {
  return (
    payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] ??
    (payload.email as string) ??
    ""
  );
}

/** Get role from decoded JWT (Microsoft claim or fallback). */
export function getRoleFromPayload(payload: JwtPayload): string {
  return (
    payload["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] ??
    (payload.role as string) ??
    ""
  );
}

/** True if JWT exp claim is in the past (with 60s buffer). */
export function isTokenExpired(token: string): boolean {
  try {
    const payload = decodeJwt(token);
    const exp = payload.exp;
    if (exp == null) return true;
    return Date.now() >= (exp * 1000) - 60_000;
  } catch {
    return true;
  }
}
