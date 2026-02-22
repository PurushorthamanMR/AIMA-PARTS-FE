import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faInfoCircle, faDollarSign, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons'
import { save as saveProduct } from '../api/productApi'
import { getAll as getCategories } from '../api/productCategoryApi'
import { getAll as getBrands } from '../api/brandApi'
import '../styles/NewProduct.css'

function NewProduct({ onBack, onSave }) {
  const navigate = useNavigate()
  const [productInfoOpen, setProductInfoOpen] = useState(true)
  const [pricingStocksOpen, setPricingStocksOpen] = useState(true)
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    brandId: '',
    productCategoryId: '',
    price: '',
    quantity: '',
    lowStock: '',
    isActive: true
  })

  useEffect(() => {
    getCategories().then(setCategories).catch(() => setCategories([]))
    getBrands().then(setBrands).catch(() => setBrands([]))
  }, [])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'brandId' || name === 'productCategoryId'
          ? value ? parseInt(value, 10) : ''
          : name === 'isActive'
            ? value === 'true'
            : name === 'price' || name === 'quantity' || name === 'lowStock'
              ? value === '' ? '' : Number(value)
              : value
    }))
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await saveProduct({
        name: formData.name,
        brandId: formData.brandId,
        productCategoryId: formData.productCategoryId,
        price: Number(formData.price) || 0,
        quantity: Number(formData.quantity) || 0,
        lowStock: Number(formData.lowStock) || 0,
        isActive: formData.isActive
      })
      if (onSave) onSave()
      else navigate('/products')
    } catch (err) {
      setError(err.message || 'Failed to save product')
    } finally {
      setLoading(false)
    }
  }

  const goBack = () => {
    if (onBack) onBack()
    else navigate('/products')
  }

  return (
    <div className="new-product-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">New Product</h1>
          <p className="page-subtitle">Create new product</p>
        </div>
        <button type="button" className="back-btn" onClick={goBack}>
          ← Back to Product
        </button>
      </div>

      <form className="product-form" onSubmit={handleSave}>
        <div className="form-section">
          <div
            className="section-header"
            onClick={() => setProductInfoOpen(!productInfoOpen)}
          >
            <div className="section-title-wrapper">
              <div className="section-icon blue">
                <FontAwesomeIcon icon={faInfoCircle} />
              </div>
              <h2 className="section-title">Product Information</h2>
            </div>
            <FontAwesomeIcon
              icon={productInfoOpen ? faChevronUp : faChevronDown}
              className="section-toggle"
            />
          </div>

          {productInfoOpen && (
            <div className="section-content">
              <div className="form-group">
                <label htmlFor="name">Product Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter Product Name"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="productCategoryId">Category *</label>
                <select
                  id="productCategoryId"
                  name="productCategoryId"
                  value={formData.productCategoryId}
                  onChange={handleInputChange}
                  className="form-select"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="brandId">Brand *</label>
                <select
                  id="brandId"
                  name="brandId"
                  value={formData.brandId}
                  onChange={handleInputChange}
                  className="form-select"
                  required
                >
                  <option value="">Select Brand</option>
                  {brands.map((b) => (
                    <option key={b.id} value={b.id}>
                      {b.name}
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
            </div>
          )}
        </div>

        <div className="form-section">
          <div
            className="section-header"
            onClick={() => setPricingStocksOpen(!pricingStocksOpen)}
          >
            <div className="section-title-wrapper">
              <div className="section-icon blue">
                <FontAwesomeIcon icon={faDollarSign} />
              </div>
              <h2 className="section-title">Pricing & Stocks</h2>
            </div>
            <FontAwesomeIcon
              icon={pricingStocksOpen ? faChevronUp : faChevronDown}
              className="section-toggle"
            />
          </div>

          {pricingStocksOpen && (
            <div className="section-content">
              <div className="form-group">
                <label htmlFor="price">Price *</label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="Enter Price"
                  className="form-input"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="quantity">Quantity *</label>
                <input
                  type="number"
                  id="quantity"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleInputChange}
                  placeholder="Enter Quantity"
                  className="form-input"
                  min="0"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="lowStock">Low Stock Threshold</label>
                <input
                  type="number"
                  id="lowStock"
                  name="lowStock"
                  value={formData.lowStock}
                  onChange={handleInputChange}
                  placeholder="Enter Low Stock"
                  className="form-input"
                  min="0"
                />
              </div>
            </div>
          )}
        </div>

        {error && <div className="form-error">{error}</div>}

        <div className="form-actions">
          <button type="button" className="cancel-btn" onClick={goBack}>
            Cancel
          </button>
          <button type="submit" className="save-btn" disabled={loading}>
            {loading ? 'Saving...' : 'Save Product'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default NewProduct
