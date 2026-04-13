import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "./auth-context";
import { apiRequest, subscribeToUnauthorized } from "../services/api";

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isAuthResolved, setIsAuthResolved] = useState(false);
  const [authMessage, setAuthMessage] = useState("");
  const hasHandledUnauthorizedRef = useRef(false);

  const clearUser = useCallback(() => {
    setUser(null);
  }, []);

  const handleSessionExpired = useCallback(
    (message = "Session expired. Please log in again.") => {
      clearUser();
      setIsAuthResolved(true);
      setAuthMessage(message);
      hasHandledUnauthorizedRef.current = true;

      navigate("/login", {
        replace: true,
        state: { authMessage: message },
      });
    },
    [clearUser, navigate]
  );

  const refreshAuth = useCallback(async () => {
    try {
      const sessionUser = await apiRequest("/session-user", {
        authFailureBehavior: "ignore",
      });
      setUser(sessionUser);
      setAuthMessage("");
      hasHandledUnauthorizedRef.current = false;
      return sessionUser;
    } catch {
      setUser(null);
      hasHandledUnauthorizedRef.current = false;
      return null;
    } finally {
      setIsAuthResolved(true);
    }
  }, []);

  useEffect(() => {
    refreshAuth();
  }, [refreshAuth]);

  useEffect(() => {
    const unsubscribe = subscribeToUnauthorized((error) => {
      if (hasHandledUnauthorizedRef.current) {
        return;
      }

      handleSessionExpired(error.message);
    });

    return unsubscribe;
  }, [handleSessionExpired]);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isAuthResolved,
      authMessage,
      setUser,
      refreshAuth,
      clearUser,
      handleSessionExpired,
    }),
    [authMessage, clearUser, handleSessionExpired, isAuthResolved, refreshAuth, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
