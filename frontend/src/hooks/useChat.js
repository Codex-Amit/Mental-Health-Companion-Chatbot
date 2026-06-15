import { useState, useCallback, useRef, useEffect } from 'react'
import { sendMessage, clearHistory } from '../utils/api'

const WELCOME_MESSAGE = {
  id: 'welcome',
  role: 'assistant',
  content: `Hi there 🤖 I'm MindEase, your personal wellness companion. I'm here to listen, support, and help you feel better — no judgment, ever.\n\nHow are you feeling today?`,
  sentiment: null,
  relaxationTip: null,
  crisisDetected: false,
  moodEmoji: '🤖',
  timestamp: new Date().toISOString()
}

const STORAGE_KEY = 'mindease_chat_messages'

function loadMessages() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch (e) {}
  return [WELCOME_MESSAGE]
}

function saveMessages(messages) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
  } catch (e) {}
}

export const useChat = (sessionId, userName) => {
  const [messages, setMessages] = useState(loadMessages)
  const [isTyping, setIsTyping] = useState(false)
  const [error, setError] = useState(null)
  const [lastSentiment, setLastSentiment] = useState(null)
  const messagesEndRef = useRef(null)

  // Save to localStorage whenever messages change
  useEffect(() => {
    saveMessages(messages)
  }, [messages])

  const sendMsg = useCallback(async (text) => {
    if (!text.trim() || isTyping) return

    const userMsg = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...prev, userMsg])
    setIsTyping(true)
    setError(null)

    try {
      const response = await sendMessage(text, sessionId, userName)
      setLastSentiment(response.sentiment)

      const botMsg = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.reply,
        sentiment: response.sentiment,
        relaxationTip: response.relaxation_tip,
        crisisDetected: response.crisis_detected,
        crisisResources: response.crisis_resources,
        moodEmoji: response.mood_emoji,
        timestamp: new Date().toISOString()
      }

      setMessages(prev => [...prev, botMsg])
    } catch (err) {
      setError('Something went wrong. Please check your connection and try again.')
    } finally {
      setIsTyping(false)
    }
  }, [sessionId, userName, isTyping])

  const resetChat = useCallback(async () => {
    await clearHistory(sessionId)
    const freshWelcome = {
      id: 'welcome-' + Date.now(),
      role: 'assistant',
      content: `Chat cleared 🌿 Starting fresh. How are you feeling right now?`,
      sentiment: null,
      timestamp: new Date().toISOString()
    }
    setMessages([freshWelcome])
    setLastSentiment(null)
    localStorage.removeItem(STORAGE_KEY)
  }, [sessionId])

  return {
    messages,
    isTyping,
    error,
    lastSentiment,
    messagesEndRef,
    sendMsg,
    resetChat
  }
}