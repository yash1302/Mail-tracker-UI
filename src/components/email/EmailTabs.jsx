import { FiEdit3, FiInbox } from "react-icons/fi";

const EmailTabs = ({ tab, setTab, sentCount }) => {

  const tabs = [
    { key: "compose", label: "Compose Email", icon: <FiEdit3 size={14} /> },
    { key: "sent", label: "Sent Emails", icon: <FiInbox size={14} /> }
  ];

  return (
    <div className="flex border-b-2 border-slate-100 mb-5">

      {tabs.map(t => (
        <button
          key={t.key}
          onClick={() => setTab(t.key)}
          className={`flex items-center gap-2 px-5 py-2 text-[13.5px] font-semibold border-b-2 transition
          ${tab === t.key
            ? "border-indigo-500 text-indigo-500"
            : "border-transparent text-slate-400"}`}
        >
          {t.icon}
          {t.label}

          {t.key === "sent" && sentCount > 0 && (
            <span className={`text-[10px] font-bold px-2 rounded-full
              ${tab === "sent"
                ? "bg-indigo-500 text-white"
                : "bg-slate-200 text-slate-600"}`}
            >
              {sentCount}
            </span>
          )}

        </button>
      ))}

    </div>
  );
};

export default EmailTabs;