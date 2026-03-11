import { Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Quiz from "./pages/Quiz";
import Result from "./pages/Result";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/quiz" element={<Quiz />} />
      <Route path="/result" element={<Result />} />
    </Routes>
  );
}

export default App;
