import { useContext } from "react";
import { userContext } from "../context/userContext.js";

const pageTitles = {
  dashboard: {
    title: "Dashboard",
    sub: "Monitor replies, follow up, and close more deals.",
  },
  drafts: {
    title: "Email Drafts",
    sub: "Create and manage reusable outreach templates.",
  },
  send_mail: {
    title: "Send Emails",
    sub: "Compose and dispatch outreach campaigns.",
  },
  followups: {
    title: "Follow-ups",
    sub: "Track and manage pending follow-up sequences.",
  },
  inbox: {
    title: "Inbox",
    sub: "View and respond to incoming messages.",
  },
  settings: {
    title: "Settings",
    sub: "Manage your connected Gmail accounts and app preferences.",
  },
};

const Navbar = () => {
  const { active } = useContext(userContext);

  const info = pageTitles[active] || pageTitles.dashboard;

  return (
    <div className="h-[54px] flex items-center px-6 bg-white border-b border-slate-100 flex-shrink-0">
      {/* Page Heading */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-3">
          <h1 className="text-[15px] font-bold text-slate-900 tracking-tight whitespace-nowrap">
            {info.title}
          </h1>

          <span className="text-xs text-slate-400 font-normal truncate">
            {info.sub}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
