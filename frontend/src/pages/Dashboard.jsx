import { Link } from "react-router-dom";
import useDashboard from "../hooks/useDashboard";

function Dashboard() {
  const {
    error,
    isLoading,
    isLoggingOut,
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
          <p className="dashboard-kicker">Dashboard</p>
          <h1 className="dashboard-title">Welcome back, {username}</h1>
          <p className="dashboard-subtitle">
            Check your saved scores and start a new quiz round whenever you want.
          </p>

          <div className="dashboard-hero-actions">
            <button
              type="button"
              className="dashboard-primary-button"
              onClick={startQuiz}
            >
              Start Challenge
            </button>
            <Link to="/login" className="dashboard-link-button">
              Back to Login
            </Link>
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
        {isLoading ? <p className="dashboard-empty">Loading your scores...</p> : null}

        <section className="dashboard-stats-grid">
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

        <section className="dashboard-panels">
          <article className="dashboard-panel">
            <div className="dashboard-panel-head">
              <h2>Recent Performance</h2>
              <p>Your most recent quiz attempts.</p>
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
                      {entry.score === entry.total_questions ? "Perfect" : "Completed"}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="dashboard-empty">
                No quiz history yet. Play one round to see results here.
              </p>
            )}
          </article>

          <article className="dashboard-panel">
            <div className="dashboard-panel-head">
              <h2>Score History</h2>
              <p>All saved results for this account.</p>
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
              <p className="dashboard-empty">
                Your saved scores will appear here after you finish a quiz.
              </p>
            )}
          </article>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
