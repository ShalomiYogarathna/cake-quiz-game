import useResult from "../hooks/useResult";

function Result() {
  const {
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
  } = useResult();

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
              You finished the challenge and your score will appear in your player
              dashboard.
            </p>
            {saveMessage ? <p className="result-message-fact">🍬 {saveMessage}</p> : null}
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
                {isLoadingFact ? "Loading Fact..." : "Retry Number Fact"}
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
              disabled={isSavingScore || isLoggingOut}
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
