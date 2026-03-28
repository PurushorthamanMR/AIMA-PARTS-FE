import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import POSHeader from '../components/POSHeader'
import POSSidebar from '../components/POSSidebar'
import POSSearchBar from '../components/POSSearchBar'
import POSCategoriesSection from '../components/POSCategoriesSection'
import POSPendingPayment from '../components/POSPendingPayment'
import POSCardSection from '../components/POSCardSection'
import AdvancePaymentModal from '../components/AdvancePaymentModal'
import FinalPaymentModal from '../components/FinalPaymentModal'
import POSQuantityForm from '../components/POSQuantityForm'
import POSCartEditModal from '../components/POSCartEditModal'
import { getCategories, getProductsByCategory, getPaymentMethods, savePending, saveComplete } from '../api/posApi'
import {
  MOCK_CATEGORIES,
  MOCK_PRODUCTS_BY_CATEGORY,
  MOCK_BRANDS_BY_PRODUCT
} from '../data/posMockData'
import '../styles/POSPage.css'

const ITEMS_PER_SECTION = 8
const EXCLUDED_CATEGORIES = ['Non Scan', 'Custom']
const MOCK_PAYMENT_METHODS = [
  { id: 1, type: 'Cash', isActive: true },
  { id: 2, type: 'Card', isActive: true },
  { id: 3, type: 'UPI', isActive: true }
]

