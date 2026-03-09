import React, { createContext, useState } from "react";

export const userContext = createContext();

const ContextProvider = ({ children }) => {
  const [screen, setScreen] = useState("landing");
  const [user, setUser] = useState(null);
  const [active, setActive] = useState("dashboard");
  return (
    <userContext.Provider
      value={{ screen, setScreen, user, setUser, active, setActive }}
    >
      {children}
    </userContext.Provider>
  );
};

export default ContextProvider;
