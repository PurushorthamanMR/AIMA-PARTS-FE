import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/NewCategory.css'

function NewBrand() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    brandName: '',
    status: 'Active'
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSave = (e) => {
    e.preventDefault()
    console.log('Saving brand:', formData)
    navigate('/brand')
  }

  return (
    <div className="new-category-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">New Brand</h1>
          <p className="page-subtitle">Create new brand</p>
        </div>
        <button className="back-btn" onClick={() => navigate('/brand')}>
          ← Back to Brand
        </button>
      </div>

      <form className="category-form" onSubmit={handleSave}>
        <div className="form-group">
          <label htmlFor="brandName">Brand Name</label>
          <input
            type="text"
            id="brandName"
            name="brandName"
            value={formData.brandName}
            onChange={handleInputChange}
            placeholder="Enter Brand Name"
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="status">Status</label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleInputChange}
            className="form-select"
          >
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>

        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={() => navigate('/brand')}>
            Cancel
          </button>
          <button type="submit" className="save-btn">
            Save Brand
          </button>
        </div>
      </form>
    </div>
  )
}

export default NewBrand
