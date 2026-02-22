import { BASE_URL, handleResponse, getAuthHeaders } from './apiClient'

/**
 * User API - Fields: id, firstName, lastName, password, address, emailAddress, mobileNumber,
 * createdDate, modifiedDate, isActive, userRoleId
 */

export async function register(data) {
  const res = await fetch(`${BASE_URL}/user/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  })
  return handleResponse(res)
}

export async function login(credentials) {
  const res = await fetch(`${BASE_URL}/user/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  })
  return handleResponse(res)
}

export async function adminCheck() {
  const res = await fetch(`${BASE_URL}/user/admin`, {
    method: 'POST',
    headers: getAuthHeaders()
  })
  return handleResponse(res)
}

export async function userCheck() {
  const res = await fetch(`${BASE_URL}/user/user`, {
    method: 'POST',
    headers: getAuthHeaders()
  })
  return handleResponse(res)
}

export async function getAllPage(params = {}) {
  const { pageNumber = 1, pageSize = 10, status } = params
  const searchParams = new URLSearchParams({
    pageNumber: String(pageNumber),
    pageSize: String(pageSize)
  })
  if (status !== undefined && status !== null) searchParams.set('status', String(status))
  const res = await fetch(`${BASE_URL}/user/getAllPage?${searchParams}`, {
    method: 'GET',
    headers: getAuthHeaders()
  })
  return handleResponse(res)
}

export async function getByName(firstName, lastName) {
  const params = new URLSearchParams()
  if (firstName) params.set('firstName', firstName)
  if (lastName) params.set('lastName', lastName)
  const res = await fetch(`${BASE_URL}/user/getByName?${params}`, {
    method: 'GET',
    headers: getAuthHeaders()
  })
  return handleResponse(res)
}

export async function getById(id) {
  const res = await fetch(`${BASE_URL}/user/getById?id=${id}`, {
    method: 'GET',
    headers: getAuthHeaders()
  })
  return handleResponse(res)
}

export async function getByRole(userRole) {
  const res = await fetch(`${BASE_URL}/user/getByRole?userRole=${encodeURIComponent(userRole)}`, {
    method: 'GET',
    headers: getAuthHeaders()
  })
  return handleResponse(res)
}

export async function getByEmailAddress(emailAddress) {
  const res = await fetch(`${BASE_URL}/user/getByEmailAddress?emailAddress=${encodeURIComponent(emailAddress)}`, {
    method: 'GET',
    headers: getAuthHeaders()
  })
  return handleResponse(res)
}

export async function update(data) {
  const res = await fetch(`${BASE_URL}/user/update`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  })
  return handleResponse(res)
}

export async function updateStatus(id, isActive) {
  const res = await fetch(`${BASE_URL}/user/updateStatus?id=${id}&isActive=${isActive}`, {
    method: 'PUT',
    headers: getAuthHeaders()
  })
  return handleResponse(res)
}

export async function updatePassword(data) {
  const res = await fetch(`${BASE_URL}/user/updatePassword`, {
    method: 'PUT',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  })
  return handleResponse(res)
}
