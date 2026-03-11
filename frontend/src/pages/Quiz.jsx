import { useEffect, useState } from "react";

function Quiz() {
  const [score, setScore] = useState(0);
  const [bananaQuestion, setBananaQuestion] = useState(null);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/banana")
      .then((response) => response.json())
      .then((data) => setBananaQuestion(data))
      .catch((error) => console.error("Error loading Banana question:", error));
  }, []);

  const handleCorrectAnswer = () => {
    setScore(1);
    alert("Correct answer!");
  };

  const handleWrongAnswer = () => {
    alert("Wrong answer!");
  };

  return (
    <div>
      <h1>Cake Quiz</h1>

      {bananaQuestion && (
        <div>
          <p>Banana API Question:</p>
          <img
            src={bananaQuestion.question}
            alt="Banana quiz question"
            width="300"
          />
        </div>
      )}

      <p>Question: Which ingredient helps cakes rise?</p>

      <button onClick={handleCorrectAnswer}>Baking Powder</button>
      <br /><br />

      <button onClick={handleWrongAnswer}>Sugar</button>
      <br /><br />

      <button onClick={handleWrongAnswer}>Butter</button>
      <br /><br />

      <button onClick={handleWrongAnswer}>Chocolate</button>

      <br /><br />

      <p>Score: {score}</p>
    </div>
  );
}

export default Quiz;
