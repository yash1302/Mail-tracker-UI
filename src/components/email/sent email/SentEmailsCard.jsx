import { useCallback, useContext, useEffect, useState } from "react";
import OutreachTable from "../../common/OutreachTable.jsx";
import SentEmailsHeader from "./SentEmailsHeader.jsx";
import EmailDetailModal from "../../modals/EmailDetailModal.jsx";
import { toast } from "react-toastify";
import { getSentEmails } from "../../../utils/api.utils.js";
import { userContext } from "../../../context/userContext.js";

const SentEmailsCard = ({ setTab }) => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [viewEmail, setViewEmail] = useState(null);
  const [emails, setEmails] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // ← added

  const { accounts } = useContext(userContext);

  const handleGetSentEmails = useCallback(async () => {
    setIsLoading(true); // ← start
    try {
      const result = await getSentEmails(
        accounts[0].gmailAccountId,
        accounts[0].id,
      );
      setEmails(result.data);
    } catch (_error) {
      console.error(_error);
      toast.error("Failed to fetch sent emails. Please try again.");
    } finally {
      setIsLoading(false); // ← always stop
    }
  }, [accounts]);

  useEffect(() => {
    const init = async () => {
      if (accounts?.length) {
        await handleGetSentEmails();
      }
    };
    init();
  }, [accounts, handleGetSentEmails]);

  const filtered = emails.filter((thread) => {
    const q = search.toLowerCase();

    const lastMessage = thread.messages?.[thread.messages.length - 1] || {};

    const toEmails = (lastMessage.to || []).join(", ").toLowerCase();

    return (
      (statusFilter === "All" ||
        (lastMessage.isReplied ? "Replied" : "Sent") === statusFilter) &&
      (toEmails.includes(q) ||
        (lastMessage.subject || "").toLowerCase().includes(q))
    );
  });

  const formattedEmails = filtered.map((thread) => {

    const messages = thread.messages || [];
    const lastMessage = messages[messages.length - 1] || {};

    const email = (lastMessage.to || [])[0] || "";

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
      status: thread.isReplied ? "Replied" : "Sent",
      date: new Date(thread.lastActivityAt).toLocaleDateString(),
      openCount: lastMessage.opensCount || 0,
      clicksCount: thread.totalClicks || 0,
      messages: messages,
      followUpCount: messages.filter((m) => m.type === "followup").length,
      replies: thread.replies,
      isReplied: messages.some((m) => m.type === "reply"),
    };
  });

  return (
    <div className="animate-fadeUp bg-white rounded-[14px] border border-slate-100 overflow-hidden flex flex-col h-full shadow-sm">
      <SentEmailsHeader
        filtered={filtered}
        search={search}
        setSearch={setSearch}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        setTab={setTab}
        isLoading={isLoading} // ← passed down
      />

      <div className="flex-1 overflow-y-hidden">
        <OutreachTable
          recentOutreachPreview={formattedEmails}
          setViewMail={setViewEmail}
          isLoading={isLoading} // ← passed down
        />
      </div>

      {viewEmail && (
        <EmailDetailModal
          viewMail={viewEmail}
          setViewMail={setViewEmail}
          handleGetSentEmails={handleGetSentEmails}
        />
      )}
    </div>
  );
};

export default SentEmailsCard;
