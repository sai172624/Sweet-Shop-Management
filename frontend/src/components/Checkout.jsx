import { useState, useContext } from 'react'
import { AuthContext } from '../AuthContext'

export default function Checkout({ cart, clearCart, goOrders }) {
  const { user } = useContext(AuthContext)
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // --- LOGIC (Unchanged) ---
  if (!cart || cart.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <h2 style={{ color: '#2f3542' }}>Your cart is empty 🛒</h2>
      </div>
    )
  }

  // Expected delivery = today + 4 days
  const deliveryDate = new Date()
  deliveryDate.setDate(deliveryDate.getDate() + 4)
  const deliveryString = deliveryDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.cartQty), 0)
  }

  const placeOrder = async () => {
    if (!phone || phone.length < 10) {
      setError('Please enter a valid 10-digit phone number')
      return
    }

    setLoading(true)
    setError('')

    try {
      for (const item of cart) {
        const res = await fetch(
          `https://sweet-shop-management-w0qq.onrender.com/api/sweets/${item._id}/purchase`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify({
              quantity: item.cartQty
            })
          }
        )
        const data = await res.json()
        if (!res.ok) throw new Error(data.message)
      }
      clearCart()
      goOrders()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // --- THEME ---
  const theme = {
    primary: '#ff4757',
    secondary: '#2f3542',
    bg: '#fdf2f4',
    cardBg: 'white',
    inputBg: '#f8f9fa',
    border: '1px solid #f1f2f6',
    shadow: '0 8px 30px rgba(0,0,0,0.08)'
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px', minHeight: '80vh' }}>
      
      {/* HEADER */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '32px', fontWeight: '800', color: theme.secondary, marginBottom: '10px' }}>
          Secure Checkout 🔒
        </h2>
        <div style={{ width: '60px', height: '4px', background: theme.primary, margin: '0 auto', borderRadius: '2px' }}></div>
      </div>

      {/* MAIN CARD */}
      <div style={{
        background: theme.cardBg,
        borderRadius: '24px',
        padding: '30px',
        boxShadow: theme.shadow,
        border: theme.border
      }}>
        
        {/* ORDER SUMMARY LIST */}
        <h3 style={{ fontSize: '18px', color: theme.secondary, borderBottom: '2px dashed #eee', paddingBottom: '10px', marginBottom: '20px' }}>
          Order Summary
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
          {cart.map(item => (
            <div key={item._id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '15px' }}>
              <span style={{ color: '#57606f' }}>
                <span style={{ fontWeight: '700', color: theme.secondary }}>{item.cartQty}x</span> {item.name}
              </span>
              <span style={{ fontWeight: '600', color: theme.secondary }}>₹{item.price * item.cartQty}</span>
            </div>
          ))}
        </div>

        {/* TOTAL */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '15px', borderTop: '2px solid #eee', marginBottom: '30px' }}>
          <span style={{ fontSize: '18px', fontWeight: '700', color: theme.secondary }}>Total to Pay</span>
          <span style={{ fontSize: '24px', fontWeight: '900', color: theme.primary }}>₹{getTotalPrice()}</span>
        </div>

        {/* DELIVERY DETAILS FORM */}
        <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '16px', marginBottom: '25px' }}>
          <h4 style={{ margin: '0 0 15px 0', fontSize: '16px', color: theme.secondary }}>Shipping Details</h4>
          
          <div style={{ marginBottom: '15px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: '600', color: '#747d8c', marginBottom: '5px' }}>Phone Number</label>
            <input
              placeholder="Enter 10-digit number"
              value={phone}
              onChange={e => setPhone(e.target.value)}
              style={{
                width: '100%', padding: '12px', borderRadius: '8px', border: '1px solid #ddd',
                outline: 'none', fontSize: '14px', fontWeight: '500'
              }}
            />
          </div>

          <div style={{ fontSize: '14px', color: '#57606f', marginBottom: '8px' }}>
            📦 <b>Expected Delivery:</b> {deliveryString}
          </div>
          <div style={{ fontSize: '14px', color: '#57606f' }}>
            💳 <b>Payment Method:</b> Cash on Delivery
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div style={{ background: '#ffe0e6', color: '#c33', padding: '12px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center', fontSize: '14px', fontWeight: '600' }}>
            ⚠️ {error}
          </div>
        )}

        {/* BUTTON */}
        <button 
          onClick={placeOrder} 
          disabled={loading}
          style={{
            width: '100%',
            padding: '16px',
            background: loading ? '#b2bec3' : theme.primary,
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: '700',
            cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: loading ? 'none' : '0 8px 20px rgba(255, 71, 87, 0.4)',
            transition: 'transform 0.2s'
          }}
          onMouseEnter={e => !loading && (e.target.style.transform = 'translateY(-2px)')}
          onMouseLeave={e => !loading && (e.target.style.transform = 'translateY(0)')}
        >
          {loading ? 'Processing Order...' : 'Confirm Order ➔'}
        </button>

      </div>
    </div>
  )
}