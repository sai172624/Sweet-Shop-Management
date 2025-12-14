import { useContext, useState } from 'react'
import { AuthContext } from '../AuthContext'

export default function Profile() {
  const { user, login } = useContext(AuthContext)
  const [username, setUsername] = useState(user.username)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  // --- LOGIC (Unchanged) ---
  const saveProfile = async () => {
    setError('')
    setMessage('')

    if (username.trim().length < 3) {
      setError('Username must be at least 3 characters')
      return
    }

    try {
      setLoading(true)
      const res = await fetch('http://localhost:5000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ username })
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message || 'Update failed')
        return
      }

      login({ ...user, username }, localStorage.getItem('token'))
      setMessage('Profile updated successfully')

    } catch {
      setError('Server not reachable')
    } finally {
      setLoading(false)
    }
  }

  // --- THEME ---
  const theme = {
    primary: '#ff4757',   // Berry Red
    secondary: '#2f3542', // Dark Slate
    inputBg: '#f8f9fa',
    shadow: '0 20px 40px rgba(0,0,0,0.1)',
    cardBg: 'white'
  }

  // --- STYLES ---
  const inputGroupStyle = {
    marginBottom: '20px'
  }

  const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    color: '#747d8c',
    fontSize: '12px',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '1px'
  }

  const inputStyle = {
    width: '100%',
    padding: '16px',
    border: '2px solid transparent',
    borderRadius: '12px',
    fontSize: '15px',
    outline: 'none',
    transition: 'all 0.3s',
    background: theme.inputBg,
    color: theme.secondary,
    fontWeight: '600'
  }

  return (
    <div style={{ maxWidth: '500px', margin: '0 auto', padding: '40px 20px', minHeight: '80vh' }}>
      
      <div style={{
        background: theme.cardBg,
        borderRadius: '30px',
        boxShadow: theme.shadow,
        overflow: 'hidden',
        position: 'relative'
      }}>
        
        {/* 1. DECORATIVE COVER BANNER */}
        <div style={{
          height: '140px',
          background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
          position: 'relative'
        }}>
           {/* Decorative circles */}
           <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', background: 'rgba(255,255,255,0.2)', borderRadius: '50%' }}></div>
           <div style={{ position: 'absolute', bottom: '10px', left: '10px', width: '50px', height: '50px', background: 'rgba(255,255,255,0.2)', borderRadius: '50%' }}></div>
        </div>

        {/* 2. AVATAR & INFO (Overlapping) */}
        <div style={{ textAlign: 'center', marginTop: '-60px', paddingBottom: '20px' }}>
          <div style={{
            width: '120px',
            height: '120px',
            background: 'white',
            borderRadius: '50%',
            margin: '0 auto 15px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '55px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)',
            border: `5px solid white`,
            position: 'relative',
            zIndex: 10
          }}>
            {user.role === 'admin' ? '👑' : '😺'}
          </div>
          
          <h2 style={{ fontSize: '28px', fontWeight: '800', color: theme.secondary, margin: '0 0 5px 0' }}>
            {user.username}
          </h2>
          <p style={{ color: '#a4b0be', fontSize: '14px', margin: 0, fontWeight: '500' }}>
            {user.email}
          </p>
          <div style={{ marginTop: '10px' }}>
             <span style={{ 
               background: user.role === 'admin' ? '#fff0f3' : '#e0fbf0', 
               color: user.role === 'admin' ? theme.primary : '#26af7a',
               padding: '6px 14px', borderRadius: '20px', fontSize: '12px', fontWeight: '700',
               textTransform: 'uppercase'
             }}>
               {user.role} Account
             </span>
          </div>
        </div>

        {/* 3. EDIT FORM */}
        <div style={{ padding: '20px 40px 40px 40px' }}>
          
          {/* Messages */}
          {error && (
            <div style={{ background: '#ffe0e6', color: '#c33', padding: '12px', borderRadius: '10px', marginBottom: '20px', textAlign: 'center', fontSize: '14px', fontWeight: '600' }}>
              ⚠️ {error}
            </div>
          )}
          {message && (
            <div style={{ background: '#e0fbf0', color: '#26af7a', padding: '12px', borderRadius: '10px', marginBottom: '20px', textAlign: 'center', fontSize: '14px', fontWeight: '600' }}>
              ✅ {message}
            </div>
          )}

          <div style={inputGroupStyle}>
            <label style={labelStyle}>Edit Username</label>
            <input
              value={username}
              onChange={e => setUsername(e.target.value)}
              style={inputStyle}
              onFocus={(e) => { e.target.style.background = 'white'; e.target.style.borderColor = theme.primary }}
              onBlur={(e) => { e.target.style.background = theme.inputBg; e.target.style.borderColor = 'transparent' }}
            />
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>Registered Email</label>
            <input
              value={user.email}
              disabled
              style={{ ...inputStyle, opacity: 0.6, cursor: 'not-allowed', background: '#f1f2f6' }}
            />
          </div>

          <button
            onClick={saveProfile}
            disabled={loading}
            style={{
              width: '100%',
              padding: '18px',
              background: theme.primary,
              color: 'white',
              border: 'none',
              borderRadius: '16px',
              fontSize: '16px',
              fontWeight: '700',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: '10px',
              boxShadow: '0 10px 30px rgba(255, 71, 87, 0.3)',
              transition: 'transform 0.2s'
            }}
            onMouseEnter={(e) => !loading && (e.target.style.transform = 'translateY(-2px)')}
            onMouseLeave={(e) => !loading && (e.target.style.transform = 'translateY(0)')}
          >
            {loading ? 'Saving...' : 'Save Profile'}
          </button>

        </div>
      </div>
    </div>
  )
}