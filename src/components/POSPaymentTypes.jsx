import '../styles/POSPaymentTypes.css'

function POSPaymentTypes({ paymentMethods, onPaymentSelect, selectedPaymentId }) {
  return (
    <div className="pos-payment-types">
      <h3 className="pos-payment-title">Payment Types</h3>
      <div className="pos-payment-grid">
        {paymentMethods.map((pm) => (
          <button
            key={pm.id}
            type="button"
            className={`pos-payment-btn ${selectedPaymentId === pm.id ? 'selected' : ''}`}
            onClick={() => onPaymentSelect(pm)}
          >
            {pm.type}
          </button>
        ))}
      </div>
    </div>
  )
}

export default POSPaymentTypes
