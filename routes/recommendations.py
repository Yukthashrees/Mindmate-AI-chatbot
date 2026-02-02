from flask import Blueprint, request, jsonify

bp = Blueprint("recommendations", __name__, url_prefix="/recommendations")

# Simple suggestions dictionary
SUGGESTIONS = {
    "Minimal": [
        "Keep up your healthy habits and routines.",
        "Continue doing activities that make you feel relaxed and happy.",
        "Maintain good sleep and nutrition."
    ],
    "Mild": [
        "Try journaling or writing your thoughts daily.",
        "Go for a short walk or do light exercise.",
        "Spend time with friends or family who make you feel good."
    ],
    "Moderate": [
        "Try simple breathing or mindfulness exercises.",
        "Stick to a daily routine and include one enjoyable activity.",
        "Reach out to a trusted person if you start feeling worse."
    ],
    "Moderately Severe": [
        "Consider talking to a counselor or mental health professional.",
        "Avoid isolation and try to stay socially connected.",
        "Use mental health apps or helplines if needed."
    ],
    "Severe": [
        "You might benefit from professional help — consider contacting a therapist.",
        "If you ever feel unsafe or hopeless, reach out to a helpline immediately.",
        "Focus on safety and support — don’t try to manage this alone."
    ]
}


@bp.route("/for_severity", methods=["POST"])
def for_severity():
    data = request.get_json()

    phq_sev = data.get("phq_severity", "")
    gad_sev = data.get("gad_severity", "")

    # Severity ranking
    ranks = {"Minimal": 0, "Mild": 1, "Moderate": 2, "Moderately Severe": 3, "Severe": 4}

    # Choose the higher severity (whichever is worse)
    if ranks.get(phq_sev, 0) >= ranks.get(gad_sev, 0):
        chosen = phq_sev
    else:
        chosen = gad_sev

    tips = SUGGESTIONS.get(chosen, SUGGESTIONS["Minimal"])

    return jsonify({
        "severity": chosen,
        "recommendations": tips
    }), 200
