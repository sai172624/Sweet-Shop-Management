import { useEffect, useState } from 'react'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const res = await fetch('https://sweet-shop-management-w0qq.onrender.com/api/stats/dashboard', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.message)
        return
      }

      setStats(data.data)
    } catch {
      setError('Server not reachable')
    }
  }

  if (!stats) return (
    <div style={{ textAlign: 'center', padding: '60px' }}>
      <p>Loading dashboard...</p>
    </div>
  )

  const Card = ({ title, value, color = '#667eea', icon }) => (
    <div style={{
      background: 'white',
      padding: '24px',
      borderRadius: '12px',
      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
      transition: 'transform 0.3s',
      cursor: 'pointer'
    }}
    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: '12px'
      }}>
        <span style={{
          fontSize: '36px',
          background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          {icon}
        </span>
        <h3 style={{
          fontSize: '32px',
          fontWeight: 'bold',
          color: '#333'
        }}>
          {value}
        </h3>
      </div>
      <p style={{
        fontSize: '14px',
        color: '#666',
        fontWeight: '500'
      }}>
        {title}
      </p>
    </div>
  )

  return (
    <div>
      <h2 style={{
        fontSize: '32px',
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: '32px',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent'
      }}>
        📊 Admin Dashboard
      </h2>

      {error && (
        <div style={{
          background: '#fee',
          color: '#c33',
          padding: '12px',
          borderRadius: '8px',
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          {error}
        </div>
      )}

      {/* Statistics Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px',
        marginBottom: '40px'
      }}>
        <Card 
          title="Total Sweets" 
          value={stats.overview.totalSweets} 
          color="#667eea"
          icon="🍬"
        />
        <Card 
          title="Available Sweets" 
          value={stats.overview.availableSweets} 
          color="#00d2d3"
          icon="✅"
        />
        <Card 
          title="Out of Stock" 
          value={stats.overview.outOfStockSweets} 
          color="#ff6b6b"
          icon="❌"
        />
        <Card 
          title="Total Users" 
          value={stats.overview.totalUsers} 
          color="#764ba2"
          icon="👥"
        />
        <Card 
          title="Total Purchases" 
          value={stats.overview.totalPurchases} 
          color="#feca57"
          icon="📦"
        />
        <Card 
          title="Total Revenue" 
          value={`₹${stats.overview.totalRevenue}`} 
          color="#48dbfb"
          icon="💰"
        />
      </div>

      {/* Top Selling Sweets */}
      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
      }}>
        <h3 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          marginBottom: '24px',
          color: '#333'
        }}>
          🔥 Top Selling Sweets
        </h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'separate',
            borderSpacing: '0'
          }}>
            <thead>
              <tr style={{ background: '#f8f9fa' }}>
                <th style={{
                  padding: '12px 16px',
                  textAlign: 'left',
                  color: '#666',
                  fontWeight: '600',
                  fontSize: '14px',
                  borderBottom: '2px solid #e0e0e0'
                }}>
                  Rank
                </th>
                <th style={{
                  padding: '12px 16px',
                  textAlign: 'left',
                  color: '#666',
                  fontWeight: '600',
                  fontSize: '14px',
                  borderBottom: '2px solid #e0e0e0'
                }}>
                  Name
                </th>
                <th style={{
                  padding: '12px 16px',
                  textAlign: 'left',
                  color: '#666',
                  fontWeight: '600',
                  fontSize: '14px',
                  borderBottom: '2px solid #e0e0e0'
                }}>
                  Category
                </th>
                <th style={{
                  padding: '12px 16px',
                  textAlign: 'center',
                  color: '#666',
                  fontWeight: '600',
                  fontSize: '14px',
                  borderBottom: '2px solid #e0e0e0'
                }}>
                  Units Sold
                </th>
                <th style={{
                  padding: '12px 16px',
                  textAlign: 'right',
                  color: '#666',
                  fontWeight: '600',
                  fontSize: '14px',
                  borderBottom: '2px solid #e0e0e0'
                }}>
                  Revenue
                </th>
              </tr>
            </thead>
            <tbody>
              {stats.topSellingSweets.map((s, index) => (
                <tr key={s._id} style={{
                  transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#f8f9fa'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                >
                  <td style={{
                    padding: '16px',
                    borderBottom: '1px solid #f0f0f0'
                  }}>
                    <span style={{
                      background: index === 0 ? 'linear-gradient(135deg, #ffd700, #ffed4e)' :
                                 index === 1 ? 'linear-gradient(135deg, #c0c0c0, #e0e0e0)' :
                                 index === 2 ? 'linear-gradient(135deg, #cd7f32, #e5a572)' :
                                 '#e0e0e0',
                      color: index < 3 ? '#fff' : '#666',
                      padding: '4px 10px',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: 'bold'
                    }}>
                      #{index + 1}
                    </span>
                  </td>
                  <td style={{
                    padding: '16px',
                    fontWeight: '600',
                    color: '#333',
                    borderBottom: '1px solid #f0f0f0'
                  }}>
                    {s.name}
                  </td>
                  <td style={{
                    padding: '16px',
                    borderBottom: '1px solid #f0f0f0'
                  }}>
                    <span style={{
                      background: '#f0f0f0',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      color: '#666'
                    }}>
                      {s.category}
                    </span>
                  </td>
                  <td style={{
                    padding: '16px',
                    textAlign: 'center',
                    fontWeight: '600',
                    color: '#667eea',
                    borderBottom: '1px solid #f0f0f0'
                  }}>
                    {s.totalSold}
                  </td>
                  <td style={{
                    padding: '16px',
                    textAlign: 'right',
                    fontWeight: 'bold',
                    fontSize: '16px',
                    color: '#333',
                    borderBottom: '1px solid #f0f0f0'
                  }}>
                    ₹{s.totalRevenue}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}