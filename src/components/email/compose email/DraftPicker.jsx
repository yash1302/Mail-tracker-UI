import { FiEdit3 } from "react-icons/fi";
import { useContext, useEffect, useState } from "react";
import { getDraftsApi } from "../../../utils/api.utils";
import { userContext } from "../../../context/ContextProvider";

const DraftPicker = ({
  setSubject,
  setBody,
  setShowDraftPicker,
  addFiles,
  setDraftId,
}) => {
  const [drafts, setDrafts] = useState([]);

  const { accounts } = useContext(userContext);

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
        body: d.textBody,
        attachments: d.attachments || [],
      }));

      setDrafts(formatted);
    } catch (err) {
      console.error("Fetch drafts error:", err);
    }
  };

  useEffect(() => {
    const init = async () => {
      if (accounts?.length) {
        await fetchDrafts();
      }
    };
    init();
  }, [accounts]);

  return (
    <div className="px-[22px] py-[14px] bg-[#f8faff] border-b border-slate-200">
      <p className="text-[10.5px] font-bold text-slate-400 uppercase tracking-[0.05em] mb-[9px]">
        Choose a saved draft
      </p>

      <div className="flex flex-col gap-[7px]">
        {drafts.map((d, i) => (
          <button
            key={i}
            onClick={() => {
              setSubject(d.subject);
              setBody(d.body);
              setShowDraftPicker(false);
              addFiles(d.attachments);
              setDraftId(d.id);
            }}
            className="flex items-start gap-[10px] bg-white border border-slate-200 rounded-[10px] px-[13px] py-[10px] hover:border-indigo-500 hover:bg-indigo-50 transition"
          >
            <div className="w-[28px] h-[28px] rounded-[8px] bg-indigo-50 text-indigo-500 flex items-center justify-center">
              <FiEdit3 size={12} />
            </div>

            <div className="min-w-0">
              <p className="text-[13px] font-semibold text-slate-900 truncate">
                {d.subject}
              </p>

              <p className="text-[11.5px] text-slate-400 truncate">
                {d.body.replace(/\n/g, " ").slice(0, 70)}…
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default DraftPicker;
