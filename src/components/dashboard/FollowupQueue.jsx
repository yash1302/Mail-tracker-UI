import { sentEmailsData } from "../../data/dashboardData";
import { useNavigate } from "react-router-dom";

const FollowupQueue = ({ openFollowupModal }) => {
  const navigate = useNavigate();

  const leads = sentEmailsData
    .filter((m) => m.status !== "Replied")
    .slice(0, 5);

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

        {leads.map((lead, i) => (
          <div
            key={i}
            className="flex flex-col gap-[6px] py-[10px] border-b border-slate-50"
          >

            {/* Lead Info */}
            <div className="flex items-start justify-between gap-2">

              <div className="min-w-0">
                
                <p className="text-[12px] font-semibold text-slate-900 truncate">
                  {lead.name ?? lead.email.split("@")[0]}
                </p>

                <p className="text-[10.5px] text-slate-400 truncate">
                  {lead.email}
                </p>

              </div>

              <span className="text-[10px] text-slate-400 whitespace-nowrap mt-[2px]">
                <span className="font-bold">Sent</span> : {lead.date}
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