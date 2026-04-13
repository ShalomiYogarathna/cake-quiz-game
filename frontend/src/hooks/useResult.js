import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { apiRequest, AuthError } from "../services/api";
import useAuth from "./useAuth";

function useResult() {
  const location = useLocation();
  const navigate = useNavigate();
  const { handleAuthFailure, logout } = useAuth();
  const score = location.state?.score ?? 0;
  const totalQuestions = location.state?.totalQuestions ?? 2;
  const username = location.state?.username ?? "Player";
  const hasSavedScore = useRef(false);
  const [numberFact, setNumberFact] = useState("");
  const [isSavingScore, setIsSavingScore] = useState(false);
  const [saveMessage, setSaveMessage] = useState("");
  const [isLoadingFact, setIsLoadingFact] = useState(false);
  const [factError, setFactError] = useState("");
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    if (hasSavedScore.current) {
      return;
    }

    hasSavedScore.current = true;
    setIsSavingScore(true);
    setSaveMessage("Saving your score...");

    apiRequest("/scores", {
      method: "POST",
      auth: true,
      body: {
        score,
        total_questions: totalQuestions,
      },
    })
      .then(() => {
        setSaveMessage("Score saved to your dashboard.");
      })
      .catch((error) => {
        if (error instanceof AuthError) {
          handleAuthFailure();
          return;
        }

        console.error("Error saving score:", error);
        setSaveMessage("We couldn't save this score. Please try this round again.");
      })
      .finally(() => {
        setIsSavingScore(false);
      });
  }, [handleAuthFailure, score, totalQuestions]);

  const loadNumberFact = useCallback(async () => {
    setIsLoadingFact(true);
    setFactError("");

    try {
      const data = await apiRequest(`/number-fact/${score}`, { auth: true });
      setNumberFact(data.text || "");
    } catch (error) {
      if (error instanceof AuthError) {
        handleAuthFailure();
        return;
      }

      console.error("Error loading number fact:", error);
      setFactError("We couldn't load the number fact right now.");
    } finally {
      setIsLoadingFact(false);
    }
  }, [handleAuthFailure, score]);

  useEffect(() => {
    loadNumberFact();
  }, [loadNumberFact]);

  const handlePlayAgain = useCallback(() => {
    if (isSavingScore) {
      return;
    }

    navigate("/quiz");
  }, [isSavingScore, navigate]);

  const handleViewDashboard = useCallback(() => {
    if (isSavingScore) {
      return;
    }

    navigate("/dashboard");
  }, [isSavingScore, navigate]);

  const handleBackToLogin = useCallback(() => {
    if (isSavingScore || isLoggingOut) {
      return;
    }

    navigate("/login");
  }, [isLoggingOut, isSavingScore, navigate]);

  const handleLogout = useCallback(async () => {
    if (isSavingScore) {
      return;
    }

    setIsLoggingOut(true);

    try {
      await logout(setFactError);
    } finally {
      setIsLoggingOut(false);
    }
  }, [isSavingScore, logout]);

  return {
    score,
    totalQuestions,
    username,
    numberFact,
    isSavingScore,
    saveMessage,
    isLoadingFact,
    factError,
    isLoggingOut,
    loadNumberFact,
    handlePlayAgain,
    handleViewDashboard,
    handleBackToLogin,
    handleLogout,
  };
}

export default useResult;
