import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'
import Sidebar from './components/Sidebar'
import Chat from './pages/Chat'
import Dashboard from './pages/Dashboard'
import Journal from './pages/Journal'

const SESSION_KEY = 'mindease_session_id'
const NAME_KEY = 'mindease_user_name'

function OnboardingModal({ onDone }) {
  const [name, setName] = useState('')

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full animate-slide-up">
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">🤖</div>
          <h1 className="text-2xl font-bold text-slate-800">Welcome to MindEase</h1>
          <p className="text-slate-500 text-sm mt-2">
            Your safe, private AI wellness companion. No data is shared.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-slate-700 block mb-1.5">
              What should I call you?
            </label>
            <input
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && name.trim() && onDone(name.trim())}
              placeholder="Your name or nickname…"
              className="input-field"
              autoFocus
            />
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-700">
            ⚠️ MindEase is a supportive tool, not a replacement for professional help.
          </div>

          <button
            onClick={() => onDone(name.trim() || 'Friend')}
            className="btn-primary w-full py-3"
          >
            Start Chatting 💬
          </button>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const [sessionId, setSessionId] = useState(null)
  const [userName, setUserName] = useState(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    // Always clear session on page load — show modal every time
    localStorage.removeItem(SESSION_KEY)
    localStorage.removeItem(NAME_KEY)
    setSessionId(null)
    setUserName(null)
    setReady(true)
  }, [])

  const handleOnboard = (name) => {
    const sid = uuidv4()
    localStorage.setItem(SESSION_KEY, sid)
    localStorage.setItem(NAME_KEY, name)
    setSessionId(sid)
    setUserName(name)
  }

  // Always show modal if no name saved
  const showModal = ready && (!sessionId || !userName)

  return (
    <BrowserRouter>
      {showModal && <OnboardingModal onDone={handleOnboard} />}
      <div className="flex h-screen bg-slate-50">
        <Sidebar />
        <main className="flex-1 overflow-hidden">
          <Routes>
            <Route path="/"          element={<Chat sessionId={sessionId} userName={userName} />} />
            <Route path="/dashboard" element={<Dashboard sessionId={sessionId} />} />
            <Route path="/journal"   element={<Journal sessionId={sessionId} />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}