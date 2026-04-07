import { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AnalyticsCards from "../components/dashboard/AnalyticsCards.jsx";
import FollowupQueue from "../components/dashboard/FollowupQueue.jsx";
import OutreachTable from "../components/common/OutreachTable.jsx";
import EmailDetailModal from "../components/modals/EmailDetailModal.jsx";
import FollowupModal from "../components/modals/FollowupModal.jsx";
import {
  getSentEmails,
  getDashboardKPI,
  checkRepliesApi,
} from "../utils/api.utils.js";
import { userContext } from "../context/userContext.js";
import { toast } from "react-toastify";

const Dashboard = () => {
  const navigate = useNavigate();
  const { accounts } = useContext(userContext);

  const [viewMail, setViewMail] = useState(null);
  const [followupLead, setFollowupLead] = useState(null);
  const [emails, setEmails] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [kpi, setKpi] = useState({
    totalSent: 0,
    totalReplied: 0,
    replyRate: 0,
    totalClicked: 0,
    clickRate: 0,
    interestedLeads: 0,
    noResponse: 0,
    uniqueFollowedUp: 0,
    followupNeeded: 0,
    totalDrafts: 0,
  });

  const handleGetKpi = useCallback(async () => {
    if (!accounts?.length) return;
    try {
      const result = await getDashboardKPI(
        accounts[0].id,
        accounts[0].gmailAccountId,
      );
      setKpi(result.data.data);
    } catch (_error) {
      console.error("Failed to fetch KPI:", _error);
    }
  }, [accounts]);

  const handleGetSentEmails = useCallback(async () => {
    if (!accounts?.length) return;
    setIsLoading(true);
    try {
      const result = await getSentEmails(
        accounts[0].gmailAccountId,
        accounts[0].id,
      );
      setEmails(result.data || []);
    } catch (_error) {
      console.error(_error);
      toast.error("Failed to fetch recent outreach.");
    } finally {
      setIsLoading(false);
    }
  }, [accounts]);

  const refreshAll = useCallback(async () => {
    await Promise.all([handleGetKpi(), handleGetSentEmails()]);
  }, [handleGetKpi, handleGetSentEmails]);

  // ← Check replies button handler (same as FollowUpQueue)
  const handleCheckReplies = async () => {
    if (!accounts?.length) return;
    setIsRefreshing(true);
    try {
      await checkRepliesApi({
        userId: accounts[0].id,
        gmailAccountId: accounts[0].gmailAccountId,
      });
      toast.success("Checked for new replies! Updating dashboard...");
      await refreshAll();
    } catch (_error) {
      console.error(_error);
      toast.error("Failed to check replies. Please try again.");
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (accounts?.length) refreshAll();
  }, [accounts, refreshAll]);

  const recentOutreachPreview = emails.slice(0, 10).map((m) => {
    const email = (m.to || [])[0] || "";
    const name = email
      .split("@")[0]
      .replace(/[._]/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
    return {
      ...m,
      name,
      email,
      message: m.preview || m.subject,
      date: new Date(m.sentAt).toLocaleDateString(),
    };
  });

  return (
    <div className="flex flex-col gap-4 h-full min-h-0 font-sans">
      {/* KPI Cards + Refresh button */}
      <AnalyticsCards
        kpi={kpi}
        onRefresh={handleCheckReplies}
        isRefreshing={isRefreshing}
      />

      <div className="grid grid-cols-[280px_1fr] gap-3 flex-1 min-h-0">
        <FollowupQueue openFollowupModal={setFollowupLead} />

        <div className="bg-white rounded-[14px] border border-slate-100 shadow-sm flex flex-col overflow-hidden">
          <div className="flex items-center justify-between px-[18px] py-[14px] border-b border-slate-100 shrink-0">
            <h2 className="text-[13px] font-bold text-slate-900">
              Recent Outreach
            </h2>
            <button
              onClick={() => navigate("/send_mail")}
              className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-700"
            >
              View all →
            </button>
          </div>
          <OutreachTable
            recentOutreachPreview={recentOutreachPreview}
            setViewMail={setViewMail}
            isLoading={isLoading}
          />
        </div>
      </div>

      {viewMail && (
        <EmailDetailModal
          viewMail={viewMail}
          setViewMail={setViewMail}
          handleGetSentEmails={refreshAll}
        />
      )}

      {followupLead && (
        <FollowupModal
          lead={followupLead}
          onClose={() => {
            setFollowupLead(null);
            refreshAll();
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;
