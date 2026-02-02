from flask import Blueprint, request, jsonify

recommend_bp = Blueprint("recommend", __name__)

# a small library of quotes + suggestions mapped by severity keys
RECOMMENDATIONS = {
    "minimal": {
        "quote": "Small steps every day lead to big changes. — Keep going.",
        "suggestions": [
            "Take a 5–10 minute walk — notice surroundings and breath.",
            "Play an upbeat song and dance for one song.",
            "Make a small to-do list: finish one simple item."
        ],
        "resources": []
    },
    "mild": {
        "quote": "You’re doing better than you think — try a tiny break right now.",
        "suggestions": [
            "Try 3 deep belly breaths (4s in, 4s hold, 6s out) × 3.",
            "Call or text a friend for a short chat or distraction.",
            "Do a 5-minute guided breathing or grounding exercise."
        ],
        "resources": []
    },
    "moderate": {
        "quote": "When things feel heavy, small kindnesses to yourself help — try one now.",
        "suggestions": [
            "Write down one thing that is going well (however small).",
            "Try a 10-minute walk in nature or outside.",
            "Do a progressive-muscle-relaxation for 5–10 minutes."
        ],
        "resources": [
            {"title": "Self-help resources", "url": "https://www.mentalhealth.org.uk/"}
        ]
    },
    "moderately_severe": {
        "quote": "You’re carrying a lot — reach out and share this load with someone you trust.",
        "suggestions": [
            "Call a trusted person and say exactly: 'I’m struggling right now — can you stay with me on the phone?'",
            "Try a grounding exercise: name 5 things you see, 4 you can touch, 3 you can hear.",
            "If available, try a short guided meditation or grounding audio for 10 minutes."
        ],
        "resources": [
            {"title": "Local mental health services", "url": "https://www.who.int/mental_health/en/"}
        ]
    },
    "severe": {
        "quote": "If you’re thinking about harming yourself, please get help right away — you are not alone.",
        "suggestions": [
            "If you're in immediate danger, call your local emergency number now.",
            "Contact a crisis line or trusted person and say you need immediate support.",
            "If possible, remove dangerous items from where you are and go to a safe place."
        ],
        "resources": [
            {"title": "Emergency resources", "url": "https://www.iasp.info/resources/Crisis_Centres/"}
        ],
        "emergency": True
    }
}

# simple normalizer — allow numeric scores or explicit severity strings
def severity_from_input(payload):
    """
    Accept:
    - payload like {"severity":"moderate"} OR
    - {"score": 10, "type":"phq"} -> map to severity
    """
    sev = payload.get("severity")
    if sev:
        return sev.lower()
    score = payload.get("score")
    if score is None:
        return "minimal"
    # map PHQ/GAD numeric to categories (default PHQ-like)
    try:
        s = int(score)
    except Exception:
        return "minimal"
    # basic mapping (PHQ-9 style)
    if s <= 4:
        return "minimal"
    if 5 <= s <= 9:
        return "mild"
    if 10 <= s <= 14:
        return "moderate"
    if 15 <= s <= 19:
        return "moderately_severe"
    return "severe"

@recommend_bp.route("/api/recommendations", methods=["POST"])
def recommendations():
    payload = request.get_json(silent=True) or {}
    sev = severity_from_input(payload)
    data = RECOMMENDATIONS.get(sev, RECOMMENDATIONS["minimal"])

    # include the original severity back to the client
    response = {
        "severity": sev,
        "quote": data.get("quote"),
        "suggestions": data.get("suggestions", []),
        "resources": data.get("resources", []),
        "emergency": data.get("emergency", False)
    }
    return jsonify(response), 200
