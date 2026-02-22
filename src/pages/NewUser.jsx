import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { register } from '../api/userApi'
import { getAll as getRoles } from '../api/userRoleApi'
import '../styles/NewUser.css'

function NewUser() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    password: '',
    address: '',
    emailAddress: '',
    mobileNumber: '',
    isActive: true,
    userRoleId: ''
  })
  const [roles, setRoles] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    getRoles().then(setRoles).catch(() => setRoles([]))
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'userRoleId' ? (value ? parseInt(value, 10) : '') : value,
      ...(name === 'isActive' && { isActive: value === 'true' })
    }))
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        password: formData.password,
        address: formData.address || undefined,
        emailAddress: formData.emailAddress,
        mobileNumber: formData.mobileNumber || undefined,
        isActive: formData.isActive,
        userRoleId: formData.userRoleId
      })
      navigate('/users')
    } catch (err) {
      setError(err.message || 'Failed to register user')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="new-user-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">New User</h1>
          <p className="page-subtitle">Create new user</p>
        </div>
        <button type="button" className="back-btn" onClick={() => navigate('/users')}>
          ← Back to User
        </button>
      </div>

      <form className="user-form" onSubmit={handleSave}>
        <div className="form-group">
          <label htmlFor="firstName">First Name *</label>
          <input
            type="text"
            id="firstName"
            name="firstName"
            value={formData.firstName}
            onChange={handleInputChange}
            placeholder="Enter First Name"
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="lastName">Last Name *</label>
          <input
            type="text"
            id="lastName"
            name="lastName"
            value={formData.lastName}
            onChange={handleInputChange}
            placeholder="Enter Last Name"
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="emailAddress">Email Address *</label>
          <input
            type="email"
            id="emailAddress"
            name="emailAddress"
            value={formData.emailAddress}
            onChange={handleInputChange}
            placeholder="Enter Email Address"
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Password *</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            placeholder="Enter Password"
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="mobileNumber">Mobile Number</label>
          <input
            type="tel"
            id="mobileNumber"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleInputChange}
            placeholder="Enter Mobile Number"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="address">Address</label>
          <textarea
            id="address"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="Enter Address"
            className="form-textarea"
            rows="3"
          />
        </div>

        <div className="form-group">
          <label htmlFor="userRoleId">User Role *</label>
          <select
            id="userRoleId"
            name="userRoleId"
            value={formData.userRoleId}
            onChange={handleInputChange}
            className="form-select"
            required
          >
            <option value="">Select Role</option>
            {roles.map((r) => (
              <option key={r.id} value={r.id}>
                {r.userRole || r.name}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="isActive">Status</label>
          <select
            id="isActive"
            name="isActive"
            value={String(formData.isActive)}
            onChange={handleInputChange}
            className="form-select"
          >
            <option value="true">Active</option>
            <option value="false">Inactive</option>
          </select>
        </div>

        {error && <div className="form-error">{error}</div>}

        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={() => navigate('/users')}>
            Cancel
          </button>
          <button type="submit" className="save-btn" disabled={loading}>
            {loading ? 'Saving...' : 'Save User'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default NewUser
