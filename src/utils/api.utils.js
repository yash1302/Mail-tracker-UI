import { apiConfig } from "./api.config.js";
import axiosclient from "./axios-client.js";
import { isDemoMode } from "./auth.js";
import { demoApi } from "../data/demoApi.js";
const {
  USER_SINGUP,
  USER_LOGIN,
  GMAIL_ACCOUNT,
  SEND_MAIL,
  GET_SENT_EMAILS,
  DOWNLOAD_ATTACHMENT,
  DRAFTS,
  GET_FOLLOWUPS,
  CHECK_REPLIES,
  DELETE_DRAFT,
  SEND_FOLLOWUP,
  SEND_OTP,
  VERIFY_OTP,
} = apiConfig;

export const signupUser = async (userData) => {
  try {
    const response = await axiosclient.post(USER_SINGUP, userData);
    return response.data;
  } catch (error) {
    throw error.response.data.message;
  }
};

export const loginUser = async (userData) => {
  try {
    const response = await axiosclient.post(USER_LOGIN, userData);
    return response.data;
  } catch (error) {
    throw error.response.data.message;
  }
};
export const getGmailAccounts = async () => {
  if (isDemoMode()) {
    return demoApi.getGmailAccounts();
  }
  try {
    const response = await axiosclient.get(GMAIL_ACCOUNT);
    return response.data;
  } catch (error) {
    throw error.response.data.message;
  }
};

export const deleteGmailAccount = async (gmailAccountId) => {
  if (isDemoMode()) {
    return demoApi.deleteGmailAccount(gmailAccountId);
  }
  try {
    const response = await axiosclient.delete(GMAIL_ACCOUNT, {
      data: { gmailAccountId },
    });
    return response.data;
  } catch (error) {
    throw error.response.data.message;
  }
};

export const sendEmail = async (emailData) => {
  if (isDemoMode()) {
    return demoApi.sendEmail(emailData);
  }
  try {
    const response = await axiosclient.post(SEND_MAIL, emailData, {
      headers: {
        "Content-Type": "application/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data.message;
  }
};

export const getSentEmails = async (gmailAccountId, userId) => {
  if (isDemoMode()) {
    return demoApi.getSentEmails(gmailAccountId, userId);
  }
  try {
    const response = await axiosclient.get(GET_SENT_EMAILS, {
      params: {
        gmailAccountId: gmailAccountId,
        userId: userId,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data.message;
  }
};

export const downloadAttachment = async ({
  messageId,
  filename,
  gmailAccountId,
  userId,
}) => {
  try {
    const response = await axiosclient.get(
      `${DOWNLOAD_ATTACHMENT}/${messageId}/${filename}`,
      {
        params: { gmailAccountId, userId },
        responseType: "blob",
      },
    );

    const blob = new Blob([response.data]);

    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = filename;

    document.body.appendChild(link);
    link.click();

    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error) {
    throw error.response.data.message;
  }
};

export const createDraftApi = async (formData) => {
  if (isDemoMode()) {
    return demoApi.createDraft(formData);
  }
  try {
    const response = await axiosclient.post(DRAFTS, formData, {
      headers: {
        "Content-Type": "application/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error.response.data.message;
  }
};

export const getDraftsApi = async ({ userId, gmailAccountId }) => {
  if (isDemoMode()) {
    return demoApi.getDrafts(userId, gmailAccountId);
  }
  try {
    const response = await axiosclient.get(DRAFTS, {
      params: {
        userId,
        gmailAccountId,
      },
    });

    return response.data;
  } catch (error) {
    throw error?.response?.data?.message || "Failed to fetch drafts";
  }
};

export const updateDraftApi = async (draftId, formData) => {
  if (isDemoMode()) {
    return demoApi.updateDraft(draftId, formData);
  }
  try {
    const response = await axiosclient.put(DRAFTS, formData, {
      params: { id: draftId },
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    throw error?.response?.data?.message || "Failed to update draft";
  }
};

export const getFollowUpsApi = async (userId, gmailAccountId) => {
  if (isDemoMode()) {
    return demoApi.getFollowups(userId, gmailAccountId);
  }
  try {
    const response = await axiosclient.get(GET_FOLLOWUPS, {
      params: { userId, gmailAccountId },
    });
    return response.data;
  } catch (error) {
    throw error?.response?.data?.message || "Failed to fetch follow-ups";
  }
};

export const checkRepliesApi = async (body) => {
  if (isDemoMode()) {
    return demoApi.checkReplies(body);
  }
  try {
    const response = await axiosclient.post(CHECK_REPLIES, body);
    return response.data;
  } catch (error) {
    throw error?.response?.data?.message || "Failed to check replies";
  }
};

export const deleteDraftApi = async (draftId) => {
  if (isDemoMode()) {
    return demoApi.deleteDraft(draftId);
  }
  try {
    const response = await axiosclient.delete(DELETE_DRAFT, {
      params: { id: draftId },
    });
    return response.data;
  } catch (error) {
    throw error?.response?.data?.message || "Failed to delete draft";
  }
};

export const getDashboardKPI = async (userId, gmailAccountId, analyticsFilter) => {
  if (isDemoMode()) {
    return demoApi.getDashboardKpi(userId, gmailAccountId, analyticsFilter);
  }
  try {
    const response = await axiosclient.get(apiConfig.DASHBOARD_KPI, {
      params: { userId, gmailAccountId, filter: analyticsFilter },
    });
    return response.data;
  } catch (error) {
    throw error?.response?.data?.message || "Failed to fetch dashboard KPI";
  }
};

export const updateFollowUpStatusApi = async (followUpId, action) => {
  if (isDemoMode()) {
    return demoApi.updateFollowupStatus(followUpId, action);
  }
  try {
    const response = await axiosclient.patch(
      `/api/followup/${followUpId}/status`,
      { action },
    );
    return response.data;
  } catch (error) {
    throw error?.response?.data?.message || "Failed to update follow-up status";
  }
};

export const sendFollowupApi = async (emailData) => {
  if (isDemoMode()) {
    return demoApi.sendFollowup(emailData);
  }
  try {
    const response = await axiosclient.post(SEND_FOLLOWUP, emailData, {
      headers: {
        "Content-Type": "application/form-data",
      },
    });
    return response.data;
  } catch (error) {
    throw error?.response?.data?.message || "Failed to send follow-up";
  }
};

export const sendOTPApi = async (email) => {
  try {
    const response = await axiosclient.post(SEND_OTP, { email });
    return response.data;
  } catch (error) {
    throw error?.response?.data?.message || "Failed to send OTP";
  }
};

export const verifyOTPApi = async (email, otp) => {
  try {
    const response = await axiosclient.post(VERIFY_OTP, { email, otp });
    return response.data;
  } catch (error) {
    throw error?.response?.data?.message || "Failed to verify OTP";
  }
};

export const generateAIReplyApi = async (emailData) => {
  if (isDemoMode()) {
    return demoApi.generateAiReply(emailData);
  }
  try {
    const response = await axiosclient.post(
      apiConfig.GENERATE_AI_REPLY,
      emailData,
    );
    return response.data;
  } catch (error) {
    throw error?.response?.data?.message || "Failed to generate AI reply";
  }
};
