import { BASE_URL, handleResponse, getAuthHeaders } from './apiClient'

/**
 * UserLogs API - Fields: id, action, timestamp, userId
 */

export async function save(data) {
  const res = await fetch(`${BASE_URL}/userLogs/save`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  })
  return handleResponse(res)
}

export async function getAll(params = {}) {
  const { pageNumber = 1, pageSize = 10 } = params
  const searchParams = new URLSearchParams({
    pageNumber: String(pageNumber),
    pageSize: String(pageSize)
  })
  const res = await fetch(`${BASE_URL}/userLogs/getAll?${searchParams}`, {
    method: 'GET',
    headers: getAuthHeaders()
  })
  return handleResponse(res)
}
