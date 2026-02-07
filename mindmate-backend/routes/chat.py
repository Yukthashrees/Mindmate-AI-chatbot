from flask import Blueprint, request, jsonify
from openai import OpenAI
import httpx
import os
from dotenv import load_dotenv

load_dotenv()

chat_bp = Blueprint('chat', __name__)

@chat_bp.route("/chat", methods=["POST"])
def chat():
    api_key = os.getenv("GROQ_API_KEY")
    base_url = "https://api.groq.com/openai/v1"

    if not api_key:
        return jsonify({"reply": "System Error: API Key missing.", "ok": False}), 500

    try:
        # THE FIX: Create a custom HTTP client that ignores the 'proxies' argument
        # This prevents the 500 error on Render
        custom_client = httpx.Client(proxies=None)

        client = OpenAI(
            base_url=base_url,
            api_key=api_key,
            http_client=custom_client
        )

        data = request.get_json(force=True) or {}
        user_msg = data.get("message", "")

        completion = client.chat.completions.create(
            model="llama3-8b-8192", 
            messages=[
                {
                    "role": "system", 
                    "content": "You are Mindmate, a kind mental health assistant. Keep responses under 3 sentences."
                },
                {"role": "user", "content": user_msg}
            ]
        )
        
        reply = completion.choices[0].message.content
        return jsonify({"reply": reply, "ok": True})

    except Exception as e:
        print(f"DEBUG CHAT ERROR: {str(e)}")
        return jsonify({"reply": "I'm having trouble thinking. Please try again.", "ok": False}), 500