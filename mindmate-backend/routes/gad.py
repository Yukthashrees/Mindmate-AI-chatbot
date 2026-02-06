from flask import Blueprint, request, jsonify
from services.scoring import score_gad7
from services.twilio_service import send_sms_alert

gad_bp = Blueprint('gad', __name__)

@gad_bp.route('/submit-gad', methods=['POST'])
def submit_gad():
    try:
        data = request.get_json()
        # For GAD, we calculate score from answers if score isn't pre-sent
        answers = data.get("answers", [])
        user_name = data.get("name", "User")

        # 1. ANALYZE
        total_score, severity, quote = score_gad7(answers)

        # 2. TRIGGER: Call SMS service with strings
        if severity == "Severe":
            print(f"🚨 SEVERE GAD DETECTED for {user_name}! Sending SMS...")
            send_sms_alert(user_name, total_score)

        return jsonify({
            "ok": True,
            "score": total_score,
            "severity": severity,
            "quote": quote
        })

    except Exception as e:
        print(f"❌ Error in GAD route: {e}")
        return jsonify({"ok": False, "error": str(e)}), 500