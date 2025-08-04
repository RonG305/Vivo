'use client'

import React, { useEffect, useState, useTransition } from 'react'
import { Button } from '../ui/button'
import { createSalesHeader } from './actions'
import { useRouter } from 'next/navigation'
import RecordSalesForm from './RecordSalesForm'
import type { VivoSalesHeader, VivoUserSessionDetails } from '@/types'

/**
 * Minimum header fields needed both to create a new header
 * and to pass into RecordSalesForm afterward.
 */
type NewHeaderFields = Pick<
  VivoSalesHeader,
  '@odata.etag' | 'Region_Code' | 'Outlet_Code' | 'Region_Name' | 'Outlet_Name'
>

export default function CreateNewHeaderCopy() {
  const [isPending, startTransition] = useTransition()
  const [actionState, formAction] = React.useActionState(createSalesHeader, null)
  const router = useRouter()

  // holds the brand-new header once created
  const [createdHeader, setCreatedHeader] = useState<VivoSalesHeader | null>(
    null
  )

  // initial form values come from the stored session
  const [formData, setFormData] = useState<NewHeaderFields>({
    '@odata.etag': '',
    Region_Code: '',
    Outlet_Code: '',
    Region_Name: '',
    Outlet_Name: '',
  })

  // hydrate from localStorage (your VivoUserSessionDetails shape)
  useEffect(() => {
    const stored = localStorage.getItem('vivoUser')
    if (!stored) return

    try {
      const vivoUser = JSON.parse(stored) as VivoUserSessionDetails

      setFormData({
        '@odata.etag': vivoUser['@odata.etag'] || '',
        Region_Code: vivoUser.region_code,
        Outlet_Code: vivoUser.outlet_code,
        Region_Name: vivoUser.region,
        Outlet_Name: vivoUser.outlet,
      })
    } catch (err) {
      console.error('Error parsing vivoUser:', err)
    }
  }, [])

  // when the action completes successfully, cache the new header
  useEffect(() => {
    if (actionState?.success && actionState.data) {
      setCreatedHeader(actionState.data as VivoSalesHeader)
      router.refresh()
    }
  }, [actionState, router])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    startTransition(() => {
      formAction(new FormData(e.currentTarget))
    })
  }

  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 mt-4"
      >
        {/* hidden inputs for the unbound createSalesHeader action */}
        <input
          type="hidden"
          name="@odata.etag"
          value={formData['@odata.etag']}
        />
        <input
          type="hidden"
          name="Region_Code"
          value={formData.Region_Code}
        />
        <input
          type="hidden"
          name="Outlet_Code"
          value={formData.Outlet_Code}
        />

        <Button type="submit" disabled={isPending}>
          {isPending ? 'Submitting...' : 'Add New Sale'}
        </Button>
      </form>

      {/* once created, open the RecordSalesForm with the new header */}
      {createdHeader && (
        <RecordSalesForm
          header={createdHeader}
          No={createdHeader.No}
          onClose={() => setCreatedHeader(null)}
        />
      )}
    </>
  )
}