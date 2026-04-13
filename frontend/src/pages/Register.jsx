import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
