import { useState } from 'react'

export default function EditSweet({ sweet, onBack, onUpdated }) {
  const [form, setForm] = useState({ ...sweet })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // 🔄 Update sweet
  const updateSweet = async () => {
    setError('')
    setLoading(true)
    try {
      const res = await fetch(`https://sweet-shop-management-w0qq.onrender.com/api/sweets/${sweet._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          name: form.name,
          price: Number(form.price),
          quantity: Number(form.quantity),
          category: form.category,
          imageUrl: form.imageUrl
        })
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.message)
        return
      }

      alert('Sweet updated successfully!')
      onUpdated()
      onBack()
    } catch {
      setError('Server not reachable')
    } finally {
      setLoading(false)
    }
  }

  // 🗑️ Delete sweet
  const deleteSweet = async () => {
    if (!window.confirm('Are you sure you want to delete this sweet? This cannot be undone.')) return

    try {
      const res = await fetch(`http://localhost:5001/api/sweets/${sweet._id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })

      if (!res.ok) {
        setError('Failed to delete')
        return
      }

      alert('Sweet deleted')
      onUpdated()
      onBack()
    } catch {
      setError('Server not reachable')
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
      
      {/* HEADER NAV */}
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={onBack}
          style={{
            background: 'transparent',
            border: 'none',
            color: '#747d8c',
            fontWeight: '700',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            fontSize: '14px'
          }}
        >
          ← Back to List
        </button>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '32px', fontWeight: '800', color: theme.secondary, marginBottom: '10px' }}>
          Edit Sweet ✏️
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

        {error && (
          <div style={{ background: '#ffe0e6', color: '#c33', padding: '14px', borderRadius: '12px', marginBottom: '24px', textAlign: 'center', fontWeight: '600' }}>
            ⚠️ {error}
          </div>
        )}

        <div style={{ display: 'grid', gap: '24px' }}>
          
          {/* Name */}
          <div>
            <label style={labelStyle}>Sweet Name</label>
            <input
              value={form.name}
              onChange={e => setForm({ ...form, name: e.target.value })}
              style={inputStyle}
              onFocus={handleFocus} onBlur={handleBlur}
            />
          </div>

          {/* Image URL */}
          <div>
            <label style={labelStyle}>Image URL</label>
            <input
              value={form.imageUrl}
              onChange={e => setForm({ ...form, imageUrl: e.target.value })}
              style={inputStyle}
              onFocus={handleFocus} onBlur={handleBlur}
            />
          </div>

          {/* Price & Quantity Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <label style={labelStyle}>Price (₹)</label>
              <input
                type="number"
                value={form.price}
                onChange={e => setForm({ ...form, price: e.target.value })}
                style={inputStyle}
                onFocus={handleFocus} onBlur={handleBlur}
              />
            </div>
            <div>
              <label style={labelStyle}>Quantity</label>
              <input
                type="number"
                value={form.quantity}
                onChange={e => setForm({ ...form, quantity: e.target.value })}
                style={inputStyle}
                onFocus={handleFocus} onBlur={handleBlur}
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label style={labelStyle}>Category</label>
            <select
              value={form.category}
              onChange={e => setForm({ ...form, category: e.target.value })}
              style={{ ...inputStyle, cursor: 'pointer' }}
              onFocus={handleFocus} onBlur={handleBlur}
            >
              <option value="other">Other</option>
              <option value="Indian Sweet">Indian Sweet</option>
              <option value="cake">Cake</option>
              <option value="chocolate">Chocolate</option>
              <option value="candy">Candy</option>
              <option value="cookie">Cookie</option>
            </select>
          </div>

          {/* Action Buttons */}
          <div style={{ display: 'flex', gap: '15px', marginTop: '10px' }}>
            
            <button
              onClick={deleteSweet}
              style={{
                padding: '16px 24px',
                background: '#fff0f3',
                color: theme.primary,
                border: 'none',
                borderRadius: '14px',
                fontSize: '16px',
                fontWeight: '700',
                cursor: 'pointer',
                transition: '0.2s'
              }}
              onMouseEnter={(e) => e.target.style.background = '#ffe0e6'}
              onMouseLeave={(e) => e.target.style.background = '#fff0f3'}
            >
              🗑 Delete
            </button>

            <button
              onClick={updateSweet}
              disabled={loading}
              style={{
                flex: 1,
                padding: '16px',
                background: theme.primary,
                color: 'white',
                border: 'none',
                borderRadius: '14px',
                fontSize: '16px',
                fontWeight: '700',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: '0 8px 20px rgba(255, 71, 87, 0.3)',
                transition: 'transform 0.2s',
                opacity: loading ? 0.7 : 1
              }}
              onMouseEnter={(e) => !loading && (e.target.style.transform = 'translateY(-2px)')}
              onMouseLeave={(e) => !loading && (e.target.style.transform = 'translateY(0)')}
            >
              {loading ? 'Updating...' : 'Save Changes'}
            </button>
            
          </div>

        </div>
      </div>
    </div>
  )
}