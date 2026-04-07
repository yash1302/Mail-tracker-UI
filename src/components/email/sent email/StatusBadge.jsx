const StatusBadge = ({ status, config }) => {

  const sc = config[status] || {
    bg: "#f1f5f9",
    color: "#374151",
    icon: null
  };

  return (
    <span
      className="inline-flex items-center gap-[4px] px-[9px] py-[3px] rounded-full text-[11px] font-semibold"
      style={{ background: sc.bg, color: sc.color }}
    >
      {sc.icon} {status}
    </span>
  );
};

export default StatusBadge;