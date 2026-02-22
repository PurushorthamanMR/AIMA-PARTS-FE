import { BASE_URL, handleResponse, getAuthHeaders } from './apiClient'

/**
 * ProductCategory API - Fields: id, name, isActive
 */

export async function getAll() {
  const res = await fetch(`${BASE_URL}/productCategory/getAll`, {
    method: 'GET',
    headers: getAuthHeaders()
  })
  return handleResponse(res)
}

export async function getAllPage(params = {}) {
  const { pageNumber = 1, pageSize = 10 } = params
  const searchParams = new URLSearchParams({
    pageNumber: String(pageNumber),
    pageSize: String(pageSize)
  })
  const res = await fetch(`${BASE_URL}/productCategory/getAllPage?${searchParams}`, {
    method: 'GET',
    headers: getAuthHeaders()
  })
  return handleResponse(res)
}

export async function getByName(name) {
  const res = await fetch(`${BASE_URL}/productCategory/getByName?name=${encodeURIComponent(name)}`, {
    method: 'GET',
    headers: getAuthHeaders()
  })
  return handleResponse(res)
}

export async function save(data) {
  const res = await fetch(`${BASE_URL}/productCategory/save`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  })
  return handleResponse(res)
}

export async function update(data) {
  const res = await fetch(`${BASE_URL}/productCategory/update`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  })
  return handleResponse(res)
}

export async function updateStatus(id, isActive) {
  const res = await fetch(`${BASE_URL}/productCategory/updateStatus?id=${id}&isActive=${isActive}`, {
    method: 'PUT',
    headers: getAuthHeaders()
  })
  return handleResponse(res)
}
