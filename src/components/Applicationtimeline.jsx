import React, { useState, useEffect } from "react";
import {
  FiSend,
  FiEye,
  FiClock,
  FiRefreshCw,
  FiMessageCircle,
} from "react-icons/fi";

/*
  ApplicationTimeline
  Auto-cycling visual: shows one sample application moving through its
  life cycle — Sent -> Opened -> No reply (day 7) -> Follow-up sent -> Replied.
  Pure presentational, no backend/demo wiring needed.
*/

const STEPS = [
  {
    key: "sent",
    label: "Sent to Google",
    caption: "Application delivered to recruiter@google.com",
    icon: <FiSend size={18} />,
  },
  {
    key: "opened",
    label: "Resume opened",
    caption: "Recruiter clicked your resume link",
    icon: <FiEye size={18} />,
  },
  {
    key: "noreply",
    label: "No reply — Day 7",
    caption: "Auto-added to your follow-up queue",
    icon: <FiClock size={18} />,
  },
  {
    key: "followup",
    label: "Follow-up sent",
    caption: "AI-written follow-up sent with one click",
    icon: <FiRefreshCw size={18} />,
  },
  {
    key: "replied",
    label: "Replied!",
    caption: "Recruiter responded — conversation started",
    icon: <FiMessageCircle size={18} />,
  },
];

const STEP_DURATION = 2200;

const ApplicationTimeline = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % STEPS.length);
    }, STEP_DURATION);
    return () => clearInterval(interval);
  }, []);

  const isDone = (i) => i < activeIndex || activeIndex === STEPS.length - 1 && i <= activeIndex;
  const isActive = (i) => i === activeIndex;

  return (
    <div
      style={{
        maxWidth: 760,
        margin: "0 auto",
        padding: "28px 30px 32px",
        borderRadius: 18,
        background: "rgba(255,255,255,0.035)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <style>{`
        @keyframes tl-pulse-ring {
          0% { box-shadow: 0 0 0 0 rgba(129,140,248,0.55); }
          70% { box-shadow: 0 0 0 10px rgba(129,140,248,0); }
          100% { box-shadow: 0 0 0 0 rgba(129,140,248,0); }
        }
        @keyframes tl-fade-in {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .tl-node {
          width: 34px; height: 34px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          flex-shrink: 0;
          border: 2px solid rgba(255,255,255,0.12);
          background: rgba(255,255,255,0.04);
          color: #475569;
          transition: all 0.35s ease;
          position: relative;
          z-index: 1;
        }
        .tl-node.done {
          border-color: #6366f1;
          background: rgba(99,102,241,0.18);
          color: #a5b4fc;
        }
        .tl-node.active {
          border-color: #818cf8;
          background: linear-gradient(135deg,#6366f1,#818cf8);
          color: #fff;
          animation: tl-pulse-ring 1.6s ease-out infinite;
        }
        .tl-track {
          position: absolute;
          top: 17px; left: 17px; right: 17px;
          height: 2px;
          background: rgba(255,255,255,0.1);
          z-index: 0;
        }
        .tl-track-fill {
          position: absolute;
          top: 17px; left: 17px;
          height: 2px;
          background: linear-gradient(90deg,#6366f1,#818cf8);
          z-index: 0;
          transition: width 0.5s ease;
        }
        .tl-label {
          font-size: 10.5px;
          color: #64748b;
          text-align: center;
          margin-top: 9px;
          font-weight: 600;
          line-height: 1.3;
          transition: color 0.3s ease;
        }
        .tl-label.active { color: #c7d2fe; }
      `}</style>

      <div
        style={{
          textAlign: "center",
          fontSize: 11.5,
          fontWeight: 700,
          color: "#818cf8",
          letterSpacing: "0.06em",
          marginBottom: 22,
        }}
      >
        ONE APPLICATION, START TO FINISH
      </div>

      {/* Node row */}
      <div style={{ position: "relative", display: "flex", justifyContent: "space-between" }}>
        <div className="tl-track" />
        <div
          className="tl-track-fill"
          style={{
            width: `calc(${(activeIndex / (STEPS.length - 1)) * 100}% - ${
              activeIndex === 0 ? 0 : 34 * (activeIndex / (STEPS.length - 1))
            }px)`,
          }}
        />
        {STEPS.map((step, i) => (
          <div key={step.key} style={{ display: "flex", flexDirection: "column", alignItems: "center", width: `${100 / STEPS.length}%` }}>
            <div className={`tl-node${isActive(i) ? " active" : i < activeIndex ? " done" : ""}`}>
              {step.icon}
            </div>
            <div className={`tl-label${isActive(i) ? " active" : ""}`}>{step.label}</div>
          </div>
        ))}
      </div>

      {/* Active step caption card */}
      <div
        key={activeIndex}
        style={{
          marginTop: 26,
          padding: "14px 18px",
          borderRadius: 12,
          background: "rgba(99,102,241,0.08)",
          border: "1px solid rgba(99,102,241,0.2)",
          textAlign: "center",
          animation: "tl-fade-in 0.4s ease both",
        }}
      >
        <div style={{ fontSize: 13.5, fontWeight: 700, color: "#e2e8f0", marginBottom: 3 }}>
          {STEPS[activeIndex].label}
        </div>
        <div style={{ fontSize: 12, color: "#94a3b8" }}>
          {STEPS[activeIndex].caption}
        </div>
      </div>
    </div>
  );
};

export default ApplicationTimeline;