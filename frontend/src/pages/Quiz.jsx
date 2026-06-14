// src/pages/Quiz.jsx
import React, { useState } from 'react'
import { generateQuiz, submitQuiz } from '../services/api'

export default function Quiz() {
  const [topic,   setTopic]   = useState('')
  const [quiz,    setQuiz]    = useState(null)
  const [answers, setAnswers] = useState([])
  const [result,  setResult]  = useState(null)
  const [loading, setLoading] = useState(false)

  const handleGenerate = async () => {
    if (!topic.trim()) return
    setLoading(true); setResult(null)
    try {
      const { data } = await generateQuiz(topic, 5)
      setQuiz(data)
      setAnswers(new Array(data.questions.length).fill(null))
    } catch (e) { alert('Error: ' + e.message) }
    setLoading(false)
  }

  const handleSubmit = async () => {
    if (answers.includes(null)) { alert('Please answer all questions!'); return }
    try {
      const { data } = await submitQuiz(quiz.quizId, answers)
      setResult(data)
    } catch (e) { alert('Error: ' + e.message) }
  }

  return (
    <div style={{ padding:'24px', maxWidth:'700px', margin:'0 auto' }}>
      <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'6px' }}>
        <h2 style={{ color:'#000409' }}>🧪 Quiz Generator</h2>
        <span style={{ fontSize:'12px', color:'#22d3a0', background:'#072820', padding:'3px 10px', borderRadius:'10px', border:'1px solid rgba(34,211,160,.3)' }}>Free AI</span>
      </div>
      <p style={{ color:'#000308', marginBottom:'20px', fontSize:'14px' }}>Enter any topic — Groq AI builds a quiz instantly</p>

      <div style={{ display:'flex', gap:'10px', marginBottom:'24px' }}>
        <input value={topic} onChange={e => setTopic(e.target.value)}
          placeholder="e.g. React Hooks, Python loops ..."
          style={{ flex:1, padding:'10px 14px', borderRadius:'8px', border:'1px solid #1e2d4a', background:'#4f083c', color:'#e2e8f0', fontSize:'14px', outline:'none' }} />
        <button onClick={handleGenerate} disabled={loading}
          style={{ padding:'10px 20px', background:'#00050c', color:'white', border:'none', borderRadius:'8px', cursor:'pointer', fontWeight:600, whiteSpace:'nowrap' }}>
          {loading ? 'Generating...' : 'Generate ↗'}
        </button>
      </div>

      {quiz && !result && (
        <div>
          {quiz.questions.map((q, qi) => (
            <div key={qi} style={{ background:'#0f1526', border:'1px solid #1e2d4a', borderRadius:'10px', padding:'16px', marginBottom:'14px' }}>
              <p style={{ fontWeight:600, marginBottom:'12px', fontSize:'14px', color:'#e2e8f0' }}>{qi+1}. {q.question}</p>
              {q.options.map((opt, oi) => (
                <div key={oi} onClick={() => setAnswers(p => { const a=[...p]; a[qi]=oi; return a })}
                  style={{
                    padding:'9px 14px', borderRadius:'7px', cursor:'pointer', marginBottom:'6px', fontSize:'14px',
                    border:      answers[qi]===oi ? '2px solid #4f8ef7' : '1px solid #1e2d4a',
                    background:  answers[qi]===oi ? '#1a2d5c'           : '#141c2e',
                    color:       answers[qi]===oi ? '#7aabff'            : '#94a3b8',
                  }}>
                  {['A','B','C','D'][oi]}. {opt}
                </div>
              ))}
            </div>
          ))}
          <button onClick={handleSubmit}
            style={{ width:'100%', padding:'12px', background:'#22d3a0', color:'#072820', border:'none', borderRadius:'8px', fontSize:'15px', cursor:'pointer', fontWeight:700 }}>
            Submit Answers
          </button>
        </div>
      )}

      {result && (
        <div style={{ textAlign:'center', padding:'36px', background:'#0f1526', border:'1px solid #1e2d4a', borderRadius:'12px' }}>
          <div style={{ fontSize:'48px', marginBottom:'10px' }}>{result.score >= 70 ? '🎉' : '💪'}</div>
          <h2 style={{ color:'#22d3a0', marginBottom:'6px' }}>Score: {result.score}%</h2>
          <p style={{ color:'#94a3b8', marginBottom:'24px' }}>{result.correct} of {result.total} correct</p>
          <button onClick={() => { setQuiz(null); setResult(null); setTopic('') }}
            style={{ padding:'10px 24px', background:'#4f8ef7', color:'white', border:'none', borderRadius:'8px', cursor:'pointer', fontWeight:600 }}>
            Try Another Topic
          </button>
        </div>
      )}
    </div>
  )
}
