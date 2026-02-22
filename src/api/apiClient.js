import { BASE_URL } from './config'

/**
 * Standard backend response shape: { status, errorCode, errorDescription, responseDto }
 */
export function handleResponse(res) {
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

/**
 * Headers for authenticated requests (includes JWT).
 */
export function getAuthHeaders() {
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('accessToken') : null
  const headers = { 'Content-Type': 'application/json' }
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }
  return headers
}

export { BASE_URL }
