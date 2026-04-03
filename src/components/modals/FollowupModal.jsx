import { useContext, useState } from "react";
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
import DraftPicker from "../email/compose email/DraftPicker";
import { convertToHtml } from "../../utils/fileUtils";
import { userContext } from "../../context/ContextProvider";
import { sendEmail } from "../../utils/api.utils";
import { toast } from "react-toastify";

const DAY_MS = 86400000;

// Max file size: 25MB (Gmail standard limit for most attachments)
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

/**
 * Format bytes to human readable format
 */
const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};

/**
 * Get file extension
 */
const getFileExtension = (filename) => {
  return filename.split(".").pop().toLowerCase();
};

/**
 * Check if file type is allowed
 */
const isFileTypeAllowed = (filename) => {
  const ext = getFileExtension(filename);
  return ALLOWED_EXTENSIONS.includes(ext);
};

/**
 * Get file icon based on type
 */
const getFileIcon = (filename) => {
  const ext = getFileExtension(filename);
  const iconClass = "w-4 h-4";

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
      className={`${iconClass} ${iconMap[ext] || "text-gray-400"}`}
      size={14}
    />
  );
};

const FollowupModal = ({ lead, onClose }) => {
  if (!lead) return null;

  const name = lead.to[0].split("@")[0];
  const daysSince = Math.floor(
    (Date.now() - new Date(lead.sentAt).getTime()) / DAY_MS,
  );
  const hue = (name.charCodeAt(0) * 17) % 360;

  const [subject, setSubject] = useState(``);
  const [message, setMessage] = useState(``);
  const [attachments, setAttachments] = useState([]);
  const [dragActive, setDragActive] = useState(false);
  const [showDraftPicker, setShowDraftPicker] = useState(false);
  const [sending, setSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [attachmentError, setAttachmentError] = useState("");
  const { accounts } = useContext(userContext);

  /**
   * Calculate total attachment size
   */
  const totalAttachmentSize = attachments.reduce(
    (sum, file) => sum + file.size,
    0,
  );

  /**
   * Validate and add files
   */
  const validateAndAddFiles = (files) => {
    setAttachmentError("");
    const newFiles = Array.from(files);
    const validFiles = [];
    const errors = [];

    newFiles.forEach((file) => {
      // Check file size
      if (file.size > MAX_FILE_SIZE) {
        errors.push(
          `${file.name} exceeds max file size (${formatFileSize(MAX_FILE_SIZE)})`,
        );
        return;
      }

      // Check file type
      if (!isFileTypeAllowed(file.name)) {
        errors.push(
          `${file.name} type not allowed. Allowed: ${ALLOWED_EXTENSIONS.join(
            ", ",
          )}`,
        );
        return;
      }

      // Check if already added
      if (attachments.some((a) => a.file.name === file.name)) {
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

    // Check total size
    if (
      totalAttachmentSize + validFiles.reduce((s, f) => s + f.size, 0) >
      MAX_TOTAL_SIZE
    ) {
      errors.push(
        `Total attachment size exceeds limit (${formatFileSize(MAX_TOTAL_SIZE)})`,
      );
      return;
    }

    if (errors.length > 0) {
      setAttachmentError(errors[0]);
    }

    if (validFiles.length > 0) {
      setAttachments([...attachments, ...validFiles]);
    }
  };

  /**
   * Handle file input change
   */
  const handleFileChange = (e) => {
    validateAndAddFiles(e.target.files);
  };

  /**
   * Handle drag over
   */
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(true);
  };

  /**
   * Handle drag leave
   */
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  /**
   * Handle drop
   */
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    validateAndAddFiles(e.dataTransfer.files);
  };

  /**
   * Remove attachment
   */
  const removeAttachment = (id) => {
    setAttachments(attachments.filter((a) => a.id !== id));
    setAttachmentError("");
  };

  /**
   * Send follow-up with attachments
   */
  const sendFollowUp = async () => {
    setSending(true);
    if (!subject.trim() || !message.trim()) return;
    try {
      const html = convertToHtml(message);

      // Prepare form data for multipart/form-data upload
      const formData = new FormData();

      formData.append("gmailAccountId", accounts?.[0]?.gmailAccountId);
      formData.append("userId", accounts?.[0]?.id);
      formData.append("subject", subject);
      formData.append("body", html);
      formData.append("to", JSON.stringify(lead.to));
      formData.append("cc", JSON.stringify(lead.cc || []));
      formData.append("bcc", JSON.stringify(lead.bcc || []));
      formData.append("attachmentIds", JSON.stringify(lead.attachments || []));

      const newFiles = attachments?.filter((a) => a instanceof File);

      newFiles?.forEach((file) => {
        formData.append("files", file);
      });

      await sendEmail(formData);
      setSentSuccess(true);
    } catch (error) {
      toast.error("Failed to send follow-up: " + error);
      setSending(false);
      return;
    } finally {
      setSending(false);
      onClose();
    }
  };

  const fld =
    "w-full border border-slate-200 rounded-md px-3 py-2 text-sm outline-none focus:border-indigo-500";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm overflow-y-auto"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-[560px] bg-white rounded-xl overflow-hidden shadow-2xl my-6"
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
                {lead.email} · {daysSince} days since original
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
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

        {showDraftPicker && (
          <DraftPicker
            setSubject={setSubject}
            setBody={setMessage}
            setShowDraftPicker={setShowDraftPicker}
          />
        )}

        {/* CONTEXT */}
        <div className="px-6 py-2 bg-amber-50 border-b border-amber-200 flex items-center gap-2">
          <FiAlertCircle size={13} className="text-amber-700" />
          <p className="text-xs text-amber-900">
            Original: <strong>{lead.subject}</strong> · sent {daysSince} days
            ago · {lead.opens} open{lead.opens !== 1 ? "s" : ""}
          </p>
        </div>

        {/* FORM */}
        <div className="px-6 py-5 flex flex-col gap-4 max-h-[600px] overflow-y-auto">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Subject
            </label>
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className={fld}
              placeholder="Enter subject"
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
              className={`${fld} resize-none leading-relaxed`}
              placeholder="Enter your message"
            />
            <p className="text-right text-xs text-slate-300 mt-1">
              {message.length} chars
            </p>
          </div>

          {/* ATTACHMENTS SECTION */}
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Attachments ({attachments.length})
            </label>

            {/* Drag and drop zone */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-lg p-4 text-center transition cursor-pointer ${
                dragActive
                  ? "border-indigo-500 bg-indigo-50"
                  : "border-slate-300 bg-slate-50 hover:bg-slate-100"
              }`}
            >
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                className="hidden"
                id="file-input"
                disabled={sending || sentSuccess}
              />

              <label
                htmlFor="file-input"
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

            {/* Error message */}
            {attachmentError && (
              <div className="mt-2 flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                <FiAlertTriangle
                  size={14}
                  className="text-red-500 mt-0.5 flex-shrink-0"
                />
                <p className="text-xs text-red-700">{attachmentError}</p>
              </div>
            )}

            {/* Attachments list */}
            {attachments.length > 0 && (
              <div className="mt-3 space-y-2">
                {attachments.map((attachment) => (
                  <div
                    key={attachment.id}
                    className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg hover:bg-slate-100 transition"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {getFileIcon(attachment.name)}
                      <div className="min-w-0">
                        <p className="text-xs font-semibold text-slate-900 truncate">
                          {attachment.name}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {formatFileSize(attachment.size)}
                        </p>
                      </div>
                    </div>

                    <button
                      onClick={() => removeAttachment(attachment.id)}
                      className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition flex-shrink-0"
                      title="Remove attachment"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                ))}

                {/* Total size indicator */}
                <div className="flex items-center justify-between text-[11px] text-slate-600 px-3 py-2 border border-slate-200 rounded-lg">
                  <span>Total size:</span>
                  <span
                    className={`font-semibold ${
                      totalAttachmentSize > MAX_TOTAL_SIZE * 0.8
                        ? "text-amber-600"
                        : "text-slate-600"
                    }`}
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
                  <FiRefreshCw className="animate-spin" size={13} />
                  Sending...
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
