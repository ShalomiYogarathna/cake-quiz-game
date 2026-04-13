import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../services/api";
import useAuth from "./useAuth";

const ROUND_TIME_LIMIT_SECONDS = 60;
const ROUND_TIME_LIMIT_MS = ROUND_TIME_LIMIT_SECONDS * 1000;

function getBananaAnswerError(value) {
  const normalizedAnswer = value.trim();

  if (!normalizedAnswer) {
    return "Enter a number before you submit.";
  }

  if (!/^-?\d+$/.test(normalizedAnswer)) {
    return "Use numbers only for the banana answer.";
  }

  return "";
}

function useQuiz() {
  const navigate = useNavigate();
  const { username, logout } = useAuth();
  const [score, setScore] = useState(0);
  const [roundNumber, setRoundNumber] = useState(1);
  const [hasStarted, setHasStarted] = useState(false);
  const [bananaQuestion, setBananaQuestion] = useState(null);
  const [bananaAnswer, setBananaAnswer] = useState("");
  const [bananaAnswerError, setBananaAnswerError] = useState("");
  const [bananaAnswerTouched, setBananaAnswerTouched] = useState(false);
  const [dessertQuestion, setDessertQuestion] = useState(null);
  const [selectedAnswerId, setSelectedAnswerId] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [isLoadingQuestion, setIsLoadingQuestion] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [timeRemainingMs, setTimeRemainingMs] = useState(ROUND_TIME_LIMIT_MS);

  const isBananaRound = roundNumber === 1;
  const isRoundResolved = Boolean(feedback);
  const activeQuestion = isBananaRound ? bananaQuestion : dessertQuestion;
  const currentSource = bananaQuestion?.source || dessertQuestion?.source || "";

  const loadCurrentRound = useCallback(async () => {
    if (!hasStarted) {
      return;
    }

    setIsLoadingQuestion(true);
    setLoadError("");
    setFeedback("");
    setSelectedAnswerId(null);
    setTimeRemainingMs(ROUND_TIME_LIMIT_MS);

    try {
      if (isBananaRound) {
        const data = await apiRequest("/banana");
        setBananaQuestion(data);
        setBananaAnswer("");
        setBananaAnswerError("");
        setBananaAnswerTouched(false);
        setDessertQuestion(null);
      } else {
        const data = await apiRequest("/dessert-question/random");
        setDessertQuestion(data);
        setBananaQuestion(null);
      }
    } catch (error) {
      console.error("Error loading round:", error);
      setLoadError(
        isBananaRound
          ? "We couldn't load the banana puzzle. Please try again."
          : "We couldn't load the dessert round. Please try again."
      );
    } finally {
      setIsLoadingQuestion(false);
    }
  }, [hasStarted, isBananaRound]);

  useEffect(() => {
    loadCurrentRound();
  }, [loadCurrentRound]);

  useEffect(() => {
    if (!hasStarted || isLoadingQuestion || loadError || isRoundResolved || !activeQuestion) {
      return undefined;
    }

    const deadline = Date.now() + ROUND_TIME_LIMIT_MS;

    const intervalId = window.setInterval(() => {
      const remaining = Math.max(deadline - Date.now(), 0);
      setTimeRemainingMs(remaining);

      if (remaining > 0) {
        return;
      }

      window.clearInterval(intervalId);

      if (isBananaRound && bananaQuestion) {
        setBananaAnswerTouched(true);
        setBananaAnswerError("");
        setFeedback(`Time's up. The correct answer is ${bananaQuestion.solution}.`);
        return;
      }

      setFeedback("Time's up. Choose faster on the next round.");
    }, 100);

    return () => window.clearInterval(intervalId);
  }, [
    activeQuestion,
    bananaQuestion,
    hasStarted,
    isBananaRound,
    isLoadingQuestion,
    isRoundResolved,
    loadError,
  ]);

  const handleBananaAnswerChange = useCallback(
    (value) => {
      if (isRoundResolved) {
        return;
      }

      setBananaAnswer(value);
      const hasInteracted = bananaAnswerTouched || value.trim() !== "";

      if (hasInteracted) {
        setBananaAnswerTouched(true);
        setBananaAnswerError(getBananaAnswerError(value));
      }
    },
    [bananaAnswerTouched, isRoundResolved]
  );

  const handleBananaAnswerBlur = useCallback(() => {
    if (isRoundResolved) {
      return;
    }

    setBananaAnswerTouched(true);
    setBananaAnswerError(getBananaAnswerError(bananaAnswer));
  }, [bananaAnswer, isRoundResolved]);

  const handleBananaSubmit = useCallback(() => {
    if (!bananaQuestion || isRoundResolved || timeRemainingMs <= 0) {
      return;
    }

    setBananaAnswerTouched(true);
    const validationError = getBananaAnswerError(bananaAnswer);

    if (validationError) {
      setBananaAnswerError(validationError);
      setFeedback("");
      return;
    }

    setBananaAnswerError("");
    const parsedAnswer = Number.parseInt(bananaAnswer.trim(), 10);

    if (parsedAnswer === bananaQuestion.solution) {
      setScore((prevScore) => prevScore + 1);
      setFeedback("Correct answer!");
    } else {
      setFeedback(`Wrong answer. The correct answer is ${bananaQuestion.solution}.`);
    }
  }, [bananaAnswer, bananaQuestion, isRoundResolved, timeRemainingMs]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (!hasStarted || !isBananaRound || event.key !== "Enter") {
        return;
      }

      if (document.activeElement?.tagName === "INPUT") {
        handleBananaSubmit();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleBananaSubmit, hasStarted, isBananaRound]);

  const handleDessertAnswerClick = useCallback(
    (answer) => {
      if (selectedAnswerId !== null || isRoundResolved || timeRemainingMs <= 0) {
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
    [isRoundResolved, selectedAnswerId, timeRemainingMs]
  );

  const handleNextRound = useCallback(() => {
    if (isBananaRound) {
      if (!feedback) {
        return;
      }

      setRoundNumber(2);
      return;
    }

    if (!feedback && selectedAnswerId === null) {
      return;
    }

    navigate("/result", {
      state: {
        score,
        totalQuestions: 2,
        username,
      },
    });
  }, [feedback, isBananaRound, navigate, score, selectedAnswerId, username]);

  const handleStartChallenge = useCallback(() => {
    setHasStarted(true);
    setScore(0);
    setRoundNumber(1);
    setFeedback("");
    setLoadError("");
    setTimeRemainingMs(ROUND_TIME_LIMIT_MS);
  }, []);

  const handleLogout = useCallback(async () => {
    setIsLoggingOut(true);

    try {
      await logout(setLoadError);
    } finally {
      setIsLoggingOut(false);
    }
  }, [logout]);

  const timeLeft = Math.max(0, Math.ceil(timeRemainingMs / 1000));
  const timeProgressPercent = Math.max(
    0,
    Math.min(100, (timeRemainingMs / ROUND_TIME_LIMIT_MS) * 100)
  );
  const roundProgressPercent = roundNumber === 1 ? 50 : 100;
  const liveBananaError = bananaAnswerTouched ? bananaAnswerError : "";
  const isBananaAnswerValid =
    bananaAnswer.trim() !== "" && getBananaAnswerError(bananaAnswer) === "";
  const isTimerLow = timeLeft <= 10;
  const canSubmitBanana =
    isBananaRound &&
    !isLoadingQuestion &&
    !loadError &&
    !isRoundResolved &&
    isBananaAnswerValid &&
    timeRemainingMs > 0;
  const canRetryRound = !isLoadingQuestion && Boolean(loadError);
  const canAdvance = Boolean(feedback);

  return {
    score,
    roundNumber,
    hasStarted,
    bananaQuestion,
    bananaAnswer,
    bananaAnswerError: liveBananaError,
    dessertQuestion,
    selectedAnswerId,
    feedback,
    isLoadingQuestion,
    loadError,
    isLoggingOut,
    username,
    timeLeft,
    timeProgressPercent,
    roundProgressPercent,
    currentSource,
    isBananaRound,
    isRoundResolved,
    isTimerLow,
    canSubmitBanana,
    canRetryRound,
    canAdvance,
    setBananaAnswer: handleBananaAnswerChange,
    handleBananaAnswerBlur,
    loadCurrentRound,
    handleBananaSubmit,
    handleDessertAnswerClick,
    handleNextRound,
    handleStartChallenge,
    handleLogout,
  };
}

export default useQuiz;
