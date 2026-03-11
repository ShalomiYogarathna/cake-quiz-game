import { Link, useLocation, useNavigate } from "react-router-dom";

function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const score = location.state?.score ?? 0;
  const totalQuestions = location.state?.totalQuestions ?? 2;

  return (
    <div>
      <h1>Quiz Result</h1>
      <p>
        You scored {score} out of {totalQuestions}.
      </p>
      <button onClick={() => navigate("/quiz")}>Play Again</button>
      <p>
        Back to <Link to="/">Login</Link>
      </p>
    </div>
  );
}

export default Result;
