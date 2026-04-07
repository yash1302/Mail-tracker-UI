import { FiPaperclip } from "react-icons/fi";

const DraftTable = ({ drafts, openRow }) => {
  return (
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
  );
};

export default DraftTable;
