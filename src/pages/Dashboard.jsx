import { useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AnalyticsCards from "../components/dashboard/AnalyticsCards.jsx";
import FollowupQueue from "../components/dashboard/FollowupQueue.jsx";
import OutreachTable from "../components/common/OutreachTable.jsx";
import EmailDetailModal from "../components/modals/EmailDetailModal.jsx";
import {
  getSentEmails,
  getDashboardKPI,
  checkRepliesApi,
} from "../utils/api.utils.js";
import { userContext } from "../context/userContext.js";
import { toast } from "react-toastify";
import { FaLongArrowAltRight } from "react-icons/fa";
import { DASHBOARD_DEMO_EMAILS, DEMO_KPI } from "../data/demoData.js";
import DemoConversionToast from "../components/Democonversiontoast.jsx";
import DemoWalkthrough from "../components/Demowalkthrough.jsx";
import DemoSignupBanner from "../components/Demosignupbanner.jsx";

const WALKTHROUGH_STEPS = [
  {
    key: "analytics",
    title: "Your outreach analytics",
    desc: "See applications sent, reply rate, and click rate at a glance — updated automatically as you send.",
  },
  {
    key: "followups",
    title: "Auto follow-up queue",
    desc: "No reply after 7 days? It lands here automatically. One click sends the follow-up.",
  },
  {
    key: "outreach",
    title: "Recent outreach",
    desc: "Every application you've sent, with opens, clicks, and reply status — click any row for the full thread.",
  },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { accounts, demoMode } = useContext(userContext);

  const [viewMail, setViewMail] = useState(null);
  const [emails, setEmails] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [followupRefreshKey, setFollowupRefreshKey] = useState(0);
  const [analyticsFilter, setAnalyticsFilter] = useState("7d");
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
  const [forceCompose, setForceCompose] = useState(false);

  // In-demo conversion hook: counts real interactions (row opens, followup
  // clicks, refresh clicks) so the signup card only appears after genuine
  // engagement, not immediately on page load.
  const [interactionCount, setInteractionCount] = useState(0);
  const trackInteraction = () => {
    if (demoMode) setInteractionCount((c) => c + 1);
  };

  const refreshFollowups = () => {
    setFollowupRefreshKey((prev) => prev + 1);
  };

  const handleGetKpi = useCallback(async () => {
    if (demoMode) {
      setKpi(DEMO_KPI);
      return;
    }
    if (!accounts?.length) return;
    try {
      const result = await getDashboardKPI(
        accounts[0].id,
        accounts[0].gmailAccountId,
        analyticsFilter,
      );
      setKpi(result.data.data);
    } catch (_error) {
      console.error("Failed to fetch KPI:", _error);
    }
  }, [accounts, analyticsFilter, demoMode]);

  const handleGetSentEmails = useCallback(async () => {
    if (demoMode) {
      setEmails(DASHBOARD_DEMO_EMAILS);
      setIsLoading(false);
      return;
    }
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
  }, [accounts, demoMode]);

  const refreshAll = useCallback(async () => {
    await Promise.all([handleGetKpi(), handleGetSentEmails()]);
  }, [handleGetKpi, handleGetSentEmails]);

  const handleCheckReplies = async () => {
    trackInteraction();
    if (demoMode) {
      toast.info("Demo mode — reply data is simulated.");
      return;
    }
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
    if (demoMode) {
      setKpi(DEMO_KPI);
      setEmails(DASHBOARD_DEMO_EMAILS);
      setIsLoading(false);
      return;
    }
    if (accounts?.length) {
      refreshAll();
    }
  }, [accounts, demoMode, refreshAll]);

  const formattedEmails = emails.slice(0, 10).map((thread) => {
    const messages = thread.messages || [];
    const lastMessage = messages[messages.length - 1] || {};

    const initialMessage = messages.find(
      (msg) => msg.direction === "outgoing" && msg.type === "initial",
    );

    const email = (initialMessage?.to || [])[0] || "";

    const name = email
      .split("@")[0]
      .replace(/[._]/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());

    return {
      threadId: thread.threadId,
      name,
      email,
      preview: lastMessage.preview || "",
      subject: lastMessage.subject || "",
      status: messages.some((m) => m.type === "reply")
        ? "Replied"
        : lastMessage.direction === "incoming"
          ? "Received"
          : "Sent",
      date: new Date(thread.lastActivityAt).toLocaleDateString(),
      openCount: lastMessage.opensCount || 0,
      clicksCount: thread.totalClicks || 0,
      messages,
      followUpCount: messages.filter((m) => m.type === "followup").length,
      replies: messages.filter((m) => m.direction === "incoming").length,
      isReplied: messages.some((m) => m.direction === "incoming"),
    };
  });

  return (
    <DemoWalkthrough steps={demoMode ? WALKTHROUGH_STEPS : []}>
      {(activeKey, isStepActive) => (
        <div className="flex flex-col gap-4 h-full min-h-0 font-sans">
          {/* {demoMode && <DemoSignupBanner />} */}

          {/* KPI Cards */}
          <div
            className="flex flex-col gap-2 shrink-0 rounded-[14px] transition-all"
            style={
              isStepActive("analytics")
                ? {
                    boxShadow:
                      "0 0 0 3px #818cf8, 0 0 0 6px rgba(129,140,248,0.25)",
                  }
                : undefined
            }
          >
            <AnalyticsCards
              kpi={kpi}
              onRefresh={handleCheckReplies}
              isRefreshing={isRefreshing}
              analyticsFilter={analyticsFilter}
              setAnalyticsFilter={setAnalyticsFilter}
            />
          </div>

          <div className="grid grid-cols-[280px_1fr] gap-3 flex-1 min-h-0">
            <div
              className="rounded-[14px] transition-all"
              style={
                isStepActive("followups")
                  ? {
                      boxShadow:
                        "0 0 0 3px #818cf8, 0 0 0 6px rgba(129,140,248,0.25)",
                    }
                  : undefined
              }
            >
              <FollowupQueue
                refreshKey={followupRefreshKey}
                openFollowupModal={(lead) => {
                  trackInteraction();
                  setViewMail(lead);
                  setForceCompose(true);
                }}
              />
            </div>

            <div
              className="bg-white rounded-[14px] border border-slate-100 shadow-sm flex flex-col overflow-hidden transition-all"
              style={
                isStepActive("outreach")
                  ? {
                      boxShadow:
                        "0 0 0 3px #818cf8, 0 0 0 6px rgba(129,140,248,0.25)",
                    }
                  : undefined
              }
            >
              <div className="flex items-center justify-between px-[18px] py-[14px] border-b border-slate-100 shrink-0">
                <h2 className="text-[13px] font-bold text-slate-900">
                  Recent Outreach
                </h2>
                <button
                  onClick={() => navigate("/send_mail")}
                  className="hover:cursor-pointer flex items-center justify-center gap-[5px] text-[11px] font-semibold text-indigo-600 hover:text-indigo-700"
                >
                  View all
                  <FaLongArrowAltRight />
                </button>
              </div>
              <OutreachTable
                recentOutreachPreview={formattedEmails}
                setViewMail={(row) => {
                  trackInteraction();
                  setViewMail(row);
                }}
                isLoading={isLoading}
              />
            </div>
          </div>

          {viewMail && (
            <EmailDetailModal
              viewMail={viewMail}
              setViewMail={(val) => {
                setViewMail(val);
                if (!val) {
                  setForceCompose(false);
                }
              }}
              handleGetSentEmails={refreshAll}
              forceCompose={forceCompose}
              onFollowupSent={refreshFollowups}
            />
          )}

          {demoMode && (
            <DemoConversionToast
              interactionCount={interactionCount}
              threshold={2}
            />
          )}
        </div>
      )}
    </DemoWalkthrough>
  );
};

export default Dashboard;
