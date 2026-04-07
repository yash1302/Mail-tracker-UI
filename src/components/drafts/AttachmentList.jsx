import { FiFile, FiImage } from "react-icons/fi";
import { formatBytes, isImg } from "../../utils/fileUtils.js";

const AttachmentList = ({ attachments }) => {
  if (!attachments?.length)
    return <p className="text-[13px] text-slate-300 italic">No attachments</p>;

  return (
    <div className="flex flex-wrap gap-[7px]">
      {attachments.map((f, i) => (
        <span
          key={i}
          className="inline-flex items-center gap-[6px] bg-slate-50 border border-slate-200 rounded-[8px] px-[10px] py-[5px] text-[11.5px] text-slate-700"
        >
          {isImg(f) ? <FiImage size={13} /> : <FiFile size={13} />}

          <span className="max-w-[130px] truncate">{f.filename}</span>

          <span className="text-slate-300">· {formatBytes(f.size)}</span>
        </span>
      ))}
    </div>
  );
};

export default AttachmentList;
