import { useState, useEffect, useRef } from 'react'
import '../styles/POSCartEditModal.css'

function buildCartItemFromProduct(product, qty = 1) {
  const name = product?.brandDto?.name
    ? `${product.name ?? ''} (${product.brandDto.name})`
    : (product?.name ?? '')
  const pricePerUnit = product?.price ?? product?.pricePerUnit ?? 0
  return {
    id: product?.id,
    name,
    pricePerUnit,
    quantity: qty,
    taxDto: product?.taxDto ?? { taxPercentage: 0 },
    productCategoryId: product?.productCategoryDto?.id ?? product?.productCategoryId,
    productCategoryName: product?.productCategoryDto?.name ?? product?.productCategoryName,
    productName: product?.name ?? '',
    brandId: product?.brandDto?.id ?? product?.brandId,
    brandName: product?.brandDto?.name ?? product?.brandName
  }
}

function POSCartEditModal({ item, categories = [], getProductsByCategory, onSave, onRemove, onCancel }) {
  const [categoryId, setCategoryId] = useState(item?.productCategoryId ?? '')
  const [products, setProducts] = useState([])
  const [productName, setProductName] = useState(item?.productName ?? '')
  const [brandProduct, setBrandProduct] = useState(null)
  const [quantity, setQuantity] = useState(String(item?.quantity ?? 1))
  const [loading, setLoading] = useState(true)
  const quantityRef = useRef(null)

  const categoryDisplayName = (c) => c?.name ?? c?.productCategoryName ?? ''

  const uniqueProductNames = [...new Set(products.map((p) => p?.name).filter(Boolean))]
  const brandsForProduct = productName
    ? products.filter((p) => (p?.name || '').toLowerCase() === productName.toLowerCase())
    : []

  useEffect(() => {
    const id = item?.productCategoryId ?? item?.productCategoryDto?.id
    setCategoryId(id ?? '')
    setProductName(item?.productName ?? '')
    setQuantity(String(item?.quantity ?? 1))
  }, [item])

  useEffect(() => {
    if (!categoryId || !getProductsByCategory) {
      setProducts([])
      setLoading(false)
      return
    }
    setLoading(true)
    getProductsByCategory(categoryId)
      .then((res) => {
        const list = Array.isArray(res) ? res : (res?.content ?? res?.responseDto ?? [])
        setProducts(list || [])
        const isSameCategory = Number(categoryId) === Number(item?.productCategoryId ?? item?.productCategoryDto?.id)
        if (isSameCategory && item?.id) {
          const currentName = item?.productName ?? ''
          const currentId = item?.id
          const match = (list || []).find((p) => p.id === currentId)
          if (match) {
            setBrandProduct(match)
            setProductName(match.name ?? currentName)
          } else if (currentName && list?.length) {
            const firstWithName = list.find((p) => (p.name || '').toLowerCase() === currentName.toLowerCase())
            setBrandProduct(firstWithName ?? null)
            setProductName(currentName)
          } else {
            setBrandProduct(null)
          }
        }
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false))
  }, [categoryId])

  useEffect(() => {
    if (!productName && brandsForProduct.length > 0) {
      setBrandProduct(brandsForProduct[0])
    } else if (productName && brandsForProduct.length > 0 && !brandsForProduct.find((p) => p.id === brandProduct?.id)) {
      setBrandProduct(brandsForProduct[0])
    } else if (brandsForProduct.length === 0) {
      setBrandProduct(null)
    }
  }, [productName, products])

  const handleCategoryChange = (e) => {
    const id = e.target.value ? Number(e.target.value) : ''
    setCategoryId(id)
    setProductName('')
    setBrandProduct(null)
  }

  const handleProductNameChange = (e) => {
    setProductName(e.target.value || '')
    const name = e.target.value || ''
    const list = products.filter((p) => (p?.name || '').toLowerCase() === name.toLowerCase())
    setBrandProduct(list.length > 0 ? list[0] : null)
  }

  const handleBrandChange = (e) => {
    const id = e.target.value ? Number(e.target.value) : null
    const p = brandsForProduct.find((x) => x.id === id)
    setBrandProduct(p ?? null)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const qty = Math.max(1, parseInt(quantity, 10) || 1)
    if (brandProduct) {
      const newItem = buildCartItemFromProduct(brandProduct, qty)
      onSave(newItem)
      onCancel()
    }
  }

  const handleRemove = () => {
    onRemove()
    onCancel()
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') onCancel()
  }

  const canSave = brandProduct && (parseInt(quantity, 10) || 0) > 0

  return (
    <div className="pos-cart-edit-overlay" onClick={onCancel}>
      <div className="pos-cart-edit-modal pos-cart-edit-modal-wide" onClick={(e) => e.stopPropagation()}>
        <div className="pos-cart-edit-header">
          <span className="pos-cart-edit-title">Edit item</span>
          <button type="button" className="pos-cart-edit-close" onClick={onCancel}>
            ×
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <label htmlFor="pos-edit-category" className="pos-cart-edit-label">
            Category
          </label>
          <select
            id="pos-edit-category"
            className="pos-cart-edit-select"
            value={categoryId}
            onChange={handleCategoryChange}
            onKeyDown={handleKeyDown}
          >
            <option value="">Select category</option>
            {(categories || []).map((c) => (
              <option key={c.id ?? c.productCategoryName} value={c.id ?? ''}>
                {categoryDisplayName(c)}
              </option>
            ))}
          </select>

          {loading ? (
            <p className="pos-cart-edit-loading">Loading products...</p>
          ) : (
            <>
              <label htmlFor="pos-edit-product" className="pos-cart-edit-label">
                Product
              </label>
              <select
                id="pos-edit-product"
                className="pos-cart-edit-select"
                value={productName}
                onChange={handleProductNameChange}
                onKeyDown={handleKeyDown}
              >
                <option value="">Select product</option>
                {uniqueProductNames.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>

              <label htmlFor="pos-edit-brand" className="pos-cart-edit-label">
                Brand
              </label>
              <select
                id="pos-edit-brand"
                className="pos-cart-edit-select"
                value={brandProduct?.id ?? ''}
                onChange={handleBrandChange}
                onKeyDown={handleKeyDown}
              >
                <option value="">Select brand</option>
                {brandsForProduct.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.brandDto?.name ? `${p.name ?? ''} - ${p.brandDto.name}` : (p.name ?? '')}
                  </option>
                ))}
              </select>
            </>
          )}

          <label htmlFor="pos-edit-qty" className="pos-cart-edit-label">
            Quantity
          </label>
          <input
            ref={quantityRef}
            id="pos-edit-qty"
            type="number"
            min="1"
            className="pos-cart-edit-input"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            onKeyDown={handleKeyDown}
          />

          <div className="pos-cart-edit-actions">
            <button type="submit" className="pos-cart-edit-save" disabled={!canSave}>
              Save
            </button>
            <button type="button" className="pos-cart-edit-cancel" onClick={onCancel}>
              Cancel
            </button>
          </div>
        </form>
        <button type="button" className="pos-cart-edit-remove" onClick={handleRemove}>
          Remove this item
        </button>
      </div>
    </div>
  )
}

export default POSCartEditModal
