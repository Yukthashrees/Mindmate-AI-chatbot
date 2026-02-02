from flask import Blueprint, request, jsonify

phq_blueprint = Blueprint("phq", __name__)

@phq_blueprint.route("/api/assessments/phq9", methods=["POST"])
def phq9():
    raw = request.get_data(as_text=True)
    try:
        data = request.get_json(force=True)
    except Exception as e:
        return jsonify({"error": "Invalid JSON", "detail": str(e), "raw": raw}), 400

    answers = data.get("answers") if isinstance(data, dict) else None
    if not isinstance(answers, list) or len(answers) != 9:
        return jsonify({"error": "answers must be a list of 9 integers", "raw": raw, "parsed": data}), 400

    try:
        answers = [int(x) for x in answers]
    except Exception:
        return jsonify({"error": "answers must be integers", "raw": raw, "parsed": data}), 400

    score = sum(answers)
    # short response
    return jsonify({"score": score, "severity": "debug", "risk_flag": False})

def phq_severity(score):
    if score >= 20: return "Severe"
    if score >= 15: return "Moderately severe"
    if score >= 10: return "Moderate"
    if score >= 5: return "Mild"
    return "Minimal"
