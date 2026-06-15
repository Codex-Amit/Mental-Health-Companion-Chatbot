import { format } from 'date-fns'
import MoodBadge from './MoodBadge'
import RelaxationCard from './RelaxationCard'
import CrisisAlert from './CrisisAlert'

export default function MessageBubble({ message }) {
  const isBot = message.role === 'assistant'

  return (
    <div className={`flex gap-3 animate-slide-up ${isBot ? 'items-start' : 'items-start flex-row-reverse'}`}>

      {/* Avatar */}
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold
        ${isBot ? 'bg-primary-100 text-primary-600' : 'bg-slate-200 text-slate-600'}`}>
        {isBot ? '🤖' : '👤'}
      </div>

      <div className={`flex flex-col gap-2 max-w-[75%] ${isBot ? 'items-start' : 'items-end'}`}>

        {/* Crisis Alert — shown before bubble if crisis detected */}
        {message.crisisDetected && <CrisisAlert resources={message.crisisResources} />}

        {/* Bubble */}
        <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap
          ${isBot
            ? 'bg-white border border-slate-100 text-slate-800 rounded-tl-sm shadow-sm'
            : 'bg-primary-600 text-white rounded-tr-sm'
          }`}>
          {message.content}
        </div>

        {/* Bottom meta row */}
        <div className={`flex items-center gap-2 flex-wrap ${isBot ? '' : 'flex-row-reverse'}`}>
          <span className="text-xs text-slate-400">
            {format(new Date(message.timestamp), 'h:mm a')}
          </span>
          {isBot && message.sentiment && (
            <MoodBadge sentiment={message.sentiment} small />
          )}
        </div>

        {/* Relaxation tip card */}
        {isBot && message.relaxationTip && (
          <RelaxationCard tip={message.relaxationTip} />
        )}
      </div>
    </div>
  )
}
