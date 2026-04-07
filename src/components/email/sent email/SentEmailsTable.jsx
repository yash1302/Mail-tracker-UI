import SentEmailRow from "./SentEmailRow";

const SentEmailsTable = ({
  filtered,
  sentStatusConfig,
  setViewEmail,
  setSentList
}) => {

  return (
    <table className="w-full border-collapse text-[13px]">

      <thead>
        <tr className="bg-slate-50 border-b border-slate-100">

          {[
            "Recipient",
            "Subject",
            "Sent",
            "Status",
            "Opens",
            "Replies",
            ""
          ].map((h)=>(
            <th
              key={h}
              className="text-left px-[16px] py-[9px] text-[10.5px] font-bold text-slate-400 uppercase tracking-[0.05em]"
            >
              {h}
            </th>
          ))}

        </tr>
      </thead>

      <tbody>

        {filtered.map((row,i)=>(
          <SentEmailRow
            key={i}
            row={row}
            sentStatusConfig={sentStatusConfig}
            setViewEmail={setViewEmail}
            setSentList={setSentList}
          />
        ))}

      </tbody>

    </table>
  );
};

export default SentEmailsTable;