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

  const { user, clearUser, handleSessionExpired } = context;

  const redirectToLogin = useCallback(
    (authMessage) => {
      navigate("/login", {
        replace: true,
        state: { authMessage },
      });
    },
    [navigate]
  );

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
    logout,
    redirectToLogin,
    handleSessionExpired,
  };
}

export { useAuth };
export default useAuth;
