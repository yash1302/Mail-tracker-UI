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
  // FiReply,
  FiClock,
} from "react-icons/fi";
import { sendFollowupApi } from "../../utils/api.utils.js";
import { useContext, useRef, useState } from "react";
import { userContext } from "../../context/userContext.js";
import { convertToHtml } from "../../utils/fileUtils.js";
import { toast } from "react-toastify";
import DraftPicker from "../email/compose email/DraftPicker.jsx";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

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

const ThreadItem = ({ item, hue }) => {
  const [expandedAttachments, setExpandedAttachments] = useState(false);
  const [showRecipients, setShowRecipients] = useState(false);
  const [expandedBody, setExpandedBody] = useState(false);

  const isIncoming = item.direction === "incoming";
  const isOutgoing = item.direction === "outgoing";
  const isFollowUp = item.type === "followup" && isOutgoing;

  const { accounts } = useContext(userContext);

  const cleanHtml = (html = "") => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");

    doc.querySelectorAll("img, style, script").forEach((el) => el.remove());

    const allElements = doc.body.querySelectorAll("*");

    allElements.forEach((el) => {
      const tag = el.tagName.toLowerCase();

      const style = el.getAttribute("style") || "";

      if (/font-weight\s*:\s*(bold|bolder|[5-9]00)/i.test(style)) {
        const strong = doc.createElement("strong");
        strong.innerHTML = el.innerHTML;
        el.replaceWith(strong);
        return;
      }

      el.removeAttribute("style");
      el.removeAttribute("class");

      if (tag !== "p" && tag !== "span" && tag !== "strong" && tag !== "b") {
        const parent = el.parentNode;
        while (el.firstChild) {
          parent.insertBefore(el.firstChild, el);
        }
        parent.removeChild(el);
      }
    });

    return doc.body.innerHTML.trim();
  };

  const getAvatarContent = () => {
    if (isIncoming) {
      return item.from?.[0]?.toUpperCase() || "U";
    }
    return accounts?.[0]?.user?.name?.[0]?.toUpperCase() || "Y";
  };

  return (
    <div
      className={`border rounded-[14px] px-[16px] py-[14px] max-w-[80%] ${
        isIncoming
          ? "border-green-100 bg-white mr-auto"
          : isFollowUp
            ? "border-indigo-100 bg-white ml-auto"
            : "border-slate-200 bg-white ml-auto"
      }`}
    >
      {/* HEADER */}
      <div className="flex items-start justify-between mb-[8px]">
        <div className="flex items-center gap-[10px]">
          {/* Avatar */}
          <div
            className={`w-[32px] h-[32px] rounded-full flex items-center justify-center text-[12px] font-bold ${
              isIncoming
                ? "bg-green-100 text-green-700"
                : isFollowUp
                  ? "bg-indigo-100 text-indigo-700"
                  : "bg-slate-100 text-slate-700"
            }`}
          >
            {getAvatarContent()}
          </div>

          {/* Name + Time */}
          <div>
            <p className="text-[12.5px] font-semibold text-slate-900">
              {isOutgoing ? "You" : item.from}
            </p>
            <p className="text-[10.5px] text-slate-400">
              {new Date(item.sentAt || item.timestamp).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Badge */}
        {!isIncoming && (
          <span
            className={`text-[10px] px-[8px] py-[2px] rounded-full font-semibold ${
              isFollowUp
                ? "bg-indigo-100 text-indigo-600"
                : "bg-slate-100 text-slate-600"
            }`}
          >
            {isFollowUp ? "Follow-up" : "Original"}
          </span>
        )}
      </div>

      {/* SUBJECT */}
      {item.subject && (
        <p className="text-[12px] font-semibold text-slate-800 mb-[6px]">
          {item.subject}
        </p>
      )}

      {/* BODY */}
      <div className="text-[13px] text-slate-700 leading-[1.6]">
        <div
          className={`${!expandedBody ? "max-h-[80px] overflow-hidden" : ""}`}
          dangerouslySetInnerHTML={{
            __html: cleanHtml(item.htmlBody || item.message || ""),
          }}
        />

        {(item.htmlBody || "").length > 200 && (
          <button
            onClick={() => setExpandedBody(!expandedBody)}
            className="mt-[4px] text-[11px] text-indigo-500 font-semibold"
          >
            {expandedBody ? "Show less" : "Read more"}
          </button>
        )}
      </div>

      {/* ATTACHMENTS */}
      {item.attachmentsMeta?.length > 0 && (
        <div className="mt-[10px]">
          <button
            onClick={() => setExpandedAttachments(!expandedAttachments)}
            className="text-[11px] text-slate-500 font-medium mb-[6px]"
          >
            {item.attachmentsMeta.length} attachment
            {item.attachmentsMeta.length > 1 ? "s" : ""}
          </button>

          {expandedAttachments && (
            <div className="flex flex-col gap-[6px]">
              {item.attachmentsMeta.map((file, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between border border-slate-200 rounded-[8px] px-[10px] py-[6px]"
                >
                  <p className="text-[11px] text-slate-700 truncate">
                    {file.filename}
                  </p>

                  <a
                    href={file.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-indigo-500 text-[11px] font-medium"
                  >
                    Download
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* STATS */}
      {!isIncoming && (
        <div className="flex gap-[10px] text-[10.5px] text-slate-400 mt-[8px] pt-[6px] border-t border-slate-100">
          <span>Opens: {item.opensCount || 0}</span>
          <span>•</span>
          <span>Clicks: {item.clicksCount || 0}</span>
        </div>
      )}
    </div>
  );
};

const EmailDetailModal = ({ viewMail, setViewMail, handleGetSentEmails }) => {
  const [mode, setMode] = useState("thread");
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

  const threadItems = (viewMail.messages || [])
    .map((m) => ({
      ...m,
      timestamp: m.sentAt,
    }))
    .sort((a, b) => new Date(a.sentAt) - new Date(b.sentAt));

  const addDraftFiles = (files) => {
    const nf = files.map((f) => ({
      type: "stored",
      id: f._id,
      name: f.filename,
      size: f.size,
      mimeType: f.mimeType,
    }));
    setAttachments(nf);
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
    const html = editor?.getHTML();
    if (!subject.trim() || !editor?.getText().trim()) return;
    setSending(true);
    try {
      const initialMessage = viewMail.messages?.[0];
      const formData = new FormData();
      formData.append("gmailAccountId", accounts?.[0]?.gmailAccountId);
      formData.append("userId", accounts?.[0]?.id);
      formData.append("subject", subject);
      formData.append("body", html);
      formData.append("to", JSON.stringify([viewMail.email]));
      formData.append("cc", JSON.stringify([]));
      formData.append("bcc", JSON.stringify([]));

      // formData.append("threadId", viewMail.threadId);
      formData.append("messageId", initialMessage?.id);

      if (draftId) formData.append("draftId", draftId);

      const attachmentIds = attachments
        .filter((a) => a.type === "stored" && a.id)
        .map((a) => a.id);
      formData.append("attachmentIds", JSON.stringify(attachmentIds || []));

      const newFiles = attachments.filter((a) => a instanceof File);
      newFiles.forEach((file) => formData.append("files", file));

      await sendFollowupApi(formData);
      if (handleGetSentEmails) await handleGetSentEmails();
      editor?.commands.clearContent();
      setMessage("");
      setTimeout(() => {
        setViewMail(null);
        setMode("thread");
      }, 1500);
    } catch (_error) {
      console.error(_error);
      toast.error("Failed to send follow-up.");
    } finally {
      setSending(false);
    }
  };

  const hasIncomingReply = viewMail.messages?.some(
    (m) => m.type === "reply" && m.direction === "incoming",
  );

  const editor = useEditor({
    extensions: [StarterKit],
    content: "",

    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setMessage(html);
    },

    editorProps: {
      attributes: {
        class:
          "w-full px-[13px] py-[10px] text-[13px] min-h-[140px] outline-none",
      },
    },
  });

  return (
    <div
      onClick={() => setViewMail(null)}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-[16px]"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[640px] bg-white rounded-[20px] overflow-hidden shadow-[0_32px_80px_rgba(15,23,42,0.18)] border border-slate-100 animate-[modalIn_0.22s_cubic-bezier(0.34,1.56,0.64,1)] flex flex-col max-h-[90vh]"
      >
        {/* ── HEADER ── */}
        <div className="flex items-center justify-between px-[22px] py-[16px] bg-gradient-to-r from-indigo-500 to-indigo-400 border-b border-indigo-400 flex-shrink-0">
          <div className="flex items-center gap-[12px] flex-1 min-w-0">
            {mode === "compose" && (
              <button
                onClick={() => {
                  setMode("thread");
                  setSubject("");
                  setMessage("");
                  setAttachments([]);
                }}
                className="flex items-center justify-center w-[28px] h-[28px] rounded-md bg-white/20 border border-white/30 text-white hover:bg-white/30 flex-shrink-0"
              >
                <FiArrowLeft size={14} />
              </button>
            )}
            <div className="min-w-0 flex-1">
              <h3 className="text-[15px] font-extrabold text-white truncate">
                {mode === "thread"
                  ? "Email Thread"
                  : `${hasIncomingReply ? "Reply" : "Follow-up"} to ${viewMail.name}`}
              </h3>
              <p className="text-[12px] text-white/70 truncate">
                {viewMail.email}
              </p>
            </div>
          </div>
          <button
            onClick={() => setViewMail(null)}
            className="flex items-center justify-center w-[30px] h-[30px] rounded-md bg-white/20 border border-white/30 text-white hover:bg-white/30 flex-shrink-0"
          >
            <FiX size={14} />
          </button>
        </div>

        {/* ── USER STRIP ── */}
        <div className="flex items-center gap-[13px] px-[22px] py-[14px] border-b border-slate-100 bg-slate-50 flex-shrink-0">
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
            <p className="text-[13px] font-bold text-slate-900 truncate">
              {viewMail.name}
            </p>
            <p className="text-[11.5px] text-slate-400 truncate">
              {viewMail.email}
            </p>
          </div>
          <span
            className={`px-[11px] py-[4px] rounded-full text-[11.5px] font-bold flex-shrink-0 ${
              statusColors[viewMail.status] || "bg-slate-100 text-slate-700"
            }`}
          >
            {viewMail.status}
          </span>
        </div>

        {/* ── THREAD VIEW ── */}
        {mode === "thread" && (
          <div className="flex-1 overflow-y-auto px-[22px] py-[16px] space-y-[12px]">
            {threadItems.length > 0 ? (
              threadItems.map((item, idx) => (
                <ThreadItem
                  key={idx}
                  item={item}
                  isReply={item.direction === "incoming"}
                  isFollowUp={
                    item.type === "followup" && item.direction === "outgoing"
                  }
                  hue={hue}
                />
              ))
            ) : (
              <div className="text-center py-[32px] text-slate-400">
                <p className="text-[13px]">No thread items</p>
              </div>
            )}
          </div>
        )}

        {/* ── COMPOSE VIEW ── */}
        {mode === "compose" && (
          <div className="flex-1 overflow-y-auto px-[22px] py-[16px] space-y-[14px]">
            {showDraftPicker && (
              <DraftPicker
                setSubject={setSubject}
                setBody={(html) => {
                  setMessage(html);
                  editor?.commands.setContent(html);
                }}
                setShowDraftPicker={setShowDraftPicker}
                addFiles={addDraftFiles}
                setDraftId={setDraftId}
              />
            )}

            {/* Original context */}
            <div className="flex items-center gap-[8px] px-[12px] py-[8px] bg-amber-50 border border-amber-200 rounded-[10px] text-[11.5px] text-amber-800">
              <span className="font-semibold">Re:</span>
              <span className="truncate">{viewMail.subject}</span>
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

              <div className="border border-slate-200 rounded-[10px] overflow-hidden">
                {/* Toolbar */}
                <div className="flex gap-1 p-2 bg-slate-50 border-b border-slate-200">
                  <button
                    onClick={() => editor?.chain().focus().toggleBold().run()}
                    className="px-2 py-1 bg-white rounded hover:bg-indigo-50"
                  >
                    B
                  </button>

                  <button
                    onClick={() => editor?.chain().focus().toggleItalic().run()}
                    className="px-2 py-1 bg-white rounded hover:bg-indigo-50"
                  >
                    I
                  </button>
                </div>

                {/* Editor */}
                <EditorContent editor={editor} />
              </div>

              {/* Char count */}
              <p className="text-right text-[11px] text-slate-300">
                {editor?.getText().length || 0} chars
              </p>
            </div>

            {/* Attachments */}
            <div className="flex flex-col gap-[8px]">
              <label className="flex items-center gap-[5px] text-[11px] font-bold text-slate-400 uppercase tracking-[0.05em]">
                <FiPaperclip size={11} /> Attachments
                {attachments.length > 0 && (
                  <span className="ml-[6px] px-[6px] py-[1px] rounded-full bg-indigo-50 text-indigo-500 text-[10px]">
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
                          ? "bg-indigo-50 border-indigo-200"
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
                              : formatFileSize(file.size)}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          setAttachments((a) => a.filter((_, j) => j !== i))
                        }
                        disabled={sending}
                        className="text-slate-400 hover:text-red-500 transition disabled:pointer-events-none p-[4px] rounded hover:bg-red-50 flex-shrink-0"
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
        <div className="px-[22px] py-[14px] border-t border-slate-100 flex items-center justify-between bg-slate-50 flex-shrink-0">
          {mode === "thread" ? (
            <>
              <div className="text-[11.5px] text-slate-500">
                {threadItems.length} message
                {threadItems.length !== 1 ? "s" : ""} in thread
              </div>
              <div className="flex gap-[8px]">
                <button
                  onClick={() => setViewMail(null)}
                  className="px-[16px] py-[8px] rounded-[10px] text-[13px] font-semibold border border-slate-200 text-slate-500 hover:bg-slate-100 transition"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setMode("compose");
                    setSubject(`Re: ${viewMail.subject}`);
                  }}
                  className="px-[16px] py-[8px] rounded-[10px] text-[13px] font-bold bg-indigo-500 text-white hover:bg-indigo-600 shadow-md transition"
                >
                  {hasIncomingReply ? "Reply →" : "Send Follow-up →"}
                </button>
              </div>
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
                <div className="flex items-center gap-[6px] px-[14px] py-[8px] bg-green-100 text-green-700 rounded-[10px] text-[13px] font-semibold">
                  <FiCheck size={13} /> Sent!
                </div>
              ) : (
                <button
                  onClick={handleSend}
                  disabled={
                    !subject.trim() || !editor?.getText().trim() || sending
                  }
                  className="flex items-center gap-[7px] px-[16px] py-[8px] rounded-[10px] text-[13px] font-bold bg-indigo-500 text-white hover:bg-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed shadow-md transition"
                >
                  {sending ? (
                    <>
                      <FiRefreshCw size={13} className="animate-spin" />{" "}
                      Sending…
                    </>
                  ) : (
                    <>
                      <FiSend size={13} />{" "}
                      {hasIncomingReply ? "Reply" : "Send Follow-up"}
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
