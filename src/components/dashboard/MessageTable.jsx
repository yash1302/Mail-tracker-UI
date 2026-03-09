import { useState } from "react";
import { allMessages, messages } from "../../data/dashboardData.jsx";
import { FiChevronLeft, FiChevronRight, FiFilter, FiSearch } from "react-icons/fi";
import { statusConfig, tagConfig } from "../../utils/statusConfig.jsx";

const MessageTable = () => {
  const [search, setSearch]           = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [orgFilter, setOrgFilter]     = useState("All");
  const [page, setPage]               = useState(0);
  const PER_PAGE = 3;

  const statuses = ["All", ...new Set(allMessages.map(m => m.status))];
  const orgs     = ["All", ...new Set(allMessages.map(m => m.org))];

  const filtered = allMessages.filter(m => {
    const q = search.toLowerCase();
    return (
      (statusFilter === "All" || m.status === statusFilter) &&
      (orgFilter    === "All" || m.org    === orgFilter)    &&
      (m.name.toLowerCase().includes(q) || m.email.toLowerCase().includes(q) || m.message.toLowerCase().includes(q))
    );
  });

  const paginated  = filtered.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);
  const totalPages = Math.ceil(filtered.length / PER_PAGE);

  return (
    <div className="fade-up card-3" style={{
      background: "#fff", borderRadius: 16, border: "1px solid #f1f5f9",
      overflow: "hidden", boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
    }}>
      {/* Header bar */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "18px 22px", borderBottom: "1px solid #f1f5f9",
      }}>
        <div>
          <h2 style={{ fontSize: 15, fontWeight: 600, color: "#111827", margin: 0 }}>Recent Messages</h2>
          <p style={{ fontSize: 12, color: "#9ca3af", margin: "2px 0 0" }}>{filtered.length} conversations</p>
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {/* Search */}
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            border: "1px solid #e5e7eb", borderRadius: 10,
            padding: "7px 12px", background: "#fafafa",
          }}>
            <FiSearch size={14} color="#9ca3af" />
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(0); }}
              placeholder="Search messages…"
              style={{
                border: "none", outline: "none", background: "transparent",
                fontSize: 13, color: "#374151", width: 180,
              }}
            />
          </div>

          {/* Status filter */}
          <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
            <FiFilter size={13} color="#9ca3af" style={{ position: "absolute", left: 10, pointerEvents: "none" }} />
            <select
              value={statusFilter}
              onChange={e => { setStatusFilter(e.target.value); setPage(0); }}
              style={{
                border: "1px solid #e5e7eb", borderRadius: 10,
                padding: "7px 12px 7px 28px",
                fontSize: 13, color: "#374151", background: "#fafafa",
                outline: "none", cursor: "pointer",
              }}
            >
              {statuses.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>

          {/* Org filter */}
          <select
            value={orgFilter}
            onChange={e => { setOrgFilter(e.target.value); setPage(0); }}
            style={{
              border: "1px solid #e5e7eb", borderRadius: 10,
              padding: "7px 12px", fontSize: 13, color: "#374151",
              background: "#fafafa", outline: "none", cursor: "pointer",
            }}
          >
            {orgs.map(o => <option key={o}>{o}</option>)}
          </select>
        </div>
      </div>

      {/* Table */}
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
        <thead>
          <tr style={{ background: "#fafafa", borderBottom: "1px solid #f1f5f9" }}>
            {["Lead", "Message", "Date", "Status", "Organization", "Tag"].map(h => (
              <th key={h} style={{
                textAlign: "left", padding: "10px 16px",
                fontSize: 11, fontWeight: 600, color: "#9ca3af",
                letterSpacing: "0.04em", textTransform: "uppercase",
              }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {paginated.length === 0 ? (
            <tr>
              <td colSpan={6} style={{ padding: "40px 16px", textAlign: "center", color: "#d1d5db", fontSize: 13 }}>
                No messages found
              </td>
            </tr>
          ) : paginated.map((row, i) => {
            const sc = statusConfig[row.status] || { bg: "#f1f5f9", color: "#374151" };
            const tc = tagConfig[row.tag]       || { bg: "#f1f5f9", color: "#374151" };
            const hue = (row.name.charCodeAt(0) * 17) % 360;
            return (
              <tr key={i} className="row-hover" style={{ borderBottom: "1px solid #f8fafc", cursor: "pointer", transition: "background 0.15s" }}>
                {/* Lead */}
                <td style={{ padding: "14px 16px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{
                      width: 34, height: 34, borderRadius: "50%",
                      background: `hsl(${hue},60%,88%)`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: 13, fontWeight: 600, color: `hsl(${hue},50%,35%)`, flexShrink: 0,
                    }}>
                      {row.name[0]}
                    </div>
                    <div>
                      <p style={{ fontWeight: 600, color: "#111827", margin: 0, fontSize: 13 }}>{row.name}</p>
                      <p style={{ color: "#9ca3af", fontSize: 11, margin: 0 }}>{row.email}</p>
                    </div>
                  </div>
                </td>
                {/* Message */}
                <td style={{ padding: "14px 16px", maxWidth: 240 }}>
                  <p style={{
                    color: "#6b7280", margin: 0, fontSize: 13,
                    overflow: "hidden", textOverflow: "ellipsis",
                    whiteSpace: "nowrap", maxWidth: 220,
                  }}>{row.message}</p>
                </td>
                {/* Date */}
                <td style={{ padding: "14px 16px" }}>
                  <span className="mono" style={{ fontSize: 12, color: "#9ca3af" }}>{row.date}</span>
                </td>
                {/* Status */}
                <td style={{ padding: "14px 16px" }}>
                  <span style={{
                    background: sc.bg, color: sc.color,
                    padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600,
                  }}>{row.status}</span>
                </td>
                {/* Org */}
                <td style={{ padding: "14px 16px" }}>
                  <span style={{ fontSize: 13, color: "#374151", fontWeight: 500 }}>{row.org}</span>
                </td>
                {/* Tag */}
                <td style={{ padding: "14px 16px" }}>
                  <span style={{
                    background: tc.bg, color: tc.color,
                    padding: "3px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600,
                  }}>{row.tag}</span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Pagination */}
      <div style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "14px 22px", borderTop: "1px solid #f1f5f9",
      }}>
        <span style={{ fontSize: 12, color: "#9ca3af" }}>
          Showing {Math.min(page * PER_PAGE + 1, filtered.length)}–{Math.min((page + 1) * PER_PAGE, filtered.length)} of {filtered.length}
        </span>
        <div style={{ display: "flex", gap: 6 }}>
          <button
            onClick={() => setPage(p => Math.max(0, p - 1))}
            disabled={page === 0}
            style={{
              display: "flex", alignItems: "center", gap: 4,
              padding: "6px 12px", borderRadius: 8, fontSize: 12, fontWeight: 500,
              border: "1px solid #e5e7eb",
              background: page === 0 ? "#fafafa" : "#fff",
              color: page === 0 ? "#d1d5db" : "#374151",
              cursor: page === 0 ? "default" : "pointer",
            }}
          >
            <FiChevronLeft size={14} /> Prev
          </button>

          {Array.from({ length: totalPages }).map((_, i) => (
            <button key={i} onClick={() => setPage(i)} style={{
              width: 32, height: 32, borderRadius: 8, fontSize: 12, fontWeight: 600,
              border: "1px solid", cursor: "pointer",
              borderColor: i === page ? "#6366f1" : "#e5e7eb",
              background:  i === page ? "#6366f1" : "#fff",
              color:       i === page ? "#fff"    : "#374151",
            }}>{i + 1}</button>
          ))}

          <button
            onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))}
            disabled={page >= totalPages - 1}
            style={{
              display: "flex", alignItems: "center", gap: 4,
              padding: "6px 12px", borderRadius: 8, fontSize: 12, fontWeight: 500,
              border: "1px solid #e5e7eb",
              background: page >= totalPages - 1 ? "#fafafa" : "#fff",
              color:      page >= totalPages - 1 ? "#d1d5db" : "#374151",
              cursor:     page >= totalPages - 1 ? "default" : "pointer",
            }}
          >
            Next <FiChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MessageTable;