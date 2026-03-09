import { useState } from "react";
import {
  FiSearch,
  FiFilter,
  FiCalendar,
  FiPlus,
  FiPlay,
  FiPause,
  FiCheck,
  FiSkipForward,
  FiTrash2,
  FiEdit,
  FiX,
  FiUser,
  FiAtSign,
  FiLayers,
  FiType,
  FiList,
  FiZap,
  FiSend,
  FiClock,
  FiEye,
  FiEdit3,
  FiChevronDown,
  FiChevronUp,
  FiRefreshCw,
  FiAlertCircle,
} from "react-icons/fi";
import { followStatusConfig, priorityConfig } from "../utils/statusConfig";
import {
  DRAFT_TEMPLATES,
  followUpData,
  sentEmailsData,
} from "../data/dashboardData";

const DAY_MS = 864e5;
const FOLLOWUP_THRESHOLD_DAYS = 7;

// Derive follow-up candidates from sent data (no replies, sent 7+ days ago, not bounced)
const buildFollowUps = (sentList) =>
  sentList
    .filter(
      (m) =>
        m.replies === 0 && m.status !== "Bounced" && m.status !== "Replied",
    )
    .filter(
      (m) =>
        Date.now() - new Date(m.sentAt).getTime() >=
        FOLLOWUP_THRESHOLD_DAYS * DAY_MS,
    )
    .map((m) => ({
      ...m,
      daysSince: Math.floor(
        (Date.now() - new Date(m.sentAt).getTime()) / DAY_MS,
      ),
      followUpStatus: "Pending", // Pending | Sent | Snoozed | Dismissed
    }));

