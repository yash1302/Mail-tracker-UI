import {
  FiX,
  FiArrowLeft,
  FiSend,
  FiRefreshCw,
  FiCheck,
  FiAlignLeft,
  FiType,
  FiPaperclip,
  FiEdit3,
  FiChevronDown,
  FiChevronUp,
  FiFile,
  FiTrash2,
} from "react-icons/fi";
import { BsPaperclip } from "react-icons/bs";
import { downloadAttachment, sendEmail } from "../../utils/api.utils.js";
import { useContext, useRef, useState } from "react";
import { userContext } from "../../context/userContext.js";
import { convertToHtml } from "../../utils/fileUtils.js";
import { toast } from "react-toastify";
import DraftPicker from "../email/compose email/DraftPicker.jsx";

const statusColors = {
  Replied: "bg-green-100 text-green-700",
  Sent: "bg-indigo-100 text-indigo-700",
  Opened: "bg-amber-100 text-amber-700",
  Bounced: "bg-red-100 text-red-700",
};

const ALLOWED_EXTENSIONS = [
  "pdf",
  "doc",
  "docx",
  "xls",
  "xlsx",
  "ppt",
  "pptx",
  "txt",
  "csv",
  "zip",
  "jpg",
  "jpeg",
  "png",
  "gif",
];
const MAX_FILE_SIZE = 25 * 1024 * 1024;

const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

const getFileExtension = (filename) => filename.split(".").pop().toLowerCase();

const getFileIconColor = (filename) => {
  const ext = getFileExtension(filename);
  const map = {
    pdf: "text-red-500",
    doc: "text-blue-500",
    docx: "text-blue-500",
    xls: "text-green-500",
    xlsx: "text-green-500",
    ppt: "text-orange-500",
    pptx: "text-orange-500",
    txt: "text-gray-500",
    csv: "text-green-600",
    zip: "text-purple-500",
    jpg: "text-indigo-500",
    jpeg: "text-indigo-500",
    png: "text-indigo-500",
    gif: "text-indigo-500",
  };
  return map[ext] || "text-gray-400";
};

