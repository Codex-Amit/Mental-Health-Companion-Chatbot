import { useEffect, useState } from 'react'
import { createJournalEntry, getJournalEntries } from '../utils/api'
import { BookOpen, PlusCircle, Sparkles, ChevronDown, ChevronUp } from 'lucide-react'
import { format } from 'date-fns'

const EMOTION_EMOJI = {
  happy: '😊', calm: '😌', anxious: '😰', stressed: '😤',
  lonely: '🥺', sad: '😢', angry: '😠', neutral: '😐',
}

function JournalCard({ entry }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="card animate-fade-in">
      <div className="flex items-start justify-between gap-3 cursor-pointer" onClick={() => setOpen(o => !o)}>
        <div>
          <p className="font-medium text-slate-800 text-sm">{entry.title}</p>
          <p className="text-xs text-slate-400 mt-0.5">
            {EMOTION_EMOJI[entry.emotion] || '📝'} {entry.emotion} · {format(new Date(entry.timestamp), 'MMM d, h:mm a')}
          </p>
        </div>
        {open ? <ChevronUp size={16} className="text-slate-400 flex-shrink-0" /> : <ChevronDown size={16} className="text-slate-400 flex-shrink-0" />}
      </div>

      {open && (
        <div className="mt-4 space-y-3 animate-fade-in">
          <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">{entry.content}</p>
          <div className="bg-primary-50 border border-primary-100 rounded-xl p-3">
            <div className="flex items-center gap-1.5 text-primary-700 text-xs font-medium mb-1.5">
              <Sparkles size={12} /> MindEase reflection
            </div>
            <p className="text-sm text-primary-800 leading-relaxed">{entry.ai_reflection}</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default function Journal({ sessionId }) {
  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [writing, setWriting] = useState(false)
  const [content, setContent] = useState('')
  const [title, setTitle] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [newEntry, setNewEntry] = useState(null)

  useEffect(() => {
    getJournalEntries(sessionId)
      .then(setEntries)
      .finally(() => setLoading(false))
  }, [sessionId])

  const handleSubmit = async () => {
    if (!content.trim()) return
    setSubmitting(true)
    try {
      const result = await createJournalEntry(sessionId, content, title || null)
      setNewEntry(result)
      setEntries(prev => [{
        id: result.id,
        title: result.title,
        content: result.content,
        ai_reflection: result.ai_reflection,
        emotion: result.sentiment.emotion,
        timestamp: result.timestamp
      }, ...prev])
      setContent('')
      setTitle('')
      setWriting(false)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-800">Journal</h1>
          <p className="text-sm text-slate-500 mt-1">Private space to express your thoughts</p>
        </div>
        <button
          onClick={() => setWriting(w => !w)}
          className="btn-primary flex items-center gap-2 text-sm"
        >
          <PlusCircle size={16} />
          New Entry
        </button>
      </div>

      {/* Write panel */}
      {writing && (
        <div className="card animate-slide-up space-y-3">
          <div className="flex items-center gap-2 text-slate-700 font-medium text-sm">
            <BookOpen size={15} /> New Journal Entry
          </div>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Title (optional)…"
            className="input-field text-sm"
          />
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="Write freely — what's on your mind? This is your safe space…"
            rows={6}
            className="input-field text-sm"
          />
          <div className="flex gap-3 justify-end">
            <button onClick={() => setWriting(false)} className="btn-ghost text-sm">Cancel</button>
            <button
              onClick={handleSubmit}
              disabled={!content.trim() || submitting}
              className="btn-primary flex items-center gap-2 text-sm"
            >
              <Sparkles size={14} />
              {submitting ? 'Getting reflection…' : 'Save & Reflect'}
            </button>
          </div>
        </div>
      )}

      {/* Recent result highlight */}
      {newEntry && (
        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 text-sm text-emerald-800 animate-fade-in">
          ✅ Journal saved! MindEase read your entry and left a reflection below.
        </div>
      )}

      {/* Entries list */}
      {loading ? (
        <div className="text-center text-slate-400 text-sm py-10">Loading your journal…</div>
      ) : entries.length === 0 ? (
        <div className="text-center py-16 text-slate-400">
          <BookOpen size={40} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm">No entries yet. Start writing — it really helps.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {entries.map(e => <JournalCard key={e.id} entry={e} />)}
        </div>
      )}
    </div>
  )
}
