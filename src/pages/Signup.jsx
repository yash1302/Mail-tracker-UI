import React, { useContext, useState } from "react";
import {
  FiEye,
  FiEyeOff,
  FiCheck,
  FiRefreshCw,
  FiUser,
  FiMail,
  FiLock,
} from "react-icons/fi";
import AuthLayout from "../layouts/AuthLayout";
import { useNavigate } from "react-router-dom";
import { userContext } from "../context/userContext";
import { signupUser } from "../utils/api.utils";
import { toast } from "react-toastify";

const token = {
  indigo: "#6366f1",
  indigoLight: "#818cf8",
  indigoDark: "#4f46e5",
  indigoGhost: "rgba(99,102,241,0.08)",
  red: "#ef4444",
  amber: "#f59e0b",
  green: "#10b981",
  slate900: "#0f172a",
  slate700: "#334155",
  slate500: "#64748b",
  slate400: "#94a3b8",
  slate200: "#e2e8f0",
  slate100: "#f1f5f9",
  white: "#ffffff",
};

const css = `
 

  * { box-sizing: border-box; }

  .sp-root { font-family: 'DM Sans', sans-serif; }

  .sp-field {
    position: relative;
    width: 100%;
  }

  .sp-icon {
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

  .sp-input {
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
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
  }

  .sp-input::placeholder { color: ${token.slate400}; font-weight: 400; }

  .sp-input:focus {
    border-color: ${token.indigo};
    box-shadow: 0 0 0 3.5px rgba(99,102,241,0.12);
    background: ${token.white};
  }

  .sp-input:focus + .sp-icon-left,
  .sp-field:focus-within .sp-icon { color: ${token.indigo}; }

  .sp-input.error { border-color: ${token.red}; }
  .sp-input.error:focus { box-shadow: 0 0 0 3.5px rgba(239,68,68,0.1); }

  .sp-eye {
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
  .sp-eye:hover { color: ${token.indigo}; background: ${token.indigoGhost}; }

  .sp-error {
    font-size: 11.5px;
    color: ${token.red};
    margin: 5px 0 0 4px;
    font-weight: 500;
  }

  .sp-strength-bar {
    height: 3px;
    border-radius: 99px;
    flex: 1;
    transition: background 0.35s ease;
  }

  .sp-submit {
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
  .sp-submit:hover:not(:disabled) {
    background: ${token.indigoDark};
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(99,102,241,0.42);
  }
  .sp-submit:active:not(:disabled) { transform: translateY(0); }
  .sp-submit:disabled { opacity: 0.7; cursor: not-allowed; }

  @keyframes sp-spin { to { transform: rotate(360deg); } }
  .sp-spin { animation: sp-spin 0.75s linear infinite; }

  @keyframes sp-fadein {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .sp-fadein { animation: sp-fadein 0.45s ease both; }

  .sp-divider {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 4px 0;
  }
  .sp-divider-line {
    flex: 1;
    height: 1px;
    background: ${token.slate200};
  }
  .sp-divider-text {
    font-size: 12px;
    color: ${token.slate400};
    font-weight: 500;
  }

  .sp-checkbox {
    width: 18px; height: 18px;
    border-radius: 6px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    cursor: pointer;
    transition: border-color 0.15s, background 0.15s, transform 0.1s;
    margin-top: 1px;
  }
  .sp-checkbox:active { transform: scale(0.92); }

  .sp-badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    background: rgba(16,185,129,0.08);
    color: #059669;
    font-size: 11.5px;
    font-weight: 600;
    padding: 3px 9px;
    border-radius: 99px;
    border: 1px solid rgba(16,185,129,0.2);
  }
`;

