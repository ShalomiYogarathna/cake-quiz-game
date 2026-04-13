<<<<<<< HEAD
import { useContext } from "react";
import { AuthContext } from "../contexts/auth-context";

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }

  return context;
}
=======
import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { logoutUser } from "../services/api";
import { clearAuthSession, getStoredUsername } from "../utils/auth";

function useAuth() {
  const navigate = useNavigate();
  const username = getStoredUsername();

  const redirectToLogin = useCallback(
    (authMessage) => {
      navigate("/login", {
        replace: true,
        state: { authMessage },
      });
    },
    [navigate]
  );

  const handleAuthFailure = useCallback(() => {
    clearAuthSession();
    redirectToLogin("Session expired. Please log in again.");
  }, [redirectToLogin]);

  const logout = useCallback(
    async (setError) => {
      try {
        await logoutUser();
        redirectToLogin("You have been logged out.");
        return true;
      } catch (error) {
        console.error("Error logging out:", error);

        if (setError) {
          setError("We couldn't log you out cleanly. Please try again.");
        }

        return false;
      }
    },
    [redirectToLogin]
  );

  return {
    username,
    handleAuthFailure,
    logout,
  };
}

export default useAuth;
>>>>>>> codex/refactor-auth-modularity
