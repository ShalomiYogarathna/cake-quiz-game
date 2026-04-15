import { useEffect, useState } from "react";
import useQuiz from "../hooks/useQuiz";
import "./Quiz.css";

function Quiz() {
  const {
    score,
    roundNumber,
    hasStarted,
    bananaQuestion,
    bananaAnswer,
    bananaAnswerError,
    dessertQuestion,
    selectedAnswerId,
    revealedDessertAnswer,
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
    setBananaAnswer,
    handleBananaAnswerBlur,
    loadCurrentRound,
    handleBananaSubmit,
    handleDessertAnswerClick,
    handleCloseDessertReveal,
    handleNextRound,
    handleStartChallenge,
    handleLogout,
  } = useQuiz();
  const [activeDessertIndex, setActiveDessertIndex] = useState(0);
  const dessertAnswers = dessertQuestion?.answers ?? [];
  const activeDessertAnswer =
    dessertAnswers.length > 0 ? dessertAnswers[activeDessertIndex] : null;

  useEffect(() => {
    setActiveDessertIndex(0);
  }, [dessertQuestion?.question]);

  const handleDessertSlideChange = (direction) => {
    if (dessertAnswers.length <= 1) {
      return;
    }

    setActiveDessertIndex((currentIndex) => {
      const nextIndex = currentIndex + direction;

      if (nextIndex < 0) {
        return dessertAnswers.length - 1;
      }

      if (nextIndex >= dessertAnswers.length) {
        return 0;
      }

      return nextIndex;
    });
  };

  if (!hasStarted) {
    return (
      <div className="quiz-page">
        <div className="quiz-confetti quiz-confetti-a" aria-hidden="true" />
        <div className="quiz-confetti quiz-confetti-b" aria-hidden="true" />
        <div className="quiz-confetti quiz-confetti-c" aria-hidden="true" />
        <div className="quiz-twinkle quiz-twinkle-a" aria-hidden="true" />
        <div className="quiz-twinkle quiz-twinkle-b" aria-hidden="true" />
        <div className="quiz-twinkle quiz-twinkle-c" aria-hidden="true" />
        <div className="quiz-start-orbit quiz-start-orbit-a" aria-hidden="true">
          <span>🧁</span>
        </div>
        <div className="quiz-start-orbit quiz-start-orbit-b" aria-hidden="true">
          <span>🍩</span>
        </div>
        <div className="quiz-start-orbit quiz-start-orbit-c" aria-hidden="true">
          <span>🍓</span>
        </div>
        <div className="quiz-start-orbit quiz-start-orbit-d" aria-hidden="true">
          <span>🍰</span>
        </div>
        <div className="quiz-start-swish quiz-start-swish-a" aria-hidden="true" />
        <div className="quiz-start-swish quiz-start-swish-b" aria-hidden="true" />

        <section className="quiz-start-screen">
          <div className="quiz-start-stage">
            <div className="quiz-start-badge">Sugar Rush Mode</div>

            <div className="quiz-start-hero-icon-wrap" aria-hidden="true">
              <div className="quiz-start-hero-icon-glow" />
              <div className="quiz-start-hero-icon">🎂</div>
              <div className="quiz-start-hero-mini quiz-start-hero-mini-left">🍓</div>
              <div className="quiz-start-hero-mini quiz-start-hero-mini-right">✨</div>
              <div className="quiz-start-hero-mini quiz-start-hero-mini-bottom">🧁</div>
            </div>

            <div className="quiz-start-copy">
              <h1 className="quiz-start-title">
                <span className="quiz-start-title-icon">🍰</span>
                Sweet Challenge
              </h1>
              <p className="quiz-start-subtitle">
                This quiz has two rounds. Answer before the timer runs out.
              </p>

              <div className="quiz-start-feature-row" aria-hidden="true">
                <div className="quiz-start-feature-pill">2 Sweet Rounds</div>
                <div className="quiz-start-feature-pill">Live Timer</div>
                <div className="quiz-start-feature-pill">Quick Reactions</div>
              </div>

              <button
                type="button"
                className="quiz-start-button"
                onClick={handleStartChallenge}
              >
                <span className="quiz-start-button-spark">Start Challenge</span>
              </button>

              <div className="quiz-start-howto">
                <div className="quiz-start-howto-row">
                  <span className="quiz-start-howto-label">Round 1</span>
                  <p>Solve the banana puzzle before the timer runs out.</p>
                </div>
                <div className="quiz-start-howto-row">
                  <span className="quiz-start-howto-label">Round 2</span>
                  <p>Pick the correct dessert image before time runs out.</p>
                </div>
              </div>

              <button
                type="button"
                className="quiz-start-link quiz-start-link-button"
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                <span className="quiz-start-link-icon" aria-hidden="true">
                  🍒
                </span>
                <span>{isLoggingOut ? "Logging Out..." : "Log Out"}</span>
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="quiz-page">
      <div className="quiz-confetti quiz-confetti-a" aria-hidden="true" />
      <div className="quiz-confetti quiz-confetti-b" aria-hidden="true" />
      <div className="quiz-confetti quiz-confetti-c" aria-hidden="true" />
      <div className="quiz-twinkle quiz-twinkle-a" aria-hidden="true" />
      <div className="quiz-twinkle quiz-twinkle-b" aria-hidden="true" />
      <div className="quiz-twinkle quiz-twinkle-c" aria-hidden="true" />
      <div className="quiz-deco quiz-deco-strawberry" aria-hidden="true">
        🍓
      </div>
      <div className="quiz-deco quiz-deco-donut" aria-hidden="true">
        🍩
      </div>
      <div className="quiz-deco quiz-deco-cupcake" aria-hidden="true">
        🧁
      </div>
      <div className="quiz-mascot" aria-hidden="true">
        👩‍🍳
      </div>

      <main className="quiz-card-modern">
        <div className="quiz-topper-modern" aria-hidden="true">
          <div className="quiz-topper-cake-modern">
            <span className="quiz-topper-icon-modern">🎂</span>
          </div>
          <div className="quiz-topper-banner-modern">
            <div className="quiz-topper-ribbon-modern quiz-topper-ribbon-left-modern" />
            <div className="quiz-topper-label-modern">Round {roundNumber} of 2</div>
            <div className="quiz-topper-ribbon-modern quiz-topper-ribbon-right-modern" />
          </div>
        </div>

        <h1 className="quiz-title-modern">
          {isBananaRound ? "Banana Puzzle Rush" : "Dessert Match Sprint"}
        </h1>

        <div className="quiz-meta-modern">
          <div className="quiz-badge-modern quiz-badge-player-modern">Player: {username}</div>
          <div className="quiz-badge-modern quiz-badge-round-modern">Score: {score} / 2</div>
          {currentSource ? (
            <div className="quiz-badge-modern quiz-badge-source-modern">
              Source: {currentSource}
            </div>
          ) : null}
        </div>

        <section className="quiz-progress-wrap" aria-label="Quiz progress">
          <div className="quiz-progress-labels">
            <span>Challenge progress</span>
            <span>{roundProgressPercent}%</span>
          </div>
          <div className="quiz-progress-bar">
            <span
              className="quiz-progress-fill"
              style={{ width: `${roundProgressPercent}%` }}
            />
          </div>

          <div className="quiz-progress-labels">
            <span>{isTimerLow ? "Hurry up" : "Time left"}</span>
            <span>{timeLeft}s</span>
          </div>
          <div
            className={`quiz-progress-bar quiz-progress-timer${
              isTimerLow ? " quiz-progress-timer-low" : ""
            }`}
          >
            <span
              className={`quiz-progress-fill quiz-progress-fill-timer${
                isTimerLow ? " quiz-progress-fill-timer-low" : ""
              }`}
              style={{ width: `${timeProgressPercent}%` }}
            />
          </div>
        </section>

        {loadError ? (
          <div className="quiz-status-card-modern" role="alert">
            <p className="quiz-feedback-modern">{loadError}</p>
            {canRetryRound ? (
              <div className="quiz-actions-modern">
                <button
                  type="button"
                  className="secondary-btn-modern"
                  onClick={loadCurrentRound}
                >
                  Retry Round
                </button>
              </div>
            ) : null}
          </div>
        ) : null}

        {isLoadingQuestion ? (
          <div className="quiz-status-card-modern" aria-live="polite">
            <p className="quiz-feedback-modern">Loading the next question...</p>
          </div>
        ) : null}

        {!isLoadingQuestion && !loadError && isBananaRound && bananaQuestion ? (
          <section className="quiz-feature-modern">
            <p className="quiz-subtitle-modern">
              Solve the banana puzzle before the timer ends.
            </p>

            <div className="banana-layout-modern">
              <div className="puzzle-box-modern banana-puzzle-box-modern">
                <div className="puzzle-frame-modern">
                  <img
                    className="puzzle-image-modern"
                    src={bananaQuestion.question}
                    alt="Banana puzzle"
                  />
                </div>
              </div>

              <div className="banana-controls-modern">
                <div className="banana-controls-card-modern">
                  <h2 className="banana-controls-title-modern">Your answer</h2>
                  <form
                    className="answer-row-modern"
                    onSubmit={(event) => {
                      event.preventDefault();
                      handleBananaSubmit();
                    }}
                  >
                    <input
                      className={`answer-input-modern${
                        bananaAnswerError ? " answer-input-error-modern" : ""
                      }`}
                      type="text"
                      inputMode="numeric"
                      placeholder="Type a whole number"
                      value={bananaAnswer}
                      onChange={(event) => setBananaAnswer(event.target.value)}
                      onBlur={handleBananaAnswerBlur}
                      disabled={isRoundResolved}
                      aria-invalid={bananaAnswerError ? "true" : "false"}
                      aria-describedby="banana-answer-status"
                    />
                    <button
                      type="submit"
                      className="primary-btn-modern"
                      disabled={!canSubmitBanana}
                    >
                      Submit Answer
                    </button>
                  </form>

                  <p
                    id="banana-answer-status"
                    className={`banana-validation-modern${
                      bananaAnswerError ? " banana-validation-error-modern" : ""
                    }`}
                    aria-live="polite"
                  >
                    {bananaAnswerError || "Enter a whole number."}
                  </p>

                  {feedback ? (
                    <p className="quiz-feedback-modern banana-feedback-modern" aria-live="polite">
                      {feedback}
                    </p>
                  ) : null}

                  <div className="quiz-actions-modern quiz-actions-stack-modern">
                    <button
                      type="button"
                      className="secondary-btn-modern"
                      onClick={handleNextRound}
                      disabled={!canAdvance}
                    >
                      Continue to Round 2
                    </button>
                    <button
                      type="button"
                      className="secondary-btn-modern"
                      onClick={handleLogout}
                      disabled={isLoggingOut}
                    >
                      {isLoggingOut ? "Logging Out..." : "Log Out"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        ) : null}

        {!isLoadingQuestion && !loadError && !isBananaRound && dessertQuestion ? (
          <section className="quiz-feature-modern">
            <p className="quiz-subtitle-modern">{dessertQuestion.question}</p>

            <div className="cake-carousel-modern">
              <button
                type="button"
                className="cake-carousel-nav-modern"
                onClick={() => handleDessertSlideChange(-1)}
                disabled={selectedAnswerId !== null || isRoundResolved || dessertAnswers.length <= 1}
                aria-label="Show previous dessert"
              >
                ‹
              </button>

              <div className="cake-carousel-window-modern">
                <div
                  className="cake-carousel-track-modern"
                  style={{ transform: `translateX(-${activeDessertIndex * 100}%)` }}
                >
                  {dessertAnswers.map((answer, index) => (
                    <div className="cake-carousel-slide-modern" key={answer.id}>
                      <button
                        type="button"
                        className={`cake-option-modern${
                          selectedAnswerId === answer.id ? " cake-option-selected-modern" : ""
                        }${index === activeDessertIndex ? " cake-option-active-modern" : ""}`}
                        style={{ "--cake-float-delay": `${index * 0.18}s` }}
                        onClick={() => handleDessertAnswerClick(answer)}
                        disabled={selectedAnswerId !== null || isRoundResolved}
                        aria-label={`Select ${answer.label}`}
                      >
                        <img
                          className="cake-option-image-modern"
                          src={answer.image}
                          alt={answer.label}
                        />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <button
                type="button"
                className="cake-carousel-nav-modern"
                onClick={() => handleDessertSlideChange(1)}
                disabled={selectedAnswerId !== null || isRoundResolved || dessertAnswers.length <= 1}
                aria-label="Show next dessert"
              >
                ›
              </button>
            </div>

            <div className="cake-carousel-footer-modern">
              <div className="cake-carousel-dots-modern" aria-label="Dessert slides">
                {dessertAnswers.map((answer, index) => (
                  <button
                    key={answer.id}
                    type="button"
                    className={`cake-carousel-dot-modern${
                      index === activeDessertIndex ? " cake-carousel-dot-active-modern" : ""
                    }`}
                    onClick={() => setActiveDessertIndex(index)}
                    disabled={selectedAnswerId !== null || isRoundResolved}
                    aria-label={`Show dessert option ${index + 1}`}
                  />
                ))}
              </div>
            </div>

            {selectedAnswerId === null && !isRoundResolved && activeDessertAnswer ? (
              <div className="quiz-actions-modern cake-select-action-modern">
                <button
                  type="button"
                  className="primary-btn-modern"
                  onClick={() => handleDessertAnswerClick(activeDessertAnswer)}
                >
                  Select This Cake
                </button>
              </div>
            ) : null}

            <p className="cake-carousel-hint-modern">
              Browse the images and choose the correct dessert before time runs out.
            </p>

            {feedback ? (
              <p className="quiz-feedback-modern" aria-live="polite">
                {feedback}
              </p>
            ) : (
              <p className="quiz-feedback-modern quiz-feedback-muted-modern" aria-live="polite">
                Pick an image before the countdown finishes.
              </p>
            )}

            <div className="quiz-actions-modern">
              <button
                type="button"
                className="primary-btn-modern"
                onClick={handleNextRound}
                disabled={!canAdvance}
              >
                Finish Challenge
              </button>
            </div>
          </section>
        ) : null}

        {revealedDessertAnswer ? (
          <div className="quiz-modal-backdrop-modern" role="presentation">
            <div
              className="quiz-modal-modern"
              role="dialog"
              aria-modal="true"
              aria-labelledby="correct-dessert-title"
            >
              <p className="quiz-modal-kicker-modern">Correct answer</p>
              <h2 id="correct-dessert-title" className="quiz-modal-title-modern">
                {revealedDessertAnswer.label}
              </h2>
              <img
                className="quiz-modal-image-modern"
                src={revealedDessertAnswer.image}
                alt={revealedDessertAnswer.label}
              />
              <div className="quiz-actions-modern">
                <button
                  type="button"
                  className="primary-btn-modern"
                  onClick={handleCloseDessertReveal}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </main>
    </div>
  );
}

export default Quiz;
