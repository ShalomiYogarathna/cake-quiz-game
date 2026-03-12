import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Quiz() {
  const [score, setScore] = useState(0);
  const [roundNumber, setRoundNumber] = useState(1);
  const [bananaQuestion, setBananaQuestion] = useState(null);
  const [bananaAnswer, setBananaAnswer] = useState("");
  const [cakeQuestion, setCakeQuestion] = useState(null);
  const [selectedAnswerId, setSelectedAnswerId] = useState(null);
  const [feedback, setFeedback] = useState("");
  const navigate = useNavigate();
  const token = localStorage.getItem("cake_quiz_token");
  const username = localStorage.getItem("cake_quiz_username");

  useEffect(() => {
    if (!token) {
      navigate("/");
    }
  }, [navigate, token]);

  useEffect(() => {
    if (!token) {
      return;
    }

    if (roundNumber === 1) {
      fetch("http://127.0.0.1:8000/banana", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setBananaQuestion(data);
          setBananaAnswer("");
          setFeedback("");
        })
        .catch((error) => console.error("Error loading Banana round:", error));
      return;
    }

    fetch("http://127.0.0.1:8000/cake-question/random", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setCakeQuestion(data);
        setSelectedAnswerId(null);
        setFeedback("");
      })
      .catch((error) => console.error("Error loading cake round:", error));
  }, [roundNumber, token]);

  const handleBananaSubmit = () => {
    if (!bananaQuestion) {
      return;
    }

    if (bananaAnswer.trim() === "") {
      setFeedback("Enter an answer first.");
      return;
    }

    const parsedAnswer = Number.parseInt(bananaAnswer, 10);

    if (parsedAnswer === bananaQuestion.solution) {
      setScore((prevScore) => prevScore + 1);
      setFeedback("Correct answer!");
    } else {
      setFeedback(`Wrong answer. The correct answer is ${bananaQuestion.solution}.`);
    }
  };

  const handleCakeAnswerClick = (answer) => {
    if (selectedAnswerId !== null) {
      return;
    }

    setSelectedAnswerId(answer.id);

    if (answer.correct) {
      setScore((prevScore) => prevScore + 1);
      setFeedback("Correct answer!");
    } else {
      setFeedback("Wrong answer!");
    }
  };

  const handleNextRound = () => {
    if (roundNumber === 1) {
      if (!feedback) {
        setFeedback("Submit your Banana answer first.");
        return;
      }

      setRoundNumber(2);
      return;
    }

    if (selectedAnswerId === null) {
      setFeedback("Choose an image answer first.");
      return;
    }

    navigate("/result", {
      state: {
        score,
        totalQuestions: 2,
        username,
      },
    });
  };

  return (
    <div>
      <h1>Cake Shop Banana Challenge</h1>
      <p>Player: {username || "Guest"}</p>
      <p>Round {roundNumber} of 2</p>

      {roundNumber === 1 && bananaQuestion ? (
        <div>
          <p>Solve the Banana API puzzle to unlock the next cake order.</p>
          <img
            src={bananaQuestion.question}
            alt="Banana API puzzle"
            width="320"
          />
          <br />
          <br />
          <input
            type="number"
            placeholder="Enter numeric answer"
            value={bananaAnswer}
            onChange={(e) => setBananaAnswer(e.target.value)}
          />
          <button type="button" onClick={handleBananaSubmit}>
            Submit Banana Answer
          </button>
        </div>
      ) : null}

      {roundNumber === 2 && cakeQuestion ? (
        <div>
          <p>{cakeQuestion.question}</p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 200px)",
              gap: "20px",
              marginTop: "20px",
            }}
          >
            {cakeQuestion.answers.map((answer) => (
              <img
                key={answer.id}
                src={answer.image}
                alt="Cake answer option"
                width="200"
                height="200"
                style={{
                  objectFit: "cover",
                  cursor: "pointer",
                  borderRadius: "10px",
                  border:
                    selectedAnswerId === answer.id
                      ? "4px solid #2f855a"
                      : "2px solid transparent",
                }}
                onClick={() => handleCakeAnswerClick(answer)}
              />
            ))}
          </div>
        </div>
      ) : null}

      {feedback ? <p>{feedback}</p> : null}

      <button type="button" onClick={handleNextRound}>
        {roundNumber === 1 ? "Go To Cake Round" : "Finish Quiz"}
      </button>

      <p>Score: {score}</p>
    </div>
  );
}

export default Quiz;
