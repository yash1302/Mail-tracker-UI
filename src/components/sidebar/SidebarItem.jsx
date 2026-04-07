const SidebarItem = ({ Icon, label, active, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`
        flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium transition-all
        ${
          active
            ? "bg-indigo-500 text-white shadow"
            : "text-slate-400 hover:bg-white/5 hover:text-slate-200"
        }
      `}
    >
      <Icon size={15} />

      <span className="flex-1 text-left">{label}</span>

      {active && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
    </button>
  );
};

export default SidebarItem;
