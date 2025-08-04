// app/dashboard/pending-sales/page.tsx

import React from 'react'
import { redirect } from 'next/navigation'
import { fetchData } from '@/lib/api'
import { API_BASE_URL } from '@/lib/constants'
import { getUserData } from '@/lib/get-user'
import PendingSalesList from '@/components/PendingSales/PendingSalesList'
import type { VivoSalesHeader } from '@/types'

const page = async () => {
  // 1) Grab the logged-in user
  const user = await getUserData()

  // 2) If there's no session, kick them to login
  if (!user) {
    redirect('/login')
  }

  // 3) Fetch pending sales filtered by region & outlet
  const { value: pending = [] } = await fetchData<{ value: VivoSalesHeader[] }>(
    `${API_BASE_URL}/NewPendingSalesList2` +
      `?$filter=Region_Code eq '${encodeURIComponent(user.region_code)}'` +
      ` and Outlet_Code eq '${encodeURIComponent(user.outlet_code)}'`
  )

  // 4) Render your list
  return <PendingSalesList data={pending} />
}

export default page