import { BASE_URL, handleResponse, getAuthHeaders } from './apiClient'

/**
 * Customer API - Fields: id, name, mobileNumber, isActive
 */

export async function save(data) {
  const res = await fetch(`${BASE_URL}/customer/save`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  })
  return handleResponse(res)
}

export async function getAll() {
  const res = await fetch(`${BASE_URL}/customer/getAll`, {
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
  const res = await fetch(`${BASE_URL}/customer/getAllPage?${searchParams}`, {
    method: 'GET',
    headers: getAuthHeaders()
  })
  return handleResponse(res)
}

export async function getById(id) {
  const res = await fetch(`${BASE_URL}/customer/getById?id=${id}`, {
    method: 'GET',
    headers: getAuthHeaders()
  })
  return handleResponse(res)
}

export async function getByName(name) {
  const res = await fetch(`${BASE_URL}/customer/getByName?name=${encodeURIComponent(name)}`, {
    method: 'GET',
    headers: getAuthHeaders()
  })
  return handleResponse(res)
}

export async function getByMobileNumber(mobileNumber) {
  const res = await fetch(`${BASE_URL}/customer/getByMobileNumber?mobileNumber=${encodeURIComponent(mobileNumber)}`, {
    method: 'GET',
    headers: getAuthHeaders()
  })
  return handleResponse(res)
}

export async function update(data) {
  const res = await fetch(`${BASE_URL}/customer/update`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  })
  return handleResponse(res)
}

export async function updateStatus(id, isActive) {
  const res = await fetch(`${BASE_URL}/customer/updateStatus?id=${id}&isActive=${isActive}`, {
    method: 'PUT',
    headers: getAuthHeaders()
  })
  return handleResponse(res)
}
