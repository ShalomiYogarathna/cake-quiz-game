import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
<<<<<<< Updated upstream

=======
import { apiRequest, AuthError } from "../services/api";
<<<<<<< HEAD
import { useAuth } from "../hooks/useAuth";
import { normalizeEmail, validateEmail } from "../utils/auth";
>>>>>>> Stashed changes
=======
import { setAuthSession } from "../utils/auth";
import { sanitizeEmail, validateEmail } from "../utils/validation";
>>>>>>> codex/refactor-auth-modularity

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
<<<<<<< Updated upstream
=======
  const { refreshAuth } = useAuth();
  const authMessage = error || location.state?.authMessage || "";
>>>>>>> Stashed changes

useEffect(() => {
  if (location.state?.authMessage) {
    setError(location.state.authMessage);
  }
}, [location.state]);

  
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
<<<<<<< HEAD
    setEmailError("");

    const normalizedEmail = normalizeEmail(email);

    if (!validateEmail(normalizedEmail)) {
      setEmailError("Enter a valid email address.");
=======
    const normalizedEmail = sanitizeEmail(email);
    const emailError = validateEmail(normalizedEmail);

    if (emailError) {
      setError(emailError);
      return;
    }

    if (!password.trim()) {
      setError("Password is required.");
>>>>>>> codex/refactor-auth-modularity
      return;
    }

    try {
<<<<<<< Updated upstream
      const response = await fetch("http://localhost:8000/login"
, {
        method: "POST",
<<<<<<< HEAD
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
=======
        body: { email: normalizedEmail, password },
>>>>>>> codex/refactor-auth-modularity
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "Login failed");
      }

      localStorage.setItem("cake_quiz_token", data.token);
      localStorage.setItem("cake_quiz_username", data.username);
      navigate("/dashboard");
=======
      await apiRequest("/login", {
        method: "POST",
        body: { email: normalizedEmail, password },
      });

      await refreshAuth();
      navigate(location.state?.from || "/dashboard", { replace: true });
>>>>>>> Stashed changes
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
                  {emailError ? <small className="auth-field-help auth-field-help-error">{emailError}</small> : null}
                </div>

                <div className="auth-field">
                  <label>Password</label>
                  <div className="auth-password-wrap">
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
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
