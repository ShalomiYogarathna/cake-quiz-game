import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();

    console.log("Username:", username);
    console.log("Email:", email);
    console.log("Password:", password);

    navigate("/");
  };

  return (
    <div>
      <h1>Register Page</h1>
      <p>Create your account, then continue to login.</p>

      <form onSubmit={handleRegister}>
        <div>
          <label>Username</label>
          <br />
          <input
            type="text"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>

        <br />

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

        <button type="submit">Register</button>
      </form>

      <br />

      <p>
        Already have an account? <Link to="/">Login here</Link>
      </p>
    </div>
  );
}

export default Register;
