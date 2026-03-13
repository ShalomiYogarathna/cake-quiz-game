import { useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const score = location.state?.score ?? 0;
  const totalQuestions = location.state?.totalQuestions ?? 2;
  const username = location.state?.username ?? "Player";
  const token = localStorage.getItem("cake_quiz_token");
  const hasSavedScore = useRef(false);

useEffect(() => {
  if (!token) {
    return;
  }
  
  if (hasSavedScore.current) {
    return;
  }

  hasSavedScore.current = true;

  fetch("http://localhost:8000/scores", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      score,
      total_questions: totalQuestions,
    }),
  }).catch((error) => console.error("Error saving score:", error));
}, [score, token, totalQuestions]);

  const handlePlayAgain = () => {
    navigate("/quiz");
  };

  return (
    <div>
      <h1>Quiz Result</h1>
      <p>{username}, your cake shop challenge is complete.</p>
      <p>
        You scored {score} out of {totalQuestions}.
      </p>
      <button onClick={handlePlayAgain}>Play Again</button>
      <p>
        Back to <Link to="/">Login</Link>
      </p>
    </div>
  );
}

export default Result;
