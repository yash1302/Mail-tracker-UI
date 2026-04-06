import {
  FiSend,
  FiClock,
  FiLayers,
  FiLogOut,
  FiGrid,
  FiEdit3,
  FiInbox,
  FiSettings,
} from "react-icons/fi";

import SidebarItem from "./SidebarItem";
import SidebarSection from "./SidebarSection";
import UserProfile from "./UserProfile.jsx";
import { useLocation, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { userContext } from "../../context/ContextProvider.jsx";

const Sidebar = ({}) => {
  const location = useLocation();
  const { setActive } = useContext(userContext);
  const activeFromPath = location.pathname.split("/")[1];
  const menu = [
    { name: "Dashboard", key: "dashboard", Icon: FiGrid },
    { name: "Drafts", key: "drafts", Icon: FiEdit3 },
    { name: "Send Emails", key: "send_mail", Icon: FiSend },
    { name: "Follow-ups", key: "followups", Icon: FiClock },
  ];
  const navigate = useNavigate();

  const handleClick = (key) => {
    navigate(`/${key}`);
    setActive(key);
  };
  return (
    <div className="w-55 h-screen flex flex-col bg-linear-to-b from-slate-900 to-slate-800 border-r border-white/5 sticky top-0">
      {/* Logo */}
      <div className="px-5 py-4 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-linear-to-br from-indigo-500 to-indigo-400 flex items-center justify-center shadow-lg">
            <FiLayers className="text-white text-sm" />
          </div>

          <div>
            <p className="text-sm font-bold text-slate-100">Outreach</p>
            <p className="text-[10px] text-slate-500 uppercase tracking-wider">
              Manager
            </p>
          </div>
        </div>
      </div>

      {/* Menu */}
      <SidebarSection title="Main Menu">
        {menu.map((item) => (
          <SidebarItem
            key={item.key}
            label={item.name}
            Icon={item.Icon}
            active={activeFromPath === item.key}
            onClick={() => handleClick(item.key)}
          />
        ))}
      </SidebarSection>

      {/* Bottom */}
      <div className="border-t border-white/5 p-3 space-y-2">
        <SidebarItem
          label="Settings"
          Icon={FiSettings}
          active={activeFromPath === "settings"}
          onClick={() => handleClick("settings")}
        />

        <UserProfile />
      </div>
    </div>
  );
};

export default Sidebar;
