import { useContext, useEffect, useState } from "react";
import OutreachTable from "../../common/OutreachTable";
import SentEmailsHeader from "./SentEmailsHeader";
import EmailDetailModal from "../../modals/EmailDetailModal";
import { toast } from "react-toastify";
import { getSentEmails } from "../../../utils/api.utils";
import { userContext } from "../../../context/ContextProvider";

const SentEmailsCard = ({ setTab }) => {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [viewEmail, setViewEmail] = useState(null);
  const [emails, setEmails] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // ← added

  const { accounts } = useContext(userContext);

  const handleGetSentEmails = async () => {
    setIsLoading(true); // ← start
    try {
      const result = await getSentEmails(
        accounts[0].gmailAccountId,
        accounts[0].id,
      );
      setEmails(result.data);
    } catch (error) {
      toast.error("Failed to fetch sent emails. Please try again.");
    } finally {
      setIsLoading(false); // ← always stop
    }
  };

  useEffect(() => {
    handleGetSentEmails();
  }, []);

  const filtered = emails.filter((m) => {
    const q = search.toLowerCase();
    const toEmails = (m.to || []).join(", ").toLowerCase();
    return (
      (statusFilter === "All" || m.status === statusFilter) &&
      (toEmails.includes(q) || (m.subject || "").toLowerCase().includes(q))
    );
  });

  const formattedEmails = filtered.map((m) => {
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
