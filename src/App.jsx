import Dashboard from "./pages/Dashboard";
import Drafts from "./pages/Drafts";
import SendEmails from "./pages/SendEmails";
import Followups from "./pages/Followups";
import { useState } from "react";
import FontLink from "./styles/dashboardFonts";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import InboxPage from "./pages/InboxPage";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/Login";
import SignupPage from "./pages/Signup";

function App() {
  const [screen, setScreen] = useState("landing");
  const [user, setUser] = useState(null);
  const [active, setActive] = useState("dashboard");

  const handleLogin = (u) => {
    setUser(u);
    setScreen("app");
  };
  const handleSignup = (u) => {
    setUser(u);
    setScreen("app");
  };
  const handleLogout = () => {
    setUser(null);
    setScreen("landing");
    setActive("dashboard");
  };

  if (screen === "landing")
    return (
      <LandingPage
        onLogin={() => setScreen("login")}
        onSignup={() => setScreen("signup")}
      />
    );
  if (screen === "login")
    return (
      <LoginPage
        onLogin={handleLogin}
        onGoSignup={() => setScreen("signup")}
        onBack={() => setScreen("landing")}
      />
    );
  if (screen === "signup")
    return (
      <SignupPage
        onSignup={handleSignup}
        onGoLogin={() => setScreen("login")}
        onBack={() => setScreen("landing")}
      />
    );

  const renderPage = () => {
    switch (active) {
      case "dashboard":
        return <Dashboard />;
      case "drafts":
        return <Drafts />;
      case "send":
        return <SendEmails />;
      case "followups":
        return <Followups />;
      case "inbox":
        return <InboxPage />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        overflow: "hidden",
        background: "#f8fafc",
      }}
    >
      <FontLink />
      <Sidebar
        active={active}
        setActive={setActive}
        user={user}
        onLogout={handleLogout}
      />
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <Navbar active={active} />
        <main style={{ flex: 1, overflowY: "auto", padding: "22px 24px" }}>
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

export default App;
