import { jwtDecode } from "jwt-decode";

export const formatBytes = (b) =>
  b < 1024
    ? `${b} B`
    : b < 1048576
      ? `${(b / 1024).toFixed(1)} KB`
      : `${(b / 1048576).toFixed(1)} MB`;

export const isImg = (file) => file?.type?.startsWith("image/");

export const convertToHtml = (text) => {
  return text
    .split("\n")
    .map((line) => `<p>${line}</p>`)
    .join("");
};

export const isTokenExpired = (token) => {
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    console.log("Decoded JWT:", decoded, "Current Time:", currentTime);

    return decoded.exp < currentTime;
  } catch {
    return true;
  }
};
