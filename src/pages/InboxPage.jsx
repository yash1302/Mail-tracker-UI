import { useState } from "react";

import {
  FiSearch,
  FiMessageSquare,
  FiStar,
  FiCircle,
  FiTrash2,
  FiX,
  FiSend,
  FiRefreshCw,
  FiCheck,
  FiInbox,
  FiCornerUpRight,
  FiEdit3,
  FiChevronUp,
  FiChevronDown
} from "react-icons/fi";
import { inboxData, inboxTagConfig } from "../data/dashboardData";

const InboxPage = () => {
  const [messages, setMessages] = useState(inboxData);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("All"); // All | Unread | Starred
  const [search, setSearch] = useState("");
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyBody, setReplyBody] = useState("");
  const [replySending, setReplySending] = useState(false);
  const [replySent, setReplySent] = useState(false);
  const [showDraftPicker, setShowDraftPicker] = useState(false);

  const drafts = [
    {
      subject: "Following up on our conversation",
      body: "Hi [Name],\n\nThanks for getting back to me! I wanted to follow up on our last exchange and answer any remaining questions.\n\nBest,",
    },
    {
      subject: "Sending over the info you requested",
      body: "Hi [Name],\n\nAs promised, here's the information you requested. Please let me know if you need anything else.\n\nBest,",
    },
  ];

  const unreadCount = messages.filter((m) => !m.read).length;

  const markRead = (id) =>
    setMessages((ms) =>
      ms.map((m) => (m.id === id ? { ...m, read: true } : m)),
    );
  const toggleStar = (id) =>
    setMessages((ms) =>
      ms.map((m) => (m.id === id ? { ...m, starred: !m.starred } : m)),
    );
  const deleteMsg = (id) => {
    setMessages((ms) => ms.filter((m) => m.id !== id));
    if (selected?.id === id) setSelected(null);
  };
  const openMessage = (msg) => {
    markRead(msg.id);
    setSelected(msg);
    setReplyOpen(false);
    setReplyBody("");
    setReplySent(false);
    setShowDraftPicker(false);
  };

  const sendReply = () => {
    if (!replyBody.trim()) return;
    setReplySending(true);
    setTimeout(() => {
      setReplySending(false);
      setReplySent(true);
      setMessages((ms) =>
        ms.map((m) =>
          m.id === selected.id ? { ...m, thread: (m.thread || 1) + 1 } : m,
        ),
      );
      setTimeout(() => {
        setReplyOpen(false);
        setReplyBody("");
        setReplySent(false);
      }, 1800);
    }, 1200);
  };

  const visible = messages.filter((m) => {
    const matchF =
      filter === "Unread" ? !m.read : filter === "Starred" ? m.starred : true;
    const q = search.toLowerCase();
    return (
      matchF &&
      (m.from.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.subject.toLowerCase().includes(q) ||
        m.preview.toLowerCase().includes(q))
    );
  });

  const timeSince = (ts) => {
    const d = Math.floor((Date.now() - new Date(ts).getTime()) / 864e5);
    if (d === 0) return "Today";
    if (d === 1) return "Yesterday";
    return `${d}d ago`;
  };

  return (
    <div
      className="fade-up d0"
      style={{
        display: "grid",
        gridTemplateColumns: selected ? "320px 1fr" : "1fr",
        gap: 0,
        height: "calc(100vh - 62px - 44px)",
        background: "#fff",
        borderRadius: 14,
        border: "1px solid #f1f5f9",
        overflow: "hidden",
        boxShadow: "0 1px 8px rgba(0,0,0,0.05)",
      }}
    >
      {/* ── LEFT: MESSAGE LIST ── */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          borderRight: selected ? "1px solid #f1f5f9" : "none",
          height: "100%",
          overflow: "hidden",
        }}
      >
        {/* List header */}
        <div
          style={{
            padding: "14px 16px",
            borderBottom: "1px solid #f1f5f9",
            flexShrink: 0,
          }}
        >
          {/* Search */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              border: "1px solid #e2e8f0",
              borderRadius: 10,
              padding: "7px 12px",
              background: "#fafafa",
              marginBottom: 10,
            }}
          >
            <FiSearch size={13} color="#94a3b8" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search inbox…"
              style={{
                border: "none",
                outline: "none",
                background: "transparent",
                fontSize: 12.5,
                color: "#374151",
                width: "100%",
                fontFamily: "DM Sans,sans-serif",
              }}
            />
          </div>
          {/* Filter tabs */}
          <div
            style={{
              display: "flex",
              gap: 2,
              background: "#f8fafc",
              borderRadius: 9,
              padding: "3px",
            }}
          >
            {[
              ["All", messages.length],
              ["Unread", unreadCount],
              ["Starred", messages.filter((m) => m.starred).length],
            ].map(([f, c]) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                style={{
                  flex: 1,
                  padding: "5px 4px",
                  borderRadius: 7,
                  fontSize: 11.5,
                  fontWeight: 600,
                  border: "none",
                  cursor: "pointer",
                  fontFamily: "DM Sans,sans-serif",
                  background: filter === f ? "#fff" : "transparent",
                  color: filter === f ? "#6366f1" : "#94a3b8",
                  boxShadow:
                    filter === f ? "0 1px 3px rgba(0,0,0,0.07)" : "none",
                  transition: "all 0.15s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 4,
                }}
              >
                {f}{" "}
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    background: filter === f ? "#eef2ff" : "transparent",
                    color: filter === f ? "#6366f1" : "#b0bad1",
                    padding: "1px 5px",
                    borderRadius: 20,
                  }}
                >
                  {c}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Message rows */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {visible.length === 0 ? (
            <div
              style={{
                padding: "40px 20px",
                textAlign: "center",
                color: "#d1d5db",
                fontSize: 13,
              }}
            >
              No messages found
            </div>
          ) : (
            visible.map((msg, i) => {
              const hue = (msg.from.charCodeAt(0) * 17) % 360;
              const tc = inboxTagConfig[msg.tag] || {
                bg: "#f1f5f9",
                color: "#475569",
              };
              const isActive = selected?.id === msg.id;
              return (
                <div
                  key={i}
                  onClick={() => openMessage(msg)}
                  style={{
                    padding: "13px 16px",
                    borderBottom: "1px solid #f8fafc",
                    cursor: "pointer",
                    transition: "background 0.15s",
                    background: isActive
                      ? "#f0f1ff"
                      : !msg.read
                        ? "#fafbff"
                        : "transparent",
                    position: "relative",
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive)
                      e.currentTarget.style.background = msg.read
                        ? "#fafafa"
                        : "#f5f6ff";
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive)
                      e.currentTarget.style.background = !msg.read
                        ? "#fafbff"
                        : "transparent";
                  }}
                >
                  {/* Unread dot */}
                  {!msg.read && (
                    <div
                      style={{
                        position: "absolute",
                        left: 5,
                        top: "50%",
                        transform: "translateY(-50%)",
                        width: 6,
                        height: 6,
                        borderRadius: "50%",
                        background: "#6366f1",
                      }}
                    />
                  )}

                  <div
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 10,
                    }}
                  >
                    {/* Avatar */}
                    <div
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: "50%",
                        background: `hsl(${hue},55%,88%)`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 13,
                        fontWeight: 700,
                        color: `hsl(${hue},45%,35%)`,
                        flexShrink: 0,
                        marginTop: 1,
                      }}
                    >
                      {msg.from[0]}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginBottom: 2,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 13,
                            fontWeight: msg.read ? 500 : 700,
                            color: "#0f172a",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            maxWidth: 140,
                          }}
                        >
                          {msg.from}
                        </span>
                        <span
                          style={{
                            fontSize: 11,
                            color: "#94a3b8",
                            flexShrink: 0,
                            marginLeft: 8,
                          }}
                        >
                          {timeSince(msg.ts)}
                        </span>
                      </div>
                      <p
                        style={{
                          fontSize: 12.5,
                          fontWeight: msg.read ? 400 : 600,
                          color: "#374151",
                          margin: "0 0 3px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {msg.subject}
                      </p>
                      <p
                        style={{
                          fontSize: 11.5,
                          color: "#94a3b8",
                          margin: 0,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {msg.preview}
                      </p>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                          marginTop: 5,
                        }}
                      >
                        <span
                          style={{
                            fontSize: 10.5,
                            fontWeight: 600,
                            background: tc.bg,
                            color: tc.color,
                            padding: "2px 7px",
                            borderRadius: 20,
                          }}
                        >
                          {msg.tag}
                        </span>
                        {msg.thread > 1 && (
                          <span
                            style={{
                              fontSize: 10.5,
                              color: "#94a3b8",
                              display: "flex",
                              alignItems: "center",
                              gap: 3,
                            }}
                          >
                            <FiMessageSquare size={10} />
                            {msg.thread}
                          </span>
                        )}
                        {msg.starred && (
                          <FiStar size={11} color="#f59e0b" fill="#f59e0b" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* ── RIGHT: MESSAGE DETAIL ── */}
      {selected ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
            overflow: "hidden",
          }}
        >
          {/* Detail toolbar */}
          <div
            style={{
              padding: "13px 20px",
              borderBottom: "1px solid #f1f5f9",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexShrink: 0,
              background: "#fff",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {/* Star */}
              <button
                onClick={() => toggleStar(selected.id)}
                title={selected.starred ? "Unstar" : "Star"}
                style={{
                  background: "none",
                  border: "1px solid #e2e8f0",
                  borderRadius: 8,
                  padding: "6px 8px",
                  cursor: "pointer",
                  color: selected.starred ? "#f59e0b" : "#94a3b8",
                  display: "flex",
                  lineHeight: 0,
                  transition: "all 0.15s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#fef9c3")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "none")
                }
              >
                <FiStar
                  size={13}
                  fill={selected.starred ? "#f59e0b" : "none"}
                />
              </button>
              {/* Mark unread */}
              <button
                onClick={() => {
                  setMessages((ms) =>
                    ms.map((m) =>
                      m.id === selected.id ? { ...m, read: false } : m,
                    ),
                  );
                }}
                style={{
                  background: "none",
                  border: "1px solid #e2e8f0",
                  borderRadius: 8,
                  padding: "6px 8px",
                  cursor: "pointer",
                  color: "#94a3b8",
                  display: "flex",
                  lineHeight: 0,
                  transition: "all 0.15s",
                  fontFamily: "DM Sans,sans-serif",
                  fontSize: 11.5,
                  fontWeight: 500,
                  alignItems: "center",
                  gap: 5,
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "#f8fafc")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "none")
                }
              >
                <FiCircle size={12} /> Mark unread
              </button>
              {/* Delete */}
              <button
                onClick={() => deleteMsg(selected.id)}
                style={{
                  background: "none",
                  border: "1px solid #e2e8f0",
                  borderRadius: 8,
                  padding: "6px 8px",
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
                <FiTrash2 size={13} />
              </button>
            </div>
            <button
              onClick={() => setSelected(null)}
              style={{
                background: "none",
                border: "none",
                cursor: "pointer",
                color: "#94a3b8",
                display: "flex",
                padding: 5,
                borderRadius: 8,
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.background = "#f1f5f9")
              }
              onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
            >
              <FiX size={15} />
            </button>
          </div>

          {/* Message body */}
          <div style={{ flex: 1, overflowY: "auto", padding: "24px 28px" }}>
            {/* Subject */}
            <h2
              style={{
                fontSize: 18,
                fontWeight: 700,
                color: "#0f172a",
                margin: "0 0 16px",
                lineHeight: 1.3,
              }}
            >
              {selected.subject}
            </h2>

            {/* Sender info */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: 20,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 11 }}>
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: "50%",
                    background: `hsl(${(selected.from.charCodeAt(0) * 17) % 360},55%,88%)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 15,
                    fontWeight: 700,
                    color: `hsl(${(selected.from.charCodeAt(0) * 17) % 360},45%,35%)`,
                    flexShrink: 0,
                  }}
                >
                  {selected.from[0]}
                </div>
                <div>
                  <div
                    style={{ display: "flex", alignItems: "center", gap: 8 }}
                  >
                    <p
                      style={{
                        fontSize: 14,
                        fontWeight: 700,
                        color: "#0f172a",
                        margin: 0,
                      }}
                    >
                      {selected.from}
                    </p>
                    <span
                      style={{
                        fontSize: 11,
                        background:
                          inboxTagConfig[selected.tag]?.bg || "#f1f5f9",
                        color: inboxTagConfig[selected.tag]?.color || "#475569",
                        padding: "2px 8px",
                        borderRadius: 20,
                        fontWeight: 600,
                      }}
                    >
                      {selected.tag}
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: 12,
                      color: "#94a3b8",
                      margin: "2px 0 0",
                    }}
                  >
                    {selected.email} · {selected.org}
                  </p>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontSize: 12, color: "#94a3b8", margin: 0 }}>
                  {selected.date}
                </p>
                {selected.thread > 1 && (
                  <p
                    style={{
                      fontSize: 11,
                      color: "#94a3b8",
                      margin: "2px 0 0",
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      justifyContent: "flex-end",
                    }}
                  >
                    <FiMessageSquare size={10} /> {selected.thread} messages
                  </p>
                )}
              </div>
            </div>

            <div style={{ borderTop: "1px solid #f1f5f9", marginBottom: 20 }} />

            {/* Body text */}
            <div
              style={{
                fontSize: 14,
                color: "#374151",
                lineHeight: 1.8,
                whiteSpace: "pre-line",
                background: "#fafafa",
                borderRadius: 12,
                padding: "18px 20px",
                border: "1px solid #f1f5f9",
              }}
            >
              {selected.body}
            </div>

            {/* Reply box */}
            <div style={{ marginTop: 20 }}>
              {!replyOpen ? (
                <button
                  onClick={() => setReplyOpen(true)}
                  className="btn-primary"
                  style={{
                    width: "100%",
                    justifyContent: "center",
                    padding: "10px",
                  }}
                >
                  <FiCornerUpRight size={14} /> Reply to{" "}
                  {selected.from.split(" ")[0]}
                </button>
              ) : (
                <div
                  style={{
                    border: "1px solid #e2e8f0",
                    borderRadius: 12,
                    overflow: "hidden",
                    boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                  }}
                >
                  {/* Reply header */}
                  <div
                    style={{
                      padding: "11px 16px",
                      background: "#fafafa",
                      borderBottom: "1px solid #f1f5f9",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div
                      style={{ display: "flex", alignItems: "center", gap: 8 }}
                    >
                      <span
                        style={{
                          fontSize: 12.5,
                          fontWeight: 600,
                          color: "#374151",
                        }}
                      >
                        Reply to {selected.from}
                      </span>
                      <span style={{ fontSize: 11.5, color: "#94a3b8" }}>
                        {selected.email}
                      </span>
                    </div>
                    <div
                      style={{ display: "flex", gap: 7, alignItems: "center" }}
                    >
                      {/* Draft picker */}
                      <button
                        onClick={() => setShowDraftPicker((v) => !v)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 5,
                          padding: "4px 10px",
                          borderRadius: 7,
                          fontSize: 11.5,
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
                        onClick={() => {
                          setReplyOpen(false);
                          setShowDraftPicker(false);
                        }}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "#94a3b8",
                          display: "flex",
                          padding: 3,
                          borderRadius: 6,
                        }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background = "#f1f5f9")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = "none")
                        }
                      >
                        <FiX size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Draft picker dropdown */}
                  {showDraftPicker && (
                    <div
                      style={{
                        padding: "10px 16px",
                        background: "#f8faff",
                        borderBottom: "1px solid #e2e8f0",
                      }}
                    >
                      {drafts.map((d, i) => (
                        <button
                          key={i}
                          onClick={() => {
                            setReplyBody(d.body);
                            setShowDraftPicker(false);
                          }}
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 8,
                            background: "#fff",
                            border: "1px solid #e2e8f0",
                            borderRadius: 8,
                            padding: "8px 11px",
                            cursor: "pointer",
                            textAlign: "left",
                            width: "100%",
                            marginBottom: i < drafts.length - 1 ? 6 : 0,
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
                          <FiEdit3
                            size={11}
                            color="#6366f1"
                            style={{ marginTop: 2, flexShrink: 0 }}
                          />
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

                  {/* Textarea */}
                  <textarea
                    value={replyBody}
                    onChange={(e) => setReplyBody(e.target.value)}
                    rows={5}
                    placeholder={`Reply to ${selected.from}…`}
                    style={{
                      width: "100%",
                      border: "none",
                      outline: "none",
                      padding: "14px 16px",
                      fontSize: 13.5,
                      color: "#374151",
                      lineHeight: 1.65,
                      fontFamily: "DM Sans,sans-serif",
                      resize: "none",
                      background: "#fff",
                    }}
                    autoFocus
                  />

                  {/* Reply footer */}
                  <div
                    style={{
                      padding: "10px 16px",
                      background: "#fafafa",
                      borderTop: "1px solid #f1f5f9",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span style={{ fontSize: 11.5, color: "#94a3b8" }}>
                      {replyBody.length} chars
                    </span>
                    {replySent ? (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 7,
                          padding: "7px 14px",
                          borderRadius: 9,
                          background: "#d1fae5",
                          color: "#065f46",
                          fontSize: 12.5,
                          fontWeight: 600,
                        }}
                      >
                        <FiCheck size={13} /> Reply sent!
                      </div>
                    ) : (
                      <button
                        className="btn-primary"
                        onClick={sendReply}
                        disabled={!replyBody.trim() || replySending}
                        style={{
                          opacity: replyBody.trim() ? "1" : "0.45",
                          padding: "7px 16px",
                          fontSize: 12.5,
                        }}
                      >
                        {replySending ? (
                          <>
                            <FiRefreshCw
                              size={12}
                              style={{ animation: "spin 0.8s linear infinite" }}
                            />{" "}
                            Sending…
                          </>
                        ) : (
                          <>
                            <FiSend size={12} /> Send Reply
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* Empty state when no message selected */
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            gap: 14,
            color: "#d1d5db",
            padding: 40,
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 18,
              background: "#f1f5f9",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#94a3b8",
            }}
          >
            <FiInbox size={28} />
          </div>
          <div style={{ textAlign: "center" }}>
            <p
              style={{
                fontSize: 15,
                fontWeight: 600,
                color: "#94a3b8",
                margin: "0 0 5px",
              }}
            >
              Select a message
            </p>
            <p style={{ fontSize: 13, color: "#d1d5db", margin: 0 }}>
              Click any email on the left to read and reply
            </p>
          </div>
          <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
            <div
              style={{
                background: "#f8fafc",
                border: "1px solid #f1f5f9",
                borderRadius: 10,
                padding: "10px 14px",
                textAlign: "center",
              }}
            >
              <div
                className="mono"
                style={{ fontSize: 20, fontWeight: 700, color: "#6366f1" }}
              >
                {messages.length}
              </div>
              <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>
                Total
              </div>
            </div>
            <div
              style={{
                background: "#f8fafc",
                border: "1px solid #f1f5f9",
                borderRadius: 10,
                padding: "10px 14px",
                textAlign: "center",
              }}
            >
              <div
                className="mono"
                style={{ fontSize: 20, fontWeight: 700, color: "#ef4444" }}
              >
                {unreadCount}
              </div>
              <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>
                Unread
              </div>
            </div>
            <div
              style={{
                background: "#f8fafc",
                border: "1px solid #f1f5f9",
                borderRadius: 10,
                padding: "10px 14px",
                textAlign: "center",
              }}
            >
              <div
                className="mono"
                style={{ fontSize: 20, fontWeight: 700, color: "#f59e0b" }}
              >
                {messages.filter((m) => m.starred).length}
              </div>
              <div style={{ fontSize: 11, color: "#94a3b8", marginTop: 2 }}>
                Starred
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InboxPage;
