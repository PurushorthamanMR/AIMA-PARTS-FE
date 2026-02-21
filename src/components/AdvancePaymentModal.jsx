import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faSearch } from '@fortawesome/free-solid-svg-icons'
import { searchCustomers, saveCustomer, getCustomers } from '../api/posApi'
import '../styles/AdvancePaymentModal.css'

function AdvancePaymentModal({
  isOpen,
  onClose,
  paymentMethods,
  cartItems,
  totalAmount,
  onFinish,
  buildTransactionPayload
}) {
  const [step, setStep] = useState(1)
  const [paymentMethod, setPaymentMethod] = useState(null)
  const [advanceAmount, setAdvanceAmount] = useState('')
  const [customerType, setCustomerType] = useState('existing')
  const [searchQuery, setSearchQuery] = useState('')
  const [customers, setCustomers] = useState([])
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [newCustomer, setNewCustomer] = useState({ name: '', vehicleNumber: '', mobileNumber: '' })
  const [loading, setLoading] = useState(false)
  const PAGE_SIZE = 5
  const [page, setPage] = useState(1)

  useEffect(() => {
    if (!isOpen) {
      setStep(1)
      setPaymentMethod(null)
      setAdvanceAmount('')
      setCustomerType('existing')
      setSearchQuery('')
      setSelectedCustomer(null)
      setNewCustomer({ name: '', vehicleNumber: '', mobileNumber: '' })
    }
  }, [isOpen])

  useEffect(() => {
    setPage(1)
  }, [searchQuery])

  useEffect(() => {
    if (step === 2 && customerType === 'existing') {
      const load = async () => {
        setLoading(true)
        try {
          const list = searchQuery.trim()
            ? await searchCustomers(searchQuery)
            : await getCustomers()
          setCustomers(Array.isArray(list) ? list : [])
        } catch {
          setCustomers([])
        } finally {
          setLoading(false)
        }
      }
      const timer = setTimeout(load, 300)
      return () => clearTimeout(timer)
    }
  }, [step, customerType, searchQuery])

  const handleNext = () => {
    if (step === 1 && paymentMethod && advanceAmount && parseFloat(advanceAmount) > 0) {
      setStep(2)
    }
  }

  const handleFinish = async () => {
    let customer = selectedCustomer
    if (customerType === 'new') {
      if (!newCustomer.name?.trim() || !newCustomer.mobileNumber?.trim()) {
        alert('Please enter customer name and mobile number')
        return
      }
      setLoading(true)
      try {
        customer = await saveCustomer({
          name: newCustomer.name.trim(),
          mobileNumber: newCustomer.mobileNumber.trim()
        })
      } catch (err) {
        alert(err.message || 'Failed to save customer')
        setLoading(false)
        return
      }
      setLoading(false)
    } else if (!selectedCustomer) {
      alert('Please select a customer')
      return
    }

    const payload = buildTransactionPayload(customer, paymentMethod, parseFloat(advanceAmount))
    onFinish(payload, customer)
    onClose()
  }

  const canNext = step === 1 && paymentMethod && advanceAmount && parseFloat(advanceAmount) > 0
  const canFinish =
    step === 2 &&
    ((customerType === 'existing' && selectedCustomer) ||
      (customerType === 'new' && newCustomer.name?.trim() && newCustomer.mobileNumber?.trim()))

  if (!isOpen) return null

  return (
    <div className="advance-modal-overlay" onClick={onClose}>
      <div className="advance-modal" onClick={(e) => e.stopPropagation()}>
        <div className="advance-modal-header">
          <h2 className="advance-modal-title">Advance Payment Details</h2>
          <button type="button" className="advance-modal-close" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {step === 1 && (
          <div className="advance-modal-body">
            <div className="advance-field">
              <label className="advance-label">* Payment Method</label>
              <select
                className="advance-select"
                value={paymentMethod?.id || ''}
                onChange={(e) => {
                  const id = e.target.value ? parseInt(e.target.value, 10) : null
                  setPaymentMethod(paymentMethods.find((p) => p.id === id) || null)
                }}
              >
                <option value="">Select Payment Method</option>
                {paymentMethods.map((pm) => (
                  <option key={pm.id} value={pm.id}>
                    {pm.type}
                  </option>
                ))}
              </select>
            </div>
            <div className="advance-field">
              <label className="advance-label">* Advance Payment Amount</label>
              <input
                type="number"
                className="advance-input"
                placeholder="Enter advance amount"
                value={advanceAmount}
                onChange={(e) => setAdvanceAmount(e.target.value)}
                min="0"
                step="0.01"
              />
            </div>
            <button
              type="button"
              className="advance-next-btn"
              disabled={!canNext}
              onClick={handleNext}
            >
              Next
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="advance-modal-body">
            <div className="advance-customer-tabs">
              <button
                type="button"
                className={`advance-tab ${customerType === 'existing' ? 'active' : ''}`}
                onClick={() => setCustomerType('existing')}
              >
                Existing Customer
              </button>
              <button
                type="button"
                className={`advance-tab ${customerType === 'new' ? 'active' : ''}`}
                onClick={() => setCustomerType('new')}
              >
                New Customer
              </button>
            </div>

            {customerType === 'existing' && (
              <>
                <h4 className="advance-subtitle">Select Existing Customer</h4>
                <div className="advance-search-wrap">
                  <input
                    type="text"
                    className="advance-search-input"
                    placeholder="Search by name, vehicle or mobile nu..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <FontAwesomeIcon icon={faSearch} className="advance-search-icon" />
                </div>
                <div className="advance-table-wrap">
                  <table className="advance-table">
                    <thead>
                      <tr>
                        <th>Name</th>
                        <th>Vehicle Number</th>
                        <th>Mobile Number</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan="4" className="advance-loading">
                            Loading...
                          </td>
                        </tr>
                      ) : customers.length === 0 ? (
                        <tr>
                          <td colSpan="4" className="advance-empty">
                            No customers found
                          </td>
                        </tr>
                      ) : (
                        customers
                          .slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
                          .map((c) => (
                          <tr key={c.id}>
                            <td>{c.name}</td>
                            <td>{c.vehicleNumber || '—'}</td>
                            <td>{c.mobileNumber}</td>
                            <td>
                              <input
                                type="radio"
                                name="customer"
                                checked={selectedCustomer?.id === c.id}
                                onChange={() => setSelectedCustomer(c)}
                              />
                            </td>
                          </tr>
                          ))
                      )}
                    </tbody>
                  </table>
                </div>
                {customers.length > PAGE_SIZE && (
                  <div className="advance-pagination">
                    <button
                      type="button"
                      disabled={page <= 1}
                      onClick={() => setPage((p) => p - 1)}
                    >
                      &lt;
                    </button>
                    <span>
                      {page} / {Math.ceil(customers.length / PAGE_SIZE)}
                    </span>
                    <button
                      type="button"
                      disabled={page >= Math.ceil(customers.length / PAGE_SIZE)}
                      onClick={() => setPage((p) => p + 1)}
                    >
                      &gt;
                    </button>
                  </div>
                )}
              </>
            )}

            {customerType === 'new' && (
              <>
                <div className="advance-field">
                  <label className="advance-label">* Customer Name</label>
                  <input
                    type="text"
                    className="advance-input"
                    placeholder="Enter customer name"
                    value={newCustomer.name}
                    onChange={(e) => setNewCustomer((p) => ({ ...p, name: e.target.value }))}
                  />
                </div>
                <div className="advance-field">
                  <label className="advance-label">* Vehicle Number</label>
                  <input
                    type="text"
                    className="advance-input"
                    placeholder="Enter vehicle number"
                    value={newCustomer.vehicleNumber}
                    onChange={(e) => setNewCustomer((p) => ({ ...p, vehicleNumber: e.target.value }))}
                  />
                </div>
                <div className="advance-field">
                  <label className="advance-label">* Mobile Number</label>
                  <input
                    type="text"
                    className="advance-input"
                    placeholder="Enter mobile number"
                    value={newCustomer.mobileNumber}
                    onChange={(e) => setNewCustomer((p) => ({ ...p, mobileNumber: e.target.value }))}
                  />
                </div>
              </>
            )}

            <div className="advance-modal-actions">
              <button type="button" className="advance-cancel-btn" onClick={onClose}>
                Cancel
              </button>
              <button
                type="button"
                className="advance-finish-btn"
                disabled={!canFinish || loading}
                onClick={handleFinish}
              >
                Finish
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdvancePaymentModal
