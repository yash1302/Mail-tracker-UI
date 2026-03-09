import { FiSend, FiActivity, FiTarget, FiClock } from "react-icons/fi";
import AnalyticsCard from "./AnalyticsCard";

const AnalyticsCards = ({
  totalSent,
  totalReplies,
  totalFollowups,
  pendingFollowups,
  scheduledFollowups,
}) => {
  const cardData = [
    {
      title: "Emails Sent",
      Icon: FiSend,
      color: "#6366f1",
      bg: "#eef2ff",
      stats: [
        { label: "Emails Sent", value: totalSent },
        { label: "Followups Sent", value: totalFollowups },
      ],
    },
    {
      title: "Replies",
      Icon: FiActivity,
      color: "#0ea5e9",
      bg: "#e0f2fe",
      stats: [
        { label: "Replies Received", value: totalReplies },
        { label: "Pending Replies", value: totalSent - totalReplies },
      ],
    },
    {
      title: "Engagement",
      Icon: FiTarget,
      color: "#10b981",
      bg: "#d1fae5",
      stats: [
        {
          label: "Reply Rate",
          value:
            totalSent > 0
              ? Math.round((totalReplies / totalSent) * 100) + "%"
              : "0%",
        },
        {
          label: "Follow-up Rate",
          value:
            totalSent > 0
              ? Math.round((totalFollowups / totalSent) * 100) + "%"
              : "0%",
        },
      ],
    },
    {
      title: "Pending Followups",
      Icon: FiClock,
      color: "#f59e0b",
      bg: "#fef3c7",
      stats: [
        { label: "Followups Needed", value: pendingFollowups },
        { label: "Scheduled", value: scheduledFollowups },
      ],
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-3 shrink-0">
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
  );
};

export default AnalyticsCards;