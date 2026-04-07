import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./layouts/MainLayout.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Drafts from "./pages/Drafts.jsx";
import SendEmails from "./pages/SendEmails.jsx";
import Followups from "./pages/Followups.jsx";
import Signup from "./pages/Signup.jsx";
import Login from "./pages/Login.jsx";
import Settings from "./pages/Settings.jsx";
import HomeRedirect from "./utils/HomeRedirect.jsx";
import PublicRoute from "./utils/PublicRoute.jsx";
import ProtectedRoute from "./utils/ProtectedRoute.jsx";
import LandingPage from "./pages/LandingPage.jsx";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeRedirect />,
  },
  {
    path: "/landing",
    element: (
      <PublicRoute>
        <LandingPage />
      </PublicRoute>
    ),
  },

  // 🔓 Public
  {
    path: "/login",
    element: (
      <PublicRoute>
        <Login />
      </PublicRoute>
    ),
  },
  {
    path: "/signup",
    element: (
      <PublicRoute>
        <Signup />
      </PublicRoute>
    ),
  },

  // 🔒 Protected
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: "/", element: <Dashboard /> },
      { path: "/dashboard", element: <Dashboard /> },
      { path: "/drafts", element: <Drafts /> },
      { path: "/send_mail", element: <SendEmails /> },
      { path: "/followups", element: <Followups /> },
      { path: "/settings", element: <Settings /> },
    ],
  },
]);
