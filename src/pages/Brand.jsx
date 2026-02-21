import { useState } from 'react'
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
  faSortDown
} from '@fortawesome/free-solid-svg-icons'
import '../styles/Category.css'

function Brand() {
  const navigate = useNavigate()
  const [activeStatus, setActiveStatus] = useState('Active')
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="category-container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Brand</h1>
          <p className="page-subtitle">Manage your brands</p>
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
            onClick={() => navigate('/brand/new')}
          >
            <FontAwesomeIcon icon={faPlus} />
            <span>Add New</span>
          </button>
        </div>
      </div>

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
        <select className="category-filter-select">
          <option>Show all brands</option>
        </select>
      </div>

      <div className="table-container">
        <table className="category-table">
          <thead>
            <tr>
              <th>
                Brand
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
            <tr>
              <td colSpan="3" className="no-data">
                <div className="no-data-content">
                  <div className="no-data-icon">🏷️</div>
                  <div className="no-data-text">No data</div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="bottom-accent-line"></div>
    </div>
  )
}

export default Brand