const Followups = () => {
  const [drafts] = useState(DRAFT_TEMPLATES);
  const [queue, setQueue] = useState(() => buildFollowUps(sentEmailsData));
  const [activeModal, setActiveModal] = useState(null); // row to compose follow-up for
  const [fuSubject, setFuSubject] = useState("");
  const [fuBody, setFuBody] = useState("");
  const [showDraftPicker, setShowDraftPicker] = useState(false);
  const [sending, setSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [filter, setFilter] = useState("Pending"); // Pending | Sent | Snoozed | All
  const [search, setSearch] = useState("");

  const dismiss = (id) =>
    setQueue((q) =>
      q.map((x) => (x.id === id ? { ...x, followUpStatus: "Dismissed" } : x)),
    );
  const snooze = (id) =>
    setQueue((q) =>
      q.map((x) => (x.id === id ? { ...x, followUpStatus: "Snoozed" } : x)),
    );

  const openCompose = (row) => {
    setActiveModal(row);
    setFuSubject("Re: " + row.subject);
    setFuBody(
      `Hi ${row.to.split(" ")[0]},\n\nI just wanted to follow up on my email from ${row.daysSince} days ago. Has there been any progress on your end?\n\nHappy to answer any questions or hop on a quick call.\n\nBest,`,
    );
    setShowDraftPicker(false);
    setSentSuccess(false);
  };

  const sendFollowUp = () => {
    if (!fuSubject.trim() || !fuBody.trim()) return;
    setSending(true);
    setTimeout(() => {
      setQueue((q) =>
        q.map((x) =>
          x.id === activeModal.id ? { ...x, followUpStatus: "Sent" } : x,
        ),
      );
      setSending(false);
      setSentSuccess(true);
      setTimeout(() => {
        setActiveModal(null);
        setSentSuccess(false);
      }, 1600);
    }, 1200);
  };

  const counts = {
    Pending: queue.filter((x) => x.followUpStatus === "Pending").length,
    Sent: queue.filter((x) => x.followUpStatus === "Sent").length,
    Snoozed: queue.filter((x) => x.followUpStatus === "Snoozed").length,
    All: queue.length,
  };

  const visible = queue.filter((x) => {
    const matchF = filter === "All" || x.followUpStatus === filter;
    const q = search.toLowerCase();
    return (
      matchF &&
      (x.to.toLowerCase().includes(q) ||
        x.email.toLowerCase().includes(q) ||
        x.subject.toLowerCase().includes(q))
    );
  });

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

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* ── BANNER ── */}
      <div
        className="fade-up d0"
        style={{
          background: "linear-gradient(135deg,#6366f1 0%,#818cf8 100%)",
          borderRadius: 14,
          padding: "18px 22px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: "0 4px 16px rgba(99,102,241,0.25)",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 44,
              height: 44,
              borderRadius: 13,
              background: "rgba(255,255,255,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FiClock size={20} color="#fff" />
          </div>
          <div>
            <h2
              style={{
                fontSize: 15,
                fontWeight: 700,
                color: "#fff",
                margin: "0 0 3px",
              }}
            >
              Follow-up Queue
            </h2>
            <p
              style={{
                fontSize: 12.5,
                color: "rgba(255,255,255,0.75)",
                margin: 0,
              }}
            >
              Emails sent {FOLLOWUP_THRESHOLD_DAYS}+ days ago with no reply —
              time to nudge
            </p>
          </div>
        </div>
        <div style={{ display: "flex", gap: 16, textAlign: "center" }}>
          {[
            { label: "Pending", val: counts.Pending, c: "#fef9c3" },
            { label: "Sent", val: counts.Sent, c: "#d1fae5" },
            { label: "Snoozed", val: counts.Snoozed, c: "#e0f2fe" },
          ].map((s, i) => (
            <div key={i}>
              <div
                className="mono"
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: s.c,
                  lineHeight: 1,
                }}
              >
                {s.val}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "rgba(255,255,255,0.7)",
                  marginTop: 2,
                }}
              >
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── QUEUE ── */}
      <div
        className="fade-up d1"
        style={{
          background: "#fff",
          borderRadius: 14,
          border: "1px solid #f1f5f9",
          overflow: "hidden",
          boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
        }}
      >
        {/* Toolbar */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "14px 20px",
            borderBottom: "1px solid #f1f5f9",
            gap: 12,
          }}
        >
          {/* Filter tabs */}
          <div
            style={{
              display: "flex",
              gap: 2,
              background: "#f8fafc",
              borderRadius: 10,
              padding: 3,
            }}
          >
            {["Pending", "Sent", "Snoozed", "All"].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  padding: "5px 13px",
                  borderRadius: 8,
                  fontSize: 12,
                  fontWeight: 600,
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "DM Sans,sans-serif",
                  background: filter === f ? "#fff" : "transparent",
                  color: filter === f ? "#6366f1" : "#94a3b8",
                  boxShadow:
                    filter === f ? "0 1px 4px rgba(0,0,0,0.08)" : "none",
                  transition: "all 0.15s",
                  display: "flex",
                  alignItems: "center",
                  gap: 5,
                }}
              >
                {f}
                <span
                  style={{
                    background: filter === f ? "#eef2ff" : "#e2e8f0",
                    color: filter === f ? "#6366f1" : "#94a3b8",
                    fontSize: 10,
                    fontWeight: 700,
                    padding: "1px 5px",
                    borderRadius: 20,
                  }}
                >
                  {counts[f]}
                </span>
              </button>
            ))}
          </div>
          {/* Search */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              border: "1px solid #e2e8f0",
              borderRadius: 9,
              padding: "6px 12px",
              background: "#fafafa",
            }}
          >
            <FiSearch size={13} color="#94a3b8" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search…"
              style={{
                border: "none",
                outline: "none",
                background: "transparent",
                fontSize: 12.5,
                color: "#374151",
                width: 160,
                fontFamily: "DM Sans,sans-serif",
              }}
            />
          </div>
        </div>

        {/* Empty state */}
        {visible.length === 0 && (
          <div
            style={{
              padding: "52px",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
            }}
          >
            <div
              style={{
                width: 52,
                height: 52,
                borderRadius: 14,
                background: "#f1f5f9",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#94a3b8",
              }}
            >
              <FiCheck size={22} />
            </div>
            <p
              style={{
                fontSize: 14,
                fontWeight: 600,
                color: "#94a3b8",
                margin: 0,
              }}
            >
              All clear!
            </p>
            <p style={{ fontSize: 13, color: "#cbd5e1", margin: 0 }}>
              No follow-ups in this filter. Send more emails to build your
              queue.
            </p>
          </div>
        )}

        {/* Cards */}
        {visible.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column" }}>
            {visible.map((row, i) => {
              const hue = (row.to.charCodeAt(0) * 17) % 360;
              const urgency =
                row.daysSince >= 14
                  ? "#ef4444"
                  : row.daysSince >= 10
                    ? "#f59e0b"
                    : "#6366f1";
              const fStatus = row.followUpStatus;
              return (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 16,
                    padding: "16px 20px",
                    borderBottom:
                      i < visible.length - 1 ? "1px solid #f8fafc" : "none",
                    transition: "background 0.15s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "#fafafe")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "transparent")
                  }
                >
                  {/* Avatar */}
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      background: `hsl(${hue},55%,88%)`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 14,
                      fontWeight: 700,
                      color: `hsl(${hue},45%,35%)`,
                      flexShrink: 0,
                    }}
                  >
                    {row.to[0]}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        marginBottom: 3,
                      }}
                    >
                      <p
                        style={{
                          fontSize: 13.5,
                          fontWeight: 700,
                          color: "#0f172a",
                          margin: 0,
                        }}
                      >
                        {row.to}
                      </p>
                      <span style={{ fontSize: 11, color: "#94a3b8" }}>
                        {row.email}
                      </span>
                      {/* Status badge */}
                      {fStatus === "Sent" && (
                        <span
                          style={{
                            fontSize: 10.5,
                            fontWeight: 700,
                            background: "#d1fae5",
                            color: "#065f46",
                            padding: "2px 8px",
                            borderRadius: 20,
                          }}
                        >
                          Follow-up Sent
                        </span>
                      )}
                      {fStatus === "Snoozed" && (
                        <span
                          style={{
                            fontSize: 10.5,
                            fontWeight: 700,
                            background: "#f1f5f9",
                            color: "#94a3b8",
                            padding: "2px 8px",
                            borderRadius: 20,
                          }}
                        >
                          Snoozed
                        </span>
                      )}
                    </div>
                    <p
                      style={{
                        fontSize: 12.5,
                        color: "#374151",
                        margin: "0 0 2px",
                        fontWeight: 500,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        maxWidth: 400,
                      }}
                    >
                      {row.subject}
                    </p>
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 12 }}
                    >
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                          fontSize: 11.5,
                          color: urgency,
                          fontWeight: 600,
                        }}
                      >
                        <FiClock size={11} /> {row.daysSince} days since sent
                      </span>
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 4,
                          fontSize: 11.5,
                          color: "#94a3b8",
                        }}
                      >
                        <FiEye size={11} /> {row.opens} open
                        {row.opens !== 1 ? "s" : ""}
                      </span>
                      <span style={{ fontSize: 11.5, color: "#cbd5e1" }}>
                        · Original: {row.date}
                      </span>
                    </div>
                  </div>

                  {/* Urgency bar */}
                  <div
                    style={{
                      width: 4,
                      height: 44,
                      borderRadius: 99,
                      background: `${urgency}30`,
                      flexShrink: 0,
                    }}
                  >
                    <div
                      style={{
                        width: "100%",
                        height: `${Math.min((row.daysSince / 21) * 100, 100)}%`,
                        background: urgency,
                        borderRadius: 99,
                        transition: "height 0.3s",
                      }}
                    />
                  </div>

                  {/* Actions */}
                  <div style={{ display: "flex", gap: 7, flexShrink: 0 }}>
                    {fStatus === "Pending" && (
                      <>
                        <button
                          className="btn-primary"
                          onClick={() => openCompose(row)}
                          style={{ padding: "7px 14px", fontSize: 12.5 }}
                        >
                          <FiSend size={12} /> Send Follow-up
                        </button>
                        <button
                          onClick={() => snooze(row.id)}
                          title="Snooze"
                          style={{
                            background: "none",
                            border: "1px solid #e2e8f0",
                            borderRadius: 8,
                            padding: "7px 9px",
                            cursor: "pointer",
                            color: "#94a3b8",
                            display: "flex",
                            lineHeight: 0,
                            transition: "all 0.15s",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = "#fef3c7";
                            e.currentTarget.style.borderColor = "#fcd34d";
                            e.currentTarget.style.color = "#b45309";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "none";
                            e.currentTarget.style.borderColor = "#e2e8f0";
                            e.currentTarget.style.color = "#94a3b8";
                          }}
                        >
                          <FiPause size={13} />
                        </button>
                        <button
                          onClick={() => dismiss(row.id)}
                          title="Dismiss"
                          style={{
                            background: "none",
                            border: "1px solid #e2e8f0",
                            borderRadius: 8,
                            padding: "7px 9px",
                            cursor: "pointer",
                            color: "#94a3b8",
                            display: "flex",
                            lineHeight: 0,
                            transition: "all 0.15s",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = "#fee2e2";
                            e.currentTarget.style.borderColor = "#fca5a5";
                            e.currentTarget.style.color = "#ef4444";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = "none";
                            e.currentTarget.style.borderColor = "#e2e8f0";
                            e.currentTarget.style.color = "#94a3b8";
                          }}
                        >
                          <FiX size={13} />
                        </button>
                      </>
                    )}
                    {fStatus === "Snoozed" && (
                      <button
                        onClick={() =>
                          setQueue((q) =>
                            q.map((x) =>
                              x.id === row.id
                                ? { ...x, followUpStatus: "Pending" }
                                : x,
                            ),
                          )
                        }
                        style={{
                          background: "none",
                          border: "1px solid #c7d2fe",
                          borderRadius: 8,
                          padding: "7px 12px",
                          cursor: "pointer",
                          color: "#6366f1",
                          display: "flex",
                          alignItems: "center",
                          gap: 5,
                          fontSize: 12,
                          fontWeight: 600,
                          fontFamily: "DM Sans,sans-serif",
                          transition: "all 0.15s",
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = "#eef2ff";
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = "none";
                        }}
                      >
                        <FiPlay size={12} /> Resume
                      </button>
                    )}
                    {fStatus === "Sent" && (
                      <span
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 5,
                          fontSize: 12,
                          color: "#10b981",
                          fontWeight: 600,
                        }}
                      >
                        <FiCheck size={13} /> Done
                      </span>
                    )}
                    {fStatus === "Dismissed" && (
                      <span style={{ fontSize: 12, color: "#d1d5db" }}>
                        Dismissed
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── COMPOSE FOLLOW-UP MODAL ── */}
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

export default Followups;
