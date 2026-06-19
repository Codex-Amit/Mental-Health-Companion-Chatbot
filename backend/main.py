"""
MindEase — FastAPI Backend (Groq)
"""

import os
import uuid
from typing import Optional
from datetime import datetime
from pathlib import Path
from dotenv import load_dotenv
# Load backend/.env regardless of launch directory
load_dotenv(dotenv_path=str(Path(__file__).resolve().parent / ".env"), override=True)

from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session                 # type: ignore # pip install sqlalchemy fixes Pylance warning

from models.schemas import (
    ChatRequest, ChatResponse, MoodHistory, MoodEntry,
    JournalEntry, JournalResponse, CheckInRequest, CheckInResponse
)
from agent.chatbot import chat, get_journal_reflection, get_checkin_message
from utils.sentiment import analyse_sentiment
from utils.database import (
    init_db, get_db, save_mood, get_mood_history,
    save_journal, get_journal_entries, save_checkin
)

app = FastAPI(title="MindEase API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

conversation_histories: dict = {}


@app.on_event("startup")
def startup() -> None:
    init_db()
    key = os.getenv("GROQ_API_KEY", "").strip()
    if not key:
        print("❌ ERROR: GROQ_API_KEY not found! Check backend/.env")
    else:
        print(f"✅ MindEase API started. Groq key loaded: {key[:8]}...{key[-4:]}")


@app.get("/")
def root() -> dict:
    return {"message": "MindEase API is running "}


@app.get("/health")
def health() -> dict:
    return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}


@app.get("/session/new")
def new_session() -> dict:
    return {"session_id": str(uuid.uuid4())}


@app.post("/chat", response_model=ChatResponse)
def chat_endpoint(req: ChatRequest, db: Session = Depends(get_db)) -> ChatResponse:
    history = conversation_histories.get(req.session_id, [])

    user_name: str = req.user_name if req.user_name is not None else "Friend"  # fixes None→str warning

    response = chat(
        message=req.message,
        history=history,
        user_name=user_name,
        session_id=req.session_id
    )
    history.append({"role": "user", "content": req.message})
    history.append({"role": "assistant", "content": response.reply})
    conversation_histories[req.session_id] = history[-20:]

    save_mood(
        db=db,
        session_id=req.session_id,
        sentiment_label=response.sentiment.label,
        sentiment_score=response.sentiment.score,
        emotion=response.sentiment.emotion,
        message_preview=req.message
    )
    return response


@app.get("/mood/history/{session_id}", response_model=MoodHistory)
def mood_history(session_id: str, db: Session = Depends(get_db)) -> MoodHistory:
    entries = get_mood_history(db, session_id)
    if not entries:
        return MoodHistory(entries=[], average_score=0.0, dominant_emotion="calm")

    mood_entries = [
        MoodEntry(
            session_id=e.session_id,
            sentiment_label=e.sentiment_label,
            sentiment_score=e.sentiment_score,
            emotion=e.emotion,
            message_preview=e.message_preview,
            timestamp=e.timestamp
        ) for e in entries
    ]

    avg_score = sum(e.sentiment_score for e in entries) / len(entries)

    emotion_counts: dict = {}
    for e in entries:
        emotion_counts[e.emotion] = emotion_counts.get(e.emotion, 0) + 1
    dominant: str = max(emotion_counts, key=lambda k: emotion_counts[k])  # fixes "max overload" warning

    return MoodHistory(
        entries=mood_entries,
        average_score=round(avg_score, 3),
        dominant_emotion=dominant
    )


@app.post("/journal", response_model=JournalResponse)
def create_journal(entry: JournalEntry, db: Session = Depends(get_db)) -> JournalResponse:
    sentiment = analyse_sentiment(entry.content)
    reflection = get_journal_reflection(entry.content)
    title: str = entry.title if entry.title else entry.content[:60] + "..."

    saved = save_journal(
        db=db,
        session_id=entry.session_id,
        title=title,
        content=entry.content,
        ai_reflection=reflection,
        sentiment_label=sentiment.label,
        sentiment_score=sentiment.score,
        emotion=sentiment.emotion
    )
    return JournalResponse(
        id=saved.id,
        title=saved.title,
        content=saved.content,
        ai_reflection=saved.ai_reflection,
        sentiment=sentiment,
        timestamp=saved.timestamp
    )


@app.get("/journal/{session_id}")
def list_journals(session_id: str, db: Session = Depends(get_db)) -> list:
    entries = get_journal_entries(db, session_id)
    return [
        {
            "id": e.id,
            "title": e.title,
            "content": e.content,
            "ai_reflection": e.ai_reflection,
            "sentiment_label": e.sentiment_label,
            "emotion": e.emotion,
            "timestamp": e.timestamp.isoformat()
        }
        for e in entries
    ]


@app.post("/checkin", response_model=CheckInResponse)
def daily_checkin(req: CheckInRequest, db: Session = Depends(get_db)) -> CheckInResponse:
    note: str = req.note if req.note is not None else ""  # fixes None→str warning
    result = get_checkin_message(req.mood_score, req.mood_label, note)
    save_checkin(db, req.session_id, req.mood_score, req.mood_label, note)

    sentiment_map = {1: "distressed", 2: "negative", 3: "neutral", 4: "positive", 5: "positive"}
    return CheckInResponse(
        message=result["message"],
        tip=result["tip"],
        sentiment_label=sentiment_map.get(req.mood_score, "neutral")
    )


@app.delete("/chat/history/{session_id}")
def clear_history(session_id: str) -> dict:
    conversation_histories.pop(session_id, None)
    return {"message": "Cleared."}