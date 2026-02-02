# services/emotion_service.py
import boto3
import os
import re

comprehend_client = boto3.client(
    "comprehend",
    region_name=os.getenv("AWS_REGION", "ap-south-1"),
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY")
)

# English negative-keywords (expand as needed)
NEGATIVE_KEYWORDS_EN = [
    r"\bsad\b", r"\bstress(ed)?\b", r"\bdepress", r"\bsuicid", r"\bhopeless\b",
    r"\bcry(ing)?\b", r"\bcan't sleep\b", r"\bcan'?t sleep\b", r"\bpanic\b",
    r"\boverwhelm", r"\banxiet", r"\bhurt myself\b", r"\bkill myself\b"
]

# Some high-impact non-English keywords (examples) — expand for Kannada/Hindi/Tamil
NEGATIVE_KEYWORDS_OTHER = [
    # Hindi (Devanagari)
    r"हिंस", r"बेहोशी", r"उदास", r"तनाव", r"घुटन", r"सो नहीं", r"खुद को नुख्सान",
    # Kannada
    r"ದುಃಖ", r"ಒತ್ತಡ", r"ಉಳಿಯಲಾಗುತ್ತಿಲ್ಲ", r"ನಿದ್ದೆ ಇಲ್ಲ", r"ಸ್ವಾಹೆ", r"ಹ텐",
    # Add others you need
]

def contains_negative_keyword_any(text):
    if not text:
        return False
    s = text.lower()
    for pat in NEGATIVE_KEYWORDS_EN + NEGATIVE_KEYWORDS_OTHER:
        if re.search(pat, s):
            return True
    return False

def detect_emotion(original_text, english_text=None, sensitivity_threshold=0.30):
    """
    - original_text: the user's original message (any language)
    - english_text: translated text in English (if available)
    - sensitivity_threshold: Negative score threshold to mark NEGATIVE
    Returns one of: "NEGATIVE", "POSITIVE", "MIXED", "NEUTRAL"
    """
    # 1) Quick keyword override on original text (catch local language cues)
    try:
        if contains_negative_keyword_any(original_text):
            return "NEGATIVE"
    except Exception:
        pass

    # 2) If we have no english_text, set it to original_text (best-effort)
    if not english_text:
        english_text = original_text or ""

    # 3) Check keywords in translated English too
    try:
        if contains_negative_keyword_any(english_text):
            return "NEGATIVE"
    except Exception:
        pass

    # 4) Use AWS Comprehend numeric scores
    try:
        resp = comprehend_client.detect_sentiment(Text=english_text, LanguageCode="en")
        scores = resp.get("SentimentScore", {})
        neg = scores.get("Negative", 0.0)
        pos = scores.get("Positive", 0.0)
        neu = scores.get("Neutral", 0.0)
        mixed = scores.get("Mixed", 0.0)

        # If Negative score is highest and above threshold → NEGATIVE
        if neg >= max(pos, neu, mixed) and neg >= sensitivity_threshold:
            return "NEGATIVE"

        # Positive strong
        if pos >= max(neg, neu, mixed) and pos >= 0.65:
            return "POSITIVE"

        # Mixed detection
        if mixed >= 0.4:
            return "MIXED"

        return "NEUTRAL"

    except Exception as e:
        print("Comprehend error:", e)
        return "NEUTRAL"
NEGATIVE_KEYWORDS_OTHER = [
    # Kannada words / phrases (common negative cues)
    r"ದುಃಖ",         # sadness
    r"ಉದಾಸ",         # sad
    r"ಒತ್ತಡ",        # stress
    r"ದುಃಖವಾಗಿದೆ",
    r"ನಿದ್ದೆ ಇಲ್ಲ",    # can't sleep
    r"ನಿದ್ರೆ ಇಲ್ಲ",
    r"ಅನಿರೀಕ್ಷಿತ",    # distress-ish
    r"ಅವಮಾನ",        # humiliation
    r"ಬೇಸರ",         # upset
    r"ಹುನತು",         # pain (alt)
    r"ಆತ್ಮಹತ್ಯೆ",     # suicide
    r"ಸ್ವಾವಲಂಬನಕ್ಕೆ ತಾಕಲಾಟ"  # (rough phrases - add more as you find)
]
