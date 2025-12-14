import { useState } from 'react'

export default function AddSweet() {
  // --- STATE ---
  const [sweet, setSweet] = useState({
    name: '',
    price: '',
    quantity: '',
    category: 'other',
    imageUrl: ''
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false) // Added for UI feedback
  const [loading, setLoading] = useState(false) // Added for button state

  // --- LOGIC ---
  const addSweet = async () => {
    setError('')
    setSuccess(false)
    setLoading(true)

    try {
      const res = await fetch('https://sweet-shop-management-w0qq.onrender.com/api/sweets', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          name: sweet.name,
          price: Number(sweet.price),
          quantity: Number(sweet.quantity),
          category: sweet.category,
          imageUrl: sweet.imageUrl || null
        })
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.message || 'Failed to add sweet')
        return
      }

      // Show success message instead of alert
      setSuccess(true)
      
      // Reset form
      setSweet({
        name: '',
        price: '',
        quantity: '',
        category: 'other',
        imageUrl: ''
      })

      // Hide success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000)

    } catch (err) {
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
    border: '1px solid #f1f2f6',
    shadow: '0 20px 40px rgba(0,0,0,0.08)'
  }

  // --- STYLES ---
  const inputStyle = {
    width: '100%',
    padding: '14px 16px',
    border: '2px solid transparent',
    borderRadius: '12px',
    fontSize: '15px',
    outline: 'none',
    transition: 'all 0.3s',
    background: theme.inputBg,
    color: theme.secondary,
    fontWeight: '500'
  }

  const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    color: '#747d8c',
    fontSize: '12px',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  }

  const handleFocus = (e) => {
    e.target.style.background = 'white'
    e.target.style.borderColor = theme.primary
  }

  const handleBlur = (e) => {
    e.target.style.background = theme.inputBg
    e.target.style.borderColor = 'transparent'
  }

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '40px 20px', minHeight: '80vh' }}>
      
      {/* PAGE HEADER */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '32px', fontWeight: '800', color: theme.secondary, marginBottom: '10px' }}>
          Add New Sweet ➕
        </h2>
        <div style={{ width: '60px', height: '4px', background: theme.primary, margin: '0 auto', borderRadius: '2px' }}></div>
      </div>

      <div style={{
        background: 'white',
        padding: '40px',
        borderRadius: '24px',
        boxShadow: theme.shadow,
        border: theme.border
      }}>

        {/* MESSAGES */}
        {error && (
          <div style={{ background: '#ffe0e6', color: '#c33', padding: '14px', borderRadius: '12px', marginBottom: '24px', textAlign: 'center', fontWeight: '600' }}>
            ⚠️ {error}
          </div>
        )}

        {success && (
          <div style={{ background: '#e0fbf0', color: '#26af7a', padding: '14px', borderRadius: '12px', marginBottom: '24px', textAlign: 'center', fontWeight: '600' }}>
            ✅ Sweet Added Successfully!
          </div>
        )}

        <div style={{ display: 'grid', gap: '24px' }}>
          
          {/* 1. Name */}
          <div>
            <label style={labelStyle}>Sweet Name</label>
            <input
              placeholder="e.g. Royal Rasgulla"
              value={sweet.name}
              onChange={e => setSweet({ ...sweet, name: e.target.value })}
              style={inputStyle}
              onFocus={handleFocus} onBlur={handleBlur}
            />
          </div>

          {/* 2. Image URL */}
          <div>
            <label style={labelStyle}>Image URL</label>
            <input
              placeholder="https://example.com/image.jpg"
              value={sweet.imageUrl}
              onChange={e => setSweet({ ...sweet, imageUrl: e.target.value })}
              style={inputStyle}
              onFocus={handleFocus} onBlur={handleBlur}
            />
          </div>

          {/* 3. Price & Quantity Row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={labelStyle}>Price (₹)</label>
              <input
                placeholder="0.00"
                type="number"
                value={sweet.price}
                onChange={e => setSweet({ ...sweet, price: e.target.value })}
                style={inputStyle}
                onFocus={handleFocus} onBlur={handleBlur}
              />
            </div>

            <div>
              <label style={labelStyle}>Quantity</label>
              <input
                placeholder="0"
                type="number"
                value={sweet.quantity}
                onChange={e => setSweet({ ...sweet, quantity: e.target.value })}
                style={inputStyle}
                onFocus={handleFocus} onBlur={handleBlur}
              />
            </div>
          </div>

          {/* 4. Category */}
          <div>
            <label style={labelStyle}>Category</label>
            <select
              value={sweet.category}
              onChange={e => setSweet({ ...sweet, category: e.target.value })}
              style={{ ...inputStyle, cursor: 'pointer' }}
              onFocus={handleFocus} onBlur={handleBlur}
            >
              <option value="other">Other</option>
              <option value="cake">Cake</option>
              <option value="chocolate">Chocolate</option>
              <option value="candy">Candy</option>
              <option value="cookie">Cookie</option>
              <option value="Indian Sweet">Indian Sweet</option>
            </select>
          </div>

          {/* 5. Submit Button */}
          <button
            onClick={addSweet}
            disabled={loading}
            style={{
              width: '100%',
              padding: '16px',
              background: theme.primary,
              color: 'white',
              border: 'none',
              borderRadius: '14px',
              fontSize: '16px',
              fontWeight: '700',
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: '10px',
              boxShadow: '0 8px 20px rgba(255, 71, 87, 0.3)',
              transition: 'transform 0.2s',
              opacity: loading ? 0.7 : 1
            }}
            onMouseEnter={(e) => !loading && (e.target.style.transform = 'translateY(-2px)')}
            onMouseLeave={(e) => !loading && (e.target.style.transform = 'translateY(0)')}
          >
            {loading ? 'Adding Sweet...' : 'Add to Inventory'}
          </button>

        </div>
      </div>
    </div>
  )
}