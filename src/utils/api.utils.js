import { toast } from "react-toastify";
import { apiConfig } from "./api.config";
import axiosclient from "./axios-client";
const {
  USER_SINGUP,
  USER_LOGIN,
  GMAIL_ACCOUNT,
  SEND_MAIL,
  GET_SENT_EMAILS,
  DOWNLOAD_ATTACHMENT,
  DRAFTS,
  UPDATE_DRAFT,
  GET_FOLLOWUPS,
  CHECK_REPLIES,
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
    console.log("Logging in with:", userData);
    const response = await axiosclient.post(USER_LOGIN, userData);
    return response.data;
  } catch (error) {
    console.log(error, "error in loginUser api--------");
    throw error.response.data.message;
  }
};
export const getGmailAccounts = async () => {
  try {
    const response = await axiosclient.get(GMAIL_ACCOUNT);
    return response.data;
  } catch (error) {
    throw error.response.data.message;
  }
};

export const deleteGmailAccount = async (userId, email) => {
  try {
    const response = await axiosclient.delete(GMAIL_ACCOUNT, {
      data: { userId, email },
    });
    return response.data;
  } catch (error) {
    throw error.response.data.message;
  }
};

export const sendEmail = async (emailData) => {
  try {
    console.log("Sending email with data:", emailData);
    const response = await axiosclient.post(SEND_MAIL, emailData, {
      headers: {
        "Content-Type": "application/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.log("Error in sendEmail API:", error);
    throw error.response.data.message;
  }
};

export const getSentEmails = async (gmailAccountId, userId) => {
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
    console.log("Downloading attachment with params:", {
      messageId,
      filename,
      gmailAccountId,
      userId,
    });
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
  try {
    const response = await axiosclient.post(CHECK_REPLIES, body);
    return response.data;
  } catch (error) {
    throw error?.response?.data?.message || "Failed to check replies";
  }
};
