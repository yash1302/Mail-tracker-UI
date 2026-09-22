import axios from "axios";
import { API_URL } from "./api.config.js";
import { toast } from "react-toastify";

const axiosclient = axios.create({
  baseURL: API_URL,
});

// Separate axios instance for refresh request
// This prevents the refresh request itself from going through
// the same interceptor.
const refreshClient = axios.create({
  baseURL: API_URL,
});

let isRefreshing = false;
let failedQueue = [];

// Resolve/reject requests waiting for a new token
const processQueue = (error, token = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve(token);
    }
  });

  failedQueue = [];
};

// =========================
// REQUEST INTERCEPTOR
// =========================

axiosclient.interceptors.request.use(
  (request) => {
    const token = localStorage.getItem("token");

    if (token) {
      request.headers.Authorization = `Bearer ${token}`;
    }

    return request;
  },
  (error) => {
    return Promise.reject(error);
  },
);

// =========================
// RESPONSE INTERCEPTOR
// =========================

axiosclient.interceptors.response.use(
  (response) => response,

  async (error) => {
    const originalRequest = error.config;

    const status =
      error?.response?.data?.error?.statusCode || error?.response?.status;

    // Only handle 401
    if (status !== 401) {
      return Promise.reject(error);
    }

    // Prevent infinite refresh loop
    if (originalRequest._retry) {
      localStorage.clear();
      window.location.href = "/";
      return Promise.reject(error);
    }

    // Don't try to refresh the refresh endpoint itself
    if (originalRequest.url?.includes("/auth/refresh")) {
      localStorage.clear();
      window.location.href = "/";
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    const refreshToken = localStorage.getItem("refreshToken");

    // No refresh token available
    if (!refreshToken) {
      toast.error("Session expired. Please log in again.");

      localStorage.clear();
      window.location.href = "/";

      return Promise.reject(error);
    }

    // =========================
    // Another request is already
    // refreshing the token
    // =========================

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve,
          reject,
        });
      })
        .then((newToken) => {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;

          return axiosclient(originalRequest);
        })
        .catch((err) => {
          return Promise.reject(err);
        });
    }

    // =========================
    // Start refresh
    // =========================

    isRefreshing = true;

    try {
      const response = await refreshClient.post("/api/auth/refresh", {
        refreshToken,
      });

      const token = response?.data?.data;

      // Save new access token
      localStorage.setItem("token", token);

      // Resolve all queued requests
      processQueue(null, token);

      // Retry original request
      originalRequest.headers.Authorization = `Bearer ${token}`;

      return axiosclient(originalRequest);
    } catch (refreshError) {
      // Refresh token is invalid/expired
      processQueue(refreshError, null);

      localStorage.clear();

      toast.error("Session expired. Please log in again.");

      window.location.href = "/";

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default axiosclient;
