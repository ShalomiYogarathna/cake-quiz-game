import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
<<<<<<< Updated upstream
=======
import { apiRequest, AuthError, logoutUser } from "../services/api";
import { useAuth } from "../hooks/useAuth";
>>>>>>> Stashed changes
import "./Quiz.css";

const ROUND_TIME_LIMIT = 30;

function Quiz() {
  const [score, setScore] = useState(0);
  const [roundNumber, setRoundNumber] = useState(1);
  const [hasStarted, setHasStarted] = useState(false);
  const [bananaQuestion, setBananaQuestion] = useState(null);
  const [bananaAnswer, setBananaAnswer] = useState("");
  const [bananaAnswerError, setBananaAnswerError] = useState("");
  const [dessertQuestion, setDessertQuestion] = useState(null);
  const [selectedAnswerId, setSelectedAnswerId] = useState(null);
  const [feedback, setFeedback] = useState("");
<<<<<<< Updated upstream
  const navigate = useNavigate();
  const token = localStorage.getItem("cake_quiz_token");
  const username = localStorage.getItem("cake_quiz_username");

  const handleAuthFailure = () => {
  localStorage.removeItem("cake_quiz_token");
  localStorage.removeItem("cake_quiz_username");
  navigate("/login", {
    state: { authMessage: "Session expired. Please log in again." },
  });
};
=======
  const [isLoadingQuestion, setIsLoadingQuestion] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [timeLeft, setTimeLeft] = useState(ROUND_TIME_LIMIT);
  const navigate = useNavigate();
  const { user, clearUser } = useAuth();
  const username = user?.username || "Player";

  const handleAuthFailure = useCallback(() => {
    clearUser();
    navigate("/login", {
      replace: true,
      state: { authMessage: "Session expired. Please log in again." },
    });
  }, [clearUser, navigate]);
>>>>>>> Stashed changes


    useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

<<<<<<< Updated upstream
    fetch("http://localhost:8000/session-user", {
      credentials: "include",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("No active session");
        }
        return response.json();
      })
            .catch(() => {
        handleAuthFailure();
      });

  }, [navigate, token]);


  useEffect(() => {
    if (!token || !hasStarted) {
      return;
    }

    if (roundNumber === 1) {
      fetch("http://localhost:8000/banana", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(response.status === 401 ? "AUTH" : "BANANA_LOAD");
          }
          return response.json();
        })
        .then((data) => {
          setBananaQuestion(data);
          setBananaAnswer("");
          setFeedback("");
        })
        .catch((error) => {
          if (error.message === "AUTH") {
            handleAuthFailure();
            return;
          }
          console.error("Error loading Banana round:", error);
          setFeedback("We couldn't load the banana puzzle. Please try again.");
        });
      return;
    }

    fetch("http://localhost:8000/dessert-question/random", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(response.status === 401 ? "AUTH" : "DESSERT_LOAD");
        }
        return response.json();
      })
      .then((data) => {
        setDessertQuestion(data);
        setSelectedAnswerId(null);
        setFeedback("");
      })
      .catch((error) => {
        if (error.message === "AUTH") {
          handleAuthFailure();
          return;
        }
        console.error("Error loading dessert round:", error);
        setFeedback("We couldn't load the dessert round. Please try again.");
=======
    setIsLoadingQuestion(true);
    setLoadError("");
    setTimeLeft(ROUND_TIME_LIMIT);

    try {
      if (roundNumber === 1) {
        const data = await apiRequest("/banana");
        setBananaQuestion(data);
        setBananaAnswer("");
        setBananaAnswerError("");
        setDessertQuestion(null);
      } else {
        const data = await apiRequest("/dessert-question/random");
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

  const handleBananaSubmit = useCallback(() => {
    if (!bananaQuestion) {
      return;
    }

    if (bananaAnswer.trim() === "") {
      setBananaAnswerError("Enter a number before you submit.");
      setFeedback("");
      return;
    }

    const parsedAnswer = Number.parseInt(bananaAnswer, 10);

    if (Number.isNaN(parsedAnswer)) {
      setBananaAnswerError("Use numbers only for the banana answer.");
      setFeedback("");
      return;
    }

    setBananaAnswerError("");

    if (parsedAnswer === bananaQuestion.solution) {
      setScore((prevScore) => prevScore + 1);
      setFeedback("Correct answer!");
    } else {
      setFeedback(`Wrong answer. The correct answer is ${bananaQuestion.solution}.`);
    }
  }, [bananaAnswer, bananaQuestion]);

  useEffect(() => {
    loadCurrentRound();
  }, [loadCurrentRound]);

  useEffect(() => {
    if (!hasStarted || isLoadingQuestion || loadError || feedback) {
      return undefined;
    }

    const intervalId = window.setInterval(() => {
      setTimeLeft((currentTime) => {
        if (currentTime <= 1) {
          window.clearInterval(intervalId);

          if (roundNumber === 1 && bananaQuestion) {
            setFeedback(`Time's up. The correct answer is ${bananaQuestion.solution}.`);
          } else if (roundNumber === 2) {
            setFeedback("Time's up. Choose faster on the next round.");
          }

          return 0;
        }

        return currentTime - 1;
      });
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [bananaQuestion, feedback, hasStarted, isLoadingQuestion, loadError, roundNumber]);

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
      clearUser();
      navigate("/login", {
        replace: true,
        state: { authMessage: "You have been logged out." },
>>>>>>> Stashed changes
      });
  }, [hasStarted, roundNumber, token]);

<<<<<<< Updated upstream
  const handleBananaSubmit = () => {
    if (!bananaQuestion) {
      return;
    }

    if (bananaAnswer.trim() === "") {
      setFeedback("Enter an answer first.");
      return;
    }

    const parsedAnswer = Number.parseInt(bananaAnswer, 10);

    if (parsedAnswer === bananaQuestion.solution) {
      setScore((prevScore) => prevScore + 1);
      setFeedback("Correct answer!");
    } else {
      setFeedback(`Wrong answer. The correct answer is ${bananaQuestion.solution}.`);
    }
  };

=======
>>>>>>> Stashed changes
  const handleDessertAnswerClick = (answer) => {
    if (selectedAnswerId !== null || feedback || timeLeft === 0) {
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

    if (selectedAnswerId === null && !feedback) {
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
<<<<<<< Updated upstream
=======
    setLoadError("");
    setTimeLeft(ROUND_TIME_LIMIT);
>>>>>>> Stashed changes
  };

  const progressPercent = hasStarted ? (roundNumber / 2) * 100 : 0;
  const timerPercent = (timeLeft / ROUND_TIME_LIMIT) * 100;
  const currentSource = bananaQuestion?.source || dessertQuestion?.source || "";

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

          <button type="button" className="quiz-start-button" onClick={handleStartChallenge}>
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
      {hasStarted ? <div className="quiz-mascot" aria-hidden="true">🍌</div> : null}

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
            👤 Player: {username}
          </span>
          <span className="quiz-badge-modern quiz-badge-round-modern">
            ⭐ Round {roundNumber} of 2
          </span>
          {currentSource ? (
            <span className="quiz-badge-modern quiz-badge-source-modern">Source: {currentSource}</span>
          ) : null}
        </div>

        <div className="quiz-progress-wrap">
          <div className="quiz-progress-labels">
            <span>Challenge Progress</span>
            <span>{progressPercent}%</span>
          </div>
          <div className="quiz-progress-bar">
            <span className="quiz-progress-fill" style={{ width: `${progressPercent}%` }} />
          </div>
          <div className="quiz-progress-labels">
            <span>Round Timer</span>
            <span>{timeLeft}s</span>
          </div>
          <div className="quiz-progress-bar quiz-progress-timer">
            <span className="quiz-progress-fill quiz-progress-fill-timer" style={{ width: `${timerPercent}%` }} />
          </div>
        </div>

        {roundNumber === 1 && bananaQuestion ? (
          <>
            <div className="quiz-feature-modern">
              <p className="quiz-subtitle-modern">
                🍌 Solve this banana puzzle to unlock your next sweet order!
              </p>

<<<<<<< Updated upstream
              <div className="banana-layout-modern">
                <div className="puzzle-box-modern banana-puzzle-box-modern">
                  <div className="puzzle-frame-modern">
=======
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
                    onChange={(event) => {
                      setBananaAnswer(event.target.value);
                      setBananaAnswerError(
                        event.target.value && !/^-?\d+$/.test(event.target.value)
                          ? "Use numbers only for the banana answer."
                          : ""
                      );
                    }}
                    className="answer-input-modern"
                  />

                  {bananaAnswerError ? (
                    <p className="quiz-feedback-modern banana-feedback-modern">{bananaAnswerError}</p>
                  ) : null}

                  <button
                    type="button"
                    className="primary-btn-modern"
                    onClick={handleBananaSubmit}
                    disabled={isLoadingQuestion || timeLeft === 0}
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
                    disabled={isLoadingQuestion || timeLeft === 0 || Boolean(feedback)}
                  >
>>>>>>> Stashed changes
                    <img
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
                      onChange={(e) => setBananaAnswer(e.target.value)}
                      className="answer-input-modern"
                    />

                    <button
                      type="button"
                      className="primary-btn-modern"
                      onClick={handleBananaSubmit}
                    >
                      Submit Banana Answer
                    </button>

                    {feedback ? <p className="quiz-feedback-modern banana-feedback-modern">{feedback}</p> : null}

                    <button
                      type="button"
                      className="secondary-btn-modern banana-next-btn-modern"
                      onClick={handleNextRound}
                    >
                      🧁 Go To Dessert Round
                    </button>

                    <div className="score-box-modern banana-score-box-modern">Score: {score}</div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : null}

        {roundNumber === 2 && dessertQuestion ? (
          <>
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
          </>
        ) : null}

        {roundNumber === 2 && feedback ? <p className="quiz-feedback-modern">{feedback}</p> : null}

        {roundNumber === 2 ? (
          <>
            <div className="quiz-actions-modern">
              <button type="button" className="secondary-btn-modern" onClick={handleNextRound}>
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
