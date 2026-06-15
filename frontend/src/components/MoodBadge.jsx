const MOOD_STYLES = {
  positive:   'bg-emerald-100 text-emerald-700 border-emerald-200',
  neutral:    'bg-slate-100 text-slate-600 border-slate-200',
  negative:   'bg-amber-100 text-amber-700 border-amber-200',
  distressed: 'bg-rose-100 text-rose-700 border-rose-200',
}

const EMOTION_ICONS = {
  happy: '😊', calm: '😌', anxious: '😰', stressed: '😤',
  lonely: '🥺', sad: '😢', angry: '😠', neutral: '😐',
}

export default function MoodBadge({ sentiment, small = false }) {
  if (!sentiment) return null
  const style = MOOD_STYLES[sentiment.label] || MOOD_STYLES.neutral
  const icon = EMOTION_ICONS[sentiment.emotion] || '😐'

  return (
    <span className={`inline-flex items-center gap-1 border rounded-full font-medium
      ${small ? 'text-xs px-2 py-0.5' : 'text-sm px-3 py-1'} ${style}`}>
      <span>{icon}</span>
      <span className="capitalize">{sentiment.emotion}</span>
      <span className="opacity-60">·</span>
      <span>{sentiment.score > 0 ? '+' : ''}{sentiment.score.toFixed(2)}</span>
    </span>
  )
}
