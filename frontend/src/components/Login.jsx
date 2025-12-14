import { useState, useContext } from 'react'
import { AuthContext } from '../AuthContext'

export default function Login({ switchPage }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login } = useContext(AuthContext)

  const handleLogin = async () => {
    setError('')
    try {
      const res = await fetch('https://sweet-shop-management-w0qq.onrender.com/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.message || 'Login failed')
        return
      }

      login(data.data.user, data.data.token)
      switchPage('home')  
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
      background: '#fdf2f4', // Light background for page
      padding: '20px'
    }}>
      
      {/* CARD CONTAINER (SPLIT LAYOUT) */}
      <div style={{
        display: 'flex',
        width: '100%',
        maxWidth: '1000px', // WIDE LAYOUT
        background: 'white',
        borderRadius: '30px',
        boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
        overflow: 'hidden',
        minHeight: '600px'
      }}>
        
        {/* LEFT SIDE - VISUAL */}
        <div style={{
          flex: 1,
          background: 'linear-gradient(135deg, #ff9a9e 0%, #ff6b81 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          padding: '40px',
          textAlign: 'center'
        }}>
           <div style={{ fontSize: '80px', marginBottom: '20px', filter: 'drop-shadow(0 10px 10px rgba(0,0,0,0.1))' }}>🍬</div>
           <h1 style={{ fontSize: '40px', fontWeight: '900', marginBottom: '10px' }}>SweetHome</h1>
           <p style={{ fontSize: '18px', opacity: 0.9, maxWidth: '300px', lineHeight: 1.6 }}>
             The sweetest place on the internet. Log in to satisfy your cravings.
           </p>
        </div>

        {/* RIGHT SIDE - FORM */}
        <div style={{
          flex: 1.2, // Slightly wider for form
          padding: '60px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          
          <div style={{ marginBottom: '40px' }}>
            <h2 style={{ fontSize: '32px', fontWeight: '800', color: theme.secondary, marginBottom: '10px' }}>Welcome Back!</h2>
            <p style={{ color: '#a4b0be', fontSize: '16px' }}>Please enter your details.</p>
          </div>

          {error && (
            <div style={{ background: '#ffe0e6', color: '#ff4757', padding: '15px', borderRadius: '12px', marginBottom: '20px', fontSize: '14px', fontWeight: '600' }}>
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
            <div>
              <label style={labelStyle}>Email Address</label>
              <input
                type="email"
                placeholder="name@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={inputStyle}
                onFocus={(e) => { e.target.style.background = 'white'; e.target.style.borderColor = theme.primary }}
                onBlur={(e) => { e.target.style.background = theme.inputBg; e.target.style.borderColor = 'transparent' }}
              />
            </div>

            <div>
              <label style={labelStyle}>Password</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
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
              Sign In
            </button>
          </form>

          <p style={{ textAlign: 'center', color: '#636e72', fontSize: '15px' }}>
            Don't have an account?{' '}
            <span
              onClick={() => switchPage('register')}
              style={{
                color: theme.primary,
                cursor: 'pointer',
                fontWeight: '700',
                textDecoration: 'underline'
              }}
            >
              Sign up for free
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}