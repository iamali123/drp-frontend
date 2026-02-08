/**
 * JWT decode for token expiry check only. User and organizationId come from GET /api/users/me.
 */

function decodeJwtPayload(token: string): { exp?: number } {
  const parts = token.trim().split(".");
  if (parts.length !== 3) throw new Error("Invalid JWT format");
  const base64url = parts[1];
  const base64 = base64url.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
  try {
    const json = atob(padded);
    return JSON.parse(json) as { exp?: number };
  } catch {
    throw new Error("Invalid JWT payload");
  }
}

/** True if JWT exp claim is in the past (with 60s buffer). Used for session restore / refresh. */
export function isTokenExpired(token: string): boolean {
  try {
    const payload = decodeJwtPayload(token);
    const exp = payload.exp;
    if (exp == null) return true;
    return Date.now() >= exp * 1000 - 60_000;
  } catch {
    return true;
  }
}
