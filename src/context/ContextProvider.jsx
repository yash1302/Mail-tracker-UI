import { useEffect, useState } from "react";
import { getGmailAccounts } from "../utils/api.utils.js";
import { userContext } from "./userContext.js";
import { jwtDecode } from "jwt-decode";
import { demoAccount } from "../data/demoData.js";

const ContextProvider = ({ children }) => {
  const [screen, setScreen] = useState("landing");
  const [user, setUser] = useState(null);
  const [active, setActive] = useState("dashboard");
  const [accounts, setAccounts] = useState([]);
  const [demoMode, setDemoMode] = useState(
    () => localStorage.getItem("mailtracker-demo") === "true",
  );
  const [userName, setUserName] = useState(() =>
    localStorage.getItem("mailtracker-demo") === "true" ? "Alex Demo" : "",
  );

  const enterDemoMode = () => {
    localStorage.setItem("mailtracker-demo", "true");
    setDemoMode(true);
    setUserName("Alex Demo");
  };

  const exitDemoMode = () => {
    localStorage.removeItem("mailtracker-demo");
    setDemoMode(false);
    setUserName("");
  };

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
    if (demoMode) {
      setAccounts([demoAccount]);
      return;
    }

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
  }, [demoMode]);

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
        userName,
        demoMode,
        enterDemoMode,
        exitDemoMode,
        setAccounts,
      }}
    >
      {children}
    </userContext.Provider>
  );
};

export default ContextProvider;
