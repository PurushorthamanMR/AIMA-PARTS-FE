import { useEffect, useRef } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPrint, faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import '../styles/BillPrint.css'

function BillPrint() {
  const navigate = useNavigate()
  const location = useLocation()
  const printRef = useRef(null)
  const transaction = location.state?.transaction || null
  const cartItems = location.state?.cartItems || []
  const customer = location.state?.customer || null
  const totalAmount = location.state?.totalAmount || 0
  const advanceAmount = location.state?.advanceAmount || totalAmount

  useEffect(() => {
    if (!transaction && !cartItems.length) {
      navigate('/pos', { replace: true })
    }
  }, [transaction, cartItems, navigate])

  const handlePrint = () => {
    window.print()
  }

  const handleBack = () => {
    navigate('/pos', { replace: true })
  }

  const subtotal = cartItems.reduce((sum, item) => sum + (item.pricePerUnit || 0) * (item.quantity || 1), 0)
  const taxAmount = cartItems.reduce((sum, item) => {
    const taxPct = (item.taxDto?.taxPercentage || 0) / 100
    return sum + (item.pricePerUnit || 0) * (item.quantity || 1) * taxPct
  }, 0)
  const total = subtotal + taxAmount

  if (!transaction && !cartItems.length) {
    return null
  }

  return (
    <div className="bill-print-page">
      <div className="bill-print-actions no-print">
        <button type="button" className="bill-back-btn" onClick={handleBack}>
          <FontAwesomeIcon icon={faArrowLeft} />
          Back to POS
        </button>
        <button type="button" className="bill-print-btn" onClick={handlePrint}>
          <FontAwesomeIcon icon={faPrint} />
          Print Bill
        </button>
      </div>

      <div ref={printRef} className="bill-content">
        <div className="bill-header">
          <h1>AIMAParts</h1>
          <p>Vehicle Parts Shop</p>
        </div>

        <div className="bill-info">
          <p>
            <strong>Date:</strong> {new Date().toLocaleString('en-IN')}
          </p>
          {customer && (
            <p>
              <strong>Customer:</strong> {customer.name}
              {customer.mobileNumber && ` | ${customer.mobileNumber}`}
            </p>
          )}
        </div>

        <table className="bill-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Item</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item, idx) => (
              <tr key={idx}>
                <td>{idx + 1}</td>
                <td>{item.name}</td>
                <td>{item.quantity || 1}</td>
                <td>₹{(item.pricePerUnit || 0).toFixed(2)}</td>
                <td>₹{((item.pricePerUnit || 0) * (item.quantity || 1)).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="bill-totals">
          <div className="bill-total-row">
            <span>Subtotal</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="bill-total-row">
            <span>Tax</span>
            <span>₹{taxAmount.toFixed(2)}</span>
          </div>
          <div className="bill-total-row bill-total-final">
            <span>Total</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
          {advanceAmount < total && (
            <div className="bill-total-row">
              <span>Advance Paid</span>
              <span>₹{advanceAmount.toFixed(2)}</span>
            </div>
          )}
        </div>

        <div className="bill-footer">
          <p>Thank you for your purchase!</p>
        </div>
      </div>
    </div>
  )
}

export default BillPrint
