from flask import Blueprint, request, jsonify
from openai import OpenAI
import os
from dotenv import load_dotenv

# Force load the .env file locally in this file
load_dotenv()

chat_bp = Blueprint('chat', __name__)

@chat_bp.route("/chat", methods=["POST"])
def chat():
    # Fetch the key and the URL
    api_key = os.getenv("GROQ_API_KEY")
    base_url = "https://api.groq.com/openai/v1"

    # Safety check: if the key is still None, we send a clear message
    if not api_key:
        print("CRITICAL ERROR: GROQ_API_KEY not found in environment!")
        return jsonify({"reply": "System Error: API Key missing.", "ok": False}), 500

    try:
        # Initialize client inside the route with explicit key
        client = OpenAI(
            base_url=base_url,
            api_key=api_key
        )

        data = request.get_json()
        user_msg = data.get("message", "")

        completion = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "system", 
                    "content": (
                        "You are Mindmate, a concise mental health assistant. "
                        "Keep your responses very brief, supportive, and under 2-3 sentences. "
                        "Never give long paragraphs. Focus on one small piece of advice at a time."
                        "Always bring a smile on their face and stay positive"
                    )
                },
                {"role": "user", "content": user_msg}
            ]
        )
        
        reply = completion.choices[0].message.content
        return jsonify({"reply": reply, "ok": True})

    except Exception as e:
        print(f"Chat Error: {str(e)}")
        return jsonify({"reply": "I'm having trouble thinking. Please try again.", "ok": False}), 500