import { BASE_URL, handleResponse, getAuthHeaders } from './apiClient'

/**
 * AdminSettings API - Fields: id, action, isActive
 */

export async function save(data) {
  const res = await fetch(`${BASE_URL}/adminSettings/save`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  })
  return handleResponse(res)
}

export async function update(data) {
  const res = await fetch(`${BASE_URL}/adminSettings/update`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  })
  return handleResponse(res)
}

export async function getAll() {
  const res = await fetch(`${BASE_URL}/adminSettings/getAll`, {
    method: 'GET',
    headers: getAuthHeaders()
  })
  return handleResponse(res)
}

export async function updateStatus(id, isActive) {
  const res = await fetch(`${BASE_URL}/adminSettings/updateStatus?id=${id}&isActive=${isActive}`, {
    method: 'PUT',
    headers: getAuthHeaders()
  })
  return handleResponse(res)
}
