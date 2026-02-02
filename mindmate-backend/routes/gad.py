from flask import Blueprint, request, jsonify

gad_blueprint = Blueprint("gad", __name__)

@gad_blueprint.route("/api/assessments/gad7", methods=["POST"])
def gad7():
    raw = request.get_data(as_text=True)
    try:
        data = request.get_json(force=True)
    except Exception as e:
        return jsonify({"error": "Invalid JSON", "detail": str(e), "raw": raw}), 400

    answers = data.get("answers") if isinstance(data, dict) else None
    if not isinstance(answers, list) or len(answers) != 7:
        return jsonify({"error": "answers must be a list of 7 integers", "raw": raw, "parsed": data}), 400

    try:
        answers = [int(x) for x in answers]
    except Exception:
        return jsonify({"error": "answers must be integers", "raw": raw, "parsed": data}), 400

    score = sum(answers)
    return jsonify({"score": score, "severity": "debug", "risk_flag": False})
def gad_severity(score):
    if score >= 15: return "Severe"
    if score >= 10: return "Moderate"
    if score >= 5: return "Mild"
    return "Minimal"

