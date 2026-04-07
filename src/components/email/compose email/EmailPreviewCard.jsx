const EmailPreviewCard = ({ allTo, subject, body }) => {

  return (
    <div className="bg-white rounded-[16px] border border-slate-100 p-[20px] shadow-sm">

      <h3 className="text-[12px] font-bold text-slate-400 uppercase tracking-[0.05em] mb-[13px]">
        Preview
      </h3>

      <div className="flex flex-col gap-[9px]">

        <div className="flex gap-[8px]">
          <span className="text-[10.5px] font-bold text-slate-300 w-[44px]">
            TO
          </span>

          <span className={`text-[12.5px] ${allTo.length ? "text-slate-900" : "text-slate-300"}`}>
            {allTo.length
              ? allTo.join(", ")
              : "recipient@company.com"}
          </span>
        </div>

        <div className="border-t border-slate-100"/>

        <div className="flex gap-[8px]">
          <span className="text-[10.5px] font-bold text-slate-300 w-[44px]">
            SUBJ
          </span>

          <span className={`text-[12.5px] ${subject ? "text-slate-900 font-semibold" : "text-slate-300"}`}>
            {subject || "Your subject line"}
          </span>
        </div>

        <div className="border-t border-slate-100"/>

        <p className={`text-[12px] leading-[1.65] whitespace-pre-line ${body ? "text-slate-500" : "text-slate-300"}`}>
          {body || "Your message will appear here…"}
        </p>

      </div>
    </div>
  );
};

export default EmailPreviewCard;