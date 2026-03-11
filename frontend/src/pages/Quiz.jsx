import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function Quiz() {
  const [score, setScore] = useState(0);
  const [cakeQuestion, setCakeQuestion] = useState(null);
  const [questionNumber, setQuestionNumber] = useState(1);
  const [selectedAnswerId, setSelectedAnswerId] = useState(null);
  const navigate = useNavigate();

  const loadQuestion = (number) => {
    fetch(`http://127.0.0.1:8000/cake-question${number === 1 ? "" : "-2"}`)
      .then((response) => response.json())
      .then((data) => {
        setCakeQuestion(data);
        setSelectedAnswerId(null);
      })
      .catch((error) => console.error("Error loading cake question:", error));
  };

  useEffect(() => {
    loadQuestion(questionNumber);
  }, [questionNumber]);

  const handleAnswerClick = (answer) => {
    if (selectedAnswerId !== null) {
      return;
    }

    setSelectedAnswerId(answer.id);

    if (answer.correct) {
      setScore((prevScore) => prevScore + 1);
      alert("Correct answer!");
    } else {
      alert("Wrong answer!");
    }
  };

  const handleNextQuestion = () => {
    if (selectedAnswerId === null) {
      alert("Please choose an answer first.");
      return;
    }

    if (questionNumber === 1) {
      setQuestionNumber(2);
    } else {
      navigate("/result", {
        state: {
          score,
          totalQuestions: 2,
        },
      });
    }
  };

  return (
    <div>
      <h1>Cake Quiz</h1>
      <p>Question {questionNumber} of 2</p>

      {cakeQuestion && (
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
                onClick={() => handleAnswerClick(answer)}
              />
            ))}
          </div>
        </div>
      )}

      <br />

      <button onClick={handleNextQuestion}>
        {questionNumber === 2 ? "Finish Quiz" : "Next Question"}
      </button>

      <p>Score: {score}</p>
    </div>
  );
}

export default Quiz;
