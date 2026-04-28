import { useContext, useEffect, useMemo, useState } from "react";
import {
  FiEdit3,
  FiChevronDown,
  FiChevronUp,
  FiX,
  FiAlertCircle,
  FiAtSign,
  FiSend,
  FiCheck,
  FiRefreshCw,
  FiPaperclip,
  FiTrash2,
  FiFile,
  FiAlertTriangle,
} from "react-icons/fi";
import DraftPicker from "../email/compose email/DraftPicker.jsx";
import { convertToHtml } from "../../utils/fileUtils.js";
import { userContext } from "../../context/userContext.js";
import { sendFollowupApi } from "../../utils/api.utils.js";
import { toast } from "react-toastify";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

const DAY_MS = 86400000;
const MAX_FILE_SIZE = 25 * 1024 * 1024;
const MAX_TOTAL_SIZE = 25 * 1024 * 1024;
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

const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

const getFileExtension = (filename) => filename.split(".").pop().toLowerCase();

const isFileTypeAllowed = (filename) =>
  ALLOWED_EXTENSIONS.includes(getFileExtension(filename));

const getFileIcon = (filename) => {
  const ext = getFileExtension(filename);
  const iconMap = {
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
  return (
    <FiFile
      className={`w-4 h-4 ${iconMap[ext] || "text-gray-400"}`}
      size={14}
    />
  );
};

const FollowupModal = ({ lead, onClose }) => {
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [showDraftPicker, setShowDraftPicker] = useState(false);
  const [sending, setSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [attachmentError, setAttachmentError] = useState("");
  const [draftId, setDraftId] = useState(null);

  const { accounts } = useContext(userContext);
  const now = useMemo(() => Date.now(), []);

  if (!lead) return null;

  const name = lead.to[0].split("@")[0];

  const daysSince = Math.floor(
    (now - new Date(lead.sentAt).getTime()) / DAY_MS,
  );
  const hue = (name.charCodeAt(0) * 17) % 360;

  const totalAttachmentSize = attachments.reduce(
    (sum, file) => sum + (file.size || 0),
    0,
  );

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
        errors.push(
          `${file.name} exceeds max file size (${formatFileSize(MAX_FILE_SIZE)})`,
        );
        return;
      }
      if (!isFileTypeAllowed(file.name)) {
        errors.push(`${file.name} type not allowed`);
        return;
      }
      if (attachments.some((a) => a.name === file.name)) {
        errors.push(`${file.name} is already attached`);
        return;
      }
      validFiles.push({
        id: Math.random().toString(36).substr(2, 9),
        file,
        size: file.size,
        name: file.name,
      });
    });

    if (
      totalAttachmentSize + validFiles.reduce((s, f) => s + f.size, 0) >
      MAX_TOTAL_SIZE
    ) {
      errors.push(
        `Total attachment size exceeds limit (${formatFileSize(MAX_TOTAL_SIZE)})`,
      );
      return;
    }

    if (errors.length) setAttachmentError(errors[0]);
    if (validFiles.length) setAttachments((a) => [...a, ...validFiles]);
  };

  const handleFileChange = (e) => validateAndAddFiles(e.target.files);

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    validateAndAddFiles(e.dataTransfer.files);
  };

  const removeAttachment = (id) => {
    setAttachments(attachments.filter((a) => a.id !== id));
    setAttachmentError("");
  };

  const sendFollowUp = async () => {
    const html = editor?.getHTML();
    if (!subject.trim() || !editor?.getText().trim()) return;
    setSending(true);
    try {
      const html = convertToHtml(message);
      const formData = new FormData();

      formData.append("gmailAccountId", accounts?.[0]?.gmailAccountId);
      formData.append("userId", accounts?.[0]?.id);
      formData.append("body", html);

      if (draftId) formData.append("draftId", draftId);

      const attachmentIds = attachments
        .filter((a) => a.type === "stored" && a.id)
        .map((a) => a.id);
      formData.append("attachmentIds", JSON.stringify(attachmentIds));

      const newFiles = attachments
        .filter((a) => a.file instanceof File)
        .map((a) => a.file);
      newFiles.forEach((file) => formData.append("files", file));

      await sendFollowupApi(formData);
      setSentSuccess(true);
      setTimeout(() => onClose(), 1500);
    } catch (error) {
      toast.error("Failed to send follow-up: " + error);
    } finally {
      setSending(false);
    }
  };

  const fld =
    "w-full border border-slate-200 rounded-md px-3 py-2 text-sm outline-none focus:border-indigo-500";

  const editor = useEditor({
    extensions: [StarterKit],
    content: message || "",

    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      setMessage(html);
    },

    editorProps: {
      attributes: {
        class: "w-full px-3 py-2 text-sm min-h-[150px] outline-none",
      },
    },
  });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-[640px] bg-white rounded-[20px] overflow-hidden shadow-[0_32px_80px_rgba(15,23,42,0.18)] border border-slate-100 flex flex-col max-h-[90vh]"
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
              {name[0]}
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900">
                Follow-up to {name}
              </h2>
              <p className="text-xs text-slate-400">
                {lead.to[0]} · {daysSince} days since original
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowDraftPicker(!showDraftPicker)}
              disabled={sending}
              className={`flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-md border transition disabled:opacity-50 disabled:cursor-not-allowed
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

        {/* CONTEXT */}
        <div className="px-6 py-2 bg-amber-50 border-b border-amber-200 flex items-center gap-2">
          <FiAlertCircle size={13} className="text-amber-700" />
          <p className="text-xs text-amber-900">
            Original: <strong>{lead.subject}</strong> · sent {daysSince} days
            ago · {lead.opens} open{lead.opens !== 1 ? "s" : ""}
          </p>
        </div>

        <div className="px-6 py-5 flex flex-col gap-4 max-h-[600px] overflow-y-auto">
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
              editor={editor}
            />
          )}

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Subject
            </label>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              disabled={sending}
              className={`${fld} disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-50`}
              placeholder="Enter subject"
            />
          </div>

          <div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                Message
              </label>
              <div className="border border-slate-200 rounded-md overflow-hidden">
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
            </div>
            <p className="text-right text-xs text-slate-300 mt-1">
              {message.length} chars
            </p>
          </div>

          {/* ATTACHMENTS */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Attachments ({attachments.length})
              {attachments.some((a) => a.type === "stored") && (
                <span className="ml-2 text-[10px] bg-indigo-50 text-indigo-500 px-[6px] py-[1px] rounded-full font-semibold normal-case tracking-normal">
                  includes draft files
                </span>
              )}
            </label>

            {/* Drop zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-4 text-center transition ${
                dragActive
                  ? "border-indigo-500 bg-indigo-50 cursor-copy"
                  : sending
                    ? "border-slate-200 bg-slate-50 opacity-50 cursor-not-allowed"
                    : "border-slate-300 bg-slate-50 hover:bg-slate-100 cursor-pointer"
              }`}
            >
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
                id="followup-file-input"
                disabled={sending || sentSuccess}
              />
              <label
                htmlFor="followup-file-input"
                className="flex flex-col items-center gap-2 cursor-pointer"
              >
                <FiPaperclip
                  size={20}
                  className={dragActive ? "text-indigo-500" : "text-slate-400"}
                />
                <div>
                  <p className="text-xs font-semibold text-slate-700">
                    Drop files here or click to browse
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1">
                    Max {formatFileSize(MAX_FILE_SIZE)} per file · Total{" "}
                    {formatFileSize(MAX_TOTAL_SIZE)}
                  </p>
                </div>
              </label>
            </div>

            {/* Error */}
            {attachmentError && (
              <div className="mt-2 flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <FiAlertTriangle
                  size={14}
                  className="text-red-500 mt-0.5 flex-shrink-0"
                />
                <p className="text-xs text-red-700">{attachmentError}</p>
              </div>
            )}

            {/* File list */}
            {attachments.length > 0 && (
              <div className="mt-3 space-y-2">
                {attachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className={`flex items-center justify-between p-3 border rounded-lg transition ${
                      attachment.type === "stored"
                        ? "bg-indigo-50 border-indigo-200"
                        : "bg-slate-50 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {getFileIcon(attachment.name)}
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-900 truncate">
                          {attachment.name}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {attachment.type === "stored"
                            ? "From draft"
                            : formatFileSize(attachment.size)}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => removeAttachment(attachment.id)}
                      disabled={sending}
                      className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition flex-shrink-0 disabled:pointer-events-none"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                ))}

                {/* Total size */}
                <div className="flex items-center justify-between text-[11px] text-slate-600 px-3 py-2 border border-slate-200 rounded-lg">
                  <span>Total size:</span>
                  <span
                    className={`font-semibold ${totalAttachmentSize > MAX_TOTAL_SIZE * 0.8 ? "text-amber-600" : "text-slate-600"}`}
                  >
                    {formatFileSize(totalAttachmentSize)} /{" "}
                    {formatFileSize(MAX_TOTAL_SIZE)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* FOOTER */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-slate-200 bg-slate-50">
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <FiAtSign size={12} /> {lead.to[0]}
          </span>

          {sentSuccess ? (
            <div className="flex items-center gap-2 px-4 py-2 bg-green-100 text-green-700 rounded-md text-sm font-semibold">
              <FiCheck size={14} /> Follow-up sent
            </div>
          ) : (
            <button
              onClick={sendFollowUp}
              disabled={
                !subject.trim() ||
                !message.trim() ||
                sending ||
                totalAttachmentSize > MAX_TOTAL_SIZE
              }
              className="px-4 py-2 text-sm font-bold rounded-md bg-indigo-600 text-white flex items-center gap-1 hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              {sending ? (
                <>
                  <FiRefreshCw className="animate-spin" size={13} /> Sending...
                </>
              ) : (
                <>
                  <FiSend size={13} />
                  Send Follow-up
                  {attachments.length > 0 && (
                    <span className="ml-1 px-2 py-0.5 bg-indigo-500 text-xs rounded-full">
                      {attachments.length}
                    </span>
                  )}
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FollowupModal;
