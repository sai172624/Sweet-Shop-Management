import { useContext, useState } from 'react'
import { AuthContext } from '../AuthContext'

export default function Home({ setPage }) {
  const { user } = useContext(AuthContext)
  
  // --- STATE FOR HOVER EFFECTS ---
  const [hoveredFeature, setHoveredFeature] = useState(null)
  const [hoveredReview, setHoveredReview] = useState(null)

  // --- THEME & STYLES ---
  const theme = {
    // Gradient ends in pure #ffffff to blend with footer wave
    bgGradient: 'linear-gradient(180deg, #fff0f3 0%, #ffffff 100%)', 
    primary: '#ff4757',   // Berry Red
    secondary: '#2f3542', // Dark Slate
    accent: '#ffa502',    // Gold
    glassBorder: '1px solid rgba(255, 255, 255, 0.5)',
    shadow: '0 8px 32px rgba(255, 71, 87, 0.1)'
  }

  const sectionStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
    marginBottom: '100px' // Increased spacing for better visual flow
  }

  // --- HERO SECTION ---
  const Hero = () => (
    <div style={{ ...sectionStyle, marginTop: '20px', display: 'flex', alignItems: 'center', gap: '60px', flexWrap: 'wrap-reverse' }}>
      {/* Left Text */}
      <div style={{ flex: 1, minWidth: '300px' }}>
        <div style={{ 
          display: 'inline-block', padding: '10px 20px', borderRadius: '50px', 
          background: '#ffeaa7', color: '#d35400', fontWeight: '800', 
          fontSize: '12px', letterSpacing: '1px', marginBottom: '24px',
          textTransform: 'uppercase'
        }}>
          🚀 #1 Sweet Shop in Town
        </div>
        
        <h1 style={{ fontSize: '56px', fontWeight: '900', lineHeight: '1.1', color: theme.secondary, marginBottom: '24px', fontFamily: 'sans-serif' }}>
          Taste the <span style={{ color: theme.primary, textDecoration: 'underline', textDecorationColor: '#ffeaa7' }}>Magic</span><br /> in Every Bite.
        </h1>
        
        <p style={{ fontSize: '18px', color: '#747d8c', lineHeight: '1.8', marginBottom: '40px', maxWidth: '500px' }}>
          Handcrafted sweets made with organic ingredients and traditional love.
          Experience the melting delicacy today.
        </p>

        <div style={{ display: 'flex', gap: '16px' }}>
          <button 
            onClick={() => setPage('sweets')}
            style={{
              padding: '16px 40px', borderRadius: '50px', border: 'none',
              background: theme.primary, color: 'white', fontSize: '16px', fontWeight: '700',
              boxShadow: '0 10px 25px rgba(255, 71, 87, 0.4)', cursor: 'pointer', transition: 'transform 0.2s'
            }}
            onMouseEnter={e => e.target.style.transform = 'translateY(-3px)'}
            onMouseLeave={e => e.target.style.transform = 'translateY(0)'}
          >
            Explore Sweets 🍬
          </button>
        </div>
      </div>

      {/* Right Image/Card */}
      <div style={{ flex: 1, height: '450px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
        {/* Decorative Circle */}
         <div style={{ position: 'absolute', width: '400px', height: '400px', background: '#fff0f3', borderRadius: '50%', zIndex: 0 }}></div>
         
         <div style={{ 
           position: 'relative', zIndex: 1, width: '300px', padding: '40px', 
           background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(20px)', 
           borderRadius: '40px', border: '1px solid white',
           boxShadow: '0 20px 60px rgba(0,0,0,0.08)', textAlign: 'center',
           transform: 'rotate(-5deg)'
         }}>
          <div style={{ fontSize: '100px', filter: 'drop-shadow(0 10px 20px rgba(0,0,0,0.1))' }}>🍩</div>
          <h2 style={{ margin: '20px 0 5px 0', color: theme.secondary, fontWeight: '800' }}>Glazed Delight</h2>
          <p style={{ color: '#a4b0be', fontSize: '14px', margin: 0 }}>Customer Favorite</p>
          <div style={{ marginTop: '15px', color: theme.accent, fontSize: '20px', letterSpacing: '5px' }}>★★★★★</div>
        </div>
      </div>
    </div>
  )

  // --- STATS SECTION ---
  const Stats = () => (
    <div style={{ maxWidth: '1000px', margin: '-40px auto 100px auto', position: 'relative', zIndex: 2 }}>
      <div style={{ 
        background: 'white', padding: '40px', borderRadius: '20px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.05)', display: 'flex', 
        justifyContent: 'space-around', flexWrap: 'wrap', gap: '30px' 
      }}>
        {[ { label: 'Happy Customers', val: '15k+' }, { label: 'Sweets Sold', val: '85k+' }, { label: 'Years', val: '25+' }, { label: 'Varieties', val: '100+' } ].map((stat, i) => (
          <div key={i} style={{ textAlign: 'center' }}>
            <h3 style={{ fontSize: '32px', color: theme.primary, margin: 0, fontWeight: '800' }}>{stat.val}</h3>
            <p style={{ color: '#a4b0be', margin: '5px 0 0 0', fontWeight: '600', fontSize: '14px', textTransform: 'uppercase' }}>{stat.label}</p>
          </div>
        ))}
      </div>
    </div>
  )

  // --- FEATURES SECTION ---
  const Features = () => (
    <div style={sectionStyle}>
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h2 style={{ fontSize: '36px', color: theme.secondary, fontWeight: '800', marginBottom: '10px' }}>Why SweetHome?</h2>
        <div style={{ width: '60px', height: '4px', background: theme.primary, margin: '0 auto', borderRadius: '2px' }}></div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '30px' }}>
        {[ { icon: '🚚', title: 'Express Delivery', text: 'Doorstep delivery within 30 mins.' }, { icon: '🍯', title: 'Pure Ingredients', text: '100% organic ghee and milk.' }, { icon: '🎁', title: 'Gift Hampers', text: 'Custom packs for weddings.' } ].map((item, i) => (
          <div key={i} onMouseEnter={() => setHoveredFeature(i)} onMouseLeave={() => setHoveredFeature(null)} style={{ 
            background: 'white', borderRadius: '24px', padding: '40px 30px', 
            border: '1px solid #f1f2f6', 
            boxShadow: hoveredFeature === i ? '0 20px 40px rgba(0,0,0,0.08)' : '0 4px 10px rgba(0,0,0,0.02)', 
            transform: hoveredFeature === i ? 'translateY(-10px)' : 'translateY(0)', 
            transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)' 
          }}>
            <div style={{ fontSize: '42px', marginBottom: '24px' }}>{item.icon}</div>
            <h3 style={{ fontSize: '20px', color: theme.secondary, marginBottom: '12px', fontWeight: '700' }}>{item.title}</h3>
            <p style={{ color: '#747d8c', lineHeight: '1.6', fontSize: '15px' }}>{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  )

  // --- REVIEWS SECTION ---
  const Reviews = () => (
    <div style={{ ...sectionStyle, marginBottom: '0px', paddingBottom: '100px' }}> 
      {/* Added paddingBottom 100px so content doesn't hit the footer wave immediately */}
      <div style={{ textAlign: 'center', marginBottom: '60px' }}>
        <h2 style={{ fontSize: '36px', color: theme.secondary, fontWeight: '800', marginBottom: '10px' }}>Customer Love 💖</h2>
        <div style={{ width: '60px', height: '4px', background: theme.primary, margin: '0 auto', borderRadius: '2px' }}></div>
      </div>
      <div style={{ display: 'flex', gap: '24px', overflowX: 'auto', paddingBottom: '40px', scrollbarWidth: 'none' }}>
        {[ { name: 'Aditi S.', txt: 'The Gulab Jamuns are out of this world! So soft.', rating: 5 }, { name: 'Rahul V.', txt: 'Best packaging I have ever seen for sweets.', rating: 5 }, { name: 'Sarah K.', txt: 'Reminds me of my grandmothers cooking.', rating: 4 } ].map((rev, i) => (
          <div key={i} onMouseEnter={() => setHoveredReview(i)} onMouseLeave={() => setHoveredReview(null)} style={{ 
            minWidth: '320px', flex: 1, 
            background: hoveredReview === i ? '#fff0f3' : 'white', 
            borderRadius: '24px', padding: '30px', 
            border: '1px solid #f1f2f6',
            boxShadow: '0 10px 30px rgba(0,0,0,0.03)', 
            transition: 'all 0.3s ease' 
          }}>
            <div style={{ color: theme.accent, marginBottom: '16px', letterSpacing: '2px' }}>{'★'.repeat(rev.rating)}</div>
            <p style={{ fontSize: '16px', color: '#2f3542', fontStyle: 'italic', marginBottom: '24px', lineHeight: '1.6' }}>"{rev.txt}"</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#dfe6e9' }}></div>
              <span style={{ fontWeight: '700', color: theme.secondary, fontSize: '14px' }}>{rev.name}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div style={{ background: theme.bgGradient, minHeight: '100vh', paddingTop: '10px' }}>
      <Hero />
      <Stats />
      <Features />
      <Reviews />
    </div>
  )
}