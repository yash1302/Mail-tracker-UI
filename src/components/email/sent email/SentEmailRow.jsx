import { FiEye, FiTrash2, FiCornerUpRight } from "react-icons/fi";
import StatusBadge from "./StatusBadge.jsx";

const SentEmailRow = ({ row, sentStatusConfig, setViewEmail, setSentList }) => {
  const hue = (row.to.charCodeAt(0) * 17) % 360;

  return (
    <tr
      className="border-b border-slate-50 hover:bg-slate-50 cursor-pointer transition"
      onClick={() => setViewEmail(row)}
    >
      <td className="px-[16px] py-[12px]">
        <div className="flex items-center gap-[9px]">
          <div
            className="w-[30px] h-[30px] rounded-full flex items-center justify-center text-[12px] font-bold shrink-0"
            style={{
              background: `hsl(${hue},55%,88%)`,
              color: `hsl(${hue},45%,35%)`,
            }}
          >
            {row.to[0]}
          </div>

          <div>
            <p className="text-[13px] font-semibold text-slate-900">{row.to}</p>

            <p className="text-[11px] text-slate-400">{row.email}</p>
          </div>
        </div>
      </td>

      <td className="px-[16px] py-[12px] max-w-[210px]">
        <p className="text-slate-700 font-medium truncate max-w-[190px]">
          {row.subject}
        </p>

        <p className="text-[11.5px] text-slate-400 truncate max-w-[190px] mt-[2px]">
          {row.body}
        </p>
      </td>

      <td className="px-[16px] py-[12px] font-mono text-[11px] text-slate-400">
        {row.date}
      </td>

      <td className="px-[16px] py-[12px]">
        <StatusBadge status={row.status} config={sentStatusConfig} />
      </td>

      <td className="px-[16px] py-[12px]">
        <div
          className={`flex items-center gap-[4px] ${row.opens ? "text-sky-500" : "text-slate-300"}`}
        >
          <FiEye size={12} />
          <span className="font-mono text-[12px]">{row.opens}</span>
        </div>
      </td>

      <td className="px-[16px] py-[12px]">
        <div
          className={`flex items-center gap-[4px] ${row.replies ? "text-emerald-500" : "text-slate-300"}`}
        >
          <FiCornerUpRight size={12} />
          <span className="font-mono text-[12px]">{row.replies}</span>
        </div>
      </td>

      <td className="px-[16px] py-[12px]" onClick={(e) => e.stopPropagation()}>
        <div className="flex gap-[5px]">
          <button
            onClick={() => setViewEmail(row)}
            className="border border-slate-200 rounded-[7px] p-[5px] text-slate-500 hover:bg-indigo-50 hover:text-indigo-500 transition"
          >
            <FiEye size={12} />
          </button>

          <button
            onClick={() =>
              setSentList((sl) => sl.filter((m) => m.id !== row.id))
            }
            className="border border-slate-200 rounded-[7px] p-[5px] text-slate-500 hover:bg-red-100 hover:text-red-500 transition"
          >
            <FiTrash2 size={12} />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default SentEmailRow;
