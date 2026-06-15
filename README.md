# 🧠 MindEase — AI Mental Health Companion for Students

An empathetic AI chatbot that detects student mood and provides mental wellness support, relaxation tips, and motivational responses. Powered by **Groq (free)**.

> ⚠️ MindEase is a supportive tool, not a replacement for professional care. In crisis? Call **iCall: 9152987821**

---

## ✨ Features
- 💬 Empathetic AI chat (Groq Llama 3)
- 🎭 Real-time mood & sentiment detection
- 📊 Mood history dashboard with charts
- 🧘 Contextual relaxation tips
- 🚨 Crisis detection with helpline resources
- 📔 AI-powered journaling with reflections
- 🌙 Daily mood check-in tracker

---

## 🛠️ Tech Stack
- **Backend:** Python, FastAPI, Groq (Llama 3), VADER + TextBlob, SQLite
- **Frontend:** React 18, Vite, Tailwind CSS, Recharts

---

## 🚀 Setup

### Step 1 — Get FREE Groq API Key
1. Go to https://console.groq.com/keys
2. Sign up (free, no credit card)
3. Create API key → copy it (starts with `gsk_...`)

### Step 2 — Backend setup
```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
pip install -r requirements.txt
python -m textblob.download_corpora
```

Create your `.env` file inside the `backend/` folder:
```
GROQ_API_KEY=gsk_your_key_here
GROQ_MODEL=llama-3.1-8b-instant
DATABASE_URL=sqlite:///./mindease.db
```

Run the backend:
```bash
uvicorn main:app --reload
```
✅ Backend runs at http://localhost:8000

### Step 3 — Frontend setup
```bash
cd frontend
npm install
npm run dev
```
✅ App opens at http://localhost:5173

---

## 📁 Project Structure
```
MindEase/
├── backend/
│   ├── main.py                  # FastAPI routes
│   ├── agent/
│   │   ├── chatbot.py           # Groq LLM chat logic
│   │   └── crisis_detector.py   # Crisis keyword detection
│   ├── utils/
│   │   ├── sentiment.py         # VADER + TextBlob sentiment
│   │   ├── relaxation.py        # Relaxation tips library
│   │   └── database.py          # SQLite operations
│   ├── models/schemas.py        # Pydantic schemas
│   └── requirements.txt
├── frontend/
│   └── src/
│       ├── pages/               # Chat, Dashboard, Journal
│       ├── components/          # UI components
│       ├── hooks/useChat.js     # Chat state management
│       └── utils/api.js         # API calls
├── .env.example                 # Copy to backend/.env
└── README.md
```

---

## 🆘 Crisis Resources
- **iCall (India):** 9152987821
- **Vandrevala Foundation:** 1860-2662-345 (24/7)
- **AASRA:** 9820466627
