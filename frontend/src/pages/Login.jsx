import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { apiRequest } from "../services/api";
import { useAuth } from "../hooks/useAuth";
import { sanitizeEmail, validateEmail } from "../utils/validation";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { refreshAuth } = useAuth();

  useEffect(() => {
    if (location.state?.authMessage) {
      setError(location.state.authMessage);
    }
  }, [location.state]);

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");

    const normalizedEmail = sanitizeEmail(email);
    const nextEmailError = validateEmail(normalizedEmail);
    setEmailError(nextEmailError);

    if (nextEmailError) {
      setError(nextEmailError);
      return;
    }

    if (!password.trim()) {
      setError("Password is required.");
      return;
    }

    try {
      await apiRequest("/login", {
        method: "POST",
        body: { email: normalizedEmail, password },
      });

      await refreshAuth();
      navigate(location.state?.from || "/dashboard", { replace: true });
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
              <p className="auth-welcome">Welcome to the</p>
              <h1 className="auth-title auth-title-main">
                Cake Shop
                <br />
                Challenge
              </h1>
              <p className="auth-subtitle auth-subtitle-main">
                Sign in to enter a sweet little cake world filled with bakery
                rounds, playful challenges, and a final score screen.
              </p>

              <ul className="auth-check-list">
                <li>Unlock the next cake order by clearing each challenge</li>
                <li>Enjoy bakery-themed rounds with cute image choices</li>
                <li>Your progress and score stay linked to your player login</li>
              </ul>
            </div>

            <section className="auth-panel auth-panel-inline auth-panel-right">
              <div className="auth-form-card auth-form-card-right">
                <h2>Log In</h2>
                <p>Log in to start the Cake Shop Challenge</p>

                <form className="auth-form" onSubmit={handleLogin}>
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
                        onChange={(event) => setPassword(event.target.value)}
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
                  </div>

                  <button className="auth-submit" type="submit">
                    Log In
                  </button>
                </form>

                {error ? <p className="auth-error">{error}</p> : null}

                <p className="auth-footer">
                  Don&apos;t have an account? <Link to="/register">Sign Up</Link>
                </p>
              </div>
            </section>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Login;
