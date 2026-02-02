import boto3, os

polly = boto3.client(
    "polly",
    region_name=os.getenv("AWS_REGION"),
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY")
)

def synthesize_voice(text, voice="Joanna"):
    result = polly.synthesize_speech(
        Text=text,
        VoiceId=voice,
        OutputFormat="mp3"
    )
    return result["AudioStream"].read()
