import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { save as saveBrand } from '../api/brandApi'
import '../styles/NewCategory.css'

function NewBrand() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
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
      await saveBrand({
        name: formData.name,
        isActive: formData.isActive
      })
      navigate('/brand')
    } catch (err) {
      setError(err.message || 'Failed to save brand')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="new-category-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">New Brand</h1>
          <p className="page-subtitle">Create new brand</p>
        </div>
        <button type="button" className="back-btn" onClick={() => navigate('/brand')}>
          ← Back to Brand
        </button>
      </div>

      <form className="category-form" onSubmit={handleSave}>
        <div className="form-group">
          <label htmlFor="name">Brand Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter Brand Name"
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
          <button type="button" className="cancel-btn" onClick={() => navigate('/brand')}>
            Cancel
          </button>
          <button type="submit" className="save-btn" disabled={loading}>
            {loading ? 'Saving...' : 'Save Brand'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default NewBrand
