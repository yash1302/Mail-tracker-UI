import React, { useContext, useState, useEffect, useRef } from "react";
import { FcGoogle } from "react-icons/fc";
import {
  FiSend,
  FiClock,
  FiInbox,
  FiBarChart2,
  FiEdit3,
  FiLayers,
  FiArrowRight,
  FiActivity,
  FiRefreshCw,
  FiChevronDown,
  FiZap,
  FiMousePointer,
  FiGithub,
  FiLinkedin,
  FiX,
  FiCheck,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { userContext } from "../context/userContext.js";
import ApplicationTimeline from "../components/Applicationtimeline.jsx";
import ExitIntentNudge from "../components/Exitintentnudge.jsx";

/* Scroll-reveal wrapper: fades+slides up once when it enters viewport */
const Reveal = ({ children, delay = 0, style = {} }) => {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(22px)",
        transition: `opacity 0.6s ease ${delay}ms, transform 0.6s ease ${delay}ms`,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

const LandingPage = () => {
  const navigate = useNavigate();
  const { enterDemoMode } = useContext(userContext);

  const [openFeature, setOpenFeature] = useState(0);
  const [openFaq, setOpenFaq] = useState(null);
  const [scrolled, setScrolled] = useState(false);

  const [stats, setStats] = useState({ sent: 0, replies: 0, followups: 0 });
  const teaserRef = useRef(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const target = { sent: 247, replies: 38, followups: 12 };
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated.current) {
            hasAnimated.current = true;
            const duration = 1400;
            const start = performance.now();
            const tick = (now) => {
              const progress = Math.min((now - start) / duration, 1);
              const ease = 1 - Math.pow(1 - progress, 3);
              setStats({
                sent: Math.round(target.sent * ease),
                replies: Math.round(target.replies * ease),
                followups: Math.round(target.followups * ease),
              });
              if (progress < 1) requestAnimationFrame(tick);
            };
            requestAnimationFrame(tick);
          }
        });
      },
      { threshold: 0.4 }
    );
    if (teaserRef.current) observer.observe(teaserRef.current);
    return () => observer.disconnect();
  }, []);

  const features = [
    {
      icon: <FiSend size={19} />,
      title: "Bulk Job Applications",
      short: "Apply to many companies at once with a personalized email to each recruiter.",
      detail:
        "Add a list of recruiter or HR emails and MailTracker sends each one an individual, personalized application — nobody sees the other companies you applied to. Apply to 30 roles in the time it used to take for 3.",
    },
    {
      icon: <FiEdit3 size={19} />,
      title: "Application Drafts You Can Reuse",
      short: "Save your best cover-letter email as a draft and reuse it for future applications.",
      detail:
        "Write your pitch once and save it as a draft. Next time, just pick the draft, attach the recruiter list for that batch, and send — no retyping the same cover letter for every company.",
    },
    {
      icon: <FiMousePointer size={19} />,
      title: "Resume/Portfolio Click Tracking",
      short: "Know exactly when a recruiter clicks your resume, portfolio, or LinkedIn link.",
      detail:
        "Drop your resume, portfolio, or LinkedIn link into your application email — MailTracker logs every click. Instantly see which recruiters actually opened your profile, so you know who's genuinely interested.",
    },
    {
      icon: <FiClock size={19} />,
      title: "Automatic Follow-up Queue",
      short: "Applications with no reply after 7 days are added to a follow-up queue.",
      detail:
        "No more manually tracking which recruiters ghosted you. If a company hasn't replied in 7 days, MailTracker automatically drops that application into your follow-up queue so no lead slips through.",
    },
    {
      icon: <FiZap size={19} />,
      title: "AI-Written Follow-ups",
      short: "AI reads your original application and writes a context-aware follow-up.",
      detail:
        "MailTracker's AI looks at the application you sent and the thread so far, then drafts a natural follow-up that references your original pitch and the role — you just review and send.",
    },
    {
      icon: <FiInbox size={19} />,
      title: "Recruiter-Reply-Only Inbox",
      short: "See only replies from recruiters so you can focus on real leads, not noise.",
      detail:
        "Your inbox is filtered to show only genuine replies from companies you've applied to — no promotions, no clutter. Every message in there is a lead worth acting on.",
    },
    {
      icon: <FiBarChart2 size={19} />,
      title: "Job Search Analytics",
      short: "Track applications sent, recruiter replies, followups sent, and your reply rate.",
      detail:
        "A single dashboard shows total applications sent, replies received, followups sent, and your overall reply rate — so you know which resume version or pitch is actually landing interviews.",
    },
    {
      icon: <FiRefreshCw size={19} />,
      title: "1-Click Followups",
      short: "Automatically detect unanswered applications after 7 days and send followups instantly.",
      detail:
        "Once your follow-up queue is ready, one click sends every pending follow-up to recruiters at once — turning a 20-minute chore into a 2-second action.",
    },
  ];

  const faqs = [
    {
      q: "How does follow-up detection work for applications?",
      a: "MailTracker checks each application's thread. If there's no reply from the recruiter within 7 days, that application is automatically added to your follow-up queue — no manual spreadsheet tracking needed.",
    },
    {
      q: "Do recruiters see other companies I applied to?",
      a: "No. When you send to multiple recruiters, MailTracker sends each one an individual email. Nobody sees who else received it — no CC, no BCC, no exposed lists.",
    },
    {
      q: "How does resume/link click tracking work, and is it private?",
      a: "The resume, portfolio, or LinkedIn link you include is wrapped with a tracking redirect. When a recruiter clicks, we log it against that application — we only track link clicks, not full email content or browsing behavior.",
    },
    {
      q: "What does the AI use to write follow-ups?",
      a: "It uses your original application email and the existing thread with that recruiter as context, so the follow-up sounds like a natural continuation of your pitch — not a generic template.",
    },
    {
      q: "Is there a free tier or usage limit?",
      a: "You can start with the free tier to send applications, track replies, and try followups. Higher sending volume and advanced AI usage are part of paid plans.",
    },
    {
      q: "Does this work with providers other than Gmail?",
      a: "Right now MailTracker connects through Google Sign-In and works with Gmail accounts. Support for other providers is on the roadmap.",
    },
  ];

  const handleGoogleAuth = () => {
    window.location.href = `${
      import.meta.env.VITE_BACKEND_URL
    }api/auth/googleSignin`;
  };

  const handleDemo = () => {
    enterDemoMode();
    navigate("/dashboard");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        overflowX: "hidden",
        fontFamily: "DM Sans,sans-serif",
        color: "#e2e8f0",
      }}
    >
      <style>{`
        * { box-sizing: border-box; }

        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(24px) }
          to { opacity: 1; transform: translateY(0) }
        }
        @keyframes blobDrift {
          0%,100% { transform: translate(0,0) scale(1); }
          50% { transform: translate(30px,-20px) scale(1.08); }
        }

        .google-btn {
          display: inline-flex; align-items: center; justify-content: center; gap: 10px;
          padding: 13px 26px; border-radius: 11px; font-size: 14.5px; font-weight: 600;
          border: 1px solid #dadce0; background: #ffffff; color: #3c4043; cursor: pointer;
          font-family: 'DM Sans,sans-serif'; transition: all 0.2s ease;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .google-btn:hover {
          background: #f8f9fa; box-shadow: 0 4px 10px rgba(0, 0, 0, 0.14); transform: translateY(-1px);
        }
        .google-btn-navbar {
          display: inline-flex; align-items: center; justify-content: center; gap: 6px;
          padding: 8px 16px; border-radius: 10px; font-size: 13px; font-weight: 600;
          border: 1px solid #dadce0; background: #ffffff; color: #3c4043; cursor: pointer;
          font-family: 'DM Sans,sans-serif'; transition: all 0.2s ease;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .google-btn-navbar:hover {
          background: #f8f9fa; box-shadow: 0 4px 8px rgba(0, 0, 0, 0.12); transform: translateY(-1px);
        }
        .text-link-btn {
          display: inline-flex; align-items: center; gap: 6px;
          background: none; border: none; cursor: pointer;
          color: #94a3b8; font-size: 14px; font-weight: 600;
          font-family: 'DM Sans,sans-serif'; padding: 13px 6px;
          transition: color 0.2s ease;
        }
        .text-link-btn:hover { color: #c7d2fe; }
        .text-link-btn svg { transition: transform 0.2s ease; }
        .text-link-btn:hover svg { transform: translateX(3px); }

        .feature-accordion-item {
          background: rgba(255,255,255,0.035);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px;
          overflow: hidden;
          transition: border-color 0.2s ease, background 0.2s ease;
        }
        .feature-accordion-item.open {
          border-color: rgba(129,140,248,0.35);
          background: rgba(255,255,255,0.05);
        }
        .feature-accordion-header {
          display: flex; align-items: center; gap: 14px; width: 100%;
          padding: 16px 18px; background: transparent; border: none; cursor: pointer;
          text-align: left; font-family: 'DM Sans,sans-serif';
        }
        .feature-accordion-panel {
          display: grid; grid-template-rows: 0fr; transition: grid-template-rows 0.28s ease;
        }
        .feature-accordion-panel.open { grid-template-rows: 1fr; }
        .feature-accordion-panel-inner { overflow: hidden; }
        .learn-more-arrow {
          display: inline-flex; align-items: center; gap: 4px;
          font-size: 11px; font-weight: 700; color: #818cf8;
          letter-spacing: 0.02em; flex-shrink: 0; transition: transform 0.25s ease;
        }
        .learn-more-arrow.open { transform: rotate(90deg); }

        .faq-item {
          background: rgba(255,255,255,0.035);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 14px; overflow: hidden;
          transition: border-color 0.2s ease;
        }
        .faq-item.open { border-color: rgba(129,140,248,0.3); }
        .faq-header {
          display: flex; align-items: center; justify-content: space-between; gap: 14px;
          width: 100%; padding: 16px 18px; background: transparent; border: none;
          cursor: pointer; text-align: left; font-family: 'DM Sans,sans-serif';
        }
        .faq-panel { display: grid; grid-template-rows: 0fr; transition: grid-template-rows 0.25s ease; }
        .faq-panel.open { grid-template-rows: 1fr; }
        .faq-panel-inner { overflow: hidden; }
        .chevron { transition: transform 0.25s ease; flex-shrink: 0; }
        .chevron.open { transform: rotate(180deg); }

        .navbar {
          position: sticky; top: 0; z-index: 40;
          display: flex; align-items: center; justify-content: space-between;
          padding: 18px 60px;
          border-bottom: 1px solid rgba(255,255,255,0.06);
          transition: background 0.25s ease, backdrop-filter 0.25s ease, box-shadow 0.25s ease;
        }
        .navbar.scrolled {
          background: rgba(15,23,42,0.75);
          backdrop-filter: blur(10px);
          box-shadow: 0 4px 24px rgba(0,0,0,0.25);
        }

        .compare-col {
          border-radius: 16px;
          padding: 26px 24px;
          border: 1px solid rgba(255,255,255,0.08);
        }
        .compare-row {
          display: flex; align-items: flex-start; gap: 10px;
          font-size: 13.5px; line-height: 1.6; padding: 9px 0;
        }

        .social-icon {
          width: 34px; height: 34px; border-radius: 9px;
          display: flex; align-items: center; justify-content: center;
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          color: #94a3b8; transition: all 0.2s ease;
        }
        .social-icon:hover { color: #c7d2fe; border-color: rgba(129,140,248,0.35); }
      `}</style>

      {/* Navbar */}
      <nav className={`navbar${scrolled ? " scrolled" : ""}`}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div
            style={{
              width: 34, height: 34, borderRadius: 10,
              background: "linear-gradient(135deg,#6366f1,#818cf8)",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 4px 14px rgba(99,102,241,0.4)",
            }}
          >
            <FiLayers size={17} color="#fff" />
          </div>
          <span style={{ fontSize: 16, fontWeight: 700, color: "#f1f5f9", letterSpacing: "-0.02em" }}>
            Mail Tracker
          </span>
        </div>
        <button onClick={handleGoogleAuth} className="google-btn-navbar">
          <FcGoogle size={16} />
          Sign in
        </button>
      </nav>

      {/* Hero with blob + dot grid */}
      <div style={{ position: "relative" }}>
        <div
          aria-hidden
          style={{
            position: "absolute", top: "-80px", left: "50%", transform: "translateX(-50%)",
            width: 520, height: 520, borderRadius: "50%",
            background: "radial-gradient(circle, rgba(99,102,241,0.28) 0%, rgba(99,102,241,0) 70%)",
            filter: "blur(10px)",
            animation: "blobDrift 10s ease-in-out infinite",
            pointerEvents: "none",
          }}
        />
        <div
          aria-hidden
          style={{
            position: "absolute", inset: 0, opacity: 0.5,
            backgroundImage: "radial-gradient(rgba(255,255,255,0.06) 1px, transparent 1px)",
            backgroundSize: "26px 26px",
            maskImage: "radial-gradient(ellipse 60% 60% at 50% 20%, black 30%, transparent 75%)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            position: "relative",
            maxWidth: 900, margin: "0 auto", padding: "100px 40px 20px",
            textAlign: "center", animation: "fadeSlideUp 0.7s ease both",
          }}
        >
          <div
            style={{
              display: "inline-flex", alignItems: "center", gap: 7,
              background: "rgba(99,102,241,0.15)", border: "1px solid rgba(99,102,241,0.3)",
              borderRadius: 99, padding: "5px 14px", marginBottom: 28,
            }}
          >
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "#818cf8", display: "inline-block" }} />
            <span style={{ fontSize: 12, fontWeight: 600, color: "#a5b4fc", letterSpacing: "0.03em" }}>
              Built for job seekers reaching out to recruiters & hiring managers
            </span>
          </div>

          <h1
            style={{
              fontSize: "clamp(36px,5vw,62px)", fontWeight: 800, color: "#f8fafc",
              lineHeight: 1.15, letterSpacing: "-0.03em", margin: "0 0 22px",
            }}
          >
            Turn job applications into
            <br />
            <span
              style={{
                background: "linear-gradient(135deg,#818cf8,#c4b5fd)",
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text",
              }}
            >
              interview calls
            </span>
          </h1>

          <p
            style={{
              fontSize: 17, color: "#94a3b8", fontWeight: 400, lineHeight: 1.75,
              maxWidth: 540, margin: "0 auto 36px",
            }}
          >
            Send applications at scale, know when a recruiter opens your
            resume, and never forget a follow-up again — all from one
            dashboard.
          </p>

          <div style={{ display: "flex", gap: 4, justifyContent: "center", alignItems: "center", flexWrap: "wrap" }}>
            <button onClick={handleGoogleAuth} className="google-btn">
              <FcGoogle size={19} />
              Continue with Google
            </button>
            <button onClick={handleDemo} className="text-link-btn" type="button">
              Explore the demo <FiArrowRight size={14} />
            </button>
          </div>
          <p style={{ fontSize: 11.5, color: "#475569", fontWeight: 500, marginTop: 12 }}>
            Free forever · No credit card needed
          </p>
        </div>
      </div>

      {/* Passive social-proof stat strip — no CTA, no click */}
      <Reveal delay={100}>
        <div
          ref={teaserRef}
          style={{
            maxWidth: 700, margin: "60px auto 30px", padding: "22px 30px",
            borderRadius: 16, background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.07)",
          }}
        >
          <div style={{ display: "flex", justifyContent: "center", gap: 44, flexWrap: "wrap" }}>
            {[
              { label: "Applications Sent", value: stats.sent },
              { label: "Recruiter Replies", value: stats.replies },
              { label: "Followups Queued", value: stats.followups },
            ].map((s, i) => (
              <div key={i} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 26, fontWeight: 800, color: "#a5b4fc", letterSpacing: "-0.02em", fontVariantNumeric: "tabular-nums" }}>
                  {s.value}
                </div>
                <div style={{ fontSize: 11.5, color: "#64748b", fontWeight: 500 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal delay={150}>
        <p style={{ textAlign: "center", fontSize: 13, color: "#475569", fontStyle: "italic", margin: "0 auto 90px", maxWidth: 460 }}>
          "Built this after losing track of 40+ applications in a spreadsheet — now every follow-up happens on its own." — Yashvardhan, creator
        </p>
      </Reveal>

      {/* Animated application-lifecycle timeline — visual storytelling before features */}
      <Reveal delay={200}>
        <div style={{ padding: "0 40px 90px" }}>
          <ApplicationTimeline />
        </div>
      </Reveal>

      {/* FEATURES section — tinted bg */}
      <div style={{ background: "rgba(255,255,255,0.015)", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: 720, margin: "0 auto", padding: "90px 40px" }}>
          <Reveal>
            <h2 style={{ textAlign: "center", fontSize: 32, fontWeight: 800, color: "#f1f5f9", marginBottom: 10, letterSpacing: "-0.025em" }}>
              Everything in one place
            </h2>
            <p style={{ textAlign: "center", fontSize: 14.5, color: "#64748b", fontWeight: 400, marginBottom: 40 }}>
              No more juggling Gmail tabs, spreadsheets, and job-tracker sheets.
            </p>
          </Reveal>

          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {features.map((f, i) => {
              const isOpen = openFeature === i;
              return (
                <Reveal key={i} delay={i * 40}>
                  <div className={`feature-accordion-item${isOpen ? " open" : ""}`}>
                    <button className="feature-accordion-header" onClick={() => setOpenFeature(isOpen ? null : i)} aria-expanded={isOpen}>
                      <div
                        style={{
                          width: 36, height: 36, borderRadius: 10,
                          background: "rgba(99,102,241,0.2)", color: "#818cf8",
                          display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                        }}
                      >
                        {f.icon}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14.5, fontWeight: 700, color: "#f1f5f9" }}>{f.title}</div>
                        {!isOpen && (
                          <div style={{ fontSize: 12.5, color: "#64748b", fontWeight: 400, marginTop: 3, lineHeight: 1.5 }}>
                            {f.short}
                          </div>
                        )}
                      </div>
                      <span className={`learn-more-arrow${isOpen ? " open" : ""}`}>
                        <FiArrowRight size={13} />
                      </span>
                    </button>
                    <div className={`feature-accordion-panel${isOpen ? " open" : ""}`}>
                      <div className="feature-accordion-panel-inner">
                        <p style={{ margin: 0, padding: "0 18px 18px 68px", fontSize: 13, color: "#94a3b8", fontWeight: 400, lineHeight: 1.7 }}>
                          {f.detail}
                        </p>
                      </div>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </div>

      {/* HOW IT WORKS */}
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "90px 40px" }}>
        <Reveal>
          <div style={{ textAlign: "center", marginBottom: 45 }}>
            <div
              style={{
                display: "inline-flex", alignItems: "center", gap: 7,
                background: "rgba(99,102,241,0.12)", border: "1px solid rgba(99,102,241,0.25)",
                borderRadius: 99, padding: "5px 13px", marginBottom: 16,
              }}
            >
              <FiActivity size={13} color="#818cf8" />
              <span style={{ fontSize: 11.5, fontWeight: 600, color: "#a5b4fc", letterSpacing: "0.03em" }}>
                SIMPLE OUTREACH WORKFLOW
              </span>
            </div>
            <h2 style={{ fontSize: 26, fontWeight: 700, color: "#f1f5f9", margin: "0 0 10px", letterSpacing: "-0.02em" }}>
              How MailTracker Works
            </h2>
            <p style={{ fontSize: 14.5, color: "#64748b", fontWeight: 400, maxWidth: 560, margin: "0 auto", lineHeight: 1.7 }}>
              From your first application email to follow-ups and recruiter
              replies, MailTracker keeps your whole job search organized.
            </p>
          </div>
        </Reveal>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14 }}>
          {[
            { number: "01", title: "Create your application", desc: "Write a personalized application email or reuse one of your saved templates." },
            { number: "02", title: "Apply at scale", desc: "Send individual applications to multiple recruiters without exposing other recipients." },
            { number: "03", title: "Track engagement", desc: "Monitor resume/link clicks, replies and your overall job search performance." },
            { number: "04", title: "Follow up", desc: "Applications with no reply after 7 days appear in your follow-up queue." },
          ].map((step, index) => (
            <Reveal key={index} delay={index * 60}>
              <div style={{ borderLeft: "2px solid rgba(129,140,248,0.35)", paddingLeft: 16, minHeight: 150 }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: "#334155", letterSpacing: "-0.02em", marginBottom: 10 }}>
                  {step.number}
                </div>
                <h3 style={{ fontSize: 14.5, fontWeight: 700, color: "#f1f5f9", margin: "0 0 8px" }}>{step.title}</h3>
                <p style={{ fontSize: 12.5, color: "#64748b", fontWeight: 400, margin: 0, lineHeight: 1.65 }}>{step.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>

      {/* BEFORE / AFTER */}
      <div style={{ background: "rgba(255,255,255,0.015)", borderTop: "1px solid rgba(255,255,255,0.05)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "90px 40px" }}>
          <Reveal>
            <h2 style={{ textAlign: "center", fontSize: 26, fontWeight: 700, color: "#f1f5f9", margin: "0 0 40px", letterSpacing: "-0.02em" }}>
              Job hunting, without the chaos
            </h2>
          </Reveal>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            <Reveal delay={60}>
              <div className="compare-col" style={{ background: "rgba(248,113,113,0.05)", borderColor: "rgba(248,113,113,0.18)" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#fca5a5", marginBottom: 14, letterSpacing: "0.02em" }}>
                  WITHOUT MAILTRACKER
                </div>
                {[
                  "Retyping the same cover letter for every company",
                  "Losing track of who you've already applied to",
                  "Forgetting to follow up until it's too late",
                  "No idea if a recruiter even opened your resume",
                ].map((line, i) => (
                  <div className="compare-row" key={i}>
                    <FiX size={15} color="#f87171" style={{ marginTop: 2, flexShrink: 0 }} />
                    <span style={{ color: "#94a3b8" }}>{line}</span>
                  </div>
                ))}
              </div>
            </Reveal>

            <Reveal delay={120}>
              <div className="compare-col" style={{ background: "rgba(129,140,248,0.06)", borderColor: "rgba(129,140,248,0.25)" }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: "#a5b4fc", marginBottom: 14, letterSpacing: "0.02em" }}>
                  WITH MAILTRACKER
                </div>
                {[
                  "Save your pitch once, reuse it for every batch",
                  "One dashboard tracking every application",
                  "Auto follow-up queue — never forget again",
                  "Know the moment a recruiter clicks your resume",
                ].map((line, i) => (
                  <div className="compare-row" key={i}>
                    <FiCheck size={15} color="#818cf8" style={{ marginTop: 2, flexShrink: 0 }} />
                    <span style={{ color: "#cbd5e1" }}>{line}</span>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "90px 40px" }}>
        <Reveal>
          <h2 style={{ textAlign: "center", fontSize: 26, fontWeight: 700, color: "#f1f5f9", marginBottom: 10, letterSpacing: "-0.02em" }}>
            Frequently asked questions
          </h2>
          <p style={{ textAlign: "center", fontSize: 14.5, color: "#64748b", fontWeight: 400, marginBottom: 36 }}>
            Everything else you might want to know before you start.
          </p>
        </Reveal>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {faqs.map((item, i) => {
            const isOpen = openFaq === i;
            return (
              <Reveal key={i} delay={i * 40}>
                <div className={`faq-item${isOpen ? " open" : ""}`}>
                  <button className="faq-header" onClick={() => setOpenFaq(isOpen ? null : i)} aria-expanded={isOpen}>
                    <span style={{ fontSize: 14, fontWeight: 700, color: "#f1f5f9" }}>{item.q}</span>
                    <FiChevronDown size={17} color="#64748b" className={`chevron${isOpen ? " open" : ""}`} />
                  </button>
                  <div className={`faq-panel${isOpen ? " open" : ""}`}>
                    <div className="faq-panel-inner">
                      <p style={{ margin: 0, padding: "0 18px 18px", fontSize: 13, color: "#94a3b8", fontWeight: 400, lineHeight: 1.7 }}>
                        {item.a}
                      </p>
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>

      {/* Final CTA — only other CTA pair on the page */}
      <Reveal>
        <div style={{ textAlign: "center", padding: "10px 40px 90px" }}>
          <div
            style={{
              display: "inline-block", background: "rgba(99,102,241,0.1)",
              border: "1px solid rgba(99,102,241,0.2)", borderRadius: 20, padding: "42px 60px",
            }}
          >
            <h2 style={{ fontSize: 25, fontWeight: 700, color: "#f1f5f9", margin: "0 0 10px", letterSpacing: "-0.02em" }}>
              Ready to land more interviews?
            </h2>
            <p style={{ fontSize: 14, color: "#64748b", fontWeight: 400, margin: "0 0 26px" }}>
              Start managing your job applications, recruiter replies, and followups from one place.
            </p>
            <div style={{ display: "flex", gap: 4, justifyContent: "center", alignItems: "center", flexWrap: "wrap" }}>
              <button onClick={handleGoogleAuth} className="google-btn">
                <FcGoogle size={19} />
                Create your free account
              </button>
              <button onClick={handleDemo} className="text-link-btn" type="button">
                or explore the demo <FiArrowRight size={14} />
              </button>
            </div>
            <p style={{ fontSize: 11, color: "#475569", fontWeight: 500, marginTop: 14 }}>
              Free forever · No credit card needed
            </p>
          </div>
        </div>
      </Reveal>

      {/* Footer */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.08)", padding: "30px 40px", textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "center", gap: 10, marginBottom: 16 }}>
          <a href="#" className="social-icon" aria-label="GitHub"><FiGithub size={15} /></a>
          <a href="#" className="social-icon" aria-label="LinkedIn"><FiLinkedin size={15} /></a>
        </div>
        <div style={{ color: "#64748b", fontSize: 13 }}>
          <span>© {new Date().getFullYear()} Mail Tracker — built to help you get hired faster</span>
          <div style={{ marginTop: 8 }}>
            <a href="/privacy" style={{ color: "#818cf8", marginRight: 16, textDecoration: "none" }}>Privacy Policy</a>
            <a href="/terms" style={{ color: "#818cf8", textDecoration: "none" }}>Terms of Service</a>
          </div>
        </div>
      </div>

      <ExitIntentNudge onExploreDemo={handleDemo} />
    </div>
  );
};

export default LandingPage;