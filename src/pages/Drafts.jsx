import { useContext, useEffect, useState } from "react";
import { FiPaperclip, FiPlus } from "react-icons/fi";
import DraftModal from "../components/drafts/DraftModal";
import { createDraftApi, getDraftsApi, updateDraftApi } from "../utils/api.utils";
import { userContext } from "../context/ContextProvider";
import { convertToHtml } from "../utils/fileUtils";

const Drafts = () => {
  const [drafts, setDrafts] = useState([]);

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

  const openRow = (row, i) => {
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

    try {
      const formData = new FormData();
      const htmlBody = convertToHtml(body);

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

      newFiles.forEach((file) => {
        formData.append("files", file);
      });

      if (modalMode === "edit") {
        await updateDraftApi(editIdx, formData);
      } else {
        await createDraftApi(formData);
      }

      await fetchDrafts();
      close();
    } catch (err) {
      console.error("Draft save error:", err);
    }
  };

  const fetchDrafts = async () => {
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
    }
  };

  useEffect(() => {
    if (accounts?.length) {
      fetchDrafts();
    }
  }, [accounts]);

  return (
    <div className="flex flex-col gap-4">
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

      {/* Table */}
      <div className="bg-white rounded-[14px] border border-slate-100 overflow-hidden shadow-sm">
        <table className="w-full text-[13px] border-collapse">
          {/* Header */}
          <thead>
            <tr className="bg-[#fafafa] border-b border-slate-100">
              {["Title", "Subject", "Body Preview", "Attachments"].map((h) => (
                <th
                  key={h}
                  className="text-left px-[18px] py-[10px] text-[10.5px] font-bold text-slate-400 uppercase tracking-[0.05em]"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody>
            {drafts.length === 0 ? (
              <tr>
                <td
                  colSpan={3}
                  className="py-[40px] text-center text-slate-300 text-[13px]"
                >
                  No drafts yet. Create your first one.
                </td>
              </tr>
            ) : (
              drafts.map((row, i) => (
                <tr
                  key={i}
                  onClick={() => openRow(row, i)}
                  className="border-b border-slate-50 cursor-pointer hover:bg-[#f8f9ff] transition"
                >
                  {/* Title */}
                  <td className="px-[18px] py-[14px]">
                    <span className="bg-indigo-50 text-indigo-500 px-[10px] py-[3px] rounded-full text-[11px] font-semibold">
                      {row.title || "General"}
                    </span>
                  </td>

                  {/* Subject */}
                  <td className="px-[18px] py-[14px] font-semibold text-slate-900">
                    {row.subject}
                  </td>

                  {/* Body */}
                  <td className="px-[18px] py-[14px] text-slate-500 max-w-[280px]">
                    <span
                      className="block truncate max-w-[260px]"
                      dangerouslySetInnerHTML={{ __html: row.body }}
                    />
                  </td>

                  {/* Attachments */}
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
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
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
        />
      )}
    </div>
  );
};

export default Drafts;
