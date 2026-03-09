const Modal = ({ isOpen, onClose, children }) => {

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center">

      <div className="bg-white p-6 rounded-lg w-96">

        <button
          onClick={onClose}
          className="float-right text-gray-500"
        >
          X
        </button>

        {children}

      </div>

    </div>
  );
};

export default Modal;