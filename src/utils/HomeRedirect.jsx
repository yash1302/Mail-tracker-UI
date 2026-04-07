// components/HomeRedirect.jsx
import { Navigate } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import LandingPage from "../pages/LandingPage";
import { isAuthenticated } from "./auth";
import MainLayout from "../layouts/mainLayout";

const HomeRedirect = () => {
  return isAuthenticated() ? (
    <Navigate to="/dashboard" replace />
  ) : (
    <Navigate to="/landing" replace />
  );
};

export default HomeRedirect;
