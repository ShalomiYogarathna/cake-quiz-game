import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import cakeShopHero from "../assets/cake-shop-hero.svg";
import { apiRequest } from "../services/api";
import {
  PASSWORD_RULE_TEXT,
  USERNAME_RULE_TEXT,
  validateEmail,
  validatePassword,
  validateUsername,
  sanitizeEmail,
  sanitizeUsername,
} from "../utils/validation";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (event) => {
    event.preventDefault();
    setError("");

    const normalizedUsername = sanitizeUsername(username);
    const normalizedEmail = sanitizeEmail(email);
    const nextUsernameError = validateUsername(normalizedUsername);
    const nextEmailError = validateEmail(normalizedEmail);
    const nextPasswordError = validatePassword(password);

    setUsernameError(nextUsernameError);
    setEmailError(nextEmailError);
    setPasswordError(nextPasswordError);

    if (nextUsernameError || nextEmailError || nextPasswordError) {
      setError(nextUsernameError || nextEmailError || nextPasswordError);
      return;
    }

    try {
      await apiRequest("/register", {
        method: "POST",
        body: {
          username: normalizedUsername,
          email: normalizedEmail,
          password,
        },
      });

      navigate("/login", {
        replace: true,
        state: { authMessage: "Registration complete. Please log in." },
      });
    } catch (requestError) {
      setError(requestError.message);
    }
  };

  return (
    <div className="auth-shell auth-shell-centered">
      <div className="auth-sparkle auth-sparkle-a" />
      <div className="auth-sparkle auth-sparkle-b" />
      <div className="auth-sparkle auth-sparkle-c" />
      <div className="auth-orb auth-orb-a" aria-hidden="true" />
      <div className="auth-orb auth-orb-b" aria-hidden="true" />
      <div className="auth-orb auth-orb-c" aria-hidden="true" />
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
            src={cakeShopHero}
            alt="Cake shop illustration"
          />
        </div>
        <div className="auth-banner-wrap">
          <div className="auth-banner-ribbon auth-banner-ribbon-left" />
          <div className="auth-banner">
            <span>CAKE SHOP CHALLENGE</span>
          </div>
          <div className="auth-banner-ribbon auth-banner-ribbon-right" />
        </div>

        <section className="auth-main-card">
          <div className="auth-content-grid">
            <div className="auth-copy-side">
              <p className="auth-welcome">Join the sweetest arcade</p>
              <div className="auth-mini-pills" aria-hidden="true">
                <span>Bakery Theme</span>
                <span>2 Fast Rounds</span>
                <span>Score History</span>
              </div>
              <h1 className="auth-title auth-title-main">
                Cake Shop
                <br />
                Challenge
              </h1>
              <p className="auth-subtitle auth-subtitle-main">
                Create an account to play the quiz and store your results.
              </p>

              <div className="auth-highlight-card">
                <div className="auth-highlight-icon" aria-hidden="true">
                  🍰
                </div>
                <div>
                  <p className="auth-highlight-title">Build your bakery player card</p>
                  <p className="auth-highlight-text">
                    Sign up once and your scores will be stored on your dashboard.
                  </p>
                </div>
              </div>

              <ul className="auth-check-list">
                <li>Create an account for the quiz</li>
                <li>Play both rounds after logging in</li>
                <li>Review your previous scores on the dashboard</li>
              </ul>

              <div className="auth-stats-row" aria-hidden="true">
                <div className="auth-stat-card">
                  <strong>2</strong>
                  <span>Rounds</span>
                </div>
                <div className="auth-stat-card">
                  <strong>Live</strong>
                  <span>Timer</span>
                </div>
                <div className="auth-stat-card">
                  <strong>Sweet</strong>
                  <span>Rewards</span>
                </div>
              </div>
            </div>

            <section className="auth-panel auth-panel-inline auth-panel-right">
              <div className="auth-form-card auth-form-card-right">
                <h2>Sign Up</h2>
                <p>Create your account to start playing.</p>

                <form className="auth-form" onSubmit={handleRegister}>
                  <div className="auth-field">
                    <label>Username</label>
                    <input
                      type="text"
                      placeholder="Enter username"
                      value={username}
                      onChange={(event) => {
                        const nextValue = event.target.value;
                        setUsername(nextValue);
                        setUsernameError(
                          nextValue ? validateUsername(sanitizeUsername(nextValue)) : ""
                        );
                      }}
                      onBlur={(event) =>
                        setUsername(sanitizeUsername(event.target.value))
                      }
                    />
                    <small className="auth-field-help">{USERNAME_RULE_TEXT}</small>
                    {usernameError ? (
                      <small className="auth-field-help auth-field-help-error">
                        {usernameError}
                      </small>
                    ) : null}
                  </div>

                  <div className="auth-field">
                    <label>Email</label>
                    <input
                      type="email"
                      placeholder="Enter email"
                      value={email}
                      onChange={(event) => {
                        const nextValue = event.target.value;
                        setEmail(nextValue);
                        setEmailError(
                          nextValue ? validateEmail(sanitizeEmail(nextValue)) : ""
                        );
                      }}
                      onBlur={(event) => setEmail(sanitizeEmail(event.target.value))}
                    />
                    {emailError ? (
                      <small className="auth-field-help auth-field-help-error">
                        {emailError}
                      </small>
                    ) : null}
                  </div>

                  <div className="auth-field">
                    <label>Password</label>
                    <div className="auth-password-wrap">
                      <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter password"
                        value={password}
                        onChange={(event) => {
                          const nextValue = event.target.value;
                          setPassword(nextValue);
                          setPasswordError(
                            nextValue ? validatePassword(nextValue) : ""
                          );
                        }}
                      />
                      <button
                        className="auth-password-toggle"
                        type="button"
                        onClick={() => setShowPassword((visible) => !visible)}
                        aria-label={showPassword ? "Hide password" : "Show password"}
                      >
                        {showPassword ? "Hide" : "Show"}
                      </button>
                    </div>
                    <small className="auth-field-help">{PASSWORD_RULE_TEXT}</small>
                    {passwordError ? (
                      <small className="auth-field-help auth-field-help-error">
                        {passwordError}
                      </small>
                    ) : null}
                  </div>

                  <button className="auth-submit" type="submit">
                    Sign Up
                  </button>
                </form>

                {error ? <p className="auth-error">{error}</p> : null}

                <p className="auth-footer">
                  Already have an account? <Link to="/login">Log In</Link>
                </p>
              </div>
            </section>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Register;
