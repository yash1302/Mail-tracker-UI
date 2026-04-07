import { useContext } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { userContext } from "../context/userContext";
import Sidebar from "../components/sidebar/Sidebar.jsx";
import Navbar from "../components/Navbar.jsx";
import RequireGmail from "../utils/RequireGmail.jsx";

const MainLayout = () => {
  const { accounts } = useContext(userContext);
  const location = useLocation();
  const hasGmailAccount = accounts && accounts.length > 0;

  // Routes that can be accessed without Gmail
  const allowedWithoutGmail = ["/settings"];
  const isAllowedRoute = allowedWithoutGmail.some(
    (route) => location.pathname === route,
  );

  // If user doesn't have Gmail AND trying to access restricted route
  // Show RequireGmailContent
  if (!hasGmailAccount && !isAllowedRoute) {
    return (
      <div className="flex h-screen bg-slate-50 overflow-hidden">
        <Sidebar />

        <div className="flex flex-col flex-1 overflow-hidden">
          <Navbar />

          <main className="flex-1 overflow-y-auto px-6 py-5">
            <RequireGmail />
          </main>
        </div>
      </div>
    );
  }

  // Otherwise show normal layout with Outlet (includes Settings)
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar />

      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />

        <main className="flex-1 overflow-y-auto px-6 py-5">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
