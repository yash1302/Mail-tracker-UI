import { useState } from "react";
import {
  FiActivity,
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiFilter,
  FiSearch,
  FiSend,
  FiTarget,
  FiTrendingDown,
  FiTrendingUp,
  FiX,
  FiZap,
  FiEdit3,
  FiChevronDown,
  FiAlertCircle,
  FiAtSign,
  FiCheck,
  FiRefreshCw,
  FiChevronUp,
} from "react-icons/fi";
import { allMessages, DRAFT_TEMPLATES } from "../data/dashboardData";
import Sparkbar from "../components/dashboard/Sparkbar";
import { statusConfig, tagConfig } from "../utils/statusConfig.jsx";
import { sentEmailsData } from "../data/dashboardData";

const totalSent = sentEmailsData.length;
const totalReplies = sentEmailsData.filter(
  (m) => m.status === "Replied" || m.replies > 0,
).length;
const totalFollowups = sentEmailsData.filter(
  (m) => m.followUps && m.followUps > 0,
).length;
const pendingFollowups = sentEmailsData.filter(
  (m) => m.status !== "Replied",
).length;
const scheduledFollowups = sentEmailsData.filter(
  (m) => m.followUps && m.followUps > 0,
).length;

const cardData = [
  {
    title: "Emails Sent",
    Icon: FiSend,
    color: "#6366f1",
    bg: "#eef2ff",
    stats: [
      { label: "Emails Sent", value: totalSent },
      { label: "Followups Sent", value: totalFollowups },
    ],
  },
  {
    title: "Replies",
    Icon: FiActivity,
    color: "#0ea5e9",
    bg: "#e0f2fe",
    stats: [
      { label: "Replies Received", value: totalReplies },
      { label: "Pending Replies", value: totalSent - totalReplies },
    ],
  },
  {
    title: "Engagement",
    Icon: FiTarget,
    color: "#10b981",
    bg: "#d1fae5",
    stats: [
      {
        label: "Reply Rate",
        value:
          totalSent > 0
            ? Math.round((totalReplies / totalSent) * 100) + "%"
            : "0%",
      },
      {
        label: "Follow-up Rate",
        value:
          totalSent > 0
            ? Math.round((totalFollowups / totalSent) * 100) + "%"
            : "0%",
      },
    ],
  },
  {
    title: "Pending Followups",
    Icon: FiClock,
    color: "#f59e0b",
    bg: "#fef3c7",
    stats: [
      { label: "Followups Needed", value: pendingFollowups },
      { label: "Scheduled", value: scheduledFollowups },
    ],
  },
];

const statusColors = {
  Replied: { bg: "#dcfce7", color: "#16a34a" },
  Sent: { bg: "#eef2ff", color: "#6366f1" },
  Opened: { bg: "#fef3c7", color: "#d97706" },
  Bounced: { bg: "#fee2e2", color: "#dc2626" },
};

