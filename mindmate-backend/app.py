# app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from datetime import datetime
import os

from dotenv import load_dotenv
load_dotenv()

# --- Twilio + email imports ---
from twilio.rest import Client as TwilioClient
import smtplib
from email.mime.text import MIMEText
from bson import ObjectId

# --------- CONFIG ---------
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
DB_NAME = os.getenv("MONGO_DB_NAME", "mindmate_db")

# simple admin auth
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "admin123")
ADMIN_KEY = os.getenv("ADMIN_KEY", "dev-admin-key")

# --- SMS config (Twilio) ---
TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID")
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
TWILIO_FROM_NUMBER = os.getenv("TWILIO_FROM_NUMBER")  # Twilio phone
ALERT_SMS_TO = os.getenv("ALERT_SMS_TO")              # Your phone / therapist phone
print("DEBUG: TWILIO_ACCOUNT_SID =", TWILIO_ACCOUNT_SID)
print("DEBUG: TWILIO_AUTH_TOKEN  =", TWILIO_AUTH_TOKEN)
print("DEBUG: TWILIO_FROM_NUMBER =", TWILIO_FROM_NUMBER)
print("DEBUG: ALERT_SMS_TO       =", ALERT_SMS_TO)


# ---- MONGO ----
client = MongoClient(MONGO_URI)
db = client[DB_NAME]

users_col = db["users"]
safety_col = db["safety_contacts"]
assessments_col = db["assessments"]
alerts_col = db["alerts"]

app = Flask(__name__)

# allow React dev server
CORS(
    app,
    origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    supports_credentials=True,
)


def get_json():
    """Safe JSON parser."""
    try:
        return request.get_json(force=True)
    except Exception:
        return {}


# ========== ADMIN HELPERS ==========

def require_admin():
    """Very simple header-based admin check."""
    key = request.headers.get("x-admin-key")
    if not key or key != ADMIN_KEY:
        return False
    return True


def make_admin_error():
    return jsonify({"ok": False, "error": "Admin auth required"}), 401


# ========== BASIC HEALTH CHECK ==========

@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"ok": True, "status": "MindMate backend alive"}), 200


# ========== ADMIN LOGIN ==========

@app.route("/api/admin/login", methods=["POST"])
def admin_login():
    """
    Body:
      { "password": "..." }

    If password matches ADMIN_PASSWORD, returns adminKey to use in x-admin-key header.
    """
    data = get_json()
    pwd = data.get("password") or ""
    if pwd != ADMIN_PASSWORD:
        return jsonify({"ok": False, "error": "Invalid password"}), 401

    return jsonify({"ok": True, "adminKey": ADMIN_KEY}), 200


# ========== USER + SAFETY CONTACT ==========

@app.route("/api/user/safety", methods=["POST"])
def save_safety():
    """
    Body:
    {
      "clientId": "mm_xxx",
      "name": "Yuktha",
      "contactName": "Bestie",
      "relation": "Friend",
      "contactDetail": "9876543210 / insta id"
    }
    """
    data = get_json()

    client_id = data.get("clientId")
    name = (data.get("name") or "").strip()
    contact_name = (data.get("contactName") or "").strip()
    relation = (data.get("relation") or "").strip()
    contact_detail = (data.get("contactDetail") or "").strip()

    if not client_id:
        return jsonify({"ok": False, "error": "clientId is required"}), 400

    # upsert user basic info
    users_col.update_one(
        {"clientId": client_id},
        {
            "$set": {
                "clientId": client_id,
                "name": name,
                "updatedAt": datetime.utcnow(),
            },
            "$setOnInsert": {
                "createdAt": datetime.utcnow(),
            },
        },
        upsert=True,
    )

    # upsert safety contact (1 per client)
    safety_col.update_one(
        {"clientId": client_id},
        {
            "$set": {
                "clientId": client_id,
                "contactName": contact_name,
                "relation": relation,
                "contactDetail": contact_detail,
                "updatedAt": datetime.utcnow(),
            },
            "$setOnInsert": {
                "createdAt": datetime.utcnow(),
            },
        },
        upsert=True,
    )

    return jsonify({"ok": True, "message": "Safety contact saved"}), 200


@app.route("/api/user/safety/<client_id>", methods=["GET"])
def get_safety(client_id):
    """
    Used in Chat.jsx to pre-fill safety info when the user returns.
    """
    safety = safety_col.find_one({"clientId": client_id}, {"_id": 0})
    user = users_col.find_one({"clientId": client_id}, {"_id": 0, "name": 1})

    return jsonify(
        {
            "ok": True,
            "user": user or {},
            "safety": safety or {},
        }
    ), 200


