// src/components/Sidebar.jsx
import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

export default function Sidebar({ user, onLogout }) {
  const navigate = useNavigate()
  const location = useLocation()

  const links = [
    { path:'/',           label:'Dashboard' },
    { path:'/chat',       label:'AI Tutor'  },
    { path:'/quiz',       label:'Quiz'      },
    { path:'/flashcards', label:'Flashcards' },
  ]

  return (
    <div style={{ width:'210px', background:'#4f083c', color:'white', display:'flex', flexDirection:'column', height:'100vh', flexShrink:0 }}>
      <div style={{ padding:'18px 16px', borderBottom:'1px solid #440c49' }}>
        <div style={{ fontSize:'17px', fontWeight:700, color:'#eff2f6' }}>AI Learning Assistant</div>
        <div style={{ fontSize:'11px', color:'#f4f9f8', marginTop:'3px' }}>Groq + Llama 3</div>
      </div>

      <nav style={{ padding:'10px 8px', flex:1 }}>
        {links.map(l => (
          <div key={l.path} onClick={() => navigate(l.path)}
            style={{
              padding:'10px 12px', borderRadius:'8px', cursor:'pointer',
              fontSize:'13px', fontWeight:500, marginBottom:'3px',
              background: location.pathname === l.path ? '#ded6dc' : 'transparent',
              color:      location.pathname === l.path ? '#011536'  : '#94a3b8',
              border:     location.pathname === l.path ? '1px solid #1e2d4a' : '1px solid transparent',
            }}>
            {l.label}
          </div>
        ))}
      </nav>

      <div style={{ padding:'14px 16px', borderTop:'1px solid #4a1e3e' }}>
        <div style={{ fontSize:'12px', color:'#86a0c4', marginBottom:'8px' }}>{user.name}</div>
        <button onClick={onLogout}
          style={{ width:'100%', padding:'7px', background:'#1e2d4a', color:'#94a3b8', border:'none', borderRadius:'7px', cursor:'pointer', fontSize:'12px' }}>
          Logout
        </button>
      </div>
    </div>
  )
}
