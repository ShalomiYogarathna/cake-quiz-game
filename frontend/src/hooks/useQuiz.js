import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest, AuthError } from "../services/api";
import useAuth from "./useAuth";

function useQuiz() {
  const navigate = useNavigate();
  const { username, handleAuthFailure, logout } = useAuth();
  const [score, setScore] = useState(0);
  const [roundNumber, setRoundNumber] = useState(1);
  const [hasStarted, setHasStarted] = useState(false);
  const [bananaQuestion, setBananaQuestion] = useState(null);
  const [bananaAnswer, setBananaAnswer] = useState("");
  const [dessertQuestion, setDessertQuestion] = useState(null);
  const [selectedAnswerId, setSelectedAnswerId] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [isLoadingQuestion, setIsLoadingQuestion] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const loadCurrentRound = useCallback(async () => {
    if (!hasStarted) {
      return;
    }

    setIsLoadingQuestion(true);
    setLoadError("");

    try {
      if (roundNumber === 1) {
        const data = await apiRequest("/banana", { auth: true });
        setBananaQuestion(data);
        setBananaAnswer("");
        setDessertQuestion(null);
      } else {
        const data = await apiRequest("/dessert-question/random", { auth: true });
        setDessertQuestion(data);
        setSelectedAnswerId(null);
        setBananaQuestion(null);
      }

      setFeedback("");
    } catch (error) {
      if (error instanceof AuthError) {
        handleAuthFailure();
        return;
      }

      console.error("Error loading round:", error);
      setLoadError(
        roundNumber === 1
          ? "We couldn't load the banana puzzle. Please try again."
          : "We couldn't load the dessert round. Please try again."
      );
    } finally {
      setIsLoadingQuestion(false);
    }
  }, [handleAuthFailure, hasStarted, roundNumber]);

  useEffect(() => {
    apiRequest("/session-user").catch(() => {
      handleAuthFailure();
    });
  }, [handleAuthFailure]);

  useEffect(() => {
    loadCurrentRound();
  }, [loadCurrentRound]);

  const handleBananaSubmit = useCallback(() => {
    if (!bananaQuestion) {
      return;
    }

    const normalizedAnswer = bananaAnswer.trim();

    if (normalizedAnswer === "") {
      setFeedback("Enter an answer first.");
      return;
    }

    if (!/^-?\d+$/.test(normalizedAnswer)) {
      setFeedback("Use numbers only for the banana answer.");
      return;
    }

    const parsedAnswer = Number.parseInt(normalizedAnswer, 10);

    if (Number.isNaN(parsedAnswer)) {
      setFeedback("Use numbers only for the banana answer.");
      return;
    }

    if (parsedAnswer === bananaQuestion.solution) {
      setScore((prevScore) => prevScore + 1);
      setFeedback("Correct answer!");
    } else {
      setFeedback(`Wrong answer. The correct answer is ${bananaQuestion.solution}.`);
    }
  }, [bananaAnswer, bananaQuestion]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (!hasStarted || roundNumber !== 1 || event.key !== "Enter") {
        return;
      }

      if (document.activeElement?.tagName === "INPUT") {
        handleBananaSubmit();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleBananaSubmit, hasStarted, roundNumber]);

  const handleDessertAnswerClick = useCallback(
    (answer) => {
      if (selectedAnswerId !== null) {
        return;
      }

      setSelectedAnswerId(answer.id);

      if (answer.correct) {
        setScore((prevScore) => prevScore + 1);
        setFeedback("Correct answer!");
      } else {
        setFeedback("Wrong answer!");
      }
    },
    [selectedAnswerId]
  );

  const handleNextRound = useCallback(() => {
    if (roundNumber === 1) {
      if (!feedback) {
        setFeedback("Submit your Banana answer first.");
        return;
      }

      setRoundNumber(2);
      return;
    }

    if (selectedAnswerId === null) {
      setFeedback("Choose an image answer first.");
      return;
    }

    navigate("/result", {
      state: {
        score,
        totalQuestions: 2,
        username,
      },
    });
  }, [feedback, navigate, roundNumber, score, selectedAnswerId, username]);

  const handleStartChallenge = useCallback(() => {
    setHasStarted(true);
    setFeedback("");
    setLoadError("");
  }, []);

  const handleLogout = useCallback(async () => {
    setIsLoggingOut(true);

    try {
      await logout(setLoadError);
    } finally {
      setIsLoggingOut(false);
    }
  }, [logout]);

  return {
    score,
    roundNumber,
    hasStarted,
    bananaQuestion,
    bananaAnswer,
    dessertQuestion,
    selectedAnswerId,
    feedback,
    isLoadingQuestion,
    loadError,
    isLoggingOut,
    username,
    setBananaAnswer,
    loadCurrentRound,
    handleBananaSubmit,
    handleDessertAnswerClick,
    handleNextRound,
    handleStartChallenge,
    handleLogout,
  };
}

export default useQuiz;
