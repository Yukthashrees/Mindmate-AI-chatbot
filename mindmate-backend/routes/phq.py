from flask import Blueprint, request, jsonify
from services.twilio_service import send_sms_alert

phq_bp = Blueprint('phq', __name__)

@phq_bp.route('/submit-phq', methods=['POST'])
def submit_phq():
    try:
        data = request.get_json()
        score = data.get('score')
        name = data.get('name', 'User')

        # Logic to trigger SMS if score is severe
        if score is not None and score >= 20:
            # Pass name and score directly to the service
            send_sms_alert(name, score)
            print(f"✅ SMS Alert triggered for {name}")

        return jsonify({"status": "success", "score": score}), 200
    except Exception as e:
        print(f"❌ Error in PHQ route: {str(e)}")
        return jsonify({"error": str(e)}), 500