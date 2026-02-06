from dotenv import load_dotenv
load_dotenv()  # This MUST be at the top
import os
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient

from twilio.rest import Client as TwilioClient
from bson import ObjectId

# 1. INITIALIZATION: Load env before anything else
basedir = os.path.abspath(os.path.dirname(__file__))

print(f"DEBUG: Looking for .env in: {os.path.join(basedir, '.env')}")
print(f"DEBUG: ALERT_SMS_TO value: {os.getenv('ALERT_SMS_TO')}")

# --- BLUEPRINT IMPORTS ---
from routes.chat import chat_bp
from routes.phq import phq_bp
from routes.gad import gad_bp
from services.twilio_service import send_sms_alert

app = Flask(__name__)

# --- CONFIGURATION ---
CORS(app, resources={r"/api/*": {"origins": "*"}})

# --- BLUEPRINT REGISTRATION (The missing step causing 404s) ---
app.register_blueprint(chat_bp, url_prefix='/api')
app.register_blueprint(phq_bp, url_prefix='/api')
app.register_blueprint(gad_bp, url_prefix='/api')

# MongoDB Connection
MONGO_URI = os.environ.get("MONGO_URI")
DB_NAME = os.getenv("DB_NAME", "mindmate")
client = MongoClient(MONGO_URI)
db = client.get_database("MindMateDB")

# Collections
users_col = db["users"]
assessments_col = db["assessments"]
alerts_col = db["alerts"]

# --- HELPERS ---

def create_alert_if_needed(assessment_doc):
    """Triggers SMS when a severe score is detected."""
    if assessment_doc.get("severityKey") == "Severe":
        client_id = assessment_doc.get("clientId")
        user = users_col.find_one({"clientId": client_id})
        user_name = user.get("name") if user else "A user"
        
        alert_doc = {
            "clientId": client_id,
            "userName": user_name,
            "score": assessment_doc.get("score"),
            "type": assessment_doc.get("type"),
            "severityKey": "Severe",
            "createdAt": datetime.utcnow(),
            "handled": False
        }
        
        alerts_col.insert_one(alert_doc)
        # Fix: Pass strings directly to avoid parameter errors
        send_sms_alert(user_name, assessment_doc.get("score"))
        print(f"🚨 Severe Alert triggered for {user_name}")

# --- ROUTES ---

@app.route("/api/save-patient", methods=["POST", "OPTIONS"])
def save_patient():
    if request.method == "OPTIONS":
        return jsonify({"status": "ok"}), 200
        
    try:
        data = request.get_json(force=True)
        name = data.get("name")
        client_id = data.get("clientId")

        users_col.update_one(
            {"name": name},
            {"$set": {"name": name, "clientId": client_id, "updatedAt": datetime.utcnow()}},
            upsert=True
        )
        print(f"✅ Data saved for {name}")
        return jsonify({"ok": True}), 201
    except Exception as e:
        print(f"❌ Save Error: {e}")
        return jsonify({"error": str(e)}), 500

@app.route("/api/assessment", methods=["POST"])
def save_assessment():
    try:
        data = request.get_json(force=True)
        doc = {
            "clientId": data.get("clientId"),
            "type": data.get("type"),
            "score": data.get("score"),
            "severityKey": data.get("severityKey"),
            "createdAt": datetime.utcnow()
        }
        
        assessments_col.insert_one(doc)
        
        if doc["severityKey"] == "Severe":
            create_alert_if_needed(doc)

        return jsonify({"ok": True}), 201
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000, host='127.0.0.1')