import { createBrowserRouter } from "react-router-dom";
import MainLayout from "./layouts/mainLayout";
import Dashboard from "./pages/Dashboard";
import Drafts from "./pages/Drafts";
import SendEmails from "./pages/SendEmails";
import Followups from "./pages/Followups";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Settings from "./pages/Settings";
import HomeRedirect from "./utils/HomeRedirect";
import PublicRoute from "./utils/PublicRoute";
import ProtectedRoute from "./utils/ProtectedRoute";
import LandingPage from "./pages/LandingPage";

export const router = createBrowserRouter([
  // 🔥 Root route (important)
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
