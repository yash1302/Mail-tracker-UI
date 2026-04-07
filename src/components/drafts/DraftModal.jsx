import { FiX, FiEdit, FiRefreshCw } from "react-icons/fi";
import AttachmentZone from "./AttachmentZone";
import AttachmentList from "./AttachmentList";

const DraftModal = ({
  modalMode,
  title,
  subject,
  body,
  attachments,
  setTitle,
  setSubject,
  setBody,
  setAttachments,
  close,
  save,
  setModalMode,
  isSaving = false, // ← added
}) => {
  const isView = modalMode === "view";
  const isEdit = modalMode === "edit";

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50"
      onClick={close}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-[18px] w-[540px] overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.18)]"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-[22px] py-[18px] border-b border-slate-100">
          <div className="flex items-center gap-[10px]">
            <h2 className="text-[15px] font-bold text-slate-900">
              {isView ? "View Draft" : isEdit ? "Edit Draft" : "Create Draft"}
            </h2>

            {isView && (
              <span className="text-[11px] bg-slate-100 text-slate-500 px-2 py-[2px] rounded-full font-semibold">
                Read only
              </span>
            )}
            {isEdit && (
              <span className="text-[11px] bg-indigo-50 text-indigo-500 px-2 py-[2px] rounded-full font-semibold">
                Editing
              </span>
            )}
            {isSaving && (
              <span className="flex items-center gap-[5px] text-[11px] bg-amber-50 text-amber-500 px-2 py-[2px] rounded-full font-semibold">
                <FiRefreshCw size={10} className="animate-spin" />
                Saving…
              </span>
            )}
          </div>

          <button
            onClick={close}
            disabled={isSaving}
            className="p-[4px] rounded-md text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <FiX size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="px-[22px] py-[20px] flex flex-col gap-[16px] max-h-[65vh] overflow-y-auto">
          {/* Title */}
          <div>
            <label className="text-[10.5px] font-bold text-slate-400 uppercase tracking-[0.05em] block mb-[7px]">
              Draft Title
            </label>
            {isView ? (
              <p className="text-[13px] font-semibold text-slate-900">
                {title || <span className="text-slate-300 font-normal">No title</span>}
              </p>
            ) : (
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. React Developer Outreach"
                disabled={isSaving}
                className="w-full border border-slate-200 rounded-[9px] px-[12px] py-[9px] text-[13px] text-slate-700 outline-none focus:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-50"
              />
            )}
          </div>

          {/* Subject */}
          <div>
            <label className="text-[10.5px] font-bold text-slate-400 uppercase tracking-[0.05em] block mb-[7px]">
              Subject
            </label>
            {isView ? (
              <p className="text-[14px] font-semibold text-slate-900">
                {subject || <span className="text-slate-300 font-normal">No subject</span>}
              </p>
            ) : (
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="e.g. Quick question about your product"
                disabled={isSaving}
                className="w-full border border-slate-200 rounded-[9px] px-[12px] py-[9px] text-[13px] text-slate-700 outline-none focus:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-50"
              />
            )}
          </div>

          <div className="border-t border-slate-100" />

          {/* Body */}
          <div>
            <label className="text-[10.5px] font-bold text-slate-400 uppercase tracking-[0.05em] block mb-[7px]">
              Email Body
            </label>
            {isView ? (
              <p className="text-[13px] text-slate-700 leading-[1.65] whitespace-pre-line">
                {body || <span className="text-slate-300">No content.</span>}
              </p>
            ) : (
              <>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  rows={5}
                  placeholder="Write your outreach email…"
                  disabled={isSaving}
                  className="w-full border border-slate-200 rounded-[9px] px-[12px] py-[9px] text-[13px] text-slate-700 outline-none resize-none leading-[1.6] focus:border-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-50"
                />
                <p className="text-right text-[11px] text-slate-300 mt-[4px]">
                  {body.length} characters
                </p>
              </>
            )}
          </div>

          <div className="border-t border-slate-100" />

          {/* Attachments */}
          <div>
            <label className="text-[10.5px] font-bold text-slate-400 uppercase tracking-[0.05em] block mb-[8px]">
              Attachments
            </label>
            {isView ? (
              <AttachmentList attachments={attachments} />
            ) : (
              <AttachmentZone
                attachments={attachments}
                onChange={setAttachments}
                disabled={isSaving} // ← pass to AttachmentZone if it supports it
              />
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-[22px] py-[14px] border-t border-slate-100 bg-slate-50">
          <span className="text-[11.5px] text-slate-400">
            {attachments.length > 0
              ? `${attachments.length} attachment${attachments.length > 1 ? "s" : ""}`
              : "No attachments"}
          </span>

          <div className="flex gap-[8px]">
            {isView ? (
              <>
                <button
                  onClick={close}
                  className="inline-flex items-center gap-[6px] px-[16px] py-[8px] text-[13px] font-medium border border-slate-200 rounded-[10px] text-slate-600 hover:bg-slate-50"
                >
                  Close
                </button>
                <button
                  onClick={() => setModalMode("edit")}
                  className="inline-flex items-center gap-[6px] px-[16px] py-[8px] text-[13px] font-semibold rounded-[10px] bg-indigo-500 text-white hover:bg-indigo-600 transition"
                >
                  <FiEdit size={13} />
                  Edit Draft
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={isEdit ? () => setModalMode("view") : close}
                  disabled={isSaving}
                  className="inline-flex items-center gap-[6px] px-[16px] py-[8px] text-[13px] font-medium border border-slate-200 rounded-[10px] text-slate-600 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>

                <button
                  onClick={save}
                  disabled={isSaving}
                  className="inline-flex items-center gap-[6px] px-[16px] py-[8px] text-[13px] font-semibold rounded-[10px] bg-indigo-500 text-white hover:bg-indigo-600 transition disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isSaving ? (
                    <>
                      <FiRefreshCw size={13} className="animate-spin" />
                      {isEdit ? "Saving…" : "Creating…"}
                    </>
                  ) : (
                    isEdit ? "Save Changes" : "Save Draft"
                  )}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DraftModal;