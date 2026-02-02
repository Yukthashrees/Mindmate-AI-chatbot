def score_phq9(answers):
    if len(answers) != 9:
        raise ValueError("PHQ-9 needs 9 answers.")
    total = sum(int(a) for a in answers)
    if total <= 4:
        severity = "Minimal"
    elif total <= 9:
        severity = "Mild"
    elif total <= 14:
        severity = "Moderate"
    elif total <= 19:
        severity = "Moderately Severe"
    else:
        severity = "Severe"
    return total, severity

def score_gad7(answers):
    if len(answers) != 7:
        raise ValueError("GAD-7 needs 7 answers.")
    total = sum(int(a) for a in answers)
    if total <= 4:
        severity = "Minimal"
    elif total <= 9:
        severity = "Mild"
    elif total <= 14:
        severity = "Moderate"
    else:
        severity = "Severe"
    return total, severity
