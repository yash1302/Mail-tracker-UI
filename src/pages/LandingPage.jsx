import React from "react";
import {
  FiSend,
  FiClock,
  FiInbox,
  FiBarChart2,
  FiUsers,
  FiEdit3,
  FiLayers,
  FiArrowRight,
  FiGlobe,
  FiUserCheck,
  FiCheck,
  FiX,
} from "react-icons/fi";

const LandingPage = ({ onLogin, onSignup }) => {
  const features = [
    {
      icon: <FiSend size={20} />,
      title: "Mass Email Campaigns",
      desc: "Send personalized cold emails to multiple recipients at once without using CC or BCC.",
    },
    {
      icon: <FiClock size={20} />,
      title: "1-Click Followups",
      desc: "Automatically detect emails with no reply after 7 days and send followups instantly.",
    },
    {
      icon: <FiInbox size={20} />,
      title: "Reply-Only Inbox",
      desc: "See only replies from recipients so you can focus on conversations that matter.",
    },
    {
      icon: <FiBarChart2 size={20} />,
      title: "Outreach Analytics",
      desc: "Track emails sent, replies received, followups sent, and overall reply rate.",
    },
    {
      icon: <FiUsers size={20} />,
      title: "Multi-Recipient Sending",
      desc: "Add multiple email addresses and send individual emails automatically.",
    },
    {
      icon: <FiEdit3 size={20} />,
      title: "Reusable Email Templates",
      desc: "Save your best cold email drafts and reuse them in future outreach campaigns.",
    },
  ];

  const stats = [
    { value: "50+", label: "Emails sent in minutes" },
    { value: "7 day", label: "Automatic followup detection" },
    { value: "100%", label: "Replies tracked in inbox" },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        overflowX: "hidden",
        fontFamily: "DM Sans,sans-serif",
      }}
    >
      <style>{`
        @keyframes floatA { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-12px) rotate(3deg)} }
        @keyframes floatB { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-8px) rotate(-2deg)} }
        @keyframes fadeSlideUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
      `}</style>

      {/* Navbar */}
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "20px 60px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 34,
              height: 34,
              borderRadius: 10,
              background: "linear-gradient(135deg,#6366f1,#818cf8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 4px 14px rgba(99,102,241,0.4)",
            }}
          >
            <FiLayers size={17} color="#fff" />
          </div>
          <span
            style={{
              fontSize: 16,
              fontWeight: 700,
              color: "#f1f5f9",
              letterSpacing: "-0.02em",
            }}
          >
            Outreach
          </span>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <button
            onClick={onLogin}
            style={{
              padding: "8px 20px",
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 600,
              border: "1px solid rgba(255,255,255,0.15)",
              background: "transparent",
              color: "#e2e8f0",
              cursor: "pointer",
              fontFamily: "DM Sans,sans-serif",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(255,255,255,0.07)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            Sign in
          </button>
          <button
            onClick={onSignup}
            style={{
              padding: "8px 20px",
              borderRadius: 10,
              fontSize: 13,
              fontWeight: 700,
              border: "none",
              background: "linear-gradient(135deg,#6366f1,#818cf8)",
              color: "#fff",
              cursor: "pointer",
              fontFamily: "DM Sans,sans-serif",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-1px)";
              e.currentTarget.style.boxShadow =
                "0 6px 20px rgba(99,102,241,0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            Get started free
          </button>
        </div>
      </nav>

      {/* Hero */}
      <div
        style={{
          maxWidth: 900,
          margin: "0 auto",
          padding: "90px 40px 70px",
          textAlign: "center",
          animation: "fadeSlideUp 0.7s ease both",
        }}
      >
        {/* Badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 7,
            background: "rgba(99,102,241,0.15)",
            border: "1px solid rgba(99,102,241,0.3)",
            borderRadius: 99,
            padding: "5px 14px",
            marginBottom: 28,
          }}
        >
          <span
            style={{
              width: 7,
              height: 7,
              borderRadius: "50%",
              background: "#818cf8",
              display: "inline-block",
            }}
          />
          <span
            style={{
              fontSize: 12,
              fontWeight: 600,
              color: "#a5b4fc",
              letterSpacing: "0.03em",
            }}
          >
            Built for job outreach, sales & networking
          </span>
        </div>

        <h1
          style={{
            fontSize: "clamp(36px,5vw,62px)",
            fontWeight: 800,
            color: "#f8fafc",
            lineHeight: 1.15,
            letterSpacing: "-0.03em",
            margin: "0 0 22px",
          }}
        >
          Turn cold outreach into
          <br />
          <span
            style={{
              background: "linear-gradient(135deg,#818cf8,#c4b5fd)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            warm conversations
          </span>
        </h1>

        <p
          style={{
            fontSize: 17,
            color: "#94a3b8",
            lineHeight: 1.7,
            maxWidth: 560,
            margin: "0 auto 40px",
          }}
        >
          Outreach Manager helps you send cold emails at scale, track replies,
          manage followups, and monitor outreach performance — all from one
          dashboard.
        </p>

        <div
          style={{
            display: "flex",
            gap: 12,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={onSignup}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "13px 28px",
              borderRadius: 12,
              fontSize: 15,
              fontWeight: 700,
              border: "none",
              background: "linear-gradient(135deg,#6366f1,#818cf8)",
              color: "#fff",
              cursor: "pointer",
              fontFamily: "DM Sans,sans-serif",
              transition: "all 0.2s",
              boxShadow: "0 4px 20px rgba(99,102,241,0.35)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow =
                "0 8px 28px rgba(99,102,241,0.45)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow =
                "0 4px 20px rgba(99,102,241,0.35)";
            }}
          >
            Start for free <FiArrowRight size={16} />
          </button>
          <button
            onClick={onLogin}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "13px 28px",
              borderRadius: 12,
              fontSize: 15,
              fontWeight: 600,
              border: "1px solid rgba(255,255,255,0.15)",
              background: "rgba(255,255,255,0.05)",
              color: "#e2e8f0",
              cursor: "pointer",
              fontFamily: "DM Sans,sans-serif",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "rgba(255,255,255,0.1)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "rgba(255,255,255,0.05)")
            }
          >
            Sign in to your account
          </button>
        </div>
      </div>

      {/* Stats bar */}
      <div
        style={{
          maxWidth: 740,
          margin: "0 auto 80px",
          display: "flex",
          gap: 0,
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 16,
          overflow: "hidden",
        }}
      >
        {stats.map((s, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              padding: "22px 20px",
              textAlign: "center",
              borderRight:
                i < stats.length - 1
                  ? "1px solid rgba(255,255,255,0.07)"
                  : "none",
            }}
          >
            <div
              style={{
                fontSize: 28,
                fontWeight: 800,
                color: "#a5b4fc",
                letterSpacing: "-0.02em",
                marginBottom: 4,
              }}
            >
              {s.value}
            </div>
            <div style={{ fontSize: 12.5, color: "#64748b", fontWeight: 500 }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Feature grid */}
      <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 40px 80px" }}>
        <h2
          style={{
            textAlign: "center",
            fontSize: 28,
            fontWeight: 700,
            color: "#f1f5f9",
            marginBottom: 10,
            letterSpacing: "-0.02em",
          }}
        >
          Everything in one place
        </h2>
        <p
          style={{
            textAlign: "center",
            fontSize: 14.5,
            color: "#64748b",
            marginBottom: 40,
          }}
        >
          No more juggling Gmail tabs, spreadsheets, and sticky notes.
        </p>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: 14,
          }}
        >
          {features.map((f, i) => (
            <div
              key={i}
              className="landing-feature-card"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 11,
                  background: "rgba(99,102,241,0.2)",
                  color: "#818cf8",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 14,
                }}
              >
                {f.icon}
              </div>
              <h3
                style={{
                  fontSize: 14.5,
                  fontWeight: 700,
                  color: "#f1f5f9",
                  margin: "0 0 7px",
                }}
              >
                {f.title}
              </h3>
              <p
                style={{
                  fontSize: 13,
                  color: "#64748b",
                  margin: 0,
                  lineHeight: 1.6,
                }}
              >
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Feature comparison: logged-out vs logged-in */}
      <div style={{ maxWidth: 820, margin: "0 auto", padding: "0 40px 80px" }}>
        <h2
          style={{
            textAlign: "center",
            fontSize: 26,
            fontWeight: 700,
            color: "#f1f5f9",
            marginBottom: 10,
            letterSpacing: "-0.02em",
          }}
        >
          What's included?
        </h2>
        <p
          style={{
            textAlign: "center",
            fontSize: 14,
            color: "#64748b",
            marginBottom: 36,
          }}
        >
          Sign up to unlock the full platform.
        </p>
        <div
          style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}
        >
          {/* Logged-out */}
          <div
            style={{
              background: "rgba(255,255,255,0.03)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 16,
              padding: "24px 22px",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 18,
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 9,
                  background: "rgba(255,255,255,0.07)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FiGlobe size={15} color="#64748b" />
              </div>
              <div>
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#94a3b8",
                    margin: 0,
                  }}
                >
                  Without account
                </p>
                <p style={{ fontSize: 11, color: "#475569", margin: 0 }}>
                  Visitor access
                </p>
              </div>
            </div>
            {[
              ["Explore product overview", true],
              ["View platform features", true],
              ["Learn how outreach works", true],
              ["Send cold email campaigns", false],
              ["Access reply inbox", false],
              ["Create email templates", false],
              ["Track outreach analytics", false],
              ["Send followups automatically", false],
            ].map(([item, avail], i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 9,
                  marginBottom: 10,
                }}
              >
                <div
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    background: avail
                      ? "rgba(16,185,129,0.15)"
                      : "rgba(239,68,68,0.1)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {avail ? (
                    <FiCheck size={10} color="#10b981" />
                  ) : (
                    <FiX size={10} color="#ef4444" />
                  )}
                </div>
                <span
                  style={{ fontSize: 13, color: avail ? "#94a3b8" : "#475569" }}
                >
                  {item}
                </span>
              </div>
            ))}
          </div>
          {/* Logged-in */}
          <div
            style={{
              background: "rgba(99,102,241,0.08)",
              border: "1px solid rgba(99,102,241,0.25)",
              borderRadius: 16,
              padding: "24px 22px",
              position: "relative",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: -20,
                right: -20,
                width: 100,
                height: 100,
                borderRadius: "50%",
                background: "rgba(99,102,241,0.15)",
                filter: "blur(20px)",
              }}
            />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                marginBottom: 18,
              }}
            >
              <div
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 9,
                  background: "rgba(99,102,241,0.2)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <FiUserCheck size={15} color="#818cf8" />
              </div>
              <div>
                <p
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#a5b4fc",
                    margin: 0,
                  }}
                >
                  Signed-in user
                </p>
                <p style={{ fontSize: 11, color: "#6366f1", margin: 0 }}>
                  Full platform access
                </p>
              </div>
            </div>
            {[
              ["Send cold emails to multiple recipients", true],
              ["Track replies in a dedicated inbox", true],
              ["Create and reuse email templates", true],
              ["Automatic 7-day followup queue", true],
              ["Send followups with one click", true],
              ["Monitor reply rate and outreach analytics", true],
              ["Manage email campaigns from dashboard", true],
              ["Track sent emails and followup status", true],
            ].map(([item], i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 9,
                  marginBottom: 10,
                }}
              >
                <div
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    background: "rgba(16,185,129,0.2)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <FiCheck size={10} color="#10b981" />
                </div>
                <span style={{ fontSize: 13, color: "#94a3b8" }}>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ textAlign: "center", padding: "0 40px 80px" }}>
        <div
          style={{
            display: "inline-block",
            background: "rgba(99,102,241,0.1)",
            border: "1px solid rgba(99,102,241,0.2)",
            borderRadius: 20,
            padding: "40px 60px",
          }}
        >
          <h2
            style={{
              fontSize: 26,
              fontWeight: 700,
              color: "#f1f5f9",
              margin: "0 0 10px",
              letterSpacing: "-0.02em",
            }}
          >
            Ready to get more replies?
          </h2>
          <p style={{ fontSize: 14, color: "#64748b", margin: "0 0 24px" }}>
            Start managing your cold email outreach, replies, and followups from
            one place.
          </p>
          <button
            onClick={onSignup}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "13px 32px",
              borderRadius: 12,
              fontSize: 15,
              fontWeight: 700,
              border: "none",
              background: "linear-gradient(135deg,#6366f1,#818cf8)",
              color: "#fff",
              cursor: "pointer",
              fontFamily: "DM Sans,sans-serif",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "translateY(-2px)";
              e.currentTarget.style.boxShadow =
                "0 8px 28px rgba(99,102,241,0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "none";
              e.currentTarget.style.boxShadow = "none";
            }}
          >
            Create your free account <FiArrowRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
