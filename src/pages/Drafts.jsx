import { useCallback, useContext, useEffect, useState } from "react";
import { FiPaperclip, FiPlus, FiTrash2, FiRefreshCw } from "react-icons/fi";
import DraftModal from "../components/drafts/DraftModal.jsx";
import {
  createDraftApi,
  getDraftsApi,
  updateDraftApi,
  deleteDraftApi,
} from "../utils/api.utils.js";
import { userContext } from "../context/userContext.js";
import { convertToHtml } from "../utils/fileUtils.js";
import { toast } from "react-toastify";

const SkeletonRow = () => (
  <tr className="border-b border-slate-50 animate-pulse">
    <td className="px-[18px] py-[14px]">
      <div className="h-[22px] w-[70px] bg-slate-200 rounded-full" />
    </td>
    <td className="px-[18px] py-[14px]">
      <div className="h-[13px] w-[140px] bg-slate-200 rounded" />
    </td>
    <td className="px-[18px] py-[14px]">
      <div className="h-[13px] w-[220px] bg-slate-100 rounded" />
    </td>
    <td className="px-[18px] py-[14px]">
      <div className="h-[22px] w-[60px] bg-slate-100 rounded-full" />
    </td>
    <td className="px-[18px] py-[14px]">
      <div className="h-[28px] w-[28px] bg-slate-100 rounded-md" />
    </td>
  </tr>
);

