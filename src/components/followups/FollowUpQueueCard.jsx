import { FiClock } from "react-icons/fi";

const FollowUpQueueCard = ({ counts, FOLLOWUP_THRESHOLD_DAYS }) => {
  const stats = [
    { label: "Pending", val: counts?.Pending, color: "text-yellow-200" },
    { label: "Sent", val: counts?.Sent, color: "text-emerald-200" },
    { label: "Snoozed", val: counts?.Snoozed, color: "text-sky-200" },
  ];

  return (
    <div className="fade-up d0 bg-gradient-to-br from-indigo-500 to-indigo-400 rounded-[14px] px-[22px] py-[18px] flex items-center justify-between shadow-[0_4px_16px_rgba(99,102,241,0.25)]">
      
      {/* Left Section */}
      <div className="flex items-center gap-[14px]">
        
        {/* Icon */}
        <div className="w-[44px] h-[44px] rounded-[13px] bg-white/20 flex items-center justify-center">
          <FiClock size={20} className="text-white" />
        </div>

        {/* Text */}
        <div>
          <h2 className="text-[15px] font-bold text-white mb-[3px]">
            Follow-up Queue
          </h2>
          <p className="text-[12.5px] text-white/75">
            Emails sent {FOLLOWUP_THRESHOLD_DAYS}+ days ago with no reply — time
            to nudge
          </p>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex gap-[16px] text-center">
        {stats.map((s, i) => (
          <div key={i}>
            <div className={`mono text-[22px] font-bold leading-none ${s.color}`}>
              {s.val}
            </div>
            <div className="text-[11px] text-white/70 mt-[2px]">
              {s.label}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default FollowUpQueueCard;