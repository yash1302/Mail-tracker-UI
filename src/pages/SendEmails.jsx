import { useState, useRef } from "react";
import {
  FiEdit3,
  FiInbox,
} from "react-icons/fi";

import { DRAFT_TEMPLATES, sentEmailsData } from "../data/dashboardData";
import { sentStatusConfig } from "../utils/statusConfig.jsx";

import ComposeEmail from "../components/email/compose email/ComposeEmail.jsx";
import SentEmailsCard from "../components/email/sent email/SentEmailsCard.jsx";
import ViewEmailModal from "../components/email/sent email/ViewEmailModal.jsx";

const SendEmails = () => {

  const [tab, setTab] = useState("compose");

  const [recipients, setRecipients] = useState([]);
  const [recipientInput, setRecipientInput] = useState("");

  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const [attachments, setAttachments] = useState([]);

  const [sending, setSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);

  const [sentList, setSentList] = useState(sentEmailsData);

  const [viewEmail, setViewEmail] = useState(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [showDraftPicker, setShowDraftPicker] = useState(false);

  const fileRef = useRef(null);

  /* ── recipient chips ── */

  const addRecipient = (val) => {
    const v = val.trim().replace(/,$/, "");

    if (v && !recipients.includes(v)) {
      setRecipients((r) => [...r, v]);
    }

    setRecipientInput("");
  };

  const handleRecipientKey = (e) => {
    if (["Enter", ",", " "].includes(e.key)) {
      e.preventDefault();
      addRecipient(recipientInput);
    }
  };

  const removeRecipient = (r) =>
    setRecipients((rs) => rs.filter((x) => x !== r));

  const allTo = [
    ...recipients,
    ...(recipientInput.trim() ? [recipientInput.trim()] : []),
  ];

  const addFiles = (files) => {

    const nf = Array.from(files).filter(
      (f) => !attachments.find((a) => a.name === f.name && a.size === f.size)
    );

    setAttachments((p) => [...p, ...nf]);
  };

  const handleSend = () => {

    const targets = [
      ...recipients,
      ...(recipientInput.trim() ? [recipientInput.trim()] : []),
    ];

    if (!targets.length || !subject.trim() || !body.trim()) return;

    setSending(true);

    setTimeout(() => {

      const now = new Date();

      const newMails = targets.map((email) => ({
        id: Date.now() + Math.random(),
        to: email
          .split("@")[0]
          .replace(/[._]/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase()),
        email,
        subject,
        body,
        sentAt: now,
        date: now.toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
          hour: "numeric",
          minute: "2-digit",
        }),
        status: "Delivered",
        opens: 0,
        replies: 0,
      }));

      setSentList((p) => [...newMails, ...p]);

      setSending(false);
      setSentSuccess(true);

      setRecipients([]);
      setRecipientInput("");
      setSubject("");
      setBody("");
      setAttachments([]);

      setTimeout(() => {
        setSentSuccess(false);
        setTab("sent");
      }, 1800);

    }, 1400);
  };

  const canSend = allTo.length > 0 && subject.trim() && body.trim();

  const statuses = ["All", ...new Set(sentList.map((m) => m.status))];

  const filtered = sentList.filter((m) => {

    const q = search.toLowerCase();

    return (
      (statusFilter === "All" || m.status === statusFilter) &&
      (
        m.to.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.subject.toLowerCase().includes(q)
      )
    );

  });

  return (

    <div className="flex flex-col">

      {/* Tabs */}

      <div className="flex border-b-2 border-slate-100 mb-[20px]">

        {[
          ["compose", "Compose Email", <FiEdit3 size={14}/>],
          ["sent", "Sent Emails", <FiInbox size={14}/>],
        ].map(([key, label, icon]) => (

          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex items-center gap-[7px] px-[20px] py-[10px] text-[13.5px] font-semibold border-b-2 transition
            ${
              tab === key
                ? "border-indigo-500 text-indigo-500"
                : "border-transparent text-slate-400"
            }`}
          >

            {icon} {label}

            {key === "sent" && sentList.length > 0 && (

              <span
                className={`text-[10px] font-bold px-[6px] py-[1px] rounded-full
                ${
                  tab === "sent"
                    ? "bg-indigo-500 text-white"
                    : "bg-slate-200 text-slate-600"
                }`}
              >
                {sentList.length}
              </span>

            )}

          </button>

        ))}

      </div>

      {/* ── COMPOSE TAB ── */}

      {tab === "compose" && (

        <ComposeEmail
          recipients={recipients}
          setRecipients={setRecipients}
          recipientInput={recipientInput}
          setRecipientInput={setRecipientInput}
          subject={subject}
          setSubject={setSubject}
          body={body}
          setBody={setBody}
          attachments={attachments}
          setAttachments={setAttachments}
          sentList={sentList}
          setSentList={setSentList}
          showDraftPicker={showDraftPicker}
          setShowDraftPicker={setShowDraftPicker}
          DRAFT_TEMPLATES={DRAFT_TEMPLATES}
          fileRef={fileRef}
          addFiles={addFiles}
          removeRecipient={removeRecipient}
          handleRecipientKey={handleRecipientKey}
          addRecipient={addRecipient}
          handleSend={handleSend}
          sending={sending}
          sentSuccess={sentSuccess}
          canSend={canSend}
          allTo={allTo}
        />

      )}

      {/* ── SENT TAB ── */}

      {tab === "sent" && (

        <SentEmailsCard
          filtered={filtered}
          search={search}
          setSearch={setSearch}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          statuses={statuses}
          setTab={setTab}
          sentStatusConfig={sentStatusConfig}
          setViewEmail={setViewEmail}
          setSentList={setSentList}
        />

      )}

      {/* View Modal */}

      {viewEmail && (

        <ViewEmailModal
          viewEmail={viewEmail}
          setViewEmail={setViewEmail}
          sentStatusConfig={sentStatusConfig}
          setRecipients={setRecipients}
          setRecipientInput={setRecipientInput}
          setSubject={setSubject}
          setBody={setBody}
          setTab={setTab}
        />

      )}

      <style>
        {`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}
      </style>

    </div>

  );
};

export default SendEmails;