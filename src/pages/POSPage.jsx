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
import { getCategories, getProductsByCategory, getPaymentMethods, saveTransaction } from '../api/posApi'
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
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [sectionIndex, setSectionIndex] = useState(0)
  const [cartItems, setCartItems] = useState([])
  const [selectedPendingTransaction, setSelectedPendingTransaction] = useState(null)
  const [showAdvanceModal, setShowAdvanceModal] = useState(false)
  const [showFinalModal, setShowFinalModal] = useState(false)
  const [brandForAdd, setBrandForAdd] = useState(null)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        setError(null)
        const [cats, pms] = await Promise.all([getCategories(), getPaymentMethods()])
        const filtered = Array.isArray(cats) ? cats.filter((c) => !EXCLUDED_CATEGORIES.includes(c.productCategoryName)) : []
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
    if (!selectedCategory?.productCategoryName) return
    const load = async () => {
      if (useMockData) {
        const mock = MOCK_PRODUCTS_BY_CATEGORY[selectedCategory.productCategoryName] || []
        setProducts(mock)
        return
      }
      try {
        const res = await getProductsByCategory(selectedCategory.productCategoryName)
        const content = res?.content || []
        setProducts(content.length > 0 ? content : MOCK_PRODUCTS_BY_CATEGORY[selectedCategory.productCategoryName] || [])
      } catch (err) {
        const mock = MOCK_PRODUCTS_BY_CATEGORY[selectedCategory.productCategoryName] || []
        setProducts(mock)
      }
    }
    load()
  }, [selectedCategory?.productCategoryName, useMockData])

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return categories
    const q = searchQuery.toLowerCase()
    return categories.filter((c) => (c.productCategoryName || '').toLowerCase().includes(q))
  }, [categories, searchQuery])

  const filteredProducts = useMemo(() => {
    if (!searchQuery.trim()) return products
    const q = searchQuery.toLowerCase()
    return products.filter((p) => (p.name || '').toLowerCase().includes(q))
  }, [products, searchQuery])

  const brands = useMemo(() => {
    if (!selectedProduct?.name) return []
    const mockBrands = MOCK_BRANDS_BY_PRODUCT[selectedProduct.name]
    if (mockBrands && mockBrands.length > 0) return mockBrands
    return products.filter((p) => (p.name || '').toLowerCase() === (selectedProduct.name || '').toLowerCase())
  }, [products, selectedProduct?.name])

  const filteredBrands = useMemo(() => {
    if (!searchQuery.trim()) return brands
    const q = searchQuery.toLowerCase()
    return brands.filter((b) => (b.name || '').toLowerCase().includes(q))
  }, [brands, searchQuery])

  const displayItems = viewMode === 'categories' ? filteredCategories : viewMode === 'products' ? filteredProducts : filteredBrands
  const totalSections = Math.ceil(displayItems.length / ITEMS_PER_SECTION) || 1
  const canGoNext = sectionIndex < totalSections - 1
  const canGoPrevious = sectionIndex > 0

  const handleCategoryClick = (cat) => {
    setSelectedCategory(cat)
    setSelectedProduct(null)
    setViewMode('products')
    setSectionIndex(0)
  }

  const handleProductClick = (prod) => {
    setSelectedProduct(prod)
    setViewMode('brands')
    setSectionIndex(0)
  }

  const handleBrandClick = (item) => {
    setBrandForAdd(item)
  }

  const handleAddToCartWithQuantity = (itemWithQty) => {
    setCartItems((prev) => {
      const existing = prev.findIndex((i) => i.id === itemWithQty.id)
      const qty = itemWithQty.quantity || 1
      if (existing >= 0) {
        const next = [...prev]
        next[existing] = { ...next[existing], quantity: (next[existing].quantity || 1) + qty }
        return next
      }
      return [...prev, { ...itemWithQty, quantity: qty }]
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
    const taxAmount = cartItems.reduce((sum, item) => {
      const taxPct = (item.taxDto?.taxPercentage || 0) / 100
      return sum + (item.pricePerUnit || 0) * (item.quantity || 1) * taxPct
    }, 0)
    const totalAmount = subtotal + taxAmount
    const userId = parseInt(localStorage.getItem('userId'), 10)
    const paymentAmount = amount ?? totalAmount
    const isAdvance = amount != null && amount < totalAmount
    const balanceAmount = isAdvance ? totalAmount - paymentAmount : 0

    return {
      customerDto: { id: customer?.id },
      userDto: { id: userId || 1 },
      totalAmount,
      balanceAmount,
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
      const transaction = await saveTransaction(payload)
      const advanceAmount = payload.transactionPaymentMethod?.[0]?.amount || 0
      const subtotal = cartItems.reduce((sum, item) => sum + (item.pricePerUnit || 0) * (item.quantity || 1), 0)
      const taxAmount = cartItems.reduce((sum, item) => {
        const taxPct = (item.taxDto?.taxPercentage || 0) / 100
        return sum + (item.pricePerUnit || 0) * (item.quantity || 1) * taxPct
      }, 0)
      const totalAmount = subtotal + taxAmount
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
      const transaction = await saveTransaction(payload)
      const subtotal = cartItems.reduce((sum, item) => sum + (item.pricePerUnit || 0) * (item.quantity || 1), 0)
      const taxAmount = cartItems.reduce((sum, item) => {
        const taxPct = (item.taxDto?.taxPercentage || 0) / 100
        return sum + (item.pricePerUnit || 0) * (item.quantity || 1) * taxPct
      }, 0)
      const totalAmount = subtotal + taxAmount
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
    setSelectedProduct(null)
    setViewMode('categories')
    setSectionIndex(0)
  }

  const handleBackToProducts = () => {
    setSelectedProduct(null)
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
                    <span>{selectedCategory?.productCategoryName}</span>
                  ) : (
                    <button type="button" onClick={handleBackToProducts}>
                      {selectedCategory?.productCategoryName}
                    </button>
                  )}
                  {viewMode === 'brands' && (
                    <>
                      <span className="pos-breadcrumb-sep">›</span>
                      <span>{selectedProduct?.name}</span>
                    </>
                  )}
                </div>
              )}
              <POSCategoriesSection
                viewMode={viewMode}
                items={displayItems}
                selectedCategory={selectedCategory}
                selectedProduct={selectedProduct}
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
              totalAmount={
                cartItems.reduce((sum, item) => sum + (item.pricePerUnit || 0) * (item.quantity || 1), 0) +
                cartItems.reduce((sum, item) => {
                  const taxPct = (item.taxDto?.taxPercentage || 0) / 100
                  return sum + (item.pricePerUnit || 0) * (item.quantity || 1) * taxPct
                }, 0)
              }
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
            <div className="pos-right-content">
              <POSCardSection
                cartItems={cartItems}
                onRemoveItem={handleRemoveItem}
                onUpdateQuantity={handleUpdateQuantity}
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
