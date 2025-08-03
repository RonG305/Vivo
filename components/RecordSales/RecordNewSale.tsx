'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '../ui/button'
import { Icon } from '@iconify/react/dist/iconify.js'
import { createData } from '@/lib/api'
import { API_BASE_URL } from '@/lib/constants'
import RecordSalesForm from './RecordSalesForm'

type Toast = {
  type: 'success' | 'error'
  message: string
}

interface SaleHeader {
  Region_Name: string
  Region_Code: string
  Outlet_Name: string
  Outlet_Code: string
}

export function RecordNewSale() {
  const router = useRouter()
  const [isCreating, setIsCreating] = useState(false)
  const [saleNo, setSaleNo] = useState<string | null>(null)
  const [header, setHeader] = useState<SaleHeader | null>(null)
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [toast, setToast] = useState<Toast | null>(null)

  // Auto‐dismiss toast after 3s
  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), 3000)
    return () => clearTimeout(timer)
  }, [toast])

  // Load user details from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('vivoUser')
    if (stored) setUser(JSON.parse(stored))
  }, [])

  // Create new sale header
  const handleCreate = async () => {
    if (!user) {
      setToast({ type: 'error', message: 'User not authenticated' })
      return
    }

    setIsCreating(true)
    try {
      const payload = {
        Region_Code: user.Region_Code,
        Outlet_Code: user.Outlet_Code,
      }

      const res = await createData(
        `${API_BASE_URL}/NewSalesHeader`,
        payload
      )
      if (!res.ok) throw new Error(`Status ${res.status}`)

      const data = await res.json()
      setSaleNo(data.No)
      setHeader({
        Region_Name: user.Region_Name,
        Region_Code: user.Region_Code,
        Outlet_Name: user.Outlet_Name,
        Outlet_Code: user.Outlet_Code,
      })
      setOpen(true)
      setToast({ type: 'success', message: `Sale created: ${data.No}` })
    } catch (err: any) {
      console.error('Failed to create sale header:', err)
      setToast({
        type: 'error',
        message: err.message || 'Failed to create sale',
      })
    } finally {
      setIsCreating(false)
    }
  }

  // Close dialog and refresh list
  const handleClose = () => {
    setOpen(false)
    setSaleNo(null)
    router.refresh()
  }

  return (
    <>
      {/* Toast / Confirmation Banner */}
      {toast && (
        <div
          className={`mb-4 p-3 rounded border text-sm ${
            toast.type === 'success'
              ? 'bg-green-50 border-green-200 text-green-800'
              : 'bg-red-50 border-red-200 text-red-800'
          }`}
        >
          {toast.message}
        </div>
      )}

      <Button onClick={handleCreate} disabled={isCreating}>
        {isCreating ? 'Creating…' : (
          <>
            <Icon
              icon="solar:add-circle-linear"
              className="text-xl text-white"
            />
            New Sale
          </>
        )}
      </Button>

      {open && saleNo && header && (
        <RecordSalesForm
          No={saleNo}
          header={header}
          onClose={handleClose}
        />
      )}
    </>
  )
}