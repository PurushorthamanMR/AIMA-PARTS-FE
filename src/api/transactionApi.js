import { BASE_URL, handleResponse, getAuthHeaders } from './apiClient'

/**
 * Transaction API - Fields: id, transactionNo, advancePaymentAmount, advancePaymentDateTime,
 * finalPaymentAmount, finalPaymentDateTime, totalAmount, balanceAmount, paymentMethodId,
 * customerId, status (PENDING, COMPLETED, RETURNED), createdDateTime
 */

export async function savePending(data) {
  const res = await fetch(`${BASE_URL}/transaction/savePending`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  })
  return handleResponse(res)
}

export async function saveComplete(data) {
  const res = await fetch(`${BASE_URL}/transaction/saveComplete`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  })
  return handleResponse(res)
}

export async function saveFinal(data) {
  const res = await fetch(`${BASE_URL}/transaction/saveFinal`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  })
  return handleResponse(res)
}

export async function returnAndRestore(data) {
  const res = await fetch(`${BASE_URL}/transaction/returnAndRestore`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  })
  return handleResponse(res)
}

export async function update(data) {
  const res = await fetch(`${BASE_URL}/transaction/update`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: JSON.stringify(data)
  })
  return handleResponse(res)
}

export async function getById(id) {
  const res = await fetch(`${BASE_URL}/transaction/getById?id=${id}`, {
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
  const res = await fetch(`${BASE_URL}/transaction/getAllPage?${searchParams}`, {
    method: 'GET',
    headers: getAuthHeaders()
  })
  return handleResponse(res)
}

export async function getAllPageByCustomer(customerId, params = {}) {
  const { pageNumber = 1, pageSize = 10 } = params
  const searchParams = new URLSearchParams({
    customerId: String(customerId),
    pageNumber: String(pageNumber),
    pageSize: String(pageSize)
  })
  const res = await fetch(`${BASE_URL}/transaction/getAllPageByCustomer?${searchParams}`, {
    method: 'GET',
    headers: getAuthHeaders()
  })
  return handleResponse(res)
}

export async function getAllPageByStatus(status, params = {}) {
  const { pageNumber = 1, pageSize = 10 } = params
  const searchParams = new URLSearchParams({
    status: String(status),
    pageNumber: String(pageNumber),
    pageSize: String(pageSize)
  })
  const res = await fetch(`${BASE_URL}/transaction/getAllPageByStatus?${searchParams}`, {
    method: 'GET',
    headers: getAuthHeaders()
  })
  return handleResponse(res)
}

export async function getAllPageByTransactionNo(transactionNo, params = {}) {
  const { pageNumber = 1, pageSize = 10 } = params
  const searchParams = new URLSearchParams({
    transactionNo: String(transactionNo),
    pageNumber: String(pageNumber),
    pageSize: String(pageSize)
  })
  const res = await fetch(`${BASE_URL}/transaction/getAllPageByTransactionNo?${searchParams}`, {
    method: 'GET',
    headers: getAuthHeaders()
  })
  return handleResponse(res)
}

export async function getTransactionCashTotal() {
  const res = await fetch(`${BASE_URL}/transaction/getTransactionCashTotal`, {
    method: 'GET',
    headers: getAuthHeaders()
  })
  return handleResponse(res)
}

export async function getTransactionCardTotal() {
  const res = await fetch(`${BASE_URL}/transaction/getTransactionCardTotal`, {
    method: 'GET',
    headers: getAuthHeaders()
  })
  return handleResponse(res)
}

export async function getAllToday() {
  const res = await fetch(`${BASE_URL}/transaction/getAllToday`, {
    method: 'GET',
    headers: getAuthHeaders()
  })
  return handleResponse(res)
}
