import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearch } from '@fortawesome/free-solid-svg-icons'
import '../styles/POSSearchBar.css'

function POSSearchBar({ value, onChange, placeholder = 'Search...' }) {
  return (
    <div className="pos-search-bar">
      <FontAwesomeIcon icon={faSearch} className="pos-search-icon" />
      <input
        type="text"
        className="pos-search-input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}

export default POSSearchBar
