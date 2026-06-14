// src/pages/Register.jsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { register } from '../services/api'

export default function Register({ onLogin }) {
  const [form,    setForm]    = useState({ name:'', email:'', password:'' })
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handle = async (e) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const { data } = await register(form)
      onLogin(data)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed')
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#0F172A' }}>
      <div style={{ background:'#4f083c', border:'1px solid #1e2d4a', borderRadius:'14px', padding:'36px', width:'360px' }}>
        <div style={{ fontSize:'24px', fontWeight:700, color:'#feffff', marginBottom:'4px' }}>🧠 LearnAI</div>
        <div style={{ fontSize:'13px', color:'#fafafa', marginBottom:'28px' }}>Create your free account</div>

        {error && (
          <div style={{ background:'#2a0f0f', color:'#f87171', padding:'10px 14px', borderRadius:'8px', marginBottom:'16px', fontSize:'13px' }}>
            {error}
          </div>
        )}

        {[['Name','text','name'],['Email','email','email'],['Password','password','password']].map(([label,type,key]) => (
          <div key={key} style={{ marginBottom:'14px' }}>
            <label style={{ fontSize:'12px', color:'#fbfcfd', display:'block', marginBottom:'5px' }}>{label}</label>
            <input type={type} value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
              style={{ width:'100%', padding:'10px 12px', background:'#e983c0', border:'1px solid #e983c0', borderRadius:'8px', color:'white', fontSize:'14px', outline:'none' }} />
          </div>
        ))}

        <button onClick={handle} disabled={loading}
          style={{ width:'100%', padding:'11px', background:'#000205', color:'white', border:'none', borderRadius:'8px', fontWeight:600, fontSize:'14px', cursor:'pointer', marginTop:'6px' }}>
          {loading ? 'Creating account...' : 'Create Account'}
        </button>

        <div style={{ textAlign:'center', marginTop:'16px', fontSize:'13px', color:'#f5f6f7' }}>
          Already have an account?{' '}
          <span onClick={() => navigate('/login')} style={{ color:'#4f8ef7', cursor:'pointer' }}>Sign in</span>
        </div>
      </div>
    </div>
  )
}
