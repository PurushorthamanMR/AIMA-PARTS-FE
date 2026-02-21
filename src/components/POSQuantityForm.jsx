import { useState, useRef, useEffect } from 'react'
import '../styles/POSQuantityForm.css'

function POSQuantityForm({ item, onAdd, onCancel }) {
  const [quantity, setQuantity] = useState('1')
  const inputRef = useRef(null)

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSubmit = (e) => {
    e.preventDefault()
    const qty = parseInt(quantity, 10)
    if (qty > 0) {
      onAdd({ ...item, quantity: qty })
      onCancel()
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      onCancel()
    }
  }

  return (
    <div className="pos-qty-form-overlay" onClick={onCancel}>
      <div className="pos-qty-form" onClick={(e) => e.stopPropagation()}>
        <div className="pos-qty-form-header">
          <span className="pos-qty-form-title">Enter Quantity</span>
          <button type="button" className="pos-qty-form-close" onClick={onCancel}>
            ×
          </button>
        </div>
        <p className="pos-qty-form-item">{item?.name}</p>
        <form onSubmit={handleSubmit}>
          <input
            ref={inputRef}
            type="number"
            min="1"
            className="pos-qty-form-input"
            placeholder="Enter quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <p className="pos-qty-form-hint">Press Enter to add</p>
          <button type="submit" className="pos-qty-form-btn">
            Add to Cart
          </button>
        </form>
      </div>
    </div>
  )
}

export default POSQuantityForm
