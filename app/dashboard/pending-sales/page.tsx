// app/dashboard/pending-sales/page.tsx
import React from 'react'
import { redirect } from 'next/navigation'
import { PendingSalesList } from '@/components/PendingSales/PendingSales'
import { fetchData } from '@/lib/api'
import { API_BASE_URL } from '@/lib/constants'
import { getUserData } from '@/lib/get-user'
import { VivoSalesHeader } from '@/types'

export default async function PendingSalesPage() {
  const user = await getUserData()
  if (!user) redirect('/login')

  // build the exact URL you showed us:
  const filter = `Region_Code eq '${user.region_code}' and Outlet_Code eq '${user.outlet_code}'`
  const url = `${API_BASE_URL}/NewPendingSalesList2?$filter=${encodeURIComponent(filter)}`

  console.log('[PendingSalesPage] fetching →', url)
  const raw = await fetchData<{ value: VivoSalesHeader[] }>(url)
  console.log('[PendingSalesPage] raw fetch →', raw)

  const pending: VivoSalesHeader[] = raw.value ?? []
  return <PendingSalesList data={pending} />
}