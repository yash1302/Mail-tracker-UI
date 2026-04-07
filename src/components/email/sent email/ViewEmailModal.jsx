import { FiX, FiCornerUpRight } from "react-icons/fi";
import Modal from "../../common/Modal.jsx";

const ViewEmailModal = ({
  viewEmail,
  setViewEmail,
  sentStatusConfig,
  setRecipients,
  setRecipientInput,
  setSubject,
  setBody,
  setTab,
}) => {
  if (!viewEmail) return null;

  const hue = (viewEmail.to.charCodeAt(0) * 17) % 360;

  const sc = sentStatusConfig[viewEmail.status] || {
    bg: "#f1f5f9",
    color: "#374151",
    icon: null,
  };

  return (
    <Modal onClose={() => setViewEmail(null)}>
      {/* Header */}
      <div className="flex items-center justify-between px-[22px] py-[18px] border-b border-slate-100">
        <div className="flex items-center gap-[10px]">
          <div
            className="w-[34px] h-[34px] rounded-full flex items-center justify-center text-[13px] font-bold"
            style={{
              background: `hsl(${hue},55%,88%)`,
              color: `hsl(${hue},45%,35%)`,
            }}
          >
            {viewEmail.to[0]}
          </div>

          <div>
            <p className="text-[13.5px] font-bold text-slate-900">
              {viewEmail.to}
            </p>

            <p className="text-[11px] text-slate-400">{viewEmail.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-[8px]">
          <span
            className="inline-flex items-center gap-[4px] px-[10px] py-[3px] rounded-full text-[11px] font-semibold"
            style={{ background: sc.bg, color: sc.color }}
          >
            {sc.icon} {viewEmail.status}
          </span>

          <button
            onClick={() => setViewEmail(null)}
            className="p-[4px] rounded-[8px] text-slate-400 hover:bg-slate-100 transition"
          >
            <FiX size={16} />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="px-[22px] py-[20px] flex flex-col gap-[13px]">
        <div>
          <p className="text-[10.5px] font-bold text-slate-400 uppercase tracking-[0.05em] mb-[4px]">
            Subject
          </p>

          <p className="text-[15px] font-bold text-slate-900">
            {viewEmail.subject}
          </p>
        </div>

        <div className="border-t border-slate-100" />

        <div>
          <p className="text-[10.5px] font-bold text-slate-400 uppercase tracking-[0.05em] mb-[4px]">
            Message
          </p>

          <p className="text-[13.5px] text-slate-700 leading-[1.7] whitespace-pre-line">
            {viewEmail.body}
          </p>
        </div>

        <div className="border-t border-slate-100" />

        <div className="flex gap-[20px]">
          {[
            { label: "Sent", value: viewEmail.date },
            { label: "Opens", value: viewEmail.opens },
            { label: "Replies", value: viewEmail.replies },
          ].map((m, i) => (
            <div key={i}>
              <p className="text-[10.5px] font-bold text-slate-400 uppercase tracking-[0.05em] mb-[3px]">
                {m.label}
              </p>

              <p className="text-[13px] font-mono font-semibold text-slate-700">
                {m.value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-end gap-[8px] px-[22px] py-[14px] border-t border-slate-100 bg-slate-50">
        <button
          onClick={() => setViewEmail(null)}
          className="inline-flex items-center gap-[7px] px-[16px] py-[8px] rounded-[10px] text-[13px] font-medium border border-gray-200 bg-white text-gray-700 transition hover:bg-gray-50"
        >
          Close
        </button>

        <button
          className="inline-flex items-center gap-[7px] px-[16px] py-[8px] rounded-[10px] text-[13px] font-semibold bg-indigo-500 text-white transition hover:bg-indigo-600 hover:-translate-y-[1px] hover:shadow-[0_4px_12px_rgba(99,102,241,0.35)]"
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
    </Modal>
  );
};

export default ViewEmailModal;
