const FilterTabs = ({ filter, setFilter, counts }) => {
  const tabs = ["Pending", "Sent", "Snoozed", "All"];

  return (
    <div className="flex gap-[2px] bg-slate-50 rounded-lg p-[3px]">
      {tabs.map((f) => (
        <button
          key={f}
          onClick={() => setFilter(f)}
          className={`flex items-center gap-1 px-3 py-1 text-xs font-semibold rounded-md transition
          ${
            filter === f
              ? "bg-white text-indigo-500 shadow"
              : "text-slate-400"
          }`}
        >
          {f}

          <span
            className={`text-[10px] font-bold px-1.5 py-[1px] rounded-full
            ${
              filter === f
                ? "bg-indigo-50 text-indigo-500"
                : "bg-slate-200 text-slate-400"
            }`}
          >
            {counts?.[f] ?? 0}
          </span>
        </button>
      ))}
    </div>
  );
};

export default FilterTabs;