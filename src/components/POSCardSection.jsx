import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPen } from '@fortawesome/free-solid-svg-icons'
import '../styles/POSCardSection.css'

function POSCardSection({
  cartItems,
  onRemoveItem,
  onUpdateQuantity,
  onEditItem,
  onAdvancePayment,
  onFinalPayment
}) {
  const subtotal = cartItems.reduce((sum, item) => sum + (item.pricePerUnit || 0) * (item.quantity || 1), 0)
  const total = subtotal

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
                  <td className="pos-cart-name" title={item.name}>{(item.name || '').slice(0, 5)}</td>
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
                    {((item.pricePerUnit || 0) * (item.quantity || 1)).toFixed(2)}
                  </td>
                  <td>
                    {onEditItem && (
                      <button
                        type="button"
                        className="pos-cart-edit"
                        onClick={() => onEditItem(idx)}
                        title="Edit quantity or item"
                      >
                        <FontAwesomeIcon icon={faPen} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <div className="pos-card-footer">
        <div className="pos-card-totals">
          <div className="pos-total-row pos-total-final">
            <span>Total</span>
            <span>{total.toFixed(2)}</span>
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
