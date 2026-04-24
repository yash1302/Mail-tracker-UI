import { FiClock } from "react-icons/fi";
import { statusConfig } from "../../utils/statusConfig.jsx";
// import { FiReply } from "react-icons/fi";

const SkeletonRow = () => (
  <tr className="border-b border-slate-50 animate-pulse">
    {/* Recipient */}
    <td className="px-[14px] py-[10px]">
      <div className="flex items-center gap-2">
        <div className="w-[28px] h-[28px] rounded-full bg-slate-200 shrink-0" />
        <div className="flex flex-col gap-[5px]">
          <div className="h-[10px] w-[90px] bg-slate-200 rounded" />
          <div className="h-[8px] w-[120px] bg-slate-100 rounded" />
        </div>
      </div>
    </td>
    {/* Preview */}
    <td className="px-[14px] py-[10px]">
      <div className="h-[10px] w-[160px] bg-slate-100 rounded" />
    </td>
    {/* Activity */}
    <td className="px-[14px] py-[10px]">
      <div className="flex gap-[6px]">
        <div className="h-[20px] w-[50px] bg-slate-200 rounded-full" />
        <div className="h-[20px] w-[50px] bg-slate-200 rounded-full" />
      </div>
    </td>
    {/* Date */}
    <td className="px-[14px] py-[10px]">
      <div className="h-[10px] w-[70px] bg-slate-100 rounded" />
    </td>
    {/* Status */}
    <td className="px-[14px] py-[10px]">
      <div className="h-[20px] w-[55px] bg-slate-200 rounded-full" />
    </td>
  </tr>
);

const OutreachTable = ({
  recentOutreachPreview,
  setViewMail,
  isLoading = false,
}) => {

  console.log("Rendering OutreachTable with data:", recentOutreachPreview);
  return (
    <div className="bg-white border-slate-100 shadow-sm flex flex-col h-full">
      <div className="flex-1 overflow-y-auto">
        <table className="w-full border-collapse text-[12.5px]">
          {/* Header */}
          <thead className="sticky top-0 z-[1]">
            <tr className="bg-[#fafafa] border-b border-slate-100">
              {[
                "Recipient",
                "Email Preview",
                "Activity",
                "Sent Date",
                "Status",
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

          <tbody>
            {/* Skeleton rows while loading */}
            {isLoading &&
              Array.from({ length: 6 }).map((_, i) => <SkeletonRow key={i} />)}

            {/* Empty state */}
            {!isLoading && recentOutreachPreview.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="py-16 text-center text-slate-300 text-[13px]"
                >
                  No emails found.
                </td>
              </tr>
            )}

            {/* Data rows */}
            {!isLoading &&
              recentOutreachPreview.map((row, i) => {
                const sc = statusConfig[row.status] || {
                  bg: "#f1f5f9",
                  color: "#374151",
                };
                const hue = ((row.name?.charCodeAt(0) || 65) * 17) % 360;
                const hasReplies = row.isReplied || row.replies > 0;
                const hasFollowUps = row.followUpCount > 0;

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
                        {row.preview}
                      </p>
                    </td>

                    {/* Activity Indicators */}
                    <td className="px-[14px] py-[10px]">
                      <div className="flex items-center gap-[6px]">
                        {/* Opens */}
                        <span className="text-[10px] font-semibold px-[7px] py-[3px] rounded-full bg-amber-100 text-amber-700">
                          📧 {row.clicksCount || 0}
                        </span>

                        {/* Replies badge */}
                        {hasReplies && (
                          <span className="text-[10px] font-semibold px-[7px] py-[3px] rounded-full bg-green-100 text-green-700 flex items-center gap-[3px]">
                            <FiClock size={9} />
                            {row.replies || 1}
                          </span>
                        )}

                        {/* Follow-ups badge */}
                        {hasFollowUps && (
                          <span className="text-[10px] font-semibold px-[7px] py-[3px] rounded-full bg-indigo-100 text-indigo-700">
                            +{row.followUpCount} FU
                          </span>
                        )}
                      </div>
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
                        style={{ background: sc.bg, color: sc.color }}
                      >
                        {row.status}
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
