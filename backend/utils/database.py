"""
Database Operations — SQLite via SQLAlchemy
Stores mood history, chat sessions, and journal entries.
"""

import os
from datetime import datetime
from sqlalchemy import create_engine, Column, Integer, String, Float, Text, DateTime, Boolean # type: ignore
from sqlalchemy.orm import declarative_base, sessionmaker # pyright: ignore[reportMissingImports]

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./mindease.db")

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


# ─── ORM Models ────────────────────────────────────────────────────────────────

class MoodLog(Base):
    __tablename__ = "mood_logs"
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String, index=True)
    sentiment_label = Column(String)
    sentiment_score = Column(Float)
    emotion = Column(String)
    message_preview = Column(String(200))
    timestamp = Column(DateTime, default=datetime.utcnow)


class JournalLog(Base):
    __tablename__ = "journal_entries"
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String, index=True)
    title = Column(String(200))
    content = Column(Text)
    ai_reflection = Column(Text)
    sentiment_label = Column(String)
    sentiment_score = Column(Float)
    emotion = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)


class DailyCheckIn(Base):
    __tablename__ = "daily_checkins"
    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String, index=True)
    mood_score = Column(Integer)          # 1–5
    mood_label = Column(String)
    note = Column(String(500), nullable=True)
    timestamp = Column(DateTime, default=datetime.utcnow)


# ─── Init ──────────────────────────────────────────────────────────────────────

def init_db():
    Base.metadata.create_all(bind=engine)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ─── CRUD Operations ───────────────────────────────────────────────────────────

def save_mood(db, session_id: str, sentiment_label: str, sentiment_score: float,
              emotion: str, message_preview: str):
    entry = MoodLog(
        session_id=session_id,
        sentiment_label=sentiment_label,
        sentiment_score=sentiment_score,
        emotion=emotion,
        message_preview=message_preview[:200],
        timestamp=datetime.utcnow()
    )
    db.add(entry)
    db.commit()
    return entry


def get_mood_history(db, session_id: str, limit: int = 30):
    return (
        db.query(MoodLog)
        .filter(MoodLog.session_id == session_id)
        .order_by(MoodLog.timestamp.desc())
        .limit(limit)
        .all()
    )


def save_journal(db, session_id: str, title: str, content: str,
                 ai_reflection: str, sentiment_label: str,
                 sentiment_score: float, emotion: str):
    entry = JournalLog(
        session_id=session_id,
        title=title,
        content=content,
        ai_reflection=ai_reflection,
        sentiment_label=sentiment_label,
        sentiment_score=sentiment_score,
        emotion=emotion,
        timestamp=datetime.utcnow()
    )
    db.add(entry)
    db.commit()
    db.refresh(entry)
    return entry


def get_journal_entries(db, session_id: str, limit: int = 20):
    return (
        db.query(JournalLog)
        .filter(JournalLog.session_id == session_id)
        .order_by(JournalLog.timestamp.desc())
        .limit(limit)
        .all()
    )


def save_checkin(db, session_id: str, mood_score: int, mood_label: str, note: str = None): # type: ignore
    entry = DailyCheckIn(
        session_id=session_id,
        mood_score=mood_score,
        mood_label=mood_label,
        note=note,
        timestamp=datetime.utcnow()
    )
    db.add(entry)
    db.commit()
    return entry


def get_checkin_history(db, session_id: str, limit: int = 30):
    return (
        db.query(DailyCheckIn)
        .filter(DailyCheckIn.session_id == session_id)
        .order_by(DailyCheckIn.timestamp.desc())
        .limit(limit)
        .all()
    )
