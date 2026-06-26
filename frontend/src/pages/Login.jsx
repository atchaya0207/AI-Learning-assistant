// src/pages/Login.jsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { login } from '../services/api'

export default function Login({ onLogin }) {
  const [form,    setForm]    = useState({ email:'', password:'' })
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handle = async (e) => {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const { data } = await login(form)
      onLogin(data)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed')
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', background:'#010511' }}>
      <div style={{ background:'#4f083c', border:'1px solid #00050e', borderRadius:'14px', padding:'36px', width:'360px' }}>
        <div style={{ fontSize:'24px', fontWeight:700, color:'#fbfcfd', marginBottom:'4px' }}>LearnAI</div>
        <div style={{ fontSize:'13px', color:'#f7f8fa', marginBottom:'28px' }}>Sign in to continue learning</div>

        {error && (
          <div style={{ background:'#2a0f0f', color:'#f87171', padding:'10px 14px', borderRadius:'8px', marginBottom:'16px', fontSize:'13px' }}>
            {error}
          </div>
        )}

        {[['Email','email','email'],['Password','password','password']].map(([label,type,key]) => (
          <div key={key} style={{ marginBottom:'14px' }}>
            <label style={{ fontSize:'12px', color:'#f6f9fd', display:'block', marginBottom:'5px' }}>{label}</label>
            <input type={type} value={form[key]} onChange={e => setForm(p => ({ ...p, [key]: e.target.value }))}
              style={{ width:'100%', padding:'10px 12px', background:'#e983c0', border:'1px solid #ed88ce', borderRadius:'8px', color:'white', fontSize:'14px', outline:'none' }} />
          </div>
        ))}

        <button onClick={handle} disabled={loading}
          style={{ width:'100%', padding:'11px', background:'#00040a', color:'white', border:'none', borderRadius:'8px', fontWeight:600, fontSize:'14px', cursor:'pointer', marginTop:'6px' }}>
          {loading ? 'Signing in...' : 'Sign In'}
        </button>

        <div style={{ textAlign:'center', marginTop:'16px', fontSize:'13px', color:'#f4f4f4' }}>
          No account?{' '}
          <span onClick={() => navigate('/register')} style={{ color:'#4f8ef7', cursor:'pointer' }}>Register here</span>
        </div>
      </div>
    </div>
  )
}
