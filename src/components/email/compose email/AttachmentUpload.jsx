import { FiPaperclip, FiFile, FiX } from "react-icons/fi";

const AttachmentUpload = ({ attachments, setAttachments, fileRef, addFiles, disabled = false }) => {
  return (
    <div>
      <label className="text-[11px] font-bold text-slate-400 uppercase tracking-[0.05em] flex items-center gap-[5px] mb-[7px]">
        <FiPaperclip size={11} /> Attachments
      </label>

      <div
        onClick={() => !disabled && fileRef.current?.click()}
        className={`border-2 border-dashed rounded-[10px] py-[11px] text-center transition ${
          disabled
            ? "border-slate-200 bg-slate-50 opacity-50 cursor-not-allowed"
            : "border-slate-200 bg-slate-50 hover:bg-indigo-50 hover:border-indigo-500 cursor-pointer"
        }`}
      >
        <p className="text-[12.5px] text-slate-500">
          {disabled ? "Sending…" : "Click to attach files"}
        </p>

        <input
          ref={fileRef}
          type="file"
          multiple
          disabled={disabled}
          className="hidden"
          onChange={(e) => addFiles(e.target.files)}
        />
      </div>

      {attachments.length > 0 && (
        <div className="flex flex-wrap gap-[6px] mt-[8px]">
          {attachments.map((f, i) => (
            <span
              key={i}
              className={`inline-flex items-center gap-[5px] bg-indigo-50 border border-indigo-200 rounded-[8px] px-[9px] py-[4px] text-[11.5px] text-indigo-600 ${
                disabled ? "opacity-50" : ""
              }`}
            >
              <FiFile size={11} />
              {f.name}
              <button
                onClick={() =>
                  !disabled && setAttachments((a) => a.filter((_, j) => j !== i))
                }
                disabled={disabled}
                className="text-indigo-400 disabled:pointer-events-none"
              >
                <FiX size={11} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default AttachmentUpload;