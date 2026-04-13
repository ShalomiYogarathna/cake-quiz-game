import useDashboard from "../hooks/useDashboard";

function Dashboard() {
  const {
    error,
    isLoading,
    isLoggingOut,
    loadDashboard,
    startQuiz,
    handleLogout,
    formatPlayedAt,
    username,
    stats,
    history,
  } = useDashboard();

  return (
    <div className="dashboard-shell">
      <div className="dashboard-deco dashboard-deco-left">🍓</div>
      <div className="dashboard-deco dashboard-deco-right">🍩</div>
      <div className="dashboard-mascot" aria-hidden="true">
        🍰
      </div>

      <main className="dashboard-stage">
        <section className="dashboard-hero-card">
          <p className="dashboard-kicker">Sweet Progress Center</p>
          <h1 className="dashboard-title">Welcome back, {username}</h1>
          <p className="dashboard-subtitle">
            Track your cake challenge history, see your best scores, and jump back into a new round anytime.
          </p>

          <div className="dashboard-hero-actions">
            <button
              type="button"
              className="dashboard-primary-button"
              onClick={startQuiz}
            >
              Start Challenge
            </button>
            <button
              type="button"
              className="dashboard-link-button"
              onClick={handleLogout}
              disabled={isLoggingOut}
            >
              {isLoggingOut ? "Logging Out..." : "Log Out"}
            </button>
          </div>
        </section>

        {error ? <p className="dashboard-error">{error}</p> : null}

        {isLoading ? (
          <section className="dashboard-panel">
            <div className="dashboard-panel-head">
              <h2>Loading Dashboard</h2>
              <p>Gathering your latest cake challenge stats.</p>
            </div>
          </section>
        ) : null}

        <section className="dashboard-stats-grid" aria-busy={isLoading}>
          <article className="dashboard-stat-card">
            <span className="dashboard-stat-label">Total Plays</span>
            <strong className="dashboard-stat-value">{stats?.total_attempts ?? 0}</strong>
          </article>
          <article className="dashboard-stat-card">
            <span className="dashboard-stat-label">Best Score</span>
            <strong className="dashboard-stat-value">{stats?.best_score ?? 0}</strong>
          </article>
          <article className="dashboard-stat-card">
            <span className="dashboard-stat-label">Average Score</span>
            <strong className="dashboard-stat-value">{stats?.average_score ?? 0}</strong>
          </article>
          <article className="dashboard-stat-card">
            <span className="dashboard-stat-label">Latest Score</span>
            <strong className="dashboard-stat-value">
              {stats ? `${stats.latest_score}/${stats.latest_total_questions}` : "0/0"}
            </strong>
          </article>
        </section>

        {error && !isLoading ? (
          <section className="dashboard-panel">
            <div className="dashboard-panel-head">
              <h2>Try Again</h2>
              <p>The dashboard could not be refreshed from the API.</p>
            </div>
            <button
              type="button"
              className="dashboard-primary-button"
              onClick={loadDashboard}
            >
              Retry Dashboard Load
            </button>
          </section>
        ) : null}

        <section className="dashboard-panels">
          <article className="dashboard-panel">
            <div className="dashboard-panel-head">
              <h2>Recent Performance</h2>
              <p>Your latest attempts in the cake shop challenge.</p>
            </div>

            {history.length > 0 ? (
              <div className="dashboard-history-list">
                {history.slice(0, 5).map((entry) => (
                  <div key={entry.id} className="dashboard-history-card">
                    <div>
                      <p className="dashboard-history-score">
                        {entry.score}/{entry.total_questions}
                      </p>
                      <p className="dashboard-history-date">
                        {formatPlayedAt(entry.created_at)}
                      </p>
                    </div>
                    <span className="dashboard-history-badge">
                      {entry.score === entry.total_questions ? "Perfect" : "Sweet Try"}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="dashboard-empty">No quiz history yet. Play your first challenge to fill this board.</p>
            )}
          </article>

          <article className="dashboard-panel">
            <div className="dashboard-panel-head">
              <h2>Score History</h2>
              <p>Every saved result is stored here for this player.</p>
            </div>

            {history.length > 0 ? (
              <div className="dashboard-table-wrap">
                <table className="dashboard-table">
                  <thead>
                    <tr>
                      <th>Score</th>
                      <th>Total</th>
                      <th>Played At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((entry) => (
                      <tr key={entry.id}>
                        <td>{entry.score}</td>
                        <td>{entry.total_questions}</td>
                        <td>{formatPlayedAt(entry.created_at)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="dashboard-empty">Your saved scores will appear here after you finish a quiz.</p>
            )}
          </article>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
