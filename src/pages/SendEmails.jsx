import { useState, useRef } from "react";
import Button from "../components/Button";
import {
  FiAlignLeft,
  FiAtSign,
  FiCheck,
  FiCornerUpRight,
  FiEdit3,
  FiEye,
  FiFile,
  FiFilter,
  FiInbox,
  FiPaperclip,
  FiPlus,
  FiRefreshCw,
  FiSearch,
  FiSend,
  FiTrash2,
  FiType,
  FiX,
  FiUsers,
  FiChevronDown,
  FiChevronUp
} from "react-icons/fi";
import { DRAFT_TEMPLATES, sentEmailsData } from "../data/dashboardData";
import { sentStatusConfig } from "../utils/statusConfig.jsx";

const SendEmails = () => {
  const [tab, setTab] = useState("compose");
  const [recipients, setRecipients] = useState([]);
  const [recipientInput, setRecipientInput] = useState("");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [sending, setSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [sentList, setSentList] = useState(sentEmailsData);
  const [viewEmail, setViewEmail] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showDraftPicker, setShowDraftPicker] = useState(false);
  const fileRef = useRef(null);

  /* ── recipient chips ── */
  const addRecipient = (val) => {
    const v = val.trim().replace(/,$/, "");
    if (v && !recipients.includes(v)) setRecipients((r) => [...r, v]);
    setRecipientInput("");
  };
  const handleRecipientKey = (e) => {
    if (["Enter", ",", " "].includes(e.key)) {
      e.preventDefault();
      addRecipient(recipientInput);
    }
  };
  const removeRecipient = (r) =>
    setRecipients((rs) => rs.filter((x) => x !== r));
  const allTo = [
    ...recipients,
    ...(recipientInput.trim() ? [recipientInput.trim()] : []),
  ];

  const addFiles = (files) => {
    const nf = Array.from(files).filter(
      (f) => !attachments.find((a) => a.name === f.name && a.size === f.size),
    );
    setAttachments((p) => [...p, ...nf]);
  };

  const handleSend = () => {
    const targets = [
      ...recipients,
      ...(recipientInput.trim() ? [recipientInput.trim()] : []),
    ];
    if (!targets.length || !subject.trim() || !body.trim()) return;
    setSending(true);
    setTimeout(() => {
      const now = new Date();
      const newMails = targets.map((email) => ({
        id: Date.now() + Math.random(),
        to: email
          .split("@")[0]
          .replace(/[._]/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase()),
        email,
        subject,
        body,
        sentAt: now,
        date: now.toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
        }),
        status: "Delivered",
        opens: 0,
        replies: 0,
      }));
      setSentList((p) => [...newMails, ...p]);
      setSending(false);
      setSentSuccess(true);
      setRecipients([]);
      setRecipientInput("");
      setSubject("");
      setBody("");
      setAttachments([]);
      setTimeout(() => {
        setSentSuccess(false);
        setTab("sent");
      }, 1800);
    }, 1400);
  };

  const canSend = allTo.length > 0 && subject.trim() && body.trim();
  const statuses = ["All", ...new Set(sentList.map((m) => m.status))];
  const filtered = sentList.filter((m) => {
    const q = search.toLowerCase();
    return (
      (statusFilter === "All" || m.status === statusFilter) &&
      (m.to.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.subject.toLowerCase().includes(q))
    );
  });

  const fld = {
    border: "1px solid #e2e8f0",
    borderRadius: 10,
    padding: "10px 13px",
    width: "100%",
    fontSize: 13,
    color: "#374151",
    outline: "none",
    transition: "border-color 0.15s",
    fontFamily: "DM Sans,sans-serif",
    background: "#fff",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      {/* Tabs */}
      <div
        className="fade-up d0"
        style={{
          display: "flex",
          gap: 0,
          borderBottom: "2px solid #f1f5f9",
          marginBottom: 20,
        }}
      >
        {[
          ["compose", "Compose Email", <FiEdit3 size={14} />],
          ["sent", "Sent Emails", <FiInbox size={14} />],
        ].map(([key, label, icon]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 7,
              padding: "10px 20px",
              fontSize: 13.5,
              fontWeight: 600,
              border: "none",
              background: "none",
              cursor: "pointer",
              fontFamily: "DM Sans,sans-serif",
              borderBottom: `2px solid ${tab === key ? "#6366f1" : "transparent"}`,
              marginBottom: "-2px",
              color: tab === key ? "#6366f1" : "#94a3b8",
              transition: "all 0.15s",
            }}
          >
            {icon} {label}
            {key === "sent" && sentList.length > 0 && (
              <span
                style={{
                  background: tab === "sent" ? "#6366f1" : "#e2e8f0",
                  color: tab === "sent" ? "#fff" : "#64748b",
                  fontSize: 10,
                  fontWeight: 700,
                  padding: "1px 6px",
                  borderRadius: 20,
                }}
              >
                {sentList.length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ── COMPOSE ── */}
      {tab === "compose" && (
        <div
          className="fade-up d1"
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 360px",
            gap: 20,
            alignItems: "start",
          }}
        >
          {/* Left: form */}
          <div
            style={{
              background: "#fff",
              borderRadius: 16,
              border: "1px solid #f1f5f9",
              overflow: "hidden",
              boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
            }}
          >
            {/* Card header */}
            <div
              style={{
                padding: "16px 22px",
                borderBottom: "1px solid #f1f5f9",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 9,
                    background: "#eef2ff",
                    color: "#6366f1",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <FiEdit3 size={15} />
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
                    New Email
                  </h2>
                  <p style={{ fontSize: 11.5, color: "#94a3b8", margin: 0 }}>
                    Single or mass send
                  </p>
                </div>
              </div>
              {/* Draft picker toggle */}
              <button
                onClick={() => setShowDraftPicker((v) => !v)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "6px 12px",
                  borderRadius: 9,
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
                <FiEdit3 size={12} /> Use Draft{" "}
                {showDraftPicker ? (
                  <FiChevronUp size={11} />
                ) : (
                  <FiChevronDown size={11} />
                )}
              </button>
            </div>

            {/* Draft picker */}
            {showDraftPicker && (
              <div
                style={{
                  padding: "14px 22px",
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
                    margin: "0 0 9px",
                  }}
                >
                  Choose a saved draft
                </p>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 7 }}
                >
                  {DRAFT_TEMPLATES.map((d, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setSubject(d.subject);
                        setBody(d.body);
                        setShowDraftPicker(false);
                      }}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 10,
                        background: "#fff",
                        border: "1px solid #e2e8f0",
                        borderRadius: 10,
                        padding: "10px 13px",
                        cursor: "pointer",
                        textAlign: "left",
                        transition: "all 0.15s",
                        fontFamily: "DM Sans,sans-serif",
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
                          width: 28,
                          height: 28,
                          borderRadius: 8,
                          background: "#eef2ff",
                          color: "#6366f1",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          marginTop: 1,
                        }}
                      >
                        <FiEdit3 size={12} />
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <p
                          style={{
                            fontSize: 13,
                            fontWeight: 600,
                            color: "#0f172a",
                            margin: "0 0 2px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {d.subject}
                        </p>
                        <p
                          style={{
                            fontSize: 11.5,
                            color: "#94a3b8",
                            margin: 0,
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {d.body.replace(/\n/g, " ").slice(0, 70)}…
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div
              style={{
                padding: "20px 22px",
                display: "flex",
                flexDirection: "column",
                gap: 14,
              }}
            >
              {/* Multi-recipient chip input */}
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <label
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: "#94a3b8",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      display: "flex",
                      alignItems: "center",
                      gap: 5,
                    }}
                  >
                    <FiUsers size={11} /> To
                    {recipients.length > 1 && (
                      <span
                        style={{
                          fontSize: 10,
                          fontWeight: 500,
                          color: "#6366f1",
                          background: "#eef2ff",
                          padding: "1px 7px",
                          borderRadius: 20,
                          marginLeft: 4,
                        }}
                      >
                        Mass send · {recipients.length} recipients
                      </span>
                    )}
                  </label>
                </div>
                <div
                  onClick={(e) =>
                    e.currentTarget.querySelector("input")?.focus()
                  }
                  style={{
                    minHeight: 44,
                    border: "1px solid #e2e8f0",
                    borderRadius: 10,
                    padding: "6px 10px",
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 5,
                    alignItems: "center",
                    background: "#fff",
                    cursor: "text",
                    transition: "border-color 0.15s",
                  }}
                >
                  {recipients.map((r, i) => (
                    <span
                      key={i}
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                        background: "#eef2ff",
                        border: "1px solid #c7d2fe",
                        borderRadius: 7,
                        padding: "3px 8px",
                        fontSize: 12,
                        color: "#4f46e5",
                        fontWeight: 500,
                        flexShrink: 0,
                      }}
                    >
                      {r}
                      <button
                        onClick={() => removeRecipient(r)}
                        style={{
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "#818cf8",
                          lineHeight: 0,
                          padding: 0,
                          display: "flex",
                        }}
                      >
                        <FiX size={10} />
                      </button>
                    </span>
                  ))}
                  <input
                    value={recipientInput}
                    onChange={(e) => setRecipientInput(e.target.value)}
                    onKeyDown={handleRecipientKey}
                    onBlur={() => {
                      if (recipientInput.trim()) addRecipient(recipientInput);
                    }}
                    placeholder={
                      recipients.length === 0
                        ? "hiring@company.com — press Enter to add more"
                        : "Add another email…"
                    }
                    style={{
                      border: "none",
                      outline: "none",
                      fontSize: 12.5,
                      color: "#374151",
                      background: "transparent",
                      flexGrow: 1,
                      minWidth: 200,
                      fontFamily: "DM Sans,sans-serif",
                    }}
                  />
                </div>
                <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>
                  Press{" "}
                  <kbd
                    style={{
                      fontSize: 10,
                      background: "#f1f5f9",
                      border: "1px solid #e2e8f0",
                      borderRadius: 4,
                      padding: "1px 5px",
                    }}
                  >
                    Enter
                  </kbd>{" "}
                  after each address to add it as a chip
                </p>
              </div>

              {/* Subject */}
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <label
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#94a3b8",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                  }}
                >
                  <FiType size={11} /> Subject
                </label>
                <input
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  placeholder="e.g. Quick question about your product"
                  style={fld}
                  onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
                  onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                />
              </div>

              {/* Body */}
              <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
                <label
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#94a3b8",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                  }}
                >
                  <FiAlignLeft size={11} /> Message
                </label>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={8}
                  placeholder="Write your email here…"
                  style={{ ...fld, resize: "none", lineHeight: 1.65 }}
                  onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
                  onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                />
                <p
                  style={{
                    textAlign: "right",
                    fontSize: 11,
                    color: "#d1d5db",
                    margin: 0,
                  }}
                >
                  {body.length} chars
                </p>
              </div>

              {/* Attachments */}
              <div>
                <label
                  style={{
                    fontSize: 11,
                    fontWeight: 700,
                    color: "#94a3b8",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    display: "flex",
                    alignItems: "center",
                    gap: 5,
                    marginBottom: 7,
                  }}
                >
                  <FiPaperclip size={11} /> Attachments
                </label>
                <div
                  onClick={() => fileRef.current?.click()}
                  style={{
                    border: "2px dashed #e2e8f0",
                    borderRadius: 10,
                    padding: "11px",
                    cursor: "pointer",
                    background: "#fafafa",
                    textAlign: "center",
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#6366f1";
                    e.currentTarget.style.background = "#eef2ff";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#e2e8f0";
                    e.currentTarget.style.background = "#fafafa";
                  }}
                >
                  <p style={{ fontSize: 12.5, color: "#64748b", margin: 0 }}>
                    Click to attach files
                  </p>
                  <input
                    ref={fileRef}
                    type="file"
                    multiple
                    style={{ display: "none" }}
                    onChange={(e) => addFiles(e.target.files)}
                  />
                </div>
                {attachments.length > 0 && (
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      gap: 6,
                      marginTop: 8,
                    }}
                  >
                    {attachments.map((f, i) => (
                      <span
                        key={i}
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 5,
                          background: "#eef2ff",
                          border: "1px solid #c7d2fe",
                          borderRadius: 8,
                          padding: "4px 9px",
                          fontSize: 11.5,
                          color: "#4f46e5",
                        }}
                      >
                        <FiFile size={11} /> {f.name}
                        <button
                          onClick={() =>
                            setAttachments((a) => a.filter((_, j) => j !== i))
                          }
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            color: "#818cf8",
                            lineHeight: 0,
                            padding: 0,
                          }}
                        >
                          <FiX size={11} />
                        </button>
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer row */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  paddingTop: 2,
                }}
              >
                <span style={{ fontSize: 12, color: "#94a3b8" }}>
                  {allTo.length > 1 && (
                    <span
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 5,
                        color: "#6366f1",
                        fontWeight: 600,
                      }}
                    >
                      <FiUsers size={13} /> Sending to {allTo.length} people
                    </span>
                  )}
                </span>
                {sentSuccess ? (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      padding: "8px 18px",
                      borderRadius: 10,
                      background: "#d1fae5",
                      color: "#065f46",
                      fontSize: 13,
                      fontWeight: 600,
                    }}
                  >
                    <FiCheck size={14} />
                    {allTo.length > 1 ? `Sent to ${allTo.length}!` : "Sent!"}
                  </div>
                ) : (
                  <button
                    className="btn-primary"
                    onClick={handleSend}
                    disabled={!canSend || sending}
                    style={{
                      opacity: canSend ? "1" : "0.45",
                      cursor: canSend ? "pointer" : "not-allowed",
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
                        <FiSend size={13} />{" "}
                        {allTo.length > 1
                          ? `Send to ${allTo.length}`
                          : "Send Email"}
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Right: preview + tips */}
          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            <div
              style={{
                background: "#fff",
                borderRadius: 16,
                border: "1px solid #f1f5f9",
                padding: "18px 20px",
                boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
              }}
            >
              <h3
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#94a3b8",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginBottom: 13,
                }}
              >
                Preview
              </h3>
              <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
                <div style={{ display: "flex", gap: 8 }}>
                  <span
                    style={{
                      fontSize: 10.5,
                      fontWeight: 700,
                      color: "#d1d5db",
                      width: 44,
                      flexShrink: 0,
                      paddingTop: 1,
                    }}
                  >
                    TO
                  </span>
                  <span
                    style={{
                      fontSize: 12.5,
                      color: allTo.length ? "#0f172a" : "#d1d5db",
                    }}
                  >
                    {allTo.length
                      ? allTo.length > 2
                        ? `${allTo[0]}, ${allTo[1]} +${allTo.length - 2} more`
                        : allTo.join(", ")
                      : "recipient@company.com"}
                  </span>
                </div>
                <div style={{ borderTop: "1px solid #f8fafc" }} />
                <div style={{ display: "flex", gap: 8 }}>
                  <span
                    style={{
                      fontSize: 10.5,
                      fontWeight: 700,
                      color: "#d1d5db",
                      width: 44,
                      flexShrink: 0,
                      paddingTop: 1,
                    }}
                  >
                    SUBJ
                  </span>
                  <span
                    style={{
                      fontSize: 12.5,
                      color: subject ? "#0f172a" : "#d1d5db",
                      fontWeight: subject ? 600 : 400,
                    }}
                  >
                    {subject || "Your subject line"}
                  </span>
                </div>
                <div style={{ borderTop: "1px solid #f8fafc" }} />
                <p
                  style={{
                    fontSize: 12,
                    color: body ? "#64748b" : "#d1d5db",
                    lineHeight: 1.65,
                    whiteSpace: "pre-line",
                    margin: 0,
                  }}
                >
                  {body
                    ? body.length > 180
                      ? body.slice(0, 180) + "…"
                      : body
                    : "Your message will appear here…"}
                </p>
              </div>
            </div>
            <div
              style={{
                background: "linear-gradient(135deg,#6366f1,#818cf8)",
                borderRadius: 16,
                padding: "18px 20px",
                color: "#fff",
              }}
            >
              <h3
                style={{
                  fontSize: 11.5,
                  fontWeight: 700,
                  letterSpacing: "0.05em",
                  marginBottom: 11,
                  opacity: 0.8,
                  textTransform: "uppercase",
                }}
              >
                Outreach Tips
              </h3>
              {[
                "Personalise the opening line",
                "Keep it under 150 words",
                "One clear call-to-action",
                "Follow up after 7 days",
              ].map((tip, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 8,
                    marginBottom: 8,
                  }}
                >
                  <div
                    style={{
                      width: 17,
                      height: 17,
                      borderRadius: "50%",
                      background: "rgba(255,255,255,0.2)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                      marginTop: 1,
                    }}
                  >
                    <span style={{ fontSize: 9, fontWeight: 700 }}>
                      {i + 1}
                    </span>
                  </div>
                  <p
                    style={{
                      fontSize: 12.5,
                      margin: 0,
                      opacity: 0.9,
                      lineHeight: 1.5,
                    }}
                  >
                    {tip}
                  </p>
                </div>
              ))}
            </div>
            <div
              style={{
                background: "#fff",
                borderRadius: 16,
                border: "1px solid #f1f5f9",
                padding: "16px 20px",
                boxShadow: "0 1px 6px rgba(0,0,0,0.04)",
              }}
            >
              <h3
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: "#94a3b8",
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginBottom: 11,
                }}
              >
                Quick Stats
              </h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 9,
                }}
              >
                {[
                  { label: "Sent", value: sentList.length, c: "#6366f1" },
                  {
                    label: "Opened",
                    value: sentList.filter((m) => m.opens > 0).length,
                    c: "#0ea5e9",
                  },
                  {
                    label: "Replied",
                    value: sentList.filter((m) => m.status === "Replied")
                      .length,
                    c: "#10b981",
                  },
                  {
                    label: "Bounced",
                    value: sentList.filter((m) => m.status === "Bounced")
                      .length,
                    c: "#ef4444",
                  },
                ].map((s, i) => (
                  <div
                    key={i}
                    style={{
                      background: "#fafafa",
                      borderRadius: 9,
                      padding: "9px 11px",
                      border: "1px solid #f1f5f9",
                    }}
                  >
                    <p
                      style={{
                        fontSize: 10,
                        color: "#94a3b8",
                        fontWeight: 600,
                        textTransform: "uppercase",
                        letterSpacing: "0.04em",
                        margin: "0 0 3px",
                      }}
                    >
                      {s.label}
                    </p>
                    <span
                      className="mono"
                      style={{ fontSize: 20, fontWeight: 700, color: s.c }}
                    >
                      {s.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── SENT TAB ── */}
      {tab === "sent" && (
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
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "16px 20px",
              borderBottom: "1px solid #f1f5f9",
            }}
          >
            <div>
              <h2
                style={{
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#0f172a",
                  margin: 0,
                }}
              >
                Sent Emails
              </h2>
              <p
                style={{ fontSize: 11.5, color: "#94a3b8", margin: "2px 0 0" }}
              >
                {filtered.length} emails
              </p>
            </div>
            <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
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
                    width: 150,
                    fontFamily: "DM Sans,sans-serif",
                  }}
                />
              </div>
              <div
                style={{
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <FiFilter
                  size={12}
                  color="#94a3b8"
                  style={{
                    position: "absolute",
                    left: 9,
                    pointerEvents: "none",
                  }}
                />
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  style={{
                    border: "1px solid #e2e8f0",
                    borderRadius: 9,
                    padding: "6px 12px 6px 27px",
                    fontSize: 12.5,
                    color: "#374151",
                    background: "#fafafa",
                    outline: "none",
                    cursor: "pointer",
                    fontFamily: "DM Sans,sans-serif",
                  }}
                >
                  {statuses.map((s) => (
                    <option key={s}>{s}</option>
                  ))}
                </select>
              </div>
              <button
                className="btn-primary"
                onClick={() => setTab("compose")}
                style={{ padding: "6px 14px" }}
              >
                <FiPlus size={13} /> Compose
              </button>
            </div>
          </div>
          <table
            style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}
          >
            <thead>
              <tr
                style={{
                  background: "#fafafa",
                  borderBottom: "1px solid #f1f5f9",
                }}
              >
                {[
                  "Recipient",
                  "Subject",
                  "Sent",
                  "Status",
                  "Opens",
                  "Replies",
                  "",
                ].map((h) => (
                  <th
                    key={h}
                    style={{
                      textAlign: "left",
                      padding: "9px 16px",
                      fontSize: 10.5,
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
              {filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    style={{
                      padding: "40px",
                      textAlign: "center",
                      color: "#d1d5db",
                      fontSize: 13,
                    }}
                  >
                    No sent emails found
                  </td>
                </tr>
              ) : (
                filtered.map((row, i) => {
                  const sc = sentStatusConfig[row.status] || {
                    bg: "#f1f5f9",
                    color: "#374151",
                    icon: null,
                  };
                  const hue = (row.to.charCodeAt(0) * 17) % 360;
                  return (
                    <tr
                      key={i}
                      className="row-hover"
                      style={{
                        borderBottom: "1px solid #f8fafc",
                        cursor: "pointer",
                        transition: "background 0.15s",
                      }}
                      onClick={() => setViewEmail(row)}
                    >
                      <td style={{ padding: "12px 16px" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 9,
                          }}
                        >
                          <div
                            style={{
                              width: 30,
                              height: 30,
                              borderRadius: "50%",
                              background: `hsl(${hue},55%,88%)`,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              fontSize: 12,
                              fontWeight: 700,
                              color: `hsl(${hue},45%,35%)`,
                              flexShrink: 0,
                            }}
                          >
                            {row.to[0]}
                          </div>
                          <div>
                            <p
                              style={{
                                fontWeight: 600,
                                color: "#0f172a",
                                margin: 0,
                                fontSize: 13,
                              }}
                            >
                              {row.to}
                            </p>
                            <p
                              style={{
                                color: "#94a3b8",
                                fontSize: 11,
                                margin: 0,
                              }}
                            >
                              {row.email}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: "12px 16px", maxWidth: 210 }}>
                        <p
                          style={{
                            color: "#374151",
                            fontWeight: 500,
                            margin: 0,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            maxWidth: 190,
                          }}
                        >
                          {row.subject}
                        </p>
                        <p
                          style={{
                            color: "#94a3b8",
                            fontSize: 11.5,
                            margin: "2px 0 0",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                            maxWidth: 190,
                          }}
                        >
                          {row.body}
                        </p>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <span
                          className="mono"
                          style={{ fontSize: 11, color: "#94a3b8" }}
                        >
                          {row.date}
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <span
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 4,
                            background: sc.bg,
                            color: sc.color,
                            padding: "3px 9px",
                            borderRadius: 20,
                            fontSize: 11,
                            fontWeight: 600,
                          }}
                        >
                          {sc.icon} {row.status}
                        </span>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                            color: row.opens > 0 ? "#0ea5e9" : "#d1d5db",
                          }}
                        >
                          <FiEye size={12} />
                          <span className="mono" style={{ fontSize: 12 }}>
                            {row.opens}
                          </span>
                        </div>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 4,
                            color: row.replies > 0 ? "#10b981" : "#d1d5db",
                          }}
                        >
                          <FiCornerUpRight size={12} />
                          <span className="mono" style={{ fontSize: 12 }}>
                            {row.replies}
                          </span>
                        </div>
                      </td>
                      <td
                        style={{ padding: "12px 16px" }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div style={{ display: "flex", gap: 5 }}>
                          <button
                            onClick={() => setViewEmail(row)}
                            style={{
                              background: "none",
                              border: "1px solid #e2e8f0",
                              borderRadius: 7,
                              padding: "5px 7px",
                              cursor: "pointer",
                              color: "#64748b",
                              display: "flex",
                              lineHeight: 0,
                              transition: "all 0.15s",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = "#eef2ff";
                              e.currentTarget.style.color = "#6366f1";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = "none";
                              e.currentTarget.style.color = "#64748b";
                            }}
                          >
                            <FiEye size={12} />
                          </button>
                          <button
                            onClick={() =>
                              setSentList((sl) =>
                                sl.filter((m) => m.id !== row.id),
                              )
                            }
                            style={{
                              background: "none",
                              border: "1px solid #e2e8f0",
                              borderRadius: 7,
                              padding: "5px 7px",
                              cursor: "pointer",
                              color: "#64748b",
                              display: "flex",
                              lineHeight: 0,
                              transition: "all 0.15s",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.background = "#fee2e2";
                              e.currentTarget.style.color = "#ef4444";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.background = "none";
                              e.currentTarget.style.color = "#64748b";
                            }}
                          >
                            <FiTrash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* View modal */}
      {viewEmail && (
        <div className="modal-backdrop" onClick={() => setViewEmail(null)}>
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: "#fff",
              borderRadius: 18,
              width: 540,
              overflow: "hidden",
              boxShadow: "0 25px 60px rgba(0,0,0,0.18)",
            }}
          >
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
                    background: `hsl(${(viewEmail.to.charCodeAt(0) * 17) % 360},55%,88%)`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 13,
                    fontWeight: 700,
                    color: `hsl(${(viewEmail.to.charCodeAt(0) * 17) % 360},45%,35%)`,
                  }}
                >
                  {viewEmail.to[0]}
                </div>
                <div>
                  <p
                    style={{
                      fontSize: 13.5,
                      fontWeight: 700,
                      color: "#0f172a",
                      margin: 0,
                    }}
                  >
                    {viewEmail.to}
                  </p>
                  <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>
                    {viewEmail.email}
                  </p>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {(() => {
                  const sc = sentStatusConfig[viewEmail.status] || {
                    bg: "#f1f5f9",
                    color: "#374151",
                    icon: null,
                  };
                  return (
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 4,
                        background: sc.bg,
                        color: sc.color,
                        padding: "3px 10px",
                        borderRadius: 20,
                        fontSize: 11,
                        fontWeight: 600,
                      }}
                    >
                      {sc.icon} {viewEmail.status}
                    </span>
                  );
                })()}
                <button
                  onClick={() => setViewEmail(null)}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "#94a3b8",
                    display: "flex",
                    padding: 4,
                    borderRadius: 8,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "#f1f5f9";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "none";
                  }}
                >
                  <FiX size={16} />
                </button>
              </div>
            </div>
            <div
              style={{
                padding: "20px 22px",
                display: "flex",
                flexDirection: "column",
                gap: 13,
              }}
            >
              <div>
                <p
                  style={{
                    fontSize: 10.5,
                    fontWeight: 700,
                    color: "#94a3b8",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    marginBottom: 4,
                  }}
                >
                  Subject
                </p>
                <p
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: "#0f172a",
                    margin: 0,
                  }}
                >
                  {viewEmail.subject}
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
                    letterSpacing: "0.05em",
                    marginBottom: 4,
                  }}
                >
                  Message
                </p>
                <p
                  style={{
                    fontSize: 13.5,
                    color: "#374151",
                    lineHeight: 1.7,
                    margin: 0,
                    whiteSpace: "pre-line",
                  }}
                >
                  {viewEmail.body}
                </p>
              </div>
              <div style={{ borderTop: "1px solid #f1f5f9" }} />
              <div style={{ display: "flex", gap: 20 }}>
                {[
                  { label: "Sent", value: viewEmail.date },
                  { label: "Opens", value: viewEmail.opens },
                  { label: "Replies", value: viewEmail.replies },
                ].map((m, i) => (
                  <div key={i}>
                    <p
                      style={{
                        fontSize: 10.5,
                        fontWeight: 700,
                        color: "#94a3b8",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        margin: "0 0 3px",
                      }}
                    >
                      {m.label}
                    </p>
                    <p
                      className="mono"
                      style={{
                        fontSize: 13,
                        color: "#374151",
                        fontWeight: 600,
                        margin: 0,
                      }}
                    >
                      {m.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 8,
                padding: "14px 22px",
                borderTop: "1px solid #f1f5f9",
                background: "#fafafa",
              }}
            >
              <button
                className="btn-secondary"
                onClick={() => setViewEmail(null)}
              >
                Close
              </button>
              <button
                className="btn-primary"
                onClick={() => {
                  setRecipients([viewEmail.email]);
                  setRecipientInput("");
                  setSubject("Re: " + viewEmail.subject);
                  setBody("");
                  setViewEmail(null);
                  setTab("compose");
                }}
              >
                <FiCornerUpRight size={13} /> Reply
              </button>
            </div>
          </div>
        </div>
      )}
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );
};

export default SendEmails;
