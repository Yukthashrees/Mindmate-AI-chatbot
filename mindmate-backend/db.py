# db.py
import os
from pymongo import MongoClient
from dotenv import load_dotenv
from datetime import datetime
from bson.objectid import ObjectId

load_dotenv()  # loads .env in project root

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
MONGO_DB = os.getenv("MONGO_DB", "mindmate")

client = MongoClient(MONGO_URI)
db = client[MONGO_DB]

# Collections
users_col = db["users"]
messages_col = db["messages"]
assessments_col = db["assessments"]

def create_user_if_missing(name, language="en"):
    """
    Returns user document (including _id string).
    Upserts by name — change to use unique userId in production.
    """
    doc = users_col.find_one_and_update(
        {"name": name},
        {"$setOnInsert": {"name": name, "language": language, "created_at": datetime.utcnow()}},
        upsert=True,
        return_document=True
    )
    # If find_one_and_update returns None in your pymongo version, fetch again:
    if doc is None:
        doc = users_col.find_one({"name": name})
    # Ensure string id
    if doc and "_id" in doc:
        doc["id"] = str(doc["_id"])
    return doc

def save_message(user_id, role, text, language=None, meta=None):
    rec = {
        "user_id": ObjectId(user_id) if user_id and ObjectId.is_valid(user_id) else None,
        "role": role,        # "user" or "bot" or "system"
        "text": text,
        "language": language,
        "meta": meta or {},
        "timestamp": datetime.utcnow()
    }
    res = messages_col.insert_one(rec)
    return str(res.inserted_id)

def save_assessment(user_id, test, score, severity, answers=None):
    rec = {
        "user_id": ObjectId(user_id) if user_id and ObjectId.is_valid(user_id) else None,
        "test": test,           # "PHQ-9" or "GAD-7"
        "score": int(score),
        "severity": severity,
        "answers": answers or [],
        "timestamp": datetime.utcnow()
    }
    res = assessments_col.insert_one(rec)
    return str(res.inserted_id)
