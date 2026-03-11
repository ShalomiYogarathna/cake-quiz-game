import { useState } from "react";

function Quiz() {
  const [score, setScore] = useState(0);

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
