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
    handleNextRound,
    handleStartChallenge,
    handleLogout,
  } = useQuiz();

  if (!hasStarted) {
    return (
      <div className="quiz-page">
        <div className="quiz-confetti quiz-confetti-a" aria-hidden="true" />
        <div className="quiz-confetti quiz-confetti-b" aria-hidden="true" />
        <div className="quiz-confetti quiz-confetti-c" aria-hidden="true" />
        <div className="quiz-twinkle quiz-twinkle-a" aria-hidden="true" />
        <div className="quiz-twinkle quiz-twinkle-b" aria-hidden="true" />
        <div className="quiz-twinkle quiz-twinkle-c" aria-hidden="true" />

        <section className="quiz-start-screen">
          <div className="quiz-start-cake-wrap" aria-hidden="true">
            <div className="quiz-start-cake-shadow" />
            <div className="quiz-start-cake">
              <div className="quiz-start-cake-icing" />
              <div className="quiz-start-cake-cherry" />
            </div>
          </div>

          <div className="quiz-start-copy">
            <h1 className="quiz-start-title">
              <span className="quiz-start-title-icon">🍰</span>
              Sweet Challenge
            </h1>
            <p className="quiz-start-subtitle">
              Two bakery rounds, a live countdown, and fast reactions. Enter the
              challenge when you&apos;re ready.
            </p>

            <button
              type="button"
              className="quiz-start-button"
              onClick={handleStartChallenge}
            >
              Start Challenge
            </button>

            <div className="quiz-start-howto">
              <p>Round 1: solve the banana puzzle before the timer runs out.</p>
              <p>Round 2: pick the correct dessert image before the countdown hits zero.</p>
            </div>

            <button
              type="button"
              className="quiz-start-link quiz-start-link-button"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? "Logging Out..." : "Log Out"}
            </button>
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
          <div className="quiz-topper-cake-modern" />
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
            <p className="quiz-feedback-modern">Loading your next bakery challenge...</p>
          </div>
        ) : null}

        {!isLoadingQuestion && !loadError && isBananaRound && bananaQuestion ? (
          <section className="quiz-feature-modern">
            <p className="quiz-subtitle-modern">
              Count the missing bananas before the countdown finishes.
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
                    {bananaAnswerError || "Live validation is on. Whole numbers only."}
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

            <div className="cake-grid-modern">
              {dessertQuestion.answers.map((answer) => (
                <button
                  key={answer.id}
                  type="button"
                  className={`cake-option-modern${
                    selectedAnswerId === answer.id ? " cake-option-selected-modern" : ""
                  }`}
                  onClick={() => handleDessertAnswerClick(answer)}
                  disabled={selectedAnswerId !== null || isRoundResolved}
                >
                  <img
                    className="cake-option-image-modern"
                    src={answer.image}
                    alt={answer.label}
                  />
                  <span className="cake-option-label-modern">{answer.label}</span>
                </button>
              ))}
            </div>

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
      </main>
    </div>
  );
}

export default Quiz;
