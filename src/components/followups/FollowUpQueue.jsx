import { FiSearch, FiCheck, FiRefreshCw } from "react-icons/fi";
import FilterTabs from "./FilterTabs";
import FollowUpRow from "./FollowUpRow";
import { useContext, useState } from "react";
import FollowupModal from "../modals/FollowupModal";
import { toast } from "react-toastify";
import { checkRepliesApi } from "../../utils/api.utils";
import { userContext } from "../../context/ContextProvider";

const FollowUpQueue = ({ counts, queue, setQueue, handlegetFollowUpsApi }) => {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [activeModal, setActiveModal] = useState(null);
  const { accounts } = useContext(userContext);

  const dismiss = (id) =>
    setQueue((q) =>
      q.map((x) => (x.id === id ? { ...x, followUpStatus: "Dismissed" } : x)),
    );
  const snooze = (id) =>
    setQueue((q) =>
      q.map((x) => (x.id === id ? { ...x, followUpStatus: "Snoozed" } : x)),
    );

  const openCompose = (row) => {
    setActiveModal(row);
  };

  const visible = queue.filter((x) => {
    const matchF = filter === "All" || x.status === filter;
    const q = search.toLowerCase();
    return (
      matchF &&
      (x.to[0].toLowerCase().includes(q) ||
        x.email[0].toLowerCase().includes(q) ||
        x.subject[0].toLowerCase().includes(q))
    );
  });

  const handleRefreshReplies = async () => {
    try {
      await checkRepliesApi({
        userId: accounts[0]?.id,
        gmailAccountId: accounts[0]?.gmailAccountId,
      });
      toast.success("Checked for new replies! Updating the queue...");
      handlegetFollowUpsApi();
    } catch (error) {
      toast.error("Failed to refresh replies. Please try again.");
    }
  };
  return (
    <div className="fade-up d1 bg-white rounded-[14px] border border-slate-100 overflow-hidden shadow-sm">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 gap-3">
        <FilterTabs filter={filter} setFilter={setFilter} counts={counts} />
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefreshReplies}
            className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-md border border-indigo-200 text-indigo-600 bg-indigo-50 hover:bg-indigo-100"
          >
            <FiRefreshCw size={12} />
            Refresh
          </button>

          {/* Search */}
          <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-1.5 bg-gray-50">
            <FiSearch size={13} className="text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search…"
              className="bg-transparent outline-none text-[12.5px] text-gray-700 w-40"
            />
          </div>
        </div>
      </div>

      {/* Empty state */}
      {visible.length === 0 && (
        <div className="py-14 flex flex-col items-center gap-2 text-center">
          <div className="w-13 h-13 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
            <FiCheck size={22} />
          </div>

          <p className="text-sm font-semibold text-slate-400">All clear!</p>

          <p className="text-[13px] text-slate-300">
            No follow-ups in this filter. Send more emails to build your queue.
          </p>
        </div>
      )}

      {/* List */}
      {visible.length > 0 && (
        <div className="flex flex-col">
          {visible.map((row, i) => (
            <FollowUpRow
              key={i}
              row={row}
              index={i}
              length={visible.length}
              openCompose={openCompose}
              snooze={snooze}
              dismiss={dismiss}
              setQueue={setQueue}
            />
          ))}
        </div>
      )}
      {activeModal && (
        <FollowupModal
          lead={activeModal}
          onClose={() => setActiveModal(null)}
        />
      )}
    </div>
  );
};

export default FollowUpQueue;
