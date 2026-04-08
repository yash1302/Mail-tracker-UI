import { useRef, useState } from "react";
import { FiPaperclip, FiFile, FiX } from "react-icons/fi";
import { formatBytes, isImg } from "../../utils/fileUtils.js";

const AttachmentZone = ({ attachments, onChange }) => {
  const ref = useRef(null);
  const [drag, setDrag] = useState(false);

  const add = (files) => {
    const nf = Array.from(files).filter(
      (f) => !attachments.find((a) => a.name === f.name && a.size === f.size),
    );
    onChange([...attachments, ...nf]);
  };

  return (
    <div className="flex flex-col gap-2">
      {/* Drop zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDrag(true);
        }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDrag(false);
          add(e.dataTransfer.files);
        }}
        onClick={() => ref.current?.click()}
        className={`flex flex-col items-center justify-center gap-1.5 rounded-[10px] px-3 py-4 text-center cursor-pointer transition-all duration-150 border-2 border-dashed ${
          drag
            ? "border-indigo-500 bg-indigo-50"
            : "border-slate-200 bg-slate-50"
        }`}
      >
        <FiPaperclip
          size={18}
          className={drag ? "text-indigo-500" : "text-slate-400"}
        />

        <p className="text-[12.5px] text-slate-500">
          Drop files or{" "}
          <span className="text-indigo-500 font-semibold">browse</span>
        </p>

        <p className="text-[11px] text-slate-300">Any file type · up to 10MB</p>

        <input
          ref={ref}
          type="file"
          multiple
          hidden
          onChange={(e) => add(e.target.files)}
        />
      </div>

      {/* Attachment list */}
      {attachments.length > 0 && (
        <ul className="flex flex-col gap-1.5">
          {attachments.map((f, i) => (
            <li
              key={i}
              className="group flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5"
            >
              {isImg(f) ? (
                <img
                  src={URL.createObjectURL(f)}
                  alt={f.filename}
                  className="w-[30px] h-[30px] object-cover rounded-md border border-slate-200 flex-shrink-0"
                />
              ) : (
                <div className="w-[30px] h-[30px] rounded-md bg-indigo-100 text-indigo-500 flex items-center justify-center flex-shrink-0">
                  <FiFile size={14} />
                </div>
              )}

              <div className="flex-1 min-w-0">
                <p className="text-[12.5px] font-semibold text-slate-900 truncate">
                  {f.filename || f.name}
                </p>

                <p className="text-[10.5px] text-slate-400">
                  {formatBytes(f.size)}
                </p>
              </div>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onChange(attachments.filter((_, j) => j !== i));
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 text-slate-400 hover:text-red-500 p-1 rounded-md"
              >
                <FiX size={13} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AttachmentZone;
