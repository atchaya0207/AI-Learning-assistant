// src/pages/Dashboard.jsx
import React, { useEffect, useState } from 'react'
import { getChatHistory, getQuizHistory, getFlashcards } from '../services/api'

export default function Dashboard() {
  const [stats,   setStats]   = useState({ questions:0, quizzes:0, flashcards:0, avgScore:0 })
  const [loading, setLoading] = useState(true)
  const userName = localStorage.getItem('userName') || 'Learner'

  useEffect(() => {
    Promise.all([getChatHistory(), getQuizHistory(), getFlashcards()])
      .then(([chats, quizzes, cards]) => {
        const questions = chats.data.reduce((s,c) => s + c.messages.filter(m => m.role==='user').length, 0)
        const completed = quizzes.data.filter(q => q.completed)
        const avgScore  = completed.length ? Math.round(completed.reduce((s,q) => s+q.score,0) / completed.length) : 0
        setStats({ questions, quizzes:completed.length, flashcards:cards.data.length, avgScore })
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const statCards = [
    { label:'Questions Asked',     value:stats.questions,  color:'#4f8ef7', bg:'#0d1e3d', icon:'💬' },
    { label:'Quizzes Completed',   value:stats.quizzes,    color:'#22d3a0', bg:'#072820', icon:'🧪' },
    { label:'Flashcards Made',     value:stats.flashcards, color:'#a78bfa', bg:'#1a1040', icon:'🗂️' },
  ]

  return (
    <div style={{ padding:'24px', maxWidth:'800px', margin:'0 auto' }}>
      <h2 style={{ color:'#010409', marginBottom:'4px' }}>👋 Welcome back, {userName}!</h2>
      <p style={{ color:'#020912', marginBottom:'24px', fontSize:'14px' }}>Here's your learning progress</p>

      {loading ? (
        <div style={{ color:'#94a3b8', fontSize:'14px' }}>Loading stats...</div>
      ) : (
        <>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'14px', marginBottom:'20px' }}>
            {statCards.map(s => (
              <div key={s.label} style={{ background:'#4f083c', border:'1px solid #1e2d4a', borderRadius:'12px', padding:'18px' }}>
                <div style={{ fontSize:'20px', marginBottom:'8px' }}>{s.icon}</div>
                <div style={{ fontSize:'11px', color:'#fbfbfb', marginBottom:'4px' }}>{s.label}</div>
                <div style={{ fontSize:'30px', fontWeight:700, color:s.color }}>{s.value}</div>
              </div>
            ))}
          </div>

          {stats.quizzes > 0 && (
            <div style={{ background:'#4f083c', border:'1px solid #1e2d4a', borderRadius:'12px', padding:'20px' }}>
              <div style={{ fontSize:'13px', fontWeight:600, color:'#fbfcfe', marginBottom:'8px' }}>Average Quiz Score</div>
              <div style={{ fontSize:'36px', fontWeight:700, color: stats.avgScore>=70?'#22d3a0':'#f59e0b' }}>
                {stats.avgScore}%
              </div>
              <div style={{ fontSize:'12px', color:'#4a5568', marginTop:'4px' }}>
                {stats.avgScore >= 70 ? '🎉 Great job!' : '💪 Keep practising!'}
              </div>
            </div>
          )}

          {stats.questions === 0 && stats.quizzes === 0 && stats.flashcards === 0 && (
            <div style={{ textAlign:'center', padding:'40px', color:'#4a5568', fontSize:'14px' }}>
              No activity yet — start by asking the AI tutor a question! 🚀
            </div>
          )}
        </>
      )}
    </div>
  )
}
