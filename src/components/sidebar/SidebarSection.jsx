const SidebarSection = ({ title, children }) => {

  return (
    <div className="flex-1 px-3 py-3 space-y-1 overflow-y-auto">

      <p className="text-[10px] text-slate-500 uppercase tracking-wider px-2 mb-2">
        {title}
      </p>

      {children}

    </div>
  );

};

export default SidebarSection;