export const API_URL = import.meta.env.VITE_BACKEND_URL;

export const apiConfig = {
  USER_SINGUP: "/api/auth/signup",
  USER_LOGIN: "/api/auth/login",
  USER_LOGOUT: "/api/auth/logout",
  CONNECT_GMAIL: "/api/gmail/connect",
  GMAIL_ACCOUNT: "/api/gmail/accounts",
  SEND_MAIL: "/api/gmail/send",
  GET_SENT_EMAILS: "/api/gmail/",
  DOWNLOAD_ATTACHMENT: "/api/gmail/attachment",
  DRAFTS: "/api/draft/",
  UPDATE_DRAFT: "/api/draft/:id",
  GET_FOLLOWUPS: "/api/followup/list",
  CHECK_REPLIES: "/api/followup/check-replies",
};
