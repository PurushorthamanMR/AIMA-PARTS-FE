import '../styles/POSCustomerSelect.css'

function POSCustomerSelect({ customers, selectedCustomer, onSelect, loading }) {
  return (
    <div className="pos-customer-select">
      <label htmlFor="pos-customer" className="pos-customer-label">Customer</label>
      <select
        id="pos-customer"
        className="pos-customer-dropdown"
        value={selectedCustomer?.id || ''}
        onChange={(e) => {
          const id = e.target.value ? parseInt(e.target.value, 10) : null
          const cust = customers.find((c) => c.id === id)
          onSelect(cust || null)
        }}
        disabled={loading}
      >
        <option value="">Select customer</option>
        {customers.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name || c.firstName || `Customer ${c.id}`} {c.mobileNumber ? `- ${c.mobileNumber}` : ''}
          </option>
        ))}
      </select>
    </div>
  )
}

export default POSCustomerSelect
