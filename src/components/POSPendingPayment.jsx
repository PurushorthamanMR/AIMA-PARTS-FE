import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import { getTransactions } from '../api/posApi'
import '../styles/POSPendingPayment.css'

function POSPendingPayment({ onSelectPending, selectedPendingId }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [pendingList, setPendingList] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      try {
        const result = await getTransactions(1, 100)
        const list = result?.content || []
        const pending = list.filter((t) => (t.balanceAmount || 0) > 0)
        setPendingList(pending)
      } catch {
        setPendingList([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const filtered = pendingList.filter((t) => {
    if (!searchQuery.trim()) return true
    const q = searchQuery.toLowerCase()
    const txnNo = String(t.id).padStart(8, '0')
    const customer = t.customerDto?.name || ''
    const vehicle = t.customerDto?.vehicleNumber || ''
    const mobile = t.customerDto?.mobileNumber || ''
    return (
      txnNo.includes(q) ||
      customer.toLowerCase().includes(q) ||
      vehicle.toLowerCase().includes(q) ||
      mobile.includes(q)
    )
  })

  const formatTxnNo = (id) => String(id || 0).padStart(8, '0')
  const getAdvanceAmount = (t) => {
    const total = t.totalAmount || 0
    const balance = t.balanceAmount || 0
    return total - balance
  }
  const getCustomerDisplay = (t) => {
    const name = t.customerDto?.name || '—'
    const vehicle = t.customerDto?.vehicleNumber || ''
    return vehicle ? `${name} (${vehicle})` : name
  }

  return (
    <div className="pos-pending-payment">
      <h3 className="pos-pending-title">Pending Payments</h3>
      <div className="pos-pending-search-wrap">
        <input
          type="text"
          className="pos-pending-search-input"
          placeholder="Search by customer, vehicle, or transaction no."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <FontAwesomeIcon icon={faSearch} className="pos-pending-search-icon" />
      </div>
      <div className="pos-pending-table-wrap">
        <table className="pos-pending-table">
          <thead>
            <tr>
              <th>Txn No</th>
              <th>Customer</th>
              <th>Advance</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="3" className="pos-pending-loading">
                  Loading...
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan="3" className="pos-pending-empty">
                  No pending payments
                </td>
              </tr>
            ) : (
              filtered.map((t) => (
                <tr
                  key={t.id}
                  className={selectedPendingId === t.id ? 'selected' : ''}
                  onClick={() => onSelectPending?.(t)}
                >
                  <td>{formatTxnNo(t.id)}</td>
                  <td>{getCustomerDisplay(t)}</td>
                  <td>{getAdvanceAmount(t)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default POSPendingPayment
