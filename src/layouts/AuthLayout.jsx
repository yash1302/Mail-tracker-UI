import React from "react";

import { FiLayers, FiChevronLeft } from "react-icons/fi";

const AuthLayout = ({ children, onBack }) => (
  <div
    style={{
      minHeight: "100vh",
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      fontFamily: "DM Sans,sans-serif",
    }}
  >
    {/* Left panel – branding */}
    <div
      style={{
        background:
          "linear-gradient(160deg,#0f172a 0%,#1e1b4b 60%,#312e81 100%)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "40px 50px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative orbs */}
      <div
        style={{
          position: "absolute",
          top: -60,
          right: -60,
          width: 280,
          height: 280,
          borderRadius: "50%",
          background: "rgba(99,102,241,0.18)",
          filter: "blur(50px)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -40,
          left: -40,
          width: 200,
          height: 200,
          borderRadius: "50%",
          background: "rgba(139,92,246,0.15)",
          filter: "blur(40px)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "40%",
          left: "60%",
          width: 120,
          height: 120,
          borderRadius: "50%",
          background: "rgba(99,102,241,0.1)",
          filter: "blur(30px)",
          pointerEvents: "none",
        }}
      />

      {/* Logo */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          position: "relative",
          zIndex: 1,
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: 11,
            background: "linear-gradient(135deg,#6366f1,#818cf8)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 4px 16px rgba(99,102,241,0.45)",
          }}
        >
          <FiLayers size={18} color="#fff" />
        </div>
        <span
          style={{
            fontSize: 18,
            fontWeight: 700,
            color: "#f1f5f9",
            letterSpacing: "-0.02em",
          }}
        >
          Outreach
        </span>
      </div>

      {/* Floating card mockup */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          animation: "floatA 5s ease-in-out infinite",
        }}
      >
        <div
          style={{
            background: "rgba(255,255,255,0.07)",
            border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: 18,
            padding: "20px 22px",
            marginBottom: 14,
            backdropFilter: "blur(10px)",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 14,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "linear-gradient(135deg,#818cf8,#c4b5fd)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 14,
                fontWeight: 700,
                color: "#fff",
              }}
            >
              M
            </div>
            <div>
              <p
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#f1f5f9",
                  margin: 0,
                }}
              >
                Maya Tran replied
              </p>
              <p style={{ fontSize: 11.5, color: "#94a3b8", margin: 0 }}>
                Re: Partnership Opportunity
              </p>
            </div>
            <span
              style={{
                marginLeft: "auto",
                fontSize: 11,
                background: "rgba(16,185,129,0.2)",
                color: "#6ee7b7",
                padding: "3px 9px",
                borderRadius: 20,
                fontWeight: 600,
                flexShrink: 0,
              }}
            >
              Replied
            </span>
          </div>
          <p
            style={{
              fontSize: 12.5,
              color: "#94a3b8",
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            "Thanks for reaching out — this looks really interesting. Let's hop
            on a call Thursday?"
          </p>
        </div>
        {/* Mini stat row */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 10,
          }}
        >
          {[
            { v: "24", l: "Emails sent" },
            { v: "8", l: "Replies" },
            { v: "3×", l: "More opens" },
          ].map((s, i) => (
            <div
              key={i}
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid rgba(255,255,255,0.09)",
                borderRadius: 11,
                padding: "12px",
                textAlign: "center",
                animation: `floatB ${4 + i * 0.5}s ease-in-out infinite`,
                animationDelay: `${i * 200}ms`,
              }}
            >
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  color: "#a5b4fc",
                  lineHeight: 1,
                }}
              >
                {s.v}
              </div>
              <div style={{ fontSize: 10.5, color: "#64748b", marginTop: 3 }}>
                {s.l}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tagline */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <p
          style={{
            fontSize: 22,
            fontWeight: 700,
            color: "#f1f5f9",
            lineHeight: 1.4,
            margin: "0 0 10px",
            letterSpacing: "-0.02em",
          }}
        >
          Your outreach,
          <br />
          on autopilot.
        </p>
        <p style={{ fontSize: 13, color: "#64748b", margin: 0 }}>
          Manage every email, reply, and follow-up from one place.
        </p>
      </div>
    </div>

    {/* Right panel – form */}
    <div
      style={{
        background: "#f8fafc",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "40px 50px",
        position: "relative",
      }}
    >
      <button
        onClick={onBack}
        style={{
          position: "absolute",
          top: 24,
          left: 24,
          display: "flex",
          alignItems: "center",
          gap: 6,
          background: "none",
          border: "none",
          cursor: "pointer",
          color: "#94a3b8",
          fontSize: 13,
          fontWeight: 500,
          fontFamily: "DM Sans,sans-serif",
          transition: "color 0.15s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "#374151")}
        onMouseLeave={(e) => (e.currentTarget.style.color = "#94a3b8")}
      >
        <FiChevronLeft size={14} /> Back
      </button>
      <div
        style={{
          width: "100%",
          maxWidth: 380,
          animation: "slideIn 0.4s ease both",
        }}
      >
        {children}
      </div>
    </div>
  </div>
);

export default AuthLayout;
