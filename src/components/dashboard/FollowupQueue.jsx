import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getFollowUpsApi } from "../../utils/api.utils";
import { userContext } from "../../context/ContextProvider";

const SkeletonRow = () => (
  <div className="flex flex-col gap-[6px] py-[10px] border-b border-slate-50 animate-pulse">
    <div className="flex items-start justify-between gap-2">
      <div className="flex flex-col gap-[5px] flex-1">
        <div className="h-[12px] w-[100px] bg-slate-200 rounded" />
        <div className="h-[10px] w-[140px] bg-slate-100 rounded" />
      </div>
      <div className="h-[10px] w-[60px] bg-slate-100 rounded" />
    </div>
    <div className="h-[26px] w-full bg-slate-100 rounded-md" />
  </div>
);

const FollowupQueue = ({ openFollowupModal }) => {
  const navigate = useNavigate();
  const { accounts } = useContext(userContext);
  const [leads, setLeads] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchFollowUps = async () => {
    if (!accounts?.length) return;
    setIsLoading(true);
    try {
      const data = await getFollowUpsApi(
        accounts[0]?.id,
        accounts[0]?.gmailAccountId,
      );
      const all = data?.data?.data || [];
      // only show non-replied, max 5
      const filtered = all
        .filter((m) => m.status !== "Replied")
        .slice(0, 5);
      setLeads(filtered);
    } catch (error) {
      console.error("Error fetching follow-ups:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFollowUps();
  }, [accounts]);

  return (
    <div className="bg-white rounded-[14px] border border-slate-100 shadow-sm flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-4 py-[14px] border-b border-slate-100 flex items-center justify-between">
        <h2 className="text-[13px] font-bold text-slate-900">
          Followups Needed
        </h2>
        <button
          onClick={() => navigate("/followups")}
          className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-700"
        >
          View all →
        </button>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto px-3 py-2">
        {/* Skeleton */}
        {isLoading &&
          Array.from({ length: 5 }).map((_, i) => <SkeletonRow key={i} />)}

        {/* Empty state */}
        {!isLoading && leads.length === 0 && (
          <div className="py-8 text-center">
            <p className="text-[12px] font-semibold text-slate-400">All clear!</p>
            <p className="text-[11px] text-slate-300 mt-1">No follow-ups needed right now.</p>
          </div>
        )}

        {/* Rows */}
        {!isLoading &&
          leads.map((lead, i) => (
            <div
              key={i}
              className="flex flex-col gap-[6px] py-[10px] border-b border-slate-50"
            >
              {/* Lead Info */}
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-[12px] font-semibold text-slate-900 truncate">
                    {lead.name ?? (lead.to?.[0] || lead.email || "").split("@")[0]}
                  </p>
                  <p className="text-[10.5px] text-slate-400 truncate">
                    {lead.to?.[0] || lead.email}
                  </p>
                </div>
                <span className="text-[10px] text-slate-400 whitespace-nowrap mt-[2px]">
                  <span className="font-bold">Sent</span> :{" "}
                  {lead.sentAt
                    ? new Date(lead.sentAt).toLocaleDateString()
                    : lead.date}
                </span>
              </div>

              {/* Button */}
              <button
                onClick={() => openFollowupModal(lead)}
                className="w-full text-[11px] font-bold rounded-md py-[5px] border border-indigo-200 bg-indigo-50 text-indigo-600 transition hover:bg-indigo-600 hover:text-white"
              >
                Send Followup →
              </button>
            </div>
          ))}
      </div>
    </div>
  );
};

export default FollowupQueue;