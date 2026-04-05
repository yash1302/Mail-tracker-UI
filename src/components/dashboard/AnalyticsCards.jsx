import { FiSend, FiRefreshCw, FiMessageSquare, FiTrendingUp, FiEye } from "react-icons/fi";
import AnalyticsCard from "./AnalyticsCard";

const AnalyticsCards = ({ kpi, onRefresh, isRefreshing = false }) => {
  const {
    totalSent = 0,
    totalReplied = 0,
    replyRate = 0,
    totalClicked = 0,
    clickRate = 0,
    interestedLeads = 0,
    noResponse = 0,
    uniqueFollowedUp = 0,
    followupNeeded = 0,
    totalDrafts = 0,
  } = kpi;

  const cardData = [
    {
      title: "Outreach",
      Icon: FiSend,
      color: "#6366f1",
      bg: "#eef2ff",
      stats: [
        { label: "Emails Sent", value: totalSent },
        { label: "Draft Templates", value: totalDrafts },
      ],
    },
    {
      title: "Follow-ups",
      Icon: FiRefreshCw,
      color: "#f59e0b",
      bg: "#fef3c7",
      stats: [
        { label: "Followed Up", value: uniqueFollowedUp },
        { label: "Follow-up Needed", value: followupNeeded },
      ],
    },
    {
      title: "Replies",
      Icon: FiMessageSquare,
      color: "#0ea5e9",
      bg: "#e0f2fe",
      stats: [
        { label: "Replies Received", value: totalReplied },
        { label: "Reply Rate", value: `${replyRate}%` },
      ],
    },
    {
      title: "Interest",
      Icon: FiEye,
      color: "#8b5cf6",
      bg: "#ede9fe",
      stats: [
        { label: "Clicked Links", value: totalClicked },
        { label: "Click Rate", value: `${clickRate}%` },
      ],
    },
    {
      title: "Warm Leads",
      Icon: FiTrendingUp,
      color: "#10b981",
      bg: "#d1fae5",
      stats: [
        { label: "Interested, No Reply", value: interestedLeads },
        { label: "No Response", value: noResponse < 0 ? 0 : noResponse },
      ],
    },
  ];

  return (
    <div className="flex flex-col gap-2 shrink-0">
      {/* Refresh button row */}
      <div className="flex justify-end">
        <button
          onClick={onRefresh}
          disabled={isRefreshing}
          className="flex items-center gap-[6px] px-3 py-1.5 rounded-md border border-indigo-200 text-indigo-600 bg-indigo-50 hover:bg-indigo-100 text-xs font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          <FiRefreshCw size={12} className={isRefreshing ? "animate-spin" : ""} />
          {isRefreshing ? "Checking replies…" : "Check Replies"}
        </button>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-5 gap-3">
        {cardData.map((card, index) => (
          <AnalyticsCard
            key={index}
            index={index}
            title={card.title}
            Icon={card.Icon}
            color={card.color}
            bg={card.bg}
            stats={card.stats}
          />
        ))}
      </div>
    </div>
  );
};

export default AnalyticsCards;