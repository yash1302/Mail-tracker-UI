import { useState } from "react";
import {
  FiClock,
  FiEye,
  FiSend,
  FiPause,
  FiPlay,
  FiCheck,
  FiRefreshCw,
  FiX,
} from "react-icons/fi";
import { updateFollowUpStatusApi } from "../../utils/api.utils.js";
import { toast } from "react-toastify";

const FollowUpRow = ({ row, index, length, openCompose, setQueue }) => {
  const [loadingAction, setLoadingAction] = useState(null);

  const hue = (row.to[0].charCodeAt(0) * 17) % 360;

  const urgency =
    row.daysSince >= 14
      ? "bg-red-500"
      : row.daysSince >= 10
        ? "bg-amber-500"
        : "bg-indigo-500";

  const urgencyText =
    row.daysSince >= 14
      ? "text-red-500"
      : row.daysSince >= 10
        ? "text-amber-500"
        : "text-indigo-500";

  // ✅ NEW STATUS LOGIC
  const fStatus = row.status;
  const isActing = loadingAction !== null;

  const handleAction = async (action) => {
    if (!row.followUpId && !row.id) {
      toast.error("Follow-up ID missing.");
      return;
    }

    setLoadingAction(action);

    // ✅ UPDATED MAP
    const statusMap = {
      snooze: "Stopped",
      dismiss: "Stopped",
      complete: "Completed",
      resume: "Pending",
    };

    const toastMap = {
      snooze: "Follow-up stopped.",
      dismiss: "Follow-up stopped.",
      complete: "Marked as complete.",
      resume: "Follow-up resumed.",
    };

    try {
      await updateFollowUpStatusApi(row.followUpId || row.id, action);

      if (action === "dismiss") {
        setQueue((q) => q.filter((x) => x.id !== row.id));
      } else {
        setQueue((q) =>
          q.map((x) =>
            x.id === row.id ? { ...x, status: statusMap[action] } : x,
          ),
        );
      }

      toast.success(toastMap[action]);
    } catch (_error) {
      console.error(_error);
      toast.error(`Failed to ${action} follow-up.`);
    } finally {
      setLoadingAction(null);
    }
  };

  const ActionBtn = ({ action, icon: Icon, className, title }) => (
    <button
      onClick={() => handleAction(action)}
      disabled={isActing}
      title={title}
      className={`p-1.5 rounded-md border disabled:opacity-40 disabled:cursor-not-allowed transition ${className}`}
    >
      {loadingAction === action ? (
        <FiRefreshCw size={13} className="animate-spin" />
      ) : (
        <Icon size={13} />
      )}
    </button>
  );

  return (
    <div
      className={`flex items-center gap-4 px-5 py-4 transition hover:bg-indigo-50/40 ${
        index < length - 1 ? "border-b border-slate-50" : ""
      } ${["Completed"].includes(fStatus) ? "opacity-50" : ""}`}
    >
      {/* Avatar */}
      <div
        className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0"
        style={{
          background: `hsl(${hue},55%,88%)`,
          color: `hsl(${hue},45%,35%)`,
        }}
      >
        {row.to[0][0]}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <p className="text-[13.5px] font-bold text-slate-900">{row.to}</p>

          {/* ✅ BADGES */}
          {fStatus === "Pending" && (
            <span className="text-[10px] font-bold bg-indigo-100 text-indigo-600 px-2 py-[2px] rounded-full">
              Pending
            </span>
          )}

          {fStatus === "Stopped" && (
            <span className="text-[10px] font-bold bg-yellow-50 text-yellow-600 px-2 py-[2px] rounded-full">
              Stopped ({row.stoppedReason === "REPLIED" ? "Replied" : "Manual"})
            </span>
          )}

          {fStatus === "Completed" && (
            <span className="text-[10px] font-bold bg-green-100 text-green-600 px-2 py-[2px] rounded-full">
              Completed
            </span>
          )}
        </div>

        <p className="text-[12.5px] text-gray-700 font-medium truncate max-w-[400px]">
          {row.subject}
        </p>

        <div className="flex items-center gap-3 text-[11.5px] mt-1">
          <span
            className={`flex items-center gap-1 font-semibold ${urgencyText}`}
          >
            <FiClock size={11} /> {row.daysSince} days since last sent
          </span>
          <span className="flex items-center gap-1 text-slate-400">
            <FiEye size={11} /> {row.opens} open{row.opens !== 1 ? "s" : ""}
          </span>
          <span className="text-slate-300">
            · Original: {row.sentAt?.split("T")[0]}
          </span>
        </div>
      </div>

      {/* Urgency bar */}
      <div className="w-[4px] h-11 rounded-full bg-slate-200 overflow-hidden shrink-0">
        <div
          className={`${urgency} w-full rounded-full`}
          style={{ height: `${Math.min((row.daysSince / 21) * 100, 100)}%` }}
        />
      </div>

      {/* Actions */}
      <div className="flex gap-2 shrink-0">
        {/* ✅ PENDING */}
        {fStatus === "Pending" && (
          <>
            <button
              onClick={() => openCompose(row)}
              disabled={isActing}
              className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-md bg-indigo-500 text-white hover:bg-indigo-600 disabled:opacity-40"
            >
              <FiSend size={12} />
              Send Follow-up
            </button>

            <ActionBtn
              action="snooze"
              icon={FiPause}
              title="Pause follow-up"
              className="border-slate-200 text-slate-400 hover:bg-yellow-100 hover:text-yellow-600"
            />

            <ActionBtn
              action="complete"
              icon={FiCheck}
              title="Mark complete"
              className="border-slate-200 text-slate-400 hover:bg-green-100 hover:text-green-600"
            />
            <ActionBtn
              action="dismiss"
              icon={FiX}
              title="Dismiss follow-up"
              className="border-slate-200 text-slate-400 hover:bg-red-100 hover:border-red-300 hover:text-red-500"
            />
          </>
        )}

        {/* ✅ STOPPED */}
        {fStatus === "Stopped" && (
          <button
            onClick={() => handleAction("resume")}
            disabled={isActing}
            className="flex items-center gap-1 text-xs font-semibold border border-indigo-200 text-indigo-500 px-3 py-1.5 rounded-md hover:bg-indigo-50"
          >
            {loadingAction === "resume" ? (
              <FiRefreshCw size={12} className="animate-spin" />
            ) : (
              <FiPlay size={12} />
            )}
            Resume
          </button>
        )}

        {/* ✅ COMPLETED */}
        {fStatus === "Completed" && (
          <span className="flex items-center gap-1 text-xs text-green-500 font-semibold">
            <FiCheck size={13} /> Completed
          </span>
        )}
      </div>
    </div>
  );
};

export default FollowUpRow;
