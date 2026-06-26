// src/pages/Chat.jsx
import React, { useState, useRef, useEffect } from 'react'
import { askAI } from '../services/api'

export default function Chat() {
  const [messages, setMessages] = useState([
    { role:'assistant', content:'Hi! I\'m your AI tutor powered by Groq + Llama 3. Ask me anything about coding (JS, Python, React) or language learning!' }
  ])
  const [input,   setInput]   = useState('')
  const [topic,   setTopic]   = useState('JavaScript')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:'smooth' }) }, [messages])

  const send = async () => {
    if (!input.trim() || loading) return
    const msg = input
    setInput(''); setLoading(true)
    setMessages(p => [...p, { role:'user', content:msg }])
    try {
      const { data } = await askAI(msg, topic)
      setMessages(p => [...p, { role:'assistant', content:data.answer }])
    } catch (e) {
      setMessages(p => [...p, { role:'assistant', content:'Error: ' + e.message }])
    }
    setLoading(false)
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100vh', padding:'20px', maxWidth:'800px', margin:'0 auto' }}>
      <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'14px' }}>
        <h2 style={{ color:'#010408' }}>AI Tutor</h2>
        <span style={{ fontSize:'12px', color:'#22d3a0', background:'#072820', padding:'3px 10px', borderRadius:'10px', border:'1px solid rgba(34,211,160,.3)' }}>
          Groq + Llama 3
        </span>
      </div>

      <select value={topic} onChange={e => setTopic(e.target.value)}
        style={{ width:'180px', marginBottom:'14px', padding:'7px 10px', borderRadius:'8px', border:'1px solid #000000', background:'#141c2e', color:'#e2e8f0', fontSize:'13px' }}>
        {['JavaScript','Python','React','Node.js','cpp','java'].map(t => <option key={t}>{t}</option>)}
      </select>

      <div style={{ flex:1, overflowY:'auto', padding:'16px', background:'#4f083c', borderRadius:'10px', marginBottom:'14px', border:'1px solid #1e2d4a' }}>
        {messages.map((m, i) => (
          <div key={i} style={{ display:'flex', justifyContent:m.role==='user'?'flex-end':'flex-start', marginBottom:'12px' }}>
            <div style={{
              maxWidth:'70%', padding:'10px 14px', borderRadius:'12px',
              background: m.role==='user' ? '#5878c7' : '#141c2e',
              color: m.role==='user' ? '#7aabff' : '#e2e8f0',
              border: m.role==='user' ? '1px solid #6e88b8' : '1px solid #1e2d4a',
              fontSize:'14px', lineHeight:1.65, whiteSpace:'pre-wrap'
            }}>
              {m.content}
            </div>
          </div>
        ))}
        {loading && <div style={{ color:'#4f8ef7', fontSize:'13px' }}>AI is thinking...</div>}
        <div ref={bottomRef} />
      </div>

      <div style={{ display:'flex', gap:'8px', background:'#00030a', border:'1px solid #1e2d4a', borderRadius:'10px', padding:'8px 10px' }}>
        <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key==='Enter' && send()}
          placeholder="Ask a question..."
          style={{ flex:1, background:'none', border:'none', outline:'none', fontSize:'13px', color:'#e2e8f0' }} />
        <button onClick={send} disabled={loading}
          style={{ padding:'8px 18px', background:'#4f8ef7', color:'white', border:'none', borderRadius:'8px', cursor:'pointer', fontWeight:600, fontSize:'13px' }}>
          Send 
        </button>
      </div>
    </div>
  )
}
