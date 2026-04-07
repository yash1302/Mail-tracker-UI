import { Navigate } from "react-router-dom";
import { isAuthenticated } from "./auth.js";

const PublicRoute = ({ children }) => {
  if (isAuthenticated()) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default PublicRoute;
