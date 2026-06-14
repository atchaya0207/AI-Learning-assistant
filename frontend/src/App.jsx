// src/App.jsx
import React, { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login      from './pages/Login'
import Register   from './pages/Register'
import Dashboard  from './pages/Dashboard'
import Chat       from './pages/Chat'
import Quiz       from './pages/Quiz'
import Flashcards from './pages/Flashcards'
import Sidebar    from './components/Sidebar'

function App() {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem('token')
    const name  = localStorage.getItem('userName')
    return token ? { token, name } : null
  })

  const handleLogin = (userData) => {
    localStorage.setItem('token',    userData.token)
    localStorage.setItem('userName', userData.name)
    setUser(userData)
  }

  const handleLogout = () => {
    localStorage.clear()
    setUser(null)
  }

  if (!user) return (
    <BrowserRouter>
      <Routes>
        <Route path="/login"    element={<Login    onLogin={handleLogin} />} />
        <Route path="/register" element={<Register onLogin={handleLogin} />} />
        <Route path="*"         element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  )

  return (
    <BrowserRouter>
      <div style={{ display:'flex', height:'100vh' }}>
        <Sidebar user={user} onLogout={handleLogout} />
        <main style={{ flex:1, overflow:'auto' }}>
          <Routes>
            <Route path="/"           element={<Dashboard />} />
            <Route path="/chat"       element={<Chat />} />
            <Route path="/quiz"       element={<Quiz />} />
            <Route path="/flashcards" element={<Flashcards />} />
            <Route path="*"           element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}

export default App
