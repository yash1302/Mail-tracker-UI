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

const Sidebar = ({ active, setActive, user, onLogout }) => {
  const menu = [
    { name: "Dashboard",   key: "dashboard", Icon: FiGrid   },
    { name: "Drafts",      key: "drafts",    Icon: FiEdit3  },
    { name: "Send Emails", key: "send",      Icon: FiSend   },
    { name: "Follow-ups",  key: "followups", Icon: FiClock  },
    { name: "Inbox",       key: "inbox",     Icon: FiInbox  },
  ];

  const initial = user?.name?.[0]?.toUpperCase() ?? "O";
  const displayName = user?.name ?? "Omar";

  return (
    <div
      style={{
        width: 220,
        flexShrink: 0,
        background: "linear-gradient(180deg,#0f172a 0%,#1e293b 100%)",
        display: "flex",
        flexDirection: "column",
        borderRight: "1px solid rgba(255,255,255,0.06)",
        height: "100vh",
        position: "sticky",
        top: 0,
      }}
    >
      {/* Logo */}
      <div
        style={{
          padding: "18px 18px 16px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 9,
              background: "linear-gradient(135deg,#6366f1,#818cf8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 12px rgba(99,102,241,0.4)",
              flexShrink: 0,
            }}
          >
            <FiLayers size={15} color="#fff" />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#f1f5f9", letterSpacing: "-0.01em" }}>
              Outreach
            </div>
            <div style={{ fontSize: 10, color: "#64748b", fontWeight: 500, letterSpacing: "0.05em", textTransform: "uppercase" }}>
              Manager
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav
        style={{
          padding: "12px 10px",
          flex: 1,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          overflowY: "auto",
        }}
      >
        <div
          style={{
            fontSize: 9.5,
            fontWeight: 600,
            color: "#475569",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            padding: "0 10px",
            marginBottom: 5,
          }}
        >
          Main Menu
        </div>
        {menu.map(({ name, key, Icon }) => (
          <button
            key={key}
            onClick={() => setActive(key)}
            className={`nav-item ${active === key ? "active" : ""}`}
          >
            <Icon size={14} />
            <span style={{ flex: 1, textAlign: "left" }}>{name}</span>
            <span className="nav-dot" />
          </button>
        ))}
      </nav>

      {/* Bottom actions: Settings + User */}
      <div
        style={{
          padding: "10px 10px 14px",
          borderTop: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          flexDirection: "column",
          gap: 2,
          flexShrink: 0,
        }}
      >
        {/* Settings */}
        <button
          onClick={() => setActive("settings")}
          className={`nav-item ${active === "settings" ? "active" : ""}`}
        >
          <FiSettings size={14} />
          <span style={{ flex: 1, textAlign: "left" }}>Settings</span>
        </button>

        {/* User row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 9,
            padding: "8px 10px",
            borderRadius: 10,
            cursor: "pointer",
            marginTop: 4,
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.05)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
        >
          <div
            style={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              background: "linear-gradient(135deg,#6366f1,#a78bfa)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 12,
              fontWeight: 700,
              color: "#fff",
              flexShrink: 0,
            }}
          >
            {initial}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontSize: 12.5,
                fontWeight: 600,
                color: "#e2e8f0",
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {displayName}
            </div>
            <div style={{ fontSize: 10.5, color: "#64748b" }}>Admin</div>
          </div>
          <button
            onClick={onLogout}
            title="Log out"
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              color: "#475569",
              display: "flex",
              alignItems: "center",
              padding: 4,
              borderRadius: 6,
              transition: "color 0.15s",
              flexShrink: 0,
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#ef4444")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#475569")}
          >
            <FiLogOut size={13} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;