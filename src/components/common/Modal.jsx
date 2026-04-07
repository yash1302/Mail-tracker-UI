const Modal = ({ children, onClose, width = "540px" }) => {
  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{ width }}
        className="bg-white rounded-[18px] overflow-hidden shadow-[0_25px_60px_rgba(0,0,0,0.18)]"
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;