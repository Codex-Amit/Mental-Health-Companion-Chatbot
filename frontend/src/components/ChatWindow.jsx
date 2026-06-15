import { useEffect, useRef, useState } from 'react'
import { Send, RotateCcw, Smile } from 'lucide-react'
import { useChat } from '../hooks/useChat'
import MessageBubble from './MessageBubble'
import MoodBadge from './MoodBadge'

export default function ChatWindow({ sessionId, userName }) {
  const [input, setInput] = useState('')
  const { messages, isTyping, error, lastSentiment, messagesEndRef, sendMsg, resetChat } = useChat(sessionId, userName)
  const textareaRef = useRef(null)

  // Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  const handleSend = () => {
    if (!input.trim()) return
    sendMsg(input.trim())
    setInput('')
    textareaRef.current?.focus()
  }

  const handleKey = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const QUICK_PROMPTS = [
    "I'm feeling anxious about exams 😰",
    "I feel really lonely today 🥺",
    "I need some motivation 💪",
    "Help me calm down 🧘",
  ]

  return (
    <div className="flex flex-col h-screen">
      {/* Header */}
      <div className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between flex-shrink-0">
        <div>
          <h1 className="font-semibold text-slate-800">Chat with MindEase</h1>
          <p className="text-xs text-slate-400 mt-0.5">Safe, private, non-judgmental</p>
        </div>
        <div className="flex items-center gap-3">
          {lastSentiment && <MoodBadge sentiment={lastSentiment} small />}
          <button onClick={resetChat} className="btn-ghost text-xs flex items-center gap-1.5">
            <RotateCcw size={13} />
            New Chat
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
        {messages.map(msg => (
          <MessageBubble key={msg.id} message={msg} />
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div className="flex gap-3 items-start animate-fade-in">
            <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center text-sm">🤖</div>
            <div className="bg-white border border-slate-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm">
              <span className="typing-dot" />
              <span className="typing-dot" />
              <span className="typing-dot" />
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="text-center text-sm text-rose-500 bg-rose-50 rounded-xl px-4 py-2 animate-fade-in">
            {error}
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick prompts — shown only at the start */}
      {messages.length <= 1 && (
        <div className="px-6 pb-2 flex flex-wrap gap-2 animate-fade-in">
          {QUICK_PROMPTS.map(p => (
            <button
              key={p}
              onClick={() => { sendMsg(p); }}
              className="text-xs bg-white border border-slate-200 hover:border-primary-300 hover:text-primary-700
                         text-slate-600 px-3 py-1.5 rounded-full transition-all duration-150"
            >
              {p}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="bg-white border-t border-slate-100 px-6 py-4 flex-shrink-0">
        <div className="flex items-end gap-3">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            placeholder="Share how you're feeling… (Enter to send, Shift+Enter for new line)"
            rows={2}
            className="input-field flex-1 text-sm"
            disabled={isTyping}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            className="btn-primary flex items-center gap-2 h-11 flex-shrink-0"
          >
            <Send size={16} />
            Send
          </button>
        </div>
      </div>
    </div>
  )
}
