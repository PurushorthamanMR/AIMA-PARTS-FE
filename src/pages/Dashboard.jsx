import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header'
import ProductList from './ProductList'
import NewProduct from './NewProduct'
import LowStocks from './LowStocks'
import Brand from './Brand'
import NewBrand from './NewBrand'
import Category from './Category'
import NewCategory from './NewCategory'
import TransactionReport from './TransactionReport'
import CustomerList from './CustomerList'
import NewCustomer from './NewCustomer'
import UserList from './UserList'
import NewUser from './NewUser'
import Discount from './Discount'
import NewDiscount from './NewDiscount'
import DailyReport from './DailyReport'
import MonthlyReport from './MonthlyReport'
import '../styles/Dashboard.css'

function Dashboard() {
  const location = useLocation()
  const navigate = useNavigate()
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false)

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed)
  }

  const handleNavigation = (path) => {
    navigate(path)
  }

  // Determine current page based on route
  const getCurrentPage = () => {
    const path = location.pathname
    if (path === '/dashboard') return 'Dashboard'
    if (path === '/products/new') return 'NewProduct'
    if (path === '/products') return 'Products'
    if (path === '/low-stocks') return 'Low Stocks'
    if (path === '/brand/new') return 'NewBrand'
    if (path === '/brand') return 'Brand'
    if (path === '/category/new') return 'NewCategory'
    if (path === '/category') return 'Category'
    if (path === '/discount/new') return 'NewDiscount'
    if (path === '/discount') return 'Discount'
    if (path === '/transaction') return 'Transaction'
    if (path === '/customers/new') return 'NewCustomer'
    if (path === '/customers') return 'Customers'
    if (path === '/users/new') return 'NewUser'
    if (path === '/users') return 'Users'
    return 'Dashboard'
  }

  const currentPage = getCurrentPage()

  return (
    <div className={`dashboard-container ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
      <Header 
        onToggleSidebar={handleToggleSidebar}
        isSidebarCollapsed={isSidebarCollapsed}
      />
      <div className="dashboard-content">
        <Sidebar 
          onNavigate={handleNavigation} 
          currentPage={currentPage}
          isCollapsed={isSidebarCollapsed}
        />
        <main className="dashboard-main">
          {currentPage === 'Dashboard' && <div className="dashboard-content-wrapper" />}
          {currentPage === 'Products' && (
            <ProductList onAddNew={() => handleNavigation('/products/new')} />
          )}
          {currentPage === 'NewProduct' && (
            <NewProduct 
              onBack={() => handleNavigation('/products')}
              onSave={() => handleNavigation('/products')}
            />
          )}
          {currentPage === 'Low Stocks' && <LowStocks />}
          {currentPage === 'Brand' && <Brand />}
          {currentPage === 'NewBrand' && <NewBrand />}
          {currentPage === 'Category' && <Category />}
          {currentPage === 'NewCategory' && <NewCategory />}
          {currentPage === 'Discount' && <Discount />}
          {currentPage === 'NewDiscount' && <NewDiscount />}
          {currentPage === 'Transaction' && <TransactionReport />}
          {currentPage === 'Daily Report' && <DailyReport />}
          {currentPage === 'Monthly Report' && <MonthlyReport />}
          {currentPage === 'Customers' && <CustomerList />}
          {currentPage === 'NewCustomer' && <NewCustomer />}
          {currentPage === 'Users' && <UserList />}
          {currentPage === 'NewUser' && <NewUser />}
        </main>
      </div>
    </div>
  )
}

export default Dashboard
