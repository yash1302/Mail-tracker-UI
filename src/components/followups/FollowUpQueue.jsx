import { FiSearch, FiCheck, FiRefreshCw } from "react-icons/fi";
import FilterTabs from "./FilterTabs";
import FollowUpRow from "./FollowUpRow";
import { useContext, useState } from "react";
import FollowupModal from "../modals/FollowupModal";
import { toast } from "react-toastify";
import { checkRepliesApi } from "../../utils/api.utils";
import { userContext } from "../../context/userContext";

const SkeletonRow = () => (
  <div className="flex items-center gap-4 px-5 py-4 border-b border-slate-100 animate-pulse">
    <div className="w-8 h-8 rounded-full bg-slate-200 shrink-0" />
    <div className="flex-1 flex flex-col gap-2">
      <div className="h-3 bg-slate-200 rounded w-1/4" />
      <div className="h-2.5 bg-slate-100 rounded w-1/2" />
    </div>
    <div className="h-6 w-16 bg-slate-200 rounded-full" />
    <div className="h-7 w-20 bg-slate-100 rounded-md" />
  </div>
);

const FollowUpQueue = ({
  counts,
  queue,
  setQueue,
  handlegetFollowUpsApi,
  isLoadingQueue = false,
}) => {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [activeModal, setActiveModal] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { accounts } = useContext(userContext);

  const openCompose = (row) => setActiveModal(row);

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
    setIsRefreshing(true);
    try {
      await checkRepliesApi({
        userId: accounts[0]?.id,
        gmailAccountId: accounts[0]?.gmailAccountId,
      });
      toast.success("Checked for new replies! Updating the queue...");
      await handlegetFollowUpsApi();
    } catch (_error) {
      console.error(_error);
      toast.error("Failed to refresh replies. Please try again.");
    } finally {
      setIsRefreshing(false);
    }
  };

  const showSkeleton = isLoadingQueue;
  const showEmpty = !isLoadingQueue && visible.length === 0;
  const showList = !isLoadingQueue && visible.length > 0;

  return (
    <div className="fade-up d1 bg-white rounded-[14px] border border-slate-100 overflow-hidden shadow-sm">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 gap-3">
        <FilterTabs filter={filter} setFilter={setFilter} counts={counts} />
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefreshReplies}
            disabled={isRefreshing || isLoadingQueue}
            className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-md border border-indigo-200 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
          >
            <FiRefreshCw
              size={12}
              className={isRefreshing ? "animate-spin" : ""}
            />
            {isRefreshing ? "Checking…" : "Refresh"}
          </button>

          {/* Search */}
          <div className="flex items-center gap-2 border border-slate-200 rounded-lg px-3 py-1.5 bg-gray-50">
            <FiSearch size={13} className="text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search…"
              className="bg-transparent outline-none text-[12.5px] text-gray-700 w-40"
              disabled={isLoadingQueue}
            />
          </div>
        </div>
      </div>

      {/* Skeleton loader — initial queue fetch */}
      {showSkeleton && (
        <div className="flex flex-col">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonRow key={i} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {showEmpty && (
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

      {/* Refresh overlay — subtle dimming over the list while re-checking */}
      {showList && (
        <div
          className={`flex flex-col relative transition-opacity duration-200 ${isRefreshing ? "opacity-50 pointer-events-none" : "opacity-100"}`}
        >
          {isRefreshing && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <div className="flex items-center gap-2 bg-white border border-indigo-100 shadow-md rounded-full px-4 py-2 text-xs font-semibold text-indigo-600">
                <FiRefreshCw size={12} className="animate-spin" />
                Checking for replies…
              </div>
            </div>
          )}
          {visible.map((row, i) => (
            <FollowUpRow
              key={i}
              row={row}
              index={i}
              length={visible.length}
              openCompose={openCompose}
              setQueue={setQueue} // ← only these two action props needed now
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
