import { useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/auth-context";
import { logoutUser } from "../services/api";

function useAuth() {
  const context = useContext(AuthContext);
  const navigate = useNavigate();

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }

  const { user, clearUser } = context;

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
    clearUser();
    redirectToLogin("Session expired. Please log in again.");
  }, [clearUser, redirectToLogin]);

  const logout = useCallback(
    async (setError) => {
      try {
        await logoutUser();
        clearUser();
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
    [clearUser, redirectToLogin]
  );

  return {
    ...context,
    username: user?.username || "Player",
    handleAuthFailure,
    logout,
  };
}

export { useAuth };
export default useAuth;
