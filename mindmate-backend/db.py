import os
from pymongo import MongoClient
from datetime import datetime
from bson.objectid import ObjectId

# Use the exact same DB name as your working app.py

MONGO_URI = os.environ.get("MONGO_URI", "mongodb://localhost:27017/")
MONGO_DB = "mindmate_db" 

client = MongoClient(MONGO_URI)
db = client[MONGO_DB]

# Collections matching your Compass view
users_col = db["users"]
safety_col = db["safety_contacts"]
assessments_col = db["assessments"]
messages_col = db["messages"]

def save_message(user_id, role, text):
    rec = {
        "user_id": ObjectId(user_id) if user_id and ObjectId.is_valid(user_id) else None,
        "role": role,
        "text": text,
        "timestamp": datetime.utcnow()
    }
    return messages_col.insert_one(rec).inserted_id