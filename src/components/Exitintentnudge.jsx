import React, { useEffect, useState, useRef } from "react";
import { FiArrowRight, FiX } from "react-icons/fi";

/*
  ExitIntentNudge
  Shows once per session, whichever comes first:
  - user scrolls past `scrollThreshold` (default 70%) without clicking any CTA
  - user's mouse leaves the top of the viewport (desktop exit-intent)
  Dismissible, never repeats after shown or dismissed.
*/

const ExitIntentNudge = ({ onExploreDemo, scrollThreshold = 0.7 }) => {
  const [visible, setVisible] = useState(false);
  const hasShown = useRef(false);
  const hasInteracted = useRef(false);

  const markInteracted = () => {
    hasInteracted.current = true;
  };

  useEffect(() => {
    const trigger = () => {
      if (hasShown.current || hasInteracted.current) return;
      hasShown.current = true;
      setVisible(true);
    };

    const onScroll = () => {
      const scrolled =
        window.scrollY / (document.documentElement.scrollHeight - window.innerHeight);
      if (scrolled >= scrollThreshold) trigger();
    };

    const onMouseLeave = (e) => {
      if (e.clientY <= 0) trigger();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("mouseleave", onMouseLeave);
    return () => {
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("mouseleave", onMouseLeave);
    };
  }, [scrollThreshold]);

  if (!visible) return null;

  return (
    <div
      style={{
        position: "fixed",
        left: "50%",
        bottom: 22,
        transform: "translateX(-50%)",
        zIndex: 60,
        width: "min(92vw, 480px)",
        background: "rgba(15,23,42,0.97)",
        border: "1px solid rgba(129,140,248,0.35)",
        borderRadius: 16,
        padding: "16px 18px",
        boxShadow: "0 12px 40px rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        gap: 14,
        animation: "nudge-slide-up 0.4s ease both",
      }}
    >
      <style>{`
        @keyframes nudge-slide-up {
          from { opacity: 0; transform: translate(-50%, 16px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
      `}</style>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13.5, fontWeight: 700, color: "#f1f5f9", marginBottom: 2 }}>
          Curious how it actually works?
        </div>
        <div style={{ fontSize: 12, color: "#94a3b8" }}>
          Explore the live demo — no signup needed, no card required.
        </div>
      </div>

      <button
        onClick={() => {
          markInteracted();
          setVisible(false);
          onExploreDemo?.();
        }}
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 6,
          padding: "9px 14px",
          borderRadius: 10,
          background: "linear-gradient(135deg,#6366f1,#818cf8)",
          color: "#fff",
          fontSize: 12.5,
          fontWeight: 700,
          border: "none",
          cursor: "pointer",
          whiteSpace: "nowrap",
          flexShrink: 0,
        }}
      >
        Try demo <FiArrowRight size={13} />
      </button>

      <button
        onClick={() => {
          markInteracted();
          setVisible(false);
        }}
        aria-label="Dismiss"
        style={{
          background: "transparent",
          border: "none",
          color: "#475569",
          cursor: "pointer",
          padding: 4,
          flexShrink: 0,
        }}
      >
        <FiX size={16} />
      </button>
    </div>
  );
};

export default ExitIntentNudge;