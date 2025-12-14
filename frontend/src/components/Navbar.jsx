import { useContext, useState } from 'react'
import { AuthContext } from '../AuthContext'

export default function Navbar({ setPage, cartCount = 0, activePage }) {
  const { logout, user } = useContext(AuthContext)
  const [hoveredBtn, setHoveredBtn] = useState(null)

  /* ---------------- STYLES ---------------- */

  const navContainerStyle = {
    position: 'sticky',
    top: '16px',
    zIndex: 1000,
    display: 'flex',
    justifyContent: 'center',
    marginBottom: '24px'
  }

  const glassBarStyle = {
    width: '95%',
    maxWidth: '1200px',
    background: 'rgba(255, 255, 255, 0.85)',
    backdropFilter: 'blur(14px)',
    WebkitBackdropFilter: 'blur(14px)',
    borderRadius: '999px',
    padding: '10px 24px',
    boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
    border: '1px solid rgba(255,255,255,0.4)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px'
  }

  const NavBtn = ({ label, icon, page }) => {
    const isActive = activePage === page
    const isHovered = hoveredBtn === page

    return (
      <button
        onClick={() => setPage(page)}
        onMouseEnter={() => setHoveredBtn(page)}
        onMouseLeave={() => setHoveredBtn(null)}
        style={{
          background: isActive
            ? '#ff4757'
            : isHovered
            ? '#ffeaa7'
            : 'transparent',
          color: isActive ? 'white' : '#2f3542',
          border: 'none',
          padding: '8px 18px',
          borderRadius: '999px',
          fontSize: '14px',
          fontWeight: '600',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          transition: 'all 0.25s ease',
          boxShadow: isActive
            ? '0 4px 14px rgba(255,71,87,0.4)'
            : 'none',
          transform: isActive || isHovered ? 'scale(1.05)' : 'scale(1)',
          whiteSpace: 'nowrap'
        }}
      >
        <span>{icon}</span>
        {label}
      </button>
    )
  }

  /* ---------------- RENDER ---------------- */

  return (
    <div style={navContainerStyle}>
      <div style={glassBarStyle}>
        {/* LEFT NAV */}
        <div
          style={{
            display: 'flex',
            gap: '8px',
            alignItems: 'center',
            flexWrap: 'nowrap',
            overflowX: 'auto'
          }}
        >
          <NavBtn label="Home" icon="🏠" page="home" />
          <NavBtn label="Sweets" icon="🍭" page="sweets" />

          {/* -------- GUEST -------- */}
          {!user && (
            <>
              <NavBtn label="Login" icon="🔐" page="login" />
              <NavBtn label="Register" icon="📝" page="register" />
            </>
          )}

          {/* -------- USER -------- */}
          {user?.role === 'user' && (
            <>
              <NavBtn
                label={`Cart${cartCount > 0 ? ` (${cartCount})` : ''}`}
                icon="🛒"
                page="cart"
              />
              <NavBtn label="Orders" icon="📦" page="orders" />
            </>
          )}

          {/* -------- ADMIN -------- */}
          {user?.role === 'admin' && (
            <>
              <NavBtn label="Add" icon="➕" page="add" />
              <NavBtn label="Inventory" icon="📊" page="inventory" />
              <NavBtn label="Orders" icon="📋" page="admin-orders" />
              <NavBtn label="Dashboard" icon="📈" page="dashboard" />
            </>
          )}

          {user && <NavBtn label="Profile" icon="👤" page="profile" />}
        </div>

        {/* RIGHT ACTION */}
        {user && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '14px',
              borderLeft: '1px solid #e0e0e0',
              paddingLeft: '14px',
              whiteSpace: 'nowrap'
            }}
          >
            <div style={{ textAlign: 'right' }}>
              <div
                style={{
                  fontSize: '11px',
                  color: '#747d8c',
                  textTransform: 'uppercase'
                }}
              >
                Logged in as
              </div>
              <div
                style={{
                  fontSize: '14px',
                  fontWeight: '700',
                  color: '#2f3542'
                }}
              >
                {user.username}
              </div>
            </div>

            <button
              onClick={logout}
              title="Logout"
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                border: 'none',
                background: '#ff6b81',
                color: 'white',
                cursor: 'pointer',
                fontSize: '14px',
                transition: 'transform 0.2s'
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = 'scale(1.1)')
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = 'scale(1)')
              }
            >
              ❌
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