const Drafts = () => {
  const [drafts, setDrafts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false); // ← added
  const [deletingId, setDeletingId] = useState(null);

  const [modal, setModal] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [editIdx, setEditIdx] = useState(null);
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [attachments, setAttachments] = useState([]);
  const [title, setTitle] = useState("");

  const { accounts } = useContext(userContext);

  const reset = () => {
    setTitle("");
    setSubject("");
    setBody("");
    setAttachments([]);
    setEditIdx(null);
    setModalMode("create");
  };

  const close = () => {
    setModal(false);
    reset();
  };

  const openRow = (row) => {
    setTitle(row.title || "");
    setSubject(row.subject);
    setBody(row.body);
    setAttachments(row.attachments || []);
    setEditIdx(row.id);
    setModalMode("view");
    setModal(true);
  };

  const save = async () => {
    if (!subject.trim() && !body.trim()) return;
    setIsSaving(true); // ← start
    try {
      const formData = new FormData();
      const htmlBody = document.querySelector("[contenteditable]")?.innerHTML;
      formData.append("title", title);
      formData.append("subject", subject);
      formData.append("body", htmlBody);
      formData.append("gmailAccountId", accounts[0].gmailAccountId);
      formData.append("userId", accounts[0].id);

      const existing = attachments.filter((a) => !(a instanceof File));
      const newFiles = attachments.filter((a) => a instanceof File);

      if (modalMode === "edit") {
        formData.append(
          "existingAttachments",
          JSON.stringify(existing.map((a) => ({ _id: a._id }))),
        );
      }
      newFiles.forEach((file) => formData.append("files", file));

      if (modalMode === "edit") {
        await updateDraftApi(editIdx, formData);
      } else {
        await createDraftApi(formData);
      }

      await fetchDrafts();
      close();
    } catch (err) {
      console.error("Draft save error:", err);
      toast.error("Failed to save draft.");
    } finally {
      setIsSaving(false); // ← always stop
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    setDeletingId(id);
    try {
      await deleteDraftApi(id);
      setDrafts((d) => d.filter((x) => x.id !== id));
      toast.success("Draft deleted.");
    } catch (err) {
      console.error("Delete draft error:", err);
      toast.error("Failed to delete draft.");
    } finally {
      setDeletingId(null);
    }
  };

  const fetchDrafts = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await getDraftsApi({
        userId: accounts[0].id,
        gmailAccountId: accounts[0].gmailAccountId,
      });
      const formatted = res.data.map((d) => ({
        id: d.id,
        title: d.title,
        subject: d.subject,
        body: d.htmlBody,
        attachments: d.attachments || [],
      }));
      setDrafts(formatted);
    } catch (err) {
      console.error("Fetch drafts error:", err);
      toast.error("Failed to fetch drafts.");
    } finally {
      setIsLoading(false);
    }
  }, [accounts]);

  useEffect(() => {
    if (accounts?.length) fetchDrafts();
  }, [accounts, fetchDrafts]);

  const getPreviewText = (html) => {
    return html
      .replace(/&nbsp;/gi, " ")
      .replace(/<style[^>]*>.*?<\/style>/gi, "")
      .replace(/<script[^>]*>.*?<\/script>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Header */}
      <div className="flex justify-end">
        <button
          onClick={() => {
            reset();
            setModal(true);
          }}
          className="flex items-center gap-[7px] px-[16px] py-[8px] rounded-[10px] text-[13px] font-semibold bg-indigo-500 text-white hover:bg-indigo-600 transition hover:-translate-y-[1px] hover:shadow-[0_4px_12px_rgba(99,102,241,0.35)]"
        >
          <FiPlus size={14} />
          Create Draft
        </button>
      </div>

      <div className="bg-white rounded-[14px] border border-slate-100 overflow-hidden shadow-sm flex flex-col flex-1 min-h-0">
        <div className="overflow-y-auto flex-1">
          <table className="w-full text-[13px] border-collapse">
            <thead className="sticky top-0 z-[1]">
              <tr className="bg-[#fafafa] border-b border-slate-100">
                {["Title", "Subject", "Body Preview", "Attachments", ""].map(
                  (h) => (
                    <th
                      key={h}
                      className="text-left px-[18px] py-[10px] text-[10.5px] font-bold text-slate-400 uppercase tracking-[0.05em]"
                    >
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>

            <tbody>
              {isLoading &&
                Array.from({ length: 5 }).map((_, i) => (
                  <SkeletonRow key={i} />
                ))}

              {!isLoading && drafts.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="py-[40px] text-center text-slate-300 text-[13px]"
                  >
                    No drafts yet. Create your first one.
                  </td>
                </tr>
              )}

              {!isLoading &&
                drafts.map((row) => (
                  <tr
                    key={row.id}
                    onClick={() => openRow(row)}
                    className="border-b border-slate-50 cursor-pointer hover:bg-[#f8f9ff] transition"
                  >
                    <td className="px-[18px] py-[14px]">
                      <span className="bg-indigo-50 text-indigo-500 px-[10px] py-[3px] rounded-full text-[11px] font-semibold">
                        {row.title || "General"}
                      </span>
                    </td>
                    <td className="px-[18px] py-[14px] font-semibold text-slate-900">
                      {row.subject}
                    </td>
                    <td className="px-[18px] py-[14px] text-slate-500 max-w-[280px]">
                      <span className="block truncate max-w-[260px]">
                        {getPreviewText(row.body)}
                      </span>
                    </td>
                    <td className="px-[18px] py-[14px]">
                      {row.attachments?.length > 0 ? (
                        <span className="inline-flex items-center gap-[5px] bg-indigo-50 text-indigo-500 px-[9px] py-[3px] rounded-full text-[11px] font-semibold">
                          <FiPaperclip size={11} />
                          {row.attachments.length} file
                          {row.attachments.length > 1 ? "s" : ""}
                        </span>
                      ) : (
                        <span className="text-slate-200 text-[12px]">—</span>
                      )}
                    </td>
                    <td className="px-[18px] py-[14px]">
                      <button
                        onClick={(e) => handleDelete(e, row.id)}
                        disabled={deletingId === row.id}
                        className="flex items-center justify-center w-[28px] h-[28px] rounded-md text-slate-400 hover:text-red-500 hover:bg-red-50 transition disabled:opacity-50 disabled:pointer-events-none"
                      >
                        {deletingId === row.id ? (
                          <FiRefreshCw
                            size={13}
                            className="animate-spin text-slate-400"
                          />
                        ) : (
                          <FiTrash2 size={14} />
                        )}
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <DraftModal
          modalMode={modalMode}
          title={title}
          subject={subject}
          body={body}
          attachments={attachments}
          setTitle={setTitle}
          setSubject={setSubject}
          setBody={setBody}
          setAttachments={setAttachments}
          close={close}
          save={save}
          setModalMode={setModalMode}
          isSaving={isSaving} // ← passed down
        />
      )}
    </div>
  );
};

export default Drafts;
