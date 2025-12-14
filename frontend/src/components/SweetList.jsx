import { useEffect, useState } from 'react'
import EditSweet from './EditSweet'

export default function SweetList({ user, addToCart, cart = [], setPage }) {
  /* ---------------- STATE (Your Exact Logic) ---------------- */
  const [sweets, setSweets] = useState([])
  const [selectedSweet, setSelectedSweet] = useState(null)
  const [error, setError] = useState('')
  const [hoveredCard, setHoveredCard] = useState(null)

  // Filters
  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')
  const [available, setAvailable] = useState('')

  /* ---------------- THEME (For UI Polish) ---------------- */
  const theme = {
    primary: '#ff4757',   // Berry Red
    secondary: '#2f3542', // Dark Slate
    inputBg: '#f8f9fa',
    border: '1px solid #f1f2f6',
    shadow: '0 4px 15px rgba(0,0,0,0.05)',
    hoverShadow: '0 15px 35px rgba(0,0,0,0.1)'
  }

  /* ---------------- FUNCTIONALITY (Your Exact Logic) ---------------- */
  useEffect(() => {
    fetchSweets()
  }, [])

  const fetchSweets = async () => {
    try {
      setError('')

      const params = new URLSearchParams()
      if (name) params.append('name', name)
      if (category) params.append('category', category)
      if (minPrice) params.append('minPrice', minPrice)
      if (maxPrice) params.append('maxPrice', maxPrice)
      if (available) params.append('available', available)

      // ✅ Keeping your PUBLIC route exactly as requested
      const url = params.toString()
        ? `http://localhost:5001/api/public/sweets/search?${params.toString()}`
        : `http://localhost:5001/api/public/sweets`

      const res = await fetch(url) 

      const data = await res.json()
      if (!res.ok) {
        setError(data.message || 'Failed to load sweets')
        return
      }

      setSweets(data.data?.sweets || [])
    } catch {
      setError('Server not reachable')
    }
  }

  const handleAddToCart = (sweet) => {
    if (!user) {
      alert('Please login to add items to cart')
      setPage('login')
      return
    }
    addToCart(sweet)
  }

  /* ---------------- ADMIN EDIT ---------------- */
  if (selectedSweet) {
    return (
      <EditSweet
        sweet={selectedSweet}
        onBack={() => setSelectedSweet(null)}
        onUpdated={fetchSweets}
      />
    )
  }

  /* ---------------- STYLES ---------------- */
  const containerStyle = {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '20px',
    minHeight: '100vh',
    display: 'flex',
    gap: '30px',
    alignItems: 'flex-start'
  }

  const sidebarStyle = {
    width: '240px',
    minWidth: '240px',
    background: 'white',
    padding: '24px',
    borderRadius: '20px',
    boxShadow: theme.shadow,
    border: theme.border,
    position: 'sticky',
    top: '100px',
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  }

  const sectionTitle = {
    fontSize: '12px',
    fontWeight: '700',
    color: '#a4b0be',
    textTransform: 'uppercase',
    marginBottom: '5px',
    letterSpacing: '0.5px'
  }

  const inputStyle = {
    width: '90%',
    padding: '10px 14px',
    borderRadius: '10px',
    border: '2px solid transparent',
    background: theme.inputBg,
    fontSize: '14px',
    outline: 'none',
    transition: '0.2s',
    color: theme.secondary,
    fontWeight: '500'
  }

  const handleFocus = e => { e.target.style.background = 'white'; e.target.style.borderColor = theme.primary }
  const handleBlur = e => { e.target.style.background = theme.inputBg; e.target.style.borderColor = 'transparent' }

  /* ---------------- UI RENDER ---------------- */
  return (
    <div style={containerStyle}>
      
      {/* FILTER SIDEBAR */}
      <aside style={sidebarStyle}>
        <div style={{ paddingBottom: '10px', borderBottom: '1px solid #eee', marginBottom: '5px' }}>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '800', color: theme.secondary }}>
             ⚡ Filters
          </h3>
        </div>

        {/* Search */}
        <div>
          <label style={sectionTitle}>Search</label>
          <input
            placeholder="Name..."
            value={name}
            onChange={e => setName(e.target.value)}
            onFocus={handleFocus} onBlur={handleBlur}
            style={inputStyle}
          />
        </div>

        {/* Category */}
        <div>
          <label style={sectionTitle}>Category</label>
          <select
            value={category}
            onChange={e => setCategory(e.target.value)}
            onFocus={handleFocus} onBlur={handleBlur}
            style={inputStyle}
          >
            <option value="">All Categories</option>
            <option value="Indian Sweet">Indian Sweet</option>
            <option value="cake">Cake</option>
            <option value="chocolate">Chocolate</option>
            <option value="candy">Candy</option>
            <option value="cookie">Cookie</option>
          </select>
        </div>

        {/* Price */}
        <div>
          <label style={sectionTitle}>Price Range</label>
          <div style={{ display: 'flex', gap: '10px' }}>
            <input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={e => setMinPrice(e.target.value)}
              onFocus={handleFocus} onBlur={handleBlur}
              style={{ ...inputStyle, textAlign: 'center' }}
            />
            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={e => setMaxPrice(e.target.value)}
              onFocus={handleFocus} onBlur={handleBlur}
              style={{ ...inputStyle, textAlign: 'center' }}
            />
          </div>
        </div>

        {/* Stock */}
        <div>
          <label style={sectionTitle}>Availability</label>
          <select
            value={available}
            onChange={e => setAvailable(e.target.value)}
            onFocus={handleFocus} onBlur={handleBlur}
            style={inputStyle}
          >
            <option value="">Any</option>
            <option value="true">In Stock</option>
            <option value="false">Out of Stock</option>
          </select>
        </div>

        <button
          onClick={fetchSweets}
          style={{
            marginTop: '10px',
            width: '100%',
            padding: '12px',
            background: theme.primary,
            color: 'white',
            border: 'none',
            borderRadius: '12px',
            fontWeight: '700',
            cursor: 'pointer',
            boxShadow: '0 4px 12px rgba(255, 71, 87, 0.3)',
            transition: 'transform 0.1s'
          }}
          onMouseDown={e => e.target.style.transform = 'scale(0.98)'}
          onMouseUp={e => e.target.style.transform = 'scale(1)'}
        >
          Apply Filters
        </button>
      </aside>

      {/* SWEETS GRID */}
      <main style={{ flex: 1, width: '100%' }}>
        <div style={{ marginBottom: '25px' }}>
          <h2 style={{ fontSize: '28px', fontWeight: '800', color: theme.secondary, margin: 0 }}>
            Our Sweets 🍬
          </h2>
          <p style={{ margin: '5px 0 0 0', color: '#a4b0be', fontSize: '14px' }}>
            Showing {sweets.length} delicious items
          </p>
        </div>

        {error && (
          <div style={{ background: '#ffe0e6', color: '#c33', padding: '12px', borderRadius: '8px', marginBottom: '20px' }}>
            ⚠️ {error}
          </div>
        )}

        {sweets.length === 0 && !error && (
           <div style={{ textAlign: 'center', padding: '60px', background: 'white', borderRadius: '20px', border: theme.border }}>
             <div style={{ fontSize: '40px' }}>🍪</div>
             <p style={{ color: '#a4b0be', marginTop: '10px' }}>No sweets found. Try changing filters.</p>
           </div>
        )}

        <div style={{
          display: 'grid',
          // Fits 3-4 items on standard screens (min 220px)
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: '24px'
        }}>
          {sweets.map(s => {
            const inCart = cart.some(i => i._id === s._id)
            const hasStock = s.quantity > 0
            const isHovered = hoveredCard === s._id

            return (
              <div
                key={s._id}
                onMouseEnter={() => setHoveredCard(s._id)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  background: 'white',
                  borderRadius: '20px',
                  border: theme.border,
                  overflow: 'hidden',
                  boxShadow: isHovered ? theme.hoverShadow : theme.shadow,
                  transform: isHovered ? 'translateY(-6px)' : 'translateY(0)',
                  transition: 'all 0.3s ease',
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column'
                }}
              >
                {/* Admin Edit Button */}
                {user?.role === 'admin' && (
                  <button
                    onClick={() => setSelectedSweet(s)}
                    style={{
                      position: 'absolute', top: '10px', right: '10px',
                      width: '32px', height: '32px', borderRadius: '50%',
                      background: 'rgba(255,255,255,0.9)', border: 'none',
                      cursor: 'pointer', zIndex: 10, boxShadow: '0 2px 5px rgba(0,0,0,0.1)'
                    }}
                  >
                    ✏️
                  </button>
                )}

                {/* Image Area */}
                <div style={{
                  height: '180px',
                  background: s.imageUrl ? `url(${s.imageUrl}) center/cover` : '#ffeaa7',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  position: 'relative'
                }}>
                  {!s.imageUrl && <span style={{ fontSize: '50px' }}>🍭</span>}
                </div>

                {/* Content Area */}
                <div style={{ padding: '16px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                  
                  <div style={{ marginBottom: '5px' }}>
                    <span style={{ 
                      fontSize: '11px', fontWeight: '700', color: '#a4b0be', 
                      textTransform: 'uppercase', letterSpacing: '0.5px' 
                    }}>
                      {s.category}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '16px', fontWeight: '700', color: theme.secondary, margin: '0 0 12px 0', lineHeight: '1.4' }}>
                    {s.name}
                  </h3>

                  {/* Price Row */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto', marginBottom: '15px' }}>
                    <span style={{ fontSize: '18px', fontWeight: '800', color: theme.primary }}>
                      ₹{s.price}
                    </span>
                    
                    <span style={{ 
                      fontSize: '11px', fontWeight: '700', padding: '4px 8px', borderRadius: '6px',
                      background: hasStock ? '#e0fbf0' : '#ffe0e6', 
                      color: hasStock ? '#26af7a' : '#ff4757'
                    }}>
                      {hasStock ? 'In Stock' : 'Out'}
                    </span>
                  </div>

                  {/* Action Button */}
                  <button
                    disabled={inCart || !hasStock}
                    onClick={() => handleAddToCart(s)}
                    style={{
                      width: '100%',
                      padding: '10px',
                      borderRadius: '10px',
                      background: inCart ? '#2f3542' : !hasStock ? '#dfe6e9' : 'white',
                      color: inCart ? 'white' : !hasStock ? '#b2bec3' : theme.primary,
                      border: (inCart || !hasStock) ? 'none' : `2px solid ${theme.primary}`,
                      fontWeight: '700',
                      fontSize: '13px',
                      cursor: (inCart || !hasStock) ? 'default' : 'pointer',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={e => {
                      if (!inCart && hasStock) {
                        e.target.style.background = theme.primary
                        e.target.style.color = 'white'
                      }
                    }}
                    onMouseLeave={e => {
                      if (!inCart && hasStock) {
                        e.target.style.background = 'white'
                        e.target.style.color = theme.primary
                      }
                    }}
                  >
                    {inCart ? 'Added to Cart' : !hasStock ? 'Sold Out' : 'Add to Cart'}
                  </button>

                </div>
              </div>
            )
          })}
        </div>
      </main>
    </div>
  )
}