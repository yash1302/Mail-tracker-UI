import { useContext } from "react";
import { userContext } from "../context/userContext";
import { useNavigate } from "react-router-dom";

const RequireGmail = ({ children }) => {
  const { accounts } = useContext(userContext);
  const navigate = useNavigate();

  if (!accounts || accounts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <h2 className="text-lg font-semibold mb-2">Gmail Not Connected</h2>
        <p className="text-sm text-gray-500 mb-4">
          Please connect your Gmail account to use the app.
        </p>
        <button
          onClick={() => navigate("/settings")}
          className="px-4 py-2 bg-indigo-600 text-white rounded"
        >
          Connect Gmail
        </button>
      </div>
    );
  }

  return children;
};

export default RequireGmail;
