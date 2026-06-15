import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts'
import { format } from 'date-fns'

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  return (
    <div className="bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-sm text-xs">
      <p className="font-medium text-slate-700 capitalize">{d.emotion}</p>
      <p className="text-slate-500">{d.label}</p>
      <p className={`font-semibold ${d.score >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
        Score: {d.score > 0 ? '+' : ''}{d.score}
      </p>
    </div>
  )
}

export default function MoodChart({ entries }) {
  if (!entries?.length) {
    return (
      <div className="flex items-center justify-center h-40 text-slate-400 text-sm">
        No mood data yet — start chatting!
      </div>
    )
  }

  const data = [...entries].reverse().map((e, i) => ({
    index: i + 1,
    score: parseFloat(e.sentiment_score.toFixed(3)),
    emotion: e.emotion,
    label: e.sentiment_label,
    time: format(new Date(e.timestamp), 'MMM d, h:mm a')
  }))

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis dataKey="index" tick={{ fontSize: 11, fill: '#94a3b8' }} />
        <YAxis domain={[-1, 1]} tick={{ fontSize: 11, fill: '#94a3b8' }} />
        <ReferenceLine y={0} stroke="#e2e8f0" strokeDasharray="4 4" />
        <Tooltip content={<CustomTooltip />} />
        <Line
          type="monotone"
          dataKey="score"
          stroke="#6366f1"
          strokeWidth={2.5}
          dot={{ fill: '#6366f1', r: 4, strokeWidth: 0 }}
          activeDot={{ r: 6, fill: '#4f46e5' }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
