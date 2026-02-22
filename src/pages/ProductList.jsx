import { useState, useEffect } from 'react'
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
import { getAllPage, updateStatus } from '../api/productApi'
import { getAll as getCategories } from '../api/productCategoryApi'
import { getAll as getBrands } from '../api/brandApi'
import '../styles/ProductList.css'

function ProductList({ onAddNew }) {
  const [activeTab, setActiveTab] = useState('Active')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [products, setProducts] = useState([])
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])
  const [loading, setLoading] = useState(true)

  const loadProducts = () => {
    setLoading(true)
    getAllPage({ pageNumber: 1, pageSize: 100 })
      .then((data) => setProducts(Array.isArray(data) ? data : data?.content || []))
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    loadProducts()
    getCategories().then((d) => setCategories(Array.isArray(d) ? d : d?.content || [])).catch(() => setCategories([]))
    getBrands().then((d) => setBrands(Array.isArray(d) ? d : d?.content || [])).catch(() => setBrands([]))
  }, [])

  const getCategoryName = (id) => categories.find((c) => c.id === id)?.name || id
  const getBrandName = (id) => brands.find((b) => b.id === id)?.name || id

  const filtered = products.filter((p) => {
    const matchStatus = activeTab === 'Active' ? p.isActive : !p.isActive
    const matchSearch = !searchQuery || (p.name || '').toLowerCase().includes(searchQuery.toLowerCase())
    const matchCat = !selectedCategory || p.productCategoryId === parseInt(selectedCategory, 10)
    return matchStatus && matchSearch && matchCat
  })

  const handleToggleStatus = async (id, current) => {
    try {
      await updateStatus(id, !current)
      loadProducts()
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <div className="product-list-container">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Product List</h1>
          <p className="page-subtitle">Manage your products</p>
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
            onClick={(e) => {
              e.preventDefault()
              if (onAddNew) {
                onAddNew()
              }
            }}
          >
            <FontAwesomeIcon icon={faPlus} />
            <span>Add New</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-container">
        <button 
          className={`tab ${activeTab === 'Active' ? 'active' : ''}`}
          onClick={() => setActiveTab('Active')}
        >
          Active
        </button>
        <button 
          className={`tab ${activeTab === 'Inactive' ? 'active' : ''}`}
          onClick={() => setActiveTab('Inactive')}
        >
          Inactive
        </button>
      </div>

      {/* Filters */}
      <div className="filters-container">
        <div className="search-wrapper">
          <FontAwesomeIcon icon={faSearch} className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select 
          className="category-select"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          <option value="">Select Category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="product-table">
          <thead>
            <tr>
              <th>
                Name
                <span className="sort-icons">
                  <FontAwesomeIcon icon={faSortUp} />
                  <FontAwesomeIcon icon={faSortDown} />
                </span>
              </th>
              <th>
                Brand
                <span className="sort-icons">
                  <FontAwesomeIcon icon={faSortUp} />
                  <FontAwesomeIcon icon={faSortDown} />
                </span>
              </th>
              <th>
                Category
                <span className="sort-icons">
                  <FontAwesomeIcon icon={faSortUp} />
                  <FontAwesomeIcon icon={faSortDown} />
                </span>
              </th>
              <th>
                Price
                <span className="sort-icons">
                  <FontAwesomeIcon icon={faSortUp} />
                  <FontAwesomeIcon icon={faSortDown} />
                </span>
              </th>
              <th>
                Qty
                <span className="sort-icons">
                  <FontAwesomeIcon icon={faSortUp} />
                  <FontAwesomeIcon icon={faSortDown} />
                </span>
              </th>
              <th>
                Low Stock
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
              filtered.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{getBrandName(p.brandId)}</td>
                  <td>{getCategoryName(p.productCategoryId)}</td>
                  <td>{p.price != null ? Number(p.price).toFixed(2) : '-'}</td>
                  <td>{p.quantity ?? '-'}</td>
                  <td>{p.lowStock ?? '-'}</td>
                  <td>{p.isActive ? 'Active' : 'Inactive'}</td>
                  <td>
                    <button
                      type="button"
                      className="action-icon-btn"
                      onClick={() => handleToggleStatus(p.id, p.isActive)}
                      title={p.isActive ? 'Deactivate' : 'Activate'}
                    >
                      <FontAwesomeIcon icon={p.isActive ? faToggleOn : faToggleOff} />
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

export default ProductList
