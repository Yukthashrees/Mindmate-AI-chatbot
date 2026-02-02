#test_translate.py
import os, boto3, json

print("AWS_REGION:", os.getenv("AWS_REGION"))
print("AWS_ACCESS_KEY_ID present:", bool(os.getenv("AWS_ACCESS_KEY_ID")))

translate = boto3.client(
    "translate",
    region_name=os.getenv("AWS_REGION", "ap-south-1"),
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY")
)

text_kn = "ನನಗೆ ತುಂಬಾ ಒತ್ತಡವಾಗಿದೆ ಮತ್ತು ನಿದ್ರೆ ಇಲ್ಲ"  # "I feel very stressed and can't sleep"
try:
    resp = translate.translate_text(Text=text_kn, SourceLanguageCode="kn", TargetLanguageCode="en")
    print("Translate response keys:", resp.keys())
    print("Translated text:", resp.get("TranslatedText"))
except Exception as e:
    print("Translate error:", repr(e))

try:
    resp = translate.translate_text(Text=text_kn, SourceLanguageCode="kn", TargetLanguageCode="en")
    print("Translate response keys:", resp.keys())
    print("Translated text:", resp.get("TranslatedText"))
except Exception as e:
    print("Translate error:", repr(e))
