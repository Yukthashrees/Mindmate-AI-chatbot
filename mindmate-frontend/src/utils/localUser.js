// src/utils/localUser.js
// small safe helpers to persist lightweight user data in localStorage

export function getLocalUser() {
  try {
    const raw = localStorage.getItem("mindmate_user");
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

export function setLocalUser(obj) {
  try {
    localStorage.setItem("mindmate_user", JSON.stringify(obj));
  } catch (e) {
    // ignore storage errors in browsers with strict settings
  }
}

export function clearLocalUser() {
  try {
    localStorage.removeItem("mindmate_user");
  } catch (e) {}
}
