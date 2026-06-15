import axios from 'axios'

const BASE_URL = '/api'

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' }
})

export const sendMessage = async (message, sessionId, userName = 'Friend') => {
  const { data } = await api.post('/chat', {
    message,
    session_id: sessionId,
    user_name: userName
  })
  return data
}

export const getMoodHistory = async (sessionId) => {
  const { data } = await api.get(`/mood/history/${sessionId}`)
  return data
}

export const createJournalEntry = async (sessionId, content, title = null) => {
  const { data } = await api.post('/journal', {
    session_id: sessionId,
    content,
    title
  })
  return data
}

export const getJournalEntries = async (sessionId) => {
  const { data } = await api.get(`/journal/${sessionId}`)
  return data
}

export const submitCheckIn = async (sessionId, moodScore, moodLabel, note = null) => {
  const { data } = await api.post('/checkin', {
    session_id: sessionId,
    mood_score: moodScore,
    mood_label: moodLabel,
    note
  })
  return data
}

export const clearHistory = async (sessionId) => {
  await api.delete(`/chat/history/${sessionId}`)
}

export const getNewSession = async () => {
  const { data } = await api.get('/session/new')
  return data.session_id
}
