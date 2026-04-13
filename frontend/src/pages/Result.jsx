import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { apiRequest, AuthError, logoutUser } from "../services/api";
import { clearAuthSession } from "../utils/auth";

function Result() {
  const location = useLocation();
  const navigate = useNavigate();
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

  const handleAuthFailure = useCallback(() => {
    clearAuthSession();
    navigate("/login", {
      replace: true,
      state: { authMessage: "Session expired. Please log in again." },
    });
  }, [navigate]);

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

  const handlePlayAgain = () => {
    if (isSavingScore) {
      return;
    }
    navigate("/quiz");
  };

  const handleViewDashboard = () => {
    if (isSavingScore) {
      return;
    }
    navigate("/dashboard");
  };

  const handleBackToLogin = () => {
    if (isSavingScore || isLoggingOut) {
      return;
    }
    navigate("/login");
  };

  const handleLogout = async () => {
    if (isSavingScore) {
      return;
    }

    setIsLoggingOut(true);

    try {
      await logoutUser();
      navigate("/login", {
        replace: true,
        state: { authMessage: "You have been logged out." },
      });
    } catch (error) {
      console.error("Error logging out:", error);
      setFactError("We couldn't log you out cleanly. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="result-shell">
      <div className="result-deco result-deco-strawberry">🍓</div>
      <div className="result-deco result-deco-donut">🍩</div>
      <div className="result-deco result-deco-cupcake">🧁</div>
      <div className="result-mascot" aria-hidden="true">
        👩‍🍳
      </div>

      <div className="result-stage">
        <div className="result-topper">
          <div className="result-topper-cake" />
          <div className="result-topper-banner">
            <span className="result-topper-ribbon result-topper-ribbon-left" />
            <div className="result-topper-label">SWEET RESULT</div>
            <span className="result-topper-ribbon result-topper-ribbon-right" />
          </div>
        </div>

        <div className="result-card">
          <p className="result-kicker">🎉 Challenge Complete</p>
          <h1 className="result-title">Quiz Result</h1>
          <p className="result-subtitle">
            {username}, your cake shop challenge is complete.
          </p>

          <div className="result-score-bubble">
            <span className="result-score-label">Final Score</span>
            <span className="result-score-value">
              {score} / {totalQuestions}
            </span>
          </div>

          <div className="result-message-card">
            <p className="result-message-title">Sweet work, baker!</p>
            <p className="result-message-text">
              You finished the challenge and your score will appear in your player dashboard.
            </p>
            {saveMessage ? <p className="result-message-fact">🍬 {saveMessage}</p> : null}
            {isLoadingFact ? <p className="result-message-fact">🍬 Loading number fact...</p> : null}
            {numberFact ? (
              <p className="result-message-fact">🍬 Sweet number fact: {numberFact}</p>
            ) : null}
            {factError ? <p className="result-message-fact">🍬 {factError}</p> : null}
            {factError ? (
              <button
                type="button"
                onClick={loadNumberFact}
                className="result-link-button"
                disabled={isLoadingFact}
              >
                Retry Number Fact
              </button>
            ) : null}
          </div>

          <div className="result-actions">
            <button
              type="button"
              onClick={handlePlayAgain}
              className="result-primary-button"
              disabled={isSavingScore}
            >
              {isSavingScore ? "Saving..." : "🍰 Play Again"}
            </button>
            <button
              type="button"
              onClick={handleViewDashboard}
              className="result-link-button"
              disabled={isSavingScore}
            >
              View Dashboard
            </button>
            <button
              type="button"
              onClick={handleBackToLogin}
              className="result-link-button"
              disabled={isSavingScore}
            >
              Back to Login
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="result-link-button"
              disabled={isSavingScore || isLoggingOut}
            >
              {isLoggingOut ? "Logging Out..." : "Log Out"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Result;
