/**
 * In-memory + localStorage store for access token, org ID, and refresh token.
 * Refresh token is stored only when "Remember me" is checked; used to restore session.
 * Used by the API client to add Authorization and X-Organization-Id to every request.
 */

const TOKEN_KEY = "drp_access_token";
const ORG_ID_KEY = "drp_organization_id";
const REFRESH_TOKEN_KEY = "drp_refresh_token";

let memoryToken: string | null = null;
let memoryOrgId: string | null = null;
let memoryRefreshToken: string | null = null;

function readStored(): void {
  try {
    memoryToken = localStorage.getItem(TOKEN_KEY);
    memoryOrgId = localStorage.getItem(ORG_ID_KEY);
    memoryRefreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);
  } catch {
    memoryToken = null;
    memoryOrgId = null;
    memoryRefreshToken = null;
  }
}

readStored();

export const authStore = {
  getToken(): string | null {
    return memoryToken;
  },

  getOrganizationId(): string | null {
    return memoryOrgId;
  },

  getRefreshToken(): string | null {
    return memoryRefreshToken;
  },

  setAuth(accessToken: string, organizationId: string, refreshToken?: string | null): void {
    memoryToken = accessToken;
    memoryOrgId = organizationId || null;
    if (refreshToken != null) {
      memoryRefreshToken = refreshToken || null;
    }
    try {
      if (accessToken) localStorage.setItem(TOKEN_KEY, accessToken);
      else localStorage.removeItem(TOKEN_KEY);
      if (organizationId) localStorage.setItem(ORG_ID_KEY, organizationId);
      else localStorage.removeItem(ORG_ID_KEY);
      if (memoryRefreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, memoryRefreshToken);
      else localStorage.removeItem(REFRESH_TOKEN_KEY);
    } catch {
      /* ignore */
    }
  },

  setRefreshToken(refreshToken: string | null): void {
    memoryRefreshToken = refreshToken;
    try {
      if (refreshToken) localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
      else localStorage.removeItem(REFRESH_TOKEN_KEY);
    } catch {
      /* ignore */
    }
  },

  /** Set organization ID only (e.g. for SuperAdmin switching context). Persists to localStorage. */
  setOrganizationId(organizationId: string | null): void {
    memoryOrgId = organizationId;
    try {
      if (organizationId) localStorage.setItem(ORG_ID_KEY, organizationId);
      else localStorage.removeItem(ORG_ID_KEY);
    } catch {
      /* ignore */
    }
  },

  clearAuth(): void {
    memoryToken = null;
    memoryOrgId = null;
    memoryRefreshToken = null;
    try {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(ORG_ID_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    } catch {
      /* ignore */
    }
  },
};