const Dashboard = () => {
  const [range, setRange] = useState("7d");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [orgFilter, setOrgFilter] = useState("All");
  const [page, setPage] = useState(0);
  const [viewMail, setViewMail] = useState(null);
  const [followupModal, setFollowupModal] = useState(null);
  const [activeModal, setActiveModal] = useState(null);

  const [fuSubject, setFuSubject] = useState("");
  const [fuBody, setFuBody] = useState("");

  const [showDraftPicker, setShowDraftPicker] = useState(false);

  const [sending, setSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const drafts = DRAFT_TEMPLATES;
  const fld = {
    border: "1px solid #e2e8f0",
    borderRadius: 10,
    padding: "9px 12px",
    width: "100%",
    fontSize: 13,
    color: "#374151",
    outline: "none",
    fontFamily: "DM Sans,sans-serif",
    background: "#fff",
    transition: "border-color 0.15s",
  };

  const PER_PAGE = 8;

  const statuses = ["All", ...new Set(allMessages.map((m) => m.status))];
  const orgs = ["All", ...new Set(allMessages.map((m) => m.org))];

  const filtered = allMessages.filter((m) => {
    const q = search.toLowerCase();
    return (
      (statusFilter === "All" || m.status === statusFilter) &&
      (orgFilter === "All" || m.org === orgFilter) &&
      (m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.message.toLowerCase().includes(q))
    );
  });
  const paginated = filtered.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);
  const totalPages = Math.ceil(filtered.length / PER_PAGE);

  const openFollowupModal = (lead) => {
    const name = lead.name ?? lead.email.split("@")[0];

    setActiveModal({
      ...lead,
      to: name,
      daysSince: 7, // or calculate later
      opens: lead.opens ?? 0,
    });

    setFuSubject("Re: " + (lead.subject ?? "Quick follow-up"));

    setFuBody(`Hi ${name},

Just following up on my previous email from ${lead.date}.

Wanted to check if you had a chance to review it.

Happy to connect if it makes sense.

Best,
`);

    setShowDraftPicker(false);
    setSentSuccess(false);
  };

  const sendFollowUp = () => {
    if (!fuSubject.trim() || !fuBody.trim()) return;

    setSending(true);

    setTimeout(() => {
      setSending(false);
      setSentSuccess(true);

      setTimeout(() => {
        setActiveModal(null);
        setSentSuccess(false);
      }, 1500);
    }, 1200);
  };

  const recentOutreachPreview = filtered.slice(0, 10);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 16,
        height: "100%",
        minHeight: 0,
        fontFamily: "DM Sans, sans-serif",
      }}
    >
      {/* ── Top bar ── */}
      <div
        className="fade-up d0"
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: 6,
          flexShrink: 0,
        }}
      >
        {[
          ["7d", "Last 7 days"],
          ["30d", "Last 30 days"],
        ].map(([v, l]) => (
          <button
            key={v}
            onClick={() => setRange(v)}
            style={{
              padding: "6px 14px",
              borderRadius: 9,
              fontSize: 12,
              fontWeight: 600,
              border: "1px solid",
              cursor: "pointer",
              transition: "all 0.15s",
              fontFamily: "DM Sans,sans-serif",
              borderColor: range === v ? "#6366f1" : "#e2e8f0",
              background: range === v ? "#6366f1" : "#fff",
              color: range === v ? "#fff" : "#64748b",
            }}
          >
            {l}
          </button>
        ))}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 7,
            border: "1px solid #e2e8f0",
            borderRadius: 9,
            padding: "6px 12px",
            background: "#fff",
          }}
        >
          <FiCalendar size={13} color="#94a3b8" />
          <input
            type="date"
            style={{
              border: "none",
              outline: "none",
              fontSize: 12,
              color: "#374151",
              background: "transparent",
              fontFamily: "DM Sans,sans-serif",
            }}
          />
        </div>
      </div>

      {/* ── Analytics cards ── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 12,
          flexShrink: 0,
        }}
      >
        {cardData.map(({ title, Icon, color, bg, stats }, idx) => (
          <div
            key={idx}
            className={`fade-up d${idx}`}
            style={{
              background: "#fff",
              borderRadius: 14,
              padding: "14px 16px",
              border: "1px solid #f1f5f9",
              position: "relative",
              overflow: "hidden",
              boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                width: 60,
                height: 60,
                background: `radial-gradient(circle at top right,${color}12,transparent 70%)`,
                borderRadius: "0 14px 0 0",
              }}
            />
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 10,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 7 }}>
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    background: bg,
                    color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Icon size={13} />
                </div>
                <span
                  style={{ fontSize: 12, fontWeight: 600, color: "#374151" }}
                >
                  {title}
                </span>
              </div>
              <Sparkbar color={color} />
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 8,
              }}
            >
              {stats.map((stat, i) => (
                <div
                  key={i}
                  style={{
                    background: "#fafafa",
                    borderRadius: 8,
                    padding: "7px 9px",
                    border: "1px solid #f1f5f9",
                  }}
                >
                  <p
                    style={{
                      fontSize: 10,
                      color: "#94a3b8",
                      marginBottom: 2,
                      fontWeight: 500,
                    }}
                  >
                    {stat.label}
                  </p>
                  <span
                    className="mono"
                    style={{
                      fontSize: 18,
                      fontWeight: 700,
                      color: "#0f172a",
                      lineHeight: 1,
                    }}
                  >
                    {stat.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* ── Bottom row: Followup Queue + Outreach Table side-by-side ── */}
      <div
        className="fade-up d3"
        style={{
          display: "grid",
          gridTemplateColumns: "280px 1fr",
          gap: 12,
          flex: 1,
          minHeight: 0,
        }}
      >
        {/* Followup Queue — left column */}
        <div
          style={{
            background: "#fff",
            borderRadius: 14,
            border: "1px solid #f1f5f9",
            boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              padding: "14px 16px",
              borderBottom: "1px solid #f1f5f9",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <h2
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: "#0f172a",
                    margin: "0 0 1px",
                  }}
                >
                  Followups Needed
                </h2>
              </div>

              <button
                onClick={() => navigate("/followups")}
                style={{
                  fontSize: 11,
                  fontWeight: 600,
                  color: "#6366f1",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                View all →
              </button>
            </div>
          </div>
          <div style={{ flex: 1, overflowY: "auto", padding: "8px 12px" }}>
            {sentEmailsData
              .filter((m) => m.status !== "Replied")
              .slice(0, 5)
              .map((lead, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                    padding: "10px 0",
                    borderBottom: "1px solid #f8fafc",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      justifyContent: "space-between",
                      gap: 8,
                    }}
                  >
                    <div style={{ minWidth: 0 }}>
                      <p
                        style={{
                          fontWeight: 600,
                          color: "#0f172a",
                          margin: "0 0 2px",
                          fontSize: 12,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {lead.name ?? lead.email.split("@")[0]}
                      </p>
                      <p
                        style={{
                          fontSize: 10.5,
                          color: "#94a3b8",
                          margin: 0,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {lead.email}
                      </p>
                    </div>
                    <span
                      style={{
                        fontSize: 10,
                        color: "#94a3b8",
                        whiteSpace: "nowrap",
                        flexShrink: 0,
                        marginTop: 2,
                      }}
                    >
                      <span className=" font-bold">Sent</span> : {lead.date}
                    </span>
                  </div>
                  <button
                    style={{
                      background: "#eef2ff",
                      color: "#6366f1",
                      border: "1px solid #c7d2fe",
                      borderRadius: 8,
                      padding: "5px 0",
                      fontSize: 11,
                      cursor: "pointer",
                      fontWeight: 700,
                      fontFamily: "DM Sans, sans-serif",
                      width: "100%",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "#6366f1";
                      e.currentTarget.style.color = "#fff";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "#eef2ff";
                      e.currentTarget.style.color = "#6366f1";
                    }}
                    onClick={() => openFollowupModal(lead)}
                  >
                    Send Followup →
                  </button>
                </div>
              ))}
          </div>
        </div>

        {/* Recent Outreach table — right column */}
        <div
          style={{
            background: "#fff",
            borderRadius: 14,
            border: "1px solid #f1f5f9",
            overflow: "hidden",
            boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* Table toolbar */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "14px 18px",
              borderBottom: "1px solid #f1f5f9",
              flexShrink: 0,
            }}
          >
            <div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "full",
                }}
              >
                <div>
                  <h2
                    style={{
                      fontSize: 13,
                      fontWeight: 700,
                      color: "#0f172a",
                      margin: "0 0 1px",
                    }}
                  >
                    Recent Outreach
                  </h2>
                </div>

                <button
                  onClick={() => navigate("/sent-mails")}
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: "#6366f1",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  View all →
                </button>
              </div>
            </div>
          </div>

          {/* Table — scrolls internally */}
          <div style={{ flex: 1, overflowY: "auto", minHeight: 0 }}>
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: 12.5,
              }}
            >
              <thead style={{ position: "sticky", top: 0, zIndex: 1 }}>
                <tr
                  style={{
                    background: "#fafafa",
                    borderBottom: "1px solid #f1f5f9",
                  }}
                >
                  {[
                    "Recipient",
                    "Email Preview",
                    "Sent Date",
                    "Status",
                    "Company",
                    "Campaign",
                  ].map((h) => (
                    <th
                      key={h}
                      style={{
                        textAlign: "left",
                        padding: "8px 14px",
                        fontSize: 10,
                        fontWeight: 700,
                        color: "#94a3b8",
                        letterSpacing: "0.05em",
                        textTransform: "uppercase",
                      }}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      style={{
                        padding: "32px",
                        textAlign: "center",
                        color: "#d1d5db",
                        fontSize: 13,
                      }}
                    >
                      No outreach emails found
                    </td>
                  </tr>
                ) : (
                  recentOutreachPreview.map((row, i) => {
                    const sc = statusConfig[row.status] || {
                      bg: "#f1f5f9",
                      color: "#374151",
                    };
                    const tc = tagConfig[row.tag] || {
                      bg: "#f1f5f9",
                      color: "#374151",
                    };
                    const hue = (row.name.charCodeAt(0) * 17) % 360;
                    return (
                      <tr
                        key={i}
                        onClick={() => setViewMail(row)}
                        className="row-hover"
                        style={{
                          borderBottom: "1px solid #f8fafc",
                          cursor: "pointer",
                          transition: "background 0.15s",
                        }}
                      >
                        <td style={{ padding: "10px 14px" }}>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              gap: 8,
                            }}
                          >
                            <div
                              style={{
                                width: 28,
                                height: 28,
                                borderRadius: "50%",
                                background: `hsl(${hue},55%,88%)`,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                fontSize: 11,
                                fontWeight: 700,
                                color: `hsl(${hue},45%,35%)`,
                                flexShrink: 0,
                              }}
                            >
                              {row.name[0]}
                            </div>
                            <div>
                              <p
                                style={{
                                  fontWeight: 600,
                                  color: "#0f172a",
                                  margin: 0,
                                  fontSize: 12,
                                }}
                              >
                                {row.name}
                              </p>
                              <p
                                style={{
                                  color: "#94a3b8",
                                  fontSize: 10.5,
                                  margin: 0,
                                }}
                              >
                                {row.email}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td style={{ padding: "10px 14px", maxWidth: 200 }}>
                          <p
                            style={{
                              color: "#64748b",
                              margin: 0,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                              maxWidth: 180,
                            }}
                          >
                            {row.message}
                          </p>
                        </td>
                        <td style={{ padding: "10px 14px" }}>
                          <span
                            className="mono"
                            style={{ fontSize: 11, color: "#94a3b8" }}
                          >
                            {row.date}
                          </span>
                        </td>
                        <td style={{ padding: "10px 14px" }}>
                          <span
                            style={{
                              background: sc.bg,
                              color: sc.color,
                              padding: "3px 8px",
                              borderRadius: 20,
                              fontSize: 10.5,
                              fontWeight: 600,
                            }}
                          >
                            {row.status}
                          </span>
                        </td>
                        <td style={{ padding: "10px 14px" }}>
                          <span
                            style={{
                              fontSize: 12,
                              color: "#374151",
                              fontWeight: 500,
                            }}
                          >
                            {row.org}
                          </span>
                        </td>
                        <td style={{ padding: "10px 14px" }}>
                          <span
                            style={{
                              background: tc.bg,
                              color: tc.color,
                              padding: "3px 8px",
                              borderRadius: 20,
                              fontSize: 10.5,
                              fontWeight: 600,
                            }}
                          >
                            {row.tag}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Email Modal ── */}
      {viewMail && (
        <div
          className="modal-backdrop"
          onClick={() => setViewMail(null)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              borderRadius: 20,
              width: 580,
              overflow: "hidden",
              boxShadow:
                "0 32px 80px rgba(15,23,42,0.18), 0 0 0 1px rgba(241,245,249,1)",
              animation: "modalIn 0.22s cubic-bezier(0.34,1.56,0.64,1) both",
            }}
          >
            <style>{`
              @keyframes modalIn { from { opacity:0; transform:scale(0.95) translateY(8px); } to { opacity:1; transform:scale(1) translateY(0); } }
              .modal-meta-cell { background:#fafafa; border:1px solid #f1f5f9; border-radius:12px; padding:12px 14px; }
              .modal-meta-label { font-size:10.5px; font-weight:700; color:#94a3b8; text-transform:uppercase; letter-spacing:0.06em; margin:0 0 5px; }
              .modal-meta-value { font-size:15px; font-weight:700; color:#0f172a; margin:0; font-variant-numeric:tabular-nums; }
            `}</style>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "18px 22px 16px",
                background: "linear-gradient(135deg,#6366f1 0%,#818cf8 100%)",
              }}
            >
              <div>
                <h3
                  style={{
                    fontSize: 15,
                    fontWeight: 800,
                    color: "#fff",
                    margin: "0 0 2px",
                    letterSpacing: "-0.01em",
                  }}
                >
                  Email Details
                </h3>
                <p
                  style={{
                    fontSize: 12,
                    color: "rgba(255,255,255,0.65)",
                    margin: 0,
                  }}
                >
                  Sent outreach record
                </p>
              </div>
              <button
                onClick={() => setViewMail(null)}
                style={{
                  background: "rgba(255,255,255,0.15)",
                  border: "1px solid rgba(255,255,255,0.2)",
                  borderRadius: 8,
                  cursor: "pointer",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: 30,
                  height: 30,
                }}
              >
                <FiX size={14} />
              </button>
            </div>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 13,
                padding: "16px 22px",
                borderBottom: "1px solid #f1f5f9",
                background: "#fafbff",
              }}
            >
              {(() => {
                const hue = (viewMail.name.charCodeAt(0) * 17) % 360;
                return (
                  <div
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: "50%",
                      background: `hsl(${hue},55%,88%)`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 15,
                      fontWeight: 800,
                      color: `hsl(${hue},45%,35%)`,
                      flexShrink: 0,
                      border: `2px solid hsl(${hue},40%,78%)`,
                    }}
                  >
                    {viewMail.name[0]}
                  </div>
                );
              })()}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    fontSize: 14,
                    fontWeight: 700,
                    color: "#0f172a",
                    margin: "0 0 2px",
                  }}
                >
                  {viewMail.name}
                </p>
                <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>
                  {viewMail.email}
                </p>
              </div>
              {(() => {
                const sc = statusColors[viewMail.status] || {
                  bg: "#f1f5f9",
                  color: "#374151",
                };
                return (
                  <span
                    style={{
                      background: sc.bg,
                      color: sc.color,
                      padding: "4px 11px",
                      borderRadius: 99,
                      fontSize: 11.5,
                      fontWeight: 700,
                    }}
                  >
                    {viewMail.status}
                  </span>
                );
              })()}
            </div>
            <div
              style={{
                padding: "18px 22px",
                display: "flex",
                flexDirection: "column",
                gap: 16,
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: 10.5,
                    fontWeight: 700,
                    color: "#94a3b8",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    margin: "0 0 6px",
                  }}
                >
                  Subject
                </p>
                <p
                  style={{
                    fontSize: 13.5,
                    fontWeight: 600,
                    color: "#0f172a",
                    margin: 0,
                  }}
                >
                  {viewMail.subject}
                </p>
              </div>
              <div style={{ borderTop: "1px solid #f1f5f9" }} />
              <div>
                <p
                  style={{
                    fontSize: 10.5,
                    fontWeight: 700,
                    color: "#94a3b8",
                    textTransform: "uppercase",
                    letterSpacing: "0.06em",
                    margin: "0 0 8px",
                  }}
                >
                  Message
                </p>
                <div
                  style={{
                    background: "#f8fafc",
                    border: "1px solid #f1f5f9",
                    borderRadius: 12,
                    padding: "14px 16px",
                    maxHeight: 130,
                    overflowY: "auto",
                  }}
                >
                  <p
                    style={{
                      fontSize: 13.5,
                      color: "#374151",
                      lineHeight: 1.75,
                      whiteSpace: "pre-line",
                      margin: 0,
                    }}
                  >
                    {viewMail.message}
                  </p>
                </div>
              </div>
              <div style={{ borderTop: "1px solid #f1f5f9" }} />
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr 1fr 1fr",
                  gap: 10,
                }}
              >
                <div className="modal-meta-cell">
                  <p className="modal-meta-label">Sent</p>
                  <p
                    className="modal-meta-value"
                    style={{ fontSize: 12, fontWeight: 600 }}
                  >
                    {viewMail.date}
                  </p>
                </div>
                <div className="modal-meta-cell">
                  <p className="modal-meta-label">Company</p>
                  <p
                    className="modal-meta-value"
                    style={{ fontSize: 12, fontWeight: 600 }}
                  >
                    {viewMail.org ?? "—"}
                  </p>
                </div>
                <div className="modal-meta-cell">
                  <p className="modal-meta-label">Opens</p>
                  <p className="modal-meta-value">{viewMail.opens ?? 0}</p>
                </div>
                <div className="modal-meta-cell">
                  <p className="modal-meta-label">Replies</p>
                  <p className="modal-meta-value">{viewMail.replies ?? 0}</p>
                </div>
              </div>
            </div>
            <div
              style={{
                padding: "14px 22px",
                borderTop: "1px solid #f1f5f9",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                background: "#fafbff",
              }}
            >
              <p
                style={{
                  fontSize: 11.5,
                  color: "#cbd5e1",
                  margin: 0,
                  fontWeight: 500,
                }}
              >
                Campaign:{" "}
                <span style={{ color: "#94a3b8", fontWeight: 600 }}>
                  {viewMail.tag ?? "—"}
                </span>
              </p>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={() => setViewMail(null)}
                  style={{
                    padding: "8px 16px",
                    borderRadius: 10,
                    fontSize: 13,
                    fontWeight: 600,
                    border: "1.5px solid #e2e8f0",
                    background: "#fff",
                    color: "#64748b",
                    cursor: "pointer",
                    fontFamily: "DM Sans,sans-serif",
                  }}
                >
                  Close
                </button>
                <button
                  style={{
                    padding: "8px 16px",
                    borderRadius: 10,
                    fontSize: 13,
                    fontWeight: 700,
                    border: "none",
                    background: "#6366f1",
                    color: "#fff",
                    cursor: "pointer",
                    fontFamily: "DM Sans,sans-serif",
                    boxShadow: "0 4px 12px rgba(99,102,241,0.3)",
                  }}
                >
                  Send Followup →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Follow-up Modal */}
      {activeModal && (
        <div className="modal-backdrop" onClick={() => setActiveModal(null)}>
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              borderRadius: 18,
              width: 560,
              overflow: "hidden",
              boxShadow: "0 25px 60px rgba(0,0,0,0.18)",
            }}
          >
            {/* Header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "18px 22px",
                borderBottom: "1px solid #f1f5f9",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: "50%",
                    background: `hsl(${(activeModal.to.charCodeAt(0) * 17) % 360},55%,88%)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 13,
                    fontWeight: 700,
                    color: `hsl(${(activeModal.to.charCodeAt(0) * 17) % 360},45%,35%)`,
                  }}
                >
                  {activeModal.to[0]}
                </div>
                <div>
                  <h2
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      color: "#0f172a",
                      margin: 0,
                    }}
                  >
                    Follow-up to {activeModal.to}
                  </h2>
                  <p style={{ fontSize: 11.5, color: "#94a3b8", margin: 0 }}>
                    {activeModal.email} · {activeModal.daysSince} days since
                    original
                  </p>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <button
                  onClick={() => setShowDraftPicker((v) => !v)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    padding: "5px 11px",
                    borderRadius: 8,
                    fontSize: 12,
                    fontWeight: 600,
                    border: "1px solid",
                    cursor: "pointer",
                    fontFamily: "DM Sans,sans-serif",
                    borderColor: showDraftPicker ? "#6366f1" : "#c7d2fe",
                    background: showDraftPicker ? "#6366f1" : "#eef2ff",
                    color: showDraftPicker ? "#fff" : "#6366f1",
                    transition: "all 0.15s",
                  }}
                >
                  <FiEdit3 size={11} /> Draft{" "}
                  {showDraftPicker ? (
                    <FiChevronUp size={10} />
                  ) : (
                    <FiChevronDown size={10} />
                  )}
                </button>
                <button
                  onClick={() => setActiveModal(null)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#94a3b8",
                    display: "flex",
                    padding: 4,
                    borderRadius: 8,
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#f1f5f9")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "none")
                  }
                >
                  <FiX size={16} />
                </button>
              </div>
            </div>

            {/* Draft picker */}
            {showDraftPicker && (
              <div
                style={{
                  padding: "12px 22px",
                  background: "#f8faff",
                  borderBottom: "1px solid #e2e8f0",
                }}
              >
                <p
                  style={{
                    fontSize: 10.5,
                    fontWeight: 700,
                    color: "#94a3b8",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    margin: "0 0 8px",
                  }}
                >
                  Load a draft template
                </p>
                {drafts.map((d, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setFuSubject(d.subject);
                      setFuBody(d.body);
                      setShowDraftPicker(false);
                    }}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 9,
                      background: "#fff",
                      border: "1px solid #e2e8f0",
                      borderRadius: 9,
                      padding: "9px 12px",
                      cursor: "pointer",
                      textAlign: "left",
                      width: "100%",
                      marginBottom: 6,
                      fontFamily: "DM Sans,sans-serif",
                      transition: "all 0.15s",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = "#6366f1";
                      e.currentTarget.style.background = "#f8f9ff";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = "#e2e8f0";
                      e.currentTarget.style.background = "#fff";
                    }}
                  >
                    <div
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: 7,
                        background: "#eef2ff",
                        color: "#6366f1",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <FiEdit3 size={11} />
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <p
                        style={{
                          fontSize: 12.5,
                          fontWeight: 600,
                          color: "#0f172a",
                          margin: "0 0 1px",
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {d.subject}
                      </p>
                      <p
                        style={{
                          fontSize: 11,
                          color: "#94a3b8",
                          margin: 0,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {d.body.replace(/\n/g, " ").slice(0, 60)}…
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Context strip */}
            <div
              style={{
                padding: "10px 22px",
                background: "#fffbeb",
                borderBottom: "1px solid #fef3c7",
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <FiAlertCircle size={13} color="#b45309" />
              <p style={{ fontSize: 12, color: "#92400e", margin: 0 }}>
                Original: <strong>{activeModal.subject}</strong> · sent{" "}
                {activeModal.daysSince} days ago · {activeModal.opens} open
                {activeModal.opens !== 1 ? "s" : ""}, 0 replies
              </p>
            </div>

            {/* Form */}
            <div
              style={{
                padding: "18px 22px",
                display: "flex",
                flexDirection: "column",
                gap: 13,
              }}
            >
              <div>
                <label
                  style={{
                    fontSize: 10.5,
                    fontWeight: 700,
                    color: "#94a3b8",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    display: "block",
                    marginBottom: 6,
                  }}
                >
                  Subject
                </label>
                <input
                  value={fuSubject}
                  onChange={(e) => setFuSubject(e.target.value)}
                  style={fld}
                  onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
                  onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                />
              </div>
              <div>
                <label
                  style={{
                    fontSize: 10.5,
                    fontWeight: 700,
                    color: "#94a3b8",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    display: "block",
                    marginBottom: 6,
                  }}
                >
                  Message
                </label>
                <textarea
                  value={fuBody}
                  onChange={(e) => setFuBody(e.target.value)}
                  rows={7}
                  style={{ ...fld, resize: "none", lineHeight: 1.65 }}
                  onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
                  onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                />
                <p
                  style={{
                    textAlign: "right",
                    fontSize: 11,
                    color: "#d1d5db",
                    marginTop: 3,
                  }}
                >
                  {fuBody.length} chars
                </p>
              </div>
            </div>

            {/* Footer */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "13px 22px",
                borderTop: "1px solid #f1f5f9",
                background: "#fafafa",
              }}
            >
              <span
                style={{
                  fontSize: 11.5,
                  color: "#94a3b8",
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                <FiAtSign size={12} /> To: {activeModal.email}
              </span>
              {sentSuccess ? (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 7,
                    padding: "8px 16px",
                    borderRadius: 10,
                    background: "#d1fae5",
                    color: "#065f46",
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  <FiCheck size={14} /> Follow-up sent!
                </div>
              ) : (
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    className="btn-secondary"
                    onClick={() => setActiveModal(null)}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn-primary"
                    onClick={sendFollowUp}
                    disabled={!fuSubject.trim() || !fuBody.trim() || sending}
                    style={{
                      opacity: fuSubject.trim() && fuBody.trim() ? "1" : "0.45",
                    }}
                  >
                    {sending ? (
                      <>
                        <FiRefreshCw
                          size={13}
                          style={{ animation: "spin 0.8s linear infinite" }}
                        />{" "}
                        Sending…
                      </>
                    ) : (
                      <>
                        <FiSend size={13} /> Send Follow-up
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
