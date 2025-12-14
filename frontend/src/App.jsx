// App.jsx
import { useContext, useState, useEffect } from 'react'
import { AuthProvider, AuthContext } from './AuthContext'

import Login from './components/Login'
import Register from './components/Register'
import Navbar from './components/Navbar'
import SweetList from './components/SweetList'
import AddSweet from './components/AddSweet'
import Cart from './components/Cart'
import Checkout from './components/Checkout'
import OrderHistory from './components/OrderHistory'
import Inventory from './components/Inventory'
import AdminOrders from './components/AdminOrders'
import AdminDashboard from './components/AdminDashboard'
import Home from './components/Home'
import Profile from './components/Profile'
import Footer from './components/Footer'

const AppContent = () => {
  const { user } = useContext(AuthContext)

  // 🌍 Current page
  const [page, setPage] = useState('home')

  // 🛒 Global cart
  const [cart, setCart] = useState([])

  /* 🔁 LOGIN / LOGOUT REDIRECTION */
  useEffect(() => {
    // ✅ After LOGIN → go home
    if (user && (page === 'login' || page === 'register')) {
      setPage('home')
    }

    // ✅ After LOGOUT → go home
    if (!user) {
      setPage('home')
    }
  }, [user])

  /* 🛒 Add to cart (guest-safe) */
  const addToCart = (sweet) => {
    if (!user) {
      setPage('login') // 🔐 force login
      return
    }

    if (cart.find(i => i._id === sweet._id)) return
    setCart(prev => [...prev, { ...sweet, cartQty: 1 }])
  }

  const clearCart = () => setCart([])

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)'
      }}
    >
      {/* 🔝 NAVBAR (ALWAYS VISIBLE) */}
      <Navbar
        setPage={setPage}
        cartCount={cart.length}
        activePage={page}
      />

      {/* 📄 MAIN CONTENT */}
      <main
        style={{
          flex: 1,
          maxWidth: '1200px',
          margin: '0 auto',
          width: '100%',
          padding: '24px'
        }}
      >
        {/* 🌐 PUBLIC */}
        {page === 'home' && <Home setPage={setPage} />}
        {page === 'sweets' && (
          <SweetList
            user={user}
            cart={cart}
            addToCart={addToCart}
            setPage={setPage}
          />
        )}

        {/* 🔐 AUTH */}
        {page === 'login' && <Login switchPage={setPage} />}
        {page === 'register' && <Register switchPage={setPage} />}

        {/* 👤 USER */}
        {page === 'cart' && user?.role === 'user' && (
          <Cart
            cart={cart}
            setCart={setCart}
            goCheckout={() => setPage('checkout')}
          />
        )}

        {page === 'checkout' && user?.role === 'user' && (
          <Checkout
            cart={cart}
            clearCart={clearCart}
            goOrders={() => setPage('orders')}
          />
        )}

        {page === 'orders' && user && <OrderHistory />}
        {page === 'profile' && user && <Profile />}

        {/* 👑 ADMIN */}
        {page === 'add' && user?.role === 'admin' && <AddSweet />}
        {page === 'inventory' && user?.role === 'admin' && <Inventory />}
        {page === 'admin-orders' && user?.role === 'admin' && <AdminOrders />}
        {page === 'dashboard' && user?.role === 'admin' && <AdminDashboard />}
      </main>

      {/* 🔻 FOOTER */}
      <Footer setPage={setPage} />
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
