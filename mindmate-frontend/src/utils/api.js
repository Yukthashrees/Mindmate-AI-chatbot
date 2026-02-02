// src/utils/api.js
import axios from "axios";
import api from "../utils/api";
import { getLocalUser, setLocalUser } from "../utils/localUser";
const API_BASE = process.env.REACT_APP_API_BASE || "http://127.0.0.1:5000";



export default api;
export async function ensureUserOnServer(name, language = "en") {
  try {
    const res = await api.post("/api/users", { name, language });
    // expected: { id, name }
    if (res?.data?.id) {
      const local = getLocalUser() || {};
      setLocalUser({ ...local, name: res.data.name, user_id: res.data.id, language });
      return res.data;
    }
    return null;
  } catch (err) {
    console.error("ensureUserOnServer failed", err);
    // still save name locally; server might create user later when we send chat
    const local = getLocalUser() || {};
    setLocalUser({ ...local, name, language });
    return null;
  }
}