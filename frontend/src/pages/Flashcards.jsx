// src/pages/Flashcards.jsx
import React, { useState, useEffect } from 'react'
import { generateFlashcards, getFlashcards, toggleMastered } from '../services/api'

export default function Flashcards() {
  const [cards,   setCards]   = useState([])
  const [topic,   setTopic]   = useState('')
  const [flipped, setFlipped] = useState({})
  const [loading, setLoading] = useState(false)

  useEffect(() => { getFlashcards().then(r => setCards(r.data)).catch(console.error) }, [])

  const handleGenerate = async () => {
    if (!topic.trim()) return
    setLoading(true)
    try {
      const { data } = await generateFlashcards(topic, 8)
      setCards(p => [...data, ...p])
      setTopic('')
    } catch (e) { alert('Error: ' + e.message) }
    setLoading(false)
  }

  const flip   = (id) => setFlipped(p => ({ ...p, [id]: !p[id] }))
  const master = async (id) => {
    const { data } = await toggleMastered(id)
    setCards(p => p.map(c => c._id === id ? data : c))
  }

  return (
    <div style={{ padding:'24px' }}>
      <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'6px' }}>
        <h2 style={{ color:'#01060c' }}>🗂️ Flashcard Generator</h2>
        <span style={{ fontSize:'12px', color:'#22d3a0', background:'#072820', padding:'3px 10px', borderRadius:'10px', border:'1px solid rgba(34,211,160,.3)' }}>Free AI</span>
      </div>
      <p style={{ color:'#000306', marginBottom:'20px', fontSize:'14px' }}>Enter a topic — click cards to flip</p>

      <div style={{ display:'flex', gap:'10px', marginBottom:'24px' }}>
        <input value={topic} onChange={e => setTopic(e.target.value)}
          placeholder="e.g. JavaScript closures, French verbs..."
          style={{ flex:1, padding:'10px 14px', borderRadius:'8px', border:'1px solid #9299a7', background:'#4f083c', color:'#e2e8f0', fontSize:'14px', outline:'none' }} />
        <button onClick={handleGenerate} disabled={loading}
          style={{ padding:'10px 20px', background:'#01050d', color:'white', border:'none', borderRadius:'8px', cursor:'pointer', fontWeight:600, whiteSpace:'nowrap' }}>
          {loading ? 'Generating...' : 'Generate ↗'}
        </button>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))', gap:'14px' }}>
        {cards.map(card => (
          <div key={card._id} onClick={() => flip(card._id)}
            style={{
              minHeight:'140px', padding:'16px', borderRadius:'10px', cursor:'pointer', transition:'all 0.2s',
              border:      card.mastered ? '2px solid #22d3a0' : flipped[card._id] ? '1px solid #010409' : '1px solid #1e2d4a',
              background:  flipped[card._id] ? '#1a2d5c' : '#4f083c',
              display:'flex', flexDirection:'column', justifyContent:'space-between'
            }}>
            <div>
              <div style={{ fontSize:'10px', color: flipped[card._id]?'#4f083c':'#4a5568', marginBottom:'6px', textTransform:'uppercase', letterSpacing:'0.5px', fontWeight:700 }}>
                {flipped[card._id] ? 'Definition' : 'Term'}
              </div>
              <div style={{ fontSize:'14px', lineHeight:1.5, color: flipped[card._id]?'#7aabff':'#e2e8f0' }}>
                {flipped[card._id] ? card.definition : card.term}
              </div>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', marginTop:'10px' }}>
              <span style={{ fontSize:'10px', color:'#4a5568', background:'#141c2e', padding:'2px 6px', borderRadius:'4px' }}>{card.topic}</span>
              <button onClick={e => { e.stopPropagation(); master(card._id) }}
                style={{ fontSize:'11px', background:'none', border:'none', cursor:'pointer', color:card.mastered?'#22d3a0':'#4a5568' }}>
                {card.mastered ? '✅ Mastered' : 'Mark done'}
              </button>
            </div>
          </div>
        ))}
        {cards.length === 0 && !loading && (
          <div style={{ color:'#4a5568', fontSize:'13px', gridColumn:'1/-1', textAlign:'center', padding:'40px' }}>
            No flashcards yet — generate some above!
          </div>
        )}
      </div>
    </div>
  )
}