/* ─── component ─────────────────────────────────────────────── */
const SignupPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);

  const [errors, setErrors] = useState({});
  const [agreed, setAgreed] = useState(false);

  const { setActive } = useContext(userContext);

  const navigate = useNavigate();

  const onSignup = async () => {
    try {
      const result = await signupUser({
        name: name.trim(),
        email: email.trim(),
        password: password.trim(),
      });
      localStorage.setItem("token", result.data);
      setName("");
      setEmail("");
      setPassword("");
      setAgreed(false);
      navigate("/");
      setActive("dashboard");
    } catch (error) {
      toast.error(error || "Signup failed. Please try again.");
    }
  };

  const onGoLogin = () => {
    navigate("/login");
  };

  const onBack = () => {
    navigate(-1);
  };

  const validate = () => {
    const e = {};
    if (!name.trim()) e.name = "Name is required";
    if (!email.includes("@")) e.email = "Valid email required";
    if (password.length < 6) e.password = "Min 6 characters";
    if (!agreed) e.agreed = "Please accept terms";
    return e;
  };

  const submit = () => {
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) return;
    onSignup();
  };

  const strength =
    password.length === 0
      ? 0
      : password.length < 5
        ? 1
        : password.length < 8
          ? 2
          : 3;
  const strengthLabel = ["", "Weak", "Fair", "Strong"];
  const strengthColor = ["", token.red, token.amber, token.green];

  return (
    <AuthLayout onBack={onBack}>
      <style>{css}</style>

      <div className="sp-root sp-fadein">
        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <span className="sp-badge" style={{ marginBottom: 14 }}>
            <FiCheck size={11} strokeWidth={3} />
            Free forever
          </span>
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
            Create your account
          </h1>
          <p
            style={{
              fontSize: 13.5,
              color: token.slate400,
              margin: 0,
              fontWeight: 400,
            }}
          >
            No credit card required. Up and running in seconds.
          </p>
        </div>

        {/* Fields */}
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {/* Name */}
          <div>
            <div className="sp-field">
              <span className="sp-icon">
                <FiUser size={15} />
              </span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
                className={`sp-input${errors.name ? " error" : ""}`}
              />
            </div>
            {errors.name && <p className="sp-error">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <div className="sp-field">
              <span className="sp-icon">
                <FiMail size={15} />
              </span>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="Work email"
                className={`sp-input${errors.email ? " error" : ""}`}
              />
            </div>
            {errors.email && <p className="sp-error">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <div className="sp-field">
              <span className="sp-icon">
                <FiLock size={15} />
              </span>
              <input
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type={showPw ? "text" : "password"}
                placeholder="Password (min 6 chars)"
                className={`sp-input${errors.password ? " error" : ""}`}
                style={{ paddingRight: 44 }}
              />
              <button className="sp-eye" onClick={() => setShowPw((v) => !v)}>
                {showPw ? <FiEyeOff size={15} /> : <FiEye size={15} />}
              </button>
            </div>

            {/* Strength meter */}
            {password.length > 0 && (
              <div style={{ marginTop: 8, padding: "0 2px" }}>
                <div style={{ display: "flex", gap: 5, marginBottom: 4 }}>
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="sp-strength-bar"
                      style={{
                        background:
                          i <= strength
                            ? strengthColor[strength]
                            : token.slate200,
                      }}
                    />
                  ))}
                </div>
                <p
                  style={{
                    fontSize: 11.5,
                    color: strengthColor[strength],
                    margin: 0,
                    fontWeight: 700,
                    letterSpacing: "0.02em",
                  }}
                >
                  {strengthLabel[strength]} password
                </p>
              </div>
            )}
            {errors.password && <p className="sp-error">{errors.password}</p>}
          </div>

          {/* Terms */}
          <div style={{ marginTop: 2 }}>
            <label
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 10,
                cursor: "pointer",
              }}
            >
              <div
                className="sp-checkbox"
                onClick={() => setAgreed((v) => !v)}
                style={{
                  border: `1.75px solid ${errors.agreed ? token.red : agreed ? token.indigo : token.slate200}`,
                  background: agreed ? token.indigo : token.white,
                  boxShadow: agreed
                    ? `0 0 0 3px rgba(99,102,241,0.12)`
                    : "none",
                }}
              >
                {agreed && <FiCheck size={10} color="#fff" strokeWidth={3.5} />}
              </div>
              <span
                style={{
                  fontSize: 12.5,
                  color: token.slate500,
                  lineHeight: 1.55,
                  fontWeight: 400,
                }}
              >
                I agree to the{" "}
                <span
                  style={{
                    color: token.indigo,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Terms of Service
                </span>{" "}
                and{" "}
                <span
                  style={{
                    color: token.indigo,
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Privacy Policy
                </span>
              </span>
            </label>
            {errors.agreed && <p className="sp-error">{errors.agreed}</p>}
          </div>

          {/* Submit */}
          <button
            className="sp-submit"
            onClick={submit}
            style={{ marginTop: 6 }}
          >
            "Create account →"
          </button>
        </div>

        {/* Divider + Sign in */}
        <div style={{ marginTop: 24 }}>
          <div className="sp-divider">
            <div className="sp-divider-line" />
            <span className="sp-divider-text">already a member?</span>
            <div className="sp-divider-line" />
          </div>
          <button
            onClick={onGoLogin}
            style={{
              display: "block",
              width: "100%",
              marginTop: 12,
              padding: "12px",
              background: token.indigoGhost,
              border: `1.5px solid rgba(99,102,241,0.2)`,
              borderRadius: 12,
              color: token.indigo,
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
              transition: "background 0.2s, border-color 0.2s",
              letterSpacing: "0.01em",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "rgba(99,102,241,0.13)";
              e.currentTarget.style.borderColor = "rgba(99,102,241,0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = token.indigoGhost;
              e.currentTarget.style.borderColor = "rgba(99,102,241,0.2)";
            }}
          >
            Sign in instead
          </button>
        </div>
      </div>
    </AuthLayout>
  );
};

export default SignupPage;
