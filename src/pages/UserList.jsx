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
import { getAllPage, updateStatus } from '../api/userApi'
import { getAll as getRoles } from '../api/userRoleApi'
import '../styles/UserList.css'

function UserList() {
  const navigate = useNavigate()
  const [activeStatus, setActiveStatus] = useState('Active')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedRole, setSelectedRole] = useState('')
  const [users, setUsers] = useState([])
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(true)

  const loadUsers = () => {
    setLoading(true)
    getAllPage({ pageNumber: 1, pageSize: 100 })
      .then((data) => setUsers(Array.isArray(data) ? data : data?.content || []))
      .catch(() => setUsers([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadUsers()
    getRoles().then((d) => setRoles(Array.isArray(d) ? d : d?.content || [])).catch(() => setRoles([]))
  }, [])

  const getRoleName = (id) => roles.find((r) => r.id === id)?.userRole || id

  const filtered = users.filter((u) => {
    const matchStatus = activeStatus === 'Active' ? u.isActive : !u.isActive
    const matchSearch = !searchQuery || 
      (u.firstName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.lastName || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.emailAddress || '').toLowerCase().includes(searchQuery.toLowerCase())
    const matchRole = !selectedRole || u.userRoleId === parseInt(selectedRole, 10)
    return matchStatus && matchSearch && matchRole
  })

  const handleToggleStatus = async (id, current) => {
    try {
      await updateStatus(id, !current)
      loadUsers()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="user-list-container">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">User List</h1>
          <p className="page-subtitle">Manage Your Users</p>
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
            onClick={() => navigate('/users/new')}
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

      {/* Filters */}
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
        <select 
          className="filter-select"
          value={selectedRole}
          onChange={(e) => setSelectedRole(e.target.value)}
        >
          <option value="">Select Role</option>
          {roles.map((r) => (
            <option key={r.id} value={r.id}>{r.userRole}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="user-table">
          <thead>
            <tr>
              <th>
                First Name
                <span className="sort-icons">
                  <FontAwesomeIcon icon={faSortUp} />
                  <FontAwesomeIcon icon={faSortDown} />
                </span>
              </th>
              <th>
                Last Name
                <span className="sort-icons">
                  <FontAwesomeIcon icon={faSortUp} />
                  <FontAwesomeIcon icon={faSortDown} />
                </span>
              </th>
              <th>
                Email Address
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
                Address
                <span className="sort-icons">
                  <FontAwesomeIcon icon={faSortUp} />
                  <FontAwesomeIcon icon={faSortDown} />
                </span>
              </th>
              <th>
                Role
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
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="8" className="no-data">Loading...</td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan="8" className="no-data">
                  <div className="no-data-content">
                    <div className="no-data-icon">📦</div>
                    <div className="no-data-text">No data</div>
                  </div>
                </td>
              </tr>
            ) : (
              filtered.map((u) => (
                <tr key={u.id}>
                  <td>{u.firstName}</td>
                  <td>{u.lastName}</td>
                  <td>{u.emailAddress}</td>
                  <td>{u.mobileNumber || '-'}</td>
                  <td>{u.address || '-'}</td>
                  <td>{getRoleName(u.userRoleId)}</td>
                  <td>{u.isActive ? 'Active' : 'Inactive'}</td>
                  <td>
                    <button
                      type="button"
                      className="action-icon-btn"
                      onClick={() => handleToggleStatus(u.id, u.isActive)}
                      title={u.isActive ? 'Deactivate' : 'Activate'}
                    >
                      <FontAwesomeIcon icon={u.isActive ? faToggleOn : faToggleOff} />
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

export default UserList
