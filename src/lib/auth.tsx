import { createContext, useContext, useState, useCallback, useEffect, useRef, ReactNode } from "react";
import { login as loginApi, refresh as refreshApi } from "@/apis/services/auth";
import { authStore } from "@/lib/authStore";
import {
  decodeJwt,
  getOrganizationIdFromPayload,
  getEmailFromPayload,
  getRoleFromPayload,
  isTokenExpired,
} from "@/lib/jwt";

export interface User {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  isSafetyDepartment: boolean;
  isDriver: boolean;
  driverId?: number;
  profileImageUrl?: string;
  userId?: string;
  organizationId?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

const USER_STORAGE_KEY = "drp_user";

/** Map API role to app roles (safety vs driver). */
function roleToFlags(role: string): { isSafetyDepartment: boolean; isDriver: boolean } {
  const r = role.toLowerCase();
  if (r === "driver") return { isSafetyDepartment: false, isDriver: true };
  return { isSafetyDepartment: true, isDriver: false };
}

function userFromToken(accessToken: string, email: string): User {
  const payload = decodeJwt(accessToken);
  const orgId = getOrganizationIdFromPayload(payload);
  const role = getRoleFromPayload(payload);
  const { isSafetyDepartment, isDriver } = roleToFlags(role);
  const userId = payload.userId ?? "";
  const numericId = userId ? parseInt(userId.slice(0, 8), 16) || 0 : 0;
  return {
    id: numericId,
    email: getEmailFromPayload(payload) || email,
    isSafetyDepartment,
    isDriver,
    userId,
    organizationId: orgId || undefined,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem(USER_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(true);
  const restoreAttempted = useRef(false);

  const setUser = useCallback((u: User | null) => {
    setUserState(u);
    if (u) localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(u));
    else localStorage.removeItem(USER_STORAGE_KEY);
  }, []);

  useEffect(() => {
    if (!user && authStore.getToken()) {
      authStore.clearAuth();
    }
  }, [user]);

  const login = useCallback(async (email: string, password: string, rememberMe = false) => {
    setIsLoading(true);
    try {
      const res = await loginApi({ email, password });
      const accessToken = res.data?.accessToken;
      if (!accessToken) throw new Error(res.message ?? "Login failed");

      const payload = decodeJwt(accessToken);
      const organizationId = getOrganizationIdFromPayload(payload);
      const refreshToken = rememberMe ? res.data?.refreshToken ?? null : null;
      authStore.setAuth(accessToken, organizationId, refreshToken);

      const u = userFromToken(accessToken, email);
      setUser(u);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    authStore.clearAuth();
    setUserState(null);
    localStorage.removeItem(USER_STORAGE_KEY);
  }, []);

  useEffect(() => {
    if (restoreAttempted.current) return;
    restoreAttempted.current = true;
    const token = authStore.getToken();
    const refreshToken = authStore.getRefreshToken();
    const needsRefresh = !token || isTokenExpired(token);
    if (refreshToken && needsRefresh) {
      setIsLoading(true);
      refreshApi({ refreshToken })
        .then((res) => {
          const accessToken = res.data?.accessToken;
          if (!accessToken) return;
          const payload = decodeJwt(accessToken);
          const organizationId = getOrganizationIdFromPayload(payload);
          const newRefresh = res.data?.refreshToken ?? refreshToken;
          authStore.setAuth(accessToken, organizationId, newRefresh);
          const email = getEmailFromPayload(payload);
          setUserState(userFromToken(accessToken, email));
        })
        .catch(() => {
          authStore.clearAuth();
          setUserState(null);
          localStorage.removeItem(USER_STORAGE_KEY);
        })
        .finally(() => setIsLoading(false));
    } else {
      if (needsRefresh && !refreshToken) {
        authStore.clearAuth();
        setUserState(null);
        localStorage.removeItem(USER_STORAGE_KEY);
      }
      setIsLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    return {
      user: null,
      isLoading: false,
      login: async () => {},
      logout: async () => {},
      setUser: () => {},
    };
  }
  return ctx;
}
