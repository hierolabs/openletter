import { Navigate, useLocation } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "./AuthContext";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { ready, username } = useAuth();
  const location = useLocation();

  if (!ready) return <div style={{ padding: 24 }}>Loading…</div>;

  if (!username) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <>{children}</>;
}
