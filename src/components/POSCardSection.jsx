import '../styles/POSCardSection.css'

function POSCardSection({
  cartItems,
  onRemoveItem,
  onUpdateQuantity,
  onAdvancePayment,
  onFinalPayment
}) {
  const subtotal = cartItems.reduce((sum, item) => sum + (item.pricePerUnit || 0) * (item.quantity || 1), 0)
  const taxAmount = cartItems.reduce((sum, item) => {
    const taxPct = (item.taxDto?.taxPercentage || 0) / 100
    return sum + (item.pricePerUnit || 0) * (item.quantity || 1) * taxPct
  }, 0)
  const total = subtotal + taxAmount

  const canAdvance = cartItems.length > 0
  const canFinal = cartItems.length > 0

  return (
    <div className="pos-card-section">
      <div className="pos-card-header">
        <h3>Cart</h3>
      </div>
      <div className="pos-card-items">
        {cartItems.length === 0 ? (
          <div className="pos-card-empty">No items in cart</div>
        ) : (
          <table className="pos-cart-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Qty</th>
                <th>Price</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item, idx) => (
                <tr key={`${item.id}-${idx}`}>
                  <td className="pos-cart-name">{item.name}</td>
                  <td className="pos-cart-qty">
                    {onUpdateQuantity ? (
                      <input
                        type="number"
                        min="1"
                        value={item.quantity || 1}
                        onChange={(e) => onUpdateQuantity(idx, parseInt(e.target.value, 10) || 1)}
                        className="pos-qty-input"
                      />
                    ) : (
                      item.quantity || 1
                    )}
                  </td>
                  <td className="pos-cart-price">
                    ₹{((item.pricePerUnit || 0) * (item.quantity || 1)).toFixed(2)}
                  </td>
                  <td>
                    <button
                      type="button"
                      className="pos-cart-remove"
                      onClick={() => onRemoveItem(idx)}
                      title="Remove"
                    >
                      ×
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <div className="pos-card-footer">
        <div className="pos-card-totals">
          <div className="pos-total-row">
            <span>Subtotal</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>
          <div className="pos-total-row">
            <span>Tax</span>
            <span>₹{taxAmount.toFixed(2)}</span>
          </div>
          <div className="pos-total-row pos-total-final">
            <span>Total</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
        </div>
        <button
          type="button"
          className="pos-payment-btn pos-advance-btn"
          disabled={!canAdvance}
          onClick={onAdvancePayment}
        >
          Advance Payment
        </button>
        <button
          type="button"
          className="pos-payment-btn pos-final-btn"
          disabled={!canFinal}
          onClick={onFinalPayment}
        >
          Final Payment
        </button>
      </div>
    </div>
  )
}

export default POSCardSection
