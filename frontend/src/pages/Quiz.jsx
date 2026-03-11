import { useEffect, useState } from "react";

function Quiz() {
  const [score, setScore] = useState(0);
  const [cakeQuestion, setCakeQuestion] = useState(null);
  const [questionNumber, setQuestionNumber] = useState(1);

  const loadQuestion = (number) => {
    fetch(`http://127.0.0.1:8000/cake-question${number === 1 ? "" : "-2"}`)
      .then((response) => response.json())
      .then((data) => setCakeQuestion(data))
      .catch((error) => console.error("Error loading cake question:", error));
  };

  useEffect(() => {
    loadQuestion(questionNumber);
  }, [questionNumber]);

  const handleAnswerClick = (isCorrect) => {
    if (isCorrect) {
      setScore((prevScore) => prevScore + 1);
      alert("Correct answer!");
    } else {
      alert("Wrong answer!");
    }
  };

  const handleNextQuestion = () => {
    if (questionNumber === 1) {
      setQuestionNumber(2);
    } else {
      alert("No more questions yet.");
    }
  };

  return (
    <div>
      <h1>Cake Quiz</h1>

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
                }}
                onClick={() => handleAnswerClick(answer.correct)}
              />
            ))}
          </div>
        </div>
      )}

      <br />

      <button onClick={handleNextQuestion}>Next Question</button>

      <p>Score: {score}</p>
    </div>
  );
}

export default Quiz;
