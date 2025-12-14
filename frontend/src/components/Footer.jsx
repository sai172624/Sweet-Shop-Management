import { useContext, useState } from 'react'
import { AuthContext } from '../AuthContext'

export default function Footer({ setPage }) {
  const { user } = useContext(AuthContext)

  // --- THEME ---
  const theme = {
    bg: '#2f3542',       // Dark Slate
    text: '#dfe6e9',     // Soft White
    accent: '#ff4757',   // Berry Red
    muted: '#a4b0be'     // Muted Gray
  }

  // --- SUB-COMPONENT: HOVER LINK ---
  const FooterLink = ({ label, page }) => {
    const [isHovered, setIsHovered] = useState(false)
    return (
      <button
        onClick={() => setPage(page)}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          background: 'none',
          border: 'none',
          color: isHovered ? theme.accent : theme.text,
          cursor: 'pointer',
          padding: '0',
          fontSize: '15px',
          fontWeight: '500',
          transition: 'all 0.3s ease',
          textAlign: 'left',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '12px'
        }}
      >
        <span style={{ 
          opacity: isHovered ? 1 : 0, 
          transition: 'all 0.3s ease', 
          transform: isHovered ? 'translateX(0)' : 'translateX(-5px)',
          width: isHovered ? '20px' : '0px',
          overflow: 'hidden'
        }}>
          🍬
        </span>
        {label}
      </button>
    )
  }

  return (
    // marginTop ensures it pushes down, position relative for the SVG wave
    <div style={{ position: 'relative', marginTop: '0px' }}>


      <footer
        style={{
          background: theme.bg,
          color: theme.text,
          padding: '60px 20px 20px 20px',
          position: 'relative',
          zIndex: 2
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '50px'
          }}
        >
          {/* COLUMN 1: BRAND */}
          <div>
            <h2 style={{ fontSize: '28px', color: 'white', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px', fontWeight: '800' }}>
              <span style={{ background: 'white', borderRadius: '50%', width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>🍭</span>
              SweetHome
            </h2>
            <p style={{ color: theme.muted, lineHeight: 1.6, marginBottom: '24px' }}>
              Crafting happiness with sugar, spice, and everything nice. 
              The most trusted sweet shop management platform.
            </p>
            <div style={{ display: 'flex', gap: '15px' }}>
               {['fb', 'insta', 'twitter'].map((s, i) => (
                 <div key={i} style={{ width: '35px', height: '35px', background: 'rgba(255,255,255,0.1)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: '0.3s' }} onMouseEnter={e => e.target.style.background = theme.accent} onMouseLeave={e => e.target.style.background = 'rgba(255,255,255,0.1)'}>
                   📱
                 </div>
               ))}
            </div>
          </div>

          {/* COLUMN 2: QUICK LINKS */}
          <div>
            <h4 style={{ color: 'white', fontSize: '18px', marginBottom: '24px', fontWeight: '700' }}>
              Explore
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <FooterLink label="Home" page="home" />
              <FooterLink label="All Sweets" page="sweets" />

              {user?.role === 'user' && (
                <>
                  <FooterLink label="My Cart" page="cart" />
                  <FooterLink label="Order History" page="orders" />
                </>
              )}

              {user?.role === 'admin' && (
                <>
                  <FooterLink label="Admin Dashboard" page="dashboard" />
                  <FooterLink label="Inventory Management" page="inventory" />
                </>
              )}
            </div>
          </div>

          {/* COLUMN 3: CONTACT */}
          <div>
            <h4 style={{ color: 'white', fontSize: '18px', marginBottom: '24px', fontWeight: '700' }}>
              Find Us
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', color: theme.muted }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <span style={{ color: theme.accent }}>📍</span> 123, Sugar Lane, Food City
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <span style={{ color: theme.accent }}>📞</span> +91 98765 43210
              </div>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                <span style={{ color: theme.accent }}>📧</span> hello@sweethome.com
              </div>
            </div>

            {/* Newsletter Input */}
            <div style={{ marginTop: '24px', background: 'rgba(255,255,255,0.05)', padding: '10px', borderRadius: '12px', display: 'flex', border: '1px solid rgba(255,255,255,0.1)' }}>
               <input 
                  type="text" 
                  placeholder="Email..." 
                  style={{ width: '100%', background: 'transparent', border: 'none', color: 'white', outline: 'none', paddingLeft: '8px' }}
                />
                <button style={{ background: theme.accent, border: 'none', color: 'white', padding: '8px 12px', borderRadius: '8px', cursor: 'pointer' }}>
                  ➤
                </button>
            </div>
          </div>
        </div>

        {/* BOTTOM COPYRIGHT */}
        <div
          style={{
            borderTop: '1px solid rgba(255,255,255,0.1)',
            textAlign: 'center',
            paddingTop: '30px',
            marginTop: '50px',
            fontSize: '14px',
            color: theme.muted
          }}
        >
          © {new Date().getFullYear()} SweetHome. Built with <span style={{ color: theme.accent }}>❤</span> By Aviresh.
        </div>
      </footer>
    </div>
  )
}