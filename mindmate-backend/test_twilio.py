from twilio.rest import Client
import os
from dotenv import load_dotenv

load_dotenv()  # loads .env from current folder

account_sid = os.getenv("TWILIO_ACCOUNT_SID")
auth_token = os.getenv("TWILIO_AUTH_TOKEN")
from_number = os.getenv("TWILIO_FROM_NUMBER")
to_number = os.getenv("ALERT_SMS_TO")

print("SID:", account_sid)
print("Token starts with:", auth_token[:4] if auth_token else None)

client = Client(account_sid, auth_token)

message = client.messages.create(
    body="MindMate test SMS – if you get this, Twilio is working 💛",
    from_=from_number,
    to=to_number,
)

print("Message SID:", message.sid)
