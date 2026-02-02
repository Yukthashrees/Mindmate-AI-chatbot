from flask import Blueprint, request, jsonify

chat_blueprint = Blueprint("chat", __name__)

def simple_reply_for_message(msg):
    """Very small rule-based handler for demo/testing."""
    text = (msg or "").lower()
    # if user says yes after offer, open phq
    if "phq" in text or "question" in text or "assessment" in text:
        return {"action": "open_phq", "message": "Okay — I'll open the short PHQ now. Please answer honestly."}
    if "gad" in text or "anx" in text:
        return {"action": "open_gad", "message": "Okay — I'll open the short GAD now. Please answer honestly."}

    # simple emotional keywords
    if any(k in text for k in ["sad","stressed","anxious","depressed","low"]):
        return {"reply":"Got it, thanks for letting me know. Would you like a short guided check-in? (yes/no)"}

    # default
    return {"reply":"Thanks for sharing that with me. If you'd like, I can ask a few quick questions to better understand how you're doing."}

@chat_blueprint.route("/api/chat", methods=["POST"])
def chat():
    data = request.get_json(silent=True) or {}
    message = data.get("message", "")
    resp = simple_reply_for_message(message)
    return jsonify(resp), 200
