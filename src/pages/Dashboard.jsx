import { useState } from "react";

import { allMessages, sentEmailsData } from "../data/dashboardData";

import AnalyticsCards from "../components/dashboard/AnalyticsCards";
import FollowupQueue from "../components/dashboard/FollowupQueue";
import OutreachTable from "../components/dashboard/OutreachTable";

import EmailDetailModal from "../components/modals/EmailDetailModal";
import FollowupModal from "../components/modals/FollowupModal";

const totalSent = sentEmailsData.length;

const totalReplies = sentEmailsData.filter(
  (m) => m.status === "Replied" || m.replies > 0
).length;

const totalFollowups = sentEmailsData.filter(
  (m) => m.followUps && m.followUps > 0
).length;

const pendingFollowups = sentEmailsData.filter(
  (m) => m.status !== "Replied"
).length;

const scheduledFollowups = sentEmailsData.filter(
  (m) => m.followUps && m.followUps > 0
).length;

const Dashboard = () => {
  const [viewMail, setViewMail] = useState(null);
  const [followupLead, setFollowupLead] = useState(null);

  const recentOutreachPreview = allMessages.slice(0, 10);

  return (
    <div className="flex flex-col gap-4 h-full min-h-0 font-sans">

      {/* Analytics Cards */}
      <AnalyticsCards
        totalSent={totalSent}
        totalReplies={totalReplies}
        totalFollowups={totalFollowups}
        pendingFollowups={pendingFollowups}
        scheduledFollowups={scheduledFollowups}
      />

      {/* Main Grid */}
      <div className="grid grid-cols-[280px_1fr] gap-3 flex-1 min-h-0">

        {/* Followups Queue */}
        <FollowupQueue openFollowupModal={setFollowupLead} />

        {/* Outreach Table */}
        <OutreachTable
          recentOutreachPreview={recentOutreachPreview}
          setViewMail={setViewMail}
        />
      </div>

      {/* Email Details Modal */}
      {viewMail && (
        <EmailDetailModal
          viewMail={viewMail}
          setViewMail={setViewMail}
        />
      )}

      {/* Followup Modal */}
      {followupLead && (
        <FollowupModal
          lead={followupLead}
          onClose={() => setFollowupLead(null)}
        />
      )}

    </div>
  );
};

export default Dashboard;