const EmailDetailModal = ({ viewMail, setViewMail, handleGetSentEmails }) => {
  const [mode, setMode] = useState("detail");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [attachmentError, setAttachmentError] = useState("");
  const [sending, setSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [showDraftPicker, setShowDraftPicker] = useState(false);
  const [draftId, setDraftId] = useState(null);
  const fileRef = useRef(null);
  const { accounts } = useContext(userContext);

  if (!viewMail) return null;
  const hue = (viewMail.name.charCodeAt(0) * 17) % 360;

  const addDraftFiles = (files) => {
    const nf = files.map((f) => ({
      type: "stored",
      id: f._id,
      name: f.filename,
      size: f.size,
      mimeType: f.mimeType,
    }));
    setAttachments((p) => [...p, ...nf]);
  };

  const validateAndAddFiles = (files) => {
    setAttachmentError("");
    const errors = [];
    const validFiles = [];

    Array.from(files).forEach((file) => {
      if (file.size > MAX_FILE_SIZE) {
        errors.push(`${file.name} exceeds 25MB limit`);
        return;
      }
      if (!ALLOWED_EXTENSIONS.includes(getFileExtension(file.name))) {
        errors.push(`${file.name} type not allowed`);
        return;
      }
      if (attachments.some((a) => a.name === file.name)) {
        errors.push(`${file.name} already attached`);
        return;
      }
      validFiles.push(file);
    });

    if (errors.length) setAttachmentError(errors[0]);
    if (validFiles.length) setAttachments((a) => [...a, ...validFiles]);
  };

  const handleSend = async () => {
    if (!subject.trim() || !message.trim()) return;
    setSending(true);
    try {
      const formData = new FormData();
      formData.append("gmailAccountId", accounts?.[0]?.gmailAccountId);
      formData.append("userId", accounts?.[0]?.id);
      formData.append("subject", subject);
      formData.append("body", convertToHtml(message));
      formData.append("to", JSON.stringify([viewMail.email]));
      formData.append("cc", JSON.stringify([]));
      formData.append("bcc", JSON.stringify([]));

      if (draftId) formData.append("draftId", draftId); // ← draft id

      // stored draft attachment ids
      const attachmentIds = attachments
        .filter((a) => a.type === "stored" && a.id)
        .map((a) => a.id);
      formData.append("attachmentIds", JSON.stringify(attachmentIds)); // ← was always []

      // new local files only
      const newFiles = attachments.filter((a) => a instanceof File);
      newFiles.forEach((file) => formData.append("files", file));

      await sendEmail(formData);
      if (handleGetSentEmails) await handleGetSentEmails();
      setSentSuccess(true);
      setTimeout(() => setViewMail(null), 1500);
    } catch (_error) {
      console.error(_error);
      toast.error("Failed to send follow-up.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      onClick={() => setViewMail(null)}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-[580px] bg-white rounded-[20px] overflow-hidden shadow-[0_32px_80px_rgba(15,23,42,0.18)] border border-slate-100 animate-[modalIn_0.22s_cubic-bezier(0.34,1.56,0.64,1)]"
      >
        {/* ── HEADER ── */}
        <div className="flex items-center justify-between px-[22px] py-[16px] bg-gradient-to-r from-indigo-500 to-indigo-400">
          <div className="flex items-center gap-3">
            {mode === "compose" && (
              <button
                onClick={() => setMode("detail")}
                className="flex items-center justify-center w-[28px] h-[28px] rounded-md bg-white/20 border border-white/30 text-white hover:bg-white/30"
              >
                <FiArrowLeft size={14} />
              </button>
            )}
            <div>
              <h3 className="text-[15px] font-extrabold text-white">
                {mode === "detail"
                  ? "Email Details"
                  : `Follow-up to ${viewMail.name}`}
              </h3>
              <p className="text-[12px] text-white/70">
                {mode === "detail" ? "Sent outreach record" : viewMail.email}
              </p>
            </div>
          </div>
          <button
            onClick={() => setViewMail(null)}
            className="flex items-center justify-center w-[30px] h-[30px] rounded-md bg-white/20 border border-white/30 text-white hover:bg-white/30"
          >
            <FiX size={14} />
          </button>
        </div>

        {/* ── USER STRIP ── */}
        <div className="flex items-center gap-[13px] px-[22px] py-[14px] border-b border-slate-100 bg-slate-50">
          <div
            className="w-[38px] h-[38px] rounded-full flex items-center justify-center text-[14px] font-extrabold border shrink-0"
            style={{
              background: `hsl(${hue},55%,88%)`,
              color: `hsl(${hue},45%,35%)`,
              borderColor: `hsl(${hue},40%,78%)`,
            }}
          >
            {viewMail.name[0]}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-bold text-slate-900">
              {viewMail.name}
            </p>
            <p className="text-[11.5px] text-slate-400">{viewMail.email}</p>
          </div>
          <span
            className={`px-[11px] py-[4px] rounded-full text-[11.5px] font-bold ${statusColors[viewMail.status] || "bg-slate-100 text-slate-700"}`}
          >
            {viewMail.status}
          </span>
        </div>

        {/* ── DETAIL VIEW ── */}
        {mode === "detail" && (
          <div className="px-[22px] py-[18px] flex flex-col gap-[16px]">
            <div>
              <p className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400 mb-[6px]">
                Subject
              </p>
              <p className="text-[13.5px] font-semibold text-slate-900">
                {viewMail.subject}
              </p>
            </div>
            <div className="border-t border-slate-100" />
            <div>
              <p className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400 mb-[8px]">
                Message
              </p>
              <div className="bg-slate-50 border border-slate-100 rounded-[12px] px-[16px] py-[14px] max-h-[130px] overflow-y-auto">
                <div
                  className="text-[13.5px] text-slate-700 [&>a]:text-indigo-500 [&>a]:underline"
                  dangerouslySetInnerHTML={{
                    __html:
                      viewMail.message ||
                      "<span class='text-slate-300'>No content</span>",
                  }}
                />
              </div>
            </div>
            <div className="border-t border-slate-100" />
            {viewMail.attachmentsMeta?.length > 0 && (
              <div>
                <p className="text-[10.5px] font-bold uppercase tracking-wider text-slate-400 mb-[8px]">
                  Attachments
                </p>
                <div className="flex flex-col gap-[8px]">
                  {viewMail.attachmentsMeta.map((file, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between bg-slate-50 border border-slate-100 rounded-[10px] px-[12px] py-[8px] hover:bg-slate-100 transition"
                    >
                      <div className="flex items-center gap-[8px] min-w-0">
                        <div className="w-8 h-8 rounded-[8px] bg-indigo-50 text-indigo-500 flex items-center justify-center">
                          <BsPaperclip />
                        </div>
                        <div className="flex flex-col min-w-0">
                          <p className="text-[12.5px] font-semibold text-slate-800 truncate">
                            {file.filename}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {file.mimeType}
                          </p>
                        </div>
                      </div>
                      <button
                        className="text-[11px] font-semibold text-indigo-500 hover:text-indigo-600"
                        onClick={() =>
                          downloadAttachment({
                            messageId: viewMail.messageId,
                            filename: file.filename,
                            gmailAccountId: accounts[0].gmailAccountId,
                            userId: accounts[0].id,
                          })
                        }
                      >
                        Download
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className="grid grid-cols-3 gap-[10px]">
              {[
                { label: "Sent", value: viewMail.date },
                { label: "clicks", value: viewMail.clicksCount ?? 0 },
                { label: "Replies", value: viewMail.replies ?? 0 },
                { label: "Replied", value: viewMail.isReplied ? "Yes" : "No" },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="bg-slate-50 border border-slate-100 rounded-[12px] px-[14px] py-[12px]"
                >
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-[4px]">
                    {label}
                  </p>
                  <p className="text-[13px] font-bold text-slate-900 font-mono">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── COMPOSE VIEW ── */}
        {mode === "compose" && (
          <div className="px-[22px] py-[18px] flex flex-col gap-[14px] max-h-[460px] overflow-y-auto">
            {showDraftPicker && (
              <DraftPicker
                setSubject={setSubject}
                setBody={setMessage}
                setShowDraftPicker={setShowDraftPicker}
                addFiles={addDraftFiles} // ← add this
                setDraftId={setDraftId}
              />
            )}

            {/* Original context strip */}
            <div className="flex items-center gap-2 px-[12px] py-[8px] bg-amber-50 border border-amber-200 rounded-[10px] text-[11.5px] text-amber-800">
              <span className="font-semibold">Re:</span> {viewMail.subject}
            </div>

            {/* Subject */}
            <div className="flex flex-col gap-[5px]">
              <label className="flex items-center gap-[5px] text-[11px] font-bold text-slate-400 uppercase tracking-[0.05em]">
                <FiType size={11} /> Subject
              </label>
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                disabled={sending}
                placeholder="Follow-up subject…"
                className="w-full border border-slate-200 rounded-[10px] px-[13px] py-[10px] text-[13px] text-slate-700 outline-none focus:border-indigo-500 disabled:opacity-50 disabled:bg-slate-50"
              />
            </div>

            {/* Message */}
            <div className="flex flex-col gap-[5px]">
              <label className="flex items-center gap-[5px] text-[11px] font-bold text-slate-400 uppercase tracking-[0.05em]">
                <FiAlignLeft size={11} /> Message
              </label>
              <textarea
                rows={6}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={sending}
                placeholder="Write your follow-up…"
                className="w-full border border-slate-200 rounded-[10px] px-[13px] py-[10px] text-[13px] resize-none leading-[1.65] text-slate-700 outline-none focus:border-indigo-500 disabled:opacity-50 disabled:bg-slate-50"
              />
              <p className="text-right text-[11px] text-slate-300">
                {message.length} chars
              </p>
            </div>

            {/* Attachments */}
            <div className="flex flex-col gap-[8px]">
              <label className="flex items-center gap-[5px] text-[11px] font-bold text-slate-400 uppercase tracking-[0.05em]">
                <FiPaperclip size={11} /> Attachments
                {attachments.length > 0 && (
                  <span className="ml-1 px-[6px] py-[1px] rounded-full bg-indigo-50 text-indigo-500 text-[10px]">
                    {attachments.length}
                  </span>
                )}
              </label>

              {/* Drop zone */}
              <div
                onClick={() => !sending && fileRef.current?.click()}
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragActive(true);
                }}
                onDragLeave={() => setDragActive(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragActive(false);
                  validateAndAddFiles(e.dataTransfer.files);
                }}
                className={`border-2 border-dashed rounded-[10px] py-[10px] text-center transition cursor-pointer ${
                  dragActive
                    ? "border-indigo-400 bg-indigo-50"
                    : sending
                      ? "border-slate-200 bg-slate-50 opacity-50 cursor-not-allowed"
                      : "border-slate-200 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-300"
                }`}
              >
                <p className="text-[12px] text-slate-400">
                  {dragActive
                    ? "Drop files here"
                    : "Click or drag to attach files"}
                </p>
                <p className="text-[10.5px] text-slate-300 mt-[2px]">
                  PDF, DOC, XLS, PNG, ZIP… up to 25MB
                </p>
                <input
                  ref={fileRef}
                  type="file"
                  multiple
                  disabled={sending}
                  className="hidden"
                  onChange={(e) => validateAndAddFiles(e.target.files)}
                />
              </div>

              {/* Error */}
              {attachmentError && (
                <p className="text-[11px] text-red-500 bg-red-50 border border-red-200 rounded-[8px] px-[10px] py-[6px]">
                  {attachmentError}
                </p>
              )}

              {/* File list */}
              {attachments.length > 0 && (
                <div className="flex flex-col gap-[6px]">
                  {attachments.map((file, i) => (
                    <div
                      key={i}
                      className={`flex items-center justify-between border rounded-[9px] px-[10px] py-[7px] ${
                        file.type === "stored"
                          ? "bg-indigo-50 border-indigo-200" // ← draft files styled differently
                          : "bg-slate-50 border-slate-200"
                      }`}
                    >
                      <div className="flex items-center gap-[8px] min-w-0">
                        <FiFile
                          size={13}
                          className={getFileIconColor(file.name)}
                        />
                        <div className="min-w-0">
                          <p className="text-[12px] font-semibold text-slate-800 truncate">
                            {file.name}
                          </p>
                          <p className="text-[10px] text-slate-400">
                            {file.type === "stored"
                              ? "From draft"
                              : formatFileSize(file.size)}{" "}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          setAttachments((a) => a.filter((_, j) => j !== i))
                        }
                        disabled={sending}
                        className="text-slate-400 hover:text-red-500 transition disabled:pointer-events-none p-[4px] rounded hover:bg-red-50"
                      >
                        <FiTrash2 size={13} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── FOOTER ── */}
        <div className="px-[22px] py-[14px] border-t border-slate-100 flex items-center justify-between bg-slate-50">
          {mode === "detail" ? (
            <>
              <button
                onClick={() => setViewMail(null)}
                className="px-[16px] py-[8px] rounded-[10px] text-[13px] font-semibold border border-slate-200 text-slate-500 hover:bg-slate-100 transition"
              >
                Close
              </button>
              <button
                onClick={() => setMode("compose")}
                className="px-[16px] py-[8px] rounded-[10px] text-[13px] font-bold bg-indigo-500 text-white hover:bg-indigo-600 shadow-md transition"
              >
                Send Followup →
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setShowDraftPicker((v) => !v)}
                disabled={sending}
                className="flex items-center gap-[6px] px-[12px] py-[6px] rounded-[9px] text-[12px] font-semibold border border-indigo-200 text-indigo-500 bg-indigo-50 hover:bg-indigo-100 disabled:opacity-50 transition"
              >
                <FiEdit3 size={12} />
                Use Draft
                {showDraftPicker ? (
                  <FiChevronUp size={11} />
                ) : (
                  <FiChevronDown size={11} />
                )}
              </button>

              {sentSuccess ? (
                <div className="flex items-center gap-2 px-[14px] py-[8px] bg-green-100 text-green-700 rounded-[10px] text-[13px] font-semibold">
                  <FiCheck size={13} /> Sent!
                </div>
              ) : (
                <button
                  onClick={handleSend}
                  disabled={!subject.trim() || !message.trim() || sending}
                  className="flex items-center gap-[7px] px-[16px] py-[8px] rounded-[10px] text-[13px] font-bold bg-indigo-500 text-white hover:bg-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed shadow-md transition"
                >
                  {sending ? (
                    <>
                      <FiRefreshCw size={13} className="animate-spin" />{" "}
                      Sending…
                    </>
                  ) : (
                    <>
                      <FiSend size={13} /> Send Follow-up
                      {attachments.length > 0 && (
                        <span className="ml-[2px] px-[6px] py-[1px] bg-indigo-400 text-white text-[10px] rounded-full">
                          {attachments.length}
                        </span>
                      )}
                    </>
                  )}
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailDetailModal;
