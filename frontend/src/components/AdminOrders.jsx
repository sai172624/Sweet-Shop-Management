import { useEffect, useState } from 'react'

export default function AdminOrders() {
  const [orders, setOrders] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/purchases', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.message)
        return
      }

      setOrders(data.data.purchases)
    } catch {
      setError('Server not reachable')
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h2>📦 Admin Orders</h2>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <div style={{ overflowX: 'auto' }}>
        <table
          style={{
            width: '100%',
            borderCollapse: 'collapse',
            marginTop: 20
          }}
        >
          <thead style={{ background: '#f5f5f5' }}>
            <tr>
              <th style={th}>Customer</th>
              <th style={th}>Email</th>
              <th style={th}>Sweet</th>
              <th style={th}>Qty</th>
              <th style={th}>Total</th>
              <th style={th}>Status</th>
            </tr>
          </thead>

          <tbody>
            {orders.map(o => (
              <tr key={o._id} style={{ textAlign: 'center' }}>
                <td style={td}>{o.user.username}</td>
                <td style={td}>{o.user.email}</td>
                <td style={td}>{o.sweet.name}</td>
                <td style={td}>{o.quantity}</td>
                <td style={td}>₹{o.totalPrice}</td>
                <td style={{ ...td, color: 'green', fontWeight: 'bold' }}>
                  {o.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

const th = {
  padding: '10px',
  borderBottom: '1px solid #ddd'
}

const td = {
  padding: '10px',
  borderBottom: '1px solid #eee'
}
