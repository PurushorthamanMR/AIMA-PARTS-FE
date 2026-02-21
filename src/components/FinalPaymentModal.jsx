import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faSearch } from '@fortawesome/free-solid-svg-icons'
import { searchCustomers, saveCustomer, getCustomers } from '../api/posApi'
import '../styles/FinalPaymentModal.css'

function FinalPaymentModal({
  isOpen,
  onClose,
  paymentMethods,
  cartItems,
  onFinish,
  buildTransactionPayload
}) {
  const [step, setStep] = useState(1)
  const [paymentMethod, setPaymentMethod] = useState(null)
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
    if (step === 1 && paymentMethod) {
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

    const payload = buildTransactionPayload(customer, paymentMethod, null)
    onFinish(payload, customer)
    onClose()
  }

  const canNext = step === 1 && paymentMethod
  const canFinish =
    step === 2 &&
    ((customerType === 'existing' && selectedCustomer) ||
      (customerType === 'new' && newCustomer.name?.trim() && newCustomer.mobileNumber?.trim()))

  if (!isOpen) return null

  return (
    <div className="final-modal-overlay" onClick={onClose}>
      <div className="final-modal" onClick={(e) => e.stopPropagation()}>
        <div className="final-modal-header">
          <h2 className="final-modal-title">Final Payment Details</h2>
          <button type="button" className="final-modal-close" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        {step === 1 && (
          <div className="final-modal-body">
            <div className="final-field">
              <label className="final-label">* Payment Method</label>
              <select
                className="final-select"
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
            <button
              type="button"
              className="final-next-btn"
              disabled={!canNext}
              onClick={handleNext}
            >
              Next
            </button>
          </div>
        )}

        {step === 2 && (
          <div className="final-modal-body">
            <div className="final-customer-tabs">
              <button
                type="button"
                className={`final-tab ${customerType === 'existing' ? 'active' : ''}`}
                onClick={() => setCustomerType('existing')}
              >
                Existing Customer
              </button>
              <button
                type="button"
                className={`final-tab ${customerType === 'new' ? 'active' : ''}`}
                onClick={() => setCustomerType('new')}
              >
                New Customer
              </button>
            </div>

            {customerType === 'existing' && (
              <>
                <h4 className="final-subtitle">Select Existing Customer</h4>
                <div className="final-search-wrap">
                  <input
                    type="text"
                    className="final-search-input"
                    placeholder="Search by name, vehicle or mobile nu..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <FontAwesomeIcon icon={faSearch} className="final-search-icon" />
                </div>
                <div className="final-table-wrap">
                  <table className="final-table">
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
                          <td colSpan="4" className="final-loading">
                            Loading...
                          </td>
                        </tr>
                      ) : customers.length === 0 ? (
                        <tr>
                          <td colSpan="4" className="final-empty">
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
                                  name="final-customer"
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
                  <div className="final-pagination">
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
                <div className="final-field">
                  <label className="final-label">* Customer Name</label>
                  <input
                    type="text"
                    className="final-input"
                    placeholder="Enter customer name"
                    value={newCustomer.name}
                    onChange={(e) => setNewCustomer((p) => ({ ...p, name: e.target.value }))}
                  />
                </div>
                <div className="final-field">
                  <label className="final-label">* Vehicle Number</label>
                  <input
                    type="text"
                    className="final-input"
                    placeholder="Enter vehicle number"
                    value={newCustomer.vehicleNumber}
                    onChange={(e) => setNewCustomer((p) => ({ ...p, vehicleNumber: e.target.value }))}
                  />
                </div>
                <div className="final-field">
                  <label className="final-label">* Mobile Number</label>
                  <input
                    type="text"
                    className="final-input"
                    placeholder="Enter mobile number"
                    value={newCustomer.mobileNumber}
                    onChange={(e) => setNewCustomer((p) => ({ ...p, mobileNumber: e.target.value }))}
                  />
                </div>
              </>
            )}

            <div className="final-modal-actions">
              <button type="button" className="final-cancel-btn" onClick={onClose}>
                Cancel
              </button>
              <button
                type="button"
                className="final-finish-btn"
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

export default FinalPaymentModal
