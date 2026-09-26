import React, { useState } from "react";
import { FiArrowRight, FiX } from "react-icons/fi";

/*
  DemoWalkthrough
  Steps through real dashboard sections (not fake screenshots) using a
  ring-highlight + floating guide card. Consumer passes `steps` (key,
  title, desc) and a render-prop `children(activeKey, isStepActive)` so
  the actual JSX sections can get the highlight ring class conditionally.

  Shown once per demo session (sessionStorage flag) so it doesn't nag on
  every dashboard visit within the same session.
*/

const STORAGE_KEY = "mailtracker-demo-walkthrough-seen";

const DemoWalkthrough = ({ steps, children }) => {
  const [stepIndex, setStepIndex] = useState(0);
  const [dismissed, setDismissed] = useState(
    () => sessionStorage.getItem(STORAGE_KEY) === "true"
  );

  const finish = () => {
    sessionStorage.setItem(STORAGE_KEY, "true");
    setDismissed(true);
  };

  const next = () => {
    if (stepIndex >= steps.length - 1) {
      finish();
    } else {
      setStepIndex((i) => i + 1);
    }
  };

  const activeKey = dismissed ? null : steps[stepIndex]?.key;
  const isStepActive = (key) => activeKey === key;

  const current = steps[stepIndex];

  return (
    <>
      {children(activeKey, isStepActive)}

      {!dismissed && current && (
        <div
          className="fixed z-50"
          style={{
            right: 22,
            bottom: 22,
            width: "min(92vw, 340px)",
            background: "#0f172a",
            border: "1px solid rgba(129,140,248,0.35)",
            borderRadius: 16,
            padding: "16px 18px",
            boxShadow: "0 14px 40px rgba(0,0,0,0.4)",
            animation: "walkthrough-pop 0.35s ease both",
          }}
        >
          <style>{`
            @keyframes walkthrough-pop {
              from { opacity: 0; transform: translateY(12px) scale(0.97); }
              to { opacity: 1; transform: translateY(0) scale(1); }
            }
          `}</style>

          <div className="flex items-start justify-between gap-2 mb-2">
            <div className="flex items-center gap-1.5">
              {steps.map((s, i) => (
                <span
                  key={s.key}
                  style={{
                    width: i === stepIndex ? 16 : 6,
                    height: 6,
                    borderRadius: 99,
                    background: i === stepIndex ? "#818cf8" : "rgba(255,255,255,0.15)",
                    transition: "all 0.25s ease",
                  }}
                />
              ))}
            </div>
            <button
              onClick={finish}
              aria-label="Skip walkthrough"
              style={{ background: "transparent", border: "none", color: "#475569", cursor: "pointer", padding: 2 }}
            >
              <FiX size={15} />
            </button>
          </div>

          <div style={{ fontSize: 13.5, fontWeight: 700, color: "#f1f5f9", marginBottom: 4 }}>
            {current.title}
          </div>
          <div style={{ fontSize: 12, color: "#94a3b8", lineHeight: 1.6, marginBottom: 14 }}>
            {current.desc}
          </div>

          <div className="flex items-center justify-between">
            <button
              onClick={finish}
              style={{ background: "transparent", border: "none", color: "#64748b", fontSize: 11.5, fontWeight: 600, cursor: "pointer" }}
            >
              Skip
            </button>
            <button
              onClick={next}
              style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "8px 14px", borderRadius: 9,
                background: "linear-gradient(135deg,#6366f1,#818cf8)",
                color: "#fff", fontSize: 12, fontWeight: 700,
                border: "none", cursor: "pointer",
              }}
            >
              {stepIndex >= steps.length - 1 ? "Got it" : "Next"} <FiArrowRight size={12} />
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default DemoWalkthrough;