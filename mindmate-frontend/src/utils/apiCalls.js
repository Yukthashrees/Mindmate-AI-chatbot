// in Chat.jsx or src/utils/apiCalls.js
import api from "../utils/api";
import { getLocalUser, setLocalUser } from "../utils/localUser";

export async function sendChatMessage(message, language = "en") {
  const local = getLocalUser();
  const payload = {
    message,
    language,
    name: local?.name || undefined,
    user_id: local?.user_id || undefined,
  };

  try {
    const res = await api.post("/api/chat", payload);
    // expected res.data: { reply, msg_id, bot_msg_id, user_id? }
    if (res?.data?.user_id) {
      // backend created/returned user id — save it
      setLocalUser({ ...(local || {}), user_id: res.data.user_id });
    }
    return res.data;
  } catch (err) {
    console.error("sendChatMessage error", err);
    // rethrow or return fallback
    throw err;
  }
}
// apiCalls.js
// apiCalls.js
export async function submitPHQ(answers) {
  const local = getLocalUser();
  const payload = {
    answers,
    name: local?.name,
    user_id: local?.user_id,
  };
  const res = await api.post("/api/assessments/phq9", payload);
  // expected res.data: { score, severity, id }
  if (res?.data?.id && !local?.user_id && res.data.user_id) {
    // save user_id if backend returned it
    setLocalUser({ ...(local || {}), user_id: res.data.user_id });
  }
  return res.data;
}

export async function submitGAD(answers) {
  const local = getLocalUser();
  const payload = {
    answers,
    name: local?.name,
    user_id: local?.user_id,
  };
  const res = await api.post("/api/assessments/gad7", payload);
  return res.data;
}
