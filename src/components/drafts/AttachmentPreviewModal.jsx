import { FiX, FiDownload } from "react-icons/fi";

const AttachmentPreviewModal = ({ file, onClose }) => {
  if (!file) return null;
  const name = file.filename || file.name;
  const type = file.type || "";

  const download = () => {
    const link = document.createElement("a");
    link.href = file.url;
    link.download = name;
    link.click();
  };

  const renderPreview = () => {
    // Images
    if (type.startsWith("image/")) {
      return (
        <div className="flex items-center justify-center h-full bg-slate-100">
          <img
            src={file.url}
            alt={name}
            className="max-w-full max-h-full object-contain"
          />
        </div>
      );
    }

    // PDFs
    if (type === "application/pdf" || name.toLowerCase().endsWith(".pdf")) {
      return (
        <iframe
          src={file.url}
          title={name}
          className="w-full h-full border-0"
        />
      );
    }

    return (
      <div className="h-full flex flex-col items-center justify-center gap-3">
        <p className="text-slate-500">
          Preview is not available for this file.
        </p>

        <button
          onClick={download}
          className="px-4 py-2 rounded-lg bg-indigo-500 text-white hover:bg-indigo-600"
        >
          Download File
        </button>
      </div>
    );
  };

  return (
    <div
      className="fixed inset-0 z-[999] bg-black/60 backdrop-blur-sm flex items-center justify-center"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-xl w-[90vw] h-[90vh] overflow-hidden shadow-2xl flex flex-col"
      >
        {/* Header */}

        <div className="h-14 border-b px-5 flex items-center justify-between">
          <h3 className="font-semibold truncate">{name}</h3>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 rounded hover:bg-slate-100"
            >
              <FiX size={20} />
            </button>
          </div>
        </div>

        <div className="flex-1">{renderPreview()}</div>
      </div>
    </div>
  );
};

export default AttachmentPreviewModal;
