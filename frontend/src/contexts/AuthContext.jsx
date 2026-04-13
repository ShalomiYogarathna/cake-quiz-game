import { useCallback, useEffect, useMemo, useState } from "react";
import { AuthContext } from "./auth-context";
import { apiRequest } from "../services/api";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isAuthResolved, setIsAuthResolved] = useState(false);

  const refreshAuth = useCallback(async () => {
    try {
      const sessionUser = await apiRequest("/session-user");
      setUser(sessionUser);
      return sessionUser;
    } catch {
      setUser(null);
      return null;
    } finally {
      setIsAuthResolved(true);
    }
  }, []);

  useEffect(() => {
    refreshAuth();
  }, [refreshAuth]);

  const clearUser = useCallback(() => {
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isAuthResolved,
      setUser,
      refreshAuth,
      clearUser,
    }),
    [clearUser, isAuthResolved, refreshAuth, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
