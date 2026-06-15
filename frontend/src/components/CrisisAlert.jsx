import { AlertTriangle } from 'lucide-react'

export default function CrisisAlert({ resources }) {
  return (
    <div className="w-full bg-rose-50 border border-rose-200 rounded-xl p-3 animate-fade-in">
      <div className="flex items-center gap-2 text-rose-700 font-semibold text-sm mb-2">
        <AlertTriangle size={15} />
        <span>Immediate Support Available</span>
      </div>
      <ul className="space-y-1">
        {resources?.map((r, i) => (
          <li key={i} className="text-xs text-rose-800 leading-relaxed">{r}</li>
        ))}
      </ul>
    </div>
  )
}
