import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { save as saveCategory } from '../api/productCategoryApi'
import '../styles/NewCategory.css'

function NewCategory() {
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
      await saveCategory({
        name: formData.name,
        isActive: formData.isActive
      })
      navigate('/category')
    } catch (err) {
      setError(err.message || 'Failed to save category')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="new-category-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">New Category</h1>
          <p className="page-subtitle">Create new product category</p>
        </div>
        <button type="button" className="back-btn" onClick={() => navigate('/category')}>
          ← Back to Category
        </button>
      </div>

      <form className="category-form" onSubmit={handleSave}>
        <div className="form-group">
          <label htmlFor="name">Category Name *</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="Enter Category Name"
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
          <button type="button" className="cancel-btn" onClick={() => navigate('/category')}>
            Cancel
          </button>
          <button type="submit" className="save-btn" disabled={loading}>
            {loading ? 'Saving...' : 'Save Category'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default NewCategory
