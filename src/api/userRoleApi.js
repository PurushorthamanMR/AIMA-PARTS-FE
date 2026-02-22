import { BASE_URL, handleResponse, getAuthHeaders } from './apiClient'

/**
 * UserRole API - Fields: id, userRole, isActive
 */

export async function save(data) {
  const res = await fetch(`${BASE_URL}/userRole/save`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  })
  return handleResponse(res)
}

export async function getAll() {
  const res = await fetch(`${BASE_URL}/userRole/getAll`, {
    method: 'GET',
    headers: getAuthHeaders()
  })
  return handleResponse(res)
}
