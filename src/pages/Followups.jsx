import { useState } from "react";
import {
  FiSearch,
  FiFilter,
  FiCalendar,
  FiPlus,
  FiPlay,
  FiPause,
  FiCheck,
  FiSkipForward,
  FiTrash2,
  FiEdit,
  FiX,
  FiUser,
  FiAtSign,
  FiLayers,
  FiType,
  FiList,
  FiZap,
  FiSend,
  FiClock,
  FiEye,
  FiEdit3,
  FiChevronDown,
  FiChevronUp,
  FiRefreshCw,
  FiAlertCircle,
} from "react-icons/fi";
import { followStatusConfig, priorityConfig } from "../utils/statusConfig";
import {
  DRAFT_TEMPLATES,
  followUpData,
  sentEmailsData,
} from "../data/dashboardData";
import FollowupModal from "../components/modals/FollowupModal";
import FollowUpQueueCard from "../components/followups/FollowUpQueueCard";
import FollowUpQueue from "../components/followups/FollowUpQueue";

const DAY_MS = 864e5;
const FOLLOWUP_THRESHOLD_DAYS = 7;

// Derive follow-up candidates from sent data (no replies, sent 7+ days ago, not bounced)
const buildFollowUps = (sentList) =>
  sentList
    .filter(
      (m) =>
        m.replies === 0 && m.status !== "Bounced" && m.status !== "Replied",
    )
    .filter(
      (m) =>
        Date.now() - new Date(m.sentAt).getTime() >=
        FOLLOWUP_THRESHOLD_DAYS * DAY_MS,
    )
    .map((m) => ({
      ...m,
      daysSince: Math.floor(
        (Date.now() - new Date(m.sentAt).getTime()) / DAY_MS,
      ),
      followUpStatus: "Pending", // Pending | Sent | Snoozed | Dismissed
    }));

const Followups = () => {
  const [drafts] = useState(DRAFT_TEMPLATES);
  const [queue, setQueue] = useState(() => buildFollowUps(sentEmailsData));
  const [activeModal, setActiveModal] = useState(null); // row to compose follow-up for
  const [fuSubject, setFuSubject] = useState("");
  const [fuBody, setFuBody] = useState("");
  const [showDraftPicker, setShowDraftPicker] = useState(false);
  const [sending, setSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [filter, setFilter] = useState("Pending"); // Pending | Sent | Snoozed | All
  const [search, setSearch] = useState("");

  const dismiss = (id) =>
    setQueue((q) =>
      q.map((x) => (x.id === id ? { ...x, followUpStatus: "Dismissed" } : x)),
    );
  const snooze = (id) =>
    setQueue((q) =>
      q.map((x) => (x.id === id ? { ...x, followUpStatus: "Snoozed" } : x)),
    );

  const openCompose = (row) => {
    setActiveModal(row);
    setFuSubject("Re: " + row.subject);
    setFuBody(
      `Hi ${row.to.split(" ")[0]},\n\nI just wanted to follow up on my email from ${row.daysSince} days ago. Has there been any progress on your end?\n\nHappy to answer any questions or hop on a quick call.\n\nBest,`,
    );
    setShowDraftPicker(false);
    setSentSuccess(false);
  };

  const sendFollowUp = () => {
    if (!fuSubject.trim() || !fuBody.trim()) return;
    setSending(true);
    setTimeout(() => {
      setQueue((q) =>
        q.map((x) =>
          x.id === activeModal.id ? { ...x, followUpStatus: "Sent" } : x,
        ),
      );
      setSending(false);
      setSentSuccess(true);
      setTimeout(() => {
        setActiveModal(null);
        setSentSuccess(false);
      }, 1600);
    }, 1200);
  };

  const counts = {
    Pending: queue.filter((x) => x.followUpStatus === "Pending").length,
    Sent: queue.filter((x) => x.followUpStatus === "Sent").length,
    Snoozed: queue.filter((x) => x.followUpStatus === "Snoozed").length,
    All: queue.length,
  };

  const visible = queue.filter((x) => {
    const matchF = filter === "All" || x.followUpStatus === filter;
    const q = search.toLowerCase();
    return (
      matchF &&
      (x.to.toLowerCase().includes(q) ||
        x.email.toLowerCase().includes(q) ||
        x.subject.toLowerCase().includes(q))
    );
  });

  const fld = {
    border: "1px solid #e2e8f0",
    borderRadius: 10,
    padding: "9px 12px",
    width: "100%",
    fontSize: 13,
    color: "#374151",
    outline: "none",
    fontFamily: "DM Sans,sans-serif",
    background: "#fff",
    transition: "border-color 0.15s",
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* ── BANNER ── */}
      <FollowUpQueueCard
        counts={counts}
        FOLLOWUP_THRESHOLD_DAYS={FOLLOWUP_THRESHOLD_DAYS}
      />

      {/* ── QUEUE ── */}
      <FollowUpQueue
        visible={visible}
        filter={filter}
        setFilter={setFilter}
        search={search}
        setSearch={setSearch}
        openCompose={openCompose}
        snooze={snooze}
        dismiss={dismiss}
        setQueue={setQueue}
      />

      {/* ── COMPOSE FOLLOW-UP MODAL ── */}
      {activeModal && (
        <FollowupModal
          lead={activeModal}
          onClose={() => setActiveModal(null)}
        />
      )}
    </div>
  );
};

export default Followups;
