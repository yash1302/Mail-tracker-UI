import { useContext } from "react";
import { FiLogOut } from "react-icons/fi";
import { userContext } from "../../context/userContext.js";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
  const { accounts,userName } = useContext(userContext);
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
    navigate("/");
  };

  return (
    <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-white/5 transition">
      <div className="w-8 h-8 rounded-full bg-linear-to-br from-indigo-500 to-purple-400 flex items-center justify-center text-xs font-bold text-white">
        {userName.split(" ")[0]?.[0]?.toUpperCase() || "U"}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-200 truncate">
          {userName}
        </p>

        {/* <p className="text-xs text-slate-500">Admin</p> */}
      </div>

      <button
        onClick={handleLogout}
        className="text-slate-500 hover:text-red-400 transition"
      >
        <FiLogOut size={14} />
      </button>
    </div>
  );
};

export default UserProfile;
