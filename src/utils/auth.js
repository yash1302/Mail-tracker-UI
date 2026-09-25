// utils/auth.js
export const isAuthenticated = () => {
  return !!localStorage.getItem("token") || localStorage.getItem("demoMode") === "true";
};

export const isDemoMode = () => localStorage.getItem("demoMode") === "true";

export const enableDemoMode = () => {
  localStorage.setItem("demoMode", "true");
};

export const clearSessionAuth = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("demoMode");
};
