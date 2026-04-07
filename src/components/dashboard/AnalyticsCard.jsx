import Sparkbar from "./Sparkbar.jsx";

const AnalyticsCard = ({ title, Icon, color, bg, stats, index }) => {
  return (
    <div
      className={`relative bg-white rounded-[14px] border border-slate-100 p-[14px] shadow-sm overflow-hidden fade-up d${index}`}
    >
      {/* radial highlight */}
      <div
        className="absolute top-0 right-0 w-[60px] h-[60px]"
        style={{
          background: `radial-gradient(circle at top right,${color}12,transparent 70%)`,
          borderRadius: "0 14px 0 0",
        }}
      />

      {/* header */}
      <div className="flex items-center justify-between mb-[10px]">
        <div className="flex items-center gap-[7px]">
          <div
            className="w-[28px] h-[28px] rounded-[8px] flex items-center justify-center shrink-0"
            style={{ background: bg, color }}
          >
            <Icon size={13} />
          </div>
          <span className="text-[12px] font-semibold text-gray-700 leading-tight">
            {title}
          </span>
        </div>
        <Sparkbar color={color} />
      </div>

      {/* stats — fixed height boxes so values always align */}
      <div className="grid grid-cols-2 gap-[6px]">
        {stats.map((stat, i) => (
          <div
            key={i}
            className="bg-[#fafafa] border border-slate-100 rounded-[8px] px-[9px] py-[8px] flex flex-col justify-between min-h-[58px]"
          >
            <p className="text-[10px] text-slate-400 font-medium leading-tight line-clamp-2">
              {stat.label}
            </p>
            <span className="text-[20px] font-bold text-slate-900 leading-none font-mono mt-[4px]">
              {stat.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnalyticsCard;
