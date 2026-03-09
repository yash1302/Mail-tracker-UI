import { Outlet } from "react-router-dom";

import FontLink from "../styles/dashboardFonts.jsx";
import Sidebar from "../components/sidebar/Sidebar.jsx";
import Navbar from "../components/Navbar.jsx";

const MainLayout = () => {
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar />

      <div className="flex flex-col flex-1 overflow-hidden">
        {/* <FontLink/> */}
        <Navbar />

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto px-6 py-5">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
