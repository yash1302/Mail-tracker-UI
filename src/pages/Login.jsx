import React, { useContext, useState } from "react";
import {
  FiEye,
  FiEyeOff,
  FiAlertCircle,
  FiRefreshCw,
  FiMail,
  FiLock,
  FiZap,
} from "react-icons/fi";
import AuthLayout from "../layouts/AuthLayout";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../utils/api.utils";
import { toast } from "react-toastify";
import { userContext } from "../context/ContextProvider";

/* ─── design tokens (mirrors SignupPage) ─────────────────────── */
const token = {
  indigo: "#6366f1",
  indigoLight: "#818cf8",
  indigoDark: "#4f46e5",
  indigoGhost: "rgba(99,102,241,0.08)",
  red: "#ef4444",
  slate900: "#0f172a",
  slate700: "#334155",
  slate500: "#64748b",
  slate400: "#94a3b8",
  slate200: "#e2e8f0",
  white: "#ffffff",
};

const css = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;0,9..40,800&display=swap');

  * { box-sizing: border-box; }
  .lp-root { font-family: 'DM Sans', sans-serif; }

  .lp-field { position: relative; width: 100%; }

  .lp-icon {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: ${token.slate400};
    display: flex;
    align-items: center;
    pointer-events: none;
    transition: color 0.2s;
  }
  .lp-field:focus-within .lp-icon { color: ${token.indigo}; }

  .lp-input {
    width: 100%;
    padding: 13px 14px 13px 42px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 500;
    color: ${token.slate900};
    background: ${token.white};
    border: 1.5px solid ${token.slate200};
    border-radius: 12px;
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .lp-input::placeholder { color: ${token.slate400}; font-weight: 400; }
  .lp-input:focus {
    border-color: ${token.indigo};
    box-shadow: 0 0 0 3.5px rgba(99,102,241,0.12);
  }
  .lp-input.error { border-color: ${token.red}; }
  .lp-input.error:focus { box-shadow: 0 0 0 3.5px rgba(239,68,68,0.1); }

  .lp-eye {
    position: absolute;
    right: 13px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    color: ${token.slate400};
    display: flex;
    align-items: center;
    padding: 4px;
    border-radius: 6px;
    transition: color 0.2s, background 0.15s;
    line-height: 0;
  }
  .lp-eye:hover { color: ${token.indigo}; background: ${token.indigoGhost}; }

  .lp-submit {
    width: 100%;
    padding: 14px;
    background: ${token.indigo};
    color: ${token.white};
    border: none;
    border-radius: 12px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14.5px;
    font-weight: 700;
    letter-spacing: 0.01em;
    cursor: pointer;
    transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
    box-shadow: 0 4px 14px rgba(99,102,241,0.35);
  }
  .lp-submit:hover:not(:disabled) {
    background: ${token.indigoDark};
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(99,102,241,0.42);
  }
  .lp-submit:active:not(:disabled) { transform: translateY(0); }
  .lp-submit:disabled { opacity: 0.7; cursor: not-allowed; }

  @keyframes lp-spin { to { transform: rotate(360deg); } }
  .lp-spin { animation: lp-spin 0.75s linear infinite; }

  @keyframes lp-fadein {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .lp-fadein { animation: lp-fadein 0.45s ease both; }

  .lp-divider {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 4px 0;
  }
  .lp-divider-line { flex: 1; height: 1px; background: ${token.slate200}; }
  .lp-divider-text { font-size: 12px; color: ${token.slate400}; font-weight: 500; }

  .lp-demo-badge {
    display: flex;
    align-items: flex-start;
    gap: 9px;
    background: #eef2ff;
    border: 1.5px solid #c7d2fe;
    border-radius: 12px;
    padding: 11px 14px;
    margin-bottom: 20px;
  }

  .lp-error-box {
    display: flex;
    align-items: center;
    gap: 7px;
    background: #fef2f2;
    border: 1.5px solid #fca5a5;
    border-radius: 10px;
    padding: 10px 13px;
  }

  .lp-forgot {
    background: none;
    border: none;
    cursor: pointer;
    color: ${token.indigo};
    font-size: 12.5px;
    font-weight: 600;
    font-family: 'DM Sans', sans-serif;
    padding: 2px 0;
    border-radius: 4px;
    transition: opacity 0.15s;
  }
  .lp-forgot:hover { opacity: 0.75; }

  .lp-signup-btn {
    display: block;
    width: 100%;
    margin-top: 12px;
    padding: 12px;
    background: ${token.indigoGhost};
    border: 1.5px solid rgba(99,102,241,0.2);
    border-radius: 12px;
    color: ${token.indigo};
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    transition: background 0.2s, border-color 0.2s;
    letter-spacing: 0.01em;
  }
  .lp-signup-btn:hover {
    background: rgba(99,102,241,0.13);
    border-color: rgba(99,102,241,0.4);
  }
`;

/* ─── component ──────────────────────────────────────────────── */
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { setActive, fetchAccounts } = useContext(userContext);
  const navigate = useNavigate();

  const onLogin = async () => {
    try {
      console.log("Logging in with:", { email, password });
      const result = await loginUser({ email, password });
      localStorage.setItem("token", result.data);
      fetchAccounts();
      navigate("/");
      setActive("dashboard");
    } catch (error) {
      console.log(error, "error in login api");
      toast.error(error || "Login failed. Please try again.");
    }
  };

  const onGoSignup = () => {
    navigate("/signup");
  };
  const onBack = () => {
    navigate(-1);
  };

  const submit = (event) => {
    event.preventDefault();
    // setError("");
    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }
    if (!password.trim()) {
      setError("Please enter your password.");
      return;
    }
    // setLoading(true);

    onLogin();
  };

  const hasEmailErr = !!error && !email.trim();
  const hasPasswordErr = !!error && !password.trim();

  return (
    <AuthLayout onBack={onBack}>
      <style>{css}</style>

      <div className="lp-root lp-fadein">
        {/* Header */}
        <div style={{ marginBottom: 26 }}>
          <h1
            style={{
              fontSize: 27,
              fontWeight: 800,
              color: token.slate900,
              margin: "0 0 6px",
              letterSpacing: "-0.03em",
              lineHeight: 1.15,
            }}
          >
            Welcome back
          </h1>
          <p
            style={{
              fontSize: 13.5,
              color: token.slate400,
              margin: 0,
              fontWeight: 400,
            }}
          >
            Sign in to continue to Outreach Manager
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {/* Email */}
          <div className="lp-field">
            <span className="lp-icon">
              <FiMail size={15} />
            </span>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit(e)}
              type="email"
              placeholder="you@company.com"
              className={`lp-input${hasEmailErr ? " error" : ""}`}
            />
          </div>

          {/* Password */}
          <div className="lp-field">
            <span className="lp-icon">
              <FiLock size={15} />
            </span>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit(e)}
              type={showPw ? "text" : "password"}
              placeholder="Password"
              className={`lp-input${hasPasswordErr ? " error" : ""}`}
              style={{ paddingRight: 44 }}
            />
            <button className="lp-eye" onClick={() => setShowPw((v) => !v)}>
              {showPw ? <FiEyeOff size={15} /> : <FiEye size={15} />}
            </button>
          </div>

          {/* Error */}
          {error && (
            <div className="lp-error-box">
              <FiAlertCircle
                size={13}
                color={token.red}
                style={{ flexShrink: 0 }}
              />
              <p
                style={{
                  fontSize: 12.5,
                  color: "#b91c1c",
                  margin: 0,
                  fontWeight: 500,
                }}
              >
                {error}
              </p>
            </div>
          )}

          {/* Forgot password */}
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: -2,
            }}
          >
            <button className="lp-forgot">Forgot password?</button>
          </div>

          {/* Submit */}
          <button
            className="lp-submit"
            onClick={(e) => submit(e)}
            disabled={loading}
            style={{ marginTop: 2 }}
          >
            {loading ? (
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 9,
                }}
              >
                <FiRefreshCw size={14} className="lp-spin" />
                Signing in…
              </span>
            ) : (
              "Sign in →"
            )}
          </button>
        </div>

        {/* Divider + Sign up */}
        <div style={{ marginTop: 24 }}>
          <div className="lp-divider">
            <div className="lp-divider-line" />
            <span className="lp-divider-text">new here?</span>
            <div className="lp-divider-line" />
          </div>
          <button className="lp-signup-btn" onClick={onGoSignup}>
            Create a free account
          </button>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Login;
