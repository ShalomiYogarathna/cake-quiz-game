import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

function ProtectedRoute({ children }) {
  const location = useLocation();
  const { isAuthenticated, isAuthResolved } = useAuth();

  if (!isAuthResolved) {
    return <div className="page-status">Checking your bakery session...</div>;
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ authMessage: "Please log in to continue.", from: location.pathname }}
      />
    );
  }

  return children;
}

export default ProtectedRoute;
