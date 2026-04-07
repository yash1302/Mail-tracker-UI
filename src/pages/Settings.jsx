import { useContext, useState } from "react";
import {
  FiTrash2,
  FiCheckCircle,
  FiMail,
  FiShield,
  FiAlertTriangle,
  FiX,
  FiAlertCircle,
} from "react-icons/fi";
import { deleteGmailAccount } from "../utils/api.utils";
import { toast } from "react-toastify";
import { userContext } from "../context/userContext";
import { isTokenExpired } from "../utils/fileUtils";
import { useNavigate } from "react-router-dom";

const GoogleIcon = ({ size = 16 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

/* ── Disconnect confirmation modal ── */
const DisconnectModal = ({ account, onConfirm, onCancel }) => {
  if (!account) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 animate-in fade-in duration-150"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div
          className="bg-white rounded-2xl shadow-2xl shadow-slate-200 border border-slate-100 w-full max-w-md animate-in zoom-in-95 fade-in duration-150"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-start justify-between p-5 pb-4">
            <div className="flex items-center gap-3">
              {/* Warning icon */}
              <div className="w-10 h-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center flex-shrink-0">
                <FiAlertTriangle size={18} className="text-red-500" />
              </div>
              <div>
                <p className="text-[14px] font-bold text-slate-900 leading-tight">
                  Disconnect Gmail account?
                </p>
                <p className="text-[12px] text-slate-400 mt-0.5 font-medium truncate max-w-[220px]">
                  {account.email}
                </p>
              </div>
            </div>
            <button
              onClick={onCancel}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors flex-shrink-0"
            >
              <FiX size={16} />
            </button>
          </div>

          {/* Warning list */}
          <div className="mx-5 mb-4 rounded-xl bg-red-50 border border-red-100 divide-y divide-red-100 overflow-hidden">
            {[
              {
                icon: FiMail,
                text: "Outreach emails can no longer be sent from this account",
              },
              {
                icon: FiCheckCircle,
                text: "Reply tracking for campaigns using this account will stop",
              },
              {
                icon: FiAlertCircle,
                text: "Active campaigns linked to this account may be interrupted",
              },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-start gap-3 px-4 py-3">
                <Icon size={13} className="text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-[12px] text-red-600 leading-relaxed">
                  {text}
                </p>
              </div>
            ))}
          </div>

          {/* Tip */}
          <p className="mx-5 mb-4 text-[11.5px] text-slate-400 leading-relaxed">
            You can reconnect this account at any time from Settings. This does
            not delete any emails or data from your Gmail inbox.
          </p>

          {/* Actions */}
          <div className="flex items-center gap-2.5 px-5 py-4 border-t border-slate-100">
            <button
              onClick={onCancel}
              className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold text-slate-600 border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              Keep connected
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-[13px] font-bold text-white bg-red-500 hover:bg-red-600 active:scale-95 transition-all shadow-md shadow-red-100"
            >
              <FiTrash2 size={13} />
              Yes, disconnect
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

/* plain-english scope descriptions */
const SCOPES = [
  {
    Icon: FiMail,
    title: "Send emails",
    desc: "Lets us send outreach emails from your Gmail address on your behalf.",
    color: "text-indigo-500 bg-indigo-50 border-indigo-100",
  },
  {
    Icon: FiCheckCircle,
    title: "Read replies",
    desc: "Lets us detect when someone replies to an email you sent, so we can mark it as replied.",
    color: "text-emerald-500 bg-emerald-50 border-emerald-100",
  },
  {
    Icon: FiShield,
    title: "We never see your password",
    desc: "You sign in directly with Google. We only receive a secure access token — never your credentials.",
    color: "text-amber-500 bg-amber-50 border-amber-100",
  },
];

const AVATAR_COLORS = [
  "from-indigo-500 to-violet-400",
  "from-sky-500 to-cyan-400",
  "from-emerald-500 to-teal-400",
  "from-rose-500 to-pink-400",
  "from-amber-500 to-orange-400",
];

const API_URL = import.meta.env.VITE_BACKEND_URL;

const Settings = () => {
  const [pendingDisconnect, setPendingDisconnect] = useState(null);

  const { accounts, fetchAccounts } = useContext(userContext);
  const navigate = useNavigate();

  const handleConnectGmail = () => {
    const token = localStorage.getItem("token");

    if (!token || isTokenExpired(token)) {
      toast.error("Session expired. Please login again.");
      navigate("/");
      return;
    }

    window.location.href = `${API_URL}api/gmail/connect?token=${token}`;
  };

  const disconnect = async () => {
    if (!pendingDisconnect) return;
    await deleteGmailAccount(accounts[0]?.gmailAccountId);
    await fetchAccounts();
    toast.success(`${pendingDisconnect.email} disconnected successfully.`);
    setPendingDisconnect(null);
  };

  const fmtDate = (d) =>
    d?.toLocaleDateString([], {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

  return (
    <>
      {/* Disconnect confirmation modal */}
      <DisconnectModal
        account={pendingDisconnect}
        onConfirm={disconnect}
        onCancel={() => setPendingDisconnect(null)}
      />

      <div className="flex flex-col gap-6 w-full">
        {/* ── Connected accounts ── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden w-full">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl border border-slate-200 bg-white flex items-center justify-center shadow-sm flex-shrink-0">
                <GoogleIcon size={18} />
              </div>
              <div>
                <p className="text-[13.5px] font-bold text-slate-900 leading-tight">
                  Gmail Accounts
                </p>
                <p className="text-[11.5px] text-slate-400">
                  {accounts.length === 0
                    ? "No accounts connected yet"
                    : `${accounts.length} account${accounts.length > 1 ? "s" : ""} connected`}
                </p>
              </div>
            </div>
          </div>

          {/* Empty state */}
          {accounts.length === 0 && (
            <div className="flex flex-col items-center gap-4 py-12 px-6 text-center">
              <div className="w-14 h-14 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center">
                <FiMail className="text-slate-300" size={24} />
              </div>
              <div>
                <p className="text-[14px] font-bold text-slate-900 mb-1">
                  No Gmail accounts connected
                </p>
                <p className="text-[12.5px] text-slate-400 max-w-xs leading-relaxed">
                  Connect a Gmail account to start sending outreach emails and
                  tracking replies.
                </p>
              </div>
              <button
                onClick={handleConnectGmail}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-bold bg-indigo-500 text-white hover:bg-indigo-600 active:scale-95 transition-all shadow-md shadow-indigo-200"
              >
                <GoogleIcon size={14} />
                Sign in with Google
              </button>
            </div>
          )}

          {/* Account list */}
          {accounts.length > 0 && (
            <div className="divide-y divide-slate-50">
              {accounts.map((acc, idx) => (
                <div
                  key={acc.id}
                  className="flex items-center gap-4 px-5 py-4 hover:bg-slate-50/60 transition-colors"
                >
                  {/* Avatar */}
                  <div
                    className={`w-10 h-10 rounded-full bg-gradient-to-br ${AVATAR_COLORS[idx % AVATAR_COLORS.length]} flex items-center justify-center text-white text-[14px] font-extrabold flex-shrink-0`}
                  >
                    {acc.email[0].toUpperCase()}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[13.5px] font-semibold text-slate-900 truncate">
                      {acc.email}
                    </p>
                    <p className="text-[11.5px] text-slate-400 mt-0.5">
                      Connected {fmtDate(acc.connectedAt)}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      Active
                    </span>

                    {/* Disconnect — now opens modal */}
                    <button
                      onClick={() => setPendingDisconnect(acc)}
                      className="p-2 rounded-lg border border-slate-200 text-slate-400 hover:bg-red-50 hover:text-red-500 hover:border-red-200 transition-all"
                      title="Disconnect account"
                    >
                      <FiTrash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── What we access ── */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden w-full">
          <div className="px-5 py-4 border-b border-slate-100">
            <p className="text-[13.5px] font-bold text-slate-900 leading-tight">
              What we access
            </p>
            <p className="text-[11.5px] text-slate-400 mt-0.5">
              Plain English — exactly what Outreach Manager can and cannot do
              with your Gmail.
            </p>
          </div>

          <div className="grid grid-cols-3 divide-x divide-slate-100">
            {SCOPES.map(({ Icon, title, desc, color }) => (
              <div key={title} className="flex flex-col gap-3 p-5">
                <div
                  className={`w-9 h-9 rounded-xl border flex items-center justify-center flex-shrink-0 ${color}`}
                >
                  <Icon size={16} />
                </div>
                <div>
                  <p className="text-[13px] font-bold text-slate-900 mb-1">
                    {title}
                  </p>
                  <p className="text-[12px] text-slate-400 leading-relaxed">
                    {desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center gap-2 px-5 py-3 bg-slate-50 border-t border-slate-100">
            <FiShield size={12} className="text-slate-400 flex-shrink-0" />
            <p className="text-[11px] text-slate-400">
              Authorization uses Google OAuth 2.0. You can revoke access anytime
              at{" "}
              <a
                href="https://myaccount.google.com/permissions"
                target="_blank"
                rel="noreferrer"
                className="text-indigo-500 font-semibold underline underline-offset-2"
              >
                myaccount.google.com/permissions
              </a>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;
