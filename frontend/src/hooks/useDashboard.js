import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest, AuthError } from "../services/api";
import useAuth from "./useAuth";

function useDashboard() {
  const navigate = useNavigate();
  const { username: storedUsername, handleAuthFailure, logout } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const loadDashboard = useCallback(async () => {
    setIsLoading(true);

    try {
      const data = await apiRequest("/dashboard", { auth: true });
      setDashboard(data);
      setError("");
    } catch (fetchError) {
      if (fetchError instanceof AuthError) {
        handleAuthFailure();
        return;
      }

      console.error("Error loading dashboard:", fetchError);
      setError("We couldn't load your score history right now.");
    } finally {
      setIsLoading(false);
    }
  }, [handleAuthFailure]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
    loadDashboard();
  }, [loadDashboard]);

  const startQuiz = useCallback(() => {
    navigate("/quiz");
  }, [navigate]);

  const handleLogout = useCallback(async () => {
    setIsLoggingOut(true);

    try {
      await logout(setError);
    } finally {
      setIsLoggingOut(false);
    }
  }, [logout]);

  const formatPlayedAt = useCallback((value) => {
    if (!value) {
      return "";
    }

    const utcDate = new Date(value.replace(" ", "T") + "Z");
    return utcDate.toLocaleString();
  }, []);

  return {
    dashboard,
    error,
    isLoading,
    isLoggingOut,
    loadDashboard,
    startQuiz,
    handleLogout,
    formatPlayedAt,
    username: dashboard?.username || storedUsername,
    stats: dashboard?.stats,
    history: dashboard?.history || [],
  };
}

export default useDashboard;
