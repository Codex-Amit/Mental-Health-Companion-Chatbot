import { useState } from 'react'
import { ChevronDown, ChevronUp, Leaf } from 'lucide-react'

export default function RelaxationCard({ tip }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="w-full border border-calm-200 bg-calm-50 rounded-xl overflow-hidden text-sm">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-2 px-3 py-2 text-calm-700 hover:bg-calm-100 transition-colors"
      >
        <Leaf size={14} className="flex-shrink-0" />
        <span className="font-medium flex-1 text-left">Relaxation tip for you</span>
        {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
      </button>
      {open && (
        <div className="px-4 pb-3 pt-1 text-calm-800 leading-relaxed animate-fade-in">
          {tip}
        </div>
      )}
    </div>
  )
}
