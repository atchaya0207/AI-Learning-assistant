// src/services/api.js
import axios from 'axios'

const api = axios.create({ baseURL: '/api' })

// Auto attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

export const register = (data) => api.post('/auth/register', data)
export const login    = (data) => api.post('/auth/login',    data)

export const askAI          = (message, topic) => api.post('/chat/ask', { message, topic })
export const getChatHistory = ()               => api.get('/chat')

export const generateQuiz   = (topic, n)              => api.post('/quiz/generate', { topic, numQuestions: n })
export const submitQuiz     = (quizId, userAnswers)   => api.post('/quiz/submit',   { quizId, userAnswers })
export const getQuizHistory = ()                      => api.get('/quiz')

export const generateFlashcards = (topic, n) => api.post('/flashcard/generate', { topic, numCards: n })
export const getFlashcards      = ()          => api.get('/flashcard')
export const toggleMastered     = (id)        => api.patch(`/flashcard/${id}`)
