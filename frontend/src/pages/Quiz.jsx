import useQuiz from "../hooks/useQuiz";
import "./Quiz.css";

function Quiz() {
  const {
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
  } = useQuiz();

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
