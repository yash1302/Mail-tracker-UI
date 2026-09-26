// components/ProtectedRoute.jsx
import { Navigate } from "react-router-dom";
import { isAuthenticated } from "./auth.js";

const ProtectedRoute = ({ children }) => {
  const isDemo = localStorage.getItem("mailtracker-demo") === "true";

  if (!isAuthenticated() && !isDemo) {
    return <Navigate to="/landing" replace />;
  }

  return children;
};

export default ProtectedRoute;
