import { useState, useContext } from "react";
import { FiEdit3, FiInbox } from "react-icons/fi";
import ComposeEmail from "../components/email/compose email/ComposeEmail.jsx";
import SentEmailsCard from "../components/email/sent email/SentEmailsCard.jsx";
import { userContext } from "../context/userContext.js";

const SendEmails = () => {
  const { demoMode } = useContext(userContext);
  const [tab, setTab] = useState("compose");

  return (
    <div className="flex flex-col overflow-y-hidden h-full">
      <div className="flex border-b-2 border-slate-100 mb-[20px]">
        {[
          ["compose", "Compose Email", <FiEdit3 size={14} />],
          ["sent", "Conversations", <FiInbox size={14} />],
        ].map(([key, label, icon]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`hover:cursor-pointer flex items-center gap-[7px] px-[20px] pb-[10px] text-[13.5px] font-semibold border-b-2 transition
            ${
              tab === key
                ? "border-indigo-500 text-indigo-500"
                : "border-transparent text-slate-400"
            }`}
          >
            {icon} {label}
          </button>
        ))}
      </div>
      <div className="flex-1 overflow-y-hidden">
        {tab === "compose" && <ComposeEmail demoMode={demoMode} />}
        {tab === "sent" && (
          <SentEmailsCard setTab={setTab} demoMode={demoMode} />
        )}
      </div>

      <style>
        {`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}
      </style>
    </div>
  );
};

export default SendEmails;
