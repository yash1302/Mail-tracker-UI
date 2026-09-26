import React, { useEffect, useState, useRef } from "react";
import { FiArrowRight, FiX, FiCheckCircle } from "react-icons/fi";

/*
  DemoConversionToast
  A custom, fancier alternative to react-toastify for the one conversion
  moment that matters: after the visitor has actually engaged with the
  demo (interactionCount reaches threshold) OR after a time-based
  fallback, show a single polished card offering signup — value shown
  before the ask, per conversion best practice. Shown once per session.
*/

const STORAGE_KEY = "mailtracker-demo-conversion-seen";

const handleGoogleAuth = () => {
  window.location.href = `${import.meta.env.VITE_BACKEND_URL}api/auth/googleSignin`;
};

const DemoConversionToast = ({
  interactionCount = 0,
  threshold = 2,
  timeFallbackMs = 30000,
}) => {
  const [visible, setVisible] = useState(false);
  const hasShown = useRef(sessionStorage.getItem(STORAGE_KEY) === "true");

  const show = () => {
    if (hasShown.current) return;
    hasShown.current = true;
    sessionStorage.setItem(STORAGE_KEY, "true");
    setVisible(true);
  };

  useEffect(() => {
    if (interactionCount >= threshold) show();
  }, [interactionCount, threshold]);

  useEffect(() => {
    const timer = setTimeout(show, timeFallbackMs);
    return () => clearTimeout(timer);
  }, [timeFallbackMs]);

  if (!visible) return null;

  return (
    <div
      className="fixed z-50"
      style={{
        right: 22,
        bottom: 22,
        width: "min(92vw, 360px)",
        borderRadius: 18,
        overflow: "hidden",
        background: "#ffffff",
        boxShadow: "0 18px 48px rgba(15,23,42,0.28)",
        border: "1px solid #e5e7eb",
        animation: "conv-slide-in 0.45s cubic-bezier(0.16,1,0.3,1) both",
      }}
    >
      <style>{`
        @keyframes conv-slide-in {
          from { opacity: 0; transform: translateY(20px) scale(0.96); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>

      <div
        style={{
          background: "linear-gradient(135deg,#6366f1,#818cf8)",
          padding: "14px 16px",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <FiCheckCircle size={16} color="#fff" />
        <span style={{ fontSize: 12.5, fontWeight: 700, color: "#fff" }}>
          Liking what you see?
        </span>
        <button
          onClick={() => setVisible(false)}
          aria-label="Dismiss"
          style={{ marginLeft: "auto", background: "transparent", border: "none", color: "rgba(255,255,255,0.85)", cursor: "pointer", padding: 2 }}
        >
          <FiX size={15} />
        </button>
      </div>

      <div style={{ padding: "16px" }}>
        <p style={{ fontSize: 13, color: "#334155", lineHeight: 1.6, margin: "0 0 14px" }}>
          This was sample data — sign up free to connect your own Gmail and
          start tracking real applications. Takes about 10 seconds, same
          Google account.
        </p>

        <button
          onClick={handleGoogleAuth}
          style={{
            width: "100%",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
            padding: "11px 14px", borderRadius: 11,
            background: "#4f46e5", color: "#fff",
            fontSize: 13, fontWeight: 700, border: "none", cursor: "pointer",
          }}
        >
          Sign up free <FiArrowRight size={14} />
        </button>
        <p style={{ textAlign: "center", fontSize: 10.5, color: "#94a3b8", marginTop: 9, marginBottom: 0 }}>
          Free forever · No credit card needed
        </p>
      </div>
    </div>
  );
};

export default DemoConversionToast;