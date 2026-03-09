import { FiSettings } from "react-icons/fi";

const pageTitles = {
  dashboard: {
    title: "Dashboard",
    sub: "Monitor replies, follow up, and close more deals.",
  },
  drafts: {
    title: "Email Drafts",
    sub: "Create and manage reusable outreach templates.",
  },
  send: {
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
};

const Navbar = ({ active }) => {
  const info = pageTitles[active] || pageTitles.dashboard;

  return (
    <div
      style={{
        height: 54,
        display: "flex",
        alignItems: "center",
        padding: "0 24px",
        background: "#fff",
        borderBottom: "1px solid #f1f5f9",
        flexShrink: 0,
        gap: 10,
      }}
    >
      {/* Page heading */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 10 }}>
          <h1
            style={{
              fontSize: 15,
              fontWeight: 800,
              color: "#0f172a",
              margin: 0,
              letterSpacing: "-0.02em",
              whiteSpace: "nowrap",
            }}
          >
            {info.title}
          </h1>
          <span
            style={{
              fontSize: 12,
              color: "#94a3b8",
              fontWeight: 400,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {info.sub}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Navbar;