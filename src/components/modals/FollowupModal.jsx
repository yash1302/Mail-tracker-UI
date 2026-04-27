import { useContext, useMemo, useState } from "react";
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
import { userContext } from "../../context/userContext.js";
import { sendFollowupApi } from "../../utils/api.utils.js";
import { toast } from "react-toastify";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

const DAY_MS = 86400000;
const MAX_FILE_SIZE = 25 * 1024 * 1024;
const MAX_TOTAL_SIZE = 25 * 1024 * 1024;

const FollowupModal = ({ lead, onClose }) => {
  const [subject, setSubject] = useState("");
  const [attachments, setAttachments] = useState([]);
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

  // ✅ TIPTAP EDITOR
  const editor = useEditor({
    extensions: [StarterKit],
    content: "",

    onUpdate: ({ editor }) => {
      // no state sync needed
    },

    editorProps: {
      attributes: {
        class: "w-full px-3 py-2 text-sm min-h-[150px] outline-none",
      },
    },
  });

  // ✅ SEND FOLLOWUP
  const sendFollowUp = async () => {
    const html = editor?.getHTML();

    if (!subject.trim() || !editor?.getText().trim()) return;

    setSending(true);
    try {
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

      // ✅ RESET EVERYTHING
      setSubject("");
      setAttachments([]);
      setDraftId(null);
      setAttachmentError("");

      editor?.commands.clearContent(); // 🔥 IMPORTANT

      setTimeout(() => onClose(), 1500);
    } catch (error) {
      toast.error("Failed to send follow-up");
    } finally {
      setSending(false);
    }
  };

  const addDraftFiles = (files) => {
    const nf = files.map((f) => ({
      type: "stored",
      id: f._id,
      name: f.filename,
      size: f.size,
    }));
    setAttachments((p) => [...p, ...nf]);
  };

  const removeAttachment = (id) => {
    setAttachments(attachments.filter((a) => a.id !== id));
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-[560px] bg-white rounded-xl overflow-hidden shadow-2xl"
      >
        {/* HEADER */}
        <div className="flex justify-between px-6 py-4 border-b">
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
              <h2 className="text-sm font-bold">
                Follow-up to {name}
              </h2>
              <p className="text-xs text-slate-400">
                {lead.to[0]} · {daysSince} days
              </p>
            </div>
          </div>

          <button onClick={onClose}>
            <FiX />
          </button>
        </div>

        <div className="px-6 py-5 flex flex-col gap-4">
          {/* SUBJECT */}
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="border px-3 py-2 rounded"
            placeholder="Subject"
          />

          {/* DRAFT PICKER */}
          {showDraftPicker && (
            <DraftPicker
              setSubject={setSubject}
              setBody={(html) => {
                editor?.commands.setContent(html);
              }}
              setShowDraftPicker={setShowDraftPicker}
              addFiles={addDraftFiles}
              setDraftId={setDraftId}
            />
          )}

          {/* EDITOR */}
          <div className="border rounded overflow-hidden">
            <div className="flex gap-1 p-2 bg-slate-50 border-b">
              <button
                onClick={() =>
                  editor?.chain().focus().toggleBold().run()
                }
                className="px-2 py-1 bg-white rounded"
              >
                B
              </button>

              <button
                onClick={() =>
                  editor?.chain().focus().toggleItalic().run()
                }
                className="px-2 py-1 bg-white rounded"
              >
                I
              </button>
            </div>

            <EditorContent editor={editor} />
          </div>

          {/* CHAR COUNT */}
          <p className="text-right text-xs text-slate-400">
            {editor?.getText().length || 0} chars
          </p>

          {/* ATTACHMENTS */}
          {attachments.map((a) => (
            <div key={a.id} className="flex justify-between">
              <span>{a.name}</span>
              <button onClick={() => removeAttachment(a.id)}>
                <FiTrash2 />
              </button>
            </div>
          ))}
        </div>

        {/* FOOTER */}
        <div className="flex justify-between px-6 py-3 border-t bg-slate-50">
          <span className="text-xs">{lead.to[0]}</span>

          {sentSuccess ? (
            <div className="text-green-600 flex items-center gap-2">
              <FiCheck /> Sent
            </div>
          ) : (
            <button
              onClick={sendFollowUp}
              disabled={!subject.trim() || !editor?.getText().trim()}
              className="bg-indigo-600 text-white px-4 py-2 rounded"
            >
              {sending ? "Sending..." : "Send"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default FollowupModal;