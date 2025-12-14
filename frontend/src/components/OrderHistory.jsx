import { useEffect, useState, useContext } from 'react'
import jsPDF from 'jspdf'
import { AuthContext } from '../AuthContext'

export default function OrderHistory() {
  const { user } = useContext(AuthContext)
  const [orders, setOrders] = useState([])
  const [hoveredOrder, setHoveredOrder] = useState(null)

  // --- LOGIC (Unchanged) ---
  useEffect(() => {
    fetch('http://localhost:5001/api/purchases/my-history', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
      .then(res => res.json())
      .then(data => setOrders(data.data.purchases))
  }, [])

  const downloadBill = (order) => {
    const pdf = new jsPDF()
    const deliveryDate = new Date(order.createdAt)
    deliveryDate.setDate(deliveryDate.getDate() + 4)

    pdf.setFontSize(18)
    pdf.text('SweetHome', 105, 15, { align: 'center' })
    pdf.setFontSize(12)
    pdf.text(`Customer: ${user.username}`, 10, 30)
    pdf.text(`Email: ${user.email}`, 10, 38)
    pdf.text(`Payment: Cash on Delivery`, 10, 46)
    pdf.text(`Expected Delivery: ${deliveryDate.toDateString()}`, 10, 54)
    pdf.line(10, 60, 200, 60)
    pdf.text(`${order.sweet.name} x ${order.quantity} = ₹${order.totalPrice}`, 10, 70)
    pdf.text(`Total: ₹${order.totalPrice}`, 10, 85)
    pdf.save(`SweetHome_Order_${order._id}.pdf`)
  }

  // --- THEME ---
  const theme = {
    primary: '#ff4757',
    secondary: '#2f3542',
    accent: '#26af7a',
    cardBg: 'white',
    shadow: '0 4px 15px rgba(0,0,0,0.05)',
    hoverShadow: '0 12px 30px rgba(0,0,0,0.1)'
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px', minHeight: '80vh' }}>
      
      {/* HEADER */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h2 style={{ fontSize: '36px', fontWeight: '800', color: theme.secondary, marginBottom: '10px' }}>
          Order History 📦
        </h2>
        <div style={{ width: '60px', height: '4px', background: theme.primary, margin: '0 auto', borderRadius: '2px' }}></div>
      </div>

      {orders.length === 0 ? (
         <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '20px', boxShadow: theme.shadow }}>
           <p style={{ fontSize: '18px', color: '#a4b0be' }}>You haven't ordered any sweets yet.</p>
         </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px' }}>
          {orders.map(order => (
            <div 
              key={order._id} 
              onMouseEnter={() => setHoveredOrder(order._id)}
              onMouseLeave={() => setHoveredOrder(null)}
              style={{
                background: 'white',
                borderRadius: '20px',
                padding: '24px',
                border: '1px solid #f1f2f6',
                boxShadow: hoveredOrder === order._id ? theme.hoverShadow : theme.shadow,
                transition: 'all 0.3s ease',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* STATUS BADGE */}
              <div style={{ position: 'absolute', top: '20px', right: '20px' }}>
                <span style={{ background: '#e0fbf0', color: theme.accent, fontSize: '11px', fontWeight: '700', padding: '4px 10px', borderRadius: '20px' }}>
                  CONFIRMED
                </span>
              </div>

              {/* DATE */}
              <div style={{ fontSize: '12px', color: '#a4b0be', marginBottom: '10px', fontWeight: '600' }}>
                Ordered on: {new Date(order.createdAt).toLocaleDateString()}
              </div>

              {/* SWEET DETAILS */}
              <h3 style={{ margin: '0 0 5px 0', fontSize: '20px', color: theme.secondary, fontWeight: '700' }}>
                {order.sweet.name}
              </h3>
              
              <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
                <span style={{ fontSize: '14px', color: '#747d8c', background: '#f1f2f6', padding: '4px 8px', borderRadius: '6px' }}>
                  Qty: <b>{order.quantity}</b>
                </span>
                <span style={{ fontSize: '14px', color: theme.primary, background: '#fff0f3', padding: '4px 8px', borderRadius: '6px' }}>
                  Total: <b>₹{order.totalPrice}</b>
                </span>
              </div>

              <div style={{ flex: 1 }}></div>

              {/* ACTION BUTTON */}
              <button 
                onClick={() => downloadBill(order)}
                style={{
                  width: '100%',
                  padding: '12px',
                  background: 'white',
                  border: `2px solid ${theme.primary}`,
                  color: theme.primary,
                  borderRadius: '10px',
                  fontWeight: '700',
                  fontSize: '14px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  transition: '0.2s'
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = theme.primary
                  e.currentTarget.style.color = 'white'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'white'
                  e.currentTarget.style.color = theme.primary
                }}
              >
                <span>🧾</span> Download Invoice
              </button>

            </div>
          ))}
        </div>
      )}
    </div>
  )
}