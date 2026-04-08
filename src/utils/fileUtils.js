import { jwtDecode } from "jwt-decode";

export const formatBytes = (b) =>
  b < 1024
    ? `${b} B`
    : b < 1048576
      ? `${(b / 1024).toFixed(1)} KB`
      : `${(b / 1048576).toFixed(1)} MB`;

export const isImg = (file) => file?.type?.startsWith("image/");

const escapeHtml = (str) =>
  str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export const convertToHtml = (text) => {
  return text
    .split("\n")
    .map((line) => {
      const safe = escapeHtml(line.trim());
      return `<p>${safe || "&nbsp;"}</p>`;
    })
    .join("");
};

export const isTokenExpired = (token) => {
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    return decoded.exp < currentTime;
  } catch {
    return true;
  }
};
