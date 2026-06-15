"""
Pydantic schemas for request/response validation.
"""

from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class ChatRequest(BaseModel):
    message: str
    session_id: str
    user_name: Optional[str] = "Friend"


class SentimentResult(BaseModel):
    label: str          # positive / negative / neutral / distressed
    score: float        # -1.0 to 1.0
    emotion: str        # happy / sad / anxious / stressed / lonely / calm


class ChatResponse(BaseModel):
    reply: str
    sentiment: SentimentResult
    relaxation_tip: Optional[str] = None
    crisis_detected: bool = False
    crisis_resources: Optional[List[str]] = None
    mood_emoji: str = "😊"


class MoodEntry(BaseModel):
    session_id: str
    sentiment_label: str
    sentiment_score: float
    emotion: str
    message_preview: str
    timestamp: Optional[datetime] = None


class MoodHistory(BaseModel):
    entries: List[MoodEntry]
    average_score: float
    dominant_emotion: str


class JournalEntry(BaseModel):
    session_id: str
    content: str
    title: Optional[str] = None


class JournalResponse(BaseModel):
    id: int
    title: str
    content: str
    ai_reflection: str
    sentiment: SentimentResult
    timestamp: datetime


class CheckInRequest(BaseModel):
    session_id: str
    mood_score: int       # 1 (very bad) to 5 (great)
    mood_label: str       # terrible / bad / okay / good / great
    note: Optional[str] = None


class CheckInResponse(BaseModel):
    message: str
    tip: str
    sentiment_label: str
