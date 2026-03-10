import { FiSearch, FiCheck } from "react-icons/fi";
import FilterTabs from "./FilterTabs";
import FollowUpRow from "./FollowUpRow";

const FollowUpQueue = ({
  filter,
  setFilter,
  counts,
  search,
  setSearch,
  visible,
  openCompose,
  snooze,
  dismiss,
  setQueue,
}) => {
  return (
    <div className="fade-up d1 bg-white rounded-[14px] border border-slate-100 overflow-hidden shadow-sm">

      {/* Toolbar */}
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-100 gap-3">

        <FilterTabs
          filter={filter}
          setFilter={setFilter}
          counts={counts}
        />

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

      {/* Empty state */}
      {visible.length === 0 && (
        <div className="py-14 flex flex-col items-center gap-2 text-center">
          <div className="w-13 h-13 rounded-xl bg-slate-100 flex items-center justify-center text-slate-400">
            <FiCheck size={22} />
          </div>

          <p className="text-sm font-semibold text-slate-400">
            All clear!
          </p>

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
    </div>
  );
};

export default FollowUpQueue;