import { useEffect, useState } from "react";

function Quiz() {
  const [score, setScore] = useState(0);
  const [cakeQuestion, setCakeQuestion] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/cake-question")
      .then((response) => response.json())
      .then((data) => setCakeQuestion(data))
      .catch((error) => console.error("Error loading cake question:", error));
  }, []);

  const handleAnswerClick = (isCorrect) => {
    if (isCorrect) {
      setScore(1);
      alert("Correct answer!");
    } else {
      alert("Wrong answer!");
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

      <p>Score: {score}</p>
    </div>
  );
}

export default Quiz;
