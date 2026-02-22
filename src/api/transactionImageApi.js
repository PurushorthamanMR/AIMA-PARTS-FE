import { BASE_URL, handleResponse, getAuthHeaders } from './apiClient'

/**
 * TransactionImage API - Fields: id, transactionId, imageUrl, fileName, uploadedDateTime, isActive
 */

export async function uploadImages(formData) {
  const token = typeof localStorage !== 'undefined' ? localStorage.getItem('accessToken') : null
  const headers = {}
  if (token) headers.Authorization = `Bearer ${token}`
  const res = await fetch(`${BASE_URL}/transactionImage/uploadImages`, {
    method: 'POST',
    headers,
    body: formData
  })
  return handleResponse(res)
}

export async function getByTransactionId(transactionId) {
  const res = await fetch(`${BASE_URL}/transactionImage/getByTransactionId?transactionId=${transactionId}`, {
    method: 'GET',
    headers: getAuthHeaders()
  })
  return handleResponse(res)
}

export async function deleteImage(id) {
  const res = await fetch(`${BASE_URL}/transactionImage/deleteImage?id=${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  })
  return handleResponse(res)
}
