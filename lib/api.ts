import { API_AUTHORIZATION } from './constants'
import { endpoints } from './endpoints'

export interface ApprovalResult {
  SN: number
  Code: string
}

/**
 * Generic GET helper with no-store caching and automatic Basic auth.
 */
export async function fetchData<T = any>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const res = await fetch(url, {
    method: options.method || 'GET',
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      Authorization: API_AUTHORIZATION,
      ...(options.headers || {}),
    },
    ...options,
  })

  if (!res.ok) {
    console.error(`[fetchData] HTTP ${res.status}:`, await res.text())
    throw new Error(`fetchData failed: ${res.status}`)
  }

  return res.json()
}

/**
 * Generic POST helper with no-store caching and automatic Basic auth.
 * Returns {} for 204 No Content.
 */
export async function createData<T = any, U = any>(
  url: string,
  payload: T,
  options: RequestInit = {}
): Promise<U> {
  const res = await fetch(url, {
    method: options.method || 'POST',
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      Authorization: API_AUTHORIZATION,
      ...(options.headers || {}),
    },
    body: JSON.stringify(payload),
    ...options,
  })

  if (!res.ok) {
    console.error(`[createData] HTTP ${res.status}:`, await res.text())
    throw new Error(`createData failed: ${res.status}`)
  }

  if (res.status === 204) {
    return {} as U
  }

  return res.json()
}

/**
 * Generic PATCH helper with no-store caching and automatic Basic auth.
 * Returns {} for 204 No Content.
 */
export async function updateData<T = any, U = any>(
  url: string,
  payload: T,
  options: RequestInit = {}
): Promise<U> {
  const res = await fetch(url, {
    method: options.method || 'PATCH',
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      Authorization: API_AUTHORIZATION,
      ...(options.headers || {}),
    },
    body: JSON.stringify(payload),
    ...options,
  })

  if (!res.ok) {
    console.error(`[updateData] HTTP ${res.status}:`, await res.text())
    throw new Error(`updateData failed: ${res.status}`)
  }

  if (res.status === 204) {
    return {} as U
  }

  return res.json()
}

/**
 * Generic DELETE helper with no-store caching and automatic Basic auth.
 * Returns {} for 204 No Content.
 */
export async function deleteData<U = any>(
  url: string,
  options: RequestInit = {}
): Promise<U> {
  const res = await fetch(url, {
    method: options.method || 'DELETE',
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
      Authorization: API_AUTHORIZATION,
      ...(options.headers || {}),
    },
    ...options,
  })

  if (!res.ok) {
    console.error(`[deleteData] HTTP ${res.status}:`, await res.text())
    throw new Error(`deleteData failed: ${res.status}`)
  }

  if (res.status === 204) {
    return {} as U
  }

  return res.json()
}

/**
 * Invoke the unbound SendRequestForApproval OData action.
 * Passes the sales document number as `{ Code: <no> }` in the JSON body,
 * and optionally includes an If-Match header for concurrency control.
 */
export async function submitForApproval(
  code: string,
  etag?: string
): Promise<ApprovalResult> {
  const url = endpoints.sendRequestForApproval()
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Authorization: API_AUTHORIZATION,
    ...(etag ? { 'If-Match': etag } : {}),
  }

  const res = await fetch(url, {
    method: 'POST',
    cache: 'no-store',
    headers,
    body: JSON.stringify({ Code: code }),
  })

  if (!res.ok) {
    const text = await res.text()
    console.error(`[submitForApproval] HTTP ${res.status}:`, text)
    throw new Error(`submitForApproval failed (${res.status}): ${text}`)
  }

  if (res.status === 204) {
    return {} as ApprovalResult
  }

  return res.json()
}