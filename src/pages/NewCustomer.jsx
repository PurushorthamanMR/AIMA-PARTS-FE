import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { save as saveCustomer } from '../api/customerApi'
import '../styles/NewCustomer.css'

function NewCustomer() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    mobileNumber: '',
    isActive: true
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'isActive' ? value === 'true' : value
    }))
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await saveCustomer({
        name: formData.name,
        mobileNumber: formData.mobileNumber,
        isActive: formData.isActive
      })
      navigate('/customers')
    } catch (err) {
      setError(err.message || 'Failed to save customer')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="new-customer-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">New Customer</h1>
          <p className="page-subtitle">Create new customer</p>
        </div>
        <button type="button" className="back-btn" onClick={() => navigate('/customers')}>
          ← Back to Customer
        </button>
      </div>

      <form className="customer-form" onSubmit={handleSave}>
        <div className="form-group">
          <label htmlFor="name">Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter Customer Name"
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="mobileNumber">Mobile Number *</label>
          <input
            type="tel"
            id="mobileNumber"
            name="mobileNumber"
            value={formData.mobileNumber}
            onChange={handleInputChange}
            placeholder="Enter Mobile Number"
            className="form-input"
            required
          />
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
          <button type="button" className="cancel-btn" onClick={() => navigate('/customers')}>
            Cancel
          </button>
          <button type="submit" className="save-btn" disabled={loading}>
            {loading ? 'Saving...' : 'Save Customer'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default NewCustomer
