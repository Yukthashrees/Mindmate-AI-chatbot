# add to app.py (below your Flask app initialisation)
from flask import Flask, request, jsonify

# if you already have app = Flask(__name__) then put routes below that

@app.route("/api/assessments/phq9", methods=["POST"])
def phq9():
    data = request.get_json(silent=True) or {}
    answers = data.get("answers")
    if not isinstance(answers, list) or len(answers) != 9:
        return jsonify({"error":"answers must be an array of 9 integers (0-3)"}), 400
    try:
        answers_num = [int(x) for x in answers]
    except:
        return jsonify({"error":"invalid answer values"}), 400
    score = sum(answers_num)
    if score >= 20:
        severity = "Severe"
    elif score >= 15:
        severity = "Moderately severe"
    elif score >= 10:
        severity = "Moderate"
    elif score >= 5:
        severity = "Mild"
    else:
        severity = "Minimal"
    # recommendations
    rec = ""
    if severity in ("Severe","Moderately severe"):
        rec = "Immediate professional help recommended."
    elif severity == "Moderate":
        rec = "Consider therapy and self-care strategies."
    elif severity == "Mild":
        rec = "Self-care recommended."
    else:
        rec = "Minimal symptoms — keep monitoring."

    return jsonify({"score": score, "severity": severity, "recommendation": rec}), 200


@app.route("/api/assessments/gad7", methods=["POST"])
def gad7():
    data = request.get_json(silent=True) or {}
    answers = data.get("answers")
    if not isinstance(answers, list) or len(answers) != 7:
        return jsonify({"error":"answers must be an array of 7 integers (0-3)"}), 400
    try:
        answers_num = [int(x) for x in answers]
    except:
        return jsonify({"error":"invalid answer values"}), 400
    score = sum(answers_num)
    if score >= 15:
        severity = "Severe"
    elif score >= 10:
        severity = "Moderate"
    elif score >= 5:
        severity = "Mild"
    else:
        severity = "Minimal"
    rec = ""
    if severity in ("Severe","Moderate"):
        rec = "Consider professional advice and coping strategies."
    elif severity == "Mild":
        rec = "Self-care recommended."
    else:
        rec = "Minimal — keep monitoring."
    return jsonify({"score": score, "severity": severity, "recommendation": rec}), 200
