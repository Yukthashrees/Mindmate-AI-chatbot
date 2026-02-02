import boto3
import os

# AWS client
translate_client = boto3.client(
    "translate",
    region_name=os.getenv("AWS_REGION", "ap-south-1"),
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY")
)

def translate_text(text, source_lang, target_lang):
    if source_lang == target_lang:
        return text

    try:
        response = translate_client.translate_text(
            Text=text,
            SourceLanguageCode=source_lang,
            TargetLanguageCode=target_lang
        )
        return response["TranslatedText"]
    except Exception as e:
        print("Translate error:", str(e))
        return text  # fallback to original text
