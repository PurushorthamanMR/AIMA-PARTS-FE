import '../styles/POSPaymentSelect.css'

function POSPaymentSelect({ paymentMethods, selectedPayment, onSelect }) {
  return (
    <div className="pos-payment-select">
      <label htmlFor="pos-payment" className="pos-payment-label">
        Payment Method (for Final Payment)
      </label>
      <select
        id="pos-payment"
        className="pos-payment-dropdown"
        value={selectedPayment?.id || ''}
        onChange={(e) => {
          const id = e.target.value ? parseInt(e.target.value, 10) : null
          const pm = paymentMethods.find((p) => p.id === id)
          onSelect(pm || null)
        }}
      >
        <option value="">Select payment method</option>
        {paymentMethods.map((pm) => (
          <option key={pm.id} value={pm.id}>
            {pm.type}
          </option>
        ))}
      </select>
    </div>
  )
}

export default POSPaymentSelect
