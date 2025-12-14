export default function Cart({ cart, setCart, goCheckout }) {

  // --- LOGIC (Unchanged) ---
  const increase = (item) => {
    if (item.cartQty + 1 > item.quantity) {
      alert('Stock exceeded')
      return
    }
    setCart(cart.map(c => c._id === item._id ? { ...c, cartQty: c.cartQty + 1 } : c))
  }

  const decrease = (item) => {
    if (item.cartQty === 1) return
    setCart(cart.map(c => c._id === item._id ? { ...c, cartQty: c.cartQty - 1 } : c))
  }

  const removeItem = (id) => {
    setCart(cart.filter(c => c._id !== id))
  }

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.cartQty), 0)
  }

  // --- THEME ---
  const theme = {
    primary: '#ff4757',   // Berry Red
    secondary: '#2f3542', // Dark Slate
    bg: '#fdf2f4',        // Light Pink
    cardBg: 'rgba(255, 255, 255, 0.9)',
    border: '1px solid #f1f2f6',
    shadow: '0 8px 20px rgba(0,0,0,0.05)',
    accentGreen: '#26af7a'
  }

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '20px', minHeight: '80vh' }}>
      
      {/* HEADER */}
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h2 style={{ fontSize: '36px', fontWeight: '800', color: theme.secondary, marginBottom: '10px' }}>
          Your Cart 🛒
        </h2>
        <div style={{ width: '60px', height: '4px', background: theme.primary, margin: '0 auto', borderRadius: '2px' }}></div>
      </div>

      {cart.length === 0 ? (
        // --- EMPTY STATE ---
        <div style={{
          background: theme.cardBg,
          padding: '80px 20px',
          borderRadius: '24px',
          textAlign: 'center',
          border: theme.border,
          boxShadow: theme.shadow
        }}>
          <div style={{ fontSize: '80px', marginBottom: '20px', opacity: 0.8 }}>🍩</div>
          <h3 style={{ fontSize: '24px', color: theme.secondary, marginBottom: '10px', fontWeight: '700' }}>Your cart is empty</h3>
          <p style={{ color: '#a4b0be', fontSize: '16px' }}>Looks like you haven't made a sweet choice yet.</p>
        </div>
      ) : (
        // --- CART ITEMS ---
        <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }}>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {cart.map(item => (
              <div
                key={item._id}
                style={{
                  background: 'white',
                  padding: '20px',
                  borderRadius: '20px',
                  boxShadow: theme.shadow,
                  border: theme.border,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '24px',
                  transition: 'transform 0.2s',
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Product Image */}
                <div style={{
                  width: '100px',
                  height: '100px',
                  minWidth: '100px',
                  background: item.imageUrl 
                    ? `url(${item.imageUrl}) center/cover`
                    : '#ffeaa7',
                  borderRadius: '16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {!item.imageUrl && <span style={{ fontSize: '40px' }}>🍬</span>}
                </div>

                {/* Details */}
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '700', color: theme.secondary, marginBottom: '6px' }}>
                    {item.name}
                  </h3>
                  <div style={{ fontSize: '15px', color: '#a4b0be', fontWeight: '500' }}>
                    Unit Price: ₹{item.price}
                  </div>
                </div>

                {/* Quantity Controls */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '15px',
                  background: '#f8f9fa',
                  padding: '8px 16px',
                  borderRadius: '12px'
                }}>
                  <button
                    onClick={() => decrease(item)}
                    style={{
                      width: '32px', height: '32px', border: 'none', background: 'white',
                      borderRadius: '8px', cursor: 'pointer', fontSize: '18px', fontWeight: 'bold',
                      color: theme.secondary, boxShadow: '0 2px 5px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                  >
                    −
                  </button>
                  <span style={{ fontWeight: '700', fontSize: '16px', color: theme.secondary, minWidth: '20px', textAlign: 'center' }}>
                    {item.cartQty}
                  </span>
                  <button
                    onClick={() => increase(item)}
                    style={{
                      width: '32px', height: '32px', border: 'none', background: theme.primary,
                      borderRadius: '8px', cursor: 'pointer', fontSize: '18px', fontWeight: 'bold',
                      color: 'white', boxShadow: '0 2px 5px rgba(255, 71, 87, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}
                  >
                    +
                  </button>
                </div>

                {/* Subtotal */}
                <div style={{ textAlign: 'right', minWidth: '100px' }}>
                  <div style={{ fontSize: '12px', color: '#a4b0be', marginBottom: '4px' }}>Subtotal</div>
                  <div style={{ fontSize: '20px', fontWeight: '800', color: theme.primary }}>
                    ₹{item.cartQty * item.price}
                  </div>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => removeItem(item._id)}
                  style={{
                    width: '40px', height: '40px', border: 'none', background: '#fff0f3',
                    color: theme.primary, borderRadius: '12px', cursor: 'pointer', fontSize: '18px',
                    marginLeft: '10px', transition: '0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center'
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = theme.primary; e.currentTarget.style.color = 'white' }}
                  onMouseLeave={e => { e.currentTarget.style.background = '#fff0f3'; e.currentTarget.style.color = theme.primary }}
                  title="Remove Item"
                >
                  🗑
                </button>
              </div>
            ))}
          </div>

          {/* --- SUMMARY SECTION --- */}
          <div style={{
            background: 'white',
            padding: '30px',
            borderRadius: '24px',
            boxShadow: '0 10px 40px rgba(0,0,0,0.08)',
            border: theme.border,
            display: 'flex',
            flexDirection: 'column',
            gap: '20px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '20px', borderBottom: '2px dashed #eee' }}>
              <span style={{ fontSize: '18px', color: '#a4b0be', fontWeight: '500' }}>Total Items</span>
              <span style={{ fontSize: '18px', fontWeight: '700', color: theme.secondary }}>{cart.reduce((a, c) => a + c.cartQty, 0)} items</span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '22px', fontWeight: '700', color: theme.secondary }}>Total Amount</span>
              <span style={{ fontSize: '36px', fontWeight: '900', color: theme.primary }}>
                ₹{getTotalPrice()}
              </span>
            </div>

            <button
              onClick={goCheckout}
              style={{
                width: '100%',
                padding: '18px',
                background: theme.primary,
                color: 'white',
                border: 'none',
                borderRadius: '16px',
                fontSize: '18px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                marginTop: '10px',
                boxShadow: '0 8px 25px rgba(255, 71, 87, 0.4)'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            >
              Proceed to Checkout ➔
            </button>
          </div>

        </div>
      )}
    </div>
  )
}
