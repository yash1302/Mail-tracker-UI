import React, { useState } from "react";
import EmailFormCard from "./EmailFormCard.jsx";
import EmailPreviewCard from "./EmailPreviewCard.jsx";
import OutreachTipsCard from "./OutreachTipsCard.jsx";
import QuickStatsCard from "./QuickStatsCard.jsx";

const ComposeEmail = () => {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");
  const [allTo, setAllTo] = useState([]);

  return (
    <div className="grid grid-cols-[1fr_360px] gap-5 items-start h-full overflow-hidden">
      {/* Left */}
      <EmailFormCard
        setSubject={setSubject}
        setBody={setBody}
        setAllTo={setAllTo}
        allTo={allTo}
        subject={subject}
        body={body}
      />

      {/* Right */}
      <div className="flex flex-col gap-[14px] overflow-y-auto">
        {/* <EmailPreviewCard allTo={allTo} subject={subject} body={body}/> */}
        <OutreachTipsCard />
        {/* <QuickStatsCard /> */}
      </div>
    </div>
  );
};

export default ComposeEmail;
