import { createContext, useContext, useState, useCallback, ReactNode } from "react";

export interface User {
  id: number;
  email: string;
  firstName?: string;
  lastName?: string;
  isSafetyDepartment: boolean;
  isDriver: boolean;
  driverId?: number;
  profileImageUrl?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(() => {
    try {
      const stored = localStorage.getItem("drp_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [isLoading, setIsLoading] = useState(false);

  const setUser = useCallback((u: User | null) => {
    setUserState(u);
    if (u) localStorage.setItem("drp_user", JSON.stringify(u));
    else localStorage.removeItem("drp_user");
  }, []);

  /** Demo users when API is not available. Remove or disable when backend is ready. */
  const DEMO_ACCOUNTS = {
    admin: { email: "admin@demo.com", password: "demo123" },
    driver: { email: "driver@demo.com", password: "demo123" },
  } as const;

  const login = useCallback(async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Demo login (no API required)
      if (email === DEMO_ACCOUNTS.admin.email && password === DEMO_ACCOUNTS.admin.password) {
        setUser({
          id: 1,
          email: DEMO_ACCOUNTS.admin.email,
          firstName: "Demo",
          lastName: "Admin",
          isSafetyDepartment: true,
          isDriver: false,
        });
        return;
      }
      if (email === DEMO_ACCOUNTS.driver.email && password === DEMO_ACCOUNTS.driver.password) {
        setUser({
          id: 2,
          email: DEMO_ACCOUNTS.driver.email,
          firstName: "Demo",
          lastName: "Driver",
          isSafetyDepartment: false,
          isDriver: true,
          driverId: 101,
        });
        return;
      }

      const res = await fetch("/api/users/sign_in", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: { email, password } }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Login failed");
      }
      const data = await res.json().catch(() => ({}));
      const u: User = {
        id: data.id ?? 0,
        email: data.email ?? email,
        firstName: data.first_name,
        lastName: data.last_name,
        isSafetyDepartment: !!data.safety_department,
        isDriver: !!data.driver,
        driverId: data.driver_id,
        profileImageUrl: data.profile_image_url,
      };
      setUser(u);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await fetch("/api/users/sign_out", { method: "DELETE" });
    } catch {
      /* ignore */
    }
    setUserState(null);
    localStorage.removeItem("drp_user");
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
