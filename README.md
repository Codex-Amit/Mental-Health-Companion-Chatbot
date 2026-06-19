<div align="center">

# 🤖 MindEase — AI Mental Health Companion for Students

<br/>

![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.111+-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Groq](https://img.shields.io/badge/Groq-Llama_3-F55036?style=for-the-badge&logo=groq&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-Database-003B57?style=for-the-badge&logo=sqlite&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

<br/>

> **MindEase** is an empathetic AI chatbot that detects student mood in real-time and provides mental wellness support, relaxation techniques, journaling reflections, and crisis resources — all powered by the **free Groq API**.

<br/>

> ⚠️ **Important:** MindEase is a *supportive tool*, not a replacement for professional mental health care.
> In crisis? Call **iCall: 9152987821** (India, Mon–Sat 8am–10pm)

</div>

---

## 📋 Table of Contents

- [✨ Features](#-features)
- [📁 Project Structure](#-project-structure)
- [🛠️ Tech Stack](#️-tech-stack)
- [🚀 Quick Start](#-quick-start)
- [🔑 Environment Setup](#-environment-setup)
- [🖼️ App Screenshots](#️-app-screenshots)
- [🆘 Crisis Resources](#-crisis-resources)
- [🔮 Future Scope](#-future-scope)

---

## ✨ Features

### 🤖 AI Chat Engine
- Empathetic Groq Llama 3 responses
- Contextual conversation history (last 10 turns)
- User-name personalisation
- 3–5 sentence warm responses with gentle follow-up

### 🎭 Emotion Intelligence
- Dual-engine sentiment: **VADER + TextBlob**
- Detects 7 emotion types: `anxious` `stressed` `lonely` `sad` `angry` `happy` `calm`
- Weighted scoring: 65% VADER + 35% TextBlob
- Real-time mood emoji feedback

### 📊 Mood Dashboard
- Interactive mood chart (Recharts)
- Average sentiment score over time
- Dominant emotion analytics
- Daily check-in tracker (1–5 scale)

### 📔 Smart Journaling
- Free-write journal entries
- AI-generated 2–3 sentence warm reflections
- Stored securely in SQLite
- Accessible personal entry history

### 🧘 Relaxation Tips
- Context-aware tips based on detected emotion
- Triggered automatically for `negative` or `distressed` states
- Covers breathing, grounding, mindfulness

### 🚨 Crisis Detection
- Keyword-level safety net (15+ distress signals)
- Instant helpline card overlay (not just a text reply)
- iCall, Vandrevala, AASRA + international fallback

### 🌙 Daily Check-In
- 5-point mood scale with emoji
- Optional note field
- AI-generated personalised tip after each check-in
- Persisted for dashboard trends

### 🔐 Session Management
- UUID-based session isolation
- No login required — privacy-first
- Conversation context maintained per session

---

## 📁 Project Structure

```
🤖 MindEase/
│
├── 📂 backend/
│   ├── 🐍 main.py                    # FastAPI app + all routes
│   ├── 📋 requirements.txt           # Python dependencies
│   ├── 🔐 .env                       # Your API keys (never commit!)
│   │
│   ├── 📂 agent/
│   │   ├── 🤖 chatbot.py             # Groq LLM + response generation
│   │   └── 🚨 crisis_detector.py    # Crisis keyword detection + helplines
│   │
│   ├── 📂 utils/
│   │   ├── 🎭 sentiment.py           # VADER + TextBlob sentiment pipeline
│   │   ├── 🧘 relaxation.py          # 30+ relaxation tips library
│   │   └── 🗄️ database.py           # SQLite CRUD operations
│   │
│   └── 📂 models/
│       └── 📐 schemas.py             # Pydantic request/response models
│
├── 📂 frontend/
│   ├── 📂 src/
│   │   ├── 📂 pages/
│   │   │   ├── 💬 Chat.jsx           # Main chat interface
│   │   │   ├── 📊 Dashboard.jsx      # Mood tracker + check-in
│   │   │   └── 📔 Journal.jsx        # AI journaling
│   │   │
│   │   ├── 📂 components/
│   │   │   ├── 💬 ChatWindow.jsx     # Chat UI + input
│   │   │   ├── 🗨️ MessageBubble.jsx  # Individual message + mood badge
│   │   │   ├── 🎭 MoodBadge.jsx      # Emotion label component
│   │   │   ├── 📈 MoodChart.jsx      # Recharts mood graph
│   │   │   ├── 🧘 RelaxationCard.jsx # Collapsible tip card
│   │   │   ├── 🚨 CrisisAlert.jsx    # Crisis resources panel
│   │   │   └── 📌 Sidebar.jsx        # Navigation sidebar
│   │   │
│   │   ├── 📂 hooks/
│   │   │   └── 🪝 useChat.js         # Chat state + localStorage persistence
│   │   │
│   │   └── 📂 utils/
│   │       └── 🔌 api.js             # Axios API calls
│   │
│   └── 🌐 index.html
│
├── 📂 tests/
│   ├── 🧪 test_sentiment.py
│   └── 🧪 test_crisis.py
│
├── 📄 .env.example                   # Template — copy to backend/.env
├── 🚫 .gitignore
└── 📖 README.md
```

---

## 🛠️ Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **LLM** | Groq `llama-3.1-8b-instant` | Empathetic chat responses, journal reflections, check-in messages |
| **Backend** | Python 3.10+ · FastAPI · Uvicorn | REST API, session management, routing |
| **Sentiment AI** | VADER · TextBlob | Dual-engine emotion & sentiment scoring |
| **Database** | SQLite · SQLAlchemy · aiosqlite | Mood history, journal entries, check-ins |
| **Validation** | Pydantic v2 | Request/response schema enforcement |
| **Frontend** | React 18 · Vite · Tailwind CSS | Responsive, fast UI |
| **Charts** | Recharts | Mood trend visualisation |
| **Icons** | Lucide React | Consistent icon system |

---

## 🚀 Quick Start

### Prerequisites
- Python 3.10+
- Node.js 18+
- A free [Groq API key](https://console.groq.com/keys) (no credit card needed)

---

### Step 1 — Get Your FREE Groq API Key

```
1. Visit  →  https://console.groq.com/keys
2. Sign up (free, no credit card required)
3. Click "Create API Key"
4. Copy the key — it starts with gsk_...
```

---

### Step 2 — Backend Setup

```bash

# Create and activate virtual environment
python -m venv venv

# Windows
venv\Scripts\activate

# macOS / Linux
source venv/bin/activate

# Clone or extract the project
cd MindEase/backend

# Install dependencies
pip install -r requirements.txt

# Download TextBlob corpora
python -m textblob.download_corpora
```

**Create your `.env` inside `backend/`:**

```env
# ── Required ──────────────────────────────────
GROQ_API_KEY=gsk_your_key_here

# ── Model Options (all FREE) ──────────────────
# llama-3.1-8b-instant     ← fastest ✅ recommended
# llama-3.3-70b-versatile  ← smarter, slower
# mixtral-8x7b-32768       ← great for long chats
GROQ_MODEL=llama-3.1-8b-instant

# ── Database ──────────────────────────────────
DATABASE_URL=sqlite:///./mindease.db
```

**Start the backend:**

```bash
uvicorn main:app --reload
```

✅ API live at → `http://localhost:8000`
📖 Swagger docs → `http://localhost:8000/docs`

---

### Step 3 — Frontend Setup

```bash

# Windows
venv\Scripts\activate

# macOS / Linux
source venv/bin/activate

cd MindEase/frontend

npm install
npm run dev
```

✅ App opens at → `http://localhost:5173`

---


## 🔑 Environment Setup

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `GROQ_API_KEY` | ✅ Yes | — | Your Groq API key from console.groq.com |
| `GROQ_MODEL` | ⬜ No | `llama-3.1-8b-instant` | Groq model to use |
| `DATABASE_URL` | ⬜ No | `sqlite:///./mindease.db` | Database connection string |

### Available Groq Models (all free)

| Model | Speed | Intelligence | Best For |
|-------|-------|-------------|----------|
| `llama-3.1-8b-instant` | ⚡⚡⚡ Fastest | ★★★☆☆ | **Recommended** — daily use |
| `llama-3.3-70b-versatile` | ⚡⚡ Medium | ★★★★★ | Deeper, smarter responses |
| `mixtral-8x7b-32768` | ⚡⚡ Medium | ★★★★☆ | Long conversations |

---

## 🖼️ App Screenshots

### Chat Interface



### Mood Traker
 image

### Journel Tab
 image

---

## 🆘 Crisis Resources

> These are automatically shown inside MindEase when distress signals are detected.

| Helpline | Contact | Hours |
|----------|---------|-------|
| 📞 **iCall** (India) | `9152987821` | Mon–Sat, 8am–10pm |
| 📞 **Vandrevala Foundation** | `1860-2662-345` | 24/7, Free |
| 📞 **AASRA** | `9820466627` | 24/7 |
| 💬 **iCall Chat** | [icallhelpline.org](https://icallhelpline.org) | Online |
| 🌐 **International** | [findahelpline.com](https://findahelpline.com) | Global directory |

---

## 🔮 Future Scope

- 🎙️ **Voice Mode** — speak your feelings, get a spoken response
- 📄 **Resume Parsing** — context-aware career anxiety support
- 🌍 **Multi-language** — Hindi, Tamil, Telugu support
- 📱 **Mobile App** — React Native companion app
- 🔔 **Smart Reminders** — daily check-in nudges
- 👤 **Therapist Handoff** — connect to real professionals when needed

---

<div align="center">

**Built with 💜 for student mental wellness**

</div>
