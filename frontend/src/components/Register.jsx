import { useState } from 'react'

export default function Register({ switchPage }) {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  // Default role is 'user'. We don't need a UI input for this anymore.
  const [role, setRole] = useState('user') 
  const [error, setError] = useState('')

  const register = async (e) => {
    e.preventDefault()
    setError('')
    try {
      const res = await fetch('https://sweet-shop-management-w0qq.onrender.com/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password, role })
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.message || 'Registration failed')
        return
      }
      switchPage('login')
    } catch (err) {
      setError('Server not reachable')
    }
  }

  // --- THEME ---
  const theme = {
    primary: '#ff4757',
    secondary: '#2f3542',
    inputBg: '#f8f9fa'
  }

  const inputStyle = {
    width: '100%',
    padding: '16px 20px',
    border: '2px solid transparent',
    borderRadius: '12px',
    fontSize: '15px',
    outline: 'none',
    transition: 'all 0.3s',
    background: theme.inputBg,
    color: theme.secondary,
    fontWeight: '600',
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

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#fdf2f4',
      padding: '20px'
    }}>
      
      {/* WIDE CARD CONTAINER */}
      <div style={{
        display: 'flex',
        width: '100%',
        maxWidth: '1100px', 
        background: 'white',
        borderRadius: '30px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
        overflow: 'hidden',
        minHeight: '650px'
      }}>
        
        {/* LEFT SIDE - VISUAL */}
        <div style={{
          flex: 1,
          background: 'linear-gradient(135deg, #764ba2 0%, #667eea 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          padding: '40px',
          textAlign: 'center'
        }}>
           <div style={{ fontSize: '80px', marginBottom: '20px', filter: 'drop-shadow(0 10px 10px rgba(0,0,0,0.1))' }}>🚀</div>
           <h1 style={{ fontSize: '36px', fontWeight: '900', marginBottom: '10px' }}>Join the Club</h1>
           <p style={{ fontSize: '18px', opacity: 0.9, maxWidth: '300px', lineHeight: 1.6 }}>
             Start your journey with SweetHome today. Create an account to start ordering delicious sweets.
           </p>
        </div>

        {/* RIGHT SIDE - FORM */}
        <div style={{
          flex: 1.2,
          padding: '50px 60px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          
          <div style={{ marginBottom: '30px' }}>
            <h2 style={{ fontSize: '32px', fontWeight: '800', color: theme.secondary, marginBottom: '10px' }}>Create Account</h2>
            <p style={{ color: '#a4b0be', fontSize: '16px' }}>It's free and easy to set up.</p>
          </div>

          {error && (
            <div style={{ background: '#ffe0e6', color: '#ff4757', padding: '15px', borderRadius: '12px', marginBottom: '20px', fontSize: '14px', fontWeight: '600', textAlign: 'center' }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={register}>
            
            {/* Username - Now Full Width */}
            <div>
              <label style={labelStyle}>Username</label>
              <input
                placeholder="Choose a username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
                style={inputStyle}
                onFocus={(e) => { e.target.style.background = 'white'; e.target.style.borderColor = theme.primary }}
                onBlur={(e) => { e.target.style.background = theme.inputBg; e.target.style.borderColor = 'transparent' }}
              />
            </div>

            {/* Email */}
            <div>
              <label style={labelStyle}>Email Address</label>
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                style={inputStyle}
                onFocus={(e) => { e.target.style.background = 'white'; e.target.style.borderColor = theme.primary }}
                onBlur={(e) => { e.target.style.background = theme.inputBg; e.target.style.borderColor = 'transparent' }}
              />
            </div>

            {/* Password */}
            <div>
              <label style={labelStyle}>Password</label>
              <input
                type="password"
                placeholder="Create a strong password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                style={inputStyle}
                onFocus={(e) => { e.target.style.background = 'white'; e.target.style.borderColor = theme.primary }}
                onBlur={(e) => { e.target.style.background = theme.inputBg; e.target.style.borderColor = 'transparent' }}
              />
            </div>

            <button
              type="submit"
              style={{
                width: '100%',
                padding: '18px',
                background: theme.primary,
                color: 'white',
                border: 'none',
                borderRadius: '14px',
                fontSize: '16px',
                fontWeight: '700',
                cursor: 'pointer',
                marginTop: '10px',
                marginBottom: '25px',
                boxShadow: '0 10px 25px rgba(255, 71, 87, 0.3)',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            >
              Sign Up
            </button>
          </form>

          <p style={{ textAlign: 'center', color: '#636e72', fontSize: '15px' }}>
            Already have an account?{' '}
            <span
              onClick={() => switchPage('login')}
              style={{
                color: theme.primary,
                cursor: 'pointer',
                fontWeight: '700',
                textDecoration: 'underline'
              }}
            >
              Login here
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}