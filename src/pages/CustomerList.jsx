import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { 
  faFilePdf, 
  faFileExcel, 
  faSyncAlt, 
  faArrowUp,
  faPlus,
  faSearch,
  faSortUp,
  faSortDown,
  faToggleOn,
  faToggleOff
} from '@fortawesome/free-solid-svg-icons'
import { getAllPage, updateStatus } from '../api/customerApi'
import '../styles/CustomerList.css'

function CustomerList() {
  const navigate = useNavigate()
  const [activeStatus, setActiveStatus] = useState('Active')
  const [searchQuery, setSearchQuery] = useState('')
  const [customers, setCustomers] = useState([])
  const [loading, setLoading] = useState(true)

  const loadCustomers = () => {
    setLoading(true)
    getAllPage({ pageNumber: 1, pageSize: 100 })
      .then((data) => setCustomers(Array.isArray(data) ? data : data?.content || []))
      .catch(() => setCustomers([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadCustomers()
  }, [])

  const filtered = customers.filter((c) => {
    const matchStatus = activeStatus === 'Active' ? c.isActive : !c.isActive
    const matchSearch = !searchQuery || 
      (c.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.mobileNumber || '').includes(searchQuery)
    return matchStatus && matchSearch
  })

  const handleToggleStatus = async (id, current) => {
    try {
      await updateStatus(id, !current)
      loadCustomers()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="customer-list-container">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Customer List</h1>
          <p className="page-subtitle">Manage Your Customers</p>
        </div>
        <div className="header-actions">
          <button className="action-btn pdf-btn" title="Export PDF">
            <FontAwesomeIcon icon={faFilePdf} />
          </button>
          <button className="action-btn excel-btn" title="Export Excel">
            <FontAwesomeIcon icon={faFileExcel} />
          </button>
          <button className="action-btn refresh-btn" title="Refresh">
            <FontAwesomeIcon icon={faSyncAlt} />
          </button>
          <button className="action-btn upload-btn" title="Upload">
            <FontAwesomeIcon icon={faArrowUp} />
          </button>
          <button 
            className="action-btn add-btn"
            onClick={() => navigate('/customers/new')}
          >
            <FontAwesomeIcon icon={faPlus} />
            <span>Add New</span>
          </button>
        </div>
      </div>

      {/* Status Toggles */}
      <div className="status-toggles">
        <button 
          className={`status-toggle ${activeStatus === 'Active' ? 'active' : ''}`}
          onClick={() => setActiveStatus('Active')}
        >
          Active
        </button>
        <button 
          className={`status-toggle ${activeStatus === 'Inactive' ? 'active' : ''}`}
          onClick={() => setActiveStatus('Inactive')}
        >
          Inactive
        </button>
      </div>

      {/* Search */}
      <div className="filters-container">
        <div className="search-wrapper">
          <input
            type="text"
            className="search-input"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="search-btn">
            <FontAwesomeIcon icon={faSearch} />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="customer-table">
          <thead>
            <tr>
              <th>
                Customer Name
                <span className="sort-icons">
                  <FontAwesomeIcon icon={faSortUp} />
                  <FontAwesomeIcon icon={faSortDown} />
                </span>
              </th>
              <th>
                Mobile Number
                <span className="sort-icons">
                  <FontAwesomeIcon icon={faSortUp} />
                  <FontAwesomeIcon icon={faSortDown} />
                </span>
              </th>
              <th>
                Status
                <span className="sort-icons">
                  <FontAwesomeIcon icon={faSortUp} />
                  <FontAwesomeIcon icon={faSortDown} />
                </span>
              </th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="no-data">Loading...</td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan="4" className="no-data">
                  <div className="no-data-content">
                    <div className="no-data-icon">📦</div>
                    <div className="no-data-text">No data</div>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((c) => (
                <tr key={c.id}>
                  <td>{c.name}</td>
                  <td>{c.mobileNumber}</td>
                  <td>{c.isActive ? 'Active' : 'Inactive'}</td>
                  <td>
                    <button
                      type="button"
                      className="action-icon-btn"
                      onClick={() => handleToggleStatus(c.id, c.isActive)}
                      title={c.isActive ? 'Deactivate' : 'Activate'}
                    >
                      <FontAwesomeIcon icon={c.isActive ? faToggleOn : faToggleOff} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Bottom Accent Line */}
      <div className="bottom-accent-line"></div>
    </div>
  )
}

export default CustomerList