function POSPage() {
  const navigate = useNavigate()
  const [categories, setCategories] = useState([])
  const [products, setProducts] = useState([])
  const [paymentMethods, setPaymentMethods] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [useMockData, setUseMockData] = useState(false)
  const [saving, setSaving] = useState(false)

  const [viewMode, setViewMode] = useState('categories')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedProductName, setSelectedProductName] = useState(null)
  const [sectionIndex, setSectionIndex] = useState(0)
  const [cartItems, setCartItems] = useState([])
  const [selectedPendingTransaction, setSelectedPendingTransaction] = useState(null)
  const [showAdvanceModal, setShowAdvanceModal] = useState(false)
  const [showFinalModal, setShowFinalModal] = useState(false)
  const [brandForAdd, setBrandForAdd] = useState(null)
  const [editingCartIndex, setEditingCartIndex] = useState(null)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        setError(null)
        const [cats, pms] = await Promise.all([getCategories(), getPaymentMethods()])
        const catName = (c) => c?.name ?? c?.productCategoryName
        const filtered = Array.isArray(cats) ? cats.filter((c) => !EXCLUDED_CATEGORIES.includes(catName(c))) : []
        setCategories(filtered.length > 0 ? filtered : MOCK_CATEGORIES)
        setPaymentMethods(Array.isArray(pms) && pms.length > 0 ? pms : MOCK_PAYMENT_METHODS)
        setUseMockData(filtered.length === 0 || (Array.isArray(pms) && pms.length === 0))
      } catch (err) {
        setCategories(MOCK_CATEGORIES)
        setPaymentMethods(MOCK_PAYMENT_METHODS)
        setUseMockData(true)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  useEffect(() => {
    const categoryKey = selectedCategory?.name ?? selectedCategory?.productCategoryName
    if (!categoryKey) return
    const load = async () => {
      if (useMockData) {
        const mock = MOCK_PRODUCTS_BY_CATEGORY[categoryKey] || []
        setProducts(mock)
        return
      }
      if (!selectedCategory?.id) return
      try {
        const res = await getProductsByCategory(selectedCategory.id)
        const list = Array.isArray(res) ? res : (res?.content || [])
        setProducts(list.length > 0 ? list : MOCK_PRODUCTS_BY_CATEGORY[categoryKey] || [])
      } catch (err) {
        const mock = MOCK_PRODUCTS_BY_CATEGORY[categoryKey] || []
        setProducts(mock)
      }
    }
    load()
  }, [selectedCategory?.id, selectedCategory?.name, selectedCategory?.productCategoryName, useMockData])

  const categoryDisplayName = (c) => c?.name ?? c?.productCategoryName ?? ''

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories
    const q = searchQuery.toLowerCase()
    return categories.filter((c) => categoryDisplayName(c).toLowerCase().includes(q))
  }, [categories, searchQuery])

  const uniqueProductNames = useMemo(() => {
    const names = [...new Set(products.map((p) => p?.name).filter(Boolean))]
    return names
  }, [products])

  const filteredProductNames = useMemo(() => {
    if (!searchQuery.trim()) return uniqueProductNames
    const q = searchQuery.toLowerCase()
    return uniqueProductNames.filter((name) => name.toLowerCase().includes(q))
  }, [uniqueProductNames, searchQuery])

  const brands = useMemo(() => {
    if (!selectedProductName) return []
    if (useMockData) {
      const mockBrands = MOCK_BRANDS_BY_PRODUCT[selectedProductName]
      if (mockBrands && mockBrands.length > 0) return mockBrands
    }
    return products.filter((p) => (p.name || '').toLowerCase() === (selectedProductName || '').toLowerCase())
  }, [products, selectedProductName, useMockData])

  const filteredBrands = useMemo(() => {
    if (!searchQuery.trim()) return brands
    const q = searchQuery.toLowerCase()
    return brands.filter((b) => {
      const label = b.brandDto?.name ? `${b.name} - ${b.brandDto.name}` : (b.name || '')
      return label.toLowerCase().includes(q)
    })
  }, [brands, searchQuery])

  const displayItems = viewMode === 'categories' ? filteredCategories : viewMode === 'products' ? filteredProductNames : filteredBrands
  const totalSections = Math.ceil(displayItems.length / ITEMS_PER_SECTION) || 1
  const canGoNext = sectionIndex < totalSections - 1
  const canGoPrevious = sectionIndex > 0

  const handleCategoryClick = (cat) => {
    setSelectedCategory(cat)
    setSelectedProductName(null)
    setViewMode('products')
    setSectionIndex(0)
  }

  const handleProductClick = (productName) => {
    setSelectedProductName(productName)
    setViewMode('brands')
    setSectionIndex(0)
  }

  const handleBrandClick = (item) => {
    setBrandForAdd(item)
  }

  const normalizeCartItem = (item, qty = 1) => {
    const name = item.brandDto?.name ? `${item.name || ''} (${item.brandDto.name})` : (item.name || '')
    const pricePerUnit = item.price ?? item.pricePerUnit ?? 0
    return {
      id: item.id,
      name,
      pricePerUnit,
      quantity: qty,
      taxDto: item.taxDto ?? { taxPercentage: 0 },
      productCategoryId: item.productCategoryDto?.id ?? item.productCategoryId,
      productCategoryName: item.productCategoryDto?.name ?? item.productCategoryName,
      productName: item.name ?? '',
      brandId: item.brandDto?.id ?? item.brandId,
      brandName: item.brandDto?.name ?? item.brandName
    }
  }

  const handleAddToCartWithQuantity = (itemWithQty) => {
    const qty = itemWithQty.quantity || 1
    const normalized = normalizeCartItem(itemWithQty, qty)
    setCartItems((prev) => {
      const existing = prev.findIndex((i) => i.id === normalized.id)
      if (existing >= 0) {
        const next = [...prev]
        next[existing] = { ...next[existing], quantity: (next[existing].quantity || 1) + qty }
        return next
      }
      return [...prev, normalized]
    })
    setBrandForAdd(null)
  }

  const handleRemoveItem = (idx) => {
    setCartItems((prev) => prev.filter((_, i) => i !== idx))
  }

  const handleUpdateQuantity = (idx, qty) => {
    setCartItems((prev) => {
      const next = [...prev]
      next[idx] = { ...next[idx], quantity: Math.max(1, qty) }
      return next
    })
  }

  const buildTransactionPayload = (customer, paymentMethod, amount) => {
    const subtotal = cartItems.reduce((sum, item) => sum + (item.pricePerUnit || 0) * (item.quantity || 1), 0)
    const totalAmount = subtotal
    const userId = parseInt(localStorage.getItem('userId'), 10)
    const paymentAmount = amount ?? totalAmount
    const isAdvance = amount != null && amount < totalAmount
    const balanceAmount = isAdvance ? totalAmount - paymentAmount : 0

    return {
      customerDto: { id: customer?.id },
      userDto: { id: userId || 1 },
      totalAmount,
      balanceAmount,
      advancePaymentAmount: paymentAmount,
      status: 'Completed',
      transactionDetailsList: cartItems.map((item) => ({
        productDto: { id: item.id },
        quantity: item.quantity || 1,
        unitPrice: item.pricePerUnit || 0,
        discount: 0
      })),
      transactionPaymentMethod: [
        {
          paymentMethodDto: { id: paymentMethod?.id },
          amount: paymentAmount
        }
      ]
    }
  }

  const handleAdvancePayment = () => {
    if (cartItems.length === 0) return
    setShowAdvanceModal(true)
  }

  const handleAdvanceFinish = async (payload, customer) => {
    setSaving(true)
    try {
      const transaction = await savePending(payload)
      const advanceAmount = payload.transactionPaymentMethod?.[0]?.amount || 0
      const totalAmount = cartItems.reduce((sum, item) => sum + (item.pricePerUnit || 0) * (item.quantity || 1), 0)
      const itemsForBill = [...cartItems]
      setCartItems([])
      setShowAdvanceModal(false)
      navigate('/pos/bill', {
        state: {
          transaction,
          cartItems: itemsForBill,
          customer: customer || { id: payload.customerDto?.id, name: '' },
          totalAmount,
          advanceAmount
        }
      })
    } catch (err) {
      alert(err.message || 'Failed to save advance payment')
    } finally {
      setSaving(false)
    }
  }

  const handleFinalPayment = () => {
    if (cartItems.length === 0) return
    setShowFinalModal(true)
  }

  const handleFinalFinish = async (payload, customer) => {
    setSaving(true)
    try {
      const transaction = await saveComplete(payload)
      const totalAmount = cartItems.reduce((sum, item) => sum + (item.pricePerUnit || 0) * (item.quantity || 1), 0)
      const itemsForBill = [...cartItems]
      setCartItems([])
      setShowFinalModal(false)
      navigate('/pos/bill', {
        state: {
          transaction,
          cartItems: itemsForBill,
          customer: customer || { id: payload.customerDto?.id, name: '' },
          totalAmount,
          advanceAmount: totalAmount
        }
      })
    } catch (err) {
      alert(err.message || 'Failed to save transaction')
    } finally {
      setSaving(false)
    }
  }

  const getSearchPlaceholder = () => {
    if (viewMode === 'categories') return 'Search categories...'
    if (viewMode === 'products') return 'Search products...'
    return 'Search brands...'
  }

  const handleBackToCategories = () => {
    setSelectedCategory(null)
    setSelectedProductName(null)
    setViewMode('categories')
    setSectionIndex(0)
  }

  const handleBackToProducts = () => {
    setSelectedProductName(null)
    setViewMode('products')
    setSectionIndex(0)
  }

  if (loading) {
    return (
      <div className="pos-page">
        <POSHeader />
        <div className="pos-layout">
          <POSSidebar />
          <main className="pos-main">
            <div className="pos-loading">Loading...</div>
          </main>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="pos-page">
        <POSHeader />
        <div className="pos-layout">
          <POSSidebar />
          <main className="pos-main">
            <div className="pos-error">{error}</div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <div className="pos-page">
      <POSHeader />
      <div className="pos-layout">
        <POSSidebar />
        <main className="pos-main">
          <div className="pos-content-wrapper">
            <div className="pos-left-content">
              <POSSearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder={getSearchPlaceholder()}
              />
              {(viewMode === 'products' || viewMode === 'brands') && (
                <div className="pos-breadcrumb">
                  <button type="button" onClick={handleBackToCategories}>
                    Categories
                  </button>
                  <span className="pos-breadcrumb-sep">›</span>
                  {viewMode === 'products' ? (
                    <span>{categoryDisplayName(selectedCategory)}</span>
                  ) : (
                    <button type="button" onClick={handleBackToProducts}>
                      {categoryDisplayName(selectedCategory)}
                    </button>
                  )}
                  {viewMode === 'brands' && selectedProductName && (
                    <>
                      <span className="pos-breadcrumb-sep">›</span>
                      <span>{selectedProductName}</span>
                    </>
                  )}
                </div>
              )}
              <POSCategoriesSection
                viewMode={viewMode}
                items={displayItems}
                selectedCategory={selectedCategory}
                selectedProductName={selectedProductName}
                onCategoryClick={handleCategoryClick}
                onProductClick={handleProductClick}
                onBrandClick={handleBrandClick}
                sectionIndex={sectionIndex}
                onNext={() => setSectionIndex((i) => Math.min(i + 1, totalSections - 1))}
                onPrevious={() => setSectionIndex((i) => Math.max(i - 1, 0))}
                canGoNext={canGoNext}
                canGoPrevious={canGoPrevious}
              />
              <POSPendingPayment
                onSelectPending={setSelectedPendingTransaction}
                selectedPendingId={selectedPendingTransaction?.id}
              />
            </div>
            <AdvancePaymentModal
              isOpen={showAdvanceModal}
              onClose={() => setShowAdvanceModal(false)}
              paymentMethods={paymentMethods}
              cartItems={cartItems}
              totalAmount={cartItems.reduce((sum, item) => sum + (item.pricePerUnit || 0) * (item.quantity || 1), 0)}
              onFinish={handleAdvanceFinish}
              buildTransactionPayload={buildTransactionPayload}
            />
            <FinalPaymentModal
              isOpen={showFinalModal}
              onClose={() => setShowFinalModal(false)}
              paymentMethods={paymentMethods}
              cartItems={cartItems}
              onFinish={handleFinalFinish}
              buildTransactionPayload={buildTransactionPayload}
            />
            {brandForAdd && (
              <POSQuantityForm
                item={brandForAdd}
                onAdd={handleAddToCartWithQuantity}
                onCancel={() => setBrandForAdd(null)}
              />
            )}
            {editingCartIndex !== null && cartItems[editingCartIndex] && (
              <POSCartEditModal
                item={cartItems[editingCartIndex]}
                categories={categories}
                getProductsByCategory={getProductsByCategory}
                onSave={(newItem) => {
                  setCartItems((prev) => {
                    const next = [...prev]
                    next[editingCartIndex] = newItem
                    return next
                  })
                  setEditingCartIndex(null)
                }}
                onRemove={() => {
                  handleRemoveItem(editingCartIndex)
                  setEditingCartIndex(null)
                }}
                onCancel={() => setEditingCartIndex(null)}
              />
            )}
            <div className="pos-right-content">
              <POSCardSection
                cartItems={cartItems}
                onRemoveItem={handleRemoveItem}
                onUpdateQuantity={handleUpdateQuantity}
                onEditItem={(idx) => setEditingCartIndex(idx)}
                onAdvancePayment={handleAdvancePayment}
                onFinalPayment={handleFinalPayment}
              />
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default POSPage
