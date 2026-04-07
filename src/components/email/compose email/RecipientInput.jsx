import { FiUsers, FiX } from "react-icons/fi";

const RecipientInput = ({
  label = "To",
  recipients,
  removeRecipient,
  recipientInput,
  setRecipientInput,
  handleRecipientKey,
  addRecipient,
  variant = "primary",
  disabled = false,
}) => {
  const isPrimary = variant === "primary";

  return (
    <div className="flex flex-col gap-[5px]">
      {/* Label Row */}
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-[5px] text-[11px] font-bold text-slate-400 uppercase tracking-[0.05em]">
          <FiUsers size={11} />
          {label}
          {recipients.length > 1 && (
            <span
              className={`ml-[4px] text-[10px] font-medium px-[7px] py-[1px] rounded-full ${
                isPrimary
                  ? "text-indigo-500 bg-indigo-50"
                  : "text-slate-500 bg-slate-100"
              }`}
            >
              Mass send · {recipients.length} recipients
            </span>
          )}
        </label>
      </div>

      {/* Input Container */}
      <div
        onClick={(e) =>
          !disabled && e.currentTarget.querySelector("input")?.focus()
        }
        className={`min-h-[44px] border border-slate-200 rounded-[10px] px-[10px] py-[6px] flex flex-wrap gap-[5px] items-center bg-white transition-colors ${
          disabled
            ? "opacity-50 cursor-not-allowed bg-slate-50"
            : "cursor-text"
        }`}
      >
        {recipients.map((r, i) => (
          <span
            key={i}
            className={`inline-flex items-center gap-[4px] rounded-[7px] px-[8px] py-[3px] text-[12px] font-medium shrink-0 ${
              isPrimary
                ? "bg-indigo-50 border border-indigo-200 text-indigo-600"
                : "bg-slate-100 border border-slate-200 text-slate-600"
            }`}
          >
            {r}
            <button
              onClick={() => !disabled && removeRecipient(r)}
              disabled={disabled}
              className="text-slate-400 hover:text-slate-600 flex disabled:pointer-events-none"
            >
              <FiX size={10} />
            </button>
          </span>
        ))}

        <input
          value={recipientInput}
          onChange={(e) => setRecipientInput(e.target.value)}
          onKeyDown={handleRecipientKey}
          onBlur={() => {
            if (!disabled && recipientInput.trim()) addRecipient(recipientInput);
          }}
          disabled={disabled}
          placeholder={
            recipients.length === 0
              ? `${label.toLowerCase()}@example.com — press Enter`
              : "Add another email..."
          }
          className="border-none outline-none text-[12.5px] text-slate-700 bg-transparent flex-grow min-w-[200px] disabled:cursor-not-allowed"
        />
      </div>

      {/* Helper text */}
      <p className="text-[11px] text-slate-400">
        Press{" "}
        <kbd className="text-[10px] bg-slate-100 border border-slate-200 rounded-[4px] px-[5px] py-[1px]">
          Enter
        </kbd>{" "}
        to add
      </p>
    </div>
  );
};

export default RecipientInput;