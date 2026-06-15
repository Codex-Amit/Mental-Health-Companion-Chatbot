"""
Crisis Detector
Detects signs of severe distress or crisis in user messages.
Provides immediate helpline resources when triggered.
"""

CRISIS_KEYWORDS = [
    # Self-harm / suicidal ideation
    "kill myself", "end my life", "want to die", "suicidal", "suicide",
    "self harm", "self-harm", "cutting myself", "hurt myself",
    "no reason to live", "give up on life", "can't go on",
    "don't want to be here", "better off dead", "not worth living",
    # Severe hopelessness
    "completely hopeless", "nothing will ever", "no way out",
    "no one cares", "nobody cares if i die",
]

CRISIS_RESOURCES = [
    "📞 **iCall (India):** 9152987821 — Mon–Sat, 8am–10pm",
    "📞 **Vandrevala Foundation:** 1860-2662-345 — 24/7, free",
    "📞 **AASRA:** 9820466627 — 24/7",
    "💬 **iCall Chat:** https://icallhelpline.org",
    "🌐 **International:** https://findahelpline.com — find your local helpline",
]

CRISIS_MESSAGE = """I can hear that you're going through something really painful right now, and I'm genuinely concerned about you. 💙

**Please reach out to a real person right now** — you deserve real support:

{resources}

You don't have to face this alone. These are free, confidential, and available for students just like you. Will you reach out to one of them?"""


def detect_crisis(text: str) -> bool:
    """
    Return True if the message contains crisis-level distress signals.
    """
    text_lower = text.lower()
    return any(keyword in text_lower for keyword in CRISIS_KEYWORDS)


def get_crisis_response() -> dict:
    """
    Return crisis resources and a safe response message.
    """
    resources_text = "\n".join(CRISIS_RESOURCES)
    return {
        "message": CRISIS_MESSAGE.format(resources=resources_text),
        "resources": CRISIS_RESOURCES,
        "crisis_detected": True
    }
