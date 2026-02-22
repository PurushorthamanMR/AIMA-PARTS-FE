import { BASE_URL, handleResponse, getAuthHeaders } from './apiClient'

/**
 * TransactionDetails API - Fields: id, productId, quantity, transactionId, isActive
 */

export async function save(data) {
  const res = await fetch(`${BASE_URL}/transactionDetails/save`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  })
  return handleResponse(res)
}

export async function update(data) {
  const res = await fetch(`${BASE_URL}/transactionDetails/update`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  })
  return handleResponse(res)
}

export async function updateStatus(id, isActive) {
  const res = await fetch(`${BASE_URL}/transactionDetails/updateStatus?id=${id}&isActive=${isActive}`, {
    method: 'PUT',
    headers: getAuthHeaders()
  })
  return handleResponse(res)
}
