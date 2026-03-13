import { Link } from "react-router-dom";

function StartScreen() {
  return (
    <div className="start-screen">
      <div className="start-screen-glow start-screen-glow-left" aria-hidden="true" />
      <div className="start-screen-glow start-screen-glow-right" aria-hidden="true" />

      <div className="start-screen-cakes" aria-hidden="true">
        <div className="floating-cake floating-cake-large">
          <span className="floating-cake-base" />
          <span className="floating-cake-icing" />
          <span className="floating-cake-cherry" />
        </div>
        <div className="floating-cupcake">
          <span className="floating-cupcake-top" />
          <span className="floating-cupcake-bottom" />
          <span className="floating-cupcake-dot floating-cupcake-dot-a" />
          <span className="floating-cupcake-dot floating-cupcake-dot-b" />
        </div>
        <div className="floating-cake floating-cake-small">
          <span className="floating-cake-base" />
          <span className="floating-cake-icing" />
          <span className="floating-cake-cherry" />
        </div>
      </div>

      <main className="start-screen-card">
        <p className="start-screen-kicker">Sweet Welcome</p>
        <h1 className="start-screen-title">
          Cake Shop
          <br />
          Challenge
        </h1>
        <p className="start-screen-subtitle">
          Step into a playful pink bakery world before you log in, then start
          your sweet little quiz adventure.
        </p>

        <div className="start-screen-actions">
          <Link to="/login" className="start-screen-button">
            Start Game
          </Link>
          <Link to="/register" className="start-screen-link">
            Create Account
          </Link>
        </div>
      </main>
    </div>
  );
}

export default StartScreen;
