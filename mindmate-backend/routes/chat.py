from flask import Blueprint, request, jsonify
from openai import OpenAI
import httpx  # Add this import at the top
import os
from dotenv import load_dotenv

load_dotenv()

chat_bp = Blueprint('chat', __name__)

@chat_bp.route("/chat", methods=["POST"])
def chat():
    api_key = os.getenv("GROQ_API_KEY")
    base_url = "https://api.groq.com/openai/v1"

    if not api_key:
        return jsonify({"reply": "API Key missing.", "ok": False}), 500

    try:
        # The FIX: Create a clean httpx client without proxy settings
        http_client = httpx.Client(proxies=None) 

        client = OpenAI(
            base_url=base_url,
            api_key=api_key,
            http_client=http_client # Inject the clean client here
        )

        data = request.get_json(force=True) or {}
        user_msg = data.get("message", "")

        completion = client.chat.completions.create(
            model="llama3-8b-8192", 
            messages=[
                {"role": "system", "content": "You are Mindmate, a kind, brief assistant."},
                {"role": "user", "content": user_msg}
            ]
        )
        
        reply = completion.choices[0].message.content
        return jsonify({"reply": reply, "ok": True})

    except Exception as e:
        print(f"DEBUG ERROR: {str(e)}")
        return jsonify({"reply": "I'm having trouble thinking.", "ok": False}), 500