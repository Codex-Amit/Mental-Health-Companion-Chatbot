import { useState, useCallback, useRef, useEffect } from 'react'
import { sendMessage, clearHistory } from '../utils/api'

const STORAGE_KEY = 'mindease_chat_messages'

function makeWelcomeMessage(userName) {
  const name = userName || 'Friend'
  return {
    id: 'welcome',
    role: 'assistant',
    content: `Hi ${name}! 👋 I'm MindEase, your personal wellness companion. I'm here to listen, support, and help you feel better — no judgment, ever.\n\nHow are you feeling today?`,
    sentiment: null,
    relaxationTip: null,
    crisisDetected: false,
    moodEmoji: '🤖',
    timestamp: new Date().toISOString()
  }
}

function loadSavedMessages() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      const parsed = JSON.parse(saved)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch (e) {}
  return null
}

function saveMessages(messages) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages))
  } catch (e) {}
}

export const useChat = (sessionId, userName) => {
  const [messages, setMessages] = useState(null)
  const [isTyping, setIsTyping] = useState(false)
  const [error, setError] = useState(null)
  const [lastSentiment, setLastSentiment] = useState(null)
  const messagesEndRef = useRef(null)
  const initializedRef = useRef(false)

  useEffect(() => {
    if (!userName || initializedRef.current) return
    initializedRef.current = true

    const saved = loadSavedMessages()
    if (saved) {
      setMessages(saved)          // returning to chat — restore it
    } else {
      const welcome = [makeWelcomeMessage(userName)]
      setMessages(welcome)        // new session — show welcome
      saveMessages(welcome)
    }
  }, [userName])

  useEffect(() => {
    if (messages && messages.length > 0) saveMessages(messages)
  }, [messages])

  const sendMsg = useCallback(async (text) => {
    if (!text.trim() || isTyping) return

    const userMsg = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date().toISOString()
    }

    setMessages(prev => [...(prev || []), userMsg])
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

      setMessages(prev => [...(prev || []), botMsg])
    } catch (err) {
      setError('Something went wrong. Please check your connection and try again.')
    } finally {
      setIsTyping(false)
    }
  }, [sessionId, userName, isTyping])

  const resetChat = useCallback(async () => {
    try { await clearHistory(sessionId) } catch (e) {}
    localStorage.removeItem(STORAGE_KEY)
    initializedRef.current = false
    const freshWelcome = [makeWelcomeMessage(userName)]
    setMessages(freshWelcome)
    saveMessages(freshWelcome)
    setLastSentiment(null)
  }, [sessionId, userName])

  return {
    messages: messages || [],
    isTyping,
    error,
    lastSentiment,
    messagesEndRef,
    sendMsg,
    resetChat
  }
}