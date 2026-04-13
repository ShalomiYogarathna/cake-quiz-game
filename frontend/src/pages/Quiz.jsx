import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest, AuthError, logoutUser } from "../services/api";
import { clearAuthSession, getStoredUsername } from "../utils/auth";
import "./Quiz.css";

function Quiz() {
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
  const navigate = useNavigate();
  const username = getStoredUsername();

  const handleAuthFailure = useCallback(() => {
    clearAuthSession();
    navigate("/login", {
      replace: true,
      state: { authMessage: "Session expired. Please log in again." },
    });
  }, [navigate]);

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

  const handleLogout = async () => {
    setIsLoggingOut(true);

    try {
      await logoutUser();
      navigate("/login", {
        replace: true,
        state: { authMessage: "You have been logged out." },
      });
    } catch (error) {
      console.error("Error logging out:", error);
      setLoadError("We couldn't log you out cleanly. Please try again.");
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleBananaSubmit = useCallback(() => {
    if (!bananaQuestion) {
      return;
    }

    if (bananaAnswer.trim() === "") {
      setFeedback("Enter an answer first.");
      return;
    }

    const parsedAnswer = Number.parseInt(bananaAnswer, 10);

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

  const handleDessertAnswerClick = (answer) => {
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
  };

  const handleNextRound = () => {
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
  };

  const handleStartChallenge = () => {
    setHasStarted(true);
    setFeedback("");
    setLoadError("");
  };

  return (
    <div className="quiz-page">
      <div className="quiz-confetti quiz-confetti-a" aria-hidden="true" />
      <div className="quiz-confetti quiz-confetti-b" aria-hidden="true" />
      <div className="quiz-confetti quiz-confetti-c" aria-hidden="true" />
      <div className="quiz-twinkle quiz-twinkle-a" aria-hidden="true" />
      <div className="quiz-twinkle quiz-twinkle-b" aria-hidden="true" />
      <div className="quiz-twinkle quiz-twinkle-c" aria-hidden="true" />

      {!hasStarted ? (
        <section className="quiz-start-screen">
          <div className="quiz-start-cake-wrap" aria-hidden="true">
            <div className="quiz-start-cake-shadow" />
            <div className="quiz-start-cake">
              <span className="quiz-start-cake-icing" />
              <span className="quiz-start-cake-cherry" />
            </div>
          </div>

          <div className="quiz-start-copy">
            <h1 className="quiz-start-title">
              <span className="quiz-start-title-icon" aria-hidden="true">
                🍌
              </span>
              Cake Shop
              <br />
              Banana Challenge
            </h1>
            <p className="quiz-start-subtitle">
              Ready for today&apos;s sweet puzzle challenge?
            </p>
          </div>

          <button
            type="button"
            className="quiz-start-button"
            onClick={handleStartChallenge}
          >
            Start Challenge
          </button>

          <a className="quiz-start-link" href="#how-to-play">
            How to Play
          </a>

          <div className="quiz-start-howto" id="how-to-play">
            <p>1. Solve the banana puzzle.</p>
            <p>2. Pick the correct dessert image.</p>
            <p>3. Finish with the sweetest score you can.</p>
          </div>
        </section>
      ) : (
        <div className="quiz-deco quiz-deco-strawberry">🍓</div>
      )}
      {hasStarted ? <div className="quiz-deco quiz-deco-donut">🍩</div> : null}
      {hasStarted ? <div className="quiz-deco quiz-deco-cupcake">🧁</div> : null}
      {hasStarted ? (
        <div className="quiz-mascot" aria-hidden="true">
          🍌
        </div>
      ) : null}

      <div className={`quiz-card-modern${hasStarted ? "" : " quiz-card-hidden"}`}>
        <div className="quiz-topper-modern">
          <div className="quiz-topper-cake-modern" />
          <div className="quiz-topper-banner-modern">
            <span className="quiz-topper-ribbon-modern quiz-topper-ribbon-left-modern" />
            <div className="quiz-topper-label-modern">CAKE SHOP BANANA</div>
            <span className="quiz-topper-ribbon-modern quiz-topper-ribbon-right-modern" />
          </div>
        </div>

        <h1 className="quiz-title-modern">🍌 Cake Shop Banana Challenge 🍰</h1>

        <div className="quiz-meta-modern">
          <span className="quiz-badge-modern quiz-badge-player-modern">
            👤 Player: {username || "Guest"}
          </span>
          <span className="quiz-badge-modern quiz-badge-round-modern">
            ⭐ Round {roundNumber} of 2
          </span>
        </div>

        <div className="quiz-actions-modern">
          <button
            type="button"
            className="secondary-btn-modern"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? "Logging Out..." : "Log Out"}
          </button>
        </div>

        {isLoadingQuestion ? (
          <p className="quiz-feedback-modern">Loading your next sweet challenge...</p>
        ) : null}

        {loadError ? (
          <div className="quiz-actions-modern quiz-actions-stack-modern">
            <p className="quiz-feedback-modern">{loadError}</p>
            <button type="button" className="secondary-btn-modern" onClick={loadCurrentRound}>
              Retry Round Load
            </button>
          </div>
        ) : null}

        {roundNumber === 1 && bananaQuestion && !isLoadingQuestion ? (
          <div className="quiz-feature-modern">
            <p className="quiz-subtitle-modern">
              🍌 Solve this banana puzzle to unlock your next sweet order!
            </p>

            <div className="banana-layout-modern">
              <div className="puzzle-box-modern banana-puzzle-box-modern">
                <div className="puzzle-frame-modern">
                  <img
                    // External interoperability source: University Banana API puzzle image.
                    src={bananaQuestion.question}
                    alt="Banana API Puzzle"
                    className="puzzle-image-modern"
                  />
                </div>
              </div>

              <div className="banana-controls-modern">
                <div className="banana-controls-card-modern">
                  <p className="banana-controls-title-modern">Sweet Answer Box</p>

                  <input
                    type="number"
                    placeholder="Enter numeric answer"
                    value={bananaAnswer}
                    onChange={(event) => setBananaAnswer(event.target.value)}
                    className="answer-input-modern"
                  />

                  <button
                    type="button"
                    className="primary-btn-modern"
                    onClick={handleBananaSubmit}
                    disabled={isLoadingQuestion}
                  >
                    Submit Banana Answer
                  </button>

                  {feedback ? (
                    <p className="quiz-feedback-modern banana-feedback-modern">{feedback}</p>
                  ) : null}

                  <button
                    type="button"
                    className="secondary-btn-modern banana-next-btn-modern"
                    onClick={handleNextRound}
                    disabled={isLoadingQuestion}
                  >
                    🧁 Go To Dessert Round
                  </button>

                  <div className="score-box-modern banana-score-box-modern">Score: {score}</div>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {roundNumber === 2 && dessertQuestion && !isLoadingQuestion ? (
          <div className="quiz-feature-modern">
            <p className="quiz-subtitle-modern">🧁 {dessertQuestion.question}</p>

            <div className="puzzle-box-modern">
              <div className="cake-grid-modern">
                {dessertQuestion.answers.map((answer) => (
                  <button
                    key={answer.id}
                    type="button"
                    className={`cake-option-modern${
                      selectedAnswerId === answer.id ? " cake-option-selected-modern" : ""
                    }`}
                    onClick={() => handleDessertAnswerClick(answer)}
                    disabled={isLoadingQuestion}
                  >
                    <img
                      src={answer.image}
                      alt={answer.label}
                      className="cake-option-image-modern"
                    />
                    <span className="cake-option-label-modern">{answer.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : null}

        {roundNumber === 2 && feedback ? <p className="quiz-feedback-modern">{feedback}</p> : null}

        {roundNumber === 2 ? (
          <>
            <div className="quiz-actions-modern">
              <button
                type="button"
                className="secondary-btn-modern"
                onClick={handleNextRound}
                disabled={isLoadingQuestion}
              >
                🎀 Finish Quiz
              </button>
            </div>

            <div className="score-box-modern">Score: {score}</div>
          </>
        ) : null}
      </div>
    </div>
  );
}

export default Quiz;
