from flask import Blueprint, request, jsonify
from services.scoring import score_phq9, score_gad7

bp = Blueprint("screening", __name__, url_prefix="/screening")

@bp.route('/submit', methods=['POST'])
def submit_screening():
    data = request.get_json()
    phq9 = data.get("phq9", [])
    gad7 = data.get("gad7", [])

    phq_total, phq_severity = score_phq9(phq9)
    gad_total, gad_severity = score_gad7(gad7)

    result = {
        "phq_total": phq_total,
        "phq_severity": phq_severity,
        "gad_total": gad_total,
        "gad_severity": gad_severity
    }
    return jsonify(result), 200
