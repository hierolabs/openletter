import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { api, tokenStore } from "../lib/api";

type AuthState = {
  ready: boolean;
  username: string | null;
  isSuperAdmin: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthState | null>(null);

type LoginResponse = { token: string; username: string; is_super_admin: boolean };
type MeResponse = { username: string; is_super_admin: boolean };

export function AuthProvider({ children }: { children: ReactNode }) {
  const [username, setUsername] = useState<string | null>(null);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const token = tokenStore.get();
    if (!token) {
      setReady(true);
      return;
    }
    api<MeResponse>("/auth/me")
      .then((me) => {
        setUsername(me.username);
        setIsSuperAdmin(me.is_super_admin);
      })
      .catch(() => {
        tokenStore.clear();
      })
      .finally(() => setReady(true));
  }, []);

  const value = useMemo<AuthState>(
    () => ({
      ready,
      username,
      isSuperAdmin,
      async login(u, p) {
        const res = await api<LoginResponse>("/auth/login", {
          method: "POST",
          body: JSON.stringify({ username: u, password: p }),
        });
        tokenStore.set(res.token);
        setUsername(res.username);
        setIsSuperAdmin(res.is_super_admin);
      },
      logout() {
        tokenStore.clear();
        setUsername(null);
        setIsSuperAdmin(false);
      },
    }),
    [ready, username, isSuperAdmin],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
