import { BASE_URL, handleResponse, getAuthHeaders } from './apiClient'

/**
 * Product API - Fields: id, name, brandId, productCategoryId, price, quantity, lowStock, isActive
 */

export async function save(data) {
  const res = await fetch(`${BASE_URL}/product/save`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  })
  return handleResponse(res)
}

export async function getAll() {
  const res = await fetch(`${BASE_URL}/product/getAll`, {
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
  const res = await fetch(`${BASE_URL}/product/getAllPage?${searchParams}`, {
    method: 'GET',
    headers: getAuthHeaders()
  })
  return handleResponse(res)
}

export async function getById(id) {
  const res = await fetch(`${BASE_URL}/product/getById?id=${id}`, {
    method: 'GET',
    headers: getAuthHeaders()
  })
  return handleResponse(res)
}

export async function getByName(name) {
  const res = await fetch(`${BASE_URL}/product/getByName?name=${encodeURIComponent(name)}`, {
    method: 'GET',
    headers: getAuthHeaders()
  })
  return handleResponse(res)
}

export async function getAllByBrand(brandId) {
  const res = await fetch(`${BASE_URL}/product/getAllByBrand?brandId=${brandId}`, {
    method: 'GET',
    headers: getAuthHeaders()
  })
  return handleResponse(res)
}

export async function getAllByCategory(productCategoryId) {
  const res = await fetch(`${BASE_URL}/product/getAllByCategory?productCategoryId=${productCategoryId}`, {
    method: 'GET',
    headers: getAuthHeaders()
  })
  return handleResponse(res)
}

export async function update(data) {
  const res = await fetch(`${BASE_URL}/product/update`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  })
  return handleResponse(res)
}

export async function updateQuantity(productId, delta) {
  const res = await fetch(`${BASE_URL}/product/updateQuantity`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify({ productId, delta })
  })
  return handleResponse(res)
}

export async function updateStatus(productId, isActive) {
  const res = await fetch(`${BASE_URL}/product/updateStatus?productId=${productId}&isActive=${isActive}`, {
    method: 'PUT',
    headers: getAuthHeaders()
  })
  return handleResponse(res)
}

export async function returnProduct(data) {
  const res = await fetch(`${BASE_URL}/product/return`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  })
  return handleResponse(res)
}
