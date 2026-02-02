# app.py (paste exactly)
import os
from flask import Flask, jsonify, request
from flask_cors import CORS

print("DEBUG: app.py imported. pid:", os.getpid())

app = Flask(__name__)
CORS(app)

@app.route("/", methods=["GET"])
def home():
    print("DEBUG: GET / called")
    return jsonify({"message": "MindMate API is running!"})

@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.get_json(force=False, silent=True)
    print("DEBUG: /api/chat request body (parsed):", data)
    user_message = data.get("message") if isinstance(data, dict) else None
    if not user_message:
        return jsonify({"error": "no message provided"}), 400
    reply_text = f"Echo (debug): {user_message}"
    print("DEBUG: replying:", reply_text)
    return jsonify({"reply": reply_text, "ok": True})

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    debug_flag = bool(int(os.getenv("FLASK_DEBUG", "0"))) if os.getenv("FLASK_DEBUG", None) else True
    print(f"DEBUG: about to run app on 0.0.0.0:{port} debug={debug_flag}")
    app.run(host="0.0.0.0", port=port, debug=debug_flag)
