import React from "react";
import { FiArrowRight, FiZap } from "react-icons/fi";

/*
  DemoSignupBanner
  Sticky strip shown only when demoMode is true, pinned above dashboard
  content. Reduces signup friction with explicit "free / no card" microcopy
  and a single clear CTA that reuses the same Google auth redirect as the
  landing page.
*/

const handleGoogleAuth = () => {
  window.location.href = `${import.meta.env.VITE_BACKEND_URL}api/auth/googleSignin`;
};

const DemoSignupBanner = () => {
  return (
    <div
      className="sticky top-0 z-20 flex items-center justify-between gap-3 px-4 py-2.5 rounded-[12px] shrink-0"
      style={{
        background: "linear-gradient(90deg, #eef2ff 0%, #e0e7ff 100%)",
        border: "1px solid #c7d2fe",
      }}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
          style={{ background: "#6366f1" }}
        >
          <FiZap size={13} color="#fff" />
        </div>
        <div className="min-w-0">
          <p className="text-[12px] font-bold text-indigo-900 truncate">
            You're viewing sample demo data
          </p>
          <p className="text-[10.5px] text-indigo-500/80 truncate">
            Sign up free to connect your Gmail and keep real data — no credit card needed
          </p>
        </div>
      </div>

      <button
        onClick={handleGoogleAuth}
        className="hover:cursor-pointer flex items-center gap-1.5 px-3.5 py-2 rounded-[9px] text-[11.5px] font-bold text-white shrink-0 transition hover:opacity-90"
        style={{ background: "#4f46e5" }}
      >
        Sign up free
        <FiArrowRight size={12} />
      </button>
    </div>
  );
};

export default DemoSignupBanner;