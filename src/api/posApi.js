import { BASE_URL } from './config'

function handleResponse(res) {
  return res.json().then((data) => {
    if (!res.ok) {
      const message = data?.errorDescription || res.statusText || 'Request failed'
      throw new Error(message)
    }
    if (data.status === false) {
      throw new Error(data.errorDescription || 'Request failed')
    }
    return data.responseDto
  })
}

function getAuthHeaders() {
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('accessToken') : null
  const headers = { 'Content-Type': 'application/json' }
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }
  return headers
}

/**
 * GET /productCategory/getAll - all categories
 */
export async function getCategories() {
  const res = await fetch(`${BASE_URL}/productCategory/getAll`, {
    method: 'GET',
    headers: getAuthHeaders()
  })
  return handleResponse(res)
}

/**
 * GET /product/getByProductCategoryName - products by category
 * Note: Search/filter by product name is done client-side
 */
export async function getProductsByCategory(categoryName, pageNumber = 1, pageSize = 500) {
  const params = new URLSearchParams({
    categoryName,
    pageNumber: String(pageNumber),
    pageSize: String(pageSize)
  })
  const res = await fetch(`${BASE_URL}/product/getByProductCategoryName?${params}`, {
    method: 'GET',
    headers: getAuthHeaders()
  })
  return handleResponse(res)
}

/**
 * GET /paymentMethod/getAll - all payment methods
 */
export async function getPaymentMethods() {
  const res = await fetch(`${BASE_URL}/paymentMethod/getAll`, {
    method: 'GET',
    headers: getAuthHeaders()
  })
  return handleResponse(res)
}

/**
 * GET /customer/getAll - all customers
 */
export async function getCustomers() {
  const res = await fetch(`${BASE_URL}/customer/getAll`, {
    method: 'GET',
    headers: getAuthHeaders()
  })
  return handleResponse(res)
}

/**
 * POST /transaction/save - save transaction
 */
export async function saveTransaction(payload) {
  const res = await fetch(`${BASE_URL}/transaction/save`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload)
  })
  return handleResponse(res)
}

/**
 * POST /customer/save - save new customer
 */
export async function saveCustomer(payload) {
  const res = await fetch(`${BASE_URL}/customer/save`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(payload)
  })
  return handleResponse(res)
}

/**
 * GET /transaction/getAllPage - get transactions (filter pending client-side)
 */
export async function getTransactions(pageNumber = 1, pageSize = 50) {
  const params = new URLSearchParams({
    pageNumber: String(pageNumber),
    pageSize: String(pageSize)
  })
  const res = await fetch(`${BASE_URL}/transaction/getAllPage?${params}`, {
    method: 'GET',
    headers: getAuthHeaders()
  })
  return handleResponse(res)
}

/**
 * GET /customer/getByName - search customers by name
 */
export async function searchCustomers(name) {
  const params = new URLSearchParams({ name: name || '' })
  const res = await fetch(`${BASE_URL}/customer/getByName?${params}`, {
    method: 'GET',
    headers: getAuthHeaders()
  })
  return handleResponse(res)
}
