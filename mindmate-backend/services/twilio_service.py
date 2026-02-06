import os
from twilio.rest import Client

def send_sms_alert(user_name, score):
    # Fetch credentials
    account_sid = os.getenv('TWILIO_ACCOUNT_SID')
    auth_token = os.getenv('TWILIO_AUTH_TOKEN')
    from_num = os.getenv('TWILIO_FROM_NUMBER')
    to_num = os.getenv('ALERT_SMS_TO') # This is your +917892229321

    # Debugging print to terminal
    print(f"DEBUG: Attempting SMS to {to_num} from {from_num}")

    if not to_num:
        print("❌ Error: ALERT_SMS_TO is missing in .env")
        return

    try:
        client = Client(account_sid, auth_token)
        message = client.messages.create(
            body=f"🚨 MindMate Alert: {user_name} has a severe assessment score of {score}. Please check in on them.",
            from_=from_num,
            to=to_num
        )
        print(f"✅ SMS Sent! SID: {message.sid}")
    except Exception as e:
        print(f"❌ Twilio Failed: {str(e)}")