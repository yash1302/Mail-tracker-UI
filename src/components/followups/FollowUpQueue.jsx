import { FiSearch, FiCheck, FiRefreshCw } from "react-icons/fi";
import FilterTabs from "./FilterTabs.jsx";
import FollowUpRow from "./FollowUpRow.jsx";
import { useContext, useState } from "react";
import { toast } from "react-toastify";
import { checkRepliesApi } from "../../utils/api.utils.js";
import { userContext } from "../../context/userContext.js";
import EmailDetailModal from "../modals/EmailDetailModal.jsx";

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
  const [isRefreshing, setIsRefreshing] = useState(false);
  const { accounts } = useContext(userContext);
  const [viewMail, setViewMail] = useState(null);
  const [forceCompose, setForceCompose] = useState(false);

  const openCompose = (row) => {
    setViewMail({
      threadId: row.threadId,
      subject: row.subject,
      email: row.to?.[0] || row.email,
      name:
        row.name ??
        (row.to?.[0] || row.email || "")
          .split("@")[0]
          .replace(/[._]/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase()),

      messages: [
        {
          id: row.messageId,
          type: "initial",
          direction: "outgoing",
          subject: row.subject,
          htmlBody: row.htmlBody || "",
          sentAt: row.sentAt || new Date(),
        },
      ],

      status: "Pending", // ✅ FIXED
    });

    setForceCompose(true);
  };

  const visible = queue.filter((x) => {
    const matchF =
      filter === "All" ||
      (filter === "Pending" && x.status === "Pending") ||
      (filter === "Snoozed" &&
        x.status === "Stopped") ||
      (filter === "Completed" && x.status === "Completed");

    const q = search.toLowerCase();

    const email = x.to?.[0] || x.email || "";
    const subject = x.subject || "";

    return (
      matchF &&
      (email.toLowerCase().includes(q) ||
        subject.toLowerCase().includes(q))
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
      toast.error("Failed to refresh replies.");
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
            className="flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-md border border-indigo-200 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 disabled:opacity-50"
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

      {/* Skeleton */}
      {showSkeleton && (
        <div className="flex flex-col">
          {Array.from({ length: 5 }).map((_, i) => (
            <SkeletonRow key={i} />
          ))}
        </div>
      )}

      {/* Empty */}
      {showEmpty && (
        <div className="py-14 flex flex-col items-center gap-2 text-center">
          <div className="w-13 h-13 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
            <FiCheck size={22} />
          </div>
          <p className="text-sm font-semibold text-slate-400">All clear!</p>
          <p className="text-[13px] text-slate-300">
            No follow-ups in this filter.
          </p>
        </div>
      )}

      {/* List */}
      {showList && (
        <div
          className={`flex flex-col relative ${
            isRefreshing ? "opacity-50 pointer-events-none" : ""
          }`}
        >
          {visible.map((row, i) => (
            <FollowUpRow
              key={i}
              row={row}
              index={i}
              length={visible.length}
              openCompose={openCompose}
              setQueue={setQueue}
            />
          ))}
        </div>
      )}

      {/* Modal */}
      {viewMail && (
        <EmailDetailModal
          viewMail={viewMail}
          setViewMail={(val) => {
            setViewMail(val);
            if (!val) setForceCompose(false);
          }}
          forceCompose={forceCompose}
          onFollowupSent={handlegetFollowUpsApi}
        />
      )}
    </div>
  );
};

export default FollowUpQueue;