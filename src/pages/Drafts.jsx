import { useState, useRef } from "react";
import { FiPaperclip, FiPlus, FiX, FiEdit,FiFile } from "react-icons/fi";

// ── Inline mock components (swap for your real imports) ──────────────────────
const formatBytes = (b) =>
  b < 1024
    ? `${b} B`
    : b < 1048576
      ? `${(b / 1024).toFixed(1)} KB`
      : `${(b / 1048576).toFixed(1)} MB`;
const isImg = (f) => f.type?.startsWith("image/");

const AttachmentZone = ({ attachments, onChange }) => {
  const ref = useRef(null);
  const [drag, setDrag] = useState(false);
  const add = (files) => {
    const nf = Array.from(files).filter(
      (f) => !attachments.find((a) => a.name === f.name && a.size === f.size),
    );
    onChange([...attachments, ...nf]);
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          add(e.dataTransfer.files);
        }}
        onClick={() => ref.current?.click()}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 6,
          border: `2px dashed ${drag ? "#6366f1" : "#e2e8f0"}`,
          borderRadius: 10,
          padding: "18px 12px",
          cursor: "pointer",
          background: drag ? "#eef2ff" : "#fafafa",
          transition: "all 0.15s",
          textAlign: "center",
        }}
      >
        <FiPaperclip size={18} color={drag ? "#6366f1" : "#94a3b8"} />
        <p style={{ fontSize: 12.5, color: "#64748b", margin: 0 }}>
          Drop files or{" "}
          <span style={{ color: "#6366f1", fontWeight: 600 }}>browse</span>
        </p>
        <p style={{ fontSize: 11, color: "#cbd5e1", margin: 0 }}>
          Any file type · up to 10MB
        </p>
        <input
          ref={ref}
          type="file"
          multiple
          style={{ display: "none" }}
          onChange={(e) => add(e.target.files)}
        />
      </div>
      {attachments.length > 0 && (
        <ul
          style={{
            listStyle: "none",
            display: "flex",
            flexDirection: "column",
            gap: 6,
          }}
        >
          {attachments.map((f, i) => (
            <li
              key={i}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 9,
                background: "#f8fafc",
                border: "1px solid #e2e8f0",
                borderRadius: 8,
                padding: "7px 10px",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.querySelector(".rm-btn").style.opacity = "1")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.querySelector(".rm-btn").style.opacity = "0")
              }
            >
              {isImg(f) ? (
                <img
                  src={URL.createObjectURL(f)}
                  alt={f.name}
                  style={{
                    width: 30,
                    height: 30,
                    objectFit: "cover",
                    borderRadius: 6,
                    border: "1px solid #e2e8f0",
                    flexShrink: 0,
                  }}
                />
              ) : (
                <div
                  style={{
                    width: 30,
                    height: 30,
                    borderRadius: 6,
                    background: "#eef2ff",
                    color: "#6366f1",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  <FiFile size={14} />
                </div>
              )}
              <div style={{ flex: 1, minWidth: 0 }}>
                <p
                  style={{
                    fontSize: 12.5,
                    fontWeight: 600,
                    color: "#0f172a",
                    margin: 0,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {f.name}
                </p>
                <p style={{ fontSize: 10.5, color: "#94a3b8", margin: 0 }}>
                  {formatBytes(f.size)}
                </p>
              </div>
              <button
                className="rm-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(attachments.filter((_, j) => j !== i));
                }}
                style={{
                  opacity: 0,
                  transition: "opacity 0.15s",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#94a3b8",
                  padding: 4,
                  borderRadius: 6,
                  display: "flex",
                  lineHeight: 0,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = "#ef4444")}
                onMouseLeave={(e) => (e.currentTarget.style.color = "#94a3b8")}
              >
                <FiX size={13} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const AttachmentList = ({ attachments }) =>
  !attachments?.length ? (
    <p style={{ fontSize: 13, color: "#cbd5e1", fontStyle: "italic" }}>
      No attachments
    </p>
  ) : (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
      {attachments.map((f, i) => (
        <span
          key={i}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 6,
            background: "#f8fafc",
            border: "1px solid #e2e8f0",
            borderRadius: 8,
            padding: "5px 10px",
            fontSize: 11.5,
            color: "#374151",
          }}
        >
          {isImg(f) ? <FiImage size={13} /> : <FiFile size={13} />}
          <span
            style={{
              maxWidth: 130,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {f.name}
          </span>
          <span style={{ color: "#cbd5e1" }}>· {formatBytes(f.size)}</span>
        </span>
      ))}
    </div>
  );

const Drafts = () => {
  const [drafts, setDrafts] = useState([
    {
      title: "Full Stack Developer Outreach",
      subject: "Partnership Opportunity",
      body: "Hi, I would like to connect with your team about a potential partnership.",
      attachments: [],
    },
    {
      title: "React Developer Opportunity",
      subject: "Quick question about your product",
      body: "We've been evaluating solutions in this space and yours stood out.",
      attachments: [],
    },
  ]);
  const [modal, setModal] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [editIdx, setEditIdx] = useState(null);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [title, setTitle] = useState("");

  const reset = () => {
    setTitle("");
    setSubject("");
    setBody("");
    setAttachments([]);
    setEditIdx(null);
    setModalMode("create");
  };
  const close = () => {
    setModal(false);
    reset();
  };
  const openRow = (row, i) => {
    setTitle(row.title || "");
    setSubject(row.subject);
    setBody(row.body);
    setAttachments(row.attachments || []);
    setEditIdx(i);
    setModalMode("view");
    setModal(true);
  };
  const save = () => {
    if (!subject.trim() && !body.trim()) return;

    const d = {
      title,
      subject,
      body,
      attachments,
    };

    if (modalMode === "edit" && editIdx !== null)
      setDrafts(drafts.map((x, i) => (i === editIdx ? d : x)));
    else setDrafts([...drafts, d]);

    close();
  };

  const isView = modalMode === "view";
  const isEdit = modalMode === "edit";

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      {/* Header */}
      <div
        className="fade-up d0"
        style={{ display: "flex", justifyContent: "flex-end" }}
      >
        <button
          className="btn-primary"
          onClick={() => {
            reset();
            setModal(true);
          }}
        >
          <FiPlus size={14} /> Create Draft
        </button>
      </div>

      {/* Table */}
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
              {["Title", "Subject", "Body Preview", "Attachments"].map((h) => (
                <th
                  key={h}
                  style={{
                    textAlign: "left",
                    padding: "10px 18px",
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
            {drafts.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  style={{
                    padding: "40px",
                    textAlign: "center",
                    color: "#d1d5db",
                    fontSize: 13,
                  }}
                >
                  No drafts yet. Create your first one.
                </td>
              </tr>
            ) : (
              drafts.map((row, i) => (
                <tr
                  key={i}
                  className="row-hover"
                  onClick={() => openRow(row, i)}
                  style={{
                    borderBottom: "1px solid #f8fafc",
                    cursor: "pointer",
                    transition: "background 0.15s",
                  }}
                >
                  <td style={{ padding: "14px 18px" }}>
                    <span
                      style={{
                        background: "#eef2ff",
                        color: "#6366f1",
                        padding: "3px 10px",
                        borderRadius: 20,
                        fontSize: 11,
                        fontWeight: 600,
                      }}
                    >
                      {row.title || "General"}
                    </span>
                  </td>
                  <td
                    style={{
                      padding: "14px 18px",
                      fontWeight: 600,
                      color: "#0f172a",
                    }}
                  >
                    {row.subject}
                  </td>
                  <td
                    style={{
                      padding: "14px 18px",
                      color: "#64748b",
                      maxWidth: 280,
                    }}
                  >
                    <span
                      style={{
                        display: "block",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        maxWidth: 260,
                      }}
                    >
                      {row.body}
                    </span>
                  </td>
                  <td style={{ padding: "14px 18px" }}>
                    {row.attachments?.length > 0 ? (
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 5,
                          background: "#eef2ff",
                          color: "#6366f1",
                          padding: "3px 9px",
                          borderRadius: 20,
                          fontSize: 11,
                          fontWeight: 600,
                        }}
                      >
                        <FiPaperclip size={11} /> {row.attachments.length} file
                        {row.attachments.length > 1 ? "s" : ""}
                      </span>
                    ) : (
                      <span style={{ color: "#e2e8f0", fontSize: 12 }}>—</span>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modal && (
        <div className="modal-backdrop" onClick={close}>
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
            {/* Modal header */}
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
                <h2
                  style={{
                    fontSize: 15,
                    fontWeight: 700,
                    color: "#0f172a",
                    margin: 0,
                  }}
                >
                  {isView
                    ? "View Draft"
                    : isEdit
                      ? "Edit Draft"
                      : "Create Draft"}
                </h2>
                {isView && (
                  <span
                    style={{
                      fontSize: 11,
                      background: "#f1f5f9",
                      color: "#64748b",
                      padding: "2px 8px",
                      borderRadius: 20,
                      fontWeight: 600,
                    }}
                  >
                    Read only
                  </span>
                )}
                {isEdit && (
                  <span
                    style={{
                      fontSize: 11,
                      background: "#eef2ff",
                      color: "#6366f1",
                      padding: "2px 8px",
                      borderRadius: 20,
                      fontWeight: 600,
                    }}
                  >
                    Editing
                  </span>
                )}
              </div>
              <button
                onClick={close}
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
                  e.currentTarget.style.color = "#374151";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = "none";
                  e.currentTarget.style.color = "#94a3b8";
                }}
              >
                <FiX size={16} />
              </button>
            </div>

            {/* Modal body */}
            <div
              style={{
                padding: "20px 22px",
                display: "flex",
                flexDirection: "column",
                gap: 16,
                maxHeight: "65vh",
                overflowY: "auto",
              }}
            >
              <div>
                <label
                  style={{
                    fontSize: 10.5,
                    fontWeight: 700,
                    color: "#94a3b8",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    display: "block",
                    marginBottom: 7,
                  }}
                >
                  Draft Title
                </label>

                {isView ? (
                  <p
                    style={{ fontSize: 13, fontWeight: 600, color: "#0f172a" }}
                  >
                    {title || (
                      <span style={{ color: "#cbd5e1", fontWeight: 400 }}>
                        No title
                      </span>
                    )}
                  </p>
                ) : (
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. React Developer Outreach"
                    style={{
                      border: "1px solid #e2e8f0",
                      borderRadius: 9,
                      padding: "9px 12px",
                      width: "100%",
                      fontSize: 13,
                      color: "#374151",
                      outline: "none",
                      fontFamily: "DM Sans,sans-serif",
                    }}
                  />
                )}
              </div>
              <div>
                <label
                  style={{
                    fontSize: 10.5,
                    fontWeight: 700,
                    color: "#94a3b8",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    display: "block",
                    marginBottom: 7,
                  }}
                >
                  Subject
                </label>
                {isView ? (
                  <p
                    style={{ fontSize: 14, fontWeight: 600, color: "#0f172a" }}
                  >
                    {subject || (
                      <span style={{ color: "#cbd5e1", fontWeight: 400 }}>
                        No subject
                      </span>
                    )}
                  </p>
                ) : (
                  <input
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    placeholder="e.g. Quick question about your product"
                    style={{
                      border: "1px solid #e2e8f0",
                      borderRadius: 9,
                      padding: "9px 12px",
                      width: "100%",
                      fontSize: 13,
                      color: "#374151",
                      outline: "none",
                      transition: "border 0.15s",
                      fontFamily: "DM Sans,sans-serif",
                    }}
                    onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
                    onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                  />
                )}
              </div>
              <div style={{ borderTop: "1px solid #f1f5f9" }} />
              <div>
                <label
                  style={{
                    fontSize: 10.5,
                    fontWeight: 700,
                    color: "#94a3b8",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    display: "block",
                    marginBottom: 7,
                  }}
                >
                  Email Body
                </label>
                {isView ? (
                  <p
                    style={{
                      fontSize: 13,
                      color: "#374151",
                      lineHeight: 1.65,
                      whiteSpace: "pre-line",
                    }}
                  >
                    {body || (
                      <span style={{ color: "#cbd5e1" }}>No content.</span>
                    )}
                  </p>
                ) : (
                  <>
                    <textarea
                      value={body}
                      onChange={(e) => setBody(e.target.value)}
                      rows={5}
                      placeholder="Write your outreach email…"
                      style={{
                        border: "1px solid #e2e8f0",
                        borderRadius: 9,
                        padding: "9px 12px",
                        width: "100%",
                        fontSize: 13,
                        color: "#374151",
                        outline: "none",
                        resize: "none",
                        lineHeight: 1.6,
                        fontFamily: "DM Sans,sans-serif",
                        transition: "border 0.15s",
                      }}
                      onFocus={(e) => (e.target.style.borderColor = "#6366f1")}
                      onBlur={(e) => (e.target.style.borderColor = "#e2e8f0")}
                    />
                    <p
                      style={{
                        textAlign: "right",
                        fontSize: 11,
                        color: "#cbd5e1",
                        marginTop: 4,
                      }}
                    >
                      {body.length} characters
                    </p>
                  </>
                )}
              </div>
              <div style={{ borderTop: "1px solid #f1f5f9" }} />
              <div>
                <label
                  style={{
                    fontSize: 10.5,
                    fontWeight: 700,
                    color: "#94a3b8",
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                    display: "block",
                    marginBottom: 8,
                  }}
                >
                  Attachments
                </label>
                {isView ? (
                  <AttachmentList attachments={attachments} />
                ) : (
                  <AttachmentZone
                    attachments={attachments}
                    onChange={setAttachments}
                  />
                )}
              </div>
            </div>

            {/* Modal footer */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 22px",
                borderTop: "1px solid #f1f5f9",
                background: "#fafafa",
              }}
            >
              <span style={{ fontSize: 11.5, color: "#94a3b8" }}>
                {attachments.length > 0
                  ? `${attachments.length} attachment${attachments.length > 1 ? "s" : ""}`
                  : "No attachments"}
              </span>
              <div style={{ display: "flex", gap: 8 }}>
                {isView ? (
                  <>
                    <button className="btn-secondary" onClick={close}>
                      Close
                    </button>
                    <button
                      className="btn-primary"
                      onClick={() => setModalMode("edit")}
                    >
                      <FiEdit size={13} />
                      Edit Draft
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className="btn-secondary"
                      onClick={isEdit ? () => setModalMode("view") : close}
                    >
                      Cancel
                    </button>
                    <button className="btn-primary" onClick={save}>
                      {isEdit ? "Save Changes" : "Save Draft"}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Drafts;
