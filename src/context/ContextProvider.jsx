import { useEffect, useState } from "react";
import { getGmailAccounts } from "../utils/api.utils.js";
import { userContext } from "./userContext.js";
import { jwtDecode } from "jwt-decode";

const ContextProvider = ({ children }) => {
  const [screen, setScreen] = useState("landing");
  const [user, setUser] = useState(null);
  const [active, setActive] = useState("dashboard");
  const [accounts, setAccounts] = useState([]);
  const [userName, setUserName] = useState("");

  const fetchAccounts = async () => {
    try {
      const res = await getGmailAccounts();
      const formatted = res.data.map((acc) => ({
        id: acc.userId,
        email: acc.email,
        gmailAccountId: acc._id,
        connectedAt: new Date(acc.createdAt),
        isPrimary: acc.isPrimary,
        user: acc.user,
      }));
      setAccounts(formatted);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const init = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        try {
          const decoded = jwtDecode(token);

          // 👇 depends on what you stored in backend
          const username = decoded.name || decoded.email;

          setUserName(username);

          await fetchAccounts();
        } catch (err) {
          console.error("Invalid token");
        }
      }
    };

    init();
  }, []);

  return (
    <userContext.Provider
      value={{
        screen,
        setScreen,
        user,
        setUser,
        active,
        setActive,
        accounts,
        fetchAccounts,
        userName
      }}
    >
      {children}
    </userContext.Provider>
  );
};

export default ContextProvider;
