import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Quiz from "./pages/Quiz";
import Result from "./pages/Result";
import Dashboard from "./pages/Dashboard";
import StartScreen from "./pages/StartScreen";

function App() {
  return (
    <Routes>
      <Route path="/" element={<StartScreen />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/quiz"
        element={
          <ProtectedRoute>
            <Quiz />
          </ProtectedRoute>
        }
      />
      <Route
        path="/result"
        element={
          <ProtectedRoute>
            <Result />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}

export default App;
