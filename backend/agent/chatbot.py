"""
MindEase Chatbot — Groq only
"""

import os
import json
from pathlib import Path
from dotenv import load_dotenv

# Always load from backend/.env regardless of where uvicorn is launched from
_backend_dir = Path(__file__).resolve().parent.parent  # agent/ -> backend/
load_dotenv(dotenv_path=str(_backend_dir / ".env"), override=True)

from openai import OpenAI
from utils.sentiment import analyse_sentiment, get_mood_emoji
from utils.relaxation import get_relaxation_tip
from agent.crisis_detector import detect_crisis, get_crisis_response
from models.schemas import ChatResponse

MODEL: str = os.getenv("GROQ_MODEL") or "llama-3.1-8b-instant"


def _get_client() -> OpenAI:
    """Create Groq client fresh each call — key always read from env."""
    api_key = os.getenv("GROQ_API_KEY", "").strip()
    if not api_key:
        raise RuntimeError(
            "GROQ_API_KEY is not set. "
            "Add it to backend/.env (get a free key at https://console.groq.com/keys)"
        )
    return OpenAI(api_key=api_key, base_url="https://api.groq.com/openai/v1")


SYSTEM_PROMPT = """You are MindEase, a warm, empathetic AI mental wellness companion for college students.

Your personality:
- Deeply empathetic and non-judgmental
- Warm and conversational — like a caring senior student
- You validate feelings FIRST before offering advice
- Simple, relatable language — no medical jargon
- Occasionally use gentle emojis

Your rules:
- NEVER diagnose or replace professional care
- Always acknowledge and validate what the person said before responding
- Keep responses to 3-5 sentences
- End with a gentle question or encouraging note

Remember: You are a compassionate friend, not a therapist."""


def chat(message: str, history: list, user_name: str = "Friend", session_id: str = "default") -> ChatResponse:
    sentiment = analyse_sentiment(message)
    mood_emoji = get_mood_emoji(sentiment)

    if detect_crisis(message):
        crisis_data = get_crisis_response()
        return ChatResponse(
            reply=crisis_data["message"],
            sentiment=sentiment,
            relaxation_tip=None,
            crisis_detected=True,
            crisis_resources=crisis_data["resources"],
            mood_emoji="🤖"
        )

    relaxation_tip = None
    if sentiment.label in ("negative", "distressed") or sentiment.emotion in (
        "anxious", "stressed", "lonely", "sad", "angry"
    ):
        relaxation_tip = get_relaxation_tip(sentiment.emotion)

    messages = [{"role": "system", "content": SYSTEM_PROMPT}]
    messages.append({
        "role": "system",
        "content": f"[User emotion: {sentiment.emotion}. Address them as {user_name}.]"
    })
    for turn in history[-10:]:
        messages.append({"role": turn["role"], "content": turn["content"]})
    messages.append({"role": "user", "content": message})

    client = _get_client()
    response = client.chat.completions.create(
        model=MODEL,
        messages=messages,
        max_tokens=300,
        temperature=0.75
    )
    reply = (response.choices[0].message.content or "").strip()

    return ChatResponse(
        reply=reply,
        sentiment=sentiment,
        relaxation_tip=relaxation_tip,
        crisis_detected=False,
        crisis_resources=None,
        mood_emoji=mood_emoji
    )


def get_journal_reflection(content: str) -> str:
    client = _get_client()
    response = client.chat.completions.create(
        model=MODEL,
        messages=[
            {"role": "system", "content": "You are a compassionate journaling companion."},
            {"role": "user", "content": f'A student wrote: "{content}"\n\nWrite a warm 2-3 sentence reflection. Acknowledge their feelings and end with encouragement.'}
        ],
        max_tokens=200,
        temperature=0.7
    )
    return (response.choices[0].message.content or "").strip()


def get_checkin_message(mood_score: int, mood_label: str, note: str = "") -> dict:
    note_text = f' They added: "{note}"' if note else ""
    client = _get_client()
    response = client.chat.completions.create(
        model=MODEL,
        messages=[{
            "role": "user",
            "content": f'Student mood: {mood_score}/5 ({mood_label}).{note_text}\nRespond with JSON only: {{"message": "...", "tip": "..."}}'
        }],
        max_tokens=200,
        temperature=0.7
    )
    raw = (response.choices[0].message.content or "{}").strip()

    if "```" in raw:
        raw = raw.split("```")[1]
        if raw.startswith("json"):
            raw = raw[4:]

    try:
        return json.loads(raw)
    except Exception:
        return {
            "message": "Thanks for checking in! Every step counts.",
            "tip": "Take a deep breath and be kind to yourself today."
        }
