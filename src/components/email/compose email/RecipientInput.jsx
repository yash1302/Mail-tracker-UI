import { FiUsers, FiX } from "react-icons/fi";

const isValidEmail = (email) => {
  return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[A-Za-z]{2,}$/.test(email);
};

const RecipientInput = ({
  label = "To",
  recipients,
  setRecipients, // 🔥 needed for edit
  removeRecipient,
  recipientInput,
  setRecipientInput,
  handleRecipientKey,
  addRecipient,
  variant = "primary",
  disabled = false,
}) => {
  const isPrimary = variant === "primary";

  // 🔥 EDIT CHIP FUNCTION
  const editRecipient = (index) => {
    if (disabled) return;

    const email = recipients[index];

    // remove chip
    setRecipients((prev) => prev.filter((_, i) => i !== index));

    // put back in input
    setRecipientInput(email);
  };

  return (
    <div className="flex flex-col gap-[5px]">
      {/* Label */}
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

      {/* Input Box */}
      <div
        onClick={(e) =>
          !disabled && e.currentTarget.querySelector("input")?.focus()
        }
        className={`min-h-[44px] border border-slate-200 rounded-[10px] px-[10px] py-[6px] flex flex-wrap gap-[5px] items-center bg-white ${
          disabled ? "opacity-50 bg-slate-50" : "cursor-text"
        }`}
      >
        {/* 🔥 CHIPS */}
        {recipients.map((r, i) => (
          <span
            key={i}
            onClick={() => editRecipient(i)} // 🔥 editable
            className={`inline-flex items-center gap-[4px] rounded-[7px] px-[8px] py-[3px] text-[12px] font-medium shrink-0 cursor-pointer ${
              isValidEmail(r)
                ? isPrimary
                  ? "bg-indigo-50 border border-indigo-200 text-indigo-600"
                  : "bg-slate-100 border border-slate-200 text-slate-600"
                : "bg-red-100 border border-red-200 text-red-600" // 🔥 invalid highlight
            }`}
          >
            {r}

            <button
              onClick={(e) => {
                e.stopPropagation(); // 🔥 prevent edit click
                !disabled && removeRecipient(r);
              }}
              className="text-slate-400 hover:text-slate-600 flex"
            >
              <FiX size={10} />
            </button>
          </span>
        ))}

        {/* 🔥 INPUT */}
        <input
          value={recipientInput}
          onChange={(e) => setRecipientInput(e.target.value)}
          onKeyDown={handleRecipientKey}
          onBlur={() => {
            // 🔥 ONLY ADD IF VALID
            if (!disabled && isValidEmail(recipientInput)) {
              addRecipient(recipientInput);
            }
          }}
          disabled={disabled}
          placeholder={
            recipients.length === 0
              ? `${label.toLowerCase()}@example.com — press Enter`
              : "Add another email..."
          }
          className="border-none outline-none text-[12.5px] text-slate-700 bg-transparent flex-grow min-w-[200px]"
        />
      </div>

      {/* Helper */}
      <p className="text-[11px] text-slate-400">
        Press{" "}
        <kbd className="text-[10px] bg-slate-100 border rounded px-[5px] py-[1px]">
          Enter
        </kbd>{" "}
        to add
      </p>
    </div>
  );
};

export default RecipientInput;
