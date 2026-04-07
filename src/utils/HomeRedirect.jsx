import { Navigate } from "react-router-dom";
import { isAuthenticated } from "./auth.js";

const HomeRedirect = () => {
  return isAuthenticated() ? (
    <Navigate to="/dashboard" replace />
  ) : (
    <Navigate to="/landing" replace />
  );
};

export default HomeRedirect;
