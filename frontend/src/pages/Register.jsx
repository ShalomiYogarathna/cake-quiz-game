import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await fetch("http://localhost:8000/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Registration failed");
      }

      setSuccess("Registration complete. Continue to login.");
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="auth-shell auth-shell-centered">
      <div className="auth-sparkle auth-sparkle-a" />
      <div className="auth-sparkle auth-sparkle-b" />
      <div className="auth-sparkle auth-sparkle-c" />
      <div className="dessert-corner dessert-left">
        <div className="dessert-cupcake">
          <span className="dessert-cherry" />
        </div>
      </div>
      <div className="dessert-corner dessert-right">
        <div className="dessert-donut" />
      </div>

      <main className="auth-stage">
        <div className="auth-top-image-wrap">
          <img
            className="auth-top-image"
            src="https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?auto=format&fit=crop&w=900&q=80"
            alt="Pink cake decoration"
          />
        </div>
        <div className="auth-banner-wrap">
          <div className="auth-banner-ribbon auth-banner-ribbon-left" />
          <div className="auth-banner">
            <div className="auth-banner-cake" />
            <span>CAKE SHOP CHALLENGE</span>
          </div>
          <div className="auth-banner-ribbon auth-banner-ribbon-right" />
        </div>

        <section className="auth-main-card">
          <p className="auth-welcome">Join the</p>
          <h1 className="auth-title auth-title-main">
            Cake Shop
            <br />
            Challenge
          </h1>
          <p className="auth-subtitle auth-subtitle-main">
            Create your sweet player profile, then come back to complete bakery
            rounds in your own pink cake world.
          </p>

          <ul className="auth-check-list">
            <li>Create your player profile for the Cake Shop Challenge</li>
            <li>Move through sweet bakery rounds and playful quiz moments</li>
            <li>Stay in one connected game flow from sign up to final result</li>
          </ul>

          <section className="auth-panel auth-panel-inline">
            <div className="auth-form-card auth-form-card-centered">
              <h2>Sign Up</h2>
              <p>Create an account to play the Cake Shop Challenge</p>

              <form className="auth-form" onSubmit={handleRegister}>
                <div className="auth-field">
                  <label>Username</label>
                  <input
                    type="text"
                    placeholder="Enter username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>

                <div className="auth-field">
                  <label>Email</label>
                  <input
                    type="email"
                    placeholder="Enter email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="auth-field">
                  <label>Password</label>
                  <input
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <button className="auth-submit" type="submit">
                  Sign Up
                </button>
              </form>

              {error ? <p className="auth-error">{error}</p> : null}
              {success ? <p className="auth-success">{success}</p> : null}

              <p className="auth-footer">
                Already have an account? <Link to="/">Log In</Link>
              </p>
            </div>
          </section>
        </section>
      </main>
    </div>
  );
}

export default Register;
