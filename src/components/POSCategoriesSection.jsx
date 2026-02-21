import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'
import '../styles/POSCategoriesSection.css'

const ITEMS_PER_SECTION = 8

function POSCategoriesSection({
  viewMode,
  items,
  selectedCategory,
  selectedProduct,
  onCategoryClick,
  onProductClick,
  onBrandClick,
  sectionIndex,
  onNext,
  onPrevious,
  canGoNext,
  canGoPrevious
}) {
  const getDisplayItems = () => {
    const start = sectionIndex * ITEMS_PER_SECTION
    return items.slice(start, start + ITEMS_PER_SECTION)
  }

  const displayItems = getDisplayItems()

  const getItemLabel = (item) => {
    if (viewMode === 'categories') return item.productCategoryName || item.name
    if (viewMode === 'products') return item.name
    if (viewMode === 'brands') return item.name
    return item.name || ''
  }

  const handleItemClick = (item) => {
    if (viewMode === 'categories') onCategoryClick(item)
    if (viewMode === 'products') onProductClick(item)
    if (viewMode === 'brands') onBrandClick(item)
  }

  const getPlaceholderText = () => {
    if (viewMode === 'categories') return 'Select a category'
    if (viewMode === 'products') return 'Select a product'
    if (viewMode === 'brands') return 'Select a brand to add to cart'
    return ''
  }

  return (
    <div className="pos-categories-section">
      <div className="pos-categories-grid">
        {displayItems.length > 0 ? (
          displayItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className="pos-category-box"
              onClick={() => handleItemClick(item)}
            >
              {getItemLabel(item)}
            </button>
          ))
        ) : (
          <div className="pos-categories-empty">{getPlaceholderText()}</div>
        )}
      </div>
      <div className="pos-categories-nav">
        {canGoPrevious && (
          <button type="button" className="pos-nav-btn pos-nav-prev" onClick={onPrevious}>
            <FontAwesomeIcon icon={faChevronLeft} />
            <span>Previous</span>
          </button>
        )}
        {canGoNext && (
          <button type="button" className="pos-nav-btn pos-nav-next" onClick={onNext}>
            <span>Next</span>
            <FontAwesomeIcon icon={faChevronRight} />
          </button>
        )}
      </div>
    </div>
  )
}

export default POSCategoriesSection
