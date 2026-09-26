import { Navigate } from "react-router-dom";
import { isAuthenticated } from "./auth.js";

const HomeRedirect = () => {
  const isDemo = localStorage.getItem("mailtracker-demo") === "true";

  return isAuthenticated() || isDemo ? (
    <Navigate to="/dashboard" replace />
  ) : (
    <Navigate to="/landing" replace />
  );
};

export default HomeRedirect;
