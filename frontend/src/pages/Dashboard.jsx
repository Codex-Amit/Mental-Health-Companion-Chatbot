import { useEffect, useState } from 'react'
import { getMoodHistory, submitCheckIn } from '../utils/api'
import MoodChart from '../components/MoodChart'
import { BarChart2, TrendingUp, Heart, CheckCircle } from 'lucide-react'

const MOODS = [
  { score: 1, label: 'terrible', emoji: '😭' },
  { score: 2, label: 'bad',      emoji: '😔' },
  { score: 3, label: 'okay',     emoji: '😐' },
  { score: 4, label: 'good',     emoji: '🙂' },
  { score: 5, label: 'great',    emoji: '😄' },
]

const EMOTION_COLORS = {
  happy: 'bg-emerald-100 text-emerald-700',
  calm: 'bg-teal-100 text-teal-700',
  neutral: 'bg-slate-100 text-slate-600',
  anxious: 'bg-yellow-100 text-yellow-700',
  stressed: 'bg-orange-100 text-orange-700',
  lonely: 'bg-purple-100 text-purple-700',
  sad: 'bg-blue-100 text-blue-700',
  angry: 'bg-red-100 text-red-700',
}

export default function Dashboard({ sessionId }) {
  const [history, setHistory] = useState(null)
  const [loading, setLoading] = useState(true)
  const [checkinDone, setCheckinDone] = useState(false)
  const [selectedMood, setSelectedMood] = useState(null)
  const [note, setNote] = useState('')
  const [checkinResult, setCheckinResult] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    if (!sessionId) { setLoading(false); return }
    if (!sessionId) { setLoading(false); return }
    getMoodHistory(sessionId)
      .then(setHistory)
      .finally(() => setLoading(false))
  }, [sessionId, checkinDone])

  const handleCheckin = async () => {
    if (!selectedMood) return
    setSubmitting(true)
    try {
      const result = await submitCheckIn(sessionId, selectedMood.score, selectedMood.label, note || null)
      setCheckinResult(result)
      setCheckinDone(true)
    } finally {
      setSubmitting(false)
    }
  }

  const emotionCounts = history?.entries.reduce((acc, e) => {
    acc[e.emotion] = (acc[e.emotion] || 0) + 1
    return acc
  }, {}) || {}

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      <div>
        <h1 className="text-xl font-bold text-slate-800">Mood Tracker</h1>
        <p className="text-sm text-slate-500 mt-1">Track your emotional patterns over time</p>
      </div>

      {/* Stats row */}
      {history && (
        <div className="grid grid-cols-3 gap-4">
          <div className="card text-center">
            <div className="text-2xl font-bold text-primary-600">{history.entries.length}</div>
            <div className="text-xs text-slate-500 mt-1">Check-ins</div>
          </div>
          <div className="card text-center">
            <div className={`text-2xl font-bold ${history.average_score >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
              {history.average_score > 0 ? '+' : ''}{history.average_score.toFixed(2)}
            </div>
            <div className="text-xs text-slate-500 mt-1">Avg Score</div>
          </div>
          <div className="card text-center">
            <div className="text-2xl capitalize font-bold text-slate-700">{history.dominant_emotion}</div>
            <div className="text-xs text-slate-500 mt-1">Top Emotion</div>
          </div>
        </div>
      )}

      {/* Mood chart */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp size={16} className="text-primary-500" />
          <h2 className="font-semibold text-slate-700 text-sm">Mood Over Time</h2>
        </div>
        {loading ? (
          <div className="h-40 flex items-center justify-center text-slate-400 text-sm">Loading…</div>
        ) : (
          <MoodChart entries={history?.entries || []} />
        )}
      </div>

      {/* Emotion breakdown */}
      {Object.keys(emotionCounts).length > 0 && (
        <div className="card">
          <div className="flex items-center gap-2 mb-4">
            <Heart size={16} className="text-primary-500" />
            <h2 className="font-semibold text-slate-700 text-sm">Emotion Breakdown</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {Object.entries(emotionCounts)
              .sort((a, b) => b[1] - a[1])
              .map(([emotion, count]) => (
                <span key={emotion}
                  className={`px-3 py-1 rounded-full text-sm font-medium capitalize ${EMOTION_COLORS[emotion] || 'bg-slate-100 text-slate-600'}`}>
                  {emotion} <span className="opacity-60">×{count}</span>
                </span>
              ))}
          </div>
        </div>
      )}

      {/* Daily Check-in */}
      <div className="card">
        <div className="flex items-center gap-2 mb-4">
          <CheckCircle size={16} className="text-primary-500" />
          <h2 className="font-semibold text-slate-700 text-sm">Daily Check-in</h2>
        </div>

        {checkinResult ? (
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 animate-fade-in">
            <p className="text-sm text-emerald-800 font-medium">{checkinResult.message}</p>
            <p className="text-sm text-emerald-700 mt-2">💡 {checkinResult.tip}</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-slate-500 mb-3">How are you feeling today?</p>
            <div className="flex gap-3 mb-4">
              {MOODS.map(m => (
                <button
                  key={m.score}
                  onClick={() => setSelectedMood(m)}
                  className={`flex-1 flex flex-col items-center gap-1 p-3 rounded-xl border-2 transition-all
                    ${selectedMood?.score === m.score
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-slate-200 hover:border-slate-300'}`}
                >
                  <span className="text-xl">{m.emoji}</span>
                  <span className="text-xs text-slate-500 capitalize">{m.label}</span>
                </button>
              ))}
            </div>
            <textarea
              value={note}
              onChange={e => setNote(e.target.value)}
              placeholder="Add a note (optional)…"
              rows={2}
              className="input-field text-sm mb-3"
            />
            <button
              onClick={handleCheckin}
              disabled={!selectedMood || submitting}
              className="btn-primary w-full"
            >
              {submitting ? 'Submitting…' : 'Submit Check-in'}
            </button>
          </>
        )}
      </div>
    </div>
  )
}
