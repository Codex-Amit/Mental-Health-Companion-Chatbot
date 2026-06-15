"""
Sentiment Analysis Module
Combines VADER (rule-based) and TextBlob for robust mood detection.
"""

from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
from textblob import TextBlob
from models.schemas import SentimentResult


# Emotion keyword maps
EMOTION_KEYWORDS = {
    "anxious": [
        "anxious", "anxiety", "worried", "worry", "nervous", "panic",
        "scared", "fear", "overwhelmed", "dread", "uneasy", "tense"
    ],
    "stressed": [
        "stressed", "stress", "pressure", "deadline", "exam", "burden",
        "exhausted", "burnout", "overloaded", "tired", "hectic", "swamped"
    ],
    "lonely": [
        "lonely", "alone", "isolated", "no one", "nobody", "friendless",
        "left out", "abandoned", "disconnected", "miss", "missing"
    ],
    "sad": [
        "sad", "cry", "crying", "depressed", "hopeless", "helpless",
        "worthless", "miserable", "unhappy", "grief", "heartbroken", "hurt"
    ],
    "angry": [
        "angry", "anger", "frustrated", "furious", "annoyed", "rage",
        "irritated", "mad", "hate", "resentful"
    ],
    "happy": [
        "happy", "great", "good", "wonderful", "excited", "joy",
        "amazing", "fantastic", "love", "grateful", "thankful", "cheerful"
    ],
    "calm": [
        "calm", "okay", "fine", "alright", "peaceful", "relaxed",
        "neutral", "normal", "content", "stable", "manage"
    ],
}


def detect_emotion(text: str) -> str:
    """Detect the dominant emotion from text using keyword matching."""
    text_lower = text.lower()
    scores = {emotion: 0 for emotion in EMOTION_KEYWORDS}

    for emotion, keywords in EMOTION_KEYWORDS.items():
        for kw in keywords:
            if kw in text_lower:
                scores[emotion] += 1

    # Return dominant emotion or "calm" as default
    dominant = max(scores, key=scores.get)
    return dominant if scores[dominant] > 0 else "calm"


def analyse_sentiment(text: str) -> SentimentResult:
    """
    Analyse sentiment using VADER + TextBlob combination.

    Returns:
        SentimentResult with label, score (-1 to 1), and emotion
    """
    # VADER analysis
    vader = SentimentIntensityAnalyzer()
    vader_scores = vader.polarity_scores(text)
    compound = vader_scores["compound"]  # -1 (most negative) to +1 (most positive)

    # TextBlob analysis
    blob = TextBlob(text)
    tb_polarity = blob.sentiment.polarity  # -1 to 1

    # Weighted average: VADER is better for social/emotional text
    final_score = round((compound * 0.65) + (tb_polarity * 0.35), 3)

    # Determine label
    if final_score >= 0.3:
        label = "positive"
    elif final_score <= -0.5:
        label = "distressed"
    elif final_score <= -0.1:
        label = "negative"
    else:
        label = "neutral"

    emotion = detect_emotion(text)

    # Override label if strong negative emotion detected
    if emotion in ("sad", "anxious", "lonely") and final_score <= -0.3:
        label = "distressed"

    return SentimentResult(
        label=label,
        score=final_score,
        emotion=emotion
    )


def get_mood_emoji(sentiment: SentimentResult) -> str:
    """Return an emoji matching the detected mood."""
    emoji_map = {
        "happy": "😊",
        "calm": "😌",
        "neutral": "😐",
        "anxious": "😰",
        "stressed": "😤",
        "lonely": "🥺",
        "sad": "😢",
        "angry": "😠",
        "distressed": "💙",
    }
    if sentiment.label == "positive":
        return emoji_map.get(sentiment.emotion, "😊")
    if sentiment.label == "distressed":
        return "💙"
    return emoji_map.get(sentiment.emotion, "😐")
