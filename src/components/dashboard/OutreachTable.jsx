import { useNavigate } from "react-router-dom";
import { statusConfig, tagConfig } from "../../utils/statusConfig";

const OutreachTable = ({ recentOutreachPreview, setViewMail }) => {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-[14px] border border-slate-100 shadow-sm flex flex-col overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-[18px] py-[14px] border-b border-slate-100 shrink-0">
        <h2 className="text-[13px] font-bold text-slate-900">
          Recent Outreach
        </h2>

        <button
          onClick={() => navigate("/sent-mails")}
          className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-700"
        >
          View all →
        </button>
      </div>

      {/* Table container */}
      <div className="flex-1 overflow-y-auto min-h-0">
        <table className="w-full border-collapse text-[12.5px]">
          {/* Header */}
          <thead className="sticky top-0 z-[1]">
            <tr className="bg-[#fafafa] border-b border-slate-100">
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
                  className="text-left px-[14px] py-[8px] text-[10px] font-bold text-slate-400 uppercase tracking-[0.05em]"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {recentOutreachPreview.map((row, i) => {
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
                  className="border-b border-slate-50 cursor-pointer hover:bg-slate-50 transition"
                >
                  {/* Recipient */}
                  <td className="px-[14px] py-[10px]">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-[28px] h-[28px] rounded-full flex items-center justify-center text-[11px] font-bold shrink-0"
                        style={{
                          background: `hsl(${hue},55%,88%)`,
                          color: `hsl(${hue},45%,35%)`,
                        }}
                      >
                        {row.name[0]}
                      </div>

                      <div>
                        <p className="text-[12px] font-semibold text-slate-900">
                          {row.name}
                        </p>
                        <p className="text-[10.5px] text-slate-400">
                          {row.email}
                        </p>
                      </div>
                    </div>
                  </td>

                  {/* Message preview */}
                  <td className="px-[14px] py-[10px] max-w-[200px]">
                    <p className="text-slate-500 truncate max-w-[180px]">
                      {row.message}
                    </p>
                  </td>

                  {/* Date */}
                  <td className="px-[14px] py-[10px]">
                    <span className="font-mono text-[11px] text-slate-400">
                      {row.date}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-[14px] py-[10px]">
                    <span
                      className="text-[10.5px] font-semibold px-[8px] py-[3px] rounded-full"
                      style={{
                        background: sc.bg,
                        color: sc.color,
                      }}
                    >
                      {row.status}
                    </span>
                  </td>

                  {/* Company */}
                  <td className="px-[14px] py-[10px]">
                    <span className="text-[12px] text-gray-700 font-medium">
                      {row.org}
                    </span>
                  </td>

                  {/* Campaign */}
                  <td className="px-[14px] py-[10px]">
                    <span
                      className="text-[10.5px] font-semibold px-[8px] py-[3px] rounded-full"
                      style={{
                        background: tc.bg,
                        color: tc.color,
                      }}
                    >
                      {row.tag}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OutreachTable;
