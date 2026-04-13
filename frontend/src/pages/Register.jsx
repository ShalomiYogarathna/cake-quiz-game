import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
<<<<<<< Updated upstream
=======
import { apiRequest } from "../services/api";
import {
<<<<<<< HEAD
  normalizeEmail,
  validateEmail,
  validateStrongPassword,
  validateUsername,
} from "../utils/auth";
>>>>>>> Stashed changes

const PASSWORD_RULE_TEXT =
  "Use 8+ characters with uppercase, lowercase, number, and special character.";
=======
  PASSWORD_RULE_TEXT,
  USERNAME_RULE_TEXT,
  validateEmail,
  validatePassword,
  validateUsername,
  sanitizeEmail,
  sanitizeUsername,
} from "../utils/validation";
>>>>>>> codex/refactor-auth-modularity

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setUsernameError("");
    setEmailError("");
    setPasswordError("");

<<<<<<< HEAD
    const normalizedEmail = normalizeEmail(email);

    if (!validateUsername(username)) {
      setUsernameError(
        "Use 3-20 characters with letters, numbers, spaces, underscores, or hyphens."
      );
      return;
    }

    if (!validateEmail(normalizedEmail)) {
      setEmailError("Enter a valid email address.");
      return;
    }

    if (!validateStrongPassword(password)) {
      setPasswordError(PASSWORD_RULE_TEXT);
=======
    const normalizedUsername = sanitizeUsername(username);
    const normalizedEmail = sanitizeEmail(email);
    const usernameError = validateUsername(normalizedUsername);
    const emailError = validateEmail(normalizedEmail);
    const passwordError = validatePassword(password);

    if (usernameError) {
      setError(usernameError);
      return;
    }

    if (emailError) {
      setError(emailError);
      return;
    }

    if (passwordError) {
      setError(passwordError);
>>>>>>> codex/refactor-auth-modularity
      return;
    }

    try {
      const response = await fetch("http://localhost:8000/register", {
        method: "POST",
<<<<<<< HEAD
<<<<<<< Updated upstream
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password }),
=======
        body: { username: username.trim(), email: normalizedEmail, password },
>>>>>>> Stashed changes
=======
        body: { username: normalizedUsername, email: normalizedEmail, password },
>>>>>>> codex/refactor-auth-modularity
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Registration failed");
      }

      setSuccess("Registration complete. Continue to login.");
      navigate("/login");
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
          <div className="auth-content-grid">
            <div className="auth-copy-side">
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
            </div>

            <section className="auth-panel auth-panel-inline auth-panel-right">
              <div className="auth-form-card auth-form-card-right">
              <h2>Sign Up</h2>
              <p>Create an account to play the Cake Shop Challenge</p>

              <form className="auth-form" onSubmit={handleRegister}>
                <div className="auth-field">
                  <label>Username</label>
                  <input
                    type="text"
                    placeholder="Enter username"
                    value={username}
<<<<<<< HEAD
                    onChange={(e) => {
                      setUsername(e.target.value);
                      setUsernameError(
                        e.target.value && !validateUsername(e.target.value)
                          ? "Use 3-20 characters with letters, numbers, spaces, underscores, or hyphens."
                          : ""
                      );
                    }}
                  />
                  {usernameError ? (
                    <small className="auth-field-help auth-field-help-error">{usernameError}</small>
                  ) : null}
=======
                    onChange={(e) => setUsername(e.target.value)}
                    onBlur={(e) => setUsername(sanitizeUsername(e.target.value))}
                  />
                  <small className="auth-field-help">{USERNAME_RULE_TEXT}</small>
>>>>>>> codex/refactor-auth-modularity
                </div>

                <div className="auth-field">
                  <label>Email</label>
                  <input
                    type="email"
                    placeholder="Enter email"
                    value={email}
<<<<<<< HEAD
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setEmailError(
                        e.target.value && !validateEmail(e.target.value)
                          ? "Enter a valid email address."
                          : ""
                      );
                    }}
=======
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={(e) => setEmail(sanitizeEmail(e.target.value))}
>>>>>>> codex/refactor-auth-modularity
                  />
                  {emailError ? (
                    <small className="auth-field-help auth-field-help-error">{emailError}</small>
                  ) : null}
                </div>

                <div className="auth-field">
                  <label>Password</label>
                  <div className="auth-password-wrap">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        setPasswordError(
                          e.target.value && !validateStrongPassword(e.target.value)
                            ? PASSWORD_RULE_TEXT
                            : ""
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
                    <small className="auth-field-help auth-field-help-error">{passwordError}</small>
                  ) : null}
                </div>

                <button className="auth-submit" type="submit">
                  Sign Up
                </button>
              </form>

              {error ? <p className="auth-error">{error}</p> : null}
              {success ? <p className="auth-success">{success}</p> : null}

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
