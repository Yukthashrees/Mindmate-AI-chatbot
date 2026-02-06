def get_support_quote(severity):
    """Returns a supportive message based on the calculated severity."""
    quotes = {
        "Minimal": "You're doing well! Continue focusing on your self-care routines.",
        "Mild": "It's normal to feel a bit off sometimes. Try some light mindfulness or a short walk.",
        "Moderate": "You're going through a tough time. It might be helpful to talk to a trusted friend or professional.",
        "Moderately Severe": "Things feel heavy right now. Please consider reaching out to a mental health professional for support.",
        "Severe": "You are not alone. We are notifying your emergency contact so they can support you right now."
    }
    return quotes.get(severity, "Thank you for sharing how you feel. We are here for you.")

def score_phq9(answers):
    """Calculates PHQ-9 score, severity, and provides a quote."""
    if len(answers) != 9:
        raise ValueError("PHQ-9 needs exactly 9 answers.")
    
    total = sum(int(a) for a in answers)
    
    if total <= 4: severity = "Minimal"
    elif total <= 9: severity = "Mild"
    elif total <= 14: severity = "Moderate"
    elif total <= 19: severity = "Moderately Severe"
    else: severity = "Severe"
    
    quote = get_support_quote(severity)
    return total, severity, quote

def score_gad7(answers):
    """Calculates GAD-7 score, severity, and provides a quote."""
    if len(answers) != 7:
        raise ValueError("GAD-7 needs exactly 7 answers.")
    
    total = sum(int(a) for a in answers)
    
    if total <= 4: severity = "Minimal"
    elif total <= 9: severity = "Mild"
    elif total <= 14: severity = "Moderate"
    else: severity = "Severe"
    
    quote = get_support_quote(severity)
    return total, severity, quote