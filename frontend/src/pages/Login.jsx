import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    console.log("Email:", email);
    console.log("Password:", password);

    navigate("/quiz");
  };

  return (
    <div>
      <h1>Login Page</h1>
      <p>Log in to start the cake quiz.</p>

      <form onSubmit={handleLogin}>
        <div>
          <label>Email</label>
          <br />
          <input
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <br />

        <div>
          <label>Password</label>
          <br />
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <br />

        <button type="submit">Login</button>
      </form>

      <br />

      <p>
        Don&apos;t have an account? <Link to="/register">Register here</Link>
      </p>
    </div>
  );
}

export default Login;
