from flask import Blueprint, request, jsonify
import re
import random

chat_bp = Blueprint("rulechat", __name__, url_prefix="/api")

# ---------- EMOTION KEYWORDS ----------
EMOTION_KEYWORDS = {
    "sad": ["sad", "down", "hurt", "cry", "alone", "lonely", "depressed", "worthless", "empty"],
    "anxious": ["anxious", "anxiety", "panic", "nervous", "scared", "worried", "stress", "overthinking"],
    "angry": ["angry", "mad", "irritated", "annoyed", "rage", "furious", "pissed"],
    "tired": ["tired", "exhausted", "done", "drained", "burnt"],
    "happy": ["happy", "excited", "glad", "proud"],
}

SUICIDAL_PATTERNS = [
    r"kill myself", r"want to die", r"end my life", r"suicide",
    r"hurt myself", r"can't go on", r"cant go on"
]

PHQ_TRIGGERS = ["phq", "phq-9", "phq9", "open phq"]
GAD_TRIGGERS = ["gad", "gad7", "open gad", "gad-7"]

# ---------- EMPATHETIC PHRASES ----------
EMPATHY_STARTERS = {
    "sad": [
        "I’m really sorry you’re feeling this way.",
        "That sounds really heavy, and I’m glad you shared it with me.",
        "It takes courage to talk about this — thank you for trusting me."
    ],
    "anxious": [
        "Feeling anxious can be overwhelming — I hear you.",
        "It makes sense to feel this way when things get too much.",
        "Your feelings are completely valid, and I’m right here with you."
    ],
    "angry": [
        "It’s understandable to feel angry — your feelings matter.",
        "That sounds frustrating and upsetting.",
        "It’s okay to express anger — it means something important to you."
    ],
    "tired": [
        "It sounds like you’ve been carrying a lot for too long.",
        "Being emotionally tired is really tough.",
        "You deserve rest — emotionally and mentally."
    ],
    "happy": [
        "That’s wonderful! I’m really glad to hear this.",
        "I’m happy you’re feeling this way — that’s lovely.",
        "That’s amazing — thank you for sharing that with me."
    ],
    "neutral": [
        "Thanks for sharing that with me — I’m listening.",
        "I hear you. Tell me more so I can understand better.",
        "I’m here for you — feel free to share whatever’s on your mind."
    ]
}

# Follow-up questions
FOLLOW_UP = {
    "sad": [
        "What part of this feels the hardest right now?",
        "Do you want to talk about what caused these feelings?",
        "What do you feel you need most at this moment?"
    ],
    "anxious": [
        "When did this anxiety start today?",
        "Do you remember what triggered these feelings?",
        "What usually helps you calm down, even a little?"
    ],
    "angry": [
        "What happened that made you feel this way?",
        "Do you want to talk through what triggered the anger?",
        "What would help you feel a bit more grounded right now?"
    ],
    "tired": [
        "Has this been building up for a while?",
        "What do you think is draining your energy the most?",
        "Would you like to talk about what’s been weighing on you?"
    ],
    "happy": [
        "What made you feel this way today?",
        "Do you want to share more about it?",
        "That’s lovely — what happened?"
    ],
    "neutral": [
        "Tell me what’s on your mind right now.",
        "What made you think of this today?",
        "I'm listening — tell me more."
    ]
}

CALMING_SUGGESTIONS = [
    "Try taking a slow breath: inhale for 4s, hold for 4s, exhale for 6s.",
    "Try a quick grounding exercise: name 5 things you can see.",
    "Stretch your shoulders gently for 10 seconds."
]

DISTRACTION_SUGGESTIONS = [
    "Listen to one favourite song.",
    "Drink a sip of water slowly.",
    "Take a 2-minute walk or move around your room."
]

SAFETY_MESSAGE = (
    "I'm really sorry you're feeling this way. "
    "What you're experiencing matters, and you do not deserve to feel this pain alone. "
    "If you're thinking about harming yourself, please reach out to emergency services or a trusted person immediately. "
    "Would you like emergency helpline numbers?"
)

# -------------------------------------------------------
def detect_emotion(text):
    text = text.lower()
    scores = {k: 0 for k in EMOTION_KEYWORDS}
    for emotion, words in EMOTION_KEYWORDS.items():
        for w in words:
            if w in text:
                scores[emotion] += 1
    best = max(scores, key=scores.get)
    return best if scores[best] > 0 else "neutral"

def contains_any(text, patterns):
    text = text.lower()
    return any(p in text for p in patterns)

def regex_any(text, patterns):
    for p in patterns:
        if re.search(p, text.lower()):
            return True
    return False

# -------------------------------------------------------
@chat_bp.route("/chat", methods=["POST"])
def chat():
    data = request.get_json(silent=True) or {}
    msg = (data.get("message") or "").strip()

    if not msg:
        return jsonify({"reply": "I didn’t receive anything. Could you type that again?"})

    # --- SUICIDE CHECK ---
    if regex_any(msg, SUICIDAL_PATTERNS):
        return jsonify({
            "reply": SAFETY_MESSAGE,
            "urgent": True,
            "suggestions": ["Reach out to a trusted friend", "Call a helpline", "Move to a safe place nearby"],
            "follow_up": "Are you physically safe right now?"
        })

    # --- SCREENING OPEN ---
    if contains_any(msg, PHQ_TRIGGERS):
        return jsonify({"reply": "I can help you with the PHQ-9 screening. Ready?", "action": "open_phq"})

    if contains_any(msg, GAD_TRIGGERS):
        return jsonify({"reply": "I'll open the GAD-7 screening for you. Let’s begin.", "action": "open_gad"})

    # --- EMOTION DETECTION ---
    emotion = detect_emotion(msg)
    starter = random.choice(EMPATHY_STARTERS[emotion])
    follow = random.choice(FOLLOW_UP[emotion])

    # Reflection: keep safe, short reflections
    words = msg.split()
    reflection = "You mentioned \"" + " ".join(words[:5]) + "\"."

    # Build full reply
    reply = f"{starter} {reflection} {follow}"

    # suggestions (depend on emotion)
    suggestions = []
    if emotion in ["sad", "tired"]:
        suggestions = DISTRACTION_SUGGESTIONS + CALMING_SUGGESTIONS
    elif emotion == "anxious":
        suggestions = CALMING_SUGGESTIONS
    elif emotion == "angry":
        suggestions = DISTRACTION_SUGGESTIONS
    elif emotion == "happy":
        suggestions = ["That's wonderful — want to tell me more?"]

    return jsonify({
        "reply": reply,
        "emotion": emotion,
        "suggestions": suggestions,
        "follow_up": follow,
        "urgent": False
    })
