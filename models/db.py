from pymongo import MongoClient
import os
from dotenv import load_dotenv

# Load variables from .env file
load_dotenv()

MONGODB_URI = os.getenv("MONGODB_URI")
DB_NAME = os.getenv("DB_NAME")

try:
    client = MongoClient(MONGODB_URI)
    db = client[DB_NAME]

    # Collections
    screenings_col = db["screenings"]
    chats_col = db["chats"]
    alerts_col = db["alerts"]

    print("✅ Connected to MongoDB successfully!")

except Exception as e:
    print("❌ Failed to connect to MongoDB:", e)