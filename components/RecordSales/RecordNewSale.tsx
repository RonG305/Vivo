// components/RecordSales/RecordNewSale.tsx

'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '../ui/button'
import { createData } from '@/lib/api'
import { API_BASE_URL, API_AUTHORIZATION } from '@/lib/constants'
import { useRouter } from 'next/navigation'

export function RecordNewSale() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string>('')
  const [saleNo, setSaleNo] = useState<string | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)

  // Grab user credentials from localStorage
  const [user, setUser] = useState<any>(null)
  useEffect(() => {
    const stored = localStorage.getItem('vivoUser')
    if (stored) setUser(JSON.parse(stored))
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setShowSuccess(false)

    try {
      if (!user) throw new Error('User not authenticated')

      // payload: adjust fields as required by your API
      const payload = {
        '@odata.etag': user.etag ?? null,
        Region_Code: user.Region_Code,
        Outlet_Code: user.Outlet_Code,
      }

      // POST new header
      const res = await createData(`${API_BASE_URL}/NewSalesHeader`, payload)
      if (!res.ok) {
        throw new Error(`Sale creation failed: ${res.status}`)
      }

      const data = await res.json()
      const newNo = data.No
      setSaleNo(newNo)
      setShowSuccess(true)

      // give user a moment to read banner, then refresh list
      setTimeout(() => {
        router.refresh()
      }, 800)
    } catch (err: any) {
      console.error('RecordNewSale error:', err)
      setError(err.message || 'An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSave} className="space-y-4">
      {error && (
        <div className="p-2 bg-red-50 text-red-800 rounded">
          {error}
        </div>
      )}

      {showSuccess && saleNo && (
        <div className="p-2 bg-green-50 text-green-800 rounded">
          Sale created successfully! New Sale No: <strong>{saleNo}</strong>
        </div>
      )}

      {/* You can insert form fields here if you need to override region/outlet choices */}

      <div className="flex space-x-2">
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Saving…' : 'Save New Sale'}
        </Button>
      </div>
    </form>
  )
}