# ========== ALERT NOTIFICATION HELPERS (SMS + EMAIL) ==========
def send_sms_alert(alert_doc):
    """
    Sends a short, trial-safe SMS alert when severity is severe.
    Twilio trial cannot send long or multi-segment SMS to India,
    so this message is kept under 160 chars.
    """
    if not (TWILIO_ACCOUNT_SID and TWILIO_AUTH_TOKEN and TWILIO_FROM_NUMBER and ALERT_SMS_TO):
        print("[SMS] Skipped: Twilio env vars missing")
        return

    try:
        twilio_client = TwilioClient(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

        user_name = alert_doc.get("userName") or "User"
        assessment_type = alert_doc.get("assessmentType") or "Test"
        score = alert_doc.get("score")
        max_score = alert_doc.get("max")

        # 🔥 Short, single-line, <160 chars, trial-safe
        body = (
            f"MindMate Alert: Severe {assessment_type}. "
            f"{user_name} scored {score}/{max_score}. "
            f"Please contact {user_name} & stay with them."
        )

        message = twilio_client.messages.create(
            body=body,
            from_=TWILIO_FROM_NUMBER,
            to=ALERT_SMS_TO,
        )

        print("[SMS] Sent alert, sid:", message.sid)

    except Exception as e:
        print("[SMS] Error sending alert:", e)



def send_email_alert(alert_doc):
    """
    Sends a detailed email when a severe score is recorded.
    """
    if not (SMTP_HOST and SMTP_USER and SMTP_PASS and ALERT_EMAIL_FROM and ALERT_EMAIL_TO):
        print("[Email] Skipped: SMTP or alert email not configured")
        return

    user_name = alert_doc.get("userName") or "Unknown user"
    client_id = alert_doc.get("clientId")
    assessment_type = alert_doc.get("assessmentType")
    score = alert_doc.get("score")
    max_score = alert_doc.get("max")
    severity_key = alert_doc.get("severityKey")
    created_at = alert_doc.get("createdAt")

    safety = alert_doc.get("safetyContact") or {}
    safety_name = safety.get("contactName") or "N/A"
    safety_relation = safety.get("relation") or "N/A"
    safety_detail = safety.get("contactDetail") or "N/A"

    subject = f"[MindMate] Severe {assessment_type} score alert"

    body = f"""
A user on MindMate recorded a severe score.

User:
  Name: {user_name}
  Client ID: {client_id}

Assessment:
  Type: {assessment_type}
  Score: {score}/{max_score}
  Severity: {severity_key}
  Time (UTC): {created_at}

Saved safety contact (if any):
  Name: {safety_name}
  Relation: {safety_relation}
  Detail: {safety_detail}

This email is only a notification. Please use your own judgment,
ethics and protocols when deciding whether and how to reach out.
"""

    msg = MIMEText(body)
    msg["Subject"] = subject
    msg["From"] = ALERT_EMAIL_FROM
    msg["To"] = ALERT_EMAIL_TO

    try:
        with smtplib.SMTP(SMTP_HOST, SMTP_PORT) as server:
            server.starttls()
            server.login(SMTP_USER, SMTP_PASS)
            server.sendmail(ALERT_EMAIL_FROM, [ALERT_EMAIL_TO], msg.as_string())
        print("[Email] Sent severe score alert email")
    except Exception as e:
        print("[Email] Error sending alert:", e)


# ========== ALERT CREATION (ONLY WHEN SEVERE) ==========

def create_alert_if_needed(assessment_doc):
    """
    If severity is 'severe', create an alert document and trigger SMS/email.
    """
    # 🔥 THIS IS THE LINE YOU ASKED ABOUT:
    if assessment_doc.get("severityKey") != "severe":
        # if not severe, we do nothing
        return

    client_id = assessment_doc.get("clientId")
    safety = safety_col.find_one({"clientId": client_id})
    user = users_col.find_one({"clientId": client_id})

    alert_doc = {
        "clientId": client_id,
        "userName": (user or {}).get("name"),
        "assessmentType": assessment_doc.get("type"),
        "score": assessment_doc.get("score"),
        "max": assessment_doc.get("max"),
        "severityKey": assessment_doc.get("severityKey"),
        "createdAt": datetime.utcnow(),
        "safetyContact": {
            "contactName": (safety or {}).get("contactName"),
            "relation": (safety or {}).get("relation"),
            "contactDetail": (safety or {}).get("contactDetail"),
        },
        "handled": False,
        "handledNote": None,
        "handledAt": None,
    }

    alerts_col.insert_one(alert_doc)

    # send SMS + email notification (best-effort, errors just logged)
    try:
        send_sms_alert(alert_doc)
    except Exception as e:
        print("[Alert] SMS sending failed:", e)

    try:
        send_email_alert(alert_doc)
    except Exception as e:
        print("[Alert] Email sending failed:", e)


# ========== PHQ / GAD ASSESSMENTS ==========

@app.route("/api/assessment", methods=["POST"])
def save_assessment():
    """
    Body from frontend:
    {
      "clientId": "mm_xxx",
      "type": "PHQ" | "GAD",
      "score": 12,
      "max": 27,
      "severityKey": "moderate",
      "answers": [0,1,2,3,...]
    }
    """
    data = get_json()

    client_id = data.get("clientId")
    test_type = data.get("type")  # "PHQ" or "GAD"
    score = data.get("score")
    max_score = data.get("max")
    severity_key = data.get("severityKey")
    answers = data.get("answers", [])

    if not client_id or not test_type or score is None:
        return (
            jsonify(
                {"ok": False, "error": "clientId, type and score are required"}
            ),
            400,
        )

    doc = {
        "clientId": client_id,
        "type": test_type,
        "score": score,
        "max": max_score,
        "severityKey": severity_key,
        "answers": answers,
        "createdAt": datetime.utcnow(),
    }

    assessments_col.insert_one(doc)

    # create alert if severe (this will also trigger SMS/email)
    create_alert_if_needed(doc)

    return jsonify({"ok": True, "message": "Assessment saved"}), 201


@app.route("/api/assessment/<client_id>", methods=["GET"])
def get_assessments_for_client(client_id):
    """
    For future: view one user's history if needed.
    """
    cursor = assessments_col.find({"clientId": client_id}, {"_id": 0}).sort(
        "createdAt", -1
    )
    items = list(cursor)
    return jsonify({"ok": True, "items": items}), 200


# ========== ADMIN DASHBOARD ENDPOINTS ==========

@app.route("/api/admin/assessments", methods=["GET"])
def admin_list_assessments():
    """
    Query params:
      - clientId (optional)
      - type (optional) = PHQ or GAD
      - limit (optional, default 50)
    """
    if not require_admin():
        return make_admin_error()

    client_id = request.args.get("clientId")
    test_type = request.args.get("type")
    try:
        limit = int(request.args.get("limit", "50"))
    except ValueError:
        limit = 50

    query = {}
    if client_id:
        query["clientId"] = client_id
    if test_type:
        query["type"] = test_type

    cursor = (
        assessments_col.find(query)
        .sort("createdAt", -1)
        .limit(limit)
    )

    items = []
    for doc in cursor:
        doc["_id"] = str(doc["_id"])
        items.append(doc)

    return jsonify({"ok": True, "items": items}), 200


@app.route("/api/admin/summary", methods=["GET"])
def admin_summary():
    """
    Returns aggregate information:
      - total users
      - total assessments
      - severe counts
      - average scores for PHQ and GAD
    """
    if not require_admin():
        return make_admin_error()

    total_users = users_col.count_documents({})
    total_assessments = assessments_col.count_documents({})

    severe_count = assessments_col.count_documents({"severityKey": "severe"})

    def avg_score(test_type):
        pipeline = [
            {"$match": {"type": test_type}},
            {
                "$group": {
                    "_id": None,
                    "avgScore": {"$avg": "$score"},
                }
            },
        ]
        result = list(assessments_col.aggregate(pipeline))
        if result:
            return result[0]["avgScore"]
        return None

    avg_phq = avg_score("PHQ")
    avg_gad = avg_score("GAD")

    return jsonify(
        {
            "ok": True,
            "totalUsers": total_users,
            "totalAssessments": total_assessments,
            "severeAssessments": severe_count,
            "avgPHQ": avg_phq,
            "avgGAD": avg_gad,
        }
    ), 200


@app.route("/api/admin/alerts", methods=["GET"])
def admin_list_alerts():
    """
    Returns severe-score alerts.
    Query:
      - handled (optional) = true/false
    """
    if not require_admin():
        return make_admin_error()

    handled_param = request.args.get("handled")
    query = {}
    if handled_param is not None:
        if handled_param.lower() == "true":
            query["handled"] = True
        elif handled_param.lower() == "false":
            query["handled"] = False

    cursor = alerts_col.find(query).sort("createdAt", -1)
    items = []
    for doc in cursor:
        doc["_id"] = str(doc["_id"])
        items.append(doc)

    return jsonify({"ok": True, "items": items}), 200


@app.route("/api/admin/alerts/<alert_id>/resolve", methods=["POST"])
def admin_resolve_alert(alert_id):
    """
    Mark an alert as handled.
    Body:
      { "note": "Called guardian, they are aware" }
    """
    if not require_admin():
        return make_admin_error()

    data = get_json()
    note = data.get("note")

    try:
        _id = ObjectId(alert_id)
    except Exception:
        return jsonify({"ok": False, "error": "Invalid alert id"}), 400

    res = alerts_col.update_one(
        {"_id": _id},
        {
            "$set": {
                "handled": True,
                "handledNote": note,
                "handledAt": datetime.utcnow(),
            }
        },
    )

    if res.matched_count == 0:
        return jsonify({"ok": False, "error": "Alert not found"}), 404

    return jsonify({"ok": True, "message": "Alert marked as handled"}), 200


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
