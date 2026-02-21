import POSHeader from '../components/POSHeader'
import POSSidebar from '../components/POSSidebar'
import '../styles/POSPage.css'

function POSPage() {
  return (
    <div className="pos-page">
      <POSHeader />
      <div className="pos-layout">
        <POSSidebar />
        <main className="pos-main" />
      </div>
    </div>
  )
}

export default POSPage
