import { useEffect, useState } from 'react'
import jsPDF from 'jspdf'

export default function Inventory() {
  const [sweets, setSweets] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    fetchInventory()
  }, [])

  const fetchInventory = async () => {
    try {
      const res = await fetch('https://sweet-shop-management-w0qq.onrender.com/api/sweets', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      })

      const data = await res.json()
      if (!res.ok) {
        setError(data.message)
        return
      }

      setSweets(data.data.sweets)
    } catch {
      setError('Server not reachable')
    }
  }

  /* ---------- STOCK STATUS ---------- */

  const getStatus = (qty) => {
    if (qty === 0) return { text: 'Out of Stock', color: 'red' }
    if (qty <= 5) return { text: 'Low Stock', color: 'orange' }
    return { text: 'In Stock', color: 'green' }
  }

  /* ---------- PDF DOWNLOAD ---------- */

  const downloadPDF = () => {
    const pdf = new jsPDF()

    pdf.setFontSize(18)
    pdf.text('SweetHome - Inventory Report', 105, 15, { align: 'center' })

    pdf.setFontSize(11)
    pdf.text(`Date: ${new Date().toDateString()}`, 10, 28)

    let y = 40

    pdf.setFontSize(12)
    pdf.text('Name', 10, y)
    pdf.text('Category', 60, y)
    pdf.text('Price', 105, y)
    pdf.text('Stock', 135, y)
    pdf.text('Status', 165, y)

    y += 8
    pdf.line(10, y, 200, y)
    y += 6

    sweets.forEach(s => {
      const status = getStatus(s.quantity).text

      pdf.text(s.name, 10, y)
      pdf.text(s.category, 60, y)
      pdf.text(`₹${s.price}`, 105, y)
      pdf.text(`${s.quantity}`, 135, y)
      pdf.text(status, 165, y)

      y += 8

      if (y > 280) {
        pdf.addPage()
        y = 20
      }
    })

    pdf.save('SweetHome_Inventory.pdf')
  }

  /* ---------- UI ---------- */

  return (
    <div>
      <h1>SweetHome</h1>
      <h2>Inventory (Admin)</h2>

      <button onClick={downloadPDF} style={{ marginBottom: 15 }}>
        📄 Download Inventory PDF
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      <table
        style={{
          width: '100%',
          borderCollapse: 'collapse',
          marginTop: '10px'
        }}
      >
        <thead>
          <tr style={{ background: '#f5f5f5' }}>
            <th style={th}>Name</th>
            <th style={th}>Category</th>
            <th style={th}>Price (₹)</th>
            <th style={th}>Stock</th>
            <th style={th}>Status</th>
          </tr>
        </thead>

        <tbody>
          {sweets.map(s => {
            const status = getStatus(s.quantity)

            return (
              <tr key={s._id}>
                <td style={td}>{s.name}</td>
                <td style={td}>{s.category}</td>
                <td style={td}>₹{s.price}</td>
                <td style={td}>{s.quantity}</td>
                <td style={{ ...td, color: status.color, fontWeight: 'bold' }}>
                  {status.text}
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

/* ---------- TABLE STYLES ---------- */

const th = {
  border: '1px solid #ccc',
  padding: '10px',
  textAlign: 'left'
}

const td = {
  border: '1px solid #ccc',
  padding: '10px'
}
