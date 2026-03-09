import { useState } from "react";
import {
  FiX,
  FiSend,
  FiEdit3,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";

const drafts = [
  {
    subject: "Quick follow up",
    body: `Hi {{name}},

Just following up on my previous email.

Wanted to check if you had a chance to review it.

Best,
`,
  },
  {
    subject: "Checking in",
    body: `Hi {{name}},

Hope you're doing well.

Just wanted to check if my previous message reached you.

Best,
`,
  },
  {
    subject: "Final follow up",
    body: `Hi {{name}},

Just sending a final follow-up regarding my earlier email.

Let me know if it's worth discussing.

Best,
`,
  },
];

const FollowupModal = ({ lead, onClose }) => {
  const [subject, setSubject] = useState(`Re: ${lead.subject}`);
  const [message, setMessage] = useState(`Hi ${lead.name},

Just following up on my previous email.

Wanted to check if you had a chance to review it.

Best,
`);

  const [showDraftPicker, setShowDraftPicker] = useState(false);

  const hue = (lead.name.charCodeAt(0) * 17) % 360;

  const loadDraft = (draft) => {
    setSubject(draft.subject);
    setMessage(draft.body.replace("{{name}}", lead.name));
    setShowDraftPicker(false);
  };

  const handleSend = () => {
    console.log({
      to: lead.email,
      subject,
      message,
    });

    onClose();
  };

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-[560px] bg-white rounded-xl overflow-hidden shadow-2xl"
      >
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm"
              style={{
                background: `hsl(${hue},55%,88%)`,
                color: `hsl(${hue},45%,35%)`,
              }}
            >
              {lead.name[0]}
            </div>

            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Follow-up to {lead.name}
              </h2>
              <p className="text-xs text-slate-400">{lead.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Draft Toggle */}
            <button
              onClick={() => setShowDraftPicker(!showDraftPicker)}
              className={`flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-md border transition
              ${
                showDraftPicker
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "bg-indigo-50 text-indigo-600 border-indigo-200"
              }`}
            >
              <FiEdit3 size={12} />
              Draft
              {showDraftPicker ? (
                <FiChevronUp size={12} />
              ) : (
                <FiChevronDown size={12} />
              )}
            </button>

            <button
              onClick={onClose}
              className="p-1 rounded-md text-slate-400 hover:bg-slate-100"
            >
              <FiX size={16} />
            </button>
          </div>
        </div>

        {/* DRAFT PICKER */}
        {showDraftPicker && (
          <div className="px-6 py-3 bg-indigo-50 border-b border-slate-200">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Load a draft template
            </p>

            {drafts.map((draft, i) => (
              <button
                key={i}
                onClick={() => loadDraft(draft)}
                className="flex gap-2 w-full text-left border border-slate-200 rounded-md p-2 mb-2 bg-white hover:border-indigo-500 hover:bg-indigo-50 transition"
              >
                <div className="w-6 h-6 rounded-md bg-indigo-100 text-indigo-600 flex items-center justify-center">
                  <FiEdit3 size={11} />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-900 truncate">
                    {draft.subject}
                  </p>
                  <p className="text-[11px] text-slate-400 truncate">
                    {draft.body.replace(/\n/g, " ").slice(0, 60)}...
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}

        {/* FORM */}
        <div className="px-6 py-5 flex flex-col gap-4">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Subject
            </label>

            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Message
            </label>

            <textarea
              rows={7}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm outline-none focus:border-indigo-500 resize-none leading-relaxed"
            />

            <p className="text-right text-xs text-slate-300 mt-1">
              {message.length} chars
            </p>
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-slate-200 bg-slate-50">
          <span className="text-xs text-slate-400">
            To: {lead.email}
          </span>

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-semibold rounded-md border border-slate-200 text-slate-500 hover:bg-slate-100"
            >
              Cancel
            </button>

            <button
              onClick={handleSend}
              disabled={!subject.trim() || !message.trim()}
              className="px-4 py-2 text-sm font-bold rounded-md bg-indigo-600 text-white flex items-center gap-1 hover:bg-indigo-700 disabled:opacity-40"
            >
              <FiSend size={13} />
              Send Follow-up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FollowupModal;