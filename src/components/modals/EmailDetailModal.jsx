import { FiX } from "react-icons/fi";

const statusColors = {
  Replied: "bg-green-100 text-green-700",
  Sent: "bg-indigo-100 text-indigo-700",
  Opened: "bg-amber-100 text-amber-700",
  Bounced: "bg-red-100 text-red-700",
};

const EmailDetailModal = ({ viewMail, setViewMail }) => {
  if (!viewMail) return null;

  const hue = (viewMail.name.charCodeAt(0) * 17) % 360;

  return (
    <div
      onClick={() => setViewMail(null)}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-[580px] bg-white rounded-[20px] overflow-hidden shadow-[0_32px_80px_rgba(15,23,42,0.18)] border border-slate-100 animate-[modalIn_0.22s_cubic-bezier(0.34,1.56,0.64,1)]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-[22px] py-[16px] bg-gradient-to-r from-indigo-500 to-indigo-400">
          <div>
            <h3 className="text-[15px] font-extrabold text-white">
              Email Details
            </h3>
            <p className="text-[12px] text-white/70">Sent outreach record</p>
          </div>

          <button
            onClick={() => setViewMail(null)}
            className="flex items-center justify-center w-[30px] h-[30px] rounded-md bg-white/20 border border-white/30 text-white hover:bg-white/30"
          >
            <FiX size={14} />
          </button>
        </div>

        {/* User Section */}
        <div className="flex items-center gap-[13px] px-[22px] py-[16px] border-b border-slate-100 bg-slate-50">
          <div
            className="w-[42px] h-[42px] rounded-full flex items-center justify-center text-[15px] font-extrabold border"
            style={{
              background: `hsl(${hue},55%,88%)`,
              color: `hsl(${hue},45%,35%)`,
              borderColor: `hsl(${hue},40%,78%)`,
            }}
          >
            {viewMail.name[0]}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-[14px] font-bold text-slate-900">
              {viewMail.name}
            </p>
            <p className="text-[12px] text-slate-400">{viewMail.email}</p>
          </div>

          <span
            className={`px-[11px] py-[4px] rounded-full text-[11.5px] font-bold ${
              statusColors[viewMail.status] || "bg-slate-100 text-slate-700"
            }`}
          >
            {viewMail.status}
          </span>
        </div>

        {/* Content */}
        <div className="px-[22px] py-[18px] flex flex-col gap-[16px]">
          {/* Subject */}
          <div>
            <p className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400 mb-[6px]">
              Subject
            </p>

            <p className="text-[13.5px] font-semibold text-slate-900">
              {viewMail.subject}
            </p>
          </div>

          <div className="border-t border-slate-100"></div>

          {/* Message */}
          <div>
            <p className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400 mb-[8px]">
              Message
            </p>

            <div className="bg-slate-50 border border-slate-100 rounded-[12px] px-[16px] py-[14px] max-h-[130px] overflow-y-auto">
              <p className="text-[13.5px] text-slate-700 leading-[1.75] whitespace-pre-line">
                {viewMail.message}
              </p>
            </div>
          </div>

          <div className="border-t border-slate-100"></div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-[10px]">
            <div className="bg-slate-50 border border-slate-100 rounded-[12px] px-[14px] py-[12px]">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-[4px]">
                Sent
              </p>
              <p className="text-[12px] font-semibold text-slate-900">
                {viewMail.date}
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-[12px] px-[14px] py-[12px]">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-[4px]">
                Company
              </p>
              <p className="text-[12px] font-semibold text-slate-900">
                {viewMail.org ?? "—"}
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-[12px] px-[14px] py-[12px]">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-[4px]">
                Opens
              </p>
              <p className="text-[15px] font-bold text-slate-900 font-mono">
                {viewMail.opens ?? 0}
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-100 rounded-[12px] px-[14px] py-[12px]">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-[4px]">
                Replies
              </p>
              <p className="text-[15px] font-bold text-slate-900 font-mono">
                {viewMail.replies ?? 0}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-[22px] py-[14px] border-t border-slate-100 flex items-center justify-between bg-slate-50">
          <p className="text-[11.5px] text-slate-300 font-medium">
            Campaign:{" "}
            <span className="text-slate-400 font-semibold">
              {viewMail.tag ?? "—"}
            </span>
          </p>

          <div className="flex gap-[8px]">
            <button
              onClick={() => setViewMail(null)}
              className="px-[16px] py-[8px] rounded-[10px] text-[13px] font-semibold border border-slate-200 text-slate-500 hover:bg-slate-50"
            >
              Close
            </button>

            <button className="px-[16px] py-[8px] rounded-[10px] text-[13px] font-bold bg-indigo-500 text-white hover:bg-indigo-600 shadow-md">
              Send Followup →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmailDetailModal;
