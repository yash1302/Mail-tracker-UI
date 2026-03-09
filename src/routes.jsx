import { createBrowserRouter } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import MainLayout from "./layouts/mainLayout";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    children: [
      {
        path: "/",
        element: <Dashboard />,
      },
    ],
  },
]);
